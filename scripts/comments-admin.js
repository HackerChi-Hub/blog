#!/usr/bin/env node
'use strict';

/**
 * 留言管理 CLI。
 *
 * 「直接显示 + 事后删」意味着需要一个顺手的巡查入口，但不值得为此做一整套后台
 * 网页——那等于给站点新增一个需要登录、需要自己防护的攻击面。用带口令的接口
 * 加一个本地命令就够了，口令只存在你的 shell 环境里。
 *
 * 隐藏不是删除：被隐藏的留言仍留在库里，用来判断某个 ip_hash 是不是惯犯。
 *
 * 环境变量：
 *   COMMENTS_ADMIN_TOKEN   必填，部署时 `wrangler secret put ADMIN_TOKEN` 设的那个值
 *   COMMENTS_API           可选，默认 https://hyphentech.top/api/comments
 *
 * 用法：
 *   node scripts/comments-admin.js list [数量]   看最近留言（含已隐藏）
 *   node scripts/comments-admin.js hide <id>     隐藏一条
 *   node scripts/comments-admin.js show <id>     重新显示
 */

const API_BASE = process.env.COMMENTS_API || 'https://hyphentech.top/api/comments';
const TOKEN = process.env.COMMENTS_ADMIN_TOKEN || '';

function requireToken() {
  if (!TOKEN) {
    console.error('缺少 COMMENTS_ADMIN_TOKEN 环境变量。');
    console.error('它就是部署时 `wrangler secret put ADMIN_TOKEN` 设的那个值。');
    process.exit(1);
  }
}

function authHeaders(extra = {}) {
  return { authorization: `Bearer ${TOKEN}`, ...extra };
}

function formatTime(milliseconds) {
  const date = new Date(milliseconds);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} `
    + `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

async function list(limit) {
  const response = await fetch(`${API_BASE}/admin/recent?limit=${limit}`, {
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);

  if (!data.comments.length) {
    console.log('还没有任何留言。');
    return;
  }
  for (const item of data.comments) {
    const mark = item.status === 'hidden' ? '[已隐藏]' : '        ';
    console.log(`${mark} #${item.id}  ${formatTime(item.created_at)}  ${item.nickname}  → /${item.slug}/`);
    console.log(`          ${item.content.replace(/\n/g, ' ').slice(0, 120)}`);
    console.log(`          ip_hash=${item.ip_hash}`);
  }
  console.log(`\n共 ${data.count} 条。`);
}

async function setStatus(id, status) {
  const response = await fetch(`${API_BASE}/admin/hide`, {
    method: 'POST',
    headers: authHeaders({ 'content-type': 'application/json' }),
    body: JSON.stringify({ id: Number(id), status }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  console.log(`#${data.comment.id} 已设为 ${data.comment.status}`);
}

async function main() {
  const [command, argument] = process.argv.slice(2);
  requireToken();

  if (command === 'list') return list(Math.min(Number(argument) || 30, 200));
  if (command === 'hide') {
    if (!argument) throw new Error('用法：comments-admin.js hide <id>');
    return setStatus(argument, 'hidden');
  }
  if (command === 'show') {
    if (!argument) throw new Error('用法：comments-admin.js show <id>');
    return setStatus(argument, 'visible');
  }

  console.error('用法：');
  console.error('  node scripts/comments-admin.js list [数量]');
  console.error('  node scripts/comments-admin.js hide <id>');
  console.error('  node scripts/comments-admin.js show <id>');
  process.exit(1);
}

main().catch((error) => {
  console.error(`失败：${error.message}`);
  process.exit(1);
});
