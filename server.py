#!/usr/bin/env python3
"""Minimal local dev server serving src/ on the given port."""

import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

import click


class NoCacheHandler(SimpleHTTPRequestHandler):
    """SimpleHTTPRequestHandler that disables browser caching for development."""

    def end_headers(self) -> None:
        """Inject no-cache headers before finalizing the response."""
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


@click.command()
@click.option("--port", "-p", default=8081, show_default=True, help="Port to listen on.")
def main(port: int) -> None:
    """Serve src/ locally for development."""
    os.chdir(Path(__file__).resolve().parent / "src")
    url = f"http://localhost:{port}"
    click.echo(f"Serving on {click.style(url, fg='green', bold=True)} (Ctrl+C to stop)")
    HTTPServer(("", port), NoCacheHandler).serve_forever()


if __name__ == "__main__":
    main()
