// pages/[slug].js
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getAllSlugs, getPostBySlug } from '../lib/notion';
import 'react-notion-x/src/styles.css';

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code)
);
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then(
    (m) => m.Collection
  )
);
const NotionRenderer = dynamic(
  () => import('react-notion-x').then((m) => m.NotionRenderer),
  { ssr: false }
);

const dateFormatter = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium' });
const formatDate = (iso) => (iso ? dateFormatter.format(new Date(iso)) : '');

export async function getStaticPaths() {
  const slugs = await getAllSlugs();

  return {
    paths: slugs.map((slug) => ({
      params: { slug }
    })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      meta: post.meta,
      recordMap: post.recordMap
    }
  };
}

export default function PostPage({ meta, recordMap }) {
  if (!recordMap) {
    return (
      <main className="article-shell">
        <h1>{meta?.title || '文章加载失败'}</h1>
        <p>无法加载内容，请检查服务器日志。</p>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta
          name="description"
          content={meta.summary || 'Notion 文章详情'}
        />
      </Head>

      <article className="article-shell">
        <Link href="/" className="back-link">
          ← 返回首页
        </Link>

        {meta.date && (
          <p className="hero__eyebrow" style={{ marginTop: 24 }}>
            {formatDate(meta.date)}
          </p>
        )}

        <h1 className="article-title">{meta.title}</h1>

        {(meta.categories?.length || meta.tags?.length) && (
          <div className="article-meta">
            {meta.categories?.map((cat) => (
              <span key={cat.id} className="pill">
                {cat.name}
              </span>
            ))}
            {meta.tags?.map((tag) => (
              <span key={tag.id}>#{tag.name}</span>
            ))}
          </div>
        )}

        <div className="notion-container">
          <NotionRenderer
            className="notion-only-body"
            recordMap={recordMap}
            fullPage={false}
            darkMode
            disableHeader
            components={{
              Code,
              Collection
            }}
          />
        </div>
      </article>
    </>
  );
}
