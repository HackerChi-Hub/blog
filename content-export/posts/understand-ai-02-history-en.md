---
title: "There have been two AI winters—why did it only make a comeback in 2012? Graphics cards, data, and the story of a game"
slug: understand-ai-02-history-en
status: published
lang: en
translation_of: understand-ai-02-history
translation_source: machine
source_sha256: 6554fe408751ebe1
date: 2026-10-05
updated: 2026-10-24
summary: "By 1958, people were already expecting machines that would learn. It took decades before it truly changed the industry. The middle was not a straight upward curve, but a story of promise, disappointment, and old ideas finally waiting for the right conditions."
categories:
  - AI知识
tags:
  - AI
  - Do you really understand AI?
cover: "/obsidian-assets/understand-ai-02-history/cover-5429872b4f.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []

---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/understand-ai-02-history/) is authoritative.

> [!abstract]
> By 1958, people were already expecting machines that would learn. It took decades before it truly changed the industry. The middle was not a straight upward curve, but a story of promise, disappointment, and old ideas finally waiting for the right conditions.
> HyphenTech · 2026-10-05

Today, when talking about large models, neural networks are an indispensable topic. They can write articles, revise code, and look at images—almost like something that suddenly appeared in recent years.

Let's rewind time: in 1958, Rosenblatt was already researching how machines could learn from examples.

Back then, there were no phones, no internet, and certainly no graphics card in your computer that could run models. But the idea of "don't write all the rules rigidly, let the machine adjust internal parameters on its own" had already emerged.

If the idea came up so early, why wait decades? Why didn't progress steadily in the meantime, but instead fall into what is commonly called the "AI winter" twice?

I think the most useful part of this history isn't that it makes us remember a few scientists' names. It helps us distinguish three things that are often confused: **An idea with potential, a successful demonstration, or a technology delivered stably—these are not the same thing. **

Today, seeing "models have broken through again," or preparing to install a large model on your own computer, this difference still works.

## By 1958, the machine had already begun to "look at examples."

In July 1958, the U.S. Naval Research Office presented an experiment on an perceptron. A historical review preserved by Cornell University states: an IBM 704 receiving punch card, after 50 trials, learned to distinguish between cards marked on the left or right. The researcher behind the experiment was Frank Rosenblatt, a psychologist at Cornell Aeronautical Laboratory.

Pay attention to this task: distinguish left from right. It's still far from writing novels, recognizing complex scenes, or working autonomously. But back then, the news had already put it into the narrative of "machines can learn, and in the future they may have abilities more like humans." [Cornell University Historical Materials](https://news.cornell.edu/stories/2019/09/professors-perceptron-paved-way-ai-60-years-too-soon)

