---
title: 2026 年 9 月 23 日，免费 AI API 还有几个真能用？
slug: free-ai-api-radar-2026-09-23
status: published
date: 2026-09-23
updated: 2026-09-23
summary: 17 个旧入口逐一复核，并审视 4 个候选；按本期非空真实请求筛出 3 个可调用平台，同时记录额度和失败边界。
categories:
  - 资源分享
tags:
  - AI
  - 免费白嫖
cover: /obsidian-assets/free-ai-api-radar-2026-09-23/cover-cd849e2436.jpg
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!abstract]
> 专题日期：2026-09-23 · 二次复核：2026-09-23
> 黑粉科技

> [!tip]
> 本期按严格口径，3 个平台在我的 Mac 网络视角下通过了至少三次有效调用和一次较长真实任务；这不等于长期稳定或人人可用。

> [!warning]
> 官方页面只证明政策或模型存在，账户级能否调用须看本期请求；无凭据、协议不同及页面抓取不足均单列，不记为失效。

## 我怎么复测，以及免费到底卡在哪

我先在本机列出模型，再对同一接口做短问答和稍长任务。能列出来只是第一道门；真正把字吐出来，才算跨过第二道门。Gemini 的对话与向量接口分别通过，Groq 的指定模型也连续返回有效正文。这是我的账户、我的网络视角下的记录，不是给所有人的可用担保。

最容易误判的是“免费”两个字。谁赚了？平台得到开发者注意力和试用流量；谁承担成本？调用者要花时间申请、迁移、处理限流，提供方要负担推理资源。我的判断是：免费档更像一个有边界的入口，而不是可无限依赖的基础设施。这个商业动机判断不是平台官方承诺，所以我把它和价格、配额的原文分开。

今天遇到的失败不是同一种病：硅基流动在本账户返回余额不足；Pollinations 公开模型目录可读，实际匿名请求却连续报服务器错误；OpenRouter 和 Agnes 则先失败、后恢复。把这几件事都写成“模型没了”，选型就会偏。尤其要注意，Agnes 本次所测型号虽然真的返回了文本，但官网免费展示与所测型号不完全对应，因此我没有把它计入标题里的平台数。

对普通使用者，我会先用不含隐私的短任务试通，再看一次稍长任务，最后观察限流恢复。先别把客户资料、私有仓库或密钥塞进一个还没读隐私条款的免费端点。正文后面的逐项表格把缺失字段保留为“待核验”；看起来不如填满漂亮，但它比把旧额度抄成今天的政策实用。

## 一句话推荐

- 本期真实请求通过：OpenRouter、Groq、Google Gemini API；先按自己的账户和地区再测。
- Gemini 的 Chat 与 Embedding 分别验证，不用 Chat 错误请求误判 Embedding。
- 免费入口有 402、429、502、503 等不同风险；长任务与连续调用的记录比零价网页更重要。

## 核实速查

| 平台 | 当前核实 |
| --- | --- |
| OpenRouter | 复测可调用；首试 503，非稳定承诺 |
| 硅基流动 SiliconFlow | 本账户余额不足；平台免费模型不可据此判失效 |
| 智谱 BigModel | 官方目录可见；账户级调用待核验 |
| 魔搭 ModelScope | 账户级调用待核验 |
| Groq | 本期可调用；不同模型稳定性有差异 |
| Cloudflare Workers AI | 官方免费档确认；账户级调用待核验 |
| Agnes AI | 接口复测可调用；所测型号的零价资格待核验 |
| Hugging Face Inference Providers | 官方免费额度确认；账户级调用待核验 |
| NVIDIA NIM (build.nvidia.com) | 官方入口确认；账户级调用待核验 |
| Google Gemini API | 本期 Chat 免费交集通过；Embedding 调用有效、零价待核 |
| 阿里云百炼 Model Studio | 政策更新确认；账户级调用待核验 |
| 讯飞星火 | 官方协议确认；账户级调用待核验 |
| Cerebras | 账户级调用待核验 |
| Together AI | 账户级免费资格与调用待核验 |
| Pollinations | 本期四次调用均 500；未通过真能用闸 |
| GitHub Models | 已退役，不纳入候选 |
| 开源自托管（Ollama / llama.cpp / whisper.cpp / Piper） | 可自托管，但不是公众免费云 API |
| OpenCode Zen | 官方候选；账户级调用待核验 |
| FreeInference | 官方候选；Embedding 调用待核验 |
| 中科大公共模型服务 | 不属于公众免费 API，不纳入推荐 |
| 蚂蚁百灵 | 页面抓取不足，暂不纳入可用统计 |

