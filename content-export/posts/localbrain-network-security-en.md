---
title: "LocalBrain security check test: The local model calls tools itself, and 170 discoveries do not equal 170 exploitable vulnerabilities"
slug: localbrain-network-security-en
status: published
lang: en
translation_of: localbrain-network-security
translation_source: machine
source_sha256: 0d93fbdf47b7e756
date: 2026-10-03
updated: 2026-10-03
summary: "Two local models tested: autonomous query capability, scanning isolated ranges, and reading evidence. Failure records are kept, explaining the difference between matching 170 components and real exploitable vulnerabilities."
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

# LocalBrain security check test: The local model calls tools itself, and 170 discoveries do not equal 170 exploitable vulnerabilities

> [!abstract]
> This update corrects a key note from an old article: 1.6.3 Candidate has registered security checks as tools that local models can call. Models are responsible for selecting checks, reading evidence, and providing recommendations; Programs are responsible for authorization and isolation. True execution records of both models are saved, but component vulnerability matching does not guarantee successful exploitation.

What I wanted wasn't an extra scan button, but to say a word to the local model, let it complete the inspection within its authorized scope, and then return the evidence and repair suggestions. The old version did this by adjusting the button to the backend, which couldn't be considered autonomous execution. This round finally connected the conversation, tools, isolation range, and report reading.

Tested on my M5 Pro and 64GB memory Mac. The native interface task completed in 97 seconds; The same conversation took 13 seconds to retrieve the report again, without redoing the scan. Another model completed two consecutive checks in the shared proxy kernel without restarting. Below, the success, failure, and uncompleted acceptance parts are discussed separately.

## First, clarify: the model is not a scanner; the model is responsible for using scanning tools

The local model can decide whether to check the environment first, then which authorized target to check, and finally which evidence to read. Whether ports are successfully connected and which components in the image match are still executed by real tools. The role of the model is to organize tasks and interpret results; it cannot replace scanning with a single answer or expand the scope of authorization itself.

The latest version provides five security tools: querying the real environment and existing authorizations; checking authorized hosts; auditing specified container images; checking built-in isolated ranges; and reading reports belonging to the current conversation in pagination. Confirm flags and report ownership by the program; the model cannot bypass users by writing "approved" in parameters.

This is no longer the old version of "the model cannot call up the security command." The old mechanism blocked unauthorized execution and the actual needed conversational use. Now the authorization boundary is maintained, assigning tasks within the scope to the model instead of requiring users to operate buttons one by one.

## The easiest way to get started: start with the built-in shooting range

First, enter the network security entry in Settings and click "One-Click Prepare to Check Environment". If the local machine already has related dependencies, the program should prepare a dedicated isolation environment, fill in the image, and verify the boundary; If system dependencies need to be installed, confirmation must still be made. The time required for the first download is affected by network and cache; the speed under local cache conditions should not be considered the installation speed of a new machine.

Once the environment is ready, enter in the dialogue:

"Please check the built-in Juice Shop range, read the original evidence of three serious issues, provide repair recommendations, and explain the areas not yet covered."

The model first queries the actual capability, then requests to check the specified range. The native confirmation box displays the target and action for this purpose; Only executes after confirmation. The demonstration task uses a temporary isolated environment and cleans up after completion, so users do not need to create their own container addresses.

![True native confirmation box: Targets are limited to built-in Juice Shop ranges; if confirmed not to be model parameters, it will not be executed if rejected.](https://hyphentech.top/obsidian-assets/localbrain-network-security/02-scoped-confirmation.png)

When checking your own host, first select the address, port, and inspection scope on the interface, confirm you have test authorization, and then let the model use the existing license. The existing service option only covers services found in the dedicated environment, not automatically scanning all LAN devices. When inspecting containers, you must also confirm the specific objective; selecting one container should not be interpreted as authorizing all containers.

## How to use the three settings pages: The first time, only select the built-in shooting range

The settings page has two uses: manual check entry and environment and authorization management before local model execution. The button runs the check directly, which does not imply model participation; If the model wants to arrange tasks independently, it returns to the dialogue after environment preparation and authorization are completed to make requests.

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

Daily entry should only retain "Select target→ check scope and confirm →Start →View Report"; senior maintenance should be closed by default, and environment status displayed with a brief prompt. This article explains how to use the existing interface; it is recommended not to write this simplified interface as a completed interface upgrade.

## Two models: three full checks and one repeated reading

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

## Download and Acceptance: The candidate version is not an official automatic update

Model autonomous security checks are provided in the 1.6.3-rc.1 candidate version. The Mac installation package has been built, installed, and tested for core native tasks; Windows and Linux candidate packages have been built and signed for validation, but have not yet been accepted natively on both platforms. Linux is still considered as preview support.

Ultimately, the Mac package supplemented the rules for interpreting evidence. The installation binary matched the build product, with strict signature and update package verification passed, but no Apple notarization. The final post-restart report persistence acceptance encountered lock screen and was not yet completed; Do not write the released installation package as this acceptance pass.

[1.6.3-rc.1 Candidate Download](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/v1.6.3-rc.1). The official latest version is still 1.5.9, and the auto-update list does not include the candidate version. To experience the model toolpath in this article, you need to manually select the candidate version, rather than assuming the automatic update already includes it.

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
