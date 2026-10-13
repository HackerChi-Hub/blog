---
title: "AI can continue writing but refuses to answer? Pre-training, SFT, and preference optimization—how do these three steps teach assistants?"
slug: understand-ai-08-training-en
status: published
lang: en
translation_of: understand-ai-08-training
translation_source: machine
source_sha256: f64de22659fb9008
date: 2026-10-05
updated: 2026-10-13
summary: "The completion function continues to list questions, but the assistant will answer, explain, or refuse. Teaching it to act like an assistant and making every sentence truthful are two different tasks."
categories:
  - AI知识
tags:
  - AI
  - Do you really understand AI?
cover: https://hyphentech.top/obsidian-assets/understand-ai-08-training/cover-084b0b60ca.jpg
brand_slogan: 让AI成为你的超能力
legacy_paths: []

---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/understand-ai-08-training/) is authoritative.

> [!abstract]
> The completion function continues to list questions, but the assistant will answer, explain, or refuse. Teaching it to act like an assistant and making every sentence truthful are two different tasks.
> HyphenTech · 2026-10-05

For the same question, the completion machine might continue to list the question, but the assistant will answer, explain, or reject it. The difference is not limited to prompts: data, training objectives, fine-tuning, preference optimization, and product tools all influence behavior. The three-stage approach is a classic understanding route; not all models follow exactly the same production formula.

Episode 7 covers attention and architecture. But architecture itself doesn't chat—it's just a sophisticated machine, not yet packed with any knowledge.
This article discusses **training**: where does the model's knowledge come from? How something that only "predicts the next word" becomes an assistant that can answer questions, reject questions, and know what to do, and why **it seriously spouts nonsense**.

## Stage One: Pre-training—a seemingly silly task

Many generative language models are pretrained using a core task so simple it's almost doubtful:

**Give you a passage to predict what the next word will be. **

From the prediction task of constructing prefixes and subsequent word elements in the text, the current model parameters assign probabilities to candidates, then calculate loss and update parameters based on the actual target word that appears. How data is filtered, how many word elements participate in training, and how loss is calculated all fall under specific formulas and cannot be replaced by "reading the entire internet."

The key to self-supervision is that tags can be constructed from the material, without needing to write answers for each word. It doesn't mean no one handles the data: source selection, deduplication, filtering, and quality management remain important. Automatically constructing targets saves a type of annotation work, not sparing all manual judgment.

The self-supervisor is like taking a ready-made book, covering the second half of the sentence as the question, then exposing the original text as the answer: the question and goal come from the same material, so there's no need to ask someone to write a separate answer for each question. Pre-training repeatedly uses these tasks to adjust parameters, accumulating patterns that can be used for different inputs. But a certain continuation sentence in the book is just a result that appeared in the text; To determine whether today's competition is canceled, you still need to go back to the current notice from the organizer.

**Why can such a dumb task learn intelligence? **

Because to guess the "next word" correctly, the model has the opportunity to learn various patterns from large amounts of data:

- Guess "Today's weather is really ___" to understand **styling**
- Guess "The capital of China is ___" to remember **facts**
- Guessing "Because it rained, so the competition ___" might learn **causal narrative patterns**, which does not directly verify the real causality
- Guess the next line of a piece of code: **Understand **syntax and logic**
- To guess the next line of a poem, master **rhythm and style**

To connect a large number of subsequent texts for different scenarios, you need to learn complex patterns, which can support multiple abilities. But the causal narratives in the corpus are not the same thing as real-world causal verification; The next word prediction is the training goal, not a reliable proof of every ability.

For example, "Because of rain, the match ......" can be taken as "canceled" or "proceed as usual." With just half a sentence, without venues, rules, or rain, there is no single realistic answer. The model learns these combinations and is useful, but to truly decide what to do for today's competition, you have to check the organizer's notice.

Common answers in training data can help generate candidates; Valid answers in the current world may require external evidence. This is precisely why pre-trained knowledge, search, knowledge bases, and tools complement each other. They are not three types of superior intelligence, but answer different questions.

## Scale Principle: What progress can be predicted, and what skills cannot be predicted

Around 2020, researchers discovered something that changed the entire industry's investment direction: **Within a certain training setup and research scope, language modeling losses exhibit fittable patterns with parameter size, data volume, and computational budget. **

This is the **Scaling Law**. Its significance is: **Small-scale experiments can estimate the loss and resource allocation of larger training, but not exactly convert every downstream capability into cost. ** This improves the predictability of training planning but does not eliminate uncertainty in research and engineering.

The scaling rule is a bit like conducting small-batch experiments before expanding bread production: you record how ingredients, equipment, and labor affect the process results, then estimate the expanded input. This estimate depends on similar conditions and cannot jump from "can make more bread" to "suddenly cook all the banquets." The number of model parameters, data volume, and calculation budget must also be considered together; increasing only one does not guarantee reasonable resource allocation. The next issue of insufficient data is precisely to ask whether the other two items have kept up.

