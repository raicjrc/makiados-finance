// Escenarios E2E con Supabase 100% simulado (no toca la nube real).
// Uso: (servidor estático en :8089)  node tests/test_onboarding_server_scenarios.js
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:8089/index.html';

const REAL = {
  salary: 5000, currency: 'PEN', currentMonth: 'Octubre 2026',
  transactions: { 'Octubre 2026': [{ id: 't1', name: 'Alquiler', amount: 650, status: 'Pendiente', category: 'Vivienda' }] },
  incomes: {}, extraIncomes: {}, savingsGoals: [], recurringDueDates: {}, _lastSaved: 1790000000000
};

async function run(name, { mainRow, session, backup }, expect) {
  const browser = await chromium.launch({ channel: 'chrome' });
  const ctx = await browser.newContext({ serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const writes = [];
  await page.route('**/*supabase.co/**', async route => {
    const req = route.request(); const url = new URL(req.url());
    const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' };
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    if (!url.pathname.includes('/rest/v1/finanzas_state')) return route.fulfill({ status: 404, headers: cors, body: '{}' });
    const id = url.searchParams.get('id') || '';
    if (req.method() === 'GET') {
      const single = (req.headers()['accept'] || '').includes('vnd.pgrst.object');
      if (id.startsWith('like.backup_')) return route.fulfill({ status: 200, headers: { ...cors, 'content-type': 'application/json' }, body: JSON.stringify(backup ? [{ id: 'backup_x_2026-10-01', data: backup }] : []) });
      if (mainRow) return route.fulfill({ status: 200, headers: { ...cors, 'content-type': 'application/json' }, body: JSON.stringify(single ? { data: mainRow } : [{ data: mainRow }]) });
      if (single) return route.fulfill({ status: 406, headers: { ...cors, 'content-type': 'application/json' }, body: JSON.stringify({ code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' }) });
      return route.fulfill({ status: 200, headers: { ...cors, 'content-type': 'application/json' }, body: '[]' });
    }
    // Solo cuentan los upsert que escriben la fila principal del usuario (no respaldos ni heartbeat)
    if (req.method() === 'POST' && (req.postData() || '').includes('"id":"state_')) writes.push(req.postData() || '');
    return route.fulfill({ status: 201, headers: cors, body: '' });
  });
  await page.goto(BASE); await page.waitForTimeout(1500);
  await page.evaluate(() => localStorage.clear());
  await page.evaluate(s => {
    supabaseClient.auth.getSession = async () => ({ data: { session: s ? { user: { id: 'u1' } } : null } });
  }, session);
  await page.evaluate(() => window.testBypassLogin('prueba.nueva@example.com'));
  await page.waitForTimeout(6500);
  const r = await page.evaluate(() => ({
    wizard: document.getElementById('onboardingWizardModal').classList.contains('active'),
    loaded: window._serverStateLoaded === true,
    salary: appState.salary
  }));
  await browser.close();
  const ok = expect(r, writes);
  console.log((ok ? '✅ PASS: ' : '❌ FAIL: ') + name, JSON.stringify({ ...r, writes: writes.length }));
  return ok;
}

(async () => {
  const results = [];
  results.push(await run('A) Cuenta con datos en servidor: sin tour, sin pisar', { mainRow: REAL, session: true },
    (r, w) => !r.wizard && r.loaded && r.salary === 5000 && !w.some(b => b.includes('"salary":0'))));
  results.push(await run('B) Sesión no lista + 0 filas: sin tour y SIN escrituras', { mainRow: null, session: false },
    (r, w) => !r.wizard && !r.loaded && w.length === 0));
  results.push(await run('C) 0 filas pero hay respaldo: restaura, sin tour', { mainRow: null, session: true, backup: REAL },
    (r, w) => !r.wizard && r.loaded && r.salary === 5000));
  results.push(await run('D) Cuenta genuinamente nueva: SÍ muestra el asistente', { mainRow: null, session: true },
    (r, w) => r.wizard && r.loaded));
  process.exit(results.every(Boolean) ? 0 : 1);
})();
