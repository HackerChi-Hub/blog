// scripts/post-build.js
// 构建后处理：将 sitemap.xml 和 robots.txt 转换为正确的格式

const fs = require('fs');
const path = require('path');

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

console.log('[post-build] 完成！');
