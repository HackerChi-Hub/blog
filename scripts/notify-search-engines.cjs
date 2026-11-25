#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ORIGIN = 'https://hyphentech.top';
const HOST = 'hyphentech.top';
const INDEXNOW_KEY = 'a4f91e7c3b824d0596e1f28c70d3b5a8';
const DEFAULT_INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';
const DEFAULT_BAIDU_ENDPOINT = 'http://data.zz.baidu.com/urls';
const PLAN_FILE = '.cloudflare-purge-plan.json';
const MAX_INDEXNOW_BATCH = 10000;
const MAX_BAIDU_BATCH = 100;

const NON_PAGE_PREFIXES = [
  '/_next/',
  '/obsidian-assets/',
  '/cover-previews/',
  '/media-previews/',
  '/images/',
  '/png/',
  '/shared/',
  '/localbrain/',
  '/api/',
];

const NON_INDEXABLE_EXACT = new Set([
  '/index.html',
  '/sitemap.xml',
  '/robots.txt',
  '/feed.xml',
  '/product-releases.json',
  '/site.webmanifest',
  '/.build-id',
  '/404',
  '/404/',
  '/404.html',
  '/google4021b61d659557f3.html',
]);

const ASSET_EXTENSION_RE =
  /\.(?:png|jpe?g|webp|gif|svg|ico|mp4|webm|mp3|wav|css|m?js|cjs|map|json|xml|txt|woff2?|ttf|eot|pdf|zip|dmg|exe|msi|deb|rpm|appimage)$/i;

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function defaultFetcher(url, options = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(20000) });
  const text = await response.text();
  return { status: response.status, ok: response.ok, text, headers: response.headers };
}

function parseArgs(argv = []) {
  const options = {
    dryRun: false,
    softFail: false,
    all: false,
    recentDays: 3,
    root: path.resolve(__dirname, '..'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--soft-fail') options.softFail = true;
    else if (arg === '--all') options.all = true;
    else if (arg === '--recent-days') {
      const value = Number(argv[++i]);
      if (!Number.isFinite(value) || value < 0) throw new Error('--recent-days 需要非负数字');
      options.recentDays = value;
    } else if (arg === '--root') {
      options.root = path.resolve(argv[++i] || '');
    } else {
      throw new Error(`未知参数：${arg}`);
    }
  }
  return options;
}

function loadVerifiedKey(root, expectedKey = INDEXNOW_KEY) {
  if (!/^[a-f0-9-]{8,128}$/i.test(expectedKey)) {
    throw new Error('IndexNow 密钥格式无效');
  }
  const publicKeyFile = path.join(root, 'public', `${expectedKey}.txt`);
  if (!fs.existsSync(publicKeyFile)) {
    throw new Error(`缺少 IndexNow 验证文件：public/${expectedKey}.txt`);
  }
  const content = fs.readFileSync(publicKeyFile, 'utf8').trim();
  if (content !== expectedKey) {
    throw new Error(`public/${expectedKey}.txt 内容与密钥不一致`);
  }
  return {
    key: expectedKey,
    keyLocation: `${ORIGIN}/${expectedKey}.txt`,
  };
}

function isIndexableCanonicalUrl(rawUrl, key = INDEXNOW_KEY, origin = ORIGIN) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }
  if (parsed.origin !== origin || parsed.search || parsed.hash || parsed.username || parsed.password) {
    return false;
  }
  const pathname = parsed.pathname;
  if (NON_INDEXABLE_EXACT.has(pathname) || pathname === `/${key}.txt`) return false;
  if (pathname.endsWith('/index.html')) return false;
  if (NON_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return false;
  if (ASSET_EXTENSION_RE.test(pathname)) return false;
  // Google 验证页等静态所有权文件不提交收录
  if (/^\/google[a-f0-9]+\.html$/i.test(pathname)) return false;
  return pathname === '/' || pathname.endsWith('/') || pathname.endsWith('.html');
}