> 专题日期 2026-09-23；状态复核于 2026-09-23

> [!warning]
> 仅测试本人合法持有凭据与公开无 Key 接口；不共享或落盘密钥，不绕验证码、实名、支付、地区及账户限额。

---

## OpenRouter

**复测可调用；首试 503，非稳定承诺**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | nvidia/nemotron-3-super-120b-a12b:free |
| 接入 | OpenAI 兼容；注册账号并创建 Key，无需信用卡即可用免费变体 |
| Base URL | https://openrouter.ai/api/v1 |
| 免费类型 | 零价模型／账户级免费档 |
| 鉴权 | 注册账号并创建 Key，无需信用卡即可用免费变体 |
| 免费额度 | 官方免费模型限制及上游限制并存；本账户当前实际限额须看控制台 |
| 重置周期 | 以账户限额为准 |
| 有效期 | 以账户及官方活动条款为准 |
| 地区 | 国际 |
| 支付／实名门槛 | 信用卡／充值／实名门槛本期未逐账户核验 |
| 隐私政策 | 所测 NVIDIA 免费端点官方模型页提示会记录输入和回复用于改进产品；勿传个人或机密数据 |
| 核实结论 | 首次 503 后三次真实 Chat 有效返回（含较长任务）；另一免费模型首次 429 后处于冷却。 |
| 证据状态 | 本期官方页面已读取；具体账户权益以控制台为准 |

> [!warning]
> 不同免费模型不是同一可用性；429、503 和账户余额约束须分开看。

- 官方来源：https://openrouter.ai/docs/api-reference/limits
- 官方来源：https://openrouter.ai/nvidia/nemotron-3-super-120b-a12b%3Afree

- 本期探测：openrouter/liquid/lfm-2.5-2.6b:free · chat · 有效 0/4 · probe-report.local.json
- 本期探测：openrouter/nvidia/nemotron-3-super-120b-a12b:free · chat · 有效 3/4 · probe-report.recheck.json

![OpenRouter 官方模型页：Nemotron 免费变体与数据记录提示 · 2026-09-23](/obsidian-assets/free-ai-api-radar-2026-09-23/image-openrouter-1-a1578efc0f.png)

---

## 硅基流动 SiliconFlow

**本账户余额不足；平台免费模型不可据此判失效**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | PaddlePaddle/PaddleOCR-VL-1.5（官方价格页）；Qwen/Qwen2.5-7B-Instruct（本机探测目标） |
| 接入 | OpenAI 兼容；注册 + 实名认证（实名后才能使用全部免费模型） |
| Base URL | https://api.siliconflow.cn/v1 |
| 免费类型 | 零价模型／账户条件 |
| 鉴权 | 注册 + 实名认证（实名后才能使用全部免费模型） |
| 免费额度 | 账户级限额待控制台核验 |
| 重置周期 | 待核验 |
| 有效期 | 以账户及官方活动条款为准 |
| 地区 | 国产 |
| 支付／实名门槛 | 实名要求见官方公告 |
| 隐私政策 | 本期未逐项核验可引用的隐私条款；敏感数据禁止投入未审查的免费端点 |
| 核实结论 | 本机目标模型四次请求均返回 402；官方价格页仍列免费模型，不能推断所有账户都不可用。 |
| 证据状态 | 官方页面本期抓取不足或不可读；结合实测或标待核验 |

> [!warning]
> 官方公告称账户使用须实名；旧 PaddleOCR-VL 退役不等于 PaddleOCR-VL-1.5 退役。

- 官方来源：https://siliconflow.cn/pricing

- 本期探测：siliconflow/Qwen/Qwen2.5-7B-Instruct · chat · 有效 0/4 · probe-report.local.json

---

## 智谱 BigModel

**官方目录可见；账户级调用待核验**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | 官方模型概览列出 GLM Flash 系列；具体免费型号待模型页复核 |
| 接入 | OpenAI 兼容；注册账号获取 API Key |
| Base URL | https://open.bigmodel.cn/api/paas/v4 |
| 免费类型 | 官方免费模型／账户层 |
| 鉴权 | 注册账号获取 API Key |
| 免费额度 | 待账户权益页核验 |
| 重置周期 | 待核验 |
| 有效期 | 以账户及官方活动条款为准 |
| 地区 | 国产 |
| 支付／实名门槛 | 信用卡／充值／实名门槛本期未逐账户核验 |
| 隐私政策 | 本期未逐项核验可引用的隐私条款；敏感数据禁止投入未审查的免费端点 |
| 核实结论 | 本期未持有可合法调用的独立账户凭据，不能计入真能用。 |
| 证据状态 | 本期官方页面已读取；具体账户权益以控制台为准 |

