# 🧭 Reglas del Proyecto — Finanzas César & Gaby

Este documento establece las reglas y principios obligatorios que el asistente de IA (Antigravity) debe seguir en todo momento al interactuar con esta base de código.

---

## 1. 🛡️ Integridad y Protección de Datos (Regla de Oro)

1. **Nunca destruir datos sin respaldo:** Antes de ejecutar o proponer cambios en la estructura de `database.json`, esquemas de Supabase o scripts de migración, verificar que exista un respaldo previo (`database_user_immutable_backup.json` o un backup versionado).
2. **Operaciones atómicas e idempotentes:** Toda mutación o sincronización de datos debe ser segura contra fallos de red a medio camino. Si una operación falla, el estado local debe mantenerse consistente.
3. **Aritmética monetaria precisa:** En JavaScript nunca comparar números de coma flotante directamente ni acumular decimales sin redondear (`Math.round((num + Number.EPSILON) * 100) / 100` o cálculo en centavos enteros) para evitar desfaces de céntimos en saldos de cuentas.
4. **Sincronización Multi-Dispositivo Cloud-First (Prohibición Absoluta de Sobrescritura Local):**
   - `loadLocalState()` es **100% de solo lectura de caché**. Está terminantemente prohibido ejecutar `applyDataMigrations()` o modificar `appState._lastSaved` dentro de `loadLocalState()` o antes de que `window._serverStateLoaded === true`.
   - Toda mutación real del usuario (`saveState`, `applyReconciliationAdjustment`, `Cuentas Claras`, etc.) debe llamar obligatoriamente a `markLocalMutationDirty()`, que registra `finanzas_unsynced_dirty_<uid>` en `localStorage` y se limpia en `clearLocalMutationDirty()` únicamente cuando Supabase confirma el `upsert`.
   - En `applyRemoteState(remoteData)`, si un dispositivo (iPhone, Android, Mac, Windows) se abre o despierta **sin** mutaciones locales pendientes (`!hasUnsyncedLocalMutations()`), **la nube (`remoteData`) gana el 100% de las veces** sin importar `remoteTs <= localTs`. Si `hasUnsyncedLocalMutations() === true`, se ejecuta `mergeOfflineWithRemoteState(appState, remoteData)` para fusionar movimientos por `id` sin perder cambios de ningún dispositivo.
5. **Bóveda Instantánea Multi-Capa ante Todo Evento (4 Capas):**
   - **Capa 1 (`localStorage` Primario):** `finanzas_v50_<uid>` en cada acción (`< 1ms`).
   - **Capa 2 (Bóveda Local Inmutable):** `finanzas_v50_<uid>_vault` se actualiza automáticamente en `saveLocalState()` solo cuando `countTotalTransactions(appState) > 0` (jamás puede ser pisada por un estado vacío).
   - **Capa 3 (Doble Respaldo Automático en Supabase):** Cada guardado válido en la nube actualiza `backup_<id8>_YYYY-MM-DD` y `backup_<id8>_latest_verified`.
   - **Capa 4 (Respaldo Maestro del Fundador):** Endpoint `/api/founder-backup` protegido por JWT + `database_user_immutable_backup.json`.

---

## 2. 📱 Experiencia PWA & Safari iOS First

La aplicación se utiliza principalmente en **iPhone (César y Gaby)** en modo PWA (pantalla completa instalada en Home Screen) y en **Mac**:

1. **Safe Area Insets:** Todo elemento anclado al borde superior (`top: 0`), inferior (`bottom: 0`) o modal flotante debe respetar `env(safe-area-inset-top)` y `env(safe-area-inset-bottom)`.
2. **Prevención de Zoom en iOS:** Todos los `<input>`, `<select>` y `<textarea>` deben tener `font-size: 16px` o superior en móvil para evitar que iOS Safari haga zoom automático desagradable al tocar un campo.
3. **Touch Targets mínimos:** Botones e interactivos deben tener un área táctil mínima de 44x44px.
4. **Bypass de Caché en Safari:** Safari en iOS es agresivo cacheando respuestas HTTP. Toda solicitud de sincronización debe incluir parámetros anti-caché únicos (`timestamp` + `random`) y cabeceras `Cache-Control: no-cache, no-store`.

