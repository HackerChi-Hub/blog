---
title: "Hy-Memory-30B-A3B 是什么：它能把长期记忆写好到什么程度？"
slug: "2026-10-16-official-6b1fdcbd2e4f"
status: "published"
date: "2026-10-16"
updated: "2026-10-16"
summary: "腾讯混元开放长期记忆写入模型，先看它解决什么、成绩如何、怎样验收。"
categories: ["技术分享"]
tags: ["AI", "新锐模型"]
collection: "新锐模型"
cover: "/obsidian-assets/2026-10-16-official-6b1fdcbd2e4f/wordmark-wide-09c3da7710b8.jpg"
legacy_paths: []
review_status: "pending"
cover_status: "generated_user_authorized"
source_event_id: "6b1fdcbd2e4fc84f3e02fe4a"
article_type: "model"
model_name: "Hy-Memory-30B-A3B"
model_category: "AI大模型"
model_stage: "官方发布"
model_url: "https://huggingface.co/tencent/Hy-Memory-30B-A3B"
cover_pipeline: "programmatic-wordmark-v1"
---

聊天助手记住你的偏好，难点不只是“存下来”，而是决定哪些信息值得留、怎样写得准确，以及新信息出现后怎样更新旧记录。腾讯混元的 Hy-Memory-30B-A3B，专门处理的就是这条“写入长期记忆”路径。

## 它不是整套聊天模型，而是记忆系统里的“写入员”

官方把 Hy-Memory-30B-A3B 定义为紧凑的长期记忆写入模型，约有 3B 激活参数。它可以替换 Mem0、MemOS 和 Hy-Memory 内原本负责写入的通用大模型，覆盖聊天、工作与编程场景。

可以把外部记忆框架想成快递仓库：对话是不断送来的包裹，记忆库是货架，写入模型负责判断哪些包裹该入库、标签该怎么写、同一件事有了新版本后该替换还是补充。Hy-Memory-30B-A3B 管的是这一步，不是独自完成检索、回答和整套应用流程。

名称中的 30B 对应模型页面列出的参数规模，实际处理一次输入时约激活 3B 参数。它更像一座有很多货架、每次只调动相关区域的仓库；这能说明模型采用稀疏激活思路，但不能直接推出某台电脑的速度、内存占用或可运行性。

![官方模型介绍](/obsidian-assets/2026-10-16-official-6b1fdcbd2e4f/source-evidence-1-9ff975e4.png)

## 官方成绩能说明什么

这次评估只更换记忆写入模型。官方称，各组比较保持框架版本、提示词、检索配置、回答模型、裁判模型和其他框架组件不变；每个写入模型都从空白状态建立自己的记忆库，测试样本与评分规则相同。主评测使用固定 20% 子样本。

| 官方列出的记忆写入模型 | Mem0 | Hy-Memory | MemOS | EverMemOS | 综合成绩 |
| --- | --- | --- | --- | --- | --- |
| Hy-Memory-30B-A3B | 54.02 | 60.55 | 50.51 | 56.89 | 55.49 |
| Claude Opus 5 | 53.43 | 60.53 | 50.50 | 54.04 | 54.62 |
| DeepSeek V4.1 Flash | 49.73 | 60.20 | 49.17 | 55.47 | 53.64 |

> 官方固定 20% 子样本结果；各框架成绩由六项指标等权平均，综合成绩再对四个框架等权平均。

这些数字支持一个有限结论：在官方固定条件与抽样矩阵中，Hy-Memory-30B-A3B 的综合成绩为 55.49。它们不是独立复测，也不能证明换一套提示词、检索器、回答模型或真实用户数据后仍有相同结果。

![官方评测条件](/obsidian-assets/2026-10-16-official-6b1fdcbd2e4f/source-evidence-2-f852ef54.png)

## 更值得看的，是它怎样学习更新记忆

