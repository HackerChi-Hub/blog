---
title: "HyphenScreen: recording, editing and AI animation — version 1.7.4"
slug: hyphenscreen-local-screen-recorder-en
status: published
lang: en
translation_of: hyphenscreen-local-screen-recorder
date: 2026-09-28
updated: 2026-10-30
summary: "Mac 1.7.4 combines eight explanation types and ten whole-video packages in local composition, usable manually without a model or through connected models and MCP. Windows/Linux remain at 1.7.2."
categories:
  - Resources
tags:
  - AI
  - Self-made software
cover: /obsidian-assets/hyphenscreen-local-screen-recorder/cover-f7bd0aaa70.jpg
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

## Mac 1.7.4: explanations and video packages share local composition

Chat now has one Create animation entry. Open Local composition · No model, choose an explanation or a coordinated package, preview an example, enter content and add it to the timeline. No model configuration is required.

Eight explanation types are grouped by sources, comparisons and structure and produce editable native layers. Ten video packages retain their four layouts, colors, motion and sound. Their internal layers are not individually editable; saved settings can regenerate them. Switching between the two local categories preserves their respective input.

![Unified local composition in the actual workspace](/obsidian-assets/hyphenscreen-local-screen-recorder/local-composition-174.png)

Connected models and external MCP clients share the same catalog and composition tools. An isolated workspace with no model configured generated and saved package video and audio, added a native explanation and played through 20 seconds. A real external MCP process read the catalog, generated an eight-second package, wrote a 12-second explanation with 38 layers, saved a separate project and exported a 20-second 1080p30 video. Full decoding and frame checks passed. These were direct tool calls without model inference, not quality certification for every online model.

This version also includes stopping a running conversation while retaining applied changes and newly typed input. Sending resumes after the old request exits safely. Local responses are capped at 16,384 tokens; truncated scene arguments are not executed. Total and idle timeouts remain configurable. The final suite passed 4,680 tests with two skipped. The installed Mac app passed strict signature checks and byte verification of 609 files and links. Tools launched from the installation path again produced an eight-second package and a twelve-second explanation with 38 layers, saved an independent project, and natively exported a 20-second 1080p30 video. All 600 frames and its audio decoded successfully. The installed studio opened this project, but expanding chat waits for system keychain authentication; final manual generation and continuous playback in the installed desktop are not reported as passed. Subjective sound listening, all capture devices, and online model generation were not re-tested in this round.

## Mac 1.7.2: deleted projects stay deleted

The project list recognized title-named files by their contents, while deletion reconstructed filenames from project IDs. It could report success without removing the actual file. Version 1.7.2 resolves the actual project file and serializes deletion with saves, preventing late autosaves from recreating it. Project files go to the system Trash; recordings are preserved. Explicitly restoring and reopening a file permits editing again.

An isolated Mac workspace tested title-named, currently open and external projects. Reopening the list and restarting the entire application did not restore deleted entries; the control project remained. The full suite passed 4,664 tests with two skipped, plus both type checks and the development build. The release package passed signing, image-integrity and upload/download checksum checks. The user installs manually; development verification is not represented as installed-build testing.

## Windows/Linux 1.7.2: deleted projects stay deleted

Resolves actual project files and serializes deletion with saves, blocking late saves from recreating deleted projects. Uses the existing system trash integration while retaining recordings; explicitly restoring and reopening a project allows editing again. Each platform passed 25 related tests. Desktop deletion and restoration were not retested in this task; Mac development checks do not establish results on other systems.

## 1.7.1: keep webcam subjects visible when changing backgrounds

Fixes people disappearing on Mac when some software-decoded webcam recordings switch to cutout, blur or a custom background. Existing footage, edits and the segmentation model are retained. The installed Mac build passed background switching, continuous playback and a 728-frame 1080p export check; physical recording and every timeline boundary were not retested.

Windows and Linux are also locally built as 1.7.1, with EXE, AppImage, deb and pacman downloads. The fix is Mac-specific; its desktop checks do not establish results on other systems. Watermark controls, custom branding and eight local composition types remain available. Installed Windows/Linux applications were not replaced in this task.

## 1.7.0: put your own signature on exports

For a course, demonstration or review copy, choose what appears in the exported corner. Export watermark defaults to 黑粉录屏, with a direct off switch. Expand customization to use a channel name, website, review note or local logo.

![Actual shared watermark settings component, isolated browser verification](/obsidian-assets/hyphenscreen-local-screen-recorder/export-watermark-controls-170.png)

Use text, a local PNG/JPEG/WebP image, or both. Images retain their aspect ratio. Five positions cover the corners and center, with size and opacity controls. The position diagram is illustrative; exported text adapts to background brightness. Settings are saved on actual export. MP4 and GIF share the native overlay path, while ordinary editing previews remain unchanged. Project-authored text and logos are not removed by this switch.

| Example | Default content | Use |
| --- | --- | --- |
| Software default | 黑粉录屏 | Software credit |
| Channel credit | 黑粉科技 · 原创 | Replace with your channel |
| Website corner | hyphentech.top | Your homepage |
| Review copy | 样片 · 仅供审阅 | A faint centered review mark |

![Actual native outputs with default, disabled, custom text and image watermarks](/obsidian-assets/hyphenscreen-local-screen-recorder/export-watermark-170.jpg)

