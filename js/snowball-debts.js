    // ================================================================
    // CENTRO ESTRATÉGICO BOLA DE NIEVE & ASESOR FINANCIERO (MOCKUP 1)
    // ================================================================
    let currentSnowballDebts = [];
    let currentDebtStrategy = 'snowball'; // 'snowball' o 'avalanche'
    let currentDebtExtraPayment = 0; // Por defecto 0 (sin amortización adicional)

    function extractDebtMetricsFromTx(c) {
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

      remaining = Math.max(0, remaining);

      const isLoan = /diners|préstamo|prestamo|revolving/i.test(c.name);
      const tea = (typeof c.tea === 'number') ? c.tea : (isLoan ? 28.5 : 0.0);
      const minP = Math.round(parseFloat(c.amount) || 0);
      const bal = Math.round(minP * remaining);
      const initialBal = Math.round(minP * total);

      current = Math.min(total, Math.max(1, total - remaining + 1));

      return {
        total,
        current,
        remaining,
        minPayment: minP,
        balance: bal,
        initialBalance: initialBal,
        tea
      };
    }
    window.extractDebtMetricsFromTx = extractDebtMetricsFromTx;

    function initDebtCommandCenterState() {
      const uKey = currentUser ? currentUser.id : 'guest';
      if (appState && appState.debtSnowball && Array.isArray(appState.debtSnowball.debts)) {
        currentSnowballDebts = JSON.parse(JSON.stringify(appState.debtSnowball.debts));
        if (appState.debtSnowball.extraPayment !== undefined && appState.debtSnowball.extraPayment !== null) {
          currentDebtExtraPayment = Math.max(0, parseFloat(appState.debtSnowball.extraPayment) || 0);
        }
        if (appState.debtSnowball.strategy) {
          currentDebtStrategy = appState.debtSnowball.strategy;
        }
      } else {
        const saved = localStorage.getItem('aliviafin_debt_snowball_' + uKey);
        if (saved) {
          try {
            const p = JSON.parse(saved);
            if (p.debts && p.debts.length > 0) currentSnowballDebts = p.debts;
            if (p.extraPayment !== undefined && p.extraPayment !== null) {
              currentDebtExtraPayment = Math.max(0, parseFloat(p.extraPayment) || 0);
            }
            if (p.strategy) currentDebtStrategy = p.strategy;
          } catch(e) {}
        } else {
          currentSnowballDebts = [];
        }
      }

      // Sincronizar en vivo los valores exactos canónicos de cuotas y saldos desde Movimientos
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
            const metrics = extractDebtMetricsFromTx(matchedTx);
            d.installmentsTotal = metrics.total;
            d.installmentsCurrent = metrics.current;
            d.remainingInstallments = metrics.remaining;
            d.minPayment = metrics.minPayment;
            d.balance = metrics.balance;
            d.initialBalance = metrics.initialBalance;
            d.tea = metrics.tea;
          } else {
            if (!d.initialBalance && d.installmentsTotal && d.minPayment) {
              d.initialBalance = Math.round(d.minPayment * d.installmentsTotal);
            }
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
      syncDebtsFromCuotas(true);
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
        titleEl.textContent = `Tus Compras en Cuotas y Compromisos (Orden: ${currentDebtStrategy === 'snowball' ? 'Bola de Nieve' : 'Menos Intereses'})`;
      }

      updateDebtStrategyExplainerUI(currentDebtStrategy);
      syncSnowballPresetButtons(currentDebtExtraPayment);
      calculateAndRenderDebtPlan(currentDebtExtraPayment);
      renderExecutiveAdvisor();
    }
    window.renderDebtCommandCenter = renderDebtCommandCenter;

    function updateDebtStrategyExplainerUI(strat) {
      const explainer = document.getElementById('debtStrategyExplainer');
      if (!explainer) return;
      if (strat === 'snowball') {
        explainer.innerHTML = `
          <span style="font-size: 16px; flex-shrink: 0;">❄️</span>
          <div>
            <strong>Método Bola de Nieve (Recomendado):</strong> Pagas primero la deuda más pequeña. Cada victoria rápida te motiva y usas esa cuota que se liberó para pagar la siguiente mucho más rápido.
          </div>
        `;
      } else {
        explainer.innerHTML = `
          <span style="font-size: 16px; flex-shrink: 0;">⚡</span>
          <div>
            <strong>Método Menos Intereses (Avalancha):</strong> Pagas primero la deuda con mayor tasa de interés (TEA). Minimizas los intereses totales que pagas a las entidades bancarias.
          </div>
        `;
      }
    }
    window.updateDebtStrategyExplainerUI = updateDebtStrategyExplainerUI;

    function syncSnowballPresetButtons(amount) {
      const val = parseFloat(amount) || 0;
      document.querySelectorAll('.debt-preset-btn').forEach(btn => {
        const btnAmt = parseFloat(btn.dataset.amount);
        btn.classList.toggle('active', btnAmt === val);
      });
    }

    function setSnowballExtraPreset(amount) {
      const slider = document.getElementById('snowballExtraSlider');
      if (slider) slider.value = amount;
      onSnowballSliderChange(amount);
      syncSnowballPresetButtons(amount);
    }
    window.setSnowballExtraPreset = setSnowballExtraPreset;

    function setDebtStrategy(strat) {
      currentDebtStrategy = strat;
      const btnSnow = document.getElementById('stratPillSnowball');
      const btnAv = document.getElementById('stratPillAvalanche');
      if (btnSnow) btnSnow.classList.toggle('active', strat === 'snowball');
      if (btnAv) btnAv.classList.toggle('active', strat === 'avalanche');

      const titleEl = document.getElementById('debtTableTitle');
      if (titleEl) {
        titleEl.textContent = `Tus Compras en Cuotas y Compromisos (Orden: ${strat === 'snowball' ? 'Bola de Nieve' : 'Menos Intereses'})`;
      }

      updateDebtStrategyExplainerUI(strat);
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

      syncSnowballPresetButtons(extra);
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
        if (targetDateEl) targetDateEl.textContent = '¡Sin deudas activas! 🎉';
        if (speedBadgeEl) {
          speedBadgeEl.textContent = '100% Libre';
          speedBadgeEl.style.background = 'linear-gradient(135deg, #10b981, #059669)';
          speedBadgeEl.style.color = '#ffffff';
        }
        if (speedSubtitleEl) speedSubtitleEl.textContent = 'No tienes compras en cuotas ni préstamos pendientes';
        if (progressBarFillEl) progressBarFillEl.style.width = '100%';
        if (progressTextEl) progressTextEl.textContent = '100% LIBRE';
        if (progressRemEl) progressRemEl.textContent = `${getCurrencySymbol()} 0.00`;
        if (totalMonthlyAttackEl) totalMonthlyAttackEl.textContent = `Total mensual: ${getCurrencySymbol()} 0.00`;
        if (totalInterestSavedEl) totalInterestSavedEl.textContent = `${getCurrencySymbol()} 0 ahorrados`;

        const heroBalanceEl = document.getElementById('debtHeroTotalBalance');
        if (heroBalanceEl) heroBalanceEl.textContent = `${getCurrencySymbol()} 0.00`;
        const heroMonthlyEl = document.getElementById('debtHeroMonthlyPayment');
        if (heroMonthlyEl) heroMonthlyEl.textContent = `${getCurrencySymbol()} 0.00 / mes`;
        const heroMonthsEl = document.getElementById('debtHeroTotalMonths');
        if (heroMonthsEl) heroMonthsEl.textContent = '0 meses';
        const impactAdviceEl = document.getElementById('debtImpactAdviceText');
        if (impactAdviceEl) impactAdviceEl.textContent = 'No tienes compromisos en cuotas activos en este momento.';

        if (tableContainerEl) {
          tableContainerEl.innerHTML = `
            <div class="minimal-empty-state" style="padding: 32px 18px;">
              <div class="minimal-empty-icon-wrap" style="width: 52px; height: 52px; font-size: 24px; margin-bottom: 10px;">🏔️</div>
              <div class="minimal-empty-title" style="font-size: 16px;">¡Estás libre de deudas registradas! 🎉</div>
              <div class="minimal-empty-sub" style="max-width: 440px; margin: 0 auto; line-height: 1.5;">Si tienes compras con tarjeta de crédito en cuotas (Falabella, Ripley, etc.) o préstamos personales, añádelos para proyectar tu fecha de libertad financiera.</div>
              <div style="display: flex; gap: 10px; justify-content: center; margin-top: 14px; flex-wrap: wrap;">
                <button type="button" class="btn btn-primary btn-sm" onclick="openNewDebtPromptModal()" style="font-size: 11.5px; border-radius: 10px; padding: 7px 18px; font-weight: 700;">+ Añadir Cuota o Préstamo</button>
                <button type="button" class="btn btn-outline btn-sm" onclick="syncDebtsFromCuotas()" style="font-size: 11.5px; border-radius: 10px; padding: 7px 18px; font-weight: 700; border-color: var(--border);">🔄 Traer Cuotas de mis Gastos</button>
              </div>
            </div>
          `;
        }
        return;
      }

      currentSnowballDebts.forEach((d, i) => {
        if (!d.id) d.id = 'd_' + i;
        if (d.tea === undefined) d.tea = 0.0;
        const totInst = d.installmentsTotal || 12;
        const minP = parseFloat(d.minPayment) || 60;
        if (!d.initialBalance || d.initialBalance < d.balance) {
          d.initialBalance = roundCurrency(minP * totInst);
        }
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
          const expectedBal = roundCurrency(rem * minP);
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

          // Si TEA es 0 (cuotas sin intereses), no acumular interés; TEA -> TEM efectiva mensual
          if (d.tea > 0.1) {
            const monthlyRate = Math.pow(1 + (d.tea / 100), 1 / 12) - 1;
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
            const monthlyRate = Math.pow(1 + (d.tea / 100), 1 / 12) - 1;
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

      const monthsNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
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
      if (progressRemEl) progressRemEl.textContent = `Resta ${getCurrencySymbol()} ${Math.round(totalCurrent).toLocaleString()}`;
      if (startDateLabelEl) startDateLabelEl.textContent = `Inicio: ${monthsNames[now.getMonth()].slice(0,3)} ${now.getFullYear()}`;
      if (zeroDateLabelEl) zeroDateLabelEl.textContent = `0 Deudas: ${targetDateStr}`;
      
      if (totalInterestSavedEl) {
        totalInterestSavedEl.textContent = extra > 0 
          ? `${getCurrencySymbol()} ${Math.round(totalInterestSaved).toLocaleString('es-PE')} ahorrados`
          : `${getCurrencySymbol()} 0 ahorrados`;
      }

      const heroBalanceEl = document.getElementById('debtHeroTotalBalance');
      if (heroBalanceEl) {
        heroBalanceEl.textContent = `${getCurrencySymbol()} ${totalCurrent.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      const heroMonthlyEl = document.getElementById('debtHeroMonthlyPayment');
      if (heroMonthlyEl) {
        heroMonthlyEl.textContent = `${getCurrencySymbol()} ${(sumMin + extra).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mes`;
      }
      const heroMonthsEl = document.getElementById('debtHeroTotalMonths');
      if (heroMonthsEl) {
        heroMonthsEl.textContent = `${effectiveMonths} mes${effectiveMonths === 1 ? '' : 'es'}`;
      }
      const impactAdviceEl = document.getElementById('debtImpactAdviceText');
      if (impactAdviceEl) {
        if (extra > 0 && totalInterestSaved > 0) {
          impactAdviceEl.innerHTML = `🔥 <strong>¡Gran impacto!</strong> Te liberas <strong>${effectiveBaselineMonths - effectiveMonths} mes${(effectiveBaselineMonths - effectiveMonths) > 1 ? 'es' : ''} antes</strong> y ahorras <strong>${getCurrencySymbol()} ${Math.round(totalInterestSaved).toLocaleString('es-PE')}</strong> en intereses bancarios.`;
        } else if (extra > 0 && effectiveBaselineMonths > effectiveMonths) {
          impactAdviceEl.innerHTML = `🚀 Te liberas <strong>${effectiveBaselineMonths - effectiveMonths} mes${(effectiveBaselineMonths - effectiveMonths) > 1 ? 'es' : ''} antes</strong> gracias a tu abono extra mensual.`;
        } else {
          impactAdviceEl.textContent = `Dinero que dejas de pagar al banco gracias a liquidar tus compras y préstamos en orden estratégico.`;
        }
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
            : `${workingDebts.length} ${workingDebts.length === 1 ? 'compromiso activo' : 'compromisos activos'}`;
        }

        if (displayedDebts.length === 0) {
          tableContainerEl.innerHTML = `
            <div class="minimal-empty-state" style="padding: 24px 16px;">
              <div class="minimal-empty-icon-wrap" style="width: 40px; height: 40px; font-size: 18px; margin-bottom: 8px;">🔍</div>
              <div class="minimal-empty-title">Sin resultados para "${escapeHtml(debtSearchTerm)}"</div>
              <div class="minimal-empty-sub">No se encontraron compras en cuotas que coincidan con la búsqueda.</div>
              <button type="button" class="btn btn-outline btn-sm" onclick="clearDebtSearch()" style="font-size: 11px; border-radius: 9px; padding: 5px 14px; font-weight: 700; border-color: var(--border); margin-top: 8px;">Limpiar Búsqueda</button>
            </div>
          `;
          return;
        }

        // 1. CARDS TÁCTILES PARA MÓVIL (PWA / iPhone)
        let cardsHtml = `<div class="debt-mobile-cards">`;
        displayedDebts.forEach((d, idx) => {
          const isTarget = (idx === 0 && !debtSearchTerm);
          const remInstallments = (typeof d.remainingInstallments === 'number' && d.remainingInstallments > 0)
            ? d.remainingInstallments
            : Math.max(1, Math.ceil(d.balance / d.minPayment));
          let debtMonths = remInstallments;
          if (extra > 0 && isTarget) {
            debtMonths = Math.max(1, Math.min(remInstallments, Math.ceil(d.balance / (d.minPayment + extra))));
          }
          const totInst = d.installmentsTotal || (remInstallments > 6 ? 12 : 6);
          const currInst = Math.min(totInst, Math.max(1, totInst - remInstallments + 1));
          const cardPct = totInst > 0 ? Math.min(100, Math.round(((currInst - 1) / totInst) * 100)) : 0;
          const debtFinalDate = new Date(now.getFullYear(), now.getMonth() + debtMonths, 1);
          const debtFinalStr = `${monthsNames[debtFinalDate.getMonth()].slice(0, 3)} ${debtFinalDate.getFullYear()}`;

          const statusBadge = isTarget
            ? `<span class="badge-status-attack" title="Objetivo prioritario: Recibe todo tu superávit para liquidarse al 100% lo antes posible">⚡ EN ATAQUE AHORA</span>`
            : `<span class="badge-status-pending" title="Pago regular: Cubres su cuota mínima mensual programada mientras la #1 está en ataque">⏳ En espera</span>`;

          cardsHtml += `
            <div class="debt-mobile-card ${isTarget ? 'is-attack' : ''}">
              <div class="debt-card-top">
                <div class="debt-card-identity">
                  <div class="debt-card-squircle">💳</div>
                  <div>
                    <div class="debt-card-name">${idx + 1}. ${escapeHtml(d.name)}</div>
                    <div class="debt-card-installments">Cuota ${currInst} de ${totInst} • <strong style="color: var(--primary);">${remInstallments} ${remInstallments === 1 ? 'pendiente' : 'pendientes'}</strong></div>
                  </div>
                </div>
                ${statusBadge}
              </div>

              <div class="debt-card-progress-track">
                <div class="debt-card-progress-fill" style="width: ${cardPct}%;"></div>
              </div>

              <div class="debt-card-stats-grid">
                <div class="debt-card-stat-item">
                  <span class="debt-card-stat-label">Saldo Pendiente</span>
                  <span class="debt-card-stat-val sensitive-amount" style="color: var(--text-main);">${getCurrencySymbol()} ${d.balance.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div class="debt-card-stat-item">
                  <span class="debt-card-stat-label">Cuota al Mes</span>
                  <span class="debt-card-stat-val sensitive-amount" style="color: var(--primary);">${getCurrencySymbol()} ${d.minPayment.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div class="debt-card-stat-item">
                  <span class="debt-card-stat-label">¿Intereses?</span>
                  <span class="debt-card-stat-val" style="color: ${d.tea > 0 ? '#6366f1' : '#10b981'}; font-size: 12px;">${d.tea > 0 ? d.tea.toFixed(1) + '% TEA' : '0% Sin interés'}</span>
                </div>
                <div class="debt-card-stat-item">
                  <span class="debt-card-stat-label">Terminas de Pagar</span>
                  <span class="debt-card-stat-val" style="font-size: 12px; color: var(--text-main);">🗓️ ${debtFinalStr} (${debtMonths}m)</span>
                </div>
              </div>

              <div class="debt-card-actions">
                <button type="button" class="debt-card-btn" onclick="editSnowballDebtRow(${d.originalIdx})" title="Editar datos o cuotas">
                  ✏️ Editar
                </button>
                <button type="button" class="debt-card-btn danger" onclick="removeSnowballDebtRow(${d.originalIdx})" title="Quitar de este plan">
                  ✕ Quitar
                </button>
              </div>
            </div>
          `;
        });
        cardsHtml += `</div>`;

        // 2. TABLA EJECUTIVA PARA DESKTOP (Mac / Pantallas grandes)
        let tableHtml = `
          <div class="debt-desktop-table-wrap">
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
                  <th style="width: 70px; text-align: center;">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
        `;

        displayedDebts.forEach((d, idx) => {
          const isTarget = (idx === 0 && !debtSearchTerm);
          const remInstallments = (typeof d.remainingInstallments === 'number' && d.remainingInstallments > 0)
            ? d.remainingInstallments
            : Math.max(1, Math.ceil(d.balance / d.minPayment));
          let debtMonths = remInstallments;
          if (extra > 0 && isTarget) {
            debtMonths = Math.max(1, Math.min(remInstallments, Math.ceil(d.balance / (d.minPayment + extra))));
          }
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

        tableHtml += `</tbody></table></div>`;
        tableContainerEl.innerHTML = cardsHtml + tableHtml;
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

    // ================================================================
    // COPILOTO ANTIDEUDAS v77 — Cobertura del mes
    // computeCoverage() es de SOLO LECTURA. Las acciones (posponer / traer /
    // marcar pagado) piden confirmación, registran auditoría y usan
    // aritmética a centavos (roundCurrency).
    // ================================================================
    const RESCUE_FLEX_CATEGORIES = ['Suscripciones', 'Gimnasio & Salud', 'Viajes', 'Ropa', 'Comida fuera', 'Otros'];
    const RESCUE_CREDIT_RE = /pr[eé]stamo|tarjeta|rapicash|diners|interbank|bcp|bbva|cuota|visa|mastercard|cmr|ripley|falabella/i;
    let rescueSelectedIds = new Set();

    function rescueMoney(n) {
      const v = roundCurrency(Math.abs(Number(n) || 0));
      const s = `${getCurrencySymbol()} ${v.toLocaleString(getActiveCurrency().locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      return (Number(n) < 0 ? '−' : '') + s;
    }

    function rescueNextMonthKey(monthKey) {
      const names = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      const [mn, yr] = String(monthKey).split(' ');
      const i = names.indexOf(mn);
      const y = parseInt(yr, 10);
      if (i === -1 || !y) return null;
      return i === 11 ? `${names[0]} ${y + 1}` : `${names[i + 1]} ${y}`;
    }

    function computeCoverage(targetMonth) {
      const month = targetMonth || appState.currentMonth;
      const months = getSortedMonths();
      const idx = months.indexOf(month);
      if (idx === -1) return null;

      // Mismo punto de partida que getAccumulatedBalance (coherencia con "Disponible en banco")
      let startIdx = isAdminCesar() ? months.indexOf('Agosto 2026') : -1;
      if (startIdx === -1) {
        for (let i = 0; i < months.length; i++) {
          const m = months[i];
          const hasTx = appState.transactions && appState.transactions[m] && appState.transactions[m].length > 0;
          const hasInc = appState.incomes && appState.incomes[m] && appState.incomes[m].length > 0;
          if (hasTx || hasInc) { startIdx = i; break; }
        }
      }
      if (startIdx === -1 || startIdx > idx) startIdx = idx;

      const bank = getAccumulatedBalance(month);
      ensureMonthIncomes(month);
      const incs = (appState.incomes && appState.incomes[month]) || [];
      const incomePending = roundCurrency(incs
        .filter(i => (i.status || 'Pendiente') !== 'Recibido')
        .reduce((s, i) => roundCurrency(s + (Number(i.amount) || 0)), 0));

      const isPending = t => (t.status || 'Pagado') === 'Pendiente';
      const thisPending = ((appState.transactions && appState.transactions[month]) || [])
        .filter(isPending).map(t => ({ ...t, month }));
      const carry = [];
      for (let i = startIdx; i < idx; i++) {
        const m = months[i];
        ((appState.transactions && appState.transactions[m]) || [])
          .filter(isPending).forEach(t => carry.push({ ...t, month: m }));
      }
      const sum = arr => arr.reduce((s, t) => roundCurrency(s + (Number(t.amount) || 0)), 0);
      const thisPendingTotal = sum(thisPending);
      const carryTotal = sum(carry);
      const projected = roundCurrency(bank + incomePending - thisPendingTotal - carryTotal);
      const income = getMonthTotalIncome(month);

      const calIdx = months.indexOf(getCurrentCalendarMonthName());
      const isPast = calIdx !== -1 && idx < calIdx;
      let state = 'ok';
      if (projected < 0) state = 'deficit';
      else if (income > 0 && projected < income * 0.05) state = 'tight';

      return {
        month, bank, incomePending, thisPending, thisPendingTotal, carry, carryTotal,
        projected, income, state, isPast,
        deficit: projected < 0 ? roundCurrency(-projected) : 0,
        nextMonth: rescueNextMonthKey(month)
      };
    }

    function rescuePriority(t) {
      if (t.isInstallment || t.category === 'Tarjetas' || RESCUE_CREDIT_RE.test(t.name || '')) return 1;
      if (RESCUE_FLEX_CATEGORIES.includes(t.category)) return 3;
      return 2;
    }

    function renderRescueCard() {
      const el = document.getElementById('rescueCoverageCard');
      if (!el) return;
      const cov = computeCoverage();
      if (!cov || cov.isPast) { el.innerHTML = ''; return; }

      const stateMeta = {
        deficit: { cls: 'is-deficit', pill: 'Déficit', sub: `Te faltan ${rescueMoney(cov.deficit)} para cubrir tus compromisos. Puedes posponer gastos flexibles, sumar un ingreso extra o renegociar cuotas.` },
        tight:   { cls: 'is-tight',   pill: 'Ajustado', sub: 'Cubres tus compromisos, pero casi sin colchón.' },
        ok:      { cls: 'is-ok',      pill: 'Cubierto', sub: 'Tus ingresos cubren todo lo pendiente.' }
      }[cov.state];

      const rows = [
        ['Disponible en banco', rescueMoney(cov.bank)],
        ['+ Por recibir este mes', rescueMoney(cov.incomePending)],
        ['− Por pagar este mes', rescueMoney(cov.thisPendingTotal)],
        ...(cov.carryTotal > 0 ? [['− Arrastre de meses anteriores', rescueMoney(cov.carryTotal)]] : [])
      ].map(([l, v]) => `<div class="rescue-row"><span>${l}</span><b>${v}</b></div>`).join('');

      // 1) Posponer (solo con déficit): gastos flexibles, no-cuotas, pendientes de este mes
      let postponeHtml = '';
      const flex = cov.thisPending.filter(t => !t.isInstallment && RESCUE_FLEX_CATEGORIES.includes(t.category));
      rescueSelectedIds = new Set([...rescueSelectedIds].filter(id => flex.some(t => t.id === id)));
      if (cov.state === 'deficit' && flex.length > 0 && cov.nextMonth) {
        postponeHtml = `
          <details class="rescue-sec" open>
            <summary>Qué puedes posponer <small>${flex.length}</small></summary>
            <div class="rescue-sec-body">
              ${flex.map(t => `
                <label class="rescue-item">
                  <input type="checkbox" data-id="${escapeHtml(t.id)}" ${rescueSelectedIds.has(t.id) ? 'checked' : ''} onchange="rescueToggle(this)">
                  <span class="rescue-item-name">${escapeHtml(t.name)}<small>${escapeHtml(t.category)}</small></span>
                  <b>${rescueMoney(t.amount)}</b>
                </label>`).join('')}
              <div class="rescue-live" id="rescueLiveText"></div>
              <button type="button" class="rescue-btn" id="rescuePostponeBtn" onclick="rescuePostponeSelected()">Mover a ${escapeHtml(cov.nextMonth)}</button>
            </div>
          </details>`;
      }

      // 2) Orden de pago (deficit o ajustado)
      let orderHtml = '';
      const all = [...cov.carry, ...cov.thisPending];
      if (cov.state !== 'ok' && all.length > 0) {
        const groups = {
          1: { title: 'Primero · protege tu historial', hint: 'Tarjetas, préstamos y cuotas', items: [] },
          2: { title: 'Después · esenciales', hint: 'Vivienda, servicios, familia', items: [] },
          3: { title: 'Último · postergable', hint: 'Lo primero que conviene negociar', items: [] }
        };
        all.forEach(t => groups[rescuePriority(t)].items.push(t));
        const due = t => parseInt(getEffectiveDueDate(t), 10) || 99;
        orderHtml = `
          <details class="rescue-sec">
            <summary>Orden de pago sugerido</summary>
            <div class="rescue-sec-body">
              ${[1, 2, 3].filter(k => groups[k].items.length).map(k => {
                const g = groups[k];
                const items = g.items.sort((a, b) => due(a) - due(b));
                const total = items.reduce((s, t) => roundCurrency(s + (Number(t.amount) || 0)), 0);
                return `
                  <div class="rescue-group g${k}">
                    <div class="rescue-group-head"><span>${g.title}</span><b>${rescueMoney(total)}</b></div>
                    <div class="rescue-group-hint">${g.hint}</div>
                    ${items.slice(0, 5).map(t => `<div class="rescue-line"><span>${escapeHtml(t.name)}<small>día ${due(t) === 99 ? '—' : due(t)}${t.month !== cov.month ? ' · ' + escapeHtml(t.month.split(' ')[0]) : ''}</small></span><b>${rescueMoney(t.amount)}</b></div>`).join('')}
                    ${items.length > 5 ? `<div class="rescue-more">+${items.length - 5} más</div>` : ''}
                  </div>`;
              }).join('')}
            </div>
          </details>`;
      }

      // 3) Arrastre de meses anteriores
      let carryHtml = '';
      if (cov.carry.length > 0) {
        carryHtml = `
          <details class="rescue-sec" ${cov.state === 'ok' ? '' : 'open'}>
            <summary>Pendiente de meses anteriores <small>${rescueMoney(cov.carryTotal)}</small></summary>
            <div class="rescue-sec-body">
              ${cov.carry.map(t => `
                <div class="rescue-carry">
                  <span class="rescue-item-name">${escapeHtml(t.name)}<small>${escapeHtml(t.month)}</small></span>
                  <b>${rescueMoney(t.amount)}</b>
                  <div class="rescue-carry-actions">
                    <button type="button" data-id="${escapeHtml(t.id)}" data-month="${escapeHtml(t.month)}" onclick="rescueCarryAction(this,'paid')">Ya lo pagué</button>
                    ${t.isInstallment ? '' : `<button type="button" data-id="${escapeHtml(t.id)}" data-month="${escapeHtml(t.month)}" onclick="rescueCarryAction(this,'bring')">Traer a este mes</button>`}
                  </div>
                </div>`).join('')}
            </div>
          </details>`;
      }

      // 4) Alternativas tácticas si la poda no alcanza para salir del déficit
      let contingencyHtml = '';
      if (cov.state === 'deficit') {
        const debts = currentSnowballDebts || [];
        const totalDebtPayments = debts.reduce((s, d) => s + (parseFloat(d.minPayment) || 0), 0);
        const totalIncome = getMonthTotalIncome();
        const debtRatio = totalIncome > 0 ? Math.round((totalDebtPayments / totalIncome) * 100) : 0;
        const estConsolidationPayment = Math.round(totalDebtPayments * 0.45);
        const estCashflowRelief = Math.max(0, totalDebtPayments - estConsolidationPayment);

        contingencyHtml = `
          <details class="rescue-sec">
            <summary>Alternativas tácticas si la poda no alcanza <small>4 opciones</small></summary>
            <div class="rescue-sec-body">
              <div class="rescue-contingency-card">
                <div class="rescue-contingency-title">🛡️ 1. Pago Mínimo Táctico (SBS Cero Mora)</div>
                <p class="rescue-contingency-text">Si este mes el total facturado asfixia tu liquidez, cubre únicamente el pago mínimo exigible en tarjetas/cuotas antes del vencimiento. Mantienes tu historial intacto ante Infocorp y proteges el dinero para techo y alimentación.</p>
              </div>
              <div class="rescue-contingency-card">
                <div class="rescue-contingency-title">🔄 2. Consolidación / Compra de Deuda</div>
                <p class="rescue-contingency-text">Tus cuotas absorben el ${debtRatio}% de tus ingresos (${rescueMoney(totalDebtPayments)}/mes). Consolidar en un solo crédito a tasa preferencial (14% - 16% TEA) bajaría tu cuota mensual a aprox. ${rescueMoney(estConsolidationPayment)}, liberando más de ${rescueMoney(estCashflowRelief)}/mes de flujo libre permanente.</p>
              </div>
              <div class="rescue-contingency-card">
                <div class="rescue-contingency-title">⏳ 3. Reprogramación Preventiva / Cuota Comodín</div>
                <p class="rescue-contingency-text">Contacta a tu banco antes de la fecha de corte. Las entidades permiten mover una cuota al final del cronograma o solicitar reprogramación preventiva sin manchar tu historial crediticio.</p>
              </div>
              <div class="rescue-contingency-card">
                <div class="rescue-contingency-title">📋 4. Cascada de Prioridad Innegociable</div>
                <p class="rescue-contingency-text">1) Vivienda y alimentación (innegociable) · 2) Servicios esenciales para trabajar (luz, internet) · 3) Obligaciones bancarias · 4) Préstamos con terceros o familiares (solicitar prórroga con fecha acordada).</p>
              </div>
            </div>
          </details>`;
      }

      el.innerHTML = `
        <div class="card rescue-card ${stateMeta.cls}">
          <div class="rescue-head">
            <div>
              <div class="rescue-eyebrow">Cierre proyectado · ${escapeHtml(cov.month)}</div>
              <div class="rescue-amount">${rescueMoney(cov.projected)}</div>
            </div>
            <span class="rescue-pill">${stateMeta.pill}</span>
          </div>
          <p class="rescue-sub">${stateMeta.sub}</p>
          <div class="rescue-rows">${rows}</div>
          ${postponeHtml}${orderHtml}${carryHtml}${contingencyHtml}
        </div>`;
      rescueUpdateLive();
    }
    window.renderRescueCard = renderRescueCard;

    function renderRescueDashBanner() {
      const el = document.getElementById('rescueDashBanner');
      if (!el) return;
      const cov = computeCoverage();
      if (!cov || cov.isPast || cov.deficit <= 0) {
        el.style.display = 'none';
        el.innerHTML = '';
        return;
      }
      el.style.display = 'flex';
      const isPriv = typeof isPrivacyModeActive === 'function' && isPrivacyModeActive();
      const sym = (typeof getCurrencySymbol === 'function') ? getCurrencySymbol() : 'S/';
      const projText = isPriv ? `-${sym} •••••` : rescueMoney(cov.projected);
      el.innerHTML = `<span>Cierre proyectado <b class="rescue-banner-amount">${projText}</b></span><span class="rescue-banner-cta">Ver plan ›</span>`;
    }
    window.renderRescueDashBanner = renderRescueDashBanner;

    function rescueToggle(cb) {
      const id = cb.dataset.id;
      if (cb.checked) rescueSelectedIds.add(id); else rescueSelectedIds.delete(id);
      rescueUpdateLive();
    }
    window.rescueToggle = rescueToggle;

    function rescueUpdateLive() {
      const live = document.getElementById('rescueLiveText');
      const btn = document.getElementById('rescuePostponeBtn');
      if (!live || !btn) return;
      const cov = computeCoverage();
      if (!cov) return;
      const freed = cov.thisPending
        .filter(t => rescueSelectedIds.has(t.id))
        .reduce((s, t) => roundCurrency(s + (Number(t.amount) || 0)), 0);
      const remaining = roundCurrency(Math.max(0, cov.deficit - freed));
      live.textContent = freed > 0
        ? (remaining > 0 ? `Liberas ${rescueMoney(freed)} · aún faltan ${rescueMoney(remaining)}` : `Liberas ${rescueMoney(freed)} · tu mes queda cubierto`)
        : 'Marca lo que puedas pasar al próximo mes';
      btn.disabled = freed <= 0;
    }

    async function rescuePostponeSelected() {
      const cov = computeCoverage();
      if (!cov || !cov.nextMonth) return;
      const items = cov.thisPending.filter(t => rescueSelectedIds.has(t.id) && !t.isInstallment);
      if (items.length === 0) return;
      const total = items.reduce((s, t) => roundCurrency(s + (Number(t.amount) || 0)), 0);
      const ok = await uiConfirm(`¿Mover ${items.length} gasto(s) por ${rescueMoney(total)} de ${cov.month} a ${cov.nextMonth}? Saldrán de este mes y quedarán pendientes en el siguiente.`);
      if (!ok) return;

      const ids = new Set(items.map(t => t.id));
      const source = appState.transactions[cov.month] || [];
      const moved = source.filter(t => ids.has(t.id)).map(t => ({
        ...t,
        id: cov.nextMonth + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        name: /\(pospuesto\)$/.test(t.name) ? t.name : `${t.name} (pospuesto)`,
        status: 'Pendiente'
      }));
      if (moved.length !== items.length) { showToast('No se pudo completar: los datos cambiaron. Intenta de nuevo.', 'error'); return; }

      appState.transactions[cov.nextMonth] = (appState.transactions[cov.nextMonth] || []).concat(moved);
      appState.transactions[cov.month] = source.filter(t => !ids.has(t.id));
      addAuditLog('⏭️ Gastos pospuestos', `${moved.map(t => t.name).join(', ')} (${rescueMoney(total)}) movidos de ${cov.month} a ${cov.nextMonth}.`);
      rescueSelectedIds.clear();
      saveState();
      renderAll();
      showToast(`✅ ${moved.length} gasto(s) movidos a ${cov.nextMonth}`, 'success');
    }
    window.rescuePostponeSelected = rescuePostponeSelected;

    async function rescueCarryAction(btn, action) {
      const id = btn.dataset.id;
      const from = btn.dataset.month;
      const cur = appState.currentMonth;
      const list = (appState.transactions && appState.transactions[from]) || [];
      const tx = list.find(t => t.id === id);
      if (!tx || (tx.status || 'Pagado') !== 'Pendiente') { renderAll(); return; }
      const amt = rescueMoney(tx.amount);

      if (action === 'paid') {
        const ok = await uiConfirm(`¿Ya pagaste "${tx.name}" (${amt}) de ${from}? Se marcará como pagado y restará ${amt} de tu saldo disponible.`);
        if (!ok) return;
        tx.status = 'Pagado';
        addAuditLog('✅ Arrastre regularizado', `'${tx.name}' (${amt}) de ${from} marcado como pagado.`);
      } else {
        if (tx.isInstallment) { showToast('Las cuotas no se mueven: márcala como pagada.', 'info'); return; }
        const ok = await uiConfirm(`¿Traer "${tx.name}" (${amt}) de ${from} a ${cur}? Quedará pendiente en este mes.`);
        if (!ok) return;
        const copy = {
          ...tx,
          id: cur + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          name: /\(arrastre\)$/.test(tx.name) ? tx.name : `${tx.name} (arrastre)`,
          status: 'Pendiente'
        };
        appState.transactions[cur] = (appState.transactions[cur] || []).concat([copy]);
        appState.transactions[from] = list.filter(t => t.id !== id);
        addAuditLog('↪️ Arrastre traído', `'${tx.name}' (${amt}) movido de ${from} a ${cur}.`);
      }
      saveState();
      renderAll();
    }
    window.rescueCarryAction = rescueCarryAction;

    function renderExecutiveAdvisor() {
      const container = document.getElementById('executiveTipsGrid');
      const autoDiagEl = document.getElementById('autoDiagnosisText');
      renderRescueCard();
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

      // Si existe autoDiagEl en DOM previo, vaciarlo para evitar textos duplicados
      if (autoDiagEl) {
        autoDiagEl.innerHTML = '';
        if (autoDiagEl.parentElement) autoDiagEl.parentElement.style.display = 'none';
      }

      // Identificar deudas tácticas
      const quickestDebt = [...debts].filter(d => d.balance > 0).sort((a, b) => a.balance - b.balance)[0];
      const highestTeaDebt = [...debts].filter(d => d.balance > 0).sort((a, b) => (b.tea || 0) - (a.tea || 0))[0];

      // GASTOS FIJOS DE VIDA (No deudas)
      const fixedLivingTxs = txs.filter(t => ['Casa', 'Comida casa', 'Comida gatitos casa', 'Arena gatitos casa', 'Servicios', 'Internet', 'Celulares', 'Mapfre', 'Papá'].includes(t.category));
      const fixedLivingTotal = fixedLivingTxs.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);

      const cards = [
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

    function syncDebtsFromCuotas(silent = false) {
      const txs = getMonthTxList();

      const candidates = txs.filter(t => {
        // REGLA ESTRICTA DE ORO: Solo compras marcadas EXPLÍCITAMENTE en cuotas (isInstallment: true)
        return t.isInstallment === true;
      });

      if (candidates.length === 0) {
        if (!silent) showToast('No se encontraron compras en cuotas activas este mes', 'info');
        return;
      }

      const freshDebts = [];
      candidates.forEach((c, idx) => {
        const metrics = extractDebtMetricsFromTx(c);
        if (metrics.remaining <= 0) return; // Si ya fue pagada la última cuota, no está pendiente

        freshDebts.push({
          id: 'd_sync_' + idx + '_' + Math.random().toString(36).substr(2, 4),
          name: c.name,
          balance: metrics.balance,
          minPayment: metrics.minPayment,
          tea: metrics.tea,
          initialBalance: metrics.initialBalance,
          remainingInstallments: metrics.remaining,
          installmentsTotal: metrics.total,
          installmentsCurrent: metrics.current
        });
      });

      currentSnowballDebts = freshDebts;
      saveDebtSnowballPlanQuiet();
      calculateAndRenderDebtPlan(currentDebtExtraPayment);
      renderExecutiveAdvisor();
      if (!silent) showToast(`🔄 Se sincronizaron ${freshDebts.length} compromisos en cuotas activos con éxito`, 'success');
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
      const uKey = currentUser ? currentUser.id : 'guest';
      appState.debtSnowball = {
        debts: currentSnowballDebts,
        extraPayment: currentDebtExtraPayment,
        strategy: currentDebtStrategy,
        updatedAt: new Date().toISOString()
      };
      try {
        localStorage.setItem('aliviafin_debt_snowball_' + uKey, JSON.stringify(appState.debtSnowball));
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
        uiAlert('No hay gastos registrados en este mes para exportar.');
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
window.handleQuickKeypad = handleQuickKeypad;
window.handleQuickAmountInput = handleQuickAmountInput;
window.focusQuickAmountInput = focusQuickAmountInput;
window.openDailyLimitModal = openDailyLimitModal;
window.closeDailyLimitModal = closeDailyLimitModal;
window.setBudgetCycle = setBudgetCycle;
window.setUpcomingViewMode = setUpcomingViewMode;
window.selectUpcomingCalendarDay = selectUpcomingCalendarDay;
window.calculateSafeDailySpend = calculateSafeDailySpend;
window.handleSmartQuickInputChange = handleSmartQuickInputChange;
window.handleSmartQuickInputEnter = handleSmartQuickInputEnter;
window.toggleVoiceDictation = toggleVoiceDictation;
window.parseSmartQuickExpenseText = parseSmartQuickExpenseText;
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
window.confirmDismissWizard = confirmDismissWizard;
window.downloadExpenseTemplateExcel = downloadExpenseTemplateExcel;
window.triggerImportExpensesExcel = triggerImportExpensesExcel;
window.handleImportExpensesExcel = handleImportExpensesExcel;
window.downloadExpenseTemplateCSV = downloadExpenseTemplateCSV;
window.triggerImportExpensesCSV = triggerImportExpensesCSV;
window.handleImportExpensesCSV = handleImportExpensesCSV;
window.updateWizardExpenseCount = updateWizardExpenseCount;
window.addWizardExpenseRow = addWizardExpenseRow;
window.openEditSalaryModal = openEditSalaryModal;
window.handleSaveSalary = handleSaveSalary;
window.openSecurityModal = openSecurityModal;
window.toggleTravelMode = toggleTravelMode;
window.syncTravelModeUI = syncTravelModeUI;
window.renderLoansDashboard = renderLoansDashboard;
window.renderLoansHomeWidget = renderLoansHomeWidget;
window.setLoansFilter = setLoansFilter;
window.openNewLoanModal = openNewLoanModal;
window.setLoanType = setLoanType;
window.handleSaveLoanSubmit = handleSaveLoanSubmit;
window.markLoanSettled = markLoanSettled;
window.reopenLoan = reopenLoan;
window.deleteLoan = deleteLoan;
window.sendLoanWhatsAppReminder = sendLoanWhatsAppReminder;
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
  try {
    const curM = appState.currentMonth || (typeof getCurrentCalendarMonthName === 'function' ? getCurrentCalendarMonthName() : 'Mes Actual');
    const sym = typeof getCurrencySymbol === 'function' ? getCurrencySymbol() : 'S/';

    const element = document.createElement('div');
    element.id = 'aliviafinPdfReportContainer';
    element.style.position = 'fixed';
    element.style.left = '-9999px';
    element.style.top = '0';
    element.style.width = '794px';
    element.style.padding = '36px 40px';
    element.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    element.style.color = '#0f172a';
    element.style.background = '#ffffff';
    element.style.zIndex = '-99999';

    // Header
    let html = `
      <div style="border-bottom: 2px solid #0d9488; padding-bottom: 18px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 26px;">🌿</span>
            <h1 style="margin: 0; color: #0d9488; font-size: 26px; font-weight: 800; letter-spacing: -0.02em;">aliviafin</h1>
          </div>
          <p style="margin: 4px 0 0; color: #64748b; font-size: 13px; font-weight: 600;">Reporte Financiero Ejecutivo Mensual</p>
        </div>
        <div style="text-align: right;">
          <h2 style="margin: 0; color: #0f172a; font-size: 19px; font-weight: 800;">${curM}</h2>
          <p style="margin: 4px 0 0; color: #64748b; font-size: 11px;">Generado el ${new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
        </div>
      </div>
    `;

    // Stats
    const txs = (appState.transactions && appState.transactions[curM]) || [];
    const sueldo = roundCurrency(Number((typeof getMonthTotalIncome === 'function' ? getMonthTotalIncome(curM) : 0) || 0));
    const gastos = roundCurrency(txs.filter(t => (t.status || 'Pagado') === 'Pagado').reduce((a, b) => roundCurrency(a + Number(b.amount || 0)), 0));
    const saldo = roundCurrency(Number((typeof getAccumulatedBalance === 'function' ? getAccumulatedBalance(curM) : 0) || 0));

    html += `
      <div style="display: flex; gap: 14px; margin-bottom: 26px;">
        <div style="flex: 1; padding: 14px 16px; background: #f0fdf4; border-radius: 14px; border: 1.5px solid #bbf7d0;">
          <p style="margin: 0 0 4px; font-size: 11px; font-weight: 800; color: #15803d; text-transform: uppercase; letter-spacing: 0.05em;">Ingresos Totales</p>
          <p style="margin: 0; font-size: 22px; font-weight: 800; color: #166534;">${sym} ${sueldo.toFixed(2)}</p>
        </div>
        <div style="flex: 1; padding: 14px 16px; background: #fef2f2; border-radius: 14px; border: 1.5px solid #fecaca;">
          <p style="margin: 0 0 4px; font-size: 11px; font-weight: 800; color: #b91c1c; text-transform: uppercase; letter-spacing: 0.05em;">Gastos Pagados</p>
          <p style="margin: 0; font-size: 22px; font-weight: 800; color: #991b1b;">${sym} ${gastos.toFixed(2)}</p>
        </div>
        <div style="flex: 1; padding: 14px 16px; background: #f8fafc; border-radius: 14px; border: 1.5px solid #cbd5e1;">
          <p style="margin: 0 0 4px; font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.05em;">Saldo Disponible</p>
          <p style="margin: 0; font-size: 22px; font-weight: 800; color: ${saldo >= 0 ? '#0d9488' : '#dc2626'};">${sym} ${saldo.toFixed(2)}</p>
        </div>
      </div>
    `;

    // Gráfico de distribución si está en pantalla
    const chartCanvas = document.getElementById('desktopCategoryChart') || document.getElementById('categoryChart');
    if (chartCanvas && typeof chartCanvas.toDataURL === 'function') {
      try {
        const chartImg = chartCanvas.toDataURL('image/png');
        if (chartImg && chartImg.length > 200) {
          html += `
            <div style="text-align: center; margin-bottom: 24px; background: #f8fafc; padding: 16px; border-radius: 14px; border: 1px solid #e2e8f0;">
              <h3 style="margin: 0 0 10px; color: #0f172a; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Distribución por Categorías</h3>
              <img src="${chartImg}" style="max-width: 240px; height: auto; margin: 0 auto; display: block;" />
            </div>
          `;
        }
      } catch (e) {
        console.warn("No se pudo capturar gráfico:", e);
      }
    }

    // Listado de Gastos
    const getDueSafe = (item) => {
      try {
        if (typeof getEffectiveDueDate === 'function') {
          return parseInt(getEffectiveDueDate(item), 10) || 15;
        }
        return parseInt(item.dueDate || 15, 10);
      } catch (e) {
        return 15;
      }
    };

    if (txs.length > 0) {
      const pagadas = txs.filter(t => (t.status || 'Pagado') === 'Pagado').sort((a, b) => getDueSafe(a) - getDueSafe(b));
      const pendientes = txs.filter(t => (t.status || 'Pagado') === 'Pendiente').sort((a, b) => getDueSafe(a) - getDueSafe(b));

      const renderTable = (list, title, color) => {
        if (!list || list.length === 0) return '';
        let tHtml = `<h3 style="margin: 18px 0 8px; color: ${color}; font-size: 14px; font-weight: 800; border-bottom: 2px solid ${color}; padding-bottom: 4px;">${title} (${list.length})</h3>`;
        tHtml += `<table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 12px;">`;
        tHtml += `
          <thead>
            <tr style="background: #f1f5f9; text-align: left;">
              <th style="padding: 6px 8px; border-bottom: 2px solid #cbd5e1; width: 50px;">Día</th>
              <th style="padding: 6px 8px; border-bottom: 2px solid #cbd5e1;">Categoría</th>
              <th style="padding: 6px 8px; border-bottom: 2px solid #cbd5e1;">Descripción</th>
              <th style="padding: 6px 8px; border-bottom: 2px solid #cbd5e1; text-align: right;">Monto</th>
            </tr>
          </thead>
          <tbody>
        `;
        list.forEach((t, i) => {
          const bg = i % 2 !== 0 ? '#f8fafc' : '#ffffff';
          const amt = Number(t.amount || 0).toFixed(2);
          tHtml += `
            <tr style="background: ${bg};">
              <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-weight: 700;">${getDueSafe(t)}</td>
              <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0;"><span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10.5px;">${escapeHtml(t.category || 'Varios')}</span></td>
              <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${escapeHtml(t.name || 'Gasto')}</td>
              <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 800;">${sym} ${amt}</td>
            </tr>
          `;
        });
        tHtml += `</tbody></table>`;
        return tHtml;
      };

      html += renderTable(pagadas, '✅ Gastos Pagados', '#10b981');
      html += renderTable(pendientes, '⏳ Gastos Pendientes', '#f59e0b');
    } else {
      html += `<p style="color: #64748b; font-size: 13px; font-style: italic; margin: 20px 0;">No hay gastos registrados en este mes.</p>`;
    }

    html += `
      <div style="margin-top: 32px; padding-top: 14px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 10.5px;">
        Reporte confidencial generado por AliviaFin App · Paz mental para tu dinero.<br>
        © ${new Date().getFullYear()} AliviaFin · aliviafin.com
      </div>
    `;

    element.innerHTML = html;
    document.body.appendChild(element);

    const cleanup = () => {
      const el = document.getElementById('aliviafinPdfReportContainer');
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    };

    const opt = {
      margin:       8,
      filename:     `AliviaFin_Reporte_${curM.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const renderPdfNow = async () => {
      try {
        if (typeof showToast === 'function') showToast('📄 Generando reporte PDF...', 'info');
        
        const worker = html2pdf().set(opt).from(element);
        const pdfBlob = await worker.outputPdf('blob');
        cleanup();

        const fileName = `AliviaFin_Reporte_${curM.replace(/\s+/g, '_')}.pdf`;
        const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

        // En iOS Safari / PWA: usar Web Share API nativo si está disponible
        if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
          try {
            await navigator.share({
              title: `AliviaFin — Reporte ${curM}`,
              text: `Reporte financiero de ${curM}`,
              files: [pdfFile]
            });
            if (typeof showToast === 'function') showToast('✅ Reporte PDF listo', 'success');
            return;
          } catch (shareErr) {
            if (shareErr.name === 'AbortError') return;
            console.warn('Share falló, usando descarga estándar:', shareErr);
          }
        }

        // Descarga por enlace Blob universal
        const blobUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          if (link.parentNode) link.parentNode.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 5000);
        if (typeof showToast === 'function') showToast('✅ ¡PDF descargado exitosamente!', 'success');
      } catch (err) {
        cleanup();
        console.error('Error al generar PDF:', err);
        if (typeof showToast === 'function') showToast('Error al generar el PDF. Inténtalo de nuevo.', 'error');
      }
    };

    if (typeof html2pdf === 'undefined') {
      if (typeof showToast === 'function') showToast('Iniciando generador PDF...', 'info');
      const script = document.createElement('script');
      script.src = 'js/html2pdf.bundle.min.js?v=78.4';
      script.onload = renderPdfNow;
      script.onerror = () => {
        const fb = document.createElement('script');
        fb.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        fb.onload = renderPdfNow;
        fb.onerror = () => {
          cleanup();
          if (typeof showToast === 'function') showToast('Error de red al cargar el generador PDF.', 'error');
        };
        document.head.appendChild(fb);
      };
      document.head.appendChild(script);
    } else {
      renderPdfNow();
    }
  } catch (outerErr) {
    console.error('Fallo en generatePDFReport:', outerErr);
    if (typeof showToast === 'function') showToast('Error inesperado al preparar el reporte PDF.', 'error');
  }
};
window.exportMonthlyReportPDF = function(event) {
  if (event && event.stopPropagation) event.stopPropagation();
  window.generatePDFReport();
};

// Multi-Moneda Window Exports
window.SUPPORTED_CURRENCIES = SUPPORTED_CURRENCIES;
window.getActiveCurrency = getActiveCurrency;
window.getCurrencySymbol = getCurrencySymbol;
window.getCurrencyCode = getCurrencyCode;
window.changeCurrency = changeCurrency;
window.updateCurrencyDOMElements = updateCurrencyDOMElements;