> [!warning]
> 旧版型号和限额不得直接沿用。

- 官方来源：https://docs.bigmodel.cn/cn/guide/start/model-overview

---

## 魔搭 ModelScope

**账户级调用待核验**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | 具体模型清单待官方控制台核验 |
| 接入 | OpenAI 兼容；注册账号后在 https://modelscope.cn/my/myaccesstoken 获取 Access Token |
| Base URL | https://api-inference.modelscope.cn/v1/ |
| 免费类型 | 账户层免费服务 |
| 鉴权 | 注册账号后在 https://modelscope.cn/my/myaccesstoken 获取 Access Token |
| 免费额度 | 待核验 |
| 重置周期 | 待核验 |
| 有效期 | 以账户及官方活动条款为准 |
| 地区 | 国产 |
| 支付／实名门槛 | 信用卡／充值／实名门槛本期未逐账户核验 |
| 隐私政策 | 本期未逐项核验可引用的隐私条款；敏感数据禁止投入未审查的免费端点 |
| 核实结论 | 旧官方文档本轮未抽取到可核对正文，未执行真实调用。 |
| 证据状态 | 官方页面本期抓取不足或不可读；结合实测或标待核验 |

> [!warning]
> 不能把 8 月清单当作 9 月可用模型。

- 官方来源：https://www.modelscope.cn/docs/model-service/API-Inference/intro

---

## Groq

**本期可调用；不同模型稳定性有差异**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | qwen/qwen3.8-27b；openai/gpt-oss-20b |
| 接入 | OpenAI 兼容；注册账号创建 Key |
| Base URL | https://api.groq.com/openai/v1 |
| 免费类型 | 周期恢复免费档 |
| 鉴权 | 注册账号创建 Key |
| 免费额度 | Qwen3.8-27b 官方限额表列 30 RPM、1000 RPD、8K TPM、200K TPD；账户实际限额以控制台为准 |
| 重置周期 | 按分钟及日滚动／重置，以控制台为准 |
| 有效期 | 以账户及官方活动条款为准 |
| 地区 | 国际 |
| 支付／实名门槛 | 信用卡／充值／实名门槛本期未逐账户核验 |
| 隐私政策 | Groq 官方说明默认不保留推理输入输出，但故障和滥用调查可临时记录，最长 30 天；账户可设置零数据保留 |
| 核实结论 | Qwen3.8-27b 四次 Chat 均返回有效文本（含较长任务）；gpt-oss-20b 两次有效、两次仅思考无正文。 |
| 证据状态 | 本期官方页面已读取；具体账户权益以控制台为准 |

> [!warning]
> 同平台不同模型不能共享稳定性结论。

- 官方来源：https://console.groq.com/docs/rate-limits
- 官方来源：https://console.groq.com/docs/your-data
- 官方来源：https://console.groq.com/docs/deprecations

- 本期探测：groq/openai/gpt-oss-20b · chat · 有效 2/4 · probe-report.local.json
- 本期探测：groq/qwen/qwen3.8-27b · chat · 有效 4/4 · probe-report.recheck.json

![Groq 官方限额页：具体模型的免费层限额与账户控制台口径 · 2026-09-23](/obsidian-assets/free-ai-api-radar-2026-09-23/image-groq-1-bc31aa3171.png)

---

## Cloudflare Workers AI

**官方免费档确认；账户级调用待核验**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | Workers AI 官方模型目录；具体免费可用模型按账户核实 |
| 接入 | REST（Worker 内可直接 env.AI.run）；Cloudflare 账号；Free 与 Paid 两种 Workers 计划都享有该免费额度 |
| Base URL | https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/{model} |
| 免费类型 | 每日恢复免费档 |
| 鉴权 | Cloudflare 账号；Free 与 Paid 两种 Workers 计划都享有该免费额度 |
| 免费额度 | 10,000 Neurons／日 |
| 重置周期 | UTC 00:00 |
| 有效期 | 以账户及官方活动条款为准 |
| 地区 | 国际 |
| 支付／实名门槛 | 信用卡／充值／实名门槛本期未逐账户核验 |
| 隐私政策 | 本期未逐项核验可引用的隐私条款；敏感数据禁止投入未审查的免费端点 |
| 核实结论 | 官方价格页明确每日免费额度，本期未持有可合法调用的账户与模型组合进行真实调用。 |
| 证据状态 | 本期官方页面已读取；具体账户权益以控制台为准 |

