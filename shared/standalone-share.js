(function () {
  'use strict';

  var roots = document.querySelectorAll('[data-standalone-share]');
  if (!roots.length) return;

  if (!document.getElementById('standalone-share-styles')) {
    var style = document.createElement('style');
    style.id = 'standalone-share-styles';
    style.textContent = [
      '.standalone-share{width:min(calc(100% - 32px),1120px);margin:48px auto 28px;padding:24px;box-sizing:border-box;border:1px solid rgba(255,255,255,.12);border-radius:18px;background:rgba(9,16,28,.82);color:#eaf4ff;box-shadow:0 22px 55px rgba(0,0,0,.22)}',
      '.standalone-share__eyebrow{color:#69f0ae;font-size:12px;font-weight:800;letter-spacing:.12em}',
      '.standalone-share__hint{margin:8px 0 18px;color:#aab7c8;font-size:14px;line-height:1.6}',
      '.standalone-share__buttons{display:flex;flex-wrap:wrap;gap:10px;align-items:center}',
      '.standalone-share__label{margin-right:4px;color:#8f9bad;font-size:13px}',
      '.standalone-share__button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:38px;padding:8px 14px;border:1px solid rgba(255,255,255,.2);border-radius:9px;background:rgba(255,255,255,.05);color:#dce8f5;font:500 14px/1.2 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer;transition:transform .2s ease,background .2s ease,border-color .2s ease}',
      '.standalone-share__button:hover{transform:translateY(-1px);background:rgba(255,255,255,.1);border-color:rgba(105,240,174,.42)}',
      '.standalone-share__button[data-share-action="wechat"]{color:#75e89f}',
      '.standalone-share__button[data-share-action="weibo"]{color:#ff8c9a}',
      '.standalone-share__button[data-share-action="copy"]{color:#75e5ff}',
      '.standalone-share__modal{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:20px;background:rgba(0,0,0,.82)}',
      '.standalone-share__dialog{width:min(100%,320px);padding:24px;border:1px solid rgba(255,255,255,.18);border-radius:18px;background:#09101c;color:#edf7ff;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.55)}',
      '.standalone-share__dialog h3{margin:0 0 14px;font-size:18px}',
      '.standalone-share__dialog img{display:block;width:200px;height:200px;margin:0 auto 14px;padding:8px;border-radius:10px;background:#fff}',
      '.standalone-share__dialog p{margin:0 0 14px;color:#aab7c8;font-size:14px;line-height:1.6}',
      '@media(max-width:640px){.standalone-share{width:calc(100% - 24px);margin:32px auto 20px;padding:18px}.standalone-share__label{width:100%;margin-bottom:2px}.standalone-share__button{flex:1 1 calc(50% - 8px)}}'
    ].join('');
    document.head.appendChild(style);
  }

  function pageUrl() {
    var canonical = document.querySelector('link[rel="canonical"]');
    return canonical && canonical.href ? canonical.href : window.location.href.split('#')[0];
  }

  function pageDescription() {
    var meta = document.querySelector('meta[name="description"]');
    return meta && meta.content ? meta.content : '黑粉科技独立页面';
  }

  function openShare(url) {
    window.open(url, '_blank', 'width=640,height=520,noopener,noreferrer');
  }

  function copyText(text, button) {
    var done = function () {
      if (!button) return;
      var old = button.textContent;
      button.textContent = '✓ 已复制';
      window.setTimeout(function () { button.textContent = old; }, 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    var area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    try { document.execCommand('copy'); done(); } catch (error) {}
    document.body.removeChild(area);
  }

  function showWeChat(url, copyButton) {
    copyText(url, copyButton);
    var overlay = document.createElement('div');
    overlay.className = 'standalone-share__modal';
    overlay.innerHTML = '<div class="standalone-share__dialog" role="dialog" aria-modal="true" aria-label="微信分享"><h3>微信分享</h3><img alt="页面二维码"><p>微信扫码打开页面，链接也已经复制好了。</p><button type="button" class="standalone-share__button">关闭</button></div>';
    overlay.querySelector('img').src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(url);
    var close = function () { overlay.remove(); };
    overlay.addEventListener('click', function (event) { if (event.target === overlay) close(); });
    overlay.querySelector('button').addEventListener('click', close);
    document.body.appendChild(overlay);
  }

  roots.forEach(function (root) {
    var title = root.getAttribute('data-share-title') || document.title || '黑粉科技';
    var url = root.getAttribute('data-share-url') || pageUrl();
    var description = root.getAttribute('data-share-description') || pageDescription();
    var shareText = title + ' - 黑粉科技';
    root.className = (root.className ? root.className + ' ' : '') + 'standalone-share';
    root.innerHTML = '<div class="standalone-share__eyebrow">分享这个页面</div><p class="standalone-share__hint">觉得有用，就顺手递给下一个可能会踩坑的人。</p><div class="standalone-share__buttons"><span class="standalone-share__label">分享到：</span><button type="button" class="standalone-share__button" data-share-action="native">↗ 分享</button><button type="button" class="standalone-share__button" data-share-action="twitter">Twitter</button><button type="button" class="standalone-share__button" data-share-action="facebook">Facebook</button><button type="button" class="standalone-share__button" data-share-action="linkedin">LinkedIn</button><button type="button" class="standalone-share__button" data-share-action="wechat">微信</button><button type="button" class="standalone-share__button" data-share-action="weibo">微博</button><button type="button" class="standalone-share__button" data-share-action="qq">QQ</button><button type="button" class="standalone-share__button" data-share-action="qzone">QQ空间</button><button type="button" class="standalone-share__button" data-share-action="copy">⧉ 复制链接</button></div>';

    var nativeButton = root.querySelector('[data-share-action="native"]');
    if (!navigator.share) nativeButton.style.display = 'none';

    root.addEventListener('click', function (event) {
      var button = event.target.closest('[data-share-action]');
      if (!button) return;
      var action = button.getAttribute('data-share-action');
      if (action === 'native') {
        navigator.share({ title: shareText, text: description, url: url }).catch(function () {});
      } else if (action === 'twitter') {
        openShare('https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText) + '&url=' + encodeURIComponent(url));
      } else if (action === 'facebook') {
        openShare('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url));
      } else if (action === 'linkedin') {
        openShare('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url));
      } else if (action === 'wechat') {
        showWeChat(url, root.querySelector('[data-share-action="copy"]'));
      } else if (action === 'weibo') {
        openShare('https://service.weibo.com/share/share.php?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(shareText) + '&pic=' + encodeURIComponent(url));
      } else if (action === 'qq') {
        openShare('https://connect.qq.com/widget/shareqq/index.html?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(shareText) + '&summary=' + encodeURIComponent(description));
      } else if (action === 'qzone') {
        openShare('https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(shareText) + '&summary=' + encodeURIComponent(description));
      } else if (action === 'copy') {
        copyText(url, button);
      }
    });
  });
})();
