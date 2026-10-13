import Link from 'next/link';
import { useRouter } from 'next/router';
import { getAllSlugs, getPostBySlug, getPosts, getTranslationGroup } from '../lib/content';
import SEO from '../components/SEO';
import ShareButtons from '../components/ShareButtons';
import RelatedPosts from '../components/RelatedPosts';
import Comments from '../components/Comments';
import SponsorCard from '../components/SponsorCard';
import MarkdownContent from '../components/MarkdownContent';
import ArticleCover from '../components/ArticleCover';
import BlogNavigation from '../components/BlogNavigation';
import CurrentProducts from '../components/CurrentProducts';
import { currentProductCards } from '../lib/product-release-data.cjs';
import { getRelatedPosts } from '../lib/related-posts';
import { getEnglishMap } from '../lib/home-data';
import { homeHref, listHref, rememberLang } from '../lib/site-lang.cjs';
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
    const [post, allPosts, translations, products] = await Promise.all([
      getPostBySlug(slug),
      getPosts(),
      getTranslationGroup(slug),
      currentProductCards(),
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
        products,
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
      aria-label={LANG_NAMES[translations.find((item) => item.slug === current)?.lang] || '简体中文'}
      className="post-language-switch"
    >
      {translations.map((item) =>
        item.slug === current ? (
          <span
            key={item.slug}
            aria-current="page"
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
  products = [],
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
  
  const rootSlug = meta.translationOf || meta.slug;
  const focusedProduct = products.find((product) => rootSlug === product.slug ||
    meta.title.includes(product.name.split(' ').at(-1)) || meta.title.includes(product.name.split(' ')[0]));
  const isProductOverview = products.some((product) => rootSlug === product.slug);
  const description = isProductOverview && focusedProduct ? t(focusedProduct.description) : normalizeSummary(meta.summary) || `${meta.title} - ${SITE_CONFIG.name}`;
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

      <main className="page labnote-page article-page">
        <div className="labnote-shell article-shell">
          <BlogNavigation lang={t.lang} />
          <nav className="article-breadcrumb" aria-label={t('实测文章')}>
            <Link href={homeHref(t.lang)}>{t('返回首页')}</Link>
            <span aria-hidden="true">/</span>
            <Link href={listHref(t.lang, 1)}>{t('查看全部文章')}</Link>
          </nav>

          <header className="article-hero">
            <ArticleCover src={meta.image} title={meta.title} lang={t.lang} priority />
            <div className="article-sheet">
              <div className="labnote-eyebrow">{t('黑粉科技 · 实测记录')}</div>
              <h1>{meta.title}</h1>
              <div className="article-spec-strip">
                {meta.date && <time dateTime={publishedTime}>{formatDateFor(meta.date, t.lang)}</time>}
                <span className="article-reading-time">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  {readingTimeText}
                </span>
                <LanguageSwitch translations={translations} current={meta.slug || slug} />
              </div>
              {(categories.length || tagNames.length) > 0 && (
                <div className="article-taxonomy">
                  {categories.length > 0 && <div><span>{t('分类：')}</span>{categories.map((cat) => {
                    const name = typeof cat === 'string' ? cat : cat.name;
                    return name ? <span className="article-tag" key={cat.id || name}>{name}</span> : null;
                  })}</div>}
                  {tagNames.length > 0 && <div><span>{t('标签：')}</span>{tagNames.map((name) => <span className="article-tag" key={name}>#{name}</span>)}</div>}
                </div>
              )}
              {normalizeSummary(meta.summary) && <div className="article-summary"><span>{t('摘要')}</span><p>{description}</p></div>}
            </div>
          </header>

          <section className="article-content">
            {focusedProduct && <>
              <CurrentProducts products={[focusedProduct]} lang={t.lang} focused />
              <aside className="product-history-note">{t('下方正文保留原日期的实测、截图和版本记录，不冒充当前版本实测；现行功能与下载以上方公开发行信息为准。')}</aside>
            </>}
            <MarkdownContent html={markdownHtml} />
            {meta.fixedProductFooter && <CurrentProducts products={products.filter((product) => product.releaseRepo !== focusedProduct?.releaseRepo)} lang={t.lang} />}
            {!hasBrandSlogan && (
              <aside className="article-signature" aria-label={t('黑粉科技宣传语')}>
                <span>{t('黑粉科技')}</span>
                <strong>{t(SITE_CONFIG.slogan)}</strong>
                <p>{t('本地部署 / 免费白嫖 / 自制软件')}</p>
              </aside>
            )}
            <div className="article-share">
              <ShareButtons title={meta.title} url={articleUrl} description={description} lang={t.lang} />
            </div>
            <SponsorCard lang={t.lang} />
            <RelatedPosts posts={relatedPosts} lang={t.lang} />
            <Comments slug={meta.slug || slug} lang={t.lang} />
          </section>

          <footer className="article-return"><Link className="hero-button hero-button--ghost" href={homeHref(t.lang)}>{t('返回首页')} →</Link></footer>
        </div>
      </main>
    </>
  );
}
