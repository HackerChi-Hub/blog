// lib/notion.js
import { Client } from '@notionhq/client';
import { NOTION_PROPERTY_NAME as N } from './config';
import { HttpsProxyAgent } from 'https-proxy-agent';
import fetch from 'node-fetch';
import { DB_VIEW_TO_SOURCE } from './newsConfig';

/* ===================== 代理配置 ===================== */

// 优先使用环境变量 HTTP_PROXY；如果没有，则回退到本地 10808
const proxyUrl = process.env.HTTP_PROXY || 'http://127.0.0.1:10808';

// 是否启用代理
const useProxy = !!proxyUrl;
const agent = useProxy ? new HttpsProxyAgent(proxyUrl) : undefined;

// 自定义 fetch，让所有 Notion 请求走同一个代理
async function notionFetch(url, options = {}) {
  const finalOptions = { ...options };
  if (agent) {
    finalOptions.agent = agent;
  }
  return fetch(url, finalOptions);
}

// 创建 Notion 客户端
const notionClient = new Client({
  auth: process.env.NOTION_TOKEN,
  fetch: notionFetch,
});

const databaseId = process.env.NOTION_DATABASE_ID;

/* ===================== 工具函数：安全读属性 ===================== */

function getSelectName(prop) {
  return prop?.select?.name || '';
}

function getMultiSelectNames(prop) {
  return prop?.multi_select?.map((t) => t.name) || [];
}

function getRichTextPlain(prop) {
  return prop?.rich_text?.map((t) => t.plain_text).join('') || '';
}

function getTitlePlain(prop) {
  return prop?.title?.map((t) => t.plain_text).join('') || '';
}

function getDateString(prop) {
  return prop?.date?.start || '';
}

/* ===================== 文章列表 / 单篇 ===================== */

/**
 * 获取文章列表（仅 status = Published）
 */
export async function getAllPosts(pageSize = 50) {
  try {
    const response = await notionClient.databases.query({
      database_id: databaseId,
      filter: {
        property: N.status,
        select: {
          equals: N.status_publish,
        },
      },
      sorts: [
        {
          property: N.date,
          direction: 'descending',
        },
      ],
      page_size: pageSize,
    });

    return response.results.map((page) => {
      const properties = page.properties;

      const title = getTitlePlain(properties[N.title]);
      const slug =
        properties[N.slug]?.rich_text?.[0]?.plain_text?.trim() || page.id;
      const date = getDateString(properties[N.date]);
      const summary = getRichTextPlain(properties[N.summary]);
      const category = getSelectName(properties[N.category]);
      const tags = getMultiSelectNames(properties[N.tags]);
      const status = getSelectName(properties[N.status]);
      const type = getSelectName(properties[N.type]);
      const icon =
        properties[N.icon]?.files?.[0]?.file?.url ||
        properties[N.icon]?.files?.[0]?.external?.url ||
        null;

      return {
        id: page.id,
        title,
        slug,
        date,
        summary,
        category,
        tags,
        status,
        type,
        icon,
      };
    });
  } catch (error) {
    console.error('getAllPosts 错误:', error);
    return [];
  }
}

/* ===================== Block 获取（递归） ===================== */

export async function getBlockChildren(blockId) {
  const blocks = [];
  let cursor;

  try {
    while (true) {
      const res = await notionClient.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 100,
      });

      blocks.push(...res.results);

      if (!res.has_more) break;
      cursor = res.next_cursor;
    }

    const blocksWithChildren = await Promise.all(
      blocks.map(async (block) => {
        if (block.has_children) {
          const children = await getBlockChildren(block.id);
          return { ...block, children };
        }
        return block;
      })
    );

    return blocksWithChildren;
  } catch (error) {
    console.error('getBlockChildren 错误:', error);
    return [];
  }
}

/**
 * 扫描 blocks，找到所有 child_database：[{ blockId, dbName }]
 * dbName 来自 block.child_database.title（数据库名称）
 */
