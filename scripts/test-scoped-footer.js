#!/usr/bin/env node
'use strict';
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const script = path.join(__dirname, 'sync-article-footer-template.js');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-footer-scope-'));
try {
  fs.mkdirSync(path.join(root, 'posts'));
  fs.mkdirSync(path.join(root, 'templates'));
  const identityPath = path.join(root, 'identity.json');
  fs.writeFileSync(identityPath, JSON.stringify({
    products: [{ id: 'fixture', name: '测试工具', url: 'https://example.com/releases', public: true }],
    cta_rules: { fixed_product_order: ['fixture'] },
  }));
  fs.writeFileSync(path.join(root, 'templates', '博客文章.md'), '# 模板\n');
  const post = '---\nstatus: published\n---\n\n# 正文\n';
  for (const slug of ['selected', 'untouched']) fs.writeFileSync(path.join(root, 'posts', slug + '.md'), post);
  const run = (slugs) => spawnSync(process.execPath, [script, '--content-dir', root], {
    encoding: 'utf8', env: { ...process.env, HFKJ_IDENTITY_PATH: identityPath, BLOG_PUBLISH_SLUGS: slugs },
  });
  let result = run('selected');
  assert.strictEqual(result.status, 0, result.stderr);
  assert(fs.readFileSync(path.join(root, 'posts/selected.md'), 'utf8').includes('HFKJ_FIXED_FOOTER_START'));
  assert.strictEqual(fs.readFileSync(path.join(root, 'posts/untouched.md'), 'utf8'), post);
  assert.strictEqual(fs.readFileSync(path.join(root, 'templates/博客文章.md'), 'utf8'), '# 模板\n');
  const before = fs.readFileSync(path.join(root, 'posts/selected.md'));
  assert.strictEqual(run('selected').status, 0);
  assert(before.equals(fs.readFileSync(path.join(root, 'posts/selected.md'))));
  assert.notStrictEqual(run('missing').status, 0);
  assert.notStrictEqual(run('../untouched').status, 0);
  result = run('');
  assert.strictEqual(result.status, 0, result.stderr);
  assert(fs.readFileSync(path.join(root, 'posts/untouched.md'), 'utf8').includes('HFKJ_FIXED_FOOTER_START'));
  assert(fs.readFileSync(path.join(root, 'templates/博客文章.md'), 'utf8').includes('HFKJ_FIXED_FOOTER_START'));
  console.log('✅ 页尾范围测试通过：只更新选定文章、保留其他正文和模板、幂等、非法或缺失范围拒绝、默认全库行为保留');
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
