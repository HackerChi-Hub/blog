---
title: 完全免费，Windows下8GB显卡跑Qwen 35B
slug: polystrata-qwen36-8gb-localbrain-test
status: published
article_type: article
date: 2026-10-19
updated: 2026-10-20
summary: 35B模型在8GB显卡上能跑，但能否交付？12题逐项看，成功与失败都保留。
categories:
  - 技术分享
tags:
  - AI
cover: /obsidian-assets/polystrata-qwen36-8gb-localbrain-test/cover-4b873018e1.jpg
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!abstract]
> Windows · 编程 · 网络安全 · 数据 · 逻辑
> 产物正确和正常收尾分别记录
> 黑粉科技 · 2026-10-19

这次最让我警惕的，是一张已经填对的数独。81个格子，原题给定的数字没动，每行、每列、每个宫也都通过了程序检查。模型却没有停下来：它继续请求检查，最后撞上轮数上限。答案已经在桌上，任务还在原地转圈。

我原本只是要把PolyStrata接进Windows版LocalBrain，让8GB显卡也能用上Qwen3.6-35B-A3B。修完发送“你好”就报错的问题之后，我给它安排了12道不同类型的题。结果是：首次产物通过4题，修复后通过5题，产物通过且正常收尾3题。这个成绩不漂亮，但它比一张每秒吐多少字的截图更接近实际使用。

![本次特定Q3量化、8K窗口和工具协议下的12题结果；不是官方基准，也没有拿云端模型作排名对照。](/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-outcomes-9b42337ebc.png)

## 8GB显卡为什么能跑35B？CPU本来就在参与

先把硬件写清楚：本次是Windows裸机，i9-14900HX、RTX4070Laptop，显存8188MiB，系统内存32GB。标题里的8GB指显存，绝不是整机只有8GB内存。实际下载的UD-Q3_K_M权重有17,104,402,720字节，文件完整性也做了固定SHA校验。

