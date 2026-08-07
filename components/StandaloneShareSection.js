import { useState } from 'react';
import { SITE_CONFIG } from '../lib/seo';

const buttonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '38px',
  padding: '8px 14px',
  borderRadius: '9px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  background: 'rgba(255, 255, 255, 0.05)',
  color: 'var(--text-secondary, #dce8f5)',
  fontSize: '0.9rem',
  fontWeight: 500,
  lineHeight: 1.2,
  cursor: 'pointer',
  textDecoration: 'none',
  boxSizing: 'border-box',
};

const INLINE_SHARE_FALLBACK = `(function(){
  var script=document.currentScript;
  var root=script&&script.parentElement;
  if(!root||root.__hyphenShareBound)return;
  root.__hyphenShareBound=true;
  var url=root.getAttribute('data-share-url')||window.location.href;
  var title=root.getAttribute('data-share-title')||document.title;
  var description=root.getAttribute('data-share-description')||'';
  function done(button){
    if(!button)return;
    var old=button.textContent;
    button.textContent='✓ 已复制';
    window.setTimeout(function(){button.textContent=old;},2000);
  }
  function fallbackCopy(button){
    var area=document.createElement('textarea');
    area.value=url;
    area.style.position='fixed';
    area.style.opacity='0';
    document.body.appendChild(area);
    area.select();
    try{document.execCommand('copy');done(button);}catch(error){}
    document.body.removeChild(area);
  }
  function copy(button){
    if(navigator.clipboard&&navigator.clipboard.writeText){
      var finished=false;
      var timer=window.setTimeout(function(){
        if(finished)return;
        finished=true;
        fallbackCopy(button);
      },250);
      navigator.clipboard.writeText(url).then(function(){
        if(finished)return;
        finished=true;
        window.clearTimeout(timer);
        done(button);
      }).catch(function(){
        if(finished)return;
        finished=true;
        window.clearTimeout(timer);
        fallbackCopy(button);
      });
    }else{fallbackCopy(button);}
  }
  function wechat(){
    copy(root.querySelector('[data-share-control="copy"]'));
    var overlay=document.createElement('div');
    overlay.setAttribute('data-share-modal','wechat');
    overlay.style.cssText='position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:20px;background:rgba(0,0,0,.82)';
    overlay.innerHTML='<div role="dialog" aria-modal="true" aria-label="微信分享" style="width:min(100%,320px);padding:24px;border:1px solid rgba(255,255,255,.18);border-radius:18px;background:#09101c;color:#edf7ff;text-align:center"><h3 style="margin:0 0 14px">微信分享</h3><img alt="页面二维码" style="display:block;width:200px;height:200px;margin:0 auto 14px;padding:8px;border-radius:10px;background:#fff"><p style="margin:0 0 14px;color:#aab7c8">微信扫码打开页面，链接也已经复制好了。</p><button type="button" style="min-height:38px;padding:8px 20px;border:1px solid rgba(255,255,255,.2);border-radius:9px;background:rgba(255,255,255,.08);color:#edf7ff;cursor:pointer">关闭</button></div>';
    overlay.querySelector('img').src='https://api.qrserver.com/v1/create-qr-code/?size=200x200&data='+encodeURIComponent(url);
    var close=function(){overlay.remove();};
    overlay.addEventListener('click',function(event){if(event.target===overlay)close();});
    overlay.querySelector('button').addEventListener('click',close);
    document.body.appendChild(overlay);
  }
  root.addEventListener('click',function(event){
    var button=event.target.closest('[data-share-control]');
    if(!button||!root.contains(button))return;
    event.__hyphenShareHandled=true;
    var action=button.getAttribute('data-share-control');
    if(action==='native'){
      if(navigator.share){navigator.share({title:title,text:description,url:url}).catch(function(){});}else{copy(button);}
    }else if(action==='wechat'){wechat();}
    else if(action==='copy'){copy(button);}
  });
})();`;

function markCopied(button) {
  if (!button) return;
  const oldText = button.textContent;
  button.textContent = '✓ 已复制';
  window.setTimeout(() => {
    button.textContent = oldText;
  }, 2000);
}

function fallbackCopy(url, button) {
  const area = document.createElement('textarea');
  area.value = url;
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  try {
    document.execCommand('copy');
    markCopied(button);
  } catch {
    // 复制权限被浏览器禁止时保留原按钮，不阻塞其他分享方式。
  }
  document.body.removeChild(area);
}

