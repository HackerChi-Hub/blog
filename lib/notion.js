// lib/notion.js
import { Client } from '@notionhq/client';

const notionClient = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

// 获取全部文章（只返回Published状态）
export async function getAllPosts() {
  try {
    const response = await notionClient.databases.query({
      database_id: databaseId,
      filter: {
        property: 'status',
        select: { equals: 'Published' },
      },
      sorts: [{ property: 'date', direction: 'descending' }]
    });
    const posts = response.results.map(page => {
      const props = page.properties;
      return {
        id: page.id,
        title: props.title.title[0]?.plain_text || '',
        slug: props.slug?.rich_text[0]?.plain_text || '',
        summary: props.summary?.rich_text[0]?.plain_text || '',
        category: props.category?.multi_select?.map(i => i.name) || [],
        tags: props.tags?.multi_select?.map(i => i.name) || [],
        date: props.date?.date?.start || '',
        type: props.type?.select?.name || 'Post',
        status: props.status?.select?.name || '',
      };
    });
    const pinSlugs = ['HackerNew', 'News', 'notice'];
    const pinPosts = [], normalPosts = [];
    for (const post of posts) {
      if (pinSlugs.includes(post.slug)) pinPosts.push(post);
      else normalPosts.push(post);
    }
    return { pinPosts, normalPosts };
  } catch (err) {
    console.error('getAllPosts 错误:', err);
    return { pinPosts: [], normalPosts: [] };
  }
}

  // 数据处理
  const posts = response.results.map(page => {
    const props = page.properties;
    return {
      id: page.id,
      title: props.title.title[0]?.plain_text || '',
      slug: props.slug?.rich_text[0]?.plain_text || '',
      summary: props.summary?.rich_text[0]?.plain_text || '',
      category: props.category?.multi_select.map(i => i.name) || [],
      tags: props.tags?.multi_select.map(i => i.name) || [],
      date: props.date?.date?.start || '',
      type: props.type?.select?.name || 'Post',
      status: props.status?.select?.name || '',
    };
  });

  // 置顶slug
  const pinSlugs = ['HackerNew', 'News', 'notice'];
  const pinPosts = [];
  const normalPosts = [];

  for (const post of posts) {
    if (pinSlugs.includes(post.slug)) pinPosts.push(post);
    else normalPosts.push(post);
  }

  return { pinPosts, normalPosts };
}

// 获取顶部菜单
export async function getMenus() {
  const response = await notionClient.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        { property: 'type', select: { equals: 'SubMenu' } },
        { property: 'status', select: { equals: 'Published' } },
      ]
    },
    sorts: [{ property: 'date', direction: 'ascending' }]
  });
  return response.results.map(page => {
    const props = page.properties;
    return {
      title: props.title.title[0]?.plain_text || '',
      slug: props.slug?.rich_text[0]?.plain_text || '',
    };
  });
}

// 获取单篇文章（及内容块）
export async function getPostBySlug(slug) {
  const response = await notionClient.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        { property: 'slug', rich_text: { equals: slug } },
        { property: 'status', select: { equals: 'Published' } }
      ]
    }
  });
  const page = response.results[0];
  if (!page) return null;

  // 获取页面内容块
  const blocks = await notionClient.blocks.children.list({ block_id: page.id });

  const props = page.properties;
  return {
    id: page.id,
    title: props.title.title[0]?.plain_text || '',
    summary: props.summary?.rich_text[0]?.plain_text || '',
    category: props.category?.multi_select.map(i => i.name) || [],
    tags: props.tags?.multi_select.map(i => i.name) || [],
    date: props.date?.date?.start || '',
    type: props.type?.select?.name || 'Post',
    status: props.status?.select?.name || '',
    blocks: blocks.results
  };
}
