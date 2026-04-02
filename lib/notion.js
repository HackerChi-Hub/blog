import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';
import { NOTION_PROPERTY_NAME as PROP } from './config';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const notionApi = new NotionAPI();
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!process.env.NOTION_TOKEN) {
  console.warn(
    '[lib/notion] NOTION_TOKEN is not defined. Please set it in environment variables.'
  );
}
if (!DATABASE_ID) {
  console.warn(
    '[lib/notion] NOTION_DATABASE_ID is not defined. Please set it in environment variables.'
  );
}

const assertNotionEnv = () => {
  if (!process.env.NOTION_TOKEN || !DATABASE_ID) {
    throw new Error(
      '缺少 NOTION_TOKEN 或 NOTION_DATABASE_ID 环境变量，无法读取 Notion 数据。'
    );
  }
};

const formatMultiSelect = (items = []) =>
  items.map((item) => ({
    id: item.id,
    name: item.name,
    color: item.color,
  }));

const formatMultiSelectNames = (items = []) =>
  items
    .map((item) => (item?.name || '').trim())
    .filter(Boolean);

const collectSelectOptions = (property = {}) => {
  if (!property || typeof property !== 'object') return [];
  if (Array.isArray(property.multi_select) && property.multi_select.length) {
    return property.multi_select;
  }
  if (property.select) {
    return property.select ? [property.select] : [];
  }
  return [];
};

const extractPlainText = (rich = []) =>
  (Array.isArray(rich) ? rich : [])
    .map((item) => item?.plain_text || '')
    .join('')
    .trim();

const resolveExternalUrl = (property) => {
  if (!property) return '';
  if (property.url) return property.url.trim();
  if (property.rich_text?.length) {
    const block = property.rich_text[0];
    return (block.href || block.plain_text || '').trim();
  }
  return '';
};

export async function getPosts() {
  assertNotionEnv();

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          { property: PROP.type, select: { equals: PROP.type_post } },
          { property: PROP.status, select: { equals: PROP.status_publish } },
        ],
      },
      sorts: [{ property: PROP.date, direction: 'descending' }],
    });

    const posts = response.results.map((page) => {
      const properties = page.properties;
      const title =
        properties[PROP.title]?.title?.[0]?.plain_text || '未命名文章';
      const slugText =
        properties[PROP.slug]?.rich_text?.[0]?.plain_text?.trim() || '';
      const rawId = page.id.replace(/-/g, '');
      const slug = slugText || rawId;
      const date = properties[PROP.date]?.date?.start || null;
      const summary = properties[PROP.summary]?.rich_text || '';

      const categoryOptions = collectSelectOptions(properties[PROP.category]);
      const tagOptions = collectSelectOptions(properties[PROP.tags]);

      // 提取 Notion 页面封面图（page.cover）
      let pageCover = null;
      if (page.cover) {
        if (page.cover.type === 'external' && page.cover.external) {
          pageCover = page.cover.external.url;
        } else if (page.cover.type === 'file' && page.cover.file) {
          pageCover = processNotionImageUrl(page.cover.file.url, page.id);
        }
      }

      return {
        id: page.id,
        rawId,
        slug,
        title,
        date,
        summary,
        categories: formatMultiSelect(categoryOptions),
        categoryNames: formatMultiSelectNames(categoryOptions),
        tags: formatMultiSelect(tagOptions),
        pageCover,
      };
    });

    console.log(
      '[getPosts] posts:',
      posts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        categoryNames: p.categoryNames,
      }))
    );

    return posts;
  } catch (error) {
    console.error('[getPosts] failed:', error?.body || error);
    throw error;
  }
}

