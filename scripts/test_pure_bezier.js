const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

// Diseñamos el monograma maestro con curvas de Bézier geométricas PURAS (sin autotrace, sin serrucho)
// Cada trazo tiene puntos de control tangenciales perfectos y stroke-linecap="round"
const svgClean = `
<svg viewBox="0 0 512 512" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="display:block; overflow:visible;">
  <defs>
    <!-- Gradiente Esmeralda Luminoso para el trazo principal de la A -->
    <linearGradient id="gStem" x1="40%" y1="0%" x2="60%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="40%" stop-color="#10b981" />
      <stop offset="85%" stop-color="#059669" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>

    <!-- Gradiente para la cinta ondulada que cruza -->
    <linearGradient id="gWave" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#047857" />
      <stop offset="25%" stop-color="#059669" />
      <stop offset="65%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>

    <!-- Gradiente para la sonrisa inferior -->
    <linearGradient id="gSmile" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#047857" />
      <stop offset="50%" stop-color="#059669" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>

    <!-- Sombra suave táctil para que la cinta flote con relieve realista -->
    <filter id="fShadow" x="-20%" y="-20%" width="150%" height="150%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#022c22" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- 1. Tallo y ápice de la A: Curva fluida limpia -->
  <!-- Baja desde la izquierda hacia el ápice y cae con elegancia hacia la derecha -->
  <path d="M 215 250 
           C 220 220, 242 135, 262 108 
           C 268 99, 276 99, 281 106 
           C 292 120, 318 190, 345 285" 
        fill="none" 
        stroke="url(#gStem)" 
        stroke-width="48" 
        stroke-linecap="round" 
        stroke-linejoin="round" />

  <!-- 2. Sonrisa inferior en la base derecha -->
  <path d="M 242 342 
           C 265 378, 320 388, 365 330" 
        fill="none" 
        stroke="url(#gSmile)" 
        stroke-width="46" 
        stroke-linecap="round" />

  <!-- 3. Cinta fluida frontal (bucle inferior izquierdo que cruza como ola de alivio) -->
  <path d="M 200 315 
           C 185 365, 155 385, 125 365 
           C 95 345, 105 295, 150 278 
           C 210 255, 290 265, 335 240 
           C 355 228, 370 205, 380 195" 
        fill="none" 
        stroke="url(#gWave)" 
        stroke-width="48" 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        filter="url(#fShadow)" />
</svg>
`;

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });

  const html = `
    <!DOCTYPE html><html><head><style>
      body { margin: 0; background: #ffffff; display: flex; align-items: center; justify-content: center; height: 100vh; }
      .box { width: 720px; height: 720px; }
    </style></head><body>
      <div class="box">${svgClean}</div>
    </body></html>
  `;

  await page.setContent(html);
  const out = path.resolve(__dirname, 'test_pure_bezier.png');
  await page.screenshot({ path: out });
  await browser.close();
  console.log('Captura generada en scripts/test_pure_bezier.png');
})();
