// components/HomeHero.js
// 首页首屏：实验日志风 HERO + CSS 3D 场景 + 三条主线大卡 + 数据带。
//
// 3D 场景里没有任何装饰性假数据，全部来自构建期 props：
// · 终端卡 —— 最新一篇已发布实测文章（标题、日期、链接）；
// · 黄色回执便签 —— 同一篇文章的真实摘要；
// · 芯片卡 —— 最近更新的自制软件与真实版本号（GitHub Release 同步进 products）；
// · 数据点卡 —— 已发布文章数与自制软件数；
// · 数据带 —— 文章 / 软件 / 雷达收录 / 实验台工具的真实计数。
//
// 视差与倾斜仅在精细指针设备注册；正文不依赖滚动观察器才显示。

import { useEffect, useRef } from 'react';
import { formatDate, normalizeSummary } from '../lib/utils';
import ArticleCover from './ArticleCover';
const { CONTENT_PILLARS } = require('../lib/home-content.cjs');

const truncateText = (text, maxLength = 80) =>
  text && text.length > maxLength ? `${text.slice(0, maxLength)}…` : text || '';

// 与产品卡同一个取法：取名字最后的拉丁字母段（LocalBrain → LB）
const monogram = (product) =>
  String(product?.name || '').split(' ').at(-1).replace(/[^A-Z]/g, '').slice(0, 2);

