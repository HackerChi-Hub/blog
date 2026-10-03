#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const root = process.cwd();
const outDir = path.join(root, 'out');
const sitemapPath = path.join(outDir, 'sitemap.xml');

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--content-dir') args.contentDir = argv[++index];
    else throw new Error(`未知参数：${argv[index]}`);
  }
  return args;
}

function walkMarkdownFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkMarkdownFiles(absolutePath));
    else if (entry.isFile() && /\.md$/i.test(entry.name)) files.push(absolutePath);
  }
  return files.sort();
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.map(String);
  return value ? String(value).split(',') : [];
}

function loadExpectedPosts(contentDir) {
  const contentManifestPath = path.join(contentDir, 'publish-manifest.json');
  if (fs.existsSync(contentManifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(contentManifestPath, 'utf8'));
    const posts = Array.isArray(manifest.posts) ? manifest.posts : [];
    if (manifest.published_post_count !== posts.length) {
      throw new Error(
        `Obsidian 快照数量不一致：manifest=${manifest.published_post_count}，posts=${posts.length}`
      );
    }
    return posts;
  }

  return walkMarkdownFiles(path.join(contentDir, 'posts'))
    .map((filePath) => ({ filePath, data: matter(fs.readFileSync(filePath, 'utf8')).data }))
    .filter(({ data }) => String(data.status || 'draft').toLowerCase() === 'published')
    .map(({ filePath, data }) => ({
      file: path.relative(contentDir, filePath),
      slug: String(data.slug || ''),
      legacy_paths: normalizeList(data.legacy_paths).map((item) => item.trim()).filter(Boolean),
      ...(data.translation_of ? { translation_of: String(data.translation_of) } : {}),
      ...(data.lang ? { lang: String(data.lang) } : {}),
    }));
}

// 译文页的界面文字（分类、标签、分享、相关文章、阅读时长、提示框标题、文末签名）要跟文章语言走。
// 探针只挑只会出现在界面位置、不会出现在正常译文正文里的简体短语；相关文章区和脚本数据
// （里面本来就是中文原文的标题、摘要）先剥掉再查。
const CHROME_PROBES = {
  en: ['分类：', '标签：', '返回首页', '分享到：', '复制链接', '相关文章', '状态：', '下载与更新', '分钟', '信息：', '提示：', '正在加载留言'],
  'zh-TW': ['分类：', '标签：', '返回首页', '复制链接', '相关文章', '状态：', '下载与更新', '分钟', '信息：', '正在加载留言'],
};

function chromeText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<section[^>]*class="related-posts"[\s\S]*?<\/section>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    // 正文代码不是界面文字。机翻按设计不翻代码：文章里给读者复制去喂 AI 的中文提示词、
    // 真实的命令输出，翻了反而失真。不剔掉的话，代码块里的「分钟」「信息：」「状态：」
    // 会被当成界面没本地化——61 篇机翻首次发布时 5 篇就这样被误拦。
    // 先剔 <pre> 再剔行内 <code>（代码块是 <pre><code>）。界面本身不用这两个标签，
    // 所以真正的界面漏翻照样抓得到。
    .replace(/<pre\b[\s\S]*?<\/pre>/gi, ' ')
    .replace(/<code\b[\s\S]*?<\/code>/gi, ' ');
}

const args = parseArgs(process.argv.slice(2));
const contentDir = path.resolve(args.contentDir || process.env.BLOG_CONTENT_DIR || './content-export');

if (!fs.existsSync(sitemapPath)) {
  console.error('❌ 导出验收失败：缺少 out/sitemap.xml');
  process.exit(1);
}

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (urls.length < 2) {
  console.error(`❌ 导出验收失败：sitemap 只有 ${urls.length} 条 URL`);
  process.exit(1);
}

const failures = [];
for (const rawUrl of urls) {
  const url = new URL(rawUrl);
  const route = decodeURIComponent(url.pathname).replace(/^\/+|\/+$/g, '');
  const htmlPath = route
    ? path.join(outDir, route, 'index.html')
    : path.join(outDir, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    failures.push(`缺少 ${url.pathname} -> ${path.relative(root, htmlPath)}`);
    continue;
  }
  const html = fs.readFileSync(htmlPath, 'utf8');
    if (/Content rendering failed|无法加载文章内容|Response code 403/.test(html)) {
    failures.push(`错误占位内容 ${url.pathname}`);
  }
}

if (failures.length) {
  console.error('❌ 导出验收失败：');
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}

console.log(`✅ 导出验收：sitemap 中 ${urls.length} 个页面均存在且没有错误占位内容`);

