import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import SEO from '../components/SEO';


const DATA_URL = 'https://hackerchi-hub.github.io/NewsRadar/data/news.json';
const REFRESH_MS = 5 * 60 * 1000;

// ── Category emoji lookup ────────────────────────────────────────
const CAT_EMOJI = {
  // AI
  LLM: '🤖', CV: '👁️', '机器人': '🦾', 'AI产品': '🛠️', '研究': '🔬', '开源': '💻',
  // 安全
  '漏洞': '🐛', '攻防': '⚔️', '隐私': '🔐', '安全工具': '🛡️',
  // 经济
  '宏观': '📊', '市场': '📈', '投融资': '💵', '加密': '🪙',
  // 科技
  '软件': '📦', '硬件': '🔧', '互联网': '🌐', '开发': '⌨️',
  // 国际
  '外交': '🤝', '贸易': '📦', '气候': '🌱', '科学': '🚀',
  // fallback
  '未分类': '📰',
};

// ── Domain tabs (top level) ──────────────────────────────────────
const DOMAINS = [
  { key: '全部', emoji: '📡' },
  { key: 'AI', emoji: '🤖' },
  { key: '安全', emoji: '🔒' },
  { key: '经济', emoji: '💰' },
  { key: '科技', emoji: '💻' },
  { key: '国际', emoji: '🌍' },
];

const DOMAIN_STYLE = {
  'AI': { color: '#69f0ae', bg: 'rgba(105,240,174,0.10)', border: 'rgba(105,240,174,0.3)' },
  '安全': { color: '#ff5370', bg: 'rgba(255,83,112,0.10)', border: 'rgba(255,83,112,0.3)' },
  '经济': { color: '#ffb347', bg: 'rgba(255,179,71,0.10)', border: 'rgba(255,179,71,0.3)' },
  '科技': { color: '#6cb8ff', bg: 'rgba(108,184,255,0.10)', border: 'rgba(108,184,255,0.3)' },
  '国际': { color: '#82f7ff', bg: 'rgba(130,247,255,0.10)', border: 'rgba(130,247,255,0.3)' },
};

// ── Category config (per domain) ────────────────────────────────
const DOMAIN_CATEGORIES = {
  'AI': ['LLM', 'CV', '机器人', 'AI产品', '研究', '开源'],
  '安全': ['漏洞', '攻防', '隐私', '安全工具'],
  '经济': ['宏观', '市场', '投融资', '加密'],
  '科技': ['软件', '硬件', '互联网', '开发'],
  '国际': ['外交', '贸易', '气候', '科学'],
};

const CAT_STYLE = {
  // AI
  LLM: { color: '#69f0ae', bg: 'rgba(105,240,174,0.12)' },
  CV: { color: '#6cb8ff', bg: 'rgba(108,184,255,0.12)' },
  '机器人': { color: '#ffb347', bg: 'rgba(255,179,71,0.12)' },
  'AI产品': { color: '#b388ff', bg: 'rgba(179,136,255,0.12)' },
  '研究': { color: '#ffd54f', bg: 'rgba(255,213,79,0.12)' },
  '开源': { color: '#ff7fd1', bg: 'rgba(255,127,209,0.12)' },
  // 安全
  '漏洞': { color: '#ff5370', bg: 'rgba(255,83,112,0.12)' },
  '攻防': { color: '#ff7043', bg: 'rgba(255,112,67,0.12)' },
  '隐私': { color: '#ffab40', bg: 'rgba(255,171,64,0.12)' },
  '安全工具': { color: '#69f0ae', bg: 'rgba(105,240,174,0.12)' },
  // 经济
  '宏观': { color: '#ffb347', bg: 'rgba(255,179,71,0.12)' },
  '市场': { color: '#00e5ff', bg: 'rgba(0,229,255,0.12)' },
  '投融资': { color: '#b388ff', bg: 'rgba(179,136,255,0.12)' },
  '加密': { color: '#ffd54f', bg: 'rgba(255,213,79,0.12)' },
  // 科技
  '软件': { color: '#6cb8ff', bg: 'rgba(108,184,255,0.12)' },
  '硬件': { color: '#ffb347', bg: 'rgba(255,179,71,0.12)' },
  '互联网': { color: '#00e5ff', bg: 'rgba(0,229,255,0.12)' },
  '开发': { color: '#69f0ae', bg: 'rgba(105,240,174,0.12)' },
  // 国际
  '外交': { color: '#82f7ff', bg: 'rgba(130,247,255,0.12)' },
  '贸易': { color: '#ffb347', bg: 'rgba(255,179,71,0.12)' },
  '气候': { color: '#69f0ae', bg: 'rgba(105,240,174,0.12)' },
  '科学': { color: '#b388ff', bg: 'rgba(179,136,255,0.12)' },
  // fallback
  '未分类': { color: '#93a3b8', bg: 'rgba(147,163,184,0.10)' },
};

