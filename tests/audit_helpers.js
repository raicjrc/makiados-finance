// Helper de auditoría: sirve el proyecto en local y abre la app con sesión simulada (datos de database.json)
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };

function startServer(port) {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      const clean = decodeURIComponent(req.url.split('?')[0]);
      const p = clean === '/' ? 'index.html' : clean;
      const f = path.join(ROOT, p);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('nf'); }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(res);
    });
    server.listen(port, () => resolve(server));
  });
}

async function openApp({ port = 8110, width = 1400, height = 900, pro = false } = {}) {
  const server = await startServer(port);
  const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  const ctx = await browser.newContext({ viewport: { width, height }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|supabase|net::/i.test(m.text())) errors.push('CONSOLE: ' + m.text()); });
  const db = JSON.parse(fs.readFileSync(path.join(ROOT, 'database.json'), 'utf8'));
  await page.goto(`http://localhost:${port}/?preview=0`);
  await page.waitForTimeout(600);
  await page.evaluate(({ db, pro }) => {
    currentUser = { id: 'audit_user', email: 'cesar@makiados.com', name: 'Audit' };
    window.currentUser = currentUser;
    appState = db;
    if (pro) window.isUserPro = () => true;
    document.getElementById('loginModalScreen').style.display = 'none';
    const w = document.getElementById('appMainWrapper');
    w.style.display = ''; w.classList.add('authenticated');
    CATEGORIES = Object.assign({}, getUserDefaultCategories(), appState.customCategories || {});
    renderAll();
  }, { db, pro });
  await page.waitForTimeout(800);
  return { page, browser, server, errors, close: async () => { await browser.close(); server.close(); } };
}

module.exports = { openApp };
