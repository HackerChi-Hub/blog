import Link from 'next/link';
import Image from 'next/image';
import { getPosts, getNotices, getSubMenus, getPostCovers } from '../lib/notion';
import { NOTION_PROPERTY_NAME } from '../lib/config';
import { formatDate, normalizeSummary } from '../lib/utils';
import SEO from '../components/SEO';
import Search from '../components/Search';

const PAGE_SIZE = 21;
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

const CONTENT_PILLARS = [
  {
    id: 'local-ai',
    index: '01',
    title: '本地部署',
    subtitle: '把 AI 跑在自己的电脑上',
    description: 'Mac、MLX、Ollama 与消费级硬件的真实安装、速度和成本实测。',
    keywords: ['本地', 'MLX', 'Ollama', 'Apple Silicon', 'Mac'],
  },
  {
    id: 'free-ai',
    index: '02',
    title: '免费白嫖',
    subtitle: '把付费工作流换成免费方案',
    description: '免费额度、开源平替和省钱攻略，同时说清限制、门槛与代价。',
    keywords: ['免费', '白嫖', '开源', '限免', '省钱'],
  },
  {
    id: 'made-by-me',
    index: '03',
    title: '自制软件',
    subtitle: '从问题到产品，公开开发过程',
    description: 'LocalBrain、ScreenLex 与其他自制工具的发布、失败记录和版本迭代。',
    keywords: ['LocalBrain', 'ScreenLex', '自制', '工具', '开发'],
  },
];

const PRODUCT_DEFINITIONS = [
  {
    slug: 'localbrain-local-ai-box',
    name: 'LocalBrain',
    label: '本地 AI 工具箱',
    description: '把 Mac 变成私有 AI 盒子：本地转写、配音、生图、视频和 MCP 工具一站管理。',
    badge: '我做的 · 本地部署',
  },
  {
    slug: 'screenlex-watch-and-learn',
    name: 'ScreenLex',
    label: '光影词库',
    description: '把本地电影与剧集字幕变成可复习的英语词库，全程离线。',
    badge: '我做的 · 本地工具',
  },
];

const LAB_TOOLS = [
  { href: '/ai-hardware-survey/', icon: '◫', title: 'AI 装机指南', desc: '本地 AI 设备全景对比' },
  { href: '/llm-guide/', icon: '⌘', title: '本地 LLM 指南', desc: 'Ollama · LM Studio · GGUF' },
  { href: '/mlx-model-test.html', icon: '△', title: 'MLX 模型测试', desc: 'M5 Pro 本地模型深度评测' },
  { href: '/radar/', icon: '◉', title: '新闻雷达', desc: '重大 AI 发布与技术动态' },
  { href: '/wifi/', icon: '≋', title: 'WiFi Finder', desc: '全球公共 WiFi 密码查询' },
  { href: '/shortcuts/', icon: '⌨', title: '快捷键大全', desc: 'Windows / Mac 快捷键速查' },
  { href: '/agent-comparison.html', icon: '≠', title: 'AI Agent 三国杀', desc: '三大 Agent 实战对比' },
  { href: '/games/', icon: '◇', title: '游戏中心', desc: '浏览器可玩像素小游戏' },
];

const MEDIA_CHANNELS = [
  {
    id: 'bilibili',
    name: 'B站',
    title: 'B站首发',
    description: '长视频主场。先跑、先踩坑，再把结果端上来。',
    action: '去主场围观',
    pattern: /B站|哔哩/i,
    fallbackUrl: 'https://space.bilibili.com/1846717524',
    accent: '#ffd34d',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    title: '油管同步',
    description: '同片同步，欢迎跨时区来监督我有没有偷懒。',
    action: '去油管看看',
    pattern: /YouTube|油管/i,
    fallbackUrl: 'https://www.youtube.com/@hyphentech_top',
    accent: '#ff6b6b',
  },
  {
    id: 'channels',
    name: '视频号',
    title: '视频号刷',
    description: '竖屏精华版，等电梯的时间也能刷完一个坑。',
    action: '微信搜黑粉科技',
    pattern: /视频号|微信视频/i,
    fallbackUrl: '#media-notice',
    accent: '#5ce1df',
  },
  {
    id: 'wechat',
    name: '公众号',
    title: '公众号读',
    description: '长文复盘和完整教程，适合收藏，不适合假装看过。',
    action: '微信搜黑粉科技',
    pattern: /公众号|微信公众/i,
    fallbackUrl: '#media-notice',
    accent: '#69f0ae',
  },
];

