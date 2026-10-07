// Service Worker v73.1 - NETWORK FIRST para sincronización en tiempo real
// Este SW NUNCA sirve datos de caché - siempre va a la red primero
const CACHE_NAME = 'aliviafin-v140';

// Solo cachear assets estáticos (fonts, chart.js, supabase, html2pdf)
const STATIC_ASSETS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  '/js/chart.min.js',
  '/js/supabase.min.js',
  '/js/html2pdf.bundle.min.js'
];

// URLs que NUNCA deben ser cacheadas - siempre van a la red
const NEVER_CACHE = [
  'supabase.co',
  '/auth/',
  '/rest/'
];

self.addEventListener('install', event => {
  // Activar inmediatamente sin esperar que se cierren otras pestañas
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => {
      // Tomar control de todas las pestañas abiertas inmediatamente
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // NUNCA cachear estas URLs - siempre ir a la red
  const shouldNeverCache = NEVER_CACHE.some(pattern => url.includes(pattern));
  if (shouldNeverCache) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }).catch(() => {
        return new Response(JSON.stringify({ error: 'offline' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }
  
  // Para assets estáticos de CDN: cache first (fonts, chart.js)
  const isStaticCDN = STATIC_ASSETS.some(pattern => url.startsWith(pattern));
  if (isStaticCDN) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }
  
  // Solo se cachean respuestas GET exitosas del mismo origen
  if (event.request.method !== 'GET') return;

  // Para todo lo demás: NETWORK FIRST (intentar la red, guardar en caché, si falla usar caché)
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.ok && (response.type === 'basic' || response.type === 'cors')) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone)).catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Recibir mensajes del cliente para forzar actualización
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(names => names.forEach(name => caches.delete(name)));
  }
});
