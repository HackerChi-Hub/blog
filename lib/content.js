import {
  getMarkdownPostByRoute,
  getMarkdownPosts,
  loadContentConfig,
} from './markdown';

function normalizeRoute(value) {
  return String(value || '').replace(/^\/+|\/+$/g, '');
}

export async function getPosts() {
  return getMarkdownPosts();
}

export async function getAllSlugs() {
  const posts = await getPosts();
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
