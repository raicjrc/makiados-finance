/**
 * AliviaFin — Módulo de Envío de Correo Transaccional de Bienvenida
 * 
 * Utiliza Resend.com (3,000 correos gratis/mes, sin tarjeta) o cualquier API REST de email.
 * 
 * Uso:
 *   node scripts/send_welcome_email.js <email_usuario> [nombre_usuario]
 * 
 * Requisitos:
 *   Variable de entorno RESEND_API_KEY o pasarla por argumento.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const emailTo = process.argv[2];
const userName = process.argv[3] || 'amigo(a)';

if (!emailTo) {
  console.log('Uso: node scripts/send_welcome_email.js <email_usuario> [nombre_usuario]');
  process.exit(0);
}

const templatePath = path.resolve(__dirname, '../templates/email_welcome_activation.html');
if (!fs.existsSync(templatePath)) {
  console.error('Error: No se encontró la plantilla en', templatePath);
  process.exit(1);
}

let htmlContent = fs.readFileSync(templatePath, 'utf8');
htmlContent = htmlContent.replace(/\{\{nombre_usuario\}\}/g, userName);
htmlContent = htmlContent.replace(/\{\{email\}\}/g, emailTo);

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.log('⚠️ RESEND_API_KEY no configurada. Mostrando vista previa del correo generado:');
  console.log(`Destinatario: ${emailTo}`);
  console.log(`Nombre: ${userName}`);
  console.log(`Longitud HTML: ${htmlContent.length} bytes`);
  console.log('Para enviar en vivo, configura RESEND_API_KEY en tu entorno o en Vercel.');
  process.exit(0);
}

const fromAddress = process.env.RESEND_FROM || 'AliviaFin <onboarding@resend.dev>';
const payload = JSON.stringify({
  from: fromAddress,
  to: [emailTo],
  subject: '🌿 ¡Bienvenido a AliviaFin! Tus primeros pasos hacia la tranquilidad financiera',
  html: htmlContent
});

const req = https.request({
  hostname: 'api.resend.com',
  port: 443,
  path: '/emails',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('✅ Correo de bienvenida enviado exitosamente a', emailTo);
    } else {
      console.error(`❌ Error al enviar correo (${res.statusCode}):`, body);
    }
  });
});

req.on('error', err => {
  console.error('Error de conexión al enviar correo:', err);
});

req.write(payload);
req.end();
