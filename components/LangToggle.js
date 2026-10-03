// components/LangToggle.js
// 全局语言切换：中文 / EN。
//
// · 语言名用各自的语言写（「中文」「EN」），这是通行做法：读者总能认出自己的那一个，
//   不管当前页面是什么语言。
// · 用普通 <a> 整页跳转，不用 next/link：点了之后新页面会重新执行 <head> 里的偏好脚本，
//   读到刚存下的选择，前后一致。客户端路由不会重跑那段脚本。
// · 点击时先把选择存下来，以后再进站就按这个选择，不再看浏览器语言。

import { rememberLang } from '../lib/site-lang.cjs';

const OPTIONS = [
  { lang: 'zh-CN', label: '中文' },
  { lang: 'en', label: 'EN' },
];

export default function LangToggle({ lang = 'zh-CN', alternates }) {
  if (!alternates) return null;
  const current = /^zh/i.test(lang) ? 'zh-CN' : 'en';

  return (
    <nav className="lang-toggle" aria-label="Language / 语言">
      {OPTIONS.map((option) =>
        option.lang === current ? (
          <span key={option.lang} className="lang-toggle__item is-active" aria-current="true" lang={option.lang}>
            {option.label}
          </span>
        ) : (
          <a
            key={option.lang}
            className="lang-toggle__item"
            href={alternates[option.lang]}
            hrefLang={option.lang}
            lang={option.lang}
            onClick={() => rememberLang(option.lang)}
          >
            {option.label}
          </a>
        )
      )}
    </nav>
  );
}
