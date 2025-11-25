/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'blog';

const nextConfig = {
  // 关键：启用静态导出模式（取代 next export 命令）
  output: 'export',

  // 如果你以后只通过 hac.top 访问，而不再走 hackerchi-hub.github.io/blog
  // 可以直接不用 basePath / assetPrefix
  // basePath: '',
  // assetPrefix: '',

  trailingSlash: true,
  reactStrictMode: true
};

export default nextConfig;
