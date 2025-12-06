// pages/page/[page].js
import Head from 'next/head';
import Link from 'next/link';
import { getPosts } from '../../lib/notion';

const PAGE_SIZE = 20;
const dateFormatter = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium' });
const formatDate = (iso) => (iso ? dateFormatter.format(new Date(iso)) : '日期待定');

export async function getStaticPaths() {
  const posts = await getPosts();
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));

  const paths = Array.from({ length: totalPages }, (_, index) => ({
    params: { page: String(index + 1) }
  }));

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const allPosts = await getPosts();
  const totalPages = Math.max(1, Math.ceil(allPosts.length / PAGE_SIZE));
  const currentPage = Number(params.page) || 1;

  if (currentPage < 1 || currentPage > totalPages) {
    return { notFound: true };
  }

  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const posts = allPosts.slice(start, end);

  return {
    props: {
      posts,
      currentPage,
      totalPages
    }
  };
}

export default function PostListPage({ posts, currentPage, totalPages }) {
  const prevPage =
    currentPage - 1 === 1 ? '/' : `/page/${currentPage - 1}/`;
  const nextPage = `/page/${currentPage + 1}/`;

  return (
    <div className="page-shell">
      <Head>
        <title>归档 · 第 {currentPage} 页</title>
        <meta
          name="description"
          content="浏览 HackerChi Blog 的全部归档内容。"
        />
      </Head>

      <section className="section-heading">
        <div>
          <p className="hero__eyebrow">ARCHIVE</p>
          <h2>全部文章</h2>
          <p>
            正在查看第 {currentPage} / {totalPages} 页
          </p>
        </div>
        <Link href="/" className="cta-link">
          返回首页
        </Link>
      </section>

      {posts.length === 0 ? (
        <div className="empty-state">暂无文章，稍后再来看看。</div>
      ) : (
        <div className="post-grid">
          {posts.map((post) => {
            const href = `/${post.slug || post.rawId}/`;

            return (
              <article key={post.id} className="post-card">
                <div className="post-card__meta">
                  {post.date && <span>{formatDate(post.date)}</span>}
                  {post.categories?.slice(0, 1).map((cat) => (
                    <span key={cat.id} className="pill">
                      {cat.name}
                    </span>
                  ))}
                </div>

                <Link href={href}>
                  <h3 className="post-card__title">
                    {post.title || post.slug}
                  </h3>
                </Link>

                {post.summary && (
                  <p className="post-card__summary">{post.summary}</p>
                )}

                {post.tags?.length > 0 && (
                  <div className="post-card__meta">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag.id}>#{tag.name}</span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <div className="pagination">
        <div className="pagination__info">
          第 {currentPage} / {totalPages} 页
        </div>

        <div className="pagination__actions">
          {currentPage > 1 && <Link href={prevPage}>上一页</Link>}
          {currentPage < totalPages && <Link href={nextPage}>下一页</Link>}
        </div>
      </div>
    </div>
  );
}
