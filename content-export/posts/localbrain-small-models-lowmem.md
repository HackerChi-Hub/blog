---
title: 8GB 能跑哪些本地模型？我实测了 11 个，8K 上下文下 6 个装得下
slug: localbrain-small-models-lowmem
status: published
date: 2026-09-13
updated: 2026-09-13
summary: 把今年发布的 11 个低内存本地模型下到本机，用 LocalBrain 内置的 llama.cpp 统一量内存、速度和工具调用：8K 上下文下 6 个压在 8GB 设备的默认上限内，Qwen3.5-9B 比去年的 Qwen3-8B 少占 3 GB，1-bit 的 27B 能跑但质量只有厂商数字。这批模型也加进了 LocalBrain 的发现页。
brand_slogan: "让AI成为你的超能力"
categories:
  - 技术分享
tags:
  - AI
  - 本地部署
  - 自制软件
  - LocalBrain
  - 本地模型
cover: /obsidian-assets/localbrain-small-models-lowmem/cover-3b8dda75f0.jpg
legacy_paths: []
---

> [!abstract]
> 11 个今年发布的小模型，同一台机器、同一个引擎、同样两档上下文，只量三件事：装不装得下、跑多快、工具调不调得通。
> 2026-09-13·黑粉科技

# 8GB 能跑哪些本地模型？我实测了 11 个，8K 上下文下 6 个装得下

9 月 9 日写 [[minicpm5-2b-localbrain|MiniCPM5-2B]] 的时候，我专门注明那篇不做本机推理，也不提前宣布支持。这次把账补上：今年发布、号称能在小内存上跑的 11 个模型全部下到本机，12 个仓库约 56.6 GB，每个文件都对过 SHA-256。

先交代验收口径。机器是 64 GB 的 M5 Pro，但我量的是**每个模型要占多少内存**，这个数换到 8GB、16GB 的机器上同样成立；速度只代表 M5 Pro，换机器会变。引擎统一用 LocalBrain 内置的 llama.cpp b10705，关闭思考，上下文分 8K 和 32K 两档。每个模型跑 4 个场景：3 轮对话、列目录、执行命令、写一个文件再读回来。写文件那项不看模型嘴上怎么说，直接去沙箱里检查文件内容。

> [!summary] 先说结论
> - 8K 上下文下，6 个模型的估算内存低于 8GB 设备的默认上限 5.73 GB：MiniCPM5-2B、Granite 4.2 3B、Qwen3.5-4B、Bonsai 27B 1-bit、Ling-3.0-tiny、Gemma 4 E4B。
> - 16GB 的 Mac 上 11 个全部装得下，32K 上下文最多也只到 10.98 GB。
> - 新一代 Qwen3.5-9B 在 32K 下比 2025 年的 Qwen3-8B 少占 3.04 GB。
> - 看图：Qwen3.5-9B 4bit 在 6 张真实截图上拿了 71 分全对，我本机原来用的 Qwen3-VL-30B-A3B 是 68 分；耗时约一半，内存约四分之一。

## ▍内存不是文件大小

模型文件只是入场券。真正跑起来，还要给上下文缓存和计算缓冲留地方，所以我用的口径是：**估算内存 = GGUF 文件 + 上下文缓存 + 计算缓冲**。后两项都从 llama.cpp 退出时打印的内存分项表里读，不按经验估。

缓存的差距比想象中大。同样 32K 上下文，Ling-3.0-tiny 只要 0.25 GB，Granite 4.2 8B 要 5.37 GB，差了 21 倍。**原因不在参数量，在注意力结构**。Granite 和 Qwen3-8B 每一层都存完整缓存；Qwen3.5-9B 的 32 层里有 24 层是线性注意力，只有 8 层要存。Gemma 4 12B 有 40 层只看最近 1024 个 token。

![11 个模型从 8K 到 32K 上下文的估算内存：线段越长，缓存涨得越多；Ling-3.0-tiny 几乎不动，Granite 4.2 8B 涨得最多](/obsidian-assets/localbrain-small-models-lowmem/image-memory-dumbbell-49f63daff4.png)

最直观的是新旧两代 Qwen。Qwen3.5-9B 参数更多，32K 下只占 7.08 GB；2025 年的 Qwen3-8B 要 10.12 GB。**差出来的 3.04 GB 几乎全在缓存上**：1.13 GB 对 4.83 GB。

