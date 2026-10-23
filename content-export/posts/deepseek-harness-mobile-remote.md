---
title: DeepSeek Harness 手机遥控工具：下载、安装与外网使用实测
slug: deepseek-harness-mobile-remote
status: published
date: 2026-10-23
updated: 2026-10-23
summary: 电脑继续跑，手机接着看。下载、安装、配对、外网配置与实测结果，一篇讲清。
categories:
  - 技术分享
tags:
  - AI
  - 远程访问
cover: /obsidian-assets/deepseek-harness-mobile-remote/cover-959d9a32e5.jpg
legacy_paths: []
article_type: article
brand_slogan: 让AI成为你的超能力
---

> [!abstract]
> DeepSeek Harness 手机遥控工具：从下载到外网配对，把实际用法和验收结果讲清。
> 黑粉科技 · 2026-10-23

电脑上的 AI 正在改代码、跑测试，我出门之后还想知道它做到哪一步。重新在手机上开一个聊天窗口，之前的任务、文件和执行记录又接不上。我需要的，是回到电脑上正在进行的那段工作，看看进度，必要时继续交代要求。

这次整理的小工具，就是给 **DeepSeek Harness 加一个手机访问入口**。电脑负责模型和执行，手机用浏览器查看原会话、发送消息，不用另外安装手机应用。已有部署中，我的手机已经能通过外网进入并看见原有会话；另一次独立网页验收，也实际收到了模型回复。

![网页消息实测](/obsidian-assets/deepseek-harness-mobile-remote/image-web-message-74a6376fd4.jpg)

上图是独立网页验收，使用当时选中的 MiniMax 模型，简单回复显示用时 1 秒。这里看的是远程消息能否送达、回复能否回来；复杂任务速度仍由原电脑、模型和网络决定。Harness 可以配置不同模型，工具名称里有 DeepSeek，也不代表它只能使用 DeepSeek 模型。

## 先说值不值得装

如果你已经在电脑上使用 Harness，又经常需要离开桌面，这个入口很实用：让电脑继续工作，人不用一直守着窗口。若你只偶尔问两句，或者还没有把 Harness 跑通，先用好本机版本更省事。

| 项目 | 这份工具的实际情况 |
| --- | --- |
| 名称与版本 | DeepSeek Harness 私有远程管理 · 0.1.0 预览版 |
| 用途 | 手机进入原电脑的 Harness 网页与原有会话 |
| 形式 | 中文菜单和命令行便携工具，无第三方运行依赖 |
| 公开便携包 | ZIP，35,299 字节，约 35 KB |
| 运行前提 | Node.js 22 或以上；电脑已有能正常工作的官方 Harness |
| 平台 | 提供 macOS、Windows、Linux 入口，实际验收程度见后文 |
| 费用边界 | 便携包可免费下载；不包含模型额度，原接口和网络服务按各自方案使用 |

它是我另外整理的辅助工具，**不是 DeepSeek 官方发行的手机应用**。包里也不含 Node.js、模型、Harness 主程序和证书。所谓约 35 KB，说的是公开的连接与管理脚本，不能拿来和完整客户端的安装体积直接比较。开发仓库保持私有，公开包只收录运行文件和使用说明；下载者能够查看包里的运行脚本。

![流程示意｜手机接回原任务](/obsidian-assets/deepseek-harness-mobile-remote/image-same-task-1c400d9c1a.png)

可以把手机理解成接回同一段微信聊天：换了查看设备，原来的聊天还在。这里真正执行任务的电脑也没有换。电脑要保持开机，Harness 和模型服务要可用；手机离线时，工具不会替你重新提交刚才的要求。原任务的运行与恢复仍由 Harness 负责。

## 下载入口与开工前准备

先把这三样准备好：官方 Harness、Node.js，以及这份遥控便携包。已经能在电脑网页里正常对话的人，可以直接从便携包开始；不要为了远程访问，再下载一遍已有模型。

