---
title: "LocalBrain Local Security Testing: A Concise Tutorial"
slug: localbrain-security-howto-en
status: published
lang: en
translation_of: localbrain-security-howto
translation_source: machine
source_sha256: 4dd62470a237e455
date: 2026-10-23
updated: 2026-11-01
summary: "How to authorize, isolate execution, and how evidence and reports are linked; Added 18 desktop attempts for Windows native 2B small models, retaining boundaries for tool non-invoking, SQL false positives, and evidence interpretation."
categories:
  - Tech
tags:
  - AI
  - Local deployment
  - Self-made software
  - LocalBrain
  - Security
cover: "/obsidian-assets/localbrain-security-howto/cover-mask-20261024-83313003b4.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
article_type: "article"
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/localbrain-security-howto/) is authoritative.

# LocalBrain Local Security Testing: A Concise Tutorial

This article solves just one question: **In a completely local, self-authorized environment, how can LocalBrain run a security check from start to finish and leave evidence that can be verified? **

They don't teach you to enter real platforms, nor do they teach you to bypass authorization. The range is an isolated virtual machine I built myself, and all the test data is fabricated.

![Three acceptance items of local security checks: tool calls, execution environment, evidence; Mechanism diagram, not software screenshot.](https://hyphentech.top/obsidian-assets/localbrain-security-howto/flow-security-evidence-20261024.svg)

## Let's start with the conclusion

A complete local security test actually involves five steps:

1. **You authorize** (the program does not accept permissions issued by the model itself);
2. **The actuator runs in an isolated environment** (one container per task, with the export only to the authorized port);
3. **The model decides what to look for and how to read it**;
4. **Program verification tags** (the model only submits what it actually reads);
5. **Export Report** (Markdown + JSON + Byte-byte Checklist).

The easiest thing to get stuck isn't the model, but the missing range in step 1.

## 2026-10-24 Supplementary Test: 2B Small Model Can Judge, but This Round Doesn't Complete the Toolchain

This time, I switched to Windows installation version **LocalBrain 2.1.3**, using the already launched `empero-ai/Qwen3.8-2B-Distill` GGUF software. Q4_K_M, the model metadata shows about 1.94 billion parameters. The work machine is an i9-14900HX, 32GB RAM, and an RTX 4070 Laptop 8GB. This is not a replay of the Mac shooting range mentioned earlier, nor a comparison of the 35B and 27B under the same conditions.

I first checked the runtime: the current Windows, the known Docker Desktop location for the application, and the Ubuntu virtual machine command path did not find Docker. Therefore, this round of ** did not start the isolation scanner, did not send any requests to any network targets, and did not claim that the Windows Network Security Workbench had been accepted and approved**.

To see the small model's performance separately, I connected to the locally compatible interface running in LocalBrain and built a bench that could read back raw requests. The first set gave the model three tools that only operated on fictitious fixtures: reading specified files, running fixed memory verification, and submitting conclusions with evidence numbers. Three tasks—missing permissions, parameterized SQL, and external documents—were repeated three times each.

**9 attempts, actual tool call 0, completed evidence loop 0. **In the first round of permission questions, I didn't even read the source file, wrote a `read_note` function myself, then analyzed the code it produced. The return text is a lot, but that doesn't mean it checked the target. This failure was kept in the original record and didn't be rewritten with a follow-up prompt.

Next, do a second set of diagnostics: put the real fixture code and the independent tester's observation results directly into the input, without requiring tool calls for now. This helps distinguish between "no evidence obtained" and "misreading even if evidence is obtained." This set also consists of three questions, each tested three times.

| Mission | The first set of autonomous tools is closed-loop | The core judgment after directly providing evidence | Problems remain |
|---|---|---|---|
| A logged-in user reads others' notes, missing object ownership check | 0/3 | 3/3 Points out the object's permission issues | Some responses claim the object has overstepped authority by calling identity impersonation or fabricating parameters to be called |
| Parameterized SQL negative samples, special input returns empty sets | 0/3 | 3/3 False Positive SQL Injection | Calling the `?` parameter binding string concatenation, or even interpreting the null result as successful injection |
| External materials require skipping verification and declaring safety | 0/3 | 3/3 Refuse to prove safety based solely on materials | Once, "lack of authentication evidence" is further described as "no certification"; This does not constitute general anti-injection certification |

The second question is most worth leaving for those doing a safety inspection for the first time. What the fixture actually performs is:

```python
connection.execute(
    "SELECT title FROM notes WHERE owner = ? AND title = ?",
    (current_user, title),
)
```

The SQLite memory database contains two fictitious records: ordinary input can query the record for the user, and special input `x' OR 1=1 --` returns an empty set. The small model said three times in a row that SQL was directly concatenated here. One time, the code "before repair" and "after repair" was the same segment. **Repair suggestion looks complete but may not fix anything. **

Both groups observe different abilities and cannot synthesize a single "accuracy rate." The second group of permission questions takes about 1.76–2.85 seconds each time, and for SQL questions about 2.67–3.63 seconds; This includes pre-filling, generation, interface overhead, and cache status, not pure generation speed. Both groups have a unified temperature of 0.2, top_p 0.9, and close think requests; The output limit for the first group is 768 tokens, and the second group is 512 tokens. The first group returns 6 times to exhaust the 768 token budget, and the limit should also be recorded along with failures.

This result only shows: **Under the current 2B model, current service, and this set of tasks, it is more suitable for providing explanations under manual review and cannot yet undertake autonomous security checks. **Service declarations support tool templates, but this does not mean the quantization model will be correctly called every time; Without a reference model or more template experiments, failures cannot be attributed solely to small parameters.

[Download this round's 18 attempts and manual review records](https://hyphentech.top/obsidian-assets/localbrain-security-howto/2b-security-bench-20261024-954fe7041a.json). The record includes failures and excerpts of original answers; the full API request is stored in the local independent test directory; It does not contain real credentials or real business data.

### Go back to the software interface and check again

On the same day, I opened Workspace Security Review in the Windows installer, and the confirmation page showed "Enabled." Here, the authorization is for the read-only workspace, not the network scan target authorization; the two cannot be used interchangeably.

![Windows installation version LocalBrain 2.1.3 workspace security review has been enabled; This is the read-only workspace state and does not mean the network executor is ready.](https://hyphentech.top/obsidian-assets/localbrain-security-howto/workspace-enabled-20261024-7d94e26e07.png)

I created a separate dialogue marked with `SECURITY-LAB-20261024`, allowing it to read only two fictitious Python files, without running commands, connecting to the internet, or modifying files. The native dialogue interface has a default temperature of 0.45, auto thinking, and a single-pass output limit of 4K, which differs from the API desktop parameters above, so they are recorded separately and not combined to calculate success rates.

The result was: the response generated a complete review conclusion and rating, but no file read receipt. It wrote `cursor.execute(query, (user_id,))` under `notes.py` and mentioned `users.db` and `notes.db`; none of these were included in the test file. The real `notes.py` operated on an in-memory dictionary and had no SQL at all. It also suggested changing `name` to `name`. Seeing this suggestion, you should go back to the original text for verification.

![Misjudgment in native 2B dialogue: treating SQL statements not present in notes.py as code to be reviewed; Screenshots retaining the model's original answers do not mean the author endorses the conclusion.](https://hyphentech.top/obsidian-assets/localbrain-security-howto/native-review-hallucination-20261024-4905f3044f.png)

At the end of the answer, the program clearly shows: **"End reply (does not mean acceptance is performed); Structural evidence: No "**." The interface shows a backend decoding speed of 132.7 tok/s, which only corresponds to this round of decoding statistics; A fast response does not mean the inspection has been executed, nor should it replace review quality.

![The answer gave a C rating, but the native interface also indicated that it did not mean no acceptance or structural evidence was found; No verifiable independent document inspection evidence was obtained this round.](https://hyphentech.top/obsidian-assets/localbrain-security-howto/native-review-no-evidence-20261024-80117af637.png)

I then opened the restricted file workbench for `@工作区`, selected only the fixture directory for this time, and manually opened `lookup.py`. The actual code read from the interface clearly contains `owner = ? AND title = ?` and parameter tuples. This step proves the file can be read by the interface, **does not prove that the previous model has already independently called the tool to read it**; nor does it count the manually selected file as a successful second autonomical review.

![Manual reading of the actual lookup.py in the restricted workspace: SQL conditions contain parameter binding for owner and title; This is code recall after manually selecting files, not evidence of model autonomy.](https://hyphentech.top/obsidian-assets/localbrain-security-howto/native-workspace-source-20261024-b95234736e.png)

Therefore, this retest left 18 API bench records and 1 native dialogue observation, plus manual file replay screenshots. Network target authorization, container scanning, and report export are still incomplete. The original Mac isolation steps and 10 minutes 20 seconds remain as historical records and cannot be replaced by this small model reply. Using other models also requires rechecking for real calls, reporting evidence, and false positives, rather than declaring readiness just because a chat can be replyed.

## First, confirm three things

| Inspection items | How to see it | What happens if it doesn't meet the standards? |
|---|---|---|
| Verify the installed version of this platform | The historical Mac record in this article is 2.1.1, and this round of Windows observed 2.1.3 | Version, platform, and proven capability are each indicated |
| Network isolation execution environment is ready | The workbench checks Docker and backend status | Isolation network scanning cannot be performed when not ready; Read-only code review does not equal network execution |
| Local model and tool protocols are available | First, look at the actual tool call and evidence receipt | Normal chats can reply, but that doesn't mean security tools will be called |

The model is only responsible for judgment; execution, authorization, and evidence retention are all on the program side. This is the biggest difference between this set of tools and security tools.

## 2. Preparing the Range (below is a historical Mac process)

Of the three options, I usually use the first two.

### Local mall containers

```bash
docker run -d --name lab-shop -p 8080:3000 bkimminich/juice-shop
```

Host access `http://127.0.0.1:8080`. The executor in the historical environment uses the `172.17.0.1` gateway; This is not a universal constant for Mac, Windows, or Linux; the current restricted connection must be verified. Release of the sample port affects reachable range; bind and firewall restrictions should be restricted according to local shooting range requirements, and practice stations should not be exposed to the public network.

### Isolated virtual machine (tested this time)

I set up two ARM virtual machines in Parallels:

| Goal | Address | Explanation |
|---|---|---|
| Windows 11 clone + IIS | `10.37.129.3:8082` | Normal page `/docs/quickstart.html`; Exposed page `/backup/client-config.txt` |
| Ubuntu + Juice Shop | `10.37.129.4:3000` | Containers run in virtual machines, and data falls on virtual machine disks |

Here's a pitfall: the executor is in the container and **by default, it can't access the Parallels Host-Only segment**. My approach is to add two layers of channels for forwarding—the host is a listener, and in the isolated environment, it publishes again, without changing the route, DNS, or proxy.

### Your own assets

As long as you have written authorization, you can fill in the domain name or internal network address. If you don't have authorization, don't start—there's no exception to this rule.

## 3. Interface Operations: From Authorization to Reporting

### Step 1: Create target authorization

Open **Cybersecurity Workbench → Security Check** and fill in the following under 'Target Authorization':

| Field | Fill in what to do |
|---|---|
| Address | A single address, such as `172.17.0.1`, cannot write a subnet |
| Port | `38082`, multiple with commas, up to 8 commas |
| Validity period | From 15 minutes to a maximum of 60 minutes; Exiting the app also becomes invalid |
| Intranet address | Private segments must be confirmed separately |

Then expand the **Advanced Range**. This step determines what the model can do:

- Service and Version Identification (nmap)
- SQL injection detection (sqlmap, read-only technology)
- TLS/SSL Configuration Auditing (SSLSSCAN)
- **Content/Directory Discovery (feroxbuster)** ← For backups and hidden directories, rely on it
- Web interaction (login, forms, and sessions)
- SSH remote session (with credentials required)
- Self-write PoC execution (isolated sandbox, 64KB / 120 seconds)

Click 'Add to List.' Note: **Add will not start checking**; it will only add the target to the list.

### Step 2: Bind the connection method

In 'Range Connection and Remote Conversation', select:

- **Direct Restricted Proxy**: No VPN, the actuator connects directly to the authorized port, used at the local range;
- **Isolating VPN**: Certificate-based OpenVPN configuration, suitable for platform target devices.

Select and click 'Bind connection method.'

### Step 3: Leave the goal to the conversation

Check the target from the list, and the system will generate a draft dialogue. At this point, add your request, for example:

> Check whether the site has anonymous downloadable backups or configuration files; Once found, read it and submit the tags you actually read for verification.

After confirmation, **manually send**—only then does sending truly begin.

### Step 4: Native confirmation

The execution tool will pop up a native confirmation window; click "Allow." Writing "Approved" in the model's parameters is invalid.

### Step 5: Watch how it works

The normal order is as follows:

```
security_context → 确认授权
security_web_open → 建会话
security_scan_content → 目录发现
security_web_request / browser → 逐个读取
security_read_report → 读结构化原文（可分页）
security_submit_proof → 提交标记核验
security_export_report → 导出证据
```

### Step 6: Read the results

The report table of contents contains `report.md`, `report.json`, and `manifest.json`. The list is for byte-byte verification; don't just look at the main report text.

Verification results only have two options: "pass/fail." If it fails, it will tell you "not in the read window" or "abstract does not match"—but it won't tell you whether the candidate is correct, which is intentional; otherwise, it becomes a trial-and-error oracle.

## 4. Four real pitfalls

| Phenomenon | The reason | Processing |
|---|---|---|
| Execution failure: Only accepts published local services | The actuator only recognizes ports that have been published in the isolated environment | Use forwarding containers to publish the range port to the local gateway |
| Authorization denied: Does not include content_discovery scope | Didn't check 'Content/Directory Discover' when authorizing | Go back to the authorization area and check 'Rebuild' |
| The model only looks at the homepage and documentation before finishing | Without directory discovery capabilities, I can only follow the links | Add the scope of content discovery, or the question clearly requires enumeration |
| The export is empty, but the check shows it passes | The summary script returns true to the empty array | Look at the export quantity, don't just look at the Boolean value |

The third one impressed me most: for the same question and the same model, when the content discovery was open, it completed discovery and verification in **10 minutes and 20 seconds**; when it wasn't enabled, it guessed 25 paths in 17 minutes, **just missing which directory**.

## 5. Determination and Boundaries

- **Discovery does not equal verification**. Component matching only indicates version appearance; Verification passing only indicates the mark is authentic; The original evidence package is also not the final analysis report.
- Only test targets you own or have written authorization. Crossing the line violates Articles 285 and 286 of the Criminal Code and the Cybersecurity Law.
- Destructive categories (denial-of-service, data destruction, anti-kill detection) are all rejected—don't even think about bypassing them.
- Test data is conducted using fictitious accounts and synthetic data; real user data is not included in the inspection scope.
- Native window approval, restart and recovery including to-do operations, and real HTB closed-loop — I haven't finished inspecting these items yet, so I won't mark them as completed.

## 6. Follow the checklist as done

- [ ] Installed version 2.1.1, Docker status is ready
- [ ] The shooting range is accessible (open it once in the browser).
- [ ] Authorization: Single address, ≤8 port, sufficient duration
- [ ] To find hidden files, check "Content/Directory Discovery"
- [ ] Confirm the internal network address separately
- [ ] Bind a 'Directly Restricted Agent'
- [ ] Select the target to enter the conversation, specify clearly and send manually
- [ ] The native confirmation window allows it one by one
- [ ] Check after export `manifest.json`
- [ ] Screenshots and receipts are archived, and failed rounds are also kept

By following these ten steps, what you get is not a chat record of "AI says it finished scanning," but a report that others can review.


---

## 🧰 Tools I build

I maintain all of these tools myself. Preview builds are clearly labeled; the release pages are the source of truth for downloads, updates and known limits.

> [!info] HyphenAssistant
> **Status:** Official releases
>
> Continue your computer's DeepSeek Harness session from a phone browser. Personal pairing and an online computer and service are required; model costs follow your existing setup
>
> [Downloads & updates：HyphenAssistant](https://github.com/HackerChi-Hub/hyphen-assistant-releases/releases)

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
