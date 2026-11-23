---
title: "Inkling 2 Mini switches to the Locals engine: M5 Pro 10D tests outperform Qwen 3.8, but this one is the only one that hits the wall"
slug: inkling-vs-qwen38-locals-m5-pro-en
status: published
lang: en
translation_of: inkling-vs-qwen38-locals-m5-pro
article_type: "article"
translation_source: machine
source_sha256: 3dce425e8e3ce30c
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

　　The two starters are: **Qwen3.8-27B Jailbreak Version** (orcarouter/Qwen3.8-27B-Uncensored-MLX, running on Splash 1.7.0 + DFlash2 speculative decoding, 256K context, native visuals) against **Inkling-2-Mini Jailbreak** (TokenAI-zer/Inkling-2-Mini-Uncensored-oQ4-mtp, running on standalone fixed oMLX 0.8.2, 96K context, native vision, MTP draft disabled). From T1 writing Three.js first-person voxel world, T2 pseudo-3D racing, T3 looking at images and calculating test ledgers, T4 reading design drafts and writing voice-emitting Web Audio synthesizers, T5 triple logical probability traps, T6 three-body same-topic writing, T7 web emulator plus `docfactory` Word presentations, T8 source code error corrections, T9 finding faults with dual images, and searching T10 for a 30,000-word long article, the results were almost one-sided.

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

