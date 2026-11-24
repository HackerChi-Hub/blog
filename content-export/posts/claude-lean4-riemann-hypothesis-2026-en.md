---
title: "Claude teams up with Lean 4 to prove the 167-year Riemann Hypothesis: the mechanical referee revolution behind 17 million lines of code with zero errors"
slug: claude-lean4-riemann-hypothesis-2026-en
status: published
lang: en
translation_of: claude-lean4-riemann-hypothesis-2026
translation_source: machine
source_sha256: 11a8b996350f8cb3
date: 2026-11-23
updated: 2026-11-24
summary: "Without complicated formulas, this article will break down what the Riemann Hypothesis was all about, the two major misconceptions about online banking codes and the million-dollar jackpot, and how ordinary people can tame AI with three mechanical referees."
categories:
  - Tech
tags:
  - AI
  - Riemann Hypothesis
  - Claude
  - Lean4
cover: "/obsidian-assets/claude-lean4-riemann-hypothesis-2026/cover-05ff10eadf.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
article_type: "article"
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/claude-lean4-riemann-hypothesis-2026/) is authoritative.

> [!abstract]
> Without complicated formulas, this article will break down what the Riemann Hypothesis was all about, the two major misconceptions about online banking codes and the million-dollar jackpot, and how ordinary people can tame AI with three mechanical referees.
> 2026-11-23 · HyphenTech

