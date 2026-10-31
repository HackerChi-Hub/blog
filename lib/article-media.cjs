'use strict';
const fs = require('node:fs');
const path = require('node:path');
const manifestPath = path.join(process.cwd(),'lib/article-media.generated.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath,'utf8')) : {};
function mediaFor(src) {
  const local = src.replace(/^https:\/\/(?:www\.)?hyphentech\.top(?=\/)/i,'').split(/[?#]/)[0];
  return manifest[local];
}
module.exports = { mediaFor };
