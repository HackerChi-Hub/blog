import { getPosts } from './content';

const DISCOVERY_TYPES = new Set(['skill', 'model']);

export async function buildDiscoveryProps(articleType) {
  if (!DISCOVERY_TYPES.has(articleType)) throw new Error(`不支持的发现页类型：${articleType}`);

  const allPosts = await getPosts();
  const posts = allPosts
    .filter((post) => post.articleType === articleType)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      date: post.date,
      updated: post.updated,
      cover: post.pageCover || post.cover || null,
      tags: (post.tags || []).map((tag) => tag?.name || tag).filter(Boolean),
      name: post.discoveryName || post.title,
      category: post.discoveryCategory || (articleType === 'skill' ? '其他 Skill' : '其他模型'),
      stage: post.discoveryStage || (articleType === 'skill' ? '资料核验' : '发布追踪'),
      sourceUrl: post.discoveryUrl || null,
    }))
    .sort((left, right) => {
      const dateOrder = String(right.date || '').localeCompare(String(left.date || ''));
      return dateOrder || left.title.localeCompare(right.title, 'zh-CN');
    });

  return {
    props: {
      articleType,
      posts,
      meta: { lang: 'zh-CN' },
    },
  };
}
