#!/usr/bin/env node

const { spawnSync } = require('child_process');
const path = require('path');

// 保留旧命令名，但把它导向当前 Obsidian 全量校验。
const validator = path.join(__dirname, 'scripts', 'validate-content.js');
const result = spawnSync(process.execPath, [validator], {
  cwd: __dirname,
  stdio: 'inherit',
});
process.exit(result.status ?? 1);
