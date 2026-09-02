#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const expectedRunId = process.argv[2] || '';
const baseUrl = 'https://hyphentech.top';
const publicAssetRoot = path.resolve(__dirname, '..', 'public', 'obsidian-assets');
const contentManifestPath = path.resolve(__dirname, '..', 'content-export', 'publish-manifest.json');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithTimeout(url, timeoutMs = 15000, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      redirect: 'follow',
      headers: {
        'user-agent': 'hyphentech-deploy-verify/1.0',
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function waitForBuildId() {
  const deadline = Date.now() + 180000;
  let last = '';
  while (Date.now() < deadline) {
    try {
      const response = await fetchWithTimeout(`${baseUrl}/.build-id`);
      if (response.ok) {
        last = (await response.text()).trim();
        if (!expectedRunId || last.startsWith(`${expectedRunId}-`)) return last;
      }
    } catch (error) {
      last = error.message;
    }
    await sleep(5000);
  }
  throw new Error(`线上 .build-id 未切换到 run ${expectedRunId}，最后读到：${last || '空'}`);
}

async function verifyUrl(url) {
  const response = await fetchWithTimeout(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return url;
}

async function verifyInBatches(urls, size = 6) {
  for (let index = 0; index < urls.length; index += size) {
    await Promise.all(urls.slice(index, index + size).map(verifyUrl));
  }
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(absolutePath));
    else if (entry.isFile()) files.push(absolutePath);
  }
  return files;
}

function assetUrlForFile(filePath) {
  const relativePath = path.relative(path.resolve(__dirname, '..', 'public'), filePath);
  const encodedPath = relativePath.split(path.sep).map(encodeURIComponent).join('/');
  return `${baseUrl}/${encodedPath}`;
}

async function verifyAssetUrl(url) {
  const cacheBustedUrl = expectedRunId
    ? `${url}${url.includes('?') ? '&' : '?'}deploy=${encodeURIComponent(expectedRunId)}`
    : url;
  const deadline = Date.now() + 90000;
  let lastError = '';

  while (Date.now() < deadline) {
    try {
      const response = await fetchWithTimeout(cacheBustedUrl, 15000, { method: 'HEAD' });
      if (!response.ok) {
        lastError = `HTTP ${response.status}`;
      } else {
        const length = Number(response.headers.get('content-length') || 0);
        if (length > 0) return url;

        const fallback = await fetchWithTimeout(cacheBustedUrl, 15000, {
          headers: { range: 'bytes=0-0' },
        });
        if (fallback.ok && (await fallback.arrayBuffer()).byteLength > 0) return url;
        lastError = fallback.ok ? '响应为空' : `Range HTTP ${fallback.status}`;
      }
    } catch (error) {
      lastError = error.message;
    }
    await sleep(5000);
  }

  throw new Error(`${lastError || '不可读'} ${url}`);
}

async function verifyAssetsInBatches(urls, size = 12) {
  for (let index = 0; index < urls.length; index += size) {
    await Promise.all(urls.slice(index, index + size).map(verifyAssetUrl));
  }
}

async function main() {
  const buildId = await waitForBuildId();
  console.log(`✅ 线上构建版本：${buildId}`);

  const sitemapResponse = await fetchWithTimeout(`${baseUrl}/sitemap.xml`);
  if (!sitemapResponse.ok) throw new Error(`sitemap HTTP ${sitemapResponse.status}`);
  const sitemap = await sitemapResponse.text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const articleUrls = urls.filter((url) => url.startsWith(`${baseUrl}/`) && url !== `${baseUrl}/`);
  if (articleUrls.length === 0) throw new Error('sitemap 没有文章或分页 URL，拒绝把空站视为成功');

  if (!fs.existsSync(contentManifestPath)) throw new Error('缺少本地 content-export/publish-manifest.json');
  const contentManifest = JSON.parse(fs.readFileSync(contentManifestPath, 'utf8'));
  const expectedSlugs = (contentManifest.posts || []).map((post) => String(post.slug || '')).filter(Boolean);
  const expectedLegacyUrls = (contentManifest.posts || []).flatMap((post) =>
    (post.legacy_paths || [])
      .map((legacyPath) => String(legacyPath || '').replace(/^\/+|\/+$/g, ''))
      .filter(Boolean)
      .map((legacyPath) => `${baseUrl}/${legacyPath}/`)
  );
  const missingSlugs = expectedSlugs.filter(
    (slug) => !sitemap.includes(`<loc>${baseUrl}/${slug}/</loc>`)
  );
  if (missingSlugs.length) throw new Error(`sitemap 缺少已发布文章：${missingSlugs.join('、')}`);

  await verifyInBatches([baseUrl, ...articleUrls, ...expectedLegacyUrls]);
  console.log(
    `✅ 线上验收：${expectedSlugs.length} 篇 Obsidian 文章均在 sitemap，` +
      `主页、sitemap 中 ${articleUrls.length} 个页面和 ${expectedLegacyUrls.length} 条历史网址全部返回 2xx`
  );

  const assetFiles = walkFiles(publicAssetRoot);
  if (assetFiles.length === 0) throw new Error('public/obsidian-assets 为空，拒绝把无图站点视为成功');
  await verifyAssetsInBatches(assetFiles.map(assetUrlForFile));
  console.log(
    `✅ 素材验收：${assetFiles.length} 个实际被文章引用的公开文件全部可读`
  );
}

main().catch((error) => {
  console.error(`❌ 线上验收失败：${error.message}`);
  process.exit(1);
});
