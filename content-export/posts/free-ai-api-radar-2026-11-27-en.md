---
title: "Free API reshuffle! Retesting mainstream large model interfaces after two months: full list of red and black lists and local usage conditions at the end of November"
slug: free-ai-api-radar-2026-11-27-en
status: published
lang: en
translation_of: free-ai-api-radar-2026-11-27
article_type: "article"
translation_source: machine
source_sha256: cdbf510cd85a5559
date: 2026-11-27
updated: 2026-11-28
summary: "Review 18 mainstream entry points (including password-free interfaces and overseas/domestic platforms), use local dual telecom authentic requests to screen stable usage red lists, and clearly specify whether registration, real-name verification, card binding, and agency conditions are required."
categories:
  - Resources
tags:
  - AI
  - Free resources
cover: "/obsidian-assets/free-ai-api-radar-2026-11-27/cover-416a2484a1.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/free-ai-api-radar-2026-11-27/) is authoritative.

> [!abstract]
> Special topic date: 2026-11-27 · Second review: 2026-11-27
> HyphenTech

> [!tip]
> It has been exactly two months since the last full Radar issue on 2026-09-23. This time, I ran both Chinese mainland direct connection and international network real-view real requests on my Mac locally, and checked registration, phone number, real-name registration, and credit card thresholds one by one. Out of 477 OpenRouter models, only 10 zero-cost text conversations remained, Mistral and Hugging Face free APIs are now history, and the only truly reliable interface must clearly understand local usage conditions.

> [!warning]
> All conclusions distinguish between "no registration required, no password required," "only email/GitHub card-free registration," "+86 phone number and real-name authentication," "forced foreign currency card trial," and "discontinued and retired." They never impersonate the API as the real API for web opening or model list readability.

## How do I retest, and where exactly is the free option stuck here?

　　First, let's talk about the biggest noticeable changes in the past two months: major companies are tightening their "no-threshold coin throwing." Out of 477 OpenRouter models across the site, text conversation variants with zero input/output have been reduced to just 10, and all are single-vendor bare carriers—nvidia/nemotron-3-super-120b-a12b:free and inclusionai/ling-3.0-flash-sante:free, which still worked last month, were tested today and directly reverted to HTTP 404 to paid, and the free Recraft image variant even had a countdown to be removed on 2026-11-28; Mistral's official documentation clearly stated that Free mode no longer includes API permissions, and Cerebras changed to requiring credit card linking to get a one-time $5 30-day trial.

　　But the good news is, if you match your local network and account requirements, there are still some real strengths: if you have an international network, qwen/qwen3.8-27b (409ms–1125ms) on Groq, gemini-3.5-flash-lite (621ms–1387ms), gemini-embedding-2 (495ms–785ms) on Google AI Studio, and the newly listed nvidia/nemotron-3-ultra-550b-a55b:free on OpenRouter all passed four consecutive real-world stress tests; If you are in a direct connection environment in China and don't want to deal with agents, you can use a +86 phone number with real-name authentication to directly connect to Zhipu GLM-4.7-Flash (200K contextual free forever, direct connection 137ms) and Moda daily 250 Magic Grains exchange pool (direct connection 84ms).

　　As for those who don't even want to register an account and just want to try a command from scratch, OVHcloud AI Endpoints (direct connection 1366ms) and Pollinations (direct connection 7836ms, proxy 1696ms) can still access Qwen3.8-27B, bge-m3 vectors, or basic conversations without keys today, but the anonymous IP valve is tightly shut down—OVH triggered a 429 message for the second consecutive burst with a cooldown of about 49 minutes, and Pollinations changed the anonymous layer to limit one reply per IP every 45 seconds. The table below lays out each site's registration requirements, network requirements, and test status. I also signed these results in the HyphenBox 2026.11.27.1 directory.

## In short, I recommend it

- 🟢 Main choice for international networks without binding cards: Groq (qwen/qwen3.8-27b, 4/4 tested passed: 409–1125ms) + Google Gemini API (prioritized gemini-3.5-flash-lite and gemini-embedding-2, passed 4/4 tests; 3.6-flash to avoid peak 503 flash) + OpenRouter (selected on-site nvidia/nemotron-3-ultra-550b-a55b: free, passed 4/4).
- 🟢 Domestic direct connection without agent main choice: Zhipu BigModel (+86 mobile number + real-name, GLM-4.7-Flash 200K, permanently free context and default no data for training, direct connection 137ms) + Moda ModelScope (+86 phone number + real-name Alibaba Cloud binding, daily payout 250 Moli adjustable Kimi-K3.1-Pro, etc., direct connection 84ms).
- 🟡 Zero-registration password-free emergency test: OVHcloud AI Endpoints and Pollinations can directly connect to China and run the first request without a key, but are subject to single-IP cooldown (49 minutes) and one reply every 45 seconds. Do not connect to high-frequency programming agents.
- 🔴 Clear advice to avoid pitfalls: Mistral's free API has been canceled (mandatory card binding payment), Hugging Face's free monthly bonus has been reset (None), GitHub Models' independent inference interface has been retired, and Cerebras has switched to forcing foreign currency card binding to receive a one-time $5 trial.