官方采用两阶段训练：先进行 Memory On-Policy Distillation，让学生模型学习教师提供的状态链；再进行 Attributed Memory Reinforcement Learning，根据形成的记忆库分配分块级反馈，并把选中的记忆库带入后续窗口。

这像整理微信聊天记录：先学习怎样把零散消息写成清楚的备忘，再根据后续使用效果判断哪些记录真正有用。关键不只是记住一句话，而是让旧记录在新证据出现时继续可用。官方还把 EverMemOS 留在训练之外，用它观察模型迁移到未见过记忆框架时的表现。

## 现在能拿到什么，还缺什么

官方模型页已经列出模型权重、配置与模型卡，并提供 [Hy-Memory-30B-A3B 模型页面](https://huggingface.co/tencent/Hy-Memory-30B-A3B)。文件采用 Safetensors，页面标注 BF16 与 F32；这说明权重已经提供，不是只展示未来计划。

- 官方给出的部署方式是 vLLM，注明测试版本为 v0.31.0，并通过兼容 OpenAI 的接口调用。
- 官方同时提供框架代码与评估工具入口，适合继续核对数据格式、记忆库结构和评测方法。
- 模型页面明确显示当前没有 Inference Provider 部署，因此不能把“权重已开放”理解成“已有托管接口可以直接点用”。

![官方部署说明](/obsidian-assets/2026-10-16-official-6b1fdcbd2e4f/source-evidence-3-0c37a814.png)

> [!warning]
> 权重可下载只解决了“文件能不能拿到”。许可证是否满足具体用途、运行时是否兼容、硬件是否装得下、真实任务能否稳定工作，仍要分别核实；官方资料没有给出普通消费级设备的内存、速度或成本结论。

![托管服务状态](/obsidian-assets/2026-10-16-official-6b1fdcbd2e4f/source-evidence-4-39e8a1fd.png)

## 真正准备使用时，按一条完整链路验收

- 先确认任务确实需要跨对话保留用户事实、偏好或项目状态，而不是只需要当前上下文。
- 再按官方框架固定回答模型与检索配置，只替换记忆写入模型，避免把其他组件的变化算到它头上。
- 保留空库开始、写入结果、更新后的记忆库和最终回答，检查模型有没有漏记、误记或把推断当事实。
- 最后加入真实的删除、纠错和偏好变化场景。能写入一次不等于能长期维护，更不等于整套助手已经可靠。

Hy-Memory-30B-A3B 的价值很明确：它把长期记忆系统里容易被通用模型兼任的写入环节，单独做成了可替换模型。现阶段适合已有外部记忆框架、愿意自己部署并做逐项验收的开发者；只想直接获得托管聊天服务，或期待权重下载后立即在任意电脑运行的人，还需要等待更完整的运行条件与独立实测。

## 官方资料

- [腾讯混元 官方发布说明](https://huggingface.co/tencent/Hy-Memory-30B-A3B)


---

## 🧰 我做的工具

这些工具都由我持续维护。预览版会明确标注，下载、更新和已知边界以发行页为准。

### 黑粉盒子 HyphenBox

正式迭代。免费大模型 API 雷达：持续复测可用性，本地统一接口，Key 只存本机

[下载与更新](https://github.com/HackerChi-Hub/hyphenbox-release/releases)

### 方寸智匣 LocalBrain

正式迭代。本地模型的多模态 MCP 工具箱：TTS / Whisper / 视频生成一站接入

[下载与更新](https://github.com/HackerChi-Hub/localbrain-releases/releases)

### ScreenLex 光影词库

正式迭代。看美剧顺手把生词背了，Mac/Windows 双平台，免费

[下载与更新](https://github.com/HackerChi-Hub/screenlex-download/releases)

### 黑粉录屏 HyphenScreen

正式迭代。录屏 + 智能剪辑一体：达芬奇式时间线、自动打码、导出前成片体检，免费

[下载与更新](https://github.com/HackerChi-Hub/HyphenScreen-Releases/releases)