const heroStyles = {
  wrapper: {
    borderRadius: '0 0 34px 34px',
    border: '1px solid rgba(255,255,255,0.08)',
    borderTop: 'none',
    background: 'linear-gradient(135deg, rgba(8,14,26,0.95), rgba(2,24,30,0.95))',
    padding: 'clamp(28px, 5vw, 48px)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 30px 70px rgba(0,0,0,0.55)',
    marginTop: 0,
    marginBottom: 'clamp(0.006rem, 0.01vw, 0.0093rem)',
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
  // 让”黑粉科技 · 官网”保留原来上面的圆角外边框外观
  badgeLikeTitle: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '999px',
    border: `1px solid ${heroPalette.accent1}80`,
    padding: '10px 26px',
    fontSize: 'clamp(1.6rem, 3.4vw, 2.1rem)',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: heroPalette.text,
    background: 'rgba(5, 28, 24, 0.6)',
    boxShadow: '0 18px 38px rgba(0,0,0,0.55)',
    whiteSpace: 'nowrap',
  },
  // 标题行容器：左”黑粉科技 · 官网”，右”分享 / 探索 / 进取”
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '14px',
    justifyContent: 'space-between',
  },
  // 右侧：分享 / 探索 / 进取 的高亮标签
  subTitleAccent: {
    display: 'inline-block',
    padding: '10px 26px',
    borderRadius: '999px',
    background:
      'linear-gradient(120deg, rgba(8, 125, 114, 0.96), rgba(0, 150, 136, 0.92))',
    fontSize: 'clamp(1.6rem, 3.4vw, 2.1rem)',
    fontWeight: 700,
    color: heroPalette.text,
    whiteSpace: 'nowrap',
    boxShadow: '0 18px 38px rgba(0,0,0,0.55)',
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
    gap: '20px',
    marginTop: '32px',
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
.home-shell {
  --home-yellow: #ffd34d;
  --home-cyan: #5ce1df;
  --home-panel: rgba(12, 20, 34, 0.88);
  --home-border: rgba(157, 224, 232, 0.15);
  display: grid;
  gap: clamp(2.2rem, 4.5vw, 4rem);
}
.home-nav {
  position: sticky;
  top: 14px;
  z-index: 20;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 18px;
  background: rgba(7, 12, 22, .82);
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 45px rgba(0,0,0,.28);
}
.home-brand {
  display: inline-flex;
  align-items: center;
  justify-self: start;
  gap: .7rem;
  color: #f7fbff;
  font-weight: 800;
  letter-spacing: .08em;
}
.home-brand img { width: 34px; height: 34px; object-fit: contain; }
.home-nav__links { display: flex; align-items: center; justify-self: center; gap: 1.2rem; }
.home-nav__links a { color: rgba(226,236,250,.76); font-size: .9rem; }
.home-nav__links a:hover { color: #fff; }
.hero-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: .75rem 1.15rem;
  border-radius: 12px;
  border: 1px solid rgba(255,211,77,.48);
  background: var(--home-yellow);
  color: #10141b;
  font-weight: 800;
  box-shadow: 0 12px 30px rgba(255,211,77,.16);
}
.hero-button:hover { color: #05070b; opacity: .92; }
.hero-button--ghost {
  background: rgba(255,255,255,.04);
  border-color: rgba(255,255,255,.18);
  color: #edf7ff;
  box-shadow: none;
}
.hero-button--ghost:hover { color: #fff; border-color: rgba(92,225,223,.55); }
.brand-hero {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, .55fr);
  gap: clamp(2rem, 5vw, 5rem);
  align-items: center;
  padding: clamp(2.2rem, 6vw, 5.2rem);
  border: 1px solid var(--home-border);
  border-radius: 34px;
  background:
    radial-gradient(circle at 88% 20%, rgba(92,225,223,.22), transparent 32%),
    linear-gradient(135deg, rgba(8,14,25,.98), rgba(6,28,34,.96));
  box-shadow: 0 36px 90px rgba(0,0,0,.5);
}
.brand-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
  background-size: 42px 42px;
  pointer-events: none;
}
.brand-hero__content,
.brand-hero__visual { position: relative; z-index: 1; }
.brand-hero__eyebrow,
.section-eyebrow {
  color: var(--home-cyan);
  font-family: 'JetBrains Mono', 'SFMono-Regular', monospace;
  font-size: .8rem;
  letter-spacing: .16em;
  text-transform: uppercase;
}
.brand-hero h1 {
  max-width: 820px;
  margin: .85rem 0 1.15rem;
  color: #f8fbff;
  font-size: clamp(2.45rem, 6.2vw, 5.4rem);
  line-height: 1.06;
  letter-spacing: -.045em;
}
.brand-hero h1 em { color: var(--home-yellow); font-style: normal; }
.brand-hero__lead {
  max-width: 690px;
  margin: 0;
  color: rgba(228,238,250,.82);
  font-size: clamp(1rem, 1.6vw, 1.18rem);
  line-height: 1.8;
}
.hero-actions { display: flex; flex-wrap: wrap; gap: .8rem; margin-top: 1.6rem; }
.hero-pills { display: flex; flex-wrap: wrap; gap: .55rem; margin-top: 1.6rem; }
.hero-pills span {
  padding: .38rem .75rem;
  border-radius: 999px;
  border: 1px solid rgba(92,225,223,.22);
  background: rgba(92,225,223,.07);
  color: rgba(225,245,247,.84);
  font-size: .82rem;
}
.brand-hero__visual {
  min-height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
.brand-orbit {
  width: min(100%, 330px);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid rgba(92,225,223,.22);
  background: radial-gradient(circle, rgba(20,48,59,.95), rgba(7,14,25,.66) 60%, transparent 61%);
  box-shadow: inset 0 0 65px rgba(92,225,223,.12), 0 0 70px rgba(92,225,223,.08);
}
.brand-orbit img { width: 57%; height: auto; border: 0; background: transparent; }
.brand-proof {
  position: static;
  width: min(100%, 270px);
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(6,12,22,.84);
  backdrop-filter: blur(14px);
  color: rgba(226,237,248,.78);
  font-size: .82rem;
  line-height: 1.7;
}
.brand-proof strong { display: block; color: #fff; font-size: .95rem; }
.media-section {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: 1rem;
}
.notice-feature,
.media-matrix {
  overflow: hidden;
  border: 1px solid var(--home-border);
  border-radius: 26px;
  background: var(--home-panel);
}
.notice-feature {
  position: relative;
  display: grid;
  grid-template-columns: 1fr minmax(120px, 185px);
  min-height: 310px;
  padding: clamp(1.5rem, 3.5vw, 2.5rem);
  background:
    radial-gradient(circle at 92% 15%, rgba(255,211,77,.2), transparent 35%),
    linear-gradient(135deg, rgba(17,26,42,.98), rgba(9,24,29,.94));
}
.notice-feature__copy { position: relative; z-index: 1; align-self: center; }
.notice-feature__mark { color: var(--home-yellow); font-size: 2.3rem; line-height: 1; }
.notice-feature h2,
.media-matrix h2 { margin: .55rem 0 .8rem; color: #fff; font-size: clamp(1.75rem, 3vw, 2.4rem); }
.notice-feature blockquote {
  margin: 0;
  color: rgba(235,242,250,.88);
  font-size: clamp(1.05rem, 1.8vw, 1.3rem);
  line-height: 1.65;
}
.notice-feature p { margin: .85rem 0 0; color: rgba(196,208,233,.68); line-height: 1.6; }
.notice-feature__date { display: block; margin-top: 1rem; color: var(--home-cyan); font-family: monospace; font-size: .78rem; }
.notice-feature__image {
  align-self: center;
  justify-self: end;
  width: min(100%, 170px);
  aspect-ratio: 1;
  padding: .55rem;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 18px 45px rgba(0,0,0,.35);
}
.notice-feature__image img { width: 100%; height: 100%; object-fit: contain; border: 0; border-radius: 12px; }
.media-matrix { padding: clamp(1.25rem, 3vw, 2rem); }
.media-matrix__head { display: flex; align-items: end; justify-content: space-between; gap: 1rem; }
.media-matrix__head p { max-width: 260px; margin: 0 0 .35rem; color: rgba(196,208,233,.66); font-size: .82rem; }
.media-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: .75rem; margin-top: 1rem; }
.media-card {
  min-height: 135px;
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.09);
  background: rgba(255,255,255,.025);
  transition: transform .2s ease, border-color .2s ease;
}
.media-card:hover { transform: translateY(-3px); border-color: var(--channel-accent); }
.media-card__name { color: var(--channel-accent); font-size: .75rem; font-weight: 800; letter-spacing: .08em; }
.media-card strong { display: block; margin: .5rem 0 .35rem; color: #fff; font-size: 1.05rem; }
.media-card p { margin: 0; color: rgba(209,222,236,.68); font-size: .8rem; line-height: 1.5; }
.media-card__action { display: block; margin-top: .7rem; color: rgba(244,249,255,.9); font-size: .76rem; }
.section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.4rem;
}
.section-head h2 {
  margin: .35rem 0 0;
  color: #f8fbff;
  font-size: clamp(1.8rem, 4vw, 3rem);
  line-height: 1.15;
  letter-spacing: -.025em;
}
.section-head p { max-width: 560px; margin: 0; color: rgba(196,208,233,.72); }
.featured-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, .75fr);
  gap: 1rem;
}
.featured-stack { display: grid; gap: 1rem; }
.featured-card {
  position: relative;
  min-height: 248px;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid var(--home-border);
  background: #0a1220;
  box-shadow: 0 24px 60px rgba(0,0,0,.32);
}
.featured-card--primary { min-height: 510px; }
.featured-card__cover { position: absolute; inset: 0; }
.featured-card__cover img { width: 100%; height: 100%; object-fit: cover; border: 0; border-radius: 0; }
.featured-card__cover::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(5,8,14,.02) 10%, rgba(5,8,14,.96) 92%);
}
.featured-card__body {
  position: absolute;
  inset: auto 0 0;
  z-index: 1;
  padding: clamp(1.25rem, 3vw, 2.2rem);
}
.featured-card__meta { color: var(--home-cyan); font-size: .82rem; letter-spacing: .08em; }
.featured-card h3 { margin: .55rem 0 .65rem; color: #fff; font-size: clamp(1.25rem, 2.6vw, 2.2rem); line-height: 1.28; }
.featured-card:not(.featured-card--primary) h3 { font-size: 1.2rem; }
.featured-card p { margin: 0; color: rgba(229,238,248,.78); line-height: 1.65; }
.featured-card:not(.featured-card--primary) p { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-size: .88rem; }
.product-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.product-card {
  position: relative;
  overflow: hidden;
  min-height: 320px;
  padding: clamp(1.5rem, 3.5vw, 2.4rem);
  border-radius: 26px;
  border: 1px solid rgba(92,225,223,.18);
  background: linear-gradient(140deg, rgba(9,20,34,.97), rgba(8,34,38,.9));
  box-shadow: 0 25px 60px rgba(0,0,0,.32);
}
.product-card::after {
  content: '';
  position: absolute;
  width: 260px;
  height: 260px;
  right: -80px;
  top: -90px;
  border-radius: 50%;
  background: rgba(92,225,223,.09);
  filter: blur(2px);
}
.product-card__badge { color: var(--home-yellow); font-size: .78rem; letter-spacing: .08em; }
.product-card h3 { margin: 1.3rem 0 .15rem; color: #fff; font-size: clamp(2rem, 4vw, 3.4rem); letter-spacing: -.04em; }
.product-card h4 { margin: 0 0 1rem; color: var(--home-cyan); font-size: 1rem; font-weight: 650; }
.product-card p { max-width: 520px; margin: 0 0 1.5rem; color: rgba(220,233,246,.76); }
.product-card__link { color: #fff; }
.product-card__date { color: rgba(255,255,255,.48); font-size: .8rem; }
.lab-section {
  padding: clamp(1.4rem, 4vw, 2.8rem);
  border: 1px solid var(--home-border);
  border-radius: 28px;
  background: rgba(7,14,25,.8);
}
.lab-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .75rem; }
.lab-tool {
  display: flex;
  align-items: center;
  gap: .8rem;
  min-height: 92px;
  padding: 1rem;
  border-radius: 15px;
  border: 1px solid rgba(255,255,255,.09);
  background: rgba(255,255,255,.025);
}
.lab-tool:hover { border-color: rgba(92,225,223,.45); background: rgba(92,225,223,.05); }
.lab-tool__icon { width: 34px; color: var(--home-cyan); font-size: 1.35rem; text-align: center; }
.lab-tool strong { display: block; color: #eef8ff; font-size: .9rem; }
.lab-tool small { display: block; margin-top: .15rem; color: rgba(196,208,233,.62); font-size: .73rem; line-height: 1.4; }
.feed-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: clamp(1.8rem, 3vw, 2.8rem);
}
.content-search { max-width: 640px; margin: 0 0 1.4rem; }
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
.post-cover {
  position: relative;
  aspect-ratio: 16 / 9;
  background: rgba(9, 14, 28, 0.72);
  overflow: hidden;
}
.post-cover img {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 0;
  border: 0;
  padding: 0;
  object-fit: cover;
}
.cover-visual { position: relative; width: 100%; height: 100%; overflow: hidden; background: #0a1220; }
.cover-visual > img { position: relative; z-index: 1; width: 100%; height: 100%; object-fit: cover; }
.cover-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.2rem;
  background:
    linear-gradient(135deg, rgba(92,225,223,.17), transparent 48%),
    repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 1px, transparent 1px 28px),
    #091321;
}
.cover-fallback span { color: var(--home-yellow); font-family: monospace; font-size: .72rem; letter-spacing: .1em; }
.cover-fallback strong { max-width: 90%; margin-top: .45rem; color: #f5f9ff; font-size: clamp(1rem, 2vw, 1.4rem); line-height: 1.3; }
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
  line-height: 1.35;
}
.feed-card__excerpt {
  margin: 0;
  color: ${feedPalette.excerpt};
  line-height: 1.6;
}
.feed-card__foot {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${heroPalette.accent1};
  font-weight: 600;
  letter-spacing: 0.12em;
  font-size: 0.85rem;
}
.feed-card__cta { letter-spacing: .06em; }
@media (max-width: 900px) {
  .home-nav { grid-template-columns: 1fr; }
  .home-nav__links { display: none; }
  .brand-hero { grid-template-columns: 1fr; }
  .brand-hero__visual { min-height: 260px; }
  .brand-orbit { max-width: 250px; }
  .media-section { grid-template-columns: 1fr; }
  .featured-grid { grid-template-columns: 1fr; }
  .featured-card--primary { min-height: 430px; }
  .featured-stack { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .product-grid { grid-template-columns: 1fr; }
  .lab-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
}
@media (max-width: 640px) {
  .home-nav { top: 8px; padding: .65rem .75rem; }
  .home-brand { font-size: .88rem; }
  .brand-hero { padding: 1.5rem; border-radius: 24px; }
  .brand-hero h1 { font-size: clamp(2.2rem, 12vw, 3.25rem); }
  .brand-hero__lead { font-size: .94rem; }
  .brand-hero__visual { min-height: 220px; }
  .brand-orbit { max-width: 205px; }
  .brand-proof { width: 100%; max-width: 270px; padding: .75rem; }
  .notice-feature { grid-template-columns: 1fr; min-height: 0; }
  .notice-feature__image { justify-self: start; width: 132px; margin-top: 1.1rem; }
  .media-matrix__head { display: block; }
  .media-matrix__head p { margin-top: .5rem; }
  .media-grid { grid-template-columns: 1fr; }
  .hero-actions { display: grid; grid-template-columns: 1fr; }
  .section-head { display: block; }
  .section-head p { margin-top: .7rem; }
  .featured-card--primary { min-height: 400px; }
  .featured-stack { grid-template-columns: 1fr; }
  .featured-card { min-height: 280px; }
  .featured-card p { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .product-card { min-height: 280px; padding: 1.35rem; }
  .lab-grid { grid-template-columns: 1fr; }
  .feed-grid { grid-template-columns: 1fr; gap: 1rem; }
  .feed-card {
    border-radius: 22px;
  }
  .feed-card__body { padding: 1.15rem; }
  .feed-card__meta { align-items: flex-start; flex-direction: column; gap: .55rem; }
  .feed-card__title { font-size: 1.22rem; }
  .feed-card__excerpt { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-size: .9rem; }
}
`;

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

const CoverVisual = ({ cover, title, label = '黑粉科技 · 实测记录' }) => {
  const src = typeof cover === 'string' ? cover : cover?.url || cover?.src;
  return (
    <div className="cover-visual">
      <div className="cover-fallback">
        <span>{label}</span>
        <strong>{truncateText(title, 40)}</strong>
      </div>
      {src && (
        <Image
          src={src}
          alt=""
          width={1000}
          height={563}
          loading="lazy"
          unoptimized
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      )}
    </div>
  );
};

const PostCover = ({ post }) => (
  <div className="post-cover">
    <CoverVisual
      cover={post.cover || post.thumbnail || post.heroImage}
      title={post.title || getPostSlug(post)}
      label={getPostPillarLabels(post).join(' × ')}
    />
  </div>
);

const PostCard = ({ post }) => {
  const slug = post.slug || post.rawId;
  const href = `/${slug}/`;
  const date = formatDate(post.date);
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const summaryText = truncateText(normalizeSummary(post.summary), 140);

  return (
    <article className="feed-card">
      <a href={href}>
        <div className="feed-card__inner">
          <PostCover post={post} />

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
              <span className="feed-card__cta">阅读全文</span>
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

const FeaturedCard = ({ post, primary = false }) => {
  if (!post) return null;
  const slug = getPostSlug(post);
  const cover = post.cover || post.thumbnail || post.heroImage;
  const labels = getPostPillarLabels(post);

  return (
    <article className={`featured-card${primary ? ' featured-card--primary' : ''}`}>
      <a href={`/${slug}/`} aria-label={post.title || slug}>
        <div className="featured-card__cover">
          <CoverVisual cover={cover} title={post.title || slug} label={labels.join(' × ')} />
        </div>
        <div className="featured-card__body">
          <div className="featured-card__meta">
            {formatDate(post.date)} · {labels.join(' × ')}
          </div>
          <h3>{post.title || slug}</h3>
          <p>{truncateText(normalizeSummary(post.summary), primary ? 150 : 86)}</p>
        </div>
      </a>
    </article>
  );
};

const SiteNavigation = () => (
  <nav className="home-nav" aria-label="主导航">
    <a className="home-brand" href="#top">
      <img src="/png/logo-icon-traced.png?v=2" alt="" />
      <span>黑粉科技</span>
    </a>
    <div className="home-nav__links">
      <a href="#media">媒体矩阵</a>
      <a href="#latest">最近折腾</a>
      <a href="#products">我的工具</a>
      <a href="#lab">实用工具</a>
    </div>
  </nav>
);

const BrandHero = () => (
    <header className="brand-hero" id="top">
      <div className="brand-hero__content">
        <div className="brand-hero__eyebrow">有台 M5 Pro 的实干派</div>
        <h1>
          不花钱，把 AI<br /><em>跑起来</em>
        </h1>
        <p className="brand-hero__lead">
          我是黑粉科技，一个有台 M5 Pro 的实干派。我把 AI 跑在自己的机器上，
          把踩过的坑、测过的数据和亲手做的工具，全部交给你。
        </p>
        <div className="hero-actions">
          <a className="hero-button" href="#latest">看我最近折腾啥</a>
          <a className="hero-button hero-button--ghost" href="#media">找到全部频道</a>
        </div>
        <div className="hero-pills" aria-label="频道主线">
          <span>本地部署</span>
          <span>免费白嫖</span>
          <span>自制软件</span>
          <span>真实数据与失败记录</span>
        </div>
      </div>
      <div className="brand-hero__visual" aria-hidden="true">
        <div className="brand-orbit">
          <img src="/png/avatar-800x800.png" alt="" />
        </div>
        <div className="brand-proof">
          <strong>M5 Pro 64 GB · 实机环境</strong>
          不复读参数，只记录安装、速度、内存、限制和最终成片。
        </div>
      </div>
  </header>
);

const MediaSection = ({ notices = [], subMenus = [] }) => {
  const notice = notices[0] || {
    title: '掌握 AI 的人，将成为各个领域的王者。',
    summary: '让普通人也能驾驭 AI。',
  };
  const noticeImage =
    notice.image ||
    '/downloads/notice-2f5f9643-2011-4e3c-9fcb-17e544c87e89-qrcode_for_gh_1b-90a27ee8.jpg';
  const channels = MEDIA_CHANNELS.map((channel) => {
    const matched = subMenus.find((link) => channel.pattern.test(link?.title || ''));
    return { ...channel, url: matched?.url || channel.fallbackUrl };
  });

  return (
    <section className="media-section" id="media">
      <article className="notice-feature" id="media-notice">
        <div className="notice-feature__copy">
          <div className="section-eyebrow">频道公告</div>
          <div className="notice-feature__mark">“</div>
          <h2>先说句人话</h2>
          <blockquote>{notice.title}</blockquote>
          <span className="notice-feature__date">不追玄学，只交作业。</span>
        </div>
        <div className="notice-feature__image">
          <img src={noticeImage} alt="黑粉科技公众号二维码" />
        </div>
      </article>

      <div className="media-matrix" id="channels">
        <div className="media-matrix__head">
          <div>
            <div className="section-eyebrow">媒体矩阵</div>
            <h2>频道都在这</h2>
          </div>
          <p>平台不同，黑粉还是同一个黑粉。</p>
        </div>
        <div className="media-grid">
          {channels.map((channel) => {
            const external = /^https?:\/\//.test(channel.url);
            return (
              <a
                className="media-card"
                href={channel.url}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                style={{ '--channel-accent': channel.accent }}
                key={channel.id}
              >
                <span className="media-card__name">{channel.name}</span>
                <strong>{channel.title}</strong>
                <p>{channel.description}</p>
                <span className="media-card__action">{channel.action} →</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const FeaturedSection = ({ posts = [] }) => {
  const featured = posts.slice(0, 3);
  if (!featured.length) return null;

  return (
    <section id="latest">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">最新内容</div>
          <h2>最近折腾</h2>
        </div>
        <p>成功了给你抄作业，失败了给你省时间；总得留下点什么。</p>
      </div>
      <div className="featured-grid">
        <FeaturedCard post={featured[0]} primary />
        <div className="featured-stack">
          <FeaturedCard post={featured[1]} />
          <FeaturedCard post={featured[2]} />
        </div>
      </div>
    </section>
  );
};

const ProductSection = ({ posts = [] }) => (
  <section id="products">
    <div className="section-head">
      <div>
        <div className="section-eyebrow">自制软件</div>
        <h2>我的工具</h2>
      </div>
      <p>遇到问题，先找工具；找不到，就自己写一个。多少有点不服气。</p>
    </div>
    <div className="product-grid">
      {PRODUCT_DEFINITIONS.map((product) => {
        const article = posts.find((post) => getPostSlug(post) === product.slug);
        return (
          <article className="product-card" key={product.slug}>
            <div className="product-card__badge">{product.badge}</div>
            <h3>{product.name}</h3>
            <h4>{product.label}</h4>
            <p>{product.description}</p>
            <a className="product-card__link" href={`/${product.slug}/`}>
              了解产品与开发故事 →
            </a>
            {article?.date && <div className="product-card__date">最近更新：{formatDate(article.date)}</div>}
          </article>
        );
      })}
    </div>
  </section>
);

const LabSection = () => (
  <section className="lab-section" id="lab">
    <div className="section-head">
      <div>
        <div className="section-eyebrow">在线工具</div>
        <h2>实用工具</h2>
      </div>
      <p>能点、能查、能直接用。工具就别写小作文了。</p>
    </div>
    <div className="lab-grid">
      {LAB_TOOLS.map((tool) => (
        <a className="lab-tool" href={tool.href} key={tool.href}>
          <span className="lab-tool__icon">{tool.icon}</span>
          <span>
            <strong>{tool.title}</strong>
            <small>{tool.desc}</small>
          </span>
        </a>
      ))}
    </div>
  </section>
);

export async function getStaticProps() {
  try {
    const [allPosts, notices, subMenus] = await Promise.all([
      getPosts(),
      getNotices(4),
      getSubMenus(12),
    ]);

    const pagePosts = allPosts.slice(0, PAGE_SIZE);

    // 批量获取文章封面图
    const coverMap = await getPostCovers(pagePosts);
    const postsWithCovers = pagePosts.map((post) => ({
      ...post,
      cover: coverMap[post.id] || null,
    }));

    const categoryBuckets = buildFeaturedCategoryBuckets(
      allPosts,
      CATEGORY_FIELD,
      FEATURED_CATEGORIES
    );

    return {
      props: {
        posts: postsWithCovers,
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
  currentPage,
  totalPages,
  errorMessage,
}) {
  try {
    const showEmpty = posts.length === 0;
    const remainingPosts = posts.length > 3 ? posts.slice(3) : posts;

    return (
      <>
        <SEO
          title=""
          description="黑粉科技：本地部署、免费白嫖与自制软件的真实实测和开发记录。"
          url="/"
          type="website"
        />
        <main
          className="page"
          style={{
            background: '#05060b',
            minHeight: '100vh',
            padding: '48px 20px',
          }}
        >
          <style suppressHydrationWarning>{feedStyles}</style>
          <div className="home-shell">
            <SiteNavigation />
            <BrandHero />
            <MediaSection notices={notices} subMenus={subMenus} />
            <FeaturedSection posts={posts} />
            <ProductSection posts={posts} />

            {errorMessage && (
              <div className="empty-state" style={{ fontWeight: 600, color: '#ff8a80' }}>
                {errorMessage}
              </div>
            )}

            <section id="all-content">
              <div className="section-head">
                <div>
                  <div className="section-eyebrow">文章归档</div>
                  <h2>更多实测</h2>
                </div>
                <p>想找哪次踩坑，直接搜；我的记性不一定比搜索框好。</p>
              </div>
              {posts.length > 0 && <div className="content-search"><Search posts={posts} /></div>}
              {showEmpty ? (
                <div className="empty-state">
                  暂无文章，请确认 Notion 数据库已授权并正确配置 Published 字段。
                </div>
              ) : (
                <div className="feed-grid">
                  {remainingPosts.map((post) => (
                    <PostCard key={post.id || post.slug || post.rawId} post={post} />
                  ))}
                </div>
              )}
            </section>

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

            <LabSection />
          </div>
      </main>
      </>
    );
  } catch (error) {
    console.error('[pages/index] render failed:', error);
    return (
      <>
        <SEO
          title=""
          description="黑粉科技：本地部署、免费白嫖与自制软件。"
          url="/"
          type="website"
        />
        <main className="page">
          <BrandHero subMenus={subMenus} />
          <div className="empty-state" style={{ color: '#d93025', fontWeight: 600 }}>
            首页渲染失败：{error?.message || '未知错误，请查看构建日志。'}
          </div>
        </main>
      </>
    );
  }
}
