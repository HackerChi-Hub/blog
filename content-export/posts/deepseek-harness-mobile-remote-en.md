---
title: "DeepSeek Harness mobile remote control: Run tasks on your computer, check progress and send requests on the internet"
slug: deepseek-harness-mobile-remote-en
status: published
lang: en
translation_of: deepseek-harness-mobile-remote
article_type: "article"
translation_source: machine
source_sha256: 547f93e05849054f
date: 2026-10-23
updated: 2026-10-23
summary: "The phone watches the original session, while the computer continues execution. Test results, pairing fixes, and the three-platform scripts also clarify the boundaries that have not yet been accepted."
categories:
  - Tech
tags:
  - AI
cover: "/obsidian-assets/deepseek-harness-mobile-remote/cover-959d9a32e5.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/deepseek-harness-mobile-remote/) is authoritative.

> [!abstract]
> The phone watches the original session, while the computer continues execution. Test results, pairing fixes, and the three-platform scripts also clarify the boundaries that have not yet been accepted.
> HyphenTech · 2026-10-23

The AI on the computer is revising code and running builds, but I can't just sit in front of the screen all the time. After leaving, how far has it gotten? Has it given any errors? When I need to adjust direction, can I just pull out my phone and keep talking?

This is where I started adding the phone entry point to DeepSeek Harness. The recent LocalBrain build task has been handed over to the local Harness relay, and I want to see the results of the same task outside and continue to send out requests.

Now, **the phone can access via HTTPS web and see the original session on the computer**. Independent web message acceptance is also completed: when a request is issued, the original model returns "Remote web message received." The task is still handled by the program on the computer, while the phone is responsible for viewing and operating it.

![Web Message Acceptance](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-web-message-74a6376fd4.jpg)

The image above is from this round of independent web acceptance and uses the MiniMax model selected at the time; The interface records that this simple reply took 1 second. It verifies web message sending and reception, **not counting this second as execution speed for complex tasks, nor as a mobile tool approved for actual testing**.

## If you connect the phone, why not start another round of conversation?

What I need is to continue looking at the task on the computer. Open a separate chat window on your phone and explain the previous requirements again; it's easy for issues like records and file states on both sides to differ.

You can think of it as: you open a chat in WeChat on your computer, but the phone still sees the same record. Here, the relationship is similar—the original session is kept in the original Host, which is the process on the computer responsible for the session and tool execution, and the mobile webpage connects to it.

![Process Illustration | Same Session](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-same-task-1c400d9c1a.png)

Therefore, the phone does not gain computing power from the computer just by connecting, nor does it need to download new models. The computer must stay on, and the Harness and network entry must operate normally. When the phone is disconnected, the gateway will not resubmit the previous command for you; Whether tasks continue and how to recover are still managed by the original Harness.

This means that the name DeepSeek Harness does not require you to use a specific DeepSeek model. This web acceptance retains the existing model configuration but adds access and management capabilities.

## The most frustrating part is that the page can clearly open but can't be entered

Step one: After mapping the public port open, the phone could open the page, but clicking pairing prompted the pairing code was invalid. Later, the server confirmed the pairing was successful, but the phone still showed "Browser source verification failed." Just by looking at the page, it's easy to think the only step left is to refresh the browser.

In reality, **network arrival, user pairing, and browser source verification are three things that must be passed separately. For example, when a package enters a residential community: if the address is correct, you can find the entrance, the pickup code confirms who is picking it up, and the access control then checks whether the entry complies with the rules. If the website is connected, it only proves the entrance has been found.

![Process Redrawing | Pairing to Entry](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-pairing-steps-4a232b92c4.png)

The problem lies in the entry method. When entering the browser via a link or QR code in the chat app, the first page navigation may be marked as "from another website." The previous checks blocked this normal entry as well.

During the fix, only the top-level page navigation of the homepage and login page was allowed. The interfaces for actual task reading, write requests, and establishing real-time connections still checked according to the original source constraints. They did not release all cross-site requests just to "finally get in."

