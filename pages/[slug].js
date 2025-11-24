// pages/[slug].js
import Head from 'next/head';
import { NotionRenderer } from 'react-notion-x';
import 'react-notion-x/src/styles.css';

import { getAllSlugs, getPostBySlug } from '../lib/notion';

export async function getStaticPaths() {
  const slugs = await getAllSlugs();

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    // output: 'export' 时可以用 blocking，这里只在构建期跑 getStaticPaths
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      meta: post.meta,
      recordMap: post.recordMap
    }
    // 这里同样不要写 revalidate
  };
}

export default function PostPage({ meta, recordMap }) {
  return (
    <>
      <Head>
        <title>{meta.title}</title>
      </Head>

      <main
        style={{
          maxWidth: '720px',
          margin: '40px auto',
          padding: '0 16px',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
        }}
      >
        <article>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {meta.title}
          </h1>

          {meta.date && (
            <div
              style={{
                fontSize: '0.85rem',
                color: '#666',
                marginBottom: '1.5rem'
              }}
            >
              {meta.date}
            </div>
          )}

          {/* 这里真正渲染 Notion 正文 */}
          <NotionRenderer
            recordMap={recordMap}
            fullPage={false}
            darkMode={false}
          />
        </article>
      </main>
    </>
  );
}
