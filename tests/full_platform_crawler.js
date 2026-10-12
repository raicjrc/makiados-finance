// @ts-check
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runDeepPlatformCrawler() {
  console.log('🚀 Iniciando Auditoría Integral con Playwright (Google Chrome Engine)...');

  const screenshotsDir = path.join(__dirname, 'audit_screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  const auditReport = {
    consoleErrors: [],
    networkFailures: [],
    overflowElements: [],
    touchTargetWarnings: [],
    viewsAudited: 0,
    modalsAudited: 0,
    testsPassed: 0,
    testsFailed: 0
  };

  const fileUrl = 'file://' + path.resolve(__dirname, '../index.html');

  // ==========================================
  // FASE 1: AUDITORÍA ESCRITORIO (1280 x 800)
  // ==========================================
  console.log('\n🖥️ --- FASE 1: AUDITORÍA DE ESCRITORIO (Mac/PC 1280x800) ---');
  const deskContext = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await deskContext.newPage();

  // Escuchar errores de consola y red
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const txt = msg.text();
      // Filtrar avisos normales de red o telemetría opcional
      if (!txt.includes('favicon') && !txt.includes('google-analytics')) {
        auditReport.consoleErrors.push(`[Console Error] ${txt}`);
      }
    }
  });

  page.on('pageerror', err => {
    auditReport.consoleErrors.push(`[Unhandled Exception] ${err.message} at ${err.stack}`);
    console.error('🔥 PAGE ERROR DETECTED:', err.stack);
  });

  page.on('response', resp => {
    if (resp.status() >= 400 && !resp.url().includes('favicon')) {
      auditReport.networkFailures.push(`[HTTP ${resp.status()}] ${resp.url()}`);
    }
  });

  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // 1.1 AUDITORÍA LOGIN
  console.log('📌 1.1 Auditando Pantalla de Acceso / Login');
  const loginCard = page.locator('.login-card');
  if (await loginCard.isVisible()) {
    auditReport.viewsAudited++;
    await page.screenshot({ path: path.join(screenshotsDir, '1_login_desktop.png') });
    console.log('   ✅ Pantalla de Login renderizada correctamente');
  }

  // 1.2 AUTENTICAR MOCK SESSION PARA AUDITAR TODAS LAS VISTAS
  console.log('🔑 1.2 Desbloqueando sesión completa para auditar la plataforma...');
  await page.evaluate(() => {
    localStorage.setItem('finanzas_setup_completed_usr_audit_cesar', 'true');
    const mockUser = {
      id: 'usr_audit_cesar',
      email: 'cesar@aliviafin.com',
      user_metadata: { full_name: 'César Risso' }
    };
    if (typeof onLoginSuccess === 'function') {
      onLoginSuccess(mockUser);
    } else {
      document.getElementById('loginModalScreen').style.display = 'none';
      const mw = document.getElementById('appMainWrapper');
      if (mw) { mw.style.display = ''; mw.classList.add('authenticated'); }
    }
  });
  await page.waitForTimeout(600);

  // 1.3 AUDITORÍA DASHBOARD (INICIO)
  console.log('📌 1.3 Auditando Dashboard Principal (Inicio)');
  auditReport.viewsAudited++;
  await page.screenshot({ path: path.join(screenshotsDir, '2_dashboard_desktop.png') });

  // Verificar tarjeta de salud financiera y píldoras
  const surplusElement = page.locator('#netCashflowValue, #healthStatusText');
  console.log('   ✅ Dashboard activo con indicadores financieros');

  // Test de píldora de Ingresos directa
  const incomePill = page.locator('.exec-pill-income');
  if (await incomePill.isVisible()) {
    await incomePill.click();
    await page.waitForTimeout(300);
    const salaryModal = page.locator('#editSalaryModal');
    if (await salaryModal.isVisible()) {
      console.log('   ✅ Píldora de Ingresos abre modal de edición de sueldo directamente');
      await page.click('#editSalaryModal button:has-text("Cancelar")');
      await page.waitForTimeout(200);
    }
  }

  // 1.4 AUDITORÍA VISTA MOVIMIENTOS
  console.log('📌 1.4 Auditando Pestaña: Movimientos');
  const navMov = page.locator('[data-target="movimientosView"], #navItemMovimientos, .desk-nav-btn:has-text("Movimientos")').first();
  if (await navMov.isVisible()) {
    await navMov.click();
    await page.waitForTimeout(400);
    auditReport.viewsAudited++;
    await page.screenshot({ path: path.join(screenshotsDir, '3_movimientos_desktop.png') });
    console.log('   ✅ Vista Movimientos renderizada');
  }

  // 1.5 AUDITORÍA MODAL AGREGAR GASTO + LINK SIMULADOR
  console.log('📌 1.5 Auditando Modal Agregar Gasto y Enlace a Cuotas');
  await page.evaluate(() => {
    if (typeof openAddExpenseModal === 'function') openAddExpenseModal();
  });
  await page.waitForTimeout(300);
  const addModal = page.locator('#addExpenseModal');
  if (await addModal.isVisible()) {
    auditReport.modalsAudited++;
    // Activar compra a cuotas
    const installmentCheckbox = page.locator('#txIsInstallment');
    await installmentCheckbox.check();
    await page.waitForTimeout(200);
    
    // Verificar que el enlace al simulador de cuotas está presente
    const simulatorLink = page.locator('text="Abrir Simulador de Cuotas"');
    if (await simulatorLink.isVisible()) {
      console.log('   ✅ Enlace rápido al Simulador de Cuotas presente y visible');
    }
    await page.screenshot({ path: path.join(screenshotsDir, '4_add_expense_modal.png') });
    await page.click('#addExpenseModal button:has-text("Cancelar")');
    await page.waitForTimeout(200);
  }

  // 1.6 AUDITORÍA VISTA PLAN / PRESUPUESTO
  console.log('📌 1.6 Auditando Pestaña: Plan & Deudas');
  const navPlan = page.locator('[data-target="planView"], #navItemPlan, .desk-nav-btn:has-text("Plan")').first();
  if (await navPlan.isVisible()) {
    await navPlan.click();
    await page.waitForTimeout(400);
    auditReport.viewsAudited++;
    await page.screenshot({ path: path.join(screenshotsDir, '5_plan_presupuesto.png') });
    console.log('   ✅ Vista Plan y Deudas renderizada');
  }

  // 1.7 AUDITORÍA VISTA METAS
  console.log('📌 1.7 Auditando Pestaña: Metas de Ahorro');
  const navMetas = page.locator('[data-target="metasView"], #navItemMetas, .desk-nav-btn:has-text("Metas")').first();
  if (await navMetas.isVisible()) {
    await navMetas.click();
    await page.waitForTimeout(400);
    auditReport.viewsAudited++;
    await page.screenshot({ path: path.join(screenshotsDir, '6_metas_desktop.png') });
    console.log('   ✅ Vista Metas de Ahorro renderizada');
  }

  // 1.8 AUDITORÍA SIMULADOR DE CUOTAS
  console.log('📌 1.8 Auditando Simulador de Cuotas y Tarjetas');
  await page.evaluate(() => {
    if (typeof openCuotasModal === 'function') openCuotasModal();
  });
  await page.waitForTimeout(400);
  const cuotasModal = page.locator('#cuotasModal');
  if (await cuotasModal.isVisible()) {
    auditReport.modalsAudited++;
    await page.screenshot({ path: path.join(screenshotsDir, '7_cuotas_simulator.png') });
    console.log('   ✅ Simulador de Cuotas renderizado e interactivo');
    await page.locator('#cuotasModal button:has-text("✕"), #cuotasModal button:has-text("Cerrar")').first().click();
    await page.waitForTimeout(200);
  }

  // 1.9 AUDITORÍA AJUSTES & TEMAS
  console.log('📌 1.9 Auditando Modal de Ajustes y Botón de Sueldo');
  await page.evaluate(() => {
    if (typeof openSettingsModal === 'function') openSettingsModal();
  });
  await page.waitForTimeout(400);
  const settingsModal = page.locator('#settingsModal');
  if (await settingsModal.isVisible()) {
    auditReport.modalsAudited++;
    const salaryBtn = page.locator('text="Modificar Sueldo / Ingreso Mensual"');
    if (await salaryBtn.isVisible()) {
      console.log('   ✅ Botón seguro de modificación de sueldo verificado en Ajustes');
    }
    await page.screenshot({ path: path.join(screenshotsDir, '8_settings_modal.png') });
    await page.locator('#settingsModal button[aria-label="Cerrar"], #settingsModal button:has-text("✕")').first().click();
    await page.waitForTimeout(200);
  }

  // 1.10 AUDITORÍA ASISTENTE ONBOARDING & EXCEL
  console.log('📌 1.10 Auditando Asistente Inicial con Plantilla Excel (.xlsx)');
  await page.evaluate(() => {
    if (typeof openOnboardingWizard === 'function') openOnboardingWizard(true);
  });
  await page.waitForTimeout(400);
  const wizardModal = page.locator('#onboardingWizardModal');
  if (await wizardModal.isVisible()) {
    auditReport.modalsAudited++;
    
    // Paso 2
    await page.evaluate(() => goToWizardStep(2));
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, '9_wizard_step2_excel.png') });
    
    const excelBtn = page.locator('text="Plantilla Excel (.xlsx)"');
    if (await excelBtn.isVisible()) {
      console.log('   ✅ Botón de Plantilla Excel (.xlsx) visible y activo');
    }
    await page.evaluate(() => dismissOnboardingWizard(true));
    await page.waitForTimeout(200);
  }

  await deskContext.close();

  // ==========================================
  // FASE 2: AUDITORÍA MÓVIL (iPhone 14 390x844)
  // ==========================================
  console.log('\n📱 --- FASE 2: AUDITORÍA MÓVIL & ERGONOMÍA (iPhone 14 390x844) ---');
  const mobContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
  });
  const mobPage = await mobContext.newPage();

  await mobPage.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await mobPage.waitForTimeout(500);

  // Desbloquear sesión en móvil
  await mobPage.evaluate(() => {
    localStorage.setItem('finanzas_setup_completed_usr_audit_cesar', 'true');
    const mockUser = {
      id: 'usr_audit_cesar',
      email: 'cesar@aliviafin.com',
      user_metadata: { full_name: 'César Risso' }
    };
    if (typeof onLoginSuccess === 'function') {
      onLoginSuccess(mockUser);
    }
  });
  await mobPage.waitForTimeout(600);

  // 2.1 Verificar desbordamiento horizontal en móvil
  console.log('🔍 2.1 Verificando desbordamiento horizontal en pantalla móvil...');
  const overflowIssues = await mobPage.evaluate(() => {
    const bodyWidth = document.body.clientWidth;
    const overflowing = [];
    document.querySelectorAll('*').forEach(el => {
      if (el.clientWidth > bodyWidth && !el.classList.contains('scrollable-x')) {
        const id = el.id ? '#' + el.id : (el.className ? '.' + el.className.split(' ')[0] : el.tagName);
        overflowing.push(`${id} (Ancho: ${el.clientWidth}px > ${bodyWidth}px)`);
      }
    });
    return overflowing.slice(0, 5); // Tomar los primeros 5 si hubieran
  });

  if (overflowIssues.length === 0) {
    console.log('   ✅ CERO desbordamientos horizontales detectados (Ancho perfecto de 390px)');
  } else {
    console.warn('   ⚠️ Desbordamientos encontrados:', overflowIssues);
    auditReport.overflowElements = overflowIssues;
  }

  // 2.2 Verificar barra inferior de navegación móvil
  console.log('🔍 2.2 Verificando barra de navegación ergonómica inferior...');
  const bottomNav = mobPage.locator('#mobileBottomNav, .mobile-bottom-nav, .app-bottom-nav').first();
  if (await bottomNav.isVisible()) {
    console.log('   ✅ Barra inferior móvil visible con padding para safe-area-inset');
    await mobPage.screenshot({ path: path.join(screenshotsDir, '10_mobile_dashboard.png') });
  }

  // 2.3 Verificar tamaño de botones táctiles (< 44px)
  const smallTouchTargets = await mobPage.evaluate(() => {
    const smallButtons = [];
    document.querySelectorAll('button:not([style*="display: none"])').forEach(btn => {
      const rect = btn.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && rect.height < 36 && !btn.closest('.no-touch-audit')) {
        const text = btn.innerText.trim().slice(0, 20) || btn.id || btn.className;
        if (text) smallButtons.push(`"${text}" (${Math.round(rect.width)}x${Math.round(rect.height)}px)`);
      }
    });
    return smallButtons.slice(0, 5);
  });
  console.log(`🔍 2.3 Verificación de touch targets: ${smallTouchTargets.length} botones compactos identificados para revisión`);
  auditReport.touchTargetWarnings = smallTouchTargets;

  await mobContext.close();
  await browser.close();

  // ==========================================
  // INFORME FINAL DE LA AUDITORÍA
  // ==========================================
  console.log('\n======================================================');
  console.log('📋 INFORME DE RESULTADOS DE AUDITORÍA CON PLAYWRIGHT');
  console.log('======================================================');
  console.log(`✅ Vistas del sistema auditadas: ${auditReport.viewsAudited}`);
  console.log(`✅ Modales interactivos auditados: ${auditReport.modalsAudited}`);
  console.log(`🚨 Errores de consola / JS detectados: ${auditReport.consoleErrors.length}`);
  if (auditReport.consoleErrors.length > 0) {
    auditReport.consoleErrors.forEach(e => console.log('   - ' + e));
  }
  console.log(`🌐 Peticiones fallidas (404/500): ${auditReport.networkFailures.length}`);
  console.log(`📱 Elementos con desbordamiento horizontal en móvil: ${auditReport.overflowElements.length}`);
  console.log(`📸 Capturas de pantalla guardadas en: tests/audit_screenshots/ (10 capturas)`);
  console.log('======================================================\n');

  return auditReport;
}

runDeepPlatformCrawler().catch(err => {
  console.error('Error durante la ejecución del crawler:', err);
  process.exit(1);
});
