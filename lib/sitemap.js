// lib/sitemap.js
// 生成 sitemap.xml 和 robots.txt 的工具函数

import { SITE_CONFIG } from './seo';

/**
 * 生成 sitemap.xml 内容
 * @param {Array} posts - 文章列表
 * @returns {string} sitemap.xml 内容
 */
function postLastmod(post) {
  const modified = post && (post.updated || post.date);
  return modified && Number.isFinite(new Date(modified).getTime())
    ? new Date(modified).toISOString().split('T')[0]
    : null;
}

function latestLastmod(items = []) {
  let latest = null;
  for (const item of items) {
    const date = postLastmod(item);
    if (date && (!latest || date > latest)) latest = date;
  }
  return latest;
}

export function generateSitemap(posts = []) {
  const baseUrl = String(SITE_CONFIG.url || 'https://hyphentech.top').replace(/\/+$/, '');

  // 分页页面。只数列表里的文章：译文进站点地图、不进分页（pages/page/[page].js 用的就是
  // 不含译文的列表），按全部文章算页数会多出一页，导出验收报「缺少 /page/N/」。
  const PAGE_SIZE = 21;
  const listed = posts.filter((post) => !post.translationOf);
  const enByOriginal = new Map(
    posts
      .filter((post) => post.translationOf && post.lang === 'en')
      .map((post) => [post.translationOf, post])
  );

  const zhLatest = latestLastmod(listed) || latestLastmod(posts);
  const enLatest = latestLastmod([...enByOriginal.values()]) || zhLatest;
  const skillLatest =
    latestLastmod(posts.filter((post) => (post.articleType || post.article_type) === 'skill')) ||
    zhLatest;
  const modelLatest =
    latestLastmod(posts.filter((post) => (post.articleType || post.article_type) === 'model')) ||
    zhLatest;
  const radarLatest =
    latestLastmod(
      posts.filter((post) => ['skill', 'model'].includes(post.articleType || post.article_type))
    ) || zhLatest;

  const pageSliceDates = (start, end, useEn = false) => {
    const slice = listed.slice(start, end);
    if (!useEn) return latestLastmod(slice) || zhLatest;
    return latestLastmod(slice.map((post) => enByOriginal.get(post.slug) || post)) || enLatest;
  };

  // 首页（对齐页面规范地址 canonical 的末尾斜杠，lastmod 取实际最新文章日期）
  const urls = [
    {
      loc: `${baseUrl}/`,
      lastmod: zhLatest,
      changefreq: 'daily',
      priority: '1.0',
    },
  ];

  // Obsidian 发现页与首屏分页：lastmod 按所辖真实内容最新日期生成，避免未变更页面被每次构建刷成当天日期
  urls.push(
    { loc: `${baseUrl}/teahouse/`, lastmod: zhLatest, changefreq: 'weekly', priority: '0.7' },
    { loc: `${baseUrl}/en/teahouse/`, lastmod: enLatest, changefreq: 'weekly', priority: '0.7' },
    { loc: `${baseUrl}/guides/`, lastmod: zhLatest, changefreq: 'weekly', priority: '0.7' },
    { loc: `${baseUrl}/en/guides/`, lastmod: enLatest, changefreq: 'weekly', priority: '0.7' },
    { loc: `${baseUrl}/radar/`, lastmod: radarLatest, changefreq: 'weekly', priority: '0.7' },
    {
      loc: `${baseUrl}/page/1/`,
      lastmod: pageSliceDates(0, PAGE_SIZE, false),
      changefreq: 'weekly',
      priority: '0.7',
    },
    {
      loc: `${baseUrl}/en/page/1/`,
      lastmod: pageSliceDates(0, PAGE_SIZE, true),
      changefreq: 'weekly',
      priority: '0.7',
    },
    {
      loc: `${baseUrl}/skills/`,
      lastmod: skillLatest,
      changefreq: 'daily',
      priority: '0.9',
    },
    {
      loc: `${baseUrl}/models/`,
      lastmod: modelLatest,
      changefreq: 'daily',
      priority: '0.9',
    }
  );

  const totalPages = Math.max(1, Math.ceil(listed.length / PAGE_SIZE));
  for (let i = 2; i <= totalPages; i++) {
    urls.push({
      loc: `${baseUrl}/page/${i}/`,
      lastmod: pageSliceDates((i - 1) * PAGE_SIZE, i * PAGE_SIZE, false),
      changefreq: 'weekly',
      priority: '0.8',
    });
  }

  // 英文首页与英文分页：同一批文章换成英文版，页数与中文一致（pages/en/）。
  urls.push({
    loc: `${baseUrl}/en/`,
    lastmod: enLatest,
    changefreq: 'daily',
    priority: '0.9',
  });
  for (let i = 2; i <= totalPages; i++) {
    urls.push({
      loc: `${baseUrl}/en/page/${i}/`,
      lastmod: pageSliceDates((i - 1) * PAGE_SIZE, i * PAGE_SIZE, true),
      changefreq: 'weekly',
      priority: '0.7',
    });
  }

  // 文章页面
  posts.forEach((post) => {
    const slug = post.slug || post.rawId || post.id;
    const lastmod = postLastmod(post);

    urls.push({
      loc: `${baseUrl}/${slug}/`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.9',
    });
  });

  // 生成 XML
  const urlElements = urls
    .map(
      (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
${url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

/**
 * 转义 XML 特殊字符
 * @param {string} str - 要转义的字符串
 * @returns {string} 转义后的字符串
 */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * 生成 robots.txt 内容
 * @param {boolean} allowAll - 是否允许所有爬虫
 * @returns {string} robots.txt 内容
 */
export function generateRobotsTxt(allowAll = true) {
  const baseUrl = SITE_CONFIG.url;
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  if (allowAll) {
    return `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}`;
  } else {
    return `User-agent: *
Disallow: /

Sitemap: ${sitemapUrl}`;
  }
}
