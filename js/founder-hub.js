// ================================================================
// FOUNDER HUB v69.0 — MÓDULO MASTER CEO (pantalla completa + analítica en vivo)
// ================================================================
const FOUNDER_EMAIL = 'cesar.risso.f@gmail.com';
const MASTER_ONLINE_WINDOW_MS = 12 * 60 * 1000;   // "En línea ahora" = ping en los últimos 12 min
const MASTER_PRICE_LIFETIME_CENTS = 2990;          // S/ 29.90 (Plan Anual PRO)
const MASTER_PRICE_MONTHLY_CENTS = 490;            // S/ 4.90
const SUPABASE_SQL_EDITOR_URL = 'https://supabase.com/dashboard/project/swwvbfemxookbqoqotre/sql/new';

let masterSubscribersData = [];
let masterFeedbackData = [];
let masterReclamacionesData = [];
let masterRefundsData = [];
let masterChurnData = [];
let masterHeartbeats = [];
let masterDeletedMarkers = new Map();
let masterRpcAvailable = false;
let masterTelemetryError = null;
let masterCurrentFilter = 'all';
let masterCurrentPane = 'overview';
let masterLastLoadedAt = 0;
let masterLoading = false;
var masterTickTimer = null;
let masterCharts = {};

// SQL de activación (idempotente). Se copia con 1 tap desde el Hub y se pega en Supabase > SQL Editor.
const FOUNDER_SETUP_SQL = `-- ============================================================
-- AliviaFin v69 · Activación total del Founder Hub (ejecutar 1 sola vez)
-- Es idempotente: puedes volver a ejecutarlo sin riesgo.
-- ============================================================

-- 0) FEEDBACK & TELEMETRÍA: permitir inserción de feedback y señales de vida (desbloquea RLS 401)
DROP POLICY IF EXISTS "Cualquiera puede insertar feedback" ON public.app_feedback;
CREATE POLICY "Cualquiera puede insertar feedback" ON public.app_feedback
  FOR INSERT WITH CHECK (true);

-- 1) SEGURIDAD: un usuario solo puede crear su propia fila como 'free'/'trial'
--    (nadie puede auto-asignarse PRO desde la consola del navegador).
DROP POLICY IF EXISTS "Cualquiera puede insertar su registro inicial" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Usuario crea su fila free" ON public.user_subscriptions;
CREATE POLICY "Usuario crea su fila free" ON public.user_subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid()::text AND status IN ('free','trial'));

-- 2) César puede limpiar telemetría y mensajes
DROP POLICY IF EXISTS "Admin elimina feedback" ON public.app_feedback;
CREATE POLICY "Admin elimina feedback" ON public.app_feedback
  FOR DELETE USING ((auth.jwt() ->> 'email') = 'cesar.risso.f@gmail.com');

-- 3) Lista maestra REAL de cuentas (auth.users) con última conexión exacta
DROP FUNCTION IF EXISTS public.get_admin_subscribers();
CREATE FUNCTION public.get_admin_subscribers()
RETURNS TABLE (
  user_id text, email text, status text, created_at timestamptz,
  last_sign_in_at timestamptz, last_active_at timestamptz, full_name text
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
BEGIN
  IF (auth.jwt() ->> 'email') IS DISTINCT FROM 'cesar.risso.f@gmail.com' THEN
    RAISE EXCEPTION 'Acceso denegado: solo para el fundador';
  END IF;
  RETURN QUERY
  SELECT
    u.id::text,
    u.email::text,
    COALESCE(s.status, 'free')::text,
    COALESCE(s.created_at, u.created_at),
    u.last_sign_in_at,
    GREATEST(
      f.updated_at,
      (SELECT max(h.created_at) FROM public.app_feedback h
        WHERE h.type = 'heartbeat'
          AND (h.user_id = u.id::text OR lower(h.user_email) = lower(u.email))),
      (SELECT max(b.updated_at) FROM public.finanzas_state b
        WHERE b.id LIKE ('backup_' || left(u.id::text, 8) || '%'))
    ),
    NULLIF(u.raw_user_meta_data ->> 'full_name', '')::text
  FROM auth.users u
  LEFT JOIN public.user_subscriptions s ON s.user_id = u.id::text
  LEFT JOIN public.finanzas_state f ON f.id = ('state_' || u.id::text)
  ORDER BY COALESCE(u.last_sign_in_at, f.updated_at, u.created_at) DESC NULLS LAST;
END;
$$;

-- 4) Eliminación TOTAL de un usuario (login + datos + telemetría)
CREATE OR REPLACE FUNCTION public.delete_user_by_admin(target_user_id text, target_email text)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
BEGIN
  IF (auth.jwt() ->> 'email') IS DISTINCT FROM 'cesar.risso.f@gmail.com' THEN
    RAISE EXCEPTION 'Acceso denegado: solo para el fundador';
  END IF;
  IF lower(coalesce(target_email, '')) = 'cesar.risso.f@gmail.com' THEN
    RAISE EXCEPTION 'La cuenta fundadora está protegida';
  END IF;

  IF coalesce(target_user_id, '') <> '' THEN
    DELETE FROM public.finanzas_state WHERE id = ('state_' || target_user_id);
    DELETE FROM public.finanzas_state WHERE id LIKE ('backup_' || left(target_user_id, 8) || '%');
    DELETE FROM public.user_subscriptions WHERE user_id = target_user_id;
    DELETE FROM public.app_feedback WHERE user_id = target_user_id AND type <> 'user_deleted';
  END IF;
  IF coalesce(target_email, '') <> '' THEN
    DELETE FROM public.user_subscriptions WHERE lower(email) = lower(target_email);
    DELETE FROM public.app_feedback WHERE lower(user_email) = lower(target_email);
    DELETE FROM auth.users WHERE lower(email) = lower(target_email);
  END IF;
  IF target_user_id ~ '^[0-9a-fA-F-]{36}$' THEN
    DELETE FROM auth.users WHERE id = target_user_id::uuid;
  END IF;
  RETURN true;
END;
$$;

-- 5) Derecho al olvido real: el propio usuario borra su cuenta y todos sus datos (Ley 29733 / GDPR)
CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
DECLARE
  uid uuid := auth.uid();
  uemail text := lower(coalesce(auth.jwt() ->> 'email', ''));
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'No autenticado'; END IF;
  IF uemail = 'cesar.risso.f@gmail.com' THEN
    RAISE EXCEPTION 'La cuenta fundadora no se elimina desde la app';
  END IF;
  DELETE FROM public.finanzas_state WHERE id = ('state_' || uid::text) OR id LIKE ('backup_' || left(uid::text, 8) || '%');
  DELETE FROM public.user_subscriptions WHERE user_id = uid::text;
  DELETE FROM public.app_feedback WHERE user_id = uid::text;
  DELETE FROM auth.users WHERE id = uid;
  RETURN true;
END;
$$;

-- 6) Purgar de auth.users cualquier correo ya eliminado desde el Hub (como reich-reifer@hotmail.com)
DELETE FROM auth.users u
WHERE lower(u.email) <> 'cesar.risso.f@gmail.com'
  AND (
    lower(u.email) = 'reich-reifer@hotmail.com'
    OR EXISTS (
      SELECT 1 FROM public.app_feedback f
      WHERE f.type = 'user_deleted'
        AND (lower(f.user_email) = lower(u.email) OR f.user_id = u.id::text)
    )
  );
DELETE FROM public.app_feedback WHERE lower(user_email) = 'reich-reifer@hotmail.com';
`;

// ----------------------------------------------------------------
// Utilidades base
// ----------------------------------------------------------------
function isFounderEmail(email) {
  return (email || '').trim().toLowerCase() === FOUNDER_EMAIL;
}

function masterSetText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function masterMoney(cents) {
  return 'S/ ' + (Math.round(cents) / 100).toFixed(2);
}

function syncAdminUI() {
  const isCesar = isAdminCesar();
  const deskMasterBtn = document.getElementById('deskNavMasterBtn');
  if (deskMasterBtn) deskMasterBtn.style.display = isCesar ? 'flex' : 'none';
  const settMasterRow = document.getElementById('settingsMasterAdminRow');
  if (settMasterRow) settMasterRow.style.display = isCesar ? 'block' : 'none';
  const btnFounderHeader = document.getElementById('btnFounderHeader');
  if (btnFounderHeader) btnFounderHeader.style.display = 'none'; // Despejar cabecera: acceso en Ajustes y Sidebar
}

// Compatibilidad: antes abría un modal; ahora abre el módulo de pantalla completa.
function openMasterDashboardModal() {
  if (!isAdminCesar()) {
    showToast('Acceso restringido únicamente al fundador de AliviaFin', 'error');
    return;
  }
  switchTab('founder');
}

function enterFounderModule() {
  if (!isAdminCesar()) return;
  // En pantallas móviles (< 768px), abre directo en el Directorio de Usuarios para ver inmediatamente
  // quién se conectó hoy sin saturar la pantalla con 4 gráficos de escritorio
  if (window.innerWidth < 768 && masterCurrentPane === 'overview') {
    masterCurrentPane = 'users';
  }
  switchMasterTab(masterCurrentPane);
  renderFounderModule();            // pinta de inmediato lo que ya hay en memoria
  loadMasterDashboardData();        // y refresca en vivo
  stopFounderTicker();
  let ticks = 0;
  masterTickTimer = setInterval(() => {
    if (document.hidden) return;
    ticks++;
    updateFounderStamp();
    if (ticks % 4 === 0) loadMasterDashboardData();   // auto-refresh cada 60 s
  }, 15000);
}

function stopFounderTicker() {
  if (typeof masterTickTimer !== 'undefined' && masterTickTimer) {
    clearInterval(masterTickTimer);
    masterTickTimer = null;
  }
}

function switchMasterTab(tab) {
  const map = {
    overview: ['fhPaneOverview', 'fhTabOverview'],
    users: ['fhPaneUsers', 'fhTabUsers'],
    feedback: ['fhPaneFeedback', 'fhTabFeedback'],
    reclamos: ['fhPaneReclamos', 'fhTabReclamos']
  };
  if (tab === 'subs') tab = 'users';          // alias de versiones anteriores
  if (!map[tab]) tab = 'overview';
  masterCurrentPane = tab;
  Object.keys(map).forEach(k => {
    const pane = document.getElementById(map[k][0]);
    if (pane) pane.style.display = (k === tab) ? 'block' : 'none';
    const btn = document.getElementById(map[k][1]);
    if (btn) btn.classList.toggle('active', k === tab);
  });
  if (tab === 'overview') {
    setTimeout(() => {
      renderFounderCharts();
    }, 80);
  }
  if (tab === 'reclamos') renderMasterReclamos();
}

