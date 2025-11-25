// lib/notion.js
import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';

// 从环境变量中读取 Notion 凭证
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const notionApi = new NotionAPI();

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// ==== 和你发的 NOTION_PROPERTY_NAME 对齐的字段名（小写） ====
const PROP = {
  type: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE || 'type',
  type_post:
    process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_POST || 'Post',
  status: process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS || 'status',
  status_publish:
    process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS_PUBLISH ||
    'Published',
  title: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TITLE || 'title',
  summary:
    process.env.NEXT_PUBLIC_NOTION_PROPERTY_SUMMARY || 'summary',
  slug: process.env.NEXT_PUBLIC_NOTION_PROPERTY_SLUG || 'slug',
  date: process.env.NEXT_PUBLIC_NOTION_PROPERTY_DATE || 'date'
};

// 读取文章列表
export async function getPosts() {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      and: [
        {
          // type == 'Post'
          property: PROP.type,
          select: {
            equals: PROP.type_post
          }
        },
        {
          // status == 'Published'
          property: PROP.status,
          select: {
            equals: PROP.status_publish
          }
        }
      ]
    },
    sorts: [
      {
        // ⚠️ 按小写 date 排序，对应你 Notion 里的 date 列
        property: PROP.date,
        direction: 'descending'
      }
    ]
  });

  const posts = response.results.map((page) => {
    const properties = page.properties;

    // 标题：小写 title
    const title =
      properties[PROP.title]?.title?.[0]?.plain_text ||
      '未命名文章';

    // slug：小写 slug
    const slugText =
      properties[PROP.slug]?.rich_text?.[0]?.plain_text?.trim() ||
      '';

    // fallback：pageId 去掉横杠
    const rawId = page.id.replace(/-/g, '');
    const slug = slugText || rawId;

    // 日期：小写 date
    const date =
      properties[PROP.date]?.date?.start || null;

    // 摘要：小写 summary
    const summary =
      properties[PROP.summary]?.rich_text?.[0]?.plain_text || '';

    return {
      id: page.id, // 带横杠的原始 id
      rawId,
      slug,
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

// 给 [slug].js 生成 paths
export async function getAllSlugs() {
  const posts = await getPosts();
  const slugs = posts.map((p) => p.slug);
  console.log('[getAllSlugs] slugs:', slugs);
  return slugs;
}

// 通过 slug 获取单篇文章
export async function getPostBySlug(slug) {
  const posts = await getPosts();

  console.log('[getPostBySlug] target slug:', slug);
  console.log(
    '[getPostBySlug] all slugs:',
    posts.map((p) => p.slug)
  );

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    console.warn('[getPostBySlug] NOT FOUND for slug:', slug);
    return null;
  }

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
