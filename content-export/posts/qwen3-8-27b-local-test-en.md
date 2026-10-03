---
title: "Qwen 3.8-27B Local Test: Completed all 6 questions, but messed up on two lines of CSS"
slug: qwen3-8-27b-local-test-en
status: published
lang: en
translation_of: qwen3-8-27b-local-test
translation_source: machine
source_sha256: a096934dbec4b3fc
date: 2026-08-18
updated: 2026-10-03
summary: "On August 14, the open-source 27B multimodal model was fed into an M5 Pro. All six problems produced executable files, with a median of 13.4 tokens/second. By the way, I clarified where to get the review version and how much memory it needed."
categories:
  - Tech
tags:
  - AI
  - LLM
  - Local deployment
  - Apple Silicon
  - Open source
cover: https://hyphentech.top/obsidian-assets/qwen3-8-27b-local-test/cover-be360df2e5.png
brand_slogan: 
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/qwen3-8-27b-local-test/) is authoritative.

> [!note]
> This article was first published on the HyphenTech official WeChat account

## Qwen 3.8-27B All 6 questions were completed, flipping to two lines of CSS

> An M5 Pro 64GB, 17GB weight, median 13.4 tokens/sec. Appendix: Where to get the review version and how much memory it occupies

> [!note]
> HyphenTech · Tested on this machine · 2026-08-18

---

On August 14, Qwen3.8-27B was open-sourced, with Apache-2.0. I didn't click on the cloud interface, just dragged a 17GB GGUF into my own LocalBrain (Chinese name: LocalBrain), and got 6 problems: three graphic animations, one with JavaScript disabled for pure CSS constraints, one with game UI restore, and finally a toolchain problem requiring real online search and then output Excel and Word. From the first question at 13:51 to the last file at 16:48, **all six problems produced files that could be run with double clicks**, and the longest generation took 940.6 seconds. The two final failures were also specific: one was two lines of CSS, and the other was a Word with complete titles but empty content.