// ----------------------------------------------------------------
// Carga de datos (suscriptores + telemetría + feedback)
// ----------------------------------------------------------------
async function loadMasterDashboardData(force = false) {
  if (!isAdminCesar() || masterLoading) return;
  masterLoading = true;
  masterSetText('masterRefreshSpinner', '⏳');

  // Carga instantánea de caché local (0 ms para que no quede en blanco o cargando)
  if (!masterSubscribersData || masterSubscribersData.length === 0) {
    try {
      const cached = localStorage.getItem('aliviafin_cached_master_subs');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          masterSubscribersData = parsed;
          renderFounderModule();
        }
      }
    } catch (e) {}
  }

  try {
    // Ejecución paralela de alta velocidad de todas las consultas
    const [rpcRes, fallbackSubsRes, rawSubsRes, stRes, pingsRes, fbRes, recRes] = await Promise.allSettled([
      supabaseClient.rpc('get_admin_subscribers'),
      supabaseClient.from('user_subscriptions').select('*').order('created_at', { ascending: false }),
      supabaseClient.from('user_subscriptions').select('user_id, email, expires_at, trial_ends_at'),
      supabaseClient.from('finanzas_state').select('id,updated_at').order('updated_at', { ascending: false }).limit(300),
      supabaseClient.from('app_feedback').select('user_id,user_email,message,created_at').eq('type', 'heartbeat').order('created_at', { ascending: false }).limit(1000),
      supabaseClient.from('app_feedback').select('*').neq('type', 'heartbeat').order('created_at', { ascending: false }).limit(300),
      supabaseClient.from('app_reclamaciones').select('*').order('created_at', { ascending: false })
    ]);

    // 1) Suscriptores: RPC o fallback
    let subs = null;
    masterRpcAvailable = false;
    if (rpcRes.status === 'fulfilled' && !rpcRes.value.error && Array.isArray(rpcRes.value.data) && rpcRes.value.data.length > 0) {
      subs = rpcRes.value.data;
      masterRpcAvailable = true;
    } else if (fallbackSubsRes.status === 'fulfilled' && !fallbackSubsRes.value.error && Array.isArray(fallbackSubsRes.value.data)) {
      subs = fallbackSubsRes.value.data;
    }

    if (subs) {
      masterSubscribersData = subs;
      // Enriquecer con expires_at si es necesario
      if (rawSubsRes.status === 'fulfilled' && !rawSubsRes.value.error && Array.isArray(rawSubsRes.value.data)) {
        const expMap = new Map();
        rawSubsRes.value.data.forEach(r => {
          const exp = r.expires_at || r.trial_ends_at;
          if (exp) {
            if (r.user_id) expMap.set(r.user_id, exp);
            if (r.email) expMap.set(r.email.toLowerCase(), exp);
          }
        });
        masterSubscribersData.forEach(s => {
          if (!s.expires_at) {
            s.expires_at = expMap.get(s.user_id) || (s.email ? expMap.get(s.email.toLowerCase()) : null);
          }
        });
      }
      try {
        localStorage.setItem('aliviafin_cached_master_subs', JSON.stringify(masterSubscribersData));
      } catch (e) {}
    }

    // 2) Telemetría nativa directa desde finanzas_state
    let stateActivityRows = [];
    if (stRes.status === 'fulfilled' && !stRes.value.error && Array.isArray(stRes.value.data)) {
      stateActivityRows = stRes.value.data;
    }

    // 3) Telemetría de pings
    let pings = [];
    if (pingsRes.status === 'fulfilled' && !pingsRes.value.error && Array.isArray(pingsRes.value.data)) {
      pings = pingsRes.value.data;
    }
    masterHeartbeats = pings;

    // 4) Feedback y marcadores de eliminados
    let fbData = [];
    if (fbRes.status === 'fulfilled' && !fbRes.value.error && Array.isArray(fbRes.value.data)) {
      fbData = fbRes.value.data;
      window.masterLandingVisits = fbData.filter(i => i.type === 'landing_visit');
      masterDeletedMarkers = new Map();
      fbData.filter(i => i.type === 'user_deleted').forEach(m => {
        const k = (m.user_email || '').toLowerCase().trim();
        if (k && !masterDeletedMarkers.has(k)) masterDeletedMarkers.set(k, m.created_at);
      });
      masterFeedbackData = fbData.filter(i => i.type !== 'user_deleted' && i.type !== 'libro_reclamaciones' && i.type !== 'solicitud_reembolso' && i.type !== 'account_deletion_churn' && i.type !== 'landing_visit');
    }

    // 5) Reclamaciones
    let reclamacionesList = [];
    if (recRes.status === 'fulfilled' && !recRes.value.error && Array.isArray(recRes.value.data)) {
      reclamacionesList = recRes.value.data;
    }


    // Respaldo de reclamaciones desde app_feedback y localStorage
    if (Array.isArray(fbData)) {
      fbData.filter(i => i.type === 'libro_reclamaciones').forEach(item => {
        const meta = item.metadata || {};
        const cod = meta.codigo || (item.message && item.message.match(/\[(.*?)\]/) ? item.message.match(/\[(.*?)\]/)[1] : null);
        if (cod && !reclamacionesList.some(r => r.codigo === cod)) {
          reclamacionesList.push({
            id: item.id,
            codigo: cod,
            consumidor_nombre: meta.consumidor_nombre || item.user_email || 'Consumidor',
            consumidor_email: item.user_email,
            consumidor_telefono: meta.consumidor_telefono || 'No indicado',
            tipo: meta.tipo || 'reclamo',
            tipo_servicio: meta.tipo_servicio || 'AliviaFin PRO',
            detalle: meta.detalle || item.message,
            pedido: meta.pedido || 'Solución del caso',
            estado: meta.estado || 'pendiente',
            created_at: item.created_at
          });
        }
      });
    }

    try {
      const localBackups = JSON.parse(localStorage.getItem('finanzas_reclamaciones_backup') || '[]');
      localBackups.forEach(lb => {
        if (lb.codigo && !reclamacionesList.some(r => r.codigo === lb.codigo)) {
          reclamacionesList.push(lb);
        }
      });
    } catch (e) {}

    masterReclamacionesData = reclamacionesList;
    masterRefundsData = (fbData || []).filter(i => i.type === 'solicitud_reembolso');
    try {
      const localRefs = JSON.parse(localStorage.getItem('finanzas_reembolsos_backup') || '[]');
      localRefs.forEach(lr => {
        if (lr.codigo && !masterRefundsData.some(r => (r.metadata && r.metadata.codigo === lr.codigo))) {
          masterRefundsData.push({
            id: lr.codigo,
            user_email: lr.user_email,
            created_at: lr.created_at,
            metadata: lr
          });
        }
      });
    } catch (e) {}

    masterChurnData = (fbData || []).filter(i => i.type === 'account_deletion_churn');

    // Calcular alertas pendientes (reclamos, reembolsos y pagos reportados)
    const pendingPaymentClaims = (fbData || []).filter(i => i.type === 'payment_claim').length;
    const pendingClaims = masterReclamacionesData.filter(r => (r.estado || 'pendiente') === 'pendiente').length;
    const pendingRefunds = masterRefundsData.filter(r => ((r.metadata && r.metadata.estado) || 'pendiente') === 'pendiente').length;
    const totalPendingAlerts = pendingClaims + pendingRefunds + pendingPaymentClaims;

    // Actualizar Badges de Alerta Founder (sidebar y header)
    const badgeDesk = document.getElementById('founderPendingAlertBadgeDesk');
    const badgeMob = document.getElementById('founderPendingAlertBadgeMob');
    if (badgeDesk) {
      badgeDesk.textContent = totalPendingAlerts;
      badgeDesk.style.display = totalPendingAlerts > 0 ? 'inline-block' : 'none';
    }
    if (badgeMob) {
      badgeMob.style.display = totalPendingAlerts > 0 ? 'block' : 'none';
    }

    enrichMasterSubscribers(stateActivityRows);
    try {
      localStorage.setItem('aliviafin_cached_master_subs', JSON.stringify(masterSubscribersData));
    } catch (e) {}
    masterLastLoadedAt = Date.now();
    renderFounderModule();
    if (force) showToast('⚡ Datos de fundador actualizados en vivo', 'success');
  } catch (err) {
    console.error('Error cargando master data:', err);
    if (force) showToast('No se pudo actualizar el panel. Revisa tu conexión.', 'error');
  } finally {
    masterLoading = false;
    masterSetText('masterRefreshSpinner', '🔄');
  }
}

// Cruza los pings y finanzas_state con cada suscriptor (por correo o user_id) y detecta actividad real
function enrichMasterSubscribers(stateActivityRows = []) {
  if (!Array.isArray(masterSubscribersData)) masterSubscribersData = [];
  const lastSeen = new Map();
  const names = new Map();
  const ids = new Map();

  // A) Mapear actividad desde finanzas_state (respaldos diarios y estados de cuentas)
  const stateActivity = new Map();
  const registerStateActivity = (key, ts) => {
    if (!key || !ts) return;
    const current = stateActivity.get(key);
    if (!current || Date.parse(ts) > Date.parse(current)) {
      stateActivity.set(key, ts);
    }
  };

  if (Array.isArray(stateActivityRows)) {
    stateActivityRows.forEach(r => {
      if (!r || !r.id || !r.updated_at) return;
      const ts = r.updated_at;
      if (r.id.startsWith('state_')) {
        const fullId = r.id.substring(6).trim();
        registerStateActivity(fullId, ts);
        if (fullId.length >= 8) registerStateActivity(fullId.substring(0, 8), ts);
      } else if (r.id.startsWith('backup_')) {
        const parts = r.id.split('_');
        if (parts.length >= 2) {
          registerStateActivity(parts[1], ts); // short id (8 chars)
        }
      }
    });
  }

  // B) Mapear actividad y telemetría social desde app_feedback (heartbeats)
  const firstSeen = new Map();
  const telemetryByKey = new Map();
  masterHeartbeats.forEach(h => {
    const email = (h.user_email || '').toLowerCase().trim();
    [email, h.user_id].filter(Boolean).forEach(key => {
      if (!lastSeen.has(key)) lastSeen.set(key, h.created_at);
      firstSeen.set(key, h.created_at); // como viene ordenado desc, el último procesado es el más antiguo (primer registro)
    });
    if (email && h.user_id && !ids.has(email)) ids.set(email, h.user_id);
    if (h.message && h.message !== 'heartbeat') {
      let cleanName = h.message;
      let parsedMeta = null;
      if (typeof h.message === 'string' && h.message.trim().startsWith('{')) {
        try {
          parsedMeta = JSON.parse(h.message);
          if (parsedMeta && parsedMeta.name) cleanName = parsedMeta.name;
        } catch (e) {}
      }
      [email, h.user_id].filter(Boolean).forEach(key => {
        if (cleanName && !names.has(key)) names.set(key, cleanName);
        if (parsedMeta && !telemetryByKey.has(key)) {
          telemetryByKey.set(key, parsedMeta);
        }
      });
    }
  });
  window.masterUserTelemetryMap = telemetryByKey;

  // C) Asignar la mayor marca de tiempo y telemetría social a cada suscriptor registrado
  masterSubscribersData.forEach(sub => {
    const email = (sub.email || '').toLowerCase().trim();
    const shortId = (sub.user_id && sub.user_id.length >= 8) ? sub.user_id.substring(0, 8) : null;

    const candidates = [
      sub.last_active_at,
      sub.last_sign_in_at,
      lastSeen.get(email),
      lastSeen.get(sub.user_id),
      sub.user_id ? stateActivity.get(sub.user_id) : null,
      shortId ? stateActivity.get(shortId) : null
    ].filter(Boolean);

    if (candidates.length > 0) {
      candidates.sort((a, b) => Date.parse(b) - Date.parse(a));
      sub.last_active_at = candidates[0];
    }

    if (!sub.created_at) {
      sub.created_at = firstSeen.get(email) || firstSeen.get(sub.user_id) || sub.last_active_at;
    }

    // Migración automática de planes anuales antiguos sin fecha de vencimiento a 365 días desde su pago/registro
    if ((sub.status === 'pro_lifetime' || sub.status === 'premium') && !sub.expires_at && !isFounderEmail(sub.email)) {
      const baseMs = Date.parse(sub.updated_at || sub.created_at) || Date.now();
      sub.expires_at = new Date(baseMs + 365 * 86400000).toISOString();
      if (isAdminCesar() && supabaseClient && sub.user_id) {
        supabaseClient.from('user_subscriptions')
          .update({ expires_at: sub.expires_at })
          .eq('user_id', sub.user_id)
          .then(() => {}).catch(() => {});
      }
    }

    const hbName = names.get(email) || names.get(sub.user_id);
    if (hbName && !sub.full_name && !sub.user_name) sub.user_name = hbName;

    const tel = telemetryByKey.get(email) || telemetryByKey.get(sub.user_id) || null;
    const hasCloudState = Boolean((sub.user_id && stateActivity.get(sub.user_id)) || (shortId && stateActivity.get(shortId)));
    sub._telemetry = {
      source: (tel && tel.source) ? tel.source : 'direct',
      device: (tel && tel.device) ? tel.device : 'Web',
      onboardingDone: (tel && typeof tel.onboardingDone === 'boolean') ? tel.onboardingDone : hasCloudState,
      txCount: (tel && typeof tel.txCount === 'number') ? tel.txCount : (hasCloudState ? 1 : 0)
    };
  });

  // D) Siempre incorporar a cualquier usuario registrado o activo en heartbeats que aún no figure en user_subscriptions
  const known = new Set(masterSubscribersData.map(s => (s.email || '').toLowerCase().trim()));
  lastSeen.forEach((ts, key) => {
    if (!key.includes('@') || known.has(key)) return;
    known.add(key);
    const tel = telemetryByKey.get(key) || null;
    masterSubscribersData.push({
      user_id: ids.get(key) || null,
      email: key,
      user_name: names.get(key) || formatCleanNameFromEmail(key),
      status: 'free',
      created_at: firstSeen.get(key) || ts,
      last_active_at: ts,
      _telemetry: {
        source: (tel && tel.source) ? tel.source : 'direct',
        device: (tel && tel.device) ? tel.device : 'Web',
        onboardingDone: (tel && typeof tel.onboardingDone === 'boolean') ? tel.onboardingDone : false,
        txCount: (tel && typeof tel.txCount === 'number') ? tel.txCount : 0
      }
    });
  });
}

// ----------------------------------------------------------------
// Nombres, borrados y deduplicación
// ----------------------------------------------------------------
function getDeletedUsersList() {
  try {
    return JSON.parse(localStorage.getItem('aliviafin_deleted_users') || '[]');
  } catch (e) {
    return [];
  }
}

function getStoredNicknames() {
  try {
    return JSON.parse(localStorage.getItem('aliviafin_user_nicknames') || '{}');
  } catch (e) {
    return {};
  }
}

function setStoredNickname(email, name) {
  if (!email) return;
  const nicknames = getStoredNicknames();
  nicknames[email.toLowerCase().trim()] = name.trim();
  localStorage.setItem('aliviafin_user_nicknames', JSON.stringify(nicknames));
}

