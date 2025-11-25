/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'blog';

const nextConfig = {
  // 关键：启用静态导出模式（取代 next export 命令）
  output: 'export',

  // 给 GitHub Pages 的子路径用
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',

  trailingSlash: true,
  reactStrictMode: true
};

export default nextConfig;
