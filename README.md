# HackerChi Notion Blog · Apple Aesthetic Edition

基于 **Next.js 14 + Notion API** 的纯静态博客，现已全面升级为 Apple 风格体验，并具备实时搜索、智能筛选与 GitHub Pages 一键部署能力。

---

## ✨ 新特性一览

| 功能                 | 说明                                                                                     |
| -------------------- | ---------------------------------------------------------------------------------------- |
| 🍎 Apple 设计语言    | 采用玻璃拟态、SF Pro 字体与极简布局，首页/归档/详情外观统一                               |
| 🔍 实时搜索          | 关键词 + 标签组合筛选，秒级反馈匹配结果                                                   |
| 🧭 全新首页          | Hero、高亮 CTA、精选栅格卡片，突出演示最新文章与内容层次                                  |
| 📦 纯静态导出        | `output: 'export'`，`npm run build` 即得可部署的 `out` 目录                               |
| 🚀 GitHub Pages 部署 | 提供 `deploy.yml` 工作流，推送 `main` 自动发布到 `https://<user>.github.io/blog/`          |
| 🧾 文章详情优化      | Notion 内容全屏沉浸式阅读，暗黑主题、标签/分类 pill 展示                                  |
| ⚠️ 404 友好页        | 引导返回首页，保持与主站一致的视觉风格                                                     |

---

## 🗂️ 项目结构

```
.
├── .github/workflows/deploy.yml   # GitHub Pages 自动部署
├── lib
│   ├── config.js                  # Notion 属性映射 / 站点配置
│   └── notion.js                  # Notion 数据读取封装
├── pages
│   ├── index.js                   # Apple 风首页 + 搜索
│   ├── page/[page].js             # 分页归档
│   ├── [slug].js                  # Notion 文章详情
│   └── 404.js                     # 自定义 404
├── styles
│   ├── globals.css                # 全局 Apple 视觉样式
│   └── notion-overrides.css       # Notion 渲染覆盖
├── next.config.mjs                # 静态导出、GitHub Pages basePath
├── package.json
└── README.md
```

---

## ⚙️ 环境要求

- Node.js ≥ 18
- Notion Internal Integration Token（已授权目标数据库）
- `NOTION_DATABASE_ID`

---

## 🔐 环境变量

在根目录创建 `.env.local`：

```bash
NOTION_TOKEN=secret_xxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_NOTION_INDEX=0
```

> 如需自定义 Notion 字段名，可在 `lib/config.js` 中通过环境变量覆盖。

---

## 🛠️ 本地开发

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 生成 ./out 静态目录
npm run start    # 预览构建结果
```

---

## 🌐 GitHub Pages 部署

1. 仓库设置 → Pages → **Build and deployment** 选择 “GitHub Actions”。
2. 在 **Settings → Secrets and variables → Actions** 中新增：
   - `NOTION_TOKEN`
   - `NOTION_DATABASE_ID`
3. 确认 `.github/workflows/deploy.yml` 已提交，推送到 `main` 即可自动发布。

> 若自定义域名或托管平台（如 Vercel / Cloudflare Pages），仅需保持 `npm run build` → `out` 的构建约定。

---

## 🧭 使用指南

### 首页
- Hero 模块：品牌宣言 + 最新文章高亮
- 搜索区：输入关键词、点击标签 Chip 即时筛选
- 精选卡片：展示日期、分类、摘要、标签等信息

### 详情页
- 统一暗黑 Apple 风格
- 分类/标签以 pill 显示
- Notion 渲染支持代码高亮、Callout、表格等

### 404
- 语义化引导
- “返回首页” 主按钮维持视觉一致性

---

## 📌 常见问题

| 问题                                | 解决方案                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------ |
| NOTION_TOKEN missing                | 检查 `.env.local`/Actions Secrets，重启构建                              |
| 页面无内容                         | 确认 Notion 数据库已分享给 Integration，文章 `type=Post` 且 `status=Published` |
| GitHub Pages 静态资源 404           | `next.config.mjs` 已设置 `basePath/assetPrefix='/blog'`，保持默认即可    |
| 想改成自定义域名                   | 去除 `basePath` / `assetPrefix` 并在托管平台绑定域名                      |

---

## 📄 许可证

黑客驰原创

---

如需扩展 Algolia 搜索、导航菜单、暗黑/浅色切换等功能，欢迎继续迭代。Enjoy the Apple-inspired reading experience! 🍏
```
