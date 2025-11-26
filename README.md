```markdown
<div align="center">

# ✨ Notion Blog

基于 **Next.js 14** 与 **Notion API** 构建的静态博客，支持一键导出纯静态文件，轻松部署到各类静态托管平台。

[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)](https://react.dev/)
[![Notion](https://img.shields.io/badge/Notion-API-black.svg)](https://developers.notion.com/)
[![License](https://img.shields.io/badge/license-private-gray.svg)](#-license)

</div>

---

## 🧩 简介

- 使用 **Notion 作为 CMS**，通过 `@notionhq/client` + `react-notion-x` 渲染内容  
- 利用 Next.js `output: 'export'`，**构建后直接得到 `out` 静态目录**  
- 支持文章详情、分页列表、自定义 404 等常见博客功能  
- 基于 **Next.js 14** 与 **React 18**，享受最新特性与性能优化  

---

## ✨ 特性一览

- 📝 **Notion 作为内容源**
  - 通过官方 Notion API 读取数据库内容
  - 使用 `react-notion-x` 高度还原 Notion 页面样式

- 📦 **纯静态导出**
  - 无需额外执行 `next export`
  - `npm run build` 完成后即在 `./out` 目录中生成所有静态文件

- 🧭 **友好的路由设计**
  - `/`：文章列表首页
  - `/page/[page]`：分页列表
  - `/[slug]`：文章详情页
  - `/404`：自定义 404 页面

- 🚀 **现代技术栈**
  - Next.js 14、React 18
  - 更好的性能和开发体验

---

## 📁 目录结构

```text
.
├── lib
│   ├── config.js        # 站点配置（Notion 数据库 ID、站点信息等）
│   └── notion.js        # Notion API 相关封装
├── next.config.mjs      # Next.js 配置，启用静态导出 (output: 'export')
├── package.json         # 项目依赖与脚本
└── pages
    ├── 404.js           # 自定义 404 页面
    ├── index.js         # 首页（文章列表）
    ├── page/[page].js   # 分页路由
    └── [slug].js        # 文章详情页
```

---

## ✅ 环境要求

- Node.js ≥ **18**
- 一个 **Notion Internal Integration Token**
- 一个已授权给该集成的 **Notion 数据库**（作为文章源）

---

## ⚙️ 配置步骤

### 1. 创建 Notion 集成

1. 访问 [Notion Integrations](https://www.notion.so/my-integrations)  
2. 创建 **Internal Integration**  
3. 记录生成的 **Internal Integration Token**

### 2. 准备 Notion 数据库

1. 在 Notion 中创建一个数据库，作为文章列表  
2. 建议包含的字段（可根据需要增减）：
   - `Name`：文章标题（必需）
   - `Slug`：用于生成 `/[slug]` 路由
   - `Published`：是否发布（布尔值）
   - `Date`：发布时间
   - `Tags`：标签
3. 将数据库 **分享（Share）给刚创建的集成**：
   - 打开数据库 → 右上角 **Share** → 邀请你的 Integration

### 3. 配置环境变量

在项目根目录新建 `.env.local` 文件，填入：

```bash
NOTION_TOKEN=secret_xxx              # Notion Integration Token
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxx  # 数据库 ID，可从分享链接解析
```

> 站点基础信息（标题、副标题、社交链接等）可在 `lib/config.js` 中进行维护与修改。

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

> `next.config.mjs` 已启用 `output: 'export'`，因此执行 `npm run build` 即可生成可直接部署的 `out` 目录。

---

## 📦 部署指南

> 所有平台的构建命令均为：`npm run build`，输出目录均为：`out`。

| 平台                       | 构建命令       | 输出目录 | 备注                                                         |
| -------------------------- | -------------- | -------- | ------------------------------------------------------------ |
| **GitHub Pages**           | `npm run build`| `out`    | 推荐使用 GitHub Actions 自动构建并推送到 `gh-pages` 分支    |
| **Vercel（静态模式）**     | `npm run build`| `out`    | 创建项目时选择 “Other”，指定静态输出目录为 `out`           |
| **Cloudflare Pages**       | `npm run build`| `out`    | 构建命令与发布目录均配置为默认值即可                        |
| **Netlify / Render 等**    | `npm run build`| `out`    | 一般在 Build & Publish 设置中指定构建命令与发布目录         |
| **自托管（Nginx / OSS 等）**| `npm run build`| `out`    | 将 `out` 目录上传至服务器或对象存储，配置为静态站点根目录即可 |

---

## ❓ 常见问题（FAQ）

| 问题 | 可能原因 | 解决方案 |
| ---- | -------- | -------- |
| 构建提示 `NOTION_TOKEN missing` | 环境变量缺失或未加载 | 确认 `.env.local` 已创建且名称无误，重启开发/构建进程 |
| 页面无文章显示 | 数据库未授权 / 筛选条件不符 | 检查数据库是否已分享给集成，确认 `Published` 字段为 `true` |
| 部署到某些平台后页面 404 | 路由重写或静态站点配置不当 | 确认托管平台支持静态导出路由，必要时开启 `trailingSlash: true` 或按平台文档增加重写规则 |
| 样式或组件与 Notion 中略有差异 | `react-notion-x` 渲染特性所致 | 可按需自定义组件，或参考 `react-notion-x` 文档替换默认样式 |

---

## 📄 License

当前项目为 **私有（`"private": true`）**。  
如需开源或分发，请：

1. 在 `package.json` 中移除 `"private": true` 或调整为合适配置  
2. 新增合适的开源许可证（如 MIT、Apache-2.0 等），并在仓库根目录添加 `LICENSE` 文件  

---

> **提示**：将本文件保存为仓库根目录下的 `README.md`，即可在 GitHub 首页获得清晰、美观的项目介绍展示效果。  
> 如需进一步定制（SEO、主题样式、多语言、自动部署脚本等），可以在 Issue 或讨论区继续扩展。
```
