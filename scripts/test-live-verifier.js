const assert = require('node:assert/strict');
const http = require('node:http');
const { fetchWithTimeout } = require('./verify-live');

async function main() {
  const server = http.createServer((req, res) => {
    if (req.url === '/stalled') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write('响应头正常，但正文不结束');
      return;
    }
    const body = '正常正文';
    res.writeHead(req.url === '/missing' ? 404 : 200, { 'Content-Length': Buffer.byteLength(body) });
    res.end(req.method === 'HEAD' ? undefined : body);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const page = await fetchWithTimeout(base, 1000);
    assert.equal(page.ok, true);
    assert.equal(await page.text(), '正常正文');
    const head = await fetchWithTimeout(base, 1000, { method: 'HEAD' });
    assert.equal(head.ok, true);
    assert.ok(Number(head.headers.get('content-length')) > 0);
    assert.equal((await fetchWithTimeout(`${base}/missing`, 1000)).status, 404);
    await assert.rejects(fetchWithTimeout(`${base}/stalled`, 100), { name: 'AbortError' });
    console.log('✅ 线上验收器回归通过：正文读取、HEAD、404、响应流超时');
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
