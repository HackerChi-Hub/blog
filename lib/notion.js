// lib/notion.js
import { NotionAPI } from 'notion-client';
import { NOTION_PROPERTY_NAME as P } from './config';

const notion = new NotionAPI();
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

/**
 * 从 Notion 数据库读取文章列表
 * 只选：
 *   - type == type_post（默认 'Post'）
 *   - status == status_publish（默认 'Published'）
 */
export async function getPosts() {
  if (!DATABASE_ID) {
    console.warn('NOTION_DATABASE_ID 未设置');
    return [];
  }

  try {
    const url = `https://api.notion.com/v1/databases/${DATABASE_ID}/query`;

    const body = {
      filter: {
        and: [
          // type = Post
          {
            property: P.type,
            select: {
              equals: P.type_post
            }
          },
          // status = Published
          {
            property: P.status,
            // 不确定你是 Select 还是 Status 类型，这里尝试两种；
            // 如果报错我们再根据 _rawProperties 调整。
            or: [
              { status: { equals: P.status_publish } },
              { select: { equals: P.status_publish } }
            ]
          }
        ]
      },
      sorts: [
        {
          property: P.date,
          direction: 'descending'
        }
      ]
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('查询数据库失败:', res.status, text);
      return [];
    }

    const data = await res.json();

    const posts = data.results.map((page) => {
      const props = page.properties;

      const titleProp = props[P.title] || props.Name || props.name;
      const title = titleProp?.title?.[0]?.plain_text || '未命名文章';

      const dateProp = props[P.date];
      const date = dateProp?.date?.start || null;

      const slugProp = props[P.slug];
      const slug =
        slugProp?.rich_text?.[0]?.plain_text ||
        slugProp?.formula?.string ||
        page.id.replace(/-/g, '');

      const summaryProp = props[P.summary];
      const summary =
        summaryProp?.rich_text?.[0]?.plain_text || '';

      const tagsProp = props[P.tags];
      const tags =
        tagsProp?.multi_select?.map((t) => t.name) || [];

      return {
        id: page.id,
        rawId: page.id.replace(/-/g, ''), // 用于兜底 slug
        title,
        date,
        slug,
        summary,
        tags
      };
    });

    console.log('getPosts from database result:', posts);
    return posts;
  } catch (err) {
    console.error('获取数据库文章列表失败:', err);
    return [];
  }
}

/**
 * 根据 slug 获取单篇文章的 meta + recordMap
 */
export async function getPostBySlug(slug) {
  const posts = await getPosts();

  let post =
    posts.find((p) => p.slug === slug) ||
    posts.find((p) => p.rawId === slug);

  if (!post) {
    console.warn('未找到 slug 对应文章:', slug);
    return null;
  }

  try {
    const recordMap = await notion.getPage(post.id);
    if (!recordMap) {
      console.warn('getPage 返回空 recordMap:', post.id);
      return null;
    }

    return { meta: post, recordMap };
  } catch (err) {
    console.error('获取文章页面失败:', post.id, err);
    return null;
  }
}

/**
 * 获取所有 slug，用于 getStaticPaths
 */
export async function getAllSlugs() {
  const posts = await getPosts();
  return posts.map((p) => p.slug || p.rawId);
}