These are frames from actual files. The channel test deliberately uses top left to check positioning; its UI preset remains bottom right. Landscape, portrait, light backgrounds, Chinese text and image combinations were checked. No payment, account or license entitlement is active; future commercial terms remain undecided.

The release candidate passed 4,660 tests with two skipped, plus native watermark checks and decoding/frame inspection of 12 outputs. macOS screen capture errors prevented desktop mouse-driven export, the system save dialog and reopening from being marked as passed. The existing GIF centisecond timing deviation was not fixed. The fixtures are silent, with no new subjective sound review. Mac, Windows and Linux now offer 1.7.0 with optional, customizable export watermarks.

The DMG is 426,722,449 bytes, approximately 427 MB, about 1.22 MB larger than 1.6.9. Image integrity, strict signing and comparison of 609 files/links passed; the local certificate is still not Apple notarization. The native module inside the package exported eight MP4s and two GIFs, all fully decoded. Default versus disabled changed 2,189 corner pixels, with no residual mark in the disabled corner; the contact sheet matches the development result byte for byte. This task did not replace the locally installed application.

The Windows/Linux supplement also implements canvas-source reading for pure-animation projects instead of treating the internal canvas identifier as a video path. Each platform passed ten packaged native outputs. These synthetic export checks do not establish desktop recording, mouse-driven export or device coverage.

## 1.6.9: watch the result before editing your explanation

Local composition now covers source evidence, processes, presenters, before/after comparisons, metrics, checklists, timelines and structures. Open Create animation → Local composition, play a real example, then edit this episode's text, values, images and event timing. Generated native layers and keyframes remain editable. These fixed frameworks run locally without a model request.

![Actual output from eight types; values are illustrative](/obsidian-assets/hyphenscreen-local-screen-recorder/local-explanation-eight-169.jpg)

Paper Signal and Dark Ink provide 16 actual 12-second examples. The following 96-second silent reel covers all eight Paper Signal types, demonstrating reusable structures and actions.

![Complete silent reel of eight local composition types](/obsidian-assets/hyphenscreen-local-screen-recorder/local-composition-169.mp4)

[Open the complete silent reel separately](/obsidian-assets/hyphenscreen-local-screen-recorder/local-composition-169.mp4)

Presenter scenes use six complete illustrations of one character with consistent identity, clothing and proportions. A shared explanation image supplies the default; each stage can override it while retaining its original aspect ratio. Restore shared clears only that stage's binding. The fixed image poses support looking, pointing and reacting, rather than arbitrary character acting.

![Actual stage-image editing and save feedback](/obsidian-assets/hyphenscreen-local-screen-recorder/presenter-content-169.jpg)

The inspector responds to its own width, normally placing stage cards in two columns. Image buttons no longer collapse and the Apply area does not cover settings. Native output now decodes WebP, avoiding images that appear in the browser but disappear from export.

All 16 native 1920×1080, 30 fps, 12-second outputs fully decoded; the six presenter stages were frame-checked. Desktop checks covered the system file chooser, applying a fourth-stage image, disk readback and a seek to about 6.3 seconds. Only the chosen stage changed, and undo restored its original composition. There were 4,650 passing tests and 2 skipped. Examples are silent; subjective listening, physical recording, every seek position and other systems were not retested. Windows and Linux 1.7.0 are now locally built with these composition and stage-image features; Mac desktop checks are not presented as tests of those systems.

Mac 1.6.9 passed image integrity, strict signature verification and a comparison of all 609 files and links. The native compositor in the installed application exported two new 1080p30 examples for stage images and metrics; both fully decoded. The installed studio launched, but system capture errors prevented the final interface-click and continuous-playback checks. The interface checks described above were performed in the independent development studio.

## 1.6.8: edit content and event timing locally

Mac adds Local composition inside Create animation. Choose source evidence, a process or presenter actions, enter content and timing, and create native animation without a model request. It suits recurring explanation segments whose layout remains consistent while screenshots, steps and actions change with each episode.

![Actual local composition editor](/obsidian-assets/hyphenscreen-local-screen-recorder/local-explanation-168.png)

Evidence retains the original local image, source name, URL and verification date, then introduces and focuses it at specified times. Processes support two to five steps with individually editable timing and existing project sound effects. Presenter scenes provide preset look, point, receive, place, react and rest actions. A local declarative compiler handles these tasks without executing model-generated code; the existing model creation workflow remains available for free-form design.

![Actual content and timing controls](/obsidian-assets/hyphenscreen-local-screen-recorder/content-editing-168.png)

The Content tab edits ordinary text and local images, plus sources, steps, colors and event times in composed scenes. Actions and sounds share events. Animation can stay on the project ruler or follow one main recording clip that fully contains it, through moves, splits, trims and deletion. Consecutive compatible compositions reuse a track when they do not overlap, without crossing an intervening picture track.

Finalize content and timing before manual layer refinement. Recomposition rebuilds controlled layers, retains manually added layers and refuses to overwrite locked controlled layers. This is not a general character skeleton or arbitrary long-story generator. Independent narration and auxiliary-video source binding are outside this revision.

Desktop development checks covered generation, title and 4.25-second timing edits, saving, switching projects and reopening with edits retained. Two different 24-second projects and a 12-second presenter project passed seeking and continuous playback. All three native 1920×1080, 30 fps exports fully decoded. There were 4,637 passing tests and 2 skipped. Objective audio checks passed; subjective listening remains incomplete. Other systems and physical recording were not retested. Windows and Linux 1.7.0 include these features.

