const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('--- INICIANDO TEST PLAYWRIGHT DE LANDING UPGRADE ---');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  const fileUrl = 'file://' + path.resolve(__dirname, '../landing.html');

  // 1. MOBILE TEST (iPhone 14 Pro: 390x844)
  console.log('[mobile] Probando landing en iPhone (390x844)...');
  const pageMobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });

  await pageMobile.goto(fileUrl, { waitUntil: 'domcontentloaded' });

  // Verificar elementos del Hero
  await pageMobile.waitForSelector('.hero-title');
  await pageMobile.waitForSelector('#demoMobileFrame');

  // Screenshot 1: Mobile Hero y Demo Diario
  await pageMobile.screenshot({ path: path.resolve(__dirname, 'landing_mobile_hero_daily.png') });
  console.log('[mobile] Screenshot tomado: landing_mobile_hero_daily.png');

  // Simular gasto en demo diario
  const btnAlmuerzo = pageMobile.locator('button.demo-quick-btn:has-text("Almuerzo")').first();
  await btnAlmuerzo.click();
  await pageMobile.waitForTimeout(300);

  // Verificar que el saldo bajó
  const balText = await pageMobile.locator('#mobileBalanceDisplay').textContent();
  console.log('[mobile] Saldo tras simular gasto:', balText);
  if (!balText.includes('3,425')) {
    throw new Error('El saldo no se actualizó correctamente tras simular gasto de S/ 25');
  }

  // Filtrar por César
  const btnUserCesar = pageMobile.locator('#btnUserCesarM');
  await btnUserCesar.click();
  await pageMobile.waitForTimeout(200);

  // Cambiar experiencia a Plan Cero Deudas
  console.log('[mobile] Cambiando experiencia a Plan Cero Deudas...');
  const btnExpDebts = pageMobile.locator('#btnExpDebts');
  await btnExpDebts.click();
  await pageMobile.waitForTimeout(300);

  // Verificar que el pane de deudas está visible
  await pageMobile.waitForSelector('#demoMobileDebtsPane', { state: 'visible' });
  const debtDate = await pageMobile.locator('#mDebtTargetDate').textContent();
  console.log('[mobile] Fecha de libertad Cero Deudas en demo:', debtDate);

  // Screenshot 2: Mobile Cero Deudas
  await pageMobile.screenshot({ path: path.resolve(__dirname, 'landing_mobile_hero_debts.png') });
  console.log('[mobile] Screenshot tomado: landing_mobile_hero_debts.png');

  // Probar Preset +S/ 200
  const btnPreset200 = pageMobile.locator('#demoMobileDebtsPane button.demo-preset-btn:has-text("+S/ 200")');
  await btnPreset200.click();
  await pageMobile.waitForTimeout(200);
  const newDebtDate = await pageMobile.locator('#mDebtTargetDate').textContent();
  console.log('[mobile] Fecha tras acelerador +S/ 200:', newDebtDate);
  if (!newDebtDate.includes('Julio 2027')) {
    throw new Error('El acelerador +S/ 200 no actualizó la fecha a Julio 2027');
  }

  // Probar Modal de Pago con WhatsApp
  console.log('[mobile] Probando modal de pago...');
  await pageMobile.evaluate(() => {
    openPlanModal('Plan Anual PRO', '29.90', 'al año');
  });
  await pageMobile.waitForSelector('#planModalOverlay', { state: 'visible' });
  const waHref = await pageMobile.locator('#btnPlanWhatsApp').getAttribute('href');
  console.log('[mobile] Enlace de WhatsApp generado:', waHref);
  if (!waHref.includes('wa.me/51914688135') || !waHref.includes('Plan%20Anual%20PRO')) {
    throw new Error('El enlace de WhatsApp no contiene el número o el plan esperado');
  }

  await pageMobile.screenshot({ path: path.resolve(__dirname, 'landing_mobile_payment_modal.png') });
  console.log('[mobile] Screenshot tomado: landing_mobile_payment_modal.png');

  await pageMobile.close();

  // 2. DESKTOP TEST (Mac: 1280x860)
  console.log('[desktop] Probando landing en Desktop (1280x860)...');
  const pageDesk = await browser.newPage({
    viewport: { width: 1280, height: 860 }
  });

  await pageDesk.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await pageDesk.waitForSelector('.hero-title');

  // Cambiar a vista Computadora en switcher
  const btnSwitchDesktop = pageDesk.locator('#btnSwitchDesktop');
  await btnSwitchDesktop.click();
  await pageDesk.waitForTimeout(300);

  // Verificar que el frame desktop está visible
  await pageDesk.waitForSelector('#demoDesktopFrame', { state: 'visible' });

  // Screenshot 3: Desktop Hero
  await pageDesk.screenshot({ path: path.resolve(__dirname, 'landing_desktop_hero.png') });
  console.log('[desktop] Screenshot tomado: landing_desktop_hero.png');

  // Cambiar a Cero Deudas en Desktop
  const btnDeskDebts = pageDesk.locator('#btnExpDebts');
  await btnDeskDebts.click();
  await pageDesk.waitForTimeout(300);
  await pageDesk.waitForSelector('#demoDesktopDebtsPane', { state: 'visible' });

  // Screenshot 4: Desktop Cero Deudas
  await pageDesk.screenshot({ path: path.resolve(__dirname, 'landing_desktop_debts.png') });
  console.log('[desktop] Screenshot tomado: landing_desktop_debts.png');

  await pageDesk.close();
  await browser.close();

  console.log('✅ TODAS LAS PRUEBAS DE LANDING UPGRADE COMPLETADAS EXITOSAMENTE!');
})();
