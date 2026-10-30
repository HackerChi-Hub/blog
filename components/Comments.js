// components/Comments.js
// 文章底部留言区。
//
// 站点是静态导出（output: 'export'），所以留言只能在客户端取：服务端构建时
// 不去碰接口，页面先出壳，挂载后再拉列表。这样留言的增减不会让已发布页面
// 需要重新构建，发布链一行都不用改。

import { useCallback, useEffect, useRef, useState } from 'react';
import { makeT } from '../lib/blog-i18n.cjs';
import { TOPICS, encodeBoardMessage, decodeBoardMessage, groupComments } from '../lib/community.cjs';

// 默认关闭，必须显式开启。
//
// 这个开关不是可有可无的配置项：Worker 还没部署时，留言区会在每篇文章底部显示
// 「留言没加载出来」——一个读者做什么都没用的错误。默认关比默认开安全，代价只是
// 部署完成后要记得打开一次。构建时内联，所以关闭时整段 UI 根本不会渲染。
const COMMENTS_ENABLED = process.env.NEXT_PUBLIC_COMMENTS_ENABLED === 'true';
const API_BASE = process.env.NEXT_PUBLIC_COMMENTS_API || '/api/comments';
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

const MAX_NICKNAME = 24;
const MAX_CONTENT = 1000;
const NICKNAME_STORAGE_KEY = 'hyphentech:comment-nickname';

function formatTime(milliseconds, t) {
  const diff = Date.now() - milliseconds;
  if (diff < 60_000) return t('刚刚');
  if (diff < 3_600_000) return t('{n} 分钟前', { n: Math.floor(diff / 60_000) });
  if (diff < 86_400_000) return t('{n} 小时前', { n: Math.floor(diff / 3_600_000) });
  const date = new Date(milliseconds);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
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
      const script = document.querySelector(`script[src="${TURNSTILE_SCRIPT}"]`);
      script?.removeEventListener('load', render);
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
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

function CommentItem({ comment, onReply, replyingTo, t, board = false, articles = [] }) {
  const decoded = board ? decodeBoardMessage(comment.content) : { text: comment.content };
  const source = articles.find(item => item.slug === decoded.sourceSlug || item.originalSlug === decoded.sourceSlug);
  return (
    <li className="comment-item" id={`comment-${comment.id}`}>
      <div className="comment-head">
        <span className="comment-nickname">{comment.nickname}</span>
        {comment.author_verified === 1 && comment.nickname === '黑粉科技' && (
          <span className="comment-owner-badge">{t('站长 · 已认证')}</span>
        )}
        <time className="comment-time" dateTime={new Date(comment.created_at).toISOString()}>
          {formatTime(comment.created_at, t)}
        </time>
      </div>
      {decoded.category && <span className="tea-topic-label">{t(TOPICS.find(item => item.id === decoded.category).label)}</span>}
      {source && <a className="tea-source" href={`/${source.slug}/`}>{t('来自文章')}：{source.title}</a>}
      <p className="comment-content">{decoded.text}</p>
      {onReply && (
        <button
          type="button"
          className="comment-reply-button"
          onClick={() => onReply(replyingTo === comment.id ? null : comment.id)}
        >
          {replyingTo === comment.id ? t('取消回复') : t('回复')}
        </button>
      )}
      {comment.replies?.length > 0 && (
        <ul className="comment-replies">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} t={t} board={board} articles={articles} />
          ))}
        </ul>
      )}
    </li>
  );
}

