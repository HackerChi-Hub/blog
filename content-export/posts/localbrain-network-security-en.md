---
title: "Can LocalBrain Penetrate and Take Orders Now?"
slug: localbrain-network-security-en
status: published
lang: en
translation_of: localbrain-network-security
translation_source: machine
source_sha256: a164251f27fab245
date: 2026-10-03
updated: 2026-10-04
summary: "From security checks to authorized penetration: 1.6.7 adds service identification, SQL injection detection, and self-written PoC execution, locking export technology to authorization targets; Retaining continuous 35B and 27B tests, 170 component matching and verification boundaries across platforms."
categories:
  - Tech
tags:
  - AI
  - Local deployment
  - Self-made software
  - LocalBrain
  - Security
cover: https://hyphentech.top/obsidian-assets/localbrain-network-security/cover-mask-vulnerability-20261004.jpg
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/localbrain-network-security/) is authoritative.

# Can LocalBrain Penetrate and Take Orders Now?

My starting point for this feature was simple: since the local model can already write code and read files, could it check its own projects and services, instead of copying the scanner's output to it every time?

Now this link has real results. On my M5 Pro and 64GB memory Mac, the 1.6.5 installer tested twice consecutively with 35B and the original 27B Splash. All four times returned **170 component matches**, the actual scanning mirroring phase was **12–13 seconds**, and the temporary range was cleared. The new streamlined entry, range confirmation, and model call all retain real window screenshots.

But "scan successful" and "model explanation accurate" are not the same thing. 27B once said that the page-turn parameters he hadn't submitted were tool failure, and both models overexplained the missing fix versions. 1.6.6 Therefore, actual parameters, the number of read evidences, and unknown fields are included in the program receipt. Let's first walk through the interface and see what these numbers actually prove.

> Version notes: This article was updated on October 4, 2026. Operation screenshots are from the locally installed **1.6.6**; Four same-condition model comparisons are from **1.6.5**, with historical records 1.6.3 and 1.6.4 listed below. **1.6.7 The newly added "authorized penetration" capability is found in Section 11**, whose conclusion comes from authentic end-to-end verification in the local isolated environment (not interface screenshots), and is marked item by item in the text. All software interface images are screenshots of real windows; Mechanism diagrams and data diagrams are marked separately and cannot replace operational acceptance.

## 1. First, look at the results: What has it already done?

LocalBrain is a local model toolbox, and security checks are just one set of optional tools. The local language model is responsible for understanding tasks, selecting those with capabilities, reading evidence, and making recommendations; The scanner performs the actual check; The program is responsible for authorizing, isolating, and preserving reports.

This is not about letting the model arbitrarily execute attack commands. What you confirm is the specific object and scope; the model cannot issue authorizations itself, nor can it expand checking one container to inspect all containers.

