#!/usr/bin/env node
'use strict';

/**
 * 留言管理 CLI。
 *
 * 「直接显示 + 事后删」意味着需要一个顺手的巡查入口，但不值得为此做一整套后台
 * 网页——那等于给站点新增一个需要登录、需要自己防护的攻击面。用带口令的接口
 * 加一个本地命令就够了，口令只存在本机的 .env.local 里。
 *
 * 隐藏不是删除：被隐藏的留言仍留在库里，用来判断某个 ip_hash 是不是惯犯。
 *
 * 口令从 blog/.env.local 自动读取（也可用环境变量 COMMENTS_ADMIN_TOKEN 覆盖），
 * 不需要每次先 source。这不是图省事：要求人手动 export 密钥，实际结果往往是
 * 有人图方便把它写进 shell 历史或某个会被提交的文件里。
 *
 * 用法见 usage()。
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const ENV_FILE = path.join(projectRoot, '.env.local');

// ---------- 配置读取 ----------

function readEnvFile() {
  const values = {};
  if (!fs.existsSync(ENV_FILE)) return values;
  for (const line of fs.readFileSync(ENV_FILE, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    values[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
  }
  return values;
}

const fileEnv = readEnvFile();
const TOKEN = process.env.COMMENTS_ADMIN_TOKEN || fileEnv.COMMENTS_ADMIN_TOKEN || '';
const API_BASE = process.env.COMMENTS_API || fileEnv.COMMENTS_API
  || 'https://hyphentech.top/api/comments';
const SITE_BASE = 'https://hyphentech.top';

// ---------- 输出 ----------

// 只在真正的终端里上色：输出被管道接走或重定向到文件时，ANSI 转义符会变成乱码。
const useColor = process.stdout.isTTY && process.env.NO_COLOR === undefined;
const paint = (code, text) => (useColor ? `[${code}m${text}[0m` : text);
const dim = (t) => paint('2', t);
const bold = (t) => paint('1', t);
const green = (t) => paint('32', t);
const yellow = (t) => paint('33', t);
const red = (t) => paint('31', t);
const cyan = (t) => paint('36', t);

function formatTime(milliseconds) {
  if (!milliseconds) return '—';
  const date = new Date(milliseconds);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} `
    + `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatAgo(milliseconds) {
  if (!milliseconds) return '';
  const diff = Date.now() - milliseconds;
  if (diff < 60_000) return '刚刚';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`;
  return `${Math.floor(diff / 86_400_000)} 天前`;
}

/** 中文字符占两个终端列宽，按字符数对齐会歪，所以按显示宽度算。 */
function displayWidth(text) {
  let width = 0;
  for (const char of text) {
    width += /[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹯＀-｠￠-￦]/
      .test(char) ? 2 : 1;
  }
  return width;
}

function padEndWide(text, width) {
  const padding = width - displayWidth(text);
  return padding > 0 ? text + ' '.repeat(padding) : text;
}

// ---------- 请求 ----------

function requireToken() {
  if (TOKEN) return;
  console.error(red('缺少管理口令。'));
  console.error(`在 ${ENV_FILE} 里加一行 COMMENTS_ADMIN_TOKEN=<值>，`);
  console.error('或者 export COMMENTS_ADMIN_TOKEN=<值>。');
  console.error(dim('它就是部署时 `wrangler secret put ADMIN_TOKEN` 设的那个值。'));
  process.exit(1);
}

