---
title: "On September 23, 2026, how many free AI APIs are still available?"
slug: free-ai-api-radar-2026-09-23-en
status: published
lang: en
translation_of: free-ai-api-radar-2026-09-23
translation_source: machine
source_sha256: e0154ede59daf8a5
date: 2026-09-23
updated: 2026-10-03
summary: "17 old entry points were reviewed one by one, and 4 candidates were reviewed; 3 callable platforms were screened based on current non-empty real requests, with quotas and failure boundaries recorded."
categories:
  - Resources
tags:
  - AI
  - Free resources
cover: https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-09-23/cover-cd849e2436.jpg
brand_slogan: 让AI成为你的超能力
legacy_paths: []

---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/free-ai-api-radar-2026-09-23/) is authoritative.

> [!abstract]
> Special Topic Date: 2026-09-23 · Second Review: 2026-09-23
> HyphenTech

> [!tip]
> This issue, strictly speaking, three platforms passed at least three valid calls and one longer real-world task from my Mac network perspective; This does not mean long-term stability or universal availability.

> [!warning]
> Official pages only prove the existence of policies or models; whether the account can be accessed depends on the current request; No credentials, different protocols, or insufficient page crawling are listed separately and not marked as invalid.

## How do I retest, and where exactly is the free one stuck with?

I first list the model locally, then do short Q&A and slightly longer tasks on the same interface. Being able to list is just the first gate; Only when you actually get the words out can you cross the second gate. Gemini's dialogue and vector interfaces pass separately, and Groq's specified model also continuously returns valid body text. This is a record from my account and my network perspective, not a valid guarantee for everyone.

The most common misjudgment is the word "free." Who profits? The platform gets developers' attention and trial traffic; Who bears the cost? The caller spends time applying, migrating, and handling traffic restrictions, while providers bear the inference resources. My judgment is: the free tier is more like a boundary entry point than infrastructure that can be relied upon infinitely. This commercial motivation judgment is not an official platform promise, so I separate it from the original text of price and quota.

The failures encountered today are not the same problem: silicon-based flows return insufficient balances in this account; Pollinations public model directories are readable, but actual anonymous requests repeatedly report server errors; OpenRouter and Agnes fail first and recover later. Writing all these issues as "model lost" will bias the selection. Especially note: although the Agnes tested model did return text, the official website's free display did not fully correspond to the tested model, so I did not count it in the platform count in the title.

For regular users, I first try using short tasks without privacy, then check slightly longer tasks, and finally observe the rate limit recovery. Don't just stuff customer data, private warehouses, or keys into a free endpoint that hasn't read the privacy policy yet. The itemized table at the end of the main text keeps the missing field as "pending verification"; It may look better than filling it completely, but it's more practical than copying old quotas into today's policies.

## One-sentence recommendation

- This issue's real requests passed: OpenRouter, Groq, Google Gemini API; Test based on your account and region first.
- Gemini's Chat and Embedding are verified separately, without using Chat error requests to misjudge Embedding.
- Free entry points carry different risks such as 402, 429, 502, and 503; Long tasks and continuous call records are more important than zero-price web pages.

## Verify and investigate promptly

| Platform | Currently verified |
| --- | --- |
| OpenRouter | Retest can be called; First test 503, non-stable commitment |
| SiliconFlow | Insufficient account balance; Free models on the platform cannot be deemed invalid based on this |
| Zhipu BigModel | Visible in the official directory; Account level calls pending verification |
| Magic ModelScope | Account-level calls are subject to verification |
| Groq | This issue can be called; Stability varies among different models |
| Cloudflare Workers AI | Official free file confirmation; Account level calls pending verification |
| Agnes AI | Interface retesting can be called; The zero-price qualification of the tested model is subject to verification |
| Hugging Face Inference Providers | Official free quota confirmation; Account-level calls pending verification |
| NVIDIA NIM (build.nvidia.com) | Official portal confirmation; Account level calls pending verification |
| Google Gemini API | This issue's Chat free intersection passed; Embedding calls are valid, zero-price pending verification |
| Alibaba Cloud Bailian Model Studio | Policy update confirmation; Account level calls pending verification |
| iFlytek Spark | Official agreement confirmation; Account level calls pending verification |
| Cerebras | Account-level calls are subject to verification |
| Together AI | Account-level free qualification and calls are subject to verification |
| Pollinations | This period, all four calls were 500; failed to pass the true energy gate |
| GitHub Models | Retired and not considered as a candidate |
| Open source hosting (Ollama / llama.cpp / whisper.cpp / Piper) | Self-hosting is possible, but not a public free cloud API |
| OpenCode Zen | Official candidate; Account-level calls pending verification |
| FreeInference | Official candidate; Embedding call pending verification |
| USTC Public Model Service | Not part of the public free API and not included in recommendations |
| Ant larks | Insufficient page crawling is temporarily excluded from usable statistics |

