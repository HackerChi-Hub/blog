#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const matter = require('gray-matter');
const sharp = require('sharp');
const { AI_LAB_TOOLS } = require('../lib/home-content.cjs');

async function ensurePreview(destination, width, render) {
  if (fs.existsSync(destination)) {
    try {
      const meta = await sharp(destination).metadata();
      if (meta.format === 'webp' && meta.width === width) return;
    } catch { /* 上一次中断留下的坏文件不能当作有效缓存。 */ }
  }
  const temporary = path.join(path.dirname(destination), `.tmp-${crypto.randomUUID()}.webp`);
  try { await render(temporary); fs.renameSync(temporary, destination); }
  finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
}

function localSource(source) {
  if (typeof source !== 'string') return '';
  const local = source.replace(/^https:\/\/(?:www\.)?hyphentech\.top(?=\/)/i, '').split(/[?#]/)[0];
  return /^\/(?:obsidian-assets|images|png)\//.test(local) ? local : '';
}

async function makePreview(input, url, outputDirectory) {
  const bytes = fs.readFileSync(input);
  const key = crypto.createHash('sha256').update('cover-preview-v1').update(bytes).digest('hex').slice(0, 24);
  const metadata = await sharp(bytes, { animated: false }).metadata();
  const swapAxes = metadata.orientation >= 5 && metadata.orientation <= 8;
  const width = metadata.autoOrient?.width || (swapAxes ? metadata.height : metadata.width);
  const height = metadata.autoOrient?.height || (swapAxes ? metadata.width : metadata.pageHeight || metadata.height);
  if (!width || !height) throw new Error(`封面尺寸不可读：${url}`);
  const widths = [...new Set([480, 960, 1600].map((value) => Math.min(value, width)))];
  const variants = [];
  for (const target of widths) {
    const name = `${key}-${target}.webp`;
    const destination = path.join(outputDirectory, name);
    await ensurePreview(destination, target, (temporary) => sharp(bytes, { animated: false }).rotate().resize({ width: target, withoutEnlargement: true }).webp({ quality: 80, effort: 4 }).toFile(temporary));
    variants.push({ width: target, src: `/cover-previews/${name}` });
  }
  const backdrop = `${key}-backdrop.webp`;
  await ensurePreview(path.join(outputDirectory, backdrop), Math.min(80, width), (temporary) =>
    sharp(bytes, { animated: false }).rotate().resize({ width: Math.min(80, width), withoutEnlargement: true })
      .blur(3).modulate({ brightness: .8, saturation: .85 }).webp({ quality: 35 }).toFile(temporary));
  return { width, height, variants, backdrop: `/cover-previews/${backdrop}` };
}

async function buildCoverPreviews({ root = path.resolve(__dirname, '..'), sources } = {}) {
  const publicRoot = path.join(root, 'public');
  const output = path.join(publicRoot, 'cover-previews');
  fs.mkdirSync(output, { recursive: true });
  const selected = new Set(sources || AI_LAB_TOOLS.map((tool) => tool.image).filter(Boolean));
  if (!sources) {
    const posts = path.join(root, 'content-export/posts');
    for (const name of fs.readdirSync(posts)) {
      if (!name.endsWith('.md')) continue;
      const { data } = matter(fs.readFileSync(path.join(posts, name), 'utf8'));
      if (data.status && data.status !== 'published') continue;
      for (const value of [data.cover, data.image, data.thumbnail]) {
        const source = localSource(typeof value === 'object' ? value?.url || value?.src : value);
        if (source) selected.add(source);
      }
    }
  }
  const manifest = {};
  const publicReal = fs.realpathSync(publicRoot);
  for (const candidate of [...selected].sort()) {
    const source = localSource(candidate);
    if (!source) continue;
    const input = path.resolve(publicRoot, `.${decodeURIComponent(source)}`);
    if (!fs.existsSync(input)) throw new Error(`封面文件缺失：${source}`);
    const real = fs.realpathSync(input);
    if (!real.startsWith(`${publicReal}${path.sep}`)) throw new Error(`封面路径越界：${source}`);
    manifest[source] = await makePreview(input, source, output);
  }
  const manifestPath = path.join(root, 'lib/cover-variants.generated.json');
  const serialized = `${JSON.stringify(manifest)}\n`;
  if (!fs.existsSync(manifestPath) || fs.readFileSync(manifestPath, 'utf8') !== serialized) {
    const temporary = `${manifestPath}.${crypto.randomUUID()}.tmp`;
    try { fs.writeFileSync(temporary, serialized, { flag: 'wx' }); fs.renameSync(temporary, manifestPath); }
    finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
  }
  const used = new Set(Object.values(manifest).flatMap((item) => [...item.variants.map((variant) => path.basename(variant.src)), path.basename(item.backdrop)]));
  // 只清理此生成器拥有的衍生文件；不触碰封面正本、文章素材或其他命名的文件。
  for (const name of fs.readdirSync(output)) {
    if (/^[a-f0-9]{24}-(?:\d+|backdrop)\.webp$/.test(name) && !used.has(name)) fs.unlinkSync(path.join(output, name));
  }
  return manifest;
}

if (require.main === module) buildCoverPreviews().then((manifest) => {
  console.log(`✅ 已生成 ${Object.keys(manifest).length} 张封面的响应式 WebP 与微型柔化背景；原件未改，正文动图保留`);
}).catch((error) => { console.error(`❌ 封面预览构建失败：${error.message}`); process.exitCode = 1; });

module.exports = { localSource, makePreview, buildCoverPreviews };
