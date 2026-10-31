---
title: 零基础当黑客？Qwen3.8 27B本地安全实测，184条提示该怎么看
slug: qwen38-27b-local-security-video
status: published
article_type: article
date: 2026-10-31
updated: 2026-10-31
summary: 方寸智匣2.2.1配合本地Qwen3.8 27B，从目标授权、容器工具到靶场和自家设备报告，讲清怎样看待184条组件问题提示。
categories:
  - 技术分享
tags:
  - AI
  - 网络安全
cover: /obsidian-assets/qwen38-27b-local-security-video/cover-53826f77b9.jpg
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

把模型放在自己电脑里，再让它检查家里的设备，会发生什么？我在方寸智匣2.2.1里启动Qwen3.8 27B，先查本地靶场，再看自己的树莓派和路由器。最醒目的结果，是靶场报告里出现了184条问题提示。

数字看着热闹，真正值得学的是它们怎么来的、对应什么证据、接下来该修什么。下面按这次实录，把模型、检查工具、授权和报告串起来。所有操作都限定在我自己的设备、网络及隔离靶场；练习时也只选自己拥有或已明确获授权的目标。

## 先把模型启动，再问它具体能做什么

![本地模型选择](/obsidian-assets/qwen38-27b-local-security-video/image-model-0c5c625b9a.jpg)

片中选中的是带Uncensored标签的Qwen3.8 27B变体，并使用Mac下的Splash路线。“无审核”是这里所选模型的标签，不是任意目标都能测试的通行证。模型能回答问题，与软件有没有权限执行操作，是两件需要分别确认的事。

![模型启动状态](/obsidian-assets/qwen38-27b-local-security-video/image-ready-986798be17.jpg)

启动后，对话页左上角出现了激活状态。我先问它能做什么，再追问安全测试的具体范围。这样做不是考模型背了多少名词，而是先对齐它能调用哪些工具、缺哪些环境、操作需要什么授权。

![安全能力查询](/obsidian-assets/qwen38-27b-local-security-video/image-capability-30ebd27e3f.jpg)

可以把这套关系想成一次设备体检：模型负责听懂问题、安排检查和解释结果；真正读取文件、核对组件、探测设备的是相应工具。模型回答得自信，不会自动让检查结果变准，最终还是要看工具输出和可回看的证据。

## 授权要落到具体目标，不能一句话把范围放开

![目标与文件夹授权](/obsidian-assets/qwen38-27b-local-security-video/image-scope-d0b85b53db.jpg)

方寸智匣的网络安全区里，文件夹检查与设备、网络目标分开设置。检查自己的项目目录，就授权那个目录；检查自己的设备，就把对应目标加进去。不要因为菜单里有很多能力，就把所有权限一次打开。

![对话中的范围确认](/obsidian-assets/qwen38-27b-local-security-video/image-approval-973ca6a56f.jpg)

这就像请师傅上门检修：让他看客厅插座，不等于可以翻遍所有抽屉。把目标、检查类型和允许的动作写清楚，后续才知道一次操作是否越出了原本的安排。片中我明确要求只能使用预先授权的目标，不扩大范围。

![本地靶场任务批准](/obsidian-assets/qwen38-27b-local-security-video/image-lab-1c213239aa.jpg)

执行本地靶场任务时，软件仍会弹出确认，需要本人手动批准才继续。遇到这一步，先读清它准备下载什么、检查什么，再点批准；不因为任务来自本地模型就省掉确认。首次练习也更适合先用隔离靶场，而不是把公共网站当测试对象。

## 检查工具装在哪里，比“一键安装”四个字更重要

![运行环境与诊断](/obsidian-assets/qwen38-27b-local-security-video/image-environment-981b12b9aa.jpg)

片中把配套组件集中到“运行环境与诊断”里。缺什么、是否就绪，都先在这里看，再选择单项或批量安装。安卓设备、离线漏洞库和隔离执行环境承担不同工作，不是装了一个大模型，所有工具就自动齐全。

![缺失组件与按需安装](/obsidian-assets/qwen38-27b-local-security-video/image-install-c7886eae2b.jpg)

我现场移除了一项组件，再通过界面重新安装，用这个过程确认下载与恢复入口。相关检查工具按容器镜像组织，想删除时可以移除对应镜像，减少依赖散落到日常系统里的影响。

![容器工具的组织方式](/obsidian-assets/qwen38-27b-local-security-video/image-container-0583b9fff4.jpg)

可以把容器理解成一间单独整理好的工具间：里面放着这项工作需要的工具与依赖，用完可以整体收起。但工具间并不自动决定师傅能走进哪个房间——容器隔离和目标授权仍要一起配置。下载组件也可能需要联网，不能把“本地推理”理解成整条流程永远不访问网络。

## 184条提示：先看检查口径，再看严重等级

![靶场组件检查结果](/obsidian-assets/qwen38-27b-local-security-video/image-result-9c18bbfaa1.jpg)

