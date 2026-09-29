// lib/blog-i18n.cjs
// 文章页的界面文字（分类、标签、分享、留言、阅读时长、提示框标题……）按文章语言显示，
// 语言取 frontmatter 的 lang：zh-CN（默认）/ zh-TW / en。
//
// 键是简体原文、值是译文——和 LocalBrain 界面词典同一个办法：原文一改，查表就查不到，
// scripts/test-blog-i18n.js 会把它报出来，而不是让英文页悄悄混进一句简体。运行时查不到
// 就退回原文：页面不崩，把关交给测试和 verify-export。
//
// 同一句简体在两处意思不同时，键写成「原文::场景」：简体只显示 :: 前面的部分。
// （不用 #：「正在回复 #{id}」这类原文本身就带 #。）
//
// CommonJS：Next 页面和 node 脚本（测试、verify-export）共用同一份。

const UI_LANGS = ['zh-CN', 'zh-TW', 'en'];
const DEFAULT_LANG = 'zh-CN';
// 语言名一律用各自语言写（语言切换条、相关文章的语言提示），不翻译。
const LANG_NAMES = { 'zh-CN': '简体中文', 'zh-TW': '繁體中文', en: 'English' };

// Obsidian 提示框类型 → 简体标题。译文同样走下面的词典。
const CALLOUT_LABELS = {
  note: '提示',
  abstract: '摘要',
  summary: '摘要',
  info: '信息',
  todo: '待办',
  tip: '建议',
  hint: '建议',
  important: '重点',
  success: '完成',
  check: '完成',
  question: '问题',
  help: '帮助',
  warning: '警告',
  caution: '注意',
  failure: '失败',
  danger: '危险',
  bug: '问题',
  example: '示例',
  quote: '引用',
};

// 留言服务（workers/comments）会原样返回的错误。其余错误在非简体页换成通用提示。
const COMMENT_SERVER_ERRORS = [
  '请填个昵称',
  '留言内容是空的',
  '人机校验没通过，刷新页面再试一次',
  '请求格式不正确',
  '文章标识不合法',
  '回复目标不合法',
];

