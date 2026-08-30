#!/usr/bin/env node

const path = require('path');
const { spawnSync } = require('child_process');

console.warn('ℹ️ deploy.js 已并入受校验的 Obsidian 发布链路。');
const result = spawnSync(
  'bash',
  [path.join(__dirname, 'blog-push.sh'), ...process.argv.slice(2)],
  { stdio: 'inherit' }
);
process.exit(result.status ?? 1);