这次靶场使用OWASP Juice Shop。项目本身就是为安全学习和练习准备的应用；想了解它的用途，可以直接看[Juice Shop项目说明](https://github.com/juice-shop/juice-shop)。片中结果明确写着“离线组件匹配”，所用工具是Trivy，提示分成12条严重、56条高危、92条中危和24条低危，合计184条。

这里最容易看错的，是把“组件与已知问题条目匹配”直接读成“184个都已在这台机器上验证可利用”。组件版本、运行配置、功能是否被调用，以及实际可触达范围，都会改变某条提示的实际影响。严重等级适合帮助排先后顺序，不能替代后续核实。

![导出的检查报告](/obsidian-assets/qwen38-27b-local-security-video/image-report-e5f78c3326.jpg)

所以我没有停在聊天窗口的总结，而是打开导出的报告。读报告时，先找受影响对象，再找检测依据、适用条件和建议。只看到一个醒目的漏洞编号，往往还不足以决定该不该停服务；看到明确的组件版本、配置位置和可复核现象，才更接近一项可以处理的工作。

模型很适合把陌生术语解释成能读懂的话，也适合把报告整理成待办清单。修复则要回到相应组件或设备的正规更新、配置和验证流程。不要照着聊天答案在生产环境里尝试破坏性操作，也别把报告里写出的路径、令牌或设备标识直接公开。

## 换到自家设备，关注点从“数量”变成了“暴露了什么”

![本人局域网探测记录](/obsidian-assets/qwen38-27b-local-security-video/image-lan-c91f63a9ea.jpg)

靶场之后，我让它查看自己的局域网。片中有等待、探测方式调整，也有部分设备没有响应的情况。设备不回应某次探测，并不能据此给它盖一个“安全”章；真正有用的是把已确认在线的对象、开放的服务和后续需要检查的项目列清楚。

![树莓派服务检查](/obsidian-assets/qwen38-27b-local-security-video/image-pi-cfb772535a.jpg)

其中一台是我自己的树莓派，上面有以前部署的网页排版工具。检查继续看到了网页资源、前端技术栈和部分接口线索。对自己维护的服务，这类信息的价值在于提醒我复查：哪些资源本来就应该公开，哪些目录或构建遗留产物不该暴露，服务是否还需要继续运行。

![家用路由器检查结论](/obsidian-assets/qwen38-27b-local-security-video/image-router-36cd157666.jpg)

路由器这一轮，报告关注未登录时可见的设备信息、初始化引导状态和证书等内容，并把某些发现列为较低风险。片中并没有演示接管路由器。对普通家庭，更实际的下一步是确认管理密码、固件更新和远程管理设置；涉及公网暴露的配置，不清楚用途就先按设备官方说明收敛到必要范围。

## 零基础真正能拿走的，是一条检查和修复的路线

这期最有用的结果，不是把人瞬间变成安全专家，而是让“我怀疑有问题”变成可查看的目标、工具输出和报告。你可以从自己的隔离练习环境开始，批准一个明确任务，保存报告，再逐条问清楚它意味着什么、该怎样核实和修复。

发现线索、确认风险、完成修复，最好分开记。修完后用同样范围再检查一次，看看原来的现象是否消失；一时看不懂的提示，就先保留原始记录，不要用一次自动检查代替长期维护。个人观点，仅供参考。

[观看本期完整实录](https://www.youtube.com/watch?v=ENNQvKOHGb4) · [方寸智匣介绍](https://hyphentech.top/localbrain-local-ai-box/) · [下载与更新：方寸智匣](https://github.com/HackerChi-Hub/localbrain-releases/releases/latest)


---

## 🧰 我做的工具

这些工具都由我持续维护。预览版会明确标注，下载、更新和已知边界以发行页为准。

> [!info] 黑粉助手 HyphenAssistant
> **状态：** 正式迭代
>
> 手机浏览器接续电脑上的 DeepSeek Harness 会话；需本人配对、电脑与原服务在线，模型费用沿用原配置
>
> [下载与更新：黑粉助手 HyphenAssistant](https://github.com/HackerChi-Hub/hyphen-assistant-releases/releases)

> [!info] 黑粉盒子 HyphenBox
> **状态：** 正式迭代
>
> 免费大模型 API 雷达：持续复测可用性，本地统一接口，Key 只存本机
>
> [下载与更新：黑粉盒子 HyphenBox](https://github.com/HackerChi-Hub/hyphenbox-release/releases)

> [!info] 方寸智匣 LocalBrain
> **状态：** 正式迭代
>
> 本地模型的多模态 MCP 工具箱：TTS / Whisper / 视频生成一站接入
>
> [下载与更新：方寸智匣 LocalBrain](https://github.com/HackerChi-Hub/localbrain-releases/releases)

> [!info] ScreenLex 光影词库
> **状态：** 正式迭代
>
> 看美剧顺手把生词背了，Mac/Windows 双平台，免费
>
> [下载与更新：ScreenLex 光影词库](https://github.com/HackerChi-Hub/screenlex-download/releases)

> [!info] 黑粉录屏 HyphenScreen
> **状态：** 正式迭代
>
> 录屏 + 智能剪辑一体：达芬奇式时间线、自动打码、导出前成片体检，免费
>
> [下载与更新：黑粉录屏 HyphenScreen](https://github.com/HackerChi-Hub/HyphenScreen-Releases/releases)

---

> [!quote] 黑粉科技
> **让AI成为你的超能力**
> 本地部署 · 免费白嫖 · 自制软件
> [黑粉科技](https://hyphentech.top)
