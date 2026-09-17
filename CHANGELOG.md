# 📋 CHANGELOG — Makiados Finance

Todas las versiones notables de esta aplicación están documentadas aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

---

## [v62.0] — 2026-09-17 — Rebranding Oficial a AliviaFin + Dominio aliviafin.vercel.app

### 🌿 Identidad de Marca Renovada
- **Evolución a AliviaFin**: Transición oficial de marca a **AliviaFin** («Paz mental para tu dinero»), solucionando la saturación de mercado del nombre anterior y dotando a la plataforma de una identidad fintech ejecutiva, memorable y propia.
- **Nuevo Dominio Oficial**: Despliegue y vinculación en producción a través de [aliviafin.vercel.app](https://aliviafin.vercel.app).
- **Nuevo Isotipo & Favicons Ejecutivos**: Diseño de nuevo imagotipo premium con emblema en "A", ondas de bienestar y flecha de proyección financiera en degradé neón verde esmeralda y violeta eléctrico. Generación de todos los tamaños (`favicon.ico`, `favicon.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`).
- **Actualización Integral de Copys y Modales**: Textos, modales de bienvenida, descargas de reportes PDF (`AliviaFin_Reporte.pdf`), exportaciones CSV (`AliviaFin_gastos.csv`), enlaces de suscripción por WhatsApp y manifiesto PWA migrados coherentemente a AliviaFin.
- **Compatibilidad Retrospectiva**: Persistencia de configuraciones locales y accesos PRO existentes para garantizar cero fricción en cuentas de usuarios activos.

---

## [v61.0] — 2026-09-17 — FinZen PRO + Plan Bola de Nieve + Exportación Excel + Mobile iOS UX

### ✨ Nuevas Funcionalidades
- **Plan Anti-Deudas: Método Bola de Nieve (PRO)**: Módulo interactivo exclusivo que organiza pasivos de menor a mayor saldo y simula el efecto avalancha para liquidar deudas rápidamente, proyectando el mes exacto de libertad financiera y el flujo mensual liberado.
- **Modelo Freemium & FinZen PRO**: Sistema estructurado de funciones gratuitas vs. Pro (inyección automática de cuotas futuras, categorías ilimitadas, metas múltiples de ahorro y reportes avanzados).
- **Exportación Completa a Excel y CSV**: Generación instantánea de archivos `.csv` con soporte nativo UTF-8 BOM para apertura perfecta en Microsoft Excel desde Ajustes e Historial.
- **Límite Estricto de 11 Categorías**: Regulación en cuentas gratuitas en el onboarding y en el gestor de categorías, disparando el modal PRO al intentar añadir una doceava.
- **Popup Dinámico de Novedades de Versión**: Al detectar una nueva versión (`APP_VERSION`), la ventana de novedades se abre automáticamente tras el inicio de sesión informando al usuario de cada mejora.

### 📱 Experiencia Móvil (iPhone iOS)
- **Onboarding Bottom-Sheet Nativo**: Reestructuración del asistente con cabecera fija, scroll interno y botones de navegación (`⬅️ Paso 1` y `Continuar al Paso 3 ➔`) fijados permanentemente al pie (`sticky: bottom`), eliminando congelamientos de scroll en pantallas móviles.
- **Blindaje Visual Contra Caché**: Estilos en línea directos en el modal FinZen PRO para garantizar un renderizado nítido en modo claro y oscuro, inmune a la caché agresiva de Safari/Chrome iOS.
- **Resiliencia de Guardado (`syncPending`)**: Cola de red asíncrona que evita pérdidas de datos ante sincronizaciones concurrentes en el servidor.

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
