// lib/home-data.js
// 首页的构建期数据（只在 getStaticProps 里用）。
//
// 从 pages/index.js 挪出来，是因为页面文件里除 getStaticProps 以外的导出都会进浏览器包，
// 而这里要用读文件的内容层（fs）——留在页面里，英文首页一 import 就会让浏览器构建失败。
// 中文首页与英文首页（pages/en/index.js）都从这里取数据。

import { getPosts, getAllPublishedPosts, getNotices, getSubMenus, getPostCovers } from './content';
import { normalizeSummary } from './utils';
const { selectHomeArticlePosts } = require('./home-content.cjs');

const {
  buildProductCards,
  buildFallbackProductCards,
} = require('./product-catalog.cjs');

export const PAGE_SIZE = 21;
const CATEGORY_FIELD = 'category';
const FEATURED_CATEGORIES = ['技术分享', '学习思考', '资源分享'];

const extractPropertyPayload = (property) => {
  if (!property || typeof property !== 'object') return property;
  if (property.type && property[property.type] !== undefined) {
    return property[property.type];
  }
  if (Array.isArray(property.multi_select)) return property.multi_select;
  if (property.select) return property.select;
  if (Array.isArray(property.results)) return property.results;
  if (property.value !== undefined) return property.value;
  return property;
};

const normalizeCategoryValue = (value) => {
  if (!value) return [];

  const handleRichText = (node) => {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (node.plain_text) return node.plain_text;
    if (node.text?.content) return node.text.content;
    if (node.name) return node.name;
    return '';
  };

  if (typeof value === 'string') {
    return value.trim() ? [value.trim()] : [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (!item) return '';
        if (typeof item === 'string') return item.trim();
        if (item.name) return item.name.trim();
        if (item.plain_text) return item.plain_text.trim();
        if (item.text?.content) return item.text.content.trim();
        return handleRichText(item).trim();
      })
      .filter(Boolean);
  }

  if (typeof value === 'object') {
    if (value.type || value.multi_select || value.select || value.results || value.value) {
  return normalizeCategoryValue(extractPropertyPayload(value));
    }
    if (value.name) return [value.name.trim()];
    if (value.plain_text) return [value.plain_text.trim()];
    if (value.text?.content) return [value.text.content.trim()];
  }

  return [];
};

const getPostCategories = (post, propertyName) => {
  const candidates = [
    post?.[propertyName],
    post?.category,
    post?.Category,
    post?.categories,
    post?.Categories,
    post?.ext?.[propertyName],
    post?.ext?.category,
    post?.properties?.[propertyName],
    post?.properties?.[propertyName]?.value,
    post?.properties?.[propertyName]?.results,
    post?.properties?.[propertyName]?.multi_select,
  ];

  for (const candidate of candidates) {
    const payload = extractPropertyPayload(candidate);
    const normalized = normalizeCategoryValue(payload);
    if (normalized.length) return normalized;
  }

  return [];
};

const buildFeaturedCategoryBuckets = (posts, propertyName, featuredNames) => {
  const map = new Map();

  const ensureBucket = (key) => {
    if (!map.has(key)) {
      map.set(key, []);
    }
    return map.get(key);
  };

  posts.forEach((post) => {
    const explicitNames = Array.isArray(post.categoryNames)
      ? post.categoryNames
      : [];
    const detectedNames =
      explicitNames.length > 0
        ? explicitNames
        : getPostCategories(post, propertyName);

    if (detectedNames.length === 0) {
      ensureBucket('未分类').push(post);
      return;
    }

    detectedNames.forEach((category) => {
      if (!category) return;
      ensureBucket(category).push(post);
    });
  });

  return featuredNames.map((name) => ({
    name,
    posts: (map.get(name) || []).sort(
      (a, b) => new Date(b?.date || 0) - new Date(a?.date || 0)
    ),
  }));
};

/**
 * 原文 slug → 英文版要显示的字段。
 * getStaticProps 不接受 undefined，缺的字段一律给 null。
 */
export async function getEnglishMap() {
  const all = await getAllPublishedPosts();
  const map = {};
  for (const post of all) {
    if (post.lang !== 'en' || !post.translationOf) continue;
    map[post.translationOf] = {
      slug: post.slug,
      title: post.title ?? null,
      summary: post.summary ?? null,
      tags: post.tags ?? [],
    };
  }
  return map;
}

/** 产品卡链到介绍文章的英文版；固定用途保留统一真源，显示时由界面词典翻译。 */
function localizeProducts(products, en) {
  return products.map((product) => {
    const translated = en[product.slug];
    if (!translated) return product;
    return {
      ...product,
      slug: translated.slug,
    };
  });
}

/**
 * 首页数据：统一提供首屏文章、全站搜索、雷达索引与产品更新。
 * 英文在此基础上附加 lang / meta / en，并把产品卡链接换成英文版。
 */
export async function buildHomeProps(lang = 'zh-CN') {
  const result = await buildChineseHomeProps();
  if (lang !== 'en') return result;
  const en = await getEnglishMap();
  return {
    props: {
      ...result.props,
      products: localizeProducts(result.props.products, en),
      lang: 'en',
      meta: { lang: 'en' },   // _document 据此写 <html lang="en">
      en,
    },
  };
}

async function buildChineseHomeProps() {
  try {
    const [allPosts, notices, subMenus] = await Promise.all([
      getPosts(),
      getNotices(4),
      getSubMenus(12),
    ]);

    const pagePosts = selectHomeArticlePosts(allPosts, PAGE_SIZE);

    // 批量获取文章封面图
    const coverMap = await getPostCovers(pagePosts);
    const postsWithCovers = pagePosts.map((post) => ({
      ...post,
      cover: coverMap[post.id] || null,
    }));

    const categoryBuckets = buildFeaturedCategoryBuckets(
      allPosts,
      CATEGORY_FIELD,
      FEATURED_CATEGORIES
    );
    const products = await buildProductCards(allPosts);

    return {
      props: {
        posts: postsWithCovers,
        searchPosts: allPosts.map(({ slug, title, summary, date, tags, categoryNames }) => ({
          slug, title, summary: summary || '', date: date || '', tags: tags || [], categoryNames: categoryNames || [],
        })),
        radarPosts: allPosts.filter((post) => ['skill', 'model'].includes(post.articleType)).map((post) => ({
          slug: post.slug, title: post.title, articleType: post.articleType, date: post.date,
        })),
        notices,
        subMenus,
        products,
        categoryBuckets,
        currentPage: 1,
        totalPages: Math.max(1, Math.ceil(allPosts.length / PAGE_SIZE)),
        errorMessage:
          allPosts.length === 0 ? '暂无文章，请检查内容库配置。' : '',
      },
    };
  } catch (error) {
    console.error('[pages/index] getStaticProps failed:', error);
    return {
      props: {
        posts: [],
        notices: [],
        subMenus: [],
        products: buildFallbackProductCards([]),
        categoryBuckets: FEATURED_CATEGORIES.map((name) => ({
          name,
          posts: [],
        })),
        currentPage: 1,
        totalPages: 1,
        errorMessage:
          error?.message ||
        '获取数据失败，请检查 Obsidian 内容库及发布快照。',
      },
    };
  }
}

