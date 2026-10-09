---
title: "Why does AI jump word by word? Follow one answer, go through word segmentation, attention, and sampling"
slug: understand-ai-10-conversation-en
status: published
lang: en
translation_of: understand-ai-10-conversation
translation_source: machine
source_sha256: d559a2c29bdec389
date: 2026-10-05
updated: 2026-10-06
summary: "The parts have been disassembled, now put back together. Follow \"Today's Weather True\" into a translation agency that only recognizes numbers, see how a sentence becomes probability, and then into text on your screen."
categories:
  - AI知识
tags:
  - AI
  - Do you really understand AI?
cover: https://hyphentech.top/obsidian-assets/understand-ai-10-conversation/cover-8008eb06e1.jpg
brand_slogan: 让AI成为你的超能力
legacy_paths: []

---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/understand-ai-10-conversation/) is authoritative.

> [!abstract]
> The parts have been disassembled, now put back together. Follow "Today's Weather True" into a translation agency that only recognizes numbers, see how a sentence becomes probability, and then into text on your screen.
> HyphenTech · 2026-10-05

The previous chapters broke down the parts one by one: tokens, vectors, attention, training, reasoning. This one puts them back in—following a sentence you type, from pressing Enter all the way to the screen, the first word pops up.
At this point, words like "reasoning," "token," and "context" that you see every day have transformed from slang into concrete machine actions.

## A translation agency that only recognizes numbers

Imagine a strange translation agency: the experts inside are extremely skilled, but **they only know numbers, not words at all**. You submit a sentence of Chinese and go through four steps to get a reply:

- **The front desk will cut your message into small slips of paper, each with a number** (check a fixed number)
- **The expert team looked at this string of numbers, repeatedly circulating and discussing**, with each person writing their own understanding next to the number
- **After the discussion, experts provided a poll on "What is most likely the next number?" **
- **The front desk draws a number based on the voting results, flips back the text, and sticks it at the end of the reply**—then repeats the whole process and guesses the next number

The large language model generates answers, which is the machine version of these four steps, and **only one word block is produced at a time, repeating in a cycle**. Next, match the official name of each station.