function formatCleanNameFromEmail(email) {
  if (!email || !email.includes('@')) return email || 'Usuario';
  const localPart = email.split('@')[0];
  const clean = localPart.replace(/[._\-]+/g, ' ').replace(/\d+/g, '').trim();
  if (!clean) return localPart;
  return clean
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function getDisplayNameForEmail(email, item = {}) {
  if (!email) return 'Usuario';
  const cleanEmail = email.toLowerCase().trim();
  const nicknames = getStoredNicknames();
  if (nicknames[cleanEmail]) return nicknames[cleanEmail];
  if (item.name && item.name.trim()) return item.name.trim();
  if (item.full_name && item.full_name.trim()) return item.full_name.trim();
  if (item.user_name && item.user_name.trim()) return item.user_name.trim();
  return formatCleanNameFromEmail(email);
}

async function promptEditUserNickname(email) {
  if (!isAdminCesar()) return;
  const current = getDisplayNameForEmail(email);
  const newName = await uiPrompt(`Ingresa el nombre o apodo para ${email}:`, current);
  if (newName !== null && newName.trim() !== '') {
    setStoredNickname(email, newName.trim());
    renderMasterSubscribers();
    showToast(`✅ Nombre guardado: "${newName.trim()}"`, 'success');
  }
}

// Un usuario eliminado queda oculto hasta que vuelva a conectarse (marcador en la nube + lista local heredada)
function isMasterUserHidden(item) {
  const email = (item.email || '').toLowerCase().trim();
  const legacy = getDeletedUsersList();
  if ((email && legacy.includes(email)) || (item.user_id && legacy.includes(item.user_id))) return true;
  const markerTs = masterDeletedMarkers.get(email);
  if (markerTs) {
    const latest = Math.max(
      Date.parse(item.last_active_at) || 0,
      Date.parse(item.last_sign_in_at) || 0,
      Date.parse(item.created_at) || 0
    );
    if ((Date.parse(markerTs) || 0) >= latest) return true;
  }
  return false;
}

function getDeduplicatedSubscribers(rawList) {
  const map = new Map();
  const sorted = [...(rawList || [])].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  const newer = (a, b) => (Date.parse(a) || 0) > (Date.parse(b) || 0);

  sorted.forEach(item => {
    const key = (item.email || item.user_id || '').toLowerCase().trim();
    if (!key) return;
    if (isMasterUserHidden(item)) return;

    if (!map.has(key)) {
      map.set(key, { ...item });
      return;
    }
    const existing = map.get(key);
    const isProItem = ['pro_lifetime', 'pro_monthly', 'premium'].includes(item.status);
    const isProExisting = ['pro_lifetime', 'pro_monthly', 'premium'].includes(existing.status);
    if (isProItem && !isProExisting) {
      existing.status = item.status;
      existing.user_id = item.user_id;
    }
    if (item.last_sign_in_at && (!existing.last_sign_in_at || newer(item.last_sign_in_at, existing.last_sign_in_at))) {
      existing.last_sign_in_at = item.last_sign_in_at;
    }
    if (item.last_active_at && (!existing.last_active_at || newer(item.last_active_at, existing.last_active_at))) {
      existing.last_active_at = item.last_active_at;
    }
    if (item.expires_at && (!existing.expires_at || newer(item.expires_at, existing.expires_at))) {
      existing.expires_at = item.expires_at;
    }
    if (item.trial_ends_at && !existing.trial_ends_at) {
      existing.trial_ends_at = item.trial_ends_at;
    }
    if (item.status === 'expired' && !['pro_lifetime', 'premium'].includes(existing.status)) {
      existing.status = 'expired';
    }
    if (item.user_name && !existing.user_name) existing.user_name = item.user_name;
    if (item.full_name && !existing.full_name) existing.full_name = item.full_name;
    if (item._telemetry && !existing._telemetry) existing._telemetry = item._telemetry;
  });

  return Array.from(map.values());
}

// Clientes reales (excluye la cuenta fundadora para no inflar ingresos ni conversión)
function getMasterCustomers() {
  return getDeduplicatedSubscribers(masterSubscribersData).filter(s => !isFounderEmail(s.email));
}

function getMasterPlanKey(item) {
  if (isFounderEmail(item.email)) return 'founder';
  if (item.status === 'pro_lifetime' || item.status === 'premium') return 'life';
  if (item.status === 'pro_monthly' || item.status === 'expired') return 'month';
  return 'free';
}

// ----------------------------------------------------------------
// Telemetría de última conexión (usa la señal más reciente disponible)
// ----------------------------------------------------------------
function getUserLastConnectionInfo(item) {
  const now = Date.now();
  const isCurrentSession = !!(currentUser && (
    (item.email && currentUser.email && item.email.toLowerCase() === currentUser.email.toLowerCase()) ||
    (item.user_id && item.user_id === currentUser.id)
  ));

  const lastMs = isCurrentSession
    ? now
    : Math.max(Date.parse(item.last_active_at) || 0, Date.parse(item.last_sign_in_at) || 0);
  const regMs = Date.parse(item.created_at) || 0;

  // Sin ninguna señal de conexión
  if (!lastMs) {
    const regDays = regMs ? Math.floor((now - regMs) / 86400000) : 999;
    const isNew = regDays < 3;
    return {
      lastSeenMs: 0,
      diffDays: regDays,
      isInactive: !isNew,
      bucket: 'never',
      html: isNew
        ? `<div><span class="master-activity-badge neutral"><span class="activity-dot dot-neutral"></span> Nuevo</span>
             <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">Aún sin actividad</div></div>`
        : `<div><span class="master-activity-badge inactive"><span class="activity-dot dot-inactive"></span> Sin conexión registrada</span>
             <div style="font-size: 10px; color: #ef4444; font-weight: 700; margin-top: 2px;">⚠️ Churn Alert (solo registro · hace ${regDays}d)</div></div>`
    };
  }

  const diffMs = Math.max(0, now - lastMs);
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const d = new Date(lastMs);
  const stamp = `${d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })} ${d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;

  let bucket, html;
  if (diffMs <= MASTER_ONLINE_WINDOW_MS) {
    bucket = 'online';
    html = `<div title="${stamp}"><span class="master-activity-badge active"><span class="activity-dot dot-active"></span> Hoy</span>
              <div style="font-size: 10px; color: #10b981; font-weight: 700; margin-top: 2px;">En línea ahora ⚡</div></div>`;
  } else if (diffHours < 24) {
    bucket = 'today';
    const ago = diffMin < 60 ? `Hace ${diffMin} min` : `Hace ${diffHours}h`;
    html = `<div title="${stamp}"><span class="master-activity-badge active"><span class="activity-dot dot-active"></span> Hoy</span>
              <div style="font-size: 10px; color: #10b981; font-weight: 700; margin-top: 2px;">${ago}</div></div>`;
  } else if (diffDays <= 3) {
    bucket = 'd3';
    html = `<div title="${stamp}"><span class="master-activity-badge active"><span class="activity-dot dot-active"></span> Activo</span>
              <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">Hace ${diffDays} día${diffDays > 1 ? 's' : ''}</div></div>`;
  } else if (diffDays <= 7) {
    bucket = 'd7';
    html = `<div title="${stamp}"><span class="master-activity-badge warning"><span class="activity-dot dot-warning"></span> Hace ${diffDays}d</span>
              <div style="font-size: 10px; color: #b45309; font-weight: 600; margin-top: 2px;">Riesgo leve</div></div>`;
  } else {
    bucket = 'old';
    html = `<div title="${stamp} · Sin actividad reciente"><span class="master-activity-badge inactive"><span class="activity-dot dot-inactive"></span> Inactivo (+${diffDays}d)</span>
              <div style="font-size: 10px; color: #ef4444; font-weight: 700; margin-top: 2px;">⚠️ Churn Alert (última vez hace ${diffDays}d)</div></div>`;
  }

  return { lastSeenMs: lastMs, diffDays, diffHours, isInactive: diffDays > 7, bucket, html };
}

// ----------------------------------------------------------------
// KPIs
// ----------------------------------------------------------------
function calculateMasterKPIs() {
  const customers = getMasterCustomers();
  const total = customers.length;
  const now = Date.now();
  let life = 0, month = 0, active24 = 0, active7 = 0, risk = 0, new7 = 0;

  let expiring = 0;
  let expired = 0;
  customers.forEach(s => {
    const plan = getMasterPlanKey(s);
    const expInfo = getSubscriberExpirationInfo(s);
    if (plan === 'life') {
      life++;
    } else if (plan === 'month') {
      if (!expInfo.isExpired) {
        month++;
      }
    }
    if (expInfo.isExpiring) expiring++;
    if (expInfo.isExpired) expired++;
    const info = getUserLastConnectionInfo(s);
    if (info.lastSeenMs && now - info.lastSeenMs <= 86400000) active24++;
    if (info.lastSeenMs && now - info.lastSeenMs <= 7 * 86400000) active7++;
    if (info.isInactive) risk++;
    if (s.created_at && now - Date.parse(s.created_at) <= 7 * 86400000) new7++;
  });

  const paid = life + month;
  const free = Math.max(0, total - paid);
  const mrrCents = month * MASTER_PRICE_MONTHLY_CENTS;
  const lifeCents = life * MASTER_PRICE_LIFETIME_CENTS;
  const conv = total > 0 ? ((paid / total) * 100).toFixed(1) : '0.0';
  const activePct = total > 0 ? Math.round((active7 / total) * 100) : 0;

  masterSetText('masterMrrVal', masterMoney(mrrCents));
  masterSetText('masterMrrSub', `${month} suscriptor${month === 1 ? '' : 'es'} mensual${month === 1 ? '' : 'es'} activo${month === 1 ? '' : 's'}`);
  masterSetText('masterTotalRevenueVal', masterMoney(mrrCents + lifeCents));
  masterSetText('masterLifetimeSalesSub', `${life} membresía${life === 1 ? '' : 's'} vitalicia${life === 1 ? '' : 's'} · estimado por plan activo`);
  masterSetText('masterTotalUsersVal', `${total} Cuenta${total === 1 ? '' : 's'}`);
  masterUsersBreakdownSub = `${paid} PRO (${life} Vit. / ${month} Men.) · ${free} Free · +${new7} esta semana`;
  masterSetText('masterUsersBreakdownSub', masterUsersBreakdownSub);
  masterSetText('masterConversionVal', `${conv}%`);
  masterSetText('masterConversionSub', `${paid} de ${total} cuentas pagan`);
  masterSetText('masterActiveVal', `${active24}`);
  masterSetText('masterActiveSub', `${active7} activas en 7 días (${activePct}%)`);
  masterSetText('masterRiskVal', `${risk}`);
  masterSetText('masterRiskSub', risk === 0 ? 'Sin cuentas en riesgo 🎉' : `${total > 0 ? Math.round((risk / total) * 100) : 0}% sin conexión +7 días`);

  masterSetText('countMAll', total);
  masterSetText('countMActive', paid);
  masterSetText('countMDue', expired + expiring);
  masterSetText('countMFree', free);
  masterSetText('countMLife', life);
  masterSetText('countMMonth', month);
  masterSetText('countMExpiring', expiring);
  masterSetText('countMExpired', expired);
  masterSetText('countMInactive', risk);

  if (typeof renderFounderSocialRadar === 'function') {
    renderFounderSocialRadar(customers);
  }
}

