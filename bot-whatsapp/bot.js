// bot.js - Servicio principal del bot de WhatsApp para Makiados Finance
const cron = require('node-cron');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { generateReportImage, getItemMeta } = require('./card-generator');
const { loginInteractive, sendReport, loadAckStore } = require('./sender');
const config = require('./config.json');

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

/**
 * Consulta Supabase, procesa vencimientos y arma el payload
 */
async function buildCurrentReport() {
  const { data, error } = await supabase
    .from('finanzas_state')
    .select('data')
    .eq('id', config.userStateId)
    .single();

  if (error || !data || !data.data) {
    throw new Error('No se pudo leer el estado de Supabase: ' + (error ? error.message : 'sin datos'));
  }

  const appState = data.data;
  const currentMonth = appState.currentMonth || 'Septiembre 2026';
  const monthTxs = (appState.transactions && appState.transactions[currentMonth]) || [];
  const recurring = appState.recurringDueDates || {};

  const now = new Date();
  const currentDay = now.getDate();
  const todayStr = `${currentDay} de ${currentMonth}`;
  const currentTimeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

  const urgentToday = [];
  const urgentTomorrow = [];
  const upcomingNext10Days = [];
  const overdueItems = [];

  let total10Days = 0;
  let totalOverdue = 0;
  let paidMonthTxs = 0;

  monthTxs.forEach(tx => {
    if (tx.status === 'Pagado') {
      paidMonthTxs++;
      return;
    }

    const dueDay = parseInt(tx.dueDate || recurring[tx.name.toLowerCase().trim()] || '15', 10);
    const daysDiff = dueDay - currentDay;

    const item = {
      ...tx,
      dueDate: dueDay,
      daysLeft: daysDiff,
      daysOverdue: -daysDiff
    };

    if (daysDiff === 0) {
      urgentToday.push(item);
      total10Days += tx.amount;
    } else if (daysDiff === 1) {
      urgentTomorrow.push(item);
      total10Days += tx.amount;
    } else if (daysDiff > 1 && daysDiff <= config.anticipationDays) {
      upcomingNext10Days.push(item);
      total10Days += tx.amount;
    } else if (daysDiff < 0) {
      overdueItems.push(item);
      totalOverdue += tx.amount;
    }
  });

  upcomingNext10Days.sort((a, b) => a.daysLeft - b.daysLeft);
  overdueItems.sort((a, b) => b.daysOverdue - a.daysOverdue);

  const totalMonthTxs = monthTxs.length;
  const paidPercent = totalMonthTxs > 0 ? Math.round((paidMonthTxs / totalMonthTxs) * 100) : 0;

  const reportData = {
    todayStr,
    currentTimeStr,
    currentMonth,
    urgentToday,
    urgentTomorrow,
    upcomingNext10Days,
    overdueItems,
    total10Days,
    totalOverdue,
    totalMonthTxs,
    paidMonthTxs,
    paidPercent
  };

  // Construir mensaje de texto
  let textMessage = `🔔 *MAKIADOS FINANCE — RECORDATORIO DE PAGOS* 💳\n_Reporte de las ${currentTimeStr}_\n\n`;

  if (urgentToday.length > 0) {
    textMessage += `🚨 *¡VENCE HOY (${todayStr})!*\n`;
    urgentToday.forEach(i => {
      const meta = getItemMeta(i.name, i.category);
      textMessage += `• ${meta.icon} *${i.name}:* S/ ${i.amount.toFixed(2)}${i.comment ? ` _(${i.comment})_` : ''}\n`;
    });
    textMessage += '\n';
  }

  if (urgentTomorrow.length > 0) {
    textMessage += `⏰ *VENCE MAÑANA:*\n`;
    urgentTomorrow.forEach(i => {
      const meta = getItemMeta(i.name, i.category);
      textMessage += `• ${meta.icon} *${i.name}:* S/ ${i.amount.toFixed(2)}${i.comment ? ` _(${i.comment})_` : ''}\n`;
    });
    textMessage += '\n';
  }

  if (upcomingNext10Days.length > 0) {
    textMessage += `⏳ *PRÓXIMOS EN 10 DÍAS:*\n`;
    upcomingNext10Days.forEach(i => {
      const meta = getItemMeta(i.name, i.category);
      const cuota = i.isInstallment ? ` • _[Cuota ${i.installmentsCurrent}/${i.installmentsTotal}]_` : '';
      textMessage += `• ${meta.icon} *${i.name}:* S/ ${i.amount.toFixed(2)} _(Faltan ${i.daysLeft} días — Día ${i.dueDate})${cuota}_\n`;
    });
    textMessage += '\n';
  }

  if (overdueItems.length > 0) {
    textMessage += `⚠️ *PAGOS ATRASADOS PENDIENTES:*\n`;
    overdueItems.forEach(i => {
      const meta = getItemMeta(i.name, i.category);
      textMessage += `• ${meta.icon} *${i.name}:* S/ ${i.amount.toFixed(2)} _(Atrasado hace ${i.daysOverdue} días — Día ${i.dueDate})_\n`;
    });
    textMessage += '\n';
  }

  textMessage += `───────────────────────\n`;
  textMessage += `💰 *Total por pagar en 10 días:* S/ ${total10Days.toLocaleString('es-PE', { minimumFractionDigits: 2 })}\n`;
  if (totalOverdue > 0) {
    textMessage += `⚠️ *Total atrasado:* S/ ${totalOverdue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}\n`;
  }
  textMessage += `📈 *Progreso ${currentMonth}:* ${paidMonthTxs} de ${totalMonthTxs} gastos pagados (${paidPercent}%)\n`;
  textMessage += `───────────────────────\n\n`;
  textMessage += `💬 _Para pausar los recordatorios de hoy, responde:* "ok" *o* "leído"*._\n`;
  textMessage += `🔗 _Marcar como pagado en la app: finanzas-snowy-kappa.vercel.app_`;

  return { reportData, textMessage, todayStr };
}

