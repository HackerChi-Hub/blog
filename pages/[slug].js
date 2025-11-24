// pages/[slug].js
import dynamic from 'next/dynamic';
import { getPosts, getPageContent } from '../lib/notion';

const NotionRenderer = dynamic(
  () => import('react-notion-x').then((m) => m.NotionRenderer),
  { ssr: false }
);

export async function getStaticPaths() {
  const posts = await getPosts();

  const paths = posts.map((post) => ({
    params: { slug: post.id } // 与 index.js 中 Link 的 href 保持一致
  }));

  return {
    paths,
    fallback: false // 没有预生成的页面直接 404
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const recordMap = await getPageContent(slug);

  return {
    props: {
      recordMap
    }
  };
}

export default function PostPage({ recordMap }) {
  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px' }}>
      <NotionRenderer recordMap={recordMap} fullPage={false} darkMode={false} />
    </main>
  );
}
