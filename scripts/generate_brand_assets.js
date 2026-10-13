const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'assets', 'brand');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Leemos el monograma original en base64
const monoBase64 = fs.readFileSync(path.join(root, 'logo-monogram-512.png')).toString('base64');
const monoUri = `data:image/png;base64,${monoBase64}`;

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const templates = [
    {
      name: 'aliviafin-avatar-social-light-1024.png',
      width: 1024,
      height: 1024,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              width: 1024px;
              height: 1024px;
              background: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }
            .logo-wrap {
              width: 680px;
              height: 680px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .logo-wrap img {
              width: 100%;
              height: 100%;
              object-fit: contain;
              filter: drop-shadow(0 16px 32px rgba(16, 185, 129, 0.12));
            }
          </style>
        </head>
        <body>
          <div class="logo-wrap">
            <img src="${monoUri}" alt="AliviaFin">
          </div>
        </body>
        </html>
      `
    },
    {
      name: 'aliviafin-avatar-social-dark-1024.png',
      width: 1024,
      height: 1024,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              width: 1024px;
              height: 1024px;
              background: radial-gradient(circle at center, #111827 0%, #070a13 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }
            .logo-wrap {
              width: 680px;
              height: 680px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .logo-wrap img {
              width: 100%;
              height: 100%;
              object-fit: contain;
              filter: drop-shadow(0 20px 40px rgba(16, 185, 129, 0.25));
            }
          </style>
        </head>
        <body>
          <div class="logo-wrap">
            <img src="${monoUri}" alt="AliviaFin">
          </div>
        </body>
        </html>
      `
    },
    {
      name: 'aliviafin-monograma-transparente-1024.png',
      width: 1024,
      height: 1024,
      omitBackground: true,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              width: 1024px;
              height: 1024px;
              background: transparent;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }
            .logo-wrap {
              width: 820px;
              height: 820px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .logo-wrap img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <div class="logo-wrap">
            <img src="${monoUri}" alt="AliviaFin">
          </div>
        </body>
        </html>
      `
    },
    {
      name: 'aliviafin-logo-horizontal-light-2048.png',
      width: 2048,
      height: 640,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              width: 2048px;
              height: 640px;
              background: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            }
            .brand-row {
              display: flex;
              align-items: center;
              gap: 48px;
            }
            .logo-img {
              width: 240px;
              height: 240px;
              object-fit: contain;
              filter: drop-shadow(0 12px 24px rgba(16, 185, 129, 0.15));
            }
            .brand-name {
              font-size: 168px;
              font-weight: 800;
              letter-spacing: -0.04em;
              color: #0f172a;
              line-height: 1;
              display: flex;
              align-items: baseline;
            }
            .brand-dot {
              color: #10b981;
            }
            .brand-tagline {
              font-size: 32px;
              font-weight: 600;
              color: #64748b;
              letter-spacing: -0.01em;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="brand-row">
            <img src="${monoUri}" class="logo-img" alt="AliviaFin">
            <div>
              <div class="brand-name">aliviafin<span class="brand-dot">.</span></div>
              <div class="brand-tagline">Paz mental para tu dinero</div>
            </div>
          </div>
        </body>
        </html>
      `
    },
    {
      name: 'aliviafin-logo-horizontal-dark-2048.png',
      width: 2048,
      height: 640,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              width: 2048px;
              height: 640px;
              background: #090d16;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            }
            .brand-row {
              display: flex;
              align-items: center;
              gap: 48px;
            }
            .logo-img {
              width: 240px;
              height: 240px;
              object-fit: contain;
              filter: drop-shadow(0 14px 28px rgba(16, 185, 129, 0.3));
            }
            .brand-name {
              font-size: 168px;
              font-weight: 800;
              letter-spacing: -0.04em;
              color: #f8fafc;
              line-height: 1;
              display: flex;
              align-items: baseline;
            }
            .brand-dot {
              color: #10b981;
            }
            .brand-tagline {
              font-size: 32px;
              font-weight: 600;
              color: #94a3b8;
              letter-spacing: -0.01em;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="brand-row">
            <img src="${monoUri}" class="logo-img" alt="AliviaFin">
            <div>
              <div class="brand-name">aliviafin<span class="brand-dot">.</span></div>
              <div class="brand-tagline">Paz mental para tu dinero</div>
            </div>
          </div>
        </body>
        </html>
      `
    }
  ];

  for (const t of templates) {
    const page = await browser.newPage({
      viewport: { width: t.width, height: t.height },
      deviceScaleFactor: 1
    });
    await page.setContent(t.html, { waitUntil: 'networkidle' });
    // Pequeño timeout para renderizado de fuentes de Google Fonts
    await page.waitForTimeout(1000);
    const dest = path.join(outDir, t.name);
    await page.screenshot({
      path: dest,
      omitBackground: !!t.omitBackground
    });
    console.log(`Generado: ${t.name} (${t.width}x${t.height})`);
    await page.close();
  }

  await browser.close();
  console.log('¡Todos los logos en alta resolución han sido generados exitosamente en assets/brand/!');
})();
