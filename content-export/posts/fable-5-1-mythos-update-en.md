---
title: "Fable 5.1 didn't drop in price, so why save 45%?"
slug: fable-5-1-mythos-update-en
status: published
lang: en
translation_of: fable-5-1-mythos-update
translation_source: machine
source_sha256: e13382b7c4597fac
date: 2026-09-02
updated: 2026-10-03
summary: "Fable 5.1 and Mythos 5.1 are the same underlying model, but were split into public and trusted access versions. The base unit price hasn't dropped, but cache reads are 75% cheaper; What truly changes are the task economics, security boundaries, and access methods for long-term agents."
categories:
  - Thoughts
tags:
  - AI
  - News
cover: https://hyphentech.top/obsidian-assets/fable-5-1-mythos-update/cover-135e02a88b.jpg
brand_slogan: 
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/fable-5-1-mythos-update/) is authoritative.

> [!abstract]
> The same underlying model, two sets of open boundaries; The unit price of input/output remains unchanged, but the real price reduction is the context repeatedly read by the agent.
> HyphenTech · 2026-09-02

## 🌓 The names sound like two models, but underneath, they actually share the same brain

This morning, when I opened Anthropic's release page, the first thing that stopped me wasn't the 52.6% research score, but a very straightforward statement written on the official website: **Claude Fable 5.1 and Claude Mythos 5.1 are the same model, just with different guardrail levels. **

Fable 5.1 is for Claude API customers and partner cloud platforms; Mythos 5.1 is only for organizations and professionals in the trusted access program. One is responsible for deploying capabilities in mass production, while the other opens up expertise in cybersecurity and life sciences to audited teams. **This isn't "big and extra," but more like two sets of access control systems installed on the same machine. **

