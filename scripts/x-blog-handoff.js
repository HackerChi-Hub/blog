#!/usr/bin/env node
// 只在blog-push完成verify-live后执行；本脚本不打开X、不调用任何发布接口。
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const {execFileSync, spawnSync} = require('child_process');
const root = path.resolve(__dirname, '..');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
function selectedPosts(before, after) {
  const old = new Map((before.posts || []).map(p => [p.slug,p]));
  return (after.posts || []).filter(p => !p.translation_of && (!p.lang || p.lang === 'zh-CN')
    && (!old.has(p.slug) || old.get(p.slug).sha256 !== p.sha256)).map(p => ({...p,is_new:!old.has(p.slug)}));
}
function main(argv) {
  const arg = name => { const i=argv.indexOf(name);return i>=0?argv[i+1]:''; };
  const beforeRef=arg('--before-ref'),sourceCommit=arg('--source-ref'),publicCommit=arg('--public-ref'),runId=arg('--verified-run-id');
  if(![beforeRef,sourceCommit,publicCommit].every(ref=>/^[a-f0-9]{40}$/.test(ref||'')) || !/^\d+$/.test(runId||'')) throw Error('必须提供上次成功部署、本次原件及公开提交、已验收run id；无法查到基线时不猜测推广范围');
  const source = path.resolve(arg('--content-dir') || path.join(root,'../blog-content'));
  const manifestRaw=execFileSync('git',['show',`${publicCommit}:content-export/publish-manifest.json`],{cwd:root});
  const manifest = JSON.parse(manifestRaw.toString());
  const oldRaw=execFileSync('git',['show',`${beforeRef}:content-export/publish-manifest.json`],{cwd:root});
  const before=JSON.parse(oldRaw.toString());
  const posts=selectedPosts(before,manifest).map(p=>{
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug))throw Error('不合法的slug');
    const bytes=execFileSync('git',['show',`${sourceCommit}:posts/${p.slug}.md`],{cwd:source});
    return {slug:p.slug,is_new:p.is_new,source_sha256:hash(bytes)};
  });
  const event={schema_version:1,status:'verified',run_id:runId,base_url:'https://hyphentech.top',
    source_commit:sourceCommit,public_commit:publicCommit,
    verified_at:new Date().toISOString(),manifest_sha256:hash(manifestRaw),posts};
  if(argv.includes('--dry-run')) { console.log(JSON.stringify(event,null,2));return; }
  const distributor=path.resolve(arg('--distributor-dir')||path.join(root,'../ContentDistributor'));
  const output=path.join(distributor,'output/x/articles');fs.mkdirSync(output,{recursive:true});
  const eventPath=path.join(output,`blog-publication-${runId}.json`);
  fs.writeFileSync(eventPath,JSON.stringify(event,null,2));
  const proc=spawnSync('uv',['run','python','scripts/x_blog_assist.py','--content-dir',source,'after-publish',eventPath,'--open-review'],
    {cwd:distributor,encoding:'utf8',timeout:120000});
  if(proc.error)throw proc.error;
  if(proc.status!==0)throw Error((proc.stderr||proc.stdout||'文章准备失败').trim());
  console.log(proc.stdout.trim());
  const result=JSON.parse(proc.stdout);
  if(result.review?.error)throw Error(`文案已保留，但审阅台未打开：${result.review.error}`);
  if(result.skipped?.length)throw Error(`${result.queued.length}篇已准备，${result.skipped.length}篇需处理；事件保留于${eventPath}`);
  console.log(result.queued.length ? '📝 X待审内容已整理并请求打开本地审阅页（费用0，未发帖）；确认后才打开X。' : '📝 本次无须新增X推广文案。');
}
if(require.main===module) {try{main(process.argv.slice(2));}catch(e){console.error('⚠️ X文章助手：'+e.message);process.exitCode=1;}}
module.exports={selectedPosts};
