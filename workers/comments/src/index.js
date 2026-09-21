/**
 * hyphentech.top 留言 API（Cloudflare Worker + D1）。
 *
 * 挂在主站同域路由 hyphentech.top/api/comments* 上，所以浏览器不会发跨域预检，
 * 也不引入第二个域名——评论区和正文走完全相同的边缘节点。
 *
 * 路由：
 *   GET    /api/comments?slug=<slug>     列出该文章的可见留言
 *   POST   /api/comments                 发表留言（需 Turnstile token）
 *   GET    /api/comments/admin/recent    最近留言（含已隐藏），需 ADMIN_TOKEN
 *   POST   /api/comments/admin/hide      隐藏一条留言，需 ADMIN_TOKEN
 *
 * 免费版约束（已核对官方文档）：CPU 10ms/请求，每次调用最多 50 次 D1 查询。
 * 所以这里没有任何重计算，单次请求最多 2 条 SQL。
 */

const MAX_NICKNAME = 24;
const MAX_CONTENT = 1000;
const LIST_LIMIT = 200;
const RATE_WINDOW_SECONDS = 3600;

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,80}$/;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // 留言是实时内容，不能被边缘或浏览器缓存住，否则刚发的看不见。
      'cache-control': 'no-store',
    },
  });
}

/** 恒定时间比较，避免用逐字符短路比较泄露 token 前缀。 */
function timingSafeEqual(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string') return false;
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return diff === 0;
}

/**
 * 把来访 IP 变成加盐哈希。存原始 IP 没有必要：限流只需要认出「是同一个人」。
 * 盐来自 secret，不进代码也不进数据库。
 */
async function hashIp(ip, salt) {
  const bytes = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].slice(0, 16)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * 决定这次提交是否被限流拦下。
 *
 * 为什么单独拎出来让人填：中国大量读者共享运营商出口 IP（校园网、公司、移动
 * 网络的 CGNAT），一个 ip_hash 背后可能是几十个互不相干的人。按 IP 限流在这里
 * 比在英文站危险得多——阈值定紧了，热门文章下正常读者会被误伤，而且他看到的
 * 是「发送失败」，不会来告诉你。
 *
 * 入参：
 *   recentCount       最近 RATE_WINDOW_SECONDS 秒内这个 ip_hash 发了几条
 *   secondsSinceLast  距离上一条多少秒（从没发过是 Infinity）
 *
 * 返回 null 放行，或返回一个字符串作为拒绝理由（会原样回给读者，写得客气些）。
 *
 * 现行阈值：连发间隔 10 秒（用户定），外加一小时 60 条的兜底。
 *
 * 10 秒把自动化刷屏的速率压到 360 条/小时以下，同时不妨碍真人发现错别字后
 * 立刻重发。第二道 60 条/小时管的是「慢速但持续」的刷屏——单看间隔它完全合规。
 * 之所以敢设第二道，是因为同一个出口 IP 一小时内出现 60 条留言，在个人博客的
 * 量级上已经不像是多个真实读者了；真撞上说明这篇文章爆了，那时手工放宽就是。
 *
 * 两条文案都写明了「这个网络」而不是「你」：共享出口 IP 下被拦的往往是无辜的人，
 * 让他知道不是自己做错了什么，也知道等一下还能发。
 */
function rateLimitReason({ recentCount, secondsSinceLast }) {
  if (secondsSinceLast < 10) {
    return '发得有点快，等十秒再试一次';
  }
  if (recentCount >= 60) {
    return '这个网络下最近留言比较多，过会儿再来吧';
  }
  return null;
}

async function verifyTurnstile(token, secret, ip) {
  if (!token) return false;
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!response.ok) return false;
  const result = await response.json();
  return result.success === true;
}

async function handleList(request, env) {
  const slug = new URL(request.url).searchParams.get('slug') || '';
  if (!SLUG_PATTERN.test(slug)) return json({ error: '文章标识不合法' }, 400);

  const { results } = await env.DB.prepare(
    `SELECT id, nickname, content, parent_id, created_at
       FROM comments
      WHERE slug = ?1 AND status = 'visible'
      ORDER BY created_at ASC
      LIMIT ?2`
  ).bind(slug, LIST_LIMIT).all();

  return json({ slug, count: results.length, comments: results });
}

