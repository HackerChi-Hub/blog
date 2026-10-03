---
title: "I had the local model run for two consecutive days to write five web games: 1 delivered, 3 ran, and 1 abandoned"
slug: localbrain-flash-next-five-tasks-en
status: published
lang: en
translation_of: localbrain-flash-next-five-tasks
translation_source: machine
source_sha256: b3ff32947ade1c53
date: 2026-09-11
updated: 2026-10-03
summary: "Qwen3.8-Flash-Next on a 64GB Mac ran five offline web challenges: 1 delivered, 3 executable, 1 abandoned. Every timeout, crash, and long context stall ultimately became a universal fix for LocalBrain."
categories:
  - Thoughts
tags:
  - AI
  - News
cover: https://hyphentech.top/obsidian-assets/localbrain-flash-next-five-tasks/cover-920b629b16.jpg
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/localbrain-flash-next-five-tasks/) is authoritative.

> [!abstract]
> 64GB Mac, 4-bit quantization, two hours per question. From prefill crashes to 119k context stalling, I turned repeated failures into general fixes for LocalBrain.
> HyphenTech · 2026-09-11

On Tuesday night, I handed five single-file web challenges to a Mac with 64GB of memory, letting LocalBrain write, test, and deliver Qwen3.8-Flash-Next by itself. **I thought this was a model capability test, but it turned into several days of proxy system emergency repairs:** The first prefill directly pushed 262k context into Metal memory errors; After a long task reached 119k words, I waited 5–7 minutes each round to prefill; A field with an incorrect location could fail seven times in a row; A small model even resent the same delivery request 85 times as is.

**The final results are still worth watching:** Issue 1 "Singularity Lab" was officially delivered; Issue 3 "Neon City," Problem 4 "Star Raft Chronicles," and Problem 5 "Neuron Furnace" can all be opened offline and pass runtime verification; Issue 2 "Restart in Sixty Seconds" still has 99KB still closed, so I decided to give up. Below is not only the result but also the long, awkward failures that truly helped LocalBrain improve.

> First, the conclusion: **1/5 is officially delivered, 4/5 is runnable. ** The "4/5 run" here includes that one question is officially delivered, not all four passed. This 4-bit model can already write complete pages with physics simulation, pathfinding, narrative, and backpropagation; What really drags it down is the full-round effective speed dropping from 26.5 to 5.2 words per second in a long context, and whether the proxy loop can promptly stop, close, and recover after failure.

