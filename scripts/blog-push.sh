#!/usr/bin/env bash
set -euo pipefail

echo "ℹ️ blog-push 已替换为 blog-publish。"
exec bash "$(dirname "$0")/blog-publish" "$@"
