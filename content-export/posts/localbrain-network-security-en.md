---
title: "LocalBrain Network Security Test: Locked in an isolated sandbox, it doesn't run by default, only released after authorization"
slug: localbrain-network-security-en
status: published
lang: en
translation_of: localbrain-network-security
translation_source: machine
source_sha256: 5b573a1e6d0670c0
date: 2026-10-03
updated: 2026-10-03
summary: "LocalBrain adds proactive network testing for authorized targets: only performs low-impact checks for connection and response heads, locking isolated sandboxes constructed with zero exits; Default disable, local test site reverse verification passes all five items before release, isolation automatically locks once offline. Clicking the mouse throughout the process means no need to touch the terminal."
categories:
  - Tech
tags:
  - AI
  - Local deployment
  - Self-made software
  - LocalBrain
  - Security
cover: https://hyphentech.top/obsidian-assets/localbrain-network-security/cover-026300dac1.jpg
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/localbrain-network-security/) is authoritative.

> [!abstract]
> LocalBrain adds proactive network testing for authorized targets: only performs low-impact checks for connection and response heads, locking isolated sandboxes constructed with zero exits; Default disable, local test site reverse verification passes all five items before release, isolation automatically locks once offline. Clicking the mouse throughout the process means no need to touch the terminal.
> 2026-10-03·HyphenTech

# LocalBrain Network Security Test: Locked in an isolated sandbox, it doesn't run by default, only released after authorization

In the past couple of days, I added a feature to LocalBrain that even I hesitated to do: proactive network testing on authorized targets. To put the conclusion first—it defaults to **not running**, and I spend much more effort on "making it run" than on "making it run."

Why would a local AI toolbox touch something as dangerous as network testing? Because I have my own needs: I have several machines and services on hand, wanting to casually check whether a port is open and whether a service's response head is correct. But once these capabilities are integrated into a tool that can be driven by conversation, the first reaction should be caution—what if the model initiates it itself? What if it points to an address it shouldn't? What if it follows the network and finds something else on my local machine? This article will explain how I block each of these three "what ifs" one by one.

## Let's first talk about what it can and cannot do

