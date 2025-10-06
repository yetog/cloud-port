#!/usr/bin/env python3
"""
Simple HTTP server for Single Page Applications (SPA)
Serves index.html for all routes that don't correspond to actual files
"""

import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse

class SPAHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the requested path
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Check if the requested path corresponds to an actual file
        if path.startswith('/'):
            path = path[1:]  # Remove leading slash
        
        # If it's empty, serve index.html
        if not path:
            path = 'index.html'
        
        # If the file exists, serve it normally
        if os.path.isfile(path):
            return super().do_GET()
        
        # Check if it's a static asset
        if any(path.endswith(ext) for ext in ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.eot']):
            return super().do_GET()
        
        # For all other paths (likely React routes), serve index.html
        self.path = '/index.html'
        return super().do_GET()

if __name__ == "__main__":
    PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    
    # Change to the directory containing the built files
    if len(sys.argv) > 2:
        os.chdir(sys.argv[2])
    
    Handler = SPAHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"SPA Server running at http://localhost:{PORT}/")
        print(f"Serving directory: {os.getcwd()}")
        httpd.serve_forever()