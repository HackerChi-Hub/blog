const fs = require('fs');
const path = require('path');
const { buildProductCards, PRODUCT_DEFINITIONS } = require('./product-catalog.cjs');

const cachePath = path.resolve(__dirname, '..', '.product-release-cache.json');

function readProductSnapshot() {
  if (!fs.existsSync(cachePath)) return null;
  const snapshot = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  const expected = PRODUCT_DEFINITIONS.filter((product) => !product.pending).map((product) => product.releaseRepo);
  if (!Array.isArray(snapshot.products) || expected.some((repo) =>
    !snapshot.products.some((product) => product.releaseRepo === repo && product.source === 'release' && product.version)
  )) throw new Error('软件发行快照不完整，拒绝显示为当前版本');
  return snapshot;
}

async function currentProductCards() {
  const snapshot = readProductSnapshot();
  if (snapshot) return snapshot.products;
  if (process.env.NODE_ENV === 'production') throw new Error('缺少本次构建的软件发行快照，请通过 npm run build 构建');
  return buildProductCards([], { strict: true });
}

module.exports = { cachePath, readProductSnapshot, currentProductCards };
