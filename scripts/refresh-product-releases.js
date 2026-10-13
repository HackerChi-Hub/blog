#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const { buildProductCards } = require('../lib/product-catalog.cjs');
const { fingerprint } = require('../lib/product-fingerprint.cjs');
const { cachePath, readProductSnapshot, validateProductSnapshot } = require('../lib/product-release-data.cjs');

const HELP = `用法：node scripts/refresh-product-releases.js [--check | --dry-run] [--json] [--fail-on-change]
  默认：从已登记的 GitHub 公开发行库核验并原子更新本地快照。
  --check / --dry-run：显示差异，不写文件、不发布。
  --json：输出机器可读报告。
  --fail-on-change：发现内容差异返回 2，适合外部检查器（只用于检查模式）。
  --help：显示本说明。
更新首页、产品页、文章推荐的本地预览：npm run build
只在官网刷新软件信息、不读取本地草稿：npm run products:publish`;

function parseArgs(args) {
  const known = ['--check', '--dry-run', '--json', '--fail-on-change', '--help'];
  for (const arg of args) if (!known.includes(arg)) throw new Error(`不支持的参数：${arg}`);
  const check = args.includes('--check') || args.includes('--dry-run');
  if (args.includes('--fail-on-change') && !check) throw new Error('--fail-on-change 只能用于检查模式');
  return { check, json: args.includes('--json'), failOnChange: args.includes('--fail-on-change'), help: args.includes('--help') };
}

function describeChanges(previous, products) {
  return products.flatMap((product) => {
    const before = previous?.products.find((item) => item.releaseRepo === product.releaseRepo);
    if (!before) return [{ repo: product.releaseRepo, name: product.name, before: null, after: product.version, fields: ['首次建立快照'] }];
    if (fingerprint(before) === fingerprint(product)) return [];
    const fields = [];
    if (before.version !== product.version || before.prerelease !== product.prerelease) fields.push('公开版本');
    if (before.updateSummary !== product.updateSummary || before.releaseNotesHash !== product.releaseNotesHash) fields.push('发行说明');
    if (fingerprint(before.platforms) !== fingerprint(product.platforms)) fields.push('各平台版本或安装包');
    if (!fields.length) fields.push('产品介绍或发行元数据');
    return [{ repo: product.releaseRepo, name: product.name, before: before.version, after: product.version, fields }];
  });
}

function writeSnapshotAtomic(filePath, snapshot, fileSystem = fs) {
  const temporary = path.join(path.dirname(filePath), `.${path.basename(filePath)}.${randomUUID()}.tmp`);
  try {
    fileSystem.writeFileSync(temporary, `${JSON.stringify(snapshot, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
    fileSystem.renameSync(temporary, filePath);
  } finally {
    if (fileSystem.existsSync(temporary)) fileSystem.unlinkSync(temporary);
  }
}

async function syncProducts({ check = false, filePath = cachePath, fetchImpl = globalThis.fetch, token = process.env.GITHUB_TOKEN, now = () => new Date().toISOString(), fileSystem = fs } = {}) {
  if (process.env.PRODUCT_RELEASES_OFFLINE === '1') throw new Error('不能离线假定软件版本为最新');
  const previous = readProductSnapshot(filePath);
  const products = await buildProductCards([], { strict: true, fetchImpl, token });
  const checkedAt = now();
  for (const product of products) product.checkedAt = checkedAt;
  const snapshot = { schemaVersion: 1, checkedAt, contentHash: fingerprint(products), products };
  validateProductSnapshot(snapshot);
  const changes = describeChanges(previous, products);
  // 每次实际联网核验后刷新核验时间，但时间变化不算发行内容变更。
  if (!check) writeSnapshotAtomic(filePath, snapshot, fileSystem);
  return { mode: check ? 'check' : 'update', changed: changes.length > 0, written: !check, changes, snapshot };
}

async function main(args = process.argv.slice(2)) {
  const options = parseArgs(args);
  if (options.help) { console.log(HELP); return 0; }
  const report = await syncProducts(options);
  if (options.json) console.log(JSON.stringify(report, null, 2));
  else {
    for (const product of report.snapshot.products) console.log(`✅ ${product.name} ${product.version}：${product.platforms.map((item) => `${item.platform} ${item.version}`).join('；')}`);
    for (const change of report.changes) console.log(`↻ ${change.name}：${change.before || '无快照'} → ${change.after}；${change.fields.join('、')}`);
    if (!report.changed) console.log(options.check ? '✅ 发行内容没有变化，本次联网核验通过' : '✅ 发行内容没有变化；仅核验时间刷新，不制造版本变化或 Git 提交');
    console.log(options.check ? '🔎 仅检查，未写文件、未部署' : '✅ 共享快照已更新；运行 npm run build 更新本地页面，或 npm run products:publish 刷新官网');
  }
  return options.failOnChange && report.changed ? 2 : 0;
}

if (require.main === module) main().then((code) => { process.exitCode = code; }).catch((error) => { console.error(`❌ 软件版本同步失败：${error.message}；旧快照保留，未发布`); process.exitCode = 1; });
module.exports = { parseArgs, describeChanges, writeSnapshotAtomic, syncProducts, main };