const TRANSLATIONS = {
  'zh-TW': {
    // 文章页
    '分类：': '分類：',
    '标签：': '標籤：',
    '返回首页': '返回首頁',
    '黑粉科技宣传语': '黑粉科技宣傳語',
    '黑粉科技': '黑粉科技',
    '黑粉科技 · 官网': '黑粉科技 · 官網',
    '让AI成为你的超能力': '讓AI成為你的超能力',
    '本地部署 / 免费白嫖 / 自制软件': '本機部署 / 免費白嫖 / 自製軟體',
    // 阅读时长
    '不到 1 分钟': '不到 1 分鐘',
    '{n} 分钟': '{n} 分鐘',
    '{h} 小时': '{h} 小時',
    '{h} 小时 {m} 分钟': '{h} 小時 {m} 分鐘',
    // 相关文章
    '相关文章': '相關文章',
    // 分享
    '分享到：': '分享到：',
    '分享': '分享',
    '微信': '微信',
    '微博': '微博',
    'QQ空间': 'QQ空間',
    '已复制': '已複製',
    '复制链接': '複製連結',
    '微信分享': '微信分享',
    '二维码': 'QR 碼',
    '使用微信扫描二维码打开文章': '使用微信掃描 QR 碼開啟文章',
    '链接已复制到剪贴板': '連結已複製到剪貼簿',
    '关闭': '關閉',
    '请点击右上角菜单，选择"发送给朋友"或"分享到朋友圈"': '請點選右上角選單，選擇「傳送給朋友」或「分享到朋友圈」',
    // 留言
    '留言': '留言',
    '留言::label': '留言',
    '刚刚': '剛剛',
    '{n} 分钟前': '{n} 分鐘前',
    '{n} 小时前': '{n} 小時前',
    '取消回复': '取消回覆',
    '回复': '回覆',
    '正在回复 #{id}': '正在回覆 #{id}',
    '取消': '取消',
    '昵称': '暱稱',
    '怎么称呼你': '怎麼稱呼你',
    '说点什么': '說點什麼',
    '发送中…': '傳送中…',
    '发表': '發表',
    '正在加载留言…': '正在載入留言…',
    '留言没加载出来。': '留言沒載入出來。',
    '重试': '重試',
    '如果这篇帮到你': '如果這篇幫到你',
    '这个站没有广告，也不打算加。文章里的实测大多要真金白银买额度，或者占着机器跑上几个小时。觉得值就扫一下，不扫也照常更新。': '這個站沒有廣告，也不打算加。文章裡的實測大多要真金白銀買額度，或者佔著機器跑上幾個小時。覺得值就掃一下，不掃也照常更新。',
    '微信扫码': '微信掃碼',
    '长按保存图片，用微信「扫一扫」从相册选取': '長按儲存圖片，用微信「掃一掃」從相簿選取',
    '微信赞赏码': '微信讚賞碼',
    '还没有人留言，来坐第一个。': '還沒有人留言，來坐第一個。',
    '人机校验还没完成，稍等一下再发': '人機驗證還沒完成，稍等一下再發',
    '发送失败，稍后再试': '傳送失敗，稍後再試',
    '发出去了': '送出了',
    '网络没连上，检查一下再试': '網路沒連上，檢查一下再試',
    '请填个昵称': '請填個暱稱',
    '留言内容是空的': '留言內容是空的',
    '人机校验没通过，刷新页面再试一次': '人機驗證沒通過，重新整理頁面再試一次',
    '请求格式不正确': '請求格式不正確',
    '文章标识不合法': '文章識別碼不合法',
    '回复目标不合法': '回覆目標不合法',
    // 提示框标题
    '提示': '提示',
    '摘要': '摘要',
    '信息': '資訊',
    '待办': '待辦',
    '建议': '建議',
    '重点': '重點',
    '完成': '完成',
    '问题': '問題',
    '帮助': '說明',
    '警告': '警告',
    '注意': '注意',
    '失败': '失敗',
    '危险': '危險',
    '示例': '範例',
    '引用': '引用',
    '{label}：{title}': '{label}：{title}',
  },
  en: {
    '分类：': 'Categories:',
    '标签：': 'Tags:',
    '返回首页': 'Back to home',
    '黑粉科技宣传语': 'HyphenTech slogan',
    '黑粉科技': 'HyphenTech',
    '黑粉科技 · 官网': 'HyphenTech',
    '让AI成为你的超能力': 'Make AI your superpower',
    '本地部署 / 免费白嫖 / 自制软件': 'Local deployment / Free resources / Self-made software',
    '不到 1 分钟': 'Under 1 min read',
    '{n} 分钟': '{n} min read',
    '{h} 小时': '{h} hr read',
    '{h} 小时 {m} 分钟': '{h} hr {m} min read',
    '相关文章': 'Related posts',
    '分享到：': 'Share:',
    '分享': 'Share',
    '微信': 'WeChat',
    '微博': 'Weibo',
    'QQ空间': 'Qzone',
    '已复制': 'Copied',
    '复制链接': 'Copy link',
    '微信分享': 'Share on WeChat',
    '二维码': 'QR code',
    '使用微信扫描二维码打开文章': 'Scan the QR code with WeChat to open this article',
    '链接已复制到剪贴板': 'Link copied to clipboard',
    '关闭': 'Close',
    '请点击右上角菜单，选择"发送给朋友"或"分享到朋友圈"': 'Tap the menu in the top-right corner and choose "Send to Chat" or "Share to Moments".',
    '留言': 'Comments',
    '留言::label': 'Comment',
    '刚刚': 'just now',
    '{n} 分钟前': '{n} min ago',
    '{n} 小时前': '{n} hr ago',
    '取消回复': 'Cancel reply',
    '回复': 'Reply',
    '正在回复 #{id}': 'Replying to #{id}',
    '取消': 'Cancel',
    '昵称': 'Nickname',
    '怎么称呼你': 'What should we call you?',
    '说点什么': 'Say something',
    '发送中…': 'Sending…',
    '发表': 'Post',
    '正在加载留言…': 'Loading comments…',
    '留言没加载出来。': "Comments didn't load.",
    '重试': 'Retry',
    '如果这篇帮到你': 'If this helped',
    '这个站没有广告，也不打算加。文章里的实测大多要真金白银买额度，或者占着机器跑上几个小时。觉得值就扫一下，不扫也照常更新。': "No ads here, and none planned. The tests in these posts mostly cost real money in API credits, or tie up a machine for hours. Scan it if you think it was worth something — either way the posts keep coming.",
    '微信扫码': 'Scan with WeChat',
    '长按保存图片，用微信「扫一扫」从相册选取': 'Press and hold to save the image, then open it from your album in WeChat Scan',
    '微信赞赏码': 'WeChat tip jar QR code',
    '还没有人留言，来坐第一个。': 'No comments yet. Be the first.',
    '人机校验还没完成，稍等一下再发': "The human check hasn't finished yet. Wait a moment and try again.",
    '发送失败，稍后再试': 'Sending failed. Try again later.',
    '发出去了': 'Posted.',
    '网络没连上，检查一下再试': "Couldn't reach the network. Check your connection and try again.",
    '请填个昵称': 'Please enter a nickname.',
    '留言内容是空的': 'The comment is empty.',
    '人机校验没通过，刷新页面再试一次': 'The human check failed. Refresh the page and try again.',
    '请求格式不正确': 'The request was malformed.',
    '文章标识不合法': 'Invalid article ID.',
    '回复目标不合法': 'Invalid reply target.',
    '提示': 'Note',
    '摘要': 'Summary',
    '信息': 'Info',
    '待办': 'To do',
    '建议': 'Tip',
    '重点': 'Important',
    '完成': 'Done',
    '问题': 'Question',
    '帮助': 'Help',
    '警告': 'Warning',
    '注意': 'Caution',
    '失败': 'Failure',
    '危险': 'Danger',
    '示例': 'Example',
    '引用': 'Quote',
    '{label}：{title}': '{label}: {title}',
  },
};

