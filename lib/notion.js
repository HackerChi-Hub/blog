// lib/notion.js
import { NotionAPI } from 'notion-client';
import { getPageTitle } from 'notion-utils';

const notion = new NotionAPI({
  authToken: process.env.NOTION_TOKEN
});

const databaseId = process.env.NOTION_DATABASE_ID;

// 获取文章列表
export async function getPosts() {
  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID is not set');
  }

  const response = await notion.getCollectionData({
    collectionId: databaseId,
    collectionViewId: '', // 如果你之后需要按视图过滤，可以在这里填 viewId；现在先留空
    limit: 100
  });

  // 简单处理成数组
  const records = response?.recordMap?.block || {};
  const posts = Object.values(records)
    .filter((r) => r.value?.type === 'page' && !r.value?.archived)
    .map((r) => {
      const value = r.value;
      const title = getPageTitle({ recordMap: response.recordMap, pageId: value.id });
      return {
        id: value.id,
        title,
        slug: value.id.replace(/-/g, ''), // 临时用 id 做 slug
        date: value?.created_time
      };
    });

  return posts;
}

// 根据页面 id 获取 Notion 页面内容
export async function getPageContent(pageId) {
  const recordMap = await notion.getPage(pageId);
  return recordMap;
}