The second stage (I divide network security into two stages, which I'll explain later) can only be done with two types of low-impact checks: **connection check** (whether a port on a certain IP is connected) and **HTTP response head check** (take back the response header and check). That's it. It's not a full-function scanner, no port range scanning, no attack payload, and no destructive actions.

The targets that can be tested are also tightly blocked: **must be a single and definite IP**—does not accept domain names, network segments, wildcards, and even bypasses IPv4 mapping addresses are rejected; Up to 8 ports at once; Valid for 1 to 60 minutes; Up to 8 authorizations can be attached simultaneously; And all are stored only in memory, **once you exit the application, it's gone**. To test local or intranet, you have to check a separate authorization; without it, you can't even point to 127.0.0.1.

These restrictions are not suggestions but hard thresholds in the code; if you fill in a wrong one, it will be rejected immediately.

## The first "what if": Will the model start on its own?

No. This one is the foundation.

All the operations in the second phase—creating authorization, running validation, running tests—are all buttons you click yourself in the settings interface, not a single tool registered as a tool the model can call. No matter how much the model says "Let me test it for you" in the dialogue, it can't call these commands because those commands aren't in its toolkit. Authorization requires you to check "I confirm I have test authorization for this target," and you must confirm again each time you run.

Shifting 'can measure' from 'whether the tool is willing' to 'whether the person grants authorization' is the first line I use when using any dangerous ability.

## The second 'what if': Will it point somewhere it shouldn't or touch something else on the device?

This was the most painstaking part; I tried two different approaches to get it right.

The test had to run in an isolated environment. I chose Colima and Docker—to build the smallest dedicated Linux virtual machine (2 cores, 2GB, `--mount none`, not any local directory from me). LocalBrain only used this dedicated instance and didn't touch other dockers on your machine.

At first, I thought it was pretty natural: make the test container online, then use firewall rules to 'only allow the authorized IP and port, lose everything else.' But in Docker 29, it messed up—it completely rewrote the internal iptables chain, and the allowed rule I added had a hit count of 0, and I couldn't even connect to the authorized port. Competing with Docker for the firewall chain was neither reliable nor would fail with version changes.

Later, I changed my fundamental approach: ** not "allow most, prohibit some," but "by default, nothing can be reached, only a crack open." ** Each test task starts a Docker `--internal` network — this kind of container in the network, I tested it, and it doesn't even have a default route, and it can't connect to both cross-network and public networks (NC detection always times out). The zero exit isn't blocked by rules; it's Docker's constructed guarantee.

So how can it still detect the authorization target? The only gap is that each task is equipped with a small proxy that only forwards to the authorization target. The test container only connects to this proxy, and **it never knows what the real target's IP is** — it only writes to the proxy, and the proxy only forwards to the authorization address. The proxy and test run in two different containers: the test container can run probes but can't go anywhere; the proxy has an exit but only dials to that one address. Both containers lose all permissions, have read-only file systems, run non-rooted, have limited memory and process counts, and do not attach to any local directories.

In short: even if the test logic wants to do something else, it has no way to do it in that web.



![One per task -- internal network, exit is zero; The only exit is the agent that only dials the authorized target's agent. This diagram illustrates the structural isolation of "by default, nothing can reach you, only a crack is opened"](https://hyphentech.top/obsidian-assets/localbrain-network-security/image-isolation-diagram-a8859985bc.png)

## The third 'what if': How do I know this isolation is truly valid, not what I thought it was?

This is what I care about most. The biggest fear of security features is 'looks closed, but actually has gaps.' So I didn't let it run by default, but added a **local range reverse validation**: click it, the program creates a one-time shooting range itself, then uses a real test loop to run five things—

1. Can the authorized target be properly detected by the agent? (It must be possible)
2. Should we block unauthorized ports on the same target? (Yes, we should block them)
3. Bypass the proxy and connect directly to the target. Is there a way? (No, not)
4. Can it connect to the public network? (No, it doesn't)
5. Click Stop. Can you clean up the containers and network of the task? (It must be cleanly dismantled)

Only when all five things pass will the program write a validation record and execute will be released. On my machine, it took about 4 seconds to run the entire set and all five passed. As long as the isolated environment is offline, or the image is missing, or the validation record is missing, the execution automatically returns to disabled—I call this fail-closed: if anything goes wrong, it goes to 'off'; if not, it goes to 'on'.

After verifying, I casually stopped the isolated virtual machine, and the panel immediately displayed "Offline Isolation Environment · Execution disabled." This is exactly the effect I want: once the isolation is removed, the capability automatically locks out.

## Interface: One 'Network Security' section, two tabs, and you can click the mouse throughout

After finishing the features, I went to the interface with the "Instantly Tell What the Name Says": In the system access settings, leave only one "Network Security" section, with two tabs named by function—

- **Workspace Security Review**: Read-only view the code, dependencies, and configurations of the workspace you authorize, without touching the network. This has been around for a long time.
- **Active Network Testing**: This is the method mentioned above.

The name is a function directly, no longer called "which stage." More importantly, you don't need to touch the terminal at all: in active network testing, there's a "one-click start" button. Click it to automatically start the isolation environment, pull up the image, and run the local test site for reverse verification; You can also click separately "Start isolation environment / stop isolation environment." If verification fails, it obediently shows "Execute disabled," no longer giving you a command to go to the terminal to type.



![Settings → System Access → Network Security: One section with two tabs (Workspace Security Review / Active Network Testing). One-click enable button automatically initiates isolation and reverse authentication, so no need to touch the terminal.](https://hyphentech.top/obsidian-assets/localbrain-network-security/image-netsec-ui-3c7c09917e.jpg)

## Honestly state the border

- This isolation and reverse authentication system **currently only passes tests on my Mac**. Windows and Linux installation packages have the same feature, but isolation has not been tested on either end—fortunately, it is also fail-closed, and both ends must run reverse authentication locally before they can be released.
- Only two types of low-impact inspections—connection checks and response heads—are not scanners.
- The Linux version itself still supports preview.
- The isolation environment requires you to install Docker/Colima locally, but by default, it is not installed in the app.
- The test result is 'tool discovery'; not having your manual review doesn't mean it's a 'verified conclusion'—I wrote this directly under the runtime output.

The biggest takeaway from this feature is: giving a tool that can be driven by dialogue with danger capabilities—the real workload isn't about 'implementing the function,' but about 'locking it in a box where even if you want to do evil, there's no way out, and prove that the box is real.' It can run, but it only takes a small part of my effort; Making it run by default and proving it can't run is the real deal.


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
