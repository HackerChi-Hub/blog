'use strict';

/**
 * 站点语言偏好：中文 / 英文的全局切换与首访自动识别。
 *
 * 站点是静态导出，没有服务端能按请求头分流，所以识别只能在浏览器里做。规则：
 *
 * 1) 用户自己点过的选择永远优先（存在 localStorage，只影响这一台浏览器）。
 * 2) 没点过就看浏览器语言：语言列表里只要有任何一项是中文就留在中文，
 *    一项中文都没有才去英文。不只看第一项，是因为大量中文读者用英文系统，
 *    列表是 ['en-US', 'zh-CN']——把核心读者误判成英文的代价，比反过来大得多；
 *    英文读者被留在中文页，点一下就能切。
 * 3) 搜索引擎爬虫一律不跳转。Google 的爬虫以 en-US 出现，被跳走的话，所有中文页
 *    在它眼里都会变成「重定向到英文」，中文页可能被移出索引。
 *
 * 跳转决定写成一个不依赖任何外部变量的纯函数，内联进页面 <head> 的脚本就是它的
 * toString()——测试调用的和浏览器里跑的是同一段代码，不是复刻的另一份。
 */

const LANG_KEY = 'hyphentech:lang';
const SITE = 'https://hyphentech.top';

/**
 * 根据偏好决定要不要跳到另一种语言的版本。
 * 必须自包含：它会被 toString() 原样塞进 <head>，不能引用本模块里的任何东西。
 *
 * @param {Window} win        浏览器的 window（测试时传假的）
 * @param {Object} alternates 本页各语言版本的路径，如 { 'zh-CN': '/x/', en: '/x-en/' }
 * @returns {string|null}     跳转目标；不跳返回 null
 */
function redirectByPreference(win, alternates) {
  try {
    var nav = win.navigator || {};
    var ua = nav.userAgent || '';
    // 爬虫、预渲染服务、无头浏览器都不跳：它们看到的应该是页面本来的语言
    if (/bot|crawl|spider|slurp|mediapartners|bingpreview|facebookexternalhit|embedly|pinterest|vkshare|whatsapp|telegram|baidu|yandex|sogou|bytespider|petalbot|headless|lighthouse|prerender|preview/i.test(ua)) {
      return null;
    }
    if (!alternates) return null;

    var want = null;
    try {
      var stored = win.localStorage.getItem('hyphentech:lang');
      if (stored === 'en' || stored === 'zh-CN') want = stored;
    } catch (e) {
      // 隐私模式下读不到存储，就当没选过，走浏览器语言
    }
    if (!want) {
      var langs = nav.languages && nav.languages.length ? nav.languages : [nav.language || ''];
      var anyChinese = false;
      for (var i = 0; i < langs.length; i += 1) {
        if (/^zh\b/i.test(String(langs[i] || ''))) anyChinese = true;
      }
      want = anyChinese ? 'zh-CN' : 'en';
    }

    // 按语系比较：繁体页对「中文」偏好算已满足，不把繁体读者硬推回简体
    var current = String(win.document.documentElement.getAttribute('lang') || 'zh-CN').toLowerCase();
    var wantFamily = want === 'en' ? 'en' : 'zh';
    if (current.indexOf(wantFamily) === 0) return null;

    var target = alternates[want];
    if (!target) return null;
    if (target === win.location.pathname) return null;   // 防自跳死循环

    win.location.replace(target + (win.location.search || '') + (win.location.hash || ''));
    return target;
  } catch (e) {
    return null;   // 这段脚本出任何错都不能让页面打不开
  }
}

/** 用户点了切换：记住选择。语系归一，繁体也记为「中文」。 */
function rememberLang(lang) {
  try {
    window.localStorage.setItem(LANG_KEY, /^zh/i.test(String(lang)) ? 'zh-CN' : 'en');
  } catch (e) {
    // 存不进去就只影响下次访问，这次的跳转照常发生
  }
}

/**
 * 当前页有哪些语言版本。只算真正存在对应版本的页面；返回 null 表示这页没有切换目标。
 * 由 _document 调用：hreflang 标签和跳转脚本都从这一处取，两者不会对不上。
 */
function alternatesFor({ page, query = {}, pageProps = {} }) {
  if (page === '/' || page === '/en') return { 'zh-CN': '/', en: '/en/' };
  if (page === '/page/[page]' || page === '/en/page/[page]') {
    const n = String(query.page || pageProps.currentPage || '');
    if (!/^\d+$/.test(n)) return null;
    return { 'zh-CN': `/page/${n}/`, en: `/en/page/${n}/` };
  }
  if (page === '/[slug]') {
    const group = Array.isArray(pageProps.translations) ? pageProps.translations : [];
    if (group.length < 2) return null;
    const out = {};
    for (const item of group) if (item && item.slug && item.lang) out[item.lang] = `/${item.slug}/`;
    return out['zh-CN'] ? out : null;
  }
  return null;
}

/** 内联进 <head> 的脚本。JSON 里的 < 转义掉，防止路径里意外出现的 </script> 截断脚本。 */
function preferenceScript(alternates) {
  const data = JSON.stringify(alternates).replace(/</g, '\\u003c');
  return `(${redirectByPreference.toString()})(window, ${data});`;
}

/** 首页与列表页的地址。 */
const homeHref = (lang) => (lang === 'en' ? '/en/' : '/');
const listHref = (lang, page) => (lang === 'en' ? `/en/page/${page}/` : `/page/${page}/`);

module.exports = {
  LANG_KEY,
  SITE,
  redirectByPreference,
  rememberLang,
  alternatesFor,
  preferenceScript,
  homeHref,
  listHref,
};
