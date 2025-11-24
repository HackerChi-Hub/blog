// pages/index.js
import Link from 'next/link';
import { getPosts } from '../lib/notion';

export async function getStaticProps() {
  const posts = await getPosts();

  return {
    props: { posts },
  };
}

export default function Home({ posts }) {
  return (
    <main style={{ maxWidth: '720px', margin: '40px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>我的博客</h1>

      {(!posts || posts.length === 0) && (
        <p>暂无文章，请检查 Notion 数据库的 type/status 设置。</p>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: '1.25rem' }}>
            <Link href={`/${post.slug || post.rawId}`}>
              <a style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                {post.title}
              </a>
            </Link>
            {post.date && (
              <div style={{ fontSize: '0.85rem', color: '#666' }}>
                {post.date}
              </div>
            )}
            {post.summary && (
              <div style={{ fontSize: '0.9rem', color: '#444' }}>
                {post.summary}
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
