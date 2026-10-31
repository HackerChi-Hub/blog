---
title: "LocalBrain: a local AI workbench for Mac, Windows and Linux"
slug: localbrain-local-ai-box-en
status: published
lang: en
translation_of: localbrain-local-ai-box
date: 2026-09-28
updated: 2026-10-31
summary: "Mac 2.2.2 is released with consistent runtime controls, engine updates and rollback, pasted attachments, and actual Splash 1.5 text and vision replies. Windows/Linux 2.2.2 were published separately with platform-specific verification."
categories:
  - Resources
tags:
  - Tools
  - Development
cover: https://hyphentech.top/obsidian-assets/localbrain-local-ai-box/cover-7a52f6d721.jpg
legacy_paths: []
---

## Mac 2.2.2: consistent runtime controls and pasted attachments

Mac 2.2.2 has passed installed-app verification and is publicly released. Windows/Linux 2.2.2 were published by a separate build; see their [platform-specific verification](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/VERIFICATION-2.2.2-WIN-LINUX.md). This section describes the Mac update; historical text and screenshots retain their original dates and test conditions.

In Settings → Runtime and diagnostics, equivalent actions now share the same name, button style and order: Install, Update, Verify, Roll back, Uninstall and Clear cache. Current and rollback versions and check times appear in the information area, keeping long version strings out of the buttons. Ready ordinary components do not offer another installation; cache cleanup and rollback appear only when their corresponding data exists. Existing external Docker services, package managers and build tools are detected, reused and preserved.

Check runtime updates only queries official version information. Updating requires confirmation, and starting a model never updates its engine automatically. The installed app updated six independent engines to these versions while preserving their previous environments:

| Component | Version installed in this round |
| --- | --- |
| Splash | 1.5.0 |
| Sushi | 1.4.1 |
| Music and image editing, mlx-serve | 26.10.3 |
| GGUF text and vision, llama.cpp | b12018, official rolling build |
| Ternary-model engine, Prism | prism-b10831-9d9efea |
| Offline component checks, Trivy | 0.76.1 |

Updates validate the official archive and launch interface before switching to an independent directory. Failed validation preserves the old environment. Rollback also checks files and related task state. The installed app completed a real Trivy 0.76.1 → 0.75.0 → 0.76.1 round trip, ending at 0.76.1. Shared Python and Torch dependencies retain the tested combinations rather than receiving an unrestricted bulk upgrade.

Maintenance results persist across reopening: before/after versions, no upgrade needed, reused cache, downloaded content, database time or a failure reason. This round reused one valid device-database cache and two container-database caches, explicitly reporting that nothing was downloaded. Web-checking rules were actually updated and verified. Unknown progress shows the processing stage; percentages require actual download byte counts. An unrelated model startup no longer blocks independent database maintenance. Related environments in use report that the operation was not executed and the current task was preserved.

Splash 1.5 launch-argument detection is also fixed. Wrapped help descriptions had been misclassified as positional arguments, causing an exit before loading weights; the parser now follows actual argument declarations. Existing Qwen3.8 27B weights completed text and image-understanding requests without downloading them again. Initial startup included upstream calibration and warmup: approximately 2 minutes 14 seconds to readiness, with about 5 seconds spent loading weights. Those are separate measurements.

The composer accepts pasted Finder images, text files and videos, as well as copied image pixels. Attachments wait in the draft area and are read only after sending. In the installed app, a three-file request correctly returned the text file's first line and identified an orange-yellow square and cyan circle. It also explicitly reported that the video was a local file reference with no frames or audio read. Video attachment references are supported; video understanding still needs the corresponding capability. Cancelling removes the image copy created by this paste while preserving the original files.

Embedded DeepSeek Harness is adapted to 0.2.1-rc.5 and updates with the app. An actual multimodal conversation completed in the installed version. Checks passed for 458 Rust tests, 1650 TypeScript tests, 14 adapter tests and 53 core regression tests; additional skipped and ignored tests remain documented. All 15,638 files, permissions and links matched across the build, disk image and installed app, and application/updater signature checks passed. The Mac app remains locally signed and not Apple-notarized. Windows/Linux native hardware was not tested in this round. Temporary verification conversations were removed; detailed records remain local.

