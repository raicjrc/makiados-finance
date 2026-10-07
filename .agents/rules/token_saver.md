# ⚡ Optimización Extrema de Tokens y Cuota (Token Saver)

Este protocolo es de cumplimiento obligatorio e incondicional para Antigravity en cada turno de conversación para preservar la cuota del usuario en modelos de alta gama (Claude Sonnet 5.5, Claude Opus 5.5).

---

## 1. 🎯 Inspección Quirúrgica de Archivos (Zero Full-File Dumps)

1. **PROHIBIDO leer archivos grandes completos:** Archivos como `js/app.js` (más de 9,000 líneas), `index.html` o `css/styles.css` **NUNCA** deben leerse con `view_file` completo ni en bloques de más de 120 líneas.
2. **Localización previa con `grep_search`:** Antes de leer cualquier código, usar siempre `grep_search` con patrones específicos para ubicar la línea exacta.
3. **Lecturas milimétricas:** Al usar `view_file`, especificar siempre un rango estricto (`StartLine` y `EndLine`) de máximo 50 a 100 líneas alrededor del objetivo.

---

## 2. ✂️ Edición y Herramientas Eficientes

1. **Bloques de reemplazo mínimos:** Al usar `replace_file_content`, incluir únicamente las líneas estrictamente necesarias para el cambio (contexto de 2-3 líneas arriba y abajo), nunca funciones enteras si no han cambiado.
2. **Comandos de consola silenciosos:** Nunca ejecutar comandos que generen cientos de líneas en stdout (como logs completos o listados gigantes). Usar pipes (`head -n 20`, `grep`, `git log -n 5`, etc.).
3. **Respuestas ejecutivas y directas:** En el chat, no repetir código no modificado ni escribir explicaciones innecesarias de relleno. Ser directo, preciso y mostrar solo la solución y el estado de la tarea.
