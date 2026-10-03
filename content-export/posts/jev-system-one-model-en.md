---
title: "This model doesn't write a single word, only answers \"Which one to choose?\""
slug: jev-system-one-model-en
status: published
lang: en
translation_of: jev-system-one-model
translation_source: machine
source_sha256: 46541785ca2b0b1a
date: 2026-09-20
updated: 2026-10-03
summary: "Jev doesn't generate text, only makes probabilistic judgments based on status. The official multiplier is impressive, but they put the exaggeration in their own footnotes; Free access on Vercel until September 25."
categories:
  - Thoughts
tags:
  - AI
  - Model releases
cover: https://hyphentech.top/obsidian-assets/jev-system-one-model/cover-22107b0e94.jpg
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/jev-system-one-model/) is authoritative.

> [!abstract]
> The official multiplier is written in its own footnote
> Free access on Vercel until September 25
> HyphenTech · 2026-09-20

First, let me explain how this article came about: **I didn't get the JEV API** (the official is still waiting in line for distribution), so this isn't my actual test. The demonstration and usage come from 01Coder (Little Wood) test video from September 18. What I did was **return every number and statement to the first-hand page and re-check**, and add some things not explained in the video—mainly the words the official wrote in the footnotes.

Jev is a model released by TypeSafe AI on September 15. It posted on Hacker News that day, **today it has 1917 points and 502 comments** (1679 points during video recording, and it has been increasing in recent days). Its uniqueness can be summed up in one sentence: **It does not generate text. **

You give it a "status" (a ticket, a dialogue, a JSON object), then a set of typed questions. It **parallels** answers all questions at once, each answer is predefined in type and includes a probability. The most intuitive way to play DOOM in the official demo is to have it play DOOM—about 10 decisions per second: forward, left, fire, or dodge. It reads the game state without looking at the screen, without saying a word.