> Special issue date: 2026-09-23; status reviewed on 2026-09-23

> [!warning]
> Only tests the legally held credentials and the public keyless interface; No sharing or trading keys, and no restrictions on verification codes, real-name registration, payment, region, or account limits.

---

## OpenRouter

**Retest can be called; First test 503, non-stable commitment**

| Project | Verify the content |
| --- | --- |
| Available models | nvidia/nemotron-3-super-120b-a12b:free |
| Access | OpenAI compatible; Register an account and create a Key, and use the free variant without a credit card |
| Base URL | https://openrouter.ai/api/v1 |
| Free type | Zero-price model / account-level free tier |
| Jian Quan | Register an account and create a Key, and use the free variant without a credit card |
| Free quota | Official free model restrictions and upstream restrictions coexist; The current actual limit of this account depends on the console |
| Reset cycle | Based on account limits |
| Validity period | Subject to account and official event terms |
| Region | International |
| Payment/real-name threshold | Credit card/top-up/real-name verification thresholds were not per-account verification this period |
| Privacy policy | The official model page for the tested NVIDIA free endpoint prompts that input and replies will be recorded for product improvement; Do not transmit personal or confidential data |
| Verify the conclusion | After the first 503, three real chats returned validly (including longer tasks); Another free model cooled down after the first 429. |
| Evidence status | This issue's official page has been loaded; Specific account benefits are subject to the console |

> [!warning]
> Different free models are not identical in availability; 429, 503, and account balance constraints must be viewed separately.

- Official source: https://openrouter.ai/docs/api-reference/limits
- Official source: https://openrouter.ai/nvidia/nemotron-3-super-120b-a12b%3Afree

- This issue's detection: openrouter/liquid/lfm-2.5-2.6b: free · chat · Effective 0/4 · probe-report.local.json
- This issue's detection: OpenRouter/nvidia/Nemotron-3-super-120b-a12b:free · chat · Effective 3/4 · probe-report.recheck.json

![OpenRouter Official Model Page: Nemotron Free Variants and Data Recording Tips · 2026-09-23](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-09-23/image-openrouter-1-a1578efc0f.png)

---

## SiliconFlow

**Insufficient account balance; Free platform models cannot be declared invalid based on this**

| Project | Verify the content |
| --- | --- |
| Available models | PaddlePaddle/PaddleOCR-VL-1.5 (official price page); Qwen/Qwen2.5-7B-Instruct (local target detection) |
| Access | OpenAI compatible; Registration + real-name authentication (only after real-name verification can you use all free models) |
| Base URL | https://api.siliconflow.cn/v1 |
| Free type | Zero-price model/account conditions |
| Jian Quan | Registration + Real-name authentication (you can use all free models after real-name verification) |
| Free quota | Account-level limits are subject to verification by the control console |
| Reset cycle | awaiting verification |
| Validity period | Subject to account and official event terms |
| Region | Domestic |
| Payment/real-name threshold | Real-name requirements are detailed in the official announcement |
| Privacy policy | This issue did not verify any referable privacy terms item by item; Sensitive data is prohibited from being invested in unreviewed free endpoints |
| Verify the conclusion | The local target model returned 402 on all four requests; the official price page still lists the free model, so it cannot be inferred that all accounts are unavailable. |
| Evidence status | Official page scraping for this issue is insufficient or unreadable; Verify based on actual tests or standards |

> [!warning]
> The official announcement states that account usage requires real-name verification; Retiring the old PaddleOCR-VL does not mean retiring the PaddleOCR-VL-1.5.

- Official source: https://siliconflow.cn/pricing

- This issue's detection: siliconflow/Qwen/Qwen2.5-7B-Instruct · chat · Effective 0/4 · probe-report.local.json

---

## Zhipu BigModel

**Visible in the official directory; Account-level calls pending verification**

