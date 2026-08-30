---
title: 完全免费，彻底白嫖，全网最全免费AI API大合集
slug: free-api-radar
status: published
date: 2026-08-23
updated: 2026-08-23
summary: 能直接调用的免费接口、特色与限制
categories:
  - 资源分享
tags:
  - AI
  - 免费白嫖
cover: https://hyphentech.top/obsidian-assets/free-api-radar/cover-3e17fed5b8.jpg
legacy_paths: []
notion_id: 3c599968-1bdb-818d-b0ba-f5709e68041f
---

> [!note]
> 最后复测：2026-08-23 · 黑粉科技　|　逐家请求官方文档页与接口，截图锚定在免费额度证据处；拿不到硬数字的一律标注需控制台查看，不编造。

> [!note]
> 本表只收录官方面向普通用户发放的免费额度。泄露的私人密钥、来源不明的共享账户、绕额度中转站、盗刷或伪造地区取得的额度，一律不收录、不测试、不转发。

### **📋 速查表**

| 服务 | 免费类型 | 额度要点 | 国内直连 |
| --- | --- | --- | --- |
| OpenRouter | 周期性免费层 | 带 :free 后缀的模型：20 次/分钟 + 50 次/天；累计充值满 10 credits 后日限升到 1000 次（RPM 仍为 20） | 需代理 |
| 硅基流动 SiliconFlow | 周期性免费层 | 免费模型限速为固定值：语言模型 RPM 1000–10000、TPM 50000–5000000；向量模型 RPM 2000–10000、TPM 500000–10000000；重排序 RPM 2000、TPM 5000 | 直连可用 |
| 智谱 BigModel | 周期性免费层 | 标注为「免费模型」的型号免费调用；具体限速需在控制台查看（官方文档未给统一数字） | 直连可用 |
| 魔搭 ModelScope | 周期性免费层 | 面向注册用户免费提供，具体额度以官方「使用限制说明」为准 | 直连可用 |
| Groq | 周期性免费层 | 免费层按模型逐个给额度：RPM 10–30、RPD 100–14,400、TPM 1.2K–70K、TPD 3.6K–500K | 需代理 |
| Cloudflare Workers AI | 每日重置 | 每天 10,000 Neurons 免费 | 需代理 |
| Agnes AI | 周期性免费层 | 免费额度按计划限频；视频接口约 2 次/分钟 | Mac 直连可用；部分网络环境下域名被墙，需配代理 |
| Hugging Face Inference Providers | 每月赠额 | 免费用户每月 $0.10 额度；PRO 用户每月 $2.00；Team/Enterprise 每席位 $2.00 | 需代理 |
| NVIDIA NIM (build.nvidia.com) | 周期性免费层 | 官方页面标注为 Free inference / Free Endpoint，未公布统一额度数字，需在控制台确认 | 需代理 |
| Google Gemini API | 周期性免费层 | 限额按 RPM / TPM / RPD 三项计，逐模型不同；官方要求在 AI Studio 的速率限制页查看，未给统一数字 | 需代理 |
| 阿里云百炼 Model Studio | 一次性试用金 | 新用户赠送 1 亿+ tokens 额度 | 直连可用 |
| 讯飞星火 | 周期性免费层 | 部分版本标注免费使用；其余按「免费包」形式手动领取，额度以领取页为准 | 直连可用 |
| Cerebras | 一次性试用金 | 注册后获得 $5 免费额度 | 需代理 |
| Together AI | 周期性免费层 | 采用动态限速：每个组织每个模型的速率随持续流量自动调整，没有固定阈值 | 需代理 |
| 开源自托管（Ollama / llama.cpp / whisper.cpp / Piper） | 开源自托管 | 无外部额度限制 | 直连可用 |
| Pollinations | 免 Key 公共接口 | 匿名层未公布额度数字；实测可直接调用，但会出现临时性 402 | 需代理 |
| GitHub Models | 已退役 / 已失效 | 无 | — |

