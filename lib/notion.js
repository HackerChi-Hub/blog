// lib/notion.js
import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const notionApi = new NotionAPI();

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

/**
 * 获取文章列表
 *
 * 约定：
 * - 数据库里有：
 *   - Name: 标题（Title）
 *   - Page: slug（Rich text）
 *   - Type: 选择框，等于 "Post" 才算文章
 *   - Status: 选择框，等于 "Published" 才算发布
 *   - Date: 日期
 *   - Summary: 摘要（可选）
 */
export async function getPosts() {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      and: [
        {
          property: 'Type',
          select: {
            equals: 'Post'
          }
        },
        {
          property: 'Status',
          select: {
            equals: 'Published'
          }
        }
      ]
    },
    sorts: [
      {
        property: 'Date',
        direction: 'descending'
      }
    ]
  });

  const posts = response.results.map((page) => {
    const properties = page.properties;

    const title =
      properties.Name?.title?.[0]?.plain_text || '未命名文章';

    // ⚠️ slug 规则：来自 Page.rich_text，去掉首尾空格
    const slugText =
      properties.Page?.rich_text?.[0]?.plain_text?.trim() || '';

    // 若 Page 为空，用去掉横杠的 page.id 作为 fallback
    const slug = slugText || page.id.replace(/-/g, '');

    const rawId = page.id.replace(/-/g, '');

    const date = properties.Date?.date?.start || null;

    const summary =
      properties.Summary?.rich_text?.[0]?.plain_text || '';

    return {
      id: page.id,   // 带横杠的原始 id，用来取 recordMap
      rawId,
      slug,          // 一定有值
      title,
      date,
      summary
    };
  });

  console.log(
    '[getPosts] posts:',
    posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title
    }))
  );

  return posts;
}

/**
 * 给 [slug].js 用来生成 paths
 */
export async function getAllSlugs() {
  const posts = await getPosts();
  const slugs = posts.map((p) => p.slug);

  console.log('[getAllSlugs] slugs:', slugs);

  return slugs;
}

/**
 * 通过 slug 拿到单篇文章
 */
export async function getPostBySlug(slug) {
  const posts = await getPosts();

  console.log('[getPostBySlug] target slug:', slug);
  console.log(
    '[getPostBySlug] all slugs:',
    posts.map((p) => p.slug)
  );

  // 统一用 posts 里的 slug 字段匹配
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    console.warn('[getPostBySlug] NOT FOUND for slug:', slug);
    return null;
  }

  // 用原始 page.id 去 notion-client 拿 recordMap
  const recordMap = await notionApi.getPage(post.id);

  return {
    meta: {
      id: post.id,
      title: post.title,
      date: post.date
    },
    recordMap
  };
}