## 1.6.7: compact packaging controls on Mac

Mac is updated to 1.6.7. A single segment list combines thumbnails, titles, layouts and timing; the current layout is changed in a dropdown. Fields sit side by side, and still and animated previews share one area. Typical four-segment settings fit at 1280×720 and 1024×768; smaller windows and longer lists can scroll.

![1.6.7紧凑界面，实际组件截图](/obsidian-assets/hyphenscreen-local-screen-recorder/packaging-167.jpg)

Ten Chinese display names now have four characters, including Red Poster. Existing theme IDs, project compatibility, palettes, animation and sound are retained. Windows and Linux 1.7.0 include this compact interface.

This revision passed 4,615 tests with 2 skipped, plus application and test type checks. All 570 installed files and links match the Mac installation image and strict signature checks passed. The installed app re-exported an independent four-segment project: 27.4 seconds, 1920×1080, 30 fps and 822 frames, with complete video and audio decoding. It reused existing media and is not a new generation run. App startup and opening the studio passed. A system screen-capture error blocked further desktop interaction; the author explicitly chose to test manually and continue release. Desktop generation and seeking are therefore not reported as agent-verified in this round.

## 1.6.6: whole-video packaging for Windows and Linux

Windows and Linux are locally built as 1.6.6 with ten packages and forty layouts. Generation now uses bundled OpenH264 instead of unavailable libx264, without an extra encoder installation. Mac now provides 1.7.4.

Rendering checks on each platform generated four layouts from synthetic material: 16 seconds and 480 frames, with complete video and theme-audio decoding. All 331 packaging resources in the Windows package matched source bytes. The Ubuntu deb passed installation and file verification. This does not replace desktop capture or device testing.

## 1.6.5: one coordinated design for a whole episode

An opener, list and chart can each look good yet feel unrelated in one video. Version 1.6.5 adds coordinated video packages: choose a design, then fill several segments with this episode’s content while sharing typography, colors, motion and sound.

![Whole-video packaging editor](/obsidian-assets/hyphenscreen-local-screen-recorder/packaging-165.png)

Open a project and select Whole-video packaging in the AI panel. Ten packages each provide opener, list, focus and metric layouts, with real thumbnails and animated examples. One editor displays the fields needed for the current layout. Light and dark themes are readable; generation actions and progress stay in a fixed footer.

Each group supports 1–12 segments of 4–30 seconds. Enter content and timing, and select a frame from a project video for focus layouts. Generate locally and add the group together without a model call or uploading the recording. Effects default on, music defaults off, and existing narration remains. Saved configurations can regenerate and replace their original group; manually moved, trimmed or locked groups are protected.

A real four-segment, 27.4-second recording passed generation, insertion, replacement, seeking, continuous playback, saving and reopening in HyphenScreen, then exported at 1920×1080 and 30 fps. All ten default palettes and forty layouts were rendered and fully decoded. Objective audio checks found no clipped samples or overlap among the four theme tracks. The author listened to the real-recording edit and confirmed normal sound. Other palettes were not individually rendered; the other nine examples do not have separate subjective listening approval.

Generated clips can be edited on the timeline, but their internal layers are not individually editable. Change saved settings and regenerate to edit content. Picture and theme audio remain separate tracks, so select both when moving. Mac real-recording checks retain their 1.6.5 scope; see the 1.6.6 section for Windows/Linux packaging generation verification.

## Earlier in 1.6.4: steadier camera movement

Version 1.6.4 adds steady and responsive camera styles to zoom regions. Select a region, then choose its focus mode in the Zoom inspector. The steady style suits document explanations; the responsive style reacts faster to movements between controls.

![Camera follow settings](/obsidian-assets/hyphenscreen-local-screen-recorder/camera-follow-164.png)

Think of the safe area as room for the pointer to move inside the shot: small movements hold the composition, while crossing the boundary starts a smooth pan. Zoom-out holds the last focus. Consecutive clicks are grouped by time and position to avoid repeatedly zooming during one menu operation. New automatic zooms use the steady style; existing projects retain legacy follow. Pointer-art smoothing is independent of the new camera path. Recorded cursor telemetry is required; external videos can use manual focus.

A 48-second comparison used the same real recording and cursor telemetry for all three modes. The isolated Mac workspace passed mode switching, saving, complete playback and seeking. Two returns to 19.94 seconds produced identical preview pixels. Native export produced 1,440 frames at 1920×1080 and 30 fps, with complete decoding and extracted-frame inspection. The initial preview canvas path was also corrected. This is a Mac camera-motion check; other systems and the full capture-device matrix were not re-tested.

The installed Mac app returned all three camera modes and exported the 48-second comparison with full decoding verified. Desktop checks covered continuous playback after seeking to 20 seconds and another seek to 35 seconds. The public installer was downloaded again and matched the local checksum; it adds only about 14 KB over 1.6.3. Windows and Linux 1.6.4 have now been built locally on the Windows workstation and WSL. The Windows package passed a synthetic three-mode native export and full decoding; the Ubuntu deb passed installation verification. Desktop capture workflows on those systems still need separate checks.

## Earlier in 1.6.3: 230 purpose-based animation entries