Mac 2.2.2 DMG SHA-256: `8304011e22eda8b7e2b6947ae3ba226ceb5412233b3679880702abdc238526d4`. The GitHub source documentation job could not start because of account billing restrictions. On 2026-10-31 the author explicitly approved this Mac release exception based on local checks and installed-app verification; this is not a remote CI pass. [Download Mac 2.2.2 (Apple Silicon DMG)](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.2.2/LocalBrain_2.2.2_aarch64.dmg) · [Downloads, updates and other platforms](https://github.com/HackerChi-Hub/localbrain-releases/releases/latest) · [Verification](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/VERIFICATION-2.2.2-MAC.md).


## Windows / Linux 2.2.2: maintenance receipts and pasted attachments

Settings → Runtime and diagnostics unifies maintenance controls and saves outcomes per component. Official update checks are explicit; model startup never upgrades engines. The independent Windows/Linux update channel currently supports Trivy only; llama.cpp and Prism retain verified multi-resource installers. Mac six-engine results are separate. Pasting creates file/image drafts for manual sending; video and unknown binaries remain references without comprehension claims. DSH is pinned to 0.2.1-rc.5 with officially hashed Node 22.23.4. Native Windows checks cover source references, owned paste copies and removal, real Torch verification receipts, an existing 2B request and real DOCX/Markdown. Linux acceptance is WSL2/Xvfb startup and host initialization, not bare-metal GPU, media inference or real OS clipboard gestures. Windows Rust 445 passed/37 ignored; frontend 1650 passed/2 skipped; 14 adapters, 7 queue tests and 53 DSH checks per platform passed. Python 43 files/371 cases and two scripts passed separately; 7 security tests passed. The browser canvas check initially failed and passed an isolated rerun; its instability remains recorded. The author approved this batch CI exception; the account restriction and local acceptance are recorded in verification.

[Windows](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.2.2-win-linux/LocalBrain_2.2.2_x64-setup.exe) · [Debian](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.2.2-win-linux/LocalBrain_2.2.2_amd64.deb) · [AppImage](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.2.2-win-linux/LocalBrain_2.2.2_amd64.AppImage)

## Windows / Linux 2.2.1: show the maintenance stage and settle completion

Windows/Linux 2.2.1 is built and installed; the author approved this batch exception with the source CI payment/spending restriction recorded. Existing Mac 2.2.1 assets are retained. This update addresses maintenance stuck at 0% and a lingering activity indicator after an operation has finished.

Settings→Runtime and diagnostics shows a percentage only with measured bytes and a valid total. Preparation, dependency installation, extraction, verification and removal show specific stages; stage changes clear stale percentages. The main vulnerability database and Java index report cache checks, source and verification separately. Operations settle their terminal state before refreshing inventory, so a slow read cannot keep completed maintenance busy.

The final Windows installer preserves six existing configuration hashes. Native Torch verification, an existing 2B request returning 4276, 35 packaged MCP schemas, real DOCX create/read and Markdown export passed. Separate controlled UI checks confirm 3MB/8MB as 37.5%, no stale number during extraction/verification, and an indicator that ends before a delayed inventory response. Controlled IPC is not a Windows real-download test; Mac 49MB download evidence remains separate.

Windows Rust 435 passed/36 ignored; frontend 1641 passed/2 skipped; 14 adapters and 3 queue tests passed; 53 Harness tests per platform; 45 Python files plus 7 security tests passed. Both Linux packages passed resource and startup checks on Ubuntu22.04 WSL2/Xvfb; Debian is installed. This is not bare-metal GPU or media-inference acceptance. The standalone full Harness 8K fixed-prefix overflow remains a known issue; this maintenance fix is not a model-capability upgrade.

[Windows](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.2.1/LocalBrain_2.2.1_x64-setup.exe) · [Linux Debian](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.2.1/LocalBrain_2.2.1_amd64.deb) · [Linux AppImage](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.2.1/LocalBrain_2.2.1_amd64.AppImage) · [Mac 2.2.1](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/v2.2.1)

[Windows/Linux verification](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/VERIFICATION-2.2.1-WIN-LINUX.md)

## Windows / Linux 2.2.0: internal modules, familiar entry points

Windows and Linux2.2.0 downloads are ready; Windows and Debian under Ubuntu22.04 WSL2 are installed. Existing Mac2.2.0 packages remain available. Tools, engine adapters, pages and runtime dependencies share registration. Internal modules update with the application; custom plugin installation UI and commands remain closed. Existing models, user data and runtime maintenance entry points are preserved.

Eight module packages ship with the application. Five apply on Windows/Linux: documents, web research, image tools, local workspace and authorized network tools. The MLX speech, transcription and video modules are not counted as supported there. Compaction now uses consistent kernel measurements including summary framing, preserves original messages and avoids replaying completed tools. Windows image runtime status detection remains fixed.

The final Windows installation prepared all five supported modules. An existing Qwen3.8-2B-Distill Q4_K_M model completed a real request and returned acceptance number4276.35 tool names, schemas and descriptions matched compatibility entry points. Real DOCX creation/readback, independent paragraph verification, unchanged source hashes and Markdown export passed. Model requests and MCP calls were tested separately, not as an autonomous end-to-end task.

The first real document test failed because stale Windows packaging inputs did not implement the advertised Markdown interface. Both final platforms were rebuilt from the document implementation verified from the committed2.2.0 package; real document tests then passed. The independent user DocFactory installation was not modified.

Windows Rust435 tests passed with36 ignored; two live module tests passed separately. TypeScript1638 passed with2 skipped;14 adapters passed. Packaged Harness passed53 tests per platform;45 Python test files,7 security tests and2 packaging tests passed. Both Linux packages passed resource and Xvfb startup checks; Debian is installed. WSL2 does not establish bare-metal GPU or Linux media acceptance. Windows speech/video/image generation, standalone Harness8K tasks and real HTB retain separate limits; Mac media results are not reused as Windows results. Source CI account limits and batch approval scope are recorded in verification.

[Windows](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.2.0/LocalBrain_2.2.0_x64-setup.exe) · [Linux Debian](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.2.0/LocalBrain_2.2.0_amd64.deb) · [Linux AppImage](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.2.0/LocalBrain_2.2.0_amd64.AppImage) · [Mac 2.2.0](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/v2.2.0)

[Windows/Linux verification](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/VERIFICATION-2.2.0-WIN-LINUX.md)

Version sections and screenshots below retain their historical scope; this section and the GitHub table list current platform downloads.

## Windows / Linux 2.1.7: stop asking to reinstall a working image runtime

The image runtime reported a successful installation but still appeared partially installed. Detection searched Linux/macOS lib/python*/site-packages and missed Windows Lib/site-packages.

Existing Torch, Diffusers, Torchvision, Z-Image and Qwen-Image-2.1 pipelines import successfully and CUDA is available. The new native Windows package recognizes the existing environment as installed and offers no reinstall action. Unix layouts remain supported. The fix does not redownload the environment or upgrade models, CUDA or drivers.

Windows and Debian under Ubuntu22.04 WSL2 are installed at 2.1.7; AppImage is also provided. Windows Rust: 428 passed, 34 ignored; TypeScript: 1632 passed, 2 skipped; adapters: 14 passed; packaged Harness: 53 passed on each platform. Both Linux packages passed resource and Xvfb startup checks; Unix directory detection remains covered. Mac retains published 2.1.6.

Successful imports do not establish actual image generation acceptance. WSL2 results do not establish bare-metal GPU inference. Standalone Harness desktop requests exceeding the PolyStrata 8K window remain unresolved. Source CI is restricted by account billing/spending limits; publication status and batch exception scope are recorded in verification. The full Python suite and original 12-task model benchmark were not rerun for this patch; older results are not claimed as current tests.

[Windows](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.1.7/LocalBrain_2.1.7_x64-setup.exe) · [Linux Debian](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.1.7/LocalBrain_2.1.7_amd64.deb) · [Linux AppImage](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.1.7/LocalBrain_2.1.7_amd64.AppImage)

[Verification / 验收记录](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/VERIFICATION-2.1.7-WIN-LINUX.md)

Version sections and screenshots below retain their historical scope; use this section and the GitHub platform table for current downloads.

## Mac 2.1.6: updated Harness core and clearer runtime maintenance

Mac 2.1.6 is publicly released and installed. Windows/Linux retain published 2.1.3 builds and will be packaged separately by the author. The embedded DSH SDK moves from 0.2.0-rc.2 to the current official prerelease **0.2.1-rc.3**, with exact dependencies and a lockfile. It updates with LocalBrain without changing the standalone Harness client, accounts or existing model configuration.

Ready ordinary components no longer offer an individual install action in Settings → Runtime and diagnostics. Selecting them does not enable batch installation. Missing components can still be prepared together, while offline databases retain explicit update-and-verify actions.

![Installed selection does not enable installation](/obsidian-assets/localbrain-local-ai-box/v216-installed-selection.png)

Dependency-blocked Python removal now immediately shows a native explanation listing every unselected dependent; this installed check listed four. The app neither selects extra components nor deletes them automatically. Shared Docker services are detected locally, reused when available, started when offline and installed only when missing. Shared system components retain their existing versions and have no removal action.

![Native dependency-blocked removal](/obsidian-assets/localbrain-local-ai-box/v216-uninstall-blocker.png)

The updated skill plugin introduced a working-directory service dependency. The adapter supplies only the host-owned directory identity; tools still return to LocalBrain’s authorized executor. On-demand skills, full opt-out, incremental Chinese summaries and old-session recovery remain available.

The installed app used an existing Splash model for two rounds and one actual read-only security-capability query, returning phase=2 and dockerInstalled=true without scanning a target. Clicking Compact now produced a durable Chinese summary containing trusted user originals and actual receipts while preserving original records. A separate old-SDK session upgrade verified exactly-once tool execution and incomplete-tail recovery. All 53 core tests passed on the bundled Node runtime; 1632 TypeScript and 14 adapter tests passed, with 2 additional tests skipped.

![Installed tool call and context compaction](/obsidian-assets/localbrain-local-ai-box/v216-compaction-final.png)

All 13,984 files, permissions and links matched across the build, DMG, updater archive and installed app; application/updater signatures passed and four existing configuration hashes remained unchanged. No models were downloaded and no environments were removed to simulate a new machine. Native button, actual tool-result and compaction terminal-state readback passed. Temporary verification sessions and originals were removed from the regular stores, with evidence retained locally. The Mac app remains locally signed and not Apple-notarized. First-time Mac setup, Windows/Linux and real HTB are outside this round.

![Existing shared system services retained](/obsidian-assets/localbrain-local-ai-box/v216-system-services.png)

The GitHub source documentation job did not start because of account billing/spending restrictions. On 2026-10-25 the author explicitly authorized a Mac 2.1.6 exception based on local checks and the stated verification limits; this is not a remote CI pass.

Mac 2.1.6 DMG SHA-256:`5a52f1d0c240e3957d6b62a634267289d3e4d150309f0aa332a026c7466cb776`.

[Download Mac 2.1.6 (Apple Silicon DMG)](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.1.6/LocalBrain_2.1.6_aarch64.dmg) · [Verification](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/VERIFICATION-2.1.6-MAC.md)

## Mac 2.1.5: prepare prerequisites and container services together

Mac 2.1.5 is publicly released following packaging, installation and targeted native-interface checks. Windows and Linux retain their published 2.1.3 packages, with new builds handled separately by the author.

Open Settings → Runtime and diagnostics → Install missing components, review the scope and confirm. Missing package managers, build tools and container services are prepared before dependent environments. A failure stops subsequent components; retry fills what is still missing and skips ready items. Containers count as ready only after a successful connection; installed but offline services offer a start action.

![Installed 2.1.5 runtime management](/obsidian-assets/localbrain-local-ai-box/v215-runtime-overview.png)

Existing local Docker Desktop or Colima services are reused, preserving the default connection, VM resources and running containers. Shared system components have no removal control; Python, FFmpeg, engines and tools retain separate managed environments. On Macs without Homebrew, the app downloads and verifies the official package before handing it to the system installer. Licensing, administrator approval and restarts still require user action.

![Shared system prerequisites retain existing versions](/obsidian-assets/localbrain-local-ai-box/v215-system-services.png)

Downloads can pause with partial files retained and resume explicitly. Extraction, pip and container steps finish the current component before later steps pause. Controls distinguish downloading, resuming and installing a complete cached archive; removal appears only for confirmed installed managed components and cleanup only when cache exists. Built-in document/web tools and the Harness core update with the app without separate maintenance rows.

![Filtering, batch selection and conditional controls](/obsidian-assets/localbrain-local-ai-box/v215-filter-selection.png)

Native checks covered five component groups, zero missing items, no removal for the three shared dependencies, filtering, selection, installation-scope confirmation and cancellation. Cancellation did not start installation. The build, disk image, updater archive and installed application matched across 12,995 files and links; application and updater signatures passed. Existing-environment reuse and official-installer download/signature/offline-cache checks passed. First-time setup on a Mac without Homebrew and native Windows/Linux system installation remain untested. Existing environments were not removed to simulate a new machine; no models were downloaded or containers stopped.

![Review installation scope before execution](/obsidian-assets/localbrain-local-ai-box/v215-install-confirmation.png)

The Mac app retains local signing and is not Apple-notarized. The GitHub source documentation job did not start because of account billing/spending limits; the author explicitly approved a Mac 2.1.5 release exception. Local checks are not a remote CI pass. See [verification](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/VERIFICATION-2.1.5-MAC.md) and [prerequisite setup](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/SYSTEM_PREREQUISITES_2.1.5.md).

Mac 2.1.5 DMG SHA-256：`35323326f50b065abc1e9c089b44b5cc9fe6cdf07625472452e1a6470175f407`。

[Download Mac 2.1.5 (Apple Silicon DMG)](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.1.5/LocalBrain_2.1.5_aarch64.dmg)


## Mac 2.1.4 candidate: fill missing runtimes in one click

Settings → Runtime and diagnostics now shows five groups: model engines, media, security tools, offline databases/rules and system services. Built-in document/web tools and the Harness core update with the app without separate maintenance rows. Security pages retain targets, authorization, evidence and reports, with maintenance linking here. **This is an unpublished candidate; public downloads have not changed.**

Choose “Install missing components,” review the dependency list and confirm. The queue skips ready managed environments. When the dedicated container engine comes online, it rereads and reuses existing images and databases. Maintenance continues across page changes, stops subsequent items after a failure and retries only components still missing. Individual installation, updating and verification remain available.

![Model environments and one-click setup preview](/obsidian-assets/localbrain-local-ai-box/v214-runtime-models-oneclick-preview.jpg)

**Missing components do not show removal controls.** Partial, external and unreadable offline states are also excluded; batch removal accepts only confirmed installed managed components and is hidden without eligible selections. Python removal still requires its dependent environments in the confirmed scope. Weights, external installs, conversations, reports and VMs remain intact.

![Security tools preview: external or unready tools show installation only](/obsidian-assets/localbrain-local-ai-box/v214-runtime-security-oneclick-preview.jpg)

These previews use the production component and a read-only inventory, with explicitly mocked installation/removal. They do not prove that every real component was installed. Native capture still fails, so package integrity and native interaction acceptance are recorded separately.

ADB, Trivy and Splash use pinned official managed copies. The shared archive downloader preserves interrupted chunks, validates range responses before resuming and checks SHA-256 before extraction. Verified archives work offline. Python packages and container images keep their own cache mechanisms. Environments live in dedicated app data, outside the signed app bundle. Where a supported official package manager exists, missing Docker/Colima dependencies join the setup plan; system licensing, administrator and restart requirements remain. Ready services no longer show a redundant installation-guide button.

### Separate pause, continuation and cache cleanup

Runtime downloads now have a pause action that preserves partial files and pending components. Reloading or reopening restores a paused queue for explicit continuation. Extraction, dependency installation and container preparation finish the current component before later items pause. Splash also gains a pause action that preserves the original weights for its installer to resume.

Missing components without cache show “Download and install”; partial archives show “Resume download”; complete archives show “Install from cache”. Only installed managed copies offer removal, and cache cleanup appears only when cached files exist. Cleanup rereads the state immediately. Small files use KB/MB, paused tasks discard old speeds, and background status remains visible.

![Download-control interaction preview](/obsidian-assets/localbrain-local-ai-box/v214-download-clean-preview.png)

This is an independent UI preview with simulated installation and removal. A separate real-network test used the official approximately 25 MB Python archive: pause at 1,011,849 bytes, continuation at the same offset, verified completion at 25,159,977 bytes, offline reuse and matching cleanup accounting. Pip and container engines retain their own caches; not every third-party installation step can pause immediately. No large model was downloaded again, and interruption of a real large Splash model download remains untested.

Splash remains on 1.3.1, Sushi on its compatible build and the embedded Harness core on 0.2.0-rc.2. Upstream 0.2.1-rc.3 was reviewed but needs separate compatibility testing. Installing tools or databases neither authorizes a target nor starts a check; existing authorization and isolation gates remain.

The Mac 2.1.4 candidate has been rebuilt and installed but is not public. [Current public platform releases](https://github.com/HackerChi-Hub/localbrain-releases/releases/latest). Candidate DMG SHA-256: `4619d1f9803c2c72549e40ab1ece75229cdb2217a2a816b42e206988aa5457e8`. Mac is ad-hoc signed, not Apple-notarized. Windows/Linux retain published 2.1.3 packages.

Frontend: 1,628 passed and 2 skipped; adapters: 14 passed; Rust: 436 passed and 33 ignored. Ten archive tests cover resumption, interrupted transfers, wrong ranges, corrupt caches, offline reuse and path protection. UI checks cover cancellation without execution, cross-page queues, reuse after reconnection and failure/retry. The three official Mac archives previously passed checksum, extraction and relocation probes. Full container provisioning, the new Binwalk build and actual removal remain unverified. Historical sections keep their original tests and screenshots.

Windows/Linux 2.1.3 are publicly released, with Windows and virtual-machine Debian installed. Linux Debian and AppImage were built separately under Ubuntu 22.04 WSL2; both passed resource checks, packaged DSH initialization, 20-second startup and 53 DSH tests. All three packages were downloaded again and verified against SHA-256 hashes and updater signatures. Bare-metal Linux GPU inference and full DSH image/tool tasks remain unverified. Source CI did not start due account payment/spending limits; the author explicitly approved this batch as an exception. Local passing checks are not presented as online source CI success. Existing Mac packages remain unchanged.

[Windows](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.1.3/LocalBrain_2.1.3_x64-setup.exe) · [Linux Debian](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.1.3/LocalBrain_2.1.3_amd64.deb) · [Linux AppImage](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.1.3/LocalBrain_2.1.3_amd64.AppImage)

[Acceptance record](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/VERIFICATION-2.1.3-WIN-LINUX.md). Initial Mac and 2.1.2 sections below retain their historical records; this section lists current downloads.

## Windows local fixes and DSH integration limits (2026-10-24)

The integration page again has a top-level one-click restore for full Harness integration and managed Codex/Claude Code MCP entries. Each client reports locks, conflicts and missing restore points separately while retaining existing settings. The Windows 2.1.3 fix is installed locally; public download versions are shown in the platform download section. Linux packages are built and verified separately.

The user has confirmed **basic DSH text usage with Qwen3.8-2B-Distill Q4_K_M**. The live service reports a 262144-token window matching the exported configuration. Full-window speed, memory consumption and quality have not been tested, nor does this establish complete tool or multi-turn task compatibility. The current 2B endpoint has no vision. Image understanding, MCP image rendering and visual-model integration require separate acceptance.

**The full DSH desktop agent still overflows PolyStrata 35B's 8K window.** Screenshots show about 1.5K system-prompt tokens plus 7.4K tool-definition tokens; another request had 12728 input tokens. Compressing history or reducing output alone cannot fix an oversized fixed prefix. Reduce task-specific tool overhead or separately test a larger window. Context occupancy does not establish GPU memory exhaustion. The previous short adapter request proved connectivity and routing, not full desktop-agent compatibility.

[Known issues and acceptance scope](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/KNOWN-ISSUES-DSH-LOCAL-MODELS.md). Source GitHub CI remains blocked by account limits; local checks are not represented as online CI success.

## Mac 2.1.3: connect Codex and Claude Code to local tools

One-click MCP integration is restored for Codex and Claude Code alongside DeepSeek Harness. MCP is the tool interface: your existing client can use LocalBrain documents, search, transcription, speech, image and video tools while keeping its chosen model. The required local runtime and weights must be ready; web search still needs a network connection.

Open Integrations, find the client and choose the MCP write button. Confirm the user-level scope, then use a new client session. Tool processes start with client sessions; media models load when called. Configuration previews are collapsed until needed. If the desktop client is running, LocalBrain asks you to close it after current work finishes, avoiding a later cached configuration overwrite; it does not terminate the client.

**Writing and undo affect only LocalBrain tool entries.** Models, providers, other MCP entries and project settings are preserved. Repeated writes retain the original restore point. Conflicting external changes are kept and reported. Harness tool undo touches only the tool block, separately from model integration. OpenCode is not restored.

I tested Codex with an isolated configuration copy and a temporary DOCX containing a random verification code absent from the prompt. The record contains one successful `document_read`, the final code matches, and formal client configuration hashes stayed unchanged. Only that read-only tool was preapproved for the test; the product does not disable client approvals. **Claude Code configuration merging and protocol discovery were checked, but its model-call test stopped because the existing login credential was invalid. It is not reported as a passed real-call test.**

[Download Mac 2.1.3 Apple Silicon DMG](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.1.3/LocalBrain_2.1.3_aarch64.dmg) · [Mac verification](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/VERIFICATION-2.1.3-MAC.md) · [Latest release and platform downloads](https://github.com/HackerChi-Hub/localbrain-releases/releases/latest). Windows/Linux retain their published 2.1.2 packages; this does not announce 2.1.3 for those platforms. The Mac app is ad-hoc signed and not Apple-notarized.

Mac 2.1.3 has been installed locally. All 12,995 files and links match across the app, DMG and updater archive; app-signature checks and independent updater verification passed. The installed MCP protocol and tool-discovery self-check passed 26/26. This does not mean every media model's generation quality was retested. DMG SHA-256: `023934d617c93cb50cd3dd41f55bd7ad672d29983548000cfb78d1f7985417b8`.

The source GitHub documentation-sync job could not start because of account payment/spending restrictions. After local checks and installed-app acceptance passed, I explicitly approved this Mac 2.1.3-only release exception. This is not passing remote CI or acceptance for other platforms.

![Installed Mac 2.1.3: separate copy, write and undo actions for three clients, with configuration collapsed; the interface shown is Simplified Chinese](/obsidian-assets/localbrain-local-ai-box/v213-mcp-clients.png)

![Installed Mac 2.1.3 MCP self-check: protocol and tool discovery passed 26/26; the interface shown is Simplified Chinese](/obsidian-assets/localbrain-local-ai-box/v213-mcp-selfcheck.png)

These screenshots come from the final installed app. Only the system automation control title bar was cropped; originals and crop records remain local. The 2.1.2 and earlier sections below retain their historical versions, tests and screenshots.

## 2.1.2: three-platform downloads and tool installation fixes

LocalBrain brings local models, speech, images, video and file tools into one desktop workbench. Each platform maintains its own runtime: Mac offers specialized engines including MLX, Splash and Sushi; Windows supports llama.cpp and PolyStrata; Linux provides preview Debian and AppImage packages. Model compatibility and memory requirements depend on the engine and local checks. Updating the app does not implicitly upgrade CUDA, drivers or model weights.

Version 2.1.2 registers bundled tool paths in the managed Python environment and verifies their origin in a fresh process, avoiding build output inside read-only app resources. Windows Unicode paths and diagnostics explicitly use UTF-8. The security target list uses the full width, with connections and tools shown as needed. Batch handoff creates a draft requiring manual submission and execution approval. Integration retains DeepSeek Harness configuration. A completed turn shows only a support text entry; clicking reveals a QR code without inserting it into model context.

The final Windows package was checked on an RTX 4070 Laptop 8GB/32GB RAM machine with PolyStrata Qwen3.6-35B-A3B Q3 at 8K: native chat, one file write, actual compaction and continuation; the installed configuration hash stayed unchanged. Both Linux packages passed bundled Node/DSH, resource and WSL2 Ubuntu22.04+Xvfb startup checks; Debian was installed. This is neither bare-metal Linux GPU inference nor real HTB acceptance, and does not rerun the original twelve-question benchmark. Windows has updater signatures, not Authenticode. Existing Mac packages retain their separate acceptance record.

[Windows installer](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.1.2/LocalBrain_2.1.2_x64-setup.exe) · [Linux Debian](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.1.2/LocalBrain_2.1.2_amd64.deb) · [Linux AppImage](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.1.2/LocalBrain_2.1.2_amd64.AppImage) · [Mac DMG](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.1.2/LocalBrain_2.1.2_aarch64.dmg)

The author explicitly approved this release exception: the source GitHub check could not start due to account payment/spending restrictions. Local passing checks are not reported as passing online CI.

[Windows/Linux verification and hashes](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/VERIFICATION-2.1.2-WIN-LINUX.md) · [Mac verification](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/VERIFICATION-2.1.2-MAC.md) · [Latest release](https://github.com/HackerChi-Hub/localbrain-releases/releases/latest). Older figures, walkthroughs and screenshots below retain their original dates and are not new results from this batch.

## Windows 2.0.0: small-context tasks and compaction repairs

Public releases checked on October 20, 2026: Windows is now 2.0.0; Mac remains 1.9.9. Windows avoids stopping tasks merely because a tiny compaction provides no reduction: it preserves the original and continues when safe response space remains, while actual overflow still stops with records retained. Long built-in tool schemas load on demand. Summaries disable tools and thinking, and serialize historical tool receipts as read-only material rather than continuing their instructions.

The release record covers final-package installation, greeting, countdown file delivery, continuation after automatic compaction, real network calls at 2K/5K output limits and the chat UI. Countdown start, pause and reset passed. This is not the original twelve-task full rerun. Summaries can still infer local state incorrectly; successful network delivery does not establish news freshness or factual accuracy.

[Download Windows 2.0.0 installer](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v2.0.0/LocalBrain_2.0.0_x64-setup.exe) · [Final-package verification and limits](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/VERIFICATION-2.0.0.md). SHA-256: `547c745ad1494b89bc7c4d3ee8646b6fcc28f1c469a59be3496361e149b6e668`. Updater signature verified; not Windows Authenticode-signed. CUDA, drivers and third-party model environments were not upgraded.

## 1.9.9 update: Sushi residency and exact SSD tested

Mac 1.9.9 repairs completion after downloads reach 100% and explains Sushi startup failures. Installed-app checks exercised real memory preflight rejection with required/available values, including when status polling reaps the process first. Restoring 32K allowed full-resident loading and a Chinese response. Existing approximately 79.21 GB weights were preserved without downloading them again.

On October 20, 2026, M5 Pro/64 GiB, the same Qwen3.8 Flash Next 2.6-bit weights, Sushi 1.2.4, 32K context and thinking off: full residency versus 32 GiB exact SSD registered 44.20/31.21 GiB; first-context response totals were 4.99/8.10 seconds, repeated-context totals 2.68/2.87 seconds. Repeated context reused 2,595 input tokens. Isolated starts were 40.39/8.98 seconds; a later native resident start took 17.02 seconds. System file caches were not cleared, so these are individual observations, not cold-start averages.

Full residency loads vision by default; SSD does not. An additional SSD run explicitly loading vision took 8.23 seconds for first context and 2.60 seconds for repeated context. This verifies loading, not image-understanding quality. These single-machine samples do not establish universal speed or quality. Native SSD chat also completed a Chinese reply and a local-time tool roundtrip.

**Mode selection is manual.** In Settings, runtime and diagnostics, SSD budget 0 means full residency; a nonzero value such as 32 selects exact SSD after saving and restarting the model. Low memory does not trigger an automatic switch or bypass protection. Automatic expert-cache scheduling is separate from switching modes.

[Download Mac 1.9.9 DMG](https://github.com/HackerChi-Hub/localbrain-releases/releases/download/v1.9.9/LocalBrain_1.9.9_aarch64.dmg) · [Test conditions and limits](https://github.com/HackerChi-Hub/localbrain-releases/blob/main/VERIFICATION-1.9.9-MAC.md). DMG SHA-256: `6fbc94eb895220fbf99a8d497b8ec3506074e6964c51dc895374d985ae5d6c27`. Local signature, not Apple-notarized. Windows remains 1.9.8; Linux retains existing releases. Older walkthrough text and screenshots below describe their original dates.

## Turn your Mac into a private AI box

> Not another chat web page: local models, media, documents and agent tools gathered into one Mac workbench.

> [!note]
> HyphenTech · LocalBrain 1.9.4 · 2026-10-18 · Also available in 简体中文 and 繁體中文 (switch below the title)

---

I did not build LocalBrain because local models now beat the cloud. On the same hard task, the top cloud models are usually still smarter and steadier. What wore me out was everything else: models in one folder, MLX in one terminal, GGUF needing another server, and transcription, voice-over, image, video and documents each running their own way.

So the goal has not changed: **not a smarter brain, but a calmer master switch for local AI.** This walkthrough was written at 1.4.8; the current version is 1.9.4. Below is a walk through each page; every screenshot is the real 1.4.6 interface (later releases added security checks, office documents, Splash models and more — see “After 1.4.8”, “New in 1.4.8” and “New in 1.4.7” near the end): a fully visible task process, output and cache folders you can place anywhere and clean out completely, and three complete interface languages.

> [!note]
> LocalBrain is not meant to replace Codex, Claude Code or OpenCode. It gives them, and its own chat, a set of controllable models and tools that start on demand and stay on your machine as far as possible.

### ▍Home: this machine's memory budget on one screen

The home screen answers three questions first: what this machine is, what is using memory right now, and what else you can start. Below is my M5 Pro (64 GB unified memory) running the Splash build of Qwen3.6-35B-A3B.

![# Home: chip, unified memory and free disk; the memory bar is split into "System" and "AI models"; running services show their expected memory use.](/obsidian-assets/localbrain-local-ai-box/v146-en-home.png)

- **A memory bar in two parts**: how much the system uses, how much the AI models use and what is left, stated outright. The "estimated usage" on a model card comes from the model's size; Splash is estimated at 1.1× its size.
- **Arbitration before starting**: the memory arbiter adds up the backends already running and the model about to start. If resources run short it refuses clearly, instead of letting the system swap itself to a standstill and failing afterwards.
- **One switch for three engines**: MLX, llama.cpp (GGUF) and Splash start and stop the same way. Splash brings its own draft model for speculative decoding, and models that can read images are marked.
- **Media backends on demand**: speech transcription, speech synthesis (with voice cloning), image generation, image editing, video generation and music generation each have a card, and are released automatically after idling or under memory pressure.

※ This is not a promise that more memory always means faster. Whether something can start, and how large, is decided by the numbers Home and Discover work out for this machine.

---

### ▍Discover: know whether it will run before you download

Large models weigh tens of gigabytes, and finding out after the download that one will not run is the most expensive way to experiment. Each Discover card moves that question up front.

![# Discover: ability tags, the publisher's benchmark numbers, quantizations and the minimum / recommended memory worked out for this machine, all before the download button.](/obsidian-assets/localbrain-local-ai-box/v146-en-discover.png)

- **More than 40 curated entries**: language, vision, speech, image, video and music models, newest first. Each card lists ability tags, the publisher's benchmark numbers and where they come from (in the screenshot, MMLU-CoT 0.283→0.548 for the distilled Qwen3.8 2B), and the size of each quantization.
- **Memory worked out for this machine**: the "minimum / recommended unified memory" is not copied from the model card; it is calculated from this machine's memory and the model's structure.
- **Licenses before the download button**: restrictions stricter than usual, such as no commercial use, are flagged up front with a link to the original text, not discovered after the download.
- **Download source speed test**: one click measures ModelScope, HF-Mirror and Hugging Face and picks the fastest at that moment; downloads are checked against SHA-256 at the end, so a file that merely has the right size but is damaged is never counted as a success.
- **Existing models stay where they are**: point at a model folder you already have and it is mounted, with the engine, category and context ability detected, without copying weights or touching the folder.
- **Identity check before registering (new in 1.4.4)**: when you pick a folder with “Import existing” on a card, LocalBrain first detects which model is actually inside. A certain mismatch is refused outright, such as registering a video model package as an image-editing model; if only the name or category looks different, it shows what it found and asks you to confirm, so renamed folders still import. My own machine had exactly such a record: the entry for the image-editing model Mage-Flow pointed at a MiniMax H3 video package folder that no longer existed. Records like that, whose folder is gone, used to be skipped silently; Home now lists them under “Broken model registrations” and removes them in one click, deleting only the record, never the model files.

> [!note]
> **Detected does not mean it will start.** Format, architecture, vision projector files and the current runtime all affect compatibility; the app tries to give the concrete reason instead of dressing up "found it" as "it will definitely run".

---

### ▍Chat: from answering a question to delivering a file

The built-in chat has streaming, attachments, stop, saved conversations and local tools. What I care about more: when you ask it to fix a web page or build a spreadsheet, does it actually deliver, and does the process hold up to inspection?

![# Chat (demo data): the self-check fails → one line gets a null check → the next self-check passes; the summary shows 8 rounds, 9 tool calls, 2 failures and four time segments.](/obsidian-assets/localbrain-local-ai-box/v146-en-chat.png)

The conversation above is a demo, but every element on screen is the real 1.4.6 interface:

- **Every step is shown**: reading files, listing folders, web search, writing files, targeted edits and page self-checks each show their target and time; complex tasks start with a plan, and the plan card says it is "the model's own record, not independent verification".
- **Failures stay visible**: repeated calls to the same tool are grouped as "Page self-check ×2", with "1 failed" right beside it. In the screenshot the model's first self-check returned a page error; it changed a single line to add a null check, and only the next self-check passed.
- **The self-check really runs**: generated pages are checked in a headless browser for a canvas, advancing animation frames and console errors, instead of taking the model's word that it checked.
- **Where the time went**: each task ends with total time, rounds, tool calls and failures, with the time split into prefill, reasoning, output and tools.
- **Long tasks keep the interface responsive**: 1.3.27 fixed the interface freezing on long, fast output by throttling the streaming refresh and the metrics.

Document tasks can also deliver DOCX, PPTX, XLSX or PDF directly. If no real file was produced, the zero-output gate refuses to report the task as done.

---

### ▍Storage & cleanup: the heart of 1.4

After a month of use my own machine had piled up plenty of things nobody could see: check screenshots, task checkpoints, logs, and images and voice-overs that early versions wrote into temporary folders. 1.4.0 puts all of it in Settings.

![# Settings · Storage & cleanup: both the output folder and the cache folder can move; usage and file counts per category, tick to clean.](/obsidian-assets/localbrain-local-ai-box/v146-en-storage.png)

- **Both folders can move**: the output folder holds generated documents, images, speech, video, music and web downloads; the cache folder holds logs, task checkpoints, check screenshots and temporary files. Either can live on an external drive.
- **Moving takes the files along**: on the same drive they are moved directly; across drives they are copied and verified first, then the old copies go to the Trash.
- **To the Trash by default**: cleaning a category moves it to the Trash unless you choose permanent deletion; folders sent to the Trash carry the name of the folder they came from, so you can tell them apart at a glance.
- **Automatic cleanup**: total log size, checkpoint age and temporary file age each have a threshold, applied by the app on a background timer whether or not the window is open.

The numbers in the screenshot are measured on my machine: System output 13.3 MB in 204 files, web check screenshots 27.9 MB in 262 files. The first automatic cleanup after installing 1.4.0 moved 145 task checkpoints and 35 sets of old check screenshots to the Trash. I checked those 145 checkpoints one by one against the conversation list the app keeps: not one of them belonged to a conversation that still exists.

---

### ▍Integrations: hand local abilities to other agents

![# Integrations: local MCP tools written into each client's configuration with one click, and local models served through an OpenAI-compatible endpoint.](/obsidian-assets/localbrain-local-ai-box/v146-en-integrations.png)

- **Local MCP tools**: document processing, speech transcription, speech synthesis, images, video and web research, written into the configuration of Claude Code, OpenCode, Codex or DeepSeek Harness with one click. Only the `localbrain-*` entries are added or updated; your model settings and other MCP servers stay as they are, and one click restores the configuration from before.
- **Local models as the brain**: OpenCode, ScreenLex and DeepSeek Harness can use local models directly through the OpenAI-compatible endpoint `127.0.0.1:11434/v1`, no API key needed.
- **MCP self-test**: checks that the protocol and tool discovery work, without loading a model or using extra memory.

The steadier setup for Codex and Claude Code is to keep their cloud reasoning models and call LocalBrain's local tools through MCP. **LocalBrain can provide endpoints and tools, but it cannot lift a third-party client's own model or tool restrictions.**

---

### ▍Three interface languages, complete this time

Simplified Chinese, Traditional Chinese and English have been there since 1.2.70. But while making these screenshots, I had the screenshot harness list every piece of Chinese that actually appeared on the English interface, and it turned up dozens of gaps: 26 catalog entries with no translation, plus confirmation dialogs and numbers glued to their units. The automated checks had all been green, because each of them only recognised one way of writing things.

1.4.3 fills those gaps and adds all three kinds of leaks to the tests. 1.4.4 then reviewed about 1,400 English strings one by one, removing machine-translation phrasing and inconsistent terms; labels the program assembles, such as reasoning levels, the compatibility table and attachment processing status, no longer leak Simplified Chinese into the English and Traditional Chinese interfaces. Switching language translates the interface only, never your conversations, model answers, code or file paths.

---

### ▍Where "private" ends: what stays on the Mac and what still goes online

Local inference, transcription and media generation can stay on the Mac, and conversations are saved only on this computer. But "local AI" does not mean "never online": downloading a model contacts the model source, web search sends queries to a search engine, and if Codex or Claude Code use cloud models, their reasoning is not local either.

File tools can only read the folders you allow by default. Running project commands is off by default; when turned on, every run asks for confirmation first and says plainly that the working-directory limit is not a system sandbox. The new “Network access” in 1.4.7 is off by default too; once on, the model can send HTTP requests or use SSH to reach the devices in your `~/.ssh/config`, and changes still ask for confirmation each time. **Private is not a label; it means you can see where data goes, which folders are allowed and how long each backend lives.**

| If this is you | My suggestion |
| --- | --- |
| Several MLX, GGUF, speech or media models scattered across your Mac | A good fit: one place to reference, start, stop, budget and clean them |
| You want OpenCode or a cloud agent to call local media tools | A good fit: write or copy the configuration from Integrations |
| One or two Ollama models and the occasional question | You may not need another layer |
| You expect small local models to replace top cloud models everywhere | Not a fit: the local advantage is control, privacy and reuse, not being stronger at everything |

---

### ▍Four steps to start

- Download the latest DMG from **GitHub Releases** and drag LocalBrain.app into Applications.

- In Settings, install the runtimes you need and choose the interface language, model folder and download source.

- In Discover, download a model that suits this machine, or mount a model folder you already have.

- Start a model on Home and try the built-in chat; when you need an external agent, write its configuration under Integrations.

### ▸ New in 1.4.8: a second local video engine, LTX-2.5

**Write a line in quotes and the person in the video says it.** LTX-2.5 sits next to MiniMax H3 as a second video engine: text, first-frame and first-and-last-frame videos, all with synchronized stereo sound. It shares the video workbench with H3 — the same 1–30 second range, up to 10 seconds per pass, and longer clips chained automatically (each part starts on the previous part's last frame, and the picture stays continuous across the join); prompt templates, segment stitching and MCP `generate_video` all work as before, and the templates carry their own LTX test results. On the reference Mac (M5 Pro, 64 GB) a 1024×576 clip takes about 2 minutes for 4 seconds, 6 minutes for 10 seconds and 12 minutes for 20 seconds; peak memory is about 25 GB for text-only clips and about 37 GB for a 10-second part that starts on an image, and when that does not fit, the model is streamed block by block. Reference images still need MiniMax H3 REF2VA.

![# The video panel with LTX-2.5 selected: 20 seconds becomes two chained parts; the hint states the 10-second pass and that a quoted line repeats in every part, and the estimate adds up per part.](/obsidian-assets/localbrain-local-ai-box/v148-en-video-ltx25.png)

**One-click download on Discover, direct from mainland China.** 43.4 GB, byte for byte what mlx-community publishes; pick the ModelScope source for a direct download — the two Hugging Face repos use Xet storage, which hf-mirror only redirects and does not cache. The ltx-2-mlx video runtime installs itself on first start, about 404 MB. Models downloaded from ModelScope are now checked against SHA-256 file by file; before, only the size was compared.

**The runtime's 54 GB peak, down to 25 GB.** For the same 4-second clip, the runtime's defaults peaked at 54 GB: its Gemma encoder raises the cache limit to 90% of memory, and decoding never tiles. LocalBrain caps the cache at 2 GiB and decodes 5 latent frames per tile; the peak drops to 25 GB at the same speed.

### ▸ New in 1.4.7: eight document formats, and “Network access”

**Documents are no longer just DOCX and PDF.** When you ask the model to “write a document,” it can now produce Markdown, HTML, TXT, RTF, ODT and EPUB directly. More importantly, every format goes through a cleaning pass first: the `{"type":"markdown", ...}` wrappers, escaped newlines and zero-width characters the model writes are unwrapped, restored and stripped, then turned into real headings, (nestable, checkbox-capable) lists, tables and code blocks — not a slab of raw JSON dropped into a Word file. This fixes a real failure: a request to “build a browser 3D flight game” had one line, “create the phase-0 document,” that sent the whole task to the document tool, and hundreds of lines of source ended up stuffed into eight uncleaned DOCX files. Coding and engineering work now goes to the general agent that can actually write project files, unless you name a file format like DOCX, PDF or EPUB.

**Stuck on something? It can look it up online, or configure another machine over SSH.** The new “Network access” switch is off by default; once on, the model can send HTTP requests to call APIs or read endpoints, run commands and copy files over SSH on the devices in your `~/.ssh/config`, check connectivity and TLS certificates, and view this machine's network status. SSH logs in with keys only — LocalBrain never touches or stores a password. Permissions are per conversation: read-only operations run directly, while changes (restarting a service, editing config, uploading a file, POST/PUT and the like) ask you each time, and you can grant full trust within one conversation so it stops interrupting. It is separate from “Web search” — that one looks things up, this one operates other machines; port scanning and packet capture, the kind of probing done against other people's networks, are not included.

### ▸ After 1.4.8: security checks, office documents, community models, download experience (current: 1.9.4)

The walkthrough and screenshots stop at 1.4.8; every later version has its own article, so here is just the main line:

- **Authorized network security checks (1.5–1.6)**: two entries — workspace security audit and authorized network checks — with fixed-parameter vectors, sandboxed execution and local target-range reverse verification, fail-closed throughout. See [[localbrain-network-security|the network security testing post]].
- **Office documents, format-preserving (1.6.8)**: format-preserving editing and template filling for DOCX / XLSX / PPTX — “fill in the table without touching the original layout.”
- **Media tools right inside chat (1.8.0)**: with a model running, speech, transcription, image, music and video all go through the same task agent. See [[localbrain-media-chat-180|media calls in chat]].
- **Splash community models (1.8.x)**: downloading, assembling and launching community 4-bit models, with ModelScope transfer, automatic resume after stalls and pinned-revision hash checks.
- **Download speed display (1.8.8)**: live speed and estimated time remaining now appear right in the progress line; after a stall the stale reading is withdrawn with a waiting notice — no more inflated or frozen phantom speeds.
- **Skills and long-term memory (1.8.9)**: discover other agents' file locations, choose read-only mounts or copy imports, edit internal entries and select automatic, manual-only or disabled loading. The model can search and read managed entries; it cannot create or enable them by itself.
- **Context compaction (1.9.1)**: a long chat is like a stack of records: originals remain available while a separate handoff outline is written. Incremental semantic summaries run at message or capacity thresholds; Compact now is available while idle. Tool chats use concise Chinese summaries, and recovery does not replay completed tools. Installed-app samples took about 2.97 seconds automatically and 2.48 seconds manually. These are sample timings, not a general speed promise; summaries can still miss details.

- **Configuration and interface fixes (Mac 1.9.3)**: restore only managed external-client keys; empty backups retain later additions, and malformed files keep their original content and backup. Home pauses polling when unfocused, and window switching no longer scans Discover directories. Sessions support search and renaming; sidebar and attachments skip unrelated renders. Memory conflicts allow an explicit model switch, with no media start after a failed language-model stop. Windows/Linux retain their separate 1.9.2 releases.

---

- **Read-only personal-device checks (Mac 1.9.4)**: register phones, computers, embedded devices and firmware separately, batch-add targets, then add requirements and send manually in chat. Android collects authorized OS/patch information, computers query local security status, and network scopes use a few authorized ports. Firmware checks fingerprint files, identify signatures on one thread or match components offline. Models cannot choose arbitrary paths or bypass scope through other tools. Missing dependencies/databases fail explicitly instead of reporting zero vulnerabilities. Local-computer and offline-fixture adapters were verified; real phones and embedded hardware remain untested.

#### LocalBrain 1.9.4

LocalBrain gathers the local models, media, documents and MCP tools on your Mac into one workbench.

> [!note]
> Platform macOS 13.0+ / Apple Silicon · Windows is at 1.9.2 · Installer LocalBrain\_1.9.4\_aarch64.dmg

[LocalBrain downloads and updates (release page)](https://github.com/HackerChi-Hub/localbrain-releases/releases/latest)

[LocalBrain product page](https://hyphentech.top/localbrain)

The SHA-256 of the current installer is **f2542209eb8000bf77aacb2bd9b24abaa57613c125bd5a46f44c9bc64475c929**. It carries a development signature and is not yet notarized by Apple; if Gatekeeper blocks the first launch, confirm the download source and the hash, then remove the quarantine attribute with the command below.

```shell
xattr -dr com.apple.quarantine /Applications/LocalBrain.app
```

*Only for an installer downloaded from the official Releases page whose hash you have checked.*

If it has helped you, the “Sponsor” button under “Follow HyphenTech” in the sidebar shows the WeChat sponsor code (WeChat Pay only). Sponsoring is entirely optional and changes no features.

> **// Cloud models think the hard problems through; local tools keep your files, models and workflow in your own hands. The two do not conflict.**

---

> [!note]
> The choice is simple
> 
> If your local models and tools have multiplied to the point where they manage you, LocalBrain saves more than a few commands: it saves the time lost to every restart, model switch, task change and cache cleanup. If you only chat now and then, keep your simple tools.


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