机器这边还有一道坎。Mac 的统一内存不会全部放给显卡：16GB 的 Mac 在 macOS 26 上默认只放出 12.71 GB。8GB 设备我只查到旧系统下的实测，5.73 GB，而且来自一台 8GB 的 iPhone 15 Pro；8GB Mac 在 macOS 26 上的数字暂时没有。所以判断装不装得下，**要拿估算内存去比这条线，而不是比内存条上印的数字**。

8GB 在新 Mac 上其实已经停售。早在 2024 年 10 月 30 日，苹果就把 M2、M3 MacBook Air 的起步内存从 8GB 提到 16GB，起售价不变，新闻稿把这件事和 Apple Intelligence 放在同一句里讲。同一周发布的新 iMac、Mac mini 和 14 英寸 MacBook Pro，也都从 16GB 起步。可已经卖出去的 8GB 机器不会跟着升级，**这批小模型要照顾的，正是这些还在服役的旧机器**。

量的过程里踩了两个口径坑，说出来免得你重复踩：

- llama.cpp 的日志会把放在 CPU 上的嵌入表和整份映射文件各算一遍，Gemma 4 E4B 因此多算了 2.7 GB。权重是按文件映射进内存的，实际只占一份。
- Metal 的上限用十进制 GB，日志用 MiB。混着比，会把 6.14 GB 的 Qwen3.5-9B 看成刚好塞进 8GB 设备。文中的数字全部换算成了十进制 GB。

## ▍11 个模型的实测结果

| 模型 | 8K 上下文内存 | 32K 上下文内存 | 生成速度（32K） | 四个场景 |
|---|---|---|---|---|
| MiniCPM5-2B | 1.98 GB | 3.10 GB | 133.6 tok/s | 全过 |
| Granite 4.2 3B | 3.00 GB | 5.10 GB | 94.8 tok/s | 写文件 9 次过 1 次 |
| Qwen3.5-4B | 3.19 GB | 4.15 GB | 68.7 tok/s | 全过 |
| Bonsai 27B 1-bit | 4.69 GB | 6.43 GB | 36.0 tok/s | 全过 |
| Ling-3.0-tiny | 5.13 GB | 5.38 GB | 131.4 tok/s | 全过 |
| Gemma 4 E4B | 5.50 GB | 6.05 GB | 70.2 tok/s | 全过 |
| Qwen3.5-9B | 6.14 GB | 7.08 GB | 43.1 tok/s | 全过 |
| Qwen3-8B（2025 款） | 6.36 GB | 10.12 GB | 51.2 tok/s | 全过 |
| Granite 4.2 8B | 6.82 GB | 10.98 GB | 46.1 tok/s | 全过 |
| Gemma 4 12B | 7.77 GB | 8.27 GB | 33.3 tok/s | 全过 |
| Bonsai 27B 三值 | 8.47 GB | 10.21 GB | 23.4 tok/s | 全过 |

**速度只取没有后台任务的轮次**。前 3 遍我是边下模型边测的，同一个模型慢了 10%～35%，那几遍的速度我直接作废，只保留内存数字，内存每一遍都完全一样。

几个值得单独说的：

- **MiniCPM5-2B**：1.56 GB 的文件，8K 下 1.98 GB，生成 133.6 tok/s，四个场景 9 次全过。9 月 9 日那篇按配置推算缓存每 token 43,008 字节，这次 32K 实测 1344 MiB，对上了。
- **Ling-3.0-tiny**：总共 7.9B 参数、每个 token 只算 1.3B，所以 4.92 GB 的文件能跑到 131.4 tok/s，和 2B 的 MiniCPM5 几乎一样快；32K 缓存只有 0.25 GB，上下文拉长几乎不涨内存。
- **Granite 4.2 3B**：唯一的失败项。让它写一个 hello.txt，它会调写文件工具，也会读回来确认内容，但 9 次里只有 1 次真把文件叫 hello.txt，其余都拿沙箱目录名自己编了个文件名。工具链是通的，指令没听全。

## ▍27B 压成 1-bit：装得下，质量只有厂商数字

