const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 512, height: 512 } });

  const logoBase64 = fs.readFileSync(path.resolve(__dirname, '..', 'logo.png')).toString('base64');

  // Ajustamos los puntos de control Bézier para calzar al 100% con la geometría original
  const html = `
    <!DOCTYPE html><html><head><style>
      body { margin: 0; background: #fff; width: 512px; height: 512px; position: relative; }
      .orig { position: absolute; top: 0; left: 0; width: 512px; height: 512px; opacity: 0.4; }
      .vec { position: absolute; top: 0; left: 0; width: 512px; height: 512px; }
    </style></head><body>
      <img class="orig" src="data:image/png;base64,${logoBase64}" />
      <svg class="vec" viewBox="0 0 512 512">
        <!-- 1. Tallo y ápice de la A -->
        <path d="M 208 245 
                 C 216 200, 246 116, 264 100 
                 C 270 94, 276 95, 281 102 
                 C 295 125, 322 215, 345 305" 
              fill="none" 
              stroke="#ef4444" 
              stroke-width="48" 
              stroke-linecap="round" 
              stroke-linejoin="round" />

        <!-- 2. Sonrisa inferior -->
        <path d="M 235 348 
                 C 270 395, 345 395, 395 320" 
              fill="none" 
              stroke="#3b82f6" 
              stroke-width="48" 
              stroke-linecap="round" />

        <!-- 3. Cinta ondulada -->
        <path d="M 195 330 
                 C 180 375, 145 392, 118 368 
                 C 92 342, 108 296, 150 278 
                 C 215 252, 298 266, 342 242 
                 C 362 230, 375 208, 384 195" 
              fill="none" 
              stroke="#10b981" 
              stroke-width="50" 
              stroke-linecap="round" 
              stroke-linejoin="round" />
      </svg>
    </body></html>
  `;

  await page.setContent(html);
  await page.screenshot({ path: path.resolve(__dirname, 'overlay_check.png') });
  await browser.close();
  console.log('Comparación overlay generada en scripts/overlay_check.png');
})();
