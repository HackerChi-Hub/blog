#!/usr/bin/env node
'use strict';
const { execFileSync, spawnSync } = require('child_process');
const { randomUUID } = require('crypto');

const REPO = 'HackerChi-Hub/blog';
const HELP = `用法：npm run products:publish
从 GitHub main 的已公开快照重新构建官网软件信息，并等待部署和线上核验。
不提交代码，不读取本地 Obsidian，不发布本地草稿，不升级电脑上的软件。
需要：已安装并登录 GitHub CLI（gh）。文章发布仍用 blog-push。`;

function runGh(args) {
  return execFileSync('gh', args, { encoding: 'utf8', timeout: 30000, env: { ...process.env, GH_PROMPT_DISABLED: '1' }, stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

async function publishProductUpdates({ gh = runGh, watch = (id) => spawnSync('gh', ['run', 'watch', String(id), '--repo', REPO, '--exit-status'], { stdio: 'inherit', timeout: 20 * 60 * 1000 }).status,
  nonce = randomUUID(), sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)), pollLimit = 40, log = console.log } = {}) {
  const state = gh(['api', `repos/${REPO}/actions/workflows/deploy.yml`, '--jq', '.state']);
  if (state !== 'active') throw new Error('官网部署工作流未启用；没有触发发布');
  log('仅使用 GitHub main 已公开内容；本地文章、草稿和未提交代码不参与此次刷新。');
  gh(['workflow', 'run', 'deploy.yml', '--repo', REPO, '--ref', 'main', '--field', `product_update_id=${nonce}`]);
  const title = `软件信息刷新 · ${nonce}`;
  let run;
  for (let attempt = 0; attempt < pollLimit; attempt += 1) {
    const runs = JSON.parse(gh(['run', 'list', '--repo', REPO, '--workflow', 'deploy.yml', '--event', 'workflow_dispatch', '--branch', 'main', '--limit', '30', '--json', 'databaseId,displayTitle,url']));
    run = runs.find((item) => item.displayTitle === title);
    if (run) break;
    await sleep(3000);
  }
  if (!run) throw new Error(`已提交刷新请求但无法确认对应运行；请求标识 ${nonce}。请检查 GitHub Actions，不要盲目重发`);
  log(`正在等待官网刷新与核验：${run.url}`);
  // watch 的网络状态不是部署结论；结束后回读权威 conclusion，避免误报或重复部署。
  watch(run.databaseId);
  const result = JSON.parse(gh(['run', 'view', String(run.databaseId), '--repo', REPO, '--json', 'status,conclusion,url']));
  if (result.status !== 'completed' || result.conclusion !== 'success') {
    throw new Error(`官网刷新未确认成功（${result.status} / ${result.conclusion || '尚无结论'}）：${result.url}。不会再次触发部署`);
  }
  log(`✅ 官网软件信息已刷新，部署端页面、素材与发行指纹回读通过：${result.url}`);
  return result;
}

async function main(args = process.argv.slice(2)) {
  if (args.length === 1 && args[0] === '--help') { console.log(HELP); return; }
  if (args.length) throw new Error('只支持 --help；此命令固定使用官网 main，不接受其他仓库或草稿目录');
  await publishProductUpdates();
}

if (require.main === module) main().catch((error) => { console.error(`❌ 软件信息刷新失败：${error.message}`); process.exitCode = 1; });
module.exports = { publishProductUpdates };
