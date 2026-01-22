// lib/rss.js
// RSS Feed 生成工具

import { SITE_CONFIG } from './seo';

/**
 * 生成 RSS Feed XML
 * @param {Array} posts - 文章列表
 * @returns {string} RSS XML 内容
 */
export function generateRSSFeed(posts = []) {
  const baseUrl = SITE_CONFIG.url;
  const currentDate = new Date().toUTCString();

  // RSS 头部
  const rssHeader = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_CONFIG.name)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <pubDate>${currentDate}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <generator>Next.js RSS Generator</generator>`;

  // 生成文章项
  const items = posts
    .slice(0, 20) // RSS 通常只包含最新的 20 篇文章
    .map((post) => {
      const slug = post.slug || post.rawId || post.id;
      const link = `${baseUrl}/${slug}/`;
      const pubDate = post.date
        ? new Date(post.date).toUTCString()
        : currentDate;

      // 提取摘要
      const normalizeSummary = (summary) => {
        if (!summary) return '';
        if (typeof summary === 'string') return summary;
        if (Array.isArray(summary)) {
          return summary
            .map((item) => {
              if (typeof item === 'string') return item;
              if (typeof item === 'object' && item?.plain_text) return item.plain_text;
              if (item?.text?.content) return item.text.content;
              return '';
            })
            .filter(Boolean)
            .join('');
        }
        if (typeof summary === 'object') {
          if (summary.plain_text) return summary.plain_text;
          if (summary.text?.content) return summary.text.content;
          return JSON.stringify(summary);
        }
        return String(summary);
      };

      const description = normalizeSummary(post.summary) || post.title;
      const title = post.title || '未命名文章';

      // 提取分类和标签
      const categories = [];
      if (Array.isArray(post.categories)) {
        post.categories.forEach((cat) => {
          const catName = typeof cat === 'string' ? cat : cat.name;
          if (catName) categories.push(catName);
        });
      }
      if (Array.isArray(post.tags)) {
        post.tags.forEach((tag) => {
          const tagName = typeof tag === 'string' ? tag : tag.name;
          if (tagName) categories.push(tagName);
        });
      }

      const categoryTags = categories
        .map((cat) => `    <category>${escapeXml(cat)}</category>`)
        .join('\n');

      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>
${categoryTags ? categoryTags + '\n' : ''}    </item>`;
    })
    .join('\n');

  // RSS 尾部
  const rssFooter = `  </channel>
</rss>`;

  return rssHeader + '\n' + items + '\n' + rssFooter;
}

/**
 * 转义 XML 特殊字符
 * @param {string} str - 要转义的字符串
 * @returns {string} 转义后的字符串
 */
function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
