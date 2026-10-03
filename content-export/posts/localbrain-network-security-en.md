---
title: "LocalBrain Network Security Test: Locked in an isolated sandbox, it doesn't run by default, only released after authorization"
slug: localbrain-network-security-en
status: published
lang: en
translation_of: localbrain-network-security
translation_source: machine
source_sha256: 2f40e3bc38b7bcc9
date: 2026-10-03
updated: 2026-10-03
summary: "LocalBrain provides workplace security review and authorized network checks. Real Juice Shop target devices passed two normal rounds and failed two rounds of shutdown, fixing the issue of mistaking proxy handshakes for online targets; Six isolation validations passed, adding automatic service selection and configuration examples, and explaining the differences between connectivity checks, vulnerability detection, and cross-platform acceptance."
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
> LocalBrain provides workspace security review and authorized network checks. Network checks only perform port connections and HTTP response headers; they must first pass local isolation verification before the user clarifies the authorization target. This article supplements a real startup fault investigation, repair, and test data, and also explains which results still cannot be considered official installation package acceptance.
> 2026-10-03·HyphenTech

# LocalBrain Network Security Test: Locked in an isolated sandbox, it doesn't run by default, only released after authorization

In the past couple of days, I added a feature to LocalBrain that even I hesitated to do: proactive network testing on authorized targets. To put the conclusion first—it defaults to **not running**, and I spend much more effort on "making it run" than on "making it run."

Why would a local AI toolbox touch something as dangerous as network testing? Because I have my own needs: I have several machines and services on hand, wanting to casually check whether a port is open and whether a service's response head is correct. But once these capabilities are integrated into a tool that can be driven by conversation, the first reaction should be caution—what if the model initiates it itself? What if it points to an address it shouldn't? What if it follows the network and finds something else on my local machine? This article will explain how I block each of these three "what ifs" one by one.

## Let's first talk about what it can and cannot do

**Authorized Network Check** can only perform two types of low-impact checks: connection check (whether a port on a certain IP is available) and HTTP response header check (take back the response header and check). These are the two. Not a full-function scanner, does not scan port segments, and does not send attack payloads. Response header inspection currently uses plaintext HTTP, so it cannot be considered as an HTTPS certificate or TLS configuration audit that already supports it.

The targets that can be tested are also tightly blocked: **must be a single and definite IP**—does not accept domain names, network segments, wildcards, and even bypasses IPv4 mapping addresses are rejected; Up to 8 ports at once; Valid for 1 to 60 minutes; Up to 8 authorizations can be attached simultaneously; And all are stored only in memory, **once you exit the application, it's gone**. To test local or intranet, you have to check a separate authorization; without it, you can't even point to 127.0.0.1.

These restrictions are not suggestions but hard thresholds in the code; if you fill in a wrong one, it will be rejected immediately.

## The first "what if": Will the model start on its own?

No. This one is the foundation.

Authorizing all network check operations—creating authorization, running validation, running tests—are all buttons you click in the settings interface, none registered as tools that the model can call. The model saying "Let me test it for you" in a dialogue cannot be used to perform network checks. The simplified process still requires manually selecting the target authorization, then clicking "Authorize and run check"; Auto-filling does not automatically grant permissions.

Shifting 'can measure' from 'whether the tool is willing' to 'whether the person grants authorization' is the first line I use when using any dangerous ability.

## The second 'what if': Will it point somewhere it shouldn't or touch something else on the device?

This was the most painstaking part; I tried two different approaches to get it right.

The test had to run in an isolated environment. I chose Colima and Docker—to build the smallest dedicated Linux virtual machine (2 cores, 2GB, `--mount none`, not any local directory from me). LocalBrain only used this dedicated instance and didn't touch other dockers on your machine.

At first, I thought it was pretty natural: make the test container online, then use firewall rules to 'only allow the authorized IP and port, lose everything else.' But in Docker 29, it messed up—it completely rewrote the internal iptables chain, and the allowed rule I added had a hit count of 0, and I couldn't even connect to the authorized port. Competing with Docker for the firewall chain was neither reliable nor would fail with version changes.

Later, I changed my fundamental approach: ** not "allow most, prohibit some," but "by default, nothing can be reached, only a crack open." ** Each test task starts a Docker `--internal` network — this kind of container in the network, I tested it, and it doesn't even have a default route, and it can't connect to both cross-network and public networks (NC detection always times out). The zero exit isn't blocked by rules; it's Docker's constructed guarantee.

So how can it still detect the authorization target? The only gap is that each task is equipped with a small proxy that only forwards to the authorization target. The test container only connects to this proxy, and **it never knows what the real target's IP is** — it only writes to the proxy, and the proxy only forwards to the authorization address. The proxy and test run in two different containers: the test container can run probes but can't go anywhere; the proxy has an exit but only dials to that one address. Both containers lose all permissions, have read-only file systems, run non-rooted, have limited memory and process counts, and do not attach to any local directories.

