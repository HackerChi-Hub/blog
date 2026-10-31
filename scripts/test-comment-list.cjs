const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const src = fs.readFileSync('components/Comments.js','utf8');
const body = src.slice(src.indexOf('async function readComments('),src.indexOf('\nfunction formatTime('));
(async()=>{
  let calls=0;
  const sandbox={AbortSignal,fetch:async()=>{if(++calls===1)throw new TypeError('temporary');return {ok:true,json:async()=>({comments:[{id:9}]})};}};
  vm.createContext(sandbox);vm.runInContext(body+'\nthis.read=readComments;',sandbox);
  assert.equal((await sandbox.read('/api/comments?slug=teahouse')).comments[0].id,9);
  assert.equal(calls,2);
  calls=0;sandbox.fetch=async()=>{calls++;return {ok:false,status:401};};
  await assert.rejects(()=>sandbox.read('/api/comments'),/401/);assert.equal(calls,1);
  calls=0;sandbox.fetch=async()=>{calls++;throw new TypeError('offline');};
  await assert.rejects(()=>sandbox.read('/api/comments'),/offline/);assert.equal(calls,2);
  console.log('✅ 留言列表回归：瞬断恢复、总次数有界、鉴权错误不重试；不触碰发表操作');
})().catch(e=>{console.error(e);process.exitCode=1;});
