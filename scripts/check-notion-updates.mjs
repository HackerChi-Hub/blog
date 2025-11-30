#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
  console.error('NOTION_TOKEN 或 NOTION_DATABASE_ID 缺失，无法检测 Notion 更新。');
  process.exit(1);
}

// 与 lib/config.js 保持一致的属性名配置
const NOTION_PROPERTY_NAME = {
  password: process.env.NEXT_PUBLIC_NOTION_PROPERTY_PASSWORD || 'password',

  type: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE || 'type',
  type_post: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_POST || 'Post',
  type_page: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_PAGE || 'Page',
  type_notice: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_NOTICE || 'Notice',
  type_menu: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_MENU || 'Menu',
  type_sub_menu:
    process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_SUB_MENU || 'SubMenu',

  title: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TITLE || 'title',
  status: process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS || 'status',
  status_publish:
    process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS_PUBLISH || 'Published',
  status_invisible:
    process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS_INVISIBLE || 'Invisible',
  summary: process.env.NEXT_PUBLIC_NOTION_PROPERTY_SUMMARY || 'summary',
  slug: process.env.NEXT_PUBLIC_NOTION_PROPERTY_SLUG || 'slug',
  category: process.env.NEXT_PUBLIC_NOTION_PROPERTY_CATEGORY || 'category',
  date: process.env.NEXT_PUBLIC_NOTION_PROPERTY_DATE || 'date',
  tags: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TAGS || 'tags',
  icon: process.env.NEXT_PUBLIC_NOTION_PROPERTY_ICON || 'icon',
  ext: process.env.NEXT_PUBLIC_NOTION_PROPERTY_EXT || 'ext',
};

// —— 新增：status 属性类型配置 —— //
const STATUS_PROPERTY_TYPE =
  process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS_TYPE || 'status'; // status | select | checkbox
const STATUS_PUBLISH_VALUE =
  process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS_FIELD ||
  NOTION_PROPERTY_NAME.status_publish;

// 解析命令行参数
const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) {
  const key = process.argv[i];
  const value = process.argv[i + 1];
  if (!key || !value) continue;
  args.set(key.replace(/^--/, ''), value);
}

const previousPath = args.get('previous');
const outputPath = args.get('output') || 'notion-hash.txt';

function buildStatusFilter() {
  const propertyName = NOTION_PROPERTY_NAME.status;
  switch (STATUS_PROPERTY_TYPE) {
    case 'select':
      return {
        property: propertyName,
        select: { equals: STATUS_PUBLISH_VALUE },
      };
    case 'checkbox':
      return {
        property: propertyName,
        checkbox: { equals: STATUS_PUBLISH_VALUE === 'true' },
      };
    case 'status':
    default:
      return {
        property: propertyName,
        status: { equals: STATUS_PUBLISH_VALUE },
      };
  }
}

async function fetchAllPublishedPages() {
  const headers = {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  };

  const results = [];
  let hasMore = true;
  let startCursor = undefined;

  while (hasMore) {
    const body = {
      page_size: 100,
      start_cursor: startCursor,
      filter: buildStatusFilter(),
      sorts: [
        {
          property: NOTION_PROPERTY_NAME.date,
          direction: 'descending',
        },
      ],
    };

    const res = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Notion API 请求失败 (${res.status}): ${text}`);
    }

    const data = await res.json();
    data.results.forEach((page) => {
      const slugProperty = page.properties?.[NOTION_PROPERTY_NAME.slug];
      const titleProperty = page.properties?.[NOTION_PROPERTY_NAME.title];
      const dateProperty = page.properties?.[NOTION_PROPERTY_NAME.date];

      const slugText =
        slugProperty?.rich_text?.[0]?.plain_text ??
        slugProperty?.title?.[0]?.plain_text ??
        '';

      const titleText =
        titleProperty?.title
          ?.map((block) => block.plain_text)
          .join('') ?? '';

      const dateValue =
        dateProperty?.date?.start ?? page.last_edited_time ?? '';

      results.push({
        id: page.id,
        slug: slugText,
        title: titleText,
        date: dateValue,
        lastEdited: page.last_edited_time,
      });
    });

    hasMore = data.has_more;
    startCursor = data.next_cursor;
  }

  return results;
}

function buildHash(pages) {
  const normalized = pages
    .map((p) => `${p.id}:${p.slug}:${p.title}:${p.date}:${p.lastEdited}`)
    .sort()
    .join('\n');

  return createHash('sha256').update(normalized).digest('hex');
}

async function readPreviousHash() {
  if (!previousPath) return '';
  try {
    const content = await readFile(previousPath, 'utf8');
    return content.trim();
  } catch {
    return '';
  }
}

(async () => {
  try {
    const pages = await fetchAllPublishedPages();
    const currentHash = buildHash(pages);
    await writeFile(outputPath, `${currentHash}\n`, 'utf8');

    const previousHash = await readPreviousHash();
    const changed = currentHash !== previousHash;

    console.log(`上次哈希: ${previousHash || '(无)'}`);
    console.log(`当前哈希: ${currentHash}`);
    console.log(`内容是否变更: ${changed}`);

    const outputFile = process.env.GITHUB_OUTPUT;
    if (outputFile) {
      await writeFile(
        outputFile,
        `changed=${changed}\ncurrent_hash=${currentHash}\n`,
        { flag: 'a' }
      );
    }

    process.exit(0);
  } catch (error) {
    console.error('检测 Notion 更新失败：', error);
    process.exit(1);
  }
})();
