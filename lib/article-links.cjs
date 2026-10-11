// 同一规范用于原件审计和网页兜底；不联网、不改目标地址、不处理命令示例。
const MarkdownIt = require('markdown-it');
const parser = new MarkdownIt({ linkify: true });
const { PRODUCT_DEFINITIONS } = require('./product-catalog.cjs');
const PRODUCTS = Object.fromEntries(PRODUCT_DEFINITIONS.map(product =>
  [product.releaseRepo.split('/')[1].toLowerCase(), product.name]));
function isEndpoint(url) {
  try {
    const u = new URL(url);
    const local = u.hostname === 'localhost' || u.hostname === '[::1]'
      || /^(?:127|10)\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(u.hostname)
      || /^192\.168\.(?:\d{1,3}|x)\.(?:\d{1,3}|x)$/i.test(u.hostname) || u.hostname === '0.0.0.0'
      || /^172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(u.hostname)
      || /\.(?:local|lan)$/i.test(u.hostname);
    if (local || /[{}\\`]/.test(url)) return true;
    // API 域名上的文档、定价、控制台和下载页仍是网页入口，不能一律当配置地址。
    if (/\/(?:docs?|guide|reference|pricing|dashboard|console|downloads?)(?:\/|$)/i.test(u.pathname)
      || /\.(?:zip|dmg|exe|msi|pkg|pdf|gguf|safetensors)$/i.test(u.pathname)) return false;
    return /^(api[.-]|apihub\.|api-inference\.|integrate\.api\.|router\.)/i.test(u.hostname)
      || /\/(?:api\/v\d|v\d(?:beta)?(?:\/|$)|compatible-mode\/v\d|openai\/v\d)/i.test(u.pathname);
  } catch { return true; }
}
function labelFor(url, lang = 'zh-CN') {
  const u = new URL(url), parts = u.pathname.split('/').filter(Boolean);
  const en = lang === 'en', tw = lang === 'zh-TW';
  const word = (cn, traditional, english) => en ? english : tw ? traditional : cn;
  let tail = parts.at(-1) || u.hostname;
  try { tail = decodeURIComponent(tail); } catch {}
  tail = tail.replace(/[\[\]|\n]/g, ' ');
  if (/\.(zip|txt|pdf|dmg|exe|msi|7z|tar\.gz|gguf|safetensors)$/i.test(u.pathname)) {
    return `${word('下载', '下載', 'Download')} ${tail}`;
  }
  if (u.hostname === 'github.com' && parts.length >= 2) {
    let name = PRODUCTS[parts[1].toLowerCase()] || `${parts[0]}/${parts[1]}`;
    if (en && PRODUCTS[parts[1].toLowerCase()]) name = name.split(' ').at(-1);
    if (parts.includes('releases')) return en ? `Downloads & updates: ${name} (releases)` : `${word('下载与更新', '下載與更新', 'Downloads & updates')}：${name}（${word('发行页', '發行頁', 'releases')}）`;
    if (parts.includes('blob')) return `${name} · ${tail}`;
    return `${word('项目仓库', '專案倉庫', 'Repository')}：${name}`;
  }
  if (u.hostname === 'hyphentech.top' && !parts.length) return word('访问黑粉科技官网', '造訪黑粉科技官網', 'Visit HyphenTech');
  if (isEndpoint(url)) return url; // 配置地址仍完整展示，不能伪装成下载网页。
  const purpose = /pricing|price/i.test(u.pathname) ? word('价格说明', '價格說明', 'Pricing')
    : /LICENSE/i.test(u.pathname) ? word('许可说明', '授權說明', 'License')
    : /docs|guide/i.test(u.hostname + u.pathname) ? word('文档', '文件', 'Documentation')
    : /token|apikey/i.test(u.pathname) ? word('密钥管理', '金鑰管理', 'Key management')
    : word('查看页面', '查看頁面', 'View page');
  return `${purpose}：${u.hostname}${parts.length ? ` · ${tail}` : ''}`;
}
function normalizeReadableLinks(source, { lang = 'zh-CN' } = {}) {
  let fence = null;
  return String(source).split('\n').map(line => {
    const marker = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
      return line;
    }
    if (fence || /^(?: {4}|\t)|^\s*<!--|^\s*\[[^\]]+\]:/.test(line)) return line;
    const protectedRanges = [];
    const edits = [];
    // 已有链接与图片保持目标不变；只补充已知产品的模糊下载标签。
    const links = /!?\[([^\]\n]*)\]\((?:<[^>\n]*>|(?:\\.|[^)\n])*)\)/g;
    for (const m of line.matchAll(links)) {
      protectedRanges.push([m.index, m.index + m[0].length]);
      if (m[0][0] === '!') continue;
      const dest = m[0].slice(m[0].indexOf('](') + 2, -1).replace(/^<|>$/g, '');
      if (/^(下载与更新|下載與更新|Downloads & updates)$/i.test(m[1]) && /^https?:\/\//.test(dest)) {
        edits.push([m.index, m.index + m[0].length, `[${labelFor(dest, lang)}](<${dest}>)`]);
      }
    }
    for (const m of line.matchAll(/(`+)([^`\n]*?)\1/g)) {
      if (protectedRanges.some(([a,b]) => m.index >= a && m.index < b)) continue;
      protectedRanges.push([m.index, m.index + m[0].length]);
      if (/^https?:\/\/\S+$/.test(m[2]) && !isEndpoint(m[2])) {
        edits.push([m.index, m.index + m[0].length, `[${labelFor(m[2], lang)}](<${m[2]}>)`]);
      }
    }
    for (const m of parser.linkify.match(line) || []) {
      if (!/^https?:\/\//.test(m.raw) || protectedRanges.some(([a,b]) => m.index < b && m.lastIndex > a)) continue;
      const url = m.raw;
      if (isEndpoint(url) && /[{}\\`]|localhost|127\.0\.0\.1|192\.168\./.test(url)) {
        edits.push([m.index, m.lastIndex, '`' + url + '`']);
        continue;
      }
      // 显式 <url> 自动链接的尖括号一起替换；目标文字不做重编码。
      const a = line[m.index - 1] === '<' ? m.index - 1 : m.index;
      const b = a < m.index && line[m.lastIndex] === '>' ? m.lastIndex + 1 : m.lastIndex;
      edits.push([a, b, `[${labelFor(url, lang)}](<${url}>)`]);
    }
    return edits.sort((a,b) => b[0]-a[0]).reduce((text,[a,b,replacement]) => text.slice(0,a)+replacement+text.slice(b),line);
  }).join('\n');
}
module.exports = { normalizeReadableLinks, labelFor, isEndpoint };
