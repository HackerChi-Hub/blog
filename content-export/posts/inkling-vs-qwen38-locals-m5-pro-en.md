---
title: "Inkling 2 Mini switches to the Locals engine: M5 Pro 10D tests outperform Qwen 3.8, but this one is the only one that hits the wall"
slug: inkling-vs-qwen38-locals-m5-pro-en
status: published
lang: en
translation_of: inkling-vs-qwen38-locals-m5-pro
article_type: "article"
translation_source: machine
source_sha256: 3160e980b4d814a1
date: 2026-11-23
updated: 2026-11-23
summary: "In the same M5 Pro 64GB showdown, the oMLX version of Inkling lost to Qwen 3.8 three times due to errors; after switching to the Locals engine, it overtook with zero error errors and a 30K cache for 0.92 seconds before leading, but the logic was overwhelmed by the limit. LocalBrain 2.4.4 is now dual-track integration."
categories:
  - Tech
tags:
  - AI
  - News
cover: "/obsidian-assets/inkling-vs-qwen38-locals-m5-pro/cover-62ec605813.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/inkling-vs-qwen38-locals-m5-pro/) is authoritative.

> [!abstract]
> From the 10-dimensional 1v1 failure of oMLX 0.8.2, to switching to Generated-Computers/Locals (NVFP4 + fusion Metal cores + GPU syntax constraints) to achieve zero errors in T8 and overtake Qwen3.8-27B: a clear explanation of the hardware mechanisms behind speed differences, prefix cache dividends, and the only limitation you must not step on
> HyphenTech · 2026-11-23

