---
title: "Can Transformers remember 128K just by seeing it? Three misconceptions about QKV from 2017"
slug: understand-ai-07-attention-en
status: published
lang: en
translation_of: understand-ai-07-attention
translation_source: machine
source_sha256: 1e9f12e2a860a55c
date: 2026-10-05
updated: 2026-10-14
summary: "One-stop relaying and constantly searching for previous texts are two different organizational methods. The 2017 paper changed the language model, but it did not give the machine an unforgettable memory."
categories:
  - AI知识
tags:
  - AI
  - Do you really understand AI?
cover: "/obsidian-assets/understand-ai-07-attention/cover-29c4bc864f.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []

---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/understand-ai-07-attention/) is authoritative.

> [!abstract]
> One-stop relaying and constantly searching for previous texts are two different organizational methods. The 2017 paper changed the language model, but it did not give the machine an unforgettable memory.
> HyphenTech · 2026-10-05

The same three requirements stand out in short texts, but may be missed if embedded in long ones. What exactly does a model card with 128K guarantee? First, look at how that 2017 paper changed the way information is organized, then why "having the chance to see" doesn't mean "reliable use."

Issue 6 turns each word into a representation that can be compared and calculated. But words in a sentence are not each in their own way: who "it" refers to depends on the context. How can we make every word "visible" to the other words?
Transformers and their improvements are a crucial foundation for many mainstream language models, but there are also loops, state spaces, and hybrid architectures, so not all large models are without exception. A 2017 paper provided us with a clear entry point for understanding attention.
This article breaks it down. **It really connects the previous parts**. After reading it, you'll truly understand what "attention" is and why it allows the model to grow explosively. There will be a twenty-line piece of code that runs and is easy to understand.

## Let's first look at what it replaces

Before 2017, the mainstream processing languages were **Recurrent Neural Networks** (RNNs) and their improved versions, LSTMs.

Its working method is intuitive: like reading a book, **word by word** and maintaining a "memory state," updating memory with every word read.

There are two difficulties in passing states along the sequence:

**1. Sequential dependencies within sequences. ** To calculate the 100th word, you must first count the first 99—because memory states are passed down gradually. This means that no matter how many graphics cards you buy, computations in the sequence direction are constrained by recursive dependencies; Batch and partial internal computations can still run in parallel. This bottleneck is important, but it does not mean that circular architectures will never be useful.

**2. Long-distance Forgetting. ** Information must be transmitted one station at a time; the farther it travels, the more attenuation it gets. A key name that appears at the beginning of a paragraph is already blurred by the end. LSTM alleviated this problem with clever gating mechanisms, but failed to cure it.

