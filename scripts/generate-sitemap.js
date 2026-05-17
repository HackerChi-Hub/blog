// scripts/generate-sitemap.js
// 构建时生成 sitemap.xml 和 robots.txt

const fs = require('fs');
const path = require('path');

// 注意：这个脚本需要在构建时运行，需要访问 Notion API
// 为了简化，我们可以创建一个 API 路由来动态生成
// 但由于使用静态导出，我们创建一个页面路由来生成这些文件

async function generateFiles() {
  try {
    // 动态导入（因为使用了 ES modules）
    const { getPosts } = await import('../lib/notion.js');
    const { generateSitemap, generateRobotsTxt } = await import('../lib/sitemap.js');

    console.log('[generate-sitemap] 开始获取文章列表...');
    const posts = await getPosts();
    console.log(`[generate-sitemap] 获取到 ${posts.length} 篇文章`);

    // 生成 sitemap.xml
    const sitemapContent = generateSitemap(posts);
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
    console.log('[generate-sitemap] sitemap.xml 已生成:', sitemapPath);

    // 生成 robots.txt
    const robotsContent = generateRobotsTxt(true);
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    fs.writeFileSync(robotsPath, robotsContent, 'utf-8');
    console.log('[generate-robots] robots.txt 已生成:', robotsPath);

    console.log('[generate-sitemap] 完成！');
  } catch (error) {
    console.error('[generate-sitemap] 生成失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  generateFiles();
}

module.exports = { generateFiles };
