---
title: "Why does AI always leave work halfway? I used a UFO game to test an unattended mission"
slug: ai-agent-ufo-game-prompt-template-2026-en
status: published
lang: en
translation_of: ai-agent-ufo-game-prompt-template-2026
translation_source: machine
source_sha256: 0d003ba32e5178ff
date: 2026-06-04
updated: 2026-10-03
summary: "I used a UFO sucking baby web game to test whether AI could continuously advance according to goals, boundaries, and acceptance documents like employees, and organized reusable prompt templates."
categories:
  - Tech
tags:
  - AI Agent
  - Prompt engineering
  - Unattended tasks
  - AI coding
cover: https://hyphentech.top/obsidian-assets/ai-agent-ufo-game-prompt-template-2026/image-01-36329611f7.png
brand_slogan: 
legacy_paths: []

---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/ai-agent-ufo-game-prompt-template-2026/) is authoritative.

> [!note]
> I used a UFO sucking baby web game to test whether AI could continuously advance according to goals, boundaries, and acceptance documents like employees, and organized reusable prompt templates.

What makes AI most like a newcomer isn't making mistakes, but that it loves to leave work halfway. If you ask it to change a project, it changes two lines of code, writes a summary, and then politely tells you: I've finished it.

![Article Images 1](https://hyphentech.top/obsidian-assets/ai-agent-ufo-game-prompt-template-2026/image-01-36329611f7.png)

This time, I did a small experiment: I had the AI start from a vague childhood memory and create a web mini-game called "UFO Recruiting Soldiers." The difference was, I no longer urged it to repeat sentences one sentence at a time; instead, I managed it like an employee, giving it goals, boundaries, acceptance reports, review requirements, and downtime conditions.

![Article Images 2](https://hyphentech.top/obsidian-assets/ai-agent-ufo-game-prompt-template-2026/image-02-7cfb909cc5.png)

### Core conclusion

- AI usually finishes early not because it's lazy, but because you don't have evidence defining "done."

- Unattended tasks don't make AI more excited, but rather have a nitpicking reviewer within the task.

- A good prompt is not a command, but a target work order: clearly state the target, rules, acceptance, boundaries, review, and downtime conditions.

![Article Illustrations 3](https://hyphentech.top/obsidian-assets/ai-agent-ufo-game-prompt-template-2026/image-03-9626de938d.png)

### Prompt templates can be reused

```plaintext
你现在不是聊天助手，而是一个可以持续推进任务的执行代理。

【目标】
我要你完成：{任务名称}
最终交付物是：{交付物}
使用场景是：{使用者/平台/运行环境}

【背景】
已知信息：
- {背景1}
- {背景2}
- {素材/路径/约束}

【规则】
你必须遵守：
1. 先做最小可用版本，再逐步增强。
2. 每一步都要产生可检查的证据。
3. 不要因为完成了一部分就总结收工。
4. 遇到权限、依赖、路径、登录态问题时，先尝试可验证的替代方案；仍无法推进时再报告。

【完成标准】
只有同时满足以下条件，才算完成：
- {验收项1：功能/质量/格式}
- {验收项2：运行/截图/测试结果}
- {验收项3：用户可直接使用}

【边界】
不要做：
- {不要扩展的方向}
- {不要引入的复杂度}
- {不要改动的文件/数据/账号设置}

【自我评审】
每轮完成后，你要扮演评审者，检查：
- 目标是否真的完成？
- 有没有证据？
- 有没有违反边界？
- 用户是否还需要额外手动补步骤？

【停机条件】
只有在完成标准全部通过后，才允许输出最终总结。
如果未通过，继续迭代，不要把“已完成部分”当成最终交付。
```

### Example of the UFO game version

```plaintext
目标：做一个 2D 像素风 UFO 指挥小游戏。
玩法：玩家控制飞碟吸走敌方小兵，再释放我方小兵攻击基地。
交付：一个可直接运行的网页小游戏，包含 HTML/CSS/JS。
验收：
- 页面能在本地浏览器打开。
- UFO 能移动、吸兵、释放兵。
- 双方基地有血量，小兵能自动锁敌攻击。
- 至少能出现胜利或失败状态。
- 截图或自动化测试能证明游戏真的跑起来。
边界：
- 不做复杂联网、账号、后端。
- 不追求完整商业游戏，只做可玩原型。
停机：
- 没通过验收就继续修，不要提前总结完成。
```

### How to change it to any project

Replace "UFO games" with your real tasks, and replace "moving, recruiting, winning/losing" as proof of acceptance. Write articles to evaluate titles, structure, factual sources, and release drafts; Write code to evaluate runtime, testing, screenshots, and boundaries; Make videos to evaluate finished videos, covers, subtitles, and platform status.

In short: Don't just give AI a wish—give it a work order that can self-accept.


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
