import Link from 'next/link';
import { useRouter } from 'next/router';
import { getAllSlugs, getPostBySlug, getPosts, getTranslationGroup } from '../lib/content';
import SEO from '../components/SEO';
import ShareButtons from '../components/ShareButtons';
import RelatedPosts from '../components/RelatedPosts';
import Comments from '../components/Comments';
import SponsorCard from '../components/SponsorCard';
import MarkdownContent from '../components/MarkdownContent';
import ContainedCover from '../components/ContainedCover';
import { getRelatedPosts } from '../lib/related-posts';
import { getEnglishMap } from '../lib/home-data';
import { homeHref, rememberLang } from '../lib/site-lang.cjs';
import { estimateReadingTime, formatReadingTime } from '../lib/reading-time';
import { SITE_CONFIG } from '../lib/seo';
import { formatDateFor, LANG_NAMES, makeT } from '../lib/blog-i18n.cjs';

export async function getStaticPaths() {
  if (process.env.HOMEPAGE_ONLY === '1') {
    console.warn('[getStaticPaths] HOMEPAGE_ONLY=1, skipping article regeneration');
    return { paths: [], fallback: false };
  }

  try {
    const slugs = await getAllSlugs();

    console.log('[getStaticPaths] slugs:', slugs);

    return {
      paths: slugs.map((slug) => ({
        params: { slug },
      })),
      fallback: false,
    };
  } catch (error) {
    console.error('[getStaticPaths] failed:', error?.message || error);
    // 获取文章列表失败不能当成“当前没有文章”，否则会部署空站。
    throw error;
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  console.log('[getStaticProps] slug:', slug);

  try {
    const [post, allPosts, translations] = await Promise.all([
      getPostBySlug(slug),
      getPosts(),
      getTranslationGroup(slug),
    ]);

    if (!post) {
      console.warn('[getStaticProps] NOT FOUND slug:', slug);
      return { notFound: true };
    }

    // 获取相关文章。译文和原文是同一篇：按原文算，并且不把原文推荐回来（切换条已经链过去了）。
    const basis = post.meta.translationOf
      ? allPosts.find((item) => item.slug === post.meta.translationOf) || post.meta
      : post.meta;
    const related = getRelatedPosts(basis, allPosts, 3).filter(
      (item) => item.slug !== post.meta.translationOf
    );
    // 英文文章页推荐英文版：全站基本都有英文版了，链回中文原文会让英文读者一点就掉进中文页。
    // lang 一并改成 en——推荐卡片按 post.lang 和页面语言不同来标「简体中文」，
    // 只换标题不换 lang，就会出现英文标题挂着「简体中文」标签。
    // 中文与繁体页不走这里，props 与改造前一致。
    let relatedPosts = related;
    if (post.meta.lang === 'en') {
      const en = await getEnglishMap();
      relatedPosts = related.map((item) => (en[item.slug] ? { ...item, ...en[item.slug], lang: 'en' } : item));
    }

    return {
      props: {
        meta: post.meta,
        markdownHtml: post.markdownHtml || null,
        relatedPosts,
        translations,
      },
    };
  } catch (error) {
    console.error(`[getStaticProps] FAILED for slug: ${slug}`, error?.message || error);
    // 内容源临时失败时必须让整个构建失败。若返回 notFound，静态导出会
    // 成功部署一个缺少此文章的站点，将原本正常的线上页面覆盖成 404。
    throw error;
  }
}

/** 同一篇文章的其它语言版本。只有一种语言时不渲染。 */
function LanguageSwitch({ translations, current }) {
  if (!Array.isArray(translations) || translations.length < 2) return null;
  return (
    <nav
      aria-label="Language"
      className="post-language-switch"
      style={{ marginTop: '1rem', display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '0.95rem' }}
    >
      {translations.map((item) =>
        item.slug === current ? (
          <span
            key={item.slug}
            aria-current="page"
            style={{ padding: '4px 12px', borderRadius: '999px', background: 'rgba(105, 240, 174, 0.16)', color: 'var(--accent-green)' }}
          >
            {LANG_NAMES[item.lang] || item.lang}
          </span>
        ) : (
          <Link
            key={item.slug}
            href={`/${item.slug}/`}
            hrefLang={item.lang}
            // 点了就记住这个选择：之后再进站按它来，不再看浏览器语言
            onClick={() => rememberLang(item.lang)}
            style={{ padding: '4px 12px', borderRadius: '999px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
          >
            {LANG_NAMES[item.lang] || item.lang}
          </Link>
        )
      )}
    </nav>
  );
}

export default function PostPage({
  meta,
  markdownHtml = null,
  relatedPosts = [],
  translations = [],
}) {
  const router = useRouter();
  const slug = router.query.slug;
  // 界面文字跟文章语言走（frontmatter 的 lang）；正文本来就是那种语言。
  const t = makeT(meta?.lang);

  if (!markdownHtml) {
    return (
      <>
        <SEO
          title={meta?.title || '文章加载失败'}
          description="无法加载文章内容，请检查构建日志。"
          url={`/${slug}/`}
          type="article"
        />
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
          <p>无法加载文章内容，请检查构建日志。</p>
        </main>
      </>
    );
  }

  const categories = Array.isArray(meta.categories) ? meta.categories : [];
  const tags = Array.isArray(meta.tags) ? meta.tags : [];
  
  // 提取摘要文本
  const normalizeSummary = (summary) => {
    if (!summary) return '';
    if (typeof summary === 'string') return summary;
    if (Array.isArray(summary)) {
      return summary
        .map((item) => {
          if (typeof item === 'string') return item;
          if (typeof item === 'object' && item?.plain_text) return item.plain_text;
          if (item?.text?.content) return item.text.content;
          return '';
        })
        .filter(Boolean)
        .join('');
    }
    if (typeof summary === 'object') {
      if (summary.plain_text) return summary.plain_text;
      if (summary.text?.content) return summary.text.content;
      return JSON.stringify(summary);
    }
    return String(summary);
  };
  
  const description = normalizeSummary(meta.summary) || `${meta.title} - ${SITE_CONFIG.name}`;
  const tagNames = tags.map(tag => typeof tag === 'string' ? tag : tag.name || tag).filter(Boolean);
  const articleUrl = `/${meta.slug || slug}/`;
  const publishedTime = meta.date ? new Date(meta.date).toISOString() : null;
  
  // 计算阅读时间
  const readingTime = estimateReadingTime({ meta, markdownHtml });
  const readingTimeText = formatReadingTime(readingTime, t.lang);
  const hasBrandSlogan = markdownHtml.includes(t(SITE_CONFIG.slogan));

  return (
    <>
      <SEO
        title={meta.title}
        description={description}
        image={meta.image || '/favicon-512x512.png'}
        url={articleUrl}
        type="article"
        publishedTime={publishedTime}
        modifiedTime={publishedTime}
        tags={tagNames}
        author={t(SITE_CONFIG.author)}
        lang={t.lang}
      />
      {/* hreflang 互指由 pages/_document.js 统一输出（和自动跳转脚本同一份对照表，外加 x-default） */}

      <main className="page">
        {/* 按图片自然比例完整展示封面，不再强制裁成 16:9。 */}
        {meta.image && (
          <div className="article-cover">
            <ContainedCover src={meta.image} alt={meta.title} priority natural />
          </div>
        )}

        <section
          style={{
            width: '100%',
            padding: '2.4rem 2rem 1.6rem',
            borderRadius: meta.image ? '0 0 40px 40px' : '40px',
            border: '1px solid var(--border-color)',
            borderTop: meta.image ? 'none' : undefined,
            background:
              'linear-gradient(135deg, rgba(3, 48, 54, 0.98), rgba(3, 70, 76, 0.95))',
            boxShadow: 'var(--shadow-soft)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
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

            <LanguageSwitch translations={translations} current={meta.slug || slug} />

            <div
              style={{
                marginTop: '1.1rem',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                flexWrap: 'wrap',
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
              }}
            >
              {meta.date && (
                <span style={{ letterSpacing: '0.18em' }}>
                  {formatDateFor(meta.date, t.lang)}
                </span>
              )}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'rgba(105, 240, 174, 0.1)',
                  border: '1px solid rgba(105, 240, 174, 0.2)',
                  color: 'var(--accent-green)',
                  fontSize: '0.9rem',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {readingTimeText}
              </span>
            </div>

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
                      {t('分类：')}
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
                      {t('标签：')}
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

        <section className="article-content">
          <MarkdownContent html={markdownHtml} />

          {!hasBrandSlogan && (
            <aside
              aria-label={t('黑粉科技宣传语')}
              style={{
                marginTop: '40px',
                padding: '22px 24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 211, 77, 0.28)',
                background: 'linear-gradient(135deg, rgba(255, 211, 77, 0.08), rgba(0, 229, 255, 0.06))',
                textAlign: 'center',
              }}
            >
              <div style={{ color: 'var(--home-yellow)', fontSize: '0.78rem', letterSpacing: '0.18em' }}>
                {t('黑粉科技')}
              </div>
              <div style={{ marginTop: '8px', color: '#f8fbff', fontSize: '1.25rem', fontWeight: 700 }}>
                {t(SITE_CONFIG.slogan)}
              </div>
              <div style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                {t('本地部署 / 免费白嫖 / 自制软件')}
              </div>
            </aside>
          )}

          {/* 分享按钮 - 融入文章区域末尾 */}
          <div
            style={{
              marginTop: '48px',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.02)',
            }}
          >
            <ShareButtons
              title={meta.title}
              url={articleUrl}
              description={description}
              lang={t.lang}
            />
          </div>

          {/* 赞助 - 紧跟正文读完的时刻，排在「相关文章」这个离开入口之前 */}
          <SponsorCard lang={t.lang} />

          {/* 相关文章 - 融入文章区域末尾 */}
          <div style={{ marginTop: '32px' }}>
            <RelatedPosts posts={relatedPosts} lang={t.lang} />
          </div>

          {/* 留言区 - 数据在客户端拉，不参与静态构建 */}
          <Comments slug={meta.slug || slug} lang={t.lang} />
        </section>

        {/* 返回首页按钮 */}
        <div
          style={{
            marginTop: '40px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Link
            href={homeHref(t.lang)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              border: '1px solid rgba(105, 240, 174, 0.3)',
              background: 'rgba(105, 240, 174, 0.1)',
              color: 'var(--accent-green)',
              fontSize: '0.95rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(105, 240, 174, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(105, 240, 174, 0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(105, 240, 174, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(105, 240, 174, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(105, 240, 174, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {t('返回首页')}
          </Link>
        </div>
      </main>
    </>
  );
}
