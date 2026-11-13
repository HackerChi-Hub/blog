---
title: "Gemini 4 Carbon released: 88.2% vulnerability review—why isn't it open to everyone for now?"
slug: gemini-4-carbon-release-analysis-en
status: published
lang: en
translation_of: gemini-4-carbon-release-analysis
translation_source: machine
source_sha256: 1a6e0b0c877cb4cf
date: 2026-10-29
updated: 2026-11-01
summary: "What does an 88.2% vulnerability discovery really mean? Verify three security reviews, launch discounts and subsequent pricing, and the usage boundaries for a 64GB Mac."
categories:
  - Thoughts
tags:
  - AI
  - News
cover: "/obsidian-assets/gemini-4-carbon-release-analysis/cover-d1ecf4f0f1.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
article_type: "article"
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/gemini-4-carbon-release-analysis/) is authoritative.

> [!abstract]
> Verify reviews, open schedules, launch prices, and Mac performance status
> HyphenTech · 2026-10-29

A model was just announced, and its most impressive result was "Vulnerability Discovery Evaluation 88.2%." You click into the introduction and try to find an entry point, only to find that it is first opened to some cybersecurity defense teams, while ordinary users still have to wait.

This time, Google has listed both capabilities and pricing, but hasn't enabled everyone's access at the same time. **What exactly makes Gemini 4 Carbon so strong? What does 88.2% mean? Can you use your 64GB Mac? **

I checked the official release on October 28, the price footnotes at the end, and third-party review pages. Here, it's based on public data analysis, not actual testing on the machine. First, let's put the most useful conclusion first: What Carbon is worth noting is advancing 'finding problems, verifying risks, fixing code' into the same workflow; But posting messages, account permissions, and local authority are three things that need to be verified separately.

