---
title: "16GB local speed 102 words/second! Inkling 2 Mini six-engine hands-on test Qianwen 3.8: From inverted bonsai to barrel effect"
slug: inkling-2-mini-six-engines-qwen38-blindtest-en
status: published
lang: en
translation_of: inkling-2-mini-six-engines-qwen38-blindtest
translation_source: machine
source_sha256: 90f6be43ec3ebe20
date: 2026-11-25
updated: 2026-11-25
summary: "M5 Pro 64GB tested six major local engines: Strata soared to 102.4 tok/s, Atomic pushed 6.34 GiB to revive a 16GB Mac; Four web blind tests tested with thousands of questions 3.8-27B, including memory selection table."
categories:
  - Thoughts
tags:
  - AI
  - News
cover: "/obsidian-assets/inkling-2-mini-six-engines-qwen38-blindtest/cover-db0fb541c5.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
article_type: "article"
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/inkling-2-mini-six-engines-qwen38-blindtest/) is authoritative.

> [!abstract]
> From reviving the entry-level Mac with 6.34 GiB, to Minecraft featuring handstanding, spinning bonsai, and racing cars turning into "driverless": exposing the high-speed dividends and hidden weaknesses of high-rated influencer models all at once.
> 2026-11-25 · HyphenTech

　　Just recently, Thinking Machines, founded by former OpenAI core researchers, released the latest open-source multimodal model, **Inkling 2 Mini** (Apache 2.0 protocol, **26B** level circular MoE architecture, total parameters about **26.4B**, word activation about **5.4B**). Less than a week after launch, Hugging Face's original repository downloads have surged to **68,042**, with the community spawning **242** quant packs and **42** fine-tuning branches all at once; Looking at the official paper scores, almost all models of similar scale have gone positive.

