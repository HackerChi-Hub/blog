const assert = require('assert');
const MarkdownIt = require('markdown-it');
const { normalizeReadableLinks: fix } = require('../lib/article-links.cjs');
const { isEndpoint } = require('../lib/article-links.cjs');
const md = new MarkdownIt({html:false,linkify:true});
const examples = [
  '下载库 https://github.com/HackerChi-Hub/localbrain-releases/releases。',
  '官网：`https://example.com/docs`',
  '<https://example.com/a_(b)>',
  '| 来源 | https://example.com/pricing |',
  '[下载与更新](https://github.com/HackerChi-Hub/HyphenScreen-Releases/releases)',
  'https://example.com/files/a.zip?download=1',
];
for(const s of examples) {
  const result=fix(s);
  assert.match(md.render(result), /<a href=/);
  assert.equal(fix(result), result, '再次运行必须无变化：'+s);
}
for(const s of [
  '```bash\ncurl https://example.com/a.zip\n```',
  '    curl https://example.com/a.zip',
  '`curl https://example.com/a.zip`',
  '![图片](https://example.com/a.png)',
  '[已标注](https://example.com/abc?q=1#part)',
  '[参考]: https://example.com/a',
  '`http://localhost:8080`',
]) assert.equal(fix(s),s,'不得修改代码/图片/已有明确链接：'+s);
assert.equal(md.render(fix('https://example.com/a?x=1&y=2')).match(/href="([^"]+)"/)[1],'https://example.com/a?x=1&amp;y=2');
assert(!md.render(fix('`javascript:alert(1)`')).includes('<a '));
assert.match(fix('https://example.com/docs',{lang:'en'}),/Documentation/);
assert.match(fix('https://example.com/a.zip',{lang:'zh-TW'}),/下載/);
assert(isEndpoint('http://127.0.0.1:8080/v1'));
assert(isEndpoint('https://api.example.com/v1/chat/completions'));
assert(!isEndpoint('https://api.example.com/docs'));
assert(!isEndpoint('https://10.example.com/guide'));
assert.match(md.render(fix('`https://api.example.com/docs`')), /<a href=/);
console.log('✅ 链接格式回归通过：网页、下载、表格、括号、查询串、多语言、代码与图片保护');
