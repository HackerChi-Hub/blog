const PRODUCT_DEFINITIONS = Object.freeze([
  {
    slug: 'localbrain-local-ai-box',
    name: '方寸智匣 LocalBrain',
    label: '本地 AI 工具箱',
    badge: '我做的 · 正式迭代',
    facts: ['本地运行', 'macOS', '持续更新'],
    releaseRepo: 'HackerChi-Hub/localbrain-releases',
    fallbackDescription: '把 Mac 变成私有 AI 盒子：本地转写、配音、生图、视频和 MCP 工具一站管理。',
  },
  {
    slug: 'hyphenbox-free-api-radar',
    name: '黑粉盒子 HyphenBox',
    label: '免费 API 雷达',
    badge: '我做的 · 预览版',
    facts: ['初步构建', '多平台', '免费下载'],
    releaseRepo: 'HackerChi-Hub/hyphenbox-release',
    fallbackDescription: '免费大模型 API 雷达与本地统一路由：持续复测可用性，Key 只存本机。',
  },
  {
    slug: 'hyphencut-local-video-editor',
    name: '黑粉剪辑 HyphenCut',
    label: '对话式视频剪辑器',
    badge: '我做的 · 正式迭代',
    facts: ['本地运行', 'macOS', '持续更新'],
    releaseRepo: 'HackerChi-Hub/HyphenCut-Releases',
    fallbackDescription: '本地专业视频剪辑器，自带 MCP，可由 AI 助理直接修改真实工程。',
  },
  {
    slug: 'screenlex-watch-and-learn',
    name: '光影词库 ScreenLex',
    label: '本地影视英语学习',
    badge: '我做的 · 正式迭代',
    facts: ['离线使用', 'macOS / Windows', '持续更新'],
    releaseRepo: 'HackerChi-Hub/screenlex-download',
    fallbackDescription: '把本地电影与剧集字幕变成可复习的英语词库，全程离线。',
  },
]);

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

  for (const block of blocks) {
    if (/^##\s+/m.test(block)) break;
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
    const heading = line.match(/^##+\s+(.+)/);
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

async function fetchLatestRelease(releaseRepo, { fetchImpl = globalThis.fetch, token = process.env.GITHUB_TOKEN } = {}) {
  if (!releaseRepo || typeof fetchImpl !== 'function' || process.env.PRODUCT_RELEASES_OFFLINE === '1') {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const headers = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'hyphentech-blog-product-sync',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetchImpl(`https://api.github.com/repos/${releaseRepo}/releases/latest`, {
      headers,
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const release = await response.json();
    return {
      version: normalizeVersion(release.tag_name || release.name),
      publishedAt: normalizeDate(release.published_at || release.created_at),
      url: release.html_url || `https://github.com/${releaseRepo}/releases/latest`,
      body: release.body || '',
    };
  } catch (error) {
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
    description: truncate(articleSummary || definition.fallbackDescription),
    updated: latestDate(article?.updated, article?.date),
    version: '',
    releaseUrl: `https://github.com/${definition.releaseRepo}/releases/latest`,
    source: articleSummary ? 'article' : 'fallback',
  };
}

async function buildProductCards(posts = [], options = {}) {
  return Promise.all(
    PRODUCT_DEFINITIONS.map(async (definition) => {
      const article = posts.find((post) => (post?.slug || post?.rawId) === definition.slug);
      const fallback = fallbackProductCard(definition, article);
      const release = await fetchLatestRelease(definition.releaseRepo, options);
      if (!release) return fallback;

      return {
        ...fallback,
        description: extractReleaseSummary(release.body, fallback.description),
        updated: release.publishedAt || fallback.updated,
        version: release.version,
        releaseUrl: release.url,
        source: 'release',
      };
    })
  );
}

function buildFallbackProductCards(posts = []) {
  return PRODUCT_DEFINITIONS.map((definition) => {
    const article = posts.find((post) => (post?.slug || post?.rawId) === definition.slug);
    return fallbackProductCard(definition, article);
  });
}

module.exports = {
  PRODUCT_DEFINITIONS,
  buildFallbackProductCards,
  buildProductCards,
  extractReleaseSummary,
};
