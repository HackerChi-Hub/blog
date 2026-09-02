import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import YAML from 'yaml';

const PUBLISHED_STATUS = 'published';
const MARKDOWN_EXTENSIONS = new Set(['.md', '.markdown']);
const BACKUP_MARKDOWN_RE = /\.(?:bak|backup)\.md(?:own)?$/i;

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: false,
});

const OBSIDIAN_CALLOUT_LABELS = {
  note: '提示',
  abstract: '摘要',
  summary: '摘要',
  info: '信息',
  todo: '待办',
  tip: '建议',
  hint: '建议',
  important: '重点',
  success: '完成',
  check: '完成',
  question: '问题',
  help: '帮助',
  warning: '警告',
  caution: '注意',
  failure: '失败',
  danger: '危险',
  bug: '问题',
  example: '示例',
  quote: '引用',
};

const defaultLinkOpen =
  markdown.renderer.rules.link_open ||
  ((tokens, index, options, _environment, self) =>
    self.renderToken(tokens, index, options));

markdown.renderer.rules.link_open = (tokens, index, options, environment, self) => {
  const hrefIndex = tokens[index].attrIndex('href');
  const href = hrefIndex >= 0 ? tokens[index].attrs[hrefIndex][1] : '';
  if (/^https?:\/\//i.test(href)) {
    tokens[index].attrSet('target', '_blank');
    tokens[index].attrSet('rel', 'noreferrer noopener');
  }
  return defaultLinkOpen(tokens, index, options, environment, self);
};

export function getContentDir() {
  const configured = String(process.env.BLOG_CONTENT_DIR || '').trim();
  return configured
    ? path.resolve(configured)
    : path.resolve(process.cwd(), '..', 'blog-content');
}

export function getPostsDir() {
  return path.join(getContentDir(), 'posts');
}

function walkMarkdownFiles(directory) {
  if (!fs.existsSync(directory)) return [];

  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || BACKUP_MARKDOWN_RE.test(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(absolutePath));
      continue;
    }
    if (entry.isFile() && MARKDOWN_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(absolutePath);
    }
  }
  return files.sort((left, right) => left.localeCompare(right, 'zh-CN'));
}

function asString(value) {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).trim();
}

function asStringArray(value) {
  if (Array.isArray(value)) {
    return value.map(asString).filter(Boolean);
  }
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

function normalizeSlug(value) {
  const slug = normalizeRoute(value);
  if (!slug) return '';
  if (slug.includes('/')) {
    throw new Error(`slug 只能是单层路径，不能包含“/”：${slug}`);
  }
  if (/[?#]/.test(slug)) {
    throw new Error(`slug 不能包含“?”或“#”：${slug}`);
  }
  return slug;
}

function normalizeTaxonomy(values, prefix) {
  return asStringArray(values).map((name, index) => ({
    id: `${prefix}-${index}-${name}`,
    name,
    color: 'default',
  }));
}

function preprocessObsidianMarkdown(source) {
  return source
    .replace(
      /^>[ \t]*\[!([a-z-]+)\][+-]?[ \t]*(.*)$/gim,
      (_match, type, title) => {
        const label = OBSIDIAN_CALLOUT_LABELS[String(type).toLowerCase()] || '提示';
        const heading = String(title || '').trim();
        return `> **${heading ? `${label}：${heading}` : label}**`;
      }
    )
    .replace(/!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_match, target, alt) => {
      const cleanTarget = target.trim();
      const label = (alt || path.basename(cleanTarget)).trim();
      return `![${label}](${cleanTarget.replace(/ /g, '%20')})`;
    })
    .replace(/(?<!!)\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g, (_match, target, heading, label) => {
      const cleanTarget = target.trim();
      const cleanHeading = heading ? `#${heading.trim().replace(/\s+/g, '-')}` : '';
      const text = (label || heading || cleanTarget).trim();
      return `[${text}](/${encodeURIComponent(cleanTarget)}/${cleanHeading})`;
    });
}

function assertPublishedPost(post, filePath) {
  const missing = [];
  if (!post.title) missing.push('title');
  if (!post.slug) missing.push('slug');
  if (!post.date) missing.push('date');
  if (!post.summary) missing.push('summary');
  if (missing.length) {
    throw new Error(
      `${path.relative(getContentDir(), filePath)} 已标记 published，但缺少：${missing.join(', ')}`
    );
  }
}

function parseMarkdownFile(filePath, { renderBody = false } = {}) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const status = asString(parsed.data.status || 'draft').toLowerCase();
  const slug = normalizeSlug(parsed.data.slug);
  const legacyPaths = [...new Set(asStringArray(parsed.data.legacy_paths).map(normalizeRoute))]
    .filter(Boolean)
    .filter((legacyPath) => legacyPath !== slug);
  const categories = normalizeTaxonomy(parsed.data.categories, 'markdown-category');
  const tags = normalizeTaxonomy(parsed.data.tags, 'markdown-tag');
  const cover = asString(parsed.data.cover || parsed.data.image);
  const title = asString(parsed.data.title);
  const date = asString(parsed.data.date);
  const updated = asString(parsed.data.updated || parsed.data.date);
  const summary = asString(parsed.data.summary);
  const id = asString(parsed.data.id || `obsidian:${slug || path.basename(filePath)}`);
  const markdownSource = preprocessObsidianMarkdown(parsed.content.trim());

  const post = {
    id,
    rawId: id,
    slug,
    legacyPaths,
    title,
    date,
    updated,
    summary,
    categories,
    categoryNames: categories.map((category) => category.name),
    tags,
    pageCover: cover || null,
    cover: cover || null,
    source: 'markdown',
    status,
    sourcePath: path.relative(getContentDir(), filePath),
  };

  if (status === PUBLISHED_STATUS) assertPublishedPost(post, filePath);

  if (renderBody) {
    post.markdownSource = markdownSource;
    post.markdownHtml = markdown.render(markdownSource);
  }

  return post;
}

