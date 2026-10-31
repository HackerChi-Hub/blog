'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const { optimizeHardwarePage, cropRegion, sourcePath } = require('./optimize-hardware-page');

async function main() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hardware-page-performance-'));
  try {
    const assets = path.join(root, 'public/ai-hardware-survey/assets'), output = path.join(root, 'out/ai-hardware-survey');
    fs.mkdirSync(assets, { recursive: true }); fs.mkdirSync(output, { recursive: true });
    const source = path.join(assets, 'device.png');
    const left = await sharp({ create: { width: 500, height: 500, channels: 3, background: '#ee2222' } }).png().toBuffer();
    await sharp({ create: { width: 1000, height: 500, channels: 3, background: '#22dd22' } }).composite([{ input: left, left: 0, top: 0 }]).png().toFile(source);
    const original = fs.readFileSync(source), sourceHash = crypto.createHash('sha256').update(original).digest('hex');
    const entries = [
      { id: 'full', title: '完整设备', photo: '/ai-hardware-survey/assets/device.png', price_cny: 1234.56 },
      { id: 'crop', title: '机身区域', photo: '/ai-hardware-survey/assets/device.png', photo_crop: [.5, 0, .5, 1], price_cny: 789 },
      { id: 'existing', title: '已有设备', photo: null, price_cny: 0 },
    ];
    const dataFile = path.join(root, 'public/ai-hardware-survey/data-20261030.json');
    fs.writeFileSync(dataFile, JSON.stringify({ entries }));
    const dataBefore = fs.readFileSync(dataFile);
    const card = (id) => `<article class="device" id="${id}"><div class="product-photo"><img src="/ai-hardware-survey/assets/device.png"></div><div class="device-body">¥1234.56<details>原价格证据</details></div></article>`;
    fs.writeFileSync(path.join(output, 'index.html'), '<html><head></head><body>' + card('full') + card('crop') + '<article id="existing">已有设备</article></body></html>');
    const report = await optimizeHardwarePage({ root });
    assert.equal(report.entries.length, 2);
    assert.deepEqual(report.entries[0].variants.map((v) => v.width), [480, 960]);
    const cropped = report.entries[1];
    assert.equal(cropped.width, 500); assert.equal(cropped.height, 500);
    const cropImage = path.join(root, 'out', cropped.variants.at(-1).src);
    const pixel = await sharp(cropImage).extract({ left: 100, top: 100, width: 1, height: 1 }).raw().toBuffer();
    assert(pixel[1] > 150 && pixel[0] < 80, '预览保留原定机身区域，不引入区域外内容');
    const htmlFile = path.join(output, 'index.html'), first = fs.readFileSync(htmlFile, 'utf8');
    assert(first.includes('srcset=') && first.includes('sizes=') && first.includes('loading="lazy"'));
    assert.equal((first.match(/aria-label="查看/g) || []).length, 2, '每张设备图可打开原图');
    assert.equal((first.match(/原价格证据/g) || []).length, 2, '原价、证据与其他设备内容不被预览替换');
    assert(first.includes('¥1234.56') && first.includes('已有设备'));
    assert.deepEqual(fs.readFileSync(dataFile), dataBefore, '设备参数、价格与证据索引不改写');
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'), sourceHash);
    assert.deepEqual(await optimizeHardwarePage({ root }), report);
    assert.equal(fs.readFileSync(htmlFile, 'utf8'), first, '重复导出不增加重复包裹层');
    const cache = path.join(root, 'out', report.entries[0].variants[0].src);
    fs.writeFileSync(cache, '损坏缓存'); await optimizeHardwarePage({ root });
    assert.equal((await sharp(cache).metadata()).format, 'webp');
    assert.throws(() => cropRegion([.9, 0, .5, 1], { width: 1000, height: 500 }), /越界/);
    const outside = path.join(root, 'public/ai-hardware-survey/private.png'); fs.writeFileSync(outside, original);
    assert.throws(() => sourcePath(path.join(root, 'public'), '/ai-hardware-survey/assets/%2e%2e%2fprivate.png'), /越界/);
    fs.symlinkSync(outside, path.join(assets, 'linked.png'));
    assert.throws(() => sourcePath(path.join(root, 'public'), '/ai-hardware-survey/assets/linked.png'), /越界/);
    console.log('✅ 设备页性能回归通过：响应式预览、展示区域、原图和报价保留、幂等、坏缓存修复与路径检查');
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
