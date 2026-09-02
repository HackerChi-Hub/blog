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
    return { ok: true, status: 200, json: async () => releases[key] };
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

  console.log('✅ 产品目录测试通过：中英命名、Release 摘要、版本日期与离线回退');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
