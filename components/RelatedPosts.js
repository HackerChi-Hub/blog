// components/RelatedPosts.js
// 相关文章推荐组件

import Link from 'next/link';
import { formatDate } from '../lib/utils';
import { LANG_NAMES, makeT } from '../lib/blog-i18n.cjs';

/** lang：当前文章页的语言。推荐里语言不同的文章（英文页推荐的中文原文）标出语言，读者点之前就知道。 */
export default function RelatedPosts({ posts, lang }) {
  if (!posts || posts.length === 0) {
    return null;
  }
  const t = makeT(lang);

  return (
    <section
      className="related-posts"
      style={{
        marginTop: '32px',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(255, 255, 255, 0.02)',
      }}
    >
      <h2
        style={{
          fontSize: '1.3rem',
          fontWeight: 600,
          margin: '0 0 20px 0',
          color: 'var(--text-primary)',
        }}
      >
        {t('相关文章')}
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {posts.map((post) => {
          const slug = post.slug || post.rawId || post.id;
          const href = `/${slug}/`;

          return (
            <Link
              key={post.id || slug}
              href={href}
              style={{
                display: 'block',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.02)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(105, 240, 174, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  margin: '0 0 8px 0',
                  color: 'var(--text-primary)',
                  lineHeight: 1.4,
                }}
              >
                {post.title || slug}
              </h3>
              {post.date && (
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    marginTop: '8px',
                  }}
                >
                  {formatDate(post.date, t.lang)}
                  {post.lang && post.lang !== t.lang && LANG_NAMES[post.lang] ? ` · ${LANG_NAMES[post.lang]}` : ''}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