## Verify and check quickly

| Platform | Currently verified |
| --- | --- |
| Groq (Overseas Speed Mainstay) | 🟢 Tested pass (4/4 requests 200 OK, 409–1125ms) | requires card-free registration + international network |
| Google Gemini API (AI Studio) | 🟢 Tested and passed (both flash-lite and vector 4/4 passed) | Requires Google account + international network |
| OpenRouter (zero-price aggregation pool) | 🟢 Selected Adjustable Passes (only 10 of the 477 models remain with zero-price texts, 550B model passed on 4/4, older models widely removed) |
| Zhipu Open Platform BigModel (the preferred direct connection in China) | 🟢 Official permanent free policy confirmation (direct connection to Mainland China 137ms) | Requires +86 mobile number + real-name authentication |
| Pairing with the ModelScope API-Inference | 🟢 Official daily Moli free pool confirmation (Mainland direct connection 84ms) | Requires +86 mobile phone + real-name Alibaba Cloud binding |
| NVIDIA NIM (build.nvidia.com) | 🟡 Official 36 free development endpoints available (Mainland Direct Connection List 746ms) | Email registration and verification required |
| OVHcloud AI Endpoints (no registration, no password, no password) public interface) | 🟡 Keyless test can be adjusted (direct connection in mainland China 200 OK, but continuous anonymous bursts instantly hit 429 cooldown) |
| Pollinations (no registration, no passwords required, no confidentiality community interface) | 🟡 Key-free tested and adjustable (triggers new restriction: anonymous IP replenishes only 1 reply every 45 seconds) |
| SiliconFlow | 🟡 The official L0 free policy remains, but the existing test number on the local device triggers HTTP 402 insufficient balance interception |
| Cloudflare Workers AI | 🟡 Official daily 10,000 Neurons free reset confirmation | Suitable for lightweight edge small models and vectors |
| Cerebras Cloud (Card-free free tier has been canceled) | 🟠 Tightening threshold: a credit card must be linked to receive a one-time $5 / 30-day trial |
| Mistral AI La Plateforme (free API discontinued) | 🔴 Pitfall discouragement: The original free Experiment API has been canceled; creating an API Key requires a card to pay for it |
| Hugging Face Inference Providers (monthly gift cancelled) | 🔴 Pitfall Warning: Free users' monthly quota has been reset to zero (None), and the old $0.10/month is no longer valid |
| GitHub Models (independent free inference API retired) | 🔴 Retired: Local device holding valid GitHub Token after retesting and confirmation will no longer return to large model completion |

> Topic date 2026-11-27; status review on 2026-11-27

> [!warning]
> Only tests the legally available free tiers and password-free interfaces publicly provided by developers to developers; Whenever encountering SMS verification codes, real-name authentication, human-machine verification, or card binding thresholds, all entry conditions are truthfully recorded, with no bypass of security verification or inclusion of any black or gray market transit stations.

---

## Groq (Overseas Speed Mainstay)

🟢 ** Tested pass (4/4 requests 200 OK, 409–1125ms) | Card-free registration + international network required**

| Project | Verify the content |
| --- | --- |
| Available models | qwen/qwen3.8-27b, openai/gpt-oss-120b, openai/gpt-oss-20b, allam-2-7b |
| Access | OpenAI compatible; Requires an international network environment (direct connections from mainland China are easily blocked) |
| Base URL | https://api.groq.com/openai/v1 |
| Free type | Perpetual free tier |
| Verify authority | Register a Groq account to create an API Key (supports email / Google / GitHub, no phone real-name required) |
| Free limit | The official free mode for the main model is 30 RPM, 1000 RPD, 8000 TPM, and 200,000 TPD |
| Reset cycle | Automatically restores by minute and daily windows |
| Expiration date | Long-term effectiveness |
| Region | International (local agent required) |
| Payment/real-name thresholds | No need to bind a credit card or recharge money |
| Privacy Policy | By default, API requests are not used for model training |
| Verify the conclusions | Local gateway tests show QWEN/QWEN3.8-27B with 4 consecutive sessions (including longer Chinese backup schemes) and 2 conversations with gpt-oss-120b with 200 passes, with latency of only 409–1125ms. |
| Evidence status | 2026-11-27 Screenshot of official document + local real request approved |

