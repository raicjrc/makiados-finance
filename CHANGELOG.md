# 📋 CHANGELOG — Makiados Finance

Todas las versiones notables de esta aplicación están documentadas aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

## [v68.0] — 2026-10-04 — Panel Master CEO & Fundador: Suscripciones en Tiempo Real, Métricas SaaS e Ingresos

### 👑 Panel Master CEO de Fundador (Exclusivo para César)
- **Acceso Blindado**: Visible y accesible única y exclusivamente cuando la sesión activa corresponde a `cesar.risso.f@gmail.com`. Totalmente invisible para el resto de usuarios tanto en la interfaz como en el DOM.
- **Accesos Rápidos**: Botón dorado `👑 Panel Master CEO` en el pie de la barra lateral (Desktop) y tarjeta destacada en el menú de Ajustes (⚙️).
- **Métricas Clave de Negocio (SaaS KPIs en Vivo)**:
  - **MRR (Monthly Recurring Revenue)**: Ingresos recurrentes mensuales proyectados calculados automáticamente por las suscripciones activas a **S/ 4.90 / mes**.
  - **Ingresos Totales Acumulados**: Suma de ventas de planes vitalicios (**S/ 19.90**) y cuotas mensuales cobradas.
  - **Base de Usuarios Registrados**: Conteo total de cuentas en Supabase y desglose entre cuentas PRO vs Gratuitas.
  - **Tasa de Conversión (Free ➔ PRO)**: Porcentaje de efectividad de monetización en vivo.

### 👥 Directorio de Suscriptores & Activación en 1-Tap
- **Tabla Ejecutiva de Clientes**: Búsqueda por correo o ID, visualización del plan actual (`👑 PRO Vitalicio`, `📅 PRO Mensual`, `🆓 Free`) y total aportado.
- **Gestión Rápida de Pagos WhatsApp/Yape/Plin**: Botones de acción directa para pasar a un usuario a Vitalicio o Mensual con confirmación segura y actualización instantánea en Supabase.
- **Caja de Alta Manual**: Permite buscar o ingresar cualquier correo de un cliente nuevo para asignarle su membresía en segundos.

### 💬 Buzón Unificado de Feedback & Soporte
- Lectura en vivo de reportes de errores, sugerencias de funciones y consultas de usuarios enviadas desde la app (`app_feedback`) con botón de respuesta directa por correo electrónico.
- **Service Worker v110**: Actualización de caché para propagación inmediata en Safari iOS y PWA.

---

## [v67.5] — 2026-10-04 — Dashboard Widescreen Desktop, Blindaje Completo Modo Privacidad, Actualización de Precios PRO y Sección Legal & Privacidad

### 🖥️ Dashboard Widescreen de 2 Columnas para Desktop (≥ 1024px)
- **Aprovechamiento Óptimo de Pantalla**: Eliminación de márgenes vacíos en Mac/PC mediante un grid ejecutivo de 2 columnas (`1.15fr 1fr` con gap de 22px).
- **Distribución Ejecutiva Equilibrada**:
  - *Columna Izquierda*: Tarjeta Ejecutiva de Saldo en Banco, Grid de Métricas (Ingreso, Gasto Real, Por Pagar), Acciones Rápidas (Registrar Gasto/Ingreso) y Radar de Próximos Vencimientos.
  - *Columna Derecha*: Feed de Movimientos Recientes, Hub de Herramientas Rápidas (Conciliar Saldo, Simulador de Cuotas, Soporte) y Banners destacados.
- **100% Inmune en Celulares**: En pantallas móviles (< 1024px) la disposición se mantiene como una sola columna vertical sin ninguna alteración ni salto de layout.

### 🙈 Blindaje de Modo Privacidad para Saldo en Banco
- **Enmascaramiento Total**: La tarjeta ejecutiva de Saldo en Banco (`SALDO EN BANCO`) y su contexto de partida ahora se ocultan inmediatamente con la máscara de puntos (`S/ •••••`) al activar el botón de privacidad (ojito 👁️ / 🙈).
- **Protección de Gastos Pendientes**: La métrica de gastos "Por Pagar" también queda cubierta bajo el modo privado.
- **Interacción Peek Táctil**: Mantener presionado cualquier saldo enmascarado revela el valor temporalmente y se vuelve a ocultar al soltar.
- **Formateo Elegante de Saldos Negativos**: Visualización limpia con prefijo `-S/ 92.60` en lugar de concatenaciones extrañas.

