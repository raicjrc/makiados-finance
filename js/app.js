
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

    // Helper: devuelve las categorías correctas según el usuario actual
    function getUserDefaultCategories() {
      const isCesar = currentUser && currentUser.email === 'cesar.risso.f@gmail.com';
      return isCesar ? CESAR_CATEGORIES : GENERIC_CATEGORIES;
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
    // VERSIÓN DE LA APP
    // ================================================================
    const APP_VERSION = 'v63.1';
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
        loginBtn.style.background = '#4f46e5';
        loginBtn.style.color = 'white';
        loginBtn.style.boxShadow = '0 2px 6px rgba(79,70,229,0.3)';
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

      // Listener global de cambios de autenticación (OAuth y Password Recovery)
      if (!window._hasConfiguredAuthListener) {
        window._hasConfiguredAuthListener = true;
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
          if (event === 'PASSWORD_RECOVERY') {
            openResetPasswordModal();
          } else if (event === 'SIGNED_IN' && session && session.user && !currentUser) {
            await onLoginSuccess(session.user);
          }
        });
      }

      // Soporte para depuración / vista previa local (?debug_tour=1 o ?demo=1)
      if (window.location.search.includes('debug_tour=1') || window.location.search.includes('demo=1')) {
        await onLoginSuccess({ id: 'test_user_tour', email: 'test@aliviafin.app', user_metadata: { full_name: 'Usuario Demo' } });
        if (window.location.search.includes('debug_tour=1')) {
          setTimeout(() => startInteractiveTour(), 500);
        }
        return;
      }

      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session && session.user) {
        await onLoginSuccess(session.user);
      } else {
        document.getElementById('loginModalScreen').style.display = 'flex';
        document.getElementById('appMainWrapper').style.display = 'none';
      }
    }

    // Se llama cuando el login/registro es exitoso
    async function onLoginSuccess(user) {
      // Obtener nombre del usuario desde metadata o email
      const displayName = (user.user_metadata && user.user_metadata.full_name)
        ? user.user_metadata.full_name
        : user.email.split('@')[0];

      currentUser = {
        id: user.id,
        email: user.email,
        name: displayName
      };


      const badge = document.getElementById('userBadgeText');
      if (badge) badge.textContent = displayName;

      document.getElementById('loginModalScreen').style.display = 'none';
      document.getElementById('appMainWrapper').style.display = 'block';

      // Inicializar app con datos del usuario
      loadLocalState();
      populateMonthDropdown();
      renderCategoryChips();
      renderAll();
      await loadStateFromServer(3);
      setupRealtimeSync();
      
      // Verificar suscripción de Paywall
      await verifySubscription(user);
    }

    // ================================================================
    // SISTEMA DE MONETIZACIÓN FREEMIUM (FREE VS PRO)
    // ================================================================
    function isUserPro() {
      // 1. César (admin) siempre tiene acceso Pro de por vida
      if (currentUser && currentUser.email === 'cesar.risso.f@gmail.com') return true;
      // 2. Si tiene flag 'is_pro' en metadata de Supabase
      if (currentUser && currentUser.user_metadata && currentUser.user_metadata.is_pro === true) return true;
      // 3. Si en user_subscriptions está como 'premium'
      if (window._currentUserSubscriptionStatus === 'premium') return true;
      // 4. Si tiene desbloqueo local
      if (localStorage.getItem('aliviafin_pro_unlocked') === 'true' || localStorage.getItem('finzen_pro_unlocked') === 'true') return true;
      return false;
    }

    // Helper para desbloquear Pro internamente o por consola sin ensuciar la UI
    window.aliviafinUnlockPro = window.finzenUnlockPro = function() {
      localStorage.setItem('aliviafin_pro_unlocked', 'true');
      const pb = document.getElementById('proBadge');
      if (pb) pb.style.display = 'inline-flex';
      showToast('✨ AliviaFin Pro activado con éxito', 'success');
      renderAll();
    };

    function openFinZenProModal(featureName) {
      const modal = document.getElementById('finzenProModal');
      if (modal) {
        modal.classList.add('active');
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
      }
    }

    async function verifySubscription(user) {
      window._currentUserSubscriptionStatus = 'free';

      // Administrador siempre Pro
      if (user && user.email === 'cesar.risso.f@gmail.com') {
        window._currentUserSubscriptionStatus = 'premium';
        const pb = document.getElementById('proBadge');
        if (pb) pb.style.display = 'inline-flex';
        setTimeout(() => checkOnboardingAndVersionAnnouncements(), 400);
        return;
      }

      try {
        const { data, error } = await supabaseClient
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data && data.status === 'premium') {
          window._currentUserSubscriptionStatus = 'premium';
        } else if (!data) {
          // Si el usuario no tiene fila en user_subscriptions, la inicializamos automáticamente como 'free'
          await supabaseClient
            .from('user_subscriptions')
            .insert([{
              user_id: user.id,
              email: user.email,
              status: 'free'
            }]);
        }
      } catch (err) {
        console.warn('Nota de suscripción:', err);
      }

      // Actualizar badge Pro en cabecera
      const pb = document.getElementById('proBadge');
      if (pb) {
        pb.style.display = isUserPro() ? 'inline-flex' : 'none';
      }

      // IMPORTANTE: Nunca se bloquea al usuario con paywall.
      // El usuario siempre accede a la app con su plan Free vitalicio.
      setTimeout(() => checkOnboardingAndVersionAnnouncements(), 400);
    }

    // LOGIN con Supabase Auth
    async function handleLoginSubmit(e) {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const pass  = document.getElementById('loginPassword').value;
      const btn   = document.getElementById('loginSubmitBtn');
      const errEl = document.getElementById('loginErrorMsg');

      btn.disabled = true;
      btn.textContent = '⏳ Iniciando sesión...';
      errEl.style.display = 'none';

      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password: pass });

      btn.disabled = false;
      btn.textContent = '🔓 Iniciar Sesión';

      if (error) {
        errEl.textContent = '🚨 ' + (error.message === 'Invalid login credentials'
          ? 'Correo o contraseña incorrectos.'
          : error.message);
        errEl.style.display = 'block';
      } else {
        errEl.style.display = 'none';
        await onLoginSuccess(data.user);
      }
    }

    // REGISTRO con Supabase Auth
    async function handleRegisterSubmit(e) {
      e.preventDefault();
      const name  = document.getElementById('registerName').value.trim();
      const email = document.getElementById('registerEmail').value.trim();
      const pass  = document.getElementById('registerPassword').value;
      const btn   = document.getElementById('registerSubmitBtn');
      const errEl = document.getElementById('registerErrorMsg');
      const okEl  = document.getElementById('registerSuccessMsg');

      btn.disabled = true;
      btn.textContent = '⏳ Creando cuenta...';
      errEl.style.display = 'none';
      okEl.style.display = 'none';

      const { data, error } = await supabaseClient.auth.signUp({
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
        setTimeout(async () => { await onLoginSuccess(data.user); }, 800);
      } else if (data.user && !data.session) {
        // Confirmación requerida activada por César en Supabase
        okEl.textContent = '📧 ¡Casi listo! Revisa tu bandeja de entrada o SPAM. Te hemos enviado un link para activar tu cuenta de AliviaFin.';
        okEl.style.display = 'block';
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
      const email = document.getElementById('forgotPasswordEmail').value.trim();
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
          okEl.innerHTML = `✅ ¡Listo! Te enviamos un correo a <b>${email}</b> con el enlace seguro para restablecer tu contraseña. Revisa también tu carpeta de Spam.`;
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
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
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
      await supabaseClient.auth.signOut();
      currentUser = null;
      appState = getCleanUserState();
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
      // Rellenar info de usuario y versión
      const emailEl = document.getElementById('settingsUserEmail');
      if (emailEl && currentUser) emailEl.textContent = currentUser.email;
      if (typeof syncVersionUI === 'function') syncVersionUI();
      document.getElementById('settingsModal').classList.add('active');
    }

    function switchSegmentView(type) {
      document.getElementById('segBtnChart').className = 'segmented-btn ' + (type === 'chart' ? 'active' : '');
      document.getElementById('segBtnCuotas').className = 'segmented-btn ' + (type === 'cuotas' ? 'active' : '');

      document.getElementById('segmentChartBox').style.display = type === 'chart' ? 'block' : 'none';
      document.getElementById('segmentCuotasBox').style.display = type === 'cuotas' ? 'block' : 'none';
    }

    // Registrar Service Worker v48 (Network-First, sin caché de datos)
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js?v=61.0')
          .then(reg => {
            console.log('SW v48 registrado:', reg.scope);
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
        
        // Cuando el SW se actualiza, recargar para usar la nueva versión
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('SW actualizado - tomando control');
        });
      });
    }

    function getCurrentCalendarMonthName() {
      const now = new Date();
      const monthsEs = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      const realMonthName = monthsEs[now.getMonth()] + ' ' + now.getFullYear();

      if (typeof appState !== 'undefined' && appState && appState.transactions && appState.transactions[realMonthName]) {
        return realMonthName;
      }

      // Fallback: el mes válido más reciente que tenga datos
      if (typeof appState !== 'undefined' && appState && appState.transactions) {
        const validMonths = Object.keys(appState.transactions || {})
          .filter(m => {
            const p = m.split(' ');
            return p.length === 2 && monthsEs.includes(p[0]) && /^\d{4}$/.test(p[1]);
          })
          .sort((a, b) => {
            const [mA, yA] = a.split(' '), [mB, yB] = b.split(' ');
            return (parseInt(yA) - parseInt(yB)) || (monthsEs.indexOf(mA) - monthsEs.indexOf(mB));
          });
        if (validMonths.length > 0) {
          return validMonths[validMonths.length - 1];
        }
      }

      return realMonthName;
    }

    function updateSyncIndicator(status, text) {
      const dot = document.getElementById('syncDot');
      const txt = document.getElementById('syncText');
      if (dot && txt) {
        txt.textContent = text;
        if (status === 'synced') {
          dot.className = 'sync-status-dot live';
          dot.style.background = '#10b981';
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

    const SUPABASE_URL = 'https://swwvbfemxookbqoqotre.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_CZUC5ueCxjSDFeA3idgVZg_DaEoIJxf';
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
      const userSelectedMonth = appState.currentMonth;

      const isCesar = currentUser && currentUser.email === 'cesar.risso.f@gmail.com';
      appState = isCesar ? applyDataMigrations(remoteData) : remoteData;

      if (userSelectedMonth && appState.transactions[userSelectedMonth]) {
        appState.currentMonth = userSelectedMonth;
      } else if (!appState.currentMonth) {
        appState.currentMonth = getCurrentCalendarMonthName();
      }

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
          const isCesar = currentUser && currentUser.email === 'cesar.risso.f@gmail.com';
          if (!isCesar && isLegacyClonedState(data.data)) {
            console.warn('Usuario no-admin con datos clonados por defecto. Reseteando a espacio limpio...');
            appState = getCleanUserState();
            saveLocalState();
            syncStateToServer();
            renderAll();
            setTimeout(() => openOnboardingWizard(false), 500);
            return;
          }
          applyRemoteState(data.data);
          lastSuccessfulSyncTime = Date.now();
          updateSyncIndicator('synced', '🟢 En Vivo');
        } else if (error && error.code === 'PGRST116') {
          // No hay datos para este usuario aun (usuario nuevo)
          console.log('Usuario nuevo: inicializando con espacio 100% limpio...');
          appState = getCleanUserState();
          saveLocalState();
          lastSuccessfulSyncTime = Date.now();
          updateSyncIndicator('synced', '🟢 En Vivo');
          renderAll();
          syncStateToServer(); // Crea el row limpio del usuario
          setTimeout(() => openOnboardingWizard(false), 500);
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

    // Forzar reload de datos al volver al foco
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        lastKnownServerDataHash = '';
        loadStateFromServer(3);
      }
    });
    window.addEventListener('focus', () => {
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
      const isCesar = currentUser && currentUser.email === 'cesar.risso.f@gmail.com';
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
      if (!appState.currentMonth) appState.currentMonth = getCurrentCalendarMonthName();
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

    document.addEventListener('DOMContentLoaded', () => {
      // Limpiar caché del Service Worker viejo para garantizar datos frescos
      if ('serviceWorker' in navigator && 'caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name !== 'finanzas-pro-v74') {
              caches.delete(name);
              console.log('Caché viejo eliminado:', name);
            }
          });
        });
      }

      // v50: Toda la inicialización de la app ocurre en onLoginSuccess()
      // Solo verificamos si hay sesión activa de Supabase
      syncVersionUI();
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
    });

    function closeAllModals() {
      document.querySelectorAll('.modal-backdrop, .glass-backdrop').forEach(mb => {
        mb.classList.remove('active');
        mb.style.visibility = 'hidden';
        mb.style.opacity = '0';
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
      const currentTheme = isDark ? 'twilight' : 'crystal';
      localStorage.setItem('finanzas_theme', currentTheme);
      updateThemeButtons(currentTheme);
      showToast(isDark ? '🌙 Modo Noche Suave activado' : '✨ Modo Claro Cristal activado', 'info');
      if (typeof updateSimulatedCalculations === 'function' && document.getElementById('installmentsSimulatorModal')?.classList.contains('active')) {
        updateSimulatedCalculations();
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
      const savedTheme = localStorage.getItem('finanzas_theme') || 'crystal';
      if (savedTheme === 'twilight') {
        document.body.classList.add('theme-twilight');
      } else {
        document.body.classList.remove('theme-twilight');
      }
      updateThemeButtons(savedTheme);
    }

    function handleBackdropClick(e, modalId) {
      if (e.target.id === modalId) {
        closeModal(modalId);
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
      appState.currentMonth = month;
      ensureMonthTransactions(month);
      ensureMonthIncomes(month);
      saveState();
      renderAll();
    }

    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

      document.getElementById('tab-' + tabId).classList.add('active');
      
      const tabIndices = { 'inicio': 0, 'plan': 1, 'metas': 2, 'consejos': 3, 'auditoria': 4 };
      if (tabIndices[tabId] !== undefined) {
        document.querySelectorAll('.nav-item')[tabIndices[tabId]].classList.add('active');
      }

      if (tabId === 'plan') {
        setTimeout(() => {
          renderDonutChart();
          renderHistoryChart();
          renderCuotasTracker();
          render503020Rule();
          renderCategoryBudgets();
          renderGastosHormiga();
        }, 100);
      } else if (tabId === 'metas') {
        renderGoals();
        renderMetrics(); // Re-render emergency fund card
      } else if (tabId === 'consejos') {
        renderPersonalizedTips();
      } else if (tabId === 'auditoria') {
        renderAuditTable();
      }
    }

    function renderCategoryChips() {
      const container = document.getElementById('categoryChips');
      if (!container) return; // Feature disabled by UX request
      const cats = ['TODAS', ...Object.keys(CATEGORIES)];

      container.innerHTML = cats.map(c => `
        <div class="chip ${c === currentCategoryFilter ? 'active' : ''}" onclick="selectCategoryChip('${c}')">
          ${c === 'TODAS' ? '✨ Todas' : CATEGORIES[c].icon + ' ' + c}
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

      const isCesar = currentUser && currentUser.email === 'cesar.risso.f@gmail.com';
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

      const banner = document.getElementById('juntaBanner');
      if (banner) {
        const isCesarForBanner = currentUser && currentUser.email === 'cesar.risso.f@gmail.com';
        const curM = appState.currentMonth;
        if (!isCesarForBanner || ['Septiembre 2026', 'Octubre 2026', 'Noviembre 2026', 'Diciembre 2026'].includes(curM)) {
          banner.style.display = 'none';
        } else {
          banner.style.display = 'flex';
        }
      }

      renderMetrics();
      renderCuotasTracker();
      renderDonutChart();
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
      if (typeof txViewMode !== 'undefined' && txViewMode === 'calendar') {
        renderCalendarView();
      }
    }

    function getMonthTxList() {
      return appState.transactions[appState.currentMonth] || [];
    }

    function ensureMonthIncomes(m) {
      if (!appState.incomes) appState.incomes = {};
      const isCesar = currentUser && currentUser.email === 'cesar.risso.f@gmail.com';

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
               incs.push({ id: 'inc_junta_agosto2026', name: 'Junta de Agosto', amount: 4500, status: 'Pendiente', date: 15 });
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

    function getMonthTotalIncome() {
      const incs = appState.incomes ? (appState.incomes[appState.currentMonth] || []) : [];
      const sum = incs.reduce((s, i) => s + i.amount, 0);
      if (sum === 0 && appState.salary && appState.salary > 0) {
        return appState.salary;
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

    function openExplainSurplusModal() {
      document.getElementById('explainSurplusModal').classList.add('active');
    }

    function openAddExtraIncomeModal() {
      document.getElementById('extraIncomeName').value = '';
      document.getElementById('extraIncomeAmount').value = '';
      document.getElementById('addExtraIncomeModal').classList.add('active');
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

      document.getElementById('metricSalary').textContent = 'S/ ' + totalIncome.toLocaleString('es-PE', {minimumFractionDigits: 0});
      document.getElementById('metricSpent').textContent = 'S/ ' + totalSpent.toLocaleString('es-PE', {minimumFractionDigits: 2});
      
      const elSavings = document.getElementById('metricSavings');
      elSavings.textContent = 'S/ ' + currentBalance.toLocaleString('es-PE', {minimumFractionDigits: 2});
      
      if (currentBalance >= 440) {
        elSavings.className = 'stat-value text-success';
      } else if (currentBalance >= 0) {
        elSavings.className = 'stat-value text-warning';
      } else {
        elSavings.className = 'stat-value text-danger';
      }

      // Alerta de Liquidez (Opción D)
      const totalPending = totalSpent - totalPaid;
      let liquidityAlert = document.getElementById('liquidityAlertMsg');
      if (!liquidityAlert) {
        liquidityAlert = document.createElement('div');
        liquidityAlert.id = 'liquidityAlertMsg';
        liquidityAlert.style.cssText = 'font-size: 9px; margin-top: 4px; font-weight: 800; background: #fee2e2; color: #b91c1c; padding: 2px 6px; border-radius: 4px; display: inline-block; line-height: 1.2;';
        elSavings.parentNode.appendChild(liquidityAlert);
      }
      if (currentBalance < totalPending && currentBalance >= 0) {
        const shortfall = totalPending - currentBalance;
        liquidityAlert.textContent = `⚠️ Faltan S/ ${shortfall.toLocaleString('es-PE', {minimumFractionDigits: 2})} para pendientes`;
        liquidityAlert.style.display = 'inline-block';
      } else {
        liquidityAlert.style.display = 'none';
      }

      // Termómetro Fondo Emergencia (Opción F)
      const emFund = appState.savingsGoals.find(g => g.name.includes('Emergencia'));
      const emAmount = emFund ? emFund.current : 0;
      
      const elEmergency = document.getElementById('metricEmergencyFund');
      if (elEmergency) {
        elEmergency.textContent = 'S/ ' + emAmount.toLocaleString('es-PE', {minimumFractionDigits: 2});
        
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
                <div class="cuota-sub">S/ ${ci.amount.toFixed(2)} / mes</div>
              </div>
              <div class="cuota-badge" style="background: linear-gradient(135deg, #fdf4ff, #fae8ff); color: #86198f; border: 1px solid #f0abfc; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">${ci.installmentsCurrent} de ${ci.installmentsTotal}</div>
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
              <div style="font-size: 10px; color: var(--text-muted);">S/ ${i.amount.toLocaleString('es-PE', {minimumFractionDigits: 2})} • <span onclick="editIncomeDate('${i.id}', event)" style="cursor: pointer; text-decoration: underline; color: #0284c7;" onmouseover="this.style.color='#0369a1'" onmouseout="this.style.color='#0284c7'">Día ${i.date} ✎</span></div>
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
          colors.push(CATEGORIES[cat].color);
        }
      });

      const ctx = document.getElementById('categoryChart').getContext('2d');
      if (categoryChartObj) categoryChartObj.destroy();

      categoryChartObj = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: colors,
            borderWidth: 0,
            hoverOffset: 12,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { family: 'Plus Jakarta Sans', size: 9, weight: '600' },
                boxWidth: 8,
                padding: 6
              }
            }
          },
          cutout: '70%',
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

    function renderTransactions() {
      const container = document.getElementById('txTableBody');
      const search = (document.getElementById('searchTx')?.value || '').toLowerCase().trim();
      const sortBy = document.getElementById('sortTx')?.value || 'newest';

      // Poblar selector avanzado de categorías si aún no está poblado
      const advCatSelect = document.getElementById('advFilterCategory');
      if (advCatSelect && advCatSelect.options.length <= 1) {
        Object.keys(CATEGORIES).sort().forEach(cat => {
          const opt = document.createElement('option');
          opt.value = cat;
          opt.textContent = `${CATEGORIES[cat].icon || '🏷️'} ${cat}`;
          advCatSelect.appendChild(opt);
        });
      }

      const advCategory = document.getElementById('advFilterCategory')?.value || 'ALL';
      const advAmount = document.getElementById('advFilterAmount')?.value || 'ALL';

      const filterCat = (advCategory !== 'ALL') ? advCategory : currentCategoryFilter;
      const filterStatus = currentStatusFilter;

      let allTxs = getMonthTxList();

      const grandTotal = allTxs.reduce((s, t) => s + t.amount, 0);
      const paidTotal = allTxs.filter(t => (t.status || 'Pagado') === 'Pagado').reduce((s, t) => s + t.amount, 0);
      const pendingTotal = grandTotal - paidTotal;

      document.getElementById('txSummaryTotal').textContent = 'S/ ' + grandTotal.toFixed(2);
      document.getElementById('txSummaryPagado').textContent = 'S/ ' + paidTotal.toFixed(2);
      document.getElementById('txSummaryPendiente').textContent = 'S/ ' + pendingTotal.toFixed(2);

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
      if (advAmount === 'MICRO') {
        txs = txs.filter(t => (t.amount || 0) <= 35);
      } else if (advAmount === 'MID') {
        txs = txs.filter(t => (t.amount || 0) > 35 && (t.amount || 0) <= 150);
      } else if (advAmount === 'HIGH') {
        txs = txs.filter(t => (t.amount || 0) > 150);
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
      document.getElementById('filteredTxCount').textContent = `Mostrando ${txs.length} de ${allTxs.length} gastos`;
      document.getElementById('filteredTxSum').textContent = `Total: S/ ${totalSum.toFixed(2)}`;

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
          installmentBadge = `<span style="background: linear-gradient(135deg, #fdf4ff, #fae8ff); color: #86198f; padding: 3px 6px; border-radius: 6px; font-size: 10px; font-weight: 800; border: 1px solid #f0abfc; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">💳 ${t.installmentsCurrent}/${t.installmentsTotal}</span>`;
        }

        const effectiveDueDate = getEffectiveDueDate(t);

        return `
          <tr>
            <td>
              <div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-size: 14px;">${catInfo.icon}</span>
                  <span style="font-weight: 800;">${t.name}</span>
                  ${installmentBadge}
                </div>
                <div style="font-size: 10px; color: var(--text-muted); margin-top: 1px;">
                  🗓️ Vence día: <strong>${effectiveDueDate}</strong>
                </div>
              </div>
            </td>
            <td>
              <span class="badge ${catInfo.badgeClass}" ${catInfo.badgeClass === 'badge-custom' ? `style="background-color: ${catInfo.color}20; color: ${catInfo.color}; border: 1px solid ${catInfo.color}40;"` : ''}>${t.category}</span>
            </td>
            <td>
              <span class="status-badge ${stClass}" onclick="toggleTxStatus('${t.id}')">
                ${stLabel}
              </span>
            </td>
            <td style="font-weight: 800; font-size: 13px;">
              S/ ${t.amount.toFixed(2)}
            </td>
            <td style="text-align: right;">
              <button class="btn-pill primary" onclick="openEditExpenseModal('${t.id}')">✏️</button>
              <button class="btn-pill danger" onclick="deleteTransaction('${t.id}')">🗑️</button>
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
      document.getElementById('installmentFieldsGroup').style.display = isChecked ? 'grid' : 'none';
    }

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
      document.getElementById('installmentFieldsGroup').style.display = isInst ? 'grid' : 'none';
      document.getElementById('txInstallmentsTotal').value = tx.installmentsTotal || 12;
      document.getElementById('txInstallmentsCurrent').value = tx.installmentsCurrent || 10;

      document.getElementById('txPropagateFuture').checked = false;

      document.getElementById('expenseModalTitle').textContent = '✏️ Editar Gasto';
      document.getElementById('saveExpenseBtn').textContent = 'Actualizar Gasto';

      document.getElementById('addExpenseModal').classList.add('active');
    }

    function closeModal(id) {
      document.getElementById(id).classList.remove('active');
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
                let calculated = installmentsCurrent - idx;
                t.installmentsCurrent = calculated < 0 ? 0 : calculated;
              } else {
                t.installmentsCurrent = installmentsCurrent;
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
             if (isInstallment) {
               let calculated = installmentsCurrent - idx;
               adjCurrent = calculated < 0 ? 0 : calculated;
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
               installmentsCurrent: adjCurrent
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
          if (isInstallment && shouldPropagateForward) {
            let calculated = installmentsCurrent - idx;
            adjCurrent = calculated < 0 ? 0 : calculated;
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
              installmentsCurrent: adjCurrent
            });
          }
        });

        addAuditLog('➕ Gasto Registrado', `Gasto '${name}' (S/ ${amount}, Día ${dueDate}) añadido.`);
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

    function render503020Rule() {
      const salary = getMonthTotalIncome();
      const txs = getMonthTxList();
      
      const target50 = salary * 0.50;
      const target30 = salary * 0.30;
      const target20 = salary * 0.20;

      let needsReal = 0, wantsReal = 0, savingsDebtReal = 0;

      txs.forEach(t => {
        const c = t.category;
        if (c === 'Tarjetas') {
          savingsDebtReal += t.amount;
        } else if (['Casa', 'Comida casa', 'Comida gatitos casa', 'Arena gatitos casa', 'Carro', 'UTP', 'Internet', 'Servicios', 'Celulares', 'Mapfre', 'Papá'].includes(c)) {
          needsReal += t.amount;
        } else if (['Suscripciones', 'Gimnasio & Salud', 'Comida gatitos calle', 'Viajes'].includes(c)) {
          wantsReal += t.amount;
        } else {
          needsReal += t.amount;
        }
      });

      const totalSpent = needsReal + wantsReal + savingsDebtReal;
      const realSavings = salary - totalSpent;
      const totalSavingsAndDebt = savingsDebtReal + Math.max(0, realSavings);

      const html = `
        <div class="budget-row">
          <div class="budget-info">
            <span>🏠 50% Necesidades Básicas</span>
            <span>S/ ${needsReal.toFixed(0)} / S/ ${target50.toFixed(0)}</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-fill" style="width: ${Math.min(100, (needsReal/target50)*100)}%; background: ${needsReal > target50 ? '#ef4444' : '#4f46e5'}"></div>
          </div>
        </div>

        <div class="budget-row">
          <div class="budget-info">
            <span>🎉 30% Deseos & Estilo de Vida</span>
            <span>S/ ${wantsReal.toFixed(0)} / S/ ${target30.toFixed(0)}</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-fill" style="width: ${Math.min(100, (wantsReal/target30)*100)}%; background: ${wantsReal > target30 ? '#f59e0b' : '#06b6d4'}"></div>
          </div>
        </div>

        <div class="budget-row">
          <div class="budget-info">
            <span>💰 20% Ahorro & Deudas</span>
            <span>S/ ${totalSavingsAndDebt.toFixed(0)} / S/ ${target20.toFixed(0)}</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-fill" style="width: ${Math.min(100, (totalSavingsAndDebt/target20)*100)}%; background: #10b981"></div>
          </div>
        </div>
      `;

      document.getElementById('rule503020Container').innerHTML = html;

      // Actualizar widget rápido en Tab Inicio si existe
      const qStatus = document.getElementById('quickSemaforoStatus');
      const qPills = document.getElementById('quickSemaforoPills');
      if (qStatus && qPills) {
        const pct50 = target50 > 0 ? Math.round((needsReal / target50) * 100) : 0;
        const pct30 = target30 > 0 ? Math.round((wantsReal / target30) * 100) : 0;
        const pct20 = target20 > 0 ? Math.round((totalSavingsAndDebt / target20) * 100) : 0;

        const isGood50 = needsReal <= target50;
        const isGood30 = wantsReal <= target30;
        const isGood20 = totalSavingsAndDebt >= target20;

        qStatus.innerHTML = `🏠 Necesidades: <strong>${pct50}%</strong> (${isGood50 ? 'Bien' : 'Exceso'}) · 🎉 Deseos: <strong>${pct30}%</strong> · 💰 Ahorro: <strong>${pct20}%</strong>`;
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
              <span>${CATEGORIES[cat].icon} ${cat}</span>
              <span>S/ ${spent.toFixed(0)} / S/ ${limit} 
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
        const baseSal = appState.salary;
        const monthExtras = appState.extraIncomes[m] || [];
        const totInc = baseSal + monthExtras.reduce((s, i) => s + i.amount, 0);
        const savings = totInc - spent;
        const pctColor = savings >= 440 ? 'text-success' : (savings >= 0 ? 'text-warning' : 'text-danger');

        html += `
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 6px; font-weight: 700;">${m}</td>
            <td style="padding: 6px;">S/ ${spent.toFixed(2)}</td>
            <td style="padding: 6px; font-weight: 700;">S/ ${savings.toFixed(2)}</td>
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
        const baseSal = appState.salary;
        const monthExtras = appState.extraIncomes[m] || [];
        const totInc = baseSal + monthExtras.reduce((s, i) => s + i.amount, 0);
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
            { label: 'Gastos Total', data: spentData, backgroundColor: '#ef4444', borderRadius: 4 },
            { label: 'Superávit', data: savingsData, backgroundColor: '#10b981', borderRadius: 4 }
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
              <span class="goal-saved-val">S/ ${current.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
              <span class="goal-target-val">Meta: S/ ${target.toLocaleString('es-PE', { minimumFractionDigits: 0 })}</span>
            </div>

            <div class="goal-progress-track">
              <div class="goal-progress-fill" style="width: ${pct}%;"></div>
            </div>

            <div class="flex-between" style="font-size: 11px; color: var(--text-muted); font-weight: 700;">
              <span>Progreso: ${pct}%</span>
              <span>Faltan: S/ ${remaining.toLocaleString('es-PE', { minimumFractionDigits: 0 })}</span>
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
      document.getElementById('goalName').value = '';
      document.getElementById('goalTarget').value = '';
      document.getElementById('goalCurrent').value = '0';
      document.getElementById('goalMonthly').value = '250';
      document.getElementById('addGoalModal').classList.add('active');
    }

    function handleOpenAddGoalClick() {
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
      document.getElementById('depositGoalModal').classList.add('active');
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
    function renderGastosHormiga() {
      const container = document.getElementById('radarHormigaContainer');
      if (!container) return;

      const txs = getMonthTxList();
      
      const leakKeywords = {
        cafes: ['café', 'cafe', 'starbucks', 'snack', 'golosina', 'antojo', 'panaderia', 'dulce', 'helado'],
        delivery: ['delivery', 'rappi', 'pedidosya', 'uber eats', 'didi food', 'propina'],
        suscripciones: ['netflix', 'spotify', 'youtube', 'disney', 'prime', 'apple', 'icloud', 'hbo', 'gym', 'duolingo', 'suscripción', 'suscripciones'],
        taxis: ['taxi', 'uber', 'cabify', 'indrive', 'pasaje', 'peaje']
      };

      const groups = {
        cafes: { title: '☕ Cafés, Snacks y Antojos', count: 0, sum: 0, items: [] },
        delivery: { title: '🛵 Delivery y Apps de Comida', count: 0, sum: 0, items: [] },
        suscripciones: { title: '📺 Suscripciones y Streaming', count: 0, sum: 0, items: [] },
        taxis: { title: '🚕 Taxis y Movilidad Menor', count: 0, sum: 0, items: [] },
        otros: { title: '🐜 Otros Micro-gastos (≤ S/ 35)', count: 0, sum: 0, items: [] }
      };

      txs.forEach(t => {
        const nameLower = (t.name || '').toLowerCase();
        const catLower = (t.category || '').toLowerCase();
        const amt = t.amount || 0;

        let classified = false;
        if (leakKeywords.cafes.some(kw => nameLower.includes(kw) || catLower.includes(kw))) {
          groups.cafes.count++;
          groups.cafes.sum += amt;
          groups.cafes.items.push(t);
          classified = true;
        } else if (leakKeywords.delivery.some(kw => nameLower.includes(kw) || catLower.includes(kw))) {
          groups.delivery.count++;
          groups.delivery.sum += amt;
          groups.delivery.items.push(t);
          classified = true;
        } else if (leakKeywords.suscripciones.some(kw => nameLower.includes(kw) || catLower.includes(kw)) || catLower === 'suscripciones') {
          groups.suscripciones.count++;
          groups.suscripciones.sum += amt;
          groups.suscripciones.items.push(t);
          classified = true;
        } else if (leakKeywords.taxis.some(kw => nameLower.includes(kw) || catLower.includes(kw))) {
          groups.taxis.count++;
          groups.taxis.sum += amt;
          groups.taxis.items.push(t);
          classified = true;
        } else if (amt <= 35) {
          groups.otros.count++;
          groups.otros.sum += amt;
          groups.otros.items.push(t);
          classified = true;
        }
      });

      const totalFugaMes = Object.values(groups).reduce((acc, g) => acc + g.sum, 0);
      const totalFugaAnual = totalFugaMes * 12;

      let html = `
        <div class="radar-banner">
          <div>
            <div class="radar-leak-amount">
              <span>⚠️</span> S/ ${totalFugaAnual.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} al año
            </div>
            <div class="radar-leak-sub">Fuga proyectada basada en S/ ${totalFugaMes.toFixed(2)} detectados en ${appState.currentMonth}</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="showHormigaAdvice(${totalFugaAnual})" style="background: rgba(255,255,255,0.7); border-color: rgba(239, 68, 68, 0.4); font-weight: 800; color: #dc2626; border-radius: 10px;">
            💡 Optimizar
          </button>
        </div>

        <div class="leak-cards-grid">
      `;

      const activeGroups = Object.entries(groups).filter(([k, g]) => g.count > 0);
      if (activeGroups.length === 0) {
        html += `
          <div style="text-align: center; color: var(--text-muted); padding: 18px; grid-column: 1 / -1; font-size: 12px;">
            🎉 ¡Excelente! No se han detectado gastos hormiga ni fugas menores este mes.
          </div>
        `;
      } else {
        activeGroups.forEach(([key, g]) => {
          const annual = g.sum * 12;
          const maxGroupSum = Math.max(...activeGroups.map(([_, grp]) => grp.sum)) || 1;
          const barPct = Math.min(100, Math.round((g.sum / maxGroupSum) * 100));

          html += `
            <div class="leak-item-card">
              <div class="leak-item-header">
                <span class="leak-item-title">${g.title}</span>
                <span class="badge badge-warning" style="font-size: 10px;">${g.count} gastos</span>
              </div>
              <div class="flex-between" style="font-size: 12px; margin-top: 4px;">
                <span style="font-weight: 800; color: var(--text-main);">S/ ${g.sum.toFixed(2)}/mes</span>
                <span style="font-weight: 900; color: #ef4444;">S/ ${annual.toLocaleString('es-PE', { minimumFractionDigits: 0 })}/año</span>
              </div>
              <div class="leak-impact-bar">
                <div class="leak-impact-fill" style="width: ${barPct}%;"></div>
              </div>
              <div class="leak-item-footer">
                <button class="btn btn-outline btn-sm" onclick="filterHormigaGroup('${key}')" style="font-size: 10px; padding: 3px 8px; border-radius: 8px;">
                  🔍 Ver gastos
                </button>
                <button class="btn btn-secondary btn-sm" onclick="showGroupOptimizationTip('${key}', ${annual})" style="font-size: 10px; padding: 3px 8px; border-radius: 8px;">
                  💡 Sugerencia
                </button>
              </div>
            </div>
          `;
        });
      }

      html += `</div>`;
      container.innerHTML = html;
    }

    function filterHormigaGroup(key) {
      switchTab('inicio');
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
      const el = document.getElementById('txListViewContainer');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

    /* ====== 4. CALENDARIO FINANCIERO DE VENCIMIENTOS ====== */
    let txViewMode = 'list';
    let selectedCalendarDay = 15;

    function setTxViewMode(mode) {
      txViewMode = mode;
      const btnList = document.getElementById('btnViewList');
      const btnCal = document.getElementById('btnViewCalendar');
      const listWrap = document.getElementById('txListViewContainer');
      const calWrap = document.getElementById('txCalendarViewContainer');

      if (mode === 'calendar') {
        if (btnList) btnList.classList.remove('active');
        if (btnCal) btnCal.classList.add('active');
        if (listWrap) listWrap.style.display = 'none';
        if (calWrap) calWrap.style.display = 'block';
        renderCalendarView();
      } else {
        if (btnList) btnList.classList.add('active');
        if (btnCal) btnCal.classList.remove('active');
        if (listWrap) listWrap.style.display = 'block';
        if (calWrap) calWrap.style.display = 'none';
        renderTransactions();
      }
    }

    function renderCalendarView() {
      const container = document.getElementById('txCalendarViewContainer');
      if (!container) return;

      const curMonthStr = appState.currentMonth || 'Septiembre 2026';
      const monthParts = curMonthStr.split(' ');
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      let mIndex = monthNames.findIndex(m => m.toLowerCase() === (monthParts[0] || '').toLowerCase());
      if (mIndex === -1) mIndex = 8;
      const yearNum = parseInt(monthParts[1]) || 2026;

      const totalDays = new Date(yearNum, mIndex + 1, 0).getDate();
      const firstDayOfWeek = (new Date(yearNum, mIndex, 1).getDay() + 6) % 7;

      const allIncomes = appState.incomes && appState.incomes[curMonthStr] ? appState.incomes[curMonthStr] : [];
      const allExpenses = getMonthTxList();

      const dayEvents = {};
      for (let d = 1; d <= totalDays; d++) {
        dayEvents[d] = { incomes: [], expenses: [] };
      }

      allIncomes.forEach(inc => {
        const d = parseInt(inc.date) || 15;
        if (dayEvents[d]) dayEvents[d].incomes.push(inc);
      });

      allExpenses.forEach(exp => {
        const due = parseInt(getEffectiveDueDate(exp)) || parseInt(exp.dueDate) || 15;
        if (dayEvents[due]) dayEvents[due].expenses.push(exp);
      });

      if (selectedCalendarDay > totalDays) selectedCalendarDay = 1;

      let gridHtml = `
        <div class="cal-grid-wrapper">
          <div class="cal-header-bar">
            <div class="cal-header-title">
              <span>📅</span> ${monthNames[mIndex]} ${yearNum}
            </div>
            <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">
              Toca cualquier día para ver vencimientos
            </div>
          </div>

          <div class="cal-weekdays">
            <div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div><div>Dom</div>
          </div>

          <div class="cal-days-grid">
      `;

      for (let i = 0; i < firstDayOfWeek; i++) {
        gridHtml += `<div class="cal-day-box cal-day-empty"></div>`;
      }

      for (let day = 1; day <= totalDays; day++) {
        const ev = dayEvents[day];
        const isSelected = day === selectedCalendarDay;
        const hasInc = ev.incomes.length > 0;
        const hasExpPending = ev.expenses.some(e => (e.status || 'Pagado') === 'Pendiente');
        const hasExpPaid = ev.expenses.some(e => (e.status || 'Pagado') === 'Pagado');
        const hasCard = ev.expenses.some(e => (e.category || '').toLowerCase().includes('tarjeta') || e.isInstallment);

        let dotsHtml = '';
        if (hasInc) dotsHtml += `<div class="cal-dot income" title="Ingresos"></div>`;
        if (hasExpPending) {
          dotsHtml += `<div class="cal-dot ${hasCard ? 'expense-pending' : 'service'}" title="Gastos pendientes"></div>`;
        } else if (hasExpPaid) {
          dotsHtml += `<div class="cal-dot paid" title="Pagado"></div>`;
        }

        gridHtml += `
          <div class="cal-day-box ${isSelected ? 'cal-day-selected' : ''}" onclick="selectCalendarDay(${day})">
            <div class="cal-day-num">${day}</div>
            <div class="cal-day-dots">${dotsHtml}</div>
          </div>
        `;
      }

      gridHtml += `</div>`;

      const selEvents = dayEvents[selectedCalendarDay] || { incomes: [], expenses: [] };
      const selDayDate = new Date(yearNum, mIndex, selectedCalendarDay);
      const dayName = selDayDate.toLocaleDateString('es-PE', { weekday: 'long' });
      const dayCap = dayName.charAt(0).toUpperCase() + dayName.slice(1);

      const totalDayExp = selEvents.expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
      const totalDayPending = selEvents.expenses.filter(e => (e.status || 'Pagado') === 'Pendiente').reduce((acc, e) => acc + (e.amount || 0), 0);
      const totalDayInc = selEvents.incomes.reduce((acc, i) => acc + (i.amount || 0), 0);
      const netDayFlow = totalDayInc - totalDayExp;

      let itemsListHtml = '';
      if (selEvents.incomes.length === 0 && selEvents.expenses.length === 0) {
        itemsListHtml = `
          <div style="text-align: center; color: var(--text-muted); padding: 14px; font-size: 12px;">
            Sin vencimientos ni cobros registrados para este día.
          </div>
        `;
      } else {
        selEvents.incomes.forEach(inc => {
          itemsListHtml += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; margin-bottom: 6px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">💵</span>
                <div>
                  <div style="font-size: 12px; font-weight: 800; color: var(--text-main);">${inc.name}</div>
                  <div style="font-size: 10px; color: #059669; font-weight: 700;">Ingreso programado</div>
                </div>
              </div>
              <div style="font-size: 13px; font-weight: 900; color: #059669;">+ S/ ${inc.amount.toFixed(2)}</div>
            </div>
          `;
        });

        selEvents.expenses.forEach(exp => {
          const isPending = (exp.status || 'Pagado') === 'Pendiente';
          itemsListHtml += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: 12px; margin-bottom: 6px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">${(CATEGORIES[exp.category] || {}).icon || '🏷️'}</span>
                <div>
                  <div style="font-size: 12px; font-weight: 800; color: var(--text-main);">${exp.name}</div>
                  <div style="font-size: 10px; color: var(--text-muted); font-weight: 600;">${exp.category} · ${isPending ? '⏳ Pendiente' : '🟢 Pagado'}</div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 13px; font-weight: 900; color: ${isPending ? '#ef4444' : 'var(--text-main)'};">
                  S/ ${exp.amount.toFixed(2)}
                </span>
                <button class="btn btn-outline btn-sm" onclick="toggleTxStatus('${exp.id}')" style="font-size: 10px; padding: 2px 6px; border-radius: 6px;">
                  ${isPending ? 'Pagar' : 'Deshacer'}
                </button>
              </div>
            </div>
          `;
        });
      }

      gridHtml += `
        <div class="cal-day-inspector">
          <div class="flex-between mb-2">
            <div>
              <div style="font-size: 14px; font-weight: 900; color: var(--text-main);">${dayCap} ${selectedCalendarDay} de ${monthNames[mIndex]}</div>
              <div style="font-size: 11px; color: var(--text-muted); font-weight: 600;">
                ${selEvents.expenses.length} pagos · ${selEvents.incomes.length} ingresos
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 10px; color: var(--text-muted); font-weight: 700;">Flujo Neto del Día</div>
              <div style="font-size: 14px; font-weight: 900; color: ${netDayFlow >= 0 ? '#10b981' : '#ef4444'};">
                ${netDayFlow >= 0 ? '+' : ''} S/ ${netDayFlow.toFixed(2)}
              </div>
            </div>
          </div>

          <div style="margin-top: 10px;">
            ${itemsListHtml}
          </div>

          <div class="flex-between" style="font-size: 11px; margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--border); color: var(--text-muted);">
            <span>Pendiente por pagar hoy: <strong style="color: #ef4444;">S/ ${totalDayPending.toFixed(2)}</strong></span>
            <span>Total compromisos: <strong>S/ ${totalDayExp.toFixed(2)}</strong></span>
          </div>
        </div>
      </div>
      `;

      container.innerHTML = gridHtml;
    }

    function selectCalendarDay(day) {
      selectedCalendarDay = day;
      renderCalendarView();
    }

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
      const isCesarTips = currentUser && currentUser.email === 'cesar.risso.f@gmail.com';
      
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

      document.getElementById('expenseModalTitle').textContent = '+ Registrar Nuevo Gasto';
      document.getElementById('saveExpenseBtn').textContent = 'Guardar Gasto';
      document.getElementById('addExpenseModal').classList.add('active');
    }

    function closeModal(id) {
      document.getElementById(id).classList.remove('active');
    }

    function openEditSalaryModal() {
      document.getElementById('newSalaryInput').value = appState.salary;
      document.getElementById('editSalaryModal').classList.add('active');
    }

    function handleSaveSalary(e) {
      e.preventDefault();
      const val = parseFloat(document.getElementById('newSalaryInput').value);
      if (val > 0) {
        appState.salary = val;
        const isCesar = currentUser && currentUser.email === 'cesar.risso.f@gmail.com';
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

    function closeGlassModal(id) {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('active');
        el.style.visibility = 'hidden';
        el.style.opacity = '0';
      }
    }

    function openCategoryManagerModal() {
      renderCategoryManagerList();
      const el = document.getElementById('categoryManagerModal');
      if (el) {
        el.style.visibility = 'visible';
        el.style.opacity = '1';
        el.classList.add('active');
      }
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
                  S/ ${spent.toFixed(0)} <span style="color:#64748b;">/ S/ ${limit.toFixed(0)}</span>
                </div>
              </div>
              <div style="height:6px; background:rgba(255,255,255,0.08); border-radius:999px; overflow:hidden; margin-bottom:4px;">
                <div style="height:100%; width:${pct}%; background:${barColor}; border-radius:999px; transition:width 0.3s ease;"></div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; color:#94a3b8;">
                <span>S/ ${left.toFixed(0)} restante</span>
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

      const simModalEl = document.getElementById('installmentsSimulatorModal');
      if (simModalEl) {
        simModalEl.style.visibility = 'visible';
        simModalEl.style.opacity = '1';
        simModalEl.classList.add('active');
      }
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

      document.getElementById('simMonthlyQuotaDisplay').textContent = `S/ ${monthlyQuota.toFixed(2)}`;
      document.getElementById('simTotalToPayDisplay').textContent = `S/ ${totalToPay.toFixed(2)}`;

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
    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

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

      const modal = document.getElementById('onboardingWizardModal');
      if (modal) {
        modal.classList.add('active');
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
      }
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
      const modal = document.getElementById('onboardingWizardModal');
      if (modal) {
        modal.classList.remove('active');
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
      }
      if (markSkipped) {
        const userKey = currentUser ? currentUser.id : 'guest';
        localStorage.setItem('finanzas_setup_completed_' + userKey, 'skipped');
        showToast('Asistente cerrado. Puedes reabrirlo en Ajustes ⚙️', 'info');
        
        // Si no ha marcado "No volver a mostrar tour", lanzar el tour interactivo
        const tourDismissed = localStorage.getItem('finanzas_tour_dismissed_' + userKey) === 'true';
        if (!tourDismissed) {
          setTimeout(() => startInteractiveTour(), 800);
        }
      }
    }

    // ================================================================
    // NOVEDADES DE LA VERSIÓN (WHAT'S NEW)
    // ================================================================
    function syncVersionUI() {
      const loginVer = document.getElementById('loginFooterVersion');
      if (loginVer) loginVer.textContent = 'AliviaFin ' + APP_VERSION + ' · Powered by Supabase';

      const settVer = document.getElementById('settingsVersion');
      if (settVer) settVer.textContent = APP_VERSION;

      const settBtn = document.getElementById('settingsWhatsNewBtn');
      if (settBtn) settBtn.textContent = '🚀 Novedades (' + APP_VERSION + ')';

      const wnBadge = document.getElementById('whatsNewVersionBadge');
      if (wnBadge) wnBadge.textContent = 'Versión ' + APP_VERSION;

      const wnSub = document.getElementById('whatsNewVersionSub');
      if (wnSub) wnSub.textContent = 'Actualización ' + APP_VERSION + ' · Rebranding AliviaFin & Plan Bola de Nieve';
    }

    function openWhatsNewModal() {
      syncVersionUI();
      const modal = document.getElementById('whatsNewModal');
      if (modal) {
        modal.classList.add('active');
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
      }
    }

    function dismissWhatsNewModal() {
      const modal = document.getElementById('whatsNewModal');
      if (modal) {
        modal.classList.remove('active');
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
      }
      const userKey = currentUser ? currentUser.id : 'guest';
      localStorage.setItem('finanzas_last_seen_version_' + userKey, APP_VERSION);
      localStorage.setItem('finanzas_last_seen_version', APP_VERSION);
    }

    // Comprobación automática de bienvenida, tour interactivo y versión
    function checkOnboardingAndVersionAnnouncements() {
      syncVersionUI();
      const userKey = currentUser ? currentUser.id : 'guest';
      const isCesar = currentUser && currentUser.email === 'cesar.risso.f@gmail.com';
      const setupDone = localStorage.getItem('finanzas_setup_completed_' + userKey);
      const tourDismissed = localStorage.getItem('finanzas_tour_dismissed_' + userKey) === 'true';
      const seenVer = localStorage.getItem('finanzas_last_seen_version_' + userKey) || localStorage.getItem('finanzas_last_seen_version');

      if (!isCesar) {
        const hasData = (appState.salary && appState.salary > 0) || (appState.transactions && Object.keys(appState.transactions).some(m => appState.transactions[m].length > 0));
        
        if (!setupDone && !hasData) {
          setTimeout(() => openOnboardingWizard(false), 500);
          return;
        } else if (!setupDone && hasData) {
          localStorage.setItem('finanzas_setup_completed_' + userKey, 'true');
        }
      }

      // Si el tour interactivo aún no ha sido marcado con opt-out ("No volver a mostrar"), lanzarlo
      if (!tourDismissed) {
        setTimeout(() => startInteractiveTour(), 700);
        return;
      }

      // Si no mostramos onboarding ni tour, chequear si hay nueva versión para alertar al usuario
      if (seenVer !== APP_VERSION) {
        setTimeout(() => openWhatsNewModal(), 700);
      }
    }

    // ================================================================
    // MODALES DE SEGURIDAD & FEEDBACK (SOPORTE)
    // ================================================================
    function openSecurityModal() {
      const modal = document.getElementById('securityModal');
      if (modal) modal.classList.add('active');
    }

    function openFeedbackModal() {
      const modal = document.getElementById('feedbackModal');
      if (modal) {
        const msgEl = document.getElementById('feedbackMessage');
        if (msgEl) msgEl.value = '';
        modal.classList.add('active');
        setTimeout(() => {
          if (msgEl) msgEl.focus();
        }, 200);
      }
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
      } else {
        localStorage.removeItem('finanzas_tour_dismissed_' + userKey);
      }
    };

    function startInteractiveTour() {
      if (!window.driver || !window.driver.js || !window.driver.js.driver) {
        console.warn("Driver.js no cargado");
        return;
      }

      // Asegurar que empezamos en el tab de Inicio
      if (typeof switchTab === 'function') {
        switchTab('inicio');
      }

      const userKey = currentUser ? currentUser.id : 'guest';
      const isDismissed = localStorage.getItem('finanzas_tour_dismissed_' + userKey) === 'true';

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
          const chk = document.getElementById('tourDontShowAgain');
          if (chk && chk.checked) {
            localStorage.setItem('finanzas_tour_dismissed_' + userKey, 'true');
          }
          if (typeof switchTab === 'function') {
            switchTab('inicio');
          }
          driverObj.destroy();
        },
        onHighlightStarted: (element, step, { config, state }) => {
          if (step && step.tabToSwitch && typeof switchTab === 'function') {
            switchTab(step.tabToSwitch);
          }
        },
        onDestroyStarted: () => {
          const chk = document.getElementById('tourDontShowAgain');
          if (chk && chk.checked) {
            localStorage.setItem('finanzas_tour_dismissed_' + userKey, 'true');
          }
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
                  <p style="margin: 0 0 10px 0;">Recorreremos juntos en 1 minuto las herramientas esenciales para dominar tus finanzas:</p>
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; font-size: 12px; color: #475569; display: flex; flex-direction: column; gap: 6px;">
                    <div>💵 <b>Configurar sueldo y presupuestos</b></div>
                    <div>📉 <b>Registrar gastos e ingresos extra</b></div>
                    <div>💳 <b>Simulador de compras en cuotas</b></div>
                    <div>💬 <b>Ayuda y soporte directo en 1 clic</b></div>
                    <div>📥 <b>Descargar reporte mensual en PDF</b></div>
                    <div>🌙 <b>Activar el Modo Oscuro</b></div>
                    <div>📊 <b>Conocer cada sección de la barra inferior</b></div>
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
              title: '📉 Cómo Registrar un Gasto',
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
              title: '📈 Cómo Registrar Ingresos Extra',
              description: '¿Cobraste un bono, utilidades o trabajo freelance? Regístralo aquí con un toque para que se sume de inmediato a tu saldo en banco real.',
              side: 'bottom',
              align: 'end'
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
              align: 'end'
            }
          },
          // 7. Configurar Sueldo y Gastos Mensuales
          {
            element: '#btnSettings',
            tabToSwitch: 'inicio',
            popover: {
              title: '⚙️ Configurar Sueldo y Gastos Mensuales',
              description: 'Desde este botón de Ajustes puedes cambiar tu sueldo en <b>"✏️ Editar mi Sueldo Inicial"</b>, ajustar presupuestos de gastos fijos en <b>"⚙️ Gestor de Categorías"</b>, o relanzar el asistente completo en <b>"🔧 Reconfigurar Ingresos y Gastos"</b>.',
              side: 'bottom',
              align: 'end'
            }
          },
          // 8. Descargar Reporte en PDF
          {
            element: '#btnExportPDF',
            tabToSwitch: 'inicio',
            popover: {
              title: '📥 Descargar Reporte Mensual en PDF',
              description: 'Exporta en segundos un informe ejecutivo completo en PDF con tus gastos pagados, pendientes y balances netos del mes, listo para imprimir o archivar.',
              side: 'bottom',
              align: 'end'
            }
          },
          // 9. Modo Oscuro
          {
            element: '#themeToggleBtn',
            tabToSwitch: 'inicio',
            popover: {
              title: '🌙 Cambiar a Modo Oscuro / Claro',
              description: 'Alterna con un solo clic entre el Modo Claro y el Modo Noche Suave, diseñado para proteger tu vista de noche y reducir el consumo de batería.',
              side: 'bottom',
              align: 'end'
            }
          },
          // 9. Tab Plan (Auto-navega a Plan)
          {
            element: '#navTabPlan',
            tabToSwitch: 'plan',
            popover: {
              title: '📊 Pestaña: Plan Financiero',
              description: '<i>¡La app navegó automáticamente al Plan!</i> Aquí tienes tu distribución inteligente <b>50/30/20</b> (Necesidades, Deseos, Ahorro), gráficos comparativos de gastos y el rastreador de tus compras en cuotas.',
              side: 'top',
              align: 'center'
            }
          },
          // 10. Tab Metas (Auto-navega a Metas)
          {
            element: '#navTabMetas',
            tabToSwitch: 'metas',
            popover: {
              title: '🎯 Pestaña: Metas de Ahorro',
              description: '<i>¡Ahora estamos en Metas!</i> Establece objetivos como tu Fondo de Emergencia, viajes o compras grandes. AliviaFin calcula cuánto dinero debes apartar cada mes para lograrlas.',
              side: 'top',
              align: 'center'
            }
          },
          // 11. Tab Consejos (Auto-navega a Consejos)
          {
            element: '#navTabConsejos',
            tabToSwitch: 'consejos',
            popover: {
              title: '💡 Pestaña: Consejos y Diagnóstico',
              description: '<i>¡Llegamos a Consejos!</i> Aquí encuentras a tu <b>Asesor Financiero Personal</b> y el <b>Diagnóstico Automático del Mes</b> (reubicado aquí para un análisis más claro y profundo), junto a recomendaciones para optimizar tus gastos.',
              side: 'top',
              align: 'center'
            }
          },
          // 12. Tab Historial (Auto-navega a Historial)
          {
            element: '#navTabHistorial',
            tabToSwitch: 'auditoria',
            popover: {
              title: '📜 Pestaña: Historial y Auditoría',
              description: '<i>¡Aquí está tu Historial!</i> Consulta la bitácora cronológica completa de cada gasto registrado, edición o ajuste de saldo, garantizando máxima trazabilidad en tus finanzas.',
              side: 'top',
              align: 'center'
            }
          },
          // 13. Cierre y Opción No Volver a Mostrar (Vuelve a Inicio)
          {
            element: '#navTabInicio',
            tabToSwitch: 'inicio',
            popover: {
              title: '🚀 ¡Todo Listo para Dominar tus Finanzas!',
              description: `
                <div style="font-size: 13px; line-height: 1.5; color: #334155;">
                  <p style="margin: 0 0 10px 0;">Regresamos a tu pantalla de Inicio. Recuerda que siempre puedes volver a consultar este tour guiado desde <b>⚙️ Ajustes</b>.</p>
                  <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid #e2e8f0; text-align: left;">
                    <label style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #475569; cursor: pointer; font-weight: 600;">
                      <input type="checkbox" id="tourDontShowAgain" onchange="window.handleTourCheckboxChange(this.checked)" ${isDismissed ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: #4f46e5; cursor: pointer;">
                      <span>No volver a mostrar este tour al iniciar</span>
                    </label>
                  </div>
                </div>
              `,
              side: 'top',
              align: 'center',
              onNextClick: () => {
                const chk = document.getElementById('tourDontShowAgain');
                if (chk && chk.checked) {
                  localStorage.setItem('finanzas_tour_dismissed_' + userKey, 'true');
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

// Función para cerrar el tour de forma garantizada desde cualquier evento
window.closeTour = function() {
  const userKey = currentUser ? currentUser.id : 'guest';
  const chk = document.getElementById('tourDontShowAgain');
  if (chk && chk.checked) {
    localStorage.setItem('finanzas_tour_dismissed_' + userKey, 'true');
  }
  if (typeof switchTab === 'function') {
    switchTab('inicio');
  }
  if (window.currentAliviaFinTour || window.currentFinZenTour) {
    try { (window.currentAliviaFinTour || window.currentFinZenTour).destroy(); } catch(e) {}
  }
};

    // ================================================================
    // ASESOR DE DEUDAS: MÉTODO BOLA DE NIEVE (ALIVIAFIN PRO)
    // ================================================================
    let currentSnowballDebts = [
      { id: 'd1', name: 'Tarjeta Falabella / Ripley', balance: 1200, minPayment: 110 },
      { id: 'd2', name: 'Tarjeta BCP / BBVA', balance: 2800, minPayment: 210 },
      { id: 'd3', name: 'Préstamo Personal', balance: 6500, minPayment: 340 }
    ];

    function handleDebtAdvisorClick() {
      if (!isUserPro()) {
        openFinZenProModal('Asesor de Deudas Bola de Nieve');
        return;
      }
      openDebtSnowballModal();
    }

    function openDebtSnowballModal() {
      // Si ya hay un plan guardado en appState o localStorage, cargarlo
      if (appState && appState.debtSnowball && Array.isArray(appState.debtSnowball.debts) && appState.debtSnowball.debts.length > 0) {
        currentSnowballDebts = JSON.parse(JSON.stringify(appState.debtSnowball.debts));
        const extraInput = document.getElementById('snowballExtraPayment');
        if (extraInput && appState.debtSnowball.extraPayment !== undefined) {
          extraInput.value = appState.debtSnowball.extraPayment;
        }
      } else {
        const saved = localStorage.getItem('aliviafin_debt_snowball') || localStorage.getItem('finzen_debt_snowball');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.debts && parsed.debts.length > 0) {
              currentSnowballDebts = parsed.debts;
              const extraInput = document.getElementById('snowballExtraPayment');
              if (extraInput && parsed.extraPayment !== undefined) {
                extraInput.value = parsed.extraPayment;
              }
            }
          } catch(e) {}
        }
      }

      renderSnowballDebtsList();
      calculateDebtSnowball();

      const el = document.getElementById('debtSnowballModal');
      if (el) {
        el.style.visibility = 'visible';
        el.style.opacity = '1';
        el.classList.add('active');
      }
    }

    function renderSnowballDebtsList() {
      const container = document.getElementById('snowballDebtsList');
      if (!container) return;

      if (!currentSnowballDebts || currentSnowballDebts.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 12px; background: rgba(255,255,255,0.6); border-radius: 12px; border: 1px dashed rgba(226,232,240,0.9);">
            No tienes deudas registradas. ¡Haz clic abajo para añadir tu primera deuda!
          </div>
        `;
        return;
      }

      container.innerHTML = currentSnowballDebts.map((d, idx) => `
        <div class="snowball-debt-item" style="background: rgba(255,255,255,0.85); border: 1px solid rgba(226, 232, 240, 0.9); border-radius: 12px; padding: 10px 12px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 6px; flex: 1;">
              <span style="font-size: 14px;">💳</span>
              <input type="text" value="${escapeHtml(d.name)}" placeholder="Nombre de la deuda" 
                onchange="updateSnowballDebt(${idx}, 'name', this.value)"
                style="border: none; background: transparent; font-weight: 700; font-size: 12px; color: var(--text-main); width: 100%; outline: none;" />
            </div>
            <button type="button" onclick="removeSnowballDebtRow(${idx})" 
              style="border: none; background: rgba(239, 68, 68, 0.1); color: #ef4444; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 11px; cursor: pointer;" title="Eliminar deuda">✕</button>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 10px; color: var(--text-muted); display: block; margin-bottom: 2px;">Saldo Pendiente (S/)</label>
              <input type="number" min="1" step="10" value="${d.balance}" 
                oninput="updateSnowballDebt(${idx}, 'balance', this.value)"
                style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 5px 8px; font-size: 12px; font-weight: 700; color: #0f172a; outline: none; background: white;" />
            </div>
            <div>
              <label style="font-size: 10px; color: var(--text-muted); display: block; margin-bottom: 2px;">Cuota Mínima (S/)</label>
              <input type="number" min="1" step="5" value="${d.minPayment}" 
                oninput="updateSnowballDebt(${idx}, 'minPayment', this.value)"
                style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 5px 8px; font-size: 12px; font-weight: 700; color: #0f172a; outline: none; background: white;" />
            </div>
          </div>
        </div>
      `).join('');
    }

    function updateSnowballDebt(idx, field, value) {
      if (!currentSnowballDebts[idx]) return;
      if (field === 'name') {
        currentSnowballDebts[idx].name = value || 'Deuda sin nombre';
      } else if (field === 'balance') {
        currentSnowballDebts[idx].balance = Math.max(1, parseFloat(value) || 0);
      } else if (field === 'minPayment') {
        currentSnowballDebts[idx].minPayment = Math.max(1, parseFloat(value) || 0);
      }
      calculateDebtSnowball();
    }

    function addSnowballDebtRow() {
      const newId = 'd_' + Date.now();
      currentSnowballDebts.push({
        id: newId,
        name: 'Nueva Deuda #' + (currentSnowballDebts.length + 1),
        balance: 1000,
        minPayment: 100
      });
      renderSnowballDebtsList();
      calculateDebtSnowball();
    }

    function removeSnowballDebtRow(idx) {
      currentSnowballDebts.splice(idx, 1);
      renderSnowballDebtsList();
      calculateDebtSnowball();
    }

    function calculateDebtSnowball() {
      const extraInput = document.getElementById('snowballExtraPayment');
      const extraPayment = Math.max(0, parseFloat(extraInput ? extraInput.value : 0) || 0);

      const totalMonthsEl = document.getElementById('snowballTotalMonths');
      const monthlyFreedEl = document.getElementById('snowballMonthlyFreed');
      const timeSavedEl = document.getElementById('snowballTimeSaved');
      const attackPlanEl = document.getElementById('snowballAttackPlan');

      if (!currentSnowballDebts || currentSnowballDebts.length === 0) {
        if (totalMonthsEl) totalMonthsEl.textContent = '0 meses';
        if (monthlyFreedEl) monthlyFreedEl.textContent = 'S/ 0 / mes';
        if (timeSavedEl) timeSavedEl.textContent = '¡Sin deudas activas!';
        if (attackPlanEl) attackPlanEl.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 12px; padding: 16px;">Añade tus deudas para calcular tu plan de amortización.</div>';
        return;
      }

      // 1. Ordenar de menor a mayor saldo (Regla de Oro Bola de Nieve)
      const sorted = currentSnowballDebts.map((d, originalIdx) => ({
        ...d,
        originalIdx,
        balance: parseFloat(d.balance) || 0,
        minPayment: parseFloat(d.minPayment) || 0
      })).sort((a, b) => a.balance - b.balance);

      // 2. Simulación de la Bola de Nieve
      let workingDebts = sorted.map(d => ({
        ...d,
        currentBalance: d.balance,
        paidMonth: 0,
        allocatedPayment: d.minPayment
      }));

      let snowballPot = extraPayment;
      let month = 0;
      const maxMonths = 360;

      while (workingDebts.some(d => d.currentBalance > 0) && month < maxMonths) {
        month++;
        let availableExtra = snowballPot;

        for (let i = 0; i < workingDebts.length; i++) {
          const debt = workingDebts[i];
          if (debt.currentBalance <= 0) continue;

          let payment = debt.minPayment;
          const isTargetDebt = (i === workingDebts.findIndex(d => d.currentBalance > 0));
          if (isTargetDebt) {
            payment += availableExtra;
            debt.allocatedPayment = payment;
            availableExtra = 0;
          }

          debt.currentBalance -= payment;

          if (debt.currentBalance <= 0) {
            debt.currentBalance = 0;
            debt.paidMonth = month;
            snowballPot += debt.minPayment;
          }
        }
      }

      const totalFreed = sorted.reduce((sum, d) => sum + d.minPayment, 0) + extraPayment;

      if (totalMonthsEl) totalMonthsEl.textContent = `${month} ${month === 1 ? 'mes' : 'meses'}`;
      if (monthlyFreedEl) monthlyFreedEl.textContent = `S/ ${Math.round(totalFreed)} / mes`;
      if (timeSavedEl) timeSavedEl.textContent = `¡100% libre de deudas en ${month} meses!`;

      // Renderizar los escalones de ataque
      if (attackPlanEl) {
        attackPlanEl.innerHTML = workingDebts.map((d, rank) => {
          const isTarget = rank === 0;
          const badgeText = isTarget ? '🎯 OBJETIVO #1: ATAQUE TOTAL' : `🛡️ OBJETIVO #${rank + 1}: MÍNIMO`;
          const badgeBg = isTarget ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : '#f1f5f9';
          const badgeColor = isTarget ? '#ffffff' : '#64748b';
          const borderColor = isTarget ? '#818cf8' : 'rgba(226, 232, 240, 0.9)';
          const bgColor = isTarget ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255, 255, 255, 0.8)';
          
          return `
            <div style="background: ${bgColor}; border: 1.5px solid ${borderColor}; border-radius: 12px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 9.5px; font-weight: 800; background: ${badgeBg}; color: ${badgeColor}; padding: 2px 7px; border-radius: 6px; letter-spacing: 0.04em;">${badgeText}</span>
                <span style="font-size: 11px; font-weight: 800; color: #10b981;">Mes ${d.paidMonth || month} ✅</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <div style="font-size: 12px; font-weight: 800; color: var(--text-main);">${escapeHtml(d.name)}</div>
                <div style="font-size: 11.5px; font-weight: 800; color: #4f46e5;">S/ ${d.balance.toLocaleString()}</div>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 10.5px; color: var(--text-muted);">
                <span>${isTarget ? 'Cuota + Abono Extra:' : 'Cuota mínima:'}</span>
                <strong style="color: ${isTarget ? '#4f46e5' : 'var(--text-main)'}; font-size: 11px;">S/ ${Math.round(d.allocatedPayment)} / mes</strong>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    function saveDebtSnowballPlan() {
      const extraInput = document.getElementById('snowballExtraPayment');
      const extraPayment = Math.max(0, parseFloat(extraInput ? extraInput.value : 0) || 0);

      appState.debtSnowball = {
        debts: currentSnowballDebts,
        extraPayment: extraPayment,
        updatedAt: new Date().toISOString()
      };

      try {
        localStorage.setItem('aliviafin_debt_snowball', JSON.stringify(appState.debtSnowball));
      } catch(e) {}

      syncStateToServer();
      showToast('❄️ Plan Anti-Deudas guardado con éxito en tu perfil', 'success');
      closeGlassModal('debtSnowballModal');
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
window.startInteractiveTour = startInteractiveTour;
window.toggleFAB = typeof toggleFAB === 'function' ? toggleFAB : function(){};
window.openAddExpenseModal = openAddExpenseModal;
window.openAddExtraIncomeModal = openAddExtraIncomeModal;
window.openCategoryManagerModal = openCategoryManagerModal;
window.openFeedbackModal = openFeedbackModal;
window.openInstallmentsSimulatorModal = openInstallmentsSimulatorModal;
window.handleSimulatedPurchaseClick = handleSimulatedPurchaseClick;
window.handleSaveCategoryClick = handleSaveCategoryClick;
window.handleOpenAddGoalClick = handleOpenAddGoalClick;
window.handleDebtAdvisorClick = handleDebtAdvisorClick;
window.openDebtSnowballModal = openDebtSnowballModal;
window.renderSnowballDebtsList = renderSnowballDebtsList;
window.updateSnowballDebt = updateSnowballDebt;
window.addSnowballDebtRow = addSnowballDebtRow;
window.removeSnowballDebtRow = removeSnowballDebtRow;
window.calculateDebtSnowball = calculateDebtSnowball;
window.saveDebtSnowballPlan = saveDebtSnowballPlan;
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
window.completeOnboardingWizard = completeOnboardingWizard;
window.dismissOnboardingWizard = dismissOnboardingWizard;
window.openWhatsNewModal = openWhatsNewModal;
window.dismissWhatsNewModal = dismissWhatsNewModal;
window.syncVersionUI = syncVersionUI;


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
  
  // Header
  let html = `
    <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <h1 style="margin: 0; color: #4f46e5; font-size: 28px; font-weight: 800;">AliviaFin</h1>
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
        <p style="margin: 0; font-size: 24px; font-weight: 800; color: #10b981;">S/ ${sueldo.toFixed(2)}</p>
      </div>
      <div style="flex: 1; padding: 15px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
        <p style="margin: 0 0 5px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Gastos Reales</p>
        <p style="margin: 0; font-size: 24px; font-weight: 800; color: #ef4444;">S/ ${gastos.toFixed(2)}</p>
      </div>
      <div style="flex: 1; padding: 15px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
        <p style="margin: 0 0 5px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Saldo Disponible</p>
        <p style="margin: 0; font-size: 24px; font-weight: 800; color: #3b82f6;">S/ ${saldo.toFixed(2)}</p>
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
            <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700;">S/ ${t.amount.toFixed(2)}</td>
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
  html2pdf().set(opt).from(element).save().then(() => {
    showToast('¡PDF descargado exitosamente!', 'success');
  });
};
window.exportMonthlyReportPDF = window.generatePDFReport;

