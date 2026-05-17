// pages/feed.xml.js
// 生成 RSS Feed

import { getPosts } from '../lib/notion';
import { generateRSSFeed } from '../lib/rss';

export default function RSSFeed({ xml }) {
  // 使用 dangerouslySetInnerHTML 输出原始 XML
  // 注意：构建后脚本会提取这个内容并保存为 feed.xml
  return (
    <div
      id="rss-content"
      dangerouslySetInnerHTML={{ __html: xml }}
      style={{ display: 'none' }}
    />
  );
}

export async function getStaticProps() {
  try {
    const posts = await getPosts();
    const rss = generateRSSFeed(posts);

    return {
      props: {
        xml: rss,
      },
    };
  } catch (error) {
    console.error('[feed.xml] 生成失败:', error);
    return {
      props: {
        xml: '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel></channel></rss>',
      },
    };
  }
}
