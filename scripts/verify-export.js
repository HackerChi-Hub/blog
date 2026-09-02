#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const root = process.cwd();
const outDir = path.join(root, 'out');
const sitemapPath = path.join(outDir, 'sitemap.xml');

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--content-dir') args.contentDir = argv[++index];
    else throw new Error(`未知参数：${argv[index]}`);
  }
  return args;
}

function walkMarkdownFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkMarkdownFiles(absolutePath));
    else if (entry.isFile() && /\.md$/i.test(entry.name)) files.push(absolutePath);
  }
  return files.sort();
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.map(String);
  return value ? String(value).split(',') : [];
}

function loadExpectedPosts(contentDir) {
  const contentManifestPath = path.join(contentDir, 'publish-manifest.json');
  if (fs.existsSync(contentManifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(contentManifestPath, 'utf8'));
    const posts = Array.isArray(manifest.posts) ? manifest.posts : [];
    if (manifest.published_post_count !== posts.length) {
      throw new Error(
        `Obsidian 快照数量不一致：manifest=${manifest.published_post_count}，posts=${posts.length}`
      );
    }
    return posts;
  }

  return walkMarkdownFiles(path.join(contentDir, 'posts'))
    .map((filePath) => ({ filePath, data: matter(fs.readFileSync(filePath, 'utf8')).data }))
    .filter(({ data }) => String(data.status || 'draft').toLowerCase() === 'published')
    .map(({ filePath, data }) => ({
      file: path.relative(contentDir, filePath),
      slug: String(data.slug || ''),
      legacy_paths: normalizeList(data.legacy_paths).map((item) => item.trim()).filter(Boolean),
    }));
}

const args = parseArgs(process.argv.slice(2));
const contentDir = path.resolve(args.contentDir || process.env.BLOG_CONTENT_DIR || './content-export');

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
    if (/Content rendering failed|无法加载文章内容|Response code 403/.test(html)) {
    failures.push(`错误占位内容 ${url.pathname}`);
  }
}

if (failures.length) {
  console.error('❌ 导出验收失败：');
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}

console.log(`✅ 导出验收：sitemap 中 ${urls.length} 个页面均存在且没有错误占位内容`);

try {
  const posts = loadExpectedPosts(contentDir);
  if (posts.length === 0) throw new Error(`内容目录没有已发布文章：${contentDir}`);

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
    if (/(?:expirationTimestamp=|X-Amz-Signature=)/i.test(html)) {
      obsidianFailures.push(`文章仍含临时签名素材地址：${slug}`);
    }
    if (!sitemap.includes(`/${slug}/`)) {
      obsidianFailures.push(`sitemap 缺少文章：${slug}`);
    }
    for (const rawLegacyPath of post.legacy_paths || []) {
      const legacyPath = String(rawLegacyPath || '').replace(/^\/+|\/+$/g, '');
      const legacyHtmlPath = path.join(outDir, legacyPath, 'index.html');
      if (!legacyPath || !fs.existsSync(legacyHtmlPath)) {
        obsidianFailures.push(`缺少历史网址页面：${legacyPath || post.file}`);
      }
    }
  }

  if (obsidianFailures.length) {
    console.error('❌ Obsidian 导出验收失败：');
    obsidianFailures.forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
  }

  const legacyCount = posts.reduce(
    (sum, post) => sum + (Array.isArray(post.legacy_paths) ? post.legacy_paths.length : 0),
    0
  );
  console.log(
    `✅ Obsidian 导出验收：${posts.length} 篇文章由 Markdown 渲染，` +
      `${legacyCount} 条历史网址全部存在`
  );
} catch (error) {
  console.error(`❌ Obsidian 导出验收失败：${error.message}`);
  process.exit(1);
}
