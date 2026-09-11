---
title: 本地 H3 多参考图实测：4 张图全用上了，3 秒视频跑 10 分钟
slug: localbrain-h3-multi-reference
status: published
date: 2026-09-11
updated: 2026-09-11
summary: LocalBrain 1.2.65 能在本机跑 MiniMax H3 的多参考图版（REF2VA），一次最多 9 张图。我在 64 GB 的 M5 Pro 上用 0、1、2、4 张参考图各生成一条 960×544 的 3 秒视频，把耗时、内存、被照搬的细节和 Turbo 不能开的原因原样摆出来。
brand_slogan: "让AI成为你的超能力"
categories:
  - 技术分享
tags:
  - AI
  - 本地部署
  - 自制软件
  - LocalBrain
  - AI视频
cover: /obsidian-assets/localbrain-h3-multi-reference/cover-ee30fcef58.jpg
legacy_paths: []
---

> [!abstract]
> 把人物、房间、道具的图片按顺序交给本机的 MiniMax H3，它按图生成带立体声的视频。4 张参考图、3 秒视频，64 GB 的 M5 Pro 跑了 601.8 秒，四样东西都在画面里，连墙上的 Logo 牌也搬了过来。
> 2026-09-11·黑粉科技

# 本地 H3 多参考图实测：4 张图全用上了，3 秒视频跑 10 分钟

![4 张参考图生成的 3 秒视频（动图，已去掉音轨）：她抱着毛绒牛头放到开发板旁边，再抬头冲镜头笑。人物、牛头、房间和开发板分别来自 4 张参考图](/obsidian-assets/localbrain-h3-multi-reference/image-anim-4ref-3985748cc3.webp)

9 月 11 日傍晚，我把 4 张图交给 LocalBrain 的本地 H3 视频后端：一张汉服人像、一个毛绒牛头、一间白墙配木条的房间、一块带散热片的开发板，要一条 3 秒视频。601.8 秒后，画面里的她抱着牛头放到开发板旁边，抬头冲镜头笑了一下。四样东西一样没丢，连房间右上角那块黑粉科技 Logo 牌都原样搬了过来。

先说结论：**多参考图在 64 GB 的 Mac 上能跑通，参考图越多越像，也越慢。**4 张图比纯文字多花 35% 的时间、可用内存多降 9.3 GB；它还会照搬参考图里的细节，想要的、不想要的一起搬。这个功能 1.2.64 就上了，1.2.65 修好了第一次生成时的耗时预估。

## ▍多参考图到底是什么

MiniMax H3 是 MiniMax 放出开放权重的音视频生成模型：画面和 32 kHz 立体声一起生成，24 帧每秒，官方标称时长 4～15 秒。它有两个检查点，**是两个模型，不是一个模型的两种模式**：

| 检查点 | 能吃什么 | 适合 |
| --- | --- | --- |
| FL2VA（首尾帧） | 纯文字，或 1～2 张图当开头、结尾那一帧 | 定好开头结尾，中间让模型补 |
| REF2VA（多参考图） | 最多 9 张图、3 段视频、3 段音频，合计不超过 12 个文件 | 给一套人物、场景、道具，按描述重新拍 |

打个比方：FL2VA 像交给摄影师两张定格照片，请摄影师把中间补齐；REF2VA 像交给剧组一本设定集，主角、房间、道具长什么样都定好了，镜头和动作按剧本重新拍。

同一量化档位下，两个包除了中间那个 33B 的生成模型（DiT），其余文件完全一样，看文件夹根本分不出来。LocalBrain 只认模型包里 `config.json` 的 `tasks` 字段：声明了 `ref2va` 就显示多参考图，否则保留原来的纯文字、首帧、首尾帧和分段拼接。两个包可以同时装，工作台里随时切换。

完整的 H3 其实分三段：H3-Context-IR 先把你的文字、图片、音视频读懂，改写成结构化描述；H3-Base 按描述生成 768p 视频；H3-Regenerate-2K 再把结果重生成到 2K。**本机能跑的只有中间这段 H3-Base。**Context-IR 是 MiniMax 托管的服务，不在开源范围里；2K 重生成官方说准备好了再放。

