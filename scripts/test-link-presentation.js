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
assert.match(md.render('```text\nhttps://github.com/HackerChi-Hub/localbrain-releases/releases\n```'), /data-link-kind="download"/);
assert.match(md.render('```text\nhttps://example.com/file.zip\n```', {lang:'en'}), /Opens in a new tab/);
for (const [lang, first, second] of [['zh-CN','最新安装包','产品介绍'],['zh-TW','最新安裝包','產品介紹'],['en','Latest installer','Product page']]) {
  const source = `\`\`\`text\n${first}\nhttps://github.com/HackerChi-Hub/localbrain-releases/releases/latest\n${second}\nhttps://hyphentech.top/localbrain\n\`\`\``;
  const result = md.render(source, {lang});
  assert.equal((result.match(/<a /g) || []).length, 2);
  assert(!result.includes('<pre>'));
  assert.deepEqual(auditHtmlLinks(result).failures, []);
}
assert(auditHtmlLinks('<pre><code>最新安装包\nhttps://example.com/file.zip\n产品介绍\nhttps://example.com/product\n</code></pre>').failures.length);
const shellLinks = '```shell\n最新安装包\nhttps://github.com/HackerChi-Hub/localbrain-releases/releases/latest\n产品介绍\nhttps://hyphentech.top/localbrain\n```';
assert.equal((md.render(shellLinks).match(/<a /g) || []).length, 2);
assert(auditHtmlLinks('<pre><code class="language-shell">最新安装包\nhttps://example.com/file.zip\n</code></pre>').failures.length);
assert(!md.render('`http://localhost:11434/v1`').includes('<a '));
assert(!md.render('```text\nhttp://192.168.x.x:3080/\n```').includes('<a '));
assert.deepEqual(auditHtmlLinks('<pre><code>http://192.168.x.x:3080/</code></pre>').failures, []);
assert.deepEqual(auditHtmlLinks('<p><code>http://localhost:11434/v1</code></p>').failures, []);
assert.deepEqual(auditHtmlLinks("<div class='code-pre'>curl https://example.com/install.sh</div>").failures, []);
assert(auditHtmlLinks('<p>www.example.com</p>').failures.length);
assert(!md.render('[坏地址](javascript:alert(1))').includes('href="javascript:'));
console.log('✅ 渲染兜底与 HTML 裸链接闸门检查通过');
