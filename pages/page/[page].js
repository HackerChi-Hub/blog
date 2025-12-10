import Link from 'next/link';
import { getPosts } from '../../lib/notion';

const PAGE_SIZE = 20;

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

const normalizeSummary = (summary) => {
  if (!summary) return '';
  if (typeof summary === 'string') return summary;
  if (Array.isArray(summary)) {
    return summary
      .map((item) => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item?.plain_text) return item.plain_text;
        return '';
      })
      .filter(Boolean)
      .join('');
  }
  if (typeof summary === 'object') {
    return summary.plain_text || summary.text || JSON.stringify(summary);
  }
  return String(summary);
};

const resolveTags = (tags) => {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((tag) => {
      if (typeof tag === 'string') return tag;
      if (typeof tag === 'object') {
        return tag.name || tag.plain_text || tag.id;
      }
      return '';
    })
    .filter(Boolean);
};

export async function getStaticPaths() {
  try {
    const posts = await getPosts();
    const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));

    const paths = Array.from({ length: totalPages }, (_, idx) => ({
      params: { page: String(idx + 1) },
    }));

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error('[page/[page]] getStaticPaths failed:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const allPosts = await getPosts();
    const safePosts = Array.isArray(allPosts) ? allPosts : [];
    const totalPages = Math.max(1, Math.ceil(safePosts.length / PAGE_SIZE));
    const currentPage = Number(params?.page) || 1;

    if (currentPage < 1 || currentPage > totalPages) {
      return { notFound: true };
    }

    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const posts = safePosts.slice(start, end);

    return {
      props: {
        posts,
        currentPage,
        totalPages,
        errorMessage:
          posts.length === 0 ? '该分页暂无内容，请检查 Notion 数据。' : '',
      },
    };
  } catch (error) {
    console.error('[page/[page]] getStaticProps failed:', error);
    return {
      props: {
        posts: [],
        currentPage: 1,
        totalPages: 1,
        errorMessage:
          error?.message ||
          '获取分页文章失败，请检查 Notion 环境变量、数据库授权或字段配置。',
      },
    };
  }
}

export default function PostListPage({
  posts,
  currentPage,
  totalPages,
  errorMessage,
}) {
  const showEmpty = !posts || posts.length === 0;

  return (
    <main className="page">
      <section className="site-hero floating">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <h1 className="hero-title">黑客驰 · 全部文章</h1>
          <Link
            href="/"
            className="hero-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1.4rem',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: '#03040a',
              background: 'var(--accent-cyan)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 10px 30px rgba(0, 229, 255, 0.3)',
              transition: 'transform var(--transition-fast)',
            }}
          >
            返回首页
          </Link>
        </div>
        <p>
          第 {currentPage} / {totalPages} 页 · 每页 {PAGE_SIZE} 篇。
          精彩依旧继续，我们等待着您。
        </p>
      </section>

      {errorMessage && <div className="empty-state">{errorMessage}</div>}

      {showEmpty ? (
        <div className="empty-state">
          该分页暂无文章，请检查 Notion 数据库的 Type / Status 设置。
        </div>
      ) : (
        <section className="posts-grid">
          {posts.map((post) => {
            const slug = post.slug || post.rawId || post.id;
            const href = `/${slug}/`;
            const summaryText =
              normalizeSummary(post.summary) || '暂无摘要，点击查看完整内容。';
            const tags = resolveTags(post.tags);

            return (
              <article className="post-card" key={post.id || slug}>
                <div className="post-card__inner">
                  <Link href={href} className="post-title">
                    {post.title || slug}
                  </Link>

                  <div className="post-meta">
                    {post.date && (
                      <span className="post-date">
                        {formatDate(post.date)}
                      </span>
                    )}
                    {tags.length > 0 && (
                      <div className="post-tags">
                        {tags.map((tag) => (
                          <span
                            className="post-tag"
                            data-tag={tag}
                            key={`${slug}-${tag}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {summaryText && (
                    <p className="post-excerpt">{summaryText}</p>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {!showEmpty && totalPages > 1 && (
        <nav className="pagination">
          <div>
            {currentPage > 1 ? (
              <Link
                className="pagination__next"
                href={
                  currentPage - 1 === 1 ? '/' : `/page/${currentPage - 1}/`
                }
              >
                ← 上一页
              </Link>
            ) : (
              <span className="pagination__info">已是第一页</span>
            )}
          </div>
          <div className="pagination__info">
            第 {currentPage} 页 / 共 {totalPages} 页
          </div>
          <div>
            {currentPage < totalPages ? (
              <Link
                className="pagination__next"
                href={`/page/${currentPage + 1}/`}
              >
                下一页 →
              </Link>
            ) : (
              <span className="pagination__info">已是最后一页</span>
            )}
          </div>
        </nav>
      )}
    </main>
  );
}
