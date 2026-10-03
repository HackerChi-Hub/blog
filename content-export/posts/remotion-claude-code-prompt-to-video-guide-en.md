---
title: "Create an AI video from scratch using Remotion + Claude Code"
slug: remotion-claude-code-prompt-to-video-guide-en
status: published
lang: en
translation_of: remotion-claude-code-prompt-to-video-guide
translation_source: machine
source_sha256: b63a473d4c02d72d
date: 2026-03-24
updated: 2026-10-03
summary: "A hands-on guide to Remotion for developers. Fully covers all technical details, including environment setup, Agent Skills installation, prompt framework design, core API explanations (useCurrentFrame/interpolate/spring/Sequence), theme injection system, rendering and exporting. Comes with multiple prompt templates that can be applied directly."
categories:
  - Tech
tags:
  - AI
  - Video
  - Tools
  - Tutorial
  - AI
  - Frontend
  - Programming
cover: https://hyphentech.top/obsidian-assets/remotion-claude-code-prompt-to-video-guide/image-01-02636e804c.png
brand_slogan: 
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/remotion-claude-code-prompt-to-video-guide/) is authoritative.

---

![Article Images 1](https://hyphentech.top/obsidian-assets/remotion-claude-code-prompt-to-video-guide/image-01-02636e804c.png)

> **HyphenTech** — Let AI be your superpower.

> 

> Official website: [**https://hyphentech.top**](https://hyphentech.top/)

> [!note]
> This is a **practical guide down to the line of code**. It's not a conceptual science explanation, not a list of tools—but a complete pipeline of "prompts → React code → MP4 videos." After reading and following along, you can generate professional-grade dynamic videos using natural language descriptions.

---

## Why Remotion, and not other AI video tools?

AI video tools like Veo and Sora excel at "creating something out of nothing"—you describe a scene and it generates a live-action video. But they have three fundamental issues: uncontrollable output, non-reproducible, and non-parameterizable.

Remotion takes a different approach: **Video = React component + timeline**. Every line of JSX and every CSS attribute you write is rendered frame by frame into a real MP4 video. The same code, same parameters, always produces exactly the same result.

But with the release of **Agent Skills** in early 2026, Remotion has transformed this entire process: you no longer need to write code by hand; instead, you use natural language prompts to tell Claude Code what you want, which generates the correct Remotion code. You preview it in real time in Studio and, once satisfied, render it into MP4 with one click.

This is the complete pipeline this article will cover: **Prompt → Preview → Adjust → Render**.

---

## Part One: Environment Setup

### 1.1 Prerequisites

Make sure your machine has the following tools:

Node.js 16+ (recommended Node 20 LTS), npm or bun, a code editor (VS Code recommended), Claude Code (command-line tool)

### 1.2 Initialize the Remotion project

```javascript
# 方法一：用npm
bun create video
# 或
npm init video

cd my-video
npm start
# 浏览器打开 localhost:3000 即可RemotionStudio预览
```

After creation, the project structure is as follows:

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

### 1.3 Installing Agent Skills (Core Steps)

This is a key step for Claude Code to "understand" Remotion:

```javascript
npx skills add remotion-dev/skills
```

After running, you'll see the following appear in the project:

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

Agent Skills are essentially a set of Markdown rule files. When Claude Code starts, it automatically scans and loads these rules, allowing it to generate code in the correct Remotion API mode rather than relying on generic web animations.

> [!note]
> **What happens to Claude Code without Agent Skills? ** It tries to animate with CSS transitions and setTimeout—these run in the browser but completely crash in frame-by-frame rendering in Remotion. After installing Skills, Claude switches to `interpolate()`, `spring()`, and frame-based timing control, which is the correct approach for Remotion.

---

## Part Two: Overview of Core Concepts in Remotion

Before writing prompts, you need to understand Remotion's four core abstractions. Even if you have Claude write code, understanding these concepts will greatly increase the quality of your prompts.

### 2.1 Composition—The 'Canvas' of Video

Each video is a `\<Composition\>`, defining width, frame rate, total duration, and React components for rendering:

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

Key point: **The unit of time in Remotion is 'frames', not 'seconds'**. At 30fps, 1 second = 30 frames, 3 seconds = 90 frames.

### 2.2 useCurrentFrame()—The Only Truth of Time

This is the most important hook in Remotion. It returns the current frame number (starting from 0), and all animations must be driven based on this value:

```typescript
import { useCurrentFrame } from 'remotion';

const frame = useCurrentFrame();  // 第0帧返回0，第30帧返回30...
const opacity = Math.min(1, frame / 30);  // 前1秒淡入
```

> [!note]
> **Remember**: All animations must be driven by `useCurrentFrame()`. Remotion will randomly jump to any frame number during rendering to take screenshots. If you use CSS transition or setTimeout, the state of each frame is uncertain, causing flickering and frame skipping.

### 2.3 interpolate()—universal mapping function

Map one numeric range to another. This is the cornerstone of Remotion animation:

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

### 2.4 spring()—Physics animation engine

More natural than linear interpolation of `interpolate`. Default from 0 to 1, with slight rebound overshoot:

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

### 2.5 Sequence—Scene Orchestration

`\<Sequence\>` Used for time offset, allowing the child component to start at a specified moment:

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

Key point: The `useCurrentFrame()` inside the sequence is relative—the frame 0 in Scene 2 is actually the global frame 90.

---

## Part Three: Prompt Framework — How to Talk to Claude Code

Now let's move on to the core part. After installing Agent Skills, launch Claude Code in the project directory and generate the video using prompts.

### 3.1 Basic prompt structure

An effective Remotion prompt should include the following elements:

```javascript
创建一个[X秒]的视频。

场景描述：[...详细描述每个场景的内容]
动画风格：[干净/进攻/柔和/赛博朋克...]
色调：[主色+辅色+背景色]
分辨率：[1920x1080 / 1080x1920竖屏]
帧率：[30fps]
```

### 3.2 Layer One: Quick Prototype Prompts

Ideal for rapid validation of results, 5-minute photo output:

> [!note]
> Create a 5-second video. Dark blue background (#0F1923), white text "Welcome to HyphenTech" fades in from the center, holds for two seconds, then slides left. Use spring animations to make transitions smooth and natural.

### 3.3 Second Layer: Multi-scenario structured prompts

Suitable for videos with clear storyboarding:

> [!note]
> Create a 15-second product introduction video, 1920x1080, 30fps.
> 
> Scene 1 (0-3 seconds): The logo condenses from particles and forms with a spring rebound effect. Dark background, logo glowing.
> 
> Scene 2 (3-9 seconds): Displays three features in sequence, each lasting about 2 seconds. Icons slide in from the left, text fades in from the right. Use stagger animation (each delay 10 frames).
> 
> Scene 3 (9-15 seconds): CTA "Experience Now" button animation appears, featuring a periodic pulse halo effect. [Bottom display hyphentech.top](http://xn--hyphentech-uj0tm94efn0d0j1d.top/).
> 
> Color scheme: Background #0F1923, main color #13C2C2 (cyan), emphasis #FFB300 (amber).
> 
> Font: Noto Sans SC.

### 3.4 Third Layer: Technical Constraints with Professional Prompts

Once you understand the Remotion API, you can specify technical details directly in the prompt:

> [!note]
> Create a 10-second YouTube channel intro, 30fps, 1920x1080.
> 
> Technical Requirements:
> 
> - Use AbsoluteFill as the container for each scenario
> 
> - Orchestrate three scenarios using Sequence components
> 
> - All animations use spring() instead of linear interpolation, damping:12, stiffness:100
> 
> - Extract the color scheme into CSS variables (--bg, --cyan, --amber)
> 
> - The logo image is loaded from public/logo.png and referenced using staticFile().
> 
> - Exported as standalone components for easy reuse
> 
> Scene Design:
> 
> Scene 1: In dark space, the grid background fades in, and the logo appears with a scale spring animation.
> 
> Scenario 2: Terminal-style typewriter animation, displaying channel names word by word.
> 
> Scenario 3: All elements converge to display the final logo + slogan + website.

---

## Part Four: Complete Workflow in Practice

### 4.1 Prompts → Preview → Iterative Loops

The actual workflow is as follows:

**Step 1**: Launch Claude Code in the project root directory and enter the prompt. Claude will generate/modify the `.tsx` file.

**Step 2**: View the effect in real time in the running Remotion Studio ([localhost:3000](http://localhost:3000/)). Thanks to React Fast Refresh, the preview updates automatically after the code is saved.

**Step 3**: Not satisfied? Continue to say to Claude, "Change this here":

> [!note]
> The typewriter in Scene 2 is too fast, so the spacing between characters is changed to 4 frames. Additionally, add a flashing cursor effect.

> [!note]
> The logo in scene 1 appears too abruptly, so add `damping: 8` to spring and make it bounce a few more times.

> [!note]
> Add background music to the entire video, use public/[bgm.mp](http://bgm.mp/)3, start playing from scene 1, and fade out in the last 1 second.

### 4.2 Resource Management

Static resources in Remotion are placed in the `public/` directory, referenced using `staticFile()`:

```typescript
import { Img, Audio, staticFile } from 'remotion';

// 加载图片
<Img src={staticFile('logo.png')} />

// 加载音频
<Audio src={staticFile('bgm.mp3')} />

// 加载视频素材
<OffthreadVideo src={staticFile('background.mp4')} />
```

Recommended `public/` directory structure:

```javascript
public/
├── images/       # logo、截图、背景图
├── audio/        # BGM、音效
├── videos/       # 视频素材
└── fonts/        # 自定义字体
```

### 4.3 Detailed explanation of audio integration

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

## Part Five: Theme Injection System—Making Video Styles Reusable

If you're making a series of videos, you need a consistent visual style. Best practice is to extract CSS variables as theme files:

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

Quote the topic in the prompt:

> [!note]
> Use the existing `darkCinema` theme color scheme in the project. All colors are read from the theme object; do not force color values.

The benefit of this approach: when you change the color scheme in the future, just change one file and the style of all videos will be updated immediately.

---

## Part Six: Rendering and Exporting

### 6.1 Local rendering

When you're satisfied with the preview:

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

### 6.2 Rendering Speed Optimization

Local rendering is limited by the number of CPU threads. A few acceleration tips:

Set the number of browser instances rendered in parallel with the `--concurrency` parameter (default is half the CPU core). Enable GPU acceleration on Linux with `--gl=angle`. For videos longer than 1 minute, consider deploying Remotion Lambda to AWS, with 1 minute video costing about $0.017.

### 6.3 Triggering rendering via prompts

You can even render directly in Claude Code:

> [!note]
> Now render the current video to MP4, output to out/[final.mp](http://final.mp/)4, encode with h264, and set crf to 18.

---

## Part 7: Directly applicable prompt template library

### 🎬 YouTube channel opening

```javascript
创建一个3秒的YouTube频道片头，1920x1080，30fps。

场景：深色背景上，网格线条缓慢流动，发光的频道名logo从粒子
中凝聚成型（用spring动画，damping:10）。最终logo稳定后，底部
出现频道口号（淡入）。
色调：深蓝#0F1923底，cyan#13C2C2主色。
logo图片：public/images/logo.png
```

### 📱 Vertical screen short video template

```javascript
创建5秒竖屏视频，1080x1920，30fps。展示一个概念。

场景1(0-2秒)：大标题“你还在手动剪视频？”从下方spring弹入。
场景2(2-4秒)：标题换成“让AI帮你做”，配辅动态图标。
场景3(4-5秒)：二维码+“关注黑粉科技”。
风格：干净极简，白底黑字，cyan强调色。
```

### 📊 Data visualization video

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

### 💻 Terminal typewriter animation

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

## Part Eight: Advanced Techniques

### 8.1 Prompt Chain—Incremental Iteration Rather Than One-Time Generation

Don't be too greedy for a single prompt. The most effective method is chain iteration:

Step 1: "Create the foundation, just switch backgrounds and scenes"

Step 2: "Now add a logo animation to Scene 1"

Step 3: "Scenario 2 Adding Typewriter Effects"

Step 4: "Add background music and fade out"

Step 5: "Fine-tune the time rhythm, shorten Scene 1 by 0.5 seconds"

### 8.2 Component Reuse

After you've accumulated several videos, tell Claude to extract reusable components:

> [!note]
> Extract the current typewriter animation into a generic component TypewriterText, which accepts props:
> 
> - text: string — the text to display
> 
> - charDelay: number — the frame interval for each character
> 
> - cursorBlink: boolean — whether to display the flashing cursor
> 
> - color: string — The color of the text
> 
> and placed in the src/components/ directory.

### 8.3 Parametric Video — Mass production

Remotion's secret weapon is parameterization. You can pass different data via inputProps and batch generate videos with different content using the same template:

```bash
# 传入不同props渲染不同版本
npx remotion render src/index.ts MyVideo out/ep01.mp4 \
  --props='{"title":"第1期","topic":"AI视频生成"}'

npx remotion render src/index.ts MyVideo out/ep02.mp4 \
  --props='{"title":"第2期","topic":"Remotion实战"}'
```

This means you can automatically generate the opening, ending, and cutscenes of the entire series with a single script.

### 8.4 Stills—Generate cover images using video code

A hidden feature of Remotion: generating video cover images using the same set of code. When the video design is updated, the cover automatically updates in sync:

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

Then export with the command:

```bash
npx remotion still src/index.ts Thumbnail out/thumbnail.png
```

---

## Part 9: Common Problems and Pitfall Prevention Guide

**Issue 1: Claude-generated animations flicker or lose frames after rendering**

Reason: Used CSS transition or setTimeout instead of useCurrentFrame. Solution: Make sure Agent Skills is installed, and clearly state in the prompt that "all animations must be based on useCurrentFrame drivers."

**Issue 2: Complex Animation Elements Are Misplaced**

Solution: Keep it simple. Make only one simple animation concept at a time, iterating and overlaying. Don't try to generate complex multi-layer overlay animations at a single prompt.

**Issue 3: Missing fonts during rendering**

Solution: Use Remotion's built-in Google Fonts loader, or place the font file in public/fonts and load it with @font-face.

**Issue 4: Rendering takes too long**

Solution: Test at lower resolution (start with 960x540), then use full resolution for the final version. Also, confirm that no unoptimized large images are used.

---

## Summary: The value of this pipeline

The core value of this combination of Remotion + Claude Code + Agent Skills is:

**100% reproducible**: The same code always produces the same video, unlike the randomness of AI-generated videos.

**Version controllable**: Video is code that can be tracked, branched, and rolled back with git.

**Parametric Mass Production**: One set of templates can produce videos for an entire series.

**Nearly zero learning curve**: With Agent Skills, you don't even need to know React—you can produce photos using natural language descriptions.

This isn't about replacing Premiere or After Effects—it's about "opening a giant software just to make a 15-second opening."

---

> **HyphenTech** — Getting Stronger with AI

> 

> Let AI be your superpower.

> 

> Official website: [hyphentech.top](http://hyphentech.top/)


---

## 🧰 Tools I build

I maintain all of these tools myself. Preview builds are clearly labeled; the release pages are the source of truth for downloads, updates and known limits.

> [!info] HyphenBox
> **Status:** Official releases
>
> A radar for free LLM APIs: availability is re-tested continuously, one local interface for all of them, and keys stay on your machine
>
> [Downloads & updates](https://github.com/HackerChi-Hub/hyphenbox-release/releases)

> [!info] LocalBrain
> **Status:** Official releases
>
> A multimodal MCP toolbox for local models: TTS, Whisper and video generation in one place
>
> [Downloads & updates](https://github.com/HackerChi-Hub/localbrain-releases/releases)

> [!info] ScreenLex
> **Status:** Official releases
>
> Learn new words while you watch shows. Free, for Mac and Windows
>
> [Downloads & updates](https://github.com/HackerChi-Hub/screenlex-download/releases)

> [!info] HyphenScreen
> **Status:** Official releases
>
> Screen recording and smart editing in one: a DaVinci-style timeline, automatic redaction and a check of the finished video before export. Free
>
> [Downloads & updates](https://github.com/HackerChi-Hub/HyphenScreen-Releases/releases)

---

> [!quote] HyphenTech
> **Make AI your superpower**
> Local deployment · Free resources · Self-made software
> https://hyphentech.top
