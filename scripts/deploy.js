// scripts/deploy.js
// 部署脚本：自动备份 + 推送到 GitHub

const { execSync } = require('child_process');

/**
 * 执行备份
 */
function runBackup() {
  console.log('[deploy] 步骤 1/3: 执行备份...');
  try {
    execSync('npm run backup', { stdio: 'inherit' });
    console.log('[deploy] ✓ 备份完成\n');
  } catch (error) {
    console.error('[deploy] ✗ 备份失败:', error.message);
    process.exit(1);
  }
}

/**
 * 检查 Git 状态，返回是否有新提交
 */
function checkGitStatus() {
  console.log('[deploy] 步骤 2/3: 检查 Git 状态...');

  try {
    // 检查是否有未提交的更改
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });

    if (status.trim()) {
      console.log('[deploy] 发现未提交的更改，正在添加...');
      execSync('git add .', { stdio: 'inherit' });

      // 生成提交信息
      const commitMsg = process.argv[2] || 'chore: 自动提交更改';
      execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit' });
      console.log('[deploy] ✓ 更改已提交\n');
      return true;
    } else {
      console.log('[deploy] ✓ 没有未提交的更改\n');
      return false;
    }
  } catch (error) {
    console.error('[deploy] ✗ Git 操作失败:', error.message);
    process.exit(1);
  }
}

/**
 * 推送到 GitHub
 */
function pushToGitHub() {
  console.log('[deploy] 步骤 3/3: 推送到 GitHub...');

  try {
    const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();

    // 先拉取远程更新，避免 push 被拒绝
    console.log('[deploy] 拉取远程更新...');
    execSync(`git pull --rebase origin ${branch}`, { stdio: 'inherit' });

    console.log(`[deploy] 推送到: ${branch} 分支`);
    execSync(`git push origin ${branch}`, { stdio: 'inherit' });
    console.log('[deploy] ✓ 推送成功！\n');
  } catch (error) {
    console.error('[deploy] ✗ 推送失败:', error.message);
    console.error('[deploy] 提示: 请确保 git 已配置代理和凭证');
    process.exit(1);
  }
}

/**
 * 主函数
 */
function main() {
  console.log('='.repeat(50));
  console.log('[deploy] GitHub 自动部署工具');
  console.log('='.repeat(50));
  console.log('');
  
  runBackup();
  checkGitStatus();
  pushToGitHub();

  console.log('='.repeat(50));
  console.log('[deploy] ✓ 部署完成！');
  console.log('='.repeat(50));
}

// 运行
main();
