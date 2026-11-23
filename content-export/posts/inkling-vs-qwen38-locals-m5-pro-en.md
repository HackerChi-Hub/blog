---
title: "Inkling 2 Mini switches to the Locals engine: M5 Pro 10D tests outperform Qwen 3.8, but this one is the only one that hits the wall"
slug: inkling-vs-qwen38-locals-m5-pro-en
status: published
lang: en
translation_of: inkling-vs-qwen38-locals-m5-pro
translation_source: machine
source_sha256: 8f5a3639d5c3a6f8
date: 2026-11-23
updated: 2026-11-23
summary: "Comparing the M5 Pro 64GB on the same platform with Qwen 3.8-27B native version, Inkling original oMLX, and Inkling Locals NVFP4 solutions: seven non-visual tests of Locals routine projects were nearly half completed (T7 dual delivery rounds took 270.7 seconds), but the heavy logic T5 hit the upper limit of thinking. LocalBrain 2.4.5 has simultaneously completed the large toolset adaptation and deduplication."
categories:
  - Tech
tags:
  - AI
  - News
cover: "/obsidian-assets/inkling-vs-qwen38-locals-m5-pro/cover-62ec605813.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
article_type: "article"
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/inkling-vs-qwen38-locals-m5-pro/) is authoritative.

> [!abstract]
> Qwen3.8-27B original version (Splash + DFlash2), Inkling-2-Mini original (oMLX 0.8.2 visual full version), and Inkling-2-Mini-Locals (Locals NVFP4 + 0.64 GB draft speed version) three-way comprehensive comparison: Complete all 7 non-visual identical questions for bonus tests and 5 text answer quality verifications, clearly explaining speed reversals, big tool set pitfalls avoidance, and the true boundaries of each in one place
> HyphenTech · 2026-11-23

