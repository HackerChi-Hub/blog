const assert = require('node:assert/strict');
const http = require('node:http');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const run = promisify(execFile);
const { encodeBoardMessage } = require('../lib/community.cjs');
const requests = [];
let dropNext = false;
let delayNext = 0;
let denyNext = false;
let malformedNext = false;
let incompleteNext = false;
let deniedPath = '';
const fixture = { id: 42, slug: 'teahouse', nickname: '验收访客', content: encodeBoardMessage('测试正文', 'feedback', 'sample'), status: 'visible', created_at: Date.now(), ip_hash: 'must-not-print' };
const server = http.createServer((req, res) => {
  requests.push(req.url);
  if (dropNext) { dropNext = false; req.socket.destroy(); return; }
  assert.equal(req.headers.authorization, 'Bearer isolated-test-token');
  if (deniedPath && req.url.includes(deniedPath)) { res.writeHead(401, { 'content-type': 'application/json' }); res.end(JSON.stringify({ error: '未认证' })); return; }
  if (denyNext) { denyNext = false; res.writeHead(401, { 'content-type': 'application/json' }); res.end(JSON.stringify({ error: '未认证' })); return; }
  if (malformedNext) { malformedNext = false; res.end('{'); return; }
  if (incompleteNext) { incompleteNext = false; res.end('{}'); return; }
  const body = req.url.includes('/stats') ? { total:1,visible:1,hidden:0,slugs:1,visitors:1,last_24h:1,last_7d:1,by_post:[] } : { comments:[fixture] };
  res.setHeader('content-type', 'application/json');
  const delay = delayNext;
  delayNext = 0;
  if (delay) setTimeout(() => res.end(JSON.stringify(body)), delay);
  else res.end(JSON.stringify(body));
});
(async () => {
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const env = { ...process.env, NODE_USE_ENV_PROXY:'0', COMMENTS_ADMIN_TOKEN:'isolated-test-token', COMMENTS_API:`http://127.0.0.1:${server.address().port}/api/comments` };
  const invoke = args => run(process.execPath,['scripts/comments-admin.js',...args],{env,timeout:15000});
  const tea = await invoke(['tea']);
  assert(tea.stdout.includes('黑粉茶馆'));
  assert(tea.stdout.includes('测试正文'));
  assert(tea.stdout.includes('工具反馈'));
  assert(!tea.stdout.includes('must-not-print'));
  assert(requests.some(p=>p.includes('&slug=teahouse')));
  requests.length=0;
  const all = await invoke([]);
  assert(all.stdout.includes('黑粉茶馆专栏'));
  assert.equal(requests.length,3);
  const json = await invoke(['tea','--json']);
  assert.equal(JSON.parse(json.stdout)[0].id,42);
  dropNext = true;
  const recovered = await invoke(['tea']);
  assert(recovered.stdout.includes('测试正文'), '只读连接瞬断后自动恢复');
  requests.length = 0;
  delayNext = 6500;
  const slow = await invoke(['tea']);
  assert(slow.stdout.includes('测试正文'), '超过旧6秒阈值的正常响应仍能读取');
  assert.equal(requests.length, 1, '慢响应不应被提前取消并重发');
  requests.length = 0;
  malformedNext = true;
  const complete = await invoke(['tea']);
  assert(complete.stdout.includes('测试正文'), '不完整JSON不能被吞成空对象');
  assert.equal(requests.length, 2, '只读响应损坏后有限重试');
  requests.length = 0;
  incompleteNext = true;
  const validShape = await invoke(['tea']);
  assert(validShape.stdout.includes('测试正文'), '缺失comments字段时有限恢复，而不是length崩溃');
  assert.equal(requests.length, 2);
  requests.length = 0;
  denyNext = true;
  await assert.rejects(invoke(['stats']), error => error.stderr.includes('未认证'));
  assert.equal(requests.length, 1, '认证失败不重试');
  requests.length = 0;
  dropNext = true;
  await assert.rejects(invoke(['hide', '42']));
  assert.equal(requests.length, 1, '写操作连接失败不自动重发');
  deniedPath = '/admin/recent?limit=30';
  await assert.rejects(invoke([]), error => {
    assert(error.stdout.includes('留言总览'), '茶馆读取失败仍显示成功的统计');
    assert(error.stdout.includes('测试正文'), '茶馆读取失败仍显示成功的最近留言');
    assert(error.stderr.includes('黑粉茶馆暂未读取成功'), '失败板块须明确标记，不伪装全部成功');
    return true;
  });
  console.log('✅ 管理命令回归通过：总览、茶馆实时读取、话题解码、隐私输出、慢响应容错、只读重试及写入不重发');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>server.close());
