#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const YAML = require('yaml');

const DEFAULT_CONTENT_DIR = path.resolve(__dirname, '..', '..', 'blog-content');
const DEFAULT_ASSET_ROOT = '/Volumes/BigDisk/通用素材/图片素材/blog-content';
const VALID_STATUSES = new Set(['draft', 'published', 'archived']);

function parseArgs(argv) {
  if (!argv.length || argv[0].startsWith('--')) {
    throw new Error('用法：node scripts/import-article-content.js <article_content.json> --slug <slug> [--status draft]');
  }
  const args = {
    input: argv[0],
    contentDir: process.env.BLOG_CONTENT_DIR || DEFAULT_CONTENT_DIR,
    assetRoot: process.env.BLOG_ASSET_ROOT || DEFAULT_ASSET_ROOT,
    slug: '',
    status: 'draft',
    categories: [],
    tags: [],
    force: false,
  };
  for (let index = 1; index < argv.length; index += 1) {
    const option = argv[index];
    if (option === '--force') {
      args.force = true;
      continue;
    }
    const value = argv[index + 1];
    if (!value) throw new Error(`${option} 缺少值`);
    if (option === '--content-dir') args.contentDir = value;
    else if (option === '--asset-root') args.assetRoot = value;
    else if (option === '--slug') args.slug = value;
    else if (option === '--status') args.status = value;
    else if (option === '--category') args.categories.push(value);
    else if (option === '--tag') args.tags.push(value);
    else throw new Error(`未知参数：${option}`);
    index += 1;
  }
  return args;
}

function ensureInside(root, target, label) {
  const relative = path.relative(root, target);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`${label} 不在允许目录内：${target}`);
  }
}

