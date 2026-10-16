#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ORIGIN = 'https://hyphentech.top';
const ZONE = '47f9ae30305bb29ab0c3303530fa61b4';
const MANIFEST = '.cloudflare-cache-manifest.json';
const PLAN = '.cloudflare-purge-plan.json';
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function request(url, options = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(20000) });
  const text = await response.text();
  return { status: response.status, ok: response.ok, text };
}

function urlsForFile(file) {
  const encoded = '/' + file.split('/').map(encodeURIComponent).join('/');
  const urls = [ORIGIN + encoded];
  if (file === 'index.html') urls.push(ORIGIN + '/');
  else if (file.endsWith('/index.html')) urls.push(ORIGIN + encoded.slice(0, -10));
  return urls;
}

function validateManifest(manifest) {
  if (manifest?.version !== 1 || manifest.origin !== ORIGIN || !manifest.files || typeof manifest.files !== 'object' || Array.isArray(manifest.files)) {
    throw new Error('缓存清单格式或域名不符');
  }
  for (const [file, hash] of Object.entries(manifest.files)) {
    if (!file || file.startsWith('/') || file.split('/').some((part) => !part || part === '.' || part === '..') || /[\\?#\x00-\x1f]/.test(file) || !/^[a-f0-9]{64}$/.test(hash)) {
      throw new Error('缓存清单包含非法文件路径或哈希');
    }
  }
  return manifest;
}

function buildManifest(root) {
  const files = {};
  function walk(dir, prefix = '') {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = prefix + entry.name;
      if ([MANIFEST, '.nojekyll', 'CNAME'].includes(file)) continue;
      if (entry.isSymbolicLink()) throw new Error('导出目录不允许软链接');
      if (entry.isDirectory()) walk(path.join(dir, entry.name), file + '/');
      else if (entry.isFile()) files[file] = crypto.createHash('sha256').update(fs.readFileSync(path.join(dir, entry.name))).digest('hex');
    }
  }
  walk(root);
  if (!files['index.html'] || !files['.build-id']) throw new Error('缺少首页或构建标识，拒绝准备缓存刷新');
  return validateManifest({ version: 1, origin: ORIGIN, files });
}

function makePlan(current, previous) {
  validateManifest(current);
  if (previous) validateManifest(previous);
  if (!previous) return { version: 1, origin: ORIGIN, bootstrap: true, urls: [] };
  const changed = new Set();
  for (const file of new Set([...Object.keys(previous.files), ...Object.keys(current.files)])) {
    if (current.files[file] !== previous.files[file]) urlsForFile(file).forEach((url) => changed.add(url));
  }
  return { version: 1, origin: ORIGIN, bootstrap: false, urls: [...changed].sort() };
}

async function prepare(root = path.resolve(__dirname, '..'), fetcher = request) {
  const headers = { accept: 'application/vnd.github.raw+json', 'user-agent': 'hyphentech-cache-deploy' };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const old = await fetcher('https://api.github.com/repos/HackerChi-Hub/blog/contents/' + MANIFEST + '?ref=gh-pages', { headers });
  let previous = null;
  if (old.ok) {
    previous = validateManifest(JSON.parse(old.text));
    // 只有上次工作流完整成功，才相信其中删除地址已被清除。
    // 上次刷新失败/中断时重新全清一次，避免新清单掩盖仍在缓存中的已删除文章。
    if (/^\d+$/.test(previous.deploymentRunId || '')) {
      const run = await fetcher('https://api.github.com/repos/HackerChi-Hub/blog/actions/runs/' + previous.deploymentRunId, {
        headers: { ...headers, accept: 'application/vnd.github+json' },
      });
      if (!run.ok) throw new Error(`核对上次缓存刷新状态失败：HTTP ${run.status}`);
      const state = JSON.parse(run.text);
      if (state.status !== 'completed' || state.conclusion !== 'success') previous = null;
    } else previous = null;
  }
  else if (old.status !== 404) throw new Error(`读取上次部署缓存清单失败：HTTP ${old.status}`);
  const output = path.join(root, 'out');
  const current = buildManifest(output);
  if (process.env.GITHUB_RUN_ID) current.deploymentRunId = process.env.GITHUB_RUN_ID;
  const plan = makePlan(current, previous);
  plan.buildId = fs.readFileSync(path.join(output, '.build-id'), 'utf8').trim();
  fs.writeFileSync(path.join(output, MANIFEST), JSON.stringify(current));
  fs.writeFileSync(path.join(root, PLAN), JSON.stringify(plan));
  console.log(plan.bootstrap ? '首次接入：新版上线后清除一次本站旧缓存' : `缓存刷新计划：${plan.urls.length} 个新增、变更或删除的地址，未变图片保留缓存`);
  return plan;
}

