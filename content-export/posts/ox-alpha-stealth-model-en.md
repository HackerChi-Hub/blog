---
title: "The mysterious model exploded! Niu Lai?"
slug: ox-alpha-stealth-model-en
status: published
lang: en
translation_of: ox-alpha-stealth-model
translation_source: machine
source_sha256: ddd5bded77a6bc69
date: 2026-08-24
updated: 2026-10-03
summary: "Late at night on August 20, OpenRouter added a line of stealth/ox-alpha. No company, no warehouse, no name, but in two days it shot to number one in call volume. Around 1.04 million yuan, you can watch videos, completely free—the price is written at the top of the page."
categories:
  - Thoughts
tags:
  - AI
  - LLM
  - Free tier
  - OpenRouter
  - Tools
cover: https://hyphentech.top/obsidian-assets/ox-alpha-stealth-model/cover-f9bedfd334.png
brand_slogan: 
legacy_paths: []

---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/ox-alpha-stealth-model/) is authoritative.

> [!note]
> This article was first published on the HyphenTech official WeChat account

## The mysterious model has exploded. Niu Lai?

> stealth/ox-alpha: No company, no warehouse, no name. Around 1.04 million yuan, can watch videos, completely free, and in two days it shot to number one in call volume

> [!note]
> HyphenTech · Official Interface Actual Extraction · 2026-08-24

---

