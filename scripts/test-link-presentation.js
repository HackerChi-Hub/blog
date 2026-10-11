const assert = require('node:assert/strict');
const MarkdownIt = require('markdown-it');
const { installArticleLinks, auditHtmlLinks } = require('../lib/link-presentation.cjs');
const md = new MarkdownIt({ html: false, linkify: true });
installArticleLinks(md);
for (const source of ['https://example.com/file.zip', '`https://example.com`', '```text\nhttps://example.com/a_(b)?x=1&y=2\n```', '[官方入口](https://example.com)']) {
  const html = md.render(source, { lang: 'zh-CN' });
  assert.match(html, /<a class="resource-link"|<a href=/);
  assert.deepEqual(auditHtmlLinks(html).failures, []);
  assert.match(html, /target="_blank"/);
}
const code = md.render('`curl https://example.com`\n\n```bash\npip install git+https://github.com/a/b.git\n```');
assert.match(code, /<pre>/); assert(!code.includes('<a '));
assert.deepEqual(auditHtmlLinks(code).failures, []);
assert(auditHtmlLinks('<p>https://example.com</p>').failures.length);
assert(auditHtmlLinks('<p><code>https://example.com</code></p>').failures.length);
assert(auditHtmlLinks('<pre><code>https://example.com/file.zip\n</code></pre>').failures.length);
assert.deepEqual(auditHtmlLinks('<script>https://example.com</script><a href="https://example.com">官网</a>').failures, []);
assert.deepEqual(auditHtmlLinks('<div class="code-pre"><span>$</span> curl https://example.com</div>').failures, []);
assert(auditHtmlLinks('<div class="code-pre">curl https://example.com</div><p>https://example.com</p>').failures.length);
assert.match(md.render('https://example.com/file.zip', {lang:'en'}), /Download/);
assert(!md.render('[坏地址](javascript:alert(1))').includes('href="javascript:'));
console.log('✅ 渲染兜底与 HTML 裸链接闸门检查通过');