> [!note]
> 下面每一条都给出：可直接复制的 base\_url 与调用代码、特色、以及最容易踩的限制。截图锚定在各家官方页的免费额度证据处。

---

### **OpenRouter**

**一个 Key 打通 22 个零价模型，免费额度里选择面最广的聚合入口**

| 项目 | 内容 |
| --- | --- |
| 免费类型 | 周期性免费层 |
| 官方入口 | https://openrouter.ai/ |
| base\_url | https://openrouter.ai/api/v1 |
| 接口协议 | OpenAI 兼容 |
| 领取条件 | 注册账号并创建 Key，无需信用卡即可用免费变体 |
| 额度 | 带 :free 后缀的模型：20 次/分钟 + 50 次/天；累计充值满 10 credits 后日限升到 1000 次（RPM 仍为 20） |
| 重置周期 | 每天重置 |
| 国内可用性 | 需代理 |
| 当前状态 | 可用 |
| 核验依据 | 本人 2026-08-23 拉取 /api/v1/models 全量核价 + 官方限流表截图 |

#### **特色**

- 2026-08-23 实取：全站 422 个模型中输入输出双零定价的共 22 个，其中 5 个上下文达 100 万

- 18 个带 :free 后缀（受平台免费层限流），4 个不带（供应商侧定价即为 0，不落在该上限里）

- 不带后缀的 4 个：stealth/ox-alpha、google/lyria-3-pro-preview、google/lyria-3-clip-preview、openrouter/free

- NVIDIA 一家占了 22 个免费模型中的 8 个

> [!note]
> 不受平台免费层限流不等于无限量：提供方仍可能返回 429，Cloudflare 的 DDoS 防护照常生效，账户余额为负时免费模型同样报错。

```python
from openai import OpenAI
client = OpenAI(api_key="<KEY>", base_url="https://openrouter.ai/api/v1")
r = client.chat.completions.create(
    model="nvidia/nemotron-3-ultra-550b-a55b:free",
    messages=[{"role":"user","content":"你好"}])
```

