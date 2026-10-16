// components/HomePage.js
// 首页组件，中文首页（pages/index.js）与英文首页（pages/en/index.js）共用。
// 放在 pages/ 外面：页面入口互相 import 时，Next 只会剔除入口文件自己的 getStaticProps，
// 被 import 的那个页面的 getStaticProps 和它读文件的数据层会原样进浏览器包。

import { createContext, useContext } from 'react';
import Link from 'next/link';
import { formatDate, normalizeSummary } from '../lib/utils';
import SEO from './SEO';
import Search from './Search';
import ContainedCover from './ContainedCover';
import LangToggle from './LangToggle';
import HomeHero from './HomeHero';
import { SITE_CONFIG } from '../lib/seo';
import { makeT } from '../lib/blog-i18n.cjs';
import { homeHref, listHref } from '../lib/site-lang.cjs';

const WECHAT_QR_IMAGE = '/png/wechat-official-account-qr.jpg';

const {
  CONTENT_PILLARS,
  AI_LAB_TOOLS,
  SIDE_TOOLS,
  MEDIA_CHANNELS,
  RESOURCE_RADARS,
} = require('../lib/home-content.cjs');

const truncateText = (text, maxLength = 80) =>
  text && text.length > maxLength ? `${text.slice(0, maxLength)}…` : text || '';

// ---------- 语言 ----------
//
// 首页的中文版和英文版是同一个组件。英文版的做法是「判断照旧用中文原文，只换显示的字段」：
// 精选怎么挑、主线标签怎么打，都靠拿中文关键词去匹配文章的标题和摘要；要是先把文章换成
// 英文再匹配，关键词全对不上。所以 props 里文章仍是中文原文，另附一张
// 「原文 slug → 英文版字段」的表（en），渲染时用 view() 取要显示的那一版。
//
// 中文页不传 lang、不传 en：t 原样返回中文、view 原样返回文章，输出与改造前一致。

const HomeContext = createContext({ lang: 'zh-CN', t: makeT('zh-CN'), en: null });
const useHome = () => useContext(HomeContext);

/** 要显示的那一版：英文页且有英文版时换标题、摘要、链接和标签，其余（日期、封面）照旧。 */
const view = (post, en) => {
  const translated = en && en[getPostSlug(post)];
  return translated ? { ...post, ...translated } : post;
};

const CoverVisual = ({ cover, title, label }) => {
  const { t } = useHome();
  if (label === undefined) label = t('黑粉科技 · 实测记录');
  const src = typeof cover === 'string' ? cover : cover?.url || cover?.src;
  return (
    <div className="cover-visual">
      <div className="cover-fallback">
        <span>{label}</span>
        <strong>{truncateText(title, 40)}</strong>
      </div>
      {src && <ContainedCover src={src} alt={title} />}
    </div>
  );
};

const PostCover = ({ post }) => {
  const { t, en } = useHome();
  const shown = view(post, en);
  return (
    <div className="post-cover">
      <CoverVisual
        cover={post.cover || post.thumbnail || post.heroImage}
        title={shown.title || getPostSlug(shown)}
        // 主线标签用原文匹配（关键词是中文），显示时再翻译
        label={getPostPillarLabels(post).map((label) => t(label)).join(' × ')}
      />
    </div>
  );
};

