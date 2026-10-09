---
title: "People say it's faster than Ollama, but no one has actually competed with her"
slug: mac-local-inference-engines-en
status: published
lang: en
translation_of: mac-local-inference-engines
translation_source: machine
source_sha256: 0616e339c8c98c9e
date: 2026-09-05
updated: 2026-10-03
summary: "Ollama switched Mac inference to MLX kernel half a year ago, and now a bunch of challengers claiming to be faster have emerged. I didn't run the tests, just put the scores published by the four companies on one table—the result was: none of them were running the same set of problems."
categories:
  - Tech
tags:
  - AI
  - Local deployment
cover: https://hyphentech.top/obsidian-assets/mac-local-inference-engines/cover-ca31df9eff.png
brand_slogan: 
legacy_paths: []

---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/mac-local-inference-engines/) is authoritative.

> [!abstract]
> Four native Mac inference engines, four sets of self-created questions
> Hardware, model, quantization format, competitors—none of these match
> HyphenTech · Public Information Verification · 2026-09-05

First, let me clarify how this article is done: **I didn't run the test on my own machine; this is a document verification. **What I did was simple—I took the scores published by Ollama, Rapid-MLX, and vMLX, along with their respective test conditions, and laid them out on the same table to see if they could actually be compared.

It all started because I've been seeing the claim that 'this engine is N times faster than Ollama.' Ollama itself had a heart swap six months ago: **On March 30, 2026, it officially announced that inference on Mac would be powered by Apple's MLX framework. **So now the situation is a frontrunner who just got an engine replacement, and a group of challengers holding stopwatches claiming they're faster.

