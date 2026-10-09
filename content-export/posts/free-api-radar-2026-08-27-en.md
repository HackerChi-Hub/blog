---
title: "Summary: Free/Free Large Model APIs: GLM-5.3-Flash, Qwen3.8, Coding GLM"
slug: free-api-radar-2026-08-27-en
status: published
lang: en
translation_of: free-api-radar-2026-08-27
translation_source: machine
source_sha256: bf8a059aec5acb16
date: 2026-08-27
updated: 2026-10-03
summary: "Free interface review of GLM-5.3-Flash, Qwen3.8, and Coding GLM: whether they work, how to connect, and the limits and privacy risks all at once."
categories:
  - Resources
tags:
  - AI
  - Free resources
cover: https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/cover-8d988a58de.jpg
brand_slogan: 
legacy_paths: []

---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/free-api-radar-2026-08-27/) is authoritative.

> [!note]
> This article was first published on the HyphenTech official WeChat account

## 2026-08-27 Free/Free Large Model API Summary: GLM-5.3-Flash, Qwen3.8, Coding GLM

> Special Topic Date: 2026-08-27 · Second Review: 2026-08-28

> [!note]
> HyphenTech

---

> [!note]
> To sum up: it works, but you can only use test resources first; don't include private data. Free deals and limited-time events change quickly, so you must re-check the model page, account console, and actual billing before connecting.

> [!note]
> This is a snapshot from the 2026-08-27 special event, and a second review was done on 2026-08-28: B.AI's two 0 Credits still have official page confirmation; AIHubMix's free total page and single-model page limit standards are inconsistent; Empero is undergoing maintenance switching; TokenRouter has appeared on the Qwen 3.8 Max free model page; HiLinkup's current public model directory does not list GLM-5.3-Flash.

### ▍One-sentence recommendation

- To quickly integrate tools like Cursor, Cline, and Claude Code: first look at B.AI and AIHubMix; Both have verifiable official model pages or free model pages.

- Want to get Qwen3.8 free entry: TokenRouter already has the official model page for qwen/qwen3.8-max-free; TokenHarbor's free version explicitly includes Qwen3.8 27B.

- Empero was originally the easiest to access, but as of 2026-08-28, the official page shows maintenance switching is underway. Don't use it as the currently available entry until it's restored.

---

### ▍Quick verification and quick check

| Platform | Currently verified |
| --- | --- |
| B.AI | Currently 0 Credits, limited-time event |
| AIHubMix | Free models, public page limits conflict |
| TokenRouter | The free model page has been confirmed, and the quota is to be verified upon login |
| TokenHarbor | The free tier has a rotational quota |
| Empero | Switch the current maintenance and test again after recovery |
| Cline | Rotate free event confirmation; specific GLM activities require login for verification |
| HiLinkup | GLM-5.3-Flash has not been confirmed in the current public directory |

※ Topic date: 2026-08-27; status reviewed on 2026-08-28

> [!note]
> This article only includes free or limited-time access points publicly provided by the service provider. Leaked private keys, shared accounts of unknown sources, rotating key pools, quota circumvention transfer stations, fraudulent or forged regional quotas obtained will not be included, tested, or forwarded.

---

---

### ▍B.AI

**Currently 0 Credits, Limited-Time Event**

| Project | Verify the content |
| --- | --- |
| Available models | GLM-5.3-Flash, Qwen3.8-Flash |
| Access | After registration, use via B.AI API or Chat; Final settlement is subject to platform display and billing records. |
| Base URL | Please refer to the current access instructions on the B.AI console |
| Verify the conclusion | Both the official model page and the Promotions page clearly state: the APIs of both models currently settle at 0 Credits, with no fees for input, cache write, cache read, or output tokens; The standard reference price will be restored after the event ends. |
| Evidence status | The official page currently confirms |

> [!note]
> This is a limited-time event, not a permanent zero price. The start time for Chat free is still based on the actual launch of the model.

- Official source: https://docs.b.ai/llmservice/models/glm-5-3-flash/

- Official source: https://docs.b.ai/llmservice/models/qwen3-8-flash/

- Official source: https://docs.b.ai/llmservice/promotions-and-pricing-notices/