### 💎 Actualización de Precios AliviaFin PRO
- **Tarifa Mensual Accesible**: Reducción a **S/ 4.90 / mes** con cancelación libre sin compromiso.
- **Acceso Vitalicio Preferencial**: Reducción a pago único de **S/ 19.90** para acceso de por vida a todas las funciones avanzadas actuales y futuras.
- **Enlace de Activación Directo**: Mensaje de WhatsApp actualizado con las nuevas tarifas oficiales.

### ⚖️ Términos de Servicio & Políticas de Privacidad Integradas
- **Nuevo Modal Frosted Glass**: Pestañas interactivas para "Términos del Servicio" y "Políticas de Privacidad".
- **Accesos Rápidos**: Botón "Legal & Privacidad" en el sidebar de escritorio y enlaces directos dentro del menú de Ajustes.
- **Declaración Zero-Knowledge**: Garantía explícita de que la app jamás solicita claves bancarias ni comercializa datos personales.
- **Service Worker v109**: Purgado automático de caché para sincronización sin interrupciones.

---

## [v67.4] — 2026-10-04 — Rediseño Apple Fintech Sereno: Tarjeta Ejecutiva de Balance, Desglose Matemático y Micro-interacciones Táctiles

### 💎 Tarjeta Ejecutiva de Balance (Apple Card Serene)
- **Retiro de la Tarjeta Hero Roja ("Disponible Hoy")**: Eliminación de la tarjeta con división artificial por día (`S/ 9.33 / día`) y badge alarmista (`🔴 Al Límite`) que generaba estrés innecesario.
- **Nueva Tarjeta de Saldo en Banco Minimalista**: Centrada en la métrica vital de tu dinero en cuenta con badge dinámico `🟢 EN VIVO (HOY)` en el mes actual y `🔒 CIERRE HISTÓRICO` en meses pasados.
- **Banner de Retorno Rápido**: Al explorar meses pasados, un banner discreto permite regresar al mes actual en 1 toque.
- **Métrica "⏳ Por Pagar"**: Nueva tarjeta en el grid que indica exactamente cuántos gastos faltan abonar este mes con acceso directo a movimientos pendientes.

### 🔍 Desglose Matemático y Claridad de Saldos (Modal Explicativo)
- **Transparencia Total de Flujo de Caja**: Modal que desglosa cómo se forma el saldo: Saldo de partida del mes anterior + Ingresos cobrados − Gastos pagados = Saldo real disponible en cuenta hoy.

### ✨ Micro-interacciones & Física Apple Spring
- **Rolling Numbers (Contador Numérico Fluido)**: Animación elástica de 280ms al cambiar de mes o cargar saldos.
- **Active Tactile Scale**: Botones y tarjetas interactivas reaccionan con una micro-compresión suave al 97% (`transform: scale(0.97)`) al tocarlos o hacer clic.
- **Cross-Fade & Micro-Slide**: Transición sedosa de pestañas en 200ms sin cortes bruscos.
- **Liquid Sync Shimmer**: Destello translúcido sutil sobre la tarjeta ejecutiva cada vez que se completa una sincronización en tiempo real con Supabase.
- **Service Worker v108**: Purgado automático de caché para Safari iOS y PWA.

---

## [v67.3] — 2026-10-01 — Transición Automática de Mes Calendario y Blindaje de Meses Cerrados

### 📅 Avance Automático de Calendario (Auto-Rollover)
- **Detección Automática de Cambio de Mes**: Al llegar el día 1 de cada nuevo mes, la app detecta si el mes guardado en caché o localStorage pertenece al pasado y avanza automáticamente al mes del calendario real (`getEffectiveCurrentMonth`).
- **Sesión Aislada por Dispositivo**: La exploración manual de meses pasados se aísla en `sessionStorage` para que un usuario revisando el historial no fuerce el cambio de mes en el celular de su pareja.

