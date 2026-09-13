# 📋 CHANGELOG — Makiados Finance

Todas las versiones notables de esta aplicación están documentadas aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

---

## [v50.0] — 2026-09-12 — Multi-Usuario + GitHub + Supabase Auth

### ✨ Nuevas Funcionalidades
- **Multi-usuario real**: Cualquier persona puede registrarse con su correo electrónico y tener sus propios datos financieros completamente separados
- **Registro en la app**: Pantalla de registro con nombre, correo y contraseña (sin necesidad de confirmar correo)
- **Supabase Auth**: Autenticación real con tokens JWT — reemplaza el login hardcodeado anterior
- **Datos por usuario**: Cada usuario tiene su propio espacio en Supabase identificado por su `user.id`
- **Versión visible en app**: `v50.0` mostrado en pantalla de login, header y configuración
- **GitHub**: Repositorio público inicializado con historial de versiones

### 🔄 Cambios
- Login: de usuario+contraseña hardcodeados → email+contraseña con Supabase Auth
- Storage key: ahora incluye el `user.id` para aislar datos locales por usuario
- Realtime sync: canal de WebSocket ahora es exclusivo por usuario
- Backups automáticos: incluyen el `userId` para no mezclar datos

### 🗄️ Base de Datos (Supabase)
- Tabla `finanzas_state`: cada usuario tiene su propio row con ID `state_{userId}`
- Row Level Security (RLS): cada usuario solo puede leer/escribir sus propios datos
- Política actualizada: `user_id = auth.uid()`

---

## [v49.0] — 2026-08-02 — Premium Redesign UX/UI

### ✨ Nuevas Funcionalidades
- Botón "🗑️ Limpiar" para filtros activos
- "✕" en buscador para limpiar texto
- `clearAllFilters()` — limpia todo en un clic
- Toast "✨ Filtros limpiados"

### 🎨 Diseño
- Sistema CSS completamente reescrito con variables expandidas
- Header con gradiente profundo `#1a1040→#2d1f6e` + orbe radial decorativo
- Stat cards con barra de color superior + hover lift en desktop
- Progress bars con gradiente (verde/ámbar/rojo)
- Status badges 28px mínimo (44px touch target)
- Bottom nav `blur(20px)` glassmorphism
- FAB 52px con hover scale + glow morado
- Login screen con gradiente animado profundo

---

## [v48.0] — 2026-08-02 — Sincronización Real-Time Definitiva

### ✨ Nuevas Funcionalidades
- Motor de Sync v48 con `fetchNoCache()` y anti-caché
- POST en paralelo (`Promise.allSettled`)
- Mutex `isSyncing` para evitar requests simultáneos
- `_lastSaved` timestamp — gana siempre el más reciente
- `visibilitychange` + `focus` — sync al volver a la app
- Sistema Toast no-bloqueante (elimina todos los `alert()`)
- Indicador de sync con animación `syncPulse` 2.5s

### 🔄 Cambios
- Polling reducido: 1500ms → 800ms
- Service Worker: Network-First para TODA petición no-CDN
- `skipWaiting()` + `clients.claim()` — actualización instantánea

---

## [v46-v47] — 2026-08-01 — Arquitectura Cloud

- webhook.site como almacenamiento cloud
- Vercel serverless function como proxy seguro
- Eliminada dependencia de túneles Pinggy/Serveo temporales
- Diagnóstico y corrección de desfase S/ 5.00 entre dispositivos

---

## [v1–v45] — 2026-07 — Desarrollo Base

- **v1–v10**: App base desde Excel, diseño inicial, categorías
- **v11–v20**: Tabla dinámica, filtros, badges de categoría
- **v21–v30**: Metas de ahorro, Chart.js, plan financiero 50/30/20
- **v31–v40**: PWA/Service Worker, instalación iPhone, login privado
- **v41–v45**: Primeros intentos de sincronización multi-dispositivo
