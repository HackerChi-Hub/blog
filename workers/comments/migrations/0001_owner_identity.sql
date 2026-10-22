-- 现有留言默认未认证，绝不按历史昵称自动授予站长身份。
ALTER TABLE comments ADD COLUMN author_verified INTEGER NOT NULL DEFAULT 0 CHECK (author_verified IN (0, 1));
