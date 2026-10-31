const fs = require('node:fs');
const path = require('node:path');
const { mp4Atoms } = require('./build-article-media.cjs');
const root = path.resolve(__dirname,'..');
const output = path.join(root,'out');
const manifest = JSON.parse(fs.readFileSync(path.join(root,'lib/article-media.generated.json'),'utf8'));
let images=0,videos=0,references=0;
for(const [source,media] of Object.entries(manifest)) {
  const urls=media.kind==='image'?media.variants.map(v=>v.src):[media.src,media.poster];
  for(const url of urls) {
    const file=path.join(output,decodeURIComponent(url));
    if(!fs.existsSync(file)||!fs.statSync(file).size)throw new Error('媒体导出缺失：'+url);
    references++;
  }
  if(media.kind==='video') {
    const atoms=mp4Atoms(path.join(output,decodeURIComponent(media.src)));
    if(atoms.findIndex(a=>a.type==='moov')>atoms.findIndex(a=>a.type==='mdat'))throw new Error('视频不能渐进播放：'+source);
    videos++;
  } else images++;
}
let bytes=0;
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else bytes+=fs.statSync(file).size;}}
walk(output);
if(bytes>=1000000000)throw new Error('导出接近或超过GitHub Pages 1GB上限，需先分离素材托管，不能继续叠加');
console.log(`✅ 正文媒体导出：${images}张响应式图片、${videos}个可渐进播放视频、${references}项素材存在；整站${Math.round(bytes/1024/1024)}MiB`);
