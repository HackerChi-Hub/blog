import { useMemo, useState } from 'react';
import SEO from './SEO';
import ContainedCover from './ContainedCover';
import StandaloneShareSection from './StandaloneShareSection';
import RadarNavigation from './RadarNavigation';
import { formatDate } from '../lib/utils';

const PAGE = {
  skill: {
    eyebrow: 'OBSIDIAN · 自动收录',
    title: 'Skill 雷达',
    lead: '把真正能帮你完成任务的 Agent Skill 单独拎出来。先看用途，再看成本、权限、兼容性和实测边界。',
    note: '这里的“推荐”是值得了解和试用，不等于已经跑通或无条件背书。',
    search: '搜 Skill、用途或场景…',
    empty: '暂时没有匹配的 Skill。换个词，或者等下一次自动收录。',
    source: '项目源',
    article: '看完整核验',
    icon: '✦',
    url: '/skills/',
    otherUrl: '/models/',
    otherLabel: '新模型',
  },
  model: {
    eyebrow: 'OBSIDIAN · 自动追踪',
    title: '新模型雷达',
    lead: '专门收录刚发布、刚开放或值得追踪的 AI 模型，把官方宣称、真实可用性和本地部署门槛拆开说。',
    note: '按发布日期自动排序；榜单记录值得追踪的新模型，不用热度代替实测。',
    search: '搜模型、能力或使用方式…',
    empty: '暂时没有匹配的新模型。换个词，或者等下一次自动追踪。',
    source: '官方来源',
    article: '看完整分析',
    icon: '◈',
    url: '/models/',
    otherUrl: '/skills/',
    otherLabel: 'Skill 推荐',
  },
};

