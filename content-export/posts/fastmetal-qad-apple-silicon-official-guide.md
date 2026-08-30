---
title: Mac本地生视频：FastMetal-QAD官方介绍
slug: fastmetal-qad-apple-silicon-official-guide
status: published
date: 2026-08-20
updated: 2026-08-20
summary: FastVideo 团队为 Apple Silicon 推出 1.3B、5B、14B 三档开源视频模型。本文按官方资料整理内存门槛、速度口径、生成模式和安装入口，不包含本机实测。
categories:
  - 技术分享
tags:
  - AI
  - 视频生成
  - Apple Silicon
  - 开源
  - 本地部署
cover: https://hyphentech.top/obsidian-assets/fastmetal-qad-apple-silicon-official-guide/cover-a6c0670199.jpg
legacy_paths: []
notion_id: 3c299968-1bdb-81d4-84bf-d362d629a582
---

> [!note]
> 本文是 HAO AI Lab / FastVideo 官方资料的中文整理，不包含黑粉科技本机实测。

## Mac 本地生成视频 FastMetal-QAD 官方介绍

> 1.3B、5B、14B 三档开源模型  把速度、内存和安装条件一次说清

> [!note]
> 黑粉科技 · 资料整理 · 2026-08-20

---

先把文章的性质说清楚：**这不是本机实测，也不是把官方发布稿换一套中文说法冒充原创。**FastMetal-QAD 的速度、内存和画质描述，全部来自 HAO AI Lab、FastVideo 官方仓库和官方模型页。这里做的事只有两件：把英文资料整理成中文，再把那些容易被一句‘Mac 30 秒生成视频’省略掉的条件补回来。