Bonsai 27B 是 PrismML 把 Qwen3.6-27B 压到 1-bit 的版本，文件 3.80 GB。**8K 上下文下估算 4.69 GB，在 8GB 设备那条线以内**；生成 36.0 tok/s，比 Qwen3.5-9B 的 43.1 慢，比 Gemma 4 12B 的 33.3 快，四个场景 9 次全过。

这里要把证据分层。我证明的是它**装得下、调得通工具**；它到底有多聪明，目前只有厂商自己的 15 项平均：全精度 85.0，三值版 80.5，1-bit 版 76.1。Artificial Analysis 这类独立榜单还没收录，这部分还不能证明。

三值权重也不是 PrismML 发明的。早在 2024 年 2 月 27 日，微软研究院的 BitNet b1.58 论文就把每个权重限定在 -1、0、1 三个值，并称同等规模、同等训练量下能追平全精度。但那条路要从头训练，微软官方最新的模型仍是 2025 年 4 月的 2B 版。Bonsai 走的是另一条：拿现成的 Qwen3.6-27B 往下压，所以 27B 这个尺寸今年就能下到本机，**代价是 1-bit 版比全精度低了 8.9 分**。

三值版还给我挖了个坑。仓库里有个 7.17 GB 的 Q2_0 文件，LocalBrain 内置引擎一加载就报张量偏移不对。文件本身完整，SHA-256 对得上。翻模型卡才看到：Q2_0 是给 PrismML 自家 llama.cpp 分支用的打包，主线要用 Q2_g64。换过来就能跑，8K 下 8.47 GB、23.4 tok/s。**同一个仓库里体积差不多的几个文件，不一定都能被同一个引擎读**。

“文件没坏、引擎不认”在本地圈子里不是第一次。2023 年 8 月 21 日，llama.cpp 推出 GGUF 取代原来的 GGML 格式，旧的 GGML 文件从此在主线上读不了。当年是主线自己换格式，所有人一起迁；这回是厂商分支先跑、主线没跟上。所以**下载前先看一眼模型卡写的是哪个运行时**，比加载报错以后再翻文档省事。

## ▍看图：9B 小模型打平了我在用的 30B

顺手测了件跟自己有关的事。我本机的看图工具一直用 Qwen3-VL-30B-A3B 8bit，Qwen 官方表里 Qwen3.5-9B 读图各项都比它高，比如 OCRBench 89.2 对 83.9。官方表我不想直接信，就按这个工具真实的调用方式出了 6 道题：中文软件界面、英文表格、柱状图带图注、架构图、中文实验对比图、英文文档页。标准答案我自己对着图定，一共 71 个事实点。

![6 道题一共 71 个事实点：Qwen3.5-9B 4bit 全对，Qwen3-VL-30B-A3B 丢了 3 个；耗时约一半，内存约四分之一](/obsidian-assets/localbrain-small-models-lowmem/image-vision-compare-f41645ef1e.png)

**9B 拿了 71 分，30B 是 68 分**，丢的 3 分都在柱状图的图注上：把 NVFP4 说成 int4，又把图注里 int4 的 1851 / 134 读成了柱子上的 1810 / 112。9B 也不是没毛病，它自己补了一句错误换算，把 40 Hz 说成每 40 毫秒一个 token，实际是 25 毫秒。耗时 74.9 秒对 152.2 秒，服务进程内存峰值 9.2 GB 对 36.5 GB。

边界同样要说清：**6 张图、每题只跑一次**，多图对比、视频、手写和低清照片都没测到，不能证明它在这些题型上也领先。

## ▍独立榜单：2B 的分数追上了 9B

内存和速度是我自己量的，“聪不聪明”我不自己打分，看 Artificial Analysis 的智能指数。其中 Qwen3.5 两个和 Gemma 4 E4B 是它标注的估算值：

- 13～14 分：Gemma 4 12B 14.2，Qwen3.5-9B 13.7，MiniCPM5-2B 13.1，Qwen3.5-4B 13.1
- 12 分以下：Ling-3.0-tiny 11.9，Granite 4.2 8B 11.8，Granite 4.2 3B 9.1，Gemma 4 E4B 8.9

两个信号。一是 2B 的 MiniCPM5 已经和 9B 在同一档；二是前沿闭源模型在这个指数上大约 53 分，小模型普遍还在 9 到 14 分，**差距没有标题党说的那么小**。厂商自己的数字更要打折看：MiniCPM5-2B 的模型卡给 Gemma 4 E4B 的 IFBench 写了 28.3，Artificial Analysis 实测是 44.2。

