# 黑粉科技 Blog

基于 **Next.js 15 + Obsidian Markdown** 的纯静态博客。私有 Obsidian 内容库是唯一编辑真源；GitHub Pages 只接收经过校验的发布快照。

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
         │ GitHub Actions
         ▼
hyphentech.top
```

- 稿件删除以当前 Obsidian 内容库为准，不从旧快照反向恢复。
- 私有内容库单独使用私有 Git 仓库；公开 Blog 仓库只保存 `published` 快照。
- `slug` 与 `legacy_paths` 共同保护历史网址；迁移前的 UUID 网址仍可访问。
- 图片先落到文章自己的稳定素材目录；同步器只公开实际被已发布文章引用的文件，并自动清理公开镜像中的旧文件。

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

正文支持标准 Markdown、指向现有文章 slug 的 Obsidian 双链和 callout。Obsidian 私有附件嵌入 `![[附件]]` 不会发布；请先把附件放入稳定素材目录并改成 `/obsidian-assets/` 链接。
```

只有 `status: published` 的文章会进入公开仓库和线上站点；`draft` 不会被复制进 `content-export/`。

## 常用命令

```bash
npm install

# 校验私有 Obsidian 内容库
npm run content:check

# 生成只含已发布文章的公开快照，并同步稳定素材
npm run content:sync

# 回归测试：草稿隔离、删除、素材裁剪、幂等与失败回滚
npm run test:content

# 按正式部署模式构建
BLOG_CONTENT_DIR=./content-export npm run build

# 检查导出文章、历史网址、sitemap 与临时签名链接
node scripts/verify-export.js
```

从 ContentDistributor 的 `article_content.json` 建立 Obsidian 草稿：

```bash
npm run content:import -- /绝对路径/article_content.json \
  --slug article-slug \
  --status draft \
  --category 技术分享 \
  --tag AI
```

如果同名文章已经存在，导入器默认拒绝覆盖；确认要用新内容更新时才加 `--force`。

## 目录说明

```text
components/MarkdownContent.js      Markdown 正文组件
lib/content.js                     Obsidian 内容访问层
lib/markdown.js                    frontmatter、双链、callout 与路由解析
scripts/validate-content.js        内容和历史网址校验
scripts/sync-obsidian-content.js   发布快照和素材同步器
scripts/import-article-content.js  通用 CONTENT JSON → Obsidian 草稿导入器
scripts/test-content-pipeline.js   内容发布故障与回归测试
scripts/verify-export.js           构建产物验收
content-export/                    GitHub Actions 使用的已发布快照
public/obsidian-assets/            公开素材镜像
```

## 部署

日常发布只使用一个全局命令，在任意目录都能运行：

```bash
blog-publish
```

需要自定义 Git 提交说明时：

```bash
blog-publish "更新 <slug>"
```

不传说明时会自动使用默认发布说明。旧 `npm run blog-push` 已退出正式流程。

发布器会依次：

1. 确认 Blog 代码库干净、两个仓库都在 `main` 且没有远程分叉；
2. 校验私有 Obsidian 内容并生成确定性公开快照；
3. 按 Obsidian 发布快照完整构建和验收；
4. 先提交、推送私有原件（包括手工删除），再只提交 `content-export/` 与 `public/obsidian-assets/`；
5. 等待 GitHub Actions，并回读线上构建编号、sitemap、全部页面和全部公开素材。

没有公开内容变化时不会制造空提交。Blog 代码库有其他未提交修改时会失败关闭，避免把无关代码混入文章发布。

推送 `main` 后，`.github/workflows/deploy.yml` 会：

1. 用 `BLOG_CONTENT_DIR=./content-export` 构建；
2. 生成静态 `out/`；
3. 部署到 GitHub Pages；
4. 由一键发布器回读 sitemap、文章网址和素材。

因此线上部署只依赖仓库中的 Obsidian 发布快照。

## 开源提示

本仓库是公开站点代码与发布快照。草稿、Obsidian 私有配置和其他凭据不得提交到这里。私有内容仓库也不得改成 public。