> [!warning]
> 超额后免费计划失败；不能把 Neurons 换算成固定 Chat 次数。

- 官方来源：https://developers.cloudflare.com/workers-ai/platform/pricing/

![Cloudflare 官方定价页：Workers AI 每日免费 Neurons 配额 · 2026-09-23](/obsidian-assets/free-ai-api-radar-2026-09-23/image-cloudflare-1-686624d9ef.png)

---

## Agnes AI

**接口复测可调用；所测型号的零价资格待核验**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | agnes-2.5-flash；agnes-2.0-flash（实测）；官网 Free API 当前主要展示 3.0 Flash |
| 接入 | OpenAI 兼容（文本对话）+ REST（图片同步 / 视频异步轮询）；谷歌账号登录即可开通，取得 API Key |
| Base URL | https://apihub.agnes-ai.com/v1 |
| 免费类型 | 账户层免费档／动态限频 |
| 鉴权 | 谷歌账号登录即可开通，取得 API Key |
| 免费额度 | 本期未从官方可读取页面核实 2.5 Flash 的免费定价和固定数字 |
| 重置周期 | 待账户控制台核验 |
| 有效期 | 以账户及官方活动条款为准 |
| 地区 | 国际 |
| 支付／实名门槛 | 信用卡／充值／实名门槛本期未逐账户核验 |
| 隐私政策 | 本期未逐项核验可引用的隐私条款；敏感数据禁止投入未审查的免费端点 |
| 核实结论 | 2.5 Flash 首次 502 后三次有效 Chat（含较长任务）；2.0 Flash 一次有效后触发 429 冷却。所测型号未通过官方零价交集闸。 |
| 证据状态 | 官网展示 Free API 与 3.0 Flash；所测 2.5 Flash 零价资格未在官方可读页面证实 |

> [!warning]
> 官网 Free API 的宣传不能自动套到 2.5 Flash；不能把连续三次成功等同长期稳定。

- 官方来源：https://agnes-ai.com/

- 本期探测：agnes/agnes-2.0-flash · chat · 有效 1/4 · probe-report.local.json
- 本期探测：agnes/agnes-2.5-flash · chat · 有效 3/4 · probe-report.recheck.json

---

## Hugging Face Inference Providers

**官方免费额度确认；账户级调用待核验**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | 按 Inference Providers 官方路由及账户可见模型 |
| 接入 | OpenAI 兼容；HF 账号 + Access Token |
| Base URL | https://router.huggingface.co/v1 |
| 免费类型 | 每月计算额度 |
| 鉴权 | HF 账号 + Access Token |
| 免费额度 | Free 用户每月 0.10 美元计算额度 |
| 重置周期 | 按月 |
| 有效期 | 以账户及官方活动条款为准 |
| 地区 | 国际 |
| 支付／实名门槛 | 信用卡／充值／实名门槛本期未逐账户核验 |
| 隐私政策 | 本期未逐项核验可引用的隐私条款；敏感数据禁止投入未审查的免费端点 |
| 核实结论 | 官方价格页有月度计算额度；本期未实测有效 Embedding 或 Chat。 |
| 证据状态 | 本期官方页面已读取；具体账户权益以控制台为准 |

> [!warning]
> BYOK 路由的计费口径不同，不能把平台额度理解为无限调用。

- 官方来源：https://huggingface.co/docs/inference-providers/pricing

![Hugging Face 官方定价页：免费账户月度计算额度 · 2026-09-23](/obsidian-assets/free-ai-api-radar-2026-09-23/image-huggingface-1-db3987ce99.png)

---

## NVIDIA NIM (build.nvidia.com)

**官方入口确认；账户级调用待核验**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | 以 build.nvidia.com 当期 Free Endpoint 标签为准 |
| 接入 | OpenAI 兼容；NVIDIA 开发者账号 |
| Base URL | https://integrate.api.nvidia.com/v1 |
| 免费类型 | 官方 Free Endpoint／账户层 |
| 鉴权 | NVIDIA 开发者账号 |
| 免费额度 | 未核实统一固定额度 |
| 重置周期 | 待核验 |
| 有效期 | 以账户及官方活动条款为准 |
| 地区 | 国际 |
| 支付／实名门槛 | 信用卡／充值／实名门槛本期未逐账户核验 |
| 隐私政策 | 本期未逐项核验可引用的隐私条款；敏感数据禁止投入未审查的免费端点 |
| 核实结论 | 官方模型入口存在 Free Endpoint，但未完成本期独立账户 API 调用。 |
| 证据状态 | 本期官方页面已读取；具体账户权益以控制台为准 |

