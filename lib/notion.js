// lib/notion.js
import { NotionAPI } from 'notion-client';
import { getPageTitle } from 'notion-utils';

const notion = new NotionAPI({
  authToken: process.env.NOTION_TOKEN
});

// 如果你之后想用数据库，可以再用 NOTION_DATABASE_ID
// 现在先不用，避免 getCollectionData 的参数问题
const databaseId = process.env.NOTION_DATABASE_ID;

// 这里先手工维护一个文章 ID 列表（Notion 页面 ID）
// 你可以从 Notion 页面 URL 里复制那串 32 位 ID（带或不带短横线都可以）
const POST_IDS = [
  // 举例：'c506d7bc-2d1e-4958-a61a-d268db9fd641',
  // 再加几篇你想同步的 Notion 页面 ID
];

// 获取文章列表（从 POST_IDS 中读取）
export async function getPosts() {
  if (!POST_IDS.length) {
    console.warn('POST_IDS is empty. Add some Notion page IDs in lib/notion.js');
    return [];
  }

  const posts = [];

  for (const id of POST_IDS) {
    try {
      const recordMap = await notion.getPage(id);
      const title = getPageTitle({ recordMap, pageId: id });

      posts.push({
        id,
        title,
        slug: id.replace(/-/g, ''), // 去掉短横线作为 slug
        date: null
      });
    } catch (error) {
      console.error('Error fetching page', id, error.message || error);
    }
  }

  return posts;
}

// 根据页面 id 获取 Notion 页面内容
export async function getPageContent(pageId) {
  const recordMap = await notion.getPage(pageId);
  return recordMap;
}
