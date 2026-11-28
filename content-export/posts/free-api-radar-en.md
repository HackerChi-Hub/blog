---
title: "Completely free, completely free, the most comprehensive collection of free AI APIs on the entire internet"
slug: free-api-radar-en
status: published
lang: en
translation_of: free-api-radar
translation_source: machine
source_sha256: 78cc4507fb79905d
date: 2026-08-23
updated: 2026-11-28
summary: "Full retesting at the end of November 2026: a list of free large model APIs that can be directly called, a full list of local network and real-name registration/card binding conditions"
categories:
  - Resources
tags:
  - AI
  - Free resources
cover: "https://hyphentech.top/obsidian-assets/free-api-radar/cover-3e17fed5b8.jpg"
brand_slogan: 
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/free-api-radar/) is authoritative.

> [!important]
> **2026-11-27 Full retest and major reshuffle update after 2 months** · HyphenTech　| This time, I ran **Chinese mainland direct connection vs. international network proxy** dual-perspective real requests on Mac locally, and checked each case one by one whether registration is required, whether `+86` phone number and real-name authentication are required, whether credit card binding is mandatory, and whether the free tier uses data for training**. The latest data has been synchronized and issued to [Download and update: HyphenBox (GitHub release page)](https://github.com/HackerChi-Hub/hyphenbox-release/releases) `2026.11.28.2` directory.

> [!note]
> This table only includes official free quotas issued to ordinary developers and publicly available password-free interfaces. Leaked private keys, shared accounts of unknown origin, and black-and-gray currency relay sites circumventing quotas are strictly not included, tested, or forwarded.

## 1. Actual test red-black total table at the end of November 2026 (first check local usage conditions)

　　The free API community for these two months underwent a major reshuffle: **Mistral canceled the free Experiment API (mandatory card binding and billing)**, **Hugging Face free user monthly bonus reset (`None`)**, **Cerebras canceled the cardless free tier and replaced it with a one-time $5 trial card for a foreign currency card**; even **OpenRouter's site-wide 477 models only have 10 zero-cost text conversation variants (all 100% single-vendor carrier)**. Before choosing a platform, first look at the **network conditions** and **registration threshold** in the table below. Matching them saves the most time:

| Platform | Current rating | Free type | Local network conditions (local test) | Registration / real-name / card binding thresholds | Core Tested Conclusions for This Issue (2026-11-27) |
| --- | --- | --- | --- | --- | --- |
| **Groq** | 🟢 Main force is stable and effective | Perpetual free tier | **International network required** (proxy 409–1125ms) | Register via email/Google/GitHub, **no phone real-name or credit card required** | `qwen/qwen3.8-27b` and `openai/gpt-oss-120b` 4 consecutive conversations with all `200 OK`, currently the fastest and most stable overseas |
| **Google Gemini API** | 🟢 Main force is stable and effective | Perpetual free tier | **International network required** (supports regional exports) | One-click key creation for Google account, **Free tier no credit card required** | `gemini-3.5-flash-lite` (621–1387ms) and `gemini-embedding-2` both 4/4 pass; `3.6-flash` Peak Easy `503`; `Gemini 4 Carbon/Neon` Paid only; **Free tier data used to improve the product** |
| **BigModel** | 🟢 The top choice domestically | Permanent free model + new subscriber credit | **Domestic Direct Connection Ultra-Fast ** (137ms) | **`+86` Mobile number SMS + domestic real-name authentication**, no credit card required | `GLM-4.7-Flash` (200K context), `GLM-4.6V-Flash`, `CogView-3-Flash` permanently free, new users receive an additional 20 million tokens, **not used by default** |
| **ModelScope** | 🟢 Domestic large cup | Claim "Magic Pellets" daily for exchange | **Domestic Direct Connection Extremely Fast** (84ms) | **`+86` Mobile number + verified email + bound to a real-name Alibaba Cloud account** | Log in daily to receive 200+50 short-term Magic Particles (about 125–500 times/day), and can freely adjust large parameter models like `Kimi-K3.1-Pro` and `Qwen3.8-27B` |
| **OpenRouter** | 🟢 Selected for use | Specify `:free` zero-valence variant | **Direct domestic connection available** (1377ms, agent 806ms is more stable) | Register via email/Google/GitHub, **no credit card required** (no negative balance allowed) | Only **10 zero-cost text models** remain on the entire site, all carried by single vendors; `nvidia/nemotron-3-ultra-550b-a55b:free` Passed on 4/4, `gemma-4:free` Instant Release `429`, Multiple Previous Month's Old `:free` Already `404` Removed |
| **NVIDIA NIM** | 🟡 Development alternatives | 36 free development endpoints | **Direct interface connection** (746ms, console recommended for international network) | Email registration verifies NVIDIA developer account, **credit card required** | 36 `Free Endpoint` (including `kimi-k3.1-pro`, `nemotron-3.5`) not charged by token, up to 40 RPM; **Input/output will be recorded with improved models** |
| **OVHcloud AI Endpoints** | 🟡 and to avoid secret responses in emergencies | Registration-free, key-free public interface | **Direct domestic connection available** (1366ms) | **Completely no registration, no key, no card** | The passwordless initial tune `Qwen3.8-27B` (1415ms) and `bge-m3` vector (1087ms) both reach `200 OK`, but anonymous continuous bursts trigger a single IP `429` cooldown of about 49 minutes |
| **Pollinations** | 🟡 avoiding secrets and slow speed | Keyless public interface | **Domestic Direct Connection Slow** (7.8s, Agent 1.7s) | **Anonymous, No Registration, No Key** (Register for free, Key can be increased) | Password-free password can be set but with a new rule: **Anonymous only 1 reply per IP every 45 seconds**, overclocking returns immediately `HTTP 402 FREE_LIMIT` |
| **SiliconFlow** | 🟡 Reconcile accounts | Real-name specification L0 zero-price model | **Domestic Direct Connection Extremely Fast** (142–200ms) | **`+86` Mobile number + domestic real-name authentication**, no credit card required | The official L0 free tier is still available (`Qwen2.5-7B`, `bge-m3`, etc.), but the old account on this device showed a balance status of `HTTP 402/30001`, and mistakenly adding the `Pro/` prefix would deduct the fee |
| **Cloudflare Workers AI** | 🟡 Lightweight edges | 10,000 Neurons a day | **Direct connection available** (743ms, agent 544ms) | Register with Cloudflare to get your Account ID and token, **Free plan card-free** | Daily `00:00 UTC` automatic recovery `10,000 Neurons`, stops immediately beyond limits with no charges, suitable for running small models or vectors along the way |
| **Alibaba Cloud Bailian / Baidu Qianfan** | 🟠 New user experience | One-time newcomer trial bonus | **Domestic Direct Connection Extremely Fast** (66–123ms) | **Domestic Mobile Number + Real-Name Authentication** | Receive about 1 million tokens per model (valid for 90 days, no reset after use); **Real-name accounts must manually enable "stop when used" anti-reverse exploitation** |
| **Cerebras** | 🟠 The threshold has tightened | Bundle card one-time trial of \$5 | **International network required** (including reCAPTCHA) | **Mandatory binding of a valid foreign currency credit card** | The free tier without binding cards has been canceled; after card binding, only a one-time fee of \$5 (valid for 30 days) |
| **Mistral AI** | 🔴 Falling into a pitfall to discourage you | The free API has been canceled | International networks are required | **Create API Key to Force Card Binding and Enable Pay-As-Usage Billing** | Official documentation confirms `Free mode` Includes only Web Studio, **no longer includes any free API permissions** |
| **Hugging Face Router** | 🔴 Falling into a pitfall to discourage you | The monthly bonus limit has been canceled | International networks are required | **Must recharge to buy credits or subscribe to PRO** | Official pricing list confirms `Free Users` monthly bonus amount of `None` (0 USD) |
| **GitHub Models** | 🔴 Retiring | Service has gone offline | Not applicable | The original free inference API has been retired | This device holds valid `GITHUB_TOKEN` Tests confirm the directory is empty and no longer returns large model dialogue results |

---

## 2. Details of Access and Pitfall Avoidance on the Main Stable Platform

### 1. Groq (King of Overseas Speed · No card binding required)

　　As long as you have an international network locally, Groq remains the most straightforward free mainstay right now. You can register with email, Google, or GitHub to get a key directly—no need to link a credit card. This period, four consecutive local requests `qwen/qwen3.8-27b` (including Chinese multi-segment backup plan generation) all returned within **409ms–1125ms**, `openai/gpt-oss-120b` also ran within **643ms**, and the official free limit remained at **30 RPM / 1,000 RPD / 8,000 TPM**.

```python
from openai import OpenAI

client = OpenAI(api_key="<GROQ_API_KEY>", base_url="https://api.groq.com/openai/v1")
resp = client.chat.completions.create(
    model="qwen/qwen3.8-27b",
    messages=[{"role": "user", "content": "用三句话讲清本地备份原则"}],
)
print(resp.choices[0].message.content)
```

![Groq Official Rate Limiting Documentation · 2026-11-27](https://hyphentech.top/obsidian-assets/free-api-radar/groq-rate-limits-20261127.png)

### 2. Google Gemini API (Identify Flash-Lite and Embedding 2 · Please note the privacy policy)

　　After Google launched the `Gemini 4` series in November, flagship models `Gemini 4 Carbon / Argon / Neon` were all locked in the paid tier, while the free tier was reserved for the `Gemini 4 Hydrogen` limited stream and models like **`gemini-3.5-flash-lite`** and **`gemini-embedding-2`**. In this issue's tests, both `gemini-3.5-flash-lite` and `gemini-embedding-2` passed 4 times in full green (621–1387ms), while `gemini-3.6-flash` and `gemma-4-31b-it` repeatedly hit `HTTP 503 High Demand` during the evening rush hour. Also, note: **AI Studio's free tier uses input/output by default to improve Google products**; write company proprietary code and don't push it to the free tier.

![Google Gemini API Official Pricing and Free Tier Privacy Statement · 2026-11-27](https://hyphentech.top/obsidian-assets/free-api-radar/gemini-pricing-20261127.png)

### 3. Zhipu Big Model & Moda ModelScope (Direct domestic connection, no agent, double insurance)

　　For domestic developers who don't want to use international network proxies, prioritize these two reputable companies (both require **`+86` mobile number verification code + domestic real-name authentication**, neither requires a credit card):

- **Zhipu Open Platform ([View Zhipu Free Model Documentation](https://docs.bigmodel.cn/cn/guide/models/free/glm-4.7-flash))**: The permanent free main force has been upgraded from offline `GLM-4.5-Flash` / `GLM-Z1-Flash` to **`GLM-4.7-Flash` (30B parameters, 200K context, supports tool calls and deep thinking)** and multimodal **`GLM-4.6V-Flash`**. Direct connection latency in mainland China is about **137ms**, and the protocol clearly states **by default no user API data is used for model training**. Be careful not to write the paid `GLM-5.3-Flash` or `GLM-5.4` in the name.
- **Moda Community API-Inference ([View Moda API-Inference documentation](https://modelscope.cn/docs/model-service/API-Inference/intro))**: After binding a real-name Alibaba Cloud account, log in daily to receive **200+50 short-term Magic Grains** (approximately 125–500 free daily calls**), directly use OpenAI-compatible formats like `Kimi-K3.1-Pro`, `Qwen3.8-27B`, etc., with a direct connection time of only **84ms** in mainland China.

![Zhipu GLM-4.7-Flash Free Model Parameter Page · 2026-11-27](https://hyphentech.top/obsidian-assets/free-api-radar/zhipu-free-glm47-20261127.png)

![Magic Collaboration API-Inference Explanation of Real-Name Binding between Magic Chip System and Alibaba Cloud · 2026-11-27](https://hyphentech.top/obsidian-assets/free-api-radar/modelscope-magicube-20261127.png)

### 4. OpenRouter (Only 10 zero-cost text models left on the entire site · Must prevent single-point traffic limiting and removal)

　　Compared to the 22 zero-cost models in August, on November 27, 2026, only 10 zero-cost text dialogue variants** remain among the site-wide `/api/v1/models` **477 models** (plus a few non-text entries like `Recraft` raw images soon to be removed from `11月28日`), and **all 10 text models are hosted by a single upstream vendor (`eps=1`)**. In this issue's real-world test, `nvidia/nemotron-3-ultra-550b-a55b:free` (1M context) completed all 4 consecutive tasks with `200 OK`, but `google/gemma-4-26b-a4b-it:free` repeatedly bounced `429` on the second attempt, and `nemotron-3-super-120b:free` that was still usable last month has already been converted to paid `404`.

```python
from openai import OpenAI

client = OpenAI(api_key="<OPENROUTER_KEY>", base_url="https://openrouter.ai/api/v1")
resp = client.chat.completions.create(
    model="nvidia/nemotron-3-ultra-550b-a55b:free",
    messages=[{"role": "user", "content": "你好"}],
)
print(resp.choices[0].message.content)
```

![OpenRouter zero-price model list real photo · 2026-11-27](https://hyphentech.top/obsidian-assets/free-api-radar/openrouter-free-models-20261127.png)

---

## 3. Zero registration password-free interface and demining evidence of the canceled free tier

### 1. No registration, no key, no emergency dual ports: OVHcloud and Pollinations

- **OVHcloud AI Endpoints([Check official directory: OVHcloud AI Endpoints](https://endpoints.ai.cloud.ovh.net/), interface base address `/v1`)**: Truly no account setup required, direct connection to Chinese mainland **1366ms** works. This device requires no key for testing `Qwen3.8-27B` and `bge-m3` (1024-dimensional vectors) with direct results in the first round `200 OK`, but anonymous single IPs repeatedly burst for 2–3 times and then returned `HTTP 429 API rate limit exceeded` (cooldown about 49 minutes), suitable only for temporary single-test connectivity.
- **Pollinations([View official documentation: Pollinations](https://pollinations.ai/))**: Also allows direct connection without registration or key, but at the end of November, the anonymous layer speed limit was tightened to **single IP maximum 1 reply per 45 seconds**, and the third consecutive post returns `HTTP 402 FREE_LIMIT` (Go to [to apply for a free key: Pollinations console](https://enter.pollinations.ai/) to get a free key to increase your quota).

![OVHcloud AI Endpoints Public Interface Page Without Registration · 2026-11-27](https://hyphentech.top/obsidian-assets/free-api-radar/ovh-ai-endpoints-20261127.png)

### 2. The free APIs of the three major Old God sites are now a thing of the past (stop wasting your time registering)

- **Mistral AI**: Official [See Mistral usage and limit documentation](https://docs.mistral.ai/admin/billing-usage/usage-limits) Already written down `Free mode` No API access permissions; creating an API key requires card binding and activation for pay-as-you-go billing.
- **Hugging Face Inference Providers**: Official [Check the Hugging Face Inference pricing page](https://huggingface.co/docs/inference-providers/pricing) Specifies `Free Users` The monthly bonus limit is `None`.
- **Silicon-based Mobile Old Account 402 Reminder**: Official [Check the Silicon-based Mobile Flow Limit Document](https://docs.siliconflow.cn/cn/userguide/faqs/rate-limit-and-upgradation) The real-name free L0 model is still retained, but if the account balance status is abnormal or the `Pro/` prefix model with the same name is misselected, it will return `HTTP 402 / 30001`.

![Mistral official documentation clearly states that Free mode does not include API permissions · 2026-11-27](https://hyphentech.top/obsidian-assets/free-api-radar/mistral-no-free-api-20261127.png)

![Hugging Face official pricing page Free Users monthly limit is none · 2026-11-27](https://hyphentech.top/obsidian-assets/free-api-radar/hf-inference-pricing-20261127.png)

---

## 4. Secure the stable route with one click in "HyphenBox" and local backup

　　Since a single free interface can change rules, limit traffic `429`, or remove old models at any time, the safest approach is not to hardcode any one free model in your business code:

1. **Free Cloud Aggregation Route**: Open [Download and update: HyphenBox (GitHub release page)](https://github.com/HackerChi-Hub/hyphenbox-release/releases)(`v1.0.7` The client supports automatically receiving the latest directory of the **`2026.11.27.1`** issued for this issue, no need to reinstall software). Leave your own Groq, Gemini, Zhipu, or OpenRouter Key in your local keychain to expose a unified local OpenAI-compatible gateway. If you encounter a certain `429` automatic cooling and spare tire;
2. **Local offline multimodal and large model backing**: Involving proprietary code, voice transcription, and image and video generation that absolutely cannot be uploaded to the cloud, directly supported [Download and update: LocalBrain (GitHub release page)](https://github.com/HackerChi-Hub/localbrain-releases/releases) Runs offline with native Ollama / MLX, with no API bills at all.


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
