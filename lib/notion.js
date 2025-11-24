import { NotionAPI } from 'notion-client';

const notion = new NotionAPI({
  authToken: process.env.NOTION_TOKEN
});

const databaseId = process.env.NOTION_DATABASE_ID;

export async function getPosts() {
  // 用 databaseId 去查 Notion 数据库
}
