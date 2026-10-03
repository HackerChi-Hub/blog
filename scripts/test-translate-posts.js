#!/usr/bin/env node
'use strict';

/**
 * 翻译脚本的回归测试。不调 Azure、不碰文章，只测保护/还原/校验这几道闸。
 *
 * 每道闸都配一个「已知阳性」：用试翻时真实出现过的故障形态去打它，确认它会报错。
 * 只测通过路径的话，闸门坏了也是全绿——占位符计数那道闸就是这样，计数一个不少，
 * 26 张图却已经全碎了。
 */

const assert = require('assert');
const {
  createProtector, protectInline, restore, structureOf, assertSameStructure, absolutizeAssets,
  replaceTerms, assertTermsPreserved, termsKeptInLine, translateSegmented, pangu, tidy, needsFallback,
  readList, yamlList, halfInBrackets,
} = require('./translate-posts.js');

let passed = 0;
const check = (name, fn) => {
  fn();
  passed += 1;
  console.log(`  ✓ ${name}`);
};

console.log('占位符保护与还原：');

check('行内代码、链接地址、产品名都被保护且原样还原', () => {
  const p = createProtector();
  const line = '运行 `npm i`，详见 [文档](https://x.dev/a)，黑粉录屏 支持';
  const shielded = protectInline(line, p);
  assert(!shielded.includes('npm i'), '行内代码应已被换掉');
  assert(!shielded.includes('https://x.dev/a'), '链接地址应已被换掉');
  assert(!shielded.includes('黑粉录屏'), '产品名应已被换掉');
  assert.strictEqual(restore(shielded, p).includes('HyphenScreen'), true, '产品名应还原成英文名');
});

check('图片的 ![ 与 ](url) 整段藏进占位符，翻译器碰不到语法', () => {
  const p = createProtector();
  const shielded = protectInline('![编辑器截图](../preview-assets/x/a.png)', p);
  assert(!shielded.includes('!['), '`![` 必须被藏起来——否则会被译成 `! [`');
  assert(!shielded.includes(']('), '`](` 必须被藏起来');
  assert(shielded.includes('编辑器截图'), 'alt 要留给翻译器');
});

check('图片不会被链接规则再处理一遍（无嵌套占位符）', () => {
  const p = createProtector();
  const shielded = protectInline('![截图](a.png)', p);
  assert(!p.slots.some((s) => /⟦\d+⟧/.test(s)), `出现了嵌套占位符：${JSON.stringify(p.slots)}`);
  assert.strictEqual(restore(shielded.replace('截图', 'Screenshot'), p), '![Screenshot](a.png)');
});

check('【已知阳性】翻译器吞掉一个占位符时必须报错', () => {
  const p = createProtector();
  const shielded = protectInline('详见 [文档](https://x.dev/a)', p);
  const mangled = shielded.replace(/⟦\d+⟧/, '');   // 模拟翻译器吞掉一个
  assert.throws(() => restore(mangled, p), /丢失/);
});

check('还原后收紧翻译器塞进结构标记两侧的空格', () => {
  const p = createProtector();
  const shielded = protectInline('![截图](a.png)', p);
  const withSpaces = shielded.replace('截图', ' Screenshot ');
  assert.strictEqual(restore(withSpaces, p), '![Screenshot](a.png)');
});

console.log('\n产品名：');

check('产品名直接换成英文名送翻译，不用占位符（否则翻译器看不到主语）', () => {
  const p = createProtector();
  const shielded = protectInline('黑粉录屏有一条独立的动画轨', p);
  // 产品名换成英文后，中英交界还会补一个空格（盘古之白）
  assert.strictEqual(shielded, 'HyphenScreen 有一条独立的动画轨');
  assert.strictEqual(p.slots.length, 0, '产品名不该占用占位符');
});

check('中英并列合并成一个，不产生「HyphenScreen（HyphenScreen）」', () => {
  assert.strictEqual(replaceTerms('黑粉录屏（HyphenScreen）很好用'), 'HyphenScreen很好用');
  assert.strictEqual(replaceTerms('黑粉盒子 HyphenBox'), 'HyphenBox');
  assert.strictEqual(replaceTerms('黑粉录屏 和 方寸智匣'), 'HyphenScreen 和 LocalBrain');
});

check('【已知阳性】翻译器吞掉一个产品名时必须报错', () => {
  const src = '黑粉录屏和方寸智匣都免费';
  assert.throws(() => assertTermsPreserved(src, 'HyphenScreen and are both free'), /LocalBrain/);
});

