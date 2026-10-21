const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { auditHtmlLinks } = require('../lib/link-presentation.cjs');
const root = path.resolve(__dirname, '..');
for (const file of ['llm-guide/index.html', 'ai-hardware-survey/index.html', 'mlx-model-test.html', 'agent-comparison.html', 'shortcuts/index.html', 'wifi/index.html']) {
  assert.deepEqual(auditHtmlLinks(fs.readFileSync(path.join(root, 'public', file), 'utf8')).failures, [], file);
}
const models = fs.readFileSync(path.join(root, 'public/mlx-model-test.html'), 'utf8');
const repos = [...models.matchAll(/hf download ([\w.-]+\/[\w.-]+)/g)].map(match => match[1]);
assert.equal(repos.length, 4);
for (const repo of repos) assert(models.includes(`href="https://huggingface.co/${repo}"`), `${repo} 缺少可点击的模型仓库入口`);
assert.equal((models.match(/class='download-cmd'/g) || []).length, 4, '下载命令仍然完整保留');
assert.equal((models.match(/匿名下载复核/g) || []).length, 8, '四个仓库的可见文字和链接提示均记录了当次匿名下载复核状态');
assert.equal((models.match(/HTTP 206/g) || []).length, 4, '四个仓库均记录了当次匿名拉取的实际结果');
assert.equal(repos.length, new Set(repos).size, '模型仓库不得重复');
const guide = fs.readFileSync(path.join(root, 'public/llm-guide/index.html'), 'utf8');
assert(guide.includes('curl -fsSL https://ollama.com/install.sh | sh'), '安装命令不可被链接改写');
assert(guide.includes('href="https://ollama.com/install.sh"'));
for (const file of ['llm-guide/index.html', 'ai-hardware-survey/index.html', 'mlx-model-test.html', 'agent-comparison.html', 'shortcuts/index.html', 'wifi/index.html']) {
  const html = fs.readFileSync(path.join(root, 'public', file), 'utf8');
  // 用 .fade-in 做滚动显现的页面，必须同时有负责点亮它的脚本；否则正文会停在 opacity:0
  if (/\.fade-in\s*\{/.test(html)) {
    assert(html.includes('IntersectionObserver'), `${file} 用了 .fade-in 滚动显现，但缺少负责点亮的脚本`);
    assert(html.includes('<noscript>'), `${file} 缺无脚本兜底，脚本失败时正文会不可见`);
  }
}
const css = fs.readFileSync(path.join(root, 'public/shared/resource-links.css'), 'utf8');
assert(css.includes('text-decoration-line: underline'));
assert(css.includes(':focus-visible'));
assert(css.includes('[data-link-kind="download"]'));
console.log('✅ 独立页面回归通过：模型仓库入口与访问状态、安装说明、命令保护与可见链接样式');
