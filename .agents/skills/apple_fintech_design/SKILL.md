---
name: apple_fintech_design
description: Apple Human Interface & Minimalist Fintech Design Standards for executive, clutter-free financial applications inspired by Apple Card, Apple Wallet, and macOS Sonoma.
---

# Apple Human Interface & Minimalist Fintech Design

Guidelines and design tokens to create financial applications with the refinement, calmness, and tactile precision of Apple products (Apple Card, Apple Wallet, and macOS Sonoma).

---

## 1. The Three Fundamental Principles

1. **Clarity (Claridad Absoluta):**
   - Text is legible at every size, icons are precise and purposeful, and adornments are subtle.
   - Every element on screen must answer a user question ("¿Cuánto puedo gastar hoy?", "¿Cuánto me sobra?", "¿Qué vence esta semana?"). If it doesn't inform or empower, remove it.

2. **Deference (Deferencia al Contenido):**
   - The interface recedes; the user's financial reality and peace of mind take center stage.
   - Minimize heavy card borders and aggressive saturated backgrounds. Use whitespace, soft typography, and subtle tonal separation to group data.

3. **Depth (Profundidad y Materiales Vivos):**
   - Visual layers and realistic translucency convey hierarchy and vitality.
   - Modals and sheets feel like physical glass layers floating over the canvas, never like abrupt popups.

---

## 2. Apple Materials & Translucency (CSS Tokens)

### Vibrant Glassmorphism (Apple Card Grade)
```css
/* Card de Cristal Claro (Modo Día) */
background: rgba(255, 255, 255, 0.78);
backdrop-filter: blur(24px) saturate(180%);
-webkit-backdrop-filter: blur(24px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.65);
box-shadow: 
  0 1px 2px rgba(0, 0, 0, 0.04),
  0 8px 24px rgba(15, 23, 42, 0.05);

/* Card de Cristal Oscuro (Modo Noche Suave / Twilight) */
background: rgba(15, 23, 42, 0.75);
backdrop-filter: blur(24px) saturate(180%);
-webkit-backdrop-filter: blur(24px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.08);
box-shadow: 
  0 1px 2px rgba(0, 0, 0, 0.4),
  0 12px 32px rgba(0, 0, 0, 0.35);
```

---

## 3. Typography & Financial Number Hierarchy

- **Font Family:** `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Plus Jakarta Sans", sans-serif`.
- **Large Metrics (Hero Numbers):**
  - Font weight: `800` or `900`.
  - Letter spacing: `-0.03em` (tighter tracking for large currency figures).
  - Currency glyph (`S/` or `$`) should be sized slightly smaller (`0.75em`) and have `opacity: 0.85` to emphasize the numeric magnitude.
- **Micro-Labels & Badges:**
  - Font size: `10px–11px`, weight `700` or `800`, letter spacing `+0.04em` (tracked out), uppercase for clean scannability.
- **Numbers Alignment:**
  - Always use `font-variant-numeric: tabular-nums;` for transaction amounts so decimals align vertically with surgical precision.

---

## 4. Tactile Physics & Micro-Interactions (Apple Spring Curves)

Buttons and cards must feel alive and respond to touch like physical objects:

```css
/* Curva elástica Apple Spring */
--apple-spring: cubic-bezier(0.32, 0.72, 0, 1);
--apple-spring-bounce: cubic-bezier(0.175, 0.885, 0.32, 1.15);

/* Micro-interacción en Botones */
.btn, .action-pill {
  transition: transform 0.18s var(--apple-spring), 
              box-shadow 0.18s var(--apple-spring), 
              background-color 0.18s ease;
}

/* Efecto háptico visual al presionar (Active State) */
.btn:active, .action-pill:active {
  transform: scale(0.965);
}

/* Hover suave en escritorio */
.interactive-card {
  transition: transform 0.24s var(--apple-spring), box-shadow 0.24s var(--apple-spring);
}
.interactive-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
}
```

---

## 5. Organic Palette (Apple Card Spectrum)

Never use raw `#ff0000` or `#00ff00`. Use calibrated, organic tones that evoke physical pigments:

- **Liquid Esmeralda (Ingresos / Safe / Ahorro):**
  - Primary: `#10b981` (Emerald 500)
  - Glow / Soft tint: `rgba(16, 185, 129, 0.12)`
- **Warm Crimson / Carmesí Sobrio (Gastos Reales / Egresos):**
  - Primary: `#ef4444` (Rose/Red 500)
  - Glow / Soft tint: `rgba(239, 68, 68, 0.12)`
- **Apple Indigo / Royal (Identidad de Marca):**
  - Primary: `#4f46e5` / `#6366f1`
- **Neutral Slate (Lienzo y Tipografía):**
  - Canvas Day: `#f8fafc` / `#ffffff`
  - Canvas Night: `#0b0f19` / `#111827`
  - Text Primary: `#0f172a` (Day) / `#f8fafc` (Night)
  - Text Secondary: `#64748b` (Day) / `#94a3b8` (Night)

---

## 6. Layout Adaptability & Cleanliness

- **Zero Clutter Rule:** If a secondary metric can be grouped or viewed via Progressive Disclosure, do not place it on the main card. Keep primary cards clean with maximum 3 key data points.
- **Border Radii:**
  - Outer cards: `20px` to `24px` (Apple Squircle look: `border-radius: 22px;`).
  - Inner badges & pills: `10px` to `12px` or full pills (`border-radius: 9999px;`).
- **Modal Sheets:**
  - On mobile: Slide up smoothly as bottom sheets with drag handles (`border-radius: 24px 24px 0 0`).
  - On desktop: Centered dialog with frosted backdrop (`backdrop-filter: blur(16px)`).

---

## 7. Official AliviaFin Brand Identity (Monograma Fluido)

- **Isotipo:** Monograma Fluido "A" continuo con gradiente jade/esmeralda (`#1b5e4c` a `#38a17e`).
- **Logotipo:** "aliviafin" estrictamente en minúsculas, tipografía geométrica pulcra antracita (`#334155`).
- **Insignia PRO:** Píldora dorada/champagne limpia con el texto `PRO` (sin estrellas ni emojis ornamentales).
- **Equilibrio de Acciones:** Los botones primarios de acción (`Registrar Gasto` y `Registrar Ingreso`) deben mantener simetría matemática exacta al 50% (`flex: 1 1 0px`).
- **Lienzo Sereno (Whisper-Quiet):** Fondo reposado `#fbfbfd` sin halos agresivos ni gradientes saturados que distraigan del contenido financiero del usuario.

