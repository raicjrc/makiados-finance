const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { getMasterVectorSvg } = require('./master_vector_definition');

const root = path.resolve(__dirname, '..');
const logotiposDir = path.join(root, 'Logotipos');

const dirs = {
  social: path.join(logotiposDir, '01_Perfiles_Sociales_1024x1024'),
  horizontal: path.join(logotiposDir, '02_Logotipos_Horizontales_UltraHD_4K'),
  vertical: path.join(logotiposDir, '03_Logotipos_Verticales_Centrados_UltraHD_2K'),
  monogram: path.join(logotiposDir, '04_Isotipos_Monograma_Solo_2048x2048'),
  svg: path.join(logotiposDir, '05_Vectores_Oficiales_SVG_Infinitos'),
  brandAssets: path.join(root, 'assets', 'brand')
};

Object.values(dirs).forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// 1. Guardamos los archivos SVG puros de calidad matemática infinita
fs.writeFileSync(
  path.join(dirs.svg, 'AliviaFin_Monograma_Maestro.svg'),
  `<?xml version="1.0" encoding="UTF-8"?>\n${getMasterVectorSvg({ idPrefix: 'pure', shadow: true })}`
);

// SVG App Icon Apple Squircle
const svgAppIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sqBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f8fafc" />
    </linearGradient>
    <filter id="sqShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#0f172a" flood-opacity="0.08" />
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0f172a" flood-opacity="0.04" />
    </filter>
  </defs>
  <rect x="24" y="24" width="464" height="464" rx="104" fill="url(#sqBg)" stroke="rgba(0,0,0,0.06)" stroke-width="2" filter="url(#sqShadow)" />
  <g transform="translate(48, 48) scale(0.8125)">
    ${getMasterVectorSvg({ idPrefix: 'app', shadow: true })}
  </g>
</svg>`;
fs.writeFileSync(path.join(dirs.svg, 'AliviaFin_Icono_App_Apple.svg'), svgAppIcon);

// SVG Horizontal
function getHorizontalSvg(isDark = false) {
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const tagColor = isDark ? '#94a3b8' : '#64748b';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 1600 500" width="1600" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&amp;display=swap');
      .brand-title {
        font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
        font-weight: 800;
        font-size: 156px;
        letter-spacing: -0.04em;
        fill: ${textColor};
      }
      .brand-tag {
        font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
        font-weight: 600;
        font-size: 32px;
        letter-spacing: -0.01em;
        fill: ${tagColor};
      }
    </style>
  </defs>
  <g transform="translate(90, 85) scale(0.64)">
    ${getMasterVectorSvg({ idPrefix: isDark ? 'hd' : 'hl', shadow: true })}
  </g>
  <text x="470" y="295" class="brand-title">aliviafin<tspan fill="#10b981">.</tspan></text>
  <text x="476" y="360" class="brand-tag">Paz mental para tu dinero</text>
</svg>`;
}
fs.writeFileSync(path.join(dirs.svg, 'AliviaFin_Logo_Horizontal_Fondo_Claro.svg'), getHorizontalSvg(false));
fs.writeFileSync(path.join(dirs.svg, 'AliviaFin_Logo_Horizontal_Fondo_Oscuro.svg'), getHorizontalSvg(true));

// Copiar a assets/brand para la web
fs.copyFileSync(path.join(dirs.svg, 'AliviaFin_Monograma_Maestro.svg'), path.join(dirs.brandAssets, 'AliviaFin_Monograma_Maestro.svg'));
fs.copyFileSync(path.join(dirs.svg, 'AliviaFin_Icono_App_Apple.svg'), path.join(dirs.brandAssets, 'AliviaFin_Icono_App_Apple.svg'));
fs.copyFileSync(path.join(dirs.svg, 'AliviaFin_Logo_Horizontal_Fondo_Claro.svg'), path.join(dirs.brandAssets, 'AliviaFin_Logo_Horizontal_Fondo_Claro.svg'));
fs.copyFileSync(path.join(dirs.svg, 'AliviaFin_Logo_Horizontal_Fondo_Oscuro.svg'), path.join(dirs.brandAssets, 'AliviaFin_Logo_Horizontal_Fondo_Oscuro.svg'));