const SOURCE_EMOJI = {
  // AI
  'Hacker News': '🟠', 'arXiv': '📄', 'TechCrunch AI': '🚀',
  'The Verge AI': '📱', 'MIT Tech Review': '🎓', 'VentureBeat AI': '💰',
  'OpenAI Blog': '🟢', 'DeepMind Blog': '🔷', 'Google AI Blog': '🔍',
  'Hugging Face Blog': '🤗', 'The Decoder': '🔓', 'Microsoft AI Blog': '🪟',
  'Meta AI Blog': '🔵', 'AWS AI Blog': '☁️', 'NVIDIA Blog': '🟩',
  'Wired AI': '📰', 'InfoQ AI': '📋',
  // 安全
  'The Hacker News': '🔴', 'BleepingComputer': '💻', 'Krebs on Security': '🔐',
  'SecurityWeek': '🛡️', 'FreeBuf': '🇨🇳', '嘶吼': '📢',
  // 经济
  'Bloomberg Markets': '📈', 'CNBC': '📺', 'Reuters Business': '🌐',
  'Bloomberg Tech': '📊',
  // 科技
  'Engadget': '⚙️', 'Ars Technica': '🔧', 'IT之家': '🏠',
  // 国际
  'UN News': '🇺🇳', 'BBC World': '📻', 'NPR World': '🎙️',
  'Reuters World': '🌐', 'NASA': '🚀', '新华网': '🇨🇳', '环球时报': '🌏',
  // 综合中文
  '机器之心': '🧠', '量子位': '⚛️', '雷锋网 AI': '⚡',
  '36氪': '💡', 'InfoQ 中文': '📋', '虎嗅': '🐯',
  '钛媒体': '🔗', '爱范儿': '❤️', '少数派': '✨',
};

