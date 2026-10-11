// 相关文章推荐组件：与列表页相同的封面框和实验日志卡片。
import Link from 'next/link';
import { formatDate } from '../lib/utils';
import { LANG_NAMES, makeT } from '../lib/blog-i18n.cjs';
import ArticleCover from './ArticleCover';

export default function RelatedPosts({ posts, lang }) {
  if (!posts?.length) return null;
  const t = makeT(lang);
  return (
    <section className="related-posts">
      <h2>{t('相关文章')}</h2>
      <div className="related-posts__grid">
        {posts.map((post) => {
          const slug = post.slug || post.rawId || post.id;
          return (
            <Link key={post.id || slug} href={`/${slug}/`} className="related-card">
              <ArticleCover src={post.cover || post.pageCover || post.image || post.thumbnail || post.heroImage} title={post.title || slug} lang={lang} />
              <div className="related-card__body">
                <h3>{post.title || slug}</h3>
                {post.date && <div className="related-card__meta">{formatDate(post.date, t.lang)}
                  {post.lang && post.lang !== t.lang && LANG_NAMES[post.lang] ? ` · ${LANG_NAMES[post.lang]}` : ''}
                </div>}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
