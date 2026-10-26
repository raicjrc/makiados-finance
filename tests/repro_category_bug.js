const { openApp } = require('./audit_helpers');
(async () => {
  for (const pro of [false, true]) {
    const app = await openApp({ port: 8111 + (pro ? 1 : 0), pro });
    const { page, errors } = app;
    const r = await page.evaluate(async () => {
      const out = {};
      out.isPro = isUserPro();
      out.catsBefore = Object.keys(CATEGORIES).length;
      openCategoryManagerModal();
      document.getElementById('managerCatName').value = 'ZZ Prueba';
      try { handleSaveCategoryClick(); out.threw = null; } catch (e) { out.threw = e.message + ' @ ' + (e.stack || '').split('\n')[1]; }
      out.catsAfter = Object.keys(CATEGORIES).length;
      out.inList = document.getElementById('categoryManagerList').innerHTML.includes('ZZ Prueba');
      out.proModalOpen = !!document.querySelector('#finzenProModal.active, #finzenProModal[style*="flex"]');
      return out;
    });
    console.log(pro ? 'PRO' : 'FREE', JSON.stringify(r), errors.slice(0, 5));
    await app.close();
  }
  process.exit(0);
})();
