# 黑粉科技 Blog

基于 **Next.js 14 + Obsidian Markdown** 的纯静态博客。Obsidian 内容库是编辑真源；GitHub Pages 只接收经过校验的发布快照，不需要 Notion Token，也不会在构建时访问 Notion。

## 当前内容架构

```text
私有 Obsidian 内容库
  posts/*.md                 草稿与已发布文章
  config/*.yml               通知和子菜单
  templates/*.md             新文章模板
         │
         │ npm run content:sync
         ▼
Blog 仓库
  content-export/            只包含 status: published 的发布快照
  public/obsidian-assets/    公共素材部署镜像
         │
         │ GitHub Actions（markdown-only）
         ▼
hyphentech.top
```

- 稿件删除以当前内容源为准，不从旧快照或 Notion 反向恢复。
- `slug` 与 `legacy_paths` 共同保护历史网址；迁移前的 UUID 网址仍可访问。
- 图片先落到稳定素材目录，再镜像到站点；发布内容不会保留 Notion 临时签名链接。
- Notion 读取代码暂时保留为只读回滚通道，但正式部署固定为 `markdown-only`。

## 文章格式

每篇文章使用 YAML frontmatter：

```markdown
---
title: 示例标题
slug: example-slug
date: 2026-08-30
updated: 2026-08-30
status: draft
summary: 一句话摘要
categories:
  - 技术分享
tags:
  - AI
cover: https://hyphentech.top/obsidian-assets/example-slug/cover.jpg
legacy_paths: []
---

正文支持标准 Markdown、Obsidian 双链、嵌入语法和 callout。
```

只有 `status: published` 的文章会进入公开仓库和线上站点；`draft` 不会被复制进 `content-export/`。

## 常用命令

```bash
npm install

# 校验私有 Obsidian 内容库
npm run content:check

# 生成只含已发布文章的公开快照，并同步稳定素材
npm run content:sync

# 按正式部署模式构建
BLOG_CONTENT_MODE=markdown-only BLOG_CONTENT_DIR=./content-export npm run build

# 检查导出文章、历史网址、sitemap 与临时 Notion 链接
node scripts/verify-export.js
```

首次从 Notion 迁移或需要人工只读复核时才使用：

```bash
npm run content:inventory
npm run content:migrate
```

迁移器只读取当前仍存在且状态为 `Published` 的 Notion 文章；它不会创建、恢复、修改或删除 Notion 页面。

## 目录说明

```text
components/MarkdownContent.js      Markdown 正文组件
lib/content.js                     Obsidian 主源 / Notion 只读兜底合并层
lib/markdown.js                    frontmatter、双链、callout 与路由解析
scripts/validate-content.js        内容和历史网址校验
scripts/export-notion-to-obsidian.js  一次性只读迁移器
scripts/sync-obsidian-content.js   发布快照和素材同步器
scripts/verify-export.js           构建产物验收
content-export/                    GitHub Actions 使用的已发布快照
public/obsidian-assets/            公开素材镜像
```

## 部署

推送 `main` 后，`.github/workflows/deploy.yml` 会：

1. 用 `BLOG_CONTENT_MODE=markdown-only` 和 `./content-export` 构建；
2. 生成静态 `out/`；
3. 部署到 GitHub Pages；
4. 由本地验收脚本回读 sitemap、文章网址和素材。

因此线上部署与 Notion 可用性完全解耦。

## 回滚

紧急情况下可在本地设置 `BLOG_CONTENT_MODE=dual` 或 `notion-only` 使用旧读取层。不要把它重新设为正式 CI 默认值；回滚完成后仍应把确认过的 Markdown 快照作为部署真源。

## 开源提示

本仓库是公开站点代码与发布快照。草稿、Obsidian 私有配置、Notion Token 和其他凭据不得提交到这里。
