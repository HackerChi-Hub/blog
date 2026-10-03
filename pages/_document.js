import { Html, Head, Main, NextScript } from 'next/document';
import { normalizeUiLang } from '../lib/blog-i18n.cjs';
import { alternatesFor, preferenceScript, SITE } from '../lib/site-lang.cjs';

// 页面语言写进 <html lang>：文章页取 frontmatter 的 lang（译文是 en / zh-TW），其余页面都是简体。
// 静态导出时每个页面各跑一次，__NEXT_DATA__ 里就是这一页的 props。
// 站内用 next/link 跳转时不会重跑这里，由 _app.js 同步 document.documentElement.lang。
//
// 本页的各语言版本只在这里算一次，同时产出两样东西：
//   · hreflang 标签——告诉搜索引擎这些是同一内容的不同语言版本；
//   · 偏好跳转脚本——按读者的选择或浏览器语言，跳到对应版本。
// 两者同源，不会出现「标签说有英文版、脚本却跳不过去」之类的对不上。
// 脚本把目标地址直接带在自己身上，不去页面里找 <link> 标签，所以不依赖它们在 <head> 里的先后。
export default function Document({ __NEXT_DATA__ }) {
  const pageProps = __NEXT_DATA__?.props?.pageProps || {};
  const lang = normalizeUiLang(pageProps?.meta?.lang);
  const alternates = alternatesFor({
    page: __NEXT_DATA__?.page,
    query: __NEXT_DATA__?.query,
    pageProps,
  });

  return (
    <Html lang={lang}>
      <Head>
        {alternates && (
          <script
            // 放在 <head> 最前面、同步执行：读者在看到错误语言的页面之前就已经被带走。
            // data-cfasync="false"：站点开着 Cloudflare Rocket Loader，它会把所有脚本改成
            // 页面加载完才跑——英文读者先看到中文页再跳，甚至来不及跳。这个属性让它放过这一段。
            data-cfasync="false"
            dangerouslySetInnerHTML={{ __html: preferenceScript(alternates) }}
          />
        )}
        {alternates && Object.entries(alternates).map(([hreflang, href]) => (
          <link key={hreflang} rel="alternate" hrefLang={hreflang} href={`${SITE}${href}`} />
        ))}
        {alternates && (
          <link rel="alternate" hrefLang="x-default" href={`${SITE}${alternates['zh-CN']}`} />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
