// pages/[slug].js
import Head from 'next/head';
import { NotionRenderer } from 'react-notion-x';
import 'react-notion-x/src/styles.css';

import { getAllSlugs, getPostBySlug } from '../lib/notion';

export async function getStaticPaths() {
  const slugs = await getAllSlugs();

  const paths = slugs.map((slug) => ({
    params: { slug }
  }));

  return {
    paths,
    fallback: 'blocking'
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
    },
  };
}

export default function PostPage({ meta, recordMap }) {
  return (
    <>
      <Head>
        <title>{meta.title}</title>
      </Head>
      <main style={{ maxWidth: '720px', margin: '40px auto', padding: '0 16px' }}>
        <article>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {meta.title}
          </h1>
          {meta.date && (
            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem' }}>
              {meta.date}
            </div>
          )}
          <NotionRenderer recordMap={recordMap} fullPage={false} darkMode={false} />
        </article>
      </main>
    </>
  );
}