> [!warning]
> A single ultra-long context can first hit the 8000 TPM minute limit; Direct connections to mainland China are unreliable and require an international network.

- Official source: https://console.groq.com/docs/rate-limits

![Groq Official Rate Limit Rules Page](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-11-27/image-groq-1-662b8efc41.png)

---

## Google Gemini API (AI Studio)

🟢 ** Tested and passed (both flash-lite and vector 4/4 passed) | Requires Google account + international network **

| Project | Verify the content |
| --- | --- |
| Available models | gemini-3.5-flash-lite (main recommendation), gemini-embedding-2, gemini-3.1-flash-lite, gemini 4 Hydrogen (throttle mode); Note: Gemini 4 Carbon/Neon is paid only |
| Access | Native REST + OpenAI compatibility layer; International networks in supported regions |
| Base URL | https://generativelanguage.googleapis.com/v1beta/openai/ |
| Free type | Permanent cycle free tier (designated lightweight model) |
| Verify authority | You need to log in to your Google account and generate a key with one click in AI Studio |
| Free limit | Display RPM/RPD free quotas in AI Studio by model and account level |
| Reset cycle | Resets every minute and at midnight Pacific Time |
| Expiration date | Long-term effectiveness |
| Region | International (requires support for regional agent exports) |
| Payment/real-name thresholds | Free tier does not require binding a credit card |
| Privacy Policy | ⚠️ The official pricing page clearly states: Free tier inputs and outputs will be used to improve Google products and models |
| Verify the conclusions | gemini-3.5-flash-lite four-session (621–1387ms) and gemini-embedding-2 quadruple vectors (495–785ms) all passed 200; but gemini-3.6-flash and gemma-4-31b-it repeatedly popped HTTP 503 High Demand during peak periods. |
| Evidence status | 2026-11-27 Official pricing page verified + local real request approved |

> [!warning]
> Never use paid Gemini 4 Carbon/Neon as free models; Do not share private commercial code on free tiers.

- Official source: https://ai.google.dev/gemini-api/docs/pricing

![Google Gemini API Official Pricing Page (Gemini 4 series and Free tier data training instructions are available on the right)](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-11-27/image-gemini-1-50221b8c6a.png)

---

## OpenRouter (zero-price aggregation pool)

🟢 ** Selected Adjustable Passes (Only 10 of the 477 models remain with zero-price texts, 550B model passed on 4/4, older models largely removed)**

| Project | Verify the content |
| --- | --- |
| Available models | Passed in-shelf tests: nvidia/nemotron-3-ultra-550b-a55b:free (1M context); Other in-shelf tests include baidu/ernie-5.5-flash-preview:free, nvidia/nemotron-3.5-super-vl:free, google/gemma-4-31b-it:free, etc |
| Access | OpenAI compatible; Direct connection to mainland China (1377ms), faster international network (806ms) |
| Base URL | https://openrouter.ai/api/v1 |
| Free type | Specify :free zero-price variant |
| Verify authority | You need to register an account and create a key (email / Google / GitHub login) |
| Free limit | Free account about 20 RPM, 50 times per day (after recharging 10 credits, account limit 1000 times per day) |
| Reset cycle | Resets daily, with real-time traffic limits from a single supplier |
| Expiration date | Upload and download anytime in collaboration with upstream (Recraft free raw images marked as of 2026-11-28) |
| Region | International (direct domestic connection) |
| Payment/real-name thresholds | No credit card required; However, if the account has a negative balance, free calls will be locked |
| Privacy Policy | ⚠️ Free upstream endpoints commonly record prompts for product improvement |
| Verify the conclusions | nvidia/nemotron-3-ultra-550b-a55b: Free 4 consecutive tasks (2029–13132ms) all 200 passed; gemma-4-26b-a4b-it: free 2nd request restored 429; Last month's popular nemotron-3-super-120b:free and ling-3.0-flash-sante:free returned to 404 delistings. |
| Evidence status | 2026-11-27 Site-wide 477 model scan + endpoint availability check + local real-world testing |

