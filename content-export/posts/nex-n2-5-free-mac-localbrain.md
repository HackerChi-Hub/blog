---
title: Nex-N2.5免费，64GB Mac能跑吗？
slug: nex-n2-5-free-mac-localbrain
status: published
date: 2026-09-09
updated: 2026-09-09
summary: 35B多模态智能体开源，在线端点当前免费；Mac容量够不等于运行时已经打通。
categories:
  - 学习思考
tags:
  - AI
  - 热点速递
cover: /obsidian-assets/nex-n2-5-free-mac-localbrain/cover-ee37558b86.jpg
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!abstract]
> 三档模型、视觉反馈、电脑操作；先把“能装下”和“能跑稳”拆开。
> 黑粉科技 · 2026-09-09

![35B 专家核心、64GB Mac 与 LocalBrain 之间，真正隔着的是运行时兼容闸门](/obsidian-assets/nex-n2-5-free-mac-localbrain/image-cover-wide-ee37558b86.jpg)

9月8日，Nex-AGI 一口气放出了 mini、Pro、Max 三档 Nex-N2.5。最抓眼球的当然是 1.6 万亿参数 Max，但对普通人更实际的问题反而是最小那杯：**35B 的 mini，能不能塞进一台 64GB Mac，顺手接到 LocalBrain？**

先把边界钉死：这篇不做本机推理实测。本轮没有下载权重，没有启动 Nex，也没有连接、停止或切换正在工作的 LocalBrain。下面的结论来自官方仓库、配置文件、公开模型目录和当前 LocalBrain 1.2.58 源码的只读检查。

> 结论先说：64GB Mac 在容量上已经碰得到社区 4bit 版；但现在只能写“候选可接入”，不能写“LocalBrain 已经支持”。

![Nex-N2.5 官方 GitHub 仓库：mini、Pro、Max 与电脑操作、视觉反馈定位都写在原始说明中](/obsidian-assets/nex-n2-5-free-mac-localbrain/image-official-repo-71449a0322.png)

## 🎯 ▍为什么现在一次放三档：Nex 在抢 Agent 入口

Nex 为什么现在开源？我的判断是，它抢的不是聊天榜单，而是下一代电脑操作 Agent 的入口。mini 负责让开发者低成本接触架构，Pro 负责在线服务，Max 负责抬高旗舰能力上限。当前免费 API 先把调用者聚过来，后续托管、企业部署和按调用量计费才有土壤。

这里的利益结构也很清楚：模型厂商受益于开发者替它验证真实任务，API 平台受益于新增流量；普通用户省下早期试错成本，却可能在工作流绑定之后承担迁移和付费账单。开源权重让这盘棋不只剩云端一条路，但本地用户要自己承担量化、运行时和安全维护。

## 🔍 ▍它真正想抢的，不是聊天框

Nex-N2.5 的三档并不是简单地把参数越堆越大。mini 和 Pro 延续多模态路线，重点是电脑操作、网页浏览、视觉反馈和长期任务；Max 则是纯文本 MoE，承担复杂推理、编程和 Agent 工作流。换句话说，Nex 把“会看、会点、会根据结果改下一步”和“纯文字重推理”拆成了两条产品线。

这比“又一个跑分更高的模型”有意思。早在第一轮视觉语言模型热潮里，很多产品看到一张图就结束了；Nex 的描述里，视觉是行动之后的反馈回路：模型点完按钮，再看界面变成什么样，检查结果，继续修正。它更接近一个坐在电脑前反复确认的执行者。

![Nex-N2.5 三档定位与部分官方自报成绩；这些数字不是黑粉科技独立实测](/obsidian-assets/nex-n2-5-free-mac-localbrain/image-family-map-7a417fcfa5.png)

官方自报的 Terminal-Bench 2.1 是 mini 73.4、Pro 82.7、Max 86.1；OSWorld-Verified 是 mini 71.2、Pro 82.2。

数字很亮眼，但官方同时写明：部分对手成绩来自公开资料，部分来自自己的评测；编码任务使用 NexAU，电脑任务使用 NexCUA，而 NexCUA 在发布时仍是“即将开源”。所以它们适合判断方向，不适合当最终购买证明。

## ⚡ ▍35B 为什么只有一小部分专家同时工作

mini 的配置不是普通稠密 35B。它有 40 层、256 个专家，但每个 token 只激活 8 个专家；每 4 层安排一次全注意力，其余层混合线性注意力；原生位置上限是 262,144，还带视觉编码器。

MoE 的好处，是总参数很大，但每次只动一部分，计算量不必跟 35B 稠密模型完全等价。

上一次社区集中讨论 MoE 本地化时，同样有人把“激活参数”误当成“需要下载的参数”；代价其实一直没变：权重仍然要放在内存里，专家路由和大量小矩阵也会让量化、缓存和运行时优化更复杂。**激活参数少，不等于模型文件小。**

## 💰 ▍Mac 的第一道墙不是算力，是权重体积

官方 BF16 仓库占 70.24GB，已经超过 64GB 整机内存，还没算 macOS、KV 缓存和视觉投影。所以官方原版不用试，光权重就放不下。

社区转换把局面改了：MLX 4bit 仓约 19.53GB；GGUF Q4_K_M 权重约 21.17GB，再加 0.90GB 的 mmproj，合计约 22.07GB。这个体积对 64GB 统一内存已经不是硬墙，甚至还能给上下文和系统留出空间。

