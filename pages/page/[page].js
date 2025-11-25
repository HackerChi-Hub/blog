// pages/page/[page].js
import Link from 'next/link';
import { getPosts } from '../../lib/notion';

const PAGE_SIZE = 20;

// 为动态路由 /page/[page] 生成所有静态路径
export async function getStaticPaths() {
  const posts = await getPosts();
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));

  const paths = [];
  for (let p = 1; p <= totalPages; p += 1) {
    paths.push({ params: { page: String(p) } });
  }

  return {
    paths,
    fallback: false // 所有分页在构建时一次性生成，其他页访问会 404
  };
}

// 每个分页在构建时取到对应的文章列表
export async function getStaticProps({ params }) {
  const allPosts = await getPosts();
  const totalPages = Math.max(1, Math.ceil(allPosts.length / PAGE_SIZE));

  const currentPage = Number(params.page) || 1;

  if (currentPage < 1 || currentPage > totalPages) {
    return { notFound: true };
  }

  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const posts = allPosts.slice(start, end);

  return {
    props: {
      posts,
      currentPage,
      totalPages
    }
  };
}

export default function PostListPage({ posts, currentPage, totalPages }) {
  return (
    <main
      style={{
        maxWidth: '720px',
        margin: '40px auto',
        padding: '0 16px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>我的博客</h1>

      {(!posts || posts.length === 0) && (
        <p>暂无文章，请检查 Notion 数据库的 Type / Status 设置。</p>
      )}

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {posts.map((post) => {
          const href = `/${post.slug}/`;

          return (
            <li
              key={post.id}
              style={{
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid #eee'
              }}
            >
              <Link
                href={href}
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#0070f3',
                  textDecoration: 'none'
                }}
              >
                {post.title || post.slug}
              </Link>

              {post.date && (
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#666',
                    marginTop: '0.25rem'
                  }}
                >
                  {post.date}
                </div>
              )}

              {post.summary && (
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: '#444',
                    marginTop: '0.5rem'
                  }}
                >
                  {post.summary}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {totalPages > 1 && (
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '2rem',
            fontSize: '0.9rem'
          }}
        >
          <div>
            {currentPage > 1 && (
              <Link
                href={
                  currentPage - 1 === 1
                    ? '/'
                    : `/page/${currentPage - 1}/`
                }
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
              <Link
                href={`/page/${currentPage + 1}/`}
                style={{ color: '#0070f3' }}
              >
                下一页
              </Link>
            )}
          </div>
        </nav>
      )}
    </main>
  );
}
