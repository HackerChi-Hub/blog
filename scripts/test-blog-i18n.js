#!/usr/bin/env node

// 文章页界面文字与文末签名的多语言闸。
//
// 1. 代码里每个 t('简体原文') 在 zh-TW / en 词典里都有译文，占位符一致；
// 2. 英文译文里没有汉字；词典里没有已经没人用的死词条；
// 3. 文末签名按 lang 渲染：英文签名没有汉字（替换锚点注释除外），缺译文时报错而不是印出简体。

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const {
  CALLOUT_LABELS,
  COMMENT_SERVER_ERRORS,
  TRANSLATIONS,
  makeT,
} = require('../lib/blog-i18n.cjs');
const { renderFooter, postLang, START, END } = require('./sync-article-footer-template.js');

const SOURCES = [
  'pages/[slug].js',
  'pages/_document.js',
  'pages/_app.js',
  'components/ShareButtons.js',
  'components/RelatedPosts.js',
  'components/Comments.js',
  'components/HomePage.js',
  'components/Search.js',
  'components/PostListPage.js',
  'components/SponsorCard.js',
  'components/SEO.js',
  'lib/markdown.js',
  'lib/reading-time.js',
  'lib/seo.js',
  'lib/utils.js',
];

// 通过变量传进 t() 的键，扫描器看不到字面量，在这里显式登记。
const HOME = require('../lib/home-content.cjs');
// 动态键只登记含汉字的：「macOS / Windows」「WiFi Finder」这类本来就是英文，t() 原样返回，
// 硬塞进词典只会多一堆「X → X」的噪音条目
const hasHan = (text) => /[\u4e00-\u9fff]/.test(String(text));
const { PRODUCT_DEFINITIONS } = require('../lib/product-catalog.cjs');
const { SITE_CONFIG } = require('../lib/seo.js');

const INDIRECT_KEYS = [
  ...Object.values(CALLOUT_LABELS),
  ...COMMENT_SERVER_ERRORS,
  '黑粉科技 · 官网', // SITE_CONFIG.name
  '让AI成为你的超能力', // SITE_CONFIG.slogan
  '黑粉科技', // SITE_CONFIG.author
  SITE_CONFIG.description,
  // 首页经 t(变量) 显示的常量：从同一个模块读，不手抄——手抄的登记表会在改文案时悄悄过期
  ...HOME.CONTENT_PILLARS.map((p) => p.title),
  '真实实测', // getPostPillarLabels 的兜底标签
  ...HOME.MEDIA_CHANNELS.flatMap((c) => [c.name, c.title, c.description, c.action]).filter(hasHan),
  ...[...HOME.AI_LAB_TOOLS, ...HOME.SIDE_TOOLS].flatMap((tool) => [tool.title, tool.desc]).filter(hasHan),
  ...PRODUCT_DEFINITIONS.flatMap((p) => [p.name, p.label, p.badge, ...p.facts]).filter(hasHan),
  '查看产品与下载', // 产品卡按钮（product-catalog 里写死）
];

