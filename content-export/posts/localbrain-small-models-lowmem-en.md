---
title: "Which local models can 8GB run? I tested 11 models, and 6 can fit in 8K context"
slug: localbrain-small-models-lowmem-en
status: published
lang: en
translation_of: localbrain-small-models-lowmem
translation_source: machine
source_sha256: 4d524bc8ab681d19
date: 2026-09-13
updated: 2026-10-03
summary: "Bringing 11 low-memory local models released this year to the local machine, using LocalBrain's built-in llama.cpp unified memory, speed, and tool calls: 6 under 8K context are within the default limit of 8GB devices. Qwen3.5-9B takes up 3GB less than last year's Qwen3-8B, and 27B of 1-bit can run but only has manufacturer numbers. This batch of models has also been added to LocalBrain's discovery page."
categories:
  - Tech
tags:
  - AI
  - Local deployment
  - Self-made software
  - LocalBrain
  - Local models
cover: https://hyphentech.top/obsidian-assets/localbrain-small-models-lowmem/cover-3b8dda75f0.jpg
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/localbrain-small-models-lowmem/) is authoritative.

> [!abstract]
> Eleven small models released this year, the same machine, the same engine, the same two levels of context, all measured by three things: whether they fit well, how fast they run, and whether the tools work properly.
> 2026-09-13·HyphenTech

# Which local models can 8GB run? I tested 11 models, and 6 can fit in 8K context

When writing [[minicpm5-2b-localbrain|MiniCPM5-2B]] on September 9, I specifically noted that this article does not do local inference nor announce support in advance. This time, I'll add the account: all 11 models released this year that claim to run on small memory were loaded locally, 12 warehouses about 56.6 GB, and every file was matched with SHA-256.

First, let's explain the acceptance criteria. The machine is a 64GB M5 Pro, but I measured **how much memory each model needs**, which applies to 8GB and 16GB machines as well; Speed only represents the M5 Pro; switching machines will change accordingly. The engine is uniformly LocalBrain's built-in llama.cpp b10705. Think is disabled, and context is divided into 8K and 32K levels. Each model runs 4 scenarios: 3 rounds of dialogue, directory listing, executing commands, writing a file, then reading back. For the file creation section, ignoring what the model says, just check the file contents in the sandbox.

> [!summary] Let's start with the conclusion
> - In an 8K context, the estimated memory of six models is below the default 8GB device limit of 5.73GB: MiniCPM5-2B, Granite 4.2 3B, Qwen 3.5-4B, Bonsai 27B 1-bit, Ling-3.0-tiny, Gemma 4 E4B.
> - On a 16GB Mac, all 11 can fit at once, and at 32K context, the maximum is only 10.98 GB.
> - The new generation Qwen3.5-9B occupies 32GB less than the 2025 Qwen3-8B at 3.04K.
> - See the image: The Qwen3.5-9B 4bit scored 71 points on 6 real screenshots, all correct. My original Qwen3-VL-30B-A3B scored 68 points; It took about half the time, and about a quarter of the memory.

## ▍Memory is not file size

The model file is just a ticket to entry. To actually run, you also need to leave room for context caching and calculation buffers, so I use the following criteria: **Estimated memory = GGUF file + context cache + calculation buffer**. The latter two are read from the memory sub-item table printed when llama.cpp exits, not based on empirical estimation.

The cache gap is bigger than expected. In the same 32K context, Ling-3.0-tiny only needs 0.25 GB, while Granite 4.2 8B requires 5.37 GB—a 21-fold difference. **The reason isn't the number of parameters, but the attention structure.** Granite and Qwen3-8B store the entire cache at each layer; Of the 32 layers in Qwen3.5-9B, 24 are linear attention, and only 8 are stored. Gemma 4 12B has 40 layers that only look at the most recent 1024 tokens.

