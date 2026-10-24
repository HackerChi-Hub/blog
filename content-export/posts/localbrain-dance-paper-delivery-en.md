---
title: "Did Local27B turn 'Bear Trembling Fur' into a paper? 22 minutes and 9 seconds, what did LocalBrain deliver?"
slug: localbrain-dance-paper-delivery-en
status: published
lang: en
translation_of: localbrain-dance-paper-delivery
translation_source: machine
source_sha256: 02adf7a0aeb38b48
date: 2026-10-17
updated: 2026-10-24
summary: "From \"Bear Trembling Fur\" to Motion Capture and Robotics: Examining Local 27B Submitted Word, 7 Pages PDF, and Unfinished Acceptance."
categories:
  - Tech
tags:
  - LocalBrain
  - Local models
  - Agents
  - Paper generation
  - AI transcript
cover: "/obsidian-assets/localbrain-dance-paper-delivery/cover-20261017-fusion-v1.jpg"
brand_slogan: 
legacy_paths: []
cover_status: "approved"
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/localbrain-dance-paper-delivery/) is authoritative.

What do "flash steps" and "bears tremble with fur" have to do with artificial intelligence?

If you post this sentence in a chat app, it would be like a sudden brain teaser thrown at me by a friend. But this time, I really handed it over to LocalBrain: complete a Chinese research paper from scratch, organize the materials, list the sources, and finally hand over editable Word and a readable PDF.

It's not just a few phrases about "technology empowering traditional culture" in the chat box. What I want to see is: can a model running locally handle such a cross-disciplinary and somewhat amusing question and deliver everything from file to paper?

The results were quite interesting.

The document included the original Word, a **7-page PDF**, and a task record of **22 minutes and 9 seconds, 18 rounds, 36 tool calls, and 2 failures**. The paper not only avoided the question of "what's the relationship between these two?" but also shifted the topic to motion capture, content recommendation, digital storage, and robot movement.

But don't rush to announce that "local AI is already conducting research." The final status of the same record is also the most noteworthy sentence this issue: **The task has stopped. **

This article lays out both the results and the unfinished parts. Don't hide the good parts, nor cover up the parts that don't pass.

## 1. The more abstract the question, the more specific the task requirements should be

"Writing a paper" and "delivering a paper" involve many tasks in between.

The former can stop at just one screen of text. The latter requires finding materials, judging whether the materials are usable, organizing the main text, arranging citations, generating documents, checking layouts, and also confirming that Word and PDF are the same version.

It's like having someone help you prepare a form: they dictate "how to fill it out," and it's completely different from filling out the form, matching attachments, and checking the signature position.

The requirements for this round of screen recording were straightforward: a Chinese research paper of about 5,000 words used at least 5 actual sources to be read, with at least 3 of them being official original sources; The main text citations corresponded to the source at the end, and verifiable URLs were retained; Editable files and reading versions were submitted, and existing documentation tools were used for verification.

Note, these are **requirements assigned to the model**, not transcripts. Writing "at least 3 official original sources" does not automatically satisfy the final document.