> [!warning]
> All 10 zero-valence text models currently have only one vendor bearer (eps=1) and must be hung behind gateways like HyphenBox that support automatic cooling and routing.

- Official source: https://openrouter.ai/models?max_price=0
- Official source: https://openrouter.ai/docs/api-reference/limits

![OpenRouter Zero-Price Model Page (only 10 Text models left, marked as removed November 28 by Recraft)](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-11-27/image-openrouter-1-651ed4e5ae.png)

---

## Zhipu Open Platform BigModel (the preferred direct connection in China)

🟢 ** Official permanent free policy confirmation (direct connection to Mainland China 137ms) | Requires +86 mobile number + real-name authentication**

| Project | Verify the content |
| --- | --- |
| Available models | GLM-4.7-Flash (30B·200K context), GLM-4.6V-Flash (128K multimodal), GLM-4-Flash-250414, CogView-3-Flash (raw images) |
| Access | OpenAI compatible; Native Chinese mainland ultra-fast direct connection (137ms), no proxy required |
| Base URL | https://open.bigmodel.cn/api/paas/v4 |
| Free type | Permanently free model + 20 million tokens trial package for new users |
| Verify authority | You need to log in with an SMS verification code of +86 China phone number (or scan with WeChat) and create an API Key |
| Free limit | The above Flash series has a unit price of 0, with the number of simultaneous concurrent requests limited by account level (V0–V3). |
| Reset cycle | Concurrent connections are released upon completion, with no daily total limit |
| Expiration date | Long-term validity (old GLM-4.5-Flash and GLM-Z1-Flash have been discontinued and migrated) |
| Region | Domestic (Direct Domestic Connection) |
| Payment/real-name thresholds | No credit card required; API calls require domestic real-name authentication |
| Privacy Policy | ✅ The official protocol explicitly forbids user API inputs and outputs from being used for model training |
| Verify the conclusions | Built-in browser verification requires +86 SMS verification code to ensure unauthorized login, but the official free documentation and price list fully confirm that GLM-4.7-Flash is permanently free, with 137ms of direct endpoint probing in mainland China. |
| Evidence status | 2026-11-27 Screenshot of official free model document + direct endpoint probability |

> [!warning]
> Note the free suffix: GLM-5.3-Flash and GLM-5.4 are both paid models, and typos will directly deduct the trial fund or balance.

- Official source: https://docs.bigmodel.cn/cn/guide/models/free/glm-4.7-flash

![Zhipu Open Documentation: GLM-4.7-Flash (200K context, supports tool calls and thinking patterns)](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-11-27/image-zhipu-1-4b3f91b182.png)

---

## Pairing with the ModelScope API-Inference

🟢 ** Official daily Moli free pool confirmation (Mainland China direct connection 84ms) | Requires +86 phone + real-name Alibaba Cloud binding**

| Project | Verify the content |
| --- | --- |
| Available models | Popular open-source and domestic models such as Kimi-K3.1-Pro, DeepSeek-V4.1-Flash-1017, Qwen3.8-27B, and GLM-5.3-Flash |
| Access | OpenAI compatible; Direct connection to /v1/models in Chinese mainland tests shows only 84ms at 200 OK |
| Base URL | https://api-inference.modelscope.cn/v1/ |
| Free type | Log in daily to claim free "Magic Seeds" redemption |
| Verify authority | You need to register with a +86 phone number to register and verify your email address, and forcibly bind a real-name verified Alibaba Cloud account |
| Free limit | Log in daily to receive 200 short-term Magic Particles + add 50 short-term Magic Seeds per day when linked to Alibaba Cloud (approximately 125–500 free adjustments per day) |
| Reset cycle | Daily login refresh (short-term Magic Particles valid for 24 hours) |
| Expiration date | Long-term open (single concurrent experience for developers) |
| Region | Domestic (Direct Domestic Connection) |
| Payment/real-name thresholds | No credit card is required; Alibaba Cloud real-name authentication binding must be completed |
| Privacy Policy | ⚠️ The universal protocol does not make a separate zero-retention and no-training commitment for the free inference interface |
| Verify the conclusions | If you want to get Kimi K3.1 Pro or Qwen 3.8-27B level large models for free in China without agents, Moda is currently a generous official and legitimate option, provided you are willing to complete Alibaba Cloud real-name binding and log in daily to claim Moli. |
| Evidence status | 2026-11-27 Official Moni and restriction document verification + Mainland China direct link list 200 OK |

> [!warning]
> Dynamic single concurrency limits and cannot be used as a commercial backend with high concurrency interfaces; In short-term periods, Moli will not be automatically accumulated without logging in.