> [!warning]
> OpenRouter 转发的 NVIDIA 模型成功不等于 NVIDIA 直连接口实测成功。

- 官方来源：https://build.nvidia.com/models

---

## Google Gemini API

**本期 Chat 免费交集通过；Embedding 调用有效、零价待核**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | gemini-3.1-flash-lite（官方免费层）；gemini-embedding-001（调用有效，当前免费价格待核） |
| 接入 | 原生 REST + OpenAI 兼容层；免费层资格条件为「有效项目或免费试用」，无需关联结算账号 |
| Base URL | https://generativelanguage.googleapis.com/v1beta/openai/ |
| 免费类型 | 逐模型免费档 |
| 鉴权 | 免费层资格条件为「有效项目或免费试用」，无需关联结算账号 |
| 免费额度 | 按模型／项目 RPM、TPM、RPD 限额；本账户以 AI Studio 控制台为准 |
| 重置周期 | RPD 在太平洋时间午夜重置 |
| 有效期 | 以账户及官方活动条款为准 |
| 地区 | 国际 |
| 支付／实名门槛 | 信用卡／充值／实名门槛本期未逐账户核验 |
| 隐私政策 | Google 官方定价页将该免费层“用于改进产品”标为“是”；勿传个人或机密数据 |
| 核实结论 | Chat 四次均非空（含较长任务）；Embedding 四次均为非空 3072 维向量。官方当前定价页未列出 embedding-001 免费价格，故只把 Chat 型号计入免费交集。 |
| 证据状态 | 本期官方页面已读取；具体账户权益以控制台为准 |

> [!warning]
> 免费层请求可能用于改进 Google 产品；敏感内容不应投入。模型、地区和账户资格会影响免费层。

- 官方来源：https://ai.google.dev/gemini-api/docs/rate-limits
- 官方来源：https://ai.google.dev/gemini-api/docs/pricing

- 本期探测：gemini/gemini-3.1-flash-lite · chat · 有效 4/4 · probe-report.local.json
- 本期探测：gemini/gemini-embedding-001 · embedding · 有效 4/4 · probe-report.local.json

![Gemini 官方限额页：按模型及项目的免费层限制 · 2026-09-23](/obsidian-assets/free-ai-api-radar-2026-09-23/image-gemini-1-b8b4b0c6fe.png)

![Gemini 官方定价页：Flash-Lite 免费层与数据使用口径 · 2026-09-23](/obsidian-assets/free-ai-api-radar-2026-09-23/image-gemini-2-5b0805cf7d.png)

---

## 阿里云百炼 Model Studio

**政策更新确认；账户级调用待核验**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | 以 Model Studio 当期模型定价页为准 |
| 接入 | OpenAI 兼容；阿里云账号，部分权益需实名 |
| Base URL | https://dashscope.aliyuncs.com/compatible-mode/v1 |
| 免费类型 | 新用户一次性额度 |
| 鉴权 | 阿里云账号，部分权益需实名 |
| 免费额度 | 新加坡地域新开通用户免费额度有效期按官方新规为 90 天；具体获赠数按账户 |
| 重置周期 | 一次性，不重置 |
| 有效期 | 2026-09-08 UTC 后新开通新加坡地域适用 90 天 |
| 地区 | 国产 |
| 支付／实名门槛 | 部分权益需实名；账户级条件待核验 |
| 隐私政策 | 本期未逐项核验可引用的隐私条款；敏感数据禁止投入未审查的免费端点 |
| 核实结论 | 官方 9 月政策公告确认新开户赠额有效期调整，本期未完成独立账户调用。 |
| 证据状态 | 本期官方页面已读取；具体账户权益以控制台为准 |

> [!warning]
> 这不是长期周期免费档；历史开户用户条款不因公告自动变化。

- 官方来源：https://www.alibabacloud.com/help/zh/model-studio/new-free-quota-validity-adjustment

---

## 讯飞星火