![Anthropic's official release page places Fable 5.1 and Mythos 5.1 under the same main heading, clearly stating that they share the underlying model](https://hyphentech.top/obsidian-assets/fable-5-1-mythos-update/image-official-launch-61d82072a9.png)

This design determines how this update should be viewed. What ordinary users get is not a "stripped architecture," but a secure version of the same capability foundation in the public environment; Professional teams applying for Mythos are not paying more for memberships, but exchanging organizational identity, usage scenarios, and review responsibilities for broader professional boundaries.

Back then, enterprise software often split the same set of code into community and enterprise versions by license, with the main difference being feature switches. This time, Anthropic didn't focus on the menu, but on how far the model could go in high-risk areas. **Capability commoditization and risk grading were placed together in the same product manual for the first time. **

> The difference between Fable and Mythos isn't about which is smarter, but about who is allowed to use that intelligence in what scenarios.

![The same model is split into two open boundaries; Cache read reductions to one-quarter of the previous generation are the core cost changes](https://hyphentech.top/obsidian-assets/fable-5-1-mythos-update/image-model-map-de863352ae.png)

## 📊 Benchmark scores have indeed increased, but don't treat official results as a universal guarantee

Let's start with the most notable research achievements. On Terminal-Bench-Science 0.1, Fable 5.1 reached 52.6%, the previous generation Fable 5 was 24.7%, Opus 5 was 29.0%, and GPT-5.6 Sol was 22.4%. Looking at the numbers, it's not just minor tweaks—it's more than doubled the previous generation's results.

But next to this chart is a line of easily overlooked note: each model's standard error is about ±3.5 to 4.5 percentage points, and the entire set of results is published by Anthropic itself. **It can prove the company has made significant progress in long-term research tasks, but it does not prove your codebase, contracts, or financial statements will improve proportionally. **

![Anthropic's official Terminal-Bench-Science cost-accuracy curve; Low and medium effort are also listed separately](https://hyphentech.top/obsidian-assets/fable-5-1-mythos-update/image-official-benchmark-d8bce24852.png)

| Official benchmark | Fable 5.1 | Fable 5 | Opus 5 | Change |
| --- | --- | --- | --- | --- |
| Terminal-Bench-Science 0.1 | 52.6% | 24.7% | 29.0% | Research Agents saw the biggest leap |
| Terminal-Bench 4.0 | 55.8% | 42.0% | 52.3% | Fable overtook Opus |
| GDPval-AA v2 | 1853 | 1723 | 1824 | Knowledge work leads slightly |
| AutomationBench | 31.4% | 17.1% | 26.9% | Business automation has improved significantly |
| CursorBench 3.2 | 73.4% | 70.5% | 70.0% | Code Agents are steadily improving |

> Source: Anthropic official release page. Mythos 5.1 scored 60.9% on Terminal-Bench 4.0; The official explanation is that the gap mainly comes from cybersecurity guardrail interventions.

More importantly, the improvement is concentrated. The official list lists six categories: multi-file programming and migration that can run for hours; from problem to document, formula tables, and slides; multi-step research and search; visual ability to read dense PDF charts; long-form reasoning that spans 1M context; and computer operations that can recover after failure. Multilingual performance is roughly on par with Fable 5.

This set of changes points to the same thing: Anthropic doesn't just want the model to answer a problem correctly, but to make it remember the goal after dozens of tool calls, check its products, and find the root cause before continuing again. Back when code models were just about completing accuracy, whoever wrote one more line correctly won the game; Now, the real gap is whether the task will still deviate by the third hour.

## 💸 The price per million tokens hasn't dropped, so why does the official dare to say the savings can be up to 45%?

The base unit price of Fable 5.1 is exactly the same as Fable 5: $10 per million tokens input, $50 output. It's still twice as expensive as Opus 5's $5 input and $25 output. Just looking at the price list, this time it doesn't even count as a price drop.

The real cut is cache read: from $1 per million tokens in the previous generation to $0.25, a 75% discount. Long-term agents repeatedly read system instructions, code summaries, tool definitions, and previous session records each round; the higher the cache hit, the more valuable this cut is.

Anthropic therefore estimates that typical token-based workloads reduce effective costs by about 25%, and high-agent tasks can drop by up to about 45%.

![Claude Platform Official Specs: 1M context, 128K maximum output, $10/$50 base price and $0.25 cache read](https://hyphentech.top/obsidian-assets/fable-5-1-mythos-update/image-official-specs-73251a7452.png)

That's why short Q&A users shouldn't add "up to 45% savings" to their bills. One question, one answer, very little cache reuse, and the most expensive output token hasn't dropped by a cent; Only tasks like code agents, deep research, and document pipelines that continuously review the same batch of context have a chance to approach that cap.

Back then, cloud computing set prices as "how much per machine per hour," but later the real cost was determined by reserved instances, hot and cold storage, traffic, and idle rates. Model APIs are replaying this script: **The listing price is just a doorstep menu; the full task cost also includes cache, tool turns, failed retrys, and runtime. **

Who profits? Agent platforms, cloud vendors, and long-task users benefit first, and Anthropic can also push high-end models into more production processes at lower task costs. Who loses? Many people with one-time output and low cache hits basically don't reap the benefits. Who stays silent? The price list won't proactively tell you that an Agent running a few extra rounds due to fewer parallel tool calls might spend the saved cache fees back.

## 🧰 Developers should not just change the model ID; three compatibility errors will occur immediately

Migrating from Fable 5 to 5.1 seems like just changing the model ID to `claude-fable-5-1`, but the official documentation lists three disruptive changes. First, the forced `any` or specified tool in `tool_choice` is no longer supported and returns 400; Change to automatic selection, combined with strict tool mode or structured output.

Second, older models cannot read thinking blocks generated by Fable 5.1. If the router reverts from 5.1 to an earlier model, these thinking blocks will be discarded.

Third, modifying, rearranging, or deleting old rounds, or even causing the same image URL to return different bytes later, may render subsequent thinking blocks invalid. **When maintaining the Agent harness of the message array, you must change the session to an add-on. **

- **Forced JSON**: Use `tool_choice: auto` + strict tool use, or structured output
- **Cross-Model Routing**: Monitor the discarded thinking block; don't treat silent conversion as the complete context
- **Long Conversations**: Try to only add old messages without modifying them; switch to turn-scoped system messages for temporary reminders
- **Real-time interface**: Fable 5.1 has fewer progress updates and requires explicit activation `display: updates`
- **Low Effort Search**: The official reminder makes it easier to answer by memory, and when fresh information is needed, it should be explicitly requested to search

There are also two behavioral differences that directly affect actual cost: parallel tool calls are more unstable, and small changes make it easier to rewrite the entire file. The former increases rotation and latency, while the latter increases output tokens. **Cheaper cache does not mean the harness cannot be optimized; The stronger the model, the less the orchestration layer cannot lie flat. **

## 🧬 Mythos is not a hidden membership profile; Anthropic is experimenting with a tiered opening

Fable 5.1's cybersecurity guardrail intervenes about 60% less per Claude Code session on average, now allowing software vulnerability discovery, but exploit generation, penetration testing, and binary-based vulnerability scanning may still be handed over to Opus. Biological guardrails have 85% fewer false triggers for basic biological and medical benign requests compared to Fable 5's launch version.

Mythos 5.1 was opened through the Cyber Verification Program and the Life Sciences Verification Program, which also powered Claude Security.

In other words, Anthropic does not simply lock down high-risk capabilities, but requires applicants to be identifiable, scenario-describable, and accountable for accountability. **Ordinary users are less likely to be accidentally harmed, professional teams gain more capabilities, and the platform keeps the last door. **

Why is Anthropic doing this now? On one hand, its long-term task capabilities are strong enough to continuously operate code, browsers, and research tools, and accidental damage from old guardrails is starting to directly hinder production; On the other hand, cloud vendors and enterprise customers need auditable, accountable data and security contracts.

Fully rolling out Fable and placing Mythos into trusted initiatives not only seize the agent entry point but also keep the responsibility chain for high-risk capabilities within the business system.

The research case is impressive: Mythos 5.1 achieves nearly 50% hit rate on protein conjugates at 12 targets, with the official standard being 10%–15%; It also accelerates seven open-source biological models by up to 2.5 times, estimated GPU cost reductions of 30%–60%. Fable 5.1 uses NASA radar data from over thirty years ago to advance Venus elevation map details from 10–20 kilometers to 2–3 kilometers.

These cases deserve attention, but they are still first-release results selected and organized by manufacturers, not a comprehensive replica of general research capabilities by independent labs. Back when autonomous driving demonstrations first amazed the public, a single beautiful route and reliable all-weather driving were not the same thing; Today, AI research is the same: ** discovering clues, proposing hypotheses, and forming repeatable evidence are three different gates. **

## 🧭 How to choose for regular users: Don't set the most expensive model to default

Anthropic's own model page is actually quite restrained: most workloads start with Opus 5; Only high-effort Opus still doesn't meet the requirements, or when tasks are indeed long-term code, research, and complex knowledge work, then use Fable 5.1. Its default latency is marked as "slow," which is also a trade-off for strength.

| Your mission | Recommended choice | Reason |
| --- | --- | --- |
| General Q&A, daily writing | Start with Opus 5 or lighter models | Fable's base output is still expensive, and its cache advantage is limited |
| Hours of code migration and root cause analysis | After the review, I used Fable 5.1 | Long tasks and cache price drops are the best match |
| Multi-step research, documents/spreadsheets/slides | Fable 5.1 is worth focusing on testing | This is an officially designated enhancement zone |
| Specializes in cybersecurity and life sciences research and development | Apply for Mythos 5.1 trusted access | Not a public membership file, requires review |
| 64GB native deployment on Mac | and it is not feasible | Without open authority, we can only go through the cloud |

> This article is an official relay and analysis of data, excluding local model testing. Actual selection should be based on your own task set, failure rate, time spent, and complete billing.

Finally, to clarify local deployment: **Fable 5.1 and Mythos 5.1 have no open weights, nor do they have GGUF, MLX, or offline runtime routes. **1M refers to cloud service specifications, not the local capacity of a 64GB Mac.

Being able to access it in Claude, API, Bedrock, Google Cloud, or Microsoft Foundry doesn't mean you can download the model home.

So what truly makes this update worth remembering is not "another strongest model." It ties together three previously scattered issues: top-tier capabilities delivered on the same foundation, high-risk capabilities tiered and open by identity and scenario, and long tasks reduced costs by cache price rather than base unit price. **Model competition has moved from answering once to who can complete the whole task cheaply and steadily. **

> [!tip]
> **Primary source**
> Anthropic official release page:
> https://www.anthropic.com/claude-fable-and-mythos-5-1
> Claude Platform Model Specifications:
> https://platform.claude.com/docs/en/models/fable-5-1/overview
> Update and Migration Notes:
> https://platform.claude.com/docs/en/models/fable-5-1/whats-new-fable-5-1

> [!summary] Same model, two sets of boundaries, price not dropped, but long-term tasks might actually save money
> Fable 5.1 shares the underlying model with Mythos 5.1: the former is fully open, while the latter only provides trusted access to projects. The base price for 1M context, 128K output, and $10/$50 remains unchanged, but cache reads are reduced to $0.25/MTok, reducing the effective cost of typical tasks by about 25% and highly agent tasks by up to about 45%. It is best suited for long-term code, research, and complex knowledge work; Ordinary Q&A does not require defaulting to the most expensive tier, and there is no deployment route for local Macs.

> [!tip]
> **HyphenTech** · Local AI / Free Purchase Guide / Tools I Make / New Product Express
> This article is based on Anthropic's official release page and Claude Platform documentation; All benchmarks and research cases are labeled according to official standards, and no local model tests have been conducted.


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
