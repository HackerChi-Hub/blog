import ContainedCover from './ContainedCover';
import { makeT } from '../lib/blog-i18n.cjs';

/** 文章封面的共用边界：固定比例，原图不裁切，缺图/失效时显示真实标题。 */
export default function ArticleCover({ src, title = '', lang = 'zh-CN', priority = false, className = '' }) {
  const t = makeT(lang);
  const fallback = (
    <div className="article-cover-fallback">
      <span>{t('黑粉科技 · 实测记录')}</span>
      <strong>{title}</strong>
    </div>
  );
  return (
    <div className={`article-cover-frame ${className}`.trim()}>
      <ContainedCover src={src} alt={title} priority={priority} fallback={fallback} />
    </div>
  );
}