export default function HomeHero({ t, lang, latest, latestCover, products = [], totals, articlesHref }) {
  const heroRef = useRef(null);
  const stageRef = useRef(null);
  const sceneRef = useRef(null);

  const newestProduct = products.length
    ? products.slice().sort((a, b) => String(b.updated || '').localeCompare(String(a.updated || '')))[0]
    : null;
  const latestSummary = latest ? truncateText(normalizeSummary(latest.summary), 72) : '';

  useEffect(() => {
    const root = document.querySelector('.home-page');
    if (!root) return undefined;
    const cleanups = [];
    const motionOK = window.matchMedia('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)').matches;

    // HERO 鼠标视差
    const hero = heroRef.current;
    const stage = stageRef.current;
    const scene = sceneRef.current;
    if (motionOK && hero && stage && scene) {
      const onMove = (event) => {
        const rect = stage.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
        scene.style.setProperty('--ry', `${-12 + x * 16}deg`);
        scene.style.setProperty('--rx', `${8 - y * 12}deg`);
      };
      const onLeave = () => {
        scene.style.setProperty('--ry', '-12deg');
        scene.style.setProperty('--rx', '8deg');
      };
      hero.addEventListener('mousemove', onMove);
      hero.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        hero.removeEventListener('mousemove', onMove);
        hero.removeEventListener('mouseleave', onLeave);
      });
    }

    // 卡片 3D 倾斜 + 高光跟随
    if (motionOK) {
      root.querySelectorAll('.tilt').forEach((card) => {
        const onMove = (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
          card.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
          card.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
        };
        const onLeave = () => { card.style.transform = ''; };
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          card.removeEventListener('mousemove', onMove);
          card.removeEventListener('mouseleave', onLeave);
        });
      });
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <>
      <div className="hero-wrap">
        <header className="home-hero" id="top" ref={heroRef}>
          <div>
            <div className="hero-eyebrow">{t('HyphenTech · 本地 AI 实测记录')}</div>
            <h1>
              {t('让 AI 成为')}<br />
              {t('你的')}<span className="hl">{t('超能力。')}</span>
            </h1>
            <p className="hero-sub">
              <b>{t('踩过的坑、测过的数据、亲手做的工具，全部交给你。')}</b>
              {t('参数先别吹，上机跑一回。')}{t('这里的每个结论都出自我自己那台 Mac。')}
            </p>
            <div className="positioning">
              {CONTENT_PILLARS.map((pillar) => (
                <span className="pos" key={pillar.id}>
                  <span className="no">{pillar.index}</span>{t(pillar.title)}
                </span>
              ))}
            </div>
            <div className="cta-row">
              <a className="btn btn-primary" href="#all-content">{t('看最新实测')} →</a>
              <a className="btn btn-ghost" href="#lab">{t('进入实验台')}</a>
            </div>
          </div>

          <div className="stage" ref={stageRef}>
            <div className="scene" ref={sceneRef}>
              {latest && (
                <a className="layer card-term" href={`/${latest.slug}/`}>
                  <div className="bar"><i></i><i></i><i></i><span>LATEST POST</span></div>
                  <pre>
                    <span className="dim">$</span> hfkj publish --latest{'\n'}
                    <span className="g">✓</span> {truncateText(latest.title || latest.slug, 30)}{'\n'}
                    <span className="y">▸</span> {formatDate(latest.date, lang)} · {t('阅读全文')} →
                  </pre>
                </a>
              )}
              {latestSummary && (
                <div className="layer card-note">
                  <span className="tag">{t('▍实测回执')}</span>
                  {latestSummary}
                </div>
              )}
              {newestProduct && (
                <a className="layer card-chip" href={`/${newestProduct.slug}/`}>
                  <div className="chip-logo">{monogram(newestProduct)}</div>
                  <div>
                    <div className="name">{t(newestProduct.name)}</div>
                    <div className="ver">
                      {newestProduct.version
                        ? t('最新版本 {version}', { version: newestProduct.version })
                        : t('持续更新')}
                    </div>
                  </div>
                </a>
              )}
              <div className="layer card-stat">
                <div><span className="n">{totals.posts}</span><span className="l">{t('篇实测文章')}</span></div>
                <div><span className="n">{totals.products}</span><span className="l">{t('款自制软件')}</span></div>
              </div>
              <i className="orb orb1"></i><i className="orb orb2"></i><i className="orb orb3"></i>
            </div>
          </div>
          <div className="scroll-cue">SCROLL</div>
        </header>
      </div>

      <section id="pillars">
        <div className="sec-head">
          <h2 className="sec-title"><span className="en">CORE CONTENT</span>{t('三条主线，一眼看完我做什么')}</h2>
          <a className="sec-more" href={articlesHref}>{t('查看全部文章')} →</a>
        </div>
        <div className="pillars">
          <a className="pillar tilt js-reveal" href={articlesHref}>
            <div className="glare"></div>
            <span className="idx">01 / FIELD TESTS</span>
            <h3>{t('实测文章')}</h3>
            {latestCover && (
              <div className="pillar-art"><ArticleCover src={latestCover} title={t('最新实测封面')} lang={lang} /></div>
            )}
            <p>{t('模型发布不追通稿，拖到自己机器上跑。翻车了写翻车，数据说话。')}</p>
            <span className="go">{t('进入实测档案')} →</span>
            <span className="big-no">01</span>
          </a>
          <a className="pillar tilt js-reveal" href="#products">
            <div className="glare"></div>
            <span className="idx">02 / SELF-MADE TOOLS</span>
            <h3>{t('自制软件')}</h3>
            <div className="pillar-art"><div className="mono-row">
              {products.map((product) => <span className="mono-chip" key={product.slug}>{monogram(product)}</span>)}
            </div></div>
            <p>{t('遇到问题，先找工具；找不到，就自己写一个。多少有点不服气。')}</p>
            <span className="go">{t('看看我造了什么')} →</span>
            <span className="big-no">02</span>
          </a>
          <a className="pillar tilt js-reveal" href="/radar/">
            <div className="glare"></div>
            <span className="idx">03 / RADAR</span>
            <h3>{t('资源雷达')}</h3>
            <div className="pillar-art"><span className="live-dot">LIVE · {t('持续复测中')}</span></div>
            <p>{t('免费 API 白嫖清单、新模型门槛、新技能用途。推荐不等于实测，全部标注核验状态。')}</p>
            <span className="go">{t('进入雷达')} →</span>
            <span className="big-no">03</span>
          </a>
        </div>

        <div className="databand js-reveal">
          <div className="cell"><div className="n">{totals.posts}<em>+</em></div><div className="l">{t('篇实测文章')}</div></div>
          <div className="cell"><div className="n">{totals.products}</div><div className="l">{t('款自制软件')}</div></div>
          <div className="cell"><div className="n">{totals.radar}</div><div className="l">{t('条雷达收录')}</div></div>
          <div className="cell"><div className="n">{totals.lab}</div><div className="l">{t('个实验台工具')}</div></div>
        </div>
      </section>
    </>
  );
}
