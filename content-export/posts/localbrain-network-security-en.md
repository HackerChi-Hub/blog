---
title: "LocalBrain Security Check Tutorial: Let local models choose tools and look up evidence, and understand reports even with fewer forms"
slug: localbrain-network-security-en
status: published
lang: en
translation_of: localbrain-network-security
translation_source: machine
source_sha256: 12172a278cbbb401
date: 2026-10-03
updated: 2026-10-03
summary: "Latest security inspection tutorial: Three targets, two execution methods, authorization filling and prompts, retaining real screenshots and two sets of test data, clearly defining 170 component matching and unaccepted boundaries."
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

# LocalBrain Security Check Tutorial: Let local models choose tools and look up evidence, and understand reports even with fewer forms

My starting point for this feature was simple: since the local model can already write code and read files, could it check its own projects and services, instead of copying the scanner's output to it every time?

Now this link has real results. On my M5 Pro Mac with 64GB RAM, the model in the installation took **97 seconds** to complete a built-in range check; The same conversation reread the report took **13 seconds** without rescanning. The new production backend also successfully checked twice in succession, with **15.307 seconds and 16.313 seconds** respectively.

But these numbers shouldn't be confused with the phrase "the new version is six times faster." 97 seconds include model organization tasks and manual confirmation, 15 seconds only test scanning tools, and they use existing caches. This article separates operations, screenshots, data, and unfinished parts, so you know how to use them and what the results reveal.

> Version Notes: This article was updated on October 4, 2026. The latest streamlined interface belongs to **1.6.4-rc.1 Candidate**; The real native model screenshot comes from 1.6.3. 1.6.4 has been supplemented with the production safety adapter, but the complete native process from the new interface to the official dialogue has not yet been verified. The two new interface images in this article clearly indicate the analog component preview and do not pretend to be scanned screenshots.

## 1. First, look at the results: What has it already done?

LocalBrain is a local model toolbox, and security checks are just one set of optional tools. The local language model is responsible for understanding tasks, selecting those with capabilities, reading evidence, and making recommendations; The scanner performs the actual check; The program is responsible for authorizing, isolating, and preserving reports.

This is not about letting the model arbitrarily execute attack commands. What you confirm is the specific object and scope; the model cannot issue authorizations itself, nor can it expand checking one container to inspect all containers.

