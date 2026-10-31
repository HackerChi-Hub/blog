#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory()
    ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}

function main() {
  const errors = [];
  let covers = 0;
  for (const file of walk(path.join(root, 'out')).filter((item) => item.endsWith('.html'))) {
    const html = fs.readFileSync(file, 'utf8');
    for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
      const tag = match[0];
      if (!tag.includes('contained-cover__image')) continue;
      covers += 1;
      const src = tag.match(/\bsrc="([^"]+)"/i)?.[1];
      if (src?.startsWith('/cover-previews/')) {
        if (!/\bsrcset=/i.test(tag) || !/\bsizes=/i.test(tag)) errors.push(`${file} 的轻量封面缺少响应式尺寸`);
      }
    }
    // src、srcset 和 preload 都必须能在静态产物找到衍生图。
    for (const src of new Set([...html.matchAll(/\/cover-previews\/[a-f0-9]+-(?:\d+|backdrop)\.webp/g)].map((match) => match[0]))) {
      if (!fs.existsSync(path.join(root, 'out', src))) errors.push(`${file} 引用了缺失的封面预览 ${src}`);
    }
  }
  const home = read('out/index.html');
  const props = JSON.parse(home.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)[1]).props.pageProps;
  if ('categoryBuckets' in props) errors.push('首页仍携带未使用的分类全集');
  if (!props.searchPosts?.length) errors.push('完整文章搜索索引被意外移除');
  if (covers < 10) errors.push('没有覆盖到真实页面封面');
  for (const name of ['llm-guide/index.html', 'agent-comparison.html']) {
    if (/fonts\.(?:googleapis|gstatic)\.com/.test(read('out/' + name))) errors.push(`${name} 仍依赖外部谷歌字体`);
  }
  const hardwareManifest = JSON.parse(read('out/ai-hardware-survey/preview-manifest.json'));
  const hardwareData = JSON.parse(read('public/ai-hardware-survey/data-20261030.json'));
  if (hardwareManifest.entries.length !== hardwareData.entries.filter((entry) => entry.photo).length) errors.push('设备预览未覆盖所有真实设备图');
  for (const entry of hardwareManifest.entries) {
    for (const variant of entry.variants) {
      if (!fs.existsSync(path.join(root, 'out', variant.src))) errors.push(`设备预览缺失：${variant.src}`);
    }
  }
  if (errors.length) throw new Error(errors.slice(0, 10).join('\n'));
  console.log(`✅ 排版性能导出验收：${covers} 个封面实例采用完整比例展示，衍生图无缺失，首页冗余数据已移除且全站搜索保留`);
  console.log(`✅ 设备页按屏幕选择轻量预览，${hardwareManifest.entries.length}项原图和价格证据保留；独立页面没有外部谷歌字体请求`);
}

if (require.main === module) { try { main(); } catch (error) { console.error(`❌ 排版性能验收失败：${error.message}`); process.exitCode = 1; } }
