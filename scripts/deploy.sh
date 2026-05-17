#!/bin/bash
# =============================================
# Blog GitHub Pages 部署脚本
# =============================================

set -e

cd "$(dirname "$0")/.."

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo_step() { echo -e "\n${GREEN}==>${NC} $1"; }

# 清理
echo_step "清理旧构建..."
rm -rf out/ .next/

# 构建
echo_step "构建项目..."
npm run build

# 推送
echo_step "推送到 GitHub..."
git add -A
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')" || echo "Nothing to commit"
git push origin main

echo -e "\n${GREEN}✅ 部署完成${NC}"
echo "GitHub Pages 将在 1-5 分钟后更新"