/**
 * Ejecuta el ciclo completo de generación y envío
 */
async function triggerReminder(label = 'Manual') {
  console.log(`\n========================================`);
  console.log(`⏰ Disparando recordatorio (${label}) - ${new Date().toLocaleString('es-PE')}`);
  console.log(`========================================`);

  try {
    const { reportData, textMessage, todayStr } = await buildCurrentReport();

    // Si no hay pagos en 10 días ni atrasados, avisar sólo una vez
    if (reportData.urgentToday.length === 0 &&
        reportData.urgentTomorrow.length === 0 &&
        reportData.upcomingNext10Days.length === 0 &&
        reportData.overdueItems.length === 0) {
      console.log('✅ No hay pagos pendientes en los próximos 10 días.');
      return;
    }

    const imagePath = path.join(__dirname, 'latest-reminder.png');
    await generateReportImage(reportData, imagePath);
    console.log('📸 Infografía actualizada lista.');

    await sendReport(imagePath, textMessage, todayStr);
  } catch (err) {
    console.error('❌ Error en triggerReminder:', err);
  }
}

// Control por línea de comandos
const args = process.argv.slice(2);

if (args.includes('--login')) {
  loginInteractive().catch(console.error);
} else if (args.includes('--send-now')) {
  triggerReminder('Envío Inmediato').catch(console.error);
} else {
  // Modo Daemon / Programado
  console.log('🤖 Bot de WhatsApp Makiados Finance iniciado.');
  console.log(`👥 Grupo objetivo: "${config.groupName}"`);
  console.log('⏰ Horarios programados:');
  config.schedules.forEach(s => {
    console.log(`   - ${s.label}: ${s.cron}`);
    cron.schedule(s.cron, () => triggerReminder(s.label), {
      timezone: 'America/Lima'
    });
  });

  console.log('🟢 Servicio activo en segundo plano. Presiona Ctrl+C para detener.');
}
