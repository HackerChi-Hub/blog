// components/PostListPage.js
// 分页列表，中文（pages/page/[page].js）与英文（pages/en/page/[page].js）共用。
// 放在 pages/ 外面的原因同首页：页面入口互相 import 时，被 import 的那个页面的
// getStaticProps 和读文件的数据层会原样进浏览器包。
import Link from 'next/link';
import { formatDate, normalizeSummary } from '../lib/utils';
import { makeT } from '../lib/blog-i18n.cjs';
import { homeHref, listHref } from '../lib/site-lang.cjs';
import SEO from './SEO';
import LangToggle from './LangToggle';

const PAGE_SIZE = 21;

const resolveTags = (tags) => {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((tag) => {
      if (typeof tag === 'string') return tag;
      if (typeof tag === 'object') {
        return tag.name || tag.plain_text || tag.id;
      }
      return '';
    })
    .filter(Boolean);
};

export default function PostListPage({
  posts,
  currentPage,
  totalPages,
  errorMessage,
  lang = 'zh-CN',
}) {
  const t = makeT(lang);
  const showEmpty = !posts || posts.length === 0;
  const progress = t('第 {current} / {total} 页 · 每页 {size} 篇。', {
    current: currentPage,
    total: totalPages,
    size: PAGE_SIZE,
  });
  const tagline = t('精彩依旧继续，我们等待着您。');

  return (
    <>
      <SEO
        title={t('第 {n} 页', { n: currentPage })}
        description={`${progress}${tagline}`}
        url={listHref(lang, currentPage)}
        type="website"
        lang={lang}
      />
      <main className="page">
      <section className="site-hero floating">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <h1 className="hero-title">{t('黑粉科技 · 全部文章')}</h1>
          <LangToggle
            lang={lang}
            alternates={{ 'zh-CN': listHref('zh-CN', currentPage), en: listHref('en', currentPage) }}
          />
          <Link
            href={homeHref(lang)}
            className="hero-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1.4rem',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: '#03040a',
              background: 'var(--accent-cyan)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 10px 30px rgba(0, 229, 255, 0.3)',
              transition: 'transform var(--transition-fast)',
            }}
          >
            {t('返回首页')}
          </Link>
        </div>
        <p>
          {/* JSX 原来把两行接成一个空格；SEO 描述那里没有空格。两处各自拼，中文输出与改造前一致 */}
          {progress}{' '}{tagline}
        </p>
      </section>

      {errorMessage && <div className="empty-state">{errorMessage}</div>}

      {showEmpty ? (
        <div className="empty-state">
          {t('该分页暂无文章，请检查 Obsidian 文章的 status 设置。')}
        </div>
      ) : (
        <section className="posts-grid" style={{ width: '100%' }}>
          {posts && posts.length > 0 ? posts.map((post, index) => {
            const slug = post.slug || post.rawId || post.id;
            const href = `/${slug}/`;
            const summaryText =
              normalizeSummary(post.summary) || t('暂无摘要，点击查看完整内容。');
            const tags = resolveTags(post.tags);

            if (!post || !slug) {
              console.warn(`[page/[page]] 无效的文章数据，索引: ${index}`, post);
              return null;
            }

            return (
              <article className="post-card" key={`${post.id || slug}-${index}`}>
                <div className="post-card__inner">
                  <Link href={href} className="post-title">
                    {post.title || slug}
                  </Link>

                  <div className="post-meta">
                    {post.date && (
                      <span className="post-date">
                        {formatDate(post.date, lang)}
                      </span>
                    )}
                    {tags.length > 0 && (
                      <div className="post-tags">
                        {tags.map((tag) => (
                          <span
                            className="post-tag"
                            data-tag={tag}
                            key={`${slug}-${tag}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {summaryText && (
                    <p className="post-excerpt">{summaryText}</p>
                  )}
                </div>
              </article>
            );
          }).filter(Boolean) : (
            <div className="empty-state">
              {t('该分页暂无文章数据')}
            </div>
          )}
        </section>
      )}

      {!showEmpty && totalPages > 1 && (
        <nav className="pagination">
          <div>
            {currentPage > 1 ? (
              <Link
                className="pagination__next"
                href={currentPage - 1 === 1 ? homeHref(lang) : listHref(lang, currentPage - 1)}
              >
                {t('← 上一页')}
              </Link>
            ) : (
              <span className="pagination__info">{t('已是第一页')}</span>
            )}
          </div>
          <div className="pagination__info">
            {t('第 {current} 页 / 共 {total} 页', { current: currentPage, total: totalPages })}
          </div>
          <div>
            {currentPage < totalPages ? (
              <Link
                className="pagination__next"
                href={listHref(lang, currentPage + 1)}
              >
                {t('下一页 →')}
              </Link>
            ) : (
              <span className="pagination__info">{t('已是最后一页')}</span>
            )}
          </div>
        </nav>
      )}
    </main>
    </>
  );
}
