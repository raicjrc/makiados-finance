const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });

  const svgContent = fs.readFileSync(path.resolve(__dirname, 'monogram.svg'), 'utf8');

  // Extraemos el atributo 'd' de monogram.svg
  const match = svgContent.match(/d="([^"]+)"/);
  const pathD = match ? match[1] : '';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; background: #ffffff; display: flex; align-items: center; justify-content: center; height: 100vh; }
        svg { width: 680px; height: 680px; }
      </style>
    </head>
    <body>
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fintechGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stop-color="#34d399" />
            <stop offset="35%" stop-color="#10b981" />
            <stop offset="70%" stop-color="#059669" />
            <stop offset="100%" stop-color="#047857" />
          </linearGradient>
        </defs>
        <path d="${pathD}" fill="url(#fintechGrad)" fill-rule="evenodd" />
      </svg>
    </body>
    </html>
  `;

  await page.setContent(html);
  const outPath = path.resolve(__dirname, 'test_vector_render.png');
  await page.screenshot({ path: outPath });
  await browser.close();
  console.log('Captura generada en scripts/test_vector_render.png');
})();
