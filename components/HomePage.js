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
import { SITE_CONFIG } from '../lib/seo';
import { makeT } from '../lib/blog-i18n.cjs';
import { homeHref, listHref } from '../lib/site-lang.cjs';

const BRAND_SLOGAN = SITE_CONFIG.slogan;
const WECHAT_QR_IMAGE = '/png/wechat-official-account-qr.jpg';

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

const {
  CONTENT_PILLARS,
  AI_LAB_TOOLS,
  SIDE_TOOLS,
  MEDIA_CHANNELS,
} = require('../lib/home-content.cjs');

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
.section-eyebrow {
  color: var(--home-cyan);
  font-family: 'JetBrains Mono', 'SFMono-Regular', monospace;
  font-size: .8rem;
  letter-spacing: .16em;
  text-transform: uppercase;
}
.brand-hero__eyebrow {
  color: var(--home-cyan);
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  font-weight: 700;
  letter-spacing: .04em;
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
  color: #f5f9ff;
  font-size: clamp(1.45rem, 2.5vw, 2rem);
  font-weight: 780;
  letter-spacing: -.018em;
  line-height: 1.48;
  text-wrap: balance;
  white-space: pre-line;
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
  position: relative;
  min-height: 135px;
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.09);
  background: rgba(255,255,255,.025);
  transition: transform .2s ease, border-color .2s ease;
}
.media-card:hover { transform: translateY(-3px); border-color: var(--channel-accent); }
.media-card--primary {
  border-color: rgba(255,211,77,.34);
  background: linear-gradient(145deg, rgba(255,211,77,.075), rgba(255,255,255,.025));
  box-shadow: inset 0 1px rgba(255,255,255,.035), 0 14px 30px rgba(0,0,0,.16);
}
.media-card__flag {
  position: absolute;
  top: .8rem;
  right: .8rem;
  padding: .2rem .48rem;
  border-radius: 999px;
  background: rgba(255,211,77,.13);
  color: var(--home-yellow);
  font-size: .62rem;
  font-weight: 800;
  letter-spacing: .08em;
}
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
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid var(--home-border);
  background: #0a1220;
  box-shadow: 0 24px 60px rgba(0,0,0,.32);
}
.featured-card > a { display: flex; flex-direction: column; height: 100%; }
.featured-card__cover {
  position: relative;
  flex: 0 0 auto;
  aspect-ratio: 2.35 / 1;
  overflow: hidden;
  background: #09131f;
}
.featured-card__body {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: clamp(1rem, 2.5vw, 1.75rem);
  overflow: hidden;
  border-top: 1px solid rgba(255,255,255,.1);
  background: linear-gradient(145deg, rgba(5,10,18,.99), rgba(7,17,28,.97));
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.06);
}
.featured-card__meta {
  display: inline-flex;
  width: fit-content;
  max-width: 100%;
  padding: .32rem .58rem;
  border: 1px solid rgba(92,225,223,.24);
  border-radius: 999px;
  background: rgba(3,13,19,.86);
  color: #72f4ee;
  font-size: .78rem;
  font-weight: 750;
  letter-spacing: .065em;
  line-height: 1.25;
}
.featured-card h3 {
  display: -webkit-box;
  margin: .65rem 0 .6rem;
  overflow: hidden;
  color: #fff;
  font-size: clamp(1.3rem, 2.45vw, 2.15rem);
  font-weight: 850;
  line-height: 1.25;
  letter-spacing: -.025em;
  text-wrap: balance;
  text-shadow: 0 2px 12px rgba(0,0,0,.72);
  word-break: break-word;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.featured-card:not(.featured-card--primary) h3 {
  margin: .52rem 0 .45rem;
  font-size: 1.1rem;
  line-height: 1.3;
  -webkit-line-clamp: 2;
}
.featured-card p {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: rgba(235,243,252,.84);
  line-height: 1.55;
  text-shadow: 0 1px 8px rgba(0,0,0,.55);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.featured-card:not(.featured-card--primary) p {
  font-size: .82rem;
  line-height: 1.45;
  -webkit-line-clamp: 1;
}
.featured-card a:focus-visible .featured-card__body {
  outline: 3px solid var(--home-yellow);
  outline-offset: 2px;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  align-items: stretch;
  gap: 1rem;
}
.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 420px;
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
.product-card__badge {
  position: relative;
  z-index: 1;
  min-height: 1.25rem;
  color: var(--home-yellow);
  font-size: .78rem;
  font-weight: 750;
  letter-spacing: .08em;
}
.product-card__name {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  min-height: 2.35em;
  max-width: 92%;
  margin: 1.15rem 0 .25rem;
  color: #fff;
  font-size: clamp(1.9rem, 3.15vw, 2.65rem);
  font-weight: 820;
  line-height: 1.08;
  letter-spacing: -.035em;
  text-wrap: balance;
}
.product-card__label {
  position: relative;
  z-index: 1;
  min-height: 1.5em;
  margin: 0 0 .9rem;
  color: var(--home-cyan);
  font-size: 1rem;
  font-weight: 700;
}
.product-card__release {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .8rem;
  min-height: 1.7rem;
  margin: 0 0 .8rem;
  color: rgba(226,245,247,.82);
  font-size: .75rem;
}
.product-card__release span {
  padding: .2rem .54rem;
  border-radius: 999px;
  border: 1px solid rgba(105,240,174,.22);
  background: rgba(105,240,174,.07);
  color: #9af5c5;
  font-weight: 750;
  letter-spacing: .035em;
}
.product-card__release a { color: rgba(196,220,236,.72); font-size: .72rem; }
.product-card__release a:hover { color: var(--home-yellow); }
.product-card__description {
  position: relative;
  z-index: 1;
  display: -webkit-box;
  min-height: 4.8em;
  max-width: 560px;
  margin: 0 0 1rem;
  overflow: hidden;
  color: rgba(220,233,246,.76);
  line-height: 1.6;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.product-card__facts {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  min-height: 2rem;
  gap: .45rem;
  margin-bottom: 1.35rem;
}
.product-card__facts span {
  padding: .32rem .64rem;
  border-radius: 999px;
  border: 1px solid rgba(92,225,223,.18);
  background: rgba(92,225,223,.06);
  color: rgba(226,245,247,.82);
  font-size: .72rem;
}
.product-card__link {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  min-height: 42px;
  padding: .68rem .9rem;
  border: 1px solid rgba(255,211,77,.3);
  border-radius: 11px;
  background: rgba(255,211,77,.09);
  color: #fff;
  font-weight: 750;
}
.product-card__link:hover { border-color: rgba(255,211,77,.58); color: var(--home-yellow); }
.product-card__footer {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-top: auto;
}
.product-card__date {
  margin: 0 0 .15rem;
  color: rgba(255,255,255,.48);
  font-size: .76rem;
  white-space: nowrap;
}
.lab-section {
  padding: clamp(1.4rem, 4vw, 2.8rem);
  border: 1px solid var(--home-border);
  border-radius: 28px;
  background: rgba(7,14,25,.8);
}
.lab-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .75rem; }
.lab-section > .lab-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
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
.lab-side {
  margin-top: 1.65rem;
  padding-top: 1.4rem;
  border-top: 1px solid rgba(255,255,255,.08);
}
.lab-side__head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: .85rem;
}
.lab-side__head h3 { margin: .3rem 0 0; color: #f3f8ff; font-size: 1.18rem; }
.lab-side__head p { max-width: 520px; margin: 0; color: rgba(196,208,233,.58); font-size: .78rem; }
.lab-grid--side { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.lab-grid--side .lab-tool { min-height: 78px; background: rgba(255,255,255,.018); }
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
  aspect-ratio: 2.35 / 1;
  background: rgba(9, 14, 28, 0.72);
  overflow: hidden;
}
.cover-visual { position: relative; width: 100%; height: 100%; overflow: hidden; background: #0a1220; }
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
  .featured-stack { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .product-grid { grid-template-columns: 1fr; }
  .lab-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .lab-section > .lab-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
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
  .lab-side__head { display: block; }
  .lab-side__head p { margin-top: .5rem; }
  .hero-actions { display: grid; grid-template-columns: 1fr; }
  .section-head { display: block; }
  .section-head p { margin-top: .7rem; }
  .featured-stack { grid-template-columns: 1fr; }
  .featured-card p { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .product-card { min-height: 390px; padding: 1.35rem; }
  .product-card__name { min-height: auto; font-size: 1.7rem; }
  .product-card__description { min-height: auto; }
  .product-card__footer { align-items: stretch; flex-direction: column; gap: .75rem; }
  .product-card__link { justify-content: center; width: 100%; }
  .product-card__date { order: -1; }
  .lab-grid { grid-template-columns: 1fr; }
  .lab-section > .lab-grid { grid-template-columns: 1fr; }
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
        <a href="#media">{t('媒体矩阵')}</a>
        <a href="#latest">{t('频道精选')}</a>
        <a href="#products">{t('自制工具')}</a>
        <a href="#lab">{t('AI实验台')}</a>
        {lang !== 'en' && <a href="/skills/">Skill 推荐</a>}
        {lang !== 'en' && <a href="/models/">新模型</a>}
      </div>
      <LangToggle lang={lang} alternates={{ 'zh-CN': homeHref('zh-CN'), en: homeHref('en') }} />
    </nav>
  );
};

const BrandHero = () => {
  const { t, lang } = useHome();
  return (
    <header className="brand-hero" id="top">
      <div className="brand-hero__content">
        <div className="brand-hero__eyebrow">{t(BRAND_SLOGAN)}</div>
        <h1>
          {t('不花钱，把 AI')}<br /><em>{t('跑起来')}</em>
        </h1>
        <p className="brand-hero__lead">
          {t('踩过的坑、测过的数据、亲手做的工具，全部交给你。')}
        </p>
        <div className="hero-actions">
          <a className="hero-button" href="#latest">{t('先看三条主线')}</a>
          <a className="hero-button hero-button--ghost" href="#media">{t('找到全部频道')}</a>
          {lang !== 'en' && <a className="hero-button hero-button--ghost" href="/skills/">Skill 推荐</a>}
          {lang !== 'en' && <a className="hero-button hero-button--ghost" href="/models/">新模型</a>}
        </div>
        <div className="hero-pills" aria-label={t('频道主线')}>
          <span>{t('本地部署')}</span>
          <span>{t('免费白嫖')}</span>
          <span>{t('自制软件')}</span>
          <span>{t('真实数据与失败记录')}</span>
        </div>
      </div>
      <div className="brand-hero__visual" aria-hidden="true">
        <div className="brand-orbit">
          <img src="/png/avatar-800x800.png" alt="" />
        </div>
        <div className="brand-proof">
          <strong>{t('M5 Pro 64 GB · 实机环境')}</strong>
          {t('不复读参数，只记录安装、速度、内存、限制和最终成片。')}
        </div>
      </div>
    </header>
  );
};

const MediaSection = ({ notices = [], subMenus = [] }) => {
  const { t, lang } = useHome();
  const notice = notices[0] || {};
  // 公告来自 notices.yml，是随时会改的内容，不进多语言闸门（否则每改一次公告都会卡住发布）。
  // 逐行翻译；英文页上词典里没有的行直接丢掉，全丢光就退回英文口号——宁可少一句，
  // 也不在英文首页上挂一段中文。
  const lines = (notice.summary || notice.title || BRAND_SLOGAN).trim().split('\n').map((line) => line.trim());
  const shown = lines
    .map((line) => t(line))
    .filter((line, i) => lang !== 'en' || line !== lines[i] || !/[一-鿿]/.test(line));
  const slogan = (shown.length ? shown : [t(BRAND_SLOGAN)]).join('\n');
  // 频道匹配用 subMenus 的中文标题（pattern 是中文），显示时再翻译
  const channels = MEDIA_CHANNELS.map((channel) => {
    const matched = subMenus.find((link) => channel.pattern.test(link?.title || ''));
    return { ...channel, url: matched?.url || channel.fallbackUrl };
  });

  return (
    <section className="media-section" id="media">
      <article className="notice-feature" id="media-notice">
        <div className="notice-feature__copy">
          <div className="section-eyebrow">{t('频道公告')}</div>
          <div className="notice-feature__mark">“</div>
          <blockquote>{slogan}</blockquote>
        </div>
        <div className="notice-feature__image">
          <img
            src={WECHAT_QR_IMAGE}
            alt={t('黑粉科技公众号二维码')}
            width="258"
            height="258"
          />
        </div>
      </article>

      <div className="media-matrix" id="channels">
        <div className="media-matrix__head">
          <div>
            <div className="section-eyebrow">{t('媒体矩阵')}</div>
            <h2>{t('频道都在这')}</h2>
          </div>
          <p>{t('平台不同，黑粉还是同一个黑粉。')}</p>
        </div>
        <div className="media-grid">
          {channels.map((channel) => {
            const external = /^https?:\/\//.test(channel.url);
            return (
              <a
                className={`media-card${channel.id === 'bilibili' ? ' media-card--primary' : ''}`}
                href={channel.url}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                style={{ '--channel-accent': channel.accent }}
                key={channel.id}
              >
                {channel.id === 'bilibili' && <span className="media-card__flag">{t('主场首发')}</span>}
                <span className="media-card__name">{t(channel.name)}</span>
                <strong>{t(channel.title)}</strong>
                <p>{t(channel.description)}</p>
                <span className="media-card__action">{t(channel.action)} →</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const FeaturedSection = ({ items = [] }) => {
  const { t } = useHome();
  if (!items.length) return null;

  return (
    <section id="latest">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">{t('三条主线')}</div>
          <h2>{t('从这开始')}</h2>
        </div>
        <p>{t('本地跑、免费用、自己造；各挑一篇，不让你在文章堆里迷路。')}</p>
      </div>
      <div className="featured-grid">
        <FeaturedCard post={items[0]?.post} pillar={items[0]?.pillar} primary />
        <div className="featured-stack">
          <FeaturedCard post={items[1]?.post} pillar={items[1]?.pillar} />
          <FeaturedCard post={items[2]?.post} pillar={items[2]?.pillar} />
        </div>
      </div>
    </section>
  );
};

const ProductSection = ({ products = [] }) => {
  const { t, lang } = useHome();
  return (
    <section id="products">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">{t('自制软件')}</div>
          <h2>{t('自制工具')}</h2>
        </div>
        <p>{t('遇到问题，先找工具；找不到，就自己写一个。多少有点不服气。')}</p>
      </div>
      <div className="product-grid">
        {products.map((product) => {
          // 英文页的 slug 与摘要在构建时已换成英文版（buildHomeProps），这里只管翻译标签
          const name = t(product.name);
          return (
            <article className="product-card" key={product.slug}>
              <div className="product-card__badge">{t(product.badge)}</div>
              <h3 className="product-card__name">{name}</h3>
              <h4 className="product-card__label">{t(product.label)}</h4>
              {product.version && (
                <div className="product-card__release">
                  <span>{t('最新版本 {version}', { version: product.version })}</span>
                  <a href={product.releaseUrl} target="_blank" rel="noreferrer">{t('更新说明 ↗')}</a>
                </div>
              )}
              <p className="product-card__description">{product.description}</p>
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
  return (
    <a className="lab-tool" href={tool.href}>
      <span className="lab-tool__icon">{tool.icon}</span>
      <span>
        <strong>{t(tool.title)}</strong>
        <small>{t(tool.desc)}</small>
      </span>
    </a>
  );
};

const LabSection = () => {
  const { t } = useHome();
  return (
    <section className="lab-section" id="lab">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">{t('本地 AI · 实测数据')}</div>
          <h2>{t('AI 实验台')}</h2>
        </div>
        <p>{t('装机、本地模型、Agent 和 48 小时发布雷达；能点、能查、能直接用。')}</p>
      </div>
      <div className="lab-grid">
        {AI_LAB_TOOLS.map((tool) => <LabTool tool={tool} key={tool.href} />)}
      </div>
      <div className="lab-side">
        <div className="lab-side__head">
          <div>
            <div className="section-eyebrow">{t('额外掉落')}</div>
            <h3>{t('顺手小玩具')}</h3>
          </div>
          <p>{t('不抢 AI 主线的镜头，但做都做了，有用就拿走。')}</p>
        </div>
        <div className="lab-grid lab-grid--side">
          {SIDE_TOOLS.map((tool) => <LabTool tool={tool} key={tool.href} />)}
        </div>
      </div>
    </section>
  );
};

export default function Home({
  posts,
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
    const featuredItems = selectPillarFeaturedPosts(posts);
    const featuredSlugs = new Set(featuredItems.map(({ post }) => getPostSlug(post)));
    const remainingPosts = posts.filter((post) => !featuredSlugs.has(getPostSlug(post)));
    // 搜索只看显示出来的那一版：英文页搜英文标题、结果链到英文文章
    const searchable = en ? posts.map((post) => view(post, en)) : posts;

    return (
      <HomeContext.Provider value={{ lang, t, en }}>
        <SEO
          title=""
          description={t(SITE_CONFIG.description)}
          url={homeHref(lang)}
          type="website"
          lang={lang}
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
            <FeaturedSection items={featuredItems} />
            <ProductSection products={products} />

            {errorMessage && (
              <div className="empty-state" style={{ fontWeight: 600, color: '#ff8a80' }}>
                {errorMessage}
              </div>
            )}

            <section id="all-content">
              <div className="section-head">
                <div>
                  <div className="section-eyebrow">{t('文章归档')}</div>
                  <h2>{t('更多实测')}</h2>
                </div>
                <p>{t('想找哪次踩坑，直接搜；我的记性不一定比搜索框好。')}</p>
              </div>
              {posts.length > 0 && <div className="content-search"><Search posts={searchable} lang={lang} /></div>}
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

            {!showEmpty && totalPages > 1 && (
              <nav className="pagination">
                <span className="pagination__info">
                  {t('第 {current} 页 / 共 {total} 页', { current: currentPage, total: totalPages })}
                </span>
                {currentPage < totalPages && (
                  <Link className="pagination__next" href={listHref(lang, currentPage + 1)}>
                    {t('下一页 →')}
                  </Link>
                )}
              </nav>
            )}

            <LabSection />
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
        <main className="page">
          <BrandHero subMenus={subMenus} />
          <div className="empty-state" style={{ color: '#d93025', fontWeight: 600 }}>
            {t('首页渲染失败：')}{error?.message || t('未知错误，请查看构建日志。')}
          </div>
        </main>
      </HomeContext.Provider>
    );
  }
}
