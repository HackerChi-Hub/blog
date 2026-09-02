#!/usr/bin/env node

// 历史入口仅做防误用提示。sitemap、robots 和 RSS 已由 Next.js 页面及
// scripts/post-build.js 从 Obsidian 发布快照生成。
console.error('❌ 该历史脚本已停用；请运行 npm run build。');
process.exit(2);
