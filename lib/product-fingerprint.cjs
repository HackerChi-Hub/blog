'use strict';
const { createHash } = require('crypto');

// 核验时间不是内容变更；对象键顺序也不影响同一份发行内容的指纹。
function canonicalContent(value) {
  if (Array.isArray(value)) return value.map(canonicalContent);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort()
    .filter((key) => !['checkedAt', 'revision', 'contentHash'].includes(key) && value[key] !== undefined)
    .map((key) => [key, canonicalContent(value[key])]));
}

function fingerprint(value) {
  return createHash('sha256').update(JSON.stringify(canonicalContent(value))).digest('hex');
}

module.exports = { canonicalContent, fingerprint };