- Official source: https://modelscope.cn/docs/model-service/API-Inference/intro

![Modai API-Inference Official Page: Log in to receive 200 Magic Particles and bind a real-name Alibaba Cloud account requirement](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-11-27/image-modelscope-1-8023031cad.png)

---

## NVIDIA NIM (build.nvidia.com)

🟡 ** Official 36 free development endpoints available (Mainland China direct link list 746ms) | Email registration and verification required**

| Project | Verify the content |
| --- | --- |
| Available models | 36 models labeled Free Endpoint (including kimi-k3.1-pro, Mistral Large 4, nemotron-3.5-super-vl-120b, etc.) |
| Access | OpenAI compatible; Interface direct connection to mainland China (746ms), webpage backend recommended for international network |
| Base URL | https://integrate.api.nvidia.com/v1 |
| Free type | Free developer prototype endpoint (not charged by tokens) |
| Verify authority | Email registration and verification are required to join the NVIDIA Developer Program to generate API Keys |
| Free limit | The free endpoint has a maximum rate limit of about 40 RPM, and account-level development quotas are managed by the console |
| Reset cycle | Controlled by the minute rate window |
| Expiration date | Developer testing period is valid |
| Region | International (direct connection via interface) |
| Payment/real-name thresholds | No credit card binding required |
| Privacy Policy | ⚠️ The official record clearly states that inputs and outputs are used to improve NVIDIA products and AI models |
| Verify the conclusions | Suitable for individual developers who want to try cutting-edge open-source models with very large parameters for free. You only need email verification without card binding, but note that data will be recorded. |
| Evidence status | 2026-11-27 Official Model Center verified + /v1/models tested 200 OK |

> [!warning]
> Only models labeled as Free Endpoint are free and strictly prohibited from production environments.

- Official source: https://build.nvidia.com/models

![NVIDIA Build Model Center (screens 36 models from Free Endpoint)](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-11-27/image-nvidia-1-9289d158d0.png)

---

## OVHcloud AI Endpoints (no registration, no password, no password) public interface)

🟡 ** Keyless test can be adjusted (Direct connection in mainland China 200 OK, but continuous anonymous bursts instantly hit 429 cooldown)**

| Project | Verify the content |
| --- | --- |
| Available models | Qwen3.8-27B, gpt-oss-120b, Mistral-Small-3.2-24B-Instruct-2506, bge-m3 (1024-dimensional vector), etc |
| Access | OpenAI compatible; No registration or key, direct connection to Chinese mainland (1366ms) |
| Base URL | https://oai.endpoints.kepler.ai.cloud.ovh.net/v1 |
| Free type | Publicly available password-free trial interface (strict single-IP frequency limiting) |
| Verify authority | The anonymous layer requires no registration or key; For high-frequency use, you need to register an OVH Public Cloud account to create a token |
| Free limit | Anonymous IP about 2 RPM with strict time quotas (over-limit retry_after about 2,967,537ms, approximately 49 minutes) |
| Reset cycle | Recovery by single IP cooling window |
| Expiration date | The official trial period is public |
| Region | International (European nodes, domestic direct connection available) |
| Payment/real-name thresholds | Anonymous experience with zero barriers; Official cloud accounts require EU/international payment verification |
| Privacy Policy | Public anonymous interface: Do not pass any sensitive information |
| Verify the conclusions | The Chinese mainland direct connection keyless request Qwen3.8-27B (1415ms), gpt-oss-120b (2090ms), and BGE-M3 vectors (1087ms) all successfully returned true results in the first round, immediately triggering single IP 429 cooldown. |
| Evidence status | 2026-11-27 Screenshot of official page + Local direct connection/agent no-security test |

> [!warning]
> It's only suitable for running the first demo with zero configuration when writing scripts; it absolutely can't withstand continuous dialogues or Agent loops.

- Official source: https://endpoints.ai.cloud.ovh.net/

![OVHcloud AI Endpoints Official Website (clearly marked as no sign-up required and free model card)](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-11-27/image-ovhcloud-1-ba906871f2.png)

---

## Pollinations (no registration, no passwords required, no confidentiality community interface)

🟡 ** Key-free tested and adjustable (triggers new rule: anonymous IP replete only once every 45 seconds)**

