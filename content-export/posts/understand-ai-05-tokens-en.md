---
title: "Can the same strawberry be cut into 1 or 3 pieces? Tokens, movable type printing, and AI—three accounts"
slug: understand-ai-05-tokens-en
status: published
lang: en
translation_of: understand-ai-05-tokens
translation_source: machine
source_sha256: f539283f109781d2
date: 2026-10-05
updated: 2026-10-24
summary: "The strawberry is still the same strawberry, with an extra space in front, but the machine sees a different number of blocks. An old method from data compression: how to enter the chat window and change your fees, speed, and context?"
categories:
  - AI知识
tags:
  - AI
  - Do you really understand AI?
cover: "/obsidian-assets/understand-ai-05-tokens/cover-d06e79963c.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []

---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/understand-ai-05-tokens/) is authoritative.

> [!abstract]
> The strawberry is still the same strawberry, with an extra space in front, but the machine sees a different number of blocks. An old method from data compression: how to enter the chat window and change your fees, speed, and context?
> HyphenTech · 2026-10-05

A model that can write code might fail when counting the R in Strawberry. It's not that the strawberry is too hard; it's that once text enters the model, it might still be the ten letters in front of us. Let's break down this joke first, then see how the same cutting method simultaneously affects billing, speed, and context.

The previous article said that what neural networks feed in are numbers, and what they spit out are numbers too. But what you call it is just one sentence.
This article explains the first step in turning this sentence into a number: **cutting into pieces**. This step may seem the most inconspicuous, but it explains three odd things—why the model can't count the letters clearly, why the "prices" differ between Chinese and English, and why the speed numbers on the test sheet can't be directly compared.

## A model that can write code but can't count the letters

In 2024, a small quiz went viral online: asking the top chat models at the time, "How many 'rs' are in the word 'strawberry'?" ”

Many models confidently answered: **Two. **

The correct answer is three. The same batch of models can write hundreds of lines of code and score high on various exams, yet they mess up on a question that even elementary school students wouldn't get wrong. You might guess: it was careless, or it actually doesn't understand English well.

Participles make it represent differently, but this does not mean it will never count. Models may also learn spelling, or complete counting through character-by-character expansion and tools.

In model input, strawberry is usually first converted into word numbers by the word segmentation tool, not necessarily ten independent letters. The following segmentation method comes from a record held in the knowledge base on September 11, 2026, showing version differences, not a rerun of this round:

| Chopper | Strawberry alone | The middle of the sentence with "space + strawberry" |
| --- | --- | --- |
| Qwen3.6 | str · aw · berry (3 pieces) | 1 whole piece |
| GPT-4o uses the o200k | st · raw · berry (3 pieces) | 1 whole piece |
| Gemma 4 | 1 whole piece | 1 whole piece |

Pay attention to the last column. In English sentences, words often have leading spaces; the vocabulary list can combine "space + strawberry" into a single word. The cutting method also varies when starting or after punctuation, or when using different preprocessing rules. You can't say that English words always have spaces at the front.

Asking how many r's are in the word 'model' is like pointing to a number tag and asking: How many r's are on it? It can also be expanded verbatimly or calculated using code tools, not just one route.

Now expand the number tags: S, T, R, A, W, B, E, R, R, Y. r is at digits 3, 8, and 9, making a total of 3 numbers. This expansion is not about changing the model's expression to a more attractive expression, but about changing the verification object from "roughly how to spell this word" to "checking each of these ten positions item by item."

The same method applies to ID numbers, order numbers, and file names. When paragraphs are rewritten, key strings can be extracted and compared separately. The model saying "keep as is" is just a claim; Character consistency is evidence of this requirement. The value of the strawberry joke is not in declaring the model dumb, but in finding a set of checks that don't rely on trust.

But "cutting into whole pieces" is not a death sentence that can't be counted. The model may learn spelling, explicitly expand letters, or use code to check. The real problem is: word prediction and character-by-character counting are not the same operation; just because it writes well in English doesn't guarantee the letter count will be reliable.

## What the model saw was a string of numbers

