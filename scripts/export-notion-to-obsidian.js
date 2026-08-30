#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { Client } = require('@notionhq/client');
const YAML = require('yaml');

const DEFAULT_ASSET_ROOT = '/Volumes/BigDisk/通用素材/图片素材/blog-content';
const DEFAULT_BASE_URL = 'https://hyphentech.top/obsidian-assets';
const UUID_ROUTE = /^[0-9a-f]{32}$/i;
const MIGRATION_ASSET_OVERRIDES = {
  '7e6115d6-45c2-4f45-a2cb-a418c7d7ae6f': 'network-troubleshooting-map.svg',
  'f6314ee7-f34f-4658-ad34-daf3c5cb4bf8': 'home-wifi-placement.svg',
};

function parseArgs(argv) {
  const args = {
    contentDir: path.resolve(process.cwd(), '..', 'blog-content'),
    assetRoot: DEFAULT_ASSET_ROOT,
    publicRoot: path.resolve(process.cwd(), 'public', 'obsidian-assets'),
    baseUrl: DEFAULT_BASE_URL,
    inventoryOnly: false,
    overwrite: false,
    limit: 0,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === '--inventory-only') args.inventoryOnly = true;
    else if (key === '--overwrite') args.overwrite = true;
    else if (key === '--content-dir') args.contentDir = path.resolve(argv[++index]);
    else if (key === '--asset-root') args.assetRoot = path.resolve(argv[++index]);
    else if (key === '--public-root') args.publicRoot = path.resolve(argv[++index]);
    else if (key === '--base-url') args.baseUrl = String(argv[++index]).replace(/\/$/, '');
    else if (key === '--limit') args.limit = Number(argv[++index]) || 0;
    else throw new Error(`未知参数：${key}`);
  }
  args.backupRoot = path.join(args.contentDir, 'migration', 'backups');
  return args;
}

function ensureEnvironment() {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    throw new Error('缺少 NOTION_TOKEN 或 NOTION_DATABASE_ID');
  }
}

function ensureDirectory(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry(label, action, attempts = 5) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      const status = Number(error?.status || error?.statusCode || 0);
      if (attempt === attempts || (status > 0 && status < 429)) throw error;
      const retryAfter = Number(error?.headers?.['retry-after'] || 0);
      const waitMs = retryAfter > 0 ? retryAfter * 1000 : attempt * 900;
      console.warn(`⚠️ ${label} 第 ${attempt} 次失败，${waitMs}ms 后重试`);
      await sleep(waitMs);
    }
  }
  throw lastError;
}

function extractPlainText(richText = []) {
  return (Array.isArray(richText) ? richText : [])
    .map((item) => item?.plain_text || item?.text?.content || '')
    .join('')
    .trim();
}

function collectSelectNames(property = {}) {
  if (Array.isArray(property?.multi_select)) {
    return property.multi_select.map((item) => item?.name).filter(Boolean);
  }
  if (property?.select?.name) return [property.select.name];
  return [];
}

function resolveExternalUrl(property) {
  if (!property) return '';
  if (property.url) return String(property.url).trim();
  const item = property.rich_text?.[0];
  return String(item?.href || item?.plain_text || '').trim();
}

function pageFileUrl(value) {
  if (!value) return '';
  const payload = value[value.type];
  return String(payload?.url || '').trim();
}

function pageToPost(page) {
  const props = page.properties || {};
  const idNoDashes = page.id.replace(/-/g, '');
  const configuredSlug = extractPlainText(props.slug?.rich_text);
  const slug = configuredSlug || idNoDashes;
  return {
    id: page.id,
    slug,
    rawId: idNoDashes,
    title: extractPlainText(props.title?.title) || '未命名文章',
    date: props.date?.date?.start || null,
    summary: extractPlainText(props.summary?.rich_text),
    categories: collectSelectNames(props.category),
    tags: collectSelectNames(props.tags),
    pageCover: pageFileUrl(page.cover),
    isUuidRoute: UUID_ROUTE.test(slug),
  };
}