// 处理 Notion 图片 URL，转换为可访问的格式
const processNotionImageUrl = (url, blockId = null, spaceId = null) => {
  if (!url) return null;
  
  // 如果已经是完整的外部 URL（非 Notion），直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // 如果是 Notion 的 S3 安全文件（prod-files-secure），需要通过 Notion 代理访问
    if (url.includes('prod-files-secure.s3') || url.includes('s3.amazonaws.com')) {
      // 使用 Notion 图片代理服务
      if (blockId) {
        const encodedUrl = encodeURIComponent(url);
        return `https://www.notion.so/image/${encodedUrl}?id=${blockId}&table=block&cache=v2`;
      }
      // 如果没有 blockId，也尝试使用代理
      const encodedUrl = encodeURIComponent(url);
      return `https://www.notion.so/image/${encodedUrl}?table=block&cache=v2`;
    }
    
    // 如果是外部 URL（如 CDN），直接返回
    if (!url.includes('notion.so') && !url.includes('notion-static.com')) {
      return url;
    }
    
    // Notion 的图片 URL，确保有正确的参数
    if (url.includes('notion.so/image')) {
      try {
        const urlObj = new URL(url);
        // 确保有必要的参数
        if (!urlObj.searchParams.has('table')) {
          urlObj.searchParams.set('table', 'block');
        }
        if (!urlObj.searchParams.has('cache')) {
          urlObj.searchParams.set('cache', 'v2');
        }
        if (blockId && !urlObj.searchParams.has('id')) {
          urlObj.searchParams.set('id', blockId);
        }
        return urlObj.toString();
      } catch (e) {
        return url;
      }
    }
    return url;
  }
  
  // 如果是相对路径，转换为完整 URL
  if (url.startsWith('/image')) {
    const baseUrl = `https://www.notion.so${url}`;
    try {
      const urlObj = new URL(baseUrl);
      if (blockId) {
        urlObj.searchParams.set('id', blockId);
      }
      urlObj.searchParams.set('table', 'block');
      urlObj.searchParams.set('cache', 'v2');
      return urlObj.toString();
    } catch (e) {
      return baseUrl;
    }
  }
  
  // 其他情况，尝试构造 Notion 图片 URL
  if (blockId) {
    const encodedUrl = encodeURIComponent(url);
    return `https://www.notion.so/image/${encodedUrl}?id=${blockId}&table=block&cache=v2`;
  }
  
  return `https://www.notion.so/image/${encodeURIComponent(url)}?table=block&cache=v2`;
};

// 从 recordMap 中提取第一张图片和注释（含 blockId，用于在渲染时隐藏封面图）
// 修复 notion-client 返回的双层 value 嵌套问题
// notion-client 有时返回 block[id] = { value: { value: { id, type, ... } } }
// 而 react-notion-x 期望 block[id] = { value: { id, type, ... } }
const fixRecordMapNesting = (recordMap) => {
  if (!recordMap?.block) return recordMap;
  for (const [blockId, blockData] of Object.entries(recordMap.block)) {
    if (blockData?.value?.value?.id && !blockData?.value?.id) {
      recordMap.block[blockId] = { ...blockData, value: blockData.value.value };
    }
  }
  return recordMap;
};

