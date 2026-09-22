# 🧭 Reglas del Proyecto — Finanzas César & Gaby

Este documento establece las reglas y principios obligatorios que el asistente de IA (Antigravity) debe seguir en todo momento al interactuar con esta base de código.

---

## 1. 🛡️ Integridad y Protección de Datos (Regla de Oro)

1. **Nunca destruir datos sin respaldo:** Antes de ejecutar o proponer cambios en la estructura de `database.json`, esquemas de Supabase o scripts de migración, verificar que exista un respaldo previo (`database_user_immutable_backup.json` o un backup versionado).
2. **Operaciones atómicas e idempotentes:** Toda mutación o sincronización de datos debe ser segura contra fallos de red a medio camino. Si una operación falla, el estado local debe mantenerse consistente.
3. **Aritmética monetaria precisa:** En JavaScript nunca comparar números de coma flotante directamente ni acumular decimales sin redondear (`Math.round((num + Number.EPSILON) * 100) / 100` o cálculo en centavos enteros) para evitar desfaces de céntimos en saldos de cuentas.

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

---

## 4. 🎨 Estándar Estético Fintech Apple

1. Consultar y respetar siempre las directivas de diseño de `.agents/skills/apple_fintech_design` y `.agents/skills/mobile_desktop_ux_design`.
2. Utilizar tipografía del sistema (`-apple-system`, `SF Pro Display`, `SF Pro Text`), glassmorphism con `backdrop-filter: blur(24px) saturate(180%)`, y paleta de colores armónica y ejecutiva (evitar colores primarios chillones).