| Project | Verify the content |
| --- | --- |
| Available models | The official model overview lists the GLM Flash series; The specific free models are subject to review on the model page |
| Access | OpenAI compatible; Register an account to obtain an API Key |
| Base URL | https://open.bigmodel.cn/api/paas/v4 |
| Free type | Official free model/account tier |
| Jian Quan | Register an account to obtain an API Key |
| Free quota | Pending verification on the account equity page |
| Reset cycle | awaiting verification |
| Validity period | Subject to account and official event terms |
| Region | Domestic |
| Payment/real-name threshold | Credit card/top-up/real-name verification thresholds were not per-account verification this period |
| Privacy policy | This issue did not verify any referable privacy terms item by item; Sensitive data is prohibited from being invested in unreviewed free endpoints |
| Verify the conclusion | No legally accessible independent account vouchers in this period cannot be counted as truly usable. |
| Evidence status | This issue's official page has been loaded; Specific account benefits are subject to the console |

> [!warning]
> Old models and quotas must not be directly reused.

- Official source: https://docs.bigmodel.cn/cn/guide/start/model-overview

---

## Magic ModelScope

**Account-Level Calls Pending Verification**

| Project | Verify the content |
| --- | --- |
| Available models | The specific model list is subject to verification by the official console |
| Access | Compatible with OpenAI; After registering an account, you can obtain an Access Token at https://modelscope.cn/my/myaccesstoken |
| Base URL | https://api-inference.modelscope.cn/v1/ |
| Free type | The account layer offers free service |
| Jian Quan | After registering an account, obtain an Access Token at https://modelscope.cn/my/myaccesstoken |
| Free quota | awaiting verification |
| Reset cycle | awaiting verification |
| Validity period | Subject to account and official event terms |
| Region | Domestic |
| Payment/real-name threshold | Credit card/top-up/real-name verification thresholds were not per-account verification this period |
| Privacy policy | This issue did not verify any referable privacy terms item by item; Sensitive data is prohibited from being invested in unreviewed free endpoints |
| Verify the conclusion | The old official document did not extract the verifiable body text this round, and did not perform the real call. |
| Evidence status | Official page scraping for this issue is insufficient or unreadable; Verify based on actual tests or standards |

> [!warning]
> You can't treat the August list as the available model for September.

- Official source: https://www.modelscope.cn/docs/model-service/API-Inference/intro

---

## Groq

**Usable for this issue; Stability varies among different models**

| Project | Verify the content |
| --- | --- |
| Available models | qwen/qwen3.8-27b; openai/gpt-oss-20b |
| Access | OpenAI compatible; Register an account to create a Key |
| Base URL | https://api.groq.com/openai/v1 |
| Free type | The cycle has resumed the free mode |
| Jian Quan | Register an account and create a Key |
| Free quota | Qwen3.8-27b official limit table lists 30 RPM, 1000 RPD, 8K TPM, 200K TPD; The actual account limit is subject to the console |
| Reset cycle | Scrolling/resetting by minute and day, based on the console |
| Validity period | Subject to account and official event terms |
| Region | International |
| Payment/real-name threshold | Credit card/top-up/real-name verification thresholds were not per-account verification this period |
| Privacy policy | According to the official Groq explanation, inference inputs and outputs are not retained by default, but fault and abuse investigations can be temporarily recorded for up to 30 days; Accounts can be set to zero data retention |
| Verify the conclusion | qwen3.8-27b Four times of Chat returned valid text (including longer tasks); gpt-oss-20b Valid twice, twice only thought without main text. |
| Evidence status | This issue's official page has been loaded; Specific account benefits are subject to the console |

> [!warning]
> Different models on the same platform cannot share stability conclusions.

- Official source: https://console.groq.com/docs/rate-limits
- Official source: https://console.groq.com/docs/your-data
- Official source: https://console.groq.com/docs/deprecations

- This issue's detection: Groq/OpenAI/GPT-OSS-20B · chat · Effective 2/4 · probe-report.local.json
- This issue's detection: groq/qwen/qwen 3.8-27b · chat · Effective 4/4 · probe-report.recheck.json

![Official Groq Limit Page: Free tier limits for specific models and account console calibers · 2026-09-23](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-09-23/image-groq-1-bc31aa3171.png)

---

## Cloudflare Workers AI

**Official free file confirmation; Account-level calls pending verification**

