import BlogNavigation from './BlogNavigation';
import SEO from './SEO';
import { makeT } from '../lib/blog-i18n.cjs';
import { communityHref, guidesHref, GUIDE_GROUPS } from '../lib/community.cjs';

export default function GuidesPage({ articles = [], lang = 'zh-CN' }) {
  const t = makeT(lang);
  return <>
    <SEO title={t('问题手册｜本地 AI 教程与软件使用指南')} description={t('从设备选择、本地模型、免费接口到自制软件，把已有实测和使用教程按问题整理，找不到答案再到黑粉茶馆交流。')} url={guidesHref(lang)} lang={lang} />
    <main className="labnote-page tea-page"><div className="labnote-shell">
      <BlogNavigation lang={lang} alternates={{ 'zh-CN': guidesHref('zh-CN'), en: guidesHref('en') }} />
      <header className="guide-hero"><div className="labnote-eyebrow">{t('按问题找办法')}</div><h1>{t('问题手册')}</h1><p>{t('不从头翻文章，先找到你卡住的那一步。')}</p><a className="tea-text-link" href={communityHref(lang)}>{t('没找到？去茶馆问问')} →</a></header>
      <div className="guide-grid">{GUIDE_GROUPS.map((group, index) => {
        const links = group.slugs.flatMap(slug => { const post = articles.find(item => item.originalSlug === slug); return post ? [post] : []; });
        if (!links.length) return null;
        return <section className="guide-group" id={group.id} key={group.id}><span className="tea-kicker">0{index + 1} / {t(group.title)}</span><h2>{t(group.question)}</h2><ul>{links.map(post => <li key={post.slug}><a href={`/${post.slug}/`}>{post.title}<span aria-hidden="true">↗</span></a></li>)}</ul></section>;
      })}</div>
      <section className="guide-reader" id="reader-questions"><div className="tea-kicker">{t('读者问过')}</div><h2>{t('兼容性与问题反馈，先查这两处。')}</h2><details><summary>{t('Intel Mac 和 Apple 芯片 Mac，下载时怎么区分？')}</summary><p>{t('先在“关于本机”核对芯片，再查看产品下载页对应平台与安装包说明。系统同为 macOS，并不代表芯片架构相同；没有匹配的安装包时，请先询问作者。')}</p><a className="tea-text-link" href={articles.find(item => item.originalSlug === 'localbrain-local-ai-box') ? `/${articles.find(item => item.originalSlug === 'localbrain-local-ai-box').slug}/` : communityHref(lang)}>{t('核对方寸智匣下载说明')} →</a></details><details><summary>{t('想反馈问题，怎样更容易跟进？')}</summary><p>{t('带上版本、设备、复现步骤与已去除隐私的报错；能在 GitHub 提交问题的，保留该问题链接，在茶馆补充讨论。这里不承诺即时回复。')}</p><a className="tea-text-link" href={communityHref(lang)}>{t('带着问题去茶馆')} →</a></details><p className="guide-reader__note">{t('这两项来自现有文章留言，目前不标作“高频问题”；后续按真实提问继续补充。')}</p></section>
    </div></main>
  </>;
}
