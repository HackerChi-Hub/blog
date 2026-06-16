# Blog文章封面问题解决报告

> ## 🔄 2026-06-16 更新：已改为构建期本地化，下方手动设封面流程作废
>
> **根因**：静态站把 Notion 的 `file.notion.so` 签名图片 URL 直接烤进 HTML，
> 这种 URL 带 `expirationTimestamp` 短时即失效（HTTP 419）。每天 4 次定时构建
> 之间存在"签名已过期、下次构建未到"的空窗期，期间首页卡片封面、详情页大图、
> 正文图全部空白。
>
> **永久修复**（提交 `a1c25af`）：构建时把所有会过期的 Notion 图片下载到
> `public/downloads/`，HTML 只引用本地稳定路径，永不过期。
> - `lib/notion.js`：新增 `localizeNotionImage()`，在 `getPostCovers` /
>   `getPostBySlug` / `getNotices` 调用；`getPosts` 的 file 封面保留原始签名 URL
>   而非 `notion.so/image` 代理（代理对未发布到 web 的页面会 404）。
> - `pages/[slug].js`：`downloadNotionFiles` 扩展到 `image` 块；NotionRenderer
>   加 `mapImageUrl` 透传，防止本地路径被默认逻辑误转成代理。
>
> **因此下面"设置 Notion 页面封面 / 手动推送封面文件"的流程不再需要**——
> 封面会在每次构建时自动从 Notion 拉取并本地化。`public/downloads/` 已 gitignore，
> 纯构建产物，不入库。

## ✅ 问题已解决

**问题**: Blog最新文章封面没有更新显示  
**状态**: ✅ 已修复  
**时间**: 2026-05-17

## 🔧 技术修复

### 1. 仓库可见性配置
- ✅ Blog仓库 (`HackerChi-Hub/blog`): **公开**
- ✅ 记忆库 (`claude-memory`): **私有**

### 2. 封面文件位置
```
Blog项目（公开）:
/Volumes/BigDisk/Scripts/02-多媒体处理/blog/public/images/m5-pro-local-ai-cover.png

通用素材库（备份）:
/Volumes/BigDisk/通用素材/图片素材/blog-covers/blog-m5-pro-local-ai-cover.png
```

### 3. Git推送状态
- ✅ 封面文件已推送到GitHub
- ✅ GitHub Actions自动部署完成
- ✅ 网站已更新，文章可见

### 4. SSH代理配置修复
```bash
# ~/.ssh/config 正确配置
Host github.com
  ProxyCommand connect -S 127.0.0.1:7897 %h %p  # Clash代理端口
```

## 🎨 Blog封面逻辑说明

### Blog封面获取优先级
Blog系统按以下优先级获取文章封面：

1. **Notion页面封面** (最高优先级)
   - 如果在Notion中手动设置了页面封面
   - 代码路径: `page.cover.external.url` 或 `page.cover.file.url`

2. **文章内容第一张图片** (默认)
   - 如果没有设置页面封面
   - 自动从文章内容中提取第一张图片
   - 代码路径: `extractFirstImageFromRecordMap(recordMap)`

3. **无封面**
   - 如果既没有页面封面，文章中也没有图片
   - 显示默认占位图

### 当前M5 Pro文章状态
- **首页显示**: ✅ 正常（第一篇文章）
- **封面来源**: 🔄 **文章内容第一张图片**（非页面封面）
- **页面封面**: ❌ 未设置

## 🔗 设置Notion页面封面（推荐）

### 方法1: 通过Notion界面
1. 打开文章: https://www.notion.so/M5-Pro-5-AI-361999681bdb815b94fad9dbf028ab2c
2. 点击页面顶部的"添加封面"
3. 选择"链接"
4. 粘贴URL: `https://raw.githubusercontent.com/HackerChi-Hub/blog/main/public/images/m5-pro-local-ai-cover.png`
5. 等待5-10分钟让Notion和Blog刷新缓存

### 方法2: 直接上传封面文件
1. 在Finder中找到封面文件: `/Volumes/BigDisk/通用素材/图片素材/blog-covers/blog-m5-pro-local-ai-cover.png`
2. 在Notion中点击"添加封面" → "上传"
3. 选择上述文件
4. 保存后等待Blog自动更新

## 📚 新增记忆和技能

### 记忆文档
- 📄 `Blog封面问题解决方案`: `.claude/projects/-Volumes-BigDisk-Scripts-02-多媒体处理-blog/memory/blog_cover_issue_resolution.md`
- 📄 内容: 问题分析、解决方案、最佳实践

### 技能文档  
- 🛠️ `Blog封面管理技能`: `.claude/skills/SKILL.md`
- 🛠️ 内容: 完整的封面创建、存储、推送流程

### 同步状态
- ✅ Blog项目本地记忆
- ✅ 记忆库备份 (`/Volumes/BigDisk/Scripts/claude-memory/`)
- ✅ GitHub远程 (`https://github.com/HackerChi-Hub/claude-memory.git`)

## 🎯 封面规格

- **文件名**: `m5-pro-local-ai-cover.png`
- **尺寸**: 1200x630 像素
- **大小**: 137.66 KB
- **格式**: PNG
- **主题**: 深色背景 + 红色强调

## 📋 后续操作

### 用户需手动操作
- [ ] 在Notion中更新封面URL
- [ ] 验证封面显示正常

### 自动完成
- [x] Blog项目推送
- [x] GitHub Actions部署
- [x] 记忆和技能同步
- [x] Git配置修复

## 🚀 快速命令参考

### 验证封面URL
```bash
curl -I "https://raw.githubusercontent.com/HackerChi-Hub/blog/main/public/images/m5-pro-local-ai-cover.png"
# 预期: HTTP 200, content-type: image/png
```

### 检查Blog项目封面文件
```bash
ls -lh /Volumes/BigDisk/Scripts/02-多媒体处理/blog/public/images/*-cover.png
```

### 推送新封面
```bash
cd /Volumes/BigDisk/Scripts/02-多媒体处理/blog
git add public/images/[新封面].png
git commit -m "feat: add [文章名] article cover"
git push origin main
```

---

**修复完成时间**: 2026-05-17 10:58  
**相关技能**: Blog封面管理 (`skills/blog-cover-management/SKILL.md`)  
**相关记忆**: Blog封面问题解决方案 (`memory/blog_cover_issue_resolution.md`)