try {
  const posts = loadExpectedPosts(contentDir);
  if (posts.length === 0) throw new Error(`内容目录没有已发布文章：${contentDir}`);

  const obsidianFailures = [];
  for (const post of posts) {
    const slug = String(post.slug || '').replace(/^\/+|\/+$/g, '');
    const htmlPath = path.join(outDir, slug, 'index.html');
    if (!slug || !fs.existsSync(htmlPath)) {
      obsidianFailures.push(`缺少 Obsidian 文章页：${slug || post.file}`);
      continue;
    }
    const html = fs.readFileSync(htmlPath, 'utf8');
    if (!html.includes('markdown-content')) {
      obsidianFailures.push(`文章没有使用 Markdown 渲染器：${slug}`);
    }
    if (/(?:expirationTimestamp=|X-Amz-Signature=)/i.test(html)) {
      obsidianFailures.push(`文章仍含临时签名素材地址：${slug}`);
    }
    if (!sitemap.includes(`/${slug}/`)) {
      obsidianFailures.push(`sitemap 缺少文章：${slug}`);
    }
    for (const rawLegacyPath of post.legacy_paths || []) {
      const legacyPath = String(rawLegacyPath || '').replace(/^\/+|\/+$/g, '');
      const legacyHtmlPath = path.join(outDir, legacyPath, 'index.html');
      if (!legacyPath || !fs.existsSync(legacyHtmlPath)) {
        obsidianFailures.push(`缺少历史网址页面：${legacyPath || post.file}`);
      }
    }
  }

  // 译文：页面要有、站点地图要有（上面已查），但不进首页列表；与原文互相链接（语言切换）。
  const homeHtmlPath = path.join(outDir, 'index.html');
  const homeHtml = fs.existsSync(homeHtmlPath) ? fs.readFileSync(homeHtmlPath, 'utf8') : '';
  const trim = (value) => String(value || '').replace(/^\/+|\/+$/g, '');
  for (const post of posts.filter((item) => item.translation_of)) {
    const slug = trim(post.slug);
    const original = trim(post.translation_of);
    if (homeHtml.includes(`href="/${slug}/"`)) {
      obsidianFailures.push(`译文不应出现在首页列表：${slug}`);
    }
    const translationPath = path.join(outDir, slug, 'index.html');
    const originalPath = path.join(outDir, original, 'index.html');
    if (fs.existsSync(translationPath) && !fs.readFileSync(translationPath, 'utf8').includes(`href="/${original}/"`)) {
      obsidianFailures.push(`译文页缺少回到原文的语言切换：${slug} → ${original}`);
    }
    if (!fs.existsSync(originalPath)) {
      obsidianFailures.push(`译文指向的原文页不存在：${slug} → ${original}`);
    } else if (!fs.readFileSync(originalPath, 'utf8').includes(`href="/${slug}/"`)) {
      obsidianFailures.push(`原文页缺少指向译文的语言切换：${original} → ${slug}`);
    }
  }

  for (const post of posts) {
    const slug = trim(post.slug);
    const lang = post.lang || 'zh-CN';
    const htmlPath = path.join(outDir, slug, 'index.html');
    if (!slug || !fs.existsSync(htmlPath)) continue;
    const html = fs.readFileSync(htmlPath, 'utf8');
    if (!new RegExp(`<html[^>]*\\blang="${lang}"`).test(html)) {
      obsidianFailures.push(`页面语言不是 ${lang}：${slug}（<html lang> 缺失或不符）`);
    }
    const chrome = chromeText(html);
    const leftovers = (CHROME_PROBES[lang] || []).filter((probe) => chrome.includes(probe));
    if (leftovers.length) {
      obsidianFailures.push(`${lang} 页面的界面文字残留简体：${slug} → ${leftovers.join('、')}`);
    }
  }

  // 英文首页与英文分页：语言、界面文字、hreflang 互指、语言开关都要在。
  // 中文首页同样要带 hreflang 和自动跳转脚本——访客第一眼落在中文首页，跳不跳全看它。
  const LIST_PROBES = ['阅读全文', '先看三条主线', '找到全部频道', '频道都在这', '搜索文章', '返回首页', '下一页', '全部文章'];
  const pairs = [['', 'en'], ['page/2', 'en/page/2']];
  for (const [zhRoute, enRoute] of pairs) {
    const zhPath = path.join(outDir, zhRoute, 'index.html');
    const enPath = path.join(outDir, enRoute, 'index.html');
    if (!fs.existsSync(zhPath)) continue; // 只有一页文章时没有 page/2
    if (!fs.existsSync(enPath)) {
      obsidianFailures.push(`缺少英文页：/${enRoute}/`);
      continue;
    }
    const zhPage = fs.readFileSync(zhPath, 'utf8');
    const enPage = fs.readFileSync(enPath, 'utf8');
    if (!/<html[^>]*\blang="en"/.test(enPage)) obsidianFailures.push(`英文页 <html lang> 不是 en：/${enRoute}/`);
    const leftovers = LIST_PROBES.filter((probe) => chromeText(enPage).includes(probe));
    if (leftovers.length) obsidianFailures.push(`英文页界面文字残留简体：/${enRoute}/ → ${leftovers.join('、')}`);
    for (const [route, html] of [[zhRoute, zhPage], [enRoute, enPage]]) {
      const zhHref = `/${zhRoute ? `${zhRoute}/` : ''}`;
      if (!new RegExp(`hrefLang="zh-CN" href="[^"]*${zhHref}"`, 'i').test(html)
        || !new RegExp(`hrefLang="en" href="[^"]*/${enRoute}/"`, 'i').test(html)) {
        obsidianFailures.push(`页面缺少中英 hreflang 互指：/${route}${route ? '/' : ''}`);
      }
      if (!html.includes('hyphentech:lang')) obsidianFailures.push(`页面缺少语言偏好脚本：/${route}${route ? '/' : ''}`);
      if (!html.includes('class="lang-toggle"')) obsidianFailures.push(`页面缺少语言开关：/${route}${route ? '/' : ''}`);
    }
  }

  if (obsidianFailures.length) {
    console.error('❌ Obsidian 导出验收失败：');
    obsidianFailures.forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
  }

  const legacyCount = posts.reduce(
    (sum, post) => sum + (Array.isArray(post.legacy_paths) ? post.legacy_paths.length : 0),
    0
  );
  console.log(
    `✅ Obsidian 导出验收：${posts.length} 篇文章由 Markdown 渲染，` +
      `${legacyCount} 条历史网址全部存在`
  );
} catch (error) {
  console.error(`❌ Obsidian 导出验收失败：${error.message}`);
  process.exit(1);
}
