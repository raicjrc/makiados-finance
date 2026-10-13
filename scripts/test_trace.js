const fs = require('fs');
const path = require('path');
const potrace = require('potrace');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  // Cargamos logo.png en una página para manipular sus píxeles en Canvas
  const logoPath = path.resolve(__dirname, '..', 'logo.png');
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <canvas id="c" width="512" height="512"></canvas>
      <script>
        const img = new Image();
        img.src = 'data:image/png;base64,${logoBase64}';
        img.onload = () => {
          const canvas = document.getElementById('c');
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          const imgData = ctx.getImageData(0, 0, 512, 512);
          const data = imgData.data;

          // Creamos una máscara de silueta pura para potrace
          // Queremos los píxeles verdes/esmeralda del monograma (ignorando el borde squircle blanco/gris exterior)
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i+1];
            const b = data[i+2];
            const a = data[i+3];

            // Píxeles verdes del monograma: g > 70 y g > r * 1.08 y distancia al centro
            // El squircle exterior está cerca de los bordes (< 40 o > 470)
            const x = (i / 4) % 512;
            const y = Math.floor((i / 4) / 512);

            const isInterior = x > 60 && x < 450 && y > 70 && y < 450;
            const isGreenMonogram = (g > 75 && (g - r > 15) && (g - b > -10)) || (g > 110 && r < 140 && b < 190);

            if (isInterior && isGreenMonogram && a > 80) {
              // Negro sólido (para potrace)
              data[i] = 0;
              data[i+1] = 0;
              data[i+2] = 0;
              data[i+3] = 255;
            } else {
              // Blanco puro de fondo
              data[i] = 255;
              data[i+1] = 255;
              data[i+2] = 255;
              data[i+3] = 255;
            }
          }

          ctx.putImageData(imgData, 0, 0);
          window.__processed = canvas.toDataURL('image/png');
        };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction(() => window.__processed);
  const dataUrl = await page.evaluate(() => window.__processed);
  await browser.close();

  const buffer = Buffer.from(dataUrl.split(',')[1], 'base64');
  fs.writeFileSync(path.resolve(__dirname, 'mask.png'), buffer);
  console.log('Máscara generada en scripts/mask.png');

  // Ahora vectorizamos con Potrace con parámetros de alta precisión y curvas suaves
  const params = {
    threshold: 128,
    optCurve: true,
    optTolerance: 0.2,
    turdSize: 10,
    turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
    alphaMax: 1.0
  };

  potrace.trace(buffer, params, (err, svg) => {
    if (err) throw err;
    fs.writeFileSync(path.resolve(__dirname, 'monogram.svg'), svg);
    console.log('SVG vectorizado generado en scripts/monogram.svg');
  });
})();
