# 留言 API（Cloudflare Worker + D1）

挂在主站同域路由 `hyphentech.top/api/comments*` 上。主站仍是 GitHub Pages 静态导出，
这条 route 只截走 `/api/comments*`，正文链路和发布流程完全不受影响。

## 为什么是这套

- **同域**：不引入第二个域名，浏览器不发跨域预检，评论请求和正文走同一个边缘节点。
  第三方评论服务一旦域名被污染，会出现「正文好好的、评论区永远转圈」。
- **免费**：Workers 免费版 100,000 请求/天、CPU 10ms/请求；D1 免费版单库 500 MB、
  账户总计 5 GB、每次调用最多 50 次查询。博客量级大约用掉 1%。
- **不存原始 IP**：只存加盐 SHA-256 前缀，够用来限流和认惯犯，但无法反查到人。

## 首次部署

前四步需要你本人操作（要登录 Cloudflare 账号）。

### 1. 装 wrangler 并登录

```bash
npm install -g wrangler
wrangler login
```

### 2. 建数据库并写入表结构

```bash
cd workers/comments
wrangler d1 create hyphentech-comments
```

把输出里的 `database_id` 填进 `wrangler.toml` 替换 `PLACEHOLDER_RUN_WRANGLER_D1_CREATE`，然后：

```bash
wrangler d1 execute hyphentech-comments --remote --file=./schema.sql
```

### 3. 申请 Turnstile 密钥

在 Cloudflare Dashboard → Turnstile → 添加站点，域名填 `hyphentech.top`，
模式选 **Managed**。会拿到一对密钥：

- **Site Key**（公开）→ 写进博客的 `.env.local`
- **Secret Key**（保密）→ 下一步设为 Worker secret

### 4. 设置三个 secret

```bash
wrangler secret put TURNSTILE_SECRET   # 上一步的 Secret Key
wrangler secret put IP_SALT            # openssl rand -hex 32 生成，设定后不要再改
wrangler secret put ADMIN_TOKEN        # openssl rand -hex 32 生成，管理 CLI 要用
```

`IP_SALT` 改了会让所有历史 `ip_hash` 对不上，等于限流记录清零，所以定下就别动。

### 5. 部署

```bash
wrangler deploy
```

### 6. 配置博客前端

在 `blog/.env.local` 里加上（这个文件已被 gitignore）：

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<第 3 步的 Site Key>
```

`NEXT_PUBLIC_COMMENTS_API` 不用设，默认就是同域的 `/api/comments`。

然后正常 `blog-push` 发布一次即可。

## 验证部署

```bash
# 列表应返回空数组而不是 404
curl -s "https://hyphentech.top/api/comments?slug=free-api-radar" | head

# 没有 Turnstile token 应被拒（403），证明校验真的在跑
curl -s -X POST https://hyphentech.top/api/comments \
  -H 'content-type: application/json' \
  -d '{"slug":"free-api-radar","nickname":"test","content":"test"}'
```

第二条必须返回 403。如果它成功写进去了，说明 `TURNSTILE_SECRET` 没设对，
任何脚本都能直接灌垃圾——这一条要亲眼看到失败才算部署完成。

## 日常管理

```bash
export COMMENTS_ADMIN_TOKEN=<第 4 步的 ADMIN_TOKEN>

node scripts/comments-admin.js list        # 看最近留言（含已隐藏）
node scripts/comments-admin.js hide 42     # 隐藏 #42
node scripts/comments-admin.js show 42     # 恢复显示
```

隐藏不是删除，记录仍在库里，用于判断某个 `ip_hash` 是不是惯犯。

## 本地开发

```bash
cd workers/comments
wrangler dev --local
```

`--local` 用本机的 SQLite 模拟 D1，不碰线上数据。前端本地调试时把
`NEXT_PUBLIC_COMMENTS_API` 指向 `http://localhost:8787/api/comments`。

## 成本会在什么情况下变成问题

2026 年 9 月 1 日起，免费版 D1 超出每日行数限制后查询会**直接报错**而不是降速。
对正常流量够不着，但如果有人恶意刷接口，表现是评论区暂时挂掉（第二天 UTC 零点
重置），而不是悄悄产生账单。对不想花钱的站来说，这个失败方式是可接受的。
