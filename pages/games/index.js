import Link from 'next/link';
import SEO from '../../components/SEO';
import StandaloneShareSection from '../../components/StandaloneShareSection';

const GAMES = [
  {
    id: 'ufo-commander',
    title: '飞碟指挥官',
    slug: 'ufo-commander',
    href: '/games/ufo-commander/',
    emoji: '🛸',
    desc: '操纵飞碟吸取敌方小兵、释放为我方作战 · 4兵种 · 策略对战',
    status: 'new',
  },
];

const styles = `
  .games-page {
    min-height: 100vh;
    background: #05060b;
    padding: 48px 20px;
  }
  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 32px;
  }
  .game-card {
    border-radius: 24px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    padding: 28px;
    text-decoration: none;
    transition: all 220ms ease;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .game-card:hover {
    border-color: rgba(0, 229, 255, 0.4);
    background: rgba(0, 229, 255, 0.06);
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0,229,255,0.15);
  }
  .game-card__emoji {
    font-size: 2.5rem;
  }
  .game-card__title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #e9f6ff;
    margin: 0;
  }
  .game-card__desc {
    font-size: 0.9rem;
    color: #93a3b8;
    margin: 0;
    line-height: 1.5;
  }
  .game-card__badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 999px;
    background: rgba(0,229,255,0.15);
    color: #00e5ff;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    width: fit-content;
  }
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #69f0ae;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    margin-bottom: 32px;
  }
  .back-link:hover { opacity: 0.8; }
`;

export default function GamesPage() {
  return (
    <>
      <SEO
        title="游戏合集 | 黑粉科技"
        description="黑粉科技互动游戏合集"
        url="/games/"
        type="website"
      />
      <style>{styles}</style>
      <main className="games-page">
        <Link href="/" className="back-link">
          ← 返回首页
        </Link>
        <h1 style={{ color: '#e9f6ff', fontSize: '2rem', fontWeight: 700, marginBottom: 0 }}>
          游戏合集
        </h1>
        <p style={{ color: '#93a3b8', marginTop: '8px', fontSize: '1rem' }}>
          黑粉科技互动游戏 · 持续更新中
        </p>
        <div className="games-grid">
          {GAMES.map((game) => (
            <Link key={game.id} href={game.href} className="game-card">
              <div className="game-card__emoji">{game.emoji}</div>
              <h2 className="game-card__title">{game.title}</h2>
              <p className="game-card__desc">{game.desc}</p>
              <span className="game-card__badge">{game.status === 'new' ? 'New' : ''}</span>
            </Link>
          ))}
        </div>
        <StandaloneShareSection
          title="黑粉科技游戏合集"
          url="/games/"
          description="黑粉科技互动游戏合集，浏览器打开就能玩。"
        />
      </main>
    </>
  );
}
