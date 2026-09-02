---
title: 用Remotion + Claude Code从零做一个AI视频
slug: remotion-claude-code-prompt-to-video-guide
status: published
date: 2026-03-24
updated: 2026-03-24
summary: 一篇面向开发者的Remotion实战指南。完整覆盖环境搭建、Agent Skills安装、提示词框架设计、核心API详解（useCurrentFrame/interpolate/spring/Sequence）、主题注入系统、渲染与导出等全部技术细节。附带多个可直接套用的提示词模板。
categories:
  - 技术分享
tags:
  - AI
  - 视频
  - 工具
  - 教程
  - 人工智能
  - 前端
  - 编程
cover: https://hyphentech.top/obsidian-assets/remotion-claude-code-prompt-to-video-guide/image-01-02636e804c.png
legacy_paths: []
---

---

![文章配图 1](https://hyphentech.top/obsidian-assets/remotion-claude-code-prompt-to-video-guide/image-01-02636e804c.png)

> **黑粉科技** — 让普通人也能驾驭 AI。掌握 AI 的人，将成为各个领域的王者。

> 

> 官网：[**https://hyphentech.top**](https://hyphentech.top/)

> [!note]
> 这是一篇**精确到代码行的实战指南**。不是概念科普，不是工具列表——而是一套完整的「提示词 → React代码 → MP4视频」管线。读完并跟着操作，你就能用自然语言描述生成专业级的动态视频。

---

## 为什么是Remotion，而不是其他AI视频工具？

Veo、Sora等AI视频工具擅长「无中生有」——你描述一个场景，它生成一段实拍风格的视频。但它们有三个根本问题：输出不可控、不可复现、不可参数化。

Remotion走的是另一条路：**视频 = React组件 + 时间轴**。你写的每一行JSX、每一个CSS属性，都会被逐帧渲染成真实的MP4视频。同样的代码、同样的参数，永远产出完全一样的结果。

而2026年初 Remotion发布的**Agent Skills**，让这整个流程发生了质变：你不再需要手写代码，而是用自然语言提示词告诉Claude Code你想要什么，它来生成正确的Remotion代码，你在Studio中实时预览，满意后一键渲染成MP4。

这就是本文要讲的完整管线：**提示词 → 预览 → 调整 → 渲染**。

---

## 第一部分：环境搭建

### 1.1 前置条件

确保你的机器上有以下工具：

Node.js 16+（推荐 Node 20 LTS）、npm 或 bun、一个代码编辑器（VS Code推荐）、Claude Code（命令行工具）

### 1.2 初始化Remotion项目

```javascript
# 方法一：用npm
bun create video
# 或
npm init video

cd my-video
npm start
# 浏览器打开 localhost:3000 即可RemotionStudio预览
```

创建完成后，项目结构如下：

```javascript
my-video/
├── src/
│   ├── Root.tsx          # 注册所有Composition
│   ├── Composition.tsx   # 主视频组件
│   └── index.ts          # 入口文件
├── public/               # 静态资源（图片、音频、字体）
├── package.json
└── remotion.config.ts
```

### 1.3 安装Agent Skills（核心步骤）

这是让Claude Code「理解」Remotion的关键一步：

```javascript
npx skills add remotion-dev/skills
```

运行后，你会看到项目中出现：

```javascript
.claude/skills/remotion-best-practices/
├── SKILL.md              # 主入口文件
└── rules/
    ├── animations.md     # 动画最佳实践
    ├── audio.md          # 音频处理规则
    ├── compositions.md   # Composition结构规范
    ├── fonts.md          # 字体加载
    ├── subtitles.md      # 字幕处理
    └── 3d.md             # Three.js集成
```

Agent Skills本质是一组Markdown规则文件。Claude Code启动时会自动扫描并加载这些规则，从此它就能用正确的Remotion API模式生成代码，而不是用通用的Web动画方式来凑合。

> [!note]
> **没有Agent Skills的Claude Code会怎样？** 它会试图用CSS transitions和setTimeout做动画——这些在浏览器里能跑，但在Remotion的逐帧渲染中会完全崩溃。安装Skills后，Claude会改用`interpolate()`、`spring()`和基于帧的时间控制，这才是Remotion的正确姿势。

---

## 第二部分：Remotion核心概念速览

在写提示词之前，你需要理解Remotion的四个核心抽象。即使你让Claude写代码，理解这些概念会让你的提示词质量暴增。

### 2.1 Composition——视频的「画布」

每个视频是一个`\<Composition\>`，定义了宽高、帧率、总时长和渲染的React组件：

```typescript
<Composition
  id="MyVideo"
  component={MyVideoComponent}
  width={1920}
  height={1080}
  fps={30}
  durationInFrames={300}  // 300帧 ÷ 30fps = 10秒
/>
```

关键点：**Remotion中的时间单位是「帧」而不是「秒」**。扂30fps时，1秒=30帧，3秒=90帧。

### 2.2 useCurrentFrame()——时间的唯一真相

这是Remotion最重要的Hook。它返回当前帧号（从0开始），所有动画都必须基于这个值来驱动：

```typescript
import { useCurrentFrame } from 'remotion';

const frame = useCurrentFrame();  // 第0帧返回0，第30帧返回30...
const opacity = Math.min(1, frame / 30);  // 前1秒淡入
```

> [!note]
> **切记**：所有动画必须由`useCurrentFrame()`驱动。Remotion渲染时会随机跳到任意帧号拍截图，如果你用CSS transition或setTimeout，每一帧的状态都是不确定的，会导致画面闪烁和跳帧。

### 2.3 interpolate()——万能映射函数

将一个数值范围映射到另一个数值范围。这是Remotion动画的基石：

```typescript
import { interpolate, useCurrentFrame } from 'remotion';

const frame = useCurrentFrame();

// 前20帧：透明度0→1，之后保持为1
const opacity = interpolate(
  frame,
  [0, 20],           // 输入范围（帧号）
  [0, 1],            // 输出范围（透明度）
  { extrapolateRight: 'clamp' }  // 超出范围后锁定为1
);

// 多段插值：淡入 → 保持 → 淡出
const opacity2 = interpolate(
  frame,
  [0, 20, 80, 100],  // 四个关键帧
  [0, 1,  1,  0]     // 对应透明度
);
```

### 2.4 spring()——物理动画引擎

比`interpolate`的线性插值更自然。默认从0到1，带有微小的回弹超调：

```typescript
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const scale = spring({
  frame,
  fps,
  config: {
    mass: 1,        // 质量，越小越快
    damping: 10,    // 阻尼，越大越不弹
    stiffness: 100, // 刚度，越大越「脏」
  },
});

// 用spring值驱动位移
const x = interpolate(scale, [0, 1], [0, 200]);
```

### 2.5 Sequence——场景编排

`\<Sequence\>`用于时间偏移，让子组件在指定时刻开始：

```typescript
import { Sequence } from 'remotion';

// 场景1：第0-90帧（3秒）
<Sequence from={0} durationInFrames={90}>
  <Scene1 />
</Sequence>

// 场景2：第90-180帧（接上3秒）
<Sequence from={90} durationInFrames={90}>
  <Scene2 />
</Sequence>
```

关键：Sequence内部的`useCurrentFrame()`是相对的——Scene2中的frame 0实际是全局的frame 90。

---

## 第三部分：提示词框架——如何跟Claude Code对话

现在进入核心环节。安装好Agent Skills后，你在项目目录下启动Claude Code，然后用提示词生成视频。

### 3.1 基础提示词结构

一个有效的Remotion提示词应包含以下要素：

```javascript
创建一个[X秒]的视频。

场景描述：[...详细描述每个场景的内容]
动画风格：[干净/进攻/柔和/赛博朋克...]
色调：[主色+辅色+背景色]
分辨率：[1920x1080 / 1080x1920竖屏]
帧率：[30fps]
```

### 3.2 第一层：快速原型提示词

适合快速验证效果，5分钟出片：

> [!note]
> 创建一个5秒的视频。深蓝色背景（#0F1923），白色文字“欢迎来到黑粉科技”从中间淡入，保持两秒，然后向左滑出。使用spring动画使过渡流畅自然。

### 3.3 第二层：多场景结构化提示词

适合有明确分镜的视频：

> [!note]
> 创建一个15秒的产品介绍视频，1920x1080，30fps。
> 
> 场景1（0-3秒）：Logo从粒子中凝聚成型，带spring回弹效果。背景深色，logo发光。
> 
> 场景2（3-9秒）：依次展示三个功能特点，每个占时约2秒。图标从左侧滑入，文字从右侧淡入。使用stagger动画（每个延迟10帧）。
> 
> 场景3（9-15秒）：CTA“立即体验”按钮动画出现，带周期性脉冲光晕效果。[底部显示hyphentech.top](http://xn--hyphentech-uj0tm94efn0d0j1d.top/)。
> 
> 配色方案：背景#0F1923，主色#13C2C2（cyan），强调#FFB300（amber）。
> 
> 字体：Noto Sans SC。

### 3.4 第三层：带技术约束的专业提示词

当你对Remotion API有了理解后，可以直接在提示词中指定技术细节：

> [!note]
> 创建一个10秒的YouTube频道片头，30fps，1920x1080。
> 
> 技术要求：
> 
> - 使用AbsoluteFill作为每个场景的容器
> 
> - 用Sequence组件编排三个场景
> 
> - 所有动画用spring()而不是线性插值，damping:12，stiffness:100
> 
> - 将配色方案抽成CSS变量（--bg, --cyan, --amber）
> 
> - Logo图片从public/logo.png加载，用staticFile()引用
> 
> - 导出为独立组件，便于复用
> 
> 场景设计：
> 
> 场景1：暗场中，网格背景淡入，logo带scale spring动画出现。
> 
> 场景2：终端风格的打字机动画，逐字显示频道名称。
> 
> 场景3：所有元素汇聚，显示最终logo+口号+网址。

---

## 第四部分：完整工作流实战

### 4.1 提示词 → 预览 → 迭代循环

实际工作流如下：

**步骤1**：在项目根目录启动Claude Code，输入提示词。Claude会生成/修改`.tsx`文件。

**步骤2**：在已运行的Remotion Studio（[localhost:3000](http://localhost:3000/)）中实时查看效果。得益于React Fast Refresh，代码保存后预览自动更新。

**步骤3**：不满意？继续对Claude说「这里改一下」：

> [!note]
> 场景2的打字机速度太快了，每个字符的间隔改为4帧。另外加一个闪烁的光标效果。

> [!note]
> 场景1的logo出现太突兀了，给spring加上`damping: 8`让它多弹几下。

> [!note]
> 给整个视频加上背景音乐，用public/[bgm.mp](http://bgm.mp/)3，从场景1开始播放，在最后1秒淡出。

### 4.2 资源管理

Remotion中的静态资源放在`public/`目录，用`staticFile()`引用：

```typescript
import { Img, Audio, staticFile } from 'remotion';

// 加载图片
<Img src={staticFile('logo.png')} />

// 加载音频
<Audio src={staticFile('bgm.mp3')} />

// 加载视频素材
<OffthreadVideo src={staticFile('background.mp4')} />
```

推荐的`public/`目录结构：

```javascript
public/
├── images/       # logo、截图、背景图
├── audio/        # BGM、音效
├── videos/       # 视频素材
└── fonts/        # 自定义字体
```

### 4.3 音频集成详解

```typescript
import { Audio, Sequence, staticFile, interpolate, useCurrentFrame } from 'remotion';

// 基础音频
<Audio src={staticFile('audio/bgm.mp3')} />

// 带淡出的BGM
const AudioWithFade = () => {
  const frame = useCurrentFrame();
  const volume = interpolate(
    frame,
    [0, 30, 270, 300],  // 第0-1秒淡入，第9-10秒淡出
    [0, 0.8, 0.8, 0]
  );
  return <Audio src={staticFile('audio/bgm.mp3')} volume={volume} />;
};
```

---

## 第五部分：主题注入系统——让视频风格可复用

如果你要做系列视频，就需要一套一致的视觉风格。最佳实践是抽CSS变量成主题文件：

```typescript
// src/themes/darkCinema.ts
export const darkCinema = {
  bg: '#0F1923',
  surface: '#141E2B',
  card: '#1A2736',
  cyan: '#13C2C2',
  amber: '#FFB300',
  text: '#E8EDF2',
  textDim: '#7B8FA3',
  fontFamily: 'Noto Sans SC, sans-serif',
  fontMono: 'JetBrains Mono, monospace',
};
```

在提示词中引用主题：

> [!note]
> 使用项目中已有的`darkCinema`主题配色方案。所有颜色从主题对象中读取，不要硬编码颜色值。

这样做的好处：将来换一套配色，只需改一个文件，所有视频的风格立即更新。

---

## 第六部分：渲染与导出

### 6.1 本地渲染

当你对预览满意后：

```bash
# 渲染为MP4
npx remotion render src/index.ts MyVideo out/video.mp4

# 指定编码器和质量
npx remotion render src/index.ts MyVideo out/video.mp4 --codec h264 --crf 18

# 渲染为WebM（适合Web嵌入）
npx remotion render src/index.ts MyVideo out/video.webm --codec vp8

# 只渲染静态帧（用作封面图）
npx remotion still src/index.ts MyVideo out/thumbnail.png --frame=45
```

### 6.2 渲染速度优化

本地渲染受CPU线程数限制。几个加速技巧：

用`--concurrency`参数设置并行渲染的浏览器实例数（默认是CPU核心数的一半）。用`--gl=angle`在Linux上启用GPU加速。对于超过1分钟的视频，考虑用Remotion Lambda部署到AWS，1分钟视频约$0.017。

### 6.3 通过提示词触发渲染

你甚至可以直接在Claude Code中完成渲染：

> [!note]
> 现在把当前视频渲染成MP4，输出到out/[final.mp](http://final.mp/)4，编码用h264，crf设为18。

---

## 第七部分：可直接套用的提示词模板库

### 🎬 YouTube频道片头

```javascript
创建一个3秒的YouTube频道片头，1920x1080，30fps。

场景：深色背景上，网格线条缓慢流动，发光的频道名logo从粒子
中凝聚成型（用spring动画，damping:10）。最终logo稳定后，底部
出现频道口号（淡入）。
色调：深蓝#0F1923底，cyan#13C2C2主色。
logo图片：public/images/logo.png
```

### 📱 竖屏短视频模板

```javascript
创建5秒竖屏视频，1080x1920，30fps。展示一个概念。

场景1(0-2秒)：大标题“你还在手动剪视频？”从下方spring弹入。
场景2(2-4秒)：标题换成“让AI帮你做”，配辅动态图标。
场景3(4-5秒)：二维码+“关注黑粉科技”。
风格：干净极简，白底黑字，cyan强调色。
```

### 📊 数据可视化视频

```javascript
创建8秒的数据统计动画视频，1920x1080，30fps。

内容：展示三个数字指标，每个用spring动画从0滚到目标值。
指标数据：
- 用户数：128,000
- 视频播放量：2,450,000
- 平均观看时长：4.2分钟

用stagger动画，每个指标比前一个晚15帧出现。
数字滚动用Math.floor(interpolate(spring, [0,1], [0, targetValue]))实现。
每个指标带一个微妙的底部进度条动画。
风格：深色背景，cyan强调色。
```

### 💻 终端打字机动画

```javascript
创建6秒的终端风格代码打字动画，1920x1080，30fps。

模拟终端界面：深色背景，绿色等宽字体。
逐字符显示以下内容：
$ npx create-video my-project
✓ Created project successfully
$ cd my-project && npm start
✓ Studio running at localhost:3000

每个字符间隔3帧，行间间隔15帧。
光标用一个闪烁的方块表示，每15帧切换显示/隐藏。
打字完成后光标继续闪烁1.5秒。
```

---

## 第八部分：进阶技巧

### 8.1 提示词链——增量迭代而非一次性生成

单次提示词不要太贪心。最有效的方式是链式迭代：

第一步：“创建基础结构，先只要背景和场景切换”

第二步：“现在给场景1加上logo动画”

第三步：“场景2加入打字机效果”

第四步：“加背景音乐和淡出”

第五步：“微调时间节奏，场景1缩短0.5秒”

### 8.2 组件复用

当你积累了几个视频后，告诉Claude抽取可复用组件：

> [!note]
> 把当前的打字机动画抽取成一个通用组件 TypewriterText，接受props：
> 
> - text: string — 要显示的文字
> 
> - charDelay: number — 每个字符的帧间隔
> 
> - cursorBlink: boolean — 是否显示闪烁光标
> 
> - color: string — 文字颜色
> 
> 放到src/components/目录下。

### 8.3 参数化视频——批量生产

Remotion的杀手锧是参数化。你可以通过inputProps传入不同数据，用同一套模板批量生成不同内容的视频：

```bash
# 传入不同props渲染不同版本
npx remotion render src/index.ts MyVideo out/ep01.mp4 \
  --props='{"title":"第1期","topic":"AI视频生成"}'

npx remotion render src/index.ts MyVideo out/ep02.mp4 \
  --props='{"title":"第2期","topic":"Remotion实战"}'
```

这意味着你可以用一个脚本自动生成整个系列的片头、片尾、过场动画。

### 8.4 Stills——用视频代码生成封面图

Remotion的一个隐藏功能：用同一套代码生成视频封面图。视频设计更新时，封面自动同步更新：

```typescript
import { Still } from 'remotion';

// 在Root.tsx中注册
<Still
  id="Thumbnail"
  component={ThumbnailComponent}
  width={1280}
  height={720}
/>
```

然后用命令导出：

```bash
npx remotion still src/index.ts Thumbnail out/thumbnail.png
```

---

## 第九部分：常见问题与避坑指南

**问题1：Claude生成的动画在渲染后闪烁或丢帧**

原因：用了CSS transition或setTimeout而不是useCurrentFrame。解决：确保Agent Skills已安装，并在提示词中明确要求“所有动画必须基于useCurrentFrame驱动”。

**问题2：复杂动画元素位置不对**

解决：保持简单。一次只做一个简单的动画概念，迭代叠加。不要试图一次提示词生成复杂的多层叠加动画。

**问题3：字体在渲染时缺失**

解决：用Remotion内置的Google Fonts加载器，或把字体文件放到public/fonts并用@font-face加载。

**问题4：渲染耗时太长**

解决：降低分辨率做测试（先用960x540），最终版本再用全分辨率。另外确认没有使用未优化的大图片。

---

## 总结：这套管线的价值

Remotion + Claude Code + Agent Skills这套组合拳的核心价值是：

**100%可复现**：同样的代码永远产出同样的视频，不像AI生成视频的随机性。

**可版本控制**：视频是代码，可以git跟踪、分支、回滚。

**可参数化批量生产**：一套模板生产整个系列的视频。

**学习曲线近乎为零**：有了Agent Skills，你甚至不需要会React，用自然语言描述就能出片。

这不是取代Premiere或After Effects——而是取代「为了做一个15秒片头而打开一个巨无霸的软件」这件事。

---

> **黑粉科技** — 用 AI 变强

> 

> 让普通人也能驾驭 AI。掌握 AI 的人，将成为各个领域的王者。

> 

> 官网：[hyphentech.top](http://hyphentech.top/)
