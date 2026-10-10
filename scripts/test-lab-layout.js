const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const postcss = require('postcss');
const { AI_LAB_TOOLS } = require('../lib/home-content.cjs');

const root = path.resolve(__dirname, '..');
const css = postcss.parse(fs.readFileSync(path.join(root, 'styles/home-layout.css'), 'utf8'));
const rules = {};
css.walkRules((rule) => {
  if (rule.parent.type !== 'root') return;
  rules[rule.selector] = Object.fromEntries(rule.nodes.filter((node) => node.type === 'decl').map((node) => [node.prop, node.value]));
});

const card = rules['.home-shell--v2 .lab-tool'];
assert.equal(card['flex-direction'], 'column');
assert.equal(card['align-items'], 'stretch', '不能继承旧样式的居中对齐而露出空白条');
assert.equal(card['min-height'], '0');
assert.equal(rules['.lab-tool__preview > .contained-cover__natural'].height, 'auto');
assert.ok(!rules['.lab-tool__preview'].height, '图片框不能固定高度');
assert.ok(!rules['.lab-tool__preview']['min-height'], '图片框不能用最小高度撑出黑边');
assert.equal(rules['.lab-tool__diagram'].width, '100%');
assert.ok(rules['.lab-tool__diagram']['aspect-ratio']);

for (const tool of AI_LAB_TOOLS.filter((item) => item.image)) {
  const bytes = fs.readFileSync(path.join(root, 'public', tool.image));
  assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
  assert.equal(bytes.readUInt32BE(16), tool.imageWidth, `${tool.title} 宽度必须等于真实图片`);
  assert.equal(bytes.readUInt32BE(20), tool.imageHeight, `${tool.title} 高度必须等于真实图片`);
}

const home = fs.readFileSync(path.join(root, 'components/HomePage.js'), 'utf8');
const lab = home.slice(home.indexOf('const LabTool ='), home.indexOf('const LabSection ='));
assert.match(lab, /\bnatural\b/);
assert.match(lab, /\bpriority\b/, '实验台图片不应等待懒加载');
assert.match(lab, /fallback=\{diagram\}/, '加载失败必须有非空替代展示');
const cover = fs.readFileSync(path.join(root, 'components/ContainedCover.js'), 'utf8');
assert.match(cover, /if \(!source \|\| failed\) return fallback;/);
assert.match(cover, /image\?\.complete && !image\.naturalWidth/, '图片在页面接管前失败也要显示替代内容');
console.log('✅ 实验台布局回归通过：完整比例、无固定高度黑边、图示铺满、提前加载与失败替代');
