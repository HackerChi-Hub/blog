#!/usr/bin/env node
'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { urlsForFile, validateManifest, buildManifest, makePlan, prepare, purge } = require('./cloudflare-cache');
const origin = 'https://hyphentech.top';
const hash = (s) => s.repeat(64);
const manifest = (files) => ({ version: 1, origin, files });
async function main() {
  assert.deepEqual(urlsForFile('index.html'), [origin + '/index.html', origin + '/']);
  assert.deepEqual(urlsForFile('en/page/1/index.html'), [origin + '/en/page/1/index.html', origin + '/en/page/1/']);
  assert.ok(urlsForFile('images/中文 图.png')[0].includes('%20'));
  assert.throws(() => validateManifest(manifest({ '../secret': hash('a') })), /非法/);
  assert.throws(() => validateManifest({ ...manifest({}), origin: 'https://other.test' }), /域名/);
  assert.throws(() => validateManifest(manifest({ 'x?secret': hash('a') })), /非法/);
  const old = manifest({ 'index.html': hash('a'), 'removed/index.html': hash('a'), 'images/same.png': hash('a'), 'images/deleted.png': hash('a') });
  const now = manifest({ 'index.html': hash('b'), 'new/index.html': hash('b'), 'images/same.png': hash('a') });
  const plan = { ...makePlan(now, old), buildId: '123-456' };
  assert.ok(plan.urls.includes(origin + '/removed/'), '下线文章也必须清缓存');
  assert.ok(plan.urls.includes(origin + '/images/deleted.png'), '下线素材也必须清缓存');
  assert.ok(plan.urls.includes(origin + '/new/'), '新页面需清除旧404缓存');
  assert.ok(!plan.urls.includes(origin + '/images/same.png'), '未变的图片保留热缓存');
  assert.equal(makePlan(now, null).bootstrap, true);
  const calls = [];
  let ready = false;
  const mock = async (url, opts) => {
    if (url.includes('/.build-id?')) { const body = ready ? '123-456' : 'old'; ready = true; return { ok: true, status: 200, text: body }; }
    assert.ok(ready);
    assert.equal(opts.headers.authorization, 'Bearer test-only');
    calls.push(JSON.parse(opts.body));
    return { ok: true, status: 200, text: JSON.stringify({ success: true, errors: [] }) };
  };
  await purge(plan, 'test-only', mock, async () => {});
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].files, plan.urls);
  calls.length = 0;
  const many = { ...plan, urls: Array.from({ length: 205 }, (_, i) => origin + '/p' + i + '/') };
  await purge(many, 'test-only', mock, async () => {});
  assert.deepEqual(calls.map((x) => x.files.length), [100, 100, 5]);
  await assert.rejects(() => purge(plan, '', mock), /缺少/);
  await assert.rejects(() => purge({ ...plan, urls: ['https://other.test/'] }, 'test-only', mock), /其它域名/);
  let writes = 0;
  await assert.rejects(() => purge(plan, 'test-only', async (url) => {
    if (!url.includes('/.build-id?')) writes++;
    return { ok: true, status: 200, text: 'old' };
  }, async () => {}), /尚未实际上线/);
  assert.equal(writes, 0);
  await assert.rejects(() => purge(plan, 'test-only', async (url) => url.includes('/.build-id?')
    ? { ok: true, status: 200, text: plan.buildId }
    : { ok: true, status: 200, text: '{"success":false}' }, async () => {}), /刷新失败/);
  let retries = 0;
  await purge(plan, 'test-only', async (url) => {
    if (url.includes('/.build-id?')) return { ok: true, status: 200, text: plan.buildId };
    return ++retries === 1 ? { ok: false, status: 429, text: '' } : { ok: true, status: 200, text: '{"success":true}' };
  }, async () => {});
  assert.equal(retries, 2);
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-cache-test-'));
  try {
    fs.mkdirSync(path.join(root, 'out'));
    fs.writeFileSync(path.join(root, 'out/index.html'), '<h1>公开首页</h1>');
    fs.writeFileSync(path.join(root, 'out/.build-id'), '123-456');
    const built = buildManifest(path.join(root, 'out'));
    assert.equal(Object.keys(built.files).length, 2);
    const first = await prepare(root, async () => ({ ok: false, status: 404 }));
    assert.equal(first.bootstrap, true);
    assert.deepEqual(buildManifest(path.join(root, 'out')), built, '清单不自引用');
    const confirmed = { ...built, deploymentRunId: '123' };
    const second = await prepare(root, async (url) => ({ ok: true, status: 200, text: JSON.stringify(url.includes('/actions/runs/') ? { status: 'completed', conclusion: 'success' } : confirmed) }));
    assert.equal(second.urls.length, 0);
    const retry = await prepare(root, async (url) => ({ ok: true, status: 200, text: JSON.stringify(url.includes('/actions/runs/') ? { status: 'completed', conclusion: 'failure' } : confirmed) }));
    assert.equal(retry.bootstrap, true, '上次刷新失败不能遗忘已删除地址');
    await assert.rejects(() => prepare(root, async () => ({ ok: false, status: 403 })), /读取上次/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
  const workflow = fs.readFileSync(path.join(__dirname, '../.github/workflows/deploy.yml'), 'utf8');
  assert.ok(workflow.indexOf('cloudflare-cache.js prepare') < workflow.indexOf('name: Deploy to gh-pages'));
  assert.ok(workflow.indexOf('cloudflare-cache.js purge') < workflow.indexOf('name: Verify live pages'));
  console.log('✅ 缓存发布回归通过：域名限制、新版等待、删除回收、图片热缓存保留、批次限流、缺凭据与失败关闭');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
