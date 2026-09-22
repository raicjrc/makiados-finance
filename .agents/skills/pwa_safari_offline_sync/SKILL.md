---
name: pwa_safari_offline_sync
description: >-
  Use this skill when modifying Service Workers (sw.js), PWA manifests, offline caching strategies,
  safari iOS standalone quirks, or background synchronization in web applications.
---

# PWA & Safari iOS Offline Synchronization Standard

Runbook and technical specifications for managing Service Workers, PWA lifecycle, and data synchronization on mobile devices (primarily iPhone / Safari WebKit) and Mac desktop.

---

## 1. Network-First Synchronization Core

For financial data, **stale data is unacceptable**. The Service Worker (`sw.js`) must strictly adhere to:

1. **Never Cache Dynamic API Calls:**
   - Routes `/api/`, `supabase.co`, `webhook.site`, `/api/data`, and `database.json` must always bypass SW cache and use `{ cache: 'no-store' }`.
2. **Immediate Activation:**
   - Always call `self.skipWaiting()` in the `install` event.
   - Always call `self.clients.claim()` in the `activate` event.
   - Increment the cache version string (`aliviafin-vXX`) whenever static assets are updated to trigger a clean purge of old caches.

---

## 2. Safari iOS Quirks & Defensive Techniques

1. **Aggressive Cache Busting:**
   Safari on iOS caches aggressively even with HTTP headers. Every background fetch or poll must append query parameters:
   ```javascript
   const noCacheUrl = `${endpoint}?_t=${Date.now()}&_r=${Math.random().toString(36).substring(2, 9)}`;
   ```

2. **Full-screen Safe-Areas:**
   In standalone PWA mode (`"display": "standalone"` in `manifest.json`), the iOS status bar and home indicator require explicit CSS padding:
   ```css
   padding-top: env(safe-area-inset-top, 0px);
   padding-bottom: env(safe-area-inset-bottom, 0px);
   ```

3. **Re-sync on Focus (`visibilitychange`):**
   When an iOS device locks or switches apps, WebSockets and long-polling sleep. On wake, trigger an immediate re-sync:
   ```javascript
   document.addEventListener('visibilitychange', () => {
     if (document.visibilityState === 'visible') {
       syncLatestState();
     }
   });
   ```

---

## 3. Offline Resilience Pattern

1. **Local-First Writes:**
   Mutations are instantly committed to `localStorage` or `IndexedDB`, rendering immediately to the UI with zero latency.
2. **Pending Queue:**
   If offline, queue the payload in `offline_pending_mutations`.
3. **Automatic Flush:**
   Listen to `window.addEventListener('online', flushPendingMutations)` and drain the queue sequentially once connectivity is restored.