### 🛡️ Claridad Visual en la Tarjeta Hero (Paz Mental / Disponible Hoy)
- **Mes Actual**: Tarjeta con pulso activo y título `DISPONIBLE HOY` calculando el presupuesto diario real del mes en curso.
- **Meses Históricos/Cerrados**: La tarjeta ya no muestra "DISPONIBLE HOY" ni pulso engañoso en meses pasados. Muestra `MES CERRADO`, el balance final de cierre y un botón directo para regresar al mes actual en un toque.
- **Service Worker v107**: Actualización de caché para purgar assets en Safari iOS.

---

## [v67.0] — 2026-09-22 — Radar de Próximos Vencimientos, Conciliación Bancaria en 1 Tap y Blindaje Zen

### 📅 Radar de Próximos Vencimientos (Apple Fintech Widget)
- **Detección Automática de Cuentas por Vencer**: Widget en la pantalla de Inicio que analiza las fechas de vencimiento (`recurringDueDates`) y alerta con anticipación qué pagos vencen en los siguientes 5 días (servicios, alquiler, gym, préstamos, seguros).
- **Etiquetas de Urgencia Semafórica**: Badges táctiles (`⚡ Vence Hoy`, `Vence Mañana`, `En X días`, `⚠️ Venció hace X días`).
- **Botón de Pago Inmediato**: Un toque en `✓ Pagar` marca el gasto como pagado al instante con feedback háptico y audit trail.
- **Estado Zen Despejado**: Si no hay pagos en los próximos 5 días, se muestra un banner calmado y compacto para evitar sobrecarga cognitiva.

### ⚖️ Conciliación Bancaria (Arqueo en 1 Tap)
- **Comparación en Tiempo Real**: Modal para contrastar el saldo registrado en la app con el saldo real disponible en la aplicación del banco (BCP, Interbank, etc.).
- **Detección y Ajuste Automático de Descuadre**: Cálculo instantáneo de diferencias con botón `⚡ Cuadrar Saldo Automáticamente` o `🔍 Registrar Gasto Faltante` con el monto exacto precargado.

### 🛡️ Organización y Rendimiento PWA
- **Limpieza de Backups Sueltos**: Migración segura de más de 15 archivos `.backup_*` a `_archive/legacy_backups/` y creación de snapshot inmutable `_archive/pre_enhancements_v67/`.
- **Actualización de Service Worker**: Service Worker v67.0 (`aliviafin-v103`) con invalidación inmediata de caché para iOS Safari y escritorio.
- **Modal de Novedades v67.0**: Presentación automática de las nuevas funcionalidades para todos los usuarios al iniciar sesión.

---

## [v64.0] — 2026-09-18 — Rediseño Zen Ejecutivo (Fase 1: Descongestión, Dinero Libre Hoy & Registro Express)

### 🧘 Rediseño de Arquitectura y Paz Mental
- **Tarjeta Hero «Paz Mental · Dinero Libre Hoy» (Safe to Spend)**: Nueva tarjeta insignia en el Inicio que calcula matemáticamente cuánto dinero real puede gastar el usuario por día (`S/ XX.XX / día`) y en el mes sin tocar gastos fijos, cuotas ni ahorro. Cuenta con indicador de holgura semafórico (Verde, Amarillo, Rojo) y barra de progreso.
- **Descongestión Radical del Inicio**: Se eliminó la saturación visual retirando la tabla masiva de transacciones del Inicio y reemplazándola por un feed minimalista de los últimos 3 a 4 movimientos con acceso directo `Ver todos los movimientos (N) ➔`.
- **Nueva Pestaña Dedicada «💳 Movimientos»**: Aloja el registro completo de transacciones con vista Lista/Calendario, buscador en vivo, chips de estado, filtros avanzados por categoría y montos, y resumen de ingresos.
- **Navegación Ergonómica de 5 Pestañas**: En móviles y PWA la barra inferior ahora se compone de: **🏠 Inicio**, **💳 Movimientos**, **📊 Plan**, **🎯 Metas** y **💡 Asesor** (con auditoría y exportación a Excel integradas).

