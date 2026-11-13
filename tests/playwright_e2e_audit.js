const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const cleanUrl = decodeURIComponent((req.url || '/').split('?')[0]);
      let filePath = path.join(ROOT, cleanUrl === '/' ? 'index.html' : cleanUrl);
      if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        return res.end();
      }
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(ROOT, cleanUrl.replace(/^\//, '') + '.html');
      }
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404);
        return res.end('Not found');
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

(async () => {
  const server = await startServer();
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() => chromium.launch({ headless: true }));

  const findings = [];
  const results = [];
  const record = (name, ok, detail = '') => {
    results.push({ name, ok, detail });
    console.log(`${ok ? '✅ PASS' : '❌ FAIL'}: ${name}${detail ? ' — ' + detail : ''}`);
    if (!ok) findings.push(`${name}: ${detail}`);
  };

  try {
    // =========================================================================
    // DESKTOP CONTEXT (1280x800) - Supabase MOCKED CLEANLY (Golden Rule: zero production writes)
    // =========================================================================
    const deskCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await deskCtx.route(/supabase\.co/, r => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    const page = await deskCtx.newPage();

    const pageErrors = [];
    const consoleErrors = [];
    page.on('pageerror', err => pageErrors.push(err.message));
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const txt = msg.text();
        if (!txt.includes('ERR_FAILED') && !txt.includes('supabase.co') && !txt.includes('Failed to fetch')) {
          consoleErrors.push(txt);
        }
      }
    });

    await page.goto(`${baseUrl}/index.html?demo=1`, { waitUntil: 'load' });
    await page.waitForTimeout(800);

    // Seed clean isolated demo state
    await page.evaluate(() => {
      localStorage.setItem('finanzas_theme', 'crystal');
      document.body.classList.remove('theme-twilight');
      window._serverStateLoaded = true;
      window._currentUserSubscriptionStatus = 'pro_lifetime';
      window._currentUserSubscriptionExpiresAt = new Date(Date.now() + 365 * 86400000).toISOString();

      const curM = typeof getRealWorldCurrentMonth === 'function' ? getRealWorldCurrentMonth() : 'Noviembre 2026';
      appState.currentMonth = curM;
      currentSelectedMonth = curM;
      appState.salary = 3500;
      appState.currency = 'PEN';
      appState.onboardingCompleted = true;
      appState.incomes = {
        [curM]: [
          { id: 'inc_1', name: 'Sueldo Mensual', amount: 3500, category: 'Sueldo', status: 'Recibido', date: 1 }
        ]
      };
      appState.transactions = {
        [curM]: [
          { id: 'tx_1', name: 'Alquiler', amount: 1200, category: 'Vivienda', status: 'Pendiente', dueDate: '28', paymentMethod: 'BCP' },
          { id: 'tx_2', name: 'Supermercado', amount: 180, category: 'Alimentación', status: 'Pagado', date: 10, paymentMethod: 'Yape' }
        ]
      };
      appState.savingsGoals = [
        { id: 'g_1', name: 'Fondo Emergencia', targetAmount: 5000, currentAmount: 1500, emoji: '🛡️' }
      ];
      appState.loans = [
        { id: 'l_1', type: 'receivable', person: 'Carlos', concept: 'Cena', amount: 50, status: 'pending', date: '2026-11-10' }
      ];
      if (typeof renderAll === 'function') renderAll();
      if (typeof updateProGatesUI === 'function') updateProGatesUI();
    });
    await page.waitForTimeout(400);

    // Check 6 sidebar items visible (none hidden obsolete ones)
    const visibleNavIds = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#desktopSidebar .desktop-sidebar-nav .desktop-nav-item'))
        .filter(el => getComputedStyle(el).display !== 'none')
        .map(el => el.id);
    });
    record('Desktop Sidebar tiene exactamente 6 menús principales', visibleNavIds.length === 6, JSON.stringify(visibleNavIds));

    // SUITE C: Symmetrical Dashboard Verification (SKILL.md)
    const leftWithBills = await page.evaluate(() => {
      const card = document.getElementById('desktopCategoryDistributionCard');
      return card && card.parentElement && card.parentElement.id;
    });
    record('Suite C (con vencimientos pendientes): DistributionCard en slot izquierdo', leftWithBills === 'desktopCategorySlotLeft', `slot=${leftWithBills}`);

    const rightWithoutBills = await page.evaluate(() => {
      const curM = appState.currentMonth;
      appState.transactions[curM].forEach(t => { t.status = 'Pagado'; });
      renderAll();
      const card = document.getElementById('desktopCategoryDistributionCard');
      const slot = card && card.parentElement && card.parentElement.id;
      // restore pending tx for subsequent tests
      appState.transactions[curM][0].status = 'Pendiente';
      renderAll();
      return slot;
    });
    record('Suite C (0 pendientes zen): DistributionCard vuelve al slot derecho', rightWithoutBills === 'desktopCategorySlotRight', `slot=${rightWithoutBills}`);

    // SUITE B: Salary & Income Editing (SKILL.md)
    await page.click('.exec-pill-income');
    await page.waitForTimeout(300);
    const salaryModalOpen = await page.evaluate(() => {
      const m = document.getElementById('editSalaryModal');
      return m && getComputedStyle(m).display !== 'none';
    });
    record('Suite B: Click en Ingresos ✏️ abre #editSalaryModal', salaryModalOpen);

    // Submit real salary form inside #editSalaryModal
    const salaryTxBefore = await page.evaluate(() => JSON.stringify(appState.transactions[appState.currentMonth]));
    await page.fill('#newSalaryInput', '4200');
    await page.click('#editSalaryModal button[type="submit"]');
    await page.waitForTimeout(250);
    const salaryOk = await page.evaluate((txBefore) => {
      return appState.salary === 4200 && JSON.stringify(appState.transactions[appState.currentMonth]) === txBefore;
    }, salaryTxBefore);
    record('Suite B: Modificar sueldo actualiza appState.salary sin tocar gastos', salaryOk);

    // SUITE A: Onboarding Wizard Resilience (SKILL.md)
    await page.evaluate(() => {
      appState.onboardingCompleted = false;
      const modal = document.getElementById('onboardingWizardModal');
      if (modal) {
        wizardCurrentStep = 1;
        if (typeof renderWizardStep === 'function') renderWizardStep();
        modal.style.display = 'flex';
      }
    });
    await page.waitForTimeout(250);
    // Backdrop click immunity: click top-left corner of #onboardingWizardModal backdrop
    await page.mouse.click(10, 10);
    await page.waitForTimeout(200);
    const wizardStillOpen = await page.evaluate(() => {
      const m = document.getElementById('onboardingWizardModal');
      return m && getComputedStyle(m).display !== 'none';
    });
    record('Suite A: Backdrop click NO cierra #onboardingWizardModal', wizardStillOpen);

    // 3-step flow + Free Tier cap enforcement (>11 expenses) + Non-destructive completion
    const wizardFlowOk = await page.evaluate(async () => {
      window._currentUserSubscriptionStatus = 'free';
      window._currentUserSubscriptionExpiresAt = null;
      const beforeTxCount = (appState.transactions[appState.currentMonth] || []).length;

      // Step 1 -> Step 2
      const wSal = document.getElementById('wizardSalaryInput');
      if (wSal) wSal.value = '4500';
      if (typeof goToWizardStep === 'function') goToWizardStep(2);

      // Try adding 12 fixed expenses when free tier cap is 11
      const container = document.getElementById('wFixedExpensesContainer');
      const existingRows = container ? container.querySelectorAll('.wizard-dynamic-row').length : 0;
      for (let i = existingRows; i < 12; i++) {
        if (typeof addWizardExpenseRow === 'function') await addWizardExpenseRow();
      }
      const rowsAfter = container ? container.querySelectorAll('.wizard-dynamic-row').length : 0;
      const proPaywallTriggered = (() => {
        const pm = document.getElementById('finzenProModal');
        return pm && getComputedStyle(pm).display !== 'none';
      })();
      if (typeof closeGlassModal === 'function') closeGlassModal('finzenProModal');

      // Step 2 -> Step 3 -> Complete
      if (typeof goToWizardStep === 'function') goToWizardStep(3);
      if (typeof completeOnboardingWizard === 'function') completeOnboardingWizard();
      const afterTxCount = (appState.transactions[appState.currentMonth] || []).length;

      window._currentUserSubscriptionStatus = 'pro_lifetime';
      return { rowsAfter, proPaywallTriggered, nonDestructive: afterTxCount >= beforeTxCount };
    });
    record('Suite A: Cap Free Tier en Wizard bloquea > 11 gastos fijos y abre paywall', wizardFlowOk.rowsAfter === 11 && wizardFlowOk.proPaywallTriggered, `rowsAfter=${wizardFlowOk.rowsAfter}`);
    record('Suite A: Completar Wizard es no destructivo (preserva movimientos previos)', wizardFlowOk.nonDestructive);

    // Quick Expense Modal + Smart Input E2E
    await page.evaluate(() => { if (typeof openQuickExpenseModal === 'function') openQuickExpenseModal(); });
    await page.waitForTimeout(250);
    await page.fill('#smartQuickExpenseInput', '35 almuerzo yape');
    await page.waitForTimeout(200);
    await page.click('#quickSaveExpenseBtn');
    await page.waitForTimeout(300);
    const smartAdded = await page.evaluate(() => {
      const list = appState.transactions[appState.currentMonth] || [];
      return list.some(t => Math.abs(t.amount - 35) < 0.01 && t.paymentMethod === 'Yape');
    });
    record('Quick Expense + Smart Input ("35 almuerzo yape") agrega gasto real', smartAdded);

    // Navigate all desktop views + interactive Debt/Simulador/Loans modules
    const tabs = ['inicio', 'movimientos', 'plan', 'metas', 'deudas', 'simulador', 'prestamos'];
    for (const tab of tabs) {
      await page.evaluate((t) => switchTab(t), tab);
      await page.waitForTimeout(250);
      const ov = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      record(`Desktop Tab '${tab}' sin overflow horizontal`, !ov);
    }

    // Verify Simulador + Bola de Nieve + Cuentas Claras interactive computations
    const modulesOk = await page.evaluate(() => {
      if (typeof calculateAndRenderDebtPlan === 'function') calculateAndRenderDebtPlan();
      if (typeof updateSimulation === 'function') updateSimulation();
      if (typeof renderLoansDashboard === 'function') renderLoansDashboard();
      const simEl = document.getElementById('simMonthlyQuotaDisplay');
      const loansHasCarlos = document.getElementById('tab-prestamos')?.textContent?.includes('Carlos');
      return Boolean(simEl && simEl.textContent.trim().length > 0 && loansHasCarlos);
    });
    record('Módulos interactivos (Deudas + Simulador + Cuentas Claras) operan sin errores', modulesOk);

    // Theme Toggle + Privacy Toggle
    await page.evaluate(() => {
      if (typeof toggleTheme === 'function') toggleTheme();
      if (typeof togglePrivacyMode === 'function') togglePrivacyMode();
    });
    await page.waitForTimeout(200);
    const uiTogglesOk = await page.evaluate(() => {
      const dark = document.body.classList.contains('theme-twilight');
      const priv = document.body.classList.contains('privacy-mode-active') || isPrivacyModeActive();
      if (typeof toggleTheme === 'function') toggleTheme();
      if (typeof togglePrivacyMode === 'function') togglePrivacyMode();
      return dark && priv;
    });
    record('Toggle Tema Noche Suave + Modo Privacidad funcionan sin errores', uiTogglesOk);

    record('Desktop App: 0 pageErrors & 0 consoleErrors', pageErrors.length === 0 && consoleErrors.length === 0,
      `pageErrors=${JSON.stringify(pageErrors)}, consoleErrors=${JSON.stringify(consoleErrors)}`);
    await deskCtx.close();

    // =========================================================================
    // MOBILE CONTEXT (390x844 iPhone 14) - App + Landing + Reclamaciones
    // =========================================================================
    const mobCtx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true
    });
    await mobCtx.route(/supabase\.co/, r => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
    const mobPage = await mobCtx.newPage();
    const mobErrors = [];
    mobPage.on('pageerror', e => mobErrors.push(e.message));

    // Landing Mobile checks
    await mobPage.goto(`${baseUrl}/landing.html`, { waitUntil: 'load' });
    await mobPage.waitForTimeout(500);

    // ROI slider interaction
    await mobPage.evaluate(() => {
      const s1 = document.getElementById('calcIncomeSlider');
      const s2 = document.getElementById('calcLeakSlider');
      if (s1 && s2) {
        s1.value = '5000';
        s2.value = '15';
        updateSavingsCalc();
      }
    });
    const roiHasDynamicX = await mobPage.evaluate(() => {
      const el = document.getElementById('calcRoiText');
      return el && el.textContent.includes('x tu inversión');
    });
    record('Landing: Calculadora ROI actualiza multiplicador dinámico', roiHasDynamicX);

    // Showcase tab click & image verification
    await mobPage.click('#modPill_deudas');
    await mobPage.waitForTimeout(300);
    const showcaseSwitched = await mobPage.evaluate(() => {
      const img = document.getElementById('showcaseMobileImg');
      return Boolean(img && img.getAttribute('src').includes('real_mobile_deudas.png') && img.naturalWidth > 0);
    });
    record('Landing: Showcase interactivo cambia capturas y carga imagen válida', showcaseSwitched);

    // Reclamaciones Mobile checks
    await mobPage.goto(`${baseUrl}/reclamaciones.html`, { waitUntil: 'load' });
    await mobPage.waitForTimeout(300);
    const reclamosOk = await mobPage.evaluate(() => {
      const ov = document.documentElement.scrollWidth > window.innerWidth + 1;
      const fs = getComputedStyle(document.getElementById('nombre')).fontSize;
      const step = document.getElementById('montoReclamado').getAttribute('step');
      return !ov && fs === '16px' && step === '0.01';
    });
    record('Reclamaciones Mobile: 0 overflow, inputs 16px, monto step 0.01', reclamosOk);

    await mobPage.goto(`${baseUrl}/landing.html`, { waitUntil: 'load' });
    await mobPage.waitForTimeout(300);

    // Broken image check on Landing
    const brokenImgsLanding = await mobPage.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .filter(img => {
          const st = getComputedStyle(img);
          return st.display !== 'none' && img.complete && img.naturalWidth === 0;
        })
        .map(img => img.getAttribute('src'));
    });
    record('Landing Mobile: 0 imágenes rotas', brokenImgsLanding.length === 0, JSON.stringify(brokenImgsLanding));

    const landingMobOverflow = await mobPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    record('Landing Mobile (390x844): 0 overflow horizontal', !landingMobOverflow);

    // App Mobile checks
    await mobPage.goto(`${baseUrl}/index.html?demo=1`, { waitUntil: 'load' });
    await mobPage.waitForTimeout(700);
    for (const tab of ['inicio', 'movimientos', 'plan', 'deudas']) {
      await mobPage.evaluate(t => switchTab(t), tab);
      await mobPage.waitForTimeout(200);
      const ov = await mobPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      record(`Mobile App Tab '${tab}' (390x844) sin overflow horizontal`, !ov);
    }

    // Touch targets on mobile navbar buttons (>=44px)
    const navBtnsOk = await mobPage.evaluate(() => {
      return Array.from(document.querySelectorAll('.privacy-toggle-btn, .theme-toggle-btn'))
        .filter(el => getComputedStyle(el).display !== 'none')
        .every(el => {
          const r = el.getBoundingClientRect();
          return r.width >= 44 && r.height >= 44;
        });
    });
    record('Mobile App: Touch targets barra superior >= 44x44px', navBtnsOk);

    record('Mobile (Landing + App): 0 pageErrors', mobErrors.length === 0, JSON.stringify(mobErrors));
    await mobCtx.close();

    console.log(`\nRESUMEN AUDITORÍA PLAYWRIGHT: ${results.filter(r => r.ok).length}/${results.length} pruebas pasaron.`);
    if (findings.length > 0) {
      console.error('FALLOS DETECTADOS:\n - ' + findings.join('\n - '));
      process.exitCode = 1;
    }
  } finally {
    await browser.close();
    server.close();
  }
})();
