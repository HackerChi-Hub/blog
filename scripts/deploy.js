// scripts/deploy.js
// 部署脚本：自动备份 + 推送到 GitHub

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * 从 .env.local 读取环境变量
 */
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('[deploy] ✗ .env.local 文件不存在');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  });
  
  return env;
}

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
 * 检查 Git 状态
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
    } else {
      console.log('[deploy] ✓ 没有未提交的更改\n');
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
  
  const env = loadEnvLocal();
  const token = env.GITHUB_TOKEN;
  
  if (!token) {
    console.error('[deploy] ✗ .env.local 中未找到 GITHUB_TOKEN');
    console.error('[deploy] 请在 .env.local 中添加: GITHUB_TOKEN=your_token_here');
    process.exit(1);
  }
  
  try {
    // 获取远程仓库 URL
    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
    
    // 如果使用 HTTPS，替换为带 token 的 URL
    let pushUrl = remoteUrl;
    if (remoteUrl.startsWith('https://')) {
      // 提取仓库路径
      const match = remoteUrl.match(/https:\/\/(.*)@github\.com\/(.*)\.git/) || 
                    remoteUrl.match(/https:\/\/github\.com\/(.*)\.git/);
      if (match) {
        const repoPath = match[2] || match[1];
        pushUrl = `https://${token}@github.com/${repoPath}.git`;
      }
    } else if (remoteUrl.startsWith('git@')) {
      // SSH 方式，直接使用
      pushUrl = remoteUrl;
    }
    
    // 获取当前分支
    const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
    
    console.log(`[deploy] 推送到: ${branch} 分支`);
    
    // 执行推送
    execSync(`git push ${pushUrl} ${branch}`, { stdio: 'inherit' });
    
    console.log('[deploy] ✓ 推送成功！\n');
  } catch (error) {
    console.error('[deploy] ✗ 推送失败:', error.message);
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
