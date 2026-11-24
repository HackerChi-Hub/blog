---
title: "I tested four engines for the same Inkling 2 Mini: Strata, Locals, oMLX, and Win GGUF"
slug: inkling-2-mini-versions-m5-pro-compare-en
status: published
lang: en
translation_of: inkling-2-mini-versions-m5-pro-compare
translation_source: machine
source_sha256: 03a4463a513f87ee
date: 2026-11-23
updated: 2026-11-23
summary: "On the same M5 Pro 64GB, horizontal tests were conducted with Strata SQ-15, Locals NVFP4, and oMLX 0.8.2, with Win 4070 8GB GGUF + DSpark for comparison: concurrent 100.84 tok/s, image reading 7.34 seconds, 45K warm header 0.24 seconds, also exposing T5 typos and multi-sub-agent cross-read trails to real cold water tables."
categories:
  - Tech
tags:
  - AI
  - News
cover: "/obsidian-assets/inkling-2-mini-versions-m5-pro-compare/cover-b9659dcf3c.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
article_type: "article"
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/inkling-2-mini-versions-m5-pro-compare/) is authoritative.

> [!abstract]
> From native oMLX image viewing, Locals NVFP4 4 concurrent 100.84 tok/s, Strata SQ-15 all-around multimodal mode, to Windows 8GB graphics card GGUF + DSpark: it covers the true speeds of the Inkling 2 Mini suite, the 4-sub-agent barrel effect, and all the pitfalls each cannot fall into at once
> HyphenTech · 2026-11-23

　　The most frequently asked question in the backend and comment sections these past two days is: it's clearly the same model, **Inkling-2-Mini**, so why does LocalBrain have `oMLX` version one moment and `Locals NVFP4` the next, and today the packaged **Mac v2.4.7** is also connected to `Strata v0.2.20`(`SQ-10 / SQ-15 / SQ-20`), while Windows and Linux still have `Unsloth GGUF + DSpark` on the Windows and Linux sides—which of these four versions is faster, more accurate, and who can really read the images? How many times difference can concurrent code actually be?

　　To avoid guessing size based on the spec table, today I directly tested the three Mac-side engines in the same room on the same **Apple M5 Pro 64GB unified memory Mac**, and also used the newly tested **Windows RTX 4070 Laptop 8GB / 32GB RAM** GGUF + DSpark data column for reference separately, while also using **Qwen3.8-27B (Splash + DFlash2)** as an all-around benchmark.

　　The biggest impression after testing is that the small-parameter loop MoE model has entered the stage where "switching to a new run is like changing a chip**." It can extend 4 concurrent throughput to **100.84 tok/s** and accurately read images in 7.3 seconds, but in real 4-agent collaboration, a teammate flipping across files can slow down the entire team by **63.7%**. Next, let's break down the real test slices one by one with real money.

## First, let's lay out the four versions of the Inkling 2 Mini: the same 26.4B base, but four completely different mounting methods

　　Thinking Machines' Inkling-2-Mini (`inkling2_loop` architecture) has total parameters of about **26.4B**, with each forward activation about **3.4B**. Physically, it retains only 24 layers but loops the middle 12 layers in place three times, thus rolling out an equivalent inference depth of 48 layers within a smaller memory volume. But in different engines, its weighting format, visual module trade-offs, and batch scheduling are completely different things.