## ▍谁在推小模型，图什么

小模型一年里冒出这么多，不是巧合。看几家的做法就知道各自图什么：

- **Google 在抢端侧入口。** 6 月 5 日放出 Gemma 4 全系的 QAT 版本，还有给手机用、解码层压到 2-bit 的格式；它的模型卡直接测了树莓派 5，Gemma 4 E2B 在 16GB 板子的 CPU 上跑 7.6 tok/s、占 1.55 GB 内存。手机和开发板上的 AI 默认跑谁的模型、谁的运行时，现在就在定。
- **阿里用小模型换生态，大模型另算账。** Qwen3.5 的小尺寸全是 Apache-2.0；但 Qwen3.8-Flash-Next 用的是 Qwen 社区许可，拿去做“模型即服务”要另外授权。
- **Liquid AI 靠企业授权赚钱。** LFM2.5 系列的许可证对年营收 1000 万美元以上的公司限制商用。
- **PrismML 最好的格式先跑在自家分支上。** 三值版最省的打包要用他们分支里的内核，主线 llama.cpp 只能用体积更大的 Q2_g64。

还有一方一直保持沉默：按量计费的 API 平台。它们没有动机告诉你，列目录、执行命令、写文件读文件这类活，一个 1.56 GB 的模型在本机就能 9 次全过。**本地这条路的代价也不会消失，只是换了付款人**：一台内存够用的机器、几十 GB 的下载时间，以及三值 Bonsai 那种格式坑，都得自己扛。

## ▍LocalBrain 这次加了什么

测完这 11 个，我回头打开自己的 LocalBrain，先撞见的是一个 bug：发现页卡片上的「最低统一内存」，在 8GB 的 Mac 上连 1.94 GB 的 Granite 都标成 16 GB。旧公式里光固定常数就超过 8 GB，模型再小也下不来。1.2.66 改成两道闸都过才算：模型加上 8K 上下文和 llama.cpp 默认预留的 1 GiB 余量，要装进 macOS 默认分给显卡的那部分内存；扣掉模型和系统预留之后，推理引擎还得剩下够启动的空间。改完以后，**3.2 GB 以内的模型在 8GB Mac 上标「最低 8 GB」**。

发现页多了一个「2026-09-13 加入 LocalBrain」分组，收了上面测过的 9 个，Ling-3.0-tiny 和 Qwen3-8B 之前就在目录里。每张卡片的技术说明直接写了这次的实测内存，比如 MiniCPM5 2B 在 8K 上下文下合计约 1.98 GB。

![发现页新分组，按 8GB Mac 的硬件参数显示：卡片的技术说明里写着实测内存，MiniCPM5 2B 默认选 8bit，Qwen3.5 4B 默认选纯文本档](/obsidian-assets/localbrain-small-models-lowmem/image-discover-mac8-ced5eb5b34.png)

三处细节是边测边定下来的：

- **带看图的 6 个可以只下纯文本档。** Qwen3.5、Gemma 4、Bonsai 的视觉部分是单独的 mmproj 文件，0.18～0.99 GB。装进去以后看图能不能用，我拿一张柱状图挨个试过：Qwen3.5 4B / 9B、Gemma 4 12B / E4B 直接读对四个数；两个 Bonsai 要先想大约 1100 个 token 才开口，回答上限设 1024 时答案被截断，2048 就读对了。LocalBrain 对话的回答上限最低正好是 2048。
- **默认档位是本机扛得住的最高一档。** 8GB 的 Mac 上，MiniCPM5 2B 默认选 2.68 GB 的 8bit，不是 4bit。我起初在 4bit 旁边写了「8 GB 首选」，和自动选档互相打架，发版前改成了只写档位本身的特点。
- **已经下好的模型不用重下。** 点卡片上的「使用已有」选中模型目录，LocalBrain 只校验并登记路径，不复制权重，放在外置盘上的 GGUF 也能这样接进来。

有一处要提前说，免得你对不上：**卡片上的最低内存比上文的实测更保守**。上文拿估算内存去比 5.73 GB 那条线；卡片还要多留 llama.cpp 默认的 1 GiB 余量，再落到 8、16、24 这样的真实内存档。所以 Bonsai 27B 1-bit 实测 4.69 GB，在线以内，卡片却标「最低 16 GB」。按 llama.cpp 的规则，占用超过余量时它会少放几层到显卡，能跑，但不是满速。

