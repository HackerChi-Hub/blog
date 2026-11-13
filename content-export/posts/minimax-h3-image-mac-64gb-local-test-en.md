---
title: "MiniMax H3-Image Test: 64GB Mac can natively produce 4K—how long does it take to modify reference images?"
slug: minimax-h3-image-mac-64gb-local-test-en
status: published
lang: en
translation_of: minimax-h3-image-mac-64gb-local-test
article_type: "model"
model_name: "MiniMax H3-Image"
model_category: "图片生成"
model_stage: "本地实测"
model_url: "https://huggingface.co/MiniMaxAI/MiniMax-H3-Image"
translation_source: machine
source_sha256: a52fe501234c1eab
date: 2026-11-11
updated: 2026-11-13
summary: "Running the community 4-bit version on the M5 Pro 64GB Mac: 2K raw image takes about 73 seconds, native 4K about 6 minutes 17 seconds. Compare the original images edited with single and dual images and memory records to see which tasks are suitable for them."
categories:
  - 新锐模型
tags:
  - Local deployment
  - LocalBrain
cover: "/obsidian-assets/minimax-h3-image-mac-64gb-local-test/cover-fe9144cf14.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/minimax-h3-image-mac-64gb-local-test/) is authoritative.

> [!abstract]
> Running the community 4-bit version on the M5 Pro 64GB Mac: 2K raw image takes about 73 seconds, native 4K about 6 minutes 17 seconds. Compare the original images edited with single and dual images and memory records to see which tasks are suitable for them.
> November 11, 2026 · Let AI be your superpower

The first task I gave MiniMax H3-Image was to have it draw a lakeside glass greenhouse: a red canoe on the water, with morning mist blocking a bit of the view. Then, I returned the newly generated image to the model and asked it to change the boat to yellow and add a moon. Finally, I pushed the size to 4096×4096. Dimensions and usage time were checked against the finished product and logs; Whether the image was good or correct, the images had to be viewed together.

