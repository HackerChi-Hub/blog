const PAGES = [
  { href: '/radar/', label: '新闻雷达' },
  { href: '/skills/', label: 'Skill 雷达' },
  { href: '/models/', label: '新模型雷达' },
];

export default function RadarNavigation({ current }) {
  return (
    <nav className="radar-network-nav" aria-label="雷达频道导航">
      <a className="radar-network-brand" href="/">
        <img src="/png/logo-icon-traced.png?v=2" alt="" />
        <span>黑粉科技</span>
      </a>
      <div className="radar-network-links">
        {PAGES.map(({ href, label }) => (
          <a key={href} href={href} aria-current={current === href ? 'page' : undefined}>{label}</a>
        ))}
      </div>
      <style jsx>{`
        .radar-network-nav { position:sticky; top:10px; z-index:60; display:flex; align-items:center; justify-content:space-between; gap:18px; width:min(100% - 28px,1240px); margin:18px auto 22px; padding:12px 16px; border:1px solid rgba(255,255,255,.12); border-radius:18px; background:rgba(5,10,20,.94); backdrop-filter:blur(18px); box-shadow:0 18px 50px rgba(0,0,0,.28); }
        .radar-network-brand { display:inline-flex; align-items:center; gap:10px; color:#f7fbff; font-weight:800; white-space:nowrap; }
        .radar-network-brand img { width:34px; height:34px; object-fit:contain; }
        .radar-network-links { display:flex; gap:8px; }
        .radar-network-links a { padding:9px 12px; border:1px solid transparent; border-radius:12px; color:#cad7e9; font-size:.9rem; white-space:nowrap; }
        .radar-network-links a[aria-current=page] { color:#87f5c1; border-color:rgba(105,240,174,.3); background:rgba(105,240,174,.1); }
        .radar-network-links a:hover { color:#fff; background:rgba(255,255,255,.07); }
        .radar-network-nav a:focus-visible { outline:2px solid #69f0ae; outline-offset:3px; }
        @media(max-width:720px) { .radar-network-nav { position:relative; top:0; flex-direction:column; align-items:stretch; gap:10px; margin-top:9px; padding:12px; } .radar-network-links { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:5px; } .radar-network-links a { text-align:center; font-size:.78rem; padding:9px 3px; } }
      `}</style>
    </nav>
  );
}
