import json
import os
import sys
import urllib.request
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

PORT = 8090
DATA_FILE = '/Users/cesarrisso/Desktop/Finanzas/database.json'
HTML_DIR = '/Users/cesarrisso/Desktop/Finanzas'

CLOUD_GET_URL = 'https://webhook.site/token/f3c30873-e641-4d92-b39a-87ef1b26503e/request/latest/raw'
CLOUD_POST_URL = 'https://webhook.site/f3c30873-e641-4d92-b39a-87ef1b26503e'

class CustomHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=HTML_DIR, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Cache-Control')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path.startswith('/api/data'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            
            # Try to fetch latest cloud state first
            try:
                req = urllib.request.Request(CLOUD_GET_URL + '?t=' + str(int(os.path.getmtime(DATA_FILE) if os.path.exists(DATA_FILE) else 0)))
                with urllib.request.urlopen(req, timeout=3) as resp:
                    cloud_bytes = resp.read()
                    if cloud_bytes and cloud_bytes.strip().startswith(b'{'):
                        # Write to local file to keep local backup synchronized
                        with open(DATA_FILE, 'wb') as f:
                            f.write(cloud_bytes)
                        self.wfile.write(cloud_bytes)
                        return
            except Exception as e:
                pass

            if os.path.exists(DATA_FILE):
                try:
                    with open(DATA_FILE, 'rb') as f:
                        self.wfile.write(f.read())
                except Exception as e:
                    self.wfile.write(b'{}')
            else:
                self.wfile.write(b'{}')
        else:
            super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/data'):
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                parsed = json.loads(post_data.decode('utf-8'))
                with open(DATA_FILE, 'w', encoding='utf-8') as f:
                    json.dump(parsed, f, ensure_ascii=False, indent=2)
                
                # Push to cloud store asynchronously
                try:
                    req = urllib.request.Request(CLOUD_POST_URL, data=post_data, headers={'Content-Type': 'application/json'}, method='POST')
                    urllib.request.urlopen(req, timeout=3)
                except Exception as cloud_err:
                    print("Cloud push notice:", cloud_err)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'success', 'message': 'Data synced to local and 24/7 cloud!'}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    print(f"Starting 24/7 Cloud-Synced Multi-Threaded Server on port {PORT}...")
    server = ThreadingHTTPServer(('0.0.0.0', PORT), CustomHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped gracefully.")