　　On November 20th, the mathematics and AI communities experienced a dramatic upheaval on the same day. Anthropic mathematics researcher Levent Alpöge posted a brief statement of only **4 pages** on his personal homepage [alpo.ge](https://alpo.ge/remark.pdf), along with **14 **source code compressed packages**. He announced that he and Claude spent **6 weeks** to complete a formal proof of the generalized Riemann Hypothesis and the standard Riemann Hypothesis hanging over humans for **167 years**.

　　The unusual thing is that he never submitted a long paper in a traditional mathematics journal. He made the reason blunt in his statement: if you unfold the draft from the AI simulation process into a natural language English article, it would be a full **250,000 pages**, and even he complained that it was a bunch of tedious nonsense that no one could get through. So he simply handed over **17 million lines** and over **175,000** files of Lean 4 program code.

![Levent Alpöge Personal Homepage Statement and Volume Source Code Entry](https://hyphentech.top/obsidian-assets/claude-lean4-riemann-hypothesis-2026/image-alpo-home-63340448ff.png)

　　Just one day later, on November 21, the most authoritative formal mathematics organization, the Lean community and the Mathlib team, released the [official joint certification statement](https://leanprover-community.github.io/blog/posts/riemann-hypothesis/). Dozens of independent research groups worldwide compiled the entire source code overnight on their computers, ultimately passing it with **zero errors**: this **17 million lines** of code did not steal propositions or contain proprietary plugins; it truly locked in the standard version of the Riemann Hypothesis.

![Lean and Mathlib Community Joint Authentication Original Text](https://hyphentech.top/obsidian-assets/claude-lean4-riemann-hypothesis-2026/image-lean-joint-96a0c630b5.png)

> [!important]
> First, let's press the buzz and solve three practical problems: First, what was the original meaning of the Riemann Hypothesis? Will online banking and phone passwords crash together tomorrow? Second, AI that can write dozens of lines of script and make up interfaces nonsense without failing to solve a 167-year-old problem? Third, what does this have to do with ordinary people using AI at work tomorrow?

## 1. No complicated formulas: Understand the Riemann Hypothesis and two major popular transmission misconceptions in one minute

　　Stripping away the cold academic jargon, the real protagonist of the Riemann Hypothesis is actually the **prime** seen in elementary school arithmetic—that is, **2, 3, 5, 7, 11, 13**, which are natural numbers divisible only by **1** and itself. You can think of prime numbers as the underlying LEGO bricks in the digital world; any integer greater than 1 can be uniquely broken down into several prime multiplications (for example, **12** split into **2 × 2 × 3**, **30** into **2 × 3 × 5**, **2026** into **2 × 1013**).

![Diagram of integers broken down into underlying prime blocks](https://hyphentech.top/obsidian-assets/claude-lean4-riemann-hypothesis-2026/image-stage-lego-4424d101f4.png)

　　The real problem that has driven mathematicians crazy for over 2,000 years is this: the rhythm of these prime blocks appearing on the number line looks as chaotic as if they've been drunk. Sometimes two blocks appear right next to each other, like **11** and **13**, **17** and **19**; But sometimes, after traveling far into a desert, the next block suddenly pops up. The core question that number theorists have struggled with for two thousand years is just one question: Is there really a strict hidden order behind the apparently random primes? **

　　**In 1859**, German mathematician Riemann came up with a brilliant idea. He created a mathematical optical prism (the Riemann Zeta function), refracting the distribution of prime-number particles that were previously uncountable and hard to grasp into a continuous audio spectrogram. Previously, counting building blocks was a headache, but after refracting, these key notes became a set of key notes that determined the rhythm of fluctuations—mathematically these key points are called **nontrivial zeros**.

![Schematic of the prime number distribution refracted by a function prism into spectral harmonics](https://hyphentech.top/obsidian-assets/claude-lean4-riemann-hypothesis-2026/image-concept-prism-2dbcaff0aa.jpg)

　　Translated into images, the Riemann Hypothesis actually has only one very straightforward sentence: **At the very center of this mathematical mixing console stands a vertical central axis labeled 0.5 (i.e., 1/2). All key notes must be placed obediently along this 0.5 central axis, not a single step off track. **

![All nontrivial zeros locked at the 0.5 central axis Illustration](https://hyphentech.top/obsidian-assets/claude-lean4-riemann-hypothesis-2026/image-stage-line-2a397ec646.png)

　　As long as all zeros are locked on the **0.5** line, it means the fluctuations and errors in the prime distribution are firmly suppressed within the most uniform limits allowed by nature, never running out of control. In the past 167 years, the mathematical community couldn't wait for it to be proven, so they treated the "hypothetical Riemann hypothesis holds" as a temporary foundation and forcibly built over 1,000 modern mathematical theorem towers on top. Now that machine compilation has announced the foundation has been fully poured down, the entire academic community has naturally experienced a major earthquake.

![Diagram of thousands of theorems on a 0.5 conjecture foundation](https://hyphentech.top/obsidian-assets/claude-lean4-riemann-hypothesis-2026/image-stage-tower-eacc9e9b27.png)

### Misconception 1: Having figured out prime numbers, will online banking, HTTPS, and Bitcoin crash tomorrow?

　　Once the news spread, the most alarming rumor on social media was: "Modern cryptography relies on large primes; once the Riemann Hypothesis is broken, online banking passwords, HTTPS web encryption, and Bitcoin signatures will all be bare tomorrow." **This worry is completely unnecessary. **

　　To give a straightforward analogy: an ecologist using lidar to measure the average number of trees per kilometer in a whole primeval forest doesn't mean they suddenly have a universal chainsaw that can cut through towering iron trees in a second. The Riemann Hypothesis describes how uniformly the average density of prime numbers is at the macroscopic scale, and **it doesn't provide a practical algorithm for quickly decomposing ultra-large composite numbers (the core barrier of RSA encryption pads)**. The encryption locks in your phone and bank card are still solid today.

![Schematic Illustrative Difference Between Macroscopic Forest Density Mapping and Large Number Decomposition Combination Locks](https://hyphentech.top/obsidian-assets/claude-lean4-riemann-hypothesis-2026/image-concept-vault-33f1a713fe.jpg)

### Misconception 2: Has the author already secured the $1 million Millennium Award from the Clay Institute?

　　Another widely circulated story is congratulations to the author on winning the **$1 million** prize. Go to the Clay Mathematics Institute [Millennium Prize official page](https://www.claymath.org/millennium/riemann-hypothesis/) and you'll see at a glance that the Riemann Hypothesis entry still clearly shows an unsolved status.

![Clay Institute of Mathematics Official Website Riemann Hypothesis Status Page](https://hyphentech.top/obsidian-assets/claude-lean4-riemann-hypothesis-2026/image-clay-unsolved-b99c4ef3b1.png)

　　The Clay Institute's award regulations are very rigid: just throwing a bunch of source code compressed files on personal websites doesn't count; results must first be officially published through peer review in a qualified traditional mathematics journal, and then endure a full **2 years of public scrutiny and criticism in the global mathematics community before qualifying to start the award process. Trying to take away this **1 million USD** is a long process.

![meme_algo](https://hyphentech.top/obsidian-assets/claude-lean4-riemann-hypothesis-2026/image-meme-algo-769735e364.png)

## 2. Humanity hasn't finished reading 17 million lines of code, so why would they dare to give the green light in just one day?

　　Then came an even deeper question: Alpöge admitted on page **2** of the statement that even he himself hasn't fully digested so many mathematical details yet. Since almost no one in the world has read this code from scratch, why would the authoritative community dare to recite it after just **one day**?

![Excerpt from the original 4-page declaration of Levent Alpöge](https://hyphentech.top/obsidian-assets/claude-lean4-riemann-hypothesis-2026/image-remark-p1-cf9467f31b.png)

　　The answer lies in the physical structural difference between a **250,000-page natural language paper** and **17 million lines of formal code**. If a large model were to write a **250,000-page** proof in English, it would be like pasting a shaky tower of scrap paper with bare hands—the reviewer would be dazzled by the first 50 pages, and if AI quietly slipped in a sentence like "This is the same here" or secretly altered a boundary condition, the entire paper tower's logic would collapse long ago, and human reviewers would never be able to catch the current situation.

　　Alpöge couldn't help but laugh at the AI-generated draft called "The Generalized Riemann Book": Chapter One, Theorem 1, actually started with the correct nonsense "real numbers greater than **1/2** or less than **1/2**." So he decisively locked **250,000 pages** of text drafts into a drawer, only releasing the Lean 4 formal proof code. This was equivalent to turning a floating paper tower into **17 million titanium alloy gears tightly fitting together: if **1** was written missing **1** parentheses, or if the derivation was deviated by **0.01 millimeters** at one step, the compiler gears would immediately snap an error and shut down the entire machine on the spot, leaving no room for evasion.

![Comparison Diagram Between Natural Language Waste Paper Tower and Formalized Precision Gears](https://hyphentech.top/obsidian-assets/claude-lean4-riemann-hypothesis-2026/image-concept-gears-1e418e4d73.jpg)

　　To completely block AI's loopholes of "secretly changing exam questions" or "plugging cheating axioms," the Lean community, the Mathlib team, and MIT number theorists set up four security gates overnight:

| Security checkpoints in the exam room | Prevention of cheating risks | Practical and hard-core verification methods |
| --- | --- | --- |
| The first door: checking the authenticity of the exam paper | Prevent secretly turning century-old questions into simple questions for submission | Write independent isolation scripts and use two matching tools to align verbatim with standard definitions reviewed over many years in Mathlib's official question bank |
| Second door: Searching pockets for personal items | Prevent unproven scheming or unproven hypotheses or leaving blanks behind | The entire library relies on scanning, ensuring zero cheat and leaving blank spaces, relying on only three basic general mathematical axioms |
| Third door: Cold-faced examiner cross-check | Prevents the official compiler from hiding underlying vulnerabilities | In addition to the official Lean kernel, third-party checkers rewriting in various programming languages perform line-by-line replay and review |
| Door Four: Global Independent Recompilation | Prevent unreproducible cache coincidences in the author's local environment | Dozens of teams worldwide compiled over 175,000 files from scratch on their respective machines, with the output showing a green light with a single byte off |

> The verification records are compiled from the joint certification statement between the Lean community and Mathlib dated November 21, 2026

![Word-for-word comparison of theorem definitions and audit demonstration of the three fundamental axioms](https://hyphentech.top/obsidian-assets/claude-lean4-riemann-hypothesis-2026/image-stage-gates-6bffed0d08.png)

　　In the past, manually reviewing a top-level breakthrough in number theory often took **3 to 5 years**, but these four cold-faced machine examiners spent just over **1 day** tightening and verifying **17 million ** logic rivets one by one.

## 3. Why did the large model, which usually likes to make up fabrications, fail to make up a single step this time?

　　Once you figure out the anti-cheat mechanism, the real engineering secrets worth pondering for all tech professionals come to light: when we ask large models to modify software in web chat boxes, they often seriously invent nonexistent function names to fool people; Why is it that when tackling the **167** mathematical holy grail of mathematics, it can advance tens of thousands of steps without missing a step?

　　The root cause is that the nude chat mode and the verification loop are fundamentally different species. Conversing alone with a natural language model is like having a wildly imaginative sketchwriter draw blindfolded while drawing. Even if each step of reasoning only has a **1%** chance of distraction, drawing tens of thousands of steps down without any external correction will snowball exponentially, and by the middle and later stages, the deviation will completely veer and collapse.

　　But on the **Claude + Lean 4** engineering assembly line, beside the speeding sketchman sat a strict and impartial mechanical quality inspector. This inspector gripped a vernier caliper and couldn't understand any polite words: Claude was responsible for high-frequency testing of various number-theoretic transformations and cross-disciplinary combinations; After every few derivation steps, the Lean 4 compiler would cut the caliper within milliseconds. If it detected a type or condition that didn't connect, it would immediately flash a red light and rewrite it until every gear fit perfectly before releasing the next segment.

![Schematic of the Sketchwriter's High-Frequency Probing and the Mechanical Quality Inspector's Millisecond-Level Closed Loop](https://hyphentech.top/obsidian-assets/claude-lean4-riemann-hypothesis-2026/image-stage-loop-a63e429907.png)

　　This combination punch has fully absorbed the most lucrative **asymmetric dividend** in the logic world: it's as hard as climbing to the sky to come up with a correct proof path out of thin air in the dark, but once you get ready-made steps, letting machines check for legality line by line is astonishingly cheap. Large models add the firepower of high-speed trial and error and cross-industry association, formal compilers cover the iron foundation of zero-tolerance verification, and when both sides snap together, the illusion that has plagued the industry for years is firmly locked outside the gate.

　　Opening the post by Fields Medalist Terence Tao on **November 20** [Latest analysis blog post](https://terrytao.wordpress.com/2026/11/20/unforced-euler-singularity-unforced-navier-stokes-singularity-and-the-generalized-riemann-hypothesis/) It becomes clear that this breakthrough is not just an AI winning the **1 lottery** by chance, but a clearly visible **three-level acceleration ladder**:

- **First Ladder (Zero External Force, 3D Euler Equation, Singularity)**: After the research team obtained the results with AI, not only was the Lean code validated, but the resulting mathematics papers could also be smoothly understood by anthropologists, as if humans and AI were running side by side;
- **Second Ladder (Three-Dimensional Navi-Stokes Equation Singularity)**: Also at the Millennium Prize level, humans can still see the overall strategy, but many complicated paragraphs must rely on machine formalization to cover them, and traditional papers still need to be slowly refined;
- **Third Ladder (Generalized Riemann Hypothesis)**: AI tosses human runners out of sight just before the finish line, delivering 17 million lines of purely machine-verifiable code.

![Terence Tao's blog compares to three recent breakthroughs in AI formal mathematics](https://hyphentech.top/obsidian-assets/claude-lean4-riemann-hypothesis-2026/image-tao-blog-89060f0e15.png)

　　On the decisive late Sunday night of **November 15**, Alpöge left a vivid confession on page **1** of the statement: near the finish line, Claude completely lost control of his rhythm, flying up, dancing, flashing as he dashed across the finish line, leaving him far behind. Excited, he cautiously messaged Anthropic head Dario Amodei in the middle of the night: "Suppose I really touch something big, can I announce it to the public?" ”

　　The sense of balance behind this move is very subtle. Currently, Anthropic is stuck in a sensitive window of massive valuation rushes to go public. If the company officially makes a big push and launches a press conference, it will loudly claim the "Conquering the Century-Old Holy Grail of Mathematics," and even a slight flaw in wording could easily spark compliance and public controversy; Instead, researchers are allowed to quietly hang **4 pages of **** explanations and **14** code packages on their makeshift personal homepages without PR hype, letting mathematicians worldwide rewrite their own code, and in the end, the coldest and hardest green light output won widespread acclaim.

　　The academic circle's shockwaves and entanglements reached a climax. Quantum computing scholar Scott Aaronson wrote the viral comment ["The Random Parrot Clearly Proves the Riemann Hypothesis"](https://scottaaronson.blog/?p=10344), responding with the sharpest irony to the recent criticism of large models as "random parrots"; Terence Tao also soberly broke the current awkwardness: ** Computers only took 1.5 days to fully verify logic, but for all humanity to truly understand what sophisticated mathematical intuition is behind these 17 million lines of code and digest it into textbooks for the next generation, it will take at least several years to devour it. **

![Scott Aaronson Review Blog Post Title and Opening Excerpt](https://hyphentech.top/obsidian-assets/claude-lean4-riemann-hypothesis-2026/image-aaronson-blog-7ff13019f6.png)

![meme_math](https://hyphentech.top/obsidian-assets/claude-lean4-riemann-hypothesis-2026/image-meme-math-867c9a0c71.png)

## 4. Back on the Ordinary Person's Desk: Don't Write Prompts as Prose; Equip AI with Mechanical Referee

　　Let's turn our attention back to the computer desktops we face every day. What real inspiration does this towering breakthrough in number theory offer to ordinary people and developers working with AI in their daily work?

　　**First, let's get rid of the old impression that "AI only splices together old online question banks." **The Riemann Hypothesis was suspended in **167 years**, and there is no ready-made standard answer available in the internet corpus to copy. Even with formal verification closed loops, it can still forge new paths. This sets an iron rule: from now on, as long as your work has clear and objective criteria**—such as whether the code can be compiled successfully, whether web buttons can be clicked, or whether financial statements are average—AI will sooner or later break through the efficiency ceiling of ordinary human experts.

　　**Second, the dividing line that determines daily AI proficiency has shifted from "who knows better at coaxing models" to "who knows how to pretend to be a mechanical referee." **Whether you're modulating Claude, connecting to free cloud APIs, or running local open-source models on your computer's graphics card, never blindly trust the confident "task complete" in the chat box. Take daily software modification or batch data processing, for example: tomorrow you can directly copy three low-cost checks:

- **First Level (Static Verification at the Door)**: Enable strong type checking and static format scanning to directly pin spelling errors, empty pointers, and fake interfaces at the entrance;
- **Level 2 (Red Line Automatic Single Test)**: Attach fixed input/output automatic test scripts to core functions. If you can't outrun the red line, don't let people clean up the mess, and simply feed the error logs back to the model for automatic rewriting;
- **Level 3 (Result Boundary Spot Check)**: After batch editing tables or running scripts, add a short check-in script of dozens of lines specifically to count file lines, missing fields, and extreme ranges.

![Diagram of the three automatic check-back checkpoints for daily development and office](https://hyphentech.top/obsidian-assets/claude-lean4-riemann-hypothesis-2026/image-stage-judges-89b4a8f441.png)

　　As long as you set up a small loop of "automatically sending back errors and refixing," even lightweight open-source models running on your local computer can instantly boost the reliability of actual deliveries.

　　**Third, a new exam question that no one can avoid is already on the table. **Imagine what will soon play out in countless companies: AI writing hundreds of thousands of lines of core business code for teams, automated tests running green all the way, and online performance running at lightning speed, yet no engineer in the department can explain from start to finish how the internal process was overcome. When the moment the go-live switch is pressed, who dares to sign this word? If an extreme accident occurs in the real world, who should be held responsible?

![Illustrating the complex black-box code operating entirely green and the dilemma of signing rights online](https://hyphentech.top/obsidian-assets/claude-lean4-riemann-hypothesis-2026/image-concept-switch-e265b187e0.jpg)

> [!summary] Final thoughts
> The Riemann Hypothesis was validated by computers, and today no bank card passwords were stolen; What it truly leveraged is the old premise that "only humans can understand it with their own eyes" that has been held for thousands of years. Compilers can sign off on logical correctness, but real-world risks still have to be covered by humans—whoever can put bold ideas into a rigorous mechanical acceptance box will seize the initiative in the next round of efficiency revolution.

## Main sources of verification

- [Levent Alpöge Personal Statement and 14-Volume Source Code Entry (Remark)](https://alpo.ge/remark.pdf)
- [Lean and Mathlib Community Joint Verification Statement](https://leanprover-community.github.io/blog/posts/riemann-hypothesis/)
- [Terence Tao: Comparative Analysis of 3D Euler, Navier-Stokes, and the Generalized Riemann Hypothesis](https://terrytao.wordpress.com/2026/11/20/unforced-euler-singularity-unforced-navier-stokes-singularity-and-the-generalized-riemann-hypothesis/)
- [Scott Aaronson: Random parrots clearly prove the Riemann Hypothesis](https://scottaaronson.blog/?p=10344)
- [Clay Mathematics Institute Millennium Prize Riemann Hypothesis Official Status Page](https://www.claymath.org/millennium/riemann-hypothesis/)


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
