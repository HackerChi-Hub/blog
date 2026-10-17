const { createHash } = require('crypto');
const { fingerprint } = require('./product-fingerprint.cjs');
const PRODUCT_DEFINITIONS = Object.freeze([
  {
    slug: 'localbrain-local-ai-box',
    name: '方寸智匣 LocalBrain',
    label: '本地 AI 工具箱',
    badge: '我做的 · 正式迭代',
    facts: ['本地运行', 'macOS / Windows / Linux', '持续更新'],
    releaseRepo: 'HackerChi-Hub/localbrain-releases',
    fallbackDescription: '本地 AI 工具箱：转写、配音、生图、视频和 MCP 工具集中管理；具体功能以对应平台版本为准。',
  },
  {
    slug: 'hyphenbox-free-api-radar',
    name: '黑粉盒子 HyphenBox',
    label: '免费 API 雷达',
    badge: '我做的 · 正式迭代',
    facts: ['正式推出', 'macOS / Windows / Linux', '免费下载'],
    releaseRepo: 'HackerChi-Hub/hyphenbox-release',
    fallbackDescription: '免费大模型 API 雷达与本地统一路由：持续复测可用性，Key 只存本机。',
  },
  {
    slug: 'screenlex-watch-and-learn',
    name: '光影词库 ScreenLex',
    label: '本地影视英语学习',
    badge: '我做的 · 正式迭代',
    facts: ['离线使用', 'macOS / Windows / Linux', '持续更新'],
    releaseRepo: 'HackerChi-Hub/screenlex-download',
    fallbackDescription: '把本地电影与剧集字幕变成可复习的英语词库，全程离线。',
  },
  {
    // 黑粉录屏：2026-09-16 已放行进产品区 —— 下载库转公开（v0.4.16 标 prerelease，
    // 九个安装包匿名可下），产品文章 hyphenscreen-local-screen-recorder 也已 published，
    // 两个放行条件都满足，所以没有 pending 字段。
    // 2026-09-28 起 1.0.1 为正式版（公开 Release 不再是 prerelease，Latest 指向它），
    // 徽标与 LocalBrain、ScreenLex 一样标「正式迭代」；Windows/Linux 仍停在 0.4.36。
    // 注意别用 /releases/latest 判断它是否公开：那个端点排除 prerelease，会永远 404。
    slug: 'hyphenscreen-local-screen-recorder',
    name: '黑粉录屏 HyphenScreen',
    label: '录屏 + 智能剪辑',
    badge: '我做的 · 正式迭代',
    facts: ['免费', '本地运行', 'macOS / Windows / Linux'],
    releaseRepo: 'HackerChi-Hub/HyphenScreen-Releases',
    fallbackDescription: '录屏与剪辑一体：达芬奇式时间线、自动打码、导出前做成片体检。',
  },
]);

// 只有已公开发行的产品进产品区；pending 的留在定义里排队，不渲染。
const PUBLISHED_PRODUCTS = PRODUCT_DEFINITIONS.filter((definition) => !definition.pending);

const MAX_SUMMARY_LENGTH = 168;
const IGNORED_SECTION = /下载|安装|首次打开|校验|安全|自动更新|预览版意味着|系统要求|文件说明/i;
const VERSION_ONLY = /^(?:[\w\u4e00-\u9fff .·｜|-]+)?v?\d+\.\d+(?:\.\d+)?(?:\s*[（(].*[）)])?$/i;

const truncate = (text, maxLength = MAX_SUMMARY_LENGTH) => {
  const normalized = String(text || '').replace(/\s+/g, ' ').trim();
  return normalized.length > maxLength
    ? `${normalized.slice(0, maxLength).replace(/[，、；：,.\s]+$/u, '')}…`
    : normalized;
};