function copyUrl(url, button) {
  if (navigator.clipboard?.writeText) {
    let finished = false;
    const timer = window.setTimeout(() => {
      if (finished) return;
      finished = true;
      fallbackCopy(url, button);
    }, 250);

    navigator.clipboard.writeText(url)
      .then(() => {
        if (finished) return;
        finished = true;
        window.clearTimeout(timer);
        markCopied(button);
      })
      .catch(() => {
        if (finished) return;
        finished = true;
        window.clearTimeout(timer);
        fallbackCopy(url, button);
      });
  } else {
    fallbackCopy(url, button);
  }
}

function showWeChatModal(url, copyButton) {
  copyUrl(url, copyButton);
  const overlay = document.createElement('div');
  overlay.setAttribute('data-share-modal', 'wechat');
  overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:20px;background:rgba(0,0,0,.82)';
  overlay.innerHTML = '<div role="dialog" aria-modal="true" aria-label="微信分享" style="width:min(100%,320px);padding:24px;border:1px solid rgba(255,255,255,.18);border-radius:18px;background:#09101c;color:#edf7ff;text-align:center"><h3 style="margin:0 0 14px">微信分享</h3><img alt="页面二维码" style="display:block;width:200px;height:200px;margin:0 auto 14px;padding:8px;border-radius:10px;background:#fff"><p style="margin:0 0 14px;color:#aab7c8">微信扫码打开页面，链接也已经复制好了。</p><button type="button" style="min-height:38px;padding:8px 20px;border:1px solid rgba(255,255,255,.2);border-radius:9px;background:rgba(255,255,255,.08);color:#edf7ff;cursor:pointer">关闭</button></div>';
  overlay.querySelector('img').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  const close = () => overlay.remove();
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });
  overlay.querySelector('button').addEventListener('click', close);
  document.body.appendChild(overlay);
}

export default function StandaloneShareSection({ title, url, description }) {
  const [copied, setCopied] = useState(false);
  const fullUrl = url.startsWith('http') ? url : `${SITE_CONFIG.url}${url}`;
  const shareTitle = `${title} - ${SITE_CONFIG.name}`;
  const shareDescription = description || SITE_CONFIG.description;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  const encodedDescription = encodeURIComponent(shareDescription);

  const handleControl = (action) => (event) => {
    const showCopied = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    };

    if (event.nativeEvent?.__hyphenShareHandled) {
      if (action === 'copy') showCopied();
      return;
    }

    if (action === 'native' && navigator.share) {
      navigator.share({ title: shareTitle, text: shareDescription, url: fullUrl }).catch(() => {});
    } else if (action === 'wechat') {
      const copyButton = event.currentTarget.parentElement.querySelector('[data-share-control="copy"]');
      showCopied();
      showWeChatModal(fullUrl, copyButton);
    } else {
      showCopied();
      copyUrl(fullUrl, event.currentTarget);
    }
  };

  const links = [
    ['Twitter', `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`],
    ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`],
    ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`],
    ['微博', `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}`],
    ['QQ', `https://connect.qq.com/widget/shareqq/index.html?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`],
    ['QQ空间', `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`],
  ];

  return (
    <section
      aria-label="分享这个页面"
      data-share-url={fullUrl}
      data-share-title={shareTitle}
      data-share-description={shareDescription}
      style={{
        width: 'min(100%, 1120px)',
        margin: '48px auto 24px',
        padding: '24px',
        borderRadius: '18px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.035)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <div style={{ color: '#69f0ae', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em' }}>
          分享这个页面
        </div>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary, #aab7c8)', fontSize: '0.92rem', lineHeight: 1.6 }}>
          觉得有用，就顺手递给下一个可能会踩坑的人。
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-muted, #8f9bad)', fontSize: '0.85rem', marginRight: '4px' }}>分享到：</span>
        <button type="button" data-share-control="native" onClick={handleControl('native')} style={buttonStyle}>↗ 分享</button>
        {links.map(([label, href]) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={buttonStyle}>{label}</a>
        ))}
        <button type="button" data-share-control="wechat" onClick={handleControl('wechat')} style={{ ...buttonStyle, color: '#75e89f' }}>微信</button>
        <button type="button" data-share-control="copy" onClick={handleControl('copy')} style={{ ...buttonStyle, color: '#75e5ff' }}>
          {copied ? '✓ 已复制' : '⧉ 复制链接'}
        </button>
      </div>

      <script dangerouslySetInnerHTML={{ __html: INLINE_SHARE_FALLBACK }} />
    </section>
  );
}
