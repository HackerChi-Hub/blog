#!/usr/bin/env node

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const validator = path.join(root, 'scripts', 'validate-content.js');
const synchronizer = path.join(root, 'scripts', 'sync-obsidian-content.js');
const importer = path.join(root, 'scripts', 'import-article-content.js');

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function run(script, args, expectedStatus = 0) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.strictEqual(
    result.status,
    expectedStatus,
    `命令状态不符：node ${path.basename(script)} ${args.join(' ')}\n${result.stdout}\n${result.stderr}`
  );
  return `${result.stdout || ''}${result.stderr || ''}`;
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(target) : [target];
  }).sort();
}

function treeHash(directory) {
  const hash = crypto.createHash('sha256');
  for (const filePath of walkFiles(directory)) {
    hash.update(path.relative(directory, filePath));
    hash.update(fs.readFileSync(filePath));
  }
  return hash.digest('hex');
}

function publishedPost(status = 'published', body = '') {
  return `---
title: 测试文章
slug: live-post
status: ${status}
date: 2026-08-31
updated: 2026-08-31
summary: 这是测试摘要
categories:
  - 技术分享
tags:
  - AI
cover: /obsidian-assets/live-post/cover.png
legacy_paths:
  - old-live-post
notion_id: 11111111-1111-1111-1111-111111111111
---

${body || '正文。\n\n![配图](https://hyphentech.top/obsidian-assets/live-post/body.png)'}
`;
}

function main() {
  const holder = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-content-pipeline-'));
  const project = path.join(holder, 'project');
  const content = path.join(holder, 'content');
  const assets = path.join(holder, 'assets');
  const exportDir = path.join(project, 'content-export');
  const publicAssets = path.join(project, 'public', 'obsidian-assets');
  const syncArgs = [
    '--project-root', project,
    '--content-dir', content,
    '--asset-root', assets,
    '--export-dir', exportDir,
    '--public-asset-dir', publicAssets,
  ];

  try {
    write(path.join(content, 'config', 'notices.yml'), `enabled: true\nitems:\n  - id: notice-1\n    title: 公告\n    date: 2026-08-31\n    image: /obsidian-assets/notices/banner.png\n`);
    write(path.join(content, 'config', 'submenus.yml'), `enabled: true\nitems:\n  - id: menu-1\n    title: B站\n    url: https://space.bilibili.com/1\n`);
    write(path.join(content, 'posts', 'live-post.md'), publishedPost());
    write(path.join(content, 'posts', 'draft-post.md'), `---\ntitle: 草稿\nslug: draft-post\nstatus: draft\nlegacy_paths: []\n---\n\n草稿正文。\n`);
    write(path.join(assets, 'live-post', 'cover.png'), 'cover');
    write(path.join(assets, 'live-post', 'body.png'), 'body');
    write(path.join(assets, 'live-post', 'unused.png'), 'unused');
    write(path.join(assets, 'notices', 'banner.png'), 'notice');
    write(path.join(publicAssets, 'stale', 'old.png'), 'stale');

    run(validator, ['--content-dir', content]);
    const firstOutput = run(synchronizer, syncArgs);
    assert.match(firstOutput, /1 篇文章/);
    assert(fs.existsSync(path.join(exportDir, 'posts', 'live-post.md')));
    assert(!fs.existsSync(path.join(exportDir, 'posts', 'draft-post.md')));
    assert(fs.existsSync(path.join(publicAssets, 'live-post', 'cover.png')));
    assert(fs.existsSync(path.join(publicAssets, 'live-post', 'body.png')));
    assert(!fs.existsSync(path.join(publicAssets, 'live-post', 'unused.png')));
    assert(!fs.existsSync(path.join(publicAssets, 'stale', 'old.png')));

    const exportHash = treeHash(exportDir);
    const assetHash = treeHash(publicAssets);
    const exportMtime = fs.statSync(exportDir).mtimeMs;
    const assetMtime = fs.statSync(publicAssets).mtimeMs;
    const secondOutput = run(synchronizer, syncArgs);
    assert.match(secondOutput, /内容无变化/);
    assert.strictEqual(treeHash(exportDir), exportHash);
    assert.strictEqual(treeHash(publicAssets), assetHash);
    assert.strictEqual(fs.statSync(exportDir).mtimeMs, exportMtime);
    assert.strictEqual(fs.statSync(publicAssets).mtimeMs, assetMtime);

    fs.unlinkSync(path.join(assets, 'live-post', 'body.png'));
    const failed = run(synchronizer, syncArgs, 1);
    assert.match(failed, /公开素材缺失/);
    assert.strictEqual(treeHash(exportDir), exportHash, '失败同步不应修改文章快照');
    assert.strictEqual(treeHash(publicAssets), assetHash, '失败同步不应修改公开素材');
    write(path.join(assets, 'live-post', 'body.png'), 'body');

    write(
      path.join(content, 'posts', 'bad-duplicate.md'),
      `---\ntitle: 重复\nslug: bad-duplicate\nstatus: draft\nlegacy_paths: []\nnotion_id: 11111111-1111-1111-1111-111111111111\n---\n\n正文。\n`
    );
    assert.match(run(validator, ['--content-dir', content], 1), /notion_id 重复/);
    fs.unlinkSync(path.join(content, 'posts', 'bad-duplicate.md'));

    write(
      path.join(content, 'posts', 'live-post.md'),
      publishedPost('published', '正文。\n\n![越界](/obsidian-assets/%2E%2E/secret.png)')
    );
    assert.match(run(synchronizer, syncArgs, 1), /素材路径越界/);
    assert.strictEqual(treeHash(exportDir), exportHash, '越界引用不应污染快照');
    assert.strictEqual(treeHash(publicAssets), assetHash, '越界引用不应污染素材镜像');

    write(path.join(content, 'posts', 'live-post.md'), publishedPost('archived'));
    run(synchronizer, syncArgs);
    assert(!fs.existsSync(path.join(exportDir, 'posts', 'live-post.md')));
    assert(!fs.existsSync(path.join(publicAssets, 'live-post')));
    assert(fs.existsSync(path.join(publicAssets, 'notices', 'banner.png')));

    const importImage = path.join(holder, 'incoming.png');
    const importCover = path.join(holder, 'cover.jpg');
    write(importImage, 'incoming');
    write(importCover, 'cover-jpg');
    const articleJson = path.join(holder, 'article_content.json');
    write(
      articleJson,
      JSON.stringify({
        title: '导入测试',
        digest: '导入摘要',
        date: '2026-08-31',
        cover_wide: importCover,
        specs: { hero: { kind: 'local', src: importImage } },
        content: [
          { type: 'h2', text: '第一节' },
          { type: 'p', text: '正文。' },
          { type: 'img', key: 'hero', caption: '证据图' },
        ],
      }, null, 2)
    );
    run(importer, [
      articleJson,
      '--content-dir', content,
      '--asset-root', assets,
      '--slug', 'imported-post',
      '--status', 'draft',
      '--category', '技术分享',
      '--tag', 'AI',
    ]);
    const imported = fs.readFileSync(path.join(content, 'posts', 'imported-post.md'), 'utf8');
    assert.match(imported, /status: draft/);
    assert.match(imported, /obsidian-assets\/imported-post\/image-hero-/);
    assert.match(imported, /## 第一节/);

    console.log('✅ 内容管道回归测试通过：校验、草稿隔离、素材裁剪、幂等、失败回滚、删除与导入');
  } finally {
    fs.rmSync(holder, { recursive: true, force: true });
  }
}

main();