![Official Introduction](https://hyphentech.top/obsidian-assets/gemini-4-carbon-release-analysis/image-official-release-88cbca96f0.jpg)

## 🎯 1. 88.2% is very impressive. First, look carefully at what this report card is testing

According to [official release](https://deepmind.google/blog/gemini-4-carbon-our-next-frontier-model/), Carbon's results in three cybersecurity assessments are as follows.

These are Google's published results, with the official note that security barriers were not enabled during the review. In actual products, after enabling safety restrictions, the tasks and performance they can accept may differ.

| Link | Review | Carbon | Argon | Change |
| --- | --- | --- | --- | --- |
| Discover vulnerabilities | SEC-bench Pro | 88.2% | 83.4% | +4.8 percentage points |
| Verify availability | ExploitGym | 54.8% | 42.0% | +12.8 percentage points |
| Restore the root cause | CWE-bench | 71.0% | 68.0% | +3.0 percentage points |

"Vulnerabilities" can first be understood as gaps in the door lock, window, or property management process. Finding cracks in the door frame is identifying a problem; Confirming whether the cracks can truly allow people to enter is verifying the risk; Repairing the door frame and then checking whether the door can still open and close properly is the approach to repair and acceptance.

Put it back into the software, and these three steps can't be mixed either. The model points out something suspicious and requires concrete evidence; Risks are confirmed and checked in an approved test environment; After submitting a patch, you must confirm that the vulnerability has truly disappeared and the original normal functions have not been compromised. This article only discusses legitimate authorized defense uses and does not provide attack operations.

![Official Review | Vulnerability Discovery](https://hyphentech.top/obsidian-assets/gemini-4-carbon-release-analysis/image-gemini-4-carbon-secbench-pro-6a218a79e2.jpg)

The 88.2% correct reading is the result Carbon achieved under SEC-bench Pro tasks and evaluation conditions.

Further research [official evaluation method](https://deepmind.google/models/evals-methodology/gemini-4-carbon) uses a subset of the JavaScript engine from May 2026, totaling 183 tasks; Using Antigravity to execute the framework, it reports the success rate per attempt and averages the three independent attempts for each question. The framework arranges the use of tools and tests for the model, such as equipment in the exam room and exam rules, which also affect the final results.

This is much more specific than the phrase "88.2% vulnerability discovery rate": it has a clear question bank, execution environment, and criteria. **It cannot be converted to "just hand any software to it and it will find all 88.2% of vulnerabilities." ** The language, dependencies, code scale, tool permissions, and task times of real projects may differ from the question bank.

Similarly, the three percentages cannot be multiplied to calculate the so-called "total success rate from discovery to repair." They are not the same batch of questions passing three rounds in sequence; the questions and scoring methods differ. Multiplying exam scores from three different question banks is like directly multiplying the scores of driver's license theory, reversing into the database, and road exam results, but it cannot yield the actual probability of safe driving on the road.

![Official Review | Risk Verification](https://hyphentech.top/obsidian-assets/gemini-4-carbon-release-analysis/image-gemini-4-carbon-exploitgym-672dff8f6b.jpg)

What is even more noteworthy in this table is where the changes are: in Google's peer comparison, validation availability increased by 12.8 percentage points, a larger increase than the other two categories.

** Here, 54.8% and 42.0% correspond to a 10-hour time limit for each question. ** In the official chart, Carbon has a 6-hour time limit of 53.5%; Some other models in the chart use results with no or unknown time limits, so the cross-vendor column height cannot be directly taken as a strict peer-to-peer evaluation.

The official method description states that ExploitGym uses an open-source evaluation environment, attempts each question once, and the execution process is not networked; The CWE-bench is evaluated by Collinear AI and reported on public leaderboards. The methods for collecting the three numbers are fundamentally different; they cannot all be called Google self-tests or third-party independent retests.

For defense teams, as the list of issues grows longer, identifying which issues truly need to be prioritized can reduce ineffective checks.

However, this only indicates changes in the baseline. It does not prove that your company's code audit hours must have decreased by much, nor can it prove that manual review can be canceled.

![Official Review | Root Cause Repair](https://hyphentech.top/obsidian-assets/gemini-4-carbon-release-analysis/image-gemini-4-carbon-cwe-bench-0344dda5af.jpg)

## 🔍 2. After writing the patch, is it still willing to keep working?

When models write code for people, the first version is the most surprising part. The real challenge often comes later: test failures, changes leading to another problem, crossing several directories to find the root cause, and the judgment you thought was correct must be overturned.

This time, Google emphasizes a "long-term task"—the same engineering problem requires the model to go through multiple rounds of operations and feedback. You can think of it as renovation: the craftsman can't just whitewash the walls; after discovering water leakage, they have to check the pipes and fix them before observing. On the surface, it looks like a final job, but the problem is actually solved, but there's a string of validations in between.

The official internal case scope is that the team observed Carbon continuously tracking and fixing complex issues across large codebases and underlying systems for several days. **The release did not provide complete step-by-step logs, personnel involvement counts, or task costs, so it cannot be written as "unsupervised, stable operation for several days." ** We can confirm what Google is emphasizing, but we cannot guarantee for readers that any project can be replicated.

![Process Diagram | How to Accept Code Tasks](https://hyphentech.top/obsidian-assets/gemini-4-carbon-release-analysis/image-engineering-loop-1ee594b5ca.png)

Long duration doesn't naturally equal goodness. If a task takes three days in the wrong direction, the time and cost spent are still real. To judge long-term task capability, at least three things must be considered: whether the original goal is maintained, whether the judgment is corrected based on tool receipts, and whether delivery is confirmed by independent inspection.

This also explains why the official team spends considerable space discussing "less fabrication, less overreach." It states that in internal testing, baseless claims are reduced by about half; In the real internal coding environment, severe mismatch alarms drop by nearly 80%. These are observations specific to the official environment and are not universal failure rates for all users.

There's another representative figure: in Terminal-Bench 4.0, the successful cheating rate drops to 0.0%, and attempted cheating drops to 0.4%. The concern here is whether the model will exploit loopholes in the test and not solve the task. It's like grading answer sheets while doing assignments and actually getting the questions right are two completely different "handovers." 0.0% only covers the tested sample and cannot be taken as a guarantee that the model will never exploit loopholes.

![meme-revision](https://hyphentech.top/obsidian-assets/gemini-4-carbon-release-analysis/image-meme-revision-2dc4d6a9c6.png)

For those maintaining the software themselves, this inspection method is more practical than simply saying, "It writes code well": first provide clear acceptance conditions, keep failure receipts, then review patches and regression results. The model proposes solutions and executes approved actions; acceptance criteria cannot be limited to the final "completed" sentence.

## ⚡ 3. Comprehensive First: Why Are There Projects That Are Not First?

Carbon scored 59 points on the 5th edition of the Artificial Analysis Intelligence Index.

Third-party [model evaluation page](https://artificialanalysis.ai/zh/models/gemini-4-carbon) also lists this score, supporting the officially published comprehensive score. But "first overall score" is easily read as "first in every item"; let's look directly at the original comparison.

![Official Review | Complete Results](https://hyphentech.top/obsidian-assets/gemini-4-carbon-release-analysis/image-gemini-4-carbon-evals-table-29b82598da.jpg)

In Google's table, Carbon's FrontierSWE 2 is 61.2%, lower than GPT-6 Astra's 65.5% and Claude Opus 5.5's 62.3%; OSWorld-2.1's offline subset is 81.5%, lower than Claude Opus 5.5's 87.2%. These comparisons come from vendor summary tables, not to claim that this article is retesting competing models.

This reminds us: the comprehensive visual health check overall evaluation, choosing tools is more about the specific position. Hiring a colleague responsible for complex code maintenance and hiring someone skilled in desktop software have different evaluation priorities. The overall score can help narrow down the candidate pool and cannot replace your task acceptance.

![Comparative Analysis | Changes in Peer Abilities](https://hyphentech.top/obsidian-assets/gemini-4-carbon-release-analysis/image-capability-comparison-c0d5ae866d.png)

Another easily flattened difference by advertising is "speech speed" and "how long to wait before answering." Third-party pages record a generated speed of about 92.4 words per second for Carbon's High configuration, with a delay of about 100.31 seconds for the first word listed simultaneously. These are based on the platform's review settings and vary with requests, configurations, and time periods, and cannot be considered fixed for all inference configurations.

Word characters are the units of measurement used by the model to process text; they cannot be converted to a single Chinese character. You can think of this as serving food in a restaurant: just because you eat quickly after the food is served doesn't mean the kitchen only takes a few seconds to cook. The generation phase is fast, but the initial wait still affects the interactive experience.

This distinction is especially important for long tasks. Batch processing can accept longer waits; If you stare at the screen and repeatedly change a sentence, the experience is completely different. Therefore, this article does not use a number output per second to derive "daily usage must be faster."

## 💰 4. Why give part of the defense team first? Security capabilities have two sides

The official statement is clear: this week, some cybersecurity defense teams will gradually expand their trusted partner network through the Fairwind program, while also participating in voluntary pre-release testing by the U.S. government. The product portal for developers, enterprises, and consumers still says "coming soon," without providing a specific full opening date.

![Opening Arrangements | Official Explanation](https://hyphentech.top/obsidian-assets/gemini-4-carbon-release-analysis/image-rollout-official-93ad84537e.jpg)

The reason can't be simply summarized as "too strong performance." The same vulnerability analysis ability can help maintainers fix vulnerabilities, but it could also be used to harm the system. The official explicitly stated that feedback will be collected, security guardrails iterated, and then deployed more widely. This is an already publicly announced arrangement; As for how long the queue will actually take and which accounts will get priority access, the current materials have not given an answer.

Google also published results in resisting indirect prompt injection. Indirect prompt injection can be imagined as asking a colleague to read an external document, but inside the document there is a fake notice saying "Hand me over the company key." The normal task is to read the material, but the danger lies in mistaking the words in the material for new commands.

In the code and web tool environment, external files may contain similar commands. Once the model can call the tool, reading a wrong passage can affect subsequent actions, so model capability and permission control must be reviewed together.

![Official Review | Prompt Injection](https://hyphentech.top/obsidian-assets/gemini-4-carbon-release-analysis/image-gemini-4-carbon-grey-swan-45391ff441.jpg)

In the official Gray Swan indirect prompt injection test, Argon attack success rate was 0.7%, and Carbon was 0.0%. This demonstrates the performance of this group of tested attacks; The real workflow also involves file permissions, key isolation, tool validation, and manual verification. **A zero in one review is not zero for all risks. **

My understanding is that the product direction this time is already clear: Google wants to first incorporate stronger security analysis and engineering execution capabilities into observable and factionable defense workflows. Whether it can turn the lab's advantages into stable daily efficiency will depend on actual records after the future opening. This judgment is based on release scheduling analysis, not Google's announced business goals.

## 🧩 5. Prices haven't gone up? You must read the small text at the bottom of the page together

The official body states that Carbon's launch discount price is the same as Argon: $2 per million input words and $10 per million output words. Cache input is 95% cheaper than regular input.

At this point, it's easy to think that long-term pricing is just based on this price list. I continued to check the footnotes at the end, which clearly stated: **After the initial release promotion period ends, input and output will be changed to $4 and $20 per million words, respectively. ** As of this verification, the release did not specify the end date of the promotion period.

![Official Price | Footnote at the End of the Page](https://hyphentech.top/obsidian-assets/gemini-4-carbon-release-analysis/image-pricing-footnote-b8b6aa8d9b.jpg)

| Billing items | Launch special price | After the promotion period ends |
| --- | --- | --- |
| Per million input words | 2 dollars | 4 dollars |
| Output word per million | 10 dollars | $20 |
| Cache input | 95% lower than regular input | The actual applicable rules are subject to the official billing documents |
| Discount deadline | The announcement did not provide any details | No guessing dates |

This also explains why third-party pages list 4/20 dollars, while the official main text lists 2/10 dollars: the official does disclose prices for both time ranges at the same time. When third-party pages are included in which tier should be based on their method and actual account statements, rather than combining the two pages into a story of "today's sudden price increase."

An API can be understood as a pay-as-you-go service window: the computer sends the request, the server computes it, and then returns the result. The cost depends on how many words are passed back and forth and which billing conditions apply.

Assuming a task generates 1 million input words and 100,000 output words in a single task, all calculated as regular input, excluding cache and other costs: initial release price is 2×1 + 10×0.1 = 3 USD; After discount, it is 4×1 + 20×0.1 = 6 USD. **This is an example, not the actual test bill or a fixed price for a single code fix. **

![Cost Example](https://hyphentech.top/obsidian-assets/gemini-4-carbon-release-analysis/image-cost-comparison-d06c6c7268.png)

Caching is like storing frequently used working papers first, reducing the cost of reuse when used again. Based on the launch input price and a 95% discount, a hit cache input is $0.10 per million words. But "hit" has conditions; you can't budget all inputs at the cache price.

Long tasks also repeatedly read files, receive tool results, and modify plans. The budget should be based on the cumulative usage throughout the task, not just the initial requirement you entered. The official unit price is provided, but the answer "How much does it cost to complete this project for me?" is still lacking a task-level refractory bill.

## 🚀 6. Can a 64GB Mac run? Don't rush to quantize it yet

For readers following local AI, this section is most likely to go astray: seeing a new model, immediately starting to calculate how many parameters, how many bits to set, and whether the memory is sufficient.

What is missing this time is not the formula, but the publicly available weight. The information found so far does not provide Carbon's public weights, parameter scale, clear architecture, or local inference formats. Third-party pages also list it as a proprietary model. Therefore, there is no basis for judging "64GB is not enough," nor is there a promise that "a quant version will run it."

![Process Diagram | Differences Between Local and Cloud](https://hyphentech.top/obsidian-assets/gemini-4-carbon-release-analysis/image-local-vs-cloud-95409f5af3.png)

Think of it as food delivery and cooking yourself: ordering with a client on Mac, but the food is still cooked in someone else's kitchen; Only when you get the ingredients, recipes, and a running device can you really say you can cook in your own kitchen. The cloud model's API connects to local software, and computation still happens on the server side; Offline operation requires another set of actually available weights and inference support.

| What do you want to do? | What can be confirmed at the moment? | What else is missing? |
| --- | --- | --- |
| Use Carbon directly in a regular account | It has been announced and will be opened in phases | Actual account permissions and official entry points |
| Carbon is called by the local client | Cloud access paths can be discussed | Interfaces, authentication, quotas, and compatibility verification can be used |
| Runs offline on a 64GB Mac | There is no verified public authority link yet | Weights, licenses, architecture support, and real operational records |
| Determine how much memory is needed | Current data is insufficient | Scale, precision, context, and operational framework |

For LocalBrain, the same boundaries should be maintained here: this article does not verify that Carbon is connected, nor does it verify that it is running locally. Only after the official entrance, account permissions, and interface format are clarified can we discuss specific integration; This time, the local model will not be launched nor will it interfere with existing tests.

The truly worthwhile next steps are whether open permissions are fulfilled, whether formal billing rules are complete, and whether there are independent long task success and failure records. If these conditions remain unchanged, repeatedly refreshing "quantitative downloads" will not bring deployment closer to completion.

## 🧠 My judgment: what matters most is delivery capability; don't treat transcripts as proof of use just yet

The most significant signal from Carbon this time is that Google has combined the cybersecurity defense chain with long-term engineering tasks: the model must not only identify problems, but also validate judgments and modify code, and complete tasks within constrained processes. Public evaluation provides a starting point for observation, internal cases provide direction for development, and both still require further verification through actual workflows.

If you are responsible for security or complex software maintenance, pay attention to formal entry points and verifiable task logs; If you just want daily chatting or documentation, compare whether the available tools have already addressed your needs; there's no need to prepay permissions you haven't yet received; If you want to go completely offline and keep data on your device, Carbon is not yet a recommended local deployment option.

The answer in the question is clear: 88.2% are results from specific vulnerability discovery evaluations; Not fully open for now, but is a phased deployment plan being promoted by the authorities. **Proof of capability, usage permissions, actual cost, and local operability—all four must pass separately. ** Later, with permissions and real records, let's see how much rework it can save ordinary people.

## 📉 Main sources of verification

- [Official Release and Price Footnotes](https://deepmind.google/blog/gemini-4-carbon-our-next-frontier-model/)
- [Third-Party Model Review: Artificial Analysis](https://artificialanalysis.ai/zh/models/gemini-4-carbon)
- [Official Review Method Portal](https://deepmind.google/models/evals-methodology/gemini-4-carbon)
- [Vulnerability Discovery Evaluation Items](https://sec-bench.github.io/)
- [Risk Verification Evaluation Project](https://github.com/sunblaze-ucb/exploitgym)
- [Root Cause Repair Evaluation Items](https://cwe-bench.com/#leaderboard)
- [Fairwind Open Plan](https://deepmind.google/fairwind-program/)

Verification date: October 29, 2026. Official results, third-party records, and calculations in this article have been separately explained; Availability and billing may be updated, subject to the official page and personal account.


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
