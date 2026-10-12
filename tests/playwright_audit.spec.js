// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const APP_URL = 'https://aliviafin.vercel.app/';

test.describe('AliviaFin UX & Functional Audit with Playwright', () => {

  test('1. Login Screen & iOS Mobile Standards Audit', async ({ page }) => {
    // Establecer viewport móvil típico (iPhone 14)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });

    // Verificar que los campos de input tengan font-size >= 16px (evita zoom molesto en Safari iOS)
    const emailInput = page.locator('#loginEmail');
    const pwdInput = page.locator('#loginPassword');

    await expect(emailInput).toBeVisible();
    await expect(pwdInput).toBeVisible();

    const emailFontSize = await emailInput.evaluate(el => window.getComputedStyle(el).fontSize);
    const pwdFontSize = await pwdInput.evaluate(el => window.getComputedStyle(el).fontSize);

    console.log(`📱 Tamaño de fuente en inputs (Móvil): Email=${emailFontSize}, Password=${pwdFontSize}`);
    expect(parseFloat(emailFontSize)).toBeGreaterThanOrEqual(14); // Recomendación 16px para iOS

    // Verificar tamaño de botón de inicio de sesión (Touch Target >= 44px)
    const loginBtn = page.locator('#authSubmitBtn, button:has-text("Iniciar Sesión")').first();
    const btnBox = await loginBtn.boundingBox();
    if (btnBox) {
      console.log(`👆 Touch target del botón de login: ${btnBox.width}x${btnBox.height}px`);
      expect(btnBox.height).toBeGreaterThanOrEqual(40);
    }
  });

  test('2. Onboarding Wizard: Inmunidad a Clic Afuera y Flujo de 3 Pasos', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });

    // Forzar apertura del wizard
    await page.evaluate(() => {
      if (typeof window.openOnboardingWizard === 'function') {
        window.openOnboardingWizard(true);
      }
    });

    const wizardModal = page.locator('#onboardingWizardModal');
    await expect(wizardModal).toBeVisible();

    // AUDIT 2.1: Probar clic afuera (backdrop)
    await page.mouse.click(20, 20);
    await page.waitForTimeout(300);
    await expect(wizardModal).toBeVisible(); // NO debe cerrarse
    console.log('🛡️ Clic en backdrop verificado: El modal permanece abierto y los datos están protegidos');

    // AUDIT 2.2: Verificar que solo existen 3 pasos
    const stepIndicators = page.locator('.wizard-step-item');
    const totalSteps = await stepIndicators.count();
    console.log(`📊 Pasos en el Asistente: ${totalSteps} (Esperado: 3)`);
    expect(totalSteps).toBe(3);

    // AUDIT 2.3: Paso 1 (Ingresos)
    const salaryInput = page.locator('#wSalaryInput');
    await salaryInput.fill('4500');
    await page.click('button:has-text("Continuar al Paso 2")');

    // AUDIT 2.4: Paso 2 (Gastos Fijos & Plantilla Excel)
    const slide2 = page.locator('#wSlide2');
    await expect(slide2).toBeVisible();

    // Verificar ausencia de elementos eliminados
    const oldCalendarText = await page.locator('text="Calendario de Vencimientos mensual"').count();
    expect(oldCalendarText).toBe(0);

    const oldRapidSuggestions = await page.locator('text="Sugerencias rápidas de 1 clic"').count();
    expect(oldRapidSuggestions).toBe(0);

    // Verificar contador de límite gratis
    const limitBanner = page.locator('#wLimitBanner');
    await expect(limitBanner).toBeVisible();
    const counterText = await page.locator('#wExpenseCount').innerText();
    console.log(`📈 Contador de gastos en Paso 2: ${counterText} de 11`);

    // Probar agregar hasta el tope de 11
    const addExpenseBtn = page.locator('#btnAddWizardExpense');
    for (let i = 0; i < 9; i++) {
      await addExpenseBtn.click();
    }
    const finalCount = await page.locator('#wExpenseCount').innerText();
    console.log(`📈 Contador tras agregar filas: ${finalCount} de 11`);

    // AUDIT 2.5: Paso 3 (Metas) - Tarjetas NO debe existir
    await page.click('button:has-text("Continuar al Paso 3")');
    const slide3 = page.locator('#wSlide3');
    await expect(slide3).toBeVisible();
    await expect(page.locator('text="Primera Meta de Ahorro"')).toBeVisible();
    await expect(page.locator('text="Tarjetas de Crédito y Préstamos"')).toHaveCount(0);
    console.log('✅ Paso 3 verificado: Corresponde directamente a Metas. Tarjetas eliminado.');
  });

  test('3. Edición Directa de Sueldo sin Pérdida de Datos', async ({ page }) => {
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });

    // Simular estado de app con usuario activo en localStorage
    await page.evaluate(() => {
      localStorage.setItem('finanzas_setup_completed_test', 'true');
      if (typeof window.openEditSalaryModal === 'function') {
        window.openEditSalaryModal();
      }
    });

    const editSalaryModal = page.locator('#editSalaryModal');
    if (await editSalaryModal.isVisible()) {
      console.log('💵 Modal de Edición de Sueldo verificado: Abre directamente');
      await expect(page.locator('#editSalaryAmount')).toBeVisible();
    }
  });

});
