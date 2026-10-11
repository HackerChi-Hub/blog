#!/usr/bin/env node
const fs = require('fs'), path = require('path'), matter = require('gray-matter');
const { normalizeReadableLinks } = require('../lib/article-links.cjs');
const args = process.argv.slice(2);
const root = path.resolve(args.includes('--content-dir') ? args[args.indexOf('--content-dir')+1] : '../blog-content');
const files = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir,{withFileTypes:true})) {
    const p = path.join(dir,e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.md$/.test(e.name) && !/\.(bak|backup)\.md$/.test(e.name)) files.push(p);
  }
}
walk(path.join(root,'posts'));
if (fs.existsSync(path.join(root,'templates'))) walk(path.join(root,'templates'));
const offset = args.includes('--offset') ? Number(args[args.indexOf('--offset')+1]) : 0;
const limit = args.includes('--limit') ? Number(args[args.indexOf('--limit')+1]) : files.length;
const report = [], patch = ['*** Begin Patch'];
for (const file of files.sort().slice(offset,offset+limit)) {
  const raw = fs.readFileSync(file,'utf8'), parsed = matter(raw);
  const body = normalizeReadableLinks(parsed.content,{lang:parsed.data.lang||'zh-CN'});
  const next = raw.slice(0,raw.length-parsed.content.length)+body;
  if (raw === next) continue;
  const before = raw.split('\n'), after = next.split('\n');
  if (before.length !== after.length) throw new Error('行数不应变化：'+file);
  const changes = [];
  patch.push('*** Update File: '+file);
  for (let i=0;i<before.length;i++) if(before[i]!==after[i]) {
    patch.push('@@','-'+before[i],'+'+after[i]);
    changes.push({line:i+1,before:before[i],after:after[i]});
  }
  report.push({file:path.relative(root,file),title:parsed.data.title||'',status:parsed.data.status||'template',changes});
}
patch.push('*** End Patch');
const result = {scanned:files.length,affected:report.length,changedLines:report.reduce((n,r)=>n+r.changes.length,0),report};
if(args.includes('--patch')) result.patch=patch.join('\n');
console.log(JSON.stringify(result));
if (args.includes('--check') && report.length) process.exitCode=1;
