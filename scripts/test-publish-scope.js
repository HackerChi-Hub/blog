#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// 直接执行发布器的安全检查，不调用构建、远端或正式推送。
const publisher = fs.readFileSync(path.join(__dirname, 'blog-push'), 'utf8');
const start = publisher.indexOf('unexpected=""');
const end = publisher.indexOf('echo "💾 3/5', start);
assert(start >= 0 && end > start, '发布器安全检查必须存在');
const guard = publisher.slice(start, end);

function check(records) {
  const input = records.join('\0') + (records.length ? '\0' : '');
  const script = `set -euo pipefail
fail() { printf '%s\\n' "$1"; exit 1; }
git() { printf '%s' "$PUBLISH_SCOPE_TEST_INPUT" | base64 --decode; }
${guard}`;
  const result = spawnSync('bash', ['-c', script], {
    encoding: 'utf8',
    env: { ...process.env, PUBLISH_SCOPE_TEST_INPUT: Buffer.from(input).toString('base64') },
  });
  if (result.error) throw result.error;
  return result;
}

for (const records of [
  [],
  [' M content-export/posts/article.md'],
  ['?? public/obsidian-assets/article/动画请求优化.mp4'],
  ['?? public/obsidian-assets/article/完整 样片 "新版".mp4'],
  ['?? public/obsidian-assets/article/一行\n另一行.jpg'],
  ['R  public/obsidian-assets/article/新文件.mp4', 'public/obsidian-assets/article/旧文件.mp4'],
]) {
  const result = check(records);
  assert.strictEqual(result.status, 0, result.stdout + result.stderr);
}

for (const records of [
  [' M scripts/blog-push'],
  ['?? public/other/动画.mp4'],
  ['?? public/obsidian-assets-other/article/cover.jpg'],
  ['R  public/obsidian-assets/article/new.mp4', 'scripts/old.js'],
  ['R  scripts/new.js', 'public/obsidian-assets/article/old.mp4'],
  ['R  public/obsidian-assets/article/new.mp4'],
]) {
  const result = check(records);
  assert.notStrictEqual(result.status, 0, '目录外改动及残缺记录必须拒绝');
}

console.log('✅ 发布目录检查通过：中文、空格、引号、换行和重命名均准确识别，目录外改动仍拒绝');