![Thinking Machines official Inkling 2 Mini model card with 242 community quant derivative trees](https://hyphentech.top/obsidian-assets/inkling-2-mini-six-engines-qwen38-blindtest/image-hf-inkling-overview-5d1c19086f.jpg)

　　But old friends who use local deployment understand one thing: **Paper benchmarking is one thing; whether you can write the correct code on your own computer, how much memory it occupies, and whether it will freeze are completely different matters. **To avoid ads and focus on effectiveness, I used a homemade desktop tool on the same **Apple M5 Pro 64GB** unified memory MacBook Pro with a "** LocalBrain v2.4.9** ran through six of the most popular local inference solutions around Inkling 2 Mini, including **Strata, Locals, Atomic Engine, oMLX 0.8.3, Unbound v2.1**, and more. Then we brought in the familiar endpoint gatekeeper **Qianwen Qwen3.8-27B**, and blind-tested four sets of high-difficulty single-file interactive web projects on the same topic.

> [!important]
> First, let's put the two most contrasting real-world conclusions on the table: in terms of extreme throughput and memory saving, the Inkling 2 Mini is truly outstanding—Strata single-stream peaks at 102.4 tok/s, and the Atomic Engine streaming solution pushes physical peak memory down to 6.34 GiB, allowing even a 16GB entry-level Mac to run smoothly; But once you add it to Minecraft and 3D racing front-end blind tests, it immediately creates an "inverted rotating bonsai" and a "driverless race car with a malfunctioning directional key," while the 30+ tok/s Qianwen 3.8-27B wins the complex engineering exam.

## 1. M5 Pro 64GB Six-Engine Hardcore Benchmark: 102.4 tok/s top speed and 6.34 GiB to save a 16GB Mac

　　The same open-source model base running under different inference engines and quantization formats often results in vastly different experiences. In this test, I integrated all branches into LocalBrain v2.4.9, testing the same code rewrite, tool calls (`edit_file`), bilingual source code troubleshooting, native diagram viewing, and three logical trap problems one by one:

| Local engine and gear | Peak physical memory RSS | Code decoding peak | Native image reading takes time | Core strengths and applicable boundaries |
| --- | --- | --- | --- | --- |
| Strata v0.2.20 · Uncensored SQ-15 | 12.21 GiB | 102.40 tok/s | 6.82s (8/8 all correct) | 2.27s ultra-fast cold start, T5 logic 3/3 fully correct, preferred for 24–64GB Macs |
| Atomic Engine · AD-IQ2_M (8GB streaming) | 6.34 GiB | 41.67 tok/s | Excluding image viewing | NVMe Cold Expert On-Demand Streaming Read, Reviving 16GB/18GB Entry-Level Macs (4K Context Only) |
| Atomic Engine · AD-IQ2_M (14GB residential) | 9.17 GiB | 51.02 tok/s | Excluding image viewing | 1.87s cold start, 0 SSD cold reads missed, pure text light and smooth |
| oMLX 0.8.3 · Uncensored oQ4-mtp | 9.39 GiB | 40.77 tok/s | 27.46s (8/8 all true) | Enabling MTP + 4-bit KV saves nearly 7 GiB of memory compared to the previous version |
| Unsloth b12651 · Unbound v2.1 IQ2_M | 13.81 GiB | 54.44 tok/s | 53.53s (8/8 hits) | Universal across Mac/Win/Linux, DSpark has a draft acceptance rate as high as 95.4% |
| Locals · Inkling-2-Mini NVFP4 | About 15–16 GiB | 61.1 tok/s (four concurrent over 100 km/s) | Excluding image viewing | Combining Metal operators with syntax constraints, plain text tool calls are crisp and efficient |

> Tested hardware: Apple M5 Pro 64GB unified memory (macOS arm64 Metal), test software: LocalBrain v2.4.9.

![Decoding speeds and physical peak memory tests for various engines on the M5 Pro 64GB Inkling 2 Mini](https://hyphentech.top/obsidian-assets/inkling-2-mini-six-engines-qwen38-blindtest/image-six-engines-speed-rss-aac0b1a9cc.png)

　　Two of the most eye-catching breakthroughs in these test results are the most eye-catching. The first is **Strata v0.2.20 (Uncensored SQ-15)**: cold start in just **2.27 seconds**, single-stream code rewrite directly soars to **102.40 tok/s**, which was almost unimaginable when running 26B–30B models before; Even more impressive, it does not sacrifice multimodal accuracy due to rapid speed; it identifies information from 8 models in just **6.82 seconds** with zero error, and the first word response time of 45.3K long context warm cache is as fast as **0.228 seconds**.

　　The second is the **Atomic Engine (AD-IQ2_M)**, which is dedicated to providing support for small-memory models. Previously, entry-level Macs with 16GB unified memory would frantically swap memory or even pop up errors whenever they touched models of this size. But Atomic Engine keeps the weight of niche experts on NVMe SSDs for on-demand stream read, locking the operating system's physical peak memory to **6.34 GiB**, yet still producing **41.67 tok/s** code output and **7.68 seconds** precise file modification calls; even branches with heavy memory usage are generally controlled at around **16 GiB**, and with 48GB or 64GB models, you can run them freely.

![Item-by-item comparison of time spent on file editing, troubleshooting, diagram analysis, and logical trap problems by each reasoning engine](https://hyphentech.top/obsidian-assets/inkling-2-mini-six-engines-qwen38-blindtest/image-probe-wallclock-m5pro-d928dd163b.png)

## 2. The Hidden Trick Behind Breaking 100 Words per Second: Multi-Agent Concurrency Acceleration and the "Barrel Effect"

　　Many friends wonder when testing: why do some rankings say Inkling can deliver an astonishing throughput of over 100 words per second in Locals or Strata, but only 40 to 50 when you open a single chat window?

　　The answer lies in the **Multi-Agent mechanism**. When you explicitly require "enable multi-agent mode to collaborate on task completion" in your prompt, the underlying engine simultaneously raises **4 concurrent streams** sharing weight prefixes, summing the number of words generated per second across the four streams, easily surpassing **100 tok/s** (on Windows, with Unbound v2.1 enabling **DSpark** draft speculative decoding, the draft acceptance rate also reaches an astonishing **95.4%**).

![Quadruple concurrent throughput stacking effect and the barrel effect triggered by a 278-second long test for monad agents](https://hyphentech.top/obsidian-assets/inkling-2-mini-six-engines-qwen38-blindtest/image-multi-agent-barrel-effect-4948765ee1.png)

　　But in practice, multiple agents are definitely not a cure-all; inside lies a very painful **"barrel effect"**:

- **Tailwinds are indeed fast**: When four sub-tasks are evenly distributed and independent of each other (for example, four concurrent Strata tasks), aggregate throughput is noticeably stronger than single-agent throughput;
- **Backward Backlash Gets Slowed by the Slowest Strike**: In Locals four-file code audit tests, the first three sub-agents completed their work and submitted their papers within **80 to 150 seconds**, except for the fourth sub-agent who got stuck and racked its brains for **278 seconds**—the main control summary had to wait for the last agent to finish before merging output, resulting in overall waiting times for long agents to be slower and more luck-dependent than single agents.

## 3. Efficacy, Not Benchmark Scores: Four sets of complex interactive HTML hands-on blind test showdown Qianqing 3.8-27B

　　If you can solve basic problems at lightning speed, what about writing hundreds of lines of single-file 3D games, audio synthesizers, and engineering calculators? I placed real HTML pages generated by **Inkling 2 Mini (Locals NVFP4 and oMLX dual engine)** and **Qianwen Qwen3.8-27B** side by side, tapping them one by one to try them out, and the difference was clear:

### 1. Blind Test 1: Minecraft 3D Voxel Sandbox — Inverted Rotating Bonsai vs. Silky First-Person Construction

　　The first question requires you to write an interactive "Minecraft"-style voxel world in a single file. Opening **Inkling Locals** (taking **204 seconds**) creates an isometric grassy island that looks quite refreshing, but before I even touch the keyboard, the little figure in the middle of the screen is wandering around the grass uncontrollably "grazing"; then clicking **Inkling oMLX** (taking **529 seconds**), it's even more laughable—the entire block island hangs upside down and leisurely spins in midair, essentially turning into an electronic rotating bonsai!

![Minecraft Hands-On Blind Test: Left Locals Random Walking, Middle oMLX Upside Down Rotating Bonsai, Right Qianwen 3.8 True 3D Playable Sandbox](https://hyphentech.top/obsidian-assets/inkling-2-mini-six-engines-qwen38-blindtest/image-blindtest-minecraft-3way-bc806a755e.jpg)

　　In contrast, **Qianwen Qwen3.8-27B** only took **271 seconds** (nearly half faster than oMLX), and upon entering the page, it was a pure first-person Three.js 3D perspective: moving forward, backward, left, right, and right, spacebar jumping, head-down digging blocks, switching inventory and building blocks all in one smooth flow—a truly playable classic sandbox.

### 2. Blind Test 2: Classic 3D Arcade Racing — "Unmanned" Mold Penetration vs. Full Cornering Overtaking Sound Effects

　　The second question is about classic pseudo-3D arcade racing. **Inkling Locals** delivered a lightning-fast pass in just **151 seconds**, but even after pressing the left and right arrow keys on the keyboard, the car didn't budge at all, only able to perform "fully autonomous autonomous driving" right in the middle of the track; **Inkling oMLX** (**231 seconds**) managed to change lanes left and right to overtake, but several rival cars got stuck with the Luohan piercing mold. **Qianwen Qwen3.8-27B** (**511 seconds**), although it spent a few extra minutes polishing, delivered `OUTRUSH` not only corner perspective, shoulder trees, and overtaking bonus points, but even the native WebAudio engine roar sound effect was included.

!["Classic 3D Racing" Blind Test: Inkling Steering Failure/Mold Penetration Comparison Qianwen 3.8 Complete Corner Overtaking and Sound Effects](https://hyphentech.top/obsidian-assets/inkling-2-mini-six-engines-qwen38-blindtest/image-blindtest-racer-3way-f0620a6625.jpg)

### 3. Blind Test 3 & 4: WebAudio Synthesizer and Unified Memory Planner—Tool Calculations to Pull Back the Deadlock

　　On the third question, looking at the design draft `NEBULA-8` desktop synthesizer mixer, both sides can finally click keys normally to produce sound, switch between sine waves and sawtooth waves, and jump 16 bands of the spectrum in real time. The difference is that **Inkling oMLX** took a full **over 600 seconds**, and the aperture of the four rounded knobs below showed visible misalignment; **Qianwen Qwen3.8-27B** completed faster, and the panel alignment was more neat (only the knob pointer and some black keys were slightly offset).

!["NEBULA-8 Synthesizer" Real-Game Comparison: Both Players Can Play and Sound, Qianwen Panel Reproduction and Longer Duration](https://hyphentech.top/obsidian-assets/inkling-2-mini-six-engines-qwen38-blindtest/image-blindtest-synth-2way-fbae37e065.jpg)

　　In the fourth question, which focuses on engineering calculations **"Apple Silicon On-Side Large Model Capacity and Throughput Planner"**, **Inkling Locals** finally had its highlight moment: **4 rounds** of tool calls with zero errors, **270 seconds**** cleanly and decisively taking first place. From M4 **16GB** to M4 Max **128GB**, weights, KV cache, Metal safety threads, and 8K–128K prefill time curves were all clearly calculated, resulting in a tie with Qianwen 3.8-27B.

![Inkling Locals Four Rounds of Zero Errors Generate Apple Silicon Unified Memory Capacity and Throughput Planner](https://hyphentech.top/obsidian-assets/inkling-2-mini-six-engines-qwen38-blindtest/image-memory-planner-locals-c11d35a878.jpg)

## 4. Assign according to your current hardware: Five-tier local deployment selection list

　　After running four sets of HTML blind tests, the conclusion is actually very clear: Inkling 2 Mini is definitely not designed to replace the dense all-around model of the 27B; it is clearly inferior to Qianwen in spatial geometry reasoning and complex single-page frontend state coordination, even raising suspicions that overseas teams are also targeting "ranking and testing"; but its extreme cost-performance in **ultra-low memory usage** and **short, fast code tool calls** is equally irreplaceable.

![LocalBrain v2.4.9 includes one-click mounting and testing links for all the above engines](https://hyphentech.top/obsidian-assets/inkling-2-mini-six-engines-qwen38-blindtest/image-localbrain-v249-workbench-422c9096af.jpg)

　　If you plan to install one on your device today, just match the memory and scenario to your device:

- **16GB / 18GB entry-level Mac users**: Directly choose **Inkling 2 Mini · Atomic Engine (AD-IQ2_M Streaming Edition)**. **6.34 GiB** Physical memory usage without crashing, **41.67 tok/s** Fast for daily code editing; When viewing images, switch to lightweight visual models separately for support.
- **24GB – 64GB main Mac users**: For those seeking both speed and multimodality, choose **Inkling 2 Mini · Strata Uncensored SQ-15**, **102.4 tok/s** peak decoding plus **6.82 seconds** zero-error image viewing is the most enjoyable experience in the entire Inkling family.
- **Mac / Windows / Linux cross-platform compatibility**: Choose **Unbound v2.1 GGUF**. Windows discrete graphics users must enable **DSpark** draft speculative decoding (acceptance rate **95.4%**) for immediate acceleration.
- **Existing users with oMLX installed / high concurrency of plain text**: oMLX must be upgraded to the latest **0.8.3** (enabling MTP + 4-bit KV saves nearly **7 GiB** memory); If you don't read images and run text concurrency, use **Locals NVFP4**, but be careful to avoid the barrel effect of long thinking tasks.
- **Pursuing a Reliable and Reliable Complex Front-End and All-in-One Main Processor (32GB+ Memory)**: No need to hesitate, the true all-around king in integrated on-device engineering capabilities is still our domestic pride. **Qianwen Qwen3.8-27B**.

> [!summary] Final thoughts
> The benchmark rankings only show you the model's upper limits; blind testing on real machines is the only way to gauge its temper and bottom line. Save the ultra-fast memory-saving Inkling 2 Mini for 16GB ultrabooks and daily lightweight tool calls, and entrust the complex projects of tackling tough problems to the steady, reliable Qianwen 3.8-27B—by following the dishes and leveraging each person's strengths, local computing power can truly become an on-demand productivity at your fingertips.

## Main sources of verification

- [Thinking Machines Official Model Card: thinkingmachines/Inkling-2-Mini (Hugging Face, Apache 2.0)](https://huggingface.co/thinkingmachines/Inkling-2-Mini)
- [HyphenTech official website extended real-world test: Inkling 2 Mini six engines with original answers and RSS full ledger](https://hyphentech.top/inkling-2-mini-versions-m5-pro-compare/)
- [LocalBrain (Pure offline local multimodal and multi-engine management desktop tool · Introduction page)](https://hyphentech.top/localbrain)
- [LocalBrain Releases (macOS / Windows Installation Package Download and Update)](https://github.com/HackerChi-Hub/localbrain-releases/releases)
- [HyphenBox Releases (Free Large Model API Radar · Download and Update)](https://github.com/HackerChi-Hub/hyphenbox-release/releases)


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
