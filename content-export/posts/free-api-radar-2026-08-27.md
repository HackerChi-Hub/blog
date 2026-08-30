---
title: 免费/限免大模型 API 汇总：GLM-5.3-Flash、Qwen3.8、Coding GLM
slug: free-api-radar-2026-08-27
status: published
date: 2026-08-27
updated: 2026-08-27
summary: GLM-5.3-Flash、Qwen3.8 与 Coding GLM 免费接口复核：能不能用、怎么接、额度与隐私风险一次看清。
categories:
  - 资源分享
tags:
  - AI
  - 免费白嫖
cover: https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/cover-8d988a58de.jpg
legacy_paths: []
notion_id: 3c999968-1bdb-814a-937a-ecb41556c989
---

> [!note]
> 本文首发于黑粉科技公众号

## 2026-08-27 免费/限免大模型 API 汇总：GLM-5.3-Flash、Qwen3.8、Coding GLM

> 专题日期：2026-08-27 · 二次复核：2026-08-28

> [!note]
> 黑粉科技

---

> [!note]
> 结论先说：能用，但只能先按测试资源看，别放隐私数据。免费档和限时活动变化很快，接入前必须重新查看模型页、账户控制台与实际账单。

> [!note]
> 这是一份 2026-08-27 专题快照，并在 2026-08-28 做了二次复核：B.AI 的两款 0 Credits 仍有官方页确认；AIHubMix 的免费总页与单模型页限额口径不一致；Empero 正在维护切换；TokenRouter 已出现 Qwen3.8 Max 免费模型页；HiLinkup 当前公开模型目录未列出 GLM-5.3-Flash。

### ▍一句话推荐

- 想最快接入 Cursor、Cline、Claude Code 类工具：先看 B.AI 与 AIHubMix；两家都有可核的官方模型页或免费模型页。

- 想拿 Qwen3.8 免费入口：TokenRouter 已有 qwen/qwen3.8-max-free 官方模型页；TokenHarbor 免费档则明确包含 Qwen3.8 27B。

- Empero 原本接入最省事，但 2026-08-28 官方页显示正在维护切换，恢复前不要把它当作当前可用入口。

---

### ▍核实速查

| 平台 | 当前核实 |
| --- | --- |
| B.AI | 当前 0 Credits，限时活动 |
| AIHubMix | 免费模型，公开页限额口径冲突 |
| TokenRouter | 免费模型页已确认，额度待登录核对 |
| TokenHarbor | 免费档有轮换额度 |
| Empero | 当前维护切换，恢复后再测 |
| Cline | 轮换免费活动确认，具体 GLM 活动需登录复核 |
| HiLinkup | 当前公开目录未确认 GLM-5.3-Flash |

※ 专题日期 2026-08-27；状态复核于 2026-08-28

> [!note]
> 本稿只收录服务方公开提供的免费或限免入口。泄露的私人密钥、来源不明的共享账户、轮换密钥池、绕额度中转站、盗刷或伪造地区取得的额度，一律不收录、不测试、不转发。

---

---

### ▍B.AI

**当前 0 Credits，限时活动**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | GLM-5.3-Flash、Qwen3.8-Flash |
| 接入 | 注册后通过 B.AI API 或 Chat 使用；最终结算以平台显示和账单记录为准。 |
| Base URL | 以 B.AI 控制台当前接入说明为准 |
| 核实结论 | 官方模型页和 Promotions 页面都明确写明：两款模型的 API 当前按 0 Credits 结算，不收输入、缓存写入、缓存读取和输出 token 费用；活动结束后恢复标准参考价。 |
| 证据状态 | 官方页面当前确认 |

> [!note]
> 这是限时活动，不是永久零价。Chat 免费开始时间仍以模型实际上线为准。

- 官方来源：https://docs.b.ai/llmservice/models/glm-5-3-flash/

- 官方来源：https://docs.b.ai/llmservice/models/qwen3-8-flash/

- 官方来源：https://docs.b.ai/llmservice/promotions-and-pricing-notices/

