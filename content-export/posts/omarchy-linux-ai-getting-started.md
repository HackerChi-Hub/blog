---
title: Omarchy：免费 Linux 玩转 AI
slug: omarchy-linux-ai-getting-started
status: published
date: 2026-09-07
updated: 2026-09-07
summary: 从安装、快捷键到编程助手与本地模型，讲清 Omarchy 的特色和上手边界。
categories:
  - 技术分享
tags:
  - AI
  - Linux
cover: /obsidian-assets/omarchy-linux-ai-getting-started/cover-f4fa1d8b83.jpg
legacy_paths: []
---

> [!abstract]
> 从安装、快捷键到编程助手与本地模型，讲清 Omarchy 的特色和上手边界。
> 黑粉科技 · 2026-09-07

想拿一台电脑折腾 Linux，又想把 AI 编程、本地模型和日常办公放在同一个桌面里，我会先看它能不能把这几件事顺畅地接起来。Omarchy 值得研究的地方就在这里：窗口、终端、主题和 AI 入口都有现成安排，装好之后可以直接顺着这套习惯开始用。

名字先认准：**Omarchy**。它由 DHH 发起，以 Arch Linux、Hyprland 和 Quickshell 为基础。Arch 提供系统与软件包，Hyprland 管理窗口，Quickshell 支撑桌面组件。官网当前下载入口是 4.0.2；下面按 2026 年 9 月 7 日的官方手册说明操作，不把官方演示写成我的硬件实测。

