---
title: "Groq Free Text API Test: For the same order, some calculate correctly, others calculate 4530"
slug: free-api-groq-text-20261102-en
status: published
lang: en
translation_of: free-api-groq-text-20261102
article_type: "article"
translation_source: machine
source_sha256: 00cce744f8c87ad1
date: 2026-11-03
updated: 2026-11-13
summary: "Correct answers and summing errors for the same order, the attachment method."
categories:
  - Resources
tags:
  - Free API
cover: "/obsidian-assets/free-api-groq-text-20261102/cover-b2f332d8ca.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/free-api-groq-text-20261102/) is authoritative.

> [!abstract]
> Get the order result in two seconds, and also retain one sum error
> HyphenTech · Data and measurements from November 2, 2026

For the same order, gpt-oss-20b on Groq gave the correct details after 1.977 seconds; switching to allam-2-7b, the subtotal was correct, but the total price was written as 4530 yuan. Is the free interface worth accepting? Look at these two answers first, which is more direct than just reading the platform description.

![Official Introduction to Groq](https://hyphentech.top/obsidian-assets/free-api-groq-text-20261102/image-groq-home-2d5bba25db.png)

## Orders are simple, and the answers can be calculated by hand

I have the model extract products, quantities, unit prices, subtotals, shipping costs, discounts, and total prices from a Chinese paragraph, returning them with fixed JSON fields. JSON is like a form with a name in every cell for the program to continue reading the "Total Price" field; Missing fields, half-content, or changing the product name all affect subsequent processing.

```本次真实输入
这是自制测试数据。只返回JSON，不加代码围栏。订单：设备A每台1200元，买2台；设备B每台350元，买3台；运费80元；优惠130元。输出字段items（包含name、quantity、unit_price、subtotal），shipping、discount、total。所有金额用整数。
```

```手工标准答案
1200 × 2 + 350 × 3 + 80 − 130 = 3400（元）
```

This time, using an existing account, the local HyphenBox forwarded the request to the corresponding platform. The timing ranged from the local machine's request to receiving the response, including network and service waiting; Each model's order question was only run once. The account was configured to the free mode and did not read the final bill.

## gpt-oss-20b: Details and total price match

```JSON
{"items":[{"name":"设备A","quantity":2,"unit_price":1200,"subtotal":2400},{"name":"设备B","quantity":3,"unit_price":350,"subtotal":1050}],"shipping":80,"discount":130,"total":3400}
```

Return to the original

This answer correctly states the names, subtotal, and total price of device A and device B. It then changes the four technical requirements into two sentences, finishing in 0.956 seconds, retaining four pieces of information: daily reset, one diagram per use, failure prompt, and self-key application.

```中文改写原始返回
每天免费额度重置，每个任务仅能生成一张图。若生成失败会保留错误信息，使用前请自行申请密钥。
```

## Changing models on the same platform yields different results

| Request model/task | Completing it takes time | Actually return |
| --- | --- | --- |
| OpenAI/GPT-OSS-20B <br>order | 1.977 seconds | 200; JSON field and amount match the standard answer |
| rewritten openai/gpt-oss-20b<br> | 0.956 seconds | 200; returned, four pieces of information retained |
| Allam-2-7B <br>order | 0.641 seconds | 200; Returned content, but the total price was incorrect |
| GROOQ/Compound <br>orders | 0.307 seconds | 404; Call failed |
| Groq/Compound-mini <br>orders | 0.305 seconds | 404; Call failed |
| OpenAI/GPT-OSS-120B <br>order | 2. 313 seconds | 200; JSON field and amount match the standard answer |
| QWEN/QWEN 3.8-27B <br>orders | 1.491 seconds | 200; JSON field and amount match the standard answer |

> This machine forwards via HyphenBox; One request per line, not multi-turn averaging. Time consumption includes network and upstream waiting.

![Order Request Actual Data](https://hyphentech.top/obsidian-assets/free-api-groq-text-20261102/image-groq-chart-f812a4193c.png)

GPT-OSS-120B and QWEN/QWEN3.8-27B also got the order correct. This round took 2.313 seconds and 1.491 seconds respectively; This is just a record of running the same question once, so you can't get the performance rankings for all tasks from this table.

```JSON
{
  "items": [
    {
      "name": "Device A",
      "quantity": 2,
      "unit_price": 1200,
      "subtotal": 2400
    },
    {
      "name": "Device B",
      "quantity": 3,
      "unit_price": 350,
      "subtotal": 1050
    }
  ],
  "shipping": 80,
  "discount": 130,
  "total": 4530
} 
```

allam-2-7b Original return

The difference between 4530 and the correct answer is 1130 yuan. The answers include 2400, 1050, 80, and 130, but the corresponding sum is not calculated. To connect the model into the order tool, the amount should still be given to the determined calculation code, and the model is responsible for extracting it. Let it directly give a neatly looking JSON, then record the total, which will be very quiet when errors occur.

Two old compound configurations return 404, no answer found this time; Do not keep a historical name on the client side; treat it as still available today.

## Where to get the key, and which items to fill in on the client

First open the [Groq console key page](https://console.groq.com/keys) and create your own key. Clients that support compatible interfaces usually fill in three fields: base address https://api.groq.com/openai/v1, key, and exact model name openai/gpt-oss-20b. The 'groq' in the model name is the local routing prefix for this round; do not copy this prefix when connecting directly to Groq.

```官方SDK接法示例
from groq import Groq

client = Groq()  # 从环境变量GROQ_API_KEY读取
result = client.chat.completions.create(
    model="openai/gpt-oss-20b",
    messages=[{"role": "user", "content": "把这句话改得更容易懂：每天重置免费额度。"}],
)
print(result.choices[0].message.content)
```

Follow the official Quick Start Installation Groq package before running it. Example reads environment variables by default; don't write keys in the script or screenshot to share. Actual tests use an existing free account; This SDK code is used to explain the direct connection method, without sending a duplicate request.

![Official Traffic Limit Page](https://hyphentech.top/obsidian-assets/free-api-groq-text-20261102/image-groq-limits-f67aa6f5b1.png)

How much you can use for free depends on your current account and specific model. The official limit page also lists the Developer's base limit; you can't treat the entire list as a treatment for every free user. If you encounter 429, wait for the suggested return time to avoid repeatedly refreshing and turning a task into a string of failed requests.

> [!quote] My judgment
> This GPT-OSS-20B is suitable for trial information organization and Chinese rewriting: both tasks are completed, and the full request is very short. It involves money and fixed formats; after extraction, fields still need to be validated and calculated by yourself. Whether the platform is fast or the task is correct depends on the results.

## Main sources of verification

- [Groq Official Website Introduction](https://console.groq.com/docs/overview)
- [Create Groq Key](https://console.groq.com/keys)
- [Groq Quick Start](https://console.groq.com/docs/quickstart)
- [Groq Official Usage Limit](https://console.groq.com/docs/rate-limits)


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