// ----------------------------------------------------------------
// Radar de Adquisición & Redes Sociales (TikTok / Instagram / Web)
// ----------------------------------------------------------------
function renderFounderSocialRadar(customersList) {
  const customers = Array.isArray(customersList) ? customersList : getMasterCustomers();
  const visits = Array.isArray(window.masterLandingVisits) ? window.masterLandingVisits : [];
  const now = Date.now();
  const dayMs = 86400000;

  // 1) Visitas al Link Hoy (24h) y Total
  const visitsToday = visits.filter(v => v.created_at && (now - Date.parse(v.created_at) <= dayMs));
  let ttVisits = 0, igVisits = 0, webVisits = 0;
  visitsToday.forEach(v => {
    let src = 'direct';
    if (v.message && typeof v.message === 'string' && v.message.trim().startsWith('{')) {
      try { src = JSON.parse(v.message).source || 'direct'; } catch (e) {}
    }
    if (src === 'tiktok') ttVisits++;
    else if (src === 'instagram') igVisits++;
    else webVisits++;
  });

  // 2) Nuevos Registros Hoy (24h) y 7 Días
  let signupsToday = 0, signups7d = 0;
  let onboardingDoneCount = 0, withTxCount = 0;
  let mobileCount = 0, desktopCount = 0;

  customers.forEach(c => {
    const regMs = Date.parse(c.created_at) || 0;
    if (regMs && (now - regMs <= dayMs)) signupsToday++;
    if (regMs && (now - regMs <= 7 * dayMs)) signups7d++;

    const tel = c._telemetry || {};
    if (tel.onboardingDone) onboardingDoneCount++;
    if ((tel.txCount || 0) > 0 || tel.onboardingDone) withTxCount++;

    const dev = (tel.device || 'Web').toLowerCase();
    if (dev.includes('iphone') || dev.includes('ipad') || dev.includes('android')) {
      mobileCount++;
    } else {
      desktopCount++;
    }
  });

  const totalCust = customers.length;
  const onbPct = totalCust > 0 ? Math.round((onboardingDoneCount / totalCust) * 100) : 0;
  const totalDev = mobileCount + desktopCount;
  const mobPct = totalDev > 0 ? Math.round((mobileCount / totalDev) * 100) : 0;

  masterSetText('fhSocialVisitsTodayVal', String(visitsToday.length));
  masterSetText('fhSocialVisitsBreakdownSub', `🎵 ${ttVisits} TikTok · 📸 ${igVisits} IG · 🌐 ${webVisits} Web`);
  masterSetText('fhSocialSignupsTodayVal', `+${signupsToday}`);
  masterSetText('fhSocialSignups7dSub', `Últimos 7 días: +${signups7d} nuevos`);
  masterSetText('fhSocialOnboardingPctVal', `${onbPct}%`);
  masterSetText('fhSocialOnboardingSub', `${onboardingDoneCount} de ${totalCust} configuraron su cuenta`);
  masterSetText('fhSocialMobilePctVal', `${mobPct}% Móvil`);
  masterSetText('fhSocialDeviceBreakdownSub', `📱 ${mobileCount} Celular · 💻 ${desktopCount} PC/Mac`);

  // 3) Embudo de Conversión en Vivo (Estilo Claro Ejecutivo acorde al Hub)
  const funnelEl = document.getElementById('fhSocialFunnelContainer');
  if (funnelEl) {
    const topBase = Math.max(visits.length, totalCust, 1);
    const steps = [
      { label: '1. Visitas registradas al Link', count: Math.max(visits.length, totalCust), color: '#0284c7' },
      { label: '2. Cuentas Creadas (Registrados)', count: totalCust, color: '#059669' },
      { label: '3. Onboarding / Sueldo Configurado', count: onboardingDoneCount, color: '#7c3aed' },
      { label: '4. Con Movimientos Financieros', count: withTxCount, color: '#d97706' }
    ];
    funnelEl.innerHTML = steps.map(st => {
      const pct = Math.min(100, Math.round((st.count / topBase) * 100));
      return `
        <div style="background: var(--card-bg, #ffffff); border: 1px solid var(--border, #e2e8f0); border-radius: 10px; padding: 9px 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 11.5px; font-weight: 700; color: var(--text-main, #0f172a); margin-bottom: 5px;">
            <span>${st.label}</span>
            <span style="color: ${st.color}; font-weight: 800;">${st.count} (${pct}%)</span>
          </div>
          <div style="height: 6px; background: rgba(148, 163, 184, 0.2); border-radius: 999px; overflow: hidden;">
            <div style="width: ${pct}%; height: 100%; background: ${st.color}; border-radius: 999px;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 4) Feed en Tiempo Real de Últimos Usuarios Registrados (Estilo Claro Ejecutivo)
  const feedEl = document.getElementById('fhLiveNewUsersFeed');
  if (feedEl) {
    const sortedNewest = [...customers].sort((a, b) => (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0)).slice(0, 8);
    if (sortedNewest.length === 0) {
      feedEl.innerHTML = `<div style="font-size: 12px; color: var(--text-muted, #64748b); padding: 12px; text-align: center;">Aún no hay usuarios registrados fuera de la cuenta fundador.</div>`;
    } else {
      feedEl.innerHTML = sortedNewest.map(u => {
        const email = u.email || 'usuario';
        const name = getDisplayNameForEmail(email, { name: u.full_name || u.user_name });
        const tel = u._telemetry || {};
        const src = (tel.source || 'direct').toLowerCase();
        let srcBadge = `<span style="background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; padding: 2px 8px; border-radius: 999px; font-size: 10.5px; font-weight: 800;">🌐 Directo/Web</span>`;
        if (src === 'tiktok') {
          srcBadge = `<span style="background: #0f172a; color: #25f4ee; border: 1px solid #fe2c55; padding: 2px 8px; border-radius: 999px; font-size: 10.5px; font-weight: 800;">🎵 TikTok</span>`;
        } else if (src === 'instagram') {
          srcBadge = `<span style="background: linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045); color: #ffffff; padding: 2px 8px; border-radius: 999px; font-size: 10.5px; font-weight: 800;">📸 Instagram</span>`;
        }
        const dev = tel.device || 'Web';
        const devIcon = (dev.includes('iPhone') || dev.includes('Android') || dev.includes('iPad')) ? '📱' : '💻';
        const onbText = tel.onboardingDone ? '✅ Onboarding listo' : '⏳ Registrado';
        const onbColor = tel.onboardingDone ? '#059669' : '#d97706';

        const regMs = Date.parse(u.created_at) || Date.parse(u.last_active_at) || 0;
        let agoText = 'Reciente';
        if (regMs) {
          const diffMin = Math.max(1, Math.floor((now - regMs) / 60000));
          if (diffMin < 60) agoText = `Hace ${diffMin} min`;
          else if (diffMin < 1440) agoText = `Hace ${Math.floor(diffMin / 60)} h`;
          else agoText = `Hace ${Math.floor(diffMin / 1440)} d`;
        }

        return `
          <div style="background: var(--card-bg, #ffffff); border: 1px solid var(--border, #e2e8f0); border-radius: 12px; padding: 9px 12px; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
            <div style="min-width: 0;">
              <div style="font-size: 12.5px; font-weight: 800; color: var(--text-main, #0f172a); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${escapeHtml(name)} <span style="font-weight: 600; color: var(--text-muted, #64748b); font-size: 11px;">(${escapeHtml(email)})</span>
              </div>
              <div style="font-size: 10.5px; color: ${onbColor}; font-weight: 700; margin-top: 2px;">
                ${onbText} · ${devIcon} ${escapeHtml(dev)}
              </div>
            </div>
            <div style="text-align: right; flex-shrink: 0;">
              ${srcBadge}
              <div style="font-size: 10px; color: var(--text-muted, #64748b); font-weight: 700; margin-top: 3px;">${agoText}</div>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

// ----------------------------------------------------------------
// Gráficos (Chart.js, ya cargado en la app)
// ----------------------------------------------------------------
function founderChartTheme() {
  const dark = document.body.classList.contains('theme-twilight');
  return {
    text: dark ? '#94a3b8' : '#64748b',
    grid: dark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.06)'
  };
}

function mkFounderChart(id, config) {
  const el = document.getElementById(id);
  if (!el || typeof Chart === 'undefined') return;
  if (el.parentElement) {
    el.parentElement.style.minHeight = '220px';
  }
  if (masterCharts[id]) masterCharts[id].destroy();
  masterCharts[id] = new Chart(el.getContext('2d'), config);
}

function renderFounderCharts() {
  if (masterCurrentPane !== 'overview') return;
  if (typeof Chart === 'undefined') return;

  const customers = getMasterCustomers();
  const th = founderChartTheme();
  const font = { family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Plus Jakarta Sans", sans-serif', size: 11, weight: '600' };
  const tooltip = { backgroundColor: '#0f172a', titleFont: font, bodyFont: font, padding: 10, cornerRadius: 10, displayColors: false };
  const scales = {
    x: { grid: { display: false }, border: { display: false }, ticks: { color: th.text, font, maxRotation: 0, autoSkip: true } },
    y: { beginAtZero: true, border: { display: false }, grid: { color: th.grid }, ticks: { color: th.text, font, precision: 0 }, suggestedMax: 5 }
  };

  // 1) Crecimiento acumulado de cuentas (30 días)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const growthLabels = [];
  const dayStarts = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dayStarts.push(d.getTime());
    growthLabels.push(d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }));
  }
  const regTimes = customers.map(c => Date.parse(c.created_at) || 0).filter(Boolean);
  let cumulative = dayStarts.map(ds => regTimes.filter(t => t < ds + 86400000).length);
  if (cumulative.every(v => v === 0) && customers.length > 0) {
    cumulative = dayStarts.map(() => customers.length);
  }
  const gained = Math.max(0, cumulative[cumulative.length - 1] - cumulative[0]);
  masterSetText('fhGrowthNote', `+${gained} en 30 días (${customers.length} total)`);
  mkFounderChart('fhChartGrowth', {
    type: 'line',
    data: {
      labels: growthLabels,
      datasets: [{
        data: cumulative,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2.5
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false }, tooltip: { ...tooltip, callbacks: { label: c => ` ${c.parsed.y} cuentas` } } },
      scales
    }
  });

  // 2) Usuarios activos por día (14 días) a partir de los pings
  const actLabels = [];
  const actStarts = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    actStarts.push(d.getTime());
    actLabels.push(d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }));
  }
  const perDay = new Map();
  masterHeartbeats.forEach(h => {
    const email = (h.user_email || '').toLowerCase().trim();
    if (isFounderEmail(email)) return;
    const d = new Date(h.created_at);
    d.setHours(0, 0, 0, 0);
    const k = d.getTime();
    if (!perDay.has(k)) perDay.set(k, new Set());
    perDay.get(k).add(email || h.user_id);
  });
  const actCounts = actStarts.map(s => (perDay.get(s) ? perDay.get(s).size : 0));
  const hasPings = actCounts.some(n => n > 0);
  masterSetText('fhActivityNote', hasPings
    ? `Pico: ${Math.max(...actCounts)} usuarios/día`
    : 'Los pings se acumulan cuando cada usuario abre la versión nueva');
  mkFounderChart('fhChartActivity', {
    type: 'bar',
    data: {
      labels: actLabels,
      datasets: [{ data: actCounts, backgroundColor: 'rgba(16, 185, 129, 0.75)', hoverBackgroundColor: '#10b981', borderRadius: 8, borderSkipped: false, maxBarThickness: 28 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { ...tooltip, callbacks: { label: c => ` ${c.parsed.y} usuario${c.parsed.y === 1 ? '' : 's'} activo${c.parsed.y === 1 ? '' : 's'}` } } },
      scales
    }
  });

  // 3) Mezcla de planes
  let free = 0, month = 0, life = 0;
  customers.forEach(c => {
    const p = getMasterPlanKey(c);
    if (p === 'life') life++;
    else if (p === 'month') month++;
    else free++;
  });
  mkFounderChart('fhChartPlans', {
    type: 'doughnut',
    data: {
      labels: ['Gratuitos', 'PRO Mensual', 'PRO Vitalicio'],
      datasets: [{ data: [free, month, life], backgroundColor: ['#cbd5e1', '#6366f1', '#f59e0b'], borderWidth: 0, hoverOffset: 6 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '58%',
      layout: { padding: 4 },
      plugins: {
        legend: { position: 'bottom', labels: { color: th.text, font: { ...font, size: 10 }, usePointStyle: true, boxWidth: 6, padding: 8 } },
        tooltip
      }
    }
  });

  // 4) Recencia de conexión (salud de retención)
  const buckets = { online: 0, today: 0, d3: 0, d7: 0, old: 0, never: 0 };
  customers.forEach(c => { buckets[getUserLastConnectionInfo(c).bucket]++; });
  mkFounderChart('fhChartRecency', {
    type: 'bar',
    data: {
      labels: ['En línea', 'Hoy', '1–3 días', '4–7 días', '+7 días', 'Sin registro'],
      datasets: [{
        data: [buckets.online, buckets.today, buckets.d3, buckets.d7, buckets.old, buckets.never],
        backgroundColor: ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#ef4444', '#94a3b8'],
        borderRadius: 8, borderSkipped: false, maxBarThickness: 22
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { ...tooltip, callbacks: { label: c => ` ${c.parsed.x} cuenta${c.parsed.x === 1 ? '' : 's'}` } } },
      scales: {
        x: { beginAtZero: true, border: { display: false }, grid: { color: th.grid }, ticks: { color: th.text, font, precision: 0 } },
        y: { grid: { display: false }, border: { display: false }, ticks: { color: th.text, font } }
      }
    }
  });
}

// ----------------------------------------------------------------
// Insights accionables (anti-churn y conversión)
// ----------------------------------------------------------------
function founderMailto(email, name, kind) {
  const subject = kind === 'upgrade'
    ? 'Tu plan PRO de AliviaFin'
    : '¿Cómo te va con AliviaFin?';
  const body = kind === 'upgrade'
    ? `Hola ${name}, soy César de AliviaFin. Vi que estás usando la app con frecuencia y quería contarte del Plan Anual PRO (S/ 29.90 al año). ¿Te interesa?`
    : `Hola ${name}, soy César de AliviaFin. Noté que hace unos días no entras y quiero ayudarte a sacarle provecho. ¿Hay algo que no te haya gustado o te haya costado usar? Tu opinión me ayuda muchísimo.`;
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function renderFounderInsights() {
  const box = document.getElementById('fhInsights');
  if (!box) return;

  const customers = getMasterCustomers();
  if (customers.length === 0) {
    box.innerHTML = '<div class="fh-insight"><div class="fh-insight-icon">✨</div><div class="fh-insight-body"><div class="fh-insight-title">Aún no hay clientes</div><div class="fh-insight-text">Cuando se registren tus primeros usuarios aquí verás recomendaciones accionables.</div></div></div>';
    return;
  }

  const now = Date.now();
  const rows = customers.map(c => ({
    c,
    plan: getMasterPlanKey(c),
    info: getUserLastConnectionInfo(c),
    name: getDisplayNameForEmail(c.email || '', c)
  }));

  const chips = (list, kind) => list.slice(0, 6).map(x =>
    `<a class="fh-chip" href="${escapeHtml(founderMailto(x.c.email, x.name, kind))}" title="Escribirle a ${escapeHtml(x.c.email)}">${escapeHtml(x.name)} ✉️</a>`
  ).join('') + (list.length > 6 ? `<span class="fh-chip fh-chip-more">+${list.length - 6}</span>` : '');

  const hot = rows
    .filter(x => x.plan === 'free' && x.info.lastSeenMs && now - x.info.lastSeenMs <= 3 * 86400000)
    .sort((a, b) => b.info.lastSeenMs - a.info.lastSeenMs);
  const atRisk = rows
    .filter(x => x.info.isInactive)
    .sort((a, b) => (b.plan !== 'free') - (a.plan !== 'free') || (a.info.lastSeenMs || 0) - (b.info.lastSeenMs || 0));
  const fresh = rows.filter(x => x.c.created_at && now - Date.parse(x.c.created_at) <= 7 * 86400000);
  const returned = fresh.filter(x => x.info.lastSeenMs && x.info.lastSeenMs - Date.parse(x.c.created_at) > 86400000);
  const paidCount = rows.filter(x => x.plan === 'life' || x.plan === 'month').length;
  const active7 = rows.filter(x => x.info.lastSeenMs && now - x.info.lastSeenMs <= 7 * 86400000).length;

  const items = [];
  items.push({
    icon: '🔥',
    title: `Listos para PRO (${hot.length})`,
    text: hot.length
      ? 'Usuarios gratuitos que usaron la app en los últimos 3 días. Son tu mejor oportunidad: ofréceles el Plan Anual PRO (S/ 29.90) por correo o WhatsApp.'
      : 'Aún no hay usuarios gratuitos muy activos. Invita a probar el Simulador de Cuotas y la Bola de Nieve para aumentar el enganche.',
    chips: hot.length ? chips(hot, 'upgrade') : ''
  });
  items.push({
    icon: atRisk.length ? '⚠️' : '✅',
    title: `En riesgo de abandono (${atRisk.length})`,
    text: atRisk.length
      ? 'Más de 7 días sin conectarse (los PRO aparecen primero). Un mensaje personal en las primeras 72 h recupera a muchos: pregunta qué les frenó.'
      : 'Todas las cuentas se conectaron en los últimos 7 días. ¡Excelente retención!',
    chips: atRisk.length ? chips(atRisk, 'winback') : ''
  });
  items.push({
    icon: '🌱',
    title: `Nuevos esta semana: ${fresh.length}`,
    text: fresh.length
      ? `${returned.length} de ${fresh.length} volvieron después del primer día. ${returned.length < fresh.length ? 'Escríbeles a los que no volvieron: el onboarding es donde más se pierde gente.' : 'Muy buena activación.'}`
      : 'No hubo registros nuevos en 7 días. Comparte tu enlace con 3 contactos cercanos esta semana.',
    chips: ''
  });
  items.push({
    icon: '📊',
    title: 'Salud del negocio',
    text: `${active7} de ${rows.length} cuentas activas en 7 días · ${paidCount} pagan (${rows.length ? ((paidCount / rows.length) * 100).toFixed(1) : '0.0'}% conversión). Meta sugerida: 5–10% de conversión y 60%+ de activas semanales.`,
    chips: ''
  });

  box.innerHTML = items.map(i => `
    <div class="fh-insight">
      <div class="fh-insight-icon">${i.icon}</div>
      <div class="fh-insight-body">
        <div class="fh-insight-title">${i.title}</div>
        <div class="fh-insight-text">${i.text}</div>
        ${i.chips ? `<div class="fh-chip-row">${i.chips}</div>` : ''}
      </div>
    </div>`).join('');
}

// ----------------------------------------------------------------
// Banner de activación SQL + sello de actualización
// ----------------------------------------------------------------
function renderFounderSetupBanner() {
  const el = document.getElementById('fhSetupBanner');
  if (!el) return;
  const dismissedAt = parseInt(localStorage.getItem('aliviafin_fh_setup_dismissed') || '0', 10);
  const hide = masterRpcAvailable || (Date.now() - dismissedAt < 24 * 3600 * 1000);
  el.style.display = hide ? 'none' : 'flex';
  const note = document.getElementById('fhTelemetryNote');
  if (note) {
    note.textContent = masterTelemetryError
      ? `No pude leer los pings de actividad (${masterTelemetryError}).`
      : 'Con 1 pegado en Supabase obtienes la última conexión exacta de cada cuenta, el borrado total de usuarios y el blindaje del paywall.';
  }
}

function dismissFounderSetup() {
  localStorage.setItem('aliviafin_fh_setup_dismissed', String(Date.now()));
  renderFounderSetupBanner();
}

async function copyFounderSetupSQL() {
  try {
    await navigator.clipboard.writeText(FOUNDER_SETUP_SQL);
    showToast('📋 SQL copiado. Pégalo en Supabase → SQL Editor y pulsa Run', 'success');
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = FOUNDER_SETUP_SQL;
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (err) {}
    ta.remove();
    showToast(ok ? '📋 SQL copiado. Pégalo en Supabase → SQL Editor y pulsa Run' : 'No se pudo copiar automáticamente', ok ? 'success' : 'error');
  }
}

function openSupabaseSQLEditor() {
  window.open(SUPABASE_SQL_EDITOR_URL, '_blank', 'noopener');
}

function updateFounderStamp() {
  const el = document.getElementById('fhUpdatedAt');
  if (!el) return;
  if (!masterLastLoadedAt) {
    el.textContent = 'Cargando datos…';
    return;
  }
  const secs = Math.max(0, Math.floor((Date.now() - masterLastLoadedAt) / 1000));
  el.textContent = secs < 5 ? 'Actualizado ahora' : (secs < 60 ? `Actualizado hace ${secs}s` : `Actualizado hace ${Math.floor(secs / 60)} min`);
}

function renderFounderModule() {
  calculateMasterKPIs();
  renderMasterSubscribers();
  renderMasterFeedback();
  renderMasterReclamos();
  renderFounderInsights();
  renderFounderSetupBanner();
  updateFounderStamp();
  if (masterCurrentPane === 'overview') {
    setTimeout(() => {
      renderFounderCharts();
    }, 80);
  }
}

// ----------------------------------------------------------------
// Tabla de usuarios, filtros y acciones
// ----------------------------------------------------------------
function getSubscriberExpirationInfo(item) {
  const plan = getMasterPlanKey(item);
  if (plan === 'founder') {
    return {
      status: 'founder',
      html: '<span style="font-size:11px; font-weight:800; color:#d97706;">👑 Infinito</span>',
      isExpiring: false,
      isExpired: false
    };
  }

  const expRaw = item.expires_at || item.trial_ends_at || (plan === 'life' && item.created_at ? new Date(Date.parse(item.created_at) + 365 * 86400000).toISOString() : null);
  const sub = getSubscriptionDetails({ status: item.status, expires_at: expRaw, created_at: item.created_at, email: item.email });

  if (sub.status === 'free') {
    return {
      status: 'free',
      html: '<span style="font-size:11px; color:var(--text-muted);">— Básico</span>',
      isExpiring: false,
      isExpired: false
    };
  }

  const shortDate = expRaw && !isNaN(new Date(expRaw).getTime())
    ? new Date(expRaw).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
    : '';

  if (sub.isExpired) {
    return {
      status: 'expired',
      shortDate,
      html: `<span class="master-user-badge-exp-danger">🔴 Vencido${shortDate ? ' (' + shortDate + ')' : ''}</span>`,
      isExpiring: false,
      isExpired: true
    };
  }

  if (sub.inGrace) {
    return {
      status: 'grace',
      shortDate,
      html: `<span class="master-user-badge-exp-grace">⏳ Cortesía (${sub.hoursGrace}h)</span>`,
      isExpiring: true,
      isExpired: false
    };
  }

  if (sub.days <= 5) {
    return {
      status: 'expiring',
      shortDate,
      html: `<span class="master-user-badge-exp-warn">🟡 ${sub.days}d (${shortDate})</span>`,
      isExpiring: true,
      isExpired: false
    };
  }

  return {
    status: 'active',
    shortDate,
    html: `<span class="master-user-badge-exp-active">🟢 ${sub.days}d${shortDate ? ' (' + shortDate + ')' : ''}</span>`,
    isExpiring: false,
    isExpired: false
  };
}

function setMasterFilter(filter) {
  masterCurrentFilter = filter;
  document.querySelectorAll('.master-filter-chip').forEach(c => c.classList.remove('active'));
  const activeBtn = document.getElementById(
    filter === 'active' ? 'mFilterActive' :
    (filter === 'due' ? 'mFilterDue' :
    (filter === 'free' ? 'mFilterFree' : 'mFilterAll'))
  );
  if (activeBtn) activeBtn.classList.add('active');
  renderMasterSubscribers();
}

function filterMasterSubscribers() {
  renderMasterSubscribers();
}

function renderMasterSubscribers() {
  const tbody = document.getElementById('masterSubscribersTableBody');
  if (!tbody) return;

  const q = (document.getElementById('masterSearchInput')?.value || '').toLowerCase().trim();
  const uniqueSubs = getDeduplicatedSubscribers(masterSubscribersData);

  const list = uniqueSubs.filter(item => {
    const email = (item.email || item.user_id || '').toLowerCase();
    const cleanName = getDisplayNameForEmail(item.email || '', item).toLowerCase();
    const matchesQuery = !q || email.includes(q) || cleanName.includes(q) || (item.user_id && item.user_id.toLowerCase().includes(q));
    if (!matchesQuery) return false;

    const plan = getMasterPlanKey(item);
    const expInfo = getSubscriberExpirationInfo(item);
    if (masterCurrentFilter === 'active') {
      return plan === 'founder' || ((plan === 'life' || plan === 'month') && !expInfo.isExpired);
    }
    if (masterCurrentFilter === 'due') {
      return plan !== 'founder' && (expInfo.isExpired || expInfo.isExpiring);
    }
    if (masterCurrentFilter === 'free') {
      return plan === 'free';
    }
    return true; // 'all'
  });

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 36px 16px; color: var(--text-muted); font-size: 13px;">
          No se encontraron usuarios en esta categoría.
        </td>
      </tr>`;
    return;
  }

  // El fundador siempre primero; luego por actividad más reciente
  list.sort((a, b) => {
    if (isFounderEmail(a.email)) return -1;
    if (isFounderEmail(b.email)) return 1;
    return getUserLastConnectionInfo(b).lastSeenMs - getUserLastConnectionInfo(a).lastSeenMs
      || (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0);
  });

  let html = '';
  list.forEach(item => {
    const email = item.email || item.user_id || 'Sin correo';
    const cleanName = getDisplayNameForEmail(email, item);
    const plan = getMasterPlanKey(item);
    const isCesar = plan === 'founder';
    const isLife = isCesar || plan === 'life';
    const isMonth = plan === 'month';
    const expInfo = getSubscriberExpirationInfo(item);

    let planBadge = '<span class="master-user-badge-free">🆓 Gratuito</span>';
    let revenueEst = 'S/ 0.00';
    if (isCesar) {
      planBadge = '<span class="master-user-badge-pro-life" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.35)); border-color: #f59e0b; font-weight: 800;">👑 PRO Vitalicio</span>';
      revenueEst = 'Fundador CEO';
    } else if (isLife) {
      planBadge = '<span class="master-user-badge-pro-life">👑 PRO Anual</span>';
      revenueEst = 'S/ 29.90';
    } else if (isMonth) {
      if (expInfo.isExpired) {
        planBadge = '<span class="master-user-badge-pro-month" style="background: rgba(239, 68, 68, 0.12); color: #dc2626; border: 1.5px solid rgba(239, 68, 68, 0.35); font-weight: 800;">📅 PRO Mensual (Vencido)</span>';
        revenueEst = 'S/ 4.90 (Vencido)';
      } else {
        planBadge = '<span class="master-user-badge-pro-month">📅 PRO Mensual</span>';
        revenueEst = 'S/ 4.90 / mes';
      }
    }

    const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Reciente';
    const initial = cleanName.charAt(0).toUpperCase();
    const actInfo = getUserLastConnectionInfo(item);
    const uid = escapeHtml(item.user_id || '');
    const em = escapeHtml(email);

    const uidJs = escapeJsAttrArg(item.user_id || '');
    const emJs = escapeJsAttrArg(email);
    const nameJs = escapeJsAttrArg(cleanName);
    const planJs = escapeJsAttrArg(plan);
    const expDateJs = escapeJsAttrArg(expInfo.shortDate || '');

    // Acción rápida inteligente según el estado del cliente
    let actionHtml = '';
    if (isCesar) {
      actionHtml = `<span style="font-size: 11px; font-weight: 800; color: #d97706; background: rgba(245, 158, 11, 0.12); padding: 5px 12px; border-radius: 9px; display: inline-flex; align-items: center; gap: 4px;">👑 Fundador</span>`;
    } else if (expInfo.isExpired || expInfo.isExpiring) {
      actionHtml = `
        <div style="display: flex; gap: 6px; align-items: center; justify-content: flex-end;">
          <button type="button" class="btn btn-primary" onclick="openExecutiveWhatsAppAction('collection', ${emJs}, ${nameJs}, ${expDateJs})" style="background: #25d366; border: none; font-size: 11.5px; font-weight: 800; padding: 6px 12px; border-radius: 9px; display: inline-flex; align-items: center; gap: 5px; box-shadow: 0 2px 8px rgba(37, 211, 102, 0.25); color: #ffffff;" title="Enviar recordatorio cordial de pago por WhatsApp">
            <span>💬 Cobrar WhatsApp</span>
          </button>
          <button type="button" class="btn btn-secondary" onclick="openMasterUserActionsModal(${uidJs}, ${emJs}, ${nameJs}, ${planJs})" style="padding: 6px 10px; font-size: 13px; font-weight: 800; border-radius: 9px;" title="Más opciones de gestión">
            ⋮
          </button>
        </div>`;
    } else if (plan === 'free') {
      actionHtml = `
        <div style="display: flex; gap: 6px; align-items: center; justify-content: flex-end;">
          <button type="button" class="btn btn-primary" onclick="openExecutiveWhatsAppAction('promo', ${emJs}, ${nameJs})" style="background: linear-gradient(135deg, #6366f1, #4f46e5); border: none; font-size: 11.5px; font-weight: 800; padding: 6px 12px; border-radius: 9px; display: inline-flex; align-items: center; gap: 5px; box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25); color: #ffffff;" title="Ofrecer promoción PRO a este usuario">
            <span>🎁 Ofrecer PRO</span>
          </button>
          <button type="button" class="btn btn-secondary" onclick="openMasterUserActionsModal(${uidJs}, ${emJs}, ${nameJs}, ${planJs})" style="padding: 6px 10px; font-size: 13px; font-weight: 800; border-radius: 9px;" title="Más opciones de gestión">
            ⋮
          </button>
        </div>`;
    } else {
      actionHtml = `
        <div style="display: flex; gap: 6px; align-items: center; justify-content: flex-end;">
          <span style="font-size: 11px; font-weight: 700; color: #059669; background: rgba(16, 185, 129, 0.12); padding: 5px 10px; border-radius: 8px;">✓ Al Día</span>
          <button type="button" class="btn btn-secondary" onclick="openMasterUserActionsModal(${uidJs}, ${emJs}, ${nameJs}, ${planJs})" style="padding: 6px 10px; font-size: 13px; font-weight: 800; border-radius: 9px;" title="Más opciones de gestión">
            ⋮
          </button>
        </div>`;
    }

    html += `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg, #e2e8f0, #cbd5e1); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: #334155; flex-shrink: 0;">
              ${escapeHtml(initial)}
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-weight: 800; color: var(--text-main); font-size: 13.5px;">${escapeHtml(cleanName)}</span>
                <button type="button" onclick="promptEditUserNickname('${em}')" title="Editar nombre o apodo" style="background: none; border: none; font-size: 11px; cursor: pointer; opacity: 0.6; padding: 2px;">✏️</button>
              </div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 1px;">${em} · Registrado el ${dateStr}</div>
            </div>
          </div>
        </td>
        <td>${planBadge}</td>
        <td>${expInfo.html}</td>
        <td>${actInfo.html}</td>
        <td style="font-weight: 800; color: var(--text-main);">${revenueEst}</td>
        <td>${actionHtml}</td>
      </tr>`;
  });

  tbody.innerHTML = html;
}

async function setMasterUserPlan(userId, email, newPlan) {
  if (!isAdminCesar()) return;
  if (isFounderEmail(email)) {
    showToast('La cuenta fundadora es siempre PRO Vitalicio', 'info');
    return;
  }

  const planLabel = newPlan === 'pro_lifetime' ? 'Plan Anual PRO (S/ 29.90)' : (newPlan === 'pro_monthly' ? 'PRO Mensual (S/ 4.90)' : 'Gratuito (Free)');
  if (!await uiConfirm(`¿Confirmas actualizar a ${email} al plan ${planLabel}?`)) return;

  try {
    const updatePayload = { user_id: userId, status: newPlan };
    if (email) updatePayload.email = email;
    if (newPlan === 'pro_monthly') {
      updatePayload.expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    } else if (newPlan === 'pro_lifetime') {
      updatePayload.expires_at = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    }

    let { error } = await supabaseClient
      .from('user_subscriptions')
      .upsert(updatePayload, { onConflict: 'user_id' });

    if (error && error.message && error.message.includes('expires_at')) {
      delete updatePayload.expires_at;
      const res = await supabaseClient
        .from('user_subscriptions')
        .upsert(updatePayload, { onConflict: 'user_id' });
      error = res.error;
    }

    if (error) {
      console.error('Error al actualizar plan en Supabase:', error);
      showToast('Error al actualizar plan: ' + error.message, 'error');
      return;
    }

    // Sincronizar también por correo si existen registros duplicados de pruebas
    if (email && email.includes('@')) {
      try {
        const syncPayload = { status: newPlan };
        if (updatePayload.expires_at) syncPayload.expires_at = updatePayload.expires_at;
        await supabaseClient.from('user_subscriptions').update(syncPayload).eq('email', email);
      } catch (e) {
        console.warn('Nota de sync duplicados:', e);
      }
    }

    // Registro contable (si la tabla subscription_payments existe; si no, se ignora)
    if (newPlan !== 'free') {
      try {
        await supabaseClient.from('subscription_payments').insert([{
          user_id: userId,
          user_email: email,
          amount: newPlan === 'pro_lifetime' ? 29.90 : 4.90,
          plan_type: newPlan,
          payment_method: 'yape_plin'
        }]);
      } catch (e) { /* opcional */ }
    }

    masterSubscribersData.forEach(s => {
      if ((s.email && s.email.toLowerCase() === email.toLowerCase()) || (userId && s.user_id === userId)) {
        s.status = newPlan;
        if (updatePayload.expires_at) s.expires_at = updatePayload.expires_at;
      }
    });

    renderFounderModule();
    if (navigator.vibrate) navigator.vibrate(30);
    showToast(`✨ ${email} actualizado a ${planLabel}`, 'success');
  } catch (e) {
    console.error('Exception updating user plan:', e);
    showToast('Error de conexión', 'error');
  }
}

async function renewMasterUser30Days(userId, email) {
  if (!isAdminCesar()) return;
  if (isFounderEmail(email)) {
    showToast('La cuenta fundadora es siempre PRO Vitalicio', 'info');
    return;
  }

  const sub = masterSubscribersData.find(s => 
    (s.user_id && s.user_id === userId) || 
    (s.email && s.email.toLowerCase() === (email || '').toLowerCase())
  );

  let currentExpiresMs = sub && sub.expires_at ? new Date(sub.expires_at).getTime() : 0;
  if (isNaN(currentExpiresMs)) currentExpiresMs = 0;

  const nowMs = Date.now();
  // Suma 30 días a partir de hoy o a partir de su vencimiento actual si aún está vigente
  const baseMs = Math.max(nowMs, currentExpiresMs);
  const newExpiresMs = baseMs + (30 * 24 * 60 * 60 * 1000);
  const newExpiresIso = new Date(newExpiresMs).toISOString();
  const dateFormatted = new Date(newExpiresMs).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });

  if (!await uiConfirm(`¿Confirmas renovar 30 días PRO para ${email}?\nNueva fecha de vencimiento: ${dateFormatted}`)) {
    return;
  }

  try {
    const updatePayload = {
      user_id: userId,
      status: 'pro_monthly',
      expires_at: newExpiresIso
    };
    if (email) updatePayload.email = email;

    let { error } = await supabaseClient
      .from('user_subscriptions')
      .upsert(updatePayload, { onConflict: 'user_id' });

    if (error && error.message) {
      if (error.message.includes('updated_at')) {
        delete updatePayload.updated_at;
        const res = await supabaseClient
          .from('user_subscriptions')
          .upsert(updatePayload, { onConflict: 'user_id' });
        error = res.error;
      }
      if (error && error.message && error.message.includes('expires_at')) {
        delete updatePayload.expires_at;
        const res = await supabaseClient
          .from('user_subscriptions')
          .upsert(updatePayload, { onConflict: 'user_id' });
        error = res.error;
      }
    }

    if (error) {
      console.error('Error al renovar suscripción:', error);
      showToast('Error al renovar: ' + error.message, 'error');
      return;
    }

    if (email && email.includes('@')) {
      try {
        await supabaseClient.from('user_subscriptions').update({ status: 'pro_monthly', expires_at: newExpiresIso }).eq('email', email);
      } catch (e) {}
    }

    try {
      await supabaseClient.from('subscription_payments').insert([{
        user_id: userId,
        user_email: email,
        amount: 4.90,
        plan_type: 'pro_monthly',
        payment_method: 'yape_plin'
      }]);
    } catch (e) {}

    masterSubscribersData.forEach(s => {
      if ((s.email && s.email.toLowerCase() === (email || '').toLowerCase()) || (userId && s.user_id === userId)) {
        s.status = 'pro_monthly';
        s.expires_at = newExpiresIso;
      }
    });

    renderFounderModule();
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    showToast(`✨ Suscripción de ${email} renovada hasta el ${dateFormatted}`, 'success');
  } catch (err) {
    console.error('Error renovando suscripción:', err);
    showToast('Error de conexión', 'error');
  }
}

async function confirmDeleteMasterUser(userId, email, displayName) {
  if (!isAdminCesar()) return;
  if (isFounderEmail(email)) {
    showToast('La cuenta fundadora está protegida', 'info');
    return;
  }

  const cleanName = displayName || email || 'este usuario';
  const msg = `⚠️ ¿ELIMINAR USUARIO PERMANENTEMENTE?\n\n` +
              `Estás a punto de borrar a:\n` +
              `• Nombre: ${cleanName}\n` +
              `• Correo: ${email}\n\n` +
              `Se eliminará su suscripción y desaparecerá de tu panel. Si activaste el SQL del Hub, también se borran su login y todos sus datos financieros.\n\n` +
              `¿Deseas continuar?`;

  if (!await uiConfirm(msg)) return;
  await deleteMasterUser(userId, email, cleanName);
}

async function deleteMasterUser(userId, email, cleanName) {
  if (!isAdminCesar() || isFounderEmail(email)) return;

  showToast(`Eliminando usuario ${cleanName}... ⏳`, 'info');

  try {
    // 1) Borrado integral vía RPC (login + datos + telemetría) — requiere el SQL del Hub
    let fullyDeleted = false;
    try {
      const { error } = await supabaseClient.rpc('delete_user_by_admin', {
        target_user_id: userId || '',
        target_email: email
      });
      fullyDeleted = !error;
    } catch (e) {
      console.warn('RPC delete_user_by_admin no disponible:', e);
    }

    // 2) Respaldo: borrado directo de la suscripción, estado y telemetría por user_id y correo
    if (userId) {
      try { await supabaseClient.from('user_subscriptions').delete().eq('user_id', userId); } catch (e) {}
      try { await supabaseClient.from('finanzas_state').delete().eq('id', 'state_' + userId); } catch (e) {}
      try { await supabaseClient.from('app_feedback').delete().eq('user_id', userId); } catch (e) {}
    }
    if (email && email.includes('@')) {
      try { await supabaseClient.from('user_subscriptions').delete().eq('email', email); } catch (e) {}
      try { await supabaseClient.from('app_feedback').delete().eq('user_email', email); } catch (e) {}
    }

    // 3) Marcador en la nube: mantiene el panel limpio en cualquier dispositivo
    try {
      await supabaseClient.from('app_feedback').insert([{
        user_id: userId || null,
        user_email: (email || '').toLowerCase().trim(),
        type: 'user_deleted',
        message: cleanName,
        app_version: APP_VERSION
      }]);
    } catch (e) { /* no crítico */ }
    masterDeletedMarkers.set((email || '').toLowerCase().trim(), new Date().toISOString());

    // 4) Memoria local
    masterSubscribersData = masterSubscribersData.filter(s => {
      const matchId = userId && s.user_id === userId;
      const matchEmail = email && s.email && s.email.toLowerCase() === email.toLowerCase();
      return !matchId && !matchEmail;
    });

    renderFounderModule();
    if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
    showToast(
      fullyDeleted
        ? `🗑️ ${cleanName} eliminado por completo (cuenta y datos)`
        : `🗑️ ${cleanName} eliminado del panel con éxito.`,
      'success'
    );
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    showToast('Error al eliminar usuario: ' + (err.message || err), 'error');
  }
}

async function handleMasterManualActivate() {
  if (!isAdminCesar()) return;

  const emailInput = document.getElementById('masterManualEmail');
  const planSelect = document.getElementById('masterManualPlan');
  if (!emailInput || !planSelect) return;

  const email = emailInput.value.trim().toLowerCase();
  const plan = planSelect.value;

  if (!email || !email.includes('@')) {
    showToast('Ingresa un correo electrónico válido', 'error');
    return;
  }

  const existing = masterSubscribersData.find(s => s.email && s.email.toLowerCase() === email);
  if (!existing) {
    showToast('Ese correo aún no se registró en AliviaFin. Pídele que cree su cuenta primero.', 'warning');
    return;
  }

  await setMasterUserPlan(existing.user_id, email, plan);
  emailInput.value = '';
}

function renderMasterFeedback() {
  const container = document.getElementById('masterFeedbackList');
  if (!container) return;

  masterSetText('masterFeedbackCount', (masterFeedbackData || []).length);
  masterSetText('masterFeedbackCountMobile', (masterFeedbackData || []).length);

  if (!masterFeedbackData || masterFeedbackData.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 26px; color: var(--text-muted); background: var(--card-bg, #ffffff); border-radius: 16px; border: 1px solid var(--border-color, #e2e8f0); font-size: 12.5px;">
        🎉 No hay mensajes nuevos en el buzón.
      </div>`;
    return;
  }

  const typeMeta = {
    bug: ['🐞 Reporte de Error', '#ef4444'],
    feature: ['💡 Sugerencia', '#f59e0b'],
    deletion_request: ['🗑️ Solicitud de eliminación de cuenta', '#dc2626']
  };

  let html = '';
  masterFeedbackData.forEach(item => {
    const meta = typeMeta[item.type] || ['❓ Duda / Consulta', '#3b82f6'];
    const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
    const userEmail = item.user_email || 'Anónimo';

    html += `
      <div style="background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 16px; padding: 14px 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
          <span style="font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 6px; background: rgba(0,0,0,0.04); color: ${meta[1]};">${meta[0]}</span>
          <span style="font-size: 11px; color: var(--text-muted);">${dateStr}${item.app_version ? ' · ' + escapeHtml(item.app_version) : ''}</span>
        </div>
        <div style="font-size: 13px; color: var(--text-main); line-height: 1.5; margin: 8px 0; white-space: pre-wrap;">${escapeHtml(item.message || '')}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; border-top: 1px solid var(--border-color, #f1f5f9); padding-top: 8px;">
          <div style="font-size: 11px; color: var(--text-muted); font-weight: 600;">
            De: <strong style="color: var(--text-main);">${escapeHtml(userEmail)}</strong>
          </div>
          ${userEmail.includes('@') ? `
            <a href="mailto:${escapeHtml(userEmail)}?subject=${encodeURIComponent('Respuesta de AliviaFin sobre tu mensaje')}" class="btn btn-secondary" style="padding: 8px 12px; min-height: 44px; font-size: 11px; font-weight: 800; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
              <span>✉️ Responder</span>
            </a>` : ''}
        </div>
      </div>`;
  });

  container.innerHTML = html;
}

// ================================================================
// RECLAMACIONES & DEVOLUCIONES (FOUNDER HUB v70.0)
// ================================================================
function renderMasterReclamos() {
  const reclamos = masterReclamacionesData || [];
  const refunds = masterRefundsData || [];
  const churns = masterChurnData || [];

  // 1. KPIs
  const totalRec = reclamos.length;
  const pendRec = reclamos.filter(r => (r.estado || 'pendiente') === 'pendiente').length;
  const totalRef = refunds.length;
  const totalCh = churns.length;

  masterSetText('kpiTotalReclamos', totalRec);
  masterSetText('kpiPendientesReclamos', pendRec);
  masterSetText('kpiTotalReembolsos', totalRef);
  masterSetText('kpiTotalChurn', totalCh);

  masterSetText('masterReclamosCount', totalRec + totalRef);
  masterSetText('masterReclamosCountMobile', totalRec + totalRef);

  // 2. Tabla Reclamaciones Indecopi
  const claimsBody = document.getElementById('masterClaimsTableBody');
  if (claimsBody) {
    if (reclamos.length === 0) {
      claimsBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted);">
            🎉 No hay reclamaciones registradas en el Libro Virtual.
          </td>
        </tr>`;
    } else {
      let h = '';
      reclamos.forEach(r => {
        const isPend = (r.estado || 'pendiente') === 'pendiente';
        const dateObj = r.created_at ? new Date(r.created_at) : new Date();
        const dateStr = dateObj.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        // Cálculo de días transcurridos
        const daysElapsed = Math.floor((Date.now() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
        const daysLeft = Math.max(0, 15 - daysElapsed);
        const deadlineBadge = isPend 
          ? `<span style="font-size: 10px; font-weight: 800; color: ${daysLeft <= 3 ? '#ef4444' : '#f59e0b'}; background: rgba(245,158,11,0.1); padding: 1px 6px; border-radius: 4px; display: inline-block; margin-top: 2px;">Quedan ${daysLeft} días hábiles</span>`
          : `<span style="font-size: 10px; font-weight: 700; color: #10b981; background: rgba(16,185,129,0.1); padding: 1px 6px; border-radius: 4px;">Atendido</span>`;

        const tipoBadge = r.tipo === 'queja'
          ? `<span style="font-size: 10.5px; font-weight: 800; color: #d97706; background: rgba(245,158,11,0.12); padding: 2px 6px; border-radius: 6px;">QUEJA</span>`
          : `<span style="font-size: 10.5px; font-weight: 800; color: #dc2626; background: rgba(220,38,38,0.12); padding: 2px 6px; border-radius: 6px;">RECLAMO</span>`;

        h += `
          <tr>
            <td>
              <div style="font-weight: 800; font-size: 12px; color: #2563eb;">${escapeHtml(r.codigo || 'REC')}</div>
              <div style="font-size: 10px; color: var(--text-muted);">${dateStr}</div>
              ${deadlineBadge}
            </td>
            <td>
              <div style="font-weight: 700; font-size: 12px; color: var(--text-main);">${escapeHtml(r.consumidor_nombre || 'Consumidor')}</div>
              <div style="font-size: 10.5px; color: var(--text-muted);">${escapeHtml(r.consumidor_email || '')}</div>
              <div style="font-size: 10px; color: var(--text-muted);">Tel: ${escapeHtml(r.consumidor_telefono || 'No indicado')}</div>
            </td>
            <td>${tipoBadge}</td>
            <td style="max-width: 280px;">
              <div style="font-size: 11.5px; color: var(--text-main); line-height: 1.4; margin-bottom: 4px;"><b>Hechos:</b> ${escapeHtml(r.detalle || '')}</div>
              <div style="font-size: 11px; color: var(--text-muted); line-height: 1.3;"><b>Pedido:</b> ${escapeHtml(r.pedido || '')}</div>
            </td>
            <td>
              ${isPend 
                ? '<span style="font-size: 10.5px; font-weight: 800; color: #ef4444; background: rgba(239,68,68,0.1); padding: 2px 8px; border-radius: 6px;">🟡 PENDIENTE</span>' 
                : '<span style="font-size: 10.5px; font-weight: 800; color: #059669; background: rgba(16,185,129,0.1); padding: 2px 8px; border-radius: 6px;">🟢 ATENDIDO</span>'}
            </td>
            <td style="text-align: right;">
              <div style="display: flex; gap: 4px; justify-content: flex-end; flex-wrap: wrap;">
                ${r.consumidor_email ? `
                  <a href="mailto:${escapeHtml(r.consumidor_email)}?subject=${encodeURIComponent('Respuesta a tu Reclamación ' + (r.codigo || ''))}" class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px; font-weight: 700; text-decoration: none;" title="Responder al email">
                    ✉️
                  </a>` : ''}
                ${isPend ? `
                  <button type="button" class="btn btn-secondary" onclick="markClaimAttended('${escapeHtml(r.codigo || '')}')" style="padding: 4px 8px; font-size: 11px; font-weight: 700; color: #059669;" title="Marcar como atendido">
                    ✅ Listo
                  </button>` : ''}
              </div>
            </td>
          </tr>`;
      });
      claimsBody.innerHTML = h;
    }
  }

  // 3. Tabla Solicitudes de Devolución
  const refundsBody = document.getElementById('masterRefundsTableBody');
  if (refundsBody) {
    if (refunds.length === 0) {
      refundsBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted);">
            🎉 No hay solicitudes de devolución registradas.
          </td>
        </tr>`;
    } else {
      let h = '';
      refunds.forEach(ref => {
        const meta = ref.metadata || {};
        const cod = meta.codigo || (ref.message && ref.message.match(/\[(.*?)\]/) ? ref.message.match(/\[(.*?)\]/)[1] : 'REF');
        const email = ref.user_email || meta.user_email || 'Usuario';
        const tel = meta.telefono || 'No indicado';
        const plan = meta.plan || 'PRO';
        const motivo = meta.motivo || ref.message || '';
        const estado = meta.estado || 'pendiente';
        const isPend = estado === 'pendiente';
        const dateStr = ref.created_at ? new Date(ref.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

        h += `
          <tr>
            <td>
              <div style="font-weight: 800; font-size: 12px; color: #059669;">${escapeHtml(cod)}</div>
              <div style="font-size: 10px; color: var(--text-muted);">${dateStr}</div>
            </td>
            <td>
              <div style="font-weight: 700; font-size: 12px; color: var(--text-main);">${escapeHtml(email)}</div>
              <div style="font-size: 10.5px; color: var(--text-muted);">Tel: ${escapeHtml(tel)}</div>
            </td>
            <td>
              <span style="font-size: 11px; font-weight: 700; color: #475569;">${plan === 'pro_lifetime' ? '👑 PRO Anual (S/ 29.90)' : '📅 Mensual (S/ 4.90)'}</span>
            </td>
            <td style="max-width: 260px;">
              <div style="font-size: 11.5px; color: var(--text-main); line-height: 1.4;">${escapeHtml(motivo)}</div>
            </td>
            <td>
              ${isPend
                ? '<span style="font-size: 10.5px; font-weight: 800; color: #f59e0b; background: rgba(245,158,11,0.1); padding: 2px 8px; border-radius: 6px;">🟡 PENDIENTE</span>'
                : '<span style="font-size: 10.5px; font-weight: 800; color: #059669; background: rgba(16,185,129,0.1); padding: 2px 8px; border-radius: 6px;">🟢 DEVUELTO</span>'}
            </td>
            <td style="text-align: right;">
              <div style="display: flex; gap: 4px; justify-content: flex-end;">
                ${tel && tel !== 'No indicado' ? `
                  <a href="https://wa.me/51${tel.replace(/\D/g, '')}?text=${encodeURIComponent('Hola! Te escribe César de AliviaFin sobre tu solicitud de devolución ' + cod)}" target="_blank" class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px; text-decoration: none;" title="Abrir WhatsApp">
                    💬
                  </a>` : ''}
                ${isPend ? `
                  <button type="button" class="btn btn-secondary" onclick="markRefundProcessed('${escapeHtml(ref.id || cod)}')" style="padding: 4px 8px; font-size: 11px; font-weight: 700; color: #059669;" title="Marcar como procesado">
                    ✅ Listo
                  </button>` : ''}
              </div>
            </td>
          </tr>`;
      });
      refundsBody.innerHTML = h;
    }
  }

  // 4. Tabla Bajas de Cuenta (Churn Feedback)
  const churnBody = document.getElementById('masterChurnTableBody');
  if (churnBody) {
    if (churns.length === 0) {
      churnBody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 24px; color: var(--text-muted);">
            🎉 No se han registrado bajas de cuenta con encuesta.
          </td>
        </tr>`;
    } else {
      let h = '';
      churns.forEach(ch => {
        const meta = ch.metadata || {};
        const dateStr = ch.created_at ? new Date(ch.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
        const reasonLabels = {
          dificil_uso: '📱 Difícil de usar / poco intuitiva',
          ya_no_necesito: '📉 Ya no necesita registrar gastos',
          faltan_funciones: '🧩 Faltan funciones requeridas',
          precio_pago: '💸 Precio o métodos de pago',
          problemas_tecnicos: '🐛 Problemas técnicos o lentitud',
          otro: '💬 Otro motivo'
        };
        const reasonText = reasonLabels[meta.motivo] || meta.motivo || 'No especificado';
        const comment = meta.comentario || ch.message || 'Sin comentario';

        h += `
          <tr>
            <td style="font-size: 11px; color: var(--text-muted);">${dateStr}</td>
            <td style="font-weight: 700; font-size: 11.5px; color: var(--text-main);">${escapeHtml(ch.user_email || 'Anónimo')}</td>
            <td style="font-size: 11.5px; font-weight: 600; color: #dc2626;">${escapeHtml(reasonText)}</td>
            <td style="font-size: 11.5px; color: var(--text-main); line-height: 1.4;">${escapeHtml(comment)}</td>
          </tr>`;
      });
      churnBody.innerHTML = h;
    }
  }
}

async function markClaimAttended(codigo) {
  if (!codigo) return;
  const item = (masterReclamacionesData || []).find(r => r.codigo === codigo);
  if (item) item.estado = 'atendido';
  try {
    if (supabaseClient) {
      await supabaseClient.from('app_reclamaciones').update({ estado: 'atendido' }).eq('codigo', codigo).then(() => {}, () => {});
    }
    const localList = JSON.parse(localStorage.getItem('finanzas_reclamaciones_backup') || '[]');
    const localItem = localList.find(r => r.codigo === codigo);
    if (localItem) {
      localItem.estado = 'atendido';
      localStorage.setItem('finanzas_reclamaciones_backup', JSON.stringify(localList));
    }
  } catch (e) {}
  showToast('Reclamación ' + codigo + ' marcada como atendida ✅', 'success');
  renderMasterReclamos();
}

async function markRefundProcessed(idOrCod) {
  if (!idOrCod) return;
  const item = (masterRefundsData || []).find(r => (r.id === idOrCod || (r.metadata && r.metadata.codigo === idOrCod)));
  if (item && item.metadata) item.metadata.estado = 'procesado';
  try {
    if (supabaseClient && typeof idOrCod === 'string' && idOrCod.length > 20) {
      await supabaseClient.from('app_feedback').update({
        metadata: { ...(item ? item.metadata : {}), estado: 'procesado' }
      }).eq('id', idOrCod).then(() => {}, () => {});
    }
  } catch (e) {}
  showToast('Reembolso marcado como procesado ✅', 'success');
  renderMasterReclamos();
}

// ================================================================
// DERECHO AL OLVIDO Y ENCUESTA DE RETENCIÓN (LEY 29733 / v70.0)
// ================================================================
function openDeleteAccountModal() {
  if (typeof closeModal === 'function') closeModal('settingsModal');
  const modal = document.getElementById('deleteAccountFeedbackModal');
  if (modal) modal.style.display = 'flex';
  const inp = document.getElementById('confirmDeleteInput');
  if (inp) inp.value = '';
}

function closeDeleteAccountModal() {
  const modal = document.getElementById('deleteAccountFeedbackModal');
  if (modal) modal.style.display = 'none';
}

async function handleConfirmDeleteAccountSubmit(event) {
  event.preventDefault();
  const inp = document.getElementById('confirmDeleteInput');
  if (!inp || inp.value.trim() !== 'ELIMINAR') {
    showToast('Debes escribir exactamente "ELIMINAR" en mayúsculas para continuar', 'error');
    return;
  }

  const reasonEl = document.querySelector('input[name="churnReason"]:checked');
  const churnReason = reasonEl ? reasonEl.value : 'no_especificado';
  const churnFeedback = document.getElementById('churnFeedbackText')?.value || '';
  const email = (currentUser && currentUser.email) || 'usuario';

  const btn = document.getElementById('btnConfirmDeleteAccount');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Purgando datos... ⏳';
  }

  try {
    // 1. Guardar feedback de salida (churn analytics) en telemetría para el Founder
    if (supabaseClient) {
      await supabaseClient.from('app_feedback').insert([{
        user_id: currentUser ? currentUser.id : null,
        user_email: email,
        type: 'account_deletion_churn',
        message: `BAJA: Motivo: [${churnReason}] | Feedback: ${churnFeedback}`,
        metadata: {
          motivo: churnReason,
          comentario: churnFeedback,
          fecha: new Date().toISOString()
        },
        created_at: new Date().toISOString()
      }]).then(() => {}, () => {});
    }

    // 2. Borrar datos financieros en finanzas_state
    if (currentUser && currentUser.id) {
      await supabaseClient
        .from('finanzas_state')
        .delete()
        .eq('id', 'state_' + currentUser.id)
        .then(() => {}, () => {});
    }

    // 3. Borrar suscripción en user_subscriptions
    if (currentUser && currentUser.id) {
      await supabaseClient
        .from('user_subscriptions')
        .delete()
        .eq('user_id', currentUser.id)
        .then(() => {}, () => {});
    }

    // 4. Limpiar almacenamiento local
    localStorage.clear();

    // 5. Cerrar sesión
    if (supabaseClient) {
      await supabaseClient.auth.signOut().catch(() => {});
    }

    await uiAlert('✅ Tu cuenta y datos personales han sido purgados conforme a la Ley N° 29733. Gracias por habernos probado.');
    window.location.reload();
  } catch (err) {
    console.error('Error al suprimir datos:', err);
    showToast('Error al procesar: ' + (err.message || err), 'error');
    if (btn) {
      btn.disabled = false;
      btn.textContent = '🗑️ Confirmar Eliminación Irreversible (Ley 29733)';
    }
  }
}

// ================================================================
// SOLICITUD DE DEVOLUCIÓN (GARANTÍA 7 DÍAS v70.0)
// ================================================================
function openSolicitarReembolsoModal() {
  const modal = document.getElementById('solicitarReembolsoModal');
  if (modal) {
    modal.style.display = 'flex';
    const emailInp = document.getElementById('reembolsoEmail');
    if (emailInp && currentUser && currentUser.email) {
      emailInp.value = currentUser.email;
    }
  }
}

function closeSolicitarReembolsoModal() {
  const modal = document.getElementById('solicitarReembolsoModal');
  if (modal) modal.style.display = 'none';
}

async function handleSolicitudReembolsoSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('reembolsoEmail')?.value?.trim();
  const tel = document.getElementById('reembolsoTelefono')?.value?.trim();
  const plan = document.getElementById('reembolsoPlan')?.value;
  const motivo = document.getElementById('reembolsoMotivo')?.value?.trim();

  if (!email || !tel || !motivo) {
    showToast('Por favor completa todos los campos requeridos', 'error');
    return;
  }

  const btn = document.getElementById('btnSubmitReembolso');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Enviando solicitud... ⏳';
  }

  const cod = 'REF-' + Date.now().toString(36).toUpperCase();
  const nowIso = new Date().toISOString();
  const refundPayload = {
    codigo: cod,
    user_id: currentUser ? currentUser.id : null,
    user_email: email,
    telefono: tel,
    plan: plan,
    motivo: motivo,
    estado: 'pendiente',
    created_at: nowIso
  };

  try {
    if (supabaseClient) {
      await supabaseClient.from('app_feedback').insert([{
        user_id: currentUser ? currentUser.id : null,
        user_email: email,
        type: 'solicitud_reembolso',
        message: `[${cod}] SOLICITUD DE DEVOLUCIÓN: Plan ${plan} | Tel: ${tel} | Motivo: ${motivo}`,
        metadata: refundPayload,
        created_at: nowIso
      }]);
    }

    // Respaldo local
    try {
      const localRefunds = JSON.parse(localStorage.getItem('finanzas_reembolsos_backup') || '[]');
      localRefunds.push(refundPayload);
      localStorage.setItem('finanzas_reembolsos_backup', JSON.stringify(localRefunds));
    } catch (e) {}

    closeSolicitarReembolsoModal();
    showToast(`✅ Solicitud ${cod} recibida. Te contactaremos en menos de 24h.`, 'success');
  } catch (err) {
    console.error('Error registrando solicitud de reembolso:', err);
    showToast('Error al enviar la solicitud: ' + (err.message || err), 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = '✉️ Enviar Solicitud de Devolución';
    }
  }
}

window.renderMasterReclamos = renderMasterReclamos;
window.markClaimAttended = markClaimAttended;
window.markRefundProcessed = markRefundProcessed;
window.openDeleteAccountModal = openDeleteAccountModal;
window.closeDeleteAccountModal = closeDeleteAccountModal;
window.handleConfirmDeleteAccountSubmit = handleConfirmDeleteAccountSubmit;
window.openSolicitarReembolsoModal = openSolicitarReembolsoModal;
window.closeSolicitarReembolsoModal = closeSolicitarReembolsoModal;
window.handleSolicitudReembolsoSubmit = handleSolicitudReembolsoSubmit;
window.promptUserAccountDeletion = openDeleteAccountModal;

// ================================================================
// CAMPAÑAS WIN-BACK ANTI-CHURN (MASTER ADMIN v69.5)
// ================================================================
let currentWinBackEmail = '';
let currentWinBackName = '';

function openWinBackModal(email, name, daysInactive) {
  currentWinBackEmail = email || '';
  currentWinBackName = name || 'amigo';
  const cleanFirst = currentWinBackName.split(' ')[0];
  const curMonth = (appState && appState.currentMonth) || 'este mes';
  const timeText = daysInactive > 1 ? `hace ${daysInactive} días` : 'hace unos días';

  const defaultMsg = `¡Hola ${cleanFirst}! 👋 Te escribe César de AliviaFin.\n\nNotamos que no ingresas a la app ${timeText} y queremos que tus finanzas de ${curMonth} queden 100% al día y sin estrés.\n\n¿Tuviste alguna duda con tus gastos o te gustaría probar alguna función en especial? ¡Aquí estoy para apoyarte directamente! 🚀\n\n👉 Accede directo a: https://aliviafin.vercel.app`;

  const recipEl = document.getElementById('winBackRecipient');
  const txtEl = document.getElementById('winBackTextarea');
  if (recipEl) recipEl.textContent = `${currentWinBackName} (${email})`;
  if (txtEl) txtEl.value = defaultMsg;

  openModalById('winBackModal');
}

function sendWinBackViaWhatsApp() {
  const txt = document.getElementById('winBackTextarea')?.value || '';
  const url = 'https://wa.me/?text=' + encodeURIComponent(txt);
  window.open(url, '_blank');
}

function copyWinBackMessage() {
  const txt = document.getElementById('winBackTextarea')?.value || '';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(txt).then(() => {
      showToast('📋 Mensaje Win-Back copiado al portapapeles', 'success');
    }).catch(() => {
      fallbackCopyText(txt);
    });
  } else {
    fallbackCopyText(txt);
  }
}

function fallbackCopyText(txt) {
  const ta = document.createElement('textarea');
  ta.value = txt;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  showToast('📋 Mensaje copiado al portapapeles', 'success');
}

function sendWinBackViaEmail() {
  const txt = document.getElementById('winBackTextarea')?.value || '';
  const subj = '¿Cómo van tus finanzas este mes? - AliviaFin';
  const url = `mailto:${encodeURIComponent(currentWinBackEmail)}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(txt)}`;
  window.location.href = url;
}

// ================================================================
// ACCIONES EJECUTIVAS WHATSAPP & SUSCRIPCIONES (HUB DE FUNDADOR v75.2)
// ================================================================
function openExecutiveWhatsAppAction(type, email, name, detail) {
  currentWinBackEmail = email || '';
  currentWinBackName = name || 'amigo';
  const cleanFirst = currentWinBackName.split(' ')[0];
  const curMonth = (appState && appState.currentMonth) || 'este mes';

  let msg = '';
  if (type === 'collection') {
    msg = `¡Hola ${cleanFirst}! 👋 Te saluda César de AliviaFin.\n\nTe escribo con un recordatorio cordial de que tu suscripción PRO mensual venció ${detail ? 'el ' + detail : 'hace unos días'}.\n\nPara renovarla por 30 días más y seguir disfrutando del Simulador de Cuotas, Bola de Nieve y finanzas al día en ${curMonth}, puedes transferir S/ 4.90 por Yape o Plin al:\n📱 914 688 135 (César Risso)\n\nUna vez transferido me confirmas por aquí y te reactivo al instante. ¡Muchas gracias! 🚀`;
  } else if (type === 'promo') {
    msg = `¡Hola ${cleanFirst}! 👋 Te saluda César de AliviaFin.\n\nNoté que estás usando activamente la versión gratuita de la app y quería ofrecerte una promo especial exclusiva:\n\n🔥 Plan Anual PRO por S/ 29.90 al año (acceso completo a todas las herramientas premium).\n\nIncluye Bola de Nieve automática, proyección de compras en cuotas y respaldos automáticos.\n\nPuedes activarlo vía Yape o Plin. ¿Te gustaría aprovecharla? ¡Quedo atento!`;
  } else {
    msg = `¡Hola ${cleanFirst}! 👋 Te escribe César de AliviaFin.\n\nNotamos que no ingresas a la app hace unos días y queremos que tus finanzas de ${curMonth} queden 100% al día y sin estrés.\n\n¿Tuviste alguna duda con tus gastos o te gustaría probar alguna función en especial? ¡Aquí estoy para apoyarte directamente! 🚀\n\n👉 Accede directo a: https://aliviafin.vercel.app`;
  }

  const recipEl = document.getElementById('winBackRecipient');
  const txtEl = document.getElementById('winBackTextarea');
  if (recipEl) recipEl.textContent = `${currentWinBackName} (${email})`;
  if (txtEl) txtEl.value = msg;

  openModalById('winBackModal');
}

function openManualSubModal() {
  const emailInput = document.getElementById('modalManualEmail');
  if (emailInput) emailInput.value = '';
  openModalById('manualSubModal');
}

async function handleManualSubModalSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const email = (document.getElementById('modalManualEmail')?.value || '').trim().toLowerCase();
  const plan = document.getElementById('modalManualPlan')?.value || 'pro_lifetime';
  const method = document.getElementById('modalManualMethod')?.value || 'yape';

  if (!email) {
    showToast('Ingresa un correo electrónico', 'error');
    return;
  }

  const btn = document.getElementById('modalManualSubmitBtn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ Activando…';
  }

  try {
    await setMasterUserPlan(null, email, plan);
    closeModal('manualSubModal');
    showToast(`✅ Suscripción (${plan}) activada para ${email} vía ${method.toUpperCase()}`, 'success');
  } catch (err) {
    showToast('Error al activar suscripción: ' + (err.message || err), 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = '✓ Activar Suscripción';
    }
  }
}

function openMasterUserActionsModal(uid, email, name, plan) {
  const modal = document.getElementById('masterUserActionsModal');
  const nameEl = document.getElementById('userActionsModalName');
  const emailEl = document.getElementById('userActionsModalEmail');
  const cont = document.getElementById('userActionsButtonsContainer');
  if (!modal || !cont) return;

  if (nameEl) nameEl.textContent = name || 'Usuario';
  if (emailEl) emailEl.textContent = email;

  const isLife = plan === 'life' || plan === 'founder';
  const isMonth = plan === 'month';
  const uidJs = escapeJsAttrArg(uid);
  const emJs = escapeJsAttrArg(email);
  const nameJs = escapeJsAttrArg(name || 'Usuario');

  let btns = '';
  btns += `<button type="button" class="btn btn-secondary" onclick="renewMasterUser30Days(${uidJs}, ${emJs}); closeModal('masterUserActionsModal');" style="width: 100%; justify-content: flex-start; padding: 12px 16px; font-weight: 800; font-size: 13px; border-radius: 12px; text-align: left; background: #ffffff !important; border: 1.5px solid #cbd5e1 !important; color: #0f172a !important; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">⚡ Renovar o Extender +30 Días (S/ 4.90)</button>`;
  if (!isLife) {
    btns += `<button type="button" class="btn btn-secondary" onclick="setMasterUserPlan(${uidJs}, ${emJs}, 'pro_lifetime'); closeModal('masterUserActionsModal');" style="width: 100%; justify-content: flex-start; padding: 12px 16px; font-weight: 800; font-size: 13px; border-radius: 12px; text-align: left; background: #fffbeb !important; border: 1.5px solid #fde68a !important; color: #b45309 !important; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">👑 Activar Plan Anual PRO (S/ 29.90)</button>`;
  }
  if (!isMonth) {
    btns += `<button type="button" class="btn btn-secondary" onclick="setMasterUserPlan(${uidJs}, ${emJs}, 'pro_monthly'); closeModal('masterUserActionsModal');" style="width: 100%; justify-content: flex-start; padding: 12px 16px; font-weight: 800; font-size: 13px; border-radius: 12px; text-align: left; background: #ffffff !important; border: 1.5px solid #cbd5e1 !important; color: #0f172a !important; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">📅 Activar PRO Mensual (S/ 4.90)</button>`;
  }
  if (isLife || isMonth) {
    btns += `<button type="button" class="btn btn-secondary" onclick="setMasterUserPlan(${uidJs}, ${emJs}, 'free'); closeModal('masterUserActionsModal');" style="width: 100%; justify-content: flex-start; padding: 12px 16px; font-weight: 800; font-size: 13px; border-radius: 12px; text-align: left; background: #ffffff !important; border: 1.5px solid #cbd5e1 !important; color: #475569 !important; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">⚪ Bajar a Plan Gratuito (Revocar PRO)</button>`;
  }
  btns += `<button type="button" class="btn btn-secondary" onclick="promptEditUserNickname(${emJs}); closeModal('masterUserActionsModal');" style="width: 100%; justify-content: flex-start; padding: 12px 16px; font-weight: 800; font-size: 13px; border-radius: 12px; text-align: left; background: #ffffff !important; border: 1.5px solid #cbd5e1 !important; color: #0f172a !important; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">✏️ Editar Nombre o Apodo</button>`;
  btns += `<button type="button" class="btn btn-secondary" onclick="confirmDeleteMasterUser(${uidJs}, ${emJs}, ${nameJs}); closeModal('masterUserActionsModal');" style="width: 100%; justify-content: flex-start; padding: 12px 16px; font-weight: 800; font-size: 13px; border-radius: 12px; text-align: left; color: #dc2626 !important; background: #fef2f2 !important; border: 1.5px solid #fca5a5 !important; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">🗑️ Eliminar Usuario Permanentemente</button>`;

  cont.innerHTML = btns;
  openModalById('masterUserActionsModal');
}

// ================================================================
// NOTIFICACIONES PWA / RECORDATORIO DE CIERRE DE MES (v69.5)
// ================================================================
function toggleMonthEndNotification(enabled) {
  try {
    localStorage.setItem('aliviafin_notif_enabled', enabled ? 'true' : 'false');
    if (enabled && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showToast('🔔 Recordatorios de cierre de mes activados', 'success');
          try {
            new Notification('AliviaFin 🔔', {
              body: '¡Listo! Te avisaremos al final de cada mes para que tus finanzas queden al día.',
              icon: 'logo.png'
            });
          } catch (e) {}
        } else {
          showToast('Permiso de notificaciones no otorgado en el navegador', 'warning');
          const toggle = document.getElementById('settingsNotifToggle');
          if (toggle) toggle.checked = false;
          localStorage.setItem('aliviafin_notif_enabled', 'false');
        }
      });
    } else {
      showToast('Recordatorios de cierre de mes desactivados', 'info');
    }
  } catch (e) {
    console.warn('Error configurando notificaciones:', e);
  }
}

