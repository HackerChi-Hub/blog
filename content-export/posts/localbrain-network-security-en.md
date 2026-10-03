---
title: "LocalBrain Security Inspection Tutorial: Select targets and confirm the scope to let the local model check and read the report"
slug: localbrain-network-security-en
status: published
lang: en
translation_of: localbrain-network-security
translation_source: machine
source_sha256: 528503d76ea1ae91
date: 2026-10-03
updated: 2026-10-03
summary: "Starting from the built-in test range, it explains in detail the three new inspection entry points, differences between models and direct execution, authorized entry, prompts, and report reading. Records of real tests and failures are preserved, and component matching is not claimed as a successful exploit."
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

# LocalBrain Security Inspection Tutorial: Select targets and confirm the scope to let the local model check and read the report

> [!abstract]
> 1.6.4 Integrate inspection entry, permissions, and environment maintenance into one process: select the object, verify the scope, confirm execution, then review the report. The following will explain the operation according to the new interface; Performance tables and native model screenshots come from completed 1.6.3 real-world tests and cannot be considered acceptance records for the 1.6.4 installed version. Component vulnerability matching does not necessarily mean exploitation is successful.

What I wanted wasn't an extra scan button, but to say a word to the local model, let it complete the inspection within its authorized scope, and then return the evidence and repair suggestions. The old version did this by adjusting the button to the backend, which couldn't be considered autonomous execution. This round finally connected the conversation, tools, isolation range, and report reading.

Tested on my M5 Pro and 64GB memory Mac. The native interface task completed in 97 seconds; The same conversation took 13 seconds to retrieve the report again, without redoing the scan. Another model completed two consecutive checks in the shared proxy kernel without restarting. Below, the success, failure, and uncompleted acceptance parts are discussed separately.

## First, clarify: the model is not a scanner; the model is responsible for using scanning tools

The local model can decide whether to check the environment first, then which authorized target to check, and finally which evidence to read. Whether ports are successfully connected and which components in the image match are still executed by real tools. The role of the model is to organize tasks and interpret results; it cannot replace scanning with a single answer or expand the scope of authorization itself.

The latest version provides five security tools: querying the real environment and existing authorizations; checking authorized hosts; auditing specified container images; checking built-in isolated ranges; and reading reports belonging to the current conversation in pagination. Confirm flags and report ownership by the program; the model cannot bypass users by writing "approved" in parameters.

This is no longer the old version of "the model cannot call up the security command." The old mechanism blocked unauthorized execution and the actual needed conversational use. Now the authorization boundary is maintained, assigning tasks within the scope to the model instead of requiring users to operate buttons one by one.

## Before starting: decide whether to let the model check or check directly

"Let the local model check" is the default method. The model first queries the actual tool capabilities, organizes inspections within the scope of authorization, then reads evidence and makes recommendations. It requires a language model that is already running, along with automated tools that are enabled; While the current conversation is still being generated, it should be completed first.

"Direct Check" does not call the language model, only executes a fixed check flow. If you want to first confirm whether the environment and scanner are working, choosing it makes it easier to distinguish faults: if the direct path also fails, check the environment first; If the direct path succeeds and the model path fails, then check the model tool call and acknowledgment records.

Environment, authorization, and model are three different conditions. Installing the model does not mean the container environment is ready; Preparing the environment does not mean a host has been authorized; Selecting a container once does not mean authorizing all containers. The new version automatically links normal preparation tasks without removing these boundaries.

## Tutorial 1: For the first time, only check the built-in practice range

The goal is to obtain a real report and have the model provide evidence. With the built-in Juice Shop, there is no need to fill in IP, port, or image addresses, nor to open the practice service to the public network.

