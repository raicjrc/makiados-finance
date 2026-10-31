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

## 3. Multi-Device Cloud-First & Offline Merge Pattern

1. **Cloud-First on Clean Wakeup (`!hasUnsyncedLocalMutations()`):**
   - When any device (iPhone PWA, Android Chrome, Mac Safari/Chrome, Windows) opens or wakes up (`visibilitychange`, `pageshow`, `focus`, `online`) and `hasUnsyncedLocalMutations()` is `false`, `applyRemoteState(remoteData)` MUST apply `remoteData` unconditionally (whenever `countTotalTransactions(remoteData) > 0`).
   - Stale `localStorage` on a woken device must NEVER reject cloud data or trigger `pushLocalIfUnsynced()`.
2. **Non-Destructive Offline Merge (`mergeOfflineWithRemoteState`):**
   - When `hasUnsyncedLocalMutations()` is `true` (the user genuinely added/edited items while offline), `applyRemoteState()` merges offline `transactions`, `incomes`, and `loans` by `id` into `remoteData` and syncs the unified state back to Supabase.
3. **Guaranteed Flush on All Lifecycle Events:**
   - Flush pending mutations on `visibilitychange` (hidden), `pagehide`, `beforeunload`, and `online`.