**官方协议确认；账户级调用待核验**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | 星火官方 WebSocket 服务，模型按独立域名和协议选择 |
| 接入 | WebSocket 原生协议（非 OpenAI 兼容）；注册后在控制台获取 AppID、APIKey、APISecret 三件套，并在产品页领取免费额度 |
| Base URL | wss://spark-api.xf-yun.com/（WebSocket） |
| 免费类型 | 账户领取免费包 |
| 鉴权 | 注册后在控制台获取 AppID、APIKey、APISecret 三件套，并在产品页领取免费额度 |
| 免费额度 | 以具体领取页及控制台为准 |
| 重置周期 | 以领取包为准 |
| 有效期 | 以账户及官方活动条款为准 |
| 地区 | 国产 |
| 支付／实名门槛 | 信用卡／充值／实名门槛本期未逐账户核验 |
| 隐私政策 | 本期未逐项核验可引用的隐私条款；敏感数据禁止投入未审查的免费端点 |
| 核实结论 | 官方文档要求 AppID、APIKey、APISecret；不能用错误的 OpenAI Chat 请求测试 WebSocket 模型。 |
| 证据状态 | 本期官方页面已读取；具体账户权益以控制台为准 |

> [!warning]
> 部分端点并非 Chat；密钥三件套不可写入探测报告。

- 官方来源：https://www.xfyun.cn/doc/spark/Web.html

---

## Cerebras

**账户级调用待核验**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | 以账户可见模型为准 |
| 接入 | OpenAI 兼容；注册账号 |
| Base URL | https://api.cerebras.ai/v1 |
| 免费类型 | 新用户一次性额度／待核验 |
| 鉴权 | 注册账号 |
| 免费额度 | 本期官方抓取未核实可复用固定数 |
| 重置周期 | 若为试用额则不重置；具体待控制台核验 |
| 有效期 | 以账户及官方活动条款为准 |
| 地区 | 国际 |
| 支付／实名门槛 | 信用卡／充值／实名门槛本期未逐账户核验 |
| 隐私政策 | 本期未逐项核验可引用的隐私条款；敏感数据禁止投入未审查的免费端点 |
| 核实结论 | 官方价格入口正文不足，旧版赠额与支付门槛不能直接继承。 |
| 证据状态 | 本期官方页面已读取；具体账户权益以控制台为准 |

> [!warning]
> 若需绑定支付方式，不能归入无门槛免费档。

- 官方来源：https://inference-docs.cerebras.ai/support/pricing

---

## Together AI

**账户级免费资格与调用待核验**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | 以账户当前可见价格和模型目录为准 |
| 接入 | OpenAI 兼容；注册账号创建 Key |
| Base URL | https://api.together.xyz/v1 |
| 免费类型 | 动态限流／免费资格待核验 |
| 鉴权 | 注册账号创建 Key |
| 免费额度 | 动态组织／模型限速，无统一固定免费数 |
| 重置周期 | 动态 |
| 有效期 | 以账户及官方活动条款为准 |
| 地区 | 国际 |
| 支付／实名门槛 | 信用卡／充值／实名门槛本期未逐账户核验 |
| 隐私政策 | 本期未逐项核验可引用的隐私条款；敏感数据禁止投入未审查的免费端点 |
| 核实结论 | 官方文档说明 429 与 503 含义及动态限速；本期没有足够证据证明稳定免费额度。 |
| 证据状态 | 本期官方页面已读取；具体账户权益以控制台为准 |

> [!warning]
> 不能把动态限速误写成固定免费配额。

- 官方来源：https://docs.together.ai/docs/rate-limits

---

## Pollinations

**本期四次调用均 500；未通过真能用闸**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | openai-fast（官方模型目录列出匿名层） |
| 接入 | REST / OpenAI 兼容路径；文本接口的匿名层无需 Key；生成类接口需自备 Key 与 Pollen 余额 |
| Base URL | https://text.pollinations.ai/openai |
| 免费类型 | 公开无 Key／匿名层 |
| 鉴权 | 文本接口的匿名层无需 Key；生成类接口需自备 Key 与 Pollen 余额 |
| 免费额度 | 官方目录未列明稳定调用额度 |
| 重置周期 | 待核验 |
| 有效期 | 以账户及官方活动条款为准 |
| 地区 | 国际 |
| 支付／实名门槛 | 信用卡／充值／实名门槛本期未逐账户核验 |
| 隐私政策 | 本期未逐项核验可引用的隐私条款；敏感数据禁止投入未审查的免费端点 |
| 核实结论 | 公开模型列表可见，但三次最小 Chat 与一次较长任务全部返回 500。 |
| 证据状态 | 本期官方页面已读取；具体账户权益以控制台为准 |

