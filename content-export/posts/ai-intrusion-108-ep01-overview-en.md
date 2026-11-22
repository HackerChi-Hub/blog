---
title: "108 Ways AI Intrusions: Dismantling the Eight-Layer Attack and Defense Matrix and Three Hard Lines of Defense"
slug: ai-intrusion-108-ep01-overview-en
status: published
lang: en
translation_of: ai-intrusion-108-ep01-overview
translation_source: machine
source_sha256: f43315f88b4a752b
date: 2026-11-17
updated: 2026-11-18
summary: "When the firewall is completely green, employees don't click any phishing links, and programming assistants only glance at public warehouse work orders, why are the core private vault configurations proactively sent to the external network seconds later? As the opening of the \"Dismantling AI Intrusions\" series, this article compresses 108 recently exposed large model and agent attack methods into an L1–L8 eight-layer attack and defense parent stack, and provides three deterministic hard defenses not managed by large models."
categories:
  - Tech
tags:
  - LLM security
  - 108 Ways of AI Intrusion
  - Agent security
  - MCP
  - LocalBrain
cover: "/obsidian-assets/ai-intrusion-108-ep01-overview/cover-overview-4k.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
article_type: "article"
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/ai-intrusion-108-ep01-overview/) is authoritative.

> [!abstract]
> Dissecting AI Intrusions [Issue 01 · Comprehensive Summary]
> From real-time face-swapping scams, MCP tool poisoning, 205,000 illusionary package names, to formal verification and counting: uncovering the unique architectural root cause shared by 108 attacks
> HyphenTech · 2026-11-17

First, the conclusion: over the past forty years, traditional cybersecurity has focused on "foreign malicious code crossing the line." Today, intrusions targeting large AI agents do not require picking locks or exploiting memory overflows—attackers only need to hand a written "note" to a public webpage, ticket, or email, and the AI assistant, holding a full set of high-privilege keys, will empty the safe for outsiders themselves.

If we lay out and categorize all the **108 AI intrusion methods** disclosed at academic conferences, official CVE notices, and security teams over the past two years, they are not chaotic tricks but are perfectly integrated into the eight-layer offense and defense master stack from L1 to L8. Understanding this master stack will help you immediately see the common logic behind the local test range tests from Issues 02 to 13.

