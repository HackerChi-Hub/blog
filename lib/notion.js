// lib/notion.js
import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';
import { NOTION_PROPERTY_NAME as PROP } from './config';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const notionApi = new NotionAPI();
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!process.env.NOTION_TOKEN) {
  console.warn('[lib/notion] NOTION_TOKEN is not defined. Please set it in environment variables.');
}
if (!DATABASE_ID) {
  console.warn('[lib/notion] NOTION_DATABASE_ID is not defined. Please set it in environment variables.');
}

const formatMultiSelect = (items = []) =>
  items.map((item) => ({
    id: item.id,
    name: item.name,
    color: item.color,
  }));

export async function getPosts() {
  if (!process.env.NOTION_TOKEN || !DATABASE_ID) {
    throw new Error('缺少 NOTION_TOKEN 或 NOTION_DATABASE_ID 环境变量，无法读取 Notion 数据。');
  }

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          {
            property: PROP.type,
            select: { equals: PROP.type_post },
          },
          {
            property: PROP.status,
            select: { equals: PROP.status_publish },
          },
        ],
      },
      sorts: [
        {
          property: PROP.date,
          direction: 'descending',
        },
      ],
    });

    const posts = response.results.map((page) => {
      const properties = page.properties;
      const title = properties[PROP.title]?.title?.[0]?.plain_text || '未命名文章';
      const slugText = properties[PROP.slug]?.rich_text?.[0]?.plain_text?.trim() || '';
      const rawId = page.id.replace(/-/g, '');
      const slug = slugText || rawId;
      const date = properties[PROP.date]?.date?.start || null;
      const summary = properties[PROP.summary]?.rich_text || '';
      const categories = formatMultiSelect(properties[PROP.category]?.multi_select);
      const tags = formatMultiSelect(properties[PROP.tags]?.multi_select);

      return {
        id: page.id,
        rawId,
        slug,
        title,
        date,
        summary,
        categories,
        tags,
      };
    });

    console.log(
      '[getPosts] posts:',
      posts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
      })),
    );

    return posts;
  } catch (error) {
    // 打印 Notion API 返回的 body，便于排查属性名/权限等问题
    console.error('[getPosts] failed:', error?.body || error);
    throw error;
  }
}

export async function getAllSlugs() {
  const posts = await getPosts();
  const slugs = posts.map((p) => p.slug);
  console.log('[getAllSlugs] slugs:', slugs);
  return slugs;
}

export async function getPostBySlug(slug) {
  const posts = await getPosts();

  console.log('[getPostBySlug] target slug:', slug);
  console.log(
    '[getPostBySlug] all slugs:',
    posts.map((p) => p.slug),
  );

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    console.warn('[getPostBySlug] NOT FOUND for slug:', slug);
    return null;
  }

  try {
    const recordMap = await notionApi.getPage(post.id);

    return {
      meta: {
        id: post.id,
        title: post.title,
        date: post.date,
        categories: post.categories,
        tags: post.tags,
      },
      recordMap,
    };
  } catch (error) {
    console.error('[getPostBySlug] notionApi.getPage failed:', error?.body || error);
    throw error;
  }
}