![官方 BF16 与社区 MLX/GGUF 的容量差异；体积进入射程，不代表运行时已经验收](/obsidian-assets/nex-n2-5-free-mac-localbrain/image-mac-wall-5036c7930e.png)

问题在时间。两个社区仓都是 9月8日刚创建，检查时下载量还是 0。它们不是 Nex-AGI 官方转换，也没有足够使用反馈。历史上新架构进入本地生态，常见顺序都是先有权重、再有量化、最后补齐模板和视觉支持；最容易踩的坑就是模型能被扫描出来，点启动后才发现架构、聊天模板、视觉投影或工具调用有一项没跟上。

## 🧩 ▍能不能加进 LocalBrain？可以列为候选，先别写成已支持

只读检查当前 LocalBrain 1.2.58 源码，它已经有外部模型库入口：只读扫描，不复制、不移动、不删除；顶层 GGUF 会交给 llama.cpp，Safetensors 加 config.json 的目录会进入 MLX 路径。GGUF 还会读取真实文件头，不靠文件夹名字猜架构。

这意味着 Nex 社区转换件具备“被纳入模型候选”的条件。可是 LocalBrain 的原生视觉还要求主 GGUF 与 mmproj 配套，MLX 视觉又走独立分类；再加上 qwen3_5_moe、多模态聊天模板和工具协议，任何一环没被当前运行时吃透，都可能出现“看得到，跑不起来”或“能聊天，不能看图和操作工具”。

| 检查层 | 当前判断 | 还缺什么 |
| --- | --- | --- |
| 容量 | 64GB 可容纳社区 4bit | 上下文与峰值内存要实测 |
| 模型发现 | GGUF / Safetensors 可进入候选 | 目录与分片完整性 |
| 文本启动 | 架构路线存在 | 当前运行时真启动 |
| 视觉 | GGUF 有 mmproj | 图片输入与模板验收 |
| Agent | 模型定位支持工具工作流 | 工具调用格式、长任务和自纠错 |

## 🚀 ▍现在想用，在线反而更省时间

9月9日查询 OpenRouter 公共目录，mini 与 Pro 都有 `:free` 端点，输入和输出价格显示为 0，上下文都是 262,144。这里要加两个小字：第一，这是“当前免费”，不是永久免费；第二，OpenRouter 当时把 mini 标成纯文本输入，Pro 才标成图文输入，说明托管端不一定把官方权重的全部模态原样开放。

所以选择很简单：想今天体验模型能力，先走在线免费端点；想把数据留在本机，可以把社区 4bit 版加入观察清单，等运行时和真实用户反馈稳定，再做一次受控启动。现在最不划算的动作，是先下 70.24GB 官方权重，再发现整机连装载都过不了。

## 🧠 ▍我的判断：Nex 的野心在“视觉闭环”

Nex-N2.5 最值得看的，不是 1.6T 这个大数字，而是它把视觉从输入升级成执行反馈。模型厂商都在往 Agent 走，真正的分水岭会从“谁答得更聪明”变成“谁能在真实电脑里持续行动、检查、纠错，而且不把权限边界撞穿”。

对 64GB Mac 用户，mini 已经从“绝对放不下”走到“量化后有机会”。但机会不是结论。等社区转换有使用量、llama.cpp 与 MLX 对这套多模态 MoE 的支持稳定，再把 LocalBrain 的文本、视觉、工具调用三条链逐项验收，才是可以公开说“能跑”的那一天。

> [!tip]
> **一手来源**
> Nex-N2.5 官方仓库：https://github.com/nex-agi/Nex-N2.5
> mini 官方权重与配置：https://huggingface.co/nex-agi/Nex-N2.5-mini
> OpenRouter mini：https://openrouter.ai/nex-agi/nex-n2.5-mini:free
> OpenRouter Pro：https://openrouter.ai/nex-agi/nex-n2.5-pro:free
> 
> 社区转换仅用于体积判断：
> https://huggingface.co/abenzerps/Nex-N2.5-mini-MLX-4bit
> https://huggingface.co/abenzerps/Nex-N2.5-mini-GGUF

> [!tip]
> **我目前的4款自制软件**
> · **黑粉剪辑 HyphenCut**（正式迭代）——对话式视频剪辑器，自带 MCP 可被 agent 驱动
>   https://github.com/HackerChi-Hub/HyphenCut-Releases/releases
> · **黑粉盒子 HyphenBox**（初步构建 · 预览版）——免费大模型 API 雷达 + 本地统一路由：持续复测可用性、Key 只存本机、auto 自动挑模型
>   https://github.com/HackerChi-Hub/hyphenbox-release/releases
> · **LocalBrain**（正式迭代）——把 Mac 变成私有 AI 盒子：转写/配音/生图/视频/MCP 一站管理
>   https://github.com/HackerChi-Hub/localbrain-releases/releases
> · **ScreenLex 光影词库**（正式迭代）——看美剧顺手把生词背了，Mac/Windows 双平台，免费
>   https://github.com/HackerChi-Hub/screenlex-download/releases
> 
> **黑粉科技** · 本地部署 / 免费白嫖 / 自制软件
> 宣传语：让AI成为你的超能力
> https://hyphentech.top

---

> [!quote] 黑粉科技
> 让AI成为你的超能力
> 本地部署 / 免费白嫖 / 自制软件
> https://hyphentech.top
