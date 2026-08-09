#!/usr/bin/env bash
set -euo pipefail

REPO="/Volumes/BigDisk/Scripts/10-内容制作/blog"
WORKFLOW="deploy.yml"

cd "$REPO"

if ! command -v gh >/dev/null 2>&1; then
  echo "❌ 缺少 GitHub CLI（gh），无法确认部署结果"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "❌ GitHub CLI 未登录，无法触发并跟踪部署"
  exit 1
fi

branch=$(git branch --show-current)
if [ "$branch" != "main" ]; then
  echo "❌ 当前分支是 $branch，blog-push 只允许从 main 部署"
  exit 1
fi

if ! git diff --cached --quiet; then
  echo "❌ 暂存区有未提交改动。blog-push 不会替你提交内容，请先单独确认并提交"
  exit 1
fi

git fetch origin main
behind=$(git rev-list --count HEAD..origin/main)
ahead=$(git rev-list --count origin/main..HEAD)
if [ "$behind" -gt 0 ]; then
  if [ "$ahead" -gt 0 ]; then
    echo "❌ 本地与 origin/main 已分叉，请先人工处理，blog-push 不自动 rebase"
    exit 1
  fi
  if [ -n "$(git status --porcelain)" ]; then
    echo "❌ 本地落后 origin/main 且工作区有改动，拒绝自动拉取"
    exit 1
  fi
  git pull --ff-only origin main
fi

git commit --allow-empty -m "chore: trigger verified rebuild"
sha=$(git rev-parse HEAD)
git push origin main

echo "⏳ 已触发部署，等待 GitHub Actions：${sha:0:8}"
run_id=""
deadline=$((SECONDS + 120))
while [ -z "$run_id" ] && [ "$SECONDS" -lt "$deadline" ]; do
  run_id=$(gh run list \
    --workflow "$WORKFLOW" \
    --commit "$sha" \
    --limit 1 \
    --json databaseId \
    --jq '.[0].databaseId // empty')
  [ -n "$run_id" ] || sleep 3
done

if [ -z "$run_id" ]; then
  echo "❌ 120 秒内没有发现对应的 GitHub Actions 运行"
  exit 1
fi

run_url="https://github.com/HackerChi-Hub/blog/actions/runs/$run_id"
echo "🔗 $run_url"

if ! gh run watch "$run_id" --exit-status; then
  echo "❌ Blog 构建或部署失败，下面是失败步骤日志："
  gh run view "$run_id" --log-failed | tail -n 160 || true
  exit 1
fi

node scripts/verify-live.js "$run_id"
echo "✅ Blog 部署完成，构建、上线版本和 sitemap 全部通过验收"