async function api(pathSuffix, options = {}) {
  const response = await fetch(`${API_BASE}${pathSuffix}`, {
    ...options,
    headers: {
      authorization: `Bearer ${TOKEN}`,
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }
  return data;
}

// ---------- 命令 ----------

async function cmdStats({ json }) {
  const data = await api('/admin/stats');
  if (json) return console.log(JSON.stringify(data, null, 2));

  console.log(bold('\n留言总览'));
  console.log(`  总计 ${bold(String(data.total))} 条` +
    `  ·  显示中 ${green(String(data.visible))}` +
    `  ·  已隐藏 ${data.hidden > 0 ? yellow(String(data.hidden)) : '0'}`);
  console.log(`  覆盖 ${data.slugs} 篇文章  ·  ${data.visitors} 个来源` +
    dim('（按加盐 IP 哈希去重，不是真实人数）'));
  console.log(`  最近 24 小时 ${data.last_24h} 条  ·  最近 7 天 ${data.last_7d} 条`);
  console.log(`  最后一条：${formatTime(data.last_at)} ${dim(formatAgo(data.last_at))}`);

  if (data.by_post.length) {
    console.log(bold('\n按文章'));
    const width = Math.max(...data.by_post.map((p) => displayWidth(p.slug)));
    for (const post of data.by_post) {
      console.log(`  ${padEndWide(post.slug, width)}  ${String(post.count).padStart(3)} 条` +
        `  ${dim(formatAgo(post.last_at))}`);
    }
  }
  console.log('');
}

async function cmdList({ limit, json, slug }) {
  const data = await api(`/admin/recent?limit=${limit}`);
  let comments = data.comments;
  if (slug) comments = comments.filter((c) => c.slug === slug);

  if (json) return console.log(JSON.stringify(comments, null, 2));

  if (!comments.length) {
    console.log(slug ? `《${slug}》下还没有留言。` : '还没有任何留言。');
    return;
  }

  console.log('');
  for (const item of comments) {
    const tag = item.status === 'hidden' ? yellow('[已隐藏]') : green('[显示中]');
    console.log(`${tag} ${bold('#' + item.id)}  ${bold(item.nickname)}  ` +
      `${dim(formatTime(item.created_at))} ${dim(formatAgo(item.created_at))}`);
    console.log(`        ${cyan(SITE_BASE + '/' + item.slug + '/')}`);
    for (const line of item.content.split('\n')) {
      console.log(`        ${line}`);
    }
    console.log(dim(`        ip_hash=${item.ip_hash}`));
    console.log('');
  }
  console.log(dim(`共 ${comments.length} 条` + (slug ? `（已按 ${slug} 过滤）` : '')));
  console.log(dim('隐藏某条：blog-comments hide <id>   恢复：blog-comments show <id>\n'));
}

async function cmdSetStatus(id, status) {
  if (!/^\d+$/.test(String(id))) throw new Error('id 必须是数字');
  const data = await api('/admin/hide', {
    method: 'POST',
    body: JSON.stringify({ id: Number(id), status }),
  });
  const word = data.comment.status === 'hidden' ? yellow('已隐藏') : green('已恢复显示');
  console.log(`#${data.comment.id} ${word}`);
}

/**
 * 盯着有没有新留言。轮询而不是推送：留言量很小，为它架一条推送通道不值得。
 * 只在发现新 id 时通知，避免每轮都刷屏。
 */
async function cmdWatch(intervalSeconds) {
  const interval = Math.max(intervalSeconds || 60, 15);
  console.log(`每 ${interval} 秒查一次新留言，Ctrl-C 退出。\n`);

  let lastSeenId = 0;
  let first = true;

  for (;;) {
    try {
      const data = await api('/admin/recent?limit=20');
      const fresh = data.comments.filter((c) => c.id > lastSeenId);
      if (data.comments.length) {
        lastSeenId = Math.max(lastSeenId, ...data.comments.map((c) => c.id));
      }
      // 第一轮只记录基线，否则一启动就把历史留言全当成新的报一遍。
      if (!first && fresh.length) {
        for (const item of fresh.reverse()) {
          console.log(`${green('● 新留言')} ${bold('#' + item.id)} ${bold(item.nickname)} ` +
            dim(`→ /${item.slug}/`));
          console.log(`  ${item.content.replace(/\n/g, ' ').slice(0, 120)}\n`);
        }
        notify(fresh.length === 1
          ? `${fresh[0].nickname}：${fresh[0].content.replace(/\n/g, ' ').slice(0, 60)}`
          : `收到 ${fresh.length} 条新留言`);
      }
      first = false;
    } catch (error) {
      console.error(dim(`  查询失败（${error.message}），下一轮继续`));
    }
    await new Promise((resolve) => setTimeout(resolve, interval * 1000));
  }
}

function notify(message) {
  if (process.platform !== 'darwin') return;
  try {
    // 标题和内容都走参数化的 AppleScript 字符串，留言内容里的引号不会截断脚本。
    const escape = (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    require('child_process').execFileSync('osascript', [
      '-e',
      `display notification "${escape(message)}" with title "黑粉科技 Blog 新留言"`,
    ], { stdio: 'ignore' });
  } catch {
    // 通知失败不影响主流程，终端里已经打印过了。
  }
}

function usage() {
  console.log(`
${bold('blog-comments')} — 黑粉科技 Blog 留言管理

  ${bold('blog-comments')}                 总览 + 最近 10 条
  ${bold('blog-comments list')} [数量]      列出最近留言（默认 30，最多 200）
  ${bold('blog-comments list --slug')} <slug>  只看某篇文章
  ${bold('blog-comments stats')}            只看统计
  ${bold('blog-comments hide')} <id>        隐藏一条（不是删除，可恢复）
  ${bold('blog-comments show')} <id>        恢复显示
  ${bold('blog-comments watch')} [秒]       盯新留言，有就 macOS 通知（默认 60 秒）

  加 ${bold('--json')} 输出机器可读格式（list / stats 支持）

口令从 blog/.env.local 的 COMMENTS_ADMIN_TOKEN 自动读取。
`);
}

// ---------- 入口 ----------

async function main() {
  const argv = process.argv.slice(2);
  const json = argv.includes('--json');
  const args = argv.filter((a) => a !== '--json');
  const [command, argument] = args;

  if (command === 'help' || command === '--help' || command === '-h') return usage();

  requireToken();

  switch (command) {
    case undefined:
      await cmdStats({ json: false });
      return cmdList({ limit: 10, json: false });
    case 'stats':
      return cmdStats({ json });
    case 'list': {
      const slugFlag = args.indexOf('--slug');
      const slug = slugFlag >= 0 ? args[slugFlag + 1] : '';
      const limit = Math.min(Number(argument) || 30, 200);
      return cmdList({ limit: slug ? 200 : limit, json, slug });
    }
    case 'hide':
      if (!argument) throw new Error('用法：blog-comments hide <id>');
      return cmdSetStatus(argument, 'hidden');
    case 'show':
      if (!argument) throw new Error('用法：blog-comments show <id>');
      return cmdSetStatus(argument, 'visible');
    case 'watch':
      return cmdWatch(Number(argument));
    default:
      console.error(red(`不认识的命令：${command}`));
      usage();
      process.exit(1);
  }
}

main().catch((error) => {
  console.error(red(`失败：${error.message}`));
  process.exit(1);
});
