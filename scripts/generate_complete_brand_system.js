const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const logotiposDir = path.join(root, 'Logotipos');

// Subcarpetas organizadas para toda la línea de marca
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

// Leemos el SVG suavizado
const rawSvg = fs.readFileSync(path.join(__dirname, 'smooth_monogram.svg'), 'utf8');
const match = rawSvg.match(/d="([^"]+)"/);
if (!match) throw new Error('No se encontró el path en smooth_monogram.svg');

const fullD = match[1];
const [stemPath, wavePath, smilePath] = fullD.split(/(?=M\s)/g).map(s => s.trim()).filter(Boolean);

// Función constructora del SVG del monograma con gradientes y sombras
function getMonogramSvgMarkup({ idPrefix = 'af', dropShadow = true } = {}) {
  return `
    <svg viewBox="0 0 512 512" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="display:block; overflow:visible;">
      <defs>
        <linearGradient id="${idPrefix}_stemGrad" x1="40%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stop-color="#34d399" />
          <stop offset="35%" stop-color="#10b981" />
          <stop offset="70%" stop-color="#059669" />
          <stop offset="100%" stop-color="#047857" />
        </linearGradient>

        <linearGradient id="${idPrefix}_waveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#047857" />
          <stop offset="25%" stop-color="#059669" />
          <stop offset="65%" stop-color="#10b981" />
          <stop offset="100%" stop-color="#34d399" />
        </linearGradient>

        <linearGradient id="${idPrefix}_smileGrad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="#047857" />
          <stop offset="50%" stop-color="#059669" />
          <stop offset="100%" stop-color="#10b981" />
        </linearGradient>

        ${dropShadow ? `
        <filter id="${idPrefix}_ribbonDepth" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="7" flood-color="#042f2e" flood-opacity="0.30" />
        </filter>
        ` : ''}
      </defs>

      <!-- Capa 1: Tallo y ápice de la A -->
      <path d="${stemPath}" fill="url(#${idPrefix}_stemGrad)" />

      <!-- Capa 2: Curva de sonrisa inferior -->
      <path d="${smilePath}" fill="url(#${idPrefix}_smileGrad)" />

      <!-- Capa 3: Cinta fluida frontal con relieve táctil -->
      <path d="${wavePath}" fill="url(#${idPrefix}_waveGrad)" ${dropShadow ? `filter="url(#${idPrefix}_ribbonDepth)"` : ''} />
    </svg>
  `;
}

// 1. Guardamos los archivos SVG puros
const svgPureMonogram = `<?xml version="1.0" encoding="UTF-8"?>
${getMonogramSvgMarkup({ idPrefix: 'pure', dropShadow: true })}`;
fs.writeFileSync(path.join(dirs.svg, 'AliviaFin_Monograma_Maestro.svg'), svgPureMonogram);

// SVG App Icon con Squircle Apple
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
    ${getMonogramSvgMarkup({ idPrefix: 'app', dropShadow: true })}
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
    ${getMonogramSvgMarkup({ idPrefix: isDark ? 'hd' : 'hl', dropShadow: true })}
  </g>
  <text x="470" y="295" class="brand-title">aliviafin<tspan fill="#10b981">.</tspan></text>
  <text x="476" y="360" class="brand-tag">Paz mental para tu dinero</text>
