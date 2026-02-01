# Notion Blog


> 基于 **Next.js 14 + Notion API** 的纯静态博客方案，支持一键导出 `out` 目录，零后端部署到任意静态托管平台。
---
## ✨ 核心特性
- **Notion 即 CMS**
  - 使用官方 `@notionhq/client` 读取数据库
  - 结合 `react-notion-x` 尽可能还原 Notion 原貌
  - 支持多种内容类型：文章（Post）、通知（Notice）、子菜单（SubMenu）

- **天然纯静态**
  - `next.config.mjs` 已配置 `output: 'export'`
  - 运行 `npm run build` 即生成可直接发布的 `./out` 目录
  - 支持 `trailingSlash` 路由模式

- **完整路由体系**
  - `/`：文章列表首页（带 Hero 区域、分类展示、通知、子菜单）
  - `/page/[page]`：分页列表（每页 21 篇）
  - `/[slug]`：文章详情页
  - `/404`：自定义 404 页面
  - `/feed.xml`：RSS 订阅源
  - `/sitemap.xml`：网站地图
  - `/robots.txt`：搜索引擎爬虫配置

- **丰富的功能特性**
  - 代码高亮支持（Prism.js，支持多种语言）
  - Google Analytics 集成
  - 深色主题 UI
  - 响应式设计
  - 内容保护（禁用右键菜单和复制，代码区域除外）
  - **SEO 优化**：完整的 meta 标签、Open Graph、Twitter Card、JSON-LD 结构化数据
  - **RSS 订阅**：自动生成 RSS feed，支持内容订阅
  - **文章分享**：支持分享到 Twitter、Facebook、LinkedIn、微信、微博、QQ、QQ空间等平台
  - **相关文章推荐**：基于标签、分类和内容相似度的智能推荐
  - **阅读时间估算**：自动计算并显示文章预计阅读时间
  - **全局搜索**：客户端实时搜索，支持标题、摘要、标签搜索（快捷键 Ctrl+K）
  - **自动备份**：部署前自动创建项目备份

- **现代技术栈**
  - Next.js 14.2.3 + React 18.3.1
  - `@notionhq/client` 2.2.13
  - `react-notion-x` 6.16.0
  - `prismjs` 1.29.0

---

## 📁 目录结构

```text
.
├── components/                # React 组件
│   ├── OptimizedImage.js     # 图片优化组件
│   ├── RelatedPosts.js        # 相关文章组件
│   ├── Search.js             # 全局搜索组件
│   ├── SEO.js                # SEO 元标签组件
│   └── ShareButtons.js       # 文章分享组件
├── lib/                      # 工具库
│   ├── config.js             # Notion 属性名配置（支持环境变量覆盖）
│   ├── notion.js             # Notion API 封装
│   ├── reading-time.js        # 阅读时间计算
│   ├── related-posts.js      # 相关文章推荐算法
│   ├── rss.js                # RSS feed 生成
│   ├── seo.js                # SEO 配置和工具
│   └── sitemap.js            # 网站地图生成
├── pages/                    # Next.js 页面
│   ├── _app.js               # 全局应用配置
│   ├── index.js              # 首页（Hero 区域 + 文章列表）
│   ├── [slug].js             # 文章详情页
│   ├── page/[page].js        # 分页列表页
│   ├── feed.xml.js           # RSS feed 页面
│   ├── sitemap.xml.js        # 网站地图页面
│   ├── robots.txt.js         # robots.txt 页面
│   └── 404.js                # 404 页面
├── scripts/                  # 构建脚本
│   ├── backup.js             # 项目备份脚本
│   ├── deploy.js             # 自动部署脚本
│   ├── generate-sitemap.js   # 网站地图生成脚本
│   └── post-build.js         # 构建后处理脚本
├── styles/                   # 样式文件
│   ├── globals.css           # 全局样式
│   └── notion-overrides.css  # Notion 样式覆盖
├── next.config.mjs           # Next.js 配置
└── package.json              # 依赖与脚本
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
2. **必需字段**（字段名可通过环境变量配置，见 `lib/config.js`）：
   - `title`（Title 类型）：文章标题
   - `slug`（Rich Text 类型）：URL 路径，如不填则使用页面 ID
   - `type`（Select 类型）：内容类型，需包含 `Post`、`Notice`、`SubMenu` 等选项
   - `status`（Select 类型）：发布状态，需包含 `Published`、`Invisible` 等选项
   - `date`（Date 类型）：发布日期
3. **可选字段**：
   - `summary`（Rich Text 类型）：文章摘要
   - `category`（Multi-select 类型）：分类
   - `tags`（Multi-select 类型）：标签
   - `ext`（URL 或 Rich Text 类型）：外部链接（用于 SubMenu）
4. 将数据库分享给刚创建的集成（Share → Invite）

### 3. 配置环境变量

在项目根目录创建 `.env.local`：

```bash
# 必需
NOTION_TOKEN=secret_xxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxx

