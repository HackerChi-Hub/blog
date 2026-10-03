#!/usr/bin/env node
'use strict';

/**
 * 把简体文章机器翻译成英文版（Azure 认知服务 · 翻译）。
 *
 * 几条硬规则，都是为了避免「自动流程悄悄毁掉东西」：
 *
 * 1) 只覆盖自己生成的译文。机翻产物带 `translation_source: machine`，没有这个标记
 *    的一律跳过并报告——站上已有人工精翻的英文/繁体版，被脚本冲掉就找不回来了。
 *    用白名单（只动我生成的）而不是黑名单（别动这几篇）：黑名单漏标一篇就被吃掉，
 *    白名单漏标只是不翻。
 *
 * 2) 代码不翻。围栏代码块整块跳过；行内代码、链接与图片地址、产品名在送翻译之前
 *    换成占位符。术语保护必须发生在翻译「之前」——翻完再替换的话，机器可能已经把
 *    「黑粉录屏」拆开重组进句子里，找不回原来的位置。
 *
 * 3) 占位符还原后要校验数量。翻译器偶尔会吞掉标记，少一个就抛错，不产出残缺译文。
 *
 * 4) 原文改了要能发现。译文里记 `source_sha256`（原文正文 + 标题的哈希），
 *    对不上就重译。
 *
 * 用法：
 *   node scripts/translate-posts.js --list              只列出待翻译的，不动任何文件
 *   node scripts/translate-posts.js --slug <slug>       翻一篇
 *   node scripts/translate-posts.js --limit 3           翻最近的 3 篇
 *   node scripts/translate-posts.js --all               全部待翻译的
 *   node scripts/translate-posts.js --all --dry-run     跑完整流程但不写盘、不调 API
 *   加 --force 连已是最新的机翻版也重译
 *
 * 凭据：AZURE_TRANSLATOR_KEY / AZURE_TRANSLATOR_REGION（在 ~/.zshenv，不入库）。
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
// 文末签名不翻：它由模板按文章 lang 渲染，英文版用的是 hfkj_identity.json 里人工维护的
// 译文，比机翻好得多。这里直接复用同一个渲染函数，不另写一份。
const { renderFooter, START: FOOTER_START, END: FOOTER_END } = require('./sync-article-footer-template.js');

const CONTENT_DIR = process.env.BLOG_CONTENT_DIR
  || path.resolve(__dirname, '..', '..', 'blog-content');
// 与 sync-article-footer-template.js 同一套默认路径，两边必须读同一份身份文件
const IDENTITY_PATH = process.env.HFKJ_IDENTITY_PATH
  || path.resolve(__dirname, '..', '..', 'ContentDistributor', 'scripts', 'hfkj_identity.json');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');
const SITE_BASE = 'https://hyphentech.top';

const ENDPOINT = 'https://api.cognitive.microsofttranslator.com/translate';
const API_VERSION = '3.0';
// Azure 单次请求上限是 100 个元素 / 50000 字符；留足余量，避免接近上限时的偶发 400。
const BATCH_ITEMS = 80;
const BATCH_CHARS = 20000;

// 速率：免费层（F0）是每小时 200 万字符，但官方要求「均匀消耗」——滑动窗口约
// 33,300 字符/分钟，短时间发太多就返回 429（「exceeded request limits」）。
// 修过的故障：首次全量时脚本连发，第 5 篇起 54 篇全部 429。这里留 10% 余量主动限速，
// 全量 78 万字符因此至少要 25 分钟左右——这是免费层的硬限制，快不了。
const CHARS_PER_MINUTE = 30000;
const MAX_429_RETRIES = 6;

// ---------- 术语与分类：照实际数据建表，不是拍脑袋 ----------

/**
 * 固定译名：自家产品名，以及中文里习惯简称、机器会译错的软件名。
 * 这些在送翻译前直接换成英文名，翻译后还会核对一个不少。
 * 「达芬奇」是试翻时撞到的：它被译成了人名 Da Vinci。发现新的就往这里加。
 */
const TERMS = new Map([
  ['黑粉科技', 'HyphenTech'],
  ['黑粉录屏', 'HyphenScreen'],
  ['黑粉剪辑', 'HyphenCut'],
  ['黑粉盒子', 'HyphenBox'],
  ['方寸智匣', 'LocalBrain'],
  ['光影词库', 'ScreenLex'],
  ['达芬奇', 'DaVinci Resolve'],
]);

const CATEGORY_MAP = new Map([
  ['技术分享', 'Tech'],
  ['学习思考', 'Thoughts'],
  ['资源分享', 'Resources'],
]);