const DATE_FORMATS = {
  'zh-CN': ['zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }],
  'zh-TW': ['zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }],
  en: ['en-US', { year: 'numeric', month: 'short', day: 'numeric' }],
};

const OG_LOCALES = { 'zh-CN': 'zh_CN', 'zh-TW': 'zh_TW', en: 'en_US' };

function normalizeUiLang(lang) {
  return UI_LANGS.includes(lang) ? lang : DEFAULT_LANG;
}

function fill(template, values) {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match
  );
}

/** 按语言取翻译函数：t(简体原文, {占位值})。简体原样返回（去掉「::场景」后缀）。 */
function makeT(lang) {
  const uiLang = normalizeUiLang(lang);
  const table = TRANSLATIONS[uiLang] || null;
  const t = (source, values) => {
    const translated = table && Object.prototype.hasOwnProperty.call(table, source) ? table[source] : null;
    return fill(translated ?? String(source).split('::')[0], values);
  };
  t.has = (source) => !table || Object.prototype.hasOwnProperty.call(table, source);
  t.lang = uiLang;
  return t;
}

function formatDateFor(dateString, lang) {
  if (!dateString) return '';
  const [locale, options] = DATE_FORMATS[normalizeUiLang(lang)];
  try {
    return new Intl.DateTimeFormat(locale, options).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

module.exports = {
  UI_LANGS,
  DEFAULT_LANG,
  LANG_NAMES,
  CALLOUT_LABELS,
  COMMENT_SERVER_ERRORS,
  TRANSLATIONS,
  OG_LOCALES,
  normalizeUiLang,
  makeT,
  formatDateFor,
};
