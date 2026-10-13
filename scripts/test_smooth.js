const fs = require('fs');
const path = require('path');
const potrace = require('potrace');

const buffer = fs.readFileSync(path.resolve(__dirname, 'mask.png'));

// Probamos con tolerancia de curva óptima para suavizar al máximo cualquier escalonado de píxeles
const params = {
  threshold: 128,
  optCurve: true,
  optTolerance: 0.5,
  turdSize: 15,
  turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
  alphaMax: 1.334
};

potrace.trace(buffer, params, (err, svg) => {
  if (err) throw err;
  fs.writeFileSync(path.resolve(__dirname, 'smooth_monogram.svg'), svg);
  console.log('SVG ultra-suave generado en scripts/smooth_monogram.svg');
});
