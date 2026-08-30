// pages/sitemap.xml.js
// 静态生成 sitemap.xml

import { getPosts } from '../lib/content';
import { generateSitemap } from '../lib/sitemap';

export default function Sitemap({ xml }) {
  // 使用 dangerouslySetInnerHTML 输出原始 XML
  // 注意：构建后脚本会提取这个内容并保存为 sitemap.xml
  return (
    <div
      id="sitemap-content"
      dangerouslySetInnerHTML={{ __html: xml }}
      style={{ display: 'none' }}
    />
  );
}

export async function getStaticProps() {
  try {
    const posts = await getPosts();
    const sitemap = generateSitemap(posts);

    return {
      props: {
        xml: sitemap,
      },
    };
  } catch (error) {
    console.error('[sitemap.xml] 生成失败:', error);
    return {
      props: {
        xml: '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
      },
    };
  }
}