![Overview of all versions of Inkling 2 Mini and Qwen 3.8-27B reference anchor selection](https://hyphentech.top/obsidian-assets/inkling-2-mini-versions-m5-pro-compare/image-img04-6e5f25e3ed.png)

- **Inkling 2 Mini · oMLX 0.8.2 (`oQ4-mtp`, about 16.87 GB)**: Starting at Macs with 32GB or more (64GB opens a 96K window), retains the original `inkling2_vision` visual and persistent prefix cache, but by default turns off drafts and does not have GPU tool syntax locks.
- **Inkling 2 Mini · Locals NVFP4 (about 16.2 GB + 0.64 GB draft)**: locks `Generated-Computers/Locals` to align direction LoRA with AtomicChat. To achieve ultimate pure text and tool call speed, it completely strips away the visual module**, using 6 fusion Metal cores, a 0.64 GB draft model, and a `llguidance` Typed-Tools syntax lock, allowing a **24GB Mac** to smoothly run continuous batch processing.
- **Inkling 2 Mini · Strata SQ-15 (14.3 GB + 607 MB `Vision.strata`)**: The main character of the discovery page officially launched tonight on **LocalBrain v2.4.7** (repo includes three tiers: `SQ-10` 11.1 GB / `SQ-15` 15.0 GB / `SQ-20` 20.0 GB, spanning Mac Metal and Windows/Linux CUDA). Comes with native visual components, DSpark speculative drafts, `64K` context prefix cache, and multi-slot parallelism.
- **Inkling 2 Mini · Win/Linux Unsloth GGUF (`Q2_K_XL` about 10.18 GB and three other tiers)**: v2.4.3 is a cross-platform package for discrete graphics and medium-memory PCs, binding `dspark-Inkling-2-Mini-Q8_0.gguf` (3 draft tokens) and `mmproj` visual projection, allowing Vulkan to be switched below CUDA 12.8 threshold; Currently, I consistently use `f16` KV.

　　I also had to note a real engineering episode I pulled out during tonight's packaging: the local download was complete `Inkling-2-Mini-SQ-15`, and for a while, it couldn't be found in the interface. Upon checking the source code, I found that the Strata directory included a `config.json` (declaration `"model_type": "inkling2_loop"`). The original `inkling_runtime.rs` recognized this field and snatched the entire directory as an oMLX model, then silently eliminated it because `model.safetensors.index.json` was missing.

　　In the newly released **v2.4.7**, I have already moved the priority of `strata` to the front, and I also added the `strata-engine/Inkling-2-Mini-Strata` level three quantization to the discovery page.

## 2. Single-channel decoding vs. 4 concurrent throughput: Locals surged to 100.84 tok/s, Strata concurrency amplified by 3.42 times

　　The most common mistake in the local model community is focusing only on the speed of single generation. Slow output per channel is often not due to full computing power, but because unified memory bandwidth is wasted by single request serial scheduling—especially in the era of multiple sub-agents, where throughput is truly determined by whether the engine can serve multiple concurrent slots simultaneously.

![Mac M5 Pro 64GB 1 concurrent vs 4 concurrent throughput tests, and Windows 4070 8GB GGUF+DSpark standalone comparison](https://hyphentech.top/obsidian-assets/inkling-2-mini-versions-m5-pro-compare/image-img01-1a298ad8fc.png)

　　Let's first look at a short prompt throughput test on the same **M5 Pro 64GB**:

- **Locals NVFP4 (plain text port 11534)**: Single short prompt tested **38.22 tok/s** (pure decoding phase `40.37 tok/s`, TTFT `0.713s`); Four channels concurrently run at once, each channel steady at `25.21–25.23 tok/s`, and the total throughput of all four channels is directly pulled to **100.84 tok/s** (**2.64x** concurrent amplification, all first characters are stable at `0.798–0.830s`).
- **Strata SQ-15 (Multimodal `--parallel 4 --context 65536`)**: Ready in under 3 seconds for cold loading; Short single-channel prompt **22.30 tok/s** (decoding `22.74 tok/s`, TTFT only `0.183s`); When running concurrently at 4, the single channel still maintains `19.79–20.84 tok/s`, total throughput reaches **76.26 tok/s** (amplification factor up to **3.42x**).

　　Why is it that a single channel only has a little over twenty or thirty points, but with four instances, it hardly slows down and directly flips two or three times faster? The core reason is that the decoding phase is a typical **Memory-Bandwidth Bound stage**: only one word is generated at a time, and active expert weights must be moved from memory into the compute unit. Once the engine supports true continuous batch processing and multi-slot fusion kernels, the weights of four requests are merged into the same round of memory bus transfer, which is like riding four times as many passengers while fuel costs barely increase.

　　As for the data listed separately in Figure B **Windows RTX 4070 Laptop 8GB (32GB system memory, driver 621.01)**, I must clarify: it is not the same device as the M5 Pro and cannot be used for absolute comparison, but it perfectly answers another key question—**Is DSpark on a low-VRAM PC really a psychological comfort? ** On the same `384` word control short question, Q2_K_XL closed draft only had **15.34 tok/s**, but opening DSpark (3 draft tokens) directly mentioned **28.37 tok/s (about 1.85x speed)**. Code execution, tool round-trip and simple image reading all worked smoothly.

　　However, these machines have tight VRAM space, and the architecture currently has a fixed `f16` KV (even if manually selecting `q8`, it will drop back), so the small output budget may still be wasted on the thinking phase, and the `Q3/Q4` file and Linux inference are not yet fully completed.

## 3. Four tested probes T5, T8, T9, and T10: Strata stunned by 7.34 seconds of image reading, exposing real imperfections on the table

　　Running fast doesn't mean you can do the hard work. Now, let's lay out and compare the core probe data running on the M5 Pro 64GB—not just who is fastest, but also who reads the entire image, corrects the code, catches the 45K long cache, and where the probe might fail.

![M5 Pro 64GB Quad-Engine Core Probe (T5 Logic / T8 Troubleshooting / T9 Diagram / T10 Long Context Cache) Test Comparison](https://hyphentech.top/obsidian-assets/inkling-2-mini-versions-m5-pro-compare/image-img02-e7c64b698f.png)

| Measured dimensions | Inkling Strata SQ-15 | Inkling Locals NVFP4 | Inkling oMLX 0.8.2 | Qwen 3.8-27B Splash (Reference) |
| --- | --- | --- | --- | --- |
| T9 Native Visual Recognition | **7.339s** (45.93 tok/s): 8 model names match engine badges with zero error | Image viewing is not supported (plain text route) | 53.0s (4.5/5): Spot the difference at all 5 spots and error, but mistakenly identified the character 'high line priority' | **29.8s** (5/5): Dual consoles with zero error and accurate attribution latency |
| T8 code minimal modification error | **16.512s** (50.83 tok/s): Accurately identified and fixed all TS/Rust bugs | **63.8s** (58 tok/s): `edit_file` **0 errors** passed 3/3 of the single test on the first try | 123.7s: Error error after 3 consecutive missed transmissions `old_string` self-correction passed | 82.3s:0 error 3/3 all passed, additional warning of concurrent lock risk |
| T5 logical trap | 4.804s (42.98 tok/s): Q1/Q2 all paired, Q3 bulb mechanism correct, but the closing is 1 letter typo | **1,500.1s Timeout (0/3)**: Two wheels hit a maximum of 28,672 thought limits | 419.5s (2/3): The symmetric deception question got stuck in a dead end | **313.0s (3/3 full score)**: Constructing symmetric matrices is a complete victory |
| T10 long context prefix cache | **45K** Actual test: Cold pre-fill `56.133s`, Warm follow-up questions **`1.039s`(TTFT `0.236s`)** | 30K test: Cold pre-fill `69.5s`, Warm follow-up TTFT **`0.92s`** (41.46 tok/s) | 30K test: Cold pre-fill `39.7s`, whole question `98.0s` (32.43 tok/s) | 30K test: cold prefill `39.0s`, decoding **`76.32 tok/s`** (total `72.3s`) |

> Note: Qwen3.8 / oMLX / Locals complete 7 non-visual + 3 visual controls are tested on the same M5 Pro; After removing the timeout T5, Locals accumulated 856.7 seconds across 6 daily tasks (44.4% faster than Qwen3.8, 49.9% faster than oMLX). Strata SQ-15 was tested using v0.2.20 Targeted probes with 8 model desktop screenshots and 45,305 tokens in long context.

　　What surprised me most was **Strata SQ-15's image viewing and long text warm cache**. Take the software screenshot below containing 8 local model entries mixed with `Sushi`, `Locals`, `oMLX`, `Splash` badges, and throw it to it. The 607 MB `Inkling-2-Mini-Vision.strata` only took **7.339 seconds** (including visual + prompt prefill `5.706s`, decoding rushed to `45.93 tok/s`) to read out the "large language model," 8 table of contents, and full engine label without missing a word—in the oMLX era, it took over fifty seconds to view a fine-character screenshot and worried OCR might make one or two Chinese character errors. This time, I went straight to the generation.

![T9 Visual Probe Input Original Image: Strata SQ-15 reads all 8 entries and Sushi/Locals/oMLX/Splash labels correctly within 7.34 seconds](https://hyphentech.top/obsidian-assets/inkling-2-mini-versions-m5-pro-compare/image-img05-9240d908ef.jpg)

　　By the time of the heavy file search (`T10`) of **45,305 tokens**, Strata SQ-15 used `56.133s` (`36.31 tok/s` decoded to accurately extract exit commands `【AZURE-M5PRO-64GB-STRATA-0220】` and `7749`); Then, when performing a second round of follow-up with `45,374` words, the entire request was answered in just **1.039 seconds**, with **initial word delay (TTFT) reduced to 0.236 seconds**, and port numbers `11634` and `64 词元` retold with zero error.

　　Of course, if there are highlights, the negative side must also be nailed openly: **Emphasizing logical steady-state remains the domain of `Qwen3.8-27B Splash + DFlash2`**.

　　`Locals NVFP4` After adding alignment LoRA, I hit the logic trap `T5` twice `28,672` The thinking ceiling timed out; And although `Strata SQ-15` passed the question in 4.8 seconds and answered both questions 1 (`1 小时`) and 2 (`7 次`) correctly, and in question 3, 'Three-turn on and off to distinguish three bulbs,' I got the complete physics of how touching the bulb heats up correctly. However, in the closing text, I accidentally misspelled a letter on the label of the previously turned off bulb (written as 'B turns on for 1 minute, then turns off...' The light that is on is B').

　　This low-probability slip of the tongue reminds us: **Key code review and logical finalization, don't just look at the 4.8-second speed to skip manual or large model reviews. **

## 4. How much can real agent speed up with multiple sub-proxies? 4. File source code auditing is a sobering cold shower

　　Since on Mac `Locals` 4 concurrency spikes to **100.84 tok/s**, and `Strata` 4 concurrency amplifications **3.42 times**, many friends naturally ask: I created the new DeepSeek Harness native multi-sub-agent (`subagents.mjs`) in **LocalBrain**. Whenever I encounter large warehouse reading or auditing, I split it into 4 read-only sub-proxies to work together. End-to-end time, can it also be reduced by two or three times?

　　After running the single proxy vs. 4 sub-agent duel on the M5 Pro 64GB** with the same real file source code audit task (simultaneously auditing `strata_server.py`, `strata_runtime.rs`, `subagents.mjs`, and `dshAgent.ts` and summarizing risk reports), both sets of data immediately brought everyone back to reality.

![Same topic 4 File Source Code Audit Comparison: Strata 4 sub-agent outperforms single proxy, while Locals is stretched by one cross-read trailing sub-proxy](https://hyphentech.top/obsidian-assets/inkling-2-mini-versions-m5-pro-compare/image-img03-4948765ee1.png)

- **Strata SQ-15**: Single agent ran 10 steps / 9 tool calls, total **357.1 seconds** (`357,145 ms`); After switching to 4 sub-agents concurrently, all 4 workers successfully delivered, **end-to-end compression to 324.5 seconds (overtaking saved 32.6 seconds, peak worker decoding reached `61.91 tok/s`)**.
- **Locals NVFP4**: Single proxy 6 steps / 11 times tool takes only **214.7 seconds**; After switching to 4 sub-proxies, although **all 4 people run smoothly**, the total firewall clock time actually swells to **351.5 seconds (slower than single proxy +63.7%)**!

　　Why is it that the faster single-lane Locals is nearly 137 seconds slower when four sub-agents are launched? I directly split the work logs of the four sub-agents (right half of Figure 03): the top three are as fast as flying — worker 1 responsible for `strata_server.py` only took **151.7 seconds** (4 rounds), worker 2 with `strata_runtime.rs` took **156.7 seconds** (3 rounds), and worker 3 with `subagents.mjs` took **182.9 seconds** (3 rounds). **All three finished writing their reports within 3 minutes! **

　　The only one who kept the whole team on the ground was **worker 4**, responsible for `dshAgent.ts`. When auditing its TypeScript file, it felt it hadn't fully read the interface call relationships, so it continuously read adjacent `dshTransport.ts` and `agentLoop.ts` across files, running six rounds, inflating the context to **74,390 tokens**, and carrying **274.8 seconds** alone before handing over the paper. Finally, with the main agent and four others working on merging and summarizing, the end-to-end wall clock stopped at `351.5 秒`.

> [!tip]
> This real barrel shortcoming lesson is worth more than a hundred theories: the acceleration limit for parallel multi-sub-agent never depends on the fastest concurrent slots, but on whether you draw clear boundaries for the slowest sub-agent. When running multiple sub-agents in LocalBrain, only by splitting the target into **closed-scope, non-cross-re-read large file** read-only slices will the continuous batch processing dividend of Strata (default 4 slots) and Locals (16 slots) become true wall clock shortening.

## 5. The full set of tested original questions, original code, and standard answers are compared with real responses from each engine

　　After reading the cross-evaluation conclusions, many friends are most concerned about: what exactly does the same model return at different runtimes when facing **completely unchanged exam questions, code, images, and repository files**, where each went wrong, and how many sentences are missing. This section lays out all the original questions, standard answers, and engine responses from this round of Mac testing, item by item.

### 1) Single and 4 concurrent throughput issues (Mac M5 Pro vs Win 4070 controlled short test aperture explanation)

- **Mac Single Short Prompt Original Question** (`max_tokens=512, temperature=0.2`):`请用中文清晰写出 12 条本地 AI 部署时的性能调优工程实践，每条不超过 40 字，不要省略。`
- **Mac 4 Concurrent Stress Test Original Problem** (4 threads sending simultaneously, `max_tokens=512`): `第{1..4}路并发测试：请用中文清晰列出 12 条代码审查与内存优化检查要点，每条约 25 字。`

　　Under these two pure throughput questions, `Locals NVFP4` single channel of exhalation `512` word element time `13.395s` (`38.22 tok/s`, decoding `40.37 tok/s`), 4 channels combined and output `2,048` word element time `20.309s` (aggregated `100.84 tok/s`, with all channels extremely uniformly and stable at `25.21–25.23 tok/s`); `Strata SQ-15` Single output `212` Word usage time `9.508s` (`22.30 tok/s`, TTFT only `0.183s`), 4 channels merged and output `1,204` Word usage time `15.789s` (aggregated `76.26 tok/s`, single channel `19.79–20.84 tok/s`, achieving concurrent amplification of `3.42x`). As for the **Windows RTX 4070 Laptop 8GB** mentioned above, I tested a separately controlled `384` word short-term test to verify `Q2_K_XL` opening 3-token DSpark from `15.34` to `28.37 tok/s`, which is cross-device standalone reference without mixing absolute speed.

### 2) Targeted T5 Logical Traps: Original questions, standard answers, and transcripts of Strata SQ-15 original transcripts

　　First, let's clarify a key test criterion: the `Qwen3.8`, `oMLX`, and `Locals` from the previous 10D horizontal review run the high-difficulty version `T5` (five chips 2 good 3 bad symmetric deception + rare disease Bayesian `71.04%` + 22-character Chinese self-reference; the full question stem and three-model answers are included in the sister section); This round tested the newly accessed `Strata SQ-15` Targeted quick probe with the following three classic logic questions:

> Strata Targeted T5 original question:
> 1) The doctor prescribed you 3 pills and advised you to take one every half hour. How many hours does it take to finish all 3 pills from the time you take the first pill?
> 2) The farmer brings the wolf, sheep, and cabbage to the riverbank. The small boat can only bring at most one other thing besides the farmer at a time. When the farmer is absent, the wolf eats the sheep, and the sheep eat the cabbage. How many times do you need to cross the river at minimum (counting one round trip each) to safely bring all three safely to the opposite bank?
> 3) There are three turned off incandescent lamps in a room, and three corresponding switches A/B/C outside the door. When the door is closed, you cannot see inside the room from outside. You can only open the door once after all switches have been dialed to enter the room, and after entering, you cannot touch the external switches again. How can you determine 100% which light A, B, and C control at one time?

- **Standard answer to Question 1: `1 小时` **(Chapter `0` Eat the first pill in minutes, the first `30` Eat the second pill in minutes, the first `60` Eat the third capsule in minutes, totaling only two and a half hours).
- **Standard answer for question 2: `7 次`** (Bring sheep to → empty return → Bring wolf → Bring sheep back → Bring cabbage to → empty return → Bring sheep to go taken).
- **Standard answer to question 3: First, turn on A and wait 10 minutes before turning it off; immediately turn on B and keep it on; C is off the entire time**; After entering, **the one that lights up is B, the one that turns off but feels hot to the touch is A, and the one that goes off and is cold is C**.

```text
1) 结论：1 小时。理由：第一颗吃下后，第二颗在 30 分钟后、第三颗在 60 分钟后，所以从第一颗到第三颗共 60 分钟。

2) 结论：7 次。理由：经典河渡问题，最少需要 7 次往返（含农夫回程）才能安全完成。

3) 结论：先让 A 开 10 分钟后关，B 开 1 分钟后关，C 保持关闭；进入房间后，亮着的灯是 B，热但不亮的灯是 A，冷且不亮的灯是 C。理由：A 的热量来自较长时间通电，B 的亮度来自短时间通电，C 无任何状态，三者可区分。
```

Strata SQ-15 T5 Original Answer Transcript (4.804s / TTFT 0.313s / Decoding 42.98 tok/s)

　　Comparing the original answer to the original answer, you can immediately see through the true characteristics of the Strata SQ-15: the first two numbers and step reasoning are instantly correct, and the third question clearly uses the physical principle of heat generation lag when the incandescent lamp is powered on, but the closing statement casually reads: "**B turns on for 1 minute, then turns off...... The light on is B**"—since it's off, it naturally won't turn on. This real-life failed sample also directly confirms one thing: **Initial screening with high-speed small models is very satisfying, but critical finalizations require manual or strong model review**.

### 3) Targeted T8 code spotting: original problem two paragraphs of source code, bug checklist, and Strata fixes

　　Also marked with division of labor boundaries: `Locals`, `oMLX`, and `Qwen3.8` `T8` test using the `edit_file` tool to manually modify local `ledger.mjs` (test details are included in the sister article); This round directly tests the Targeted T8 probe for `Strata SQ-15` with a bilingual TypeScript and Rust hidden bug diagnosis. The original question and the source code for the two questions are as follows:

```typescript
async function runBatch(urls: string[], limit = 4) {
  const results = [];
  for (let i = 0; i < urls.length; i += limit) {
    const chunk = urls.slice(i, i + limit);
    chunk.forEach(async (u, idx) => {
      const res = await fetch(u);
      results[i + idx] = await res.json();
    });
  }
  return results;
}
```

T8 Problem Original Code 1 (TypeScript): Asynchronous concurrent batch processing function runBatch

```rust
fn safe_slots(ctx: u32, requested: u32) -> u32 {
    let mut slots = requested;
    while ctx / slots < 4096 {
        slots -= 1;
    }
    slots
}
```

T8 Problem Original Code 2 (Rust): Context Slot Security Allocation Function safe_slots

- **TS Source Code All Bugs** :(1) `chunk.forEach(async ...)` does not **wait for asynchronous callbacks**, `runBatch` immediately returns an almost empty `results` before `fetch` returns; (2) `limit <= 0` triggers a loop at `i += limit`; (3) Lacking `try/catch` / status code checksum and not pre-allocated according to `new Array(urls.length)`.
- **Rust Original Code All Bugs**:(1) When `requested == 0` is triggered, the first round `ctx / slots` is directly divided by zero panic; (2) When `ctx < 4096` is reached, `while` loop decreases `slots` all the way to `0`, and the next round of evaluation `ctx / 0` is also directly divided by zero panic (if changed to subtract first then check, unsigned integer `u32` will also overflow); (3) The correct approach is to start with `requested.max(1)` and set the loop guardrail to `while slots > 1 && ctx / slots < 4096`.

```rust
// TypeScript 修复核心（Strata SQ-15 实答）
if (limit <= 0) throw new Error('limit must be > 0');
const results: any[] = new Array(urls.length);
for (let i = 0; i < urls.length; i += limit) {
  const chunk = urls.slice(i, i + limit);
  await Promise.all(chunk.map(async (u, idx) => {
    try {
      const res = await fetch(u);
      results[i + idx] = await res.json();
    } catch (e) {
      results[i + idx] = { error: String(e) };
    }
  }));
}

// Rust 修复核心（Strata SQ-15 实答）
fn safe_slots(ctx: u32, requested: u32) -> u32 {
    let mut slots = requested.max(1);
    while slots > 1 && ctx / slots < 4096 {
        slots -= 1;
    }
    slots
}
```

TS + Rust practical core code provided by Strata SQ-15 (16.512s / 50.83 tok/s).

　　Strata SQ-15 found all four TS questions in `16.512s` at once and posted the usable versions `Promise.all` + `try/catch`; The Rust section also caught division by zero and `u32` overflowing and provided the standard safe writing of `requested.max(1)` plus `while slots > 1 && ctx / slots < 4096`—though in the second point of the textual explanation, it briefly muttered "Is reducing `slots` increasing `ctx / slots` direction?" (reducing concurrency slots is precisely to leave ≥ 4096 context for each slot), but fortunately, the final output code itself is completely correct.

### 4) Targeted T9 & T10: Visual original question screen reading with 45K long log original questions and warm and cold answers

```prompt
请仔细看这张软件截图：1) 页面顶部标题是什么？2) 截图中一共列出了多少个模型条目？3) 这些条目右侧黄色标签分别写有哪些引擎名称（例如 Sushi / Locals / oMLX / Splash）？
```

T9 Visual Original Question Stem (input the original image, i.e., the original 8-model desktop list shown in Section 3)

```text
1) 页面顶部标题是“大语言模型”。
2) 截图中列出了 8 个模型条目。
3) 右侧黄色标签对应的引擎名称依次为：Sushi、Locals、Locals、oMLX、Locals、Splash、Splash、Splash。
```

Strata SQ-15 T9 Original Answer (7.339s / TTFT 5.706s / Decoding 45.93 tok/s · 100% consistent with the standard answer)

```text
【620 行背景日志模板（第 342 行埋入真实暗号）】
常规行：记录条目：在本地异构计算节点 #node-{0000..0619} 上，上下文分片编号 CTX-{n}，权重缓存命中率为 94.2%，KV 页大小 64 词元，端口 11634 延迟 12.4 毫秒；
第 342 行：核心暗号记录条目：在本地异构计算节点 #node-0342 上，秘密口令为 【AZURE-M5PRO-64GB-STRATA-0220】，校验码 7749。

第一轮冷问（45,305 tok）：节点 #node-0342 的秘密口令与校验码分别是什么？直接给出精确原文。
→ Strata 实答（56.133s，TTFT 55.251s，36.31 tok/s）：秘密口令：【AZURE-M5PRO-64GB-STRATA-0220】；校验码：7749。

第二轮暖追问（45,374 tok）：基于上面同一份日志，每个分片的 KV 页大小和端口分别是什么？直接一行回答。
→ Strata 实答（1.039s，TTFT 0.236s，32.37 tok/s）：每个分片的 KV 页大小均为 64 词元，端口均为 11634。
```

T10 45K Long-Context Needle in a Haystack Original Question Template + Cold/Warm Rounds of Real Answers (Strata SQ-15)

### 5) DSH 4 File Source Code Verification: Complete task sheet, standard verification values, and actual operational differences of the four groups

> AUDIT_PROMPT Original question stem (excerpt from core 4 key requirements): Please perform read-only code verification on the following 4 core files in the LocalBrain repository (only read the necessary line range; do not fabricate any unread symbols or values):
> 1) src-tauri/src/strata_runtime.rs: Checks RELEASE_TAG, ENGINE_VERSION, StrataFamily enumeration variants, and planned_context_window return values under 64GB of memory.
> 2) src-tauri/resources/dsh-engine/subagents.mjs: Check the number of SUBAGENT_TOOL_NAME, DEFAULT_READONLY_SUBAGENT_TOOLS lists, and the maximum scope of single-batch concurrency.
> 3) src-tauri/resources/strata_server.py: Check the quantity of APP_ORIGINS, INKLING_TIERS, and the clamping range of the build_launch_config parallel parameter.
> 4) src/lib/dshAgent.ts: Verify the processing branch of subagent/event and the position of the subagents field passed through to options.

