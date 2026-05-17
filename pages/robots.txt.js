// pages/robots.txt.js
// 静态生成 robots.txt

import { generateRobotsTxt } from '../lib/sitemap';

export default function Robots({ text }) {
  // 使用 dangerouslySetInnerHTML 输出原始文本
  // 注意：构建后脚本会提取这个内容并保存为 robots.txt
  return (
    <div
      id="robots-content"
      dangerouslySetInnerHTML={{ __html: text }}
      style={{ display: 'none' }}
    />
  );
}

export async function getStaticProps() {
  try {
    const robots = generateRobotsTxt(true);

    return {
      props: {
        text: robots,
      },
    };
  } catch (error) {
    console.error('[robots.txt] 生成失败:', error);
    return {
      props: {
        text: 'User-agent: *\nDisallow: /',
      },
    };
  }
}