const cleanMarkdown = (text) =>
  String(text || '')
    .replace(/<!--[^]*?-->/g, ' ')
    .replace(/```[^]*?```/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/[*_~`]/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function extractReleaseSummary(body, fallback = '') {
  const source = String(body || '').replace(/\r/g, '').trim();
  if (!source) return truncate(fallback);

  const blocks = source.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
  const intro = [];

  // 显式功能区比版本号晋升、下载方式等发行前言更适合作为“最新变化”。
  let inFeatures = false;
  const namedFeatures = [];
  for (const line of source.split('\n')) {
    const heading = line.match(/^##+\s+(.+)/);
    if (heading) {
      if (inFeatures) break;
      inFeatures = /^(?:本版内容|本次更新|新增功能|功能变化|改进内容)$/u.test(cleanMarkdown(heading[1]));
      continue;
    }
    if (inFeatures && /^\s*[-*+]\s+/.test(line)) {
      const cleaned = cleanMarkdown(line);
      if (cleaned) namedFeatures.push(cleaned.replace(/[。；;]+$/u, ''));
      if (namedFeatures.length >= 2) return truncate(`${namedFeatures.join('；')}。`);
    }
  }
  if (namedFeatures.length) return truncate(`${namedFeatures.join('；')}。`);

  for (const block of blocks) {
    if (/^##\s+/m.test(block) || /^\*\*[^*\n]+\*\*$/m.test(block)) break;
    if (/^#\s+/m.test(block)) continue;
    if (/^\|/.test(block)) continue;
    if (/^\s*[-*+]\s+/m.test(block)) continue;
    const cleaned = cleanMarkdown(block);
    if (!cleaned || VERSION_ONLY.test(cleaned)) continue;
    intro.push(cleaned);
    if (intro.join(' ').length >= 72) break;
  }

  if (intro.length) return truncate(intro.join(' '));

  const bullets = [];
  let ignored = false;
  for (const line of source.split('\n')) {
    const heading = line.match(/^##+\s+(.+)/) || line.match(/^\*\*([^*]+)\*\*$/);
    if (heading) {
      ignored = IGNORED_SECTION.test(cleanMarkdown(heading[1]));
      continue;
    }
    if (ignored || !/^\s*[-*+]\s+/.test(line)) continue;
    const cleaned = cleanMarkdown(line);
    if (!cleaned || VERSION_ONLY.test(cleaned)) continue;
    bullets.push(cleaned.replace(/[。；;]+$/u, ''));
    if (bullets.length >= 2 || bullets.join(' ').length >= 120) break;
  }

  if (bullets.length) return truncate(`${bullets.join('；')}。`);

  for (const block of blocks) {
    if (/^#{1,6}\s+/.test(block) || /^\|/.test(block)) continue;
    const cleaned = cleanMarkdown(block);
    if (!cleaned || VERSION_ONLY.test(cleaned) || IGNORED_SECTION.test(cleaned.slice(0, 20))) continue;
    return truncate(cleaned);
  }

  return truncate(fallback);
}

function normalizeArticleSummary(summary) {
  if (!summary) return '';
  if (typeof summary === 'string') return summary.trim();
  if (Array.isArray(summary)) {
    return summary
      .map((item) => item?.plain_text || item?.text?.content || item?.name || item || '')
      .join('')
      .trim();
  }
  if (typeof summary === 'object') {
    return String(summary.plain_text || summary.text?.content || '').trim();
  }
  return String(summary).trim();
}

const normalizeVersion = (tagName) => String(tagName || '').replace(/^v(?=\d)/i, '');

const normalizeDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value).slice(0, 10) : date.toISOString().slice(0, 10);
};

const latestDate = (...values) =>
  values.map(normalizeDate).filter(Boolean).sort().at(-1) || '';

function publishedReleases(payload) {
  const list = Array.isArray(payload) ? payload : [payload];
  return list.filter((release) => release && !release.draft && release.published_at)
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
}

function selectRelease(list) {
  // 正式安装入口不被更新的预览版替换；只有尚无正式发行时才展示预览版。
  return list.find((release) => !release.prerelease) || list[0];
}

function platformReleases(list) {
  const patterns = {
    macOS: /\.(?:dmg|pkg)$/i,
    Windows: /\.(?:exe|msi)$/i,
    Linux: /\.(?:AppImage|deb|rpm)$/i,
  };
  return Object.entries(patterns).flatMap(([platform, pattern]) => {
    const available = list.filter((release) =>
      (release.assets || []).some((asset) => pattern.test(asset.name || ''))
    );
    const release = selectRelease(available);
    if (!release) return [];
    return [{
      platform,
      version: normalizeVersion(release.tag_name),
      prerelease: Boolean(release.prerelease),
      url: release.html_url,
      assets: release.assets.filter((asset) => pattern.test(asset.name || '')).map((asset) => ({
        name: asset.name,
        url: asset.browser_download_url || '',
        id: asset.id || null,
        size: asset.size ?? null,
        updatedAt: asset.updated_at || '',
        digest: asset.digest || '',
      })).sort((a, b) => a.name.localeCompare(b.name, 'en')),
    }];
  });
}

async function fetchLatestRelease(releaseRepo, { fetchImpl = globalThis.fetch, token = process.env.GITHUB_TOKEN, strict = false } = {}) {
  if (!releaseRepo || typeof fetchImpl !== 'function' || process.env.PRODUCT_RELEASES_OFFLINE === '1') {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const headers = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'hyphentech-blog-product-sync',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    if (strict) {
      const repository = await fetchImpl(`https://api.github.com/repos/${releaseRepo}`, { headers, signal: controller.signal });
      if (!repository.ok) throw new Error(`HTTP ${repository.status}`);
      const info = await repository.json();
      if (typeof info?.private !== 'boolean') throw new Error('仓库响应格式异常');
      if (info.private || (info.visibility && info.visibility !== 'public')) throw new Error('仓库不是公开状态，拒绝把凭据可见的私有发行写入官网');
    }

    // 用 /releases 列表而不是 /releases/latest：后者按定义**排除 prerelease**，
    // 而预览版产品（黑粉录屏 v0.4.16）正是这么发的——用 latest 会 404，
    // 卡片于是悄悄退回文章摘要、版本号空着，看起来像「还没发版」。
    const endpoint = `https://api.github.com/repos/${releaseRepo}/releases`;
    let nextUrl = `${endpoint}?per_page=100`;
    const payload = [];
    // 平台安装包可能在更早一页。不能只看第一页就误称某个平台从未发布。
    for (let page = 0; nextUrl; page += 1) {
      if (page >= 20) throw new Error('发行分页超过安全上限，拒绝用不完整记录声明最新');
      const response = await fetchImpl(nextUrl, { headers, signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const items = await response.json();
      if (!Array.isArray(items)) throw new Error('发行列表响应格式异常');
      payload.push(...items);
      const link = response.headers?.get?.('link') || '';
      const next = link.match(/<([^>]+)>;\s*rel="next"/);
      nextUrl = next?.[1] || '';
      if (nextUrl) {
        const parsed = new URL(nextUrl);
        if (parsed.origin !== 'https://api.github.com' || parsed.pathname !== new URL(endpoint).pathname || parsed.username || parsed.password) {
          throw new Error('发行分页地址越出已登记仓库');
        }
      }
    }
    const list = publishedReleases(payload);
    const release = selectRelease(list);
    if (!release) throw new Error('没有已发布的 Release（草稿不算）');
    const platforms = platformReleases(list);
    return {
      version: normalizeVersion(release.tag_name || release.name),
      publishedAt: normalizeDate(release.published_at || release.created_at),
      activityAt: [release.updated_at, release.published_at,
        ...platforms.flatMap((platform) => platform.assets.map((asset) => asset.updatedAt))]
        .filter((value) => value && Number.isFinite(Date.parse(value))).sort().at(-1) || '',
      url: release.html_url || `https://github.com/${releaseRepo}/releases/latest`,
      body: release.body || '',
      releaseNotesHash: createHash('sha256').update(String(release.body || '')).digest('hex'),
      prerelease: Boolean(release.prerelease),
      platforms,
      checkedAt: new Date().toISOString(),
    };
  } catch (error) {
    if (strict) throw new Error(`${releaseRepo} 无法核对当前公开发行：${error.message}`);
    console.warn(`[product-catalog] ${releaseRepo} 最新 Release 读取失败，改用产品文章：${error.message}`);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function fallbackProductCard(definition, article) {
  const articleSummary = normalizeArticleSummary(article?.summary);
  return {
    ...definition,
    action: '查看产品与下载',
    description: truncate(definition.fallbackDescription),
    updateSummary: articleSummary ? truncate(articleSummary) : '',
    updated: latestDate(article?.updated, article?.date),
    activityAt: '',
    version: '',
    releaseUrl: `https://github.com/${definition.releaseRepo}/releases`,
    source: articleSummary ? 'article' : 'fallback',
    platforms: [],
    checkedAt: '',
    prerelease: false,
  };
}

async function buildProductCards(posts = [], options = {}) {
  return Promise.all(
    PUBLISHED_PRODUCTS.map(async (definition) => {
      const article = posts.find((post) => (post?.slug || post?.rawId) === definition.slug);
      const fallback = fallbackProductCard(definition, article);
      const release = await fetchLatestRelease(definition.releaseRepo, options);
      if (!release) return fallback;

      const card = {
        ...fallback,
        updateSummary: extractReleaseSummary(release.body, fallback.updateSummary),
        updated: latestDate(release.publishedAt, release.activityAt) || fallback.updated,
        activityAt: release.activityAt,
        version: release.version,
        releaseUrl: release.url,
        source: 'release',
        platforms: release.platforms,
        checkedAt: release.checkedAt,
        prerelease: release.prerelease,
        releaseNotesHash: release.releaseNotesHash,
      };
      return { ...card, revision: fingerprint(card) };
    })
  );
}

function buildFallbackProductCards(posts = []) {
  return PUBLISHED_PRODUCTS.map((definition) => {
    const article = posts.find((post) => (post?.slug || post?.rawId) === definition.slug);
    return fallbackProductCard(definition, article);
  });
}

module.exports = {
  PRODUCT_DEFINITIONS,
  PUBLISHED_PRODUCTS,
  buildFallbackProductCards,
  buildProductCards,
  extractReleaseSummary,
  // 英文首页用它截英文摘要，和中文卡片同一个长度与收尾规则
  truncate,
  publishedReleases,
  platformReleases,
  selectRelease,
};
