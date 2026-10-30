#!/usr/bin/env node
'use strict';
// 本地预览只代理公开GET，所有写入均拦截；不接触管理口令，不向官网发送测试留言。
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const runFile = promisify(execFile);
const root = path.resolve(__dirname, '..', 'out');
const staticMode = process.argv.includes('--static');
const port = Number(process.env.PREVIEW_PORT || 4191);
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.xml':'application/xml' };
function json(res, status, data) { res.writeHead(status, { 'content-type':'application/json; charset=utf-8', 'cache-control':'no-store' }); res.end(JSON.stringify(data)); }
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 409, { error:'本地预览不提交真实留言；请在正式上线后使用。' });
    if (url.pathname.startsWith('/api/')) {
      if (url.pathname !== '/api/comments' || !/^[a-z0-9][a-z0-9-]{0,120}$/.test(url.searchParams.get('slug') || '')) return json(res, 400, { error:'仅支持读取公开留言' });
      const target = new URL('https://hyphentech.top/api/comments');
      target.searchParams.set('slug', url.searchParams.get('slug'));
      if (url.searchParams.get('recent') === '1') target.searchParams.set('recent','1');
      // 使用系统curl沿用本机网络代理；Node原生fetch在部分代理环境会直连超时。
      // URL和参数均由上面的固定域名及slug白名单构造，不通过shell执行。
      const { stdout } = await runFile('curl', ['--silent', '--show-error', '--max-time', '10', '--write-out', '\n%{http_code}', target.href], { timeout:11000, maxBuffer:1024*1024 });
      const split = stdout.lastIndexOf('\n');
      const status = Number(stdout.slice(split + 1));
      const data = JSON.parse(stdout.slice(0, split));
      return json(res, status, data);
    }
    if (!staticMode) {
      const proxy = http.request({ hostname:'127.0.0.1', port:4190, path:req.url, method:req.method, headers:{ ...req.headers, host:'localhost:4190' } }, upstream => {
        res.writeHead(upstream.statusCode, upstream.headers); upstream.pipe(res);
      });
      proxy.on('error', () => json(res, 502, { error:'本地开发服务未启动' })); proxy.end(); return;
    }
    let file = path.resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (file !== root && !file.startsWith(root + path.sep)) return json(res, 403, { error:'无效路径' });
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'content-type':types[path.extname(file)] || 'application/octet-stream', 'cache-control':'no-store' });
    if (req.method === 'HEAD') res.end(); else fs.createReadStream(file).pipe(res);
  } catch { json(res, 502, { error:'公开留言暂时无法读取，请稍后重试' }); }
}).listen(port, '127.0.0.1', () => console.log(`本地只读预览 http://localhost:${port}（${staticMode ? '正式静态导出' : '开发页面'}；禁止向官网写入）`));
