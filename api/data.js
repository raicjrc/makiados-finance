export default async function handler(req, res) {
  // Headers CORS y anti-caché - CRÍTICOS para sincronización
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, Pragma, X-Timestamp');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Vary', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const CLOUD_GET_URL = 'https://webhook.site/token/f3c30873-e641-4d92-b39a-87ef1b26503e/request/latest/raw';
  const CLOUD_POST_URL = 'https://webhook.site/f3c30873-e641-4d92-b39a-87ef1b26503e';

  if (req.method === 'GET') {
    try {
      // Añadir timestamp y random para bypass de cualquier caché intermedio
      const fetchUrl = `${CLOUD_GET_URL}?_ts=${Date.now()}&_r=${Math.random().toString(36).slice(2)}`;
      const response = await fetch(fetchUrl, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-store, no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const text = await response.text();
        if (text && text.trim().startsWith('{')) {
          const json = JSON.parse(text);
          return res.status(200).json(json);
        }
      }
    } catch(e) {
      console.error('Error fetching from cloud:', e);
    }
    
    // Si falla, retornar estado vacío (el cliente usará su localStorage)
    return res.status(200).json({ status: 'waiting_for_first_sync', transactions: null });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      const strBody = typeof body === 'string' ? body : JSON.stringify(body);
      
      // Subir a cloud backend
      const cloudResponse = await fetch(CLOUD_POST_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-store'
        },
        body: strBody
      });

      if (cloudResponse.ok) {
        return res.status(200).json({ 
          status: 'success', 
          message: 'Datos sincronizados en nube',
          timestamp: Date.now()
        });
      } else {
        return res.status(503).json({ 
          status: 'cloud_error', 
          message: `Cloud returned ${cloudResponse.status}` 
        });
      }
    } catch(e) {
      console.error('Error posting to cloud:', e);
      return res.status(500).json({ status: 'error', message: String(e) });
    }
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}
