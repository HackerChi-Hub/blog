// lib/notion.js

import { Client } from '@notionhq/client';
import { DB_ID_TO_SOURCE } from './newsConfig';
import { TOP_MENUS } from './config';

// -------------------- Notion Client --------------------

export const notionClient = new Client({
  auth: process.env.NOTION_TOKEN,
});

// 你的主文章数据库（博客 / 页面）
// 请在 .env 里配置 NOTION_DB_BLOG
const BLOG_DB_ID = process.env.NOTION_DB_BLOG;

// 菜单数据库（如果你有单独菜单库，可以换成它；没有就直接用配置）
const MENU_DB_ID = process.env.NOTION_DB_MENU || null;

// -------------------- 通用工具函数 --------------------

function getPlainTextFromRichText(richTextArray) {
  if (!Array.isArray(richTextArray)) return '';
  return richTextArray.map((t) => t.plain_text || '').join('');
}

function getTitle(page, name = 'Name') {
  const prop = page.properties?.[name];
  if (!prop || !Array.isArray(prop.title)) return 'Untitled';
  return getPlainTextFromRichText(prop.title);
}

function getSlug(page, name = 'Slug') {
  const prop = page.properties?.[name];
  if (!prop || !Array.isArray(prop.rich_text)) return '';
  return getPlainTextFromRichText(prop.rich_text);
}

function getDate(page, name = 'Date') {
  const prop = page.properties?.[name];
  return prop?.date?.start || null;
}

// -------------------- 文章列表：getAllPosts --------------------

/**
 * 从主文章数据库读取所有 Published = true 的条目
 * 并返回一个 { id, slug, title, date, type } 数组
 */
export async function getAllPosts(limit = 200) {
  if (!BLOG_DB_ID) {
    console.warn(
      'NOTION_DB_BLOG 未配置，getAllPosts 将返回空数组。请在 .env 中设置。'
    );
    return [];
  }

  const response = await notionClient.databases.query({
    database_id: BLOG_DB_ID,
    page_size: limit,
    filter: {
      property: 'Published',
      checkbox: { equals: true },
    },
    sorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
  });

  return response.results.map((page) => ({
    id: page.id,
    slug: getSlug(page),
    title: getTitle(page),
    date: getDate(page),
    type:
      page.properties?.Type?.select?.name ||
      page.properties?.type?.select?.name ||
      'Post',
  }));
}

// -------------------- 获取单篇文章：getPostBySlug --------------------

/**
 * 根据 slug 查询单篇文章，并展开所有 blocks。
 * 同时扫描其中的 child_database 块，按 database_id 查询对应数据，
 * 返回 { post: { id, slug, title, date, blocks }, databasesData }。
 */
export async function getPostBySlug(slug) {
  if (!BLOG_DB_ID) {
    throw new Error('NOTION_DB_BLOG 未配置，无法调用 getPostBySlug。');
  }

  // 1. 在文章数据库中找到对应 slug 的记录
  const query = await notionClient.databases.query({
    database_id: BLOG_DB_ID,
    page_size: 1,
    filter: {
      property: 'Slug',
      rich_text: { equals: slug },
    },
  });

  if (!query.results.length) return null;

  const page = query.results[0];

  // 2. 读取该 page 的所有 block（递归）
  const blocks = await getAllBlocks(page.id);

  // 3. 针对其中的 child_database 块，按 database_id 映射到真实数据库
  const { databasesData } = await attachNewsSectionDataByDatabaseId(blocks);

  // 4. 返回给前端
  return {
    id: page.id,
    slug: getSlug(page),
    title: getTitle(page),
    date: getDate(page),
    blocks,
    databasesData,
  };
}

// -------------------- 读取 Blocks（递归） --------------------

async function getBlockChildren(blockId) {
  const result = [];
  let cursor = undefined;

  while (true) {
    const { results, has_more, next_cursor } =
      await notionClient.blocks.children.list({
        block_id: blockId,
        page_size: 100,
        start_cursor: cursor,
      });

    result.push(...results);

    if (!has_more) break;
    cursor = next_cursor;
  }

  return result;
}

