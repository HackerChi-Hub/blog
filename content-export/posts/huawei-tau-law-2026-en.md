---
title: "Huawei's \"Tao Law\": When space reaches its limit, demand answers from time"
slug: huawei-tau-law-2026-en
status: published
lang: en
translation_of: huawei-tau-law-2026
translation_source: machine
source_sha256: ba6e1c097a46b9f0
date: 2026-05-27
updated: 2026-10-03
summary: "Logic folding, 55% density increase, and 1.4nm equivalent to 2031—Huawei has quietly carved out a new path around EUV with 381 chips in six years."
categories:
  - Tech
tags:
  - Huawei
  - Chips
  - Tech
  - Tech
  - Frontier
  - Industry
  - AI
cover: https://hyphentech.top/obsidian-assets/huawei-tau-law-2026/image-01-73180a9272.jpg
brand_slogan: 
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/huawei-tau-law-2026/) is authoritative.

> [!note]
> This article was first published on the HyphenTech official account · 2026-05-27 · Image source: Huawei official / ISCAS 2026 site

![He Tingbo delivered a keynote speech at ISCAS 2026: "Exploring and Implementing New Paths for Semiconductors" © Huawei](https://hyphentech.top/obsidian-assets/huawei-tau-law-2026/image-01-73180a9272.jpg)

### 1. Moore's Law: The Farewell Ceremony Sixty Years Later

In 1965, Gordon Moore, Director of R&D at Intel's predecessor Fairchild Semiconductor, casually drew a curve: the number of integrated circuit transistors doubled every 18 to 24 months. This four-page article later defined the 60-year rhythm of the trillion-dollar industry.

But today, this path is getting harder and harder. Physical limits (quantum tunneling) and economic limits (EUV costs doubled) are looming simultaneously, and the "post-Moore era" has lingered for nearly 20 years.

#### Two walls

- Physical limits: when the gate is compressed to a few nanometers, quantum tunneling current rises exponentially, and leakage and mutation are almost unsolvable

- Economic limit: EUV lithography machine + multiple exposures, with mask steps doubling each generation node, and the cost per tube not decreases but actually increases

- The chip industry's "Moore's Dividend" window is visibly narrowing

### 2. What is the 'Tao Law'? A single letter explains it clearly

On May 25, 2026, at ISCAS 2026 Shanghai, He Tingbo, President of Huawei's Semiconductor Business Unit, officially released the "Tao (τ) Law":

> By replacing 'geometric microsampling' with 'time microscopy,' the goal is to systematically reduce the time constant τ, and innovative technologies such as logic folding continuously compress signal propagation delay, achieving ongoing evolution in semiconductors and electronic systems.

> [!note]
> τ is the physical symbol for time constant; in digital circuits, delay = R × C. The core insight of Tao's Law: What determines chip speed is not only the number of tubes but also the signal speed.

#### Understanding two roads through urban transportation

- Geometric microcosm (Moore's Law) = constantly narrowing roads, shrinking buildings, forcing more people into the city

- Time Reduction (Tao's Law) = No city expansion, re-plan the road network, build overpasses, and straighten detours

### 3. Logic Folding: Convert chips from single-story houses into duplex apartments

Logic Folding "folds" traditional 2D flat traces into a double-layer 3D structure, significantly shortening the length of critical path traces.

> [!note]
> Bundies vs. Duplexes: Traditional chips = single-story warehouses, requiring hundreds of meters to take a detour to pick up goods; Logic folding = changed to multi-layer shelves, just a few layers to get it done, shortening the path several times.

The Kirin 2026 is the first chip to fully adopt logical folding, expanding from single-layer to dual-layer based on the "free logic" design concept, and will be released this fall with the Mate 90 series.

#### Specific achievements

- Transistor density increased by 55% (238 MTr/mm², surpassing TSMC N3P's 224 MTr/mm²)

- Power efficiency improved by 41%

- 2031 Target: Equivalent 1.4nm process transistor density (400+ MTr/mm²)

> [!note]
> "Equivalent 1.4nm" does not mean physically manufacturing a 1.4nm chip—rather, it achieves approximate levels of effective performance and density through design architecture innovation, bypassing reliance on EUV lithography machines.

![ISCAS 2026 Live PPT — Kirin 2026 Logical Folding vs. Traditional Design Comparison, Density Increase by 53.5%](https://hyphentech.top/obsidian-assets/huawei-tau-law-2026/image-02-6038432120.jpg)

### 4. Logical folding ≠ 3D packaging—don't get confused

TSMC's 3DFabric / SoIC / CoWoS and Huawei's logic folding are completely different.

- 3D Packaging = stacking several buildings that have already been built together (packaging layer, physical integration)

- Logical folding = Changing single-story floor plans to duplex apartments (design floor, design reconstruction) during the design drawing stage.

In other words: TSMC is working on 3D physics, Huawei is working on 3D design studies. The two complement each other and are not contradictory.

> [!note]
> Logical folding also requires a whole new set of EDA tools—from 3D representations of standard cell libraries to low-level refactoring of timing analysis.

![ISCAS 2026 On-site PPT — Fanout Closure Methodology, Critical Path Signal Folding Diagram](https://hyphentech.top/obsidian-assets/huawei-tau-law-2026/image-03-4608b294df.jpg)

### 5. 381 mass-produced chips, secrets hidden for 6 years

Behind the Tao Law is a four-layer collaborative optimization system:

- Device layer: optimizes the resistance and parasitic capacitance of transistors and interconnections, micronizing τ from the physical base

- Circuit Layer: Logic Folding shortens critical path traces and reduces RC load

- Chip Layer: Software-architecture-chip full-stack collaboration, fine-grained instruction/data flow control, reducing end-to-end execution time

- System Layer: Lingqu Bus is a new interconnection protocol with unified memory addressing for hypernodes, significantly reducing communication latency

> [!note]
> Over the past six years, Huawei has designed and mass-produced 381 chips based on this system, covering mobile SoCs · AI accelerators · Baseband · RF · Power management · The entire automotive lineup.

### 6. Roadmap: You can buy the first model this fall

- 2026 (current): Kirin 9030, mass production, ~5nm DUV, 155 MTr/mm²

- Fall 2026: Kirin 2026 (Mate 90 debuts), dual-layer logical fold, 238 MTr/mm²

- 2030: Full adoption of Ascend AI accelerators + data center clusters, replacing the limited Nvidia solution

- 2031: High-end chip transistor density equivalent to 1.4nm process (400+ MTr/mm²)

> [!note]
> Following the news, SMIC's stock price rose 7.6% that day. The market believes that the domestic advanced packaging and manufacturing supply chains will directly benefit.

![ISCAS 2026 Live PPT — τ-Scaling Roadmap, Transistor Density 2026→2031 Increasing from 238+ MTr/mm²](https://hyphentech.top/obsidian-assets/huawei-tau-law-2026/image-04-c804573b5e.jpg)

### 7. Three paths, three companies—which side should you choose?

- Intel → RibbonFET Full Surround Gate + PowerVia Rear Power Delivery (Device Innovation, Final Sprint in Geometric Miniaturization)

- TSMC → 3DFabric · SoIC · CoWoS (Packaging Revolution, Physical Stacking)

- Huawei HiSilicon → Logic Fold (Design Refactoring, Time Dimension, Bypassing EUV)

The three paths are not mutually exclusive, but their core motivations differ: Intel and TSMC are still revolvering around "how to make tubes smaller and stacked closer," while Huawei stepped forward to redefine dimensions.

### 8. An invention forced by sanctions?

In 2019, cutting off TSMC supplies and embargoing EUV shipments—Huawei forged a third path in six years. If you can't compete on processes, then compete on design; If you can't shrink the tubes in space, then shorten the signal time.

> "The future will definitely be open cooperation. Following the path of Tao Law, we look forward to working closely with scientists, engineers, and industry partners worldwide to jointly promote the sustained development of the semiconductor and electronics industries."
> — He Tingbo, ISCAS 2026

---

> [!note]
> In short: Tao's Law = After Moore's Law hits the wall, chip performance growth is redefined from a time perspective. This autumn's Kirin 2026 will be the first measurable answer. τ, time, will be the final judge.


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
