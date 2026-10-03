#!/usr/bin/env node
'use strict';

/**
 * 对所有机翻产物做一次全量审计。和 test-translate-posts.js 分工不同：
 * 那边测函数（不调 API），这边查产物——翻出来的文件到底对不对。
 *
 * 只审计 `translation_source: machine` 的文件；人工译文另外核对「是否被改动过」。
 *
 *   node scripts/audit-translations.js
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const CONTENT_DIR = process.env.BLOG_CONTENT_DIR || path.resolve(__dirname, '..', '..', 'blog-content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');
const FS = 'HFKJ_FIXED_FOOTER_START';
const FE = 'HFKJ_FIXED_FOOTER_END';

const IMG = /!\[([^\]\n]*)\]\(([^)\n]*)\)/g;
// 只认「域名后紧贴第二个协议头」——宽松写法会把合法的 [**https://x**](https://x/) 误报
const DUP_DOMAIN = /https?:\/\/[a-z0-9.-]+https?:\/\//i;
// 汉字之外也查全角标点：降级切段时落单的「，」「。」不含汉字，只查汉字会漏掉，
// 读者却看得见。
const CJK = /[一-鿿，。：；！？、（）]/;

const stripCode = (t) => t.replace(/^```[\s\S]*?^```/gm, '');
// 行内代码里的中文按设计就不翻（常是文章在讨论的原话，如模型吐出的
// `// 由于代码量很大…`，译了就失去意义）。只在「残留中文」这一项剔除，
// 不影响图片/链接计数——否则 alt 里偶有的反引号会让计数对不上。
const stripInlineCode = (t) => t.replace(/`[^`\n]+`/g, '');
const stripFooter = (t) => t.replace(new RegExp(`<!-- ${FS}[\\s\\S]*?<!-- ${FE} -->`), '');
const fences = (t) => t.match(/^```[\s\S]*?^```/gm) || [];
const images = (t) => [...stripCode(t).matchAll(IMG)].map((m) => ({ alt: m[1], url: m[2] }));
const assetName = (u) => u.replace(/^.*?(?:preview-assets|obsidian-assets)\//, '');
const fm = (t, key) => (t.match(new RegExp(`^${key}:\\s*(.*)$`, 'm')) || [])[1]?.trim() ?? '';

function auditOne(slug, zh, en) {
  const body = en.split('---').slice(2).join('---');
  const zi = images(zh);
  const ei = images(en);
  const zf = fences(zh);
  const ef = fences(en);
  return [
    ['代码块逐字节一致', zf.length === ef.length && zf.every((b, i) => b === ef[i])],
    [`图片数 ${zi.length}→${ei.length}`, zi.length === ei.length],
    ['图片地址逐一对应', zi.every((img, i) => ei[i] && assetName(img.url) === assetName(ei[i].url))],
    ['图片 alt 无中文', !ei.some((img) => CJK.test(img.alt))],
    ['无重复拼接的域名', !DUP_DOMAIN.test(en)],
    ['无残留相对路径', !en.includes('preview-assets')],
    ['正文零残留中文（行内代码除外）', !CJK.test(stripInlineCode(stripFooter(stripCode(body))))],
    ['签名为英文版', /Tools I build/.test(body) || !zh.includes(FS)],
    ['顶部机翻声明', body.slice(0, 800).includes('machine-translated')],
    ['translation_of 指向原文', fm(en, 'translation_of') === slug],
  ];
}

function main() {
  const files = fs.readdirSync(POSTS_DIR).filter((n) => n.endsWith('-en.md'));
  let machine = 0;
  let failed = 0;
  const human = [];

  for (const name of files) {
    const en = fs.readFileSync(path.join(POSTS_DIR, name), 'utf8');
    const slug = fm(en, 'translation_of');
    if (fm(en, 'translation_source') !== 'machine') {
      human.push(name);
      continue;
    }
    machine += 1;
    const zhPath = path.join(POSTS_DIR, `${slug}.md`);
    if (!fs.existsSync(zhPath)) {
      failed += 1;
      console.log(`✗ ${name}：原文 ${slug}.md 不存在`);
      continue;
    }
    const results = auditOne(slug, fs.readFileSync(zhPath, 'utf8'), en);
    const bad = results.filter(([, ok]) => !ok);
    if (bad.length) {
      failed += 1;
      console.log(`✗ ${slug}：${bad.map(([k]) => k).join('、')}`);
    }
  }

  // 人工译文必须与 git 里的版本一致——脚本永远不该碰它们
  let humanTouched = 0;
  for (const name of human) {
    try {
      execFileSync('git', ['-C', CONTENT_DIR, 'diff', '--quiet', '--', `posts/${name}`]);
    } catch {
      humanTouched += 1;
      console.log(`✗ 人工译文被改动：${name}`);
    }
  }

  console.log(`\n机翻 ${machine} 篇：${machine - failed} 通过，${failed} 未通过`);
  console.log(`人工译文 ${human.length} 篇：${human.length - humanTouched} 未被改动`);
  process.exit(failed || humanTouched ? 1 : 0);
}

main();