## ▍按内存怎么选

| 你的机器 | 先试 | 也可以 | 先别急 |
|---|---|---|---|
| 8GB 电脑或 Mac（8K 上下文） | MiniCPM5-2B：1.98 GB，最快 | Qwen3.5-4B：3.19 GB，另加 0.68 GB 视觉文件就能看图 | Qwen3.5-9B、两个 8B、Gemma 4 12B、三值 Bonsai：8K 下都超出 5.73 GB 那条线 |
| 16GB（32K 上下文） | Qwen3.5-9B：7.08 GB，另加 0.92 GB 视觉文件就能看图 | Gemma 4 12B：8.27 GB，独立分最高但最慢；Ling-3.0-tiny：长上下文几乎不涨 | Granite 4.2 8B：32K 要 10.98 GB，缓存最重 |
| 32GB 及以上 | 这 11 个都行 | Bonsai 27B 三值：10.21 GB，想试 27B 级别再上 | — |

适合谁：想把列文件、改文档、调本机工具这类固定活放在自己电脑上跑的人，**8GB 的机器现在也有能用的选择**。暂时不适合谁：需要前沿水平推理和长链条智能体任务的人，**14 分和 53 分之间的差距，内存省下来补不上**。

想在自己机器上复核，路径很短：在 LocalBrain 的发现页看卡片上的最低内存，先用 8K 上下文跑自己的真实任务，再决定要不要把上下文开大。

> [!summary] 8GB 能跑，但先挑对模型和上下文
> 今年的小模型让 8GB 设备有了好几个能调通工具的选择：8K 上下文下 6 个装得下，MiniCPM5-2B 只要 1.98 GB。决定内存的不只是参数量，还有注意力结构，同样 32K 缓存能差 21 倍。1-bit 的 27B 装得下、调得通，但质量只有厂商数字；看图这件事，9B 小模型在我这 6 道题上已经不输我在用的 30B。

## ▍附：这次用的测试题

想自己复核，或者照着录一遍，下面是原题。提示词都放在代码块里，可以整段复制；看图题按「事实点」给分，答对一点得 1 分。

### 工具与对话：4 道

测评时模型只拿到 4 个工具，而且都有围栏：`list_dir` 只能看 /tmp 和本次的临时沙箱，`run_bash` 只放行 uname、pwd、date、echo、whoami、sw_vers，`write_file` 和 `read_file` 不管给什么路径都落到沙箱里。越界的请求会收到 DENIED，这也照样记进结果。

**A · 三轮对话**（不给工具，依次发三句）

```
用一句话介绍你自己。
```

```
把你刚才那句话翻译成英文。
```

```
再把它压缩到十个字以内。
```

**B · 列目录**

```
用 list_dir 工具列出 /tmp 目录，告诉我一共有几项。
```

**C · 执行命令**

```
用 run_bash 工具执行 `uname -a`，用一句话告诉我这台机器的系统和架构。
```

**D · 写文件再读回**

```
用 write_file 写一个 hello.txt，内容是 bench-ok；再用 read_file 把它读回来，确认内容一致。
```

判定：A 三轮都要有回答；B、C 要真的发起工具调用；D 不看模型怎么说，直接去沙箱里检查 hello.txt，内容必须是 bench-ok。11 个模型里只有 Granite 4.2 3B 在 D 上失手，关闭思考时 9 次只写对 1 次文件名。

> [!caution] 在 LocalBrain 里演示要改的地方
> LocalBrain 没有执行命令的工具，C 只能用测评脚本跑。它的 list_dir 只能看白名单目录（默认下载、文稿、桌面，设置里可改），B 要把 /tmp 换成其中一个目录；write_file 写进 LocalBrain 的专属输出文件夹。这几处改写我还没在应用里逐个跑过。

### 看图：6 道，共 71 分

测评时图片先缩到最长边 1280、JPEG 质量 85，temperature 0，每题只跑一次。下面的图就是模型实际收到的那张。

**1 · 软件界面（6 分）**

![LocalBrain 视频生成的高级选项界面（看图第 1 题）](/obsidian-assets/localbrain-small-models-lowmem/image-vlm-1-ui-8b4a432532.jpg)

