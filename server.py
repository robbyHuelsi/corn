#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
HTTPServer(("", 8081), SimpleHTTPRequestHandler).serve_forever()