> [!warning]
> 模型发现不等于 Chat 可用；不能用 8 月实测替代本期。

- 官方来源：https://text.pollinations.ai/models

---

## GitHub Models

**已退役，不纳入候选**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | 无 |
| 接入 | —；— |
| Base URL | — |
| 免费类型 | 已退役 |
| 鉴权 | — |
| 免费额度 | 无 |
| 重置周期 | 不适用 |
| 有效期 | 已退役 |
| 地区 | 国际 |
| 支付／实名门槛 | 信用卡／充值／实名门槛本期未逐账户核验 |
| 隐私政策 | 本期未逐项核验可引用的隐私条款；敏感数据禁止投入未审查的免费端点 |
| 核实结论 | 官方 GitHub Models 文档载明服务已退役。 |
| 证据状态 | 本期官方页面已读取；具体账户权益以控制台为准 |

> [!warning]
> 旧链接和旧额度均不可继续宣传。

- 官方来源：https://docs.github.com/en/github-models

---

## 开源自托管（Ollama / llama.cpp / whisper.cpp / Piper）

**可自托管，但不是公众免费云 API**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | 由本地安装模型决定 |
| 接入 | OpenAI 兼容；自己的机器；显存/内存决定能跑多大的模型 |
| Base URL | http://localhost:11434/v1（Ollama 默认） |
| 免费类型 | 开源自托管 |
| 鉴权 | 自己的机器；显存/内存决定能跑多大的模型 |
| 免费额度 | 无平台外部调用额度；硬件与电费不为零 |
| 重置周期 | 不适用 |
| 有效期 | 以账户及官方活动条款为准 |
| 地区 | 本地 |
| 支付／实名门槛 | 信用卡／充值／实名门槛本期未逐账户核验 |
| 隐私政策 | 本地自行控制 |
| 核实结论 | llama.cpp 官方提供本地 OpenAI 兼容服务；不参与云 API 真能用平台计数。 |
| 证据状态 | 本期官方页面已读取；具体账户权益以控制台为准 |

> [!warning]
> 需要自己部署、维护并承担硬件和能耗成本。

- 官方来源：https://github.com/ggml-org/llama.cpp

---

## OpenCode Zen

**官方候选；账户级调用待核验**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | jev-1.13-free 等，以 Zen 当前模型页为准 |
| 接入 | 账户与 Zen API Key |
| Base URL | https://opencode.ai/zen/v1 |
| 免费类型 | 特定限时零价模型 |
| 鉴权 | 账户与 Zen API Key |
| 免费额度 | 待账户核验 |
| 重置周期 | 待核验 |
| 有效期 | 限时活动，截止日期待官方核验 |
| 地区 | 待核验 |
| 支付／实名门槛 | 官方 Zen 通用说明要求添加账单信息；具体免费模型门槛待账户核验 |
| 隐私政策 | 待核验 |
| 核实结论 | 仅官方候选发现；本期尚未取得可合法调用的独立账户并通过三次最小请求与较长任务。 |
| 证据状态 | 本期官方页面已读取 |

> [!warning]
> 不得把文档列名当成接口可用；不得绕过报名、实名或支付验证。

- 官方来源：https://opencode.ai/docs/zen

---

## FreeInference

**官方候选；Embedding 调用待核验**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | bge-m3 Embedding 等官方 Free 标记模型 |
| 接入 | 账户 API Key |
| Base URL | 以官方 API 文档为准 |
| 免费类型 | 免费模型／账户层 |
| 鉴权 | 账户 API Key |
| 免费额度 | 待账户核验 |
| 重置周期 | 待核验 |
| 有效期 | 待核验 |
| 地区 | 待核验 |
| 支付／实名门槛 | 待核验 |
| 隐私政策 | 待核验 |
| 核实结论 | 仅官方候选发现；本期尚未取得可合法调用的独立账户并通过三次最小请求与较长任务。 |
| 证据状态 | 本期官方页面已读取 |

> [!warning]
> 不得把文档列名当成接口可用；不得绕过报名、实名或支付验证。

- 官方来源：https://doc.freeinference.org/models

---

## 中科大公共模型服务

**不属于公众免费 API，不纳入推荐**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | 9 月更新记录包含 DeepSeek V4.1 Flash 等 |
| 接入 | 师生或项目授权 |
| Base URL | 以机构授权文档为准 |
| 免费类型 | 机构限定免费资源 |
| 鉴权 | 师生或项目授权 |
| 免费额度 | 待授权账户核验 |
| 重置周期 | 待核验 |
| 有效期 | 待核验 |
| 地区 | 中国大陆／机构网络资格待核验 |
| 支付／实名门槛 | 非公众开放账户 |
| 隐私政策 | 待核验 |
| 核实结论 | 仅官方候选发现；本期尚未取得可合法调用的独立账户并通过三次最小请求与较长任务。 |
| 证据状态 | 本期官方页面已读取 |