```
这是一个软件界面截图。请逐条回答：1）参考图当前选了几张、上限几张？2）预估生成时间区间是多少？3）预计峰值内存和本机可用内存各是多少？4）采样步数是多少？5）Turbo 加速为什么不可用？6）清晰度选的是哪一项？
```

> [!info]- 标准答案（6 分）
> 1. 参考图 4/9：已选 4 张，上限 9 张
> 2. 约 3 分 29 秒 ~ 15 分 41 秒
> 3. 预计峰值内存 38.2 GB，本机可用 51.2 GB
> 4. 采样步数 30
> 5. Turbo LoRA 只适用于 FL2VA 检查点（在 REF2VA 上实测出块状伪影）
> 6. 标准 960×544

**2 · 英文表格（14 分）**

![vMLX 官网对比表（看图第 2 题，图源：vMLX 官网）](/obsidian-assets/localbrain-small-models-lowmem/image-vlm-2-table-aaf6324dd0.jpg)

```
把截图里 HEAD-TO-HEAD 表格转成 Markdown 表格，列为：上下文、指标、vMLX、LM Studio MLX；缺失值写“—”。最后说明测试用的机器和模型。
```

> [!info]- 标准答案（14 分）
> 表格（上下文 / 指标 / vMLX / LM Studio MLX）：
>
> | 上下文 | 指标 | vMLX | LM Studio MLX |
> |---|---|---|---|
> | ~2.5K | Cold TTFT | 0.50s | — |
> | ~2.5K | Warm TTFT (cached) | 0.05s | — |
> | ~2.5K | Cache Speedup | 9.7× | — |
> | ~10K | Cold TTFT | 0.12s | 6.12s |
> | ~10K | Warm TTFT (cached) | 0.08s | 0.29s |
> | ~10K | Cache Speedup | 1.6× | 21× |
> | ~50K | Cold TTFT | 0.30s | — |
> | ~50K | Warm TTFT (cached) | 0.22s | — |
> | ~50K | Cache Speedup | 1.4× | — |
>
> 计分：12 个数值格（vMLX 9 个 + LM Studio 3 个）各 1 分；机器 Apple M3 Ultra（256 GB）1 分；模型 Llama 3.2 3B Instruct 4-bit 1 分。

**3 · 柱状图和图注（10 分）**

![Ollama 官方性能图表（看图第 3 题，图源：Ollama）](/obsidian-assets/localbrain-small-models-lowmem/image-vlm-3-chart-d2de34c870.jpg)

```
读出两张柱状图里每根柱子的标签和数值。图下说明文字里的测试日期、模型、两种量化格式分别是什么？用 int4 量化时 prefill 和 decode 的数字是多少？
```

> [!info]- 标准答案（10 分）
> 1. Prefill：Ollama 0.19 = 1810，Ollama 0.18 = 1154（tokens/s）
> 2. Decode：Ollama 0.19 = 112，Ollama 0.18 = 58
> 3. 测试日期 March 29, 2026
> 4. 模型 Qwen3.5-35B-A3B
> 5. 量化格式 NVFP4（新）与 Q4_K_M（旧，Ollama 0.18）
> 6. int4：prefill 1851 token/s，decode 134 token/s
>
> 计分：4 根柱子各 1 分；日期、模型、NVFP4、Q4_K_M、1851、134 各 1 分。

**4 · 架构图（12 分）**

![MiniMax 官方 H3-Base 架构图（看图第 4 题，图源：MiniMax-H3 GitHub）](/obsidian-assets/localbrain-small-models-lowmem/image-vlm-4-arch-b9854950c5.jpg)

```
这是一张模型架构图。请回答：1）分几个阶段，每个阶段的英文名称；2）文本编码器基于哪个模型、取第几层特征；3）音频编码器的采样率和 token 频率；4）主干网络的名称、参数量、DiT 块重复次数；5）最终输出是什么。
```

> [!info]- 标准答案（12 分）
> 1. 4 个阶段：01 Condition Encoding、02 Packed In-Context Sequence、03 Unified Generation、04 Decode（各 1 分）
> 2. 文本编码器 H3 Encoder 基于 Qwen3-VL-32B（1 分），取 layer-50 features（1 分）
> 3. Audio VAE Encoder：32 kHz（1 分）→ 40 Hz tokens（1 分）
> 4. H3 Omni Transformer（1 分），33B dense（1 分），Shared DiT backbone × 50（1 分）
> 5. 输出 Synchronized video + stereo audio（1 分）