async function waitForOrigin(buildId, fetcher = request, sleep = pause) {
  for (let attempt = 0; attempt < 36; attempt++) {
    try {
      const live = await fetcher(`${ORIGIN}/.build-id?deployment=${encodeURIComponent(buildId)}`);
      if (live.ok && live.text.trim() === buildId) return;
    } catch { /* 瞬时网络错误继续等待，绝不提前清缓存。 */ }
    await sleep(5000);
  }
  throw new Error('新版尚未实际上线，拒绝提前清除缓存');
}

async function purge(plan, token, fetcher = request, sleep = pause) {
  if (!token) throw new Error('缺少 CLOUDFLARE_CACHE_PURGE_TOKEN，拒绝把未刷新缓存视为发布成功');
  if (plan?.version !== 1 || plan.origin !== ORIGIN || typeof plan.bootstrap !== 'boolean' || !Array.isArray(plan.urls) || !/^[\w.-]+$/.test(plan.buildId || '')) throw new Error('缓存刷新计划无效');
  for (const url of plan.urls) {
    const parsed = new URL(url);
    if (parsed.origin !== ORIGIN || parsed.search || parsed.hash || parsed.username || parsed.password) throw new Error('拒绝刷新其它域名或带查询参数的地址');
  }
  await waitForOrigin(plan.buildId, fetcher, sleep);
  const batches = plan.bootstrap ? [{ purge_everything: true }] : [];
  if (!plan.bootstrap) for (let i = 0; i < plan.urls.length; i += 100) batches.push({ files: plan.urls.slice(i, i + 100) });
  for (const body of batches) {
    for (let attempt = 0; ; attempt++) {
      let response;
      try {
        response = await fetcher(`https://api.cloudflare.com/client/v4/zones/${ZONE}/purge_cache`, {
          method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify(body),
        });
      } catch {
        if (attempt >= 3) throw new Error('缓存刷新网络失败，请单独重试刷新，不要重发文章');
        await sleep(5000 * (attempt + 1));
        continue;
      }
      if ((response.status === 429 || response.status >= 500) && attempt < 3) {
        await sleep(10000 * (attempt + 1));
        continue;
      }
      let result;
      try { result = JSON.parse(response.text); } catch { throw new Error(`缓存刷新响应格式错误：HTTP ${response.status}`); }
      if (!response.ok || result.success !== true || result.errors?.length) throw new Error(`缓存刷新失败：HTTP ${response.status}，请检查令牌权限；未输出凭据或响应正文`);
      break;
    }
    await sleep(250);
  }
  console.log(`✅ Cloudflare 缓存刷新成功：${plan.bootstrap ? '首次清除本站旧缓存' : plan.urls.length + ' 个变更地址'}；已确认新版构建 ${plan.buildId}`);
}

async function main() {
  const root = path.resolve(__dirname, '..');
  if (process.argv[2] === 'prepare') return prepare(root);
  if (process.argv[2] === 'purge') return purge(JSON.parse(fs.readFileSync(path.join(root, PLAN), 'utf8')), process.env.CLOUDFLARE_CACHE_PURGE_TOKEN);
  throw new Error('用法：node scripts/cloudflare-cache.js prepare|purge');
}
module.exports = { urlsForFile, validateManifest, buildManifest, makePlan, prepare, waitForOrigin, purge };
if (require.main === module) main().catch((error) => { console.error(`❌ ${error.message}`); process.exitCode = 1; });
