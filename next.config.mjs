/** @type {import('next').NextConfig} */
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'blog';

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

  // 转译 CommonJS 模块（解决 react-use / react-notion-x 的 ESM↔CJS 兼容问题）
  transpilePackages: ['react-use', 'react-notion-x'],

  // Webpack 配置：处理 CommonJS 模块
  webpack: (config, { isServer }) => {
    // 使用别名将 react-use 重定向到包装器
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-use': path.resolve(__dirname, 'lib/react-use-wrapper.cjs'),
    };
    return config;
  },

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