![MiniMax 官方系统图：上下文理解（H3-Context-IR）→ 基础生成（H3-Base，768p）→ 高分辨率重生成（H3-Regenerate-2K）。本机能跑的只有中间的 H3-Base。图源：MiniMax-H3 GitHub](/obsidian-assets/localbrain-h3-multi-reference/image-official-overview-b32290cdab.png)

这带来一个直接后果：官方链路里替你把大白话改写成结构化描述的那一步，本地没有。REF2VA 吃的是六段式英文描述，得自己写，后面会讲 LocalBrain 怎么帮你起头。

## ▍这次怎么测

- **机器与软件**：M5 Pro，64 GB 统一内存；mlx-serve 26.8.4；ddalcu 转换的 REF2VA 8bit 包，整包 69.3 GB。
- **固定参数**：960×544、73 帧（3.04 秒）、30 步、种子 42，加速缓存打开。
- **描述**：按每组的参考图各写各的。0 张和 1 张是同一个场景（木回廊里慢慢走、回头微笑），可以直接对比；2 张换到参考图里的房间转身行礼；4 张是抱着牛头放到开发板旁。
- **请求路径**：测试脚本直接调用 LocalBrain 的视频桥接层，界面和 MCP 最后都经过这一层。界面另外逐项点过，确认它发出的参数（参考图顺序、30 步、不开 Turbo）和测试请求一致。
- **记录什么**：从发请求到拿到视频的耗时、生成期间可用内存的最大降幅；每条视频均匀抽 6 帧逐张看，参考图里的特征有没有出现。

这次证明不了的也先说清：每组只跑了一次，种子固定，说明不了成功率；3 秒比官方标称的 4 秒下限还短，是为了压住每组的等待时间，正式出片建议 4 秒以上；没测超过 4 张图，也没测别的分辨率；声音只核对了规格（32 kHz 立体声、和画面等长），好不好听不在这次结论里。

## ▍0、1、2、4 张参考图：结果原样摆出来

| 参考图 | 耗时 | 比纯文字多 | 内存降幅 | 画面里出现了什么 |
| --- | --- | --- | --- | --- |
| 0 张（纯文字） | 446.6 秒 | — | 29.1 GB | 一位泛泛的汉服女子，脸和参考图无关 |
| 1 张：人物 | 491.1 秒 | +10% | 34.0 GB | 高发髻、花簪、米白绣花外袍、青绿内裙、橙色系带都在，脸型接近 |
| 2 张：人物＋房间 | 501.9 秒 | +12% | 34.8 GB | 房间几乎照搬第 2 张，人物来自第 1 张，转身、行礼按描述走 |
| 4 张：人物＋牛头＋房间＋开发板 | 601.8 秒 | +35% | 38.4 GB | 四样全在：她抱着牛头放到开发板旁，再抬头笑 |

> 内存降幅是生成期间可用内存的最大降幅。四条视频都是 960×544、73 帧，都带 32 kHz 立体声音轨。

![四组对照：左边是交给模型的参考图，角标就是 Picture 编号；右边是同一条视频里的 3 帧](/obsidian-assets/localbrain-h3-multi-reference/image-summary-fb212461b6.jpg)

最直观的是前两行。纯文字那组，描述里只写了“淡桃色汉服、木回廊”，模型给了一位标准的汉服女子，好看，但和参考图不是一个人。加上 1 张人物图，发髻上的花簪、外袍的刺绣、青绿内裙和橙色系带全对上了；脸型接近，细看五官还有差别，谈不上一模一样。

![同一个种子、同一个场景：左为参考图，中为不给参考图的结果，右为给 1 张参考图的结果](/obsidian-assets/localbrain-h3-multi-reference/image-compare-1ref-6a0a60d9aa.jpg)

有一点要交代：按官方格式，1 张图那组的角色定义里也用文字写了发髻、花簪、青绿内裙和橙色系带，所以服饰对上不全是图的功劳；脸型、花簪的样式和外袍上的刺绣，只能从图里来。

为什么参考图越多越慢？官方架构图画得很清楚：参考图先过视觉编码，和文字一起排进同一条序列，再跟待生成的视频、音频一起送进 33B 的 Transformer。序列越长，每一步都更慢。

