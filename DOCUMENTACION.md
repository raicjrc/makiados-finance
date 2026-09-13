# 📊 Finanzas César & Gaby — Documentación Completa

> **Versión actual:** v50.0 (Multi-Usuario + Supabase Auth + GitHub)  
> **Última actualización:** 12 de septiembre de 2026  
> **Stack:** HTML/CSS/JS · Vercel · Supabase Auth + Realtime · GitHub · PWA

---

## 🗂️ Índice
1. [Arquitectura de la App](#arquitectura)
2. [Estructura de Archivos](#archivos)
3. [Historial de Mejoras](#historial)
4. [Estado del Banco de Datos Actual](#base-de-datos)
5. [¿Por qué Supabase?](#supabase)
6. [Plan de Migración a Supabase](#migracion)
7. [Roadmap Futuro](#roadmap)

---

## 🏗️ Arquitectura de la App {#arquitectura}

```
┌───────────────────────────────────────────────────────────────┐
│                      USUARIOS FINALES                          │
│   📱 iPhone César    📱 iPhone Gaby    💻 Mac César           │
└────────────┬─────────────────┬─────────────────┬─────────────┘
             │                 │                 │
             ▼                 ▼                 ▼
┌───────────────────────────────────────────────────────────────┐
│                   PWA (Progressive Web App)                    │
│                      index.html (SPA)                          │
│                                                                │
│  ┌───────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │  UI / CSS v49 │  │  JS Engine ~2000 │  │ Service Worker│  │
│  │  Premium      │  │  líneas          │  │ v48 Net-First │  │
│  └───────────────┘  └──────────────────┘  └───────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Motor de Sincronización v48                 │ │
│  │  • fetchNoCache() — bypass de caché forzado              │ │
│  │  • Polling 800ms con timestamp+random anti-caché         │ │
│  │  • POST en paralelo a todos los backends                 │ │
│  │  • visibilitychange — sync al volver al foco             │ │
│  │  • localStorage como capa de caché offline               │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────┬────────────────────────────────────────┘
                       │  HTTPS
                       ▼
┌───────────────────────────────────────────────────────────────┐
│                     VERCEL (Hosting)                           │
│               finanzas-cesar-gaby.vercel.app                   │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │          /api/data.js  (Serverless Function)             │ │
│  │  GET  → fetch webhook.site/latest → retorna JSON         │ │
│  │  POST → push a webhook.site + retorna success            │ │
│  │  Headers: Cache-Control: no-store (en todos)             │ │
│  └──────────────────────────────┬───────────────────────────┘ │
└───────────────────────────────── │ ────────────────────────────┘
                                   │
                                   ▼
┌───────────────────────────────────────────────────────────────┐
│                webhook.site (Backend ACTUAL)                   │
│                                                                │
│  ⚠️  LIMITACIONES ACTUALES:                                   │
│  • Solo guarda el ÚLTIMO request (no es una BD real)          │
│  • Sin real-time push (el cliente hace polling)               │
│  • Sin respaldo/backup garantizado                            │
│  • Sin control de versiones de datos                          │
│  • Sin autenticación real                                     │
└───────────────────────────────────────────────────────────────┘
```

### Flujo de Datos (Estado actual)

```
Usuario edita un gasto
        │
        ▼
saveState() — guarda en localStorage INMEDIATAMENTE (UX instantánea)
        │
        ├──► syncStateToServer() en background
        │           ├──► POST /api/data  (Vercel proxy)
        │           │         └──► POST webhook.site ──► ✅ guardado
        │           └──► POST webhook.site (paralelo) ──► ✅ backup
        │
        ▼
Otros dispositivos: polling cada 800ms
        ├──► GET /api/data (Vercel) → GET webhook.site/latest → JSON
        └──► Si hash cambió → renderAll() con nuevos datos
```

---

## 📁 Estructura de Archivos {#archivos}

```
Finanzas/
├── index.html                        # App completa (SPA) — 3,180 líneas, 451KB
│   ├── <style>                       # Sistema de diseño v49 Premium (~680 líneas CSS)
│   ├── HTML Tabs:
│   │   ├── #tab-inicio               # Resumen, stats, transacciones dinámicas
│   │   ├── #tab-plan                 # Plan 50/30/20, gráfico histórico
│   │   ├── #tab-ahorro               # Metas de ahorro, progreso
│   │   └── #tab-audit                # Log de auditoría de cambios
│   └── JavaScript:
│       ├── INITIAL_DB_FALLBACK       # Datos semilla del Excel original
│       ├── appState                  # Estado global único de la app
│       ├── Motor de Sync v48         # loadStateFromServer, syncStateToServer
│       ├── renderAll()               # Renderiza todos los componentes
│       ├── renderTransactions()      # Tabla con filtros + botón limpiar
│       ├── clearAllFilters()         # NUEVO v49: limpia todos los filtros
│       ├── renderPlan()              # Gráfico 50/30/20
│       ├── renderSavings()           # Metas de ahorro
│       └── renderHistory()           # Histórico y proyecciones
│
├── sw.js                             # Service Worker v48 (Network-First)
│   ├── NEVER_CACHE: ['/api/', 'index.html', 'webhook.site']
│   ├── skipWaiting() + clients.claim()  # Actualización inmediata
│   └── Solo cachea: Google Fonts, Chart.js CDN
│
├── api/data.js                       # Serverless function Vercel
│   ├── GET  → proxy con no-cache a webhook.site/latest
│   └── POST → proxy a webhook.site con headers no-store
│
├── vercel.json                       # Config Vercel: routes, headers no-cache
├── manifest.json                     # PWA: instalar como app nativa en iPhone/Mac
├── supabase-schema.sql               # Schema SQL listo para Supabase ✅
├── database.json                     # Backup local (241KB)
├── database_user_immutable_backup.json  # Copia inmutable del Excel original
├── server.py                         # Servidor local de desarrollo (puerto 8090)
└── DOCUMENTACION.md                  # Este archivo 📄
```

### Estructura del appState (JSON)

```json
{
  "salary": 8400,
  "currentMonth": "Julio 2026",
  "_lastSaved": 1754123456789,
  "transactions": {
    "Julio 2026": [
      {
        "id": "Julio_2026_comida_casa",
        "name": "Comida Casa",
        "amount": 2000,
        "category": "Comida Casa",
        "status": "Pagado",
        "dueDate": "30",
        "isInstallment": false
      }
    ]
  },
  "extraIncomes": {
    "Julio 2026": [{ "id": "...", "label": "Freelance", "amount": 400 }]
  },
  "savingsGoals": [
    { "id": "goal_viaje", "name": "Viaje", "target": 5000, "current": 1200 }
  ],
  "recurringDueDates": { "Internet": "28", "Carro": "24" },
  "auditLog": [
    { "timestamp": "02/08/2026 10:15", "action": "edit", "details": "..." }
  ]
}
```

---

## 📋 Historial de Mejoras {#historial}

### v49 — Rediseño Premium UX/UI *(2 agosto 2026)*
**Inspirado en: Monarch Money, Copilot Money, Revolut**

**Diseño:**
- ✅ Sistema CSS completamente reescrito con variables expandidas
- ✅ Header con gradiente profundo `#1a1040→#2d1f6e` + orbe radial decorativo
- ✅ Stat cards con barra de color superior según tipo + hover lift en desktop
- ✅ Progress bars con gradiente (`verde/ámbar/rojo` según nivel)
- ✅ Chips con hover state y borde más refinado
- ✅ Tabla: headers en caps, hover `#fafbff`, última fila sin borde
- ✅ Status badges 28px mínimo (44px touch target), animación `:active`
- ✅ Selector de mes translúcido con backdrop-blur
- ✅ Modales border-radius 20px, sombra 60px profunda
- ✅ Bottom nav `blur(20px)` glassmorphism
- ✅ FAB 52px con hover scale + glow morado
- ✅ Login screen con gradiente animado profundo
- ✅ Animación tab `fadeInUp` más expresiva

**Funcionalidad:**
- ✅ **Botón "🗑️ Limpiar"** — aparece solo cuando hay filtros activos
- ✅ **"✕" en el buscador** — limpia solo el texto de búsqueda
- ✅ `clearAllFilters()` — limpia categoría + estado + texto + sort en un clic
- ✅ Toast "✨ Filtros limpiados" al usar el botón

---

### v48 — Sincronización Real-Time Definitiva *(2 agosto 2026)*

**Motor de Sync:**
- ✅ Eliminado `lastUserMutationTime` — causa raíz del bloqueo
- ✅ `fetchNoCache()` con headers anti-caché + URL con timestamp y random
- ✅ Polling reducido 1500ms → **800ms**
- ✅ POST en **paralelo** (`Promise.allSettled`)
- ✅ `isSyncing` mutex — evita requests simultáneos
- ✅ `_lastSaved` timestamp — gana siempre el más reciente
- ✅ `visibilitychange` + `focus` — sync al volver a la app
- ✅ "⚠️ Reconectando..." solo tras 20 segundos reales sin éxito

**Service Worker v48:**
- ✅ Network-First para TODA petición no-CDN
- ✅ `skipWaiting()` + `clients.claim()` — actualización instantánea
- ✅ Limpieza automática de cachés viejos al iniciar

**Otros:**
- ✅ `api/data.js` v48 con headers anti-caché en respuesta
- ✅ `vercel.json` con routing correcto y headers no-store
- ✅ Sistema Toast no-bloqueante (elimina todos los `alert()`)
- ✅ Indicador de sync con animación `syncPulse` 2.5s

---

### v46-v47 — Arquitectura Cloud *(1-2 agosto 2026)*
- ✅ webhook.site como almacenamiento cloud
- ✅ Vercel serverless function como proxy seguro
- ✅ Eliminada dependencia de túneles Pinggy/Serveo temporales
- ✅ Diagnóstico y corrección de desfase S/ 5.00 entre dispositivos

---

### v50.0 — Multi-Usuario + Supabase Auth + GitHub *(12 septiembre 2026)*

**Autenticación:**
- ✅ **Registro con email/contraseña** — cualquier persona puede crear su cuenta desde la app
- ✅ **Sin confirmación de correo** (deshabilitado en Supabase Auth settings)
- ✅ **Supabase Auth real** — reemplaza el login hardcodeado `Chuckys`/`Chumbita`
- ✅ **Pantalla de login** actualizada: tabs "Iniciar Sesión" / "Crear Cuenta"
- ✅ **Badge de usuario** en header mostrando nombre de quien está logueado

**Multi-usuario:**
- ✅ **Datos completamente separados** por usuario — cada uno tiene su propio row en Supabase (`state_{userId}`)
- ✅ **Aislamiento total** — César ve sus datos, el hermano ve los suyos
- ✅ **RLS (Row Level Security)** en Supabase — imposible acceder a datos de otro usuario
- ✅ **Storage key dinámica** — el localStorage también es aislado por `userId`
- ✅ **Canal Realtime** exclusivo por usuario

**Versioning:**
- ✅ **`APP_VERSION = 'v50.0'`** constante en el código
- ✅ Versión visible en: login screen, header navbar, modal de configuración
- ✅ **`CHANGELOG.md`** — historial formal de versiones desde v1

**GitHub:**
- ✅ Repositorio Git inicializado localmente
- ✅ `.gitignore` configurado (excluye secrets, backups locales)
- ✅ Primer commit con tag `v49` (estado base)
- ✅ `CHANGELOG.md` incluido en el repo

---

### v1–v45 — Desarrollo Base *(julio 2026)*
- v1–v10: App base desde Excel, diseño inicial, categorías
- v11–v20: Tabla dinámica, filtros, badges de categoría
- v21–v30: Metas de ahorro, Chart.js, plan financiero 50/30/20
- v31–v40: PWA/Service Worker, instalación iPhone, login privado
- v41–v45: Primeros intentos de sincronización multi-dispositivo

---

## 🗄️ Estado Actual de la Base de Datos {#base-de-datos}

| Aspecto | Estado Actual | Calificación |
|---|---|---|
| **Persistencia** | webhook.site guarda solo el último POST | ⚠️ Frágil |
| **Backup** | Solo database.json local en tu Mac | ⚠️ Manual |
| **Real-time** | Polling 800ms (no es push real) | 🟡 Funcional |
| **Seguridad** | URL pública de webhook.site sin auth | 🔴 Riesgo |
| **Historial** | Sin versiones ni historial de cambios | 🔴 Ausente |
| **Recuperación** | Sin rollback automático | 🔴 Ausente |

---

## 🚀 ¿Por qué Supabase? {#supabase}

> **Resumen:** Supabase es una base de datos PostgreSQL real, gratuita, con sincronización en tiempo real via WebSockets, respaldo automático y panel de administración. Es exactamente lo que esta app necesita.

### Comparativa: webhook.site vs Supabase

| Característica | webhook.site (actual) | Supabase (propuesto) |
|---|---|---|
| **Tipo** | HTTP logger (no es BD) | PostgreSQL real |
| **Persistencia** | Solo el último request | Permanente, con historial |
| **Real-time push** | ❌ No (solo polling 800ms) | ✅ WebSockets nativos (<200ms) |
| **Backup automático** | ❌ No | ✅ Point-in-time recovery |
| **Seguridad** | ❌ URL pública sin auth | ✅ RLS + JWT tokens |
| **Multi-usuario** | ❌ No | ✅ Auth nativo (email, Google) |
| **Panel de datos** | ❌ No | ✅ Dashboard web completo |
| **Velocidad sync** | ~800ms (polling) | **< 200ms** (WebSocket push) |
| **Costo** | Gratis (sin garantías) | **Gratis** (Free Tier estable) |
| **Confiabilidad** | Sin SLA | ✅ 99.9% uptime SLA |

### ¿Por qué no otras opciones?

| Opción | Por qué descartada |
|---|---|
| **Firebase** | Requiere crear cuenta Google, más complejo, de pago para ciertas features |
| **JSONBin.io** | Límites de requests, sin real-time |
| **PlanetScale** | Solo SQL, sin real-time nativo |
| **MongoDB Atlas** | Más complejo de configurar para este caso |
| **Supabase** | ✅ La más simple, gratis, real-time nativo, ya tienes el schema listo |

---

## 🗺️ Plan de Migración a Supabase {#migracion}

### Paso 1: Crear el proyecto (5 min)

1. Ve a **[app.supabase.com](https://app.supabase.com)** → "New Project"
2. Nombre: `finanzas-cesar-gaby`
3. Región: `South America (São Paulo)` — la más cercana a Perú
4. Plan: **Free** (500MB, suficiente para años de uso)

### Paso 2: Crear la tabla (2 min)

En Supabase → **SQL Editor** → pegar y ejecutar:

```sql
-- Tabla principal
CREATE TABLE IF NOT EXISTS finanzas_state (
  id text PRIMARY KEY DEFAULT 'main_state',
  data jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

-- Seguridad
ALTER TABLE finanzas_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acceso familia" ON finanzas_state FOR ALL USING (true);

-- Activar Realtime (sincronización WebSocket)
ALTER PUBLICATION supabase_realtime ADD TABLE finanzas_state;
```

### Paso 3: Obtener credenciales (1 min)

En Supabase → **Settings → API**:
- `Project URL`: `https://xxxxxxxxxxxx.supabase.co`
- `anon (public) key`: `eyJhbGci...` (pública, segura)

### Paso 4: Actualizar la app (lo implemento yo)

```js
// ANTES: webhook.site (polling 800ms)
const SYNC_GET_ENDPOINTS = ['/api/data', 'https://webhook.site/...'];
setInterval(() => loadStateFromServer(), 800);

// DESPUÉS: Supabase Realtime (push < 200ms, automático)
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Escucha cambios en tiempo real
supabase
  .channel('finanzas-sync')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'finanzas_state' },
    (payload) => {
      // Se llama automáticamente cuando cualquier dispositivo guarda
      applyRemoteState(payload.new.data);
    }
  )
  .subscribe();

// Guardar datos
async function syncStateToServer() {
  await supabase
    .from('finanzas_state')
    .upsert({ id: 'main_state', data: appState });
}
```

### Paso 5: Migrar datos actuales (2 min)

Supabase → **Table Editor → finanzas_state → Insert row**:
- `id`: `main_state`
- `data`: *(pegar contenido de database.json)*

### ⏱️ Tiempo total estimado: ~30 minutos

---

## 🎯 Roadmap / Backlog {#roadmap}

### ✅ Completado en v50
- [x] **Multi-usuario con Supabase Auth** (registro email/password, sin confirmación de correo)
- [x] **Datos separados por usuario** en Supabase con RLS
- [x] **GitHub repo** con historial de versiones
- [x] **Versión visible** en UI (login, header, settings)
- [x] **CHANGELOG.md** con historial semántico

### Corto plazo (próxima sesión)
- [ ] Notificaciones push — "📅 Vence mañana: Internet (S/ 120)"
- [ ] Resumen mensual exportable en PDF
- [ ] Gráfico sparkline de tendencia en stat cards

### Medio plazo
- [ ] Importar desde fotos — OCR de tickets de compra
- [ ] Categorías personalizables desde la UI (sin tocar código)
- [ ] Panel de administrador para ver usuarios registrados

### Largo plazo
- [ ] App nativa con React Native o Expo
- [ ] Plan de pago con Stripe para equipos/empresas
- [ ] Invitación por link (sin necesidad de crear cuenta)

---

## 📀 Decisiones de Arquitectura Clave

| Decisión | Razón |
|---|---|
| **SPA en HTML puro (sin React/Vue)** | Cero dependencias, funciona offline, instalable como PWA |
| **Vercel para hosting** | Deploy gratuito, HTTPS automático, serverless functions |
| **Supabase Auth** | Auth real con JWT, multi-usuario, sin backend propio |
| **Row por usuario en Supabase** | Simple, sin SQL complejo, aislamiento total de datos |
| **RLS en Supabase** | Seguridad a nivel de BD, imposible acceder a datos ajenos |
| **localStorage como caché** | La app funciona sin internet, datos siempre disponibles |
| **Service Worker Network-First** | Datos siempre frescos, nunca APIs cacheadas |
| **appState como único source of truth** | Un objeto JSON controla toda la UI |
| **`_lastSaved` timestamp** | Cuando dos dispositivos tienen datos, gana el más reciente |
| **Hash para detectar cambios** | Evita re-renders cuando los datos son iguales |
| **Toast en lugar de `alert()`** | Los `alert()` bloquean el hilo JS — los toasts no |
