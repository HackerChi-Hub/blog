#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const YAML = require('yaml');

function parseArgs(argv) {
  const args = { contentDir: process.env.BLOG_CONTENT_DIR || '' };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--content-dir') {
      args.contentDir = argv[index + 1] || '';
      index += 1;
    }
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
    if (entry.isFile() && /\.md(?:own)?$/i.test(entry.name)) files.push(absolutePath);
  }
  return files.sort();
}

function asString(value) {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).trim();
}

function asStringArray(value) {
  if (Array.isArray(value)) return value.map(asString).filter(Boolean);
  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function normalizeRoute(value) {
  return asString(value).replace(/^\/+|\/+$/g, '');
}

function isStablePublishedAsset(value) {
  if (!value) return true;
  if (/^(?:https?:\/\/|\/)/i.test(value)) {
    return !/(?:file\.notion\.so|expirationTimestamp=|X-Amz-Signature=)/i.test(value);
  }
  return false;
}

function validateConfig(contentDir, fileName, failures) {
  const filePath = path.join(contentDir, 'config', fileName);
  if (!fs.existsSync(filePath)) return;
  try {
    const config = YAML.parse(fs.readFileSync(filePath, 'utf8'));
    if (!config || typeof config !== 'object') {
      failures.push(`${fileName} 不是有效对象`);
      return;
    }
    if (config.enabled && !Array.isArray(config.items)) {
      failures.push(`${fileName} 已启用但 items 不是数组`);
    }
  } catch (error) {
    failures.push(`${fileName} 无法解析：${error.message}`);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const contentDir = path.resolve(
    args.contentDir || path.join(process.cwd(), '..', 'blog-content')
  );
  const postsDir = path.join(contentDir, 'posts');
  const files = walkMarkdownFiles(postsDir);
  const failures = [];
  const warnings = [];
  const routes = new Map();
  let publishedCount = 0;
  let draftCount = 0;

  if (!fs.existsSync(contentDir)) failures.push(`内容库不存在：${contentDir}`);
  if (!fs.existsSync(postsDir)) failures.push(`文章目录不存在：${postsDir}`);

  for (const filePath of files) {
    const relativePath = path.relative(contentDir, filePath);
    let parsed;
    try {
      parsed = matter(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      failures.push(`${relativePath} 无法解析：${error.message}`);
      continue;
    }

    const data = parsed.data || {};
    const status = asString(data.status || 'draft').toLowerCase();
    const slug = normalizeRoute(data.slug);
    const legacyPaths = asStringArray(data.legacy_paths).map(normalizeRoute).filter(Boolean);
    const ownedRoutes = [slug, ...legacyPaths].filter(Boolean);

    if (!['draft', 'published', 'archived'].includes(status)) {
      failures.push(`${relativePath} 的 status 无效：${status}`);
    }

    if (status === 'published') {
      publishedCount += 1;
      for (const field of ['title', 'slug', 'date', 'summary']) {
        if (!asString(data[field])) failures.push(`${relativePath} 缺少 ${field}`);
      }
      if (!parsed.content.trim()) failures.push(`${relativePath} 正文为空`);
      if (slug.includes('/') || /[?#]/.test(slug)) {
        failures.push(`${relativePath} 的 slug 必须是单层安全路径：${slug}`);
      }

      const cover = asString(data.cover || data.image);
      if (!cover) warnings.push(`${relativePath} 没有 cover`);
      if (!isStablePublishedAsset(cover)) {
        failures.push(`${relativePath} 的 cover 不是稳定公开地址：${cover}`);
      }

      const unsafeBody = parsed.content.match(
        /(?:file:\/\/|\/Volumes\/|file\.notion\.so|expirationTimestamp=|X-Amz-Signature=)/i
      );
      if (unsafeBody) {
        failures.push(`${relativePath} 正文含本机路径或临时签名地址：${unsafeBody[0]}`);
      }
    } else if (status === 'draft') {
      draftCount += 1;
    }

    for (const route of ownedRoutes) {
      const previous = routes.get(route);
      if (previous) failures.push(`路由冲突：${route} 同时属于 ${previous} 和 ${relativePath}`);
      routes.set(route, relativePath);
    }
  }

  validateConfig(contentDir, 'notices.yml', failures);
  validateConfig(contentDir, 'submenus.yml', failures);

  if (failures.length) {
    console.error('❌ Obsidian 内容库校验失败：');
    failures.forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
  }

  warnings.forEach((warning) => console.warn(`⚠️ ${warning}`));
  console.log(
    `✅ Obsidian 内容库校验通过：${publishedCount} 篇已发布，${draftCount} 篇草稿，${routes.size} 条路由`
  );
}

main();
