---
title: "GPT-2 was once considered too dangerous, but six years later it opened up its weighting? A download link behind the AI race"
slug: understand-ai-03-open-race-en
status: published
lang: en
translation_of: understand-ai-03-open-race
translation_source: machine
source_sha256: a04a410f902d214b
date: 2026-10-05
updated: 2026-10-24
summary: "For ordinary people, running AI on their own computers is not a blessing that falls from the sky. Phased releases, research licenses, open engines, and download links divide the same technological competition into two tracks."
categories:
  - AI知识
tags:
  - AI
  - Do you really understand AI?
cover: "/obsidian-assets/understand-ai-03-open-race/cover-87b121c499.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/understand-ai-03-open-race/) is authoritative.

> [!abstract]
> For ordinary people, running AI on their own computers is not a blessing that falls from the sky. Phased releases, research licenses, open engines, and download links divide the same technological competition into two tracks.
> HyphenTech · 2026-10-05

In 2019, GPT-2's full rights were largely phased out for several months; In 2025, OpenAI released downloadable GPT-OSS. The same company changed its open strategy. Meanwhile, LLaMA, Mistral, and DeepSeek brought downloadable models into the workflows of regular users.
Downloadable, commercially usable, reproducible, and your computer can run—these are the four things. After watching this race, next time you face the download button, you won't default to checking all four things together.

## At the starting line, papers and weights opened the door

In June 2017, eight researchers published a Transformer paper; In 2018, Google released BERT's code and pre-training weights. The paper allows people to study architecture, code makes implementations easier to check, and weights allow direct use of training results. They lower different barriers but cannot guarantee the complete training can be reproduced independently.

You can separate these materials into cooking scenarios: architecture is like the device's structural design, code is like operation and control programs, weights are the settings already tuned by the device, and training materials are the materials used during initial debugging. Bringing back a properly tuned device might allow you to start using it; But if you have to redo its debugging process, you still need to know how materials are prepared and how programs run. The next "open" milestones are important because of which items are handed in each time.

In these influential studies, the publication of papers, code, and weights has allowed future generations to keep moving forward: publishing papers and releasing code, everyone stands on the same set of results and moves forward.

The split happened two years later.

## 2019: A "too dangerous" model

On February 14, 2019, OpenAI released GPT-2, a language model with 1.5 billion parameters—a scale that was staggering at the time. But they only released a much smaller version, with the reason stated in the announcement: concerns about malicious use of the technology.

