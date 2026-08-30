// lib/sitemap.js
// 生成 sitemap.xml 和 robots.txt 的工具函数

import { SITE_CONFIG } from './seo';

/**
 * 生成 sitemap.xml 内容
 * @param {Array} posts - 文章列表
 * @returns {string} sitemap.xml 内容
 */
export function generateSitemap(posts = []) {
  const baseUrl = SITE_CONFIG.url;
  const currentDate = new Date().toISOString().split('T')[0];

  // 首页
  const urls = [
    {
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0',
    },
  ];

  // 分页页面
  const PAGE_SIZE = 21;
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  for (let i = 2; i <= totalPages; i++) {
    urls.push({
      loc: `${baseUrl}/page/${i}/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8',
    });
  }

  // 文章页面
  posts.forEach((post) => {
    const slug = post.slug || post.rawId || post.id;
    const lastmod = post.date
      ? new Date(post.date).toISOString().split('T')[0]
      : currentDate;

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
    <lastmod>${url.lastmod}</lastmod>
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