![MiniMax 官方 H3-Base 架构图：文字、参考图、参考音频编码后排进同一条序列（第 02 层），和待生成的视频、音频潜变量一起进入 33B 的 H3 Omni Transformer。图源：MiniMax-H3 GitHub](/obsidian-assets/localbrain-h3-multi-reference/image-official-arch-5bd8e4077a.png)

本机日志把这件事量化了：每张参考图在序列里多出 384～512 行，4 张合计 1908 行。30 步采样里，加速缓存直接复用了 13～14 步，这些步只要几毫秒；另有 7 步只复用注意力。要完整计算的一步，纯文字 31.6 秒，4 张图 47.6 秒，涨了 51%；复用的那十几步几乎不受影响，所以总耗时只涨 35%。

内存这边，装载时先上文本编码器（Qwen3-VL-32B 的 8bit 版，常驻 26.57 GB），编码完立刻释放，再装 DiT（常驻 20.46 GB），两者不同时占着。官方说 33B 里约有 13B 在 AdaLN 调制分支，推理时可以先算好再卸掉，本机日志里正好有一行“13B modulation weights released”。参考图加长了序列，采样时的中间结果跟着变大，4 张图把可用内存降幅从 29.1 GB 推到 38.4 GB。

## ▍它会照搬：想要的和不想要的

2 张图那组，我原本只想借房间的白墙和木条。结果左边搁板上的银色小主机、右上角的 Logo 牌，全都出现在生成画面里。Logo 的图形保住了，下面“黑粉科技”四个小字糊成了认不出的笔画。这两样东西，描述里我一个字没提。

![参考图里的银色小主机和 Logo 牌，都被原样搬进了生成画面；Logo 图形保住了，下方中文小字没保住](/obsidian-assets/localbrain-h3-multi-reference/image-copy-details-7487b72fa1.jpg)

照搬正是 REF2VA 的本职：参考图里有什么，它就尽量留什么。官方写法指南把保留程度分成四档，完全保留（`fully_preserved`）、部分保留（`partially_preserved`）、特征迁移（`attribute_transfer`）和弱参考（`weak_reference`），要在描述里逐项写明。我这几组写的都是完全保留，结果也确实一件不落；换成弱参考会少搬多少，这次没测。

三条用法：

- **不想出现的东西，先从参考图里裁掉。**Logo、水印、文字、路人都算，这次描述里没提的 Logo 照样被搬了进来；
- **参考图不用追求大图。**推理端按目标尺寸只缩不放：768×512 原样用，1920×940 缩到 1024×512，824×1031 缩到 640×800，给再大的图也不会多出细节；
- **顺序就是编号。**第 1 张就是 `<Picture 1>`，描述里靠编号指代，调换顺序就等于换了角色。

## ▍Turbo 为什么不给开

FL2VA 包里带着一个 Turbo LoRA，4 步就能出片，是首尾帧模型的默认档。REF2VA 的官方包没带它，mlx-serve 的代码也只给不支持参考图的模型开 Turbo，注释写着 LoRA 没在 REF2VA 上验证过。那我就动手验证一次：把 FL2VA 的 Turbo LoRA 临时放进 REF2VA 目录，用 1 张参考图、同一个种子跑 4 步。

![同一张参考图、同一个种子：完整采样 30 步（491.1 秒）对比 Turbo LoRA 4 步（207.5 秒）。后者快 2.4 倍，但满屏块状伪影，脸上出现色斑](/obsidian-assets/localbrain-h3-multi-reference/image-turbo-1d6a441ab9.jpg)

207.5 秒，快了 2.4 倍，画面却没法用：满屏块状伪影和色块噪点，脸上长斑，只有发簪和配色还认得出来。所以 LocalBrain 定的规则是：包里有 Turbo LoRA，**并且**没声明 `ref2va`，才提供 Turbo。就算有人把 LoRA 文件复制进 REF2VA 目录，界面也不会默认勾上，勾选框旁边写明原因。测完我把目录恢复成了上游原样的 15 个文件。

## ▍在 LocalBrain 里怎么用