![Official Release | GPT-2](https://hyphentech.top/obsidian-assets/understand-ai-03-open-race/image-gpt2-official-525ce3b3b0.jpg)

Over the next nine months, OpenAI released the 124-megameter version in February, 355 million in May, 774 million in August, and it wasn't until November 5 that the full 1.5 billion version was finally released. A real anecdote: the two earliest announced parameter amounts were later corrected by themselves—originally, they said 117 million and 345 million, and the GitHub note said it was due to "one error" in the calculation.

This "phased release" sparked heated debate at the time. Supporters said caution is always the right approach; Many researchers also criticized calling a 1.5-billion-parameter model so dangerous, more like stirring up panic. But the precedent it left behind is far more important than the debate itself: **The strongest model may not necessarily be released. **

In November 2022, ChatGPT went live. The model behind it has not revealed a single parameter.

## March 2023: A weight leaked from 4chan

On February 24, 2023, Meta released LLaMA, with the largest having 65 billion parameters. Weights are not publicly downloaded; researchers must apply individually, and the license states that it is only for research purposes.

The first generation LLaMA adopted a research application and restricted license release model, but later unauthorized authority circulation emerged. This experience made the difference between "having access to files" and "having permission to use files" concrete. No leak download link provided here. But what happened next was far more important than the leak itself: within just a few weeks, Bulgarian programmer Georgi Gerganov wrote a llama.cpp that allowed LLaMA to run on a regular MacBook. The engine that runs GGUF files on everyone's computers today was born from that month.

On July 18, 2023, Meta released Llama 2, providing licenses that include commercial use. An important condition is: according to license requirements, licensees whose products or services have over 700 million monthly active users in the month prior to the relevant release date must separately apply for a license from Meta; Whether to grant permission is up to Meta. This is a clear usage condition, not "files can be downloaded and anyone can use them freely." The subsequent opening occurs after the leak, but based solely on the chronology, it cannot be determined that the decision was made because of the leak.

## September 2023: A tweet with only one link

On September 27, 2023, a French company named Mistral AI, which had only been established a few months ago, posted a tweet on social media. No introduction, no images, only a magnet link. Upon opening, there was a 13.4GB torrent containing their first model, the Mistral 7B. The license is Apache 2.0—allowing usage, modification, and commercial use, while still complying with the license notice and related terms.

December's Mixtral 8x7B further demonstrated the hybrid expert approach: the official total parameters were about 46.7 billion, with each word actually used about 12.9 billion. This doesn't mean you only need to download 12.9 billion parameters; Total weight and activation calculations are two separate accounts. Issue 11 looks at the model layout, and issue 16 brings it back to the hardware budget.

Mixed experts are especially likely to tie these things together. Each word only calls some experts, meaning a single calculation can use fewer parameters than all parameters once; But the next word may be replaced by a group of experts, usually still needing access to the entire weight set. Just like only some employees come during shifts, the company doesn't just need to prepare workstations and data for the person on duty.

Here, "experts" refer to different computing modules in the network. You can think of it as a categorized toolmanual: for the task at hand, you only flip through a few relevant chapters; for a new task, you might flip through other chapters. The routing mechanism determines which modules are selected for this step, so activation parameters describe how much was used for this step; The total parameters describe how large the entire manual is. This analogy only explains selection and capacity; modules in the model have no professional identity, nor does it guarantee that each has a clear expertise.

Therefore, when selecting a local model, you should ask both "what is the total weight" and "how much is calculated per step." The former affects storage and memory, while the latter affects computation; quantization, uninstalling, and running the engine will also change the actual cost. If you treat activation parameters as the total parameters to be installed on the computer, it's easy to miscalculate before downloading.

![Principle Illustration](https://hyphentech.top/obsidian-assets/understand-ai-03-open-race/image-original-1-9f262d6679.png)

The top is a closed-source milestone, and the bottom is a milestone for open weighting. The most interesting thing is the two ends: in 2019, OpenAI didn't dare to release GPT-2, but six and a half years later, it released its own downloadable model.

## January 2025: R1 brings open reasoning to the frontier of competition

In September 2024, OpenAI released o1, a new model that "thinks" a long paragraph before answering (featured in Issue 9). Its leap in mathematics and programming has led many to believe that closed-source has opened up a significant gap.

Four months later, on January 20, 2025, Chinese company DeepSeek released R1: again, I'll answer first. The official report compared it with O1 in several reviews, and **weights were released directly under the MIT license**—downloading, modifying, and commercializing, using it to teach other models is all allowed. I'll leave R1's market impact for the next highlight article. This article first looks at how it changed the downloadable model ecosystem.

Half a year later, on August 5, 2025, OpenAI released two downloadable models called gpt-oss, licensed as Apache 2.0. The announcement specifically stated: **This is the first time since GPT-2 OpenAI has opened up the weight of its language model. **From "too risky, too afraid to publish" to reopening, it took six and a half years.

This timeline also shows that open and closed-source are not two teams that never switch camps. The same institution can publicly disclose certain models while keeping others as online services; An open model can also access paid products. "Whether to charge" and "whether to open weight" are not on the same axis.

Looking at business strategies, one can infer that openness may promote developer ecosystems, and online services may provide convenience and revenue. But to assert that a particular release is "truly aimed at targeting someone," you still need announcements, operational data, or other evidence at the time. Model documents can prove what was released, but cannot directly prove the entire motivation behind the decision-makers.

Obtaining model weighting turns "where to run" from a service provider's choice into a user-friendly choice. But this choice still requires costs for storage, memory, computing power, and maintenance. Openness does not mean free hardware, and lenient licensing does not exempt from legal and permission responsibilities.

## What exactly does "open source" induce?

Finally, clarify a word that almost everyone gets confused.

If we use a restaurant analogy, the weights are more like a pre-tuned cooking device: the internal settings retain the training results, so you can run them according to the calculation method or continue fine-tuning. It does not write down a complete recipe for each training step. Training code, data processing, and sample sources need to be explained separately.

There are actually three things here:

| What has been revealed | Equivalent to | What can you do? |
| --- | --- | --- |
| **Weights** | Parameters learned after training | Running on compatible engines, fine-tuning continues according to license |
| **Code** | Kitchen operation process | Know how it trains and runs |
| **Training Data** | Purchase order | Supports understanding and training reproduction together with code, recipes, and more |

"Open weight" accurately indicates that you have trained parameters, but don't assume that code, data, and permissions are all present. In October 2024, OSI released "Definition of Open Source AI" 1.0, which sets requirements for freedom of use, code, parameters, and sufficiently detailed data descriptions; It is not simply equivalent to "uploading all raw data." To determine whether a specific project qualifies, you need to review materials and terms item by item, not draw conclusions based on download counts. [Definition of Open Source AI](https://opensource.org/ai/open-source-ai-definition)

| What do you need to confirm? | Look at the materials | Nothing can replace it |
| --- | --- | --- |
| Whether it can gain weight | Publish warehouses, file lists, and access conditions | The phrase "open source" in the promotion |
| Whether your use is permitted | Full License Text and Additional Terms | Free or with a download button |
| Can training be replicated? | Code, data description, recipes, and experimental conditions | Having reasoning procedures is sufficient |
| Can the device run? | Architecture support, file formats, and memory budgets | The online demo is very fast |

Suppose you download a file, and the model management software lists it as well. The next step isn't to announce the deployment complete, but to check whether the engine understands the architecture, whether quantization files are compatible, and whether weights and caches can be loaded into memory. File recognition is the entry point, startup is the next door; Once it can start, you also need to use your own task to accept it.

File formats and the running engine can be understood by the player and video files: seeing the file name does not mean the player will decode it; Successful decoding does not mean the device can play smoothly. The model format is how parameters are loaded into files, the engine reads and calculates it, and memory provides space for runtime. The three "yes" on the download page—can be obtained, can be used, can run locally—so you must check them separately.

This isn't about pouring cold water on open models, but about putting their value to use: you can check versions, switch locations, adjust budgets, save results, and don't have to rely solely on a single demonstration from a service provider. With more autonomy, you also have to bear more checks.

## Let's take a look at what "downloadable" looks like

- Open Hugging Face (huggingface.co), search for `Qwen3-8B`, and go to the official page
- Find the `license` column and see what it says (based on the permission field on the page at that time)
- Open "Files" and count how many `.safetensors` files you have, and how large they add up
- Search for the name of a closed-source model, such as the official model information for GPT-4—and you'll find no files available for download

The download page is the entry point to check openness, not the endpoint. First, find the model card, license files, architecture configuration, and weight list, then look at the engine you plan to use. If you miss one link, the conclusion should stop there.

Finally, let's look at the sentence "Open source catches up with closed source, just a few months apart." It might refer to an open model finally reaching the score that the old closed model had, or it could mean the score difference between two models on the same day. These two questions cannot be answered with the same number: the time difference requires a clear historical benchmark, the difference requires the current version, task, reasoning budget, and tool configuration.

Different rulers may also be given different orders: strong mathematical reasoning does not guarantee that Chinese writing, long-form retrieval, and tool calls are all ahead. This timeline explains how the open path changes, avoiding linking cross-era models into a single ability list that hasn't been uniformly tested. When the report card issues are released, we'll specifically break down this ruler.

## Back to the question at the beginning

Back to the original question: Open Change is who has the opportunity to get the model, inspect it, modify the model, and choose where to deploy. It does not automatically eliminate the difficulties of training reproduction, runtime compatibility, and task reliability. Rather than arguing broadly about "open-source is stronger" or "closed-source is better," it is better to read capability evidence, usage rights, and deployment costs separately.

## Several terms that appear in the story

| Terminology | Plain speech |
| --- | --- |
| Closed-source model | It can only be used via web pages or interfaces, and its authority is not disclosed |
| Open weights | Publicly disclose the trained weights, and actual use and operation are subject to permission and compatibility conditions |
| Open Source AI (OSI Definition) | Both code and weights are open, and training data is described to a reproducible level |
| License | Specify what you can do with the model: whether it can be commercially used, and whether it needs to be credited |
| Phased releases | Start with a small version, observe for a while, then zoom in on the version |
| Magnetic link | A torrent download link; Mistral has used it to post models |
| MoE Mixing Expert | There are many parameters, and only a part of the structure is used at a time |
| Apache 2.0 / MIT | The two most lenient licenses: basically allowing for broad use and commercial use, but still subject to specific terms |

Next article: Give the machine four sets of numbers, don't tell it patterns, but it can turn two knobs toward the answer. Now look at the curves in the neuron melting pot: reduced loss, interface running, real mastery—where exactly is the difference?

## References

- [GPT-2 Full Weight Release](https://openai.com/index/gpt-2-1-5b-release/)
- [GPT-2 Original Warehouse](https://github.com/openai/gpt-2)
- [Mistral 7B Official Release](https://mistral.ai/news/announcing-mistral-7b/)
- [Mixtral Official Introduction](https://mistral.ai/news/mixtral-of-experts/)
- [DeepSeek-R1 Original Data](https://github.com/deepseek-ai/DeepSeek-R1)
- [GPT-OSS Official Release](https://openai.com/index/introducing-gpt-oss/)
- [Open-source AI Definition 1.0](https://opensource.org/ai/open-source-ai-definition)


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