| Project | Verify the content |
| --- | --- |
| Available models | Official Workers AI model directory; Specific free available models are verified by account |
| Access | REST (Worker can directly env. AI.run); Cloudflare account; Both Free and Paid Workers plans enjoy this free quota |
| Base URL | https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/{model} |
| Free type | The free mode is restored daily |
| Jian Quan | Cloudflare account; Both Free and Paid Workers plans enjoy this free quota |
| Free quota | 10,000 Neurons/day |
| Reset cycle | UTC 00:00 |
| Validity period | Subject to account and official event terms |
| Region | International |
| Payment/real-name threshold | Credit card/top-up/real-name verification thresholds were not per-account verification this period |
| Privacy policy | This issue did not verify any referable privacy terms item by item; Sensitive data is prohibited from being invested in unreviewed free endpoints |
| Verify the conclusion | The official price page clearly states the daily free quota; this period, no legally valid accounts or model combinations are used for real calls. |
| Evidence status | This issue's official page has been loaded; Specific account benefits are subject to the console |

> [!warning]
> If you exceed the limit, the free plan will fail; Neurons cannot be converted into a fixed number of chats.

- Official source: https://developers.cloudflare.com/workers-ai/platform/pricing/

![Cloudflare Official Pricing Page: Workers AI Daily Free Neurons Allowance · 2026-09-23](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-09-23/image-cloudflare-1-686624d9ef.png)

---

## Agnes AI

**Interface retesting can be called; Zero-price qualification of tested model pending verification**

| Project | Verify the content |
| --- | --- |
| Available models | agnes-2.5-flash; agnes-2.0-flash (tested); The official Free API currently mainly showcases 3.0 Flash |
| Access | OpenAI compatible (text conversation) + REST (image synchronization / video asynchronous polling); Activate by logging in with your Google account to obtain an API Key |
| Base URL | https://apihub.agnes-ai.com/v1 |
| Free type | Account layer free tier / dynamic frequency limiting |
| Jian Quan | You can activate it by logging in with your Google account to obtain the API Key |
| Free quota | This issue did not verify the free pricing and fixed figures for 2.5 Flash from the official readable page |
| Reset cycle | Pending verification by the account console |
| Validity period | Subject to account and official event terms |
| Region | International |
| Payment/real-name threshold | Credit card/top-up/real-name verification thresholds were not per-account verification this period |
| Privacy policy | This issue did not verify any referable privacy terms item by item; Sensitive data is prohibited from being invested in unreviewed free endpoints |
| Verify the conclusion | 2.5 Flash: Three valid chats after the first 502 (including longer tasks); 2.0 Flash: One valid trigger triggers 429 cooldown. The tested model did not pass the official zero-price intersection gate. |
| Evidence status | The official website displays Free API and 3.0 Flash; The zero-cost 2.5 Flash test qualification is not confirmed on the official readable page |

> [!warning]
> The official Free API promotion cannot automatically apply to 2.5 Flash; You cannot equate three consecutive successes with long-term stability.

- Official source: https://agnes-ai.com/

- This issue's detection: agnes/agnes-2.0-flash · chat · Effective 1/4 · probe-report.local.json
- This issue's detection: agnes/agnes-2.5-flash · chat · Effective 3/4 · probe-report.recheck.json

---

## Hugging Face Inference Providers

**Official free quota confirmation; Account-level calls pending verification**

| Project | Verify the content |
| --- | --- |
| Available models | According to the official Inference Providers route and account visibility model |
| Access | OpenAI compatible; HF account + Access Token |
| Base URL | https://router.huggingface.co/v1 |
| Free type | Monthly quota calculation |
| Jian Quan | HF account + Access Token |
| Free quota | Free users have a monthly quota of $0.10 |
| Reset cycle | By month |
| Validity period | Subject to account and official event terms |
| Region | International |
| Payment/real-name threshold | Credit card/top-up/real-name verification thresholds were not per-account verification this period |
| Privacy policy | This issue did not verify any referable privacy terms item by item; Sensitive data is prohibited from being invested in unreviewed free endpoints |
| Verify the conclusion | The official price page shows monthly calculation limits; No actual tests for Embedding or Chat have been tested this period. |
| Evidence status | This issue's official page has been loaded; Specific account benefits are subject to the console |

> [!warning]
> BYOK routing charges differ and cannot be understood as unlimited calls from the platform.

- Official source: https://huggingface.co/docs/inference-providers/pricing

![Hugging Face Official Pricing Page: Monthly Limit Calculation for Free Accounts · 2026-09-23](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-09-23/image-huggingface-1-db3987ce99.png)

