#!/usr/bin/env node
'use strict';
const fs = require('fs');
const { buildProductCards } = require('../lib/product-catalog.cjs');
const { cachePath } = require('../lib/product-release-data.cjs');

async function main() {
  if (process.env.PRODUCT_RELEASES_OFFLINE === '1') throw new Error('正式构建不能离线假定软件版本为最新');
  const products = await buildProductCards([], { strict: true });
  if (products.some((product) => !product.version || product.source !== 'release' || !product.platforms.length)) {
    throw new Error('有产品没有实际公开安装包，拒绝生成当前发行快照');
  }
  const snapshot = { checkedAt: new Date().toISOString(), products };
  fs.writeFileSync(cachePath, `${JSON.stringify(snapshot, null, 2)}\n`);
  for (const product of products) {
    console.log(`✅ ${product.name} ${product.version}：${product.platforms.map((item) => `${item.platform} ${item.version}`).join('；')}`);
  }
  console.log('✅ 首页、产品介绍页及文章推荐共用本次发行快照；读取失败会停止构建，不伪装最新');
}

main().catch((error) => { console.error(`❌ 软件版本同步失败：${error.message}`); process.exit(1); });
