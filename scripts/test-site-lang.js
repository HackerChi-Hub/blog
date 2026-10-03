#!/usr/bin/env node
'use strict';

/**
 * 语言偏好与自动跳转的回归测试。
 * 最后一组直接执行内联进 <head> 的那段脚本字符串——测的是浏览器里真正跑的东西。
 */

const assert = require('assert');
const vm = require('vm');
const {
  redirectByPreference, alternatesFor, preferenceScript, LANG_KEY,
} = require('../lib/site-lang.cjs');

let passed = 0;
const check = (name, fn) => { fn(); passed += 1; console.log(`  ✓ ${name}`); };

const CHROME = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/130.0 Safari/537.36';
const ZH_HOME = { 'zh-CN': '/', en: '/en/' };

/** 假 window：记录 location.replace 有没有被调用、跳去哪。 */
function fakeWindow({ pageLang = 'zh-CN', path = '/', stored = null, languages = ['zh-CN'], ua = CHROME, storageThrows = false } = {}) {
  const win = {
    replaced: null,
    navigator: { userAgent: ua, languages, language: languages[0] },
    document: { documentElement: { getAttribute: (k) => (k === 'lang' ? pageLang : null) } },
    location: { pathname: path, search: '', hash: '', replace(url) { win.replaced = url; } },
    localStorage: {
      getItem: (k) => { if (storageThrows) throw new Error('SecurityError'); return k === LANG_KEY ? stored : null; },
    },
  };
  return win;
}

console.log('用户的选择：');

check('选过英文，打开中文首页 → 去英文首页', () => {
  const w = fakeWindow({ stored: 'en' });
  assert.strictEqual(redirectByPreference(w, ZH_HOME), '/en/');
  assert.strictEqual(w.replaced, '/en/');
});

check('选过中文，打开英文首页 → 回中文首页（即使浏览器是英文的）', () => {
  const w = fakeWindow({ pageLang: 'en', path: '/en/', stored: 'zh-CN', languages: ['en-US'] });
  assert.strictEqual(redirectByPreference(w, ZH_HOME), '/');
});

check('已经在想要的语言上 → 不动', () => {
  const w = fakeWindow({ stored: 'zh-CN' });
  assert.strictEqual(redirectByPreference(w, ZH_HOME), null);
  assert.strictEqual(w.replaced, null);
});

console.log('\n没选过，看浏览器语言：');

check('纯英文浏览器 → 英文', () => {
  assert.strictEqual(redirectByPreference(fakeWindow({ languages: ['en-US', 'en'] }), ZH_HOME), '/en/');
});

check('英文系统但列表里有中文（大量中文读者是这样）→ 留在中文', () => {
  assert.strictEqual(redirectByPreference(fakeWindow({ languages: ['en-US', 'zh-CN'] }), ZH_HOME), null);
});

check('日文、德文等非中非英浏览器 → 英文（比中文更可能读得懂）', () => {
  assert.strictEqual(redirectByPreference(fakeWindow({ languages: ['ja-JP'] }), ZH_HOME), '/en/');
});

check('繁体浏览器打开简体页 → 不动（同属中文）', () => {
  assert.strictEqual(redirectByPreference(fakeWindow({ languages: ['zh-TW'] }), ZH_HOME), null);
});

check('【这条规则真正防的情况】人在繁体页上、偏好是中文 → 不被推回简体', () => {
  const w = fakeWindow({ pageLang: 'zh-TW', path: '/a-zh-tw/', stored: 'zh-CN' });
  assert.strictEqual(redirectByPreference(w, { 'zh-CN': '/a/', en: '/a-en/', 'zh-TW': '/a-zh-tw/' }), null);
});

check('隐私模式读不到存储 → 退回看浏览器语言，不报错', () => {
  assert.strictEqual(redirectByPreference(fakeWindow({ storageThrows: true, languages: ['en-US'] }), ZH_HOME), '/en/');
});

console.log('\n绝不能跳的情况：');

for (const [name, ua] of [
  ['Googlebot', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'],
  ['Bingbot', 'Mozilla/5.0 (compatible; bingbot/2.0)'],
  ['百度蜘蛛', 'Mozilla/5.0 (compatible; Baiduspider/2.0)'],
  ['无头 Chrome（预渲染服务）', 'Mozilla/5.0 HeadlessChrome/130.0'],
]) {
  check(`【已知阳性】${name} 即使语言是英文、甚至存了英文偏好，也不跳`, () => {
    const w = fakeWindow({ ua, stored: 'en', languages: ['en-US'] });
    assert.strictEqual(redirectByPreference(w, ZH_HOME), null);
    assert.strictEqual(w.replaced, null);
  });
}

check('这页没有对应的英文版 → 不跳（不制造 404）', () => {
  assert.strictEqual(redirectByPreference(fakeWindow({ stored: 'en' }), { 'zh-CN': '/x/' }), null);
});

check('目标就是当前路径 → 不跳（防死循环）', () => {
  const w = fakeWindow({ pageLang: 'zh-CN', path: '/en/', stored: 'en' });
  assert.strictEqual(redirectByPreference(w, ZH_HOME), null);
});

check('没有 alternates（如工具页）→ 不跳', () => {
  assert.strictEqual(redirectByPreference(fakeWindow({ stored: 'en' }), null), null);
});

console.log('\n各页的语言版本：');

check('首页与英文首页互为对应', () => {
  assert.deepStrictEqual(alternatesFor({ page: '/' }), ZH_HOME);
  assert.deepStrictEqual(alternatesFor({ page: '/en' }), ZH_HOME);
});

check('分页互为对应，页码一致', () => {
  assert.deepStrictEqual(alternatesFor({ page: '/page/[page]', query: { page: '3' } }), { 'zh-CN': '/page/3/', en: '/en/page/3/' });
});

check('文章取自它的译文组', () => {
  const alt = alternatesFor({
    page: '/[slug]',
    pageProps: { translations: [{ slug: 'a', lang: 'zh-CN' }, { slug: 'a-en', lang: 'en' }, { slug: 'a-zh-tw', lang: 'zh-TW' }] },
  });
  assert.deepStrictEqual(alt, { 'zh-CN': '/a/', en: '/a-en/', 'zh-TW': '/a-zh-tw/' });
});

check('没有译文的文章、工具页 → 没有对应版本', () => {
  assert.strictEqual(alternatesFor({ page: '/[slug]', pageProps: { translations: [{ slug: 'a', lang: 'zh-CN' }] } }), null);
  assert.strictEqual(alternatesFor({ page: '/radar' }), null);
});

console.log('\n内联脚本（浏览器里真正跑的那段）：');

check('脚本字符串能独立执行，并做出同样的决定', () => {
  const w = fakeWindow({ stored: 'en' });
  vm.runInNewContext(preferenceScript(ZH_HOME), { window: w });
  assert.strictEqual(w.replaced, '/en/');
});

check('脚本字符串遇到爬虫同样不跳', () => {
  const w = fakeWindow({ ua: 'Googlebot/2.1', stored: 'en' });
  vm.runInNewContext(preferenceScript(ZH_HOME), { window: w });
  assert.strictEqual(w.replaced, null);
});

check('路径里出现 </script> 也截不断脚本', () => {
  const s = preferenceScript({ 'zh-CN': '/</script><script>alert(1)//', en: '/en/' });
  assert(!s.includes('</script>'), s);
});

check('脚本运行出错也不抛出（不能让页面打不开）', () => {
  assert.doesNotThrow(() => vm.runInNewContext(preferenceScript(ZH_HOME), { window: {} }));
});

console.log(`\n通过 ${passed} 项`);
