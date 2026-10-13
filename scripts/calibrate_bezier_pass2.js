const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 512, height: 512 } });

  const logoBase64 = fs.readFileSync(path.resolve(__dirname, '..', 'logo.png')).toString('base64');

  const html = `
    <!DOCTYPE html><html><head><style>
      body { margin: 0; background: #fff; width: 512px; height: 512px; position: relative; }
      .orig { position: absolute; top: 0; left: 0; width: 512px; height: 512px; opacity: 0.45; }
      .vec { position: absolute; top: 0; left: 0; width: 512px; height: 512px; }
    </style></head><body>
      <img class="orig" src="data:image/png;base64,${logoBase64}" />
      <svg class="vec" viewBox="0 0 512 512">
        <!-- 1. Tallo de la A: desde la base izquierda pasando por el ápice hasta la base derecha -->
        <path d="M 180 340 
                 C 195 270, 244 116, 263 100 
                 C 269 95, 276 95, 281 102 
                 C 298 128, 325 220, 345 305" 
              fill="none" 
              stroke="#ef4444" 
              stroke-width="50" 
              stroke-linecap="round" 
              stroke-linejoin="round" />

        <!-- 2. Sonrisa inferior -->
        <path d="M 240 348 
                 C 275 405, 350 405, 400 322" 
              fill="none" 
              stroke="#3b82f6" 
              stroke-width="50" 
              stroke-linecap="round" />

        <!-- 3. Cinta ondulada que cruza -->
        <path d="M 178 335 
                 C 160 380, 132 396, 112 376 
                 C 86 350, 104 300, 150 280 
                 C 215 252, 298 266, 342 242 
                 C 362 230, 372 208, 380 196" 
              fill="none" 
              stroke="#10b981" 
              stroke-width="52" 
              stroke-linecap="round" 
              stroke-linejoin="round" />
      </svg>
    </body></html>
  `;

  await page.setContent(html);
  await page.screenshot({ path: path.resolve(__dirname, 'overlay_pass2.png') });
  await browser.close();
  console.log('Calibración pass 2 generada en scripts/overlay_pass2.png');
})();
