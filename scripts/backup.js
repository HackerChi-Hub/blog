// scripts/backup.js
// 项目备份脚本：压缩打包所有内容（排除 node_modules、.next、out 等）

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const BACKUP_DIR = path.join(process.cwd(), 'backups');
const MAX_BACKUPS = 10; // 保留最近 10 个备份

// 需要排除的目录和文件
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.next',
  'out',
  '.git',
  'backups',
  '.DS_Store',
  'Thumbs.db',
  '*.log',
  'npm-debug.log*',
  '.env.local',
  '.env',
];

/**
 * 创建备份目录
 */
function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`[backup] 创建备份目录: ${BACKUP_DIR}`);
  }
}

/**
 * 生成备份文件名（带时间戳）
 */
function generateBackupFileName() {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const dateStr = now.toISOString().split('T')[0];
  return `blog-backup-${dateStr}-${timestamp}.tar.gz`;
}

/**
 * 执行备份
 */
function createBackup() {
  ensureBackupDir();

  const backupFileName = generateBackupFileName();
  const backupPath = path.join(BACKUP_DIR, backupFileName);
  const projectRoot = process.cwd();

  console.log('[backup] 开始创建备份...');
  console.log(`[backup] 项目根目录: ${projectRoot}`);
  console.log(`[backup] 备份文件: ${backupPath}`);

  // 构建 tar 命令
  const excludeArgs = EXCLUDE_PATTERNS.map((pattern) => `--exclude=${pattern}`).join(' ');
  
  // 使用 tar 命令创建压缩包
  // -czf: c=创建, z=gzip压缩, f=文件
  // --exclude: 排除文件和目录
  const tarCommand = `tar -czf "${backupPath}" ${excludeArgs} -C "${projectRoot}" .`;

  try {
    execSync(tarCommand, { stdio: 'inherit' });
    console.log(`[backup] ✓ 备份创建成功: ${backupFileName}`);
    
    // 获取备份文件大小
    const stats = fs.statSync(backupPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`[backup] 备份大小: ${sizeMB} MB`);
    
    return backupPath;
  } catch (error) {
    console.error('[backup] ✗ 备份创建失败:', error.message);
    process.exit(1);
  }
}

/**
 * 清理旧备份（保留最近 N 个）
 */
function cleanOldBackups() {
  try {
    const files = fs.readdirSync(BACKUP_DIR)
      .filter((file) => file.startsWith('blog-backup-') && file.endsWith('.tar.gz'))
      .map((file) => {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          path: filePath,
          mtime: stats.mtime,
        };
      })
      .sort((a, b) => b.mtime - a.mtime); // 按修改时间降序排列

    if (files.length > MAX_BACKUPS) {
      const toDelete = files.slice(MAX_BACKUPS);
      console.log(`[backup] 清理旧备份，保留最近 ${MAX_BACKUPS} 个...`);
      
      toDelete.forEach((file) => {
        fs.unlinkSync(file.path);
        console.log(`[backup] 删除旧备份: ${file.name}`);
      });
      
      console.log(`[backup] ✓ 已清理 ${toDelete.length} 个旧备份`);
    } else {
      console.log(`[backup] 当前备份数量: ${files.length}/${MAX_BACKUPS}`);
    }
  } catch (error) {
    console.warn('[backup] 清理旧备份时出错:', error.message);
  }
}

/**
 * 主函数
 */
function main() {
  console.log('='.repeat(50));
  console.log('[backup] 项目备份工具');
  console.log('='.repeat(50));
  
  const backupPath = createBackup();
  cleanOldBackups();
  
  console.log('='.repeat(50));
  console.log('[backup] ✓ 备份完成！');
  console.log(`[backup] 备份位置: ${backupPath}`);
  console.log('='.repeat(50));
}

// 运行
main();
