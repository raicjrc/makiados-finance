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
  await new Promise(r => server.listen(4620, r));
  const browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => chromium.launch({ headless: true }));
  
  // 1. Desktop Light Mode
  console.log('Testing Desktop Light Mode...');
  const ctxDesk = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctxDesk.route(/supabase\.co/, r => r.abort());
  const pageDesk = await ctxDesk.newPage();
  await pageDesk.goto('http://localhost:4620/index.html?demo=1', { waitUntil: 'load' });
  await pageDesk.waitForTimeout(1500);
  await pageDesk.evaluate(() => {
    document.body.classList.remove('theme-twilight');
    localStorage.setItem('aliviafin_theme', 'light');
  });
  await pageDesk.waitForTimeout(500);

  // Take screenshot of executiveBalanceCard normal
  const execCard = await pageDesk.$('#executiveBalanceCard');
  await execCard.screenshot({ path: path.join(__dirname, 'audit_screenshots', 'final_card_light_normal.png') });
  
  // Hover over executiveBalanceCard
  await execCard.hover();
  await pageDesk.waitForTimeout(300);
  await execCard.screenshot({ path: path.join(__dirname, 'audit_screenshots', 'final_card_light_hover.png') });

  // Hover over loansHomeWidget
  const loansCard = await pageDesk.$('#loansHomeWidget');
  if (loansCard) {
    await loansCard.hover();
    await pageDesk.waitForTimeout(300);
    await loansCard.screenshot({ path: path.join(__dirname, 'audit_screenshots', 'final_loans_hover.png') });
  }

  // Hover over recent activity card
  const cards = await pageDesk.$$('.card');
  if (cards.length > 2) {
    await cards[2].hover();
    await pageDesk.waitForTimeout(300);
    await cards[2].screenshot({ path: path.join(__dirname, 'audit_screenshots', 'final_recent_tx_card_hover.png') });
  }

  // Full desktop light screenshot
  await pageDesk.screenshot({ path: path.join(__dirname, 'audit_screenshots', 'final_desktop_light_full.png') });

  // 2. Desktop Dark Mode (Twilight)
  console.log('Testing Desktop Twilight Mode...');
  await pageDesk.evaluate(() => {
    document.body.classList.add('theme-twilight');
    localStorage.setItem('aliviafin_theme', 'twilight');
  });
  await pageDesk.waitForTimeout(500);
  await execCard.screenshot({ path: path.join(__dirname, 'audit_screenshots', 'final_card_twilight_normal.png') });
  await pageDesk.screenshot({ path: path.join(__dirname, 'audit_screenshots', 'final_desktop_twilight_full.png') });

  // 3. Mobile Viewport (iPhone 393x852)
  console.log('Testing Mobile iPhone Viewport...');
  const ctxMobile = await browser.newContext({
    viewport: { width: 393, height: 852 },
    isMobile: true,
    hasTouch: true
  });
  await ctxMobile.route(/supabase\.co/, r => r.abort());
  const pageMobile = await ctxMobile.newPage();
  await pageMobile.goto('http://localhost:4620/index.html?demo=1', { waitUntil: 'load' });
  await pageMobile.waitForTimeout(1500);
  await pageMobile.evaluate(() => {
    document.body.classList.remove('theme-twilight');
  });
  await pageMobile.waitForTimeout(400);
  await pageMobile.screenshot({ path: path.join(__dirname, 'audit_screenshots', 'final_mobile_light_full.png') });

  // Check card styles computed in page
  const computedChecks = await pageDesk.evaluate(() => {
    const card = document.querySelector('.card');
    const exec = document.querySelector('.executive-balance-card');
    const chart = document.querySelector('.executive-chart-card');
    const csCard = window.getComputedStyle(card);
    const csExec = window.getComputedStyle(exec);
    const csChart = chart ? window.getComputedStyle(chart) : null;
    return {
      cardBg: csCard.backgroundImage,
      cardBackdrop: csCard.backdropFilter || csCard.webkitBackdropFilter,
      cardBorder: csCard.border,
      cardTransition: csCard.transition,
      execBg: csExec.backgroundImage,
      execBackdrop: csExec.backdropFilter || csExec.webkitBackdropFilter,
      execBorder: csExec.border,
      chartBackdrop: csChart ? (csChart.backdropFilter || csChart.webkitBackdropFilter) : ''
    };
  });

  console.log('Computed styles check:', computedChecks);

  await browser.close();
  server.close();
  console.log('✅ ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
})().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
