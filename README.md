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
brand_slogan: 让AI成为你的超能力
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

文章页会统一展示「让AI成为你的超能力」品牌签名；从 `article_content.json` 导入时，导入器会把宣传语写入 frontmatter 并在正文末尾补齐签名，公众号则由统一包装器渲染。

## 多语言文章

译文是一篇独立的 Markdown，frontmatter 多两项：

```yaml
lang: en                                  # zh-CN（默认，可不写）/ zh-TW / en
translation_of: localbrain-local-ai-box   # 原文的 slug
```

- 译文不进首页、分页、RSS 和相关文章列表，只从原文标题下方的语言切换进入；页面和站点地图照常生成，并互相声明 `hreflang`。
- **界面文字跟文章语言走**：分类、标签、日期、阅读时长、提示框标题、分享、留言、品牌卡、`<html lang>`、`og:locale` 都按 `lang` 显示。词典在 `lib/blog-i18n.cjs`，键是简体原文；新增界面文字要在 zh-TW / en 里补译文，`npm run test:i18n` 会逐条核对。
- 译文的「相关文章」按原文计算，并且不会把原文推荐回来；推荐里和当前页语言不同的文章会标出语言。
- **文末签名也按 `lang` 生成**：`scripts/sync-article-footer-template.js` 从 `ContentDistributor/scripts/hfkj_identity.json` 的 `i18n.<lang>` 按简体原句查译文。简体文案（包括产品状态）改了而译文没跟上时，同步直接报错、`blog-push` 停下，不会印出过期译文或混进简体。
- 译文的分类和标签只用于显示，写成那种语言即可。
- `verify-export` 逐页核对 `<html lang>`，并检查译文页界面里有没有残留的简体短语。

## 常用命令

