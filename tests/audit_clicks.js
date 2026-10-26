// Clic masivo: pulsa cada botón/elemento con onclick (visible o no) y reporta excepciones JS. Neutraliza diálogos y red.
const fs = require('fs');
const path = require('path');
const { openApp } = require('./audit_helpers');

// Acciones que se saltan (cierran sesión, borran todo, abren pasarelas/ventanas externas)
const SKIP = /OAuth|handleLogin|handleRegister|sendReset|logout|signOut|cerrarSesion|deleteAccount|resetAll|wipe|clearAll|eraseAll|borrarTodo|stripe|checkout|window\.open|location\.href|\.print\(|exportPDF|downloadBackup|restoreBackup|deleteUser|hardReset|resetData/i;

(async () => {
  const app = await openApp({ port: 8130, pro: true });
  const { page, errors } = app;
  await page.route('**/*', route => route.request().isNavigationRequest() ? route.abort() : route.continue());
  await page.evaluate(() => {
    window.__dlg = [];
    window.alert = () => {}; window.confirm = () => true; window.prompt = () => '100';
    window.open = () => null;
    window.uiConfirm = async () => true; window.uiPrompt = async () => '100'; window.uiAlert = async () => {};
    HTMLAnchorElement.prototype.click = function () {};
  });
  const total = await page.evaluate(() => document.querySelectorAll('[onclick]').length);
  console.log('Elementos con onclick en DOM inicial:', total);
  const codes = await page.evaluate(() => [...document.querySelectorAll('[onclick]')].map(e => e.getAttribute('onclick').slice(0, 120)));

  const results = [];
  let reloadEvery = 25;
  for (let i = 0; i < total; i++) {
    const r = await page.evaluate(async ([idx, skipSrc]) => {
      const SKIP_RE = new RegExp(skipSrc + '|reload|location|href\\s*=|clearCache|forceUpdate', 'i');
      const els = document.querySelectorAll('[onclick]');
      const el = els[idx];
      if (!el) return null;
      const code = el.getAttribute('onclick');
      if (SKIP_RE.test(code)) return { code: code.slice(0, 90), label: '(saltado)', err: null, skipped: true };
      const label = (el.id ? '#' + el.id : '') + ' ' + (el.textContent || el.title || '').trim().slice(0, 30);
      let err = null;
      try {
        // Ejecuta el handler tal cual lo haría el navegador (sin depender de visibilidad/overlays)
        const fn = new Function('event', code);
        const ev = new MouseEvent('click', { bubbles: true, cancelable: true });
        const ret = fn.call(el, ev);
        if (ret && ret.then) await Promise.race([ret, new Promise(r => setTimeout(r, 300))]);
      } catch (e) { err = e.message; }
      await new Promise(r => setTimeout(r, 30));
      return { code: code.slice(0, 90), label, err };
    }, [i, SKIP.source]).catch(e => ({ code: 'idx ' + i, label: '(contexto perdido)', err: e.message.slice(0, 80) }));
    if (!r) continue;
    results.push(r);
    // Cierra modales abiertos para no acumular overlays
    let closeErr = null;
    const ok = await page.evaluate(() => {
      document.querySelectorAll('.modal-backdrop.active,.glass-backdrop.active,.modal.active').forEach(m => { try { closeModal(m); } catch (e) {} });
      document.querySelectorAll('[style*="display: flex"].modal-backdrop').forEach(m => { m.style.display = 'none'; });
      return true;
    }).catch(e => { closeErr = e.message; return false; });
    if (!ok && /Target closed|Execution context was destroyed/i.test(closeErr || '')) {
      console.log('⚠ NAVEGACIÓN en idx', i, '→', codes[i], closeErr);
      results.pop(); results.push({ code: codes[i], label: '(navega)', err: 'navega/recarga la página: ' + closeErr });
      break;
    }
  }
  const bad = results.filter(r => r.err && !/handleBackdropClick/.test(r.code));
  console.log('Probados:', results.length, '| con excepción:', bad.length);
  bad.forEach(b => console.log('  ✗', b.label, '→', b.code, '=>', b.err));
  console.log('Errores de página:', errors.length);
  errors.slice(0, 15).forEach(e => console.log('  !', e.slice(0, 200)));
  fs.writeFileSync(path.join(__dirname, 'click_audit_report.json'), JSON.stringify({ bad, errors }, null, 1));
  await app.close();
  process.exit(0);
})();