---

## NVIDIA NIM (build.nvidia.com)

**Official portal confirmation; Account-level calls pending verification**

| Project | Verify the content |
| --- | --- |
| Available models | build.nvidia.com is subject to the current Free Endpoint tag |
| Access | OpenAI compatible; NVIDIA developer account |
| Base URL | https://integrate.api.nvidia.com/v1 |
| Free type | Official Free Endpoint/Account Layer |
| Jian Quan | NVIDIA developer account |
| Free quota | Unified fixed quota not verified |
| Reset cycle | awaiting verification |
| Validity period | Subject to account and official event terms |
| Region | International |
| Payment/real-name threshold | Credit card/top-up/real-name verification thresholds were not per-account verification this period |
| Privacy policy | This issue did not verify any referable privacy terms item by item; Sensitive data is prohibited from being invested in unreviewed free endpoints |
| Verify the conclusion | The official model entry contains a Free Endpoint, but the independent account API call for this issue has not been completed. |
| Evidence status | This issue's official page has been loaded; Specific account benefits are subject to the console |

> [!warning]
> A successful NVIDIA model forwarded by OpenRouter does not necessarily mean the NVIDIA direct connection port is tested successfully.

- Official source: https://build.nvidia.com/models

---

## Google Gemini API

**This issue's Chat intersection is free to pass; Embedding calls are valid, zero-price pending approval**

| Project | Verify the content |
| --- | --- |
| Available models | gemini-3.1-flash-lite (official free tier); gemini-embedding-001 (call valid, current free price pending approval) |
| Access | Native REST + OpenAI compatible layer; Free tier qualification requires "valid project or free trial," no need to link a settlement account |
| Base URL | https://generativelanguage.googleapis.com/v1beta/openai/ |
| Free type | Model-by-model free version |
| Jian Quan | The free tier qualification requirement is "valid project or free trial," with no need to link a settlement account |
| Free quota | Limits for model/project RPM, TPM, RPD; This account is based on the AI Studio console |
| Reset cycle | RPD resets at midnight Pacific Time |
| Validity period | Subject to account and official event terms |
| Region | International |
| Payment/real-name threshold | Credit card/top-up/real-name verification thresholds were not per-account verification this period |
| Privacy policy | Google's official pricing page marks the free tier as "Yes" for product improvement; Do not share personal or confidential data |
| Verify the conclusion | All four instances of Chat are not null (including longer tasks); All four instances of Embedding are non-null 3072D vectors. The official current pricing page does not list the free price for embedding-001, so only the Chat model is included in the free intersection. |
| Evidence status | This issue's official page has been loaded; Specific account benefits are subject to the console |

> [!warning]
> Free tier requests may be used to improve Google products; Sensitive content should not be included. Model, region, and account eligibility affect the free tier.

- Official source: https://ai.google.dev/gemini-api/docs/rate-limits
- Official source: https://ai.google.dev/gemini-api/docs/pricing

- This issue's detection: gemini/gemini-3.1-flash-lite · chat · Effective 4/4 · probe-report.local.json
- This issue's detection: gemini/gemini-embedding-001 · embedding · Effective 4/4 · probe-report.local.json

![Gemini Official Limit Page: Free tier restrictions based on model and project · 2026-09-23](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-09-23/image-gemini-1-b8b4b0c6fe.png)

![Gemini Official Pricing Page: Flash-Lite Free Tier and Data Usage Standards · 2026-09-23](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-09-23/image-gemini-2-5b0805cf7d.png)

---

## Alibaba Cloud Bailian Model Studio

**Policy update confirmation; Account-level calls pending verification**

| Project | Verify the content |
| --- | --- |
| Available models | Please refer to the current Model Studio model pricing page |
| Access | Compatible with OpenAI; Alibaba Cloud accounts, some benefits require real-name verification |
| Base URL | https://dashscope.aliyuncs.com/compatible-mode/v1 |
| Free type | A one-time credit limit for new users |
| Jian Quan | Some benefits for Alibaba Cloud accounts require real-name verification |
| Free quota | The validity period for newly opened free users in Singapore is 90 days according to the official new regulations; The specific amount awarded depends on the account |
| Reset cycle | One-time, no replacement |
| Validity period | After 2026-09-08 UTC, newly activated Singapore region applies for 90 days |
| Region | Domestic |
| Payment/real-name threshold | Some rights require real-name registration; Account level requirements are subject to verification |
| Privacy policy | This issue did not verify any referable privacy terms item by item; Sensitive data is prohibited from being invested in unreviewed free endpoints |
| Verify the conclusion | The official September policy announcement confirmed an adjustment to the validity period of new account opening bonuses; independent account calls were not completed this period. |
| Evidence status | This issue's official page has been loaded; Specific account benefits are subject to the console |