// ── Helpers ──────────────────────────────────────────────────────
function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  if (isNaN(diff)) return '';
  const m = Math.floor(diff / 60000);
  if (m < 1) return '⚡ 刚刚';
  if (m < 60) return `🕐 ${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `🕐 ${h} 小时前`;
  const d = Math.floor(h / 24);
  if (d === 1) return '📅 昨天';
  return `📅 ${d} 天前`;
}

function uniqueSources(articles) {
  return [...new Set(articles.map(a => a.source))].length;
}

// ── Component ────────────────────────────────────────────────────
export default function RadarPage() {
  const [articles, setArticles] = useState([]);
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('全部');
  const [category, setCategory] = useState('全部');
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setArticles(data.articles || []);
      setDigest(data.digest || null);
      setLastUpdated(data.last_updated || '');
      setError('');
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, REFRESH_MS);
    return () => clearInterval(timer);
  }, [fetchData]);

  const domainCounts = useMemo(() => {
    const c = { '全部': articles.length };
    for (const a of articles) c[a.domain || 'AI'] = (c[a.domain || 'AI'] || 0) + 1;
    return c;
  }, [articles]);

  const domainArticles = useMemo(() => {
    if (domain === '全部') return articles;
    return articles.filter(a => (a.domain || 'AI') === domain);
  }, [articles, domain]);

  const catCounts = useMemo(() => {
    const c = { '全部': domainArticles.length };
    for (const a of domainArticles) c[a.category] = (c[a.category] || 0) + 1;
    return c;
  }, [domainArticles]);

  const activeCats = useMemo(() => {
    if (domain === '全部') {
      // Show top 8 categories by count to avoid pill overflow on mobile
      return Object.keys(catCounts)
        .filter(k => k !== '全部' && catCounts[k] > 0)
        .sort((a, b) => catCounts[b] - catCounts[a])
        .slice(0, 8);
    }
    return DOMAIN_CATEGORIES[domain] || [];
  }, [domain, catCounts]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return domainArticles.filter(a => {
      if (category !== '全部' && a.category !== category) return false;
      if (!q) return true;
      return (
        (a.title_zh || '').toLowerCase().includes(q) ||
        (a.title || '').toLowerCase().includes(q) ||
        (a.summary_zh || '').toLowerCase().includes(q) ||
        (a.tags || []).some(t => t.includes(q))
      );
    });
  }, [domainArticles, category, search]);

  return (
    <div className="radar-page">
      <SEO
        title="📡 新闻雷达 — AI·安全·经济·科技·国际"
        description="实时追踪全球动态，AI、网络安全、经济、科技、国际新闻，每 30 分钟自动采集"
        url="/radar/"
      />

      {/* ── Header ── */}
      <header className="radar-header">
        <div className="radar-header-inner">
          <Link href="/" className="radar-back">← 返回首页</Link>
          <div className="radar-title-row">
            <div>
              <h1 className="radar-title">📡 新闻雷达</h1>
              <p className="radar-subtitle">
                <span className="radar-live-dot" />
                AI · 安全 · 经济 · 科技 · 国际 · 每 30 分钟更新
              </p>
            </div>
            <div className="radar-header-right">
              <input
                type="text"
                className="radar-search"
                placeholder="🔍 搜索新闻..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className="radar-site-btn" title="分享本站" onClick={shareSite}>🔗 分享</button>
              <button className="radar-site-btn" title="收藏本站" onClick={favSite}>⭐ 收藏</button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Domain Tabs ── */}
      <div className="radar-domains">
        {DOMAINS.map(({ key, emoji }) => {
          const count = domainCounts[key] || 0;
          if (key !== '全部' && count === 0) return null;
          const isActive = domain === key;
          const ds = DOMAIN_STYLE[key];
          const style = isActive && ds
            ? { background: ds.bg, color: ds.color, borderColor: ds.border }
            : {};
          return (
            <button
              key={key}
              className={`radar-domain-tab ${isActive ? 'radar-domain-active' : ''}`}
              style={style}
              onClick={() => { setDomain(key); setCategory('全部'); }}
            >
              {emoji} {key}
              <span className="radar-pill-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── Sub-categories ── */}
      {activeCats.length > 0 && (
        <div className="radar-categories">
          <button
            className={`radar-pill ${category === '全部' ? 'radar-pill-active' : ''}`}
            style={category === '全部' ? { background: 'rgba(105,240,174,0.12)', color: '#69f0ae', borderColor: 'rgba(105,240,174,0.3)' } : {}}
            onClick={() => setCategory('全部')}
          >
            全部 <span className="radar-pill-count">{domainArticles.length}</span>
          </button>
          {activeCats.map(key => {
            const count = catCounts[key] || 0;
            if (count === 0) return null;
            const isActive = category === key;
            const cs = CAT_STYLE[key] || CAT_STYLE['未分类'];
            const style = isActive ? { background: cs.bg, color: cs.color, borderColor: cs.color + '50' } : {};
            return (
              <button
                key={key}
                className={`radar-pill ${isActive ? 'radar-pill-active' : ''}`}
                style={style}
                onClick={() => setCategory(key)}
              >
                {key} <span className="radar-pill-count">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Stats ── */}
      {!loading && articles.length > 0 && (
        <div className="radar-stats">
          <span>📊 共 {filtered.length} 条</span>
          <span>🌐 {uniqueSources(articles)} 个信源</span>
          {lastUpdated && <span>{relativeTime(lastUpdated)} 更新</span>}
        </div>
      )}

      {/* ── Digest ── */}
      {!loading && digest && <DigestSection digest={digest} />}

      {/* ── Content ── */}
      <div className="radar-grid">
        {loading
          ? Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="radar-skeleton">
                <div className="radar-skeleton-line" style={{ width: '40%' }} />
                <div className="radar-skeleton-line" style={{ width: '90%' }} />
                <div className="radar-skeleton-line" style={{ width: '70%' }} />
                <div className="radar-skeleton-line" style={{ width: '55%', marginBottom: 0 }} />
              </div>
            ))
          : filtered.map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
      </div>

      {!loading && error && (
        <div className="radar-empty">
          <div className="radar-empty-emoji">⚠️</div>
          <p>加载失败：{error}</p>
          <button
            onClick={fetchData}
            style={{
              marginTop: 16,
              padding: '10px 24px',
              background: 'rgba(105,240,174,0.1)',
              color: '#69f0ae',
              border: '1px solid rgba(105,240,174,0.25)',
              borderRadius: 12,
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            🔄 重试
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="radar-empty">
          <div className="radar-empty-emoji">
            {articles.length === 0 ? '📡' : '🔍'}
          </div>
          <p>
            {articles.length === 0
              ? '雷达正在启动，新闻采集中...'
              : '没有匹配的结果，试试其他关键词'}
          </p>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="radar-footer">
        📡 黑粉科技 HyphenTech · 数据每 30 分钟自动更新
      </footer>
    </div>
  );
}

// ── Site share & favorite ─────────────────────────────────────────
const SITE_URL = 'https://hyphentech.top/radar/';
const SITE_TITLE = '📡 AI 新闻雷达 — 黑粉科技 HyphenTech';

function shareSite() {
  if (navigator.share) {
    navigator.share({ title: SITE_TITLE, url: SITE_URL }).catch(() => {});
  } else {
    navigator.clipboard.writeText(`${SITE_TITLE}\n${SITE_URL}`).then(() => {
      alert('链接已复制到剪贴板！');
    });
  }
}

function favSite() {
  alert('请按 Ctrl+D (Windows) 或 ⌘+D (Mac) 将本页加入浏览器书签');
}

// ── DigestSection ────────────────────────────────────────────────
const DIGEST_DOMAINS = [
  { key: 'AI', emoji: '🤖', label: 'AI' },
  { key: '安全', emoji: '🔒', label: '安全' },
  { key: '经济', emoji: '💰', label: '经济' },
  { key: '科技', emoji: '💻', label: '科技' },
  { key: '国际', emoji: '🌍', label: '国际' },
];

function DigestSection({ digest }) {
  const [activeDom, setActiveDom] = useState('AI');

  const availableDomains = DIGEST_DOMAINS.filter(d => digest[d.key] && digest[d.key].length > 0);
  if (availableDomains.length === 0) return null;

  // Default to first available domain
  const currentDom = availableDomains.find(d => d.key === activeDom) ? activeDom : availableDomains[0].key;
  const items = digest[currentDom] || [];
  const ds = DOMAIN_STYLE[currentDom];

  return (
    <div className="radar-digest">
      <div className="radar-digest-header">
        <span>📋 速报 · Top 10</span>
        <div className="radar-digest-tabs">
          {availableDomains.map(({ key, emoji, label }) => {
            const isActive = currentDom === key;
            const s = DOMAIN_STYLE[key];
            return (
              <button
                key={key}
                className={`radar-digest-tab ${isActive ? 'radar-digest-tab-active' : ''}`}
                style={isActive ? { background: s.bg, color: s.color, borderColor: s.border } : {}}
                onClick={() => setActiveDom(key)}
              >
                {emoji} {label}
              </button>
            );
          })}
        </div>
        {digest.generated_at && (
          <span className="radar-digest-time">{relativeTime(digest.generated_at)} 生成</span>
        )}
      </div>
      <ol className="radar-digest-list">
        {items.map((item, i) => {
          const catConf = CAT_STYLE[item.category] || CAT_STYLE['未分类'];
          const catEmoji = CAT_EMOJI[item.category] || '📰';
          return (
            <li key={i} className="radar-digest-item">
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <span className="radar-digest-rank">{i + 1}</span>
                <span
                  className="radar-digest-badge"
                  style={{ background: catConf.bg, color: catConf.color }}
                >
                  {catEmoji}
                </span>
                <span className="radar-digest-title">{item.title}</span>
                <span className="radar-digest-summary">{item.summary}</span>
                {item.source && (
                  <span className="radar-digest-source">{item.source}</span>
                )}
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ── NewsCard ─────────────────────────────────────────────────────
function NewsCard({ article }) {
  const cat = CAT_STYLE[article.category] || CAT_STYLE['未分类'];
  const catEmoji = CAT_EMOJI[article.category] || '📰';
  const srcEmoji = SOURCE_EMOJI[article.source] || '📰';

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="radar-card"
    >
      <div className="radar-card-top">
        <span
          className="radar-card-badge"
          style={{ background: cat.bg, color: cat.color }}
        >
          {catEmoji} {article.category}
        </span>
        <span className="radar-card-source">
          {srcEmoji} {article.source}
        </span>
        <span className="radar-card-time">
          {relativeTime(article.published)}
        </span>
      </div>

      <div className="radar-card-title">
        {article.title_zh || article.title}
      </div>

      <div className="radar-card-summary">
        {article.summary_zh}
      </div>
    </a>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
