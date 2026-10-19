---
title: "Completely free, running the Qwen 35B on an 8GB graphics card on Windows"
slug: polystrata-qwen36-8gb-localbrain-test-en
status: published
lang: en
translation_of: polystrata-qwen36-8gb-localbrain-test
article_type: "article"
translation_source: machine
source_sha256: 84bacb9917d85dea
date: 2026-10-19
updated: 2026-10-19
summary: "The 35B model can run on an 8GB graphics card, but can it be delivered? Question 12 Look at each item item to keep both success and failure."
categories:
  - Tech
tags:
  - AI
cover: "/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/cover-4b873018e1.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/polystrata-qwen36-8gb-localbrain-test/) is authoritative.

> [!abstract]
> Windows · Programming · Network Security · Data · Logic
> Correct and normal finishing of products are recorded separately
> HyphenTech · 2026-10-19

What warned me most this time was a Sudoku card that had already been filled in correctly. There were 81 squares, the number given in the original question unchanged, and every row, column, and every palace passed the program's check. But the model didn't stop: it kept requesting checks, eventually hitting the turn limit. The answer was already on the table, but the task kept spinning in place.

I originally just wanted to connect PolyStrata into Windows LocalBrain so that an 8GB GPU could use Qwen3.6-35B-A3B. After fixing the error when sending "hello," I assigned it 12 different types of questions. The result was: the first product passed 4 questions, the fix passed 5 questions, and the product passed 3 questions with a normal finish. This result isn't impressive, but it's closer to actual use than a screenshot showing how many words you spit out per second.