![11 models with estimated memory for 8K to 32K context: the longer the line segment, the more cache increases; Ling-3.0-tiny barely moves, Granite 4.2 8B increases the most](https://hyphentech.top/obsidian-assets/localbrain-small-models-lowmem/image-memory-dumbbell-49f63daff4.png)

The most direct examples are the old and new generations of Qwen. The Qwen 3.5-9B has more parameters, with only 7.08 GB at 32K; The 2025 Qwen 3-8B requires 10.12 GB. **The difference of 3.04 GB is almost entirely in cache**: 1.13 GB versus 4.83 GB.

There's still a hurdle on the machine's side. The Mac's unified memory isn't all allocated to the graphics card: a 16GB Mac on macOS 26 only allows 12.71 GB by default. For an 8GB device, I only found a test on the old system: 5.73 GB, and it comes from an 8GB iPhone 15 Pro; The 8GB number for Mac on macOS 26 is currently unknown. So to judge if it fits, **you need to compare the estimated memory to this line, not the number printed on the memory module**.

The 8GB version has actually been discontinued on the new Mac. As early as October 30, 2024, Apple raised the starting memory for the M2 and M3 MacBook Air from 8GB to 16GB, with the starting price unchanged. The press release mentioned this in the same sentence as Apple Intelligence. The new iMac, Mac mini, and 14-inch MacBook Pro released the same week also started at 16GB. But the 8GB machines already sold won't be upgraded, so **these small models are taking care of these still old machines still in service**.

During the process of quantity, I hit two caliber pitfalls; to avoid repeating them:

- llama.cpp logs count both the embedding table and the entire mapping file on the CPU, so Gemma 4 E4B adds 2.7 GB. Weights are mapped into memory by file, but actually only occupy one portion.
- The upper limit for Metal is in decimal GB, and logs are in MiB. Mixing and comparing, you might think a 6.14 GB Qwen 3.5-9B fits perfectly into an 8GB device. All the numbers in the article are converted to decimal GB.

## ▍Actual results from 11 models

| Model | 8K context memory | 32K context memory | Generation speed (32K) | Four scenes |
|---|---|---|---|---|
| MiniCPM5-2B | 1.98 GB | 3.10 GB | 133.6 tok/s | All passed |
| Granite 4.2 3B | 3.00 GB | 5.10 GB | 94.8 tok/s | Write documents 9 times and pass 1 time |
| Qwen3.5-4B | 3.19 GB | 4.15 GB | 68.7 tok/s | All passed |
| Bonsai 27B 1-bit | 4.69 GB | 6.43 GB | 36.0 tok/s | All passed |
| Ling-3.0-tiny | 5.13 GB | 5.38 GB | 131.4 tok/s | All passed |
| Gemma 4 E4B | 5.50 GB | 6.05 GB | 70.2 tok/s | All passed |
| Qwen3.5-9B | 6.14 GB | 7.08 GB | 43.1 tok/s | All passed |
| Qwen3-8B (2025 model) | 6.36 GB | 10.12 GB | 51.2 tok/s | All passed |
| Granite 4.2 8B | 6.82 GB | 10.98 GB | 46.1 tok/s | All passed |
| Gemma 4 12B | 7.77 GB | 8.27 GB | 33.3 tok/s | All passed |
| Bonsai 27B is a three-point option | 8.47 GB | 10.21 GB | 23.4 tok/s | All passed |

**Speed only takes rounds without background tasks**. For the first three rounds, I tested the model while loading. The same model was 10%~35% slower. For those rounds, I just scrapped the speed, keeping only the memory numbers, and the memory was exactly the same every time.

A few worth mentioning:

- **MiniCPM5-2B**: 1.56 GB file, 1.98 GB at 8K, generated 133.6 tok/s, passed all four scenarios 9 times. The September 9 article estimated cache at 43,008 bytes per token based on configuration; this time, 32K tested 1344 MiB, matching the results.
- **Ling-3.0-tiny**: A total of 7.9B parameters, each token only counts 1.3B, so a 4.92GB file can run at 131.4 tok/s, almost as fast as a 2B MiniCPM5; 32K cache is only 0.25GB, and when the context is stretched, memory usage is almost nonexistent.
- **Granite 4.2 3B**: The only failure item. Let it write a hello.txt, it will call the file tool and read back to confirm the content, but only 1 out of 9 times really called the file hello.txt; the rest just used the sandbox directory name to create their own file names. The toolchain is connected, but I didn't listen to all the commands.

## ▍27B pressed to 1-bit: can fit, quality is only the manufacturer's number

Bonsai 27B is a PrismML version that pushes Qwen 3.6-27B to 1-bit, with a file size of 3.80 GB. **Estimated at 4.69 GB in 8K context, within the 8GB device line**; Generates 36.0 tok/s, slower than Qwen 3.5-9B's 43.1 speed, faster than Gemma 4 12B's 33.3, cleared all four scenarios 9 times.

Here, we need to stratify the evidence. What I prove is that it **can install and tune tools**; How smart is it? Currently, only the manufacturer's own 15-item averages: full precision 85.0, three-value version 80.5, 1-bit version 76.1. Independent rankings like Artificial Analysis have not yet been included, so this part cannot be proven.

Three-value weights were not invented by PrismML either. As early as February 27, 2024, Microsoft Research's BitNet b1.58 paper limited each weight to -1, 0, and 1, claiming that at the same scale and training volume, it could match full precision. But that path requires starting from scratch, and Microsoft's latest model is still version 2B from April 2025. Bonsai takes a different approach: using the ready-made Qwen 3.6-27B and pushing it down, so the 27B size can be implemented locally this year, **at the cost that the 1-bit version is 8.9 points lower than full precision**.

The 3-value version even dug me a hole. There was a 7.17 GB Q2_0 file in the warehouse, and LocalBrain's built-in engine reported tensor offset as soon as it loaded. The file itself was intact, and SHA-256 matched correctly. After checking the model card, I saw: Q2_0 is packaged for PrismML's own llama.cpp branch, and the main thread needs Q2_g64. Swapping it over and it runs at 8K, 8.47 GB, 23.4 tok/s. **A few files of similar size in the same repository may not all be read by the same engine**.

"Files aren't corrupted, but the engine doesn't recognize it" isn't the first time in the local community. On August 21, 2023, llama.cpp launched GGUF to replace the original GGML format, and old GGML files became unreadable on the main line. Back then, the main line would change the format themselves, and everyone would migrate together; This time, the vendor's branch ran first, and the main line couldn't keep up. So **before downloading, first check which runtime the model card is writing on**—it's easier than checking the document after a loading error.

## ▍See the image: The 9B model equals the 30B I'm using

I casually tested something related to myself. I've always used the Qwen3-VL-30B-A3B 8bit for my machine's image viewing tool. The official Qwen Qwen 3.5-9B has higher image reading performance than this one, for example, OCRBench 89.2 versus 83.9. I don't want to trust the official data directly, so I used this tool to solve 6 problems: Chinese software interface, English table, bar chart with annotations, architecture diagram, Chinese experiment comparison chart, English document page. I set the standard answers by comparing the figures, totaling 71 fact points.

![6 problems have a total of 71 fact points: Qwen3.5-9B 4bit all correct, Qwen3-VL-30B-A3B lost 3 points; Consumed about half the time, about a quarter of the memory](https://hyphentech.top/obsidian-assets/localbrain-small-models-lowmem/image-vision-compare-f41645ef1e.png)

**9B scored 71 points, 30B got 68 points**, and the 3 points lost were all on the bar chart caption: NVFP4 was called int4, and the int4 1851/134 in the caption was read as 1810/112 on the column. 9B wasn't without error; it added a mistaken conversion itself, saying 40 Hz is a token every 40 milliseconds, but actually 25 milliseconds. It took 74.9 seconds versus 152.2 seconds, and the service process memory peak was 9.2 GB versus 36.5 GB.

The boundaries should also be clarified: **6 images, only one run per question**, multi-image comparison, video, handwriting, and low-definition photos were not tested, so it cannot prove it leads in these question types.

## ▍Independent Rankings: 2B scores caught up to 9B

Memory and speed are measured by myself; I don't score "smart or not" myself, but look at Artificial Analysis's intelligence index. The two Qwen 3.5 and Gemma 4 E4B are its estimated values:

- 13~14 points: Gemma 4 12B 14.2, Qwen 3.5-9B 13.7, MiniCPM5-2B 13.1, Qwen 3.5-4B 13.1
- Under 12 points: Ling-3.0-tiny 11.9, Granite 4.2 8B 11.8, Granite 4.2 3B 9.1, Gemma 4 E4B 8.9

Two signals. First, the MiniCPM5 from 2B is already in the same tier as the 9B; Second, frontier closed-source models score about 53 points on this index, while smaller models generally score between 9 and 14. **The gap isn't as small as the clickbait claims.** Manufacturers should even discount their own numbers: the MiniCPM5-2B model card is rated 28.3 by IFBench for Gemma 4 E4B, while Artificial Analysis tests 44.2.

## ▍Who's pushing small models, and what is they after?

So many small models have appeared in a year, and it's no coincidence. Just look at how a few companies are doing it, and you'll see what each is after:

- **Google is on the front-end entry point. ** On June 5, the QAT version of the entire Gemma 4 lineup was released, including a format for phones and decoding laminated to 2-bit; Its model card was directly tested on the Raspberry Pi 5, and the Gemma 4 E2B runs 7.6 tok/s on a 16GB CPU and occupies 1.55 GB of memory. The default AI model and runtime on phones and development boards is currently decided.
- **Alibaba trades small models for ecosystems, large models account for another. ** Qwen 3.5's small size is all Apache-2.0; but Qwen 3.8-Flash-Next uses the Qwen community license, so "Model as a Service" requires separate authorization.
- **Liquid AI makes money through enterprise licensing. ** LFM2.5 series licenses restrict commercial use for companies with annual revenue over $10 million.
- ** The best format for PrismML should run on your own branch first. ** The most economical packaging for the three-value version is to use the kernel from their branch; mainline llama.cpp can only use larger Q2_g64.

Another side has remained silent: pay-as-you-go API platforms. They have no motivation to tell you that listing directories, executing commands, writing files, or reading files can be done on a 1.56 GB model locally in 9 attempts. **The cost of the local route won't disappear, just the payer will change**: a machine with enough memory, dozens of GB of download time, and formatting pitfalls like the three-value Bonsai — all have to be borne themselves.

## ▍What did LocalBrain add this time?

After testing these 11, I turned back and opened my LocalBrain, only to encounter a bug: the "minimum unified memory" on the discovery page card even labeled 1.94 GB Granite as 16 GB on an 8GB Mac. In the old formula, the fixed constant alone exceeded 8 GB, so no matter how small the model was, it couldn't be installed. 1.2.66 changed it to count only after both gates passed: the model must add 8K context and the default 1 GiB allowance in llama.cpp to fit into the memory reserved by macOS for the graphics card; After deducting the model and system reservations, the inference engine still needs enough space to boot. After the modification, **models under 3.2 GB are labeled as "minimum 8 GB" on an 8GB Mac**.

I found a new "2026-09-13 Add to LocalBrain" group, which included the 9 tested above. Ling-3.0-tiny and Qwen3-8B were already in the directory before. Each card's technical description directly states the tested memory; for example, the MiniCPM5 2B totals about 1.98 GB in an 8K context.

![Discover page new grouping, displayed according to 8GB Mac hardware parameters: the card's technical manual states tested memory, MiniCPM5 2B defaults to 8bit, Qwen3.5 4B defaults to plain text files](https://hyphentech.top/obsidian-assets/localbrain-small-models-lowmem/image-discover-mac8-ced5eb5b34.png)

Three details were determined during testing:

- ** The 6 with images can be downloaded as plain text files. ** The visual parts of Qwen 3.5, Gemma 4, and Bonsai are separate mmproj files, 0.18~0.99 GB. After installing them, check if the images work. I tested them one by one with a bar chart: Qwen 3.5 4B / 9B, Gemma 4 12B / E4B read all four numbers correctly; Two Bonsai files require thinking about 1100 tokens before speaking. When the answer limit is set to 1024, the answer is truncated, and 2048 reads correctly. The minimum answer limit for LocalBrain conversations is exactly 2048.
- ** The default level is the highest the machine can handle. ** On an 8GB Mac, the MiniCPM5 2B defaults to 2.68 GB 8-bit, not 4-bit. At first, I wrote "8 GB Preferred" next to 4-bit, which conflicted with auto-select, so before release, I only listed the mode itself.
- ** You don't need to reinstall a model that's already been downloaded. ** Click 'Use Already Available' on the card and select the model directory. LocalBrain only verifies and registers the path, without copying weights. GGUF stored on external drives can also be connected this way.

There's one thing to mention in advance so you don't get it wrong: **The minimum memory on the card is more conservative than the previous test.** The above estimate memory is compared to the 5.73 GB line; The card also leaves llama.cpp default 1 GiB margin, then drops to real memory files like 8, 16, and 24. So the Bonsai 27B 1-bit tested 4.69 GB, within the line, but the card shows "minimum 16 GB." According to llama.cpp's rules, when usage exceeds the allowance, it will place a few fewer layers on the graphics card, so it can run but not at full speed.

## ▍How to choose by memory

| Your machine | First, try it out | That's also possible | Don't rush first |
|---|---|---|---|
| 8GB computer or Mac (8K context) | MiniCPM5-2B: 1.98 GB, fastest | Qwen 3.5-4B: 3.19 GB, plus 0.68 GB of visual files to view images | Qwen 3.5-9B, two 8Bs, Gemma 4 12B, and three-value Bonsai: all exceed the 5.73 GB line at 8K |
| 16GB (32K context) | Qwen 3.5-9B: 7.08 GB, plus 0.92 GB of visual files to view images | Gemma 4 12B: 8.27 GB, highest standalone score but slowest; Ling-3.0-tiny: Long context barely increases | Granite 4.2 8B: 32K requires 10.98 GB of cache and is the heaviest cache |
| 32GB and above | All 11 of these are fine | Bonsai 27B 3 values: 10.21 GB, want to try the 27B level before going up | — |

Who it's suitable for: Those who want to keep fixed tasks like file columns, document editing, and local tool adjustments running on their computers. **8GB machines are now available as a usable option**. Not suitable for now: Those who need cutting-edge horizontal reasoning and long-chain agent tasks. **The gap between 14 and 53 points is too much to make up for saving memory**.

If you want to check on your own machine, the path is very short: check the minimum memory on the card on the LocalBrain discovery page, run your real tasks with 8K context first, then decide whether to increase the context.

> [!summary] 8GB can run, but first choose the right model and context
> This year's small model gives 8GB devices several options for tuning tools: 6 can fit in an 8K context, while the MiniCPM5-2B only costs 1.98GB. Memory is determined not only by parameters but also by attention structure; the same 32K cache can differ by 21 times. The 1-bit 27B can fit and be adjusted, but the quality is only the manufacturer's numbers; Looking at the pictures, the 9B small model is already comparable to the 30B I use in these 6 problems.

## ▍Appendix: Test questions used this time

If you want to review it yourself, or copy it once, here is the original question. All prompts are placed in code blocks and can be copied in whole paragraphs; For diagram questions, score by 'fact point'; correct answers earn 1 point.

### Tools and dialogue: 4 tracks

During the test, the model only received 4 tools, and all had fences: `list_dir` could only view /tmp and this temporary sandbox, `run_bash` only allowed uname, pwd, date, echo, whoami, sw_vers, `write_file` and `read_file` all went to the sandbox regardless of the path. Out-of-bounds requests would receive DENIED, which would also be recorded as results.

**A · Three rounds of dialogue ** (no tools provided, three sentences in sequence)

```
用一句话介绍你自己。
```

```
把你刚才那句话翻译成英文。
```

```
再把它压缩到十个字以内。
```

**B · Listings**

```
用 list_dir 工具列出 /tmp 目录，告诉我一共有几项。
```

**C · Execute commands**

```
用 run_bash 工具执行 `uname -a`，用一句话告诉我这台机器的系统和架构。
```

**D · Write a file and read it back**

```
用 write_file 写一个 hello.txt，内容是 bench-ok；再用 read_file 把它读回来，确认内容一致。
```

Judgment: A must have answers in all three rounds; B and C must actually initiate a tool call; D Ignores the model and directly checks the hello.txt in the sandbox, which must be bench-ok. Out of 11 models, only Granite 4.2 3B messed up on D; when closing thinking, 9 times it wrote the file name correctly once.

> [!caution] Demonstrate the areas to be changed in LocalBrain
> LocalBrain doesn't have tools to execute commands; C can only run it with review scripts. Its list_dir can only be viewed in the whitelist directory (default downloads, documents, desktop, which can be changed in settings). B needs to replace /tmp with one of the directories; write_file write it into LocalBrain's dedicated output folder. I haven't tried these changes one by one in the app yet.

### Picture: 6 questions, total 71 points

During the test, the image was first scaled to the longest edge of 1280, JPEG quality 85, temperature 0, and only ran once per question. The image below shows the actual one the model received.

**1 · Software interface (6 points)**

![Advanced options interface for video generation in LocalBrain (see Figure 1, Question 1)](https://hyphentech.top/obsidian-assets/localbrain-small-models-lowmem/image-vlm-1-ui-8b4a432532.jpg)

```
这是一个软件界面截图。请逐条回答：1）参考图当前选了几张、上限几张？2）预估生成时间区间是多少？3）预计峰值内存和本机可用内存各是多少？4）采样步数是多少？5）Turbo 加速为什么不可用？6）清晰度选的是哪一项？
```

> [!info]- Standard Answer (6 points)
> 1. Reference image 4/9: 4 cards selected, maximum 9 cards
> 2. Approximately 3 minutes 29 seconds ~ 15 minutes 41 seconds
> 3. Peak memory is expected to be 38.2 GB, with 51.2 GB available locally
> 4. Sampling steps: 30
> 5. Turbo LoRA is only suitable for FL2VA checkpoints (block artifacts measured on REF2VA)
> 6. Standard 960×544

**2 · English Form (14 points)**

![vMLX official website comparison table (see diagram for question 2, image source: vMLX official website)](https://hyphentech.top/obsidian-assets/localbrain-small-models-lowmem/image-vlm-2-table-aaf6324dd0.jpg)

```
把截图里 HEAD-TO-HEAD 表格转成 Markdown 表格，列为：上下文、指标、vMLX、LM Studio MLX；缺失值写“—”。最后说明测试用的机器和模型。
```

> [!info]- Standard Answer (14 points)
> Table (context / metrics / vMLX / LM Studio MLX):
>
> | Context | Metrics | vMLX | LM Studio MLX |
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
> Scoring: 12 numeric slots (9 vMLX + 3 LM Studio) each 1 point; Machine: Apple M3 Ultra (256 GB) 1 point; Model Llama 3.2 3B Instruct 4-bit 1 point.

**3 · Bar Charts and Captions (10 points)**

![Official Ollama Performance Chart (see question 3 in the image, source: Ollama)](https://hyphentech.top/obsidian-assets/localbrain-small-models-lowmem/image-vlm-3-chart-d2de34c870.jpg)

```
读出两张柱状图里每根柱子的标签和数值。图下说明文字里的测试日期、模型、两种量化格式分别是什么？用 int4 量化时 prefill 和 decode 的数字是多少？
```

> [!info]- Standard Answer (10 points)
> 1. Prefill: Ollama 0.19 = 1810, Ollama 0.18 = 1154 (tokens/s)
> 2. Decode: Ollama 0.19 = 112, Ollama 0.18 = 58
> 3. Test date: March 29, 2026
> 4. Model: Qwen 3.5-35B-A3B
> 5. Quantization formats: NVFP4 (new) and Q4_K_M (old, Ollama 0.18)
> 6. int4: prefill 1851 token/s, decode 134 token/s
>
> Scoring: 1 point each for 4 columns; Date, model, NVFP4, Q4_K_M, 1851, 134 each 1 point.

**4 · Architecture Diagram (12 points)**

![MiniMax Official H3-Base Architecture Diagram (see question 4, source: MiniMax-H3 GitHub)](https://hyphentech.top/obsidian-assets/localbrain-small-models-lowmem/image-vlm-4-arch-b9854950c5.jpg)

```
这是一张模型架构图。请回答：1）分几个阶段，每个阶段的英文名称；2）文本编码器基于哪个模型、取第几层特征；3）音频编码器的采样率和 token 频率；4）主干网络的名称、参数量、DiT 块重复次数；5）最终输出是什么。
```

> [!info]- Standard Answer (12 points)
> 1. 4 stages: 01 Condition Encoding, 02 Packed In-Context Sequence, 03 Unified Generation, 04 Decode (1 point each)
> 2. The H3 Encoder text encoder is based on Qwen3-VL-32B (1 point), taking layer-50 features (1 point)
> 3. Audio VAE Encoder: 32 kHz (1 point) → 40 Hz tokens (1 point)
> 4. H3 Omni Transformer (1 point), 33B dense (1 point), Shared DiT backbone × 50 (1 point)
> 5. Output Synchronized video + stereo audio (1 point)

**5 · Chinese Experiment Comparison Chart (18 points)**

![H3 Multiple Reference Figures Four Groups for Comparison (See Figure 5, Question 5)](https://hyphentech.top/obsidian-assets/localbrain-small-models-lowmem/image-vlm-5-grid-361f18ab74.jpg)

```
这是一张实验对比图。请回答：1）一共有几行实验；2）每行左侧写的参考图数量、参考图内容、耗时和内存占用；3）右侧每行展示几帧；4）最后一行画面里人物抱着什么；5）标题里写的分辨率、步数和种子。
```

> [!info]- Standard Answer (18 points)
> 1. 4-row experiment (1 point)
> 2. Left side of each line (quantity + content, time consumption, memory 1 point each, total 12 points):
>    - Plain text (no reference images) · 446.6 seconds · Usage 29.1 GB
>    - 1 reference image (person) · 491.1 seconds · Usage 34.0 GB
>    - 2 reference images (people + scenes) · 501.9 seconds · Occupies 34.8 GB
>    - 4 reference images (character + mascot + scene + development board) · 601.8 seconds · Occupies 38.4 GB
> 3. 3 frames per line (1 point)
> 4. The last line of characters holding a yellow plush bull head (mascot) (1 point)
> 5. 960×544 (1 point), 30 steps (1 point), 42 seeds (1 point)

**6 · English document page (11 points)**

![OpenRouter official documentation page real-time photo · 2026-08-23 (see image for question 6)](https://hyphentech.top/obsidian-assets/localbrain-small-models-lowmem/image-vlm-6-web-1016241e34.jpg)

```
这是 OpenRouter 文档页面截图。请回答：1）免费模型变体的 ID 以什么结尾；2）免费额度表格的完整内容（每行的累计购买额度、每分钟请求数、每天请求数）；3）处理 402 错误的三条办法（简述）；4）查询 key 剩余额度调用的是哪个接口。
```

> [!info]- Standard Answer (11 points)
> 1. ID ending with `:free` (1 point)
> 2. Table (6 points): Less than 10 → 20 times/minute, 50 times/day; At least 10 → 20 times/minute, 1000 times/day
> 3. 402 Three Items (3 points): Add credits (recharge to make balance greater than zero); Check per-key limits (increase the key limit when the limit_remaining is used or wait for limit_reset to reset); Monitor proactively (call GET /api/v1/key to track limit_remaining and usage)
> 4. Interfaces: GET /api/v1/key (1 point)

> [!note]- This time, the score was scored
> | Model | 1 · Software Interface | 2 · English Tables | 3 · Bar Charts and Captions | 4 · Architecture Diagram | 5 · Chinese Experiment Comparison Chart | 6 · English document page | Total |
> |---|---|---|---|---|---|---|---|
> | Qwen3.5-9B (MLX 4bit) | 6 | 14 | 10 | 12 | 18 | 11 | 71 |
> | Qwen3-VL-30B-A3B (8bit) | 6 | 14 | 7 | 12 | 18 | 11 | 68 |

### Smoke from the picture: 1 way

Using the bar chart from question 3, only four numbers are asked to verify whether the model's visual projection file can be used after loading it into LocalBrain:

```
读出两张柱状图里每根柱子的标签和数值，只列出来，不要解释。
```

Judgment: The answer should include four numbers: 1810, 1154, 112, and 58. Qwen3.5 4B / 9B, Gemma 4 12B / E4B are read correctly; For two Bonsai, you need to think about about 1100 tokens. When the answer limit is 1024, the answer is cut off, and 2048 is correctly read.

> [!tip]
> Download page: https://github.com/HackerChi-Hub/localbrain-releases/releases
> September 9: "1.4GB Small Model: Can It Really Be a Local Agent?" 》: https://hyphentech.top/minicpm5-2b-localbrain/
> Independent Rankings (Open Source Small Models): https://artificialanalysis.ai/models/open-source/small
> MiniCPM5-2B Model Card: https://huggingface.co/openbmb/MiniCPM5-2B
> Qwen 3.5-9B Model Card: https://huggingface.co/Qwen/Qwen3.5-9B
> Bonsai 27B Release Notes: https://prismml.com/news/bonsai-27b


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
