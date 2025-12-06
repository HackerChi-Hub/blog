// pages/index.js
import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { getPosts } from '../lib/notion';

const PAGE_SIZE = 20;
const dateFormatter = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium' });
const formatDate = (iso) => (iso ? dateFormatter.format(new Date(iso)) : '日期待定');

export async function getStaticProps() {
  const posts = await getPosts();

  return {
    props: {
      posts,
      heroPost: posts[0] ?? null,
      totalPages: Math.max(1, Math.ceil(posts.length / PAGE_SIZE))
    }
  };
}

export default function Home({ posts, heroPost, totalPages }) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('全部');

  const tagStats = useMemo(() => {
    const counter = new Map();
    posts.forEach((post) => {
      post.tags?.forEach((tag) => {
        counter.set(tag.name, (counter.get(tag.name) || 0) + 1);
      });
    });

    return Array.from(counter.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const content = `${post.title ?? ''} ${post.summary ?? ''}`.toLowerCase();
      const tagMatch =
        activeTag === '全部'
          ? true
          : post.tags?.some((tag) => tag.name === activeTag);

      const queryMatch = normalizedQuery
        ? content.includes(normalizedQuery) ||
          post.tags?.some((tag) =>
            tag.name.toLowerCase().includes(normalizedQuery)
          )
        : true;

      return tagMatch && queryMatch;
    });
  }, [posts, query, activeTag]);

  return (
    <div className="page-shell">
      <Head>
        <title>HackerChi · Blog</title>
        <meta
          name="description"
          content="基于全静态博客，提供沉浸式阅读与智能搜索体验。"
        />
      </Head>

      <section className="hero">
        <p className="hero__eyebrow">HACKERCHI JOURNAL</p>
        <h1>灵感与洞察，在此汇聚。</h1>
        <p className="hero__lead">
          以苹果式的克制与优雅呈现内容，
          帮助你专注于文字与想法本身。
        </p>

        {heroPost && (
          <div className="hero__highlight">
            <p>最新发布</p>
            <Link href={`/${heroPost.slug || heroPost.rawId}/`}>
              {heroPost.title || '未命名文章'}
            </Link>
            {heroPost.date && <span>{formatDate(heroPost.date)}</span>}
          </div>
        )}

        <div className="hero__cta">
          <a className="btn btn--primary" href="#search">
            立即探索
          </a>
          <Link className="btn btn--ghost" href="/page/1/">
            查看归档
          </Link>
        </div>
      </section>

      <section id="search" className="search-panel">
        <div className="search-panel__input">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--muted)' }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="搜索文章、标签或摘要……"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {tagStats.length > 0 && (
          <div className="search-panel__chips">
            <button
              type="button"
              className={`chip ${activeTag === '全部' ? 'chip--active' : ''}`}
              onClick={() => setActiveTag('全部')}
            >
              全部
              <span>{posts.length}</span>
            </button>
            {tagStats.map((tag) => (
              <button
                key={tag.name}
                type="button"
                className={`chip ${activeTag === tag.name ? 'chip--active' : ''}`}
                onClick={() => setActiveTag(tag.name)}
              >
                {tag.name}
                <span>{tag.count}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="section-heading">
          <div>
            <h2>精选内容</h2>
            <p>共 {filteredPosts.length} 篇文章符合当前筛选。</p>
          </div>

          {totalPages > 1 && (
            <Link href="/page/2/" className="cta-link">
              浏览全部
            </Link>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="empty-state">
            尚无匹配的文章，请尝试调整关键词或标签筛选。
          </div>
        ) : (
          <div className="post-grid">
            {filteredPosts.map((post) => {
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
      </section>
    </div>
  );
}
