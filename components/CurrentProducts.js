import { makeT, formatDateFor } from '../lib/blog-i18n.cjs';

export function ProductReleaseMeta({ product, lang = 'zh-CN' }) {
  const t = makeT(lang);
  return (
    <div className="current-product-meta" data-product-repo={product.releaseRepo} data-product-version={product.version} data-product-revision={product.revision}>
      <div className="current-product-version">
        <strong>{t('最新版本 {version}', { version: product.version })}</strong>
        {product.prerelease && <span>{t('初步构建 · 预览版')}</span>}
        <a href={product.releaseUrl} target="_blank" rel="noopener noreferrer">{t('更新说明 ↗')}</a>
      </div>
      {product.platforms?.length > 0 && (
        <ul className="current-product-platforms" aria-label={t('各平台公开安装包')}>
          {product.platforms.map((item) => (
            <li key={item.platform}>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <span>{item.platform}</span><strong>{item.version}</strong>
                {item.prerelease && <small>{t('初步构建 · 预览版')}</small>}
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      {product.checkedAt && <time dateTime={product.checkedAt} title={product.checkedAt}>{t('发行核验于 {date}', { date: formatDateFor(product.checkedAt, lang) })}</time>}
    </div>
  );
}

export default function CurrentProducts({ products = [], lang = 'zh-CN', focused = false }) {
  const t = makeT(lang);
  if (!products.length) return null;
  return (
    <section className={`current-products${focused ? ' current-products--focused' : ''}`} aria-label={t('当前公开发行')}>
      <h2>{focused ? t('当前公开发行') : t('自制软件')}</h2>
      <p className="current-products-explanation">{t('版本、功能变化和安装平台统一取自公开发行记录。')}</p>
      <div className="current-products-grid">
        {products.map((product) => (
          <article className="current-product" key={product.releaseRepo}>
            <h3>{t(product.name)}</h3>
            <p>{t(product.description)}</p>
            <ProductReleaseMeta product={product} lang={lang} />
            {lang !== 'en' && product.updateSummary && <div className="current-product-changes"><strong>{t('最新变化')}</strong><p lang="zh-CN">{product.updateSummary}</p></div>}
            <a className="current-product-download" href={product.releaseUrl} target="_blank" rel="noopener noreferrer">{t('查看公开下载与更新')} ↗</a>
          </article>
        ))}
      </div>
    </section>
  );
}
