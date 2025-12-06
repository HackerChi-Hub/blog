// pages/index.js
import Link from 'next/link';
import { getPosts } from '../lib/notion';

const PAGE_SIZE = 20;

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

const normalizeSummary = (summary) => {
  if (!summary) return '';
  if (typeof summary === 'string') return summary;
  if (Array.isArray(summary)) {
    return summary
      .map((item) => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item?.plain_text) return item.plain_text;
        return '';
      })
      .filter(Boolean)
      .join('');
  }
  if (typeof summary === 'object') {
    return summary.plain_text || summary.text || JSON.stringify(summary);
  }
  return String(summary);
};

const PostCard = ({ post }) => {
  const slug = post.slug || post.rawId;
  const href = `/${slug}/`;
  const date = formatDate(post.date);
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const summaryText = normalizeSummary(post.summary);

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
                  <span key={tag.id || tag.name || tag} className="post-tag" data-tag={tag.name || tag}>
                    {tag.name || tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {summaryText && <p className="post-excerpt">{summaryText}</p>}
        </div>
      </Link>
    </article>
  );
};

export async function getStaticProps() {
  try {
    const posts = await getPosts();
    const safePosts = Array.isArray(posts) ? posts : [];
    const pagePosts = safePosts.slice(0, PAGE_SIZE);

    return {
      props: {
        posts: pagePosts,
        currentPage: 1,
        totalPages: Math.max(1, Math.ceil(safePosts.length / PAGE_SIZE)),
        errorMessage: safePosts.length === 0 ? '暂无文章，请检查 Notion 数据库配置。' : '',
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('[pages/index] getPosts failed:', error);
    return {
      props: {
        posts: [],
        currentPage: 1,
        totalPages: 1,
        errorMessage:
          error?.message || '获取文章列表失败，请检查 Notion 环境变量、数据库授权或字段配置。',
      },
      revalidate: 60,
    };
  }
}

export default function Home({ posts, currentPage, totalPages, errorMessage }) {
  try {
    const showEmpty = posts.length === 0;

    return (
      <main className="page">
        <section className="site-hero floating">
          <h1 className="hero-title">
            <span className="highlight">黑客驰 · Blog</span>
          </h1>
          <p>专注安全研究、极客分享与实践笔记。</p>
        </section>

        {errorMessage && (
          <div className="empty-state" style={{ fontWeight: 600, color: '#d93025' }}>
            {errorMessage}
          </div>
        )}

        {showEmpty ? (
          <div className="empty-state">
            暂无文章，请确认 Notion 数据库已授权并正确配置 Published 字段。
          </div>
        ) : (
          <section className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post.id || post.slug || post.rawId} post={post} />
            ))}
          </section>
        )}

        {!showEmpty && totalPages > 1 && (
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
  } catch (error) {
    console.error('[pages/index] render failed:', error);
    return (
      <main className="page">
        <section className="site-hero floating">
          <h1 className="hero-title">
            <span className="highlight">黑客驰 · Blog</span>
          </h1>
          <p>专注安全研究、极客分享与实践笔记。</p>
        </section>

        <div className="empty-state" style={{ color: '#d93025', fontWeight: 600 }}>
          首页渲染失败：{error?.message || '未知错误，请查看构建日志。'}
        </div>
      </main>
    );
  }
}