A major revision in 2022 (known in the industry as the Chinchilla conclusion) pointed out that some large language models within its research scope have **insufficient training data** relative to their given computing budget. Under fixed computing power, appropriately shrinking the model and significantly increasing training data actually yields better results. This affects many subsequent training recipes, but inference costs, data quality, and training budgets will change the actual trade-offs.

Some papers refer to abilities that only become apparent as scale increases as "emergent." However, if evaluation rules require a complete question to be correct, intermediate steps will gradually improve, and scores may suddenly jump. After observing curve inflection points, task, indicators, and continuous measurements should be checked; it is not appropriate to directly declare that a physical phase transition has occurred like boiling water. [Research on Related Indicators](https://arxiv.org/abs/2304.15004)

## Crossroads in training: a complete machine isn't necessarily a good assistant

After pretraining is complete, what you get is called the **base model**. It prioritizes continuing according to the pre-training objectives and **does not guarantee stable adherence to instructions**; Some base models can also answer questions with appropriate prompts.

You ask it: "What is photosynthesis?" ”

It might answer: "What is respiration? What is transpiration? What is osmotic pressure?" ”

It's not broken. It is **faithfully doing what it was trained on**—continuing. And in internet corpora, after a question in a list of exercises, another batch of similar questions may follow. This is a hypothetical output scenario, not a fixed performance for all base models.

Calling it a "completion machine" is a reminder that training goals differ from assistant tasks. Classic assistant training often adds supervised fine-tuning and preference optimization, but not every model strictly follows the same two steps.

## Stage Two: Supervised Fine-Tuning (SFT)—teach it what conversations look like

The first step is called **Supervised Fine-Tuning**.

The approach is straightforward: manually write (or select) a large number of high-quality "instruction-response" samples, formatting them into conversational styles, and let the model continue training on this batch of data.

Supervised fine-tuning is like providing standard samples to customer service who have already seen a lot of text: what requests are received, how to respond, and how to keep unknowns when data is missing. It's not just for the customer service to glance at the sample, but to use these samples to further adjust model parameters; Posting a sample in chat is just the condition for this input. Both can change the immediate answer, but only the former falls under the training discussed here. The following JSON field requirements are examples to test whether such demonstrations are specific.

Many recipes have supervised fine-tuning data far smaller than pre-training, but the scale varies greatly, making it impossible to apply a fixed number to all models. High-quality demonstrations can improve instruction adherence and response behavior; Tasks that are not covered may still fail.

Note a key point: **SFT is often used to improve instruction adherence and output behavior, and may also change knowledge and task capabilities. ** It will continue to update parameters; The effect depends on training data, coverage, and methods, and cannot be said that the knowledge is fully set.

![Training sample illustration](https://hyphentech.top/obsidian-assets/understand-ai-08-training/image-training-objectives-fd2ec2c9f0.png)

Looking at these two samples in the diagram, the most common pitfalls are revealed: **Pre-training also has goals, not aimless reading; Supervised fine-tuning is not just a few words in the chat window. ** The former predicts tasks from material construction, the latter organizes instructions and demonstrations, then changes parameters through training. The text in the diagram is only to clarify relationships and does not represent the actual word segmentation results. Specific implementation also depends on which words are used to calculate loss, so do not derive a complete formula from a particular model from this teaching diagram.

Here's another easily overlooked detail: the demonstration doesn't end just by "making it sound like a person." Assuming you want to "only return JSON for two fields, write null for missing amounts," then qualified samples should demonstrate field names, null values, and non-incremental amounts. Whether you only answer to assistants to calculate losses during training also affects what the model learns.

If the sample is always compiled with a complete value when data is insufficient, the model might learn "the table must be filled." Conversely, explicitly keeping unknowns and specifying gaps in the demonstration can include this behavior as a goal. SFT improves behavior under these sample coverage and training conditions, rather than installing a switch that never lies.

## Stage Three: Preference Optimization (RLHF / DPO) — Teaching It What "Good" Means

After SFT makes the model more like an assistant, which answers should be chosen to be more encouraging. Helpfulness, honesty, and politeness can be scored according to rules, but scoring rules do not necessarily represent objective truth; Different annotators and tasks may have different preferences.

The solution is called **Human Feedback Reinforcement Learning** (RLHF), and the process consists of three steps:

- Having the model generate multiple answers to the same question
- **Human annotators sort these answers** (It's much easier to judge "which is better" than writing standard answers)
- Using these sorting, train a **reward model**—it learns to score answers; Then uses reinforcement learning to make the main model pursue higher scores

Methods like DPO can directly use preference-pair optimization strategies without reinforcing the learning process with the same independent reward model. They all use preference signals but cannot write the algorithm steps exactly the same, nor can they omit who the preference data comes from or how to compare.

Still distinguishing these two paths by customer service scenarios: human feedback reinforcement learning first compares responses, then trains a scoring model using classic processes and uses scoring optimization to generate behavior; Direct preference optimization uses paired data of "this one is better than that" to directly optimize the model, without copying the previous process. They all seem like adjusting services from follow-up reviews, but "customers like" is not "the accounts must be correct." If the reward is given incorrectly, the program might make the score look nice, but not complete the task—the following racing story perfectly examines this.

![Comparison of preferences](https://hyphentech.top/obsidian-assets/understand-ai-08-training/image-preference-pair-2d75a6527e.png)

A real reinforcement learning story makes the judges' issues very specific. In 2016, OpenAI publicly released a case from the boat racing game CoastRunners: by design, the boat should complete the course; but the actual reward encourages it to circle repeatedly around several refreshing targets to score points, resulting in a separation between high scores and finishes. This is not a current language model test, yet it directly shows that proxy metrics may have been exploited. [Official Case](https://openai.com/index/faulty-reward-functions/)

Back to the assistant: if the judge prefers length, confidence, or pandering, the model may be better at writing answers that "look satisfactory." The solution is not to vaguely reject preferred training, but to check the distance between the reward and the real goal: tasks requiring facts check facts, tasks requiring formatting verify formatting, and tasks requiring execution read back to the final object. Don't treat likes as proof that every requirement has passed.

Preferred data may reward length, confidence, or conformity, causing optimization direction to deviate from fact-verification. First, keep one question in mind: Who is scoring, what is the basis, and can the score represent the true task objective? When unfolding the model report card in issue 14, we also encountered this referee question.

**This step is called "alignment"**: making the model's behavior align with human preferences and value judgments. It is also the source of the model's "character"—why different companies' model tone, boundaries, and rejection methods vary by company, and these differences are jointly influenced by pretraining, supervised fine-tuning, system instructions, and product strategy.

Different training formulas may involve trade-offs between safety, helpfulness, and other abilities, requiring specific task measurements. "More disciplined" does not mean all abilities decline, and "canceling rejection" does not mean the facts are more accurate. Treating it as a trade-off to be tested is more reliable than generalizing a slight decline in creativity.

## Why would it be talking nonsense so seriously?

Now you have all the conditions to understand **hallucination**.

Reviewing the essence of the model: For many autoregressive language models, the next word distribution is calculated based on the prefix during generation, then selected according to decoding strategies. Selection is not always the highest probability, nor does it directly calculate the truth of the facts.

Language modeling has different goals than fact-checking. Training may give the model a wealth of knowledge, but a single generation does not automatically attach an external verification record to every fact.

So, when you ask about a fact it doesn't know, it may not properly express "I don't know"—because in training corpora, a question is usually followed by a **fluent and confident answer** rather than a straightforward confession. It generates something **that looks most like the correct answer**: formatting, confident tone, rich detail, neat reference numbering—just the content is fabricated.

When a fact is unknown, the model may generate content that matches the answer form but lacks evidence. Reasons may include data gaps, calibration and training preferences, or retrieval errors or the problem itself. A well-formatted reference only indicates that it generated this format; Whether the literature exists and supports a conclusion still needs to be checked separately.

Training can encourage the model to express uncertainty, but it cannot automatically stamp every fact. Daring to refuse and knowing when to refuse are two different things. Issue 28 will expand the boundaries between reliability and verification.

![meme](https://hyphentech.top/obsidian-assets/understand-ai-08-training/image-meme-3763266333.png)

**Practical Inferences for You**: The fluency and confidence of model output cannot alone guarantee factual credibility**. The more specific the numbers, names, citations, and links, the more they must be independently verified—because these are precisely where hallucinations are most likely to occur and most easily deceive.

![Smooth and Authentic](https://hyphentech.top/obsidian-assets/understand-ai-08-training/image-fluency-truth-797df0fb29.png)

## Quick reference for classic assistant training links

![Training Process Diagram](https://hyphentech.top/obsidian-assets/understand-ai-08-training/image-training-stages-4db98f902d.png)

| Stage | Data | What was taught | Weight class |
| --- | --- | --- | --- |
| Pre-training | Large-scale text and other data | Learning representation, language, and task patterns | It depends on the model and training formula |
| Supervise fine-tuning SFT | Artificial or synthetic demonstration data | Improving command adherence can also change task capabilities | There is no unified number of entries |
| Preferred optimization RLHF/DPO | Preferences are compared and relevant feedback | Optimizing behavioral goals is not fact-verification | It depends on the method and data |

**What does this have to do with reviews? **
Every step of training leaves a fingerprint on the score. Pre-training uses a large amount of text, possibly including publicly available online materials, and exam questions are also found online: if questions mix training data, the score may be mixed into memory, so it cannot be directly regarded as a purely generalized performance—this is called **data pollution** in the industry (Issue 14). Aligning this step also affects scores: when people score answers, they often prefer the longer and more polite one, so the model learns to write it longer; Some rankings later add "style control," removing this part before ranking (Issue 21's ranking story).

## Find a pair of brothers missing only one suffix

- Open Hugging Face, search for a model series with open weighting (like Qwen), and find versions with only one suffix difference: one with Instruct (or Chat), one without.
- Read the beginnings of two model cards: which one has only done pre-training, and which one has completed fine-tuning and alignment?
- If you compare local versions later, set the correct prompt format for both versions and then observe the answer to the same question. The base may continue the question or provide a direct answer; The instruction version usually follows instructions more stably. You cannot identify all training differences with a single output, nor interrupt the running model for this exercise.

## Don't mix three types of "updated knowledge" together

| The actions you make | What has changed? | How to judge |
| --- | --- | --- |
| In the chat, I told her a new fact | Memories preserved in the current context or software | Whether to still carry in the new session; Weight updates cannot be determined based on this |
| Put the materials into the knowledge base | External indexes and searchable data | Check for retrieved clips, versions, and answer citations |
| Retrain or fine-tune | Some or all model parameters | Verify training configurations, checkpoints, and independent evaluations |

## Why does a model learn to please you, but still needs to be accepted?

Classic InstructGPT research introduced human preferences into training to improve helpfulness and other performances. Preference scoring is an agent target, not a certificate that has been verified for every fact. The 26th round-the-loop case comes from a 2016 reinforcement learning environment, not a language model experiment; It shows that rewards may be misaligned with the real goal and cannot be used to assume a chat model will do the same. [Official Case](https://openai.com/index/faulty-reward-functions/)

Compare with the simplest "explanation of photosynthesis" from earlier, and don't just judge which part sounds comfortable. First, list the relationships that must be clarified: what processes light energy is involved in, what are the raw materials and products, and what common simplifications exist. Then check each item to see if the answers match the source and whether the metaphor is treated as biological fact. The tone can be scored separately, but it should not overpower knowledge checks.

When it comes to office tasks, the structure is the same: fact-checking, constraint checks, and separate scoring for expression quality. An answer can be smooth and formatted correctly, but the facts are still wrong; Or it can be factually correct, but leak information that shouldn't have been disclosed. Once the model is trained to be more like an assistant, the acceptance targets are actually more distinguishable.

## With this in mind, I'll give it a try

No need to download two large models: pick a pair of existing model cards, and label the base/instruction board, training stage, chat template, and license respectively. If the steps lack public explanation, write "Not Disclosed" and don't guess the full RLHF formula from an Instruct suffix. If comparing the same problem later, control the sampling and prompt formats, and don't attribute all template differences to the training.

Training changes parameters and behaviors, prompts influence computation in the current input, and retrieval provides external materials. Pretraining, SFT, and preference optimization have different focuses, but their roles overlap. To judge whether the assistant has improved, it's not just about being more willing to answer or having a better tone, but also checking whether the conditions are held and whether facts can be verified.

## Several terms that appear in the story

| Terminology | Plain speech |
| --- | --- |
| Pre-training | Using massive amounts of text to "predict the next word character," the source of knowledge |
| Self-supervision | Supervision objectives can be constructed from the data, eliminating the need to manually annotate each word individually |
| Base model | Models that learn according to pre-training goals and have not yet been specifically optimized for assistant behavior |
| Scaling Law | Within specific settings, losses can be fitted with parameters, data, and calculation presentation |
| emergence | Some evaluations show sudden abilities; Whether this is caused by indicators still requires analysis |
| SFT oversight fine-tuning | Continue training with data with demonstration goals, changing behaviors and certain task abilities |
| RLHF / DPO | Ranking Human Preferences Teaches "What is the Better Answer" |
| Alignment | Actions are brought closer to specified preferences and goals; Behaviors are also influenced by system prompts and other factors |
| Alignment tax | Trade-offs or losses in other capabilities when optimizing certain alignment targets |
| hallucination | Output does not match facts or data; Distinguish between generation, data, and system reasons |

Next article: Mental arithmetic makes it easy to lose middle numbers, so writing vertical questions is more reliable. The model also learned to leave a draft first, but waiting a few seconds for the same problem means you get the correct answer or a longer incorrect explanation.

## References

- [Research on Human Feedback Instruction Training](https://arxiv.org/abs/2203.02155)
- [Research on Optimal Computational Training](https://arxiv.org/abs/2203.15556)


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
