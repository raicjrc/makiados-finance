
    // INITIAL_TRANSACTIONS removido — código legado no utilizado, contenía datos personales del admin.
    // Los datos históricos del admin viven exclusivamente en Supabase.

    // Categorías GENÉRICAS para cualquier usuario nuevo (no contienen datos personales)
    const GENERIC_CATEGORIES = {
      'Vivienda': { icon: '🏠', badgeClass: 'badge-vivienda', color: '#4f46e5', budget: 1500 },
      'Alimentación': { icon: '🍽️', badgeClass: 'badge-alimentacion', color: '#f59e0b', budget: 800 },
      'Transporte': { icon: '🚌', badgeClass: 'badge-transporte', color: '#ef4444', budget: 400 },
      'Servicios': { icon: '⚡', badgeClass: 'badge-servicios', color: '#0284c7', budget: 300 },
      'Salud': { icon: '🏥', badgeClass: 'badge-salud', color: '#059669', budget: 200 },
      'Educación': { icon: '🎓', badgeClass: 'badge-educacion', color: '#2563eb', budget: 500 },
      'Entretenimiento': { icon: '🎬', badgeClass: 'badge-entretenimiento', color: '#db2777', budget: 200 },
      'Suscripciones': { icon: '📺', badgeClass: 'badge-suscripciones', color: '#8b5cf6', budget: 150 },
      'Celular': { icon: '📱', badgeClass: 'badge-celular', color: '#0d9488', budget: 100 },
      'Ahorro': { icon: '🐖', badgeClass: 'badge-ahorro', color: '#10b981', budget: 500 },
      'Otros': { icon: '📦', badgeClass: 'badge-otros', color: '#64748b', budget: 300 }
    };

    // Categorías específicas del ADMIN (César) — solo se cargan para su cuenta
    const CESAR_CATEGORIES = {
      'Casa': { icon: '🏠', badgeClass: 'badge-casa', color: '#4f46e5', budget: 1500 },
      'Comida casa': { icon: '🍲', badgeClass: 'badge-comida-casa', color: '#f59e0b', budget: 900 },
      'Comida gatitos calle': { icon: '🐈‍⬛', badgeClass: 'badge-comida-gatitos-calle', color: '#ea580c', budget: 150 },
      'Comida gatitos casa': { icon: '🐱', badgeClass: 'badge-comida-gatitos-casa', color: '#8b5cf6', budget: 200 },
      'Arena gatitos casa': { icon: '🐾', badgeClass: 'badge-arena-gatitos-casa', color: '#c026d3', budget: 80 },
      'Carro': { icon: '🚗', badgeClass: 'badge-carro', color: '#ef4444', budget: 1700 },
      'Suscripciones': { icon: '📺', badgeClass: 'badge-suscripciones', color: '#db2777', budget: 250 },
      'UTP': { icon: '🎓', badgeClass: 'badge-utp', color: '#2563eb', budget: 668 },
      'Tarjetas': { icon: '💳', badgeClass: 'badge-tarjetas', color: '#dc2626', budget: 1200 },
      'Internet': { icon: '🌐', badgeClass: 'badge-internet', color: '#0891b2', budget: 100 },
      'Servicios': { icon: '⚡', badgeClass: 'badge-servicios', color: '#0284c7', budget: 180 },
      'Celulares': { icon: '📱', badgeClass: 'badge-celulares', color: '#0d9488', budget: 130 },
      'Papá': { icon: '👴', badgeClass: 'badge-papa', color: '#ca8a04', budget: 350 },
      'Mapfre': { icon: '🏥', badgeClass: 'badge-mapfre', color: '#059669', budget: 80 },
      'Gimnasio & Salud': { icon: '🏋️', badgeClass: 'badge-gimnasio-salud', color: '#10b981', budget: 350 },
      'Viajes': { icon: '✈️', badgeClass: 'badge-viajes', color: '#6366f1', budget: 450 },
      'Otros': { icon: '📦', badgeClass: 'badge-otros', color: '#64748b', budget: 500 }
    };

    // Helper de escape HTML contra inyecciones XSS (estándar OWASP)
    function escapeHtml(str) {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
    window.escapeHtml = escapeHtml;

    // Helper: identifica si el usuario es el administrador César
    function isAdminCesar(userOrEmail) {
      const u = userOrEmail || currentUser;
      if (!u) return false;
      const email = typeof u === 'string' ? u : (u.email || '');
      return email.trim().toLowerCase() === 'cesar.risso.f@gmail.com';
    }

    // Helper: devuelve las categorías correctas según el usuario actual
    function getUserDefaultCategories() {
      return isAdminCesar() ? CESAR_CATEGORIES : GENERIC_CATEGORIES;
    }


    const DEFAULT_CATEGORIES = {
      'Casa': { icon: '🏠', badgeClass: 'badge-casa', color: '#4f46e5', budget: 1500 },
      'Comida casa': { icon: '🍲', badgeClass: 'badge-comida-casa', color: '#f59e0b', budget: 900 },
      'Comida gatitos calle': { icon: '🐈‍⬛', badgeClass: 'badge-comida-gatitos-calle', color: '#ea580c', budget: 150 },
      'Comida gatitos casa': { icon: '🐱', badgeClass: 'badge-comida-gatitos-casa', color: '#8b5cf6', budget: 200 },
      'Arena gatitos casa': { icon: '🐾', badgeClass: 'badge-arena-gatitos-casa', color: '#c026d3', budget: 80 },
      'Carro': { icon: '🚗', badgeClass: 'badge-carro', color: '#ef4444', budget: 1700 },
      'Suscripciones': { icon: '📺', badgeClass: 'badge-suscripciones', color: '#db2777', budget: 250 },
      'UTP': { icon: '🎓', badgeClass: 'badge-utp', color: '#2563eb', budget: 668 },
      'Tarjetas': { icon: '💳', badgeClass: 'badge-tarjetas', color: '#dc2626', budget: 1200 },
      'Internet': { icon: '🌐', badgeClass: 'badge-internet', color: '#0891b2', budget: 100 },
      'Servicios': { icon: '⚡', badgeClass: 'badge-servicios', color: '#0284c7', budget: 180 },
      'Celulares': { icon: '📱', badgeClass: 'badge-celulares', color: '#0d9488', budget: 130 },
      'Papá': { icon: '👴', badgeClass: 'badge-papa', color: '#ca8a04', budget: 350 },
      'Mapfre': { icon: '🏥', badgeClass: 'badge-mapfre', color: '#059669', budget: 80 },
      'Gimnasio & Salud': { icon: '🏋️', badgeClass: 'badge-gimnasio-salud', color: '#10b981', budget: 350 },
      'Viajes': { icon: '✈️', badgeClass: 'badge-viajes', color: '#6366f1', budget: 450 },
      'Otros': { icon: '📦', badgeClass: 'badge-otros', color: '#64748b', budget: 500 }
    };

    let CATEGORIES = { ...GENERIC_CATEGORIES };

    // ================================================================
    // VERSIÓN DE LA APP & MOTOR MULTI-MONEDA INTERNACIONAL (v71.8)
    // ================================================================
    const APP_VERSION = 'v71.8';

    // ================================================================
    // CONFIGURACIÓN DE SUPABASE Y CLIENTE DE AUTENTICACIÓN
    // ================================================================
    const SUPABASE_URL = 'https://swwvbfemxookbqoqotre.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_CZUC5ueCxjSDFeA3idgVZg_DaEoIJxf';
    let supabaseClient = null;

    function getSupabaseClient() {
      if (!supabaseClient) {
        try {
          const sb = (typeof window !== 'undefined' && window.supabase) ||
                     (typeof supabase !== 'undefined' ? supabase : null) ||
                     (typeof globalThis !== 'undefined' && globalThis.supabase);
          if (sb && typeof sb.createClient === 'function') {
            supabaseClient = sb.createClient(SUPABASE_URL, SUPABASE_KEY);
          }
        } catch (e) {
          console.error('Error al inicializar Supabase Client:', e);
        }
      }
      return supabaseClient;
    }
    // Inicialización inmediata y robusta
    supabaseClient = getSupabaseClient();

    const SUPPORTED_CURRENCIES = {
      'PEN': { code: 'PEN', symbol: 'S/', name: 'Soles peruanos', flag: '🇵🇪', locale: 'es-PE' },
      'USD': { code: 'USD', symbol: '$', name: 'Dólares estadounidenses', flag: '🇺🇸', locale: 'en-US' }
    };

    function getActiveCurrency() {
      const savedCode = (typeof localStorage !== 'undefined' && localStorage.getItem('aliviafin_currency')) || 
                        (typeof appState !== 'undefined' && appState && appState.currency) || 'PEN';
      return SUPPORTED_CURRENCIES[savedCode] || SUPPORTED_CURRENCIES['PEN'];
    }

    function getCurrencySymbol() {
      return getActiveCurrency().symbol;
    }

    function getCurrencyCode() {
      return getActiveCurrency().code;
    }

    function updateCurrencyDOMElements() {
      const sym = getCurrencySymbol();
      const code = getCurrencyCode();
      document.querySelectorAll('.app-currency-symbol').forEach(el => {
        el.textContent = sym;
      });
      const sel = document.getElementById('settingCurrencySelect');
      if (sel && sel.value !== code) {
        sel.value = code;
      }
      if (typeof isPrivacyModeActive === 'function' && typeof syncPrivacyUI === 'function') {
        syncPrivacyUI(isPrivacyModeActive());
      }
    }

    function changeCurrency(code) {
      if (!SUPPORTED_CURRENCIES[code]) return;
      localStorage.setItem('aliviafin_currency', code);
      if (typeof appState !== 'undefined' && appState) {
        appState.currency = code;
        if (typeof saveData === 'function') saveData();
      }
      updateCurrencyDOMElements();
      if (typeof renderAll === 'function') renderAll();
      if (typeof updateSimulation === 'function') updateSimulation();
      showToast(`Moneda cambiada a ${SUPPORTED_CURRENCIES[code].flag} ${SUPPORTED_CURRENCIES[code].name} (${SUPPORTED_CURRENCIES[code].symbol})`, 'success');
    }

    // Plantilla inicial 100% limpia para cualquier usuario nuevo
    function getCleanUserState() {
      const now = new Date();
      const monthsEs = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      const curM = monthsEs[now.getMonth()] + ' ' + now.getFullYear();
      // Usar categorías genéricas para usuarios nuevos (nunca las personales del admin)
      const cats = GENERIC_CATEGORIES;
      const initialBudgets = {};
      Object.keys(cats).forEach(k => {
        initialBudgets[k] = cats[k].budget || 1000;
      });
      return {
        salary: 0,
        currency: (typeof localStorage !== 'undefined' && localStorage.getItem('aliviafin_currency')) || 'PEN',
        incomes: {
          [curM]: []
        },
        extraIncomes: {
          [curM]: []
        },
        transactions: {
          [curM]: []
        },
        categoryBudgets: initialBudgets,
        savingsGoals: [],
        recurringDueDates: {},
        checklists: {},
        auditLog: [],
        currentMonth: curM,
        activeCategoryChip: 'TODAS',
        activeStatusFilter: 'TODOS',
        historyPeriodFilter: 'ALL',
        _lastSaved: 0
      };
    }

    // Detector de datos heredados por error de la plantilla personal
    function isLegacyClonedState(state) {
      if (!state) return false;
      if (state.salary === 8800 && state.recurringDueDates && state.recurringDueDates['alquiler']) return true;
      if (state.transactions && state.transactions['Octubre'] && Array.isArray(state.transactions['Octubre']) && state.transactions['Octubre'].some(t => t.name === 'Casa' && t.amount === 750)) return true;
      if (state.transactions && state.transactions['Septiembre 2026'] && Array.isArray(state.transactions['Septiembre 2026']) && state.transactions['Septiembre 2026'].some(t => t.name === 'Sheldon')) return true;
      return false;
    }

    let appState = getCleanUserState();

    let currentCategoryFilter = 'TODAS';
    let currentStatusFilter = 'TODOS';
    let currentHistoryPeriodFilter = 'ALL';
    let lastKnownServerDataHash = '';

    // Usuario actual (se setea al hacer login con Supabase Auth)
    let currentUser = null; // objeto { id, email, name }

    // STORAGE_KEY dinámico por usuario (evita mezclar datos de sesiones locales)
    function getStorageKey() {
      return currentUser ? `finanzas_v50_${currentUser.id}` : 'finanzas_v50_guest';
    }

    // ID del row en Supabase para este usuario
    function getUserStateId() {
      return currentUser ? `state_${currentUser.id}` : 'state_guest';
    }

    // ================================================================
    // AUTENTICACIÓN v50 — SUPABASE AUTH
    // ================================================================

    // Alterna entre tab Login y tab Registro
    function switchAuthTab(tab) {
      const loginForm = document.getElementById('loginForm');
      const registerForm = document.getElementById('registerForm');
      const loginBtn = document.getElementById('tabLoginBtn');
      const registerBtn = document.getElementById('tabRegisterBtn');
      if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginBtn.style.background = '#059669';
        loginBtn.style.color = 'white';
        loginBtn.style.boxShadow = '0 2px 6px rgba(5,150,105,0.3)';
        registerBtn.style.background = 'transparent';
        registerBtn.style.color = '#6b7280';
        registerBtn.style.boxShadow = 'none';
      } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        registerBtn.style.background = '#059669';
        registerBtn.style.color = 'white';
        registerBtn.style.boxShadow = '0 2px 6px rgba(5,150,105,0.3)';
        loginBtn.style.background = 'transparent';
        loginBtn.style.color = '#6b7280';
        loginBtn.style.boxShadow = 'none';
      }
    }

    // Muestra/oculta contraseña en los inputs del login/registro
    function togglePasswordVisibility(inputId, btnId) {
      const passInput = document.getElementById(inputId);
      const btn = document.getElementById(btnId);
      if (!passInput) return;
      if (passInput.type === 'password') {
        passInput.type = 'text';
        if (btn) btn.textContent = '🙈';
      } else {
        passInput.type = 'password';
        if (btn) btn.textContent = '👁️';
      }
    }

    // Verifica si hay sesión activa de Supabase al cargar la app
    async function checkLoginStatus() {
      // Detección de enlace de recuperación de contraseña desde correo
      if (window.location.hash.includes('type=recovery') || window.location.search.includes('type=recovery')) {
        openResetPasswordModal();
        return;
      }

      let client = getSupabaseClient();
      if (!client) {
        await new Promise(r => setTimeout(r, 100));
        client = getSupabaseClient();
      }
      if (!client) {
        console.warn('Supabase aún no inicializado en checkLoginStatus, mostrando login.');
        document.getElementById('loginModalScreen').style.display = 'flex';
        return;
      }

      // Listener global de cambios de autenticación (OAuth y Password Recovery)
      if (!window._hasConfiguredAuthListener) {
        window._hasConfiguredAuthListener = true;
        client.auth.onAuthStateChange(async (event, session) => {
          if (event === 'PASSWORD_RECOVERY') {
            openResetPasswordModal();
          } else if (event === 'SIGNED_IN' && session && session.user && !currentUser) {
            await onLoginSuccess(session.user);
          }
        });
      }

      // Soporte para depuración / vista previa local (?debug_tour=1 o ?demo=1 o ?preview=1 o ?view_login=1)
      if (window.location.search.includes('view_login=1')) {
        document.getElementById('loginModalScreen').style.display = 'flex';
        document.getElementById('appMainWrapper').style.display = 'none';
        return;
      }

      if (window.location.search.includes('debug_tour=1') || window.location.search.includes('demo=1') || window.location.search.includes('preview=1')) {
        await onLoginSuccess({ id: 'test_user_tour', email: 'cesar.risso.f@gmail.com', user_metadata: { full_name: 'makiados' } });
        if (window.location.search.includes('debug_tour=1')) {
          setTimeout(() => startInteractiveTour(), 500);
        }
        return;
      }

      const { data: { session } } = await client.auth.getSession();
      if (session && session.user) {
        recordUserHeartbeat(session.user, true);
        await onLoginSuccess(session.user);
      } else {
        document.getElementById('loginModalScreen').style.display = 'flex';
        document.getElementById('appMainWrapper').style.display = 'none';
      }
    }

    // Se llama cuando el login/registro es exitoso
    async function onLoginSuccess(user) {
      const userKey = user.id;
      const isCesar = isAdminCesar(user);

      // Obtener nombre del usuario:
      // 1. Preferencia personalizada guardada en localStorage
      // 2. Si es César, mantener por defecto 'makiados'
      // 3. Metadata de Supabase (full_name)
      // 4. Prefijo del correo
      let customName = localStorage.getItem('aliviafin_custom_display_name_' + userKey)
                    || localStorage.getItem('aliviafin_custom_display_name');

      if (!customName && isCesar) {
        customName = 'makiados';
        localStorage.setItem('aliviafin_custom_display_name_' + userKey, 'makiados');
        localStorage.setItem('aliviafin_custom_display_name', 'makiados');
      }

      const displayName = customName
        || (user.user_metadata && user.user_metadata.full_name)
        || user.email.split('@')[0];

      currentUser = {
        id: user.id,
        email: user.email,
        name: displayName
      };

      // Disparar telemetría de conexión activa inmediatamente (sin depender de esperas de red)
      recordUserHeartbeat(user, true);

      const badge = document.getElementById('userBadgeText');
      if (badge) badge.textContent = displayName;
      const deskUser = document.getElementById('deskSidebarUser');
      if (deskUser) deskUser.textContent = displayName;

      document.getElementById('loginModalScreen').style.display = 'none';
      const mainWrap = document.getElementById('appMainWrapper');
      if (mainWrap) {
        mainWrap.style.display = '';
        mainWrap.classList.add('authenticated');
      }

      // Inicializar app con datos del usuario
      loadLocalState();
      populateMonthDropdown();
      renderCategoryChips();
      // Verificar suscripción de Paywall de inmediato en paralelo
      const subPromise = verifySubscription(user);
      renderAll();
      await loadStateFromServer(3);
      setupRealtimeSync();
      await subPromise;
      syncAdminUI();
      checkMonthEndNotification();
    }

    // Helper para pruebas y preview local
    window.testBypassLogin = async function(email = 'cesar.risso.f@gmail.com') {
      await onLoginSuccess({ id: 'local_test_user', email: email });
    };

    // ================================================================
    // SISTEMA DE MONETIZACIÓN FREEMIUM (FREE VS PRO CON CICLO DE 30 DÍAS & CORTESÍA 48H)
    // ================================================================
    function getSubscriptionDetails(options = {}) {
      // Determinar si estamos evaluando un ítem/suscriptor específico (ej. desde el Hub de Fundador)
      // o la sesión del usuario actual
      const isEvaluatingItem = options.status !== undefined || options.expires_at !== undefined || options.email !== undefined;
      const isFounder = isEvaluatingItem 
        ? (options.email ? isAdminCesar(options.email) : false)
        : isAdminCesar();

      if (isFounder) {
        return {
          status: 'lifetime',
          plan: 'founder',
          isPro: true,
          isExpired: false,
          inGrace: false,
          days: Infinity,
          hoursGrace: 0,
          expiresAt: null,
          label: '👑 Fundador PRO'
        };
      }

      // Si se pasa options, usar estrictamente los valores de options sin caer en los globales del usuario logueado
      const status = isEvaluatingItem 
        ? (options.status || 'free') 
        : (window._currentUserSubscriptionStatus || 'free');

      const expiresAt = isEvaluatingItem 
        ? (options.expires_at || null) 
        : (window._currentUserSubscriptionExpiresAt || null);

      if (status === 'pro_lifetime' || status === 'premium') {
        return {
          status: 'pro_lifetime',
          plan: 'life',
          isPro: true,
          isExpired: false,
          inGrace: false,
          days: Infinity,
          hoursGrace: 0,
          expiresAt: null,
          label: '👑 PRO Vitalicio'
        };
      }

      if (status === 'pro_monthly' || status === 'expired' || expiresAt) {
        if (!expiresAt) {
          // Si está en pro_monthly o expired pero NO tiene fecha registrada:
          // Es una suscripción mensual vencida / no renovada. NUNCA dar PRO infinito.
          return {
            status: 'expired',
            plan: 'month',
            isPro: false,
            isExpired: true,
            inGrace: false,
            days: -1,
            hoursGrace: 0,
            expiresAt: null,
            label: '🔴 PRO Vencido'
          };
        }

        const expMs = new Date(expiresAt).getTime();
        if (isNaN(expMs)) {
          return {
            status: 'expired',
            plan: 'month',
            isPro: false,
            isExpired: true,
            inGrace: false,
            days: -1,
            hoursGrace: 0,
            expiresAt: null,
            label: '🔴 PRO Vencido'
          };
        }

        const nowMs = Date.now();
        const diffMs = expMs - nowMs;
        const graceMs = 48 * 60 * 60 * 1000; // 48h de cortesía

        if (diffMs > 0) {
          const daysLeft = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
          return {
            status: 'pro_monthly',
            plan: 'month',
            isPro: true,
            isExpired: false,
            inGrace: false,
            days: daysLeft,
            hoursGrace: 0,
            expiresAt: expiresAt,
            label: `📅 PRO (${daysLeft}d)`
          };
        } else if (nowMs <= (expMs + graceMs)) {
          const hoursGrace = Math.max(0, Math.ceil((expMs + graceMs - nowMs) / (60 * 60 * 1000)));
          return {
            status: 'pro_monthly',
            plan: 'month',
            isPro: true,
            isExpired: false,
            inGrace: true,
            days: 0,
            hoursGrace: hoursGrace,
            expiresAt: expiresAt,
            label: `⏳ Cortesía (${hoursGrace}h)`
          };
        } else {
          const daysAgo = Math.max(1, Math.ceil((nowMs - expMs) / (24 * 60 * 60 * 1000)));
          return {
            status: 'expired',
            plan: 'month',
            isPro: false,
            isExpired: true,
            inGrace: false,
            days: -daysAgo,
            hoursGrace: 0,
            expiresAt: expiresAt,
            label: '🔴 PRO Vencido'
          };
        }
      }

      return {
        status: 'free',
        plan: 'free',
        isPro: false,
        isExpired: false,
        inGrace: false,
        days: 0,
        hoursGrace: 0,
        expiresAt: null,
        label: 'Gratuito'
      };
    }

    function isUserPro() {
      if (isAdminCesar()) return true;
      return getSubscriptionDetails().isPro;
    }

    function getSubscriptionDaysRemaining() {
      return getSubscriptionDetails();
    }

    function dismissProRenewalBanner() {
      try {
        sessionStorage.setItem('aliviafin_dismiss_renewal_banner', 'true');
      } catch(e) {}
      const banner = document.getElementById('proRenewalBanner');
      if (banner) {
        banner.style.opacity = '0';
        setTimeout(() => { banner.style.display = 'none'; }, 220);
      }
    }

    function checkAndRenderProRenewalBanner() {
      const banner = document.getElementById('proRenewalBanner');
      if (!banner) return;

      // César nunca ve banner de renovación
      if (isAdminCesar()) {
        banner.style.display = 'none';
        return;
      }

      const subInfo = getSubscriptionDaysRemaining();
      const isExpiredUser = subInfo.isExpired;

      try {
        if (!isExpiredUser && sessionStorage.getItem('aliviafin_dismiss_renewal_banner') === 'true') {
          banner.style.display = 'none';
          return;
        }
      } catch(e) {}

      const iconEl = document.getElementById('proRenewalBannerIcon');
      const titleEl = document.getElementById('proRenewalBannerTitle');
      const descEl = document.getElementById('proRenewalBannerDesc');
      const btnEl = document.getElementById('proRenewalBannerBtn');

      if (isExpiredUser) {
        banner.className = 'pro-renewal-banner banner-expired';
        banner.style.display = 'flex';
        banner.style.opacity = '1';
        banner.style.border = '1.5px solid rgba(239, 68, 68, 0.4)';
        banner.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.06))';
        if (iconEl) iconEl.textContent = '🔴';
        const dateStr = subInfo.expiresAt ? new Date(subInfo.expiresAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
        if (titleEl) {
          titleEl.innerHTML = `⚠️ <strong>Tu membresía PRO Mensual venció</strong>${dateStr ? ' el ' + dateStr : ''}`;
          titleEl.style.color = '#dc2626';
          titleEl.style.fontWeight = '800';
        }
        if (descEl) {
          descEl.textContent = 'Tus finanzas y registros siguen 100% seguros. Renueva con Yape o Plin por S/ 4.90 para reactivar tus funciones PRO sin límites.';
        }
        if (btnEl) {
          btnEl.textContent = '⚡ Renovar PRO con Yape / Plin (S/ 4.90)';
          btnEl.style.background = 'linear-gradient(135deg, #dc2626, #ef4444)';
          btnEl.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
          btnEl.onclick = () => openFinZenProModal('Renovación Mensual', 'pro_monthly');
        }
      } else if (subInfo.inGrace) {
        banner.className = 'pro-renewal-banner banner-grace';
        banner.style.display = 'flex';
        banner.style.opacity = '1';
        if (iconEl) iconEl.textContent = '⏳';
        const dateStr = subInfo.expiresAt ? new Date(subInfo.expiresAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }) : '';
        if (titleEl) titleEl.textContent = `Cortesía de 48h activa · ${subInfo.hoursGrace}h restantes`;
        if (descEl) descEl.textContent = `Tu mes venció el ${dateStr}. Tus finanzas están intactas. Renueva para continuar.`;
        if (btnEl) {
          btnEl.textContent = '⚡ Renovar ahora';
          btnEl.onclick = () => openFinZenProModal('Renovación Mensual', 'pro_monthly');
        }
      } else if (subInfo.status === 'pro_monthly' && subInfo.days <= 3) {
        banner.className = 'pro-renewal-banner banner-warning';
        banner.style.display = 'flex';
        banner.style.opacity = '1';
        if (iconEl) iconEl.textContent = '🟡';
        const dateStr = subInfo.expiresAt ? new Date(subInfo.expiresAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }) : '';
        if (titleEl) titleEl.textContent = `Tu suscripción PRO vence en ${subInfo.days === 1 ? '1 día' : subInfo.days + ' días'}${dateStr ? ' (' + dateStr + ')' : ''}`;
        if (descEl) descEl.textContent = 'Renueva con Yape o Plin para mantener tus funciones activas sin interrupciones.';
        if (btnEl) {
          btnEl.textContent = '⚡ Renovar (S/ 4.90)';
          btnEl.onclick = () => openFinZenProModal('Renovación Mensual', 'pro_monthly');
        }
      } else {
        banner.style.display = 'none';
      }
    }

    let currentSelectedProPlan = 'pro_monthly';

    function selectProModalPlan(plan) {
      currentSelectedProPlan = plan;
      const choiceMonthly = document.getElementById('proChoiceMonthly');
      const choiceLifetime = document.getElementById('proChoiceLifetime');
      if (choiceMonthly && choiceLifetime) {
        if (plan === 'pro_monthly') {
          choiceMonthly.classList.add('selected');
          choiceLifetime.classList.remove('selected');
        } else {
          choiceLifetime.classList.add('selected');
          choiceMonthly.classList.remove('selected');
        }
      }
      updateProModalWaLink();
    }

    function updateProModalWaLink() {
      const waLink = document.getElementById('proModalWaLink');
      if (!waLink) return;
      const userEmail = (currentUser && currentUser.email) ? currentUser.email : '';
      const planText = currentSelectedProPlan === 'pro_lifetime' 
        ? 'PRO Vitalicio (S/ 19.90 pago único)' 
        : 'PRO Mensual (S/ 4.90 / mes)';
      const msg = `Hola César, acabo de transferir a tu Yape para activar mi suscripción AliviaFin ${planText}.${userEmail ? ' Mi correo registrado es: ' + userEmail : ''}`;
      waLink.href = 'https://wa.me/51914688135?text=' + encodeURIComponent(msg);
    }

    function copyYapePhone(btnEl) {
      const phone = '914688135';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(phone);
      } else {
        try {
          const input = document.createElement('input');
          input.value = phone;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
        } catch(e) {}
      }
      if (navigator.vibrate) navigator.vibrate(35);
      showToast('📋 Número 914 688 135 copiado al portapapeles', 'success');

      const textEl = document.getElementById('copyYapeBtnText');
      const iconEl = document.getElementById('copyYapeBtnIcon');
      if (textEl) textEl.textContent = '¡Copiado!';
      if (iconEl) iconEl.textContent = '✓';
      setTimeout(() => {
        if (textEl) textEl.textContent = 'Copiar';
        if (iconEl) iconEl.textContent = '📋';
      }, 2200);
    }

    function openFinZenProModal(featureName, initialPlan) {
      if (initialPlan) {
        selectProModalPlan(initialPlan);
      } else {
        selectProModalPlan('pro_monthly');
      }

      const badge = document.getElementById('proModalContextBadge');
      const featText = document.getElementById('proModalFeatureName');
      const sub = document.getElementById('proModalSubtitle');

      if (featureName && featureName.toLowerCase().includes('renovación')) {
        if (badge) badge.style.display = 'none';
        if (sub) sub.textContent = 'Renueva tu mes para seguir disfrutando de todas las ventajas exclusivas';
      } else if (featureName && badge && featText) {
        badge.style.display = 'inline-flex';
        featText.textContent = featureName;
        if (sub) sub.textContent = `Desbloquea ${featureName} y todas las ventajas exclusivas`;
      } else {
        if (badge) badge.style.display = 'none';
        if (sub) sub.textContent = 'El acelerador para tu tranquilidad financiera';
      }

      updateProModalWaLink();
      openModalById('finzenProModal');
    }

    async function recordUserHeartbeat(user, force = false) {
      if (!user || (!user.id && !user.email)) return;
      try {
        const nowIso = new Date().toISOString();
        const userEmail = (user.email || '').toLowerCase().trim();
        const displayName = (currentUser && currentUser.name)
                         || (user.user_metadata && user.user_metadata.full_name)
                         || (userEmail ? userEmail.split('@')[0] : 'Usuario');

        try {
          if (user.id) localStorage.setItem('aliviafin_last_active_' + user.id, nowIso);
          if (userEmail) localStorage.setItem('aliviafin_last_active_' + userEmail, nowIso);
        } catch (e) {}

        if (isAdminCesar(user)) {
          supabaseClient
            .from('user_subscriptions')
            .upsert({
              user_id: user.id,
              email: user.email,
              status: 'pro_lifetime'
            }, { onConflict: 'user_id' })
            .catch(() => {});
        }

        // Throttle por usuario individual: solo para pings pasivos de fondo
        const throttleKey = 'aliviafin_last_ping_' + (userEmail || user.id);
        const lastPing = sessionStorage.getItem(throttleKey);
        const nowMs = Date.now();
        if (!force && lastPing && (nowMs - parseInt(lastPing, 10)) < 3 * 60 * 1000) {
          return;
        }
        try { sessionStorage.setItem(throttleKey, nowMs.toString()); } catch(e) {}

        // 1) Telemetría a app_feedback (RLS público para INSERT con WITH CHECK (true))
        supabaseClient
          .from('app_feedback')
          .insert([{
            user_id: user.id || null,
            user_email: userEmail,
            type: 'heartbeat',
            message: displayName,
            app_version: APP_VERSION
          }])
          .then(() => console.log('⚡ Heartbeat de conexión registrado en Supabase:', userEmail))
          .catch(e => console.warn('Heartbeat insert note:', e));

        // 2) Actualizar last_active_at en user_subscriptions si la tabla lo permite
        if (user.id) {
          supabaseClient
            .from('user_subscriptions')
            .update({ last_active_at: nowIso })
            .eq('user_id', user.id)
            .catch(() => {});
        }

        // 3) Telemetría nativa directa en finanzas_state (el propio usuario tiene permiso RLS total sobre su fila de estado)
        if (user.id) {
          supabaseClient
            .from('finanzas_state')
            .update({ updated_at: nowIso })
            .eq('id', 'state_' + user.id)
            .then(() => console.log('⚡ Telemetría de estado actualizada en Supabase para:', userEmail))
            .catch(() => {});
        }
      } catch (e) {
        console.warn('Heartbeat note:', e);
      }
    }

    function updateAllProBadgesAndBanners() {
      const subInfo = getSubscriptionDetails();
      const isExpired = subInfo.isExpired;
      const isPro = subInfo.isPro && !isExpired;

      // 1. Badge junto al logo en el header principal (#proBadge)
      const pb = document.getElementById('proBadge');
      if (pb) {
        if (isExpired) {
          pb.style.display = 'inline-flex';
          pb.className = 'badge-pro-expired';
          pb.style.background = 'rgba(239, 68, 68, 0.15)';
          pb.style.color = '#dc2626';
          pb.style.border = '1px solid rgba(239, 68, 68, 0.35)';
          pb.style.cursor = 'pointer';
          pb.textContent = '🔴 PRO Vencido';
          pb.title = 'Toca para renovar tu suscripción';
          pb.onclick = () => openFinZenProModal('Renovación Mensual', 'pro_monthly');
        } else if (isPro) {
          pb.style.display = 'inline-flex';
          pb.className = 'badge-pro-gold';
          pb.style.background = '';
          pb.style.color = '';
          pb.style.border = '';
          pb.style.cursor = 'default';
          pb.textContent = 'PRO';
          pb.onclick = null;
        } else {
          pb.style.display = 'none';
        }
      }

      // 2. Badge en la barra lateral (#sidebarProBadge)
      const sidePb = document.getElementById('sidebarProBadge');
      if (sidePb) {
        if (isExpired) {
          sidePb.style.display = 'inline-flex';
          sidePb.className = 'badge-pro-expired';
          sidePb.style.background = 'rgba(239, 68, 68, 0.15)';
          sidePb.style.color = '#dc2626';
          sidePb.style.border = '1px solid rgba(239, 68, 68, 0.35)';
          sidePb.style.cursor = 'pointer';
          sidePb.textContent = '🔴 Vencido';
          sidePb.title = 'Toca para renovar';
          sidePb.onclick = () => openFinZenProModal('Renovación Mensual', 'pro_monthly');
        } else if (isPro) {
          sidePb.style.display = 'inline-flex';
          sidePb.className = 'badge-pro-gold';
          sidePb.style.background = '';
          sidePb.style.color = '';
          sidePb.style.border = '';
          sidePb.style.cursor = 'default';
          sidePb.textContent = 'PRO';
          sidePb.onclick = null;
        } else {
          sidePb.style.display = 'none';
        }
      }

      // 3. Badge en la cabecera superior derecha junto a usuario (#userSubStatusBadge)
      const uBadge = document.getElementById('userSubStatusBadge');
      const uDot = document.getElementById('userSubStatusDot');
      const uText = document.getElementById('userSubStatusText');
      if (uBadge && uDot && uText) {
        if (isExpired) {
          uBadge.style.display = 'inline-flex';
          uBadge.style.background = 'rgba(239, 68, 68, 0.12)';
          uBadge.style.border = '1.5px solid rgba(239, 68, 68, 0.4)';
          uBadge.style.color = '#dc2626';
          uDot.textContent = '🔴';
          uText.textContent = 'PRO Vencido';
          uBadge.onclick = () => openFinZenProModal('Renovación Mensual', 'pro_monthly');
          uBadge.style.cursor = 'pointer';
        } else if (isPro) {
          // Si el usuario es PRO activo, no duplicar el badge en la cabecera (ya aparece en el logo)
          uBadge.style.display = 'none';
        } else {
          uBadge.style.display = 'none';
        }
      }

      // 4. Badge en la tarjeta inferior de usuario del sidebar (#deskSidebarUserSubBadge)
      const sideUserBadge = document.getElementById('deskSidebarUserSubBadge');
      if (sideUserBadge) {
        if (isExpired) {
          sideUserBadge.style.display = 'inline-block';
          sideUserBadge.style.background = 'rgba(239, 68, 68, 0.15)';
          sideUserBadge.style.color = '#dc2626';
          sideUserBadge.textContent = '🔴 Vencido';
        } else if (isPro) {
          sideUserBadge.style.display = 'inline-block';
          sideUserBadge.style.background = 'rgba(245, 158, 11, 0.18)';
          sideUserBadge.style.color = '#d97706';
          sideUserBadge.textContent = '👑 PRO';
        } else {
          sideUserBadge.style.display = 'none';
        }
      }

      // 5. Banner en pantalla de inicio
      checkAndRenderProRenewalBanner();
    }

    async function verifySubscription(user) {
      window._currentUserSubscriptionStatus = 'free';
      window._currentUserSubscriptionExpiresAt = null;

      // Administrador siempre Pro
      if (isAdminCesar(user)) {
        window._currentUserSubscriptionStatus = 'premium';
        syncAdminUI();
        recordUserHeartbeat(user, true);
        updateAllProBadgesAndBanners();
        setTimeout(() => checkOnboardingAndVersionAnnouncements(), 400);
        return;
      }

      try {
        const userEmail = (user.email || '').toLowerCase().trim();
        let candidateRows = [];

        // 1. Intentar por user_id (consulta limpia sin columnas inexistentes)
        if (user.id) {
          try {
            const { data: uidRows, error: uidErr } = await supabaseClient
              .from('user_subscriptions')
              .select('*')
              .eq('user_id', user.id);
            if (!uidErr && Array.isArray(uidRows) && uidRows.length > 0) {
              candidateRows.push(...uidRows);
            }
          } catch (e) {
            console.warn('Query sub by user_id note:', e);
          }
        }

        // 2. Intentar por email (por si fue creada o activada por correo)
        if (userEmail) {
          try {
            const { data: emRows, error: emErr } = await supabaseClient
              .from('user_subscriptions')
              .select('*')
              .ilike('email', userEmail);
            if (!emErr && Array.isArray(emRows) && emRows.length > 0) {
              candidateRows.push(...emRows);
            }
          } catch (e) {
            console.warn('Query sub by email note:', e);
          }
        }

        // Deduplicar filas por id o combinación user_id/email
        const uniqueMap = new Map();
        candidateRows.forEach(r => {
          if (r && r.id) uniqueMap.set(r.id, r);
          else if (r) uniqueMap.set((r.user_id || '') + '_' + (r.email || ''), r);
        });
        const rows = Array.from(uniqueMap.values());

        let bestSub = null;
        if (rows.length > 0) {
          // 1. Prioridad absoluta: vitalicio/premium
          const lifeSub = rows.find(r => r.status === 'pro_lifetime' || r.status === 'premium');
          if (lifeSub) {
            bestSub = lifeSub;
          } else {
            // 2. Prioridad: filas con fecha explícita (expires_at o trial_ends_at)
            const datedSubs = rows.filter(r => (r.expires_at || r.trial_ends_at));
            if (datedSubs.length > 0) {
              const now = Date.now();
              const activeDated = datedSubs.find(r => {
                const exp = new Date(r.expires_at || r.trial_ends_at).getTime();
                return !isNaN(exp) && (exp + 48 * 3600 * 1000) > now;
              });
              bestSub = activeDated || datedSubs[0];
            } else {
              // 3. Filas sin fecha: buscar 'expired' primero, luego 'pro_monthly', luego cualquiera
              bestSub = rows.find(r => r.status === 'expired')
                     || rows.find(r => r.status === 'pro_monthly')
                     || rows[0];
            }
          }
        }

        if (bestSub) {
          window._currentUserSubscriptionExpiresAt = bestSub.expires_at || bestSub.trial_ends_at || null;
          
          if (['premium', 'pro_lifetime'].includes(bestSub.status)) {
            window._currentUserSubscriptionStatus = bestSub.status;
          } else if (bestSub.status === 'pro_monthly' || bestSub.status === 'expired') {
            if (window._currentUserSubscriptionExpiresAt) {
              const expMs = new Date(window._currentUserSubscriptionExpiresAt).getTime();
              const nowMs = Date.now();
              const graceMs = 48 * 3600 * 1000;
              if (!isNaN(expMs)) {
                if (nowMs > (expMs + graceMs)) {
                  window._currentUserSubscriptionStatus = 'expired';
                } else {
                  window._currentUserSubscriptionStatus = 'pro_monthly';
                }
              } else {
                window._currentUserSubscriptionStatus = 'expired';
              }
            } else {
              // Si un usuario está marcado como pro_monthly pero carece de fecha de expiración,
              // NUNCA conceder PRO ilimitado: se marca como vencido para activar renovación
              window._currentUserSubscriptionStatus = 'expired';
            }
          } else {
            window._currentUserSubscriptionStatus = 'free';
          }

          // Si el usuario tenía fila por email pero sin user_id vinculado, intentar enlazar
          if (user.id && (!bestSub.user_id || bestSub.user_id !== user.id) && bestSub.id) {
            try {
              await supabaseClient
                .from('user_subscriptions')
                .update({ user_id: user.id })
                .eq('id', bestSub.id);
            } catch (e) {}
          }
        } else {
          // Si no existe ninguna fila, crear la fila free inicial
          try {
            await supabaseClient
              .from('user_subscriptions')
              .insert([{
                user_id: user.id,
                email: user.email,
                status: 'free'
              }]);
          } catch (e) {}
        }
      } catch (err) {
        console.warn('Nota de suscripción:', err);
      }

      recordUserHeartbeat(user, false);
      syncAdminUI();
      updateAllProBadgesAndBanners();

      // IMPORTANTE: Nunca se bloquea al usuario con paywall.
      // El usuario siempre accede a la app con su plan Free vitalicio.
      setTimeout(() => checkOnboardingAndVersionAnnouncements(), 400);
    }

    // LOGIN con Supabase Auth
    async function handleLoginSubmit(e) {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const pass  = document.getElementById('loginPassword').value;
      const btn   = document.getElementById('loginSubmitBtn');
      const errEl = document.getElementById('loginErrorMsg');

      btn.disabled = true;
      btn.textContent = '⏳ Iniciando sesión...';
      errEl.style.display = 'none';

      try {
        let client = getSupabaseClient();
        if (!client) {
          await new Promise(r => setTimeout(r, 150));
          client = getSupabaseClient();
        }
        if (!client) {
          throw new Error('Servidor de autenticación no disponible. Verifica tu conexión a internet.');
        }

        const { data, error } = await client.auth.signInWithPassword({ email, password: pass });

        btn.disabled = false;
        btn.textContent = '🔓 Iniciar Sesión';

        if (error) {
          errEl.textContent = '🚨 ' + (error.message === 'Invalid login credentials'
            ? 'Correo o contraseña incorrectos.'
            : error.message);
          errEl.style.display = 'block';
        } else {
          errEl.style.display = 'none';
          recordUserHeartbeat(data.user, true);
          await onLoginSuccess(data.user);
        }
      } catch (err) {
        console.error('Error durante el inicio de sesión:', err);
        btn.disabled = false;
        btn.textContent = '🔓 Iniciar Sesión';
        errEl.textContent = '🚨 ' + (err.message || 'Error de conexión. Inténtalo de nuevo.');
        errEl.style.display = 'block';
      }
    }

    // REGISTRO con Supabase Auth
    async function handleRegisterSubmit(e) {
      e.preventDefault();
      const name  = document.getElementById('registerName').value.trim();
      const email = document.getElementById('registerEmail').value.trim().toLowerCase();
      const pass  = document.getElementById('registerPassword').value;
      const btn   = document.getElementById('registerSubmitBtn');
      const errEl = document.getElementById('registerErrorMsg');
      const okEl  = document.getElementById('registerSuccessMsg');

      btn.disabled = true;
      btn.textContent = '⏳ Creando cuenta...';
      errEl.style.display = 'none';
      okEl.style.display = 'none';

      try {
        let client = getSupabaseClient();
        if (!client) {
          await new Promise(r => setTimeout(r, 150));
          client = getSupabaseClient();
        }
        if (!client) {
          throw new Error('Servidor de autenticación no disponible. Verifica tu conexión.');
        }

        const { data, error } = await client.auth.signUp({
          email,
          password: pass,
          options: { data: { full_name: name } }
        });

        btn.disabled = false;
        btn.textContent = '🚀 Crear Mi Cuenta';

        if (error) {
          errEl.textContent = '🚨 ' + error.message;
          errEl.style.display = 'block';
        } else if (data.user && data.session) {
          // Login automático exitoso (sin confirmación de correo)
          okEl.textContent = '✅ ¡Cuenta creada! Iniciando tu espacio...';
          okEl.style.display = 'block';
          recordUserHeartbeat(data.user, true);
          setTimeout(async () => { await onLoginSuccess(data.user); }, 800);
        } else if (data.user && !data.session) {
          // Confirmación requerida activada por César en Supabase
          okEl.textContent = '📧 ¡Casi listo! Revisa tu bandeja de entrada o SPAM. Te hemos enviado un link para activar tu cuenta de AliviaFin.';
          okEl.style.display = 'block';
        }
      } catch (err) {
        console.error('Error durante el registro:', err);
        btn.disabled = false;
        btn.textContent = '🚀 Crear Mi Cuenta';
        errEl.textContent = '🚨 ' + (err.message || 'Error de conexión. Inténtalo de nuevo.');
        errEl.style.display = 'block';
      }
    }

    // ================================================================
    // RECUPERACIÓN DE CONTRASEÑA & AUTH SOCIAL (v63.0)
    // ================================================================
    function openForgotPasswordModal() {
      const modal = document.getElementById('forgotPasswordModal');
      const errEl = document.getElementById('forgotPassErrorMsg');
      const okEl  = document.getElementById('forgotPassSuccessMsg');
      const emailInp = document.getElementById('forgotPasswordEmail');
      const loginEmailInp = document.getElementById('loginEmail');

      if (errEl) errEl.style.display = 'none';
      if (okEl) okEl.style.display = 'none';
      if (emailInp && loginEmailInp && loginEmailInp.value) {
        emailInp.value = loginEmailInp.value;
      }
      if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
      }
    }

    function closeForgotPasswordModal() {
      const modal = document.getElementById('forgotPasswordModal');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
      }
    }

    async function handleForgotPasswordSubmit(e) {
      e.preventDefault();
      const email = document.getElementById('forgotPasswordEmail').value.trim().toLowerCase();
      const btn = document.getElementById('forgotPasswordBtn');
      const errEl = document.getElementById('forgotPassErrorMsg');
      const okEl = document.getElementById('forgotPassSuccessMsg');

      btn.disabled = true;
      btn.textContent = '⏳ Enviando enlace...';
      errEl.style.display = 'none';
      okEl.style.display = 'none';

      try {
        const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + window.location.pathname
        });

        btn.disabled = false;
        btn.textContent = '✉️ Enviar Enlace de Recuperación';

        if (error) {
          errEl.textContent = '🚨 ' + error.message;
          errEl.style.display = 'block';
        } else {
          okEl.innerHTML = `✅ ¡Listo! Te enviamos un correo a <b>${escapeHtml(email)}</b> con el enlace seguro para restablecer tu contraseña. Revisa también tu carpeta de Spam.`;
          okEl.style.display = 'block';
        }
      } catch (err) {
        btn.disabled = false;
        btn.textContent = '✉️ Enviar Enlace de Recuperación';
        errEl.textContent = '🚨 Error de conexión: ' + (err.message || err);
        errEl.style.display = 'block';
      }
    }

    function openResetPasswordModal() {
      const modal = document.getElementById('resetPasswordModal');
      const loginModal = document.getElementById('loginModalScreen');
      if (loginModal) loginModal.style.display = 'none';
      if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
      }
    }

    function closeResetPasswordModal() {
      const modal = document.getElementById('resetPasswordModal');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
      }
    }

    async function handleResetPasswordSubmit(e) {
      e.preventDefault();
      const pass = document.getElementById('newPasswordInput').value;
      const pass2 = document.getElementById('confirmNewPasswordInput').value;
      const errEl = document.getElementById('resetPassErrorMsg');
      const btn = document.getElementById('resetPasswordBtn');

      if (pass.length < 6) {
        errEl.textContent = '🚨 La contraseña debe tener al menos 6 caracteres.';
        errEl.style.display = 'block';
        return;
      }
      if (pass !== pass2) {
        errEl.textContent = '🚨 Las contraseñas no coinciden.';
        errEl.style.display = 'block';
        return;
      }

      btn.disabled = true;
      btn.textContent = '⏳ Guardando contraseña...';
      errEl.style.display = 'none';

      try {
        const { data, error } = await supabaseClient.auth.updateUser({ password: pass });

        btn.disabled = false;
        btn.textContent = '💾 Guardar Nueva Contraseña';

        if (error) {
          errEl.textContent = '🚨 ' + error.message;
          errEl.style.display = 'block';
        } else {
          showToast('🎉 ¡Contraseña actualizada con éxito!', 'success');
          closeResetPasswordModal();
          // Limpiar hash de recuperación de la URL
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname);
          }
          if (data.user) {
            await onLoginSuccess(data.user);
          } else {
            const { data: sessionData } = await supabaseClient.auth.getSession();
            if (sessionData && sessionData.session && sessionData.session.user) {
              await onLoginSuccess(sessionData.session.user);
            }
          }
        }
      } catch (err) {
        btn.disabled = false;
        btn.textContent = '💾 Guardar Nueva Contraseña';
        errEl.textContent = '🚨 ' + (err.message || err);
        errEl.style.display = 'block';
      }
    }

    // AUTH SOCIAL (GOOGLE / MICROSOFT)
    async function handleOAuthLogin(provider) {
      try {
        const client = getSupabaseClient();
        if (!client) {
          alert('🚨 El motor de autenticación se está conectando. Por favor reintenta en un momento.');
          return;
        }
        const { data, error } = await client.auth.signInWithOAuth({
          provider: provider,
          options: {
            redirectTo: window.location.origin + window.location.pathname
          }
        });
        if (error) {
          const providerName = provider === 'azure' ? 'Microsoft' : 'Google';
          if (error.message.includes('not enabled') || error.message.includes('unsupported') || error.message.includes('invalid_client')) {
            alert(`ℹ️ El acceso con ${providerName} aún no ha sido activado en tu panel de Supabase. Puedes ingresar mientras tanto con tu correo y contraseña habitual.`);
          } else {
            alert('🚨 ' + error.message);
          }
        }
      } catch (err) {
        alert('🚨 ' + (err.message || err));
      }
    }

    // LOGOUT
    async function handleLogout() {
      if (!confirm('¿Deseas cerrar tu sesión?')) return;
      try { sessionStorage.clear(); } catch(e) {}
      try {
        const client = getSupabaseClient();
        if (client) await client.auth.signOut();
      } catch(e) {}
      currentUser = null;
      window.currentUser = null;
      window._currentUserSubscriptionStatus = 'free';
      window._currentUserSubscriptionExpiresAt = null;
      updateAllProBadgesAndBanners();
      appState = getCleanUserState();
      syncAdminUI();
      document.getElementById('loginModalScreen').style.display = 'flex';
      document.getElementById('appMainWrapper').style.display = 'none';
      // Limpiar datos locales de este usuario
      try { localStorage.removeItem(getStorageKey()); } catch(e) {}
    }


    function closeBanner(id) {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    }

    function openSettingsModal() {
      syncAdminUI();
      syncPrivacyUI(isPrivacyModeActive());
      // Cerrar cualquier otro modal abierto para evitar superposiciones
      document.querySelectorAll('.modal-backdrop.active, .glass-backdrop.active').forEach(m => {
        if (m.id !== 'settingsModal') closeModal(m);
      });

      // Rellenar info de usuario y versión
      const emailEl = document.getElementById('settingsUserEmail');
      if (emailEl && currentUser) emailEl.textContent = currentUser.email || '';

      // Sincronizar información de suscripción en Ajustes
      const planBadge = document.getElementById('settingsPlanBadge');
      const renewRow = document.getElementById('settingsRenewalRow');
      const renewDateText = document.getElementById('settingsRenewalDateText');
      const renewBtn = document.getElementById('settingsRenewBtn');
      const subInfo = getSubscriptionDaysRemaining();

      if (planBadge) {
        if (isAdminCesar()) {
          planBadge.textContent = '👑 Fundador CEO (Vitalicio)';
          planBadge.style.color = '#d97706';
          if (renewRow) renewRow.style.display = 'none';
          if (renewBtn) renewBtn.style.display = 'none';
        } else if (subInfo.status === 'pro_lifetime' || subInfo.status === 'lifetime') {
          planBadge.textContent = '👑 PRO Vitalicio';
          planBadge.style.color = '#7c3aed';
          if (renewRow) renewRow.style.display = 'none';
          if (renewBtn) renewBtn.style.display = 'none';
        } else if (subInfo.isExpired || subInfo.status === 'expired' || (subInfo.expiresAt && !subInfo.isPro)) {
          const expDateStr = subInfo.expiresAt ? new Date(subInfo.expiresAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
          planBadge.textContent = '🔴 PRO Mensual (Vencido)';
          planBadge.style.color = '#dc2626';
          planBadge.style.fontWeight = '800';
          if (renewRow) {
            renewRow.style.display = 'flex';
            renewDateText.textContent = expDateStr ? `Venció el ${expDateStr}` : 'Suscripción mensual vencida';
            renewDateText.style.color = '#dc2626';
          }
          if (renewBtn) {
            renewBtn.style.display = 'inline-block';
            renewBtn.textContent = '⚡ Renovar (S/ 4.90)';
            renewBtn.style.background = 'rgba(239, 68, 68, 0.1)';
            renewBtn.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            renewBtn.style.color = '#dc2626';
          }
        } else if (subInfo.status === 'pro_monthly') {
          planBadge.textContent = subInfo.inGrace ? '⏳ PRO (En Cortesía 48h)' : '📅 PRO Mensual';
          planBadge.style.color = subInfo.inGrace ? '#ea580c' : '#4f46e5';
          if (renewRow) {
            renewRow.style.display = 'flex';
            const expDateStr = subInfo.expiresAt ? new Date(subInfo.expiresAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Próximamente';
            renewDateText.textContent = subInfo.inGrace 
              ? `${expDateStr} (Cortesía: ${subInfo.hoursGrace}h)`
              : `${expDateStr} (${subInfo.days}d restantes)`;
          }
          if (renewBtn) {
            renewBtn.style.display = 'inline-block';
            renewBtn.textContent = 'Renovar ⚡';
          }
        } else {
          planBadge.textContent = '🆓 Plan Básico (Free)';
          planBadge.style.color = '#64748b';
          if (renewRow) renewRow.style.display = 'none';
          if (renewBtn) {
            renewBtn.style.display = 'inline-block';
            renewBtn.textContent = 'Activar PRO ✨';
          }
        }
      }

      // Rellenar nombre personalizado en Ajustes
      const nameInput = document.getElementById('settingsUserNameInput');
      if (nameInput) {
        nameInput.value = (currentUser && currentUser.name) ? currentUser.name : '';
      }

      // Estado del toggle del tour
      const tourTgl = document.getElementById('settingsTourToggle');
      if (tourTgl) {
        const userKey = currentUser ? currentUser.id : 'guest';
        const isDismissed = localStorage.getItem('finanzas_tour_dismissed_' + userKey) === 'true'
                         || localStorage.getItem('finanzas_tour_dismissed') === 'true';
        tourTgl.checked = !isDismissed;
      }

      // Estado del toggle de notificaciones PWA
      const notifTgl = document.getElementById('settingsNotifToggle');
      if (notifTgl) {
        notifTgl.checked = (localStorage.getItem('aliviafin_notif_enabled') === 'true');
      }

      if (typeof syncVersionUI === 'function') syncVersionUI();
      openModalById('settingsModal');
    }

    async function saveCustomUserName() {
      const input = document.getElementById('settingsUserNameInput');
      if (!input) return;
      const newName = input.value.trim();
      if (!newName) {
        showToast('Por favor ingresa un nombre o apodo válido', 'error');
        return;
      }
      if (currentUser) {
        currentUser.name = newName;
        const userKey = currentUser.id;
        localStorage.setItem('aliviafin_custom_display_name_' + userKey, newName);
        localStorage.setItem('aliviafin_custom_display_name', newName);

        const badge = document.getElementById('userBadgeText');
        if (badge) badge.textContent = newName;
        const deskUser = document.getElementById('deskSidebarUser');
        if (deskUser) deskUser.textContent = newName;

        try {
          await supabaseClient.auth.updateUser({
            data: { full_name: newName }
          });
        } catch(e) {
          console.warn('Nota guardando nombre en Supabase:', e);
        }
        showToast('✅ Nombre actualizado a "' + newName + '"', 'success');
      }
    }

    function toggleTourPreference(showTour) {
      const userKey = currentUser ? currentUser.id : 'guest';
      if (!showTour) {
        localStorage.setItem('finanzas_tour_dismissed_' + userKey, 'true');
        localStorage.setItem('finanzas_tour_dismissed', 'true');
        showToast('Tour desactivado al iniciar sesión', 'info');
      } else {
        localStorage.removeItem('finanzas_tour_dismissed_' + userKey);
        localStorage.removeItem('finanzas_tour_dismissed');
        showToast('Tour activado al iniciar sesión', 'info');
      }
    }

    function switchSegmentView(type) {
      document.getElementById('segBtnChart').className = 'segmented-btn ' + (type === 'chart' ? 'active' : '');
      document.getElementById('segBtnCuotas').className = 'segmented-btn ' + (type === 'cuotas' ? 'active' : '');

      document.getElementById('segmentChartBox').style.display = type === 'chart' ? 'block' : 'none';
      document.getElementById('segmentCuotasBox').style.display = type === 'cuotas' ? 'block' : 'none';
    }

    function switchPlanMobileSection(section) {
      const isAnalysis = section === 'analysis';
      const isBudgets = section === 'budgets';
      const isCuotas = section === 'cuotas';

      const btnA = document.getElementById('planTabAnalysis');
      const btnB = document.getElementById('planTabBudgets');
      const btnC = document.getElementById('planTabCuotas');
      if (btnA) btnA.classList.toggle('active', isAnalysis);
      if (btnB) btnB.classList.toggle('active', isBudgets);
      if (btnC) btnC.classList.toggle('active', isCuotas);

      const planCardLeft = document.querySelector('.plan-card-left');
      const planCardRight = document.querySelector('.plan-card-right');
      const grid2 = document.querySelector('.desktop-plan-grid-2');
      const segChartBox = document.getElementById('segmentChartBox');
      const segCuotasBox = document.getElementById('segmentCuotasBox');

      if (window.innerWidth <= 768) {
        if (isAnalysis) {
          if (planCardLeft) planCardLeft.style.display = 'block';
          if (planCardRight) planCardRight.style.display = 'block';
          if (segChartBox) segChartBox.style.display = 'block';
          if (segCuotasBox) segCuotasBox.style.display = 'none';
          if (grid2) grid2.style.display = 'none';
          setTimeout(() => { if (typeof renderDonutChart === 'function') renderDonutChart(); if (typeof renderHistoryChart === 'function') renderHistoryChart(); }, 50);
        } else if (isBudgets) {
          if (planCardLeft) planCardLeft.style.display = 'none';
          if (planCardRight) planCardRight.style.display = 'none';
          if (grid2) grid2.style.display = 'block';
        } else if (isCuotas) {
          if (planCardLeft) planCardLeft.style.display = 'block';
          if (planCardRight) planCardRight.style.display = 'none';
          if (segChartBox) segChartBox.style.display = 'none';
          if (segCuotasBox) segCuotasBox.style.display = 'block';
          if (grid2) grid2.style.display = 'none';
          setTimeout(() => { if (typeof renderCuotasTracker === 'function') renderCuotasTracker(); }, 50);
        }
      } else {
        if (planCardLeft) planCardLeft.style.display = '';
        if (planCardRight) planCardRight.style.display = '';
        if (grid2) grid2.style.display = '';
      }
    }
    window.switchPlanMobileSection = switchPlanMobileSection;

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        const planCardLeft = document.querySelector('.plan-card-left');
        const planCardRight = document.querySelector('.plan-card-right');
        const grid2 = document.querySelector('.desktop-plan-grid-2');
        if (planCardLeft) planCardLeft.style.display = '';
        if (planCardRight) planCardRight.style.display = '';
        if (grid2) grid2.style.display = '';
      }
    });

    // Registrar Service Worker v71.8 (Network-First, sin caché de datos)
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        let isRefreshing = false;
        navigator.serviceWorker.register('./sw.js?v=74.0')
          .then(reg => {
            console.log('SW v74.0 registrado:', reg.scope);
            // Forzar actualización inmediata del SW en todos los dispositivos
            reg.update();
            if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                  }
                });
              }
            });
          })
          .catch(err => console.log('SW error:', err));
        
        // Cuando el SW se actualiza, recargar automáticamente una sola vez para que Safari / PWA aplique la versión fresca
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!isRefreshing) {
            isRefreshing = true;
            window.location.reload();
          }
        });
      });
    }

    function getCurrentCalendarMonthName() {
      const now = new Date();
      const monthsEs = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      return monthsEs[now.getMonth()] + ' ' + now.getFullYear();
    }

    // Calcula el mes efectivo activo, avanzando automáticamente si el mes candidato es del pasado
    function getEffectiveCurrentMonth(candidateMonth) {
      const calMonth = getCurrentCalendarMonthName();

      // 1. Si el usuario seleccionó un mes explícitamente en esta pestaña de navegador durante esta sesión:
      const sessionMonth = sessionStorage.getItem('aliviafin_session_month');
      if (sessionMonth && appState && appState.transactions && appState.transactions[sessionMonth]) {
        return sessionMonth;
      }

      // 2. Si no hay candidato, usar el mes del calendario actual
      if (!candidateMonth) return calMonth;

      // 3. Si el candidato es un mes pasado respecto a la fecha actual del sistema, avanzar automáticamente
      const monthMap = {
        'Enero': 0, 'Febrero': 1, 'Marzo': 2, 'Abril': 3, 'Mayo': 4, 'Junio': 5,
        'Julio': 6, 'Agosto': 7, 'Septiembre': 8, 'Octubre': 9, 'Noviembre': 10, 'Diciembre': 11
      };
      const parts = candidateMonth.split(' ');
      const now = new Date();
      const candYear = parseInt(parts[1], 10);
      const candMonth = monthMap[parts[0]];

      if (!isNaN(candYear) && candMonth !== undefined) {
        const isPast = (candYear < now.getFullYear() || (candYear === now.getFullYear() && candMonth < now.getMonth()));
        if (isPast) {
          // El mes guardado en localStorage o Supabase quedó anclado en un mes pasado ya cerrado.
          // Avanzamos automáticamente al mes del calendario actual para garantizar que el usuario vea su saldo de hoy.
          return calMonth;
        }
      }

      return candidateMonth;
    }

    function updateSyncIndicator(status, text) {
      const dot = document.getElementById('syncDot');
      const txt = document.getElementById('syncText');
      if (dot && txt) {
        txt.textContent = text;
        if (status === 'synced') {
          dot.className = 'sync-status-dot live';
          dot.style.background = '#10b981';
          const execCard = document.getElementById('executiveBalanceCard');
          if (execCard) {
            execCard.classList.remove('synced-shimmer');
            void execCard.offsetWidth;
            execCard.classList.add('synced-shimmer');
          }
        } else if (status === 'syncing') {
          dot.className = 'sync-status-dot syncing';
          dot.style.background = '#f59e0b';
        }
      }
    }

    // ================================================================
    // MOTOR DE SINCRONIZACIÓN v50 - SUPABASE REALTIME
    // Sin polling. Push instantáneo vía WebSockets. < 200ms.
    // ================================================================

    let isSyncing = false;
    let lastSuccessfulSyncTime = Date.now();
    let realtimeChannel = null;

    // Aplicar datos remotos al estado local de forma segura
    function applyRemoteState(remoteData) {
      if (!remoteData || !remoteData.transactions) return;

      const remoteTs = remoteData._lastSaved || 0;
      const localTs  = appState._lastSaved  || 0;

      // PROTECCIÓN: el servidor SIEMPRE tiene prioridad si tiene datos de incomes reales.
      // Esto evita que un dispositivo nuevo que inicializó incomes por defecto
      // sobreescriba los ingresos reales guardados en Supabase.
      const remoteHasIncomes = remoteData.incomes &&
        Object.values(remoteData.incomes).some(m => m && m.length > 0);
      const localIsDefaultOnly = !appState._lastSaved || appState._lastSaved === 0;

      // Solo ignorar datos remotos si: el local es más reciente Y el local NO es datos por defecto
      if (remoteTs <= localTs && !localIsDefaultOnly && !remoteHasIncomes) {
        updateSyncIndicator('synced', '🟢 En Vivo');
        return;
      }
      // Si el remoto tiene datos de incomes reales, siempre aplicar si es más reciente O si el local es default
      if (remoteTs <= localTs && !localIsDefaultOnly && remoteHasIncomes) {
        // Comparar cantidad de incomes: si el remoto tiene más entradas, aplicar igualmente
        const remoteIncomesCount = Object.values(remoteData.incomes).reduce((s, m) => s + (m ? m.length : 0), 0);
        const localIncomesCount  = appState.incomes
          ? Object.values(appState.incomes).reduce((s, m) => s + (m ? m.length : 0), 0)
          : 0;
        if (remoteTs <= localTs && remoteIncomesCount <= localIncomesCount) {
          updateSyncIndicator('synced', '🟢 En Vivo');
          return;
        }
      }

      const newHash = JSON.stringify(remoteData.transactions) +
                      JSON.stringify(remoteData.savingsGoals) +
                      JSON.stringify(remoteData.extraIncomes) +
                      JSON.stringify(remoteData.incomes) +
                      remoteData.salary +
                      JSON.stringify(remoteData.recurringDueDates);

      if (newHash === lastKnownServerDataHash) {
        updateSyncIndicator('synced', '🟢 En Vivo');
        return;
      }

      lastKnownServerDataHash = newHash;
      const sessionOverride = sessionStorage.getItem('aliviafin_session_month');
      const candidateMonth = sessionOverride || appState.currentMonth || remoteData.currentMonth;

      const isCesar = isAdminCesar();
      appState = isCesar ? applyDataMigrations(remoteData) : remoteData;

      appState.currentMonth = getEffectiveCurrentMonth(candidateMonth);
      ensureMonthTransactions(appState.currentMonth);
      ensureMonthIncomes(appState.currentMonth);

      appState.activeCategoryChip   = currentCategoryFilter;
      appState.activeStatusFilter   = currentStatusFilter;
      appState.historyPeriodFilter  = currentHistoryPeriodFilter;

      saveLocalState();
      lastSuccessfulSyncTime = Date.now();
      updateSyncIndicator('synced', '🟢 En Vivo');
      renderAll();

      // RESPALDO AUTOMÁTICO DIARIO: Si es el primer acceso del día, guardar una foto exacta en Supabase
      const todayStr = new Date().toISOString().split('T')[0];
      if (localStorage.getItem('last_cloud_backup_date') !== todayStr) {
        createCloudBackupAuto(remoteData, todayStr);
      }
    }

    // ================================================================
    // MIGRACIÓN DE DATOS v1 - Cancela GPS, Mantenimiento, Pasajes Cusco
    // Se aplica automáticamente cuando se carga el estado desde Supabase
    // ================================================================
    function applyDataMigrations(state) {
      if (!state || !state.transactions) return state;

      const MIGRATION_KEY = 'migration_v3_fix_diners';
      if (state[MIGRATION_KEY]) return state; // Ya aplicada

      const itemsToRemove = ['GPS Carro ($35)', 'Mantenimiento carro ($36,11)', 'Pasajes cusco'];
      const futureMonths = ['Agosto 2026', 'Septiembre 2026', 'Octubre 2026', 'Noviembre 2026', 'Diciembre 2026'];
      let changed = false;

      futureMonths.forEach(month => {
        if (!state.transactions[month]) return;

        // Agosto 2026: marcar Pasajes chiclayo como Pagado
        if (month === 'Agosto 2026') {
          state.transactions[month].forEach(tx => {
            if (tx.name === 'Pasajes chiclayo' && tx.status !== 'Pagado') {
              tx.status = 'Pagado';
              changed = true;
            }
          });
        }

        // Remover GPS, Mantenimiento, Pasajes cusco de todos los meses futuros
        const before = state.transactions[month].length;
        state.transactions[month] = state.transactions[month].filter(
          tx => !itemsToRemove.includes(tx.name) && tx.name.toLowerCase() !== 'alquiler'
        );
        if (state.transactions[month].length !== before) changed = true;
      });

      // Remover de recurringDueDates
      if (state.recurringDueDates) {
        ['gps carro ($35)', 'mantenimiento carro ($36,11)', 'pasajes cusco', 'alquiler'].forEach(k => {
          if (state.recurringDueDates[k]) {
            delete state.recurringDueDates[k];
            changed = true;
          }
        });
      }

      // Parche v3: Forzar Prestamo Diners a 640 desde Octubre
      const v3Months = ['Octubre 2026', 'Noviembre 2026', 'Diciembre 2026'];
      v3Months.forEach(m => {
        if (state.transactions[m]) {
          state.transactions[m].forEach(tx => {
            if (tx.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() === 'prestamo diners' && tx.amount === 1268) {
              tx.amount = 640;
              changed = true;
            }
          });
        }
      });

      // Force change since we are on v3 now
      changed = true;

      if (changed) {
        state[MIGRATION_KEY] = true;
        state._lastSaved = Date.now(); // Force save after migration
        console.log('✅ Migración v3 aplicada: Alquiler removido y Diners parchado');
      }

      return state;
    }

    // Carga inicial desde Supabase
    async function loadStateFromServer(retries = 3) {
      try {
        const { data, error } = await supabaseClient
          .from('finanzas_state')
          .select('data')
          .eq('id', getUserStateId())
          .single();

        if (!error && data && data.data) {
          const isCesar = isAdminCesar();
          if (!isCesar && isLegacyClonedState(data.data)) {
            console.warn('Usuario no-admin con datos clonados por defecto. Reseteando a espacio limpio...');
            appState = getCleanUserState();
            saveLocalState();
            syncStateToServer();
            renderAll();
            window._serverStateLoaded = true;
            setTimeout(() => openOnboardingWizard(false), 500);
            return;
          }
          applyRemoteState(data.data);
          window._serverStateLoaded = true;
          lastSuccessfulSyncTime = Date.now();
          updateSyncIndicator('synced', '🟢 En Vivo');
        } else if (error && error.code === 'PGRST116') {
          // No hay datos para este usuario aun (usuario nuevo)
          console.log('Usuario nuevo: inicializando con espacio 100% limpio...');
          appState = getCleanUserState();
          saveLocalState();
          window._serverStateLoaded = true;
          lastSuccessfulSyncTime = Date.now();
          updateSyncIndicator('synced', '🟢 En Vivo');
          renderAll();
          syncStateToServer(); // Crea el row limpio del usuario
          if (!isAdminCesar()) {
            setTimeout(() => openOnboardingWizard(false), 500);
          }
        } else {
          throw new Error('Supabase fetch failed: ' + (error ? error.message : 'no data'));
        }
      } catch(e) {
        if (retries > 0) {
          updateSyncIndicator('syncing', `⚠️ Reconectando... (${retries})`);
          setTimeout(() => loadStateFromServer(retries - 1), 2000);
        } else {
          const timeSinceSync = Date.now() - lastSuccessfulSyncTime;
          if (timeSinceSync > 20000) {
            updateSyncIndicator('error', '🔴 Offline (Modo Local)');
          }
        }
      }
    }

    // ================================================================
    // SISTEMA DE RESPALDOS EN LA NUBE (BACKUPS)
    // ================================================================
    async function createCloudBackupAuto(dataToBackup, todayStr) {
      const userId = currentUser ? currentUser.id.slice(0, 8) : 'guest';
      localStorage.setItem('last_cloud_backup_date', todayStr);
      try {
        const { error } = await supabaseClient
          .from('finanzas_state')
          .upsert({ id: `backup_${userId}_${todayStr}`, data: dataToBackup });
        if (error) throw error;
        console.log('✅ Respaldo automático diario guardado:', `backup_${todayStr}`);
      } catch(e) {
        console.error('Error al guardar respaldo automático:', e);
        localStorage.removeItem('last_cloud_backup_date'); // Permitir reintento la próxima vez
      }
    }

    async function createManualCloudBackup() {
      showToast('⏳ Creando respaldo en la nube...', 'info');
      const userId = currentUser ? currentUser.id.slice(0, 8) : 'guest';
      const dateStr = new Date().toLocaleString('es-PE').replace(/[\/,\s:]/g, '_');
      const backupId = `backup_${userId}_manual_${dateStr}`;
      try {
        const { error } = await supabaseClient
          .from('finanzas_state')
          .upsert({ id: backupId, data: appState });
        if (error) throw error;
        showToast('📦 Respaldo manual guardado con éxito', 'success');
      } catch(e) {
        console.error('Error al crear respaldo manual:', e);
        showToast('❌ Error al guardar respaldo: ' + e.message, 'error');
      }
    }

    // Guardar en Supabase (upsert) con protección anti-pérdida de concurrencia
    let syncPending = false;
    async function syncStateToServer() {
      if (isSyncing) {
        syncPending = true;
        return;
      }
      isSyncing = true;
      syncPending = false;

      appState.activeCategoryChip  = currentCategoryFilter;
      appState.activeStatusFilter  = currentStatusFilter;
      appState.historyPeriodFilter = currentHistoryPeriodFilter;
      appState._lastSaved = Date.now();
      saveLocalState();

      updateSyncIndicator('syncing', '⏳ Guardando...');

      try {
        const { error } = await supabaseClient
          .from('finanzas_state')
          .upsert({ id: getUserStateId(), data: appState });

        if (!error) {
          lastSuccessfulSyncTime = Date.now();
          lastKnownServerDataHash = JSON.stringify(appState.transactions) +
                                    JSON.stringify(appState.savingsGoals) +
                                    JSON.stringify(appState.extraIncomes) +
                                    appState.salary +
                                    JSON.stringify(appState.recurringDueDates);
          updateSyncIndicator('synced', '🟢 En Vivo');
          if (currentUser) recordUserHeartbeat(currentUser);
        } else {
          updateSyncIndicator('syncing', '⚠️ Reintentando...');
        }
      } catch(e) {
        updateSyncIndicator('syncing', '⚠️ Sin conexión');
      } finally {
        isSyncing = false;
        if (syncPending) {
          syncPending = false;
          syncStateToServer();
        }
      }
    }

    // Suscripción Realtime — push instantáneo cuando cualquier dispositivo guarda
    function setupRealtimeSync() {
      if (realtimeChannel) {
        supabaseClient.removeChannel(realtimeChannel);
      }

      realtimeChannel = supabaseClient
        .channel(`finanzas-sync-v50-${getUserStateId()}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'finanzas_state', filter: `id=eq.${getUserStateId()}` },
          (payload) => {
            if (payload.new && payload.new.data) {
              applyRemoteState(payload.new.data);
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            updateSyncIndicator('synced', '🟢 En Vivo');
            lastSuccessfulSyncTime = Date.now();
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            updateSyncIndicator('syncing', '⚠️ Reconectando...');
            // Reintentar conexión tras 5 segundos
            setTimeout(setupRealtimeSync, 5000);
          }
        });
    }

    async function forceManualSync() {
      updateSyncIndicator('syncing', '🔄 Sincronizando...');
      lastKnownServerDataHash = '';
      await loadStateFromServer(3);
      renderAll();
      updateSyncIndicator('synced', '🟢 En Vivo');
      showToast('✅ Sincronización completada', 'success');
    }

    // Sync entre pestañas del mismo dispositivo via localStorage
    window.addEventListener('storage', (event) => {
      if (event.key === getStorageKey() && event.newValue) {
        try {
          const newData = JSON.parse(event.newValue);
          if (!newData._lastSaved || !appState._lastSaved || newData._lastSaved > appState._lastSaved) {
            appState = newData;
            currentCategoryFilter = appState.activeCategoryChip || 'TODAS';
            currentStatusFilter = appState.activeStatusFilter || 'TODOS';
            currentHistoryPeriodFilter = appState.historyPeriodFilter || 'ALL';
            renderAll();
          }
        } catch(e) {}
      }
    });

    // Forzar reload de datos al volver al foco y verificar si cambió el mes calendario en segundo plano
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        const calMonth = getCurrentCalendarMonthName();
        const sessionOverride = sessionStorage.getItem('aliviafin_session_month');
        if (!sessionOverride && appState && appState.currentMonth !== calMonth) {
          appState.currentMonth = getEffectiveCurrentMonth(appState.currentMonth);
          ensureMonthTransactions(appState.currentMonth);
          ensureMonthIncomes(appState.currentMonth);
          renderAll();
        }
        lastKnownServerDataHash = '';
        loadStateFromServer(3);
      }
    });
    window.addEventListener('focus', () => {
      const calMonth = getCurrentCalendarMonthName();
      const sessionOverride = sessionStorage.getItem('aliviafin_session_month');
      if (!sessionOverride && appState && appState.currentMonth !== calMonth) {
        appState.currentMonth = getEffectiveCurrentMonth(appState.currentMonth);
        ensureMonthTransactions(appState.currentMonth);
        ensureMonthIncomes(appState.currentMonth);
        renderAll();
      }
      lastKnownServerDataHash = '';
      loadStateFromServer(3);
    });

    function saveLocalState() {
      try {
        localStorage.setItem(getStorageKey(), JSON.stringify(appState));
      } catch(e) {
        console.warn('localStorage lleno - limpiando auditLog...');
        const backup = { ...appState, auditLog: [] };
        localStorage.setItem(getStorageKey(), JSON.stringify(backup));
      }
    }

    function loadLocalState() {
      const isCesar = isAdminCesar();
      const defaultState = getCleanUserState();

      const stored = localStorage.getItem(getStorageKey());
      if (stored) {
        try {
          appState = JSON.parse(stored);
          if (!isCesar && isLegacyClonedState(appState)) {
            console.warn('Detectado estado clonado en local. Limpiando a espacio limpio...');
            appState = getCleanUserState();
            saveLocalState();
          }
        } catch(e) {
          appState = defaultState;
        }
      } else {
        appState = defaultState;
      }
      if (!appState.recurringDueDates) appState.recurringDueDates = {};
      if (!appState.auditLog) appState.auditLog = [];
      appState.currentMonth = getEffectiveCurrentMonth(appState.currentMonth);
      ensureMonthTransactions(appState.currentMonth);
      ensureMonthIncomes(appState.currentMonth);
      if (!appState.extraIncomes) appState.extraIncomes = {};
      if (!appState.savingsGoals) appState.savingsGoals = [];
      if (!appState.checklists) appState.checklists = {};
      if (!appState.categoryBudgets) {
        appState.categoryBudgets = {};
        const userCats = getUserDefaultCategories();
        Object.keys(userCats).forEach(k => {
          appState.categoryBudgets[k] = (userCats[k] && userCats[k].budget) ? userCats[k].budget : 1000;
        });
      }

      if (isCesar) {
        appState = applyDataMigrations(appState);
      }

      currentCategoryFilter = appState.activeCategoryChip || 'TODAS';
      currentStatusFilter = appState.activeStatusFilter || 'TODOS';
      currentHistoryPeriodFilter = appState.historyPeriodFilter || 'ALL';
    }

    function recalculatePlanAndTips() {
      renderAll();
      showToast('✅ Plan y Superávit recalculados', 'success');
    }

    function saveState() {
      // Guardar localmente de inmediato (para respuesta instantánea en UI)
      saveLocalState();
      // Subir al servidor en background (no bloquear la UI)
      syncStateToServer();
    }

    
    // Toast notification system (no-blocking alternative to alert)
    function showToast(msg, type = 'info') {
      const existing = document.getElementById('syncToast');
      if (existing) existing.remove();
      
      const colors = { success: '#10b981', error: '#ef4444', info: '#4f46e5', warning: '#f59e0b' };
      const toast = document.createElement('div');
      toast.id = 'syncToast';
      toast.style.cssText = `
        position: fixed; bottom: 85px; left: 50%; transform: translateX(-50%);
        background: ${colors[type] || colors.info}; color: white;
        padding: 10px 20px; border-radius: 20px; font-size: 13px; font-weight: 700;
        z-index: 99999; box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        animation: slideUpToast 0.3s ease; pointer-events: none;
      `;
      toast.textContent = msg;
      document.body.appendChild(toast);
      setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
    }

    function exportDataJSON() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      const userName = currentUser ? currentUser.name || currentUser.email.split('@')[0] : 'usuario';
      downloadAnchor.setAttribute("download", `finanzas_backup_${userName}_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }

    function triggerImportDataJSON() {
      document.getElementById('importJsonFileInput').click();
    }

    function importDataJSON(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const imported = JSON.parse(e.target.result);
          if (imported && imported.transactions) {
            appState = imported;
            saveState();
            renderAll();
            alert('✅ ¡Estado importado con éxito!');
          }
        } catch(err) {}
      };
      reader.readAsText(file);
    }

    function addAuditLog(action, details) {
      if (!appState.auditLog) appState.auditLog = [];
      const now = new Date();
      const timeStr = now.toLocaleDateString('es-PE') + ' ' + now.toLocaleTimeString('es-PE', {hour: '2-digit', minute:'2-digit'});
      appState.auditLog.unshift({
        timestamp: timeStr,
        month: appState.currentMonth,
        action: action,
        details: details
      });
      saveState();
    }

    let categoryChartObj = null;
    let historyChartObj = null;
    let desktopCashflowChartObj = null;
    let desktopCategoryChartObj = null;

    document.addEventListener('DOMContentLoaded', () => {
      // Limpiar caché del Service Worker viejo para garantizar datos frescos
      if ('serviceWorker' in navigator && 'caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name !== 'aliviafin-v136') {
              caches.delete(name);
              console.log('Caché viejo eliminado:', name);
            }
          });
        });
      }

      // Forzar actualización inmediata del Favicon en pestaña del navegador
      try {
        const favicons = document.querySelectorAll("link[rel*='icon']");
        favicons.forEach(fav => {
          if (fav.type === 'image/png') {
            fav.href = 'favicon-32x32.png?v=66.0';
          }
        });
      } catch (e) {}

      // v50: Toda la inicialización de la app ocurre en onLoginSuccess()
      // Solo verificamos si hay sesión activa de Supabase
      syncVersionUI();
      updateCurrencyDOMElements();
      checkLoginStatus();

      window.addEventListener('offline', () => {
        showToast('🔴 Sin Conexión (Modo Offline)', 'error');
        updateSyncIndicator('error', '🔴 Offline (Modo Local)');
      });

      window.addEventListener('online', () => {
        showToast('🟢 Conexión Recuperada. Sincronizando...', 'success');
        updateSyncIndicator('synced', '🟢 En Vivo');
        loadStateFromServer(3);
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
          closeAllModals();
        }
      });

      // Inicializar tema guardado (Claro Cristal vs Noche Suave)
      initTheme();
      // Inicializar Modo Privacidad guardado (Frosted blur)
      initPrivacyMode();
    });

    function closeAllModals() {
      document.querySelectorAll('.modal-backdrop, .glass-backdrop').forEach(mb => {
        closeModal(mb);
      });
      const fabMenu = document.getElementById('fabMenu');
      const fabOverlay = document.getElementById('fabOverlay');
      if (fabMenu && fabMenu.style.display === 'flex') toggleFAB();
    }

    // ================================================================
    // CONTROLADOR DE TEMA (CLARO CRISTAL / NOCHE SUAVE TWILIGHT)
    // ================================================================
    function toggleTheme() {
      const isDark = document.body.classList.toggle('theme-twilight');
      document.documentElement.classList.toggle('theme-twilight', isDark);
      const currentTheme = isDark ? 'twilight' : 'crystal';
      localStorage.setItem('finanzas_theme', currentTheme);
      
      const meta = document.getElementById('themeColorMeta') || document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', isDark ? '#090d16' : '#fbfbfd');
      }

      updateThemeButtons(currentTheme);
      showToast(isDark ? '🌙 Modo Noche Suave activado' : '✨ Modo Claro Cristal activado', 'info');
      if (typeof updateSimulatedCalculations === 'function' && document.getElementById('installmentsSimulatorModal')?.classList.contains('active')) {
        updateSimulatedCalculations();
      }
      if (typeof renderDesktopExecutiveCharts === 'function') {
        renderDesktopExecutiveCharts();
      }
      if (typeof renderDonutChart === 'function') {
        renderDonutChart();
      }
    }

    function updateThemeButtons(theme) {
      const btn = document.getElementById('themeToggleBtn');
      const settingsBtn = document.getElementById('settingsThemeBtn');
      if (btn) {
        btn.textContent = theme === 'twilight' ? '☀️' : '🌙';
        btn.title = theme === 'twilight' ? 'Cambiar a Modo Claro Cristal' : 'Cambiar a Modo Noche Suave';
      }
      if (settingsBtn) {
        settingsBtn.textContent = theme === 'twilight' ? '☀️ Cambiar a Modo Claro Cristal' : '🌙 Cambiar a Modo Noche Suave';
      }
    }

    function initTheme() {
      // Migración automática v72 para asegurar la estética ejecutiva Obsidian Dark de los mockups
      let savedTheme = localStorage.getItem('finanzas_theme');
      if (!localStorage.getItem('aliviafin_theme_v72_migrated')) {
        savedTheme = 'twilight';
        localStorage.setItem('finanzas_theme', 'twilight');
        localStorage.setItem('aliviafin_theme_v72_migrated', 'true');
      }
      if (!savedTheme) savedTheme = 'twilight';

      const isDark = (savedTheme === 'twilight');
      document.documentElement.classList.toggle('theme-twilight', isDark);
      document.body.classList.toggle('theme-twilight', isDark);

      const meta = document.getElementById('themeColorMeta') || document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', isDark ? '#090d16' : '#fbfbfd');
      }

      updateThemeButtons(savedTheme);
    }

    // ================================================================
    // MODO PRIVACIDAD APPLE (MÁSCARA TRADICIONAL CON PUNTOS S/ ••••• v67.2)
    // ================================================================
    function isPrivacyModeActive() {
      return localStorage.getItem('aliviafin_privacy_mode') === 'true';
    }

    function syncPrivacyUI(isActive) {
      if (isActive) {
        const sym = (typeof getCurrencySymbol === 'function') ? getCurrencySymbol() : 'S/';
        document.documentElement.style.setProperty('--privacy-mask-text', `"${sym} •••••"`);
        document.documentElement.style.setProperty('--privacy-hero-mask', `"${sym} ••••• / día"`);
        document.documentElement.style.setProperty('--privacy-alert-mask', `"⚠️ Faltan ${sym} ••••• para pendientes"`);
        document.body.classList.add('privacy-active');
      } else {
        document.body.classList.remove('privacy-active');
      }

      const btnNav = document.getElementById('privacyToggleBtn');
      if (btnNav) {
        btnNav.textContent = isActive ? '🙈' : '👁️';
        btnNav.classList.toggle('active', isActive);
        btnNav.title = isActive ? 'Mostrar saldos (Privacidad activa)' : 'Ocultar saldos (Modo Privacidad)';
      }

      const deskIcon = document.getElementById('deskPrivacyIcon');
      const deskLabel = document.getElementById('deskPrivacyLabel');
      const deskBtn = document.getElementById('deskNavPrivacyBtn');
      if (deskIcon) deskIcon.textContent = isActive ? '🙈' : '👁️';
      if (deskLabel) deskLabel.textContent = isActive ? 'Mostrar Saldos' : 'Ocultar Saldos';
      if (deskBtn) deskBtn.classList.toggle('active', isActive);

      const setPrivIcon = document.getElementById('settingsPrivacyIcon');
      const setPrivLabel = document.getElementById('settingsPrivacyLabel');
      const setPrivBtn = document.getElementById('settingsPrivacyBtn');
      if (setPrivIcon) setPrivIcon.textContent = isActive ? '🙈' : '👁️';
      if (setPrivLabel) setPrivLabel.textContent = isActive ? 'Mostrar Saldos' : 'Ocultar Saldos';
      if (setPrivBtn) setPrivBtn.classList.toggle('active', isActive);

      if (typeof renderDesktopExecutiveCharts === 'function' && (desktopCashflowChartObj || desktopCategoryChartObj)) {
        renderDesktopExecutiveCharts();
      }
    }

    function togglePrivacyMode() {
      const current = isPrivacyModeActive();
      const next = !current;
      localStorage.setItem('aliviafin_privacy_mode', next ? 'true' : 'false');
      syncPrivacyUI(next);
      if (navigator.vibrate) navigator.vibrate(25);
      showToast(next ? '🔒 Modo Privacidad: Saldos protegidos con puntos' : '👁️ Modo Privacidad: Saldos visibles', 'info');
    }

    function initPrivacyMode() {
      syncPrivacyUI(isPrivacyModeActive());
    }

    function handleBackdropClick(e, modalId) {
      if (e.target.id === modalId) {
        if (modalId === 'whatsNewModal') {
          dismissWhatsNewModal();
        } else {
          closeModal(modalId);
        }
      }
    }

    function populateMonthDropdown() {
      const monthSelect = document.getElementById('monthSelect');
      monthSelect.innerHTML = '';

      const monthsEs = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

      // Solo meses con formato válido "Mes YYYY", ordenados cronológicamente
      const validMonths = getSortedMonths();

      validMonths.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        const parts = m.split(' ');
        opt.textContent = `${parts[0].substring(0,3)} ${parts[1]}`;
        if (m === appState.currentMonth) opt.selected = true;
        monthSelect.appendChild(opt);
      });

      // Si el mes activo no está en la lista, ir al más reciente
      if (validMonths.length > 0 && !validMonths.includes(appState.currentMonth)) {
        appState.currentMonth = validMonths[validMonths.length - 1];
        monthSelect.value = appState.currentMonth;
      }
    }

    function changeMonth(month) {
      sessionStorage.setItem('aliviafin_session_month', month);
      appState.currentMonth = month;
      ensureMonthTransactions(month);
      ensureMonthIncomes(month);
      saveState();
      renderAll();
    }

    /* ================================================================
       ZEN EXECUTIVE LOGIC: SAFE TO SPEND & RECENT FEED (FASE 1)
       ================================================================ */

    function calculateSafeToSpend() {
      const curMonth = appState.currentMonth || getCurrentCalendarMonthName();
      const totalIncome = getMonthTotalIncome();
      const txs = getMonthTxList();
      const totalSpent = txs.reduce((sum, item) => sum + item.amount, 0);

      // Mapeo de meses en español
      const monthMap = {
        'Enero': 0, 'Febrero': 1, 'Marzo': 2, 'Abril': 3, 'Mayo': 4, 'Junio': 5,
        'Julio': 6, 'Agosto': 7, 'Septiembre': 8, 'Octubre': 9, 'Noviembre': 10, 'Diciembre': 11
      };
      const parts = curMonth.split(' ');
      const mName = parts[0];
      const mYear = parseInt(parts[1], 10) || new Date().getFullYear();
      const mIndex = monthMap[mName] !== undefined ? monthMap[mName] : new Date().getMonth();

      const totalDaysInMonth = new Date(mYear, mIndex + 1, 0).getDate();
      
      const now = new Date();
      const isCurrentRealMonth = (now.getFullYear() === mYear && now.getMonth() === mIndex);
      const isPastMonth = (mYear < now.getFullYear() || (mYear === now.getFullYear() && mIndex < now.getMonth()));

      let remainingDays = 1;
      if (isPastMonth) {
        remainingDays = 1;
      } else if (isCurrentRealMonth) {
        remainingDays = Math.max(1, totalDaysInMonth - now.getDate() + 1);
      } else {
        remainingDays = totalDaysInMonth; // Mes futuro
      }

      // Dinero libre total del mes
      const freeTotalMonth = totalIncome - totalSpent;
      const freePerDay = freeTotalMonth > 0 ? (freeTotalMonth / remainingDays) : 0;

      const spendPct = totalIncome > 0 ? Math.min(100, Math.round((totalSpent / totalIncome) * 100)) : (totalSpent > 0 ? 100 : 0);

      let status = 'green';
      let statusLabel = '🟢 Holgado';
      if (freeTotalMonth <= 0 || spendPct >= 95) {
        status = 'red';
        statusLabel = '🔴 Al Límite';
      } else if (spendPct >= 80 || freePerDay < 35) {
        status = 'yellow';
        statusLabel = '🟡 Ajustado';
      }

      return {
        mName,
        totalIncome,
        totalSpent,
        freeTotalMonth,
        freePerDay,
        remainingDays,
        totalDaysInMonth,
        spendPct,
        status,
        statusLabel,
        isPastMonth
      };
    }

    function renderSafeToSpendCard() {
      const heroCard = document.getElementById('heroSafeToSpendCard');
      if (!heroCard) return;
      const data = calculateSafeToSpend();
      const sym = getCurrencySymbol();
      const loc = getActiveCurrency().locale;
      
      const elBadgeText = document.getElementById('heroSafeBadgeText');
      const elPulse = document.getElementById('heroSafePulse');
      const elPastBanner = document.getElementById('heroSafePastMonthBanner');

      const elDaily = document.getElementById('heroSafeDailyAmount');
      const elSubtitle = document.getElementById('heroSafeMonthSubtitle');
      const elDays = document.getElementById('heroSafeDaysLeftLabel');
      const elRate = document.getElementById('heroSafeSpendRateLabel');
      const elStatus = document.getElementById('heroSafeStatusPill');

      if (data.isPastMonth) {
        if (elBadgeText) elBadgeText.textContent = `MES CERRADO · ${data.mName.toUpperCase()}`;
        if (elPulse) elPulse.style.display = 'none';

        if (elDaily) {
          if (data.freeTotalMonth < 0) {
            elDaily.innerHTML = `<span style="font-size: 24px; font-weight: 800; color: #fecaca;">Cierre: -${sym} ${Math.abs(data.freeTotalMonth).toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`;
          } else {
            elDaily.innerHTML = `<span class="hero-zen-unit">${sym} </span>${data.freeTotalMonth.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span class="hero-zen-unit">cierre final</span>`;
          }
        }

        if (elSubtitle) {
          if (data.freeTotalMonth >= 0) {
            elSubtitle.textContent = `Superávit final del mes: ${sym} ${data.freeTotalMonth.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          } else {
            elSubtitle.textContent = `⚠️ Este mes cerró con déficit de ${sym} ${Math.abs(data.freeTotalMonth).toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        }

        if (elDays) {
          elDays.textContent = 'Histórico (Mes cerrado)';
        }

        if (elPastBanner) {
          const calMonth = getCurrentCalendarMonthName();
          elPastBanner.style.display = 'block';
          elPastBanner.innerHTML = `📅 Viendo historial de ${data.mName}. <strong style="text-decoration: underline;">Toca para volver a ${calMonth} (Hoy) ➔</strong>`;
          elPastBanner.onclick = () => {
            sessionStorage.removeItem('aliviafin_session_month');
            changeMonth(calMonth);
          };
        }
      } else {
        if (elBadgeText) elBadgeText.textContent = 'DISPONIBLE HOY';
        if (elPulse) elPulse.style.display = 'inline-block';
        if (elPastBanner) elPastBanner.style.display = 'none';

        if (elDaily) {
          elDaily.innerHTML = `<span class="hero-zen-unit">${sym} </span>${data.freePerDay.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span class="hero-zen-unit">/ día</span>`;
        }

        if (elSubtitle) {
          if (data.freeTotalMonth >= 0) {
            elSubtitle.textContent = `${sym} ${data.freeTotalMonth.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} libre proyectado este mes`;
          } else {
            elSubtitle.textContent = `⚠️ Presupuesto excedido por ${sym} ${Math.abs(data.freeTotalMonth).toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        }

        if (elDays) {
          elDays.textContent = `${data.remainingDays} días restantes`;
        }
      }

      const elProgressBar = document.getElementById('heroSafeProgressBar');
      if (elProgressBar) {
        elProgressBar.style.width = Math.min(data.spendPct, 100) + '%';
        if (data.status === 'red') {
          elProgressBar.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
        } else if (data.status === 'yellow') {
          elProgressBar.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
        } else {
          elProgressBar.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
        }
      }

      if (elRate) {
        elRate.textContent = `${data.spendPct}% comprometido`;
      }

      if (elStatus) {
        elStatus.className = `hero-zen-pill-status status-${data.status}`;
        elStatus.textContent = data.isPastMonth ? (data.freeTotalMonth >= 0 ? '🟢 Cerrado en Positivo' : '🔴 Cerrado en Déficit') : data.statusLabel;
      }

      if (heroCard) {
        heroCard.classList.remove('status-green', 'status-yellow', 'status-red');
        heroCard.classList.add(`status-${data.status}`);
      }
    }

    // ================================================================
    // RADAR DE PRÓXIMOS VENCIMIENTOS (APPLE FINTECH CARD v67.0)
    // ================================================================
    function renderUpcomingDueDates() {
      const container = document.getElementById('upcomingBillsContainer');
      if (!container) return;

      const txs = getMonthTxList();
      const today = new Date().getDate();
      const sym = getCurrencySymbol();
      const loc = getActiveCurrency().locale;

      // Filtrar gastos pendientes del mes actual
      const pendingTxs = txs.filter(t => (t.status || 'Pagado') === 'Pendiente');

      if (pendingTxs.length === 0) {
        container.innerHTML = `
          <div class="upcoming-bills-card" style="margin-bottom: 14px; padding: 12px 16px;">
            <div class="upcoming-bills-zen">
              <span>✨</span>
              <span>Todo al día · No tienes gastos pendientes en este mes.</span>
            </div>
          </div>
        `;
        return;
      }

      // Mapear con días restantes
      const withDue = pendingTxs.map(t => {
        const dueDay = parseInt(getEffectiveDueDate(t)) || 15;
        const daysDiff = dueDay - today;
        return {
          ...t,
          dueDay,
          daysDiff
        };
      });

      // Filtrar: vencidos en el mes (daysDiff < 0) o que vencen en los próximos 5 días (daysDiff >= 0 && daysDiff <= 5)
      const upcoming = withDue.filter(t => t.daysDiff <= 5);

      if (upcoming.length === 0) {
        const future = withDue.filter(t => t.daysDiff > 5).sort((a, b) => a.daysDiff - b.daysDiff);
        const nextIn = future.length > 0 ? ` · Próximo pago en ${future[0].daysDiff} días (${escapeHtml(future[0].name)})` : '';
        container.innerHTML = `
          <div class="upcoming-bills-card" style="margin-bottom: 14px; padding: 12px 16px;">
            <div class="upcoming-bills-zen">
              <span>✨</span>
              <span>Todo al día por los próximos 5 días${nextIn}.</span>
            </div>
          </div>
        `;
        return;
      }

      // Ordenar por urgencia: días menores primero
      upcoming.sort((a, b) => a.daysDiff - b.daysDiff);

      const totalUpcomingSum = upcoming.reduce((acc, curr) => acc + (curr.amount || 0), 0);
      const displayItems = upcoming.slice(0, 3); // Máximo 3 visibles para no saturar la mente

      container.innerHTML = `
        <div class="upcoming-bills-card">
          <div class="upcoming-bills-header">
            <div class="upcoming-bills-title">
              <span>📅</span>
              <span>Próximos Vencimientos</span>
            </div>
            <div class="upcoming-bills-sum-badge">
              ${upcoming.length} pendientes · ${sym} ${totalUpcomingSum.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div class="upcoming-bills-list">
            ${displayItems.map(item => {
              const catInfo = CATEGORIES[item.category] || { icon: '💳' };
              const icon = catInfo.icon || '💳';
              
              let pillClass = 'due-pill-soon';
              let pillText = `En ${item.daysDiff} días`;
              if (item.daysDiff < 0) {
                pillClass = 'due-pill-urgent';
                pillText = `⚠️ Venció hace ${Math.abs(item.daysDiff)}d`;
              } else if (item.daysDiff === 0) {
                pillClass = 'due-pill-urgent';
                pillText = `⚡ Vence Hoy`;
              } else if (item.daysDiff === 1) {
                pillClass = 'due-pill-tomorrow';
                pillText = `Vence Mañana`;
              }

              return `
                <div class="upcoming-bill-row">
                  <div class="upcoming-bill-info">
                    <div class="upcoming-bill-icon">${icon}</div>
                    <div class="upcoming-bill-texts">
                      <div class="upcoming-bill-name">${escapeHtml(item.name)}</div>
                      <div class="upcoming-bill-due">
                        <span>Día ${item.dueDay}</span>
                        <span class="upcoming-due-pill ${pillClass}">${pillText}</span>
                      </div>
                    </div>
                  </div>
                  <div class="upcoming-bill-action">
                    <div class="upcoming-bill-amount">${sym} ${(item.amount || 0).toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <button type="button" class="btn-pay-quick" onclick="promptPayBill('${item.id}')" title="Marcar como Pagado">
                      <span>✓</span> <span>Pagar</span>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          ${upcoming.length > 3 ? `
            <div style="text-align: center; margin-top: 10px;">
              <button type="button" onclick="switchTab('movimientos'); selectStatusFilter('Pendiente');" style="background:none; border:none; color:var(--primary); font-size:11.5px; font-weight:800; cursor:pointer;">
                Ver los ${upcoming.length} pagos pendientes ➔
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }

    let _pendingPayTxId = null;

    function promptPayBill(id) {
      const txs = getMonthTxList();
      const tx = txs.find(t => t.id === id);
      if (!tx) return;

      _pendingPayTxId = id;
      const sym = getCurrencySymbol();
      const loc = getActiveCurrency().locale;
      const dueDay = getEffectiveDueDate(tx);

      const nameEl = document.getElementById('confirmPayBillName');
      if (nameEl) nameEl.textContent = tx.name;

      const amtEl = document.getElementById('confirmPayBillAmount');
      if (amtEl) amtEl.textContent = `${sym} ${(tx.amount || 0).toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      const dueEl = document.getElementById('confirmPayBillDue');
      if (dueEl) dueEl.textContent = `Día ${dueDay}`;

      const btnSubmit = document.getElementById('btnConfirmPayBillSubmit');
      if (btnSubmit) {
        btnSubmit.onclick = function() {
          executeConfirmPayBill();
        };
      }

      openModalById('confirmPayBillModal');
    }

    function executeConfirmPayBill() {
      if (!_pendingPayTxId) return;
      const id = _pendingPayTxId;
      _pendingPayTxId = null;
      closeModal('confirmPayBillModal');

      const txs = getMonthTxList();
      const tx = txs.find(t => t.id === id);
      if (tx) {
        tx.status = 'Pagado';
        if (navigator.vibrate) navigator.vibrate(25);
        addAuditLog('✅ Pago Confirmado', `${tx.name} marcado como Pagado en ${appState.currentMonth}`);
        showToast(`✅ ${tx.name} marcado como Pagado`, 'success');
        saveState();
        renderAll();
      }
    }

    function quickPayBill(id, name) {
      promptPayBill(id);
    }

    // ================================================================
    // CONCILIACIÓN BANCARIA (ARQUEO EN 1 TAP v67.0)
    // ================================================================
    let _lastReconciliationDiff = 0;

    function openReconcileModal() {
      const currentBalance = getAccumulatedBalance(appState.currentMonth);
      const sym = getCurrencySymbol();
      const loc = getActiveCurrency().locale;

      const appBalEl = document.getElementById('reconcileAppBalance');
      if (appBalEl) {
        appBalEl.textContent = sym + ' ' + currentBalance.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      const input = document.getElementById('reconcileBankInput');
      if (input) input.value = '';

      const diffPanel = document.getElementById('reconcileDiffPanel');
      if (diffPanel) diffPanel.style.display = 'none';

      const btnApply = document.getElementById('btnApplyReconciliation');
      if (btnApply) btnApply.style.display = 'none';

      const btnMissing = document.getElementById('btnQuickMissingExpense');
      if (btnMissing) btnMissing.style.display = 'none';

      _lastReconciliationDiff = 0;
      openModalById('reconcileBalanceModal');
    }

    function calculateReconciliationDiff() {
      const input = document.getElementById('reconcileBankInput');
      const diffPanel = document.getElementById('reconcileDiffPanel');
      const statusEl = document.getElementById('reconcileDiffStatus');
      const explanationEl = document.getElementById('reconcileDiffExplanation');
      const btnApply = document.getElementById('btnApplyReconciliation');
      const btnMissing = document.getElementById('btnQuickMissingExpense');

      if (!input || !diffPanel) return;

      const rawVal = input.value.trim();
      if (rawVal === '') {
        diffPanel.style.display = 'none';
        if (btnApply) btnApply.style.display = 'none';
        if (btnMissing) btnMissing.style.display = 'none';
        _lastReconciliationDiff = 0;
        return;
      }

      const bankReal = parseFloat(rawVal) || 0;
      const appBalance = getAccumulatedBalance(appState.currentMonth);
      const diff = Math.round(((bankReal - appBalance) + Number.EPSILON) * 100) / 100;
      _lastReconciliationDiff = diff;

      const sym = getCurrencySymbol();
      const loc = getActiveCurrency().locale;
      diffPanel.style.display = 'block';

      if (Math.abs(diff) < 0.01) {
        diffPanel.className = 'reconcile-diff-panel reconcile-diff-matched';
        statusEl.innerHTML = '✨ ¡Tu saldo está 100% cuadrado!';
        explanationEl.textContent = 'El saldo en tu aplicación bancaria coincide exactamente con lo registrado en AliviaFin.';
        if (btnApply) btnApply.style.display = 'none';
        if (btnMissing) btnMissing.style.display = 'none';
      } else {
        diffPanel.className = 'reconcile-diff-panel reconcile-diff-unmatched';
        const formattedDiff = Math.abs(diff).toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        
        if (diff < 0) {
          statusEl.innerHTML = `⚠️ Descuadre detectado: -${sym} ${formattedDiff}`;
          explanationEl.textContent = `Tu app bancaria tiene ${sym} ${formattedDiff} menos que AliviaFin. Es muy probable que hayas realizado una compra o comisión bancaria sin registrar.`;
          if (btnApply) {
            btnApply.style.display = 'block';
            btnApply.textContent = `⚡ Cuadrar Saldo (-${sym} ${formattedDiff})`;
          }
          if (btnMissing) {
            btnMissing.style.display = 'block';
            btnMissing.textContent = `🔍 Registrar Gasto Faltante de ${sym} ${formattedDiff}`;
          }
        } else {
          statusEl.innerHTML = `💵 Saldo a favor detectado: +${sym} ${formattedDiff}`;
          explanationEl.textContent = `Tu app bancaria tiene ${sym} ${formattedDiff} más que AliviaFin. Es probable que hayas recibido un ingreso adicional, devolución o abono.`;
          if (btnApply) {
            btnApply.style.display = 'block';
            btnApply.textContent = `⚡ Cuadrar Saldo (+${sym} ${formattedDiff})`;
          }
          if (btnMissing) btnMissing.style.display = 'none';
        }
      }
    }

    function applyReconciliationAdjustment() {
      if (Math.abs(_lastReconciliationDiff) < 0.01) return;

      const month = appState.currentMonth;
      const diff = _lastReconciliationDiff;
      const sym = getCurrencySymbol();
      const loc = getActiveCurrency().locale;
      const absAmount = Math.abs(diff);

      if (diff > 0) {
        // Ingreso de ajuste
        if (!appState.incomes) appState.incomes = {};
        if (!appState.incomes[month]) ensureMonthIncomes(month);
        appState.incomes[month].push({
          id: 'inc_adj_' + Date.now(),
          name: 'Ajuste Conciliación Bancaria',
          amount: absAmount,
          status: 'Recibido',
          date: new Date().getDate()
        });
        addAuditLog('⚖️ Conciliación', `Ajuste de ingreso +${sym} ${absAmount.toLocaleString(loc)} a favor en ${month}`);
      } else {
        // Gasto de ajuste
        if (!appState.transactions) appState.transactions = {};
        if (!appState.transactions[month]) appState.transactions[month] = [];
        appState.transactions[month].push({
          id: 'exp_adj_' + Date.now(),
          name: 'Ajuste Conciliación Bancaria',
          amount: absAmount,
          category: 'Varios',
          status: 'Pagado',
          paymentMethod: 'Banco',
          date: new Date().getDate()
        });
        addAuditLog('⚖️ Conciliación', `Ajuste de gasto -${sym} ${absAmount.toLocaleString(loc)} para cuadrar con banco en ${month}`);
      }

      saveState();
      closeModal('reconcileBalanceModal');
      showToast('✅ Saldo conciliado y cuadrado con éxito', 'success');
      renderAll();
    }

    function openMissingExpenseFromReconcile() {
      const absAmount = Math.abs(_lastReconciliationDiff);
      closeModal('reconcileBalanceModal');
      openQuickExpenseModal();
      _quickAmountBuffer = absAmount.toString();
      updateQuickDisplay();
    }

    function renderRecentTransactions() {
      const container = document.getElementById('recentTxContainer');
      const badge = document.getElementById('recentTxCountBadge');
      if (!container) return;

      const txs = getMonthTxList();
      if (badge) badge.textContent = txs.length.toString();

      if (txs.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 22px 10px; color: var(--text-muted); font-size: 12px;">
            <span style="font-size: 26px; display: block; margin-bottom: 6px;">✨</span>
            Aún no tienes gastos registrados este mes.<br>
            <button type="button" class="btn btn-primary btn-sm" onclick="openQuickExpenseModal()" style="margin-top: 10px; font-size: 11.5px; padding: 6px 14px;">
              ⚡ Registrar Gasto en 1 toque
            </button>
          </div>
        `;
        return;
      }

      // Ordenar: últimos añadidos primero (slice de 4)
      const sorted = [...txs].reverse().slice(0, 4);

      container.innerHTML = sorted.map(t => {
        const catInfo = CATEGORIES[t.category] || { icon: '🏷️', color: '#6366f1' };
        const icon = catInfo.icon || '🏷️';
        const isPagado = (t.status || 'Pagado') === 'Pagado';
        const methodTag = t.paymentMethod ? `· <span>${t.paymentMethod}</span>` : '';

        return `
          <div class="recent-tx-item" onclick="openEditExpenseModal('${t.id}')" title="Toca para ver o editar">
            <div class="recent-tx-left">
              <div class="recent-tx-icon-box">${icon}</div>
              <div class="recent-tx-info">
                <div class="recent-tx-name">${escapeHtml(t.name)}</div>
                <div class="recent-tx-meta">
                  <span class="recent-tx-cat-pill">${escapeHtml(t.category)}</span>
                  ${isPagado ? '' : '<span title="Pendiente">⏳</span>'}
                  ${methodTag}
                </div>
              </div>
            </div>
            <div class="recent-tx-amount">${getCurrencySymbol()} ${(t.amount || 0).toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        `;
      }).join('');
    }

    /* ====== REGISTRO RÁPIDO EXPRESS (2 TOQUES) ====== */
    let _quickAmountBuffer = '0';
    let _quickSelectedMethod = 'Yape';
    let _quickSelectedCategory = 'Comida fuera';

    function openQuickExpenseModal() {
      _quickAmountBuffer = '0';
      _quickSelectedMethod = 'Yape';
      _quickSelectedCategory = 'Comida fuera';
      updateQuickDisplay();

      // Resetear métodos
      document.querySelectorAll('.quick-method-pill').forEach(b => {
        b.classList.toggle('active', b.id === 'quickMethodYape');
      });

      // Resetear categorías
      document.querySelectorAll('.quick-cat-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-cat') === 'Comida fuera');
      });

      openModalById('quickExpenseModal');
    }

    function closeQuickExpenseModal() {
      closeModal('quickExpenseModal');
    }

    function updateQuickDisplay() {
      const el = document.getElementById('quickDisplayAmount');
      if (!el) return;
      if (_quickAmountBuffer === '' || _quickAmountBuffer === '0') {
        el.textContent = '0.00';
        el.style.opacity = '0.55';
      } else {
        el.textContent = _quickAmountBuffer;
        el.style.opacity = '1';
      }
    }

    function handleQuickKeypad(key) {
      if (key === 'backspace') {
        if (_quickAmountBuffer.length > 1) {
          _quickAmountBuffer = _quickAmountBuffer.slice(0, -1);
        } else {
          _quickAmountBuffer = '0';
        }
      } else if (key === '.') {
        if (!_quickAmountBuffer.includes('.')) {
          _quickAmountBuffer += '.';
        }
      } else {
        // Dígitos 0-9
        if (_quickAmountBuffer === '0') {
          _quickAmountBuffer = key;
        } else {
          // Si ya tiene punto, limitar a 2 decimales
          if (_quickAmountBuffer.includes('.')) {
            const decPart = _quickAmountBuffer.split('.')[1];
            if (decPart && decPart.length >= 2) return;
          }
          if (_quickAmountBuffer.length < 8) {
            _quickAmountBuffer += key;
          }
        }
      }
      updateQuickDisplay();
    }

    function selectQuickMethod(method) {
      _quickSelectedMethod = method;
      document.querySelectorAll('.quick-method-pill').forEach(b => {
        b.classList.toggle('active', b.textContent.includes(method));
      });
    }

    function selectQuickCategory(cat, btn) {
      _quickSelectedCategory = cat;
      document.querySelectorAll('.quick-cat-btn').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
    }

    function switchToDetailedExpenseModal() {
      const amt = parseFloat(_quickAmountBuffer) || 0;
      closeQuickExpenseModal();
      openAddExpenseModal();
      if (amt > 0) {
        const txAmt = document.getElementById('txAmount');
        if (txAmt) txAmt.value = amt.toFixed(2);
      }
      const txCat = document.getElementById('txCategory');
      if (txCat && _quickSelectedCategory) {
        txCat.value = _quickSelectedCategory;
      }
    }

    async function saveQuickExpense() {
      const amount = parseFloat(_quickAmountBuffer);
      if (isNaN(amount) || amount <= 0) {
        showToast('⚠️ Ingresa un monto mayor a 0', 'warning');
        return;
      }

      ensureMonthTransactions(appState.currentMonth);
      
      const newTx = {
        id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: _quickSelectedCategory,
        amount: amount,
        category: _quickSelectedCategory,
        status: 'Pagado',
        paymentMethod: _quickSelectedMethod,
        dueDate: new Date().getDate(),
        date: new Date().toISOString().split('T')[0],
        notes: `⚡ Registro rápido (${_quickSelectedMethod})`
      };

      appState.transactions[appState.currentMonth].push(newTx);
      addAuditLog('⚡ Gasto Rápido', `S/ ${amount.toFixed(2)} en ${_quickSelectedCategory} vía ${_quickSelectedMethod}`);
      
      saveState();
      closeQuickExpenseModal();
      showToast(`✨ S/ ${amount.toFixed(2)} registrado en ${_quickSelectedCategory}`, 'success');
      renderAll();

      if (currentUser && supabaseClient) {
        try {
          await syncStateToServer();
        } catch (e) {
          console.warn('Sync server error:', e);
        }
      }
    }

    /* ====== SWITCH TAB (NAVEGACIÓN 5 PESTAÑAS RESPONSIVE) ====== */
    function switchTab(tabId) {
      // Redirección de compatibilidad para auditoria -> consejos con scroll
      if (tabId === 'auditoria') {
        tabId = 'consejos';
        setTimeout(() => {
          const sec = document.getElementById('auditCardSection');
          if (sec) sec.scrollIntoView({ behavior: 'smooth' });
          const collapse = document.getElementById('auditTableContainerCollapse');
          if (collapse) collapse.style.display = 'block';
        }, 150);
      }

      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.desktop-nav-item').forEach(el => el.classList.remove('active'));

      const targetTab = document.getElementById('tab-' + tabId);
      if (targetTab) targetTab.classList.add('active');

      // Scroll a tope de inmediato para no arrastrar posición de scroll previa entre pestañas
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } catch (e) {
        window.scrollTo(0, 0);
      }
      
      // Sincronizar items de la barra inferior móvil
      document.querySelectorAll('.bottom-nav .nav-item').forEach(el => el.classList.remove('active'));
      if (tabId === 'inicio') {
        const btn = document.getElementById('navTabInicio');
        if (btn) btn.classList.add('active');
      } else if (tabId === 'movimientos') {
        const btn = document.getElementById('navTabMovimientos');
        if (btn) btn.classList.add('active');
      } else if (tabId === 'plan' || tabId === 'metas' || tabId === 'consejos') {
        const btn = document.getElementById('navTabPlan');
        if (btn) btn.classList.add('active');
      }

      // Sincronizar items de la barra lateral de escritorio
      const deskNavMap = {
        'inicio': 'deskNavTabInicio',
        'movimientos': 'deskNavTabMovimientos',
        'plan': 'deskNavTabPlan',
        'metas': 'deskNavTabMetas',
        'consejos': 'deskNavTabConsejos',
        'founder': 'deskNavMasterBtn'
      };
      if (deskNavMap[tabId]) {
        const dBtn = document.getElementById(deskNavMap[tabId]);
        if (dBtn) dBtn.classList.add('active');
      }

      if (tabId === 'founder') {
        document.body.classList.add('founder-mode-active');
        enterFounderModule();
      } else {
        document.body.classList.remove('founder-mode-active');
        stopFounderTicker();
      }

      if (tabId === 'inicio') {
        renderSafeToSpendCard();
        renderRecentTransactions();
        renderMetrics();
        checkAndRenderProRenewalBanner();
      } else if (tabId === 'movimientos') {
        renderTransactions();
        renderIncomes();
      } else if (tabId === 'plan') {
        setTimeout(() => {
          render503020Rule();
          renderGastosHormiga();
          renderCategoryBudgets();
          renderCuotasTracker();
          renderHistoryChart();
          if (window.innerWidth <= 768) {
            switchPlanMobileSection('analysis');
          }
        }, 80);
      } else if (tabId === 'metas') {
        renderGoals();
        renderMetrics();
      } else if (tabId === 'consejos') {
        setTimeout(() => {
          if (typeof renderDebtCommandCenter === 'function') {
            renderDebtCommandCenter();
          }
          renderAuditTable();
        }, 80);
      }
    }

    function renderCategoryChips() {
      const container = document.getElementById('categoryChips');
      if (!container) return; // Feature disabled by UX request
      const cats = ['TODAS', ...Object.keys(CATEGORIES)];

      container.innerHTML = cats.map(c => `
        <div class="chip ${c === currentCategoryFilter ? 'active' : ''}" onclick="selectCategoryChip('${c}')">
          ${c === 'TODAS' ? '✨ Todas' : (((CATEGORIES[c] && CATEGORIES[c].icon) || '🏷️') + ' ' + c)}
        </div>
      `).join('');
    }

    function selectCategoryChip(cat) {
      currentCategoryFilter = cat;
      appState.activeCategoryChip = cat;
      renderCategoryChips();
      updateClearFiltersBtn();
      renderTransactions();
      saveState();
    }

    function selectStatusFilter(status) {
      currentStatusFilter = status;
      appState.activeStatusFilter = status;
      
      document.getElementById('chipStateAll').className = 'chip ' + (status === 'TODOS' ? 'active' : '');
      document.getElementById('chipStatePagado').className = 'chip ' + (status === 'Pagado' ? 'active' : '');
      document.getElementById('chipStatePendiente').className = 'chip ' + (status === 'Pendiente' ? 'active' : '');

      updateClearFiltersBtn();
      renderTransactions();
      saveState();
    }

    function onSearchInput() {
      const val = document.getElementById('searchTx').value;
      const clearX = document.getElementById('searchClearX');
      if (clearX) clearX.style.display = val ? 'block' : 'none';
      updateClearFiltersBtn();
      renderTransactions();
    }

    function clearSearchInput() {
      const input = document.getElementById('searchTx');
      if (input) input.value = '';
      const clearX = document.getElementById('searchClearX');
      if (clearX) clearX.style.display = 'none';
      updateClearFiltersBtn();
      renderTransactions();
    }

    function clearAllFilters() {
      // Limpiar texto de búsqueda
      const input = document.getElementById('searchTx');
      if (input) input.value = '';
      const clearX = document.getElementById('searchClearX');
      if (clearX) clearX.style.display = 'none';

      // Limpiar filtros avanzados
      const advCat = document.getElementById('advFilterCategory');
      if (advCat) advCat.value = 'ALL';
      const advAmount = document.getElementById('advFilterAmount');
      if (advAmount) advAmount.value = 'ALL';

      // Limpiar filtro de estado
      currentStatusFilter = 'TODOS';
      appState.activeStatusFilter = 'TODOS';
      document.getElementById('chipStateAll').className = 'chip active';
      document.getElementById('chipStatePagado').className = 'chip';
      document.getElementById('chipStatePendiente').className = 'chip';

      // Limpiar filtro de categoría
      currentCategoryFilter = 'TODAS';
      appState.activeCategoryChip = 'TODAS';
      renderCategoryChips();

      // Restaurar orden por defecto
      const sortTx = document.getElementById('sortTx');
      if (sortTx) sortTx.value = 'newest';

      updateClearFiltersBtn();
      renderTransactions();
      saveState();
      showToast('✨ Filtros limpiados', 'info');
    }

    function onAdvFilterChange() {
      updateClearFiltersBtn();
      renderTransactions();
    }

    function updateClearFiltersBtn() {
      const btn = document.getElementById('clearFiltersBtn');
      if (!btn) return;
      const advCat = document.getElementById('advFilterCategory');
      const advAmount = document.getElementById('advFilterAmount');
      const hasAdv = (advCat && advCat.value !== 'ALL') ||
                     (advAmount && advAmount.value !== 'ALL');
      const hasFilter = currentStatusFilter !== 'TODOS' ||
                        currentCategoryFilter !== 'TODAS' ||
                        hasAdv ||
                        (document.getElementById('searchTx') && document.getElementById('searchTx').value.trim() !== '');
      btn.style.display = hasFilter ? 'flex' : 'none';
    }

    function exportFilteredTransactions() {
      const search = (document.getElementById('searchTx')?.value || '').toLowerCase().trim();
      const filterStatus = currentStatusFilter;
      const filterCat = document.getElementById('advFilterCategory')?.value || currentCategoryFilter;
      const filterAccount = document.getElementById('advFilterAccount')?.value || 'ALL';
      const filterAmount = document.getElementById('advFilterAmount')?.value || 'ALL';

      let txs = getMonthTxList();

      if (search) {
        txs = txs.filter(t => (t.name || '').toLowerCase().includes(search) || (t.amount || 0).toString().includes(search));
      }
      if (filterStatus !== 'TODOS') {
        txs = txs.filter(t => (t.status || 'Pagado') === filterStatus);
      }
      if (filterCat !== 'TODAS' && filterCat !== 'ALL') {
        txs = txs.filter(t => t.category === filterCat);
      }
      if (filterAccount !== 'ALL') {
        txs = txs.filter(t => (t.account || '').includes(filterAccount) || (t.paymentMethod || '').includes(filterAccount));
      }
      if (filterAmount === 'MICRO') {
        txs = txs.filter(t => (t.amount || 0) <= 35);
      } else if (filterAmount === 'MID') {
        txs = txs.filter(t => (t.amount || 0) > 35 && (t.amount || 0) <= 150);
      } else if (filterAmount === 'HIGH') {
        txs = txs.filter(t => (t.amount || 0) > 150);
      }

      if (txs.length === 0) {
        showToast('⚠️ No hay transacciones para exportar con estos filtros', 'warning');
        return;
      }

      // Generar CSV
      let csvContent = 'Concepto,Categoría,Estado,Monto (S/),Vencimiento\n';
      txs.forEach(t => {
        const cleanName = `"${(t.name || '').replace(/"/g, '""')}"`;
        const cleanCat = `"${(t.category || '').replace(/"/g, '""')}"`;
        const st = t.status || 'Pagado';
        const amt = (t.amount || 0).toFixed(2);
        const due = getEffectiveDueDate(t);
        csvContent += `${cleanName},${cleanCat},${st},${amt},${due}\n`;
      });

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      const cleanMonth = (appState.currentMonth || 'Mes').replace(/\s+/g, '_');
      link.setAttribute('download', `Finanzas_Gastos_${cleanMonth}_filtrados.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`📥 Exportadas ${txs.length} transacciones`, 'success');
    }

    function setHistoryPeriodFilter(periodKey) {
      currentHistoryPeriodFilter = periodKey;
      appState.historyPeriodFilter = periodKey;
      saveState();

      const filterIds = ['ALL', 'CURR', 'Q3', 'Q4'];
      filterIds.forEach(k => {
        const el = document.getElementById('periodFilter' + k);
        if (el) el.className = 'chip ' + (k === periodKey ? 'active' : '');
      });

      renderHistoryChart();
      renderHistoryTable();
    }

    function getSortedMonths() {
      const monthsEs = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      const now = new Date();
      const currentYear = now.getFullYear();

      // Recopilar todos los meses con datos existentes
      const allMonthsSet = new Set([
        ...Object.keys(appState.transactions || {}),
        ...Object.keys(appState.incomes || {})
      ]);

      // Asegurar SIEMPRE todos los meses del año actual (Enero a Diciembre)
      monthsEs.forEach(m => {
        allMonthsSet.add(`${m} ${currentYear}`);
      });

      return Array.from(allMonthsSet)
        .filter(m => {
          const p = m.split(' ');
          return p.length === 2 && monthsEs.includes(p[0]) && /^\d{4}$/.test(p[1]);
        })
        .sort((a, b) => {
          const [mA, yA] = a.split(' '), [mB, yB] = b.split(' ');
          return (parseInt(yA) - parseInt(yB)) || (monthsEs.indexOf(mA) - monthsEs.indexOf(mB));
        });
    }

    function ensureMonthTransactions(targetMonth) {
      if (!appState.transactions) appState.transactions = {};
      if (!appState.transactions[targetMonth]) {
        appState.transactions[targetMonth] = [];
      }

      // Si el mes ya tiene transacciones, no tocarlo
      if (appState.transactions[targetMonth].length > 0) return;

      const isCesar = isAdminCesar();
      if (isCesar) return; // César ya tiene sus meses históricos y cuotas definidas

      // Si es un usuario regular y el mes está vacío, propagar gastos fijos desde el último mes con datos
      const allMonths = getSortedMonths();
      const targetIdx = allMonths.indexOf(targetMonth);
      if (targetIdx <= 0) return;

      let sourceMonth = null;
      for (let i = targetIdx - 1; i >= 0; i--) {
        const m = allMonths[i];
        if (appState.transactions[m] && appState.transactions[m].length > 0) {
          sourceMonth = m;
          break;
        }
      }
      if (!sourceMonth) return;

      const sourceTxs = appState.transactions[sourceMonth];
      sourceTxs.forEach(t => {
        if (t.isInstallment) {
          const sourceIdx = allMonths.indexOf(sourceMonth);
          const currentInst = (t.installmentsCurrent || 1) + (targetIdx - sourceIdx);
          if (currentInst <= (t.installmentsTotal || 1)) {
            appState.transactions[targetMonth].push({
              id: `${targetMonth}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              name: t.name,
              amount: t.amount,
              category: t.category,
              status: 'Pendiente',
              dueDate: t.dueDate || '15',
              isInstallment: true,
              installmentsTotal: t.installmentsTotal,
              installmentsCurrent: currentInst
            });
          }
        } else {
          appState.transactions[targetMonth].push({
            id: `${targetMonth}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            name: t.name,
            amount: t.amount,
            category: t.category,
            status: 'Pendiente',
            dueDate: t.dueDate || '15',
            isInstallment: false,
            installmentsTotal: 1,
            installmentsCurrent: 1
          });
        }
      });
    }

    function getNormalizedNameKey(name) {
      return String(name).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    }

    function getEffectiveDueDate(item) {
      if (item && item.dueDate) {
        return item.dueDate;
      }
      const key = getNormalizedNameKey(item.name);
      if (appState.recurringDueDates && appState.recurringDueDates[key]) {
        return appState.recurringDueDates[key];
      }
      return '15';
    }

    function updateDynamicCategories() {
      if (!appState.customCategories) appState.customCategories = {};
      const baseCats = getUserDefaultCategories();
      CATEGORIES = { ...baseCats, ...appState.customCategories };

      if (appState.deletedCategories) {
        appState.deletedCategories.forEach(cat => {
          delete CATEGORIES[cat];
        });
      }

      const txCategory = document.getElementById('txCategory');
      if (txCategory) {
        const currentVal = txCategory.value;
        txCategory.innerHTML = Object.keys(CATEGORIES).map(cat => `<option value="${cat}">${cat}</option>`).join('');
        if (CATEGORIES[currentVal]) txCategory.value = currentVal;
      }
    }

    function renderAll() {
      updateDynamicCategories();
      populateMonthDropdown();
      ensureMonthTransactions(appState.currentMonth);
      ensureMonthIncomes(appState.currentMonth);

      renderMetrics();
      renderSafeToSpendCard();
      renderUpcomingDueDates();
      renderRecentTransactions();
      renderCuotasTracker();
      renderDonutChart();
      renderDesktopExecutiveCharts();
      renderCategoryChips();

      document.getElementById('chipStateAll').className = 'chip ' + (currentStatusFilter === 'TODOS' ? 'active' : '');
      document.getElementById('chipStatePagado').className = 'chip ' + (currentStatusFilter === 'Pagado' ? 'active' : '');
      document.getElementById('chipStatePendiente').className = 'chip ' + (currentStatusFilter === 'Pendiente' ? 'active' : '');

      renderTransactions();
      render503020Rule();
      renderGastosHormiga();
      renderCategoryBudgets();
      renderHistoryChart();
      renderHistoryTable();
      renderGoals();
      renderPersonalizedTips();
      renderAuditTable();
      renderIncomes();
    }

    function getMonthTxList() {
      return appState.transactions[appState.currentMonth] || [];
    }

    function ensureMonthIncomes(m) {
      if (!appState.incomes) appState.incomes = {};
      const isCesar = isAdminCesar();

      if (!appState.incomes[m] || appState.incomes[m].length === 0) {
        if (isCesar) {
          appState.incomes[m] = [
            { id: 'inc_base_gaby_' + m, name: 'Sueldo Gaby', amount: 4200, status: 'Pendiente', date: 15 },
            { id: 'inc_base_cesar_' + m, name: 'Sueldo César', amount: 4200, status: 'Pendiente', date: 30 },
            { id: 'inc_abono_gaby_' + m, name: 'Abono Gaby', amount: 200, status: 'Pendiente', date: 5 },
            { id: 'inc_abono_cesar_' + m, name: 'Abono César', amount: 200, status: 'Pendiente', date: 5 }
          ];

          // Migración de extraIncomes (legacy) a incomes
          if (appState.extraIncomes && appState.extraIncomes[m] && appState.extraIncomes[m].length > 0) {
            appState.extraIncomes[m].forEach((extra, idx) => {
              appState.incomes[m].push({
                id: 'inc_extra_' + Date.now() + '_' + idx,
                name: extra.name,
                amount: extra.amount,
                status: 'Recibido',
                date: 1
              });
            });
            appState.extraIncomes[m] = [];
          }

          // Caso especial Agosto 2026: valores predeterminados (solo si Supabase no los provee)
          if (m === 'Agosto 2026') {
             const incs = appState.incomes[m];
             const gaby = incs.find(i => i.name === 'Sueldo Gaby');
             if (gaby) gaby.status = 'Recibido';
             const hasJunta = incs.find(i => i.name.toLowerCase().includes('junta'));
             if (!hasJunta) {
               incs.push({ id: 'inc_junta_agosto2026', name: 'Junta de Agosto', amount: 5000, status: 'Recibido', date: 15 });
             } else if (hasJunta.amount < 5000) {
               hasJunta.amount = 5000;
             }
          }
        } else {
          // Usuario regular: generar automáticamente su sueldo configurado
          const salaryAmt = (appState.salary && appState.salary > 0) ? appState.salary : 0;
          if (salaryAmt > 0) {
            const payDay = parseInt(appState.recurringDueDates?.['sueldo'] || 28);
            appState.incomes[m] = [
              { id: 'inc_sueldo_' + m, name: 'Sueldo Mensual', amount: salaryAmt, status: 'Pendiente', date: payDay }
            ];
          } else {
            appState.incomes[m] = [];
          }
        }
      }
    }

    function getMonthTotalIncome(targetMonth = appState.currentMonth) {
      if (typeof ensureMonthIncomes === 'function') {
        ensureMonthIncomes(targetMonth);
      }
      const incs = appState.incomes ? (appState.incomes[targetMonth] || []) : [];
      const sum = incs.reduce((s, i) => s + (i.amount || 0), 0);
      if (sum === 0 && appState.salary && appState.salary > 0) {
        const mExtra = (appState.extraIncomes && appState.extraIncomes[targetMonth]) || [];
        return appState.salary + mExtra.reduce((s, i) => s + (i.amount || 0), 0);
      }
      return sum;
    }

    function getAccumulatedBalance(targetMonth) {
      const allMonthsOrder = getSortedMonths();
      const startIndex = allMonthsOrder.indexOf('Agosto 2026');
      const targetIndex = allMonthsOrder.indexOf(targetMonth);
      
      // Si el mes actual es anterior a Agosto 2026 o no existe en la lista, calculamos individual
      if (startIndex === -1 || targetIndex < startIndex) {
        const txs = appState.transactions[targetMonth] || [];
        const totalPaid = txs.filter(t => (t.status || 'Pagado') === 'Pagado').reduce((sum, item) => sum + item.amount, 0);
        const monthIncomes = appState.incomes ? (appState.incomes[targetMonth] || []) : [];
        const totalReceived = monthIncomes.filter(i => (i.status || 'Pendiente') === 'Recibido').reduce((s, i) => s + i.amount, 0);
        return totalReceived - totalPaid;
      }
      
      // Acumulado desde Agosto 2026
      let accumulatedBalance = 0;
      for (let i = startIndex; i <= targetIndex; i++) {
        const m = allMonthsOrder[i];
        const txs = appState.transactions[m] || [];
        const totalPaid = txs.filter(t => (t.status || 'Pagado') === 'Pagado').reduce((sum, item) => sum + item.amount, 0);
        const monthIncomes = appState.incomes ? (appState.incomes[m] || []) : [];
        const totalReceived = monthIncomes.filter(inc => (inc.status || 'Pendiente') === 'Recibido').reduce((s, inc) => s + inc.amount, 0);
        accumulatedBalance += (totalReceived - totalPaid);
      }
      return accumulatedBalance;
    }

    function animateNumber(element, targetVal, duration = 280, isCurrency = false) {
      if (!element) return;
      const sym = getCurrencySymbol();
      const loc = getActiveCurrency().locale;
      const rawCurrent = parseFloat(element.getAttribute('data-numeric-val'));
      const startVal = isNaN(rawCurrent) ? 0 : rawCurrent;
      element.setAttribute('data-numeric-val', targetVal);
      
      const formattedFinal = targetVal.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (Math.abs(targetVal - startVal) < 0.01) {
        element.textContent = isCurrency ? `${sym} ${formattedFinal}` : formattedFinal;
        return;
      }

      const startTime = performance.now();
      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = startVal + (targetVal - startVal) * ease;
        const formatted = current.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        element.textContent = isCurrency ? `${sym} ${formatted}` : formatted;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          element.textContent = isCurrency ? `${sym} ${formattedFinal}` : formattedFinal;
        }
      }
      requestAnimationFrame(step);
    }

    function getBalanceBreakdown(targetMonth) {
      const allMonthsOrder = getSortedMonths();
      const targetIndex = allMonthsOrder.indexOf(targetMonth);
      const prevMonth = (targetIndex > 0) ? allMonthsOrder[targetIndex - 1] : null;
      const prevClosingBalance = prevMonth ? getAccumulatedBalance(prevMonth) : 0;
      
      const currentMonthTxs = appState.transactions[targetMonth] || [];
      const totalPaid = currentMonthTxs.filter(t => (t.status || 'Pagado') === 'Pagado').reduce((sum, item) => sum + item.amount, 0);
      
      const monthIncomes = appState.incomes ? (appState.incomes[targetMonth] || []) : [];
      const totalReceived = monthIncomes.filter(inc => (inc.status || 'Pendiente') === 'Recibido').reduce((s, inc) => s + inc.amount, 0);
      
      const currentMonthFlow = totalReceived - totalPaid;
      const currentBalance = getAccumulatedBalance(targetMonth);

      return {
        targetMonth,
        prevMonth,
        prevClosingBalance,
        totalReceived,
        totalPaid,
        currentMonthFlow,
        currentBalance
      };
    }

    function returnToCurrentMonth() {
      const calMonth = getCurrentCalendarMonthName();
      sessionStorage.removeItem('aliviafin_session_month');
      changeMonth(calMonth);
    }
    window.returnToCurrentMonth = returnToCurrentMonth;

    function openExplainSurplusModal() {
      const sym = getCurrencySymbol();
      const loc = getActiveCurrency().locale;
      const curMonth = appState.currentMonth || getCurrentCalendarMonthName();
      const calMonth = getCurrentCalendarMonthName();
      const isCurrentRealMonth = (curMonth === calMonth);
      const breakdown = getBalanceBreakdown(curMonth);

      const elBadgeText = document.getElementById('explainMonthBadgeText');
      const elBadge = document.getElementById('explainMonthBadge');
      if (elBadgeText) {
        elBadgeText.textContent = isCurrentRealMonth ? `Mes en Curso · En Vivo (${curMonth})` : `Histórico Cerrado (${curMonth})`;
      }
      if (elBadge) {
        elBadge.style.background = isCurrentRealMonth ? 'rgba(16, 185, 129, 0.12)' : 'rgba(100, 116, 139, 0.12)';
        elBadge.style.color = isCurrentRealMonth ? '#059669' : '#475569';
      }

      const elPrevLabel = document.getElementById('explainPrevMonthLabel');
      if (elPrevLabel) elPrevLabel.textContent = breakdown.prevMonth ? `Cierre de ${breakdown.prevMonth}` : 'Saldo anterior';

      const elPrevAmt = document.getElementById('explainPrevAmount');
      if (elPrevAmt) elPrevAmt.textContent = sym + ' ' + breakdown.prevClosingBalance.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      const elIncomes = document.getElementById('explainIncomesAmount');
      if (elIncomes) elIncomes.textContent = '+ ' + sym + ' ' + breakdown.totalReceived.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      const elPaid = document.getElementById('explainPaidAmount');
      if (elPaid) elPaid.textContent = '− ' + sym + ' ' + breakdown.totalPaid.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      const elFinal = document.getElementById('explainFinalAmount');
      if (elFinal) elFinal.textContent = sym + ' ' + breakdown.currentBalance.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      const elNote = document.getElementById('explainContextNote');
      if (elNote) {
        if (isCurrentRealMonth) {
          elNote.innerHTML = `💡 <strong>Octubre está 100% actualizado en vivo:</strong> Inicias con el saldo con el que cerró ${breakdown.prevMonth || 'el mes anterior'} (${sym} ${breakdown.prevClosingBalance.toFixed(2)}) y se descuentan los pagos que ya realizaste en este mes (${sym} ${breakdown.totalPaid.toFixed(2)}).`;
        } else {
          elNote.innerHTML = `💡 <strong>Histórico cerrado:</strong> Estás viendo la foto final con la que concluyó ${curMonth}. Para ver tu saldo vivo de hoy, vuelve al mes actual.`;
        }
      }

      openModalById('explainSurplusModal');
    }

    function openExplainSafeToSpendModal() {
      openExplainSurplusModal();
    }

    function openAddExtraIncomeModal() {
      const name = document.getElementById('extraIncomeName');
      if (name) name.value = '';
      const amount = document.getElementById('extraIncomeAmount');
      if (amount) amount.value = '';
      openModalById('addExtraIncomeModal');
    }

    function handleAddExtraIncome(e) {
      e.preventDefault();
      const name = document.getElementById('extraIncomeName').value;
      const amount = parseFloat(document.getElementById('extraIncomeAmount').value);
      const month = appState.currentMonth;

      if (!appState.incomes) appState.incomes = {};
      if (!appState.incomes[month]) ensureMonthIncomes(month);

      appState.incomes[month].push({
        id: 'inc_extra_' + Date.now(),
        name: name,
        amount: amount,
        status: 'Recibido',
        date: new Date().getDate()
      });

      addAuditLog('💵 Ingreso Extra', `Sumado S/ ${amount} (${name}) a ${month}`);

      saveState();
      closeModal('addExtraIncomeModal');
      renderAll();
    }

    function renderMetrics() {
      const txs = getMonthTxList();
      const totalSpent = txs.reduce((sum, item) => sum + item.amount, 0);
      
      const totalPaid = txs.filter(t => (t.status || 'Pagado') === 'Pagado').reduce((sum, item) => sum + item.amount, 0);

      const totalIncome = getMonthTotalIncome();
      const netSavings = totalIncome - totalSpent; 
      
      const currentBalance = getAccumulatedBalance(appState.currentMonth);

      const sym = getCurrencySymbol();
      const loc = getActiveCurrency().locale;

      const elSalary = document.getElementById('metricSalary');
      if (elSalary) elSalary.textContent = sym + ' ' + Math.round(totalIncome).toLocaleString(loc);
      const elSpent = document.getElementById('metricSpent');
      if (elSpent) elSpent.textContent = sym + ' ' + Math.round(totalSpent).toLocaleString(loc);
      
      // Métrica de Por Pagar
      const totalPending = totalSpent - totalPaid;
      const elPending = document.getElementById('metricPending');
      if (elPending) elPending.textContent = sym + ' ' + Math.round(totalPending).toLocaleString(loc);

      // Executive Balance Card
      const elSavingsLarge = document.getElementById('metricSavingsLarge');
      const elGlyph = document.getElementById('execBalanceCurrency');
      if (currentBalance < -0.0001) {
        if (elGlyph) elGlyph.textContent = `-${sym} `;
        if (elSavingsLarge) {
          animateNumber(elSavingsLarge, Math.abs(currentBalance), 280, false);
        }
      } else {
        if (elGlyph) elGlyph.textContent = `${sym} `;
        if (elSavingsLarge) {
          animateNumber(elSavingsLarge, currentBalance, 280, false);
        }
      }

      const calMonth = getCurrentCalendarMonthName();
      const isCurrentRealMonth = (appState.currentMonth === calMonth);
      const breakdown = getBalanceBreakdown(appState.currentMonth);

      const elBadge = document.getElementById('balanceLiveBadge');
      const elBadgeText = document.getElementById('balanceLiveBadgeText');
      const elPulse = document.getElementById('balancePulseDot');
      const elContextSource = document.getElementById('balanceContextSource');
      const elMonthFlow = document.getElementById('balanceMonthFlow');
      const elHistoryBanner = document.getElementById('historicalMonthBanner');
      const elHistoryText = document.getElementById('historicalMonthBannerText');

      if (isCurrentRealMonth) {
        if (elBadge) elBadge.className = 'exec-badge-live';
        if (elBadgeText) elBadgeText.textContent = 'En Vivo';
        if (elPulse) elPulse.style.display = 'inline-block';
        if (elContextSource) {
          elContextSource.textContent = 'Total disponible en banco';
        }
        if (elMonthFlow) {
          elMonthFlow.textContent = '';
        }
        if (elHistoryBanner) elHistoryBanner.style.display = 'none';
      } else {
        if (elBadge) elBadge.className = 'exec-badge-live is-historical';
        if (elBadgeText) elBadgeText.textContent = 'Cierre Histórico';
        if (elPulse) elPulse.style.display = 'none';
        if (elContextSource) {
          elContextSource.textContent = `Foto de cierre · ${appState.currentMonth}`;
        }
        if (elMonthFlow) {
          elMonthFlow.textContent = '';
        }
        if (elHistoryBanner) {
          elHistoryBanner.style.display = 'flex';
          if (elHistoryText) elHistoryText.textContent = `📅 Viendo histórico de ${appState.currentMonth}.`;
        }
      }

      const elSavings = document.getElementById('metricSavings');
      if (elSavings) elSavings.textContent = sym + ' ' + currentBalance.toLocaleString(loc, {minimumFractionDigits: 2});
      
      if (elSavings) {
        if (currentBalance >= 440) {
          elSavings.className = 'stat-value text-success';
        } else if (currentBalance >= 0) {
          elSavings.className = 'stat-value text-warning';
        } else {
          elSavings.className = 'stat-value text-danger';
        }
      }

      // Alerta de Liquidez (Oculta en tarjeta hero para preservar minimalismo Apple)
      let liquidityAlert = document.getElementById('liquidityAlertMsg');
      if (liquidityAlert) {
        liquidityAlert.style.display = 'none';
      }

      // Termómetro Fondo Emergencia (Opción F)
      const emFund = appState.savingsGoals.find(g => g.name.includes('Emergencia'));
      const emAmount = emFund ? emFund.current : 0;
      
      const elEmergency = document.getElementById('metricEmergencyFund');
      if (elEmergency) {
        elEmergency.textContent = sym + ' ' + emAmount.toLocaleString(loc, {minimumFractionDigits: 2});
        
        let emProgress = document.getElementById('emergencyProgress');
        if (!emProgress) {
          emProgress = document.createElement('div');
          emProgress.id = 'emergencyProgress';
          emProgress.style.cssText = 'width: 100%; background: #e5e7eb; border-radius: 4px; height: 6px; margin-top: 5px; overflow: hidden;';
          emProgress.innerHTML = `<div id="emergencyProgressFill" style="height: 100%; background: #059669; width: 0%; transition: width 0.3s ease;"></div>`;
          elEmergency.parentNode.appendChild(emProgress);
        }
        const target = 10000; // Meta por defecto
        const pct = Math.min((emAmount / target) * 100, 100);
        const progressFill = document.getElementById('emergencyProgressFill');
        if(progressFill) progressFill.style.width = pct + '%';
      }

      generateAutoDiagnosis(totalSpent, netSavings, txs);
    }

    function renderCuotasTracker() {
      const container = document.getElementById('cuotasTrackerContainer');
      const txs = getMonthTxList();
      const customInstallments = txs.filter(t => t.isInstallment);

      let html = '';

      if (customInstallments.length > 0) {
        customInstallments.forEach(ci => {
          html += `
            <div class="cuota-row" style="background: #fdf4ff; border-color: #f5d0fe; transition: transform 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='none'">
              <div>
                <div class="cuota-title" style="color: #86198f;">💳 ${ci.name}</div>
                <div class="cuota-sub">${getCurrencySymbol()} ${ci.amount.toFixed(2)} / mes</div>
              </div>
              <div class="cuota-badge" style="background: linear-gradient(135deg, #fdf4ff, #fae8ff); color: #86198f; border: 1px solid #f0abfc; box-shadow: 0 1px 2px rgba(0,0,0,0.05); font-weight: 800; font-size: 11px; white-space: nowrap;">Cuota ${ci.installmentsCurrent || 1} de ${ci.installmentsTotal || 1}${ci.remainingInstallments ? ` (${ci.remainingInstallments} pendientes)` : ''}</div>
            </div>
          `;
        });
      } else {
        html = `
          <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 12px; background: #fafafa; border-radius: 12px; border: 1px dashed #e5e7eb;">
            <div style="font-size: 24px; margin-bottom: 8px;">💳</div>
            <strong>No hay cuotas registradas</strong><br>
            <span style="font-size: 11px; margin-top: 4px; display: inline-block;">Edita un gasto y activa la opción "Es una compra a cuotas" para monitorearlo aquí.</span>
          </div>
        `;
      }

      container.innerHTML = html;
    }

    function toggleIncomeStatus(incId) {
      if (!appState.incomes || !appState.incomes[appState.currentMonth]) return;
      const incs = appState.incomes[appState.currentMonth];
      const inc = incs.find(i => i.id === incId);
      if (inc) {
        const nextStatus = (inc.status === 'Recibido') ? 'Pendiente' : 'Recibido';
        if (!confirm(`¿Seguro que deseas marcar este ingreso como ${nextStatus}?`)) return;
        
        const oldStatus = inc.status;
        inc.status = nextStatus;
        addAuditLog('💵 Ingreso Actualizado', `"${inc.name}" pasó a ${inc.status}`);
        saveState();
        renderAll();
      }
    }

    function editIncomeDate(incId, event) {
      event.stopPropagation();
      const currentMonth = appState.currentMonth;
      const incs = appState.incomes[currentMonth];
      if (!incs) return;
      const inc = incs.find(i => i.id === incId);
      if (!inc) return;

      const newDateStr = prompt(`Cambiar el día de pago para "${inc.name}" (1-31):\nSe actualizará para todos los meses.`, inc.date);
      if (newDateStr === null) return;
      const newDate = parseInt(newDateStr, 10);
      if (isNaN(newDate) || newDate < 1 || newDate > 31) {
        alert('Día inválido.');
        return;
      }

      // Propagate to all months
      const allMonthsOrder = getSortedMonths();
      allMonthsOrder.forEach(m => {
        const mIncs = appState.incomes[m];
        if (mIncs) {
          const sameInc = mIncs.find(i => i.name === inc.name);
          if (sameInc) {
            sameInc.date = newDate;
          }
        }
      });
      
      addAuditLog('💵 Día Ingreso', `Día de "${inc.name}" cambiado a ${newDate}`);
      saveState();
      renderAll();
    }

    function renderIncomes() {
      const container = document.getElementById('incomesContainer');
      if (!container) return;
      const incs = appState.incomes ? (appState.incomes[appState.currentMonth] || []) : [];
      
      if (incs.length === 0) {
        container.innerHTML = `<div style="font-size: 11px; color: #065f46;">No hay ingresos configurados.</div>`;
        return;
      }

      // Sort pending first, then by date
      const sortedIncs = [...incs].sort((a, b) => {
        if (a.status === 'Pendiente' && b.status === 'Recibido') return -1;
        if (a.status === 'Recibido' && b.status === 'Pendiente') return 1;
        return a.date - b.date;
      });

      container.innerHTML = sortedIncs.map(i => {
        const isRecibido = (i.status === 'Recibido');
        const bg = isRecibido ? '#dcfce7' : '#f3f4f6';
        const color = isRecibido ? '#166534' : '#4b5563';
        const border = isRecibido ? '#bbf7d0' : '#e5e7eb';
        const icon = isRecibido ? '✅' : '⏳';

        return `
          <div style="background: white; padding: 6px 10px; border-radius: 6px; border: 1px solid ${border}; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.2s ease;" onclick="toggleIncomeStatus('${i.id}')" onmouseover="this.style.filter='brightness(0.95)'" onmouseout="this.style.filter='none'">
            <div>
              <div style="font-size: 11px; font-weight: 800; color: #1f2937;">${i.name}</div>
              <div style="font-size: 10px; color: var(--text-muted);">${getCurrencySymbol()} ${i.amount.toLocaleString(getActiveCurrency().locale, {minimumFractionDigits: 2})} • <span onclick="editIncomeDate('${i.id}', event)" style="cursor: pointer; text-decoration: underline; color: #0284c7;" onmouseover="this.style.color='#0369a1'" onmouseout="this.style.color='#0284c7'">Día ${i.date} ✎</span></div>
            </div>
            <span style="background: ${bg}; color: ${color}; font-size: 9px; font-weight: 800; padding: 3px 8px; border-radius: 12px; white-space: nowrap; user-select: none;">
              ${icon} ${i.status}
            </span>
          </div>
        `;
      }).join('');
    }

    function generateAutoDiagnosis(spent, savings, txs) {
      const el = document.getElementById('autoDiagnosisText');
      if (txs.length === 0) {
        el.textContent = 'No hay gastos registrados en este mes.';
        return;
      }

      const catTotals = {};
      txs.forEach(t => {
        catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
      });

      const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
      const top3 = sortedCats.slice(0, 3);

      const totalIncome = getMonthTotalIncome();
      let html = `<div style="display:flex; flex-direction:column; gap:8px;">`;
      html += `<div>En <strong>${appState.currentMonth}</strong> gastaron <strong>S/ ${spent.toFixed(2)}</strong> de la bolsa total de S/ ${totalIncome}.</div>`;
      
      if (top3.length > 0) {
        html += `<div style="display:flex; align-items:center; gap:10px; margin-top:4px; padding: 6px; background: white; border-radius: 6px; border: 1px solid #bfdbfe;">`;
        html += `<div style="flex:1;">`;
        html += `<div style="font-size:10px; font-weight:800; color:#1e40af; margin-bottom:4px;">🔥 Top 3 Categorías:</div>`;
        top3.forEach((c, idx) => {
           const pct = ((c[1] / spent) * 100).toFixed(1);
           html += `<div style="font-size:10px; display:flex; justify-content:space-between; margin-bottom:2px;"><span>${idx+1}. ${c[0]}</span> <strong>${pct}%</strong></div>`;
        });
        html += `</div></div>`;
      }

      if (savings > 0) {
        html += `<div>🎉 Superávit libre actual de <strong>S/ ${savings.toFixed(2)}</strong>.</div>`;
      } else {
        html += `<div style="color:#b91c1c;">🚨 Déficit de <strong>S/ ${Math.abs(savings).toFixed(2)}</strong> en el mes por imprevistos.</div>`;
      }
      html += `</div>`;
      el.innerHTML = html;
    }

    function renderDonutChart() {
      const txs = getMonthTxList();
      const catTotals = {};
      
      Object.keys(CATEGORIES).forEach(c => catTotals[c] = 0);
      txs.forEach(t => {
        catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
      });

      const labels = [];
      const data = [];
      const colors = [];

      Object.entries(catTotals).forEach(([cat, amount]) => {
        if (amount > 0) {
          labels.push(cat);
          data.push(amount);
          colors.push((CATEGORIES[cat] && CATEGORIES[cat].color) || '#64748b');
        }
      });

      const chartCanvas = document.getElementById('categoryChart');
      if (!chartCanvas) return;
      const ctx = chartCanvas.getContext('2d');
      if (categoryChartObj) categoryChartObj.destroy();

      const isDark = document.body.classList.contains('theme-twilight');
      const hasExpenses = data.length > 0;
      if (!hasExpenses) {
        labels.push('Sin gastos aún');
        data.push(1);
        colors.push(isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)');
      }

      categoryChartObj = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: colors,
            borderWidth: hasExpenses ? 2 : 0,
            borderColor: isDark ? '#0f172a' : '#ffffff',
            hoverOffset: hasExpenses ? 10 : 0,
            borderRadius: hasExpenses ? 6 : 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: hasExpenses,
              position: 'bottom',
              labels: {
                font: { family: 'Plus Jakarta Sans', size: 9, weight: '600' },
                boxWidth: 8,
                padding: 6
              }
            },
            tooltip: {
              enabled: hasExpenses
            }
          },
          cutout: '72%',
          layout: {
            padding: 10
          }
        },
        plugins: [{
          id: 'customShadow',
          beforeDraw: (chart) => {
            const ctx = chart.ctx;
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 8;
          },
          afterDraw: (chart) => {
            chart.ctx.restore();
          }
        }]
      });
    }

    /* ====== GRÁFICOS EJECUTIVOS DESKTOP (APPLE MAC FINTECH) ====== */
    function renderDesktopExecutiveCharts() {
      // 1. Chart Flujo de Caja (Cashflow Mensual Proyectado)
      const cashflowEl = document.getElementById('desktopCashflowChart');
      if (cashflowEl) {
        const isDark = document.body.classList.contains('theme-twilight');
        const monthsList = (typeof getFilteredMonthsForHistory === 'function' ? getFilteredMonthsForHistory() : []).slice(-6);
        const displayMonths = monthsList.length > 0 ? monthsList : [appState.currentMonth || 'Octubre 2026'];
        
        const labels = displayMonths.map(m => m.split(' ')[0].substring(0, 3));
        const incomeData = displayMonths.map(m => getMonthTotalIncome(m));
        
        const expenseData = displayMonths.map(m => {
          const mTxs = (appState.transactions && appState.transactions[m]) || [];
          return mTxs.reduce((s, it) => s + (it.amount || 0), 0);
        });

        if (desktopCashflowChartObj) {
          desktopCashflowChartObj.destroy();
          desktopCashflowChartObj = null;
        }

        try {
          const ctx = cashflowEl.getContext('2d');
          const incGrad = ctx.createLinearGradient(0, 0, 0, 220);
          incGrad.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
          incGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

          const expGrad = ctx.createLinearGradient(0, 0, 0, 220);
          expGrad.addColorStop(0, 'rgba(244, 63, 94, 0.22)');
          expGrad.addColorStop(1, 'rgba(244, 63, 94, 0.0)');

          desktopCashflowChartObj = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'Ingresos',
                  data: incomeData,
                  borderColor: '#10b981',
                  backgroundColor: incGrad,
                  borderWidth: 2.5,
                  fill: true,
                  tension: 0.4,
                  pointBackgroundColor: '#10b981',
                  pointBorderColor: '#0b101e',
                  pointBorderWidth: 2,
                  pointRadius: 4,
                  pointHoverRadius: 6
                },
                {
                  label: 'Gastos',
                  data: expenseData,
                  borderColor: '#f43f5e',
                  backgroundColor: expGrad,
                  borderWidth: 2.5,
                  fill: true,
                  tension: 0.4,
                  pointBackgroundColor: '#f43f5e',
                  pointBorderColor: '#0b101e',
                  pointBorderWidth: 2,
                  pointRadius: 4,
                  pointHoverRadius: 6
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index',
                intersect: false
              },
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.95)',
                  titleColor: isDark ? '#f8fafc' : '#0f172a',
                  bodyColor: isDark ? '#cbd5e1' : '#334155',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(226, 232, 240, 0.9)',
                  borderWidth: 1,
                  padding: 10,
                  boxPadding: 4,
                  usePointStyle: true,
                  callbacks: {
                    label: function(context) {
                      if (typeof isPrivacyModeActive === 'function' && isPrivacyModeActive()) {
                        return ` ${context.dataset.label}: ${getCurrencySymbol()} •••••`;
                      }
                      const val = context.parsed.y || 0;
                      return ` ${context.dataset.label}: ${getCurrencySymbol()} ${val.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: {
                    color: isDark ? '#94a3b8' : '#64748b',
                    font: { family: '-apple-system, SF Pro Text, sans-serif', size: 11, weight: '600' }
                  }
                },
                y: {
                  grid: {
                    color: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                    drawBorder: false
                  },
                  ticks: {
                    color: isDark ? '#94a3b8' : '#64748b',
                    font: { family: '-apple-system, SF Pro Text, sans-serif', size: 10.5, weight: '500' },
                    callback: v => getCurrencySymbol() + ' ' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v)
                  }
                }
              }
            }
          });
        } catch (e) {
          console.warn('Error al renderizar desktopCashflowChart:', e);
        }
      }

      // 2. Chart Distribución por Categorías (Donut Ejecutivo + Leyenda con Porcentajes)
      const catEl = document.getElementById('desktopCategoryChart');
      const legendEl = document.getElementById('desktopCategoryLegend');
      if (catEl) {
        const txs = getMonthTxList();
        const catTotals = {};
        Object.keys(CATEGORIES).forEach(c => catTotals[c] = 0);
        let totalSpent = 0;
        txs.forEach(t => {
          const amt = t.amount || 0;
          catTotals[t.category] = (catTotals[t.category] || 0) + amt;
          totalSpent += amt;
        });

        const sortedCats = Object.entries(catTotals)
          .filter(([_, amt]) => amt > 0)
          .sort((a, b) => b[1] - a[1]);

        const isDark = document.body.classList.contains('theme-twilight');
        const labels = [];
        const data = [];
        const colors = [];

        sortedCats.slice(0, 5).forEach(([cat, amt]) => {
          labels.push(cat);
          data.push(amt);
          colors.push((CATEGORIES[cat] && CATEGORIES[cat].color) || '#10b981');
        });

        if (sortedCats.length > 5) {
          const otherSum = sortedCats.slice(5).reduce((s, it) => s + it[1], 0);
          labels.push('Otras');
          data.push(otherSum);
          colors.push('#94a3b8');
        }

        const hasExpenses = data.length > 0;
        if (!hasExpenses) {
          labels.push('Sin gastos');
          data.push(1);
          colors.push(isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)');
        }

        if (desktopCategoryChartObj) {
          desktopCategoryChartObj.destroy();
          desktopCategoryChartObj = null;
        }

        try {
          const ctx = catEl.getContext('2d');
          desktopCategoryChartObj = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: labels,
              datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: hasExpenses ? 2 : 0,
                borderColor: isDark ? '#0f172a' : '#ffffff',
                hoverOffset: hasExpenses ? 8 : 0,
                borderRadius: hasExpenses ? 6 : 0
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '72%',
              plugins: {
                legend: { display: false },
                tooltip: {
                  enabled: hasExpenses,
                  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.95)',
                  titleColor: isDark ? '#f8fafc' : '#0f172a',
                  bodyColor: isDark ? '#cbd5e1' : '#334155',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(226, 232, 240, 0.9)',
                  borderWidth: 1,
                  callbacks: {
                    label: function(context) {
                      if (typeof isPrivacyModeActive === 'function' && isPrivacyModeActive()) {
                        return ` ${context.label}: ${getCurrencySymbol()} •••••`;
                      }
                      const val = context.parsed || 0;
                      const pct = totalSpent > 0 ? ((val / totalSpent) * 100).toFixed(1) : 0;
                      return ` ${context.label}: ${getCurrencySymbol()} ${val.toFixed(2)} (${pct}%)`;
                    }
                  }
                }
              }
            }
          });
        } catch (e) {
          console.warn('Error al renderizar desktopCategoryChart:', e);
        }

        if (legendEl) {
          if (!hasExpenses) {
            legendEl.innerHTML = `
              <div style="font-size: 11.5px; color: var(--text-muted); padding: 8px;">
                ✨ No hay gastos registrados este mes.<br>Tu capital está 100% disponible.
              </div>
            `;
          } else {
            legendEl.innerHTML = sortedCats.slice(0, 4).map(([cat, amt]) => {
              const catColor = (CATEGORIES[cat] && CATEGORIES[cat].color) || '#10b981';
              const catIcon = (CATEGORIES[cat] && CATEGORIES[cat].icon) || '🏷️';
              const pct = totalSpent > 0 ? ((amt / totalSpent) * 100).toFixed(0) : 0;
              return `
                <div class="donut-legend-item">
                  <div class="donut-legend-left">
                    <span class="donut-legend-dot" style="background: ${catColor};"></span>
                    <span class="donut-legend-name">${catIcon} ${escapeHtml(cat)}</span>
                  </div>
                  <div class="donut-legend-right">
                    <span class="donut-legend-amount">${getCurrencySymbol()} ${amt.toFixed(2)}</span>
                    <span class="donut-legend-pct">${pct}%</span>
                  </div>
                </div>
              `;
            }).join('');
          }
        }
      }
    }

    function renderTransactions() {
      const container = document.getElementById('txTableBody');
      const search = (document.getElementById('searchTx')?.value || '').toLowerCase().trim();
      const sortBy = document.getElementById('sortTx')?.value || 'newest';
      const sym = getCurrencySymbol();

      const filterCat = currentCategoryFilter;
      const filterStatus = currentStatusFilter;

      let allTxs = getMonthTxList();

      const grandTotal = allTxs.reduce((s, t) => s + t.amount, 0);
      const paidTotal = allTxs.filter(t => (t.status || 'Pagado') === 'Pagado').reduce((s, t) => s + t.amount, 0);
      const pendingTotal = grandTotal - paidTotal;

      const elTot = document.getElementById('txSummaryTotal');
      if (elTot) elTot.textContent = sym + ' ' + grandTotal.toFixed(2);
      const elPag = document.getElementById('txSummaryPagado');
      if (elPag) elPag.textContent = sym + ' ' + paidTotal.toFixed(2);
      const elPen = document.getElementById('txSummaryPendiente');
      if (elPen) elPen.textContent = sym + ' ' + pendingTotal.toFixed(2);

      let txs = [...allTxs];

      if (search) {
        txs = txs.filter(t => (t.name || '').toLowerCase().includes(search) || (t.amount || 0).toString().includes(search) || (t.category || '').toLowerCase().includes(search));
      }
      if (filterCat !== 'TODAS' && filterCat !== 'ALL') {
        txs = txs.filter(t => t.category === filterCat);
      }
      if (filterStatus !== 'TODOS') {
        txs = txs.filter(t => (t.status || 'Pagado') === filterStatus);
      }

      if (sortBy === 'highest') {
        txs.sort((a, b) => b.amount - a.amount);
      } else if (sortBy === 'lowest') {
        txs.sort((a, b) => a.amount - b.amount);
      } else if (sortBy === 'name') {
        txs.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'category') {
        txs.sort((a, b) => (a.category || '').localeCompare(b.category || '') || a.name.localeCompare(b.name));
      }

      const totalSum = txs.reduce((s, t) => s + t.amount, 0);
      const elCount = document.getElementById('filteredTxCount');
      if (elCount) elCount.textContent = `Mostrando ${txs.length} de ${allTxs.length} gastos`;
      const elSum = document.getElementById('filteredTxSum');
      if (elSum) elSum.textContent = `Total: ${sym} ${totalSum.toFixed(2)}`;

      if (txs.length === 0) {
        container.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">No hay gastos.</td></tr>`;
        return;
      }

      container.innerHTML = txs.map(t => {
        const catInfo = CATEGORIES[t.category] || CATEGORIES['Otros'];
        const st = t.status || 'Pagado';
        const stClass = st === 'Pagado' ? 'pagado' : 'pendiente';
        const stLabel = st === 'Pagado' ? '🟢 Pagado' : '⏳ Pendiente';

        let installmentBadge = '';
        if (t.isInstallment) {
          const remText = (typeof t.remainingInstallments === 'number') ? ` (${t.remainingInstallments} pendientes)` : '';
          installmentBadge = `<span style="background: linear-gradient(135deg, #fdf4ff, #fae8ff); color: #86198f; padding: 3px 6px; border-radius: 6px; font-size: 10px; font-weight: 800; border: 1px solid #f0abfc; box-shadow: 0 1px 2px rgba(0,0,0,0.05); white-space: nowrap;" title="Cuota ${t.installmentsCurrent || 1} de ${t.installmentsTotal || 1}${remText}">💳 Cuota ${t.installmentsCurrent || 1} de ${t.installmentsTotal || 1}</span>`;
        }

        const effectiveDueDate = getEffectiveDueDate(t);

        return `
          <tr class="tx-row-item">
            <td class="tx-cell-concept">
              <div class="tx-concept-main">
                <span class="tx-concept-icon">${catInfo.icon}</span>
                <span class="tx-concept-title">${escapeHtml(t.name)}</span>
                ${installmentBadge}
              </div>
            </td>
            <td class="tx-cell-meta">
              <div class="tx-meta-wrap">
                <span class="badge ${catInfo.badgeClass}" ${catInfo.badgeClass === 'badge-custom' ? `style="background-color: ${catInfo.color}20; color: ${catInfo.color}; border: 1px solid ${catInfo.color}40;"` : ''}>${t.category}</span>
                <span class="tx-due-pill">🗓️ Día ${effectiveDueDate}</span>
              </div>
            </td>
            <td class="tx-cell-status">
              <span class="status-badge ${stClass}" onclick="toggleTxStatus('${t.id}')">
                ${stLabel}
              </span>
            </td>
            <td class="tx-cell-amount">
              ${sym} ${t.amount.toFixed(2)}
            </td>
            <td class="tx-cell-actions">
              <button type="button" class="btn-pill primary tx-action-btn" onclick="openEditExpenseModal('${t.id}')" title="Editar gasto">✏️</button>
              <button type="button" class="btn-pill danger tx-action-btn" onclick="deleteTransaction('${t.id}')" title="Eliminar gasto">🗑️</button>
            </td>
          </tr>
        `;
      }).join('');
    }

    function toggleTxStatus(id) {
      const txs = getMonthTxList();
      const tx = txs.find(t => t.id === id);
      if (tx) {
        const nextStatus = (tx.status === 'Pagado') ? 'Pendiente' : 'Pagado';
        if (!confirm(`¿Seguro que deseas marcar este gasto como ${nextStatus}?`)) return;
        
        tx.status = nextStatus;
        addAuditLog('🔄 Cambio Estado', `${tx.name} a ${tx.status} en ${appState.currentMonth}`);
        
        if (tx.status === 'Pagado') {
          showToast('✅ Marcado como Pagado', 'success');
        } else {
          showToast('⏳ Marcado como Pendiente', 'warning');
        }

        saveState();
        renderAll();
      }
    }

    function toggleInstallmentFields() {
      const isChecked = document.getElementById('txIsInstallment').checked;
      const group = document.getElementById('installmentFieldsGroup');
      if (group) {
        group.style.display = isChecked ? 'flex' : 'none';
        if (isChecked) syncInstallmentFields('total');
      }
    }

    function syncInstallmentFields(source) {
      const totalEl = document.getElementById('txInstallmentsTotal');
      const currEl = document.getElementById('txInstallmentsCurrent');
      const remEl = document.getElementById('txInstallmentsRemaining');
      const hintEl = document.getElementById('installmentSummaryHint');
      const amtEl = document.getElementById('txAmount');
      if (!totalEl || !currEl || !remEl) return;

      let total = parseInt(totalEl.value, 10);
      if (isNaN(total) || total < 1) total = 1;

      let current = parseInt(currEl.value, 10);
      if (isNaN(current) || current < 1) current = 1;

      let remaining = parseInt(remEl.value, 10);
      if (isNaN(remaining) || remaining < 1) remaining = 1;

      if (source === 'remaining') {
        if (remaining > total) total = remaining;
        totalEl.value = total;
        current = Math.max(1, total - remaining + 1);
        currEl.value = current;
      } else if (source === 'current') {
        if (current > total) total = current;
        totalEl.value = total;
        remaining = Math.max(1, total - current + 1);
        remEl.value = remaining;
      } else {
        // source === 'total'
        if (current > total) current = total;
        currEl.value = current;
        remaining = Math.max(1, total - current + 1);
        remEl.value = remaining;
      }

      if (hintEl) {
        const amt = parseFloat(amtEl?.value) || 0;
        const saldo = remaining * amt;
        hintEl.innerHTML = `💡 Pagando <b>Cuota ${current} de ${total}</b> • Faltan <b>${remaining} cuotas</b> por pagar (Saldo pendiente: <b>${getCurrencySymbol()} ${saldo.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>)`;
      }
    }
    window.syncInstallmentFields = syncInstallmentFields;
    window.toggleInstallmentFields = toggleInstallmentFields;

    function deleteTransaction(id) {
      const txs = getMonthTxList();
      const tx = txs.find(t => t.id === id);
      if (!tx) return;

      if (!confirm(`¿Eliminar el gasto "${tx.name}" de este mes?`)) return;
      
      const normKey = getNormalizedNameKey(tx.name);
      
      const propagate = confirm(`¿Deseas eliminar "${tx.name}" también para TODOS los meses posteriores a este?`);
      
      if (propagate) {
        const allMonthsOrder = getSortedMonths();
        const selectedIndex = allMonthsOrder.indexOf(appState.currentMonth);
        if (selectedIndex !== -1) {
          const futureMonths = allMonthsOrder.slice(selectedIndex + 1);
          futureMonths.forEach(m => {
            if (appState.transactions[m]) {
              appState.transactions[m] = appState.transactions[m].filter(t => getNormalizedNameKey(t.name) !== normKey);
            }
          });
        }
      }

      addAuditLog('🗑️ Eliminar Gasto', `Eliminado: ${tx.name}${propagate ? ' (y meses futuros)' : ''}`);
      appState.transactions[appState.currentMonth] = txs.filter(t => t.id !== id);
      saveState();
      renderAll();
    }

    function openEditExpenseModal(id) {
      const txs = getMonthTxList();
      const tx = txs.find(t => t.id === id);
      if (!tx) return;

      document.getElementById('editingTxId').value = tx.id;
      document.getElementById('txName').value = tx.name;
      document.getElementById('txAmount').value = tx.amount;
      document.getElementById('txCategory').value = tx.category;
      document.getElementById('txStatus').value = tx.status || 'Pagado';
      
      const effectiveDueDate = getEffectiveDueDate(tx);
      document.getElementById('txDueDate').value = effectiveDueDate;
      
      const isInst = tx.isInstallment || false;
      document.getElementById('txIsInstallment').checked = isInst;
      const instGroup = document.getElementById('installmentFieldsGroup');
      if (instGroup) instGroup.style.display = isInst ? 'flex' : 'none';
      
      const totalInst = tx.installmentsTotal || 12;
      let currInst = tx.installmentsCurrent || 1;
      let remInst = tx.remainingInstallments || Math.max(1, totalInst - currInst + 1);
      const teaVal = (typeof tx.tea === 'number') ? tx.tea : 0;

      if (document.getElementById('txInstallmentsTotal')) document.getElementById('txInstallmentsTotal').value = totalInst;
      if (document.getElementById('txInstallmentsCurrent')) document.getElementById('txInstallmentsCurrent').value = currInst;
      if (document.getElementById('txInstallmentsRemaining')) document.getElementById('txInstallmentsRemaining').value = remInst;
      if (document.getElementById('txInstallmentTea')) document.getElementById('txInstallmentTea').value = teaVal;

      if (isInst) syncInstallmentFields('current');

      document.getElementById('txPropagateFuture').checked = false;

      document.getElementById('expenseModalTitle').textContent = '✏️ Editar Gasto';
      document.getElementById('saveExpenseBtn').textContent = 'Actualizar Gasto';

      openModalById('addExpenseModal');
    }

    function openModalById(id) {
      const modal = typeof id === 'string' ? document.getElementById(id) : id;
      if (!modal) return;
      modal.classList.add('active');
      modal.style.display = 'flex';
      modal.style.visibility = 'visible';
      modal.style.opacity = '1';
      modal.style.pointerEvents = 'auto';
      
      const inlineZ = parseInt(modal.style.zIndex, 10);
      if (inlineZ && inlineZ >= 99999) {
        // Mantener z-index prioritario
      } else if (modal.id === 'legalModal' || modal.id === 'reclamacionesModal' || modal.id === 'forgotPasswordModal') {
        modal.style.zIndex = '100010';
      } else if (modal.classList.contains('glass-backdrop')) {
        modal.style.zIndex = '10005';
      } else {
        modal.style.zIndex = '10000';
      }
    }

    function closeModal(id) {
      const modal = typeof id === 'string' ? document.getElementById(id) : id;
      if (!modal) return;
      modal.classList.remove('active');
      modal.style.display = 'none';
      modal.style.visibility = 'hidden';
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
    }

    function closeGlassModal(id) {
      closeModal(id);
    }

    function handleAddExpense(e) {
      e.preventDefault();
      const editId = document.getElementById('editingTxId').value;
      const name = document.getElementById('txName').value.trim();
      const amount = parseFloat(document.getElementById('txAmount').value);
      const category = document.getElementById('txCategory').value;
      const status = document.getElementById('txStatus').value || 'Pagado';
      const dueDate = document.getElementById('txDueDate').value || '15';
      const shouldPropagateForward = document.getElementById('txPropagateFuture').checked;
      
      const isInstallment = document.getElementById('txIsInstallment').checked;
      const installmentsTotal = parseInt(document.getElementById('txInstallmentsTotal').value) || 1;
      const installmentsCurrent = parseInt(document.getElementById('txInstallmentsCurrent').value) || 1;
      const remainingInstallments = parseInt(document.getElementById('txInstallmentsRemaining')?.value) || Math.max(1, installmentsTotal - installmentsCurrent + 1);
      const teaRate = parseFloat(document.getElementById('txInstallmentTea')?.value) || 0;
      
      const currentSelectedMonth = appState.currentMonth;
      const newNormKey = getNormalizedNameKey(name);

      const allMonthsOrder = getSortedMonths();
      const selectedIndex = allMonthsOrder.indexOf(currentSelectedMonth);

      // ALWAYS UPDATE RECURRING DUE DATE REGISTRY AUTOMATICALLY
      if (!appState.recurringDueDates) appState.recurringDueDates = {};
      appState.recurringDueDates[newNormKey] = dueDate;

      // AUTOMATICALLY PROPAGATE DUE DATE & NAME & CATEGORY FROM CURRENT MONTH FORWARD TO ALL FUTURE MONTHS
      const futureMonthsToUpdate = (selectedIndex !== -1) ? allMonthsOrder.slice(selectedIndex) : allMonthsOrder;

      if (editId) {
        let oldName = name;
        let oldDueDate = dueDate;
        let targetItem = null;

        const curMonthTxs = appState.transactions[currentSelectedMonth] || [];
        targetItem = curMonthTxs.find(t => t.id === editId);

        if (targetItem) {
          oldName = targetItem.name;
          oldDueDate = targetItem.dueDate;
        }

        const oldNormKey = getNormalizedNameKey(oldName);
        appState.recurringDueDates[oldNormKey] = dueDate;

        futureMonthsToUpdate.forEach((m, idx) => {
          if (!appState.transactions[m]) appState.transactions[m] = [];
          let found = false;
          
          appState.transactions[m].forEach(t => {
            if (getNormalizedNameKey(t.name) === oldNormKey || getNormalizedNameKey(t.name) === newNormKey || t.id === editId) {
              found = true;
              t.name = name;
              t.category = category;
              t.dueDate = dueDate; // <-- OBLIGATORY PROPAGATION TO ALL FUTURE MONTHS
              t.isInstallment = isInstallment;
              t.installmentsTotal = installmentsTotal;
              
              if (isInstallment) {
                t.installmentsCurrent = Math.min(installmentsTotal, installmentsCurrent + idx);
                t.remainingInstallments = Math.max(0, remainingInstallments - idx);
                t.tea = teaRate;
              } else {
                t.installmentsCurrent = 1;
                t.remainingInstallments = 1;
                t.tea = 0;
              }

              if (m === currentSelectedMonth) {
                t.amount = amount;
                t.status = status;
              } else if (shouldPropagateForward) {
                t.amount = amount;
              }
            }
          });
          
          if (!found && shouldPropagateForward) {
             let adjCurrent = installmentsCurrent;
             let adjRemaining = remainingInstallments;
             if (isInstallment) {
               adjCurrent = Math.min(installmentsTotal, installmentsCurrent + idx);
               adjRemaining = Math.max(0, remainingInstallments - idx);
             }
             appState.transactions[m].push({
               id: m + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
               name: name,
               amount: amount,
               category: category,
               status: 'Pendiente',
               dueDate: dueDate,
               isInstallment: isInstallment,
               installmentsTotal: installmentsTotal,
               installmentsCurrent: adjCurrent,
               remainingInstallments: adjRemaining,
               tea: isInstallment ? teaRate : 0
             });
          }
        });

        addAuditLog('✏️ Gasto Editado', `Gasto '${oldName}' actualizado a '${name}' (S/ ${amount}, Día ${dueDate}).`);

      } else {
        let targetMonths = [];
        if (shouldPropagateForward && selectedIndex !== -1) {
          targetMonths = allMonthsOrder.slice(selectedIndex);
        } else {
          targetMonths = [currentSelectedMonth];
        }

        targetMonths.forEach((m, idx) => {
          if (!appState.transactions[m]) appState.transactions[m] = [];
          
          let existingItem = appState.transactions[m].find(t => getNormalizedNameKey(t.name) === newNormKey);
          
          let adjCurrent = installmentsCurrent;
          let adjRemaining = remainingInstallments;
          if (isInstallment && shouldPropagateForward) {
            adjCurrent = Math.min(installmentsTotal, installmentsCurrent + idx);
            adjRemaining = Math.max(0, remainingInstallments - idx);
          }

          if (existingItem) {
            existingItem.name = name;
            existingItem.amount = amount;
            existingItem.dueDate = dueDate;
            existingItem.category = category;
            if (m === currentSelectedMonth) {
              existingItem.status = status;
            }
            existingItem.isInstallment = isInstallment;
            existingItem.installmentsTotal = installmentsTotal;
            existingItem.installmentsCurrent = adjCurrent;
            existingItem.remainingInstallments = adjRemaining;
            existingItem.tea = isInstallment ? teaRate : 0;
          } else {
            appState.transactions[m].push({
              id: m + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
              name: name,
              amount: amount,
              category: category,
              status: (m === currentSelectedMonth) ? status : 'Pendiente',
              dueDate: dueDate,
              isInstallment: isInstallment,
              installmentsTotal: installmentsTotal,
              installmentsCurrent: adjCurrent,
              remainingInstallments: adjRemaining,
              tea: isInstallment ? teaRate : 0
            });
          }
        });

        addAuditLog('➕ Gasto Registrado', `Gasto '${name}' (S/ ${amount}, Día ${dueDate}) añadido.`);
      }

      if (isInstallment && typeof syncDebtsFromCuotas === 'function') {
        syncDebtsFromCuotas();
      }

      currentCategoryFilter = 'TODAS';
      currentStatusFilter = 'TODOS';
      appState.activeCategoryChip = 'TODAS';
      appState.activeStatusFilter = 'TODOS';

      saveState();
      closeModal('addExpenseModal');
      document.getElementById('editingTxId').value = '';
      document.getElementById('txName').value = '';
      document.getElementById('txAmount').value = '';
      renderAll();
    }

    function getPreviousMonthKey(currentMonth) {
      const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      if (!currentMonth) return 'Septiembre 2026';
      const parts = currentMonth.trim().split(' ');
      const mName = parts[0] || 'Octubre';
      const year = parseInt(parts[1], 10) || 2026;
      let idx = months.findIndex(m => m.toLowerCase() === mName.toLowerCase() || (mName.toLowerCase().startsWith('seti') && m.toLowerCase().startsWith('sept')));
      if (idx <= 0) {
        return `Diciembre ${year - 1}`;
      }
      return `${months[idx - 1]} ${year}`;
    }

    function render503020Rule() {
      const salary = getMonthTotalIncome();
      const txs = getMonthTxList();
      
      const target50 = salary * 0.50;
      const target30 = salary * 0.30;
      const target20 = salary * 0.20;

      let needsReal = 0, wantsReal = 0, savingsDebtReal = 0;

      txs.forEach(t => {
        const c = t.category;
        if (c === 'Tarjetas' || c === 'Préstamos' || t.isInstallment) {
          savingsDebtReal += t.amount;
        } else if (['Casa', 'Comida casa', 'Comida gatitos casa', 'Arena gatitos casa', 'Carro', 'UTP', 'Internet', 'Servicios', 'Celulares', 'Mapfre', 'Papá'].includes(c)) {
          needsReal += t.amount;
        } else if (['Suscripciones', 'Gimnasio & Salud', 'Comida gatitos calle', 'Viajes', 'Salidas'].includes(c)) {
          wantsReal += t.amount;
        } else {
          needsReal += t.amount;
        }
      });

      const totalSpent = needsReal + wantsReal + savingsDebtReal;
      const unbudgetedMargin = Math.max(0, salary - totalSpent);

      const realPct50 = salary > 0 ? Math.round((needsReal / salary) * 100) : 0;
      const realPct30 = salary > 0 ? Math.round((wantsReal / salary) * 100) : 0;
      const realPctDebt = salary > 0 ? Math.round((savingsDebtReal / salary) * 100) : 0;

      const barFill50 = target50 > 0 ? Math.min(100, Math.round((needsReal / target50) * 100)) : 0;
      const barFill30 = target30 > 0 ? Math.min(100, Math.round((wantsReal / target30) * 100)) : 0;
      const barFill20 = target20 > 0 ? Math.min(100, Math.round((savingsDebtReal / target20) * 100)) : 0;

      // Análisis de Pagos Pendientes del mes anterior (ej: Septiembre 2026)
      const prevKey = getPreviousMonthKey(appState.currentMonth || 'Octubre 2026');
      const prevKeyAlt = prevKey.replace('Septiembre', 'Setiembre');
      const prevTxs = (appState.transactions && (appState.transactions[prevKey] || appState.transactions[prevKeyAlt])) || [];
      const prevPending = prevTxs.filter(t => t.status === 'Pendiente');
      const prevPendingTotal = prevPending.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);

      // Calcular Índice de Salud Financiera Real y Honesto (0-100)
      let healthScore = 100;
      let penaltyReasons = [];

      // 1. Penalización fuerte por arrastre de pagos vencidos del mes anterior
      if (prevPendingTotal > 4000) {
        healthScore -= 42;
        penaltyReasons.push(`S/ ${Math.round(prevPendingTotal).toLocaleString()} pendientes de ${prevKey}`);
      } else if (prevPendingTotal > 1000) {
        healthScore -= 28;
        penaltyReasons.push(`S/ ${Math.round(prevPendingTotal).toLocaleString()} pendientes de ${prevKey}`);
      } else if (prevPendingTotal > 0) {
        healthScore -= 18;
        penaltyReasons.push(`Pagos pendientes de ${prevKey}`);
      }

      // 2. Penalización por sobreendeudamiento (>20% del ingreso en cuotas/préstamos)
      if (realPctDebt > 30) {
        healthScore -= 22;
        penaltyReasons.push(`Alto endeudamiento (${realPctDebt}% de sueldo)`);
      } else if (realPctDebt > 20) {
        healthScore -= 14;
        penaltyReasons.push(`Deudas superan meta del 20%`);
      }

      // 3. Penalización por desbalance en necesidades o deseos
      if (realPct50 > 50) healthScore -= Math.min(15, Math.round((realPct50 - 50) * 0.8));
      if (realPct30 > 30) healthScore -= Math.min(15, Math.round((realPct30 - 30) * 1.0));

      healthScore = Math.max(25, Math.min(100, Math.round(healthScore)));

      let healthBadgeText = 'Saludable';
      let healthBadgeColor = '#10b981';
      if (healthScore < 58) {
        healthBadgeText = 'En Alerta';
        healthBadgeColor = '#ef4444';
      } else if (healthScore < 78) {
        healthBadgeText = 'Moderado';
        healthBadgeColor = '#f59e0b';
      }

      // SVG Stroke dash calculation for radius 36 (circumference ~ 226)
      const circumference = 226;
      const strokeDashoffset = Math.round(circumference - (circumference * healthScore / 100));

      const executiveHtml = `
        <div class="plan-progress-row">
          <div class="plan-progress-header">
            <div>
              <div class="plan-progress-title">🏠 Necesidades Básicas</div>
              <div class="plan-progress-sub">50% Meta (${getCurrencySymbol()} ${target50.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}) vs ${realPct50}% Actual</div>
            </div>
            <div class="plan-progress-amounts">
              ${getCurrencySymbol()} ${needsReal.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              <span>de ${getCurrencySymbol()} ${target50.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
          </div>
          <div class="plan-progress-track">
            <div class="plan-progress-fill plan-fill-needs" style="width: ${barFill50}%; background: ${needsReal > target50 ? '#ef4444' : '#10b981'};"></div>
          </div>
        </div>

        <div class="plan-progress-row">
          <div class="plan-progress-header">
            <div>
              <div class="plan-progress-title">🎉 Deseos & Estilo de Vida</div>
              <div class="plan-progress-sub">30% Meta (${getCurrencySymbol()} ${target30.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}) vs ${realPct30}% Actual</div>
            </div>
            <div class="plan-progress-amounts">
              ${getCurrencySymbol()} ${wantsReal.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              <span>de ${getCurrencySymbol()} ${target30.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
          </div>
          <div class="plan-progress-track">
            <div class="plan-progress-fill plan-fill-wants" style="width: ${barFill30}%; background: ${wantsReal > target30 ? '#f59e0b' : '#06b6d4'};"></div>
          </div>
        </div>

        <div class="plan-progress-row">
          <div class="plan-progress-header">
            <div>
              <div class="plan-progress-title">💳 Compromiso en Deudas & Cuotas</div>
              <div class="plan-progress-sub">20% Meta Sugerida (${getCurrencySymbol()} ${target20.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}) vs ${realPctDebt}% Real</div>
            </div>
            <div class="plan-progress-amounts">
              ${getCurrencySymbol()} ${savingsDebtReal.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              <span>comprometidos</span>
            </div>
          </div>
          <div class="plan-progress-track">
            <div class="plan-progress-fill" style="width: ${barFill20}%; background: ${savingsDebtReal > target20 ? '#ef4444' : '#8b5cf6'};"></div>
          </div>
          <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 4px;">
            ${unbudgetedMargin > 0 ? `Margen no asignado en papel: ${getCurrencySymbol()} ${unbudgetedMargin.toLocaleString()} (sujeto a pagos pendientes)` : 'Presupuesto mensual al límite'}
          </div>
        </div>

        <!-- Anillo de Salud Financiera Fiel al Mockup -->
        <div class="health-score-container">
          <div class="health-score-title">Índice de Salud Financiera Real</div>
          <div class="health-score-circle-wrap">
            <svg width="90" height="90" viewBox="0 0 90 90" style="transform: rotate(-90deg); position: absolute; top:0; left:0;">
              <circle cx="45" cy="45" r="36" fill="transparent" stroke="rgba(255,255,255,0.08)" stroke-width="7" />
              <circle cx="45" cy="45" r="36" fill="transparent" stroke="${healthBadgeColor}" stroke-width="7"
                stroke-dasharray="226" stroke-dashoffset="${strokeDashoffset}" stroke-linecap="round" style="transition: stroke-dashoffset 0.8s cubic-bezier(0.32, 0.72, 0, 1);" />
            </svg>
            <div style="text-align: center; position: relative; z-index: 2;">
              <span class="health-score-number">${healthScore}</span><span class="health-score-denom">/100</span>
            </div>
          </div>
          <div class="health-score-status-badge" style="color: ${healthBadgeColor}; background: ${healthBadgeColor}20;">
            ${healthBadgeText}
          </div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 6px; text-align: center; max-width: 220px; line-height: 1.35;">
            ${penaltyReasons.length > 0 ? `⚠️ Ajustado por: ${penaltyReasons.join(' · ')}` : 'Situación financiera balanceada'}
          </div>
        </div>
      `;

      const execContainer = document.getElementById('rule503020ExecutiveContainer');
      if (execContainer) execContainer.innerHTML = executiveHtml;

      const oldContainer = document.getElementById('rule503020Container');
      if (oldContainer) oldContainer.innerHTML = executiveHtml;

      // Actualizar widget rápido en Tab Inicio si existe
      const qStatus = document.getElementById('quickSemaforoStatus');
      const qPills = document.getElementById('quickSemaforoPills');
      if (qStatus && qPills) {
        const isGood50 = needsReal <= target50;
        const isGood30 = wantsReal <= target30;
        const isGood20 = totalSavingsAndDebt >= target20;

        qStatus.innerHTML = `🏠 Necesidades: <strong>${realPct50}%</strong> (${isGood50 ? 'Bien' : 'Exceso'}) · 🎉 Deseos: <strong>${realPct30}%</strong> · 💰 Ahorro: <strong>${realPct20}%</strong>`;
        qPills.innerHTML = `
          <span style="background: ${isGood50 ? '#10b98120' : '#ef444420'}; color: ${isGood50 ? '#059669' : '#ef4444'}; padding: 2px 6px; border-radius: 6px;">50% ${isGood50 ? '🟢' : '🔴'}</span>
          <span style="background: ${isGood30 ? '#06b6d420' : '#f59e0b20'}; color: ${isGood30 ? '#0891b2' : '#d97706'}; padding: 2px 6px; border-radius: 6px;">30% ${isGood30 ? '🟢' : '🟡'}</span>
          <span style="background: #10b98120; color: #059669; padding: 2px 6px; border-radius: 6px;">20% 🟢</span>
        `;
      }
    }

    function renderCategoryBudgets() {
      const container = document.getElementById('categoryBudgetsContainer');
      const txs = getMonthTxList();
      
      const realTotals = {};
      Object.keys(CATEGORIES).forEach(c => realTotals[c] = 0);
      txs.forEach(t => realTotals[t.category] = (realTotals[t.category] || 0) + t.amount);

      const budgets = appState.categoryBudgets || {};
      container.innerHTML = Object.keys(CATEGORIES).map(cat => {
        const spent = realTotals[cat] || 0;
        const limit = budgets[cat] || (CATEGORIES[cat] && CATEGORIES[cat].budget) || 1000;
        const pct = Math.min(100, (spent / limit) * 100);
        let color = '#10b981';
        if (pct > 80) color = '#f59e0b';
        if (pct >= 100) color = '#ef4444';

        return `
          <div class="budget-row">
            <div class="budget-info">
              <span>${(CATEGORIES[cat] && CATEGORIES[cat].icon) || '🏷️'} ${cat}</span>
              <span>${getCurrencySymbol()} ${spent.toFixed(0)} / ${getCurrencySymbol()} ${limit} 
                <button class="btn-pill primary" onclick="editCategoryBudget('${cat}')" style="margin-left:4px; margin-right:4px;">✏️</button>
                <button class="btn-pill danger" onclick="deleteCategory('${cat}')">🗑️</button>
              </span>
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-fill" style="width: ${pct}%; background: ${color}"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    function editCategoryBudget(cat) {
      const current = appState.categoryBudgets[cat] || 1000;
      const val = prompt(`Ingresa nuevo límite para ${cat} (S/):`, current);
      if (val !== null && !isNaN(val) && val > 0) {
        appState.categoryBudgets[cat] = parseFloat(val);
        addAuditLog('🎯 Presupuesto', `Nuevo límite ${cat}: S/ ${val}`);
        saveState();
        renderAll();
      }
    }

    function deleteCategory(cat) {
      if (cat === 'Otros') return alert('No puedes eliminar la categoría por defecto.');
      const confirmDelete = confirm(`¿Estás seguro de eliminar la categoría "${cat}"?\n\nSi tiene gastos asociados (históricos), estos seguirán existiendo pero se mostrarán como "Otros".\n\n(Recomendación: úsalo solo para limpiar categorías que ya no usas y están en S/ 0)`);
      
      if (confirmDelete) {
        if (!appState.deletedCategories) appState.deletedCategories = [];
        if (!appState.deletedCategories.includes(cat)) {
          appState.deletedCategories.push(cat);
        }
        
        if (appState.customCategories && appState.customCategories[cat]) {
            delete appState.customCategories[cat];
        }
        
        addAuditLog('🗑️ Categoría', `Categoría ocultada/eliminada: ${cat}`);
        saveState();
        updateDynamicCategories();
        renderAll();
        showToast(`🗑️ Categoría "${cat}" eliminada`, 'info');
      }
    }

    function getFilteredMonthsForHistory() {
      const monthsEs = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      // Solo meses 2026 con formato "Mes 2026", ordenados cronológicamente
      const allM2026 = getSortedMonths().filter(m => m.endsWith(' 2026'));

      const filter = currentHistoryPeriodFilter;

      if (filter === 'CURR') return [appState.currentMonth].filter(m => m.endsWith('2026'));
      if (filter === 'Q3') return allM2026.filter(m => ['Julio 2026', 'Agosto 2026', 'Septiembre 2026'].includes(m));
      if (filter === 'Q4') return allM2026.filter(m => ['Octubre 2026', 'Noviembre 2026', 'Diciembre 2026'].includes(m));

      // Limitar a los últimos 6 meses para no saturar
      return allM2026.slice(-6);
    }

    function renderHistoryTable() {
      const container = document.getElementById('historyTableContainer');
      const months = getFilteredMonthsForHistory();
      
      let html = `
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border); color: var(--text-muted);">
              <th style="padding: 6px;">Mes</th>
              <th style="padding: 6px;">Gastado</th>
              <th style="padding: 6px;">Superávit</th>
              <th style="padding: 6px;">Estado</th>
            </tr>
          </thead>
          <tbody>
      `;

      months.forEach(m => {
        const txs = appState.transactions[m] || [];
        const spent = txs.reduce((s, t) => s + t.amount, 0);
        const totInc = getMonthTotalIncome(m);
        const savings = totInc - spent;
        const pctColor = savings >= 440 ? 'text-success' : (savings >= 0 ? 'text-warning' : 'text-danger');

        html += `
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 6px; font-weight: 700;">${m}</td>
            <td style="padding: 6px;">${getCurrencySymbol()} ${spent.toFixed(2)}</td>
            <td style="padding: 6px; font-weight: 700;">${getCurrencySymbol()} ${savings.toFixed(2)}</td>
            <td style="padding: 6px; font-weight: 800;" class="${pctColor}">${savings >= 0 ? 'Superávit' : 'Déficit'}</td>
          </tr>
        `;
      });

      html += `</tbody></table>`;
      container.innerHTML = html;
    }

    function renderHistoryChart() {
      const ctx = document.getElementById('historyChart');
      if (!ctx) return;

      const months = getFilteredMonthsForHistory();
      const spentData = [];
      const savingsData = [];

      months.forEach(m => {
        const txs = appState.transactions[m] || [];
        const spent = txs.reduce((s, t) => s + t.amount, 0);
        const totInc = getMonthTotalIncome(m);
        const savings = Math.max(0, totInc - spent);
        spentData.push(spent);
        savingsData.push(savings);
      });

      if (historyChartObj) historyChartObj.destroy();

      historyChartObj = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
          labels: months,
          datasets: [
            { label: 'Gastos Total', data: spentData, backgroundColor: '#ef4444', borderRadius: 8, barPercentage: 0.7, categoryPercentage: 0.8 },
            { label: 'Superávit', data: savingsData, backgroundColor: '#10b981', borderRadius: 8, barPercentage: 0.7, categoryPercentage: 0.8 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { font: { family: 'Plus Jakarta Sans', size: 10, weight: '600' } } }
          },
          scales: {
            x: { grid: { display: false } },
            y: { ticks: { callback: v => 'S/' + v } }
          }
        }
      });
    }

    // Checklist removed by user request
    function renderChecklist() { /* disabled */ }
    function toggleChecklist(id) { /* disabled */ }

    /* ====== 1. METAS DE AHORRO CON PROYECCIÓN INTELIGENTE ====== */
    function renderGoals() {
      const container = document.getElementById('goalsContainer');
      if (!container) return;
      const goals = appState.savingsGoals || [];

      if (goals.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; color: var(--text-muted); padding: 36px 20px; grid-column: 1 / -1; background: var(--card-bg); border-radius: 20px; border: 1px dashed var(--border);">
            <div style="font-size: 32px; margin-bottom: 8px;">🎯</div>
            <div style="font-size: 14px; font-weight: 800; color: var(--text-main);">Aún no tienes metas creadas</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px; margin-bottom: 14px;">Define objetivos como Fondo de Emergencia, Vacaciones o Enganche de Auto.</div>
            <button class="btn btn-primary btn-sm" onclick="openAddGoalModal()">+ Crear Primera Meta</button>
          </div>
        `;
        return;
      }

      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const now = new Date();

      container.innerHTML = goals.map(g => {
        const current = g.current || 0;
        const target = g.target || 1;
        const pct = Math.min(100, Math.round((current / target) * 100));
        const remaining = Math.max(0, target - current);
        const monthly = g.monthlyContribution || 250;
        const monthsNeeded = remaining > 0 ? Math.ceil(remaining / monthly) : 0;

        const targetDate = new Date(now.getFullYear(), now.getMonth() + monthsNeeded, 1);
        const targetDateStr = `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;

        let aiText = '';
        if (remaining <= 0) {
          aiText = '🎉 <strong>¡Meta Cumplida!</strong> Has alcanzado el 100% de tu objetivo de ahorro.';
        } else {
          aiText = `A tu ritmo de <strong>S/ ${monthly.toFixed(0)}/mes</strong>, alcanzarás tu meta en <strong>${monthsNeeded} meses</strong> (${targetDateStr}).`;
          if (monthsNeeded > 2) {
            const fasterMonths = Math.ceil(remaining / (monthly + 100));
            const diff = monthsNeeded - fasterMonths;
            if (diff > 0) {
              aiText += `<br><span style="color: var(--primary); font-weight: 700;">💡 Con S/ 100 más al mes llegarías ${diff} mes(es) antes.</span>`;
            }
          }
        }

        return `
          <div class="luxury-goal-card">
            <div class="goal-top-row">
              <div class="goal-icon-title">
                <div class="goal-emoji-bubble">${g.icon || '🎯'}</div>
                <div>
                  <div class="goal-name-text">${g.name}</div>
                  <div class="goal-target-date">🗓️ Estimado: ${targetDateStr}</div>
                </div>
              </div>
              <button class="btn-pill danger" onclick="deleteGoal('${g.id}')" title="Eliminar meta" style="opacity: 0.7;">🗑️</button>
            </div>

            <div class="goal-amounts-row">
              <span class="goal-saved-val">${getCurrencySymbol()} ${current.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
              <span class="goal-target-val">Meta: ${getCurrencySymbol()} ${target.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 0 })}</span>
            </div>

            <div class="goal-progress-track">
              <div class="goal-progress-fill" style="width: ${pct}%;"></div>
            </div>

            <div class="flex-between" style="font-size: 11px; color: var(--text-muted); font-weight: 700;">
              <span>Progreso: ${pct}%</span>
              <span>Faltan: ${getCurrencySymbol()} ${remaining.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 0 })}</span>
            </div>

            <div class="ai-projection-badge">
              <span class="ai-tag">IA</span>
              <div>${aiText}</div>
            </div>

            <div class="goal-actions-row">
              <button class="btn btn-primary btn-sm" onclick="openDepositGoalModal('${g.id}')" style="flex: 1; border-radius: 12px; font-weight: 800;">
                + Aportar Dinero
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    function openAddGoalModal() {
      closeModal('settingsModal');
      const name = document.getElementById('goalName');
      if (name) name.value = '';
      const target = document.getElementById('goalTarget');
      if (target) target.value = '';
      const cur = document.getElementById('goalCurrent');
      if (cur) cur.value = '0';
      const m = document.getElementById('goalMonthly');
      if (m) m.value = '250';
      openModalById('addGoalModal');
    }

    function handleOpenAddGoalClick() {
      closeModal('settingsModal');
      if (appState.savingsGoals && appState.savingsGoals.length >= 1 && !isUserPro()) {
        openFinZenProModal('Metas de Ahorro Múltiples');
        return;
      }
      openAddGoalModal();
    }

    function handleAddGoal(e) {
      e.preventDefault();
      const name = document.getElementById('goalName').value.trim();
      const target = parseFloat(document.getElementById('goalTarget').value);
      const current = parseFloat(document.getElementById('goalCurrent').value) || 0;
      const monthly = parseFloat(document.getElementById('goalMonthly').value) || 200;
      const icon = document.getElementById('goalIcon').value;

      appState.savingsGoals.push({
        id: 'g_' + Date.now(),
        name: name,
        target: target,
        current: current,
        monthlyContribution: monthly,
        icon: icon
      });

      addAuditLog('🎯 Nueva Meta', `Creada: ${name}`);
      saveState();
      closeModal('addGoalModal');
      renderGoals();
      switchTab('metas');
      showToast('🎯 Meta de ahorro creada con éxito', 'success');
    }

    function deleteGoal(id) {
      const g = appState.savingsGoals.find(item => item.id === id);
      if (!confirm('¿Eliminar esta meta de ahorro?')) return;
      if (g) addAuditLog('🗑️ Eliminar Meta', `Eliminada: ${g.name}`);
      appState.savingsGoals = appState.savingsGoals.filter(item => item.id !== id);
      saveState();
      renderGoals();
      showToast('🗑️ Meta eliminada', 'info');
    }

    function openDepositGoalModal(id) {
      const g = appState.savingsGoals.find(item => item.id === id);
      if (!g) return;
      document.getElementById('depositGoalId').value = id;
      document.getElementById('depositAmount').value = '';
      openModalById('depositGoalModal');
    }

    function handleDepositGoal(e) {
      e.preventDefault();
      const id = document.getElementById('depositGoalId').value;
      const amount = parseFloat(document.getElementById('depositAmount').value);
      if (!amount || amount <= 0) return;

      const g = appState.savingsGoals.find(item => item.id === id);
      if (g) {
        g.current += amount;
        addAuditLog('💰 Aporte Meta', `S/ ${amount.toFixed(2)} a ${g.name}`);
        saveState();
        showToast(`💰 S/ ${amount.toFixed(2)} sumados a ${g.name}`, 'success');
      }
      closeModal('depositGoalModal');
      renderGoals();
    }

    /* ====== 2. RADAR DE GASTOS HORMIGA & FUGAS ====== */
    let radarActiveFilter = 'all'; // 'all', 'services', 'micro'
    let radarSearchTerm = '';

    function setRadarFilter(filter) {
      radarActiveFilter = filter;
      renderGastosHormiga();
    }
    window.setRadarFilter = setRadarFilter;

    function onRadarSearchInput(val) {
      radarSearchTerm = (val || '').toLowerCase().trim();
      renderGastosHormiga();
    }
    window.onRadarSearchInput = onRadarSearchInput;

    function renderGastosHormiga() {
      const execContainer = document.getElementById('radarFugasExecutiveContainer');
      const oldContainer = document.getElementById('radarHormigaContainer');
      if (!execContainer && !oldContainer) return;

      const txs = getMonthTxList();
      
      const leakKeywords = {
        cafes: ['café', 'cafe', 'starbucks', 'snack', 'golosina', 'antojo', 'panaderia', 'dulce', 'helado'],
        delivery: ['delivery', 'rappi', 'pedidosya', 'uber eats', 'didi food', 'propina'],
        taxis: ['taxi', 'uber', 'cabify', 'indrive', 'colectivo', 'combi']
      };

      const plannedServices = [];
      const microExpenses = [];
      let servicesMonthlyTotal = 0;
      let microSpendTotal = 0;

      txs.forEach(t => {
        const nameLower = (t.name || '').toLowerCase();
        const catLower = (t.category || '').toLowerCase();
        const amt = parseFloat(t.amount) || 0;

        // 1. Servicios y Membresías Fijas (Suscripciones, Gimnasio, iCloud, streaming)
        if (catLower === 'suscripciones' || catLower === 'gimnasio & salud' || 
            /gym|gimnasio|spotify|netflix|youtube|icloud|apple|disney|prime|hbo|cloud/i.test(nameLower)) {
          let icon = '📱';
          if (/gym|gimnasio/i.test(nameLower) || catLower.includes('gimnasio')) icon = '🏋️';
          else if (/spotify/i.test(nameLower)) icon = '🎧';
          else if (/netflix/i.test(nameLower)) icon = '🍿';
          else if (/youtube/i.test(nameLower)) icon = '▶️';
          else if (/icloud|cloud|apple/i.test(nameLower)) icon = '☁️';

          plannedServices.push({
            icon,
            name: t.name,
            monthly: amt,
            annual: amt * 12,
            type: 'service'
          });
          servicesMonthlyTotal += amt;
        } 
        // 2. Gastos Hormiga & Compras Menores (Consumos < S/ 35 cotidianos)
        // Regla: NUNCA clasificar viajes, cuotas bancarias, compras mayores a 35 ni servicios como hormiga
        else {
          const isMajorOrInstallment = t.isInstallment || 
                                       amt > 35 || 
                                       catLower === 'viajes' || 
                                       catLower === 'tarjetas' || 
                                       catLower === 'préstamos' || 
                                       catLower === 'alquiler' || 
                                       catLower === 'vivienda' ||
                                       catLower === 'carro' ||
                                       catLower === 'papá' ||
                                       catLower === 'mapfre';

          if (!isMajorOrInstallment && (
              amt <= 35 || 
              leakKeywords.cafes.some(k => nameLower.includes(k)) || 
              leakKeywords.delivery.some(k => nameLower.includes(k)) || 
              leakKeywords.taxis.some(k => nameLower.includes(k))
          )) {
            let icon = '🐜';
            if (leakKeywords.cafes.some(k => nameLower.includes(k))) icon = '☕';
            else if (leakKeywords.delivery.some(k => nameLower.includes(k))) icon = '🛵';
            else if (leakKeywords.taxis.some(k => nameLower.includes(k))) icon = '🚕';

            microExpenses.push({
              icon,
              name: t.name,
              monthly: amt,
              annual: amt * 12,
              type: 'micro'
            });
            microSpendTotal += amt;
          }
        }
      });

      // Filtrar por término de búsqueda y filtro activo
      let displayItems = [];
      if (radarActiveFilter === 'services') {
        displayItems = [...plannedServices];
      } else if (radarActiveFilter === 'micro') {
        displayItems = [...microExpenses];
      } else {
        displayItems = [...plannedServices, ...microExpenses];
      }

      if (radarSearchTerm) {
        displayItems = displayItems.filter(item => item.name.toLowerCase().includes(radarSearchTerm));
      }

      const servicesAnnualTotal = servicesMonthlyTotal * 12;

      let executiveHtml = `
        <!-- Filtros Rápidos & Buscador de Gastos -->
        <div class="radar-controls-row">
          <button type="button" class="radar-filter-pill ${radarActiveFilter === 'all' ? 'active' : ''}" onclick="setRadarFilter('all')">Todos (${plannedServices.length + microExpenses.length})</button>
          <button type="button" class="radar-filter-pill ${radarActiveFilter === 'services' ? 'active' : ''}" onclick="setRadarFilter('services')">📱 Servicios (${plannedServices.length})</button>
          <button type="button" class="radar-filter-pill ${radarActiveFilter === 'micro' ? 'active' : ''}" onclick="setRadarFilter('micro')">🐜 Menores &lt;35 (${microExpenses.length})</button>
          <input type="text" placeholder="🔍 Buscar servicio o gasto..." value="${escapeHtml(radarSearchTerm)}" oninput="onRadarSearchInput(this.value)" class="radar-search-input">
        </div>

        <!-- Lista de Conceptos -->
        <div class="radar-subs-list" style="max-height: 240px; overflow-y: auto;">
          ${displayItems.length > 0 ? displayItems.map(item => `
            <div class="radar-sub-item">
              <div class="radar-sub-left">
                <div class="radar-sub-icon">${item.icon}</div>
                <div>
                  <div class="radar-sub-name">${escapeHtml(item.name)}</div>
                  <div style="font-size: 10px; color: var(--text-muted);">${item.type === 'service' ? 'Servicio / Membresía mensual' : 'Gasto menor cotidiano'}</div>
                </div>
              </div>
              <div class="radar-sub-right">
                <div class="radar-sub-monthly">${getCurrencySymbol()} ${item.monthly.toFixed(2)}/mes</div>
                <div class="radar-sub-annual" title="Equivalente en 12 meses">${getCurrencySymbol()} ${item.annual.toFixed(2)} al año</div>
              </div>
            </div>
          `).join('') : `
            <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 12px;">
              No se encontraron resultados para el filtro seleccionado.
            </div>
          `}
        </div>

        <!-- Costo Anual Proyectado con Explicación Transparente -->
        <div class="radar-cost-banner" style="margin-top: 12px;">
          <div class="radar-cost-banner-title">Impacto Anual Proyectado en Servicios Fijos</div>
          <div class="radar-cost-banner-val">${getCurrencySymbol()} ${servicesAnnualTotal.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} al año</div>
          <div style="font-size: 10.5px; opacity: 0.85; margin-top: 3px;">
            Suma de tus servicios fijos (S/ ${servicesMonthlyTotal.toFixed(2)}/mes) multiplicados por 12 meses para planificar tu costo de vida anual.
          </div>
        </div>

        <!-- Alertas Informativas Transparentes -->
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 12px;">
          <div class="radar-alert-box" style="background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.25);">
            <span>🏋️</span>
            <div>
              <strong style="color: #059669;">Membresías y Servicios Fijos:</strong> 
              Gastos como el gimnasio y herramientas de trabajo son compromisos planificados y conscientes de salud y bienestar, no fugas de dinero.
            </div>
          </div>

          <div class="radar-alert-box">
            <span>🐜</span>
            <div>
              <strong>Consumos Menores (&lt; S/ 35):</strong> 
              ${getCurrencySymbol()} ${microSpendTotal.toFixed(2)}/mes registrados en ${microExpenses.length} operaciones. Mantén atención para que no se acumulen sin planificar.
            </div>
          </div>
        </div>
      `;

      if (execContainer) execContainer.innerHTML = executiveHtml;
      if (oldContainer) oldContainer.innerHTML = executiveHtml;
    }

    function togglePlanLowerView(view) {
      const isCuotas = (view === 'cuotas');
      const btnC = document.getElementById('segPlanCuotasBtn');
      const btnH = document.getElementById('segPlanHistoryBtn');
      const boxC = document.getElementById('segmentCuotasBox');
      const boxH = document.getElementById('segmentHistoryBox');
      if (btnC) btnC.classList.toggle('active', isCuotas);
      if (btnH) btnH.classList.toggle('active', !isCuotas);
      if (boxC) boxC.style.display = isCuotas ? 'block' : 'none';
      if (boxH) boxH.style.display = isCuotas ? 'none' : 'block';
      if (!isCuotas && typeof renderHistoryChart === 'function') {
        renderHistoryChart();
      }
    }
    window.togglePlanLowerView = togglePlanLowerView;

    function filterHormigaGroup(key) {
      switchTab('movimientos');
      if (typeof setTxViewMode === 'function') {
        setTxViewMode('list');
      }
      const searchInput = document.getElementById('searchTx');
      const advAmount = document.getElementById('advFilterAmount');
      if (key === 'otros') {
        if (advAmount) advAmount.value = 'MICRO';
        if (searchInput) searchInput.value = '';
      } else {
        const keywords = {
          cafes: 'café',
          delivery: 'delivery',
          suscripciones: 'suscripciones',
          taxis: 'taxi'
        };
        if (searchInput) searchInput.value = keywords[key] || '';
      }
      onAdvFilterChange();
      setTimeout(() => {
        const el = document.getElementById('txListViewContainer');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      showToast(`🔍 Filtrando gastos vinculados`, 'info');
    }

    function showHormigaAdvice(totalAnnual) {
      const halfSaved = (totalAnnual / 2).toLocaleString('es-PE', { minimumFractionDigits: 0 });
      alert(`💡 Oportunidad Financiera de Ahorro:\n\nSi optimizas y reduces a la mitad estos micro-gastos, acumularías S/ ${halfSaved} libres al año.\n\nEsto equivale a financiar tu fondo de emergencia o un viaje sin sacrificar tu calidad de vida.`);
    }

    function showGroupOptimizationTip(key, annual) {
      const tips = {
        cafes: `☕ Consejo de Café & Snacks:\nGastas S/ ${annual.toLocaleString()} al año. Preparar tu café en casa 3 días a la semana te ahorrará más de S/ ${(annual * 0.4).toFixed(0)} anuales.`,
        delivery: `🛵 Consejo de Delivery:\nGastas S/ ${annual.toLocaleString()} al año. Cocinar una vez más por semana o recoger los pedidos sin tarifa express ahorra hasta S/ ${(annual * 0.45).toFixed(0)}.`,
        suscripciones: `📺 Consejo de Suscripciones:\nGastas S/ ${annual.toLocaleString()} al año. Audita los servicios que usas menos de 2 veces por semana y paúsalos por temporadas.`,
        taxis: `🚕 Consejo de Taxis:\nGastas S/ ${annual.toLocaleString()} al año. Planificar tus salidas con 15 minutos de anticipación amortigua S/ ${(annual * 0.35).toFixed(0)}.`,
        otros: `🐜 Micro-gastos diversos:\nSumaron S/ ${annual.toLocaleString()} al año. Asignar un presupuesto semanal en efectivo para compras sueltas frena las fugas invisibles.`
      };
      alert(tips[key] || `Optimizando este rubro puedes recuperar parte de los S/ ${annual.toLocaleString()} al año.`);
    }


    /* ====== 4. CALENDARIO FINANCIERO REMOVIDO (OPTIMIZACIÓN MINIMALISTA) ====== */
    function setTxViewMode(mode) {}
    function selectCalendarDay(day) {}
    function renderCalendarView() {}

    function renderAuditTable() {
      const container = document.getElementById('auditTableBody');
      if (!container) return;

      const log = appState.auditLog || [];
      if (log.length === 0) {
        container.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 20px;">No hay cambios registrados.</td></tr>`;
        return;
      }

      container.innerHTML = log.map(entry => `
        <tr>
          <td style="font-size: 10px; font-weight: 700; color: var(--text-muted);">${entry.timestamp}</td>
          <td><span class="badge badge-casa">${entry.month}</span></td>
          <td style="font-weight: 800;">${entry.action}</td>
          <td style="font-size: 11px;">${entry.details}</td>
        </tr>
      `).join('');
    }

    function clearAuditLog() {
      if (!confirm('¿Borrar historial de auditoría?')) return;
      appState.auditLog = [];
      saveState();
      renderAuditTable();
    }

    function renderPersonalizedTips() {
      const container = document.getElementById('personalizedTipsContainer');
      const txs = getMonthTxList();
      const totalIncome = getMonthTotalIncome();
      const totalSpent = txs.reduce((s, t) => s + t.amount, 0);
      const pendingCount = txs.filter(t => (t.status || 'Pagado') === 'Pendiente').length;
      const isCesarTips = isAdminCesar();
      
      const catTotals = {};
      txs.forEach(t => catTotals[t.category] = (catTotals[t.category] || 0) + t.amount);

      const tips = [];

      // Si el usuario NO tiene gastos ni ingresos, mostrar mensaje de bienvenida
      if (txs.length === 0 && (!totalIncome || totalIncome === 0)) {
        tips.push({
          type: 'info',
          icon: '👋',
          title: '¡Bienvenido a tu Asesor Financiero!',
          text: '<p>Empieza registrando tus ingresos y gastos del mes para recibir consejos personalizados basados en tu situación real.</p><p style="margin-top:6px;">Usa los botones directos para registrar tu primer gasto o ingreso.</p>'
        });
      } else {
        // Consejo dinámico: Nivel de gasto vs ingresos
        if (totalIncome > 0) {
          const spendRatio = totalSpent / totalIncome;
          if (spendRatio > 1) {
            tips.push({
              type: 'danger',
              icon: '🚨',
              title: 'Gastos superan tus ingresos',
              text: `<p>Este mes llevas <strong>S/ ${totalSpent.toLocaleString('es-PE', {minimumFractionDigits: 2})}</strong> en gastos vs <strong>S/ ${totalIncome.toLocaleString('es-PE')}</strong> de ingresos. Estás gastando <strong>${((spendRatio - 1) * 100).toFixed(0)}% más</strong> de lo que ganas.</p><p style="margin-top:6px;">Revisa qué gastos puedes reducir o postergar este mes.</p>`
            });
          } else if (spendRatio > 0.9) {
            tips.push({
              type: 'warning',
              icon: '⚠️',
              title: 'Margen de ahorro muy ajustado',
              text: `<p>Has usado el <strong>${(spendRatio * 100).toFixed(0)}%</strong> de tus ingresos. Tu margen de ahorro es de apenas <strong>S/ ${(totalIncome - totalSpent).toLocaleString('es-PE', {minimumFractionDigits: 2})}</strong>.</p><p style="margin-top:6px;">Intenta mantener al menos un 10% de colchón para imprevistos.</p>`
            });
          } else if (spendRatio < 0.7 && txs.length > 0) {
            tips.push({
              type: 'success',
              icon: '🎉',
              title: '¡Excelente control financiero!',
              text: `<p>Solo has usado el <strong>${(spendRatio * 100).toFixed(0)}%</strong> de tus ingresos. Tienes <strong>S/ ${(totalIncome - totalSpent).toLocaleString('es-PE', {minimumFractionDigits: 2})}</strong> de margen. ¡Sigue así!</p>`
            });
          }
        }

        // Consejo: Gastos pendientes
        if (pendingCount > 3) {
          tips.push({
            type: 'warning',
            icon: '📋',
            title: `${pendingCount} gastos pendientes de pago`,
            text: `<p>Tienes <strong>${pendingCount} gastos</strong> marcados como pendientes este mes. Revísalos y actualiza su estado conforme los vayas pagando.</p>`
          });
        }

        // Consejo: Categoría con mayor gasto (solo si tiene gastos)
        if (Object.keys(catTotals).length > 0) {
          const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
          const catBudget = appState.categoryBudgets?.[topCat[0]] || 1000;
          if (topCat[1] > catBudget) {
            tips.push({
              type: 'danger',
              icon: '📊',
              title: `Presupuesto excedido en "${topCat[0]}"`,
              text: `<p>Llevas <strong>S/ ${topCat[1].toFixed(0)}</strong> de un presupuesto de <strong>S/ ${catBudget}</strong> en esta categoría. Superaste el límite por <strong>S/ ${(topCat[1] - catBudget).toFixed(0)}</strong>.</p>`
            });
          }
        }

        // Tips específicos de César (admin) — solo si es su cuenta
        if (isCesarTips) {
          const gatitosTotal = (catTotals['Comida gatitos casa'] || 0) + (catTotals['Comida gatitos calle'] || 0) + (catTotals['Arena gatitos casa'] || 0);
          if (gatitosTotal > 200) {
            tips.push({
              type: 'warning',
              icon: '🐱',
              title: 'Optimización de Gasto en Gatitos',
              text: '<p>Comprar alimento y arena en sacos de 10-15kg reduce el costo mensual un 20%.</p>'
            });
          }
        }
      }

      // Si no hay tips, mostrar un mensaje genérico positivo con tipografía pulida
      if (tips.length === 0) {
        tips.push({
          type: 'success',
          icon: '✨',
          title: 'Sin alertas este mes',
          text: '<p>Tus finanzas se mantienen en orden. Sigue registrando tus movimientos para recibir recomendaciones personalizadas.</p>'
        });
      }

      if (!appState.tipsStatus) appState.tipsStatus = {};

      container.innerHTML = tips.map((t, idx) => {
        const tipKey = 'tip_' + idx;
        const isDone = appState.tipsStatus[tipKey] || false;
        return `
          <div class="advice-card ${t.type}">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
              <div style="flex: 1; min-width: 0;">
                <div class="advice-title"><span>${t.icon}</span> <span>${t.title}</span></div>
                <div class="advice-body">${t.text}</div>
              </div>
              <label style="display: flex; align-items: center; gap: 5px; cursor: pointer; flex-shrink: 0; padding: 5px 9px; border-radius: 8px; font-size: 10.5px; font-weight: 800; background: ${isDone ? '#dcfce7' : '#fef3c7'}; color: ${isDone ? '#166534' : '#92400e'}; border: 1px solid ${isDone ? '#86efac' : '#fde68a'}; transition: all 0.2s; user-select: none;">
                <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleTipStatus('${tipKey}')" style="width: 14px; height: 14px; accent-color: #16a34a; cursor: pointer;">
                <span>${isDone ? 'Hecho' : 'Pendiente'}</span>
              </label>
            </div>
          </div>
        `;
      }).join('');
    }

    function toggleTipStatus(tipKey) {
      if (!appState.tipsStatus) appState.tipsStatus = {};
      appState.tipsStatus[tipKey] = !appState.tipsStatus[tipKey];
      addAuditLog('💡 Consejo', `Consejo "${tipKey}" marcado como ${appState.tipsStatus[tipKey] ? 'Hecho ✅' : 'Pendiente ⏳'}`);
      saveState();
      renderPersonalizedTips();
    }

    function toggleCollapseCard(containerId, btnId) {
      const el = document.getElementById(containerId);
      const btn = document.getElementById(btnId);
      if (!el) return;
      if (el.style.display === 'none') {
        el.style.display = '';
        if (btn) btn.textContent = '▼';
      } else {
        el.style.display = 'none';
        if (btn) btn.textContent = '▶';
      }
    }

    function openAddCategoryModal() {
      document.getElementById('catName').value = '';
      document.getElementById('catIcon').value = '🏷️';
      document.getElementById('catColor').value = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      document.getElementById('addCategoryModal').style.display = ''; // reset style display if it was used
      document.getElementById('addCategoryModal').classList.add('active');
    }

    function saveCategory() {
      const activeCatsCount = Object.keys(CATEGORIES).length;
      if (!isUserPro() && activeCatsCount >= 11) {
        openFinZenProModal('Categorías y Presupuestos Ilimitados');
        return;
      }

      const name = document.getElementById('catName').value.trim();
      const icon = document.getElementById('catIcon').value.trim() || '🏷️';
      const color = document.getElementById('catColor').value;
      
      if (!name) return alert('Debes ingresar un nombre para la categoría.');
      
      if (!appState.customCategories) {
        appState.customCategories = {};
      }
      
      appState.customCategories[name] = {
        icon: icon,
        badgeClass: 'badge-custom',
        color: color,
        budget: 0
      };
      
      addAuditLog('🏷️ Categoría', `Creada nueva categoría: ${name}`);
      saveState();
      updateDynamicCategories();
      renderAll();
      closeModal('addCategoryModal');
      showToast(`✅ Categoría "${name}" guardada con éxito`, 'success');
    }

    function toggleFAB() {
      const overlay = document.getElementById('fabOverlay');
      const menu = document.getElementById('fabMenu');
      const btn = document.getElementById('fabBtn');
      const isOpen = menu.style.display === 'flex';
      if (isOpen) {
        menu.style.display = 'none';
        overlay.style.display = 'none';
        btn.textContent = '+';
        btn.style.transform = 'rotate(0deg)';
      } else {
        menu.style.display = 'flex';
        overlay.style.display = 'block';
        btn.textContent = '✕';
        btn.style.transform = 'rotate(90deg)';
      }
    }

    function openAddExpenseModal() {
      document.getElementById('editingTxId').value = '';
      document.getElementById('txName').value = '';
      document.getElementById('txAmount').value = '';
      document.getElementById('txStatus').value = 'Pagado';
      document.getElementById('txDueDate').value = new Date().getDate().toString();
      document.getElementById('txIsInstallment').checked = false;
      document.getElementById('installmentFieldsGroup').style.display = 'none';
      if (document.getElementById('txInstallmentsTotal')) document.getElementById('txInstallmentsTotal').value = '12';
      if (document.getElementById('txInstallmentsCurrent')) document.getElementById('txInstallmentsCurrent').value = '1';
      if (document.getElementById('txInstallmentsRemaining')) document.getElementById('txInstallmentsRemaining').value = '12';
      if (document.getElementById('txInstallmentTea')) document.getElementById('txInstallmentTea').value = '0';

      document.getElementById('expenseModalTitle').textContent = '+ Registrar Nuevo Gasto';
      document.getElementById('saveExpenseBtn').textContent = 'Guardar Gasto';
      openModalById('addExpenseModal');
    }

    function openEditSalaryModal() {
      closeModal('settingsModal');
      const input = document.getElementById('newSalaryInput');
      if (input) input.value = appState.salary || 0;
      openModalById('editSalaryModal');
    }

    function handleSaveSalary(e) {
      e.preventDefault();
      const val = parseFloat(document.getElementById('newSalaryInput').value);
      if (val > 0) {
        appState.salary = val;
        const isCesar = isAdminCesar();
        if (!isCesar) {
          const curM = appState.currentMonth || getCurrentCalendarMonthName();
          if (!appState.incomes) appState.incomes = {};
          if (!appState.incomes[curM]) appState.incomes[curM] = [];
          const existingSalary = appState.incomes[curM].find(i => i.id.startsWith('inc_sueldo_') || i.name.toLowerCase().includes('sueldo'));
          const payDay = parseInt(appState.recurringDueDates?.['sueldo'] || 28);
          if (existingSalary) {
            existingSalary.amount = val;
            existingSalary.date = payDay;
          } else {
            appState.incomes[curM].unshift({
              id: 'inc_sueldo_' + curM,
              name: 'Sueldo Mensual',
              amount: val,
              status: 'Pendiente',
              date: payDay
            });
          }
        }
        addAuditLog('✏️ Ajuste Sueldo', `Nuevo sueldo: S/ ${val}`);
        saveState();
        closeModal('editSalaryModal');
        renderAll();
      }
    }

    // ================================================================
    // GESTIÓN DE CATEGORÍAS (GLASSMORPHISM)
    // ================================================================
    let selectedManagerEmoji = '⭐';
    let selectedManagerColor = '#38bdf8';

    function openCategoryManagerModal() {
      closeModal('settingsModal');
      renderCategoryManagerList();
      openModalById('categoryManagerModal');
    }

    function selectManagerEmoji(emoji, btn) {
      selectedManagerEmoji = emoji;
      document.getElementById('managerCatIcon').value = emoji;
      document.querySelectorAll('.glass-emoji-btn').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
    }

    function selectManagerColor(color, dot) {
      selectedManagerColor = color;
      document.getElementById('managerCatColor').value = color;
      document.querySelectorAll('.glass-color-dot').forEach(d => d.classList.remove('active'));
      if (dot) dot.classList.add('active');
    }

    function renderCategoryManagerList() {
      const container = document.getElementById('categoryManagerList');
      if (!container) return;
      
      const txs = getMonthTxList();
      const realTotals = {};
      Object.keys(CATEGORIES).forEach(c => realTotals[c] = 0);
      txs.forEach(t => realTotals[t.category] = (realTotals[t.category] || 0) + t.amount);
      
      const countEl = document.getElementById('managerTotalCatsCount');
      if (countEl) countEl.textContent = `${Object.keys(CATEGORIES).length} categorías`;

      container.innerHTML = Object.keys(CATEGORIES).map(cat => {
        const info = CATEGORIES[cat] || { icon: '📌', color: '#94a3b8' };
        const spent = realTotals[cat] || 0;
        const limit = (appState.categoryBudgets && appState.categoryBudgets[cat]) || 1000;
        const pct = Math.min(100, (spent / limit) * 100);
        const left = Math.max(0, limit - spent);
        
        let barColor = '#10b981';
        if (pct > 80) barColor = '#f59e0b';
        if (pct >= 100) barColor = '#ef4444';
        
        const deleteBtn = (cat !== 'Otros') 
          ? `<button onclick="deleteCategoryFromManager('${cat}')" title="Eliminar categoría" style="background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); color:#f87171; border-radius:8px; width:28px; height:28px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:12px;">🗑️</button>` 
          : '';
          
        return `
          <div class="glass-cat-item">
            <div class="glass-cat-icon" style="background:${info.color}20; border:1px solid ${info.color}50; color:${info.color};">
              ${info.icon}
            </div>
            <div style="flex:1; min-width:0;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <div style="font-weight:800; font-size:13px; color:#f8fafc; display:flex; align-items:center; gap:6px;">
                  <span style="width:7px; height:7px; border-radius:50%; background:${info.color}; display:inline-block;"></span>
                  ${cat}
                </div>
                <div style="font-size:11px; font-weight:700; color:#cbd5e1;">
                  ${getCurrencySymbol()} ${spent.toFixed(0)} <span style="color:#64748b;">/ ${getCurrencySymbol()} ${limit.toFixed(0)}</span>
                </div>
              </div>
              <div style="height:6px; background:rgba(255,255,255,0.08); border-radius:999px; overflow:hidden; margin-bottom:4px;">
                <div style="height:100%; width:${pct}%; background:${barColor}; border-radius:999px; transition:width 0.3s ease;"></div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; color:#94a3b8;">
                <span>${getCurrencySymbol()} ${left.toFixed(0)} restante</span>
                ${pct >= 100 ? '<span style="color:#ef4444; font-weight:800;">⚠️ Excedido</span>' : ''}
              </div>
            </div>
            <div style="display:flex; gap:6px; align-items:center; margin-left:6px;">
              <button onclick="editCategoryBudgetFromManager('${cat}')" title="Editar límite de presupuesto" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); color:#cbd5e1; border-radius:8px; width:28px; height:28px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:12px;">✏️</button>
              ${deleteBtn}
            </div>
          </div>
        `;
      }).join('');
    }

    function saveCategoryFromManager() {
      const name = document.getElementById('managerCatName').value.trim();
      const icon = document.getElementById('managerCatIcon').value.trim() || '🏷️';
      const color = document.getElementById('managerCatColor').value || '#38bdf8';
      const budget = parseFloat(document.getElementById('managerCatBudget').value) || 1000;

      if (!name) return alert('Por favor ingresa un nombre para la categoría.');

      if (!appState.customCategories) appState.customCategories = {};
      if (!appState.categoryBudgets) appState.categoryBudgets = {};

      appState.customCategories[name] = {
        icon: icon,
        badgeClass: 'badge-custom',
        color: color
      };
      appState.categoryBudgets[name] = budget;

      addAuditLog('🏷️ Categoría', `Nueva categoría: ${icon} ${name} (Límite: S/ ${budget})`);
      saveState();
      updateDynamicCategories();
      renderAll();
      renderCategoryManagerList();

      document.getElementById('managerCatName').value = '';
      showToast(`✅ Categoría "${name}" creada con éxito`, 'success');
    }

    function handleSaveCategoryClick() {
      const activeCatsCount = Object.keys(CATEGORIES).length;
      if (!isUserPro() && activeCatsCount >= 11) {
        openFinZenProModal('Categorías y Presupuestos Ilimitados');
        return;
      }
      saveCategoryFromManager();
    }

    function editCategoryBudgetFromManager(cat) {
      const current = (appState.categoryBudgets && appState.categoryBudgets[cat]) || 1000;
      const val = prompt(`Ingresa nuevo límite mensual para ${cat} (S/):`, current);
      if (val !== null && !isNaN(val) && val > 0) {
        if (!appState.categoryBudgets) appState.categoryBudgets = {};
        appState.categoryBudgets[cat] = parseFloat(val);
        addAuditLog('🎯 Presupuesto', `Nuevo límite ${cat}: S/ ${val}`);
        saveState();
        renderAll();
        renderCategoryManagerList();
        showToast(`✅ Límite de ${cat} actualizado a S/ ${val}`, 'success');
      }
    }

    function deleteCategoryFromManager(cat) {
      if (cat === 'Otros') return alert('No puedes eliminar la categoría por defecto.');
      const confirmDelete = confirm(`¿Estás seguro de eliminar la categoría "${cat}"?\n\nSi tiene gastos asociados históricos, se mostrarán bajo "Otros".`);
      if (confirmDelete) {
        if (!appState.deletedCategories) appState.deletedCategories = [];
        if (!appState.deletedCategories.includes(cat)) {
          appState.deletedCategories.push(cat);
        }
        if (appState.customCategories && appState.customCategories[cat]) {
          delete appState.customCategories[cat];
        }
        addAuditLog('🗑️ Categoría', `Categoría eliminada: ${cat}`);
        saveState();
        updateDynamicCategories();
        renderAll();
        renderCategoryManagerList();
        showToast(`🗑️ Categoría "${cat}" eliminada`, 'info');
      }
    }

    // ================================================================
    // SIMULADOR DE CUOTAS Y CRÉDITO (GLASSMORPHISM)
    // ================================================================
    let simChartObj = null;
    let currentSimCuotas = 12;

    function openInstallmentsSimulatorModal() {
      // Poblar selector de categorías
      const catSelect = document.getElementById('simCategory');
      if (catSelect) {
        catSelect.innerHTML = Object.keys(CATEGORIES).map(c => 
          `<option value="${c}">${CATEGORIES[c].icon} ${c}</option>`
        ).join('');
      }

      // Poblar selector de meses de inicio
      const monthSelect = document.getElementById('simStartMonth');
      if (monthSelect) {
        const allMonths = getSortedMonths();
        let curIdx = allMonths.indexOf(appState.currentMonth);
        if (curIdx === -1) curIdx = 0;
        const futureMonths = allMonths.slice(curIdx);
        monthSelect.innerHTML = futureMonths.map(m => 
          `<option value="${m}" ${m === appState.currentMonth ? 'selected' : ''}>${m}</option>`
        ).join('');
      }

      openModalById('installmentsSimulatorModal');
      setTimeout(updateSimulation, 150);
    }

    function setSimCuotas(n, el) {
      currentSimCuotas = n;
      document.querySelectorAll('#simCuotasPills .glass-pill-opt').forEach(p => p.classList.remove('active'));
      if (el) el.classList.add('active');
      updateSimulation();
    }

    function toggleSimZeroInterest() {
      const isZero = document.getElementById('simZeroInterest').checked;
      const teaGroup = document.getElementById('simTeaGroup');
      if (teaGroup) {
        teaGroup.style.display = isZero ? 'none' : 'block';
      }
      updateSimulation();
    }

    function updateSimulation() {
      const amount = parseFloat(document.getElementById('simAmount').value) || 0;
      const cuotas = currentSimCuotas || 12;
      const startMonth = document.getElementById('simStartMonth').value || appState.currentMonth;
      const isZero = document.getElementById('simZeroInterest').checked;
      const teaInput = parseFloat(document.getElementById('simTea').value) || 0;
      
      let monthlyQuota = 0;
      let totalToPay = 0;

      if (isZero || teaInput === 0) {
        monthlyQuota = cuotas > 0 ? (amount / cuotas) : 0;
        totalToPay = amount;
      } else {
        // Tasa mensual efectiva = (1 + TEA)^(1/12) - 1
        const i = Math.pow(1 + (teaInput / 100), 1/12) - 1;
        monthlyQuota = (amount * (i * Math.pow(1 + i, cuotas))) / (Math.pow(1 + i, cuotas) - 1);
        totalToPay = monthlyQuota * cuotas;
      }

      const sym = getCurrencySymbol();
      document.getElementById('simMonthlyQuotaDisplay').textContent = `${sym} ${monthlyQuota.toFixed(2)}`;
      document.getElementById('simTotalToPayDisplay').textContent = `${sym} ${totalToPay.toFixed(2)}`;

      const totalIncome = getMonthTotalIncome() || 8800;
      const pctImpact = totalIncome > 0 ? ((monthlyQuota / totalIncome) * 100).toFixed(1) : 0;
      document.getElementById('simImpactDisplay').textContent = `-${pctImpact}% de tu ingreso mensual`;

      renderSimulationChart(startMonth, cuotas, monthlyQuota);
    }

    function renderSimulationChart(startMonth, cuotas, monthlyQuota) {
      const canvas = document.getElementById('simChartCanvas');
      if (!canvas) return;

      const allMonths = getSortedMonths();
      let startIdx = allMonths.indexOf(startMonth);
      if (startIdx === -1) startIdx = allMonths.indexOf(appState.currentMonth);
      if (startIdx === -1) startIdx = 0;

      const monthsToShow = allMonths.slice(startIdx, startIdx + 6);
      if (monthsToShow.length === 0) monthsToShow.push(startMonth);

      const labels = monthsToShow.map(m => m.replace(' 2026', ''));
      const currentBalances = [];
      const simulatedBalances = [];

      monthsToShow.forEach((m, idx) => {
        const monthIncome = (appState.incomes && appState.incomes[m]) 
          ? appState.incomes[m].reduce((sum, i) => sum + (i.amount || 0), 0)
          : (appState.salary || 8800);
        const monthTxs = appState.transactions[m] || [];
        const monthSpent = monthTxs.reduce((sum, t) => sum + (t.amount || 0), 0);
        const curBalance = Math.max(0, monthIncome - monthSpent);

        currentBalances.push(curBalance);
        const simDeduction = (idx < cuotas) ? monthlyQuota : 0;
        simulatedBalances.push(Math.max(0, curBalance - simDeduction));
      });

      if (simChartObj) {
        simChartObj.destroy();
      }

      const ctx = canvas.getContext('2d');
      simChartObj = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Saldo Actual',
              data: currentBalances,
              backgroundColor: '#3b82f6',
              borderRadius: 6
            },
            {
              label: 'Saldo Con Cuota',
              data: simulatedBalances,
              backgroundColor: '#06b6d4',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: '#94a3b8', font: { size: 10, weight: '700' } }
            },
            tooltip: {
              callbacks: {
                label: (c) => ` S/ ${c.parsed.y.toFixed(2)}`
              }
            }
          },
          scales: {
            x: {
              ticks: { color: '#94a3b8', font: { size: 10, weight: '700' } },
              grid: { display: false }
            },
            y: {
              ticks: { color: '#64748b', font: { size: 9 }, callback: (v) => 'S/' + v },
              grid: { color: 'rgba(255,255,255,0.06)' }
            }
          }
        }
      });
    }

    function applySimulatedPurchase() {
      const concept = document.getElementById('simConcept').value.trim();
      const amount = parseFloat(document.getElementById('simAmount').value) || 0;
      const category = document.getElementById('simCategory').value;
      const cuotas = currentSimCuotas || 12;
      const startMonth = document.getElementById('simStartMonth').value || appState.currentMonth;
      const dueDay = document.getElementById('simDueDay').value || '24';
      const isZero = document.getElementById('simZeroInterest').checked;
      const teaInput = parseFloat(document.getElementById('simTea').value) || 0;

      if (!concept) return alert('Por favor ingresa un concepto para la compra.');
      if (amount <= 0) return alert('Por favor ingresa un monto válido.');

      let monthlyQuota = 0;
      if (isZero || teaInput === 0) {
        monthlyQuota = amount / cuotas;
      } else {
        const i = Math.pow(1 + (teaInput / 100), 1/12) - 1;
        monthlyQuota = (amount * (i * Math.pow(1 + i, cuotas))) / (Math.pow(1 + i, cuotas) - 1);
      }

      const allMonths = getSortedMonths();
      let startIdx = allMonths.indexOf(startMonth);
      if (startIdx === -1) startIdx = allMonths.indexOf(appState.currentMonth);
      if (startIdx === -1) startIdx = 0;

      const targetMonths = allMonths.slice(startIdx, startIdx + cuotas);

      targetMonths.forEach((m, idx) => {
        if (!appState.transactions[m]) appState.transactions[m] = [];
        const cuotaActual = cuotas - idx;

        appState.transactions[m].push({
          id: m + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          name: `${concept}`,
          amount: parseFloat(monthlyQuota.toFixed(2)),
          category: category,
          status: 'Pendiente',
          dueDate: dueDay,
          isInstallment: true,
          installmentsTotal: cuotas,
          installmentsCurrent: cuotaActual
        });
      });

      addAuditLog('💳 Simulador Cuotas', `Compra '${concept}' añadida: ${cuotas} cuotas de S/ ${monthlyQuota.toFixed(2)} iniciando en ${startMonth}`);
      saveState();
      renderAll();
      closeGlassModal('installmentsSimulatorModal');
      showToast(`✅ Compra en ${cuotas} cuotas añadida al presupuesto con éxito`, 'success');
    }

    function handleSimulatedPurchaseClick() {
      if (!isUserPro()) {
        openFinZenProModal('Inyección Automática de Cuotas');
        return;
      }
      applySimulatedPurchase();
    }

    // ================================================================
    // BANK STATEMENT READER - Lector de Estados de Cuenta
    // ================================================================
    let currentStatementOwner = 'cesar';

    // ================================================================
    // ASISTENTE DE BIENVENIDA & TUTORIAL ONBOARDING (v55.0)
    // ================================================================
    let wizardCurrentStep = 1;

    function openOnboardingWizard(force = false) {
      wizardCurrentStep = 1;
      goToWizardStep(1);

      // Pre-cargar valores si existen en el estado
      const salaryInput = document.getElementById('wSalaryInput');
      if (salaryInput) {
        salaryInput.value = (appState.salary && appState.salary > 0) ? appState.salary : '';
      }

      const percentRange = document.getElementById('wSavingsPercentRange');
      if (percentRange) {
        percentRange.value = appState.targetSavingsPercent || 10;
        const disp = document.getElementById('wSavingsPercentVal');
        if (disp) disp.textContent = percentRange.value + '%';
      }

      // Pre-cargar o inicializar contenedor de gastos fijos si está vacío
      const fixedContainer = document.getElementById('wFixedExpensesContainer');
      if (fixedContainer && fixedContainer.children.length === 0) {
        addWizardExpenseRow('Alquiler / Hipoteca', 650, 'Vivienda', '30');
        addWizardExpenseRow('Servicios (Luz / Agua)', 120, 'Servicios', '15');
        addWizardExpenseRow('Internet Fibra', 60, 'Servicios', '28');
      }

      // Pre-cargar o inicializar tarjetas si está vacío
      const cardsContainer = document.getElementById('wCardsContainer');
      if (cardsContainer && cardsContainer.children.length === 0) {
        addWizardCardRow('Tarjeta Principal (BCP / BBVA / Interbank)', '15', '30');
      }

      closeModal('settingsModal');
      openModalById('onboardingWizardModal');
    }

    function goToWizardStep(step) {
      if (step < 1 || step > 4) return;
      wizardCurrentStep = step;

      const progressLine = document.getElementById('wizardProgressLine');
      if (progressLine) {
        const percentages = { 1: '0%', 2: '33%', 3: '66%', 4: '100%' };
        progressLine.style.width = percentages[step] || '0%';
      }

      for (let s = 1; s <= 4; s++) {
        const dot = document.getElementById(`wStepDot${s}`);
        const slide = document.getElementById(`wSlide${s}`);
        if (dot) {
          dot.classList.remove('active', 'completed');
          if (s === step) {
            dot.classList.add('active');
          } else if (s < step) {
            dot.classList.add('completed');
          }
        }
        if (slide) {
          if (s === step) {
            slide.classList.add('active');
          } else {
            slide.classList.remove('active');
          }
        }
      }

      // Actualizar botones de navegación en el pie fijo (Fixed Footer)
      const btnPrev = document.getElementById('wBtnPrev');
      const btnNext = document.getElementById('wBtnNext');
      if (btnPrev) {
        if (step === 1) {
          btnPrev.textContent = 'Saltar Tutorial';
          btnPrev.onclick = () => dismissOnboardingWizard(true);
        } else {
          btnPrev.textContent = `⬅️ Paso ${step - 1}`;
          btnPrev.onclick = () => goToWizardStep(step - 1);
        }
      }
      if (btnNext) {
        if (step === 4) {
          btnNext.textContent = '🎉 ¡Finalizar y Entrar a mi App! 🚀';
          btnNext.style.background = 'linear-gradient(135deg, #10b981, #059669)';
          btnNext.style.borderColor = '#10b981';
          btnNext.onclick = () => completeOnboardingWizard();
        } else {
          btnNext.textContent = `Continuar al Paso ${step + 1} ➔`;
          btnNext.style.background = '';
          btnNext.style.borderColor = '';
          btnNext.onclick = () => goToWizardStep(step + 1);
        }
      }

      // Desplazar el cuerpo hacia arriba suavemente al cambiar de paso
      const body = document.querySelector('.wizard-modal-body');
      if (body) body.scrollTop = 0;
    }

    function addWizardExpenseRow(name = '', amount = '', category = 'Otros', dueDate = '15') {
      const container = document.getElementById('wFixedExpensesContainer');
      if (!container) return;

      const currentRows = container.querySelectorAll('.wizard-dynamic-row').length;
      if (!isUserPro() && currentRows >= 11) {
        openFinZenProModal('Categorías y Gastos Ilimitados');
        showToast('⭐ Límite de 11 gastos alcanzado en la versión gratuita', 'warning');
        return;
      }

      const rowId = 'wExp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      const row = document.createElement('div');
      row.className = 'wizard-dynamic-row';
      row.id = rowId;

      let catOptions = '';
      Object.keys(CATEGORIES).forEach(cat => {
        const sel = cat === category ? 'selected' : '';
        catOptions += `<option value="${cat}" ${sel}>${cat}</option>`;
      });

      row.innerHTML = `
        <input type="text" class="form-control w-exp-name" placeholder="Concepto (ej. Luz)" value="${escapeHtml(name)}" style="font-size: 11px; padding: 6px 8px;" required>
        <select class="form-control w-exp-cat" style="font-size: 11px; padding: 6px 4px;">
          ${catOptions}
        </select>
        <input type="number" class="form-control w-exp-amount" placeholder="Monto S/" value="${amount}" step="any" style="font-size: 11px; padding: 6px 8px; font-weight: 700;">
        <div class="w-exp-due-wrap" style="display: flex; align-items: center; gap: 4px;">
          <span style="font-size: 10px; color: var(--text-muted); font-weight: 600;">Día:</span>
          <input type="number" class="form-control w-exp-due" min="1" max="31" placeholder="15" value="${dueDate}" style="width: 48px; font-size: 11px; padding: 6px 4px; text-align: center;" required title="Día de vencimiento del mes">
        </div>
        <button type="button" class="w-exp-del" onclick="document.getElementById('${rowId}').remove()" style="background: none; border: none; color: #ef4444; font-size: 16px; cursor: pointer; padding: 2px 6px;" title="Eliminar fila">✕</button>
      `;
      container.appendChild(row);
    }

    function quickAddWizardExpense(name, amount, category, dueDate) {
      const container = document.getElementById('wFixedExpensesContainer');
      const currentRows = container ? container.querySelectorAll('.wizard-dynamic-row').length : 0;
      if (!isUserPro() && currentRows >= 11) {
        openFinZenProModal('Categorías y Gastos Ilimitados');
        showToast('⭐ Límite de 11 gastos alcanzado en la versión gratuita', 'warning');
        return;
      }
      addWizardExpenseRow(name, amount, category, dueDate);
      showToast(`Añadido: ${name}`, 'info');
    }

    function addWizardCardRow(name = '', cutDay = '15', payDay = '30') {
      const container = document.getElementById('wCardsContainer');
      if (!container) return;

      const rowId = 'wCard_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      const row = document.createElement('div');
      row.className = 'wizard-dynamic-row';
      row.id = rowId;
      row.style.gridTemplateColumns = '2fr 1fr 1fr auto';

      row.innerHTML = `
        <input type="text" class="form-control w-card-name" placeholder="Tarjeta / Entidad (ej. Interbank)" value="${escapeHtml(name)}" style="font-size: 11px; padding: 6px 8px;" required>
        <div class="w-card-cut-wrap" style="display: flex; align-items: center; gap: 4px;">
          <span style="font-size: 10px; color: var(--text-muted); font-weight: 600;">Cierre:</span>
          <input type="number" class="form-control w-card-cut" min="1" max="31" placeholder="15" value="${cutDay}" style="font-size: 11px; padding: 6px 4px; text-align: center;" title="Día de corte de tarjeta">
        </div>
        <div class="w-card-pay-wrap" style="display: flex; align-items: center; gap: 4px;">
          <span style="font-size: 10px; color: var(--text-muted); font-weight: 600;">Pago:</span>
          <input type="number" class="form-control w-card-pay" min="1" max="31" placeholder="30" value="${payDay}" style="font-size: 11px; padding: 6px 4px; text-align: center;" title="Día límite de pago">
        </div>
        <button type="button" class="w-card-del" onclick="document.getElementById('${rowId}').remove()" style="background: none; border: none; color: #ef4444; font-size: 16px; cursor: pointer; padding: 2px 6px;" title="Eliminar tarjeta">✕</button>
      `;
      container.appendChild(row);
    }

    function completeOnboardingWizard() {
      // 1. Guardar Ingresos
      const salaryVal = parseFloat(document.getElementById('wSalaryInput')?.value);
      const payDay = document.getElementById('wPayDaySelect')?.value || '28';
      const payDayNum = parseInt(payDay) || 28;

      if (!isNaN(salaryVal) && salaryVal > 0) {
        appState.salary = salaryVal;
        if (!appState.incomes) appState.incomes = {};
        const curM = appState.currentMonth || getCurrentCalendarMonthName();
        if (!appState.incomes[curM]) appState.incomes[curM] = [];
        const existingSalary = appState.incomes[curM].find(i => i.id.startsWith('inc_sueldo_') || i.name.toLowerCase().includes('sueldo'));
        if (existingSalary) {
          existingSalary.amount = salaryVal;
          existingSalary.date = payDayNum;
        } else {
          appState.incomes[curM].unshift({
            id: 'inc_sueldo_' + curM,
            name: 'Sueldo Mensual',
            amount: salaryVal,
            status: 'Pendiente',
            date: payDayNum
          });
        }
      }
      const savingsPct = parseInt(document.getElementById('wSavingsPercentRange')?.value) || 10;
      appState.targetSavingsPercent = savingsPct;

      if (!appState.recurringDueDates) appState.recurringDueDates = {};
      appState.recurringDueDates['sueldo'] = payDay;

      // 2. Guardar Gastos Fijos (Lectura resiliente y soporte de hasta 11+ gastos)
      const curMonth = appState.currentMonth || getCurrentCalendarMonthName();
      if (!appState.transactions[curMonth]) appState.transactions[curMonth] = [];

      const expRows = document.querySelectorAll('#wFixedExpensesContainer .wizard-dynamic-row');
      const newTxs = [];
      expRows.forEach((row, idx) => {
        const nameInput = row.querySelector('.w-exp-name') || row.querySelector('input[type="text"]');
        const catSelect = row.querySelector('.w-exp-cat') || row.querySelector('select');
        const amtInput = row.querySelector('.w-exp-amount') || row.querySelectorAll('input[type="number"]')[0];
        const dueInput = row.querySelector('.w-exp-due') || row.querySelectorAll('input[type="number"]')[1];

        const name = nameInput ? nameInput.value.trim() : '';
        const cat = catSelect ? catSelect.value : 'Otros';
        let rawAmt = amtInput ? amtInput.value : '0';
        if (typeof rawAmt === 'string') rawAmt = rawAmt.replace(',', '.');
        const amt = parseFloat(rawAmt) || 0;
        const due = dueInput ? dueInput.value.trim() : '15';

        if (name) {
          const normKey = getNormalizedNameKey(name);
          appState.recurringDueDates[normKey] = due;

          // Si la categoría no existe en el sistema, registrarla para no perderla
          if (!CATEGORIES[cat] && cat !== 'Otros') {
            if (!appState.customCategories) appState.customCategories = {};
            appState.customCategories[cat] = {
              icon: '🏷️',
              badgeClass: 'badge-custom',
              color: '#38bdf8'
            };
          }

          newTxs.push({
            id: `${curMonth}_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
            name: name,
            amount: amt,
            category: cat,
            status: 'Pendiente',
            dueDate: due,
            isInstallment: false,
            installmentsTotal: 1,
            installmentsCurrent: 1
          });
        }
      });

      if (newTxs.length > 0) {
        appState.transactions[curMonth] = newTxs;
      }

      // 3. Guardar Tarjetas
      const cardRows = document.querySelectorAll('#wCardsContainer .wizard-dynamic-row');
      cardRows.forEach(row => {
        const cNameInput = row.querySelector('.w-card-name') || row.querySelector('input[type="text"]');
        const cName = cNameInput?.value.trim();
        const payDayInput = row.querySelector('.w-card-pay') || row.querySelectorAll('input[type="number"]')[1];
        const payDay = payDayInput?.value.trim() || '30';
        if (cName) {
          const normKey = getNormalizedNameKey(cName);
          appState.recurringDueDates[normKey] = payDay;
        }
      });

      // 4. Guardar Meta Inicial
      const goalName = document.getElementById('wGoalName')?.value.trim();
      const goalTarget = parseFloat(document.getElementById('wGoalTarget')?.value);
      const goalMonthly = parseFloat(document.getElementById('wGoalMonthly')?.value);
      const goalIcon = document.getElementById('wGoalIcon')?.value || '🛡️';

      if (goalName && !isNaN(goalTarget) && goalTarget > 0) {
        if (!appState.savingsGoals) appState.savingsGoals = [];
        const exists = appState.savingsGoals.some(g => g.name.toLowerCase() === goalName.toLowerCase());
        if (!exists) {
          appState.savingsGoals.push({
            id: 'goal_' + Date.now(),
            name: goalName,
            target: goalTarget,
            current: 0,
            monthlyContribution: !isNaN(goalMonthly) ? goalMonthly : 100,
            icon: goalIcon,
            createdAt: new Date().toISOString()
          });
        }
      }

      // Marcar onboarding como completado
      const userKey = currentUser ? currentUser.id : 'guest';
      localStorage.setItem('finanzas_setup_completed_' + userKey, 'true');

      // Guardar y refrescar
      addAuditLog('🧭 Onboarding', 'Configuración inicial completada mediante asistente');
      saveState();
      renderAll();

      // Cerrar wizard
      dismissOnboardingWizard(false);
      showToast('🎉 ¡Configuración inicial guardada! Bienvenido a AliviaFin.', 'success');

      // Marcar versión como vista para no saturar al usuario con el modal de novedades ahora
      localStorage.setItem('finanzas_last_seen_version', APP_VERSION);
      
      // Lanzar el tour interactivo en lugar del popup de novedades
      setTimeout(() => startInteractiveTour(), 1200);
    }

    function dismissOnboardingWizard(markSkipped = true) {
      closeModal('onboardingWizardModal');
      if (markSkipped) {
        const userKey = currentUser ? currentUser.id : 'guest';
        localStorage.setItem('finanzas_setup_completed_' + userKey, 'skipped');
        localStorage.setItem('finanzas_setup_completed', 'skipped');
        showToast('Asistente cerrado. Puedes reabrirlo en Ajustes ⚙️', 'info');
        
        // Si no ha marcado "No volver a mostrar tour", lanzar el tour interactivo
        const tourDismissed = localStorage.getItem('finanzas_tour_dismissed_' + userKey) === 'true'
                           || localStorage.getItem('finanzas_tour_dismissed') === 'true';
        if (!tourDismissed) {
          setTimeout(() => startInteractiveTour(), 800);
        }
      }
    }

    // ================================================================
    // NOVEDADES DE LA VERSIÓN (WHAT'S NEW)
    // ================================================================
    function syncVersionUI() {
      document.querySelectorAll('.login-version-tag').forEach(el => {
        el.textContent = 'AliviaFin ' + APP_VERSION + ' · Paz mental para tu dinero';
      });

      const settVer = document.getElementById('settingsVersion');
      if (settVer) settVer.textContent = APP_VERSION;

      const settBtn = document.getElementById('settingsWhatsNewBtn');
      if (settBtn) settBtn.textContent = '🚀 Novedades (' + APP_VERSION + ')';

      const wnBadge = document.getElementById('whatsNewVersionBadge');
      if (wnBadge) wnBadge.textContent = 'Versión ' + APP_VERSION;

      const wnSub = document.getElementById('whatsNewVersionSub');
      if (wnSub) wnSub.textContent = 'Actualización ' + APP_VERSION + ' · Nuevas Funcionalidades & Paz Mental';
    }

    function forceAppRefresh() {
      showToast('🔄 Actualizando a la última versión...', 'info');
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(regs => {
          for (let reg of regs) {
            reg.update();
            reg.unregister();
          }
        });
      }
      if ('caches' in window) {
        caches.keys().then(names => Promise.all(names.map(n => caches.delete(n)))).then(() => {
          setTimeout(() => {
            window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
          }, 350);
        });
      } else {
        setTimeout(() => {
          window.location.reload();
        }, 350);
      }
    }

    function openWhatsNewModal() {
      closeModal('settingsModal');
      syncVersionUI();
      openModalById('whatsNewModal');
      const userKey = currentUser ? currentUser.id : 'guest';
      localStorage.setItem('finanzas_last_seen_version_' + userKey, APP_VERSION);
      localStorage.setItem('finanzas_last_seen_version', APP_VERSION);
    }

    function dismissWhatsNewModal() {
      closeModal('whatsNewModal');
      const userKey = currentUser ? currentUser.id : 'guest';
      localStorage.setItem('finanzas_last_seen_version_' + userKey, APP_VERSION);
      localStorage.setItem('finanzas_last_seen_version', APP_VERSION);
    }

    // Comprobación automática de bienvenida, versión y anuncios
    function checkOnboardingAndVersionAnnouncements() {
      syncVersionUI();
      const userKey = currentUser ? currentUser.id : 'guest';
      const isCesar = isAdminCesar();
      const setupDone = localStorage.getItem('finanzas_setup_completed_' + userKey) || localStorage.getItem('finanzas_setup_completed');
      const seenVer = localStorage.getItem('finanzas_last_seen_version_' + userKey) || localStorage.getItem('finanzas_last_seen_version');

      // Si es el administrador César, nunca interrumpir con popups automáticos de wizard ni novedades
      if (isCesar) {
        localStorage.setItem('finanzas_setup_completed_' + userKey, 'true');
        localStorage.setItem('finanzas_setup_completed', 'true');
        localStorage.setItem('finanzas_last_seen_version_' + userKey, APP_VERSION);
        localStorage.setItem('finanzas_last_seen_version', APP_VERSION);
        return;
      } else {
        const hasData = (appState.salary && appState.salary > 0) || (appState.transactions && Object.keys(appState.transactions).some(m => appState.transactions[m].length > 0));
        
        if (!setupDone && !hasData && window._serverStateLoaded === true) {
          setTimeout(() => openOnboardingWizard(false), 500);
          return;
        } else if (hasData) {
          localStorage.setItem('finanzas_setup_completed_' + userKey, 'true');
          localStorage.setItem('finanzas_setup_completed', 'true');
        }
      }

      // Si el navegador ya tiene registrada alguna versión vista, NO molestar con popups automáticos en login/logout
      // El usuario puede consultar novedades cuando lo desee desde Ajustes > 🚀 Novedades
      if (seenVer) {
        localStorage.setItem('finanzas_last_seen_version_' + userKey, APP_VERSION);
        localStorage.setItem('finanzas_last_seen_version', APP_VERSION);
        return;
      }

      // Primera vez absoluta en este navegador
      localStorage.setItem('finanzas_last_seen_version_' + userKey, APP_VERSION);
      localStorage.setItem('finanzas_last_seen_version', APP_VERSION);
    }

    // ================================================================
    // MODALES DE SEGURIDAD & FEEDBACK (SOPORTE)
    // ================================================================
    function openSecurityModal() {
      closeModal('settingsModal');
      openModalById('securityModal');
    }

    function openLegalModal(initialTab = 'terms') {
      closeModal('settingsModal');
      switchLegalTab(initialTab);
      openModalById('legalModal');
    }

    function switchLegalTab(tab) {
      const termsSection = document.getElementById('legalSectionTerms');
      const privacySection = document.getElementById('legalSectionPrivacy');
      const refundsSection = document.getElementById('legalSectionRefunds');
      const providerSection = document.getElementById('legalSectionProvider');

      const btnTerms = document.getElementById('btnTabLegalTerms');
      const btnPrivacy = document.getElementById('btnTabLegalPrivacy');
      const btnRefunds = document.getElementById('btnTabLegalRefunds');
      const btnProvider = document.getElementById('btnTabLegalProvider');

      const tabs = [
        { id: 'terms', el: termsSection, btn: btnTerms },
        { id: 'privacy', el: privacySection, btn: btnPrivacy },
        { id: 'refunds', el: refundsSection, btn: btnRefunds },
        { id: 'provider', el: providerSection, btn: btnProvider }
      ];

      tabs.forEach(t => {
        if (t.el) t.el.style.display = (t.id === tab) ? 'block' : 'none';
        if (t.btn) {
          if (t.id === tab) t.btn.classList.add('active');
          else t.btn.classList.remove('active');
        }
      });
    }

    // ================================================================
    // LIBRO DE RECLAMACIONES VIRTUAL (LEY N° 29571 / D.S. 011-2011-PCM)
    // ================================================================
    let lastReclamacionVoucherData = null;

    function openReclamacionesModal() {
      closeModal('settingsModal');
      closeModal('legalModal');
      if (typeof closeGlassModal === 'function') closeGlassModal('finzenProModal');

      const form = document.getElementById('reclamacionForm');
      const voucher = document.getElementById('reclamacionVoucher');
      if (form) {
        form.style.display = 'block';
        form.reset();
        handleTipoReclamoChange('reclamo');

        // Pre-llenar datos del usuario si está en sesión
        if (currentUser && currentUser.email) {
          const emailInput = document.getElementById('recEmail');
          if (emailInput && !emailInput.value) emailInput.value = currentUser.email;
        }
        if (currentUser && currentUser.user_metadata) {
          const nameInput = document.getElementById('recNombre');
          const metaName = currentUser.user_metadata.full_name || currentUser.user_metadata.name;
          if (nameInput && metaName && !nameInput.value) nameInput.value = metaName;
        }
      }
      if (voucher) voucher.style.display = 'none';

      openModalById('reclamacionesModal');
    }

    function handleTipoReclamoChange(tipo) {
      const lblReclamo = document.getElementById('lblTipoReclamo');
      const lblQueja = document.getElementById('lblTipoQueja');
      if (tipo === 'queja') {
        if (lblQueja) {
          lblQueja.style.borderColor = '#2563eb';
          lblQueja.style.background = '#eff6ff';
        }
        if (lblReclamo) {
          lblReclamo.style.borderColor = '#cbd5e1';
          lblReclamo.style.background = '#ffffff';
        }
      } else {
        if (lblReclamo) {
          lblReclamo.style.borderColor = '#2563eb';
          lblReclamo.style.background = '#eff6ff';
        }
        if (lblQueja) {
          lblQueja.style.borderColor = '#cbd5e1';
          lblQueja.style.background = '#ffffff';
        }
      }
    }

    async function handleReclamacionSubmit(e) {
      if (e) e.preventDefault();
      const submitBtn = document.getElementById('btnSubmitReclamo');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      const nombre = (document.getElementById('recNombre')?.value || '').trim();
      const tipoDoc = document.getElementById('recTipoDoc')?.value || 'DNI';
      const numDoc = (document.getElementById('recNumDoc')?.value || '').trim();
      const email = (document.getElementById('recEmail')?.value || '').trim();
      const telefono = (document.getElementById('recTelefono')?.value || '').trim();
      const servicio = document.getElementById('recServicio')?.value || 'AliviaFin PRO';
      const monto = parseFloat(document.getElementById('recMonto')?.value || '0') || 0;
      
      const tipoRadio = document.querySelector('input[name="recTipo"]:checked');
      const tipo = tipoRadio ? tipoRadio.value : 'reclamo';
      
      const detalle = (document.getElementById('recDetalle')?.value || '').trim();
      const pedido = (document.getElementById('recPedido')?.value || '').trim();

      const year = new Date().getFullYear();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const codigo = `ALV-REC-${year}-${randomSuffix}`;
      const nowIso = new Date().toISOString();
      const formattedDate = new Date().toLocaleString('es-PE', { dateStyle: 'long', timeStyle: 'short' });

      const payload = {
        codigo,
        consumidor_nombre: nombre,
        consumidor_tipo_doc: tipoDoc,
        consumidor_num_doc: numDoc,
        consumidor_email: email,
        consumidor_telefono: telefono,
        tipo_servicio: servicio,
        monto_reclamado: monto,
        tipo,
        detalle,
        pedido,
        estado: 'pendiente',
        created_at: nowIso
      };

      // 1. Guardar en Supabase (tabla app_reclamaciones con fallback resiliente a app_feedback)
      try {
        if (supabaseClient) {
          const { error: recErr } = await supabaseClient
            .from('app_reclamaciones')
            .insert([payload]);

          if (recErr) {
            console.warn('Nota: app_reclamaciones aún no migrada, guardando en telemetría app_feedback:', recErr.message);
            await supabaseClient.from('app_feedback').insert([{
              user_id: currentUser ? currentUser.id : null,
              user_email: email,
              type: 'libro_reclamaciones',
              message: `[${codigo}] ${tipo.toUpperCase()}: ${detalle} | Pedido: ${pedido}`,
              metadata: payload,
              created_at: nowIso
            }]);
          }
        }
      } catch (err) {
        console.warn('Error enviando reclamación a cloud:', err);
      }

      // 2. Respaldo local inmutable de seguridad
      try {
        const localList = JSON.parse(localStorage.getItem('finanzas_reclamaciones_backup') || '[]');
        localList.push(payload);
        localStorage.setItem('finanzas_reclamaciones_backup', JSON.stringify(localList));
      } catch (e) {}

      // 3. Mostrar Voucher en pantalla
      lastReclamacionVoucherData = { ...payload, formattedDate };
      const form = document.getElementById('reclamacionForm');
      const voucher = document.getElementById('reclamacionVoucher');

      const elCod = document.getElementById('voucherCodigo');
      const elFec = document.getElementById('voucherFecha');
      const elCon = document.getElementById('voucherConsumidor');
      const elEma = document.getElementById('voucherEmail');
      const elTip = document.getElementById('voucherTipo');

      if (elCod) elCod.textContent = codigo;
      if (elFec) elFec.textContent = formattedDate;
      if (elCon) elCon.textContent = `${nombre} (${tipoDoc}: ${numDoc})`;
      if (elEma) elEma.textContent = email;
      if (elTip) elTip.textContent = tipo.toUpperCase() + ' — ' + servicio;

      if (form) form.style.display = 'none';
      if (voucher) voucher.style.display = 'block';

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '📝 Enviar Reclamación';
      }

      showToast('✅ Reclamación registrada: ' + codigo, 'success');
    }

    function copyReclamacionVoucher() {
      if (!lastReclamacionVoucherData) return;
      const d = lastReclamacionVoucherData;
      const text = `📖 HOJA DE RECLAMACIÓN VIRTUAL — ALIVIAFIN (D.S. 011-2011-PCM)
Código de seguimiento: ${d.codigo}
Fecha de registro: ${d.formattedDate}
Consumidor: ${d.consumidor_nombre} (${d.consumidor_tipo_doc}: ${d.consumidor_num_doc})
Email: ${d.consumidor_email} | Tel: ${d.consumidor_telefono}
Servicio: ${d.tipo_servicio} (Monto: S/ ${d.monto_reclamado})
Tipo: ${d.tipo.toUpperCase()}
Detalle: ${d.detalle}
Pedido concreto: ${d.pedido}
Plazo de respuesta legal: Máximo quince (15) días hábiles improrrogables.`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast('📋 Constancia copiada al portapapeles', 'info');
        }).catch(() => {
          showToast('Código: ' + d.codigo, 'info');
        });
      } else {
        showToast('Código: ' + d.codigo, 'info');
      }
    }

    function openFeedbackModal() {
      closeModal('settingsModal');
      const msgEl = document.getElementById('feedbackMessage');
      if (msgEl) msgEl.value = '';
      openModalById('feedbackModal');
      setTimeout(() => {
        if (msgEl) msgEl.focus();
      }, 200);
    }

    async function submitAppFeedback() {
      const typeEl = document.getElementById('feedbackType');
      const msgEl = document.getElementById('feedbackMessage');
      const submitBtn = document.getElementById('feedbackSubmitBtn');
      
      const type = typeEl ? typeEl.value : 'bug';
      const message = msgEl ? msgEl.value.trim() : '';

      if (!message) {
        showToast('⚠️ Por favor describe el detalle de tu mensaje', 'warning');
        if (msgEl) msgEl.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Enviando...';
      }

      const payload = {
        user_id: currentUser ? currentUser.id : 'guest',
        user_email: currentUser ? (currentUser.email || 'anonimo') : 'anonimo',
        type: type,
        message: message,
        app_version: APP_VERSION,
        created_at: new Date().toISOString()
      };

      try {
        const { error } = await supabaseClient
          .from('app_feedback')
          .insert([payload]);

        if (error) {
          console.warn('Feedback notice (Supabase):', error);
          // Fallback en localStorage para resguardo
          try {
            const localFeedbacks = JSON.parse(localStorage.getItem('finanzas_pending_feedbacks') || '[]');
            localFeedbacks.push(payload);
            localStorage.setItem('finanzas_pending_feedbacks', JSON.stringify(localFeedbacks));
          } catch(storageErr) {}
        }

        showToast('✅ ¡Reporte enviado con éxito! Gracias por tu aporte.', 'success');
        if (msgEl) msgEl.value = '';
        closeModal('feedbackModal');
      } catch (err) {
        console.error('Error enviando feedback:', err);
        showToast('✅ ¡Reporte recibido correctamente!', 'success');
        if (msgEl) msgEl.value = '';
        closeModal('feedbackModal');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '🚀 Enviar Reporte';
        }
      }
    }

    // ================================================================
    // TOUR INTERACTIVO COMPLETO (ONBOARDING GUIADO & AUTO-NAVEGACIÓN)
    // ================================================================
    window.handleTourCheckboxChange = function(isChecked) {
      const userKey = currentUser ? currentUser.id : 'guest';
      if (isChecked) {
        localStorage.setItem('finanzas_tour_dismissed_' + userKey, 'true');
        localStorage.setItem('finanzas_tour_dismissed', 'true');
      } else {
        localStorage.removeItem('finanzas_tour_dismissed_' + userKey);
        localStorage.removeItem('finanzas_tour_dismissed');
      }
    };

    function startInteractiveTour() {
      closeAllModals();
      if (!window.driver || !window.driver.js || !window.driver.js.driver) {
        console.warn("Driver.js no cargado");
        return;
      }

      // Asegurar que empezamos en el tab de Inicio
      if (typeof switchTab === 'function') {
        switchTab('inicio');
      }

      const userKey = currentUser ? currentUser.id : 'guest';
      const isDismissed = localStorage.getItem('finanzas_tour_dismissed_' + userKey) === 'true'
                       || localStorage.getItem('finanzas_tour_dismissed') === 'true';

      const isDesk = window.innerWidth >= 1024;
      const getTarget = (mobileSel, deskSel) => {
        if (window.innerWidth >= 1024 && deskSel && document.querySelector(deskSel)) {
          return deskSel;
        }
        return mobileSel;
      };

      const driverObj = window.driver.js.driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        doneBtnText: '¡Comenzar a Usar! 🚀',
        nextBtnText: 'Siguiente →',
        prevBtnText: '← Atrás',
        progressText: '{{current}} de {{total}}',
        showButtons: ['next', 'previous', 'close'],
        onCloseClick: () => {
          localStorage.setItem('finanzas_tour_dismissed_' + userKey, 'true');
          localStorage.setItem('finanzas_tour_dismissed', 'true');
          if (typeof switchTab === 'function') {
            switchTab('inicio');
          }
          driverObj.destroy();
        },
        onHighlightStarted: (element, step) => {
          if (step && step.tabToSwitch && typeof switchTab === 'function') {
            switchTab(step.tabToSwitch);
          }
        },
        onDestroyStarted: () => {
          localStorage.setItem('finanzas_tour_dismissed_' + userKey, 'true');
          localStorage.setItem('finanzas_tour_dismissed', 'true');
          if (typeof switchTab === 'function') {
            switchTab('inicio');
          }
          driverObj.destroy();
        },
        onDestroyed: () => {
          if (typeof switchTab === 'function') {
            switchTab('inicio');
          }
        },
        steps: [
          // 1. Bienvenida
          {
            tabToSwitch: 'inicio',
            popover: {
              title: '🎉 ¡Bienvenido a AliviaFin!',
              description: `
                <div style="font-size: 13px; line-height: 1.5; color: #334155;">
                  <p style="margin: 0 0 10px 0;">Recorreremos juntos en menos de 1 minuto lo esencial para dominar tus finanzas con paz mental:</p>
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; font-size: 12px; color: #475569; display: flex; flex-direction: column; gap: 6px;">
                    <div>💵 <b>Configurar sueldo y presupuestos</b></div>
                    <div>🔴 <b>Registrar gastos e ingresos extra</b></div>
                    <div>💳 <b>Simulador de compras en cuotas</b></div>
                    <div>💬 <b>Ayuda y soporte directo en 1 clic</b></div>
                    <div>📊 <b>Navegar por tus secciones clave</b></div>
                  </div>
                </div>
              `
            }
          },
          // 2. Stat Cards Métricas
          {
            element: '.stats-grid',
            tabToSwitch: 'inicio',
            popover: {
              title: '💵 Tus Métricas Clave',
              description: 'Tu termómetro financiero instantáneo: consulta en tiempo real tu <b>Ingreso Mensual</b> total, tu <b>Gasto Real</b> acumulado y tu <b>Saldo en Banco</b> disponible para terminar el mes en verde.',
              side: 'bottom',
              align: 'start'
            }
          },
          // 3. Registrar Gasto
          {
            element: '#btnRegistrarGasto',
            tabToSwitch: 'inicio',
            popover: {
              title: '🔴 Cómo Registrar un Gasto',
              description: 'Toca este botón cada vez que realices una compra o pago. Elige la categoría, monto, fecha de vencimiento y define si es al contado o en cuotas con tarjeta de crédito.',
              side: 'bottom',
              align: 'start'
            }
          },
          // 4. Registrar Ingreso Extra
          {
            element: '#btnRegistrarIngreso',
            tabToSwitch: 'inicio',
            popover: {
              title: '🟢 Cómo Registrar Ingresos Extra',
              description: '¿Cobraste un bono, utilidades o trabajo freelance? Regístralo aquí con un toque para que se sume de inmediato a tu saldo en banco real.',
              side: 'bottom',
              align: 'center'
            }
          },
          // 5. Simulador de Cuotas & Crédito
          {
            element: '#btnQuickSimulador',
            tabToSwitch: 'inicio',
            popover: {
              title: '💳 Simulador de Cuotas & Crédito',
              description: '¿Planeas una compra a plazos? Simúlala aquí antes de pasar la tarjeta para ver tu cuota mensual con o sin intereses y su impacto en tu presupuesto.',
              side: 'bottom',
              align: 'start'
            }
          },
          // 6. Centro de Ayuda & Feedback
          {
            element: '#btnQuickHelp',
            tabToSwitch: 'inicio',
            popover: {
              title: '💬 ¿Dudas o Sugerencias? Soporte Directo',
              description: 'Estamos para ayudarte. Toca aquí en cualquier momento para enviarnos dudas, sugerencias o reportar cualquier detalle directamente al equipo en 1 clic.',
              side: 'bottom',
              align: 'center'
            }
          },
          // 7. Configurar Sueldo y Gastos Mensuales
          {
            element: getTarget('#btnSettings', '#deskNavTabSettings'),
            tabToSwitch: 'inicio',
            popover: {
              title: '⚙️ Configurar Sueldo y Gastos Mensuales',
              description: 'Desde este botón de Ajustes puedes cambiar tu sueldo en <b>"✏️ Editar mi Sueldo Inicial"</b>, ajustar presupuestos de gastos fijos en <b>"⚙️ Gestor de Categorías"</b>, o relanzar el asistente completo en <b>"🔧 Reconfigurar Ingresos y Gastos"</b>.',
              side: 'bottom',
              align: 'center'
            }
          },
          // 10. Tab Movimientos (Auto-navega a Movimientos)
          {
            element: getTarget('#navTabMovimientos', '#deskNavTabMovimientos'),
            tabToSwitch: 'movimientos',
            popover: {
              title: '💳 Pestaña: Movimientos',
              description: '<i>¡Navegamos a Movimientos!</i> Aquí tienes tu lista completa de gastos e ingresos, con buscador instantáneo, ordenación y control de estados.',
              side: isDesk ? 'right' : 'top',
              align: 'center'
            }
          },
          // 11. Tab Plan (Auto-navega a Plan)
          {
            element: getTarget('#navTabPlan', '#deskNavTabPlan'),
            tabToSwitch: 'plan',
            popover: {
              title: '📊 Pestaña: Plan Financiero',
              description: '<i>¡Llegamos a tu Plan!</i> Aquí tienes tu distribución inteligente <b>50/30/20</b> (Necesidades, Deseos, Ahorro), gráficos comparativos de gastos y el rastreador de tus compras en cuotas.',
              side: isDesk ? 'right' : 'top',
              align: 'center'
            }
          },
          // 12. Tab Metas (Auto-navega a Metas)
          {
            element: getTarget('#navTabMetas', '#deskNavTabMetas'),
            tabToSwitch: 'metas',
            popover: {
              title: '🎯 Pestaña: Metas de Ahorro',
              description: '<i>¡Ahora estamos en Metas!</i> Establece objetivos como tu Fondo de Emergencia, viajes o compras grandes. AliviaFin calcula cuánto dinero debes apartar cada mes para lograrlas.',
              side: isDesk ? 'right' : 'top',
              align: 'center'
            }
          },
          // 13. Tab Consejos (Auto-navega a Consejos)
          {
            element: getTarget('#navTabConsejos', '#deskNavTabConsejos'),
            tabToSwitch: 'consejos',
            popover: {
              title: '💡 Pestaña: Consejos & Asesor',
              description: '<i>¡Aquí está tu Asesor!</i> Diagnóstico inteligente automático de tu presupuesto mensual y el método <b>Bola de Nieve</b> para liquidar deudas rápidamente.',
              side: isDesk ? 'right' : 'top',
              align: 'center'
            }
          },
          // 14. Cierre y Opción No Volver a Mostrar (Vuelve a Inicio)
          {
            element: getTarget('#navTabInicio', '#deskNavTabInicio'),
            tabToSwitch: 'inicio',
            popover: {
              title: '🚀 ¡Todo Listo para Dominar tus Finanzas!',
              description: `
                <div style="font-size: 13px; line-height: 1.5; color: #334155;">
                  <p style="margin: 0 0 10px 0;">Regresamos a tu pantalla de Inicio. Recuerda que siempre puedes volver a consultar este tour guiado desde <b>⚙️ Ajustes</b>.</p>
                  <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid #e2e8f0; text-align: left;">
                    <label style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #475569; cursor: pointer; font-weight: 600;">
                      <input type="checkbox" id="tourDontShowAgain" onchange="window.handleTourCheckboxChange(this.checked)" ${isDismissed ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: #0d9488; cursor: pointer;">
                      <span>No volver a mostrar este tour al iniciar</span>
                    </label>
                  </div>
                </div>
              `,
              side: isDesk ? 'right' : 'top',
              align: 'center',
              onNextClick: () => {
                const userKey = currentUser ? currentUser.id : 'guest';
                const chk = document.getElementById('tourDontShowAgain');
                if (chk && chk.checked) {
                  localStorage.setItem('finanzas_tour_dismissed_' + userKey, 'true');
                  localStorage.setItem('finanzas_tour_dismissed', 'true');
                }
                if (typeof switchTab === 'function') {
                  switchTab('inicio');
                }
                driverObj.destroy();
              }
            }
          }
        ]
      });

      window.currentAliviaFinTour = driverObj;
      window.currentFinZenTour = driverObj;
      driverObj.drive();
    }

    window.closeTour = function() {
      const userKey = currentUser ? currentUser.id : 'guest';
      localStorage.setItem('finanzas_tour_dismissed_' + userKey, 'true');
      localStorage.setItem('finanzas_tour_dismissed', 'true');
      if (typeof switchTab === 'function') {
        switchTab('inicio');
      }
    };

    // ================================================================
    // CENTRO ESTRATÉGICO BOLA DE NIEVE & ASESOR FINANCIERO (MOCKUP 1)
    // ================================================================
    let currentSnowballDebts = [];
    let currentDebtStrategy = 'snowball'; // 'snowball' o 'avalanche'
    let currentDebtExtraPayment = 0; // Por defecto 0 (sin amortización adicional)

    function initDebtCommandCenterState() {
      if (appState && appState.debtSnowball && Array.isArray(appState.debtSnowball.debts) && appState.debtSnowball.debts.length > 0) {
        currentSnowballDebts = JSON.parse(JSON.stringify(appState.debtSnowball.debts));
        if (appState.debtSnowball.extraPayment !== undefined && appState.debtSnowball.extraPayment !== null) {
          currentDebtExtraPayment = Math.max(0, parseFloat(appState.debtSnowball.extraPayment) || 0);
        }
        if (appState.debtSnowball.strategy) {
          currentDebtStrategy = appState.debtSnowball.strategy;
        }
      } else {
        const saved = localStorage.getItem('aliviafin_debt_snowball') || localStorage.getItem('finzen_debt_snowball');
        if (saved) {
          try {
            const p = JSON.parse(saved);
            if (p.debts && p.debts.length > 0) currentSnowballDebts = p.debts;
            if (p.extraPayment !== undefined && p.extraPayment !== null) {
              currentDebtExtraPayment = Math.max(0, parseFloat(p.extraPayment) || 0);
            }
            if (p.strategy) currentDebtStrategy = p.strategy;
          } catch(e) {}
        }
      }
      // Sincronizar en vivo los valores actualizados de cuotas y saldos desde Movimientos
      if (currentSnowballDebts && currentSnowballDebts.length > 0) {
        const curTxs = getMonthTxList();

        // PURGA DE RAÍZ CUALQUIER MOVIMIENTO QUE NO ESTÉ EXPLÍCITAMENTE EN CUOTAS (isInstallment === true)
        currentSnowballDebts = currentSnowballDebts.filter(d => {
          const dKey = getNormalizedNameKey(d.name);
          const matchedTx = curTxs.find(t => {
            const tKey = getNormalizedNameKey(t.name);
            return tKey === dKey || tKey.replace(/\s+/g, '') === dKey.replace(/\s+/g, '');
          });
          if (matchedTx) {
            // Si la transacción en Movimientos existe y el usuario NO la marcó en cuotas: ELIMINAR INMEDIATAMENTE
            if (!matchedTx.isInstallment) {
              return false;
            }
          }
          return true;
        });

        currentSnowballDebts.forEach(d => {
          const dKey = getNormalizedNameKey(d.name);
          const matchedTx = curTxs.find(t => {
            const tKey = getNormalizedNameKey(t.name);
            return tKey === dKey || tKey.replace(/\s+/g, '') === dKey.replace(/\s+/g, '');
          });
          if (matchedTx && matchedTx.isInstallment) {
            d.installmentsTotal = matchedTx.installmentsTotal || d.installmentsTotal || 12;
            d.installmentsCurrent = matchedTx.installmentsCurrent || d.installmentsCurrent || 1;
            d.remainingInstallments = (typeof matchedTx.remainingInstallments === 'number') ? matchedTx.remainingInstallments : Math.max(1, d.installmentsTotal - d.installmentsCurrent + 1);
            d.minPayment = Math.max(1, parseFloat(matchedTx.amount) || d.minPayment || 60);
            d.balance = Math.round(d.remainingInstallments * d.minPayment);
            if (typeof matchedTx.tea === 'number') d.tea = matchedTx.tea;
          }
        });
        saveDebtSnowballPlanQuiet();
      }

      // Si aún no hay deudas cargadas, sincronizar automáticamente desde el mes actual
      if (!currentSnowballDebts || currentSnowballDebts.length === 0) {
        autoSyncDebtsSilently();
      }
    }

    function autoSyncDebtsSilently() {
      const txs = getMonthTxList();

      const candidates = txs.filter(t => {
        // REGLA ESTRICTA DE ORO: Solo entran compras que el usuario marcó EXPLÍCITAMENTE en cuotas (isInstallment: true).
        // NUNCA incluir movimientos por categoría (Tarjetas/Préstamos) si no tienen isInstallment: true activo.
        return t.isInstallment === true;
      });

      const synced = [];
      candidates.forEach((c, idx) => {
        let total = c.installmentsTotal || 1;
        let current = c.installmentsCurrent || 1;
        let remaining = null;

        const nameMatch = (c.name || '').match(/(?:cuota\s+)?(\d+)\s+de\s+(\d+)/i);
        if (nameMatch) {
          current = parseInt(nameMatch[1], 10) || current;
          total = parseInt(nameMatch[2], 10) || total;
        }

        // Casos conocidos específicos
        if (/cusco/i.test(c.name)) {
          total = 6;
          current = 6; // En Octubre 2026 es la última cuota (1 cuota pendiente)
          remaining = (c.status === 'Pagado') ? 0 : 1;
        }
        if (/junta/i.test(c.name)) {
          total = 2;
          current = 2;
          remaining = (c.status === 'Pagado') ? 0 : 1;
        }
        if (/macbook/i.test(c.name)) {
          total = 24;
          current = 21;
          remaining = (c.status === 'Pagado') ? 3 : 4;
        }
        if (/mami/i.test(c.name)) {
          total = 12;
          current = (c.installmentsCurrent && c.installmentsCurrent <= 3) ? c.installmentsCurrent : 3;
          remaining = 10;
        }

        if (remaining === null) {
          if (typeof c.remainingInstallments === 'number' && c.remainingInstallments > 0) {
            remaining = (c.status === 'Pagado') ? Math.max(0, c.remainingInstallments - 1) : c.remainingInstallments;
          } else {
            remaining = (c.status === 'Pagado') 
              ? Math.max(0, total - current) 
              : Math.max(1, total - current + 1);
          }
        }

        if (remaining <= 0) return; // Ya terminó de pagarse

        const isLoan = /diners|préstamo|prestamo|revolving/i.test(c.name);
        const tea = (typeof c.tea === 'number') ? c.tea : (isLoan ? 28.5 : 0.0);
        const bal = Math.round((parseFloat(c.amount) || 0) * remaining);
        const minP = Math.round(parseFloat(c.amount) || 0);

        current = Math.min(total, Math.max(1, total - remaining + 1));

        synced.push({
          id: 'd_sync_' + idx + '_' + Math.random().toString(36).substr(2, 4),
          name: c.name,
          balance: bal,
          minPayment: minP,
          tea: tea,
          initialBalance: Math.round(minP * total),
          remainingInstallments: remaining,
          installmentsTotal: total,
          installmentsCurrent: current
        });
      });

      if (synced.length > 0) {
        currentSnowballDebts = synced;
      }
    }

    function renderDebtCommandCenter() {
      initDebtCommandCenterState();
      
      const slider = document.getElementById('snowballExtraSlider');
      if (slider) slider.value = currentDebtExtraPayment;

      const displayBig = document.getElementById('debtExtraDisplayBig');
      if (displayBig) {
        displayBig.textContent = currentDebtExtraPayment > 0 
          ? `+ ${getCurrencySymbol()} ${currentDebtExtraPayment.toFixed(0)} / mes` 
          : `+ ${getCurrencySymbol()} 0 / mes`;
      }

      const labelEl = document.getElementById('snowballSliderAmountLabel');
      if (labelEl) {
        labelEl.textContent = currentDebtExtraPayment > 0 
          ? `+ ${getCurrencySymbol()} ${currentDebtExtraPayment.toFixed(0)} extra` 
          : `S/ 0 extra`;
      }

      const btnSnow = document.getElementById('stratPillSnowball');
      const btnAv = document.getElementById('stratPillAvalanche');
      if (btnSnow) btnSnow.classList.toggle('active', currentDebtStrategy === 'snowball');
      if (btnAv) btnAv.classList.toggle('active', currentDebtStrategy === 'avalanche');

      const titleEl = document.getElementById('debtTableTitle');
      if (titleEl) {
        titleEl.textContent = `Compras en Cuotas y Compromisos (Orden: ${currentDebtStrategy === 'snowball' ? 'Bola de Nieve' : 'Avalancha'})`;
      }

      calculateAndRenderDebtPlan(currentDebtExtraPayment);
      renderExecutiveAdvisor();
    }
    window.renderDebtCommandCenter = renderDebtCommandCenter;

    function setDebtStrategy(strat) {
      currentDebtStrategy = strat;
      const btnSnow = document.getElementById('stratPillSnowball');
      const btnAv = document.getElementById('stratPillAvalanche');
      if (btnSnow) btnSnow.classList.toggle('active', strat === 'snowball');
      if (btnAv) btnAv.classList.toggle('active', strat === 'avalanche');

      const titleEl = document.getElementById('debtTableTitle');
      if (titleEl) {
        titleEl.textContent = `Compras en Cuotas y Compromisos (Orden: ${strat === 'snowball' ? 'Bola de Nieve' : 'Avalancha'})`;
      }

      saveDebtSnowballPlanQuiet();
      calculateAndRenderDebtPlan(currentDebtExtraPayment);
      renderExecutiveAdvisor();
    }
    window.setDebtStrategy = setDebtStrategy;

    function onSnowballSliderChange(val) {
      const extra = Math.max(0, parseFloat(val) || 0);
      currentDebtExtraPayment = extra;

      const displayBig = document.getElementById('debtExtraDisplayBig');
      if (displayBig) {
        displayBig.textContent = extra > 0 
          ? `+ ${getCurrencySymbol()} ${extra.toFixed(0)} / mes` 
          : `+ ${getCurrencySymbol()} 0 / mes`;
      }

      const labelEl = document.getElementById('snowballSliderAmountLabel');
      if (labelEl) {
        labelEl.textContent = extra > 0 
          ? `+ ${getCurrencySymbol()} ${extra.toFixed(0)} extra` 
          : `S/ 0 extra`;
      }

      saveDebtSnowballPlanQuiet();
      calculateAndRenderDebtPlan(extra);
      renderExecutiveAdvisor();
    }
    window.onSnowballSliderChange = onSnowballSliderChange;

    let debtSearchTerm = '';

    function onDebtSearchInput(val) {
      debtSearchTerm = (val || '').toLowerCase().trim();
      const clearBtn = document.getElementById('debtSearchClearBtn');
      if (clearBtn) clearBtn.style.display = debtSearchTerm ? 'block' : 'none';
      calculateAndRenderDebtPlan(currentDebtExtraPayment);
    }
    window.onDebtSearchInput = onDebtSearchInput;

    function clearDebtSearch() {
      debtSearchTerm = '';
      const input = document.getElementById('debtSearchInput');
      if (input) input.value = '';
      const clearBtn = document.getElementById('debtSearchClearBtn');
      if (clearBtn) clearBtn.style.display = 'none';
      calculateAndRenderDebtPlan(currentDebtExtraPayment);
    }
    window.clearDebtSearch = clearDebtSearch;

    function calculateAndRenderDebtPlan(extraPayment) {
      if (extraPayment !== undefined && extraPayment !== null) {
        currentDebtExtraPayment = Math.max(0, parseFloat(extraPayment) || 0);
      }
      const extra = currentDebtExtraPayment;

      const targetDateEl = document.getElementById('debtFreedomTargetDate');
      const speedBadgeEl = document.getElementById('debtSpeedBadge');
      const speedSubtitleEl = document.getElementById('debtSpeedSubtitle');
      const progressBarFillEl = document.getElementById('debtProgressBarFill');
      const progressTextEl = document.getElementById('debtProgressText');
      const progressRemEl = document.getElementById('debtProgressRemaining');
      const startDateLabelEl = document.getElementById('debtStartDateLabel');
      const zeroDateLabelEl = document.getElementById('debtZeroDateLabel');
      const totalMonthlyAttackEl = document.getElementById('debtTotalMonthlyAttack');
      const totalInterestSavedEl = document.getElementById('debtTotalInterestSaved');
      const tableContainerEl = document.getElementById('debtTacticalTableContainer');

      // PURGA ACTIVA DE SEGURIDAD: Asegurar que NINGÚN movimiento que NO esté en cuotas permanezca aquí
      if (currentSnowballDebts && currentSnowballDebts.length > 0) {
        const curTxs = getMonthTxList();
        const initialLen = currentSnowballDebts.length;
        currentSnowballDebts = currentSnowballDebts.filter(d => {
          const dKey = getNormalizedNameKey(d.name);
          const matchedTx = curTxs.find(t => {
            const tKey = getNormalizedNameKey(t.name);
            return tKey === dKey || tKey.replace(/\s+/g, '') === dKey.replace(/\s+/g, '');
          });
          if (matchedTx && !matchedTx.isInstallment) {
            return false;
          }
          return true;
        });
        if (currentSnowballDebts.length !== initialLen) {
          saveDebtSnowballPlanQuiet();
        }
      }

      if (!currentSnowballDebts || currentSnowballDebts.length === 0) {
        if (targetDateEl) targetDateEl.textContent = '¡Sin cuotas activas!';
        if (speedBadgeEl) speedBadgeEl.textContent = 'Libre de Cuotas';
        if (speedSubtitleEl) speedSubtitleEl.textContent = 'No tienes compromisos en cuotas pendientes';
        if (progressBarFillEl) progressBarFillEl.style.width = '100%';
        if (progressTextEl) progressTextEl.textContent = '100% LIBRE';
        if (progressRemEl) progressRemEl.textContent = '0%';
        if (totalMonthlyAttackEl) totalMonthlyAttackEl.textContent = 'Total mensual: S/ 0.00';
        if (totalInterestSavedEl) totalInterestSavedEl.textContent = `${getCurrencySymbol()} 0 ahorrados`;
        if (tableContainerEl) {
          tableContainerEl.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); font-size: 13px; padding: 24px;">
              🎉 No tienes compras en cuotas ni compromisos registrados. Haz clic en "🔄 Sincronizar Cuotas del Mes" para cargar tus cuotas activas.
            </div>
          `;
        }
        return;
      }

      currentSnowballDebts.forEach((d, i) => {
        if (!d.id) d.id = 'd_' + i;
        if (d.tea === undefined) d.tea = 0.0;
        if (!d.initialBalance) d.initialBalance = d.balance || (d.minPayment * 6);
      });

      const sumMin = currentSnowballDebts.reduce((acc, d) => acc + (parseFloat(d.minPayment) || 0), 0);
      const totalMonthlyPayment = sumMin + extra;
      
      if (totalMonthlyAttackEl) {
        totalMonthlyAttackEl.textContent = extra > 0
          ? `Total mensual: ${getCurrencySymbol()} ${totalMonthlyPayment.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Mínimos: ${getCurrencySymbol()} ${sumMin.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
          : `Total mensual: ${getCurrencySymbol()} ${sumMin.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Solo cuotas mínimas regulares)`;
      }

      let sortedDebts = currentSnowballDebts.map((d, origIdx) => {
        let minP = Math.max(1, parseFloat(d.minPayment) || 0);
        let rem = d.remainingInstallments;
        let bal = Math.max(0, parseFloat(d.balance) || 0);

        if (rem && rem > 0) {
          const expectedBal = Math.round(rem * minP);
          if (bal === 0 || Math.abs(bal - expectedBal) > 2) {
            bal = expectedBal;
            d.balance = bal;
          }
        }

        return {
          ...d,
          originalIdx: origIdx,
          balance: bal,
          minPayment: minP,
          tea: Math.max(0, parseFloat(d.tea) || 0)
        };
      });

      if (currentDebtStrategy === 'snowball') {
        sortedDebts.sort((a, b) => a.balance - b.balance);
      } else {
        sortedDebts.sort((a, b) => b.tea - a.tea);
      }

      // Simulación 1: Con Acelerador Extra
      let workingDebts = sortedDebts.map(d => ({
        ...d,
        currBalance: d.balance,
        paidMonth: 0,
        allocatedPayment: d.minPayment,
        interestPaid: 0
      }));

      let snowballPot = extra;
      let month = 0;
      const maxMonths = 180;

      while (workingDebts.some(d => d.currBalance > 0) && month < maxMonths) {
        month++;
        let potAvailable = snowballPot;

        for (let i = 0; i < workingDebts.length; i++) {
          const d = workingDebts[i];
          if (d.currBalance <= 0) continue;

          // Si TEA es 0 (cuotas sin intereses), no acumular interés
          if (d.tea > 0.1) {
            const monthlyRate = (d.tea / 100) / 12;
            const interest = d.currBalance * monthlyRate;
            d.interestPaid += interest;
            d.currBalance += interest;
          }

          let pmt = d.minPayment;
          const isTarget = (i === workingDebts.findIndex(x => x.currBalance > 0));
          if (isTarget) {
            pmt += potAvailable;
            d.allocatedPayment = pmt;
            potAvailable = 0;
          }

          d.currBalance -= pmt;

          if (d.currBalance <= 0) {
            d.currBalance = 0;
            if (d.paidMonth === 0) d.paidMonth = month;
            snowballPot += d.minPayment;
          }
        }
      }

      // Simulación 2: Baseline (Solo Mínimos regulares, sin abono extra)
      let baselineMonths = 0;
      let baselineTotalInterest = 0;
      let baselineDebts = sortedDebts.map(d => ({
        currBalance: d.balance,
        minPayment: d.minPayment,
        tea: d.tea
      }));

      while (baselineDebts.some(d => d.currBalance > 0) && baselineMonths < maxMonths) {
        baselineMonths++;
        for (let i = 0; i < baselineDebts.length; i++) {
          const d = baselineDebts[i];
          if (d.currBalance <= 0) continue;
          if (d.tea > 0.1) {
            const monthlyRate = (d.tea / 100) / 12;
            const interest = d.currBalance * monthlyRate;
            baselineTotalInterest += interest;
            d.currBalance += interest;
          }
          d.currBalance -= d.minPayment;
          if (d.currBalance < 0) d.currBalance = 0;
        }
      }

      const simulatedTotalInterest = workingDebts.reduce((sum, d) => sum + d.interestPaid, 0);
      const totalInterestSaved = extra > 0 ? Math.max(0, baselineTotalInterest - simulatedTotalInterest) : 0;

      const totalInitial = currentSnowballDebts.reduce((s, d) => s + (d.initialBalance || d.balance), 0);
      const totalCurrent = currentSnowballDebts.reduce((s, d) => s + (parseFloat(d.balance) || 0), 0);
      const paidPct = totalInitial > 0 ? Math.min(100, Math.max(0, Math.round(((totalInitial - totalCurrent) / totalInitial) * 100))) : 0;

      const monthsNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const now = new Date();
      
      const maxNaturalMonths = Math.max(...sortedDebts.map(d => {
        return (typeof d.remainingInstallments === 'number' && d.remainingInstallments > 0)
          ? d.remainingInstallments
          : Math.max(1, Math.ceil(d.balance / d.minPayment));
      }));

      const effectiveBaselineMonths = Math.max(baselineMonths, maxNaturalMonths);
      const effectiveMonths = extra > 0 ? Math.min(month, effectiveBaselineMonths) : effectiveBaselineMonths;
      const futureDate = new Date(now.getFullYear(), now.getMonth() + effectiveMonths, 1);
      const targetDateStr = `${monthsNames[futureDate.getMonth()]} ${futureDate.getFullYear()}`;

      const baseFutureDate = new Date(now.getFullYear(), now.getMonth() + effectiveBaselineMonths, 1);
      const baseDateStr = `${monthsNames[baseFutureDate.getMonth()]} ${baseFutureDate.getFullYear()}`;

      if (targetDateEl) targetDateEl.textContent = targetDateStr;
      
      if (speedBadgeEl) {
        if (extra > 0 && effectiveBaselineMonths > effectiveMonths) {
          const monthsGained = effectiveBaselineMonths - effectiveMonths;
          speedBadgeEl.textContent = `¡Adelantas ${monthsGained} mes${monthsGained > 1 ? 'es' : ''}!`;
          speedBadgeEl.style.background = 'linear-gradient(135deg, #10b981, #059669)';
          speedBadgeEl.style.color = '#ffffff';
        } else {
          speedBadgeEl.textContent = 'Ritmo Regular';
          speedBadgeEl.style.background = 'rgba(0,0,0,0.06)';
          speedBadgeEl.style.color = 'var(--text-main)';
        }
      }

      if (speedSubtitleEl) {
        if (extra > 0 && effectiveBaselineMonths > effectiveMonths) {
          speedSubtitleEl.textContent = `Sin abono extra terminarías en ${baseDateStr}`;
        } else {
          speedSubtitleEl.textContent = 'Al ritmo actual de cuotas normales';
        }
      }

      if (progressBarFillEl) progressBarFillEl.style.width = `${paidPct}%`;
      if (progressTextEl) progressTextEl.textContent = `${paidPct}% PAGADO`;
      if (progressRemEl) progressRemEl.textContent = `Resta S/ ${Math.round(totalCurrent).toLocaleString()}`;
      if (startDateLabelEl) startDateLabelEl.textContent = `Inicio: ${monthsNames[now.getMonth()].slice(0,3)} ${now.getFullYear()}`;
      if (zeroDateLabelEl) zeroDateLabelEl.textContent = `0 Deudas: ${targetDateStr}`;
      
      if (totalInterestSavedEl) {
        totalInterestSavedEl.textContent = extra > 0 
          ? `${getCurrencySymbol()} ${Math.round(totalInterestSaved).toLocaleString('es-PE')} ahorrados`
          : `${getCurrencySymbol()} 0 ahorrados`;
      }

      if (tableContainerEl) {
        let displayedDebts = [...workingDebts];
        if (debtSearchTerm) {
          displayedDebts = displayedDebts.filter(d => (d.name || '').toLowerCase().includes(debtSearchTerm));
        }

        const countLabel = document.getElementById('debtSearchCountLabel');
        if (countLabel) {
          countLabel.textContent = debtSearchTerm
            ? `Mostrando ${displayedDebts.length} de ${workingDebts.length} compromisos`
            : `${workingDebts.length} compromisos en cuotas`;
        }

        let tableHtml = `
          <table class="debt-table">
            <thead>
              <tr>
                <th style="width: 32px;">#</th>
                <th>COMPRA EN CUOTAS / COMPROMISO</th>
                <th>SALDO PENDIENTE</th>
                <th>TASA (TEA)</th>
                <th>CUOTA MENSUAL</th>
                <th>ESTADO</th>
                <th>PAGO FINAL</th>
                <th>TIEMPO RESTANTE</th>
                <th style="width: 60px; text-align: center;">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
        `;

        if (displayedDebts.length === 0) {
          tableHtml += `
            <tr>
              <td colspan="9" style="text-align: center; color: var(--text-muted); font-size: 13px; padding: 28px;">
                🔍 No se encontraron compromisos que coincidan con "<strong>${escapeHtml(debtSearchTerm)}</strong>".
              </td>
            </tr>
          `;
        } else {
          displayedDebts.forEach((d, idx) => {
            const isTarget = (idx === 0 && !debtSearchTerm);

            // CÁLCULO EXACTO DEL TIEMPO RESTANTE POR DEUDA:
            // 1. Duración natural según sus cuotas pendientes registradas o saldo / cuota mensual
            const remInstallments = (typeof d.remainingInstallments === 'number' && d.remainingInstallments > 0)
              ? d.remainingInstallments
              : Math.max(1, Math.ceil(d.balance / d.minPayment));

            // 2. Si hay abono extra del acelerador Y es la deuda objetivo en ataque:
            let debtMonths = remInstallments;
            if (extra > 0 && isTarget) {
              debtMonths = Math.max(1, Math.min(remInstallments, Math.ceil(d.balance / (d.minPayment + extra))));
            }

            // 3. Normalización estricta de cuotas para evitar "Cuota 10 de 6":
            const totInst = d.installmentsTotal || (remInstallments > 6 ? 12 : 6);
            const currInst = Math.min(totInst, Math.max(1, totInst - remInstallments + 1));
            d.installmentsTotal = totInst;
            d.installmentsCurrent = currInst;
            d.remainingInstallments = remInstallments;

            const debtFinalDate = new Date(now.getFullYear(), now.getMonth() + debtMonths, 1);
            const debtFinalStr = `${monthsNames[debtFinalDate.getMonth()].slice(0, 3)} ${debtFinalDate.getFullYear()}`;

            const statusBadge = isTarget
              ? `<span class="badge-status-attack" title="Objetivo prioritario: Recibe todo tu superávit para liquidarse al 100% lo antes posible">EN ATAQUE ⚡</span>`
              : `<span class="badge-status-pending" title="Pago regular: Cubres su cuota mínima mensual programada mientras la #1 está en ataque">Pendiente</span>`;

            const timeBadge = debtMonths === 1
              ? `<span class="badge-time-remaining" style="color: #059669; font-weight: 800; border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.1);">1 mes restante (¡Última cuota!)</span>`
              : `<span class="badge-time-remaining">${debtMonths} meses restantes</span>`;

            tableHtml += `
              <tr class="debt-table-row">
                <td style="font-weight: 800; color: var(--text-muted);">${idx + 1}.</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 16px;">💳</span>
                    <div>
                      <strong style="color: var(--text-main);">${escapeHtml(d.name)}</strong>
                      <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">Cuota ${currInst} de ${totInst} <span style="color: #6366f1; font-weight: 700;">(${remInstallments} ${remInstallments === 1 ? 'pendiente' : 'pendientes'})</span></div>
                    </div>
                  </div>
                </td>
                <td style="font-weight: 800; color: var(--text-main);">
                  ${getCurrencySymbol()} ${d.balance.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td style="font-weight: 700; color: ${d.tea > 0 ? '#6366f1' : '#10b981'};">
                  ${d.tea > 0 ? d.tea.toFixed(1) + '%' : '0.0% (Sin interés)'}
                </td>
                <td style="font-weight: 700; color: var(--text-secondary);">
                  ${getCurrencySymbol()} ${d.minPayment.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td>${statusBadge}</td>
                <td style="font-weight: 700; color: var(--text-main);">${debtFinalStr}</td>
                <td>${timeBadge}</td>
                <td style="text-align: center;">
                  <button type="button" onclick="editSnowballDebtRow(${d.originalIdx})" class="debt-row-action-btn" title="Editar saldo o cuota">✏️</button>
                  <button type="button" onclick="removeSnowballDebtRow(${d.originalIdx})" class="debt-row-action-btn" style="color: #ef4444;" title="Eliminar compromiso">✕</button>
                </td>
              </tr>
            `;
          });
        }

        tableHtml += `</tbody></table>`;
        tableContainerEl.innerHTML = tableHtml;
      }
    }
    window.calculateAndRenderDebtPlan = calculateAndRenderDebtPlan;

    function syncEditDebtFields(source) {
      const totalEl = document.getElementById('editDebtInstallmentsTotal');
      const currEl = document.getElementById('editDebtInstallmentsCurrent');
      const remEl = document.getElementById('editDebtInstallmentsRemaining');
      const minEl = document.getElementById('editDebtMinPayment');
      const balEl = document.getElementById('editDebtBalance');
      const hintEl = document.getElementById('editDebtSummaryHint');
      if (!totalEl || !currEl || !remEl) return;

      let total = parseInt(totalEl.value, 10);
      if (isNaN(total) || total < 1) total = 1;

      let current = parseInt(currEl.value, 10);
      if (isNaN(current) || current < 1) current = 1;

      let remaining = parseInt(remEl.value, 10);
      if (isNaN(remaining) || remaining < 1) remaining = 1;

      if (source === 'remaining') {
        if (remaining > total) total = remaining;
        totalEl.value = total;
        current = Math.max(1, total - remaining + 1);
        currEl.value = current;
      } else if (source === 'current') {
        if (current > total) total = current;
        totalEl.value = total;
        remaining = Math.max(1, total - current + 1);
        remEl.value = remaining;
      } else {
        // source === 'total' or 'minPayment'
        if (current > total) current = total;
        currEl.value = current;
        remaining = Math.max(1, total - current + 1);
        remEl.value = remaining;
      }

      const minP = Math.max(0, parseFloat(minEl?.value) || 0);
      const calculatedBalance = Math.round(remaining * minP * 100) / 100;
      if (balEl && (source !== 'balance')) {
        balEl.value = calculatedBalance;
      }

      if (hintEl) {
        hintEl.innerHTML = `💡 Pagando <b>Cuota ${current} de ${total}</b> • Faltan <b>${remaining} cuotas</b> por pagar (Saldo pendiente: <b>${getCurrencySymbol()} ${calculatedBalance.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>)`;
      }
    }
    window.syncEditDebtFields = syncEditDebtFields;

    function editSnowballDebtRow(idx) {
      if (idx < 0 || idx >= currentSnowballDebts.length) return;
      const d = currentSnowballDebts[idx];

      const origIdxEl = document.getElementById('editDebtOrigIdx');
      const titleEl = document.getElementById('editDebtModalTitle');
      const iconEl = document.getElementById('editDebtModalIcon');
      const submitBtn = document.getElementById('editDebtSubmitBtn');
      const nameEl = document.getElementById('editDebtName');
      const totEl = document.getElementById('editDebtInstallmentsTotal');
      const curEl = document.getElementById('editDebtInstallmentsCurrent');
      const remEl = document.getElementById('editDebtInstallmentsRemaining');
      const minEl = document.getElementById('editDebtMinPayment');
      const balEl = document.getElementById('editDebtBalance');
      const teaEl = document.getElementById('editDebtTea');

      if (!origIdxEl || !nameEl) return;

      origIdxEl.value = idx;
      if (titleEl) titleEl.textContent = 'Editar Compra en Cuotas / Compromiso';
      if (iconEl) iconEl.textContent = '✏️';
      if (submitBtn) submitBtn.textContent = 'Guardar Cambios';

      nameEl.value = d.name || '';

      const total = d.installmentsTotal || 12;
      let current = d.installmentsCurrent || 1;
      let remaining = d.remainingInstallments || Math.max(1, total - current + 1);
      const minP = Math.max(1, parseFloat(d.minPayment) || 60);
      let bal = Math.max(0, parseFloat(d.balance) || (remaining * minP));
      if (bal === 0 || Math.abs(bal - (remaining * minP)) > 2) {
        bal = Math.round(remaining * minP);
      }
      const tea = (typeof d.tea === 'number') ? d.tea : 0;

      if (totEl) totEl.value = total;
      if (curEl) curEl.value = current;
      if (remEl) remEl.value = remaining;
      if (minEl) minEl.value = minP;
      if (balEl) balEl.value = bal;
      if (teaEl) teaEl.value = tea;

      syncEditDebtFields('remaining');
      openModalById('editDebtModal');
    }
    window.editSnowballDebtRow = editSnowballDebtRow;

    function handleSaveDebtFromModal(e) {
      e.preventDefault();
      const origIdxVal = document.getElementById('editDebtOrigIdx')?.value;
      const origIdx = parseInt(origIdxVal, 10);
      if (isNaN(origIdx)) return;

      const name = (document.getElementById('editDebtName')?.value || '').trim();
      if (!name) {
        showToast('Por favor ingresa un nombre para el compromiso', 'warning');
        return;
      }

      const total = parseInt(document.getElementById('editDebtInstallmentsTotal')?.value, 10) || 1;
      const current = parseInt(document.getElementById('editDebtInstallmentsCurrent')?.value, 10) || 1;
      const remaining = parseInt(document.getElementById('editDebtInstallmentsRemaining')?.value, 10) || 1;
      const minP = Math.max(1, parseFloat(document.getElementById('editDebtMinPayment')?.value) || 1);
      const bal = Math.max(0, parseFloat(document.getElementById('editDebtBalance')?.value) || (remaining * minP));
      const tea = Math.max(0, parseFloat(document.getElementById('editDebtTea')?.value) || 0);

      const curMonth = appState.currentMonth || getCurrentCalendarMonthName();
      if (!appState.transactions) appState.transactions = {};
      if (!appState.transactions[curMonth]) appState.transactions[curMonth] = [];
      const curTxs = appState.transactions[curMonth];

      if (origIdx === -1) {
        // MODO CREAR NUEVA COMPRA EN CUOTAS / COMPROMISO
        const newDebt = {
          id: 'd_user_' + Date.now(),
          name: name,
          balance: bal,
          tea: tea,
          minPayment: minP,
          initialBalance: Math.round(minP * total),
          remainingInstallments: remaining,
          installmentsTotal: total,
          installmentsCurrent: current
        };
        currentSnowballDebts.push(newDebt);

        const newNormKey = getNormalizedNameKey(name);
        let tx = curTxs.find(t => getNormalizedNameKey(t.name) === newNormKey);
        if (!tx) {
          tx = {
            id: 'tx_' + Date.now(),
            name: name,
            amount: minP,
            category: 'Tarjetas',
            type: 'expense',
            status: 'Pendiente',
            isInstallment: true,
            installmentsTotal: total,
            installmentsCurrent: current,
            remainingInstallments: remaining,
            tea: tea,
            date: new Date().toISOString().split('T')[0]
          };
          curTxs.push(tx);
        } else {
          tx.isInstallment = true;
          tx.installmentsTotal = total;
          tx.installmentsCurrent = current;
          tx.remainingInstallments = remaining;
          tx.amount = minP;
          tx.tea = tea;
        }

        saveState();
        saveDebtSnowballPlanQuiet();
        closeModal('editDebtModal');
        calculateAndRenderDebtPlan(currentDebtExtraPayment);
        renderExecutiveAdvisor();
        if (typeof renderAll === 'function') renderAll();
        showToast('✨ Compromiso en cuotas añadido exitosamente', 'success');
        return;
      }

      if (origIdx < 0 || origIdx >= currentSnowballDebts.length) return;
      const d = currentSnowballDebts[origIdx];
      const oldName = d.name;

      d.name = name;
      d.installmentsTotal = total;
      d.installmentsCurrent = current;
      d.remainingInstallments = remaining;
      d.minPayment = minP;
      d.balance = bal;
      d.initialBalance = Math.round(minP * total);
      d.tea = tea;

      // Sincronizar automáticamente con el gasto correspondiente en Movimientos
      const oldNormKey = getNormalizedNameKey(oldName);
      const newNormKey = getNormalizedNameKey(name);

      const tx = curTxs.find(t => getNormalizedNameKey(t.name) === oldNormKey || getNormalizedNameKey(t.name) === newNormKey);
      if (tx) {
        tx.name = name;
        tx.amount = minP;
        tx.isInstallment = true;
        tx.installmentsTotal = total;
        tx.installmentsCurrent = current;
        tx.remainingInstallments = remaining;
        tx.tea = tea;
        saveState();
      }

      saveDebtSnowballPlanQuiet();
      closeModal('editDebtModal');
      calculateAndRenderDebtPlan(currentDebtExtraPayment);
      renderExecutiveAdvisor();
      if (typeof renderAll === 'function') renderAll();
      showToast('✅ Compromiso en cuotas actualizado exitosamente', 'success');
    }
    window.handleSaveDebtFromModal = handleSaveDebtFromModal;

    function renderExecutiveAdvisor() {
      const container = document.getElementById('executiveTipsGrid');
      const autoDiagEl = document.getElementById('autoDiagnosisText');
      if (!container) return;

      const totalIncome = getMonthTotalIncome();
      const txs = getMonthTxList();
      const totalSpent = txs.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
      const surplus = Math.max(0, totalIncome - totalSpent);
      const extra = currentDebtExtraPayment || 0;

      const debts = currentSnowballDebts || [];
      const totalDebtPayments = debts.reduce((s, d) => s + (parseFloat(d.minPayment) || 0), 0);
      const debtRatio = totalIncome > 0 ? Math.round((totalDebtPayments / totalIncome) * 100) : 0;

      // Detección de Pagos Pendientes del mes anterior (ej: Septiembre 2026)
      const prevKey = getPreviousMonthKey(appState.currentMonth || 'Octubre 2026');
      const prevKeyAlt = prevKey.replace('Septiembre', 'Setiembre');
      const prevTxs = (appState.transactions && (appState.transactions[prevKey] || appState.transactions[prevKeyAlt])) || [];
      const prevPending = prevTxs.filter(t => t.status === 'Pendiente');
      const prevPendingTotal = prevPending.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);

      // DIAGNÓSTICO INTELIGENTE REAL Y CONTEXTUAL
      if (autoDiagEl) {
        if (prevPending.length > 0) {
          autoDiagEl.innerHTML = `⚠️ <strong>Flujo Comprometido por Pagos Atrasados:</strong> Tienes <strong>${prevPending.length} pagos pendientes</strong> de ${prevKey} por un total de <strong>${getCurrencySymbol()} ${prevPendingTotal.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>. Tu prioridad financiera inmediata debe ser regularizar estos compromisos arrastrados antes de programar abonos extra o proyectar ahorros libres, evitando intereses moratorios.`;
        } else if (debtRatio > 30) {
          autoDiagEl.innerHTML = `⚠️ <strong>Carga de Deuda Elevada (${debtRatio}% de tus ingresos):</strong> Estás destinando <strong>${getCurrencySymbol()} ${totalDebtPayments.toLocaleString()} mensuales</strong> a tarjetas, préstamos y compras en cuotas. Recomendamos usar el método Bola de Nieve para liquidar de inmediato la cuota más próxima a vencer y liberar flujo.`;
        } else if (totalSpent > totalIncome) {
          autoDiagEl.innerHTML = `🚨 <strong>Presupuesto Excedido:</strong> Tus gastos programados (<strong>${getCurrencySymbol()} ${totalSpent.toLocaleString()}</strong>) superan tus ingresos (<strong>${getCurrencySymbol()} ${totalIncome.toLocaleString()}</strong>). Congela consumos prescindibles para no acumular pasivos.`;
        } else {
          autoDiagEl.innerHTML = `💡 <strong>Situación Operativa Estable:</strong> Tus compromisos del mes están cubiertos por tus ingresos. Cuentas con un margen disponible en papel de <strong>${getCurrencySymbol()} ${surplus.toLocaleString()}</strong>. Mantén el foco en no generar nuevas compras a plazos.`;
        }
      }

      // Identificar deudas tácticas
      const quickestDebt = [...debts].filter(d => d.balance > 0).sort((a, b) => a.balance - b.balance)[0];
      const highestTeaDebt = [...debts].filter(d => d.balance > 0).sort((a, b) => (b.tea || 0) - (a.tea || 0))[0];

      // GASTOS FIJOS DE VIDA (No deudas)
      const fixedLivingTxs = txs.filter(t => ['Casa', 'Comida casa', 'Comida gatitos casa', 'Arena gatitos casa', 'Servicios', 'Internet', 'Celulares', 'Mapfre', 'Papá'].includes(t.category));
      const fixedLivingTotal = fixedLivingTxs.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);

      const cards = [
        {
          icon: prevPending.length > 0 ? '🚨' : '🛡️',
          title: prevPending.length > 0 ? `Pagos Pendientes de ${prevKey}` : 'Liquidez Operativa del Mes',
          text: prevPending.length > 0
            ? `Tienes <strong>${prevPending.length} cuentas por saldar (S/ ${prevPendingTotal.toFixed(2)})</strong> arrastradas de ${prevKey}. Revisa el mes anterior y marca los recibos ya cubiertos o prioriza saldar las obligaciones de tarjetas primero.`
            : `Ingresos netos de ${appState.currentMonth || 'este mes'}: <strong>S/ ${totalIncome.toLocaleString()}</strong>. Gastos fijos obligatorios de vida: <strong>S/ ${fixedLivingTotal.toLocaleString()}</strong>. Tu margen neto es de <strong>S/ ${surplus.toLocaleString()}</strong>.`
        },
        {
          icon: '🎯',
          title: quickestDebt ? `Próxima Victoria: Liquidar ${escapeHtml(quickestDebt.name)}` : 'Plan de Salida Bola de Nieve',
          text: quickestDebt 
            ? `¡Estás muy cerca de extinguir <strong>${escapeHtml(quickestDebt.name)}</strong> (Saldo restante: <strong>S/ ${quickestDebt.balance}</strong>)! Al terminarla, liberarás de inmediato <strong>S/ ${quickestDebt.minPayment}/mes</strong> de tu presupuesto mensual para atacar la siguiente deuda.`
            : 'Sincroniza tus compromisos desde cuotas para identificar tu primer objetivo de ataque.'
        },
        {
          icon: '⚡',
          title: highestTeaDebt && highestTeaDebt.tea > 0 ? `Compromiso Crítico: ${escapeHtml(highestTeaDebt.name)}` : 'Optimización de Costo Financiero',
          text: highestTeaDebt && highestTeaDebt.tea > 0
            ? `Representa tu obligación más costosa con una tasa de <strong>${highestTeaDebt.tea}% TEA</strong> y cuota de <strong>S/ ${highestTeaDebt.minPayment}/mes</strong>. Cualquier abono extra a este pasivo te ahorrará intereses significativos a largo plazo.`
            : `Tus cuotas activas actuales operan a <strong>0% TEA (sin intereses adicionales)</strong>. Paga rigurosamente tus cuotas a tiempo para evitar recargos moratorios.`
        },
        {
          icon: '📊',
          title: `Carga de Endeudamiento vs Regla 20%`,
          text: `Tus cuotas y tarjetas absorben el <strong>${debtRatio}% de tus ingresos mensuales</strong> (S/ ${totalDebtPayments.toLocaleString()}/mes). El estándar financiero saludable recomienda mantener este porcentaje en un máximo del <strong>20%</strong>.`
        }
      ];

      container.innerHTML = cards.map(c => `
        <div class="executive-tip-card">
          <div class="executive-tip-icon">${c.icon}</div>
          <div class="executive-tip-content">
            <div class="executive-tip-title">${c.title}</div>
            <p class="executive-tip-text">${c.text}</p>
          </div>
        </div>
      `).join('');
    }
    window.renderExecutiveAdvisor = renderExecutiveAdvisor;

    function syncDebtsFromCuotas() {
      const txs = getMonthTxList();

      const candidates = txs.filter(t => {
        // REGLA ESTRICTA DE ORO: Solo compras marcadas EXPLÍCITAMENTE en cuotas (isInstallment: true)
        return t.isInstallment === true;
      });

      if (candidates.length === 0) {
        showToast('No se encontraron compras en cuotas activas este mes', 'info');
        return;
      }

      const freshDebts = [];
      candidates.forEach((c, idx) => {
        let total = c.installmentsTotal || 1;
        let current = c.installmentsCurrent || 1;
        let remaining = null;

        const nameMatch = (c.name || '').match(/(?:cuota\s+)?(\d+)\s+de\s+(\d+)/i);
        if (nameMatch) {
          current = parseInt(nameMatch[1], 10) || current;
          total = parseInt(nameMatch[2], 10) || total;
        }

        if (/cusco/i.test(c.name)) {
          total = 6;
          current = 6; // En Octubre 2026 es la última cuota (1 cuota pendiente)
          remaining = (c.status === 'Pagado') ? 0 : 1;
        }
        if (/junta/i.test(c.name)) {
          total = 2;
          current = 2; // Cuota 2 de 2 (Final)
          remaining = (c.status === 'Pagado') ? 0 : 1;
        }
        if (/macbook/i.test(c.name)) {
          total = 24;
          current = 21; // Cuota 21 de 24 (quedan 4 cuotas)
          remaining = (c.status === 'Pagado') ? 3 : 4;
        }
        if (/mami/i.test(c.name)) {
          total = 12;
          current = (c.installmentsCurrent && c.installmentsCurrent <= 3) ? c.installmentsCurrent : 3;
          remaining = 10;
        }

        if (remaining === null) {
          if (typeof c.remainingInstallments === 'number' && c.remainingInstallments > 0) {
            remaining = (c.status === 'Pagado') ? Math.max(0, c.remainingInstallments - 1) : c.remainingInstallments;
          } else {
            remaining = (c.status === 'Pagado') 
              ? Math.max(0, total - current) 
              : Math.max(1, total - current + 1);
          }
        }

        if (remaining <= 0) return; // Si ya fue pagada la última cuota, no está pendiente

        const isLoan = /diners|préstamo|prestamo|revolving/i.test(c.name);
        const tea = (typeof c.tea === 'number') ? c.tea : (isLoan ? 28.5 : 0.0);
        const bal = Math.round((parseFloat(c.amount) || 0) * remaining);
        const minP = Math.round(parseFloat(c.amount) || 0);

        current = Math.min(total, Math.max(1, total - remaining + 1));

        freshDebts.push({
          id: 'd_sync_' + idx + '_' + Math.random().toString(36).substr(2, 4),
          name: c.name,
          balance: bal,
          minPayment: minP,
          tea: tea,
          initialBalance: Math.round(minP * total),
          remainingInstallments: remaining,
          installmentsTotal: total,
          installmentsCurrent: current
        });
      });

      currentSnowballDebts = freshDebts;
      saveDebtSnowballPlanQuiet();
      calculateAndRenderDebtPlan(currentDebtExtraPayment);
      renderExecutiveAdvisor();
      showToast(`🔄 Se sincronizaron ${freshDebts.length} compromisos en cuotas activos con éxito`, 'success');
    }
    window.syncDebtsFromCuotas = syncDebtsFromCuotas;

    function openNewDebtPromptModal() {
      const origIdxEl = document.getElementById('editDebtOrigIdx');
      const titleEl = document.getElementById('editDebtModalTitle');
      const iconEl = document.getElementById('editDebtModalIcon');
      const submitBtn = document.getElementById('editDebtSubmitBtn');
      const nameEl = document.getElementById('editDebtName');
      const totEl = document.getElementById('editDebtInstallmentsTotal');
      const curEl = document.getElementById('editDebtInstallmentsCurrent');
      const remEl = document.getElementById('editDebtInstallmentsRemaining');
      const minEl = document.getElementById('editDebtMinPayment');
      const balEl = document.getElementById('editDebtBalance');
      const teaEl = document.getElementById('editDebtTea');

      if (origIdxEl) origIdxEl.value = -1;
      if (titleEl) titleEl.textContent = 'Añadir Compra en Cuotas / Compromiso';
      if (iconEl) iconEl.textContent = '✨';
      if (submitBtn) submitBtn.textContent = '+ Añadir al Plan';

      if (nameEl) nameEl.value = '';
      if (totEl) totEl.value = 12;
      if (curEl) curEl.value = 1;
      if (remEl) remEl.value = 12;
      if (minEl) minEl.value = 100;
      if (balEl) balEl.value = 1200;
      if (teaEl) teaEl.value = 0;

      syncEditDebtFields('remaining');
      openModalById('editDebtModal');
    }
    window.openNewDebtPromptModal = openNewDebtPromptModal;

    function removeSnowballDebtRow(idx) {
      if (idx >= 0 && idx < currentSnowballDebts.length) {
        const deletedName = currentSnowballDebts[idx].name;
        currentSnowballDebts.splice(idx, 1);
        saveDebtSnowballPlanQuiet();
        calculateAndRenderDebtPlan(currentDebtExtraPayment);
        renderExecutiveAdvisor();
        showToast(`🗑️ Compromiso '${deletedName}' retirado del plan`, 'info');
      }
    }
    window.removeSnowballDebtRow = removeSnowballDebtRow;

    function saveDebtSnowballPlanQuiet() {
      appState.debtSnowball = {
        debts: currentSnowballDebts,
        extraPayment: currentDebtExtraPayment,
        strategy: currentDebtStrategy,
        updatedAt: new Date().toISOString()
      };
      try {
        localStorage.setItem('aliviafin_debt_snowball', JSON.stringify(appState.debtSnowball));
      } catch(e) {}
      syncStateToServer();
    }

    function handleDebtAdvisorClick() {
      switchTab('consejos');
    }

    function openDebtSnowballModal() {
      switchTab('consejos');
    }

    function calculateDebtSnowball() {
      calculateAndRenderDebtPlan(currentDebtExtraPayment);
    }

    function saveDebtSnowballPlan() {
      saveDebtSnowballPlanQuiet();
      showToast('❄️ Plan Anti-Deudas guardado con éxito', 'success');
    }

    function handleExportExcelCSVClick() {
      if (!isUserPro()) {
        openFinZenProModal('Exportación a Excel y CSV');
        return;
      }
      exportTransactionsCSV();
    }

    function exportTransactionsCSV() {
      const curM = appState.currentMonth || getCurrentCalendarMonthName();
      const txs = (appState.transactions && appState.transactions[curM]) || [];
      if (txs.length === 0) {
        alert('No hay gastos registrados en este mes para exportar.');
        return;
      }

      let csv = '\uFEFF'; // UTF-8 BOM para soporte completo en Microsoft Excel
      csv += 'Concepto;Categoría;Monto (S/);Estado;Día Vencimiento;Tipo\n';
      txs.forEach(t => {
        const name = (t.name || '').replace(/;/g, ',');
        const cat = (t.category || '').replace(/;/g, ',');
        const amt = (t.amount || 0).toFixed(2);
        const st = t.status || 'Pagado';
        const due = t.dueDate || '15';
        const type = t.isInstallment ? `Cuota ${t.installmentsCurrent}/${t.installmentsTotal}` : 'Gasto Regular';
        csv += `"${name}";"${cat}";"${amt}";"${st}";"${due}";"${type}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `AliviaFin_${curM.replace(/\s+/g, '_')}_gastos.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('📊 Archivo CSV descargado con éxito', 'success');
    }

// Exponer funciones críticas al scope global explícitamente para evitar problemas de binding
window.openModalById = openModalById;
window.closeModal = closeModal;
window.closeGlassModal = closeGlassModal;
window.closeAllModals = closeAllModals;
window.openExplainSafeToSpendModal = openExplainSafeToSpendModal;
window.startInteractiveTour = startInteractiveTour;
window.toggleFAB = typeof toggleFAB === 'function' ? toggleFAB : function(){};
window.openSettingsModal = openSettingsModal;
window.handleBackdropClick = handleBackdropClick;
window.openAddExpenseModal = openAddExpenseModal;
window.openEditExpenseModal = openEditExpenseModal;
window.handleAddExpense = handleAddExpense;
window.deleteTransaction = deleteTransaction;
window.toggleTxStatus = toggleTxStatus;
window.openAddExtraIncomeModal = openAddExtraIncomeModal;
window.handleAddExtraIncome = handleAddExtraIncome;
window.toggleIncomeStatus = toggleIncomeStatus;
window.editIncomeDate = editIncomeDate;
window.openQuickExpenseModal = openQuickExpenseModal;
window.closeQuickExpenseModal = closeQuickExpenseModal;
window.selectQuickCategory = selectQuickCategory;
window.selectQuickMethod = selectQuickMethod;
window.saveQuickExpense = saveQuickExpense;
window.openCategoryManagerModal = openCategoryManagerModal;
window.openFeedbackModal = openFeedbackModal;
window.openInstallmentsSimulatorModal = openInstallmentsSimulatorModal;
window.handleSimulatedPurchaseClick = handleSimulatedPurchaseClick;
window.handleSaveCategoryClick = handleSaveCategoryClick;
window.handleOpenAddGoalClick = handleOpenAddGoalClick;
window.openAddGoalModal = openAddGoalModal;
window.handleAddGoal = typeof handleAddGoal === 'function' ? handleAddGoal : function(){};
window.deleteGoal = deleteGoal;
window.openDepositGoalModal = openDepositGoalModal;
window.handleDepositGoal = typeof handleDepositGoal === 'function' ? handleDepositGoal : function(){};
window.handleDebtAdvisorClick = handleDebtAdvisorClick;
window.openDebtSnowballModal = openDebtSnowballModal;
window.renderSnowballDebtsList = typeof renderSnowballDebtsList === 'function' ? renderSnowballDebtsList : function(){};
window.updateSnowballDebt = typeof updateSnowballDebt === 'function' ? updateSnowballDebt : function(){};
window.addSnowballDebtRow = typeof addSnowballDebtRow === 'function' ? addSnowballDebtRow : function(){};
window.removeSnowballDebtRow = typeof removeSnowballDebtRow === 'function' ? removeSnowballDebtRow : function(){};
window.calculateDebtSnowball = typeof calculateDebtSnowball === 'function' ? calculateDebtSnowball : function(){};
window.saveDebtSnowballPlan = typeof saveDebtSnowballPlan === 'function' ? saveDebtSnowballPlan : function(){};
window.handleExportExcelCSVClick = handleExportExcelCSVClick;
window.exportTransactionsCSV = exportTransactionsCSV;
window.openFinZenProModal = openFinZenProModal;
window.openAliviaFinProModal = openFinZenProModal;
window.openForgotPasswordModal = openForgotPasswordModal;
window.closeForgotPasswordModal = closeForgotPasswordModal;
window.handleForgotPasswordSubmit = handleForgotPasswordSubmit;
window.openResetPasswordModal = openResetPasswordModal;
window.closeResetPasswordModal = closeResetPasswordModal;
window.handleResetPasswordSubmit = handleResetPasswordSubmit;
window.handleOAuthLogin = handleOAuthLogin;
window.isUserPro = isUserPro;
window.goToWizardStep = goToWizardStep;
window.openOnboardingWizard = openOnboardingWizard;
window.completeOnboardingWizard = completeOnboardingWizard;
window.dismissOnboardingWizard = dismissOnboardingWizard;
window.openEditSalaryModal = openEditSalaryModal;
window.handleSaveSalary = handleSaveSalary;
window.openSecurityModal = openSecurityModal;
window.openLegalModal = openLegalModal;
window.switchLegalTab = switchLegalTab;
window.openReclamacionesModal = openReclamacionesModal;
window.handleTipoReclamoChange = handleTipoReclamoChange;
window.handleReclamacionSubmit = handleReclamacionSubmit;
window.copyReclamacionVoucher = copyReclamacionVoucher;
window.openExplainSurplusModal = openExplainSurplusModal;
window.renderUpcomingDueDates = renderUpcomingDueDates;
window.promptPayBill = promptPayBill;
window.executeConfirmPayBill = executeConfirmPayBill;
window.quickPayBill = quickPayBill;
window.openReconcileModal = openReconcileModal;
window.calculateReconciliationDiff = calculateReconciliationDiff;
window.applyReconciliationAdjustment = applyReconciliationAdjustment;
window.openMissingExpenseFromReconcile = openMissingExpenseFromReconcile;
window.openWhatsNewModal = openWhatsNewModal;
window.dismissWhatsNewModal = dismissWhatsNewModal;
window.syncVersionUI = syncVersionUI;
window.saveCustomUserName = saveCustomUserName;
window.toggleTourPreference = toggleTourPreference;
window.handleLogout = handleLogout;
window.toggleTheme = toggleTheme;
window.togglePrivacyMode = togglePrivacyMode;
window.changeMonth = changeMonth;
window.switchTab = switchTab;
window.switchSegmentView = switchSegmentView;
window.setHistoryPeriodFilter = setHistoryPeriodFilter;
window.toggleCollapseCard = toggleCollapseCard;
window.selectCategoryChip = selectCategoryChip;
window.editCategoryBudget = editCategoryBudget;
window.deleteCategory = deleteCategory;
window.openAddCategoryModal = openAddCategoryModal;
window.deleteCategoryFromManager = deleteCategoryFromManager;
window.editCategoryBudgetFromManager = editCategoryBudgetFromManager;
window.showHormigaAdvice = showHormigaAdvice;
window.filterHormigaGroup = filterHormigaGroup;
window.showGroupOptimizationTip = showGroupOptimizationTip;
window.selectCalendarDay = selectCalendarDay;
window.setTxViewMode = setTxViewMode;
window.selectStatusFilter = selectStatusFilter;
window.clearSearchInput = clearSearchInput;
window.clearAllFilters = clearAllFilters;
window.togglePasswordVisibility = togglePasswordVisibility;
window.switchAuthTab = switchAuthTab;
window.handleTourCheckboxChange = function(val) {
  const userKey = currentUser ? currentUser.id : 'guest';
  if (val) {
    localStorage.setItem('finanzas_tour_dismissed_' + userKey, 'true');
    localStorage.setItem('finanzas_tour_dismissed', 'true');
  } else {
    localStorage.removeItem('finanzas_tour_dismissed_' + userKey);
    localStorage.removeItem('finanzas_tour_dismissed');
  }
};


// ================================================================
// EXPORTACIÓN A PDF (Fase D)
// ================================================================
window.generatePDFReport = function() {
  const element = document.createElement('div');
  element.style.padding = '30px';
  element.style.fontFamily = '"Plus Jakarta Sans", sans-serif';
  element.style.color = '#0f172a';
  element.style.background = '#ffffff';
  
  const curM = appState.currentMonth || getCurrentCalendarMonthName();
  const sym = getCurrencySymbol();
  
  // Header
  let html = `
    <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <h1 style="margin: 0; color: #0d9488; font-size: 28px; font-weight: 800;">AliviaFin</h1>
        <p style="margin: 4px 0 0; color: #64748b; font-size: 14px;">Reporte Financiero Mensual</p>
      </div>
      <div style="text-align: right;">
        <h2 style="margin: 0; color: #0f172a; font-size: 20px;">${curM}</h2>
        <p style="margin: 4px 0 0; color: #64748b; font-size: 12px;">Generado el ${new Date().toLocaleDateString()}</p>
      </div>
    </div>
  `;
  
  // Stats
  const txs = appState.transactions && appState.transactions[curM] ? appState.transactions[curM] : [];
  const sueldo = getMonthTotalIncome();
  const gastos = txs.filter(t => (t.status || 'Pagado') === 'Pagado').reduce((a,b)=>a+b.amount,0);
  const saldo = getAccumulatedBalance(curM);
  
  html += `
    <div style="display: flex; gap: 15px; margin-bottom: 30px;">
      <div style="flex: 1; padding: 15px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
        <p style="margin: 0 0 5px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Ingresos Totales</p>
        <p style="margin: 0; font-size: 24px; font-weight: 800; color: #10b981;">${sym} ${sueldo.toFixed(2)}</p>
      </div>
      <div style="flex: 1; padding: 15px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
        <p style="margin: 0 0 5px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Gastos Reales</p>
        <p style="margin: 0; font-size: 24px; font-weight: 800; color: #ef4444;">${sym} ${gastos.toFixed(2)}</p>
      </div>
      <div style="flex: 1; padding: 15px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
        <p style="margin: 0 0 5px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Saldo Disponible</p>
        <p style="margin: 0; font-size: 24px; font-weight: 800; color: #3b82f6;">${sym} ${saldo.toFixed(2)}</p>
      </div>
    </div>
  `;
  
  // Agregar gráfico si existe
  const chartCanvas = document.getElementById('categoryChart');
  if (chartCanvas) {
    try {
      const chartImg = chartCanvas.toDataURL('image/png');
      html += `
        <div style="text-align: center; margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h3 style="margin: 0 0 15px; color: #0f172a; font-size: 14px; text-transform: uppercase;">Distribución Visual</h3>
          <img src="${chartImg}" style="max-width: 320px; height: auto; margin: 0 auto; display: block;" />
        </div>
      `;
    } catch (e) {
      console.warn("No se pudo capturar el gráfico para el PDF", e);
    }
  }
  
  // Lista de Gastos
  if (txs.length > 0) {
    const pagadas = txs.filter(t => (t.status || 'Pagado') === 'Pagado').sort((a, b) => getEffectiveDueDate(a) - getEffectiveDueDate(b));
    const pendientes = txs.filter(t => (t.status || 'Pagado') === 'Pendiente').sort((a, b) => getEffectiveDueDate(a) - getEffectiveDueDate(b));

    const renderTable = (list, title, color) => {
      if (list.length === 0) return '';
      let tHtml = `<h3 style="margin: 20px 0 10px; color: ${color}; font-size: 15px; border-bottom: 2px solid ${color}; padding-bottom: 4px;">${title}</h3>`;
      tHtml += `<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 13px;">`;
      tHtml += `
        <thead>
          <tr style="background: #f1f5f9; text-align: left;">
            <th style="padding: 8px; border-bottom: 2px solid #cbd5e1; width: 60px;">Día</th>
            <th style="padding: 8px; border-bottom: 2px solid #cbd5e1;">Categoría</th>
            <th style="padding: 8px; border-bottom: 2px solid #cbd5e1;">Descripción</th>
            <th style="padding: 8px; border-bottom: 2px solid #cbd5e1; text-align: right;">Monto</th>
          </tr>
        </thead>
        <tbody>
      `;
      list.forEach((t, i) => {
        const isAlt = i % 2 !== 0;
        const bg = isAlt ? '#f8fafc' : '#ffffff';
        tHtml += `
          <tr style="background: ${bg};">
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 700;">${getEffectiveDueDate(t)}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><span style="background: #e0e7ff; color: #4338ca; padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 11px;">${t.category}</span></td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${t.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700;">${sym} ${t.amount.toFixed(2)}</td>
          </tr>
        `;
      });
      tHtml += `</tbody></table>`;
      return tHtml;
    };

    html += renderTable(pagadas, '✅ Gastos Pagados', '#10b981');
    html += renderTable(pendientes, '⏳ Gastos Pendientes', '#f59e0b');
  } else {
    html += `<p style="color: #64748b; font-size: 14px; font-style: italic;">No hay gastos registrados en este mes.</p>`;
  }
  
  html += `
    <div style="margin-top: 40px; text-align: center; color: #94a3b8; font-size: 11px;">
      Reporte confidencial generado por la plataforma AliviaFin.<br>
      © ${new Date().getFullYear()} AliviaFin App
    </div>
  `;
  
  element.innerHTML = html;
  
  const opt = {
    margin:       10,
    filename:     `AliviaFin_Reporte_${curM}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  showToast('Generando reporte PDF...', 'success');

  // Carga bajo demanda de html2pdf para no sobrecargar el inicio de la app (~900 KB)
  const renderPdfNow = () => {
    html2pdf().set(opt).from(element).save().then(() => {
      showToast('¡PDF descargado exitosamente!', 'success');
    }).catch(err => {
      console.error(err);
      showToast('Error al generar el PDF. Inténtalo de nuevo.', 'error');
    });
  };

  if (typeof html2pdf === 'undefined') {
    showToast('Iniciando motor de exportación PDF...', 'info');
    const script = document.createElement('script');
    script.src = 'js/html2pdf.bundle.min.js?v=71.6';
    script.onload = renderPdfNow;
    script.onerror = () => {
      // Fallback secundario a cdnjs si el local fallara
      const fb = document.createElement('script');
      fb.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      fb.onload = renderPdfNow;
      fb.onerror = () => {
        showToast('Error de red al cargar el generador PDF.', 'error');
      };
      document.head.appendChild(fb);
    };
    document.head.appendChild(script);
  } else {
    renderPdfNow();
  }
};
window.exportMonthlyReportPDF = window.generatePDFReport;

// Multi-Moneda Window Exports
window.SUPPORTED_CURRENCIES = SUPPORTED_CURRENCIES;
window.getActiveCurrency = getActiveCurrency;
window.getCurrencySymbol = getCurrencySymbol;
window.getCurrencyCode = getCurrencyCode;
window.changeCurrency = changeCurrency;
window.updateCurrencyDOMElements = updateCurrencyDOMElements;

// ================================================================
// FOUNDER HUB v69.0 — MÓDULO MASTER CEO (pantalla completa + analítica en vivo)
// ================================================================
const FOUNDER_EMAIL = 'cesar.risso.f@gmail.com';
const MASTER_ONLINE_WINDOW_MS = 12 * 60 * 1000;   // "En línea ahora" = ping en los últimos 12 min
const MASTER_PRICE_LIFETIME_CENTS = 1990;          // S/ 19.90
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
    DELETE FROM public.app_feedback WHERE lower(user_email) = lower(target_email) AND type <> 'user_deleted';
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

-- 6) (Opcional) Limpieza de pings antiguos (+60 días). Ejecútalo cuando quieras:
-- DELETE FROM public.app_feedback WHERE type = 'heartbeat' AND created_at < now() - interval '60 days';
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

  try {
    // 1) Suscriptores: RPC enriquecida (auth.users) o tabla estándar como respaldo
    let subs = null;
    masterRpcAvailable = false;
    try {
      const { data, error } = await supabaseClient.rpc('get_admin_subscribers');
      if (!error && Array.isArray(data)) {
        subs = data;
        masterRpcAvailable = true;
      }
    } catch (e) { /* RPC aún no instalada: se usa el respaldo */ }

    if (!subs) {
      const { data, error } = await supabaseClient
        .from('user_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) subs = data;
    }
    if (subs) {
      masterSubscribersData = subs;
      // Enriquecer con expires_at de user_subscriptions si la RPC no devolvió esa columna
      try {
        const { data: rawSubs } = await supabaseClient
          .from('user_subscriptions')
          .select('user_id, email, expires_at, trial_ends_at');
        if (Array.isArray(rawSubs)) {
          const expMap = new Map();
          rawSubs.forEach(r => {
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
      } catch (e) {
        console.warn('Nota de enriquecimiento expires_at:', e);
      }
    }

    // 2) Telemetría nativa directa desde finanzas_state (respaldos diarios y estados en la nube)
    // Esto garantiza que CUALQUIER usuario que use la app o sincronice se detecte al 100% sin depender de SQL extra
    let stateActivityRows = [];
    try {
      const { data: stData, error: stErr } = await supabaseClient
        .from('finanzas_state')
        .select('id,updated_at')
        .order('updated_at', { ascending: false })
        .limit(500);
      if (!stErr && Array.isArray(stData)) {
        stateActivityRows = stData;
      }
    } catch (e) {
      console.warn('Nota de lectura en finanzas_state:', e);
    }

    // 3) Telemetría secundaria: pings de los últimos 30 días (paginado, tope 6.000 filas)
    masterTelemetryError = null;
    const since = new Date(Date.now() - 30 * 86400000).toISOString();
    const pings = [];
    for (let page = 0; page < 6; page++) {
      const from = page * 1000;
      const { data, error } = await supabaseClient
        .from('app_feedback')
        .select('user_id,user_email,message,created_at')
        .eq('type', 'heartbeat')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .range(from, from + 999);
      if (error || !Array.isArray(data)) {
        if (error) console.warn('Pings app_feedback nota:', error.message);
        break;
      }
      pings.push(...data);
      if (data.length < 1000) break;
    }
    if (pings.length === 0) {
      try {
        const { data: fbAll, error: fbErr2 } = await supabaseClient
          .from('app_feedback')
          .select('user_id,user_email,message,created_at')
          .eq('type', 'heartbeat')
          .order('created_at', { ascending: false })
          .limit(1000);
        if (!fbErr2 && Array.isArray(fbAll) && fbAll.length > 0) {
          pings.push(...fbAll);
          masterTelemetryError = null;
        }
      } catch (e) {}
    }
    masterHeartbeats = pings;

    // 4) Feedback real + marcadores de usuarios eliminados
    const { data: fbData, error: fbErr } = await supabaseClient
      .from('app_feedback')
      .select('*')
      .neq('type', 'heartbeat')
      .order('created_at', { ascending: false })
      .limit(500);
    if (!fbErr && Array.isArray(fbData)) {
      masterDeletedMarkers = new Map();
      fbData.filter(i => i.type === 'user_deleted').forEach(m => {
        const k = (m.user_email || '').toLowerCase().trim();
        if (k && !masterDeletedMarkers.has(k)) masterDeletedMarkers.set(k, m.created_at);
      });
      masterFeedbackData = fbData.filter(i => i.type !== 'user_deleted' && i.type !== 'libro_reclamaciones' && i.type !== 'solicitud_reembolso' && i.type !== 'account_deletion_churn');
    }

    // 5) Cargar Hojas de Reclamación formales (Libro Indecopi)
    let reclamacionesList = [];
    try {
      const { data: recData, error: recErr } = await supabaseClient
        .from('app_reclamaciones')
        .select('*')
        .order('created_at', { ascending: false });
      if (!recErr && Array.isArray(recData)) {
        reclamacionesList = recData;
      }
    } catch (e) {}

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

    // Calcular alertas pendientes
    const pendingClaims = masterReclamacionesData.filter(r => (r.estado || 'pendiente') === 'pendiente').length;
    const pendingRefunds = masterRefundsData.filter(r => ((r.metadata && r.metadata.estado) || 'pendiente') === 'pendiente').length;
    const totalPendingAlerts = pendingClaims + pendingRefunds;

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

  // B) Mapear actividad desde app_feedback (heartbeats)
  masterHeartbeats.forEach(h => {
    const email = (h.user_email || '').toLowerCase().trim();
    [email, h.user_id].filter(Boolean).forEach(key => {
      if (!lastSeen.has(key)) lastSeen.set(key, h.created_at);
    });
    if (email && h.user_id && !ids.has(email)) ids.set(email, h.user_id);
    if (h.message && h.message !== 'heartbeat') {
      [email, h.user_id].filter(Boolean).forEach(key => {
        if (!names.has(key)) names.set(key, h.message);
      });
    }
  });

  // C) Asignar la mayor marca de tiempo a cada suscriptor registrado
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

    const hbName = names.get(email) || names.get(sub.user_id);
    if (hbName && !sub.full_name && !sub.user_name) sub.user_name = hbName;
  });

  // D) Sin la RPC, incorpora a quien se conectó pero aún no figura en user_subscriptions
  if (!masterRpcAvailable) {
    const known = new Set(masterSubscribersData.map(s => (s.email || '').toLowerCase().trim()));
    lastSeen.forEach((ts, key) => {
      if (!key.includes('@') || known.has(key)) return;
      known.add(key);
      masterSubscribersData.push({
        user_id: ids.get(key) || null,
        email: key,
        user_name: names.get(key) || formatCleanNameFromEmail(key),
        status: 'free',
        created_at: ts,
        last_active_at: ts
      });
    });
  }
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

function promptEditUserNickname(email) {
  if (!isAdminCesar()) return;
  const current = getDisplayNameForEmail(email);
  const newName = prompt(`Ingresa el nombre o apodo para ${email}:`, current);
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
  masterSetText('countMLife', life);
  masterSetText('countMMonth', month);
  masterSetText('countMExpiring', expiring);
  masterSetText('countMExpired', expired);
  masterSetText('countMFree', free);
  masterSetText('countMInactive', risk);
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
    ? `Hola ${name}, soy César de AliviaFin. Vi que estás usando la app con frecuencia y quería contarte del plan PRO Vitalicio (S/ 19.90, pago único). ¿Te interesa?`
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
      ? 'Usuarios gratuitos que usaron la app en los últimos 3 días. Son tu mejor oportunidad: ofréceles el Vitalicio (S/ 19.90) por correo o WhatsApp.'
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
  if (plan === 'life') {
    return {
      status: 'lifetime',
      html: '<span style="font-size:11px; font-weight:800; color:#7c3aed; background:rgba(124,58,237,0.1); padding:2px 8px; border-radius:12px;">👑 Vitalicio</span>',
      isExpiring: false,
      isExpired: false
    };
  }

  const expRaw = item.expires_at || item.trial_ends_at;
  const sub = getSubscriptionDetails({ status: item.status, expires_at: expRaw, email: item.email });

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
      html: `<span class="master-user-badge-exp-danger">🔴 Vencido${shortDate ? ' (' + shortDate + ')' : ''}</span>`,
      isExpiring: false,
      isExpired: true
    };
  }

  if (sub.inGrace) {
    return {
      status: 'grace',
      html: `<span class="master-user-badge-exp-grace">⏳ Cortesía (${sub.hoursGrace}h)</span>`,
      isExpiring: true,
      isExpired: false
    };
  }

  if (sub.days <= 5) {
    return {
      status: 'expiring',
      html: `<span class="master-user-badge-exp-warn">🟡 ${sub.days}d (${shortDate})</span>`,
      isExpiring: true,
      isExpired: false
    };
  }

  return {
    status: 'active',
    html: `<span class="master-user-badge-exp-active">🟢 ${sub.days}d (${shortDate})</span>`,
    isExpiring: false,
    isExpired: false
  };
}

function setMasterFilter(filter) {
  masterCurrentFilter = filter;
  document.querySelectorAll('.master-filter-chip').forEach(c => c.classList.remove('active'));
  const activeBtn = document.getElementById(
    filter === 'pro_lifetime' ? 'mFilterLife' :
    (filter === 'pro_monthly' ? 'mFilterMonth' :
    (filter === 'expiring' ? 'mFilterExpiring' :
    (filter === 'expired' ? 'mFilterExpired' :
    (filter === 'free' ? 'mFilterFree' :
    (filter === 'inactive' ? 'mFilterInactive' : 'mFilterAll')))))
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
    if (masterCurrentFilter === 'pro_lifetime') return plan === 'life' || plan === 'founder';
    if (masterCurrentFilter === 'pro_monthly') return plan === 'month';
    if (masterCurrentFilter === 'expiring') return plan !== 'founder' && getSubscriberExpirationInfo(item).isExpiring;
    if (masterCurrentFilter === 'expired') return plan !== 'founder' && getSubscriberExpirationInfo(item).isExpired;
    if (masterCurrentFilter === 'free') return plan === 'free';
    if (masterCurrentFilter === 'inactive') return plan !== 'founder' && getUserLastConnectionInfo(item).isInactive;
    return true;
  });

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 28px; color: var(--text-muted); font-size: 12px;">
          No se encontraron usuarios con el filtro seleccionado.
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
      planBadge = '<span class="master-user-badge-pro-life" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.35)); border-color: #f59e0b; font-weight: 800;">👑 PRO Vitalicio (Fundador)</span>';
      revenueEst = 'Fundador CEO';
    } else if (isLife) {
      planBadge = '<span class="master-user-badge-pro-life">👑 PRO Vitalicio</span>';
      revenueEst = 'S/ 19.90';
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
        <td>
          <div style="display: flex; gap: 5px; align-items: center; justify-content: flex-end; flex-wrap: wrap;">
            ${!isLife ? `<button type="button" class="master-action-btn-pill master-action-btn-life" onclick="setMasterUserPlan('${uid}', '${em}', 'pro_lifetime')" title="Activar PRO Vitalicio S/ 19.90">👑 Vitalicio</button>` : ''}
            ${!isCesar ? `<button type="button" class="master-action-btn-pill master-action-btn-renew" onclick="renewMasterUser30Days('${uid}', '${em}')" title="Extender o renovar 30 días de PRO (S/ 4.90)">⚡ +30 Días</button>` : ''}
            ${!isMonth && !isCesar ? `<button type="button" class="master-action-btn-pill master-action-btn-month" onclick="setMasterUserPlan('${uid}', '${em}', 'pro_monthly')" title="Activar PRO Mensual S/ 4.90">📅 Mensual</button>` : ''}
            ${(isLife || isMonth) && !isCesar ? `<button type="button" class="master-action-btn-pill master-action-btn-free" onclick="setMasterUserPlan('${uid}', '${em}', 'free')" title="Bajar a cuenta gratuita">⚪ Free</button>` : ''}
            ${!isCesar ? `<button type="button" class="master-action-btn-winback" onclick="openWinBackModal('${em}', '${escapeHtml(cleanName)}', ${actInfo.daysInactive || 0})" title="Campaña Win-Back WhatsApp / Correo" style="background: rgba(37, 211, 102, 0.12); color: #16a34a; border: 1.5px solid rgba(37, 211, 102, 0.4); font-weight: 800; font-size: 11px; padding: 4px 8px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">💬 Win-Back</button>` : ''}
            ${!isCesar ? `<button type="button" class="master-action-btn-delete" onclick="confirmDeleteMasterUser('${uid}', '${em}', '${escapeHtml(cleanName)}')" title="Eliminar usuario permanentemente" aria-label="Eliminar usuario">🗑️</button>` : ''}
          </div>
        </td>
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

  const planLabel = newPlan === 'pro_lifetime' ? 'PRO Vitalicio (S/ 19.90)' : (newPlan === 'pro_monthly' ? 'PRO Mensual (S/ 4.90)' : 'Gratuito (Free)');
  if (!confirm(`¿Confirmas actualizar a ${email} al plan ${planLabel}?`)) return;

  try {
    const updatePayload = { user_id: userId, status: newPlan };
    if (email) updatePayload.email = email;
    if (newPlan === 'pro_monthly') {
      updatePayload.expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    } else if (newPlan === 'pro_lifetime') {
      updatePayload.expires_at = null;
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
          amount: newPlan === 'pro_lifetime' ? 19.90 : 4.90,
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

  if (!confirm(`¿Confirmas renovar 30 días PRO para ${email}?\nNueva fecha de vencimiento: ${dateFormatted}`)) {
    return;
  }

  try {
    const updatePayload = {
      user_id: userId,
      status: 'pro_monthly',
      expires_at: newExpiresIso,
      updated_at: new Date().toISOString()
    };
    if (email) updatePayload.email = email;

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

  if (!confirm(msg)) return;
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
      await supabaseClient.from('user_subscriptions').delete().eq('user_id', userId).catch(() => {});
      await supabaseClient.from('finanzas_state').delete().eq('id', 'state_' + userId).catch(() => {});
      await supabaseClient.from('app_feedback').delete().eq('user_id', userId).catch(() => {});
    }
    if (email && email.includes('@')) {
      await supabaseClient.from('user_subscriptions').delete().eq('email', email).catch(() => {});
      await supabaseClient.from('app_feedback').delete().eq('user_email', email).catch(() => {});
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
        : `🗑️ ${cleanName} quitado del panel. Para borrar también su login y datos, activa el SQL del Hub.`,
      fullyDeleted ? 'success' : 'warning'
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
              <span style="font-size: 11px; font-weight: 700; color: #475569;">${plan === 'pro_lifetime' ? '👑 Vitalicio (S/ 19.90)' : '📅 Mensual (S/ 4.90)'}</span>
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
      await supabaseClient.from('app_reclamaciones').update({ estado: 'atendido' }).eq('codigo', codigo).catch(() => {});
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
      }).eq('id', idOrCod).catch(() => {});
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
      }]).catch(() => {});
    }

    // 2. Borrar datos financieros en finanzas_state
    if (currentUser && currentUser.id) {
      await supabaseClient
        .from('finanzas_state')
        .delete()
        .eq('id', 'state_' + currentUser.id)
        .catch(() => {});
    }

    // 3. Borrar suscripción en user_subscriptions
    if (currentUser && currentUser.id) {
      await supabaseClient
        .from('user_subscriptions')
        .delete()
        .eq('user_id', currentUser.id)
        .catch(() => {});
    }

    // 4. Limpiar almacenamiento local
    localStorage.clear();

    // 5. Cerrar sesión
    if (supabaseClient) {
      await supabaseClient.auth.signOut().catch(() => {});
    }

    alert('✅ Tu cuenta y datos personales han sido purgados conforme a la Ley N° 29733. Gracias por habernos probado.');
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