const extractFirstImageFromRecordMap = (recordMap) => {
  if (!recordMap || !recordMap.block) {
    console.log('[extractFirstImageFromRecordMap] No recordMap or block');
    return { url: null, caption: null, blockId: null };
  }
  
  // 优先使用 signed_urls（这是 Notion 内部图片的标准方式）
  if (recordMap.signed_urls) {
    for (const [blockId, signedUrl] of Object.entries(recordMap.signed_urls)) {
      if (signedUrl && typeof signedUrl === 'string' && signedUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)/i)) {
        // 查找对应的块以获取 caption
        const block = recordMap.block[blockId]?.value;
        let caption = null;
        if (block && block.properties?.caption) {
          caption = extractPlainText(block.properties.caption);
        }
        console.log('[extractFirstImageFromRecordMap] Found image in signed_urls:', blockId, signedUrl.substring(0, 100));
        return { url: signedUrl, caption, blockId };
      }
    }
  }

  // 遍历所有块，查找图片块
  for (const blockId in recordMap.block) {
    const block = recordMap.block[blockId]?.value;
    if (!block) continue;

    // 检查是否是图片块
    if (block.type === 'image') {
      console.log('[extractFirstImageFromRecordMap] Found image block:', blockId, block);

      // 提取 caption
      let caption = null;
      if (block.properties?.caption) {
        caption = extractPlainText(block.properties.caption);
        console.log('[extractFirstImageFromRecordMap] Found caption:', caption);
      }

      // 方法1: 优先使用 signed_urls（最可靠）
      if (recordMap.signed_urls && recordMap.signed_urls[block.id]) {
        const signedUrl = recordMap.signed_urls[block.id];
        console.log('[extractFirstImageFromRecordMap] Using signed_url:', signedUrl.substring(0, 100));
        return { url: signedUrl, caption, blockId };
      }

      // 方法2: 从 format.display_source 获取
      if (block.format?.display_source) {
        const url = processNotionImageUrl(block.format.display_source, block.id);
        console.log('[extractFirstImageFromRecordMap] Using display_source:', url?.substring(0, 100));
        return { url, caption, blockId };
      }

      // 方法3: 从 properties.source 获取
      if (block.properties?.source) {
        const source = Array.isArray(block.properties.source)
          ? block.properties.source[0]?.[0]
          : block.properties.source;
        if (source) {
          const url = processNotionImageUrl(source, block.id);
          console.log('[extractFirstImageFromRecordMap] Using properties.source:', url?.substring(0, 100));
          return { url, caption, blockId };
        }
      }
    }

    // 检查是否是文件块（可能包含图片）
    if (block.type === 'file') {
      // 提取 caption
      let caption = null;
      if (block.properties?.caption) {
        caption = extractPlainText(block.properties.caption);
      }

      // 优先使用 signed_urls
      if (recordMap.signed_urls && recordMap.signed_urls[block.id]) {
        const signedUrl = recordMap.signed_urls[block.id];
        console.log('[extractFirstImageFromRecordMap] Using file signed_url:', signedUrl.substring(0, 100));
        return { url: signedUrl, caption, blockId };
      }

      if (block.format?.display_source) {
        const url = processNotionImageUrl(block.format.display_source, block.id);
        console.log('[extractFirstImageFromRecordMap] Using file display_source:', url?.substring(0, 100));
        return { url, caption, blockId };
      }

      if (block.properties?.source) {
        const source = Array.isArray(block.properties.source)
          ? block.properties.source[0]?.[0]
          : block.properties.source;
        if (source) {
          const url = processNotionImageUrl(source, block.id);
          console.log('[extractFirstImageFromRecordMap] Using file properties.source:', url?.substring(0, 100));
          return { url, caption, blockId };
        }
      }
    }
  }

  console.log('[extractFirstImageFromRecordMap] No image found');
  return { url: null, caption: null, blockId: null };
};

// 批量获取文章封面图：优先使用页面封面，否则从内容中提取第一张图片
export async function getPostCovers(posts) {
  const covers = await Promise.all(
    posts.map(async (post) => {
      // 优先使用 Notion 页面封面
      if (post.pageCover) {
        return { id: post.id, cover: post.pageCover };
      }
      // 否则从文章内容中提取第一张图片
      try {
        const recordMap = fixRecordMapNesting(await notionApi.getPage(post.id));
        const imageData = extractFirstImageFromRecordMap(recordMap);
        return { id: post.id, cover: imageData?.url || null };
      } catch (err) {
        console.warn(`[getPostCovers] Failed for ${post.id}:`, err.message);
        return { id: post.id, cover: null };
      }
    })
  );
  const coverMap = {};
  covers.forEach(({ id, cover }) => {
    coverMap[id] = cover;
  });
  return coverMap;
}

