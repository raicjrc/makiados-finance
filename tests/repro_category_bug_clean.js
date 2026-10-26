const { openApp } = require('./audit_helpers');
(async () => {
  const app = await openApp({ port: 8113 });
  const { page, errors } = app;
  const r = await page.evaluate(async () => {
    const out = {};
    currentUser = { id: 'nuevo_user', email: 'gaby@gmail.com', name: 'Gaby' };
    appState = getCleanUserState();
    appState.currentMonth = getEffectiveCurrentMonth(appState.currentMonth);
    ensureMonthTransactions(appState.currentMonth); ensureMonthIncomes(appState.currentMonth);
    try { renderAll(); out.renderAllClean = 'ok'; } catch (e) { out.renderAllClean = 'THROW ' + e.message + ' | ' + (e.stack || '').split('\n').slice(0, 3).join(' <- '); }
    out.isPro = isUserPro();
    out.catsBefore = Object.keys(CATEGORIES).length;
    openCategoryManagerModal();
    document.getElementById('managerCatName').value = 'ZZ Prueba';
    try { handleSaveCategoryClick(); out.threw = null; } catch (e) { out.threw = e.message + ' | ' + (e.stack || '').split('\n').slice(0, 3).join(' <- '); }
    out.catsAfter = Object.keys(CATEGORIES).length;
    out.inList = document.getElementById('categoryManagerList').innerHTML.includes('ZZ Prueba');
    return out;
  });
  console.log(JSON.stringify(r, null, 1), errors.slice(0, 5));
  await app.close();
  process.exit(0);
})();
