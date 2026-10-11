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
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  }
  const sitemap = base ? await read(new URL('/sitemap.xml', base)) : fs.readFileSync(path.join(dir, 'sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1].replace(/&amp;/g, '&')));
  if (!urls.length) throw new Error('站点地图无页面，拒绝空验收');
  let index = 0;
  async function worker() {
    while (index < urls.length) {
      const url = urls[index++];
      try {
        const html = base ? await read(new URL(url.pathname, base))
          : fs.readFileSync(path.join(dir, decodeURIComponent(url.pathname), 'index.html'), 'utf8');
        const result = auditHtmlLinks(html);
        report.pages++; report.links += result.links; report.downloads += result.downloads;
        report.failures.push(...result.failures.map(message => ({ page: url.pathname, message })));
      } catch (error) { report.failures.push({ page: url.pathname, message: error.message }); }
    }
  }
  await Promise.all(Array.from({length: base ? 4 : 1}, worker));
  console.log(JSON.stringify(report, null, 2));
  if (report.failures.length || report.pages !== urls.length) process.exitCode = 1;
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
