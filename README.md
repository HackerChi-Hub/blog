以下是一份经过优化、在 GitHub 上显示更美观的 `README.md`，你可以直接复制整个内容覆盖原文件：

```markdown
# Notion Blog

[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)](https://react.dev/)
[![Notion](https://img.shields.io/badge/Notion-API-black.svg)](https://developers.notion.com/)

基于 **Next.js 14** 与 **Notion** 内容源构建的静态博客。通过 `output: 'export'` 一步生成纯静态文件，可部署到 GitHub Pages、Cloudflare Pages、Vercel（静态模式）等平台。

---

## ✨ 特性

- **Notion 作为 CMS**：使用 `@notionhq/client` + `react-notion-x` 渲染 Notion 页面。
- **纯静态导出**：无需额外 `next export`，构建后即得 `out` 目录。
- **动态路由**：`/[slug]` 文章详情、`/page/[page]` 分页列表。
- **自定义 404**：提供友好的错误页体验。
- **现代技术栈**：Next.js 14、React 18，享受新特性和优化。

---

## 📁 目录结构

```text
.
├── lib
│   ├── config.js        # 站点配置（Notion 数据库 ID、站点信息等）
│   └── notion.js        # Notion API 相关封装
├── next.config.mjs      # Next.js 配置，启用静态导出
├── package.json         # 项目依赖与脚本
└── pages
    ├── 404.js           # 自定义 404 页面
    ├── index.js         # 首页（文章列表）
    ├── page/[page].js   # 分页路由
    └── [slug].js        # 文章详情页
```

---

## ✅ 环境要求

- Node.js ≥ 18
- Notion Internal Integration Token
- 已授权的 Notion 数据库（文章来源）

---

## ⚙️ 配置步骤

1. **创建 Notion 集成**  
   - 访问 [Notion Integrations](https://www.notion.so/my-integrations) 创建 Internal Integration，并记录生成的 Token。

2. **准备 Notion 数据库**  
   - 创建数据库并设置所需字段（示例：`Name`、`Slug`、`Published`、`Date`、`Tags` 等）。
   - 将数据库分享给刚创建的集成（使用 “Share” → 邀请集成）。

3. **配置环境变量**  
   在项目根目录创建 `.env.local`，写入：

   ```bash
   NOTION_TOKEN=secret_xxx              # Notion Integration Token
   NOTION_DATABASE_ID=xxxxxxxxxxxxxxxx  # 数据库 ID，可从分享链接解析
   ```

   其他站点信息（标题、描述、社交链接等）可在 `lib/config.js` 中维护。

---

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 本地开发（默认 http://localhost:3000）
npm run dev

# 构建静态文件（输出到 ./out）
npm run build

# 预览静态构建（可选）
npm run start
```

> `next.config.mjs` 已启用 `output: 'export'`，所以 `npm run build` 会自动生成可部署的 `out` 目录。

---

## 📦 部署指南

| 平台 | 构建命令 | 输出目录 | 备注 |
| ---- | -------- | -------- | ---- |
| GitHub Pages | `npm run build` | `out` | 可使用 GitHub Actions 自动推送 |
| Vercel（静态模式） | `npm run build` | `out` | 新建项目时选择 “Other”，指定静态输出 |
| Cloudflare Pages / Netlify / Render | `npm run build` | `out` | 构建命令和发布目录均为默认配置 |
| 自托管（Nginx/OSS等） | `npm run build` | `out` | 将 `out` 上传至服务器或对象存储即可 |

---

## ❓ 常见问题

| 问题 | 解决方案 |
| ---- | -------- |
| 构建提示 `NOTION_TOKEN missing` | 确认 `.env.local` 已配置并在启动前加载。 |
| 页面无文章显示 | 检查 Notion 数据库是否授权给集成，且 `Published` 字段为 true。 |
| 部署后出现 404 | 确保托管环境支持 `trailingSlash: true`，必要时添加重写规则。 |

---

## 📄 License

项目当前为尝试开发，欢迎指教，本人小白。如需开源或分发，请在 `package.json` 中更新并添加适当的 LICENSE 文件。

---

如需更多定制（SEO、组件、部署脚本等），欢迎继续提问！
```

> **提示**：将以上内容保存为仓库根目录下的 `README.md`，即可在 GitHub 首页获得更清晰、美观的展示效果。