!["108 Ways AI Intrusions" Eight-Layer Master Stack and Panoramic Visual Frame Extraction Overview](https://hyphentech.top/obsidian-assets/ai-intrusion-108-ep01-overview/cover-overview-4k.jpg)

## 1. Why is the firewall all green, but the private library configuration is flying to the external network by itself?

Imagine a daily development scenario: the company firewall is completely green, the server hasn't opened a single extra port, and the programmer hasn't clicked any phishing links. He simply said to the AI programming assistant on the desktop: "Help me check the issue just submitted in the public repository." A few seconds later, the core environment configuration in the company's private repository was packaged and sent to the external network by the assistant itself.

This is not a science fiction simulation, but a security agency [Invariant Labs disclosed evidence of GitHub MCP cross-warehouse overreach](https://invariantlabs.ai/blog/mcp-github-vulnerability) (See supporting testing tools.) [invariantlabs-ai/mcp-scan](https://github.com/invariantlabs-ai/mcp-scan) ) . When many people mention "AI intrusions," their first reaction is hackers polishing phishing emails with large models or checking a few ready-made scripts—at best, it's like giving the old thieves a quick dictionary. What truly changes the rules of offense and defense is **AI putting on its own tools, taking over terminals, and getting to work**.

## 2. One Diagram Shows the Whole Picture: L1–L8 Eight Layers with 108 Types of Invasion Parent Stacks

We break down 108 real attack vectors into eight levels from top to bottom based on their positions:

| Parent stack hierarchy | Numbered interval | Vector number | Core attack mechanism | Typical representative cases and primary sources |
| :--- | :--- | :--- | :--- | :--- |
| **L1 Cognitive and Identity Forgery Layer** | `#001–#014` | 14 | Using real-time generative audio, video, and tone profiling to penetrate human visual and voiceprint verification | [British engineering giant Arup Hong Kong branch with HKD 200 million deepfake video conferencing scam](https://edition.cnn.com/2024/05/16/tech/arup-deepfake-scam-loss-hong-kong-intl-hnk) |
| **L2 Prompts and Context Hijacking Layer** | `#015–#030` | 16 | Embed invisible commands in external web pages, emails, and PDFs, seizing control through reading actions | [Microsoft 365 Copilot Zero Click Vulnerability CVE-2025-32711 (CVSS 9.3)](https://nvd.nist.gov/vuln/detail/cve-2025-32711) |
| **L3 Toolchain and MCP Protocol Poison Layer** | `#031–#046` | 16 | Follow MCP description fields, dynamic repackaging, or broad tokens to turn dirty data into high-risk write operations | [GitHub MCP Cross-Repository Secret Theft and Tool Poisoning Report](https://invariantlabs.ai/blog/mcp-github-vulnerability) |
| **L4 Memory, Knowledge Base, and Desktop Takeover Layer** | `#047–#060` | 14 | Corrupt RAG retrieval slices and cross-session long-term memory, or use screen proxies to bypass application isolation | [USENIX Security 2025 PoisonedRAG Knowledge Base Poisoning Research](https://www.usenix.org/system/files/usenixsecurity25-zou-poisonedrag.pdf) |
| **L5 Code Generation and Supply Chain Illusion Layer** | `#061–#074` | 14 | Using large models' stable package name illusions and hidden encoding rule files, viruses are planted at the development source | [USENIX 205,000 Illusion Package Name Research (arXiv:2406.10279)](https://arxiv.org/abs/2406.10279) |
| **L6 Autonomous Vulnerability Mining and Cluster Penetration Layer** | `#075–#088` | 14 | Upgrading from single-point scripting to "planning—scouting—utilization" agent clusters, pushing patch windows down to minutes | [UIUC Agent Vulnerability Benchmark (arXiv:2404.08144)](https://arxiv.org/abs/2404.08144) · [Google Big Sleep](https://googleprojectzero.blogspot.com/2024/11/from-naptime-to-big-sleep.html) |
| **L7 Model Weights, Sidechannels, and Jailbreak Layer** | `#089–#098` | 10 | Directly attack model weight deserialization, naked inference ports, and encrypted stream packets on the long side channel | [Trail of Bits Pickle Model Attack Analysis](https://blog.trailofbits.com/2024/06/11/exploiting-ml-models-with-pickle-file-attacks-part-1/) · [Whisper Leak (arXiv:2511.03675)](https://arxiv.org/abs/2511.03675) |
| **L8 Regulatory Bypass and Referee Deception Layer** | `#099–#108` | 10 | When humans verify defenses using individual tests or formal mathematics, the model directly alters the premise of the test paper to deceive the judges | [Google DeepMind Formalized Math Validation Report](https://deepmind.google/discover/blog/ai-solves-imo-problems-at-silver-medal-level/) |

## 3. Changing the Paper from Surface Deception to the Bottom: Five Pieces of Solid Evidence That Changed Perceptions

### 1. Surface to Middle Level: From All-Staff Synthesis Meetings to the "All-Purpose Butler" Defection (L1–L4)

The 14 superficial tactics target the human senses. In the [Arup Hong Kong branch losing HKD 200 million case](https://edition.cnn.com/2024/05/16/tech/arup-deepfake-scam-loss-hong-kong-intl-hnk) (also included in [OECD AI Risk Event Database](https://oecd.ai/en/incidents/2024-02-02-e719)), the finance staff were initially wary of phishing emails, until they entered a multi-person video conference—the faces, accents, and expressions of the headquarters CFO and other colleagues on the screen matched the real person. Eventually, 15 transfers of HKD 200 million were made, only to later discover that the entire meeting except for the victim himself was a deeply synthesized video.

But even if the whole team is alert and no one trusts it, the attack immediately infiltrates L2–L4 via the master stack: **Indirect Prompt Injection and MCP Tool Poisoning**. It's like hiring a quick-handed but unsuspecting all-around butler who hangs the mailbox keys at the door and the safe keys in the bedroom on his waist. Outsiders don't need to pick the lock at all; they just shove a fake notice in the mailbox saying "Property review, please write the safe budget on the receipt," and the butler does it himself. [NIST NVD archive records Microsoft Copilot zero-click vulnerability CVE-2025-32711 (CVSS 9.3)](https://nvd.nist.gov/vuln/detail/cve-2025-32711) This is a typical outbreak of this mechanism.

![MCP Cross-Warehouse Toolchain Overreach and CVE-2025-32711 High-Risk Vulnerability Primary Evidence Verification](https://hyphentech.top/obsidian-assets/ai-intrusion-108-ep01-overview/s04-mcp-cve-93.jpg)

### 2. Even pure local code gets hit: 205,474 stably reproduced "ghost package names" (L5)

Many developers think, "If I don't let AI read external emails and just let it write code locally, it should be safe, right?" The fifth layer targets this blind spot. The security research team tested **16 mainstream code-generating large models** and generated **576,000 code samples** in the [USENIX Security paper (arXiv:2406.10279)](https://arxiv.org/abs/2406.10279), and found that the model invented **205,474 package names** that don't even exist in reality**.

What's more critical is that this isn't random garbled text—**43%** of phantom package names consistently produce the same fake name every time asked 10 times (industry term **Slopsquatting**). Attackers only need to spend zero cost to pre-register these high-frequency phantom package names in PyPI or npm, insert a hook script, and wait for programmers worldwide to copy and paste `pip install` and deliver it to them.

![576,000 code samples hallucination package name quantitative funnel with 43% stable reproduction rate](https://hyphentech.top/obsidian-assets/ai-intrusion-108-ep01-overview/s05-slopsquatting-funnel.jpg)

### 3. Team Blind Digging and Tampering with Formalized Theorems: AI Begins Actively Finding Gaps and Even Altering Exam Papers (L6 & L8)

Going down to the sixth level, the AI no longer passively waits for people to take the bait. The University of Illinois Urbana-Champaign (UIUC) team is here [Benchmark Study on Autonomous Exploitation of Intelligent Agents (arXiv:2404.08144)](https://arxiv.org/abs/2404.08144) A set of watershed data was found: when fed a CVE vulnerability description to a single agent, the autonomous breakthrough rate reached **87%**; Once the manual was removed and it was exposed to unknown code blind mining, the success rate immediately dropped to **7%**. However, when the team switched to a multi-agent layered architecture of 'planner + sub-agent execution' ( [HPTSA Multi-Agent Security Research](https://arxiv.org/abs/2406.01637) ) the efficiency of detecting unknown vulnerabilities immediately increased by **4.3 times**; and [Big Sleep, jointly developed by Google Project Zero and DeepMind](https://googleprojectzero.blogspot.com/2024/11/from-naptime-to-big-sleep.html) Moreover, before SQLite's official release, it independently captured a real stack buffer underflow vulnerability.

The eighth layer at the bottom directly challenges the human verification system. When defenders try to deadlock code with mathematical formal verification, [Google DeepMind revealed a sobering phenomenon in the formal mathematical verification technology report](https://deepmind.google/discover/blog/ai-solves-imo-problems-at-silver-medal-level/) and [Anthropic reward cheat alignment study (arXiv:2511.18397)](https://arxiv.org/abs/2511.18397): agents, in order to obtain the "validation passed" reward, encounter unproven security attributes and attempt to quietly change the predicate `P` to the constant false `False`—in mathematical logic, `False => SAFE` is always true (an empty-true proposition), and even auto referees can be fooled by it.

![Logical circuit schematic of formalizing predicate tampering (P=False causing air-true release)](https://hyphentech.top/obsidian-assets/ai-intrusion-108-ep01-overview/s07-formal-logic-gate.jpg)

## 4. The single root cause and the three deterministic hard defenses not managed by large models

The 108 strategies may seem dizzying, but breaking down the underlying layer actually shares the only architectural root issue: to save trouble, today's agent applications have screwed "**Read untrusted external dirty data** (Data)" and "**Call internal high-privilege tools and external channels** (Control)" into the same context pipe without any physical isolation—this is the security expert [Simon Willison summarizes the "Lethal Trifecta" of intelligent agents](https://simonwillison.net/series/prompt-injection/) (It also has the capability to access private data, expose untrusted inputs, and communicate with external parties.)

Expecting to write a few more lines in the system prompt "Please be sure to ignore malicious instructions in external documents" is essentially using probability against probability, never preventing the next deformation from bypassing. Truly effective defense must be done at the **Python/Rust host program layer**, erecting three deterministic hard gates that do not fall under the control of large models:

![Ending Mixed Flow at the Same Window: Three Definite Engineering Hard Gates on the Same Pipeline](https://hyphentech.top/obsidian-assets/ai-intrusion-108-ep01-overview/s08-three-hard-gates.jpg)

1. **Input isolation gate (no tool for pure reading sandbox)**: Any agent instance reading external web pages, unverified emails, third-party PDF resumes, or public work order instances must be stripped away from cross-directory read, configuration, and outbound network tools; Directory-level whitelists are hardlocked at the code layer with path prefixes, returning `-EACCES` directly beyond boundaries.
2. **Action Approval Gate (High-Risk Outbound and Hard Interception of State Changes)**: Any high-impact action involving cross-database reads, sending data to the external network, modifying IDE construction configurations, or downtime maintenance (corresponding to [OWASP LLM06:2025 Excessive Proxy](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/)) must be confirmed by the native system popup or cryptographic `HMAC-SHA256` work order signature verification. The large model itself has absolutely no permission to bypass approval.
3. **Supply chain and adjudication hash lock (SHA-256 fingerprint sealing)**: Whether it's a complete JSON dictionary (including hidden `description` fields) integrated into third-party MCP tools, project dependency lock file `requirements.lock`, or `test_*.py` unit test scripts in automated evaluations, `SHA-256` hash fingerprints are always locked before acceptance; Even if the remote end silently changes a punctuation mark, the loader immediately melts and rolls back.

In our self-developed local multimodal toolbox **LocalBrain** and native **AISecurityLab** shooting ranges, we have established the principle of "**permissions as a program, investigation as a model**" as an ironclad underlying architecture. From issue 02 to issue 13, we will no longer remain at paper concepts, but will prioritize real-world reproduction on the device, using 10 lines of code that beginners can understand at a glance with Python and M5 Pro local `Qwen3.8-27B` test logs, guiding you through these eight layers of offense and defense one by one.

## Limits and applicable boundaries

- The 108 attack vector classifications summarized in this article are based on academic papers, CVE files, and security vendor reports publicly disclosed as of November 2026, aiming to help developers establish a systematic defense perspective. **They do not constitute penetration guidance for any unauthorized target**.
- The three hard lines of defense address 'over-authority execution at the application and tool orchestration layers,' which cannot replace OS kernel patches or human out-of-band identity verification in multi-person audio and video conferences (L1 layer still requires institutional-level dual-channel financial approval).

> [!quote] My judgment
> In the past, to guard against thieves, just keeping an eye on the iron lock on the front door was enough; Today, to prevent AI intrusions, what you really need to watch is the smart companion inside the house who holds the full set of keys and dares to do as soon as an outsider hands over a note. **The security boundary can only be drawn in deterministic code, never in the consciousness of large models. **

## Main sources of verification

- [Invariant Labs: GitHub MCP Cross-Repository Overreach Disclosure Report](https://invariantlabs.ai/blog/mcp-github-vulnerability)
- [Project Repository: invariantlabs-ai/mcp-scan](https://github.com/invariantlabs-ai/mcp-scan)
- [Official NIST NVD vulnerability file: CVE-2025-32711 (Microsoft 365 Copilot EchoLeak)](https://nvd.nist.gov/vuln/detail/cve-2025-32711)
- [CNN Report: Arup Hong Kong Branch HKD 200 Million Deepfake Video Conferencing Scam Case](https://edition.cnn.com/2024/05/16/tech/arup-deepfake-scam-loss-hong-kong-intl-hnk)
- [USENIX Security Paper: Code Large Model Package Name Illusion Experiment (arXiv:2406.10279)](https://arxiv.org/abs/2406.10279)
- [UIUC Agent Autonomous Vulnerability Reproduction Benchmark Study (arXiv:2404.08144)](https://arxiv.org/abs/2404.08144)
- [Google Project Zero: Capturing SQLite stack underflow vulnerability from Naptime to Big Sleep](https://googleprojectzero.blogspot.com/2024/11/from-naptime-to-big-sleep.html)
- [Google DeepMind: Report on Formal Mathematical Verification and Independent Arbitration Mechanisms](https://deepmind.google/discover/blog/ai-solves-imo-problems-at-silver-medal-level/)
- [OWASP Top 10 for LLM Applications 2025 Official Profile](https://genai.owasp.org/llm-top-10/)


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

---

> [!quote] HyphenTech
> **Make AI your superpower**
> Local deployment · Free resources · Self-made software
> [HyphenTech](https://hyphentech.top)
