// components/Search.js
// 全局搜索组件

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

const normalizeSummary = (summary) => {
  if (!summary) return '';
  if (typeof summary === 'string') return summary;
  if (Array.isArray(summary)) {
    return summary
      .map((item) => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item?.plain_text) return item.plain_text;
        if (item?.text?.content) return item.text.content;
        return '';
      })
      .filter(Boolean)
      .join('');
  }
  if (typeof summary === 'object') {
    if (summary.plain_text) return summary.plain_text;
    if (summary.text?.content) return summary.text.content;
    return JSON.stringify(summary);
  }
  return String(summary);
};

/**
 * 搜索文章
 * @param {string} query - 搜索关键词
 * @param {Array} posts - 文章列表
 * @returns {Array} 匹配的文章列表
 */
function searchPosts(query, posts) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const keywords = query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  if (keywords.length === 0) {
    return [];
  }

  const results = posts
    .map((post) => {
      let score = 0;
      const title = (post.title || '').toLowerCase();
      const summary = normalizeSummary(post.summary).toLowerCase();
      const categories = (post.categoryNames || []).join(' ').toLowerCase();
      const tags = (post.tags || [])
        .map((tag) => (typeof tag === 'string' ? tag : tag.name || ''))
        .join(' ')
        .toLowerCase();
      const content = `${title} ${summary} ${categories} ${tags}`;

      // 计算匹配分数
      keywords.forEach((keyword) => {
        // 标题匹配权重最高
        if (title.includes(keyword)) {
          score += 10;
        }
        // 分类和标签匹配
        if (categories.includes(keyword) || tags.includes(keyword)) {
          score += 5;
        }
        // 摘要匹配
        if (summary.includes(keyword)) {
          score += 2;
        }
        // 内容匹配
        if (content.includes(keyword)) {
          score += 1;
        }
      });

      return { post, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10) // 最多返回 10 个结果
    .map((item) => item.post);

  return results;
}

export default function Search({ posts = [] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // 处理搜索
  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    // 模拟搜索延迟（实际可以移除）
    const timer = setTimeout(() => {
      const searchResults = searchPosts(query, posts);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0 || query.length > 0);
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [query, posts]);

  // 点击外部关闭搜索
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // 键盘快捷键：Ctrl/Cmd + K
  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={searchRef}
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      {/* 搜索输入框 */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="搜索文章... (Ctrl+K)"
          style={{
            width: '100%',
            padding: '14px 44px 14px 18px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(105, 240, 174, 0.5)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(105, 240, 174, 0.15)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
          }}
        />
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            position: 'absolute',
            right: '12px',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>

      {/* 搜索结果下拉框 */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '8px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(8, 12, 24, 0.98)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          {isLoading ? (
            <div
              style={{
                padding: '20px',
                textAlign: 'center',
                color: 'var(--text-muted)',
              }}
            >
              搜索中...
            </div>
          ) : query.trim().length === 0 ? (
            <div
              style={{
                padding: '20px',
                textAlign: 'center',
                color: 'var(--text-muted)',
              }}
            >
              输入关键词搜索文章
            </div>
          ) : results.length === 0 ? (
            <div
              style={{
                padding: '20px',
                textAlign: 'center',
                color: 'var(--text-muted)',
              }}
            >
              未找到相关文章
            </div>
          ) : (
            <>
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                }}
              >
                找到 {results.length} 篇文章
              </div>
              {results.map((post) => {
                const slug = post.slug || post.rawId || post.id;
                const href = `/${slug}/`;
                const summary = normalizeSummary(post.summary);

                return (
                  <Link
                    key={post.id || slug}
                    href={href}
                    style={{
                      display: 'block',
                      padding: '16px',
                      textDecoration: 'none',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                  >
                    <div
                      style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '6px',
                      }}
                    >
                      {post.title || slug}
                    </div>
                    {summary && (
                      <div
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--text-muted)',
                          marginBottom: '6px',
                          lineHeight: 1.4,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {summary}
                      </div>
                    )}
                    {post.date && (
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {formatDate(post.date)}
                      </div>
                    )}
                  </Link>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
