import Link from 'next/link';
import { getPosts, getNotices, getSubMenus } from '../lib/notion';
import { NOTION_PROPERTY_NAME } from '../lib/config';

const PAGE_SIZE = 20;
const CATEGORY_FIELD = NOTION_PROPERTY_NAME.category || 'category';
const FEATURED_CATEGORIES = ['技术分享', '学习思考', '资源分享'];

const heroPalette = {
  accent1: '#69f0ae',
  accent2: '#00e5ff',
  accent3: '#b388ff',
  text: '#e9f6ff',
  muted: '#93a3b8',
  panel: 'rgba(6, 10, 18, 0.94)',
  panelAccent: 'rgba(4, 18, 26, 0.9)',
};

const feedPalette = {
  background: 'rgba(8, 14, 26, 0.82)',
  border: 'rgba(255, 255, 255, 0.14)',
  hoverBorder: 'rgba(105, 240, 174, 0.55)',
  title: '#f8fbff',
  meta: 'rgba(196, 208, 233, 0.8)',
  excerpt: 'rgba(226, 236, 255, 0.9)',
  badge: 'rgba(0, 229, 255, 0.12)',
};

const heroStyles = {
  wrapper: {
    borderRadius: '34px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'linear-gradient(135deg, rgba(8,14,26,0.95), rgba(2,24,30,0.95))',
    padding: 'clamp(28px, 5vw, 48px)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 30px 70px rgba(0,0,0,0.55)',
    marginBottom: '48px',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
    backgroundSize: '46px 46px',
    opacity: 0.4,
    pointerEvents: 'none',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '999px',
    border: `1px solid ${heroPalette.accent1}80`,
    padding: '6px 16px',
    fontSize: '0.85rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: heroPalette.accent1,
    background: `${heroPalette.accent1}1f`,
    marginBottom: '18px',
  },
  title: {
    fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
    margin: '0 0 16px',
    lineHeight: 1.25,
    color: heroPalette.text,
  },
  titleAccent: {
    display: 'inline-block',
    padding: '4px 16px',
    borderRadius: '18px',
    background:
      'linear-gradient(120deg, rgba(105,240,174,0.25), rgba(0,229,255,0.3))',
  },
  paragraph: {
    margin: 0,
    color: heroPalette.muted,
    fontSize: '1rem',
    lineHeight: 1.7,
    maxWidth: '720px',
  },
  hint: {
    marginTop: '14px',
    color: heroPalette.muted,
    fontSize: '0.95rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '18px',
    marginTop: '28px',
  },
  card: {
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    padding: '20px',
  },
  cardLabel: {
    textTransform: 'uppercase',
    fontSize: '0.8rem',
    letterSpacing: '0.08em',
    color: heroPalette.muted,
  },
  cardValue: {
    fontSize: '1.5rem',
    color: heroPalette.accent1,
    margin: '10px 0 6px',
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px',
  },
  cardValueUnit: {
    fontSize: '0.9rem',
    color: heroPalette.muted,
  },
  categoryList: {
    listStyle: 'none',
    margin: '12px 0 0',
    padding: 0,
    display: 'grid',
    gap: '10px',
  },
  categoryItem: {
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(5, 12, 24, 0.4)',
    padding: '10px 14px',
  },
  categoryItemLink: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: heroPalette.text,
    fontWeight: 600,
    fontSize: '0.95rem',
    textDecoration: 'none',
    gap: '12px',
  },
  categoryItemMeta: {
    color: heroPalette.muted,
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',
  },
  categoryItemExcerpt: {
    margin: '6px 0 0',
    color: heroPalette.muted,
    fontSize: '0.85rem',
    lineHeight: 1.4,
  },
  categoryItemEmpty: {
    margin: '8px 0 0',
    color: heroPalette.muted,
    fontSize: '0.9rem',
  },
  terminal: {
    borderRadius: '20px',
    border: `1px solid ${heroPalette.accent2}59`,
    background: `${heroPalette.accent2}14`,
    padding: '20px',
    fontSize: '0.95rem',
    color: heroPalette.text,
    minHeight: '180px',
  },
  prompt: { color: heroPalette.accent2 },
  timestamp: { color: heroPalette.accent3, marginRight: '8px' },
  layersCard: {
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.04)',
    background: heroPalette.panelAccent,
    padding: '20px',
  },
  layersTitle: {
    textTransform: 'uppercase',
    fontSize: '0.8rem',
    letterSpacing: '0.08em',
    color: heroPalette.muted,
    marginBottom: '14px',
  },
  layerList: { display: 'grid', gap: '12px' },
  layerItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '16px',
    padding: '12px 16px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: heroPalette.panel,
    color: heroPalette.muted,
    fontSize: '0.9rem',
    textDecoration: 'none',
  },
  layerLinkLabel: { color: heroPalette.text, fontSize: '1rem' },
};

