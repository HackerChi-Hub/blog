const assert = require('assert');
const {
  buildProductCards,
  extractReleaseSummary,
} = require('../lib/product-catalog.cjs');

async function main() {
  const releases = {
    'localbrain-releases': {
      tag_name: 'v1.2.28',
      published_at: '2026-09-01T06:28:08Z',
      html_url: 'https://example.test/localbrain/v1.2.28',
      body: '修复长文件工具调用边界失败；新增隐藏暂存事务，未提交时自动回滚。',
    },
    'hyphenbox-release': {
      tag_name: 'v0.4.57',
      published_at: '2026-09-01T02:28:59Z',
      html_url: 'https://example.test/hyphenbox/v0.4.57',
      body: '# 黑粉盒子 HyphenBox\n\n**初步构建 · 预览版。** 免费大模型 API 雷达 + 本地统一路由，Key 只存系统安全存储。\n\n## 下载哪一个\n\n- macOS 安装包',
    },
    'HyphenCut-Releases': {
      tag_name: 'v1.8.7',
      published_at: '2026-08-31T01:12:47Z',
      html_url: 'https://example.test/hyphencut/v1.8.7',
      body: '# 黑粉剪辑 HyphenCut 1.8.7\n\n**本版修复删剪失败，预览与桌面从此共用同一台引擎。**\n\n## 下载\n\n- 安装说明',
    },
    // 黑粉录屏只发过预览版：/releases/latest 会把它当不存在（404）。
    // 这里故意只给 prerelease，外加一条草稿，确保目录取的是「已发布的第一条」而不是草稿。
    'HyphenScreen-Releases': [
      { tag_name: 'v0.4.17', draft: true, prerelease: true, published_at: null, html_url: 'https://example.test/hyphenscreen/draft', body: '草稿不许出现在产品卡上。' },
      {
        tag_name: 'v0.4.16',
        draft: false,
        prerelease: true,
        published_at: '2026-09-16T00:25:17Z',
        html_url: 'https://example.test/hyphenscreen/v0.4.16',
        body: '# 黑粉录屏 0.4.16 · 预览版\n\n这一版第一次提供 Windows 和 Linux 安装包，功能与 Mac 版同源。\n\n## 下载\n\n- macOS 安装包',
      },
    ],
    'screenlex-download': {
      tag_name: 'v1.0.1',
      published_at: '2026-08-16T04:00:58Z',
      html_url: 'https://example.test/screenlex/v1.0.1',
      body: 'ScreenLex 1.0.1\n\n- 修复设置窗口按钮文字被挤成竖排。\n- 本地模型入口统一迁移到 LocalBrain。',
    },
  };

  const fetchImpl = async (url) => {
    const key = Object.keys(releases).find((candidate) => url.includes(candidate));
    if (!key) return { ok: false, status: 404, json: async () => ({}) };
    const value = releases[key];
    const list = Array.isArray(value) ? value : [value];
    // 照 GitHub 的真实语义应答，否则这个替身证明不了任何事：
    // /releases/latest 只认「非草稿且非 prerelease」的最新一条，没有就 404；
    // /releases 返回全部（含 prerelease 与草稿）。替身糊在一起，就抓不住用错端点。
    if (/\/releases\/latest(\?|$)/.test(url)) {
      const stable = list.find((item) => item && !item.draft && !item.prerelease);
      if (!stable) return { ok: false, status: 404, json: async () => ({ message: 'Not Found' }) };
      return { ok: true, status: 200, json: async () => stable };
    }
    return { ok: true, status: 200, json: async () => list };
  };

  const posts = [
    {
      slug: 'localbrain-local-ai-box',
      updated: '2026-08-30',
      summary: '文章摘要兜底。',
    },
  ];

  const cards = await buildProductCards(posts, { fetchImpl, token: '' });
  assert.deepStrictEqual(cards.map((card) => card.name), [
    '方寸智匣 LocalBrain',
    '黑粉盒子 HyphenBox',
    '黑粉剪辑 HyphenCut',
    '光影词库 ScreenLex',
    '黑粉录屏 HyphenScreen',
  ]);
  assert.strictEqual(cards[0].version, '1.2.28');
  assert.strictEqual(cards[0].updated, '2026-09-01');
  assert.match(cards[0].description, /隐藏暂存事务/);
  assert.match(cards[1].description, /免费大模型 API 雷达/);
  assert.doesNotMatch(cards[1].description, /macOS 安装包/);
  assert.match(cards[2].description, /共用同一台引擎/);
  assert.match(cards[3].description, /按钮文字被挤成竖排/);
  assert.match(cards[3].description, /LocalBrain/);
  assert.strictEqual(cards[3].updated, '2026-08-16');
  // 预览版产品必须照样拿到版本与日期：用 /releases/latest 的写法会在这里退回文章兜底
  assert.strictEqual(cards[4].version, '0.4.16');
  assert.strictEqual(cards[4].updated, '2026-09-16');
  assert.strictEqual(cards[4].source, 'release');
  assert.match(cards[4].description, /Windows 和 Linux 安装包/);
  assert.doesNotMatch(cards[4].description, /草稿/);

  const fallbackCards = await buildProductCards(posts, {
    fetchImpl: async () => ({ ok: false, status: 503, json: async () => ({}) }),
    token: '',
  });
  assert.strictEqual(fallbackCards[0].description, '文章摘要兜底。');
  assert.strictEqual(fallbackCards[0].source, 'article');
  assert.strictEqual(fallbackCards[1].source, 'fallback');

  assert.strictEqual(
    extractReleaseSummary('ScreenLex 1.0.1\n\n- 修复按钮。\n- 新增复习模式。'),
    '修复按钮；新增复习模式。'
  );

  console.log('✅ 产品目录测试通过：中英命名、Release 摘要、预览版不被 latest 端点漏掉、版本日期与离线回退');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