![Ollama official announcement, March 30, 2026: Inference on Apple Silicon switched to MLX-driven (preview)](https://hyphentech.top/obsidian-assets/mac-local-inference-engines/image-ollama-blog-813ec837d8.png)

> [!tip]
> First, the conclusion: **Each of these numbers holds up on their own, but when put together, none can compare. **Different hardware, different models, different quantization formats, even the competitors are not the same—these results are not achieved in the same race.

## 🧩 First, clarify: which layer the inference engine is

Running large models locally can be broken down into three layers. At the bottom is **model weights**, which are the tens of GB files you downloaded; At the top is **the client you use**, chat windows or programming assistants; The middle layer is called the **inference engine**, which loads weights into memory, schedules graphics cards, and outputs tokens one by one. The same model can be slower by several times in a different engine — that's the value of this setup.

**MLX** is Apple's own machine learning framework for Apple Silicon, and its biggest feature is its deep understanding of the "unified memory" architecture—the CPU and GPU on Macs share the same memory, so there's no need to transfer data back and forth. Before that, the mainstream solution on Macs was llama.cpp's Metal backend. Ollama is making a new move, shifting from the llama.cpp path to MLX.

It's worth mentioning that Ollama specifically thanked llama.cpp and the GGML team at the end of the announcement. **This 'change engine but remember to thank the previous one' approach is rare in the open-source world and worth noting. **Changing the heart doesn't mean denying the predecessor; it's just that the hardware changes and the optimal solution changes accordingly.

## ⚡ Ollama: The official numbers are beautiful, but they're comparing themselves

The improvements announced by Ollama are indeed impressive. According to its official chart, on the same machine: ** prefill jumps from 1154 tokens/second to 1810, and decode increases from 58 tokens/second to 112. **It also adds that 0.19 for int4 quantization energy reaches 1851 and 134. On the M5, M5 Pro, and M5 Max, it also calls the new GPU neural accelerator.

![Ollama official performance chart: prefill 1810 vs 1154, decoding 112 vs 58—note the small print below, which clearly states that the quantization formats used on both sides are different.](https://hyphentech.top/obsidian-assets/mac-local-inference-engines/image-ollama-chart-6f9fa85145.png)

> [!warning]
> But the small print at the bottom of the chart is the key. The official note states: the test uses Alibaba Qwen3.5-35B-A3B, **0.19 quantized to NVFP4, 0.18 quantized to Q4_K_M. Both sides changed not only the inference engine, but also the quantization format. **So this "57% and 93% faster" is the combined result of "changing the MLX kernel" and "changing the quantization format," not purely engine revenue. The official didn't hide this information, but it was placed below the chart, and the numbers were placed above the chart.

By the way, let's explain what NVFP4 is: it's a 4-bit floating-point format promoted by NVIDIA, and Ollama uses its reason in the announcement—**using the same format as local production environments, reducing the bias of 'local testing is better, but online is different.' This reason itself holds up, but it also makes the comparison between old and new versions less pure.

There's another easily skipped threshold: this preview requires your Mac **to have at least 32GB of unified memory**. In other words, the world described in that beautiful chart is temporarily out of reach for 8GB and 16GB MacBook Air users. Caching is a real improvement—cross-session reuse, storing snapshots at appropriate prompt locations, and smarter elimination strategies. These three sounds abstract, but when applied to a programming agent, it means: **When the same system prompt is repeatedly sent over, you don't have to recalculate it from the beginning** every time. This is the most painful overhead in long tasks.

## 🏷️ Rapid-MLX: The title is listed at 4.2x, the body text at 3x, and the benchmark table does not include Ollama

Among challengers, the most talked-about is Rapid-MLX. Its GitHub profile opens with the phrase: "The fastest native AI engine on Apple Silicon, **4.2 times faster than Ollama**." The project itself is not just for fun—3.7k stars, 413 forks, 2,280 commits. The last commit I took was 4 hours ago, and it was an active project.

![Rapid-MLX repository introduction: It says "4.2 times faster than Ollama," and also says "Works with Claude Code, Cursor, Aider"](https://hyphentech.top/obsidian-assets/mac-local-inference-engines/image-rapid-repo-8b91cd713d.png)

But looking into the README text, the same project's speed statement turns into another sentence: ** "Up to 3 times Ollama Throughput (real-world test)." **Title 4.2 times, body text 3 times. More importantly—** The few published benchmark tables don't include Ollama at all. ** The tables measure its own performance under different models and context lengths, with the control group being its previous version.

| Rapid-MLX released a real-world test | Test conditions | The result |
| --- | --- | --- |
| qwen3.8-27b-4bit | 256GB M3 Ultra, about 8K prompts, single request | Initial text time 24.66 seconds, prefill 330.8 t/s, decoding 43.4 t/s |
| qwen3.8-flash-next-4bit | Similarly, 180B total parameter / 6B activation | Initial text time is 9.40 seconds, prefill is 867.9 t/s, decoding is 23.0 t/s |
| Version self-comparison: 0.13.3 → 0.13.4 | Same model, same machine, 8K prompt | Decoding 24.58 → 43.38 t/s (1.77 times) |

> The data comes from the benchmark table published by the Rapid-MLX repository, with three requests taking the median and each prefix cache cleared. The control group is its own older version, not Ollama.

By the way, there's the same flaw: the repository description says "Works with Claude Code, Cursor, Aider," but the README itself makes it very clear—**Cursor's built-in key requests must go through the official Cursor server, which can't touch your local host, so it won't generate local configuration for Cursor. **The "Works with Cursor" in the title says "can't be used" in the main text.

## 📊 vMLX: The stats are impressive, but the opponent switched to LM Studio

The third company, vMLX, is a free and open-source Mac app focused on prefix caching, paginated KV caching, continuous batch processing, and MCP tools. The official website claims it can handle up to 256 concurrent requests and allows 23 inference parameters for you to tweak. The numbers it released are even more impressive: with an ultra-long context of about 100,000 tokens, ** cold start initial time of 0.65 seconds versus 131.06 seconds, cold start prompt processing speed of 154,121 tokens/second versus 686. **The difference between the two numbers is two orders of magnitude, looking like a crush.

![vMLX official website comparison table: The competitor is LM Studio, not Ollama; On the left, vMLX has three optimization switches enabled; on the right, LM Studio has 'Default settings'](https://hyphentech.top/obsidian-assets/mac-local-inference-engines/image-vmlx-table-6be6a087d4.png)

But just look at the header and you'll know how to read this number. **It's comparing to LM Studio, not Ollama. **The test device is a 256GB M3 Ultra, modeled on Llama 3.2 3B—a small model with 3 billion parameters, totally different from the previous two companies' 27 and 180 billion pixels. The date is February 2026.

> [!warning]
> More importantly, those two configuration cards. The vMLX section on the left clearly lists three switches: continuous batch processing, enabling prefix caching, and using paginated cache; the right LM Studio section says **Default settings**. **One side is fine-tuned parameters, the other is the unboxed default—these are not the same starting line. **There is even a line in the table that is reversed: at about 10K context, LM Studio's cache acceleration ratio is 21x, while vMLX's is only 1.6x.

## 🔍 Put together: No two schools are running the same set of problems

If you list the test conditions of all three companies side by side, the questions become clear at a glance. This isn't about who is lying—the numbers each company publishes are most likely true. The problem is that each company has its own set of questions they're good at, and each got a perfect score. **

|  | Ollama | Rapid-MLX | vMLX |
| --- | --- | --- | --- |
| Testing machines | Specific model numbers not announced (mentioning the M5 series) | 256GB M3 Ultra | 256GB M3 Ultra |
| Test the model | Qwen3.5-35B-A3B | Qwen 3.8-27B / Flash-Next, etc | Llama 3.2 3B |
| Quantization format | NVFP4 to Q4_K_M (different on both sides) | 4-bit | 4-bit |
| Control group | My previous version was 0.18 | My previous version was 0.13.3 | LM Studio |
| Parameter settings | Not specified | Single request, clear cache, and take the median | Turn on the tuning switch yourself, and the opponent will use the default |

> All of the above are test conditions published by each project themselves, summarized and summarized from official announcements, warehouse READMEs, and the official website in this article.

So the phrase "4.2 times faster than Ollama" currently **has no public table supporting it**—because no table has put both in the same test. This isn't falsification, but it's a slogan you can't verify**.

These tricks are nothing new. **Back then**, when graphics card manufacturers released new cards, the benchmark was always their new card versus their own old card, with different driver versions; At phone manufacturers' launch events, there was always a line of small text showing test conditions for 'X times faster.' **Back in the era of browser wars, companies would attack each other with their own JavaScript benchmarks, and who set the test would win. **The tech world has changed its main players several times, but the right to set the question is always the winner. **

## 🧬 A digressive discovery: the two challengers share the same ancestor

While verifying the data, I came across something interesting. At the end of the repository, Rapid-MLX explained: **Its predecessor was vLLM-MLX, written by Wayner Barrios, and it was only renamed to its current name in March 2026.** The engine's paged KV cache, prefix cache, and continuous batch processing were all laid out at that time. When I checked the installation instructions on the official vMLX website, it boldly said a line of 'one-click vLLM-MLX installer.'

In other words, **these two challengers holding different numbers without mentioning each other technically come from the same source. **This explains one thing: why their selling points almost overlap—both talk about prefix caching, paging KV, and continuous batch processing. They don't approach the same problem from two directions, but rather two branches branching off from the same tree. When reading their promotions and keeping this kinship in mind, many of their "exclusive features" aren't so unique.

## 💰 Who profits, who loses, who remains silent

**Who profits: the one that grabbed the local AI entry point. **Running models on Mac has shifted from being a 'toy' to 'agent backend' in recent years—programming assistants like Claude Code and Codex really work together with local models for dozens of minutes. Whoever becomes the default engine stands on the path that all local traffic must take. So Rapid-MLX performed interface validation for 12 agent clients at once, and 5 of them (Claude Code, Codex CLI, Hermes, Aider, DeepSeek Harness) had to run end-to-end again every release before they could be released; Ollama simply gave a command to take over Claude Code. **Everyone isn't competing for benchmark scores, but for your default configuration. **

**Who loses: Ordinary users who choose engines based on the title. **If you see "almost 4.2x faster" on GitHub, it's hard to have the patience to flip to the middle of the README to verify "up to 3x," let alone check if there are competitors in the benchmark. **The slogan is written for those who glance at it, footnotes are for those who are meticulous**—and most people only glance at it. The trade-off is you might end up making an unnecessary move just for a multiple.

**Who is silent: No one will say, 'My numbers can't compare to others.' **All three properly write their test conditions below charts or in table footnotes, and none of them prominently remind you that 'this number cannot be compared to competitors.' **Disclosure doesn't mean it's a hint. **The gap isn't about who is lying, but where the publicity works—the silent words are often what you should know most.

As for why it's starting now—because the MLX path has just been proven viable. **Ollama used an official announcement to prove for the entire ecosystem that "switching to MLX can be much faster," essentially boiling the water to 99 degrees**; challengers only need to prove they're just a little faster to get attention. **After the frontrunner finishes market education, the followers have a show; this script is repeated almost every time the technology changes. **

## 🧭 So how should you choose?

If you can't compare horizontally, then don't compare horizontally. **Try another approach: don't look at who's faster, but at what each is optimizing. **These three companies actually follow three different paths. Seeing the path clearly is much more useful than just looking at benchmark scores.

| Engine | It's really optimizing what it is | Whoever it suits you |
| --- | --- | --- |
| Ollama | Switch to MLX kernel + new quantization format + cross-session cache multiplexing | People who want convenience, the most comprehensive ecosystem, and the ability to take on programming assistants |
| Rapid-MLX | Pure MLX kernel with no rollback, heap agent client compatibility | Heavy agents and those willing to tinker with parameters |
| vMLX | Prefix cache and paginated KV focus on ultra-long contexts and multiple sessions | Scenarios with long contexts and multiple parallel dialogues |

> The classification is based on each project's stated technical focus, not the speed ranking.

If you must know which is faster on your machine, the only reliable way is to run it yourself using the same model, the same prompt, and the same quantization format**—this is exactly what this article doesn't do for you, because if you want to do it, you have to do it right. Tests with mismatched conditions are as worthless as these slogans.

Finally, leave a habit you can use long-term: **Next time you see 'N times faster,' first find three things—machine model, model and quantization format, and who the control group is. **If any one of these three is missing, that multiplier is just an advertising slogan. Once you've found all three, you'll truly understand the image.

> [!summary] To wrap it up in one sentence
> Ollama switched to the MLX kernel six months ago, paving the way for Mac-native inference; Rapid-MLX and vMLX caught up with even bigger numbers. But when you look at the test conditions from the three companies, none of the machines, models, quantization formats, or control groups match—each scored full marks on their own questions. These engines are worth trying, just don't compare them to their promotional numbers—that comparison has never really happened.

---

## 📚 Source

- Ollama official announcement: "Ollama is now powered by MLX on Apple Silicon in preview": https://ollama.com/blog/mlx
- Rapid-MLX open-source repository: https://github.com/raullenchai/Rapid-MLX
- vMLX official website and comparison data: https://vmlx.net/
- Apple MLX framework: https://github.com/ml-explore/mlx


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
