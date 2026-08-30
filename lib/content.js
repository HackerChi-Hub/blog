import {
  getNotices as getNotionNotices,
  getPostBySlug as getNotionPostBySlug,
  getPostCovers as getNotionPostCovers,
  getPosts as getNotionPosts,
  getSubMenus as getNotionSubMenus,
} from './notion';
import {
  getContentMode,
  getMarkdownPostByRoute,
  getMarkdownPosts,
  loadContentConfig,
} from './markdown';

function normalizeRoute(value) {
  return String(value || '').replace(/^\/+|\/+$/g, '');
}

function markNotionSource(posts) {
  return posts.map((post) => ({ ...post, source: 'notion', legacyPaths: [] }));
}

function mergePosts(markdownPosts, notionPosts) {
  const markdownOwnedRoutes = new Set();
  for (const post of markdownPosts) {
    [
      post.slug,
      post.rawId,
      post.notionId,
      String(post.notionId || '').replace(/-/g, ''),
      ...(post.legacyPaths || []),
    ]
      .map(normalizeRoute)
      .filter(Boolean)
      .forEach((route) => markdownOwnedRoutes.add(route));
  }

  const remainingNotionPosts = notionPosts.filter((post) => {
    const routes = [post.slug, post.rawId, post.id, String(post.id || '').replace(/-/g, '')]
      .map(normalizeRoute)
      .filter(Boolean);
    return !routes.some((route) => markdownOwnedRoutes.has(route));
  });

  return [...markdownPosts, ...remainingNotionPosts].sort((left, right) => {
    const dateOrder = String(right.date || '').localeCompare(String(left.date || ''));
    return dateOrder || String(left.title || '').localeCompare(String(right.title || ''), 'zh-CN');
  });
}

export async function getPosts() {
  const mode = getContentMode();
  const markdownPosts = mode === 'notion-only' ? [] : getMarkdownPosts();

  if (mode === 'markdown-only') return markdownPosts;

  const notionPosts = markNotionSource(await getNotionPosts());
  if (mode === 'notion-only') return notionPosts;
  return mergePosts(markdownPosts, notionPosts);
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
  const mode = getContentMode();
  if (mode !== 'notion-only') {
    const markdownPost = getMarkdownPostByRoute(slug);
    if (markdownPost) return markdownPost;
  }

  if (mode === 'markdown-only') return null;
  return getNotionPostBySlug(slug);
}

export async function getPostCovers(posts) {
  const coverMap = {};
  const notionPosts = [];

  for (const post of posts) {
    if (post.source === 'markdown') {
      coverMap[post.id] = post.pageCover || post.cover || null;
    } else {
      notionPosts.push(post);
    }
  }

  if (notionPosts.length) {
    Object.assign(coverMap, await getNotionPostCovers(notionPosts));
  }
  return coverMap;
}

export async function getNotices(limit = 4) {
  const mode = getContentMode();
  if (mode !== 'notion-only') {
    const config = loadContentConfig('notices.yml');
    if (config?.enabled) {
      const items = Array.isArray(config.items) ? config.items : [];
      return items
        .map((item, index) => ({
          id: item.id || `markdown-notice-${index + 1}`,
          title: String(item.title || '').trim(),
          summary: String(item.summary || '').trim(),
          date: item.date ? String(item.date) : null,
          image: item.image ? String(item.image) : null,
          imageCaption: item.image_caption ? String(item.image_caption) : null,
        }))
        .filter((item) => item.title)
        .slice(0, limit);
    }
  }
  if (mode === 'markdown-only') return [];
  return getNotionNotices(limit);
}

export async function getSubMenus(limit = 3) {
  const mode = getContentMode();
  if (mode !== 'notion-only') {
    const config = loadContentConfig('submenus.yml');
    if (config?.enabled) {
      const items = Array.isArray(config.items) ? config.items : [];
      return items
        .map((item, index) => ({
          id: item.id || `markdown-submenu-${index + 1}`,
          title: String(item.title || '').trim(),
          summary: String(item.summary || '').trim(),
          url: String(item.url || '').trim(),
        }))
        .filter((item) => item.title && item.url)
        .slice(0, limit);
    }
  }
  if (mode === 'markdown-only') return [];
  return getNotionSubMenus(limit);
}
