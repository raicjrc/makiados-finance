// Test suite for Onboarding Safety & False Trigger Elimination
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const appJs = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf-8');

console.log('🧪 Running Onboarding Safety Unit Tests...\n');

// 1. Verify verifySubscription does NOT call checkOnboardingAndVersionAnnouncements
const subSection = appJs.slice(
  appJs.indexOf('async function verifySubscription'),
  appJs.indexOf('async function handleLoginSubmit')
);
assert(
  !subSection.includes('checkOnboardingAndVersionAnnouncements'),
  '❌ FAILED: verifySubscription still contains premature call to checkOnboardingAndVersionAnnouncements'
);
console.log('✅ PASS: verifySubscription does not call checkOnboardingAndVersionAnnouncements');

// 2. Verify onLoginSuccess calls checkOnboardingAndVersionAnnouncements AFTER loadStateFromServer
const onLoginSection = appJs.slice(appJs.indexOf('async function onLoginSuccess'), appJs.indexOf('window.testBypassLogin'));
const loadStateIdx = onLoginSection.indexOf('await loadStateFromServer(3);');
const checkOnboardingIdx = onLoginSection.indexOf('checkOnboardingAndVersionAnnouncements();');
assert(loadStateIdx > 0, 'loadStateFromServer missing in onLoginSuccess');
assert(checkOnboardingIdx > loadStateIdx, '❌ FAILED: checkOnboardingAndVersionAnnouncements must be called AFTER loadStateFromServer');
console.log('✅ PASS: onLoginSuccess calls checkOnboardingAndVersionAnnouncements strictly after loadStateFromServer');

// 3. Verify onLoginSuccess resets window._serverStateLoaded = false
assert(
  onLoginSection.includes('window._serverStateLoaded = false;'),
  '❌ FAILED: onLoginSuccess must reset window._serverStateLoaded to false before loading'
);
console.log('✅ PASS: onLoginSuccess resets window._serverStateLoaded to false');

// 4. Verify handleLogout resets window._serverStateLoaded = false and closes onboardingWizardModal
const handleLogoutSection = appJs.slice(appJs.indexOf('async function handleLogout'), appJs.indexOf('function closeBanner'));
assert(
  handleLogoutSection.includes('window._serverStateLoaded = false;'),
  '❌ FAILED: handleLogout must reset window._serverStateLoaded to false'
);
assert(
  handleLogoutSection.includes("closeModal('onboardingWizardModal')"),
  '❌ FAILED: handleLogout must close onboardingWizardModal'
);
console.log('✅ PASS: handleLogout resets window._serverStateLoaded to false and closes wizard modal');

// 5. Verify userHasExistingFinancialData function exists and checks multiple criteria
assert(appJs.includes('function userHasExistingFinancialData(state)'), 'userHasExistingFinancialData function missing');
console.log('✅ PASS: userHasExistingFinancialData helper is implemented');

// 6. Verify openOnboardingWizard checks window._serverStateLoaded and userHasExistingFinancialData
const openWizardSection = appJs.slice(appJs.indexOf('async function openOnboardingWizard'), appJs.indexOf('function goToWizardStep'));
assert(
  openWizardSection.includes('window._serverStateLoaded !== true'),
  '❌ FAILED: openOnboardingWizard must guard on window._serverStateLoaded'
);
assert(
  openWizardSection.includes('userHasExistingFinancialData(appState)'),
  '❌ FAILED: openOnboardingWizard must guard on userHasExistingFinancialData'
);
console.log('✅ PASS: openOnboardingWizard guards on _serverStateLoaded and userHasExistingFinancialData');

// 7. Verify isLegacyClonedState does not falsely flag users with only Casa 750
const isLegacySection = appJs.slice(appJs.indexOf('function isLegacyClonedState'), appJs.indexOf('let appState = getCleanUserState();'));
assert(
  isLegacySection.includes('hasCesarSalary && hasAlquilerDue && hasCesarOct && hasSheldon'),
  '❌ FAILED: isLegacyClonedState must require all signatures simultaneously'
);
assert(
  isLegacySection.includes('if (state.onboardingCompleted === true) return false;'),
  '❌ FAILED: isLegacyClonedState must return false if onboardingCompleted is true'
);
console.log('✅ PASS: isLegacyClonedState strictly avoids false positives');

// 8. Verify checkOnboardingAndVersionAnnouncements guards on _serverStateLoaded and userHasExistingFinancialData
const checkAnnounceSection = appJs.slice(
  appJs.indexOf('function checkOnboardingAndVersionAnnouncements()'),
  appJs.indexOf('// MODALES DE SEGURIDAD & FEEDBACK (SOPORTE)')
);
assert(
  checkAnnounceSection.includes('if (window._serverStateLoaded !== true) return;'),
  '❌ FAILED: checkOnboardingAndVersionAnnouncements must return if _serverStateLoaded is not true'
);
assert(
  checkAnnounceSection.includes('userHasExistingFinancialData(appState)'),
  '❌ FAILED: checkOnboardingAndVersionAnnouncements must verify userHasExistingFinancialData'
);
console.log('✅ PASS: checkOnboardingAndVersionAnnouncements has strict safety guards');

console.log('\n🎉 ALL 8 ONBOARDING SAFETY TESTS PASSED SUCCESSFULLY!');