> [!warning]
> This is not a long-term free period; The terms for historical account holders do not change automatically due to announcements.

- Official source: https://www.alibabacloud.com/help/zh/model-studio/new-free-quota-validity-adjustment

---

## iFlytek Spark

**Official agreement confirmation; Account-level calls pending verification**

| Project | Verify the content |
| --- | --- |
| Available models | Spark's official WebSocket service model is selected based on independent domain names and protocols |
| Access | WebSocket native protocol (not compatible with OpenAI); After registration, you can get the AppID, APIKey, and APISecret trio on the console, and claim free credits on the product page |
| Base URL | wss://spark-api.xf-yun.com/ (WebSocket) |
| Free type | Account to claim a free package |
| Jian Quan | After registering, get the AppID, APIKey, and APISecret trio in the console, and claim the free credit on the product page |
| Free quota | Please refer to the specific claim page and console |
| Reset cycle | Receive your package as the standard |
| Validity period | Subject to account and official event terms |
| Region | Domestic |
| Payment/real-name threshold | Credit card/top-up/real-name verification thresholds were not per-account verification this period |
| Privacy policy | This issue did not verify any referable privacy terms item by item; Sensitive data is prohibited from being invested in unreviewed free endpoints |
| Verify the conclusion | Official documentation requires AppID, APIKey, APISecret; You cannot test the WebSocket model with incorrect OpenAI Chat requests. |
| Evidence status | This issue's official page has been loaded; Specific account benefits are subject to the console |

> [!warning]
> Some endpoints are not Chat; The key trio cannot be written to the probe report.

- Official source: https://www.xfyun.cn/doc/spark/Web.html

---

## Cerebras

**Account-Level Calls Pending Verification**

| Project | Verify the content |
| --- | --- |
| Available models | The account visibility model prevails |
| Access | OpenAI compatible; Register an account |
| Base URL | https://api.cerebras.ai/v1 |
| Free type | New users receive a one-time quota / pending verification |
| Jian Quan | Register an account |
| Free quota | This issue's official capture has not verified the fixed number of reusable items |
| Reset cycle | If it is a trial quota, it will not be reset; Specifics will be verified by the control console |
| Validity period | Subject to account and official event terms |
| Region | International |
| Payment/real-name threshold | Credit card/top-up/real-name verification thresholds were not per-account verification this period |
| Privacy policy | This issue did not verify any referable privacy terms item by item; Sensitive data is prohibited from being invested in unreviewed free endpoints |
| Verify the conclusion | The official price entry text is insufficient, and the old version's bonus and payment thresholds cannot be directly inherited. |
| Evidence status | This issue's official page has been loaded; Specific account benefits are subject to the console |

> [!warning]
> If you need to bind a payment method, it cannot be included in the no-threshold free tier.

- Official source: https://inference-docs.cerebras.ai/support/pricing

---

## Together AI

**Account-level free qualification and call verification pending**

| Project | Verify the content |
| --- | --- |
| Available models | Based on the current visible price of the account and the model directory |
| Access | OpenAI compatible; Register an account to create a Key |
| Base URL | https://api.together.xyz/v1 |
| Free type | Dynamic traffic limiting/free eligibility pending verification |
| Jian Quan | Register an account and create a Key |
| Free quota | Dynamic organization/model speed limits, no fixed fixed free data |
| Reset cycle | Dynamic |
| Validity period | Subject to account and official event terms |
| Region | International |
| Payment/real-name threshold | Credit card/top-up/real-name verification thresholds were not per-account verification this period |
| Privacy policy | This issue did not verify any referable privacy terms item by item; Sensitive data is prohibited from being invested in unreviewed free endpoints |
| Verify the conclusion | Official documentation explains the meaning of 429 and 503 and dynamic speed limits; There is insufficient evidence this period to prove stable free limits. |
| Evidence status | This issue's official page has been loaded; Specific account benefits are subject to the console |

> [!warning]
> Dynamic speed limits should not be mistakenly written as fixed free quotas.

- Official source: https://docs.together.ai/docs/rate-limits

