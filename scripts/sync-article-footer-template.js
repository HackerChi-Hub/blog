#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const START = '<!-- HFKJ_FIXED_FOOTER_START：由脚本生成，请勿手改 -->';
const END = '<!-- HFKJ_FIXED_FOOTER_END -->';
const defaultIdentity = path.resolve(
  __dirname,
  '..',
  '..',
  'ContentDistributor',
  'scripts',
  'hfkj_identity.json',
);
const defaultContentDir = path.resolve(__dirname, '..', '..', 'blog-content');

function parseArgs(argv) {
  const args = {
    identity: process.env.HFKJ_IDENTITY_PATH || defaultIdentity,
    contentDir: process.env.BLOG_CONTENT_DIR || defaultContentDir,
  };
  for (let index = 0; index < argv.length; index += 2) {
    const option = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`${option} 缺少值`);
    if (option === '--identity') args.identity = value;
    else if (option === '--content-dir') args.contentDir = value;
    else throw new Error(`未知参数：${option}`);
  }
  return args;
}

function publicProducts(identity) {
  const byId = new Map((identity.products || []).map((product) => [String(product.id || ''), product]));
  const order = identity.cta_rules?.fixed_product_order || [...byId.keys()];
  return order
    .map((id) => byId.get(String(id)))
    .filter((product) => product && product.public !== false);
}

function renderFooter(identity) {
  const channel = identity.channel || {};
  const footer = identity.article_footer || {};
  const products = publicProducts(identity);
  if (!products.length) throw new Error('统一身份名录中没有可公开展示的自制软件');
  const lines = [
    START,
    '',
    '---',
    '',
    `## 🧰 ${footer.products_title || '我做的工具'}`,
    '',
    footer.products_intro || '这些工具都由我持续维护。',
    '',
  ];
  for (const product of products) {
    if (!product.name || !product.url) throw new Error(`公开产品缺少名称或下载入口：${product.id || '未知'}`);
    lines.push(
      `> [!info] ${product.name}`,
      `> **状态：** ${product.status_label || '持续迭代'}`,
      '>',
      `> ${product.tagline || ''}`,
      '>',
      `> [下载与更新](${product.url})`,
      '',
    );
  }
  lines.push(
    '---',
    '',
    `> [!quote] ${channel.name || '黑粉科技'}`,
    `> **${channel.slogan || '让AI成为你的超能力'}**`,
    `> ${footer.brand_focus || '本地部署 · 免费白嫖 · 自制软件'}`,
    `> ${channel.site || 'https://hyphentech.top'}`,
    '',
    END,
  );
  return lines.join('\n');
}

function replaceGeneratedFooter(source, replacement) {
  if (!source.includes(START) || !source.includes(END)) return source;
  const pattern = new RegExp(`${START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
  return source.replace(pattern, replacement);
}

function stripLegacyFooter(source, productNames) {
  let next = String(source || '');

  // 旧管道曾把“关于我 + 产品列表”装进代码块；只删除命中固定签名的那个代码块。
  next = next.replace(/```[^\n]*\n[\s\S]*?```/g, (block) => {
    const hits = productNames.filter((name) => block.includes(name)).length;
    return block.includes('我自己做的东西') || (/\$\s*关于我/.test(block) && hits >= 1) ? '' : block;
  });

  // 删除旧 callout 形态的产品清单或纯频道签名；文章专属的实测声明不会命中。
  const lines = next.split(/\r?\n/);
  const kept = [];
  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    if (/^>\s*\[!/.test(line)) {
      const block = [];
      while (index < lines.length && /^>/.test(lines[index])) {
        block.push(lines[index]);
        index += 1;
      }
      const text = block.join('\n');
      const hits = productNames.filter((name) => text.includes(name)).length;
      const legacyProducts = /我目前的\s*\d+\s*款自制软件/.test(text) || hits >= 2;
      const legacySignature = (
        text.includes('所有方案都先在自己的 M5 Pro 上跑通才写')
        || (/\[!quote\]\s*黑粉科技/.test(text) && text.includes('hyphentech.top'))
      );
      if (!legacyProducts && !legacySignature) kept.push(...block);
      continue;
    }
    if (/^##\s+.*我还做了\s*\d+\s*款/.test(line)) {
      index += 1;
      while (index < lines.length && !/^##\s|^>\s*\[!|^---\s*$/.test(lines[index])) index += 1;
      continue;
    }
    kept.push(line);
    index += 1;
  }
  next = kept.join('\n');
  next = next.replace(/(?:\n[ \t]*){3,}/g, '\n\n').trimEnd();
  next = next.replace(/(?:\n---\s*)+$/, '').trimEnd();
  return next;
}

function syncPublishedPosts(contentDir, replacement, productNames) {
  const postsDir = path.resolve(contentDir, 'posts');
  if (!fs.existsSync(postsDir)) return 0;
  let changed = 0;
  for (const name of fs.readdirSync(postsDir)) {
    if (!/\.md(?:own)?$/i.test(name) || /\.(?:bak|backup)\.md(?:own)?$/i.test(name)) continue;
    const postPath = path.join(postsDir, name);
    if (!fs.statSync(postPath).isFile()) continue;
    const source = fs.readFileSync(postPath, 'utf8');
    if (!/^status:\s*published\s*$/m.test(source)) continue;
    const next = source.includes(START) && source.includes(END)
      ? replaceGeneratedFooter(source, replacement)
      : `${stripLegacyFooter(source, productNames)}\n\n${replacement}\n`;
    if (next !== source) {
      fs.writeFileSync(postPath, next, 'utf8');
      changed += 1;
    }
  }
  return changed;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const identity = JSON.parse(fs.readFileSync(path.resolve(args.identity), 'utf8'));
  const templatePath = path.resolve(args.contentDir, 'templates', '博客文章.md');
  const source = fs.readFileSync(templatePath, 'utf8');
  const replacement = renderFooter(identity);
  let next;
  if (source.includes(START) && source.includes(END)) {
    next = replaceGeneratedFooter(source, replacement);
  } else {
    next = `${source.trimEnd()}\n\n${replacement}\n`;
  }
  if (next !== source) {
    fs.writeFileSync(templatePath, next, 'utf8');
    console.log(`✅ 已从统一身份名录更新 Obsidian 文章尾部模板：${templatePath}`);
  } else {
    console.log('✅ Obsidian 文章尾部模板已是最新');
  }
  const productNames = publicProducts(identity).map((product) => String(product.name || '')).filter(Boolean);
  const changedPosts = syncPublishedPosts(args.contentDir, replacement, productNames);
  console.log(`✅ 已刷新 ${changedPosts} 篇已发布 Obsidian 文章的固定尾部`);
}

try {
  main();
} catch (error) {
  console.error(`❌ 同步文章尾部模板失败：${error.message}`);
  process.exit(1);
}
