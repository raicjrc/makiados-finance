const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const svgContent = fs.readFileSync(path.resolve(__dirname, 'monogram.svg'), 'utf8');
const match = svgContent.match(/d="([^"]+)"/);
const fullD = match[1];
const [stemPath, wavePath, smilePath] = fullD.split(/(?=M\s)/g).map(s => s.trim()).filter(Boolean);

// Creamos un SVG maestro con capas, sombras de profundidad y gradientes enriquecidos
const masterSvg = `
<svg viewBox="0 0 512 512" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradiente para el tallo / arco superior de la A -->
    <linearGradient id="stemGrad" x1="45%" y1="0%" x2="55%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="30%" stop-color="#10b981" />
      <stop offset="70%" stop-color="#059669" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>

    <!-- Gradiente para la cinta ondulada que cruza (efecto ola de alivio) -->
    <linearGradient id="waveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#047857" />
      <stop offset="25%" stop-color="#059669" />
      <stop offset="60%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>

    <!-- Gradiente para la curva de sonrisa inferior -->
    <linearGradient id="smileGrad" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#047857" />
      <stop offset="50%" stop-color="#059669" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>

    <!-- Sombra suave para que la cinta flote con profundidad táctil sobre el tallo -->
    <filter id="ribbonDepth" x="-20%" y="-20%" width="150%" height="150%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#042f2e" flood-opacity="0.32" />
    </filter>
  </defs>

  <!-- Capa 1: Tallo y ápice de la A -->
  <path d="${stemPath}" fill="url(#stemGrad)" />

  <!-- Capa 2: Curva de sonrisa inferior -->
  <path d="${smilePath}" fill="url(#smileGrad)" />

  <!-- Capa 3: Cinta ondulada frontal con sombra de relieve -->
  <path d="${wavePath}" fill="url(#waveGrad)" filter="url(#ribbonDepth)" />
</svg>
`;

fs.writeFileSync(path.resolve(__dirname, 'master_monogram.svg'), masterSvg);

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; background: #ffffff; display: flex; align-items: center; justify-content: center; height: 100vh; }
        .logo-box { width: 720px; height: 720px; display: flex; align-items: center; justify-content: center; }
      </style>
    </head>
    <body>
      <div class="logo-box">
        ${masterSvg}
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  const outPath = path.resolve(__dirname, 'test_layered_render.png');
  await page.screenshot({ path: outPath });
  await browser.close();
  console.log('Captura con capas y profundidad generada en scripts/test_layered_render.png');
})();