function CommentsPanel({ slug, lang, board = false, context = null, articles = [] }) {
  const t = makeT(lang);
  const [comments, setComments] = useState([]);
  const [loadState, setLoadState] = useState('loading'); // loading | ready | failed
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { kind: 'error' | 'ok', text }
  const [category, setCategory] = useState('deploy');
  const [filter, setFilter] = useState('all');
  const [hasMore, setHasMore] = useState(false);
  const panelRef = useRef(null);
  const [activated, setActivated] = useState(false);
  const contextSlug = context?.originalSlug || context?.slug;

  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setActivated(true); return undefined; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setActivated(true); observer.disconnect(); }
    }, { rootMargin: '240px' });
    if (panelRef.current) observer.observe(panelRef.current);
    return () => observer.disconnect();
  }, []);

  const turnstileRef = useRef(null);
  const turnstile = useTurnstile(turnstileRef, activated);

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
      const response = await fetch(`${API_BASE}?slug=${encodeURIComponent(slug)}${board ? '&recent=1' : ''}`, {
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(12000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setComments(groupComments(data.comments || []));
      setHasMore(Boolean(data.hasMore));
      setLoadState('ready');
    } catch {
      setLoadState('failed');
    }
  }, [slug, board]);

  useEffect(() => {
    if (activated) load();
  }, [load, activated]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting || !slug) return;
    setMessage(null);

    if (!content.trim()) {
      setMessage({ kind: 'error', text: t('留言内容是空的') });
      return;
    }
    const body = board && !replyTo ? encodeBoardMessage(content, category, contextSlug) : content.trim();
    if (body.length > MAX_CONTENT) {
      setMessage({ kind: 'error', text: t('内容加上话题信息超过1000字，请缩短后重试。') });
      return;
    }
    const token = turnstile.getToken();
    if (TURNSTILE_SITE_KEY && !token) {
      setMessage({ kind: 'error', text: t('人机校验还没完成，稍等一下再发') });
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
          content: body,
          parentId: replyTo,
          turnstileToken: token,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        // 服务端错误是简体：认得的翻译，认不得的在非简体页换成通用提示，不把简体原句甩给读者。
        const serverError = data.error && t.has(data.error) ? t(data.error) : null;
        const fallback = t.lang === 'zh-CN' ? data.error : null;
        setMessage({ kind: 'error', text: serverError || fallback || t('发送失败，稍后再试') });
        return;
      }
      try {
        window.localStorage.setItem(NICKNAME_STORAGE_KEY, nickname.trim());
      } catch {
        // 同上，存不进去不影响这次留言。
      }
      setContent('');
      setReplyTo(null);
      setMessage({ kind: 'ok', text: t('发出去了') });
      await load();
    } catch {
      setMessage({ kind: 'error', text: t('网络没连上，检查一下再试') });
    } finally {
      turnstile.reset();
      setSubmitting(false);
    }
  }

  const total = comments.reduce((sum, item) => sum + 1 + (item.replies?.length || 0), 0);
  const shown = board ? [...comments].reverse().filter(item => filter === 'all' || decodeBoardMessage(item.content).category === filter) : comments;
  // 系统话题与来源前缀预留预算，读者计数仍从零开始；最终提交继续校验完整正文。
  const metadataLength = board && !replyTo ? encodeBoardMessage('', category, contextSlug).length : 0;
  const maxInputLength = MAX_CONTENT - metadataLength;

  return (
    <section ref={panelRef} className="comments-section" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="comments-heading">
        {board ? t('聊两句') : t('留言')}{loadState === 'ready' && total > 0 ? ` · ${total}` : ''}
      </h2>

      <form className="comment-form" onSubmit={handleSubmit}>
        {board && !replyTo && <>
          <label className="comment-label" htmlFor="comment-category">{t('选择话题')}</label>
          <select id="comment-category" className="comment-input" value={category} onChange={event => setCategory(event.target.value)}>
            {TOPICS.map(topic => <option key={topic.id} value={topic.id}>{t(topic.label)}</option>)}
          </select>
          {context && <p className="tea-context">{t('来自文章')}：<a href={`/${context.slug}/`}>{context.title}</a></p>}
        </>}
        {replyTo && (
          <div className="comment-replying-hint">
            {t('正在回复 #{id}', { id: replyTo })}
            <button type="button" onClick={() => setReplyTo(null)}>{t('取消')}</button>
          </div>
        )}
        <label className="comment-label" htmlFor="comment-nickname">{t('昵称')}</label>
        <input
          id="comment-nickname"
          className="comment-input"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          maxLength={MAX_NICKNAME}
          placeholder={t('怎么称呼你')}
          autoComplete="nickname"
          required
        />
        <label className="comment-label" htmlFor="comment-content">{t('留言::label')}</label>
        <textarea
          id="comment-content"
          className="comment-textarea"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={maxInputLength}
          rows={4}
          placeholder={board ? t('写清设备、系统、软件版本、报错和已经试过的办法。不要贴密钥或个人信息。') : t('说点什么')}
          required
        />
        <div className="comment-form-footer">
          <div ref={turnstileRef} className="comment-turnstile" />
          <div className="comment-actions">
            <span className="comment-counter">{content.length}/{maxInputLength}</span>
            <button type="submit" className="comment-submit" disabled={submitting}>
              {submitting ? t('发送中…') : t('发表')}
            </button>
          </div>
        </div>
        {message && (
          <p className={`comment-message comment-message-${message.kind}`} role="status">
            {message.text}
          </p>
        )}
      </form>

      {board && <div className="tea-filters" aria-label={t('筛选话题')}>
        <button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>{t('全部话题')}</button>
        {TOPICS.map(topic => <button type="button" key={topic.id} aria-pressed={filter === topic.id} onClick={() => setFilter(topic.id)}>{t(topic.label)}</button>)}
      </div>}

      {loadState === 'loading' && <p className="comment-placeholder">{t('正在加载留言…')}</p>}
      {loadState === 'failed' && (
        <p className="comment-placeholder">
          {t('留言没加载出来。')}<button type="button" className="comment-retry" onClick={load}>{t('重试')}</button>
        </p>
      )}
      {loadState === 'ready' && total === 0 && (
        <p className="comment-placeholder">{t('还没有人留言，来坐第一个。')}</p>
      )}
      {loadState === 'ready' && total > 0 && (
        <ul className="comment-list">
          {shown.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={setReplyTo}
              replyingTo={replyTo}
              t={t}
              board={board}
              articles={articles}
            />
          ))}
        </ul>
      )}
      {board && loadState === 'ready' && total > 0 && !shown.length && <p className="comment-placeholder">{t('这个话题还没人开聊，欢迎先提一个。')}</p>}
      {board && hasMore && <p className="comment-placeholder">{t('当前仅显示最近200条留言，更早记录仍保留。')}</p>}
    </section>
  );
}

/**
 * 对外入口。开关判断放在这一层而不是 CommentsPanel 内部：React 的 hooks 必须
 * 无条件调用，在组件体里提前 return 会违反 hooks 规则；包一层则是整个子组件
 * 不被渲染，它的 hooks 自然一次都不会执行。
 */
export default function Comments({ slug, lang, ...options }) {
  if (!COMMENTS_ENABLED) return null;
  return <CommentsPanel key={slug} slug={slug} lang={lang} {...options} />;
}
