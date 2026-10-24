---
title: "Embedding: Is similarity correct? Three words, a vector space, and a misunderstanding of knowledge bases"
slug: understand-ai-06-embeddings-en
status: published
lang: en
translation_of: understand-ai-06-embeddings
translation_source: machine
source_sha256: 895d27be0d927648
date: 2026-10-05
updated: 2026-10-24
summary: "Cats and dogs look alike, but cats and cabinets are not. Putting this intuition into numbers, words become distant; But \"allowed for commercial use\" and \"not allowed for commercial use\" can also be very close. Relevant information does not equal the correct answer."
categories:
  - AI知识
tags:
  - AI
  - Do you really understand AI?
cover: "/obsidian-assets/understand-ai-06-embeddings/cover-f57e46b590.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []

---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/understand-ai-06-embeddings/) is authoritative.

> [!abstract]
> Cats and dogs look alike, but cats and cabinets are not. Putting this intuition into numbers, words become distant; But "allowed for commercial use" and "not allowed for commercial use" can also be very close. Relevant information does not equal the correct answer.
> HyphenTech · 2026-10-05

Cats and dogs are alike, cats and cabinets are not—turning this intuition into numbers is a useful starting point for vectors. But "can be used commercially" and "not commercial" can also be highly similar. The answer you most want is hidden in that word "no."

Issue 5 broke a sentence into a string of numbers. But the numbers themselves are meaningless—between numbers 3721 and 5893, you can't tell which is more similar to whom.
This article addresses that groundbreaking problem: **How do you turn 'meaning,' the least mathematical thing, into a number that machines can calculate? ** The answer is a simple insight into words and context in linguistics.

## The dumbest way, and why it doesn't work

The most direct idea: assign a number to each word in the list. "Cat" is 3721, "dog" is 5893, "cabinet" is 5894.

You can write each number as one-hot: If the list has 100,000 entries, use a 100,000-dimensional vector, with only the corresponding position 1 and the rest 0. This is a way to explain the nature of the representation; In practice, embedding in the lookup table usually uses the number directly, without actually storing a long string of zeros for each word.

This scheme has two fatal flaws:

If each one-hot is stored as a dense vector, a large number of zeros will waste space. However, sparse representations and direct table lookups can avoid this waste, so the focus is not just on its length.

**2. Even more fatal—it itself does not encode semantic distance. ** In this representation, the distance between any two words is **exactly the same**. The distance between "cat" and "dog" is equal to the distance between "cat" and "cabinet," and equal to the distance between "cat" and "quantum mechanics."

Just looking at this representation, the machine can't judge that cats and dogs are more similar. Subsequent training can still learn useful representations. **You turned words into numbers, but didn't turn 'meaning' into numbers. **

Going further: suppose the embedding matrix has 100,000 rows, each containing hundreds of numbers. The "cat" number only finds the corresponding row, not treats 3721 as a size for comparison. Extracting this row is the cat's initial vector; In training, prediction errors affect relevant parameters through gradients, including the values of this table.

The difference between numbering and vectors can be understood by comparing supermarket shelves: product barcodes are responsible for finding products; it's not that the closer the barcode is, the more similar the products become; another record sheet can list comparable information such as weight and taste. Embedding lookups extract a set of numbers after the first type of positioning, then train these numbers to be useful for tasks. Each dimension of a real vector usually cannot be directly called "sweetness" or "animal level"; the shelf metaphor only helps us distinguish between indexes and numerical representations.

So, moving from number to vector isn't about adding a decimal to the number, nor first translating words into artificial labels like "animal, pet, cute." It's about connecting a discrete index to a set of learnable consecutive values. The knobs for issue 4 haven't disappeared; they're just now organized into a table that can be retrieved.