This August, two isomorphic incidents occurred on the Chinese internet internet. One was the movie "Niu Lai"—a domestic animation so rough that netizens mistaken it for performance art. On its opening day, it grossed over 3,000 yuan, then surged to over 40 million yuan thanks to the collective audience of "I want to see how absent it really is." The other happened at 8:04 PM (UTC) on August 20: an extra line \`stealth/ox-alpha\` appeared in the OpenRouter model list.

No launch event, no company blog, no HuggingFace repository, and no one even knew who developed it. Four days later, I checked its usage volume—**the two apps that ran the most on this platform together gave it 3.36 trillion tokens. **The two things took exactly the same shape: an unknown person suddenly going viral, and everyone wanted to see for themselves.

![# Ox Alpha page on OpenRouter: Price Free, context 1M, release date Aug 20, 2026](https://hyphentech.top/obsidian-assets/ox-alpha-stealth-model/image-01-68b2ebdb24.png)

In recent days, it has also become popular in the Chinese-speaking community. On August 22, Zero Degree Commentary released a test with over 48,000 views: it was plugged into programming tools, and a prompt generated a game that could run in the browser. In just over ten minutes, a mini-game was created where you alternate legs with the A and D keys and sprint with space, and the same prompt was used to draw a Schwarzschild black hole for horizontal comparison with GPT-5.6 and Fable 5. **These are other people's test results. I have reposted them verbatim, not reproduced. **

Excitement aside, I'm more concerned about two things that can be confirmed without a demo: **What exactly are its specifications, and where is the free cost written?** **Both of these are clearly stated on the official interface and page, so anyone can pull and compare them themselves—so I'll take all the numbers below via the interface and won't cite secondhand reports.

> [!note]
> To get straight to the point: **This is a truly actionable, cutting-edge spec model, and it clearly states the cost in the first paragraph of the page—your input and output, all kept by the provider. **It's not sneaky, you just haven't seen it yourself.

### 🕶️ ▍ What is the stealth model?

First, explain the term, otherwise everything that follows is just a misunderstanding. The stealth model refers to **the model party actively choosing anonymity and putting weight on someone else's inference platform to run a section first**. The platform is responsible for taking and forwarding orders, but clearly states that it is not the developer, not the owner, and not the provider. OpenRouter is written very directly on its page: it only forwards requests.

Why do this? Usually, it's to get real-world usage data before the official release—real prompts, real long tasks, real failure cases. No matter how large the lab's internal review collection is, it's not as honest as tens of thousands of developers writing production code on it. **Trading free for real traffic** is a clearly priced transaction**, but many people don't look at the price tags. **This script** has been repeatedly played out on developer tools: the free tier first takes in real workflows, and when your pipeline can't do without it, you negotiate the price.

This kind of approach isn't new. **Back when various large models were still competing for leaderboards, some vendors anonymously placed codes in the arena, revealing their identities once the win rate was revealed. Ox Alpha took this even further: it didn't just anonymous names, it even cleared the fields that could reverse identity checks**.

---

### 📐 ▍ Specifications: The original numbers obtained from the interface

I didn't cite any secondhand reports and directly pulled OpenRouter's model list interface. This is the original field it returns—each item can be reproduced by itself.

| Field | Actual value | What does it mean? |
| --- | --- | --- |
| id | stealth/ox-alpha | The namespace is called stealth, and the platform admits it is anonymous advertising |
| context\_length | 1,048,576 | 1.04 million tokens, enough to fit the entire medium-sized codebase into it at once |
| max\_completion\_tokens | 131,072 | You can save up to 130,000 yuan in a single trip, and you can rewrite long files without slicing |
| modality | text+image+video → text | Three input options: text, images, and video, only text is output |
| pricing (prompt / completion) | 0 / 0 | Neither input nor output is charged; it's not a discount, it's zero |
| tokenizer | Other | They didn't even write about the participle family system |
| hugging\_face\_id | null | There is no corresponding public weight repository |

※ Data source: https://openrouter.ai/api/v1/models, retrieved on 2026-08-24. The created field is converted to 2026-08-20 20:04 UTC.

The capability side isn't just for show: it accepts tools and tool\_choice for function calls, supports response\_format generating JSON (but doesn't force schema). The page positions it as a **reasoning model oriented toward programming, long-range agent work, and production workloads**. Together, these words say the same thing—it's for you to get work done, not for chatting.

The 1.04 million context and 130,000 output per output numbers in practice look like this: a medium-sized project's entire source code plus dependency notes usually fit hundreds of thousands of tokens, meaning **you don't have to write slicing logic or maintain heuristic rules like "which files to feed together"**—just stuff everything in and let it find it on its own. The output limit of 130,000 determines whether it can rewrite a large file at once—many models get stuck not because of understanding, but because the output limit is cut off halfway through, and you still have to splice them. Only when these two are combined can long-term code modification truly work.

| Operational indicators | Measured values | Caliber |
| --- | --- | --- |
| Swallowing and spitting | 24 tokens/second | P50 is the best across all platforms |
| Delay | 5.14 seconds | P50, the optimal provider |
| 3-day online rate | 100.00% | At least one provider is responding |
| 3. Availability rate | 99.45% | The proportion of time reasoning is successfully served |
| Number of providers | 1 | Single hosting; OpenRouter does not perform routing selection |

※ Data is from the OpenRouter model page on 2026-08-24. 24 tokens/second is a platform-side statistic, not tested on my own device.

---

### 🧾 ▍ Cost: It is written in the first paragraph

![# Original field returned by the interface: pricing is set to two zeros, hugging\_face\_id and knowledge\_cutoff are both null, tokenizer only writes Other](https://hyphentech.top/obsidian-assets/ox-alpha-stealth-model/image-02-28667b3179.png)

The banner at the top of the page originally reads: Requests and replies are retained by the provider and not used for training; other uses are subject to the 'stealth model clause.' To put it plainly—**The only thing you can confirm is 'retain'; not being used for training is its declaration. What else you use it for, you can only speculate. **

> [!note]
> This sentence deserves a pause. The common phrase for free models is "will be used to improve services," which at least points to a direction. The wording here is **retain + exclude one use**; the remaining use space is not described. Add the provider's anonymous name—**you don't even know who to ask**. So the judgment is simple: open source projects, public materials, and practice scripts are all you want; company code, customer data, keys—don't go over a single word.

Now let's look at how the identity field is handled. \`hugging\_face\_id\` is null, \`knowledge\_cutoff\` is empty, \`tokenizer\` is written as \`Other\`. These three fields are usually used for technical traceability—you can use them to determine whose foundation the model belongs to and how long the training data was cut. **They're not 'not 'not ready yet'; they're being erased one by one. **Achieving this level of granularity for anonymity is design, not negligence.

By the way, here's some experience from checking free entry points. **Back then**, everyone checked whether an API was still usable by checking the documentation; Later, everyone learned and switched to sending a request to check the error code. The reason is simple: **The documentation was written last year, and the error was returned today. **Ox Alpha is even more important in this case—its free period is only about one week according to official standards, and the page doesn't mention when to cut off or what price after disconnection. Your script must be able to withstand sudden billing errors or 404 alerts one morning.

---

### 📈 ▍ Climbing to first place in two days: Who is feeding it?

![# Public Application Rankings: Hermes Agent ranks first on it, followed by Claude Code](https://hyphentech.top/obsidian-assets/ox-alpha-stealth-model/image-03-d490dd864d.png)

OpenRouter publishes the application rankings for each model. On Ox Alpha, the top is the **Hermes Agent**, and the second is the **Claude Code**—both are long-tasking programming agents, not chat frontends. This combination alone shows what it's used for: not Q&A, but to make it do dozens of minutes of continuous work.

| Application | August 23rd | August 24 | A day of change |
| --- | --- | --- | --- |
| Hermes Agent | 1.2T token | 2.25T token | Nearly doubled |
| Claude Code | 615B token | 1.11T token | Nearly doubled |

※ The figures for August 23 are taken from screenshots of the app rankings captured that day; the figures for August 24 are the actual data taken before this article was published. T = trillion, B = billion.

Within a single day, both leading apps nearly doubled their usage—**free and effective, developers are honest. **But looking at it the other way around, it also works: the steeper the curve, the more real production data providers get. The free period is set at about a week, just enough to run a complete usage profile.

This curve reminds me of "Niu Lai." The driving force behind that film's spread wasn't "it's good," but "Everyone is watching it, I can't be the only one who doesn't know." Ox Alpha is the same: **The first motivation for developers to flood in is "Stock up on free, cutting-edge models first," not "I think it's the best fit after evaluation." **The curve driven by onlookers grows quickly, but what it measures is curiosity, not long-term preference—real evaluation only becomes clear after charging fees.

---

### 💰 ▍ Who earns, who loses, who doesn't speak

Who earns: the provider. It incurs inference costs, but in return, it gets trillions of tokens in real production prompts—this data can't be bought on the open market, because no one will sell you their production code. **Every call during the free period is a sample collected from you that can't be bought elsewhere. **

Who saves: developers. 1.04 million contextual extended task capability, at the price of mainstream cutting-edge models, running a week is not a small amount. That money is now zero. Who is silent: **The provider themselves**. It doesn't say who it is, doesn't say what the model base is, doesn't say how long the data will be retained, or which jurisdiction it retains. Where there is silence, the conclusion is often the answer.

**Why is it doing this now, and what is it after?**—just look at the labels it puts on itself: programming, long-range agent, production load. These three words correspond to the group of users currently most consumed by reasoning and most willing to pay. It is targeting this group of users: **First, get the real workflow for free, and by the time you set prices, you won't be able to change the assembly line anymore. **The order is already clear, not just a random model to see the response.

There's another detail that supports the motivation: the free period is set for about a week, not a month, nor permanent. **A week is just enough to run a full round of user profiles, and it's so short you don't have time to treat it as infrastructure. **This doesn't feel like charity, but more like a field survey with a clear collection window.

---

### 🛰️ ▍ Here's my own story: My collection pipe leaked for three days

I have a topic collection pipeline that runs every morning at 7 a.m., dedicated to keeping an eye on new things in the AI community. Ox Alpha launched on August 20, while my pipeline chose the open-source alternative to Codex historical records on August 20, the llama.cpp version number on August 21, and the OpenAI open-source Codex engine on August 22. **It didn't see this model for three whole days. **

![#422 of the registered models have dual zero pricing for input and output—18 have the :free suffix, while the other 4 do not](https://hyphentech.top/obsidian-assets/ox-alpha-stealth-model/image-04-ab90471c6c.png)

After checking the root cause, I was a bit impressed because the leak was very reasonable. My model release sources totaled 12 entries: official blog RSS from six major companies, four dead GitHub repository releases, and two tech media outlets. **The common premise of these 12 sources is "something published by a known vendor"—while Ox Alpha has no vendor. **It's naturally invisible to my sources—not because they failed, but because they simply weren't in sight. **Back when ** this source table was built, model release was equivalent to a development press conference adding weight, and at that time, this assumption was valid; Now it doesn't hold, but the table hasn't been changed.

The second reason is more specific. I am indeed running OpenRouter, but the criterion only has one line: the model ID contains but does not include \`:free\`. I just tested — **Of the 422 registered models, 22 have zero pricing, only 18 have \`:free\` suffixes, and the remaining 4 are skipped by this line of criteria, with \`stealth/ox-alpha\` inside them. **The criterion equates "free" with "free in the name," but this model has zero pricing but no suffix.

> [!note]
> These two mistakes are actually the same: **I defined "new model" as "something published by the manufacturer," and "free" as "free in the name." **If the definition is narrowed, the most targeted items end up in the narrowed section. The amendment is also straightforward—discover by incremental content in the platform directory, judge free by price field, without looking at the name.

---

### 🧭 ▍ Should you use it, and how should you use it?

It's worth trying, but the premise is to clearly distinguish what to feed. Its specs are real: 1.04 million context, 130,000 output, can read images and videos, supports function calls. Currently, there is no second free model that includes all these features. According to official standards, the free period is about one week. When it ends or what price after it ends, the page doesn't specify it.

| What you want to do | Suggestion | Why? |
| --- | --- | --- |
| Read ultra-long codebases and refactor across files | It can be used | 1.04 million context + 130,000 per output reduces slicing costs |
| Long-range agents, tasks that take tens of minutes | It can be used | It is positioned accordingly, with the top two apps being this type |
| Comprehension tasks with images and videos | It can be used | Three-mode input—no alternatives at the same price point |
| Company code, customer data, keys | Don't touch it | The records are written openly and anonymously, so if something goes wrong, the person cannot be found |
| When the main force is focused on production for the long term | Farewell | The free trial lasts about one week, after which the pricing is unknown, and there is no redundancy for a single provider |

There's another easily overlooked risk: **It only hosts one provider**, and the OpenRouter page clearly states no routing selection. Usually, if a multi-provider model fails, it automatically cuts out, but it doesn't have this backup plan—the availability rate for those three days is 99.45%, not 100%. If you really connect to the pipeline, you need to prepare a de-level path yourself, so the entire link isn't stuck to an anonymous provider.

The getting started is very short: register on OpenRouter and get a free API key, enter \`stealth/ox-alpha\` as the model ID, and the interface is OpenAI-compliant. Any client that supports custom base URLs can use it directly. If you want to use a programming agent, the two apps on the leaderboard have already verified whether they can handle long tasks.

Finally, let's return to the contrast at the beginning. The most viral ironic line about "Niu Lai" is, "The pride of Chinese animation, even AI can't write it"—netizens joked about its awkward, almost replicable handmade feel. Interestingly, another unknown figure who rose to fame alongside it this August is precisely an AI. **One went viral because it was "so rough it doesn't look like a machine," the other was "so useful you don't know who made it"**, but the same thing lies in between: we are increasingly used to watching first, then judging.

---

> [!note]
> To wrap it up in one sentence
> 
> Ox Alpha is a truly cutting-edge model—free, 1.04 million contextual content, video viewing, and it shot to number one in call volume within two days. It doesn't hide any cost—the phrase is written in the first paragraph of the page, hiding its identity. So the usage is clear: use it for public work, don't use it to touch private data. By the way, it also made me realize that my topic radar defined "new models" too narrowly.

---

---

### 📚 ▍ Data sources and reproduction entry points

- OpenRouter · Ox Alpha Model Page: https://openrouter.ai/stealth/ox-alpha

- OpenRouter Model List API (data source for this article): https://openrouter.ai/api/v1/models

- Zero Degree commentary test video (2026-08-22): https://www.youtube.com/watch?v=yhhyFO6hSTs


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