| Target source code file | Key symbols under test | Source code standard truth verification (with exact line numbers) |
| --- | --- | --- |
| `src-tauri/src/strata_runtime.rs` | `RELEASE_TAG` / `ENGINE_VERSION` / `StrataFamily` / `planned_context_window` | `"v0.2.20"`(L7)/ `"0.1.66"`(L8)/ 3 variants `Inkling`, `Hy4Flash`, `QwenMoe` (L15–19)/ All branches return **`65_536`** (L368–389) under 64GB |
| `src-tauri/resources/dsh-engine/subagents.mjs` | `SUBAGENT_TOOL_NAME` / `DEFAULT_READONLY_SUBAGENT_TOOLS` / Concurrency limit | `'localbrain_run_subagents'`(L11)/ **`11` Item** Read-Only Tool (L13–25)/ Inline Clamping `Math.max(1, Math.min(8, ...))` i.e., upper limit **`8`**, default `4` (L27–28 & L429) |
| `src-tauri/resources/strata_server.py` | `APP_ORIGINS` / `INKLING_TIERS` / `parallel` Clamping | **`5` Local-source (L23–29)/3-level tuple `("SQ-20", "SQ-15", "SQ-10")`(L34)/default `parallel=1`(L362), L367 clamp to **`[1, 8]`** |
| `src/lib/dshAgent.ts` | `subagent/event` Branch / `subagents` Transparent | `onEvent` **L330–338** are handled separately for `batch-start`, `worker-done`, `batch-end` three types of notifications; **L370** is transmitted within `config` objects of `runDshTask` `...(options.subagents?{subagents:options.subagents}:{})` |