| Project | Verify the content |
| --- | --- |
| Available models | Communities like OpenAI aggregate text with basic image interfaces |
| Access | OpenAI compatible path; Direct connection to mainland China (7836–9470ms), international proxies faster (1696–3534ms) |
| Base URL | https://text.pollinations.ai/openai |
| Free type | Key-free public interface (or free registration for key increase) |
| Verify authority | Anonymous direct tune, no registration required, no key; Go to enter.pollinations.ai to register for a free key to remove the 45s limit |
| Free limit | Anonymous: Limited to 1 reply per IP every 45 seconds (overclocked returns HTTP 402 FREE_LIMIT) |
| Reset cycle | Roll recovery at 45-second intervals |
| Expiration date | The community does its best to provide |
| Region | International (domestic direct connections are slow but available) |
| Payment/real-name thresholds | No credit card required |
| Privacy Policy | Public community gateways, strictly prohibiting sending private or sensitive code |
| Verify the conclusions | Local mainland direct connections on the local device return 200 times each time twice and the first two proxy attempts with 200 successful returns. The third fast request returns HTTP 402 to clearly inform the new rule: 1 reply every 45 seconds per IP. |
| Evidence status | 2026-11-27 Dual-network password-free test on this device + official website verification |

> [!warning]
> The anonymous layer only allows slow single-sentence Q&A; high-frequency calls require obtaining a free key from the official website or switching to Groq.

- Official source: https://pollinations.ai/
- Official source: https://enter.pollinations.ai/

![Pollinations Official Homepage Entry](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-11-27/image-pollinations-1-cd029e81fe.png)

---

## SiliconFlow

🟡 ** Official L0 free policy still in effect, but existing test accounts on the local machine trigger HTTP 402 insufficient balance interception**

| Project | Verify the content |
| --- | --- |
| Available models | Qwen/Qwen2.5-7B-Instruct, Qwen/Qwen3-8B, BAAI/bge-m3, PaddlePaddle/PaddleOCR-VL-1.5, FunAudioLLM/SenseVoiceSmall |
| Access | OpenAI compatible; Chinese mainland direct connection extremely fast (142–200ms) |
| Base URL | https://api.siliconflow.cn/v1 |
| Free type | Real-name account specifies zero-price call for L0 model |
| Verify authority | Registration and real-name authentication are required with a +86 mobile number |
| Free limit | L0 free model fixed rate limiting: dialogue 1000 RPM / 50000–80000 TPM, vector 2000 RPM / 500000 TPM |
| Reset cycle | Scroll recovery by minutes and day windows |
| Expiration date | Long-term effectiveness |
| Region | Domestic (Direct Domestic Connection) |
| Payment/real-name thresholds | No credit card required, mandatory real-name verification; Note that unpaid accounts will block free models |
| Privacy Policy | Executed according to the domestic standard cloud API protocol |
| Verify the conclusions | The official documentation still states that after confirming the name, the free model consumption is zero, but the old account bound locally in this request for Qwen/Qwen2.5-7B-Instruct and PaddleOCR-VL-1.5 both returned HTTP 402 (code 30001), indicating that you cannot blindly assume that having a key will always work through it. |
| Evidence status | 2026-11-27 Screenshot of official streaming limit document + real local 402 response records |

> [!warning]
> The easiest pitfall is adding Pro/ or LoRA/ prefixes to the paid version of the same-name model, and once the bonus is deducted, it triggers a 402 issue.

- Official source: https://docs.siliconflow.cn/cn/userguide/faqs/rate-limit-and-upgradation

![Official document on Silicon Mobile: After real-name authentication, the free model call bill consumption is 0](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-11-27/image-siliconflow-1-cbf0a2373f.png)

---

## Cloudflare Workers AI

🟡 ** Official daily 10,000 Neurons free reset confirmation | Suitable for lightweight edge small models and vectors**

| Project | Verify the content |
| --- | --- |
| Available models | Workers Free is an open, lightweight, open-source model for conversation, translation, and embedding |
| Access | Cloudflare REST (with dedicated account_id) or Worker binding; Direct connection 743ms / Agent 544ms |
| Base URL | https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/{model} |
| Free type | Resets the free computing power pack daily |
| Verify authority | You need to register a Cloudflare account to obtain an Account ID and API Token |
| Free limit | A total of 10,000 Neurons are free daily (calculated by hash rate, not directly equal to the number of tokens) |
| Reset cycle | Reset is automatically reset daily at 00:00 UTC |
| Expiration date | Long-term effectiveness |
| Region | International (direct domestic connection) |
| Payment/real-name thresholds | Workers Free plan requires no card binding (no billing is generated upon exceeding limits); Some large models require card binding to upgrade Paid |
| Privacy Policy | By default, the customer inference payload is not used for model training |
| Verify the conclusions | Suitable for developers who already use Cloudflare Workers to deploy personal widgets or blog interfaces, with about a hundred short conversations per day being enough. |
| Evidence status | Screenshot of official pricing document verified on 2026-11-27 |

