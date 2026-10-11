const assert=require('assert'),fs=require('fs');
const {selectedPosts}=require('./x-blog-handoff');
const before={posts:[{slug:'old',sha256:'a'},{slug:'same',sha256:'b'}]};
const after={posts:[{slug:'old',sha256:'c'},{slug:'same',sha256:'b'},{slug:'new',sha256:'d'},
{slug:'new-en',sha256:'e',translation_of:'new',lang:'en'}]};
assert.deepEqual(selectedPosts(before,after).map(p=>[p.slug,p.is_new]),[['old',false],['new',true]]);
const shell=fs.readFileSync(require('path').join(__dirname,'blog-push'),'utf8');
const verify=shell.lastIndexOf('node scripts/verify-live.js "$run_id"');
const hook=shell.lastIndexOf('node scripts/x-blog-handoff.js');
assert(verify>=0&&hook>verify,'X队列必须在实际线上验收成功后调用');
assert(shell.includes('--status success --limit 1 --json headSha'),'需从成功部署锁定基线，不使用尚未部署的HEAD');
assert(shell.includes('--source-ref "$x_source_sha" --public-ref "$sha"'),'必须传入本次已发布的两个提交，不按部署后的新HEAD取稿');
const handoff=fs.readFileSync(require('path').join(__dirname,'x-blog-handoff.js'),'utf8');
assert(handoff.includes('`${publicCommit}:content-export/publish-manifest.json`'),'公开清单必须来自已验收提交');
assert(!handoff.includes("['rev-parse','HEAD']"),'不把验收期间的新编辑或新提交误认为已上线');
console.log('✅ 发布后X钩子：增量筛选、译文排除、成功部署基线、发布版本锁定、线上验收先于入队');
