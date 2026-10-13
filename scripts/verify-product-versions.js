#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const { readProductSnapshot } = require('../lib/product-release-data.cjs');
const { fetchWithTimeout, withRetry } = require('./verify-live.js');

function auditProductVersions(html, expected) {
  const rows = [...String(html).matchAll(/<[^>]*\bdata-product-repo="([^"]+)"[^>]*\bdata-product-version="([^"]+)"[^>]*>/g)];
  return expected.flatMap((product) => {
    const matches = rows.filter((row) => row[1] === product.releaseRepo);
    if (matches.length !== 1) return [`${product.releaseRepo} 当前版本展示 ${matches.length} 次，应恰好一次`];
    return matches[0][2] === product.version ? [] : [`${product.releaseRepo} 页面版本 ${matches[0][2]} 与发行快照 ${product.version} 不一致`];
  });
}

async function main() {
  const baseIndex = process.argv.indexOf('--base');
  const base = baseIndex >= 0 ? String(process.argv[baseIndex + 1] || '').replace(/\/$/, '') : '';
  const snapshot = readProductSnapshot();
  if (!snapshot) throw new Error('缺少本次软件发行快照');
  const manifest = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../content-export/publish-manifest.json'), 'utf8'));
  const routes = ['', 'en', ...manifest.posts.map((post) => post.slug)];
  for (let index = 0; index < routes.length; index += 12) {
    await Promise.all(routes.slice(index, index + 12).map(async (route) => {
      let html;
      if (base) html = await withRetry(async () => {
        const response = await fetchWithTimeout(`${base}/${route ? `${route}/` : ''}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      }, { label: route });
      else html = fs.readFileSync(path.resolve(__dirname, '..', 'out', route, 'index.html'), 'utf8');
      const failures = auditProductVersions(html, snapshot.products);
      if (failures.length) throw new Error(`${route || '/'}：${failures.join('；')}`);
    }));
  }
  console.log(`✅ ${base ? '线上' : '导出'}软件版本验收：${routes.length} 个首页与文章页面均与同一发行快照一致，每个产品只展示一次当前版本`);
}

if (require.main === module) main().catch((error) => { console.error(`❌ 软件版本验收失败：${error.message}`); process.exit(1); });
module.exports = { auditProductVersions };