![Comparison table from the official blog: The left column shows the familiar language models, the right column shows the new category it claims to be. Screenshot taken from typesafe.ai official blog (2026-09-15)](https://hyphentech.top/obsidian-assets/jev-system-one-model/image-compare-f094a5f890.png)

It only answers three types of questions: **Choice** (choose one from a given option, return the selected item + probability of each option), **Score** (score according to an ordered scale, such as calm/impatient/angry, return probabilities for each tier and interpolate the score), **Noul** ("Is this true?", returns a probability of 0–1; In Vercel's SDK, it's called boolean). The three types can be mixed in the same request, evaluated in parallel for the same state, without interfering with each other.

## 💰 Why are there people now making a 'silent' model?

This has to start with money. Today, there are many decisions in software that don't even need a single sentence: who to send this ticket, whether this comment is junk, whether the request should be given to a cheap model or a premium model. When using a language model to do this, you have to have it write an explanation, then a JSON, and then your code parses—slow, expensive, and possibly formatting.

**Who pays for this unread explanation? **Of course, it's the caller. According to the official standard: language model input costs $0.20 to $10 per million tokens, and output costs about five times more; while JEV inputs $0.042, **output is free**—because it doesn't even have output tokens. So the logic of this business is clear: separate "judgment" from word-based generation and make it a separate layer. **The beneficiary is the user who makes thousands of small judgments daily, but the cost falls on the person who outsources this layer**—your judgment logic will live on someone else's server from then on.

This script isn't new. Long before large models, these tasks were done by regular and rule engines; Later, machine learning classifiers were switched; And later, people realized 'writing a prompt can classify,' so they moved everything back to language models. Each round's selling point is 'more general,' and every round's price is 'slower and more expensive.' JEV is an attempt to push the pendulum back—**hand over generality, trade for certainty and speed. **

Vendors can see everything clearly: **They're competing for the interface standards of the 'decision layer.' **Vercel integrated it into AI Gateway on the second day of its release, using it directly behind the `auto()` of its own agent framework eve (which automatically selects one after several models and a description). Whoever defines this layer of call form stands on the path all AI applications must take.

## 🔍 The official multiplier is exaggerated by the official company itself

The two numbers on the homepage of the post page are quite impressive: **193.6 times faster, 444.6 times cheaper.**. **But if you scroll down the blog, the official team wrote a few lines in their Nuance section—I've picked them out one by one, because they're more weighty than any third-party question:

- Regarding those two multiples: "We expect these numbers to be at the **higher end** of the real returns"—that is, the homepage says the upper limit, not the actual reward.
- Regarding the control group: The data on the language model side **is taken from OpenRouter**, and the official team admits "there is almost certainly a bias."
- About the test caliber: The inputs used for this comparison are relatively short. The official statement states, "This **makes our model appear more advantageous**."
- Regarding the only disagreement question: In the recording with GPT-5.6 Terra, the only difference was the "possibility of loss," and the official self-assessment was that "the answer to that question is indeed ambiguous**."

> [!tip]
> **A company willing to discount its own numbers on its publishing page is worth noting in itself. **This process of "writing limits on the release page and shrinking after third-party testing" is not unfamiliar—last time was the local reasoning engine's "N times faster than anyone" promotion, where every company scored full marks on their own questions. But don't read it as "So the numbers are fake"—it's about the caliber: those multiples hold in their chosen workflows, but shrink in your scenario. The independent audits mentioned in the video follow the same direction: the official report is 20–400 times, but independent tests show 5–25 times; The official estimate is 70–500 milliseconds, while overseas tests show 1.6–3.7 seconds (network differences play a big part).

There's an even more important point: the official comparison table says "**Never produce type errors**" and "No hallucinations." The first half is true, and mathematically true—the output is constrained by the type you provide and can't run out. But the phrase "no hallucinations" needs to be broken down: **Type safety guarantees the interface, not the truth. **Back when function calling and JSON mode appeared, "structured output won't make mistakes" was also promised once, and that time it only guaranteed formatting—incorrect parameter filling, field fabrication, none of that was missing. It guarantees the answer is definitely one of the options you provide, not the correct choice.

![The post on Hacker News has accumulated 1,917 points and 502 comments today. Screenshot taken from news.ycombinator.com](https://hyphentech.top/obsidian-assets/jev-system-one-model/image-hn-3f9efceb4b.png)

And the core selling point of the entire product—**calibration** (when it says 80% accuracy, is there really an 80% accuracy rate)—is it precisely the hardest to verify right now: there is no publicly available calibration benchmark to verify. So this can only be summed up in a simple suggestion: **test with your own marked data. **

## 🛠 Get started now: free on Vercel, 5 days left

The official API is still being queued for distribution, but there's no need to wait—**Vercel AI Gateway has already been accepted, and it's now free. **I checked its model page: the price section says Free directly, context 32K, and the page clearly states '**Promotional pricing ends on September 25, 2026**. Today, September 20th, means there are still 5 days left in the free purchase window.

![Vercel AI Gateway Jev model page: Price Free, minimum call example on the right, blue bar below says promotion ends September 25. Screenshot taken from vercel.com](https://hyphentech.top/obsidian-assets/jev-system-one-model/image-vercel-d0432e9e53.png)

There's a pitfall to mention first: **It can't go through OpenAI-compatible endpoints**; it must use the AI SDK's `experimental_evaluate`. The model ID is `typesafe-ai/jev`. The smallest call is like the official example: pass model, state, questions, and retrieve answers and usage.

The real habits to change in usage are these three points, which are the exact opposite of the intuition of the large model era:

| Habits in the era of large models | Here's what should be done |
| --- | --- |
| First, ask about the category, get the answer, then decide on the next question | **Ask all questions at once**, including those that only make sense under certain branches—parallelism comes at no extra cost, and after returning, the code only takes the relevant ones |
| Let the model reason in a chain within a long context | Break down complex decisions into a set of atomic problems, ask them all at once, and leave the remaining logic to your code |
| Confidence thresholds are set everywhere | If you just want to choose the optimal one, **just pick the one with the highest probability**; The threshold is used only in one place—if it's lower, switch to manual (officially called confidence-gated routing). |

> [!warning]
> A detail that's easy to misread: **Noul has a probability close to 0.5, meaning 'yes' and 'no' are about half, not 'moderate'. **Similarly, high confidence only means the probability distribution is concentrated this time, but it doesn't mean the whole process is correct.

If you plan to have a programming agent like Claude Code handle it for you, the official team has prepared a skill:repository `typesafe-ai/skills`. I checked the timeline—**this repository was built on August 24, three weeks before the model release**, now it has 813 stars; The skill itself has only one `SKILL.md`, **exactly 149 lines**.

![Official skill SKILL.md, 149 lines. It's not an API manual, but a guide + teaching requirements + habit correction. Screenshot taken from github.com/typesafe-ai/skills](https://hyphentech.top/obsidian-assets/jev-system-one-model/image-skill-cf967b57a7.png)

Its writing style is worth copying: **not stuffing documents into context**, but instead creating a table of "what you want to read which page" for agents to read as needed (add `.md` after the document address to get the Markdown version); Then it teaches the agent how to break down requirements—deducting what needs to be made from "what the interface should display, what to choose, what to change"—**rule calculations, precise table lookups, and actions all left in the code**, only placing one question where semantic understanding is needed.

## ⚠️ When not to use it

- **Scenario Needing Explanation**: It doesn't give reasons, only probabilities.
- **Scenarios to Generate**: It doesn't write text. It's not meant to replace a language model—the model is responsible for generation, and it decides whether the segment can be published.
- **Scenarios with poorly designed options**: This is the most hidden. **If the correct answer isn't in the options you gave, the probability will still fall on the remaining options**—it must choose one. The official team admits the hard part is shifting from 'writing prompts' to 'designing decision-making patterns.'
- **Privacy-sensitive scenarios**: closed-source, hosted API, no weight. Some people in the community are already using Qwen's fine-tuned small models with calibration probabilities for open rights repeat printing. If you want to run locally, keep an eye on this line.

## 🧭 My judgment

This type of model solves a real problem: **We are indeed using a machine that can write novels to answer a true-or-false question. **Breaking this layer apart is the right direction. Vercel took over the day after release; The community list was also skyrocketing—during the video recording, it said there were over 40 projects. Today I counted a community list, which already has **161 entries** pointing to GitHub (there is more than one such list, and the list itself says "inclusion does not mean endorsement"). The pain point is real.

But I won't connect it to the critical path just because of the numbers on the release page, because of the above point: **The most valuable selling point (calibration) is currently the only one that cannot be publicly verified. **Cheap and fast is real, type safety is real, and whether the answer is right or not depends on your own data.

So there's only one method you can follow, and it's the most important thing to take away in this article: **Free before September 25, take your real classification or routing tasks, pick dozens of already labeled data points and run them through**, and compare the probability of your assigned data with yours—is the high-probability batch really more accurate? If it matches, then discuss whether to connect to the system; If not, you'll save more than just the quota for these days.

> [!summary] To wrap it up in one sentence
> Jev regressed the language model from "writing a paragraph" to "choosing an option": input $0.042 per million tokens, free output, no mistakes in type, but the official acknowledged in their footnotes that the two multiples on the homepage are the maximum revenue, the data was biased, and short input was in their favor. It's worth trying, but the core "calibration" hasn't been publicly verified yet—so take advantage of the Vercel free window (until September 25) to test it with your own annotated data, then decide whether to let it decide for you.

---

## 📚 Source

The framework, demonstration scenarios, and key usage points in this article are from 01Coder's hands-on video. Special thanks; All numbers, dates, and quotations in the text have been verified on the primary page, and all images are taken from the primary page rather than the video footage.

- TypeSafe AI official blog "Introducing System One Models & Jev" (2026-09-15): https://typesafe.ai/blog/introducing-system-one-models-and-jev
- Hacker News original post (on the day of publication): https://news.ycombinator.com/item?id=49717558
- Vercel AI Gateway Jev Model Page (Pricing and Call Examples): https://vercel.com/ai-gateway/models/jev
- Official agent skill repository typesafe-ai/skills:https://github.com/typesafe-ai/skills
- 01 Coder "Jev Test: The Basic Gameplay of This Popular Rapid Decision Model" (2026-09-18): https://www.youtube.com/watch?v=tYvu6IpSfiM


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
