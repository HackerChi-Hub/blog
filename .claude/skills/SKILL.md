# Blog封面管理技能

## 技能概述
Blog文章封面从创建、存储、推送到Notion同步的完整管理流程。

## 使用场景
- 创建新文章时需要封面设计
- 更新现有文章封面
- 排查封面显示问题
- 批量管理封面资源

## 操作流程

### 🎨 步骤1: 封面创建
```bash
# 使用Flux生成封面（示例）
flux generate --prompt "M5 Pro本地AI评测封面，深色背景，红色强调" \
  --output /Volumes/BigDisk/通用素材/图片素材/blog-covers/[文章名]-cover.png \
  --width 1200 --height 630
```

### 📁 步骤2: 文件存储
```bash
# 主存储位置（Blog项目）
cp /Volumes/BigDisk/通用素材/图片素材/blog-covers/[封面].png \
   /Volumes/BigDisk/Scripts/02-多媒体处理/blog/public/images/[封面].png

# 备份存储（通用素材库）
# 文件已在步骤1创建
```

### 🚀 步骤3: Git推送
```bash
cd /Volumes/BigDisk/Scripts/02-多媒体处理/blog

# 添加封面文件
git add public/images/[封面].png

# 提交更改
git commit -m "feat: add [文章名] article cover"

# 推送到GitHub（触发自动部署）
git push origin main
```

### 🌐 步骤4: URL验证
```bash
# 验证图片可访问
curl -I "https://raw.githubusercontent.com/HackerChi-Hub/blog/main/public/images/[封面].png"

# 预期结果: HTTP 200, content-type: image/png
```

### 📝 步骤5: Notion同步
1. 打开Notion文章页面
2. 点击封面区域 → "更换封面"
3. 选择"链接"
4. 粘贴URL: `https://raw.githubusercontent.com/HackerChi-Hub/blog/main/public/images/[封面].png`
5. 等待5-10分钟让Notion刷新缓存

## 常用命令

### 检查封面状态
```bash
# 查看Blog项目中的封面文件
ls -lh /Volumes/BigDisk/Scripts/02-多媒体处理/blog/public/images/

# 查看通用素材库中的封面文件
ls -lh /Volumes/BigDisk/通用素材/图片素材/blog-covers/

# 验证GitHub图片URL
curl -I "https://raw.githubusercontent.com/HackerChi-Hub/blog/main/public/images/[封面].png"
```

### 批量管理
```bash
# 查找所有封面文件
find /Volumes/BigDisk/Scripts/02-多媒体处理/blog/public/images/ -name "*-cover.png"

# 检查封面文件大小（应该是100-200KB）
du -h /Volumes/BigDisk/Scripts/02-多媒体处理/blog/public/images/*-cover.png
```

## 故障排除

### 问题1: 图片显示404
**症状**: Notion或Blog中封面无法加载

**解决方案**:
```bash
# 1. 检查Blog仓库是否公开
gh repo view HackerChi-Hub/blog --json visibility

# 2. 确认文件已推送到GitHub
git ls-files | grep "[封面].png"

# 3. 验证URL可访问
curl -I "https://raw.githubusercontent.com/HackerChi-Hub/blog/main/public/images/[封面].png"
```

### 问题2: Git推送失败
**症状**: `git push origin main` 失败

**解决方案**:
```bash
# 1. 检查SSH连接
ssh -T git@github.com

# 2. 验证代理配置
cat ~/.ssh/config | grep "ProxyCommand"

# 3. 测试SSH代理端口
lsof -i :7897
```

### 问题3: Notion封面不更新
**症状**: URL已更新但Notion仍显示旧封面

**解决方案**:
1. 清除浏览器缓存
2. 在Notion中重新添加封面URL
3. 等待5-10分钟让CDN刷新
4. 尝试使用无痕模式打开文章

## 规范要求

### 封面规格
- **尺寸**: 1200x630 像素（推荐）
- **格式**: PNG（支持透明背景）
- **大小**: 100-200 KB
- **命名**: `[文章关键词]-cover.png`

### URL格式
```
https://raw.githubusercontent.com/HackerChi-Hub/blog/main/public/images/[文件名]
```

### 命名示例
- `m5-pro-local-ai-cover.png`
- `token-pricing-cover.png`  
- `alphaevolve-cover.png`

## 相关文档
- [Blog封面问题解决方案](memory/blog_cover_issue_resolution.md)
- [Blog项目README](../README.md)
- [素材管理规则](../ASSET-MANAGEMENT.md)

## 快速参考

### 标准封面URL模板
```
https://raw.githubusercontent.com/HackerChi-Hub/blog/main/public/images/{{cover_file}}
```

### 本地路径模板
```
Blog项目: /Volumes/BigDisk/Scripts/02-多媒体处理/blog/public/images/{{cover_file}}
素材库: /Volumes/BigDisk/通用素材/图片素材/blog-covers/{{cover_file}}
```

### Git提交模板
```bash
git add public/images/{{cover_file}}
git commit -m "feat: add {{article_name}} article cover"
git push origin main
```

---
**技能类型**: Blog管理  
**适用项目**: HackerChi-Hub/blog  
**维护者**: Claude Code  
**最后更新**: 2026-05-17