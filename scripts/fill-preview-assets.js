#!/usr/bin/env node
'use strict';

/**
 * 把已发布素材镜像（public/obsidian-assets）填充进 Obsidian 本地预览镜像
 * （blog-content/preview-assets），让主力机以外的机器在 Obsidian 里也能看图。
 *
 * 为什么需要：preview-assets 是生成物，被 .gitignore 忽略，只存在于跑过导入器
 * 的那台机器上；素材真源（/Volumes/BigDisk/通用素材/图片素材/blog-content）也
 * 不是 Git 仓库，不参与 sync-all。换一台机器 clone blog-content，正文里的
 * ../preview-assets/... 就全是断链——文字同步了，图没有。
 *
 * 但这批字节并没有丢。同步器早就把「正文实际引用到的」素材复制进
 * public/obsidian-assets 并随 blog 仓入库了，两棵树的 <slug>/<文件名> 结构逐层
 * 一致，只有根目录名不同。所以这里不重新解析正文去推导「哪些图被引用」：
 * public/obsidian-assets 本身就是同步器算出来的那份权威结果，直接镜像即可，
 * 免得同一条规则在两个地方各写一遍、各自漂移。
 *
 * 方向只有一个：已发布镜像 -> 本地预览镜像。反方向（拿本机预览覆盖已发布镜像）
 * 是 sync-obsidian-content.js 顶部注释警告过的事故，本脚本永不写 public/。
 *
 * 用法：
 *   node scripts/fill-preview-assets.js --dry-run   # 只报告，不写盘（建议先跑）
 *   node scripts/fill-preview-assets.js             # 实际填充
 *   node scripts/fill-preview-assets.js --target <目录>   # 指定预览镜像位置
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const projectRoot = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const args = { dryRun: false, target: '', source: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === '--dry-run') args.dryRun = true;
    else if (item === '--target') args.target = argv[(i += 1)];
    else if (item === '--source') args.source = argv[(i += 1)];
    else throw new Error(`无法识别的参数：${item}`);
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const sourceRoot = path.resolve(
  args.source || path.join(projectRoot, 'public', 'obsidian-assets')
);
// 默认按「两个仓同级」找：<父目录>/blog 与 <父目录>/blog-content。
// Windows 上只要保持同样的相对位置就不用传 --target。
const targetRoot = path.resolve(
  args.target || path.join(projectRoot, '..', 'blog-content', 'preview-assets')
);

function walkFiles(directory) {
  const found = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...walkFiles(full));
    else if (entry.isFile()) found.push(full);
  }
  return found;
}

function hashFile(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

/**
 * 两边同名、但字节不一样时怎么办。
 *
 * 会发生的原因：本机导入器刚为某篇文章重出了一版图，还没发布，所以
 * public/obsidian-assets 里仍是上一版；也可能反过来——另一台机器出了新图并
 * 发布了，本机预览是旧的。两种情况字节都不同，但该保留哪一份正好相反。
 *
 * 返回 'skip' 保留本地预览的那一份，返回 'overwrite' 用已发布的那一份覆盖，
 * 返回 'report' 则不写盘、只在结尾列出来等人工判断。
 *
 * 现行策略：一律 'report'，一个字节都不覆盖。
 *
 * 理由是素材真源只在主力机（/Volumes/BigDisk/通用素材/...），不参与任何 Git 同步。
 * 在别的机器上，preview-assets 里的文件就是那一版的唯一副本——覆盖掉等于不可恢复
 * 地丢失，而这里想解决的问题只是「另一台机器看不到图」。补缺失值得，冒丢失的险
 * 不值得。所以本脚本只做单向安全操作：缺的补上，有的一概不动。
 *
 * 真出现两边不一致时，让它显式暴露出来人工判断，而不是选一边静默执行——两种成因
 * （本机新图未发布 / 本机旧图已被别处更新）看起来完全一样，脚本没有证据可以区分。
 */
function resolveConflict({ relativePath, sourcePath, targetPath }) {
  void relativePath;
  void sourcePath;
  void targetPath;
  return 'report';
}

function main() {
  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`已发布素材镜像不存在：${sourceRoot}（这台机器上有 blog 仓吗？）`);
  }
  if (!fs.existsSync(targetRoot)) {
    if (args.dryRun) {
      console.log(`[dry-run] 预览镜像不存在，将创建：${targetRoot}`);
    } else {
      fs.mkdirSync(targetRoot, { recursive: true });
    }
  }

  const plan = { copy: [], skip: [], overwrite: [], report: [] };

  for (const sourcePath of walkFiles(sourceRoot)) {
    const relativePath = path.relative(sourceRoot, sourcePath).split(path.sep).join('/');
    const targetPath = path.join(targetRoot, ...relativePath.split('/'));

    if (!fs.existsSync(targetPath)) {
      plan.copy.push({ relativePath, sourcePath, targetPath });
      continue;
    }
    if (hashFile(sourcePath) === hashFile(targetPath)) {
      plan.skip.push({ relativePath });
      continue;
    }
    const decision = resolveConflict({ relativePath, sourcePath, targetPath });
    if (decision === 'overwrite') plan.overwrite.push({ relativePath, sourcePath, targetPath });
    else if (decision === 'skip') plan.skip.push({ relativePath });
    else if (decision === 'report') plan.report.push({ relativePath });
    else throw new Error(`resolveConflict 返回了未知策略：${decision} -> ${relativePath}`);
  }

  const writes = [...plan.copy, ...plan.overwrite];
  if (!args.dryRun) {
    for (const item of writes) {
      fs.mkdirSync(path.dirname(item.targetPath), { recursive: true });
      fs.copyFileSync(item.sourcePath, item.targetPath);
    }
  }

  const prefix = args.dryRun ? '[dry-run] ' : '';
  console.log(`${prefix}源：${sourceRoot}`);
  console.log(`${prefix}目标：${targetRoot}`);
  console.log(`${prefix}新增 ${plan.copy.length} · 覆盖 ${plan.overwrite.length} · 已一致跳过 ${plan.skip.length} · 待人工判断 ${plan.report.length}`);
  for (const item of plan.report) console.log(`${prefix}  待判断（两边字节不同）：${item.relativePath}`);

  // 写盘后逐个回读确认，而不是相信 copyFileSync 没抛错就算成了。
  if (!args.dryRun) {
    for (const item of writes) {
      if (!fs.existsSync(item.targetPath) || hashFile(item.targetPath) !== hashFile(item.sourcePath)) {
        throw new Error(`填充后回读不一致：${item.relativePath}`);
      }
    }
    console.log(`回读校验通过：${writes.length} 个文件`);
  }
}

main();
