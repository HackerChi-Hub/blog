// components/RelatedPosts.js
// 相关文章推荐组件

import Link from 'next/link';

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

export default function RelatedPosts({ posts }) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section
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
        相关文章
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
                  {formatDate(post.date)}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
