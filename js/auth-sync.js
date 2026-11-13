
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
    function escapeJsAttrArg(str) {
      return escapeHtml(JSON.stringify(str === null || str === undefined ? '' : String(str)));
    }
    window.escapeHtml = escapeHtml;
    window.escapeJsAttrArg = escapeJsAttrArg;

    // Helper: identifica si el usuario es el administrador fundador César
    function isAdminCesar(userOrEmail) {
      const u = userOrEmail || currentUser;
      if (!u) return false;
      const email = typeof u === 'string' ? u : (u.email || '');
      const e = email.trim().toLowerCase();
      return e === 'cesar.risso.f@gmail.com';
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
    // VERSIÓN DE LA APP & MOTOR MULTI-MONEDA INTERNACIONAL (v80.0)
    // ================================================================
    const APP_VERSION = 'v80.0';
    const APP_VERSION_EPOCH = 800;
    try {
      if (typeof window !== 'undefined' && window.location && /[?&]v=\d+/.test(window.location.search)) {
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('v');
        window.history.replaceState({}, document.title, cleanUrl.pathname + (cleanUrl.search || '') + (cleanUrl.hash || ''));
      }
    } catch (e) {}

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

    function roundCurrency(amount) {
      return Math.round((Number(amount || 0) + Number.EPSILON) * 100) / 100;
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
      syncTravelModeUI();
      if (typeof renderAll === 'function') renderAll();
      if (typeof updateSimulation === 'function') updateSimulation();
      showToast(`Moneda cambiada a ${SUPPORTED_CURRENCIES[code].flag} ${SUPPORTED_CURRENCIES[code].name} (${SUPPORTED_CURRENCIES[code].symbol})`, 'success');
    }

    function toggleTravelMode() {
      const current = getCurrencyCode();
      const next = current === 'PEN' ? 'USD' : 'PEN';
      if (!SUPPORTED_CURRENCIES[next]) return;
      localStorage.setItem('aliviafin_currency', next);
      if (typeof appState !== 'undefined' && appState) {
        appState.currency = next;
        if (typeof saveData === 'function') saveData();
      }
      updateCurrencyDOMElements();
      syncTravelModeUI();
      if (typeof renderAll === 'function') renderAll();
      if (typeof updateSimulation === 'function') updateSimulation();
      if (next === 'USD') {
        showToast('✈️ Modo Viaje activado: Vista en Dólares ($ USD)', 'info');
      } else {
        showToast('🇵🇪 Modo Local activado: Vista en Soles (S/ PEN)', 'info');
      }
    }

    function syncTravelModeUI() {
      const code = getCurrencyCode();
      const flagEl = document.getElementById('travelModeFlag');
      const codeEl = document.getElementById('travelModeCode');
      const btn = document.getElementById('travelModeToggleBtn');
      if (flagEl) flagEl.textContent = code === 'USD' ? '✈️' : '🇵🇪';
      if (codeEl) codeEl.textContent = code;
      if (btn) {
        if (code === 'USD') {
          btn.style.background = '#eff6ff';
          btn.style.borderColor = '#93c5fd';
          btn.style.color = '#1d4ed8';
        } else {
          btn.style.background = 'rgba(255, 255, 255, 0.85)';
          btn.style.borderColor = 'var(--border)';
          btn.style.color = 'var(--text-main)';
        }
      }
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
        onboardingCompleted: false,
        _lastSaved: 0
      };
    }

    // Helper de seguridad: detecta de forma infalible si el usuario ya posee datos financieros reales en su cuenta
    function userHasExistingFinancialData(state) {
      if (!state) return false;
      if (state.onboardingCompleted === true || state.onboardingSkipped === true) return true;
      if (state.salary && Number(state.salary) > 0) return true;
      // NOTA: _lastSaved NO es evidencia de datos reales (se estampa incluso al guardar el estado vacío)
      if (state.savingsGoals && Array.isArray(state.savingsGoals) && state.savingsGoals.length > 0) return true;
      if (state.transactions && typeof state.transactions === 'object') {
        const months = Object.keys(state.transactions);
        for (let i = 0; i < months.length; i++) {
          const list = state.transactions[months[i]];
          if (Array.isArray(list) && list.length > 0) return true;
        }
      }
      if (state.incomes && typeof state.incomes === 'object') {
        const months = Object.keys(state.incomes);
        for (let i = 0; i < months.length; i++) {
          const list = state.incomes[months[i]];
          if (Array.isArray(list) && list.length > 0) return true;
        }
      }
      if (state.extraIncomes && typeof state.extraIncomes === 'object') {
        if (Array.isArray(state.extraIncomes)) { if (state.extraIncomes.length > 0) return true; }
        else if (Object.values(state.extraIncomes).some(l => Array.isArray(l) && l.length > 0)) return true;
      }
      if (state.recurringDueDates && typeof state.recurringDueDates === 'object' && Object.keys(state.recurringDueDates).length > 0) return true;
      return false;
    }

    // Detector de datos heredados por error de la plantilla personal
    // Requiere la presencia simultánea e inequívoca de TODOS los marcadores originales para evitar falsos positivos
    function isLegacyClonedState(state) {
      if (!state) return false;
      if (state.onboardingCompleted === true) return false;
      if (state._lastSaved && state._lastSaved > 1700000000000) return false;
      const hasCesarSalary = Number(state.salary) === 8800;
      const hasAlquilerDue = state.recurringDueDates && state.recurringDueDates['alquiler'];
      const hasCesarOct = state.transactions && state.transactions['Octubre'] && Array.isArray(state.transactions['Octubre']) && state.transactions['Octubre'].some(t => t.name === 'Casa' && t.amount === 750);
      const hasSheldon = state.transactions && state.transactions['Septiembre 2026'] && Array.isArray(state.transactions['Septiembre 2026']) && state.transactions['Septiembre 2026'].some(t => t.name === 'Sheldon');
      return Boolean(hasCesarSalary && hasAlquilerDue && hasCesarOct && hasSheldon);
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
      const authPaneTitle = document.getElementById('authPaneTitle');
      const authPaneSubtitle = document.getElementById('authPaneSubtitle');

      if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginBtn.style.background = '#059669';
        loginBtn.style.color = 'white';
        loginBtn.style.boxShadow = '0 2px 6px rgba(5,150,105,0.3)';
        registerBtn.style.background = 'transparent';
        registerBtn.style.color = '#6b7280';
        registerBtn.style.boxShadow = 'none';
        if (authPaneTitle) authPaneTitle.textContent = 'Bienvenido';
        if (authPaneSubtitle) authPaneSubtitle.textContent = 'Toma el control de tus finanzas personales sin enredos.';
      } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        registerBtn.style.background = '#059669';
        registerBtn.style.color = 'white';
        registerBtn.style.boxShadow = '0 2px 6px rgba(5,150,105,0.3)';
        loginBtn.style.background = 'transparent';
        loginBtn.style.color = '#6b7280';
        loginBtn.style.boxShadow = 'none';
        if (authPaneTitle) authPaneTitle.textContent = 'Crear Cuenta';
        if (authPaneSubtitle) authPaneSubtitle.textContent = 'Empieza a gestionar tu dinero con total tranquilidad.';
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

    // Carrusel Liquid Showcase en pantalla de acceso / login
    let currentLoginSlide = 0;
    let loginSlideTimer = null;
    const totalLoginSlides = 4;
    const mobLoginBenefits = [
      '✨ Límite de hoy: Gasta con tranquilidad sin quedarte corto',
      '❄️ Cero Deudas: Liquida tus tarjetas con bola de nieve',
      '📊 Regla 50/30/20: Tu dinero ordenado en 3 grupos simples',
      '🤝 Cuentas Claras: Préstamos y cobros sin olvidos ni vergüenza'
    ];

    function setLoginSlide(index) {
      currentLoginSlide = index;
      for (let i = 0; i < totalLoginSlides; i++) {
        const slide = document.getElementById(`loginSlide_${i}`);
        const dot = document.getElementById(`loginDot_${i}`);
        if (slide) slide.classList.toggle('active', i === index);
        if (dot) dot.classList.toggle('active', i === index);
      }
      const mobPill = document.getElementById('mobileBenefitPill');
      if (mobPill) mobPill.textContent = mobLoginBenefits[index];
    }

    function nextLoginSlide() {
      setLoginSlide((currentLoginSlide + 1) % totalLoginSlides);
    }

    function prevLoginSlide() {
      setLoginSlide((currentLoginSlide - 1 + totalLoginSlides) % totalLoginSlides);
    }

    window.setLoginSlide = setLoginSlide;
    window.nextLoginSlide = nextLoginSlide;
    window.prevLoginSlide = prevLoginSlide;

    // Apertura inmediata y segura de modal Legal y Privacidad
    function openLegalModal(initialTab = 'terms') {
      try {
        if (typeof switchLegalTab === 'function') {
          switchLegalTab(initialTab);
        } else {
          const termsSection = document.getElementById('legalSectionTerms');
          const privacySection = document.getElementById('legalSectionPrivacy');
          const refundsSection = document.getElementById('legalSectionRefunds');
          const providerSection = document.getElementById('legalSectionProvider');
          if (termsSection) termsSection.style.display = (initialTab === 'terms') ? 'block' : 'none';
          if (privacySection) privacySection.style.display = (initialTab === 'privacy') ? 'block' : 'none';
          if (refundsSection) refundsSection.style.display = (initialTab === 'refunds') ? 'block' : 'none';
          if (providerSection) providerSection.style.display = (initialTab === 'provider') ? 'block' : 'none';
        }
        const modal = document.getElementById('legalModal');
        if (modal) {
          modal.classList.add('active');
          modal.style.display = 'flex';
          modal.style.visibility = 'visible';
          modal.style.opacity = '1';
          modal.style.pointerEvents = 'auto';
          modal.style.zIndex = '100010';
        }
      } catch (err) {
        console.error('Error opening legal modal:', err);
      }
    }
    window.openLegalModal = openLegalModal;
    window.openLegalModalImpl = openLegalModal;

    // Helpers robustos e infalibles para ocultar/mostrar la pantalla de acceso
    function hideLoginScreen() {
      const isDark = document.body.classList.contains('theme-twilight');
      const meta = document.getElementById('themeColorMeta') || document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', isDark ? '#090d16' : '#fbfbfd');

      const modal = document.getElementById('loginModalScreen');
      if (modal) {
        modal.classList.add('hidden');
        modal.style.setProperty('display', 'none', 'important');
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
      }
      const mainWrap = document.getElementById('appMainWrapper');
      if (mainWrap) {
        mainWrap.classList.add('authenticated');
        mainWrap.style.removeProperty('display');
        if (window.innerWidth >= 1024) {
          mainWrap.style.display = 'flex';
        } else {
          mainWrap.style.display = 'block';
        }
      }
    }

    function showLoginScreen() {
      const meta = document.getElementById('themeColorMeta') || document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', '#ffffff');

      const modal = document.getElementById('loginModalScreen');
      if (modal) {
        modal.classList.remove('hidden');
        modal.style.removeProperty('display');
        modal.style.removeProperty('visibility');
        modal.style.removeProperty('opacity');
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'auto';
      }
      const mainWrap = document.getElementById('appMainWrapper');
      if (mainWrap) {
        mainWrap.style.setProperty('display', 'none', 'important');
        mainWrap.classList.remove('authenticated');
      }
    }
    window.hideLoginScreen = hideLoginScreen;
    window.showLoginScreen = showLoginScreen;

    if (typeof window !== 'undefined') {
      window.addEventListener('DOMContentLoaded', () => {
        if (loginSlideTimer) clearInterval(loginSlideTimer);
        loginSlideTimer = setInterval(nextLoginSlide, 5000);
      });
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
        showLoginScreen();
        return;
      }

      // Listener global de cambios de autenticación (OAuth y Password Recovery)
      if (!window._hasConfiguredAuthListener) {
        window._hasConfiguredAuthListener = true;
        client.auth.onAuthStateChange(async (event, session) => {
          if (event === 'PASSWORD_RECOVERY') {
            openResetPasswordModal();
          } else if (event === 'SIGNED_IN' && session && session.user && !currentUser) {
            // Diferir fuera del callback: llamar a Supabase dentro del lock de auth puede
            // ejecutar la consulta sin token (0 filas por RLS) y simular un usuario nuevo.
            const u = session.user;
            setTimeout(() => { if (!currentUser) onLoginSuccess(u); }, 0);
          }
        });
      }

      // Soporte para depuración / vista previa local (?debug_tour=1 o ?demo=1 o ?preview=1 o ?view_login=1)
      if (window.location.search.includes('view_login=1')) {
        showLoginScreen();
        return;
      }

      const isLocalDev = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      if (isLocalDev && (window.location.search.includes('debug_tour=1') || window.location.search.includes('demo=1') || window.location.search.includes('preview=1'))) {
        const isTourDebug = window.location.search.includes('debug_tour=1');
        const demoUser = isTourDebug
          ? { id: 'test_user_tour', email: 'cesar.risso.f@gmail.com', user_metadata: { full_name: 'makiados' } }
          : { id: 'test_user_demo', email: 'demo@aliviafin.com', user_metadata: { full_name: 'César' } };
        await onLoginSuccess(demoUser);
        if (isTourDebug) {
          setTimeout(() => startInteractiveTour(), 500);
        }
        return;
      }

      const { data: { session } } = await client.auth.getSession();
      if (session && session.user) {
        recordUserHeartbeat(session.user, true);
        await onLoginSuccess(session.user);
      } else {
        if (typeof recordLandingOrAppVisit === 'function') recordLandingOrAppVisit();
        const searchStr = window.location.search || '';
        const hasAuthParam = /mode=(login|register)|register=1|login=1|view_login=1/.test(searchStr);
        const hasLoggedBefore = localStorage.getItem('aliviafin_has_logged_in_before') === 'true';
        const seenLanding = sessionStorage.getItem('aliviafin_seen_landing') === '1' || /\/landing|\/inicio/i.test(document.referrer || '');
        const isStandalonePwa = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
        const isAutomatedLocal = navigator.webdriver === true && isLocalDev && !searchStr.includes('test_cold_redirect=1');

        if (!hasLoggedBefore && !hasAuthParam && !seenLanding && !isStandalonePwa && !isAutomatedLocal) {
          try { sessionStorage.setItem('aliviafin_seen_landing', '1'); } catch (e) {}
          window.location.replace('landing.html' + searchStr);
          return;
        }

        showLoginScreen();
        if (searchStr.includes('mode=register') || searchStr.includes('register=1') || (!hasLoggedBefore && !searchStr.includes('mode=login'))) {
          switchAuthTab('register');
        }
      }
    }

    // Se llama cuando el login/registro es exitoso
    async function onLoginSuccess(user) {
      const userKey = user.id;
      const isCesar = isAdminCesar(user);
      try { localStorage.setItem('aliviafin_has_logged_in_before', 'true'); } catch (e) {}

      // Obtener nombre del usuario (aislado por userKey para no contaminar entre cuentas distintas):
      // 1. Metadata oficial guardada en la nube de Supabase (user_metadata.full_name)
      // 2. Preferencia personalizada guardada en localStorage para este usuario
      // 3. Fallback: si es César por defecto 'makiados', si no prefijo de correo
      const cloudName = (user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name.trim() : null;
      let localName = localStorage.getItem('aliviafin_custom_display_name_' + userKey);

      let displayName = (localName && localName !== 'makiados') ? localName : (cloudName || localName);
      if (!displayName && isCesar) {
        displayName = 'makiados';
      }
      if (!displayName) {
        displayName = user.email ? user.email.split('@')[0] : 'Usuario';
      }

      localStorage.setItem('aliviafin_custom_display_name_' + userKey, displayName);
      localStorage.setItem('aliviafin_custom_display_name', displayName);

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
      const profileNameText = document.getElementById('settingsProfileNameText');
      if (profileNameText) profileNameText.textContent = displayName;
      const homeGreetingName = document.getElementById('homeGreetingUserName');
      if (homeGreetingName) homeGreetingName.textContent = displayName;
      const nameInput = document.getElementById('settingsUserNameInput');
      if (nameInput) nameInput.value = displayName;

      // Ocultar pantalla de login de forma definitiva
      hideLoginScreen();

      // Inicializar app con datos del usuario
      window._serverStateLoaded = false;
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
      checkOnboardingAndVersionAnnouncements();
    }

    // Helper para pruebas en desarrollo local exclusivamente (desactivado en producción)
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      window.testBypassLogin = async function(email = 'cesar.risso.f@gmail.com') {
        await onLoginSuccess({ id: 'local_test_user', email: email });
      };
    }

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
        const effectiveExp = expiresAt || (options.created_at ? new Date(Date.parse(options.created_at) + 365 * 86400000).toISOString() : null);
        if (!effectiveExp) {
          return {
            status: 'pro_lifetime',
            plan: 'life',
            isPro: true,
            isExpired: false,
            inGrace: false,
            days: 365,
            hoursGrace: 0,
            expiresAt: null,
            label: '👑 PRO Anual'
          };
        }
        const expMs = new Date(effectiveExp).getTime();
        if (isNaN(expMs)) {
          return {
            status: 'pro_lifetime',
            plan: 'life',
            isPro: true,
            isExpired: false,
            inGrace: false,
            days: 365,
            hoursGrace: 0,
            expiresAt: null,
            label: '👑 PRO Anual'
          };
        }
        const nowMs = Date.now();
        const diffMs = expMs - nowMs;
        const graceMs = 48 * 60 * 60 * 1000;
        if (diffMs > 0) {
          const daysLeft = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
          return {
            status: 'pro_lifetime',
            plan: 'life',
            isPro: true,
            isExpired: false,
            inGrace: false,
            days: daysLeft,
            hoursGrace: 0,
            expiresAt: effectiveExp,
            label: `👑 PRO Anual (${daysLeft}d)`
          };
        } else if (nowMs <= (expMs + graceMs)) {
          const hoursGrace = Math.max(0, Math.ceil((expMs + graceMs - nowMs) / (60 * 60 * 1000)));
          return {
            status: 'pro_lifetime',
            plan: 'life',
            isPro: true,
            isExpired: false,
            inGrace: true,
            days: 0,
            hoursGrace: hoursGrace,
            expiresAt: effectiveExp,
            label: `⏳ Cortesía Anual (${hoursGrace}h)`
          };
        } else {
          const daysAgo = Math.max(1, Math.ceil((nowMs - expMs) / (24 * 60 * 60 * 1000)));
          return {
            status: 'expired',
            plan: 'life',
            isPro: false,
            isExpired: true,
            inGrace: false,
            days: -daysAgo,
            hoursGrace: 0,
            expiresAt: effectiveExp,
            label: '🔴 PRO Anual Vencido'
          };
        }
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
        ? 'Plan Anual PRO (S/ 29.90 / año)' 
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

    async function reportPaymentClaimInApp() {
      const userEmail = (currentUser && currentUser.email) ? currentUser.email : '';
      const planText = currentSelectedProPlan === 'pro_lifetime' ? 'Plan Anual PRO (S/ 29.90 / año)' : 'PRO Mensual (S/ 4.90 / mes)';
      
      const promptTitle = (typeof uiPrompt === 'function') 
        ? await uiPrompt(`Indica tu N° de Operación de Yape/Plin o tu nombre titular para validar el plan ${planText}:`, 'N° Operación o Nombre Titular')
        : prompt(`Indica tu N° de Operación de Yape/Plin o tu nombre titular para validar el plan ${planText}:`);

      if (!promptTitle || !promptTitle.trim()) return;

      const btn = document.getElementById('btnReportPaymentInApp');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Registrando comprobante... ⏳';
      }

      try {
        const payload = {
          user_id: currentUser ? currentUser.id : 'guest',
          user_email: userEmail || 'sin_email',
          type: 'payment_claim',
          message: `AVISO DE PAGO: ${planText} | Referencia/Titular: ${promptTitle.trim()}`,
          created_at: new Date().toISOString()
        };

        if (supabaseClient) {
          await supabaseClient.from('app_feedback').insert([payload]);
        }

        const successMsg = '¡Comprobante registrado! César verificará la transferencia y activará tu cuenta en breve.';
        if (typeof uiAlert === 'function') {
          await uiAlert(successMsg, 'Aviso Recibido ⚡');
        } else {
          alert(successMsg);
        }
        closeGlassModal('finzenProModal');
      } catch (err) {
        console.error('Error reportando pago:', err);
        showToast('Error al enviar el aviso. Por favor notifícalo por WhatsApp.', 'error');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<span>🔔 Ya transferí por Yape / Plin (Avisar aquí)</span>';
        }
      }
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

    // ================================================================
    // TELEMETRÍA DE ORIGEN SOCIAL (TIKTOK / INSTAGRAM / WEB) & DISPOSITIVO
    // ================================================================
    function getSocialInAppBrowserInfo() {
      const ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '';
      if (/BytedanceWebview|musical_ly|TikTok/i.test(ua)) return { isInApp: true, app: 'TikTok' };
      if (/Instagram/i.test(ua)) return { isInApp: true, app: 'Instagram' };
      if (/FBAN|FBAV/i.test(ua)) return { isInApp: true, app: 'Facebook' };
      return { isInApp: false, app: null };
    }
    window.getSocialInAppBrowserInfo = getSocialInAppBrowserInfo;

    function getTrafficSourceAttribution() {
      try {
        const params = new URLSearchParams(window.location.search || '');
        const rawParam = (params.get('ref') || params.get('utm_source') || params.get('source') || '').toLowerCase();
        const ua = (navigator.userAgent || '').toLowerCase();
        const ref = (document.referrer || '').toLowerCase();

        let detected = null;
        if (rawParam.includes('tiktok') || rawParam === 'tt' || /bytedancewebview|musical_ly|tiktok/i.test(ua) || ref.includes('tiktok.com')) {
          detected = 'tiktok';
        } else if (rawParam.includes('ig') || rawParam.includes('instagram') || /instagram/i.test(ua) || ref.includes('instagram.com')) {
          detected = 'instagram';
        } else if (rawParam.includes('fb') || rawParam.includes('facebook') || /fban|fbav/i.test(ua) || ref.includes('facebook.com')) {
          detected = 'facebook';
        }

        if (detected) {
          localStorage.setItem('aliviafin_traffic_source', detected);
          return detected;
        }
        const saved = localStorage.getItem('aliviafin_traffic_source');
        return saved || 'direct';
      } catch (e) {
        return 'direct';
      }
    }
    window.getTrafficSourceAttribution = getTrafficSourceAttribution;

    function getClientDeviceLabel() {
      try {
        const ua = navigator.userAgent || '';
        if (/iPhone/i.test(ua)) return 'iPhone';
        if (/iPad/i.test(ua)) return 'iPad';
        if (/Android/i.test(ua)) return 'Android';
        if (/Macintosh|Mac OS X/i.test(ua)) return 'Mac';
        if (/Windows/i.test(ua)) return 'Windows PC';
        return 'Web';
      } catch (e) {
        return 'Web';
      }
    }
    window.getClientDeviceLabel = getClientDeviceLabel;

    function recordLandingOrAppVisit() {
      try {
        const source = getTrafficSourceAttribution();
        if (sessionStorage.getItem('aliviafin_visit_logged_v1')) return;
        sessionStorage.setItem('aliviafin_visit_logged_v1', '1');
        const client = getSupabaseClient();
        if (!client) return;
        const payload = JSON.stringify({
          source: source,
          device: getClientDeviceLabel(),
          path: window.location.pathname || '/'
        });
        client
          .from('app_feedback')
          .insert([{
            user_id: null,
            user_email: 'visit@aliviafin.app',
            type: 'landing_visit',
            message: payload,
            app_version: APP_VERSION
          }])
          .then(() => {}, () => {});
      } catch (e) {}
    }
    window.recordLandingOrAppVisit = recordLandingOrAppVisit;

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
            .then(() => {}, () => {});
        }

        // Throttle por usuario individual: solo para pings pasivos de fondo
        const throttleKey = 'aliviafin_last_ping_' + (userEmail || user.id);
        const lastPing = sessionStorage.getItem(throttleKey);
        const nowMs = Date.now();
        if (!force && lastPing && (nowMs - parseInt(lastPing, 10)) < 3 * 60 * 1000) {
          return;
        }
        try { sessionStorage.setItem(throttleKey, nowMs.toString()); } catch(e) {}

        const hbMetaPayload = JSON.stringify({
          name: displayName,
          source: getTrafficSourceAttribution(),
          device: getClientDeviceLabel(),
          onboardingDone: Boolean(appState && appState.onboardingCompleted),
          txCount: (typeof countTotalTransactions === 'function' && appState) ? countTotalTransactions(appState) : 0
        });

        // 1) Telemetría a app_feedback (RLS público para INSERT con WITH CHECK (true))
        supabaseClient
          .from('app_feedback')
          .insert([{
            user_id: user.id || null,
            user_email: userEmail,
            type: 'heartbeat',
            message: hbMetaPayload,
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
            .then(() => {}, () => {});
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
      const sideUserRole = document.getElementById('deskSidebarRoleText');
      if (sideUserBadge) {
        if (isAdminCesar()) {
          sideUserBadge.style.display = 'inline-block';
          sideUserBadge.style.background = 'rgba(245, 158, 11, 0.18)';
          sideUserBadge.style.color = '#d97706';
          sideUserBadge.textContent = '👑 CEO';
          if (sideUserRole) sideUserRole.textContent = '👑 Fundador Vitalicio';
        } else if (isExpired) {
          sideUserBadge.style.display = 'inline-block';
          sideUserBadge.style.background = 'rgba(239, 68, 68, 0.15)';
          sideUserBadge.style.color = '#dc2626';
          sideUserBadge.textContent = '🔴 Vencido';
          if (sideUserRole) sideUserRole.textContent = 'Plan Vencido';
        } else if (isPro) {
          sideUserBadge.style.display = 'inline-block';
          sideUserBadge.style.background = 'rgba(245, 158, 11, 0.18)';
          sideUserBadge.style.color = '#d97706';
          sideUserBadge.textContent = '👑 PRO';
          if (sideUserRole) sideUserRole.textContent = 'Suscripción Activa';
        } else {
          sideUserBadge.style.display = 'none';
          if (sideUserRole) sideUserRole.textContent = 'Plan Free';
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
            if (!window._currentUserSubscriptionExpiresAt) {
              const baseMs = Date.parse(bestSub.updated_at || bestSub.created_at) || Date.now();
              window._currentUserSubscriptionExpiresAt = new Date(baseMs + 365 * 86400000).toISOString();
            }
            const expMs = new Date(window._currentUserSubscriptionExpiresAt).getTime();
            const graceMs = 48 * 3600 * 1000;
            if (!isNaN(expMs) && Date.now() > (expMs + graceMs)) {
              window._currentUserSubscriptionStatus = 'expired';
            } else {
              window._currentUserSubscriptionStatus = bestSub.status;
            }
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
          if (error.message === 'Invalid login credentials') {
            errEl.innerHTML = '🚨 Correo o contraseña incorrectos.<div style="margin-top: 8px;"><button type="button" onclick="prefillRegisterFromLogin()" style="background: #059669; color: #ffffff; border: none; border-radius: 8px; padding: 6px 12px; font-size: 11.5px; font-weight: 800; cursor: pointer;">🚀 ¿Eres nuevo? Crear tu cuenta ahora con este correo →</button></div>';
          } else {
            errEl.textContent = '🚨 ' + error.message;
          }
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

    // ================================================================
    // VALIDACIÓN INTELIGENTE ANTI-REBOTES DE EMAIL (ANTI-BOUNCE SHIELD)
    // ================================================================
    function validateSafeEmail(rawEmail) {
      const email = (rawEmail || '').trim().toLowerCase();
      
      // 1. Sintaxis RFC básica y segura
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!email || !emailRegex.test(email)) {
        return { valid: false, error: 'Por favor ingresa un correo electrónico válido (ej: nombre@gmail.com).' };
      }

      const parts = email.split('@');
      if (parts.length !== 2) {
        return { valid: false, error: 'Formato de correo no válido.' };
      }
      const [user, domain] = parts;

      if (!user || user.length < 2) {
        return { valid: false, error: 'El nombre del correo es demasiado corto.' };
      }

      // 2. Bloquear dominios ficticios de prueba que siempre rebotan
      const bannedDummyDomains = [
        'test.com', 'example.com', 'fake.com', 'prueba.com', 'asdf.com', 
        'correo.com', 'mail.com', 'sample.com', 'testing.com', 'test.pe', 'demo.com'
      ];
      if (bannedDummyDomains.includes(domain)) {
        return { 
          valid: false, 
          error: `El dominio '@${domain}' es ficticio y no puede recibir correos. Por favor usa tu correo real (ej: Gmail, Outlook o de tu empresa).` 
        };
      }

      // 3. Bloquear correos temporales / desechables conocidos
      const disposableDomains = [
        'mailinator.com', '10minutemail.com', 'guerrillamail.com', 'tempmail.com',
        'yopmail.com', 'throwawaymail.com', 'trashmail.com', 'sharklasers.com',
        'getairmail.com', 'dispostable.com'
      ];
      if (disposableDomains.includes(domain)) {
        return {
          valid: false,
          error: 'No se permiten correos temporales o desechables. Por favor usa tu correo habitual.'
        };
      }

      // 4. Detección exhaustiva de errores tipográficos en proveedores comunes (Gmail, Hotmail, Outlook, Yahoo, iCloud)
      function getLevDistance(s1, s2) {
        const m = [];
        for (let i = 0; i <= s2.length; i++) m[i] = [i];
        for (let j = 0; j <= s1.length; j++) m[0][j] = j;
        for (let i = 1; i <= s2.length; i++) {
          for (let j = 1; j <= s1.length; j++) {
            m[i][j] = s2[i - 1] === s1[j - 1] ? m[i - 1][j - 1] : Math.min(m[i - 1][j - 1] + 1, m[i][j - 1] + 1, m[i - 1][j] + 1);
          }
        }
        return m[s2.length][s1.length];
      }

      const popularProviders = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'live.com', 'yahoo.es', 'hotmail.es'];
      
      for (const p of popularProviders) {
        if (domain === p) continue;
        
        // Verificación 1: Distancia Levenshtein <= 2 en el dominio completo
        const dist = getLevDistance(domain, p);
        if (dist <= 2) {
          return {
            valid: false,
            error: `Parece que escribiste '@${domain}'. ¿Quisiste decir '@${p}'? Corrígelo para recibir tus accesos.`
          };
        }

        // Verificación 2: Patrones fonéticos y de teclado comunes
        const dName = domain.split('.')[0];
        const dExt = domain.split('.').slice(1).join('.');
        const [pName, pExt] = p.split('.');

        if (dExt === pExt || dExt === 'co' || dExt === 'cm' || dExt === 'con' || dExt === 'comm') {
          if (pName === 'gmail' && (/^g[mna][a-z0-9]{1,4}$/i.test(dName) || dName.includes('gma') || dName.includes('gmi') || dName.includes('gml'))) {
            return { valid: false, error: `Parece que escribiste '@${domain}'. ¿Quisiste decir '@gmail.com'? Corrígelo para recibir tus accesos.` };
          }
          if (pName === 'hotmail' && (/^h[o0]t?m[a-z0-9]{1,4}$/i.test(dName) || dName.includes('hotm') || dName.includes('homail') || dName.includes('hotmai') || dName.includes('hotmial') || dName.includes('hotmil'))) {
            return { valid: false, error: `Parece que escribiste '@${domain}'. ¿Quisiste decir '@hotmail.com'? Corrígelo para recibir tus accesos.` };
          }
          if (pName === 'outlook' && (/^o[u0]tl[a-z0-9]{1,4}$/i.test(dName) || dName.includes('outl') || dName.includes('outloo') || dName.includes('outlok'))) {
            return { valid: false, error: `Parece que escribiste '@${domain}'. ¿Quisiste decir '@outlook.com'? Corrígelo para recibir tus accesos.` };
          }
          if (pName === 'yahoo' && (/^yah[a-z0-9]{1,4}$/i.test(dName) || dName.includes('yaho') || dName.includes('yahooo'))) {
            return { valid: false, error: `Parece que escribiste '@${domain}'. ¿Quisiste decir '@yahoo.com'? Corrígelo para recibir tus accesos.` };
          }
          if (pName === 'icloud' && (/^ic[a-z0-9]{1,4}$/i.test(dName) || dName.includes('iclo') || dName.includes('icou'))) {
            return { valid: false, error: `Parece que escribiste '@${domain}'. ¿Quisiste decir '@icloud.com'? Corrígelo para recibir tus accesos.` };
          }
        }
      }

      return { valid: true, email };
    }
    window.validateSafeEmail = validateSafeEmail;

    // REGISTRO con Supabase Auth
    async function handleRegisterSubmit(e) {
      if (e && e.preventDefault) e.preventDefault();
      const name  = document.getElementById('registerName') ? document.getElementById('registerName').value.trim() : '';
      const rawEmail = document.getElementById('registerEmail') ? document.getElementById('registerEmail').value : '';
      const pass  = document.getElementById('registerPassword') ? document.getElementById('registerPassword').value : '';
      const btn   = document.getElementById('registerSubmitBtn');
      const errEl = document.getElementById('registerErrorMsg');
      const okEl  = document.getElementById('registerSuccessMsg');

      if (errEl) errEl.style.display = 'none';
      if (okEl) okEl.style.display = 'none';

      if (!name) {
        if (errEl) {
          errEl.textContent = '🚨 Por favor ingresa tu nombre completo.';
          errEl.style.display = 'block';
        }
        return;
      }

      // BLINDAJE PREVIO: Validación estricta anti-errores y anti-rebotes
      const emailValidation = validateSafeEmail(rawEmail);
      if (!emailValidation.valid) {
        if (errEl) {
          errEl.textContent = '🚨 ' + emailValidation.error;
          errEl.style.display = 'block';
        }
        return;
      }
      const email = emailValidation.email;

      if (!pass || pass.length < 6) {
        if (errEl) {
          errEl.textContent = '🚨 Por favor ingresa una contraseña de al menos 6 caracteres.';
          errEl.style.display = 'block';
        }
        return;
      }

      btn.disabled = true;
      btn.textContent = '⏳ Creando cuenta...';

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
          // Si el usuario fue eliminado desde el Hub CEO (se borró de user_subscriptions, pero su correo seguía en auth.users),
          // permitir recrear la cuenta desde cero automáticamente al registrarse:
          if (/already registered/i.test(error.message || '')) {
            const signInRes = await client.auth.signInWithPassword({ email, password: pass });
            if (signInRes && !signInRes.error && signInRes.data && signInRes.data.user) {
              const rUser = signInRes.data.user;
              const uid = rUser.id;
              let wasDeletedFromHub = false;
              try {
                const { data: subRows, error: subErr } = await client
                  .from('user_subscriptions')
                  .select('user_id,status')
                  .eq('user_id', uid);
                wasDeletedFromHub = !subErr && Array.isArray(subRows) && subRows.length === 0;
              } catch (e) {
                wasDeletedFromHub = false;
              }

              if (wasDeletedFromHub) {
                // Limpiar estado financiero anterior en la nube y en caché local para iniciar 100% como usuario nuevo
                try {
                  await client.from('finanzas_state').delete().eq('id', 'state_' + uid);
                  await client.from('finanzas_state').delete().like('id', 'backup_' + uid.slice(0, 8) + '%');
                } catch (e) {}
                try {
                  localStorage.removeItem('finanzas_v50_' + uid);
                  localStorage.removeItem('finanzas_v50_' + uid + '_vault');
                  localStorage.removeItem('finanzas_setup_completed_' + uid);
                  localStorage.removeItem('finanzas_setup_completed');
                  localStorage.removeItem('finanzas_onboarding_done_' + uid);
                  localStorage.removeItem('finanzas_unsynced_dirty_' + uid);
                  localStorage.removeItem('aliviafin_custom_display_name_' + uid);
                } catch (e) {}
                try {
                  await client.auth.updateUser({ data: { full_name: name } });
                } catch (e) {}

                const freshUserObj = { ...rUser, user_metadata: { ...(rUser.user_metadata || {}), full_name: name } };
                recordUserHeartbeat(freshUserObj, true);
                try {
                  await client.from('user_subscriptions').upsert([{
                    user_id: uid,
                    email: email.toLowerCase().trim(),
                    status: 'free',
                    plan_type: 'free',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  }], { onConflict: 'user_id' });
                } catch (e) {}

                appState = getCleanUserState();
                okEl.textContent = '✅ ¡Cuenta creada! Iniciando tu espacio...';
                okEl.style.display = 'block';
                setTimeout(async () => { await onLoginSuccess(freshUserObj); }, 600);
                return;
              } else {
                // El usuario ya tenía una cuenta activa y puso su contraseña correcta
                okEl.textContent = '✅ Cuenta verificada. Iniciando tu espacio...';
                okEl.style.display = 'block';
                setTimeout(async () => { await onLoginSuccess(rUser); }, 600);
                return;
              }
            }
            errEl.textContent = '🚨 Este correo ya está registrado. Ve a "Iniciar Sesión" o usa "¿Olvidaste tu contraseña?".';
            errEl.style.display = 'block';
            return;
          }
          errEl.textContent = '🚨 ' + error.message;
          errEl.style.display = 'block';
        } else if (data.user) {
          // Registrar inmediatamente al nuevo usuario en la telemetría de Supabase y en user_subscriptions (para que aparezca al instante en el Hub Fundador CEO)
          recordUserHeartbeat({ id: data.user.id, email: email, user_metadata: { full_name: name } }, true);
          try {
            client.from('user_subscriptions').insert([{
              user_id: data.user.id,
              email: email.toLowerCase().trim(),
              status: 'free'
            }]).then(() => {}, () => {});
          } catch (e) {}

          // Disparar correo transaccional de bienvenida en segundo plano (con token de sesión y userId)
          try {
            const welcomeHeaders = { 'Content-Type': 'application/json' };
            if (data.session && data.session.access_token) {
              welcomeHeaders['Authorization'] = `Bearer ${data.session.access_token}`;
            }
            fetch('/api/send-welcome', {
              method: 'POST',
              headers: welcomeHeaders,
              body: JSON.stringify({ email, name, userId: data.user.id })
            }).catch(e => console.warn('Aviso envío bienvenida:', e));
          } catch (e) {}

          if (data.session) {
            // Login automático exitoso (sin confirmación de correo)
            okEl.textContent = '✅ ¡Cuenta creada! Iniciando tu espacio...';
            okEl.style.display = 'block';
            setTimeout(async () => { await onLoginSuccess(data.user); }, 800);
          } else {
            // Confirmación requerida en Supabase
            okEl.textContent = '📧 ¡Casi listo! Revisa tu bandeja de entrada o SPAM. Te hemos enviado un link para activar tu cuenta de AliviaFin.';
            okEl.style.display = 'block';
          }
        }
      } catch (err) {
        console.error('Error durante el registro:', err);
        btn.disabled = false;
        btn.textContent = '🚀 Crear Mi Cuenta';
        errEl.textContent = '🚨 ' + (err.message || 'Error de conexión. Inténtalo de nuevo.');
        errEl.style.display = 'block';
      }
    }

    function onRegisterEmailBlur() {
      const emailInput = document.getElementById('registerEmail');
      const errEl = document.getElementById('registerErrorMsg');
      if (!emailInput) return;
      const val = emailInput.value.trim();
      if (!val || !val.includes('@')) return;
      const check = validateSafeEmail(val);
      if (!check.valid) {
        if (errEl) {
          errEl.textContent = '🚨 ' + check.error;
          errEl.style.display = 'block';
        }
      } else {
        if (errEl && errEl.textContent.includes('¿Quisiste decir')) {
          errEl.style.display = 'none';
        }
      }
    }
    window.onRegisterEmailBlur = onRegisterEmailBlur;

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
      const rawEmail = document.getElementById('forgotPasswordEmail').value;
      const btn = document.getElementById('forgotPasswordBtn');
      const errEl = document.getElementById('forgotPassErrorMsg');
      const okEl = document.getElementById('forgotPassSuccessMsg');

      errEl.style.display = 'none';
      okEl.style.display = 'none';

      // BLINDAJE PREVIO: Validación estricta anti-errores y anti-rebotes
      const emailValidation = validateSafeEmail(rawEmail);
      if (!emailValidation.valid) {
        errEl.textContent = '🚨 ' + emailValidation.error;
        errEl.style.display = 'block';
        return;
      }
      const email = emailValidation.email;

      btn.disabled = true;
      btn.textContent = '⏳ Enviando enlace...';

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
      hideLoginScreen();
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

    function prefillRegisterFromLogin() {
      const loginEm = document.getElementById('loginEmail')?.value || '';
      const loginPw = document.getElementById('loginPassword')?.value || '';
      switchAuthTab('register');
      const regEm = document.getElementById('registerEmail');
      const regPw = document.getElementById('registerPassword');
      const regNm = document.getElementById('registerName');
      if (regEm && loginEm) regEm.value = loginEm;
      if (regPw && loginPw) regPw.value = loginPw;
      if (regNm) regNm.focus();
    }
    window.prefillRegisterFromLogin = prefillRegisterFromLogin;

    // AUTH SOCIAL (GOOGLE / MICROSOFT) CON PROTECCIÓN ANTI-BLOQUEO WEBVIEW TIKTOK/INSTAGRAM
    async function handleOAuthLogin(provider) {
      try {
        const inApp = getSocialInAppBrowserInfo();
        if (inApp && inApp.isInApp) {
          switchAuthTab('register');
          const regName = document.getElementById('registerName');
          if (regName) setTimeout(() => regName.focus(), 120);
          await uiAlert(`📱 Estás dentro de la app de ${inApp.app}, donde Google bloquea su botón por seguridad.\n\nTienes 2 opciones inmediatas:\n1️⃣ Crea tu cuenta aquí mismo en 3 segundos ingresando tu nombre, correo y clave.\n2️⃣ O toca los tres puntos (⋯) arriba a la derecha y elige "Abrir en el navegador" (Safari / Chrome) para usar Google.`);
          return;
        }
        const client = getSupabaseClient();
        if (!client) {
          uiAlert('🚨 El motor de autenticación se está conectando. Por favor reintenta en un momento.');
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
            uiAlert(`ℹ️ El acceso con ${providerName} aún no ha sido activado en tu panel de Supabase. Puedes ingresar mientras tanto con tu correo y contraseña habitual.`);
          } else {
            uiAlert('🚨 ' + error.message);
          }
        }
      } catch (err) {
        uiAlert('🚨 ' + (err.message || err));
      }
    }

    // LOGOUT
    async function handleLogout() {
      if (!await uiConfirm('¿Deseas cerrar tu sesión?')) return;
      const keyToRemove = getStorageKey();
      const uidToRemove = currentUser ? currentUser.id : null;
      // Seguridad: asegurar que cualquier cambio reciente (conciliación, gastos, etc.) se guarde en la nube antes de salir
      if (currentUser && typeof flushSyncToServer === 'function') {
        try {
          updateSyncIndicator('syncing', '⏳ Guardando cambios antes de salir...');
          await flushSyncToServer();
        } catch (e) {
          console.warn('Error al vaciar sync en logout:', e);
        }
      }
      try { sessionStorage.clear(); } catch(e) {}
      try {
        if (realtimeChannel && supabaseClient) {
          supabaseClient.removeChannel(realtimeChannel);
          realtimeChannel = null;
        }
      } catch(e) {}
      try {
        const client = getSupabaseClient();
        if (client) await client.auth.signOut();
      } catch(e) {}
      // Limpiar punteros globales de sesión al salir, pero CONSERVAR finanzas_v50_<uid> (aislado por UUID)
      // como respaldo local seguro para evitar arrancar con estado vacío al volver a iniciar sesión
      try {
        localStorage.removeItem('aliviafin_custom_display_name');
        localStorage.removeItem('aliviafin_user_avatar');
        localStorage.removeItem('aliviafin_debt_snowball');
        localStorage.removeItem('finanzas_setup_completed');
        localStorage.removeItem('aliviafin_cached_master_subs');
      } catch(e) {}
      currentUser = null;
      window.currentUser = null;
      window._serverStateLoaded = false;
      window._currentUserSubscriptionStatus = 'free';
      window._currentUserSubscriptionExpiresAt = null;
      currentSnowballDebts = [];
      updateAllProBadgesAndBanners();
      appState = getCleanUserState();
      syncAdminUI();
      closeModal('onboardingWizardModal');
      showLoginScreen();
      document.getElementById('appMainWrapper').style.display = 'none';
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

      const profileNameText = document.getElementById('settingsProfileNameText');
      if (profileNameText) {
        profileNameText.textContent = (currentUser && currentUser.name) ? currentUser.name : 'Usuario';
      }
      try { initUserAvatar(); } catch (e) { console.warn('initUserAvatar err:', e); }

      if (typeof syncVersionUI === 'function') syncVersionUI();
      openModalById('settingsModal');
    }

    function initUserAvatar() {
      const userKey = (currentUser && currentUser.id) ? currentUser.id : 'default';
      let avatar = localStorage.getItem('aliviafin_user_avatar_' + userKey);

      // 1. Si appState ya tiene avatar de la nube (ej: en celular), sincronizar a localStorage
      if (appState && appState.userAvatar) {
        avatar = appState.userAvatar;
        localStorage.setItem('aliviafin_user_avatar_' + userKey, avatar);
        localStorage.setItem('aliviafin_user_avatar', avatar);
      } else if (avatar && avatar !== '👤') {
        // 2. Si la PC ya tenía el avatar guardado en localStorage para este usuario,
        // subirlo a appState SOLO cuando ya cargó el estado real del servidor (nunca antes para no estampar _lastSaved en un estado vacío)
        if (appState) {
          appState.userAvatar = avatar;
          if (window._serverStateLoaded === true && typeof syncStateToServer === 'function') {
            syncStateToServer();
          }
        }
      }

      applyUserAvatar(avatar || '👤');
      if (typeof renderHomeGreeting === 'function') {
        try { renderHomeGreeting(); } catch (e) {}
      }
    }

    function applyUserAvatar(avatar) {
      const isImg = avatar && (avatar.startsWith('data:image/') || avatar.startsWith('https://') || avatar.startsWith('/'));
      const safeSrc = isImg ? escapeHtml(avatar) : '';
      const safeEmoji = escapeHtml(avatar || '👤');

      // 1. Modal de Ajustes
      const settingsDisplay = document.getElementById('settingsAvatarDisplay');
      if (settingsDisplay) {
        if (isImg) {
          settingsDisplay.innerHTML = `<img src="${safeSrc}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;" alt="Foto">`;
        } else {
          settingsDisplay.innerHTML = `<span style="font-size: 28px;">${safeEmoji}</span>`;
        }
      }

      // 2. Sidebar Desktop (Abajo a la izquierda, 38px)
      const deskAvatar = document.getElementById('deskSidebarAvatar');
      if (deskAvatar) {
        if (isImg) {
          deskAvatar.innerHTML = `<img src="${safeSrc}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;" alt="Foto">`;
        } else {
          deskAvatar.innerHTML = `<span style="font-size: 19px;">${safeEmoji}</span>`;
        }
      }

      // 3. Barra de navegación inferior móvil (Icono de Ajustes dinámico)
      const mobileNavAvatar = document.getElementById('mobileNavAvatarWrap');
      if (mobileNavAvatar) {
        if (isImg) {
          mobileNavAvatar.innerHTML = `<img src="${safeSrc}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--border);" alt="Perfil">`;
        } else if (avatar && avatar !== '👤' && avatar !== '⚙️') {
          mobileNavAvatar.innerHTML = `<span style="font-size: 17px; line-height: 1;">${safeEmoji}</span>`;
        } else {
          mobileNavAvatar.innerHTML = `<span class="nav-icon" style="font-size: 18px;">⚙️</span>`;
        }
      }

      // 4. Banner Ejecutivo de Bienvenida en Pantalla Principal (Inicio)
      const homeGreetingAvatar = document.getElementById('homeGreetingAvatar');
      if (homeGreetingAvatar) {
        if (isImg) {
          homeGreetingAvatar.innerHTML = `<img src="${safeSrc}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;" alt="Foto">`;
        } else {
          homeGreetingAvatar.innerHTML = `<span style="font-size: 22px;">${safeEmoji}</span>`;
        }
      }
    }

    function handleUserAvatarUpload(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        showToast('La imagen debe pesar menos de 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = function(e) {
        const rawData = e.target.result;
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          canvas.width = 140;
          canvas.height = 140;
          const ctx = canvas.getContext('2d');
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 140, 140);
          const optimizedData = canvas.toDataURL('image/jpeg', 0.78);

          const userKey = (currentUser && currentUser.id) ? currentUser.id : 'default';
          localStorage.setItem('aliviafin_user_avatar_' + userKey, optimizedData);
          localStorage.setItem('aliviafin_user_avatar', optimizedData);

          // Guardar en el estado global para sincronización automática en Supabase
          if (appState) {
            appState.userAvatar = optimizedData;
            markLocalMutationDirty();
            saveLocalState();
            if (typeof syncStateToServer === 'function') {
              syncStateToServer();
            }
          }

          applyUserAvatar(optimizedData);
          showToast('✅ Foto de perfil guardada y sincronizada en la nube', 'success');
        };
        img.src = rawData;
      };
      reader.readAsDataURL(file);
    }

    function setUserAvatarEmoji(emoji) {
      const userKey = (currentUser && currentUser.id) ? currentUser.id : 'default';
      localStorage.setItem('aliviafin_user_avatar_' + userKey, emoji);
      localStorage.setItem('aliviafin_user_avatar', emoji);

      if (appState) {
        appState.userAvatar = emoji;
        markLocalMutationDirty();
        saveLocalState();
        if (typeof syncStateToServer === 'function') {
          syncStateToServer();
        }
      }

      applyUserAvatar(emoji);
      showToast(`✅ Avatar actualizado a ${emoji}`, 'success');
    }

    function removeUserAvatar() {
      const userKey = (currentUser && currentUser.id) ? currentUser.id : 'default';
      localStorage.removeItem('aliviafin_user_avatar_' + userKey);
      localStorage.removeItem('aliviafin_user_avatar');

      if (appState) {
        appState.userAvatar = null;
        markLocalMutationDirty();
        saveLocalState();
        if (typeof syncStateToServer === 'function') {
          syncStateToServer();
        }
      }

      applyUserAvatar('👤');
      showToast('Avatar restablecido a predeterminado', 'info');
    }

    function renderHomeGreeting() {
      const greetingTimeEl = document.getElementById('homeGreetingTimeText');
      const greetingNameEl = document.getElementById('homeGreetingUserName');
      const greetingBadgeEl = document.getElementById('homeGreetingBadge');

      const hour = new Date().getHours();
      let saludo = 'Hola de nuevo';
      if (hour >= 5 && hour < 12) saludo = 'Buenos días';
      else if (hour >= 12 && hour < 19) saludo = 'Buenas tardes';
      else saludo = 'Buenas noches';

      if (greetingTimeEl) greetingTimeEl.textContent = `${saludo} 👋`;

      const displayName = (currentUser && currentUser.name)
        ? currentUser.name
        : (localStorage.getItem('aliviafin_custom_display_name') || 'Usuario');
      if (greetingNameEl) greetingNameEl.textContent = displayName;

      if (greetingBadgeEl) {
        const subDetails = (typeof getSubscriptionDetails === 'function') ? getSubscriptionDetails() : { isPro: false, status: 'free' };
        if (isAdminCesar()) {
          greetingBadgeEl.className = 'badge-pro-gold';
          greetingBadgeEl.style.display = 'inline-flex';
          greetingBadgeEl.textContent = '👑 Fundador CEO';
        } else if (subDetails.isPro) {
          greetingBadgeEl.className = 'badge-pro-gold';
          greetingBadgeEl.style.display = 'inline-flex';
          greetingBadgeEl.textContent = '👑 PRO';
        } else if (subDetails.status === 'expired') {
          greetingBadgeEl.className = 'badge-plan-free';
          greetingBadgeEl.style.display = 'inline-flex';
          greetingBadgeEl.textContent = '🔴 PRO Vencido';
        } else {
          greetingBadgeEl.className = 'badge-plan-free';
          greetingBadgeEl.style.display = 'inline-flex';
          greetingBadgeEl.textContent = 'Plan Free';
        }
      }
    }

    function exportCompleteDatabaseJSON() {
      if (!isAdminCesar()) {
        showToast('Acceso restringido al administrador', 'error');
        return;
      }
      try {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `AliviaFin_Respaldo_Completo_${new Date().toISOString().slice(0,10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('🛡️ Copia de seguridad JSON descargada', 'success');
      } catch (e) {
        showToast('Error al exportar respaldo JSON', 'error');
      }
    }

    window.initUserAvatar = initUserAvatar;
    window.handleUserAvatarUpload = handleUserAvatarUpload;
    window.setUserAvatarEmoji = setUserAvatarEmoji;
    window.removeUserAvatar = removeUserAvatar;
    window.renderHomeGreeting = renderHomeGreeting;
    window.exportCompleteDatabaseJSON = exportCompleteDatabaseJSON;

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
        const profileNameText = document.getElementById('settingsProfileNameText');
        if (profileNameText) profileNameText.textContent = newName;
        const homeGreetingName = document.getElementById('homeGreetingUserName');
        if (homeGreetingName) homeGreetingName.textContent = newName;

        if (appState) {
          appState.customUserName = newName;
          saveLocalState();
          if (typeof syncStateToServer === 'function') syncStateToServer();
        }

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
      const btnChart = document.getElementById('segBtnChart');
      const btnCuotas = document.getElementById('segBtnCuotas');
      if (btnChart) btnChart.className = 'segmented-btn ' + (type === 'chart' ? 'active' : '');
      if (btnCuotas) btnCuotas.className = 'segmented-btn ' + (type === 'cuotas' ? 'active' : '');

      const boxChart = document.getElementById('segmentChartBox');
      const boxCuotas = document.getElementById('segmentCuotasBox');
      if (boxChart) boxChart.style.display = type === 'chart' ? 'block' : 'none';
      if (boxCuotas) boxCuotas.style.display = type === 'cuotas' ? 'block' : 'none';
    }

    function switchAdvisorView(view) {
      if (view === 'asesor' || view === 'consejos') {
        switchTab('consejos');
      } else if (view === 'deudas' || view === 'snowball') {
        switchTab('deudas');
      }
    }
    window.switchAdvisorView = switchAdvisorView;

    function syncAdvisorSegmentedNav(currentTabId) {
      const isAdvisor = currentTabId === 'consejos';
      const isDeudas = currentTabId === 'deudas';
      document.querySelectorAll('.advisor-subtab-pill-asesor').forEach(el => {
        el.classList.toggle('active', isAdvisor);
      });
      document.querySelectorAll('.advisor-subtab-pill-deudas').forEach(el => {
        el.classList.toggle('active', isDeudas);
      });
    }
    window.syncAdvisorSegmentedNav = syncAdvisorSegmentedNav;

    // Registrar Service Worker (Network-First, con auto-detección de nueva versión en vivo sin bucles)
    function dismissLiveUpdateBanner(verKey) {
      try {
        if (verKey) sessionStorage.setItem('aliviafin_update_handled_' + verKey, '1');
      } catch (e) {}
      const b = document.getElementById('aliviafinLiveUpdateBanner');
      if (b) b.remove();
    }
    window.dismissLiveUpdateBanner = dismissLiveUpdateBanner;

    function showUpdateAvailableBanner(remoteVer) {
      if (document.getElementById('aliviafinLiveUpdateBanner')) return;
      const verKey = remoteVer || APP_VERSION;
      try {
        if (sessionStorage.getItem('aliviafin_update_handled_' + verKey) === '1') return;
      } catch (e) {}

      const loginModal = document.getElementById('loginModalScreen');
      const isAtLogin = loginModal && loginModal.style.display !== 'none' && !loginModal.classList.contains('hidden');
      if (isAtLogin) {
        // Jamás interrumpir ni recargar en bucle cuando un usuario está iniciando sesión o creando su cuenta
        return;
      }
      const banner = document.createElement('div');
      banner.id = 'aliviafinLiveUpdateBanner';
      banner.style.cssText = 'position:fixed;top:calc(env(safe-area-inset-top, 12px) + 12px);left:50%;transform:translateX(-50%);z-index:99999;background:rgba(15,23,42,0.96);color:#fff;padding:8px 10px 8px 16px;border-radius:999px;box-shadow:0 12px 32px rgba(0,0,0,0.28),0 0 0 1px rgba(16,185,129,0.45);backdrop-filter:blur(16px);display:flex;align-items:center;gap:10px;font-size:12px;font-weight:700;max-width:calc(100vw - 20px);white-space:nowrap;';
      banner.innerHTML = '<span style="overflow:hidden;text-overflow:ellipsis;">✨ Nueva versión <b>' + verKey + '</b></span>' +
        '<button type="button" onclick="dismissLiveUpdateBanner(\'' + verKey + '\'); forceAppRefresh();" style="background:#10b981;color:#fff;border:none;border-radius:999px;padding:6px 12px;font-size:11.5px;font-weight:800;cursor:pointer;min-height:30px;flex-shrink:0;">Actualizar</button>' +
        '<button type="button" onclick="dismissLiveUpdateBanner(\'' + verKey + '\')" aria-label="Cerrar" style="background:rgba(255,255,255,0.16);color:#ffffff;border:none;width:28px;height:28px;border-radius:50%;font-size:13px;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">✕</button>';
      document.body.appendChild(banner);
    }

    async function checkLiveAppVersion() {
      try {
        if (!navigator.onLine) return;
        const res = await fetch('./sw.js?_t=' + Date.now() + '&_r=' + Math.random().toString(36).substring(2, 7), {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache, no-store' }
        });
        if (!res.ok) return;
        const text = await res.text();
        const m = text.match(/Service Worker\s+(v\d+\.\d+)/i);
        if (m && m[1] && m[1] !== APP_VERSION) {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then(reg => {
              if (reg) {
                reg.update();
                if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
              }
            }).catch(() => {});
          }
          showUpdateAvailableBanner(m[1]);
        }
      } catch (_) {}
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        let isRefreshing = false;
        const hadController = !!navigator.serviceWorker.controller;
        navigator.serviceWorker.register('./sw.js?v=' + APP_VERSION)
          .then(reg => {
            console.log('SW ' + APP_VERSION + ' registrado:', reg.scope);
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

        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!isRefreshing && hadController) {
            isRefreshing = true;
            window.location.reload();
          }
        });

        setTimeout(checkLiveAppVersion, 2500);
      });

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          navigator.serviceWorker.getRegistration().then(reg => { if (reg) reg.update(); }).catch(() => {});
          checkLiveAppVersion();
        }
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

    function showOfflineBanner(show) {
      const banner = document.getElementById('offlineSyncBanner');
      if (banner) banner.style.display = show ? 'flex' : 'none';
    }
    window.showOfflineBanner = showOfflineBanner;

    async function retrySyncNow() {
      const btn = document.querySelector('.offline-banner-retry-btn');
      if (btn) btn.textContent = '⏳ Conectando...';
      updateSyncIndicator('syncing', '⏳ Reconectando...');
      try {
        await syncStateToServer();
        await loadStateFromServer(1);
        showToast('🟢 Conexión reestablecida con la nube', 'success');
        showOfflineBanner(false);
      } catch (e) {
        showToast('⚠️ Aún sin señal. Seguimos operando en Modo Local', 'warning');
        updateSyncIndicator('error', '🔴 Offline (Modo Local)');
        showOfflineBanner(true);
      } finally {
        if (btn) btn.textContent = '🔄 Reintentar';
      }
    }
    window.retrySyncNow = retrySyncNow;

    function updateSyncIndicator(status, text) {
      const dot = document.getElementById('syncDot');
      const txt = document.getElementById('syncText');
      if (dot && txt) {
        txt.textContent = text;
        if (status === 'synced') {
          showOfflineBanner(false);
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
        } else if (status === 'error') {
          dot.className = 'sync-status-dot';
          dot.style.background = '#ef4444';
          showOfflineBanner(true);
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
    // --- Control de escrituras propias y reintentos (v76.6) ---
    // myWrittenTimestamps: marcas _lastSaved que ESTE dispositivo envió; sirve para
    // reconocer el "eco" realtime de nuestras propias escrituras y evitar bucles de guardado.
    // lastAckedWriteTs: última marca confirmada por el servidor; si el estado local es más
    // nuevo, hay cambios sin sincronizar (p. ej. hechos sin conexión) que deben subirse.
    const myWrittenTimestamps = new Set();
    let lastAckedWriteTs = 0;
    let syncRetryCount = 0;
    let syncRetryTimer = null;

    function rememberOwnWrite(ts) {
      myWrittenTimestamps.add(ts);
      if (myWrittenTimestamps.size > 40) {
        myWrittenTimestamps.delete(myWrittenTimestamps.values().next().value);
      }
    }

    function scheduleSyncRetry() {
      if (syncRetryTimer || syncRetryCount >= 3) return;
      const delay = [3000, 8000, 20000][syncRetryCount++];
      syncRetryTimer = setTimeout(() => {
        syncRetryTimer = null;
        if (navigator.onLine !== false) syncStateToServer();
      }, delay);
    }

    function getDirtyFlagKey() {
      const uid = (currentUser && currentUser.id) ? currentUser.id : 'guest';
      return 'finanzas_unsynced_dirty_' + uid;
    }

    function markLocalMutationDirty() {
      const now = Date.now();
      if (appState) appState._lastSaved = now;
      window._hasUnsyncedLocalMutations = true;
      syncPending = true;
      try {
        localStorage.setItem(getDirtyFlagKey(), String(now));
      } catch (_) {}
    }

    function clearLocalMutationDirty() {
      window._hasUnsyncedLocalMutations = false;
      try {
        localStorage.removeItem(getDirtyFlagKey());
      } catch (_) {}
    }

    function hasUnsyncedLocalMutations() {
      if (window._hasUnsyncedLocalMutations === true) return true;
      try {
        return !!localStorage.getItem(getDirtyFlagKey());
      } catch (_) {
        return false;
      }
    }

    function recordDeletedIds(ids) {
      if (!appState) return;
      if (!Array.isArray(appState._deletedIds)) appState._deletedIds = [];
      const list = Array.isArray(ids) ? ids : [ids];
      list.forEach(id => {
        if (id && !appState._deletedIds.includes(id)) {
          appState._deletedIds.push(id);
        }
      });
      if (appState._deletedIds.length > 300) {
        appState._deletedIds = appState._deletedIds.slice(-300);
      }
    }

    // Fusión no destructiva cuando un dispositivo hizo cambios genuinamente offline
    // mientras otro dispositivo también guardó en la nube (respeta _deletedIds para jamás revivir borrados).
    function mergeOfflineWithRemoteState(localState, remoteState) {
      if (!localState || !remoteState) return remoteState || localState;
      const merged = JSON.parse(JSON.stringify(remoteState));
      const localWins = Number(localState._lastSaved || 0) >= Number(remoteState._lastSaved || 0);
      const deletedSet = new Set([
        ...(Array.isArray(localState._deletedIds) ? localState._deletedIds : []),
        ...(Array.isArray(remoteState._deletedIds) ? remoteState._deletedIds : [])
      ]);
      merged._deletedIds = Array.from(deletedSet).slice(-300);

      if (localWins) {
        ['salary', 'currency', 'initialBalance', 'customUserName', 'userAvatar', 'onboardingCompleted'].forEach(field => {
          if (localState[field] !== undefined) merged[field] = localState[field];
        });
      }

      if (!merged.transactions) merged.transactions = {};
      if (localState.transactions && typeof localState.transactions === 'object') {
        Object.keys(localState.transactions).forEach(month => {
          const localList = Array.isArray(localState.transactions[month]) ? localState.transactions[month] : [];
          if (!Array.isArray(merged.transactions[month])) merged.transactions[month] = [];
          merged.transactions[month] = merged.transactions[month].filter(rtx => rtx && (!rtx.id || !deletedSet.has(rtx.id)));
          const remoteList = merged.transactions[month];
          const remoteById = new Map(remoteList.filter(t => t && t.id).map(t => [t.id, t]));
          localList.forEach(ltx => {
            if (!ltx || (ltx.id && deletedSet.has(ltx.id))) return;
            if (ltx.id && remoteById.has(ltx.id)) {
              if (localWins) Object.assign(remoteById.get(ltx.id), ltx);
            } else if (ltx.id) {
              const dup = remoteList.some(rtx =>
                rtx &&
                String(rtx.name || '').trim() === String(ltx.name || '').trim() &&
                Math.abs(Number(rtx.amount || 0) - Number(ltx.amount || 0)) < 0.01 &&
                String(rtx.date || rtx.dueDate || '') === String(ltx.date || ltx.dueDate || '')
              );
              if (!dup) {
                remoteList.push(ltx);
                remoteById.set(ltx.id, ltx);
              }
            }
          });
        });
      }
      if (!merged.incomes) merged.incomes = {};
      if (localState.incomes && typeof localState.incomes === 'object') {
        Object.keys(localState.incomes).forEach(month => {
          const localInc = Array.isArray(localState.incomes[month]) ? localState.incomes[month] : [];
          if (!Array.isArray(merged.incomes[month])) merged.incomes[month] = [];
          merged.incomes[month] = merged.incomes[month].filter(r => r && (!r.id || !deletedSet.has(r.id)));
          const remoteInc = merged.incomes[month];
          const remoteIncById = new Map(remoteInc.filter(i => i && i.id).map(i => [i.id, i]));
          localInc.forEach(linc => {
            if (!linc || (linc.id && deletedSet.has(linc.id))) return;
            if (linc.id && remoteIncById.has(linc.id)) {
              if (localWins) Object.assign(remoteIncById.get(linc.id), linc);
            } else if (linc.id) {
              remoteInc.push(linc);
              remoteIncById.set(linc.id, linc);
            }
          });
        });
      }
      if (Array.isArray(merged.loans)) {
        merged.loans = merged.loans.filter(l => l && (!l.id || !deletedSet.has(l.id)));
      }
      if (Array.isArray(localState.loans) && localState.loans.length > 0) {
        if (!Array.isArray(merged.loans)) merged.loans = [];
        const rLoanById = new Map(merged.loans.filter(l => l && l.id).map(l => [l.id, l]));
        localState.loans.forEach(ll => {
          if (!ll || !ll.id || deletedSet.has(ll.id)) return;
          if (rLoanById.has(ll.id)) {
            if (localWins) Object.assign(rLoanById.get(ll.id), ll);
          } else {
            merged.loans.push(ll);
            rLoanById.set(ll.id, ll);
          }
        });
      }
      if (Array.isArray(merged.savingsGoals)) {
        merged.savingsGoals = merged.savingsGoals.filter(g => g && (!g.id || !deletedSet.has(g.id)));
      }
      if (Array.isArray(localState.savingsGoals) && localState.savingsGoals.length > 0) {
        if (!Array.isArray(merged.savingsGoals)) merged.savingsGoals = [];
        const rGoalById = new Map(merged.savingsGoals.filter(g => g && g.id).map(g => [g.id, g]));
        localState.savingsGoals.forEach(lg => {
          if (!lg || !lg.id || deletedSet.has(lg.id)) return;
          if (rGoalById.has(lg.id)) {
            if (localWins) Object.assign(rGoalById.get(lg.id), lg);
          } else {
            merged.savingsGoals.push(lg);
            rGoalById.set(lg.id, lg);
          }
        });
      }
      merged._lastSaved = Math.max(localState._lastSaved || 0, remoteState._lastSaved || 0, Date.now());
      merged._needsImmediateCloudSync = true;
      return merged;
    }

    function pushLocalIfUnsynced(localTs, remoteTs) {
      if (hasUnsyncedLocalMutations() && localTs > remoteTs && localTs > lastAckedWriteTs) {
        syncStateToServer();
      } else {
        updateSyncIndicator('synced', '🟢 En Vivo');
      }
    }

    function countTotalTransactions(state) {
      if (!state || !state.transactions || typeof state.transactions !== 'object') return 0;
      return Object.values(state.transactions).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
    }

    function countUserFinancialRecords(state) {
      if (!state || typeof state !== 'object') return 0;
      let total = countTotalTransactions(state);
      if (Array.isArray(state.savingsGoals)) total += state.savingsGoals.length;
      if (Array.isArray(state.loans)) total += state.loans.length;
      if (state.incomes && typeof state.incomes === 'object') {
        total += Object.values(state.incomes).reduce((s, list) => s + (Array.isArray(list) ? list.length : 0), 0);
      }
      return total;
    }

    function applyRemoteState(remoteData, forceRestore = false) {
      if (!remoteData || !remoteData.transactions) return;

      const remoteTs = remoteData._lastSaved || 0;
      const localTs  = appState._lastSaved  || 0;
      const remoteTxCount = countTotalTransactions(remoteData);
      const localTxCount  = countTotalTransactions(appState);
      const remoteRecordCount = countUserFinancialRecords(remoteData);
      const localRecordCount  = countUserFinancialRecords(appState);

      if (remoteTxCount > 0) {
        window._knownServerTxCount = Math.max(window._knownServerTxCount || 0, remoteTxCount);
      }
      if (remoteData._versionEpoch && remoteData._versionEpoch > APP_VERSION_EPOCH) {
        window._remoteHasNewerVersionEpoch = true;
        checkLiveAppVersion();
      }

      // REGLA DE ORO MULTI-DISPOSITIVO (iPhone, Android, Mac, Windows):
      // Un dispositivo que simplemente se abre o despierta SIN cambios locales pendientes de subir
      // (!hasUnsyncedLocalMutations()) JAMÁS puede rechazar ni sobrescribir el estado de la nube.
      const hasUnsyncedDirty = hasUnsyncedLocalMutations();
      const mustApplyRemote = forceRestore ||
                              !hasUnsyncedDirty ||
                              (localRecordCount === 0 && remoteRecordCount > 0) ||
                              (isAdminCesar() && localTxCount < 50 && remoteTxCount >= 50);

      // Eco de nuestra propia escritura: el estado local ya lo contiene
      if (!forceRestore && remoteTs && myWrittenTimestamps.has(remoteTs)) {
        updateSyncIndicator('synced', '🟢 En Vivo');
        return;
      }

      // PROTECCIÓN: jamás permitir que un estado remoto vacío pise un estado local con registros financieros reales
      if (remoteRecordCount === 0 && localRecordCount > 0) {
        if (hasUnsyncedDirty) pushLocalIfUnsynced(localTs, remoteTs);
        return;
      }

      // Si este dispositivo realmente hizo ediciones offline aún no sincronizadas (hasUnsyncedDirty === true)
      // y el servidor también tiene historial válido, fusionar de forma no destructiva para no perder nada de ninguno.
      if (!mustApplyRemote && hasUnsyncedDirty && localRecordCount > 0 && remoteRecordCount > 0) {
        remoteData = mergeOfflineWithRemoteState(appState, remoteData);
      }

      const newHash = String(remoteData._lastSaved || 0) +
                      String(remoteData.initialBalance || 0) +
                      String(remoteData.customUserName || '') +
                      String(remoteData.userAvatar || '') +
                      JSON.stringify(remoteData.transactions) +
                      JSON.stringify(remoteData.savingsGoals) +
                      JSON.stringify(remoteData.extraIncomes) +
                      JSON.stringify(remoteData.incomes) +
                      remoteData.salary +
                      JSON.stringify(remoteData.recurringDueDates);

      if (!mustApplyRemote && newHash === lastKnownServerDataHash) {
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

      if (userHasExistingFinancialData(appState)) {
        appState.onboardingCompleted = true;
        const uKey = currentUser ? currentUser.id : 'guest';
        localStorage.setItem('finanzas_setup_completed_' + uKey, 'true');
        localStorage.setItem('finanzas_setup_completed', 'true');
        // Si el asistente estaba abierto y llegan datos reales, cerrarlo para no pisarlos
        const wz = document.getElementById('onboardingWizardModal');
        if (wz && wz.classList.contains('active')) closeModal('onboardingWizardModal');
      }

      if (remoteData.userAvatar) {
        const uKey = currentUser ? currentUser.id : 'default';
        localStorage.setItem('aliviafin_user_avatar_' + uKey, remoteData.userAvatar);
        localStorage.setItem('aliviafin_user_avatar', remoteData.userAvatar);
        applyUserAvatar(remoteData.userAvatar);
      }
      if (remoteData.customUserName) {
        const uKey = currentUser ? currentUser.id : 'default';
        localStorage.setItem('aliviafin_custom_display_name_' + uKey, remoteData.customUserName);
        localStorage.setItem('aliviafin_custom_display_name', remoteData.customUserName);
        if (currentUser) currentUser.name = remoteData.customUserName;

        const badge = document.getElementById('userBadgeText');
        if (badge) badge.textContent = remoteData.customUserName;
        const deskUser = document.getElementById('deskSidebarUser');
        if (deskUser) deskUser.textContent = remoteData.customUserName;
        const profileNameText = document.getElementById('settingsProfileNameText');
        if (profileNameText) profileNameText.textContent = remoteData.customUserName;
        const homeGreetingName = document.getElementById('homeGreetingUserName');
        if (homeGreetingName) homeGreetingName.textContent = remoteData.customUserName;
        const nameInput = document.getElementById('settingsUserNameInput');
        if (nameInput) nameInput.value = remoteData.customUserName;
      }

      saveLocalState();
      lastSuccessfulSyncTime = Date.now();
      updateSyncIndicator('synced', '🟢 En Vivo');
      renderAll();

      // RESPALDO AUTOMÁTICO DIARIO: Solo guardar si el estado remoto tiene transacciones reales (nunca pisar un respaldo con estado vacío)
      const todayStr = new Date().toISOString().split('T')[0];
      if (remoteTxCount > 0 && localStorage.getItem('last_cloud_backup_date') !== todayStr) {
        createCloudBackupAuto(remoteData, todayStr);
      }
    }

    // ================================================================
    // MIGRACIÓN DE DATOS v1 - Cancela GPS, Mantenimiento, Pasajes Cusco
    // Se aplica automáticamente cuando se carga el estado desde Supabase
    // ================================================================
    function applyDataMigrations(state) {
      if (!state || !state.transactions || countTotalTransactions(state) === 0) return state;

      const MIGRATION_KEY = 'migration_v3_fix_diners';
      if (!state[MIGRATION_KEY]) {
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

        changed = true;
        if (changed) {
          state[MIGRATION_KEY] = true;
          state._lastSaved = Date.now();
          console.log('✅ Migración v3 aplicada: Alquiler removido y Diners parchado');
        }
      }

      // Parche v4 + v5: Garantizar saldo exacto S/ 3,906.37 en Octubre 2026 sin duplicados entre dispositivos
      // (Gasto de Taxi S/ 40.00 + Ajuste Conciliación Bancaria S/ 13.30 -> Saldo exacto S/ 3,906.37)
      const MIGRATION_V4_KEY = 'migration_v4_restore_oct30_3906_37';
      const MIGRATION_V5_KEY = 'migration_v5_exact_balance_3906_37';
      if ((!state[MIGRATION_V4_KEY] || !state[MIGRATION_V5_KEY]) && state.transactions['Octubre 2026']) {
        const calcOctBalance = (st) => {
          const months = ['Agosto 2026', 'Septiembre 2026', 'Octubre 2026'];
          let acc = 0;
          for (let i = 0; i < months.length; i++) {
            const m = months[i];
            const txs = (st.transactions && st.transactions[m]) ? st.transactions[m] : [];
            const paid = Math.round((txs.filter(t => (t.status || 'Pagado') === 'Pagado').reduce((s, t) => s + (Number(t.amount) || 0), 0) + Number.EPSILON) * 100) / 100;
            const incs = (st.incomes && st.incomes[m]) ? st.incomes[m] : [];
            const rec = Math.round((incs.filter(inc => (inc.status || 'Pendiente') === 'Recibido').reduce((s, inc) => s + (Number(inc.amount) || 0), 0) + Number.EPSILON) * 100) / 100;
            acc = Math.round((acc + (rec - paid) + Number.EPSILON) * 100) / 100;
          }
          return acc;
        };

        // 1. Limpiar cualquier duplicado previo de Taxi (40) o Ajuste Conciliación Bancaria en Octubre 2026
        state.transactions['Octubre 2026'] = state.transactions['Octubre 2026'].filter(t => {
          if (!t) return false;
          if (t.id === 'Octubre 2026_taxi_oct30' || t.id === 'exp_adj_oct30_1330') return false;
          if (String(t.id || '').startsWith('exp_adj_') || /conciliac/i.test(String(t.name || ''))) return false;
          if (Math.abs(Number(t.amount || 0) - 40) < 0.01 && /tax/i.test(String(t.name || ''))) return false;
          return true;
        });
        const octList = state.transactions['Octubre 2026'];

        // 2. Insertar exactamente 1 registro de Taxi (S/ 40.00)
        octList.push({
          id: 'Octubre 2026_taxi_oct30',
          name: 'Taxi',
          amount: 40,
          category: 'Otros',
          status: 'Pagado',
          isInstallment: false,
          installmentsTotal: 1,
          installmentsCurrent: 1,
          dueDate: '30',
          date: 30
        });

        // Si en el iPhone se había registrado otro gasto de S/ 40.00 hoy (día 30) con otro nombre (p. ej. categoría rápida),
        // verificar si el saldo quedó exactamente S/ 40.00 por debajo de 3,919.67 y deduplicarlo
        let balAfterTaxi = calcOctBalance(state);
        if (Math.abs(balAfterTaxi - (3919.67 - 40)) < 0.01) {
          const dup40Idx = octList.findIndex(t =>
            t && t.id !== 'Octubre 2026_taxi_oct30' &&
            Math.abs(Number(t.amount || 0) - 40) < 0.01 &&
            (String(t.date || '').includes('30') || String(t.dueDate || '') === '30')
          );
          if (dup40Idx !== -1) {
            octList.splice(dup40Idx, 1);
            balAfterTaxi = calcOctBalance(state);
          }
        }

        // 3. Calcular el ajuste de conciliación exacto para converger a S/ 3,906.37
        const targetOctBal = 3906.37;
        const neededAdj = Math.round((balAfterTaxi - targetOctBal + Number.EPSILON) * 100) / 100;

        if (neededAdj > 0.009) {
          octList.push({
            id: 'exp_adj_oct30_1330',
            name: 'Ajuste Conciliación Bancaria',
            amount: neededAdj,
            category: 'Otros',
            status: 'Pagado',
            paymentMethod: 'Banco',
            isInstallment: false,
            installmentsTotal: 1,
            installmentsCurrent: 1,
            dueDate: '30',
            date: 30
          });
        } else if (neededAdj < -0.009) {
          if (!state.incomes) state.incomes = {};
          if (!Array.isArray(state.incomes['Octubre 2026'])) state.incomes['Octubre 2026'] = [];
          state.incomes['Octubre 2026'] = state.incomes['Octubre 2026'].filter(i => !String((i && i.id) || '').startsWith('inc_adj_oct30'));
          state.incomes['Octubre 2026'].push({
            id: 'inc_adj_oct30_exact',
            name: 'Ajuste Conciliación Bancaria',
            amount: Math.abs(neededAdj),
            status: 'Recibido',
            date: 30
          });
        }

        state[MIGRATION_V4_KEY] = true;
        state[MIGRATION_V5_KEY] = true;
        state._lastSaved = Date.now();
        state._needsImmediateCloudSync = true;
        console.log('✅ Migración v5 aplicada: Saldo Octubre 2026 consolidado en S/ 3,906.37 exactos');
      }

      return state;
    }

    // Carga inicial desde Supabase (con auto-recuperación desde respaldos si se detecta pérdida de transacciones)
    async function loadStateFromServer(retries = 3) {
      if (!currentUser) {
        window._serverStateLoaded = true;
        updateSyncIndicator('synced', '📱 Modo Local');
        return;
      }
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
            await createCloudBackupAuto(data.data, 'legacy_' + new Date().toISOString().split('T')[0]);
            appState = getCleanUserState();
            saveLocalState();
            window._serverStateLoaded = true;
            syncStateToServer();
            renderAll();
            setTimeout(() => openOnboardingWizard(false), 500);
            return;
          }

          let serverData = data.data;
          let serverTxCount = countTotalTransactions(serverData);
          const localTxCount = countTotalTransactions(appState);
          let restoredFromBackup = false;

          // ESCUDO DE AUTO-RECUPERACIÓN:
          // Si la fila principal en Supabase quedó en 0 transacciones (o incompleta en la cuenta del fundador),
          // verificar inmediatamente: 1) caché local con datos, 2) respaldos diarios backup_<id8>_% en Supabase, y 3) respaldo maestro del fundador
          if (serverTxCount === 0 || (isCesar && serverTxCount < 100)) {
            if (localTxCount > serverTxCount && (isCesar || !isLegacyClonedState(appState))) {
              console.warn('♻️ El estado local tiene más historial que la fila del servidor; conservando local.');
              serverData = { ...serverData, ...appState };
              serverTxCount = localTxCount;
              restoredFromBackup = true;
            }

            try {
              const id8 = currentUser.id.slice(0, 8);
              const { data: bks } = await supabaseClient
                .from('finanzas_state')
                .select('id,data')
                .like('id', `backup_${id8}_%`)
                .order('id', { ascending: false })
                .limit(25);
              if (Array.isArray(bks) && bks.length > 0) {
                const validBks = bks
                  .filter(b => b && b.data && countTotalTransactions(b.data) > serverTxCount && (isCesar || !isLegacyClonedState(b.data)))
                  .sort((a, b) => {
                    const txDiff = countTotalTransactions(b.data) - countTotalTransactions(a.data);
                    const tsDiff = ((b.data && b.data._lastSaved) || 0) - ((a.data && a.data._lastSaved) || 0);
                    return tsDiff !== 0 ? tsDiff : txDiff;
                  });
                if (validBks.length > 0) {
                  const bestBk = validBks[0];
                  console.warn('♻️ Restaurando historial automáticamente desde respaldo en la nube:', bestBk.id);
                  serverData = {
                    ...bestBk.data,
                    userAvatar: serverData.userAvatar || bestBk.data.userAvatar,
                    customUserName: serverData.customUserName || bestBk.data.customUserName
                  };
                  serverTxCount = countTotalTransactions(serverData);
                  restoredFromBackup = true;
                }
              }
            } catch (bkErr) {
              console.warn('Nota al consultar respaldos en la nube:', bkErr);
            }

            // Respaldo maestro adicional exclusivo para la cuenta fundadora si faltasen meses históricos
            if (isCesar && serverTxCount < 100) {
              try {
                const { data: { session: curSess } } = await supabaseClient.auth.getSession();
                const token = curSess && curSess.access_token ? curSess.access_token : '';
                if (token) {
                  const fbRes = await fetch('/api/founder-backup?_t=' + Date.now(), {
                    headers: { 'Authorization': 'Bearer ' + token }
                  });
                  if (fbRes.ok) {
                    const fbJson = await fbRes.json();
                    if (fbJson && fbJson.data && countTotalTransactions(fbJson.data) > serverTxCount) {
                      console.warn('♻️ Restaurando historial completo del fundador desde /api/founder-backup');
                      const base = fbJson.data;
                      serverData = {
                        ...base,
                        ...serverData,
                        transactions: { ...(base.transactions || {}), ...(serverTxCount > 0 ? serverData.transactions : {}) },
                        incomes: { ...(base.incomes || {}), ...(serverData.incomes || {}) },
                        savingsGoals: (serverData.savingsGoals && serverData.savingsGoals.length > 0) ? serverData.savingsGoals : (base.savingsGoals || []),
                        loans: (serverData.loans && serverData.loans.length > 0) ? serverData.loans : (base.loans || []),
                        recurringDueDates: { ...(base.recurringDueDates || {}), ...(serverData.recurringDueDates || {}) },
                        categoryBudgets: { ...(base.categoryBudgets || {}), ...(serverData.categoryBudgets || {}) },
                        userAvatar: serverData.userAvatar || base.userAvatar,
                        customUserName: serverData.customUserName || base.customUserName
                      };
                      serverTxCount = countTotalTransactions(serverData);
                      restoredFromBackup = true;
                    }
                  }
                }
              } catch (fbErr) {
                console.warn('Nota founder-backup:', fbErr);
              }
            }
          }

          if (isCesar && (!serverData.migration_v4_restore_oct30_3906_37 || !serverData.migration_v5_exact_balance_3906_37)) {
            serverData = applyDataMigrations(serverData);
            restoredFromBackup = true;
          }

          applyRemoteState(serverData, restoredFromBackup);
          window._serverStateLoaded = true;
          if (userHasExistingFinancialData(appState)) {
            appState.onboardingCompleted = true;
            const uKey = currentUser ? currentUser.id : 'guest';
            localStorage.setItem('finanzas_setup_completed_' + uKey, 'true');
            localStorage.setItem('finanzas_setup_completed', 'true');
          }
          lastSuccessfulSyncTime = Date.now();
          updateSyncIndicator('synced', '🟢 En Vivo');
          if (restoredFromBackup || appState._needsImmediateCloudSync) {
            delete appState._needsImmediateCloudSync;
            syncPending = false;
            await syncStateToServer();
            showToast('♻️ Historial completo restaurado y blindado en la nube', 'success');
          } else if (syncPending) {
            syncPending = false;
            syncStateToServer();
          }
        } else if (error && error.code === 'PGRST116') {
          // 0 filas: puede ser usuario realmente nuevo O sesión/RLS aún no lista.
          // NUNCA crear un estado vacío sin verificar antes (podría pisar datos reales).
          const { data: { session: liveSession } } = await supabaseClient.auth.getSession();
          if (!liveSession) throw new Error('Sesión aún no lista; reintentando');

          // 1) Caché local con datos reales: conservarla y subirla
          if (userHasExistingFinancialData(appState)) {
            console.warn('Servidor sin fila pero hay datos locales: se conservan y se re-suben.');
            appState.onboardingCompleted = true;
            saveLocalState();
            window._serverStateLoaded = true;
            lastSuccessfulSyncTime = Date.now();
            updateSyncIndicator('synced', '🟢 En Vivo');
            renderAll();
            syncStateToServer();
            return;
          }

          // 2) Respaldo en la nube existente: restaurar el más reciente
          try {
            const id8 = currentUser.id.slice(0, 8);
            const { data: bks } = await supabaseClient
              .from('finanzas_state')
              .select('id,data')
              .like('id', `backup_${id8}_20%`)
              .order('id', { ascending: false })
              .limit(1);
            if (bks && bks[0] && bks[0].data && userHasExistingFinancialData(bks[0].data)) {
              console.warn('Fila ausente pero existe respaldo; restaurando:', bks[0].id);
              applyRemoteState(bks[0].data);
              appState.onboardingCompleted = true;
              saveLocalState();
              window._serverStateLoaded = true;
              renderAll();
              syncStateToServer();
              showToast('♻️ Datos restaurados desde tu último respaldo en la nube', 'success');
              return;
            }
          } catch (bkErr) { console.warn('No se pudo consultar respaldos:', bkErr); }

          // 3) Usuario genuinamente nuevo
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
    // SISTEMA DE RESPALDOS EN LA NUBE (BACKUPS INSTANTÁNEOS MULTI-CAPA)
    // ================================================================
    let _lastCloudBackupWriteTs = 0;
    async function createCloudBackupAuto(dataToBackup, todayStr, forceNow = false) {
      if (!dataToBackup || (!String(todayStr).startsWith('legacy_') && countUserFinancialRecords(dataToBackup) === 0)) {
        return; // Nunca sobrescribir un respaldo diario con un estado sin registros financieros
      }
      const now = Date.now();
      if (!forceNow && now - _lastCloudBackupWriteTs < 12000 && localStorage.getItem('last_cloud_backup_date') === todayStr) {
        return;
      }
      _lastCloudBackupWriteTs = now;
      const userId = currentUser ? currentUser.id.slice(0, 8) : 'guest';
      localStorage.setItem('last_cloud_backup_date', todayStr);
      try {
        const rows = [{ id: `backup_${userId}_${todayStr}`, data: dataToBackup }];
        if (!String(todayStr).startsWith('legacy_')) {
          rows.push({ id: `backup_${userId}_latest_verified`, data: dataToBackup });
        }
        const { error } = await supabaseClient
          .from('finanzas_state')
          .upsert(rows);
        if (error) throw error;
        console.log('✅ Respaldo automático en la nube actualizado:', `backup_${userId}_${todayStr}`);
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
    let currentSyncPromise = null;

    async function syncStateToServer() {
      if (!currentUser) {
        updateSyncIndicator('synced', '📱 Modo Local');
        return;
      }

      // SEGURIDAD CRÍTICA DE RAÍZ: jamás estampar _lastSaved ni escribir al servidor antes de haber
      // confirmado la carga de los datos reales de la nube.
      if (window._serverStateLoaded !== true) {
        syncPending = true;
        console.warn('🛡️ Sync bloqueado: esperando carga confirmada del servidor');
        updateSyncIndicator('syncing', '⏳ Esperando datos de la nube...');
        return;
      }

      // ESCUDO ANTI-BORRADO ACCIDENTAL Y ANTI-CAÍDA ABRUPTA (SUDDEN-DROP SHIELD):
      // 1) Si la cuenta ya tenía historial y appState tiene 0 transacciones, bloquear subida.
      // 2) Si el conteo de transacciones cae abruptamente (> 3 menos que _knownServerTxCount) sin borrado explícito del usuario, bloquear subida.
      const currentTxCount = countTotalTransactions(appState);
      const knownTx = window._knownServerTxCount || 0;
      const allowedDrop = (window._authorizedDeleteAllowance || 0) + 3;
      if (currentTxCount === 0 && (knownTx > 0 || isAdminCesar())) {
        console.warn('🛡️ Bloqueado intento de subir estado con 0 transacciones sobre una cuenta con historial.');
        return;
      }
      if (knownTx >= 5 && currentTxCount < (knownTx - allowedDrop)) {
        console.warn('🛡️ Sudden-Drop Shield activado: bloqueada subida con caída abrupta de transacciones (' + currentTxCount + ' vs ' + knownTx + ').');
        loadStateFromServer(2);
        return;
      }
      if (window._remoteHasNewerVersionEpoch === true) {
        console.warn('🛡️ Version Epoch Shield: la nube fue actualizada por una versión más nueva; bloqueando escritura desde cliente antiguo.');
        return;
      }

      if (isSyncing) {
        syncPending = true;
        return currentSyncPromise;
      }
      isSyncing = true;
      syncPending = false;

      currentSyncPromise = (async () => {
        appState.activeCategoryChip  = currentCategoryFilter;
        appState.activeStatusFilter  = currentStatusFilter;
        appState.historyPeriodFilter = currentHistoryPeriodFilter;
        appState._versionEpoch = APP_VERSION_EPOCH;
        appState._clientVersion = APP_VERSION;
        appState._lastSaved = Date.now();
        const sentTs = appState._lastSaved;
        rememberOwnWrite(sentTs);
        saveLocalState();

        updateSyncIndicator('syncing', '⏳ Guardando...');

        try {
          const { error } = await supabaseClient
            .from('finanzas_state')
            .upsert({ id: getUserStateId(), data: appState });

          if (!error) {
            clearLocalMutationDirty();
            lastAckedWriteTs = Math.max(lastAckedWriteTs, sentTs);
            syncRetryCount = 0;
            lastSuccessfulSyncTime = Date.now();
            lastKnownServerDataHash = String(appState._lastSaved || 0) +
                                      String(appState.initialBalance || 0) +
                                      String(appState.customUserName || '') +
                                      String(appState.userAvatar || '') +
                                      JSON.stringify(appState.transactions) +
                                      JSON.stringify(appState.savingsGoals) +
                                      JSON.stringify(appState.extraIncomes) +
                                      JSON.stringify(appState.incomes) +
                                      appState.salary +
                                      JSON.stringify(appState.recurringDueDates);
            updateSyncIndicator('synced', '🟢 En Vivo');
            if (currentUser) {
              recordUserHeartbeat(currentUser);
              // Mantener también el respaldo diario en la nube actualizado en tiempo real en cada guardado válido
              if (countUserFinancialRecords(appState) > 0) {
                const todayStr = new Date().toISOString().split('T')[0];
                createCloudBackupAuto(appState, todayStr);
              }
            }
          } else {
            updateSyncIndicator('syncing', '⚠️ Reintentando...');
            scheduleSyncRetry();
          }
        } catch(e) {
          updateSyncIndicator('error', '🔴 Offline (Modo Local)');
          scheduleSyncRetry();
        } finally {
          isSyncing = false;
          if (syncPending) {
            syncPending = false;
            await syncStateToServer();
          }
        }
      })();

      return currentSyncPromise;
    }

    // Esperar de forma determinista que cualquier guardado pendiente o en vuelo termine
    async function flushSyncToServer() {
      if (isSyncing && currentSyncPromise) {
        await currentSyncPromise;
      }
      if (syncPending || (appState._lastSaved && appState._lastSaved > lastAckedWriteTs)) {
        await syncStateToServer();
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

    // Forzar reload de datos al volver al foco / desbloquear pantalla (iOS Safari PWA & Mac)
    let wakeupDebounceTimer = null;
    function handleAppWakeup() {
      if (wakeupDebounceTimer) clearTimeout(wakeupDebounceTimer);
      wakeupDebounceTimer = setTimeout(() => {
        const calMonth = getCurrentCalendarMonthName();
        const sessionOverride = sessionStorage.getItem('aliviafin_session_month');
        if (!sessionOverride && appState && appState.currentMonth !== calMonth) {
          appState.currentMonth = getEffectiveCurrentMonth(appState.currentMonth);
          ensureMonthTransactions(appState.currentMonth);
          ensureMonthIncomes(appState.currentMonth);
          renderAll();
        }
        lastKnownServerDataHash = '';
        updateSyncIndicator('syncing', '🔄 Sincronizando...');
        loadStateFromServer(3);
        if (typeof setupRealtimeSync === 'function') {
          setupRealtimeSync();
        }
      }, 60);
    }

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        handleAppWakeup();
      } else {
        // En móviles (iOS Safari / Android PWA) y escritorio: flush inmediato si hay cambios pendientes al minimizar o bloquear
        if (currentUser && typeof flushSyncToServer === 'function' && (isSyncing || syncPending || (appState && appState._lastSaved && appState._lastSaved > lastAckedWriteTs))) {
          flushSyncToServer().catch(err => console.warn('Flush en background:', err));
        }
      }
    });
    window.addEventListener('focus', () => {
      handleAppWakeup();
    });
    window.addEventListener('pageshow', () => {
      handleAppWakeup();
    });
    window.addEventListener('pagehide', () => {
      // En móviles (iOS / Android), pagehide es el evento más confiable al salir o cerrar PWA/pestaña
      if (currentUser && typeof flushSyncToServer === 'function' && (isSyncing || syncPending || (appState && appState._lastSaved && appState._lastSaved > lastAckedWriteTs))) {
        flushSyncToServer().catch(err => console.warn('Flush en pagehide:', err));
      }
    });
    // Compatibilidad Android Chrome / Samsung Internet (Page Lifecycle API)
    document.addEventListener('resume', () => {
      handleAppWakeup();
    });
    // Recuperación instantánea cuando Android o iOS recupera conexión a internet
    window.addEventListener('online', () => {
      console.log('📶 Conexión recuperada (online). Sincronizando datos...');
      handleAppWakeup();
    });

    // Advertir si el usuario intenta cerrar la ventana mientras hay una sincronización en vuelo
    window.addEventListener('beforeunload', (e) => {
      if (isSyncing || syncPending) {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    function saveLocalState() {
      const key = getStorageKey();
      const serialized = JSON.stringify(appState);
      try {
        localStorage.setItem(key, serialized);
        // BÓVEDA LOCAL INMUTABLE: si el estado tiene registros financieros reales, guardar copia espejo instantánea
        // que jamás puede ser sobrescrita por un estado vacío ante ningún evento.
        if (countUserFinancialRecords(appState) > 0) {
          localStorage.setItem(key + '_vault', serialized);
        }
      } catch(e) {
        console.warn('localStorage lleno - limpiando auditLog...');
        const backup = { ...appState, auditLog: [] };
        const compactStr = JSON.stringify(backup);
        localStorage.setItem(key, compactStr);
        if (countTotalTransactions(backup) > 0) {
          try { localStorage.setItem(key + '_vault', compactStr); } catch (_) {}
        }
      }
    }

    function loadLocalState() {
      const isCesar = isAdminCesar();
      const defaultState = getCleanUserState();
      const key = getStorageKey();

      const stored = localStorage.getItem(key);
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

      // AUTO-RECUPERACIÓN DESDE BÓVEDA LOCAL: si la clave principal quedó vacía pero la bóveda local tiene datos
      if (countUserFinancialRecords(appState) === 0) {
        try {
          const vaultRaw = localStorage.getItem(key + '_vault');
          if (vaultRaw) {
            const vaultParsed = JSON.parse(vaultRaw);
            if (vaultParsed && countUserFinancialRecords(vaultParsed) > 0 && (isCesar || !isLegacyClonedState(vaultParsed))) {
              console.warn('♻️ Restaurando caché inmediatamente desde Bóveda Local (_vault)');
              appState = vaultParsed;
            }
          }
        } catch (_) {}
      }

      if (!appState.recurringDueDates) appState.recurringDueDates = {};
      if (!appState.auditLog) appState.auditLog = [];
      appState.currentMonth = getEffectiveCurrentMonth(appState.currentMonth);
      ensureMonthTransactions(appState.currentMonth);
      ensureMonthIncomes(appState.currentMonth);
      if (!appState.extraIncomes) appState.extraIncomes = {};
      if (!appState.savingsGoals) appState.savingsGoals = [];
      if (!appState.checklists) appState.checklists = {};
      if (!appState.loans) appState.loans = [];
      if (!appState.categoryBudgets) {
        appState.categoryBudgets = {};
        const userCats = getUserDefaultCategories();
        Object.keys(userCats).forEach(k => {
          appState.categoryBudgets[k] = (userCats[k] && userCats[k].budget) ? userCats[k].budget : 1000;
        });
      }

      // IMPORTANTE ARQUITECTÓNICO: loadLocalState() es 100% de solo lectura de caché.
      // NUNCA debe ejecutar applyDataMigrations ni modificar _lastSaved antes de loadStateFromServer(),
      // para evitar que un dispositivo recién abierto parezca más reciente que la nube.

      currentCategoryFilter = appState.activeCategoryChip || 'TODAS';
      currentStatusFilter = appState.activeStatusFilter || 'TODOS';
      currentHistoryPeriodFilter = appState.historyPeriodFilter || 'ALL';
    }

    function recalculatePlanAndTips() {
      renderAll();
      showToast('✅ Plan y Superávit recalculados', 'success');
    }

    function saveState() {
      // Marcar mutación explícita del usuario para sincronización multi-dispositivo determinista
      markLocalMutationDirty();
      // Guardar localmente + en Bóveda Local de inmediato (respuesta instantánea < 1ms)
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

    // ================================================================
    // DIÁLOGOS PROPIOS (reemplazan alert / confirm / prompt nativos)
    // En iOS PWA los nativos muestran "aliviafin.vercel.app dice". Estos son
    // asíncronos (Promise), accesibles (Esc/Enter/foco) y respetan el tema.
    // El texto se inserta con textContent: no hay riesgo de XSS.
    // ================================================================
    function uiDialog({ message = '', okText = 'Aceptar', cancelText = 'Cancelar', showCancel = true, danger = false, input = null } = {}) {
      return new Promise(resolve => {
        const prevFocus = document.activeElement;
        const overlay = document.createElement('div');
        overlay.className = 'ui-dialog-overlay';
        overlay.setAttribute('role', 'alertdialog');
        overlay.setAttribute('aria-modal', 'true');

        const box = document.createElement('div');
        box.className = 'ui-dialog';
        const msg = document.createElement('div');
        msg.className = 'ui-dialog-message';
        msg.textContent = String(message);
        box.appendChild(msg);

        let field = null;
        if (input) {
          field = document.createElement('input');
          field.className = 'ui-dialog-input';
          field.type = 'text';
          field.inputMode = input.inputMode || 'text';
          field.value = input.value == null ? '' : String(input.value);
          box.appendChild(field);
        }

        const actions = document.createElement('div');
        actions.className = 'ui-dialog-actions';
        let cancelBtn = null;
        if (showCancel) {
          cancelBtn = document.createElement('button');
          cancelBtn.type = 'button';
          cancelBtn.className = 'ui-dialog-btn';
          cancelBtn.textContent = cancelText;
          actions.appendChild(cancelBtn);
        }
        const okBtn = document.createElement('button');
        okBtn.type = 'button';
        okBtn.className = 'ui-dialog-btn primary' + (danger ? ' danger' : '');
        okBtn.textContent = okText;
        actions.appendChild(okBtn);
        box.appendChild(actions);
        overlay.appendChild(box);

        let done = false;
        const onKey = (e) => {
          if (e.key === 'Escape' || e.key === 'Esc') {
            e.preventDefault(); e.stopImmediatePropagation(); finish(false);
          } else if (e.key === 'Enter') {
            e.preventDefault(); e.stopImmediatePropagation();
            finish(document.activeElement !== cancelBtn);
          }
        };
        const finish = (ok) => {
          if (done) return;
          done = true;
          document.removeEventListener('keydown', onKey, true);
          overlay.classList.add('closing');
          setTimeout(() => overlay.remove(), 160);
          if (prevFocus && typeof prevFocus.focus === 'function') {
            try { prevFocus.focus({ preventScroll: true }); } catch (e) {}
          }
          resolve(input ? (ok ? field.value : null) : ok);
        };

        okBtn.addEventListener('click', () => finish(true));
        if (cancelBtn) cancelBtn.addEventListener('click', () => finish(false));
        overlay.addEventListener('click', (e) => { if (e.target === overlay) finish(false); });
        document.addEventListener('keydown', onKey, true);
        document.body.appendChild(overlay);
        const toFocus = field || okBtn;
        toFocus.focus();
        if (field) field.select();
      });
    }

    function uiConfirm(message, opts = {}) {
      const danger = opts.danger !== undefined ? opts.danger : /elimin|borrar|purg|irreversible/i.test(String(message));
      return uiDialog({ message, okText: opts.okText || (danger ? 'Eliminar' : 'Confirmar'), danger });
    }

    function uiAlert(message, opts = {}) {
      return uiDialog({ message, showCancel: false, okText: opts.okText || 'Entendido' }).then(() => undefined);
    }

    function uiPrompt(message, defaultValue = '', opts = {}) {
      return uiDialog({ message, okText: opts.okText || 'Guardar', input: { value: defaultValue, inputMode: opts.inputMode || 'text' } });
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
      let fileInput = document.getElementById('importJsonFileInput');
      if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'importJsonFileInput';
        fileInput.accept = '.json,application/json';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', importDataJSON);
        document.body.appendChild(fileInput);
      }
      fileInput.value = '';
      fileInput.click();
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
            uiAlert('✅ ¡Estado importado con éxito!');
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
