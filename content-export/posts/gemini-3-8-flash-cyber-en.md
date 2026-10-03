---
title: "Google has developed a cybersecurity large model, but only a small group of people use it"
slug: gemini-3-8-flash-cyber-en
status: published
lang: en
translation_of: gemini-3-8-flash-cyber
translation_source: machine
source_sha256: a34f6adaae030b9a
date: 2026-09-03
updated: 2026-10-03
summary: "On September 2, Google released 3.8 Flash and 3.8 Flash Cyber all at once. Same core, two faces: one cheap and easy to use, accessible to everyone, the other specialized in fixing vulnerabilities but only for trusted defenders. What's interesting isn't who is stronger, but where this dividing line lies."
categories:
  - Thoughts
tags:
  - AI
  - Model releases
cover: https://hyphentech.top/obsidian-assets/gemini-3-8-flash-cyber/cover-1b462d9340.png
brand_slogan: 
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/gemini-3-8-flash-cyber/) is authoritative.

> [!abstract]
> Released on September 2: 3.8 Flash is accessible to everyone, 3.8 Flash Cyber is only for trusted defenders
> One core, two sets of envelopes
> HyphenTech · Official Announcement Verification · 2026-09-03

On September 2, Google released two models at once: Gemini 3.8 Flash and Gemini 3.8 Flash Cyber. The former is the mainstream model that is "fast, cheap, and can do anything," and you can use it today; The latter is a cybersecurity version dedicated to finding and patching vulnerabilities, sounding even more aggressive, but it only sends to a small group of "trusted defenders," and the vast majority can't even get into the application portal.

