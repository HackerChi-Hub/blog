'use strict';

// 私有原件保留 Obsidian 固定页尾；网页只替换严格识别出的脚本页尾，正文与历史实测不改。
function splitProductFooter(source) {
  const text = String(source || '');
  const marked = text.match(/<!-- HFKJ_FIXED_FOOTER_START[^]*?<!-- HFKJ_FIXED_FOOTER_END -->\s*$/);
  if (marked) return { body: text.slice(0, marked.index).trimEnd(), managed: true };

  // 公开快照已去除内部注释，识别完整的固定结构；单独同名标题不算脚本页尾。
  const heading = /(?:^|\n)## 🧰 (?:我做的工具|Tools I build)\s*\n/g;
  let match;
  while ((match = heading.exec(text))) {
    const tail = text.slice(match.index);
    const repos = [...tail.matchAll(/https:\/\/github\.com\/HackerChi-Hub\/(?:hyphenbox-release|localbrain-releases|screenlex-download|HyphenScreen-Releases)\/releases/g)];
    if (new Set(repos.map((item) => item[0])).size !== 4) continue;
    const signedFooter = /> \[!quote\] (?:黑粉科技|HyphenTech)/.test(tail) &&
      /\]\(<?https:\/\/hyphentech\.top\/?>?\)\s*$/.test(tail);
    const legacyOfficialFooter = tail.includes('这些工具都由我持续维护。预览版会明确标注，下载、更新和已知边界以发行页为准。') &&
      ['黑粉盒子 HyphenBox', '方寸智匣 LocalBrain', 'ScreenLex 光影词库', '黑粉录屏 HyphenScreen'].every((name) => tail.includes(`### ${name}\n`)) &&
      /\]\(<?https:\/\/github\.com\/HackerChi-Hub\/HyphenScreen-Releases\/releases>?\)\s*$/.test(tail);
    if (!signedFooter && !legacyOfficialFooter) continue;
    return { body: text.slice(0, match.index).replace(/\n---\s*$/, '').trimEnd(), managed: true };
  }
  return { body: text, managed: false };
}

module.exports = { splitProductFooter };