![# B.AI Official event page: GLM-5.3-Flash and Qwen3.8-Flash current API settle at 0 credits · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-01-6c0ea50936.png)

![# B.AI Official event page: Qwen3.8-Flash API currently settles at 0 credits · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-02-45b845220c.png)

---

---

### ▍AIHubMix

**Free model, public page limit conflict**

| Project | Verify the content |
| --- | --- |
| Available models | coding-glm-5.3-free, coding-glm-5.3-flash-free |
| Access | The base URL is https://aihubmix.com/v1; You need to register and create your own API Key. |
| Base URL | https://aihubmix.com/v1 |
| Verify the conclusion | Both single-model pages list input, output, and cache reads as $0 per million tokens, and provide examples of OpenAI-compatible calls. |
| Evidence status | The official page confirms this, but the quota conflicts with the caliber |

> [!note]
> Single model pages say 5 times per minute, 500 times per day, and 1 million tokens per day; The free page updated on 2026-08-27 states 10 shared trials before recharging, and after recharging at least $1, sharing 10 times per minute, 100 times per day, and 1 million tokens per day. The two pages conflict in scope; before accessing, refer to the account console.

- Official source: https://aihubmix.com/model/coding-glm-5.3-free

- Official source: https://aihubmix.com/model/coding-glm-5.3-flash-free

- Official source: https://aihubmix.com/models/free

![# AIHubMix Single Model Page: Coding GLM 5.3 Flash Free Model and Zero-Price Information · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-03-c5f85b2feb.png)

![# AIHubMix Free Model Homepage: Shared Daily Quota Rules After Trial and Recharge · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-04-14cad48474.png)

---

---

### ▍TokenRouter

**Free model page confirmed, quota to be verified upon login**

| Project | Verify the content |
| --- | --- |
| Available models | qwen/qwen3.8-max-free |
| Access | Unified model gateways compatible with OpenAI, Claude, and Gemini; Official model page examples use https://api.tokenrouter.com/v1. |
| Base URL | https://api.tokenrouter.com/v1 |
| Verify the conclusion | The official model page lists qwen/qwen3.8-max-free, with input and output prices marked at $0 per million tokens, supporting OpenAI-compatible chat/completions. |
| Evidence status | The official model page is currently confirmed |

> [!note]
> The official page also reminds that free computing power is limited, and service stability and concurrency are not guaranteed; The public model page also does not provide long-term committed call counts or token quotas, which still require verification via the console.

- Official source: https://www.tokenrouter.com/models/qwen/qwen3.8-max-free/

- Official source: https://www.tokenrouter.com/

![# TokenRouter official model page: Qwen3.8 Max free model input/output price is 0 · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-05-deaace89a5.png)

---

---

### ▍TokenHarbor

**Free Tier with Rotation Quota**

| Project | Verify the content |
| --- | --- |
| Available models | The free package includes Qwen 3.8 27B, DeepSeek V4 Flash, MiMo V2.5; GLM 5.3 Flash is an Agent Pass |
| Access | An OpenAI-compatible API; Free version requires no credit card. |
| Base URL | Subject to the TokenHarbor console access information |
| Verify the conclusion | The official pricing page confirms Free is $0 per month, including free monthly allowance and rotating model lineups; Qwen3.8 27B is included in the free tier. |
| Evidence status | The official pricing page is currently confirmed |

> [!note]
> GLM 5.3 Flash appears in the Agent Pass addition model, where the Free file is clearly marked as not included and cannot be written as the Free file.

- Official source: https://tokenharbor.ai/pricing

![# TokenHarbor Official Pricing Page: Qwen 3.8 27B is in the free tier, GLM 5.3 Flash belongs to Agent Pass · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-06-12098b97f8.png)

![# TokenHarbor official pricing page model tier: GLM 5.3 Flash not in Free mode · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-07-554be834e4.png)

---

---

### ▍Empero

**Switch under current maintenance, test again after restoration**

| Project | Verify the content |
| --- | --- |
| Available models | The official page shows GLM 5.3 Flash and states that a free endpoint for Qwen3.8-Flash-Next is being prepared |
| Access | The historical public access is https://free.empero.org/v1; The original page description says OpenAI-compatible, and any key is available. |
| Base URL | https://free.empero.org/v1 |
| Verify the conclusion | On 2026-08-28, the official page showed MAINTENANCE and was switching free endpoints. API requests returned structured maintenance errors. Currently, it can no longer be written as the most convenient available entry point. |
| Evidence status | The official page is currently under maintenance; Privacy disclosures come from previous official pages |

> [!note]
> Previously, the official page clearly stated that prompts and completions would be recorded together with hashed IPs to improve open-source models. Even if restored, it would only be suitable for public code, testing, and prompt regression, not for accounts, keys, customer data, or private repositories.

- Official source: https://free.empero.org/

- Official source: https://free.empero.org/v1

![# Empero Official Page: Free Endpoint Maintenance Switch · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-08-c74575f8a1.png)

---

---

### ▍Cline

**Rotation of free event confirmation; specific GLM activities require login for review**

| Project | Verify the content |
| --- | --- |
| Available models | Official social media once claimed that GLM-5.3 Flash on Cline was free, but the official website did not provide details about the stable campaign |
| Access | Cline supports built-in keys, built-in endpoints, and any OpenAI-compatible API. |
| Base URL | Provided by the selected upstream service, not Cline's own fixed free gateway |
| Verify the conclusion | Cline's official documentation confirms that it will rotate to provide limited-time free models, and any Cline account can use models currently labeled as FREE; It also supports any OpenAI-compatible endpoint. |
| Evidence status | Official documentation confirms the rotation of free activities and access capabilities; Specific GLM activities require login verification |

> [!note]
> Public documentation does not specify the current free model, so "GLM-5.3 Flash free in Cline" should still be based on the IDE or CLI model selector after login.

- Official source: https://cline.bot/

- Official source: https://docs.cline.bot/provider-config/openai-compatible

- Official source: https://docs.cline.bot/getting-started/free-models

![# Cline Official Documentation: Supports custom OpenAI-compatible API endpoint · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-09-6007e52e87.png)

![# Cline Official Documentation: Free models available on a rotating and limited-time basis · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-10-97dc567a40.png)

---

---

### ▍HiLinkup

**GLM-5.3-Flash not confirmed in the currently public directory**

| Project | Verify the content |
| --- | --- |
| Available models | GLM-5.3 is currently available in the public directory, but GLM-5.3-Flash is not listed |
| Access | System upgrade announcements require the use of the new address https://api.hilinkup.com and the channel/model ID format. |
| Base URL | https://api.hilinkup.com |
| Verify the conclusion | Model routing https://hilinkup.com/models/glm-5-3-flash currently only returns the general SPA page; On 2026-08-28, the official public/models directory was read but GLM-5.3-Flash was not found. |
| Evidence status | The official public catalog has not been confirmed |

> [!note]
> "Limited-time free from 2026-08-27 to 2026-09-02" lacks an official event page that can be reliably opened and will not be marked as a confirmed offer.

- Official source: https://hilinkup.com/models/glm-5-3-flash

- Official source: https://hilinkup.com/api/v1/public/models

- Official source: https://hilinkup.com/api/v1/public/announcements

---

---

### ▍Key Reminder

- Free doesn't mean it's suitable for privacy: Empero has clearly stated that it records prompts, replies, and hashed IPs; It's only used for non-privacy testing.

- AIHubMix's limits should be viewed by page: if the single-model page and the free main page currently conflict, check the account console before actually calling it.

- Don't miswrite GLM as free on TokenHarbor: the free version has Qwen3.8 27B, GLM 5.3 Flash is available on Agent Pass.

- TokenRouter's free model page has been launched, but the free quota figures have yet to be disclosed; HiLinkup still lacks evidence of stable activity.

---

### ▍My access priority

- Connect with Cursor, Claude Code, or OpenAI-compatible Agent: prioritize B.AI and AIHubMix.

- Find the free entry for Qwen3.8: First, check out TokenRouter's qwen/qwen3.8-max-free, then check out TokenHarbor's Qwen3.8 27B free allowance.

- If you want to use Empero: wait until maintenance is over before sending the minimum real request; Never transfer privacy at any time.

- Long-term stable project management: Don't just focus on zero price; focus on verifying privacy policies, traffic limits, failure rates, commercial terms, and production licenses.

---

> [!note]
> Final conclusion
> 
> This wave of free models can be exploited, but they should be used as testing resources rather than production infrastructure. Currently, the most worthwhile to try are B.AI's 0 Credits GLM/Qwen and AIHubMix's Coding GLM free model; TokenRouter already has a Qwen 3.8 Max free model page; TokenHarbor is suitable for Qwen 3.8 27B free allowance; Empero is waiting for maintenance and restoration; HiLinkup's GLM-5.3-Flash free access still requires confirmation from the official event page or console login.


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
