import Head from 'next/head';
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
  () =>
    import('react-notion-x').then(
      (m) => m.NotionRenderer
    ),
  { ssr: false }
);

export async function getStaticPaths() {
  const slugs = await getAllSlugs();

  console.log('[getStaticPaths] slugs:', slugs);

  return {
    paths: slugs.map((slug) => ({
      params: { slug }
    })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  console.log('[getStaticProps] slug:', slug);

  const post = await getPostBySlug(slug);

  if (!post) {
    console.warn('[getStaticProps] NOT FOUND slug:', slug);
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
      <main
        style={{
          maxWidth: '720px',
          margin: '40px auto',
          padding: '0 16px',
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
        }}
      >
        <h1>{meta?.title || '文章加载失败'}</h1>
        <p>无法加载 Notion 内容，请检查服务器日志。</p>
      </main>
    );
  }

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
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
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

          {(meta.categories?.length || meta.tags?.length) && (
            <section
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                color: '#444'
              }}
            >
              {meta.categories?.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontWeight: 600 }}>分类:</span>
                  {meta.categories.map((cat) => (
                    <span
                      key={cat.id}
                      style={{
                        background: '#f0f4ff',
                        padding: '2px 10px',
                        borderRadius: '999px',
                        color: '#fff' // 字体颜色改为纯白
                      }}
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}

              {meta.tags?.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontWeight: 600 }}>标签:</span>
                  {meta.tags.map((tag) => (
                    <span
                      key={tag.id}
                      style={{
                        background: '#f5f5f5',
                        padding: '2px 10px',
                        borderRadius: '4px'
                      }}
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}

          <NotionRenderer
            className="notion-only-body"
            recordMap={recordMap}
            fullPage={false}
            darkMode={false}
            disableHeader
            components={{
              Code,
              Collection
            }}
          />
        </article>
      </main>
    </>
  );
}
