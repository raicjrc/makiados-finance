# 📋 CHANGELOG — Makiados Finance

Todas las versiones notables de esta aplicación están documentadas aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

## [v71.5] — 2026-10-06 — Detección Multi-Query de Suscripciones Vencidas, Hardening RLS y Badges Omnipresentes

### 🔴 Fix Definitivo de Detección de Cuenta Vencida (Prueba04)
- **Eliminación del Ordenamiento por `updated_at` Inexistente**: Se corrigió el error `42703 (column user_subscriptions.updated_at does not exist)` que provocaba que la consulta de suscripción fallara silenciosamente en PostgREST y degradara todas las cuentas a Free sin fecha.
- **Estrategia Multi-Query Resiliente**: `verifySubscription()` ahora consulta en paralelo por `user_id` y por `email`, deduplicando y seleccionando con prioridad cualquier registro `pro_monthly` o `expired` registrado en Supabase.
- **Badges de Alta Visibilidad**:
  - Cabecera Superior: Se agregó un badge directo junto al nombre de usuario `[👤 Usuario] [🔴 PRO Vencido]` además del badge junto al logo `aliviafin [🔴 PRO Vencido]`.
  - Barra Lateral: Badge `🔴 Vencido` junto al logo y en la tarjeta de perfil inferior.
  - Banner en Inicio: Alerta en rojo carmesí con fecha exacta de vencimiento y botón directo de renovación por Yape/Plin, protegido contra descartes accidentales de sesión.
- **Blindaje RLS SQL (`supabase-hardening.sql`)**: Se actualizó la política `Usuario puede ver su suscripción` para permitir lectura tanto por `user_id = auth.uid()::text` como por `LOWER(email) = LOWER(auth.jwt() ->> 'email')`, y se agregó `updated_at timestamptz DEFAULT now()`.

## [v71.4] — 2026-10-06 — Localización de html2pdf y Chart.js, Indicadores Visuales de Plan Vencido y Fix Gráficos Hub CEO

### 📄 Reporte PDF & Gráficos 100% Locales y Offline
- **html2pdf y Chart.js Bundle Local (`js/html2pdf.bundle.min.js`, `js/chart.min.js`)**: Eliminadas las dependencias de CDNs externas (`cdnjs.cloudflare.com`, `jsdelivr.net`). El generador de PDF y la librería de gráficos ahora cargan desde el mismo origen (`aliviafin.vercel.app`), previniendo errores de bloqueo de red, CORS o Content-Security-Policy en cualquier navegador o PWA instalada.
- **Gráficos del Hub Fundador CEO**: Resuelto el cálculo de dimensiones en canvas ocultos retardando el render tras cambio de pestaña a `overview` e introduciendo escala mínima (`suggestedMax: 5`) y altura mínima de contenedor para garantizar gráficos visibles y nítidos.

### 🔴 Indicadores Visuales Claros para Cuentas Vencidas (ej. Prueba04)
- **Detección Resiliente de Suscripción**: `verifySubscription()` ahora consulta por `user_id` o `email` enlazando automáticamente registros activados por correo.
- **Badge de Estado**: La cabecera superior y la barra lateral muestran `🔴 PRO Vencido` con acceso directo en 1 tap a la pasarela de renovación.
- **Banner Rojo en Pantalla Principal**: Para cuentas con plan mensual expirado, se muestra un banner de alerta con la fecha exacta de expiración y botón directo de renovación por Yape/Plin.
- **Ajustes y Perfil**: El apartado de Mi Suscripción destaca `🔴 PRO Mensual (Vencido)` y muestra la fecha en que caducó con botón de renovación inmediata.

## [v71.3] — 2026-10-06 — Supabase First-Party Bundle Local, Resiliencia Universal Multi-Navegador y Fix Definitivo de Login

### 🚀 Autenticación & Rendimiento Multi-Dispositivo
- **Supabase JS Embebido Localmente (`js/supabase.min.js`)**: Se eliminó la dependencia de CDNs de terceros (`jsdelivr`/`unpkg`) para el motor de autenticación y base de datos. El script se sirve como asset de primer orden en el mismo origen (`aliviafin.vercel.app`), garantizando carga instantánea (<10ms), inmunidad a bloqueadores de rastreo en Safari/iOS y funcionamiento 100% offline.
- **Resolución Universal de `window.supabase`**: Exportación explícita a `window.supabase` y `globalThis.supabase`, garantizando inicialización síncrona en Safari iOS, macOS, Chrome, Firefox, Edge y Android PWA.
- **Resiliencia en Formulario de Login & Registro**: Manejo exhaustivo de errores en `handleLoginSubmit` y `handleRegisterSubmit` con recuperación automática de estado del botón "Iniciar Sesión" y mensajes claros ante credenciales inválidas.
- **Service Worker v71.3 (Cache `aliviafin-v131`)**: Limpieza automática de cachés antiguas (`aliviafin-v102` y anteriores) y propagación inmediata vía `SKIP_WAITING` y `controllerchange`.

