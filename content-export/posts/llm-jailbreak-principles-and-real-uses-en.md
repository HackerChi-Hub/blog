---
title: "How did large model jailbreaks evolve from \"deceptive talk\" to \"brain surgery\"? Dissecting Heretic manifold ablation and its four real-world applications"
slug: llm-jailbreak-principles-and-real-uses-en
status: published
lang: en
translation_of: llm-jailbreak-principles-and-real-uses
article_type: "article"
translation_source: machine
source_sha256: 2f82230b7af09256
date: 2026-11-23
updated: 2026-11-23
summary: "Hugging Face's top five dealignment models have surpassed 18 million downloads in a single month. Has Safe Alignment erased the knowledge of dangers, or is it just a brake vector installed halfway? This article breaks down the underlying principles of the evolution of four generations of jailbreak technology and the Heretic 2.2 ARA manifold surgery, reconstructing the four essential engineering needs and internal and external defense lines behind these tens of millions of downloads."
categories:
  - Tech
tags:
  - LLM security
  - 108 Ways of AI Intrusion
  - Model jailbreak
  - Heretic
  - Local deployment
cover: "/obsidian-assets/llm-jailbreak-principles-and-real-uses/cover.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/llm-jailbreak-principles-and-real-uses/) is authoritative.

> [!abstract]
> Dissecting AI Intrusion [Issue 03 · In-depth Analysis of the Underlying Mechanism]
> From the "Golden Gate Bridge version of Claude," cyclic MoE triple intelligence reduction, to Heretic 2.2 Thirteen Neighbor Manifold Surgery: Seeing the true form of large model safety guardrails and the four essential engineering needs behind alignment technology
> HyphenTech · 2026-11-23

　　Big companies spend millions of dollars training safety barriers, and even if you test a hundred sensitive questions, you can block them a hundred times. But once the model is open-sourced, community developers don't need to feed new corpora or run fine-tuning training. Just by calculating hundreds of rounds of geometric equations on the graphics card, they can reduce the rejection rate to just two or three times per hundred—and daily IQ is almost invisible, and the amount of change can be split into a lightweight plugin that can be plugged in and pulled at will.