![Message Transmission Diagram](https://hyphentech.top/obsidian-assets/understand-ai-07-attention/image-rnn-vs-attention-cfb3100721.png)

## The title of that paper is its claim

In 2017, eight researchers published "Attention Is All You Need"—**Attention Is All You Need**.

The provocative meaning in the title is clear: previously, the attention mechanism was just an auxiliary component of RNNs; They said, **throw away the entire RNN and leave only the attention for better results.** **

And indeed, it turned out to be true. The new architecture was named **Transformer**.

## Attention: A dictionary lookup for the whole room

The best analogy for understanding self-attention is **looking up a dictionary**, or a whole room question.

Each word in a sentence generates three things (all vectors, calculated from three trainable weight matrices from word vectors):

| Name | Full name | Plain speech |
| --- | --- | --- |
| **Q** | Query: query | What information do I want to find now? (My question list) |
| **K** | Key | What information can I find here? (My tag) |
| **V** | Value | What I can actually provide |

Then something happened:

**For each word, take your own question sheet and compare it with the tag K of all words in the sentence one by one, calculate "who is most relevant to," and then aggregate everyone's content by weighting the V according to their relevance. **

Here's an example. The sentence is: "That cat didn't cross the street because **it** was too tired." When the model processes the word "it," the "it" question sheet roughly asks, "Who am I referring to?" "—This questionnaire matches the label of the "cat" highly, but matches poorly with the label of "road." This example shows how relevant information can be summarized, rather than reading the attention of a real model; The actual attention distribution requires checking the specific layer, head, position, and input.

Weighted summaries provide a computational method for relating distant information; True reference judgments still rely on multi-layer representations, training, and context; a single weighting is not guaranteed to be correct.

Reduce "attention" to a small calculation. Assuming the current position scores 2, 1, 0 for three candidate positions, softmax will be about 0.665, 0.245, 0.090. Note: these numbers add up to 1, the highest score gives more weight, but the other two positions do not disappear completely.

Think of this step as giving a pot of water to several cups: the candidate scores first specify who should get more, then softmax converts them into a total pot share. It's not directly splitting water proportionally according to the original score; the specific conversion rules determine how significant the difference will be. Weighted summary uses the corresponding content based on each cup's share. This scenario explains "normalization" and "weighting," without making the more water distribution more realistic; So next, you also multiply the weights by V to see what the final summary gets.

If the V at the three positions is 10, 20, and 30, the sum of these dimensions is about 10×0.665 + 20×0.245 + 30×0.090 = 14.25. Here, manual single-dimensional values are used to explain the mechanism, not the real attention record of a model. Q and K are responsible for matching, and V provides the summation content; That's why the formula ultimately multiplies V.

| Words that are easy to misread | This time, the calculation actually does |
| --- | --- |
| "Question" | The learned Q and K participate in the dot product, not that the machine reads a Chinese question sheet |
| "Attention Rating: 66.5%" | This weighted ratio does not mean that the conclusion is 66.5% true |
| "Cats Attract Attention" | The association of information at a certain layer or head does not mean that the entire reference judgment has been explained |

This process can bring distant information into the current representation, but there are multiple layers of computation afterward. If the data obtained is incorrect, the summary will not turn it into fact; If the task requires precise counting, a single association does not equal executing a counting program. Understanding the value of a mechanism lies in knowing what operations it provides, not labeling it as capable of anything.

![Mechanism Illustration](https://hyphentech.top/obsidian-assets/understand-ai-07-attention/image-lesson-diagram-1-0fb2c9a2ce.png)

The key point is: this comparison is performed simultaneously by all words for all words. Between the first word and the 1000th word is a **one-step direct route**, without needing to pass through the middle 998 stations. It shortens the information interaction path and increases the chance of parallelism during training and prefilling phases; However, generated word metas usually still depend on gradually, and long-distance information may be missed, without eliminating forgetting.

## Formula, translated item by item

The core formula in the paper looks like this:

```
Attention(Q, K, V) = softmax( Q·Kᵀ / √d_k ) · V
```

Breaking it down, each step is a literal translation of the above passage:

| Fragment | What is being done? |
| --- | --- |
| `Q·Kᵀ` | Each keyword's question sheet and each word's label are paired to determine similarity → to get a score table showing "who is related to whom." |
| `/ √d_k` | Divide by the square root of the vector dimension, **scaling** |
| `softmax(...)` | Turn the score table into a **attention allocation** (percentage) that sums to 1 |
| `· V` | Based on this percentage, the content of all words is weighted and summarized |

The scaling term handles the range of values: under the original analytical assumption, the variance of the dot product increases with dimension, and too large scores can cause the softmax distribution to be too sharp and the gradient to shrink. Dividing by the square root of the dimension helps mitigate this. It is not that arbitrarily high-dimensional vectors necessarily increase, nor can all training faults be fixed by this term.

## 3×3 Matrix: Calculate attention once by hand

```python
import numpy as np

def softmax(x):
    e = np.exp(x - x.max(axis=-1, keepdims=True)) # 减最大值，防数值溢出
    return e / e.sum(axis=-1, keepdims=True)

# 一句话 3 个词，每个词用 4 维向量表示
X = np.array([
    [1.0, 0.0, 1.0, 0.0], # 词1
    [0.0, 2.0, 0.0, 2.0], # 词2
    [1.0, 1.0, 1.0, 1.0], # 词3
])
d_k = X.shape[1]

# 真实模型里 W_q/W_k/W_v 是训练出来的；这里用单位矩阵简化，专注看机制
W_q = W_k = W_v = np.eye(d_k)
Q, K, V = X @ W_q, X @ W_k, X @ W_v

scores = Q @ K.T / np.sqrt(d_k) # ① 提问单 × 标签 → 相关性分数表
weights = softmax(scores) # ② 转成总和为 1 的关注度分配
output = weights @ V # ③ 按关注度加权汇总所有内容

print("关注度矩阵（每行总和为1）：\n", weights.round(3))
print("\n每个词的新表示：\n", output.round(3))
```

Run a bit, and you'll see a 3×3 attention matrix. **The number in row i, column j is "how much attention is allocated to word j" in line i, and each row adds up to exactly 1. **

![Mechanism Illustration](https://hyphentech.top/obsidian-assets/understand-ai-07-attention/image-lesson-diagram-2-bb46820137.png)

This code shows a single computation of the attention module, not a complete Transformer. The real model also needs to learn the projection matrix and combine feedforward networks, residuals, normalization, position representation, and training objectives. There is no causal mask here, so it cannot be directly treated as a complete program generated step by step by GPT.

There is also an access control rule called causal masking: when doing fill-in-the-blanks, the standard answer behind it is covered and only the previously given content is allowed. Although training can arrange operations for multiple positions together, each position still cannot peek at the later text it should not use. Position representation is like adding page numbers or sequential markings to materials, allowing similar content to be compared while preserving the sequence. They control which information can be used and how to identify positions, not letting the model automatically know the truth of facts.

## Why do you still need these partners for attention?

Once information can be linked to each other, relationships must be organized from different angles, positions known, stable transmission, and further processing. The original paper combined these components into a trainable network, rather than leaving only a softmax formula.

**Multi-head attention. ** Projecting learnable input into multiple groups of heads for parallel computation, and finally summarizing. It's not about automatically gaining specialized knowledge by cutting a few segments of the original word vector. Some heads may show different relational preferences, but their responsibilities are influenced by training—not by artificial rules: one header controls syntax and another heads manages facts.

**2. Positional Encoding. ** There is a big issue here that is easily overlooked:** The attention mechanism itself completely ignores word order. ** In pure self-attention without adding position or causal masks, reordering input corresponds to rearranged output; It cannot rely solely on this layer to distinguish which position the word is in. This does not mean that the per-position output values of two sentences must be the same.

And word order clearly carries meaning. The solution is: add a code representing "which bit am I in" on each word's vector. The original paper used a set of sine and cosine waves of different frequencies; Position representations can be used for unseen lengths, but this does not guarantee reliable model performance at those lengths; later models have various improved versions.

Positional relationships must be entered into computation through appropriate mechanisms within the architecture. The original paper's sine and cosine position coding is not the same operation as later rotation position schemes. Capacity expansion and position handling are related to the performance of long papers, but any omission cannot be attributed entirely to position coding without verification.

**3. Residual Connections and Layer Normalization. ** Stacking dozens of layers makes signals easily distorted or exploded during transmission. **Residual Connections** involves adding its own input to each layer's output (taking a "shortcut"), which helps information and gradient propagation without guaranteeing that no details are lost; **Layer normalization** pulls each layer's values back to stable ranges. These two seemingly inconspicuous designs are key to the ability of deep networks to operate.

**Feedforward networks. ** The attention is responsible for aggregating information across locations, and the feedforward network continues to transform the representation of each position. Together with residuals, normalization, and other factors, they form a common layer; The final answer is not determined just because the attention retrieves the data.

Continuing along the data circulation scenario: attention first gathers relevant content from other positions to the nearest side, feedforward networks then process the representation of the current position; Residual connections keep the original next to the revised draft, combining the original information with new modifications; Normalization adjusts numerical scales before comparing several readings to ensure more stable subsequent processing. Each component has its own function; combining them completes a complete layer of processing. Analogy helps divide labor; real operations handle vectors and parameters, not colleagues who do not have meetings.

## From Transformer to GPT

The original paper structure was divided into two halves: the **Encoder** (responsible for understanding input) and the **Decoder** (responsible for generating output**), since it was originally designed for machine translation.

Later, two paths diverged:

- **BERT** Only uses encoders → Skilled at understanding class tasks (classification, retrieval)
- **GPT** uses decoder-style causal language modeling → excels at generation; Modern chat systems may still adopt other or hybrid structures

There is a key setting in GPT's path called the **causal mask**: when generating the Nth word, attention is only allowed to focus on the current prefix of the next word, not to see the next answer to be predicted, and not to peek at the rest. The reason is simple—its training task is to predict the next word, and seeing the answer is equivalent to cheating. **

This limitation of "only looking at prefixes already provided" is the premise for KV cache to hold (the cache content in issue 22 will use it as a memory ledger): because with fixed models and the same prefix, compatible positions, and cache settings, K and V at previous locations do not need to be recalculated due to additional words, so they can be counted once and stored for repeated use.

Then parallelism and cache are connected. During training, knowing the complete sample text, prediction losses for many positions can be calculated simultaneously under causal mask constraints; During generation, if the next word has not yet been selected, the following prefix is incomplete. The former has parallelism opportunities, while the latter still depends on order.

KV cache reuses keys and values calculated from compatibility prefixes. It reduces repetitive work for subsequent decoding, but still handles new words and uses preceding states within the corresponding attention boundaries. It is neither a model parameter nor a permanent memory across sessions. As the window grows longer, cache occupancy and read costs are linked to hardware periods.

Long-context evaluation also depends on where the information is placed. The 2023 "Lost in the Middle" found position impact in specific models and tasks: when important information is in the middle, some models perform poorly. It provides a variable worth retesting, not a judgment that all current models will fail. [Original Research](https://arxiv.org/abs/2307.03172)

## The three most easily confused "can see"

| Explanation | A jump that doesn't make sense | Methods that can be checked |
| --- | --- | --- |
| Windows can fit 128K | Jumping directly from capacity to every position is reliable | Put the same fact at the beginning, middle, and end, and check for omissions and conditions |
| High attention weight | Jumping from single-layer association to final causal explanation | Distinguish between the distribution of layers and heads, the final output, and specialized causal experiments |
| Training can proceed simultaneously | From training parallel jumps to generation, no word-by-word waiting | Separately test input prefill, initial word delay, and subsequent decoding, without mixing them into the same speed |

![meme](https://hyphentech.top/obsidian-assets/understand-ai-07-attention/image-meme-85c7741adb.png)

## With this in mind, I'll give it a try

Write a short essay with 3 constraints, moving the most critical ones to the beginning, middle, and end. Create a checklist first, then decide whether to request the model. Runtime records full input, model version, answers, and omissions to avoid leaving only the best one. The above unit matrix example is used to illustrate the algorithm, not to prove that a real model allocates "it" attention to the "cat."

Transformer shortens information interaction paths and improves parallel opportunities during training and prefilling. Whether long texts can be reliably used depends on capacity, location, task, training, and inference configuration. QKV helps with information exchange without stamping facts; 128K provides a budget but does not guarantee every position will be correct.

## Several terms that appear in the story

| Terminology | Plain speech |
| --- | --- |
| RNN / LSTM | The loop state is gradually passed along the sequence, limiting the parallelism of sequence dimensions; Other dimensions can still be parallel |
| Self-attention | All words within the sentence are compared and weighted by relevance |
| Q / K / V | Question Sheet / Tags / Content |
| softmax | Turn a bunch of scores into a percentage allocation that sums up to 1 |
| Zoom √d_k | This prevents excessive dot accumulation from causing softmax saturation and gradient disappearance |
| Bullish attention | Simultaneously pay attention multiple times, each focusing on different types of relationships |
| Location coding | Provides relative or absolute location information; Pure attention content does not come with location codes |
| Residual connection | A shortcut of summing outputs and inputs helps with information and gradient propagation |
| Layer upon layer unified transformation | Pull each stack back to a stable range |
| Encoder/Decoder | Understand input / generate output; BERT uses the former, GPT uses the latter |
| Causality masking | When spawned, only the previous text is allowed; no sneaking peeks at the answers |

Next article: The completion function continues to list questions, but the assistant will answer, explain, or refuse. Teaching it to be like an assistant and making every sentence truthful are two different tasks.

## References

- [Transformer Original Paper](https://arxiv.org/abs/1706.03762)
- [Research on Long Context Position Effects](https://arxiv.org/abs/2307.03172)


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
