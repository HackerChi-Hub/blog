-- 留言表。
--
-- 设计取向：
-- 1) 不存原始 IP，只存加盐 SHA-256 前缀。限流和封禁需要「认出是同一个人」，
--    不需要「知道他是谁」；真源 IP 一旦落库，备份、导出和将来的任何一次误操作
--    都会把它带出去。加盐是为了让这列即使泄露也无法反查——IPv4 空间只有 43 亿，
--    不加盐的哈希几分钟就能全表撞完。
-- 2) status 而不是物理删除。事后删掉的垃圾评论仍然是判断「这个 ip_hash 是不是
--    惯犯」的证据，直接 DELETE 等于每次都把判据一起丢了。
-- 3) created_at 用毫秒整数而不是 TEXT 时间戳，省得在边缘上做时区解析。

CREATE TABLE IF NOT EXISTS comments (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT    NOT NULL,
  nickname    TEXT    NOT NULL,
  content     TEXT    NOT NULL,
  parent_id   INTEGER REFERENCES comments(id) ON DELETE SET NULL,
  created_at  INTEGER NOT NULL,
  ip_hash     TEXT    NOT NULL,
  ua          TEXT,
  status      TEXT    NOT NULL DEFAULT 'visible' CHECK (status IN ('visible', 'hidden'))
);

-- 列表查询就是「某篇文章的可见评论按时间排」，这条索引正好覆盖它，
-- 免得每次加载文章页都全表扫。
CREATE INDEX IF NOT EXISTS idx_comments_slug
  ON comments (slug, status, created_at);

-- 限流查询是「这个 ip_hash 最近 N 秒发了几条」，按哈希加时间取。
CREATE INDEX IF NOT EXISTS idx_comments_rate
  ON comments (ip_hash, created_at);