export default function DiscoveryPage({ articleType, posts = [] }) {
  const config = PAGE[articleType] || PAGE.skill;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');

  const categories = useMemo(
    () => ['全部', ...new Set(posts.map((post) => post.category).filter(Boolean))],
    [posts],
  );
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (category !== '全部' && post.category !== category) return false;
      if (!needle) return true;
      return [post.name, post.title, post.summary, post.category, post.stage, ...(post.tags || [])]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [posts, query, category]);

  const latest = posts[0]?.date ? formatDate(posts[0].date) : '等待收录';
  const description = `${config.lead}${config.note}`;

  return (
    <>
      <SEO title={config.title} description={description} url={config.url} type="website" />
      <main className="discovery-page">
        <RadarNavigation current={config.url} />

        <header className="discovery-hero">
          <div className="discovery-hero__copy">
            <div className="discovery-eyebrow">{config.eyebrow}</div>
            <h1>{config.title}</h1>
            <p>{config.lead}</p>
            <div className="discovery-rule"><span>{config.icon}</span>{config.note}</div>
          </div>
          <div className="discovery-stats" aria-label="自动收录统计">
            <div><strong>{posts.length}</strong><span>已收录</span></div>
            <div><strong>{Math.max(0, categories.length - 1)}</strong><span>类别</span></div>
            <div><strong>{latest}</strong><span>最新更新</span></div>
          </div>
        </header>

        <section className="discovery-controls" aria-label="搜索与筛选">
          <label>
            <span className="sr-only">搜索</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={config.search}
            />
          </label>
          <div className="discovery-filters">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                className={item === category ? 'is-active' : ''}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="discovery-grid" aria-live="polite">
          {shown.map((post, index) => (
            <article className={`discovery-card${index === 0 ? ' discovery-card--lead' : ''}`} key={post.slug}>
              <a className="discovery-card__cover" href={`/${post.slug}/`} aria-label={post.title}>
                <div className="discovery-card__fallback" aria-hidden="true">
                  <span>{config.icon}</span>
                  <strong>{post.name}</strong>
                </div>
                {post.cover && <ContainedCover src={post.cover} alt={post.title} />}
              </a>
              <div className="discovery-card__body">
                <div className="discovery-card__meta">
                  <span>{post.category}</span>
                  <span>{post.stage}</span>
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>
                <h2><a href={`/${post.slug}/`}>{post.title}</a></h2>
                <p>{post.summary}</p>
                <div className="discovery-card__actions">
                  <a className="discovery-card__primary" href={`/${post.slug}/`}>{config.article}<span>→</span></a>
                  {post.sourceUrl && (
                    <a href={post.sourceUrl} target="_blank" rel="noreferrer noopener">{config.source} ↗</a>
                  )}
                </div>
              </div>
            </article>
          ))}
          {shown.length === 0 && <p className="discovery-empty">{config.empty}</p>}
        </section>

        <StandaloneShareSection title={config.title} url={config.url} description={description} />
      </main>

      <style jsx global>{`
        .discovery-page { width:min(100% - 28px, 1240px); margin:0 auto; padding:18px 0 56px; }
        .discovery-nav { position:sticky; top:10px; z-index:20; display:flex; align-items:center; justify-content:space-between; gap:18px; margin-bottom:22px; padding:12px 16px; border:1px solid rgba(255,255,255,.11); border-radius:18px; background:rgba(5,10,20,.84); backdrop-filter:blur(18px); box-shadow:0 18px 50px rgba(0,0,0,.28); }
        .discovery-brand { display:inline-flex; align-items:center; gap:10px; color:#f7fbff; font-weight:800; letter-spacing:.08em; }
        .discovery-brand img { width:34px; height:34px; object-fit:contain; }
        .discovery-nav__links { display:flex; flex-wrap:wrap; gap:16px; }
        .discovery-nav__links a { color:rgba(226,236,250,.78); font-size:.9rem; }
        .discovery-hero { position:relative; overflow:hidden; display:grid; grid-template-columns:minmax(0,1.25fr) minmax(270px,.75fr); gap:clamp(28px,6vw,80px); align-items:end; padding:clamp(30px,6vw,76px); border:1px solid rgba(92,225,223,.18); border-radius:34px; background:radial-gradient(circle at 88% 18%,rgba(92,225,223,.22),transparent 34%),radial-gradient(circle at 12% 95%,rgba(179,136,255,.15),transparent 36%),linear-gradient(135deg,rgba(8,14,27,.99),rgba(4,27,34,.97)); box-shadow:0 36px 90px rgba(0,0,0,.48); }
        .discovery-hero::before { content:''; position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px); background-size:42px 42px; pointer-events:none; }
        .discovery-hero__copy,.discovery-stats { position:relative; z-index:1; }
        .discovery-eyebrow { color:#5ce1df; font:700 .8rem/1.4 'JetBrains Mono','SFMono-Regular',monospace; letter-spacing:.16em; }
        .discovery-hero h1 { margin:12px 0 16px; color:#fff; font-size:clamp(3rem,8vw,6.6rem); line-height:.98; letter-spacing:-.055em; }
        .discovery-hero p { max-width:760px; margin:0; color:rgba(229,239,250,.84); font-size:clamp(1rem,1.8vw,1.22rem); line-height:1.85; }
        .discovery-rule { display:flex; gap:10px; align-items:flex-start; max-width:720px; margin-top:22px; padding:13px 16px; border:1px solid rgba(255,211,77,.24); border-radius:14px; background:rgba(255,211,77,.07); color:rgba(244,237,208,.84); font-size:.9rem; line-height:1.65; }
        .discovery-rule span { color:#ffd34d; font-size:1.1rem; }
        .discovery-stats { display:grid; gap:12px; }
        .discovery-stats div { display:flex; justify-content:space-between; align-items:baseline; gap:16px; padding:15px 18px; border:1px solid rgba(255,255,255,.1); border-radius:16px; background:rgba(255,255,255,.045); }
        .discovery-stats strong { color:#ffd34d; font-size:clamp(1.2rem,3vw,2rem); line-height:1; }
        .discovery-stats span { color:rgba(210,224,240,.68); font-size:.82rem; }
        .discovery-controls { display:grid; gap:16px; margin:28px 0; padding:18px; border:1px solid rgba(255,255,255,.1); border-radius:22px; background:rgba(7,13,25,.78); }
        .discovery-controls input { width:100%; min-height:54px; padding:0 18px; border:1px solid rgba(255,255,255,.14); border-radius:14px; outline:none; background:rgba(255,255,255,.04); color:#f6fbff; font-size:1rem; }
        .discovery-controls input:focus { border-color:rgba(92,225,223,.7); box-shadow:0 0 0 3px rgba(92,225,223,.1); }
        .discovery-filters { display:flex; flex-wrap:wrap; gap:9px; }
        .discovery-filters button { min-height:38px; padding:7px 13px; border:1px solid rgba(255,255,255,.13); border-radius:999px; background:rgba(255,255,255,.035); color:rgba(220,233,248,.75); cursor:pointer; }
        .discovery-filters button.is-active { border-color:rgba(105,240,174,.52); background:rgba(105,240,174,.12); color:#8ff7c2; }
        .discovery-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:22px; }
        .discovery-card { overflow:hidden; display:grid; grid-template-columns:minmax(190px,.78fr) minmax(0,1.22fr); min-height:330px; border:1px solid rgba(157,224,232,.15); border-radius:26px; background:linear-gradient(145deg,rgba(9,17,31,.98),rgba(5,24,29,.94)); box-shadow:0 24px 60px rgba(0,0,0,.34); transition:transform .24s ease,border-color .24s ease; }
        .discovery-card:hover { transform:translateY(-4px); border-color:rgba(92,225,223,.48); }
        .discovery-card--lead,
        .discovery-card:last-child:nth-child(even) { grid-column:1/-1; grid-template-columns:minmax(300px,.9fr) minmax(0,1.1fr); min-height:410px; }
        .discovery-card__cover { position:relative; min-height:100%; overflow:hidden; border-right:1px solid rgba(255,255,255,.08); background:#07131c; }
        .discovery-card__cover > * { position:absolute; inset:0; width:100%; height:100%; }
        .discovery-card__fallback { display:flex; flex-direction:column; justify-content:flex-end; gap:12px; padding:24px; background:radial-gradient(circle at 75% 18%,rgba(92,225,223,.24),transparent 34%),linear-gradient(150deg,#07111f,#07343b); }
        .discovery-card__fallback span { color:#ffd34d; font-size:2.2rem; }
        .discovery-card__fallback strong { color:#effcff; font-size:clamp(1.35rem,2.7vw,2.2rem); line-height:1.08; overflow-wrap:anywhere; word-break:break-word; }
        .discovery-card__cover img { width:100%!important; height:100%!important; object-fit:contain!important; background:#07111f; }
        .discovery-card__body { display:flex; flex-direction:column; padding:clamp(22px,3vw,34px); }
        .discovery-card__meta { display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
        .discovery-card__meta span,.discovery-card__meta time { padding:4px 9px; border:1px solid rgba(92,225,223,.2); border-radius:999px; background:rgba(92,225,223,.07); color:rgba(205,238,241,.78); font-size:.75rem; }
        .discovery-card__meta time { margin-left:auto; border-color:transparent; background:transparent; color:rgba(187,202,222,.62); }
        .discovery-card h2 { margin:18px 0 12px; font-size:clamp(1.35rem,2.4vw,2rem); line-height:1.28; }
        .discovery-card h2 a { color:#f8fbff; }
        .discovery-card p { margin:0; color:rgba(213,226,242,.78); line-height:1.75; }
        .discovery-card__actions { display:flex; flex-wrap:wrap; gap:14px; align-items:center; margin-top:auto; padding-top:22px; }
        .discovery-card__actions a { color:#72efb2; font-size:.9rem; }
        .discovery-card__primary { display:inline-flex; align-items:center; gap:8px; padding:9px 13px; border:1px solid rgba(105,240,174,.3); border-radius:10px; background:rgba(105,240,174,.08); }
        .discovery-empty { grid-column:1/-1; margin:0; padding:48px 24px; border:1px dashed rgba(255,255,255,.16); border-radius:24px; color:rgba(211,225,241,.72); text-align:center; }
        .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
        @media (max-width:980px) { .discovery-hero { grid-template-columns:1fr; } .discovery-stats { grid-template-columns:repeat(3,minmax(0,1fr)); } .discovery-stats div { display:grid; } .discovery-grid { grid-template-columns:1fr; } .discovery-card--lead,.discovery-card:last-child:nth-child(even) { grid-column:auto; } }
        @media (max-width:720px) { .discovery-page { width:min(100% - 18px,1240px); padding-top:9px; } .discovery-nav { align-items:flex-start; } .discovery-nav__links { justify-content:flex-end; gap:10px; } .discovery-nav__links a:first-child { display:none; } .discovery-hero { padding:26px 20px; border-radius:24px; } .discovery-hero h1 { font-size:clamp(2.7rem,17vw,4.2rem); } .discovery-stats { grid-template-columns:1fr; } .discovery-stats div { display:flex; } .discovery-card,.discovery-card--lead,.discovery-card:last-child:nth-child(even) { grid-template-columns:1fr; min-height:0; } .discovery-card__cover { min-height:230px; border-right:0; border-bottom:1px solid rgba(255,255,255,.08); } .discovery-card__meta time { width:100%; margin-left:0; padding-left:0; } }
      `}</style>
    </>
  );
}