function parseSitemapEntries(xml) {
  const entries = [];
  const decode = (str) =>
    String(str || '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
  for (const blockMatch of String(xml || '').matchAll(/<url>([\s\S]*?)<\/url>/gi)) {
    const block = blockMatch[1];
    const loc = decode(block.match(/<loc>([^<]+)<\/loc>/i)?.[1] || '').trim();
    const lastmod = decode(block.match(/<lastmod>([^<]+)<\/lastmod>/i)?.[1] || '').trim() || null;
    if (loc) entries.push({ loc, lastmod });
  }
  return entries;
}

function filterRecentSitemapUrls(entries, recentDays = 3, key = INDEXNOW_KEY, origin = ORIGIN) {
  const valid = entries.filter((entry) => isIndexableCanonicalUrl(entry.loc, key, origin));
  const dated = valid
    .map((entry) => ({ ...entry, ms: entry.lastmod ? Date.parse(`${entry.lastmod}T00:00:00Z`) : NaN }))
    .filter((entry) => Number.isFinite(entry.ms));
  if (!dated.length) return [];
  const anchorMs = Math.max(...dated.map((entry) => entry.ms));
  const cutoffMs = anchorMs - recentDays * 86400000;
  return [...new Set(dated.filter((entry) => entry.ms >= cutoffMs).map((entry) => entry.loc))];
}

function resolveCandidateUrls(root, { all = false, recentDays = 3, key = INDEXNOW_KEY, origin = ORIGIN } = {}) {
  const sitemapPath = path.join(root, 'out', 'sitemap.xml');
  const planPath = path.join(root, PLAN_FILE);
  const sitemapEntries = fs.existsSync(sitemapPath)
    ? parseSitemapEntries(fs.readFileSync(sitemapPath, 'utf8'))
    : [];

  if (all) {
    if (!sitemapEntries.length) throw new Error('缺少 out/sitemap.xml，无法提取全站 URL');
    return {
      source: 'sitemap-all',
      urls: [...new Set(sitemapEntries.map((item) => item.loc).filter((u) => isIndexableCanonicalUrl(u, key, origin)))],
    };
  }

  if (fs.existsSync(planPath)) {
    const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
    if (plan?.bootstrap === true) {
      return {
        source: 'bootstrap-sitemap',
        urls: [...new Set(sitemapEntries.map((item) => item.loc).filter((u) => isIndexableCanonicalUrl(u, key, origin)))],
      };
    }
    if (Array.isArray(plan?.urls)) {
      return {
        source: 'cloudflare-diff',
        urls: [...new Set(plan.urls.filter((u) => isIndexableCanonicalUrl(u, key, origin)))],
      };
    }
  }

  if (!sitemapEntries.length) {
    throw new Error('既无 .cloudflare-purge-plan.json 也无 out/sitemap.xml，无法确定待推送 URL');
  }
  return {
    source: `sitemap-recent-${recentDays}d`,
    urls: filterRecentSitemapUrls(sitemapEntries, recentDays, key, origin),
  };
}

function filterLiveExistingUrls(urls, outDir, origin = ORIGIN) {
  if (!fs.existsSync(outDir)) return urls;
  return urls.filter((rawUrl) => {
    const pathname = decodeURIComponent(new URL(rawUrl, origin).pathname);
    if (pathname === '/') return fs.existsSync(path.join(outDir, 'index.html'));
    if (pathname.endsWith('/')) {
      return fs.existsSync(path.join(outDir, pathname.replace(/^\/+|\/+$/g, ''), 'index.html'));
    }
    return fs.existsSync(path.join(outDir, pathname.replace(/^\/+/, '')));
  });
}

async function submitIndexNow(urls, { key, keyLocation, host = HOST, endpoint = DEFAULT_INDEXNOW_ENDPOINT, fetcher = defaultFetcher, sleep = pause } = {}) {
  if (!urls.length) return { submitted: 0, batches: 0 };
  let batches = 0;
  for (let i = 0; i < urls.length; i += MAX_INDEXNOW_BATCH) {
    const chunk = urls.slice(i, i + MAX_INDEXNOW_BATCH);
    const payload = {
      host,
      key,
      keyLocation,
      urlList: chunk,
    };
    let lastStatus = 0;
    let lastError = '';
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const response = await fetcher(endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json; charset=utf-8' },
          body: JSON.stringify(payload),
        });
        lastStatus = response.status;
        if (response.status === 200 || response.status === 202) {
          batches += 1;
          lastError = '';
          break;
        }
        lastError = `HTTP ${response.status}`;
        if (response.status !== 429 && response.status < 500) break;
      } catch (error) {
        lastError = error.message;
      }
      if (attempt < 2) await sleep(2000 * (attempt + 1));
    }
    if (lastError) {
      throw new Error(`IndexNow 推送未通过（${lastError}）`);
    }
  }
  return { submitted: urls.length, batches };
}