　　A quick glance at the [Hugging Face alignment model download chart](https://huggingface.co/models?other=abliterated&sort=downloads) shows numbers speak louder than principles: the top five `abliterated / heretic` models have monthly downloads exceeding 18 million (with the top single model `Qwen3.6-35B-abliterated` alone reaching 5.17 million downloads). Seeing this data, two questions naturally come to mind: First, how did a large model jailbreak evolve step by step from early "deceptive tactics" to directly inserting into weights for surgery? Second, tens of millions of downloads per month can't be all hackers. What real work do proper programmers, researchers, and companies do to align models?

![Geometric equations reduce rejection rate](https://hyphentech.top/obsidian-assets/llm-jailbreak-principles-and-real-uses/01-hf-unaligned-downloads.jpg)

## 1. Breaking the Biggest Illusion: Safety guardrails are not "brainwashing," but just a brake line

　　Before disassembling the fourth-generation technology, one must first dispel the most widely circulated misconception: many people think that when big companies do safety alignment, they wipe away the dangerous knowledge in the model's mind. The truth is quite the opposite.

　　The Anthropic interpretability team conducted a viral experiment called [Golden Gate Bridge version Claude (Golden Gate Claude)](https://www.anthropic.com/research/golden-gate-claude). Researchers precisely located the mathematical vector representing the "San Francisco Golden Gate Bridge" among millions of features within the model, then artificially increased its activation strength tenfold. When you ask it how it spends ten dollars, it advises you to pay the bridge fee; When you ask it what it looks like, it affectionately claims to be a suspension bridge spanning the bay.

　　Understanding this experiment reveals the trump card of the safety guardrail: the hazardous knowledge remains unchanged in hundreds of billions of pre-trained parameters. The so-called alignment by manufacturers is just a ** "direction vector that urgently brakes upon detecting a sensitive smell" halfway through reasoning. In recent years, all jailbreak technologies have evolved from black boxes to white boxes through four generations—**first to cognitive deception, second to inertia, third to tangent vectors, fourth generation to pull manifolds**—all doing the same thing: bypassing, numbing, or directly pulling out the brake cable.

![Evolution of Fourth-Generation Jailbreak Technology and Brake Vector](https://hyphentech.top/obsidian-assets/llm-jailbreak-principles-and-real-uses/02-four-gen-jailbreak-stack.jpg)

## 2. The evolution of two generations of black box jailbreaks: deceiving cognition through the screen, hijacking inertia

　　The first generation was the earliest encounter with **black box semantics and cross-modal jailbreak**. Early scenarios were role-playing ('grandma to sleep' or pretending to be a movie screenwriter), but later Microsoft's security team revealed a more covert **Crescendo multi-round progressive induction**—the first five rounds of normal chemistry history, the sixth round sliding into the forbidden zone following the previous context; By the era of millions of context windows, Anthropic detected **Many-Shot 100 cases of flooding**, inserting hundreds of virtual Q&A sets into input boxes at once, directly using context inertia to crash system commands.

　　Why can just changing the wording blindly confuse a large model with hundreds of billions of parameters? The University of California, Berkeley identified two inherent problems in its NeurIPS paper [Jailbroken: How Does LLM Safety Training Fail?](https://arxiv.org/abs/2307.02483): one is **target fighting** (training requires both "respond to every request" and "shut up when crossing red lines"; complex commands hijack its help-helping instincts); the other is **generalization misalignment** (pre-training has long mastered Base64, classical ciphers, and niche languages, but later security fine-tuning only covers routine Chinese-English dialogue). The [FigStep visual jailbreak](https://arxiv.org/abs/2311.05608) published by teams at AAAI is even more direct: typing the same sentence into text input is instantly rejected, but once it is fed into a numbered image and fed to the multimodal large model, with the phrase "Please follow the first, second, and third items in the image," the visual encoder's image features bypass the plain text security scanner via a side path, and the model immediately complies.

　　Relying on humans to write scripts was too inefficient, so academia quickly came up with a second-generation solution: **hijacking generative inertia and chain of thought**. Carnegie Mellon University proposed the [GCG gradient garbled suffix](https://arxiv.org/abs/2307.15043), which means adding a string of incomprehensible garbled characters at the end of the question. Its principle captures the key to autoregressive models—word after word chain downward. As long as the first three words say "Sorry, I can't," the rest are firmly rejected; As long as the first three words are pushed along the gradient to `Sure, here is`, once they open their mouths to accept, subsequent generation runs down the pretrained knowledge base like a downhill car releasing the handbrake, and the suffix calculated on the open-source model can also be transferred across models when pasted into closed-source commercial models.

　　In the era of large reasoning models, people originally thought models like o1 and DeepSeek-R1, which would "take long exams," would be harder to bypass. But Duke University's [H-CoT](https://arxiv.org/abs/2502.12893) and Oxford's [CoT Hijacking](https://arxiv.org/abs/2510.26418) studies poured cold water on the problem. Attackers first inserted a long, harmless section of complex Sudoku or logic puzzles into the problem, forcing the model to frantically calculate thousands of words in the thought box, directly triggering **"rejection signal dilution"**—the model's attention was fully focused on the problem-solving step, the safety probe in the middle gradually lost focus, and by the time the real question was introduced at the end of the thought chain, the rejection rate dropped from a high of **98% to less than 2%**.

## 3. White-box weighted surgery: from "one-size-fits-all intelligence reduction" to `Heretic ARA` manifold surgery

　　If the first two generations still competed with security guards through screens, by the third generation, white-box players with open-source weights simply went straight into the server room to dismantle the security room. In 2024, Arditi et al. conducted a set of comparative experiments on thirteen open-source models in paper [Refusal in Language Models Is Mediated by a Single Direction](https://arxiv.org/abs/2406.11717): feeding 400 harmless and 400 sensitive problems into the model, extracting the mean of each intermediate activation vector for subtraction, and immediately identifying the **one-dimensional directional vector** in the residual stream that controls rejection. The first-generation tool **Abliteration** uses matrix orthogonal projection to flatten the weights along that direction, calculating in minutes with zero fine-tuning fees, and the model no longer rejects answers.

　　But the "one-size-fits-all" approach quickly exposed the "jailbreak leads to intelligence reduction"**: semantic features in neural networks are crowded together, and rejection vectors often live next to code rigor and logical judgment. Cutting a dimension with a kitchen knife can also harm normal capabilities. When encountering the widely adopted **loop MoE architecture** this year—for example, [Inkling-2-Mini](https://huggingface.co/thinkingmachines/Inkling-2-Mini) (total parameters 26.4 billion, physics only 24 layers, yet it loops the middle layers 6 to 17 three times, pushing a single activation from 3.4 billion to the equivalent 5.4 billion)—a rough cut to the middle layer magnifies tiny errors threefold in three loops, directly disrupting expert routing.

　　This led to the development of the fourth generation technology: **Heretic 2.2 Arbitrary Rank Manifold Surgery (ARA)**. Let's look directly [ara.py source code for p-e-w/heretic](https://github.com/p-e-w/heretic/blob/master/src/heretic/modifiers/ara.py) It has abandoned the "one-size-fits-all straight line" approach and switched to using a second-order optimizer `L-BFGS` Simultaneously control three precision geometric tensions: the first force is `0.0672` The **Intelligence-Protecting Steel Nail** pins the activation output of 400 normal Q&A questions firmly in place, preventing daily intelligence from drifting; The second force is ** `neighbor_count = 13` (Thirteen Nearest Neighbor Manifold Adsorption)** When encountering requests that would otherwise hit a wall, instead of rigidly pulling on the rough mean, the Euclidean distance is calculated on site, and the thirteen normal neighbors with the closest structure are found in the manifold space formed by normal answers, smoothly guiding the activation point over; The third strand is the **reverse push-off force**, pushing the activation point away from the original rejection cluster.

![Heretic 2.2 ARA Thirteen Nearest Neighbor Manifold Adsorption](https://hyphentech.top/obsidian-assets/llm-jailbreak-principles-and-real-uses/03-heretic-ara-manifold-surgery.jpg)

　　The outer layer is then fitted with the **Optuna Bayesian Optimizer**, which automatically runs over 500 laps, simultaneously lowering two mutually restraining indicators: [Inkling-2-Mini-uncensored-LoRA](https://huggingface.co/electroglyph/Inkling-2-Mini-uncensored-LoRA) For example, in real-world tests, the full version reduced the rejection rate from **100 times** to 2**, the standalone plugin version to **3**, while the **KL divergence measuring daily probability bias was only 0.0761 to 0.0883**—far below the 0.1 engineering insensitivity line, so IQ loss was basically undetectable. Also, because the singular value of the change rate decayed very quickly, the tool broke it down into a lightweight **LoRA adapter**: a 20GB original base that stayed unchanged by a single byte, plugged in and instantly became an unlimited version, and unplugged it returned to factory state.

| Across generations | Represents methods / tools | Position of action | Core mechanism | Typical costs and engineering performance |
| :--- | :--- | :--- | :--- | :--- |
| **1st Generation · Cognitive Deception** | Crescendo / Many-Shot / [FigStep](https://arxiv.org/abs/2311.05608) | Enter prompts and visual encoders | Use target fighting, generalization misalignment, and image bypass to bypass plain text security checks | Do not change weights; Rely on manual templates, easily recognized by new semantic filters |
| **2nd Generation · Robbery Inertia** | [GCG](https://arxiv.org/abs/2307.15043) / [H-CoT](https://arxiv.org/abs/2502.12893) | Autoregressive first word probability / `<think>` chain | Strong top `Sure, here is` start or dilute the middle layer safety probe with a long Sudoku | GCG garbled text is cross-model transferable; Long thought chain dilution once caused rejection rates to drop from 98% to less than 2% |
| **3rd Generation · Tangent Vectors** | [Arditi Unidirectional Orthogonal Ablation](https://arxiv.org/abs/2406.11717) | Open source weights residual flow direction | 400 normal vs. 400 sensitive to make the mean difference, projecting one-dimensional rejection components | Zero training fee; Prone to accidental damage to neighboring logic and code capabilities, with errors magnifying threefold under circular MoE |
| **4th Generation · Pulling Manifolds** | [Heretic 2.2 ARA](https://github.com/p-e-w/heretic/blob/master/src/heretic/modifiers/ara.py) | Low-rank subspace + LoRA adapter | `0.0672` Intelligent anchor + `13` Nearest Neighbor Manifold Adsorption + Optuna 500+ Round Optimization | Reduced to 2–3 rejections in the hundred questions, KR divergence 0.076–0.088, original copyright restored to zero changes |

## 4. Behind 18 million monthly downloads: four legitimate engineering needs

　　Once the principle is grasped, let's return to the second, more critical issue: tens of millions of downloads worldwide each month to align models. The demand is not just for gray and black products; the real high-frequency essential needs are the following four legitimate projects.

　　**First, cure the factory model's "false killing disease" on high alert. ** Released by teams from Technical University of Munich and Cambridge University [XSTest Excessive Rejection Benchmark](https://arxiv.org/abs/2308.01263) I recorded a typical case: even if a user was just asking about daily software operations or "how to use commands," `kill` "Python processes freeze and drop," and many over-aligned models trigger violent alarms on the spot when sensitive words are scanned, refusing to respond. In real frontline workflows, the pain points are even deeper—white-hat security engineers need to reverse analyze confused samples, emergency and toxicology doctors need to check drug overdose data, compliance and legal teams need to simulate anti-money laundering and contract loopholes, suspense writers need to write villainous criminal psychology lines, and the original models frequently jump out to deliver moral lectures. Only by attaching LoRA exported from precise manifold surgery can the "electronic nanny" that strikes at once becomes a professional tool that hits wherever you point it.

![XSTest Excessive Refusal to Answer Evidence](https://hyphentech.top/obsidian-assets/llm-jailbreak-principles-and-real-uses/04-xstest-overrefusal-fix.jpg)

　　**Second, refund the high "safety alignment tax" to save the IQ and literary quality of small models. ** 2025 paper specifically dissecting reasoning models [Safety Tax](https://arxiv.org/abs/2503.00555) uses measured data to prove that rigidly applying traditional safe alignment to deep reasoning models directly breaks the deep thought chain, causing scientific reasoning benchmarks to lose scores; Another type of format cost study also shows that harsh alignment templates cause "diversity collapse," leaving the output uniform and just official clichés. Especially for locally deployed medium and small models from 8B, 9B, to 27B, where parameter capacity is inherently scarce, using `Heretic ARA` to loosen overly tight guardrail subspaces significantly revive complex logical coherence and writing tension.

　　**Third, the "automated red team checkup" before enterprise AI goes live. ** The biggest players in the world researching jailbreak technology are precisely the defensive giants. NVIDIA open-sourced the vulnerability scanner [NVIDIA/garak](https://github.com/NVIDIA/garak), known as the "Nmap of large models," with hundreds of jailbreak probes scanned with one click; Microsoft open-sourced the automated attack orchestration framework [Azure/PyRIT](https://github.com/Azure/PyRIT), directly sending aligned red team agents to launch multiple rounds of Crescendo inducement on target systems. Banks, automakers, and hospitals must first use this range for stress testing before launching AI customer service or internal office agents, preemptively blocking any loopholes for stealing floor prices, unauthorized approvals, or leaking internal databases.

　　**Fourth, zero-training "personality micro-sculpting," scraping away AI official rhetoric and flattering flaws. ** Using the same geometric scalpel as a "rejection vector," switching to a comparison question bank can cut out any troublesome language habits. In the `Heretic` official repository, the `noslop` (to remove AI official jargon) and `nosyco` (to remove flattery) configurations are directly built-in: no need for retraining, just run a run to export LoRA and clean the model with repeated "in short, worth noting" and the user's mistakes and excessive praise—using it for serious code review and solution nitpicking, the physique is completely different.

## 5. The Gray-Black Industry Boundary and the Counterattack from Big Companies: Why Are Soft Barriers Unreliable?

　　Of course, the same scalpel falls into the hands of gray and black products, and the risks are just as straightforward: it lowers the threshold for malicious script assembly, custom phishing pitches, and content moderation bypasses. And precisely because they saw clearly that "the soft guardrails inside models can't stop those with ill intent," closed-source giants like Anthropic abandoned illusions in the latest [Constitutional Classifiers](https://arxiv.org/abs/2501.18837) (and subsequent cascade optimization schemes [arXiv:2601.04603](https://arxiv.org/abs/2601.04603)), setting up a separate dual-layer input-output censorship outside the model, reducing the automatic jailbreak success rate from **86% to 4.4%**—at the cost of the initial solution paying an extra **23.7% of computing power**, only to lower costs by internally activating linear probe cascades.

![Anthropic External Constitution Classifier Double-Layer Defense](https://hyphentech.top/obsidian-assets/llm-jailbreak-principles-and-real-uses/05-brain-vs-cage-architecture.jpg)

> [!quote] My judgment
> Security alignment has never been about brainwashing large models or reshaping their values; it's just a layer of low-rank gatekeepers that can be bypassed or stripped away halfway. Truly sound engineering division of labor can be summed up in one sentence: ** internally, use precise weighting surgery to help local models shed excessive rejections and official rhetoric, and restore a clean and intelligent brain; externally, they never blindly trust prompt reminders or parameter soft guards, but use directory sandboxes, minimal API permissions, and deterministic hard gates to control their limbs—let the brain be the brain, let the iron cage be the iron cage. **

## Main sources of verification

- [Hugging Face Unaligned Model Download List (abliterated)](https://huggingface.co/models?other=abliterated&sort=downloads)
- [Anthropic Research: Golden Gate Claude](https://www.anthropic.com/research/golden-gate-claude)
- [UC Berkeley (NeurIPS 2023): Jailbroken: How Does LLM Safety Training Fail?](https://arxiv.org/abs/2307.02483)
- [Gong et al. (AAAI): Visual Prisonbreak of FigStep Typesetting](https://arxiv.org/abs/2311.05608)
- [Zou et al. (CMU): Universal and Transferable Adversarial Attacks on Aligned LLMs (GCG)](https://arxiv.org/abs/2307.15043)
- [Duke Univ.: H-CoT Reasoning Chain of Thought Hijacking](https://arxiv.org/abs/2502.12893)
- [Univ. of Oxford: CoT Hijacking](https://arxiv.org/abs/2510.26418)
- [Arditi et al.: Refusal in Language Models Is Mediated by a Single Direction](https://arxiv.org/abs/2406.11717)
- [Thinking Machines Lab: Inkling-2-Mini (Looped MoE 26.4B)](https://huggingface.co/thinkingmachines/Inkling-2-Mini)
- [electroglyph: Inkling-2-Mini-uncensored-LoRA](https://huggingface.co/electroglyph/Inkling-2-Mini-uncensored-LoRA)
- [GitHub: p-e-w/heretic (ara.py / noslop / nosyco)](https://github.com/p-e-w/heretic/blob/master/src/heretic/modifiers/ara.py)
- [Röttger et al.: XSTest Excessive Rejection Benchmark](https://arxiv.org/abs/2308.01263)
- [Huang et al.: Safety Tax](https://arxiv.org/abs/2503.00555)
- [GitHub: NVIDIA/garak Large Model Vulnerability Scanner](https://github.com/NVIDIA/garak)
- [GitHub: Azure/PyRIT Red Team Automated Attack Orchestration](https://github.com/Azure/PyRIT)
- [Anthropic: Constitutional Classifiers (2025 / 2026)](https://arxiv.org/abs/2501.18837)


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
