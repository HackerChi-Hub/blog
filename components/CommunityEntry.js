import { makeT } from '../lib/blog-i18n.cjs';
import { communityHref, guidesHref, discussionHref } from '../lib/community.cjs';

export default function CommunityEntry({ lang = 'zh-CN', slug, compact = false }) {
  const t = makeT(lang);
  return <aside className={`community-entry${compact ? ' community-entry--compact' : ''}`} aria-label={t('黑粉茶馆')}>
    <div><span className="tea-kicker">{t('黑粉茶馆')}</span><strong>{t('遇到坑，过来聊。')}</strong><p>{t('部署求助、实测晒单、工具反馈、选题许愿。')}</p></div>
    <div className="community-entry__actions">
      <a href={slug ? discussionHref(slug, lang) : communityHref(lang)}>{slug ? t('带着这篇去茶馆') : t('进来坐坐')} <span aria-hidden="true">↗</span></a>
      <a href={guidesHref(lang)}>{t('先翻问题手册')} <span aria-hidden="true">→</span></a>
    </div>
  </aside>;
}
