/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'blog';

const nextConfig = {
  // 关键：启用静态导出模式（取代 next export 命令）
  output: 'export',

  // 如果你以后只通过 hac.top 访问，而不再走 hackerchi-hub.github.io/blog
  // 可以直接不用 basePath / assetPrefix
  // basePath: '',
  // basePath: '',
  // assetPrefix: '',

  trailingSlash: true,
  reactStrictMode: true,

  // 图片优化配置
  images: {
    // 静态导出模式下，需要禁用图片优化或使用 unoptimized
    unoptimized: true,
    // 允许的外部图片域名
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.notion.so',
      },
      {
        protocol: 'https',
        hostname: '**.notion-static.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