check('【全量真实形态】行内代码里的产品名是路径，必须原样保留，不能被换成英文名', () => {
  const p = createProtector();
  const out = restore(protectInline('成品在 `~/Downloads/方寸智匣/系统输出/`', p), p);
  assert(out.includes('`~/Downloads/方寸智匣/系统输出/`'), `路径被改了，读者会找不到目录：${out}`);
});

check('产品名齐全时放行', () => {
  assertTermsPreserved('黑粉录屏和方寸智匣', 'HyphenScreen and LocalBrain');
});

console.log('\n网址、空格与标点：');

check('【全量真实形态】网址遇到全角标点就截断，后面的中文留给翻译', () => {
  const p = createProtector();
  const shielded = protectInline('入口是 https://aihubmix.com/v1；需要注册并创建自己的 API Key', p);
  assert(shielded.includes('需要注册'), `中文被吞进了网址占位符：${shielded}`);
  assert(p.slots.includes('https://aihubmix.com/v1'), `网址没被完整保护：${JSON.stringify(p.slots)}`);
});

check('【全量真实形态】中英交界补空格，「#28133尚未合并」不再被当成一个编号', () => {
  assert.strictEqual(pangu('上游PR #28133尚未合并'), '上游 PR #28133 尚未合并');
});

check('补空格不碰占位符', () => {
  assert.strictEqual(pangu('运行⟦0⟧即可'), '运行⟦0⟧即可');
});

check('【全量真实形态】中英混排的全角括号转半角（原文无汉字的行不送翻译，以前会原样漏到英文页）', () => {
  assert.strictEqual(tidy('YouTube Banner（2560×1440）'), 'YouTube Banner (2560×1440)');
});

check('标点规整在还原之前做：行内代码里的全角标点原样保留', () => {
  const p = createProtector();
  const shielded = protectInline('模型留下了 `// 由于代码量很大，将在后续继续`。', p);
  const out = restore(tidy(shielded), p);
  assert(out.includes('`// 由于代码量很大，将在后续继续`'), out);
});

check('【全量真实形态】无汉字的链接文字整条保护，但全角标点照样转半角、地址不动', () => {
  const p = createProtector();
  const src = '- [prism-ml/Bonsai-gguf（Hugging Face）](https://hf.co/x（y）)';
  const out = restore(tidy(protectInline(src, p)), p);
  assert(out.includes('[prism-ml/Bonsai-gguf (Hugging Face)]'), out);
  assert(out.includes('(https://hf.co/x（y）)'), `地址被改了：${out}`);
});

check('【全量真实形态】Obsidian 双链的 slug 一个字符都不送翻译', () => {
  const p = createProtector();
  const shielded = protectInline('详见[[minicpm5-2b-localbrain]]这篇', p);
  assert(!shielded.includes('minicpm5'), `slug 暴露给了翻译器：${shielded}`);
  assert.strictEqual(restore(shielded, p).includes('[[minicpm5-2b-localbrain]]'), true);
});

check('双链显示文字有中文时留给翻译，slug 仍受保护', () => {
  const p = createProtector();
  const shielded = protectInline('[[minicpm5-2b-localbrain|小模型实测]]', p);
  assert(shielded.includes('小模型实测') && !shielded.includes('minicpm5'), shielded);
});

check('【全量真实形态】内联空数组 `tags: []` 读成空列表，写回仍是 `[]` 而不是 null', () => {
  assert.deepStrictEqual(readList('tags: []', 'tags'), []);
  assert.deepStrictEqual(yamlList('tags', []), ['tags: []']);
  assert.deepStrictEqual(readList('tags: [AI, 工具]', 'tags'), ['AI', '工具']);
});

check('结构校验数双链：双链被拆坏时必须报错', () => {
  assert.throws(() => assertSameStructure('见 [[a-b]]', '见 [a-b]'), /双链/);
});

console.log('\n结构校验：');

const SOURCE = [
  '## 标题',
  '![图一](a.png)',
  '见 [链接](https://x.dev)',
  '```js',
  'const a = 1;',
  '```',
  '| 列1 | 列2 |',
].join('\n');

check('结构一致时放行', () => {
  const good = SOURCE.replace('标题', 'Title').replace('图一', 'Figure').replace('链接', 'link');
  assertSameStructure(SOURCE, good);
});

check('【已知阳性】`![` 被拆成 `! [` 时必须报错（试翻时 26 张图就是这样碎的）', () => {
  const broken = SOURCE.replace('![图一]', '! [Figure]');
  assert.throws(() => assertSameStructure(SOURCE, broken), /图片 1→0/);
});