> [!warning]
> The interface URL structure has account_id; before connecting to the standard OpenAI client, a compatible path must be confirmed.

- Official source: https://developers.cloudflare.com/workers-ai/platform/pricing/

![Cloudflare Workers AI Official Pricing Page (10,000 Neurons Free Reset per Day)](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-11-27/image-cloudflare-1-88d47928ef.png)

---

## Cerebras Cloud (Card-free free tier has been canceled)

🟠 ** Tightening threshold: Credit card linked to receive a one-time $5 / 30-day trial**

| Project | Verify the content |
| --- | --- |
| Available models | qwen-3.8-27b (300 RPM) , gpt-oss-120b (5 RPM / 1M TPD) |
| Access | OpenAI compatible; Login is protected by reCAPTCHA and requires an international network |
| Base URL | https://api.cerebras.ai/v1 |
| Free type | A one-time 30-day trial fee for card binding |
| Verify authority | You need to register an account internationally, complete the reCAPTCHA, and link a valid payment method |
| Free limit | After card binding verification, a one-time $5 Free Trial (valid for 30 days) will be issued. |
| Reset cycle | One-time trial use, paused upon expiration or when fully used, with no monthly reset |
| Expiration date | 30 days after activation |
| Region | International (requires agent + foreign currency card) |
| Payment/real-name thresholds | ⚠️ A valid credit card/payment method must be linked to activate the trial limit |
| Privacy Policy | ✅ The official commitment is zero retention and never used for model training |
| Verify the conclusions | Although reasoning is extremely fast and privacy terms are excellent, the cancellation of the card-free free tier is no longer suitable for long-term freeloading for users without foreign currency cards in China. |
| Evidence status | 2026-11-27 Official pricing and flow limit document verification |

> [!warning]
> Don't use old guides to register empty-handed and find free keys; Fortunately, the $5 will automatically shut down once you run out, so if you don't buy PayGo, you won't be charged back.

- Official source: https://www.cerebras.ai/pricing
- Official source: https://inference-docs.cerebras.ai/support/rate-limits

![Cerebras Official Rate Limits and Tiers Documentation](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-11-27/image-cerebras-1-6e36af8e4a.png)

---

## Mistral AI La Plateforme (free API discontinued)

🔴 ** Pitfall Warning: The original free Experiment API has been canceled, creating an API Key requires a linked card to pay **

| Project | Verify the content |
| --- | --- |
| Available models | No free API model (Free mode is only available on the web Vibe / Studio trial) |
| Access | OpenAI compatible; Requires international network and mandatory billing activation |
| Base URL | https://api.mistral.ai/v1 |
| Free type | No free API layer anymore |
| Verify authority | After registering an account, to create an API Key, you must first activate Billing and link your credit card |
| Free limit | API side: 0 free quota (all paid as you go) |
| Reset cycle | Not applicable |
| Expiration date | Free API has been canceled |
| Region | International |
| Payment/real-name thresholds | 🔴 Only when payment methods are bound and pay-as-you-go is enabled are API keys allowed |
| Privacy Policy | Free/Pro is enabled by default for training improvements, but you need to manually opt-out it off in the settings |
| Verify the conclusions | A large number of old freebie lists list Mistral / Codestral as a card-free god site. This verification of official documentation confirms that Free mode has completely removed API permissions. |
| Evidence status | Official Usage and Limits document screenshot from 2026-11-27 |

> [!warning]
> Once linked to a card, you are charged with real money and usage, no longer considered free purchases.

- Official source: https://docs.mistral.ai/admin/billing-usage/usage-limits

![The official Mistral documentation clearly states: Free mode does not include API access permissions; creating a key requires activation and billing](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-11-27/image-mistral-1-24a872ebfc.png)

---

## Hugging Face Inference Providers (monthly gift cancelled)

🔴 ** Pitfall Warning: Free users' monthly limit has been reset to zero (None), old $0.10/month no longer valid **