async function queryDatabase(notion, type, { direction = 'descending', limit = 0 } = {}) {
  const results = [];
  let cursor;

  do {
    const response = await withRetry(`查询 ${type}`, () =>
      notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        filter: {
          and: [
            { property: 'type', select: { equals: type } },
            { property: 'status', select: { equals: 'Published' } },
          ],
        },
        sorts: [{ property: 'date', direction }],
        page_size: 100,
        start_cursor: cursor,
      })
    );
    results.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
    if (limit && results.length >= limit) break;
  } while (cursor);

  return limit ? results.slice(0, limit) : results;
}

async function getBlockChildren(notion, blockId) {
  const children = [];
  let cursor;

  do {
    const response = await withRetry(`读取块 ${blockId.slice(0, 8)}`, () =>
      notion.blocks.children.list({
        block_id: blockId,
        page_size: 100,
        start_cursor: cursor,
      })
    );

    for (const block of response.results) {
      if (block.has_children) {
        await sleep(120);
        block.children = await getBlockChildren(notion, block.id);
      }
      children.push(block);
    }
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return children;
}

function escapeMarkdownText(value) {
  return String(value || '').replace(/([\\`*_{}\[\]<>])/g, '\\$1');
}

function richTextToMarkdown(richText = []) {
  return (Array.isArray(richText) ? richText : [])
    .map((item) => {
      let text = escapeMarkdownText(
        item?.plain_text || item?.text?.content || item?.equation?.expression || ''
      );
      if (!text) return '';
      const annotations = item.annotations || {};
      if (annotations.code) text = `\`${text.replace(/`/g, '\\`')}\``;
      if (annotations.bold) text = `**${text}**`;
      if (annotations.italic) text = `*${text}*`;
      if (annotations.strikethrough) text = `~~${text}~~`;
      const href = item.href || item.text?.link?.url;
      if (href) text = `[${text}](${href})`;
      return text;
    })
    .join('');
}

function extensionFromContentType(contentType) {
  const normalized = String(contentType || '').split(';')[0].trim().toLowerCase();
  const types = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'application/pdf': '.pdf',
    'video/mp4': '.mp4',
    'audio/mpeg': '.mp3',
    'audio/mp4': '.m4a',
    'audio/wav': '.wav',
  };
  return types[normalized] || '';
}

function extensionFromUrl(url) {
  try {
    const extension = path.extname(new URL(url).pathname).toLowerCase();
    return /^\.[a-z0-9]{1,6}$/.test(extension) ? extension : '';
  } catch {
    return '';
  }
}

function safeBaseName(value) {
  return String(value || 'asset')
    .normalize('NFKC')
    .replace(/\.[a-z0-9]{1,6}$/i, '')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fff_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'asset';
}