![# Finished Problem 1:Three.js Low polygonal island, trees, houses, circling chicks, soft shadows, and a gradient sky all present](https://hyphentech.top/obsidian-assets/qwen3-8-27b-local-test/image-01-82f972f128.png)

> [!note]
> To get straight to the point: **Qwen3.8-27B is a multimodal model that can really work on a 64GB Mac, but it's not a model that can race you against time. **The code quality is adequate; the problem lies in last-mile delivery.

### 🧩 ▍ Why can a 27B fit a laptop?

27B is a dense model, with 64 layers, hidden dimension 5120, native to images and videos. What really keeps it alive on consumer machines isn't the number of parameters, but how attention is arranged. The official model card describes the structure as 16 × (3 × (Gated DeltaNet → FFN) → 1 × (Gated Attention → FFN))—** Out of every four layers, three use linear attention, leaving only one full attention layer. **That total attention layer is also narrowed: Query has 24 heads, Key/Value only has 4 heads, head dimension 256.

Let me give you an analogy. Total attention is like rereading everything you've read before every new word—the longer you read, the slower it gets, and the more memory increases. Linear attention is more like carrying a constantly rewritten abstract—when new words come in, you only update the summary, never going back to old stories. The trade-off is that the summary loses details, so you still have to leave a quarter of your full attention to pin down the key points.

This layout provides native 262,144 tokens of context, and the official says it can be expanded to 1 million. On my machine, unsloth's UD-Q4\_K\_XL has a main weight of 17,093 MB, and the visual projection mmproj is 888 MB, totaling less than 18GB. **Back in the days when running models locally and having to memorize llama.cpp parameter tables yourself, a multimodal model of this size was unimaginable.

> [!note]
> Here's a detail that can be verified by mutual verification: the official model card recommends temperature 0.7, top\_p 0.80, and top\_k 20, but the level I registered for Qwen3.8 in LocalBrain is exactly the same, plus presence\_penalty 1.5. **If you misapply the sample value to other brands, it won't cause any errors, just make the model look dumb** This kind of pitfall is the hardest to detect.

---

### 🎮 ▍ Four Shape Questions: Skip adjectives, just look at the picture

Question 1 Three.js low polygonal island, with a tree, a small house, and a slowly spinning chick. The camera automatically surrounds it, with a gradient blue sky and soft shadows. The output single file contains 372 lines, Three.js import map imported from CDN. The image above shows the 5th second: the chick has a comb, beak, and eyes, its body moves in the direction of movement while orbiting the island, the house has a door handle and three windows, and the grass is filled with extra stones, mushrooms, and small flowers.

![# The receipt it gave after submitting question 1: each element of the screen was clearly listed, and in the upper right corner it was still hung with a note stating that this tool call had already been written with 2,056 characters and took 95 seconds](https://hyphentech.top/obsidian-assets/qwen3-8-27b-local-test/image-02-7187d2e2e6.png)

By the way, here's the receipt. It doesn't just throw you a file; it lists a table explaining how each thing is implemented—the tree is a hexagonal prism trunk with 4 Icosahedron stacked crowns, the sky is a three-stage ShaderMaterial gradient, and shadows are done using PCFSoftShadowMap. **I checked these descriptions against the code, and they're all true. **It clearly states what it wrote, which will become a rather ironic comparison later.

![# Question 2: The moment you catch the star, the score jumps to 10, and golden particles explode from the basket](https://hyphentech.top/obsidian-assets/qwen3-8-27b-local-test/image-03-9a89caeeaa.png)

Question 2 is the native Canvas mini-game "Catch the Star," which does not allow any external libraries. I use real keyboard events to drive the basket to catch it, capturing the moment it is caught: the score jumps from 0 to 10 in the top left, the particle explosion effect explodes at the basket opening, and there are two spinning stars in the sky. The entire code is wrapped inside IIFE, with not a single global variable leaked out—a pretty refined way of writing.

![# Question 3: Pure CSS 3D cube, every eight seconds, with reflections and twinkling starry sky](https://hyphentech.top/obsidian-assets/qwen3-8-27b-local-test/image-04-6779958ace.png)

Problem 3 is the most interesting because it's the only one with hard constraints: only HTML and CSS allowed, **JavaScript, images, and SVG prohibited**. Constraints are easiest for models to sneakily bypass, so I counted them all at once: the number of times script, img, svg, and onclick attributes appeared in the entire file, **all 0**. The cube rotates with an 8-second \`spin\` animation, and the reflection and starry sky are all drawn in CSS. The semi-transparent surface shows the mirrored text on the opposite side, which is a design trade-off, not a bug.

![# Its own description: The six colors are spring pink, summer green, autumn orange, winter blue, sun gold, and moon purple, with the final line "zero JavaScript, zero images, zero SVG"](https://hyphentech.top/obsidian-assets/qwen3-8-27b-local-test/image-05-c80ebaa8e9.png)

When submitting, it wrote "zero JavaScript, zero images, zero SVG, pure HTML + CSS." This kind of self-declaration isn't worth much—**the model saying it follows the rules is a different story**. This time, what it said was true. The three zeros I counted matched its description, even the reflection using \`scaleY(-1)\` plus gradient mask, and the stars using \`box-shadow\` batch generation—these details all matched.

![# Question 4: The green shot has already exploded and is pulled down by gravity, trailing behind; the magenta shot just exploded, and the third shot is still taking off](https://hyphentech.top/obsidian-assets/qwen3-8-27b-local-test/image-06-ca01769e9b.png)

Question 4 is a fireworks simulator: click and launch a shot from the bottom, blasting 80 to 150 gravity-falling, gradually extinguishing particles. This image is a frame selected after clicking three locations in a row, showing three stages—the tail of ascent, the newly exploded bright core, and the embers already pulled down by gravity. The silhouette of the city at the bottom shows illuminated windows and red aviation obstruction lights.

> [!note]
> I didn't change a single word for these four problems. **Geometry, animation, physics, and constraint compliance—the local 27B level is no longer just "running is enough." **

---

### 🔧 ▍ Two Mishaps: Two lines of CSS and one blank Word

Question 5: I want a pixel-style RPG start screen: centered title 'Pixel Warrior' with breathing glowing, three menu buttons below, up and down to switch selected items, with a popping pixel sword before the selection, and press Enter to pop up a retro dialog box. All functions are fully implemented—I pressed the arrow key, and the selected item did move from 'Start Adventure' to 'Read Save'; Press Enter, and the 'Stay tuned' dialog box popped up.

![# Run as is: The title and three menus are squeezed into the same row, and the "three menu buttons below" required by the title are gone](https://hyphentech.top/obsidian-assets/qwen3-8-27b-local-test/image-07-7316eae321.png)

But the image looks like this. The title and the three menus are lined up horizontally, and the dialog box popping up with press Enter is centered because it's \`position: fixed\`, right on top of the title and 'Start the Adventure'. The root cause is in two places: \`body\` wrote \`display: flex\` but not \`flex-direction: column\`, so the title container and menu are lined up; \`.menu-item\` is \`inline-block\`, and the three menu items are also arranged horizontally—and this problem requires **up and down buttons** switching.

![# After adding flex-direction: column and display: block, the design intent is fully restored](https://hyphentech.top/obsidian-assets/qwen3-8-27b-local-test/image-08-abde7b9786.png)

I didn't touch any line the model wrote, only added two statements at the top of the page: \`body \{ flex-direction: column \}\` and \`.menu-item \{ display: block \}\`. The result is the one above—the title is centered with a red breathing light, three menus are vertically arranged below, the pixel sword stops in front of 'Read Save', and the pixel mountain scrolls horizontally behind it. **It's only two lines away from the correct answer, but it doesn't know it itself. **

> [!note]
> This one is worth single: correct syntax, runs well, has complete functions, and passes self-check—**If you can't catch these failed static checks, you can only see them by capturing the screenshot. **If you only look at 'whether it runs well' when doing code reviews, you'll miss out on these kinds of issues.

Question 6 is specifically for testing the toolchain: no website link, forcing it to search on its own; After finding it, you have to actually read the webpage; Then jump to the document tool to produce Excel and Word; Finally, you have to use the preview tool for self-checking. The easiest part of this question is creating URLs—a lazy, off-network model can easily make a string of URLs that look very similar from memory, but you can't tell just by looking at the file; you have to catch them one by one.

So I went through the four sources I gave one by one. **All four are true, and the content matches the question**:checkaimodels.com That article was titled "Run Open-Source LLMs Locally 2026: Which GPU, Ollama vs vLLM," hardwarepedia.com was "Running AI Locally: Complete Hardware & Software Guide (2026)," plus a CSDN "Windows Locally Deployed Open Source Large Model Babysitting Tutorial" and a post on Toutiao. The Excel section was also straightforward: the header added 8 rows of data, and the column names were the model name, parameter count, quantization format, minimum memory requirement, and source URL as required by the question.

![# Self-check receipt when submitting assignments: Step 5 says passed = true, no issues, 58 paragraphs, 6 tables](https://hyphentech.top/obsidian-assets/qwen3-8-27b-local-test/image-09-e3d14c7b0a.png)

Then came this receipt. The self-check result in step five said **passed = true, no issues**, and gave specific numbers: 58 paragraphs, 6 tables. Step 4 described the structure more specifically—"Overview of Mainstream Models (Qwen/Llama/DeepSeek/Mistral)"—all four model names were listed. At this point, I basically think this question passed with perfect marks.

![# On page 3 of the same Word: 'Conclusion and Suggestions' has a colon, and below 'Reference Links' is a blank page](https://hyphentech.top/obsidian-assets/qwen3-8-27b-local-test/image-10-97edbeaa88.png)

I opened the file and realized it wasn't. I used an XML parser to read through the entire body: the entire document was only 879 words, with 11 main paragraphs plus 1 table, 0 hyperlink tags, and 0 instances of "http" appearing in the document. **The Qwen/Llama/DeepSeek/Mistral mentioned in the receipt were not found at all in the "Overview of Mainstream Models" section—that section only had a sentence "includes the following series:", then jumped directly to the next title. **

> [!note]
> The key issue is that these two numbers don't match, and **no matter how you use any caliber, they don't match**: body: 11 top paragraphs, 41 paragraphs including table cells, 1 table, 6 rows, 30 cells. The reply says 58 paragraphs and 6 tables, but I can't find a corresponding in the file. I also flipped through the preview PDF generated during the self-check step—3 pages, also three blank sections. **It's not that it wasn't checked, but after checking, it reported a document that didn't exist. **

| How do you say the receipt? | What is the actual document? | Question requirements |
| --- | --- | --- |
| Overview of Mainstream Models (Qwen/Llama/DeepSeek/Mistral) | There is only one sentence: "includes the following series," with four model names and none of them | Section 1: Overview of Mainstream Models |
| Hardware threshold (including VRAM level reference table) | The table exists, but the 5 columns of data are only paired with 4 headers | First, hardware thresholds |
| Conclusion and recommendations | There is only one sentence: "Give the following suggestion:" The main text is missing | Section 1: Conclusion and Recommendations |
| Reference link | After the title, the entire page is blank, and the entire text contains zero links | A list of reference links is attached at the end |
| passed = true, 58 paragraphs, 6 tables | 11 sections (total 41), 1 sheet, 879 characters | The final step is self-inspection and reporting the results |

※ Statistical scope: XML parser reads word/document.xml, body contains 13 elements—11 paragraphs + 1 table + sectPr.

There's also a small flaw: the brief opens with 'This briefing is based on multiple thematic guides published between March and June 2026,' but among the four sources it lists itself, the CSDN title clearly states the latest 2025 version. **Correct structure, authentic sources, fact-checking halfway, three blank sections in the main text**—this combination really illustrates the true position of the current local model.

| Title | Output | The result |
| --- | --- | --- |
| 1 · Three.js 3D cartoon scenes | Cartoon Island .html (372 lines) | ✅ All the elements are complete |
| 2 · Canvas mini-game "Catching the Star" | Catch the stars .html | ✅ Scores, particles, and spins are all present |
| 3 · Pure CSS 3D (JS banned) | 3D rotating display .html | ✅ Zero violations of the rules |
| 4 · Physical particle fireworks | Fireworks simulator .html | ✅ Gravity, trailing, and silhouettes are all present |
| 5 · Pixel RPG start screen | Pixel Hero .html | ⚠️ All functions are correct, layout differs by two lines of CSS |
| 6 · Search + Documentation toolchain | Localized deployment comparison .xlsx + local deployment survey briefing .docx | ⚠️ The website is completely authentic, but Word has three blank sections and self-checked to report a false number |

※ Environment: LocalBrain 1.1.0, temperature 0.65, low thinking level, maximum output per run 6144 tokens.

---

### ⏱️ ▍ Speed: Measured in minutes, not seconds

llama.cpp's logs keep the accounts very clear. On this machine, Qwen 3.8 ran a total of 144 generation cycles, 189,833 tokens, and pure generation took 254.3 minutes. The median generation speed was **13.43 tokens/second**, the quartile range was 12.56 to 13.88, the slowest was 7.64, and the fastest was 16.22. The input side was much faster, with a median preprocessing of 285.4 tokens/second. These 6 questions tested at temperature 0.65, thinking level low, and a single output limit of 6144 tokens. The first question alone took 4,305 words in the first round of thinking.

| Indicators | Measured values | Explanation |
| --- | --- | --- |
| Median generation speed | 13.43 tokens/second | Median of 144 creations |
| Maximum single generation | 940.6 seconds / 9,877 tokens | 10.50 tokens/second, about 15.7 minutes |
| One-time tool argument generation | 482 seconds / 9,868 characters | Write a complete HTML file in a single utility call |
| Input preprocessing | 285.4 tokens/second (median) | Maximum single input is 69,393 tokens |
| Default context window | 32,768 | When connecting to an external agent, you need to set it to 81,920 |

※ Data comes from local llama.cpp backend logs and session exports, cumulative, and does not only include these 6 questions.

The last line was stepped on. **Back then**, when it was connected to OpenCode, the system prompted that client to test about 66K tokens in actual tests, with the window remaining at default 32K. llama.cpp would directly reject every request, the client would keep retrying, and the user would see the phenomenon of "repeatedly outputting the same response." The 69,393 token input in the log was the on-site record of this incident. So now, I always run these models to the 80K window and disable inference decoding—stacking draft models in large windows makes memory peaks look ugly.

---

### 💰 ▍ Who earns, who loses, who doesn't speak

The 27B size isn't something you pick at random. **It just happens to be stuck in the range where consumer-grade unified memory can handle it**: 4-bit quantizes less than 18GB, 32GB RAM can run on machines, and above 48GB is comfortable. Going up one level means workstations, and the next level can't handle long workflows. Choosing this size and pairing it with Apache-2.0 clearly targets the local agent entry point. The official model card also zooms in on this type of score: Terminal Bench 2.1 jumped from 63.4 on Qwen 3.6-27B to 73.0, SWE-bench Pro from 53.5 to 61.7, QwenSWEBench from 49.3 to 79.0, OSWorld-Verified from 63.9 to 84.3, and DeepSWE 1.1 jumped from 13.3 to 42.2. **These are all reviews where the model does the work themselves, not chat reviews. **

Who earns: Sellers of unified memory and those selling graphics cards, because "whether it can run" has become a reason to buy a machine again. Who saves: For individual developers, if these six questions were charged per token, the bill for long tasks wouldn't look good. Who is silent: **The party charging by call volume has no incentive to tell you which tasks actually don't need to be uploaded. **The silent side's stance is often the conclusion.

But don't make all the fuss. A median of 13.4 tokens/second means waiting over ten minutes for a complex problem, which is unacceptable in the cloud. **Local models can now replace "slow waiting" work—batch processing, privacy-sensitive documents, code you don't want to share, not all the work.

---

### 🔓 ▍ Go review board: You can download it from the table of contents, but make the boundaries clear first

![# Discover the de-censorship model: one for the plain text version of Qwen 3.8 and one for the retained visual version, quantization file available (the screenshot is selected as the highest quality 8-bit file)](https://hyphentech.top/obsidian-assets/qwen3-8-27b-local-test/image-11-4c323876b3.png)

Official weight alignment is handled by the community, and **this script** has been playing out continuously on open-source models. Qwen3.8-27B is the same, and two mature lines have already emerged. There are different approaches: one uses Heretic to suppress the internal rejection direction of the model, while using KL divergence to constrain the original alignment ability, trying not to cut out other features as well; the other goes abliterated, only changing language weights. Both can be downloaded directly from LocalBrain's discovery page as quantized files, without having to piece together the long list of files from HuggingFace.

| Version | Method | Visual ability | Volume / Minimum memory |
| --- | --- | --- | --- |
| JonathanColetti/Qwen3.8-27B-Uncensored-GGUF | Heretic suppresses the direction of rejection and uses KL divergence constraints to maintain the original alignment capability | None (plain text) | 5bit 19.5GB / 32GB |
| Blackfrost-AI/Qwen3.8-27B-ABLITERATED-GGUF | abliterated, only changes language weight, keeping the visual projection as is | Yes | 5bit 20.2GB / 32GB |

※ Both have Qwen/Qwen 3.8-27B bases. The first is Apache-2.0; Quantization files 4-bit 16.8GB, 5-bit 19.5GB, 6-bit 22.4GB, 8-bit 29.0GB; 8-bit requires 64GB of memory.

The second line deserves a few extra words: the official Qwen 3.8-27B is itself a visual-language model, while abliterated only changes language weight, leaving the visual projection unchanged—so **"27B + able to read images + not easily rejected" all hold true**, which is rare in a size range where 4-bit can run. The plain text version takes a different approach, replacing the saved size with a higher quantization mode, also 5-bit 19.5GB, which delivers more stable response details than 4-bit.

> [!note]
> Two boundaries must be clearly defined. First, **I ran these six questions on the official Unsloth version; I haven't tested the actual performance of the review version** yet, so downloading doesn't mean I'm endorsing it. Second, the upstream repository often has more than a dozen quant files plus draft headers, totaling over 200 GB. When downloading, you must precisely lock on a single file, or else the entire repository can be dragged down in one go. Reviewing and correcting is a tendency to refuse answers, not to make you do illegal things—the legal and content responsibility still lies with you.

---

### 🧭 ▍ Should you install it? Which one should you install?

Back to the first three hours. **I answered all 6 questions, but I had to focus on every one**—checking if it secretly bypassed constraints, checking if the layout was correct, and whether there was anything in the promised section. The most important thing to remember was the comparison between questions 3 and 6: the same model could accurately explain how you wrote the cube, and also report 'passed = true' to a Word that had three blank sections. **You can trust what it submits, but you can't trust its evaluation of what it submits. **

| Your situation | Suggested version | Why? |
| --- | --- | --- |
| 32GB of RAM, I want to try it out first | Official 4-bit (17.6GB, including visuals) | Can view images, adjust tools, and has the smallest size |
| Over 48GB, mainly for use | Official 4-bit or review 5-bit | 5-bit replies have better details and are sufficient for plain text tasks |
| I want to look at the picture but don't want to be rejected | ABLITERATED 5bit (20.2GB) | Visual projection is retained, with the same base and context |
| External agents like OpenCode | Any version + 80K window | By default, 32K will be prompted by the system to burst instantly |

The getting started is very simple: select the quantization file on the LocalBrain discovery page and download it (with built-in Moda, HF domestic image, and HuggingFace official sources; auto-speed test is the fastest one), then go back to the homepage and click Launch. Once the model is ready, go to the talk page and use it directly. To connect development tools, go to the integration page and one-click write; Codex, OpenCode, and Claude Code are all included. Local services use standard OpenAI-compatible formats, listen \`http://127.0.0.1:11434/v1\`, and other OpenAI-compatible clients can also connect directly.

---

> [!note]
> To wrap it up in one sentence
> 
> Qwen3.8-27B pushes the issue of a "locally running multimodal agent model" a big step forward—four graphical problems passed in one go, zero violations of pure CSS hard constraints, and all four URLs found online are real. But it also falters at the last mile: two lines of CSS make the entire interface look horizontal; A Word with three blank sections but a self-check receipt says passed = true, 58 paragraphs, 6 tables. It's worth installing, provided you inspect it yourself; don't let it accept it too.

---

---

### 📚 ▍ Official information and reproduction entry

- Qwen3.8-27B Official Model Card: https://huggingface.co/Qwen/Qwen3.8-27B

- Weights used in this test unsloth/Qwen3.8-27B-GGUF:https://huggingface.co/unsloth/Qwen3.8-27B-GGUF

- Uncensored version JonathanColetti/Qwen3.8-27B-Uncensored-GGUF:https://huggingface.co/JonathanColetti/Qwen3.8-27B-Uncensored-GGUF

- Go Review + Visual Version Blackfrost-AI/Qwen3.8-27B-ABLITERATED-GGUF:https://huggingface.co/Blackfrost-AI/Qwen3.8-27B-ABLITERATED-GGUF

- LocalBrain (LocalBrain) Download: https://github.com/HackerChi-Hub/localbrain-releases/releases/latest


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
