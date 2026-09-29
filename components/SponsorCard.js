// components/SponsorCard.js
// 文章底部的赞助卡片。
//
// 位置和形态的取舍：
// 1) 放在正文读完之后，不在开头、不做浮层、不做弹窗。赞助的转化不取决于曝光
//    次数，而取决于是否紧跟一次真实获得；进站就弹的窗口除了没用，还会让人记住
//    「这站烦」，代价远大于那点赞助。
// 2) 静态区块，没有关闭按钮——因为它本来就不挡路，给个关闭按钮反而是在暗示
//    「我挡着你了」。
// 3) 不追踪谁看了、谁扫了。赞助是单向的好意，不该换来一次行为记录。
//
// 移动端必须给另一条路径：手机读者看到的码就在自己屏幕上，没法用同一部手机扫。
// 桌面端「掏手机扫」天然成立，手机上只能先把图存下来再从相册选。不写清楚的话，
// 读者面对的是一个看起来能用、实际点不动的东西——那比打扰更伤体验。
// 两句提示都写进 DOM，用 CSS 媒体查询切换，而不是在 JS 里判断设备：
// 站点是静态导出，按设备改 DOM 会造成首屏与水合后不一致。

import { makeT } from '../lib/blog-i18n.cjs';

const QR_SRC = '/images/site/sponsor-wechat.png';

export default function SponsorCard({ lang }) {
  const t = makeT(lang);

  return (
    <section className="sponsor-card" aria-labelledby="sponsor-heading">
      <div className="sponsor-body">
        <h2 id="sponsor-heading" className="sponsor-heading">{t('如果这篇帮到你')}</h2>
        <p className="sponsor-text">
          {t('这个站没有广告，也不打算加。文章里的实测大多要真金白银买额度，或者占着机器跑上几个小时。觉得值就扫一下，不扫也照常更新。')}
        </p>
        <p className="sponsor-hint">
          <span className="sponsor-hint-desktop">{t('微信扫码')}</span>
          <span className="sponsor-hint-mobile">{t('长按保存图片，用微信「扫一扫」从相册选取')}</span>
        </p>
      </div>
      <img
        className="sponsor-qr"
        src={QR_SRC}
        alt={t('微信赞赏码')}
        width={558}
        height={555}
        loading="lazy"
        decoding="async"
      />
    </section>
  );
}
