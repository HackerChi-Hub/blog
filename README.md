```markdown
# Notion Blog

基于 Next.js 14.2 与 Notion 数据源构建的静态博客，支持 `next export` 生成纯静态站点，可直接部署到 GitHub Pages、Cloudflare Pages、Vercel（静态模式）或任意静态托管平台。

## ✨ 特性

- **Notion 文章源**：通过 `@notionhq/client` 与 `react-notion-x` 渲染 Notion 内容。
- **静态导出**：`next.config.mjs` 中 `output: 'export'`，一键导出静态文件。
- **动态路由**：`/[slug].js`、`/page/[page].js` 等支持文章详情与分页。
- **React 18 + Next 14**：享受最新的性能优化与 DX。
- **自定义 404 页面**：更友好的用户体验。

## 📁 目录结构

```
.
├── lib
│   ├── config.js        # 站点配置（Notion 数据库 ID、站点信息等）
│   └── notion.js        # Notion API 相关封装
├── next.config.mjs      # Next.js 配置，启用静态导出
├── package.json         # 项目依赖与脚本
└── pages
    ├── 404.js           # 自定义 404 页面
    ├── index.js         # 首页（文章列表）
    ├── page/[page].js   # 分页路由
    └── [slug].js        # 文章详情页
```

## 🧩 依赖

- Node.js ≥ 18（Next.js 14 官方要求）
- Notion 集成令牌（Internal Integration Token）
- Notion 数据库（作为文章列表来源）

## ⚙️ 配置步骤

1. **创建 Notion 集成**  
   - 访问 [Notion Developers](https://www.notion.so/my-integrations)，创建 Internal Integration。
   - 复制生成的 **Internal Integration Token**。

2. **准备 Notion 数据库**  
   - 创建一个数据库视图（如表格或看板），设置以下字段（可根据项目需求调整，但需与 `lib/config.js` 中的映射一致）：
     - `Name`（标题）
     - `Slug`（唯一标识，英文或拼音）
     - `Published`（布尔值，控制是否发布）
     - `Date`、`Tags` 等可选字段
   - 将数据库分享给步骤 1 创建的集成（“Share” → 邀请你的集成）。

3. **配置环境变量**  
   在项目根目录创建 `.env.local`（本地开发）与 `.env`（生产构建可选），至少包含：

   ```bash
   NOTION_TOKEN=secret_xxx              # Internal Integration Token
   NOTION_DATABASE_ID=xxxxxxxxxxxxxxxx  # 数据库 ID，可在 Notion 分享链接中获取
   ```

   > 若 `lib/config.js` 还需其他变量（如站点名称、描述、社交链接），一并在此定义。

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 本地开发（默认端口 3000）
npm run dev

# 3. 构建静态资源
npm run build

# 4. 预览静态构建（可选）
npm run start

# 5. 导出的静态文件位于 ./out，可直接部署
```

> `next build` 在 `next.config.mjs` 的 `output: 'export'` 配置下，会自动执行静态导出，无需额外运行 `next export`。

## 📦 部署建议

- **GitHub Pages**：将 `out` 目录内容推送至 `gh-pages` 分支，或使用 GitHub Action 自动构建。
- **Vercel**：创建项目时选择 “Other” → `npm run build`，构建产物目录填 `out`。
- **Cloudflare Pages / Netlify / Render**：构建命令 `npm run build`，发布目录 `out`。
- **自托管**：任意静态资源服务器（Nginx、Apache、OSS 等）直接托管 `out`。

## 🧪 常见问题

| 问题 | 可能原因与解决方案 |
| --- | --- |
| 构建时报错 `NOTION_TOKEN missing` | 确认 `.env.local` 是否已配置并在启动前加载。 |
| 页面无文章 | 检查 Notion 数据库是否授权给集成；确保 `Published` 字段为 true。 |
| 静态导出页面 404 | 确保 `trailingSlash: true` 与部署路径一致，或通过服务器重写。 |

## 📄 License

此项目正在尝试开发中，本人小白欢迎指教！

---