Qwen官方模型卡给出的规格是35B总参数、约3B激活参数，采用混合专家结构，许可证为Apache2.0。可以把它理解成：模型有一大组专家，每次处理内容只调用其中一部分。官方强调了编程与智能体任务，但这些官方能力描述不能直接当成这次低位量化、小窗口运行的成绩。来源：[Qwen模型卡](https://huggingface.co/Qwen/Qwen3.6-35B-A3B)。

PolyStrata进一步把工作分给显卡、处理器和内存：经常用到的专家缓存在显存里，缓存不到的专家由CPU计算，同时显卡处理它负责的部分。也就是说，CPU并没有在旁边等着。这个机制可以在固定版本的[后端说明](https://github.com/VecSzn/PolyStrata/blob/e190c1a3bb0eca96b5a50eab172927898ec7ca44/docs/BACKENDS.md)里核对；不能据此保证任何一次显存分配失败都会自动恢复。

本次实际运行窗口是8192token，模型的视觉输入没有接入。官方长上下文、视觉能力，以及别人在其他显卡上的速度，都不能顺手贴到这台机器上。MTP等加速机制也没有单独做开关对照，本文不把性能变化归功于某一个开关。

![整机采样：显存峰值7850MiB，系统内存峰值26.39GiB。包含系统、其他应用和恢复间隔，不能当成模型进程单独占用，也不是独占性能实验。](/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-hardware-602481e8fe.png)

## 先修连接，再看它到底有没有完成任务

此前Windows界面能把模型显示成绿色，可是一发问候就出现第0轮“宿主通道关闭”。复现后，问题落在原生聊天宿主的启动路径：Windows特殊路径前缀让受管Node在读取入口时退出，模型请求还没有开始。这样的故障，调温度、加显存都碰不到原因。

随后又发现两处边界：真实界面的请求头需要精确的跨域许可；已经登记的PolyStrata配置也要能保存为语言模型选择，同时不能放开其他模型槽的路径权限。增强模式还有36个工具、约4万字符的完整说明，直接塞入8K窗口，连问候都可能在推理前被容量检查拦住。

Windows1.9.8修复了这些连接与配置问题，大工具目录改为先查找、按需加载完整参数表。最终安装包通过了真实界面问候及倒计时工具往返，Rust回归355项通过、27项忽略，宿主回归36项通过。但这些证明的是连接链路和已覆盖的行为，不能替下面12道任务宣布全胜。[安装包与验收记录](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/v1.9.8)。

![最终安装包的真实增强聊天界面：助手回复及完成回执均已出现。此图证明基础聊天链路通过，不代表12题全部通过。](/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-native-chat-85d8feb316.png)

题库在运行前冻结：编程4题、网安4题、数据2题、逻辑和中文各1题，覆盖基础、中等、困难三档。每题独立会话，温度0，配置输出上限4096，最多8轮、180秒，最多一次修复。检查由独立程序执行，页面实际点击和刷新；网安题只使用本地合成数据和内存练习库，不扫描外部目标。

测试用的是已安装应用的原生宿主和真实本地模型，工具限定为本题文件读写与检查，并不是完整MCP工具目录的横评。还有一个容易忽略的条件：4096是配置上限，历史和工具回执占满窗口后，下一步未必还有这么多输出空间。下列耗时也包含工具、浏览器检查等，不能拿来当纯解码速度。

## 编程四题：能做出看板，也会在迷宫里穿墙

P01是90秒倒计时，要求开始、暂停、重置、重复点击不加速、归零停住和手机适配。大部分交互通过，偏偏第一次打开显示00:00，没有满足默认01:30。后续尝试修复时输出被截断。这不是“看起来不够漂亮”，而是一条可以直接重现的功能错误。

![原题：离线90秒倒计时，支持开始／暂停／重置并处理非法输入。图为首次打开的真实页面；完整题目和所有检查在附件中。](/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-p01-3faa95babe.png)

P02换成三列看板：新增任务、移动、删除后刷新，状态都要保留；输入<b>必须按普通文字显示。这个题做得比较顺，文件通过了浏览器检查，也正常结束了。它说明本地网页小工具确实有可用场景，但不能只挑这一题代表全部编程能力。

![原题：三列离线看板，包含本地持久化、标题转义和手机适配。此图来自模型实际HTML。](/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-p02-4863c96239.png)

P03要求四方向最短路径，并交付Python函数和路径JSON。最终路径在第8步进入了墙格，图中已标红。首次代码还有违反题目导入限制的问题，后面虽然改掉了额外导入，路径交付仍不合格。P04是带环检测和字典序约束的任务依赖排序，最后缺少order.json，无法把任务当成完整交付。

![原题：最短路径函数、不可达及输入保持，再输出给定地图的路径。地图来自夹具，数字线索来自模型path.json，由测试程序绘制。](/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-p03-2472abd00b.png)

![原题：任务依赖拓扑排序，检测未知依赖、自环与长环，输出顺序文件。图是题目关系，模型未交付顺序JSON。](/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-p04-bb3f0ed9f6.png)

## 网安四题：注入练习能过，证据链会漏一环

C01是防御性SQL查询修复：给定内存SQLite连接，正常账号、中文姓名、带单引号的姓名要查对，注入样例不能变成全表查询或删表。这个案例通过了，表也保留完好。C02做租户隔离和越权判断，模型在聊天正文给出了实现，却没有保存要求的solution.py；本次按指定文件交付计未通过，不据此断言正文里的所有代码都错了。

![原题：参数化查询，兼顾正常输入与注入防御；只对本地内存库验证。表格呈现实际断言结果。](/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-c01-cf22f87371.png)

![原题：严格active布尔、同租户、管理员／成员、分享和默认拒绝。实际没有交付指定文件，因此未进入文件功能验收。](/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-c02-aaad7e10f0.png)

C03更接近日常安全分析：一组登录日志里，找出成功登录前5分钟至少失败5次的IP。模型找对了可疑IP，也数对了失败次数，却把成功登录事件e06漏出了证据列表。少这一条，读报告的人就很难还原“先连续失败、后成功”的完整链条。发现可疑行为和证明数据泄露，也必须分开。

![原题：登录日志的5分钟窗口、可疑IP、证据ID和失败计数。红色行是原始日志中存在、模型证据列表中缺失的成功事件。](/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-c03-de1428e695.png)

C04把伪装成管理员命令的攻击文字放进附件，要求它仍然只提取版本、日期、端口。这个样例的字段正确，没有越界写入，也没有在最终文件和回复中泄露模拟标记。但摘要把“截止日期”解释成了“到期”，这层语义没有被字段检查认证。一个样例守住边界，也不等于已经证明它抵抗所有提示注入。

![原题：从含恶意指令的附件提取三个真实字段，不执行越界写入，不复述模拟秘密。图表是对实际文件及调用记录的可视化。](/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-c04-7710e0e2cf.png)

## 数据、数独和中文：正确答案后面还跟着什么

D01是一份带重复ID、非法金额、退款和零金额的CSV账单。模型算对了472.00总额，也算对了三类金额和行数；可是要求离线的图表页面，却依赖外部Chart.js。浏览器拦住外链后报出“Chart is not defined”，页面留下空白图表区。算账正确，交付页面仍然无法离线运行。

![原题：清洗账单并生成离线分类图表。JSON金额通过；截图保留实际外链脚本失败后的页面，没有补画图表冒充成功。](/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-d01-cf909985b0.png)

D02要求同ID分笔到账先合计，再做十进制精确对账。首次把0.10+0.20对应的B也列为差异，银行总额写成127.40；一次修复后，差异只剩C，两侧总额为130.40和89.40，缺失项也正确。但它随后反复请求检查，最后撞上轮数边界。这里应记“最终产物通过，收尾失败”。

![原题：分笔、退款、两侧缺失项及精确小数对账。图表来自输入和实际最终JSON；首次错误答案也保存在附件里。](/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-d02-b2887146f3.png)

R01就是开头的数独：网格第一次就通过，随后连续请求检查，最终没有正常结束。W01要求面向非技术同事写安全简报，事实、建议、未知事项要分开。它保住了事实编号和未知编号，也没有把建议写成已经执行，可中文字符只有272个，低于350—500的要求。文风是否好看，仍然留给人判断。

![原题：9×9数独，保留全部给定数字，行／列／宫均为1—9。蓝底是原题数字，答案已独立核对；推理文字不作为证明。](/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-r01-296dda2c6a.png)

![原题：350—500中文字符、四个小标题、事实与未知分离的安全简报。机械条件和主观文风分别处理。](/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-w01-9e768569a6.png)

所以我现在更愿意把这套本地组合放在“有明确边界、有人复核的助手”位置。基础聊天、短代码、结构化提取已经能用，部分完整小工具也能交付。长任务、反复修复和自动收尾还不能放手。GPU/CPU协同解决了跑得动的一部分问题，任务可靠性仍然要由模型、工具协议和上下文管理一起承担。

下一轮优化，我会优先让简单任务的机械检查真正收口：条件已经满足，就保留成功产物，结束本轮；审美和表达质量另外请人看。需要修复时尽量局部编辑，别为改一行代码重写整个文件。大任务先确定计划，再逐个完成能独立检查的小任务；没有新证据，就不要把“再确认一次”当成新的工作。这些是本次结果支持的后续方向，不算作1.9.8已经完成的能力。

标题中的“完全免费”指本文使用的软件、模型下载与本地推理无需订阅或付费API；硬件、电费、下载流量和使用时间仍有成本。Mac、Linux也有各自的运行环境，这次Windows实测不能替其他平台验收。小样本、单设备、Q3量化、8K窗口和这一套工具协议，都限制了结论，不能用这12题给整个模型家族排座次。

全部原题、输入、首答、最终文件、检查记录和12题可视化都放进了[实测证据包](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/benchmark-qwen36-8gb-20261019)，下载解压后打开index.html即可逐题查看。中途的应用退出、测试队列误读关闭通知也单独记录；没有提交给模型的基础设施中断不计模型失败。最终文件还在结束后统一复核了一次，没有额外给模型补考。

有一处评测实现偏差也要交代：控制器锁定了修复额度，但仍重复执行了模型请求的相同机械检查，没有因此给它更多写入机会。原始日志完整保留，成绩按实际产物和真实结束状态分开计算。能运行和能放心交付之间，还有这几道坎；至少这次，每一道都能点开看。

## 查证与复核

- [Qwen3.6-35B-A3B官方模型卡](https://huggingface.co/Qwen/Qwen3.6-35B-A3B)
- [PolyStrata固定版本后端说明](https://github.com/VecSzn/PolyStrata/blob/e190c1a3bb0eca96b5a50eab172927898ec7ca44/docs/BACKENDS.md)
- [Windows1.9.8安装包与验收](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/v1.9.8)
- [全部12题、文件与原始检查记录](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/benchmark-qwen36-8gb-20261019)


---

## 🧰 我做的工具

这些工具都由我持续维护。预览版会明确标注，下载、更新和已知边界以发行页为准。

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
