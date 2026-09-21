/**
 * 留言 API 本地冒烟测试。
 *
 * 不需要 wrangler、不碰线上数据：用 node:sqlite 内存库套一层 D1 形状的适配器
 * （prepare/bind/all/first），再把 Turnstile 的 siteverify 请求拦下来。这样
 * 校验规则、SQL 绑定、管理接口和鉴权都能在本机验证。
 *
 * 跑：node workers/comments/test.mjs
 */

import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const worker = (await import(join(here, 'src', 'index.js'))).default;

// ---------- D1 形状的适配器 ----------

function makeDB() {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(join(here, 'schema.sql'), 'utf8'));
  return {
    prepare(sql) {
      const statement = db.prepare(sql);
      let bound = [];
      const api = {
        bind(...args) {
          // D1 把 null 原样传，node:sqlite 要求 null 而不是 undefined。
          bound = args.map((value) => (value === undefined ? null : value));
          return api;
        },
        all() {
          return { results: statement.all(...bound) };
        },
        first() {
          return statement.get(...bound) ?? null;
        },
      };
      return api;
    },
  };
}

// ---------- 拦住 Turnstile ----------

let turnstileVerdict = true;
globalThis.fetch = async (url) => {
  if (String(url).includes('challenges.cloudflare.com')) {
    return new Response(JSON.stringify({ success: turnstileVerdict }), {
      headers: { 'content-type': 'application/json' },
    });
  }
  throw new Error(`测试里不该发出的请求：${url}`);
};

// ---------- 用例框架 ----------

let passed = 0;
let failed = 0;
const pending = [];

function check(name, condition, detail = '') {
  if (condition) {
    passed += 1;
    console.log(`  ✓ ${name}`);
  } else {
    failed += 1;
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

const env = {
  DB: makeDB(),
  TURNSTILE_SECRET: 'test-secret',
  IP_SALT: 'test-salt',
  ADMIN_TOKEN: 'admin-token-for-test',
};

function request(path, { method = 'GET', body, headers = {} } = {}) {
  return new Request(`https://hyphentech.top${path}`, {
    method,
    headers: {
      'cf-connecting-ip': '203.0.113.7',
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

const call = (path, options) => worker.fetch(request(path, options), env);

// ---------- 不依赖限流策略的用例 ----------

console.log('\n输入校验与鉴权：');

{
  const response = await call('/api/comments?slug=free-api-radar');
  const data = await response.json();
  check('空文章返回空列表而不是报错', response.status === 200 && data.comments.length === 0);
}

{
  const response = await call('/api/comments?slug=../../etc/passwd');
  check('非法 slug 被拒', response.status === 400);
}

for (const [name, payload] of [
  ['空昵称被拒', { slug: 'a', nickname: '  ', content: 'x' }],
  ['空内容被拒', { slug: 'a', nickname: 'n', content: '   ' }],
  ['超长昵称被拒', { slug: 'a', nickname: 'x'.repeat(25), content: 'x' }],
  ['超长内容被拒', { slug: 'a', nickname: 'n', content: 'x'.repeat(1001) }],
]) {
  const response = await call('/api/comments', { method: 'POST', body: payload });
  check(name, response.status === 400);
}

{
  turnstileVerdict = false;
  const response = await call('/api/comments', {
    method: 'POST',
    body: { slug: 'a', nickname: 'n', content: 'c', turnstileToken: 'bad' },
  });
  check('Turnstile 不通过时拒绝写入', response.status === 403);
  turnstileVerdict = true;
}

{
  const response = await call('/api/comments/admin/recent');
  check('管理接口无 token 返回 401', response.status === 401);
}

{
  const response = await call('/api/comments/admin/recent', {
    headers: { authorization: 'Bearer wrong-token-same-length!!' },
  });
  check('管理接口错 token 返回 401', response.status === 401);
}

{
  const response = await call('/api/comments', { method: 'DELETE' });
  check('不支持的方法返回 405', response.status === 405);
}

// ---------- 依赖限流策略的用例 ----------

console.log('\n完整发表流程：');

async function post(body) {
  return call('/api/comments', {
    method: 'POST',
    body: { turnstileToken: 'good', ...body },
  });
}

let strategyReady = true;
try {
  const response = await post({ slug: 'free-api-radar', nickname: '小明', content: '第一条留言' });
  const data = await response.json();
  check('发表成功返回 201', response.status === 201, `实际 ${response.status}`);
  check('返回体带上了新留言', data.comment?.nickname === '小明');
} catch (error) {
  if (String(error.message).includes('rateLimitReason 尚未实现')) {
    strategyReady = false;
    pending.push('rateLimitReason 还没填，发表流程的用例跳过了');
  } else {
    throw error;
  }
}

if (strategyReady) {
  {
    const response = await call('/api/comments?slug=free-api-radar');
    const data = await response.json();
    check('列表能读到刚发的留言', data.comments.length === 1 && data.comments[0].content === '第一条留言');
  }

  const rootId = (await (await call('/api/comments?slug=free-api-radar')).json()).comments[0].id;

  {
    const response = await post({
      slug: 'free-api-radar', nickname: '楼主', content: '回你一句', parentId: rootId,
    });
    check('回复能挂到父留言上', response.status === 201);
  }

  {
    const response = await call('/api/comments?slug=other-post');
    const data = await response.json();
    check('别的文章看不到这篇的留言', data.comments.length === 0);
  }

  {
    const response = await call('/api/comments/admin/hide', {
      method: 'POST',
      body: { id: rootId },
      headers: { authorization: `Bearer ${env.ADMIN_TOKEN}` },
    });
    check('管理接口能隐藏留言', response.status === 200);

    const listed = await (await call('/api/comments?slug=free-api-radar')).json();
    check('隐藏后公开列表不再返回它', !listed.comments.some((item) => item.id === rootId));

    const admin = await (await call('/api/comments/admin/recent', {
      headers: { authorization: `Bearer ${env.ADMIN_TOKEN}` },
    })).json();
    check('但管理列表仍能看到（隐藏不是删除）', admin.comments.some((item) => item.id === rootId));
  }
}

// ---------- 结果 ----------

console.log(`\n通过 ${passed} · 失败 ${failed}`);
for (const note of pending) console.log(`⚠ ${note}`);
process.exit(failed > 0 ? 1 : 0);
