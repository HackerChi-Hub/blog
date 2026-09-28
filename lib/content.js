import {
  getMarkdownPostByRoute,
  getMarkdownPosts,
  loadContentConfig,
  POST_LANGS,
} from './markdown';

function normalizeRoute(value) {
  return String(value || '').replace(/^\/+|\/+$/g, '');
}

/** 列表视图（首页、分页、RSS、相关文章）：只有原文。译文从原文顶部的语言切换进入，不重复占列表。 */
export async function getPosts() {
  return getMarkdownPosts().filter((post) => !post.translationOf);
}

/** 全部已发布文章，含译文：生成页面和站点地图用。 */
export async function getAllPublishedPosts() {
  return getMarkdownPosts();
}

/** 一篇文章所在的语言组（原文 + 译文），按 POST_LANGS 排序；没有译文时只有它自己。 */
export async function getTranslationGroup(slug) {
  const posts = getMarkdownPosts();
  const post = posts.find((candidate) => candidate.slug === normalizeRoute(slug));
  if (!post) return [];
  const root = post.translationOf || post.slug;
  return posts
    .filter((candidate) => candidate.slug === root || candidate.translationOf === root)
    .sort((left, right) => POST_LANGS.indexOf(left.lang) - POST_LANGS.indexOf(right.lang))
    .map((candidate) => ({ slug: candidate.slug, lang: candidate.lang, title: candidate.title }));
}

export async function getAllSlugs() {
  const posts = await getAllPublishedPosts();
  return [
    ...new Set(
      posts
        .flatMap((post) => [post.slug, ...(post.legacyPaths || [])])
        .map(normalizeRoute)
        .filter(Boolean)
    ),
  ];
}

export async function getPostBySlug(slug) {
  return getMarkdownPostByRoute(slug);
}

export async function getPostCovers(posts) {
  return Object.fromEntries(
    posts.map((post) => [post.id, post.pageCover || post.cover || null])
  );
}

export async function getNotices(limit = 4) {
  const config = loadContentConfig('notices.yml');
  if (!config?.enabled) return [];
  const items = Array.isArray(config.items) ? config.items : [];
  return items
    .map((item, index) => ({
      id: item.id || `obsidian-notice-${index + 1}`,
      title: String(item.title || '').trim(),
      summary: String(item.summary || '').trim(),
      date: item.date ? String(item.date) : null,
      image: item.image ? String(item.image) : null,
      imageCaption: item.image_caption ? String(item.image_caption) : null,
    }))
    .filter((item) => item.title)
    .slice(0, limit);
}

export async function getSubMenus(limit = 3) {
  const config = loadContentConfig('submenus.yml');
  if (!config?.enabled) return [];
  const items = Array.isArray(config.items) ? config.items : [];
  return items
    .map((item, index) => ({
      id: item.id || `obsidian-submenu-${index + 1}`,
      title: String(item.title || '').trim(),
      summary: String(item.summary || '').trim(),
      url: String(item.url || '').trim(),
    }))
    .filter((item) => item.title && item.url)
    .slice(0, limit);
}
