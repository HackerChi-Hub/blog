#!/usr/bin/env node
'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const YAML = require('yaml');
const { PRODUCT_DEFINITIONS } = require('../lib/product-catalog.cjs');
const { fingerprint } = require('../lib/product-fingerprint.cjs');
const { validateProductSnapshot } = require('../lib/product-release-data.cjs');
const { syncProducts, parseArgs, writeSnapshotAtomic } = require('./refresh-product-releases.js');
const { publishProductUpdates } = require('./publish-product-updates.js');
const { auditProductVersions } = require('./verify-product-versions.js');
const { checkLiveProductUpdates } = require('./check-live-product-updates.js');

function release(repo, version, extensions = ['dmg', 'exe', 'deb']) {
  return {
    tag_name: `v${version}`, draft: false, prerelease: false,
    published_at: '2026-10-13T00:00:00Z',
    html_url: `https://github.com/${repo}/releases/tag/v${version}`,
    body: '新增本地任务执行。\n\n## 已知边界\n\n本版边界需要实测。',
    assets: extensions.map((extension, index) => ({
      id: index + 1, name: `App.${extension}`, size: 100,
      updated_at: '2026-10-13T00:00:00Z', digest: 'sha256:abc',
      browser_download_url: `https://github.com/${repo}/releases/download/v${version}/App.${extension}`,
    })),
  };
}

function fixture() {
  return Object.fromEntries(PRODUCT_DEFINITIONS.filter((item) => !item.pending)
    .map((item) => [item.releaseRepo, [release(item.releaseRepo, '1.8.0')]]));
}

function fetchFixture(records) {
  return async (url) => {
    if (!new URL(url).pathname.endsWith('/releases')) return { ok: true, json: async () => ({ private: false, visibility: 'public' }) };
    const repo = new URL(url).pathname.match(/^\/repos\/(.+)\/releases$/)?.[1];
    return { ok: true, status: 200, json: async () => records[repo], headers: { get: () => '' } };
  };
}