## [v71.0] — 2026-10-06 — Blindaje de Seguridad, Eliminación de Código Legado, Carga Asíncrona PDF (-1.2 MB) y Minimalismo de Producto

### 🛡️ Blindaje de Seguridad & RLS
- **Fuente Única de Verdad para PRO**: `isUserPro()` ahora consulta exclusivamente el estado en `user_subscriptions` validado en Supabase. Se removieron dependencias de `user_metadata` y flags locales en `localStorage`, impidiendo cualquier manipulación desde la consola del navegador.
- **Eliminación de Endpoints Huérfanos**: Se eliminaron completamente `/api/data.js` y `server.py` que contenían rezagos de webhook y endpoints públicos sin autenticación.
- **Cabeceras HTTP de Alta Seguridad en Vercel**: Configuración en `vercel.json` con `Content-Security-Policy` estricta, `X-Frame-Options: DENY`, `Strict-Transport-Security`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` y `Cross-Origin-Opener-Policy`.
- **Script Transaccional de Hardening SQL (`supabase-hardening.sql`)**: 
  - Función `public.is_admin()` basada en UUID del fundador.
  - Políticas RLS estrictas y trigger `trg_guard_user_subscriptions` que fuerzan plan `free` en creación e impiden que usuarios normales modifiquen su plan o fecha de expiración.
  - Triggers anti-spam y validación de longitud para `app_feedback` y `app_reclamaciones`.
  - Revocación de privilegios públicos en RPCs administrativas.
- **Prevención de Inyección XSS**: Centralización y exportación global de `escapeHtml()` y sanitización en modales y flujos de recuperación de cuenta.

### ⚡ Optimización de Rendimiento y Carga (< 100ms)
- **Eliminación de `pdf.js`**: Removido del `<head>` del HTML (~300 KB liberados del parser inicial).
- **Carga Asíncrona Bajo Demanda de `html2pdf`**: La librería de ~900 KB ya no se descarga en el arranque de la app; se descarga en segundo plano únicamente cuando el usuario hace clic en *"Descargar Reporte Mensual (PDF)"*.
- **Versiones Fijadas de Librerías Externas**: `chart.js` fijado a `@4.4.7` y `supabase-js` fijado a `@2.48.1`.
- **Service Worker v71.0 (Cache v128)**: Invalida cachés obsoletas y refuerza el patrón Network-First seguro.

### 🎨 Minimalismo de Producto y Experiencia Ejecutiva
- **Selector de Moneda Depurado**: Ajustado exclusivamente a Soles (PEN 🇵🇪) y Dólares (USD 🇺🇸).
- **Ajustes Simplificados**: Se eliminó el botón duplicado de privacidad (disponible en cabecera) y el toggle de tour automático al iniciar.
- **Unificación de Sueldo**: Se consolidó la edición de sueldo y gastos fijos en un solo flujo intuitivo.
- **Control de Novedades**: Se corrigió la reaparición repetitiva del modal de novedades al cerrar y reabrir sesión.

---

## [v69.0] — 2026-10-04 — Hub de Fundador CEO a Pantalla Completa, Gráficos SaaS Chart.js, Telemetría Viva sin Throttling en Login y Auditoría Total

### 👑 Hub de Fundador CEO a Pantalla Completa (Módulo Nativo)
- **Transformación de Modal a Módulo Completo**: Se sustituye el modal flotante por un módulo a pantalla completa (`tab-founder`) con ancho total, mejor jerarquía visual y estética Apple Fintech.
- **Acceso Directo Multi-Plataforma**: Acceso en 1 clic desde el menú lateral en Desktop ("👑 Hub Fundador CEO"), desde el botón 👑 en el Navbar superior (móvil y desktop) y desde Ajustes.
- **Botón de Retorno Rápido**: Botón *"← Volver a Mis Finanzas"* para alternar instantáneamente entre la vista de fundador y el dashboard financiero personal.

### 📊 4 Gráficos Interactivos con Chart.js
- **📈 Crecimiento Acumulado de Usuarios**: Curva de evolución en los últimos 30 días para evaluar la adquisición de clientes.
- **🟢 Actividad Diaria (DAU)**: Gráfico de barras de usuarios activos por día en los últimos 14 días.
- **🍩 Distribución de Planes**: Donut interactivo con desglose de usuarios Gratuitos vs PRO Mensual vs PRO Vitalicio.
- **⏱️ Retención y Recencia de Conexión**: Gráfico horizontal con segmentación en tiempo real (En línea, Hoy, 1-3d, 4-7d, +7d Churn Alert, Sin registro).

### ⚡ Telemetría de Última Conexión Inmune a Falsos Inactivos
- **Heartbeat Inmediato sin Throttling en Login**: El inicio de sesión (`handleLoginSubmit`, `onLoginSuccess`, `checkLoginStatus`) emite el ping de presencia inmediatamente con `force = true`, sin depender de verificaciones de suscripción ni cargas previas.
- **Throttling Aislado por Usuario**: La clave de throttling en `sessionStorage` se aísla por correo (`aliviafin_last_ping_{email}`), impidiendo que cambiar de cuenta de prueba en el mismo navegador bloquee los pings.
- **Purga de Sesión en Logout**: `handleLogout` limpia `sessionStorage` completamente para garantizar pruebas limpias entre distintas cuentas.
- **Query de Respaldo Resiliente**: Si el filtro temporal de telemetría no retorna datos, el Hub consulta automáticamente los pings recientes de `app_feedback` sin condiciones restrictivas de zona horaria.

### 🗑️ Borrado Definitivo y Gestión de Cuentas
- **Borrado en Cascada Mejorado**: Eliminación de suscripción, registros en `finanzas_state`, marcadores y telemetría al eliminar usuarios de prueba.

---

## [v68.4] — 2026-10-04 — Telemetría Centralizada en Vivo (Heartbeats en Nube), Presencia Multi-Dispositivo y Purgado Integral

### 📡 Telemetría Centralizada en Tiempo Real (Heartbeat en Nube)
- **Canal de Presencia Inmune a Restricciones RLS**: Los usuarios que inician sesión (como `Prueba04` / `raic_rifer@hotmail.com`) ahora emiten pings de actividad autenticados directamente a la nube central (`app_feedback` con `type: 'heartbeat'`).
- **Monitoreo Real de Conexiones en Founder Hub**: El panel extrae la telemetría viva de todos los usuarios en cada sincronización. Los usuarios activos hoy se marcan de inmediato como `🟢 Hoy · En línea ahora ⚡` o `Hace un momento`, eliminando falsas alertas de churn.
- **Detección Automática de Nombres Reales**: El ping de presencia transporta el nombre configurado por el usuario (`Prueba04`) para que el panel del fundador muestre su nombre real y su avatar correcto.
- **Auto-incorporación de Usuarios Activos**: Si un usuario tiene sesión e interactúa pero aún no figuraba en `user_subscriptions`, el panel lo incorpora automáticamente con su estado y fecha de última actividad.
- **Limpieza Transaccional Integral de Usuario**: Al presionar `🗑️` en el panel de fundador, se eliminan en cascada sus suscripciones, feedback y registros de telemetría.
- **Service Worker v114**: Actualización de caché para propagación instantánea a navegadores y PWA iOS/Mac.

---

## [v68.3] — 2026-10-04 — Telemetría Activa en Vivo, Badge Fundador CEO y Blindaje Legal & Privacidad Integral (Ley 29733 / GDPR)

### 🟢 Telemetría de Actividad en Tiempo Real & Distinción Fundador CEO
- **Detección Automática de Sesión Activa**: César y cualquier usuario con sesión abierta ahora se marcan inmediatamente como `🟢 Hoy (En línea ahora ⚡)` en la telemetría, eliminando falsos positivos de inactividad.
- **Badge Exclusivo Fundador**: La fila de César (`cesar.risso.f@gmail.com`) se identifica de forma destacada como `👑 PRO Vitalicio (Fundador)` con aporte `Fundador CEO`, protegida contra eliminaciones accidentales.
- **Heartbeat de Conexión**: Cada inicio de sesión y sincronización registra actividad en la base de datos para mantener métricas vivas y actualizadas de los suscriptores.

### ⚖️ Blindaje Legal & Políticas de Privacidad Integrales (Prevención de Demandas)
- **Declaración Exhaustiva de Datos (Zero-Knowledge)**: Se detalla con total transparencia qué datos se almacenan (presupuestos, categorías, saldos ingresados por el usuario) y se deja constancia legal de que AliviaFin jamás solicita claves de banco, números de tarjeta ni tokens de seguridad.
- **Cláusula de Inteligencia Artificial (IA)**: Declaración explícita de que los registros financieros no se envían a modelos de IA públicos ni se usan para entrenar algoritmos de terceros.
- **Sub-encargados de Infraestructura Declarados**: Supabase Inc. (PostgreSQL / Cifrado AES-256 y TLS 1.3), Vercel Inc. (Cloud Hosting) y CDNs autorizadas.
- **Derecho al Olvido & Supresión Total (Ley N° 29733 & GDPR)**: Implementación de la opción interactiva *"🗑️ Eliminar Mi Cuenta y Datos (Ley 29733)"* en Ajustes (⚙️) para permitir a cualquier cliente ejercer sus Derechos ARCO y purgar su información de forma inmediata.
- **Transparencia en Reseñas & Descargo SBS**: Compromiso de cero testimonios ficticios y advertencia clara de que AliviaFin es un software de productividad financiera, no una entidad regulada por la SBS.
- **Service Worker v113**: Actualización de caché para propagación instantánea.

---

## [v68.2] — 2026-10-04 — Eliminación Permanente de Usuarios, Telemetría de Conexión en Vivo y Blindaje de Cabecera Sticky

### 🛡️ Blindaje Visual de Cabecera Sticky (Zero Overlap)
- **Opacidad Sólida 100%**: Se corrigió el problema de solapamiento de texto al scrollear la tabla de suscriptores aplicando fondo sólido opaco (`#f8fafc` en modo claro y `#131d2e` en modo twilight) con `z-index: 10` y sombra sutil `box-shadow`. Las filas ahora se deslizan suavemente debajo de la cabecera sin traslucir ni sobreponer texto.