![Two execution paths: model organization tasks and fixed workflow direct checks. Mechanism schematic, not a software screenshot.](https://hyphentech.top/obsidian-assets/localbrain-network-security/chart-execution-paths.png)

Currently, available content is divided into four categories:

**Workspace Security Review**: Check your project's code, dependencies, and configurations. Local commands, builds, and tests require separate execution confirmations; working directory restrictions are not equivalent to operating system sandboxes.

**Built-in Practice Range**: First-time learning to check and read reports, inspecting the mirror components of temporary isolation ranges, without demonstrating business exploits.

**My Host or Service**: Check for yourself or clearly authorized services, supports TCP connections, plaintext HTTP root path first response, and two verified leak rules.

**My Containers**: Check for known component issues in project images. Snapshot image audit does not equal a complete security assessment of a running application.

Local models can call five security tools: querying environments and authorizations, checking authorized hosts, auditing specified containers, checking built-in ranges, and paging to read reports. It must first know its true capabilities before deciding on the next step, not guessing "I should have this tool."

## 2. How to use the new interface: first select the object, then check the range again

The old interface split environment, reverse validation, authorization, and scanning into many buttons. When opening it for the first time, it's easy to not know which to click first. The new version consolidates normal operations into three object entry points: **Built-in practice range, My Host or Service, My Container**; Default collapse for environment diagnosis and maintenance.

![1.6.6 Installation Version Real Window: Only displays the operation of the selected object; Select Juice Shop and model execution method, no need to enter IP or container number.](https://hyphentech.top/obsidian-assets/localbrain-network-security/native-166-model-entry.jpg)

There are two execution options. The default "Let local model check" targets the formal conversation, which is handled by model query capabilities, tool calls, and report organization; "Direct check" does not call the model but only runs a fixed inspection process.

I recommend selecting the built-in range for the first time. If you want to check the entire model chain, use the model method; If you only want to check whether the scanner and environment are normal, use the direct method. If the direct method succeeds and the model method fails, then you can continue checking model calls, confirming, and session handovers, without blaming everything on model parameters from the start.

![1.6.6 True Scope Confirmation Card: Centralized verification of objectives, execution methods, and inspection scope; Inspection cannot start without selecting authorized checks.](https://hyphentech.top/obsidian-assets/localbrain-network-security/native-166-scope.jpg)

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

![1.6.6 Installation and Local Resources: Apple M5 Pro, 64GB unified memory; weights and operating environment remain user-selected.](https://hyphentech.top/obsidian-assets/localbrain-network-security/native-166-installed.jpg)

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

![1.6.6 Genuine Native Tool Approval Box: Clearly only audits the juice-shop temporary range, does not authorize other network targets, and does not exploit vulnerabilities.](https://hyphentech.top/obsidian-assets/localbrain-network-security/native-166-approval.jpg)

## 4. Comparison under the same conditions: 35B and the original 27B have the same scan, but the explanation is different

All four times were run in the 1.6.5 install, targeting the same Juice Shop image, with no restart between the two instances. The model uses the same entry point and check requirements; 27B is the original Qwen 3.8-27B-Splash, not Swift 1.5. The total time spent in the table includes model task organization, report reading, and manual approval waiting, so it cannot be considered a pure inference speed ranking.

| Record | Total time consumed | Number of rounds / tool counts | Backend scanning | Actual deduplication and read |
| --- | --- | --- | --- | --- |
| 35B for the first time | 69 seconds | 5 / 5 | 13 seconds | 29 / 170 entries |
| 35B The second time | 164 seconds | 23 / 22 | 13 seconds | 170 / 170 articles |
| 27B for the first time | 201 seconds | 5 / 7 | 13 seconds | 29 / 170 entries |
| 27B The second time | 145 seconds | 7 / 7 | 12 seconds | 19 out of 170 articles |

![1.6.5 Original 27B first actual results; Total model time recorded separately from the scanning phase.](https://hyphentech.top/obsidian-assets/localbrain-network-security/native-165-27b-first.jpg)

Each time, the scanner gave 9 ratings of Serious, 54 High, 83 Medium, and 24 Low. The actual evidence obtained by the model differs: 35B used 19 readings to traverse all records the second time, totaling 23 rounds; 27B repeated the first page of high-risk the second time, but actually found only 19 different records. Parameters saved by the backend show that these requests were not offset, so the model cannot assume pagination is invalid just because it says "I sent 10."

![1.6.5 Original 27B second consecutive real window. Scan successful, but the explanations of "no fix" and "parameter not active" in the report are still incorrect.](https://hyphentech.top/obsidian-assets/localbrain-network-security/native-165-27b-repeat.jpg)

This comparison does not filter out failures or misinterpretations. It shows that execution links can be used continuously, and also shows that model descriptions cannot replace tool facts. Each model only has two entries, which is insufficient to prove which is generally better; 170 entries are component matches, not the number of independent vulnerabilities, and certainly not the number of successful exploits. [Complete comparison record](https://github.com/HackerChi-Hub/localbrain/blob/main/docs/evidence/2026-10-04-native-acceptance/27B-SPLASH-COMPARISON.md).

The handling of 1.6.6 is handled by a common mechanism: returns the actual pagination parameter and the full request for the next page; repeated readings do not add cumulative evidence; missing fields are marked as unknown; invalid targets are rejected before approval. The model still decides which key evidence to read, does not force iteration by line, and does not automatically change parameters based on a particular model name.

After installing 1.6.6, I used the same original 27B to go through the real entry, native approval, scan, and evidence reading again. The first round lasted 4 minutes and 43 seconds, including about 1 minute and 38 seconds of manual approval waiting; The scan itself was still 13 seconds. Throughout the entire 7 and 8 rounds of tools, the 5 readings actually only read 19 different records, and repeat requests did not increase the number of reads.

![1.6.6 Original 27B First Round Actual Results: Task Completion and Total Time; 19 deduplication read statistics come from the original receipt, not proof by this screenshot alone.](https://hyphentech.top/obsidian-assets/localbrain-network-security/native-166-first-result.jpg)

This round of the model correctly states "vulnerability database updated, offline scan," and clearly states that all 9 critical items were read, 10 high-risk samples, and medium-low risk not read. The table labeled the missing fix version as "unknown," but the subsequent suggestion still used "unknown fixed" and provided upgrade suggestions for this round without online verification. I keep this inconsistency: the program can provide verifiable facts, but it cannot force the model to be accurate every sentence. The formal package is the delivery of this mechanism, not the security certification suggested by the model.

The second consecutive unrebooted session was completed: 4 rounds, 4 tool runs, 2 report reads, still 19 different pieces of evidence; Log recording actual scans took 12 seconds, 170 matches, and temporary container and network cleanup successfully. The interface took a total of 10 minutes and 57 seconds, with the tool phase containing 8 minutes and 56 seconds including lock screen and approval waiting, which could not be used to judge model slowdown. At the end of the second round, the real interface was accessible by text and persistent log verification; Subsequent screenshot service failed, so no images were recreated in the second round.

| 1.6.6 Original 27B Test | The first time | For the second time in a row |
| --- | --- | --- |
| Total task time including manual waiting | 4 minutes 43 seconds | 10 minutes and 57 seconds |
| Actual backend scanning phase | 13 seconds | 12 seconds |
| Number of rounds / number of tools, including delivery | 7 / 8 | 4 / 4 |
| Number of times reports are read / different types of evidence | 5 / 19 | 2 / 19 |
| Total number of components matched | 170 | 170 |
| Temporary resource clearance | Success | Success |

The second round's statements about "unknown fix" and "19 reads only" are more accurate, but the two preparations were successfully made as identical database snapshots; Without a database summary, snapshots cannot be proven. The final "file completed" also does not apply to this task without file delivery. These are issues with existing model interpretation and closing wording, not facts verified by scanners. We can confirm that the continuous execution link is normal, but this does not guarantee the accuracy of every report sentence.

## 5. Historical Testing: The model is fully executed, and the report can be read again

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

## 6. Historical backend supplementary testing: Is there any problem with continuous use?

The 1.6.4 retest uses the current source code compiled production safety adapter, completing two consecutive Juice Shop checks without restarting the test process. After scanning, three pieces of raw evidence are read, each with an independent report number and a non-null result.

![1.6.4 Production backend continuous check data: 15.307 seconds and 16.313 seconds, cached but not including model and manual confirmation.](https://hyphentech.top/obsidian-assets/localbrain-network-security/chart-backend-repeat.png)

| Check | Scan | Read the evidence |
| --- | --- | --- |
| The first time | 15.307 seconds | 29 milliseconds |
| The second time, it was not restarted | 16.313 seconds | 33 milliseconds |

The two independent report numbers are `e18e6e8b-e06a-4c5b-9793-708dddf7f8f5` and `7f6b4b9e-4f89-43f8-b327-a75e9a970ae3`, used to trace the execution in the archive, and are not parameters that readers need to fill in.

This validates the continuous scanning and report reading of the production backend, not the full process of the new native model interface. The first download of the isolation environment, scanner, and vulnerability database cannot be directly copied from the fifteen-second expected in the table.

There are also failures in testing: the first script mistakenly read the returned `reportId` with another field, and after scanning, the report request was missing the number. Only after correcting the test script fields did the above table be obtained. Failures occur in the test script and cannot be attributed to the model; After fixing, you cannot pretend the first time never failed.

## 7. How should the 170 findings be interpreted?

The two new backend results were consistent: Severe 9, High 54, Medium 83, Low 24, totaling 170 entries. These are matching records of identifiable software packages within the image and known vulnerability databases, not the 170 successfully exploited business vulnerabilities.

![Severity distribution of 170 component matches: Severe 9, High 54, Medium 83, Low 24. This chart does not indicate vulnerability exploitability.](https://hyphentech.top/obsidian-assets/localbrain-network-security/chart-severity.png)

When reviewing reports, check at least five things: which target is the target; Matching components and versions; Where the evidence comes from; Whether the fields are fixed are clear; Check what is not covered.

This override covers identifiable packages in the image and does not overwrite additional files, host kernels, or application business permission logic for running containers. Offline scanning does not connect to the network for parsing dependencies, but during the preparation phase, vulnerability databases and Java databases can still be updated online. A successful database download does not prove full coverage of Java components; 1.6.6 Record the status of most recently successful preparation separately; unverified overrides remain unknown. No specific type of issue was detected, so overall target security cannot be inferred.

The model made an initial mistake: the report had an empty fix version, saying "no official fix." In reality, it could only say "the database records do not list the fix version." The original report was later reviewed before correction. Therefore, the model recommended that there must be backpoint evidence; Which version to upgrade should still be verified in conjunction with the project; the recommendation is not a fixed that has already been performed.

## 8. Your own host: Presets will fill in for you, but the target cannot be authorized for you

Select "My Host or Service" and select the inspection plan first. If there is an optional local service, select from the dropdown box and use the actual address and publishing port of the discovered service; Manually enter its own address only if the target is not listed.

![Screenshot of the old version real host configuration: shows the solution, target analysis, and authorized content. It is not the scan result of any address in the image.](https://hyphentech.top/obsidian-assets/localbrain-network-security/ui-host-20261003.png)

| Preset and default range | It must be verified |
| --- | --- |
| Web Services: 80, Connection and Response Header | Actual service ports and protocols |
| Development services: 8080, connection and response head | Actual release port |
| SSH service: 22, connection only | Address and real SSH port |
| Web Leak: 80 and Reviewed Read-Only Rules | Agreements, scope of authorization, and risks |

For example, your own development service is actually `192.168.1.20:8080`: select the development service, enter `192.168.1.20`, parse and verify the address, port 8080, connection and response header, authorization validity period is 15 minutes; check the appropriate license when checking the intranet. This address is just an example and not the test target of this article. Please replace it with your own real and authorized address.

The program can automatically provide default values for the scheme and read ports from published services; **It cannot automatically determine that you have test authorization for a specific target**. If a domain has multiple addresses, only one of the actual addresses is confirmed this time; Execution does not reresolve the domain name or follow external site redirects. Webpage paths will not be expanded to full site crawling, and entering HTTPS will not turn existing HTTP checks into full HTTPS audits.

The local service list only covers published services discovered within the dedicated isolation environment and does not automatically detect the entire local area network. Expires after authorization expires or the application is exited; reading old reports will not restore permissions.

## 9. Your own container: Choose the real target, don't fill in numbers manually

Select "My Container," choose an actual container from the list, then verify the target and image. The model method hands the clear container number to the dialogue; The direct method audits the image snapshot. Neither method equals exploiting vulnerabilities on the running webpage.

![Screenshot of the original container selection for the old version: DVWA was the container selected at the time. The 170 results in this article are from Juice Shop and cannot be misled.](https://hyphentech.top/obsidian-assets/localbrain-network-security/ui-container-20261003.png)

When the list is empty, first verify the environment with the built-in range; then refresh the maintenance area if needed. Do not fill in container numbers out of thin air, and do not assume the computer is unserviced just because the list is empty. The first time the scanner and database are ready, you need to download them online; Normal rechecks do not require manually clicking updates each time.

For code projects, the task can be changed to: "Review dependencies and configurations of this authorized workspace, first provide evidence, then propose minimum repair suggestions; Request confirmation before building or testing." This does not require authorizing network hosts, but project scripts may access external directories or software repositories, so commands must still be verified; workspace selectors cannot be treated as complete system isolation.

## 10. What to do with errors: First, identify the failed segment and avoid repetitive random points

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

## 11. 1.6.7 New: From "Check" to "Authorized Penetration," the model can now write its own PoC

Back to the question in the title—can it take orders for penetration testing? Up to version 1.6.6, the answer was still just "it can perform connection and response header matching checks within the authorization scope." 1.6.7 Went a step further: on top of the same isolation set, three new categories of **explicitly checkboxed high-impact scopes by target** were added, allowing this Mac to take orders for authorized penetration testing.

- **Service and Version Identification**: Run nmap -sV in the sandbox to identify which service and version are on the authorized port.
- **SQL Injection Probing**: SQL Map runs in the sandbox but only enables detection techniques. Switches for os-shell, file read/write, and rights grabbing are written out in the code and excluded, making it impossible for the model to access.
- **Self-Written PoC Execution**: The model (or yourself) writes a Python or sh script and hands it over to the isolated sandbox for execution.

The last point is the key, and also my most cautious point: letting the model write code to hit the target sounds risky. It can be released not because I trust every line the model writes, but because the **exit is locked by the network**. Each task starts an isolated network without default routing, and the script's only output is a proxy that forwards only to the authorized target; The script only receives the proxy address and the mapping of the "local port →destination port," **not even knowing the real target IP**. So even if the script says it needs to connect to the public network or attack other machines, it still can't get there—there's simply no way forward.

I tested this issue with a real script in a local isolated environment, with a full round lasting about 59 seconds:

| Verification items | The result |
| --- | --- |
| PoC authorized access to authorized targets via proxies | Return HTTP 200, which is enough |
| Attempting to connect the same script 1.1.1.1:443 (public website) | Rejected, unable to connect |
| Damaging scripts with `rm -rf /` and `drop table` | Direct refusal to enforce |
| Fences back-validated by self-written PoC images | Pass: Unauthorized ports, direct connection to targets, and all public networks are denied |

Destructive categories—denial of service, data deletion and modification, evasion detection—reject by signature; Declaring PoCs that change the target's state must be confirmed again before execution. Each of these three tools requires you to approve them one by one in the native pop-up window; writing "approved" in the parameters is useless. Authorization remains the usual rule: single IP, up to 8 items, up to 60 minutes, expires upon exiting the app, and only you can select Create on the interface—the model cannot issue or extend authorization for itself. After upgrading to 1.6.7, each machine must re-verify the local range reverse verification before this line opens.

So the answer to "can you use the order" is: the scope is locked by technology, and the model is set to the most autonomous level—choose tools, change configurations, write your own PoC, all are fine, but destructive actions add a barrier. Whether you can accept it depends on whether you have the authorization letter, not whether the software can stop crossing the line—crossing the line violates Articles 285 and 286 of the Criminal Code and the Cybersecurity Law. It's a tool for collecting evidence and generating reports, not a way to bypass authorization. This line is currently only tested on Mac; Windows and Linux have built the same functionality, but isolation and reverse authentication haven't run on either side of the real machine, and execution also "doesn't open until reverse authentication is passed."

## 12. Which version should I download? Which conclusions have not yet been accepted?

The official version for this round is [1.6.7 All-Platform Release Page](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/v1.6.7), which is the version where the authorized penetration capability from Section 11 is located. After re-downloading the installation package from the release page for the three platforms, SHA-256 matches the build value step by step, and the update signature is validated; Mac is not yet notarized by Apple. The update list and download page are synchronized to 1.6.7, and the old release has been cleaned up. The operation screenshots in this article still come from the locally installed version 1.6.6; 1.6.7 adds penetration capabilities on it, and the conclusion comes from end-to-end verification in the isolated environment rather than screenshots of the interface.

Windows and Linux are built from the same source code submission; installation package hashes and update signatures have been verified, but both platforms have not yet been accepted for real-world use. Linux is still considered to be preview-supported, MLX/Splash cannot run, and managed llama.cpp and Prism downloads have not yet been fully integrated. The model runs and native window tests in this article are from Mac and are not extended to guarantee across all platforms.

In source code acceptance, 1,423 frontend tests passed, with 2 skipped; Rust tests passed 305 and 19 ignored tests (1.6.7 added penetration-related unit tests and one real device fence test); The Python environment test files of the product had already been fully re-tested. I also performed mutation validation on two new gates: the "destructive denial" and "PoC cannot obtain the real target IP" judgment were intentionally altered, and the corresponding tests immediately turned red, confirming they were indeed blocking rather than just for show. Skipping and ignoring items did not count as passing, and the number of tests could not replace native acceptance or guarantee that the model interpretation was error-free.

![Acceptance layering: Records real Mac model calls, backend evidence, and cross-platform package validation separately, building acceptance without impersonating real devices.](https://hyphentech.top/obsidian-assets/localbrain-network-security/chart-evidence-levels.png)

For Mac, select the Apple Silicon package and install it into the application; For Windows, select the x64 installer; For Linux, choose either the AppImage or Debian package depending on the system. For initial preparation, additional dependencies may be required; confirm according to the software prompts; For downloads requiring international networks, prepare the connection in advance. Specific dependencies, hashes, and platform boundaries are based on the release page.

## Finally: the first time you get the report, the second time you learn to question the evidence

The most worthwhile part of this tutorial is the two requests: first, check the built-in range; second, clearly say, "Do not rescan, read the report from earlier." The former verifies the execution link, the latter verifies whether the model can use the evidence already obtained.

I don't want to prove software is amazing with a huge vulnerability number. What's more useful is: fill in fewer meaningless tables, keep goals and scopes clear; Have tools available for models, and programs retain permissions; Every conclusion can be reported back, and failures can be retained.

First, use a practice range to streamline this process, then review your own projects and services. Only test your own or clearly authorized targets; Scanning may cause resource usage or service anomalies, and risk warnings do not replace legitimate authorization.

Data sources for this article: [1.6.7 Penetration Capability Implementation and Isolation Testing](https://github.com/HackerChi-Hub/localbrain/blob/main/docs/RELEASE_1.6.7_VERIFICATION.md), [Security Function Design and Boundaries](https://github.com/HackerChi-Hub/localbrain/blob/main/docs/SECURITY_TESTING_PLAN.md), [Model Calls and Native Test Records](https://github.com/HackerChi-Hub/localbrain/blob/main/docs/SECURITY_MODEL_AGENT.md), [1.6.4 Historical Backend Acceptance](https://github.com/HackerChi-Hub/localbrain/blob/main/docs/RELEASE_1.6.4_VERIFICATION.md). Complete original receipts and window screenshots are kept for local testing and archiving; All schematic diagrams are drawn based on this and are not generated fake interfaces.


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