---

## Pollinations

**This period, all four calls were 500; failed to use the real energy gate**

| Project | Verify the content |
| --- | --- |
| Available models | openai-fast (official model directory list anonymity layer) |
| Access | REST / OpenAI compatible path; The anonymity layer of text interfaces does not require Keys; Generative interfaces require a key and Pollen balance |
| Base URL | https://text.pollinations.ai/openai |
| Free type | Publicly Revealed Keyless/Anonymous Layer |
| Jian Quan | The anonymity layer of text interfaces does not require Keys; Generation class interfaces require a built-in Key and Pollen balance |
| Free quota | The official directory does not specify the stable call limit |
| Reset cycle | awaiting verification |
| Validity period | Subject to account and official event terms |
| Region | International |
| Payment/real-name threshold | Credit card/top-up/real-name verification thresholds were not per-account verification this period |
| Privacy policy | This issue did not verify any referable privacy terms item by item; Sensitive data is prohibited from being invested in unreviewed free endpoints |
| Verify the conclusion | The public model list is visible, but all three minimum chats and one longer task return 500. |
| Evidence status | This issue's official page has been loaded; Specific account benefits are subject to the console |

> [!warning]
> Model discovery does not mean Chat is available; You cannot use the August test to replace this issue.

- Official source: https://text.pollinations.ai/models

---

## GitHub Models

**Retired and not considered as a candidate**

| Project | Verify the content |
| --- | --- |
| Available models | None |
| Access | —; — |
| Base URL | — |
| Free type | Retired from service |
| Jian Quan | — |
| Free quota | None |
| Reset cycle | Not applicable |
| Validity period | Retired from service |
| Region | International |
| Payment/real-name threshold | Credit card/top-up/real-name verification thresholds were not per-account verification this period |
| Privacy policy | This issue did not verify any referable privacy terms item by item; Sensitive data is prohibited from being invested in unreviewed free endpoints |
| Verify the conclusion | The official GitHub Models documentation states that the service has been retired. |
| Evidence status | This issue's official page has been loaded; Specific account benefits are subject to the console |

> [!warning]
> Old links and old quotas must not continue to be promoted.

- Official source: https://docs.github.com/en/github-models

---

## Open source hosting (Ollama / llama.cpp / whisper.cpp / Piper)

**Self-hosted but not a public free cloud API**

| Project | Verify the content |
| --- | --- |
| Available models | Determined by the local installation model |
| Access | OpenAI compatibility; Your own machine; VRAM/memory determines how large the model can run |
| Base URL | http://localhost:11434/v1 (Ollama default) |
| Free type | Open source custody |
| Jian Quan | Your own machine; VRAM/memory determines how large the model can run |
| Free quota | No external platform call quota; Hardware and electricity fees are not zero |
| Reset cycle | Not applicable |
| Validity period | Subject to account and official event terms |
| Region | Local |
| Payment/real-name threshold | Credit card/top-up/real-name verification thresholds were not per-account verification this period |
| Privacy policy | Local control is self-controlled |
| Verify the conclusion | llama.cpp Official local OpenAI-compatible services are provided; If you don't participate in cloud APIs, you can really count them on the platform. |
| Evidence status | This issue's official page has been loaded; Specific account benefits are subject to the console |

> [!warning]
> Requires self-deployment, maintenance, and bearing hardware and energy costs.

- Official source: https://github.com/ggml-org/llama.cpp

---

## OpenCode Zen

**Official Candidate; Account-level calls pending verification**

| Project | Verify the content |
| --- | --- |
| Available models | jev-1.13-free, etc., based on the current Zen model page |
| Access | Account and Zen API Key |
| Base URL | https://opencode.ai/zen/v1 |
| Free type | Specific limited-time zero-price models |
| Jian Quan | Account and Zen API Key |
| Free quota | Pending account verification |
| Reset cycle | awaiting verification |
| Validity period | Limited-time event, deadline waiting for official verification |
| Region | awaiting verification |
| Payment/real-name threshold | The official Zen general instructions require adding billing information; The specific free model threshold is subject to account verification |
| Privacy policy | awaiting verification |
| Verify the conclusion | Only official candidates have been found; No legally accessible independent accounts have been obtained in this period, and three minimum requests and longer tasks have been passed. |
| Evidence status | This issue has been read on the official page |

> [!warning]
> Do not use document names as interfaces; Do not bypass registration, real-name verification, or payment verification.