　　On the same **Apple M5 Pro 64GB unified memory MacBook Pro** and the same "LocalBrain" native proxy testbench, I put the three most talked-about jailbreak solutions on the device side and ran the full test on the same starting line: **Qwen3.8-27B jailbreak version** (`orcarouter/Qwen3.8-27B-Uncensored-MLX`, running on Splash 1.7.0 + DFlash2 speculative decoding), **Inkling-2-Mini original** (`TokenAI-zer/Inkling-2-Mini-Uncensored-oQ4-mtp`, running on standalone fixed oMLX 0.8.2), and **Inkling-2-Mini-Locals** (NVFP4 + 0.64 GB draft model + GPU syntax lock) with the open-source high-speed engine [Generated-Computers/Locals](https://github.com/Generated-Computers/Locals).

　　The result is quite interesting: **No one can dominate the entire table with one table; instead, the same Inkling-2-Mini showed two completely different faces after switching to the Locals engine**—originally, running T7 dual delivery on oMLX took 10 rounds of 626.9 seconds, modifying T8 code three times with errors, switching to Locals to overtake Qwen3.8 in 4 rounds in 270.7 seconds, nearly doubling the pace; But on the same model base, it encountered a heavily adversarial logic T5, but it ended up suffering two rounds of 28,672 thinking limits, resulting in a 25-minute timeout and a crash.

　　After this test, I also conveniently fixed the issue where the Locals engine encountered the DeepSeek Harness toolkit `DFA exceeds 400000 states`, as well as minor issues with mixing external model scans into transition/base directories, and released the latest [LocalBrain Mac 2.4.5 release page](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/v2.4.5). Today, I'll lay out all the full data from these three versions, the true value of text-based answers, core principles, and clear selection boundaries** all at once.

## 1. Set the tone first: compare the three versions together, with all core 7+3 question scores fully revealed

　　First, align the underlying identities of the three test versions with the test scope. Previously, when the client conducted long-range Agent evaluations, SSE streams occasionally had half-frame truncations causing heavy task interruptions, so the entire comparison was based on fixing zero-buffer pass-through, lossless frame boundary keeping, budget clamping, and the 32K output cap. After completing LocalBrain 2.4.3–2.4.5, 27 test sessions **0 disconnections**:

| Reference version | Model identification and engine | Context / output | Native vision | Memory positioning and features |
| --- | --- | --- | --- | --- |
| **Qwen 3.8-27B Jailbreak Version (Original Language Version)** | `orcarouter/Qwen3.8-27B-Uncensored-MLX` (Splash 1.7.0 + DFlash2) | `256K` / `32K` | ✅ High-definition visuals | Recommended 32GB–64GB+, the all-around mainstay for large memory workstations |
| **Inkling-2-Mini Original (oMLX Visual Edition)** | `TokenAI-zer/Inkling-2-Mini-Uncensored-oQ4-mtp` (oMLX 0.8.2) | `96K` / `32K` | ✅ `inkling2_vision` | 32GB+ runs steadily, retains image viewing and long thinking as a backup, no drafts or grammar locks |
| **Inkling-2-Mini-Locals (NVFP4 Lite Edition)** | `Locals/Inkling-2-Mini-Uncensored-MLX-nvfp4` (Locals 0.2.2) | `96K` / `28K` | ❌ Plain text | 24GB for Mac, 6 fusion Metal cores + 0.64GB draft + GPU syntax lock |

![Overview of 10-Dimensional 1v1 Decoding Rate and Total Time](https://hyphentech.top/obsidian-assets/inkling-vs-qwen38-locals-m5-pro/image-img01-80dc8ab814.png)

　　First, let's look at the three versions of **7 non-visual identical items** (`T1 / T2 / T5 / T6 / T7 / T8 / T10`). This chart has already supplemented the first version test with two missing items `T1 我的世界` and `T7 网页模拟器 + Word 简报`:

![Comparison of three versions of seven non-visual topics: Locals code tools fully overtake vs. emphasize logical boundaries](https://hyphentech.top/obsidian-assets/inkling-vs-qwen38-locals-m5-pro/image-img02-cc95aa4bad.png)

| Title and task | Qwen 3.8-27B (original Splash) | Original Inkling-2-Mini (oMLX) | Inkling-2-Mini-Locals (NVFP4) |
| --- | --- | --- | --- |
| **T1 My World Voxels** | `completed` · 2 Wheels · **271.5s** · Three.js First-Person 3D (16.8 KB) | `completed` · 5 wheels · **528.8s** · Canvas Isometric Voxel (15.1 KB) | `failed (maxRounds=8)` · 8 wheels · **204.5s** · Write a usable Canvas voxel webpage (11.4 KB, JS/DOM correct, write/revise 57–61 tok/s), just finished revision in round 8, and reached the round limit |
| **T2 Classic 3D Racing** | `completed` · 8 wheels · **511.3s** · Repackage (20.9 KB) | `completed` · 2 Wheels · **231.3s** · OutRun Racing (14.1 KB) | `completed` · 3 rounds · **151.3s**(**Writing documents 60 tok/s, draft hit 78%** · 13.7 KB) |
| **T5 Triple Logic Trap** | `completed` · Round 1 · **313.0s** · **3/3 Full Mark** | `completed` · Round 1 · **419.5s** · **2/3** (Question 1 can be solved 6 times with misjudgments) | `failed (timeout)` · 3 Wheels · **1,500.1s** · **0/3** (Thought exhausted: 57,344 tok, 0 words in the main text) |
| **T6 Three-Body Same-Topic Writing** | `completed` · Round 1 · **106.2s** · 53.24 tok/s · 2,020 words, full of literary talent | `completed` · Round 1 · **100.6s** · 37.65 tok/s · 1,353 words: restraint and steadiness | `completed` · Round 1 · **62.0s** · 41.31 tok/s · 1,704 words are fully structured |
| **T7 Web Emulator + Word Presentation** | `completed` · 10 rounds · **496.5s** · 15.4 KB HTML + 41.3 KB DOCX | `completed` · 10 rounds · **626.9s** · 13.8 KB HTML + 40.6 KB DOCX | `completed` · **4 Rounds** · **270.7s** · 16.1 KB HTML + 40.5 KB DOCX (5-page PDF for one-time review) |
| **T8 `edit_file` Error Troubleshooting and Minor Corrections** | `completed` · 4 wheels · **82.3s** · **0 errors**, `3/3` Single test passed | `completed` · 5 Wheels · **123.7s** · Error in parameter leakage 3 times, then switch to `3/3` | `completed` · 4 rounds · **63.8s**(**Code modified 58 tok/s, draft hit 83.9%**)· **0 errors**, `3/3` Tested alone |
| **T10 30K Cross-Chapter Search Accounting** | `completed` · 1 round · **72.3s** (Cold TTFT 39.0s / 76.32 tok/s) | `completed` · 1 round · **98.0s** (Cold TTFT 39.7s / 32.43 tok/s) | `completed` · 1 wheel · **104.4s** (**Cold TTFT 69.5s / Warm prefix 0.92s** / 41.46 tok/s) |

　　Here's a very inspiring comparison chart: ** excluded `T5` After the timeout extreme logic challenge, the remaining 6 routine tasks, writing, and retrieval ( `T1, T2, T6, T7, T8, T10`) , `Inkling-2-Mini-Locals` The cumulative time consumed was only `856.7s` (14.3 minutes), compared to `Qwen3.8-27B` (`1,540.1s` ) a full 44.4% faster, compared to `Inkling-2-Mini 原版` (`1,709.3s` ) saves nearly half the time (49.9%)**. Especially when coordinated scheduling tools are needed with `DocFactory` Document tools with dual deliverables **T7**, locals rely on **4 rounds of zero nonsense** `270.7s` and cleaned it up; However, **T1 Minecraft** also revealed that the small-parameter version likes to tweak several rounds over trivial details—although the second round already wrote a runnable 11.4 KB voxel HTML, then repeatedly read and revised three rounds, just hitting the limit of round 8 to finish.

![Playwright hands-on rendered HTML5 tool delivery cross-section](https://hyphentech.top/obsidian-assets/inkling-vs-qwen38-locals-m5-pro/image-img05-db7bdd7ba3.png)

　　As for the remaining **3 visual specialized items (T3 for visual-based calculation, T4 for writing NEBULA-8 synthesizer UI based on design drafts, T9 for pointing out the difference with dual-console screenshots)**,`Locals` Due to the pure text architecture not being tested, the two contestants who retained visual skills accepted them:**`Qwen3.8-27B` Led all three questions **——`T4` Also completed the 1:1 13-key UI with only `139.2s` (4.86 times faster than `oMLX`'s `676.2s`**); `T3` 38.9 seconds to correctly match all 30 numbers and 5 sets of price fluctuations, and precisely recommended raising `iogpu.wired_limit_mb` to above `60000` (although `oMLX` calculated the numbers correctly, it took 90.1 seconds without specifying the adjustment threshold); `T9` In 29.8 seconds, zero typos were identified, identifying all 5 changes and reasoning that "disabling offline priority caused tool P95 to double from 185 to 310 ms".

## 2. How good are the answers to written questions? Question 5: Peel and verify each item one by one

　　Many people are easily intimidated by thousands of words of replies when archiving long-text reviews, suspecting "the model is just making up word counts." I directly extracted all the main texts from the pure text and analysis questions (`T3 / T5 / T6 / T9 / T10`) word by word to check the conclusions, formulas, and point deductions. To be honest: **The only cases where valid information is inaccurate are concentrated in high-level adversarial proofs `T5` and fine-print OCR `T9`; For other writing and long text searches, all three versions of the core conclusions are solid. **

| Verification questions | Qwen 3.8-27B (original Splash) | Original Inkling-2-Mini (oMLX) | Inkling-2-Mini-Locals (NVFP4) |
| --- | --- | --- | --- |
| **T3 Calculate Accounts by Picture** | **Full Score**: 30 boxes and 5 sets of price fluctuations (including `-72.06%`) 100% accurate, clearly providing `iogpu.wired_limit_mb >= 60000` | **Excellent**: Both the values and attribution are fully correct, but conservatively without specific settings, resulting in 2.3 times more time | — (Plain text backend not referenced) |
| **T5 Triple Logic Trap** | **3/3 Perfect Mark**: Unique construction `{A,B}` vs `{C,D}` 5×5 Symmetric deception matrix proves infinite and unsolvable; Bayesian `71.04%` Correct; 22 characters Chinese self-reference is not missing a single word | **2/3**: Bayesian `71.04%` and 22 characters are both correct; Question 1 falls into a mental trap and misjudges "6 times (≤ 1000 times) guaranteed to find good products" | **0/3 Failure**: Both rounds hit `<think>` and hit `28,672` token thinking ceiling, main text **0 character output**, 1,500.1s timeout |
| **T6 Three-Body Same-Topic Writing** | **First**: Voice broadcasts feature strong visuals like lawyer files and mining area network disconnections. The ancient charm of "Terminal Computing Power Guest Legends" is the most concise, with tables containing specific withdrawal lines and zero banned words | **Second**: Neat structure, honestly state "4-bit estimate not actual measurement," classical Chinese is relatively short and cautious, slightly less sharp than Qwen3.8, zero banned words | **Efficient Passing**:**62.0s** Fastest submission, complete structure, pragmatic tone, and strict adherence to prohibited words, suitable for efficient drafting |
| **T9 Spot the Difference with Dual Maps** | **5/5 Full Mark**: 5 changes with 0 false positives and all characters accurate, causal chain complete | **4.5/5**: Find all 5 positions, but mistakenly misread **"Offline priority mode" as "High line priority mode"** and blend in adjacent small text `(max-tokens 自动分段)` | — (Plain text backend not referenced) |
| **T10 30K Retrieval Accounting** | **100% Accurate**: Accurately removes interference from old values to calculate `10.0 GB / 40K / 天枢-S7-40K-K94-ALPHA` | **100% Accurate**: All 3 isolated clues across 18 chapters have been recalled, and the formula has been verified for accuracy | **100% Accurate**: Although the cold prefill is slow at 69.5s, the three clues and final code **`天枢-S7-40K-K94-ALPHA` are not missing a single word** |

　　In one sentence, I would evaluate the results of this set of texts: **Except for Locals, which exploded directly at `T5`, and oMLX lost points on one word, `T5` 1 and `T9`, the rest of the questions were not empty words or water words**—especially `T10`, which was flawlessly calculated in all three versions of the 30,000-word cross-chapter 'finding a needle in a haystack.' In daily short texts and code explanations, the speed of `Locals` was precisely based on not losing the accuracy of the main text.

## 3. Disassemble and look at the mechanism: Why is there such a big performance difference when replacing the engine on the same base?

　　The same Inkling-2-Mini weight, replaced with `Locals`, later changed from "slow and missing parameters" to "fast, accurate, and ruthless" while losing the stability of `T5`. The reasons lie in the following underlying mechanisms:

![Comparison of Three Local Inference Architectures and Metal Kernel Mechanisms](https://hyphentech.top/obsidian-assets/inkling-vs-qwen38-locals-m5-pro/image-img03-777296431f.png)

　　**First cut: 48 layers of looping bones collide with 6 fusion metal cores. ** Thinking Machines' Inkling-2-Mini has a total parameter of 26.4B, but only 24 layers are placed physically. Layers 6 to 17 loop in place three times, each token equivalent to 48 layers of logic depth. Ordinary Python/MLX runs about 6,000 fragmented scheduling operations per step (with hundreds of small operators sandwiched between adjacent read/write operations), and the GPU lights wait for the CPU to trigger the trigger; And `Locals` `mix / kv_prep / attend / route / act / combine` **6 fusion Metal cores** solder the entire link into a single block, greatly eliminating scheduling gaps.

　　**Second cut: 0.64 GB draft cheat while coding, but returns to baseline during a pure Chinese long test. ** I personally connected to the external DeepSeek Harness and tested it directly: daily ordinary Chinese Q&A only has `38–42 tok/s`, which isn't as impressive as the `85 tok/s` snipping of online posts (that number is actually 8 channels of 8 sub-agents running simultaneously for total throughput); **The real one-way rampage happens when writing HTML or partial code changes** — code syntax is easy to guess, and Locals' 0.64 GB draft hit rate jumps to `76%–94%` (`T2` `3,832/5,043` hitting 60 tok/s, `T8` file modifications `83.9%` hit, `T1` `792/843`), and efficiency jumps dramatically.

　　**Third Cut: `llguidance` GPU syntax lock fixes parameter leaks, but when encountering 40+ tools, large toolsets need to degrade automatically. ** Opening `--walk --typed-tools` on `Locals` will convert the tool JSON Schema into byte automaton and push it into the Metal mask (`T8` and `T7` rely on it to get zero errors and pass instantly). However, when we tested a host with built-in 40+ tools like DeepSeek Harness and a huge number of optional parameters, the strong syntax originally enumerated for each field instantly bursts `40 万` DFA status error `400 DFA exceeds 400000 states`. The newly released [LocalBrain Mac 2.4.5](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/v2.4.5) has added an intelligent downgrade guard: the compact toolset continues to lock parameter types for acceleration. If the toollist becomes too large, it automatically smoothly cuts back to non-strong tool syntax (DFA status instantly pushes back to ~950 tools). In 45 tools, it runs smoothly directly.

　　** Fourth cut: NVFP4 + directional LoRA loop amplification perturbation costs, plus the prefix cache bonus. ** On the sparse architecture that loops three times per step, first pressing NVFP4, then stacking alignment with directional LoRA, encounters `T5` This difficult combination of proof problems where the whole collapse of the `T5` wrong step is amplified, causing the model to repeatedly overturn itself in the `<think>` box until timeout. On the other hand, the power of prefix caching is immense: look at the set on the right below—same 30,000 tokens, `Locals` cold prefill takes 69.5 seconds, the second round of additional questions with the same prefix instantly hit `32,893 / 32,995`(`99.7%`), **initial TTFT directly drops to `0.92 秒`**; But as soon as the 0th token (for example, the system prompts a timestamp at the beginning) changes by one character, the entire cache tree is immediately voided and reverts to `73.25 秒`.

![Comparison of fine text misreading in the original T9 image versus T10 30K cold start vs. warm prefix cache comparison](https://hyphentech.top/obsidian-assets/inkling-vs-qwen38-locals-m5-pro/image-img04-f58d80aee6.png)

## 4. Strengths and objective evaluations of the three versions: Which one should be retained?

　　Counting the test accounts to the end, the three solutions each have their own place in the local workflow, so no one needs to rush to "delete them all":

1. **Qwen 3.8-27B Jailbreak Version (Splash + DFlash2)—The all-around mainstay for large memory workstations (most stable)**: Strongest logic (`T5` unique perfect score `3/3`), most accurate visual OCR (`T9` zero typos, `T4` 4.86x faster), `256K` fastest for decoding long texts (`76.32 tok/s`). Only one drawback: **Memory-intensive, high entry barrier (32GB–64GB+, and relies on the new macOS Metal)**. As long as your machine has enough memory and you want a mainstay capable of writing + image reading + heavy reasoning + complex projects, this is still the top choice.
2. **Inkling-2-Mini-Locals (Locals NVFP4 + Draft)—24GB machine and concurrent tool flow, the fastest (most cost-effective)**: Total time for 6 daily projects/writing/retrieval **`856.7s`** fastest (`T7` 4 rounds `270.7s`, `T8` error-free `63.8s`, `T6` `62.0s`), about `16.2 GB` size enough to fit a **24GB Mac**, natively supports 16-slot continuous batch processing adaptation for external DeepSeek Harness / OpenCode multi-sub-agent concurrency. Identify weaknesses: **can't look at diagrams**, 30K cold prefill is slow (`69.5s`), **can't be used for extremely difficult pure math/logic proofs**.
3. **Inkling-2-Mini original (oMLX 0.8.2)—a lightweight dedicated alternative for "image retention + stable resolution": In the plain text track, it has been fully replaced by its peer `Locals`, but it is the only version in this `16 GB` weight set that fully retains the `inkling2_vision` visual encoder**, and does not have a timeout deadloop like Locals does. In **LocalBrain 2.4.5**, "Locals runs pure text/multi-tool concurrency + oMLX reserved for image viewing and screen reading" perfectly complement and coexist (the new external model scanning also automatically hides `_src-*` transition directories, fragmented components, and soft link bases; the homepage retains only a single clean entry).

> [!quote] Actual measurements have hit rock bottom
> **Locals**, which fuses Metal cores, speculative drafts, and GPU syntax locks, indeed allows a 24GB Mac runnable small model to outperform a 27B dense large model in coding tools and daily writing time by nearly half; But when you need steady, long-logical closure and high-definition detailed screen reading, **`Qwen3.8-27B + DFlash2` remains the anchor on a large-memory host, and "daily coding with Locals, image mapping to oMLX, and large memory with Qwen 3.8" is the most worry-free combination right now. **

## Main sources of verification

- [LocalBrain Mac 2.4.5 Installation Package (SHA-256 Checksum and Release Page)](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.4.5/LocalBrain_2.4.5_aarch64.dmg)
- [GitHub: LocalBrain Mac v2.4.5 Release Notes](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/v2.4.5)
- [GitHub:Generated-Computers/Locals (lock 40be2496 this time)](https://github.com/Generated-Computers/Locals)
- [Hugging Face: thinkingmachines/Inkling-2-Mini Official Original](https://huggingface.co/thinkingmachines/Inkling-2-Mini)
- [Hugging Face: AtomicChat/Inkling-2-Mini-Uncensored-GGUF (including unaligned LoRA.gguf)](https://huggingface.co/AtomicChat/Inkling-2-Mini-Uncensored-GGUF)
- [Hugging Face: TokenAI-zer/Inkling-2-Mini-Uncensored-oQ4-mtp (oMLX Visual Edition)](https://huggingface.co/TokenAI-zer/Inkling-2-Mini-Uncensored-oQ4-mtp)
- [Hugging Face: orcarouter/Qwen3.8-27B-Uncensored-MLX (Comparison with main general)](https://huggingface.co/orcarouter/Qwen3.8-27B-Uncensored-MLX)


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