第一次听说 LocalBrain，可以先看[[localbrain-local-ai-box|这篇介绍]]。已经装了的，应用内会提示更新到 1.2.65。

1. **下载模型。**「发现」页找「MiniMax H3 REF2VA · 多参考图」。整包约 69 GB，卡片按 GiB 标 64.5；最低 64 GB、建议 96 GB 内存。
2. **打开工作台。**对话框里输入 `/工具` 打开「本地多媒体工具」，切到「视频生成」，模型选 REF2VA，「生成方式」选「多参考图（人物/风格/场景，最多 9 张）」。首尾帧模型那边原来的四种方式不受影响。
3. **加参考图。**点「＋ 添加参考图」，可以一次多选 PNG 或 JPEG。缩略图角标就是 `<Picture N>`，← → 调顺序，✕ 删除；重复的、超过 9 张的会提示“已跳过 N 张”。

![多参考图模式：4 张参考图按顺序编号为 Picture 1～4，可以左右调序、删除；下方按钮一键套用六段式模板](/obsidian-assets/localbrain-h3-multi-reference/image-ui-picker-fc34ab0903.png)

4. **写描述。**先用一句话写你要的画面，再点「套用参考图提示词模板」：LocalBrain 生成六段式骨架，每张图先占好一个 `<Subject N>`，你写的那句放进 `[Shot 1]`。剩下的就是给每个 Subject 补外观特征，官方建议全用英文。下面是 4 张图那组的原文，可以照着改：

```text
subject_definitions:
<Subject 1> is the young woman in <Picture 1>, with black hair in a high bun decorated with small floral hairpins, a pale peach Hanfu robe over a turquoise inner skirt and an orange sash.
<Subject 2> is the plush yellow bull mascot head in <Picture 2>, with fuzzy golden fur, short curved grey horns and a cream muzzle.
<Subject 3> is the bright minimal studio in <Picture 3>, with a plain white wall, vertical light-wood slat panels and a small potted plant.
<Subject 4> is the small black single-board computer with a finned heatsink in <Picture 4>.

summary:
[reference generation] The target video is a single shot of <Subject 1> in <Subject 3>, holding <Subject 2> and setting it down on a desk beside <Subject 4>.

retention_analysis:
<Subject 1> (appears in [Shot 1]): fully_preserved - her face, high bun with floral hairpins and pale peach Hanfu robe are retained.
<Subject 2> (appears in [Shot 1]): fully_preserved - its golden fur, grey horns and cream muzzle are retained.
<Subject 3> (appears in [Shot 1]): fully_preserved - the white wall, light-wood slats and potted plant are retained as the setting.
<Subject 4> (appears in [Shot 1]): fully_preserved - the black board and its finned heatsink are retained.

detailed_description:
The target video is in a realistic cinematic style with soft natural light.
[Shot 1] A medium shot frames <Subject 1> in <Subject 3>, holding <Subject 2> against her chest with both hands. She steps to a low wooden desk, sets <Subject 2> down beside <Subject 4>, then looks up at the camera and smiles as the camera slowly pushes in.

overall_soundscape:
Quiet room tone, soft footsteps, the rustle of silk and a light soft thud as the plush head is set on the desk.

non_diegetic_music:
N/A
```

官方建议 `detailed_description` 写 350～500 个英文词，我这条只有 60 来个词，简单的单镜头够用。嫌写英文累，可以把 MiniMax 官方的 `h3-prompt-writing` 技能装进 Claude Code 或 Codex，让它按官方的 Ref2VA 写法指南帮你写，写好贴回来：

```bash
npx skills add https://github.com/MiniMax-AI/MiniMax-H3 --skill h3-prompt-writing
```

5. **看预估，再运行。**试描述时用 3～4 秒最省时间，定稿再拉长。官方标称 4～15 秒；LocalBrain 按本机内存和单次响应上限，算出这台机器在 960×544 下单次最长 20 秒。步数默认 30、上限 50，Turbo 灰掉并写明原因。