# 可选：Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# 可选：GitHub Token（用于自动部署）
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# 可选：Notion 属性名自定义（默认值见 lib/config.js）
NEXT_PUBLIC_NOTION_PROPERTY_TITLE=title
NEXT_PUBLIC_NOTION_PROPERTY_SLUG=slug
NEXT_PUBLIC_NOTION_PROPERTY_TYPE=type
NEXT_PUBLIC_NOTION_PROPERTY_TYPE_POST=Post
NEXT_PUBLIC_NOTION_PROPERTY_STATUS=status
NEXT_PUBLIC_NOTION_PROPERTY_STATUS_PUBLISH=Published
NEXT_PUBLIC_NOTION_PROPERTY_CATEGORY=category
NEXT_PUBLIC_NOTION_PROPERTY_TAGS=tags
NEXT_PUBLIC_NOTION_PROPERTY_DATE=date
NEXT_PUBLIC_NOTION_PROPERTY_SUMMARY=summary
NEXT_PUBLIC_NOTION_PROPERTY_EXT=ext
```

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

# 创建项目备份（排除 node_modules、.next、out 等）
npm run backup

# 自动部署到 GitHub（备份 + 提交 + 推送）
npm run deploy
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

## 🎨 功能说明

### 首页特性

- **Hero 区域**：展示站点标题、分类统计、最新通知、子菜单链接
- **分类展示**：支持按分类（如"技术分享"、"学习思考"、"资源分享"）展示文章
- **文章卡片**：显示标题、日期、标签、摘要，支持封面图
- **全局搜索**：实时搜索功能，支持快捷键 Ctrl+K，可搜索标题、摘要、标签
- **分页导航**：每页 21 篇文章，支持分页浏览

### 文章详情页

- **Notion 渲染**：使用 `react-notion-x` 完整渲染 Notion 页面内容
- **代码高亮**：支持 JavaScript、TypeScript、Python、Bash、JSON、Markdown、CSS、YAML 等多种语言
- **元信息展示**：显示标题、日期、分类、标签、阅读时间
- **文章分享**：支持分享到多个社交平台（Twitter、Facebook、LinkedIn、微信、微博、QQ、QQ空间等）
- **相关文章推荐**：基于标签、分类和内容相似度的智能推荐
- **SEO 优化**：完整的 meta 标签、Open Graph、Twitter Card、JSON-LD 结构化数据
- **深色主题**：统一的深色 UI 设计

### 内容保护

- 默认禁用右键菜单、复制、粘贴、文本选择、拖拽
- **代码区域例外**：代码块（`<pre>`、`<code>`）内允许选择和复制

### SEO 和内容发现

- **RSS 订阅**：自动生成 `/feed.xml`，支持 RSS 阅读器订阅
- **网站地图**：自动生成 `/sitemap.xml`，便于搜索引擎索引
- **robots.txt**：自动生成 `/robots.txt`，控制搜索引擎爬虫行为
- **结构化数据**：使用 JSON-LD 格式提供结构化数据，提升搜索引擎理解

### 备份和部署

- **自动备份**：`npm run backup` 创建项目压缩包，自动保留最近 10 个备份
- **自动部署**：`npm run deploy` 自动执行备份、提交更改并推送到 GitHub
  - 从 `.env.local` 读取 `GITHUB_TOKEN` 进行身份验证
  - 支持自定义提交信息：`npm run deploy "你的提交信息"`

---

## ❓ 常见问题

| 问题                           | 原因                                                       | 解决方案                                                   |
| ------------------------------ | ---------------------------------------------------------- | ---------------------------------------------------------- |
| 构建报错 `NOTION_TOKEN missing` | `.env.local` 未配置或未加载                                | 确认文件存在且变量名正确，重新运行构建/开发命令            |
| 页面无文章                     | 数据库未授权或筛选条件不符                                 | 检查数据库分享给集成，确保 `type` 为 `Post`，`status` 为 `Published` |
| 部署后 404                     | 托管平台路由不匹配                                         | 确认支持静态导出路由，项目已配置 `trailingSlash: true`     |
| 样式与 Notion 不一致           | `react-notion-x` 渲染特性所致                               | 可在 `styles/notion-overrides.css` 中自定义样式           |
| 代码高亮不显示                 | Prism.js 语言包未加载                                      | 检查 `pages/[slug].js` 中的 `loadPrismLanguages` 函数      |
| Google Analytics 不工作         | `NEXT_PUBLIC_GA_ID` 未配置或格式错误                        | 确认环境变量格式为 `G-XXXXXXXXXX`                          |

---

## 📄 开源提示

1. 视情况在 `package.json` 移除或调整 `"private": true`
2. 黑客驰作品

---

Happy hacking! 🐱‍💻
```
