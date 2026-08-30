---
title: "Obsidian 内容源验收页"
slug: obsidian-content-canary
status: published
date: 2026-08-30
updated: 2026-08-30
summary: "只用于自动化构建测试，不会连接正式内容库。"
categories:
  - 自制软件
tags:
  - Obsidian
  - Markdown
cover: /favicon-512x512.png
legacy_paths:
  - legacy-obsidian-content-canary
---

# Markdown 正文

这是 Markdown 与 Notion 双源读取层的自动化验收文章。

> [!note]
> 这段内容用于验证 Obsidian 提示块能够安全降级为网页引用块。

## 表格

| 项目 | 状态 |
| --- | --- |
| 正文 | 通过 |
| 旧网址别名 | 通过 |

## 代码

```js
const source = 'obsidian';
console.log(source);
```

内部链接：[[obsidian-content-canary|返回本页]]。
