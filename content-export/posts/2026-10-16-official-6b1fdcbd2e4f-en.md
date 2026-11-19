---
title: "What is Hy-Memory-30B-A3B: How well can it write long-term memory?"
slug: 2026-10-16-official-6b1fdcbd2e4f-en
status: published
lang: en
translation_of: 2026-10-16-official-6b1fdcbd2e4f
translation_source: machine
source_sha256: 7822d1b23b5ee57a
date: 2026-10-16
updated: 2026-11-18
summary: "Tencent Hunyuan opened the long-term memory writing model. Let's first look at what it solves, how it performs, and how it is accepted."
categories:
  - Tech
tags:
  - AI
  - Frontier models
cover: "/obsidian-assets/2026-10-16-official-6b1fdcbd2e4f/wordmark-wide-09c3da7710b8.jpg"
brand_slogan: 
legacy_paths: []
article_type: "model"
cover_status: "generated_user_authorized"
model_name: "Hy-Memory-30B-A3B"
model_category: "AI大模型"
model_stage: "官方发布"
model_url: "https://huggingface.co/tencent/Hy-Memory-30B-A3B"
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/2026-10-16-official-6b1fdcbd2e4f/) is authoritative.

The chat assistant remembers your preferences; the challenge isn't just about "saving them," but deciding which information is worth keeping, how to write accurately, and how to update old records when new information appears. Tencent Hunyuan's Hy-Memory-30B-A3B specifically handles this "write to long-term memory" path.

## It's not a complete chat model, but rather a 'writer' in the memory system.

The official definition of Hy-Memory-30B-A3B is a compact long-term memory writing model, with about 3B activation parameters. It can replace the general-purpose large models originally written in Mem0, MemOS, and Hy-Memory, covering chat, work, and programming scenarios.

You can think of the external memory framework as a courier warehouse: dialogue is the continuous delivery of packages, the memory bank is the shelf, and the writing model is responsible for determining which packages should be stored, how labels to write, and whether to replace or supplement the same item after a new version. The Hy-Memory-30B-A3B manages this step, not the entire process of searching, answering, and completing the entire application process alone.

The 30B in the name corresponds to the parameter scale listed on the model page, and in practice, each input is about 3B activated. It's more like a warehouse with many shelves and only the relevant area is mobilized each time; This shows the model uses a sparse activation approach, but it cannot directly determine the speed, memory usage, or runtime of a particular computer.

