// lib/notion.js
import { NotionAPI } from 'notion-client';

const notion = new NotionAPI();

// 从环境变量中读取数据库 ID（在 GitHub Secrets 中配置 NOTION_DATABASE_ID）
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

/**
 * 从数据库中获取所有文章
 * 只选：
 *   - type = "Post"
 *   - status = "Published"
 * 并按照 date 倒序排序
 */
export async function getPosts() {
  if (!DATABASE_ID) {
    console.warn(
      '环境变量 NOTION_DATABASE_ID 未设置。请在 GitHub Secrets 或本地 .env 中配置 NOTION_DATABASE_ID'
    );
    return [];
  }

  try {
    // 通过 Notion 官方 API 查询数据库
    const url = `https://api.notion.com/v1/databases/${DATABASE_ID}/query`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`, // 你的集成密钥
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filter: {
          and: [
            {
              property: 'type',
              select: { equals: 'Post' }
            },
            {
              property: 'status',
              status: { equals: 'Published' }
            }
          ]
        },
        sorts: [
          {
            property: 'date',
            direction: 'descending'
          }
        ]
      })
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('查询数据库失败:', res.status, text);
      return [];
    }

    const data = await res.json();

    const posts = data.results.map((page) => {
      const props = page.properties;

      // 标题属性在 Notion 数据库里一般叫 "Name" 或你自定义的名称
      const titleProp = props.Name || props.name || props.title;

      const title =
        titleProp?.title?.[0]?.plain_text ||
        '未命名文章';

      const dateProp = props.date;
      const date = dateProp?.date?.start || null;

      const slugProp = props.slug;
      const slug =
        slugProp?.rich_text?.[0]?.plain_text ||
        slugProp?.formula?.string ||
        page.id.replace(/-/g, '');

      const summaryProp = props.summary;
      const summary =
        summaryProp?.rich_text?.[0]?.plain_text || '';

      const tagsProp = props.tags;
      const tags =
        tagsProp?.multi_select?.map((t) => t.name) || [];

      return {
        id: page.id,         // 数据库里返回的 page.id（带 -）
        rawId: page.id.replace(/-/g, ''), // 去掉 - 的版本，可以用作 slug
        title,
        date,
        slug,
        summary,
        tags
      };
    });

    console.log('getPosts from database result:', posts);

    return posts;
  } catch (error) {
    console.error('获取数据库文章列表失败:', error);
    return [];
  }
}

/**
 * 根据 slug 获取单篇文章的 Notion 页面 recordMap，用于渲染正文
 * slug 优先使用数据库中的 slug 字段；如果没有，就用去掉 - 的 pageId
 */
export async function getPostBySlug(slug) {
  const posts = await getPosts();

  // 先按 slug 匹配
  let post = posts.find((p) => p.slug === slug);

  // 如果 slug 字段为空，就退回用 rawId 匹配
  if (!post) {
    post = posts.find((p) => p.rawId === slug);
  }

  if (!post) {
    console.warn('根据 slug 未找到文章:', slug);
    return null;
  }

  try {
    const recordMap = await notion.getPage(post.id);

    if (!recordMap) {
      console.warn('getPage 返回空 recordMap，pageId:', post.id);
      return null;
    }

    return {
      meta: post,
      recordMap
    };
  } catch (error) {
    console.error(
      '获取文章页面失败:',
      post.id,
      error.response?.body || error.message || error
    );
    return null;
  }
}

/**
 * 获取所有文章的 slug，用于 getStaticPaths
 */
export async function getAllSlugs() {
  const posts = await getPosts();
  return posts.map((p) => p.slug || p.rawId);
}