![Review Recording](https://hyphentech.top/obsidian-assets/localbrain-dance-paper-delivery/task-request.jpg)

[Play Review Recording | Task Requirements](https://hyphentech.top/obsidian-assets/localbrain-dance-paper-delivery/task-request.mp4)

This segment preserves the original speed and audio, corresponding to the original recording **03:40—04:05**. You can directly verify the requirements I gave without just looking at the transcript.

In the recording, you can see that LocalBrain version is **1.9.1**, and the top of the chat shows **Swift-1.5-4bit**; The author classifies this round as part of the local 27B user experience in the explanation. This article retains this context and does not further expand the interface abbreviation into a full weight configuration without record support.

I didn't rerun the model just to write this article. Here, I'm showing the original transcript and actual preserved version, not using the time and results from another test to supplement the score.

## 2. It actually found contact, and not just by force

![Process Diagram | Thesis Tasks](https://hyphentech.top/obsidian-assets/localbrain-dance-paper-delivery/paper-process.png)

Let's first look at the question itself.

These two names sound like spontaneous internet memes, but behind them are specific folk dance origins: "Bear Shivering Fur" comes from Shandong drum yangge, "flash steps" from Anhui Huagu Lantern. The Paper interviewed a Beijing dance professor involved in the textbook recording, explaining that these are originally professional teaching movement elements, not moves invented by netizens out of thin air. [Report and Interview](https://m.thepaper.cn/newsDetail_forward_34187632)

In other words, the model is not facing two meaningless words. It needs to connect "what looks fun online to see" back to "what the body is actually doing," and then find technical intersections.

The preserved papers mainly connect three threads.

### First: Turn dance movements into analyzable data

When watching a dance video, people notice whether the rhythm, expression, and movements look good. To analyze movements, computers usually need clearer information: at a given moment, where the shoulders, arms, and knees are, and how the body's center of gravity moves.

This is part of the problem that "motion capture" aims to solve in the article. You can think of it as creating an "action roadmap" for a square dance segment that changes over time: not only does it keep a video, but it also records how key parts move, making it easy to review, compare, and reuse.

This analogy only helps understand data-driven understanding; it cannot simplify artistic expression into a few coordinates. Even if teachers and beginners jump out of the same action route, the charm may still differ greatly.

The paper cites an article from the Chinese Social Sciences Network on the digitization of intangible cultural heritage. The original article indeed introduces a case study by the Yunnan University "Mocap Action Butler" team using motion capture and artificial intelligence to convert ethnic dance resources into multimodal 3D data. [Original Text](https://www.cssn.cn/mzx/xksy_lswh/202601/t20260106_5968160.shtml)

This supports "dance digitalization and AI intersection in practice," but it cannot be further written as "these two specific movements have already been collected and applied by the project." **General technical cases and specialized experiments on current topics cannot be swapped. **

### Second: beyond the action itself, there is also a system that spreads it

Why does a professional tutorial video appear on the phones of so many ordinary people?

The paper shifted the topic to recommendation systems: platforms distribute content based on viewing and interaction signals, so dance segments that were originally niche may reach a broader audience.

For readers with no prior experience, you might first think of a snack shop familiar with your taste. If you order spicy food several times in a row, the staff might prioritize recommending new spicy items next time; Content platforms also infer interests based on user behavior, but they handle far more people, content, and signals.

The problem is, even explaining this mechanism is not enough to prove that "a single viral hit was caused by AI." Subject matter contrasts, imitation thresholds, creators re-editing, and audience sharing can all be involved.

Here, the paper has directions worth further investigation, and also a tone that needs to be retained. **"The recommendation system involved in dissemination" aligns better with existing evidence than the idea that "the viral phenomenon itself is a product of AI algorithms." **

### Rule 3: Think about how humans move, and how robots move

![Original Paper | Related Arguments](https://hyphentech.top/obsidian-assets/localbrain-dance-paper-delivery/paper-page-4.png)

Keeping the original page is to show you what the model actually wrote: the tone of "going viral itself is ......" is clearly stronger than the evidence we can currently verify. Don't accept everything just because it is included in the paper.

"Dodge step" involves shifting the center of gravity, while "Bear Trembling Fur" involves full-body coordination. The model further links these issues to robot motion control.

This association is easy to understand: whether a person can stand steadily or a robot can stand steadily depends on body position, support, and coordination. But robots need to manage their own joints, drive, and contact conditions; they don't just copy human action videos and jump.

It's more like watching a chef skillfully toss the wok and then trying to have a robotic arm do the same. Videos provide references but don't solve problems like the pot's weight, wrist strain, or how to flip the ingredients.

Therefore, this line in the paper is suitable as a basis for future research. It does not mean the robot has already been trained in this round, nor does it mean LocalBrain has conducted motion control experiments.

Connecting these three lines, the problem becomes more than just a puzzle: **How to preserve movement, how to spread content, how to control the body. ** This is also where the real value of this output is—the model helped organize an entertainment entry point into a problem map that can be further verified.

![Original Paper Draft](https://hyphentech.top/obsidian-assets/localbrain-dance-paper-delivery/paper-page-1.png)

[Play Review Recording | Open Paper](https://hyphentech.top/obsidian-assets/localbrain-dance-paper-delivery/paper-review.mp4)

This segment corresponds to the original recording **05:20—05:45**, showing the actual process of opening the reading version. You can view the layout and content, but it does not serve as proof that the academic quality of the paper has passed.

## 3. What really makes the task longer are the tasks behind the chat window

If you only look at the final PDF, it's easy to underestimate the process.

This round involves writing content, operating document tools, and handling citations and reading versions. The model writing a paragraph is just one part of the process.

The so-called "tool call" can be understood as the model issuing specific work orders to the tool. For example, you might assign a paragraph to a document tool for formatting, or request the tool to read a webpage, then decide the next step based on the returned result. It doesn't mean that just saying "I checked" in text counts as having actually checked.

This is also the practical significance of integrating local models into LocalBrain: advancing "being able to provide advice" toward "being able to do part of your work environment."

But after connecting the tool, new problems arose. The tool might fail, the file might have been generated but failed to pass checks, the model might have modified Word but hadn't had time to update the PDF in time. Just because one step has a receipt doesn't mean the subsequent steps will succeed.

The time breakdown in the screen recording makes this point very intuitive.

![Data Redrawing | Task Time Required](https://hyphentech.top/obsidian-assets/localbrain-dance-paper-delivery/paper-time.png)

These numbers come from the task interface; summing the displayed values is affected by rounding, not an additional underlying performance analysis.

The most striking thing is output time: nearly half of the total time. If you only see "tool 51 seconds," you say the whole thing was mainly done by the tool, which doesn't fit this record.

Conversely, this breakdown cannot be used to calculate how many characters the model generates per second. Multi-turn tasks include both contextual processing, generation, tool waiting, and failure handling. Knowing the actual input/output quantities at each stage is necessary for rigorous speed comparison.

**This round shows: the local waiting is real, but what you get is not just a chat reply, but a set of already documented documents. ** Whether it's worth it depends on how long you originally spent organizing these things and how much time you need to check them afterward.

## 4. The most crucial frame is not the first page of the thesis

This is the final state of this mission.

![Task Records](https://hyphentech.top/obsidian-assets/localbrain-dance-paper-delivery/task-status.jpg)

[Play Review Recording | Task Status](https://hyphentech.top/obsidian-assets/localbrain-dance-paper-delivery/task-stop.mp4)

This segment corresponds to the original recording **07:25—08:08**, retains the original speed and audio, and includes the result discussion and task end-state section. It does not cut out the "Stopped" section in the middle.

On the screen, the model first says "DOCX v2 has been saved (reference number corrected)," then prepares to recheck and generate a PDF. However, it clearly shows "This round has stopped" below and reminds that unconfirmed operations cannot be considered successful.

This isn't a screenshot that can be paired with "fully automatic closed loop, all passed."

Looking at the existing originals together, a very specific version issue emerges: the citation at the beginning of the Word text has changed to start from `[1]`, while the corresponding position in the PDF is still `[4]`.

This matches the process in the screen recording: "Word edited, subsequent PDF check not yet completed." As for whether there was another thoroughly updated document later, the materials provided this time cannot prove it, so I won't add it.

You can think of this as: the reimbursement application spreadsheet has been updated, but the printed attachments are still outdated. Just because both documents are present doesn't mean their contents are identical, and it doesn't mean the materials have been approved.

![Original Reference | Citation Number](https://hyphentech.top/obsidian-assets/localbrain-dance-paper-delivery/paper-version.png)

| This round of verification items | Situations that can be confirmed | Parts that still need to be checked |
| --- | --- | --- |
| Document products | Word and 7-page PDFs are available and readable | Check whether the two formats are exactly the same version |
| Content organization | It includes abstracts, main text sections, tables, and references | Whether the evidence supports each argument to the corresponding conclusion |
| References and modifications | There is a difference between the Word beginning numbering and the PDF | Final order, correspondence, and overall consistency |
| Execution process | It records 18 rounds, 36 tool calls, and 2 failures | No return of the final result of the operation |
| Final state | Stopped, records retained | It cannot be recorded as having passed the independent review without fail |

This process precisely explains why I require the task to keep failures and accurately indicate delivery status. Without this boundary, users who receive a fully formatted PDF can easily mistakenly think the entire task is complete.

## 5. Why does a papers with a website still need to be checked?

Now, let's take a step further into the content.

The thing that makes an AI paper most likely to lower your guard isn't necessarily the beautiful wording, but the list of seemingly formal references at the end.

![](https://hyphentech.top/obsidian-assets/localbrain-dance-paper-delivery/meme-paper.png)

The problem is, just because the references are listed together doesn't mean the evidence is used correctly. At least three things must be looked at separately.

![Original Paper Draft | References](https://hyphentech.top/obsidian-assets/localbrain-dance-paper-delivery/paper-page-7.png)

**First, whether the webpage can open is not the same as whether it is the original source. **

The archived draft contains government websites, media reports, reprint pages, and dynamic topic pages. Media reports can provide useful information, but when the task explicitly requires "official original sources," all reprints with the institution's name cannot be counted as original releases.

A common scenario: someone in the group reposts a school notice, and the message might be completely accurate. But you need to verify the registration deadline, and it's best to find the notice published by the school itself, not just the group repost screenshot. Similarly, the closer to the original release, the easier it is to verify the time, scope, and wording.

**Second, the numbers are very specific and may simply be dynamic data without a fixed standard. **

The original manuscript summary states a topic view count of "9.42 billion." The numbers are accurate to the decimal point and look convincing, but they correspond to the platform's topic page, which can change. There are no screenshots or replays of the independent platform at that time, so it is treated here as pending verification in the original manuscript and not used to endorse the article.

The original document in the screenshot retains this number to faithfully display the model product, but does not mean this article endorses it.

**Third, evidence that supports background does not necessarily prove all the inferences in the paper. **

Cases of intangible cultural heritage digitization can support technological application directions; They cannot automatically prove the reason why a particular dance meme has gone viral. Robots can study human movements, but they cannot automatically prove that these two movements have become mature benchmarks for testing.

The stronger a statement is, the more it should check for missing steps in the middle. Especially phrases like "already achieved," "inevitably caused," or "all passed," should not be accepted just because there is a citation number preceding it.

For those who actually need to use this material, I suggest following this order: first unify the Word and PDF versions, then check key data and citations point by point, and finally delete or downgrade conclusions that the evidence still can't keep up. Don't package a stopped task as an unattended research product.

## 6. So, is the local 27B actually useful this time?

![Verification Schematic | Correspondence of Evidence](https://hyphentech.top/obsidian-assets/localbrain-dance-paper-delivery/paper-evidence-chain.png)

Yes, and the purpose is quite clear.

If you're facing an unfamiliar topic and don't know where to start, it already demonstrates the value of helping break down topics, build structures, organize drafts, and generate documents. "Dance meme and AI" doesn't stop at empty cultural enablement, but breaks down technical issues that can be further verified.

If your goal is to treat this document directly as an academic result that completes the review, then this round of evidence does not support it. The task stops where subsequent checks have not yet confirmed; versions and arguments still have manual work.

There's also a confusing point: **Local models don't mean the entire research process is completely offline. **

The model runs locally, but data retrieval still requires network access; Tools, web pages, and document processing also have their own operating conditions. "Inference locally" cannot be casually extended to "all data is not localized" or "zero cost throughout the entire process." There is no independent network audit or billing for this time, so these commitments are not made.

For me, the most interesting outcome this round isn't that "AI can turn everything into a paper." If you really force it, anything can be pieced together into several paragraphs.

What's even more worth leaving behind are two things happening simultaneously: it did push a strange problem into a structured, documented document; The real record also exposed its unfinished inspection.

The direction for improvement is therefore very specific: more solid sources, more restrained judgments, more consistent document versions, and more reliable recovery after stoppages and failures. Only by filling in these gaps can "I can help" gradually approach "I can trust it with it."

This is much more important than just changing the chat box with a prompt like "professional academic assistant."

## Original and review entry points

Below is the original generated manuscript used in this issue, with version differences and content to be verified for reference reading; **Not an approved paper should not be submitted directly as an academic achievement**. For official use, please comply with the AI usage and authorship guidelines of your school, journal, or institution.

- [Download Word Original Document](https://hyphentech.top/obsidian-assets/localbrain-dance-paper-delivery/paper-original.docx)
- [Download PDF Original Document](https://hyphentech.top/obsidian-assets/localbrain-dance-paper-delivery/paper-original.pdf)
- [Dance Movements Origins and Textbook Participant Interviews](https://m.thepaper.cn/newsDetail_forward_34187632)
- [Original Case of Intangible Cultural Heritage Digitization](https://www.cssn.cn/mzx/xksy_lswh/202601/t20260106_5968160.shtml)

The above file link is for local draft preview and has not yet been released as a public downloadable resource.



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