```bash
npm install

# 校验私有 Obsidian 内容库
npm run content:check

# 生成只含已发布文章的公开快照，并同步稳定素材
npm run content:sync

# 回归测试：草稿隔离、删除、素材裁剪、幂等与失败回滚，以及多语言界面与签名
npm run test:content

# 按正式部署模式构建
BLOG_CONTENT_DIR=./content-export npm run build

# 检查导出文章、历史网址、sitemap、临时签名链接、页面语言与译文页界面文字
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

## 英文版：机器翻译

`scripts/translate-posts.js` 用 Azure 认知服务把简体文章机翻成英文版
（`<slug>-en.md`，`lang: en` + `translation_of`）。文章页顶部已有的语言切换条会
自动出现「English」，不需要额外加按钮。

**`blog-push` 每次发布会自动翻新文章与改动过的文章**（插在签名刷新之前）。
翻译失败不阻塞中文发布；失败的那篇不会写出文件，下次 `blog-push` 自动重试。

```bash
node scripts/translate-posts.js --list           # 看哪些待翻、哪些被跳过及原因
node scripts/translate-posts.js --slug <slug>    # 翻一篇
node scripts/translate-posts.js --all            # 全部待翻的
node scripts/translate-posts.js --all --dry-run  # 跑完整流程但不调 API、不写盘
node scripts/test-translate-posts.js             # 回归测试（不调 API）
```

凭据 `AZURE_TRANSLATOR_KEY` / `AZURE_TRANSLATOR_REGION` 在 `~/.zshenv`，不入库。

### 几条硬规则

- **只覆盖自己生成的译文。** 机翻产物带 `translation_source: machine`，没有这个标记
  的（人工精翻）一律跳过。白名单而不是黑名单：漏标只是不翻，不会被吃掉。
- **代码不翻。** 围栏代码块整块跳过；行内代码、链接与图片地址、`![`/`](` 这些语法
  标记在送翻译前换成 `⟦N⟧` 占位符。签名区块也不翻，翻完用签名模板的
  `renderFooter(identity, 'en')` 整块替换成人工维护的英文版。
- **产品名直接换成英文名送翻译**（`黑粉录屏`→`HyphenScreen`），不用占位符——
  否则翻译器看不到主语，会译出「HyphenScreen There is…」。译名表在 `TERMS`，
  发现新的机器会译错的软件名（如「达芬奇」被译成人名）就往里加。
- **整行翻译失败自动降级。** 一行译完若占位符被吞、产品名少了、或还剩汉字，就把这
  一行按占位符和产品名切开，只把纯中文片段送去翻译再拼回——受保护的东西不经过翻译器，
  吞不掉。代价是这一行失去整句上下文。不能靠重试：Azure 对同样输入的输出是确定的。
  降级的行会在输出里列出来。
- **送翻译前中英交界补空格**（「上游PR #28133尚未合并」→「上游 PR #28133 尚未合并」），
  否则翻译器会把 `#28133尚未合并` 当一个编号原样留下。**输出前全角标点转半角**，在还原
  占位符之前做，所以行内代码里的全角标点（常是文章在讨论的原话）原样保留。
- **三道校验，任一不过整篇失败、不产出残缺译文**：占位符一个不少、Markdown 结构
  （图片/链接/代码块/标题/表格行数）逐项一致、产品名一处不丢。失败报错精确到行。
- **产物审计** `node scripts/audit-translations.js`：对所有机翻文件查代码块逐字节、
  图片地址、重复拼接的域名、残留汉字与全角标点（行内代码除外）、签名与机翻声明，
  并核对人工译文没被改动。
- **原文改了会重译**：译文记 `source_sha256`，对不上就重翻。
- 顶部固定一行机翻声明，带回链到中文原文。

### 速率

免费层（F0）是每小时 200 万字符，但要求**均匀消耗**——约 33,300 字符/分钟，
短时间发太多就 429。脚本按 30,000/分钟主动限速，撞到 429 还会退避重试。
全站 78 万字符的全量翻译因此至少要 25 分钟左右，这是免费层的硬限制。
日常 `blog-push` 只翻新文章，几秒到一分钟。

### 质量

技术说明文翻得不错；口语化长句会生硬，网络梗会被直译（「东半球最好」→
"in the Eastern Hemisphere"）。重要文章值得人工改标题——改完把
`translation_source` 那行删掉，它就变成人工译文，以后不会被覆盖。

## 文章底部赞助卡片

组件 `components/SponsorCard.js` + `styles/sponsor.css`，二维码在
`public/images/site/sponsor-wechat.png`。排在「分享」之后、「相关文章」之前——
后者是引导离开的入口，过了它注意力就转移了。

静态区块，不做浮层弹窗、不给关闭按钮、不记录谁看了谁扫了。

**移动端单独给了一条路径**：手机读者看到的码就在自己屏幕上，没法用同一部手机扫，
所以提示是「长按保存图片，用微信扫一扫从相册选取」。两句提示都在 DOM 里，由 CSS
媒体查询切换——静态导出下按设备改 DOM 会造成首屏与水合后不一致。

### 换码或改文案时

- 文案走 i18n：改 `SponsorCard.js` 里的 `t('…')` 后，必须在 `lib/blog-i18n.cjs`
  的 `zh-TW` 与 `en` 两段同步增删，否则 `npm run test:content` 里的多语言闸会拦。
  新增组件还要登记进 `scripts/test-blog-i18n.js` 的 `SOURCES` 白名单，不然扫描器
  看不到 `t()` 调用，会把新词条判成死词条。
- **换二维码后必须验它还能扫**，不能只看图片显示出来了。压缩、缩放、CDN 重编码
  都可能在不报错的情况下毁掉码。用系统 Vision 解码并比对内容哈希：

```bash
swiftc -O scripts/qrcheck.swift -o /tmp/qrcheck && /tmp/qrcheck public/images/site/sponsor-wechat.png
```

验的对象要包括**读者屏幕上那块像素**（按实际显示尺寸截元素来解码），以及**从线上
下载回来的那一份**，不是只验本地源文件。

## 在第二台机器上看到正文配图

`blog-content/preview-assets/` 是导入器的生成物，被 Git 忽略，只存在于跑过导入器的机器上；素材真源也不是 Git 仓库。所以换一台机器 clone `blog-content` 之后，正文里的 `../preview-assets/...` 在 Obsidian 里全是断链——文字同步了，图没有。

但这批字节随本仓分发过：`public/obsidian-assets/` 里就是同步器挑出来的、正文实际引用到的那些素材，两棵树的 `<slug>/<文件名>` 结构一致。把它填充进本地预览镜像即可：

```bash
# 先看会动什么，不写盘
npm run content:fill-preview -- --dry-run

# 实际填充（默认按 blog 与 blog-content 同级查找）
npm run content:fill-preview
```

只补缺失的文件。两边同名但字节不同时一律不覆盖，只列出来等人工判断——别处机器上没有素材真源，覆盖掉就是不可恢复的丢失。两个仓不同级时用 `--target` 指定 `preview-assets` 的位置。

## 留言功能

文章底部的留言区由一个 Cloudflare Worker + D1 提供，挂在主站同域路由
`hyphentech.top/api/comments*` 上。站点本身仍是静态导出：留言在客户端拉取，
增减留言不需要重新构建，发布链一行都不用改。

匿名留言（填昵称即可）+ Cloudflare Turnstile 防机器人，发出即显示、事后可隐藏。

日常管理用全局命令 `blog-comments`（任意目录可用，口令自动从 `.env.local` 读）：

```bash
blog-comments                  # 总览 + 最近 10 条
blog-comments list 50          # 最近 50 条
blog-comments list --slug free-api-radar
blog-comments stats            # 只看统计
blog-comments hide 42          # 隐藏一条（不是删除，可 show 恢复）
blog-comments watch            # 盯新留言，有就 macOS 通知
```

全局入口的包装脚本在 `sync-toolkit/bin/blog-comments`（已入库，随 `sync-all` 同步），
`~/.local/bin/blog-comments` 是指向它的软链。换机器时只需重建软链：

```bash
ln -sf /Volumes/BigDisk/Scripts/90-基础设施/sync-toolkit/bin/blog-comments ~/.local/bin/blog-comments
```

Blog 仓不在默认位置时用 `BLOG_DIR=<blog 仓路径> blog-comments`。

本地冒烟测试（不需要 wrangler，不碰线上数据）：

```bash
npm run comments:test
```

部署步骤、密钥配置和验证方法见 [`workers/comments/README.md`](workers/comments/README.md)。

## 目录说明

```text
components/MarkdownContent.js      Markdown 正文组件
lib/content.js                     Obsidian 内容访问层
lib/markdown.js                    frontmatter、双链、callout 与路由解析
lib/blog-i18n.cjs                  文章页界面文字的 zh-TW / en 词典（键是简体原文）
pages/_document.js                 按文章语言写 <html lang>
scripts/validate-content.js        内容和历史网址校验
scripts/sync-obsidian-content.js   发布快照和素材同步器
scripts/import-article-content.js  通用 CONTENT JSON → Obsidian 草稿导入器
scripts/fill-preview-assets.js     已发布素材 → 本地预览镜像填充（第二台机器用）
scripts/comments-admin.js          留言巡查与隐藏 CLI
components/Comments.js             文章底部留言区（客户端拉取）
workers/comments/                  留言 API：Cloudflare Worker + D1
scripts/test-content-pipeline.js   内容发布故障与回归测试
scripts/test-blog-i18n.js          界面词典覆盖、签名三语渲染与缺译文报错
scripts/sync-article-footer-template.js  文末固定签名（按文章 lang 生成）
scripts/verify-export.js           构建产物验收
content-export/                    GitHub Actions 使用的已发布快照
public/obsidian-assets/            公开素材镜像
```

## 部署

日常发布只使用一个全局命令，在任意目录都能运行：

```bash
blog-push
```

需要自定义 Git 提交说明时：

```bash
blog-push "更新 <slug>"
```

不传说明时会自动使用默认发布说明。`blog-push` 是唯一正式发布命令。

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
