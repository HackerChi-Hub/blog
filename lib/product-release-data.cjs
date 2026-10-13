const fs = require('fs');
const path = require('path');
const { buildProductCards, PRODUCT_DEFINITIONS } = require('./product-catalog.cjs');
const { fingerprint } = require('./product-fingerprint.cjs');

// Next.js 打包后 __dirname 会变成 .next/server/chunks，构建工作目录才是稳定的仓库根。
const cachePath = path.resolve(process.cwd(), '.product-release-cache.json');

function validateProductSnapshot(snapshot, { allowLegacy = false } = {}) {
  const expected = PRODUCT_DEFINITIONS.filter((product) => !product.pending).map((product) => product.releaseRepo);
  if (!snapshot || !Array.isArray(snapshot.products) || snapshot.products.length !== expected.length ||
    new Set(snapshot.products.map((product) => product?.releaseRepo)).size !== expected.length ||
    expected.some((repo) => !snapshot.products.some((product) => product?.releaseRepo === repo)) ||
    !snapshot.checkedAt || !Number.isFinite(Date.parse(snapshot.checkedAt))) {
    throw new Error('软件发行快照不完整，拒绝显示为当前版本');
  }
  const legacy = allowLegacy && snapshot.schemaVersion === undefined;
  const patterns = { macOS: /\.(?:dmg|pkg)$/i, Windows: /\.(?:exe|msi)$/i, Linux: /\.(?:AppImage|deb|rpm)$/i };
  const checkUrl = (value, repo, section) => {
    const url = new URL(value);
    if (url.origin !== 'https://github.com' || url.username || url.password ||
      !url.pathname.startsWith(`/${repo}/releases/${section}/`) ||
      !url.pathname.slice(`/${repo}/releases/${section}/`.length)) throw new Error(`${repo} 的发行或安装包地址不属于登记仓库`);
  };
  for (const product of snapshot.products) {
    if (product.source !== 'release' || typeof product.version !== 'string' || !product.version ||
      !Array.isArray(product.platforms) || !product.platforms.length ||
      new Set(product.platforms.map((item) => item.platform)).size !== product.platforms.length) {
      throw new Error(`${product.releaseRepo} 没有可验证的公开发行与安装包`);
    }
    checkUrl(product.releaseUrl, product.releaseRepo, 'tag');
    for (const platform of product.platforms) {
      if (!patterns[platform.platform] || !platform.version || !Array.isArray(platform.assets) || !platform.assets.length) {
        throw new Error(`${product.releaseRepo} 的平台安装包不完整`);
      }
      checkUrl(platform.url, product.releaseRepo, 'tag');
      for (const asset of platform.assets) {
        if (!patterns[platform.platform].test(asset.name || '')) throw new Error('签名或清单文件不能充当安装包');
        checkUrl(asset.url, product.releaseRepo, 'download');
      }
    }
    if ((!legacy || product.revision) && product.revision !== fingerprint(product)) throw new Error('软件信息指纹不一致');
  }
  if (!legacy && snapshot.schemaVersion !== 1) throw new Error('软件发行快照版本不支持');
  if ((!legacy || snapshot.contentHash) && snapshot.contentHash !== fingerprint(snapshot.products)) throw new Error('软件发行快照内容指纹不一致');
  return snapshot;
}

function readProductSnapshot(filePath = cachePath) {
  if (!fs.existsSync(filePath)) return null;
  return validateProductSnapshot(JSON.parse(fs.readFileSync(filePath, 'utf8')), { allowLegacy: true });
}

async function currentProductCards() {
  const snapshot = readProductSnapshot();
  if (snapshot) return snapshot.products;
  if (process.env.NODE_ENV === 'production') throw new Error('缺少本次构建的软件发行快照，请通过 npm run build 构建');
  return buildProductCards([], { strict: true });
}

module.exports = { cachePath, readProductSnapshot, validateProductSnapshot, currentProductCards };
