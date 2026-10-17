#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { buildProductCards } = require('../lib/product-catalog.cjs');
const { validateProductSnapshot } = require('../lib/product-release-data.cjs');
const { describeChanges } = require('./refresh-product-releases.js');

const SNAPSHOT_URL = 'https://hyphentech.top/product-releases.json';

async function checkLiveProductUpdates({ fetchImpl = globalThis.fetch, currentProducts = () =>
  buildProductCards([], { strict: true, token: process.env.GITHUB_TOKEN }) } = {}) {
  const response = await fetchImpl(`${SNAPSHOT_URL}?checked=${Date.now()}`, {
    headers: { 'Cache-Control': 'no-cache', 'User-Agent': 'hyphentech-product-watch' },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`官网发行快照读取失败：HTTP ${response.status}`);
  const previous = validateProductSnapshot(await response.json());
  const products = await currentProducts();
  const changes = describeChanges(previous, products);
  return { changed: changes.length > 0, changes, checkedAt: previous.checkedAt };
}

async function main() {
  const report = await checkLiveProductUpdates();
  for (const change of report.changes) {
    console.log(`↻ ${change.name}：${change.before || '无快照'} → ${change.after}；${change.fields.join('、')}`);
  }
  if (!report.changed) console.log('✅ 官网软件信息与公开发行一致，本次不重复构建和部署');
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `should_deploy=${report.changed}\n`);
  }
}

if (require.main === module) main().catch((error) => {
  console.error(`❌ 定时软件版本检查失败：${error.message}`);
  process.exitCode = 1;
});

module.exports = { checkLiveProductUpdates };