check('【已知阳性】代码块围栏丢失时必须报错', () => {
  const broken = SOURCE.replace('```js', '');
  assert.throws(() => assertSameStructure(SOURCE, broken), /代码块/);
});

check('【已知阳性】标题井号被吃掉时必须报错', () => {
  const broken = SOURCE.replace('## 标题', 'Title');
  assert.throws(() => assertSameStructure(SOURCE, broken), /标题 1→0/);
});

check('代码块里的 [x](y) 不计入链接（否则含示例代码的文章会误报）', () => {
  const s = '```\n[a](b)\n```';
  assert.strictEqual(structureOf(s).链接, 0);
});

console.log('\n素材地址：');

check('相对路径补成绝对地址', () => {
  assert.strictEqual(
    absolutizeAssets('![a](../preview-assets/s/x.png)'),
    '![a](https://hyphentech.top/obsidian-assets/s/x.png)'
  );
});

check('【已知阳性】已是绝对地址的不能再补一次域名（试翻时 cover 就坏在这）', () => {
  const abs = 'https://hyphentech.top/obsidian-assets/s/x.png';
  assert.strictEqual(absolutizeAssets(abs), abs);
  assert.strictEqual(absolutizeAssets(`cover: ${abs}`), `cover: ${abs}`);
  assert(!absolutizeAssets(`![a](${abs})`).includes('tophttps'), '出现了重复拼接的域名');
});

check('frontmatter 里的相对 cover 也会被补全', () => {
  assert.strictEqual(
    absolutizeAssets('../preview-assets/s/cover.jpg'),
    'https://hyphentech.top/obsidian-assets/s/cover.jpg'
  );
});

// 降级路径需要 await，放在最后统一跑
(async () => {
  console.log('\n降级（整行翻译失败后的切段翻译）：');

  check('降级判定：正常译文不降级', () => {
    const p = createProtector();
    const src = protectInline('运行 `npm i` 即可', p);
    assert.strictEqual(needsFallback(src, src.replace('运行', 'Run').replace('即可', 'and done'), p), false);
  });
  check('【已知阳性】降级判定：占位符被吞 → 降级', () => {
    const p = createProtector();
    const src = protectInline('运行 `npm i` 即可', p);
    assert.strictEqual(needsFallback(src, 'Run and done', p), true);
  });
  check('【全量真实形态】降级判定：还有汉字（翻译器漏翻）→ 降级', () => {
    const p = createProtector();
    const src = protectInline('上游 PR #28133 尚未合并', p);
    assert.strictEqual(needsFallback(src, 'upstream PR #28133尚未合并', p), true);
  });
  check('【已知阳性】降级判定：产品名丢了 → 降级', () => {
    const p = createProtector();
    const src = protectInline('黑粉录屏和方寸智匣', p);
    assert.strictEqual(needsFallback(src, 'HyphenScreen and it', p), true);
  });

  check('行级产品名检查：少一个就判失败', () => {
    assert.strictEqual(termsKeptInLine('HyphenScreen 和 LocalBrain', 'HyphenScreen and LocalBrain'), true);
    assert.strictEqual(termsKeptInLine('HyphenScreen 和 LocalBrain', 'HyphenScreen and it'), false);
  });

  // dry-run 下 translateTexts 只给每段加 [DRY] 前缀，不调 API——正好用来观察切段边界
  const out = await translateSegmented('写你要的画面⟦0⟧，HyphenScreen 放进⟦1⟧。', { dryRun: true });
  check('切段翻译：占位符一个不少地原样留下', () => {
    assert(out.includes('⟦0⟧') && out.includes('⟦1⟧'), out);
  });
  check('切段翻译：产品名不送翻译、原样留下', () => {
    assert(out.includes('HyphenScreen') && !/\[DRY\][^⟦]*HyphenScreen/.test(out), out);
  });
  check('切段翻译：只有含汉字的片段被送去翻译（纯标点片段不送）', () => {
    // 「写你要的画面」「 放进」两段；「，」「。」是标点不是汉字
    assert.strictEqual((out.match(/\[DRY\]/g) || []).length, 2, out);
  });
  check('切段翻译：落单的全角标点转成半角，不留在英文里', () => {
    assert(!/[，。]/.test(out), `仍有全角标点：${out}`);
  });

  const img = await translateSegmented('⟦0⟧# 422 个在册模型⟦1⟧', { dryRun: true });
  check('【试翻真实形态】alt 以 # 开头的图片，降级后结构标记仍在两端', () => {
    assert(img.startsWith('⟦0⟧') && img.endsWith('⟦1⟧'), img);
  });

  console.log(`\n通过 ${passed} 项`);
})();
