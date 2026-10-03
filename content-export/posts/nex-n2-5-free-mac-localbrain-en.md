---
title: "Nex-N2.5 is free, can a 64GB Mac run it?"
slug: nex-n2-5-free-mac-localbrain-en
status: published
lang: en
translation_of: nex-n2-5-free-mac-localbrain
translation_source: machine
source_sha256: 8e2a51fbc754f181
date: 2026-09-09
updated: 2026-10-03
summary: "35B multimodal agent is open source, and online endpoints are currently free; Whether Mac capacity is sufficient means runtime is already connected."
categories:
  - Thoughts
tags:
  - AI
  - News
cover: https://hyphentech.top/obsidian-assets/nex-n2-5-free-mac-localbrain/cover-ee37558b86.jpg
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/nex-n2-5-free-mac-localbrain/) is authoritative.

> [!abstract]
> Three modes of modeling, visual feedback, and computer operation; First, separate the "can load" and "run steadily."
> HyphenTech · 2026-09-09

![35B expert core, 64GB Mac, and LocalBrain—the real barrier is the runtime compatibility gate](https://hyphentech.top/obsidian-assets/nex-n2-5-free-mac-localbrain/image-cover-wide-ee37558b86.jpg)

On September 8th, Nex-AGI released the Nex-N2.5 in three tiers at once: mini, Pro, and Max. The most eye-catching is, of course, the 1.6 trillion-parameter Max, but for ordinary users, the more practical issue is the smallest one: Can a 35B mini fit into a 64GB Mac and conveniently connect with LocalBrain? **

Let's set the boundaries first: this article does not do native inference testing. This round did not have download weights, did not start Nex, nor connect, stop, or switch the working LocalBrain. The following conclusions come from official repositories, configuration files, public model directories, and read-only checks in the current LocalBrain 1.2.58 source code.

> To get straight to the point: a 64GB Mac already has a 4-bit version for the community; But now you can only write "Candidate accessible," not "LocalBrain already supported."

![Nex-N2.5 Official GitHub repository: mini, Pro, Max, computer operation, visual feedback, and positioning are all written in the original description](https://hyphentech.top/obsidian-assets/nex-n2-5-free-mac-localbrain/image-official-repo-71449a0322.png)

## 🎯 ▍Why is there three levels at once now: Nex is competing for the Agent entry point

Why is Nex now open source? My judgment is that it's not competing for chat rankings, but rather the entry point for next-generation computers to operate agents. Mini is responsible for letting developers access architecture at low cost, Pro for online services, and Max for raising the flagship cap. Currently, free APIs first attract callers, then host them, enterprise deployment, and billing based on call volume to build a foundation.

The interest structure here is also clear: model vendors benefit from developers validating real tasks for them, API platforms benefit from new traffic; Ordinary users save on early trial-and-error costs but may bear migration and payment bills after workflow binding. Open-source weight means this game is not limited to the cloud alone, but local users must bear quantization, runtime, and security maintenance themselves.

## 🔍 ▍What it really wants to grab isn't the chat box

The three levels of the Nex-N2.5 are not simply about stacking parameters more and more. The mini and Pro continue the multimodal approach, focusing on computer operation, web browsing, visual feedback, and long-term tasks; The Max is a plain-text MoE that handles complex reasoning, programming, and agent workflows. In other words, Nex splits the product line into two main products for "can see, can point, and can modify the next step based on results" and "pure text re-reasoning."

This is more interesting than "another model with higher benchmark scores." Back in the first wave of visual language model craze, many products would end after seeing a single image; In Nex's description, vision is the feedback loop after action: after the model clicks a button, it looks at what the interface looks like, checks the results, and continues to refine. It's closer to an executor sitting in front of a computer repeatedly confirming.

![Nex-N2.5 Third-tier positioning and some official self-reported results; These numbers are not HyphenTech's independent tests](https://hyphentech.top/obsidian-assets/nex-n2-5-free-mac-localbrain/image-family-map-7a417fcfa5.png)

The official Terminal-Bench 2.1 scores are mini 73.4, Pro 82.7, Max 86.1; OS Browser-Verified is mini 71.2, Pro 82.2.

The numbers are impressive, but the official statement also states: some competitors' results come from public sources, some from their own evaluations; coding tasks use NexAU, computer tasks use NexCUA, and NexCUA is still "about to be open source" at the time of release. So they are suitable for judging direction, not for final proof of purchase.

## ⚡ ▍35B Why is there only a small group of experts working simultaneously?

The mini's configuration is not the usual dense 35B. It has 40 layers and 256 experts, but each token only activates 8 experts; Every 4 layers is arranged for full attention, with the rest of the layers mixed with linear attention; The native position limit is 262,144, and it also includes a visual encoder.

The advantage of MoE is that the total parameters are large, but only part of it is changed at a time, so the computational load does not have to be fully equivalent to the 35B dense model.

Last time the community focused on MoE localization, some people mistook "activation parameters" for "parameters that need to be downloaded"; The cost has never changed: weights still need to be stored in memory, and expert routing and large small matrices make quantization, caching, and runtime optimization more complex. **Fewer activation parameters do not mean smaller model files. **

## 💰 ▍The first wall on Mac isn't computing power, but weight volume

The official BF16 storage holds 70.24GB, already exceeding 64GB of total system memory, not including macOS, KV cache, and visual projection. So you don't need to test the official original version; just the weight alone is not enough to fit it.

Community conversion changed the situation: MLX 4bit storage is about 19.53GB; GGUF Q4_K_M weight is about 21.17GB, plus 0.90GB mmproj, totaling about 22.07GB. This size is no longer a hard wall for 64GB of unified memory; it can even leave room for context and the system.

![Capacity difference between official BF16 and community MLX/GGUF; Volume entering range does not mean runtime experience has been accepted](https://hyphentech.top/obsidian-assets/nex-n2-5-free-mac-localbrain/image-mac-wall-5036c7930e.png)

The problem is timing. Both community repositories were created on September 8, and when checked, downloads were still zero. They are not official Nex-AGI conversions, nor have they received enough usage feedback. Historically, when new architectures enter the local ecosystem, the common order is to first have weight, then quantization, and finally to add templates and visual support; The most common pitfall is that the model can be scanned, only to find after launching that one of the architecture, chat templates, visual projections, or tool calls is missing.

## 🧩 ▍Can it be added to LocalBrain? It can be listed as a candidate, but don't write it as supported yet

Read-only checks the current LocalBrain 1.2.58 source code; it already has an external model library entry: read-only scanning, no copying, no moving, no deletion; The top-level GGUF is handed over to llama.cpp, and the directory with Safetensors plus config.json goes to the MLX path. GGUF also reads the real file header and guesses the architecture without relying on folder names.

This means the NEX community conversion component qualifies for inclusion as a model candidate. However, LocalBrain's native vision still requires the main GGUF to be paired with mmproj, while MLX vision is categorized independently; plus qwen3_5_moe, multimodal chat templates, and tool protocols, any link that is not fully understood by the current runtime may result in "can see but can't run" or "can chat but cannot view images or operate tools."

| Check the layer | Current judgment | What else is missing? |
| --- | --- | --- |
| Capacity | 64GB can accommodate 4-bit community storage | Context and peak memory should be tested |
| Model discovery | GGUF / Safetensors can be considered candidates | Directory and shard integrity |
| Text launch | The architectural path exists | The current runtime is truly running |
| Vision | GGUF has mmproj | Image input and template acceptance |
| Agent | Model positioning supports tool workflows | Tool call formatting, long tasks, and self-correction |

## 🚀 ▍If you want to use it now, online actually saves you time

On September 9, I checked the OpenRouter public directory. Both mini and Pro had `:free` endpoints, input and output prices showed 0, and the context was 262,144. Two small text should be added here: First, this is "currently free," not permanently free; Second, OpenRouter marked mini as plain text input, while Pro marked as image-text input, indicating that the hosting side may not fully open all official weight modalities.

So the choice is simple: if you want to experience the model's capabilities today, start with the free online endpoint; if you want to keep the data locally, add the Community 4bit version to your watchlist, and once runtime and real user feedback stabilize, do a controlled boot. The least cost-effective move now is to first lower the official 70.24GB weight, only to find the whole system can't even pass loading.

## 🧠 ▍My Judgment: Nex's Ambition Lies in the 'Visual Closed Loop'

The most remarkable aspect of the Nex-N2.5 isn't the massive 1.6T figure, but how it upgrades visuals from input to execution feedback. Model manufacturers are moving toward Agents, and the real watershed will shift from "who answers smarter" to "who can continuously act, check, and correct errors on real computers, without crossing permission boundaries."

For 64GB Mac users, mini has moved from "absolutely can't let go" to "opportunities after quantization." But opportunities are not the conclusion. Once community conversion has usage and llama.cpp and MLX support for this multimodal MoE is stable, then LocalBrain's text, visual, and tool call chains are evaluated item by item, only then can we publicly say "runs."

> [!tip]
> **Primary source**
> Nex-N2.5 Official Warehouse: https://github.com/nex-agi/Nex-N2.5
> Mini official weight and specs: https://huggingface.co/nex-agi/Nex-N2.5-mini
> OpenRouter mini: https://openrouter.ai/nex-agi/nex-n2.5-mini:free
> OpenRouter Pro: https://openrouter.ai/nex-agi/nex-n2.5-pro:free
> 
> Community conversion is only for volume judgment:
> https://huggingface.co/abenzerps/Nex-N2.5-mini-MLX-4bit
> https://huggingface.co/abenzerps/Nex-N2.5-mini-GGUF


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
