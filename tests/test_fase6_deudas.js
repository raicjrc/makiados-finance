const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const scratchDir = '/Users/cesarrisso/.gemini/antigravity-ide/brain/4fc6fcec-8710-4368-8dde-91fc7fe02ab7/scratch';
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

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

  for (const vp of [{ n: 'mobile', w: 390, h: 844 }, { n: 'desktop', w: 1280, h: 860 }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.n === 'mobile', hasTouch: vp.n === 'mobile', deviceScaleFactor: 2 });
    await ctx.route(/supabase\.co/, r => r.abort());
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`[${vp.n}] ${e.stack || e.message}`));
    await page.goto('http://localhost:4598/index.html?demo=1', { waitUntil: 'load' });
    await page.waitForTimeout(1500);

    // Navegar a Deudas
    await page.evaluate(() => switchAdvisorView('deudas'));
    await page.waitForTimeout(500);

    // 1. Captura Estado Vacío
    await page.screenshot({ path: path.join(scratchDir, `fase6_${vp.n}_empty.png`), fullPage: false });

    // 2. Inyectar deudas de prueba realistas para evaluar visualmente la experiencia
    await page.evaluate(() => {
      currentSnowballDebts = [
        {
          id: 'd_test_1',
          name: 'Zapatos Zara (3 cuotas)',
          balance: 150.00,
          minPayment: 75.00,
          tea: 0,
          initialBalance: 225.00,
          remainingInstallments: 2,
          installmentsTotal: 3,
          installmentsCurrent: 2
        },
        {
          id: 'd_test_2',
          name: 'Laptop HP Falabella',
          balance: 1800.00,
          minPayment: 200.00,
          tea: 0,
          initialBalance: 2400.00,
          remainingInstallments: 9,
          installmentsTotal: 12,
          installmentsCurrent: 4
        },
        {
          id: 'd_test_3',
          name: 'Préstamo Personal BCP',
          balance: 3500.00,
          minPayment: 320.00,
          tea: 28.5,
          initialBalance: 4500.00,
          remainingInstallments: 12,
          installmentsTotal: 18,
          installmentsCurrent: 7
        }
      ];
      calculateAndRenderDebtPlan(0);
    });
    await page.waitForTimeout(500);

    // 3. Captura con deudas y acelerador en S/ 0
    await page.screenshot({ path: path.join(scratchDir, `fase6_${vp.n}_active_zero_extra.png`), fullPage: false });

    // 4. Captura con scroll hacia las tarjetas en móvil
    if (vp.n === 'mobile') {
      await page.evaluate(() => window.scrollBy(0, 1300));
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(scratchDir, `fase6_mobile_cards_scrolled.png`), fullPage: false });
      await page.evaluate(() => window.scrollTo(0, 0));
    }

    // 5. Probar Preset +S/ 100
    await page.evaluate(() => setSnowballExtraPreset(100));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(scratchDir, `fase6_${vp.n}_active_extra100.png`), fullPage: false });

    // 5. Probar cambio a Avalancha (Menos intereses)
    await page.evaluate(() => setDebtStrategy('avalanche'));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(scratchDir, `fase6_${vp.n}_avalanche.png`), fullPage: false });

    console.log(`[${vp.n}] Todos los estados de Fase 6 evaluados con éxito.`);
  }

  await browser.close();
  srv.close();

  if (errors.length) {
    console.error('Errors found:', errors);
    process.exit(1);
  } else {
    console.log('FASE 6 TEST COMPLETED SUCCESSFULLY WITH 0 ERRORS!');
  }
})();
