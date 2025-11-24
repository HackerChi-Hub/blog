// pages/index.js
import Link from 'next/link';
import { getPosts } from '../lib/notion';

export async function getStaticProps() {
  const posts = await getPosts();

  // 按时间倒序排一下
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    props: {
      posts
    },
    //revalidate: 60 // 虽然导出静态站，这个值对 export 没影响，可以保留
  };
}

export default function Home({ posts }) {
  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>My Notion Blog</h1>

      {posts.length === 0 && <p>还没有从 Notion 读取到文章。</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: '1rem' }}>
            <Link href={`/${post.id}`}>
              <span style={{ color: '#0969da', cursor: 'pointer' }}>{post.title || '未命名文章'}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