// 2. Renderizado de PNGs en Ultra HD (4096px / 2048px)
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const tasks = [
    // --- 01. Perfiles Sociales (1024x1024 con scale 2 = 2048x2048 real para Retina 4K) ---
    {
      outPath: path.join(dirs.social, 'Avatar_Gmail_Instagram_TikTok_Fondo_Blanco_1024x1024.png'),
      width: 1024,
      height: 1024,
      deviceScaleFactor: 2,
      html: `
        <!DOCTYPE html><html><head><style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 1024px; height: 1024px; background: #ffffff; display: flex; align-items: center; justify-content: center; overflow: hidden; }
          .wrap { width: 720px; height: 720px; display: flex; align-items: center; justify-content: center; }
        </style></head><body>
          <div class="wrap">${getMasterVectorSvg({ idPrefix: 's1' })}</div>
        </body></html>
      `
    },
    {
      outPath: path.join(dirs.social, 'Avatar_Gmail_Instagram_TikTok_Fondo_Oscuro_1024x1024.png'),
      width: 1024,
      height: 1024,
      deviceScaleFactor: 2,
      html: `
        <!DOCTYPE html><html><head><style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 1024px; height: 1024px; background: radial-gradient(circle at center, #111827 0%, #070a13 100%); display: flex; align-items: center; justify-content: center; overflow: hidden; }
          .wrap { width: 720px; height: 720px; display: flex; align-items: center; justify-content: center; }
        </style></head><body>
          <div class="wrap">${getMasterVectorSvg({ idPrefix: 's2' })}</div>
        </body></html>
      `
    },
    {
      outPath: path.join(dirs.social, 'Avatar_Con_Texto_Redes_Blanco_1024x1024.png'),
      width: 1024,
      height: 1024,
      deviceScaleFactor: 2,
      html: `
        <!DOCTYPE html><html><head>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { width: 1024px; height: 1024px; background: #ffffff; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
            .wrap { width: 520px; height: 520px; margin-bottom: 8px; }
            .name { font-size: 104px; font-weight: 800; letter-spacing: -0.04em; color: #0f172a; line-height: 1; }
            .dot { color: #10b981; }
          </style>
        </head><body>
          <div class="wrap">${getMasterVectorSvg({ idPrefix: 'sText' })}</div>
          <div class="name">aliviafin<span class="dot">.</span></div>
        </body></html>
      `
    },
    {
      outPath: path.join(dirs.social, 'Avatar_Gmail_Instagram_TikTok_Squircle_Apple_1024x1024.png'),
      width: 1024,
      height: 1024,
      deviceScaleFactor: 2,
      html: `
        <!DOCTYPE html><html><head><style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 1024px; height: 1024px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; overflow: hidden; }
          .squircle {
            width: 780px; height: 780px; border-radius: 185px; background: #ffffff;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 32px 64px -12px rgba(15, 23, 42, 0.16), 0 4px 12px rgba(15, 23, 42, 0.05);
            border: 1px solid rgba(0,0,0,0.06);
          }
          .icon { width: 580px; height: 580px; }
        </style></head><body>
          <div class="squircle"><div class="icon">${getMasterVectorSvg({ idPrefix: 's3' })}</div></div>
        </body></html>
      `
    },

    // --- 02. Logotipos Horizontales UltraHD 4K (4096x1280) ---
    {
      outPath: path.join(dirs.horizontal, 'Logo_Horizontal_Fondo_Blanco_4096x1280.png'),
      width: 4096,
      height: 1280,
      deviceScaleFactor: 1,
      html: `
        <!DOCTYPE html><html><head>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { width: 4096px; height: 1280px; background: #ffffff; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
            .row { display: flex; align-items: center; gap: 96px; }
            .mono { width: 540px; height: 540px; }
            .title { font-size: 340px; font-weight: 800; letter-spacing: -0.04em; color: #0f172a; line-height: 1; }
            .dot { color: #10b981; }
            .tag { font-size: 68px; font-weight: 600; color: #64748b; margin-top: 24px; letter-spacing: -0.01em; }
          </style>
        </head><body>
          <div class="row">
            <div class="mono">${getMasterVectorSvg({ idPrefix: 'h1' })}</div>
            <div>
              <div class="title">aliviafin<span class="dot">.</span></div>
              <div class="tag">Paz mental para tu dinero</div>
            </div>
          </div>
        </body></html>
      `
    },
    {
      outPath: path.join(dirs.horizontal, 'Logo_Horizontal_Fondo_Oscuro_4096x1280.png'),
      width: 4096,
      height: 1280,
      deviceScaleFactor: 1,
      html: `
        <!DOCTYPE html><html><head>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { width: 4096px; height: 1280px; background: #090d16; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
            .row { display: flex; align-items: center; gap: 96px; }
            .mono { width: 540px; height: 540px; }
            .title { font-size: 340px; font-weight: 800; letter-spacing: -0.04em; color: #f8fafc; line-height: 1; }
            .dot { color: #10b981; }
            .tag { font-size: 68px; font-weight: 600; color: #94a3b8; margin-top: 24px; letter-spacing: -0.01em; }
          </style>
        </head><body>
          <div class="row">
            <div class="mono">${getMasterVectorSvg({ idPrefix: 'h2' })}</div>
            <div>
              <div class="title">aliviafin<span class="dot">.</span></div>
              <div class="tag">Paz mental para tu dinero</div>
            </div>
          </div>
        </body></html>
      `
    },
    {
      outPath: path.join(dirs.horizontal, 'Logo_Horizontal_Transparente_4096x1280.png'),
      width: 4096,
      height: 1280,
      deviceScaleFactor: 1,
      omitBackground: true,
      html: `
        <!DOCTYPE html><html><head>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { width: 4096px; height: 1280px; background: transparent; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
            .row { display: flex; align-items: center; gap: 96px; }
            .mono { width: 540px; height: 540px; }
            .title { font-size: 340px; font-weight: 800; letter-spacing: -0.04em; color: #0f172a; line-height: 1; }
            .dot { color: #10b981; }
            .tag { font-size: 68px; font-weight: 600; color: #64748b; margin-top: 24px; letter-spacing: -0.01em; }
          </style>
        </head><body>
          <div class="row">
            <div class="mono">${getMasterVectorSvg({ idPrefix: 'h3' })}</div>
            <div>
              <div class="title">aliviafin<span class="dot">.</span></div>
              <div class="tag">Paz mental para tu dinero</div>
            </div>
          </div>
        </body></html>
      `
    },

    // --- 03. Logotipo Vertical / Centrado UltraHD (2048x2048) ---
    {
      outPath: path.join(dirs.vertical, 'Logo_Vertical_Fondo_Blanco_2048x2048.png'),
      width: 2048,
      height: 2048,
      deviceScaleFactor: 1,
      html: `
        <!DOCTYPE html><html><head>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { width: 2048px; height: 2048px; background: #ffffff; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; text-align: center; }
            .mono { width: 720px; height: 720px; margin-bottom: 48px; }
            .title { font-size: 210px; font-weight: 800; letter-spacing: -0.04em; color: #0f172a; line-height: 1; }
            .dot { color: #10b981; }
            .tag { font-size: 52px; font-weight: 600; color: #64748b; margin-top: 24px; letter-spacing: -0.01em; }
          </style>
        </head><body>
          <div class="mono">${getMasterVectorSvg({ idPrefix: 'v1' })}</div>
          <div class="title">aliviafin<span class="dot">.</span></div>
          <div class="tag">Paz mental para tu dinero</div>
        </body></html>
      `
    },
    {
      outPath: path.join(dirs.vertical, 'Logo_Vertical_Fondo_Oscuro_2048x2048.png'),
      width: 2048,
      height: 2048,
      deviceScaleFactor: 1,
      html: `
        <!DOCTYPE html><html><head>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { width: 2048px; height: 2048px; background: #090d16; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; text-align: center; }
            .mono { width: 720px; height: 720px; margin-bottom: 48px; }
            .title { font-size: 210px; font-weight: 800; letter-spacing: -0.04em; color: #f8fafc; line-height: 1; }
            .dot { color: #10b981; }
            .tag { font-size: 52px; font-weight: 600; color: #94a3b8; margin-top: 24px; letter-spacing: -0.01em; }
          </style>
        </head><body>
          <div class="mono">${getMasterVectorSvg({ idPrefix: 'v2' })}</div>
          <div class="title">aliviafin<span class="dot">.</span></div>
          <div class="tag">Paz mental para tu dinero</div>
        </body></html>
      `
    },
    {
      outPath: path.join(dirs.vertical, 'Logo_Vertical_Transparente_2048x2048.png'),
      width: 2048,
      height: 2048,
      deviceScaleFactor: 1,
      omitBackground: true,
      html: `
        <!DOCTYPE html><html><head>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { width: 2048px; height: 2048px; background: transparent; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; text-align: center; }
            .mono { width: 720px; height: 720px; margin-bottom: 48px; }
            .title { font-size: 210px; font-weight: 800; letter-spacing: -0.04em; color: #0f172a; line-height: 1; }
            .dot { color: #10b981; }
            .tag { font-size: 52px; font-weight: 600; color: #64748b; margin-top: 24px; letter-spacing: -0.01em; }
          </style>
        </head><body>
          <div class="mono">${getMasterVectorSvg({ idPrefix: 'v3' })}</div>
          <div class="title">aliviafin<span class="dot">.</span></div>
          <div class="tag">Paz mental para tu dinero</div>
        </body></html>
      `
    },

    // --- 04. Isotipo Monograma Solo 2048x2048 ---
    {
      outPath: path.join(dirs.monogram, 'Isotipo_Monograma_Transparente_2048x2048.png'),
      width: 2048,
      height: 2048,
      deviceScaleFactor: 1,
      omitBackground: true,
      html: `
        <!DOCTYPE html><html><head><style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 2048px; height: 2048px; background: transparent; display: flex; align-items: center; justify-content: center; overflow: hidden; }
          .wrap { width: 1600px; height: 1600px; }
        </style></head><body>
          <div class="wrap">${getMasterVectorSvg({ idPrefix: 'm1' })}</div>
        </body></html>
      `
    },
    {
      outPath: path.join(dirs.monogram, 'Isotipo_Monograma_Fondo_Blanco_2048x2048.png'),
      width: 2048,
      height: 2048,
      deviceScaleFactor: 1,
      html: `
        <!DOCTYPE html><html><head><style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 2048px; height: 2048px; background: #ffffff; display: flex; align-items: center; justify-content: center; overflow: hidden; }
          .wrap { width: 1450px; height: 1450px; }
        </style></head><body>
          <div class="wrap">${getMasterVectorSvg({ idPrefix: 'm2' })}</div>
        </body></html>
      `
    },
    {
      outPath: path.join(dirs.monogram, 'Isotipo_Monograma_Fondo_Oscuro_2048x2048.png'),
      width: 2048,
      height: 2048,
      deviceScaleFactor: 1,
      html: `
        <!DOCTYPE html><html><head><style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 2048px; height: 2048px; background: radial-gradient(circle at center, #111827 0%, #070a13 100%); display: flex; align-items: center; justify-content: center; overflow: hidden; }
          .wrap { width: 1450px; height: 1450px; }
        </style></head><body>
          <div class="wrap">${getMasterVectorSvg({ idPrefix: 'm3' })}</div>
        </body></html>
      `
    },
    {
      outPath: path.join(dirs.monogram, 'Isotipo_App_Icon_Squircle_Apple_2048x2048.png'),
      width: 2048,
      height: 2048,
      deviceScaleFactor: 1,
      html: `
        <!DOCTYPE html><html><head><style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 2048px; height: 2048px; background: #f8fafc; display: flex; align-items: center; justify-content: center; overflow: hidden; }
          .squircle {
            width: 1640px; height: 1640px; border-radius: 390px; background: #ffffff;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 48px 96px -16px rgba(15, 23, 42, 0.16), 0 8px 24px rgba(15, 23, 42, 0.06);
            border: 2px solid rgba(0,0,0,0.05);
          }
          .icon { width: 1220px; height: 1220px; }
        </style></head><body>
          <div class="squircle"><div class="icon">${getMasterVectorSvg({ idPrefix: 'm4' })}</div></div>
        </body></html>
      `
    }
  ];

  for (const t of tasks) {
    const page = await browser.newPage({
      viewport: { width: t.width, height: t.height },
      deviceScaleFactor: t.deviceScaleFactor || 1
    });
    await page.setContent(t.html, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: t.outPath,
      omitBackground: !!t.omitBackground
    });
    console.log(`Renderizado Ultra 4K: ${path.basename(t.outPath)} (${t.width}x${t.height})`);
    await page.close();
  }

  await browser.close();

  // 3. Accesos directos en la raíz de 'Logotipos/'
  fs.copyFileSync(
    path.join(dirs.social, 'Avatar_Gmail_Instagram_TikTok_Fondo_Blanco_1024x1024.png'),
    path.join(logotiposDir, '01_Avatar_Gmail_Instagram_TikTok_Blanco_1024x1024.png')
  );
  fs.copyFileSync(
    path.join(dirs.social, 'Avatar_Gmail_Instagram_TikTok_Fondo_Oscuro_1024x1024.png'),
    path.join(logotiposDir, '02_Avatar_Redes_Fondo_Oscuro_1024x1024.png')
  );
  fs.copyFileSync(
    path.join(dirs.social, 'Avatar_Con_Texto_Redes_Blanco_1024x1024.png'),
    path.join(logotiposDir, '03_Avatar_Con_Texto_aliviafin_1024x1024.png')
  );
  fs.copyFileSync(
    path.join(dirs.horizontal, 'Logo_Horizontal_Fondo_Blanco_4096x1280.png'),
    path.join(logotiposDir, '04_Logo_Horizontal_Fondo_Blanco_4096x1280.png')
  );
  fs.copyFileSync(
    path.join(dirs.horizontal, 'Logo_Horizontal_Fondo_Oscuro_4096x1280.png'),
    path.join(logotiposDir, '05_Logo_Horizontal_Fondo_Oscuro_4096x1280.png')
  );
  fs.copyFileSync(
    path.join(dirs.monogram, 'Isotipo_App_Icon_Squircle_Apple_2048x2048.png'),
    path.join(logotiposDir, '06_Icono_App_Apple_Squircle_2048x2048.png')
  );

  // Copiamos a assets/brand para la web
  fs.copyFileSync(
    path.join(dirs.social, 'Avatar_Gmail_Instagram_TikTok_Fondo_Blanco_1024x1024.png'),
    path.join(dirs.brandAssets, 'aliviafin-avatar-social-light-1024.png')
  );
  fs.copyFileSync(
    path.join(dirs.social, 'Avatar_Gmail_Instagram_TikTok_Fondo_Oscuro_1024x1024.png'),
    path.join(dirs.brandAssets, 'aliviafin-avatar-social-dark-1024.png')
  );
  fs.copyFileSync(
    path.join(dirs.horizontal, 'Logo_Horizontal_Fondo_Blanco_4096x1280.png'),
    path.join(dirs.brandAssets, 'aliviafin-logo-horizontal-light-2048.png')
  );
  fs.copyFileSync(
    path.join(dirs.horizontal, 'Logo_Horizontal_Fondo_Oscuro_4096x1280.png'),
    path.join(dirs.brandAssets, 'aliviafin-logo-horizontal-dark-2048.png')
  );
  fs.copyFileSync(
    path.join(dirs.monogram, 'Isotipo_Monograma_Transparente_2048x2048.png'),
    path.join(dirs.brandAssets, 'aliviafin-monograma-transparente-1024.png')
  );

  console.log('¡SISTEMA DE MARCA ALIVIAFIN EN ULTRA HD 4K GENERADO!');
})();
