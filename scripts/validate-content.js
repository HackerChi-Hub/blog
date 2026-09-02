#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const YAML = require('yaml');

const VALID_STATUSES = new Set(['draft', 'published', 'archived']);
const SAFE_ROUTE_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const BACKUP_MARKDOWN_RE = /\.(?:bak|backup)\.md(?:own)?$/i;
const TEMPORARY_ASSET_RE =
  /(?:file:\/\/|\/Volumes\/|amazonaws\.com|expirationTimestamp=|X-Amz-(?:Signature|Credential|Expires)=)/i;
const LOCAL_PREVIEW_ASSET_RE = /^(?:\.\.\/)?preview-assets\//i;

function parseArgs(argv) {
  const args = { contentDir: process.env.BLOG_CONTENT_DIR || '' };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] !== '--content-dir') throw new Error(`未知参数：${argv[index]}`);
    args.contentDir = argv[index + 1] || '';
    if (!args.contentDir) throw new Error('--content-dir 缺少值');
    index += 1;
  }
  return args;
}

function walkMarkdownFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || BACKUP_MARKDOWN_RE.test(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkMarkdownFiles(absolutePath));
    if (entry.isFile() && /\.md(?:own)?$/i.test(entry.name)) files.push(absolutePath);
  }
  return files.sort((left, right) => left.localeCompare(right, 'zh-CN'));
}

function asString(value) {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).trim();
}

