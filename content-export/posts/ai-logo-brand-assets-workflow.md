---
title: 我用 AI + 命令行，零设计软件做了一套频道品牌素材
slug: ai-logo-brand-assets-workflow
status: published
date: 2026-03-26
updated: 2026-03-26
summary: 用 Gemini 生成 logo 概念图，再用 ImageMagick 命令行裁切、去背、批量生成全平台品牌素材。零设计软件，全程命令行完成。
categories:
  - 技术分享
tags:
  - AI
  - 工具
  - 教程
  - Linux
  - 图片
cover: https://hyphentech.top/obsidian-assets/ai-logo-brand-assets-workflow/image-01-9a7b151514.png
legacy_paths: []
---

---

> 【让普通人也能驾驭 AI】欢迎访问我们的网站              
> **网站**：[**https://hyphentech.top**](https://hyphentech.top/)

---

频道改名「黑粉科技 HyphenTech」之后，第一件事就是做一套全新的品牌素材：头像、YouTube Banner、B站横幅……

我不会 Photoshop，也没装 Figma。整个过程只用了两样东西：**Gemini（生成概念图）** 和 **ImageMagick（命令行裁切合成）**。

这篇文章完整记录了从 AI 出图到全平台素材落地的全过程，包括中间踩的坑。

### 最终效果

最终的 HTI 图标已经部署到了 YouTube、B站和微信公众号，三个平台的品牌视觉完全统一：

#### YouTube 频道

![YouTube 频道页](https://hyphentech.top/obsidian-assets/ai-logo-brand-assets-workflow/image-01-9a7b151514.png)

#### 微信公众号

![WeChat 公众号设置页](https://hyphentech.top/obsidian-assets/ai-logo-brand-assets-workflow/image-02-937b6f6fa2.png)

#### B站空间

![B站空间页](https://hyphentech.top/obsidian-assets/ai-logo-brand-assets-workflow/image-03-c934946690.png)

#### 最终素材文件

![Avatar 800×800](https://hyphentech.top/obsidian-assets/ai-logo-brand-assets-workflow/image-04-6243cbf9d1.png)

![YouTube Banner 2560×1440](https://hyphentech.top/obsidian-assets/ai-logo-brand-assets-workflow/image-05-9d7cdfc351.png)

> 全部由同一张 AI 生成的源图衍生而来。

### Step 1：用 Gemini 生成 Logo 概念图

#### 提示词

我给 Gemini 的提示词大致如下：

```javascript
Design a modern, minimalist logo for a tech YouTube channel called "黑粉科技" (HyphenTech).
- Letters "HTI" as the main icon mark, styled as bold italic parallelograms (≈11° shear)
- Color scheme: cyan (#2DD4BF) for letters, amber (#FBAB18) dot between T and I
- Dark background (#1A2332)
- Clean, geometric, suitable for avatars and banners
```

#### 迭代过程：生了几十张才挑到一张

AI 生成 logo 的最大问题是**不可控**。同一个提示词跑十次，出来十种完全不同的形状。

我前前后后生成了大概 **30+ 张**概念图，涵盖了各种变体——有的字母比例不对，有的倾斜角度太大，有的风格偏卡通。最终从中挑出一张形状最接近预期的作为源图。

![Gemini 迭代过程 1](https://hyphentech.top/obsidian-assets/ai-logo-brand-assets-workflow/image-06-cd68a95e8e.jpg)

![Gemini 迭代过程 2](https://hyphentech.top/obsidian-assets/ai-logo-brand-assets-workflow/image-07-be0a683164.jpg)

> **经验**：AI 生成的 logo 是位图，不可能直接当矢量用，但形状可以作为基础。与其反复调整提示词追求完美，不如多生成、快速筛选。

#### 其他 AI 工具也可以

Gemini 之外，DALL-E 3、Ideogram、Midjourney 都可以生成概念图。Ideogram 的文字渲染相对更准确，如果 logo 中有文字元素可以优先试试。

### Step 2：ImageMagick 裁切与去背

选定源图后，接下来全部在命令行完成。

#### 安装 ImageMagick

```bash
# Arch Linux
sudo pacman -S imagemagick

# Ubuntu/Debian
sudo apt install imagemagick

# macOS
brew install imagemagick
```

#### 裁切 Logo 区域

从 AI 生成的大图中，裁切出仅包含 logo 图标的区域：

```bash
magick source.png -crop 1900x1000+430+10 +repage logo-crop.png
```

> 宁可裁大不裁小，后面会自动 trim。

#### 去除背景（透明化）

AI 生成的图片背景不是纯色，有微妙的光照渐变。用 floodfill 从四个角灌入透明色：

```bash
magick logo-crop.png \
  -alpha set \
  -fuzz 25% \
  -fill none \
  -draw "color 0,0 floodfill" \
  -draw "color 1899,0 floodfill" \
  -draw "color 0,999 floodfill" \
  -draw "color 1899,999 floodfill" \
  -trim +repage \
  logo-transparent.png
```

> [!note]
> **为什么用 floodfill 而不是 -transparent？**
> `-transparent "#1A2332"` 只能按颜色精确匹配，会漏掉渐变区域。floodfill 从边角向内扩散，能自然跟随渐变边界，适合 AI 生成图的特点。

> [!note]
> **-fuzz 参数调节指南**
> 15%：保守，可能留残影
> 25%：推荐起点（多数 AI 生成图的甜点值）
> 35%：激进，可能吃掉深色细节

### Step 3：批量生成全套品牌素材

有了透明背景的 logo 源文件，就可以批量生成所有平台需要的素材。

#### 头像（800×800）

```bash
magick -size 800x800 xc:"#1A2332" \
  \( logo-transparent.png -resize 580x \) \
  -gravity center -geometry +0-30 -composite \
  avatar-800x800.png
```

#### YouTube Banner（2560×1440）

YouTube 横幅在不同设备上可见区域差异很大。**所有关键内容必须在手机安全区（1546×423 居中）内**：

```bash
magick -size 2560x1440 xc:"#1A2332" \
  \( logo-transparent.png -resize x260 \) \
  -gravity center -geometry -280+0 -composite \
  -gravity center \
  -font "Noto-Sans-CJK-SC" -pointsize 72 -fill "#F4F4F3" -kerning 10 \
  -annotate +180-30 "黑粉科技" \
  -font "Inter" -pointsize 30 -fill "#F4F4F3" -kerning 6 \
  -annotate +180+30 "HYPHENTECH" \
  -font "Noto-Sans-CJK-SC" -pointsize 22 -fill "#9CA3AF" \
  -annotate +180+75 "让普通人也能驾驭 AI" \
  banner-youtube-2560x1440.png
```

验证安全区可以画参考线检查：

```bash
magick banner-youtube-2560x1440.png \
  -strokewidth 2 \
  -stroke "#FF4444" -fill none -draw "rectangle 507,508 2053,931" \
  -stroke "#FBAB18" -fill none -draw "rectangle 352,508 2207,931" \
  -stroke "#2DD4BF" -fill none -draw "rectangle 0,508 2560,931" \
  banner-safezone-check.png
```

> 红色=手机安全区，琥珀色=平板，青色=桌面。

#### B站 Banner（2048×320）

```bash
magick -size 2048x320 xc:"#1A2332" \
  \( logo-transparent.png -resize 170x \) \
  -gravity north -geometry +0+15 -composite \
  -gravity center \
  -font "Noto-Sans-CJK-SC" -pointsize 40 -fill "#F4F4F3" -kerning 8 \
  -annotate +0+62 "黑粉科技" \
  -font "Inter" -pointsize 18 -fill "#F4F4F3" -kerning 6 \
  -annotate +0+100 "HYPHENTECH" \
  banner-bilibili-2048x320.png
```

### Step 4：一键脚本

整个流程可以串成一个 Bash 脚本，修改变量即可复用：

```bash
#!/bin/bash
# generate-brand-assets.sh
set -e

SOURCE="$1"
BG_COLOR="${2:-#1A2332}"
BRAND_CN="黑粉科技"
BRAND_EN="HYPHENTECH"
SLOGAN="让普通人也能驾驭 AI"

# ... 裁切 → 去背 → 生成头像 → 生成 banner
# 完整脚本见文末
```

### 踩坑记录

#### 坑 1：SVG trace 路线（失败）

最初尝试用 potrace 将位图 trace 成 SVG 矢量路径。虽然形状大致对，但 AI 生成图有光照渐变和抗锯齿，trace 出的边缘不够锐利，字母间的缝隙和倾斜角度有微妙偏差。反复手调坐标效率极低。

**结论**：除非有干净的黑白矢量输入，否则直接裁切 PNG 更靠谱。

#### 坑 2：字体问题

ImageMagick 的 `-font` 需要系统上安装的字体名。没有中文字体时需要额外安装：

```bash
# Arch
sudo pacman -S noto-fonts-cjk
# Ubuntu
sudo apt install fonts-noto-cjk
```

查看可用字体：`magick -list font | grep -i "noto\\|inter"`

#### 坑 3：-fuzz 参数

这个参数控制颜色匹配的容忍度。太小（\<15%）背景残留，太大（\>35%）logo 深色部分被误删。25% 是多数 AI 生成图的最佳起点。

### 最终产物清单

| 文件 | 尺寸 | 用途 |
| --- | --- | --- |
| logo-transparent.png | ~930×830 | 透明背景源 logo |
| avatar-800.png | 800×800 | YouTube/B站/GitHub 头像 |
| banner-youtube.png | 2560×1440 | YouTube 频道横幅 |
| banner-bilibili.png | 2048×320 | B站空间横幅 |
| logo-icon-380.png | 380px 宽 | 网页/文档/水印 |
| logo-icon-32.png | 32px 宽 | Favicon |

### 总结

这套工作流的核心思路是：**让 AI 负责创意（形状），让命令行负责工程（裁切、合成、批量生成）**。

对于个人创作者来说，不需要学 Photoshop 或 Figma，一个 AI 工具 + 一行 ImageMagick 命令就能搞定全平台品牌素材。整个过程可复现、可脚本化，下次改名或调色只需要改几个变量。

---

> 黑粉科技 | [hyphentech.top](http://hyphentech.top/) | 让普通人也能驾驭 AI
