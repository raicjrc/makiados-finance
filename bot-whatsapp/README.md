# Bot de WhatsApp para Alertas de Vencimientos — Makiados Finance 🐱💳

Bot automatizado que consulta tu base de datos de Supabase en tiempo real, genera una infografía ejecutiva en alta definición con cuenta regresiva de 10 días, e interactúa con WhatsApp Web para enviar alertas y registrar acuses de recibo.

---

## 🚀 Pasos de Puesta en Marcha

### 1. Vincular WhatsApp Web (1 sola vez)
Abre una terminal y ejecuta:
```bash
cd /Users/cesarrisso/Desktop/Finanzas/bot-whatsapp
npm run login
```
Se abrirá una ventana de Chrome con el código QR de WhatsApp Web.
1. Abre WhatsApp en tu iPhone.
2. Ve a **Ajustes > Dispositivos vinculados > Vincular un dispositivo**.
3. Escanea el código QR de la pantalla.
4. Una vez que carguen tus chats, la sesión quedará guardada permanentemente en `user-data/`.

---

### 2. Probar un Envío Inmediato
Para enviar una prueba ahora mismo al grupo `Pruebas - Pagos.`:
```bash
npm run send-now
```
Verás cómo consulta Supabase, genera la imagen `preview-report.png` y la envía al grupo con el texto detallado.

---

### 3. Dejarlo Corriendo en Segundo Plano

#### Opción A: Proceso en Terminal
```bash
npm start
```

#### Opción B: Servicio de macOS (24/7 incluso al reiniciar)
Para que macOS lo mantenga vivo siempre:
```bash
cp com.makiados.whatsappbot.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.makiados.whatsappbot.plist
```
Para detenerlo cuando quieras:
```bash
launchctl unload ~/Library/LaunchAgents/com.makiados.whatsappbot.plist
```

---

## ⏰ Horarios Programados (Hora Perú)
- **08:30 AM** — Resumen matutino
- **01:00 PM** — Recordatorio de mediodía
- **05:30 PM** — Alerta de tarde (antes del cierre bancario)
- **09:00 PM** — Cierre del día

---

## 🔇 Pausa Inteligente ("Acuse de Lectura")
Si respondes en el grupo:
`ok`, `leído`, `visto`, `enterado` o `pagado`:
El bot guarda el acuse de recibo y **cancela automáticamente los siguientes recordatorios del día**.
Al día siguiente a las 08:30 AM vuelve a despertar con la cuenta regresiva actualizada.
