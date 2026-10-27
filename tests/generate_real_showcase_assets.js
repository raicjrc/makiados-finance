const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outDir = path.resolve(root, 'assets/app_screens');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(root, p);
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { 'Content-Type': mime[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

(async () => {
  const port = 4699;
  await new Promise(r => server.listen(port, r));
  console.log(`[server] Servidor temporal corriendo en puerto ${port}`);

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  }).catch(() => chromium.launch({ headless: true }));

  async function setupData(page) {
    await page.evaluate(() => {
      // 1. FORZAR MODO CLARO (Crystal)
      localStorage.setItem('finanzas_theme', 'crystal');
      localStorage.setItem('aliviafin_theme_v72_migrated', 'true');
      document.documentElement.classList.remove('theme-twilight');
      document.body.classList.remove('theme-twilight');
      if (typeof updateThemeButtons === 'function') updateThemeButtons('crystal');

      // 2. CONFIGURACIÓN 100% PERSONAL (Cuentas individuales para personas de a pie)
      const curM = 'Octubre 2026';
      appState.currentMonth = curM;
      appState.salary = 3500;
      appState.currency = 'PEN';
      appState.onboardingCompleted = true;
      appState.activeCategoryChip = 'TODAS';
      appState.activeStatusFilter = 'TODOS';
      appState.currentUser = 'César';
      appState.users = ['César'];

      appState.incomes = {
        [curM]: [
          { id: 'inc_1', name: 'Sueldo Quincenal (Ingreso Principal)', amount: 3200, category: 'Sueldo', date: 15, user: 'César' },
          { id: 'inc_2', name: 'Ingreso Extra / Freelance', amount: 800, category: 'Freelance', date: 20, user: 'César' }
        ]
      };

      appState.transactions = {
        [curM]: [
          { id: 't1', name: 'Supermercado Metro (Semana)', amount: 165.00, category: 'Alimentación', status: 'Pagado', paymentMethod: 'BCP', date: 25, user: 'César' },
          { id: 't2', name: 'Menú Ejecutivo & Café', amount: 24.00, category: 'Alimentación', status: 'Pagado', paymentMethod: 'Yape', date: 25, user: 'César' },
          { id: 't3', name: 'Recibo Luz del Sur', amount: 86.50, category: 'Servicios', status: 'Pagado', paymentMethod: 'BCP', date: 22, user: 'César' },
          { id: 't4', name: 'Farmacia Inkafarma', amount: 38.00, category: 'Salud', status: 'Pagado', paymentMethod: 'Plin', date: 21, user: 'César' },
          { id: 't5', name: 'Gasolina Primax', amount: 70.00, category: 'Transporte', status: 'Pagado', paymentMethod: 'Efectivo', date: 19, user: 'César' },
          { id: 't6', name: 'Zapatos Falabella (Cuota 3/3)', amount: 100.00, category: 'Ropa', status: 'Pagado', paymentMethod: 'Tarjeta', date: 12, isInstallment: true, installmentsTotal: 3, installmentsCurrent: 3, user: 'César' },
          { id: 't7', name: 'Celular Entel (Cuota 2/6)', amount: 180.00, category: 'Tecnología', status: 'Pendiente', dueDate: '28', paymentMethod: 'Tarjeta', isInstallment: true, installmentsTotal: 6, installmentsCurrent: 2, user: 'César' },
          { id: 't8', name: 'Laptop BCP Trabajo (Cuota 4/12)', amount: 320.00, category: 'Tecnología', status: 'Pendiente', dueDate: '30', paymentMethod: 'Tarjeta', isInstallment: true, installmentsTotal: 12, installmentsCurrent: 4, user: 'César' }
        ]
      };

      currentSnowballDebts = [
        {
          id: 'd1',
          name: 'Zapatos Falabella (3 cuotas)',
          balance: 100.00,
          minPayment: 100.00,
          tea: 0,
          initialBalance: 300.00,
          remainingInstallments: 1,
          installmentsTotal: 3,
          installmentsCurrent: 3
        },
        {
          id: 'd2',
          name: 'Celular Entel (6 cuotas)',
          balance: 720.00,
          minPayment: 180.00,
          tea: 0,
          initialBalance: 1080.00,
          remainingInstallments: 4,
          installmentsTotal: 6,
          installmentsCurrent: 2
        },
        {
          id: 'd3',
          name: 'Laptop Trabajo BCP (12 cuotas)',
          balance: 2560.00,
          minPayment: 320.00,
          tea: 0,
          initialBalance: 3840.00,
          remainingInstallments: 8,
          installmentsTotal: 12,
          installmentsCurrent: 4
        }
      ];

      // Préstamos y cobros personales (Cuentas Claras)
      appState.loans = [
        { id: 'l1', type: 'receivable', person: 'Carlos (Amigo)', concept: 'Pichanga + rehidratantes', amount: 35.00, status: 'pending', date: '2026-10-24' },
        { id: 'l2', type: 'receivable', person: 'Primo Luis', concept: 'Arreglo de moto', amount: 120.00, status: 'pending', date: '2026-10-20' },
        { id: 'l3', type: 'payable', person: 'Mamá', concept: 'Compras mercado fin de semana', amount: 60.00, status: 'pending', date: '2026-10-25' }
      ];

      snowballAccelerator = 100;
      if (typeof saveLocalState === 'function') saveLocalState();
      if (typeof renderAll === 'function') renderAll();
      if (typeof renderSnowballSection === 'function') renderSnowballSection();
      if (typeof renderLoansDashboard === 'function') renderLoansDashboard();
    });
  }

  // --- 1. CAPTURA DESKTOP (MacBook Pro 16: 1440 x 900 @ 2x) EN MODO CLARO ---
  console.log('[desktop] Generando capturas de escritorio en MODO CLARO...');
  const deskCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  await deskCtx.route(/supabase\.co/, r => r.abort());
  const deskPage = await deskCtx.newPage();
  await deskPage.addInitScript(() => {
    localStorage.setItem('finanzas_theme', 'crystal');
    localStorage.setItem('aliviafin_theme_v72_migrated', 'true');
  });
  await deskPage.goto(`http://localhost:${port}/index.html?demo=1`, { waitUntil: 'load' });
  await deskPage.waitForTimeout(1000);
  await setupData(deskPage);
  await deskPage.waitForTimeout(800);

  // 1.1 Desktop Inicio
  await deskPage.evaluate(() => switchTab('inicio'));
  await deskPage.waitForTimeout(500);
  await deskPage.screenshot({ path: path.join(outDir, 'real_desktop_inicio.png'), fullPage: false });
  console.log('✓ Capturado real_desktop_inicio.png (Modo Claro)');

  // 1.2 Desktop Deudas
  await deskPage.evaluate(() => {
    switchTab('deudas');
    if (typeof switchAdvisorView === 'function') switchAdvisorView('deudas');
    if (typeof renderSnowballSection === 'function') renderSnowballSection();
  });
  await deskPage.waitForTimeout(500);
  await deskPage.screenshot({ path: path.join(outDir, 'real_desktop_deudas.png'), fullPage: false });
  console.log('✓ Capturado real_desktop_deudas.png (Modo Claro)');

  // 1.3 Desktop Plan 50/30/20
  await deskPage.evaluate(() => switchTab('plan'));
  await deskPage.waitForTimeout(500);
  await deskPage.screenshot({ path: path.join(outDir, 'real_desktop_plan.png'), fullPage: false });
  console.log('✓ Capturado real_desktop_plan.png (Modo Claro)');

  // 1.4 Desktop Cuentas Claras
  await deskPage.evaluate(() => {
    switchTab('prestamos');
    if (typeof renderLoansDashboard === 'function') renderLoansDashboard();
  });
  await deskPage.waitForTimeout(500);
  await deskPage.screenshot({ path: path.join(outDir, 'real_desktop_cuentas_claras.png'), fullPage: false });
  console.log('✓ Capturado real_desktop_cuentas_claras.png (Modo Claro)');

  // --- 2. CAPTURA MOBILE (iPhone 14 Pro: 390 x 844 @ 3x) EN MODO CLARO ---
  console.log('[mobile] Generando capturas móviles en MODO CLARO...');
  const mobCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  await mobCtx.route(/supabase\.co/, r => r.abort());
  const mobPage = await mobCtx.newPage();
  await mobPage.addInitScript(() => {
    localStorage.setItem('finanzas_theme', 'crystal');
    localStorage.setItem('aliviafin_theme_v72_migrated', 'true');
  });
  await mobPage.goto(`http://localhost:${port}/index.html?demo=1`, { waitUntil: 'load' });
  await mobPage.waitForTimeout(1000);
  await setupData(mobPage);
  await mobPage.waitForTimeout(800);

  // 2.1 Mobile Inicio
  await mobPage.evaluate(() => switchTab('inicio'));
  await mobPage.waitForTimeout(500);
  await mobPage.screenshot({ path: path.join(outDir, 'real_mobile_inicio.png'), fullPage: false });
  console.log('✓ Capturado real_mobile_inicio.png (Modo Claro)');

  // 2.2 Mobile Deudas
  await mobPage.evaluate(() => {
    switchTab('deudas');
    if (typeof switchAdvisorView === 'function') switchAdvisorView('deudas');
    if (typeof renderSnowballSection === 'function') renderSnowballSection();
  });
  await mobPage.waitForTimeout(500);
  await mobPage.screenshot({ path: path.join(outDir, 'real_mobile_deudas.png'), fullPage: false });
  console.log('✓ Capturado real_mobile_deudas.png (Modo Claro)');

  // 2.3 Mobile Plan 50/30/20
  await mobPage.evaluate(() => switchTab('plan'));
  await mobPage.waitForTimeout(500);
  await mobPage.screenshot({ path: path.join(outDir, 'real_mobile_plan.png'), fullPage: false });
  console.log('✓ Capturado real_mobile_plan.png (Modo Claro)');

  // 2.4 Mobile Cuentas Claras
  await mobPage.evaluate(() => {
    switchTab('prestamos');
    if (typeof renderLoansDashboard === 'function') renderLoansDashboard();
  });
  await mobPage.waitForTimeout(500);
  await mobPage.screenshot({ path: path.join(outDir, 'real_mobile_cuentas_claras.png'), fullPage: false });
  console.log('✓ Capturado real_mobile_cuentas_claras.png (Modo Claro)');

  await browser.close();
  server.close();
  console.log('--- ¡TODAS LAS CAPTURAS EN MODO CLARO Y DATOS PERSONALES GENERADAS CON ÉXITO! ---');
})();
