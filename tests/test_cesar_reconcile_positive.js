const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const ctx = await browser.newContext({ serviceWorkers: 'block' });
  const page = await ctx.newPage();
  let serverData = null;
  page.on('console', m => {
    const t = m.text();
    if (/Sync|Reconcil|Error|error|Guard|logout/i.test(t)) console.log('LOG:', t);
  });
  await page.route('**/*supabase.co/**', async route => {
    const req = route.request();
    const url = new URL(req.url());
    const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*', 'content-type': 'application/json' };
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    if (!url.pathname.includes('/rest/v1/finanzas_state')) return route.fulfill({ status: 404, headers: cors, body: '{}' });
    if (req.method() === 'GET') {
      const single = (req.headers()['accept'] || '').includes('vnd.pgrst.object');
      if (!serverData) {
        // First fetch: balance is 0.76 (e.g. Incomes = 9225, Paid = 9224.24)
        return route.fulfill({ status: 200, headers: cors, body: JSON.stringify(single ? { data: {
          salary: 8800, currentMonth: 'Octubre 2026', onboardingCompleted: true, _lastSaved: 1700000000000,
          transactions: { 'Octubre 2026': [{ id: 't1', name: 'Gasto1', amount: 9224.24, status: 'Pagado' }] },
          incomes: { 'Octubre 2026': [
            { id: 'i1', name: 'Sueldo César', amount: 4200, status: 'Recibido', date: 1 },
            { id: 'i2', name: 'Sueldo Gaby', amount: 4200, status: 'Recibido', date: 1 },
            { id: 'i3', name: 'Extra', amount: 825, status: 'Recibido', date: 1 }
          ] }
        }} : [{ data: {} }]) });
      }
      return route.fulfill({ status: 200, headers: cors, body: JSON.stringify(single ? { data: serverData } : [{ data: serverData }]) });
    }
    if (req.method() === 'POST') {
      const b = JSON.parse(req.postData());
      serverData = b.data;
      console.log('>>> SERVER RECEIVED SAVE! Incomes in Octubre:', serverData.incomes['Octubre 2026'].map(i => i.name));
      return route.fulfill({ status: 201, headers: cors, body: '' });
    }
    return route.fulfill({ status: 200, headers: cors, body: '{}' });
  });

  await page.goto('http://localhost:8089/index.html');
  await page.waitForTimeout(1000);
  await page.evaluate(() => localStorage.clear());
  await page.evaluate(() => window.testBypassLogin('cesar.risso.f@gmail.com'));
  await page.waitForTimeout(3000);

  const b1 = await page.evaluate(() => getAccumulatedBalance(appState.currentMonth));
  console.log('Balance before reconcile:', b1);

  // User conciliar
  await page.evaluate(() => {
    document.getElementById('reconcileBankInput').value = '104.33';
    calculateReconciliationDiff();
    applyReconciliationAdjustment();
  });
  const b2 = await page.evaluate(() => getAccumulatedBalance(appState.currentMonth));
  console.log('Balance after reconcile in memory:', b2);

  // User logs out IMMEDIATELY
  await page.evaluate(() => { window.uiConfirm = async () => true; });
  await page.evaluate(() => handleLogout());
  await page.waitForTimeout(1000);

  // User logs back in
  await page.evaluate(() => window.testBypassLogin('cesar.risso.f@gmail.com'));
  await page.waitForTimeout(3000);

  const b3 = await page.evaluate(() => getAccumulatedBalance(appState.currentMonth));
  console.log('Balance after login:', b3);

  await browser.close();
})();
