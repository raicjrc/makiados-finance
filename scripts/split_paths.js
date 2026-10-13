const fs = require('fs');
const path = require('path');

const svgContent = fs.readFileSync(path.resolve(__dirname, 'monogram.svg'), 'utf8');
const match = svgContent.match(/d="([^"]+)"/);
if (!match) throw new Error('No path found');

const fullD = match[1];
// Separamos por 'M '
const rawParts = fullD.split(/(?=M\s)/g).map(s => s.trim()).filter(Boolean);
console.log(`Encontradas ${rawParts.length} partes independientes.`);

rawParts.forEach((p, idx) => {
  console.log(`Parte ${idx + 1}: longitud ${p.length}, inicia: ${p.slice(0, 30)}...`);
});