async function downloadAsset(url, context, suggestedName, kind, blockId = '') {
  if (!url) return '';
  const overrideFile = MIGRATION_ASSET_OVERRIDES[blockId];
  if (overrideFile) {
    const sourcePath = path.join(context.assetDir, overrideFile);
    const publicPath = path.join(context.publicDir, overrideFile);
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`迁移替代素材不存在：${sourcePath}`);
    }
    ensureDirectory(context.publicDir);
    if (!fs.existsSync(publicPath)) fs.copyFileSync(sourcePath, publicPath);
    const buffer = fs.readFileSync(sourcePath);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    context.assetManifest.push({
      kind,
      block_id: blockId,
      file: overrideFile,
      bytes: buffer.length,
      sha256: hash,
      migration_override: true,
    });
    return `${context.baseUrl}/${encodeURIComponent(context.route)}/${encodeURIComponent(overrideFile)}`;
  }
  let response;
  try {
    response = await withRetry(`下载 ${kind}`, () =>
      fetch(url, {
        redirect: 'follow',
        headers: { 'user-agent': 'hyphentech-notion-migration/1.0' },
      }).then((result) => {
        if (!result.ok) {
          const error = new Error(`HTTP ${result.status}`);
          error.status = result.status;
          throw error;
        }
        return result;
      })
    );
  } catch (error) {
    const isStableExternal =
      /^https?:\/\//i.test(url) &&
      !/(?:file\.notion\.so|notion-static\.com|amazonaws\.com|X-Amz-|expirationTimestamp=)/i.test(url);
    context.warnings.push(
      `${kind} 素材下载失败（${blockId || 'page'}）：${error.message}${
        isStableExternal ? '，暂时保留原外链' : ''
      }`
    );
    return isStableExternal ? url : '';
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  const extension =
    extensionFromContentType(response.headers.get('content-type')) ||
    extensionFromUrl(url) ||
    '.bin';
  const fileName = `${safeBaseName(suggestedName)}-${hash.slice(0, 10)}${extension}`;
  const sourcePath = path.join(context.assetDir, fileName);
  const publicPath = path.join(context.publicDir, fileName);

  ensureDirectory(context.assetDir);
  ensureDirectory(context.publicDir);
  if (!fs.existsSync(sourcePath)) fs.writeFileSync(sourcePath, buffer);
  if (!fs.existsSync(publicPath)) fs.copyFileSync(sourcePath, publicPath);

  context.assetManifest.push({
    kind,
    block_id: blockId || null,
    file: fileName,
    bytes: buffer.length,
    sha256: hash,
  });
  return `${context.baseUrl}/${encodeURIComponent(context.route)}/${encodeURIComponent(fileName)}`;
}

function blockAssetUrl(block) {
  const payload = block?.[block?.type];
  if (!payload) return '';
  const data = payload[payload.type];
  return String(data?.url || payload.url || '').trim();
}

function indentLines(value, spaces = 2) {
  const prefix = ' '.repeat(spaces);
  return String(value || '')
    .split('\n')
    .map((line) => (line ? `${prefix}${line}` : line))
    .join('\n');
}