</svg>`;
}
fs.writeFileSync(path.join(dirs.svg, 'AliviaFin_Logo_Horizontal_Fondo_Claro.svg'), getHorizontalSvg(false));
fs.writeFileSync(path.join(dirs.svg, 'AliviaFin_Logo_Horizontal_Fondo_Oscuro.svg'), getHorizontalSvg(true));

console.log('Archivos SVG Maestros creados en:', dirs.svg);

// 2. Renderizado de PNGs de Ultra Alta Definición con Playwright
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const tasks = [
    // --- 01. Perfiles Sociales (1024x1024) ---
    {
      outPath: path.join(dirs.social, 'Avatar_Gmail_Instagram_TikTok_Fondo_Blanco_1024x1024.png'),
      width: 1024,
      height: 1024,
      deviceScaleFactor: 2,
      html: `
        <!DOCTYPE html><html><head><style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 1024px; height: 1024px; background: #ffffff; display: flex; align-items: center; justify-content: center; overflow: hidden; }
          .wrap { width: 680px; height: 680px; display: flex; align-items: center; justify-content: center; }
        </style></head><body>
          <div class="wrap">${getMonogramSvgMarkup({ idPrefix: 's1' })}</div>
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
          .wrap { width: 680px; height: 680px; display: flex; align-items: center; justify-content: center; }
        </style></head><body>
          <div class="wrap">${getMonogramSvgMarkup({ idPrefix: 's2' })}</div>
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
            width: 760px; height: 760px; border-radius: 180px; background: #ffffff;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 32px 64px -12px rgba(15, 23, 42, 0.15), 0 4px 12px rgba(15, 23, 42, 0.05);
            border: 1px solid rgba(0,0,0,0.06);
          }
          .icon { width: 560px; height: 560px; }
        </style></head><body>
          <div class="squircle"><div class="icon">${getMonogramSvgMarkup({ idPrefix: 's3' })}</div></div>
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
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { width: 4096px; height: 1280px; background: #ffffff; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
            .row { display: flex; align-items: center; gap: 96px; }
            .mono { width: 520px; height: 520px; }
            .title { font-size: 340px; font-weight: 800; letter-spacing: -0.04em; color: #0f172a; line-height: 1; }
            .dot { color: #10b981; }
            .tag { font-size: 68px; font-weight: 600; color: #64748b; margin-top: 24px; letter-spacing: -0.01em; }
          </style>
        </head><body>
          <div class="row">
            <div class="mono">${getMonogramSvgMarkup({ idPrefix: 'h1' })}</div>
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
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { width: 4096px; height: 1280px; background: #090d16; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
            .row { display: flex; align-items: center; gap: 96px; }
            .mono { width: 520px; height: 520px; }
            .title { font-size: 340px; font-weight: 800; letter-spacing: -0.04em; color: #f8fafc; line-height: 1; }
            .dot { color: #10b981; }
            .tag { font-size: 68px; font-weight: 600; color: #94a3b8; margin-top: 24px; letter-spacing: -0.01em; }
          </style>
        </head><body>
          <div class="row">
            <div class="mono">${getMonogramSvgMarkup({ idPrefix: 'h2' })}</div>
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
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { width: 4096px; height: 1280px; background: transparent; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
            .row { display: flex; align-items: center; gap: 96px; }
            .mono { width: 520px; height: 520px; }
            .title { font-size: 340px; font-weight: 800; letter-spacing: -0.04em; color: #0f172a; line-height: 1; }
            .dot { color: #10b981; }
            .tag { font-size: 68px; font-weight: 600; color: #64748b; margin-top: 24px; letter-spacing: -0.01em; }
          </style>
        </head><body>
          <div class="row">
            <div class="mono">${getMonogramSvgMarkup({ idPrefix: 'h3' })}</div>
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
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { width: 2048px; height: 2048px; background: #ffffff; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; text-align: center; }
            .mono { width: 680px; height: 680px; margin-bottom: 40px; }
            .title { font-size: 200px; font-weight: 800; letter-spacing: -0.04em; color: #0f172a; line-height: 1; }
            .dot { color: #10b981; }
            .tag { font-size: 48px; font-weight: 600; color: #64748b; margin-top: 24px; letter-spacing: -0.01em; }
          </style>
        </head><body>
          <div class="mono">${getMonogramSvgMarkup({ idPrefix: 'v1' })}</div>
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
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { width: 2048px; height: 2048px; background: #090d16; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; text-align: center; }
            .mono { width: 680px; height: 680px; margin-bottom: 40px; }
            .title { font-size: 200px; font-weight: 800; letter-spacing: -0.04em; color: #f8fafc; line-height: 1; }
            .dot { color: #10b981; }
            .tag { font-size: 48px; font-weight: 600; color: #94a3b8; margin-top: 24px; letter-spacing: -0.01em; }
          </style>
        </head><body>
          <div class="mono">${getMonogramSvgMarkup({ idPrefix: 'v2' })}</div>
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
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { width: 2048px; height: 2048px; background: transparent; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; text-align: center; }
            .mono { width: 680px; height: 680px; margin-bottom: 40px; }
            .title { font-size: 200px; font-weight: 800; letter-spacing: -0.04em; color: #0f172a; line-height: 1; }
            .dot { color: #10b981; }
            .tag { font-size: 48px; font-weight: 600; color: #64748b; margin-top: 24px; letter-spacing: -0.01em; }
          </style>
        </head><body>
          <div class="mono">${getMonogramSvgMarkup({ idPrefix: 'v3' })}</div>
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
          .wrap { width: 1560px; height: 1560px; }
        </style></head><body>
          <div class="wrap">${getMonogramSvgMarkup({ idPrefix: 'm1' })}</div>
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
          .wrap { width: 1400px; height: 1400px; }
        </style></head><body>
          <div class="wrap">${getMonogramSvgMarkup({ idPrefix: 'm2' })}</div>
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
          .wrap { width: 1400px; height: 1400px; }
        </style></head><body>
          <div class="wrap">${getMonogramSvgMarkup({ idPrefix: 'm3' })}</div>
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
            width: 1600px; height: 1600px; border-radius: 380px; background: #ffffff;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 48px 96px -16px rgba(15, 23, 42, 0.16), 0 8px 24px rgba(15, 23, 42, 0.06);
            border: 2px solid rgba(0,0,0,0.05);
          }
          .icon { width: 1180px; height: 1180px; }
        </style></head><body>
          <div class="squircle"><div class="icon">${getMonogramSvgMarkup({ idPrefix: 'm4' })}</div></div>
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
    await page.waitForTimeout(800);
    await page.screenshot({
      path: t.outPath,
      omitBackground: !!t.omitBackground
    });
    console.log(`Renderizado HD: ${path.basename(t.outPath)} (${t.width}x${t.height})`);
    await page.close();
  }

  await browser.close();

  // 3. Creamos copias directas de acceso rápido en la raíz de 'Logotipos/'
  fs.copyFileSync(
    path.join(dirs.social, 'Avatar_Gmail_Instagram_TikTok_Fondo_Blanco_1024x1024.png'),
    path.join(logotiposDir, '01_Avatar_Gmail_Instagram_TikTok_Blanco_1024x1024.png')
  );
  fs.copyFileSync(
    path.join(dirs.social, 'Avatar_Gmail_Instagram_TikTok_Fondo_Oscuro_1024x1024.png'),
    path.join(logotiposDir, '02_Avatar_Redes_Fondo_Oscuro_1024x1024.png')
  );
  fs.copyFileSync(
    path.join(dirs.monogram, 'Isotipo_Monograma_Transparente_2048x2048.png'),
    path.join(logotiposDir, '03_Isotipo_Monograma_Transparente_2048x2048.png')
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

  // Copiamos también a assets/brand para la web
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

  console.log('¡TODA LA LÍNEA DE MARCA ALIVIAFIN EN ULTRA HD Y SVG COMPLETADA EXITOSAMENTE!');
})();