![Official Model Introduction](https://hyphentech.top/obsidian-assets/2026-10-16-official-6b1fdcbd2e4f/source-evidence-1-9ff975e4.png)

## What can the official results indicate?

This evaluation only replaced the memory writing model. Officially, the comparison groups maintained the framework version, prompts, retrieval configuration, response model, judge model, and other framework components; Each writing model built its own memory from a blank state, with test samples following the same scoring rules. The main review used a fixed 20% subsample.

| Officially listed memory writing models | Mem0 | Hy-Memory | MemOS | EverMemOS | Overall score |
| --- | --- | --- | --- | --- | --- |
| Hy-Memory-30B-A3B | 54.02 | 60.55 | 50.51 | 56.89 | 55.49 |
| Claude Opus 5 | 53.43 | 60.53 | 50.50 | 54.04 | 54.62 |
| DeepSeek V4.1 Flash | 49.73 | 60.20 | 49.17 | 55.47 | 53.64 |

> Official fixed 20% subsample results; Scores for each framework are averaged equally weighted by six indicators, and composite scores are equally weighted across four frames.

These figures support a limited conclusion: in the official fixed conditions and sampling matrix, the combined score of Hy-Memory-30B-A3B is 55.49. They are not independent retests and cannot prove the same results after switching prompts, retrievers, response models, or real user data.

![Official Review Criteria](https://hyphentech.top/obsidian-assets/2026-10-16-official-6b1fdcbd2e4f/source-evidence-2-f852ef54.png)

## What's even more worth watching is how it learns to update its memory

The official training uses a two-stage approach: first, Memory On-Policy Distillation, where the student model learns the state chain provided by the teacher; then Attributed Memory Reinforcement Learning, where block-level feedback is distributed based on the formed memory and the selected memory is brought into subsequent windows.

It's like organizing WeChat chat records: first learn how to write scattered messages into clear notes, then judge which records are truly useful based on future usage. The key is not just to remember a sentence, but to keep old records usable when new evidence emerges. The official team also kept EverMemOS outside of training, using it to observe how models perform when migrating to memory frameworks they had never seen before.

## What can be obtained now, what is still lacking?

The official model page lists model weights, configurations, and model cards, and provides [Hy-Memory-30B-A3B model page](https://huggingface.co/tencent/Hy-Memory-30B-A3B). The file uses Safetensors, with BF16 and F32 labeled on the page; This indicates that weights are provided, not just future plans.

- The official deployment method is vLLM, with the test version specified as v0.31.0, and calls via an interface compatible with OpenAI.
- The official sources also provide framework code and evaluation tool entries, making it suitable for further verification of data formats, memory structures, and evaluation methods.
- The model page clearly shows that there is currently no Inference Provider deployment, so "weights are open" cannot be interpreted as "hosted interfaces are available for direct use."

![Official Deployment Notes](https://hyphentech.top/obsidian-assets/2026-10-16-official-6b1fdcbd2e4f/source-evidence-3-0c37a814.png)

> [!warning]
> Downloadable weights only solve the problem of "whether the file can be obtained." Whether the license meets specific purposes, runtime compatibility, hardware capacity, and real-world task stability still need to be verified separately; Official data does not provide conclusions on memory, speed, or cost for ordinary consumer devices.

![Managed Service Status](https://hyphentech.top/obsidian-assets/2026-10-16-official-6b1fdcbd2e4f/source-evidence-4-39e8a1fd.png)

## When actually ready for use, it is accepted as a complete link

- First, confirm that tasks do require maintaining user facts, preferences, or project status across conversations, rather than just the current context.
- Then, according to the official framework, the answer model and retrieval configuration are fixed, only replacing memory writes to the model, avoiding assigning changes from other components to it.
- Retain the start of the empty library, write results, updated memory, and final answer, checking whether the model has missed or misremembered anything, or treated inferences as facts.
- Finally, it adds real scenarios for deletion, error correction, and preference changes. Writing once does not guarantee long-term maintenance, nor does it mean the entire assistant is reliable.

The value of Hy-Memory-30B-A3B is clear: it turns the write step in long-term memory systems, which is often handled by general-purpose models, into a replaceable model. At this stage, it is suitable for developers who already have an external memory framework and are willing to deploy and perform item-by-item acceptance; Those who only want to directly access managed chat services or expect to run the system immediately on any computer after downloading weights still need to wait for more complete running conditions and independent testing.

## Official information

- [Tencent Hun Yuan Official Release](https://huggingface.co/tencent/Hy-Memory-30B-A3B)


---

## 🧰 Tools I build

I maintain all of these tools myself. Preview builds are clearly labeled; the release pages are the source of truth for downloads, updates and known limits.

> [!info] HyphenAssistant
> **Status:** Official releases
>
> Continue your computer's DeepSeek Harness session from a phone browser. Personal pairing and an online computer and service are required; model costs follow your existing setup
>
> [Downloads & updates：HyphenAssistant](https://github.com/HackerChi-Hub/hyphen-assistant-releases/releases)

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

> [!info] ScreenLex
> **Status:** Official releases
>
> Learn new words while you watch shows. Free, for Mac and Windows
>
> [Downloads & updates：ScreenLex](https://github.com/HackerChi-Hub/screenlex-download/releases)

> [!info] HyphenScreen
> **Status:** Official releases
>
> Screen recording and smart editing in one: a DaVinci-style timeline, automatic redaction and a check of the finished video before export. Free
>
> [Downloads & updates：HyphenScreen](https://github.com/HackerChi-Hub/HyphenScreen-Releases/releases)

---

> [!quote] HyphenTech
> **Make AI your superpower**
> Local deployment · Free resources · Self-made software
> [HyphenTech](https://hyphentech.top)