function assertUniqueRoutes(posts) {
  const owners = new Map();
  for (const post of posts) {
    for (const route of [post.slug, ...(post.legacyPaths || [])].filter(Boolean)) {
      const previous = owners.get(route);
      if (previous) {
        throw new Error(
          `Markdown 路由冲突：${route} 同时属于 ${previous.sourcePath} 和 ${post.sourcePath}`
        );
      }
      owners.set(route, post);
    }
  }
}

export function getMarkdownPosts({ includeDrafts = false } = {}) {
  const posts = walkMarkdownFiles(getPostsDir())
    .map((filePath) => parseMarkdownFile(filePath))
    .filter((post) => includeDrafts || post.status === PUBLISHED_STATUS);

  assertUniqueRoutes(posts);
  return posts.sort((left, right) => {
    const dateOrder = String(right.date || '').localeCompare(String(left.date || ''));
    return dateOrder || left.title.localeCompare(right.title, 'zh-CN');
  });
}

export function getMarkdownPostByRoute(route) {
  const normalizedRoute = normalizeRoute(route);
  const posts = walkMarkdownFiles(getPostsDir())
    .map((filePath) => parseMarkdownFile(filePath, { renderBody: true }))
    .filter((post) => post.status === PUBLISHED_STATUS);

  assertUniqueRoutes(posts);
  const post = posts.find(
    (candidate) =>
      candidate.slug === normalizedRoute || candidate.legacyPaths.includes(normalizedRoute)
  );
  if (!post) return null;

  return {
    meta: {
      id: post.id,
      title: post.title,
      date: post.date,
      updated: post.updated,
      summary: post.summary,
      categories: post.categories,
      categoryNames: post.categoryNames,
      tags: post.tags,
      image: post.pageCover,
      coverBlockId: null,
      slug: post.slug,
      legacyPaths: post.legacyPaths,
      source: 'markdown',
    },
    markdownHtml: post.markdownHtml,
    markdownSource: post.markdownSource,
  };
}

export function loadContentConfig(fileName) {
  const filePath = path.join(getContentDir(), 'config', fileName);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = YAML.parse(raw);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error(`内容配置不是有效对象：${path.relative(getContentDir(), filePath)}`);
  }
  return parsed;
}