![Principle Illustration](https://hyphentech.top/obsidian-assets/understand-ai-10-conversation/image-original-1-8c35ff53d8.png)

Color is the layer, numbering is the order. Steps 3–7 are a loop—each generation of the next lexoid uses prefix information; When compatible, you don't have to recalculate the K and V of all previous layers. **Training is not on this chain. **

## First stop: Tokenization — replacing text with numbers

The model does not recognize "Chinese characters" or "words," only **tokens**. The tokenizer holds a fixed vocabulary (usually tens of thousands of entries), chops your input, and converts it into numbers:

- "HyphenTech" may be split into two tokens: `黑粉` + `科技`, or three—the cutout is determined by the word list, not by semantics
- In English, `unbelievable` is often split into `un` + `believ` + `able`
- Text with the same meaning must be calculated using the specific model's tokenizer; there is no fixed conversion rate for all models
- A real example: the small model used later in this article splits "Today's Weather Real" into `今天` `天` `气` `真` — "Today" is a single block, while "Weather" is actually split down

**Why You Car**: All billing, all the K in "context length 128K" is measured in tokens, not words. The exact counting of 128K and input/output occupancy should be determined by the model and service description—this is the maximum distance the model can see, not the length your computer can definitely fit (this is the calculation in issue 22).

## Second stop: Embedding—Send each number a "personality profile"

The numbers themselves mainly serve as indexes. In issue 6, the schematic numbers for "dog" and "cabinet" are placed side by side, but their meanings are completely different. After entering the embedding layer, each number is mapped into a set of learnable values. The so-called "personality profile" is just an analogy; not every dimension can be directly translated into a human concept.

Key properties: **words with similar meanings, and similar file numbers**. "King" and "queen" are very close in vector distance, while "king" and "tractor" are far apart. Vector representation is an important foundation of computational language and cannot be fully understood by the distance between two points.

By the way, a term is decoded: the common `hidden_size = 5120` in model parameters, which means this file has 5120 digits.

## Third stop: Attention—a discussion circulating by an expert team

This is the heart of the Transformer architecture and the answer to "Why is GPT strong?" One-sentence version:

**Before generating each new word, the total attention layer associates the preceding positions allowed by mask; Sparse, sliding, and hybrid structures have different boundaries; assign them different attention weights, and after weighted summaries, form the judgment of "what to say at this moment." **

The "circulating discussion" in the translation agency analogy is this step. Technically, it's called **self-attention**, and each token generates three pieces of material:

- **Q(Query)**: What information do I want to find right now?
- **K (Key, tag)**: What information can I find here?
- **V (Value)**: The true essence of information

When predicting the next word at the current prefix position, use the current Q to "pair the K of all previous tokens" one by one (calculate similarity), and the V of the previous token is absorbed with particular focus. This "pairing" requires the structure and mask to cover the preceding positions that allow attention—this plants a clue: the longer the preceding text, the more expensive it is (this will be detailed in issue 22).

Moreover, this discussion is more than one round: the model has dozens of **layers**, each layer having multiple parallel "discussion groups" (**attention heads**), deepening understanding layer by layer. `num_hidden_layers = 48` means 48 layers of expert discussion.

## Fourth stop: Sampling—drawing lots from the voting form

At the end of the discussion, the model outputs not "a single word," but the probability of each token in the word list**—a voting table with tens of thousands of rows. In the original LFM2.5-2.6B output saved by the knowledge base on September 11, 2026, following "Today's Weather True," the following are listed at the front:

| Candidate | Probability |
| --- | --- |
| Alright | 89.6% |
| Not bad | 2.5% |
| Alright | 1.3% |
| Beautiful | 1.1% |
| …… | …… |

"Not bad" or "good" each counts as a token: the model selects word blocks, not individual words.

**The drawing rule is the sampling parameters** (temperature, top_p, etc., Episode 23 special lecture). The drawn token is attached to the end of the sentence, then—new words enter the subsequent decoding. The previous KV can be reused, continue model calculation and sampling, guess the next one. Until a special token is drawn: `<结束>`.

So "AI typewriter-style outward jumping" isn't a special effect—it's the real way it works: **one loop, one token**.

![Principle Illustration](https://hyphentech.top/obsidian-assets/understand-ai-10-conversation/image-original-2-2d859ba350.png)

The same small model takes six steps down, each taking the most probable one. Step 3 is the most worth watching: after the comma, the highest candidate only has 24.7%—where the model is unsure, the draw rules are the most important.

**What does this have to do with reviews? **
Behind a score is actually an entire pipeline of production. Word segmentation determines how many tokens are counted for the same paragraph, so speed numbers like "how many tokens per second" can't be directly compared by switching the word segmentation (Issue 5). Sampling means you answer the same question differently each time: if the temperature isn't zero, you have to run several more times before looking (Issue 23). Repeating one token at a time means the speed must be split into two numbers: how long does it take for the first word to appear, then how many jumps per second (Issue 16).

## Look at how a sentence has been cut into several pieces

- Open the demo page for any online tokenizer (search "tokenizer online" to find it).
- Paste them in order: one sentence in Chinese, one English sentence with the same meaning, one emoji, and note how many pieces each was cut into pieces.
- Then stick "1883" and "1883" each to see how their cuts differ.

You'll see with your own eyes how far the "numbering" of the first station is from human intuition—word segmentation is a stop for checking text processing; The year of mispronunciation may also come from standardization, pronunciation rules, or acoustic models.

## Several terms that appear in the story

| Terminology | Plain speech |
| --- | --- |
| token | Blocks, the smallest processing unit of the model; All lengths and billing units |
| tokenizer | Tokenizer: The translation foreend for text ↔ token numbers |
| vocabulary | Vocabulary: The catalog corresponding to the model, with scale varying depending on the segmenter |
| embedding / vector | The "character profile" of the word, a long string of decimals; Similarity depends on training and comparison methods; Not factual verification |
| hidden_size | File length (dimensions) |
| self-attention | Combine location information within the limits allowed by the architecture and mask |
| Q / K / V | Question sheet / tags / content — three materials for attention |
| layer / head | Number of discussion layers / Number of parallel discussion groups per floor |
| logits → sampling | Voting for the full vocabulary list → Draw one according to the rules |
| Autoregressive | Generate one token at a time, then reconnect it to the input and generate the next loop |

Back to the old LocalBrain interface: the model makes a call, the tool returns an error, then modifies and checks. Here, the peripheral system intervenes in the response process, not hiding all actions inside the neural network. The receipt in the diagram only proves those few steps at that time, not that every task succeeded.

![Self-made Program | Bug Fix Records](https://hyphentech.top/obsidian-assets/understand-ai-10-conversation/image-tool-trace-81c8a3f815.png)

## Return to your computer

- Local model running tools (like mlx_lm, llama.cpp, Ollama, etc.) start this pipeline: each time a request is received, it runs from the first to the fourth, repeating several times
- The reasoning model's "thinking" and body text are usually advanced through word element generation; Whether budgets are shared and how to break them down Implemented by model and service: The longer the thinking is written, the fewer tokens are left for the main text (Issue 9)
- Issues like mispronunciation of the year or misaligned subtitles in speech synthesis also require checking text standardization, timestamps, acoustic models, and alignment processes, not just word segmentation

## Back to the question at the beginning

In one sentence: **Large model = Replace text with numbering (word segmentation)→ Change code to personality profile (embedding)→ Review the entire text to allocate attention→ Draw a word block from the voting sheet (sample), loop until the selection is "finished." **

Next article: Let's zoom in: How to turn a model market into your own choice, that string of parameters, instructions, and quantitative suffixes in your name.

## References

- [Attention Original Paper](https://arxiv.org/abs/1706.03762)
- [Word Element Probability Record](https://hyphentech.top/)


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