### ⚡ Registro Rápido Express (2 Toques)
- **Modal Bottom-Sheet de Registro Inmediato**: Teclado numérico táctil ergonómico de alta precisión, selección de método de pago (`Yape/Plin`, `Efectivo`, `Tarjeta`) y 6 categorías de un toque para registrar gastos cotidianos en menos de 3 segundos desde la calle con una sola mano.

### 💻 Adaptabilidad Ejecutiva Celular vs. Escritorio (Mac/PC)
- **Sidebar Ejecutivo Desktop (>= 1024px)**: En computadoras se despliega automáticamente una barra lateral fija a la izquierda con marca, usuario, accesos de navegación y ajustes, ocultando la barra inferior y distribuyendo los módulos en columnas balanceadas sin scroll vertical infinito.
- **PWA & Mobile Ready**: Respeto total de áreas seguras (`safe-area-inset`) para iPhone (Dynamic Island / Notch) y Android.

---

## [v63.2] — 2026-09-18 — Persistencia de Perfil, Control Total del Tour y Novedades v63

### 🛡️ Corrección de Identidad y Experiencia
- **Restauración y Edición de Nombre de Usuario**: Solucionado el reemplazo automático de nombre ("makiados" por "cesar risso") ocasionado por los metadatos de Google OAuth. Se restablece "makiados" por defecto para el administrador y se incorpora un nuevo campo en **⚙️ Ajustes** para personalizar y guardar el nombre/apodo en cualquier momento.
- **Supresión Definitiva de Ventana de Configuración Inicial (Wizard)**: Blindado el cargador remoto con verificación insensible a mayúsculas (`isAdminCesar()`) y flag `_serverStateLoaded`, garantizando que a los usuarios con datos nunca se les abra el asistente de onboarding.
- **Control Total y Opt-Out del Tour Guiado**: Ahora el tour recuerda la opción "No volver a mostrar" sin importar en qué paso se cierre (con la "✕" o al final). Se añadió además un interruptor en **⚙️ Ajustes** para activar o desactivar el tour al inicio con un solo clic.
- **Actualización Integral del Modal de Novedades**: Incorporadas las tarjetas oficiales que presentan el Inicio de Sesión con Google en 1 Clic, la Recuperación Segura de Contraseña y la Vinculación Inteligente de Cuentas.

---

## [v63.1] — 2026-09-18 — Optimización Ejecutiva de Acceso Social (Google Full-Width)

### 🎨 Refinamiento de Interfaz & Experiencia de Usuario
- **Botón Google Full-Width Ejecutivo**: Rediseño del botón de inicio social a ancho completo con estilo limpio, moderno y centrado («Continuar con Google»), optimizando la tasa de conversión y reduciendo fricción visual tanto en móviles como en computadoras.
- **Simplificación de Autenticación**: Retiro del proveedor Microsoft tras verificar que la gran mayoría de usuarios consumer operan con Google o correo directo, evitando bloqueos por requisitos corporativos/Azure en cuentas personales Hotmail/Outlook.

---

## [v63.0] — 2026-09-17 — Recuperación de Contraseña + Inicio de Sesión Social (Google y Microsoft)

### 🔐 Seguridad y Autenticación Mejorada
- **Recuperación de Contraseña (Password Reset)**: Enlace `¿Olvidaste tu contraseña?` directo en la pantalla de inicio de sesión. Modal de solicitud vía correo electrónico con token seguro de recuperación y modal para establecer la nueva contraseña con validación inmediata.
- **Inicio de Sesión Social (OAuth)**: Botones oficiales para iniciar sesión con **Google** y **Microsoft**, adaptados para computadoras, tablets y celulares con soporte touch nativo.
- **Vinculación Inteligente de Cuentas (Identity Linking)**: Los usuarios que ya están registrados pueden ingresar con su cuenta de Google o Microsoft sin perder sus gastos, saldos o estado PRO.
- **Feedback Amigable**: Mensajes informativos y claros en caso de errores de red o credenciales incorrectas.

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
