# Blog文章封面问题解决方案

## 问题描述
用户反馈Blog最新文章封面没有更新显示，涉及多个配置问题。

## 问题分析
1. **记忆库可见性问题**: 记忆库(`claude-memory`)被设置为私有，导致图片URL无法公开访问
2. **存储位置混淆**: 图片存储位置不明确，部分在记忆库，部分在Blog项目
3. **Git推送问题**: SSH代理配置错误，推送失败
4. **Notion封面同步**: Notion文章封面需要手动更新URL

## 解决方案

### 🗂️ **正确的文件组织**
```
Blog项目（公开）: /Volumes/BigDisk/Scripts/02-多媒体处理/blog/
├── public/images/
│   └── m5-pro-local-ai-cover.png  ← 封面存储位置

通用素材库: /Volumes/BigDisk/通用素材/图片素材/blog-covers/
└── blog-m5-pro-local-ai-cover.png  ← 原始备份

记忆库（私有）: /Volumes/BigDisk/Scripts/claude-memory/
└── （不存储公开图片资源）
```

### 🔧 **技术修复**

#### 1. 仓库可见性配置
```bash
# Blog仓库（公开）
gh repo edit HackerChi-Hub/blog --visibility public

# 记忆库（私有）
gh repo edit HackerChi-Hub/claude-memory --visibility private
```

#### 2. SSH代理配置修复
```bash
# ~/.ssh/config 正确配置
Host github.com
  Hostname github.com
  User git
  ProxyCommand connect -S 127.0.0.1:7897 %h %p  # 使用正确的Clash端口
  IdentityFile ~/.ssh/id_ed25519
```

#### 3. 封面URL规范
```
正确的公开图片URL:
https://raw.githubusercontent.com/HackerChi-Hub/blog/main/public/images/m5-pro-local-ai-cover.png
```

### 📋 **Blog封面管理流程**

#### 新文章封面创建步骤
1. **创建封面**: 使用Flux等工具生成封面（1200x630px）
2. **存储位置**: 
   - 主存储: `Blog项目/public/images/[文章名]-cover.png`
   - 备份存储: `/Volumes/BigDisk/通用素材/图片素材/blog-covers/`
3. **Git提交**:
   ```bash
   cd /Volumes/BigDisk/Scripts/02-多媒体处理/blog
   git add public/images/[封面].png
   git commit -m "feat: add [文章名] article cover"
   git push origin main
   ```
4. **Notion设置**: 手动在Notion中更新封面URL

#### GitHub Actions自动部署
- Blog项目推送后自动触发部署
- 部署位置: `gh-pages`分支
- 网站地址: `https://hyphentech.top`

### 🚨 **常见问题排查**

#### 图片显示404
- 检查仓库是否公开
- 确认文件路径正确
- 验证GitHub URL可访问

#### Git推送失败
- 检查SSH代理端口(7897)
- 确认SSH密钥配置
- 验证仓库权限

#### Notion封面不更新
- 清除Notion缓存
- 重新粘贴URL
- 等待5-10分钟CDN刷新

### 🎯 **最佳实践**
1. **存储分离**: 公开资源放在Blog项目，私密资料放在记忆库
2. **URL规范**: 使用`raw.githubusercontent.com`直链
3. **命名规范**: `[文章关键词]-cover.png`
4. **定期备份**: 通用素材库保持一份原始文件

### 📊 **当前封面状态**
- ✅ Blog项目已推送
- ✅ 封面文件已就位
- ✅ URL可公开访问
- ⏳ Notion封面需手动更新

---
**更新时间**: 2026-05-17  
**解决状态**: 已完成技术修复，等待Notion手动更新