![Return Records | Page and interface checked separately](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-source-check-47b487156a.png)

In the repaired records, cross-site access to the homepage returns 303, moving to the login page; Login page returns 200; Write requests from external sites still return 403 and are rejected. Then the mobile device confirms: "Entered, you can see the original session." ”

I think this step is very representative. The real difficulty with remote tools is often not mapping a port out, but ensuring normal use passes smoothly and letting requests that shouldn't be approved remain outside the door.

## HTTPS, matching code, and login credentials—what do they each relate?

HTTPS protects the communication from the phone to the entry point and asks the browser to verify which service is connected. It's like sealing a package and verifying the recipient address, but the service still needs to determine who the visitor is. ** There is a certificate, but login authentication is still required. **

The official deployment instructions for DeepSeek Harness clearly distinguish these aspects: external address declaration, permitted access sources, login credentials, and encrypted transmission, each serving different purposes. Existing deployments can be configured according to the official documentation; This time, I added an extra layer of personal phone pairing and management in front of the original Host.

- [See DeepSeek Harness official public deployment and HTTPS documentation](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/public-deployments.zh.md)

This external address in the official account will be displayed as text; please copy it into your browser and open it; You can click directly on the Blog version.

![Process Instructions | Private Access](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-access-chain-12093a56a4.png)

Specifically with this tool, the matching code generated locally is valid for ten minutes, but expires after one successful redemption. The mobile browser receives its login credentials and stores them in the browser's managed cookies; The computer's original host credentials remain on the computer and are not sent directly to the phone.

It's a bit like going to the front desk to use a one-time pickup code to exchange for a temporary pass: the pickup code can't be renewed repeatedly, and the pass is only valid for designated entrances. The tool also adds restrictions like HTTPS usage for cookies and that web scripts cannot be read directly.

The "Revoke Login" menu allows all phones to be repaired and unused pairing codes are revoked. Generating a new code will only replace the unredeemed old code; browsers logged in will not be forcibly exited; Restarting the gateway will re-pair the phone.

The current external network solution uses **HTTPS combined with personal pairing authentication**. It does not automatically set up a VPN for you, nor does it turn public network addresses into inaccessible internal networks just because the source code repository is private. Whether the entry point is reachable and who can see the session still need to be managed separately.

## Real-time progress, can't be opened and cut off after ten seconds

Just forwarding the webpage body text is not enough. Task output, execution status, and subsequent operations require a continuous two-way connection. Here, WebSocket is used, which can be understood as a phone call that stays connected all the time: if both parties have new content, they can directly transmit it, without redialing every sentence.

This round retained and checked a detail: the ten-second timeout only restricts the handshake phase when establishing the connection. After a successful connection, this short timeout must be lifted, allowing the task to temporarily have no new outputs. Otherwise, the page will appear normal when first opened, but after a brief quiet, the channel will be disconnected.

![Return Record | Continue sending and receiving after free time](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-stream-check-ff78043a2a.png)

In regression, a two-way connection under HTTPS is actually established. After idle time exceeds the old ten-second threshold, data exchange continues, and cleanup after disconnection is checked. This result indicates that the relevant transmission check passed; Long task recovery after switching between mobile and wireless networks on the phone still requires special acceptance.

## From a single connection to a small tool for long-term management

Running one-time scripts on your own computer is still a way from easy maintenance in the future. I organized this implementation separately into standalone tools: Chinese menus, separate private resource directories, and startup entry points for macOS, Windows, and Linux.

The 0.1.0 portable compressed package is **55,630 bytes, about 55 KB**. This number only refers to the tool source code compressed package: to use it, you need to have Node.js 22 or later installed, and also the official Harness and the actual model environment being called.

![Management Menu | Runtime Record Formatting](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-menu-82df1fd3db.png)