function asStringArray(value) {
  if (Array.isArray(value)) return value.map(asString).filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeRoute(value) {
  return asString(value).replace(/^\/+|\/+$/g, '');
}

function validDate(value) {
  const text = asString(value);
  if (!DATE_RE.test(text)) return false;
  const parsed = new Date(`${text}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === text;
}

function isStablePublishedAsset(value) {
  if (!value || TEMPORARY_ASSET_RE.test(value)) return false;
  return /^(?:https:\/\/hyphentech\.top)?\/obsidian-assets\//i.test(value)
    || LOCAL_PREVIEW_ASSET_RE.test(value);
}

function validatePreviewAsset(contentDir, value, label, failures) {
  const raw = asString(value).replace(/[?#].*$/, '');
  if (!LOCAL_PREVIEW_ASSET_RE.test(raw)) return;
  let decoded;
  try {
    decoded = decodeURIComponent(raw);
  } catch (error) {
    failures.push(`${label} 的本地预览路径编码无效：${raw}`);
    return;
  }
  if (decoded.includes('\\') || decoded.includes('\0')) {
    failures.push(`${label} 的本地预览路径无效：${raw}`);
    return;
  }
  const relative = decoded.replace(/^\.\.\//, '').replace(/^preview-assets\//, '');
  const normalized = path.posix.normalize(relative);
  if (!normalized || normalized === '.' || normalized === '..' || normalized.startsWith('../')) {
    failures.push(`${label} 的本地预览路径越界：${raw}`);
    return;
  }
  const previewRoot = path.resolve(contentDir, 'preview-assets');
  const target = path.resolve(previewRoot, ...normalized.split('/'));
  const targetRelative = path.relative(previewRoot, target);
  if (!targetRelative || targetRelative.startsWith('..') || path.isAbsolute(targetRelative)) {
    failures.push(`${label} 的本地预览路径越界：${raw}`);
  } else if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    failures.push(`${label} 的本地预览素材不存在：${raw}`);
  }
}

function validateRoute(route, label, failures) {
  if (!route) return;
  if (!SAFE_ROUTE_RE.test(route)) {
    failures.push(`${label} 必须是单层小写英文/数字/连字符路径：${route}`);
  }
}

function validateUrl(value, label, failures, { allowRelative = false } = {}) {
  const raw = asString(value);
  if (!raw) {
    failures.push(`${label} 为空`);
    return;
  }
  if (allowRelative && /^\/(?!\/)/.test(raw)) return;
  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) failures.push(`${label} 协议无效：${raw}`);
  } catch (error) {
    failures.push(`${label} 不是有效网址：${raw}`);
  }
}

function validateConfig(contentDir, fileName, failures, warnings) {
  const filePath = path.join(contentDir, 'config', fileName);
  if (!fs.existsSync(filePath)) {
    failures.push(`缺少站点配置：config/${fileName}`);
    return;
  }
  try {
    const config = YAML.parse(fs.readFileSync(filePath, 'utf8'));
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
      failures.push(`${fileName} 不是有效对象`);
      return;
    }
    if (typeof config.enabled !== 'boolean') failures.push(`${fileName} 的 enabled 必须是布尔值`);
    if (!Array.isArray(config.items)) {
      failures.push(`${fileName} 的 items 必须是数组`);
      return;
    }
    const ids = new Set();
    config.items.forEach((item, index) => {
      const label = `${fileName} items[${index}]`;
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        failures.push(`${label} 不是对象`);
        return;
      }
      const id = asString(item.id);
      if (!id) failures.push(`${label} 缺少 id`);
      else if (ids.has(id)) failures.push(`${fileName} 的 id 重复：${id}`);
      else ids.add(id);
      if (!asString(item.title)) failures.push(`${label} 缺少 title`);
      if (fileName === 'notices.yml') {
        if (item.date && !validDate(item.date)) failures.push(`${label} 的 date 无效：${item.date}`);
        const image = asString(item.image);
        if (image && !isStablePublishedAsset(image)) {
          failures.push(`${label} 的 image 不是 Blog 稳定素材地址：${image}`);
        }
      }
      if (fileName === 'submenus.yml') {
        validateUrl(item.url, `${label} 的 url`, failures, { allowRelative: true });
      }
    });
    if (config.enabled && config.items.length === 0) warnings.push(`${fileName} 已启用但没有 items`);
  } catch (error) {
    failures.push(`${fileName} 无法解析：${error.message}`);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const contentDir = path.resolve(args.contentDir || path.join(process.cwd(), '..', 'blog-content'));
  const postsDir = path.join(contentDir, 'posts');
  const files = walkMarkdownFiles(postsDir);
  const failures = [];
  const warnings = [];
  const routes = new Map();
  const postRecords = [];
  let publishedCount = 0;
  let draftCount = 0;
  let archivedCount = 0;

  if (!fs.existsSync(contentDir)) failures.push(`内容库不存在：${contentDir}`);
  if (!fs.existsSync(postsDir)) failures.push(`文章目录不存在：${postsDir}`);

  for (const filePath of files) {
    const relativePath = path.relative(contentDir, filePath).split(path.sep).join('/');
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
    const body = parsed.content.trim();

    const coverValue = asString(data.cover || data.image);
    validatePreviewAsset(contentDir, coverValue, `${relativePath} 的 cover`, failures);
    const previewPattern = /(?:\.\.\/)?preview-assets\/([^\s)"'<>\]]+)/g;
    for (const match of body.matchAll(previewPattern)) {
      validatePreviewAsset(contentDir, match[0], `${relativePath} 的正文图片`, failures);
    }

    if (!VALID_STATUSES.has(status)) failures.push(`${relativePath} 的 status 无效：${status}`);
    validateRoute(slug, `${relativePath} 的 slug`, failures);
    legacyPaths.forEach((route) => validateRoute(route, `${relativePath} 的 legacy_paths`, failures));
    if (slug && path.basename(filePath).replace(/\.md(?:own)?$/i, '') !== slug) {
      failures.push(`${relativePath} 的文件名必须与 slug 一致：${slug}.md`);
    }
    if (data.legacy_paths !== undefined && !Array.isArray(data.legacy_paths)) {
      failures.push(`${relativePath} 的 legacy_paths 必须是 YAML 数组`);
    }
    if (data.categories !== undefined && !Array.isArray(data.categories)) {
      failures.push(`${relativePath} 的 categories 必须是 YAML 数组`);
    }
    if (data.tags !== undefined && !Array.isArray(data.tags)) {
      failures.push(`${relativePath} 的 tags 必须是 YAML 数组`);
    }

    if (status === 'published') {
      publishedCount += 1;
      for (const field of ['title', 'slug', 'date', 'summary']) {
        if (!asString(data[field])) failures.push(`${relativePath} 缺少 ${field}`);
      }
      if (!body) failures.push(`${relativePath} 正文为空`);
      if (!validDate(data.date)) failures.push(`${relativePath} 的 date 不是有效 YYYY-MM-DD：${data.date}`);
      if (data.updated && !validDate(data.updated)) {
        failures.push(`${relativePath} 的 updated 不是有效 YYYY-MM-DD：${data.updated}`);
      }
      if (validDate(data.date) && validDate(data.updated) && asString(data.updated) < asString(data.date)) {
        failures.push(`${relativePath} 的 updated 早于 date`);
      }
      if (asStringArray(data.categories).length === 0) failures.push(`${relativePath} 至少需要一个 category`);
      const cover = coverValue;
      if (!isStablePublishedAsset(cover)) {
        failures.push(`${relativePath} 的 cover 必须是本地 preview-assets 或 /obsidian-assets/ 稳定地址：${cover || '空'}`);
      }
      const unsafeBody = body.match(TEMPORARY_ASSET_RE);
      if (unsafeBody) failures.push(`${relativePath} 正文含本机路径或临时素材地址：${unsafeBody[0]}`);
      if (/!\[\[[^\]]+\]\]/.test(body)) {
        failures.push(`${relativePath} 含 Obsidian 私有附件嵌入；发布前请改为 /obsidian-assets/ 地址`);
      }
    } else if (status === 'draft') draftCount += 1;
    else if (status === 'archived') archivedCount += 1;

    for (const route of ownedRoutes) {
      const previous = routes.get(route);
      if (previous) failures.push(`路由冲突：${route} 同时属于 ${previous} 和 ${relativePath}`);
      else routes.set(route, relativePath);
    }
    postRecords.push({ relativePath, slug, legacyPaths, body });
  }

  const knownRoutes = new Set(routes.keys());
  for (const post of postRecords) {
    const pattern = /(?<!!)\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;
    for (const match of post.body.matchAll(pattern)) {
      const target = normalizeRoute(match[1]);
      if (target && !knownRoutes.has(target)) {
        failures.push(`${post.relativePath} 的双链目标不存在：${target}`);
      }
    }
  }

  validateConfig(contentDir, 'notices.yml', failures, warnings);
  validateConfig(contentDir, 'submenus.yml', failures, warnings);

  if (failures.length) {
    console.error('❌ Obsidian 内容库校验失败：');
    failures.forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
  }
  warnings.forEach((warning) => console.warn(`⚠️ ${warning}`));
  console.log(
    `✅ Obsidian 内容库校验通过：${publishedCount} 篇已发布，${draftCount} 篇草稿，` +
      `${archivedCount} 篇归档，${routes.size} 条路由`
  );
}

try {
  main();
} catch (error) {
  console.error(`❌ Obsidian 内容库校验失败：${error.message}`);
  process.exit(1);
}