- Official source: https://opencode.ai/docs/zen

---

## FreeInference

**Official Candidate; Embedding Call to Be Verified**

| Project | Verify the content |
| --- | --- |
| Available models | Official Free labeled models such as bge-m3 Embedding |
| Access | Account API Key |
| Base URL | Please refer to the official API documentation |
| Free type | Free model/account tier |
| Jian Quan | Account API Key |
| Free quota | Pending account verification |
| Reset cycle | awaiting verification |
| Validity period | awaiting verification |
| Region | awaiting verification |
| Payment/real-name threshold | awaiting verification |
| Privacy policy | awaiting verification |
| Verify the conclusion | Only official candidates have been found; No legally accessible independent accounts have been obtained in this period, and three minimum requests and longer tasks have been passed. |
| Evidence status | This issue has been read on the official page |

> [!warning]
> Do not use document names as interfaces; Do not bypass registration, real-name verification, or payment verification.

- Official source: https://doc.freeinference.org/models

---

## USTC Public Model Service

**Not part of the public free API, not included in recommendations**

| Project | Verify the content |
| --- | --- |
| Available models | The September update record includes DeepSeek V4.1 Flash and more |
| Access | Authorization for teachers, students, or projects |
| Base URL | Please refer to the institution's authorization documents |
| Free type | Institution-exclusive free resources |
| Jian Quan | Authorization for teachers, students, or projects |
| Free quota | Pending verification by authorized account |
| Reset cycle | awaiting verification |
| Validity period | awaiting verification |
| Region | Chinese mainland/institution network qualifications are subject to verification |
| Payment/real-name threshold | Non-public open accounts |
| Privacy policy | awaiting verification |
| Verify the conclusion | Only official candidates have been found; No legally accessible independent accounts have been obtained in this period, and three minimum requests and longer tasks have been passed. |
| Evidence status | This issue has been read on the official page |

> [!warning]
> Do not use document names as interfaces; Do not bypass registration, real-name verification, or payment verification.

- Official source: https://llm.ustc.edu.cn/guide/technical-updates/

---

## Ant larks

**Insufficient page crawling, not included in available statistics for now**

| Project | Verify the content |
| --- | --- |
| Available models | Subject to official selection qualifications and backing support |
| Access | Registration review and account proof |
| Base URL | Pending verification on the official access page |
| Free type | Creator application amount / pending verification |
| Jian Quan | Registration review and account proof |
| Free quota | Clues on the official website involve creator bonus amounts; exact amounts and terms will be reviewed on the official readable page |
| Reset cycle | One-time candidate; Pending verification |
| Validity period | awaiting verification |
| Region | awaiting verification |
| Payment/real-name threshold | Eligibility, real-name registration, and payment thresholds are subject to verification |
| Privacy policy | awaiting verification |
| Verify the conclusion | Only official candidates have been found; No legally accessible independent accounts have been obtained in this period, and three minimum requests and longer tasks have been passed. |
| Evidence status | The official page has insufficient content for this issue and needs verification |

> [!warning]
> Do not use document names as interfaces; Do not bypass registration, real-name verification, or payment verification.

- Official source: https://www.ant-ling.com/

---

## Key reminder

- Groq's official retirement records show that the qwen/qwen3.6-27b was discontinued as of September 14 for free/developer level calls; The exact model routing for this machine is disabled, but the successor qwen/qwen3.8-27b remains available.
- The silicon-based mobile account 402 only indicates insufficient account balance and cannot declare the platform's free services invalid.
- Pollinations' public directory is readable this issue, but anonymous chat returned 500 four times.
- Both OpenRouter and Agnes experienced failures followed by recovery, making them unsuitable for promising uninterrupted production.
- Institution-limited, one-time grants, and free cloud API counts that do not participate in public cycles of free cloud API counting from open-source custody.

## My access priority

- First, non-sensitive testing was conducted using Gemini Chat/Embedding and Groq-specified models, which were valid on all four real-world calls in this issue.
- OpenRouter and Agnes can be alternatives, but clients should have explicit error messages and switching policies.
- For platforms without account-level verification, first check the official backend rights and privacy terms, then make the minimum request of the same type.

> [!summary] Final conclusion
> According to this issue's legal and genuine requests, three platforms reached the minimum "callable" threshold; This is not a long-term stable leaderboard. What was not tested is not invalid, and the zero price on the ad page is not a true return all at once.


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
