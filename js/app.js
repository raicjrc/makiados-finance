    document.addEventListener('DOMContentLoaded', () => {

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
        updateSyncIndicator('syncing', '🔄 Sincronizando...');
        // handleAppWakeup() (listener 'online' superior) ya recarga el estado: evitamos doble sync
      });
      document.addEventListener('keydown', (e) => {
        const quickModal = document.getElementById('quickExpenseModal');
        const isQuickOpen = quickModal && (quickModal.style.display === 'flex' || quickModal.style.display === 'block');

        if (isQuickOpen) {
          if (e.key === 'Escape' || e.key === 'Esc') {
            closeQuickExpenseModal();
            return;
          }

          const smartInput = document.getElementById('smartQuickExpenseInput');
          const amountInput = document.getElementById('quickDisplayAmount');

          if (document.activeElement === smartInput) {
            if (e.key === 'Enter') {
              e.preventDefault();
              saveQuickExpense();
            }
            return;
          }

          if (document.activeElement === amountInput) {
            if (e.key === 'Enter') {
              e.preventDefault();
              saveQuickExpense();
            }
            return;
          }

          if ((e.key >= '0' && e.key <= '9') || e.key === '.' || e.key === ',') {
            e.preventDefault();
            const char = (e.key === ',') ? '.' : e.key;
            handleQuickKeypad(char);
            if (amountInput) amountInput.focus();
          } else if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            handleQuickKeypad('backspace');
            if (amountInput) amountInput.focus();
          } else if (e.key === 'Enter') {
            e.preventDefault();
            saveQuickExpense();
          }
          return;
        }

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
      if (typeof updateSimulation === 'function' && document.getElementById('simulador')?.classList.contains('active')) {
        updateSimulation();
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

      if (typeof renderDesktopExecutiveCharts === 'function') {
        renderDesktopExecutiveCharts();
      }
      if (typeof renderRescueDashBanner === 'function') {
        renderRescueDashBanner();
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

    function renderTransactionsSkeleton(count = 4) {
      const container = document.getElementById('txTableBody');
      if (!container) return;
      let skeletonHtml = '';
      for (let i = 0; i < count; i++) {
        const rowWidth = 50 + (i * 12);
        skeletonHtml += `
          <tr class="tx-row-item skeleton-row">
            <td class="tx-cell-concept">
              <div class="tx-concept-main">
                <div class="skeleton-shimmer" style="width: 28px; height: 28px; border-radius: 8px;"></div>
                <div style="flex: 1; display: flex; flex-direction: column; gap: 5px;">
                  <div class="skeleton-shimmer" style="width: ${rowWidth}%; height: 13px;"></div>
                  <div class="skeleton-shimmer" style="width: 35%; height: 9px;"></div>
                </div>
              </div>
            </td>
            <td><div class="skeleton-shimmer" style="width: 58px; height: 18px; border-radius: 12px;"></div></td>
            <td><div class="skeleton-shimmer" style="width: 64px; height: 18px; border-radius: 12px;"></div></td>
            <td style="text-align: right;"><div class="skeleton-shimmer" style="width: 62px; height: 14px; margin-left: auto;"></div></td>
            <td><div class="skeleton-shimmer" style="width: 48px; height: 22px; border-radius: 6px; margin: auto;"></div></td>
          </tr>
        `;
      }
      container.innerHTML = skeletonHtml;
    }
    window.renderTransactionsSkeleton = renderTransactionsSkeleton;

    function changeMonth(month) {
      sessionStorage.setItem('aliviafin_session_month', month);
      appState.currentMonth = month;
      ensureMonthTransactions(month);
      ensureMonthIncomes(month);
      saveState();

      // Transición visual elegante estilo Apple (skeleton suave sin layout shifts)
      renderTransactionsSkeleton();
      setTimeout(() => {
        renderAll();
      }, 120);
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
    // REBALANCEO DINÁMICO DE SIMETRÍA EN DESKTOP (OPCIÓN 1)
    // Mueve la tarjeta de Distribución de Gastos a la izquierda cuando
    // hay próximos vencimientos activos para mantener simetría visual perfecta.
    // ================================================================
    function rebalanceDesktopDashboardLayout(hasUpcomingBills) {
      if (window.innerWidth <= 768) return; // En móvil se preserva el flujo vertical nativo
      const distCard = document.getElementById('desktopCategoryDistributionCard');
      const slotLeft = document.getElementById('desktopCategorySlotLeft');
      const slotRight = document.getElementById('desktopCategorySlotRight');
      if (!distCard || !slotLeft || !slotRight) return;

      const targetSlot = hasUpcomingBills ? slotLeft : slotRight;
      if (distCard.parentElement !== targetSlot) {
        if (desktopCategoryChartObj) {
          try { desktopCategoryChartObj.destroy(); } catch (e) {}
          desktopCategoryChartObj = null;
        }
        targetSlot.appendChild(distCard);
        if (typeof renderDesktopExecutiveCharts === 'function') {
          setTimeout(() => {
            renderDesktopExecutiveCharts();
          }, 20);
        }
      }
    }

    // ================================================================
    // RADAR DE PRÓXIMOS VENCIMIENTOS (APPLE FINTECH CARD v67.0)
    // ================================================================
    let _upcomingViewMode = 'calendar';
    let _upcomingSelectedDay = null;

    function setUpcomingViewMode(mode) {
      _upcomingViewMode = mode;
      _upcomingSelectedDay = null;
      renderUpcomingDueDates();
    }

    function selectUpcomingCalendarDay(day) {
      _upcomingSelectedDay = (_upcomingSelectedDay === day) ? null : day;
      renderUpcomingDueDates();
    }

    // ================================================================
    // RADAR DE PRÓXIMOS VENCIMIENTOS & MINI CALENDARIO (APPLE FINTECH HIG)
    // ================================================================
    function renderUpcomingDueDates() {
      const container = document.getElementById('upcomingBillsContainer');
      if (!container) return;

      const txs = getMonthTxList();
      const now = new Date();
      const today = now.getDate();
      const sym = getCurrencySymbol();
      const loc = getActiveCurrency().locale;
      const isCurrentRealMonth = (appState.currentMonth === getCurrentCalendarMonthName());

      // Filtrar gastos pendientes del mes actual
      const pendingTxs = txs.filter(t => (t.status || 'Pagado') === 'Pendiente');

      if (pendingTxs.length === 0) {
        rebalanceDesktopDashboardLayout(false);
        if (txs.length === 0) {
          container.innerHTML = '';
          return;
        }
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

      // Mapear con días restantes y fecha efectiva
      const withDue = pendingTxs.map(t => {
        const dueDay = parseInt(getEffectiveDueDate(t)) || 15;
        const daysDiff = dueDay - today;
        return {
          ...t,
          dueDay,
          daysDiff
        };
      });

      // Si hay pendientes, mantener layout equilibrado
      rebalanceDesktopDashboardLayout(true);

      const totalUpcomingSum = pendingTxs.reduce((acc, curr) => acc + (curr.amount || 0), 0);

      // Agrupar facturas por día
      const billsByDay = {};
      withDue.forEach(t => {
        if (!billsByDay[t.dueDay]) billsByDay[t.dueDay] = [];
        billsByDay[t.dueDay].push(t);
      });

      // Cálculo de días del mes actual para el Mini-Calendario
      const curMonthStr = appState.currentMonth || getCurrentCalendarMonthName();
      const monthParts = curMonthStr.split(' ');
      const monthName = monthParts[0] || 'Octubre';
      const yearNum = parseInt(monthParts[1]) || now.getFullYear();
      const monthsEs = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      let monthIdx = monthsEs.indexOf(monthName);
      if (monthIdx === -1) monthIdx = now.getMonth();
      const daysInMonth = new Date(yearNum, monthIdx + 1, 0).getDate();
      const firstWeekday = (new Date(yearNum, monthIdx, 1).getDay() + 6) % 7; // Lunes = 0, Domingo = 6

      // Determinar qué facturas mostrar en la lista
      let displayItems = [];
      let listTitle = '';
      let isFilteredByDay = false;

      if (_upcomingViewMode === 'calendar' && _upcomingSelectedDay !== null) {
        isFilteredByDay = true;
        displayItems = billsByDay[_upcomingSelectedDay] || [];
        listTitle = `Día ${_upcomingSelectedDay} (${displayItems.length} pago${displayItems.length !== 1 ? 's' : ''})`;
      } else {
        const sorted = [...withDue].sort((a, b) => a.daysDiff - b.daysDiff);
        displayItems = _upcomingViewMode === 'calendar' ? sorted.slice(0, 3) : sorted;
        listTitle = 'Próximos a vencer';
      }

      // Generar Grilla del Mini-Calendario
      let calendarGridHtml = '';
      if (_upcomingViewMode === 'calendar') {
        const weekdays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
        calendarGridHtml += weekdays.map(w => `<div class="mini-calendar-weekday">${w}</div>`).join('');

        for (let e = 0; e < firstWeekday; e++) {
          calendarGridHtml += `<div class="mini-calendar-day is-empty"></div>`;
        }

        for (let d = 1; d <= daysInMonth; d++) {
          const isToday = (d === today && isCurrentRealMonth);
          const dayBills = billsByDay[d] || [];
          const hasBills = dayBills.length > 0;
          const isSelected = (_upcomingSelectedDay === d);

          let dotsHtml = '';
          if (hasBills) {
            const hasCard = dayBills.some(b => b.isInstallment || b.paymentMethod === 'Tarjeta' || (b.category && b.category.toLowerCase().includes('tarjeta')));
            const isOverdue = isCurrentRealMonth && (d < today);
            const dotType = isOverdue ? 'dot-urgent' : (hasCard ? 'dot-card' : 'dot-normal');
            dotsHtml = `<div class="mini-calendar-dot-wrap"><span class="mini-cal-dot ${dotType}"></span></div>`;
          }

          const dayClasses = [
            'mini-calendar-day',
            isToday ? 'is-today' : '',
            isSelected ? 'is-selected' : '',
            hasBills ? 'has-bills' : ''
          ].filter(Boolean).join(' ');

          calendarGridHtml += `
            <div class="${dayClasses}" onclick="selectUpcomingCalendarDay(${d})" title="${hasBills ? dayBills.length + ' pago(s) el día ' + d : 'Día ' + d}">
              <span>${d}</span>
              ${dotsHtml}
            </div>
          `;
        }
      }

      container.innerHTML = `
        <div class="upcoming-bills-card">
          <!-- Cabecera con Switcher Calendario / Lista -->
          <div class="upcoming-bills-header">
            <div class="upcoming-bills-title">
              <span>🗓️</span>
              <span>Vencimientos</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: flex-end;">
              <div class="upcoming-bills-sum-badge" title="Total de compromisos pendientes de pago este mes">
                ${pendingTxs.length} pendientes · Total ${sym} ${totalUpcomingSum.toLocaleString(loc, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div class="upcoming-view-switcher">
                <button type="button" class="upcoming-switch-btn ${_upcomingViewMode === 'calendar' ? 'active' : ''}" onclick="setUpcomingViewMode('calendar')" title="Vista Calendario Mensual">📅 Mes</button>
                <button type="button" class="upcoming-switch-btn ${_upcomingViewMode === 'list' ? 'active' : ''}" onclick="setUpcomingViewMode('list')" title="Vista Lista Completa">📋 Lista</button>
              </div>
            </div>
          </div>

          <!-- Vista Calendario Activa -->
          ${_upcomingViewMode === 'calendar' ? `
            <div class="mini-calendar-widget">
              <div class="mini-calendar-nav">
                <span class="mini-calendar-month-label">${monthName} ${yearNum}</span>
                ${_upcomingSelectedDay !== null ? `
                  <button type="button" onclick="selectUpcomingCalendarDay(${_upcomingSelectedDay})" style="background: none; border: none; font-size: 11px; font-weight: 700; color: #6366f1; cursor: pointer; padding: 0;">
                    ✕ Ver todos
                  </button>
                ` : `
                  <span style="font-size: 10.5px; color: #64748b; font-weight: 600;">Toca un día para filtrar</span>
                `}
              </div>
              <div class="mini-calendar-grid">
                ${calendarGridHtml}
              </div>
              <div class="mini-calendar-legend">
                <span class="mini-cal-legend-item"><span class="mini-cal-dot dot-card"></span> Tarjetas/Cuotas</span>
                <span class="mini-cal-legend-item"><span class="mini-cal-dot dot-normal"></span> Vencimientos</span>
                <span class="mini-cal-legend-item"><span class="mini-cal-dot dot-urgent"></span> Vencidos</span>
              </div>
            </div>
          ` : ''}

          <!-- Lista de Pagos / Vencimientos -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-size: 11.5px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.02em;">
              ${listTitle}
            </div>
            ${isFilteredByDay ? `
              <button type="button" onclick="selectUpcomingCalendarDay(${_upcomingSelectedDay})" style="background:none; border:none; font-size:11px; font-weight:700; color:#6366f1; cursor:pointer;">
                Mostrar próximos
              </button>
            ` : ''}
          </div>

          <div class="upcoming-bills-list">
            ${displayItems.length === 0 ? `
              <div style="text-align: center; padding: 14px; font-size: 11.5px; color: #64748b; background: rgba(0,0,0,0.02); border-radius: 12px;">
                No hay pagos pendientes registrados para este día.
              </div>
            ` : displayItems.map(item => {
              const catInfo = CATEGORIES[item.category] || { icon: '💳' };
              const icon = catInfo.icon || '💳';
              
              let pillClass = 'due-pill-soon';
              let pillText = `En ${item.daysDiff}d`;
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

          ${(_upcomingViewMode === 'calendar' && !isFilteredByDay && withDue.length > 3) ? `
            <div style="text-align: center; margin-top: 10px;">
              <button type="button" onclick="setUpcomingViewMode('list')" style="background:none; border:none; color:#6366f1; font-size:11.5px; font-weight:800; cursor:pointer;">
                Ver los ${withDue.length} pagos pendientes en lista ➔
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

    async function applyReconciliationAdjustment() {
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
          category: 'Otros',
          status: 'Pagado',
          paymentMethod: 'Banco',
          date: new Date().getDate()
        });
        addAuditLog('⚖️ Conciliación', `Ajuste de gasto -${sym} ${absAmount.toLocaleString(loc)} para cuadrar con banco en ${month}`);
      }

      markLocalMutationDirty();
      saveLocalState();
      renderAll();
      closeModal('reconcileBalanceModal');

      // Sincronizar determinísticamente con Supabase
      try {
        await flushSyncToServer();
        showToast('✅ Saldo conciliado y guardado en la nube', 'success');
      } catch (e) {
        showToast('✅ Saldo guardado localmente', 'info');
      }
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
      const viewAllBtn = badge ? badge.closest('button') : null;
      if (!container) return;

      const txs = getMonthTxList();
      if (badge) badge.textContent = txs.length.toString();
      if (viewAllBtn) viewAllBtn.style.display = txs.length === 0 ? 'none' : 'inline-flex';

      const sym = getCurrencySymbol();
      const loc = getActiveCurrency().locale;
      const now = new Date();
      const today = now.getDate();
      const curMonthName = appState.currentMonth || getCurrentCalendarMonthName();
      const isCurrentRealMonth = (curMonthName === getCurrentCalendarMonthName());

      // Helper seguro para extraer el día numérico de una transacción
      function getTxDayLabel(t, isFallbackMonth = false) {
        if (isFallbackMonth && t._fromMonth) {
          const mShort = t._fromMonth.split(' ')[0];
          return mShort;
        }
        let d = null;
        if (typeof t.date === 'string' && t.date.includes('-')) {
          const parts = t.date.split('-');
          d = parseInt(parts[2]);
        } else if (typeof t.date === 'number' && !isNaN(t.date)) {
          d = t.date;
        } else if (typeof t.date === 'string' && !isNaN(parseInt(t.date))) {
          d = parseInt(t.date);
        } else if (t.dueDate) {
          d = parseInt(t.dueDate);
        }
        if (d && !isNaN(d)) {
          if (isCurrentRealMonth && !isFallbackMonth) {
            if (d === today) return 'Hoy';
            if (d === today - 1) return 'Ayer';
          }
          return `Día ${d}`;
        }
        return '';
      }

      // Tomar los últimos movimientos registrados en el mes
      let recentItems = [...txs].reverse().slice(0, 4);
      let isShowingFallback = false;

      // Si en el mes actual hay menos de 3 movimientos, buscar en meses anteriores para mostrar al menos los 3 últimos
      if (recentItems.length < 3 && appState.transactions) {
        const sortedMonths = (typeof getSortedMonths === 'function' ? getSortedMonths() : Object.keys(appState.transactions)).slice().reverse();
        for (const m of sortedMonths) {
          if (m === curMonthName) continue;
          const otherTxs = appState.transactions[m] || [];
          if (otherTxs.length > 0) {
            const needed = 3 - recentItems.length;
            const extra = [...otherTxs].reverse().slice(0, needed).map(it => ({ ...it, _fromMonth: m }));
            recentItems = recentItems.concat(extra);
            isShowingFallback = true;
          }
          if (recentItems.length >= 3) break;
        }
      }

      if (recentItems.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 22px 10px; color: var(--text-muted); font-size: 12px;">
            <span style="font-size: 26px; display: block; margin-bottom: 6px;">✨</span>
            Aún no tienes gastos registrados en tu cuenta.<br>
            <button type="button" class="btn btn-primary btn-sm" onclick="openQuickExpenseModal()" style="margin-top: 10px; font-size: 11.5px; padding: 6px 14px;">
              ⚡ Registrar Gasto en 1 toque
            </button>
          </div>
        `;
        return;
      }

      let html = '';
      if (txs.length === 0 && isShowingFallback) {
        html += `
          <div style="font-size: 11px; color: var(--text-muted); font-weight: 600; padding: 2px 4px 8px 4px; display: flex; align-items: center; justify-content: space-between;">
            <span>✨ Últimos movimientos registrados</span>
            <span style="font-size: 10px; opacity: 0.8;">(Meses anteriores)</span>
          </div>
        `;
      }

      html += '<div class="timeline-day-list" style="display: flex; flex-direction: column; gap: 4px;">';

      recentItems.forEach(t => {
        const catInfo = CATEGORIES[t.category] || { icon: '🏷️', color: '#6366f1' };
        const icon = catInfo.icon || '🏷️';
        const baseColor = catInfo.color || '#6366f1';
        const isPagado = (t.status || 'Pagado') === 'Pagado';
        const methodText = t.paymentMethod ? escapeHtml(t.paymentMethod) : '';
        const isFallback = !!t._fromMonth;
        const dayLabel = getTxDayLabel(t, isFallback);

        const squircleStyle = `background: ${baseColor}18; color: ${baseColor};`;
        const itemMonth = t._fromMonth || curMonthName;

        html += `
          <div class="timeline-tx-row" data-id="${escapeHtml(t.id)}" data-month="${escapeHtml(itemMonth)}" onclick="openEditExpenseModal(this.getAttribute('data-id'), this.getAttribute('data-month'))" title="Toca para ver o editar" style="cursor: pointer; padding: 8px 10px; border-radius: 12px; transition: background 0.15s ease;">
            <div class="timeline-tx-left">
              <div class="timeline-squircle-icon" style="${squircleStyle}">
                ${icon}
              </div>
              <div class="timeline-tx-info">
                <div class="timeline-tx-name" style="font-weight: 700; font-size: 13px;">${escapeHtml(t.name)}</div>
                <div class="timeline-tx-meta" style="display: flex; align-items: center; gap: 5px; flex-wrap: wrap; margin-top: 2px;">
                  <span class="timeline-meta-pill">${escapeHtml(t.category)}</span>
                  ${t._fromMonth ? `<span class="timeline-meta-pill" style="font-weight: 700; color: var(--primary);">🗓️ ${escapeHtml(t._fromMonth.split(' ')[0])}</span>` : ''}
                  ${dayLabel ? `<span class="timeline-meta-pill" style="font-weight: 700;">📅 ${dayLabel}</span>` : ''}
                  ${methodText ? `<span class="timeline-meta-pill">💳 ${methodText}</span>` : ''}
                  ${isPagado ? '<span style="color: #059669; font-size: 10.5px; font-weight: 700; background: #ecfdf5; padding: 1px 6px; border-radius: 6px;">✓ Pagado</span>' : '<span style="color: #d97706; font-size: 10.5px; font-weight: 700; background: #fef3c7; padding: 1px 6px; border-radius: 6px;">⏳ Pendiente</span>'}
                </div>
              </div>
            </div>
            <div class="timeline-tx-amount ${isPagado ? '' : 'is-pending'}" style="font-weight: 800; font-size: 13.5px; text-align: right; white-space: nowrap;">
              ${sym} ${(t.amount || 0).toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        `;
      });

      html += '</div>';

      if (txs.length === 0 && isShowingFallback) {
        html += `
          <div style="text-align: center; margin-top: 10px; padding-top: 4px;">
            <button type="button" class="btn btn-primary btn-sm" onclick="openQuickExpenseModal()" style="font-size: 11.5px; padding: 6px 14px;">
              ⚡ Registrar Gasto en ${curMonthName}
            </button>
          </div>
        `;
      } else if (txs.length > 4) {
        html += `
          <div style="text-align: center; margin-top: 10px; padding-top: 4px; border-top: 1px solid var(--border-light, rgba(0,0,0,0.05));">
            <button type="button" onclick="switchTab('movimientos')" style="background: none; border: none; color: var(--primary); font-size: 11.5px; font-weight: 800; cursor: pointer; padding: 4px;">
              Ver todos los ${txs.length} movimientos del mes ➔
            </button>
          </div>
        `;
      }

      container.innerHTML = html;
    }

    /* ====== REGISTRO RÁPIDO EXPRESS & SMART QUICK-INPUT (MONAI & APPLE) ====== */
    let _quickAmountBuffer = '0';
    let _quickSelectedMethod = 'Yape';
    let _quickSelectedCategory = 'Comida fuera';
    let _quickCustomName = '';
    let _voiceRecognition = null;
    let _isVoiceRecording = false;

    function parseSmartQuickExpenseText(rawText) {
      if (!rawText || typeof rawText !== 'string') return null;
      const text = rawText.trim();
      if (!text) return null;

      let working = text;
      let parsedAmount = null;
      let parsedMethod = null;
      let parsedCategory = null;
      let parsedName = '';

      // 1. Extraer Monto (ej. "S/ 35.50", "35,50", "35", "S/35")
      const amountRegex = /(?:s\/?\.?\s*)?(\d+(?:[.,]\d{1,2})?)/i;
      const amountMatch = working.match(amountRegex);
      if (amountMatch) {
        const rawNum = amountMatch[1].replace(',', '.');
        const val = parseFloat(rawNum);
        if (!isNaN(val) && val > 0) {
          parsedAmount = Math.round((val + Number.EPSILON) * 100) / 100;
          working = working.replace(amountMatch[0], ' ');
        }
      }

      // 2. Extraer Método / Cuenta
      const methodMap = [
        { regex: /\b(yape|plin|billetera)\b/i, method: 'Yape' },
        { regex: /\b(efectivo|cash|monedas?|billetes?)\b/i, method: 'Efectivo' },
        { regex: /\b(tarjeta|debito|débito|credito|crédito|bcp|bbva|interbank|scotiabank|pos)\b/i, method: 'Tarjeta' }
      ];

      for (const item of methodMap) {
        if (item.regex.test(working)) {
          parsedMethod = item.method;
          working = working.replace(item.regex, ' ');
          break;
        }
      }

      // 3. Extraer Categoría (orden de precedencia intuitivo)
      const categoryMap = [
        {
          cat: 'Comida casa',
          icon: '🛒',
          regex: /\b(supermercado|super|plaza\s*vea|tottus|vivanda|wong|metro|mercado|bodega|abarrotes|frutas|verduras|makro)\b/i
        },
        {
          cat: 'Comida fuera',
          icon: '🍽️',
          regex: /\b(almuerzo|comida|cena|desayuno|menu|menú|restaurant|restaurante|chifa|pollito|pizza|hamburguesa|sushi|delivery|rappi|pedidosya)\b/i
        },
        {
          cat: 'Carro',
          icon: '🚕',
          regex: /\b(taxi|uber|didi|cabify|pasaje|gasolina|cochera|peaje|estacionamiento|combustible|bus|corredor|tren)\b/i
        },
        {
          cat: 'Otros',
          icon: '☕',
          regex: /\b(caf[eé]|cafeteria|cafetería|starbucks|antojo|helado|postre|snack|golosina|dulce|pan|galleta|gustito)\b/i
        },
        {
          cat: 'Gimnasio & Salud',
          icon: '💊',
          regex: /\b(farmacia|medicina|pastillas|medicamento|doctor|clinica|clínica|salud|gym|gimnasio|smartfit|inkafarma|mifarma)\b/i
        },
        {
          cat: 'Casa',
          icon: '🏠',
          regex: /\b(casa|luz|agua|gas|calidda|cálidda|enel|sedapal|alquiler|hogar|servicio|mantenimiento)\b/i
        },
        {
          cat: 'Comida gatitos casa',
          icon: '🐱',
          regex: /\b(gatitos?|gatos?|michi|comida gato|arena gato|whiskas|ricocan|veterinaria)\b/i
        },
        {
          cat: 'Suscripciones',
          icon: '📺',
          regex: /\b(netflix|spotify|disney|youtube|prime|icloud|apple|streaming)\b/i
        }
      ];

      let matchedIcon = '🏷️';
      for (const item of categoryMap) {
        if (item.regex.test(working)) {
          parsedCategory = item.cat;
          matchedIcon = item.icon;
          break;
        }
      }

      // 4. Limpiar y formatear Concepto (Nombre)
      let cleanName = working
        .replace(/[,\-_/]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleanName.length > 0) {
        parsedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      } else if (parsedCategory) {
        parsedName = parsedCategory;
      } else if (parsedMethod) {
        parsedName = 'Gasto ' + parsedMethod;
      }

      return {
        raw: text,
        amount: parsedAmount,
        method: parsedMethod,
        category: parsedCategory,
        categoryIcon: matchedIcon,
        name: parsedName
      };
    }

    function handleSmartQuickInputChange(rawText) {
      const parsed = parseSmartQuickExpenseText(rawText);
      const preview = document.getElementById('smartChipsPreview');
      if (!parsed || (!parsed.amount && !parsed.name && !parsed.category)) {
        if (preview) preview.style.display = 'none';
        _quickCustomName = '';
        return;
      }

      if (preview) preview.style.display = 'flex';

      // Sincronizar Monto
      if (parsed.amount !== null) {
        _quickAmountBuffer = String(parsed.amount);
        updateQuickDisplay();
        const chipAmount = document.getElementById('smartChipAmountText');
        if (chipAmount) chipAmount.textContent = `S/ ${parsed.amount.toFixed(2)}`;
      }

      // Sincronizar Método
      if (parsed.method) {
        selectQuickMethod(parsed.method);
        const chipMethod = document.getElementById('smartChipMethodText');
        if (chipMethod) chipMethod.textContent = parsed.method;
        const chipMethodIcon = document.getElementById('smartChipMethodIcon');
        if (chipMethodIcon) {
          chipMethodIcon.textContent = parsed.method === 'Yape' ? '💜' : (parsed.method === 'Efectivo' ? '💵' : '💳');
        }
      }

      // Sincronizar Categoría
      if (parsed.category) {
        _quickSelectedCategory = parsed.category;
        document.querySelectorAll('.quick-cat-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-cat') === parsed.category);
        });
        const chipCat = document.getElementById('smartChipCatText');
        if (chipCat) chipCat.textContent = parsed.name || parsed.category;
        const chipCatIcon = document.getElementById('smartChipCatIcon');
        if (chipCatIcon) chipCatIcon.textContent = parsed.categoryIcon;
      }

      _quickCustomName = parsed.name || '';
    }

    function handleSmartQuickInputEnter(event) {
      if (event) event.preventDefault();
      saveQuickExpense();
    }

    function toggleVoiceDictation() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        showToast('🎙️ Dictado por voz no disponible en este navegador. Usa Safari o Chrome.', 'warning');
        return;
      }

      const btn = document.getElementById('smartVoiceBtn');
      const icon = document.getElementById('voiceMicIcon');
      const input = document.getElementById('smartQuickExpenseInput');

      if (_isVoiceRecording) {
        if (_voiceRecognition) {
          try { _voiceRecognition.stop(); } catch(e) {}
        }
        _isVoiceRecording = false;
        if (btn) btn.classList.remove('is-recording');
        if (icon) icon.textContent = '🎙️';
        return;
      }

      try {
        _voiceRecognition = new SpeechRecognition();
        _voiceRecognition.lang = 'es-PE';
        _voiceRecognition.continuous = false;
        _voiceRecognition.interimResults = true;

        _voiceRecognition.onstart = () => {
          _isVoiceRecording = true;
          if (btn) btn.classList.add('is-recording');
          if (icon) icon.textContent = '🔴';
          showToast('🎙️ Escuchando... Di ej. "35 almuerzo yape"', 'info', 2000);
        };

        _voiceRecognition.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          if (input && transcript) {
            input.value = transcript;
            handleSmartQuickInputChange(transcript);
          }
        };

        _voiceRecognition.onerror = (event) => {
          console.warn('Speech recognition error:', event.error);
          _isVoiceRecording = false;
          if (btn) btn.classList.remove('is-recording');
          if (icon) icon.textContent = '🎙️';
          if (event.error === 'not-allowed') {
            showToast('⚠️ Permiso de micrófono no habilitado en este navegador. Puedes escribir directamente.', 'warning');
          } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
            // Silencioso o informativo leve para evitar alertas falsas por pausas normales de silencio
            console.info('Voice recognition ended with state:', event.error);
          }
        };

        _voiceRecognition.onend = () => {
          _isVoiceRecording = false;
          if (btn) btn.classList.remove('is-recording');
          if (icon) icon.textContent = '🎙️';
        };

        _voiceRecognition.start();
      } catch (err) {
        console.error('Error starting voice recognition:', err);
        _isVoiceRecording = false;
        if (btn) btn.classList.remove('is-recording');
        if (icon) icon.textContent = '🎙️';
      }
    }

    function openQuickExpenseModal() {
      _quickAmountBuffer = '0';
      _quickSelectedMethod = 'Yape';
      _quickSelectedCategory = 'Comida fuera';
      _quickCustomName = '';
      updateQuickDisplay();

      // Limpiar input inteligente y chips
      const smartInput = document.getElementById('smartQuickExpenseInput');
      if (smartInput) smartInput.value = '';
      const preview = document.getElementById('smartChipsPreview');
      if (preview) preview.style.display = 'none';

      if (_isVoiceRecording && _voiceRecognition) {
        try { _voiceRecognition.stop(); } catch(e) {}
        _isVoiceRecording = false;
        const voiceBtn = document.getElementById('smartVoiceBtn');
        if (voiceBtn) voiceBtn.classList.remove('is-recording');
        const icon = document.getElementById('voiceMicIcon');
        if (icon) icon.textContent = '🎙️';
      }

      // Resetear métodos
      document.querySelectorAll('.quick-method-pill').forEach(b => {
        b.classList.toggle('active', b.id === 'quickMethodYape');
      });

      // Resetear categorías
      document.querySelectorAll('.quick-cat-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-cat') === 'Comida fuera');
      });

      openModalById('quickExpenseModal');

      setTimeout(() => {
        const amtInput = document.getElementById('quickDisplayAmount');
        if (amtInput && window.innerWidth >= 768) {
          amtInput.focus();
          amtInput.select();
        }
      }, 100);
    }

    function closeQuickExpenseModal() {
      if (_isVoiceRecording && _voiceRecognition) {
        try { _voiceRecognition.stop(); } catch(e) {}
        _isVoiceRecording = false;
        const voiceBtn = document.getElementById('smartVoiceBtn');
        if (voiceBtn) voiceBtn.classList.remove('is-recording');
        const icon = document.getElementById('voiceMicIcon');
        if (icon) icon.textContent = '🎙️';
      }
      closeModal('quickExpenseModal');
    }

    function updateQuickDisplay() {
      const el = document.getElementById('quickDisplayAmount');
      if (!el) return;
      const displayVal = (_quickAmountBuffer === '' || _quickAmountBuffer === '0') ? '0.00' : _quickAmountBuffer;
      if (el.tagName === 'INPUT') {
        el.value = displayVal;
      } else {
        el.textContent = displayVal;
      }
      el.style.opacity = (displayVal === '0.00') ? '0.55' : '1';
    }

    function handleQuickAmountInput(val) {
      let clean = String(val).replace(/[^0-9.]/g, '');
      const parts = clean.split('.');
      if (parts.length > 2) {
        clean = parts[0] + '.' + parts.slice(1).join('');
      }
      if (clean.includes('.')) {
        const dec = clean.split('.');
        if (dec[1] && dec[1].length > 2) clean = dec[0] + '.' + dec[1].slice(0, 2);
      }
      _quickAmountBuffer = clean || '0';
      const el = document.getElementById('quickDisplayAmount');
      if (el && el.value !== clean) {
        el.value = clean;
      }
      if (el) {
        el.style.opacity = (clean === '' || clean === '0' || clean === '0.00') ? '0.55' : '1';
      }
    }

    function focusQuickAmountInput() {
      const el = document.getElementById('quickDisplayAmount');
      if (el) {
        el.focus();
        if (el.value === '0.00' || el.value === '0') {
          el.select();
        }
      }
    }

    function handleQuickKeypad(key) {
      if (key === 'backspace') {
        if (_quickAmountBuffer.length > 1) {
          _quickAmountBuffer = _quickAmountBuffer.slice(0, -1);
        } else {
          _quickAmountBuffer = '0';
        }
      } else if (key === '.' || key === ',') {
        if (!_quickAmountBuffer.includes('.')) {
          _quickAmountBuffer += '.';
        }
      } else {
        // Dígitos 0-9
        if (_quickAmountBuffer === '0' || _quickAmountBuffer === '0.00' || _quickAmountBuffer === '') {
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

    function findRecentDuplicateExpense(name, amount, month) {
      if (!appState.transactions || !appState.transactions[month]) return null;
      const list = appState.transactions[month];
      const now = Date.now();
      const cleanName = (name || '').trim().toLowerCase();
      
      return list.find(t => {
        const isSameAmount = Math.abs((Number(t.amount) || 0) - amount) < 0.01;
        const tName = (t.name || '').trim().toLowerCase();
        const isSameName = (tName === cleanName) || (cleanName.length > 2 && (tName.includes(cleanName) || cleanName.includes(tName)));
        
        let isRecent = false;
        if (t.id && typeof t.id === 'string') {
          const matches = t.id.match(/_(\d{10,13})_/);
          if (matches && matches[1]) {
            const ts = parseInt(matches[1], 10);
            if (ts && (now - ts) < 5 * 60 * 1000) { // Menos de 5 minutos
              isRecent = true;
            }
          }
        }
        return isSameAmount && isSameName && isRecent;
      });
    }

    async function saveQuickExpense() {
      const amount = parseFloat(_quickAmountBuffer);
      if (isNaN(amount) || amount <= 0) {
        showToast('⚠️ Ingresa un monto mayor a 0', 'warning');
        return;
      }

      const finalName = _quickCustomName || _quickSelectedCategory;

      // Detector de Gastos Duplicados (MonAi pattern)
      const dup = findRecentDuplicateExpense(finalName, amount, appState.currentMonth);
      if (dup) {
        const proceed = confirm(`⚠️ Posible gasto duplicado:\nYa registraste "${finalName}" por S/ ${amount.toFixed(2)} hace unos instantes.\n\n¿Deseas registrarlo de todos modos?`);
        if (!proceed) return;
      }

      ensureMonthTransactions(appState.currentMonth);
      
      const newTx = {
        id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: finalName,
        amount: amount,
        category: _quickSelectedCategory,
        status: 'Pagado',
        paymentMethod: _quickSelectedMethod,
        dueDate: new Date().getDate(),
        date: new Date().toISOString().split('T')[0],
        notes: `⚡ Registro rápido (${_quickSelectedMethod})`
      };

      appState.transactions[appState.currentMonth].push(newTx);
      addAuditLog('⚡ Gasto Rápido', `S/ ${amount.toFixed(2)} en ${finalName} (${_quickSelectedCategory}) vía ${_quickSelectedMethod}`);
      
      saveState();
      closeQuickExpenseModal();
      showToast(`✨ S/ ${amount.toFixed(2)} registrado en ${finalName}`, 'success');
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
      } else if (tabId === 'plan' || tabId === 'metas' || tabId === 'consejos' || tabId === 'deudas' || tabId === 'simulador' || tabId === 'prestamos') {
        const btn = document.getElementById('navTabPlan');
        if (btn) btn.classList.add('active');
      }

      // Sincronizar items de la barra lateral de escritorio (con módulos fusionados)
      const deskNavMap = {
        'inicio': 'deskNavTabInicio',
        'movimientos': 'deskNavTabMovimientos',
        'plan': 'deskNavTabPlan',
        'metas': 'deskNavTabMetas',
        'consejos': 'deskNavTabPlan',
        'deudas': 'deskNavTabDeudas',
        'simulador': 'deskNavTabDeudas',
        'prestamos': 'deskNavTabLoans',
        'founder': 'deskNavMasterBtn'
      };
      if (deskNavMap[tabId]) {
        const dBtn = document.getElementById(deskNavMap[tabId]);
        if (dBtn) dBtn.classList.add('active');
      }

      // Sincronizar pills del selector Asesor vs Deudas
      if (typeof syncAdvisorSegmentedNav === 'function') {
        syncAdvisorSegmentedNav(tabId);
      }

      if (tabId === 'founder') {
        document.body.classList.add('founder-mode-active');
        enterFounderModule();
      } else {
        document.body.classList.remove('founder-mode-active');
        stopFounderTicker();
      }

      if (tabId === 'simulador') {
        if (typeof initSimuladorView === 'function') initSimuladorView();
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
          if (typeof initPlanCollapsibleCards === 'function') initPlanCollapsibleCards();
        }, 80);
      } else if (tabId === 'metas') {
        renderGoals();
        renderMetrics();
      } else if (tabId === 'consejos') {
        setTimeout(() => {
          renderRescueCard();
          renderExecutiveAdvisor();
          renderAuditTable();
        }, 80);
      } else if (tabId === 'deudas') {
        setTimeout(() => {
          if (typeof renderDebtCommandCenter === 'function') {
            renderDebtCommandCenter();
          }
        }, 80);
      } else if (tabId === 'prestamos') {
        setTimeout(() => {
          if (typeof renderLoansDashboard === 'function') {
            renderLoansDashboard();
          }
        }, 80);
      }
    }

    function renderCategoryChips() {
      const container = document.getElementById('categoryChips');
      if (!container) return; // Feature disabled by UX request
      const cats = ['TODAS', ...Object.keys(CATEGORIES)];

      container.innerHTML = cats.map(c => `
        <div class="chip ${c === currentCategoryFilter ? 'active' : ''}" data-cat="${escapeHtml(c)}" onclick="selectCategoryChip(this.getAttribute('data-cat'))">
          ${c === 'TODAS' ? '✨ Todas' : (((CATEGORIES[c] && CATEGORIES[c].icon) || '🏷️') + ' ' + escapeHtml(c))}
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
      window.__renderErrors = [];
      const safe = (name, fn) => {
        try { fn(); } catch (e) {
          console.warn(name + ' err:', e);
          window.__renderErrors.push(name + ': ' + (e && e.message));
        }
      };

      safe('initUserAvatar', () => initUserAvatar());
      safe('renderHomeGreeting', () => renderHomeGreeting());
      safe('updateDynamicCategories', () => updateDynamicCategories());
      safe('populateMonthDropdown', () => populateMonthDropdown());
      safe('ensureMonthTransactions', () => ensureMonthTransactions(appState.currentMonth));
      safe('ensureMonthIncomes', () => ensureMonthIncomes(appState.currentMonth));

      safe('renderMetrics', () => renderMetrics());
      safe('renderSafeToSpendCard', () => renderSafeToSpendCard());
      safe('renderUpcomingDueDates', () => renderUpcomingDueDates());
      safe('renderRecentTransactions', () => renderRecentTransactions());
      safe('renderCuotasTracker', () => renderCuotasTracker());
      safe('renderDonutChart', () => renderDonutChart());
      safe('renderDesktopExecutiveCharts', () => renderDesktopExecutiveCharts());
      safe('renderCategoryChips', () => renderCategoryChips());

      safe('statusChips', () => {
        document.getElementById('chipStateAll').className = 'chip ' + (currentStatusFilter === 'TODOS' ? 'active' : '');
        document.getElementById('chipStatePagado').className = 'chip ' + (currentStatusFilter === 'Pagado' ? 'active' : '');
        document.getElementById('chipStatePendiente').className = 'chip ' + (currentStatusFilter === 'Pendiente' ? 'active' : '');
      });

      safe('renderTransactions', () => renderTransactions());
      safe('render503020Rule', () => render503020Rule());
      safe('renderGastosHormiga', () => renderGastosHormiga());
      safe('renderCategoryBudgets', () => renderCategoryBudgets());
      safe('renderHistoryChart', () => renderHistoryChart());
      safe('renderHistoryTable', () => renderHistoryTable());
      safe('renderGoals', () => renderGoals());
      safe('renderPersonalizedTips', () => renderPersonalizedTips());
      safe('renderAuditTable', () => renderAuditTable());
      safe('renderIncomes', () => renderIncomes());
      safe('renderRescueDashBanner', () => renderRescueDashBanner());
      safe('renderRescueCard', () => renderRescueCard());
      safe('renderExecutiveAdvisor', () => renderExecutiveAdvisor());
      safe('syncTravelModeUI', () => syncTravelModeUI());
      safe('renderLoansHomeWidget', () => renderLoansHomeWidget());
      safe('renderLoansDashboard', () => renderLoansDashboard());
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
        return roundCurrency(appState.salary + mExtra.reduce((s, i) => s + (i.amount || 0), 0));
      }
      return roundCurrency(sum);
    }

    function getAccumulatedBalance(targetMonth) {
      const allMonthsOrder = getSortedMonths();
      const isCesar = isAdminCesar();
      let startIndex = allMonthsOrder.indexOf('Agosto 2026');
      if (!isCesar || startIndex === -1) {
        // Para suscriptores regulares: detectar su primer mes con datos registrados
        let firstDataIdx = -1;
        for (let idx = 0; idx < allMonthsOrder.length; idx++) {
          const m = allMonthsOrder[idx];
          const hasTx = appState.transactions && appState.transactions[m] && appState.transactions[m].length > 0;
          const hasInc = appState.incomes && appState.incomes[m] && appState.incomes[m].length > 0;
          if (hasTx || hasInc) {
            firstDataIdx = idx;
            break;
          }
        }
        startIndex = firstDataIdx !== -1 ? firstDataIdx : allMonthsOrder.indexOf(targetMonth);
        if (startIndex === -1) startIndex = 0;
      }
      const targetIndex = allMonthsOrder.indexOf(targetMonth);
      
      // Si el mes actual es anterior al mes de inicio o no existe en la lista, calculamos individual
      if (startIndex === -1 || targetIndex < startIndex) {
        if (typeof ensureMonthIncomes === 'function') ensureMonthIncomes(targetMonth);
        const txs = appState.transactions[targetMonth] || [];
        const totalPaid = roundCurrency(txs.filter(t => (t.status || 'Pagado') === 'Pagado').reduce((sum, item) => sum + (item.amount || 0), 0));
        const monthIncomes = appState.incomes ? (appState.incomes[targetMonth] || []) : [];
        const totalReceived = roundCurrency(monthIncomes.filter(i => (i.status || 'Pendiente') === 'Recibido').reduce((s, i) => s + (i.amount || 0), 0));
        return roundCurrency(totalReceived - totalPaid);
      }
      
      // Acumulado con aritmética protegida a centavos
      let accumulatedBalance = 0;
      for (let i = startIndex; i <= targetIndex; i++) {
        const m = allMonthsOrder[i];
        if (typeof ensureMonthIncomes === 'function') ensureMonthIncomes(m);
        const txs = appState.transactions[m] || [];
        const totalPaid = roundCurrency(txs.filter(t => (t.status || 'Pagado') === 'Pagado').reduce((sum, item) => sum + (item.amount || 0), 0));
        const monthIncomes = appState.incomes ? (appState.incomes[m] || []) : [];
        const totalReceived = roundCurrency(monthIncomes.filter(inc => (inc.status || 'Pendiente') === 'Recibido').reduce((s, inc) => s + (inc.amount || 0), 0));
        accumulatedBalance = roundCurrency(accumulatedBalance + (totalReceived - totalPaid));
      }
      return roundCurrency(accumulatedBalance);
    }

    function animateNumber(element, targetVal, duration = 280, isCurrency = false) {
      if (!element) return;
      const sym = getCurrencySymbol();
      const loc = getActiveCurrency().locale;
      const rawCurrent = parseFloat(element.getAttribute('data-numeric-val'));
      const startVal = isNaN(rawCurrent) ? 0 : rawCurrent;
      element.setAttribute('data-numeric-val', targetVal);
      // Token por elemento: solo la animación más reciente puede escribir el valor final
      const animToken = (element._animToken = (element._animToken || 0) + 1);
      
      const formattedFinal = targetVal.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (Math.abs(targetVal - startVal) < 0.01) {
        element.textContent = isCurrency ? `${sym} ${formattedFinal}` : formattedFinal;
        return;
      }

      const startTime = performance.now();
      function step(now) {
        if (element._animToken !== animToken) return; // reemplazada por una animación más nueva
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
      const totalPaid = roundCurrency(currentMonthTxs.filter(t => (t.status || 'Pagado') === 'Pagado').reduce((sum, item) => sum + item.amount, 0));
      
      const monthIncomes = appState.incomes ? (appState.incomes[targetMonth] || []) : [];
      const totalReceived = roundCurrency(monthIncomes.filter(inc => (inc.status || 'Pendiente') === 'Recibido').reduce((s, inc) => s + inc.amount, 0));
      
      const currentMonthFlow = roundCurrency(totalReceived - totalPaid);
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

    // ================================================================
    // GASTO DIARIO SEGURO (SAFE-TO-SPEND) & CICLOS QUINCENALES (FASE 3)
    // ================================================================
    function calculateSafeDailySpend() {
      const now = new Date();
      const currentDay = now.getDate();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const cycle = appState.budgetCycle || 'quincenal';

      let daysRemaining = 1;
      let cycleName = '';
      let cycleStartDay = 1;
      let cycleEndDay = daysInMonth;

      if (cycle === 'quincenal') {
        if (currentDay <= 15) {
          daysRemaining = Math.max(1, (15 - currentDay) + 1);
          cycleName = '1ª Quincena (1 al 15)';
          cycleStartDay = 1;
          cycleEndDay = 15;
        } else {
          daysRemaining = Math.max(1, (daysInMonth - currentDay) + 1);
          cycleName = `2ª Quincena (16 al ${daysInMonth})`;
          cycleStartDay = 16;
          cycleEndDay = daysInMonth;
        }
      } else {
        daysRemaining = Math.max(1, (daysInMonth - currentDay) + 1);
        cycleName = `Mes completo (1 al ${daysInMonth})`;
        cycleStartDay = 1;
        cycleEndDay = daysInMonth;
      }

      const txs = getMonthTxList();
      const pendingTxs = txs.filter(t => (t.status || 'Pagado') === 'Pendiente');
      
      let pendingCycleSum = 0;
      pendingTxs.forEach(t => {
        const dueDay = parseInt(getEffectiveDueDate(t)) || 15;
        if (cycle === 'quincenal') {
          if (currentDay <= 15) {
            if (dueDay <= 15) pendingCycleSum += (Number(t.amount) || 0);
          } else {
            pendingCycleSum += (Number(t.amount) || 0);
          }
        } else {
          pendingCycleSum += (Number(t.amount) || 0);
        }
      });

      const currentBalance = roundCurrency(getAccumulatedBalance(appState.currentMonth));
      const freeMargin = roundCurrency(currentBalance - pendingCycleSum);
      const dailyLimit = freeMargin > 0 ? roundCurrency(freeMargin / daysRemaining) : 0;

      return {
        cycle,
        cycleName,
        currentDay,
        daysRemaining,
        currentBalance,
        pendingCycleSum: roundCurrency(pendingCycleSum),
        freeMargin: Math.max(0, freeMargin),
        dailyLimit
      };
    }

    function openDailyLimitModal() {
      updateDailyLimitModalContent();
      openModalById('dailyLimitModal');
    }

    function closeDailyLimitModal() {
      closeModal('dailyLimitModal');
    }

    function updateDailyLimitModalContent() {
      const safeData = calculateSafeDailySpend();
      const sym = getCurrencySymbol();
      const loc = getActiveCurrency().locale;

      const amtEl = document.getElementById('modalDailyLimitAmount');
      if (amtEl) {
        amtEl.innerHTML = `${sym} ${safeData.dailyLimit.toLocaleString(loc, {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span style="font-size: 14px; font-weight: 700; color: #64748b;">/ día</span>`;
        amtEl.style.color = safeData.dailyLimit > 0 ? '#059669' : '#d97706';
      }

      const statusEl = document.getElementById('modalDailyLimitStatusText');
      if (statusEl) {
        if (safeData.dailyLimit > 0) {
          statusEl.textContent = `✓ Puedes gastar hasta ${sym} ${safeData.dailyLimit.toFixed(2)} por día sin comprometer tus compromisos pendientes.`;
          statusEl.style.color = '#059669';
        } else {
          statusEl.textContent = `⚠️ Tus compromisos pendientes superan tu saldo disponible en banco. Prioriza los pagos pendientes.`;
          statusEl.style.color = '#d97706';
        }
      }

      const balEl = document.getElementById('modalDailyBalance');
      if (balEl) balEl.textContent = `${sym} ${safeData.currentBalance.toLocaleString(loc, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

      const pendEl = document.getElementById('modalDailyPending');
      if (pendEl) pendEl.textContent = `- ${sym} ${safeData.pendingCycleSum.toLocaleString(loc, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

      const freeEl = document.getElementById('modalDailyFree');
      if (freeEl) freeEl.textContent = `${sym} ${safeData.freeMargin.toLocaleString(loc, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

      const daysEl = document.getElementById('modalDailyDaysRemaining');
      if (daysEl) daysEl.textContent = `${safeData.daysRemaining} días (${safeData.cycleName})`;

      const btnQ = document.getElementById('btnCycleQuincenal');
      const btnM = document.getElementById('btnCycleMensual');
      const curCycle = appState.budgetCycle || 'quincenal';
      if (btnQ) btnQ.classList.toggle('active', curCycle === 'quincenal');
      if (btnM) btnM.classList.toggle('active', curCycle === 'mensual');
    }

    function setBudgetCycle(cycle) {
      appState.budgetCycle = cycle;
      saveState();
      if (currentUser && supabaseClient) {
        syncStateToServer().catch(e => console.warn('Sync cycle error:', e));
      }
      updateDailyLimitModalContent();
      renderAll();
      showToast(cycle === 'quincenal' ? '🌓 Ciclo Quincenal activado (1-15 y 16-Fin de mes)' : '🌕 Ciclo Mensual activado', 'info');
    }

    function renderMetrics() {
      const txs = getMonthTxList();
      const totalSpent = roundCurrency(txs.reduce((sum, item) => sum + (item.amount || 0), 0));
      
      const totalPaid = roundCurrency(txs.filter(t => (t.status || 'Pagado') === 'Pagado').reduce((sum, item) => sum + (item.amount || 0), 0));

      const totalIncome = roundCurrency(getMonthTotalIncome());
      const netSavings = roundCurrency(totalIncome - totalSpent); 
      
      const currentBalance = getAccumulatedBalance(appState.currentMonth);

      const sym = getCurrencySymbol();
      const loc = getActiveCurrency().locale;

      const elSalary = document.getElementById('metricSalary');
      if (elSalary) elSalary.textContent = sym + ' ' + totalIncome.toLocaleString(loc, {minimumFractionDigits: 2, maximumFractionDigits: 2});
      const elSpent = document.getElementById('metricSpent');
      if (elSpent) elSpent.textContent = sym + ' ' + totalSpent.toLocaleString(loc, {minimumFractionDigits: 2, maximumFractionDigits: 2});
      
      // Métrica de Por Pagar
      const totalPending = roundCurrency(totalSpent - totalPaid);
      const elPending = document.getElementById('metricPending');
      if (elPending) elPending.textContent = sym + ' ' + totalPending.toLocaleString(loc, {minimumFractionDigits: 2, maximumFractionDigits: 2});

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

      // Widget Límite Sugerido de Hoy (Safe-to-Spend Apple MonAi / Lukas)
      const elDailyBadge = document.getElementById('execDailyLimitBadge');
      const elDailyText = document.getElementById('execDailyLimitText');
      if (elDailyBadge && elDailyText) {
        if (isCurrentRealMonth) {
          const safeData = calculateSafeDailySpend();
          const suggestedDaily = safeData.dailyLimit;
          
          elDailyBadge.style.display = 'inline-flex';
          if (suggestedDaily > 0) {
            elDailyBadge.className = 'exec-daily-limit-badge is-positive';
            elDailyText.textContent = `Límite sugerido de hoy: ${sym} ${suggestedDaily.toLocaleString(loc, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
          } else {
            elDailyBadge.className = 'exec-daily-limit-badge is-warning';
            elDailyText.textContent = `Límite sugerido de hoy: ${sym} 0.00`;
          }
        } else {
          elDailyBadge.style.display = 'inline-flex';
          elDailyBadge.className = 'exec-daily-limit-badge is-historical';
          elDailyText.textContent = `Mes cerrado · ${appState.currentMonth}`;
        }
      }

      // Alerta de Liquidez (Oculta en tarjeta hero para preservar minimalismo Apple)
      let liquidityAlert = document.getElementById('liquidityAlertMsg');
      if (liquidityAlert) {
        liquidityAlert.style.display = 'none';
      }

      // Termómetro Fondo Emergencia (Opción F)
      const isNewSavingsHero = !!document.getElementById('savingsOverviewCard');
      const emFund = appState.savingsGoals ? appState.savingsGoals.find(g => g.name.includes('Emergencia')) : null;
      const emAmount = emFund ? emFund.current : 0;
      
      const elEmergency = document.getElementById('metricEmergencyFund');
      if (elEmergency && !isNewSavingsHero) {
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
            <div class="cuota-row" style="background: #fdf4ff; border-color: #f5d0fe; transition: transform 0.2s; cursor: pointer;" onclick="switchAdvisorView('deudas')" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='none'">
              <div>
                <div class="cuota-title" style="color: #86198f;">💳 ${escapeHtml(ci.name)}</div>
                <div class="cuota-sub sensitive-amount">${getCurrencySymbol()} ${ci.amount.toFixed(2)} / mes</div>
              </div>
              <div class="cuota-badge" style="background: linear-gradient(135deg, #fdf4ff, #fae8ff); color: #86198f; border: 1px solid #f0abfc; box-shadow: 0 1px 2px rgba(0,0,0,0.05); font-weight: 800; font-size: 11px; white-space: nowrap;">Cuota ${ci.installmentsCurrent || 1} de ${ci.installmentsTotal || 1}${ci.remainingInstallments ? ` (${ci.remainingInstallments} pendientes)` : ''}</div>
            </div>
          `;
        });
        html += `
          <div style="margin-top: 10px; text-align: center;">
            <button type="button" class="btn-pill" onclick="switchAdvisorView('deudas')" style="font-size: 11.5px; padding: 7px 14px; background: rgba(99, 102, 241, 0.08); color: #4f46e5; border: 1px solid rgba(99, 102, 241, 0.25); font-weight: 700; cursor: pointer; width: 100%;">❄️ Abrir Plan Cero Deudas (Bola de Nieve) →</button>
          </div>
        `;
      } else {
        html = `
          <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 12px; background: #fafafa; border-radius: 12px; border: 1px dashed #e5e7eb;">
            <div style="font-size: 24px; margin-bottom: 8px;">💳</div>
            <strong>No hay cuotas registradas</strong><br>
            <span style="font-size: 11px; margin-top: 4px; display: inline-block;">Edita un gasto y activa la opción "Es una compra a cuotas" para monitorearlo aquí.</span>
            <div style="margin-top: 10px;">
              <button type="button" class="btn btn-outline btn-sm" onclick="switchAdvisorView('deudas')" style="font-size: 11px; border-radius: 8px; padding: 5px 12px; font-weight: 700;">❄️ Abrir Plan Cero Deudas →</button>
            </div>
          </div>
        `;
      }

      container.innerHTML = html;
    }

    async function toggleIncomeStatus(incId) {
      if (!appState.incomes || !appState.incomes[appState.currentMonth]) return;
      const incs = appState.incomes[appState.currentMonth];
      const inc = incs.find(i => i.id === incId);
      if (inc) {
        const nextStatus = (inc.status === 'Recibido') ? 'Pendiente' : 'Recibido';
        if (!await uiConfirm(`¿Seguro que deseas marcar este ingreso como ${nextStatus}?`)) return;
        
        const oldStatus = inc.status;
        inc.status = nextStatus;
        addAuditLog('💵 Ingreso Actualizado', `"${inc.name}" pasó a ${inc.status}`);
        saveState();
        renderAll();
      }
    }

    async function editIncomeDate(incId, event) {
      event.stopPropagation();
      const currentMonth = appState.currentMonth;
      const incs = appState.incomes[currentMonth];
      if (!incs) return;
      const inc = incs.find(i => i.id === incId);
      if (!inc) return;

      const newDateStr = await uiPrompt(`Cambiar el día de pago para "${inc.name}" (1-31):\nSe actualizará para todos los meses.`, inc.date, { inputMode: 'numeric' });
      if (newDateStr === null) return;
      const newDate = parseInt(newDateStr, 10);
      if (isNaN(newDate) || newDate < 1 || newDate > 31) {
        uiAlert('Día inválido.');
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
          <div style="background: white; padding: 6px 10px; border-radius: 6px; border: 1px solid ${border}; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.2s ease;" onclick="toggleIncomeStatus('${escapeHtml(i.id)}')" onmouseover="this.style.filter='brightness(0.95)'" onmouseout="this.style.filter='none'">
            <div>
              <div style="font-size: 11px; font-weight: 800; color: #1f2937;">${escapeHtml(i.name)}</div>
              <div style="font-size: 10px; color: var(--text-muted);"><span class="sensitive-amount">${getCurrencySymbol()} ${i.amount.toLocaleString(getActiveCurrency().locale, {minimumFractionDigits: 2})}</span> • <span onclick="editIncomeDate('${escapeHtml(i.id)}', event)" style="cursor: pointer; text-decoration: underline; color: #0284c7;" onmouseover="this.style.color='#0369a1'" onmouseout="this.style.color='#0284c7'">Día ${escapeHtml(i.date)} ✎</span></div>
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
      if (!el) return;
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
      if (typeof Chart === 'undefined') return;
      // 1. Chart Flujo de Caja (Cashflow Mensual Proyectado)
      const cashflowEl = document.getElementById('desktopCashflowChart');
      if (cashflowEl) {
        const isDark = document.body.classList.contains('theme-twilight');
        const isPriv = typeof isPrivacyModeActive === 'function' && isPrivacyModeActive();
        const allSorted = (typeof getSortedMonths === 'function' ? getSortedMonths() : Object.keys(appState.transactions || {})).filter(m => /^\w+\s+\d{4}$/.test(m));
        const monthsList = allSorted.slice(-6);
        const displayMonths = monthsList.length >= 2 ? monthsList : (allSorted.length > 0 ? allSorted : [appState.currentMonth || 'Octubre 2026']);
        
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
                    display: !isPriv,
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

    let _desktopChartsResizeTimer = null;
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        clearTimeout(_desktopChartsResizeTimer);
        _desktopChartsResizeTimer = setTimeout(() => {
          if (typeof renderDesktopExecutiveCharts === 'function') {
            renderDesktopExecutiveCharts();
          }
        }, 150);
      }
    });

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
        if (allTxs.length === 0) {
          container.innerHTML = `
            <tr>
              <td colspan="5">
                <div class="minimal-empty-state">
                  <div class="minimal-empty-icon-wrap">📋</div>
                  <div class="minimal-empty-title">Aún no hay gastos registrados este mes</div>
                  <div class="minimal-empty-sub">Usa «+ Gasto Detallado» para empezar a tener control total de tu presupuesto.</div>
                </div>
              </td>
            </tr>
          `;
        } else {
          container.innerHTML = `
            <tr>
              <td colspan="5">
                <div class="minimal-empty-state">
                  <div class="minimal-empty-icon-wrap">🔍</div>
                  <div class="minimal-empty-title">Sin resultados para tu búsqueda</div>
                  <div class="minimal-empty-sub">No se encontraron movimientos que coincidan con los filtros aplicados.</div>
                  <button type="button" class="btn btn-outline btn-sm" onclick="clearAllFilters()" style="font-size: 11.5px; border-radius: 9px; padding: 6px 14px; font-weight: 700; border-color: var(--border);">Limpiar Filtros</button>
                </div>
              </td>
            </tr>
          `;
        }
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
                <span class="badge ${catInfo.badgeClass}" ${catInfo.badgeClass === 'badge-custom' ? `style="background-color: ${catInfo.color}20; color: ${catInfo.color}; border: 1px solid ${catInfo.color}40;"` : ''}>${escapeHtml(t.category)}</span>
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

    async function toggleTxStatus(id) {
      const txs = getMonthTxList();
      const tx = txs.find(t => t.id === id);
      if (tx) {
        const nextStatus = (tx.status === 'Pagado') ? 'Pendiente' : 'Pagado';
        if (!await uiConfirm(`¿Seguro que deseas marcar este gasto como ${nextStatus}?`)) return;
        
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

    async function deleteTransaction(id) {
      const txs = getMonthTxList();
      const tx = txs.find(t => t.id === id);
      if (!tx) return;

      if (!await uiConfirm(`¿Eliminar el gasto "${tx.name}" de este mes?`)) return;
      
      const normKey = getNormalizedNameKey(tx.name);
      
      const propagate = await uiConfirm(`¿Deseas eliminar "${tx.name}" también para TODOS los meses posteriores a este?`);
      
      const deletedIds = [id];
      if (propagate) {
        const allMonthsOrder = getSortedMonths();
        const selectedIndex = allMonthsOrder.indexOf(appState.currentMonth);
        if (selectedIndex !== -1) {
          const futureMonths = allMonthsOrder.slice(selectedIndex + 1);
          futureMonths.forEach(m => {
            if (appState.transactions[m]) {
              appState.transactions[m].forEach(t => {
                if (t && getNormalizedNameKey(t.name) === normKey && t.id) deletedIds.push(t.id);
              });
              appState.transactions[m] = appState.transactions[m].filter(t => getNormalizedNameKey(t.name) !== normKey);
            }
          });
        }
      }

      window._authorizedDeleteAllowance = (window._authorizedDeleteAllowance || 0) + deletedIds.length;
      recordDeletedIds(deletedIds);
      addAuditLog('🗑️ Eliminar Gasto', `Eliminado: ${tx.name}${propagate ? ' (y meses futuros)' : ''}`);
      appState.transactions[appState.currentMonth] = txs.filter(t => t.id !== id);
      window._knownServerTxCount = countTotalTransactions(appState);
      saveState();
      renderAll();
    }

    function openEditExpenseModal(id, targetMonth) {
      if (targetMonth && targetMonth !== appState.currentMonth) {
        appState.currentMonth = targetMonth;
        populateMonthDropdown();
      }
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

      if (!editId) {
        const dup = findRecentDuplicateExpense(name, amount, currentSelectedMonth);
        if (dup) {
          const proceed = confirm(`⚠️ Posible gasto duplicado:\nYa registraste "${name}" por S/ ${amount.toFixed(2)} hace unos minutos.\n\n¿Deseas registrarlo de todos modos?`);
          if (!proceed) return;
        }
      }

      if (editId) {
        // ==============================================================
        // CASO: EDITAR GASTO EXISTENTE
        // ==============================================================
        const curMonthTxs = appState.transactions[currentSelectedMonth] || [];
        const targetItem = curMonthTxs.find(t => t.id === editId);

        if (!targetItem) {
          showToast('No se encontró el gasto a editar en este mes.', 'error');
          return;
        }

        const oldName = targetItem.name;
        const oldNormKey = getNormalizedNameKey(oldName);

        // 1. SIEMPRE actualizar el ítem en el mes seleccionado actualmente
        targetItem.name = name;
        targetItem.amount = amount;
        targetItem.category = category;
        targetItem.status = status;
        targetItem.dueDate = dueDate;
        targetItem.isInstallment = isInstallment;
        targetItem.installmentsTotal = installmentsTotal;
        targetItem.installmentsCurrent = installmentsCurrent;
        targetItem.remainingInstallments = remainingInstallments;
        targetItem.tea = isInstallment ? teaRate : 0;

        // 2. BLINDAJE ESTRICTO: Solo propagar a meses futuros si el usuario marcó EXPLÍCITAMENTE la casilla
        if (shouldPropagateForward) {
          if (!appState.recurringDueDates) appState.recurringDueDates = {};
          appState.recurringDueDates[newNormKey] = dueDate;

          const futureMonthsToUpdate = (selectedIndex !== -1) ? allMonthsOrder.slice(selectedIndex + 1) : [];

          futureMonthsToUpdate.forEach((m, idx) => {
            if (!appState.transactions[m]) appState.transactions[m] = [];
            let found = false;

            appState.transactions[m].forEach(t => {
              if (getNormalizedNameKey(t.name) === oldNormKey || getNormalizedNameKey(t.name) === newNormKey) {
                found = true;
                t.name = name;
                t.amount = amount;
                t.category = category;
                t.dueDate = dueDate;
                t.isInstallment = isInstallment;
                t.installmentsTotal = installmentsTotal;

                if (isInstallment) {
                  const step = idx + 1;
                  t.installmentsCurrent = Math.min(installmentsTotal, installmentsCurrent + step);
                  t.remainingInstallments = Math.max(0, remainingInstallments - step);
                  t.tea = teaRate;
                } else {
                  t.installmentsCurrent = 1;
                  t.remainingInstallments = 1;
                  t.tea = 0;
                }
              }
            });

            if (!found) {
              let adjCurrent = installmentsCurrent;
              let adjRemaining = remainingInstallments;
              if (isInstallment) {
                const step = idx + 1;
                adjCurrent = Math.min(installmentsTotal, installmentsCurrent + step);
                adjRemaining = Math.max(0, remainingInstallments - step);
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

          addAuditLog('✏️ Gasto Editado', `Gasto '${oldName}' actualizado a '${name}' (S/ ${amount}, Día ${dueDate}) y replicado a meses futuros.`);
        } else {
          addAuditLog('✏️ Gasto Editado', `Gasto '${oldName}' actualizado a '${name}' (S/ ${amount}, Día ${dueDate}) solo en ${currentSelectedMonth}.`);
        }

      } else {
        // ==============================================================
        // CASO: REGISTRAR NUEVO GASTO
        // ==============================================================
        let targetMonths = [];
        if (shouldPropagateForward && selectedIndex !== -1) {
          targetMonths = allMonthsOrder.slice(selectedIndex);
          if (!appState.recurringDueDates) appState.recurringDueDates = {};
          appState.recurringDueDates[newNormKey] = dueDate;
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
              <div class="plan-progress-sub">Tope 50% (${getCurrencySymbol()} ${target50.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })})</div>
            </div>
            <div class="plan-progress-amounts">
              <strong>${getCurrencySymbol()} ${needsReal.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong>
              <span class="plan-pct-badge" style="background: ${needsReal > target50 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)'}; color: ${needsReal > target50 ? '#dc2626' : '#059669'}; font-weight: 800; padding: 2px 7px; border-radius: 6px; font-size: 11px;">${realPct50}%</span>
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
              <div class="plan-progress-sub">Tope 30% (${getCurrencySymbol()} ${target30.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })})</div>
            </div>
            <div class="plan-progress-amounts">
              <strong>${getCurrencySymbol()} ${wantsReal.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong>
              <span class="plan-pct-badge" style="background: ${wantsReal > target30 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(6, 182, 212, 0.12)'}; color: ${wantsReal > target30 ? '#d97706' : '#0891b2'}; font-weight: 800; padding: 2px 7px; border-radius: 6px; font-size: 11px;">${realPct30}%</span>
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
              <div class="plan-progress-sub">Tope 20% (${getCurrencySymbol()} ${target20.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })})</div>
            </div>
            <div class="plan-progress-amounts">
              <strong>${getCurrencySymbol()} ${savingsDebtReal.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong>
              <span class="plan-pct-badge" style="background: ${savingsDebtReal > target20 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(139, 92, 246, 0.12)'}; color: ${savingsDebtReal > target20 ? '#dc2626' : '#7c3aed'}; font-weight: 800; padding: 2px 7px; border-radius: 6px; font-size: 11px;">${realPctDebt}%</span>
            </div>
          </div>
          <div class="plan-progress-track">
            <div class="plan-progress-fill" style="width: ${barFill20}%; background: ${savingsDebtReal > target20 ? '#ef4444' : '#8b5cf6'};"></div>
          </div>
        </div>

        <!-- Indicador Ejecutivo de Salud Financiera Compacto -->
        <div style="margin-top: 14px; padding: 12px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 38px; height: 38px; border-radius: 10px; background: ${healthBadgeColor}15; color: ${healthBadgeColor}; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14.5px; flex-shrink: 0;">
              ${healthScore}
            </div>
            <div>
              <div style="font-size: 12px; font-weight: 800; color: #0f172a;">Índice de Salud Financiera</div>
              <div style="font-size: 11px; color: ${healthBadgeColor}; font-weight: 700;">${healthBadgeText}</div>
            </div>
          </div>
          <div style="font-size: 11px; color: #64748b; font-weight: 600; text-align: right; max-width: 140px; line-height: 1.25;">
            ${penaltyReasons.length > 0 ? penaltyReasons[0] : 'Presupuesto balanceado'}
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

    async function editCategoryBudget(cat) {
      const current = appState.categoryBudgets[cat] || 1000;
      const val = await uiPrompt(`Ingresa nuevo límite para ${cat} (S/):`, current, { inputMode: 'decimal' });
      if (val !== null && !isNaN(val) && val > 0) {
        appState.categoryBudgets[cat] = parseFloat(val);
        addAuditLog('🎯 Presupuesto', `Nuevo límite ${cat}: S/ ${val}`);
        saveState();
        renderAll();
      }
    }

    async function deleteCategory(cat) {
      if (cat === 'Otros') return uiAlert('No puedes eliminar la categoría por defecto.');
      const confirmDelete = await uiConfirm(`¿Estás seguro de eliminar la categoría "${cat}"?\n\nSi tiene gastos asociados (históricos), estos seguirán existiendo pero se mostrarán como "Otros".\n\n(Recomendación: úsalo solo para limpiar categorías que ya no usas y están en S/ 0)`);
      
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

    /* ====== 1. METAS DE AHORRO & BÓVEDAS BLINDADAS (APPLE SAVINGS ENGINE v78.3) ====== */
    let goalsActiveFilter = 'all'; // 'all' | 'active' | 'completed'

    const GOAL_TEMPLATES = {
      emergencia: {
        name: 'Fondo de Tranquilidad (Emergencias)',
        target: 5000,
        monthly: 300,
        icon: '🛡️'
      },
      viaje: {
        name: 'Vacaciones & Viaje Soñado',
        target: 3500,
        monthly: 250,
        icon: '✈️'
      },
      tecnologia: {
        name: 'Laptop / Celular Nuevo',
        target: 4000,
        monthly: 350,
        icon: '💻'
      },
      auto: {
        name: 'Mantenimiento / Enganche Auto',
        target: 2500,
        monthly: 200,
        icon: '🚗'
      },
      educacion: {
        name: 'Educación / Curso / Certificación',
        target: 1800,
        monthly: 200,
        icon: '🎓'
      },
      libre: {
        name: 'Mi Objetivo Personal',
        target: 2000,
        monthly: 200,
        icon: '🎯'
      }
    };

    function selectGoalTemplate(tplKey) {
      const tpl = GOAL_TEMPLATES[tplKey] || GOAL_TEMPLATES.libre;
      const nameInput = document.getElementById('goalName');
      const targetInput = document.getElementById('goalTarget');
      const monthlyInput = document.getElementById('goalMonthly');
      const iconSelect = document.getElementById('goalIcon');

      if (nameInput) nameInput.value = tpl.name;
      if (targetInput) targetInput.value = tpl.target;
      if (monthlyInput) monthlyInput.value = tpl.monthly;
      if (iconSelect) iconSelect.value = tpl.icon;

      // Actualizar estilo visual activo de los chips
      document.querySelectorAll('.goal-tpl-chip').forEach(btn => {
        btn.classList.toggle('active', btn.id === 'tpl' + tplKey.charAt(0).toUpperCase() + tplKey.slice(1));
      });
    }
    window.selectGoalTemplate = selectGoalTemplate;

    function setGoalsFilter(filter) {
      goalsActiveFilter = filter;
      const chipAll = document.getElementById('chipGoalFilterAll');
      const chipActive = document.getElementById('chipGoalFilterActive');
      const chipComp = document.getElementById('chipGoalFilterCompleted');

      if (chipAll) chipAll.classList.toggle('active', filter === 'all');
      if (chipActive) chipActive.classList.toggle('active', filter === 'active');
      if (chipComp) chipComp.classList.toggle('active', filter === 'completed');

      renderGoals();
    }
    window.setGoalsFilter = setGoalsFilter;

    function setDepositQuickAmount(amount) {
      const input = document.getElementById('depositAmount');
      if (input) {
        input.value = amount;
        input.focus();
      }
    }
    window.setDepositQuickAmount = setDepositQuickAmount;

    function toggleGoalHistory(goalId) {
      const el = document.getElementById('goalHistory_' + goalId);
      if (el) {
        el.style.display = (el.style.display === 'none' || !el.style.display) ? 'block' : 'none';
      }
    }
    window.toggleGoalHistory = toggleGoalHistory;

    function renderGoals() {
      const container = document.getElementById('goalsContainer');
      const rawGoals = appState.savingsGoals || [];
      const sym = getCurrencySymbol();
      const loc = getActiveCurrency().locale;
      const now = new Date();
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

      // Cálculos agregados consolidados
      const totalSaved = roundCurrency(rawGoals.reduce((sum, g) => sum + (g.current || 0), 0));
      const totalTarget = roundCurrency(rawGoals.reduce((sum, g) => sum + (g.target || 0), 0));
      const totalMonthlyPace = roundCurrency(rawGoals.reduce((sum, g) => sum + (g.monthlyContribution || 0), 0));
      const globalPct = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

      const activeCount = rawGoals.filter(g => (g.current || 0) < (g.target || 1)).length;
      const completedCount = rawGoals.filter(g => (g.current || 0) >= (g.target || 1)).length;

      // Calcular aportes de ahorro registrados en este mes en transacciones
      const currentMonthTxs = appState.transactions[appState.currentMonth] || [];
      const monthDeposited = roundCurrency(
        currentMonthTxs
          .filter(t => (t.category === 'Ahorro' || (t.name && t.name.toLowerCase().includes('aporte'))) && t.status === 'Pagado')
          .reduce((sum, t) => sum + (t.amount || 0), 0)
      );

      // Actualizar contadores de los filtros
      const cAll = document.getElementById('countGoalAll');
      const cAct = document.getElementById('countGoalActive');
      const cCmp = document.getElementById('countGoalCompleted');
      if (cAll) cAll.textContent = rawGoals.length;
      if (cAct) cAct.textContent = activeCount;
      if (cCmp) cCmp.textContent = completedCount;

      // Actualizar Hero Card Consolidada
      const elHeroAmount = document.getElementById('metricEmergencyFund');
      if (elHeroAmount) {
        elHeroAmount.textContent = sym + ' ' + totalSaved.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      const elGlobalPct = document.getElementById('savingsGlobalPctText');
      if (elGlobalPct) elGlobalPct.textContent = `Progreso Global: ${globalPct}%`;

      const elGlobalTarget = document.getElementById('savingsGlobalTargetText');
      if (elGlobalTarget) elGlobalTarget.textContent = `Meta Total: ${sym} ${totalTarget.toLocaleString(loc, { minimumFractionDigits: 0 })}`;

      const elGlobalFill = document.getElementById('savingsGlobalProgressFill');
      if (elGlobalFill) elGlobalFill.style.width = globalPct + '%';

      const elKpiActive = document.getElementById('kpiActiveGoalsCount');
      if (elKpiActive) elKpiActive.textContent = activeCount;

      const elKpiMonthDep = document.getElementById('kpiMonthDeposited');
      if (elKpiMonthDep) elKpiMonthDep.textContent = sym + ' ' + monthDeposited.toLocaleString(loc, { minimumFractionDigits: 2 });

      const elKpiMonthlyPace = document.getElementById('kpiMonthlyPace');
      if (elKpiMonthlyPace) elKpiMonthlyPace.textContent = sym + ' ' + totalMonthlyPace.toLocaleString(loc, { minimumFractionDigits: 0 }) + ' / mes';

      // Badge de estado del ciclo
      const elCycleText = document.getElementById('savingsCycleStatusText');
      const elCycleDot = document.querySelector('.savings-status-dot');
      if (elCycleText) {
        if (monthDeposited > 0) {
          elCycleText.textContent = `Al día este mes (${sym} ${monthDeposited.toFixed(0)} aportados)`;
          if (elCycleDot) elCycleDot.className = 'savings-status-dot';
        } else {
          elCycleText.textContent = 'Pendiente cuota en este ciclo';
          if (elCycleDot) elCycleDot.className = 'savings-status-dot pending';
        }
      }

      if (!container) return;

      // Filtrar metas a renderizar
      let filteredGoals = [...rawGoals];
      if (goalsActiveFilter === 'active') {
        filteredGoals = filteredGoals.filter(g => (g.current || 0) < (g.target || 1));
      } else if (goalsActiveFilter === 'completed') {
        filteredGoals = filteredGoals.filter(g => (g.current || 0) >= (g.target || 1));
      }

      if (filteredGoals.length === 0) {
        const emptyMsg = rawGoals.length === 0
          ? 'Define objetivos como Fondo de Emergencia, Vacaciones o Enganche de Auto.'
          : (goalsActiveFilter === 'active' ? '¡No tienes metas pendientes! Todas tus metas están al 100%.' : 'Aún no has completado ninguna meta al 100%.');

        container.innerHTML = `
          <div style="text-align: center; color: var(--text-muted); padding: 40px 20px; grid-column: 1 / -1; background: var(--card-bg); border-radius: 22px; border: 1px dashed var(--border);">
            <div style="font-size: 34px; margin-bottom: 8px;">🎯</div>
            <div style="font-size: 15px; font-weight: 800; color: var(--text-main);">
              ${rawGoals.length === 0 ? 'Aún no tienes bóvedas de ahorro' : 'Sin metas en esta vista'}
            </div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px; margin-bottom: 16px;">
              ${emptyMsg}
            </div>
            <button type="button" class="btn btn-primary btn-sm" onclick="handleOpenAddGoalClick()" style="border-radius: 12px; font-weight: 800; padding: 8px 18px;">
              + Crear Primera Bóveda
            </button>
          </div>
        `;
        return;
      }

      container.innerHTML = filteredGoals.map(g => {
        const current = roundCurrency(g.current || 0);
        const target = roundCurrency(g.target || 1);
        const isCompleted = current >= target;
        const pct = Math.min(100, Math.round((current / target) * 100));
        const remaining = roundCurrency(Math.max(0, target - current));
        const monthly = roundCurrency(g.monthlyContribution || 200);
        const monthsNeeded = remaining > 0 && monthly > 0 ? Math.ceil(remaining / monthly) : 0;
        const quincenasNeeded = monthsNeeded * 2;

        const targetDate = new Date(now.getFullYear(), now.getMonth() + monthsNeeded, 1);
        const targetDateStr = `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;

        let aiText = '';
        if (isCompleted) {
          aiText = '🎉 <strong>¡Meta Cumplida!</strong> Has alcanzado el 100% del capital de esta bóveda. ¡Felicitaciones!';
        } else {
          aiText = `A tu ritmo de <strong>${sym} ${monthly.toFixed(0)}/mes</strong>, la cumples en <strong>${monthsNeeded} meses</strong> (${quincenasNeeded} quincenas — ${targetDateStr}).`;
          if (monthsNeeded > 2) {
            const fasterMonths = Math.ceil(remaining / (monthly + 100));
            const diff = monthsNeeded - fasterMonths;
            if (diff > 0) {
              aiText += `<br><span style="color: #059669; font-weight: 700;">💡 Con S/ 100 más al mes llegarías ${diff} mes(es) antes.</span>`;
            }
          }
        }

        const historyItems = (g.history || []).slice(0, 5);
        const historyHtml = historyItems.length > 0
          ? historyItems.map(h => `
              <div class="goal-history-item ${escapeHtml(h.type || 'deposit')}">
                <div>
                  <strong>${h.type === 'withdraw' ? '💸 Retiro' : '💰 Aporte'}:</strong> ${escapeHtml(h.note || 'Movimiento')}
                  <div style="font-size: 10px; color: var(--text-muted);">${escapeHtml(h.date || '')}</div>
                </div>
                <div class="history-amt">${h.type === 'withdraw' ? '-' : '+'}${sym} ${(h.amount || 0).toLocaleString(loc, { minimumFractionDigits: 2 })}</div>
              </div>
            `).join('')
          : '<div class="goal-history-item" style="color: var(--text-muted); justify-content: center; font-size: 11px;">Sin movimientos registrados aún</div>';

        return `
          <div class="luxury-goal-card ${isCompleted ? 'completed' : ''}" id="card_goal_${escapeHtml(g.id)}">
            <div class="goal-top-row">
              <div class="goal-icon-title">
                <div class="goal-emoji-bubble">${escapeHtml(g.icon || '🎯')}</div>
                <div>
                  <div class="goal-name-text">${escapeHtml(g.name)}</div>
                  <div class="goal-status-badge ${isCompleted ? 'completed' : 'active'}">
                    ${isCompleted ? '🎉 Cumplida 100%' : '🟢 En Curso'}
                  </div>
                </div>
              </div>
              <button type="button" class="btn-pill danger" onclick="deleteGoal('${g.id}')" title="Eliminar bóveda" style="opacity: 0.65; padding: 6px 10px;">🗑️</button>
            </div>

            <div class="goal-amounts-row">
              <span class="goal-saved-val">${sym} ${current.toLocaleString(loc, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
              <span class="goal-target-val">Meta: ${sym} ${target.toLocaleString(loc, { minimumFractionDigits: 0 })}</span>
            </div>

            <div class="goal-progress-track">
              <div class="goal-progress-fill" style="width: ${pct}%;"></div>
            </div>

            <div class="goal-subinfo-row">
              <span>Progreso: ${pct}%</span>
              <span>${isCompleted ? '¡Completada!' : 'Faltan: ' + sym + ' ' + remaining.toLocaleString(loc, { minimumFractionDigits: 0 })}</span>
            </div>

            <div class="ai-projection-badge">
              <span class="ai-tag">PROYECCIÓN</span>
              <div>${aiText}</div>
            </div>

            <!-- Micro-Aportes Rápidos en 1 Toque -->
            ${!isCompleted ? `
              <div class="goal-micro-pills-row">
                <span class="goal-micro-label">Aporte rápido:</span>
                <button type="button" class="btn-micro-pill" onclick="quickDepositGoal('${g.id}', 10)">+ ${sym} 10</button>
                <button type="button" class="btn-micro-pill" onclick="quickDepositGoal('${g.id}', 20)">+ ${sym} 20</button>
                <button type="button" class="btn-micro-pill" onclick="quickDepositGoal('${g.id}', 50)">+ ${sym} 50</button>
              </div>
            ` : ''}

            <!-- Acciones de Aportar, Retirar e Historial -->
            <div class="goal-actions-row">
              <button type="button" class="btn-goal-deposit" onclick="openDepositGoalModal('${g.id}')">
                <span>💰</span> Aportar
              </button>
              <button type="button" class="btn-goal-withdraw" onclick="openWithdrawGoalModal('${g.id}')" ${current <= 0 ? 'disabled style="opacity:0.4; pointer-events:none;"' : ''}>
                <span>💸</span> Retirar
              </button>
              <button type="button" class="btn-goal-history-toggle" onclick="toggleGoalHistory('${g.id}')" title="Ver historial de movimientos">
                📜
              </button>
            </div>

            <!-- Cajón Desplegable de Historial -->
            <div class="goal-history-drawer" id="goalHistory_${g.id}" style="display: none;">
              <div class="goal-history-header">
                <span>Últimos Movimientos</span>
                <span>${(g.history || []).length} registros</span>
              </div>
              <div class="goal-history-list">
                ${historyHtml}
              </div>
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
      if (m) m.value = '300';
      selectGoalTemplate('emergencia');
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

      if (!name || isNaN(target) || target <= 0) {
        showToast('🚨 Por favor ingresa un nombre y monto objetivo válidos.', 'error');
        return;
      }

      if (!appState.savingsGoals) appState.savingsGoals = [];

      const newGoal = {
        id: 'g_' + Date.now(),
        name: name,
        target: roundCurrency(target),
        current: roundCurrency(current),
        monthlyContribution: roundCurrency(monthly),
        icon: icon,
        history: current > 0 ? [
          {
            id: 'gh_' + Date.now(),
            date: new Date().toLocaleDateString('es-PE'),
            type: 'deposit',
            amount: roundCurrency(current),
            note: 'Saldo inicial al crear bóveda'
          }
        ] : []
      };

      appState.savingsGoals.push(newGoal);

      addAuditLog('🎯 Nueva Bóveda', `Creada: ${name} (Meta: S/ ${target})`);
      saveState();
      closeModal('addGoalModal');
      renderAll();
      switchTab('metas');
      showToast('🎯 Bóveda de ahorro creada con éxito', 'success');
    }

    async function deleteGoal(id) {
      const g = (appState.savingsGoals || []).find(item => item.id === id);
      if (!g) return;
      if (!await uiConfirm(`¿Eliminar la bóveda "${g.name}"?\n(El saldo acumulado actual de S/ ${g.current.toFixed(2)} dejará de contabilizarse en metas).`)) return;
      recordDeletedIds(id);
      addAuditLog('🗑️ Eliminar Bóveda', `Eliminada: ${g.name}`);
      appState.savingsGoals = appState.savingsGoals.filter(item => item.id !== id);
      saveState();
      renderAll();
      showToast('🗑️ Bóveda eliminada', 'info');
    }

    // Micro-Aporte Rápido de 1 Toque
    async function quickDepositGoal(id, amount) {
      const g = (appState.savingsGoals || []).find(item => item.id === id);
      if (!g || !amount || amount <= 0) return;

      g.current = roundCurrency((g.current || 0) + amount);
      if (!g.history) g.history = [];

      const todayStr = new Date().toLocaleDateString('es-PE');
      g.history.unshift({
        id: 'gh_' + Date.now(),
        date: todayStr,
        type: 'deposit',
        amount: roundCurrency(amount),
        note: 'Micro-aporte rápido'
      });

      // Blindar en movimientos del mes para descontarlo del gasto diario
      const nowDay = new Date().getDate();
      if (!appState.transactions[appState.currentMonth]) appState.transactions[appState.currentMonth] = [];
      appState.transactions[appState.currentMonth].push({
        id: 'tx_save_' + Date.now(),
        name: `Aporte: ${g.name}`,
        amount: roundCurrency(amount),
        category: 'Ahorro',
        status: 'Pagado',
        isInstallment: false,
        installmentsTotal: 1,
        installmentsCurrent: 1,
        dueDate: String(nowDay),
        note: 'Aporte rápido blindado'
      });

      addAuditLog('💰 Micro-Aporte Bóveda', `+S/ ${amount.toFixed(2)} a ${g.name}`);
      saveState();
      renderAll();
      showToast(`✨ S/ ${amount} blindados en tu meta "${g.name}"`, 'success');
    }
    window.quickDepositGoal = quickDepositGoal;

    function openDepositGoalModal(id) {
      const g = (appState.savingsGoals || []).find(item => item.id === id);
      if (!g) return;
      const sym = getCurrencySymbol();
      const loc = getActiveCurrency().locale;

      const targetInfo = document.getElementById('depositGoalTargetInfo');
      if (targetInfo) {
        targetInfo.innerHTML = `
          <div>
            <div style="font-size: 14.5px; font-weight: 800; color: var(--text-main);">${escapeHtml(g.icon || '🎯')} ${escapeHtml(g.name)}</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
              Ahorrado: <strong class="sensitive-amount">${sym} ${(g.current || 0).toLocaleString(loc, { minimumFractionDigits: 2 })}</strong> / Meta: <span class="sensitive-amount">${sym} ${(g.target || 0).toLocaleString(loc, { minimumFractionDigits: 0 })}</span>
            </div>
          </div>
          <span style="font-size: 13px; font-weight: 800; color: #059669; background: rgba(16, 185, 129, 0.12); padding: 4px 10px; border-radius: 999px;">
            ${Math.min(100, Math.round(((g.current || 0) / (g.target || 1)) * 100))}%
          </span>
        `;
      }

      document.getElementById('depositGoalId').value = id;
      const depositAmtInput = document.getElementById('depositAmount');
      if (depositAmtInput) depositAmtInput.value = '';
      const depositNoteInput = document.getElementById('depositNote');
      if (depositNoteInput) depositNoteInput.value = '';
      const deductCheckbox = document.getElementById('depositDeductFromBudget');
      if (deductCheckbox) deductCheckbox.checked = true;

      openModalById('depositGoalModal');
    }

    function handleDepositGoal(e) {
      e.preventDefault();
      const id = document.getElementById('depositGoalId').value;
      const amount = parseFloat(document.getElementById('depositAmount').value);
      const note = (document.getElementById('depositNote')?.value || '').trim();
      const deductFromBudget = document.getElementById('depositDeductFromBudget')?.checked;

      if (!amount || amount <= 0) {
        showToast('🚨 Ingresa un monto de aporte válido.', 'error');
        return;
      }

      const g = (appState.savingsGoals || []).find(item => item.id === id);
      if (g) {
        g.current = roundCurrency((g.current || 0) + amount);
        if (!g.history) g.history = [];

        const todayStr = new Date().toLocaleDateString('es-PE');
        g.history.unshift({
          id: 'gh_' + Date.now(),
          date: todayStr,
          type: 'deposit',
          amount: roundCurrency(amount),
          note: note || 'Aporte a bóveda'
        });

        // Registrar en transacciones del mes si está marcado
        if (deductFromBudget) {
          const nowDay = new Date().getDate();
          if (!appState.transactions[appState.currentMonth]) appState.transactions[appState.currentMonth] = [];
          appState.transactions[appState.currentMonth].push({
            id: 'tx_save_' + Date.now(),
            name: `Aporte: ${g.name}`,
            amount: roundCurrency(amount),
            category: 'Ahorro',
            status: 'Pagado',
            isInstallment: false,
            installmentsTotal: 1,
            installmentsCurrent: 1,
            dueDate: String(nowDay),
            note: note || 'Ahorro programado en meta'
          });
        }

        addAuditLog('💰 Aporte Bóveda', `S/ ${amount.toFixed(2)} a ${g.name}`);
        saveState();
        closeModal('depositGoalModal');
        renderAll();
        showToast(`💰 S/ ${amount.toFixed(2)} sumados a ${g.name}`, 'success');
      }
    }

    function openWithdrawGoalModal(id) {
      const g = (appState.savingsGoals || []).find(item => item.id === id);
      if (!g) return;
      const sym = getCurrencySymbol();
      const loc = getActiveCurrency().locale;

      const targetInfo = document.getElementById('withdrawGoalTargetInfo');
      if (targetInfo) {
        targetInfo.innerHTML = `
          <div>
            <div style="font-size: 14.5px; font-weight: 800; color: var(--text-main);">${escapeHtml(g.icon || '🎯')} ${escapeHtml(g.name)}</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
              Disponible en esta bóveda: <strong class="sensitive-amount" style="color: #e11d48;">${sym} ${(g.current || 0).toLocaleString(loc, { minimumFractionDigits: 2 })}</strong>
            </div>
          </div>
        `;
      }

      document.getElementById('withdrawGoalId').value = id;
      const withdrawAmtInput = document.getElementById('withdrawAmount');
      if (withdrawAmtInput) {
        withdrawAmtInput.value = '';
        withdrawAmtInput.max = g.current || 0;
      }
      const withdrawNoteInput = document.getElementById('withdrawNote');
      if (withdrawNoteInput) withdrawNoteInput.value = '';
      const creditCheckbox = document.getElementById('withdrawCreditToIncomes');
      if (creditCheckbox) creditCheckbox.checked = true;

      openModalById('withdrawGoalModal');
    }

    function handleWithdrawGoal(e) {
      e.preventDefault();
      const id = document.getElementById('withdrawGoalId').value;
      const amount = parseFloat(document.getElementById('withdrawAmount').value);
      const note = (document.getElementById('withdrawNote')?.value || '').trim();
      const creditToIncomes = document.getElementById('withdrawCreditToIncomes')?.checked;

      if (!amount || amount <= 0) {
        showToast('🚨 Ingresa un monto a retirar válido.', 'error');
        return;
      }

      const g = (appState.savingsGoals || []).find(item => item.id === id);
      if (!g) return;

      if (amount > (g.current || 0)) {
        showToast(`🚨 El monto excede el saldo de la bóveda (S/ ${(g.current || 0).toFixed(2)}).`, 'error');
        return;
      }

      g.current = roundCurrency(Math.max(0, (g.current || 0) - amount));
      if (!g.history) g.history = [];

      const todayStr = new Date().toLocaleDateString('es-PE');
      g.history.unshift({
        id: 'gh_' + Date.now(),
        date: todayStr,
        type: 'withdraw',
        amount: roundCurrency(amount),
        note: note || 'Retiro de ahorro'
      });

      // Si desea reintegrar a los ingresos del mes corriente
      if (creditToIncomes) {
        const curM = appState.currentMonth;
        if (!appState.incomes) appState.incomes = {};
        if (!appState.incomes[curM]) appState.incomes[curM] = [];
        appState.incomes[curM].push({
          id: 'inc_withdraw_' + Date.now(),
          name: `Rescate Bóveda: ${g.name}`,
          amount: roundCurrency(amount),
          status: 'Recibido',
          date: new Date().getDate(),
          note: note || 'Retiro de bóveda de ahorro'
        });
      }

      addAuditLog('💸 Retiro Bóveda', `S/ ${amount.toFixed(2)} de ${g.name}`);
      saveState();
      closeModal('withdrawGoalModal');
      renderAll();
      showToast(`💸 S/ ${amount.toFixed(2)} retirados de ${g.name}`, 'info');
    }

    window.renderGoals = renderGoals;
    window.openAddGoalModal = openAddGoalModal;
    window.handleOpenAddGoalClick = handleOpenAddGoalClick;
    window.handleAddGoal = handleAddGoal;
    window.deleteGoal = deleteGoal;
    window.openDepositGoalModal = openDepositGoalModal;
    window.handleDepositGoal = handleDepositGoal;
    window.openWithdrawGoalModal = openWithdrawGoalModal;
    window.handleWithdrawGoal = handleWithdrawGoal;

    /* ====== 2. RADAR DE GASTOS HORMIGA & FUGAS ====== */

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

      const radarTotal = plannedServices.length + microExpenses.length;
      let executiveHtml = `
        <!-- Filtros Rápidos & Buscador de Gastos (solo si hay datos) -->
        ${radarTotal > 0 ? `<div class="radar-controls-row">
          <button type="button" class="radar-filter-pill ${radarActiveFilter === 'all' ? 'active' : ''}" onclick="setRadarFilter('all')">Todos (${radarTotal})</button>
          <button type="button" class="radar-filter-pill ${radarActiveFilter === 'services' ? 'active' : ''}" onclick="setRadarFilter('services')">📱 Servicios (${plannedServices.length})</button>
          <button type="button" class="radar-filter-pill ${radarActiveFilter === 'micro' ? 'active' : ''}" onclick="setRadarFilter('micro')">🐜 Menores &lt;35 (${microExpenses.length})</button>
          <input type="text" placeholder="🔍 Buscar servicio o gasto..." value="${escapeHtml(radarSearchTerm)}" oninput="onRadarSearchInput(this.value)" class="radar-search-input">
        </div>` : ''}

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
                <div class="radar-sub-monthly sensitive-amount">${getCurrencySymbol()} ${item.monthly.toFixed(2)}/mes</div>
                <div class="radar-sub-annual sensitive-amount" title="Equivalente en 12 meses">${getCurrencySymbol()} ${item.annual.toFixed(2)} al año</div>
              </div>
            </div>
          `).join('') : `
            <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 12px;">
              ${radarTotal > 0 ? 'No se encontraron resultados para el filtro seleccionado.' : 'Aún no hay servicios ni gastos menores este mes.'}
            </div>
          `}
        </div>

        <!-- Costo Anual Proyectado con Explicación Transparente -->
        <div class="radar-cost-banner" style="margin-top: 12px;">
          <div class="radar-cost-banner-title">Impacto Anual Proyectado en Servicios Fijos</div>
          <div class="radar-cost-banner-val sensitive-amount">${getCurrencySymbol()} ${servicesAnnualTotal.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} al año</div>
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

    // ====== GESTIÓN DE TARJETAS COLAPSABLES Y BOTÓN MAESTRO EN FINANZAS (v78.3) ======
    const PLAN_CARDS = ['discipline503020Card', 'radarFugasCard', 'cardCategoryBudgets', 'cardCuotasRendimiento'];

    function togglePlanCard(cardId) {
      const card = document.getElementById(cardId);
      if (!card) return;
      const isCollapsed = card.classList.toggle('plan-card-collapsed');
      localStorage.setItem('pref_plancard_' + cardId, isCollapsed ? 'collapsed' : 'expanded');
      updateToggleAllPlanCardsButtonText();
    }
    window.togglePlanCard = togglePlanCard;

    function toggleAllPlanCards() {
      // Si al menos una tarjeta está expandida, contraer todas. De lo contrario, expandir todas.
      const anyExpanded = PLAN_CARDS.some(id => {
        const c = document.getElementById(id);
        return c && !c.classList.contains('plan-card-collapsed');
      });

      const shouldCollapse = anyExpanded;
      PLAN_CARDS.forEach(id => {
        const c = document.getElementById(id);
        if (c) {
          c.classList.toggle('plan-card-collapsed', shouldCollapse);
          localStorage.setItem('pref_plancard_' + id, shouldCollapse ? 'collapsed' : 'expanded');
        }
      });
      updateToggleAllPlanCardsButtonText();
    }
    window.toggleAllPlanCards = toggleAllPlanCards;

    function updateToggleAllPlanCardsButtonText() {
      const anyExpanded = PLAN_CARDS.some(id => {
        const c = document.getElementById(id);
        return c && !c.classList.contains('plan-card-collapsed');
      });
      const txt = document.getElementById('textToggleAllPlanCards');
      const icon = document.getElementById('iconToggleAllPlanCards');
      if (txt) txt.textContent = anyExpanded ? 'Contraer Todo' : 'Expandir Todo';
      if (icon) icon.textContent = anyExpanded ? '↕️' : '⏬';
    }
    window.updateToggleAllPlanCardsButtonText = updateToggleAllPlanCardsButtonText;

    function initPlanCollapsibleCards() {
      PLAN_CARDS.forEach(id => {
        const pref = localStorage.getItem('pref_plancard_' + id);
        const card = document.getElementById(id);
        if (card && pref === 'collapsed') {
          card.classList.add('plan-card-collapsed');
        }
      });
      updateToggleAllPlanCardsButtonText();
    }
    window.initPlanCollapsibleCards = initPlanCollapsibleCards;

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
      uiAlert(`💡 Oportunidad Financiera de Ahorro:\n\nSi optimizas y reduces a la mitad estos micro-gastos, acumularías S/ ${halfSaved} libres al año.\n\nEsto equivale a financiar tu fondo de emergencia o un viaje sin sacrificar tu calidad de vida.`);
    }

    function showGroupOptimizationTip(key, annual) {
      const tips = {
        cafes: `☕ Consejo de Café & Snacks:\nGastas S/ ${annual.toLocaleString()} al año. Preparar tu café en casa 3 días a la semana te ahorrará más de S/ ${(annual * 0.4).toFixed(0)} anuales.`,
        delivery: `🛵 Consejo de Delivery:\nGastas S/ ${annual.toLocaleString()} al año. Cocinar una vez más por semana o recoger los pedidos sin tarifa express ahorra hasta S/ ${(annual * 0.45).toFixed(0)}.`,
        suscripciones: `📺 Consejo de Suscripciones:\nGastas S/ ${annual.toLocaleString()} al año. Audita los servicios que usas menos de 2 veces por semana y paúsalos por temporadas.`,
        taxis: `🚕 Consejo de Taxis:\nGastas S/ ${annual.toLocaleString()} al año. Planificar tus salidas con 15 minutos de anticipación amortigua S/ ${(annual * 0.35).toFixed(0)}.`,
        otros: `🐜 Micro-gastos diversos:\nSumaron S/ ${annual.toLocaleString()} al año. Asignar un presupuesto semanal en efectivo para compras sueltas frena las fugas invisibles.`
      };
      uiAlert(tips[key] || `Optimizando este rubro puedes recuperar parte de los S/ ${annual.toLocaleString()} al año.`);
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
          <td style="font-size: 10px; font-weight: 700; color: var(--text-muted);">${escapeHtml(entry.timestamp)}</td>
          <td><span class="badge badge-casa">${escapeHtml(entry.month)}</span></td>
          <td style="font-weight: 800;">${escapeHtml(entry.action)}</td>
          <td style="font-size: 11px;">${escapeHtml(entry.details)}</td>
        </tr>
      `).join('');
    }

    async function clearAuditLog() {
      if (!await uiConfirm('¿Borrar historial de auditoría?')) return;
      appState.auditLog = [];
      saveState();
      renderAuditTable();
    }

    function renderPersonalizedTips() {
      const container = document.getElementById('personalizedTipsContainer');
      if (!container) return;
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
      
      if (!name) return uiAlert('Debes ingresar un nombre para la categoría.');
      
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
      if (document.getElementById('txPropagateFuture')) document.getElementById('txPropagateFuture').checked = false;

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

    function _catArg(cat) {
      return encodeURIComponent(cat).replace(/'/g, '%27');
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
          ? `<button onclick="deleteCategoryFromManager(decodeURIComponent('${_catArg(cat)}'))" title="Eliminar categoría" style="background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); color:#f87171; border-radius:8px; width:28px; height:28px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:12px;">🗑️</button>` 
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
                  ${escapeHtml(cat)}
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
              <button onclick="editCategoryBudgetFromManager(decodeURIComponent('${_catArg(cat)}'))" title="Editar límite de presupuesto" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); color:#cbd5e1; border-radius:8px; width:28px; height:28px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:12px;">✏️</button>
              ${deleteBtn}
            </div>
          </div>
        `;
      }).join('');
    }

    function saveCategoryFromManager() {
      const name = document.getElementById('managerCatName').value.trim().replace(/\s+/g, ' ');
      const icon = document.getElementById('managerCatIcon').value.trim() || '🏷️';
      const color = document.getElementById('managerCatColor').value || '#38bdf8';
      const budget = parseFloat(document.getElementById('managerCatBudget').value) || 1000;

      if (!name) return uiAlert('Por favor ingresa un nombre para la categoría.');

      const existing = Object.keys(CATEGORIES).find(c => c.toLowerCase() === name.toLowerCase());
      if (existing) return uiAlert(`Ya existe la categoría "${existing}". Usa otro nombre o edita su límite con ✏️.`);

      if (!appState.customCategories) appState.customCategories = {};
      if (!appState.categoryBudgets) appState.categoryBudgets = {};

      // Si el usuario eliminó antes una categoría con este nombre, reactivarla
      if (Array.isArray(appState.deletedCategories)) {
        appState.deletedCategories = appState.deletedCategories.filter(c => c !== name);
      }

      appState.customCategories[name] = {
        icon: icon,
        badgeClass: 'badge-custom',
        color: color
      };
      appState.categoryBudgets[name] = budget;

      addAuditLog('🏷️ Categoría', `Nueva categoría: ${icon} ${name} (Límite: S/ ${budget})`);
      saveState();
      try { updateDynamicCategories(); } catch (e) { console.warn('updateDynamicCategories:', e); }
      // El modal se refresca primero: nunca depende de que el resto de la app renderice bien
      try { renderCategoryManagerList(); } catch (e) { console.warn('renderCategoryManagerList:', e); }
      try { renderAll(); } catch (e) { console.warn('renderAll:', e); }

      document.getElementById('managerCatName').value = '';
      showToast(`✅ Categoría "${name}" creada con éxito`, 'success');
    }

    function handleSaveCategoryClick() {
      if (isUserPro()) {
        saveCategoryFromManager();
        return;
      }
      // Usuarios gratuitos: permitir hasta 3 categorías personalizadas
      const customCount = Object.keys(appState.customCategories || {}).length;
      if (customCount >= 3) {
        openFinZenProModal('Categorías Personalizadas Ilimitadas');
        return;
      }
      saveCategoryFromManager();
    }

    async function editCategoryBudgetFromManager(cat) {
      const current = (appState.categoryBudgets && appState.categoryBudgets[cat]) || 1000;
      const val = await uiPrompt(`Ingresa nuevo límite mensual para ${cat} (S/):`, current, { inputMode: 'decimal' });
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

    async function deleteCategoryFromManager(cat) {
      if (cat === 'Otros') return uiAlert('No puedes eliminar la categoría por defecto.');
      const confirmDelete = await uiConfirm(`¿Estás seguro de eliminar la categoría "${cat}"?\n\nSi tiene gastos asociados históricos, se mostrarán bajo "Otros".`);
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