async function blocksToMarkdown(blocks, context) {
  const fragments = [];

  for (const block of blocks || []) {
    const type = block.type;
    const payload = block[type] || {};
    const children = block.children || [];
    const nested = children.length ? await blocksToMarkdown(children, context) : '';

    if (type === 'paragraph') {
      const text = richTextToMarkdown(payload.rich_text);
      fragments.push([text, nested].filter(Boolean).join('\n\n'));
    } else if (type === 'heading_1') {
      fragments.push(`## ${richTextToMarkdown(payload.rich_text)}${nested ? `\n\n${nested}` : ''}`);
    } else if (type === 'heading_2') {
      fragments.push(`### ${richTextToMarkdown(payload.rich_text)}${nested ? `\n\n${nested}` : ''}`);
    } else if (type === 'heading_3') {
      fragments.push(`#### ${richTextToMarkdown(payload.rich_text)}${nested ? `\n\n${nested}` : ''}`);
    } else if (type === 'bulleted_list_item' || type === 'numbered_list_item') {
      const marker = type === 'numbered_list_item' ? '1.' : '-';
      let line = `${marker} ${richTextToMarkdown(payload.rich_text)}`;
      if (nested) line += `\n${indentLines(nested)}`;
      fragments.push(line);
    } else if (type === 'to_do') {
      const checked = payload.checked ? 'x' : ' ';
      let line = `- [${checked}] ${richTextToMarkdown(payload.rich_text)}`;
      if (nested) line += `\n${indentLines(nested)}`;
      fragments.push(line);
    } else if (type === 'quote') {
      const quote = [richTextToMarkdown(payload.rich_text), nested].filter(Boolean).join('\n\n');
      fragments.push(quote.split('\n').map((line) => `> ${line}`).join('\n'));
    } else if (type === 'callout') {
      const callout = [richTextToMarkdown(payload.rich_text), nested].filter(Boolean).join('\n\n');
      fragments.push(`> [!note]\n${callout.split('\n').map((line) => `> ${line}`).join('\n')}`);
    } else if (type === 'divider') {
      fragments.push('---');
    } else if (type === 'image') {
      context.imageIndex += 1;
      const caption = extractPlainText(payload.caption) || `文章配图 ${context.imageIndex}`;
      const stableUrl = await downloadAsset(
        blockAssetUrl(block),
        context,
        `image-${String(context.imageIndex).padStart(2, '0')}`,
        'image',
        block.id
      );
      if (stableUrl) {
        if (!context.firstImageUrl) context.firstImageUrl = stableUrl;
        fragments.push(`![${escapeMarkdownText(caption)}](${stableUrl})`);
      }
    } else if (type === 'code') {
      const language = String(payload.language || 'text').replace(/[^a-zA-Z0-9_+-]/g, '');
      const code = extractPlainText(payload.rich_text);
      const fence = code.includes('```') ? '````' : '```';
      fragments.push(`${fence}${language}\n${code}\n${fence}`);
    } else if (type === 'toggle') {
      const title = richTextToMarkdown(payload.rich_text) || '展开内容';
      fragments.push(`**${title}**${nested ? `\n\n${nested}` : ''}`);
    } else if (type === 'table') {
      const rows = children.filter((child) => child.type === 'table_row');
      if (rows.length) {
        const cells = rows.map((row) =>
          (row.table_row?.cells || []).map((cell) => richTextToMarkdown(cell).replace(/\|/g, '\\|'))
        );
        const width = Math.max(...cells.map((row) => row.length));
        const normalizedRows = cells.map((row) => [...row, ...Array(width - row.length).fill('')]);
        const lines = [
          `| ${normalizedRows[0].join(' | ')} |`,
          `| ${Array(width).fill('---').join(' | ')} |`,
          ...normalizedRows.slice(1).map((row) => `| ${row.join(' | ')} |`),
        ];
        fragments.push(lines.join('\n'));
      }
    } else if (['column_list', 'column', 'synced_block', 'template'].includes(type)) {
      if (nested) fragments.push(nested);
    } else if (['bookmark', 'link_preview', 'embed'].includes(type)) {
      const url = String(payload.url || '').trim();
      if (url) fragments.push(`[${escapeMarkdownText(extractPlainText(payload.caption) || url)}](${url})`);
    } else if (['video', 'audio', 'file', 'pdf'].includes(type)) {
      context.fileIndex += 1;
      const label =
        payload.name ||
        extractPlainText(payload.caption) ||
        (type === 'pdf' ? '查看 PDF' : type === 'file' ? '下载附件' : `查看${type}`);
      const stableUrl = await downloadAsset(
        blockAssetUrl(block),
        context,
        `${type}-${String(context.fileIndex).padStart(2, '0')}-${label}`,
        type,
        block.id
      );
      if (stableUrl) fragments.push(`[${escapeMarkdownText(label)}](${stableUrl})`);
    } else if (type === 'equation') {
      fragments.push(`$$\n${payload.expression || ''}\n$$`);
    } else if (type === 'child_page') {
      fragments.push(`**子页面：${escapeMarkdownText(payload.title || '未命名')}**${nested ? `\n\n${nested}` : ''}`);
    } else if (type === 'table_row') {
      // table 父块统一渲染。
    } else {
      context.warnings.push(`未支持块类型 ${type}（${block.id}）`);
      if (nested) fragments.push(nested);
    }
  }

  return fragments.filter((fragment) => String(fragment).trim()).join('\n\n');
}

