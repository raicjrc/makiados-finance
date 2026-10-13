const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

// Master Pure Vector SVG Definition
function getMasterVectorSvg({ idPrefix = 'af', shadow = true } = {}) {
  return `
  <svg viewBox="0 0 512 512" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="display:block; overflow:visible;">
    <defs>
      <!-- Gradiente para el tallo/arco principal de la A -->
      <linearGradient id="${idPrefix}_stemGrad" x1="35%" y1="0%" x2="65%" y2="100%">
        <stop offset="0%" stop-color="#34d399" />
        <stop offset="35%" stop-color="#10b981" />
        <stop offset="75%" stop-color="#059669" />
        <stop offset="100%" stop-color="#047857" />
      </linearGradient>

      <!-- Gradiente para la cinta ondulada de alivio financiero -->
      <linearGradient id="${idPrefix}_waveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#047857" />
        <stop offset="22%" stop-color="#059669" />
        <stop offset="65%" stop-color="#10b981" />
        <stop offset="100%" stop-color="#34d399" />
      </linearGradient>

      <!-- Gradiente para el arco de sonrisa inferior -->
      <linearGradient id="${idPrefix}_smileGrad" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stop-color="#047857" />
        <stop offset="50%" stop-color="#059669" />
        <stop offset="100%" stop-color="#10b981" />
      </linearGradient>

      ${shadow ? `
      <!-- Sombra de relieve suave Apple para la cinta sobre el tallo -->
      <filter id="${idPrefix}_waveShadow" x="-20%" y="-20%" width="150%" height="150%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#022c22" flood-opacity="0.28" />
      </filter>
      ` : ''}
    </defs>

    <!-- 1. Tallo y ápice de la A (Curva de Bézier pura, cero serrucho) -->
    <path d="M 178 342 
             C 192 270, 240 114, 258 98 
             C 264 93, 273 93, 279 100 
             C 296 126, 324 220, 346 304" 
          fill="none" 
          stroke="url(#${idPrefix}_stemGrad)" 
          stroke-width="50" 
          stroke-linecap="round" 
          stroke-linejoin="round" />

    <!-- 2. Sonrisa inferior en base derecha -->
    <path d="M 238 348 
             C 274 406, 348 406, 398 322" 
          fill="none" 
          stroke="url(#${idPrefix}_smileGrad)" 
          stroke-width="48" 
          stroke-linecap="round" />

    <!-- 3. Cinta frontal ondulada con sombra de profundidad táctil -->
    <path d="M 178 335 
             C 160 380, 130 398, 110 376 
             C 84 348, 102 298, 150 278 
             C 214 252, 298 266, 342 242 
             C 362 230, 372 208, 380 196" 
          fill="none" 
          stroke="url(#${idPrefix}_waveGrad)" 
          stroke-width="52" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          ${shadow ? `filter="url(#${idPrefix}_waveShadow)"` : ''} />
  </svg>
  `;
}

module.exports = { getMasterVectorSvg };

if (require.main === module) {
  (async () => {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });

    const html = `
      <!DOCTYPE html><html><head><style>
        body { margin: 0; background: #ffffff; display: flex; align-items: center; justify-content: center; height: 100vh; }
        .box { width: 720px; height: 720px; }
      </style></head><body>
        <div class="box">${getMasterVectorSvg({ idPrefix: 'final', shadow: true })}</div>
      </body></html>
    `;

    await page.setContent(html);
    await page.screenshot({ path: path.resolve(__dirname, 'master_clean_4k.png') });
    await browser.close();
    console.log('Captura limpia 4K generada en scripts/master_clean_4k.png');
  })();
}