![Google official announcement page: Gemini 3.8 Flash and 3.8 Flash Cyber, September 2, 2026, with a "Gemini Security Officer" listed under the title](https://hyphentech.top/obsidian-assets/gemini-3-8-flash-cyber/image-blog-24f46ccbca.png)

This is already the third time Google has released Flash in six weeks—the previous 3.7 Flash was released in just three weeks. With such density, just looking at it as "a bit faster and a bit stronger" isn't that meaningful. What I focus on is another thing: **The same brain, why split it into two faces and hide the sharper one? **Where is this dividing line, and why is it drawn this way? That's much more interesting than benchmarking.

> [!tip]
> First, here's the conclusion: **3.8 Flash is a genuine, cheap upgrade, you can get it today; 3.8 Flash Cyber is unlikely to be useful—it's not that the technology is lacking, it's that Google deliberately doesn't give it to you. **The real product this time is that access boundary.

## 🧩 First, let's clarify: what are Flash, Cyber, and Fairwind?

Let's break down three words first. **Flash is the "volume-driven" segment in Google's Gemini family**—not the most expensive or powerful flagship, but the main model focused on speed and low price, used for bulk work. You can think of it as the signature dish with the highest turnover rate in a restaurant—not the most expensive table, but the vast majority of orders are from it.

**Cyber Edition is the same core version tuned specifically for cybersecurity scenarios. **The official positioning is very restrained: mainly targeting "vulnerability finding" and "automatic patching," and explicitly states **priority for defense while putting offensive capabilities (such as writing exploitative code) behind**. In other words, it is designed as a tool for the blue team (defenders), not to hand knives to the red team.

**Fairwind is the gate that distributes the Cyber version. **It's a new restricted access program set up by Google, targeting only 'trusted defenders'—the official list is government authorities, critical infrastructure operators, and software maintainers, who must apply and be recognized to receive priority access. If you're not one of these identities, you're basically outside the door. This gate is the main character of this time.

## ⚡ 3.8 Flash: Cheap hasn't changed, but it's starting to "work harder."

Let's start with the one everyone can use. In terms of price, 3.8 Flash uses the entry-level pricing of 3.7 Flash: **$0.75 per million input tokens, $3.75 per million outputs**. At the same price point, the improvements the official highlights focus on the ability to "do the whole thing yourself." The official also revealed a detail on the training side: both versions share the same core, which is developed through **long-running intelligent cycles of repeated self-evaluation and self-refinement**—not just feeding data and ending the work, but allowing the model to correct and iterate through rounds of tasks.

| Official benchmark | 3.8 Flash Performance | What kind of ability are you talking about? |
| --- | --- | --- |
| DeepSWE v1.1 (Long-Range Software Engineering) | Surpassing most larger cutting-edge models | End-to-end autonomous solutions for complex engineering problems |
| HLE-Verified | 54.9% | Multi-step reasoning across STEM, humanities, and professional fields |
| Vals Finance Agent V2 | Over 3.7 Flash and other cutting-edge models | Analysis and reporting in the financial sector |
| Harvey Legal Agent benchmark | Over 3.7 Flash and other cutting-edge models | Professional autonomous tasks in the legal field |

> Data comes from Google's official announcement and is not an independent retest for this article. Benchmark settings and standards are subject to official methods.

But there's one thing you have to mention separately, because it affects your bill. The official statement states: the progress of 3.8 Flash comes from a core design — **"it's working harder"**. When facing complex tasks, it takes extra steps to reason, repeatedly invokes tools, and at high intensity levels, **to maximize performance, it uses more tokens. **

> [!warning]
> This sentence is put simply: ** The unit price hasn't increased, or even hasn't changed, but the same job might eat up more tokens, so the bill doesn't necessarily get "cheaper." **Google has also clearly laid out a fallback — for cost-sensitive scenarios, you can lower its "hard mode" or continue using the more economical 3.7 Flash (older models are still maintained). Saving money has shifted from model selection to adjusting parameters.

## 🛡️ 3.8 Flash Cyber: Its achievements were earned by trading Google's own code

Besides, there's something you probably can't even touch. The Cyber version's scores aren't farmed in demo environments; the official team directly reports its actual data from **Google's own code**, which is more practical than benchmark scores.

![Official "Real Results" section: Three sets of real-world test data from the Chrome security team, cloud vulnerability research team, and external security company Wiz](https://hyphentech.top/obsidian-assets/gemini-3-8-flash-cyber/image-impact-2de00d627c.png)

| Who is in use? | Test results | Comparison |
| --- | --- | --- |
| Chrome Security Team | The number of patches patched for vulnerabilities is 2.6 times that of the other side | Compared to the "much larger" best commercial models |
| Security company Wiz | Penetration test recall rates are 7.5–9.7% higher | Yet the cost is 2.3 to 5.2 times lower |
| Google Cloud vulnerability research team | In less than 2 hours, a critical underlying vulnerability was identified | Similar vulnerabilities usually require months of study |

> The above are official Google partner test data disclosed in official announcements; third-party benchmarks include CyberGym and Collinear CWE-Bench.

It also performs well on standard benchmarks: on the industry's vulnerability-finding benchmark CyberGym, its autonomous vulnerability detection reaches a cutting-edge level, surpassing the previous 3.5 Flash Cyber and significantly larger frontier models; Google also tested it on an internal benchmark covering **20 programming languages**, with a vulnerability discovery success rate of **over 70%**. In patching capability, on external CWE-Bench, its pass@1 is 47.2%, almost matching the leading frontier model's 47.8%, but at a much lower cost.

> [!tip]
> There's a counterintuitive detail worth remembering: the official statement says ** has undergone hard training in the extremely demanding field of cybersecurity, which in turn has also raised the coding and reasoning capabilities of the shared core. **Security isn't just a byproduct of this project; it's the 'whetstone' that strengthens the entire model.

## 🔍 Pouring cold water on three things: benchmarking, billing, and thresholds

Excitement aside, there are three things you shouldn't let announcements do. **First, all these scores are Google's own assessments. **The numbers for the Chrome team, Wiz, and cloud vulnerability research team are all official sources, and the specific questions about the "best commercial model" and "larger frontier model" are not fully explained in the announcement. It's not that it's fake, but it hasn't even been retested by an independent third party on the same set of questions.

**Second, "working harder" is a double-edged sword. **It's good for those who pursue extreme performance, but for those who pay per token, it's an invisible cost. Before actually entering production, you have to test the actual load yourself to see if the saved unit price is being eaten back by the increased token volume.

**Third, and most importantly—you basically won't need the Cyber version. **It's locked in Fairwind and only sent to trusted defenders. So those impressive vulnerability numbers are 'someone else's achievement' for most developers, not abilities you can get started with right away. This approach of 'giving strong capabilities to a small group of trusted parties first' was also supplied to governments, major clients, and ordinary users with a cut-down version of the antivirus engine's deep detection rules and advanced threat intelligence from certain security vendors—you have to watch it like a news watch, not a tool.

## 💰 Whoever earns, whoever is blocked at the door, who doesn't speak

Treat this release as a strategic move, and the results will be clear. **Who earns: Google. **It uses 3.8 Flash to firmly defend the "cheap frontier" mindset—releasing three times a row for six months, not leaving competitors a window for "I'm cheaper than you"; At the same time, it uses Cyber Edition and Fairwind to preemptively include government and critical infrastructure clients—who value security and are most willing to pay—into its network in advance.

**Who is kept out: the vast majority of developers and small teams. **You can use the "harder, possibly more token-saving" universal version; the truly sharp Cyber version that can dig up critical vulnerabilities in two hours, where you have to prove your identity even to queue. **For the first time, ability allocation is so clearly tied to "who you are." **

**Who doesn't speak: the cost account of that "more tokens." **The announcement puts the $0.75 unit price in the most prominent spot, with "it will use more tokens" written in the paragraph explaining performance improvements—both sentences are true, but readers' attention is drawn to the cheaper side. **The silent places are often where the bill truly hurts. **

## 🎯 Why is Google doing it now, and what is it looking for?

Why now? Just look at the pace: **The third Flash in six weeks, this is a way to secure a spot by releasing frequency. **In the AI cheap frontier, whoever can consistently be "fast, cheap, and not weak" will take over the developers' default choice. Google isn't releasing new features; it's welding this position tightly with intensive iterations, giving others no breathing room.

The Cyber version plus Fairwind is for something else—**before regulation is implemented, it first solidifies its identity as a "responsible provider of strong capabilities." **It actively pushes attack capabilities backward, tightens access permissions, and only sends them to defenders. This move is both a security posture and political capital: when countries set rules for AI security capabilities, a Google that "I've long been only providing defenses and helping governments patch vulnerabilities" will naturally be on the advantageous side. This front-running tactic is nothing new—**Back when ** the internet was just about to be regulated, big platforms were the first to shout "We are self-disciplined," using self-restraint to exchange for a voice in setting rules. **Restraint itself is a form of positioning. **

Looking at the bigger picture, this logic of "strong capabilities only given to trusted parties" keeps repeating. **Back then** encryption technology was so strong that the US treated it as an arms control and export restriction, only releasing it when civilian demand was completely suppressed; When nuclear-related technologies and some high-risk biological experiment data matured, the standard practice was to first create a "trusted list," and those outside the list could only hear about it, not use it. This time, Google locked AI's offensive and defensive capabilities into Fairwind, following the same old path: **the more likely something is to cause harm, the less its distribution is "to whoever wants it." **The only difference is that this time, what is being treated this way is a software model.

## 🧭 Should it be used, and how should it be used?

When it lands in your hands, the judgment is actually quite straightforward. **3.8 Flash is worth trying today**: The unit price hasn't increased, but tasks like long-range coding and multi-step inference that "let it do one thing on its own" are indeed more reliable. The interface is a ready-made Gemini API, which can be used in Gemini App Pro/Ultra subscriptions, AI Studio, and Antigravity. The only thing to watch is the bill—test token consumption with real load before production, don't just look at that $0.75 mark.

| Your situation | Suggestion | Why? |
| --- | --- | --- |
| Want cheap long-distance encoding/agents | Upper 3.8 Flash | At the same price point, it has clearly stronger self-reliance capabilities |
| Extremely sensitive to cost | Lower the intensity or continue using 3.7 Flash | 3.8 "More Effort" will earn more tokens, while older models will still be maintained |
| It is the government, infrastructure management, and software maintenance party | Apply for Fairwind | This is the only door to get the Cyber version |
| Ordinary developers want Cyber capabilities | For now, let go of your hopes | It only sends out trusted defenders and is not open to the public |

As for the cybersecurity board, accept this reality: **What you can read is its battle report, not its key.** **This isn't necessarily a bad thing—a practice that prioritizes the ability to dig and patch vulnerabilities to defenders, rather than just throwing them to everyone, at least is stable in direction. We just need to understand that from this point on, **the "strongest AI capability" and "can you use it" are becoming two increasingly mismatched questions. **

> [!summary] To wrap it up in one sentence
> This time, Google released more than just two models—it's a boundary: 3.8 Flash has tightened the cheap frontier, ready to use today, but remember to keep an eye on the token bill brought by 'working harder'; 3.8 Flash Cyber is more powerful and more effective, but locked in Fairwind only for trusted defenders. The real signal is—AI's sharpest capabilities are now being clearly allocated by 'who you are.'

---

## 📚 Sources and reproduction entries

- Google's official announcement "Introducing Gemini 3.8 Flash and 3.8 Flash Cyber": https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/
- Gemini API Developer Documentation: https://ai.google.dev/gemini-api/docs


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
