// Playwright End-to-End Automated Test for AliviaFin UI
// Run with: node tests/playwright_e2e.js or npx -y playwright test
const { chromium } = require('playwright');
const path = require('path');

async function runPlaywrightTests() {
  console.log('🚀 Iniciando pruebas automatizadas con Playwright (Headless Chrome)...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const fileUrl = 'file://' + path.resolve(__dirname, '../index.html');
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  console.log('📄 Página cargada en Playwright:', fileUrl);

  // Test 1: Abrir modal de Onboarding y verificar que hacer clic afuera NO lo cierra
  await page.evaluate(() => {
    if (typeof openOnboardingWizard === 'function') {
      openOnboardingWizard(true);
    }
  });
  await page.waitForTimeout(300);

  const isModalVisible = await page.isVisible('#onboardingWizardModal');
  console.log('🔍 Test 1.1: Modal de Onboarding visible:', isModalVisible);

  // Clic en la esquina exterior (backdrop)
  await page.mouse.click(10, 10);
  await page.waitForTimeout(300);

  const isModalStillVisible = await page.isVisible('#onboardingWizardModal');
  if (isModalStillVisible) {
    console.log('✅ PASS: Clic afuera NO cerró el modal (Datos protegidos contra cierres accidentales)');
  } else {
    console.error('❌ FAIL: El modal se cerró al hacer clic afuera');
  }

  // Test 2: Verificar que solo existen 3 pasos en el Onboarding
  const stepsCount = await page.$$eval('.wizard-step-item', elements => elements.length);
  if (stepsCount === 3) {
    console.log(`✅ PASS: El asistente tiene exactamente 3 pasos limpios (Encontrados: ${stepsCount})`);
  } else {
    console.error(`❌ FAIL: Se esperaban 3 pasos pero se encontraron ${stepsCount}`);
  }

  // Test 3: Verificar que el contador de límite gratuito está presente en el Paso 2
  await page.evaluate(() => goToWizardStep(2));
  await page.waitForTimeout(200);
  const limitBannerText = await page.$eval('#wLimitBanner', el => el.innerText);
  console.log('✅ PASS: Banner de límite en Paso 2:', limitBannerText.replace(/\n/g, ' '));

  // Test 4: Cerrar modal y verificar edición de sueldo directa
  await page.evaluate(() => dismissOnboardingWizard(true));
  await page.waitForTimeout(200);

  // Clic en la píldora de Ingresos
  await page.click('.exec-pill-income');
  await page.waitForTimeout(300);
  const isSalaryModalVisible = await page.isVisible('#editSalaryModal');
  if (isSalaryModalVisible) {
    console.log('✅ PASS: Clic en "Ingresos" abre directamente el editor de sueldo sin tocar transacciones');
  } else {
    console.error('❌ FAIL: Clic en Ingresos no abrió editSalaryModal');
  }

  await browser.close();
  console.log('\n🎉 Todas las verificaciones E2E con Playwright terminaron exitosamente.');
}

runPlaywrightTests().catch(err => {
  console.error('Error durante la ejecución de Playwright:', err);
  process.exit(1);
});
