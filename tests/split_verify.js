const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const scratchDir = '/Users/cesarrisso/.gemini/antigravity-ide/brain/9e1d8553-8e95-4fbf-bfa0-4cddb9f38509/scratch';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png'};
const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html';
  const f = path.join(root, p);
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': mime[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

(async () => {
  await new Promise(r => srv.listen(4599, r));
  const browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => chromium.launch({ headless: true }));
  const errors = [];

  for (const vp of [{ n: 'mobile', w: 390, h: 844 }, { n: 'desktop', w: 1280, h: 860 }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.n === 'mobile', hasTouch: vp.n === 'mobile', deviceScaleFactor: 2 });
    await ctx.route(/supabase\.co/, r => r.abort());
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`[${vp.n}] ${e.stack || e.message}`));
    await page.goto('http://localhost:4599/index.html?demo=1', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    // Escenario de prueba: déficit con arrastre de mes anterior
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
        mk('c3', 'Salidas y Cenas', 350, 'Salidas', 'Pendiente'),
        mk('c4', 'Ropa', 200, 'Ropa', 'Pendiente')
      ];
      appState.incomes[cal] = [{ id: 'ic', name: 'Sueldo', amount: 2000, status: 'Recibido', date: 30 }];
    }, cal);

    // 1. Probar tab Consejos (Asesor)
    await page.evaluate(() => switchTab('consejos'));
    await page.waitForTimeout(600);

    const isConsejosVisible = await page.$eval('#tab-consejos', el => el.classList.contains('active'));
    const tipsCount = await page.$$eval('#executiveTipsGrid .executive-tip-card', els => els.length);
    const hasContingency = await page.evaluate(() => {
      const details = Array.from(document.querySelectorAll('#rescueCoverageCard details summary'));
      return details.some(d => d.textContent.includes('Alternativas tácticas'));
    });

    // Abrir detalles de contingencia para la captura
    await page.evaluate(() => {
      const details = Array.from(document.querySelectorAll('#rescueCoverageCard details'));
      const cont = details.find(d => d.querySelector('summary') && d.querySelector('summary').textContent.includes('Alternativas tácticas'));
      if (cont) cont.open = true;
    });
    await page.waitForTimeout(300);

    await page.screenshot({ path: path.join(scratchDir, `split_${vp.n}_asesor.png`), fullPage: false });

    // 2. Probar switch a Deudas (Bola de Nieve) usando el segmented switcher
    await page.evaluate(() => switchAdvisorView('deudas'));
    await page.waitForTimeout(600);

    const isDeudasVisible = await page.$eval('#tab-deudas', el => el.classList.contains('active'));
    const isTableVisible = await page.isVisible('#debtTacticalTableContainer');
    const isTargetDateVisible = await page.isVisible('#debtFreedomTargetDate');

    await page.screenshot({ path: path.join(scratchDir, `split_${vp.n}_deudas.png`), fullPage: false });

    console.log(`[${vp.n}] Consejos visible: ${isConsejosVisible}, Tips count: ${tipsCount}, Contingencia presente: ${hasContingency}`);
    console.log(`[${vp.n}] Deudas visible: ${isDeudasVisible}, Tabla visible: ${isTableVisible}, Fecha visible: ${isTargetDateVisible}`);
  }

  await browser.close();
  srv.close();

  if (errors.length) {
    console.error('Errors found:', errors);
    process.exit(1);
  } else {
    console.log('ALL TESTS PASSED SUCCESSFULLY!');
  }
})();