![# B.AI 官方活动页：GLM-5.3-Flash 与 Qwen3.8-Flash 当前 API 按 0 Credits 结算 · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-01-6c0ea50936.png)

![# B.AI 官方活动页：Qwen3.8-Flash 当前 API 按 0 Credits 结算 · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-02-45b845220c.png)

---

---

### ▍AIHubMix

**免费模型，公开页限额口径冲突**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | coding-glm-5.3-free、coding-glm-5.3-flash-free |
| 接入 | Base URL 为 https://aihubmix.com/v1；需要注册并创建自己的 API Key。 |
| Base URL | https://aihubmix.com/v1 |
| 核实结论 | 两款单模型页都标输入、输出与缓存读取为每百万 token 0 美元，并给出 OpenAI-compatible 调用示例。 |
| 证据状态 | 官方页面确认，但限额口径冲突 |

> [!note]
> 单模型页写每分钟 5 次、每天 500 次、每天 100 万 token；2026-08-27 更新的免费总页则写未充值前共享 10 次试用，充值至少 1 美元后共享每分钟 10 次、每天 100 次、每天 100 万 token。两页口径冲突，接入前以账户控制台为准。

- 官方来源：https://aihubmix.com/model/coding-glm-5.3-free

- 官方来源：https://aihubmix.com/model/coding-glm-5.3-flash-free

- 官方来源：https://aihubmix.com/models/free

![# AIHubMix 单模型页：Coding GLM 5.3 Flash 免费模型与零价信息 · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-03-c5f85b2feb.png)

![# AIHubMix 免费模型总页：试用与充值后共享日配额规则 · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-04-14cad48474.png)

---

---

### ▍TokenRouter

**免费模型页已确认，额度待登录核对**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | qwen/qwen3.8-max-free |
| 接入 | OpenAI、Claude 与 Gemini 兼容的统一模型网关；官方模型页示例使用 https://api.tokenrouter.com/v1。 |
| Base URL | https://api.tokenrouter.com/v1 |
| 核实结论 | 官方模型页已列出 qwen/qwen3.8-max-free，输入和输出价格都标为每百万 token 0 美元，支持 OpenAI-compatible chat/completions。 |
| 证据状态 | 官方模型页当前确认 |

> [!note]
> 官方页同时提醒免费算力有限，服务稳定性与并发不作保证；公开模型页也没有给出可长期承诺的调用次数或 token 配额，仍需登录控制台核对。

- 官方来源：https://www.tokenrouter.com/models/qwen/qwen3.8-max-free/

- 官方来源：https://www.tokenrouter.com/

![# TokenRouter 官方模型页：Qwen3.8 Max 免费模型输入输出价格为 0 · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-05-deaace89a5.png)

---

---

### ▍TokenHarbor

**免费档有轮换额度**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | 免费档包含 Qwen3.8 27B、DeepSeek V4 Flash、MiMo V2.5；GLM 5.3 Flash 属 Agent Pass |
| 接入 | 一个 OpenAI-compatible API；免费档无需信用卡。 |
| Base URL | 以 TokenHarbor 控制台接入信息为准 |
| 核实结论 | 官方定价页确认 Free 为每月 0 美元，含免费月度 allowance 和轮换模型阵容；Qwen3.8 27B 在免费档内。 |
| 证据状态 | 官方定价页当前确认 |

> [!note]
> GLM 5.3 Flash 出现在 Agent Pass 增加模型中，Free 档明确标为 not included，不能写成免费档。

- 官方来源：https://tokenharbor.ai/pricing

![# TokenHarbor 官方定价页：Qwen3.8 27B 在免费档，GLM 5.3 Flash 属 Agent Pass · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-06-12098b97f8.png)

![# TokenHarbor 官方定价页模型分档：GLM 5.3 Flash 不在 Free 档 · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-07-554be834e4.png)

---

---

### ▍Empero

**当前维护切换，恢复后再测**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | 官方页显示 GLM 5.3 Flash，并称正在准备 Qwen3.8-Flash-Next 免费端点 |
| 接入 | 历史公开入口为 https://free.empero.org/v1；原页面说明为 OpenAI-compatible，任意 key 可用。 |
| Base URL | https://free.empero.org/v1 |
| 核实结论 | 2026-08-28 官方页面显示 MAINTENANCE，正在切换免费端点，API 请求会返回结构化维护错误。当前不能再写成最省事的可用入口。 |
| 证据状态 | 官方页当前为维护状态；隐私披露来自此前官方页 |

> [!note]
> 此前官方页明确披露 prompts 和 completions 会与 hashed IP 一起记录，用于改进开源模型。即使恢复，也只适合公开代码、测试和 prompt 回归，不适合账号、密钥、客户数据或私有仓库。

- 官方来源：https://free.empero.org/

- 官方来源：https://free.empero.org/v1

![# Empero 官方页：免费端点正在维护切换 · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-08-c74575f8a1.png)

---

---

### ▍Cline

**轮换免费活动确认，具体 GLM 活动需登录复核**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | 官方社媒曾宣称 Cline 内 GLM-5.3 Flash 免费，官网公开文档未给出稳定活动详情 |
| 接入 | Cline 支持自带 key、自带 endpoint 和任意 OpenAI-compatible API。 |
| Base URL | 由所选上游服务提供，不是 Cline 自身固定免费网关 |
| 核实结论 | Cline 官方文档确认会轮换提供限时免费模型，任何 Cline 账户都可使用当前带 FREE 标签的模型；同时它也支持任意 OpenAI-compatible endpoint。 |
| 证据状态 | 官方文档确认轮换免费活动与接入能力；具体 GLM 活动需登录复核 |

> [!note]
> 公开文档没有固定列出当前具体免费模型，因此“Cline 内 GLM-5.3 Flash 免费”仍要以登录后的 IDE 或 CLI 模型选择器为准。

- 官方来源：https://cline.bot/

- 官方来源：https://docs.cline.bot/provider-config/openai-compatible

- 官方来源：https://docs.cline.bot/getting-started/free-models

![# Cline 官方文档：支持自定义 OpenAI-compatible API endpoint · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-09-6007e52e87.png)

![# Cline 官方文档：免费模型按轮换、限时方式提供 · 2026-08-28](https://hyphentech.top/obsidian-assets/free-api-radar-2026-08-27/image-10-97dc567a40.png)

---

---

### ▍HiLinkup

**当前公开目录未确认 GLM-5.3-Flash**

| 项目 | 核实内容 |
| --- | --- |
| 可用模型 | 公开目录当前可见 GLM-5.3，但未列出 GLM-5.3-Flash |
| 接入 | 系统升级公告要求使用新地址 https://api.hilinkup.com，并采用渠道/模型ID格式。 |
| Base URL | https://api.hilinkup.com |
| 核实结论 | 模型路由 https://hilinkup.com/models/glm-5-3-flash 当前只返回通用 SPA 页面；2026-08-28 读取官方 public/models 目录也未找到 GLM-5.3-Flash。 |
| 证据状态 | 官方公开目录未确认 |

> [!note]
> “2026-08-27 至 2026-09-02 限时免费”缺少可稳定打开的官方活动页，暂不写成已确认优惠。

- 官方来源：https://hilinkup.com/models/glm-5-3-flash

- 官方来源：https://hilinkup.com/api/v1/public/models

- 官方来源：https://hilinkup.com/api/v1/public/announcements

---

---

### ▍重点提醒

- 免费不等于适合放隐私：Empero 曾明确披露会记录 prompt、回复与 hashed IP；只把它用于非隐私测试。

- AIHubMix 的限额要分页面看：单模型页与免费总页当前口径冲突，真正调用前看账户控制台。

- TokenHarbor 不要误写 GLM 免费：免费档有 Qwen3.8 27B，GLM 5.3 Flash 在 Agent Pass。

- TokenRouter 的免费模型页已经落地，但免费额度数字仍未公开；HiLinkup 则仍缺稳定活动证据。

---

### ▍我的接入优先级

- 接 Cursor、Claude Code 或 OpenAI-compatible Agent：优先试 B.AI、AIHubMix。

- 找 Qwen3.8 免费入口：先看 TokenRouter 的 qwen/qwen3.8-max-free，再看 TokenHarbor 的 Qwen3.8 27B 免费 allowance。

- 想用 Empero：先等维护结束，再发最小真实请求；任何时候都不要传隐私。

- 长期稳定跑项目：不要只看零价，重点核对隐私策略、限流、失败率、商用条款和生产使用许可。

---

> [!note]
> 最终结论
> 
> 这波免费模型可以薅，但应当按测试资源而不是生产基础设施来用。当前最值得先试的是 B.AI 的 0 Credits GLM/Qwen 与 AIHubMix 的 Coding GLM 免费模型；TokenRouter 已有 Qwen3.8 Max 免费模型页；TokenHarbor 适合找 Qwen3.8 27B 免费 allowance；Empero 先等维护恢复；HiLinkup 的 GLM-5.3-Flash 限免仍需官方活动页或登录控制台确认。
