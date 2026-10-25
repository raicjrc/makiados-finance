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
  await new Promise(r => server.listen(4611, r));
  const browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => chromium.launch({ headless: true }));
  
  // 1. Mobile viewport (iPhone 14/15/16)
  const ctxMobile = await browser.newContext({
    viewport: { width: 393, height: 852 },
    isMobile: true,
    hasTouch: true
  });
  await ctxMobile.route(/supabase\.co/, r => r.abort());
  const pageMobile = await ctxMobile.newPage();
  
  console.log('Testing Mobile Viewport...');
  await pageMobile.goto('http://localhost:4611/index.html?demo=1', { waitUntil: 'load' });
  await pageMobile.waitForTimeout(2000);

  // Verificar tarjeta de saldo y Liquid Glass
  const cardStyles = await pageMobile.evaluate(() => {
    const card = document.getElementById('executiveBalanceCard');
    const badge = document.getElementById('execDailyLimitBadge');
    const text = document.getElementById('execDailyLimitText');
    const csCard = card ? window.getComputedStyle(card) : null;
    const csBadge = badge ? window.getComputedStyle(badge) : null;
    return {
      hasCard: !!card,
      hasBadge: !!badge,
      badgeText: text ? text.textContent : '',
      backdropFilter: csCard ? (csCard.backdropFilter || csCard.webkitBackdropFilter) : '',
      boxShadow: csCard ? csCard.boxShadow : '',
      badgeDisplay: csBadge ? csBadge.display : ''
    };
  });

  console.log('Mobile Card & Badge Audit:', cardStyles);
  if (!cardStyles.hasCard) throw new Error('executiveBalanceCard not found');
  if (!cardStyles.hasBadge) throw new Error('execDailyLimitBadge not found');
  if (!cardStyles.badgeText.includes('Límite sugerido de hoy: S/')) {
    throw new Error('Badge text does not contain expected copy: ' + cardStyles.badgeText);
  }

  // 2. Probar detector de duplicados en runtime
  console.log('Testing Duplicate Expense Detector...');
  const dupResult = await pageMobile.evaluate(() => {
    // Probar función findRecentDuplicateExpense
    const month = appState.currentMonth;
    const now = Date.now();
    
    // Inyectar un gasto reciente
    appState.transactions[month].push({
      id: `tx_${now}_dup1`,
      name: 'Almuerzo Menu',
      amount: 25.00,
      category: 'Alimentos',
      status: 'Pagado'
    });

    const isDetected = typeof findRecentDuplicateExpense === 'function' ?
      findRecentDuplicateExpense('Almuerzo Menu', 25.00, month) : null;

    const notDetectedDiffAmount = typeof findRecentDuplicateExpense === 'function' ?
      findRecentDuplicateExpense('Almuerzo Menu', 30.00, month) : null;

    return {
      detected: !!isDetected,
      diffAmountDetected: !!notDetectedDiffAmount
    };
  });

  console.log('Duplicate detector evaluation:', dupResult);
  if (!dupResult.detected) throw new Error('Duplicate was NOT detected');
  if (dupResult.diffAmountDetected) throw new Error('Different amount should not trigger duplicate');

  // 3. Probar en Desktop (macOS Safari 1280x800)
  console.log('Testing Desktop Viewport...');
  const ctxDesktop = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctxDesktop.route(/supabase\.co/, r => r.abort());
  const pageDesktop = await ctxDesktop.newPage();
  await pageDesktop.goto('http://localhost:4611/index.html?demo=1', { waitUntil: 'load' });
  await pageDesktop.waitForTimeout(2000);

  const deskBadgeText = await pageDesktop.$eval('#execDailyLimitText', el => el.textContent);
  console.log('Desktop Daily Limit Badge Text:', deskBadgeText);
  if (!deskBadgeText.includes('Límite sugerido de hoy: S/')) {
    throw new Error('Desktop badge does not contain expected copy: ' + deskBadgeText);
  }

  // Capturar screenshot móvil para inspección visual
  await pageMobile.screenshot({ path: path.join(__dirname, 'audit_screenshots', 'liquid_glass_mobile_verified.png') });
  console.log('✅ Screenshot guardado en tests/audit_screenshots/liquid_glass_mobile_verified.png');

  await browser.close();
  server.close();
  console.log('🎉 ALL TESTS PASSED WITH 100% SUCCESS!');
})().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
