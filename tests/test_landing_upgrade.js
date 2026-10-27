const { chromium } = require('playwright');
const path = require('path');
const http = require('http');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/landing.html';
  const f = path.join(root, p);
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { 'Content-Type': mime[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

(async () => {
  console.log('--- INICIANDO TEST PLAYWRIGHT DE LANDING CON SHOWCASE REAL ---');
  const port = 4788;
  await new Promise(r => server.listen(port, r));

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  }).catch(() => chromium.launch({ headless: true }));

  // 1. MOBILE TEST (iPhone 14 Pro: 390x844)
  console.log('[mobile] Probando landing en iPhone (390x844)...');
  const pageMobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });

  await pageMobile.goto(`http://localhost:${port}/landing.html`, { waitUntil: 'load' });
  await pageMobile.waitForSelector('.hero-title');
  await pageMobile.waitForSelector('#showcasePhoneFrame');

  // Verificar copy para personas de a pie
  const badgeText = await pageMobile.locator('.pill-badge').textContent();
  console.log('[mobile] Badge texto:', badgeText.trim());
  if (!badgeText.includes('personas de a pie')) {
    throw new Error('El badge de personas de a pie no está presente');
  }

  // Verificar imagen inicial (Inicio)
  const initialMobileSrc = await pageMobile.locator('#showcaseMobileImg').getAttribute('src');
  console.log('[mobile] Imagen inicial:', initialMobileSrc);
  if (!initialMobileSrc.includes('real_mobile_inicio.png')) {
    throw new Error('La imagen inicial debe ser real_mobile_inicio.png');
  }

  // Screenshot 1: Mobile Inicio
  await pageMobile.screenshot({ path: path.resolve(__dirname, 'landing_mobile_showcase_inicio.png') });
  console.log('✓ Screenshot mobile inicio tomado');

  // Cambiar a Cero Deudas
  console.log('[mobile] Cambiando a Plan Cero Deudas...');
  await pageMobile.locator('#modPill_deudas').click();
  await pageMobile.waitForTimeout(300);

  const debtsMobileSrc = await pageMobile.locator('#showcaseMobileImg').getAttribute('src');
  console.log('[mobile] Imagen tras cambiar a deudas:', debtsMobileSrc);
  if (!debtsMobileSrc.includes('real_mobile_deudas.png')) {
    throw new Error('La imagen de deudas no cambió a real_mobile_deudas.png');
  }

  const expTitle = await pageMobile.locator('#showcaseExplainerTitle').textContent();
  console.log('[mobile] Título explicativo:', expTitle);
  if (!expTitle.includes('Plan Cero Deudas')) {
    throw new Error('El título explicativo no cambió a Plan Cero Deudas');
  }

  // Screenshot 2: Mobile Deudas
  await pageMobile.screenshot({ path: path.resolve(__dirname, 'landing_mobile_showcase_deudas.png') });
  console.log('✓ Screenshot mobile deudas tomado');

  // 2. DESKTOP TEST (MacBook Pro: 1440x900)
  console.log('[desktop] Probando landing en Desktop (1440x900)...');
  const pageDesk = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  await pageDesk.goto(`http://localhost:${port}/landing.html`, { waitUntil: 'load' });
  await pageDesk.waitForSelector('#tabDeviceDesktop');

  // Cambiar a vista Computadora
  await pageDesk.locator('#tabDeviceDesktop').click();
  await pageDesk.waitForTimeout(300);

  // Verificar que el marco de Mac es visible y el de celular se ocultó
  const macVisible = await pageDesk.locator('#showcaseMacFrame').isVisible();
  const phoneVisible = await pageDesk.locator('#showcasePhoneFrame').isVisible();
  console.log('[desktop] Mac visible:', macVisible, '| Phone visible:', phoneVisible);
  if (!macVisible || phoneVisible) {
    throw new Error('El marco de Mac debería estar visible y el de celular oculto');
  }

  const deskImgSrc = await pageDesk.locator('#showcaseDesktopImg').getAttribute('src');
  console.log('[desktop] Imagen escritorio:', deskImgSrc);
  if (!deskImgSrc.includes('real_desktop_inicio.png')) {
    throw new Error('La imagen de escritorio debe ser real_desktop_inicio.png');
  }

  // Screenshot 3: Desktop Inicio
  await pageDesk.screenshot({ path: path.resolve(__dirname, 'landing_desktop_showcase_inicio.png') });
  console.log('✓ Screenshot desktop inicio tomado');

  // Cambiar a Cero Deudas en Desktop
  await pageDesk.locator('#modPill_deudas').click();
  await pageDesk.waitForTimeout(300);
  const deskDebtsImg = await pageDesk.locator('#showcaseDesktopImg').getAttribute('src');
  if (!deskDebtsImg.includes('real_desktop_deudas.png')) {
    throw new Error('La imagen de escritorio de deudas no cambió');
  }

  // Screenshot 4: Desktop Deudas
  await pageDesk.screenshot({ path: path.resolve(__dirname, 'landing_desktop_showcase_deudas.png') });
  console.log('✓ Screenshot desktop deudas tomado');

  // Verificar sección de historia
  const storyEyebrow = await pageDesk.locator('.story-section .section-eyebrow').textContent();
  console.log('[desktop] Story eyebrow:', storyEyebrow.trim());
  if (!storyEyebrow.includes('personas de a pie')) {
    throw new Error('La sección de historia para personas de a pie no está presente');
  }

  // Probar modal de suscripción
  console.log('[modal] Probando botón de WhatsApp...');
  await pageDesk.evaluate(() => openPlanModal('Plan Anual PRO', '29.90', 'al año'));
  await pageDesk.waitForSelector('#planModalOverlay', { state: 'visible' });

  const btnWsp = pageDesk.locator('#btnPlanWhatsApp');
  const wspVisible = await btnWsp.isVisible();
  const wspHref = await btnWsp.getAttribute('href');
  console.log('[modal] WhatsApp link visible:', wspVisible, '| Href:', wspHref);
  if (!wspVisible || !wspHref.includes('wa.me/51914688135')) {
    throw new Error('El botón de WhatsApp no tiene el número o enlace correcto');
  }

  await browser.close();
  server.close();
  console.log('--- ¡TODOS LOS TESTS DE LANDING CON SHOWCASE REAL PASARON EXITOSAMENTE! ---');
})();
