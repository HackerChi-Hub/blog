// components/ShareButtons.js
// 文章分享功能组件

import { useEffect, useState } from 'react';
import { SITE_CONFIG } from '../lib/seo';

/**
 * 分享按钮组件
 */
export default function ShareButtons({ title, url, description }) {
  const [copied, setCopied] = useState(false);
  const [showWeChatQR, setShowWeChatQR] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const fullUrl = url.startsWith('http') ? url : `${SITE_CONFIG.url}${url}`;
  const shareText = `${title} - ${SITE_CONFIG.name}`;
  const shareDescription = description || SITE_CONFIG.description;

  // 首次客户端渲染保持与服务端一致，挂载后再检测原生分享能力，避免水合不匹配。
  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  // 分享到 Twitter
  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  // 分享到 Facebook
  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  // 分享到 LinkedIn
  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
  };

  // 分享到微信
  const shareToWeChat = () => {
    // 检测是否在微信内置浏览器中（仅在客户端）
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      setShowWeChatQR(true);
      copyLink();
      return;
    }
    
    const isWeChat = /MicroMessenger/i.test(navigator.userAgent);
    
    if (isWeChat) {
      // 在微信中，提示用户使用右上角菜单分享
      alert('请点击右上角菜单，选择"发送给朋友"或"分享到朋友圈"');
    } else {
      // 不在微信中，显示二维码或复制链接提示
      setShowWeChatQR(true);
      // 同时复制链接到剪贴板
      copyLink();
    }
  };

  // 生成二维码 URL（使用在线二维码生成服务）
  const getQRCodeUrl = () => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullUrl)}`;
  };

  // 分享到微博
  const shareToWeibo = () => {
    const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(shareText)}&pic=${encodeURIComponent(fullUrl)}`;
    window.open(weiboUrl, '_blank', 'width=550,height=420');
  };

  // 分享到 QQ
  const shareToQQ = () => {
    const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(shareText)}&summary=${encodeURIComponent(shareDescription)}`;
    window.open(qqUrl, '_blank', 'width=550,height=420');
  };

  // 分享到 QQ 空间
  const shareToQZone = () => {
    const qzoneUrl = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(shareText)}&summary=${encodeURIComponent(shareDescription)}`;
    window.open(qzoneUrl, '_blank', 'width=550,height=420');
  };

  // 分享到豆瓣
  const shareToDouban = () => {
    const doubanUrl = `https://www.douban.com/share/service?url=${encodeURIComponent(fullUrl)}&name=${encodeURIComponent(shareText)}`;
    window.open(doubanUrl, '_blank', 'width=550,height=420');
  };

  // 分享到知乎
  const shareToZhihu = () => {
    const zhihuUrl = `https://www.zhihu.com/question/ask?title=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`;
    window.open(zhihuUrl, '_blank', 'width=550,height=420');
  };

  // 复制链接
  const copyLink = async () => {
    // 仅在客户端执行
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        throw new Error('Clipboard API not available');
      }
    } catch (err) {
      console.error('复制失败:', err);
      // 降级方案：使用传统方法
      if (typeof document !== 'undefined') {
        const textArea = document.createElement('textarea');
        textArea.value = fullUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('复制失败:', err);
        }
        document.body.removeChild(textArea);
      }
    }
  };

  // 使用 Web Share API（如果支持）
  const shareNative = async () => {
    // 仅在客户端执行
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          text: shareDescription,
          url: fullUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('分享失败:', err);
        }
      }
    } else {
      // 不支持 Web Share API，显示其他选项
      copyLink();
    }
  };

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  };

  const hoverStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-1px)',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '0',
      }}
    >
      <span
        style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginRight: '8px',
          alignSelf: 'center',
        }}
      >
        分享到：
      </span>

      {/* 原生分享（移动端） */}
      {canNativeShare && (
        <button
          onClick={shareNative}
          style={buttonStyle}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, hoverStyle);
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, buttonStyle);
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          分享
        </button>
      )}

      {/* Twitter */}
      <button
        onClick={shareToTwitter}
        style={buttonStyle}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, { ...hoverStyle, background: 'rgba(29, 161, 242, 0.1)', borderColor: 'rgba(29, 161, 242, 0.3)' });
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, buttonStyle);
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
        </svg>
        Twitter
      </button>

      {/* Facebook */}
      <button
        onClick={shareToFacebook}
        style={buttonStyle}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, { ...hoverStyle, background: 'rgba(24, 119, 242, 0.1)', borderColor: 'rgba(24, 119, 242, 0.3)' });
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, buttonStyle);
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
        Facebook
      </button>

      {/* LinkedIn */}
      <button
        onClick={shareToLinkedIn}
        style={buttonStyle}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, { ...hoverStyle, background: 'rgba(0, 119, 181, 0.1)', borderColor: 'rgba(0, 119, 181, 0.3)' });
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, buttonStyle);
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
        LinkedIn
      </button>

      {/* 微信 */}
      <button
        onClick={shareToWeChat}
        style={buttonStyle}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, { ...hoverStyle, background: 'rgba(7, 193, 96, 0.1)', borderColor: 'rgba(7, 193, 96, 0.3)' });
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, buttonStyle);
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.598-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.179c0-.651.52-1.18 1.162-1.18zm6.43 1.18c0-.651.52-1.18 1.162-1.18.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.179zm-1.162 4.177c-2.554 0-4.661 1.523-5.09 3.53-.013.062-.02.125-.02.188 0 .326.261.59.585.59a.583.583 0 0 0 .504-.287c.89-1.214 2.307-1.98 3.92-2.026 1.92-.068 3.715.64 4.998 1.83a.59.59 0 0 0 .833-.017.607.607 0 0 0 .018-.857c-1.47-1.54-3.548-2.371-5.728-2.371zm-2.344 2.73c.356 0 .644.293.644.655a.648.648 0 0 1-.644.654.648.648 0 0 1-.644-.654c0-.362.288-.655.644-.655zm4.713 0c.356 0 .644.293.644.655a.648.648 0 0 1-.644.654.648.648 0 0 1-.644-.654c0-.362.288-.655.644-.655z"/>
        </svg>
        微信
      </button>

      {/* 微博 */}
      <button
        onClick={shareToWeibo}
        style={buttonStyle}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, { ...hoverStyle, background: 'rgba(230, 22, 45, 0.1)', borderColor: 'rgba(230, 22, 45, 0.3)' });
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, buttonStyle);
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.839 18.761c-1.16 0-2.244-.3-3.192-.825a.69.69 0 0 1-.357-.622c0-.234.12-.43.31-.525 1.917-1.018 3.24-2.86 3.24-4.95 0-3.182-2.584-5.764-5.764-5.764S0 9.438 0 12.62c0 3.183 2.584 5.765 5.764 5.765.29 0 .576-.02.857-.058a.7.7 0 0 1 .636.207.688.688 0 0 1 .14.76c-.3.6-.7 1.15-1.19 1.62a9.27 9.27 0 0 0 2.632 1.8c.99.5 2.1.76 3.22.76 4.22 0 7.64-3.42 7.64-7.64 0-4.22-3.42-7.64-7.64-7.64-4.22 0-7.64 3.42-7.64 7.64 0 .88.15 1.73.43 2.52.1.3.05.63-.13.88-.18.25-.48.4-.8.4-.1 0-.2-.02-.3-.05a11.1 11.1 0 0 1-1.5-5.75c0-5.04 4.1-9.14 9.14-9.14s9.14 4.1 9.14 9.14-4.1 9.14-9.14 9.14z"/>
        </svg>
        微博
      </button>

      {/* QQ */}
      <button
        onClick={shareToQQ}
        style={buttonStyle}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, { ...hoverStyle, background: 'rgba(18, 183, 245, 0.1)', borderColor: 'rgba(18, 183, 245, 0.3)' });
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, buttonStyle);
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.032 0C5.432 0 .032 4.32.032 9.6c0 2.752 1.408 5.248 3.68 7.04L2.4 24l7.68-1.6c1.024.192 2.08.32 3.136.32 6.624 0 12-4.32 12-9.6C25.216 4.32 19.84 0 13.216 0h-1.184zm-.032 16.8c-.96 0-1.952-.128-2.88-.384l-.864-.192-5.76 1.184 1.248-5.44-.32-.832C1.6 10.4 1.6 10.016 1.6 9.6c0-4.416 4.48-8 10-8s10 3.584 10 8-4.48 8-10 8z"/>
        </svg>
        QQ
      </button>

      {/* QQ 空间 */}
      <button
        onClick={shareToQZone}
        style={buttonStyle}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, { ...hoverStyle, background: 'rgba(255, 153, 0, 0.1)', borderColor: 'rgba(255, 153, 0, 0.3)' });
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, buttonStyle);
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        QQ空间
      </button>

      {/* 复制链接 */}
      <button
        onClick={copyLink}
        style={buttonStyle}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, { ...hoverStyle, background: copied ? 'rgba(105, 240, 174, 0.1)' : hoverStyle.background, borderColor: copied ? 'rgba(105, 240, 174, 0.3)' : hoverStyle.borderColor });
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, buttonStyle);
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {copied ? (
            <path d="M20 6L9 17l-5-5" />
          ) : (
            <>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </>
          )}
        </svg>
        {copied ? '已复制' : '复制链接'}
      </button>

      {/* 微信二维码弹窗 */}
      {showWeChatQR && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
          onClick={() => setShowWeChatQR(false)}
        >
          <div
            style={{
              background: 'rgba(8, 12, 24, 0.98)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              maxWidth: '300px',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                margin: '0 0 16px 0',
                color: 'var(--text-primary)',
                fontSize: '1.1rem',
              }}
            >
              微信分享
            </h3>
            <div
              style={{
                marginBottom: '16px',
                display: 'inline-block',
              }}
            >
              <img
                src={getQRCodeUrl()}
                alt="二维码"
                style={{
                  width: '200px',
                  height: '200px',
                  display: 'block',
                }}
              />
            </div>
            <p
              style={{
                margin: '0 0 16px 0',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
              }}
            >
              使用微信扫描二维码打开文章
            </p>
            <p
              style={{
                margin: '0 0 16px 0',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
              }}
            >
              链接已复制到剪贴板
            </p>
            <button
              onClick={() => setShowWeChatQR(false)}
              style={{
                padding: '8px 24px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
