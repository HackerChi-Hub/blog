# Blog — Claude Code 项目指令

## 项目概述
Notion 驱动的静态博客，部署在 GitHub Pages / Vercel。

## 技术栈
- Next.js 14 + React 18
- Notion API (@notionhq/client + react-notion-x)
- PrismJS 代码高亮

## 常用命令
- 开发：`npm run dev`
- 构建：`npm run build`
- 部署：`npm run deploy`
- 备份：`npm run backup`

## 注意事项
- Notion 数据库 ID 和 API Key 通过环境变量配置，不要硬编码
- 构建后有 `scripts/post-build.js` 后处理步骤
- 静态输出在 `out/` 目录