export async function getAllBlocks(pageId) {
  const topBlocks = await getBlockChildren(pageId);

  async function dfs(block) {
    const hasChildren = block.has_children;

    if (!hasChildren) return block;

    const children = await getBlockChildren(block.id);
    block.children = [];

    for (const child of children) {
      block.children.push(await dfs(child));
    }
    return block;
  }

  const blocks = [];
  for (const b of topBlocks) {
    blocks.push(await dfs(b));
  }
  return blocks;
}

// -------------------- child_database 按 database_id 映射 --------------------

/**
 * 找到所有 child_database 块：[{ blockId, databaseId }]
 */
function findChildDatabasesById(blocks) {
  const result = [];

  function dfs(list) {
    for (const block of list) {
      if (!block) continue;

      if (block.type === 'child_database') {
        const dbId = block.child_database?.database_id || '';
        result.push({
          blockId: block.id,
          databaseId: dbId,
        });
      }

      if (block.has_children && Array.isArray(block.children)) {
        dfs(block.children);
      }
    }
  }

  dfs(blocks);
  return result;
}

/**
 * 根据 child_database 的 database_id + DB_ID_TO_SOURCE 配置
 * 查询真实数据库，返回 { databasesData }，用 blockId 做 key。
 */
export async function attachNewsSectionDataByDatabaseId(blocks) {
  const pairs = findChildDatabasesById(blocks);
  const databasesData = {};

  console.log('child db + id:', pairs);

  for (const item of pairs) {
    const { blockId, databaseId } = item;
    if (!databaseId) continue;

    const cfg = DB_ID_TO_SOURCE[databaseId];
    if (!cfg) {
      console.warn(
        `child_database 所指向的数据库 ${databaseId} 未在 DB_ID_TO_SOURCE 中配置映射`
      );
      continue;
    }

    const realDbId = process.env[cfg.databaseEnv] || databaseId;

    try {
      const filter =
        cfg.categoryProperty && cfg.categoryValue
          ? {
              property: cfg.categoryProperty,
              select: { equals: cfg.categoryValue },
            }
          : undefined;

      const queryParams = {
        database_id: realDbId,
        page_size: 100,
      };
      if (filter) queryParams.filter = filter;

      const dbMeta = await notionClient.databases.retrieve({
        database_id: realDbId,
      });
      const dbRows = await notionClient.databases.query(queryParams);

      databasesData[blockId] = {
        meta: dbMeta,
        rows: dbRows.results,
        dbName:
          getPlainTextFromRichText(dbMeta.title) ||
          dbMeta.title?.[0]?.plain_text ||
          '数据库',
      };
    } catch (err) {
      console.error(
        '加载数据库失败（按 database_id 映射）:',
        databaseId,
        err?.body?.message || err.message
      );
    }
  }

  console.log('databasesData keys:', Object.keys(databasesData));

  return { databasesData };
}

// -------------------- 顶部菜单：getMenus --------------------

/**
 * 如果你有单独的菜单数据库，可以改成从 Notion 读取。
 * 目前默认直接返回 lib/config.js 里的 TOP_MENUS。
 */
export async function getMenus() {
  if (!MENU_DB_ID) {
    // 直接用静态配置
    return TOP_MENUS;
  }

  // （可选）从 Notion 查询菜单
  const res = await notionClient.databases.query({
    database_id: MENU_DB_ID,
    page_size: 100,
  });

  const menus = res.results.map((page) => ({
    id: page.id,
    title: getTitle(page),
    href:
      page.properties?.Href?.url ||
      page.properties?.href?.url ||
      '/',
    isExternal:
      page.properties?.External?.checkbox ||
      page.properties?.external?.checkbox ||
      false,
  }));

  return menus.length ? menus : TOP_MENUS;
}
