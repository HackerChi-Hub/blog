#!/usr/bin/env node

const expectedRunId = process.argv[2] || '';
const baseUrl = 'https://hyphentech.top';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': 'hyphentech-deploy-verify/1.0' },
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

async function main() {
  const buildId = await waitForBuildId();
  console.log(`✅ 线上构建版本：${buildId}`);

  const sitemapResponse = await fetchWithTimeout(`${baseUrl}/sitemap.xml`);
  if (!sitemapResponse.ok) throw new Error(`sitemap HTTP ${sitemapResponse.status}`);
  const sitemap = await sitemapResponse.text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const articleUrls = urls.filter((url) => url.startsWith(`${baseUrl}/`) && url !== `${baseUrl}/`);
  if (articleUrls.length === 0) throw new Error('sitemap 没有文章或分页 URL，拒绝把空站视为成功');

  await verifyInBatches([baseUrl, ...articleUrls]);
  console.log(`✅ 线上验收：主页 + sitemap 中 ${articleUrls.length} 个页面全部返回 2xx`);
}

main().catch((error) => {
  console.error(`❌ 线上验收失败：${error.message}`);
  process.exit(1);
});

