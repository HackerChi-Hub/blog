// lib/seo.js
// SEO 配置和工具函数

// 站点基础配置
export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || '黑客驰 · 官网',
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    '效率提速，安全不怵。分享技术、学习思考、资源分享。',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://hackerchi.top',
  author: process.env.NEXT_PUBLIC_SITE_AUTHOR || '黑客驰',
  keywords:
    process.env.NEXT_PUBLIC_SITE_KEYWORDS ||
    '技术分享,学习思考,资源分享,博客,技术博客',
  image: process.env.NEXT_PUBLIC_SITE_IMAGE || '/favicon-512x512.png',
  twitter: process.env.NEXT_PUBLIC_TWITTER_HANDLE || 'https://x.com/hackerchi99',
};

/**
 * 生成完整的 meta 标签对象
 * @param {Object} options - SEO 选项
 * @param {string} options.title - 页面标题
 * @param {string} options.description - 页面描述
 * @param {string} options.image - 页面图片 URL
 * @param {string} options.url - 页面 URL（相对路径或完整 URL）
 * @param {string} options.type - Open Graph 类型（article, website 等）
 * @param {string} options.publishedTime - 文章发布时间（ISO 8601）
 * @param {string} options.modifiedTime - 文章修改时间（ISO 8601）
 * @param {string[]} options.tags - 文章标签数组
 * @param {string} options.author - 文章作者
 * @returns {Object} meta 标签对象
 */
export function generateSEOMeta({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  tags = [],
  author,
}) {
  const fullTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : SITE_CONFIG.name;
  const fullDescription = description || SITE_CONFIG.description;
  const fullImage = image
    ? image.startsWith('http')
      ? image
      : `${SITE_CONFIG.url}${image}`
    : `${SITE_CONFIG.url}${SITE_CONFIG.image}`;
  const fullUrl = url
    ? url.startsWith('http')
      ? url
      : `${SITE_CONFIG.url}${url}`
    : SITE_CONFIG.url;

  const meta = {
    title: fullTitle,
    description: fullDescription,
    keywords: SITE_CONFIG.keywords,
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'zh_CN',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      image: fullImage,
    },
  };

  // 如果是文章类型，添加额外信息
  if (type === 'article') {
    meta.openGraph.type = 'article';
    if (publishedTime) {
      meta.openGraph.publishedTime = publishedTime;
    }
    if (modifiedTime) {
      meta.openGraph.modifiedTime = modifiedTime;
    }
    if (tags && tags.length > 0) {
      meta.openGraph.tags = tags;
    }
    if (author) {
      meta.openGraph.authors = [author];
    }
  }

  if (SITE_CONFIG.twitter) {
    meta.twitter.creator = SITE_CONFIG.twitter;
    meta.twitter.site = SITE_CONFIG.twitter;
  }

  return meta;
}

/**
 * 生成结构化数据（JSON-LD）
 * @param {Object} options - 结构化数据选项
 * @param {string} options.type - 类型（Article, WebSite, BlogPosting 等）
 * @param {string} options.title - 标题
 * @param {string} options.description - 描述
 * @param {string} options.url - URL
 * @param {string} options.image - 图片 URL
 * @param {string} options.publishedTime - 发布时间
 * @param {string} options.modifiedTime - 修改时间
 * @param {string} options.author - 作者
 * @returns {Object} JSON-LD 对象
 */
export function generateStructuredData({
  type = 'WebSite',
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  author,
}) {
  const baseUrl = SITE_CONFIG.url;
  const fullUrl = url
    ? url.startsWith('http')
      ? url
      : `${baseUrl}${url}`
    : baseUrl;
  const fullImage = image
    ? image.startsWith('http')
      ? image
      : `${baseUrl}${image}`
    : `${baseUrl}${SITE_CONFIG.image}`;

  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
    name: title || SITE_CONFIG.name,
    description: description || SITE_CONFIG.description,
    url: fullUrl,
    image: fullImage,
  };

  if (type === 'Article' || type === 'BlogPosting') {
    baseData.headline = title;
    baseData.author = {
      '@type': 'Person',
      name: author || SITE_CONFIG.author,
    };
    baseData.publisher = {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}${SITE_CONFIG.image}`,
      },
    };
    if (publishedTime) {
      baseData.datePublished = publishedTime;
    }
    if (modifiedTime) {
      baseData.dateModified = modifiedTime;
    }
  } else if (type === 'WebSite') {
    baseData.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return baseData;
}
