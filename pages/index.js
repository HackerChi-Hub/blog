// pages/index.js
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

const PostCard = ({ post }) => {
  const slug = post.slug || post.rawId;
  const href = `/${slug}/`;
  const date = formatDate(post.date);
  const tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <article className="post-card floating">
      <Link href={href}>
        <div className="post-card__inner">
          <h2 className="post-title">{post.title || slug}</h2>

          <div className="post-meta">
            {date && <span className="post-date">{date}</span>}
            {tags.length > 0 && (
              <div className="post-tags">
                {tags.map((tag) => (
                  <span key={tag} className="post-tag" data-tag={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {post.summary && (
            <p className="post-excerpt">{post.summary}</p>
          )}
        </div>
      </Link>
    </article>
  );
};

export default function Home({ posts, currentPage, totalPages }) {
  return (
    <main className="page">
      <section className="site-hero floating">
        <h1 className="hero-title">
          <span className="highlight">黑客驰 ·  Blog</span>
        </h1>
        <p>
          专注安全研究、极客分享与实践笔记。
        </p>
      </section>

      {posts.length === 0 ? (
        <div className="empty-state">
          暂无文章，请确认 Notion 数据库已授权并正确配置 Published 字段。
        </div>
      ) : (
        <section className="posts-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      )}

      {totalPages > 1 && (
        <nav className="pagination">
          <span className="pagination__info">
            第 {currentPage} 页 / 共 {totalPages} 页
          </span>
          {currentPage < totalPages && (
            <Link className="pagination__next" href={`/page/${currentPage + 1}/`}>
              下一页 →
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
