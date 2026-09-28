import { Html, Head, Main, NextScript } from 'next/document';
import { normalizeUiLang } from '../lib/blog-i18n.cjs';

// 页面语言写进 <html lang>：文章页取 frontmatter 的 lang（译文是 en / zh-TW），其余页面都是简体。
// 静态导出时每个页面各跑一次，__NEXT_DATA__ 里就是这一页的 props。
// 站内用 next/link 跳转时不会重跑这里，由 _app.js 同步 document.documentElement.lang。
export default function Document({ __NEXT_DATA__ }) {
  const lang = normalizeUiLang(__NEXT_DATA__?.props?.pageProps?.meta?.lang);
  return (
    <Html lang={lang}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