function checkMonthEndNotification() {
  try {
    const isEnabled = localStorage.getItem('aliviafin_notif_enabled') === 'true';
    if (!isEnabled || !('Notification' in window) || Notification.permission !== 'granted') return;

    const today = new Date();
    const day = today.getDate();
    // Activar entre los días 26 y 31
    if (day < 26) return;

    const curMonthKey = today.getFullYear() + '-' + (today.getMonth() + 1);
    const lastNotif = localStorage.getItem('aliviafin_last_month_end_notif');
    if (lastNotif === curMonthKey) return; // ya notificado este mes

    new Notification('AliviaFin · Cierre de Mes 📅', {
      body: 'Recuerda registrar tus últimos gastos y conciliar tus cuentas para cerrar el mes tranquilo.',
      icon: 'logo.png'
    });
    localStorage.setItem('aliviafin_last_month_end_notif', curMonthKey);
  } catch (e) {}
}

// Master Dashboard Window Exports
window.openMasterDashboardModal = openMasterDashboardModal;
window.switchMasterTab = switchMasterTab;
window.loadMasterDashboardData = loadMasterDashboardData;
window.setMasterFilter = setMasterFilter;
window.filterMasterSubscribers = filterMasterSubscribers;
window.setMasterUserPlan = setMasterUserPlan;
window.renewMasterUser30Days = renewMasterUser30Days;
window.handleMasterManualActivate = handleMasterManualActivate;
window.selectProModalPlan = selectProModalPlan;
window.copyYapePhone = copyYapePhone;
window.copyYapeNumber = copyYapePhone;
window.dismissProRenewalBanner = dismissProRenewalBanner;
window.checkAndRenderProRenewalBanner = checkAndRenderProRenewalBanner;
window.syncAdminUI = syncAdminUI;
window.promptEditUserNickname = promptEditUserNickname;
window.confirmDeleteMasterUser = confirmDeleteMasterUser;
window.promptUserAccountDeletion = promptUserAccountDeletion;
window.copyFounderSetupSQL = copyFounderSetupSQL;
window.openSupabaseSQLEditor = openSupabaseSQLEditor;
window.dismissFounderSetup = dismissFounderSetup;
window.openWinBackModal = openWinBackModal;
window.sendWinBackViaWhatsApp = sendWinBackViaWhatsApp;
window.copyWinBackMessage = copyWinBackMessage;
window.sendWinBackViaEmail = sendWinBackViaEmail;
window.toggleMonthEndNotification = toggleMonthEndNotification;
window.checkMonthEndNotification = checkMonthEndNotification;
window.updateAllProBadgesAndBanners = updateAllProBadgesAndBanners;
window.getSubscriptionDetails = getSubscriptionDetails;
window.openExecutiveWhatsAppAction = openExecutiveWhatsAppAction;
window.openManualSubModal = openManualSubModal;
window.handleManualSubModalSubmit = handleManualSubModalSubmit;
window.openMasterUserActionsModal = openMasterUserActionsModal;