async function main() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-product-sync-test-'));
  const filePath = path.join(directory, 'snapshot.json');
  const records = fixture();
  const baseOptions = { filePath, fetchImpl: fetchFixture(records), token: '', now: () => '2026-10-13T01:00:00Z' };
  try {
    assert.deepEqual(parseArgs(['--dry-run', '--json']), { check: true, json: true, failOnChange: false, help: false });
    assert.throws(() => parseArgs(['--force']), /不支持/);
    assert.throws(() => parseArgs(['--fail-on-change']), /检查模式/);
    const firstCheck = await syncProducts({ ...baseOptions, check: true });
    assert.equal(firstCheck.changed, true);
    assert.equal(firstCheck.written, false);
    assert.equal(fs.existsSync(filePath), false, '首次检查也不能写盘');
    const first = await syncProducts(baseOptions);
    assert.equal(first.changed, true);
    assert.equal(first.snapshot.products.length, PRODUCT_DEFINITIONS.filter((item) => !item.pending).length);
    validateProductSnapshot(first.snapshot);
    const bytes = fs.readFileSync(filePath, 'utf8');
    const mtime = fs.statSync(filePath).mtimeMs;
    const check = await syncProducts({ ...baseOptions, check: true, now: () => '2026-10-13T02:00:00Z' });
    assert.equal(check.changed, false, '仅核验时间变化不算发行变更');
    assert.equal(check.snapshot.contentHash, first.snapshot.contentHash);
    assert.equal(fs.readFileSync(filePath, 'utf8'), bytes);
    assert.equal(fs.statSync(filePath).mtimeMs, mtime);
    assert.equal(fingerprint({ b: 2, a: 1 }), fingerprint({ a: 1, b: 2 }), '键顺序不影响指纹');
    const liveFetch = async () => ({ ok: true, json: async () => first.snapshot });
    const liveSame = await checkLiveProductUpdates({ fetchImpl: liveFetch, currentProducts: async () => first.snapshot.products });
    assert.equal(liveSame.changed, false, '同一发行内容不能触发重复部署');
    const onePlatformChanged = structuredClone(first.snapshot.products);
    onePlatformChanged[0].platforms.find((item) => item.platform === 'Windows').version = '1.8.1';
    const livePlatform = await checkLiveProductUpdates({ fetchImpl: liveFetch, currentProducts: async () => onePlatformChanged });
    assert.equal(livePlatform.changed, true, '只有 Windows 版本变化也要触发部署');
    assert.deepEqual(livePlatform.changes[0].fields, ['各平台版本或安装包']);
    await assert.rejects(() => checkLiveProductUpdates({ fetchImpl: async () => ({ ok: false, status: 503 }) }), /HTTP 503/);

    // 同一版本的后半段发行说明修改：摘要不变也必须识别。
    const repo = PRODUCT_DEFINITIONS[0].releaseRepo;
    records[repo][0].body += '\n新增限制说明。';
    const noteChange = await syncProducts({ ...baseOptions, check: true });
    assert.equal(noteChange.changed, true);
    assert.equal(noteChange.snapshot.products[0].version, first.snapshot.products[0].version);
    assert.equal(noteChange.snapshot.products[0].updateSummary, first.snapshot.products[0].updateSummary);
    assert.deepEqual(noteChange.changes[0].fields, ['发行说明']);
    await syncProducts(baseOptions);
    records[repo][0].assets[0].id = 101;
    records[repo][0].assets[0].digest = 'sha256:changed';
    records[repo][0].assets[1].updated_at = '2026-10-14T02:00:00Z';
    const assetChange = await syncProducts({ ...baseOptions, check: true });
    assert.deepEqual(assetChange.changes[0].fields, ['各平台版本或安装包']);
    const changed = await syncProducts(baseOptions);
    assert.equal(changed.snapshot.products[0].activityAt, '2026-10-14T02:00:00Z');
    assert.equal(changed.snapshot.products[0].updated, '2026-10-14', '单独上传 Windows 安装包也更新卡片日期');
    const preserved = fs.readFileSync(filePath, 'utf8');

    // 任何一个仓库、格式、平台、链接失败都不污染已可用快照。
    await assert.rejects(() => syncProducts({ ...baseOptions, fetchImpl: async () => ({ ok: false, status: 503 }) }), /HTTP 503/);
    await assert.rejects(() => syncProducts({ ...baseOptions, fetchImpl: async () => ({ ok: true, json: async () => ({ message: '异常响应' }) }) }), /响应格式/);
    await assert.rejects(() => syncProducts({ ...baseOptions, fetchImpl: async (url) => !new URL(url).pathname.endsWith('/releases') ? { ok: true, json: async () => ({ private: true, visibility: 'private' }) } : fetchFixture(records)(url) }), /不是公开状态/);
    assert.equal(fs.readFileSync(filePath, 'utf8'), preserved);
    records[repo][0].assets = [{ name: 'App.exe.sig' }];
    await assert.rejects(() => syncProducts(baseOptions), /安装包/);
    assert.equal(fs.readFileSync(filePath, 'utf8'), preserved);
    records[repo] = [release(repo, '1.8.0')];
    records[repo][0].assets[0].browser_download_url = 'https://outside.test/App.dmg';
    await assert.rejects(() => syncProducts(baseOptions), /登记仓库/);
    assert.equal(fs.readFileSync(filePath, 'utf8'), preserved);
    records[repo] = [release(repo, '1.8.0')];

    // 实际跟随下一页，找到旧版 Windows/Linux；下一页错误时不能用第一页装成功。
    const calls = [];
    const paginated = async (url) => {
      calls.push(url);
      if (!url.includes(`/repos/${repo}/`)) return fetchFixture(records)(url);
      if (new URL(url).searchParams.get('page') === '2') return {
        ok: true, json: async () => [release(repo, '1.7.6', ['exe', 'deb'])], headers: { get: () => '' },
      };
      return { ok: true, json: async () => [release(repo, '1.8.0', ['dmg'])],
        headers: { get: () => `<https://api.github.com/repos/${repo}/releases?per_page=100&page=2>; rel="next"` } };
    };
    const pagination = await syncProducts({ ...baseOptions, check: true, fetchImpl: paginated });
    assert.deepEqual(pagination.snapshot.products[0].platforms.map((item) => item.version), ['1.8.0', '1.7.6', '1.7.6']);
    assert.equal(calls.filter((url) => url.includes(`/repos/${repo}/`)).length, 2);
    await assert.rejects(() => syncProducts({ ...baseOptions, fetchImpl: async (url) =>
      new URL(url).searchParams.get('page') === '2' ? { ok: false, status: 502 } : paginated(url) }), /HTTP 502/);
    let leaked = false;
    await assert.rejects(() => syncProducts({ ...baseOptions, fetchImpl: async (url) => {
      if (!new URL(url).pathname.endsWith('/releases')) return fetchFixture(records)(url);
      if (url.startsWith('https://outside.test')) leaked = true;
      return { ok: true, json: async () => [release(repo, '1.8.0')], headers: { get: () => '<https://outside.test/releases>; rel="next"' } };
    } }), /分页地址越出/);
    assert.equal(leaked, false, '凭据不能被分页地址带往其他域名');
    assert.equal(fs.readFileSync(filePath, 'utf8'), preserved);

    // 原子替换失败必须保留原文件并清理仅本次生成的临时文件。
    assert.throws(() => writeSnapshotAtomic(filePath, first.snapshot, {
      writeFileSync: fs.writeFileSync.bind(fs), existsSync: fs.existsSync.bind(fs), unlinkSync: fs.unlinkSync.bind(fs),
      renameSync: () => { throw new Error('模拟磁盘替换失败'); },
    }), /磁盘替换/);
    assert.equal(fs.readFileSync(filePath, 'utf8'), preserved);
    assert.deepEqual(fs.readdirSync(directory), ['snapshot.json']);
    const tampered = structuredClone(changed.snapshot);
    tampered.products[0].updateSummary = '错误内容';
    assert.throws(() => validateProductSnapshot(tampered), /指纹不一致/);
    const missingRevision = structuredClone(changed.snapshot);
    delete missingRevision.products[0].revision;
    assert.throws(() => validateProductSnapshot(missingRevision, { allowLegacy: true }), /指纹不一致/);
    const duplicate = structuredClone(changed.snapshot);
    duplicate.products[1] = duplicate.products[0];
    assert.throws(() => validateProductSnapshot(duplicate), /快照不完整/);
    const product = changed.snapshot.products[0];
    const html = `<div data-product-repo="${repo}" data-product-version="${product.version}" data-product-revision="${product.revision}"></div>`;
    assert.deepEqual(auditProductVersions(html, [product]), []);
    assert.match(auditProductVersions(html.replace(product.revision, '旧指纹'), [product])[0], /指纹/);

    // 发布脚本只认本次请求；watch 抖动后的实际结论以权威回读为准。
    const commands = [];
    const fakeGh = (args) => {
      commands.push(args);
      if (args[0] === 'api') return 'active';
      if (args[0] === 'workflow') return '';
      if (args[1] === 'list') return JSON.stringify([
        { databaseId: 10, displayTitle: '其他部署', url: 'https://github.com/other' },
        { databaseId: 11, displayTitle: '软件信息刷新 · 本次请求', url: 'https://github.com/run/11' },
      ]);
      return JSON.stringify({ status: 'completed', conclusion: 'success', url: 'https://github.com/run/11' });
    };
    const result = await publishProductUpdates({ gh: fakeGh, watch: (id) => { assert.equal(id, 11); return 1; }, nonce: '本次请求', sleep: async () => {}, log: () => {} });
    assert.equal(result.conclusion, 'success');
    const dispatch = commands.find((args) => args[0] === 'workflow');
    assert.deepEqual(dispatch, ['workflow', 'run', 'deploy.yml', '--repo', 'HackerChi-Hub/blog', '--ref', 'main', '--field', 'product_update_id=本次请求']);
    assert.equal(commands.filter((args) => args[0] === 'workflow').length, 1);
    await assert.rejects(() => publishProductUpdates({ gh: (args) => args[1] === 'view' ? JSON.stringify({ status: 'completed', conclusion: 'failure', url: '失败任务' }) : fakeGh(args), watch: () => 1, nonce: '本次请求', log: () => {} }), /未确认成功/);
    await assert.rejects(() => publishProductUpdates({ gh: (args) => args[1] === 'list' ? '[]' : fakeGh(args), pollLimit: 2, sleep: async () => {}, nonce: '无法找到', log: () => {} }), /不要盲目重发/);
    await assert.rejects(() => publishProductUpdates({ gh: () => 'disabled_manually', log: () => {} }), /未启用/);

    const workflow = YAML.parse(fs.readFileSync(path.resolve(__dirname, '../.github/workflows/deploy.yml'), 'utf8'));
    assert.equal(workflow.on.schedule[0].cron, '17 * * * *');
    assert.equal(workflow.concurrency['cancel-in-progress'], false);
    assert.ok(workflow.on.workflow_dispatch.inputs.product_update_id);
    assert.equal(workflow.jobs['build-and-deploy'].needs, 'check-product-updates');
    assert.match(workflow.jobs['build-and-deploy'].if, /should_deploy/);
    const verify = workflow.jobs['build-and-deploy'].steps.find((step) => step.name === 'Verify live pages and assets');
    assert.equal(verify.if, undefined, '定时任务不能跳过线上核验');
    assert.match(verify.run, /verify-product-versions/);
    const cli = spawnSync(process.execPath, [path.join(__dirname, 'refresh-product-releases.js'), '--unknown'], { encoding: 'utf8' });
    assert.equal(cli.status, 1);
    assert.match(cli.stderr, /不支持的参数/);
    assert.equal(fs.readFileSync(filePath, 'utf8'), preserved);
    console.log('✅ 软件更新脚本回归通过：只读检查、同版说明/安装包变更、分页、失败不污染、原子替换、全页指纹、隔离草稿及发布请求回读');
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