const CJK = /[\u3400-\u9fff\uf900-\ufaff]/;
const placeholders = (text) => [...String(text).matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();

function literalKeys(source) {
  const keys = new Set();
  for (const match of source.matchAll(/\bt\(\s*(['"])((?:\\.|(?!\1).)*)\1/g)) {
    keys.add(match[2].replace(/\\(['"\\])/g, '$1'));
  }
  return keys;
}

const failures = [];
const used = new Set(INDIRECT_KEYS);
for (const file of SOURCES) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  for (const key of literalKeys(source)) used.add(key);
}

for (const [lang, table] of Object.entries(TRANSLATIONS)) {
  for (const key of used) {
    if (!Object.prototype.hasOwnProperty.call(table, key)) {
      failures.push(`${lang} 缺译文：「${key}」`);
      continue;
    }
    const expected = placeholders(key.split('::')[0]);
    if (JSON.stringify(placeholders(table[key])) !== JSON.stringify(expected)) {
      failures.push(`${lang} 占位符对不上：「${key}」→「${table[key]}」`);
    }
  }
  for (const key of Object.keys(table)) {
    if (!used.has(key)) failures.push(`${lang} 死词条（代码里已经没有这句）：「${key}」`);
  }
}
// 英文译文里唯一允许的中文：读者必须原样输入才能用的专有名。微信公众号/视频号就叫「黑粉科技」，
// 英文读者在微信里搜 HyphenTech 是搜不到的——这里写英文反而是错误的指引。
// 只豁免带英文引号的这个字面量本身；没加引号的（像偷懒没翻的「黑粉科技的软件」）照样拦。
const EN_CJK_LITERALS = ['"黑粉科技"'];
for (const [key, value] of Object.entries(TRANSLATIONS.en)) {
  const rest = EN_CJK_LITERALS.reduce((text, literal) => text.split(literal).join(''), value);
  if (CJK.test(rest)) failures.push(`en 译文里有汉字：「${key}」→「${value}」`);
}

// makeT：简体原样返回并去掉「::场景」后缀；带 # 的原文不被截断。
const zh = makeT('zh-CN');
assert.strictEqual(zh('正在回复 #{id}', { id: 7 }), '正在回复 #7');
assert.strictEqual(zh('留言::label'), '留言');
assert.strictEqual(makeT('en')('留言::label'), 'Comment');
assert.strictEqual(makeT('xx-YY').lang, 'zh-CN', '未知语言退回简体');
assert.strictEqual(makeT('en')('一句词典里没有的话'), '一句词典里没有的话', '运行时查不到退回原文，不崩');

// 文末签名
const identityPath = process.env.HFKJ_IDENTITY_PATH
  || path.resolve(root, '..', 'ContentDistributor', 'scripts', 'hfkj_identity.json');
const identity = JSON.parse(fs.readFileSync(identityPath, 'utf8'));
const visible = (footer) => footer.split('\n').filter((line) => line !== START && line !== END).join('\n');

const footers = {};
for (const lang of ['zh-CN', 'zh-TW', 'en']) {
  try {
    footers[lang] = renderFooter(identity, lang);
  } catch (error) {
    failures.push(`${lang} 签名渲染失败：${error.message}`);
  }
}
if (footers.en && CJK.test(visible(footers.en))) {
  failures.push(`英文签名里有汉字：${visible(footers.en).match(new RegExp(`.*${CJK.source}.*`))[0]}`);
}
if (footers['zh-TW'] && footers['zh-TW'] === footers['zh-CN']) {
  failures.push('繁体签名和简体一模一样，译文没有生效');
}
for (const lang of ['zh-TW', 'en']) {
  if (footers[lang] && (!footers[lang].startsWith(START) || !footers[lang].endsWith(END))) {
    failures.push(`${lang} 签名丢了替换锚点，下次同步会追加第二份签名`);
  }
}

const stale = JSON.parse(JSON.stringify(identity));
stale.products[0].tagline = `${stale.products[0].tagline}（改过）`;
stale.cta_rules.fixed_product_order = [stale.products[0].id];
stale.products[0].public = true;
assert.throws(() => renderFooter(stale, 'en'), /i18n\.en 缺少这句的译文/, '简体改了、译文没跟上时必须报错');
assert.doesNotThrow(() => renderFooter(stale, 'zh-CN'), '简体签名不依赖译文表');
assert.throws(() => renderFooter(identity, 'ja'), /没有对应的签名语言/);

assert.strictEqual(postLang('---\ntitle: x\nlang: en\n---\n正文'), 'en');
assert.strictEqual(postLang("---\nlang: 'zh-TW'\n---\n"), 'zh-TW');
assert.strictEqual(postLang('---\ntitle: x\n---\nlang: en'), 'zh-CN', '正文里的 lang: 不算');
assert.strictEqual(postLang('没有 frontmatter'), 'zh-CN');

if (failures.length) {
  console.error('❌ 多语言闸没过：');
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}
console.log(`✅ 多语言闸：${used.size} 条界面文字在 zh-TW / en 都有译文，文末签名三种语言渲染正常`);