/** 高频中文标签。表里没有的中文标签会走 API 翻译，并在结尾列出来提示补表。 */
const TAG_MAP = new Map([
  ['本地部署', 'Local deployment'],
  ['自制软件', 'Self-made software'],
  ['免费白嫖', 'Free resources'],
  ['热点速递', 'News'],
  ['工具', 'Tools'],
  ['实测', 'Hands-on'],
  ['模型发布', 'Model releases'],
  ['模型评测', 'Benchmarks'],
  ['开源', 'Open source'],
  ['开发', 'Development'],
  ['开发纪实', 'Dev log'],
  ['教程', 'Tutorial'],
  ['新手教程', 'Beginner guide'],
  ['工作流', 'Workflow'],
  ['人工智能', 'AI'],
  ['大模型', 'LLM'],
  ['AI大模型', 'LLM'],
  ['AI技术', 'AI'],
  ['AI视频', 'AI video'],
  ['AI编程', 'AI coding'],
  ['AI 编程', 'AI coding'],
  ['AI 剪辑', 'AI editing'],
  ['视频生成', 'Video generation'],
  ['本地模型', 'Local models'],
  ['科技前沿', 'Frontier'],
  ['行业分析', 'Industry'],
  ['提示词工程', 'Prompt engineering'],
  ['无人值守任务', 'Unattended tasks'],
  ['网络安全', 'Security'],
  ['开源许可', 'Licensing'],
  ['免费额度', 'Free tier'],
  ['成本', 'Cost'],
  ['量化', 'Quantization'],
  ['前端', 'Frontend'],
  ['编程', 'Programming'],
  ['动画', 'Animation'],
  ['图片', 'Images'],
  ['视频', 'Video'],
  ['新闻', 'News'],
  ['教育', 'Education'],
  ['高考', 'Gaokao'],
  ['芯片', 'Chips'],
  ['华为', 'Huawei'],
  ['科技', 'Tech'],
  ['技术', 'Tech'],
]);

/** 顶部那行机翻声明。读者看到生硬表达时知道原因，也知道能回去看中文原文。 */
const MT_NOTICE = (originalSlug) =>
  `> [!info] Machine translation\n`
  + `> This post was machine-translated from the Chinese original. `
  + `Wording may be rough in places — the [Chinese version](${SITE_BASE}/${originalSlug}/) is authoritative.`;

// ---------- 占位符保护 ----------

// ⟦N⟧ 实测能原样穿过 Azure 翻译：正文里不会出现这组括号，也不像任何 Markdown 语法。
const TOKEN = (i) => `⟦${i}⟧`;
const TOKEN_PATTERN = /⟦(\d+)⟧/g;

function createProtector() {
  const slots = [];
  const keep = (text) => {
    slots.push(text);
    return TOKEN(slots.length - 1);
  };
  return { slots, keep };
}

/**
 * 把一行里不该翻译的部分换成占位符。
 * 顺序由长到短：先图片与链接（含括号结构），再行内代码，最后术语——
 * 反过来的话，术语替换会先把链接文字里的产品名换掉，破坏链接结构的匹配。
 */
/**
 * 整条保护的图片/链接，方括号里的文字仍要做全角转半角，地址不动。
 * 修过的残留：作者写中文文章时，英文 alt 与链接文字里顺手用了全角标点，
 * 如 `[prism-ml/…-gguf（Hugging Face）]`、`![Storage footprint：PTQ1_0 …]`。
 * 它们不含汉字、整条进了占位符，输出阶段的 tidy 碰不到，全角括号就上了英文页。
 */
function halfInBrackets(markdownLink) {
  return markdownLink.replace(/^(!?\[)([^\]]*)(\])/, (_m, open, text, close) =>
    open + toHalfwidth(text).replace(/ {2,}/g, ' ').trim() + close);
}

