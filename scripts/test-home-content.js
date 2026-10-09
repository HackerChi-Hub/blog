const assert = require('node:assert/strict');
const { AI_LAB_TOOLS, RESOURCE_RADARS, selectHomeArticlePosts } = require('../lib/home-content.cjs');

const articles = Array.from({ length: 30 }, (_, index) => ({ slug: `article-${index}` }));
const radars = Array.from({ length: 70 }, (_, index) => ({
  slug: `radar-${index}`, articleType: index % 2 ? 'skill' : 'model',
}));
const all = [...radars, ...articles];
assert.deepEqual(selectHomeArticlePosts(all), articles.slice(0, 21));
assert.deepEqual(selectHomeArticlePosts(all, 6), articles.slice(0, 6));
assert.deepEqual(selectHomeArticlePosts(radars), []);
assert.equal(all.length, 100, '不得修改完整搜索与雷达索引的数据');
assert.equal(AI_LAB_TOOLS.length, 4);
assert.equal(new Set(AI_LAB_TOOLS.map((tool) => tool.href)).size, 4);
assert.deepEqual(RESOURCE_RADARS.map((radar) => radar.href), ['/radar/', '/models/', '/skills/']);
assert.ok(RESOURCE_RADARS.every((radar) => radar.title.length === 4));
console.log('✅ 首页分类回归通过：雷达与实测分区、先过滤再限量、入口去重与四字名称');