const feedStyles = `
.feed-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: clamp(1.8rem, 3vw, 2.8rem);
}
.feed-card {
  border-radius: 28px;
  border: 1px solid ${feedPalette.border};
  background: ${feedPalette.background};
  box-shadow: 0 32px 70px rgba(0, 0, 0, 0.45);
  overflow: hidden;
  transition: border-color 220ms ease, transform 320ms ease, box-shadow 320ms ease;
}
.feed-card:hover {
  border-color: ${feedPalette.hoverBorder};
  transform: translateY(-6px);
  box-shadow: 0 38px 90px rgba(0, 229, 255, 0.25);
}
.feed-card__inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.post-cover img {
  width: 100%;
  border-radius: 0;
  border: 0;
  padding: 0;
  object-fit: cover;
  aspect-ratio: 16 / 9;
}
.feed-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1.5rem;
}
.feed-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${feedPalette.meta};
  font-size: 0.9rem;
}
.feed-card__tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.feed-card__tags span {
  padding: 0.15rem 0.65rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: ${feedPalette.badge};
  font-size: 0.82rem;
}
.feed-card__title {
  font-size: 1.4rem;
  margin: 0;
  color: ${feedPalette.title};
}
.feed-card__excerpt {
  margin: 0;
  color: ${feedPalette.excerpt};
  line-height: 1.6;
}
.feed-card__foot {
  margin-top: auto;
  display: flex,
  justify-content: space-between;
  align-items: center;
  color: ${heroPalette.accent1};
  font-weight: 600;
  letter-spacing: 0.12em;
  font-size: 0.85rem;
  text-transform: uppercase;
}
@media (max-width: 640px) {
  .feed-card {
    border-radius: 22px;
  }
}
`;

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

const formatTime = (dateString) => {
  if (!dateString) return '--:--';
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  } catch {
    return '--:--';
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

const truncateText = (text, maxLength = 80) =>
  text && text.length > maxLength ? `${text.slice(0, maxLength)}…` : text || '';

const extractNotionPropertyPayload = (property) => {
  if (!property || typeof property !== 'object') return property;
  if (property.type && property[property.type] !== undefined) {
    return property[property.type];
  }
  if (Array.isArray(property.multi_select)) return property.multi_select;
  if (property.select) return property.select;
  if (Array.isArray(property.results)) return property.results;
  if (property.value !== undefined) return property.value;
  return property;
};

const normalizeCategoryValue = (value) => {
  if (!value) return [];

  const handleRichText = (node) => {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (node.plain_text) return node.plain_text;
    if (node.text?.content) return node.text.content;
    if (node.name) return node.name;
    return '';
  };

  if (typeof value === 'string') {
    return value.trim() ? [value.trim()] : [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (!item) return '';
        if (typeof item === 'string') return item.trim();
        if (item.name) return item.name.trim();
        if (item.plain_text) return item.plain_text.trim();
        if (item.text?.content) return item.text.content.trim();
        return handleRichText(item).trim();
      })
      .filter(Boolean);
  }

  if (typeof value === 'object') {
    if (value.type || value.multi_select || value.select || value.results || value.value) {
      return normalizeCategoryValue(extractNotionPropertyPayload(value));
    }
    if (value.name) return [value.name.trim()];
    if (value.plain_text) return [value.plain_text.trim()];
    if (value.text?.content) return [value.text.content.trim()];
  }

  return [];
};

