// pages/page/[page].js
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
        errorMessage: posts.length === 0 ? '该分页暂无内容，请检查 Notion 数据。' : '',
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('[page/[page]] getStaticProps failed:', error);
    return {
      props: {
        posts: [],
        currentPage: 1,
        totalPages: 1,
        errorMessage:
          error?.message || '获取分页文章失败，请检查 Notion 环境变量、数据库授权或字段配置。',
      },
      revalidate: 60,
    };
  }
}

export default function PostListPage({ posts, currentPage, totalPages, errorMessage }) {
  const showEmpty = !posts || posts.length === 0;

  return (
    <main
      style={{
        maxWidth: '720px',
        margin: '40px auto',
        padding: '0 16px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>黑客驰官网 · 分页</h1>

      {errorMessage && (
        <p style={{ color: '#d93025', fontWeight: 600, marginBottom: '1rem' }}>{errorMessage}</p>
      )}

      {showEmpty && <p>该分页暂无文章，请检查 Notion 数据库的 Type / Status 设置。</p>}

      {!showEmpty && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {posts.map((post) => {
            const slug = post.slug || post.rawId;
            const href = `/${slug}/`;
            const summaryText = normalizeSummary(post.summary);

            return (
              <li
                key={post.id || slug}
                style={{
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #eee',
                }}
              >
                <Link
                  href={href}
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#0070f3',
                    textDecoration: 'none',
                  }}
                >
                  {post.title || slug}
                </Link>

                {post.date && (
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: '#666',
                      marginTop: '0.25rem',
                    }}
                  >
                    {formatDate(post.date)}
                  </div>
                )}

                {summaryText && (
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: '#444',
                      marginTop: '0.5rem',
                    }}
                  >
                    {summaryText}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {!showEmpty && totalPages > 1 && (
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '2rem',
            fontSize: '0.9rem',
          }}
        >
          <div>
            {currentPage > 1 && (
              <Link
                href={currentPage - 1 === 1 ? '/' : `/page/${currentPage - 1}/`}
                style={{ color: '#0070f3' }}
              >
                上一页
              </Link>
            )}
          </div>
          <div>
            第 {currentPage} 页 / 共 {totalPages} 页
          </div>
          <div>
            {currentPage < totalPages && (
              <Link href={`/page/${currentPage + 1}/`} style={{ color: '#0070f3' }}>
                下一页
              </Link>
            )}
          </div>
        </nav>
      )}
    </main>
  );
}
