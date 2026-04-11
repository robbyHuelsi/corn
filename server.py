#!/usr/bin/env python3
"""Minimal local dev server serving src/ on port 8081."""

import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path


def main() -> None:
    """Serve src/ on port 8081."""
    os.chdir(Path(__file__).resolve().parent)
    HTTPServer(("", 8081), SimpleHTTPRequestHandler).serve_forever()


if __name__ == "__main__":
    main()
