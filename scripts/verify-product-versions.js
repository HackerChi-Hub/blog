#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const { readProductSnapshot, validateProductSnapshot } = require('../lib/product-release-data.cjs');
const { fetchWithTimeout, withRetry } = require('./verify-live.js');

function auditProductVersions(html, expected) {
  const rows = [...String(html).matchAll(/<[^>]*\bdata-product-repo="([^"]+)"[^>]*\bdata-product-version="([^"]+)"[^>]*>/g)];
  return expected.flatMap((product) => {
    const matches = rows.filter((row) => row[1] === product.releaseRepo);
    if (matches.length !== 1) return [`${product.releaseRepo} 当前版本展示 ${matches.length} 次，应恰好一次`];
    if (matches[0][2] !== product.version) return [`${product.releaseRepo} 页面版本 ${matches[0][2]} 与发行快照 ${product.version} 不一致`];
    if (product.revision && !matches[0][0].includes(`data-product-revision="${product.revision}"`)) return [`${product.releaseRepo} 的功能说明或平台安装包指纹与发行快照不一致`];
    return [];
  });
}

async function main() {
  const baseIndex = process.argv.indexOf('--base');
  const base = baseIndex >= 0 ? String(process.argv[baseIndex + 1] || '').replace(/\/$/, '') : '';
  const snapshot = readProductSnapshot();
  if (!snapshot) throw new Error('缺少本次软件发行快照');
  const publicSnapshot = base ? await withRetry(async () => {
    const response = await fetchWithTimeout(`${base}/product-releases.json`);
    if (!response.ok) throw new Error(`公开发行快照 HTTP ${response.status}`);
    const current = validateProductSnapshot(JSON.parse(await response.text()));
    if (current.contentHash !== snapshot.contentHash) throw new Error('官网发行快照尚未与本次构建一致');
    return current;
  }, { label: '公开发行快照' }) : validateProductSnapshot(JSON.parse(fs.readFileSync(path.resolve(__dirname, '../out/product-releases.json'), 'utf8')));
  if (publicSnapshot.contentHash !== snapshot.contentHash) throw new Error('导出发行快照与本次构建不一致');
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
  console.log(`✅ ${base ? '线上' : '导出'}软件版本验收：公开发行快照及 ${routes.length} 个首页与文章页面的版本、功能/安装包指纹一致，每个产品只展示一次当前版本`);
}

if (require.main === module) main().catch((error) => { console.error(`❌ 软件版本验收失败：${error.message}`); process.exit(1); });
module.exports = { auditProductVersions };