function findChildDatabasesByName(blocks) {
  const result = [];

  function dfs(list) {
    for (const block of list) {
      if (!block) continue;

      if (block.type === 'child_database') {
        console.log(
          'RAW child_database block:',
          JSON.stringify(block.child_database, null, 2)
        );

        const rawTitle = block.child_database?.title;

        // 兼容多种情况：数组 / 字符串 / 其它
        let dbName = '';
        if (Array.isArray(rawTitle)) {
          dbName = rawTitle.map((t) => t.plain_text || '').join('');
        } else if (typeof rawTitle === 'string') {
          dbName = rawTitle;
        } else if (rawTitle && typeof rawTitle === 'object') {
          // 如果是类似 { type: 'text', text: {...} } 的结构
          if (Array.isArray(rawTitle.rich_text)) {
            dbName = rawTitle.rich_text
              .map((t) => t.plain_text || '')
              .join('');
          } else if (rawTitle.plain_text) {
            dbName = rawTitle.plain_text;
          }
        }

        dbName = (dbName || '').trim();

        console.log('PARSED child_database name:', dbName);

        result.push({
          blockId: block.id,
          dbName,
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
 * 根据 child_database 名称 + DB_VIEW_TO_SOURCE 映射，加载真实数据库数据
 * 返回 { databasesData }，key 为 child_database blockId
 */
async function attachNewsSectionDataByDbName(blocks, viewMapping) {
  const pairs = findChildDatabasesByName(blocks);
  const databasesData = {};

  console.log('child db + name:', pairs);

  for (const item of pairs) {
    const { blockId, dbName } = item;
    if (!dbName) continue;

    const cfg = viewMapping[dbName];
    if (!cfg) continue; // 该名字没有配置映射，跳过

    const dbId = process.env[cfg.databaseEnv];
    if (!dbId) {
      console.warn(
        `数据库名「${dbName}」配置了 ${cfg.databaseEnv}，但环境变量中未找到`
      );
      continue;
    }

    try {
      const filter =
        cfg.categoryProperty && cfg.categoryValue
          ? {
              property: cfg.categoryProperty,
              select: { equals: cfg.categoryValue },
            }
          : undefined;

      const queryParams = {
        database_id: dbId,
        page_size: 100,
      };
      if (filter) queryParams.filter = filter;

      const dbMeta = await notionClient.databases.retrieve({
        database_id: dbId,
      });
      const dbRows = await notionClient.databases.query(queryParams);

      databasesData[blockId] = {
        meta: dbMeta,
        rows: dbRows.results,
        dbName,
      };
    } catch (err) {
      console.error(
        '加载数据库失败（按名称映射）:',
        dbName,
        dbId,
        err?.body?.message || err.message
      );
    }
  }

  console.log('databasesData keys:', Object.keys(databasesData));

  return { databasesData };
}

/**
 * 根据 slug 获取单篇文章及其 blocks + 文中 child_database 数据
 */
export async function getPostBySlug(slugOrId) {
  try {
    // 1. 先按 slug 属性查
    let response = await notionClient.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: N.slug,
            rich_text: {
              equals: slugOrId,
            },
          },
          {
            property: N.status,
            select: {
              equals: N.status_publish,
            },
          },
        ],
      },
      page_size: 1,
    });

    // 2. slug 查不到，且看起来是 UUID，就按 pageId 查
    if (response.results.length === 0) {
      const looksLikeUuid = /^[0-9a-fA-F-]{32,}$/.test(slugOrId);

      if (looksLikeUuid) {
        const page = await notionClient.pages.retrieve({
          page_id: slugOrId,
        });

        const properties = page.properties || {};
        const statusName = properties[N.status]?.select?.name || '';

        if (statusName && statusName !== N.status_publish) {
          return null;
        }

        const title = getTitlePlain(properties[N.title]);
        const date = getDateString(properties[N.date]);
        const summary = getRichTextPlain(properties[N.summary]);
        const category = getSelectName(properties[N.category]);
        const tags = getMultiSelectNames(properties[N.tags]);
        const status = getSelectName(properties[N.status]);
        const type = getSelectName(properties[N.type]);
        const icon =
          properties[N.icon]?.files?.[0]?.file?.url ||
          properties[N.icon]?.files?.[0]?.external?.url ||
          null;

        const blocks = await getBlockChildren(page.id);

        const { databasesData } = await attachNewsSectionDataByDbName(
          blocks,
          DB_VIEW_TO_SOURCE
        );

        return {
          id: page.id,
          title,
          slug: slugOrId,
          date,
          summary,
          category,
          tags,
          status,
          type,
          icon,
          blocks,
          databasesData,
        };
      }
    }

    // 3. slug 查到了
    if (response.results.length === 0) {
      return null;
    }

    const page = response.results[0];
    const properties = page.properties;

    const title = getTitlePlain(properties[N.title]);
    const date = getDateString(properties[N.date]);
    const summary = getRichTextPlain(properties[N.summary]);
    const category = getSelectName(properties[N.category]);
    const tags = getMultiSelectNames(properties[N.tags]);
    const status = getSelectName(properties[N.status]);
    const type = getSelectName(properties[N.type]);
    const icon =
      properties[N.icon]?.files?.[0]?.file?.url ||
      properties[N.icon]?.files?.[0]?.external?.url ||
      null;

    const blocks = await getBlockChildren(page.id);

    const { databasesData } = await attachNewsSectionDataByDbName(
      blocks,
      DB_VIEW_TO_SOURCE
    );

    return {
      id: page.id,
      title,
      slug: slugOrId,
      date,
      summary,
      category,
      tags,
      status,
      type,
      icon,
      blocks,
      databasesData,
    };
  } catch (error) {
    console.error('getPostBySlug 错误:', error);
    return null;
  }
}

/* ===================== 菜单（SubMenu） ===================== */

export async function getMenus() {
  try {
    const response = await notionClient.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: N.status,
            select: { equals: N.status_publish },
          },
          {
            property: N.type,
            select: { equals: N.type_sub_menu },
          },
        ],
      },
      sorts: [
        {
          property: N.date,
          direction: 'descending',
        },
      ],
    });

    return response.results.map((page) => {
      const properties = page.properties;

      const rawSlug =
        properties[N.slug]?.rich_text?.[0]?.plain_text?.trim() || '';

      const isExternal =
        rawSlug.startsWith('http:') || rawSlug.startsWith('https:');

      const href = isExternal ? rawSlug : `/${rawSlug}`;

      return {
        id: page.id,
        title: getTitlePlain(properties[N.title]) || '未命名',
        slug: rawSlug,
        isExternal,
        href,
      };
    });
  } catch (error) {
    console.error('getMenus 错误:', error);
    return [];
  }
}

/* ===================== 置顶文章（type = Notice） ===================== */

export async function getPinnedPosts() {
  const posts = await getAllPosts(100);
  return posts.filter((post) => post.type === N.type_notice);
}

/* ===================== 查询任意数据库（工具） ===================== */

export async function queryDatabase(dbId, pageSize = 20) {
  try {
    const response = await notionClient.databases.query({
      database_id: dbId,
      page_size: pageSize,
    });

    return response.results;
  } catch (error) {
    console.error('queryDatabase 错误:', error);
    return [];
  }
}
