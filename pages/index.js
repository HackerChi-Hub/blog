// pages/index.js
import Link from 'next/link';
import { getPosts } from '../lib/notion';

export async function getStaticProps() {
  const posts = await getPosts();

  return {
    props: { posts }
    // output: 'export' 下不要写 revalidate
  };
}

export default function Home({ posts }) {
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
        {posts.map((post) => {
          const href = `/${post.slug || post.rawId}`;

          return (
            <li
              key={post.id}
              style={{
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid #eee'
              }}
            >
              {/* 只要这里写对，标题就一定能点击 */}
              <Link href={href}>
                <a
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#0070f3',
                    textDecoration: 'none'
                  }}
                >
                  {post.title}
                </a>
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
    </main>
  );
}