1. Go to "Settings → Cybersecurity → Authorized Network Check." Select "Built-in Practice Range."
2. In the "Select Practice Range" dropdown box, select Juice Shop. For the first time, it's recommended to keep this option and not add your own production services at the same time.
3. Select "Let local model check". If the model hasn't started yet, return to the homepage to launch a language model that supports tool calls, then come back; If you only demonstrate the scanner, select "Direct Scan".
4. Click "Check Scope and Start". The confirmation card lists the target, execution method, and current scope. The range of the range is the selected image component, not a web exploit.
5. After checking, check "I confirm I have the right to inspect this target and agree to the above scope," then click "Confirm and Start." If not checked, it cannot start; "Return to Modify" will not execute the task.
6. The program prepares the environment, verifies isolation, and downloads resources as needed. The first dependency installation may still require acknowledgment; You do not have to manually click the environment maintenance button every time.
7. The model mode creates a formal dialogue and clarifies the goal. When the tool needs to perform confirmation, it must also check the native confirmation box; The scope confirmation in the interface cannot replace the tool's own execution confirmation. The direct method displays results on the panel and provides a "Open full report".

![1.6.4 Preview of the official component interface: three inspection objects and two execution methods. This image uses simulated backend acceptance interaction, not a real scan screenshot.](https://hyphentech.top/obsidian-assets/localbrain-network-security/ui-164-component-preview.jpg)

![1.6.4 Scope Confirmation Card Preview: Centralized verification of objectives, execution methods, and inspection scope. This image comes from simulated backend interaction acceptance; actual model confirmation is shown in the native screenshot below.](https://hyphentech.top/obsidian-assets/localbrain-network-security/ui-164-confirmation-preview.jpg)

Environment diagnosis and maintenance are collapsed by default. Only expand when preparation fails, when you need to refresh the container list, or when you really need to update the vulnerability database. When you see the error details that should be read as "incomplete," do not interpret the absence of a report as zero vulnerabilities.

The new version automatically assigns tasks to the model with objective numbers and evidence requirements, without falsifying approvals in the parameters. Take Juice Shop as an example:

```text
请使用系统安全工具检查这个明确目标：{"demo_id":"juice-shop"}。
先查询真实能力与已有授权，只检查该目标，不扩展范围，
不使用终端绕过权限；按工具需要申请用户确认。
检查后读取原始报告，列出主要发现、证据、修复建议与未覆盖范围。
组件匹配不等于已验证可利用，缺失字段不代表否定结论；
失败或拒绝时如实报告，不重复申请同一被拒操作。
```

This is an example of the task content generated by the program, not an additional permission switch. Target authorization, report attribution, and execution confirmation are still determined by the program.

## Completed native testing: from prompts to reports

First, enter the network security entry in Settings and click "One-Click Prepare to Check Environment". If the local machine already has related dependencies, the program should prepare a dedicated isolation environment, fill in the image, and verify the boundary; If system dependencies need to be installed, confirmation must still be made. The time required for the first download is affected by network and cache; the speed under local cache conditions should not be considered the installation speed of a new machine.

Once the environment is ready, enter in the dialogue:

"Please check the built-in Juice Shop range, read the original evidence of three serious issues, provide repair recommendations, and explain the areas not yet covered."

The model first queries the actual capability, then requests to check the specified range. The native confirmation box displays the target and action for this purpose; Only executes after confirmation. The demonstration task uses a temporary isolated environment and cleans up after completion, so users do not need to create their own container addresses.

![True native confirmation box: Targets are limited to built-in Juice Shop ranges; if confirmed not to be model parameters, it will not be executed if rejected.](https://hyphentech.top/obsidian-assets/localbrain-network-security/02-scoped-confirmation.png)

When checking your own host, first select the address, port, and inspection scope on the interface, confirm you have test authorization, and then let the model use the existing license. The existing service option only covers services found in the dedicated environment, not automatically scanning all LAN devices. When inspecting containers, you must also confirm the specific objective; selecting one container should not be interpreted as authorizing all containers.

## Screenshot and filling out the old interface: keep the reference, do not follow the old button operation

The following three screenshots are from the native interface before the rework, reserved for explaining target selection and boundary filling. 1.6.4 The entry point has been changed to three types of object cards, unified range confirmation, and default folding maintenance; No need to search for every preparation button in the old version.

![Built-in Range Demonstration: Select Juice Shop for the first time, confirm demonstration only at isolated ranges, then click "One-click Prepare and Generate Demonstration Report."](https://hyphentech.top/obsidian-assets/localbrain-network-security/ui-demo-20261003.png)

- If you just want to see the effect: go to "Built-in Range Demonstration", scroll down to select Juice Shop, check the local isolation demonstration confirmation, and click "One-click Prepare and Generate Demonstration Report". This path does not require entering an address or port; After completion, check the report.
- To have the local model complete the check: first prepare the environment, return to the conversation, and enter the demonstration request mentioned above. The model will check capabilities and request confirmation, then scan and read the evidence. Do not treat manual button reports as model execution records.
- "Environment and Verification Details" and "Local Field Reverse Validation" are inspection and safety check items. Normal use does not require repeated checks; the preparation process is responsible for corresponding inspections, and only opens up for inspection if failures occur.

![Authorization host check: first select the inspection plan and target, verify the actual address and port, then confirm authorization; No need to default on custom ports and advanced options.](https://hyphentech.top/obsidian-assets/localbrain-network-security/ui-host-20261003.png)

Check your own service: select "Authorize host check" and choose the solution first; If the service is in the dropdown list, select it directly. Only for targets not listed should you manually enter your host address, then click "Parse and display actual target" to verify the address and port. When checking local or intranet, check the appropriate permission, confirm test authorization, and finally click "Authorize and automatically prepare for inspection."

For example, for your own SSH service, you can select only connection check and port 22; For your own plaintext web service, you can choose connection and response headers, using the actual publishing port of the service. Here, you can't just fill in any sample address for testing; You can only specify the target you own or have explicitly authorized. Entering an HTTPS URL does not mean you already support TLS or full HTTPS auditing.

"Select Local Services" only reads containers running on the dedicated isolated virtual machine with published ports. An empty list does not mean the computer has no services, nor does it mean the user is asked to "refresh" to scan the entire LAN. If the host authorization exits the application or expires, reading old reports will not restore it.

![Container Image Audit: Select the specified container, confirm audit authority, and click Scan. Vulnerability database updates are maintenance operations and do not require manual execution each time.](https://hyphentech.top/obsidian-assets/localbrain-network-security/ui-container-20261003.png)

Inspect containers: Select "Container Image Audit," select the actual container from the dropdown menu, verify the name and image, check the check permission, then click "Scan for Specified Container Images." This checks known components in the image snapshot, not the attack performed on the running webpage. The first time may require downloading the scanner and database; "Advanced Maintenance: Update the Vulnerability Repository" should not be an additional step for each scan.

The DVWA in the image above is the container selected by the user on the current interface, not from a DVWA test already completed in this article. The model execution data in this article comes from Juice Shop, so the selection screen of another target drone should not be taken as its scan result.

"Save" does not mean starting a scan: the actual task is triggered by the corresponding preparation or scan button, and the host authorization still has a separate validity period. This kind of button division of labor is not intuitive enough and is an area where the interface should be simplified later.

## Tutorial 2: Check your own host or service—which ones are filled out automatically, and which must be checked?

Select "My Hosts or Services," then choose the inspection plan. Regular web pages, development services, and SSH all have presets; you don't need to fill in tool parameters individually.

| What are you checking out? | Chosen scheme | The scope provided by the program | What does it take you to verify? |
| --- | --- | --- | --- |
| Your own plaintext webpage | Web services | 80 ports, connection and response head | Is the actual service on port 80? |
| Our own development services | Development services | Port 8080, connection and response head | Actual publishing port; Assumption does not automatically count as authorization |
| Own SSH | SSH service | Port 22, connected only | Server address and SSH actual port |
| Check your own web leaks | Web leak check | Port 80, connection, response header, and read-only rules validated | Web agreements, authorization scope, and service risks |
| I just want to know about the accessibility of commonly used ports | Common service ports | Preset commonly used ports, TCP connection only | Whether these ports are actually allowed to be inspected |

If there are optional local services, select them directly from the dropdown box; The program enters the address of the discovered service and the actual publishing port, with the authorization validity period of 15 minutes by default. This list is published for read-only dedicated environments and does not automatically discover the entire local area network.

If the target is not listed, enter your own address. Click "Parse and display actual target"; When the domain returns multiple addresses, select the one to authorize this time. Then check the "current scope"; only after changing the port, type, or validity period can you proceed with "Port and Authorization Validity Period". Finally, verify and confirm following the same process as the shooting range.

For example, if your own development service is indeed at `192.168.1.20:8080`, you can select "Development Service", enter `192.168.1.20`, parse and verify port `8080`, connection and response header, validity period `15` minutes, and check "Allow local/intranet". This address is just an example and not the target scanned in this article; Please replace it with the real address of your own service and do not copy it directly to test unfamiliar devices.

The protocol and path you enter do not automatically expand capabilities. Entering an HTTPS address does not mean you support full HTTPS auditing; Entering a deep web path does not authorize crawling the entire site. Execution only uses a single confirmed actual address, does not reresolve the domain name, and does not follow external site redirects.

After the host mode creates a real authorization, give the authorization number to the model, preventing it from creating its own address or port. When you need to revisit, you can say in the same dialogue:

```text
只使用当前已有授权，复查刚才的主机检查结果。
先确认授权是否仍有效；过期就停止，不自行扩大范围。
读取报告中的失败证据，区分端口不可达、协议不匹配和发现的问题。
给出需要我确认的修复建议，不直接修改服务。
```

## Tutorial 3: Check your container image

Select "My Containers" and choose an actual container from the "Select Container" dropdown box. The confirmation card should show the target you selected; If the list is empty, first verify the environment at the built-in practice range, then prepare and refresh the environment in the maintenance area. Do not fill in container numbers out of thin air.

The model method provides the container number to the formal conversation, while the direct method audits the snapshot and displays the report. Neither approach exploits the running webpage nor modifies the container. The vulnerability repository is prepared according to existing mechanisms, without manually updating every time.

If you want to learn the report first, it is recommended to use the built-in range; Use your own container to check the actual project image. Do not say the number of mirrored components matched as the number of business applications breached.

## Once the report is received, what counts as completion?

First, check whether the report is genuinely generated, then check whether the goals and scope are correct, and finally read the original evidence. It is recommended to have the model provide the following results: main findings, corresponding evidence, remediation suggestions, and uncovered areas. Remediation suggestions are not actual modifications, and database matching is not usability verification.

You can directly request a repeat of the same conversation without needing to rescan:

```text
不要重新扫描。读取刚才保存的报告，列出三个最需要处理的问题，
每个问题附组件、版本、证据来源和报告明确给出的修复信息。
字段缺失就标为未知，不要推断成没有修复；最后列出检查未覆盖的范围。
```

The 13-second record below is such an operation: one report read, no rescanning. If environment preparation fails or the task is rejected, it can only be recorded as incomplete; Existing documents, conversation endings, and green status cannot replace correct reports and evidence.

## Two models: three full checks and one repeated read (1.6.3 Data)

I split the test into two layers. Swift-1.5-Qwen3.8-27B-Splash uses the product-sharing proxy kernel and production security adapter; the test bridge only allows built-in demonstrations and rejects external hosts and user containers. This proves that the actual toolchain works, but does not replace desktop acceptance boxes.

Qwen3.6-35B-A3B-Splash completes tool discovery, user confirmation, scanning, and report reading in the native interface after installation. 97 seconds includes waiting for manual confirmation, so model speed cannot be directly compared to bench tests without manual waiting.

| Test path | Mission | Time-consuming | Proxy turns/security tool calls |
| --- | --- | --- | --- |
| Swift 1.5, shared kernel | First full inspection | 100.528 seconds | 4 rounds / 3 rounds |
| Swift 1.5, not yet restarted | The second full check | 75.773 seconds | 4 rounds / 3 rounds |
| Qwen 3.6, native interface | Complete inspection, including manual confirmation | 97 seconds | 4 rounds / 3 rounds |
| Qwen3.6, same dialogue | Read the report again, do not rescan | 13 seconds | 2 rounds / 1 time |

The full checks followed the "query capability→ demonstration → reading evidence." The two Swift tasks matched the native scan components: 9 severe, 54 high, 83 medium, 24 low, totaling 170 items. The native report number was 6d5b6ea5-c873-4a01-a795-f287ae85a93f, which corresponds to backend records rather than just success prompts in chats.

![Actual installation task: 97 seconds, 4 rounds, 3 tool calls, report contains 170 component matches. This number cannot be directly interpreted as 170 exploitable vulnerabilities.](https://hyphentech.top/obsidian-assets/localbrain-network-security/03-native-completed-report.png)

![Second read of the report from the same dialogue: 13 seconds, 2 rounds, 1 tool call, no repeated scans.](https://hyphentech.top/obsidian-assets/localbrain-network-security/04-repeat-read-report.png)

The purpose of these samples is to confirm the link and continuous usage, not to rank the models in the performance rankings. Currently, only the two models mentioned above are being tested; The shared mechanism does not write special branches based on model names, but this does not mean all models have stably passed.

## What do the 170 findings really indicate?

### 1.6.4 Supplementary Testing: Can the backend be used continuously?

This round also used the current source code compiled production safety adapter for two consecutive Juice Shop demonstration checks, without restarting the testing process. The first scan took 15.307 seconds and the evidence read took 29 milliseconds; the second scan took 16.313 seconds and the evidence read took 33 milliseconds. Both instances had independent report numbers and obtained non-null raw evidence.

Testing uses existing caches, only allowing temporary built-in ranges in advance, and rejecting external hosts and user containers. This verifies that actual backend continuous scanning and report reading are not local model speed tests, nor are they equivalent to full acceptance of the new native interface. The initial download environment and database may be noticeably slower.

| This round of testing | Scanning is time-consuming | Evidence reading | True report number |
| --- | --- | --- | --- |
| The first time | 15.307 seconds | 29 milliseconds | e18e6e8b-e06a-4c5b-9793-708dddf7f8f5 |
| The second time, it was not restarted | 16.313 seconds | 33 milliseconds | 7f6b4b9e-4f89-43f8-b327-a75e9a970ae3 |

The first time I wrote a test script, I misread the report number field, and after scanning it complete, the report returned missing parameters. I only finished uploading the table after correcting the script field; The failure receipt from that time was also kept. You can't blame the model for errors in the test script, nor can you omit failures and only show the success numbers.

Here, it checks components in the container image and their matched database with known vulnerabilities. It can identify which versions in the image are worth reviewing, but cannot directly prove that business applications have accessible paths. Newly added files at runtime, host kernels, and business permission logic are not all covered by this image audit.

Therefore, "170 matches" should not be written as "170 vulnerabilities successfully broken." Similarly, zero matches do not guarantee the target's safety. Scanning databases, component recognition, and actual application usage all affect results; after fixing, a re-scan is needed to verify whether the business is functioning properly.

The model's initial response also revealed an interpretation error: the report did not list the fixed version, and it described the null value as "no official fix." The correct meaning could only be "This database record is not listed." After reading the original report, it was corrected, and the shared evidence guidance for the program also added this rule: unknown does not mean denial, and suggestion does not mean actual testing.

Therefore, I value whether we can return to the original evidence, rather than how well the model presents the report. The specific upgrade version and fix plan must be verified in conjunction with the project; The fix version provided by the database does not automatically equal the version that is currently the most suitable for the project.

## The native interface failed the first time, and the problem wasn't with the model

The initial native test failed to scan successfully. Capability queries were normal, but when performing confirmation, the backend received an object, not a boolean value, so it refused to approve the parameter. The model tried three times in a row and still failed; You can't count this check as complete just because it finally finishes.

This fix is set at the general acknowledgment boundary: wait for the native asynchronous acknowledgment box to return, treat strict Boolean truth values as approvals, and reject unknown returns by default. Security checks, project commands, and network changes share this mechanism, not just fixing a prompt for a particular model.

Only after the fix did the above 97-second native success record appear. The first failed checkpoint, the repair task log, the second read record, and four window screenshots were all preserved. Successful desktop testing does not equal desktop interface success; this failure precisely explains why both sides must be tested separately.

## Besides quarantine, it is also necessary to confirm that the results are free of false positives

An earlier host connectivity test also caught a false positive: the target machine had stopped, the agent could still accept the connection, and the old logic considered the target to be online. Later, it was changed to verifying the final authorized target and retaining the actual failure state of the web access command. Evidence can be shortened, but failure status cannot be cut together.

Using Juice Shop 20.2.0 to compare normal and downtime: normal two consecutive rounds, both web pages and connections passed; After shutdown, two consecutive rounds failed. Single test takes about 201 to 206 milliseconds, including command scheduling, not network latency rankings. The entire real application returns about 18.93 seconds.

Local isolated reverse authentication includes authorized target reach, unauthorized port denial, direct access target denial, public network access denial, post-stop cleanup, and clear failure when the target is actually unreachable. The previous six validations all passed locally, taking about 6.62 seconds; It verifies set boundaries, not complete security audits.

Host detection uses an independent internal network and restricted agent for task detection, without adding user directories. The program imposes hard constraints on target authorization, execution acknowledgments, and stop signals. Containers, virtual machines, and proxies themselves still require maintenance and cannot guarantee absolute security. The native end-to-end test of the newly added model path stop scan has not been separately re-validated.

## What can and cannot be done now

- Workspace security review: Check the code, dependencies, and configurations of authorized projects; Perform local testing or dependency audits and confirm separately. Working directory restrictions are not operating system sandboxes; dependency audits may also access software repositories.
- Authorized host check: TCP connection discovery, plaintext HTTP root path first response, as well as reviewed Git configuration and PHP information leak rules. Not a complete website vulnerability scan.
- Container and built-in range inspection: Mirror component vulnerability database matching. The model can select tools and read reports, but cannot issue authorizations, call arbitrary attack scripts, or expand targets independently.
- HTTPS full audit, full virtual hosting support, and remote container connections have not yet been delivered. Report reads do not restore expired host authorizations.
- Only test your own device or obtain explicit authorization goals. Risk warnings cannot replace authorization, nor can you treat checkboxes in software as legal exemptions.

## 1.6.4 Download and Acceptance: The candidate version is not an official automatic update

The new streamlined interface is provided in candidate packages 1.6.4-rc.1. Mac, Windows, and Linux packages are submitted from the same source code; Windows installers and Linux AppImage and Debian packages have all been built, and installation product hashes and update signature validation have passed. Windows and Linux have not yet been natively accepted in real machines; Linux is still considered preview support and cannot run MLX/Splash.

This machine is already installed with version 1.6.4. The binary installed matches the build product; DMG verification, strict code signature, and update package independently passed verification, but there was no Apple certification. This round of window reading was blocked by system capture errors, and the native complete process from the new interface to the official dialogue has not yet been reverified; The screenshots and data of the real model preserved above come from 1.6.3. Front-end simulation interaction, production back-end testing, and native interface acceptance are three layers of evidence and cannot be substituted for each other.

[1.6.4-rc.1 Candidate downloads across all platforms](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/v1.6.4-rc.1). The official automatic update still retains 1.5.9, but the candidate version was not switched; Older versions are also retained. To experience the new version, manual download and installation are required. Please first check the built-in shooting range as per this article, then check your target.

Download the corresponding Apple Silicon installation package for Mac and drag it into "Applications"; Run the x64 installer on Windows; Linux can choose either the AppImage or Debian package. Linux AppImage requires additional execution permissions; the Debian package is suitable for the corresponding Debian/Ubuntu environment. Specific dependencies, platform restrictions, and checksums are based on this release page; do not claim all platforms pass after verification on one machine.

## I hope it will have fewer forms for users and more evidence to speak

This time, the real connection was: you explain the task, confirm the program scope, the local model calls the real tool, and then returns the report that can be checked back. It's not about giving the model unlimited permissions, nor about using fixed button results to fake autonomous execution.

For the first time, it's recommended to use the built-in range first, confirm that query, authorization, execution, and report reading are all thorough, then check your own project and services. The most valuable thing is not how many discoveries there are, but whether each discovery can be returned as evidence, which areas are not covered, and whether repairs can be verified.

[Complete test methods and acceptance boundaries](https://github.com/HackerChi-Hub/localbrain/blob/main/docs/SECURITY_MODEL_AGENT.md). Original test records are archived locally, and public documents distinguish between desktop, native interface, build, and unaccepted items.


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
