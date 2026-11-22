---
title: "FLUX 3 Klein Local Free Raw Image Test: 6.8GB Offline Run, Can You Really Draw a Frame for Cats and Dogs to Align with Coordinates?"
slug: flux-3-klein-local-image-test-en
status: published
lang: en
translation_of: flux-3-klein-local-image-test
article_type: "article"
translation_source: machine
source_sha256: 6d35dcc5b9bf39fd
date: 2026-11-21
updated: 2026-11-22
summary: "Mac 16GB unified memory with LocalBrain offline running 14 problems (with all copyable prompts): heteropupil reflection, large Chinese magazine font, and 0-1000 coordinate box placement are very stable; Second, scene change blur, three-image face crossover, and koi 3-to-4 boundary spread out all at once."
categories:
  - 本地AI
tags:
  - FLUX3Klein
  - Local raw images
  - Image editing
  - LocalBrain
cover: "/obsidian-assets/flux-3-klein-local-image-test/cover-dc9af45cbc.jpg"
brand_slogan: 让AI成为你的超能力
legacy_paths: []
---

> [!info] Machine translation
> This post was machine-translated from the Chinese original. Wording may be rough in places — the [Chinese version](https://hyphentech.top/flux-3-klein-local-image-test/) is authoritative.

> [!abstract]
> Running 14 pressure tests on Mac using LocalBrain disconnected from the internet: a complete review of Chinese-English typesetting, multiple rounds of image editing, and the true upper limit of the 0-1000 centripetal coordinate box (with full set of prompts)
> HyphenTech · 2026-11-21

　　Draw a box for the kitten and puppy in the frame. Can the locally free raw model really make them stand obediently in the designated area without damaging the original portraits and backgrounds nearby? Around 11 PM last night, I opened my own open-source tool **LocalBrain** on my Mac, pulled down the Black Forest Labs open-source **FLUX 3 Image Klein** (commonly referred to as **FLUX 3 Klein**), and tested **14 hardcore questions under the spotlight. As promised during the video, this article organizes all **14 original test images, actual time spent, details of failures, and the **complete, copyable prompts** for each question all at once.

![Review Real Photos | Overview of 10 Original Photos 1024×1024 from the First Round of Recording Continuously](https://hyphentech.top/obsidian-assets/flux-3-klein-local-image-test/image-ev01-b698887e10.jpg)

　　First, explain why this model is worth including in the main machine. According to [Check Black Forest Labs official announcement: FLUX 3 Image Klein](https://bfl.ai/blog/flux-3-image-klein) and [Refer to NVIDIA NIM official model cards and coordinate box instructions](https://build.nvidia.com/black-forest-labs/flux-3-image-klein/modelcard), which integrates the **5.6B** (**5.6 billion** parameters) image diffusion backbone and the independent **Qwen3-VL-4B-Instruct** visual language encoder into the same pipeline. This weighting alone can simultaneously perform **text-to-image**, **single-image instruction editing**, up to **10** reference image combinations, plus **0 to 1000** normalized coordinate frame layout control.

　　When it lands on our own computers, [See the Unsloth GGUF quantization weight page: flux-3-image-klein-GGUF](https://huggingface.co/unsloth/flux-3-image-klein-GGUF) Pressed out `UD-Q4_K_XL` The master image file is only **3.66 GiB** (about **3.7 GB**), plus `Qwen3VL-4B-Instruct-Q4_K_M` Text encoder and `ae.safetensors` , in LocalBrain The entire runtime package is about **6.8 GB** in total. A Mac with **16 GB** unified memory (recommended **24 GB** for more flexibility) or a Windows laptop with **8 GB** dedicated graphics can run the entire process without network connection, with cloud computing costs **0 yuan**. If you want to see dynamic screen recording and zoom in first, you can also directly open the synchronized live version [Watch the full test video on Bilibili (BV1TSyazNEkF)](https://www.bilibili.com/video/BV1TSyazNEkF) Or [Watch the full YouTube test video](https://youtu.be/SdbAttC71D8).

![Review Recording | LocalBrain v2.3.7 One-Click Mount of About 6.8GB FLUX 3 Image Klein](https://hyphentech.top/obsidian-assets/flux-3-klein-local-image-test/image-ev02-6b02bbd6f1.jpg)

> [!tip] This round has 14 questions: Unified measured baseline (reproducing control variables)
> • **Local Run Stack**: Mac side LocalBrain (underlying `stable-diffusion.cpp` `Flux3ImageKleinGGUF` pipeline), model packages `flux-3-image-klein-UD-Q4_K_XL.gguf` + `Qwen3VL-4B-Instruct-Q4_K_M.gguf` + `ae.safetensors`.
> • **Lock sampling parameters**: Fixed steps for the distillation plate at **16 steps**, `Euler` sampler, guidance coefficient **CFG 1.0** (the official distillation version degrades external CFG when raised higher), fixed random seed **Seed 42**, with image sizes `1024×1024` square and `1248×832` horizontal charts.
> • **Real Machine Time Record**: Regular single raw image takes about **2 minutes** (`5C` tested **106.67 seconds**, `6C` **109.53 seconds**); Single image reference editing takes about **3 to 4 minutes** (`3A-2` **236.44 seconds**); Compositing three reference images `1248×832` (`4b-2`) takes **726.92 seconds** (about **12.1 minutes**).

## 1. English multi-plane typography and optical texture: 3.7GB main weight can make the heterochromia, water droplets, and miniaturized nameplates fine?

　　Many small-sized quantitative models turn into oil paintings when they draw complex light and shadow, or paint pets all over with colors. In the first level, I took three combination questions of "Dual-Color Temperature Conflict + Reflection and Refraction + Multi-Plane English for Near and Far Distance," all completed in one go without drawing cards.

### 1A | Neon bar obsidian reflection + heterochromatic white Persian cat + Near-distance dual-layer English

```text
Glamorous high-fashion magazine editorial photo of a stunning adult East Asian woman in her mid-20s, cascading dark wavy hair with loose strands catching rim light, wearing a tailored crimson silk halter evening dress with a high collar, confident warm smile, leaning gracefully on a wet polished black obsidian bar counter. Beside her right elbow sits a fluffy pure-white Persian cat with heterochromia (one sapphire-blue eye and one amber-gold eye) wearing a tiny emerald velvet bow. Behind them, a glowing magenta neon sign clearly spells "LOCAL AI 3.7G" on an exposed brick wall, while a small brass table menu stand in the foreground clearly reads "0 CLOUD FEE". A crystal coupe glass filled with amber sparkling tea refracts the neon glow, and the wet black bar surface reflects both the woman's crimson sleeve, the white cat's paws, and the inverted pink neon glow. Dual-color-temperature lighting mixing cool cyan rainlight from a window on the left with warm tungsten pendant lamps overhead, 85mm f/1.4 lens, visible natural skin pores, individual glowing cat whiskers, Vogue cover photography.
```

![Review Real Photos | 1A Neon Bar: Persian Cat with Alien Eyes, Green Bow Zero String, and Obsidian Countertop Reflection](https://hyphentech.top/obsidian-assets/flux-3-klein-local-image-test/image-ev03-abe763ce4e.jpg)

　　Zooming in on this `1024×1024` original image, all four harsh conditions are perfectly set: the white Persian cat with blue on the left and amber yellow heterochromatic pupils on the right is perfectly accurate; The emerald velvet bow on the neck is sharp at the edges, with a ring of white fur around it that is spotlessly unstained; The neon text on the brick wall in the distance `LOCAL AI 3.7G` and the small text `0 CLOUD FEE` on the brass stand at the bottom left are perfectly spelled; Even the cat's chin, green bow, and pink neon on the damp obsidian countertop are perfectly aligned.

### 1B | Rainy night Paris window display two-way perspective + Dalmatian Dalmatian + dual flat text

```text
Cinematic editorial street portrait of an elegant adult woman in her late 20s with sleek chestnut hair tied in a French twist with rain-dampened bangs, wearing a structured champagne trench coat cinched at the waist over a black turtleneck, standing outside a vintage Parisian bookshop window on a rainy night. She holds a transparent dome umbrella covered in sharp raindrops while gently resting her left gloved hand on the head of an alert Dalmatian dog with crisp black spots on white fur sitting faithfully beside her boots. Gold leaf lettering painted directly on the glass window behind her clearly reads "ATELIER KLEIN", and a warm paper poster inside the shop window reads "OPEN 24H". Warm 3000K golden bookstore light spills outward through the rain-streaked glass onto her cheekbones and the Dalmatian's spotted ears, contrasting with cool 7000K cobalt-blue streetlamp reflections on the wet cobblestone puddles at their feet, 50mm Summilux lens, rich film grain.
```

![Review Real Photos | 1B Rainy Night Paris Window: Glass Gold Foil Lettering ATELIER KLEIN and Interior Poster OPEN 24H Layered Clarity](https://hyphentech.top/obsidian-assets/flux-3-klein-local-image-test/image-ev04-8e1cbde82b.jpg)

### 1C | Film darkroom dual-color light + silver tabby Maine + three miniature industrial nameplates

```text
Atmospheric editorial portrait of a charismatic adult woman in her mid-20s with shoulder-length wavy auburn hair and subtle freckles, wearing an oversized charcoal linen blazer over a crisp ivory silk shirt, sitting on a wooden stool in a vintage analog photography studio. She cradles a massive silver-tabby Maine Coon cat with long ear tufts in her arms; the cat's fluffy tail drapes naturally over her forearm. Overhead hangs a clothesline of translucent developed film strips glowing under a warm amber safelight, while a cool daylight softbox from the right illuminates her iris catchlights and the silver guard hairs of the cat. On the metal enlarger machine beside her, a brushed-steel nameplate clearly reads "FLUX-3", a stacked magazine proof on the desk reads "STUDIO 16G", and a vintage lens cap reads "85MM". Shallow depth of field, tactile fabric weave, zero hair-fur merging.
```

![Review Real Photos | 1C Film Darkroom: Red-brown Curls and Maine Silver-Gray Long Hair Clearly Defined, Machine Nameplate FLUX-3 Accurate](https://hyphentech.top/obsidian-assets/flux-3-klein-local-image-test/image-ev05-5e40505995.jpg)

　　`1B` The transparent umbrella's water droplets transmit light, the black-and-white spots in Damai Town and the clean trimming of the champagne trench coat, the reflection of water accumulation on pebbles, and the depth of field in front and back of the glass gold foil text `ATELIER KLEIN` and the store's poster `OPEN 24H`—none of these are flawed; `1C` The red and brown hair inside the character with Maine silver gray ears doesn't clump together; the `FLUX-3` on the metal enlarger and the `STUDIO 16G` on the desktop sample are clearly distinguishable. **In terms of English short word layout and complex light and shadow textures alone, this 3.7GB tablet's quantized weight is more than enough for everyday main products. **

## 2. Chinese Comprehension and the Stroke Ladder Challenge of Chinese Characters: "Understanding Chinese" and "Being able to write small characters" are two different things

　　The biggest taboo in Chinese image testing is confusing "semantic understanding" with "pixel handwriting." Because FLUX 3 Klein directly uses **Qwen3-VL-4B-Instruct** as a text encoder, it has a solid foundation in reading long pure Chinese prompts; But to accurately draw a dozen or so characters into pixel grids, it still depends on the diffusion backbone of **5.6B**. We increase the score in five steps and clearly identify the exact breakpoint.

### 2A | Pure Chinese with six layers of high saturation attribute isolation (zero English words, tested for encoder color blur protection)

```text
博物馆级东方时尚大片，一位二十六岁的成年东方女性端坐在明式紫檀木圈椅上，乌黑盘发插着一支碧玉簪，身穿祖母绿重磅真丝立领长裙，左手执一把朱砂红宣纸折扇半掩下颌，右肩稳稳停着一只雪白葵花凤头鹦鹉（黄色羽冠展开），脚边青砖地上趴着一只戴宝蓝色铃铛项圈的黑柴犬（清晰四点白眉）。背景是雕花木格窗，清晨丁达尔阳光穿过薄雾在青砖地面投下整齐的窗格光斑，茶几上放着一只盛满琥珀色茶汤的青花瓷盖碗，85毫米人像镜头，皮肤细腻真实，每一根羽毛与狗毛分明。
```

![Real review photos | 2A Pure Chinese prompt: Six groups of colors and orientations are accurately placed, slight flaws at the foot contact point](https://hyphentech.top/obsidian-assets/flux-3-klein-local-image-test/image-ev06-df916b100e.jpg)

　　Not a single word in English was written: a rosewood circle chair, emerald long skirt, vermilion red folding fan, a yellow-crowned white parrot on the right shoulder, a black Shiba Inu collar at the feet, and a blue-and-white porcelain tea bowl at the table corner **6 sets** with highly saturated colors and perfectly matched left, top, and bottom, with no color mixing anywhere. The flaws are also obvious: compared to the first three English fashion photos, this oriental ancient-style portrait has a heavy powdery finish on the face, and there is a slight molding at the junction between the instep and the blue brick floor.

### 2B | Fashion magazine double-layer Chinese cover (large bold black main title vs. subtitle)

```text
一线时尚杂志封面大片，一位二十五岁的成年东方气质美女，蓬松微卷黑长发，身穿剪裁利落的象牙白真丝衬衫与焦糖色皮质背带裙，眼神松弛自信地看向镜头，双臂温柔环抱一只正在吐舌微笑的黄白双色威尔士柯基犬，柯基毛茸茸的爪子自然搭在她的小臂袖口上。画面顶部居中排版醒目的白色粗黑体杂志主标题"本地AI"，左下角排版清晰副标题"断网实测 零算力费"，右下角印着刊号"2026特刊"。高级商业影棚蝴蝶光配合发丝轮廓光，背景为高级暖灰渐变幕布，中画幅相机质感。
```

![Review real images | 2B Chinese magazine cover: "Local AI" and "Offline Testing with Zero Computing Fee" can be directly selected by the system's live text](https://hyphentech.top/obsidian-assets/flux-3-klein-local-image-test/image-ev07-7f853c6c17.jpg)

　　This cover gave me a big surprise: the main title in bold white at the top `本地AI`, the subtitle `断网实测 零算力费` at the bottom left, and even the very small `2026特刊` in the lower right corner—all written in text. During the recording, I swiped directly with my mouse in the macOS preview, and the system's live text immediately recognized the Chinese characters. The overlapping relationship between the top of the person's head and the main title looked just like a serious business magazine.

### 2C / 2D / 5C | From glowing neon lights, chalk wooden signs, and mixed three-carrier layouts, all the way down to bilingual book pages

```text
【2C 雨夜弄堂霓虹与粉笔双材质】
王家卫电影感时尚写真，一位二十七岁的成年东方古典美女，复古手推波纹盘发，身着墨绿色暗纹织锦缎高领长旗袍，外披珍珠白羊绒披肩，撑着一把半透明竹骨油纸伞站在雨夜石板弄堂口，脚边蹲坐着一只仰头看她的绿瞳纯黑短毛猫，积水路面清晰倒映出人影与黑猫。她身后上方悬挂一块竖排红色发光霓虹灯牌写着"夜上海"，身旁咖啡馆门口立着一块深胡桃木黑板手写白色粉笔字"今夜营业"。冷青色雨雾与暖红霓虹交织，35毫米电影镜头，雨丝与油纸伞透光质感极致细腻。

【2D 独立书店中英数符号混排】
独立书店午后写真，一位二十五岁的成年知性女性店长，琥珀棕低马尾配金丝圆框眼镜，穿燕麦色麻花针织开衫，坐在原木吧台后微笑注视怀里熟睡的长毛三花猫（黑白橘三色分明）。吧台后方黑板菜单用工整白字写着"手冲咖啡 ¥28"，她右手握着的牛皮纸杯套上印着黑色英文"OFFLINE 100%"，桌上帆布托特包印着"黑粉实测"。窗外暖阳穿过绿植叶片在猫背和针织衫上投下斑驳树影，50毫米定焦实拍质感。

【5C 双语摊开精装书页微距（补测耗时 106.67 秒）】
Close-up editorial portrait of an adult woman in her late 20s in a cream cashmere turtleneck sitting by a rain-streaked cafe window, a fluffy ragdoll cat resting its chin on her forearm as she holds open a hardcover bilingual art book tilted toward the camera. The left page displays a crisp multi-line English paragraph under the heading "CHAPTER 04: LOCAL INFERENCE", and the right page displays a neat vertical Chinese poem under the heading "第四章：本地算力自由", illuminated by soft directional window light, 50mm lens.
```

![Review Real Photos | 2C Rainy Night Alley: The Glowing Vertical Sign 'Night Shanghai' Character Shape Is Stable, Wooden Plaque Chalk 'Tonight Business' 'Camp' Mistaken](https://hyphentech.top/obsidian-assets/flux-3-klein-local-image-test/image-ev08-8ae07bb3a8.jpg)

![Review photos | 2D bookstore mixed layout: ¥28, OFFLINE 100% with canvas bag 'Black Pink Test' overall readability about 95%](https://hyphentech.top/obsidian-assets/flux-3-klein-local-image-test/image-ev09-cb15a1312c.jpg)

![Review Photos | 5C Bilingual Book Pages (Estimated 106.67s): Large chapter titles readable on both sides, many lines of small text degenerate into pseudo-text patterns](https://hyphentech.top/obsidian-assets/flux-3-klein-local-image-test/image-ev10-6eaf7723b2.jpg)

　　Placing these three together makes the boundaries for writing Chinese characters on the FLUX 3 Klein clear: **High contrast bold Hei font or glowing neon large text (4 to 8 characters) is basically more stable; Once replaced with low-contrast handwritten chalk text with denser strokes (e.g., `2C` The 'camp' in the village, `2D` the character 'ka' in the middle), and then it starts to be more horizontal and less vertical; and then on `5C` For bilingual pages, dense small print sections can only be preserved by the model `CHAPTER 04: LOCAL INFERENCE` And `第四章：本地算力自由` Two lines of large headlines, and the entire main text below can only be read as background atmosphere, not read word by word.

## 3. Single Images and Consecutive Two-Round Editing: Adding Thin Dog Ropes That Won't Break, So Why Does the Second Round of Snow Scenery Leave a 'Green Tie Ghost Reflection'?

　　Follow [to read the official ComfyUI tutorial: FLUX 3 Image Klein Text-to-Image and Edit](https://docs.comfy.org/tutorials/flux/flux-3-klein). When feeding it reference images for editing, the prompt shouldn't just say dryly "Change the skirt to black," but embed `<ref_image_0>` into the complete image description. I first tested a single round of dress changes, a single round of torso with a thin dog leash, then followed up on a second consecutive round of major scene changes, and I caught its most typical latent space anchoring temperament.

```text
【3A-1 首轮编辑：吧台换黑丝绒晚礼服与黄昏天际线（源图 1A）】
In <ref_image_0>, keep the exact same adult woman's facial features, eye shape, confident smile, dark wavy hairstyle, and the exact same fluffy white heterochromia Persian cat with one blue eye and one amber eye. She now wears a floor-length midnight-black velvet off-shoulder evening gown with subtle silver embroidery, leaning against a glass balcony railing on a luxury skyscraper rooftop at golden-hour sunset, with the white Persian cat sitting calmly on a marble pedestal beside her. Warm orange-gold sunset sunlight illuminates her skin and the white fur naturally from the right, completely replacing all pink neon reflections from the bar, overlooking a glowing metropolitan skyline under a twilight sky.

【3A-2 第二轮追击编辑：再改冬夜飘雪大衣与猫咪红围巾（源图 3A-1，耗时 236.44 秒）】
In <ref_image_0>, preserve the exact same woman's face, hairstyle, the white heterochromia Persian cat, and the rooftop skyline composition. Transform the entire scene into a snowy winter blue-hour evening: she now wears a thick double-breasted cream cashmere trench coat with snow-dusted lapels, soft snowflakes falling through the air with subtle motion blur, and the white Persian cat wears a tiny knitted crimson wool scarf around its neck. Cool 6500K winter twilight ambient light with warm city window lights bokeh in the background, faint frosty breath in the cold air.
```

![Review real photos | 3A Consecutive Rounds Editor Comparison: In round 2, the cat's neck is replaced with a red scarf, but the obsidian countertop reflection still retains the green bow from round 0](https://hyphentech.top/obsidian-assets/flux-3-klein-local-image-test/image-ev11-70454e952b.jpg)

　　Looking at the triplet comparison image above, the most noteworthy is the third frame from the right (`3A-2`, time taken **236.44 seconds**): in the first round, when the red dress was changed to a black velvet off-shoulder dress and the pink neon was replaced with the dusk city skyline, although the person and cat were still leaning against the bar and wine glass and hadn't moved to the outdoor balcony, the overall lighting and countertop reflections refreshed synchronously; When the first round result was applied and the second round prompt was applied to change it to a winter night snowy cashmere coat, the model only chose the most effortless part—a beautiful red scarf was knitted around the white cat's neck, but when you look down at the obsidian tabletop, the reflection on the water surface is still a green bow! **At the same time, the coat was not changed, and the dusk skyline behind him shrank into a decorative painting hanging on the brick wall.

　　This phenomenon is exactly the same as the "noon sunlight spots left on the table when changing night scenes in the kitchen" measured by [and checking the Fuser Prompt Comparison Report](https://fuser.studio/articles/flux-3-klein-vs-flux-3-image): reference images in the latent space have a strong lock on the original large geometric structures, and repeated overlays easily leave local physical vulnerabilities. **For daily edits, try to directly write the target state from the original image in one step, rather than like a chain of multiple rounds of scene changes. **

### 3C | Hotspot for third-party failures: torso crossing, leather leash, and gold-rimmed glasses

```text
In <ref_image_0>, keep the woman's face, champagne trench coat, transparent umbrella, the Dalmatian dog, and the rainy Parisian street completely unchanged. Add thin gold-rimmed oval eyeglasses on her face with realistic lens refraction, and add a braided cognac-brown leather dog leash held firmly in her right hand that drapes naturally in a smooth catenary curve across the front of her champagne trench coat and clips cleanly onto a brass ring on the Dalmatian's collar, without breaking or floating.
```

![Review real photos | 3C partial interspersed editing: The brown woven leather dog leash naturally fits into the Damai Town collar over the trench coat, with slight flaws on the rim of the glasses frame](https://hyphentech.top/obsidian-assets/flux-3-klein-local-image-test/image-ev12-6d278af902.jpg)

　　Previously, [checked MindStudio's independent test report](https://www.mindstudio.ai/blog/flux-3-klein-image-tests) and mentioned that these compact models fear handling seat belts or thin ropes that straddle the torso. But in `3C` this locally added question, the brown woven leather pull rope naturally hangs from the right hand, crosses the hem of the champagne trench coat, and precisely hooks into the metal ring around Damai Town's neck, never breaking or hanging in midair; Instead, the pair of gold-rimmed glasses I casually added has a slight loophole where the frame fits.

## 4. Ace Test Tactics: 0-1000 How accurate is the alignment of normalized coordinate boxes? Watch out for two pitfalls when combining multiple images?

　　The most fun part of the whole test was FLUX 3 Klein's native **`0-1000` normalized coordinate box layout control**. Previously, if you wanted to insert a pet into a designated corner of a large area, you either had to paint a partial mask manually or rely on luck by drawing cards; now I treat the entire canvas's horizontal and vertical dimensions as micrometers from `0` to `1000`, and attach a JSON array at the end of the prompt to point and hit exactly where it is.

> [!warning] Pre-order pit to avoid before writing coordinate boxes: are [up, left, down, right], not [x1, y1, x2, y2]!
> According to [consulting NVIDIA NIM's official model card and coordinate box instructions](https://build.nvidia.com/black-forest-labs/flux-3-image-klein/modelcard), each `bbox` quadruple in FLUX 3 Klein is fixed as **`[top, left, bottom, right]` (top, left, bottom, right, value 0..1000)**, and in the main text, `<id>` must be used to anchor the object. If you write `[左, 上, 右, 下]` as usual, two people placed side by side will be stacked directly into two layers by the model!

### 4a-1 | Single image with a cat and a dog inserted in staggered heights on the left and right, keeping the original female lead and the heterochromic white cat still

```text
In <ref_image_0>, keep the woman and her white Persian cat unchanged, add a fluffy golden retriever puppy <dog_1> sitting on the floor in the lower-right foreground looking up at her, and add a small ginger tabby kitten <cat_2> perched on the left end of the bar counter batting at a coaster. Keep everything else in the image exactly unchanged. [{"id": "dog_1", "from": null, "src_bbox": null, "tgt_bbox": [600, 620, 960, 950], "desc": "fluffy golden retriever puppy looking up"}, {"id": "cat_2", "from": null, "src_bbox": null, "tgt_bbox": [460, 60, 700, 290], "desc": "small ginger tabby kitten sitting on the bar counter"}]
```

! [Review real image | 4a-1 thousand-point coordinate box schematic and before-and-after editing: Orange cat at center left [460, 60, 700, 290] and golden retriever at bottom right [600, 620, 960, 950] placed in one step] (.. //obsidian-assets/flux-3-klein-local-image-test/image-ev13-d2355df529.jpg)

　　Comparing the cyan and yellow boxes in the image above, it's immediately clear: the original red dressed heroine, the goblet, and the heterochromic white Persian cat remain in place, while the newly added little orange cat precisely crouches into the left `[460, 60, 700, 290]` area, creating a natural hair-squeezing effect with the original white cat; A golden retriever puppy also grows in the lower right `[600, 620, 960, 950]` box looking up at the female lead. The only minor flaw is that the lower right corner originally used to be a bar countertop instead of the floor, and the golden retriever's front paw patch has a slight see-through hole.

### 4b-2 & 6C | Three-Reference Cross-Diagram Joining (726.92 seconds) and Tea Room Water Mirror Eight-Dimensional Stress Problem (109.53 seconds)

```text
【4b-2 三参考图咖啡馆坐标组局（1248×832，耗时 726.92 秒，输入 1A + 1B + 2A 三图）】
Sunlit Parisian outdoor cafe terrace editorial photo. The adult woman <woman_1> from <ref_image_0> sits on a woven bistro chair on the left, the adult woman <woman_2> from <ref_image_1> sits across the small marble table on the right, the exact pet <pet_1> from <ref_image_2> rests on a plush cushion in the center foreground between their chairs, and a three-tier silver pastry stand <tray_1> sits on the tabletop in the middle. Warm afternoon golden sunlight, 50mm lens. [{"id": "woman_1", "from": "ref_image_0", "src_bbox": [0, 0, 1000, 1000], "tgt_bbox": [100, 30, 950, 370], "desc": "adult woman from ref_image_0 sitting at cafe"}, {"id": "tray_1", "from": null, "src_bbox": null, "tgt_bbox": [360, 410, 620, 590], "desc": "three-tier silver afternoon tea pastry stand"}, {"id": "pet_1", "from": "ref_image_2", "src_bbox": [0, 0, 1000, 1000], "tgt_bbox": [640, 360, 980, 640], "desc": "exact pet from ref_image_2 on a cushion"}, {"id": "woman_2", "from": "ref_image_1", "src_bbox": [0, 0, 1000, 1000], "tgt_bbox": [100, 630, 950, 970], "desc": "adult woman from ref_image_1 sitting at cafe"}]

【6C 京都红叶琉璃茶室水镜（1248×832，耗时 109.53 秒）】
Exquisite editorial portrait on the wooden veranda of a Kyoto lakeside pavilion at autumn twilight. An adult East Asian woman in her mid-20s with poised gaze wears an indigo silk furisode kimono intricately embroidered with golden cranes and crimson maple leaves, kneeling beside a calm shallow reflecting pool. Her right hand holds a translucent glass wind chime with a paper strip reading "AUTUMN 26", while her left hand rests gently on the back of a red Shiba Inu sitting attentively beside her knees; beneath the clear water surface, three orange-and-white koi carp swim among fallen red maple leaves, creating concentric ripples that slightly distort the upside-down reflection of the woman, the Shiba Inu, and a warm glowing paper lantern hanging overhead reading "KLEIN". Afternoon sunbeams pass through a half-rolled bamboo blind, casting crisp parallel striped light-and-shadow bands continuously across her kimono sleeve, her cheek, and the Shiba Inu's fur in physically consistent alignment, 85mm medium-format photography.
```

![Review real image | 4b-2 Three-reference image combination (726.92s): All four corner positions are correct, but the woman on the right uses the updo and green outfit from the third pet reference image](https://hyphentech.top/obsidian-assets/flux-3-klein-local-image-test/image-ev14-5a97dff3ad.jpg)

![Review Real Photos | 6C Tea Room Water Mirror Stress Problem (109.53s): Lantern KLEIN and water ripple reflection are natural, but 3 koi fish were drawn into 4](https://hyphentech.top/obsidian-assets/flux-3-klein-local-image-test/image-ev15-0bee2ada97.jpg)

　　Finally, these two extreme stress problems thoroughly exposed the temperament of multi-image compositing and complex physical constraints: `4b-2` Simultaneously inserting **3 images** `1024×1024` Reference image run `1248×832` Large banner, first time jumped directly to **726.92 seconds** (about **12.1 minutes**); Although the four coordinate frames on the left—female, middle snack stand, lower black Shiba Inu, and right female—are all in the correct positions, I casually used them as the third pet reference `2A` In the original image, there was still a girl in a green dress with updoed hair, and `<woman_2>` on the right, who should have worn a champagne trench coat, was instantly "possessed" by the third image and swapped into a bun and green clothes—**For multi-image references, to avoid mixing outfits, the pet or prop reference image you feed must be cropped in advance into a clean, single-subject image. **And in the `6C` tea room water mirror, the crane maple leaf embroidery, the ripples on the water, and the `KLEIN` on the lantern are all steady, except for the clearly required **3** koi (5 koi fish** stripes** drawn as **4**, and the light from the bamboo curtain's parallel stripes only stopped at the kimono's shoulders, failing to cross the curved surface and extend to the cheeks and Shiba Inu's back.

## 5. Summary of 14 Practical Tests and the Most Convenient Daily Usage

| Test Dimensions (Question Number) | Local time consumption (Seed 42 / 16 steps) | Measured steady-state long board | Real boundaries and ways to avoid failures |
| --- | --- | --- | --- |
| English Typesetting and Complex Light and Shadow (1A / 1B / 1C) | About 2 minutes per photo | Heterochromia, hair boundaries, and water droplet reflections are solid; Neon large characters and miniature nameplates are spelled correctly | For very small lens cover letters (such as 85MM), occasional blurring is needed; just leave enough font size for the main visual lens |
| Chinese Semantics and Chinese Character Rendering (2A–2D / 5C) | Approximately 2 minutes (5C measured 106.67 seconds) | Pure Chinese 6-color zero color crossing in direction; Large 4–8 character bold cover text can be directly recognized by the system | Complex chalk characters (such as "營") are prone to mistakes, and many lines on pages often blur small characters in the main text; The main text is reserved for later typesetting |
| Single Chart and Multi-Turn Reference Editing (3A-1 / 3A-2 / 3C) | Approximately 3–4 minutes (3A-2 measured 236.44 seconds) | Single round of clothing changes, skyline lock face, stable face; Crossing the torso and adding a leather leash naturally prevents tearing | In the second relay, the big scene change will leave the original tabletop green bow tie reflection; Try to change it from the original picture in one step |
| 0-1000 Coordinate Box and Multigraph (4a-1 / 4b-2) | Single image about 3–4 minutes; Three images 726.92 seconds | Press [top, left, bottom, right] to specify the positions of dual and four-person pets to place them in the frame precisely | Multiple maps take twice as long, and using extra characters in reference maps makes it easy to mix outfits and hair; Crop to a single main character first, then feed in |
| Single image 8D limit stacking (6C tea room water mirror) | 109.53 seconds (1248×832) | Intricate embroidery, ripples on the water, and the English lanterns all appear together for a natural visual effect | Three koi are drawn into four, with stripes across curved surfaces misaligned; Strict counting of whole pieces requires manual inventory |

　　If you happen to have a Mac with **16 GB** or more unified memory or a Windows computer with **8 GB** dedicated graphics, you can directly visit [to view the LocalBrain feature introduction page](https://hyphentech.top/localbrain) or [Download and update: LocalBrain (GitHub release page)](https://github.com/HackerChi-Hub/localbrain-releases/releases) Free test run of this approximately **6.8 GB** FLUX 3 Image Klein (this time's synchronized test video is done by [Check HyphenScreen feature introduction page](https://hyphentech.top/hyphenscreen-local-screen-recorder) Record clips; installation package is available in [Download and update: HyphenScreen (GitHub release page)](https://github.com/HackerChi-Hub/HyphenScreen-Releases/releases)). **Everyday use of it to produce high-quality base images at zero cost without internet disconnection, combined with `[上, 左, 下, 右]` thousand-point coordinate boxes to position key elements correctly, then hand over the fine text and text to post-processing software for processing—this is currently the smartest and most cost-effective way to open local lightweight raw image models. **

## Main sources of verification

- [Official Black Forest Labs Release Notes: FLUX 3 Image Klein (5.6B Open-Source Weight and Features Introduction)](https://bfl.ai/blog/flux-3-image-klein)
- [Hugging Face Official Model Repository: black-forest-labs/flux-3-image-klein](https://huggingface.co/black-forest-labs/flux-3-image-klein)
- [Unsloth GGUF Quant Weight Warehouse: unsloth/flux-3-image-klein-GGUF(UD-Q4_K_XL)](https://huggingface.co/unsloth/flux-3-image-klein-GGUF)
- [NVIDIA NIM Model Card: flux-3-image-klein architecture parameters and [top, left, bottom, right] 0-1000 coordinate box specification] ([View page: build.nvidia.com · modelcard](<https://build.nvidia.com/black-forest-labs/flux-3-image-klein/modelcard>))
- [ComfyUI Official Documentation: FLUX 3 Image Klein Local Text-to-Image and Reference Image Editing Tutorial](https://docs.comfy.org/tutorials/flux/flux-3-klein)
- [Fuser Independent Comparison Review: FLUX.3 Klein vs FLUX.3 Same Prompt Typing and Light Alteration Shadow Test](https://fuser.studio/articles/flux-3-klein-vs-flux-3-image)
- [MindStudio Independent Test: FLUX 3 Klein Image Generation and Local Physics Interweaving Test](https://www.mindstudio.ai/blog/flux-3-klein-image-tests)
- [Complete HyphenTech Bilibili test video: FLUX 3 Klein local image test (BV1TSyazNEkF)](https://www.bilibili.com/video/BV1TSyazNEkF)
- [HyphenTech YouTube Full Test Video: FLUX 3 Klein Local Raw and Edited Tests](https://youtu.be/SdbAttC71D8)


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
