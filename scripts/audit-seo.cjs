#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const decode = value => String(value || '').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
function attrs(tag) { return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(m=>[m[1].toLowerCase(),decode(m[2]??m[3])])); }
function auditHtml(html, url, exists) {
  const errors=[], warnings=[];
  const title=decode(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]).trim();
  const tags=[...html.matchAll(/<(?:meta|link)\b[^>]*>/gi)].map(m=>attrs(m[0]));
  const description=tags.find(t=>t.name==='description')?.content?.trim();
  const canonical=tags.find(t=>t.rel==='canonical')?.href;
  const noindex=tags.some(t=>t.name==='robots'&&t.content?.includes('noindex'));
  if (!title) errors.push('缺少页面标题');
  if (!description) errors.push('缺少页面摘要');
  if (!canonical || !/^https:\/\/hyphentech\.top(?:\/|$)/.test(canonical)) errors.push('缺少有效官网规范地址');
  if (canonical && exists) {
    try { if (!exists(new URL(canonical).pathname)) errors.push('规范地址指向不存在的导出页面'); }
    catch { errors.push('规范地址无法解析'); }
  }
  if ((html.match(/<h1\b/gi)||[]).length !== 1) warnings.push('主标题数量不是1，需人工核对');
  if (title.length>90) warnings.push('标题偏长，可能截断；不自动改写文章标题');
  for (const match of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const structured=JSON.parse(match[1]);
      if (/\/search\?/.test(JSON.stringify(structured))) errors.push('仍声明了不存在的搜索入口');
    } catch { errors.push('结构化数据不是有效JSON'); }
  }
  if (url.includes('/teahouse') && /DiscussionForumPosting/.test(html)) errors.push('不把留言板外壳冒充用户论坛帖子');
  return {url,title,description,canonical,noindex,errors,warnings};
}
function main() {
  const dir=path.resolve('out');
  const sitemap=fs.readFileSync(path.join(dir,'sitemap.xml'),'utf8');
  const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>decode(m[1]));
  const fileFor=p=>path.join(dir,decodeURIComponent(p),'index.html');
  const exists=p=>fs.existsSync(fileFor(p));
  const pages=urls.map(url=>{
    const p=new URL(url).pathname;
    return exists(p)?auditHtml(fs.readFileSync(fileFor(p),'utf8'),url,exists):{url,errors:['站点地图目标不存在'],warnings:[]};
  });
  const seen=new Map();
  for(const p of pages){if(p.title&&seen.has(p.title))p.warnings.push(`与${seen.get(p.title)}标题重复`);else seen.set(p.title,p.url);}
  const report={scope:'最终静态导出；不是搜索引擎索引状态',pages:pages.length,errors:pages.flatMap(p=>p.errors.map(message=>({url:p.url,message}))),warnings:pages.flatMap(p=>p.warnings.map(message=>({url:p.url,message}))),checks:pages};
  const i=process.argv.indexOf('--report');
  if(i>=0){const target=path.resolve(process.argv[i+1]);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,JSON.stringify(report,null,2));}
  console.log(JSON.stringify({scope:report.scope,pages:report.pages,errors:report.errors,warnings:report.warnings},null,2));
  if(report.errors.length)process.exitCode=1;
}
if(require.main===module)main();
module.exports={auditHtml};