---

## 3. ⚡ Arquitectura Vanilla y Cero Dependencias Innecesarias

1. **Mantener el Stack Puro:** La aplicación está construida sobre HTML5 semántico, CSS Vanilla modular y JavaScript ES6+ nativo. **No agregar frameworks pesados (React, Vue, Tailwind, etc.)** a menos que el usuario lo solicite explícitamente.
2. **Rendimiento Instantáneo:** El inicio debe ser inmediato (< 100ms). Evitar librerías externas de gran tamaño. Si se requiere una utilidad (ej. formateo de moneda, debounce, cálculo de fechas), preferir funciones nativas de JavaScript.
3. **Compatibilidad Offline:** Los cambios en `sw.js` deben probarse con extrema precaución para no bloquear el acceso de los usuarios a la app si se quedan sin red.
4. **Despliegue Directo a Producción (Vercel):** Cada vez que se haga `git push origin main`, ejecutar siempre `npx --yes vercel --prod --yes` para publicar inmediatamente en `https://aliviafin.vercel.app`.

---

## 4. 🎨 Estándar Estético Fintech Apple

1. Consultar y respetar siempre las directivas de diseño de `.agents/skills/apple_fintech_design` y `.agents/skills/mobile_desktop_ux_design`.
2. Utilizar tipografía del sistema (`-apple-system`, `SF Pro Display`, `SF Pro Text`), glassmorphism con `backdrop-filter: blur(24px) saturate(180%)`, y paleta de colores armónica y ejecutiva (evitar colores primarios chillones).

---

## 5. ⚡ Eficiencia Extrema de Tokens (Protección de Cuota Claude)

Para evitar el agotamiento prematuro de tokens y límites de tasa en modelos avanzados como **Claude Sonnet 5.5** y **Claude Opus 5.5**:

1. **Lectura Quirúrgica Estricta:** NUNCA leer archivos grandes (`js/app.js`, `index.html`, etc.) de forma completa. Usar siempre `grep_search` para ubicar las líneas de interés y limitar `view_file` a rangos pequeños (máximo 80 líneas).
2. **Ediciones Mínimas:** Usar `replace_file_content` con el bloque exacto a cambiar, sin repetir bloques de código intactos.
3. **Salidas de Terminal Limpias:** Limitar la salida de comandos de consola (`head`, `tail`, `git log -n 5`) para no saturar el historial con texto basura.
4. **Respuestas Concisas:** Explicaciones directas y al grano sin verborrea innecesaria.

---

## 6. 🎬 Estándar de Videos para TikTok e Instagram Reels (Zona Segura Universal)

Para que **un único archivo de video (`1080 × 1920 px`, `9:16`)** funcione sin recortes tanto en **TikTok** como en **Instagram Reels** y en la vista previa **`4:5` (`1080 × 1350 px`) del Feed de Instagram**:

1. **Lienzo Completo (`9:16`):** Mantener siempre resolución `1080 × 1920 px` con el fondo animado cubriendo el 100% de la pantalla.
2. **Zona Segura Universal (`y = 290px` a `y = 1620px`):** Todos los titulares, etiquetas (`.kinetic-overlay`), stickers flotantes, mockups de dispositivos (`#phone-wrapper`, `#macbook-wrapper`) y botones CTA deben ubicarse estrictamente entre **`y = 290px`** (margen superior ≥ `285px`) e **`y = 1620px`** (margen inferior ≥ `300px`), y horizontalmente entre `x = 60px` y `x = 1020px`.
3. **Cero Superposición con UI de Redes:** Esto garantiza que ni el recorte `4:5` del Feed de Instagram ni la botonera/descripción de TikTok e Instagram Reels tapen o corten jamás el encabezado o la barra inferior del teléfono.


