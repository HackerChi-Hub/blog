# Notion Blog

> 基于 **Next.js 14 + Notion API** 的纯静态博客方案，支持一键导出 `out` 目录，零后端部署到任意静态托管平台。

---
## ✨ 核心特性

- **Notion 即 CMS**
  - 使用官方 `@notionhq/client` 读取数据库
  - 结合 `react-notion-x` 尽可能还原 Notion 原貌

- **天然纯静态**
  - `next.config.mjs` 已配置 `output: 'export'`
  - 运行 `npm run build` 即生成可直接发布的 `./out` 目录

- **完整路由体系**
  - `/`：文章列表首页  
  - `/page/[page]`：分页列表  
  - `/[slug]`：文章详情  
  - `/404`：自定义 404 页面

- **现代技术栈**
  - Next.js 14 + React 18
  - 享受最新性能与开发体验

---

## 📁 目录结构

```text
.
├── lib
│   ├── config.js        # 站点配置（标题、描述、社交链接、Notion ID 等）
│   └── notion.js        # Notion API 封装
├── next.config.mjs      # Next.js 配置，启用静态导出
├── package.json         # 脚本与依赖
└── pages
    ├── 404.js           # 自定义 404
    ├── index.js         # 首页
    ├── page/[page].js   # 分页列表
    └── [slug].js        # 文章详情
```

---

## ⚙️ 环境要求

- Node.js ≥ 18
- Notion Internal Integration Token
- 已授权给该集成的 Notion 数据库

---

## 🚀 配置流程

### 1. 创建 Notion 集成

1. 访问 <https://www.notion.so/my-integrations>（需启用 JavaScript 才能继续）
2. 创建 **Internal Integration**
3. 记录生成的 **Internal Integration Token**

### 2. 准备 Notion 数据库

1. 新建一个数据库作为文章源
2. 推荐字段（可增删）：
   - `Name`：文章标题（必填）
   - `Slug`：生成 `/[slug]` 路由
   - `Published`：布尔，控制发布状态
   - `Date`：发布日期
   - `Tags`：多选标签
3. 将数据库分享给刚创建的集成（Share → Invite）

### 3. 配置环境变量

在项目根目录创建 `.env.local`：

```bash
NOTION_TOKEN=secret_xxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxx
```

站点文案与链接可在 `lib/config.js` 调整。

---

## 🛠️ 快速开始

```bash
# 安装依赖
npm install

# 本地开发 (http://localhost:3000)
npm run dev

# 构建静态文件（输出到 ./out）
npm run build

# 预览静态构建（可选）
npm run start
```

> 因已启用 `output: 'export'`，无需额外执行 `next export`。

---

## 📦 部署指南

| 平台                         | 构建命令      | 输出目录 | 备注                                  |
| ---------------------------- | ------------- | -------- | ------------------------------------- |
| GitHub Pages                 | npm run build | out      | 可用 GitHub Actions 推送到 `gh-pages` |
| Vercel（静态）               | npm run build | out      | 新建项目选择 Other，输出目录填 `out`  |
| Cloudflare Pages             | npm run build | out      | 使用默认构建命令与目录即可            |
| Netlify / Render / 其他平台 | npm run build | out      | 后台指定构建命令与发布目录            |
| 自托管（Nginx / OSS 等）    | npm run build | out      | 将 `out` 上传为站点根目录             |

---

## ❓ 常见问题

| 问题                           | 原因                                                       | 解决方案                                                   |
| ------------------------------ | ---------------------------------------------------------- | ---------------------------------------------------------- |
| 构建报错 `NOTION_TOKEN missing` | `.env.local` 未配置或未加载                                | 确认文件存在且变量名正确，重新运行构建/开发命令            |
| 页面无文章                     | 数据库未授权或筛选条件不符                                 | 检查数据库分享给集成，并确保 `Published` 为 true           |
| 部署后 404                     | 托管平台路由不匹配                                         | 确认支持静态导出路由，必要时开启 `trailingSlash` 或配置重写 |
| 样式与 Notion 不一致           | `react-notion-x` 渲染特性所致                               | 根据需要自定义组件或注入额外样式                           |

---

## 📄 开源提示

1. 视情况在 `package.json` 移除或调整 `"private": true`
2. 黑客驰作品

---

Happy hacking! 🐱‍💻
```
