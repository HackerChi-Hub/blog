const assert = require('node:assert/strict');
const http = require('node:http');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const run = promisify(execFile);
const { encodeBoardMessage } = require('../lib/community.cjs');
const requests = [];
let dropNext = false;
const fixture = { id: 42, slug: 'teahouse', nickname: '验收访客', content: encodeBoardMessage('测试正文', 'feedback', 'sample'), status: 'visible', created_at: Date.now(), ip_hash: 'must-not-print' };
const server = http.createServer((req, res) => {
  requests.push(req.url);
  if (dropNext) { dropNext = false; req.socket.destroy(); return; }
  assert.equal(req.headers.authorization, 'Bearer isolated-test-token');
  const body = req.url.includes('/stats') ? { total:1,visible:1,hidden:0,slugs:1,visitors:1,last_24h:1,last_7d:1,by_post:[] } : { comments:[fixture] };
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(body));
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
  console.log('✅ 管理命令回归通过：总览、茶馆实时读取、服务端过滤、话题解码、JSON兼容与隐私输出');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>server.close());
