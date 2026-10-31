#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');
const sharp = require('sharp');

function localMedia(value) {
  if (typeof value !== 'string') return '';
  const source = value.replace(/^https:\/\/(?:www\.)?hyphentech\.top(?=\/)/i, '').split(/[?#]/)[0];
  return /^\/(?:obsidian-assets|images|downloads|png)\//.test(source) ? source : '';
}

function mp4Atoms(file) {
  const fd = fs.openSync(file, 'r');
  const atoms = [];
  const length = fs.fstatSync(fd).size;
  try {
    for (let offset = 0; offset + 8 <= length;) {
      const bytes = Buffer.alloc(16);
      fs.readSync(fd, bytes, 0, Math.min(16, length - offset), offset);
      let size = bytes.readUInt32BE(0);
      if (size === 1) size = Number(bytes.readBigUInt64BE(8));
      if (!size) size = length - offset;
      if (size < 8 || offset + size > length) throw new Error('视频容器损坏');
      atoms.push({ type: bytes.toString('ascii', 4, 8), offset });
      offset += size;
    }
  } finally { fs.closeSync(fd); }
  return atoms;
}

async function buildArticleMedia({ root = path.resolve(__dirname, '..'), sources } = {}) {
  const publicRoot = fs.realpathSync(path.join(root, 'public'));
  const output = path.join(publicRoot, 'media-previews');
  fs.mkdirSync(output, { recursive: true });
  const selected = new Set(sources || []);
  if (!sources) {
    const markdown = new MarkdownIt();
    for (const name of fs.readdirSync(path.join(root, 'content-export/posts'))) {
      if (!name.endsWith('.md')) continue;
      const parsed = matter(fs.readFileSync(path.join(root, 'content-export/posts', name), 'utf8'));
      if (parsed.data.status !== 'published') continue;
      for (const token of markdown.parse(parsed.content, {})) {
        for (const child of token.children || []) {
          if (child.type === 'image') selected.add(child.attrGet('src'));
          if (child.type === 'link_open' && /\.mp4(?:[?#]|$)/i.test(child.attrGet('href') || '')) selected.add(child.attrGet('href'));
        }
      }
    }
  }
  const manifest = {};
  const used = new Set();
  const stats = { images: 0, videos: 0, faststart: 0, webVideos: 0, originalImageBytes: 0, mobileImageBytes: 0, desktopImageBytes: 0 };
  for (const candidate of [...selected].sort()) {
    const source = localMedia(candidate);
    if (!source || manifest[source] || !/\.(?:png|jpe?g|webp|mp4)$/i.test(source)) continue;
    const input = path.resolve(publicRoot, '.' + decodeURIComponent(source));
    if (!input.startsWith(publicRoot + path.sep) || !fs.existsSync(input) || !fs.realpathSync(input).startsWith(publicRoot + path.sep)) throw new Error(`素材缺失或越界：${source}`);
    const bytes = fs.readFileSync(input);
    const key = crypto.createHash('sha256').update('article-media-v1').update(bytes).digest('hex').slice(0, 24);
    if (/\.mp4$/i.test(source)) {
      const atoms = mp4Atoms(input);
      const info = JSON.parse(execFileSync('ffprobe', ['-v','error','-select_streams','v:0','-show_entries','stream=codec_name,pix_fmt,width,height:format=bit_rate','-of','json', input], { encoding:'utf8' }));
      const probe = info.streams[0];
      if (probe?.codec_name !== 'h264' || probe?.pix_fmt !== 'yuv420p') throw new Error(`网页视频需要兼容H264/yuv420p：${source}`);
      let src = source, videoWidth = probe.width, videoHeight = probe.height;
      // 高码率1080p素材额外生成网页720p版，原片和原下载地址保留。
      // 已经低码率的视频不转码，避免静态录屏被反向增肥。
      if (probe.width > 1280 && Number(info.format?.bit_rate) > 3000000) {
        const name = `${key}-web720.mp4`;
        const file = path.join(output, name);
        if (!fs.existsSync(file)) {
          const temporary = path.join(output, `${key}-${crypto.randomUUID()}.tmp.mp4`);
          try {
            execFileSync('ffmpeg', ['-v','error','-nostdin','-i',input,'-map','0:v:0','-map','0:a?','-vf','scale=1280:-2','-c:v','libx264','-preset','medium','-crf','23','-maxrate','2500k','-bufsize','5000k','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart',temporary]);
            fs.renameSync(temporary, file);
          } finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
        }
        const webProbe = JSON.parse(execFileSync('ffprobe', ['-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','json',file], { encoding:'utf8' })).streams[0];
        videoWidth = webProbe.width; videoHeight = webProbe.height;
        used.add(name); src = '/media-previews/' + name; stats.webVideos++;
      } else if (atoms.findIndex(a => a.type === 'moov') > atoms.findIndex(a => a.type === 'mdat')) {
        const name = `${key}-stream.mp4`;
        const file = path.join(output, name);
        if (!fs.existsSync(file)) {
          const temporary = path.join(output, `${key}-${crypto.randomUUID()}.tmp.mp4`);
          try {
            execFileSync('ffmpeg', ['-v','error','-nostdin','-i',input,'-map','0','-c','copy','-movflags','+faststart',temporary]);
            fs.renameSync(temporary, file);
          } finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
        }
        const result = mp4Atoms(file);
        if (result.findIndex(a => a.type === 'moov') > result.findIndex(a => a.type === 'mdat')) throw new Error(`视频索引未前置：${source}`);
        used.add(name); src = '/media-previews/' + name; stats.faststart++;
      }
      const poster = `${key}-poster.webp`;
      if (!fs.existsSync(path.join(output, poster))) {
        const frame = execFileSync('ffmpeg', ['-v','error','-nostdin','-i',input,'-frames:v','1','-vf','scale=min(640\\,iw):-2','-f','image2pipe','-vcodec','mjpeg','pipe:1'], { maxBuffer: 16 * 1024 * 1024 });
        await sharp(frame).webp({ quality: 78 }).toFile(path.join(output, poster));
      }
      used.add(poster); stats.videos++;
      manifest[source] = { kind:'video', src, poster:'/media-previews/' + poster, width:videoWidth, height:videoHeight, ...(src.endsWith('-web720.mp4') ? { original: source } : {}) };
    } else {
      const metadata = await sharp(bytes, { animated:false }).metadata();
      if ((metadata.pages || 1) > 1) continue;
      const width = metadata.autoOrient?.width || metadata.width;
      const height = metadata.autoOrient?.height || metadata.height;
      const variants = [];
      for (const target of [...new Set([640,1280].map(w => Math.min(w,width)))]) {
        const name = `${key}-${target}.webp`;
        const file = path.join(output,name);
        if (!fs.existsSync(file)) await sharp(bytes).rotate().resize({width:target,withoutEnlargement:true}).webp({quality:84,effort:4}).toFile(file);
        if (fs.statSync(file).size >= bytes.length * .9 && target === width) continue;
        used.add(name); variants.push({width:target,src:'/media-previews/' + name,bytes:fs.statSync(file).size});
      }
      if (!variants.length) continue;
      manifest[source] = {kind:'image',width,height,variants};
      stats.images++; stats.originalImageBytes += bytes.length;
      stats.mobileImageBytes += variants[0].bytes; stats.desktopImageBytes += variants.at(-1).bytes;
    }
  }
  // 仅清理本生成器哈希命名的衍生文件，不删除原件或其他素材。
  for (const name of fs.readdirSync(output)) if (/^[a-f0-9]{24}-(?:\d+\.webp|poster\.webp|(?:stream|web720)\.mp4)$/.test(name) && !used.has(name)) fs.unlinkSync(path.join(output,name));
  const destination = path.join(root,'lib/article-media.generated.json');
  const temporary = destination + '.' + crypto.randomUUID() + '.tmp';
  fs.writeFileSync(temporary,JSON.stringify(manifest) + '\n'); fs.renameSync(temporary,destination);
  return { manifest, stats };
}
module.exports = { localMedia, mp4Atoms, buildArticleMedia };
if (require.main === module) buildArticleMedia().then(({stats})=>console.log('✅ 正文素材衍生完成，原件不变：'+JSON.stringify(stats))).catch(error=>{console.error(error.message);process.exitCode=1;});
