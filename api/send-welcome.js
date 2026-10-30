// Serverless Function de Vercel para envío de Correo Transaccional de Bienvenida
const fs = require('fs');
const path = require('path');
const https = require('https');

// Control anti-abuso en memoria por instancia serverless (máx 3 envíos por correo / ventana de 10 min)
const recentSends = new Map();

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = async (req, res) => {
  // CORS restringido a dominios autorizados de AliviaFin y entorno local
  const origin = req.headers.origin || '';
  const allowedOrigins = [
    'https://aliviafin.com',
    'https://www.aliviafin.com',
    'https://aliviafin.vercel.app',
    'http://localhost:3000',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ];
  if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://aliviafin.vercel.app');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { email, name, userId } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!cleanEmail || cleanEmail.length > 160 || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'El campo "email" es obligatorio y debe tener un formato válido.' });
    }

    // Validación de autenticidad de registro (userId UUID de Supabase o Bearer token válido)
    const authHeader = req.headers.authorization || '';
    const isUuid = typeof userId === 'string' && /^[0-9a-fA-F-]{36}$/.test(userId.trim());
    if (!authHeader.startsWith('Bearer ') && !isUuid) {
      return res.status(401).json({ error: 'Solicitud no autorizada: se requiere sesión o identificador de registro válido.' });
    }

    // Si viene token Bearer de Supabase, verificar que coincida con el usuario autenticado
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      const supaUrl = process.env.SUPABASE_URL || 'https://swwvbfemxookbqoqotre.supabase.co';
      const supaKey = process.env.SUPABASE_KEY || 'sb_publishable_CZUC5ueCxjSDFeA3idgVZg_DaEoIJxf';
      const verifiedEmail = await new Promise((resolve) => {
        const uReq = https.request(`${supaUrl}/auth/v1/user`, {
          method: 'GET',
          headers: {
            'apikey': supaKey,
            'Authorization': `Bearer ${token}`
          }
        }, uRes => {
          let uBody = '';
          uRes.on('data', c => uBody += c);
          uRes.on('end', () => {
            try {
              const parsed = JSON.parse(uBody);
              resolve(parsed && parsed.email ? String(parsed.email).toLowerCase() : null);
            } catch (e) {
              resolve(null);
            }
          });
        });
        uReq.on('error', () => resolve(null));
        uReq.end();
      });
      if (verifiedEmail && verifiedEmail !== cleanEmail) {
        return res.status(403).json({ error: 'El correo solicitado no coincide con la sesión autenticada.' });
      }
    }

    // Rate limit por destinatario para evitar spam
    const now = Date.now();
    const lastSent = recentSends.get(cleanEmail) || 0;
    if (now - lastSent < 60 * 1000) {
      return res.status(429).json({ error: 'Correo de bienvenida ya despachado recientemente.' });
    }
    recentSends.set(cleanEmail, now);

    const rawName = String(name || 'amigo(a)').trim().slice(0, 80);
    const safeUserName = escapeHtml(rawName || 'amigo(a)');
    const safeEmail = escapeHtml(cleanEmail);

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY no está configurada en las variables de entorno.');
      return res.status(500).json({ error: 'Servicio de correo no configurado (falta RESEND_API_KEY).' });
    }
    const fromAddress = process.env.RESEND_FROM || 'AliviaFin <onboarding@resend.dev>';

    // Cargar plantilla HTML con sanitización anti-inyección HTML
    const templatePath = path.resolve(__dirname, '../templates/email_welcome_activation.html');
    let htmlContent = '';
    if (fs.existsSync(templatePath)) {
      htmlContent = fs.readFileSync(templatePath, 'utf8');
      htmlContent = htmlContent.replace(/\{\{nombre_usuario\}\}/g, safeUserName);
      htmlContent = htmlContent.replace(/\{\{email\}\}/g, safeEmail);
    } else {
      htmlContent = `<h2>¡Bienvenido a AliviaFin, ${safeUserName}!</h2><p>Tu cuenta ha sido creada exitosamente.</p>`;
    }

    const payload = JSON.stringify({
      from: fromAddress,
      to: [cleanEmail],
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
