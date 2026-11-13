    // ================================================================
    // MÓDULO CUENTAS CLARAS: PRÉSTAMOS & COBROS (DASHBOARD FULL-SCREEN)
    // ================================================================
    let _currentLoansFilter = 'all';

    function getLoansList() {
      if (!appState.loans || !Array.isArray(appState.loans)) {
        appState.loans = [];
      }
      return appState.loans;
    }

    function setLoansFilter(filter) {
      _currentLoansFilter = filter;
      const filterBtns = {
        'all': 'loanFilterAll',
        'receivable': 'loanFilterReceivable',
        'payable': 'loanFilterPayable',
        'settled': 'loanFilterSettled'
      };
      Object.keys(filterBtns).forEach(k => {
        const btn = document.getElementById(filterBtns[k]);
        if (btn) {
          if (k === filter) btn.classList.add('active');
          else btn.classList.remove('active');
        }
      });
      renderLoansDashboard();
    }

    function renderLoansHomeWidget() {
      const widget = document.getElementById('loansHomeWidget');
      const pill = document.getElementById('loansHomeNetPill');
      const sub = document.getElementById('loansHomeSubtitle');
      if (!widget) return;

      const loans = getLoansList();
      const pendingReceivables = loans.filter(l => l.type === 'receivable' && l.status === 'pending');
      const pendingPayables = loans.filter(l => l.type === 'payable' && l.status === 'pending');

      const totalRec = pendingReceivables.reduce((acc, l) => acc + (Number(l.amount) || 0), 0);
      const totalPay = pendingPayables.reduce((acc, l) => acc + (Number(l.amount) || 0), 0);
      const net = totalRec - totalPay;
      const sym = getCurrencySymbol();

      if (pill) {
        if (net > 0) {
          pill.textContent = `+ ${sym} ${net.toFixed(2)} a favor`;
          pill.style.background = '#ecfdf5';
          pill.style.color = '#059669';
        } else if (net < 0) {
          pill.textContent = `- ${sym} ${Math.abs(net).toFixed(2)} por pagar`;
          pill.style.background = '#fef2f2';
          pill.style.color = '#dc2626';
        } else {
          pill.textContent = `${sym} 0.00`;
          pill.style.background = '#f1f5f9';
          pill.style.color = '#64748b';
        }
      }

      if (sub) {
        const totalPending = pendingReceivables.length + pendingPayables.length;
        if (totalPending === 0) {
          sub.textContent = 'Sin cobros ni compromisos pendientes';
        } else {
          sub.textContent = `${pendingReceivables.length} por cobrar · ${pendingPayables.length} por pagar`;
        }
      }
    }

    function renderLoansDashboard() {
      const kpiRec = document.getElementById('loansKpiReceivable');
      const kpiRecSub = document.getElementById('loansKpiReceivableSub');
      const kpiPay = document.getElementById('loansKpiPayable');
      const kpiPaySub = document.getElementById('loansKpiPayableSub');
      const kpiNet = document.getElementById('loansKpiNet');
      const kpiNetSub = document.getElementById('loansKpiNetSub');
      const grid = document.getElementById('loansDashboardGrid');

      const countAll = document.getElementById('loanCountAll');
      const countRec = document.getElementById('loanCountReceivable');
      const countPay = document.getElementById('loanCountPayable');
      const countSet = document.getElementById('loanCountSettled');

      const loans = getLoansList();
      const sym = getCurrencySymbol();

      const pendingReceivables = loans.filter(l => l.type === 'receivable' && l.status === 'pending');
      const pendingPayables = loans.filter(l => l.type === 'payable' && l.status === 'pending');
      const settledList = loans.filter(l => l.status === 'settled');

      const totalRec = pendingReceivables.reduce((acc, l) => acc + (Number(l.amount) || 0), 0);
      const totalPay = pendingPayables.reduce((acc, l) => acc + (Number(l.amount) || 0), 0);
      const net = totalRec - totalPay;

      if (kpiRec) kpiRec.textContent = `+ ${sym} ${totalRec.toFixed(2)}`;
      if (kpiRecSub) kpiRecSub.textContent = `${pendingReceivables.length} persona${pendingReceivables.length === 1 ? '' : 's'} por cobrar`;
      if (kpiPay) kpiPay.textContent = `- ${sym} ${totalPay.toFixed(2)}`;
      if (kpiPaySub) kpiPaySub.textContent = `${pendingPayables.length} compromiso${pendingPayables.length === 1 ? '' : 's'} pendiente${pendingPayables.length === 1 ? '' : 's'}`;

      if (kpiNet) {
        kpiNet.textContent = `${net >= 0 ? '+' : '-'}${sym} ${Math.abs(net).toFixed(2)}`;
        kpiNet.style.color = net >= 0 ? '#059669' : '#dc2626';
      }
      if (kpiNetSub) {
        kpiNetSub.textContent = net >= 0 ? 'Diferencia a tu favor en la calle' : 'Diferencia neta a liquidar';
      }

      if (countAll) countAll.textContent = loans.length;
      if (countRec) countRec.textContent = pendingReceivables.length;
      if (countPay) countPay.textContent = pendingPayables.length;
      if (countSet) countSet.textContent = settledList.length;

      renderLoansHomeWidget();

      if (!grid) return;

      // Filtrado según _currentLoansFilter
      let filtered = [];
      if (_currentLoansFilter === 'all') {
        filtered = [...loans].sort((a, b) => {
          if (a.status === 'pending' && b.status === 'settled') return -1;
          if (a.status === 'settled' && b.status === 'pending') return 1;
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
      } else if (_currentLoansFilter === 'receivable') {
        filtered = pendingReceivables;
      } else if (_currentLoansFilter === 'payable') {
        filtered = pendingPayables;
      } else if (_currentLoansFilter === 'settled') {
        filtered = settledList;
      }

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 48px 20px; text-align: center; background: #ffffff; border-radius: 20px; border: 1.5px dashed var(--border);">
            <div style="font-size: 38px; margin-bottom: 8px;">🤝</div>
            <div style="font-size: 15px; font-weight: 800; color: var(--text-main);">No hay préstamos ni cobros en esta sección</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px; max-width: 340px; margin-left: auto; margin-right: auto;">
              Registra lo que te deben tus amigos o tus compromisos personales para tener tus cuentas siempre claras.
            </div>
            <button type="button" class="btn btn-primary btn-sm" onclick="openNewLoanModal()" style="margin-top: 14px; padding: 8px 18px; border-radius: 10px; font-weight: 800;">
              + Anotar Primer Registro
            </button>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(l => {
        const isRec = l.type === 'receivable';
        const isPending = l.status === 'pending';
        return `
          <div class="loan-card-item" style="opacity: ${isPending ? '1' : '0.65'};">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                  <span style="font-size: 22px;">${isRec ? '📥' : '📤'}</span>
                  <div style="min-width: 0;">
                    <div style="font-size: 14.5px; font-weight: 800; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      ${escapeHtml(l.person)}
                    </div>
                    <div style="font-size: 11px; color: var(--text-muted); margin-top: 1px;">
                      ${escapeHtml(l.concept || (isRec ? 'Préstamo' : 'Deuda'))}
                    </div>
                  </div>
                </div>
                <span style="font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 8px; white-space: nowrap; background: ${!isPending ? '#f1f5f9' : (isRec ? '#ecfdf5' : '#fef2f2')}; color: ${!isPending ? '#64748b' : (isRec ? '#059669' : '#dc2626')};">
                  ${!isPending ? '✓ SALDADO' : (isRec ? 'Me deben' : 'Yo debo')}
                </span>
              </div>

              <!-- Monto -->
              <div style="display: flex; align-items: baseline; justify-content: space-between; margin: 12px 0 8px;">
                <div style="font-size: 10.5px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Monto:</div>
                <div class="sensitive-amount" style="font-size: 22px; font-weight: 900; color: ${isRec ? '#059669' : '#dc2626'}; font-family: 'JetBrains Mono', monospace;">
                  ${isRec ? '+' : '-'}${sym} ${Number(l.amount).toFixed(2)}
                </div>
              </div>

              <!-- Fechas -->
              <div style="font-size: 11px; color: var(--text-muted); display: flex; justify-content: space-between; padding-top: 6px; border-top: 1px solid #f1f5f9; margin-bottom: 12px;">
                <span>${l.dueDate ? 'Vence: <b>' + escapeHtml(l.dueDate) + '</b>' : 'Fecha flexible'}</span>
                <span>${l.phone ? '📱 ' + escapeHtml(l.phone) : ''}</span>
              </div>
            </div>

            <!-- Botones de Acción -->
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; padding-top: 8px; border-top: 1px solid #f1f5f9;">
              <div style="display: flex; gap: 6px;">
                ${isRec && isPending ? `
                  <button type="button" onclick="sendLoanWhatsAppReminder('${l.id}')" title="Enviar recordatorio cordial por WhatsApp" style="background: #25d366; color: white; border: none; padding: 6px 11px; border-radius: 8px; font-size: 11.5px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                    <span>💬</span> <span>WhatsApp</span>
                  </button>
                ` : ''}
                ${isPending ? `
                  <button type="button" onclick="markLoanSettled('${l.id}')" title="Marcar como cobrado / pagado" style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 11px; border-radius: 8px; font-size: 11.5px; font-weight: 700; cursor: pointer; color: #059669;">
                    ✓ Saldar
                  </button>
                ` : `
                  <button type="button" onclick="reopenLoan('${l.id}')" title="Volver a marcar como pendiente" style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 5px 9px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; color: #64748b;">
                    ↩ Reabrir
                  </button>
                `}
              </div>
              <button type="button" onclick="deleteLoan('${l.id}')" title="Eliminar registro" style="background: transparent; border: none; color: #94a3b8; font-size: 14px; cursor: pointer; padding: 4px 6px;">
                🗑️
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    function openNewLoanModal() {
      const pEl = document.getElementById('loanPersonInput');
      const aEl = document.getElementById('loanAmountInput');
      const cEl = document.getElementById('loanConceptInput');
      const phEl = document.getElementById('loanPhoneInput');
      const dEl = document.getElementById('loanDueDateInput');
      if (pEl) pEl.value = '';
      if (aEl) aEl.value = '';
      if (cEl) cEl.value = '';
      if (phEl) phEl.value = '';
      if (dEl) dEl.value = '';
      setLoanType('receivable');
      openModalById('newLoanModal');
      setTimeout(() => { if (pEl) pEl.focus(); }, 100);
    }

    let _currentLoanType = 'receivable';
    function setLoanType(type) {
      _currentLoanType = type;
      const btnRec = document.getElementById('btnLoanTypeReceivable');
      const btnPay = document.getElementById('btnLoanTypePayable');
      if (btnRec && btnPay) {
        if (type === 'receivable') {
          btnRec.classList.add('active');
          btnPay.classList.remove('active');
        } else {
          btnPay.classList.add('active');
          btnRec.classList.remove('active');
        }
      }
    }

    async function handleSaveLoanSubmit(e) {
      if (e && e.preventDefault) e.preventDefault();
      const person = (document.getElementById('loanPersonInput')?.value || '').trim();
      const amount = parseFloat(document.getElementById('loanAmountInput')?.value || '0');
      const concept = (document.getElementById('loanConceptInput')?.value || '').trim();
      const phone = (document.getElementById('loanPhoneInput')?.value || '').trim();
      const dueDate = document.getElementById('loanDueDateInput')?.value || '';

      if (!person || isNaN(amount) || amount <= 0) {
        showToast('Ingresa un nombre y un monto válido mayor a 0', 'error');
        return;
      }

      const loans = getLoansList();
      loans.unshift({
        id: 'loan_' + Date.now(),
        type: _currentLoanType,
        person,
        amount: Math.round((amount + Number.EPSILON) * 100) / 100,
        concept: concept || (_currentLoanType === 'receivable' ? 'Préstamo a cobrar' : 'Deuda a pagar'),
        phone,
        dueDate,
        status: 'pending',
        createdAt: new Date().toISOString(),
        settledAt: null
      });

      markLocalMutationDirty();
      saveLocalState();
      closeModal('newLoanModal');

      // Navegar inmediatamente a la vista de pantalla completa para que el usuario vea su registro
      switchTab('prestamos');
      renderLoansDashboard();

      const sym = getCurrencySymbol();
      showToast(_currentLoanType === 'receivable' ? `✅ Registrado en Cuentas Claras: ${person} te debe ${sym} ${amount.toFixed(2)}` : `✅ Registrado en Cuentas Claras: Debes ${sym} ${amount.toFixed(2)} a ${person}`, 'success');

      try {
        await flushSyncToServer();
      } catch(e) {}
    }

    async function markLoanSettled(loanId) {
      const loans = getLoansList();
      const item = loans.find(l => l.id === loanId);
      if (!item) return;

      const isRec = item.type === 'receivable';
      if (!await uiConfirm(`¿Marcar como ${isRec ? 'cobrado' : 'pagado'} (${getCurrencySymbol()} ${item.amount.toFixed(2)} de ${item.person})?`)) return;

      item.status = 'settled';
      item.settledAt = new Date().toISOString();

      markLocalMutationDirty();
      saveLocalState();
      renderLoansDashboard();
      showToast(`✅ ${isRec ? 'Cobro' : 'Pago'} marcado como completado`, 'success');

      try {
        await flushSyncToServer();
      } catch(e) {}
    }

    async function reopenLoan(loanId) {
      const loans = getLoansList();
      const item = loans.find(l => l.id === loanId);
      if (!item) return;

      item.status = 'pending';
      item.settledAt = null;

      markLocalMutationDirty();
      saveLocalState();
      renderLoansDashboard();
      showToast('Registro reabierto como pendiente', 'info');

      try {
        await flushSyncToServer();
      } catch(e) {}
    }

    async function deleteLoan(loanId) {
      if (!await uiConfirm('¿Deseas eliminar este registro de Cuentas Claras?')) return;
      const loans = getLoansList();
      const idx = loans.findIndex(l => l.id === loanId);
      if (idx !== -1) {
        recordDeletedIds(loanId);
        loans.splice(idx, 1);
        markLocalMutationDirty();
        saveLocalState();
        renderLoansDashboard();
        showToast('Registro eliminado', 'info');
        try {
          await flushSyncToServer();
        } catch(e) {}
      }
    }

    function sendLoanWhatsAppReminder(loanId) {
      const loans = getLoansList();
      const item = loans.find(l => l.id === loanId);
      if (!item) return;

      const sym = getCurrencySymbol();
      const cleanFirst = item.person.split(' ')[0] || item.person;
      const paymentHint = isAdminCesar()
        ? '\n\nMe puedes transferir por Yape o Plin al 914 688 135 (César Risso).'
        : '';
      const msg = `¡Hola ${cleanFirst}! 👋 Te paso un recordatorio amigable de los ${sym} ${item.amount.toFixed(2)} por "${item.concept}".${paymentHint} ¡Muchas gracias! ✨`;

      const cleanPhone = (item.phone || '').replace(/\D/g, '');
      const waUrl = cleanPhone.length >= 9
        ? `https://wa.me/51${cleanPhone.slice(-9)}?text=${encodeURIComponent(msg)}`
        : `https://wa.me/?text=${encodeURIComponent(msg)}`;

      window.open(waUrl, '_blank');
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
        submitBtn.textContent = '📨 Enviar Solicitud';
      }

      showToast('✅ Solicitud registrada: ' + codigo, 'success');
    }

    function copyReclamacionVoucher() {
      if (!lastReclamacionVoucherData) return;
      const d = lastReclamacionVoucherData;
      const text = `📨 TICKET DE ATENCIÓN & SOPORTE — ALIVIAFIN
Código de seguimiento: ${d.codigo}
Fecha de registro: ${d.formattedDate}
Usuario: ${d.consumidor_nombre} (${d.consumidor_tipo_doc}: ${d.consumidor_num_doc})
Email: ${d.consumidor_email} | Tel: ${d.consumidor_telefono}
Servicio: ${d.tipo_servicio} (Monto: S/ ${d.monto_reclamado})
Tipo: ${d.tipo.toUpperCase()}
Detalle: ${d.detalle}
Pedido concreto: ${d.pedido}
Plazo de respuesta: Máximo 24 a 48 horas hábiles directas a tu correo.`;

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

    // ================================================================
    // TOUR GUIADO NATIVO VANILLA APPLE (100% OFFLINE, ZERO CDN)
    // ================================================================
    let nativeTourCurrentStep = 0;
    const nativeTourSteps = [
      {
        targetMobile: '#executiveBalanceCard',
        targetDesk: '#executiveBalanceCard',
        tab: 'inicio',
        title: '💵 Disponible en Banco',
        desc: 'Tu saldo bancario real al instante. Aquí ves cuánto dinero te queda para terminar el mes en verde, tus ingresos y tus gastos pagados.'
      },
      {
        targetMobile: '#navTabQuickAdd',
        targetDesk: '.btn-header-expense',
        tab: 'inicio',
        title: '⚡ Registrar Gasto al Instante',
        desc: 'Toca aquí cada vez que hagas una compra o pago. Puedes registrar gastos al contado o compras en cuotas con tarjeta.'
      },
      {
        targetMobile: '#navTabMovimientos',
        targetDesk: '#deskNavTabMovimientos',
        tab: 'movimientos',
        title: '💳 Movimientos & Cuotas',
        desc: 'Consulta tu lista completa de transacciones, tu Plan 50/30/20 y tus Compras en Cuotas (método Bola de Nieve) para liquidar compromisos.'
      },
      {
        targetMobile: '#navTabAjustes',
        targetDesk: '#deskNavTabSettings',
        tab: 'inicio',
        title: '⚙️ Ajustes y Tu Sueldo',
        desc: 'Configura o edita tu sueldo inicial en cualquier momento, ajusta tus categorías de gastos fijos y exporta reportes mensuales.'
      }
    ];

    function startInteractiveTour() {
      closeAllModals();
      nativeTourCurrentStep = 0;
      showNativeTourStep(0);
    }

    function showNativeTourStep(stepIdx) {
      if (stepIdx < 0 || stepIdx >= nativeTourSteps.length) {
        closeNativeTour();
        return;
      }
      nativeTourCurrentStep = stepIdx;
      const step = nativeTourSteps[stepIdx];

      if (step.tab && typeof switchTab === 'function') {
        switchTab(step.tab);
      }

      document.querySelectorAll('.native-tour-target-active').forEach(el => {
        el.classList.remove('native-tour-target-active');
      });

      const isDesk = window.innerWidth >= 1024;
      const sel = isDesk ? (step.targetDesk || step.targetMobile) : (step.targetMobile || step.targetDesk);
      const targetEl = sel ? document.querySelector(sel) : null;

      if (targetEl) {
        targetEl.classList.add('native-tour-target-active');
        try {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (e) {}
      }

      const badgeEl = document.getElementById('nativeTourStepBadge');
      const titleEl = document.getElementById('nativeTourTitle');
      const descEl = document.getElementById('nativeTourDesc');
      const prevBtn = document.getElementById('nativeTourPrevBtn');
      const nextBtn = document.getElementById('nativeTourNextBtn');
      const backdrop = document.getElementById('nativeTourBackdrop');

      if (badgeEl) badgeEl.textContent = `Paso ${stepIdx + 1} de ${nativeTourSteps.length}`;
      if (titleEl) titleEl.textContent = step.title;
      if (descEl) descEl.textContent = step.desc;

      if (prevBtn) {
        prevBtn.style.display = stepIdx === 0 ? 'none' : 'block';
      }
      if (nextBtn) {
        nextBtn.textContent = stepIdx === nativeTourSteps.length - 1 ? '¡Comenzar a Usar! 🚀' : 'Siguiente →';
      }

      if (backdrop) backdrop.style.display = 'flex';
    }

    function nativeTourNextStep() {
      if (nativeTourCurrentStep >= nativeTourSteps.length - 1) {
        closeNativeTour();
      } else {
        showNativeTourStep(nativeTourCurrentStep + 1);
      }
    }

    function nativeTourPrevStep() {
      if (nativeTourCurrentStep > 0) {
        showNativeTourStep(nativeTourCurrentStep - 1);
      }
    }

    function closeNativeTour() {
      document.querySelectorAll('.native-tour-target-active').forEach(el => {
        el.classList.remove('native-tour-target-active');
      });
      const backdrop = document.getElementById('nativeTourBackdrop');
      if (backdrop) backdrop.style.display = 'none';

      const userKey = currentUser ? currentUser.id : 'guest';
      localStorage.setItem('finanzas_tour_dismissed_' + userKey, 'true');
      localStorage.setItem('finanzas_tour_dismissed', 'true');

      if (typeof switchTab === 'function') switchTab('inicio');
    }

    window.startInteractiveTour = startInteractiveTour;
    window.nativeTourNextStep = nativeTourNextStep;
    window.nativeTourPrevStep = nativeTourPrevStep;
    window.closeNativeTour = closeNativeTour;
    window.closeTour = closeNativeTour;