![OpenRouter 官方页面实拍 · 2026-08-23](https://hyphentech.top/obsidian-assets/free-api-radar/image-01-f5a5e557ae.png)

---

### **硅基流动 SiliconFlow**

**国内直连、免费模型限速给得最大方的一家，免费版和收费版靠模型名前缀区分**

| 项目 | 内容 |
| --- | --- |
| 免费类型 | 周期性免费层 |
| 官方入口 | https://cloud.siliconflow.cn/ |
| base\_url | https://api.siliconflow.cn/v1 |
| 接口协议 | OpenAI 兼容 |
| 领取条件 | 注册 + 实名认证（实名后才能使用全部免费模型） |
| 额度 | 免费模型限速为固定值：语言模型 RPM 1000–10000、TPM 50000–5000000；向量模型 RPM 2000–10000、TPM 500000–10000000；重排序 RPM 2000、TPM 500000；图像生成 IPM 2、IPD 400 |
| 重置周期 | 按分钟/天滚动 |
| 国内可用性 | 直连可用 |
| 当前状态 | 可用 |
| 核验依据 | 官方限速文档 2026-08-23 查阅并截图 |

#### **特色**

- ⚠️ 最容易踩的坑：免费版用原始模型名（Qwen/Qwen2.5-7B-Instruct），收费版在名字前加 Pro/ 前缀（Pro/Qwen/Qwen2.5-7B-Instruct）。填错前缀就从免费变扣费。

- 免费模型的限速是固定值，不随账户用量分级；收费模型才按用量级别浮动

- 免费模型调用后账单里显示的费用为 0

> [!note]
> RPM、RPH、RPD、TPM、TPD、IPM、IPD 任一先达峰即触发限流，不是只看请求数。

```python
from openai import OpenAI
client = OpenAI(api_key="<SILICONFLOW_KEY>", base_url="https://api.siliconflow.cn/v1")
r = client.chat.completions.create(
    model="Qwen/Qwen2.5-7B-Instruct",   # 免费版：无 Pro/ 前缀
    messages=[{"role":"user","content":"你好"}])
```

![硅基流动 SiliconFlow 官方页面实拍 · 2026-08-23](https://hyphentech.top/obsidian-assets/free-api-radar/image-02-e19bef874b.png)

---

### **智谱 BigModel**

**免费额度里唯一文本、视觉、文生图、文生视频四件套齐全的国产平台**

| 项目 | 内容 |
| --- | --- |
| 免费类型 | 周期性免费层 |
| 官方入口 | https://bigmodel.cn/ |
| base\_url | https://open.bigmodel.cn/api/paas/v4 |
| 接口协议 | OpenAI 兼容 |
| 领取条件 | 注册账号获取 API Key |
| 额度 | 标注为「免费模型」的型号免费调用；具体限速需在控制台查看（官方文档未给统一数字） |
| 重置周期 | 以控制台为准 |
| 国内可用性 | 直连可用 |
| 当前状态 | 可用 |
| 核验依据 | 官方模型概览页 2026-08-23 查阅并截图（免费模型分类） |

#### **特色**

- 文本：GLM-4.7-Flash、GLM-4-Flash-250414（128K 上下文 / 16K 输出）

- 视觉：GLM-4.6V-Flash、GLM-4.1V-Thinking-Flash、GLM-4V-Flash（64K / 16K）

- 文生图：CogView-3-Flash

- 文生视频：CogVideoX-Flash

- 同一家把四类模态的免费版凑齐，这在免费额度里少见

> [!note]
> 免费型号会随版本迭代下线（文档中已有型号标注「即将下线」），接入前先看模型概览页的当前状态。

```python
from openai import OpenAI
client = OpenAI(api_key="<ZHIPU_KEY>",
                base_url="https://open.bigmodel.cn/api/paas/v4")
r = client.chat.completions.create(
    model="glm-4-flash-250414",
    messages=[{"role":"user","content":"你好"}])
```

![智谱 BigModel 官方页面实拍 · 2026-08-23](https://hyphentech.top/obsidian-assets/free-api-radar/image-03-2df8284acd.png)

---

### **魔搭 ModelScope**

**注册即用、无需实名的国内推理入口，文本和文生图都走同一套 OpenAI 兼容接口**

| 项目 | 内容 |
| --- | --- |
| 免费类型 | 周期性免费层 |
| 官方入口 | https://www.modelscope.cn/ |
| base\_url | https://api-inference.modelscope.cn/v1/ |
| 接口协议 | OpenAI 兼容 |
| 领取条件 | 注册账号后在 https://modelscope.cn/my/myaccesstoken 获取 Access Token |
| 额度 | 面向注册用户免费提供，具体额度以官方「使用限制说明」为准 |
| 重置周期 | 以官方说明为准 |
| 国内可用性 | 直连可用 |
| 当前状态 | 可用 |
| 核验依据 | 官方 API-Inference 文档 2026-08-23 查阅并截图 |

#### **特色**

- 文生图走 v1/images/generations，异步任务用 v1/tasks/\{task\_id\} 轮询

- 需要更高并发时可通过 API-Provider 能力绑定外部提供方

> [!note]
> 官方未公布统一额度数字，高并发场景需自行在控制台确认。

```python
from openai import OpenAI
client = OpenAI(api_key="<MODELSCOPE_ACCESS_TOKEN>",
                base_url="https://api-inference.modelscope.cn/v1/")
```

![魔搭 ModelScope 官方页面实拍 · 2026-08-23](https://hyphentech.top/obsidian-assets/free-api-radar/image-04-1543debadc.png)

---

### **Groq**

**免费层里延迟最低的一家，但真正卡人的是 TPM 不是请求数**

| 项目 | 内容 |
| --- | --- |
| 免费类型 | 周期性免费层 |
| 官方入口 | https://console.groq.com/ |
| base\_url | https://api.groq.com/openai/v1 |
| 接口协议 | OpenAI 兼容 |
| 领取条件 | 注册账号创建 Key |
| 额度 | 免费层按模型逐个给额度：RPM 10–30、RPD 100–14,400、TPM 1.2K–70K、TPD 3.6K–500K |
| 重置周期 | 按分钟/天 |
| 国内可用性 | 需代理 |
| 当前状态 | 可用 |
| 核验依据 | 官方 Rate Limits 文档 2026-08-23 查阅并截图 |

#### **特色**

- GPT-OSS 系：30 RPM / 1K RPD / 8K TPM / 200K TPD

- Orpheus 系：10 RPM / 100 RPD / 1.2K TPM / 3.6K TPD

- 除文本外还能跑 Whisper 语音识别

> [!note]
> ⚠️ TPM 才是真正的闸门。一次长上下文请求就可能吃掉整分钟的 token 配额，表现为「没发几次就 429」。批量任务要按 TPM 算并发，不是按 RPM。

```python
from openai import OpenAI
client = OpenAI(api_key="<GROQ_KEY>",
                base_url="https://api.groq.com/openai/v1")
```

![Groq 官方页面实拍 · 2026-08-23](https://hyphentech.top/obsidian-assets/free-api-radar/image-05-4ada03d8cc.png)

---

### **Cloudflare Workers AI**

**唯一按算力而不是按次数计的免费层，覆盖面最广**

| 项目 | 内容 |
| --- | --- |
| 免费类型 | 每日重置 |
| 官方入口 | https://dash.cloudflare.com/ |
| base\_url | https://api.cloudflare.com/client/v4/accounts/\{account\_id\}/ai/run/\{model\} |
| 接口协议 | REST（Worker 内可直接 env.AI.run） |
| 领取条件 | Cloudflare 账号；Free 与 Paid 两种 Workers 计划都享有该免费额度 |
| 额度 | 每天 10,000 Neurons 免费 |
| 重置周期 | 每天重置 |
| 国内可用性 | 需代理 |
| 当前状态 | 可用 |
| 核验依据 | 官方定价页 2026-08-23 查阅并截图 |

#### **特色**

- Neuron 是算力单位不是请求数，很多小请求特别划算

- 覆盖 LLM、embeddings、文生图、语音识别、语音合成、分类、翻译、视觉

> [!note]
> ⚠️ 超额不是降速也不是自动扣费，是直接报错失败；之后按 $0.011 / 1,000 Neurons 计价。跑一次大图或长音频可能一口气吃掉一大截当日额度。部分高级模型需绑定付费方式。

```shell
// Worker 内直接调用
const r = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
  messages: [{ role: 'user', content: '你好' }]
});
```

![Cloudflare Workers AI 官方页面实拍 · 2026-08-23](https://hyphentech.top/obsidian-assets/free-api-radar/image-06-59791e7304.png)

---

### **Agnes AI**

**免费额度里少见的图片和视频都给，但端点和字段有三处文档写错**

| 项目 | 内容 |
| --- | --- |
| 免费类型 | 周期性免费层 |
| 官方入口 | https://agnes-ai.com/ |
| base\_url | https://apihub.agnes-ai.com |
| 接口协议 | REST（图片同步 / 视频异步轮询） |
| 领取条件 | 谷歌账号登录即可开通，取得 API Key |
| 额度 | 免费额度按计划限频；视频接口约 2 次/分钟 |
| 重置周期 | 以账户计划为准 |
| 国内可用性 | Mac 直连可用；部分网络环境下域名被墙，需配代理 |
| 当前状态 | 可用 |
| 核验依据 | 本人 2026-08-23 实际调用出图，耗时 41 秒 |

#### **特色**

- 图片模型 agnes-image-2.1-flash，视频模型 agnes-video-v2.0

- 本人 2026-08-23 实测：图片 41 秒出图，2624×1472

- 图生视频约 100 秒，纯文生视频约 292 秒 —— 能给首帧就别纯文生

> [!note]
> ⚠️ 四个必踩的坑：① 域名是 apihub.agnes-ai.com，写成 api. 直接 404；② 视频结果 URL 在响应顶层 url，文档写的 metadata.url 不存在；③ 图片 size 只吃 1K/2K/3K/4K 档位配 ratio，传 1920x1080 会被标准化成 1312×736；④ num\_frames 必须 ≤441 且满足 8n+1。另外本地图片输入必须转 data URI，用公网 URL 能建任务但产物是坏的。返回文件后缀是 .jpg 而实际编码可能是 PNG，转发到微信前必须真转码。

```shell
# 视频：建任务 → 轮询 → 从响应顶层 url 下载
# POST https://apihub.agnes-ai.com/v1/videos
# GET  https://apihub.agnes-ai.com/agnesapi?video_id=<id>
```

![Agnes AI 官方页面实拍 · 2026-08-23](https://hyphentech.top/obsidian-assets/free-api-radar/image-07-8e924f9562.png)

---

### **Hugging Face Inference Providers**

**额度很小，适合连通性测试而不是生产**

| 项目 | 内容 |
| --- | --- |
| 免费类型 | 每月赠额 |
| 官方入口 | https://huggingface.co/settings/tokens |
| base\_url | https://router.huggingface.co/v1 |
| 接口协议 | OpenAI 兼容 |
| 领取条件 | HF 账号 + Access Token |
| 额度 | 免费用户每月 $0.10 额度；PRO 用户每月 $2.00；Team/Enterprise 每席位 $2.00 |
| 重置周期 | 每月 |
| 国内可用性 | 需代理 |
| 当前状态 | 可用 |
| 核验依据 | 官方定价页 2026-08-23 查阅并截图 |

#### **特色**

- 额度只在通过 HF 路由请求时自动抵扣；直连各提供方不适用

- 额度用完可购买额外 credits 继续用

> [!note]
> ⚠️ 免费用户每月 $0.10 是很小的数目，官方也注明可能变动。当连通性测试和玩具项目用，别当生产入口。

```python
from openai import OpenAI
client = OpenAI(api_key="<HF_TOKEN>",
                base_url="https://router.huggingface.co/v1")
```

![Hugging Face Inference Providers 官方页面实拍 · 2026-08-23](https://hyphentech.top/obsidian-assets/free-api-radar/image-08-13ff12341b.png)

---

### **NVIDIA NIM (build.nvidia.com)**

**一整排模型直接标着 Free Endpoint，适合试新模型**

| 项目 | 内容 |
| --- | --- |
| 免费类型 | 周期性免费层 |
| 官方入口 | https://build.nvidia.com/ |
| base\_url | https://integrate.api.nvidia.com/v1 |
| 接口协议 | OpenAI 兼容 |
| 领取条件 | NVIDIA 开发者账号 |
| 额度 | 官方页面标注为 Free inference / Free Endpoint，未公布统一额度数字，需在控制台确认 |
| 重置周期 | 以控制台为准 |
| 国内可用性 | 需代理 |
| 当前状态 | 可用（额度待核） |
| 核验依据 | 官方模型页 2026-08-23 查阅并截图 |

#### **特色**

- 模型广场上大量条目直接标 Free Endpoint

- NVIDIA 同时在 OpenRouter 免费榜上占了 22 个中的 8 个，是免费铺得最狠的一家

> [!note]
> 免费额度的具体数字官方未在公开页给出，接入生产前必须自行在控制台核对。

```python
from openai import OpenAI
client = OpenAI(api_key="<NVIDIA_KEY>",
                base_url="https://integrate.api.nvidia.com/v1")
```

![NVIDIA NIM (build.nvidia.com) 官方页面实拍 · 2026-08-23](https://hyphentech.top/obsidian-assets/free-api-radar/image-09-7d6063df03.png)

---

### **Google Gemini API**

**免费层不需要绑定结算账号，但每个模型的额度得自己去 AI Studio 查**

| 项目 | 内容 |
| --- | --- |
| 免费类型 | 周期性免费层 |
| 官方入口 | https://aistudio.google.com/apikey |
| base\_url | https://generativelanguage.googleapis.com/v1beta/openai/ |
| 接口协议 | 原生 REST + OpenAI 兼容层 |
| 领取条件 | 免费层资格条件为「有效项目或免费试用」，无需关联结算账号 |
| 额度 | 限额按 RPM / TPM / RPD 三项计，逐模型不同；官方要求在 AI Studio 的速率限制页查看，未给统一数字 |
| 重置周期 | RPD 于太平洋时间午夜重置 |
| 国内可用性 | 需代理 |
| 当前状态 | 可用 |
| 核验依据 | 官方速率限制文档 2026-08-23 查阅并截图（免费层级行） |

#### **特色**

- 速率限制按项目应用，不是按 API 密钥应用

- 超出 RPM、TPM、RPD 任一项都会触发限流

- 生图模型另有 IPM（每分钟图片数）指标

> [!note]
> ⚠️ 本表不给 Gemini 的具体额度数字——官方明确说限额随使用层级与账户状态自动变化，任何写死的数字都会过期。

```python
from openai import OpenAI
client = OpenAI(api_key="<GEMINI_KEY>",
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/")
```

![Google Gemini API 官方页面实拍 · 2026-08-23](https://hyphentech.top/obsidian-assets/free-api-radar/image-10-2141d40d91.png)

---

### **阿里云百炼 Model Studio**

**新用户送 1 亿+ tokens，但这是一次性试用金不是永久免费层**

| 项目 | 内容 |
| --- | --- |
| 免费类型 | 一次性试用金 |
| 官方入口 | https://bailian.console.aliyun.com/ |
| base\_url | https://dashscope.aliyuncs.com/compatible-mode/v1 |
| 接口协议 | OpenAI 兼容 |
| 领取条件 | 阿里云账号，部分权益需实名 |
| 额度 | 新用户赠送 1 亿+ tokens 额度 |
| 重置周期 | 一次性，不重置 |
| 国内可用性 | 直连可用 |
| 当前状态 | 可用 |
| 核验依据 | 官方模型页 2026-08-23 查阅并截图 |

#### **特色**

- 通义千问全系可用

- 额度大，适合一次性跑批量任务

> [!note]
> ⚠️ 这是 ONE\_TIME\_TRIAL 不是 PERMANENT\_FREE\_TIER。把它讲成「永久免费」是这类教程最常见的谎。用完就要付费。

```python
from openai import OpenAI
client = OpenAI(api_key="<DASHSCOPE_KEY>",
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1")
```

![阿里云百炼 Model Studio 官方页面实拍 · 2026-08-23](https://hyphentech.top/obsidian-assets/free-api-radar/image-11-c9baf2602a.png)

---

### **讯飞星火**

**有常驻免费模型档位，也有需要手动领取的免费包**

| 项目 | 内容 |
| --- | --- |
| 免费类型 | 周期性免费层 |
| 官方入口 | https://xinghuo.xfyun.cn/sparkapi |
| base\_url | wss://spark-api.xf-yun.com/（WebSocket） |
| 接口协议 | WebSocket 原生协议（非 OpenAI 兼容） |
| 领取条件 | 注册后在控制台获取 AppID、APIKey、APISecret 三件套，并在产品页领取免费额度 |
| 额度 | 部分版本标注免费使用；其余按「免费包」形式手动领取，额度以领取页为准 |
| 重置周期 | 以领取页为准 |
| 国内可用性 | 直连可用 |
| 当前状态 | 可用 |
| 核验依据 | 官方产品页与文档 2026-08-23 查阅并截图 |

#### **特色**

- Lite、Pro、Pro-128K、Max、Max-32K、4.0 Ultra 六个版本各自独立计量 tokens

- 1 token 约等于 1.5 个中文汉字或 0.8 个英文单词

> [!note]
> ⚠️ 鉴权是 AppID + APIKey + APISecret 三件套且走 WebSocket，不能像其他家那样换个 base\_url 就接上，接入成本明显更高。

```shell
# 非 OpenAI 兼容：需按官方 WebSocket 鉴权流程签名后连接
# 详见 https://www.xfyun.cn/doc/spark/Web.html
```

![讯飞星火 官方页面实拍 · 2026-08-23](https://hyphentech.top/obsidian-assets/free-api-radar/image-12-f8464baa73.png)

---

### **Cerebras**

**注册送 $5 试用金，属一次性不是永久免费**

| 项目 | 内容 |
| --- | --- |
| 免费类型 | 一次性试用金 |
| 官方入口 | https://cloud.cerebras.ai/ |
| base\_url | https://api.cerebras.ai/v1 |
| 接口协议 | OpenAI 兼容 |
| 领取条件 | 注册账号 |
| 额度 | 注册后获得 $5 免费额度 |
| 重置周期 | 一次性，不重置 |
| 国内可用性 | 需代理 |
| 当前状态 | 可用 |
| 核验依据 | 官方定价页 2026-08-23 查阅并截图 |

#### **特色**

- 以极高推理速度著称

- 付费档从 $10 起，限速为免费档的 10 倍

> [!note]
> ⚠️ ONE\_TIME\_TRIAL。$5 用完即止，不要按永久免费规划。

```python
from openai import OpenAI
client = OpenAI(api_key="<CEREBRAS_KEY>",
                base_url="https://api.cerebras.ai/v1")
```

![Cerebras 官方页面实拍 · 2026-08-23](https://hyphentech.top/obsidian-assets/free-api-radar/image-13-2b90a0e86f.png)

---

### **Together AI**

**动态限速，没有固定的免费额度数字**

| 项目 | 内容 |
| --- | --- |
| 免费类型 | 周期性免费层 |
| 官方入口 | https://api.together.xyz/ |
| base\_url | https://api.together.xyz/v1 |
| 接口协议 | OpenAI 兼容 |
| 领取条件 | 注册账号创建 Key |
| 额度 | 采用动态限速：每个组织每个模型的速率随持续流量自动调整，没有固定阈值 |
| 重置周期 | 动态 |
| 国内可用性 | 需代理 |
| 当前状态 | 可用（额度动态） |
| 核验依据 | 官方限速文档 2026-08-23 查阅并截图 |

#### **特色**

- 可通过接口查询当前自己的实时限速

- 适合流量平稳的长期任务，不适合突发批量

> [!note]
> ⚠️ 没有可对外引用的固定免费额度数字。任何声称 Together 免费层「每天多少次」的教程都值得怀疑，以自己账号查到的实时限速为准。

```python
from openai import OpenAI
client = OpenAI(api_key="<TOGETHER_KEY>",
                base_url="https://api.together.xyz/v1")
```

![Together AI 官方页面实拍 · 2026-08-23](https://hyphentech.top/obsidian-assets/free-api-radar/image-14-975f540839.png)

---

### **开源自托管（Ollama / llama.cpp / whisper.cpp / Piper）**

**不看别人脸色的那条路：额度是你的硬件，不是别人的政策**

| 项目 | 内容 |
| --- | --- |
| 免费类型 | 开源自托管 |
| 官方入口 | https://ollama.com/ |
| base\_url | http://localhost:11434/v1（Ollama 默认） |
| 接口协议 | OpenAI 兼容 |
| 领取条件 | 自己的机器；显存/内存决定能跑多大的模型 |
| 额度 | 无外部额度限制 |
| 重置周期 | — |
| 国内可用性 | 直连可用 |
| 当前状态 | 可用 |
| 核验依据 | 长期在本机运行 |

#### **特色**

- Ollama 提供 OpenAI 兼容端点，换 base\_url 即可复用现有代码

- llama.cpp 负责推理、whisper.cpp 做语音识别、Piper 做语音合成

- 唯一不会因为对方改政策而一夜失效的方案

> [!note]
> 代价是硬件与运维：模型大小受显存限制，速度受本机算力限制。它解决的是「不被断供」，不是「更快更强」。

```python
from openai import OpenAI
client = OpenAI(api_key="ollama", base_url="http://localhost:11434/v1")
r = client.chat.completions.create(model="qwen3",
    messages=[{"role":"user","content":"你好"}])
```

---

### **Pollinations**

**免 Key 匿名层还活着，但同一天里我测到过两种结果**

| 项目 | 内容 |
| --- | --- |
| 免费类型 | 免 Key 公共接口 |
| 官方入口 | https://pollinations.ai/ |
| base\_url | https://text.pollinations.ai |
| 接口协议 | REST / OpenAI 兼容路径 |
| 领取条件 | 文本接口的匿名层无需 Key；生成类接口需自备 Key 与 Pollen 余额 |
| 额度 | 匿名层未公布额度数字；实测可直接调用，但会出现临时性 402 |
| 重置周期 | 未公布 |
| 国内可用性 | 需代理 |
| 当前状态 | 可用（状态不稳定，当日观测到两种结果） |
| 核验依据 | 本人 2026-08-23 12:10 实测 402、15:57 复测连续 4 次 200，双状态截图见下 |

#### **特色**

- models 接口条目标注 "tier": "anonymous"，官方通知写明匿名请求不受废弃计划影响

- OpenAI 兼容路径 POST /openai，也支持 GET 直读形式

- ⚠️ 本人当日两次实测结果不同：12:10 CST 返回 HTTP 402（budget too low），15:57 CST 同一出口 IP 连测 4 次全部 HTTP 200

> [!note]
> ⚠️ 这一条是本表最重要的方法论样本：同一天、同一出口 IP、同样的请求体，上午被拒下午通过。免费入口的状态会在数小时内变化，任何时点的快照（包括本表）都不能当长期结论——调用前请自己发一次真实请求确认。

```shell
curl -s https://text.pollinations.ai/openai \
  -H 'Content-Type: application/json' \
  -d '{"model":"openai-fast","messages":[{"role":"user","content":"ping"}]}'
# 不带任何 Key；先自测一次再决定是否接入
```

![Pollinations 官方页面实拍 · 2026-08-23](https://hyphentech.top/obsidian-assets/free-api-radar/image-15-958d1fdf32.png)

---

### **GitHub Models**

**2026-07-30 已全面退役，满网教程现在全是死链**

| 项目 | 内容 |
| --- | --- |
| 免费类型 | 已退役 / 已失效 |
| 官方入口 | https://docs.github.com/en/github-models |
| base\_url | — |
| 接口协议 | — |
| 领取条件 | — |
| 额度 | 无 |
| 重置周期 | — |
| 国内可用性 | — |
| 当前状态 | 已退役 |
| 核验依据 | GitHub 官方退役公告 2026-08-23 查阅并截图 |

#### **特色**

- 官方迁移方向为 Azure AI Foundry 或 GitHub Copilot

> [!note]
> 官方原文：As of July 30, 2026, GitHub Models has been fully retired. The playground, model catalog, inference API, and bring your own key (BYOK) are no longer available to any customer.

```shell
# 已退役，无调用方式
```

![GitHub Models 官方页面实拍 · 2026-08-23](https://hyphentech.top/obsidian-assets/free-api-radar/image-16-4280fe7af8.png)

---

> [!note]
> 免费名单没有保质期，只有最后验证日期。本表复测于 2026-08-23；调用前请自己发一次真实请求确认当前状态。