![End-to-end total time comparison for five problems in MLX, Locals, and Qwen 3.8 + DFlash2](https://hyphentech.top/obsidian-assets/inkling-vs-qwen38-locals-m5-pro/image-img02-9bda8029fe.png)

　　**The most explosive reversal was in T8 project troubleshooting and writing T2 and T6 code. ** Inkling, which previously passed on oMLX by autoregressively guessing JSON and misconnecting tool parameters three times, switched to Locals to enable `--walk --typed-tools`, and then three `mcp_system_edit_file` local patches **zero errors all hit once**. In single code tests, 3/3 passed, end-to-end time dropped sharply from 123.7 seconds to **63.8 seconds**—not only did it halve the old engine, but it also surpassed the previously reliable Qwen 3.8-27B (82.3 seconds) by nearly 20 seconds.

　　During the document writing round, after speculative prediction by the draft model, Locals' server speed in the T8 write round surged to 58 tok/s (draft hit rate 1129/1345 = 83.9%), and the T2 3D racing car write round soared to **60 tok/s** (draft hit rate 4694/6019 = 78%), shrinking the entire question from 231.3 seconds to **151.3 seconds**; In T6, the three-body same-topic writing time dropped from 100.6 seconds to **62.0 seconds** (41.31 tok/s), leaving Qwen 3.8's 106.2 seconds behind.

　　**But once you enter T5 re-logic and T10 cold start, the two costs of Locals immediately become apparent. ** Let's first look at T10 (input 32,563 tokens): after opening the 0.64 GB draft, Locals' long post decoding reaches **41.46 tok/s** (+27.8% faster than oMLX's 32.43 tok/s), allowing the first cold prefill to consume half a minute longer than oMLX. TTFT extends to **69.5 seconds** (69,483 ms), with a total end-to-end time of 104.4 seconds, which is less than Qwen3.8's 72.3 seconds (cold prefill 39.0 seconds + 76.32 tok/s).

　　What needs to be honestly explained is the **T5 logic trap failure**: the oMLX version miscalculated question 1 (took 2/3 points, took 419.5 seconds), but at least gave a clear answer; But the Locals version hit the single-step **28,672 token thinking limit** in two consecutive rounds on T5, with the server speating out a total of 57,344 tokens (all spent on endless self-validation and looping, `reasoningTokens` off the chart, `content` 0 characters in the main text), and finally triggered a timeout penalty at 1,500.1 seconds (25 minutes).

## 3. Disassembling the engine to understand the principle: Why does replacing the rear end look like a new model?

　　Many people test local models only by looking at parameter counts, quantization bits, and a total rate histogram. But this time, the same Inkling-2-Mini runs on oMLX and Locals with two completely different personalities, precisely proving that the kernel implementation, sampling constraints, and quantization alignment processes during end-side runtime are weighty enough to change whether the model can work.

![Comparison of Three Local Inference Architectures and Metal Kernel Mechanisms](https://hyphentech.top/obsidian-assets/inkling-vs-qwen38-locals-m5-pro/image-img03-777296431f.png)

　　**First Principle: Inkling's '48-layer cyclic bone phase' collides with 6 fusion Metal cores. ** According to Thinking Machines' official configuration, Inkling-2-Mini has a total parameter of 26.4B, but only 24 physical layers — it uses a sophisticated **loop inference architecture**, looping the 12 intermediate layers 6 to 17 three times in place, rolling out an equivalent 5.4B with a depth of 48 layers in a single 3.4B activation.

　　In a typical MLX/Python inference chain, each token forward propagation requires hundreds of fragmented operator schedulings, and with loops multiplied by 3, the entire step breaks into about **6,000 tiny Metal commands (with up to 125 small operations sandwiched between adjacent read/write operations)**. The GPU spends most of its time not calculating matrices but waiting for the CPU to dispatch instruction queues. Locals directly uses the custom **6 fusion Metal cores** (`mix`, `kv_prep`, `attend`, `route`, `act`, `combine`) to solder the entire channel into a pipeline, instantly eliminating a large chunk of scheduling delay.

　　**Second Principle: 0.64 GB MTP draft + NVFP4 memory slimming vs. DFlash2 speculation. ** Why can the Locals server write files at 58–60 tok/s when T2 racing or T8 code changes? Because writing HTML/JS code syntax templates is highly predictable, the 0.64 GB draft model in Locals can be directly accepted by the main model every time it passes at `--walk`, passing 78%–83.9% of draft tokens; At the same time, **NVFP4 quantization reduces the main weight from nearly 19.5 GB in the original version to about 16.2 GB**, allowing even **24GB memory Mac** to be easily loaded without system swaps.

　　In contrast, Qwen 3.8-27B, under Splash 1.7.0 + DFlash2 speculation, relies on large, dense blocks to push **30K long text decoding directly to 76.32 tok/s**, but at the cost of a larger weight+KV working set and the need for **32GB–48GB+ large memory and newer macOS Metal features**.

　　**Principle Third Knife: Why does the `llguidance` Typed-Tools syntax lock on GPU cure the "parameter leak problem"? ** Looking back at T8: Every time the oMLX runtime model calls `edit_file`, it relies on the list probability to solve it with closed eyes. `<tool_call>` JSON text, and once the system prompts include long path rules or the model's thinking gets a bit absent, it will give up `old_string` A wasted round trip of three rounds; But Locals directly pushes the `llguidance` finite state machine into the Metal logits mask, and at every decoding step, **forbids generating characters that do not conform to the function JSON schema** at the word level.

　　The `forced 173` you saw in the log above is the 173 structural tokens that the syntax engine casually locked for you at key parentheses, key, and quotation nodes. The tool's parameter accuracy was directly pushed to **100%, one-time pass**.

　　**Principle Fourth Cut: Why does the same T5 question, when Qwen 3.8 is falsified, does the NVFP4+LoRA version of Inkling fall into a 28,672 thinking loop? ** There are two layers of overlap: one is **structural differences**—Qwen3.8-27B is a dense non-loop architecture with abundant feature redundancy; The other layer is **quantization and adapter overlay noise**—on top of the cyclic MoE model (with a 3x error per loop), NVFP4 low-bit quantization is done first, then hot-mounted on the community's conversion from GGUF to dealign directional LoRA, causing subtle disturbances in the inference distribution.

　　Faced with the high-level logical paradox of "five chips 2 good 3 bad collusions," which requires rigorous proof and convergence, even a slight distribution shift can cause the model to repeatedly overturn itself in the `<think>` box, trapped in a self-check loop, until it breaks the 28,672 thought ceiling. That's why I didn't embellish the score card this time; I had to present this 1,500.1-second red bar.

![Comparison of fine text misreading in the original T9 image versus T10 30K cold start vs. warm prefix cache comparison](https://hyphentech.top/obsidian-assets/inkling-vs-qwen38-locals-m5-pro/image-img04-f58d80aee6.png)

　　**Principle Strike 5: Prefix Cache's Heaven and Hell. ** Look at the two sets of real latency data in the right image on 04 above: Facing a context of over 30,000 tokens, the first cold prefill of locals takes **69.5 seconds**, but once the second round of additional questions and the system prompt of 32,995 tokens perfectly aligns with the file body, the test instantly hits **32,893 / 32,995 (99.7%) pre-order KV cache**, with the first word TTFT dropping to **0.92 seconds (915.2 ms)**.

　　Conversely, I deliberately tested "only changing the timestamp at the 0th token position," and the entire 32K cache ** immediately became invalid (0 cached, took 73.25 seconds to reset)**. So when answering agents or multiple conversations, **always put the current timestamp or dynamic state at the end of the latest user message, and never insert it on the first line of the system prompt to destroy the entire KV prefix tree**.

## 4. How to choose without pitfalls? A one-page guide for selecting models and the implementation of LocalBrain 2.4.4

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
