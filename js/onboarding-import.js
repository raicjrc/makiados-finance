    // ================================================================
    // SIMULADOR DE CUOTAS Y CRÉDITO (GLASSMORPHISM)
    // ================================================================
    let simChartObj = null;
    let currentSimCuotas = 12;

    function checkFreeSimulationGate() {
      if (isUserPro()) return true;
      const curMonth = (appState && appState.currentMonth) || new Date().toISOString().slice(0, 7);
      const userKey = (currentUser && currentUser.id) ? currentUser.id : 'anon';
      const storageKey = `aliviafin_sim_count_${userKey}_${curMonth}`;
      const count = parseInt(localStorage.getItem(storageKey) || '0', 10);
      if (count >= 1) {
        openFinZenProModal('Simulador de Cuotas Ilimitado');
        showToast('🔒 Has usado tu simulación gratuita del mes. Pasa al Plan Anual PRO (S/ 29.90) para cálculos ilimitados.', 'info');
        return false;
      }
      return true;
    }

    function recordFreeSimulationUsed() {
      if (isUserPro()) return;
      const curMonth = (appState && appState.currentMonth) || new Date().toISOString().slice(0, 7);
      const userKey = (currentUser && currentUser.id) ? currentUser.id : 'anon';
      const storageKey = `aliviafin_sim_count_${userKey}_${curMonth}`;
      const count = parseInt(localStorage.getItem(storageKey) || '0', 10);
      localStorage.setItem(storageKey, String(count + 1));
      showToast('⚡ Simulación gratuita (1 de 1 usada este mes). Para simular compras ilimitadas, pásate al Plan Anual PRO.', 'info');
    }

    function openInstallmentsSimulatorModal() {
      if (typeof closeModal === 'function') {
        closeModal('settingsModal');
        closeModal('addExpenseModal');
      }
      switchTab('simulador');
    }

    function initSimuladorView() {
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

      updateSimulation();
    }
    window.initSimuladorView = initSimuladorView;

    function setSimPreset(concept, amount, cuotas, isZero) {
      const elConcept = document.getElementById('simConcept');
      const elAmount = document.getElementById('simAmount');
      const elZero = document.getElementById('simZeroInterest');
      if (elConcept) elConcept.value = concept;
      if (elAmount) elAmount.value = amount;
      if (elZero) {
        elZero.checked = isZero;
        const teaGroup = document.getElementById('simTeaGroup');
        if (teaGroup) teaGroup.style.display = isZero ? 'none' : 'block';
      }
      const pill = document.querySelector(`#simCuotasPills .glass-pill-opt:nth-child(${cuotas === 3 ? 1 : cuotas === 6 ? 2 : cuotas === 12 ? 3 : cuotas === 18 ? 4 : 5})`);
      setSimCuotas(cuotas, pill);
    }
    window.setSimPreset = setSimPreset;

    function setSimCuotas(n, el) {
      currentSimCuotas = n;
      document.querySelectorAll('#simCuotasPills .glass-pill-opt, .sim-pill-opt').forEach(p => p.classList.remove('active'));
      if (el) el.classList.add('active');
      updateSimulation();
    }

    function toggleSimZeroInterest() {
      const el = document.getElementById('simZeroInterest');
      const isZero = el ? el.checked : true;
      const teaGroup = document.getElementById('simTeaGroup');
      if (teaGroup) {
        teaGroup.style.display = isZero ? 'none' : 'block';
      }
      updateSimulation();
    }

    function updateSimulation() {
      const elAmount = document.getElementById('simAmount');
      if (!elAmount) return;
      const amount = parseFloat(elAmount.value) || 0;
      const cuotas = currentSimCuotas || 12;
      const startMonth = (document.getElementById('simStartMonth')?.value) || appState.currentMonth;
      const isZero = document.getElementById('simZeroInterest')?.checked ?? true;
      const teaInput = parseFloat(document.getElementById('simTea')?.value) || 0;
      
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
      const elQuota = document.getElementById('simMonthlyQuotaDisplay');
      if (elQuota) elQuota.textContent = `${sym} ${monthlyQuota.toFixed(2)}`;
      const elTot = document.getElementById('simTotalToPayDisplay');
      if (elTot) elTot.textContent = `${sym} ${totalToPay.toFixed(2)}`;

      const totalIncome = (typeof getMonthTotalIncome === 'function' ? getMonthTotalIncome() : 0) || 8800;
      const pctImpact = totalIncome > 0 ? ((monthlyQuota / totalIncome) * 100).toFixed(1) : 0;
      const elImpact = document.getElementById('simImpactDisplay');
      if (elImpact) elImpact.textContent = `-${pctImpact}% de tu ingreso mensual`;

      // Renderizar cronograma de pagos en tabla
      const schedContainer = document.getElementById('simScheduleTableContainer');
      if (schedContainer) {
        const allMonths = getSortedMonths();
        let startIdx = allMonths.indexOf(startMonth);
        if (startIdx === -1) startIdx = allMonths.indexOf(appState.currentMonth);
        if (startIdx === -1) startIdx = 0;
        const targetMonths = allMonths.slice(startIdx, startIdx + cuotas);
        
        let schedHtml = `
          <table class="sim-schedule-table">
            <thead>
              <tr>
                <th style="width: 40px;">#</th>
                <th>Mes</th>
                <th>Cuota</th>
                <th style="text-align: right;">Saldo Restante</th>
              </tr>
            </thead>
            <tbody>
        `;
        let rem = totalToPay;
        targetMonths.forEach((m, idx) => {
          rem = Math.max(0, rem - monthlyQuota);
          schedHtml += `
            <tr>
              <td><strong>#${idx + 1}</strong></td>
              <td>${m}</td>
              <td style="font-weight: 700; color: #0284c7;">${sym} ${monthlyQuota.toFixed(2)}</td>
              <td style="text-align: right; color: var(--text-muted);">${sym} ${rem.toFixed(2)}</td>
            </tr>
          `;
        });
        schedHtml += `</tbody></table>`;
        schedContainer.innerHTML = schedHtml;
      }

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

      if (!concept) return uiAlert('Por favor ingresa un concepto para la compra.');
      if (amount <= 0) return uiAlert('Por favor ingresa un monto válido.');

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

    async function openOnboardingWizard(force = false) {
      if (!force) {
        // SEGURIDAD CRÍTICA: Nunca abrir si el servidor aún no ha confirmado la carga del usuario
        if (window._serverStateLoaded !== true) {
          console.warn('🛡️ Onboarding bloqueado: esperando confirmación de datos del servidor');
          return;
        }

        // Administrador César jamás ve el onboarding
        if (isAdminCesar()) return;

        const userKey = currentUser ? currentUser.id : 'guest';
        const isAlreadySetup = (appState && (appState.onboardingCompleted === true || appState.onboardingSkipped === true))
                            || localStorage.getItem('finanzas_setup_completed_' + userKey) === 'true'
                            || localStorage.getItem('finanzas_setup_completed_' + userKey) === 'skipped'
                            || localStorage.getItem('finanzas_setup_completed') === 'true';

        const hasExistingData = userHasExistingFinancialData(appState);

        // Si ya está configurado o si el usuario ya tiene cualquier dato financiero, NO ABRIR
        if (isAlreadySetup || hasExistingData) {
          if (appState && !appState.onboardingCompleted) {
            appState.onboardingCompleted = true;
            saveLocalState();
          }
          localStorage.setItem('finanzas_setup_completed_' + userKey, 'true');
          localStorage.setItem('finanzas_setup_completed', 'true');
          return;
        }

        // ÚLTIMA DEFENSA: reconfirmar contra el servidor que esta cuenta realmente no tiene datos.
        // Ante cualquier duda (error de red, sesión no lista, datos presentes) NO se abre el asistente.
        if (currentUser && typeof supabaseClient !== 'undefined' && supabaseClient) {
          try {
            const { data: rows, error: vErr } = await supabaseClient
              .from('finanzas_state')
              .select('data')
              .eq('id', getUserStateId())
              .limit(1);
            if (vErr) return;
            if (rows && rows[0] && rows[0].data && userHasExistingFinancialData(rows[0].data)) {
              console.warn('🛡️ Onboarding cancelado: el servidor SÍ tiene datos de esta cuenta. Sincronizando...');
              lastKnownServerDataHash = '';
              applyRemoteState(rows[0].data);
              return;
            }
          } catch (vEx) { return; }
        }
      }

      // Si forzó pero ya tiene registros, confirmar para seguridad
      const hasExistingData = userHasExistingFinancialData(appState);
      if (force && hasExistingData) {
        if (!await uiConfirm('⚠️ Tu cuenta ya tiene registros financieros. Tus datos existentes se conservarán y solo se agregarán los nuevos gastos fijos. ¿Deseas continuar?')) {
          return;
        }
      }

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

      updateWizardExpenseCount();
      if (typeof updateWizardStep1Preview === 'function') updateWizardStep1Preview();

      closeModal('settingsModal');
      openModalById('onboardingWizardModal');
    }

    function setWizardSalaryPaidMode(mode) {
      const hiddenEl = document.getElementById('wSalaryAlreadyPaid');
      if (hiddenEl) hiddenEl.value = mode;
      const cardYes = document.getElementById('wCardPaidYes');
      const cardNo = document.getElementById('wCardPaidNo');
      if (cardYes) {
        cardYes.style.borderColor = (mode === 'yes') ? '#059669' : '#cbd5e1';
        cardYes.style.background = (mode === 'yes') ? '#ecfdf5' : 'rgba(255,255,255,0.85)';
      }
      if (cardNo) {
        cardNo.style.borderColor = (mode === 'no') ? '#059669' : '#cbd5e1';
        cardNo.style.background = (mode === 'no') ? '#ecfdf5' : 'rgba(255,255,255,0.85)';
      }
      // SIEMPRE VISIBLE: "¿Cuánto dinero tienes disponible HOY en tu banco/billetera?"
      const bankBox = document.getElementById('wCurrentBankBox');
      if (bankBox) bankBox.style.display = 'block';
      updateWizardStep1Preview();
    }
    window.setWizardSalaryPaidMode = setWizardSalaryPaidMode;

    function updateWizardStep1Preview() {
      const sym = (document.getElementById('wCurrencySelect')?.value || getCurrencySymbol() || 'S/').split(' ')[0];
      const salaryVal = parseFloat(document.getElementById('wSalaryInput')?.value) || 0;
      const rawBank = document.getElementById('wCurrentBankInput')?.value;
      const hasBankTyped = rawBank !== undefined && rawBank !== null && String(rawBank).trim() !== '';
      const bankVal = hasBankTyped ? (parseFloat(rawBank) || 0) : (document.getElementById('wSalaryAlreadyPaid')?.value === 'yes' ? salaryVal : 0);
      const mode = document.getElementById('wSalaryAlreadyPaid')?.value || 'no';
      const payDay = document.getElementById('wPayDaySelect')?.value || '28';

      const noteEl = document.getElementById('wCurrentBankHelperNote');
      if (noteEl) {
        if (mode === 'yes') {
          noteEl.innerHTML = `✨ Tu cuenta iniciará con tu saldo real hoy (<strong>${sym} ${bankVal.toFixed(2)}</strong>) y tu sueldo mensual quedará marcado como <strong>ya cobrado</strong> este mes.`;
        } else {
          noteEl.innerHTML = `✨ Tu cuenta iniciará con tu saldo real hoy (<strong>${sym} ${bankVal.toFixed(2)}</strong>) y tu sueldo de <strong>${sym} ${salaryVal.toFixed(0)}</strong> quedará programado para el día ${payDay}.`;
        }
      }

      const now = new Date();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const daysRemaining = Math.max(1, (daysInMonth - now.getDate()) + 1);
      const dailySafe = bankVal > 0 ? roundCurrency(bankVal / daysRemaining) : 0;

      const valEl = document.getElementById('wLiveSafeDailyVal');
      const subEl = document.getElementById('wLiveSafeDailySub');
      if (valEl) valEl.textContent = `${sym} ${dailySafe.toFixed(2)} / día`;
      if (subEl) {
        subEl.textContent = bankVal > 0
          ? `Con tus ${sym} ${bankVal.toFixed(0)} disponibles hoy entre los ${daysRemaining} días restantes del mes`
          : 'Ingresa cuánto tienes hoy en banco para calcular tu día a día';
      }
    }
    window.updateWizardStep1Preview = updateWizardStep1Preview;

    function goToWizardStep(step) {
      if (step < 1 || step > 3) return;
      wizardCurrentStep = step;

      const progressLine = document.getElementById('wizardProgressLine');
      if (progressLine) {
        const percentages = { 1: '0%', 2: '50%', 3: '100%' };
        progressLine.style.width = percentages[step] || '0%';
      }

      for (let s = 1; s <= 3; s++) {
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
          btnPrev.onclick = () => confirmDismissWizard();
        } else {
          btnPrev.textContent = `⬅️ Paso ${step - 1}`;
          btnPrev.onclick = () => goToWizardStep(step - 1);
        }
      }
      if (btnNext) {
        if (step === 3) {
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

    function updateWizardExpenseCount() {
      const container = document.getElementById('wFixedExpensesContainer');
      const countEl = document.getElementById('wExpenseCount');
      const addBtn = document.getElementById('btnAddWizardExpense');
      if (!container) return;

      const currentRows = container.querySelectorAll('.wizard-dynamic-row').length;
      if (countEl) countEl.textContent = currentRows;

      if (!isUserPro() && currentRows >= 11) {
        if (addBtn) {
          addBtn.disabled = true;
          addBtn.style.opacity = '0.6';
          addBtn.textContent = '🔒 Límite de 11 gastos alcanzado (Plan Gratuito)';
        }
      } else {
        if (addBtn) {
          addBtn.disabled = false;
          addBtn.style.opacity = '1';
          addBtn.textContent = '➕ Agregar Otro Gasto Fijo';
        }
      }
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
        <input type="text" class="form-control w-exp-name" placeholder="Concepto (ej. Luz)" value="${escapeHtml(name)}" style="font-size: 16px; padding: 6px 8px;" required>
        <select class="form-control w-exp-cat" style="font-size: 16px; padding: 6px 4px;">
          ${catOptions}
        </select>
        <input type="number" class="form-control w-exp-amount" placeholder="Monto S/" value="${amount}" step="any" style="font-size: 16px; padding: 6px 8px; font-weight: 700;">
        <div class="w-exp-due-wrap" style="display: flex; align-items: center; gap: 4px;">
          <span style="font-size: 10px; color: var(--text-muted); font-weight: 600;">Día:</span>
          <input type="number" class="form-control w-exp-due" min="1" max="31" placeholder="15" value="${dueDate}" style="width: 48px; font-size: 16px; padding: 6px 4px; text-align: center;" required title="Día de vencimiento del mes">
        </div>
        <button type="button" class="w-exp-del" onclick="document.getElementById('${rowId}').remove(); updateWizardExpenseCount();" style="background: none; border: none; color: #ef4444; font-size: 16px; cursor: pointer; padding: 2px 6px;" title="Eliminar fila">✕</button>
      `;
      container.appendChild(row);
      updateWizardExpenseCount();
    }

    // ================================================================
    // MOTOR EXCEL (.xlsx) Y CARGA MASIVA DE GASTOS FIJOS
    // ================================================================
    function loadXLSXLibrary(onReady, onError) {
      if (typeof XLSX !== 'undefined') {
        if (onReady) onReady();
        return;
      }
      const script = document.createElement('script');
      script.src = 'js/xlsx.full.min.js?v=76.5';
      script.onload = () => {
        if (onReady) onReady();
      };
      script.onerror = () => {
        // Fallback a CDN de alta disponibilidad si fuera necesario
        const fallback = document.createElement('script');
        fallback.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
        fallback.onload = () => { if (onReady) onReady(); };
        fallback.onerror = () => {
          if (onError) onError();
          else showToast('❌ No se pudo cargar el motor de Excel. Inténtalo de nuevo.', 'error');
        };
        document.head.appendChild(fallback);
      };
      document.head.appendChild(script);
    }

    function normalizeExpenseCategory(rawCat, name) {
      if (!rawCat && !name) return 'Otros';
      const c = (rawCat || '').trim();
      const n = (name || '').trim();
      const combined = `${c} ${n}`.toLowerCase();

      // 1. Coincidencia exacta con categorías oficiales
      if (typeof CATEGORIES !== 'undefined' && CATEGORIES) {
        for (const officialCat of Object.keys(CATEGORIES)) {
          if (officialCat.toLowerCase() === c.toLowerCase()) return officialCat;
        }
      }

      // 2. Mapeo inteligente por semántica de gastos en Perú y Latam
      if (/alquiler|hipoteca|renta|departamento|casa|depa|condominio|arbitrio/i.test(combined)) return 'Vivienda';
      if (/luz|agua|sedapal|enel|pluz|gas|calidda|internet|fibra|win/i.test(combined)) return 'Servicios';
      if (/comida|supermercado|metro|plaza vea|tottus|vivanda|mercado|almuerzo|cena|viveres|abarrotes/i.test(combined)) return 'Alimentación';
      if (/gasolina|combustible|grifo|repsol|primax|pasaje|metropolitano|corredor|taxi|uber|didi|cabify/i.test(combined)) return 'Transporte';
      if (/farmacia|inkafarma|mifarma|medico|doctor|clinica|hospital|seguro|salud|medicamento|gym|gimnasio/i.test(combined)) return 'Salud';
      if (/colegio|universidad|pension|utp|pucp|upc|instituto|curso|diplomado|estudio/i.test(combined)) return 'Educación';
      if (/netflix|spotify|disney|prime|max|youtube|cine|planet|entretenimiento|juegos|playstation|steam/i.test(combined)) return 'Entretenimiento';
      if (/celular|movil|entel|claro|movistar|bitel|plan movil/i.test(combined)) return 'Celular';
      if (/tarjeta|visa|mastercard|diners|bcp|bbva|interbank|scotiabank|prestamo|credito|deuda|cuota/i.test(combined)) return 'Tarjetas';

      return 'Otros';
    }

    function downloadExpenseTemplateExcel() {
      showToast('⏳ Preparando plantilla Excel...', 'info');
      loadXLSXLibrary(() => {
        try {
          const wb = XLSX.utils.book_new();
          const rows = [
            ['Concepto / Gasto', 'Categoría', 'Monto (S/)', 'Día de Vencimiento'],
            ['Alquiler / Hipoteca', 'Vivienda', 650.00, 30],
            ['Servicios (Luz / Agua)', 'Servicios', 120.00, 15],
            ['Internet Fibra', 'Servicios', 60.00, 28],
            ['Plan Móvil', 'Celular', 39.90, 15],
            ['Gimnasio', 'Salud', 100.00, 5],
            ['Netflix / Streaming', 'Entretenimiento', 45.00, 20]
          ];
          const ws = XLSX.utils.aoa_to_sheet(rows);
          // Ancho de columnas ergonómico
          ws['!cols'] = [
            { wch: 26 }, // Concepto
            { wch: 18 }, // Categoría
            { wch: 14 }, // Monto
            { wch: 20 }  // Día de vencimiento
          ];
          XLSX.utils.book_append_sheet(wb, ws, 'Gastos Fijos');

          // Hoja 2: Guía de categorías y ayuda para el usuario
          const catRows = [
            ['Categoría Permitida', 'Sinónimos y Ejemplos Habituales'],
            ['Vivienda', 'Alquiler, hipoteca, mantenimiento, departamento'],
            ['Servicios', 'Luz, agua, gas natural, internet de fibra óptica'],
            ['Alimentación', 'Supermercado, comida de casa, víveres, mercado'],
            ['Transporte', 'Gasolina, transporte público, pasajes, taxis, Uber'],
            ['Salud', 'Farmacias, seguros de salud, citas médicas, gimnasio'],
            ['Educación', 'Colegios, universidades, institutos, cursos, libros'],
            ['Entretenimiento', 'Netflix, Spotify, cine, salidas, ocio'],
            ['Celular', 'Planes móviles (Claro, Movistar, Entel, Bitel)'],
            ['Tarjetas', 'Pago de tarjetas de crédito o cuotas de compras'],
            ['Otros', 'Cualquier otro compromiso o gasto mensual']
          ];
          const wsCat = XLSX.utils.aoa_to_sheet(catRows);
          wsCat['!cols'] = [{ wch: 22 }, { wch: 55 }];
          XLSX.utils.book_append_sheet(wb, wsCat, 'Categorías Permitidas');
          
          // Generar buffer XLSX binario nativo
          const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'plantilla_gastos_aliviafin.xlsx';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          showToast('📥 Plantilla Excel (.xlsx) con guía de categorías descargada.', 'success');
        } catch(err) {
          console.error('Error generando XLSX:', err);
          downloadExpenseTemplateCSV(); // Fallback a CSV
        }
      }, () => {
        downloadExpenseTemplateCSV();
      });
    }

    function downloadExpenseTemplateCSV() {
      const csvHeader = 'Concepto,Categoria,Monto,DiaVencimiento\n';
      const csvRows = [
        'Alquiler / Casa,Vivienda,650.00,30',
        'Servicio Luz y Agua,Servicios,120.00,15',
        'Internet Fibra,Servicios,60.00,28',
        'Plan Movil,Celular,39.90,15'
      ].join('\n');
      const csvContent = '\uFEFF' + csvHeader + csvRows;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'plantilla_gastos_aliviafin.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('📥 Plantilla descargada.', 'success');
    }

    function triggerImportExpensesExcel() {
      const fileInput = document.getElementById('wExcelFileInput') || document.getElementById('wCsvFileInput');
      if (fileInput) {
        fileInput.value = '';
        fileInput.click();
      }
    }

    function triggerImportExpensesCSV() {
      triggerImportExpensesExcel();
    }

    function handleImportExpensesExcel(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const fileName = file.name.toLowerCase();
      const isExcelFile = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

      if (isExcelFile) {
        showToast('⏳ Leyendo archivo Excel...', 'info');
        loadXLSXLibrary(() => {
          const reader = new FileReader();
          reader.onload = function(e) {
            try {
              const data = new Uint8Array(e.target.result);
              const workbook = XLSX.read(data, { type: 'array' });
              const firstSheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[firstSheetName];
              const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

              if (!rows || rows.length <= 1) {
                showToast('⚠️ El archivo Excel está vacío o solo contiene encabezados', 'warning');
                return;
              }

              processImportedExpenseRows(rows, true);
            } catch(err) {
              console.error('Error parseando XLSX:', err);
              showToast('❌ Error al leer el archivo Excel. Verifica el formato.', 'error');
            }
          };
          reader.readAsArrayBuffer(file);
        });
      } else {
        // Archivo CSV o texto
        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            const content = e.target.result;
            const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
            if (lines.length <= 1) {
              showToast('⚠️ El archivo está vacío o solo contiene encabezados', 'warning');
              return;
            }

            const rows = lines.map(line => {
              const sep = line.includes(';') ? ';' : ',';
              return line.split(sep).map(p => p.trim().replace(/^["']|["']$/g, ''));
            });

            processImportedExpenseRows(rows, false);
          } catch(err) {
            console.error('Error parseando CSV:', err);
            showToast('❌ Error al leer el archivo CSV.', 'error');
          }
        };
        reader.readAsText(file, 'UTF-8');
      }
    }

    function processImportedExpenseRows(rows) {
      const container = document.getElementById('wFixedExpensesContainer');
      if (!container) return;

      container.innerHTML = '';

      let addedCount = 0;
      const isPro = isUserPro();
      const maxAllowed = isPro ? 100 : 11;

      // Detectar encabezado
      const firstRowStr = (rows[0] || []).join(' ').toLowerCase();
      const startIndex = /concepto|nombre|item|gasto|categor/i.test(firstRowStr) ? 1 : 0;

      for (let i = startIndex; i < rows.length; i++) {
        if (addedCount >= maxAllowed) break;

        const row = rows[i];
        if (!row || row.length === 0) continue;

        const name = String(row[0] || '').trim();
        const rawCat = String(row[1] || '').trim();
        const cat = normalizeExpenseCategory(rawCat, name);

        let amtRaw = row[2];
        if (typeof amtRaw === 'string') {
          amtRaw = parseFloat(amtRaw.replace(/[^\d.-]/g, '')) || 0;
        } else {
          amtRaw = Number(amtRaw) || 0;
        }
        const due = String(row[3] || '15').trim();

        if (name && amtRaw >= 0) {
          addWizardExpenseRow(name, amtRaw, cat, due);
          addedCount++;
        }
      }

      updateWizardExpenseCount();

      const remainingAvailable = maxAllowed - addedCount;
      if (!isPro && addedCount >= 11) {
        showToast(`✅ Se cargaron los 11 gastos (tope de la versión gratuita). Pasa a Pro para gastos ilimitados.`, 'info');
      } else {
        showToast(`✅ Se cargaron ${addedCount} gastos desde tu Excel. (Te quedan ${remainingAvailable} disponibles)`, 'success');
      }
    }

    function handleImportExpensesCSV(event) {
      handleImportExpensesExcel(event);
    }

    async function confirmDismissWizard() {
      const salaryInput = document.getElementById('wSalaryInput');
      const hasSalary = salaryInput && salaryInput.value.trim().length > 0;
      const fixedRows = document.querySelectorAll('#wFixedExpensesContainer .wizard-dynamic-row').length;
      if (hasSalary || fixedRows > 0) {
        if (!await uiConfirm('¿Deseas salir del asistente? Si sales ahora sin guardar, tu configuración no se aplicará.')) {
          return;
        }
      }
      dismissOnboardingWizard(true);
    }

    function completeOnboardingWizard() {
      // 1. Guardar Ingresos y Estado de Cobro Actual
      const salaryVal = parseFloat(document.getElementById('wSalaryInput')?.value);
      const payDay = document.getElementById('wPayDaySelect')?.value || '28';
      const payDayNum = parseInt(payDay) || 28;
      const salaryPaidMode = document.getElementById('wSalaryAlreadyPaid')?.value || 'no';
      const salaryInitialStatus = (salaryPaidMode === 'yes') ? 'Recibido' : 'Pendiente';

      const curM = appState.currentMonth || getCurrentCalendarMonthName();
      if (!appState.incomes) appState.incomes = {};
      if (!appState.incomes[curM]) appState.incomes[curM] = [];

      if (!isNaN(salaryVal) && salaryVal > 0) {
        appState.salary = salaryVal;
        const existingSalary = appState.incomes[curM].find(i => i.id.startsWith('inc_sueldo_') || i.name.toLowerCase().includes('sueldo'));
        if (existingSalary) {
          existingSalary.amount = salaryVal;
          existingSalary.date = payDayNum;
          existingSalary.status = salaryInitialStatus;
        } else {
          appState.incomes[curM].unshift({
            id: 'inc_sueldo_' + curM,
            name: 'Sueldo Mensual',
            amount: salaryVal,
            status: salaryInitialStatus,
            date: payDayNum
          });
        }
      }
      const savingsPct = parseInt(document.getElementById('wSavingsPercentRange')?.value) || 10;
      appState.targetSavingsPercent = savingsPct;

      if (!appState.recurringDueDates) appState.recurringDueDates = {};
      appState.recurringDueDates['sueldo'] = payDay;

      // 2. Guardar Gastos Fijos (Lectura resiliente y FUSIÓN SEGURA sin chancar datos existentes)
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
        // SEGURIDAD: FUSIÓN DE DATOS EN VEZ DE SOBREESCRITURA DESTRUCTIVA
        if (!appState.transactions[curMonth] || appState.transactions[curMonth].length === 0) {
          appState.transactions[curMonth] = [...newTxs];
        } else {
          newTxs.forEach(nt => {
            const alreadyExists = appState.transactions[curMonth].some(
              et => et.name.toLowerCase() === nt.name.toLowerCase()
            );
            if (!alreadyExists) {
              appState.transactions[curMonth].push(nt);
            }
          });
        }
      }

      // 2.5 Conciliar con el Saldo Real Disponible HOY en Banco / Billetera (#wCurrentBankInput)
      const rawBankStr = document.getElementById('wCurrentBankInput')?.value;
      const hasBankInput = rawBankStr !== undefined && rawBankStr !== null && String(rawBankStr).trim() !== '';
      const currentBankVal = hasBankInput ? parseFloat(String(rawBankStr).replace(',', '.')) : NaN;
      if (hasBankInput && !isNaN(currentBankVal) && currentBankVal >= 0) {
        appState.incomes[curMonth] = (appState.incomes[curMonth] || []).filter(i => !String(i.id || '').startsWith('inc_saldo_inicial_'));
        appState.transactions[curMonth] = (appState.transactions[curMonth] || []).filter(t => !String(t.id || '').startsWith('exp_gastos_previos_'));
        const calcBal = getAccumulatedBalance(curMonth);
        const diffBal = roundCurrency(currentBankVal - calcBal);
        if (diffBal > 0.01) {
          appState.incomes[curMonth].push({
            id: 'inc_saldo_inicial_' + curMonth,
            name: 'Saldo Disponible Inicial en Banco',
            amount: diffBal,
            status: 'Recibido',
            date: new Date().getDate()
          });
        } else if (diffBal < -0.01) {
          appState.transactions[curMonth].push({
            id: 'exp_gastos_previos_' + curMonth,
            name: 'Gastos previos del mes (antes de registrarme)',
            amount: roundCurrency(Math.abs(diffBal)),
            category: 'Otros',
            status: 'Pagado',
            paymentMethod: 'Banco',
            date: new Date().getDate()
          });
        }
      }

      // 3. Guardar Meta Inicial
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

      // Marcar onboarding como completado en memoria, servidor y localStorage
      appState.onboardingCompleted = true;
      const userKey = currentUser ? currentUser.id : 'guest';
      localStorage.setItem('finanzas_setup_completed_' + userKey, 'true');
      localStorage.setItem('finanzas_setup_completed', 'true');

      // Guardar y refrescar
      addAuditLog('🧭 Onboarding', 'Configuración inicial completada mediante asistente');
      saveState();
      if (currentUser && typeof recordUserHeartbeat === 'function') {
        recordUserHeartbeat(currentUser, true);
      }
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
        if (appState) {
          appState.onboardingCompleted = true;
          appState.onboardingSkipped = true;
          markLocalMutationDirty();
          saveLocalState();
          syncStateToServer();
        }
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

      const deskVer = document.getElementById('loginFooterVersionDesk');
      if (deskVer) deskVer.textContent = 'AliviaFin ' + APP_VERSION;

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
      try {
        sessionStorage.setItem('aliviafin_update_handled_' + APP_VERSION, '1');
      } catch (e) {}
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
            window.location.href = window.location.origin + window.location.pathname;
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
    }

    function dismissWhatsNewModal(confirmed = false) {
      closeModal('whatsNewModal');
      if (confirmed) {
        const userKey = currentUser ? currentUser.id : 'guest';
        localStorage.setItem('aliviafin_whats_new_confirmed_' + APP_VERSION, 'true');
        localStorage.setItem('aliviafin_whats_new_confirmed_' + userKey + '_' + APP_VERSION, 'true');
        localStorage.setItem('finanzas_last_seen_version_' + userKey, APP_VERSION);
        localStorage.setItem('finanzas_last_seen_version', APP_VERSION);
        showToast('✨ ¡Novedades confirmadas! Que disfrutes AliviaFin ' + APP_VERSION, 'success');
      }
    }

    // Comprobación automática de bienvenida, versión y anuncios
    function checkOnboardingAndVersionAnnouncements() {
      syncVersionUI();
      // SEGURIDAD: Nunca verificar onboarding mientras el servidor no haya terminado de cargar
      if (window._serverStateLoaded !== true) return;

      const userKey = currentUser ? currentUser.id : 'guest';
      const isCesar = isAdminCesar();
      const setupDone = (appState && (appState.onboardingCompleted === true || appState.onboardingSkipped === true))
                     || localStorage.getItem('finanzas_setup_completed_' + userKey) === 'true'
                     || localStorage.getItem('finanzas_setup_completed_' + userKey) === 'skipped'
                     || (userKey === 'guest' && localStorage.getItem('finanzas_setup_completed') === 'true');

      const hasData = userHasExistingFinancialData(appState);

      if (setupDone || hasData || isCesar) {
        // Usuario existente con datos o que ya completó onboarding: blindar flags
        if (appState && !appState.onboardingCompleted) {
          appState.onboardingCompleted = true;
          saveLocalState();
        }
        localStorage.setItem('finanzas_setup_completed_' + userKey, 'true');
        localStorage.setItem('finanzas_setup_completed', 'true');
      } else {
        // Usuario 100% nuevo, sin datos y con carga de servidor confirmada
        setTimeout(() => openOnboardingWizard(false), 500);
        return;
      }

      // Verificación de novedades para la versión actual:
      // Debe aparecer al loguearse o al actualizar la página mientras está logueado,
      // y seguirá apareciendo hasta que el usuario confirme lectura ("¡Entendido, a explorar!").
      const isConfirmed = localStorage.getItem('aliviafin_whats_new_confirmed_' + userKey + '_' + APP_VERSION) === 'true'
                       || localStorage.getItem('aliviafin_whats_new_confirmed_' + APP_VERSION) === 'true';

      if (!isConfirmed) {
        setTimeout(() => {
          openWhatsNewModal();
        }, 1100);
      }
    }