![# FastMetal-QAD 官方发布主视觉；来源：HAO AI Lab / FastVideo](https://hyphentech.top/obsidian-assets/fastmetal-qad-apple-silicon-official-guide/image-01-9ed11d39ad.jpg)

> [!note]
> 一句话概括：**FastMetal-QAD 是一套为 Apple Silicon 准备的开源视频生成模型与 MLX 运行时**。它不需要 CUDA，也不把生成任务发到云端；模型的 DiT、采样器和解码器都走 Mac 的 Metal GPU。

### ▍这次发布的，不是一个模型

FastVideo 团队一次放出了三档：1.3B、5B 和 14B。它们不是简单把同一套权重切成大中小杯，而是来自不同的 Wan 基础模型，面向的分辨率和内存档位也不同。1.3B 负责把本地生成门槛压低；5B 把 720p 带到 16GB 统一内存这一档；14B 追求更高质量，但官方直接把目标机器写成 36GB 以上。

| 模型 | 官方输出 | MLX DiT | 目标内存 |
| --- | --- | --- | --- |
| 1.3B | 480p · 约 5 秒 | 1.4GB | 16GB+ |
| 5B | 480p / 720p · 约 5 秒 | 4.9GB | 16GB+ |
| 14B | 480p / 720p · 约 5 秒 | 14GB | 36GB+ |

※ 来源：项目方发布表。DiT 大小不等于完整模型仓库下载体积。

这个注释不能跳过。官方表里的 1.4GB、4.9GB、14GB 指的是 **MLX DiT 权重**，不是点一下下载按钮之后的全部流量。Hugging Face 官方接口在 8 月 20 日显示，三个仓库的已用存储约为 13.4GB、19.5GB 和 42.3GB，因为里面还包括文本编码器、分词器、VAE、配置文件，以及 14B 的 EMA 版本。硬盘只留十几 GB，就算内存够，下载也会先卡住。

![# 同一官方提示词下的三档输出；画面取自项目方演示视频，不是本机实测](https://hyphentech.top/obsidian-assets/fastmetal-qad-apple-silicon-official-guide/image-02-89cfe28f09.jpg)

三档模型都是三步学生模型，用 DMD2 蒸馏和量化感知训练得到。项目方强调，发布时使用的 affine INT8 不是训练完成后再硬压一遍，而是在同一种量化网格上训练。这样做的目标很直接：把精度损失控制在训练阶段，同时让 Mac 加载的是已经量化好的权重，避免启动时再量化一遍。

---

### ▍官方速度表，先看清测试条件

项目方的主表使用 **M4 Max、36GB 统一内存**。1.3B 和 14B 生成 480×832×81 帧，5B 生成 704×1280×81 帧；81 帧大约对应 5 秒视频。基线的端到端时间不是只算去噪，它还包括提示词编码、DiT 加载、去噪、解码与导出。

![# 项目方公布的 M4 Max 36GB 数据；Fast 行与基线行的缓存条件不同](https://hyphentech.top/obsidian-assets/fastmetal-qad-apple-silicon-official-guide/image-03-97dc4ada65.jpg)

| 模型 | 基线总耗时 | Fast 模式 | 基线峰值 |
| --- | --- | --- | --- |
| 1.3B · 480p | 110.14 秒 | 45.19 秒 | 3.87 GiB |
| 5B · 720p | 151.42 秒 | 47.24 秒 | 9.34 GiB |
| 14B · 480p | 601.82 秒 | 211.14 秒 | 21.68 GiB |

※ 官方口径：普通三步 DMD、INT8 DiT、TAEHV 解码。Fast 模式每隔 N 帧生成，再用原生 MLX 的 RIFE 补帧。

> [!note]
> 最容易被忽略的是缓存条件。官方图注明确写着：**基线行要付一次冷启动的 umT5 提示词编码成本；Fast 行复用了已经缓存的提示词嵌入。**1.3B 和 14B 的提示词编码约 18 秒，5B 约 47 秒。于是 151 秒和 47 秒不能直接理解成‘开一个开关就快三倍’，其中还混着冷启动与热启动的差别。

同一个原因也解释了社交平台上看起来互相打架的数字。官方账号展示过‘1.3B、480p、5 秒视频、约 30 秒’，也展示过‘5B、720p、81 帧、10.3 秒’。后一个数字注明是 **warm prompt，同时打开 fast 与实验性的 spatial fast**。它们是额外加速配置，不是上表的冷启动基线。转述时只留下一个最小数字，读者得到的就不再是同一个测试。

项目方还在一台无风扇的 13 英寸 M5 MacBook Air、24GB 统一内存、10 核 GPU 上重复了 1.3B 和 5B。1.3B 基线平均 156.2 秒，Fast 58.2 秒；5B 基线 200.1 秒，Fast 90.7 秒。画面设置与主表相同，代价是时间变成 M4 Max 的约 1.3 到 2 倍。14B 在这台机器上放不下 81 帧完整任务，只能缩短片段，所以官方仍把它归到 36GB 以上。

---

### ▍它怎么把显存账压下来

Mac 没有独立显存，CPU 和 GPU 共用统一内存。FastMetal 的设计重点不是让所有模块同时常驻，而是**让最大的阶段决定峰值，而不是让所有阶段相加**。umT5 文本编码器先以 bf16 加载，提示词编码完成就释放；之后才加载 DiT。默认解码器不是完整的 Wan VAE，而是体积更小、采用 MIT 许可证的 TAEHV。

去噪循环使用 MLX 的 dense attention 和量化矩阵乘法跑在 Metal GPU 上，三步 DMD 采样也在设备端执行。DiT 的矩阵权重用 group size 64 的 affine INT8，归一化层和调制表保留 fp16。模型仓库直接提供预量化 MLX checkpoint，重复使用同一提示词时还会命中内容寻址缓存。对本地工具来说，这些工程细节往往比‘参数量又少了多少’更影响等待时间。

| 模式 | 做了什么 | 适合什么阶段 |
| --- | --- | --- |
| Fast | 少生成一部分帧，再用 RIFE 插帧 | 快速预览 |
| Refine | 低分辨率生成后，再用同一 DiT 高分辨率去噪 | 补细节 |
| Quality | 改用完整 Wan VAE 解码 | 最终输出 |
| Prompt enhancement | 本地扩写短提示词并缓存 | 提示词不够完整 |
| Spatial fast | 低分辨率去噪后放大潜变量 | 实验性提速 |
| Draft attention | 窗口注意力加 sinks | 实验性探索 |

※ Spatial fast 与 Draft attention 在官方发布中仍标为 experimental；dense attention 仍是最终渲染默认值。

---

### ▍真要安装，先检查这几项

官方 Apple Silicon 指南写的基础环境是 **macOS 14 或更新版本、Python 3.12.4、FFmpeg**。推荐用 uv 建虚拟环境，然后安装 MLX extra。最短的依赖安装命令是：\`brew install ffmpeg\`，接着执行 \`uv venv --python 3.12 --seed\`，激活环境后运行 \`uv pip install "fastvideo\[mlx\]"\`。

模型下载使用 Hugging Face CLI。以 1.3B 为例：\`hf download FastVideo/FastMetal-1.3B-QAD --local-dir ./FastMetal-1.3B-QAD\`。老版 CLI 可以把 \`hf download\` 换成 \`huggingface-cli download\`。1.3B 和 14B 使用 Wan2.1 的文本生视频入口；5B 来自 Wan2.2 TI2V，潜变量几何和时间步条件不同，要使用项目提供的 5B 专用入口，不能照抄 1.3B 命令只换目录。

- **16GB 机器：**先从 1.3B 开始；5B 的 720p 官方峰值低于 11GiB，但系统与其他应用也要占内存。

- **24GB 机器：**1.3B 和 5B 都有官方 MacBook Air 数据；14B 的 81 帧完整任务不属于这个档位。

- **36GB 及以上：**才是项目方给 14B 标出的目标档位。

- **硬盘空间：**按完整模型仓库准备，不要只看 DiT 那一列。

- **最终质量：**Fast、Spatial fast 都以减少计算换速度；正式成片应自己比较画面与运动稳定性。

> **// FastMetal-QAD 真正值得看的，不是某一个最小秒数，而是 Mac 本地视频生成终于有了从 16GB 到 36GB+ 的完整开源档位。**

---

### ▍官方入口与转载说明

本文为黑粉科技对官方资料的中文整理，**不包含本机下载、运行或画质实测**。配图来自 HAO AI Lab / FastVideo 官方发布页与演示视频，图表依据项目方数据重新排版。后续若做本机实测，会另发文章并单独给出机器、提交版本、命令、随机种子和原始输出，避免与这篇官方介绍混在一起。

```shell
$ 官方发布：https://haoailab.com/blogs/fastmetal/
FastVideo：https://github.com/hao-ai-lab/FastVideo
Apple Silicon 安装指南：https://haoailab.com/FastVideo/getting_started/installation/mps/
模型合集：https://huggingface.co/collections/FastVideo/fastmetal
```

---

> [!note]
> 怎么选
> 
> 只想低门槛体验，先看 1.3B；需要 720p 与内存平衡，看 5B；追求 14B，按 36GB 以上准备。所有速度都要连同分辨率、帧数、缓存状态和加速开关一起读。