**5 · 中文实验对比图（18 分）**

![H3 多参考图四组对照（看图第 5 题）](/obsidian-assets/localbrain-small-models-lowmem/image-vlm-5-grid-361f18ab74.jpg)

```
这是一张实验对比图。请回答：1）一共有几行实验；2）每行左侧写的参考图数量、参考图内容、耗时和内存占用；3）右侧每行展示几帧；4）最后一行画面里人物抱着什么；5）标题里写的分辨率、步数和种子。
```

> [!info]- 标准答案（18 分）
> 1. 4 行实验（1 分）
> 2. 每行左侧（数量+内容、耗时、内存各 1 分，共 12 分）：
>    - 纯文字（不给参考图）· 446.6 秒 · 占用 29.1 GB
>    - 1 张参考图（人物）· 491.1 秒 · 占用 34.0 GB
>    - 2 张参考图（人物+场景）· 501.9 秒 · 占用 34.8 GB
>    - 4 张参考图（人物+吉祥物+场景+开发板）· 601.8 秒 · 占用 38.4 GB
> 3. 每行 3 帧（1 分）
> 4. 最后一行人物抱着黄色毛绒牛头（吉祥物）（1 分）
> 5. 960×544（1 分）、30 步（1 分）、种子 42（1 分）

**6 · 英文文档页（11 分）**

![OpenRouter 官方文档页面实拍 · 2026-08-23（看图第 6 题）](/obsidian-assets/localbrain-small-models-lowmem/image-vlm-6-web-1016241e34.jpg)

```
这是 OpenRouter 文档页面截图。请回答：1）免费模型变体的 ID 以什么结尾；2）免费额度表格的完整内容（每行的累计购买额度、每分钟请求数、每天请求数）；3）处理 402 错误的三条办法（简述）；4）查询 key 剩余额度调用的是哪个接口。
```

> [!info]- 标准答案（11 分）
> 1. ID 以 `:free` 结尾（1 分）
> 2. 表格（6 分）：Less than 10 → 20 次/分钟、50 次/天；At least 10 → 20 次/分钟、1000 次/天
> 3. 402 三条（3 分）：Add credits（充值让余额大于零）；Check per-key limits（key 的 limit_remaining 用完就提高该 key 额度或等 limit_reset 重置）；Monitor proactively（调用 GET /api/v1/key 跟踪 limit_remaining 与用量）
> 4. 接口 GET /api/v1/key（1 分）

> [!note]- 本次得分
> | 模型 | 1 · 软件界面 | 2 · 英文表格 | 3 · 柱状图和图注 | 4 · 架构图 | 5 · 中文实验对比图 | 6 · 英文文档页 | 合计 |
> |---|---|---|---|---|---|---|---|
> | Qwen3.5-9B（MLX 4bit） | 6 | 14 | 10 | 12 | 18 | 11 | 71 |
> | Qwen3-VL-30B-A3B（8bit） | 6 | 14 | 7 | 12 | 18 | 11 | 68 |

### 看图冒烟：1 道

用第 3 题那张柱状图，只问四个数，验证模型的视觉投影文件装进 LocalBrain 以后能不能用：

```
读出两张柱状图里每根柱子的标签和数值，只列出来，不要解释。
```

判定：回答里要有 1810、1154、112、58 四个数。Qwen3.5 4B / 9B、Gemma 4 12B / E4B 直接读对；两个 Bonsai 要先想大约 1100 个 token，回答上限 1024 时答案被截断，2048 就读对了。

> [!tip]
> 下载页：https://github.com/HackerChi-Hub/localbrain-releases/releases
> 9 月 9 日《1.4GB小模型，真能当本地智能体吗？》：https://hyphentech.top/minicpm5-2b-localbrain/
> 独立榜单（开源小模型）：https://artificialanalysis.ai/models/open-source/small
> MiniCPM5-2B 模型卡：https://huggingface.co/openbmb/MiniCPM5-2B
> Qwen3.5-9B 模型卡：https://huggingface.co/Qwen/Qwen3.5-9B
> Bonsai 27B 发布说明：https://prismml.com/news/bonsai-27b

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
