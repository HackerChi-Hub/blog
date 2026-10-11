import Link from 'next/link';
import LangToggle from './LangToggle';
import { makeT } from '../lib/blog-i18n.cjs';
import { homeHref } from '../lib/site-lang.cjs';

/** 列表和文章沿用首页导航语言；跨页入口指回首页对应区块。 */
export default function BlogNavigation({ lang = 'zh-CN', alternates }) {
  const t = makeT(lang);
  const home = homeHref(lang);
  const links = [
    ['#lab', t('AI 实验台')],
    ['#products', t('自制软件')],
    ['#resources', t('资源雷达')],
    ['#all-content', t('实测文章')],
    ['#media', t('我的频道')],
  ];
  return (
    <nav className="home-nav blog-nav" aria-label={t('主导航')}>
      <Link className="home-brand" href={home}>
        <img src="/png/logo-icon-traced.png?v=2" alt="" width="34" height="34" />
        <span>{t('黑粉科技')}</span>
      </Link>
      <div className="home-nav__links">
        {links.map(([anchor, label]) => <Link key={anchor} href={`${home}${anchor}`}>{label}</Link>)}
      </div>
      <details className="home-mobile-menu">
        <summary>{t('目录')}</summary>
        <div onClick={(event) => {
          if (event.target.closest('a')) event.currentTarget.parentElement.open = false;
        }}>
          {links.map(([anchor, label]) => <Link key={anchor} href={`${home}${anchor}`}>{label}</Link>)}
        </div>
      </details>
      {alternates && <div className="home-nav__meta"><LangToggle lang={lang} alternates={alternates} /></div>}
    </nav>
  );
}