![AI Generation | Native 4096×4096 Example: Walnut Shell Observatory. The webpage image has been reduced, with pixel-level details at the center of the original image attached.](https://hyphentech.top/obsidian-assets/minimax-h3-image-mac-64gb-local-test/image-text-4k-5aa3f29499.jpg)

## Native 4K works well, and editors can indeed make changes

| Local tasks | Finished product dimensions | End-to-end time-consuming | Graphical calculation peak |
| --- | --- | --- | --- |
| Pure text generates images | 2048×2048 | 72.6 seconds | 24.46 GiB |
| Edited with only reference images | 2048×2048 | 191.4 seconds | 25.21 GiB |
| Pure text generates images | 4096×4096 | 376.9 seconds | 24.46 GiB |
| Dual reference chart combinations | 2048×2048 | 341.7 seconds | 25.27 GiB |

> M5 Pro, 64 GiB unified memory, macOS 26.7.1; each item is used once, independent process, system file cache not cleared. Time consumption includes encoding, sampling, decoding, and disk writing.

In 4K images, cracks on wooden shells, brass binoculars, and star map textures can all be recognized. Once you place them at webpage width, these details are easily suppressed. Here's a direct crop of the original image area to help judge whether 4K is useful for this type of still life.

![AI Generation | 4096×4096 Partial view of the original image, not enlarged or sharpened after capture.](https://hyphentech.top/obsidian-assets/minimax-h3-image-mac-64gb-local-test/image-text-4k-detail-7a39797bed.jpg)

![AI Generation | Single Image Editing: Red Canoe, Lake Surface, and Greenhouse.](https://hyphentech.top/obsidian-assets/minimax-h3-image-mac-64gb-local-test/image-text-2k-d52b9be372.jpg)

![AI Generation | After editing a single image: the ship turns yellow and the moon appears; The composition is largely preserved, but lighting and local details change.](https://hyphentech.top/obsidian-assets/minimax-h3-image-mac-64gb-local-test/image-edit-2k-d3b906ea97.jpg)

If you just want to change colors and add a distinct element to a picture, this set of editing results is already useful. Once the position is accurate, you need to leave time for review. In the dual-image task, I had it place the Walnut Shell Observatory on the bridge in front of the greenhouse; The main elements of both images were included in the finished product, but the observatory was placed on the left side of the image and wasn't placed accurately on the bridge. For tasks that require strict retention of position, text, or pixel level, I still use layer compositing to finish.

![AI Generation | Dual Reference Image Output: Theme combination successful, but the specified placement position is not fully followed.](https://hyphentech.top/obsidian-assets/minimax-h3-image-mac-64gb-local-test/image-edit-multi-2k-bc48a6332f.jpg)

## With a weight of 54.5 GB, why is the measured peak graphics about 25 GiB?

Disk size and peak operation are two separate accounts. 54.5 GB is the full package size for the community four-bit version, which includes a text encoder, sampling trunk, and decoder. The adaptation implements phased component calls and performs four-bit quantization for some linear and embedded layers; Not all layers become four-bit. The measurement is the peak value of the MLX graphical calculation allocation and cannot be directly used as full-machine memory usage, nor can it be inferred that a 32GB machine can run on this basis. The system swap space did not increase during the four tasks; switching occupation already existed before machine testing.

The most obvious cost after increasing the size is time. From 2048 to 4096, width and height double, pixels quadruple; The time to generate text images for these two rounds dropped from 72.6 seconds to 376.9 seconds, about 5.2 times. Both times are six steps, so single-step 4K sampling is still much more expensive. I first use 2K to set composition, color, and camera feel, preserving the image before producing in 4K. Using the same prompt to resize and resample may change the composition, so you need to take another look at the finished image.

## After connecting to LocalBrain, how do you choose?

LocalBrain 2.3.4 integrates MiniMax H3-Image into the image generation category in "Discovery." This model entry only supports Macs running macOS 26 or later with Apple chips; The Windows and Linux installation packages on the same version do not include this model feature. Full weights are already available for reuse. In "Dialog → Local Multimedia Tools → Raw Images," select the model, choose the size, add reference images, and then edit according to the command. "Edit Image" also allows you to select the cover image and other reference images. Installation package see [LocalBrain 2.3.4 release page](https://github.com/HackerChi-Hub/localbrain-releases/releases/tag/v2.3.4), validation values see [download instructions](https://github.com/HackerChi-Hub/localbrain-releases).

To confirm that it really works after connecting, I ran another set using candidate installation packages and verified models from the external drive: Mr. became a blue teacup, then handed this image to the editing portal and changed it to red. Both times I got the original images 2048×2048; The former reloaded seed 0, the latter reread seed 19. The cup body pattern, window frame, and wooden table positions are well preserved. This set changed the prompts and disk environment, and the time usage was not directly compared with the table above.

![AI Generation | LocalBrain candidate installation package reuses weights from external drives to generate blue teacups.](https://hyphentech.top/obsidian-assets/minimax-h3-image-mac-64gb-local-test/image-app-blue-cup-e9a2ab1969.jpg)

![AI Generation | Editing path for the same candidate installation package: Change the blue cup to the red cup, keeping the main composition.](https://hyphentech.top/obsidian-assets/minimax-h3-image-mac-64gb-local-test/image-app-red-cup-141d2eb8ec.jpg)

Size can be preset or customized. Currently, the adapter requires width and height to be integer multiples of 32, with a single side from 32 to 8192, total pixels not exceeding 20 million, and the longest side not exceeding eight times the short side. If you fill in an error, it will be prompted first; Do not secretly change the request to low resolution. Requests below about 4.2 million pixels will first be generated on the internal canvas and then output according to the request size. 2K and 4K square images have been tested; Being able to fill in the legal size does not mean every scale and memory configuration has already been tested.

The official team also has a separate [prompt expansion model](https://huggingface.co/MiniMaxAI/MiniMax-H3-Image-PE), about 17.9 GB each. Disabled by default, but both raw and modified images can be enabled after selecting the local directory. Tested with the "Blue Ceramic Teacup on the Wooden Table by the Window," it added lighting, glaze, coaster, and desktop materials; Expansion took about 73 seconds, and the whole image took about 210 seconds. Then replaced with a red cup in Chinese language; expansion with reference image took about 162 seconds, full editing took about 484 seconds. Both finished images were specified 2496×1664; the original short sentence, actual expansion, and seed were all kept in the receipt. If you want to save time or already have a finely written prompt, just keep the default closed option.

![AI Generation | Official expansion activated, short Chinese prompt generates 2496×1664 horizontal images.](https://hyphentech.top/obsidian-assets/minimax-h3-image-mac-64gb-local-test/image-pe-blue-cup-d7f2314313.jpg)

![AI Generation | Official expansion enabled, follow Chinese instructions to change the blue cup to red; Position, window frame, and coaster basically retained.](https://hyphentech.top/obsidian-assets/minimax-h3-image-mac-64gb-local-test/image-pe-red-cup-335b0faa05.jpg)

The four tests in the opening table use [Community MLX 4-bit version](https://huggingface.co/nativ-community/MiniMax-H3-Image-4bit), with additional prompt expansion disabled and run according to fixed six-step and guidance coefficient 1. The tests did not compare official full precision or online services, nor did they treat the upstream specification of up to sixteen reference images as standard machine tests. Community conversion continues to use [MiniMax Community License](https://huggingface.co/MiniMaxAI/MiniMax-H3-Image/blob/main/LICENSE); Before using it for commercial projects, first verify whether your usage scenario and region comply with the terms.

## Models and adaptation sources

- [MiniMax H3-Image Official Model Card](https://huggingface.co/MiniMaxAI/MiniMax-H3-Image)
- [Tested community authority fixed version](https://huggingface.co/nativ-community/MiniMax-H3-Image-4bit/tree/d2e36369b1ea5cfeb90bde50592a509250052172)
- [Apple Chip Native Operation Adaptation Records](https://github.com/Neywa-Labs/mlx-vlm/pull/2702)


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