const PostCard = ({ post: original }) => {
  const { t, en, lang } = useHome();
  const post = view(original, en);
  const slug = post.slug || post.rawId;
  const href = `/${slug}/`;
  const date = formatDate(post.date, lang);
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const summaryText = truncateText(normalizeSummary(post.summary), 140);

  return (
    <article className="feed-card">
      <a href={href}>
        <div className="feed-card__inner">
          <PostCover post={original} />

          <div className="feed-card__body">
            <div className="feed-card__meta">
              {date && <span className="feed-card__date">{date}</span>}
              {tags.length > 0 && (
                <div className="feed-card__tags">
                  {tags.slice(0, 2).map((tag) => (
                    <span key={tag.id || tag.name || tag}>{tag.name || tag}</span>
                  ))}
                  {tags.length > 2 && <span>+{tags.length - 2}</span>}
                </div>
              )}
            </div>

            <h2 className="feed-card__title">{post.title || slug}</h2>

            {summaryText && <p className="feed-card__excerpt">{summaryText}</p>}

            <div className="feed-card__foot">
              <span className="feed-card__cta">{t('阅读全文')}</span>
              <svg width="28" height="12" viewBox="0 0 28 12" fill="none">
                <path
                  d="M0 6h26m0 0-4-4m4 4-4 4"
                  stroke="#69f0ae"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
};

const getPostSlug = (post) => post?.slug || post?.rawId || post?.id || '';

const getPostPillarLabels = (post) => {
  const tags = Array.isArray(post?.tags)
    ? post.tags.map((tag) => tag?.name || tag).filter(Boolean)
    : [];
  const haystack = `${post?.title || ''} ${normalizeSummary(post?.summary)} ${tags.join(' ')}`.toLowerCase();
  if (haystack.includes('localbrain')) return ['本地部署', '自制软件'];
  if (haystack.includes('screenlex')) return ['自制软件'];
  const matches = CONTENT_PILLARS.filter((pillar) =>
    pillar.keywords.some((keyword) => haystack.includes(keyword.toLowerCase()))
  ).map((pillar) => pillar.title);
  return matches.length ? matches.slice(0, 2) : ['真实实测'];
};

const getPostPillarHaystack = (post) => {
  const tags = Array.isArray(post?.tags)
    ? post.tags.map((tag) => tag?.name || tag).filter(Boolean)
    : [];
  return `${post?.title || ''} ${normalizeSummary(post?.summary)} ${tags.join(' ')}`.toLowerCase();
};

const selectPillarFeaturedPosts = (posts = []) => {
  const used = new Set();
  const selected = [];

  CONTENT_PILLARS.forEach((pillar) => {
    const post = posts.find((candidate) => {
      const slug = getPostSlug(candidate);
      if (!slug || used.has(slug)) return false;
      const haystack = getPostPillarHaystack(candidate);
      return pillar.featureKeywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
    });

    if (post) {
      used.add(getPostSlug(post));
      selected.push({ post, pillar });
    }
  });

  posts.forEach((post) => {
    const slug = getPostSlug(post);
    if (selected.length >= 3 || !slug || used.has(slug)) return;
    used.add(slug);
    selected.push({ post, pillar: null });
  });

  return selected.slice(0, 3);
};

const FeaturedCard = ({ post: original, primary = false, pillar = null }) => {
  const { t, en, lang } = useHome();
  if (!original) return null;
  const post = view(original, en);
  const slug = getPostSlug(post);
  const cover = post.cover || post.thumbnail || post.heroImage;
  // 标签按原文匹配，显示时翻译
  const labels = (pillar ? [pillar.title] : getPostPillarLabels(original)).map((label) => t(label));

  return (
    <article className={`featured-card${primary ? ' featured-card--primary' : ''}`}>
      <a href={`/${slug}/`} aria-label={post.title || slug}>
        <div className="featured-card__cover">
          <CoverVisual cover={cover} title={post.title || slug} label={labels.join(' × ')} />
        </div>
        <div className="featured-card__body">
          <div className="featured-card__meta">
            {formatDate(post.date, lang)} · {labels.join(' × ')}
          </div>
          <h3>{post.title || slug}</h3>
          <p>{truncateText(normalizeSummary(post.summary), primary ? 150 : 86)}</p>
        </div>
      </a>
    </article>
  );
};

const SiteNavigation = () => {
  const { t, lang } = useHome();
  return (
    <nav className="home-nav" aria-label={t('主导航')}>
      <a className="home-brand" href="#top">
        <img src="/png/logo-icon-traced.png?v=2" alt="" />
        <span>{t('黑粉科技')}</span>
      </a>
      <div className="home-nav__links">
        <a className="home-nav__lab" href="#lab">{t('AI 实验台')}</a>
        <a href="#products">{t('自制软件')}</a>
        <a href="#resources">{t('资源雷达')}</a>
        <a href="#all-content">{t('实测文章')}</a>
        <a href="#media">{t('我的频道')}</a>
      </div>
      <details className="home-mobile-menu">
        <summary>{t('目录')}</summary>
        <div onClick={(event) => {
          if (event.target.closest('a')) event.currentTarget.parentElement.open = false;
        }}>
          <a href="#lab">{t('AI 实验台')}</a>
          <a href="#products">{t('自制软件')}</a>
          <a href="#resources">{t('资源雷达')}</a>
          <a href="#all-content">{t('实测文章')}</a>
          <a href="#media">{t('我的频道')}</a>
        </div>
      </details>
      <div className="home-nav__meta">
        <span className="nav-mono">FIELD LOG / HACKERCHI.TOP</span>
        <LangToggle lang={lang} alternates={{ 'zh-CN': homeHref('zh-CN'), en: homeHref('en') }} />
      </div>
    </nav>
  );
};

const MediaSection = ({ subMenus = [] }) => {
  const { t } = useHome();
  // 频道匹配用 subMenus 的中文标题（pattern 是中文），显示时再翻译
  const channels = MEDIA_CHANNELS.map((channel) => {
    const matched = subMenus.find((link) => channel.pattern.test(link?.title || ''));
    return { ...channel, url: matched?.url || channel.fallbackUrl };
  });

  return (
    <section className="channel-strip js-reveal" id="media" aria-label={t('我的频道')}>
      <div className="channel-strip__head"><strong>{t('我的频道')}</strong><span>{t('平台不同，黑粉还是同一个黑粉。')}</span></div>
        <div className="media-grid">
          {channels.map((channel) => {
            const external = /^https?:\/\//.test(channel.url);
            return (
              <a
                className={`media-card${channel.id === 'bilibili' ? ' media-card--primary' : ''}`}
                href={channel.url}
                onClick={channel.url === '#media-notice' ? () => { document.getElementById('media-notice').open = true; } : undefined}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                style={{ '--channel-accent': channel.accent }}
                key={channel.id}
              >
                {channel.id === 'bilibili' && <span className="media-card__flag">{t('主场首发')}</span>}
                <span className="media-card__name">{t(channel.name)}</span>
                <strong>{t(channel.title)}</strong>
                <span className="media-card__action">{t(channel.action)} →</span>
              </a>
            );
          })}
        </div>
      <details className="channel-qr" id="media-notice">
        <summary>{t('关注公众号')}</summary>
        <div className="channel-qr__panel">
          <img src={WECHAT_QR_IMAGE} alt={t('黑粉科技公众号二维码')} width="258" height="258" />
          <p>{t('长按保存图片，用微信「扫一扫」从相册选取')}</p>
        </div>
      </details>
    </section>
  );
};

const FeaturedSection = ({ items = [] }) => {
  const { t } = useHome();
  if (!items.length) return null;

  return (
    <div id="latest">
      <div className="article-subhead">{t('三条主线')} · {t('频道精选')}</div>
      <div className="featured-grid">
        {items.map(({ post, pillar }) => <FeaturedCard key={getPostSlug(post)} post={post} pillar={pillar} />)}
      </div>
    </div>
  );
};

const ProductSection = ({ products = [] }) => {
  const { t, lang } = useHome();
  return (
    <section id="products" className="js-reveal">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">{t('自制软件')}</div>
          <h2>{t('自制软件')}</h2>
        </div>
        <p>{t('遇到问题，先找工具；找不到，就自己写一个。多少有点不服气。')}</p>
      </div>
      <div className="product-grid">
        {products.map((product) => {
          // 英文页在构建时切换介绍文章的 slug，固定用途和界面标签由词典翻译。
          const name = t(product.name);
          return (
            <article className="product-card tilt" key={product.slug} data-product-repo={product.releaseRepo} data-product-version={product.version} data-product-revision={product.revision}>
              <div className="product-card__badge">{t(product.badge)}</div>
              <span className="product-card__monogram" aria-hidden="true">{product.name.split(' ').at(-1).replace(/[^A-Z]/g, '').slice(0, 2)}</span>
              <h3 className="product-card__name">{name}</h3>
              <h4 className="product-card__label">{t(product.label)}</h4>
              {product.version && (
                <div className="product-card__release">
                  <span>{t('最新版本 {version}', { version: product.version })}</span>
                  <a href={product.releaseUrl} target="_blank" rel="noreferrer">{t('更新说明 ↗')}</a>
                </div>
              )}
              {product.platforms?.length > 0 && <ul className="current-product-platforms" aria-label={t('各平台公开安装包')}>{product.platforms.map((item) => <li key={item.platform}><a href={item.url} target="_blank" rel="noopener noreferrer"><span>{item.platform}</span><strong>{item.version}</strong><span aria-hidden="true">↗</span></a></li>)}</ul>}
              <p className="product-card__description">{t(product.description)}</p>
              {lang !== 'en' && product.updateSummary && (
                <div className="product-card__update"><strong>{t('最新变化')}</strong><p>{product.updateSummary}</p></div>
              )}
              <div className="product-card__facts" aria-label={t('{name} 产品特性', { name })}>
                {product.facts.map((fact) => <span key={fact}>{t(fact)}</span>)}
              </div>
              <div className="product-card__footer">
                <a className="product-card__link" href={`/${product.slug}/`}>
                  {t(product.action)} →
                </a>
                {product.updated && (
                  <div className="product-card__date">
                    {t('更新于 {date}', { date: formatDate(product.updated, lang) })}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

const LabTool = ({ tool }) => {
  const { t } = useHome();
  const diagram = <div className="lab-tool__diagram"><span>{tool.icon}</span><b>{t(tool.detail)}</b></div>;
  return (
    <a className="lab-tool" href={tool.href}>
      <div className="lab-tool__preview" aria-hidden="true">
        {tool.image ? (
          <ContainedCover
            src={tool.image}
            alt=""
            width={tool.imageWidth}
            height={tool.imageHeight}
            fallback={diagram}
          />
        ) : diagram}
      </div>
      <div className="lab-tool__copy">
        <span className="lab-tool__icon">{tool.icon}</span>
        <strong>{t(tool.title)}</strong>
        <small>{t(tool.desc)}</small>
        <span className="lab-tool__action">{t('打开工作台')} →</span>
      </div>
    </a>
  );
};

const LabSection = () => {
  const { t } = useHome();
  return (
    <section className="lab-section js-reveal" id="lab">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">{t('本地 AI · 实测数据')}</div>
          <h2>{t('AI 实验台')}</h2>
        </div>
        <p>{t('参数先别吹，上机跑一回。')}</p>
      </div>
      <div className="lab-grid">
        {AI_LAB_TOOLS.map((tool) => <LabTool tool={tool} key={tool.href} />)}
      </div>
    </section>
  );
};

const SideSection = () => {
  const { t } = useHome();
  return (
      <section className="lab-side">
        <div className="lab-side__head">
          <div>
            <div className="section-eyebrow">{t('额外掉落')}</div>
            <h3>{t('更多工具')}</h3>
          </div>
          <p>{t('不抢 AI 主线的镜头，但做都做了，有用就拿走。')}</p>
        </div>
        <div className="lab-grid lab-grid--side">
          {SIDE_TOOLS.map((tool) => <a className="side-tool" href={tool.href} key={tool.href}><span>{tool.icon}</span><strong>{t(tool.title)}</strong><small>{t(tool.desc)}</small></a>)}
        </div>
      </section>
  );
};

const ResourceSection = ({ posts = [] }) => {
  const { t, en, lang } = useHome();
  return (
    <section id="resources" className="js-reveal">
      <div className="section-head"><div><div className="section-eyebrow">{t('发现与核验')}</div><h2>{t('资源雷达')}</h2></div><p>{t('新闻看动态，模型看门槛，技能看用途。推荐不等于实测。')}</p></div>
      <div className="resource-grid">
        {RESOURCE_RADARS.map((radar) => {
          const entries = posts.filter((post) => post.articleType === radar.type);
          const previewEntries = lang === 'en' ? entries.filter((post) => en?.[post.slug]) : entries;
          return <article className="resource-card" key={radar.type}>
            <div className="resource-card__head"><span>{radar.icon}</span>{radar.type !== 'news' && <small>{t('已收录 {n} 篇', { n: entries.length })}</small>}</div>
            <h3><a href={radar.href}>{t(radar.title)}</a></h3><p>{t(radar.desc)}</p>
            <ul>{previewEntries.slice(0, 2).map((entry) => { const shown = view(entry, en); return <li key={entry.slug}><a href={`/${shown.slug}/`}>{shown.title}</a></li>; })}</ul>
            {radar.type === 'news' && <div className="resource-card__news">{t('重点快报 · 分类筛选 · 原始信源')}</div>}
            <a className="resource-card__action" href={radar.href}>{t('进入雷达')} →</a>
          </article>;
        })}
      </div>
      {lang === 'en' && <p className="resource-language-note">{t('雷达与实验台专页目前以中文提供。')}</p>}
    </section>
  );
};

export default function Home({
  posts,
  searchPosts = [],
  radarPosts = [],
  notices,
  subMenus,
  products,
  currentPage,
  totalPages,
  errorMessage,
  lang = 'zh-CN',
  en = null,
}) {
  const t = makeT(lang);
  try {
    const showEmpty = posts.length === 0;
    // 精选用原文挑（关键词是中文），显示时才换成英文版
    const articlePosts = posts.filter((post) => !['skill', 'model'].includes(post.articleType));
    const featuredItems = selectPillarFeaturedPosts(articlePosts);
    const featuredSlugs = new Set(featuredItems.map(({ post }) => getPostSlug(post)));
    const remainingPosts = articlePosts.filter((post) => !featuredSlugs.has(getPostSlug(post))).slice(0, 6);
    // 搜索只看显示出来的那一版：英文页搜英文标题、结果链到英文文章
    const searchIndex = searchPosts.length ? searchPosts : posts;
    const searchable = en ? searchIndex.map((post) => view(post, en)).filter((post) => !/[一-鿿]/.test(post.title)) : searchIndex;

    // HERO 的 3D 场景只放真实数据：最新一篇实测 + 真实计数；英文页显示英文版字段
    const latestOriginal = articlePosts[0] || null;
    const latestPost = latestOriginal ? view(latestOriginal, en) : null;
    const latestCoverSource = latestOriginal?.cover || latestOriginal?.thumbnail || latestOriginal?.heroImage;
    const latestCover = typeof latestCoverSource === 'string'
      ? latestCoverSource
      : latestCoverSource?.url || latestCoverSource?.src || null;
    const heroTotals = {
      posts: searchIndex.length,
      products: (products || []).length,
      radar: radarPosts.length,
      lab: AI_LAB_TOOLS.length,
    };

    return (
      <HomeContext.Provider value={{ lang, t, en }}>
        <SEO
          title=""
          description={t(SITE_CONFIG.description)}
          url={homeHref(lang)}
          type="website"
          lang={lang}
        />
        <main className="page home-page">
          <div className="home-shell home-shell--v2">
            <SiteNavigation />
            <HomeHero
              t={t}
              lang={lang}
              latest={latestPost}
              latestCover={latestCover}
              products={products || []}
              totals={heroTotals}
              articlesHref={listHref(lang, 1)}
            />
            <MediaSection subMenus={subMenus} />
            <LabSection />
            <ProductSection products={products} />
            <ResourceSection posts={radarPosts} />

            {errorMessage && (
              <div className="empty-state" style={{ fontWeight: 600, color: '#ff8a80' }}>
                {errorMessage}
              </div>
            )}

            <section id="all-content" className="js-reveal">
              <div className="section-head">
                <div>
                  <div className="section-eyebrow">{t('文章归档')}</div>
                  <h2>{t('实测文章')}</h2>
                </div>
                <p>{t('想找哪次踩坑，直接搜；我的记性不一定比搜索框好。')}</p>
              </div>
              {posts.length > 0 && <div className="content-search"><Search posts={searchable} lang={lang} /></div>}
              <FeaturedSection items={featuredItems} />
              {showEmpty ? (
                <div className="empty-state">
              {t('暂无文章，请确认 Obsidian 内容库存在已发布文章。')}
                </div>
              ) : (
                <div className="feed-grid">
                  {remainingPosts.map((post) => (
                    <PostCard key={post.id || post.slug || post.rawId} post={post} />
                  ))}
                </div>
              )}
            </section>

            {!showEmpty && (
              <div className="archive-action"><Link className="hero-button hero-button--ghost" href={listHref(lang, 1)}>{t('查看全部文章')} →</Link></div>
            )}
            <SideSection />
            <footer className="home-footer">
              <b>{t('黑粉科技 · 实测记录')}</b><br />
              {t('本地部署 / 免费白嫖 / 自制软件')} —— {t('踩过的坑、测过的数据、亲手做的工具，全部交给你。')}<br />
              <span className="home-footer__mono">HYPHENTECH · HACKERCHI.TOP</span>
            </footer>
          </div>
      </main>
      </HomeContext.Provider>
    );
  } catch (error) {
    console.error('[pages/index] render failed:', error);
    return (
      <HomeContext.Provider value={{ lang, t, en }}>
        <SEO
          title=""
          description={t(SITE_CONFIG.description)}
          url={homeHref(lang)}
          type="website"
          lang={lang}
        />
        <main className="page home-page">
          <div className="empty-state" style={{ color: '#d93025', fontWeight: 600 }}>
            {t('首页渲染失败：')}{error?.message || t('未知错误，请查看构建日志。')}
          </div>
        </main>
      </HomeContext.Provider>
    );
  }
}
