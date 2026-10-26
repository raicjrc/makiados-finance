const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png'
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
  await new Promise(r => server.listen(4630, r));
  const browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => chromium.launch({ headless: true }));

  // 1. Mobile iPhone Viewport
  console.log('Testing Mobile iPhone Viewport...');
  const ctxMobile = await browser.newContext({
    viewport: { width: 393, height: 852 },
    isMobile: true,
    hasTouch: true
  });
  await ctxMobile.route(/supabase\.co/, r => r.abort());
  const pageMobile = await ctxMobile.newPage();
  await pageMobile.goto('http://localhost:4630/index.html?demo=1', { waitUntil: 'load' });
  await pageMobile.waitForTimeout(1500);

  // Abrir Modal Rápido (+)
  console.log('Opening Quick Expense Modal...');
  await pageMobile.evaluate(() => {
    openQuickExpenseModal();
  });
  await pageMobile.waitForTimeout(400);

  // Comprobar elementos
  const hasSmartInput = await pageMobile.$eval('#smartQuickExpenseInput', el => !!el);
  const hasVoiceBtn = await pageMobile.$eval('#smartVoiceBtn', el => !!el);
  console.log('Elements check:', { hasSmartInput, hasVoiceBtn });
  if (!hasSmartInput || !hasVoiceBtn) throw new Error('Smart input elements missing!');

  // Escribir "35 almuerzo yape"
  console.log('Typing: "35 almuerzo yape"...');
  await pageMobile.fill('#smartQuickExpenseInput', '35 almuerzo yape');
  await pageMobile.waitForTimeout(300);

  // Verificar sincronización en runtime
  const stateCheck = await pageMobile.evaluate(() => {
    const displayAmt = document.getElementById('quickDisplayAmount').textContent;
    const isYapeActive = document.getElementById('quickMethodYape').classList.contains('active');
    const chipAmt = document.getElementById('smartChipAmountText').textContent;
    const chipCat = document.getElementById('smartChipCatText').textContent;
    const chipMethod = document.getElementById('smartChipMethodText').textContent;
    const previewVisible = document.getElementById('smartChipsPreview').style.display !== 'none';
    return {
      displayAmt,
      isYapeActive,
      chipAmt,
      chipCat,
      chipMethod,
      previewVisible
    };
  });
  console.log('State check after typing:', stateCheck);

  if (stateCheck.displayAmt !== '35') throw new Error(`Display amount should be 35, got: ${stateCheck.displayAmt}`);
  if (!stateCheck.isYapeActive) throw new Error('Yape should be active');
  if (!stateCheck.previewVisible) throw new Error('Preview chips should be visible');
  if (!stateCheck.chipAmt.includes('35')) throw new Error('Chip amount should contain 35');
  if (!stateCheck.chipCat.includes('Almuerzo')) throw new Error('Chip category should contain Almuerzo');

  // Capturar screenshot móvil con el modal abierto y los chips dinámicos
  await pageMobile.screenshot({ path: path.join(__dirname, 'audit_screenshots', 'smart_quick_input_mobile.png') });
  console.log('Saved screenshot: smart_quick_input_mobile.png');

  // Presionar Enter para guardar
  console.log('Pressing Enter to save expense...');
  const initialTxCount = await pageMobile.evaluate(() => {
    const m = appState.currentMonth;
    return (appState.transactions[m] || []).length;
  });

  await pageMobile.evaluate(() => {
    handleSmartQuickInputEnter();
  });
  await pageMobile.waitForTimeout(500);

  const afterSaveCheck = await pageMobile.evaluate((initCount) => {
    const m = appState.currentMonth;
    const txs = appState.transactions[m] || [];
    const newTx = txs[txs.length - 1];
    return {
      countIncreased: txs.length === initCount + 1,
      newTx
    };
  }, initialTxCount);

  console.log('After save check:', afterSaveCheck);
  if (!afterSaveCheck.countIncreased) throw new Error('Transaction count did not increase!');
  if (afterSaveCheck.newTx.amount !== 35) throw new Error(`Tx amount should be 35, got: ${afterSaveCheck.newTx.amount}`);
  if (afterSaveCheck.newTx.name !== 'Almuerzo') throw new Error(`Tx name should be Almuerzo, got: ${afterSaveCheck.newTx.name}`);
  if (afterSaveCheck.newTx.paymentMethod !== 'Yape') throw new Error(`Tx method should be Yape, got: ${afterSaveCheck.newTx.paymentMethod}`);
  if (afterSaveCheck.newTx.category !== 'Comida fuera') throw new Error(`Tx category should be Comida fuera, got: ${afterSaveCheck.newTx.category}`);

  // 2. Desktop Viewport
  console.log('Testing Desktop Viewport...');
  const ctxDesktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctxDesktop.route(/supabase\.co/, r => r.abort());
  const pageDesk = await ctxDesktop.newPage();
  await pageDesk.goto('http://localhost:4630/index.html?demo=1', { waitUntil: 'load' });
  await pageDesk.waitForTimeout(1000);

  await pageDesk.evaluate(() => {
    openQuickExpenseModal();
  });
  await pageDesk.waitForTimeout(400);

  // Escribir "15 taxi san isidro efectivo"
  await pageDesk.fill('#smartQuickExpenseInput', '15 taxi san isidro efectivo');
  await pageDesk.waitForTimeout(300);

  // Capturar screenshot desktop
  await pageDesk.screenshot({ path: path.join(__dirname, 'audit_screenshots', 'smart_quick_input_desktop.png') });
  console.log('Saved screenshot: smart_quick_input_desktop.png');

  await browser.close();
  server.close();
  console.log('🎉 ALL SMART QUICK-INPUT TESTS PASSED 100%!');
})().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
