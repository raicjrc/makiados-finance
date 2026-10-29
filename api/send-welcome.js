// Serverless Function de Vercel para envío de Correo Transaccional de Bienvenida
const fs = require('fs');
const path = require('path');
const https = require('https');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { email, name } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: 'El campo "email" es obligatorio.' });
    }

    const userName = name || 'amigo(a)';
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY no está configurada en las variables de entorno.');
      return res.status(500).json({ error: 'Servicio de correo no configurado (falta RESEND_API_KEY).' });
    }
    const fromAddress = process.env.RESEND_FROM || 'AliviaFin <onboarding@resend.dev>';

    // Cargar plantilla HTML
    const templatePath = path.resolve(__dirname, '../templates/email_welcome_activation.html');
    let htmlContent = '';
    if (fs.existsSync(templatePath)) {
      htmlContent = fs.readFileSync(templatePath, 'utf8');
      htmlContent = htmlContent.replace(/\{\{nombre_usuario\}\}/g, userName);
      htmlContent = htmlContent.replace(/\{\{email\}\}/g, email);
    } else {
      htmlContent = `<h2>¡Bienvenido a AliviaFin, ${userName}!</h2><p>Tu cuenta ha sido creada exitosamente.</p>`;
    }

    const payload = JSON.stringify({
      from: fromAddress,
      to: [email],
      subject: '🌿 ¡Bienvenido a AliviaFin! Tus primeros pasos hacia la tranquilidad financiera',
      html: htmlContent
    });

    const resendResponse = await new Promise((resolve, reject) => {
      const apiReq = https.request({
        hostname: 'api.resend.com',
        port: 443,
        path: '/emails',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, apiRes => {
        let body = '';
        apiRes.on('data', chunk => body += chunk);
        apiRes.on('end', () => {
          try {
            resolve({ statusCode: apiRes.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ statusCode: apiRes.statusCode, data: body });
          }
        });
      });

      apiReq.on('error', reject);
      apiReq.write(payload);
      apiReq.end();
    });

    if (resendResponse.statusCode >= 200 && resendResponse.statusCode < 300) {
      return res.status(200).json({ success: true, id: resendResponse.data.id });
    } else {
      console.warn('Resend API Warning/Error:', resendResponse.data);
      return res.status(resendResponse.statusCode).json({
        success: false,
        error: resendResponse.data.message || 'Error al despachar correo en Resend',
        details: resendResponse.data
      });
    }
  } catch (err) {
    console.error('Server error in send-welcome:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
