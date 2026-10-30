import { useRouter } from 'next/router';
import Comments from './Comments';
import BlogNavigation from './BlogNavigation';
import SEO from './SEO';
import { makeT } from '../lib/blog-i18n.cjs';
import { BOARD_SLUG, TOPICS, communityHref, guidesHref, discussionHref } from '../lib/community.cjs';

export default function TeahousePage({ articles = [], lang = 'zh-CN' }) {
  const t = makeT(lang);
  const router = useRouter();
  // from仅从已发布名录匹配，拒绝任意外链和未发布草稿标识。
  const context = articles.find(item => item.slug === router.query.from || item.originalSlug === router.query.from) || null;
  const sourceSlug = context?.originalSlug || context?.slug;
  const enabled = process.env.NEXT_PUBLIC_COMMENTS_ENABLED === 'true';
  return <>
    <SEO title={t('黑粉茶馆｜本地 AI 与自制软件交流')} description={t('聊部署、晒实测、提反馈、许个愿。黑粉科技的读者交流区，先翻教程，没解决再一起找办法。')} url={communityHref(lang)} lang={lang} />
    <main className="labnote-page tea-page"><div className="labnote-shell">
      <BlogNavigation lang={lang} alternates={{ 'zh-CN': discussionHref(sourceSlug, 'zh-CN'), en: discussionHref(sourceSlug, 'en') }} />
      <header className="tea-hero">
        <div className="tea-hero__copy"><div className="labnote-eyebrow">{t('把问题留下，把办法带走')}</div><h1>{t('黑粉茶馆')}<span aria-hidden="true"> /</span></h1><p>{t('电脑不一定听话，茶馆可以聊聊。')}</p><p className="tea-hero__note">{t('聊部署、晒实测、提反馈。这里没有自动客服，回复可能需要一点时间。')}</p><a className="tea-button" href="#comments-heading">{t('我有个问题')} <span aria-hidden="true">↓</span></a></div>
        <aside className="tea-notice"><span className="tea-kicker">{t('落座须知')}</span><strong>{t('把环境说清，比一句“不能用”更有用。')}</strong><ol><li>{t('设备与系统：芯片、内存、系统版本。')}</li><li>{t('软件与模型：版本、模型名、量化规格。')}</li><li>{t('发生了什么：报错、操作步骤、试过的办法。')}</li></ol><small>{t('不要公开密钥、联系方式或私人日志。广告、冒名和攻击性内容会被隐藏。')}</small></aside>
      </header>
      <div className="tea-topics">{TOPICS.map((topic, index) => <div key={topic.id}><span aria-hidden="true">0{index + 1}</span><strong>{t(topic.label)}</strong></div>)}</div>
      <div className="tea-layout">
        <div className="tea-main"><Comments slug={BOARD_SLUG} lang={lang} board context={context} articles={articles} />{!enabled && <p className="tea-disabled">{t('留言服务尚未启用，请先查阅问题手册。')}</p>}</div>
        <aside className="tea-sidebar"><span className="tea-kicker">{t('先查再问')}</span><h2>{t('有些坑，已经踩过了。')}</h2><p>{t('按设备、模型和工具找教程；仍没解决，就带上环境来聊。')}</p><a className="tea-text-link" href={guidesHref(lang)}>{t('打开问题手册')} →</a><hr /><h3>{t('好问题，留成好教程。')}</h3><p>{t('有代表性的问题会整理为教程；公开引用前会去掉个人信息。')}</p><small>{t('好问题不嫌小，先把现象说清楚。')}</small></aside>
      </div>
    </div></main>
  </>;
}
