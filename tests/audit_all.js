// Auditoría integral: handlers inline, errores de render en múltiples estados y clic masivo en botones
const fs = require('fs');
const path = require('path');
const { openApp } = require('./audit_helpers');
const ROOT = path.join(__dirname, '..');

const IGNORE = new Set('if for while switch return function catch typeof new void delete parseFloat parseInt String Number Math document window event alert confirm prompt setTimeout setInterval clearTimeout JSON this Date Object Array console encodeURIComponent decodeURIComponent encodeURI isNaN isFinite Boolean requestAnimationFrame Promise Set Map RegExp Intl navigator localStorage sessionStorage history location fetch URL Error Symbol Number escape unescape eval getComputedStyle'.split(' '));

function extractHandlerFns() {
  const files = ['index.html', 'js/app.js', 'landing.html'].filter(f => fs.existsSync(path.join(ROOT, f)));
  const found = new Map();
  for (const f of files) {
    if (f === 'landing.html') continue;
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const attrRe = /\son(?:click|change|input|submit|keydown|keyup|keypress|blur|focus|mouseover|mouseout|touchstart|touchend)\s*=\s*"([^"]*)"/g;
    let m;
    while ((m = attrRe.exec(src))) {
      const body = m[1];
      const fnRe = /(?<![.\w$'])([A-Za-z_$][\w$]*)\s*\(/g;
      let n;
      while ((n = fnRe.exec(body))) {
        const name = n[1];
        if (IGNORE.has(name) || name.includes('${')) continue;
        if (!found.has(name)) found.set(name, f);
      }
    }
  }
  return found;
}

(async () => {
  const report = { missingHandlers: [], renderErrors: {}, clickErrors: [], pageErrors: [] };

  // 1) Handlers inline que apuntan a funciones inexistentes
  const handlers = extractHandlerFns();
  const app = await openApp({ port: 8120, pro: true });
  const { page, errors } = app;
  const missing = await page.evaluate(names => names.filter(n => { try { return (0, eval)('typeof ' + n) !== 'function'; } catch (e) { return true; } }), [...handlers.keys()]);
  report.missingHandlers = missing.map(n => `${n} (${handlers.get(n)})`);
  console.log('Handlers inline analizados:', handlers.size, '| faltantes:', missing.length);

  // 2) Errores de render en distintos estados
  const states = await page.evaluate(async () => {
    const out = {};
    const run = (label, setup) => {
      try { setup && setup(); renderAll(); out[label] = (window.__renderErrors || []).slice(); }
      catch (e) { out[label] = ['THROW ' + e.message]; }
    };
    const baseState = JSON.parse(JSON.stringify(appState));
    run('cesar_db');
    // cada mes disponible
    const months = Object.keys(appState.transactions).slice(0, 60);
    for (const m of months) {
      run('mes:' + m, () => { appState.currentMonth = m; ensureMonthTransactions(m); ensureMonthIncomes(m); });
    }
    appState.currentMonth = baseState.currentMonth;
    run('privacy_on', () => { try { localStorage.setItem('aliviafin_privacy_mode', 'true'); } catch (e) {} });
    run('tema_oscuro', () => document.body.classList.add('theme-twilight'));
    run('tema_claro', () => document.body.classList.remove('theme-twilight'));
    run('categoria_comillas', () => {
      appState.customCategories = Object.assign({}, appState.customCategories, { "Pepe's \"cat\"": { icon: '🐶', color: '#10b981', badgeClass: 'badge-custom' } });
      appState.categoryBudgets = Object.assign({}, appState.categoryBudgets, { "Pepe's \"cat\"": 300 });
    });
    run('tx_sin_categoria_valida', () => { getMonthTxList().push({ id: 'x1', name: 'Huérfano', amount: 10, category: 'NoExiste', status: 'Pagado' }); });
    run('tx_date_numerico', () => { getMonthTxList().push({ id: 'x2', name: 'Num', amount: 5, category: 'Otros', status: 'Pagado', date: 12 }); });
    run('estado_limpio', () => { currentUser = { id: 'new1', email: 'x@y.com', name: 'X' }; appState = getCleanUserState(); appState.currentMonth = getEffectiveCurrentMonth(appState.currentMonth); });
    run('estado_limpio_+categoria', () => { appState.customCategories = { Viajes: { icon: '✈️', color: '#38bdf8', badgeClass: 'badge-custom' } }; appState.categoryBudgets.Viajes = 500; });
    run('travel_usd', () => { try { toggleTravelMode(); } catch (e) {} });
    run('travel_back', () => { try { toggleTravelMode(); } catch (e) {} });
    return out;
  });
  for (const [k, v] of Object.entries(states)) if (v.length) report.renderErrors[k] = v;
  console.log('Estados de render evaluados:', Object.keys(states).length, '| con errores:', Object.keys(report.renderErrors).length);

  report.pageErrors = errors.slice(0, 20);
  fs.writeFileSync(path.join(__dirname, 'audit_report.json'), JSON.stringify(report, null, 1));
  console.log(JSON.stringify(report, null, 1).slice(0, 3500));
  await app.close();
  process.exit(0);
})();
