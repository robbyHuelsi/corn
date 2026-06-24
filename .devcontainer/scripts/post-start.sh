#!/usr/bin/env bash
set -euo pipefail

mkdir -p /home/vscode/.local/share/commandhistory
touch /home/vscode/.local/share/commandhistory/.zsh_history

cd /workspace

# Build venv only when missing.
if [[ ! -x /workspace/.venv/bin/python ]]; then
  /home/vscode/.local/bin/uv sync || python3 -m venv /workspace/.venv || true
fi

# Keep container startup resilient if RTK hook init fails.
/home/vscode/.local/bin/rtk init -g --copilot --hook-only --auto-patch || true
