#!/usr/bin/env node
'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
const postcss = require('postcss');
const { localSource, buildCoverPreviews } = require('./build-cover-previews.js');

async function main() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-cover-performance-'));
  try {
    fs.mkdirSync(path.join(root, 'public/images'), { recursive: true });
    fs.mkdirSync(path.join(root, 'lib'));
    const source = path.join(root, 'public/images/cover.png');
    await sharp({ create: { width: 2000, height: 900, channels: 3, background: '#174148' } }).png().toFile(source);
    const original = fs.readFileSync(source);
    const beforeHash = crypto.createHash('sha256').update(original).digest('hex');
    const manifest = await buildCoverPreviews({ root, sources: ['/images/cover.png'] });
    const item = manifest['/images/cover.png'];
    assert.deepEqual(item.variants.map((variant) => variant.width), [480, 960, 1600]);
    for (const variant of item.variants) {
      const metadata = await sharp(path.join(root, 'public', variant.src)).metadata();
      assert.equal(metadata.format, 'webp');
      assert.equal(metadata.width, variant.width);
      assert.ok(Math.abs(metadata.height - variant.width * 900 / 2000) <= 1, '衍生图必须保持原图完整比例，禁止裁切');
    }
    const backdrop = path.join(root, 'public', item.backdrop);
    assert.equal((await sharp(backdrop).metadata()).width, 80);
    assert.ok(fs.statSync(backdrop).size < 3000, '柔化背景应是微型图，不是第二张大原图');
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'), beforeHash);
    const generated = path.join(root, 'lib/cover-variants.generated.json');
    const mtime = fs.statSync(generated).mtimeMs;
    const files = fs.readdirSync(path.join(root, 'public/cover-previews'));
    assert.deepEqual(await buildCoverPreviews({ root, sources: ['/images/cover.png'] }), manifest);
    assert.equal(fs.statSync(generated).mtimeMs, mtime, '没有变化不重写清单');
    assert.deepEqual(fs.readdirSync(path.join(root, 'public/cover-previews')), files);
    fs.writeFileSync(path.join(root, 'public', item.variants[0].src), '中断后的坏缓存');
    await buildCoverPreviews({ root, sources: ['/images/cover.png'] });
    assert.equal((await sharp(path.join(root, 'public', item.variants[0].src)).metadata()).width, 480, '坏缓存应自动重建');
    await sharp({ create: { width: 2000, height: 900, channels: 3, background: '#ffcc33' } }).png().toFile(source);
    const changed = await buildCoverPreviews({ root, sources: ['/images/cover.png'] });
    assert.notEqual(changed['/images/cover.png'].variants[0].src, item.variants[0].src, '同名原件变化必须使用新地址');
    assert.ok(!fs.existsSync(path.join(root, 'public', item.variants[0].src)), '移除的衍生文件不应随新部署继续发布');
    assert.equal(localSource('https://other.test/cover.png'), '');
    assert.equal(localSource('https://hyphentech.top/images/cover.png?v=2'), '/images/cover.png');
    await sharp({ create: { width: 1000, height: 600, channels: 3, background: '#18424b' } })
      .withMetadata({ orientation: 6 }).jpeg().toFile(path.join(root, 'public/images/rotated.jpg'));
    const rotated = await buildCoverPreviews({ root, sources: ['/images/rotated.jpg'] });
    assert.equal(rotated['/images/rotated.jpg'].width, 600, '按实际朝向计算宽度');
    assert.equal(rotated['/images/rotated.jpg'].height, 1000);
    fs.writeFileSync(path.join(root, 'private.png'), original);
    await assert.rejects(() => buildCoverPreviews({ root, sources: ['/images/../../private.png'] }), /越界/);
    await assert.rejects(() => buildCoverPreviews({ root, sources: ['/images/missing.png'] }), /缺失/);

    const repo = path.resolve(__dirname, '..');
    const read = (file) => fs.readFileSync(path.join(repo, file), 'utf8');
    const hero = read('components/HomeHero.js');
    assert.doesNotMatch(hero, /classList\.add\('reveal'\)|threshold:\s*0\.12/, '长板块不能依赖不可达到的交叉比例才可见');
    assert.match(hero, /pointer: fine/);
    const data = read('lib/home-data.js');
    assert.doesNotMatch(data, /\n\s*categoryBuckets[, :]/, '首页不再输出未使用的分类全集');
    const markdown = read('lib/markdown.js');
    assert.match(markdown, /token\.attrSet\('loading', 'lazy'\)/);
    assert.match(markdown, /preload="none"/, '视频点击时才读取，不能与正文图片抢下载');
    const cover = read('components/ContainedCover.js');
    assert.match(cover, /srcSet=\{sourceSet\}/);
    assert.match(cover, /sizes=\{sourceSet \? sizes : undefined\}/);
    assert.match(cover, /object-fit|contained-cover__image/);
    assert.match(cover, /fetchpriority=\{priority \? 'high' : 'auto'\}/);
    const css = postcss.parse(read('styles/globals.css'));
    css.walkRules('.contained-cover__backdrop', (rule) => {
      assert.equal(rule.nodes.find((node) => node.prop === 'filter').value, 'none');
    });
    console.log('✅ 排版性能回归通过：内容立即可见、移除冗余数据、响应式完整封面、微型背景、原件不变、幂等/越界与正文懒加载');
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
