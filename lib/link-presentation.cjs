// 渲染层兜底；只处理阅读入口，不改命令、截图和原件。
const { labelFor } = require('./article-links.cjs');
const urlOnly = (s) => /^https?:\/\/\S+$/i.test(s) && (() => {
  try { return ['http:', 'https:'].includes(new URL(s).protocol); } catch { return false; }
})();
function installArticleLinks(md) {
  md.core.ruler.after('linkify', 'resource_link_presentation', (state) => {
    for (const block of state.tokens) {
      if (!block.children) continue;
      const result = [];
      let depth = 0;
      for (const t of block.children) {
        if (t.type === 'link_open') depth++;
        if (!depth && t.type === 'code_inline' && urlOnly(t.content) && md.validateLink(t.content)) {
          const a = new state.Token('link_open', 'a', 1);
          a.attrSet('href', md.normalizeLink(t.content));
          const text = new state.Token('text', '', 0); text.content = t.content;
          result.push(a, text, new state.Token('link_close', 'a', -1));
        } else result.push(t);
        if (t.type === 'link_close') depth--;
      }
      block.children = result;
      for (let i = 0; i < result.length; i++) {
        const t = result[i], href = t.attrGet('href') || '';
        if (t.type !== 'link_open' || !/^https?:\/\//i.test(href)) continue;
        const lang = state.env.lang || 'zh-CN';
        t.attrJoin('class', 'resource-link');
        t.attrSet('target', '_blank'); t.attrSet('rel', 'noopener noreferrer');
        const isDownload = /\.(?:zip|dmg|pkg|exe|msi|pdf|gguf|safetensors)(?:[?#]|$)|\/releases(?:\/|$)/i.test(href);
        t.attrSet('data-link-kind', isDownload ? 'download' : 'website');
        t.attrSet('title', `${lang === 'en' ? 'Opens in a new tab' : lang === 'zh-TW' ? '在新視窗開啟' : '在新窗口打开'} · ${href}`);
        const label = result[i + 1];
        if (label && ['text', 'code_inline'].includes(label.type) && result[i + 2]?.type === 'link_close'
          && ([href, md.normalizeLinkText(href), href.replace(/^https?:\/\//i, '')].includes(label.content)
            || /^(下载(?:与更新)?|下載(?:與更新)?|点击这里|點擊這裡|click here|downloads?(?: & updates)?)$/i.test(label.content))) {
          label.type = 'text'; label.tag = ''; label.content = labelFor(href, lang);
        }
      }
    }
  });
  const fence = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens, index, options, env, self) => {
    const lines = tokens[index].content.trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    if (lines.length && lines.every(s => urlOnly(s) && md.validateLink(s))) {
      const escape = md.utils.escapeHtml;
      return `<div class="resource-links">${lines.map(url => {
        const href = md.normalizeLink(url), label = labelFor(url, env.lang);
        return `<p><a class="resource-link" href="${escape(href)}" target="_blank" rel="noopener noreferrer">${escape(label)}</a></p>`;
      }).join('')}</div>\n`;
    }
    return fence(tokens, index, options, env, self);
  };
}
function auditHtmlLinks(html) {
  const stack = [], failures = [];
  let links = 0, downloads = 0;
  for (const match of html.matchAll(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi)) {
    const lines = match[1].replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    if (lines.length && lines.every(urlOnly)) failures.push('只有网址的代码块不可点击，应改成明确的网页入口');
  }
  for (const part of html.match(/<!--[\s\S]*?-->|<[^>]*>|[^<]+/g) || []) {
    if (part.startsWith('<!--')) continue;
    if (part.startsWith('<')) {
      const m = part.match(/^<\s*(\/?)\s*([\w:-]+)/); if (!m) continue;
      const tag = m[2].toLowerCase();
      if (m[1]) { const i = stack.findLastIndex(s => s.split(':')[0] === tag); if (i >= 0) stack.splice(i); }
      else {
        if (tag === 'a') { links++; if (/data-link-kind="download"/.test(part)) downloads++; }
        if (!/^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/.test(tag) && !/\/\s*>$/.test(part)) {
          stack.push(/\bclass="[^"]*\bcode-pre\b/.test(part) ? `${tag}:code-example` : tag);
        }
      }
    } else if (!stack.some(s => ['a', 'script', 'style', 'pre', 'textarea'].includes(s) || s.endsWith(':code-example'))) {
      // 行内安装命令/配置串不是网页入口；单独的网址仍必须可点。
      if (stack.includes('code') && !urlOnly(part.trim())) continue;
      for (const url of part.match(/(?:https?:\/\/|www\.)[^\s<>]+/gi) || []) failures.push(`不可点击的可见网址：${url}`);
    }
  }
  return { links, downloads, failures };
}
module.exports = { installArticleLinks, auditHtmlLinks };
