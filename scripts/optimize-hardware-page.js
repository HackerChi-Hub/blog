#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const escape = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function sourcePath(publicRoot, url) {
  if (typeof url !== 'string' || !/^\/ai-hardware-survey\/assets\/[^/?#]+\.(png|jpe?g|webp)$/i.test(url)) throw new Error('设备原图必须来自已登记的本站素材目录');
  const candidate = path.resolve(publicRoot, '.' + decodeURIComponent(url));
  const allowed = fs.realpathSync(path.join(publicRoot, 'ai-hardware-survey/assets')) + path.sep;
  const real = fs.realpathSync(candidate);
  if (!real.startsWith(allowed)) throw new Error('设备原图路径越界');
  return real;
}

function cropRegion(crop, metadata) {
  if (crop == null) return null;
  if (!Array.isArray(crop) || crop.length !== 4 || crop.some((n) => !Number.isFinite(n))) throw new Error('设备展示区域无效');
  const [x, y, width, height] = crop;
  if (x < 0 || y < 0 || width <= 0 || height <= 0 || x + width > 1 || y + height > 1) throw new Error('设备展示区域越界');
  const left = Math.round(x * metadata.width), top = Math.round(y * metadata.height);
  return { left, top, width: Math.min(Math.round(width * metadata.width), metadata.width - left), height: Math.min(Math.round(height * metadata.height), metadata.height - top) };
}

async function previewVariants(input, crop, directory) {
  const bytes = fs.readFileSync(input), metadata = await sharp(bytes).metadata();
  if (!metadata.width || !metadata.height) throw new Error('设备图片尺寸不可读');
  const region = cropRegion(crop, metadata);
  const width = region?.width || metadata.width, height = region?.height || metadata.height;
  const key = crypto.createHash('sha256').update('hardware-preview-v1').update(bytes).update(JSON.stringify(region)).digest('hex').slice(0, 24);
  const variants = [];
  for (const target of [...new Set([480, 960].map((w) => Math.min(w, width)))]) {
    const filename = `${key}-${target}.webp`, destination = path.join(directory, filename);
    let valid = false;
    if (fs.existsSync(destination)) {
      try { const m = await sharp(destination).metadata(); valid = m.format === 'webp' && m.width === target; } catch { /* 损坏衍生图重新生成。 */ }
    }
    if (!valid) {
      const temporary = destination + '.' + crypto.randomUUID() + '.tmp';
      try {
        let pipeline = sharp(bytes);
        if (region) pipeline = pipeline.extract(region);
        await pipeline.resize({ width: target, withoutEnlargement: true }).webp({ quality: 85, effort: 4 }).toFile(temporary);
        fs.renameSync(temporary, destination);
      } finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
    }
    variants.push({ width: target, src: `/ai-hardware-survey/previews/${filename}`, bytes: fs.statSync(destination).size });
  }
  return { width, height, sourceBytes: bytes.length, sourceSha256: crypto.createHash('sha256').update(bytes).digest('hex'), variants };
}

async function optimizeHardwarePage({ root = path.resolve(__dirname, '..') } = {}) {
  const publicRoot = path.join(root, 'public'), outputRoot = path.join(root, 'out');
  const dataFile = path.join(publicRoot, 'ai-hardware-survey/data-20261030.json'), htmlFile = path.join(outputRoot, 'ai-hardware-survey/index.html');
  if (!fs.existsSync(dataFile) || !fs.existsSync(htmlFile)) return null;
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  if (!Array.isArray(data.entries)) throw new Error('设备数据缺少条目');
  const directory = path.join(outputRoot, 'ai-hardware-survey/previews');
  fs.mkdirSync(directory, { recursive: true });
  let html = fs.readFileSync(htmlFile, 'utf8');
  const entries = [];
  for (const item of data.entries) {
    if (!item.photo) continue;
    if (!/^[a-z0-9_-]+$/.test(item.id)) throw new Error('设备编号无效');
    const preview = await previewVariants(sourcePath(publicRoot, item.photo), item.photo_crop, directory);
    const card = new RegExp(`(<article\\b[^>]*\\bid="${item.id}"[^>]*>)([\\s\\S]*?)(<\\/article>)`);
    let replaced = false;
    html = html.replace(card, (_, start, body, end) => {
      const from = body.indexOf('<div class="product-photo">'), to = body.indexOf('<div class="device-body">', from);
      if (from < 0 || to < 0) throw new Error(`设备镜头结构缺失：${item.id}`);
      const selected = preview.variants.at(-1), srcset = preview.variants.map((v) => `${v.src} ${v.width}w`).join(', ');
      const image = `<div class="product-photo"><a href="${escape(item.photo)}" target="_blank" rel="noopener noreferrer" aria-label="查看${escape(item.title)}设备原图" style="display:flex;align-items:center;justify-content:center;width:100%;height:100%"><img src="${selected.src}" srcset="${srcset}" sizes="(max-width: 700px) calc(100vw - 72px), 520px" width="${preview.width}" height="${preview.height}" alt="${escape(item.title)}设备外观参考，点击查看原图" loading="lazy" decoding="async"></a></div>`;
      replaced = true;
      return start + body.slice(0, from) + image + body.slice(to) + end;
    });
    if (!replaced) throw new Error(`导出页面缺少设备：${item.id}`);
    entries.push({ id: item.id, original: item.photo, ...preview });
  }
  const sumUnique = (items) => [...new Map(items).values()].reduce((a, b) => a + b, 0);
  const report = { version: 1, entries,
    originalBytes: sumUnique(entries.map((e) => [e.original, e.sourceBytes])),
    preview480Bytes: sumUnique(entries.map((e) => [e.variants[0].src, e.variants[0].bytes])),
    preview960Bytes: sumUnique(entries.map((e) => [e.variants.at(-1).src, e.variants.at(-1).bytes])),
  };
  if (html !== fs.readFileSync(htmlFile, 'utf8')) fs.writeFileSync(htmlFile, html);
  const serialized = JSON.stringify(report) + '\n', reportFile = path.join(outputRoot, 'ai-hardware-survey/preview-manifest.json');
  if (!fs.existsSync(reportFile) || fs.readFileSync(reportFile, 'utf8') !== serialized) fs.writeFileSync(reportFile, serialized);
  return report;
}

module.exports = { sourcePath, cropRegion, previewVariants, optimizeHardwarePage };
if (require.main === module) optimizeHardwarePage().then((r) => console.log(r ? `设备预览：${r.entries.length}项，原图${r.originalBytes}字节，960档${r.preview960Bytes}字节` : '无硬件页，无需处理')).catch((error) => { console.error(error.message); process.exitCode = 1; });
