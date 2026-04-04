import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import SEO from '../components/SEO';


const DATA_URL = 'https://hackerchi-hub.github.io/NewsRadar/data/news.json';
const REFRESH_MS = 5 * 60 * 1000;

// ── Category config ──────────────────────────────────────────────
const CATEGORIES = [
  { key: '全部', emoji: '📡' },
  { key: 'LLM', emoji: '🤖' },
  { key: 'CV', emoji: '👁️' },
  { key: '机器人', emoji: '🦾' },
  { key: 'AI产品', emoji: '🛠️' },
  { key: '研究', emoji: '🔬' },
  { key: '行业', emoji: '🏢' },
  { key: '政策', emoji: '⚖️' },
  { key: '开源', emoji: '💻' },
  { key: '未分类', emoji: '📰' },
];

const CAT_STYLE = {
  LLM: { color: '#69f0ae', bg: 'rgba(105,240,174,0.12)' },
  CV: { color: '#6cb8ff', bg: 'rgba(108,184,255,0.12)' },
  '机器人': { color: '#ffb347', bg: 'rgba(255,179,71,0.12)' },
  'AI产品': { color: '#b388ff', bg: 'rgba(179,136,255,0.12)' },
  '研究': { color: '#ffd54f', bg: 'rgba(255,213,79,0.12)' },
  '行业': { color: '#00e5ff', bg: 'rgba(0,229,255,0.12)' },
  '政策': { color: '#ff5370', bg: 'rgba(255,83,112,0.12)' },
  '开源': { color: '#ff7fd1', bg: 'rgba(255,127,209,0.12)' },
  '未分类': { color: '#93a3b8', bg: 'rgba(147,163,184,0.10)' },
};

const SOURCE_EMOJI = {
  'Hacker News': '🟠',
  'arXiv': '📄',
  'TechCrunch AI': '🚀',
  'The Verge AI': '📱',
  'MIT Tech Review': '🎓',
  'VentureBeat AI': '💰',
  'Ars Technica AI': '🔧',
  '机器之心': '🧠',
  '量子位': '⚛️',
  '雷锋网 AI': '⚡',
  'OpenAI Blog': '🟢',
  'DeepMind Blog': '🔷',
  'Google AI Blog': '🔍',
  'Hugging Face Blog': '🤗',
  'The Decoder': '🔓',
  'Microsoft AI Blog': '🪟',
  'Meta AI Blog': '🔵',
  'AWS AI Blog': '☁️',
  'NVIDIA Blog': '🟩',
  '36氪': '💡',
  'InfoQ 中文': '📋',
  '虎嗅': '🐯',
  '钛媒体': '🔗',
  '爱范儿': '❤️',
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

  const counts = useMemo(() => {
    const c = { '全部': articles.length };
    for (const a of articles) c[a.category] = (c[a.category] || 0) + 1;
    return c;
  }, [articles]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return articles.filter(a => {
      if (category !== '全部' && a.category !== category) return false;
      if (!q) return true;
      return (
        (a.title_zh || '').toLowerCase().includes(q) ||
        (a.title || '').toLowerCase().includes(q) ||
        (a.summary_zh || '').toLowerCase().includes(q) ||
        (a.tags || []).some(t => t.includes(q))
      );
    });
  }, [articles, category, search]);

  return (
    <div className="radar-page">
      <SEO
        title="📡 AI 新闻雷达"
        description="实时追踪全球 AI 动态，每 30 分钟自动采集，Gemini AI 中文摘要"
        url="/radar/"
      />

      {/* ── Header ── */}
      <header className="radar-header">
        <div className="radar-header-inner">
          <Link href="/" className="radar-back">← 返回首页</Link>
          <div className="radar-title-row">
            <div>
              <h1 className="radar-title">📡 AI 新闻雷达</h1>
              <p className="radar-subtitle">
                <span className="radar-live-dot" />
                实时追踪全球 AI 动态 · 每 30 分钟更新
              </p>
            </div>
            <input
              type="text"
              className="radar-search"
              placeholder="🔍 搜索新闻..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* ── Categories ── */}
      <div className="radar-categories">
        {CATEGORIES.map(({ key, emoji }) => {
          const count = counts[key] || 0;
          if (key !== '全部' && count === 0) return null;
          const isActive = category === key;
          const style = isActive
            ? {
                background: CAT_STYLE[key]?.bg || 'rgba(105,240,174,0.12)',
                color: CAT_STYLE[key]?.color || '#69f0ae',
                borderColor: `${CAT_STYLE[key]?.color || '#69f0ae'}50`,
              }
            : {};
          return (
            <button
              key={key}
              className={`radar-pill ${isActive ? 'radar-pill-active' : ''}`}
              style={style}
              onClick={() => setCategory(key)}
            >
              {emoji} {key}
              <span className="radar-pill-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── Stats ── */}
      {!loading && articles.length > 0 && (
        <div className="radar-stats">
          <span>📊 共 {filtered.length} 条新闻</span>
          <span>🌐 来自 {uniqueSources(articles)} 个信源</span>
          {lastUpdated && <span>{relativeTime(lastUpdated)} 更新</span>}
        </div>
      )}

      {/* ── Digest ── */}
      {!loading && digest && digest.items && digest.items.length > 0 && (
        <div className="radar-digest">
          <div className="radar-digest-header">
            <span>📋 AI 速报 · 最重要的 {digest.items.length} 条</span>
            {digest.generated_at && (
              <span className="radar-digest-time">{relativeTime(digest.generated_at)} 生成</span>
            )}
          </div>
          <ol className="radar-digest-list">
            {digest.items.map((item, i) => {
              const catConf = CAT_STYLE[item.category] || CAT_STYLE['未分类'];
              const catEmoji = CATEGORIES.find(c => c.key === item.category)?.emoji || '📰';
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
      )}

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

// ── NewsCard ─────────────────────────────────────────────────────
function NewsCard({ article }) {
  const cat = CAT_STYLE[article.category] || CAT_STYLE['未分类'];
  const catEmoji = CATEGORIES.find(c => c.key === article.category)?.emoji || '📰';
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
