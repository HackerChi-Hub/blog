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
      params: { slug },
    })),
    fallback: false,
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
      recordMap: post.recordMap,
    },
  };
}

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

export default function PostPage({ meta, recordMap }) {
  if (!recordMap) {
    return (
      <main
        style={{
          maxWidth: '720px',
          margin: '40px auto',
          padding: '0 16px',
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        <h1>{meta?.title || '文章加载失败'}</h1>
        <p>无法加载 Notion 内容，请检查服务器日志。</p>
      </main>
    );
  }

  const categories = Array.isArray(meta.categories) ? meta.categories : [];
  const tags = Array.isArray(meta.tags) ? meta.tags : [];

  return (
    <>
      <Head>
        <title>{meta.title}</title>
      </Head>

      {/* 使用与你首页统一的 .page 布局，背景由全局 CSS 控制 */}
      <main className="page">
        {/* 顶部 Hero：标题 + 日期 + 分类、标签，风格统一 */}
        <section
          style={{
            width: '100%',
            padding: '2.4rem 2rem 1.6rem',
            borderRadius: '40px',
            border: '1px solid var(--border-color)',
            background:
              'linear-gradient(135deg, rgba(3, 48, 54, 0.98), rgba(3, 70, 76, 0.95))',
            boxShadow: 'var(--shadow-soft)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* 背景网格 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              opacity: 0.4,
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative' }}>
            {/* 标题 */}
            <h1
              style={{
                fontSize: 'clamp(2.0rem, 3.6vw, 2.6rem)',
                margin: 0,
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#ffffff',
              }}
            >
              {meta.title}
            </h1>

            {/* 日期 */}
            {meta.date && (
              <div
                style={{
                  marginTop: '1.1rem',
                  fontSize: '0.95rem',
                  letterSpacing: '0.18em',
                  color: 'var(--text-secondary)',
                }}
              >
                {formatDate(meta.date)}
              </div>
            )}

            {/* 分类与标签区域：和正文风格统一 */}
            {(categories.length || tags.length) > 0 && (
              <section
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  marginTop: '1.6rem',
                  fontSize: '0.95rem',
                  color: 'var(--text-secondary)',
                }}
              >
                {/* 分类 */}
                {categories.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      分类：
                    </span>
                    {categories.map((cat) => (
                      <span
                        key={cat.id || cat.name}
                        style={{
                          padding: '4px 14px',
                          borderRadius: '999px',
                          border: '1px solid rgba(255,255,255,0.35)',
                          background: 'rgba(255,255,255,0.09)',
                          color: 'var(--text-secondary)',
                          fontWeight: 500,
                        }}
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* 标签 */}
                {tags.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      标签：
                    </span>
                    {tags.map((tag) => (
                      <span
                        key={tag.id || tag.name}
                        style={{
                          padding: '3px 12px',
                          borderRadius: '999px',
                          border: '1px solid rgba(255,255,255,0.28)',
                          background: 'rgba(255,255,255,0.06)',
                          color: 'var(--text-secondary)',
                          fontSize: '0.9rem',
                        }}
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </section>

        {/* 正文 Notion 内容，暗色卡片，与首页/列表统一 */}
        <section className="notion">
          <NotionRenderer
            className="notion-only-body"
            recordMap={recordMap}
            fullPage={false}
            darkMode={false}
            disableHeader
            components={{
              Code,
              Collection,
            }}
          />
        </section>
      </main>
    </>
  );
}
