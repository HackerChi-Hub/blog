---
title: "LocalBrain: a local AI workbench for Mac, Windows and Linux"
slug: localbrain-local-ai-box-en
status: published
lang: en
translation_of: localbrain-local-ai-box
date: 2026-09-28
updated: 2026-10-24
summary: Local models, media and tools in one workbench. Mac 2.1.3 restores one-click Codex and Claude Code MCP integration alongside DeepSeek Harness, without changing client models. A real Codex call passed; Claude Code model-call acceptance was not completed. Windows/Linux remain on 2.1.2.
categories:
  - Resources
tags:
  - Tools
  - Development
cover: https://hyphentech.top/obsidian-assets/localbrain-local-ai-box/cover-7a52f6d721.jpg
legacy_paths: []
---

## Mac 2.1.3: connect Codex and Claude Code to local tools

One-click MCP integration is restored for Codex and Claude Code alongside DeepSeek Harness. MCP is the tool interface: your existing client can use LocalBrain documents, search, transcription, speech, image and video tools while keeping its chosen model. The required local runtime and weights must be ready; web search still needs a network connection.

Open Integrations, find the client and choose the MCP write button. Confirm the user-level scope, then use a new client session. Tool processes start with client sessions; media models load when called. Configuration previews are collapsed until needed. If the desktop client is running, LocalBrain asks you to close it after current work finishes, avoiding a later cached configuration overwrite; it does not terminate the client.

**Writing and undo affect only LocalBrain tool entries.** Models, providers, other MCP entries and project settings are preserved. Repeated writes retain the original restore point. Conflicting external changes are kept and reported. Harness tool undo touches only the tool block, separately from model integration. OpenCode is not restored.

I tested Codex with an isolated configuration copy and a temporary DOCX containing a random verification code absent from the prompt. The record contains one successful `document_read`, the final code matches, and formal client configuration hashes stayed unchanged. Only that read-only tool was preapproved for the test; the product does not disable client approvals. **Claude Code configuration merging and protocol discovery were checked, but its model-call test stopped because the existing login credential was invalid. It is not reported as a passed real-call test.**

