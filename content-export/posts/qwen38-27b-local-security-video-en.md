---
title: "Becoming a hacker from scratch? Qwen 3.8 27B local security test, 184 tips on how to view them"
slug: qwen38-27b-local-security-video-en
status: published
lang: en
translation_of: qwen38-27b-local-security-video
translation_source: machine
source_sha256: 8bf1c07f164098f1
date: 2026-10-31
updated: 2026-11-01
summary: "LocalBrain 2.2.1, combined with Local Qwen3.8 27B, explains 184 component prompts for viewing, from target authorization and container tools to range and home equipment reports."
categories:
  - Tech
tags:
  - AI
  - Security
cover: "/obsidian-assets/qwen38-27b-local-security-video/cover-53826f77b9.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
article_type: "article"
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/qwen38-27b-local-security-video/) is authoritative.

If you put the model on your own computer and then have it check your home devices, what happens? I started Qwen3.8 27B in LocalBrain 2.2.1, first checked the local shooting range, then checked my Raspberry Pi and router. The most striking result was that the shooting range report showed 184 question prompts.

The numbers look lively, but what truly worth learning is how they come from, what evidence they correspond to, and what needs to be fixed next. Below, following this transcript, I string together the model, inspection tools, authorizations, and reports. All operations are limited to my own equipment, network, and isolated range; During practice, I only select targets I own or have clearly authorized.

## Start the model first, then ask what it can actually do