![Perceptron Physical Device](https://hyphentech.top/obsidian-assets/understand-ai-02-history/image-original-1-b32d41d06f.jpg)

There are two very different paths to teaching machines.

One way is to clearly state your judgment method: see where the mark is, output "left" if the condition is met, output "right" otherwise. The machine executes the rules you have already considered.

Another approach is to give it some examples and correct answers. The machine guesses first; if it guesses wrong, it adjusts the weights on the connection and guesses next time. It doesn't require you to write each criterion one by one; instead, through repeated adjustments, it forms a calculation method that distinguishes inputs.

Here, "weight" can first be understood as the weight of each clue in the judgment. If a clue is reliable, its impact should be greater; If a clue always biases judgments, its influence should be adjusted. True training writes this process mathematically, not letting machines decide based on intuition.

For example, judging whether to bring an umbrella: weather forecast, cloud color outside the window, how far to walk out—all are clues, but the impact varies. Giving different weights to clues is the entry point to understanding weights; Training adjusts these weights based on the answers in the examples. The machine adjusts the values and doesn't decide on its own "getting wet doesn't matter." This also connects to the previous distinction: writing down the judgment rules one by one and adjusting values from examples are two different approaches.

**Adjusting parameters from examples** is indeed a clue leading to today's neural networks. But this does not mean today's large models are just a bit larger than the perceptron. Network structure, training objectives, and optimization methods have all undergone significant changes—not just buying a few more graphics cards.

The results of that year are real, and the closest correct conclusion is clear: some kind of machine can learn on specific tasks.

Once the conclusion is upgraded to "General intelligence will arrive soon," the hardest part is skipped: can you still learn a new task? Can you still learn after the task becomes more complex? Can you still work stably outside the lab?

Rosenblatt failed to see the subsequent changes in this route. In 1971, he died in a sailing accident at the age of only 43; The Mark I perceptron was later collected by the Smithsonian Institution. The same research transformed from future imagination in the news into historical artifacts in museums, and subsequent research pushed related ideas to new capabilities. A person's life and the time it takes for a technology to mature do not always match. [Cornell University Historical Materials](https://news.cornell.edu/stories/2019/09/professors-perceptron-paved-way-ai-60-years-too-soon)

## The first trend: writing the world into rules, and as a result, the world starts to give questions

The 1955 Dartmouth Research proposal already used the term "artificial intelligence." The summer 1956 seminar was later regarded as an important starting point in this field. The proposal covered issues such as language, abstraction, and neural networks; early AI did not follow only one path. [Dartmouth Original Proposal](https://www-formal.stanford.edu/jmc/history/dartmouth/dartmouth.html)

One of the most influential approaches is symbolism: expressing knowledge as symbols and rules, then letting machines reason about it.

Why is this so appealing? Because it seems very close to how humans explain themselves. If asked why you judge something as a bird, you might say: it has feathers, wings, and can fly. Putting these clues into the program seems to replicate your judgment.

But once you actually start writing, you'll notice something is off.

You write "Birds can fly." What about penguins? What about ostriches? What about injured birds? What about birds caged in cages?

I like this example not because it proves rules are useless, but because it puts you in front of a question: **How many unstated conditions lie behind a seemingly correct common sense? **

If the task is narrow, the rules can work very well. For example, a program that only handles fixed-format orders doesn't need to understand the whole world. The problem is, if you move it from a small environment to an open world, situations where rules aren't written will keep appearing.

There's another difficulty, not exactly the same as "endless rules": even if you have rules, searching for every possibility can still be too expensive.

Let's make a pure example. Suppose each step has 10 options. If you look back 6 steps, you might face 1 million paths each 6 long; Looking at 10 steps means 10 billion paths. In practice, the algorithm can prune and may not actually complete all paths, but this example shows that successful methods in small problems may not be directly extended to large problems.

Searching for a tree is like finding a route at a fork: you not only have to think about where to go, but also look at the forks behind each path. Pruning means when you find a road clearly unsuitable, don't continue searching for it for now. It saves you from searching for the next step; If the rule is unreliable, you might miss a good route. Looking at the multiplier above, you'll see that the difficulty isn't just the computer running slowly, but that candidate routes increase rapidly with the number of steps.

So, early AI faced at least two different walls: how knowledge was obtained and expressed; And how to handle computing when problems grew larger. You can't compress them all into "scientists back then couldn't write rules."

In 1973, there was even a public televised debate between Lighthill and AI researchers. The University of Edinburgh preserved this historical footage and the entry to the report. The debate itself reminds us that there was no simple verdict accepted by everyone at the time. [1973 debate and report archive](https://www.aiai.ed.ac.uk/events/lighthill1973/)

The ebb tide of the 1970s is often classified as the first AI winter. It involved gaps between outcomes and expectations, research funding environments, and technical limitations of different paths; One failed experiment could not mean the entire field "died" on the same day.

## Single-layer perceptrons lose to XOR, but they are not a death sentence for neural networks

At the same time, the path of neural networks also encountered its own difficulties. In 1969, Minsky and Papt published "Perceptron," studying the limitations of such models.

The most straightforward explanation is "XOR." The name sounds a bit intimidating, but the rules are actually quite simple: two different inputs, output 1; two identical inputs, output 0.

There are two switches in your hallway: flip either one and the light will switch between brightness and dimming. By recording the states of both switches as 0 and 1, you can use this scenario to understand the wiring relationship of "same but not on, different brightness." You can't guess the state of a single switch by looking at just one switch; you have to combine the two. The table and diagram below show this kind of combination that cannot be separated by a single straight line; it's not giving "XOR" a mysterious name.

| Enter A | Enter B | The answer is XOR |
| --- | --- | --- |
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

If you draw four cases as four points, you'll find: two "1s" on one diagonal, and two "0s" on the other.

![Different or Schematic](https://hyphentech.top/obsidian-assets/understand-ai-02-history/image-xor-1e4088ead7.png)

A single-layer perceptron using linear weighting and threshold judgment creates a classification boundary that is essentially a straight line. No matter how you move or rotate this line, you cannot put two "1s" on one side or two "0s" on the other.

It's not that it hasn't tried hard enough, nor that a few more examples will suddenly make sense. **With this structure and input representation, it cannot express the boundaries it needs. **

But this conclusion has strict applicability: monolayers, linear boundaries, and such input representations. By adding hidden layers with nonlinear transformations, networks that solve XOR resolutions can be constructed. The next question becomes: how do we find those suitable parameters?

"Being able to represent an answer" and "learning that answer using practical training methods" are two different things.

So, "It wasn't until 1986 that people realized multi-layer networks could solve XOR" is an easy-to-remember but misleading statement. It weaves together the expressive capabilities of multi-layer networks, the history of training methods, and the research environment into an overly uniform story.

Similarly, you can't say a book created an entire AI winter out of thin air. The limitations of single-layer perceptrons are real problems, but expanding the failure of a limited model to the point that all neural networks have no future is another kind of judgment.

This misconception is not far from us. Today, if you ask a model to make one mistake on a math problem, you can prove it answered wrong in that input and setting; To prove that "this kind of model will never reason," you need far more evidence than one problem.

## Second Boom: Trained, Able to Do Business, Why Is the Tide Still Fading?

By the 1980s, expert systems were entering commercial applications, while neural network training methods continued to develop.

The idea of expert systems is more pragmatic than "copying the whole world": don't know everything, first program the expert experience in a certain field.

Take configuring a computer order as an example: this is a scenario explaining the principle, not a practical test: when a customer selects a component, they must check the matching interfaces, power supplies, and chassis. If compatibility relationships are clear, the rule system can reduce missing and mismatched configurations.

But products will be updated. When new components are added, rules must be added; When old components are removed, rules must be changed; When two rules conflict, it is also necessary to decide which has priority. The value of a system cannot be judged solely by "how many answers were correct today"; it also counts who will update it next year and what impact each update will have.

This is the issue of knowledge acquisition and maintenance: expert experience is not always ready-made rules, and the rules written in are not forever unattended. The more rules there are, the more complex maintenance becomes, but one cannot assert without measurement that the cost of every system will inevitably "grow exponentially."

On the neural network side, the 1986 paper by Rumelhart, Hinton, and Williams brought widespread attention to backpropagation. It calculated how connection weights should be adjusted by using output errors and enabled hidden layers to learn useful features. This was an important advance, but it was not the first time multilayer networks and related ideas had appeared. [1986 Backpropagation Paper](https://www.nature.com/articles/323533a0)

You can think of it as a multi-process production line. If the final product is unqualified, you can't just say "You're wrong" to the last worker; previous processes can also affect the result. The role of backpropagation is to transfer the impact of the final error forward according to computational relationships, calculate how each parameter affects the error, and then adjust the parameters using optimization methods.

Note that algorithms calculate impact, not assign moral responsibility to neurons.

The emergence of training methods does not mean that deep networks can be easily trained.

As the number of layers deepens, the signals sent back to earlier parts may become very weak; If data is insufficient, the model may remember training examples but cannot handle new ones; With limited computing resources, you may not even be able to complete the required experiments within a reasonable timeframe. These difficulties fall into optimization, generalization, and computational cost, and cannot be solved with a single "computing power insufficient" explanation.

By the late 1980s and beyond, difficulties in expert systems and the dedicated AI hardware market, along with broader anticipated adjustments, combined to form what is commonly called a second winter. It did not mean all related research had stopped.

Here, it's easiest to write the story as: "A few geniuses persist, and the world finally rewards them." ”

But what readers really need to take away is not "the less popular the topic, the more worth betting on." What we see today is the path to later success, not all the attempts that persist for years without success as clearly as we see. **Persistence can be an important condition, but it is not a sufficient condition for success. We also need to see whether obstacles are overcome and if evidence improves. **

## In 2012, AlexNet delivered a report card that was hard to ignore

In 2012, the work of Klizewski, Sutskwe, and Hinton brought deep convolutional neural networks widespread attention in the ImageNet competition.

In the official results, the top five error rates for SuperVision's competition proposals were about 15.3%, while the best result for another team, ISI, was about 26.2%. The winning entry used additional training data; The other entry that only provided training data from the competition was about 16.4%. This is not a "bare model showdown" where setting differences can be omitted. [ImageNet 2012 Official Results](https://image-net.org/challenges/LSVRC/2012/results.html)

| 2012 classification task entries | Top five error rates (approximate) | Conditions that need to be viewed together |
| --- | --- | --- |
| SuperVision winning entry | 15.3% | Using additional training data |
| Another entry for SuperVision | 16.4% | Only training data provided by the competition is used |
| ISI Best Entry | 26.2% | Another team plan listed in the official results |

"Top five error rate" is not the everyday phrase of "admitting 15 mistakes out of every 100 images." It allows the scheme to assign five candidate categories: the correct label is not among these five candidates for the error counted.

If rounded to 15.3% and 26.2%, the difference is 10.9 percentage points; The relative error rate drops by about 42%. Both figures indicate progress, but they cannot be confused with "accuracy improved by 42 percentage points." Examples do not change evaluation rules, so they cannot be directly translated into the reliability of medical consultations, driving, or recognizing arbitrary photos.

At this point, a question naturally arises: **Why 2012 instead of 1986? **

The answer is not "scientists in 1986 weren't smart enough." The data, hardware, and training methods available then were no longer the same as later.

The AlexNet paper describes about 1.2 million training images and 1,000 categories of experimental setups, and describes the network training on two GTX 580 chips for about five to six days. The paper also covers ReLU, data augmentation, Dropout, and other designs. The overall ImageNet database is not on the same scale as a subset of competition training, so the total image count cannot be directly counted as the training usage amount. [AlexNet Author's Paper](https://www.cs.toronto.edu/~hinton/absps/imagenet.pdf)

Looking at these conditions separately, it's easy to understand how they work together: more and more suitable data gives you a chance to learn generalizable patterns; Computational resources determine whether you can afford training; Structure, optimization, and regularization methods affect whether the model can learn and whether it only remembers examples.

They are not three chips that can be replaced at will. More data but training cannot be completed and results cannot be delivered; Training is fast but data does not match the task and cannot be solved quickly; The model memorizes the training set but may still fail when it comes to new images.

Old ideas have waited for more suitable conditions, but it cannot be said that "all three conditions are present simultaneously for the first time in human history." A more accurate judgment is: **The representative breakthrough of 2012 demonstrated the combined power of these conditions and produced comparable results through open competitions. **

## In 2017, language models changed the way queuing works

Success in image direction does not automatically solve language problems.

A traditional approach is to read sentences from front to back. Recurrent neural networks carry the previous state to the end, like a constantly updated note. The problem is that within the same sequence, the next step depends on the previous result, so during training, there is a sequential dependency that is hard to avoid.

In 2017, "Attention Is All You Need" proposed the Transformer, placing the attention mechanism at the core, reducing dependence on stepwise recursive computation, and improving training parallelism. [Original Transformer Paper](https://arxiv.org/abs/1706.03762)

This shift can be summarized as "must queue" to "can run in parallel." Just add one more sentence: **This mainly refers to the organization of training calculations, not that the order of text is unimportant, nor that word characters are no longer generated individually when generating answers. **

When you read "I gave Xiao Wang a book" and "Xiao Wang gave me a book," you use similar words but have different meanings. You can't lose positional relationships. Transformers need to use appropriate positional representations to handle this kind of information.

whereas an autoregressive language model usually still needs to predict the next word based on the generated content during generation. Training is easier to do in parallel, which is a different issue compared to generating all answers at once.

Later pre-trained language models applied patterns learned from large amounts of text to different tasks. The 2020 GPT-3 paper studied the few-shot capability of a model with 175 billion parameters: it included task descriptions and several examples in the input, allowing multiple tests without updating parameters for each task; The paper also reported its difficulties and limitations. [Original GPT-3 Paper](https://arxiv.org/abs/2005.14165)

On November 30, 2022, ChatGPT was released as a conversational product. The release description not only showcased its conversational capabilities, but also indicated that it might produce answers that seem reasonable but are actually incorrect. [ChatGPT Release Introduction](https://openai.com/index/chatgpt/)

In this process, architecture, training, interaction, and productization all play a role. Talking only about "when parameters grow larger and intelligence suddenly appears," not only misses the intermediate work but also leads people to mistakenly believe that bigger tasks necessarily better suit them.

## When you put the three crazes together, what exactly is repeated?

![Third Wave Demonstration](https://hyphentech.top/obsidian-assets/understand-ai-02-history/image-original-2-b71992e2ff.png)

The curve represents the rise and fall of popularity in the narrative, not the statistical result of investment, number of papers, or talent numbers; The rise and fall of various fields are not uniform enough to share a single curve.

Putting the timeline together makes it easier to compare after a few twists. The year is a signpost, but it doesn't mean all changes suddenly happen that year.

| Time | Represents an event or phase | It answered something, but didn't answer anything |
| --- | --- | --- |
| 1955–1956 | Dartmouth Proposal and Seminar | Proposing a research direction does not mean that general intelligence already has a solution |
| 1958 | Perceptron-related displays | The possibility of learning simple tasks does not mean that complex abilities have been achieved |
| 1969 | Perceptron was published | Analyzing the limitations of specific models does not mean denying all multilayer networks |
| The 1970s | This is commonly referred to as the first cold winter | The gap between expectations and results has been exposed, with multiple technical and funding factors intertwined |
| The 1980s | Expert system for commercial applications | Narrow-domain rules can be valuable, but maintaining knowledge still comes at a cost |
| 1986 | Backward dissemination of representative papers | The widespread attention to multi-level training methods does not mean that all difficulties in deep training have been solved |
| In the late 1980s and beyond | This is commonly referred to as the second cold winter | With commercial and technical conditions under pressure, research has not fully stopped |
| 2012 | AlexNet competes with ImageNet | Showcasing breakthroughs with public results for specific tasks does not equate to general competency certification |
| 2017 | Transformer paper | Improving the computational organization of sequence training does not mean losing word order |
| 2020 | GPT-3 paper | Demonstrating scaling and few-sample capabilities also leaves questions about the boundaries between methods and capabilities |
| 2022 | ChatGPT released | Bringing conversational models to mass use while exposing reliability issues |

Following this line, what keeps coming up isn't "AI will crash every few years." History doesn't repeat itself exactly on time, just like a schematic diagram.

What repeatedly appears is a kind of reasoning jump: if you succeed on a task, you push it to all tasks; if you succeed in a demo, you push it to stable use; if technology advances, you push it to the point where delivery costs are reasonable.

![history_meme](https://hyphentech.top/obsidian-assets/understand-ai-02-history/image-history-meme-575997be8f.png)

It may seem like we're just "a little better," but in reality, we might be missing a whole set of conditions.

The experience of two winters cannot prove that all today's worries are unnecessary. Just because some directions succeeded in the past doesn't mean every promise will eventually be fulfilled. What we need to track is whether a specific obstacle has been resolved, not labeling technology as "never doable" or "guaranteed to succeed."

## Next time I see a breakthrough in the model, what questions will I ask first?

If you see "New model is open source, and regular computers can run it too," don't rush to interpret it as "My computer is already running stably."

By following the previous historical thread, you can break down this promise clearly.

**First, what ability does it prove? **Is it a selected demonstration, or a set of tests with clear settings? Getting a few examples right and consistently completing representative tasks is evidence of different strengths.

**Again, what conditions do these results depend on?** ** What hardware is needed, what precision, how much context is needed, and whether external tools are called? Just like the 2012 competition results, which should be read together with training data and metrics.

** Then ask, which step is missing? ** Downloading to weights solves file retrieval; Runtime supports model structures to solve compatibility; Sufficient memory and computing resources solve whether it can run; Achieving stable results in your task is the key to ease of use. They cannot replace each other.

**Finally, what counts as delivery? ** Occasionally get it right, or is it completed continuously? Is code generated, or does the code truly meet the specified functions? Does saving computational costs increase inspection and maintenance time? If acceptance standards are not clearly stated, discussions can easily turn into both parties' own imaginations.

Looking back at 1958, the experiment distinguishing left and right did not lose its meaning due to later disappointment. What needs to be corrected is the jump from this experiment directly to the judgment about what general intelligence is about to achieve.

Today, we no longer have to choose between "all bubbles" and "change everything immediately."

**Acknowledge the progress that has already happened, explain the conditions for progress, and then verify whether it can solve your problems. ** This is more useful than following a wave of excitement and then a round of disappointment and denial.

The idea of neural networks appeared so early but still experienced ups and downs, precisely because of this: the idea opened up possibilities but did not complete data, computation, training, and reliable delivery for later generations. Today's large models inherit this history and still need to undergo the same specific tests.

The next article will continue in the order of the original knowledge base, exploring how papers, code, weights, and licenses bring AI to ordinary users' computers. Behind the download button, there are several doors that are easy to miss.

## References

- [AlexNet Original Paper](https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf)
- [Classic Papers on Reverse Propagation](https://www.nature.com/articles/323533a0)
- [Dartmouth Study Proposal](http://jmc.stanford.edu/articles/dartmouth/dartmouth.html)


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