function hashFile(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function cleanName(value) {
  const cleaned = String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned || 'image';
}

function detectedExtension(filePath) {
  const header = fs.readFileSync(filePath).subarray(0, 12);
  if (header.length >= 8 && header.subarray(0, 8).equals(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  )) return '.png';
  if (header.length >= 3 && header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
    return '.jpg';
  }
  if (header.length >= 6 && ['GIF87a', 'GIF89a'].includes(header.subarray(0, 6).toString('ascii'))) {
    return '.gif';
  }
  if (
    header.length >= 12
    && header.subarray(0, 4).toString('ascii') === 'RIFF'
    && header.subarray(8, 12).toString('ascii') === 'WEBP'
  ) return '.webp';
  return path.extname(filePath).toLowerCase() || '.bin';
}

function copyAsset(sourcePath, slug, key, assetRoot, previewRoot) {
  const source = path.resolve(sourcePath);
  if (!fs.existsSync(source) || !fs.statSync(source).isFile()) {
    throw new Error(`素材不存在：${source}`);
  }
  const extension = detectedExtension(source);
  const hash = hashFile(source).slice(0, 10);
  const fileName = `${cleanName(key)}-${hash}${extension}`;
  const articleAssetRoot = path.join(assetRoot, slug);
  const target = path.join(articleAssetRoot, fileName);
  ensureInside(assetRoot, target, '文章素材目标');
  fs.mkdirSync(articleAssetRoot, { recursive: true });
  if (!fs.existsSync(target) || hashFile(target) !== hashFile(source)) fs.copyFileSync(source, target);

  const articlePreviewRoot = path.join(previewRoot, slug);
  const previewTarget = path.join(articlePreviewRoot, fileName);
  ensureInside(previewRoot, previewTarget, 'Obsidian 预览素材目标');
  fs.mkdirSync(articlePreviewRoot, { recursive: true });
  if (!fs.existsSync(previewTarget) || hashFile(previewTarget) !== hashFile(source)) {
    fs.copyFileSync(source, previewTarget);
  }
  return {
    publicUrl: `https://hyphentech.top/obsidian-assets/${encodeURIComponent(slug)}/${encodeURIComponent(fileName)}`,
    previewUrl: `../preview-assets/${encodeURIComponent(slug)}/${encodeURIComponent(fileName)}`,
  };
}

function escapeTableCell(value) {
  return String(value ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, '<br>');
}

function tableMarkdown(headers, rows, note) {
  const safeHeaders = (headers || []).map(escapeTableCell);
  if (!safeHeaders.length) return '';
  const lines = [
    `| ${safeHeaders.join(' | ')} |`,
    `| ${safeHeaders.map(() => '---').join(' | ')} |`,
    ...(rows || []).map((row) => `| ${(row || []).map(escapeTableCell).join(' | ')} |`),
  ];
  if (note) lines.push('', `> ${note}`);
  return lines.join('\n');
}

function callout(type, text, title = '') {
  const body = String(text || '')
    .split(/\r?\n/)
    .map((line) => `> ${line}`)
    .join('\n');
  return `> [!${type}]${title ? ` ${title}` : ''}\n${body}`;
}

function resolveImage(block, specs, assetUrls) {
  const key = String(block.key || '');
  if (assetUrls[key]) return assetUrls[key];
  const spec = specs[key] || {};
  const source = String(spec.src || spec.url || block.url || '').trim();
  if (/^https?:\/\//i.test(source)) return source;
  return '';
}

function renderContent(content, specs, assetUrls) {
  const output = [];
  for (const block of content || []) {
    const type = String(block.type || '');
    if (type === 'hero') {
      const details = [block.subtitle, block.byline].filter(Boolean).join('\n');
      if (details) output.push(callout('abstract', details));
    } else if (type === 'img') {
      const url = resolveImage(block, specs, assetUrls);
      if (!url) throw new Error(`图片块缺少可发布素材：${block.key || '未命名'}`);
      output.push(`![${String(block.caption || block.title || block.key || '文章配图').replace(/^#\s*/, '')}](${url})`);
    } else if (type === 'h2') output.push(`## ${block.text || ''}`);
    else if (type === 'h3') output.push(`### ${block.text || ''}`);
    else if (type === 'p') output.push(String(block.text || ''));
    else if (type === 'project_card') {
      const fields = (block.fields || []).map(([key, value]) => `- **${key}**：${value}`).join('\n');
      const links = (block.links || []).map(([label, url]) => `- [${label}](${url})`).join('\n');
      output.push(`### ${block.name || '项目'}\n\n${block.desc || ''}\n\n${[fields, links].filter(Boolean).join('\n')}`);
    } else if (type === 'tip') output.push(callout('tip', block.text, block.title));
    else if (type === 'warn') output.push(callout('warning', block.text, block.title));
    else if (type === 'bullets') output.push((block.items || []).map((item) => `- ${item}`).join('\n'));
    else if (type === 'table') output.push(tableMarkdown(block.headers, block.rows, block.note));
    else if (type === 'card') output.push(callout('info', block.body, block.title));
    else if (type === 'divider') output.push('---');
    else if (type === 'quote') output.push(String(block.text || '').split(/\r?\n/).map((line) => `> ${line}`).join('\n'));
    else if (type === 'name_reveal') output.push(`## ${block.name || ''}\n\n${block.subtitle || ''}`);
    else if (type === 'number_highlight') {
      output.push(callout('important', `${block.number || ''} — ${block.label || ''}\n${block.sublabel || ''}`));
    } else if (type === 'highlight_box') output.push(callout('important', block.text));
    else if (type === 'dark_quote') {
      const quote = String(block.text || '').split(/\r?\n/).map((line) => `> ${line}`).join('\n');
      output.push(`${quote}${block.attribution ? `\n>\n> ${block.attribution}` : ''}`);
    } else if (type === 'tau_symbol') output.push('τ — 时间，将是最终的裁判。');
    else if (type === 'summary') output.push(callout('summary', block.text, block.title || '总结'));
    else if (type === 'code') {
      output.push(`\`\`\`${block.lang || ''}\n${block.text || ''}\n\`\`\`${block.caption ? `\n\n${block.caption}` : ''}`);
    } else {
      throw new Error(`暂不支持的 CONTENT block：${type || '空类型'}`);
    }
  }
  return `${output.filter((item) => String(item || '').trim()).join('\n\n')}\n`;
}

function shanghaiDate() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const input = path.resolve(args.input);
  const contentDir = path.resolve(args.contentDir);
  const assetRoot = path.resolve(args.assetRoot);
  const previewRoot = path.join(contentDir, 'preview-assets');
  const article = JSON.parse(fs.readFileSync(input, 'utf8'));
  const slug = String(args.slug || article.slug || '').trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`slug 无效：${slug || '空'}`);
  if (!VALID_STATUSES.has(args.status)) throw new Error(`status 无效：${args.status}`);
  if (!article.title || !article.digest || !Array.isArray(article.content)) {
    throw new Error('article_content.json 必须包含 title、digest、content[]');
  }

  const postPath = path.join(contentDir, 'posts', `${slug}.md`);
  ensureInside(contentDir, postPath, '文章目标');
  const exists = fs.existsSync(postPath);
  if (exists && !args.force) throw new Error(`文章已存在，拒绝覆盖：${postPath}；确认更新时加 --force`);
  const existing = exists ? matter(fs.readFileSync(postPath, 'utf8')).data || {} : {};

  const specs = article.specs || {};
  const assetUrls = {};
  for (const [key, spec] of Object.entries(specs)) {
    const source = String(spec?.src || spec?.path || '').trim();
    if (source && !/^https?:\/\//i.test(source)) {
      assetUrls[key] = copyAsset(source, slug, `image-${key}`, assetRoot, previewRoot).previewUrl;
    }
  }
  const coverSource = String(article.cover_wide || article.cover || '').trim();
  let cover = String(existing.cover || '');
  if (coverSource && !/^https?:\/\//i.test(coverSource)) {
    cover = copyAsset(coverSource, slug, 'cover', assetRoot, previewRoot).previewUrl;
  } else if (/^https?:\/\//i.test(coverSource)) cover = coverSource;

  const today = shanghaiDate();
  const date = String(article.date || existing.date || today).slice(0, 10);
  const frontmatter = {
    ...existing,
    title: String(article.title).trim(),
    slug,
    status: args.status,
    date,
    updated: today,
    summary: String(article.digest).trim(),
    categories: args.categories.length ? args.categories : existing.categories || ['学习思考'],
    tags: args.tags.length ? args.tags : existing.tags || ['AI'],
    cover,
    legacy_paths: Array.isArray(existing.legacy_paths) ? existing.legacy_paths : [],
  };
  const body = renderContent(article.content, specs, assetUrls);
  const raw = `---\n${YAML.stringify(frontmatter, { lineWidth: 0 })}---\n\n${body}`;
  fs.mkdirSync(path.dirname(postPath), { recursive: true });
  const temporary = `${postPath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, raw, 'utf8');
  fs.renameSync(temporary, postPath);
  console.log(`✅ 已写入 Obsidian Blog ${args.status}：${postPath}`);
  console.log(`   素材目录：${path.join(assetRoot, slug)}（${Object.keys(assetUrls).length + (cover ? 1 : 0)} 个引用）`);
  console.log(`   Obsidian 本地预览：${path.join(previewRoot, slug)}`);
}

try {
  main();
} catch (error) {
  console.error(`❌ 导入 article_content.json 失败：${error.message}`);
  process.exit(1);
}
