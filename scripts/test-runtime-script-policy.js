const assert = require('node:assert/strict');
const { protectNextScripts, unprotectedNextScripts } = require('../lib/runtime-script-policy.cjs');

const html = '<script src="/_next/main.js" defer=""></script>' +
  '<script async src="https://hyphentech.top/_next/page.js" data-cfasync="true">console.log(1)</script>' +
  '<script id="__NEXT_DATA__" type="application/json">{"text":"保留数据"}</script>' +
  '<script src="https://example.com/analytics.js" defer></script>' +
  '<script data-cfasync="false">var lang="zh";</script>';
assert.equal(unprotectedNextScripts(html).length, 2);
const protectedHtml = protectNextScripts(html);
assert.deepEqual(unprotectedNextScripts(protectedHtml), []);
assert.equal(protectNextScripts(protectedHtml), protectedHtml);
assert.ok(protectedHtml.includes('<script data-cfasync="false" src="/_next/main.js" defer="">'));
assert.ok(protectedHtml.includes('async src="https://hyphentech.top/_next/page.js">console.log(1)'));
assert.ok(protectedHtml.includes('<script id="__NEXT_DATA__" type="application/json">{"text":"保留数据"}</script>'));
assert.ok(protectedHtml.includes('<script src="https://example.com/analytics.js" defer></script>'));
assert.ok(protectedHtml.includes('<script data-cfasync="false">var lang="zh";</script>'));
console.log('✅ 交互脚本回归通过：完整依赖链、原执行顺序、JSON 与外部脚本不变、重复构建幂等');
