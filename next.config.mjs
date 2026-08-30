/** @type {import('next').NextConfig} */
const nextConfig = {
  // 关键：启用静态导出模式（取代 next export 命令）
  output: 'export',

  // Strip console.log/warn in production, keep console.error
  compiler: {
    removeConsole: { exclude: ['error'] },
  },

  // 如果你以后只通过 hyphentech.top 访问，而不再走 GitHub Pages 子路径
  // 可以直接不用 basePath / assetPrefix
  // basePath: '',
  // basePath: '',
  // assetPrefix: '',

  trailingSlash: true,
  reactStrictMode: true,

  // 降低静态导出的峰值内存；启用历史 Notion 回滚层时也可避免 API 并发过高。
  experimental: {
    cpus: 1,
  },

  transpilePackages: ['react-notion-x'],

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