| Project | Verify the content |
| --- | --- |
| Available models | No free inference management quota |
| Access | Compatible with OpenAI; Requires international network and requires top-up or PRO subscription |
| Base URL | https://router.huggingface.co/v1 |
| Free type | The monthly free account bonus has been canceled |
| Verify authority | Free account registration no longer has deduction bonuses; you need to buy credits or upgrade to PRO ($9/month). |
| Free limit | Free Users monthly gift limit = None |
| Reset cycle | None |
| Expiration date | The free tier has been discontinued |
| Region | International |
| Payment/real-name thresholds | 🔴 A top-up or paid subscription is required to call the managed inference API |
| Privacy Policy | Implemented according to specific downstream reasoning clauses |
| Verify the conclusions | Browsing Spaces Demo on the web is still free, but the way to use free HF Tokens to tune router.huggingface.co has been completely blocked. |
| Evidence status | Screenshot verified on the official Pricing page on 2026-11-27 |

> [!warning]
> If the old script is continuously adjusted, it will directly report insufficient quotas.

- Official source: https://huggingface.co/docs/inference-providers/pricing

![Hugging Face Official Pricing Page: Free Users monthly limit clearly set to None](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-11-27/image-huggingface-1-28dd00a429.png)

---

## GitHub Models (independent free inference API retired)

🔴 ** Retired: Local device holding valid GitHub Token confirmed after retesting, no longer returning to large model completion **

| Project | Verify the content |
| --- | --- |
| Available models | Independent API has been discontinued (only Copilot within the editor is retained) |
| Access | Discontinued |
| Base URL | https://models.github.ai/inference |
| Free type | Retiring |
| Verify authority | The original GitHub PAT card-free GPT-4 interface was retired on 2026-07-30 |
| Free limit | None |
| Reset cycle | None |
| Expiration date | It was retired on 2026-07-30 |
| Region | International |
| Payment/real-name thresholds | Not applicable |
| Privacy Policy | Not applicable |
| Verify the conclusions | Local test requests /catalog/models only return 4-byte empty arrays, POST inference only returns 2-byte plain text OK instead of dialogue JSON, fully confirming the fact of retirement. |
| Evidence status | 2026-11-27 Official retirement notes + Actual test verification of the GITHUB_TOKEN of this machine |

> [!warning]
> If you see outdated articles still teaching GitHub Token to get the GPT-4 API for free, you can just swipe away.

- Official source: https://docs.github.com/en/github-models
- Official source: https://hyphentech.top/free-ai-api-radar-2026-09-23/

![HyphenTech official website Radar archive from September 23](https://hyphentech.top/obsidian-assets/free-ai-api-radar-2026-11-27/image-github-models-1-a6a04a3f54.png)

---

## Important reminder

- OpenRouter currently has 10 zero-cost text models, 100% single-vendor bearer: gemma-4-26b-a4b-it:free. Tested results trigger 429 on the second consecutive request. Recraft Free Raw Image will be removed on 2026-11-28. Do not bind to a single point.
- Although Silicon Mobile retains the L0 free model, tests show that old local accounts return HTTP 402 (code 30001 balance is insufficient), and models with Pro/ or LoRA/ prefixes will be charged. You must verify your real name and wallet status before use.
- Code and privacy red lines: Google AI Studio free tier, NVIDIA NIM free endpoints, and most OpenRouter:free nodes explicitly record inputs and outputs to improve products; For company code or keys, please use the default untrained Zhipu API or directly deploy locally to Ollama / LocalBrain.

## My access priority

- First priority (balancing speed and tool calls, requires international network + email/Google card-free registration): Groq + Google Gemini 3.5 Flash-Lite.
- Second priority (domestic direct connection with zero agent, requires +86 mobile number + real-name authentication): Zhipu GLM-4.7-Flash + Moda Daily Magic Chip Pool.
- Third priority (ultra-long context supplement, requires card-free registration + automatic fault-tolerant routing): OpenRouter on-the-shelf zero-price model (downgraded via HyphenBox automatic cooling).
- Fourth choice (zero-bill absolute privacy ultimate safety net): M5 Pro / local computer running Ollama, MLX, and LocalBrain.

> [!summary] Final conclusion
> By the end of November 2026, the free API has left the era of "copying any old tutorial and unlimited play": the long-term card-free staple is concentrated on Groq, Gemini Flash-Lite, OpenRouter selected in-shelf models (requires international network), as well as Zhipu Flash and Moda Moli (domestic direct connection requires phone real-name registration). Leaving the main stable and downgrade backup to HyphenBox to take over, while leaving sensitive and heavy tasks to the local open-source model, is the most worry-free and cost-free combination at year-end.


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

---

> [!quote] HyphenTech
> **Make AI your superpower**
> Local deployment · Free resources · Self-made software
> [HyphenTech](https://hyphentech.top)