const getPostCategories = (post, propertyName) => {
  const candidates = [
    post?.[propertyName],
    post?.category,
    post?.Category,
    post?.categories,
    post?.Categories,
    post?.ext?.[propertyName],
    post?.ext?.category,
    post?.properties?.[propertyName],
    post?.properties?.[propertyName]?.value,
    post?.properties?.[propertyName]?.results,
    post?.properties?.[propertyName]?.multi_select,
  ];

  for (const candidate of candidates) {
    const payload = extractNotionPropertyPayload(candidate);
    const normalized = normalizeCategoryValue(payload);
    if (normalized.length) return normalized;
  }

  return [];
};

const buildFeaturedCategoryBuckets = (posts, propertyName, featuredNames) => {
  const map = new Map();

  const ensureBucket = (key) => {
    if (!map.has(key)) {
      map.set(key, []);
    }
    return map.get(key);
  };

  posts.forEach((post) => {
    const explicitNames = Array.isArray(post.categoryNames)
      ? post.categoryNames
      : [];
    const detectedNames =
      explicitNames.length > 0
        ? explicitNames
        : getPostCategories(post, propertyName);

    if (detectedNames.length === 0) {
      ensureBucket('未分类').push(post);
      return;
    }

    detectedNames.forEach((category) => {
      if (!category) return;
      ensureBucket(category).push(post);
    });
  });

  return featuredNames.map((name) => ({
    name,
    posts: (map.get(name) || []).sort(
      (a, b) => new Date(b?.date || 0) - new Date(a?.date || 0)
    ),
  }));
};

const PostCover = ({ cover }) => {
  if (!cover) return null;
  const src = typeof cover === 'string' ? cover : cover.url || cover.src;
  if (!src) return null;

  return (
    <div className="post-cover">
      <img src={src} alt="" loading="lazy" />
    </div>
  );
};

const PostCard = ({ post }) => {
  const slug = post.slug || post.rawId;
  const href = `/${slug}/`;
  const date = formatDate(post.date);
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const summaryText = truncateText(normalizeSummary(post.summary), 140);

  return (
    <article className="feed-card">
      <Link href={href}>
        <div className="feed-card__inner">
          <PostCover cover={post.cover || post.thumbnail || post.heroImage} />

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
              <span className="feed-card__cta">READ</span>
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
      </Link>
    </article>
  );
};