![Mechanism Illustration](https://hyphentech.top/obsidian-assets/understand-ai-06-embeddings/image-lesson-diagram-1-3d99ba2ebc.png)

## That simple insight

The turning point came from linguistics, and it predates deep learning by half a century.

In 1957, British linguist J.R. Firth left behind a quoted phrase that has been quoted countless times, roughly saying: **Look at which words a word accompanies and you'll know what it means. **

This is the **distributional hypothesis**. Its claims sound almost nonsensical, but on closer thought, they are extremely sharp:

Common contexts provide semantic and usage clues. It supports learning representation, but that doesn't mean dictionary definitions have no value, nor does it mean words in the same context can be interchangeable.

Here's an example. Suppose you don't recognize the word "Daigo" at all, but you've seen ten thousand sentences containing it, and you'll find it always appears near "enlightenment," "sudden enlightenment," and "sudden enlightenment," and in this hypothetical corpus, it rarely appears next to "stir-fry" or "tire." You can speculate about its common usage and tone, but may not know all the dictionary meanings—**context can provide clues, but it doesn't equal a complete definition. **

Machines can train numerical representations using a large amount of context. The effective part is not the phrase "read more than people," but in assigning representations to optimized tasks, where errors update parameters in return.

![Mechanism Illustration](https://hyphentech.top/obsidian-assets/understand-ai-06-embeddings/image-lesson-diagram-2-03749c8e12.png)

## word2vec: Teach vectors arithmetic

In 2013, Google's Tomas Mikolov team released **word2vec** and engineered this idea.

The method itself is very similar to the fifteen-line code in Issue 4: build a small network and give it a task—**see a word and guess what word appears around it** (or use the surrounding word to predict the central word). After the training is done, no one actually cares about the answer to that task; **the real product is the string of numbers learned for each word during training**.

This string of numbers is usually several hundred dimensions, each with a decimal number. It has an official name: **word embedding** because it "embeds" words into a space of several hundred dimensions.

The result was shocking. In this space, **semantic relationships become geometric relationships**:

- Words with similar meanings are located nearby—"cat" and "dog" are next to each other, while "cabinet" is in a distant area
- Even more astonishing, **the relationship itself has become direction**. The most famous example is:

```
向量(国王) - 向量(男人) + 向量(女人) ≈ 向量(王后)
```

The direction of "from man to woman" is almost parallel to the direction "from king to queen." Certain semantic or syntactic relationships can be described in approximate directions in the vector space obtained from specific training. But this is not an identity; it depends on corpora, models, and retrieval methods; It is not possible to require any embedded model to reproduce the same analogy.

Why can you do arithmetic, but not treat it as a logic calculator? Because training may make certain relationships roughly align in direction, but it doesn't promise every word to satisfy this formula. Change the corpus, change training goals, change search methods—the most recent word may also change. A successful analogy proves that certain relationships are represented, but it doesn't prove that the entire set of knowledge follows vector addition and subtraction.

Additionally, cosine similarity comparison is not a probability of correct answers. 0.9 cannot be interpreted as 90% reliability; 0.9 for different embedding models also does not have a naturally identical meaning. Retrieval thresholds must be based on actual data and task calibration, not set based on the number that looks pleasing.

Starting from the same position, both arrows point east, just one longer and one short; Cosine similarity mainly compares how close they are facing each other, not treating length as the same difference. In vectors, this can be used to represent directions. Think about ordering takeout: "Add spicy" and "not add spicy" refer to the same dish, the words are similar, but the results in your mouth are completely different. Searching similarity finds the relevant candidates, but the word "no" that changes the requirements still needs to be checked. The same logic applies when checking commercial licenses next.

No one designed these directions. They grow out of the very question of "who partners with whom." This also means it learns the biases from the training texts along with it: in 2016, researchers performed the same arithmetic in word2vec vectors and found that "men to programmers are like women to housewives," which is the title of the paper.

## Let's try it out for yourself

You don't need to download the model to understand the core mechanism. The following code manually writes a few three-dimensional vectors for words, demonstrating how to measure semantic distance using **cosine similarity**:

```python
import numpy as np

# 三个维度我们假装分别代表：[是否有生命, 是否是宠物, 是否与政治有关]
vec = {
    "猫": np.array([0.9, 0.9, 0.0]),
    "狗": np.array([0.9, 0.8, 0.0]),
    "内阁": np.array([0.1, 0.0, 0.9]),
}

def 相似度(a, b):
    # 余弦相似度：看两个向量的"方向"有多一致，1=完全同向，0=方向正交；不直接等于语义毫不相干
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

print("猫 vs 狗 :", round(相似度(vec["猫"], vec["狗"]), 3)) # → 0.998
print("猫 vs 内阁:", round(相似度(vec["猫"], vec["内阁"]), 3)) # → 0.078
```

The dimensions in the code are manual symbols I assign meanings, not actual parameters of a model. Actual vectors are usually learned through training, and it's difficult to consistently name each dimension as pet, politics, or life. 0.998 and 0.078 are also the results of these three manual vectors, not a unified standard answer for cat and dog semantics.

## A key flaw is the emergence of Transformer

word2vec has a major flaw: **Each word has only one fixed vector. **

But "Apple" clearly means different things in "I ate an apple" and "Apple released a new phone." Static word vectors can only provide a compromise average, pleasing neither side.

Solving it requires a mechanism that can **read the entire sentence and then decide what each word means at that moment**—that is, word vectors must **change with context**.

This is exactly what the Transformer will discuss in the next article. The embedding of input words can usually still be found in the parameter table; After entering the Transformer, the internal representation is then processed in context, so **the hidden representation of the same word in different sentences can vary**. The word "apple" in two sentences will get two different vectors.

Here, two "vectors" need to be separated: input embeddings are the initial representations in the parameter table; after multi-layer networking, the internal representation is context-dependent. The commonly used retrieval embedding model may also compress an entire piece of data into a single vector. The three are related, but it does not guarantee that dimension, training objective, and distance have the same meaning.

This also explains why knowledge bases change their embedding models and usually need to re-index them. If the old data vector and the new problem vector are not in the same compatible space, even if the digit lengths are the same, they cannot be directly compared. It's like two maps both showing latitude and longitude but secretly using different coordinate rules; matching two numbers does not count as successful positioning.

This is a crucial leap from "dictionary" to "understanding context."

**What does this have to do with reviews? **
Vectors can measure similarity, so "do two paragraphs mean similarly?" can be turned into a number—many automated scoring methods do this: turn the model's answers and standard answers into a vector to see how close they are. But it measures **likeness**, not **right**: changing "will" to "won't," the vectors of the two sentences might still be very close. When you see scores from this method, first ask: does it measure semantic similarity, or has it been verified for correctness?

## Finding candidates for similarity allows for conditional verification before making a decision

Suppose your knowledge base has two license statements: one permitted for commercial use, and the other only allowed for personal non-commercial use. The search question is, "Can this tool be used for commercial projects?" Both paragraphs discuss tools, licenses, and commercial, and may simultaneously be candidates. Vector search is about finding relevant information; The final answer must retain the version, subject, and negation conditions, and cannot graft the license from the first paragraph onto the second tool. This is a hypothetical scenario, not a real retrieval test.

Let's go through this license example in detail. Source A says "Version 1 allows commercial use," Source B says "Version 2 for personal use only," and the user is asking about version 2. Both paragraphs discuss the same software and commercial use, and vectors may be very related. If you only take the most similar clips and then have the model polish them, the wrong version might be written as a very confident answer.

| Steps | This time, the subjects to be examined | The consequences of omission |
| --- | --- | --- |
| Limited-time in advance | Product name, version 2, effective date | Obtain the old permit |
| Search again | Related candidates and sources | Only found one incomplete sentence |
| Review conditions | Permitted Scope, Negation, and Exceptions | Change 'not allowed' to 'allow' |
| The organization responded | Conclusion and supporting original text | The fluent answer has no traceable basis |

This isn't just claiming I did a permission review, but rather a scenario explaining how search errors lead to answers. Reranking can improve candidate selection, metadata filtering can reduce version confusion, and finally, you still need to check the original text's applicable conditions. The value of enhanced retrieval is to provide evidence, not to add a safety net to the model's tone.

Think of the entire retrieval process as searching files in the archives: vector search first finds materials discussing the same matter; metadata filtering first specifies date, version, or subject; re-sorts and carefully compares which candidates better fit the problem; retrieval enhancement hands over the selected original text to the model for reference. Every step can help; only by returning to the applicable conditions in the file can you answer "Is this permission valid for me?" This also explains why adding a search entry does not mean adding factual guarantees to the answer.

Later, when you see a score using "vector similarity between answer and standard answer," the same distinction should be made. "Allow" and "not allowed" may differ by just one word, but it can change the entire conclusion; The evaluation must determine whether it truly identifies such differences. Finding relevant topics and judging facts are two different tasks.

![meme](https://hyphentech.top/obsidian-assets/understand-ai-06-embeddings/image-meme-5cba76b965.png)

| Adjacent concepts | What to solve | What was missed |
| --- | --- | --- |
| Word number (word number). | Let the model distinguish between input symbols | The size of the number has no semantic distance relationship |
| Embedding and similarity | Look for semantic-related candidates | Facts, dates, and negative conditions are not automatically verified |
| Search and rearrangement | Pick the most likely useful clips from the materials | Missed tests or incorrect versions may be selected |
| Generate and verify citations | Organize your answers and check whether the original text supports it | Having a citation does not mean the claim is supported |

## With this in mind, I'll give it a try

Prepare 3 pairs of short sentences: "Commercial use allowed/Not allowed," "Version 1 supported/Version 2 not supported," "Paid interface/Free interface." Setting aside points for now, mark words that change the behavior. If testing embedded models later, record model version, actual similarity, ranking, and whether key conditions are retained; Do not treat manual 3D examples as real semantic model evaluations.

Vectors make semantic relationships computable candidate clues, preventing "related" from automatically becoming "correct." Word number is responsible for querying tables, training decision representations, and further changing internal states in context; Retrieval requires appropriate embedding models and verification processes to connect candidates into well-founded answers.

## Several terms that appear in the story

| Terminology | Plain speech |
| --- | --- |
| one-hot | Only one is a very long vector of 1; Wasteful and semantic |
| Distribution Hypothesis | Contextual distribution can provide semantic clues; It cannot replace all meanings |
| Word embedding | Words are represented as hundreds of decimal vectors; if the meaning is close, the position is close |
| word2vec | In 2013, the method for engineering the distribution hypothesis |
| Cosine similarity | Semantic proximity is measured by the degree of consistency between the directions of the two vectors |
| Vector arithmetic | King-man + woman ≈ queen; Abstract relationships become spatial directions |
| Dimension | Indicates how many components are included; Retrieval embedding output dimensions are not necessarily equal to language model hidden_size |
| Static vs. Contextual Embedding | One fixed vector per word vs. dynamic calculation per sentence |

Next article: One-stop messaging and instantly searching for previous texts are two different organizational methods. The 2017 paper changed language models, but it did not give machines a memory that never fades.

## References

- [word2vec Original Paper](https://arxiv.org/abs/1301.3781)
- [Research on Word Embedding Bias](https://arxiv.org/abs/1607.06520)


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