export async function getNotices(limit = 4) {
  assertNotionEnv();

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          { property: PROP.type, select: { equals: PROP.type_notice } },
          { property: PROP.status, select: { equals: PROP.status_publish } },
        ],
      },
      sorts: [{ property: PROP.date, direction: 'descending' }],
      page_size: limit,
    });

    // 并行获取每个页面的完整内容以提取图片
    const notices = await Promise.all(
      response.results.map(async (page) => {
        const props = page.properties;
        
        // 首先检查页面图标或封面图片
        let imageUrl = null;
        if (page.icon) {
          if (page.icon.type === 'emoji') {
            // Emoji 图标，不处理
            imageUrl = null;
          } else if (page.icon.type === 'external' && page.icon.external) {
            const iconUrl = page.icon.external.url;
            // 跳过 Notion 内置 SVG 图标（如播放按钮等），它们不是真正的内容图片
            if (iconUrl && !iconUrl.includes('notion.so/icons/')) {
              imageUrl = iconUrl;
            }
          } else if (page.icon.type === 'file' && page.icon.file) {
            // Notion 文件类型的图片需要特殊处理
            const fileUrl = page.icon.file.url;
            if (fileUrl && fileUrl.includes('notion.so')) {
              imageUrl = processNotionImageUrl(fileUrl, page.id);
            } else {
              imageUrl = fileUrl;
            }
          }
        }
        if (!imageUrl && page.cover) {
          if (page.cover.type === 'external' && page.cover.external) {
            imageUrl = page.cover.external.url;
          } else if (page.cover.type === 'file' && page.cover.file) {
            // Notion 文件类型的封面需要特殊处理
            const fileUrl = page.cover.file.url;
            if (fileUrl && fileUrl.includes('notion.so')) {
              imageUrl = processNotionImageUrl(fileUrl, page.id);
            } else {
              imageUrl = fileUrl;
            }
          }
        }
        
        // 如果没有找到 icon 或 cover，尝试从页面内容中提取图片
        let imageCaption = null;
        if (!imageUrl) {
          try {
            const recordMap = await notionApi.getPage(page.id);
            const imageData = extractFirstImageFromRecordMap(recordMap);
            if (imageData && imageData.url) {
              imageUrl = imageData.url;
              imageCaption = imageData.caption;
              console.log(`[getNotices] Found image in content for ${page.id}:`, imageUrl.substring(0, 100), 'caption:', imageCaption);
            } else {
              console.log(`[getNotices] No image found in content for ${page.id}`);
            }
          } catch (err) {
            console.warn(`[getNotices] Failed to get page content for ${page.id}:`, err.message);
          }
        } else {
          console.log(`[getNotices] Found image from icon/cover for ${page.id}:`, imageUrl.substring(0, 100));
        }
        
        return {
          id: page.id,
          title:
            props[PROP.title]?.title?.[0]?.plain_text || '未命名 Notice',
          summary: extractPlainText(props[PROP.summary]?.rich_text),
          date: props[PROP.date]?.date?.start || null,
          image: imageUrl,
          imageCaption: imageCaption,
        };
      })
    );

    console.log(
      '[getNotices] notices:',
      notices.map((n) => ({ id: n.id, title: n.title, hasImage: !!n.image }))
    );

    return notices;
  } catch (error) {
    console.error('[getNotices] failed:', error?.body || error);
    return [];
  }
}

export async function getSubMenus(limit = 3) {
  assertNotionEnv();

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          { property: PROP.type, select: { equals: PROP.type_sub_menu } },
          { property: PROP.status, select: { equals: PROP.status_publish } },
        ],
      },
      sorts: [{ property: PROP.date, direction: 'ascending' }],
      page_size: limit,
    });

    const subMenus = response.results
      .map((page) => {
        const props = page.properties;
        const url =
          resolveExternalUrl(props[PROP.ext]) ||
          resolveExternalUrl(props[PROP.slug]) ||
          '';
        return {
          id: page.id,
          title:
            props[PROP.title]?.title?.[0]?.plain_text || '未命名链接',
          summary: extractPlainText(props[PROP.summary]?.rich_text),
          url,
        };
      })
      .filter((item) => !!item.url);

    console.log(
      '[getSubMenus] subMenus:',
      subMenus.map((m) => ({ id: m.id, title: m.title, url: m.url }))
    );

    return subMenus;
  } catch (error) {
    console.error('[getSubMenus] failed:', error?.body || error);
    return [];
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
    posts.map((p) => p.slug)
  );

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    console.warn('[getPostBySlug] NOT FOUND for slug:', slug);
    return null;
  }

  try {
    const recordMap = fixRecordMapNesting(await notionApi.getPage(post.id));

    // 提取封面图：优先使用页面封面，否则从内容中提取第一张图片
    let imageUrl = post.pageCover || null;
    let coverBlockId = null;

    const imageData = extractFirstImageFromRecordMap(recordMap);
    if (!imageUrl && imageData?.url) {
      imageUrl = imageData.url;
    }
    // 无论封面来源，都记录第一张图片的 blockId，用于在内容中隐藏
    if (imageData?.blockId) {
      coverBlockId = imageData.blockId;
    }

    return {
      meta: {
        id: post.id,
        title: post.title,
        date: post.date,
        summary: post.summary,
        categories: post.categories,
        categoryNames: post.categoryNames,
        tags: post.tags,
        image: imageUrl,
        coverBlockId,
        slug: post.slug,
      },
      recordMap,
    };
  } catch (error) {
    console.error(
      '[getPostBySlug] notionApi.getPage failed:',
      error?.body || error
    );
    throw error;
  }
}