### 🗑️ Eliminación Permanente de Usuarios (Base Limpia)
- **Botón de Borrado Seguro**: Se integró un botón de papelera (`🗑️`) en cada fila de usuario con confirmación explícita previa para evitar borrados accidentales.
- **Limpieza Transaccional Completa**: Borra de `user_subscriptions`, `finanzas_state` y `app_feedback`, además de registrar al usuario en la lista negra local para mantener el panel permanentemente limpio y ordenado sin cuentas de prueba residuales.

### ⏱️ Telemetría de Última Conexión & Radar Anti-Churn
- **Columna de Última Conexión**: Monitoreo en tiempo real del estado de actividad de cada usuario (`🟢 Hoy / Hace Xh`, `🟢 Activo (Hace 2d)`, `🟡 Hace 5d`, `🔴 Inactivo +7d / Churn Alert`, `⚪ Solo registro`).
- **Filtro Rápido `⚠️ Inactivos +7d`**: Nuevo chip de filtro en la barra de herramientas que aísla de inmediato a los clientes en riesgo de abandono para acciones proactivas de re-engagement.
- **Funciones RPC Administrativas**: Se agregaron en `supabase-schema.sql` las funciones `get_admin_subscribers()` y `delete_user_by_admin()` para lectura directa de `auth.users.last_sign_in_at` y eliminación en cascada.
- **Service Worker v112**: Actualización de caché para propagación instantánea en producción.