async function handleCreate(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: '请求格式不正确' }, 400);
  }

  const slug = String(payload.slug || '');
  const nickname = String(payload.nickname || '').trim();
  const content = String(payload.content || '').trim();
  const parentId = payload.parentId ? Number(payload.parentId) : null;

  if (!SLUG_PATTERN.test(slug)) return json({ error: '文章标识不合法' }, 400);
  if (!nickname) return json({ error: '请填个昵称' }, 400);
  if (nickname.length > MAX_NICKNAME) return json({ error: `昵称最多 ${MAX_NICKNAME} 个字` }, 400);
  if (!content) return json({ error: '留言内容是空的' }, 400);
  if (content.length > MAX_CONTENT) return json({ error: `留言最多 ${MAX_CONTENT} 个字` }, 400);
  if (parentId !== null && !Number.isInteger(parentId)) return json({ error: '回复目标不合法' }, 400);

  const ip = request.headers.get('cf-connecting-ip') || '';
  const passed = await verifyTurnstile(payload.turnstileToken, env.TURNSTILE_SECRET, ip);
  if (!passed) return json({ error: '人机校验没通过，刷新页面再试一次' }, 403);

  const ipHash = await hashIp(ip, env.IP_SALT);
  const now = Date.now();
  const windowStart = now - RATE_WINDOW_SECONDS * 1000;

  const stats = await env.DB.prepare(
    `SELECT COUNT(*) AS recent_count, MAX(created_at) AS last_at
       FROM comments
      WHERE ip_hash = ?1 AND created_at > ?2`
  ).bind(ipHash, windowStart).first();

  const reason = rateLimitReason({
    recentCount: stats?.recent_count ?? 0,
    secondsSinceLast: stats?.last_at ? (now - stats.last_at) / 1000 : Infinity,
    ipHash,
  });
  if (reason) return json({ error: reason }, 429);

  const inserted = await env.DB.prepare(
    `INSERT INTO comments (slug, nickname, content, parent_id, created_at, ip_hash, ua)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
     RETURNING id, nickname, content, parent_id, created_at`
  ).bind(
    slug,
    nickname,
    content,
    parentId,
    now,
    ipHash,
    (request.headers.get('user-agent') || '').slice(0, 300)
  ).first();

  return json({ comment: inserted }, 201);
}

function isAdmin(request, env) {
  const header = request.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  return Boolean(env.ADMIN_TOKEN) && timingSafeEqual(token, env.ADMIN_TOKEN);
}

async function handleAdminRecent(request, env) {
  const limit = Math.min(Number(new URL(request.url).searchParams.get('limit')) || 50, 200);
  const { results } = await env.DB.prepare(
    `SELECT id, slug, nickname, content, status, created_at, ip_hash
       FROM comments ORDER BY created_at DESC LIMIT ?1`
  ).bind(limit).all();
  return json({ count: results.length, comments: results });
}

/**
 * 汇总统计。放在服务端用 SQL 算，而不是把全部留言拉回本地再数：
 * 留言涨到几千条以后，客户端统计要么分页拉一堆数据，要么悄悄只统计了前 200 条
 * ——后者尤其坏，因为它看起来一直在正常工作。
 */
async function handleAdminStats(env) {
  const totals = await env.DB.prepare(
    `SELECT
       COUNT(*)                                             AS total,
       SUM(CASE WHEN status = 'visible' THEN 1 ELSE 0 END)  AS visible,
       SUM(CASE WHEN status = 'hidden'  THEN 1 ELSE 0 END)  AS hidden,
       COUNT(DISTINCT slug)                                 AS slugs,
       COUNT(DISTINCT ip_hash)                              AS visitors,
       MAX(created_at)                                      AS last_at
     FROM comments`
  ).first();

  const now = Date.now();
  const recent = await env.DB.prepare(
    `SELECT
       SUM(CASE WHEN created_at > ?1 THEN 1 ELSE 0 END) AS day,
       SUM(CASE WHEN created_at > ?2 THEN 1 ELSE 0 END) AS week
     FROM comments`
  ).bind(now - 86400000, now - 604800000).first();

  const { results: byPost } = await env.DB.prepare(
    `SELECT slug,
            COUNT(*) AS count,
            MAX(created_at) AS last_at
       FROM comments
      WHERE status = 'visible'
      GROUP BY slug
      ORDER BY count DESC, last_at DESC
      LIMIT 20`
  ).all();

  return json({
    total: totals?.total ?? 0,
    visible: totals?.visible ?? 0,
    hidden: totals?.hidden ?? 0,
    slugs: totals?.slugs ?? 0,
    visitors: totals?.visitors ?? 0,
    last_at: totals?.last_at ?? null,
    last_24h: recent?.day ?? 0,
    last_7d: recent?.week ?? 0,
    by_post: byPost,
  });
}

async function handleAdminHide(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: '请求格式不正确' }, 400);
  }
  const id = Number(payload.id);
  const status = payload.status === 'visible' ? 'visible' : 'hidden';
  if (!Number.isInteger(id)) return json({ error: 'id 不合法' }, 400);

  const updated = await env.DB.prepare(
    `UPDATE comments SET status = ?2 WHERE id = ?1 RETURNING id, status`
  ).bind(id, status).first();

  if (!updated) return json({ error: '没有这条留言' }, 404);
  return json({ comment: updated });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const method = request.method.toUpperCase();

    if (pathname.startsWith('/api/comments/admin/')) {
      if (!isAdmin(request, env)) return json({ error: '未授权' }, 401);
      if (method === 'GET' && pathname === '/api/comments/admin/recent') {
        return handleAdminRecent(request, env);
      }
      if (method === 'GET' && pathname === '/api/comments/admin/stats') {
        return handleAdminStats(env);
      }
      if (method === 'POST' && pathname === '/api/comments/admin/hide') {
        return handleAdminHide(request, env);
      }
      return json({ error: '不支持的管理操作' }, 404);
    }

    if (pathname === '/api/comments') {
      if (method === 'GET') return handleList(request, env);
      if (method === 'POST') return handleCreate(request, env);
      return json({ error: '不支持的方法' }, 405);
    }

    return json({ error: '没有这个接口' }, 404);
  },
};
