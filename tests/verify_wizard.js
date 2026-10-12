// Verification script for AliviaFin Onboarding & Safety Updates
const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');
const appJs = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf-8');

const tests = [];

function test(name, fn) {
  try {
    fn();
    tests.push({ name, passed: true });
    console.log(`✅ PASS: ${name}`);
  } catch (err) {
    tests.push({ name, passed: false, error: err.message });
    console.error(`❌ FAIL: ${name} -> ${err.message}`);
  }
}

// 1. Check backdrop click removed from onboarding modal
test('Backdrop click removed from onboardingWizardModal', () => {
  if (indexHtml.includes('id="onboardingWizardModal" onclick="handleBackdropClick')) {
    throw new Error('onboardingWizardModal still has handleBackdropClick attached');
  }
});

// 2. Check 3-step tracker
test('Onboarding wizard has 3 steps (Tarjetas removed)', () => {
  if (indexHtml.includes('id="wStepDot4"')) {
    throw new Error('wStepDot4 still present');
  }
  if (!indexHtml.includes('id="wStepDot3"')) {
    throw new Error('wStepDot3 missing');
  }
  if (indexHtml.includes('id="wSlide4"')) {
    throw new Error('wSlide4 still present');
  }
});

// 3. Check "Calendario mensual" removed from Step 2
test('"Calendario de Vencimientos" removed from Step 2', () => {
  if (indexHtml.includes('Calendario de Vencimientos mensual')) {
    throw new Error('Old mention of Calendario de Vencimientos mensual still present');
  }
  if (indexHtml.includes('Alimentan el Calendario')) {
    throw new Error('Old mention of Alimentan el Calendario still present');
  }
});

// 4. Check "Sugerencias rápidas" removed
test('"Sugerencias rápidas de 1 clic" removed from Step 2', () => {
  if (indexHtml.includes('Sugerencias rápidas de 1 clic')) {
    throw new Error('Sugerencias rápidas still present in index.html');
  }
});

// 5. Check Free limit counter & Excel CSV buttons in Step 2
test('Free limit counter and CSV import/export present', () => {
  if (!indexHtml.includes('id="wExpenseCount"')) {
    throw new Error('wExpenseCount counter missing');
  }
  if (!indexHtml.includes('downloadExpenseTemplateCSV()')) {
    throw new Error('downloadExpenseTemplateCSV button missing');
  }
  if (!indexHtml.includes('triggerImportExpensesCSV()')) {
    throw new Error('triggerImportExpensesCSV button missing');
  }
});

// 6. Check safe non-destructive transaction merging in completeOnboardingWizard
test('Non-destructive transaction merging in app.js', () => {
  if (appJs.includes('appState.transactions[curMonth] = newTxs;')) {
    throw new Error('appState.transactions[curMonth] = newTxs; direct overwrite still present!');
  }
  if (!appJs.includes('downloadExpenseTemplateCSV')) {
    throw new Error('downloadExpenseTemplateCSV missing in app.js');
  }
});

// 7. Check salary edit access
test('Income cluster pill and settings button allow editing salary directly', () => {
  if (!indexHtml.includes('exec-cluster-pill exec-pill-income" title="Ingresos del mes (Toca para editar)" onclick="event.stopPropagation(); openEditSalaryModal();"')) {
    throw new Error('Income cluster pill does not trigger openEditSalaryModal');
  }
  if (!indexHtml.includes('Modificar Sueldo / Ingreso Mensual')) {
    throw new Error('Settings button for editing salary missing');
  }
});

// 8. Check JS syntax and script version bump
test('app.js has zero syntax errors and index.html is on v76.4', () => {
  const { execSync } = require('child_process');
  execSync('node -c js/app.js');
  if (!indexHtml.includes('js/app.js?v=76.4')) {
    throw new Error('index.html does not reference v76.4');
  }
});

console.log(`\n================================`);
console.log(`Results: ${tests.filter(t => t.passed).length} / ${tests.length} passed.`);
if (tests.some(t => !t.passed)) {
  process.exit(1);
}
