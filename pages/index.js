import Head from 'next/head';
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
      totalPages: Math.max(1, Math.ceil(posts.length / PAGE_SIZE)),
    },
    revalidate: 60,
  };
}

export default function Home({ posts, currentPage, totalPages }) {
  return (
    <>
      <Head>
        <title>黑客驰官网</title>
        <meta
          name="description"
          content="黑客驰官网。"
        />
      </Head>

      <main className="page">
        <header className="site-hero floating">
          <h1 className="hero-title">
            <span className="highlight">黑客驰官网</span>
          </h1>
          <p>
            分享安全研究、极客生活与前沿技术实践，记录每一次探索与突破。
          </p>
        </header>

        {(!posts || posts.length === 0) && (
          <p className="empty-state">
            暂无文章，请检查 Notion 数据库的 type/status 设置。
          </p>
        )}

        {posts && posts.length > 0 && (
          <section className="posts-grid">
            {posts.map((post) => {
              const slug = post.slug || post.rawId;
              const href = `/${slug}/`;
              return (
                <article className="post-card floating" key={post.id}>
                  <Link href={href} className="post-card__inner">
                    <h2 className="post-title">{post.title || slug}</h2>
                    <div className="post-meta">
                      {post.date && <span className="post-date">{post.date}</span>}
                      {post.tags?.length > 0 && (
                        <div className="post-tags">
                          {post.tags.map((tag) => (
                            <span className="post-tag" data-tag={tag} key={`${post.id}-${tag}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {post.summary && <p className="post-excerpt">{post.summary}</p>}
                  </Link>
                </article>
              );
            })}
          </section>
        )}

        {totalPages > 1 && (
          <nav className="pagination">
            <span className="pagination__info">
              第 {currentPage} 页 / 共 {totalPages} 页
            </span>
            {currentPage < totalPages && (
              <Link href={`/page/${currentPage + 1}/`} className="pagination__next">
                下一页
              </Link>
            )}
          </nav>
        )}
      </main>
    </>
  );
}