---

## [v68.1] — 2026-10-04 — Corrección de Esquema Supabase en Panel Master, Nombres de Clientes y Deduplicación Inteligente

### 🛠️ Corrección de Esquema Supabase en Cambio de Plan
- **Blindaje de Payload PostgREST**: Se corrigió el error `Could not find the 'plan_type' column of 'user_subscriptions' in the schema cache` limitando la actualización a las columnas activas y validadas de Supabase (`user_id`, `email`, `status`).
- **Sincronización Transaccional Completa**: Al cambiar a un usuario a `📅 Mensual (S/ 4.90)` o `👑 Vitalicio (S/ 19.90)`, se actualiza tanto por `user_id` como por `email`, desbloqueando el acceso PRO en todos los dispositivos de manera instantánea.

### 👤 Visualización de Nombres de Usuario y Editor de Apodos (✏️)
- **Formateo Inteligente de Nombres**: Los correos como `raic_rifer@hotmail.com` ahora se presentan automáticamente como nombres limpios y legibles: **Raic Rifer**, con avatar de iniciales ejecutivo.
- **Editor de Apodos / Nombres Personalizados (✏️)**: Botón interactivo al lado del nombre que permite al administrador (César) asignar el nombre real del cliente (ej. *"Karla Márquez"*, *"Gaby"*), guardándose localmente para una gestión impecable de clientes.
- **Búsqueda Expandida**: El buscador en tiempo real ahora filtra tanto por correo, por ID, como por el nombre limpio o apodo personalizado.

### 🧹 Deduplicación Automática de Cuentas de Prueba
- **Consolidación de Registros**: Si un usuario tiene múltiples registros de autenticación previos con el mismo correo, el dashboard los consolida en una sola fila limpia, preservando el estado más reciente y de mayor jerarquía PRO.
- **Métricas SaaS Precisas**: El conteo de cuentas y cálculo de ingresos/MRR ahora reflejan suscriptores únicos reales sin duplicidades.
- **Service Worker v111**: Actualización de caché para propagación inmediata.

---

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
