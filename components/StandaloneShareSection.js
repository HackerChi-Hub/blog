import ShareButtons from './ShareButtons';

export default function StandaloneShareSection({ title, url, description }) {
  return (
    <section
      aria-label="分享这个页面"
      style={{
        width: 'min(100%, 1120px)',
        margin: '48px auto 24px',
        padding: '24px',
        borderRadius: '18px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.035)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            color: '#69f0ae',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
          }}
        >
          分享这个页面
        </div>
        <p
          style={{
            margin: '8px 0 0',
            color: 'var(--text-secondary, #aab7c8)',
            fontSize: '0.92rem',
            lineHeight: 1.6,
          }}
        >
          觉得有用，就顺手递给下一个可能会踩坑的人。
        </p>
      </div>
      <ShareButtons title={title} url={url} description={description} />
    </section>
  );
}