[Download Mac 2.1.3 Apple Silicon DMG](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.1.3/LocalBrain_2.1.3_aarch64.dmg) · [Mac verification](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/VERIFICATION-2.1.3-MAC.md) · [Latest release and platform downloads](https://github.com/HackerChi-Hub/localbrain-releases/releases/latest). Windows/Linux retain their published 2.1.2 packages; this does not announce 2.1.3 for those platforms. The Mac app is ad-hoc signed and not Apple-notarized.

Mac 2.1.3 has been installed locally. All 12,995 files and links match across the app, DMG and updater archive; app-signature checks and independent updater verification passed. The installed MCP protocol and tool-discovery self-check passed 26/26. This does not mean every media model's generation quality was retested. DMG SHA-256: `023934d617c93cb50cd3dd41f55bd7ad672d29983548000cfb78d1f7985417b8`.

The source GitHub documentation-sync job could not start because of account payment/spending restrictions. After local checks and installed-app acceptance passed, I explicitly approved this Mac 2.1.3-only release exception. This is not passing remote CI or acceptance for other platforms.

![Installed Mac 2.1.3: separate copy, write and undo actions for three clients, with configuration collapsed; the interface shown is Simplified Chinese](/obsidian-assets/localbrain-local-ai-box/v213-mcp-clients.png)

![Installed Mac 2.1.3 MCP self-check: protocol and tool discovery passed 26/26; the interface shown is Simplified Chinese](/obsidian-assets/localbrain-local-ai-box/v213-mcp-selfcheck.png)

These screenshots come from the final installed app. Only the system automation control title bar was cropped; originals and crop records remain local. The 2.1.2 and earlier sections below retain their historical versions, tests and screenshots.

## 2.1.2: three-platform downloads and tool installation fixes

LocalBrain brings local models, speech, images, video and file tools into one desktop workbench. Each platform maintains its own runtime: Mac offers specialized engines including MLX, Splash and Sushi; Windows supports llama.cpp and PolyStrata; Linux provides preview Debian and AppImage packages. Model compatibility and memory requirements depend on the engine and local checks. Updating the app does not implicitly upgrade CUDA, drivers or model weights.

Version 2.1.2 registers bundled tool paths in the managed Python environment and verifies their origin in a fresh process, avoiding build output inside read-only app resources. Windows Unicode paths and diagnostics explicitly use UTF-8. The security target list uses the full width, with connections and tools shown as needed. Batch handoff creates a draft requiring manual submission and execution approval. Integration retains DeepSeek Harness configuration. A completed turn shows only a support text entry; clicking reveals a QR code without inserting it into model context.

The final Windows package was checked on an RTX 4070 Laptop 8GB/32GB RAM machine with PolyStrata Qwen3.6-35B-A3B Q3 at 8K: native chat, one file write, actual compaction and continuation; the installed configuration hash stayed unchanged. Both Linux packages passed bundled Node/DSH, resource and WSL2 Ubuntu22.04+Xvfb startup checks; Debian was installed. This is neither bare-metal Linux GPU inference nor real HTB acceptance, and does not rerun the original twelve-question benchmark. Windows has updater signatures, not Authenticode. Existing Mac packages retain their separate acceptance record.

[Windows installer](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.1.2/LocalBrain_2.1.2_x64-setup.exe) · [Linux Debian](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.1.2/LocalBrain_2.1.2_amd64.deb) · [Linux AppImage](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.1.2/LocalBrain_2.1.2_amd64.AppImage) · [Mac DMG](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.1.2/LocalBrain_2.1.2_aarch64.dmg)

The author explicitly approved this release exception: the source GitHub check could not start due to account payment/spending restrictions. Local passing checks are not reported as passing online CI.

[Windows/Linux verification and hashes](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/VERIFICATION-2.1.2-WIN-LINUX.md) · [Mac verification](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/VERIFICATION-2.1.2-MAC.md) · [Latest release](https://github.com/HackerChi-Hub/localbrain-releases/releases/latest). Older figures, walkthroughs and screenshots below retain their original dates and are not new results from this batch.

## Windows 2.0.0: small-context tasks and compaction repairs

Public releases checked on October 20, 2026: Windows is now 2.0.0; Mac remains 1.9.9. Windows avoids stopping tasks merely because a tiny compaction provides no reduction: it preserves the original and continues when safe response space remains, while actual overflow still stops with records retained. Long built-in tool schemas load on demand. Summaries disable tools and thinking, and serialize historical tool receipts as read-only material rather than continuing their instructions.

The release record covers final-package installation, greeting, countdown file delivery, continuation after automatic compaction, real network calls at 2K/5K output limits and the chat UI. Countdown start, pause and reset passed. This is not the original twelve-task full rerun. Summaries can still infer local state incorrectly; successful network delivery does not establish news freshness or factual accuracy.

[Download Windows 2.0.0 installer](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.0.0/LocalBrain_2.0.0_x64-setup.exe) · [Final-package verification and limits](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/VERIFICATION-2.0.0.md). SHA-256: `547c745ad1494b89bc7c4d3ee8646b6fcc28f1c469a59be3496361e149b6e668`. Updater signature verified; not Windows Authenticode-signed. CUDA, drivers and third-party model environments were not upgraded.

## 1.9.9 update: Sushi residency and exact SSD tested

Mac 1.9.9 repairs completion after downloads reach 100% and explains Sushi startup failures. Installed-app checks exercised real memory preflight rejection with required/available values, including when status polling reaps the process first. Restoring 32K allowed full-resident loading and a Chinese response. Existing approximately 79.21 GB weights were preserved without downloading them again.

On October 20, 2026, M5 Pro/64 GiB, the same Qwen3.8 Flash Next 2.6-bit weights, Sushi 1.2.4, 32K context and thinking off: full residency versus 32 GiB exact SSD registered 44.20/31.21 GiB; first-context response totals were 4.99/8.10 seconds, repeated-context totals 2.68/2.87 seconds. Repeated context reused 2,595 input tokens. Isolated starts were 40.39/8.98 seconds; a later native resident start took 17.02 seconds. System file caches were not cleared, so these are individual observations, not cold-start averages.

Full residency loads vision by default; SSD does not. An additional SSD run explicitly loading vision took 8.23 seconds for first context and 2.60 seconds for repeated context. This verifies loading, not image-understanding quality. These single-machine samples do not establish universal speed or quality. Native SSD chat also completed a Chinese reply and a local-time tool roundtrip.

**Mode selection is manual.** In Settings, runtime and diagnostics, SSD budget 0 means full residency; a nonzero value such as 32 selects exact SSD after saving and restarting the model. Low memory does not trigger an automatic switch or bypass protection. Automatic expert-cache scheduling is separate from switching modes.

[Download Mac 1.9.9 DMG](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v1.9.9/LocalBrain_1.9.9_aarch64.dmg) · [Test conditions and limits](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/VERIFICATION-1.9.9-MAC.md). DMG SHA-256: `6fbc94eb895220fbf99a8d497b8ec3506074e6964c51dc895374d985ae5d6c27`. Local signature, not Apple-notarized. Windows remains 1.9.8; Linux retains existing releases. Older walkthrough text and screenshots below describe their original dates.

## Turn your Mac into a private AI box

> Not another chat web page: local models, media, documents and agent tools gathered into one Mac workbench.

> [!note]
> HyphenTech · LocalBrain 1.9.4 · 2026-10-18 · Also available in 简体中文 and 繁體中文 (switch below the title)

---

I did not build LocalBrain because local models now beat the cloud. On the same hard task, the top cloud models are usually still smarter and steadier. What wore me out was everything else: models in one folder, MLX in one terminal, GGUF needing another server, and transcription, voice-over, image, video and documents each running their own way.

So the goal has not changed: **not a smarter brain, but a calmer master switch for local AI.** This walkthrough was written at 1.4.8; the current version is 1.9.4. Below is a walk through each page; every screenshot is the real 1.4.6 interface (later releases added security checks, office documents, Splash models and more — see “After 1.4.8”, “New in 1.4.8” and “New in 1.4.7” near the end): a fully visible task process, output and cache folders you can place anywhere and clean out completely, and three complete interface languages.

> [!note]
> LocalBrain is not meant to replace Codex, Claude Code or OpenCode. It gives them, and its own chat, a set of controllable models and tools that start on demand and stay on your machine as far as possible.

### ▍Home: this machine's memory budget on one screen

The home screen answers three questions first: what this machine is, what is using memory right now, and what else you can start. Below is my M5 Pro (64 GB unified memory) running the Splash build of Qwen3.6-35B-A3B.

![# Home: chip, unified memory and free disk; the memory bar is split into "System" and "AI models"; running services show their expected memory use.](/obsidian-assets/localbrain-local-ai-box/v146-en-home.png)

- **A memory bar in two parts**: how much the system uses, how much the AI models use and what is left, stated outright. The "estimated usage" on a model card comes from the model's size; Splash is estimated at 1.1× its size.
- **Arbitration before starting**: the memory arbiter adds up the backends already running and the model about to start. If resources run short it refuses clearly, instead of letting the system swap itself to a standstill and failing afterwards.
- **One switch for three engines**: MLX, llama.cpp (GGUF) and Splash start and stop the same way. Splash brings its own draft model for speculative decoding, and models that can read images are marked.
- **Media backends on demand**: speech transcription, speech synthesis (with voice cloning), image generation, image editing, video generation and music generation each have a card, and are released automatically after idling or under memory pressure.

※ This is not a promise that more memory always means faster. Whether something can start, and how large, is decided by the numbers Home and Discover work out for this machine.

---

### ▍Discover: know whether it will run before you download

Large models weigh tens of gigabytes, and finding out after the download that one will not run is the most expensive way to experiment. Each Discover card moves that question up front.

![# Discover: ability tags, the publisher's benchmark numbers, quantizations and the minimum / recommended memory worked out for this machine, all before the download button.](/obsidian-assets/localbrain-local-ai-box/v146-en-discover.png)

- **More than 40 curated entries**: language, vision, speech, image, video and music models, newest first. Each card lists ability tags, the publisher's benchmark numbers and where they come from (in the screenshot, MMLU-CoT 0.283→0.548 for the distilled Qwen3.8 2B), and the size of each quantization.
- **Memory worked out for this machine**: the "minimum / recommended unified memory" is not copied from the model card; it is calculated from this machine's memory and the model's structure.
- **Licenses before the download button**: restrictions stricter than usual, such as no commercial use, are flagged up front with a link to the original text, not discovered after the download.
- **Download source speed test**: one click measures ModelScope, HF-Mirror and Hugging Face and picks the fastest at that moment; downloads are checked against SHA-256 at the end, so a file that merely has the right size but is damaged is never counted as a success.
- **Existing models stay where they are**: point at a model folder you already have and it is mounted, with the engine, category and context ability detected, without copying weights or touching the folder.
- **Identity check before registering (new in 1.4.4)**: when you pick a folder with “Import existing” on a card, LocalBrain first detects which model is actually inside. A certain mismatch is refused outright, such as registering a video model package as an image-editing model; if only the name or category looks different, it shows what it found and asks you to confirm, so renamed folders still import. My own machine had exactly such a record: the entry for the image-editing model Mage-Flow pointed at a MiniMax H3 video package folder that no longer existed. Records like that, whose folder is gone, used to be skipped silently; Home now lists them under “Broken model registrations” and removes them in one click, deleting only the record, never the model files.

> [!note]
> **Detected does not mean it will start.** Format, architecture, vision projector files and the current runtime all affect compatibility; the app tries to give the concrete reason instead of dressing up "found it" as "it will definitely run".

---

### ▍Chat: from answering a question to delivering a file

The built-in chat has streaming, attachments, stop, saved conversations and local tools. What I care about more: when you ask it to fix a web page or build a spreadsheet, does it actually deliver, and does the process hold up to inspection?

![# Chat (demo data): the self-check fails → one line gets a null check → the next self-check passes; the summary shows 8 rounds, 9 tool calls, 2 failures and four time segments.](/obsidian-assets/localbrain-local-ai-box/v146-en-chat.png)

The conversation above is a demo, but every element on screen is the real 1.4.6 interface:

- **Every step is shown**: reading files, listing folders, web search, writing files, targeted edits and page self-checks each show their target and time; complex tasks start with a plan, and the plan card says it is "the model's own record, not independent verification".
- **Failures stay visible**: repeated calls to the same tool are grouped as "Page self-check ×2", with "1 failed" right beside it. In the screenshot the model's first self-check returned a page error; it changed a single line to add a null check, and only the next self-check passed.
- **The self-check really runs**: generated pages are checked in a headless browser for a canvas, advancing animation frames and console errors, instead of taking the model's word that it checked.
- **Where the time went**: each task ends with total time, rounds, tool calls and failures, with the time split into prefill, reasoning, output and tools.
- **Long tasks keep the interface responsive**: 1.3.27 fixed the interface freezing on long, fast output by throttling the streaming refresh and the metrics.

Document tasks can also deliver DOCX, PPTX, XLSX or PDF directly. If no real file was produced, the zero-output gate refuses to report the task as done.

---

### ▍Storage & cleanup: the heart of 1.4

After a month of use my own machine had piled up plenty of things nobody could see: check screenshots, task checkpoints, logs, and images and voice-overs that early versions wrote into temporary folders. 1.4.0 puts all of it in Settings.

![# Settings · Storage & cleanup: both the output folder and the cache folder can move; usage and file counts per category, tick to clean.](/obsidian-assets/localbrain-local-ai-box/v146-en-storage.png)

- **Both folders can move**: the output folder holds generated documents, images, speech, video, music and web downloads; the cache folder holds logs, task checkpoints, check screenshots and temporary files. Either can live on an external drive.
- **Moving takes the files along**: on the same drive they are moved directly; across drives they are copied and verified first, then the old copies go to the Trash.
- **To the Trash by default**: cleaning a category moves it to the Trash unless you choose permanent deletion; folders sent to the Trash carry the name of the folder they came from, so you can tell them apart at a glance.
- **Automatic cleanup**: total log size, checkpoint age and temporary file age each have a threshold, applied by the app on a background timer whether or not the window is open.

The numbers in the screenshot are measured on my machine: System output 13.3 MB in 204 files, web check screenshots 27.9 MB in 262 files. The first automatic cleanup after installing 1.4.0 moved 145 task checkpoints and 35 sets of old check screenshots to the Trash. I checked those 145 checkpoints one by one against the conversation list the app keeps: not one of them belonged to a conversation that still exists.

---

### ▍Integrations: hand local abilities to other agents

![# Integrations: local MCP tools written into each client's configuration with one click, and local models served through an OpenAI-compatible endpoint.](/obsidian-assets/localbrain-local-ai-box/v146-en-integrations.png)

- **Local MCP tools**: document processing, speech transcription, speech synthesis, images, video and web research, written into the configuration of Claude Code, OpenCode, Codex or DeepSeek Harness with one click. Only the `localbrain-*` entries are added or updated; your model settings and other MCP servers stay as they are, and one click restores the configuration from before.
- **Local models as the brain**: OpenCode, ScreenLex and DeepSeek Harness can use local models directly through the OpenAI-compatible endpoint `127.0.0.1:11434/v1`, no API key needed.
- **MCP self-test**: checks that the protocol and tool discovery work, without loading a model or using extra memory.

The steadier setup for Codex and Claude Code is to keep their cloud reasoning models and call LocalBrain's local tools through MCP. **LocalBrain can provide endpoints and tools, but it cannot lift a third-party client's own model or tool restrictions.**

---

### ▍Three interface languages, complete this time

Simplified Chinese, Traditional Chinese and English have been there since 1.2.70. But while making these screenshots, I had the screenshot harness list every piece of Chinese that actually appeared on the English interface, and it turned up dozens of gaps: 26 catalog entries with no translation, plus confirmation dialogs and numbers glued to their units. The automated checks had all been green, because each of them only recognised one way of writing things.

1.4.3 fills those gaps and adds all three kinds of leaks to the tests. 1.4.4 then reviewed about 1,400 English strings one by one, removing machine-translation phrasing and inconsistent terms; labels the program assembles, such as reasoning levels, the compatibility table and attachment processing status, no longer leak Simplified Chinese into the English and Traditional Chinese interfaces. Switching language translates the interface only, never your conversations, model answers, code or file paths.

---

### ▍Where "private" ends: what stays on the Mac and what still goes online

Local inference, transcription and media generation can stay on the Mac, and conversations are saved only on this computer. But "local AI" does not mean "never online": downloading a model contacts the model source, web search sends queries to a search engine, and if Codex or Claude Code use cloud models, their reasoning is not local either.

File tools can only read the folders you allow by default. Running project commands is off by default; when turned on, every run asks for confirmation first and says plainly that the working-directory limit is not a system sandbox. The new “Network access” in 1.4.7 is off by default too; once on, the model can send HTTP requests or use SSH to reach the devices in your `~/.ssh/config`, and changes still ask for confirmation each time. **Private is not a label; it means you can see where data goes, which folders are allowed and how long each backend lives.**

| If this is you | My suggestion |
| --- | --- |
| Several MLX, GGUF, speech or media models scattered across your Mac | A good fit: one place to reference, start, stop, budget and clean them |
| You want OpenCode or a cloud agent to call local media tools | A good fit: write or copy the configuration from Integrations |
| One or two Ollama models and the occasional question | You may not need another layer |
| You expect small local models to replace top cloud models everywhere | Not a fit: the local advantage is control, privacy and reuse, not being stronger at everything |

---

### ▍Four steps to start

- Download the latest DMG from **GitHub Releases** and drag LocalBrain.app into Applications.

- In Settings, install the runtimes you need and choose the interface language, model folder and download source.

- In Discover, download a model that suits this machine, or mount a model folder you already have.

- Start a model on Home and try the built-in chat; when you need an external agent, write its configuration under Integrations.

### ▸ New in 1.4.8: a second local video engine, LTX-2.5

**Write a line in quotes and the person in the video says it.** LTX-2.5 sits next to MiniMax H3 as a second video engine: text, first-frame and first-and-last-frame videos, all with synchronized stereo sound. It shares the video workbench with H3 — the same 1–30 second range, up to 10 seconds per pass, and longer clips chained automatically (each part starts on the previous part's last frame, and the picture stays continuous across the join); prompt templates, segment stitching and MCP `generate_video` all work as before, and the templates carry their own LTX test results. On the reference Mac (M5 Pro, 64 GB) a 1024×576 clip takes about 2 minutes for 4 seconds, 6 minutes for 10 seconds and 12 minutes for 20 seconds; peak memory is about 25 GB for text-only clips and about 37 GB for a 10-second part that starts on an image, and when that does not fit, the model is streamed block by block. Reference images still need MiniMax H3 REF2VA.

![# The video panel with LTX-2.5 selected: 20 seconds becomes two chained parts; the hint states the 10-second pass and that a quoted line repeats in every part, and the estimate adds up per part.](/obsidian-assets/localbrain-local-ai-box/v148-en-video-ltx25.png)

**One-click download on Discover, direct from mainland China.** 43.4 GB, byte for byte what mlx-community publishes; pick the ModelScope source for a direct download — the two Hugging Face repos use Xet storage, which hf-mirror only redirects and does not cache. The ltx-2-mlx video runtime installs itself on first start, about 404 MB. Models downloaded from ModelScope are now checked against SHA-256 file by file; before, only the size was compared.

**The runtime's 54 GB peak, down to 25 GB.** For the same 4-second clip, the runtime's defaults peaked at 54 GB: its Gemma encoder raises the cache limit to 90% of memory, and decoding never tiles. LocalBrain caps the cache at 2 GiB and decodes 5 latent frames per tile; the peak drops to 25 GB at the same speed.

### ▸ New in 1.4.7: eight document formats, and “Network access”

**Documents are no longer just DOCX and PDF.** When you ask the model to “write a document,” it can now produce Markdown, HTML, TXT, RTF, ODT and EPUB directly. More importantly, every format goes through a cleaning pass first: the `{"type":"markdown", ...}` wrappers, escaped newlines and zero-width characters the model writes are unwrapped, restored and stripped, then turned into real headings, (nestable, checkbox-capable) lists, tables and code blocks — not a slab of raw JSON dropped into a Word file. This fixes a real failure: a request to “build a browser 3D flight game” had one line, “create the phase-0 document,” that sent the whole task to the document tool, and hundreds of lines of source ended up stuffed into eight uncleaned DOCX files. Coding and engineering work now goes to the general agent that can actually write project files, unless you name a file format like DOCX, PDF or EPUB.

**Stuck on something? It can look it up online, or configure another machine over SSH.** The new “Network access” switch is off by default; once on, the model can send HTTP requests to call APIs or read endpoints, run commands and copy files over SSH on the devices in your `~/.ssh/config`, check connectivity and TLS certificates, and view this machine's network status. SSH logs in with keys only — LocalBrain never touches or stores a password. Permissions are per conversation: read-only operations run directly, while changes (restarting a service, editing config, uploading a file, POST/PUT and the like) ask you each time, and you can grant full trust within one conversation so it stops interrupting. It is separate from “Web search” — that one looks things up, this one operates other machines; port scanning and packet capture, the kind of probing done against other people's networks, are not included.

### ▸ After 1.4.8: security checks, office documents, community models, download experience (current: 1.9.4)

The walkthrough and screenshots stop at 1.4.8; every later version has its own article, so here is just the main line:

- **Authorized network security checks (1.5–1.6)**: two entries — workspace security audit and authorized network checks — with fixed-parameter vectors, sandboxed execution and local target-range reverse verification, fail-closed throughout. See [[localbrain-network-security|the network security testing post]].
- **Office documents, format-preserving (1.6.8)**: format-preserving editing and template filling for DOCX / XLSX / PPTX — “fill in the table without touching the original layout.”
- **Media tools right inside chat (1.8.0)**: with a model running, speech, transcription, image, music and video all go through the same task agent. See [[localbrain-media-chat-180|media calls in chat]].
- **Splash community models (1.8.x)**: downloading, assembling and launching community 4-bit models, with ModelScope transfer, automatic resume after stalls and pinned-revision hash checks.
- **Download speed display (1.8.8)**: live speed and estimated time remaining now appear right in the progress line; after a stall the stale reading is withdrawn with a waiting notice — no more inflated or frozen phantom speeds.
- **Skills and long-term memory (1.8.9)**: discover other agents' file locations, choose read-only mounts or copy imports, edit internal entries and select automatic, manual-only or disabled loading. The model can search and read managed entries; it cannot create or enable them by itself.
- **Context compaction (1.9.1)**: a long chat is like a stack of records: originals remain available while a separate handoff outline is written. Incremental semantic summaries run at message or capacity thresholds; Compact now is available while idle. Tool chats use concise Chinese summaries, and recovery does not replay completed tools. Installed-app samples took about 2.97 seconds automatically and 2.48 seconds manually. These are sample timings, not a general speed promise; summaries can still miss details.

- **Configuration and interface fixes (Mac 1.9.3)**: restore only managed external-client keys; empty backups retain later additions, and malformed files keep their original content and backup. Home pauses polling when unfocused, and window switching no longer scans Discover directories. Sessions support search and renaming; sidebar and attachments skip unrelated renders. Memory conflicts allow an explicit model switch, with no media start after a failed language-model stop. Windows/Linux retain their separate 1.9.2 releases.

---

- **Read-only personal-device checks (Mac 1.9.4)**: register phones, computers, embedded devices and firmware separately, batch-add targets, then add requirements and send manually in chat. Android collects authorized OS/patch information, computers query local security status, and network scopes use a few authorized ports. Firmware checks fingerprint files, identify signatures on one thread or match components offline. Models cannot choose arbitrary paths or bypass scope through other tools. Missing dependencies/databases fail explicitly instead of reporting zero vulnerabilities. Local-computer and offline-fixture adapters were verified; real phones and embedded hardware remain untested.

#### LocalBrain 1.9.4

LocalBrain gathers the local models, media, documents and MCP tools on your Mac into one workbench.

> [!note]
> Platform macOS 13.0+ / Apple Silicon · Windows is at 1.9.2 · Installer LocalBrain\_1.9.4\_aarch64.dmg

[LocalBrain downloads and updates (release page)](https://github.com/HackerChi-Hub/localbrain-releases/releases/latest)

[LocalBrain product page](https://hyphentech.top/localbrain)

The SHA-256 of the current installer is **f2542209eb8000bf77aacb2bd9b24abaa57613c125bd5a46f44c9bc64475c929**. It carries a development signature and is not yet notarized by Apple; if Gatekeeper blocks the first launch, confirm the download source and the hash, then remove the quarantine attribute with the command below.

```shell
xattr -dr com.apple.quarantine /Applications/LocalBrain.app
```

*Only for an installer downloaded from the official Releases page whose hash you have checked.*

If it has helped you, the “Sponsor” button under “Follow HyphenTech” in the sidebar shows the WeChat sponsor code (WeChat Pay only). Sponsoring is entirely optional and changes no features.

> **// Cloud models think the hard problems through; local tools keep your files, models and workflow in your own hands. The two do not conflict.**

---

> [!note]
> The choice is simple
> 
> If your local models and tools have multiplied to the point where they manage you, LocalBrain saves more than a few commands: it saves the time lost to every restart, model switch, task change and cache cleanup. If you only chat now and then, keep your simple tools.


---

## 🧰 Tools I build

I maintain all of these tools myself. Preview builds are clearly labeled; the release pages are the source of truth for downloads, updates and known limits.

> [!info] HyphenAssistant
> **Status:** Early build · Preview
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