const HeroSection = ({
  notices = [],
  subMenus = [],
  categoryBuckets = [],
  categoryPropertyLabel = 'category',
}) => {
  const fallbackNotices = [
    { id: 'placeholder-1', title: '暂无 Notice 数据', date: null, summary: '' },
  ];
  const fallbackLinks = [
    {
      id: 'placeholder-link',
      title: '等待 SubMenu 链接',
      url: '#',
      summary: '',
    },
  ];

  const renderNotices = notices.length > 0 ? notices : fallbackNotices;
  const renderLinks = subMenus.length > 0 ? subMenus : fallbackLinks;
  const accentPool = [heroPalette.accent1, heroPalette.accent2, heroPalette.accent3];

  return (
    <section style={heroStyles.wrapper}>
      <div style={heroStyles.overlay} aria-hidden="true" />
      <div style={{ position: 'relative' }}>
        <div style={heroStyles.badge}>黑客驰 · fusion mode</div>
        <h1 style={heroStyles.title}>
          <span style={heroStyles.titleAccent}>
            黑客驰：分享 / 探索 / 进取
          </span>
        </h1>
        <p style={heroStyles.paragraph}>
          点赞、评论、转发
        </p>
        <p style={heroStyles.hint}>
          锚定 {FEATURED_CATEGORIES.join(' / ')} 三大内容分区，洞察知识脉络。
        </p>

        <div style={heroStyles.grid}>
          {categoryBuckets.map((bucket) => (
            <div key={bucket.name} style={heroStyles.card}>
              <div style={heroStyles.cardLabel}>
                {categoryPropertyLabel} · {bucket.name}
              </div>
              <div style={heroStyles.cardValue}>
                {bucket.posts.length || '0'}
                <span style={heroStyles.cardValueUnit}>篇</span>
              </div>
              {bucket.posts.length > 0 ? (
                <ul style={heroStyles.categoryList}>
                  {bucket.posts.slice(0, 2).map((post) => {
                    const slug = post.slug || post.rawId || post.id;
                    const href = `/${slug}/`;
                    const summaryText = normalizeSummary(post.summary);
                    const displaySummary = truncateText(summaryText, 72);
                    const dateText = formatDate(post.date);

                    return (
                      <li
                        key={`${bucket.name}-${post.id || post.slug || href}`}
                        style={heroStyles.categoryItem}
                      >
                        <Link href={href} style={heroStyles.categoryItemLink}>
                          <span>{post.title || slug || '未命名文章'}</span>
                          {dateText && (
                            <span style={heroStyles.categoryItemMeta}>
                              {dateText}
                            </span>
                          )}
                        </Link>
                        {displaySummary && (
                          <p style={heroStyles.categoryItemExcerpt}>
                            {displaySummary}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p style={heroStyles.categoryItemEmpty}>
                  暂无「{bucket.name}」内容，敬请期待。
                </p>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            ...heroStyles.grid,
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            marginTop: '32px',
          }}
        >
          <div style={heroStyles.terminal}>
            <div style={heroStyles.prompt}>┌─ hackerchi@lab</div>
            <div style={heroStyles.prompt}>└─$ tail -f notice.log</div>
            {renderNotices.map((notice) => (
              <div key={notice.id} style={{ marginTop: '4px', lineHeight: 1.4 }}>
                <span style={heroStyles.timestamp}>
                  [{formatTime(notice.date)}]
                </span>
                <strong>{notice.title}</strong>
                {notice.summary && ` — ${notice.summary}`}
              </div>
            ))}
          </div>

          <div style={heroStyles.layersCard}>
            <div style={heroStyles.layersTitle}>tactics matrix</div>
            <div style={heroStyles.layerList}>
              {renderLinks.map((link, index) => (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.url?.startsWith('#') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  style={{
                    ...heroStyles.layerItem,
                    borderColor: `${accentPool[index % accentPool.length]}33`,
                  }}
                >
                  <span>{link.title}</span>
                  <strong
                    style={{
                      ...heroStyles.layerLinkLabel,
                      color: accentPool[index % accentPool.length],
                    }}
                  >
                    访问
                  </strong>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export async function getStaticProps() {
  try {
    const [allPosts, notices, subMenus] = await Promise.all([
      getPosts(),
      getNotices(4),
      getSubMenus(3),
    ]);

    const pagePosts = allPosts.slice(0, PAGE_SIZE);
    const categoryBuckets = buildFeaturedCategoryBuckets(
      allPosts,
      CATEGORY_FIELD,
      FEATURED_CATEGORIES
    );

    return {
      props: {
        posts: pagePosts,
        notices,
        subMenus,
        categoryBuckets,
        currentPage: 1,
        totalPages: Math.max(1, Math.ceil(allPosts.length / PAGE_SIZE)),
        errorMessage:
          allPosts.length === 0 ? '暂无文章，请检查 Notion 数据库配置。' : '',
      },
    };
  } catch (error) {
    console.error('[pages/index] getStaticProps failed:', error);
    return {
      props: {
        posts: [],
        notices: [],
        subMenus: [],
        categoryBuckets: FEATURED_CATEGORIES.map((name) => ({
          name,
          posts: [],
        })),
        currentPage: 1,
        totalPages: 1,
        errorMessage:
          error?.message ||
          '获取数据失败，请检查 Notion 环境变量、数据库授权或字段配置。',
      },
    };
  }
}

export default function Home({
  posts,
  notices,
  subMenus,
  categoryBuckets,
  currentPage,
  totalPages,
  errorMessage,
}) {
  try {
    const showEmpty = posts.length === 0;

    return (
      <main
        className="page"
        style={{
          background: '#05060b',
          minHeight: '100vh',
          padding: '48px 20px',
        }}
      >
        <style>{feedStyles}</style>

        <HeroSection
          notices={notices}
          subMenus={subMenus}
          categoryBuckets={categoryBuckets}
          categoryPropertyLabel={CATEGORY_FIELD}
        />

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
          <section className="feed-grid">
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
        <HeroSection
          notices={notices}
          subMenus={subMenus}
          categoryBuckets={categoryBuckets || []}
          categoryPropertyLabel={CATEGORY_FIELD}
        />
        <div className="empty-state" style={{ color: '#d93025', fontWeight: 600 }}>
          首页渲染失败：{error?.message || '未知错误，请查看构建日志。'}
        </div>
      </main>
    );
  }
}