function writeTextSafely(filePath, content, overwrite, backupRoot = '') {
  ensureDirectory(path.dirname(filePath));
  if (fs.existsSync(filePath)) {
    const current = fs.readFileSync(filePath, 'utf8');
    if (current === content) return 'unchanged';
    const isDisabledPlaceholder =
      /enabled:\s*false/.test(current) && /items:\s*\[\s*\]/.test(current);
    if (isDisabledPlaceholder) {
      fs.writeFileSync(filePath, content, 'utf8');
      return 'written';
    }
    if (!overwrite) throw new Error(`目标已存在且内容不同，拒绝覆盖：${filePath}`);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileKey = crypto.createHash('sha256').update(path.resolve(filePath)).digest('hex').slice(0, 12);
    const backupPath = backupRoot
      ? path.join(backupRoot, `${path.basename(filePath)}-${fileKey}.bak-${timestamp}`)
      : `${filePath}.bak-${timestamp}`;
    ensureDirectory(path.dirname(backupPath));
    fs.copyFileSync(filePath, backupPath);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  return 'written';
}

function writeJsonSafely(filePath, value, overwrite = true, backupRoot = '') {
  return writeTextSafely(
    filePath,
    `${JSON.stringify(value, null, 2)}\n`,
    overwrite,
    backupRoot
  );
}

function publicAssetContext(args, route) {
  return {
    route,
    assetDir: path.join(args.assetRoot, route),
    publicDir: path.join(args.publicRoot, route),
    baseUrl: args.baseUrl,
    imageIndex: 0,
    fileIndex: 0,
    firstImageUrl: '',
    assetManifest: [],
    warnings: [],
  };
}

function frontmatterDocument(data, body) {
  const yaml = YAML.stringify(data, { lineWidth: 0 }).trimEnd();
  return `---\n${yaml}\n---\n\n${String(body || '').trim()}\n`;
}

async function exportPost(notion, post, args, index, total) {
  console.log(`→ [${index}/${total}] ${post.slug}｜${post.title}`);
  const postPath = path.join(args.contentDir, 'posts', `${post.slug}.md`);
  if (fs.existsSync(postPath) && !args.overwrite) {
    const manifestPath = path.join(args.assetRoot, post.slug, 'source-manifest.json');
    let existingManifest = { assets: [], warnings: [] };
    if (fs.existsSync(manifestPath)) {
      existingManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    }
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      file: path.relative(args.contentDir, postPath),
      state: 'skipped-existing',
      asset_count: existingManifest.assets?.length || 0,
      warning_count: existingManifest.warnings?.length || 0,
      warnings: existingManifest.warnings || [],
    };
  }
  const context = publicAssetContext(args, post.slug);

  let cover = '';
  if (post.pageCover) {
    cover = await downloadAsset(post.pageCover, context, 'cover', 'cover', post.id);
  }

  const blocks = await getBlockChildren(notion, post.id);
  const body = await blocksToMarkdown(blocks, context);
  if (!cover) cover = context.firstImageUrl;

  const frontmatter = {
    title: post.title,
    slug: post.slug,
    status: 'published',
    date: post.date,
    updated: post.date,
    summary: post.summary || post.title,
    categories: post.categories,
    tags: post.tags,
    cover: cover || '',
    legacy_paths: [],
    notion_id: post.id,
  };

  const result = writeTextSafely(
    postPath,
    frontmatterDocument(frontmatter, body),
    args.overwrite,
    args.backupRoot
  );
  const manifest = {
    article_slug: post.slug,
    notion_id: post.id,
    generated_at: new Date().toISOString(),
    assets: context.assetManifest,
    warnings: context.warnings,
  };
  writeJsonSafely(
    path.join(context.assetDir, 'source-manifest.json'),
    manifest,
    true,
    args.backupRoot
  );
  writeJsonSafely(
    path.join(context.publicDir, 'source-manifest.json'),
    manifest,
    true,
    args.backupRoot
  );

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    file: path.relative(args.contentDir, postPath),
    state: result,
    asset_count: context.assetManifest.length,
    warning_count: context.warnings.length,
    warnings: context.warnings,
  };
}

async function exportNotices(notion, args) {
  const pages = await queryDatabase(notion, 'Notice', { direction: 'descending' });
  const items = [];

  for (let index = 0; index < pages.length; index += 1) {
    const page = pages[index];
    const props = page.properties || {};
    const route = `notices/${page.id.replace(/-/g, '')}`;
    const context = publicAssetContext(args, route);
    let image = pageFileUrl(page.icon) || pageFileUrl(page.cover);
    if (image) image = await downloadAsset(image, context, 'notice', 'notice', page.id);
    if (!image) {
      const blocks = await getBlockChildren(notion, page.id);
      await blocksToMarkdown(blocks, context);
      image = context.firstImageUrl;
    }
    items.push({
      id: page.id,
      title: extractPlainText(props.title?.title) || '未命名公告',
      summary: extractPlainText(props.summary?.rich_text),
      date: props.date?.date?.start || null,
      image: image || null,
      image_caption: null,
    });
  }

  const yaml = YAML.stringify({ enabled: true, items }, { lineWidth: 0 });
  writeTextSafely(
    path.join(args.contentDir, 'config', 'notices.yml'),
    yaml,
    args.overwrite,
    args.backupRoot
  );
  return items.length;
}

