// test-card.js - Prueba de generación de infografía HTML + imagen PNG con datos reales de Supabase
const { createClient } = require('@supabase/supabase-js');
const { generateReportImage, getItemMeta } = require('./card-generator');
const config = require('./config.json');
const path = require('path');

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

async function run() {
  console.log('📡 Conectando a Supabase...');
  const { data, error } = await supabase
    .from('finanzas_state')
    .select('data')
    .eq('id', config.userStateId)
    .single();

  if (error || !data || !data.data) {
    console.error('❌ Error al obtener datos de Supabase:', error);
    process.exit(1);
  }

  const appState = data.data;
  const currentMonth = appState.currentMonth || 'Septiembre 2026';
  const monthTxs = (appState.transactions && appState.transactions[currentMonth]) || [];
  const recurring = appState.recurringDueDates || {};

  const now = new Date();
  const currentDay = now.getDate(); // ej: 12
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

  // Ordenar por días faltantes
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

  const outputPath = path.join(__dirname, 'preview-report.png');
  console.log('🎨 Renderizando infografía HTML y capturando con Playwright...');
  await generateReportImage(reportData, outputPath);
  console.log(`✅ ¡Imagen generada exitosamente en: ${outputPath}!`);

  // Mostrar resumen en texto formateado para WhatsApp
  console.log('\n--- TEXTO FORMATEADO PARA WHATSAPP ---');
  let msg = `🔔 *MAKIADOS FINANCE — RECORDATORIO DE PAGOS* 💳\n_Reporte actualizado de las ${currentTimeStr}_\n\n`;

  if (urgentToday.length > 0) {
    msg += `🚨 *¡VENCE HOY (${todayStr})!*\n`;
    urgentToday.forEach(i => {
      const meta = getItemMeta(i.name, i.category);
      msg += `• ${meta.icon} *${i.name}:* S/ ${i.amount.toFixed(2)}${i.comment ? ` _(${i.comment})_` : ''}\n`;
    });
    msg += '\n';
  }

  if (urgentTomorrow.length > 0) {
    msg += `⏰ *VENCE MAÑANA:*\n`;
    urgentTomorrow.forEach(i => {
      const meta = getItemMeta(i.name, i.category);
      msg += `• ${meta.icon} *${i.name}:* S/ ${i.amount.toFixed(2)}${i.comment ? ` _(${i.comment})_` : ''}\n`;
    });
    msg += '\n';
  }

  if (upcomingNext10Days.length > 0) {
    msg += `⏳ *PRÓXIMOS EN 10 DÍAS:*\n`;
    upcomingNext10Days.forEach(i => {
      const meta = getItemMeta(i.name, i.category);
      const cuota = i.isInstallment ? ` • _[Cuota ${i.installmentsCurrent}/${i.installmentsTotal}]_` : '';
      msg += `• ${meta.icon} *${i.name}:* S/ ${i.amount.toFixed(2)} _(Faltan ${i.daysLeft} días — Día ${i.dueDate})${cuota}_\n`;
    });
    msg += '\n';
  }

  if (overdueItems.length > 0) {
    msg += `⚠️ *PAGOS ATRASADOS PENDIENTES:*\n`;
    overdueItems.forEach(i => {
      const meta = getItemMeta(i.name, i.category);
      msg += `• ${meta.icon} *${i.name}:* S/ ${i.amount.toFixed(2)} _(Atrasado hace ${i.daysOverdue} días — Día ${i.dueDate})_\n`;
    });
    msg += '\n';
  }

  msg += `───────────────────────\n`;
  msg += `💰 *Total por pagar en 10 días:* S/ ${total10Days.toLocaleString('es-PE', { minimumFractionDigits: 2 })}\n`;
  if (totalOverdue > 0) {
    msg += `⚠️ *Total atrasado:* S/ ${totalOverdue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}\n`;
  }
  msg += `📈 *Progreso ${currentMonth}:* ${paidMonthTxs} de ${totalMonthTxs} gastos pagados (${paidPercent}%)\n`;
  msg += `───────────────────────\n\n`;
  msg += `💬 _Para pausar los recordatorios de hoy, responde:* "ok" *o* "leído"*._\n`;
  msg += `🔗 _Marcar como pagado en la app: finanzas-snowy-kappa.vercel.app_`;

  console.log(msg);
}

run().catch(console.error);