The library consolidates the previous 316 discovery entries into 230 across nine categories: text and titles, data and charts, explanations, AI concepts, flows and architecture, intros and outros, social media, picture effects and hardware. Common is a shortcut filter rather than an additional category. Source assets, original IDs and existing projects remain compatible.

![HyphenScreen 1.6.3 purpose library and real chapter preview](/obsidian-assets/hyphenscreen-local-screen-recorder/material-library-163.png)

Shared entries include 22 title styles, 13 chapter styles, ten people profiles, six quote cards, 18 lower thirds, 11 column comparisons, ten line trends, four progress rings and six terminal demonstrations. New examples include statistical rings, terminal simulation, code typing, chat, ranking races and heatmaps. Default text and URLs use Chinese HyphenTech examples; necessary third-party licensing and provenance remain included. Blinds and clock-wipe transitions leave discovery while old-project resources remain available.

![Consolidated title, chapter and profile entries](/obsidian-assets/hyphenscreen-local-screen-recorder/material-text-163.png)

Choose a purpose, insert the material, then select a style in the animation panel. Independent animation and overlays retain their different editing paths. Some sampled-vector internals require regeneration; this is not a promise of arbitrary source-parameter recomputation. Model tools now correctly find reference variants inside mixed-source families when filtering by storage kind.

The development editor passed category browsing, Chinese search, chapter insertion and animation playback. Three cross-source switches passed real API save and fresh-profile reopen checks with clip start positions preserved. The complete suite passed 4,596 tests with two skipped. This does not mean every style received a manual switching review; full recording, physical camera, face restoration and online generation were not repeated.

Version 1.6.3 also includes the local 1.6.2 candidate's multiselection reordering, track organization and package deduplication. Research sources, reference runtimes, sampling caches and test projects are excluded from the installer. Apple Silicon Mac now offers 1.7.4; Windows and Linux offer 1.7.2. Package size and checksums are listed below.

The signed 1.6.3 installer passed disk-image and resource checks; all 427 files and links in the installed app matched the image. The installed binary returned 230 entries, inserted and switched a native material, saved the project and exported a 1920×1080, 30 fps video that decoded fully. Public-download readback is recorded separately. Subjective audio review was not completed.

## Earlier timeline and audio improvements

Mac 1.6.1 stops stale programme audio before preview returns to live mixing after timeline edits, and delayed playback requests recheck the current mode. Five music groups in the saved real project do not overlap; a regression reproduced the stale-audio path. Two-way handoff, delayed startup, isolated desktop playback, clip movement and saved-project readback passed. A real native export decoded fully and its music level showed no duplicate mix. Subjective listening review remains incomplete.

This release also fixes animation entrances, exits and source labels flashing over later recordings after earlier jump cuts. Animation placements now map from their actual editor-ruler position to source footage in both preview and export. The project format is unchanged; existing animations and manual edits do not need to be rebuilt. The fix is now available on all three platforms in 1.6.3.

Recordings lifted into separate picture rows also move horizontally in absolute time instead of repacking the entire main sequence to the start. In an isolated development desktop, a 10–20-second clip moved about three seconds later and back while the other clips stayed at 0–10 and 20–30 seconds. Vertical lifting and saved-project readback passed. The final full suite passed 4,535 tests, with two skipped; installation and public availability are tracked separately in the release record.

A fixed project snapshot reproduced the unwanted logo and webpage overlays in native preview and a short MP4 export; both disappear with the corrected mapping. Regression coverage spans main recordings and imported video. Both TypeScript checks passed. These short-segment checks do not replace full-film review, subjective audio review or desktop acceptance on every platform.

Version 1.5.9 makes jump cuts explicit: Add Jump Cut starts with the selected main clip’s full range and offers adjustable endpoints, reset and restore. Deleting a main recording shifts later independent visuals, audio and markers; source-anchored captions and effects keep their existing mapping.

Replay after a tail cut and active-source identity were corrected, and removed players release their resources. Targeted tests and development desktop checks passed, but the reported long-session player-creation failure was not reliably reproduced; complete resolution is not claimed. The editing API also consolidates compatible non-overlapping visuals. A private episode reduced 51 animation tracks to 3 while preserving all 51 clips and the order of 29 overlapping pairs. This is an episode-specific result, not a guaranteed ratio; the original edit was preserved.

Version 1.5.8 fixes preview in projects containing native animation, narration and music but no source video. Initialization could incorrectly send the first audio asset to the video decoder. Preview now selects the actual visual source from the compiled timeline, including the generated animation canvas, rather than an unrelated asset.

External scene-by-scene writing compatibility is also fixed. Before packaging, a private copy of a 146.83-second project with 11 animation clips and two audio tracks was checked in the real editor: start, middle and end seeks, plus continuous playback from beginning to end. The installed build passed those seeks and early playback across scenes; subsequent system capture errors prevented reading back its playback endpoint. The original project was preserved. This is a targeted preview check, not a claim that every device, model-generation task or subjective audio review has passed.

## Animation generation: adjustable waiting and incremental feedback

Open a project, select your configured AI engine and choose animation creation. Describe the purpose, style, duration and actions; generated scenes can be edited on the timeline. For local generation, select LocalBrain in AI settings and load a model that supports tool calling in LocalBrain.

The pink clock button opens waiting settings. Total and idle timeouts can each be set from 1 to 360 minutes, with 15/45/90-minute shortcuts and settings remembered per engine. LocalBrain defaults to 45/10 minutes; online and subscription engines default to 15/5. Longer waiting allows a slow model more time; it does not make generation faster.

