// Verificación del Copiloto Antideudas (demo local, Supabase bloqueado, sin tocar datos reales).
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const OUT = process.argv[2] || path.join(root, 'tests', 'audit_screenshots');
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png'};
const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html';
  const f = path.join(root, p);
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': mime[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

(async () => {
  await new Promise(r => srv.listen(4598, r));
  const browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => chromium.launch({ headless: true }));
  const errors = [];
  const results = {};

  for (const vp of [{ n: 'mobile', w: 390, h: 844 }, { n: 'desktop', w: 1280, h: 860 }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.n === 'mobile', hasTouch: vp.n === 'mobile', deviceScaleFactor: 2 });
    await ctx.route(/supabase\.co/, r => r.abort());
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`[${vp.n}] ${e.message}`));
    await page.goto('http://localhost:4598/index.html?demo=1', { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    // Escenario: déficit con arrastre de Septiembre
    const cal = await page.evaluate(() => getCurrentCalendarMonthName());
    await page.evaluate((cal) => {
      const [mn, y] = cal.split(' ');
      const names = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      const prev = names[(names.indexOf(mn) + 11) % 12] + ' ' + y;
      const mk = (id, name, amount, category, status, extra = {}) => ({ id, name, amount, category, status, dueDate: '20', isInstallment: false, installmentsTotal: 1, installmentsCurrent: 1, ...extra });
      appState.transactions = {};
      appState.incomes = { 'Agosto 2026': [{ id: 'ia', name: 'x', amount: 0, status: 'Recibido', date: 1 }], 'Julio 2026': [{ id: 'ij', name: 'x', amount: 0, status: 'Recibido', date: 1 }] };
      appState.transactions[prev] = [
        mk('p1', 'Tarjeta Interbank', 400, 'Tarjetas', 'Pendiente'),
        mk('p2', 'Internet', 100, 'Internet', 'Pagado')
      ];
      appState.incomes[prev] = [{ id: 'ip', name: 'Sueldo', amount: 1000, status: 'Recibido', date: 30 }];
      appState.transactions[cal] = [
        mk('c1', 'Casa', 1500, 'Casa', 'Pendiente'),
        mk('c2', 'Prestamo Diners', 900, 'Tarjetas', 'Pendiente', { isInstallment: true, installmentsTotal: 6, installmentsCurrent: 2 }),
        mk('c3', 'Gimnasio', 180, 'Gimnasio & Salud', 'Pendiente'),
        mk('c4', 'Suscripciones', 250, 'Suscripciones', 'Pendiente'),
        mk('c5', 'Salidas', 190, 'Otros', 'Pendiente'),
        mk('c6', 'Comida', 600, 'Comida casa', 'Pendiente')
      ];
      appState.incomes[cal] = [{ id: 'ic', name: 'Sueldo', amount: 2400, status: 'Pendiente', date: 30 }];
      appState.currentMonth = cal;
      renderAll();
    }, cal);
    await page.waitForTimeout(400);

    const before = await page.evaluate(() => { const c = computeCoverage(); return { projected: c.projected, deficit: c.deficit, carry: c.carryTotal, bank: c.bank, state: c.state }; });
    results[vp.n] = { before };
    console.log('BEFORE', vp.n, JSON.stringify(before), await page.evaluate(() => JSON.stringify({ t: Object.keys(appState.transactions), c: appState.currentMonth })));

    // Banner en Inicio
    results[vp.n].bannerVisible = await page.evaluate(() => getComputedStyle(document.getElementById('rescueDashBanner')).display !== 'none');
    await page.evaluate(() => switchTab('inicio'));
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, `rescue_${vp.n}_inicio.png`) });

    // Pestaña Asesor
    await page.evaluate(() => switchTab('consejos'));
    await page.waitForTimeout(600);
    const card = page.locator('#rescueCoverageCard .rescue-card');
    results[vp.n].cardVisible = await card.isVisible();
    await card.screenshot({ path: path.join(OUT, `rescue_${vp.n}_card.png`) });

    // Seleccionar 2 gastos flexibles y verificar cálculo en vivo (sin confirmar aún)
    await page.locator('.rescue-item input').nth(0).check({ timeout: 3000 });
    await page.locator('.rescue-item input').nth(1).check({ timeout: 3000 });
    results[vp.n].liveText = await page.locator('#rescueLiveText').innerText();
    await card.screenshot({ path: path.join(OUT, `rescue_${vp.n}_selected.png`) });

    // Confirmar posposición
    await page.locator('#rescuePostponeBtn').click();
    await page.waitForTimeout(300);
    const confirmBtn = page.locator('.ui-dialog-btn.primary').first();
    await confirmBtn.click({ timeout: 4000 }).catch(e => errors.push(`[${vp.n}] confirm click: ${e.message.slice(0, 80)}`));
    await page.waitForTimeout(500);

    const after = await page.evaluate(() => { const c = computeCoverage(); return { projected: c.projected, deficit: c.deficit, nextCount: (appState.transactions[c.nextMonth] || []).length, curCount: (appState.transactions[c.month] || []).length, audit: (appState.auditLog || [])[0] }; });
    results[vp.n].after = after;
    await page.screenshot({ path: path.join(OUT, `rescue_${vp.n}_after.png`), fullPage: false });

    // Overflow horizontal
    results[vp.n].hOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    await ctx.close();
  }

  await browser.close(); srv.close();
  console.log(JSON.stringify({ results, errors }, null, 2));
})();
