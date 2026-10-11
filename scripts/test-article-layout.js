const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const postcss = require('postcss');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const rules = (file) => {
  const result = {};
  postcss.parse(read(file)).walkRules((rule) => {
    if (rule.parent.type === 'root') result[rule.selector] = Object.fromEntries(
      rule.nodes.filter((node) => node.type === 'decl').map((node) => [node.prop, node.value])
    );
  });
  return result;
};
const layout = rules('styles/labnote.css');
const global = rules('styles/globals.css');
assert.equal(layout[':root']['--article-cover-ratio'], '16 / 9');
assert.equal(layout['.article-cover-frame']['aspect-ratio'], 'var(--article-cover-ratio)');
assert.equal(layout['.featured-card__cover, .post-cover']['aspect-ratio'], 'var(--article-cover-ratio)');
assert.equal(global['.contained-cover__image']['object-fit'], 'contain', '清晰层不能裁切文章封面');
assert.equal(global['.contained-cover__backdrop']['object-fit'], 'cover');
assert.equal(global['.contained-cover__backdrop']['max-width'], 'none', '背景不能被全局 img 的 max-width 限制而露边');
assert.equal(global['.contained-cover__image'].transform, 'none');
assert.ok(Number(global['.contained-cover__backdrop'].opacity) >= .8, '背景不能暗成黑边');
assert.ok(!layout['.article-sheet']['margin-top']?.startsWith('-'), '标题面板不能盖住封面');
assert.equal(layout['.article-page .article-content']['max-width'], '760px');
assert.equal(layout['.article-page .markdown-content :is(img, video)'].height, 'auto', '正文图片仍按自然比例显示');
const detail = read('pages/[slug].js');
assert.match(detail, /<ArticleCover src=\{meta.image\}.*?priority/);
assert.doesNotMatch(detail, /priority natural/);
assert.match(detail, /className="page labnote-page article-page"/);
for (const component of ['components/PostListPage.js', 'components/RelatedPosts.js', 'components/HomeHero.js']) {
  assert.match(read(component), /<ArticleCover/);
}
assert.match(read('components/DiscoveryPage.js'), /aspect-ratio:var\(--article-cover-ratio\)/);
assert.match(read('components/ArticleCover.js'), /fallback=\{fallback\}/);
assert.match(read('components/ContainedCover.js'), /failedSource === source/, '换图后不能沿用上一张图的失败状态');
assert.match(read('components/PostListPage.js'), /href=\{listHref\(lang, currentPage - 1\)\}/, '第 2 页的上一页应到列表第 1 页，而不是首页');
console.log('✅ 文章布局回归通过：封面统一 16:9、清晰层完整显示、同图背板铺满、故障占位、正文自然比例与分页跳转');
