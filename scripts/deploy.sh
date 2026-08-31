#!/usr/bin/env bash
set -euo pipefail

echo "ℹ️ deploy.sh 已并入受校验的 Obsidian 发布链路。"
exec "$(dirname "$0")/blog-publish" "$@"