async function submitBaidu(urls, token, { site = ORIGIN, endpoint = DEFAULT_BAIDU_ENDPOINT, fetcher = defaultFetcher } = {}) {
  if (!token || !urls.length) return { skipped: !token, submitted: 0 };
  const chunk = urls.slice(0, MAX_BAIDU_BATCH);
  const target = `${endpoint}?site=${encodeURIComponent(site)}&token=${encodeURIComponent(token)}`;
  const response = await fetcher(target, {
    method: 'POST',
    headers: { 'content-type': 'text/plain; charset=utf-8' },
    body: chunk.join('\n'),
  });
  let parsed = null;
  try {
    parsed = JSON.parse(response.text);
  } catch {
    throw new Error(`百度收录接口响应非 JSON：HTTP ${response.status}`);
  }
  if (!response.ok || typeof parsed.success !== 'number') {
    throw new Error(`百度收录推送失败：HTTP ${response.status} (${parsed?.message || '未知错误'})`);
  }
  return { skipped: false, submitted: parsed.success, remain: parsed.remain };
}

async function run(options = {}, deps = {}) {
  const {
    root = path.resolve(__dirname, '..'),
    dryRun = false,
    all = false,
    recentDays = 3,
  } = options;
  const fetcher = deps.fetcher || defaultFetcher;
  const sleep = deps.sleep || pause;
  const endpoint = deps.indexNowEndpoint || process.env.INDEXNOW_ENDPOINT || DEFAULT_INDEXNOW_ENDPOINT;
  const baiduToken = (deps.baiduToken ?? process.env.BAIDU_PUSH_TOKEN ?? '').trim();

  const { key, keyLocation } = loadVerifiedKey(root);
  const { source, urls } = resolveCandidateUrls(root, { all, recentDays, key });

  if (urls.length === 0) {
    console.log(`ℹ️ 搜索收录推送跳过（来源=${source}）：本次部署没有新增、修改或下线的规范页面 URL`);
    return { source, urls: [], indexNow: { submitted: 0, batches: 0 }, baidu: { skipped: true, submitted: 0 } };
  }

  console.log(`📡 搜索收录增量识别（来源=${source}）：共 ${urls.length} 条规范 URL`);
  urls.slice(0, 12).forEach((u) => console.log(`   - ${u}`));
  if (urls.length > 12) console.log(`   ... 其余 ${urls.length - 12} 条已省略`);

  if (dryRun) {
    console.log(`🧪 [dry-run] 已演练 IndexNow 报文（keyLocation=${keyLocation}），未发起外部网络请求`);
    return { source, urls, dryRun: true };
  }

  const indexNow = await submitIndexNow(urls, { key, keyLocation, endpoint, fetcher, sleep });
  console.log(`✅ IndexNow 推送成功：${indexNow.submitted} 条 URL 已同步至 Bing / AI 搜索联盟`);

  const liveUrls = filterLiveExistingUrls(urls, path.join(root, 'out'));
  let baidu = { skipped: true, submitted: 0 };
  if (baiduToken && liveUrls.length > 0) {
    baidu = await submitBaidu(liveUrls, baiduToken, { fetcher });
    console.log(`✅ 百度普通收录推送成功：成功 ${baidu.submitted} 条，今日剩余配额 ${baidu.remain}`);
  } else if (!baiduToken) {
    console.log('ℹ️ 未设置 BAIDU_PUSH_TOKEN，跳过百度普通收录（如需启用可在仓库 Secrets 添加）');
  }

  return { source, urls, indexNow, baidu };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  try {
    await run(options);
  } catch (error) {
    if (options.softFail) {
      if (process.env.GITHUB_ACTIONS) {
        console.warn(`::warning::搜索收录通知暂未完成（不影响已上线的博客）：${error.message}`);
      }
      console.warn(`⚠️ 搜索收录通知暂未完成（不影响已上线的博客）：${error.message}`);
      return;
    }
    console.error(`❌ ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = {
  ORIGIN,
  HOST,
  INDEXNOW_KEY,
  loadVerifiedKey,
  isIndexableCanonicalUrl,
  parseSitemapEntries,
  filterRecentSitemapUrls,
  resolveCandidateUrls,
  filterLiveExistingUrls,
  submitIndexNow,
  submitBaidu,
  run,
};

if (require.main === module) {
  main();
}
