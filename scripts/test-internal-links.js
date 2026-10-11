const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawnSync}=require('node:child_process');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'blog-internal-links-'));
function write(name,body){const file=path.join(root,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,body);}
write('sitemap.xml','<urlset><url><loc>https://hyphentech.top/</loc></url></urlset>');
write('available/index.html','<p>正式文章</p>');
write('file.zip','fixture');
fs.mkdirSync(path.join(root,'empty'));
function audit(body){write('index.html',body);const r=spawnSync(process.execPath,[path.join(__dirname,'audit-rendered-links.js'),'--dir',root],{encoding:'utf8'});return {status:r.status,report:JSON.parse(r.stdout)};}
let result=audit('<a href="/available/">正式文章</a><a href="/file.zip">附件</a><a href="/api/comments">动态接口</a><a href="https://example.com/elsewhere">外站</a>');
assert.equal(result.status,0);assert.deepEqual(result.report.failures,[]);
result=audit('<a href="/missing/">缺失页</a><a href="http://hyphentech.top/also-missing/">旧协议</a><a href="/empty/">空目录</a>');
assert.equal(result.status,1);assert.equal(result.report.failures.length,3);
write('legacy/index.html','<p>现有文章的兼容入口</p>');
result=audit('<a href="/legacy">历史入口</a>');assert.equal(result.status,0);
console.log('✅ 站内目标回归通过：缺失页、旧协议、空目录、附件、动态接口与兼容路由');
