// Auditoría E2E de las mejoras CEO, corrección de los 5 bugs, fusiones y Radar Social
const assert = require('assert');
const { openApp } = require('./audit_helpers');

(async () => {
  const app = await openApp({ port: 8125, pro: true });
  const { page, errors } = app;

  console.log('1️⃣ Verificando Bug #1 y Bug #5 en Onboarding Wizard...');
  const wizardCheck = await page.evaluate(async () => {
    // Abrir wizard forzado en un estado limpio aislado en memoria
    const backupState = JSON.parse(JSON.stringify(appState));
    const backupUser = currentUser;
    currentUser = { id: 'test_new_user', email: 'nuevo@cliente.com', name: 'Nuevo Cliente' };
    appState = getCleanUserState();
    appState.currentMonth = getCurrentCalendarMonthName();

    // Llamar a setWizardSalaryPaidMode('yes') y ('no') y verificar que #wCurrentBankBox SIEMPRE esté visible
    setWizardSalaryPaidMode('no');
    const visibleWhenNo = document.getElementById('wCurrentBankBox').style.display !== 'none';
    setWizardSalaryPaidMode('yes');
    const visibleWhenYes = document.getElementById('wCurrentBankBox').style.display !== 'none';

    // Verificar font-size >= 16px en los inputs del wizard (Bug #5)
    const salaryFontSize = window.getComputedStyle(document.getElementById('wSalaryInput')).fontSize;
    const bankFontSize = window.getComputedStyle(document.getElementById('wCurrentBankInput')).fontSize;
    const goalFontSize = window.getComputedStyle(document.getElementById('wGoalName')).fontSize;

    // Probar escenario A: Aún no cobro sueldo (S/ 4500 día 30), pero tengo hoy S/ 1250 en el banco
    document.getElementById('wSalaryInput').value = '4500';
    document.getElementById('wPayDaySelect').value = '30';
    setWizardSalaryPaidMode('no');
    document.getElementById('wCurrentBankInput').value = '1250';
    completeOnboardingWizard();
    const balScenarioNo = getAccumulatedBalance(appState.currentMonth);
    const salaryStatusNo = (appState.incomes[appState.currentMonth].find(i => i.id.startsWith('inc_sueldo_')) || {}).status;

    // Probar escenario B: Sí ya cobré mi sueldo (S/ 4500), pero ya gasté parte y hoy me quedan S/ 2800 en el banco
    appState = getCleanUserState();
    appState.currentMonth = getCurrentCalendarMonthName();
    document.getElementById('wSalaryInput').value = '4500';
    document.getElementById('wPayDaySelect').value = '1';
    setWizardSalaryPaidMode('yes');
    document.getElementById('wCurrentBankInput').value = '2800';
    completeOnboardingWizard();
    const balScenarioYes = getAccumulatedBalance(appState.currentMonth);
    const salaryStatusYes = (appState.incomes[appState.currentMonth].find(i => i.id.startsWith('inc_sueldo_')) || {}).status;

    // Restaurar estado original
    currentUser = backupUser;
    appState = backupState;
    renderAll();

    return {
      visibleWhenNo,
      visibleWhenYes,
      salaryFontSize,
      bankFontSize,
      goalFontSize,
      balScenarioNo,
      salaryStatusNo,
      balScenarioYes,
      salaryStatusYes
    };
  });

  console.log('Resultado Wizard:', wizardCheck);
  assert.strictEqual(wizardCheck.visibleWhenNo, true, 'wCurrentBankBox debe ser visible en modo NO');
  assert.strictEqual(wizardCheck.visibleWhenYes, true, 'wCurrentBankBox debe ser visible SIEMPRE incluso en modo SÍ');
  assert.strictEqual(wizardCheck.salaryFontSize, '16px', 'wSalaryInput debe tener 16px para iOS Safari');
  assert.strictEqual(wizardCheck.bankFontSize, '16px', 'wCurrentBankInput debe tener 16px para iOS Safari');
  assert.strictEqual(wizardCheck.goalFontSize, '16px', 'wGoalName debe tener 16px para iOS Safari');
  assert.strictEqual(wizardCheck.balScenarioNo, 1250, 'El saldo en banco hoy (Aún no cobro) debe cuadrar exactamente en 1250');
  assert.strictEqual(wizardCheck.salaryStatusNo, 'Pendiente', 'El sueldo debe quedar Pendiente cuando elige Aún no cobro');
  assert.strictEqual(wizardCheck.balScenarioYes, 2800, 'El saldo en banco hoy (Sí ya cobré pero gasté parte) debe cuadrar exactamente en 2800');
  assert.strictEqual(wizardCheck.salaryStatusYes, 'Recibido', 'El sueldo debe quedar Recibido cuando elige Sí ya cobré');

  console.log('2️⃣ Verificando Bug #3 (stopPropagation en #execDailyLimitBadge)...');
  const bug3Check = await page.evaluate(() => {
    switchTab('inicio');
    closeModal('dailyLimitModal');
    closeModal('explainSurplusModal');
    const badge = document.getElementById('execDailyLimitBadge');
    badge.click();
    const dailyOpen = document.getElementById('dailyLimitModal').classList.contains('active');
    const explainOpen = document.getElementById('explainSurplusModal').classList.contains('active');
    closeModal('dailyLimitModal');
    return { dailyOpen, explainOpen };
  });
  console.log('Resultado Bug #3:', bug3Check);
  assert.strictEqual(bug3Check.dailyOpen, true, 'dailyLimitModal debe abrirse al tocar execDailyLimitBadge');
  assert.strictEqual(bug3Check.explainOpen, false, 'explainSurplusModal NO debe abrirse por burbujeo');

  console.log('3️⃣ Verificando Fusión 1 (Cero Deudas + Simulador) y Fusión 2 (Plan 50/30/20 + Asesor)...');
  const fusionCheck = await page.evaluate(() => {
    switchTab('plan');
    const planActive1 = document.getElementById('deskNavTabPlan').classList.contains('active');
    switchTab('consejos');
    const planActive2 = document.getElementById('deskNavTabPlan').classList.contains('active');
    const tipsPresent = !!document.getElementById('executiveTipsGrid');

    switchTab('deudas');
    const deudasActive1 = document.getElementById('deskNavTabDeudas').classList.contains('active');
    switchTab('simulador');
    const deudasActive2 = document.getElementById('deskNavTabDeudas').classList.contains('active');
    const simPresent = !!document.getElementById('simAmount');

    return { planActive1, planActive2, tipsPresent, deudasActive1, deudasActive2, simPresent };
  });
  console.log('Resultado Fusiones:', fusionCheck);
  assert.strictEqual(fusionCheck.planActive1 && fusionCheck.planActive2, true, 'deskNavTabPlan debe mantenerse activo en plan y consejos');
  assert.strictEqual(fusionCheck.deudasActive1 && fusionCheck.deudasActive2, true, 'deskNavTabDeudas debe mantenerse activo en deudas y simulador');

  console.log('4️⃣ Verificando Radar de Redes Sociales en Hub Fundador CEO...');
  const founderCheck = await page.evaluate(() => {
    window.masterLandingVisits = [
      { created_at: new Date().toISOString(), message: JSON.stringify({ source: 'tiktok', device: 'iPhone' }) },
      { created_at: new Date().toISOString(), message: JSON.stringify({ source: 'instagram', device: 'Android' }) }
    ];
    const sampleCustomers = [
      {
        email: 'usuariotiktok@gmail.com',
        user_name: 'Carlos TikTok',
        status: 'free',
        created_at: new Date().toISOString(),
        _telemetry: { source: 'tiktok', device: 'iPhone', onboardingDone: true, txCount: 4 }
      }
    ];
    renderFounderSocialRadar(sampleCustomers);
    return {
      visitsToday: document.getElementById('fhSocialVisitsTodayVal')?.textContent,
      signupsToday: document.getElementById('fhSocialSignupsTodayVal')?.textContent,
      onbPct: document.getElementById('fhSocialOnboardingPctVal')?.textContent,
      feedHtml: document.getElementById('fhLiveNewUsersFeed')?.innerHTML.includes('TikTok')
    };
  });
  console.log('Resultado Hub Fundador CEO:', founderCheck);
  assert.strictEqual(founderCheck.visitsToday, '2', 'Debe contar las 2 visitas de hoy');
  assert.strictEqual(founderCheck.signupsToday, '+1', 'Debe contar +1 registro hoy');
  assert.strictEqual(founderCheck.onbPct, '100%', 'Debe calcular 100% de activación');
  assert.strictEqual(founderCheck.feedHtml, true, 'El feed en vivo debe mostrar la insignia de TikTok');

  console.log('5️⃣ Verificando Paridad de Versión (sw.js vs APP_VERSION), Caja Segmentada Cero Deudas y Directorio Free...');
  const hotfixCheck = await page.evaluate(async () => {
    const swRes = await fetch('./sw.js', { cache: 'no-store' });
    const swText = await swRes.text();
    const swMatch = swText.match(/Service Worker (v[\d.]+)/i);
    const swVersion = swMatch ? swMatch[1] : null;

    // Verificar encaje visual del botón Simulador dentro de .advisor-segmented-nav en #tab-deudas
    switchTab('deudas');
    const deudasTab = document.getElementById('tab-deudas');
    const navEl = deudasTab.querySelector('.advisor-segmented-nav');
    const btns = navEl.querySelectorAll('.advisor-subtab-pill');
    const navRect = navEl.getBoundingClientRect();
    const btn2Rect = btns[1].getBoundingClientRect();
    const buttonFitsInsideContainer = (btn2Rect.right <= navRect.right + 1.5) && (btn2Rect.left >= navRect.left - 1.5);

    // Verificar que enrichMasterSubscribers incluye usuarios Free de masterHeartbeats aunque masterRpcAvailable sea true
    masterRpcAvailable = true;
    masterSubscribersData = [
      { user_id: 'pro_1', email: 'clientepro@aliviafin.com', status: 'active', plan_type: 'monthly', updated_at: new Date().toISOString() }
    ];
    masterHeartbeats = [
      {
        user_id: 'free_rai_1',
        user_email: 'raicesar@gmail.com',
        created_at: new Date().toISOString(),
        message: JSON.stringify({ name: 'Rai Nuevo', version: APP_VERSION, status: 'free', device: 'iPhone', source: 'tiktok' })
      }
    ];
    enrichMasterSubscribers();
    const raiFound = masterSubscribersData.some(u => u.email === 'raicesar@gmail.com' && u.status === 'free');

    return {
      appVersion: APP_VERSION,
      swVersion,
      buttonFitsInsideContainer,
      navWidth: Math.round(navRect.width),
      btn2RightDelta: Math.round(navRect.right - btn2Rect.right),
      raiFound
    };
  });
  console.log('Resultado Hotfix 5 puntos:', hotfixCheck);
  assert.strictEqual(hotfixCheck.appVersion, hotfixCheck.swVersion, 'APP_VERSION y sw.js deben coincidir exactamente para evitar bucle de actualización');
  assert.strictEqual(hotfixCheck.buttonFitsInsideContainer, true, 'El botón Simulador debe caber 100% dentro del recuadro gris .advisor-segmented-nav');
  assert.strictEqual(hotfixCheck.raiFound, true, 'Los nuevos usuarios Free deben aparecer siempre en el Directorio de Usuarios del Hub CEO');

  assert.strictEqual(errors.length, 0, 'No debe haber errores de consola/página');
  console.log('✅ TODAS LAS PRUEBAS E2E DE AUDITORÍA PASARON AL 100% SIN ERRORES');
  await app.close();
  process.exit(0);
})();

