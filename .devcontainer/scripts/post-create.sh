#!/usr/bin/env bash
set -euo pipefail

mkdir -p /home/vscode/.local/share/commandhistory
touch /home/vscode/.local/share/commandhistory/.zsh_history

cd /workspace

# Build workspace venv via uv (uses Python 3.14 pre-installed in the image)
if ! /home/vscode/.local/bin/uv sync; then
  python3 -m venv /workspace/.venv || true
fi

# Install Node.js dev dependencies and set up git hooks
npm install

# Keep container startup resilient if RTK hook init fails.
/home/vscode/.local/bin/rtk init -g --copilot --hook-only --auto-patch || true
