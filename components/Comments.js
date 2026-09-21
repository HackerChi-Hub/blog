// components/Comments.js
// 文章底部留言区。
//
// 站点是静态导出（output: 'export'），所以留言只能在客户端取：服务端构建时
// 不去碰接口，页面先出壳，挂载后再拉列表。这样留言的增减不会让已发布页面
// 需要重新构建，发布链一行都不用改。

import { useCallback, useEffect, useRef, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_COMMENTS_API || '/api/comments';
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

const MAX_NICKNAME = 24;
const MAX_CONTENT = 1000;
const NICKNAME_STORAGE_KEY = 'hyphentech:comment-nickname';

function formatTime(milliseconds) {
  const diff = Date.now() - milliseconds;
  if (diff < 60_000) return '刚刚';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`;
  const date = new Date(milliseconds);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** 把扁平列表整理成「顶层留言 + 它的回复」两层。再深的嵌套在手机上没法读。 */
function groupComments(list) {
  const byId = new Map(list.map((item) => [item.id, item]));
  const roots = [];
  const replies = new Map();
  for (const item of list) {
    const parentId = item.parent_id;
    if (parentId && byId.has(parentId)) {
      if (!replies.has(parentId)) replies.set(parentId, []);
      replies.get(parentId).push(item);
    } else {
      roots.push(item);
    }
  }
  return roots.map((root) => ({ ...root, replies: replies.get(root.id) || [] }));
}

function useTurnstile(containerRef, enabled) {
  const widgetIdRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled || !TURNSTILE_SITE_KEY) return undefined;

    let cancelled = false;
    function render() {
      if (cancelled || !containerRef.current || widgetIdRef.current !== null) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'dark',
        size: 'flexible',
      });
      setReady(true);
    }

    if (window.turnstile) {
      render();
    } else {
      // 脚本只注入一次：同一页面可能有多个实例，重复注入会让 turnstile 报重复渲染。
      let script = document.querySelector(`script[src="${TURNSTILE_SCRIPT}"]`);
      if (!script) {
        script = document.createElement('script');
        script.src = TURNSTILE_SCRIPT;
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener('load', render);
    }

    return () => {
      cancelled = true;
    };
  }, [containerRef, enabled]);

  const getToken = useCallback(() => {
    if (!TURNSTILE_SITE_KEY) return '';
    if (widgetIdRef.current === null || !window.turnstile) return '';
    return window.turnstile.getResponse(widgetIdRef.current) || '';
  }, []);

  // token 是一次性的，提交后必须重置，否则第二条留言会被判成重放。
  const reset = useCallback(() => {
    if (widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, []);

  return { ready, getToken, reset };
}

function CommentItem({ comment, onReply, replyingTo }) {
  return (
    <li className="comment-item">
      <div className="comment-head">
        <span className="comment-nickname">{comment.nickname}</span>
        <time className="comment-time" dateTime={new Date(comment.created_at).toISOString()}>
          {formatTime(comment.created_at)}
        </time>
      </div>
      <p className="comment-content">{comment.content}</p>
      {onReply && (
        <button
          type="button"
          className="comment-reply-button"
          onClick={() => onReply(replyingTo === comment.id ? null : comment.id)}
        >
          {replyingTo === comment.id ? '取消回复' : '回复'}
        </button>
      )}
      {comment.replies?.length > 0 && (
        <ul className="comment-replies">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Comments({ slug }) {
  const [comments, setComments] = useState([]);
  const [loadState, setLoadState] = useState('loading'); // loading | ready | failed
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { kind: 'error' | 'ok', text }

  const turnstileRef = useRef(null);
  const turnstile = useTurnstile(turnstileRef, true);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(NICKNAME_STORAGE_KEY);
      if (saved) setNickname(saved);
    } catch {
      // 隐私模式或禁用存储时读取会抛，昵称填一次不算大事，静默忽略。
    }
  }, []);

  const load = useCallback(async () => {
    // 静态导出下 router.query 在首屏 hydration 前可能还没填好，slug 会是 undefined。
    // 这时候请求出去只会换回一个 400，安静等下一轮即可。
    if (!slug) return;
    try {
      const response = await fetch(`${API_BASE}?slug=${encodeURIComponent(slug)}`, {
        headers: { accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setComments(groupComments(data.comments || []));
      setLoadState('ready');
    } catch {
      setLoadState('failed');
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting || !slug) return;
    setMessage(null);

    const token = turnstile.getToken();
    if (TURNSTILE_SITE_KEY && !token) {
      setMessage({ kind: 'error', text: '人机校验还没完成，稍等一下再发' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slug,
          nickname: nickname.trim(),
          content: content.trim(),
          parentId: replyTo,
          turnstileToken: token,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage({ kind: 'error', text: data.error || '发送失败，稍后再试' });
        return;
      }
      try {
        window.localStorage.setItem(NICKNAME_STORAGE_KEY, nickname.trim());
      } catch {
        // 同上，存不进去不影响这次留言。
      }
      setContent('');
      setReplyTo(null);
      setMessage({ kind: 'ok', text: '发出去了' });
      await load();
    } catch {
      setMessage({ kind: 'error', text: '网络没连上，检查一下再试' });
    } finally {
      turnstile.reset();
      setSubmitting(false);
    }
  }

  const total = comments.reduce((sum, item) => sum + 1 + (item.replies?.length || 0), 0);

  return (
    <section className="comments-section" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="comments-heading">
        留言{loadState === 'ready' && total > 0 ? ` · ${total}` : ''}
      </h2>

      <form className="comment-form" onSubmit={handleSubmit}>
        {replyTo && (
          <div className="comment-replying-hint">
            正在回复 #{replyTo}
            <button type="button" onClick={() => setReplyTo(null)}>取消</button>
          </div>
        )}
        <label className="comment-label" htmlFor="comment-nickname">昵称</label>
        <input
          id="comment-nickname"
          className="comment-input"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          maxLength={MAX_NICKNAME}
          placeholder="怎么称呼你"
          autoComplete="nickname"
          required
        />
        <label className="comment-label" htmlFor="comment-content">留言</label>
        <textarea
          id="comment-content"
          className="comment-textarea"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={MAX_CONTENT}
          rows={4}
          placeholder="说点什么"
          required
        />
        <div className="comment-form-footer">
          <div ref={turnstileRef} className="comment-turnstile" />
          <div className="comment-actions">
            <span className="comment-counter">{content.length}/{MAX_CONTENT}</span>
            <button type="submit" className="comment-submit" disabled={submitting}>
              {submitting ? '发送中…' : '发表'}
            </button>
          </div>
        </div>
        {message && (
          <p className={`comment-message comment-message-${message.kind}`} role="status">
            {message.text}
          </p>
        )}
      </form>

      {loadState === 'loading' && <p className="comment-placeholder">正在加载留言…</p>}
      {loadState === 'failed' && (
        <p className="comment-placeholder">
          留言没加载出来。<button type="button" className="comment-retry" onClick={load}>重试</button>
        </p>
      )}
      {loadState === 'ready' && total === 0 && (
        <p className="comment-placeholder">还没有人留言，来坐第一个。</p>
      )}
      {loadState === 'ready' && total > 0 && (
        <ul className="comment-list">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={setReplyTo}
              replyingTo={replyTo}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
