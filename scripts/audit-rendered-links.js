// 全站导出/线上只读检查。网络只读，不点击下载、不执行外站文件。
const fs = require('node:fs');
const path = require('node:path');
const { auditHtmlLinks } = require('../lib/link-presentation.cjs');
async function main() {
  const args = process.argv.slice(2);
  const baseIndex = args.indexOf('--base');
  const base = baseIndex >= 0 ? args[baseIndex + 1] : '';
  const dirIndex = args.indexOf('--dir');
  const dir = path.resolve(dirIndex >= 0 ? args[dirIndex + 1] : 'out');
  const report = { mode: base ? 'live' : 'export', pages: 0, links: 0, downloads: 0, failures: [] };
  async function read(url) {
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
        const expectedNotFound = new URL(url).pathname === '/404.html' && response.status === 404;
        if (!response.ok && !expectedNotFound) throw new Error(`HTTP ${response.status}`);
        return await response.text();
      } catch (error) { lastError = error; }
    }
    throw lastError;
  }
  const sitemapFile = path.join(dir, 'sitemap.xml');
  if (!base && (!fs.existsSync(sitemapFile) || !fs.statSync(sitemapFile).isFile())) {
    throw new Error('缺少最终 sitemap.xml，请先完成构建和后处理');
  }
  const sitemap = base ? await read(new URL('/sitemap.xml', base)) : fs.readFileSync(sitemapFile, 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1].replace(/&amp;/g, '&')));
  if (!urls.length) throw new Error('站点地图无页面，拒绝空验收');
  // 独立教程和素材内的 HTML 不全在站点地图中；以全部导出 HTML 补足审计范围。
  function htmlFiles(directory) {
    return fs.readdirSync(directory, {withFileTypes:true}).flatMap(entry => {
      const file = path.join(directory, entry.name);
      return entry.isDirectory() ? htmlFiles(file) : entry.isFile() && entry.name.endsWith('.html') ? [file] : [];
    });
  }
  const routes = new Map(urls.map(url => [url.pathname, null]));
  for (const file of htmlFiles(dir)) {
    const relative = path.relative(dir, file).split(path.sep).join('/');
    const route = relative === 'index.html' ? '/' : relative.endsWith('/index.html')
      ? `/${relative.slice(0, -'index.html'.length)}` : `/${relative}`;
    routes.set(route, file);
  }
  const targets = [...routes].map(([route, file]) => ({route, file}));
  report.sitemapPages = urls.length;
  report.independentPages = targets.length - urls.length;
  let index = 0;
  async function worker() {
    while (index < targets.length) {
      const {route, file} = targets[index++];
      try {
        const html = base ? await read(new URL(route, base))
          : fs.readFileSync(file || path.join(dir, decodeURIComponent(route), 'index.html'), 'utf8');
        const result = auditHtmlLinks(html);
        report.pages++; report.links += result.links; report.downloads += result.downloads;
        report.failures.push(...result.failures.map(message => ({ page: route, message })));
      } catch (error) { report.failures.push({ page: route, message: error.message }); }
    }
  }
  await Promise.all(Array.from({length: base ? 4 : 1}, worker));
  console.log(JSON.stringify(report, null, 2));
  if (report.failures.length || report.pages !== targets.length) process.exitCode = 1;
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
