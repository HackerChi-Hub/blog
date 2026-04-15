import SEO from '../../components/SEO';
import Link from 'next/link';

const styles = `
  .game-page {
    min-height: 100vh;
    background: #05060b;
    padding: 32px 20px;
  }
  .game-page__header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
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
  }
  .back-link:hover { opacity: 0.8; }
  .game-title {
    color: #e9f6ff;
    font-size: 1.6rem;
    font-weight: 700;
    margin: 0;
  }
  .game-subtitle {
    color: #93a3b8;
    font-size: 0.9rem;
    margin: 4px 0 0;
  }
  .game-iframe-wrap {
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 30px 70px rgba(0,0,0,0.6);
    max-width: 960px;
    margin: 0 auto;
  }
  .game-iframe-wrap iframe {
    display: block;
    width: 100%;
    height: calc(100vh - 180px);
    min-height: 500px;
    border: none;
  }
  .copyright {
    text-align: center;
    color: rgba(255,255,255,0.25);
    font-size: 0.8rem;
    margin-top: 20px;
  }
`;

export default function AntimatterPage() {
  return (
    <>
      <SEO
        title="反物质隔离 | 黑粉科技游戏"
        description="保护中心目标不被正反物质粒子碰撞 · Three.js 互动游戏"
        url="/games/antimatter/"
        type="website"
      />
      <style>{styles}</style>
      <main className="game-page">
        <div className="game-page__header">
          <Link href="/games/" className="back-link">
            ← 游戏合集
          </Link>
        </div>
        <h1 className="game-title">反物质隔离</h1>
        <p className="game-subtitle">© 黑粉科技 · 保护白色目标不被粒子碰撞 · <a href="https://www.hyphentech.top" target="_blank" style={{color:'#69f0ae'}}>www.hyphentech.top</a></p>

        <div className="game-iframe-wrap">
          <iframe
            src="/games/antimatter/index.html"
            title="反物质隔离"
            allow="fullscreen"
          />
        </div>

        <p className="copyright">© <a href="https://www.hyphentech.top" target="_blank" style={{color:'rgba(255,255,255,0.3)'}}>黑粉科技</a> www.hyphentech.top</p>
      </main>
    </>
  );
}