async function exportSubMenus(notion, args) {
  const pages = await queryDatabase(notion, 'SubMenu', { direction: 'ascending' });
  const items = pages
    .map((page) => {
      const props = page.properties || {};
      return {
        id: page.id,
        title: extractPlainText(props.title?.title) || '未命名链接',
        summary: extractPlainText(props.summary?.rich_text),
        url: resolveExternalUrl(props.ext) || resolveExternalUrl(props.slug),
      };
    })
    .filter((item) => item.url);

  const yaml = YAML.stringify({ enabled: true, items }, { lineWidth: 0 });
  writeTextSafely(
    path.join(args.contentDir, 'config', 'submenus.yml'),
    yaml,
    args.overwrite,
    args.backupRoot
  );
  return items.length;
}

async function main() {
  ensureEnvironment();
  const args = parseArgs(process.argv.slice(2));
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  ensureDirectory(path.join(args.contentDir, 'migration'));

  const pages = await queryDatabase(notion, 'Post', {
    direction: 'descending',
    limit: args.limit,
  });
  const posts = pages.map(pageToPost);
  const inventory = {
    generated_at: new Date().toISOString(),
    database_id_sha256: crypto
      .createHash('sha256')
      .update(process.env.NOTION_DATABASE_ID)
      .digest('hex'),
    post_count: posts.length,
    uuid_route_count: posts.filter((post) => post.isUuidRoute).length,
    posts: posts.map(({ pageCover, ...post }) => ({
      ...post,
      has_page_cover: Boolean(pageCover),
    })),
  };
  writeJsonSafely(
    path.join(args.contentDir, 'migration', 'notion-inventory.json'),
    inventory,
    true,
    args.backupRoot
  );
  writeJsonSafely(
    path.join(args.contentDir, 'migration', 'legacy-routes.json'),
    posts.map((post) => ({
      notion_id: post.id,
      original_route: post.slug,
      canonical_route: post.slug,
      preserved_without_redirect: true,
    })),
    true,
    args.backupRoot
  );

  console.log(
    `✅ 清单完成：${posts.length} 篇文章，${inventory.uuid_route_count} 条 UUID 路由`
  );
  if (args.inventoryOnly) return;

  const report = [];
  for (let index = 0; index < posts.length; index += 1) {
    report.push(await exportPost(notion, posts[index], args, index + 1, posts.length));
    await sleep(220);
  }

  const noticeCount = await exportNotices(notion, args);
  const submenuCount = await exportSubMenus(notion, args);
  const migrationReport = {
    generated_at: new Date().toISOString(),
    post_count: report.length,
    notice_count: noticeCount,
    submenu_count: submenuCount,
    written: report.filter((item) => item.state === 'written').length,
    unchanged: report.filter((item) => item.state === 'unchanged').length,
    skipped_existing: report.filter((item) => item.state === 'skipped-existing').length,
    total_assets: report.reduce((sum, item) => sum + item.asset_count, 0),
    total_warnings: report.reduce((sum, item) => sum + item.warning_count, 0),
    posts: report,
  };
  writeJsonSafely(
    path.join(args.contentDir, 'migration', 'migration-report.json'),
    migrationReport,
    true,
    args.backupRoot
  );
  console.log(
    `✅ 迁移完成：${report.length} 篇文章，${migrationReport.total_assets} 个素材，${migrationReport.total_warnings} 条转换警告`
  );
}

main().catch((error) => {
  console.error(`❌ Notion 迁移失败：${error.message}`);
  process.exit(1);
});