macOS uses manage.command, Windows uses manage.cmd, and Linux runs sh manage.sh. The menu allows you to mount connectors, configure HTTPS, start background services, generate phone pairing entries, diagnose issues, and unsign login; The exit menu keeps background services running.

Connector mounting only adds a set segment of this tool to the original configuration. When removed, only the blocks managed by the user are deleted, while the user configuration added later is retained; When blocks are changed or the path changes, a verification prompt will be provided, and the old file will not be restored in its entirety.

![Operation Instructions | Daily Management](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-management-b122f85f3a.png)

When stopping service, it also distinguishes objects: the tool first checks its own control channel, and when a phone logs in, it will prompt disconnection and revoke login. It will not shut down DeepSeek or the model process just because it finds a process number.

There are two ways to connect external entrances: if HTTPS reverse proxy or private channel is already available, forwarding to the local loopback gateway; If there is already a domain name, certificate, and port mapping, built-in HTTPS can be enabled. The loopback address can be understood as an internal window of the computer, where the phone knocks through the selected external entrance; the original host is not directly open to the public network.

DNS, router mapping, firewall, and certificate renewal are still clearly configured by the existing environment, and the tool will not silently modify it. When a certificate needs to be updated, it can be verified and reloaded to keep the original host and tasks running.

## Where did you get tested this round, and which ones need to be refilled?

The program returns to macOS and Linux isolated containers started with existing caches, **both sides have 20 passes and 0 failures**. Check for override pairing expiration and replay, source restrictions, upstream credential isolation, bidirectional connections, background lifecycle, and precise mounting and removal of configurations.

![Acceptance Record | Viewing Results by Layer](https://hyphentech.top/obsidian-assets/deepseek-harness-mobile-remote/image-verification-3295d1a29b.png)

| Scope | The results that can be confirmed in this round |
| --- | --- |
| There is already a mobile external network access | I have confirmed I have entered and can see the original conversation |
| Independent webpage messages | Actually send the request and receive a model response; Retain the original image |
| The general tool connects to the real Host | After temporary port pairing, the official webpage was read successfully, but the original Host was not restarted |
| macOS system services | Installation, system pull-up, reload, repeated reuse, removal complete |
| macOS/Linux containers are back | 20 items passed each; Container inspection does not replace Linux native desktop acceptance |
| Windows native and Linux login boot automatically | The code and definitions are ready, and native acceptance is pending supplementation |
| Mobile tool approval, network disconnection, and long-term recovery | The special on-site inspection has not yet been completed |

GitHub has also configured automatic regression across three platforms, but this round of assignments was blocked by account billing restrictions before launch, and the testing steps were not actually performed. This was left unfinished, and the workflow file was not written as "tested on all three platforms."

Therefore, this universal portable pack is currently labeled **0.1.0 Preview**. The previously usable phone entry continues to run without being replaced for generalization testing. The temporary test gateway, temporary pairing, and temporary system services have been cleaned up.

## How should it be used now, and who is it suitable for?

It's suitable for those already running Harness on their computers who want to see the same task after leaving the desktop. Phones can reduce the number of times you spend glued to the computer, so the computer's startup, network, model services, and approval processes still function normally.

When authorized to use this tool, the steps are simple: prepare Node.js → open the system management portal → mount connector → configure HTTPS → start and diagnose → generate pairing link → enter on your phone. When existing tasks are running, keep the original entry point and arrange migration when available.

The source code and download package for this tool **remain private** and are only available to myself and authorized collaborators. This article publicly introduces the implementation and verification results, does not provide script downloads for everyone, nor does it disclose my real domain entry points, matching links, or certificates. Readers who wish to build their own can first learn about Harness's public deployment capabilities from the official deployment documentation above.

For me, the most valuable change this time is that when the computer continues to perform the original task, I can return to the same part of the work process on my phone. Next, it's worth adding something specific: real tool approval on the phone, network disconnection and reconnection, long task recovery, and acceptance of native Windows and Linux environments.


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