function protectInline(line, protector) {
  const { keep } = protector;
  const shielded = line
    // 图片与链接：只把 alt / 链接文字露给翻译器，语法标记本身也换成占位符。
    // 只保护地址是不够的——修过的故障：翻译器把 `![` 里的 `!` 当成感叹号，
    // 输出 `! [alt](url)`，图片语法失效，三篇试翻 26 张图全变成了纯文字。
    // 占位符本身能原样穿过，所以把 `![` 和 `](url)` 整个藏进去就不会被拆开。
    //
    // 文字里没有中文时整条保护：`[**https://x**](https://x/)` 这种整行只剩标记的句子，
    // 翻译器会把结构当噪音吞掉。
    //
    // 中文 alt 也要翻：平时不可见，但图片加载失败时会显示、屏幕阅读器会读、
    // 搜索引擎会索引——全站有 530 处。
    //
    // 链接规则上的 (?<!!) 是纵深防御，当前不起作用：图片规则先执行，已经把 `![` 和
    // `](url)` 整个换成占位符，链接规则看不到任何图片结构（变异测试证实：去掉它测试
    // 照样全绿）。留着它是防将来有人调换两条规则的顺序——那时图片会被链接规则再处理
    // 一遍，生成嵌套占位符（⟦1⟧ 的值是 ⟦0⟧），而还原只替换一层。
    // Obsidian 双链 [[slug]] / [[slug|显示文字]]：slug 是站内路由，一个字符都不能动。
    // 修过的故障：漏了这条，翻译器把 [[minicpm5-2b-localbrain]] 改成 miniCPM5-2B-…，
    // 大小写一变就是死链，内容校验拦下了发布。显示文字有中文才留给翻译。
    .replace(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (m, target, text) =>
      (text && /[\u4e00-\u9fff]/.test(text) ? `${keep(`[[${target}|`)}${text}${keep(']]')}` : keep(m)))
    .replace(/!\[([^\]]*)\]\(([^)]*)\)/g, (m, alt, url) =>
      (/[一-鿿]/.test(alt) ? `${keep('![')}${alt}${keep(`](${url})`)}` : keep(halfInBrackets(m))))
    .replace(/(?<!!)\[([^\]]*)\]\(([^)]*)\)/g, (m, text, url) =>
      (/[一-鿿]/.test(text) ? `${keep('[')}${text}${keep(`](${url})`)}` : keep(halfInBrackets(m))))
    // 行内代码
    .replace(/`[^`\n]+`/g, (m) => keep(m))
    // 裸 URL：只认 ASCII 网址字符，遇到中文、全角标点、括号、星号就截断。
    // 修过的故障：原来只排除空格和少数符号，`https://x.com/v1；需要注册并创建自己的`
    // 被整串当成网址保护起来，那段中文因此没被翻译。网址里不可能有中文。
    .replace(/https?:\/\/[A-Za-z0-9\-._~:/?#@!$&'+,;=%]+/g, (m) => keep(m));
  return pangu(replaceTerms(shielded));
}

/**
 * 中文与英文/数字交界处补空格（「盘古之白」）。
 * 修过的故障：「上游PR #28133尚未合并」整行送去，翻译器把 `#28133尚未合并` 当成一个
 * 编号原样留下，漏翻了「尚未合并」。补空格后译成「has not yet been merged」，整句也更顺。
 * 占位符的括号 ⟦⟧ 不是 ASCII，不会被这两条规则碰到。
 */
function pangu(text) {
  return text
    .replace(/([一-鿿])([A-Za-z0-9#@$%&])/g, '$1 $2')
    .replace(/([A-Za-z0-9%)])([一-鿿])/g, '$1 $2');
}

/**
 * 产品名直接换成英文名送去翻译，不用占位符。
 *
 * 修过的故障：用占位符时翻译器看不到它是主语，「⟦0⟧有一条独立的动画轨」被译成
 * 「⟦0⟧ There is an independent animation track」，还原后两截硬拼。
 * 换成英文名后翻译器知道主语是谁，译成「HyphenScreen has a standalone animation
 * track」——实测嵌在中文里的这几个英文专有名词，翻译器会原样保留。
 *
 * 先合并「黑粉录屏（HyphenScreen）」「黑粉盒子 HyphenBox」这种中英并列，
 * 否则替换后会变成「HyphenScreen（HyphenScreen）」。
 */
function replaceTerms(text) {
  let out = text;
  for (const [zh, en] of TERMS) {
    out = out
      .replace(new RegExp(`${zh}\\s*[（(]\\s*${en}\\s*[)）]`, 'g'), en)
      .replace(new RegExp(`${zh}\\s+${en}\\b`, 'g'), en);
  }
  return out.replace(new RegExp([...TERMS.keys()].join('|'), 'g'), (m) => TERMS.get(m));
}

/**
 * 预替换的产品名不受占位符计数保护，所以单独核对：原文里每个产品出现几次
 * （中文名 + 英文名都算），译文里它的英文名就该出现几次。翻译器若把哪个产品名
 * 吞掉或改写了，这里会报出来。
 */
function assertTermsPreserved(source, translated) {
  const problems = [];
  for (const [zh, en] of TERMS) {
    // 原文按替换后的形态计数，避免「中英并列」被算成两次
    const expected = (replaceTerms(source).match(new RegExp(`\\b${en}\\b`, 'g')) || []).length;
    const actual = (translated.match(new RegExp(`\\b${en}\\b`, 'g')) || []).length;
    if (actual < expected) problems.push(`${en}（${zh}）应 ${expected} 处，译文 ${actual} 处`);
  }
  if (problems.length) {
    // 全文级只知道「少了几个」，报错要能定位到行：两边逐行对齐（代码块与签名两边同样剥掉了）
    const sLines = source.split('\n');
    const tLines = translated.split('\n');
    const where = [];
    for (let i = 0; i < Math.min(sLines.length, tLines.length); i += 1) {
      for (const en of TERMS.values()) {
        const re = new RegExp(`\\b${en}\\b`, 'g');
        const want = (replaceTerms(sLines[i]).match(re) || []).length;
        const got = (tLines[i].match(re) || []).length;
        if (got < want) where.push(`第 ${i + 1} 行少 ${en}：${sLines[i].trim().slice(0, 70)}\n        译文：${tLines[i].trim().slice(0, 90)}`);
      }
    }
    const located = where.length ? `\n    ${where.join('\n    ')}` : '\n    （逐行都对得上——差异来自跨行的计数口径）';
    throw new Error(`产品名在翻译中丢失：${problems.join('；')}${located}`);
  }
}

function restore(text, protector) {
  const used = new Set();
  const out = text.replace(TOKEN_PATTERN, (_m, index) => {
    const slot = protector.slots[Number(index)];
    if (slot === undefined) throw new Error(`译文里出现了不存在的占位符 ⟦${index}⟧`);
    used.add(Number(index));
    return slot;
  });
  // 翻译器偶尔会吞掉标记。少一个就说明这行译文已经残缺，必须抛错而不是发出去。
  if (used.size !== protector.slots.length) {
    const lost = protector.slots
      .map((_v, i) => i)
      .filter((i) => !used.has(i))
      .map((i) => `⟦${i}⟧=${JSON.stringify(protector.slots[i]).slice(0, 40)}`);
    throw new Error(`翻译后丢失 ${lost.length} 个受保护片段：${lost.join(', ')}`);
  }
  // 翻译器会在占位符两侧补空格，还原后变成 `![ alt ](url)` / `[ text ](url)`。
  // Markdown 照样认，但收紧一下：只动紧贴在结构标记上的空白，不碰正文。
  return out
    .replace(/!\[\s+/g, '![')
    .replace(/(^|[^!])\[\s+(?=[^\]\n]*\]\()/g, '$1[')
    .replace(/\s+\]\(/g, '](');
}

// ---------- 行结构 ----------

/**
 * 把行首的 Markdown 标记剥下来：标题的 #、引用的 >、列表的 - / 1.、callout 的 [!type]。
 * 这些是结构不是内容，送进翻译只会被改坏（比如 `- ` 被吃掉、`#` 数量变化）。
 */
function splitLinePrefix(line) {
  const match = line.match(/^(\s*(?:>\s*)*(?:#{1,6}\s+|[-*+]\s+(?:\[[ x]\]\s+)?|\d+[.)]\s+)?)(.*)$/s);
  if (!match) return { prefix: '', rest: line };
  let prefix = match[1];
  let rest = match[2];
  // Obsidian callout 的类型标记（[!info] 等）是关键字，不能翻
  const callout = rest.match(/^(\[![a-zA-Z]+\][-+]?\s*)(.*)$/s);
  if (callout) {
    prefix += callout[1];
    rest = callout[2];
  }
  return { prefix, rest };
}

/** 表格行按单元格切，分隔行（|---|---|）整行跳过。 */
function isTableSeparator(line) {
  return /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(line) && line.includes('-');
}

// ---------- Azure 调用 ----------

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 滑动窗口限速：记下过去 60 秒发出去的字符数，再发会超就等最早那批滑出窗口。
 * 状态放模块级，因为限额是按订阅算的，跨文章、跨批次共用一个窗口。
 */
const sent = [];   // [{ at, chars }]
async function throttle(chars) {
  for (;;) {
    const now = Date.now();
    while (sent.length && now - sent[0].at >= 60_000) sent.shift();
    const used = sent.reduce((sum, item) => sum + item.chars, 0);
    if (used + chars <= CHARS_PER_MINUTE || !sent.length) break;
    await sleep(sent[0].at + 60_000 - now + 50);
  }
  sent.push({ at: Date.now(), chars });
}

async function translateTexts(texts, { dryRun }) {
  if (!texts.length) return [];
  if (dryRun) return texts.map((t) => `[DRY] ${t}`);

  const key = process.env.AZURE_TRANSLATOR_KEY;
  const region = process.env.AZURE_TRANSLATOR_REGION;
  if (!key || !region) {
    throw new Error('缺少 AZURE_TRANSLATOR_KEY / AZURE_TRANSLATOR_REGION（在 ~/.zshenv 设置）');
  }

  const out = [];
  for (let i = 0; i < texts.length; ) {
    const batch = [];
    let chars = 0;
    while (i < texts.length && batch.length < BATCH_ITEMS && chars + texts[i].length < BATCH_CHARS) {
      chars += texts[i].length;
      batch.push({ Text: texts[i] });
      i += 1;
    }
    const url = `${ENDPOINT}?api-version=${API_VERSION}&from=zh-Hans&to=en&textType=plain`;
    await throttle(chars);

    // 主动限速之外仍可能撞 429（窗口算法与服务端不完全一致、别的程序也在用同一个 key）。
    // 有 Retry-After 就照办，没有就指数退避；退完还不行才算失败。
    // 网络瞬时故障（fetch failed）也走同一套退避——全量时 54 篇里撞到过一次。
    let response;
    let data;
    for (let attempt = 0; ; attempt += 1) {
      let networkError = null;
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': key,
            'Ocp-Apim-Subscription-Region': region,
            'content-type': 'application/json',
          },
          body: JSON.stringify(batch),
        });
        data = await response.json();
      } catch (error) {
        networkError = error;
      }
      const retryable = networkError || response.status === 429;
      if (!retryable || attempt >= MAX_429_RETRIES) {
        if (networkError) throw networkError;
        break;
      }
      const retryAfter = networkError ? NaN : Number(response.headers.get('retry-after'));
      const waitSeconds = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 5 * 2 ** attempt;
      process.stdout.write(`(${networkError ? '网络错误' : '限流'}，${waitSeconds}s 后重试) `);
      await sleep(waitSeconds * 1000);
    }
    if (!response.ok || data.error) {
      throw new Error(`Azure 翻译失败 HTTP ${response.status}：${JSON.stringify(data).slice(0, 300)}`);
    }
    out.push(...data.map((item) => item.translations[0].text));
  }
  return out;
}

// ---------- 结构校验 ----------

/**
 * 译文的 Markdown 结构必须和原文逐项一致。
 *
 * 这道闸是补出来的：占位符数量校验只能证明「受保护的片段都回来了」，证明不了
 * 「它们还在原来的结构里」。试翻时占位符一个不少，但 `![` 被拆成 `! [`，26 张图
 * 全变成了纯文字——数占位符的校验全部通过。
 */
function structureOf(text) {
  const noCode = text.replace(/^```[\s\S]*?^```/gm, '');
  return {
    代码块: (text.match(/^\s*```/gm) || []).length,
    图片: (noCode.match(/!\[[^\]\n]*\]\([^)\n]*\)/g) || []).length,
    链接: (noCode.match(/(?<!!)\[[^\]\n]*\]\([^)\n]*\)/g) || []).length,
    双链: (noCode.match(/\[\[[^\]\n]+\]\]/g) || []).length,
    标题: (noCode.match(/^#{1,6} /gm) || []).length,
    表格行: (noCode.match(/^\s*\|/gm) || []).length,
  };
}

function assertSameStructure(source, translated) {
  const before = structureOf(source);
  const after = structureOf(translated);
  const diff = Object.keys(before).filter((key) => before[key] !== after[key]);
  if (diff.length) {
    throw new Error(`译文结构与原文不符：${diff.map((k) => `${k} ${before[k]}→${after[k]}`).join('，')}`);
  }
}

// ---------- 降级：切段翻译 ----------

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const CJK_RE = /[一-鿿]/;

// 切段后落单的纯标点片段不含汉字、不会送去翻译，原样留下就会让英文里夹着「，」「。」。
// 审计的「零残留中文」只认汉字，抓不到它们，但读者看得见。
const FULLWIDTH = { '，': ', ', '。': '. ', '：': ': ', '；': '; ', '！': '! ', '？': '? ', '、': ', ', '（': ' (', '）': ') ' };
const toHalfwidth = (s) => s.replace(/[，。：；！？、（）]/g, (c) => FULLWIDTH[c]);

/**
 * 输出前的标点规整：全角转半角、合并连续空格。
 * 必须在 restore 之前做——那时代码、网址还是占位符，不会被误改；行内代码里的
 * 全角标点（常是文章在讨论的原话）因此原样保留。
 * 修过的故障：原文中英混排的行（如「YouTube Banner（2560×1440）」）不含汉字、不送翻译，
 * 全角括号就原样进了英文页，全站 59 行。
 */
const tidy = (s) => toHalfwidth(String(s)).replace(/ {2,}/g, ' ').trim();

/** 这一行的英文产品名在译文里是否一个不少（行级，用来决定要不要降级）。 */
function termsKeptInLine(source, translated) {
  for (const en of TERMS.values()) {
    const re = new RegExp(`\\b${escapeRe(en)}\\b`, 'g');
    if ((translated.match(re) || []).length < (source.match(re) || []).length) return false;
  }
  return true;
}

/**
 * 整行译文要不要降级。任一条成立就降级：
 *   - 占位符还原失败（翻译器吞了受保护的片段）
 *   - 产品名少了
 *   - 还有汉字（翻译器漏翻；占位符里不含汉字，所以直接查译文即可）
 * 抽成纯函数是为了能单独测：写在循环里时，「查汉字残留」这一条撤掉了测试照样全绿。
 */
function needsFallback(source, translated, protector) {
  try {
    return !termsKeptInLine(source, restore(translated, protector)) || CJK_RE.test(translated);
  } catch {
    return true;
  }
}

/**
 * 按占位符和产品名把一行切开，只把纯中文片段送去翻译，再原样拼回。
 * 受保护的东西不经过翻译器，自然吞不掉；代价是这一行失去整句上下文、
 * 译文会生硬些——所以它只是整行翻译失败后的兜底，不是默认做法。
 */
async function translateSegmented(protectedText, opts) {
  const splitter = new RegExp(`(⟦\\d+⟧|${[...TERMS.values()].map(escapeRe).join('|')})`, 'g');
  const parts = protectedText.split(splitter);   // 带捕获组：偶数位是正文，奇数位是保护片段
  const at = [];
  const texts = [];
  parts.forEach((part, i) => {
    if (i % 2 !== 0) return;              // 奇数位是保护片段，一个字都不动
    if (CJK_RE.test(part)) {
      at.push(i);
      texts.push(part);
    } else {
      parts[i] = toHalfwidth(part);
    }
  });
  const out = await translateTexts(texts, opts);
  // 英文片段两侧补空格再合并连续空格；紧贴 `![` / `](` 的多余空格由 restore 收紧
  at.forEach((pi, k) => { parts[pi] = ` ${out[k].trim()} `; });
  return parts.join('').replace(/ {2,}/g, ' ').trim();
}

// ---------- 正文翻译 ----------

/**
 * 逐行处理。正文是一段一行（实测中位 73 字符、最长 354，没有硬换行），
 * 所以按行送翻译不会切碎句子，上下文是完整的。
 */
async function translateBody(body, { dryRun }) {
  const lines = body.split('\n');
  const jobs = [];          // 送翻译的文本（已换好占位符与英文产品名）
  const jobProtectors = []; // 与 jobs 一一对应，降级时要用它判断还原是否成功
  const plan = [];          // 每行的处理方式

  let inFence = false;
  let inFooter = false;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    // 签名区块整段原样跳过，最后由 renderFooter('en') 整体替换
    if (line.includes(FOOTER_START)) inFooter = true;
    if (inFooter) {
      plan.push({ kind: 'verbatim' });
      if (line.includes(FOOTER_END)) inFooter = false;
      continue;
    }

    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      plan.push({ kind: 'verbatim' });
      continue;
    }
    if (inFence || !line.trim()) {
      plan.push({ kind: 'verbatim' });
      continue;
    }
    if (isTableSeparator(line)) {
      plan.push({ kind: 'verbatim' });
      continue;
    }

    // 表格行：按单元格分别翻，否则竖线会被当成普通标点重排
    if (/^\s*\|/.test(line)) {
      const cells = line.split('|');
      const cellJobs = [];
      cells.forEach((cell, cellIndex) => {
        if (!cell.trim()) return;
        const protector = createProtector();
        const protectedText = protectInline(cell.trim(), protector);
        // 没有中文就不送翻译——但术语可能刚被换成英文名，所以要写回还原后的文本，
        // 不能留原单元格（那样「黑粉录屏」会原样出现在英文页上）
        if (!/[一-鿿]/.test(protectedText)) {
          cellJobs.push({ cellIndex, resolved: ` ${restore(tidy(protectedText), protector)} ` });
          return;
        }
        cellJobs.push({ cellIndex, protector, jobIndex: jobs.length });
        jobs.push(protectedText);
        jobProtectors.push(protector);
      });
      plan.push({ kind: 'table', cells, cellJobs });
      continue;
    }

    const { prefix, rest } = splitLinePrefix(line);
    if (!rest.trim()) {
      plan.push({ kind: 'verbatim' });
      continue;
    }
    const protector = createProtector();
    const protectedText = protectInline(rest, protector);
    if (!/[一-鿿]/.test(protectedText)) {
      // 没有中文就不送翻译。但这里不能输出原行：术语替换后「没中文了」恰恰说明
      // 它刚被换成了英文名，原行里还是中文。修过的故障——试翻时
      // `> 黑粉科技 · 2026-10-03` 就这样原样漏到了英文页上。
      plan.push({ kind: 'resolved', text: prefix + restore(tidy(protectedText), protector) });
      continue;
    }
    plan.push({ kind: 'line', prefix, protector, jobIndex: jobs.length });
    jobs.push(protectedText);
    jobProtectors.push(protector);
  }

  const translated = await translateTexts(jobs, { dryRun });

  // 第一轮是整行翻译（上下文完整，质量最好）。逐个检查：占位符能否全部还原、
  // 产品名是否一个不少。不行的降级成切段翻译——受保护的片段根本不经过翻译器，
  // 也就不可能被吞。
  //
  // 为什么不直接重试：Azure 对同样的输入输出是确定的，重试拿到的还是同一句坏译文。
  // 全量时 3 篇就这样卡死在校验闸上，没有降级的话它们永远翻不出来。
  const fallbackLines = [];
  for (let j = 0; j < jobs.length; j += 1) {
    // dry-run 的「译文」就是带 [DRY] 前缀的原文、本身含汉字，判定会把每行都标成降级——
    // 那是假信号，干跑时不走这条路
    if (!dryRun && needsFallback(jobs[j], translated[j], jobProtectors[j])) {
      translated[j] = await translateSegmented(jobs[j], { dryRun });
      fallbackLines.push(jobs[j].replace(TOKEN_PATTERN, '…').slice(0, 60));
    }
  }

  // 某行还原失败时整篇失败，但报错精确到行：不做「这行回退成中文原文」的静默兜底——
  // 那样英文页会悄悄冒出一行中文，没人会发现；整篇失败则逼着把规则修好。
  const where = (index, error) =>
    new Error(`正文第 ${index + 1} 行：${error.message}\n    原文：${lines[index].slice(0, 120)}`);

  const out = [];
  for (let index = 0; index < lines.length; index += 1) {
    const step = plan[index];
    try {
      if (step.kind === 'verbatim') {
        out.push(lines[index]);
      } else if (step.kind === 'resolved') {
        out.push(step.text);
      } else if (step.kind === 'line') {
        out.push(step.prefix + restore(tidy(translated[step.jobIndex]), step.protector));
      } else {
        const cells = [...step.cells];
        for (const job of step.cellJobs) {
          cells[job.cellIndex] = job.resolved
            ?? ` ${restore(tidy(translated[job.jobIndex]), job.protector)} `;
        }
        out.push(cells.join('|'));
      }
    } catch (error) {
      throw where(index, error);
    }
  }
  const result = out.join('\n');
  assertSameStructure(body, result);
  // 产品名核对只看正文：代码块里的中文产品名本就不翻，签名区块之后会被整段替换，
  // 两者算进来都会误报
  const proseOnly = (text) => {
    // 行内代码也要剥：里面的产品名受保护、不会被替换（比如路径 `~/Downloads/方寸智匣/`，
    // 换了读者就找不到目录），所以也不该计数。修过的误报：不剥时全文级按整行替换计数，
    // 把行内代码里那个也算进来，报「LocalBrain 应 15 处、译文 14 处」，而译文其实是对的。
    const noCode = text.replace(/^```[\s\S]*?^```/gm, '').replace(/`[^`\n]+`/g, '');
    const s = noCode.indexOf(FOOTER_START);
    const e = noCode.indexOf(FOOTER_END);
    return s >= 0 && e > s ? noCode.slice(0, s) + noCode.slice(e + FOOTER_END.length) : noCode;
  };
  assertTermsPreserved(proseOnly(body), proseOnly(result));
  return { text: result, fallbackLines };
}

// ---------- frontmatter ----------

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error('没有 frontmatter');
  return { fmText: match[1], body: match[2] };
}

function readScalar(fmText, key) {
  const m = fmText.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  if (!m) return '';
  return m[1].trim().replace(/^["']|["']$/g, '');
}

function readList(fmText, key) {
  // 内联写法（含空数组 `tags: []`）。修过的故障：原来只认多行写法，三篇 `tags: []` 被读成
  // 空列表后输出成光秃秃的 `tags:`——YAML 里那是 null 不是数组，内容校验直接拦下发布。
  const inline = fmText.match(new RegExp(`^${key}:\\s*\\[(.*)\\]\\s*$`, 'm'));
  if (inline) {
    return inline[1].split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  }
  const m = fmText.match(new RegExp(`^${key}:\\n((?:\\s+-\\s+.*\\n?)+)`, 'm'));
  if (!m) return [];
  return m[1].trim().split('\n').map((l) => l.trim().replace(/^-\s*/, '').replace(/^["']|["']$/g, ''));
}

/** 空列表必须写成 `key: []`；只写 `key:` 在 YAML 里是 null。 */
function yamlList(key, items) {
  return items.length ? [`${key}:`, ...items.map((item) => `  - ${item}`)] : [`${key}: []`];
}

function yamlString(value) {
  return JSON.stringify(String(value));   // JSON 字符串是合法 YAML 标量，省去自己处理引号转义
}

/** 正文里的 ../preview-assets/... 在译文里必须换成线上绝对地址：
 *  译文和原文共用素材，而相对路径是按原文 slug 解析的，译文页会 404。 */
function absolutizeAssets(text) {
  // 先统一成站内路径，再只给「路径开头」的那个补域名。
  // 修过的故障：原来是两步各自替换，第一步产出的 https://hyphentech.top/obsidian-assets/
  // 里的 /obsidian-assets/ 又被第二步当成相对路径再补一次，得到
  // https://hyphentech.tophttps://hyphentech.top/obsidian-assets/…，连 cover 都坏了。
  return text
    .replace(/\.\.\/preview-assets\//g, '/obsidian-assets/')
    .replace(/(^|[\s("'=])\/obsidian-assets\//gm, `$1${SITE_BASE}/obsidian-assets/`);
}

let identityCache = null;
function englishFooter() {
  if (!identityCache) identityCache = JSON.parse(fs.readFileSync(IDENTITY_PATH, 'utf8'));
  return renderFooter(identityCache, 'en');
}

/** 把签名区块整段换成英文版。原文没有签名区块就原样返回（不硬塞一个进去）。 */
function replaceFooter(body) {
  const start = body.indexOf(FOOTER_START);
  const end = body.indexOf(FOOTER_END);
  if (start < 0 || end < 0 || end < start) return body;
  return body.slice(0, start) + englishFooter() + body.slice(end + FOOTER_END.length);
}

// ---------- 主流程 ----------

function listPosts() {
  return fs.readdirSync(POSTS_DIR)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const full = path.join(POSTS_DIR, name);
      const raw = fs.readFileSync(full, 'utf8');
      let fm;
      try { fm = parseFrontmatter(raw); } catch { return null; }
      return {
        file: name,
        fullPath: full,
        raw,
        ...fm,
        slug: readScalar(fm.fmText, 'slug') || name.replace(/\.md$/, ''),
        status: readScalar(fm.fmText, 'status'),
        lang: readScalar(fm.fmText, 'lang') || 'zh-CN',
        translationOf: readScalar(fm.fmText, 'translation_of'),
        translationSource: readScalar(fm.fmText, 'translation_source'),
        sourceHash: readScalar(fm.fmText, 'source_sha256'),
      };
    })
    .filter(Boolean);
}

function sourceHashOf(post) {
  return crypto.createHash('sha256')
    .update(`${readScalar(post.fmText, 'title')}\n${post.body}`)
    .digest('hex')
    .slice(0, 16);
}

function planWork(posts, { force }) {
  const byTranslation = new Map();
  for (const post of posts) {
    if (post.translationOf && post.lang === 'en') byTranslation.set(post.translationOf, post);
  }

  const todo = [];
  const skipped = [];
  for (const post of posts) {
    if (post.lang !== 'zh-CN' || post.translationOf || post.status !== 'published') continue;
    const existing = byTranslation.get(post.slug);
    if (existing) {
      if (existing.translationSource !== 'machine') {
        skipped.push({ post, why: '已有人工译文，不覆盖' });
        continue;
      }
      if (!force && existing.sourceHash === sourceHashOf(post)) {
        skipped.push({ post, why: '机翻版已是最新' });
        continue;
      }
      todo.push({ post, existing, reason: force ? '强制重译' : '原文已改动' });
    } else {
      todo.push({ post, existing: null, reason: '尚无英文版' });
    }
  }
  todo.sort((a, b) => String(readScalar(b.post.fmText, 'date')).localeCompare(readScalar(a.post.fmText, 'date')));
  return { todo, skipped };
}

async function translatePost(post, { dryRun }) {
  const title = readScalar(post.fmText, 'title');
  const summary = readScalar(post.fmText, 'summary');
  const categories = readList(post.fmText, 'categories');
  const tags = readList(post.fmText, 'tags');

  // 标题与摘要也要保护术语，否则「黑粉录屏」会被意译成别的词
  const titleProtector = createProtector();
  const summaryProtector = createProtector();
  // 产品名当标签用时也走术语表（「黑粉录屏」→ HyphenScreen），不交给 API 意译
  const pendingTags = tags.filter((t) => /[一-鿿]/.test(t) && !TAG_MAP.has(t) && !TERMS.has(t));

  const [translatedTitle, translatedSummary, ...translatedTags] = await translateTexts([
    protectInline(title, titleProtector),
    protectInline(summary, summaryProtector),
    ...pendingTags,
  ], { dryRun });

  const tagTranslations = new Map(pendingTags.map((tag, i) => [tag, translatedTags[i]]));
  const { text: body, fallbackLines } = await translateBody(post.body, { dryRun });

  const mapCategory = (c) => CATEGORY_MAP.get(c) || c;
  const mapTag = (t) => TAG_MAP.get(t) || TERMS.get(t) || tagTranslations.get(t) || t;

  const cover = readScalar(post.fmText, 'cover');
  const lines = [
    '---',
    `title: ${yamlString(restore(tidy(translatedTitle), titleProtector))}`,
    `slug: ${post.slug}-en`,
    'status: published',
    'lang: en',
    `translation_of: ${post.slug}`,
    'translation_source: machine',
    `source_sha256: ${sourceHashOf(post)}`,
    `date: ${readScalar(post.fmText, 'date')}`,
    `updated: ${new Date().toISOString().slice(0, 10)}`,
    `summary: ${yamlString(restore(tidy(translatedSummary), summaryProtector))}`,
    ...yamlList('categories', categories.map(mapCategory)),
    ...yamlList('tags', tags.map(mapTag)),
    `cover: ${absolutizeAssets(cover)}`,
    `brand_slogan: ${readScalar(post.fmText, 'brand_slogan')}`,
    'legacy_paths: []',
    '---',
    '',
    MT_NOTICE(post.slug),
    '',
    replaceFooter(absolutizeAssets(body)).replace(/^\n+/, ''),
  ];
  return { content: lines.join('\n'), unknownTags: pendingTags, fallbackLines };
}

async function main() {
  const argv = process.argv.slice(2);
  const has = (flag) => argv.includes(flag);
  const valueOf = (flag) => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : '';
  };

  const dryRun = has('--dry-run');
  const force = has('--force');
  const posts = listPosts();
  const { todo, skipped } = planWork(posts, { force });

  let work = todo;
  const slug = valueOf('--slug');
  // 支持逗号分隔多篇：放在同一个进程里跑，限速窗口才是共享的；分成多个进程各自限速，
  // 前一个刚发完一大批，下一个一启动就会撞 429。
  if (slug) {
    const wanted = new Set(slug.split(',').map((s) => s.trim()).filter(Boolean));
    work = todo.filter((item) => wanted.has(item.post.slug));
  }
  const limit = Number(valueOf('--limit'));
  if (limit > 0) work = work.slice(0, limit);

  if (has('--list') || (!slug && !limit && !has('--all'))) {
    console.log(`待翻译 ${todo.length} 篇：`);
    for (const item of todo.slice(0, 100)) {
      console.log(`  ${item.post.slug}  （${item.reason}）`);
    }
    if (skipped.length) {
      console.log(`\n跳过 ${skipped.length} 篇：`);
      const grouped = new Map();
      for (const s of skipped) grouped.set(s.why, (grouped.get(s.why) || 0) + 1);
      for (const [why, n] of grouped) console.log(`  ${why}：${n} 篇`);
      for (const s of skipped.filter((x) => x.why === '已有人工译文，不覆盖')) {
        console.log(`    · ${s.post.slug}`);
      }
    }
    console.log(`\n翻译：--slug <slug> / --limit <n> / --all（加 --dry-run 不写盘不调 API）`);
    return;
  }

  if (!work.length) {
    console.log('没有需要翻译的文章。');
    return;
  }

  const unknown = new Set();
  for (const [index, item] of work.entries()) {
    const label = `[${index + 1}/${work.length}] ${item.post.slug}`;
    process.stdout.write(`${label} … `);
    try {
      const { content, unknownTags, fallbackLines } = await translatePost(item.post, { dryRun });
      unknownTags.forEach((t) => unknown.add(t));
      const out = path.join(POSTS_DIR, `${item.post.slug}-en.md`);
      if (dryRun) {
        console.log(`干跑完成（${content.length} 字符，未写盘）`);
      } else {
        fs.writeFileSync(out, content);
        const note = fallbackLines.length ? `，${fallbackLines.length} 行降级为切段翻译` : '';
        console.log(`已写入 ${path.basename(out)}（${content.length} 字符${note}）`);
        for (const line of fallbackLines) console.log(`      ↳ ${line}`);
      }
    } catch (error) {
      console.log(`失败：${error.message}`);
      process.exitCode = 1;
    }
  }

  if (unknown.size) {
    console.log(`\n这些中文标签不在 TAG_MAP 里，用的是 API 直译，建议补进表里固定下来：`);
    for (const tag of unknown) console.log(`  ${tag}`);
  }
}

// 被 require 时不跑主流程，方便测试直接调用这些纯函数，而不是复刻一份逻辑去测
if (require.main === module) {
  main().catch((error) => {
    console.error(`失败：${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  createProtector, protectInline, restore, structureOf, assertSameStructure, absolutizeAssets,
  readList, yamlList, halfInBrackets,
  replaceTerms, assertTermsPreserved, termsKeptInLine, translateSegmented, pangu, tidy, needsFallback,
};