- [官方 Harness：项目与安装说明](https://github.com/deepseek-ai/deepseek-harness)——主程序来自 DeepSeek 官方，先确认本机可以正常收发消息。
- [Node.js：官方中文下载页](https://nodejs.org/zh-cn/download)——选择适合自己系统的长期支持版，并确认满足 22 或以上的要求。

官方当前 README 给出的网页启动方式如下。第一次运行会按 npm 的正常流程获取主程序；还需按官方界面完成模型和使用环境配置。已有安装的人继续用原来的启动方式即可，不必为了照抄这条命令另开一个实例。

```shell
npx @deepseek-ai/dsh web
```

在安装 Node.js 后，重新打开终端，运行下面这条检查。能看到 v22 或更高的大版本号，再继续；若提示找不到 node，先处理运行环境，后面的菜单也依赖它。

```shell
node --version
```

- [遥控工具 0.1.0：公开发行页与版本说明](https://github.com/HackerChi-Hub/deepseek-harness-remote-releases/releases/tag/v0.1.0)。
- [直接下载三平台便携包（ZIP）](https://github.com/HackerChi-Hub/deepseek-harness-remote-releases/releases/download/v0.1.0/deepseek-harness-remote-0.1.0.zip)。
- [下载 SHA-256 校验文件](https://github.com/HackerChi-Hub/deepseek-harness-remote-releases/releases/download/v0.1.0/deepseek-harness-remote-0.1.0.zip.sha256)。
- [查看完整使用说明](https://github.com/HackerChi-Hub/deepseek-harness-remote-releases#readme)。

这是独立的公开下载仓库，无需获得开发仓库授权。选择 deepseek-harness-remote-0.1.0.zip，或者点上面的 ZIP 直链；GitHub 页面中自动生成的 Source code 附件只是下载仓库的文档快照，**不是运行便携包**。访问 GitHub 下载是否需要国际网络，取决于你的实际网络环境。

下载后解压到准备长期保留的目录：连接器和登录自启都会引用工具文件的位置，装好后不要随手移到别处。想核对文件是否完整，可以在 ZIP 所在目录运行对应系统的校验命令，再与旁边的 .sha256 文件比较；文件名必须一致。

```shell
# macOS
shasum -a 256 deepseek-harness-remote-0.1.0.zip

# Linux
sha256sum deepseek-harness-remote-0.1.0.zip

# Windows PowerShell
Get-FileHash .\deepseek-harness-remote-0.1.0.zip -Algorithm SHA256
```

本次公开便携包的 SHA-256：

```text
b46203a7721a15a412d2392bd5018bd3dec006b098f043bac1fefbef3dfbe6e0
```

![操作顺序｜先本机，再手机](/obsidian-assets/deepseek-harness-mobile-remote/image-quick-start-892a58d04e.png)

## 第一步：打开自己系统对应的菜单

| 系统 | 打开方式 | 双击没有启动时 |
| --- | --- | --- |
| macOS | 双击解压目录里的 manage.command | 在该目录的终端运行 sh manage.command |
| Windows | 双击 manage.cmd | 在该目录的 PowerShell 运行 .\manage.cmd |
| Linux | 在解压目录打开终端 | 运行 sh manage.sh |

看到中文菜单后，先认准这次会用到的几个数字：**2 挂载连接器 → 3 配置 HTTPS 入口 → 4 启动 → 6 诊断 → 5 手机配对**。菜单中的 0 是退出管理界面，不会顺带关闭后台网关。

![中文菜单｜实际运行记录排版](/obsidian-assets/deepseek-harness-mobile-remote/image-menu-82df1fd3db.png)

工具会建立自己的私有状态目录，保存入口设置、配对资料和日志。不要把它和便携包一起公开分享。Windows 若受账户权限策略限制，应先查对应目录与计划任务权限，不能用“所有人完全控制”当作通用解决办法。

## 第二步：挂载到你实际在用的 Harness

在菜单输入 2。工具会列出找到的配置补丁文件，你可以选编号，也可以填写实际文件的完整路径。关键是选中当前 Harness 所使用的那一份：桌面与网页 profile 可能各有配置，写进另一份配置，正在运行的窗口自然不会跟着变化。

自动查找的位置包括用户目录下 .dsh/profiles/desktop/cordis.patch.yml、.dsh/profiles/web/cordis.patch.yml 和 .dsh/cordis.patch.yml。使用自定义目录时自己选路径；不要把模型配置、证书文件或整个文件夹误当作补丁文件。

这个动作只加入连接器配置，不会自动启动检查、重新提交任务或重启 Harness。若 Host 没有自动加载新连接器，等当前任务空闲后，再按原来的方式重启 Host。已经挂载过旧手机连接器时，工具会提示核对，先确认迁移方式，不要重复往同一配置叠加。

## 第三步：选一种真正能到达电脑的网络入口

菜单输入 3，会出现三种模式：仅本机、已有 HTTPS 反向代理或私有通道、内置 HTTPS。**“仅本机”适合先检查电脑端，手机不能靠这个模式直接从外网访问。** 后两种才是远程使用时要按环境选择的方案。

![接入示意｜两种远程入口](/obsidian-assets/deepseek-harness-mobile-remote/image-network-options-9fc5fa6a8e.png)

### 已有 HTTPS 反向代理或私有通道

在入口模式中选 2，填写自己已经可以访问的完整 HTTPS 地址。反向代理就像门口的收发室：先接住浏览器请求，再交给电脑上的网关。此方案把代理目标设为 `http://127.0.0.1:8766`，只连接遥控网关，不直接暴露原始 Host。

这个版本要求入口使用独立域名的根路径，不能把它随意挂到某个网站的 /deepseek/ 子目录。代理还需支持 WebSocket，保留浏览器使用的 Host、Origin 和 Cookie。WebSocket 用来持续传递新消息，像通话接通后保持线路；首页能显示，并不代表这条持续连接也配置好了。

下面以 Caddy 配置说明目标关系。remote.example.test 是占位域名，不能直接使用。只有在你已经安装并管理 Caddy 的情况下，才把域名换成自己的实际入口，按现有部署方式加载配置；这几行不会替你安装私有通道。

```caddyfile
remote.example.test {
    reverse_proxy 127.0.0.1:8766
}
```

### 使用路由器端口映射与内置 HTTPS

在入口模式中选 3。它适合已经有域名和有效证书，准备将家里电脑的指定端口映射出去的人。菜单会依次询问完整 HTTPS 入口、本机网卡 IP、HTTPS 监听端口、完整证书链路径和私钥路径。

| 需要填写的内容 | 应怎样核对 |
| --- | --- |
| HTTPS 入口 | 浏览器最终使用的完整地址；使用非默认端口时带上 :端口 |
| 本机网卡 IP | 路由器能够到达的这台电脑地址；换网后可能需要重新配置 |
| HTTPS 端口 | 选择空闲端口，并与路由器的 TCP 转发目标一致 |
| 证书链与私钥 | 使用自己的文件，证书覆盖实际访问的域名且仍有效 |
| DNS 与防火墙 | 域名解析正确；只开放本次入口所需的访问 |

例如选择 19527，就要逐项对照“公网 TCP 19527 → 这台电脑的内网地址:19527”，电脑端也监听相同的目标端口。端口号本身没有特殊能力，换一个空闲端口同样可以。**域名解析、端口映射和防火墙放行是三件事**：有了域名，不代表请求已经送到电脑。

HTTPS 证书负责让手机核对“是不是我要连接的这个地址”，配对码再负责让电脑核对“是不是本人授权的手机”。这像先找对门牌，再用自己的钥匙开门，两项都要成立。工具会检查导入证书与私钥是否匹配、域名是否覆盖和有效期，失败时不会改成公开明文服务。

![流程示意｜加密与配对](/obsidian-assets/deepseek-harness-mobile-remote/image-access-chain-12093a56a4.png)

没有公网映射条件的人，可以先准备合适的私有通道或 HTTPS 反向代理，再使用上一个方案。工具不会自动替你穿透运营商网络，也不会修改路由器、VPN 或防火墙来假装“已接通”。证书的申请和续期由原来的证书管理流程负责。

## 第四步：先诊断，再拿手机配对

完成配置后，在菜单输入 4 启动，再输入 6 诊断。这里要看两个结果：一是网关服务已运行，二是原 Harness 的网页已经认证成功。前者只是接待入口开了，后者才说明入口后面接到了原来的工作环境。

![诊断要点｜网关与原服务分别看](/obsidian-assets/deepseek-harness-mobile-remote/image-diagnostic-guide-875a2bfe61.png)

使用命令行时，在工具解压目录运行下面两条。status 里核对 running；doctor 里进一步核对 upstream.authenticatedHTTP，正常接入时应为 true。若后者为 false，先检查是否挂载了正确 profile，以及 Host 是否加载连接器，别急着反复配对。

```shell
node bin/dsh-remote.mjs status
node bin/dsh-remote.mjs doctor
```

然后输入菜单的 5，生成手机配对入口。打开工具提示的本机“手机连接.html”，把其中最新的完整链接交给自己的手机，在手机系统浏览器里打开并点击“确认连接”。链接带有一次性配对码，**十分钟有效、兑换一次即失效**；不要把它放进公开截图、群聊或教程。

第一次检查可以先用家中网络确认页面，再关闭手机无线网络，用移动网络重新打开同一个已配对入口。能从移动网络看见原会话，才说明本次外网路线可用。这里说的是读者应如何核对；本轮没有把真实手机切网后的长任务恢复列为已验收。

进入后，先选一个无关紧要的测试会话，发送“只回复：远程连接正常，不调用工具”。能看见回复，再回到原来的正式任务。需要调整工作时，写清“继续哪项任务、修改什么、哪些不要动”，原 Harness 的工具权限和执行批准仍然有效。手机上的真实工具批准流程，本轮还没有单独完成验收。

## 我实际测到了什么？

真实接入时，最先遇到的问题是页面能打开，配对却进不去。最初手机反馈配对码无效；后来服务端确认配对成功，浏览器仍提示来源检查拒绝。修复正常页面导航后，我的手机才确认“已进入，能看到原有会话”。所以验收不能只停在一个登录页，也要继续看会话和收发结果。

![接入记录｜从配对到原会话](/obsidian-assets/deepseek-harness-mobile-remote/image-pairing-steps-4a232b92c4.png)

这次没有把安全检查整块关掉：正常进入首页、登录页的顶层导航可以继续，来自其他网站的写入请求仍被拒绝。持续连接也做了单独回归，空闲十一秒后仍可双向收发。这些检查支撑的是接入和传输行为，不是模型的答题能力或所有手机网络条件。

| 实测项目 | 结果与边界 |
| --- | --- |
| 本人手机外网访问 | 已进入，并确认能看见原有会话 |
| 独立网页消息收发 | 实际发出请求并收到模型回复；简单回复显示 1 秒 |
| 新临时网关接真实 Host | 完成配对并读取官方网页，原服务未重启 |
| macOS 程序回归 | 20 项通过，0 项失败 |
| Linux 隔离容器回归 | 20 项通过，0 项失败；不代替原生桌面验收 |
| macOS 登录自启 | 完成安装、系统拉起、重复复用、回读和移除；未真实注销再登录 |
| Windows 与 Linux 原生环境 | Windows 权限、计划任务与 Host，以及 Linux 登录自启仍待实测 |
| 手机长任务使用 | 真实工具批准、切网重连与长时间恢复仍待专门验收 |

![验收结果｜按环境区分](/obsidian-assets/deepseek-harness-mobile-remote/image-verification-3295d1a29b.png)

本次公开包去掉了开发测试与工作流，补齐面向读者的说明，13个运行文件与上述已测版本逐字节一致。发包范围调整没有增加新的平台通过项。三平台启动脚本已经提供，但现阶段更适合有现成 Harness 和网络入口、愿意先做小任务确认的用户。

Windows 用户尤其要按自己的账户权限测试，不能把 Linux 容器的通过记录当成 Windows 已经跑过。GitHub 三平台自动回归曾因账户计费限制未能启动，也没有计算在通过项中。

## 平时怎样管理、升级和移除？

第一次配好后，不必每次重做全部步骤。平时先看状态，需要连接新浏览器时生成新配对码；手机遗失、借出或怀疑链接被别人拿到时，在菜单输入 8 撤销登录。它会撤销所有手机浏览器登录和未兑换码，电脑原任务继续由 Harness 管理。

![日常管理｜状态、配对与撤销](/obsidian-assets/deepseek-harness-mobile-remote/image-management-956bb2af97.png)

```shell
node bin/dsh-remote.mjs status
node bin/dsh-remote.mjs pair
node bin/dsh-remote.mjs revoke
```

菜单输入 9，可以选择登录后自启。macOS 用当前用户 LaunchAgent，Windows 用当前用户计划任务，Linux 用用户 systemd 服务，均不主动提升为管理员。公司电脑的策略、没有 systemd 的 Linux 环境，可能不允许对应方式；这时先保持手动启动即可。

菜单输入 7 是停止这份网关；已有手机登录时会先提示确认。退出菜单用 0，后台继续运行。重启网关会使手机重新配对，因此原任务正在执行、手机入口也在使用时，不要仅为换文件而突然停止。

升级时，等空闲后停止工具，使用新版文件替换原工具目录，保留独立的私有状态目录，再启动并重新配对。若连工具目录的位置都换了，应从旧位置先解除连接器与自启，再在新位置挂载，避免两个位置互相抢占。

完全不再使用时，在原工具目录运行下面的移除命令。默认解除连接器与登录自启，保留私有资料；程序只删除自己管理的配置区块，后来加的用户设置会保留。区块被手工改动时它会要求核对，不整份覆盖回旧文件。

```shell
node bin/dsh-remote.mjs uninstall
```

## 连不上时，按现象排查

| 现象 | 先查什么 |
| --- | --- |
| 菜单一闪就关，或提示没有 node | 重新打开终端检查 node --version；从解压目录运行对应入口看报错 |
| 诊断网关正常，但没有原会话 | 查看 upstream.authenticatedHTTP；核对当前 profile 与 Host 是否已加载连接器 |
| 手机页面打不开 | 分别检查 DNS、路由器 TCP 映射、电脑监听地址、防火墙和证书 |
| 提示配对码无效 | 生成最新配对页；用十分钟内尚未兑换的完整链接在系统浏览器打开 |
| 提示来源校验未通过 | 核对完整 HTTPS 入口；检查代理是否改写 Host 或 Origin，不关闭检查兜底 |
| 首页能开，新消息不更新 | 检查代理的 WebSocket 转发与读取超时，不只测首页 HTTP 200 |
| 证书到期或域名不匹配 | 先由原证书管理器处理，更新工具正在使用的证书文件后执行 reload-cert |

公众号外链能否直接点击取决于平台和当前展示方式；若地址显示为文字，请复制到系统浏览器访问。Blog 对应正文保留可点击的下载和文档入口。请求帮助时，只提供脱敏后的诊断结果，不贴配对完整链接、Cookie、私钥或真实会话内容。

我对这个工具目前的判断很明确：它已经解决了“人离开电脑，还想接着看同一项任务”的实际问题；第一次配置仍需要你具备可达的 HTTPS 网络入口。先按教程做一次无工具的小消息收发，再把正式任务交给它，能更快分清问题出在电脑、网络，还是配对环节。

[官方公开部署说明](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/public-deployments.zh.md)可用于继续了解原 Host 的地址公告、可信主机与 TLS。本文遥控工具目前只支持根路径入口，配置时以本工具本版要求为准。


---

## 🧰 我做的工具

这些工具都由我持续维护。预览版会明确标注，下载、更新和已知边界以发行页为准。

> [!info] 黑粉盒子 HyphenBox
> **状态：** 正式迭代
>
> 免费大模型 API 雷达：持续复测可用性，本地统一接口，Key 只存本机
>
> [下载与更新：黑粉盒子 HyphenBox](https://github.com/HackerChi-Hub/hyphenbox-release/releases)

> [!info] 方寸智匣 LocalBrain
> **状态：** 正式迭代
>
> 本地模型的多模态 MCP 工具箱：TTS / Whisper / 视频生成一站接入
>
> [下载与更新：方寸智匣 LocalBrain](https://github.com/HackerChi-Hub/localbrain-releases/releases)

> [!info] ScreenLex 光影词库
> **状态：** 正式迭代
>
> 看美剧顺手把生词背了，Mac/Windows 双平台，免费
>
> [下载与更新：ScreenLex 光影词库](https://github.com/HackerChi-Hub/screenlex-download/releases)

> [!info] 黑粉录屏 HyphenScreen
> **状态：** 正式迭代
>
> 录屏 + 智能剪辑一体：达芬奇式时间线、自动打码、导出前成片体检，免费
>
> [下载与更新：黑粉录屏 HyphenScreen](https://github.com/HackerChi-Hub/HyphenScreen-Releases/releases)

---

> [!quote] 黑粉科技
> **让AI成为你的超能力**
> 本地部署 · 免费白嫖 · 自制软件
> [黑粉科技](https://hyphentech.top)