![高级选项：步数默认 30，Turbo 在多参考图模型上不可用并注明原因；预估区给出首跑耗时区间和峰值内存（38.2 GB / 本机可用 51.2 GB）](/obsidian-assets/localbrain-h3-multi-reference/image-ui-advanced-7a6fc42730.png)

第一次跑，本机还没有这类样本，预估给的是宽区间：4 张图那组显示 3 分 29 秒～15 分 41 秒，实测 601.8 秒落在区间里；跑完一次就按本机实测收窄。1.2.64 在这里借用了 Turbo 的估算基准，会把 3 秒视频估成 41～187 分钟，1.2.65 已经改成按采样方式分别取基准。

峰值内存 38.2 GB 是生成前按这次请求算出来的。预算取两者中较小的：统一内存的 80%，或者总量减 2 GB 再减去其他正在运行的后端，这台 64 GB 的机器是 51.2 GB。放不下就先关掉加速缓存，还放不下就在装载前拒绝，并说明原因，不会跑到一半把内存撑爆。

6. **让 AI 代劳。**LocalBrain 内置 MCP 的 `generate_video` 工具也加了 `ref_images` 参数（本机图片路径，最多 9 张），Claude Code、Codex 这类客户端接上后可以直接传参考图。参数已经打通到桥接层，不过这次的实测没有从 MCP 客户端端到端跑一遍。

## ▍代价和边界

- **时间**：3 秒视频 7.5～10 分钟（0～4 张参考图），更长的视频这次没测。8bit 省的是内存，不是时间：模型卡写明这个任务卡在算力上，每字节权重约 19.2 万次浮点运算。
- **内存**：64 GB 是我手上唯一实测过的档位，4 张图时可用内存降了 38.4 GB。其他内存档位由 LocalBrain 按上面的预算自己判断；按这套算法，统一内存低于 48 GB 的机器，装载这一步就放不下。
- **磁盘**：REF2VA 整包 69.3 GB，和首尾帧模型各占各的。
- **分辨率**：本地只有 H3-Base，官方默认短边 768；2K 重生成还没开源。
- **描述**：没有官方 Context-IR 替你改写，六段式要自己写，模板和官方技能能帮一把。
- **输入**：官方支持参考视频（最多 3 段）和参考音频（最多 3 段），LocalBrain 这一版只接了参考图。
- **许可证**：MiniMax H3 Community License。按 mlx-serve 模型卡的转述，许可地域不含欧盟、英国、韩国和美国。要商用，先读一遍[许可证原文](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE)。

> [!summary] 64 GB 的 Mac 上，本地多参考图视频能用了，代价是时间
> 4 张参考图全部用上，人物、房间、道具都保得住；3 秒视频要 7.5～10 分钟，可用内存最多降了 38.4 GB，参考图里的细节会被照搬。适合手上有 64 GB 以上 Apple Silicon、需要角色和场景前后一致、又不想把图片传上云的人。要 2K 成片、要批量出片，或者内存不到 48 GB 的，先别急着上头。我的建议是先拿 1 张人物图、3～4 秒试描述，满意了再加场景和道具。

> [!tip]
> 下载页：https://github.com/HackerChi-Hub/localbrain-releases/releases
> 模型卡：https://huggingface.co/ddalcu/MiniMax-H3-REF2VA-MLX-Serve-8bit
> 官方仓库：https://github.com/MiniMax-AI/MiniMax-H3

> [!tip]
> **我目前的4款自制软件**
> · **黑粉剪辑 HyphenCut**（正式迭代）——对话式视频剪辑器，自带 MCP 可被 agent 驱动
>   https://github.com/HackerChi-Hub/HyphenCut-Releases/releases
> · **黑粉盒子 HyphenBox**（初步构建 · 预览版）——免费大模型 API 雷达 + 本地统一路由：持续复测可用性、Key 只存本机、auto 自动挑模型
>   https://github.com/HackerChi-Hub/hyphenbox-release/releases
> · **LocalBrain**（正式迭代）——把 Mac 变成私有 AI 盒子：转写/配音/生图/视频/MCP 一站管理
>   https://github.com/HackerChi-Hub/localbrain-releases/releases
> · **ScreenLex 光影词库**（正式迭代）——本地电影字幕变可复习英语词库，全程离线
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