　　The same weighted base, Inkling-2-Mini, ran on the regular MLX backend oMLX 0.8.2. After ten problems, Qwen3.8-27B + DFlash2 left it behind for nearly fifteen minutes, and I even got errors three times in a row while writing the patch; But after I connected it into the GitHub open-source project [Generated-Computers/Locals](https://github.com/Generated-Computers/Locals), the same project's error troubleshooting problem became a **zero-error, one-time pass**, with total time cut from 123.7 seconds to 63.8 seconds, leaving Qwen3.8-27B (82.3 seconds) behind.

　　This seemingly contradictory set of results all comes from the same **Apple M5 Pro 64GB unified memory MacBook Pro** and the same "LocalBrain" native proxy test bench.

　　After testing, I casually added this Locals NVFP4 engine to the newly released [LocalBrain Mac 2.4.4 release page](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/v2.4.4), coexisting dual-track with the original oMLX 0.8.2 vision engine. Today, following these ten real-world test clips, I thoroughly explained the two popular underwear models for aligning local models, the six fusion operators behind engine swaps, and the only hard boundary in the Locals version that directly hit the wall.

## 1. Fight a fair 1v1 1v1 in the 10-dimensional game: Why is the oMLX version of Inkling lagging behind in every aspect?

　　In previous client versions, when testing long-range Agents, SSE streams occasionally had half-frame truncations that caused heavy task interruptions. So this round of comparison was first conducted on LocalBrain 2.4.3, which had fixed zero-buffer pass-through, lossless frame boundary keeping, budget clamping, and 32K output cap. We pulled both contestants back to the same starting line and ran them from the beginning: **20 full tests, 0 disconnections, all 23 test sessions left intact in the software's left sidebar**.

　　The two starters are: **Qwen3.8-27B Jailbreak Version** (orcarouter/Qwen3.8-27B-Uncensored-MLX, running on Splash 1.7.0 + DFlash2 speculative decoding, 256K context, native visuals) against **Inkling-2-Mini Jailbreak** (TokenAI-zer/Inkling-2-Mini-Uncensored-oQ4-mtp, running on standalone fixed oMLX 0.8.2, 96K context, native vision, MTP draft disabled). From T1 writing Three.js first-person voxel world, T2 pseudo-3D racing, T3 looking at images for actual calculations, T4 writing from design drafts with a voice-emitting Web Audio synthesizer, T5 triple logical probability traps, T6 writing on the same topic in the three-body body, T7 web emulator plus `docfactory` Word presentations, T8 source code error corrections, T9 finding the difference in two images, and searching T10 for a 30,000-word long article, the result was almost one-sided.

![Overview of 10-Dimensional 1v1 Decoding Rate and Total Time](https://hyphentech.top/obsidian-assets/inkling-vs-qwen38-locals-m5-pro/image-img01-80dc8ab814.png)

　　First, clarify the two most objective fairness assumptions. The first is **T1 directory perception difference**: when two models read and write the same default sandbox directory in sequence, Inkling first called `list_dir` and saw the earlier `voxel-minecraft-demo.html`. To avoid overwriting existing works, it actively rewrote it into a purely offline offline Canvas equidistant voxel version with zero external dependencies, which took longer and was not entirely due to slow code; The second was **T10 30,000 tokens prefilled with first characters**: For about 30,000 words of prefill time (TTFT), Inkling took 39.7 seconds (39,677 ms), Qwen 3.8 took 39.0 seconds (38,968 ms), nearly equalizing the prefill stage.

　　The real gap between the decoding speed and code fault tolerance and higher-order inference accuracy is what sets the gap between the two. In total, **Qwen3.8 + DFlash2 averaged 53.82 tok/s (maximum 76.32 tok/s), while oMLX's Inkling averaged only 35.76 tok/s**; The former, with +30.3% more tokens generated (114,441 vs. 87,857), took only 2,060.9 seconds (about 34.3 minutes), saving **887 seconds (nearly 15 minutes)** compared to the latter (2,947.9 seconds / 49.1 minutes).

![Playwright hands-on rendered HTML5 tool delivery cross-section](https://hyphentech.top/obsidian-assets/inkling-vs-qwen38-locals-m5-pro/image-img05-db7bdd7ba3.png)

　　More interesting than the total score are the three watershed questions that directly determine whether they can be included in the main workflow:

| Watershed exam questions | Inkling-2-Mini (oMLX 0.8.2) | Qwen3.8-27B (Splash + DFlash2) | Frontline impact on the project |
| --- | --- | --- | --- |
| T4 Write the synthesizer UI based on pictures | 676.2s / 32.62 tok/s (22,209 toks output to complete a 1:1 rerun) | 139.2s / 53.00 tok/s (equivalent playable 13-key UI, saving 4.86 times the time) | The expression efficiency difference for complex multimodal coding is nearly 5 times |
| T5 five-chip authenticity detection trap | 2/3: Six false positives (< = 1000 times) can guarantee finding good products (after thinking 12,024 toks, you get stuck in a dead end). | 3/3 Full mark: Directly construct the 5x5 symmetric deception matrix {A,B} and {C,D}, proving that infinite order cannot be guaranteed | Rare disease double positive Bayesian 71.04% and 22 self-reference are both correct, showing a competitive structure that sets the class apart |
| T8 edit_file Troubleshooting | 123.7s: Missed old_string parameter error for 3 consecutive attempts, self-corrected only on the 4th attempt to pass 3/3 single test | 82.3s: read -> 3 times edit_file -> review completed smoothly with zero errors, also reminding multiple nodes to issue concurrent locks | Using the autoregressive free JSON tool call can easily cause a drop after a long prompt |
| T9 dual console picking a fight | 53.0s: Found all 5 variations, but mistakenly mistook "offline priority mode" for "high line priority mode" and stuck the text in a serial manner | 29.8s: 100% accurate recognition of all characters, and inferred that the offline priority tool P95 flipped from 185 to 310 ms | Detailed small Chinese text screenshots: OCR and causal attribution are quite stable |

　　Judging by this step, anyone would come to a simple conclusion: on a 64GB Mac, Inkling is slightly lighter but falls short in speed, tool discipline, and heavy logic. Until a viewer dropped an open-source project in the comments specifically to rewrite the reasoning core for Apple Silicon — [Generated-Computers/Locals](https://github.com/Generated-Computers/Locals).

## 2. Swapping Inkling to Locals NVFP4 engine: Five reversals in the tiebreaker, also creating a pitfall at T5

　　Locals 0.2.2 (this time locked commits `40be2496`) is straightforward: since what most Agent tool tasks lack is high concurrency and small-batch stability and zero error in tool parameters, it simply cuts the visual module for Apple Silicon and performs **pure text extreme specialization**, while also reducing the original 18.18 GiB `thinkingmachines/Inkling-2-Mini` (overlaying `AtomicChat/Inkling-2-Mini-Uncensored-LoRA.gguf` dealignment plugin) to about **16.2 GB NVFP4 weight**, plugins a **0.64 GB draft model**, and enabling `--thinking --walk --typed-tools`.

　　Note, because Locals does not retain a visual encoder, it cannot be used for T3, T4, or T9 image viewing problems; So I only picked five pure text/tool battles with exactly the same topic and parameters—T2 3D racing, T5 logic traps, T6 three-body writing, T8 project error correction, T10 30K file search—doing a three-engine simultaneous overhaul, and the drama was maxed out.

![End-to-end total time comparison for five problems in MLX, Locals, and Qwen 3.8 + DFlash2](https://hyphentech.top/obsidian-assets/inkling-vs-qwen38-locals-m5-pro/image-img02-cc95aa4bad.png)

　　**The most explosive reversal was in T8 project troubleshooting and writing T2 and T6 code. ** Inkling, which previously passed on oMLX by autoregressively guessing JSON and misconnecting tool parameters three times, switched to Locals to enable `--walk --typed-tools`, and then three `mcp_system_edit_file` local patches **zero errors all hit once**. In single code tests, 3/3 passed, end-to-end time dropped sharply from 123.7 seconds to **63.8 seconds**—not only did it halve the old engine, but it also surpassed the previously reliable Qwen 3.8-27B (82.3 seconds) by nearly 20 seconds.

　　During the document writing round, after speculative prediction by the draft model, Locals' server speed in the T8 write round surged to 58 tok/s (draft hit rate 1129/1345 = 83.9%), and the T2 3D racing car write round soared to **60 tok/s** (draft hit rate 4694/6019 = 78%), shrinking the entire question from 231.3 seconds to **151.3 seconds**; In T6, the three-body same-topic writing time dropped from 100.6 seconds to **62.0 seconds** (41.31 tok/s), leaving Qwen 3.8's 106.2 seconds behind.

　　**But once you enter T5 re-logic and T10 cold start, the two costs of Locals immediately become apparent. ** Let's first look at T10 (input 32,563 tokens): after opening the 0.64 GB draft, Locals' long post decoding reaches **41.46 tok/s** (+27.8% faster than oMLX's 32.43 tok/s), allowing the first cold prefill to consume half a minute longer than oMLX. TTFT extends to **69.5 seconds** (69,483 ms), with a total end-to-end time of 104.4 seconds, which is less than Qwen3.8's 72.3 seconds (cold prefill 39.0 seconds + 76.32 tok/s).

　　What needs to be honestly explained is the **T5 logic trap failure**: the oMLX version miscalculated question 1 (took 2/3 points, took 419.5 seconds), but at least gave a clear answer; But the Locals version hit the single-step **28,672 token thinking limit** in two consecutive rounds on T5, with the server speating out a total of 57,344 tokens (all spent on endless self-validation and looping, `reasoningTokens` off the chart, `content` 0 characters in the main text), and finally triggered a timeout penalty at 1,500.1 seconds (25 minutes).

## 3. Disassembling the engine to understand the principle: Why does replacing the rear end look like a new model?

　　Many people test local models only by looking at parameter counts, quantization bits, and a total rate histogram. But this time, the same Inkling-2-Mini runs on oMLX and Locals with two completely different personalities, precisely proving that the kernel implementation, sampling constraints, and quantization alignment processes during end-side runtime are weighty enough to change whether the model can work.

![Comparison of Three Local Inference Architectures and Metal Kernel Mechanisms](https://hyphentech.top/obsidian-assets/inkling-vs-qwen38-locals-m5-pro/image-img03-777296431f.png)

　　**First Principle: Inkling's '48-layer cyclic bone phase' collides with 6 fusion Metal cores. ** According to Thinking Machines' official configuration, Inkling-2-Mini has a total parameter of 26.4B, but only 24 physical layers — it uses a sophisticated **loop inference architecture**, looping the 12 intermediate layers 6 to 17 three times in place, rolling out an equivalent 5.4B with a depth of 48 layers in a single 3.4B activation.

　　In a typical MLX/Python inference chain, each token forward propagation requires hundreds of fragmented operator schedulings, and with loops multiplied by 3, the entire step breaks into about **6,000 tiny Metal commands (with up to 125 small operations sandwiched between adjacent read/write operations)**. The GPU spends most of its time not calculating matrices but waiting for the CPU to dispatch instruction queues. Locals directly uses the custom **6 fusion Metal cores** (`mix`, `kv_prep`, `attend`, `route`, `act`, `combine`) to solder the entire channel into a pipeline, instantly eliminating a large chunk of scheduling delay.

　　** Second Principle: 0.64 GB MTP Draft + NVFP4 Memory Slimming vs. DFlash2 Speculation. ** Why can Locals server write files at 58–60 tok/s when modifying T2 or T8 code changes?

　　Because writing HTML/JS code syntax templates is highly predictable, the 0.64 GB draft model of Locals can be directly accepted by the main model for 78%–83.9% of draft tokens each time it passes at `--walk`; At the same time, **NVFP4 quantization reduces the main weight from nearly 19.5 GB in the original version to about 16.2 GB**, allowing even **24GB RAM Mac** to be easily loaded without system swapping.

　　In contrast, Qwen 3.8-27B, under Splash 1.7.0 + DFlash2 speculation, relies on large, dense blocks to push **30K long text decoding directly to 76.32 tok/s**, but at the cost of a larger weight+KV working set and the need for **32GB–48GB+ large memory and newer macOS Metal features**.

　　**Principle Third Knife: Why does the `llguidance` Typed-Tools syntax lock on GPU cure the "parameter leak problem"? ** Looking back at T8: Every time the oMLX runtime model calls `edit_file`, it relies on the list probability to solve it with closed eyes. `<tool_call>` JSON text, and once the system prompts include long path rules or the model's thinking gets a bit absent, it will give up `old_string` A wasted round trip of three rounds; But Locals directly pushes the `llguidance` finite state machine into the Metal logits mask, and at every decoding step, **forbids generating characters that do not conform to the function JSON schema** at the word level.

　　The `forced 173` you saw in the log above is the 173 structural tokens that the syntax engine casually locked for you at key parentheses, key, and quotation nodes. The tool's parameter accuracy was directly pushed to **100%, one-time pass**.

　　**Principle Fourth Cut: Why does the same T5 question, when Qwen 3.8 is falsified, does the NVFP4+LoRA version of Inkling fall into a 28,672 thinking loop? ** There are two layers of overlap: one is **structural differences**—Qwen3.8-27B is a dense non-loop architecture with abundant feature redundancy; The other layer is **quantization and adapter overlay noise**—on top of the cyclic MoE model (with a 3x error per loop), NVFP4 low-bit quantization is done first, then hot-mounted on the community's conversion from GGUF to dealign directional LoRA, causing subtle disturbances in the inference distribution.

　　Faced with the high-level logical paradox of "five chips 2 good 3 bad collusions," which requires rigorous proof and convergence, even a slight distribution shift can cause the model to repeatedly overturn itself in the `<think>` box, trapped in a self-check loop, until it breaks the 28,672 thought ceiling. That's why I didn't embellish the score card this time; I had to present this 1,500.1-second red bar.

![Comparison of fine text misreading in the original T9 image versus T10 30K cold start vs. warm prefix cache comparison](https://hyphentech.top/obsidian-assets/inkling-vs-qwen38-locals-m5-pro/image-img04-f58d80aee6.png)

　　**Principle Strike 5: Prefix Cache's Heaven and Hell. ** Look at the two sets of real latency data in the right image on 04 above: Facing a context of over 30,000 tokens, the first cold prefill of locals takes **69.5 seconds**, but once the second round of additional questions and the system prompt of 32,995 tokens perfectly aligns with the file body, the test instantly hits **32,893 / 32,995 (99.7%) pre-order KV cache**, with the first word TTFT dropping to **0.92 seconds (915.2 ms)**.

　　Conversely, I deliberately tested "only changing the timestamp at the 0th token position," and the entire 32K cache ** immediately became invalid (0 cached, took 73.25 seconds to reset)**. So when answering agents or multiple conversations, **always put the current timestamp or dynamic state at the end of the latest user message, and never insert it on the first line of the system prompt to destroy the entire KV prefix tree**.

## 4. All ten tested original questions, original images, standard answers, and real responses from the three models are compared

　　Below is a complete list of the real exam questions from T1–T10, original diagrams, source code, standard answers, and word-for-word/item-by-item differences among the three models all at once.

### T1 / T2 / T7: Differences between the original problems and products of the three-channel open coding and multi-tool dual delivery

- **T1 Original Question**: `创作一个类似 我的世界的 风格demo` (limit to 8 rounds, deliver interactive single file HTML).
- **T2 Original Question**: `写一个经典的 3d 赛车小游戏` (Limited to 8 rounds, delivers interoperable single file HTML).
- **T7 Original Question**: Collaborate with local file tools and `docfactory` document tools to achieve dual-form delivery—first write the Black-Gold Wind interactive HTML (`apple-silicon-llm-planner.html`, supports switching between `M4 16GB/120GB/s`, `M4 Pro 48GB/273GB/s`, `M5 Pro 64GB/307GB/s`, `M4 Max 128GB/546GB/s`, select `4B/9B/20B/27B/70B`, `Q4/Q8`, `8K–128K` context sliders and draw the stacked memory bar and `32K` prefill time curve in real time), then call `docfactory` to generate the Word presentation (`端侧大模型统一内存选型简报.docx`).

- **T1 Delivery Difference**: `Qwen3.8` Directly hand over `Three.js` First-person 3D voxel world (`16,844` bytes, `271.5s`); `Inkling oMLX` Inspection first found existing works in the same catalog, proactively rewrote it as a zero-dependency pure offline Canvas isometric voxel version (`15,072` bytes, `528.8s`); `Inkling Locals` Closed the `11,431` interactive version in round 2, but repeatedly used `edit_file` to fine-tune vegetation and rendering cycles. In round 8 (`204.5s`, decoding `61.11 tok/s`), it hit the round limit and was judged `failed`.
- **T2 Delivery Difference**: All three contestants handed over playable web pages—`Qwen3.8` completed `25` enemy cars plus curves and 8 self-healing rounds (`20,896` bytes, `511.3s`), `oMLX` made `10` enemy cars (`14,135` bytes, `231.3s`), `Locals` only spent `151.3s` to deliver the full version (`13,679` bytes, write rounds to `60 tok/s`, draft hit `78%`).
- **T7 Dual Delivery Difference**: All three are delivered in HTML + Word dual forms. `Qwen3.8` used 10 rounds `496.5s` (`15,395 B` HTML + `41,297 B` Word), `oMLX` used 10 rounds `626.9s` (`13,820 B` HTML + `40,574 B` Word), while `Locals` only used **4 rounds `270.7s`** to write HTML (`16,060 B`) and call `docfactory` to generate `40,537 B` presentations and complete preview verification, improving efficiency by nearly half.

### T3: Full volume readings from the chart, price change calculation, and attribution of Metal slowdown (with original test chart)

> Original question: Please carefully read all specific values in this on-device model test chart and accomplish three tasks: 1) Use a Markdown table to fully restore all 30 values for the "initial latency (s), decode speed (tok/s), and peak memory (GB)" across the 32GB and 64GB ranges, without missing or rounding alterations; 2) Calculate the decoding rate percentage change for each model from 32GB to 64GB (keep two decimal places, marked with positive and negative signs); 3) Identify which model has experienced severe abnormal slowdowns, and explain the reasons and solutions behind the macOS Metal unified memory workset mechanism combined with the red box and small text at the bottom in the figure.

![T3 Original test input image: Apple Silicon 32GB vs 64GB model performance and peak memory comparison chart](https://hyphentech.top/obsidian-assets/inkling-vs-qwen38-locals-m5-pro/image-img06-5a3b061fd8.png)

| Model code | 32GB (initial / decoding / memory) | 64GB (initial / decoding / memory) | Decoding the standard answer for change |
| --- | --- | --- | --- |
| Alpha-9B-Q4 | 1.8s / 52.0 tok/s / 11.4 GB | 1.7s / 54.6 tok/s / 14.2 GB | +5.00% |
| Beta-14B-Q4 | 2.9s / 40.0 tok/s / 15.8 GB | 2.7s / 43.2 tok/s / 20.6 GB | +8.00% |
| Inkling-20B-oQ4 | 4.6s / 31.5 tok/s / 21.6 GB | 4.4s / 33.7 tok/s / 29.4 GB | +6.98% |
| **Delta-32B-Q6*** | 8.5s / 34.0 tok/s / 29.8 GB | 19.2s / **9.5 tok/s** / **54.6 GB** | **-72.06%** (red box abnormal) |
| Omega-27B-Q4 | 6.2s / 26.0 tok/s / 23.5 GB | 5.9s / 28.6 tok/s / 33.8 GB | +10.00% |

> Standard mechanism attribution and countermeasures: After the 64GB file was extended to 128K windows, the peak memory of Delta-32B-Q6* exceeded macOS's default Metal max_recommended_working_set_size (51.8 GB) by 54.6 GB without iogpu.wired_limit_mb, triggering frequent GPU wired page table recovery oscillations; The corresponding solution was to increase the iogpu.wired_limit_mb or compress the KV window and precision to bring the working set back to within 51.8 GB.

　　**Response differences**: `Qwen3.8`(`38.9s`, `66.65 tok/s`, `2,348` tok) and `oMLX`(`90.1s`, `38.99 tok/s`, `3,338` tok) all correctly calculate all 30 numbers, 5 sets of price fluctuations, and `54.6 > 51.8 GB` mechanism; `Qwen3.8` More compact and provides `launchctl` adjustment suggestions, `Locals` No visual involvement.

### T4: Reconstruct the NEBULA-8 synthesizer design draft and recreate the voice-emitting interactive webpage (with original test images)

> Original question: Please carefully observe this "HYPHENTECH · NEBULA-8 Desktop Synthesizer and Spectrum Table" UI design diagram: 1) At the beginning of your reply, accurately list the top bar 4 status badge parameters you recognized from the image, the currently selected waveform mode, the names and exact readings of the 4 knobs, as well as the bottom 13 key names and corresponding keyboard keys; 2) Then, use the file tool to create a single-file interactive webpage nebula8-synth-demo.html, 1:1 recreating this black gold tech-style layout (waveform switching, 4 draggable or adjustable knobs, real-time 16-band spectrum column + green serrate/waveform oscilloscope, bottom C4–C5 black-and-white piano keys), and integrate the native Web Audio API, allowing mouse clicks on keys or keyboard A W S E D F T G Y H U J K to accurately produce sound based on the current waveform, cutoff frequency, resonance, initiation, and interpretation.

![T4 Original Input Image: HYPHENTECH · NEBULA-8 Desktop Synthesizer and Spectrum Stage High-Density UI Design Draft](https://hyphentech.top/obsidian-assets/inkling-vs-qwen38-locals-m5-pro/image-img07-2378a35e36.png)

　　**Standard Answers vs. Measured Comparison**: All parameters on the design draft include top bar 4 badges (`BPM: 128`, `MASTER: -3.2 dB`, `VOICES: 8 POLY`, `ENGINE: WEB-AUDIO`), selected waveform **`SAW`**, 4 knob readings (`CUTOFF 2,480 Hz`, `RESONANCE 68 %`, `ATTACK 14 ms`, `RELEASE 420 ms`), 16-band spectrum with green sawtooth oscilloscope, and 13-key note name `C4–C5` mapping `A W S E D F T G Y H U J K`. Both visual models matched the parameters and delivered `nebula8-synth-demo.html` that could actually be played with mouse and keyboard, but the cost difference was **4.86 times**: `Qwen3.8` only output `8,402` tok, and finished writing cleanly (`16,854` bytes) with **`139.2 秒`**; `Inkling oMLX` spat out `22,209` tok (`23,305` bytes) during repeated detail refinement, and ran out of **`676.2 秒` (over 11 minutes)**.

### T5: Three highly error-prone logic and probability traps (five-chip proof + double yang Bayes + 22-character self-reference)

> Original question:
> 1) [Extreme Proof of True and Fake Chips] Five identical chips A/B/C/D/E containing 2 good (always genuine) and 3 bad (can be considered genuine or fake and arbitrarily disguised). Each time, X is used to test Y and ask "Is Y good?" At worst, how many tests must be done to find at least one good chip with 100% accuracy? Can testing 1000 times guarantee this? Please verify strictly.
> 2) [Double positive Bayes] Rare disease prevalence 0.1%, sensitivity 99%, false positive rate in healthy individuals 2%. Both independent cases were positive; find the posterior probability of the disease (rounded to two decimal places).
> 3) (Chinese Self-Reference Sentences) Construct natural Chinese sentences without Arabic numerals, accurately report the number of "一" characters, "字" (characters), and the total number of Chinese characters without punctuation, and verify each character.

- **Standard answer to Question 1: There is no finite number of attempts (even if tested 1000 times, it is impossible to lock on 100% of the good product)**. If defective product (3) exceeds good product (2), it is only necessary to construct a fixed 5×5 symmetric response table: A/B mutually call good product, C/D mutually call good product, E means all others are faulty. Then the true good product is `{A,B}` and `{C,D}` (intersection is empty). The two worlds produce 100% identical test results, and no limited number of queries can distinguish them.
- **Standard answer for question 2: `71.04%`**. Under conditional independence, the two positive probabilities are for a real patient `P(++|H) = 0.99² = 0.9801` and a healthy person `P(++|Hᶜ) = 0.02² = 0.0004`; Substitute into the total probability formula `0.9801 × 0.001 / (0.9801 × 0.001 + 0.0004 × 0.999) = 0.0009801 / 0.0013797 = 9801 / 13797 = 363 / 511 ≈ 71.0372%`, rounding to get **`71.04%`**.
- **Standard answer for Question 3: No Arabic numerals, and just verify every word exactly (multiple answers)**.

- **Qwen3.8-27B (`313.0s` , 3/3 full mark)**: Question 1 directly draws the complete 5×5 symmetric response matrix to falsify "World 1 `{A,B}` vs World 2 `{C,D}` 」; Question 2: Precise derivation `9801/13797 ≈ 71.04%` ; Question 3 writes: "In this sentence, the character '一' appears twice, and the character '字' appears four times, totaling twenty-two Chinese characters. **" (Verified kernel: "一" = 2, "字" = 4, punctuation removed = 22, zero error).
- **Inkling oMLX (`419.5s` , 2/3 points)**: Question 2 ( `71.04%` ) and question 3 ("**This sentence contains twenty-two Chinese characters, each character appears three times, each character appears four, all correct." "**", real kernel: "一" = 3, "字" = 4, total = 22) all correct; However, question 1 miscalculated the core lower bound, giving the incorrect conclusion "** allows 1000 attempts to guarantee discovery, worst precise upper bound 6 times (A→B/C/D/E plus B→C, C→D)**", failing to detect the three faulty chips can all conspire to disguise them `{A,B}` and `{C,D}` Symmetry Board.
- **Inkling Locals(`1,500.1s` Timeout, 0/3)**: Hit the single step `28,672` token thinking ceiling for two consecutive rounds (accumulated `57,344` tokens spent in cyclical self-doubt), output `0` words in the user-facing body, timeout failure triggered at 25 minutes.

### T6: Comparison of Three-Body Writing on the Same Topic (Sharp Commentary Oral Presentation + Records of the Grand Historian Biographies + Four-Tier Selection Table)

```prompt
围绕议题「花两万块买 64GB 统一内存电脑跑本地大模型，到底是不是伪需求？」，请一次性完成三种截然不同文体的同题创作：
1）【硬核老玩家犀利口播稿（约 400 字）】：接地气、有锋芒，把机器折旧、云端 API 账单、长上下文预填等待、数据不出本机的刚需边界与断网可用性算成明白账，必须包含正反两方视角，严禁出现“总而言之、赋能、生态闭环、抓手、未来可期”等公关套话；
2）【《史记》列传文言体（约 180 字）】：作《端侧算力客列传》，摹写其夜半调四比特量化、抠 KV 缓存、守内存护栏之神态，要求文言纯正不夹杂现代白话口水词，篇末附一段“太史公曰”；
3）【硬件选型速查 Markdown 表】：按 16GB / 32GB / 64GB / 128GB 四档，列出“甜点模型规格、真实可用场景、最大短板、明确劝退人群”。
```

- **Qwen3.8-27B(`106.2s`,`5,587` tok)**: The tension between the three bodies is strongest. The oral broadcast starts by calculating 20,000 yuan per month with a three-year straight-line depreciation as `555` yuan per month against the API, using lawyers' sensitive files and the Northwest mining area network disconnection `408 timeout` to deliver the golden quote: "**Twenty thousand people, two half." Don't use half the account to ruin the other's life**; "Biography of the Terminal Computing Power Guest" is pure and ancient ("Eyes fixed on the screen as if guarding a lonely city, fingers tapping keys like striking a building...... If it overflows by one trillion, it collapses.").
- **Inkling oMLX(`100.6s`,`3,739` tok)**: Clear but somewhat flat, with a clear summary at the end of the selection chart ("16GB is the ticket, 32GB is daily tools, 64GB is privacy + long context + high-frequency desserts, 128GB is high-end but not essential"). The classical Chinese book "Biographies of Terminal Computing Power Customers" writes, "A guest in a poor house listens to loud sounds, not as good as a wealthy family listening to small talk."
- **Inkling Locals(`62.0s`,`2,505` tok, fastest)**: The pacing is nearly 40 seconds faster than the other two. The live commentary compares the local 64GB to "buying a generator," joking that the idle buyer is putting it into a "high-end storage box." The classical Chinese passage says, "Place the model inside the body, without relying on the atmosphere of the outer mountain; Sound like the bell is near, neither rushed nor late," with the overall message condensed and leaning toward a quick review style.

### T8: Source code debugging and edit_file minimal patch (with original Buggy source code)

> Original question stem (key constraints excerpted): Please first use read_file to read ledger.mjs in full, accurately locate and list the root causes of all 3 bugs; Strictly forbidden to overwrite entire write_file files; only edit_file must be used for minimal precise local patch fixes: (1) Ensure calculateInvoice([{unitPrice:0.1,qty:1},{unitPrice:0.2,qty:1}],0) returns 0.3,[{unitPrice:19.99,qty:3}] rounded to the tax rate of 0.08 integers {subtotal:59.97, tax:4.8, total:64.77}; (2) Ensure createCouponRedeemService succeeds only once when concurrently sending Promise.all to grab a limited coupon of 1 coupon, and getUsedCount is 1; (3) Ensure movingAverage([10,20,30,40], 2) returns [15,25,35], windowSize > values.length returns [], windowSize <= 0, or throws a non-integer RangeError; After modification, you must read_file read back to check.

```javascript
export function calculateInvoice(items, taxRate = 0.08) {
  let subtotal = 0;
  for (const item of items) {
    subtotal += item.unitPrice * item.qty;
  }
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

export function createCouponRedeemService(initialLimits, asyncVerifyDelayMs = 15) {
  const used = new Map();
  return {
    async redeem(code) {
      const limit = initialLimits[code] ?? 0;
      const count = used.get(code) ?? 0;
      if (count >= limit) {
        return { ok: false, reason: 'limit_reached' };
      }
      await new Promise((resolve) => setTimeout(resolve, asyncVerifyDelayMs));
      used.set(code, count + 1);
      return { ok: true, remaining: limit - (count + 1) };
    },
    getUsedCount(code) {
      return used.get(code) ?? 0;
    },
  };
}

export function movingAverage(values, windowSize) {
  const result = [];
  for (let i = 0; i <= values.length - windowSize; i++) {
    let sum = 0;
    for (let j = i; j <= i + windowSize; j++) {
      sum += values[j];
    }
    result.push(sum / windowSize);
  }
  return result;
}
```

T8 Test source code: ledger.mjs (45 lines, 1,295 bytes) with 3 typical engineering bugs

- **Bug 1 (`calculateInvoice` floating-point error)**: The original code directly adds floating-point points `item.unitPrice * item.qty`, `0.1 + 0.2` yields `0.30000000000000004`, and the tax amount is not rounded to whole points. **Standard Amendment**: Internally, all are converted to integer points `Math.round(item.unitPrice * 100) * item.qty`, tax amount is set to `taxCents = Math.round(subtotalCents * taxRate)`, and finally unified to `/ 100` and returned.
- **Bug 2 (`createCouponRedeemService` Asynchronous race mode TOCTOU)**: source code inspection `count >= limit` Come first `await setTimeout(...)` , wait until the delay ends before executing `used.set(code, count + 1)` . Issued simultaneously `Promise.all` When multiple coroutines are present `await` Read it at the same time `count === 0` , resulting in all limited coupons being oversold and approved. **Standard Amendment**: Yes `await` **Previously** Simultaneously occupied the slot `used.set(code, count + 1)`.
- **Bug 3 (`movingAverage` Sliding window boundary exceeding boundary + parameter not verified)**: Inner loop `j <= i + windowSize` adds one more item, causing a miscalculated sum and then adding `NaN` beyond boundary in the last window; Also lacking boundary protection. **Standard amendment**: First check `if (!Number.isInteger(windowSize) || windowSize <= 0) throw new RangeError(...)`, handle `windowSize > values.length` return `[]`, then change the inner layer to `j < i + windowSize`.

- **Inkling Locals(`63.8s`, 4 rounds, 0 errors fastest)**: Dependency `llguidance` Typed-Tools syntax lock (`forced 173`) and 83.9% draft hit (disk `58 tok/s`), three `edit_file` **one-shot all hits**; The patch switched to `reduce` integer division and added `if (windowSize > values.length) return []`, 3/3 single test passed directly.
- **Qwen3.8-27B(`82.3s`, 4 rounds, 0 errors)**:`read_file -> 3 次 edit_file -> read_file` Completed in one go (file expanded from `1,295` to `1,663` bytes), also split the whole whole with clear comments, and proactively reminded in the summary **This memory slot only prevents single process concurrency; multi-node/multi-process operations still rely on Redis `INCR` and other external atomic operations**.
- **Inkling oMLX(`123.7s`, 5 rounds, 3 errors self-corrected)**: Without GPU syntax lock protection, during the second round of handwriting JSON, the system missed `old_string` three times in a row, and only after rewriting in the third round did it pass the 3/3 single test; Also, `calculateInvoice` only converted `subtotal` to components, then `tax` and `total` were used floating point again for `Math.round(... * 100) / 100`, which is less clean than the first two.

### T9: Dual console screenshots on the same screen with 5 spot-point errors (includes two complete original images A and B)

> Original question: Two screenshots of the "LocalBrain · Endpoint Inference Node Monitoring Console" (version A and version B) are highly similar, with 5 subtle differences deliberately changed (including indicator values, switch states, bar charts, status badges, and bottom version numbers). Please identify all 5 differences one by one, do not overlook fields that have not been modified, and diagnose how these changes affect system stability and tool execution delay.

![T9 Test Input Original Image 1 (Version A): Monitoring Console Build 2026.11.23-RC1 (65 W / 185 ms / Offline Priority enabled / Q8_0 Health)](https://hyphentech.top/obsidian-assets/inkling-vs-qwen38-locals-m5-pro/image-img08-e9527e5e0c.png)

![T9 Test input original image 2 (version B): Monitoring console Build 2026.11.23-RC4 (deliberately embedded 5 changes for comparison between two images)](https://hyphentech.top/obsidian-assets/inkling-vs-qwen38-locals-m5-pro/image-img09-1c9137a772.png)

| # | Console position | Version A original image original value | Version B original image new value |
| --- | --- | --- | --- |
| 1 | Top indicator card · TDP power consumption limit | `65 W` | `78 W` |
| 2 | Bar chart · Tool back and forth on P95 | `185 ms` | `310 ms` (+125 ms / +67.6%) |
| 3 | Safety Guardrails · `离线优先模式` | `已开启` (Green switch) | `已关闭` (gray switch) |
| 4 | Runtime Health · KV cache quantization | `Q8_0 · 健康` (green box) | `FP16 · 警告` (orange-yellow frame) |
| 5 | Runtime Health · Console release version | `Build 2026.11.23-RC1` | `Build 2026.11.23-RC4` |

　　**Response difference**: Both found all 5 changes and did not misreport the remaining stable items; However, `Qwen3.8`(`29.8s`) OCR had zero errors and reasonably attributed turning off "offline priority mode" to tool P95 flipping; `oMLX`(`53.0s`) misread "offline priority mode" as "**high line priority mode**" and pasted it into small text `(max-tokens 自动分段)`.

### T10: 30K long text spanning 18 chapters, searching for needles in a haystack and calculating formulas

> Original question: Please carefully read the accompanying full, lengthy operation and maintenance and accident review files, and combine the latest effective clauses in the beginning, middle, and end chapters (distinguishing historical obsolete values and interference nodes), and answer three questions about "Node-07 (Tianshu-S7)": 1) List all retrieved calculation input parameters and their source chapters; 2) Strictly calculate the usable net KV cache budget and the maximum allowable context window (K) after rounding down according to the final mandatory formula approved in the latter half; 3) <节点代号><密钥后缀> Output the unique compliance approval work order code according to the maximum window -<K>K-.

```text
1) 第 01 章有效线索（头）：节点-07（天枢-S7）因 11-14 故障返修、11-16 重上架后实际统一内存 total_ram = 48 GB（原 64 GB 已废止）；唯一有效密钥后缀 K94-ALPHA（旧 K94-OLD 已吊销）。
2) 第 09 章有效线索（中）：生效变更工单 #CHG-20261119-09 强制将 new_safety_ratio 由历史 0.70 下调至 0.55（#CHG-20261119-04/07/12 属他节点干扰工单）；model_weight = 22.0 GB，os_reserve = 6.0 GB，kv_per_1k = 0.25 GB。
3) 第 17 章最终公式（尾，含常驻视觉编码器永久扣减 1.0 GB）：
   net_kv_gb = (48 - 22.0 - 6.0) * 0.55 - 1.0 = 20.0 * 0.55 - 1.0 = 10.0 GB
   max_ctx_k = floor(10.0 / 0.25) = 40 K
4) 唯一合规核准工单代码：天枢-S7-40K-K94-ALPHA
```

30K Archive Chapters Head, Middle, and Tail Effective Clues, Interference Traps, and Standard Accounting Derivation

　　**Response difference**: All three avoid `64 GB` / `K94-OLD` / `0.70` interference, accurately calculating `10.0 GB`, `40K`, and `天枢-S7-40K-K94-ALPHA`; The time difference comes from engine scheduling — `Qwen3.8` Total `72.3s` (prefilled `39.0s`, decoded `76.32 tok/s`), `oMLX` `98.0s` (prefilled `39.7s`, `32.43 tok/s`), `Locals` `104.4s` (cold prefilled `69.5s`, but the two-wheel warm cache TTFT with the same prefix only `0.92s`).

## 5. How to choose without pitfalls? One-page guide for selecting models and LocalBrain 2.4.4 implementation

　　With all three sets of data set in place, no single solution can blindly cover all scenarios. The real trick is to split data directly based on the machine's memory and task nature:

| Target model + backend | Memory threshold | Visual image reading | Strong Scenarios | Measured to clarify boundaries |
| --- | --- | --- | --- | --- |
| Qwen 3.8-27B Jailbreak Version (Splash + DFlash2) | Recommended 32GB–64GB+ (new macOS system) | Supports native HD visuals | Main All-round King: Complex Adversarial Logic (T5 full score), fine OCR attribution (T9 29.8s), 30K high-speed output (76.32 tok/s) | Lengthening weights and context are costly; a 24GB machine running long distances with multiple tools can be tight |
| Inkling 2 Mini (Locals NVFP4 + Draft) | 24GB Mac runs smoothly (~16.2GB) | Not supported (plain text + tools) | Lightweight agent encoding speed bits: T8 error detection 63.8s with zero errors fastest, T2 game writing 60 tok/s, and second round of interrogation with the same prefix 0.92s | Stripped visual ability; 30K cold start prefill in 69.5 seconds is slow; High-pressure multi-step logic risks getting stuck in long exam timeouts |
| Inkling 2 Mini (oMLX 0.8.2 oQ4-mtp) | Stable performance on Macs above 32GB (~16.5 GiB) | Supports inkling2_vision vision | Lightweight and screen-reading patch slots: can view design drafts/charts and edit local files; after 2.4.3 repair, the entire process was uninterrupted | No drafts or GPU syntax locks, average speed 35.76 tok/s, and a high retry rate for complex tools due to first errors |

　　Because I realized that **Locals (ultra-fast plain text/tool) and oMLX (fully preserving native vision) are a complementary pair**, in the recently released **LocalBrain Mac 2.4.4**, I didn't use Locals to replace the original oMLX channel, but instead created **independent dual-engine coexistence**.

　　When you search and download the original `thinkingmachines/Inkling-2-Mini` on the "Discover" page, the software automatically pulls the upstream 18.18 GiB main weight, 0.59 GiB MTP draft, and the dealign adapter `AtomicChat/Inkling-2-Mini-Uncensored-LoRA.gguf` (41.8 MiB) together. When you first click to start, `inkling-locals-env` takes about **half a minute (30.2 seconds tested on the machine)** offline to automatically merge the original copyright weight and unalign direction vector into the NVFP4 + draft directory and write the `.ready` stamp. After that, each reboot takes **3 seconds** and is ready immediately—without tampering with your original weight directory or interfering with the oMLX 0.8.2 environment dedicated to image viewing. The `Locals · NVFP4` badge will also clearly display on the homepage card face.

　　The entire 2.4.4 new installation package has been pushed to the release page. You can directly download and upgrade by clicking the comparison data below, then run it yourself using the ready-made test samples in the left sidebar to get a feel for it.

> [!quote] My judgment
> Once the on-device model enters the engine power stage, switching to a runtime like **Locals**—which fuses metal cores, speculative drafts, and GPU syntax locks—allows a lightweight 24GB runable small model to outperform a 27B dense large model in code and tool tasks; But when it comes to complex logical steady-state and fine visual screen reading, **`Qwen3.8-27B + DFlash2` remains the most worry-free all-round mainstay on large-memory workstations, and the dual-track division of labor of "pure text running locals + image viewing and oMLX" is the most practical and optimal solution for small and medium-memory Macs today. **

## Main sources of verification

- [LocalBrain Mac 2.4.4 Installation Package (SHA-256 Verification and Release Page)](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.4.4/LocalBrain_2.4.4_aarch64.dmg)
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
