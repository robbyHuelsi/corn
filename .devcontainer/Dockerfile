FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

ENV PATH="/home/vscode/.local/bin:${PATH}"

# Install Node.js 20 LTS via NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# All subsequent commands run as the non-root vscode user (built into the base image)
USER vscode

# Pre-create RTK state/config dirs for writable named volume initialization
RUN mkdir -p /home/vscode/.local/share/rtk /home/vscode/.config/rtk /home/vscode/.local/share/commandhistory

# Install uv for Python environment creation/sync
RUN curl -LsSf https://astral.sh/uv/install.sh | sh \
    && /home/vscode/.local/bin/uv --version

# Pre-install Python 3.14 so uv sync uses it without downloading at runtime
RUN /home/vscode/.local/bin/uv python install 3.14

# Install RTK for token-compressed command output in AI tool flows
RUN curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh \
    && /home/vscode/.local/bin/rtk --version
