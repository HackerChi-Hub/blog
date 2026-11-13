---
title: "Agnes Free Drawing API Test: Generated this image in 15.7 seconds, with clear connection and conditions"
slug: free-api-agnes-image-20261102-en
status: published
lang: en
translation_of: free-api-agnes-image-20261102
article_type: "article"
translation_source: machine
source_sha256: 1451fa2728730d36
date: 2026-11-03
updated: 2026-11-13
summary: "Original image of robot watering, interface parameters, and free stage conditions."
categories:
  - Resources
tags:
  - Free API
cover: "/obsidian-assets/free-api-agnes-image-20261102/cover-5c1bc56842.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/free-api-agnes-image-20261102/) is authoritative.

> [!abstract]
> First, look at the real images, then check the free conditions for the default trial version
> HyphenTech · Data and measurements from November 2, 2026

The most useful thing to connect raw images into your tools is a real image returned by the interface. I sent Agnes Image 2.5 Flash a task called "Robot Watering Seedlings," and it took 15.688 seconds to collect all images. Let's look at the original image first.

![Actual test generates original image](https://hyphentech.top/obsidian-assets/free-api-agnes-image-20261102/image-agnes-result-c3704bc78f.png)

The images show a robot, a handheld water bottle, seedlings, and water flow—the main subjects and actions all match. This time, the request was made using agnes-image-2.5-flash, which requires 1K, 16:9, one photo at a time; The original file received was a PNG of 1312×736, not enlarged into a so-called 4K sample.

## Who is it free to use? This sentence clarifies this first

On the official website pricing page collected on November 2, the trial price for this image model is listed as zero. **This is the default phase discount for the user trial version. **Explanation on the same page: Agent Plan credits points based on the standard price and does not participate in this free offer. Even if you have already purchased a package, you cannot simply interpret your pricing as "zero price."

![Official Website Trial Billing Conditions](https://hyphentech.top/obsidian-assets/free-api-agnes-image-20261102/image-agnes-conditions-dcff4dc1de.png)

![Image Model Pricing](https://hyphentech.top/obsidian-assets/free-api-agnes-image-20261102/image-agnes-image-price-05b174a8ef.png)

Before this submission, the program checked the official real-time price for the corresponding model, confirmed zero price, and only issued the request, and did not switch to the charging model when it failed. The final account bill has not yet been read, so I am showing the current policy and actual product, not writing it as a redemption zero invoice.

Enter from [Agnes official website](https://agnes-ai.com/), create your own account and key; Then open [Image Model Documentation](https://wiki.agnes-ai.com/zh-Hans/docs/agnes-image-25-flash). Check the pricing page for free conditions, check the model documentation for parameters—each manages one thing.

## How to connect the interface and fill in the parameters

![Official Model Documentation](https://hyphentech.top/obsidian-assets/free-api-agnes-image-20261102/image-agnes-docs-055085b210.png)

Text-to-image use POST /v1/images/generations. The interface address is https://apihub.agnes-ai.com/v1/images/generations. Below is the actual request body used in this round. For direct connection, configure your own key according to the official website; This round is forwarded by HyphenBox, with no additional repeated direct connection requests.

```JSON
{
  "model": "agnes-image-2.5-flash",
  "prompt": "白色摄影棚里，一台青绿色的小机器人拿着浇水壶，正在给一盆绿色幼苗浇水。完整展示机器人、浇水壶和花盆，水流清楚可见，柔和自然光，没有人物，没有文字。",
  "size": "1K",
  "ratio": "16:9",
  "n": 1
}
```

size is the output level, ratio is the image size. For example, when ordering, you first select large or small cups, then choose hot drinks. Only when these two options combine can you determine the specifications you want. 1K is not "precise width 1000 pixels"; This time, 1312×736 shows that you still need to check the original file size in the end.

Documents also support image-to-image, multi-image compositing, and higher resolutions. These operations are different from this one text-to-image; this article does not use text-to-image results to guarantee their effect. When you need to reference images, place them in extra_body.image according to the document; Do not casually transfer private original images to the image bed just for a public link.

## Is this picture sufficient, and how to verify acceptance

I first look at the nouns and verbs in the task, then look at the details of the image: whether the robot is actually holding the pot, whether the water flows to the seedling, and whether the hand, pot handle, and water flow are interwoven incorrectly. Checking only "downloaded to a picture" will miss the parts that truly affect usability.

| This project | Actual records |
| --- | --- |
| Request the model | agnes-image-2.5-flash |
| Output settings/frame size | 1K／16:9 |
| Original file | PNG, 1312×736 |
| Complete upstream takes time | 15.688 seconds, excluding local queuing |
| Execute model returns | The service did not return this field |
| Times | One time the text-to-image was created, with no batch stability testing |

Another password-free drawing entry point, Pollinations, I also sent a robot watering task. It returned an image, but the subject became a person. This failed image will be saved in the free drawing directory: interface returns 200 and the task is correct, two layers of acceptance.

> [!quote] My judgment
> If you want to add a text-to-image entry point for your personal tool, you can first use this set of parameters to run your own task. The zero-price phase of the default trial is attractive; Package differences, actual size, and task compliance are the three things that determine whether you can continue using it.

## Main sources of verification

- [Agnes Image 2.5 Flash Official Documentation](https://wiki.agnes-ai.com/zh-Hans/docs/agnes-image-25-flash)
- [Agnes Official Pricing and Trial Billing](https://wiki.agnes-ai.com/zh-Hans/docs/pricing)
- [Agnes Official Website](https://agnes-ai.com/)


---

## 🧰 Tools I build

I maintain all of these tools myself. Preview builds are clearly labeled; the release pages are the source of truth for downloads, updates and known limits.

> [!info] HyphenAssistant
> **Status:** Official releases
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