To understand the cutter, the best analogy is something invented by the Chinese a thousand years ago: **movable type printing**.

Shen Kuo of the Northern Song dynasty recorded Bi Sheng's method in his "Dream Pool Essays": carving each character into clay movable type, and during typesetting, picking them from the character tray to form a single page. Common characters like "zhi" and "ye" were each kept in hand with more than twenty pieces to avoid running out of items when they appeared repeatedly on one page; when encountering rare characters not on the character plate, he would "carve them on the spot"—one on the spot.

The way the model reads text is well-suited for analogy at the level of "fixed font disk versus number," but the actual algorithm is naturally different:

- **Font Disk**: The model comes with a fixed set of "movable type" from the factory, called a vocabulary. The Qwen 3.6 disc contains about 248,000 characters, while the Gemma 4 has 262,000 characters.
- **Movable Type**: Each coin in the font disk is called a **token**, often translated as "ciyuan" in Chinese. It can be a single character, half a character, a word, or a word with a space in front of it.
- **Grid Number**: Each movable type has a fixed number on the font plate. **What the model actually reads is this string of numbers. **

Word segmentation usually encodes text according to fixed word lists, rules, and preprocessing methods during reasoning; It is not another chat model that understands the entire semantic. However, word lists can learn from corpus data, so fixed execution rules should not be mistakenly written as if the entire production process was never learned.

Let's look at the most ordinary sentence—**"The weather is great today, let's go for a walk in the park." **This article will follow it all the way. Four cutters cut four different shapes:

![Principle Illustration](https://hyphentech.top/obsidian-assets/understand-ai-05-tokens/image-original-1-96738a1fb8.png)

This sentence has 16 characters: 14 Chinese characters plus commas and periods. In the old records, Qwen3.6 was cut into 9 pieces, and the other three were cut into 12 to 13 pieces. o200k split "today's weather" into "jin|tiantian|qi", without following the word boundaries people would choose.

The most interesting part is the bottom line. "Tiantian" is a very common word (study hard, improve every day), so the o200k keypad includes it; As a result, "today's weather" was split into "jin," "tiantian," and "qi," **breaking the two words apart and soldering them in the wrong place**. The chunker doesn't understand what Chinese words are; it only remembers which segments appear most often together.

## How was this movable type made?

So, which movable type is kept in the font plate, and who decides it?

The answer comes from an unexpected place: **data compression**. In 1994, programmer Philip Gage published a trick for compressing files in a programming magazine: find the two most common bytes in the file and replace them with a new symbol; then find the next pair and replace them again...... Keep going until there are no more replacements. This method is called **byte encoding**, abbreviated as **BPE**.

In a 2016 machine translation paper, Senrich and colleagues used BPE for subword representation to alleviate the issue of rare words. Common segmentation schemes today include Unigram, which cannot be treated as the same merging algorithm for all segmenters.

Its idea can be summed up in one sentence: **Start with a single letter, count which two pieces are most often placed together, weld them together, and put them on the font disk; Repeat this process until the disk is full. **

The following code really works. The corpus consists of four English words and their frequency of occurrence, with "_" indicating the ending:

```python
import re
from collections import Counter

# 一份迷你语料：词 → 出现次数。先把每个词拆成单个字母，“_”表示词尾
vocab = {"l o w _": 5, "l o w e r _": 2, "n e w e s t _": 6, "w i d e s t _": 3}

for step in range(1, 7):
    pairs = Counter()
    for word, freq in vocab.items():              # 数一数：哪两块最常挨在一起
        s = word.split()
        for a, b in zip(s, s[1:]):
            pairs[a, b] += freq
    (a, b), n = pairs.most_common(1)[0]
    pat = re.compile(r"(?<!\S)" + re.escape(f"{a} {b}") + r"(?!\S)")
    vocab = {pat.sub(a + b, w): f for w, f in vocab.items()}   # 把这一对焊成一块
    print(f"第 {step} 次合并：{a} + {b} → {a + b}（一共出现 {n} 次）")

print(list(vocab))
```

Output from the knowledge base retained in September 2026:

```text
第 1 次合并：e + s → es（一共出现 9 次）
第 2 次合并：es + t → est（一共出现 9 次）
第 3 次合并：est + _ → est_（一共出现 9 次）
第 4 次合并：l + o → lo（一共出现 7 次）
第 5 次合并：lo + w → low（一共出现 7 次）
第 6 次合并：n + e → ne（一共出现 6 次）
['low _', 'low e r _', 'ne w est_', 'w i d est_']
```

![Principle Illustration](https://hyphentech.top/obsidian-assets/understand-ai-05-tokens/image-original-2-1668364942.png)

Newest appears 6 times, Widest 3 times, so "es" is placed together 9 times, with the first piece welded on. After six welds, newest becomes ne, w, est_.

This code demonstrates the idea of merging frequently adjacent segments, not a complete replica of any product's segmentation tool. Byte-level BPE can start from 256 types of bytes; Other solutions start with characters or other initial units. List size, presegmentation, normalization, and special markings also change the actual results.

This process is also like a small shop preparing packing bags: items bought together often are pre-packed into groups, while scattered needs are still assembled from small pieces. BPE's "merging" corresponds to frequently adjacent segments gradually forming larger ones, while the vocabulary lists record which parts are and their numbers; When you actually cut a new piece of text, you encode it according to the learned rules. It doesn't re-examine your buying habits every chat, nor does it guarantee that a language will always be packed more efficiently. The following obscure characters test how to handle items when the combo bag is unavailable.

**This also explains the initial strawberry**: it appears enough in English corpora that "space + strawberry" has long been soldered into a single block. After soldering into a single piece, there are several 'rs' inside, and the model does not directly have ten individual letters; this does not mean permanent loss of spelling ability.

## What should you do if the characters aren't on the dial?

When Bi Sheng encounters obscure characters, he can carve them on the spot. The cutter can't carve characters, so it can only **use smaller parts to assemble**.

In schemes that support byte representation or byte rollback, smaller byte units can be used to encode characters not directly included in the word list. Common Chinese characters typically occupy 3 bytes in UTF-8, while some rare characters occupy 4 bytes; Segmentation rules determine how many bytes these bytes belong to. This is not the same guarantee that all segmentation devices have.

Record the old participles of the four rare characters "taotie, unou, and ni":

| Chopper | Cut into several pieces | Let's look at each piece individually |
| --- | --- | --- |
| Qwen3.6 | 8 blocks (2 blocks per character) | All of them are " |
| GPT-4o's o200k | Just the two characters "Taotie" alone make up 4 pieces | All of them are " |
| Gemma 4 | 4 blocks (one character per block) | Tao · Tie · Elderly · Elderly |

Decoding an incomplete UTF-8 byte fragment alone may display " ". It is not strictly a "half a Chinese character," nor does it necessarily mean the file is corrupted; After reassembling the complete sequence of bytes, the original text may be restored normally. The different cutting methods in the diagram need to be viewed together with the decoding method.

The numbers are also interesting. "1234567890" in Qwen3.6 and Gemma 4 is 10 blocks, each number per block; In LFM2.5, it's "123|456|789|0" four blocks. Breaking down numbers one by one is a deliberate design of many new models: Meta's 2023 LLaMA paper specifically included two points—breaking all numbers into single digits; When encountering unfamiliar characters, they return to bytes. The reasoning is simple: if "123" and "124" are two unrelated numbers, learning to carry becomes much harder for the model.

## The same sentence means the prices differ between Chinese and English

The number of words is included in the cost calculation, but the number of blocks does not equal the entire bill. Input, output, and cache hits may use different rates, depending on the price of the service used and the statistical criteria.

The old records in the knowledge base compared fixed Chinese samples with English character samples, each containing 3,000 characters. It is suitable for observing how the same text length is encoded and does not guarantee that the two sets of text express the same amount of information:

| Chopper | 3,000 Chinese characters → blocks | On average, a few words per block | 3,000 English characters → blocks | On average, each block is a few characters |
| --- | --- | --- | --- | --- |
| Qwen3.6 | 1861 | 1.61 | 871 | 3.44 |
| Gemma 4 | 2075 | 1.45 | 926 | 3.24 |
| LFM2.5 | 2335 | 1.28 | 882 | 3.40 |

Two patterns can be seen.

**First, for the same paragraph of Chinese, switching to a block cutter can reduce the number of blocks by a quarter. ** Qwen 3.6 is the most economical, LFM 2.5 is the most cost-effective. The more Chinese word blocks you have in the font drive, the more economical the chopping.

When comparing two languages, it's best to control the content of the expression as much as possible, not just the number of characters. Here, the Chinese example sentence has 16 characters; The English sentence "The weather is really nice today, let's take a walk in the park." Contains 64 characters. The old record gave these two samples 9 and 16 characters. This shows that the difference in encoding this time is not enough to deduce that Chinese is always cheaper, nor can character count be used as information.

Cross-language word segmentation research has found that when different languages express similar content, the number of word characters may be uneven. Differences also vary depending on the segmentation version and sample. Therefore, the most direct way to determine your Chinese task is to count with actual input; Do not apply the average multiplier from a single study to all models and articles.

## The token consists of three units at once

The reason I specifically discuss chunking is because tokens are not just something inside the model; they are also the **three types of units** you encounter outside:

- **Billing Unit**. Online large models charge by token, usually quoting "per million tokens," with input and output priced separately.
- **Speed units**. "50 tokens per second" means the model spits out several blocks per second.
- **Length unit**. "Supports 128K context", usually calculates capacity by word number; specific K caliber, input/output, and multimodal usage depend on the service used; History, data, and output also need to be budgeted.

Three units, the same ruler. ** Once the cutter is changed, all three accounts are transformed. **

The three accounts cannot be roughly multiplied by a coefficient together. First, look at the context: it contains not only this problem, but also system commands, history, search data, tool receipts, and needs to reserve space for output. Below is an example assuming a total budget of 10,000 bytes, which does not correspond to any interface in the real package.

The context window is like the work materials currently spread out on the desktop: your questions, previous conversations, found materials, and tool receipts all take up space, leaving room for new answers. It's different from long-term archives; Software can store old records elsewhere, but if you don't put them back on the desktop next time, the model may not be usable. Billing is like a shipping bill—materials loaded in and results sent out may be priced separately. Therefore, "how much the desktop can fit" and "how much you paid for this trip" can't be counted by just stating a single word number.

| Occupied portion | Word Budget | Why can't we skip the calculation? |
| --- | --- | --- |
| System commands and templates | 1000 | Not all of them are visible on the interface |
| Historical dialogue | 4000 | Old answers will also be entered later |
| This issue and materials | 3000 | Attachments are also available for transcription and retrieval of snippets |
| Output reserved | 2000 | If the front is full, there's no room for answers |

Next, look at the cost: the same 2000 output words may not be the same as the 2000 input terms; Buffer discounts also need to be confirmed whether the service is accurate and how the fees are. Finally, look at the wait: input pre-filled, step-by-step decoding, network and tool time are not the same indicator. The number of words helps you calculate your budget, but it cannot explain the end-to-end experience alone.

The 128K window follows the same principle. It first refers to the capacity defined by a specific model or service; Whether it can be stored in local memory and reliably retrieved information in the middle of long texts are two other issues. The estimated "how many Chinese characters can be stored" based on a passage can only be used for the approximate budget of that type of text, not a conversion rate applicable to any material.

Both models report 50 characters per second, so this cannot be used to determine that readers receive the same amount of content. If the statistical density of the output text is 1.61 and 1.28 Chinese characters per word respectively, then it can be estimated to be 80.5 and 64 characters per second; The table above measures input samples and cannot directly prove the output has the same density. In actual horizontal evaluation, the original output should be retained, while recording word values, characters, initial word delay, and total time.

## The subtle and lively characters on the plate

Just because a word is present in the font doesn't mean the language model can always handle it stably. Some abnormal strings actually expose interface issues between the segmenter and model training.

In early 2023, two researchers, Jessica Rumbelow and Matthew Watkins, dug up a batch of strange tokens on the GPT-2 and GPT-3 font disks. The most famous was "SolidGoldMagikarp," originally a Reddit username. This user had long been stuck in a "everyone counts from 1 to infinity" section, with the name appearing so often that the blocker soldered it into a whole block.

Researchers discuss explanations such as inconsistent coverage between the hypermorphicist corpus and model training. It is clear that encoding a string in a word list does not mean the model can handle it stably; Exceptions to a word cannot be attributed solely to a single story as internal causes.

These cases are called faulty word tokens. They remind us to check coding, training coverage, and generation behavior, but what exactly causes an exception still requires experimentation. An interesting username story cannot provide a unique diagnosis for all faulty word tokens.

## Cut it by hand

Install an OpenAI open-source chunking library, and you can see how a sentence is cut into just five lines of code:

```python
import tiktoken                                   # pip install tiktoken
enc = tiktoken.get_encoding("o200k_base")         # GPT-4o 等模型用的分词器
for s in ["今天天气真好，我们去公园散步吧。", "strawberry", " strawberry", "饕餮"]:
    ids = enc.encode(s)
    print(len(ids), [enc.decode([i]) for i in ids])
```

True Output:

```text
13 ['今', '天天', '气', '真', '好', '，我们', '去', '公', '园', '散', '步', '吧', '。']
3 ['st', 'raw', 'berry']
1 [' strawberry']
4 ['�', '�', '�', '�']
```

Try a few sentences: your name, a dialect, a line of code, an emoji. **Where the fragments are especially fine, more words are consumed. ** This affects cost and length budget; But you can't just assume the answer will be worse based on the number of blocks; the ability depends on training coverage and specific tasks.

## Back to the question at the beginning

A more reliable judgment is: character-by-character operation and word formation are not the same thing. Tasks like long random strings, rare words, and repeated character counting require even more verification. If you ask "How many r's are there?", you only get the answer and haven't seen any reliable method used.

Take strawberry as a specific example: manual decomposition is S, T, R, A, W, B, E, R, R, Y; r is at the 3rd, 8th, and 9th digits, a total of 3 times. This is a character calculation, not a model ability test for this round. Letting it output a breakdown and then use a program to check is more useful than letting it confidently answer again.

This is especially true for passwords, serial numbers, and order numbers. Instead of the model saying "retained as is," it's better to do string comparison. Keeping the captcha character by character is usually more hassle-free for ordinary code, as there's no need to hire a network that can chat to take the blame.

When observing individual characters, you may also see replacement characters "": A complete Unicode character may be split into different byte segments. Single-block decoding shows exceptions, but it does not mean the entire string of text is corrupted; Checking the restored result of the complete sequence is meaningful.

Back to Strawberry: Word characters change the machine's representation, but they're not a universal explanation for failure. Counts need to be checked, bills should be checked based on actual usage, speed based on original output, and context based on the full input budget. The same ruler connects several things, but can't complete acceptance for them.

## Several terms that appear in the story

| Terminology | Plain speech |
| --- | --- |
| token | Units of text encoding can be words, character fragments, punctuation, or bytes |
| tokenizer | Code text by vocabulary, rules, and preprocessing; The vocabulary itself can be learned from the corpus |
| Vocabulary | List of words and numbers; The scale depends on the specific model and version |
| token ID | The number of each token in the glossary is what the model actually reads |
| BPE byte pair encoding | Repeatedly weld the two most often adjacent pieces into one piece to create a complete vocabulary |
| Byte fallback | Characters not in the vocabulary list are broken down into bytes to represent them |
| Faulty token glitch token | Exceptions that certain models cannot handle stably; Internal causes require specific verification |
| Word count per block | The average number of characters per word in a specific text; Input, output, and different languages should be counted separately |

Next article: Cats and dogs look alike, but cats and cabinets are not. Putting this intuition into numbers, words become distant; But "allowed for commercial use" and "not allowed for commercial use" can also be very close. Related information does not equal the correct answer.

## References

- [BPE Machine Translation Paper](https://aclanthology.org/P16-1162/)
- [tiktoken Official Code](https://github.com/openai/tiktoken)


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