![Local Model Selection](https://hyphentech.top/obsidian-assets/qwen38-27b-local-security-video/image-model-0c5c625b9a.jpg)

The selected version is the Qwen3.8 27B variant with the Uncensored tag, using the Splash route on Mac. "No Review" is the label for the model selected here, not a pass to test any target. Whether the model can answer questions and whether the software has permission to perform operations are two things that need to be confirmed separately.

![Model startup status](https://hyphentech.top/obsidian-assets/qwen38-27b-local-security-video/image-ready-986798be17.jpg)

After launching, the activation status appeared in the upper left corner of the chat page. I first asked what it could do, then pressed for the specific scope of the security test. This wasn't about how many terms the model had memorized, but about first aligning which tools it could call, which environments it lacked, and what permissions were required for operations.

![Security Capability Inquiry](https://hyphentech.top/obsidian-assets/qwen38-27b-local-security-video/image-capability-30ebd27e3f.jpg)

You can think of this relationship as a device health check: the model understands the questions, arranges inspections, and explains the results; The tools that actually read the documents, verify components, and detect the equipment are the corresponding tools. The model answers confidently and does not automatically make the inspection results accurate; ultimately, it depends on the tool's output and the replayable evidence.

## Authorization should focus on specific goals; you can't just say the scope in one sentence

![Target and Folder Authorization](https://hyphentech.top/obsidian-assets/qwen38-27b-local-security-video/image-scope-d0b85b53db.jpg)

In LocalBrain's network security zone, folder checks are set separately from devices and network targets. Check your project directory and authorize that directory; Check your device and add the corresponding target. Don't open all permissions at once just because there are many capabilities in the menu.

![Range confirmation in dialogue](https://hyphentech.top/obsidian-assets/qwen38-27b-local-security-video/image-approval-973ca6a56f.jpg)

It's like asking a technician to come for inspection: letting them check the living room sockets doesn't mean they can search through every drawer. Clearly state the target, inspection type, and allowed actions, so later you know if a single operation has deviated from the original plan. In the video, I clearly require only pre-authorized targets and not expand the scope.

![Local Range Task Approval](https://hyphentech.top/obsidian-assets/qwen38-27b-local-security-video/image-lab-1c213239aa.jpg)

When performing local range tasks, the software will still pop up a confirmation, requiring manual approval from the user to continue. At this step, first read what it plans to download and check, then click approve; Don't skip confirmation just because the task comes from a local model. It's also better to practice for the first time using an isolated range rather than treating the public website as a test subject.

## Checking where the tools are installed is more important than the phrase "one-click installation."

![Operating Environment and Diagnostics](https://hyphentech.top/obsidian-assets/qwen38-27b-local-security-video/image-environment-981b12b9aa.jpg)

The supporting components are grouped under the "Runtime Environment and Diagnostics" section. Whatever is missing and whether it's ready, you can check here first, then select single or batch installations. Android devices, offline vulnerability libraries, and isolated execution environments handle different tasks; installing a large model doesn't automatically make all tools complete.

![Missing Components and On-Demand Installation](https://hyphentech.top/obsidian-assets/qwen38-27b-local-security-video/image-install-c7886eae2b.jpg)

I removed a component on site and then reinstalled it through the interface, using this process to confirm the download and recovery entry points. Related inspection tools are organized by container image; when deleting, you can remove the corresponding image to reduce the impact of dependencies scattered across daily systems.

![Container Tool Organization Method](https://hyphentech.top/obsidian-assets/qwen38-27b-local-security-video/image-container-0583b9fff4.jpg)

You can think of a container as a separate toolroom: it holds the tools and dependencies needed for the job, which can be put away after use. But the toolkit doesn't automatically decide which room the technician can enter—container isolation and target authorization still need to be configured together. Downloading components may also require an internet connection; you can't think of 'local inference' as the whole process never accessing the internet.

## Tip 184: First check the inspection caliber, then the severity level

![Test Range Component Inspection Results](https://hyphentech.top/obsidian-assets/qwen38-27b-local-security-video/image-result-9c18bbfaa1.jpg)

This time, the range used OWASP Juice Shop. The project itself is designed for safe learning and practice; To learn more about its purpose, you can directly see [Juice Shop Project Description](https://github.com/juice-shop/juice-shop). The results clearly state "offline component matching," using Trivy, with prompts divided into 12 severe, 56 high-risk, 92-medium-risk, and 24 low-danger, totaling 184 alerts.

The most common misunderstanding here is reading "Component matches with known problem entries" directly as "All 184 have been verified and usable on this machine." Component version, runtime configuration, whether functions are called, and the actual reachable range all change the actual impact of a certain prompt. Severe levels are suitable for helping to order the order and cannot replace subsequent verification.

![Exported inspection report](https://hyphentech.top/obsidian-assets/qwen38-27b-local-security-video/image-report-e5f78c3326.jpg)

So I didn't stop at the summary in the chat window but opened the exported report. When reading the report, first identify the affected person, then look for the detection basis, applicable conditions, and recommendations. Seeing only a prominent vulnerability number is often not enough to decide whether to stop service; seeing clear component versions, configuration locations, and verifiable phenomena is closer to a task that can be handled.

Models are great for interpreting unfamiliar terms into understandable words, and for organizing reports into to-do lists. Fixes should go back to the formal update, configuration, and validation processes of the corresponding components or devices. Don't attempt destructive actions in production based on chat answers, and don't directly disclose the paths, tokens, or device identifiers written in the report.

## When it comes to their own devices, the focus shifts from "quantity" to "what is exposed."

![Personal LAN Detection Records](https://hyphentech.top/obsidian-assets/qwen38-27b-local-security-video/image-lan-c91f63a9ea.jpg)

After the range, I let it check its own local network. There are waiting and detection method adjustments on the film, and some devices not responding. If a device does not respond to a certain detection, it cannot be given a "security" stamp; What is truly useful is clearly listing confirmed online objects, open services, and items that need to be checked later.

![Raspberry Pi Service Inspection](https://hyphentech.top/obsidian-assets/qwen38-27b-local-security-video/image-pi-cfb772535a.jpg)

One of them was my own Raspberry Pi, which had previously deployed web layout tools. Checking further, I saw web resources, front-end tech stacks, and some interface clues. For the services I maintain, the value of this kind of information lies in reminding me to recheck: which resources should be made public, which directories or legacy products shouldn't be exposed, and whether the service should continue running.

![Home Router Inspection Conclusion](https://hyphentech.top/obsidian-assets/qwen38-27b-local-security-video/image-router-36cd157666.jpg)

For this round, the report focuses on device information visible when not logged in, initialization boot status, and certificates, and lists certain findings as relatively low-risk. The chip does not demonstrate router takeover. For ordinary households, a more practical next step is to confirm management passwords, firmware updates, and remote management settings; For configurations involving public network exposure, if the purpose is unclear, the device should first be narrowed down to the necessary scope according to the device's official instructions.

## What a zero-foundation can truly take is a path of inspection and repair

The most useful result this time isn't to instantly turn people into security experts, but to turn "I suspect a problem" into viewable goals, tool outputs, and reports. You can start with your own isolation practice environment, approve a clear task, save the report, and then ask for what it means, how to verify and fix it, item by item.

Discover clues, confirm risks, and complete repairs—it's best to record them separately. After repairs, check again within the same range to see if the original symptoms have disappeared; If you don't understand prompts right away, keep the original records first; don't use a single automatic check instead of long-term maintenance. Personal opinion, for reference only.

[Watch the full transcript of this issue](https://www.youtube.com/watch?v=ENNQvKOHGb4) · [Introduction to LocalBrain](https://hyphentech.top/localbrain-local-ai-box/) · [Download & Update: LocalBrain](https://github.com/HackerChi-Hub/localbrain-releases/releases/latest)


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