- **Accuracy of all four sets of results**: Whether `Strata 单代理`, `Strata 4 子代理`, `Locals 单代理`, or `Locals 4 子代理`, the final output table **100% accuracy of all the above constants, values, and line numbers, zero fabricated illusions**.
- **Strata Single vs. 4 Sub-Agent Differences (357.1s vs 324.5s)**: Single agent took 10 steps / 9 tool reads through four files; 4 sub-agents locked each team member into their own file (`177.0s / 182.5s / 204.2s / 223.1s`, where `subagent-1` decoded to `61.91 tok/s`). Although the original return of `subagent-4` briefly included a brief English reflection (`"A user asked to read src/lib/dshAgent.ts..."`), the key line numbers L330–338 matched with L370, and the main agent was uniformly organized back into a clean Chinese table, saving **32.6 seconds** end-to-end compared to the single agent.
- **Locals single vs 4 sub-agent differences (214.7s vs 351.5s)**: The top three in `Locals` 4 concurrent times each used only **`151.7s / 156.7s / 182.9s`** and quickly finished the game; Only the fourth teammate responsible for `dshAgent.ts` (`dshAgent_ts`) extra-checked `dshTransport.ts` (proofreading L19 `DshConfig.subagents` and L23 `DshEvent`) and `agentLoop.ts` for 6 rounds, pushing the context up to **`74,390` lemmas, and using **`274.8s`** alone (although I provided the most detailed interface alignment explanation among the four groups, it dragged down the entire queue's clock time).

## 6. How to choose the machine you have on hand? LocalBrain v2.4.7 Direct streaming on one page

　　The recently bundled and pushed **LocalBrain v2.4.7** has enabled all three Mac engines and the supporting multi-sub-agent switches, and specifically fixed the issue where the discovery page and local `.strata` directory were hidden, preemptively occupied by oMLX; On the Windows/Linux side, the independently released **v2.4.3** channel is still retained. You can simply select the machine and task type below:

- **24GB–64GB Mac wants a package that balances ultra-fast image viewing, coding, and multiple sub-proxies concurrently**: prioritize installing **v2.4.7 Discover page `Inkling 2 Mini · Strata 原生量化（SQ-15）`**. `14.3 GB` Primary weight added `607 MB Vision.strata`, fast cold loading, 45K warm initials in 0.24 seconds, 4 concurrent 76.26 tok/s, daily performance is almost impossible to find obvious biases; The bundled `SQ-10` (16GB+ installable) and `SQ-20` have been added to the discovery page simultaneously, but both settings have not yet run the full set on the same device.
- **Pure text encoding / batch writing and modifying scripts / pursuing extreme single-channel and quad-channel concurrent throughput**: choose **Inkling 2 Mini · Locals NVFP4** (`24GB Mac` can run smoothly directly). Write and modify rounds `58–60 tok/s`, `--typed-tools` zero errors and 4 concurrency exceeds 100 (`100.84 tok/s`), but remember it **can't look at images at all** and is not recommended for tough `T5` extremely long thinking paradoxes.
- **Retain stable state compatibility for daily image viewing and simple file modifications**: Old version **oMLX 0.8.2** (64GB with 96K context) coexists with new `Strata` and `Locals`, no need to delete or reinstall downloaded files.
- **Difficult reasoning, rigorous code final review, and fine detail-and-image spot-the-difference**: 64GB of large memory. On Mac, **`Qwen3.8-27B Splash + DFlash2`** (`T5` the only perfect score, 30K decoding `76.32 tok/s`).
- **8GB VRAM + 32GB RAM Windows / Linux laptops**: Download **`Inkling 2 Mini GGUF Q2_K_XL`** in the corresponding version, default includes 3-token DSpark draft (tested from `15.34` to `28.37 tok/s`), remember the current architecture's `f16` KV overhead and small budget limits, don't cram too long context all at once.

> [!quote] My judgment
> With the same **Inkling 2 Mini** weights on the table, the real gap between the two generations is the backend engineering—**Locals** uses 6 fusion Metal cores and syntax locks to push plain text encoding and 4 concurrent to **100.84 tok/s**; **Strata v0.2.20** uses native `.strata` + `Vision.strata` + DSpark to deliver 7.34 seconds of precise image reading, 0.24 seconds of 45K warm header and multi-sub-agent collaboration to complete the first time in the same lightweight package; Actual tests revealed the `Locals` T5 deadloop, teammate dragging across reads, and the slip of the tongue in `Strata` Q3 also show: **On-device acceleration is not magic; choosing the right engine division and controlling the read range of concurrent sub-agents is the key to enabling small models to steadily overtake in real workflows. **

## Main sources of verification and measured samples

- [LocalBrain Mac v2.4.7 Official Release Page (including Strata discovery page listing and scanning fixes)](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/v2.4.7)
- [LocalBrain Windows / Linux v2.4.3 release page (GGUF + DSpark acceptance notes)](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/v2.4.3-win-linux)
- [Hugging Face: strata-engine/Inkling-2-Mini-Strata (SQ-10 / SQ-15 / SQ-20 + Vision.strata)](https://huggingface.co/strata-engine/Inkling-2-Mini-Strata)
- [GitHub: Niko1221/Strata (v0.2.20 / 0.1.66 Metal and CUDA engines)](https://github.com/Niko1221/Strata)
- [GitHub:Generated-Computers/Locals (40be2496 fused with Metal kernels and Typed-Tools)](https://github.com/Generated-Computers/Locals)
- [Hugging Face: TokenAI-zer/Inkling-2-Mini-Uncensored-oQ4-mtp (oMLX version 0.8.2)](https://huggingface.co/TokenAI-zer/Inkling-2-Mini-Uncensored-oQ4-mtp)
- [Hugging Face: unsloth/Inkling-2-Mini-GGUF (Windows/Linux dynamic quantization and DSpark)](https://huggingface.co/unsloth/Inkling-2-Mini-GGUF)


---

## 🧰 Tools I build

I maintain all of these tools myself. Preview builds are clearly labeled; the release pages are the source of truth for downloads, updates and known limits.

> [!info] HyphenBox
> **Status:** Official releases
>
> A radar for free LLM APIs: availability is re-tested continuously, one local interface for all of them, and keys stay on your machine
>
> [Downloads & updates：HyphenBox](https://github.com/HackerChi-Hub/hyphenbox-release/releases)

> [!info] LocalBrain
> **Status:** Official releases
>
> A multimodal MCP toolbox for local models: TTS, Whisper and video generation in one place
>
> [Downloads & updates：LocalBrain](https://github.com/HackerChi-Hub/localbrain-releases/releases)

---

> [!quote] HyphenTech
> **Make AI your superpower**
> Local deployment · Free resources · Self-made software
> [HyphenTech](https://hyphentech.top)