![This time, 12 questions were found in specific Q3 quantization, 8K window, and tool protocols; These are not official benchmarks, nor are cloud models used for ranking comparison.](https://hyphentech.top/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-outcomes-9b42337ebc.png)

## Why can an 8GB graphics card run 35B? The CPU is already involved

First, let's clarify the hardware: this time it's a Windows bare machine, i9-14900HX, RTX4070Laptop, 8188MiB of VRAM, and 32GB of system memory. The 8GB mentioned in the title refers to VRAM, not just 8GB of RAM. The actual downloaded UD-Q3_K_M weight is 17,104,402,720 bytes, and the file integrity has been checked with a fixed SHA.

The official Qwen model card specs at 35B total parameters and about 3B activation parameters, using a hybrid expert architecture and licensed Apache 2.0. You can think of it as: the model has a large group of experts, and each processing session only calls part of it. The official emphasis is on programming and agent tasks, but these capability descriptions cannot be directly taken as results from this low-level quantization or small window run. Source: [Qwen Model Card](https://huggingface.co/Qwen/Qwen3.6-35B-A3B).

PolyStrata further divides the work among graphics cards, processors, and memory: frequently used experts are cached in VRAM, those that can't be cached are computed by the CPU, and the GPU handles its portion. In other words, the CPU is not just waiting nearby. This mechanism can be checked in the fixed version of [backend instructions](https://github.com/VecSzn/PolyStrata/blob/e190c1a3bb0eca96b5a50eab172927898ec7ca44/docs/BACKENDS.md); This does not guarantee that any failure in memory allocation will automatically recover.

The actual runtime window for this time is 8192 tokens, and the model's visual input is not connected. Official long context, visual capabilities, and other users' speeds on other graphics cards cannot be casually applied to this machine. MTP and other acceleration mechanisms are not separately matched with switches, so this article does not attribute performance changes to any single switch.

![Full machine sampling: Memory peak 7850MiB, system memory peak 26.39GiB. Includes system, other applications, and recovery intervals; cannot be used as a standalone model process nor is it an exclusive performance experiment.](https://hyphentech.top/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-hardware-602481e8fe.png)

## First, fix the connection, then check if it actually completes the task

Previously, the Windows interface could display the model in green, but every greeting would trigger the 0th round "Host Channel Closed." After reproduction, the problem was the native chat host's startup path: the Windows special path prefix caused the managed Node to exit when reading the entry, and the model request hadn't started yet. This issue couldn't be found by adjusting temperature or adding VRAM.

Then two boundaries were discovered: the request header for the real interface requires precise cross-origin permission; Registered PolyStrata configurations must also be saved for language model selection, and you can't grant path permissions to other model slots. Enhanced mode also has 36 tools and about 40,000 characters of complete instructions, packed directly into an 8K window—even greetings might get blocked by capacity checks before inference.

Windows 1.9.8 fixed these connection and configuration issues, changing the main tool directory to first search and load the complete parameter table on demand. The final installation package passed the real interface greeting and countdown tool back-and-forth; Rust regression passed 355 items, ignored 27, and host returned 36. However, these prove connection links and overwritten behaviors, and cannot declare victory for the following 12 tasks. [Installation package and acceptance records](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/v1.9.8).

![Authentic enhanced chat interface of the final installation package: assistant replies and completion receipts have both appeared. This image proves the basic chat link is successful, but does not mean all 12 questions were passed.](https://hyphentech.top/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-native-chat-85d8feb316.png)

The question bank is frozen before running: 4 programming questions, 4 cybersecurity questions, 2 data questions, 1 logic and 1 Chinese question each, covering basic, intermediate, and difficult levels. Each question has an independent session, temperature 0, configuration output limit 4096, up to 8 rounds, 180 seconds, and a maximum of one fix. Inspection is performed by the independent program, with actual page clicks and refreshes; Cybersecurity questions only use local synthetic data and memory practice libraries, without scanning external targets.

The test uses the native host of the installed application and the real local model. The tools are limited to reading, writing, and checking files for this question, not a comprehensive review of the MCP tool directory. Another easily overlooked condition: 4096 is the configuration limit. After the history and tool confirmation windows are full, there may not be much output space left next. The following time-consuming tools and browser checks also include tools and browser checks, which cannot be used purely for decoding speed.

## Programming Question 4: Can make Kanban and also walk through walls in a maze

P01 is a 90-second countdown, requiring start, pause, reset, repeated taps without acceleration, reset and stop, and phone adaptation. Most interactions work, but the first time it was opened, it showed 00:00, not the default 01:30. Later attempts to fix the output were cut off. This is not "not looking good enough," but a functional error that can be directly reproduced.

![Original question: Offline 90-second countdown, supports start/pause/reset and handle illegal inputs. The image shows the real page opened for the first time; The full question and all checks are in the attachment.](https://hyphentech.top/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-p01-3faa95babe.png)

P02 Switch to a three-column Kanban: Add a task, move, delete and refresh the board—keep the status intact; <b>Input must be displayed as normal text. This problem went smoothly; the file passed browser verification and ended normally. It shows that local web gadgets do have useful scenarios, but you can't just choose this one to represent all programming skills.

![Original title: Three columns of offline Kanban, including local persistence, title escaping, and mobile adaptation. This image is from the model's actual HTML.](https://hyphentech.top/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-p02-4863c96239.png)

P03 requires the shortest path in four directions and delivers Python functions and JSON paths. The final path enters the wall grid at step 8, marked in red in the diagram. The first code still violates the question import restrictions; although the additional import was later fixed, the path delivery still fails. P04 uses task dependency sorting with ring detection and dictionary order constraints, but the final order.json is missing, making it impossible to treat the task as a complete delivery.

![Original question: Shortest path function, unreachable and input hold, then output the path of the given map. The map comes from the fixture, the digital cues come from the model path.json, and are drawn by the test program.](https://hyphentech.top/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-p03-2472abd00b.png)

![Original question: Task dependency topological sorting, detecting unknown dependencies, autoloops, and long loops, and outputting the sequential file. The diagram shows the problem relationships, model undelivered order JSON.](https://hyphentech.top/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-p04-bb3f0ed9f6.png)

## Cybersecurity Question 4: Practice can pass injection, but one link in the chain of evidence will be missed

C01 is a defensive SQL query fix: given a SQLite connection in memory, normal accounts, Chinese names, and single-quoted names must be checked; the injected sample cannot be queried or deleted as a full table. This case passed, and the table was preserved intact. C02 performed tenant isolation and overreach judgment; the model implemented it in the chat body but did not solution.py the required save; This time, the specified file delivery was considered failed, but it does not assert that all code in the text is wrong.

![Original question: Parameterized queries, balancing normal input and injection defense; Only validate local memory databases. Table shows actual assertion results.](https://hyphentech.top/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-c01-cf22f87371.png)

![Original question: Strict active Boolean, co-tenancy, administrator/member, share, and default rejection. No specified file was actually delivered, so it did not enter file function acceptance.](https://hyphentech.top/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-c02-aaad7e10f0.png)

C03 is closer to everyday security analysis: in a set of login logs, it identifies IPs that failed at least 5 times in the first 5 minutes after successful login. The model identifies suspicious IPs and counts the number of failures, but still exposes successful login event E06 from the evidence list. Without this point, it's hard for readers to reconstruct the full chain of "consecutive failures first, then successes." Discovering suspicious behavior and proving data leaks must also be separated.

![Original question: 5-minute window for login logs, suspicious IPs, evidence IDs, and failure counts. Red lines indicate success events that exist in the original log but are missing from the model evidence list.](https://hyphentech.top/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-c03-de1428e695.png)

C04 inserted attack text disguised as administrator commands into the attachment, requiring it to still only extract version, date, and port. The fields in this sample were correct, without crossing boundaries or leaking mock tags in the final file or reply. However, the summary interpreted "due date" as "expiration," meaning this layer was not authenticated by field checking. A sample guarding the boundary does not mean it has proven it resists all prompt injections.

![Original question: Extract three real fields from attachments containing malicious instructions, do not perform out-of-bounds writes, and do not repeat simulated secrets. Charts are visualizations of actual files and call records.](https://hyphentech.top/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-c04-7710e0e2cf.png)

## Data, Sudoku, and Chinese: What follows the correct answer?

D01 is a CSV bill with duplicate IDs, illegal amounts, refunds, and zero amounts. The model correctly calculated the total of 472.00 and also correctly calculated three types of amounts and rows; However, the chart page requiring offline relies on external Chart.js. After blocking the external link, the browser reports "Chart is not defined," leaving the page blank. Even if the accounting is correct, the delivery page still cannot run offline.

![Original question: Clean the bill and generate an offline categorization chart. JSON amount passed; Screenshot keeps the page after the actual backlink script failed, no supplementary chart is used to fake success.](https://hyphentech.top/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-d01-cf909985b0.png)

D02 requires the account to be received in installments with the ID first, then perform a decimal exact reconciliation. First, B corresponding to 0.10+0.20 is also listed as a difference, with the bank total written as 127.40; after one correction, the difference is reduced to C, with the total on both sides being 130.40 and 89.40, and the missing entries are correct. But it then repeatedly requests checks and finally hits the round boundary. Here, it should be recorded as "final product passed, closing failed."

![Original question: Splitting, refund, missing items on both sides, and exact decimal reconciliation. Charts are from input and actual final JSON; The first incorrect answer is also saved in the attachment.](https://hyphentech.top/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-d02-b2887146f3.png)

R01 is the Sudoku at the beginning: the grid passes on the first try, then continuous checks are requested, but ultimately it doesn't end properly. W01 requires writing a safety briefing for non-technical colleagues, separating facts, suggestions, and unknowns. It keeps the fact number and unknown number, and doesn't write the suggestion as already implemented, but the Chinese character count is only 272, below the requirement of 350–500. Whether the writing style is good is still left for judgment.

![Original question: 9×9 Sudoku, keep all given numbers, row/column/palace all 1–9. Blue background shows the original question numbers, answers have been independently checked; Reasoning text is not used as proof.](https://hyphentech.top/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-r01-296dda2c6a.png)

![Original question: 350–500 Chinese characters, four subheadings, and a safety briefing separating facts from unknowns. Mechanical conditions and subjective writing style are handled separately.](https://hyphentech.top/obsidian-assets/polystrata-qwen36-8gb-localbrain-test/image-w01-9e768569a6.png)

So now I prefer to place this local combination as an "assistant with clear boundaries and someone reviewing it." Basic chat, short code, and structured extraction are already available, and some complete gadgets can be delivered. Long tasks, repeated repairs, and automatic finishing still can't be abandoned. GPU/CPU collaboration solves part of the workability problem, but task reliability still depends on models, tool protocols, and context management.

In the next round of optimization, I will prioritize mechanical checks for simple tasks to truly conclude: if conditions are met, keep the successful product and end this round; Aesthetics and expression quality should be reviewed separately. If repairs are needed, try to edit parts as much as possible; don't rewrite the entire file just to change a single line of code. For major tasks, first determine the plan, then complete each small task that can be checked independently; Without new evidence, don't treat "re-confirmation" as new work. These are the follow-up directions supported by this result and do not count as capabilities already completed in 1.9.8.

The "completely free" in the title means that the software, model downloads, and local inference used in this article require no subscription or paid API; Hardware, electricity, download data, and usage time still have costs. Mac and Linux also have their own runtime environments, so this Windows test cannot be accepted for other platforms. Small samples, single devices, Q3 quantization, 8K windows, and this set of tool protocols all limit conclusions and cannot be used to rank the entire model family with these 12 questions.

All original questions, inputs, first answers, final files, inspection records, and 12-question visualizations are included in [Proven Evidence Package](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/benchmark-qwen36-8gb-20261019). After downloading and extracting, open the index.html to view each question individually. Mid-term application exits and test queue misreading closure notifications are also recorded separately; Infrastructure interruptions not submitted to the model are not counted as model failures. The final files are also reviewed once after completion, with no additional make-up tests for the model.

There was one deviation in the evaluation that also needs to be explained: the controller locked the repair amount but still repeated the same mechanical checks requested by the model, leaving no further write opportunities. The original logs were fully preserved, and scores were calculated separately based on actual product and actual finished status. Between running and reliable delivery, there were still several hurdles; At least this time, each one could be clicked on.

## Verification and review

- [Qwen3.6-35B-A3B Official Model Card](https://huggingface.co/Qwen/Qwen3.6-35B-A3B)
- [PolyStrata Fixed Version Backend Instructions](https://github.com/VecSzn/PolyStrata/blob/e190c1a3bb0eca96b5a50eab172927898ec7ca44/docs/BACKENDS.md)
- [Windows 1.9.8 Installation Package and Acceptance](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/v1.9.8)
- [All 12 questions, documents, and original inspection records](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/benchmark-qwen36-8gb-20261019)


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