![Final status of the five questions. Green means the model passed acceptance and delivery on its own; yellow means the model was not delivered yet but ran independently without errors; red means abandoned](https://hyphentech.top/obsidian-assets/localbrain-flash-next-five-tasks/image-overview-7c8cf160c7.png)

## 🧩 First, a concept: what exactly is being tested by having the model "deliver a webpage itself"?

Usually, when we ask the model to write code, it spits a segment, we copy and paste, run it for a bit, and then ask back later. This time it's different.

The proxy loop in LocalBrain hands this over to the program: the model calls the file writing tool to place the disk, the program automatically runs the page using a headless browser, feeds runtime errors, control counts, and interaction check results back to the model, which then makes and checks again until it calls "Deliver" and passes acceptance. In this loop, humans only provide the problem and time budget.

**This chain can't run from the start. **On September 2, when the model was asked to write a large 3D page for the first time, it stuffed large pieces of code into the tool parameter, just cutting off at the output limit; The application displayed "Written With" while simultaneously stuffing the broken JSON back into history, only to be rejected by the server in the next round with 500.

Later, even if the page was written to disk, the JavaScript inside would be invisible and the model would not be visible. This led to truncation rescue, save with the same name, line-by-line editing, headless browser self-check, and today's product strategy that only earnestly recounts.

Single-file HTML is a great test topic. It prohibits external dependencies, so the model cannot blame Three.js or React; It must correctly write the structure, style, and logic all at once; Moreover, whether "double-clicking opens or reports errors" is something the machine can objectively judge.

Each of the five questions covers five abilities: physical simulation and numerical stability, ray projection and state machines, multi-agent pathfinding, Chinese writing and interactive storytelling, neural networks and dynamic charts.

## 🖥️ Experimental setup: machine, model, parameters—none are missed

| Project | Actual configuration |
| --- | --- |
| Machines | Apple M5 Pro, 64GB unified memory, macOS 26.6.2 |
| Model | AtomicChat/Qwen3.8-Flash-Next-GGUF, file Qwen3.8-Flash-Next-AD-3.84bpw-IQ4_XS-M64, 28 shards totaling 79GB, read-on-demand (`--lazy-mode auto --load-mode mmap`) |
| Engine | llama.cpp b10705 (Metal) , `--jinja --reasoning auto --reasoning-budget -1 --ctx-checkpoints 8 --checkpoint-min-step 0 --n-gpu-layers all --parallel 1` |
| Context window | 174,080 morphems. The first time it starts at 262,144, the prefill is due to insufficient Metal memory. After the program fails to record it, it restarts at two-thirds of the value to get this value |
| Sampling | temperature 1.0, top_p 0.95, top_k 20, all taken from the recommended values declared by quantifiers in the GGUF metadata; Thinking mode is automatic |
| Measured speed | Decode 21–25 words per second within 20,000 characters; 100,000–140,000 words per second, 9–10 words per second, including each round of prefill for a valid total of 5.2; input prefill 260–550 words per second |
| Budget for each question | 120 minutes (20 minutes for smoke questions), then close according to the closing logic |
| Tools available for the model | inspect_file, read_file, write_file, append_file, edit_file, run_html_check (headless Chromium runtime + interactive check), stage planning, delivery |
| Independent verification | Start a new desktop browser to run products, counting runtime errors, animation frames, canvases, and controls; Then use behavioral scripts to check evidence item by item by question surface |
| Comparison model | Blackfrost Qwen 3.8-27B abliterated Q8_0 (29GB, about 9 syllables/sec) only runs basic level 3; Ling-3.0-tiny Q8_0 (MoE, 7.9B total / 1.3B activated) only runs Smoke |

The most easily overlooked line here is the "context window." It's not set by me; it's calculated by the program itself: at startup, KV is cached at one share of available memory. The 262k window bursts the Metal command buffer on the first prefill, the program records this failure, replans and restarts at two-thirds, and gets 174,080.

**Having a window open doesn't mean you can run long tasks. **Throughout the process, there are no rigid models or model constants.

## 🧬 Tested model: Key information in the official model card

The main focus of these five questions is Qwen3.8-Flash-Next. It was launched on ModelScope on August 24, and as of September 11, it has been downloaded 44,171 times and has 1,137 stars. The Qianwen team gave it a direct positioning in the model card: this is an experimental preview of the future Qwen4 underlying architecture, released for the first time in the form of open weights.

First, I lined up the official numbers side by side with the actual version on my machine. Almost all subsequent phenomena can be traced back to this table:

| Project | Official model card | The version used for this test |
| --- | --- | --- |
| Parameter scale | Total parameters are 125B, with each word only about 6B activated; Additionally, there are 51B N-gram embeddings and 4B MTP multi-word prediction modules | The community quantization version of the same model IQ4_XS 3.84bpw |
| Weight and volume | 131 safetensors shards, totaling about 360GB (based on parameter count, 16-bit precision) | 28 GGUF shards, totaling 79GB |
| Layered structure | 48 layers, 12 × groups (3 layers of Gated DeltaNet + 1 layer of Qwen Sparse Attention), each layer followed by MoE | The same |
| Experts | 512 experts, each word has 10 routing experts plus 1 sharing expert | The same |
| Context | Native 262,144 words, expanded to 1 million with YaRN | The actual test cap for 64GB is 174,080,262k, and the first prefill hits Metal memory |
| Multimodal | Comes with a built-in visual encoder, supporting image and video input | All five questions were plain texts and were not used |
| Permission | Qwen Community License 1.0 | Same as above |

![Official architecture diagram: Three layers of Gated DeltaNet combined with one layer of Qwen Sparse Attention form a hybrid block, repeated 12 times; The second layer additionally integrates N-gram embedding, with the MTP multi-word prediction module on top. Image source: ModelScope Qwen/Qwen3.8-Flash-Next Model Card](https://hyphentech.top/obsidian-assets/localbrain-flash-next-five-tasks/image-qwen38-architecture-e896082fde.png)

**The model has four new features, with the first two matching the phenomena from this test. **

- **Hybrid attention replaced with QSA. ** The previous generation's Gated DeltaNet plus Gated Attention was changed to Gated DeltaNet plus Qwen Sparse Attention. Sparse attention no longer picks word by word but selects by microchunk, budgeting 512 words or 2,048 words per time. The official says this significantly reduces long context latency. Out of 48 layers, 36 layers are Gated DeltaNet's linear attention, with states accumulating and cannot be casually intercepted to a specific location like regular attention; The later fix list for September 7 that says "only rollback to server checkpoints" is rooted here.
- **N-gram embedding. ** Using short phrases made up of two or three words to look up a table of 20 million embeddings, only connected at layer 2. The official explanation is that this method of parameter expansion requires less computation and is better suited for placement outside the accelerator's memory than MoE. A 79GB file can boot on 64GB of memory thanks to llama.cpp leaving these massive low-frequency tensors on the SSD for on-demand reads. The details are written in [[qwen38-flash-next-atomic-m64-localbrain|85GB models packed into 64GB Mac]].
- **Gated Residual. ** The residual stream is expanded into four branches, using element-by-element, data-dependent read gates and branch-by-branch write gates to control information entry and exit. According to the official statement, this keeps training stable while keeping inference overhead very low.
- **Training Formula. ** Muon and AdamW optimizers manage weights for different categories and have removed batch size warm-up, starting with target batch size training.

**Each word only activates 6B, which explains why it is faster than 27B. **Dense 27B requires calculating all 27B parameters per word generated, while Flash-Next only counts about 6B, so on the same machine it can run 22–27 bytes per second, while 27B only about 9. The trade-off is that the total parameters take up 79GB of disk and most of the memory.

**The official QSA claims it can reduce long context latency, but I tested decoding drop from 23 to 9.5 syphetans per second. These two things are not contradictory. **The recommended model cards are server engines like SGLang, vLLM, TokenSpeed, and KTransformers, which llama.cpp not on the list; llama.cpp when 0.4 was released, it only stated "preliminary support, optimization to be continued" (see [[llama-cpp-0-4-64gb-localbrain|llama.cpp 0.4: Has the 64GB hard wall loosened? ]]) . So this time, what was tested was the long-context speed on the current Mac engine, not the QSA limit; Before retesting the new engine, I won't blame the model for everything.

**In official benchmark scores, Flash-Next outperformed the dense Qwen3.8-27B in all 8 items I picked, with the biggest gap in agent programming and job tasks. **

![Official model card 8 tests: Flash-Next and Qwen 3.8-27B scores, ranked from largest to smallest difference. Data comes from ModelScope model cards, official full-precision evaluation, not 4-bit real-world test in this article](https://hyphentech.top/obsidian-assets/localbrain-flash-next-five-tasks/image-qwen38-benchmarks-de7e8ea4d6.png)

Here is a complete comparison of the five models; all are official numbers on the model card, bolded to be the highest on the line:

| Testing | What is it for? | Flash-Next 125B/6B | Qwen3.8-27B | Qwen3.7-Plus 397B/17B | DeepSeek-V4-Flash-0731 284B/13B | Claude-Opus-4.6 (Max) |
| --- | --- | --- | --- | --- | --- | --- |
| SWE-bench Pro | Agent programming | **62.5** | 61.7 | 55.8 | 56.0 | 53.4 |
| DeepSWE 1.1 | Agent programming | **58.7** | 42.2 | 16.5 | 54.4 | Not yet published |
| SWE-bench Multilingual | Multilingual software engineering | **81.0** | 73.8 | 75.8 | Not yet published | 77.5 |
| NL2Repo-Bench | Warehouse-level code generation | 48.1 | 42.3 | 41.1 | **54.2** | 47.6 |
| Toolathlon Verified | Real tool calls | **73.5** | 67.1 | 50.6 | 70.3 | Not yet published |
| JobBench | Career tasks | **55.7** | 33.4 | 27.6 | 41.3 | 36.6 |
| IFBench | Follow the instructions | **81.3** | 79.5 | 79.1 | 79.2 | 62.5 |
| GPQA Diamond | Scientific reasoning | **91.7** | 89.2 | 90.3 | 90.8 | 91.3 |
| HLE | Interdisciplinary challenges | 35.9 | 30.8 | 34.7 | 33.8 | **40.0** |
| LiveCodeBench v6 | Competition programming | **91.9** | 90.3 | 89.6 | 90.6 | 88.8 |

Reading this table requires four criteria. First, the programming test was tested by Qianwen in Claude Code or mini-SWE-agent frameworks, with a temperature of 1.0 and 256K context. The SWE-bench Pro for Claude-Opus-4.6 uses its official published scores. Second, Flash-Next isn't the first in every item: warehouse-level code generation loses to DeepSeek-V4-Flash, and interdisciplinary HLE problems lose to Claude-Opus-4.6. Third, the 27B in the official table is the original. This time, I compared it to the community-reviewed Q8 version, which can be compared in speed, but scores can't be directly applied. Fourth, these scores come from about 360GB of full-precision weighting. I ran 4-bit quantization at 79GB, and the results of the five questions in this article show the true performance of this version on this machine. **

For visuals, the official team also has a table: Android World 84.5 on mobile (62.0 on Claude-Opus-4.6), and 52.3 on computer OSWorld 2.0. All five questions are text-only tasks, which I didn't verify this time.

**Best Practices for Model Cards and My Setup This Time, Item by Item:**

| Project | Official recommendations | This time, in practice |
| --- | --- | --- |
| Sampling (Thinking Start) | temperature 1.0, top_p 0.95, top_k 20, min_p 0, presence_penalty 0 | Consistency: The recommended values in the GGUF metadata are this group |
| Sampling (Guan Sishao) | temperature 0.7, top_p 0.8, top_k 20, presence_penalty 1.5 | No switching: Guan Xiang is only used for short rounds like closing or forced tool calls, and sampling continues from the previous line |
| Intensity of thinking | Lowering the intensity of thinking in multi-round agent tasks may not be faster, and insufficient analysis can lead to more failures and retrys | In my tests, it basically ignores low settings; The last run is fixed at one gear, and I only adjust the budget based on the remaining time |
| Historical reflections | By default, all preserved thinking for all historical rounds is retained, helping agents maintain consistency in decision-making | Retain within a single task, and if the window is tight, start from the oldest round; Cross-round chat only provides model responses, without thinking |
| Output length | Within the context of 1 million words, the thinking is given 262,144, and the final answer is given 131,072 | 64GB can't fit: total window 174,080, each round of credit is dynamically set based on 'remaining time × actual speed' |
| Extra-long text | Over 262k using YaRN; Static scaling may drag down short text performance | Didn't use it; the bottleneck was within 174k |
| Reasoning engine | SGLang, vLLM, TokenSpeed, KTransformers | llama.cpp (Metal), a realistic choice on Mac, not on the official recommendation list |

Comparing the two, the sampling is completely as the official method is, with two main differences: 64GB of memory can't support the long output and native window requirements as officially suggested, and the official server-side engine can't be used on Mac. **So this time, the five questions test the combination of "4-bit quantization + llama.cpp + 64GB," which is not the upper limit of Flash-Next. **

**The license is also worth a look. **Qwen Community License 1.0 allows free use, modification, and distribution; But if you are in a model-as-a-service business (providing external APIs or managed inference) or AI work assistants, you must obtain Qianwenqian for authorization before commercializing; If the product has over 100 million monthly active users or monthly revenue over 20 million USD, the model name must be prominently displayed on the interface. Individuals running on their own machines, using it internally within the company, and not opening up model capabilities to third parties, are not subject to the second restriction.

> Data for this section comes from the official model card on ModelScope (accessed 2026-09-11): https://modelscope.cn/models/Qwen/Qwen3.8-Flash-Next/summary

## 📋 The five questions on the surface of the questions

The question comes from a 29KB file, and all five questions share the same set of strict requirements: only one HTML file delivered, all embedded files, no third-party libraries or network resources allowed, double-click offline, no pre-recorded animations to fake simulations, and a built-in "System Self-Check" panel that prevents writing results rigidly. Each question has dozens of specific requirements, so I'll highlight the toughest part:

| Topic | Visual form | The main test capability | The toughest requirement in the question |
| --- | --- | --- | --- |
| 1. Singularity Laboratory | Three-dimensional cosmic gravity sand table | Mathematical and physical simulation, numerical stability, performance optimization | ≥ 700 particles are actually affected by two moving gravity sources; Softening parameters, fixed step size, NaN detection; Single click generates gravity well, double-click 3D explosion, drag rotation, scroll wheel zoom; Challenge: "Binary System Keeps 60% of Particles Alive for 30 Seconds"; Frame rate below 30 automatically degrades |
| 2. Restart after sixty seconds | First-person pseudo-3D time loop | Ray casting, collision, state machines, temporal causality | Grid light casts corridors, players have radius but can't pass through walls; Seven timed events within 60 seconds that truly change the map; Current state and permanent clues reset separately; Patrol robots have five states and navigate the map; Password clues, three energy nodes in sequence, and can clear levels |
| 3 Neon City: The last order | GTA-style 2.5D open city | Multi-agent, pathfinding, system coupling, task logic | Fixed seed spawn ≥12×12 blocks with connected roads for pathfinding; Minimap matches city; Vehicle has inertia and side-sliding friction; Day-night cycle, night headlights; Traffic, police cars, wanted levels, delivery tasks |
| 4. Star Raft Chronicles | 2.5D Ink Interactive Long Scroll | Chinese writing, semantic mapping, narrative, interaction design | Original imitation classical text, 350–550 words, with translation and annotations; Five scenes, ≥ 5-layer parallax; Classical semantic mapping to visual changes; Tianyin mechanism, three endings; Web Audio programmatic sound effects |
| 5. Neuron Furnace | 2.5D Data Lab | Neural networks, backpropagation, dynamic charts, interpretability | Handwriting forward and backpropagation, numerical gradient check; tanh/relu, L2; XOR, bimonth, concentric, and spiral datasets; Real-time decision boundaries and loss curves; NaN detection and experimental records |

The smoking problem has only four sentences, which are the threshold you pass after each code change. The original text is as follows:

> Please create a single-file HTML task list that can be opened directly offline, with file name smoke-taskboard.html; No external dependencies are used. The page must have a title, new task input box #task-input, add button #add-task, list #task-list, unfinished quantity #remaining, and clear done button #clear-done. After entering text, you can click Add or press Enter to add; Leave blank input and cannot add items. Each task has a checkbox; after checking, underline and update the unfinished quantity; the clear button only deletes checked options. Starts from an empty list by default. Use clear Chinese prompts, centered cards, and readable color schemes. Please write the file in person, and use the real interaction of run_html_check to verify adding, checking, and clearing before delivery.

The full faces of the five questions are attached at the end of the article. If you want to reproduce them, you can paste the entire paragraph into the LocalBrain chat box.

## 📊 What actually happens in each question

| Topic | The result | Number of rounds | Time | Product | Independent verification |
| --- | --- | --- | --- | --- | --- |
| 1. Singularity Laboratory | **delivered** | 22 | 6,902 seconds | 45,018 B | Model self-check is delivered after 3 sets of 36-step interactions; Independently verifies 19 items to pass 18, 0 runtime errors, and 12 controls |
| 3 Neon City | timeout, can run | 23 | 7,200 seconds | 77,801 B | 0 errors, 2 canvas, 5 controls; Fixed seed, 12×12 blocks, traffic lights, pathfinding, wanted, police car status, pedestrians—all are recorded; The 'W Acceleration' interaction item was not passed |
| 5. Neuron Furnace | timeout, can run | 30 | 7,200 seconds | 42,600 B | 0 errors, 5 canvas, 22 controls; tanh/relu/backpropagation/numeric gradient/quad dataset/L2/decision boundary/NaN detection—all hits |
| 4. Star Raft Chronicles | Timeout → can run after three recoveries | 19 + 23 | 7,200 seconds + about 7,900 seconds recovery | 137,793 B | 0 errors, 8 canvas, 81 controls; 5 scenes, parallax, 3 endings, Tianyin, Web Audio all correct; 228 classical Chinese characters but less than 350 |
| 2. Restart after sixty seconds | Give up | 27 | 7,200 + 4,700 seconds | 99,268 B | Not closed, not operational |

Question 1 was the only clean delivery. In 22 rounds, the model wrote three sets of interaction checks. After passing all 36 steps, the third set was called for delivery and acceptance.

I also wrote a behavioral script to check item by item by question: the number of particles changes in real time and is an integer of no less than 700; after pressing space, the status text really becomes "Paused"; the canvas pixels are changing; the self-check panel has 18 conclusion terms—19 items passed, 18 passed. The only thing that didn't pass was that at the moment of snapshot, the challenge state text did not show the words "success/crash/progress."

![Question 1 "Singularity Lab" Operating State: 760 particles orbiting dual gravity sources, trajectory, console, and individual self-check refresh simultaneously](https://hyphentech.top/obsidian-assets/localbrain-flash-next-five-tasks/image-shot01-active-e6f6b59898.png)

![Problem 1 "Singularity Lab" Paused State: Black hole, luminescent accretion ring, and particle trails remain in the frame, while the right side still displays quantity, frame rate, and self-test results](https://hyphentech.top/obsidian-assets/localbrain-flash-next-five-tasks/image-shot01-paused-185f646d27.png)

Problem 3 and Problem 5 belong to the same category: two hours to arrive, the model hasn't been called and delivered in time, but the product itself is good. Problem 5: Thirty rounds are 42KB, independent runs show 0 errors, 5 canvases, 22 controls; backpropagation and numerical gradient checks can all be found in the source code; Problem 3: Twenty-three rounds are 77KB, with city, traffic lights, wayfinding, and wanted all verified, but the model's own interaction check "Accelerate speed change with W press" failed. I didn't change this item, leaving it for trial and confirmation.

![Question 3 'Neon City: Last Order' Daytime Screen: Road Network, Vehicles, Mission Objectives, Minimap, and System Self-Check All Visible](https://hyphentech.top/obsidian-assets/localbrain-flash-next-five-tasks/image-shot03-day-6c0e9dce6b.png)

![The same city enters night: building outlines and streetlights come on, visibility drops to 60%, navigation and delivery tasks continue](https://hyphentech.top/obsidian-assets/localbrain-flash-next-five-tasks/image-shot03-night-fdfbf74d74.png)

![Problem 5 'Neuron Furnace' Training State: XOR Dataset, Two-Layer Network, Loss Curve, Decision Boundaries, and Accuracy All on One Page](https://hyphentech.top/obsidian-assets/localbrain-flash-next-five-tasks/image-shot05-training-b1ca6f2e5b.png)

Question 4 is the most illustrative question this time. The first time, after 120 minutes of writing to 129KB, it was time to write, and the file was missing the last three closed tags (script, body, html). The subsequent closing wheel filled in the closures, and the page could open, but exposed a runtime error: the container for the menu jump did not exist.

The second recovery took 30 minutes, the model spent 18 minutes thinking, and after one edit fixed the error, the self-check immediately reported the following: `createRadialGradient` Received non-finite value.

For the third recovery, I changed the approach: the program folded the history of 129k lexems into 22k, and the model read through 2,480 lines of files in 12 rounds. In reasoning, I accurately pinpointed the root cause—the parameter order was reversed when drawing the close-up, causing NaN—but time was up. The fourth time, 60 minutes, it finished correcting and self-checked for 0 errors. In total, Problem 4 spent more than two hours recovering.

![Topic 4 'The Lonely City in the Sea of Mist' in 'Star Raft Chronicles': Ink Parallax Background, Original Imitation Ancient Text, Modern Translation, Prompts, and Five Scrolls Navigation Appear on the Same Screen](https://hyphentech.top/obsidian-assets/localbrain-flash-next-five-tasks/image-shot04-fog-city-472572ff16.png)

![After switching to the 'Wordless Stele Forest,' the distant view, mist layer, star points, and scroll content all change together, proving that the five scenes are not the same static base map.](https://hyphentech.top/obsidian-assets/localbrain-flash-next-five-tasks/image-shot04-stela-forest-8fc4cf52b8.png)

## 🎮 Just how rich is the final effect?

**These seven images are neither concept drafts nor temporary renderings for the article; all come from the actual running HTML. **Problem 1: Calculate over 700 particles, two moving gravity sources, and particle trajectories on the same screen; pause, zoom, rotate, explode, and challenge states all respond realistically; Problem 3: City roads, vehicles, traffic lights, navigation, wants, day-night changes, and task settlement; Problem 4: Stuff the ink scroll, five scenes, parallax layers, puzzles, three endings, and Web Audio into a 138KB file; Problem 5 draws the dataset, network structure, forward propagation, backpropagation, loss curve, and decision boundaries all at once.

What surprised me most wasn't how beautiful a single image was, but how the model could fit four completely different visual and interaction systems into a single file from scratch, without React, Three.js, image materials, or network requests. **It has already moved beyond the stage of "only one button can be written for demo." **

But rich visuals don't necessarily mean the delivery is qualified: the driving feel in Problem 3 wasn't tested one by one, the ancient text in Problem 4 is only 228 words and lacks localStorage evidence, and Problem 5 wasn't actively called and delivered at that time. Therefore, this article marks them as "runnable" rather than "fully completed."

Question 2: I gave up. In 120 minutes, it wrote 84KB, but the file was not finished; The closing wheel added 15KB of code, but still didn't write closed tags; After another 30 minutes, the model generated 33KB of additional content in a 117K context, but halfway through, the wall clock hit and the entire segment was nullified. It's not that it can't write, but every attempt requires 5 minutes of pre-filling, then pressing 5 words per second to push out.

## 🔥 There is only one real culprit: once the context is long, the decoding slows fivefold

All recovery failure records are placed together, pointing to the same number. On this machine, Flash-Next decodes 23 syphetans per second within 20,000 characters, and 26.5 during warm-up; at 100,000–120,000 characters, the server-reported decoding speed drops to only 9.5 syphetaves per second; Plus, each new question and receipt must be pre-filled in advance, so the effective rate calculated by the bench for the entire wall clock is 5.2 syphetaves per second. Same model, same machine, same weight, just longer history.

![For the same machine and model, decoding speed decreases with context length: each level is the median server-side decoding speed in the turn-by-round trajectory](https://hyphentech.top/obsidian-assets/localbrain-flash-next-five-tasks/image-speed-bc0e0d4945.png)

This number explains everything. When recovering from a checkpoint, the cache is cold; 117k words need to be prefilled for 5–7 minutes first; After that, the model takes two to three minutes to think for every 1,000 words; Writing a 33KB addition takes an hour. A 30-minute recovery budget is enough to complete one round.

**Long context is not free hard drive space. **No matter how large the window numbers are, if a single recovery prefill takes seven minutes, the remaining space is just "fit in," not "within budget." This is also why I later put folding recovery before blindly expanding windows.

**The difficulty is not just about "waiting too long." **Every time a long task fails, I have to first determine whether the responsibility lies with the model, runtime, or LocalBrain: Is it the model that didn't understand the problem, or was the tool parameter truncated at the maximum length? Is it the page code that is really wrong, or is the checker crashing on its own?

Is it exploring different solutions, or is it just repeating the same thing in different sequences? If you make a wrong judgment once, you might spend the next twenty or thirty minutes fixing a problem that doesn't exist. So what really consumes energy during this period is breaking down a mess of failures into observable, reproducible, and programmable concrete forms.

> The most important outcome of this round of optimization is not to make the model "always successful," but to finally let the system know when to continue, when to change methods, when to close files first, and when to admit incompleteness.

Once you know the reason, you'll find a way to change the method. During this period, I've added eight mechanisms to the LocalBrain proxy loop, all based only on the amount measured by myself during this run, with no special judgments for model names or models:

| node | Problems exposed in actual tests | The current approach |
| --- | --- | --- |
| Recovery | The entire cold cache prefills the entire paragraph for 5–7 minutes, then each round is valid for 5 words per second | Auto-fold long history: No summaries required from the model, only one program description is displayed, keeping the most recent complete operation; Fold only when less than half of the input is folded and the folded part exceeds the output quota of the previous round. Measured values: 129,446 → 22,418 words |
| Closing the tail wheel | 117k history—next time I add 30 minutes, I won't finish it | The closing wheel only includes system prompts, original question pages, and closing instructions, with file interrupt line numbers and the last few lines attached |
| Repair closures | The page had long been closed, but three rounds of reclosing were triggered by the 'Self-check failed' update | Only complete closures for documents whose structures are not closed; Write a summary of closed text |
| The sluice gate was terminated | The 'Verification Stall' gate stopped immediately, leaving only the closed label document frozen as scrap | Before stopping, the closing is supplemented, and then the closure is due to the gate issue |
| Cycle detection | The same self-check intersperses reading 8 times with zero prompts; Receipts with millisecond timing, the original text comparison is never equal | Counting by "signature + stable result" without resetting the interval, the result changes the number of duplicates; Self-check receipt includes the structured results of the timed interval |
| Delivery | A small model resubmitted 85 times as is, each time rejected for the same reason | Delivery rejection also involves incoming loop checks, with budget blocking the signature, but no budget stopping |
| Parameter validation | For the same 'missing input' rule, Flash-Next got it wrong 7 times, and the small model got it wrong 14 times | The first sentence of the receipt specifies which field is missing and which object it is written on |
| Failure calls the original text | The model thought system says "add input this time," but the parameters sent are the same as last byte, sending 8 times in a row | For calls that fail validation or are blocked, only placeholders are left in subsequent requests, without parameter texts that can be copied verbatim |

The last point is the most interesting. At temperature 1.0, all 573 words are identical eight times in a row, so it's impossible to be a sampling coincidence—it must be the model copying the failed call from the context. Its reasoning clearly corrects the modification, but when writing, the hand follows the old text.

For example, databases like opencode, pi, and Cline keep failed calls as they are in history and correct them with receipt text; This test proved there is a type of error that receipts cannot fix—they simply don't look at receipts. After replacing copyable original text with placeholders, the smoke problem went from three consecutive timeouts to eight rounds of delivery.

## 🛠️ Specific mistakes I made in the past few days: a complete list

The table below shows all the issues removed between September 6 and 10, arranged by chronology. Each row corresponds to a real test: the symptoms are exactly as recorded in the rack records, and the revisions have Level 0 single tests and Level 1 smoking as a backup. They share one thing in common—none are special cases for a particular question or a single mistake; all the criteria are measured by the current run.

| Date | Symptoms (measured) | Root cause | Amendments and Outcomes |
| --- | --- | --- | --- |
| 09-06 | Windows 262,144 crashed on first prefill: Metal command cache memory insufficient | KV cache is reserved in the window, but the machine cannot fit it | Runtime capacity failure is recorded to disk → reboots at two-thirds → 174,080; the product side automatically retries once for the same request |
| 09-07 | Each round recalculates 13–18k word inputs from the same position | The rules of old-fashioned thinking have changed the mid-input segment; The hybrid architecture (Gated DeltaNet) can only roll back to the server checkpoint | Projection changed to pressure-driven, one-way memo, no pressure without moving; Start parameter plus `--ctx-checkpoints 8 --checkpoint-min-step 0` |
| 09-07 | Guan Sikao's round replies mixed with the 'budget exhausted' junk text | Sent `reasoning_budget_tokens: 0`, and the template injects a prompt accordingly | The Thinking Wheel only sends template switches, not budget fields |
| 09-07 | The main text is written long but no tools are used, making the whole round wasted | The model writes code into replies instead of tool parameters | Stream text guard: If the product hasn't been created yet, there are no tool parameters in the stream, or the main text exceeds 1,024 words, the current round will be stopped, and the next round will force the tool call |
| 09-08 | After five consecutive failures, the program ends, leaving only half the budget | The error ceiling is the last line of defense designed for no-budget scenarios | If there is a time budget, the call signature is blocked and the task continues; The same parameters are no longer executed |
| 09-08 | The cutting wheel that only thinks and has no tools comes to an immediate end | Cutting off is considered a mission failure | Non-terminated: Draft retained, next round required + reflection |
| 09-08 | Single round of thinking takes 28–41 minutes; Ignore the low-mode model | No limit on budget; Gear text is written in system commands; changing settings will destroy the prefix cache | Return to budgeting by allocation; Run a fixed set at once, adjusting only the budget numbers |
| 09-08 | Problem 2/Problem 4: Write 84/130 KB in two hours, missing the final closed label | At that time, I will only do a written summary; no one will finish it up | Finish by adding closures: required + Guan Shou, then fill in the tags |
| 09-09 | The first round of resumption runs is not priced, with 32,768 words of thought until the wall clock | The newly launched service has no measured speeds | After starting the server, warm-up takes the speed seed once; If the warm-up prompt is too short to pass the guard, change it to generate a dozen or so characters |
| 09-09 | The same self-check interspersed reading 8 times with zero prompts | Cycle detection is called with consecutive identical counts; Self-check receipt with millisecond timing, grading according to the original text is never equal | Count by "signature + stable result," with no reset; Self-check receipt attaches the structured results of the timed version |
| 09-09 | Snake failed the same assertion in 4 versions, running 10 rounds without anyone blocking (Windows side) | None of the three barriers have the pattern of 'changing every round, but never failing the same check.' | Fourth gate 'Verification Stall': Version 2 prompts, version 3 stops and keeps checkpoints; At the same time, record denoising and collision alarms are saved |
| 09-10 | Closed up only once, added 15 KB in the final round but didn't write a label, and the remaining 12 minutes were invalid | "Try it once" was the original conservative design | If not yet closed, if the schedule is sufficient, or before three rounds are completed, refill the gap; Only open and close documents with unclosed structures |
| 09-10 | If the gate is not closed after the gate is stopped, the document will be frozen as scrap | Directly break the gate, skip the finish | Before termination, the closure is supplemented, and then the closure is due to the gate issue |
| 09-10 | 117k Finish the last round under context in 30 minutes, add one more time; After recovery, each round uses 5 syllables per second | Decoding speed decreases with context length | Wrap wheel slimming request (only system prompts, question pages, closing instructions, and file ending); Automatically collapse long history on recovery 129k → 22k |
| 09-10 | A small model was delivered 85 times as is | Delivery follows an internal path and never goes through loop inspections | Delivery rejections are also accumulated by signature + result, with budget blocks, no budget stops |
| 09-10 | The same 'missing input' check rule is mistaken 7–14 times | Receipts are structured JSON, so the model cannot read 'which object the field should be written on.' | How to modify the first sentence of the receipt; When multiple items follow the same rule, you can choose deduplication from the list |
| 09-10 | The model thought says "add input," but the parameters sent are the same as the last byte-byte cycle, sent 8 times in a row | It copies the failed call from the context; At temperature 1.0, all 573 words can only be copied | Calls that fail validation or are blocked are only spaced in subsequent requests; Smoke has changed from three consecutive timeouts to eight delivery rounds |

This table also explains why five problems took two days to complete, yet the entire repair chain lasted from September 6 to 10: most of the time wasn't just looking at the progress bar, but checking each round's trajectory, assigning responsibility, modifying the program, supplementing regression, and then using the smoking problem to verify it from scratch. **If a single change only improves one problem, I won't accept it; It must change the model and the problem surface to still hold up. **

In the end, the smoke task went from three consecutive timeouts to eight rounds of delivery. Problem 1 became the first official delivery among the five, and the recovery history of 129,446 words in Problem 4 was folded down to 22,418. The model was finally able to read files at fixed points and fix two real runtime errors in the remaining time.

## 🧭 How does LocalBrain handle a Q&A now?

**I redrew this image based on the current 1.2.62 real call chain. **It's not a product promotional image, but rather the result of routing from `Chat.tsx` to `mcpAgent.ts`, sharing `agentLoop.ts`, normal conversation `plainChatLoop.ts`, and platform tool routing.

The most crucial design is: by default, users no longer guess whether a tool wants based on keywords; the tool directory is always present, and the local model decides whether to answer directly or call it.

![LocalBrain Current Q&A Main Chain: Default tool Q&A, normal dialogue bypass, and an additional test layer added by the five-question desktop](https://hyphentech.top/obsidian-assets/localbrain-flash-next-five-tasks/image-flow-a2488c48ef.png)

**Before sending, the program handles three things first. **First, lock which session the current generation belongs to; users cannot thread streaming content across other conversations; Second, compress old messages according to the safe input budget, turning text attachments into context, and images readable by the visual model go through the native image channel; Third, calculate how much output can be given this time based on unified memory or video memory, model window, and safety margin.

Here, the original requirements and generated content are preserved first, then the quota is negotiated to avoid cutting the task itself just to fit into the window.

**By default, Q&A uses tool proxies. **Mac will prepare seven types of local services: DocFactory, WebMiner, TTS, Whisper, Images, Video, and System Files; Windows currently only injects three types of real backend services: DocFactory, WebMiner, and System Files.

The entire tool definition is given to the model upon request, without keyword prediction of "only opening the tool when it sees the word 'write file'." The model answers directly without the tool; When needed, it creates structured parameters, which are verified by the schema before calling the real tool. The tool's success, failure, output path, and evidence verification are then sent back to the next round.

**Complex tasks enter the shared proxy kernel. **This is where the loop checks, error tracking, product versioning, evidence projection, context organization, and checkpoints are used. Each time a file is modified, the previous version's acceptance conclusion is automatically voided; Tool failures are not packaged as success, nor are unknown side effects replayed; Only when a model repeats the same name and parameters and yields the same stable result does the program count it as a loop.

If a pre-filled OOM or calculation error occurs during the runtime, LocalBrain will record the local capacity failure, stop the current instance, restart according to the new plan, and retry the same request again.

| Path | When to leave | Practical mechanism | Clear boundaries |
| --- | --- | --- | --- |
| Default tool Q&A | Enable automatic tools and model support tools | The tool directory is always present; The model decides to answer or call it; Real feedback is restored; Checkpoints are saved | By the maximum number of rounds and users stopping the lock, no wall clock is imposed |
| Normal dialogue bypass | Disable automatic tools, mini-models, or optional tools that are indeed missing during runtime | Safe output budget and streaming body text; Automatically continuation after reaching the maximum length, up to 4 segments | No document acceptance or tool cycles |
| Document tasks | Generate or modify PPT, DOCX, XLSX, PDF | The shared proxy kernel is reused, with planning, generation, and self-checking handled by document product policies and DocFactory | Passing the layout does not mean the content is correct; acceptance must still be conducted according to the original requirements |
| This five-question platform is set up | To perform repeatable stress tests on models and agent loops | Outside the shared kernel, add wall clocks for each question, measured rate pricing, turn-by-turn trajectory, recovery, standalone browser, and behavioral scripts | These extra time governance cannot be passed off as features already enabled by the product's regular Q&A |

> Boundaries that must be clarified: in the five questions of this article, "remaining time × measured rate" and the two-hour wrap-up belong to the test bench; LocalBrain product Q&A has no natural cutoff time; currently, boundaries are based on secure context, maximum number of rounds, automatic continuation, and user stops.

**This optimization has already reached version 1.2.62 and is a complete set of general capabilities:** Shared proxy loop, capacity failure recovery, parameter validation and error correction, failed parameter spacehold, stable result loop detection, product version and acceptance evidence, folding recovery, and closing closure. The desktop exposes these issues harshly enough, and ensures every result has a retrospective, original trajectory; But which entry actually passes which parameters, I still write according to code boundaries, not swapping "underlying support" with "all interfaces are active."

## 🧐 A challenge to admit: what exactly is wrong with the model?

Let's start with Flash-Next. Its coding capability is sufficient: the 700-particle gravity simulation in Problem 1 and the handwritten backpropagation in Problem 5 were all written correctly in one go; It also fixed two runtime errors in Problem 4 itself.

It has three shortcomings: first, "thinking right, doing wrong," the above form of copying old parameters is the same; second, ignoring advice, the closing wheel clearly states only to add closed tags, yet it still adds 15–33KB of code, because in its eyes, the file is indeed unfinished; third, the Chinese long text is relatively short; question 4 requires classical text 350–550 characters, but it wrote 228 characters.

Now, about the control group. On the abliterated version of 27B, I only ran the basic level 3: Smoking, Bouncing Ball, and Snake all delivered, and Snake lasted 34 minutes.

Each round has higher quality, and if a parameter is wrong once, it gets corrected. But 9 words per second is 40% faster than Flash-Next, so the 115-minute task for question 1 takes four to five hours. At this rate, in 120 minutes, each question can be delivered for about 0 questions and 1–2 to run for it. This is a calculation, not a real test—I didn't run it.

Ling-3.0-tiny is a newly added MoE small model to the directory in the past two days. Out of 7.9B, only 1.3B is activated, with a speed of 70–95 words per second, three times faster than Flash-Next. It can write a runable taskboard in the first round, but then gets stuck in the same place: it can't write valid interaction check parameters.

On the first run, in the sixth round, its reasoning accurately states "expectation 0, actual 1," but the action is an edit that changes nothing; On the second run, the tool requires set_value to place the text to be input in the input field, but it insists on putting it into expect, fails to check 14 times and corrects correctly, then resubmits the original form 85 times. This is the typical small model form: diagnosis is correct, execution is wrong.

There's one more thing I need to clarify. **"Runnable" does not mean "all passed." **The criteria here are double-click to open, a headless browser running for five seconds without runtime errors, and the core structure of the question can be verified in both the source code and actual rendering. I didn't try out each of the driving feel in Question 3 or the puzzle in Problem 4 that can be solved to the end. Writing it as "passing all four questions" is an exaggeration; I don't write it that way.

## 💰 Is this debt really worth it? Who is crying, who is laughing?

Two days of electricity bills and waiting for four pages that can run are worth a clear calculation. The pay-as-you-go API side naturally wants you to handle this work on the cloud—dozens of rounds of input in two hours, each with tens of thousands of words, calculated at public prices, costs tens of yuan per question, five questions per meal, and no waiting. The local bill is: 79GB of model files free, electricity costs can be ignored, but the cost is all time and effort.

But there are two types of people who find local resources more cost-effective. One type is those whose questions can't be machine-generated — internal company code, unreleased products, private projects; The other type requires repeating the same type of task — running five questions once is expensive, but running a hundred times is cheaper. Also, the eight mechanisms LocalBrain has recently updated are all repeatedly run locally, so you can't get this kind of control on the API.

Who's silent? Sellers of 64GB machines have no motivation to tell you that long contexts reduce their speed fivefold; Modelers have no motivation to tell you that writing long texts at 4-bit quantization will shrink. I only learned these two points after running them myself.

This round I finally accepted one thing: reliability doesn't mean never making mistakes, but that when mistakes happen, you can still finish the most important tasks. **

The most frequent changes in the agent cycle these past two days are the same thing: when the gate determines it should stop, it closes the file first, then stops; When the budget is tight, it folds the history before getting to work. System reliability doesn't depend on errors, but in being able to finish the most important tasks when errors occur.

## 🛠️ I want to run it myself: the path is all here

- **Install Application:** LocalBrain 1.2.63 has released macOS (Apple Silicon) and Windows x64 installation packages, download library https://github.com/HackerChi-Hub/localbrain-releases/releases. Linux currently has no available inference runtime, so no package was included this time.
- **Lower model:** Search for Qwen3.8-Flash-Next on the 'Discover' page, select IQ4_XS for 64GB machines; For 32GB and below, avoid this; choose Ling 3.0 Tiny or Qwen 3.6 in the lower mode.
- **Question Description:** Choose one from the "5 Questions Replay Package" below, paste the entire paragraph into the chat box, and send it. The agent can write documents, run self-checks, modify, and deliver; The finished product is under `~/Downloads/方寸智匣/系统输出/`.
- **Watch the process:** Each round in the execution log contains input keywords, output amount, generation time, and tool feedback summary. When the speed drops, you'll see the line "This round's output limit tightened to 3,295 words."
- **Don't Count on Things:** One question every two hours isn't guaranteed; it's the actual median on this machine; Switching machines, quantitative analysis, or questions will all change.

## 📦 5. Problem replay pack

The five complete questions have been packaged according to the original text used for this test, totaling **29,816 bytes and 727 lines**. TXT is suitable for directly opening or copying one of the questions; ZIP is suitable for downloading and saving in one go. It is recommended to start a new dialogue for each question and send the entire text directly. Do not have the model write the solution first, and do not count the results of manual revision to the tenth version as the first delivery.

- [Online viewing of UTF-8 plain text](https://hyphentech.top/obsidian-assets/localbrain-flash-next-five-tasks/localbrain-five-tasks-prompts-966edfb32b.txt)
- [Directly Download ZIP Compressed Package](https://hyphentech.top/obsidian-assets/localbrain-flash-next-five-tasks/localbrain-five-tasks-prompts-966edfb32b.zip)
- **Document Verification:** `SHA-256 966edfb32b75b5a6868615f7d683019befbe702c1f5beeb3007f97731cf2723e`

> [!tip] Retest recommendations
> The five questions test three-dimensional physics simulation, first-person state machine, multi-agent pathfinding, Chinese interactive narrative, and neural network interpretability. When comparing different models, please keep the question surface, machine, quantization, context, single question time, and "formal delivery" criteria consistent.

Back to the initial question: Can a 4-bit local model independently complete a web project with dozens of mandatory requirements? **Yes, but this time the official delivery rate is only one-fifth; The other three-fifths only get runnable products. **I'll test this number again next month—among the eight mechanisms, a few have only passed the deadline, and five problems are redone with new code as a result, and then I'll post them as is.

> [!tip]
> **Original Record**
> · The complete questions of the five questions are provided above in TXT and ZIP; Both versions are from the same original text
> · The original text of the four basic questions—Smoking / Bouncing Ball / Greedy Snake / Brick Breaking—is available in the LocalBrain repository docs/TASK_PROMPTS.md
> · Each report's JSON, turn-by-turn trajectory, checkpoint, and behavior script output are stored in the bench output directory; all the numbers in this article come from these files


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