> [!warning]
> 不得把文档列名当成接口可用；不得绕过报名、实名或支付验证。

- 官方来源：https://llm.ustc.edu.cn/guide/technical-updates/

---

## 蚂蚁百灵

**页面抓取不足，暂不纳入可用统计**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | 以正式入选资格及后台为准 |
| 接入 | 报名审核与账户凭据 |
| Base URL | 待官方接入页核验 |
| 免费类型 | 创作者申请赠额／待核验 |
| 鉴权 | 报名审核与账户凭据 |
| 免费额度 | 官网线索涉及创作者赠额，确数与条款待官方可读页面复核 |
| 重置周期 | 一次性候选；待核验 |
| 有效期 | 待核验 |
| 地区 | 待核验 |
| 支付／实名门槛 | 报名资格、实名和支付门槛待核验 |
| 隐私政策 | 待核验 |
| 核实结论 | 仅官方候选发现；本期尚未取得可合法调用的独立账户并通过三次最小请求与较长任务。 |
| 证据状态 | 官方页面本期正文不足，待核验 |

> [!warning]
> 不得把文档列名当成接口可用；不得绕过报名、实名或支付验证。

- 官方来源：https://www.ant-ling.com/

---

## 重点提醒

- Groq 官方退役记录显示 qwen/qwen3.6-27b 已于 9 月 14 日停止免费／开发者层调用；本机精确型号路由已禁用，继任 qwen/qwen3.8-27b 仍可用。
- 硅基流动本账户 402 只说明账户余额不足，不能宣告平台免费服务失效。
- Pollinations 本期公开目录可读，但匿名 Chat 四次均返回 500。
- OpenRouter 和 Agnes 都出现先失败后恢复，不适合承诺无中断生产。
- 机构限定、一次性赠额和开源自托管不参与公众周期免费云 API 计数。

## 我的接入优先级

- 先用本期四次真实调用均有效的 Gemini Chat／Embedding 与 Groq 指定模型做非敏感测试。
- OpenRouter 和 Agnes 可作备选，但应让客户端有显式错误提示和切换策略。
- 账户级未核验的平台，先查看官方后台权益和隐私条款，再做同类型最小请求。

> [!summary] 最终结论
> 按本期合法真实请求，3 个平台达到“可调用”最低闸门；这不是长期稳定榜单。未测到的不是失效，广告页上的零价也不是一次真实返回。


---

## 🧰 我做的工具

这些工具都由我持续维护。预览版会明确标注，下载、更新和已知边界以发行页为准。

> [!info] 黑粉剪辑 HyphenCut
> **状态：** 初步构建 · 预览版
>
> Rust 写的本地专业视频剪辑：达芬奇键位、AI 助理直接改真实工程，免费
>
> [下载与更新](https://github.com/HackerChi-Hub/HyphenCut-Releases/releases)

> [!info] 黑粉盒子 HyphenBox
> **状态：** 初步构建 · 预览版
>
> 免费大模型 API 雷达：持续复测可用性，本地统一接口，Key 只存本机
>
> [下载与更新](https://github.com/HackerChi-Hub/hyphenbox-release/releases)

> [!info] 方寸智匣 LocalBrain
> **状态：** 正式迭代
>
> 本地模型的多模态 MCP 工具箱：TTS / Whisper / 视频生成一站接入
>
> [下载与更新](https://github.com/HackerChi-Hub/localbrain-releases/releases)

> [!info] ScreenLex 光影词库
> **状态：** 正式迭代
>
> 看美剧顺手把生词背了，Mac/Windows 双平台，免费
>
> [下载与更新](https://github.com/HackerChi-Hub/screenlex-download/releases)

> [!info] 黑粉录屏 HyphenScreen
> **状态：** 初步构建 · 预览版
>
> 录屏 + 智能剪辑一体：达芬奇式时间线、自动打码、导出前成片体检，免费
>
> [下载与更新](https://github.com/HackerChi-Hub/HyphenScreen-Releases/releases)

---

> [!quote] 黑粉科技
> **让AI成为你的超能力**
> 本地部署 · 免费白嫖 · 自制软件
> https://hyphentech.top