![Two execution paths: model organization tasks and fixed workflow direct checks. Mechanism schematic, not a software screenshot.](https://hyphentech.top/obsidian-assets/localbrain-network-security/chart-execution-paths.png)

Currently, available content is divided into four categories:

| Entrance | What tasks are suitable for? | True capability boundaries |
| --- | --- | --- |
| Safety inspections of work areas | Check your project code, dependencies, and configurations | Local commands, builds, and tests require separate execution confirmations; Working directory restrictions are not equivalent to operating system sandboxes |
| Built-in practice range | The first time I learned to check and read the report | Temporary isolation of the range mirror component vulnerability matching does not demonstrate business exploitation |
| My host or service | Check yourself or clearly identify authorized services | TCP connection, plaintext HTTP root path first response, and two verified leak check rules |
| My container | Check for known component issues in the project image | Snapshot auditing does not mean applying a complete security assessment during operation |

Local models can call five security tools: querying environments and authorizations, checking authorized hosts, auditing specified containers, checking built-in ranges, and paging to read reports. It must first know its true capabilities before deciding on the next step, not guessing "I should have this tool."

## 2. How to use the new interface: first select the object, then check the range again

The old interface split environment, reverse validation, authorization, and scanning into many buttons. When opening it for the first time, it's easy to not know which to click first. The new version consolidates normal operations into three object entry points: **Built-in practice range, My Host or Service, My Container**; Default collapse for environment diagnosis and maintenance.

![1.6.4 Three Types of Objects and Execution Methods: Simulated backend interaction preview of the official component, and screenshots of non-installed version tests.](https://hyphentech.top/obsidian-assets/localbrain-network-security/ui-164-component-preview.jpg)

There are two execution options. The default "Let local model check" targets the formal conversation, which is handled by model query capabilities, tool calls, and report organization; "Direct check" does not call the model but only runs a fixed inspection process.

I recommend selecting the built-in range for the first time. If you want to check the entire model chain, use the model method; If you only want to check whether the scanner and environment are normal, use the direct method. If the direct method succeeds and the model method fails, then you can continue checking model calls, confirming, and session handovers, without blaming everything on model parameters from the start.

![Unified Range Confirmation Card: Centralized verification of targets, methods, and inspection scope. Simulated component preview; the confirmed native link still awaits the latest version for re-inspection.](https://hyphentech.top/obsidian-assets/localbrain-network-security/ui-164-confirmation-preview.jpg)

The normal order is: Select object → check scope → confirm permission to check → automatically prepare and run → view reports. Successful environment preparation does not mean authorizing any host, and the interface scope confirmation does not replace the native execution confirmation required by the tool.

## 3. Follow the instructions the first time: Check Juice Shop, but don't fill in the IP and port

Juice Shop is the built-in practice target. This path doesn't require you to fill in the image address, guess the container number, or make the practice service public.

1. Open "Settings → Network Security → Authorized Network Check" and select "Built-in Practice Range."
2. Select Juice Shop from the dropdown. For the first time, keep this goal and don't mix in the production service.
3. Select "Let local model check". First, make sure the language model is running, the automation tool is enabled, and there are no tasks currently being generated; Otherwise, use "Direct Check" to validate the environment first.
4. Click "Check Scope and Start" to check the objectives, execution methods, and scope for this time.
5. Check "I confirm I have the right to inspect this target and agree to the above scope," then confirm to start. Clicking "Return to Modify" will not be executed.
6. Programs are prepared as needed to isolate environments, supplement resources, and verify boundaries. The first dependency installation may still require acknowledgment, with time time depending on network and cache.
7. The model method will be handed over to the newly created formal dialogue. When encountering the native tool confirmation box, verify the current action before allowing execution.
8. After completion, first check the report status and objectives, then look at findings and evidence; Failure, rejection, or no report cannot be explained as "no loopholes."

![Old version real range entry: Used to compare range selection and confirmation content. The new version no longer needs to search for every old button.](https://hyphentech.top/obsidian-assets/localbrain-network-security/ui-demo-20261003.png)

If you want to directly request a task in the dialogue, you can copy this inspection command:

```text
请检查内置 Juice Shop 靶场。
先查询真实环境、工具能力与已有授权，只检查这个目标。
按工具要求申请用户确认，不使用终端绕过权限。
完成后读取三个严重问题的原始证据，给出修复建议，
并明确列出尚未覆盖的范围。
组件匹配不等于已验证可利用；缺失字段标为未知。
```

This is a task description, not an authorization password. Actual approval is returned by the trusted interface; writing "approved" in the parameters has no effect.

![1.6.3 Genuine Native Confirmation Box for Installation: Only selected Juice Shop demonstration actions are allowed; refusal will result in no execution.](https://hyphentech.top/obsidian-assets/localbrain-network-security/02-scoped-confirmation.png)

## 4. Test 1: Model runs completely, reports can be read again

The first set of tests used Swift-1.5-Qwen3.8-27B-Splash, running twice consecutively through the product-sharing agent kernel and production security adapter, without any reboots in between. The test bridge only allowed temporary built-in ranges and rejected external hosts and user containers; Therefore, it proved the model toolchain was usable but did not replace desktop acceptance boxes.

The second group used Qwen3.6-35B-A3B-Splash, completing tool discovery, user confirmation, scanning, and report reading in the native interface after installation. This is the real desktop model usage record in this article.

| Measured route | Mission | Total time consumed | Number of model turns / number of tool cycles |
| --- | --- | --- | --- |
| Swift 1.5, shared proxy kernel | The first full inspection | 100.528 seconds | 4 rounds / 3 times |
| Same model, not yet restarted | The second full check | 75.773 seconds | 4 rounds / 3 times |
| Qwen 3.6, native interface | A complete inspection, including manual confirmation | 97 seconds | 4 rounds / 3 times |
| The same conversation | Repeat the report, do not rescan | 13 seconds | 2 rounds / 1 time |

![Model Link Measurement Time: Each row is an independent task; the repeat report is not a second full scan. Data is from 1.6.3 test archiving.](https://hyphentech.top/obsidian-assets/localbrain-network-security/chart-model-runs.png)

All complete checks go through "query capability → demonstration → evidence reading," resulting in 170 component matches. The native report number is `6d5b6ea5-c873-4a01-a795-f287ae85a93f`, which corresponds to backend records and is not a model announcing success in chat.

![1.6.3 Native task completion records: 97 seconds, 4 rounds, 3 times tools. Includes manual confirmation waiting, cannot be used to rank the model purely for speed.](https://hyphentech.top/obsidian-assets/localbrain-network-security/03-native-completed-report.png)

Then enter in the same dialogue:

```text
不要重新扫描。读取刚才保存的报告，列出三个最需要处理的问题。
每项附组件、版本、原始证据和报告给出的修复信息。
缺失字段标为未知，不推断成没有修复；最后说明未覆盖范围。
```

![The same conversation reads the report again: 13 seconds, 2 rounds, 1 tool, no redoing scan.](https://hyphentech.top/obsidian-assets/localbrain-network-security/04-repeat-read-report.png)

This is more important than a single success: if there is already a report, the preserved evidence should be read, without having to recreate the range each round, update the database, or scan it again. This time, only the above models and paths were validated, so it cannot be claimed that all language models have passed the same tests.

## 5. Test 2: Is there any problem with continuous use of the new backend?

The 1.6.4 retest uses the current source code compiled production safety adapter, completing two consecutive Juice Shop checks without restarting the test process. After scanning, three pieces of raw evidence are read, each with an independent report number and a non-null result.

![1.6.4 Production backend continuous check data: 15.307 seconds and 16.313 seconds, cached but not including model and manual confirmation.](https://hyphentech.top/obsidian-assets/localbrain-network-security/chart-backend-repeat.png)

| Check | Scan | Read the evidence | Report number |
| --- | --- | --- | --- |
| The first time | 15.307 seconds | 29 milliseconds | e18e6e8b-e06a-4c5b-9793-708dddf7f8f5 |
| The second time, it was not restarted | 16.313 seconds | 33 milliseconds | 7f6b4b9e-4f89-43f8-b327-a75e9a970ae3 |

This validates the continuous scanning and report reading of the production backend, not the full process of the new native model interface. The first download of the isolation environment, scanner, and vulnerability database cannot be directly copied from the fifteen-second expected in the table.

There are also failures in testing: the first script mistakenly read the returned `reportId` with another field, and after scanning, the report request was missing the number. Only after correcting the test script fields did the above table be obtained. Failures occur in the test script and cannot be attributed to the model; After fixing, you cannot pretend the first time never failed.

## 6. How should the 170 findings be interpreted?

The two new backend results were consistent: Severe 9, High 54, Medium 83, Low 24, totaling 170 entries. These are matching records of identifiable software packages within the image and known vulnerability databases, not the 170 successfully exploited business vulnerabilities.

![Severity distribution of 170 component matches: Severe 9, High 54, Medium 83, Low 24. This chart does not indicate vulnerability exploitability.](https://hyphentech.top/obsidian-assets/localbrain-network-security/chart-severity.png)

When reviewing reports, check at least five things: which target is the target; Matching components and versions; Where the evidence comes from; Whether the fields are fixed are clear; Check what is not covered.

This time, the identifiable software packages in the image are overridden, but the extra files, host kernel, and application business permission logic are not overridden by the running container. This offline scan did not include network resolution dependencies, nor was the Java index database enabled. No specific type of issue was found; it can only be said that this inspection did not detect any and cannot be considered the overall security target.

The model made an initial mistake: the report had an empty fix version, saying "no official fix." In reality, it could only say "the database records do not list the fix version." The original report was later reviewed before correction. Therefore, the model recommended that there must be backpoint evidence; Which version to upgrade should still be verified in conjunction with the project; the recommendation is not a fixed that has already been performed.

## 7. Your own host: The preset will help you fill it out, but the target cannot authorize it for you

Select "My Host or Service" and select the inspection plan first. If there is an optional local service, select from the dropdown box and use the actual address and publishing port of the discovered service; Manually enter its own address only if the target is not listed.

![Screenshot of the old version real host configuration: shows the solution, target analysis, and authorized content. It is not the scan result of any address in the image.](https://hyphentech.top/obsidian-assets/localbrain-network-security/ui-host-20261003.png)

| Mission | Optional preset | Default range | It must be verified |
| --- | --- | --- | --- |
| Your own plaintext webpage | Web services | 80. Connection and response head | Actual service ports and protocols |
| Our own development services | Development services | 8080, connection and response head | Actual release port |
| Own SSH | SSH service | 22. Connect only | Address and real SSH port |
| Web leak check | Web leak check | 80 with the reviewed read-only rule | Agreements, scope of authorization, and risks |

For example, your own development service is actually `192.168.1.20:8080`: select the development service, enter `192.168.1.20`, parse and verify the address, port 8080, connection and response header, authorization validity period is 15 minutes; check the appropriate license when checking the intranet. This address is just an example and not the test target of this article. Please replace it with your own real and authorized address.

The program can automatically provide default values for the scheme and read ports from published services; **It cannot automatically determine that you have test authorization for a specific target**. If a domain has multiple addresses, only one of the actual addresses is confirmed this time; Execution does not reresolve the domain name or follow external site redirects. Webpage paths will not be expanded to full site crawling, and entering HTTPS will not turn existing HTTP checks into full HTTPS audits.

The local service list only covers published services discovered within the dedicated isolation environment and does not automatically detect the entire local area network. Expires after authorization expires or the application is exited; reading old reports will not restore permissions.

## 8. Your own container: Choose the real target, do not manually fill in the number

Select "My Container," choose an actual container from the list, then verify the target and image. The model method hands the clear container number to the dialogue; The direct method audits the image snapshot. Neither method equals exploiting vulnerabilities on the running webpage.

![Screenshot of the original container selection for the old version: DVWA was the container selected at the time. The 170 results in this article are from Juice Shop and cannot be misled.](https://hyphentech.top/obsidian-assets/localbrain-network-security/ui-container-20261003.png)

When the list is empty, first verify the environment with the built-in range; then refresh the maintenance area if needed. Do not fill in container numbers out of thin air, and do not assume the computer is unserviced just because the list is empty. The first time the scanner and database are ready, you need to download them online; Normal rechecks do not require manually clicking updates each time.

For code projects, the task can be changed to: "Review dependencies and configurations of this authorized workspace, first provide evidence, then propose minimum repair suggestions; Request confirmation before building or testing." This does not require authorizing network hosts, but project scripts may access external directories or software repositories, so commands must still be verified; workspace selectors cannot be treated as complete system isolation.

## 9. What to do if an error is reported: First, identify the failed segment, avoid repeating random points

Authentic native tests initially failed: query ability was normal, but execution was mistakenly serialized as objects, backend rejected approval values, scans did not run. Fix placed on shared acknowledgment boundaries: wait for asynchronous native confirmation, only accept strict Boolean truth, unknown values reject by default; Not write a special prompt for a model.

Earlier connectivity tests also found false positives: the target was down, but the proxy could still accept connections, so the old logic judged it as online. After the fix, a normal and shutdown comparison was done: normal passed two consecutive rounds, but after shutdown, two consecutive rounds failed; The failure state must be saved; it cannot just be left with "tool returned text."

| Phenomenon | First, check what to do | Don't interpret it that way |
| --- | --- | --- |
| Environmental preparation fails | Dependencies, container environments, detailed errors | It's not a zero-loophole goal |
| The model did not perform inspections | Models, automated tools, validation, and authorization | It's not like finishing the answer means it's done |
| Existing reports are still being scanned repeatedly | Request to read the report number and evidence | No need to re-scan for "continue." |
| The repair field is empty | Whether the database is listed for repair information | This does not mean there is no official fix |
| The container or service list is empty | List discovery scope and environmental status | It does not mean the entire computer has no service |

Isolated reverse validation checks boundaries such as authorized target reach, unauthorized port denial, direct access denial, public network access denial, and post-stop cleanup. Through these validations, only the tested boundary works as expected; containers, virtual machines, and proxies cannot be guaranteed to be free of vulnerabilities.

## 10. Which version should I download? Which conclusions have not yet been accepted?

The latest streamlined interface is on the [1.6.4-rc.1 all-platform candidate release page](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/v1.6.4-rc.1). The device is already installed with 1.6.4, Mac installation products match build products, installation package verification and update signature verification passed; No Apple notarization. Official automatic update still retains 1.5.9, and the candidate version will not be automatically pushed to everyone as the official stable version.

The Windows and Linux source build has been uploaded and verified, but both platforms have not yet been accepted for real-world use. Linux is considered to be supported in preview and cannot run MLX / Splash. The latest native Mac interface process was not retested due to system window capture issues; This article does not use simulation images to replace it.

![Acceptance layering: old model testing, new backend testing, new simulation interaction, and unfinished verification items.](https://hyphentech.top/obsidian-assets/localbrain-network-security/chart-evidence-levels.png)

For Mac, select the Apple Silicon package and install it into the application; For Windows, select the x64 installer; For Linux, choose either the AppImage or Debian package depending on the system. For initial preparation, additional dependencies may be required; confirm according to the software prompts; For downloads requiring international networks, prepare the connection in advance. Specific dependencies, hashes, and platform boundaries are based on the release page.

## Finally: the first time you get the report, the second time you learn to question the evidence

The most worthwhile part of this tutorial is the two requests: first, check the built-in range; second, clearly say, "Do not rescan, read the report from earlier." The former verifies the execution link, the latter verifies whether the model can use the evidence already obtained.

I don't want to prove software is amazing with a huge vulnerability number. What's more useful is: fill in fewer meaningless tables, keep goals and scopes clear; Have tools available for models, and programs retain permissions; Every conclusion can be reported back, and failures can be retained.

First, use a practice range to streamline this process, then review your own projects and services. Only test your own or clearly authorized targets; Scanning may cause resource usage or service anomalies, and risk warnings do not replace legitimate authorization.

Data sources for this article: [Model Call and Native Testing Records](https://github.com/HackerChi-Hub/localbrain/blob/main/docs/SECURITY_MODEL_AGENT.md), [1.6.4 Installation and Production Adapter Acceptance Records](https://github.com/HackerChi-Hub/localbrain/blob/main/docs/RELEASE_1.6.4_VERIFICATION.md). Complete original receipts and window screenshots are kept for local testing and archiving; All schematic diagrams are drawn based on this and are not fake interfaces generated.


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