This design limits probe traffic to the proxy path per task, but it cannot guarantee absolute security: containers, virtual machines, and proxies themselves remain security dependencies that need maintenance, and the six range checks cannot replace a complete security audit. Connection checks are performed by restricted proxies on the final authorized addresses, while web checks are accessed by isolated probes via proxies. Neither type of check can be considered successful simply because the proxy has accepted the connection.



![One per task -- internal network, exit is zero; The only exit is the agent that only dials the authorized target's agent. This diagram illustrates the structural isolation of "by default, nothing can reach you, only a crack is opened"](https://hyphentech.top/obsidian-assets/localbrain-network-security/image-isolation-diagram-a8859985bc.png)

## The third 'what if': How do I know this isolation is truly valid, not what I thought it was?

This is what I care about most. The biggest fear of security features is 'looks closed, but actually there are gaps.' So I didn't let it run by default, but added a **local range reverse verification**: click it, and the program creates a one-time test range and verifies six things with real test loops—

1. Can the authorized target be properly detected by the agent? (It must be possible)
2. Should we block unauthorized ports on the same target? (Yes, we should block them)
3. Bypass the proxy and connect directly to the target. Is there a way? (No, not)
4. Can it connect to the public network? (No, it doesn't)
5. Click Stop. Can you clean up the containers and network of the task? (It must be cleanly dismantled)
6. If the target port within the authorization range is actually unreachable, can a failure be clearly reported? (Must fail)

Only after all six tasks are passed will the program write the verification record and execute will be released. The latest version completes the local run in about 6.62 seconds. The old version cannot directly open the five records for execution in the new version and must be re-validated. If the isolation environment is offline, the image is missing, or verification is incomplete, the execution will revert to disabled: **If something goes wrong, close first, do not release first. **

After verifying, I casually stopped the isolated virtual machine, and the panel immediately displayed "Offline Isolation Environment · Execution disabled." This is exactly the effect I want: once the isolation is removed, the capability automatically locks out.

## Interface: Name by specific function, users choose solutions, no longer recording stage numbers

After finishing the features, I went to the interface with the "Instantly Tell What the Name Says": In the system access settings, leave only one "Network Security" section, with two tabs named by function—

- **Workspace Security Review**: Read the code, dependencies, and configurations of the authorized workspace. Executing local testing and dependency audit commands still requires further confirmation; Dependency audits may access software repositories, so it cannot be simply described as completely offline. Working directory restrictions are not system sandboxes.
- **Authorized Network Check**: For clearly authorized IPs and ports, perform connection and response head checks in a dedicated isolated environment.

The name simply states the function, no longer called "which stage." When dependencies are installed, the program can automatically prepare isolation environments, fill up images, and perform local reverse validation. If Colima or Docker is missing but Homebrew is already on the machine, it provides "one-click installation and preparation to check environment"; Machines without Homebrew still have an initial preparation threshold. It will not silently install system software nor turn the preparation environment into an automatic authorization target. The screenshots of the old interface below only show the original entry point and do not pretend to be acceptance screenshots of the new interface.



![Original settings interface: Two tabs in the Network Security section. This patch further simplifies the names and daily processes; the native interface acceptance is not yet complete](https://hyphentech.top/obsidian-assets/localbrain-network-security/image-netsec-ui-3c7c09917e.jpg)

## One real failure: the terminal can start, but the application cannot find Lima

This time, the model didn't answer wrong, but the application startup environment had a problem. The interface reported: `limactl` not in `PATH`. The program had already found the absolute path to Collima, but Colima would then call Lima; Applications launched from the desktop did not inherit the full search path from the terminal, so the second dependency couldn't be found.

I restarted the dedicated instance using a streamlined environment with only the system directory and repeated the same error. Then I added the actual local tool directory to the subprocess environment and isolated the virtual machine for successful startup, taking about 8 seconds. This time was measured under the condition that the local machine already had dependencies and image caches, not the time taken for the first installation on a new machine.

Fix: No writing to the user's shell configuration, nor requiring the software to be reinstalled. Instead, it handled the process mechanically: retaining the original search path and supplementing the existing common tool directories to ensure Colima and its subprocesses run in a consistent environment. At the same time, three other reliability issues were addressed:

- Start logs for continuous reading, limiting only the retention length without stopping reading. Avoid processes and applications waiting for each other after the pipeline is filled with logs.
- Time-consuming commands are executed in the background thread, so the interface does not have to wait for the isolated environment to start before responding.
- Refresh the state after an error no longer clears errors; Dedicated instance startup explicitly prohibits automatically switching the user's default Docker context.

These fixes do not branch based on model names, nor do they mask runtime faults by modifying model prompts.

## The real target drone stopped, so why does it still show success?

Running a one-time small range is not enough. On October 3, 2026, I conducted a full verification using the official Juice Shop 20.2.0. It is a real web application for secure training, this time running only on a dedicated local virtual machine, without testing public websites or exploiting vulnerabilities.

The most important thing to keep is not the success screen, but the failure: **In the old version, even after the target drone stopped, connection checks still returned successfully. ** The reason is that the test connects to a proxy listener; the proxy accepting the connection does not necessarily mean the final target is truly online. Webpage commands have another issue: after receiving an interception command, the output may leave the successful status of the interception command, hiding the actual access failure. The isolation boundary was not breached, but the result was wrong; "No overstepping" and "accurate measurement" are two different test papers.

This fix did not add prompts to a particular model, nor did it write a special branch for Juice Shop. Link check was changed to verify the final authorization target, and web check retained the actual command failure state. Evidence can be limited in length; failure status cannot be cut together. Each item is individually recorded for check type, port, status, duration, and original evidence, and only then summarized whether it passed.

I first confirmed the webpage returned 200 within the real app, then verified the entire backend command chain through verification, authorization, execution confirmation, check, and undo for comparison. Under normal conditions, two consecutive rounds, then two more rounds after stopping, with no single attractive result.

| Target aircraft status | Web check | Connection check | Summary |
| --- | --- | --- | --- |
| Normal, Round 1 | Pass, 201 milliseconds, return 200 | Passed by, 205 milliseconds | Pass |
| Normal, Round 2 | Pass, 202 milliseconds, return 200 | Passed by, 202 milliseconds | Pass |
| Stop, round 1 | Failure, 206 milliseconds | Failure, 205 milliseconds | It was not approved |
| Stop, round 2 | Failure, 202 milliseconds | Failure, 205 milliseconds | It was not approved |

The milliseconds here include command scheduling, not network latency rankings. The full set of real-world applications takes about 18.93 seconds to return and includes startup, validation, quadruple check, shutdown, and cleanup. All six isolation validations passed; Another full authorization link plus downtime negative test took about 22.09 seconds. Unconfirmed execution, exceeding authorization type, and revoked requests were also verified separately.

This proves that the local machine's checkbox distinguishes between normal and stopped targets, but does not prove that the software can find all vulnerabilities. The target container does not have a user directory; after testing, all target machines, proxies, probes, and temporary networks are cleaned up; Real application testing goes through the backend command entry and does not fake the installation interface's item-by-item acceptance checks.

## Simplified operation: three steps are enough, with details left to the advanced options

The fixed version summarizes daily operations into three steps:

1. **Prepare Environment**: Click "One-Click Prepare and Check Environment". Automatically start the dedicated instance, complete the image, then run local validation. If the image is online but missing, it will also be filled, so you don't need to skip the preparation directly.
2. **Select Solution and Service**: For plaintext web pages, select connection and response header; for SSH, select connection only. Start your own test service first, then refresh the service list and select from the dropdown menu; The program will automatically fill in the address, port, and internal network options. The actual service port takes precedence over the default value of the solution.
3. **Confirm authorization and run**: Check the scope of this time, check the authorization declaration, and click the button. Other authorized targets, check types, and validity periods are placed in the advanced options; Automatic filling does not replace authorization confirmation.

Environment status and verification details are folded by default; expand when troubleshooting is needed. Service dropdown only reads containers running on dedicated virtual machines with published ports; **does not scan the subnet, nor does it represent the entire Mac service list**. If the list is empty, first confirm that the service has started and published ports; do not use historical test addresses to fill in. Port input with illegal content will be directly rejected; incorrect entries will not be quietly deleted and executed for the user.

A brief example is also added next to the configuration: your plaintext web page can use port 8080, but SSH only supports port 22 connections; The advanced input 192.168.1.50 is just an example, not a deployed target device. 15 minutes means the authorization is reserved for 15 minutes, not a task that needs 15 minutes. Web checker currently does not support HTTPS, so you cannot interpret port 443 as connectable to certificates, encryption suites, or website security as qualified.

**Version Notes: This target determination and automated fix is included in version 1.5.9. Real target device testing has been completed; Installation package and interface acceptance status are subject to the release page description. Previous version 1.5.8 did not include this target online false alarm fix and should not be judged as service online based on its success prompt. **

## Honestly state the border

- This isolation and reverse authentication system **currently only passes tests on my Mac**. Windows and Linux installation packages have the same feature, but isolation has not been tested on either end—fortunately, it is also fail-closed, and both ends must run reverse authentication locally before they can be released.
- Only two types of low-impact inspections—connection checks and response heads—are not scanners.
- The Linux version itself still supports preview.
- The isolated environment requires Docker/Colima, which is not included by default; One-click dependency installation is available when the device already has Homebrew. The initial installation path for a brand-new machine has not yet been fully tested.
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
