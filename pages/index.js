// pages/index.js
// pages/index.js
import Link from 'next/link';
import { getPosts } from '../lib/notion';

const PAGE_SIZE = 20;

export async function getStaticProps() {
  const posts = await getPosts();
  const pagePosts = posts.slice(0, PAGE_SIZE);

  return {
    props: {
      posts: pagePosts,
      currentPage: 1,
      totalPages: Math.max(1, Math.ceil(posts.length / PAGE_SIZE))
    }
  };
}

export default function Home({ posts, currentPage, totalPages }) {
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
        <p>暂无文章，请检查 Notion 数据库的 type/status 设置。</p>
      )}

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {posts.map((post) => (
          <li
            key={post.id}
            style={{
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #eee'
            }}
          >
            {/* 关键：链接路径与 [slug].js 对应，并带 / */}
            <Link href={`/${post.slug || post.rawId}/`}>
              {post.title}
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
        ))}
      </ul>

      {/* 分页导航（略，与之前一致） */}
    </main>
  );
}

      {/* 分页导航 */}
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
              <Link href={currentPage - 1 === 1 ? '/' : `/page/${currentPage - 1}/`}>
                <a style={{ color: '#0070f3' }}>上一页</a>
              </Link>
            )}
          </div>
          <div>
            第 {currentPage} 页 / 共 {totalPages} 页
          </div>
          <div>
            {currentPage < totalPages && (
              <Link href={`/page/${currentPage + 1}/`}>
                <a style={{ color: '#0070f3' }}>下一页</a>
              </Link>
            )}
          </div>
        </nav>
      )}
    </main>
  );
}
