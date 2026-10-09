'use strict';

const SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
function nextScriptSource(attributes) {
  const source = attributes.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1] || '';
  return /^(?:https?:\/\/[^/]+)?\/_next\//.test(source) ? source : '';
}

// 保留框架原有的 defer / async 和执行顺序，只免除 CDN 对其二次延迟。
function protectNextScripts(html) {
  return html.replace(SCRIPT, (tag, attributes, body) => {
    if (!nextScriptSource(attributes)) return tag;
    const clean = attributes.replace(/\sdata-cfasync(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, '');
    return `<script data-cfasync="false"${clean}>${body}</script>`;
  });
}

function unprotectedNextScripts(html) {
  return [...html.matchAll(SCRIPT)].flatMap((match) => {
    const source = nextScriptSource(match[1]);
    return source && !/\bdata-cfasync\s*=\s*["']false["']/i.test(match[1]) ? [source] : [];
  });
}

module.exports = { protectNextScripts, unprotectedNextScripts };
