// scripts/post-build.js
// 构建后处理：将 sitemap.xml 和 robots.txt 转换为正确的格式

const fs = require('fs');
const path = require('path');
const { protectNextScripts } = require('../lib/runtime-script-policy.cjs');
const { readProductSnapshot, validateProductSnapshot } = require('../lib/product-release-data.cjs');
const { writeSnapshotAtomic } = require('./refresh-product-releases.js');
const { optimizeHardwarePage } = require('./optimize-hardware-page.js');

const outDir = path.join(process.cwd(), 'out');

function processFile(filePath, targetFile) {
  const fullPath = path.join(outDir, filePath);
  const targetPath = path.join(outDir, targetFile);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`[post-build] 文件不存在: ${filePath}`);
    return;
  }

  // 读取 HTML 文件内容
  const html = fs.readFileSync(fullPath, 'utf-8');
  
  // 使用 cheerio 或简单的正则提取内容
  // 查找 id="sitemap-content" 或 id="robots-content" 或 id="rss-content" 的 div
  let id = 'robots-content';
  if (targetFile.includes('sitemap')) {
    id = 'sitemap-content';
  } else if (targetFile.includes('feed') || targetFile.includes('rss')) {
    id = 'rss-content';
  }
  const regex = new RegExp(`<div[^>]*id="${id}"[^>]*>([\\s\\S]*?)<\\/div>`, 'i');
  const match = html.match(regex);
  
  if (!match) {
    console.warn(`[post-build] 无法从 ${filePath} 中提取内容`);
    return;
  }

  // 提取内容并解码 HTML 实体
  let content = match[1]
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .trim();

  // 如果目标路径是目录，先删除它
  if (fs.existsSync(targetPath)) {
    const stat = fs.statSync(targetPath);
    if (stat.isDirectory()) {
      fs.rmSync(targetPath, { recursive: true, force: true });
      console.log(`[post-build] 已删除目录: ${targetFile}`);
    }
  }

  // 写入目标文件
  fs.writeFileSync(targetPath, content, 'utf-8');
  console.log(`[post-build] ✓ 已生成: ${targetFile}`);
}

// 确保 out 目录存在
if (!fs.existsSync(outDir)) {
  console.error('[post-build] out 目录不存在，请先运行 npm run build');
  process.exit(1);
}

// 处理 sitemap.xml
processFile('sitemap.xml/index.html', 'sitemap.xml');

// 处理 robots.txt
processFile('robots.txt/index.html', 'robots.txt');

// 处理 feed.xml (RSS)
processFile('feed.xml/index.html', 'feed.xml');

// 与页面同一份公开发行快照：只含公开产品信息，供定时部署和线上回读核验。
const productSnapshot = validateProductSnapshot(readProductSnapshot());
writeSnapshotAtomic(path.join(outDir, 'product-releases.json'), productSnapshot);
console.log('[post-build] 已导出公开软件发行快照 product-releases.json');

// NextScript 不转发任意 data 属性；直接在静态导出产物上保护完整的框架依赖链。
let protectedPages = 0;
let linkStyledPages = 0;
function protectRuntime(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) protectRuntime(file);
    else if (entry.isFile() && entry.name.endsWith('.html')) {
      const html = fs.readFileSync(file, 'utf8');
      let protectedHtml = protectNextScripts(html);
      if (protectedHtml !== html) protectedPages += 1;
      if (/<head\b/i.test(protectedHtml) && !protectedHtml.includes('href="/shared/resource-links.css"')) {
        protectedHtml = protectedHtml.replace(/<\/head>/i, '<link rel="stylesheet" href="/shared/resource-links.css"></head>');
        linkStyledPages += 1;
      }
      if (protectedHtml !== html) fs.writeFileSync(file, protectedHtml, 'utf8');
    }
  }
}
protectRuntime(outDir);
console.log(`[post-build] 已保护 ${protectedPages} 个页面的交互脚本，避免 CDN 延后搜索与分享`);
console.log(`[post-build] 已为 ${linkStyledPages} 个独立页面补齐网页与下载入口样式`);

optimizeHardwarePage().then((report) => {
  if (report) console.log(`[post-build] 设备展示图按需加载：${report.entries.length}项，原图${report.originalBytes}字节，960档预览${report.preview960Bytes}字节；原图与价格证据保留`);
  console.log('[post-build] 完成！');
}).catch((error) => { console.error(`[post-build] 设备预览导出失败：${error.message}`); process.exitCode = 1; });
