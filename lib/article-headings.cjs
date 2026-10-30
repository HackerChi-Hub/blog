'use strict';
// 页面已经有文章主标题；只去掉正文开头完全同名的重复标题，保留其他文字与锚点。
function normalizeArticleHeadings(tokens, title) {
  const normalized = text => String(text || '').normalize('NFKC').replace(/\s+/g,' ').trim();
  const first = tokens[0];
  const inline = tokens[1];
  const text = inline?.children?.filter(item => ['text','code_inline'].includes(item.type)).map(item => item.content).join('') || inline?.content;
  if (first?.type === 'heading_open' && first.tag === 'h1' && tokens[2]?.type === 'heading_close' && normalized(text) === normalized(title)) tokens.splice(0,3);
  // 原件中其他一级标题是文章内部章节；整体降一级，保持相对层次，不动原件。
  if (tokens.some(token => token.type === 'heading_open' && token.tag === 'h1')) {
    for (const token of tokens) if (['heading_open','heading_close'].includes(token.type) && /^h[1-6]$/.test(token.tag)) token.tag = `h${Math.min(6,Number(token.tag[1])+1)}`;
  }
  return tokens;
}
module.exports = { normalizeArticleHeadings };