![Animation waiting settings](/obsidian-assets/hyphenscreen-local-screen-recorder/v157-animation-wait-settings.png)

Planning text appears as actual output arrives. Engines with streamed tool arguments show which scene structure is being written and the received character count. After each scene is written, the tool reads back its actual layer count and duration. Engines without argument streaming show real stages only. Intermediate feedback does not mean the project has been saved or the video exported. Automated tests, component checks, production build and package verification passed; complete story generation, playback and subjective sound review remain for user testing.

- Apple Silicon Mac: **1.7.4**, DMG **426,759,601 bytes**, locally signed and not Apple-notarized.
- Windows 10/11 x64: **1.7.2**, installer **409,519,709 bytes**, unsigned.
- Linux x86_64: **1.7.2** in AppImage (**608,577,814 bytes**), deb (**523,201,016 bytes**) and pacman (**484,536,504 bytes**) formats.
- Online model fees are charged by the selected provider; local models consume local hardware resources.

[Mac DMG](https://github.com/HackerChi-Hub/HyphenScreen-Releases/releases/download/v1.7.4/HyphenScreen_1.7.4_arm64.dmg) · [Windows installer](https://github.com/HackerChi-Hub/HyphenScreen-Releases/releases/download/v1.7.2/HyphenScreen_1.7.2_x64-setup.exe) · [Linux AppImage](https://github.com/HackerChi-Hub/HyphenScreen-Releases/releases/download/v1.7.2/HyphenScreen_1.7.2_x86_64.AppImage) · [Ubuntu/Debian deb](https://github.com/HackerChi-Hub/HyphenScreen-Releases/releases/download/v1.7.2/HyphenScreen_1.7.2_amd64.deb) · [Arch pacman](https://github.com/HackerChi-Hub/HyphenScreen-Releases/releases/download/v1.7.2/HyphenScreen_1.7.2_x64.pacman) · [All platform releases](https://github.com/HackerChi-Hub/HyphenScreen-Releases/releases/latest)

Mac package SHA-256:

```text
8a88a46ba44b9e1f2a7e209876b91a471c581dcb37074ad13384f85a5a9e9518
```

SHA-256 checksums for Windows and Linux 1.7.2:

| Package | SHA-256 |
| --- | --- |
| Windows installer | `84ae067376c105ac25645dd8bd3e7c76d161da069a2d34124acd09577199919f` |
| Linux AppImage | `384603d76d2220014d9bf099db1dbafa922cb7837977ff89e55471d6970417a4` |
| Ubuntu/Debian deb | `97d155b5f50a0530fe244269e6194870bf3ac55b624f9ba6811323513edf50ea` |
| Arch pacman | `440f2f5cd809c07d6002cb854efcf95c8ca15e223213524ddd78fab5409efdb2` |

Locally built Windows/Linux 1.7.2 packages passed native component, font and packaged resource checks. Each packaged addon exported eight MP4s and two GIFs with full decoding and no residual watermark in the disabled corner. Installed applications were not replaced in this task. Linux capture still needs testing in a desktop session with a ScreenCast portal.

## Earlier feature tour and development history

The following screenshots and development records describe versions 1.0.1/1.0.2. Their layouts, counts and test results are historical, not the latest interface. Current platform versions and downloads are listed above.

> [!abstract]
> Recording is easy; the work starts after
> HyphenScreen 1.0.2 · official release · free download
> HyphenTech · first published 2026-09-16 · updated 2026-09-29 · also in 简体中文 and 繁體中文 (switch below the title)

Let me start with something that made my stomach drop. I built automatic redaction into my own screen recorder: it finds e-mail addresses, keys and the like in the picture and covers them with a mosaic. When it was done, **every unit test passed**. The boxes were in the right place, and on a still frame they fitted perfectly.

Then I exported a video and watched it from start to finish. **During the few seconds the picture zoomed in, the mosaic fell behind, and an e-mail address and a key starting with `sk-` were plainly readable.** It happened once more inside a vertical reframe. The tests checked whether the box coordinates were right; what I actually needed was that nobody could read anything sensitive in the finished video. Those are two different things, with zooms, tilts, crops and encoding in between.

Since that day the app has something most screen recorders do not: **after export, it reads the finished video itself back**, frame by frame with text recognition, to confirm that what should be covered is covered. This section was written for version 1.0.2; the current release is listed above.

![HyphenScreen 1.0.1: the preview is zoomed in on a code block, the key and contact details are redacted automatically, captions below and a watermark in the corner; the timeline gives captions, annotations, zoom, video, voiceover and music each their own track](/obsidian-assets/hyphenscreen-local-screen-recorder/v101-en-editor.jpg)

A word on **where the money in screen recording comes from**, because it decides where the effort goes. The usual moves: the free version adds a watermark or a time limit and **turns export into a paywall**; or the tool becomes a cloud service where you upload your screen and pay for storage and exports. Screen recordings are about the most private material there is — your e-mail, your paths, tokens, the chat window you forgot to close. **The party that gains is the one holding your footage for storage and transcoding; the cost lands on whoever uploaded it.** Desktop software has played this script many times: the one-off licence stops getting updates and features move into a subscription.

Why do I make HyphenScreen? Honestly: **I publish videos every week, screen recordings are my main footage, and I do not want my screen on anyone's server.** There is no subscription, no cloud and no storage to sell, so there is no way for it to make money off you; the upkeep is mine. Since 1.0.2 there is a sponsor code for anyone who wants to chip in; sponsoring or not changes nothing in the app. Judge it accordingly: it will not get worse to earn from you, but it could stall if I run out of time.

| | Facts |
| --- | --- |
| Version at the time | 1.0.2, official release (2026-09-29) |
| Built with | Electron interface + a native Rust compositor; recognition, transcription and voice isolation all run on your computer |
| Installer | Mac 265.7 MB (Apple silicon), signed with my own HyphenTech certificate, not Apple-notarized |
| Other platforms at the time | Windows 10/11 x64 and Linux x64 received 1.0.1 (without 1.0.2's sponsor code); unsigned |
| Download | Free and public, with SHA-256 checksums; the source is private |

> Versions and installer size come from the project's release notes and my local installer shelf, not estimates

> [!warning]
> This is a version 1.0.2 record. Mac now offers 1.7.4; Windows and Linux offer 1.7.2. The Mac build is still not Apple-notarized, and the Windows installer is still unsigned. See the limits below for platform differences.

## 🧩 The full tour (screenshots from the app)

These are real screenshots, taken on a demo project made for the purpose: a recording of a scrolling web page, synthetic narration and background music. Every e-mail, phone number and key in it is fake — **the pictures that introduce a screen recorder should not leak anything either**. The two camera shots show my own camera. The recording, camera, multitrack, transition and AI chat shots show the Chinese interface; the rest show the English one.

### 🎥 Recording: make "what to record" simple

![Recording: pick a screen, a window or a region; camera and microphone record in the same take; switch between saved setups](/obsidian-assets/hyphenscreen-local-screen-recorder/v101-recording.jpg)

- The whole screen, one window, or any region you drag — **while dragging, click a window to take its exact bounds** instead of lining up the edges yourself. Lock the region to 16:9, 9:16, 1:1 or 4:3 so vertical content needs no crop later. Region capture works on macOS and Windows.
- Camera, microphone and system sound record together, along with the pointer, so the editor can suggest smooth zoom-ins where the pointer lingered. The camera records at the best quality the device offers.
- Microphone, camera, capture area and camera look can be saved as named "recording setups" and switched in one click.

Screen recorders used to stop at recording: you opened another app to edit, exporting once and importing once, losing quality twice. This one was built as record + edit from day one — the take goes straight onto the timeline without an extra encode.

### ✂️ A timeline laid out like DaVinci Resolve

![The timeline: captions, annotations, zoom, speed, cuts, video, original sound and voiceover each on their own track, every item labelled with what it is](/obsidian-assets/hyphenscreen-local-screen-recorder/v101-en-timeline.jpg)

- Captions, annotations, zoom, speed, cuts, V1 video (add more video tracks above it), A1 original sound, then voiceover and music. Track headers show the name and item count and can lock, hide, mute and reorder.
- **Items say what they are**: the annotation text, the template, the redaction category, the zoom factor, the length cut, the caption sentence — no clicking each one open.
- Voiceover and music waveforms are drawn for the part you can see, at device-pixel detail, so zooming in makes them sharper.
- Press M for a marker; markers copy straight into chapter timestamps for a video description. A/B for select and blade, Cmd+B to split, J/K/L to play, I/O for in and out — the keys editors already know.

### 🧱 Multitrack and on-canvas editing

![Multitrack editing: three video layers, edge trimming, independent music and the clip effects panel](/obsidian-assets/hyphenscreen-local-screen-recorder/v101-multitrack.png)

- Import several videos and audio files at once. Video tracks have no fixed limit: the upper picture covers the lower ones and all sound is mixed. Drag clips and their edges to arrange and trim; Shift for fine control, arrow keys frame by frame.
- While paused, select things right in the preview: move and scale the recording and the camera; drag and resize captions, text, images, arrows, blur boxes and templates.
- Fullscreen preview (F in, Esc out). A heavy project can drop its preview to 1/2 or 1/4 resolution to stay smooth; exports always use full resolution.

### 🎭 Screen and camera

![Camera effects: picture-in-picture, camera zoom, the camera making room when the screen zooms, camera only, side-by-side split, cut-out camera at the bottom](/obsidian-assets/hyphenscreen-local-screen-recorder/v101-camera-effects.jpg)

- Picture-in-picture, side-by-side or stacked split, with one click to swap sides; the screen always keeps its aspect ratio.
- **The cut-out edge follows the real outline in the camera picture** (macOS): fingers, glasses and shoulders stay crisp instead of a blurred halo. The background can be a blur, an image, a colour or a gradient.
- In picture-in-picture the screen and camera make room for each other: when the screen zooms, the camera shrinks into its corner; when the camera zooms, the screen shrinks aside. A shrunken camera is sampled over each pixel's footprint, so it neither flickers nor blurs.

![Camera layout: layout, share, swap and corners — with a clip selected, only that clip changes](/obsidian-assets/hyphenscreen-local-screen-recorder/v101-camera-layout.jpg)

- Every clip can have its own layout and look — side by side for one stretch, picture-in-picture for the next; whatever a clip does not set follows the whole video.

### 💬 Captions and Chinese line breaks

- On-device transcription creates captions (built-in Whisper, or LocalBrain), keeping the recognizer's real timestamps; **silence and music markers never become captions**.
- Edit captions by hand, search them, restore the original wording, pick one of six styles. **Chinese captions break between words**, never inside a word or a model name, and preview and export break in the same place.

### 🔊 Sound

![Sound: voice isolation, music ducking under speech and its three presets](/obsidian-assets/hyphenscreen-local-screen-recorder/v101-en-audio.jpg)

- **Voice isolation** (macOS): an on-device neural network removes keyboard, fan and other noise and keeps the voice, with low cut, EQ, compression and limiting.
- **Music ducking**: the music dips while someone speaks and comes back after, with natural background, balanced voice and voice first presets, or your own lead-in, hold and release.
- Split the original sound onto its own track, blade it and set each part's level (−60 to +36 dB). Cut a video clip in two and the voiceover and music over it split with it and play straight on.

### 🎨 Visual templates and picture effects

![Visual templates: pick by category, drop at the playhead, then adjust every setting](/obsidian-assets/hyphenscreen-local-screen-recorder/v101-en-visual-templates.jpg)

- 35 templates: title cards, name strips, step badges, key caps, spotlight, result and comparison cards, an outro with a call to action, a corner watermark and more, with search across all of them.
- 13 text styles and 11 picture effects recreated from my other app, HyphenCut (bold impact titles, handwritten quotes, warm documentary, teal-and-orange, vignette, RGB glitch…); nine fonts ship with the app.
- 12 transitions (dissolve, dip to black or white, wipes and pushes in four directions, zoom) with the sound fading along, applicable to every cut at once.

![Transitions: pick one at a cut between clips, set its length and audio fade](/obsidian-assets/hyphenscreen-local-screen-recorder/v101-transitions.jpg)

### 🛡 Automatic redaction that follows the picture

![Automatic redaction: the key, e-mail and phone number are covered, and the boxes follow the text as the page scrolls](/obsidian-assets/hyphenscreen-local-screen-recorder/v101-en-redaction.jpg)

The hard part of redaction is not finding the text; it is **following** it. Finding the e-mail is only step one — then the picture zooms, tilts, gets cropped to vertical, and the page scrolls. The mosaic has to move with all of it; one frame late is one leak.

- On-device recognition of e-mail addresses, phone numbers, ID numbers, bank card numbers, keys and your own keywords (automatic detection is macOS-only for now). ID and card numbers are checksum-verified, so there are few false alarms.
- Redaction follows zooms, tilts, crops and vertical reframes. **On a scrolling page the boxes follow the text stretch by stretch**, covering only where it travels. Before 1.0.1 one box covered the whole path the text took — at worst half the frame. Fixed along the way.
- If you turn the annotation or zoom track off for an export, **the redaction track stays on and tells you so** — that one is deliberately not switchable.

### 🩺 Finished-video check: trust the output, not the process

Back to the story at the top. The lesson: **however green the checks along the way, that does not make the output right.** So after export you can check the finished file itself, and every check is about the output:

- **Loudness and true peak**, with a suggested output level instead of guessing by ear
- **Stretches of silence and black**, each one marked
- **Frozen pictures**: the output stops while the source keeps moving — the classic sign of a broken export
- **An output shorter than its timeline**: a clip running past the end of its media, located at the moment the media runs out
- **Captions and titles that do not fit**: anything cut off or outside the frame
- **Text recognition reads the picture back**, frame by frame, to confirm nothing sensitive shows (macOS for now)

The numbers below are from a measured receipt on the installed 0.4.13 (exported at 1280×720/30fps on the acceptance project through the app's own interface, then checked; the program wrote the numbers, I did not copy them by hand):

| Check | Result |
| --- | --- |
| Export time / check time | 12.6 s / 34.8 s |
| Loudness · true peak · dynamic range | −18.2 LUFS · −2.8 dBFS · 3.7 LU |
| Text read-back | one frame per second, 150 frames analysed |
| Verdict on the normal output | 0 problems, 0 warnings |
| Re-checked with the redaction deliberately removed | e-mail and key recognised from 165.0 to 181.2 s; a red marker placed at 172.08 s: "Check: e-mail readable · key or password readable" |

> Receipt file docs/evidence/export-check-0.4.13.json

> [!tip]
> **The last row is the point.** When a checker reports "no problems", there are two possibilities: there are none, or the checker is not doing anything. If you cannot tell which, it is worthless. So every time I feed it an output **with the redaction deliberately removed** — it has to catch the e-mail and the key. Only when it does is its "0 problems" on the real output worth believing.

Findings can be marked on the timeline in one click; step through them with Shift+↓.

### 📱 Vertical highlights

Turn a stretch of a landscape recording into a 9:16 short: software is cropped around the pointer, web pages and documents are kept whole, the title sits above and captions below, and zooms stay inside the picture area.

### 🤖 AI: bring your own, nothing bundled

![The built-in chat: use the Codex subscription you are already signed in to, or a local model; trim, caption and zoom with a sentence, plus one-click recipes](/obsidian-assets/hyphenscreen-local-screen-recorder/v101-ai-chat.jpg)

My choice for AI is **not to bundle**: no built-in model, no API fees collected on your behalf, no deciding for you. If you are already signed in to a Codex subscription, it is reused (no key to paste); for fully local, connect LocalBrain. 69 tools cover editing, sound, captions, transitions, redaction, zoom, markers, per-clip effects, visual templates, vertical reframes, export and the finished-video check — **anything you can do by hand in the editor has a matching tool** — plus 12 one-click recipes such as "shorten pauses", "remove filler words", "remove repeats and retakes" and "check before publishing". External AI can use the same tools over MCP (73 with reading, saving, undo and redo).

The last time "AI editing" excited me was the one-click finished-video wave: stunning demos that never survived a real publishing routine, because they did everything for you and you could only take it all or start over. Here the AI **works on your timeline**: every step lands as an edit you can undo, and you can take over at any moment.

### 🗂 Projects, version history and storage

![Version history: every version with its time, cause and changes since the one before — go back to any of them](/obsidian-assets/hyphenscreen-local-screen-recorder/v101-en-history.jpg)

- **Every edit is written to disk at once**, and versions of the whole project are kept over time (every 5 minutes by default, only when something changed), each labelled with its cause and changes; go back to any of them, and undo the going back.
- Save a project anywhere and open one from anywhere; the folder for new projects can live on an external drive.

![Storage & cleanup: where projects, recordings and caches live, with each kind of cache cleared on its own](/obsidian-assets/hyphenscreen-local-screen-recorder/v101-en-storage-cleanup.jpg)

"Storage & cleanup", new in 1.0.1, came from my own system disk running out of room:

- **Move the recordings folder and the existing recordings move with it**, with every project and saved version pointed at the new place. Everything is copied and checked before an original is deleted. A take that has just stopped needs a few seconds to finish writing, and the app waits for it — it never moves half a recording. Moved files keep their dates.
- The cache folder can move too: the old caches are simply deleted and rebuilt in the new place as needed. Each kind of cache shows its size and can be cleared on its own or all at once. **Recordings and projects are never cleaned up.**
- An old annoyance fixed on the way: after quitting, voice isolation sometimes kept running in the background, holding a whole CPU core until a half-hour timeout, and fought the next launch for resources. Now background work ends when you quit.

### ☕ 1.0.2: a sponsor code, and where it shows up

![The Support the Author dialog: the author's WeChat Pay code and a short note](/obsidian-assets/hyphenscreen-local-screen-recorder/v102-en-sponsor-menu.jpg)

The app costs nothing and shows no ads. 1.0.2 adds one place to support it: the app menu's **Support the Author**, which opens the author's WeChat Pay code. In a Chinese interface the same code also sits in the export-done panel, right below "Saved to" — the moment you have just got your video, not the moment you are about to start work.

- In an English interface it never appears on its own; the menu item is the only way to it.
- In a Chinese interface it waits until the app has been installed for three days (counted from when its data folder was created, so updates do not reset it), then shows after a finished export at most once per calendar day.
- **It never appears while a recording is running**: anything that pops up then would end up in your video. After each export the app first asks whether a recording is running and, if it cannot tell, assumes one is.
- It has no buttons and blocks nothing; sponsoring or not changes no feature. The code is an image inside the app: showing it needs no network, and nothing about it is counted.

## ⚠️ Current limits

- **No proper signing yet**: the Mac version is signed with my own certificate and not Apple-notarized; Windows is not code-signed and SmartScreen will warn on first run; Linux is unsigned too.
- **Platform features differ**: Mac offers 1.7.2; Windows and Linux offer 1.7.2. Voice isolation, automatic sensitive-text detection and text read-back of the finished video remain macOS-only. Clicking a window to select its bounds works on macOS and Windows. Windows and Linux desktop interaction still needs testing on the respective systems.
- **Linux has dependencies**: all capture goes through xdg-desktop-portal, and it needs Vulkan drivers and your desktop's portal backend.

## 🧭 My take

If you make tutorials, reviews or software demos, the real cost of screen recording was never the ten minutes of recording. It is what comes after: cutting pauses, redacting, reframing for vertical, checking nothing went wrong. **Everything in this app is designed around "after recording"**, including that slightly clumsy-sounding check — watching the finished video again after export.

The clumsy way has its merits: it trusts none of the intermediate steps I wrote, only the final file. After "all tests green but the e-mail showed", I think that distrust is worth it. Taking the screenshots for this post, my own app taught me the lesson again: **the screenshots revealed three problems** — splitting a clip dropped the music after the cut, redaction boxes on a scrolling page were far too big, and silence got transcribed as the marker "[BLANK_AUDIO]" — none caught by tests, all obvious the moment you look at the picture. They were fixed before 1.0.1 went out. Adding the sponsor code in 1.0.2 taught me the same lesson again: all 14 of my real-app checks passed, yet the screenshot showed the strip stuck at the bottom edge of the export dialog — half a line visible, the buttons below the edge, the code opening out of sight. The checks asked whether it was there; the person using it needs to see it.

> [!summary] The design as described for 1.0.2
> HyphenScreen is the screen recorder and editor I use myself. This historical account describes the Mac build at the time: local sensitive-text recognition, redaction through zooms and crops, and a read-back of the exported video. Current downloads, platform differences and verification limits are listed at the start of this article.

---

## 📚 Notes

- Current download: [Downloads & updates: HyphenScreen (releases)](<https://github.com/HackerChi-Hub/HyphenScreen-Releases/releases/latest>)
- The numbers come from the project's release notes and measured receipts; the screenshots were taken with purpose-made demo media — the sponsor one on 1.0.2, the rest on 1.0.1.
- HyphenTech: [Visit HyphenTech](<https://hyphentech.top>)


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
