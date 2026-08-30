#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const outDir = path.join(root, 'out');
const sitemapPath = path.join(outDir, 'sitemap.xml');
const contentManifestPath = path.join(root, 'content-export', 'publish-manifest.json');

if (!fs.existsSync(sitemapPath)) {
  console.error('❌ 导出验收失败：缺少 out/sitemap.xml');
  process.exit(1);
}

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (urls.length < 2) {
  console.error(`❌ 导出验收失败：sitemap 只有 ${urls.length} 条 URL`);
  process.exit(1);
}

const failures = [];
for (const rawUrl of urls) {
  const url = new URL(rawUrl);
  const route = decodeURIComponent(url.pathname).replace(/^\/+|\/+$/g, '');
  const htmlPath = route
    ? path.join(outDir, route, 'index.html')
    : path.join(outDir, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    failures.push(`缺少 ${url.pathname} -> ${path.relative(root, htmlPath)}`);
    continue;
  }
  const html = fs.readFileSync(htmlPath, 'utf8');
  if (/Content rendering failed|无法加载 Notion 内容|Response code 403/.test(html)) {
    failures.push(`错误占位内容 ${url.pathname}`);
  }
}

if (failures.length) {
  console.error('❌ 导出验收失败：');
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}

console.log(`✅ 导出验收：sitemap 中 ${urls.length} 个页面均存在且没有错误占位内容`);

if (fs.existsSync(contentManifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(contentManifestPath, 'utf8'));
  const posts = Array.isArray(manifest.posts) ? manifest.posts : [];
  if (manifest.published_post_count !== posts.length) {
    console.error(
      `❌ Obsidian 快照数量不一致：manifest=${manifest.published_post_count}，posts=${posts.length}`
    );
    process.exit(1);
  }

  const obsidianFailures = [];
  for (const post of posts) {
    const slug = String(post.slug || '').replace(/^\/+|\/+$/g, '');
    const htmlPath = path.join(outDir, slug, 'index.html');
    if (!slug || !fs.existsSync(htmlPath)) {
      obsidianFailures.push(`缺少 Obsidian 文章页：${slug || post.file}`);
      continue;
    }
    const html = fs.readFileSync(htmlPath, 'utf8');
    if (!html.includes('markdown-content')) {
      obsidianFailures.push(`文章没有使用 Markdown 渲染器：${slug}`);
    }
    if (/(?:file\.notion\.so|expirationTimestamp=|X-Amz-Signature=)/i.test(html)) {
      obsidianFailures.push(`文章仍含临时 Notion 素材地址：${slug}`);
    }
    if (!sitemap.includes(`/${slug}/`)) {
      obsidianFailures.push(`sitemap 缺少文章：${slug}`);
    }
  }

  if (obsidianFailures.length) {
    console.error('❌ Obsidian 导出验收失败：');
    obsidianFailures.forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
  }

  console.log(`✅ Obsidian 导出验收：${posts.length} 篇文章全部由 Markdown 渲染且网址完整`);
}