参考：[项目介绍与当前下载](https://omarchy.org/)

## 一、先看桌面：省掉的主要是搭配时间

![官方手册保留的旧版示意图（画面为 3.x）：浏览器与终端自动并排。来源：Omarchy Navigation，查阅于 2026-09-07。](/obsidian-assets/omarchy-linux-ai-getting-started/image-desktop-2b9edca2aa.png)

![官方手册保留的旧版示意图（画面为 3.x）：Super + J 把窗口叠放。来源：Omarchy Navigation，查阅于 2026-09-07。](/obsidian-assets/omarchy-linux-ai-getting-started/image-stacked-ff3c780f98.png)

打开终端，再打开浏览器，窗口会自动分配位置。你可以左边读文档，右边执行命令；换到另一个工作区，再放编辑器和项目。对经常在网页、终端与代码之间切换的人，这比反复拖动窗口更容易形成固定动作。鼠标依然能用，但键盘才是这套桌面的主要入口。

它还有一套统一换装的方式。在主菜单选择 **Style → Theme**，主题会联动桌面、终端、Neovim 和顶栏等组件。Obsidian 需要在应用自己的 Appearance → Themes 中手动选择 Omarchy 主题。这个小差别先记下，避免看到笔记没有变色，就以为系统出错了。

参考：[窗口导航](https://omarchy.org/manual/navigation/)

参考：[主题设置](https://omarchy.org/manual/themes/)

![官方主题预览：主题会同时改变桌面、终端和顶栏。来源：Omarchy Themes，查阅于 2026-09-07。](/obsidian-assets/omarchy-linux-ai-getting-started/image-theme-c8f0eef494.png)

日常软件也不只围着写代码转：官方列出了 Chromium、Obsidian、LibreOffice、Kdenlive 和 OBS Studio。默认编辑器是 Neovim，但你不必为了用系统先学会 Vim；菜单里还能安装其他编辑器。开发语言版本交给 Mise 管理，不同项目可以使用各自需要的环境。

参考：[预置应用与系统组成](https://omarchy.org/manual/)

参考：[开发工具](https://omarchy.org/manual/development-tools/)

我的判断是，它适合愿意学习快捷键、想把开发环境搭起来的人。只需要浏览器和办公软件，也能使用这些应用，但没有必要仅仅为了“AI”就更换主力系统。先检查你离不开的软件、输入法、外设和游戏，再决定是否迁移。

## 二、安装：先决定是否保留原系统

先从官网进入下载页，取得 ISO 安装镜像，并核对同页提供的 SHA-256。Windows 可以在 PowerShell 中运行下面的命令，把文件名换成实际下载文件；输出哈希必须与该版本官网值完全一致。

```powershell
Get-FileHash .\omarchy.iso -Algorithm SHA256
```

用 balenaEtcher 把镜像写入 U 盘，写入会清除 U 盘内容。重启电脑，从固件启动菜单选择该 U 盘。启动前阅读当前安装页的 Secure Boot 要求；涉及 Windows 加密的机器，先保存恢复密钥和重要数据，别在不了解影响时清除 TPM。

![官方手册安装示意图（界面可能与当前版本不同）：确认设置后才进入安装。来源：Omarchy Getting Started，查阅于 2026-09-07。](/obsidian-assets/omarchy-linux-ai-getting-started/image-install-cb00b2f54e.png)

接下来跟着安装器填写键盘布局、用户和密码等信息。**真正需要放慢手的是选盘这一步：Full-disk 会清空选中的整块硬盘。** 新手用一块专门的空盘更好判断，核对型号与容量后再确认。安装默认启用加密，开机解锁要准备有线或带 2.4GHz 接收器的键盘，不能指望蓝牙键盘在这一阶段输入密码。

参考：[官方安装流程](https://omarchy.org/manual/getting-started/)

如果要保留 Windows，同盘双系统在当前手册中有正式流程：先在 Windows 磁盘管理里压缩卷，留出未分配空间；进入安装器后选中对应磁盘，再选择 **Free space install**。不要把“空闲空间安装”与“整盘安装”看成一回事。官方的 50GB 只是演示容量，准备存本地模型时还要另外留空间。

该流程要求先在 Windows 关闭 BitLocker／设备加密，并等待解密完成。机器受到单位管理时，先确认自己能否改这项设置。安装完成后，如果 Limine 启动菜单没有列出 Windows，可按手册运行下面的扫描命令，依提示添加启动项。

```bash
limine-scan
```

参考：[保留 Windows 的双系统流程](https://omarchy.org/manual/dual-boot-install/)

## 三、进桌面后，先练这几个动作

Super 通常就是 PC 键盘上的 Windows 键。先打开菜单、终端和浏览器，再练切窗口，不用第一天背整张快捷键表。下表按当前官方快捷键页整理；自己改过绑定后，以本机设置为准。

| 要做什么 | 快捷键 |
| --- | --- |
| 打开主菜单 | Super + Space |
| 打开终端 | Super + Return |
| 打开浏览器 | Super + Shift + Return |
| 打开文件管理器 | Super + Shift + F |
| 切换焦点窗口 | Super + 方向键 |
| 切换工作区 | Super + 数字 |
| 把窗口移到工作区 | Super + Shift + 数字 |
| 关闭当前窗口 | Super + W |
| 打开网络面板 | Super + Ctrl + W |

参考：[完整快捷键表](https://omarchy.org/manual/hotkeys/)

可以照着练一次：在工作区 1 打开浏览器和终端，按 Super + 方向键切换焦点，把终端移到工作区 2，再切过去继续操作。练完这一轮，你就能做到“文档留在一个地方、项目留在另一个地方”，而不是桌面越用越挤。

联网后先在主菜单的 **Update → Omarchy** 更新。新安装默认使用 stable；官方还提供 RC、edge 和 dev 通道。第一次使用保持 stable 就行，先让浏览器、声音、输入和睡眠恢复正常，再折腾更新更快的通道。装好系统的验收点，应当是你能完成日常任务。

参考：[更新与通道说明](https://omarchy.org/manual/updates/)

![官方更新提示示意图：稳定版更新从主菜单进入。来源：Omarchy Updates，查阅于 2026-09-07。](/obsidian-assets/omarchy-linux-ai-getting-started/image-update-dc323e8289.png)

## 四、AI 怎么用：先完成一个小项目

当前系统为 Claude Code、Codex、OpenCode 等编程 Agent 准备了延迟安装启动入口，第一次调用时才下载对应工具。**有入口不等于送模型额度**：使用哪家的模型，就按哪家的登录、订阅或 API 规则处理。先选一个工具跑通，没必要把所有名字都安装一遍。

![官网收录的 Omarchy 功能演示缩略图：能看到终端、脚本和系统界面。它是第三方视频索引，不是我的实机测试截图。来源：Omarchy 官网，查阅于 2026-09-07。](/obsidian-assets/omarchy-linux-ai-getting-started/image-agent-demo-7f0d237666.png)

![社区插件预览：Agent Usage 把 Claude 与 Codex 的额度、重置倒计时和用量放进 Omarchy 顶栏。它是可选插件，不代表系统默认已安装。来源：Omarchy Plugins，查阅于 2026-09-07。](/obsidian-assets/omarchy-linux-ai-getting-started/image-agent-usage-7d04cc7306.png)

可以从 OpenCode 开始。在终端创建一个独立练习目录，进入后启动工具；首次运行跟随它的连接提示选择供应商并完成认证。这里使用完整命令，不使用自动批准操作的快捷别名。

```bash
mkdir -p ~/Work/omarchy-demo
cd ~/Work/omarchy-demo
opencode
```

登录完成后，给它一个容易验收的任务：

> 请先给计划：在当前目录创建一个中文待办清单网页，只使用 HTML、CSS 和 JavaScript，不添加第三方依赖。需要新增、完成、删除任务，并在刷新后保留记录。执行前说明准备创建哪些文件。

看过计划后再让它执行。完成后打开它生成的页面，亲手新增两条任务、完成一条、删除一条，再刷新检查记录。按钮不能用或者刷新后丢数据，就把复现动作和报错交回去修。这里的关键是把“写完了”变成你能检查的结果；网页只是练习题，不是已经跑过的案例。

想让系统记住常用 Agent，可以进入 **Setup → Defaults → Agent**。不过官方 AI 页明确说明：默认 Agent 快捷入口，以及 a、c、cx、cy 等便捷启动方式可能采用无人值守或自动批准模式。新手先用完整命令，并在工具里选择计划模式或逐项审批；一句“先别修改”不能替代实际权限设置。

内置 Omarchy Skill 能帮助 Agent 理解系统配置，适合从解释现有设置、提出主题修改计划开始。让它动手前先备份相关文件，只改一个目标。官方把这项技能标为实验性，不应把“能读配置”理解成“必然改对”。

![社区插件示例：Omarchy Pets 在顶栏和窗口里运行。它说明插件可以成为系统的一部分；如果让 Agent 辅助定制，仍要逐个审查权限和维护状态。来源：Omarchy Plugins，查阅于 2026-09-07。](/obsidian-assets/omarchy-linux-ai-getting-started/image-plugin-pets-894c2776ab.png)

![社区插件预览：Genesis 把语音指令交给 Claude Code、Codex 或 Gemini 等编码 Agent 执行。它需要额外配置且未验证，适合用来理解 Omarchy 的扩展边界，不应直接当作默认能力。来源：Omarchy Plugins，查阅于 2026-09-07。](/obsidian-assets/omarchy-linux-ai-getting-started/image-genesis-ea64100f40.png)

这套设计的最大变化，是 Agent 的工作范围从“改一个项目目录”扩展到了“读懂并修改桌面本身”：主题、顶栏、Hyprland 配置、Quickshell 插件和崩溃日志都能进入同一个工作流。官方主页还把“崩溃通知 → 默认 Agent 分析 coredump → 决定是否报告”列为系统能力。实际使用时要把它当成辅助诊断，不要把 Agent 的判断当成安全审计结论。

参考：[Agent 入口、默认设置与权限边界](https://omarchy.org/manual/ai/)

## 五、本地 AI 和语音输入，怎样开始

云端编程助手与本地模型是两条路线。前者依赖对应服务，后者把模型下载到自己的电脑再推理。系统菜单的 **Install → AI** 提供 LM Studio 与 Ollama 安装入口。选图形界面可以从 LM Studio 开始：找模型、下载、加载，再在聊天页发问；每个模型是否适合你的内存和显卡，还要单独判断。

参考：[LM Studio 使用入门](https://lmstudio.ai/docs/app)

如果偏好终端，可以选择 Ollama。先用一个小模型验证下载、服务和对话流程，不必追求参数最大。下面用官方模型库仍可获取的 qwen3:0.6b 作为入门示例；它不是这台机器上的性能测试，也不代表高质量编程能力。

```bash
ollama run qwen3:0.6b
```

第一次运行需要联网下载。进入对话后，可以让它“用三句话解释 Linux 工作区”；输入 /bye 退出，再用下面的命令查看本机已有模型和当前加载状态。看得到模型、能返回文本，才说明基础链路走通。

```bash
ollama list
ollama ps
```

参考：[Ollama 快速开始](https://docs.ollama.com/quickstart)

参考：[Qwen3 小模型入口](https://ollama.com/library/qwen3:0.6b)

要判断能否离线使用，就在下载完成后断网重复同一个问题。这个测试只针对你选择的本地模型；它不能证明浏览器、云端 Agent 或其他插件都不联网。模型文件之外还需要运行内存，长上下文会进一步增加占用，不能直接拿下载包大小当成显存需求。

参考：[Ollama 内存、上下文与本地运行说明](https://docs.ollama.com/faq)

![官方手册文字提取示意图（界面可能与当前版本不同）：框选屏幕区域后识别文字。来源：Omarchy Text Extraction & Dictation，查阅于 2026-09-07。](/obsidian-assets/omarchy-linux-ai-getting-started/image-ocr-0203ea0068.png)

另外两项功能很实用：按 **Super + Ctrl + PrtScr** 框选屏幕区域，系统用 Tesseract OCR 把识别结果放进剪贴板。适合从截图里取一段地址或文字，粘贴前仍要检查错字，尤其是命令和数字。

语音输入从 **Install → AI → Dictation** 安装 Voxtype。安装后按住 F9 说话，或者用 Super + Ctrl + X 切换听写。官方默认模型偏英语，想说中文先运行 voxtype setup model 选择合适的多语言模型，再在普通文本框试一句话。不要默认认为装完就有准确的中文听写。

```bash
voxtype setup model
```

参考：[OCR 与语音听写](https://omarchy.org/manual/text-extraction-dictation/)

## 六、更新和 AI 改配置，都要留后路

系统每次更新会自动建立快照，也可以手动运行下面的命令。需要恢复时，从 Limine 启动菜单选择对应日期的快照，进入后跟随恢复通知操作。这适合处理系统更新后无法正常工作的情况。

```bash
omarchy-snapshot create
```

**快照恢复的是根文件系统，不包含 /home。** 你的文档、项目和 ~/.config 仍然需要独立备份。因此，AI 改坏个人配置后，回滚系统未必能解决。先复制待改文件、记下恢复位置，再让 Agent 修改；项目则用 Git 记录修改前后的差异。

![社区备份插件示例：Time Machine 提供 restic 定时备份和快照浏览。它不是 Omarchy 默认功能，适合用来理解插件如何补齐系统工作流。来源：Omarchy Plugins，查阅于 2026-09-07。](/obsidian-assets/omarchy-linux-ai-getting-started/image-plugin-time-machine-c7cbbc7568.png)

参考：[快照覆盖范围与恢复办法](https://omarchy.org/manual/system-snapshots/)

![官方快照恢复界面：从 Limine 选择日期和版本。来源：Omarchy System Snapshots，查阅于 2026-09-07。](/obsidian-assets/omarchy-linux-ai-getting-started/image-snapshot-47f455d20e.png)

初次使用，我建议按这个顺序验收：能联网和正常输入；能用快捷键管理窗口；练习项目的按钮与保存功能可用；本地小模型能回答问题；最后确认配置备份在哪里、如何恢复。通过这些动作，再考虑把真实工作迁进来。

这套 Linux 对 AI 用户的吸引力，是把工具入口和桌面操作组织在了一起。你仍然需要挑模型、看费用、验收结果，也仍然要维护自己的数据。愿意学这些，就先拿练习环境做出一个小成果；完成一次从操作到验收的过程，比收集一长串预装软件名字更有用。

## 七、补一组可复核的使用记录

我在写稿时做了四项可复核检查：下载官方手册截图并核对真实文件格式；读取截图尺寸和 SHA-256；逐个请求正文里的官方链接；对照当前 AI 手册核对 Agent 命令、快捷键和快照边界。它们验证的是资料和发布链路，不等于我已经在实体 Omarchy 机器上完成安装。

| 检查 | 结果 | 意义 |
| --- | --- | --- |
| 官方截图下载 | navigation / themes / updates / snapshots / OCR 均返回 200，并能被 Pillow 解码 | 图片不是网页占位或损坏文件 |
| 版本核对 | 官网当前下载入口为 Omarchy 4.0.2；AI、安装和更新页可访问 | 文章按当前手册写，旧版截图单独标注 |
| 本地模型入口 | Ollama 官方页面列出 qwen3:0.6b，页面显示 523MB、Q4_K_M、Apache 2.0 | 可先用小模型验证链路，不把它当性能测试 |
| 风险回退 | 官方说明快照不恢复 /home；AI 手册把 Omarchy Skill 标为 experimental | 配置和项目仍要单独备份，Agent 先计划再改 |

为了让读者自己复现，我把流程压成一条最小验收链：先从官方 ISO 页核对 SHA-256，再完成一次快捷键窗口切换；安装 Ollama 后运行 qwen3:0.6b，执行 ollama list 和 ollama ps；最后创建一个快照，确认能在 Limine 里找到它。每一步都有一个可见结果，任何一步失败都停下来修，不要继续往真实项目里迁移。

---

### 黑粉科技的自制工具

下面是黑粉科技维护的工具入口；它们不是 Omarchy 的预装软件，系统兼容性请以各自发行页为准。

- [黑粉剪辑 HyphenCut](https://github.com/HackerChi-Hub/HyphenCut-Releases/releases)：对话式视频剪辑器，自带 MCP，可由 Agent 驱动。
- [黑粉盒子 HyphenBox](https://github.com/HackerChi-Hub/hyphenbox-release/releases)：免费模型 API 雷达与本地统一路由。**初步构建 · 预览版**。
- [方寸智匣 LocalBrain](https://github.com/HackerChi-Hub/localbrain-releases/releases)：本地 AI 工具箱，集中管理转写、配音、生图、视频和 MCP。
- [ScreenLex 光影词库](https://github.com/HackerChi-Hub/screenlex-download/releases)：把本地电影字幕整理成可复习的英语词库，离线使用。