// Tutorial de Instalación PWA (iOS & Android)
function openInstallTutorialModal() {
  const isAndroid = /android/i.test(navigator.userAgent || '');
  switchInstallTab(isAndroid ? 'android' : 'ios');
  openModalById('installTutorialModal');
}

function switchInstallTab(os) {
  const iosPane = document.getElementById('installPaneIos');
  const andPane = document.getElementById('installPaneAndroid');
  const iosBtn = document.getElementById('tabInstallIosBtn');
  const andBtn = document.getElementById('tabInstallAndroidBtn');

  if (os === 'ios') {
    if (iosPane) iosPane.style.display = 'block';
    if (andPane) andPane.style.display = 'none';
    if (iosBtn) {
      iosBtn.style.background = '#ffffff';
      iosBtn.style.color = '#0f172a';
      iosBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
    }
    if (andBtn) {
      andBtn.style.background = 'transparent';
      andBtn.style.color = '#64748b';
      andBtn.style.boxShadow = 'none';
    }
  } else {
    if (iosPane) iosPane.style.display = 'none';
    if (andPane) andPane.style.display = 'block';
    if (andBtn) {
      andBtn.style.background = '#ffffff';
      andBtn.style.color = '#0f172a';
      andBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
    }
    if (iosBtn) {
      iosBtn.style.background = 'transparent';
      iosBtn.style.color = '#64748b';
      iosBtn.style.boxShadow = 'none';
    }
  }
}

window.openInstallTutorialModal = openInstallTutorialModal;
window.switchInstallTab = switchInstallTab;
