// card-generator.js - Generador de tarjeta visual HTML y captura con Playwright
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

/**
 * Mapeo inteligente de iconos y etiquetas según el concepto y categoría del gasto
 */
function getItemMeta(name, category) {
  const text = `${name} ${category}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (text.includes('carro') || text.includes('auto') || text.includes('vehiculo') || text.includes('gasolina') || text.includes('mecanico') || text.includes('seguro carro')) {
    return { icon: '🚗', label: 'TRANSPORTE & AUTO', color: '#38bdf8', bg: '#0c4a6e' };
  }
  if (text.includes('gato') || text.includes('gatito') || text.includes('bebe') || text.includes('arena') || text.includes('mascota') || text.includes('veterinari')) {
    return { icon: '🐱', label: 'MASCOTAS & FAMILIA', color: '#f472b6', bg: '#831843' };
  }
  if (text.includes('tarjeta') || text.includes('diners') || text.includes('interbank') || text.includes('bcp') || text.includes('bbva') || text.includes('prestamo') || text.includes('rapicash') || text.includes('credito') || text.includes('excedente')) {
    return { icon: '💳', label: 'BANCO & TARJETAS', color: '#fbbf24', bg: '#78350f' };
  }
  if (text.includes('universidad') || text.includes('utp') || text.includes('estudio') || text.includes('curso') || text.includes('colegio')) {
    return { icon: '🎓', label: 'EDUCACIÓN', color: '#a78bfa', bg: '#4c1d95' };
  }
  if (text.includes('internet') || text.includes('claro') || text.includes('movistar') || text.includes('entel') || text.includes('wifi')) {
    return { icon: '🌐', label: 'INTERNET & REDES', color: '#60a5fa', bg: '#1e3a8a' };
  }
  if (text.includes('celular') || text.includes('telefono')) {
    return { icon: '📱', label: 'LÍNEAS MÓVILES', color: '#34d399', bg: '#064e3b' };
  }
  if (text.includes('luz') || text.includes('electricidad') || text.includes('enel') || text.includes('servicio') || text.includes('agua') || text.includes('sedapal')) {
    return { icon: '💡', label: 'SERVICIOS BÁSICOS', color: '#fb923c', bg: '#7c2d12' };
  }
  if (text.includes('netflix') || text.includes('spotify') || text.includes('youtube') || text.includes('icloud') || text.includes('streaming') || text.includes('suscripcion')) {
    return { icon: '🎬', label: 'SUSCRIPCIONES', color: '#f87171', bg: '#7f1d1d' };
  }
  if (text.includes('gym') || text.includes('gimnasio') || text.includes('salud') || text.includes('mapfre') || text.includes('seguro') || text.includes('farmacia') || text.includes('medicina')) {
    return { icon: '🏋️', label: 'SALUD & FITNESS', color: '#2dd4bf', bg: '#134e4a' };
  }
  if (text.includes('casa') || text.includes('alquiler') || text.includes('depa') || text.includes('mantenimiento') || text.includes('departamento')) {
    return { icon: '🏠', label: 'HOGAR & VIVIENDA', color: '#818cf8', bg: '#312e81' };
  }
  if (text.includes('comida') || text.includes('super') || text.includes('mercado') || text.includes('almuerzo') || text.includes('restaurante')) {
    return { icon: '🛒', label: 'ALIMENTACIÓN', color: '#4ade80', bg: '#14532d' };
  }
  if (text.includes('junta') || text.includes('ahorro')) {
    return { icon: '🤝', label: 'JUNTA & COMPROMISOS', color: '#e879f9', bg: '#701a75' };
  }
  if (text.includes('pasaje') || text.includes('viaje') || text.includes('vuelo') || text.includes('chiclayo') || text.includes('cusco')) {
    return { icon: '✈️', label: 'VIAJES', color: '#38bdf8', bg: '#0369a1' };
  }
  if (text.includes('uña') || text.includes('barber') || text.includes('ropa') || text.includes('personal')) {
    return { icon: '💅', label: 'CUIDADO PERSONAL', color: '#f43f5e', bg: '#881337' };
  }

  return { icon: '📌', label: category.toUpperCase(), color: '#94a3b8', bg: '#1e293b' };
}

/**
 * Genera el documento HTML interactivo y estilizado
 */
function buildHtmlCard(reportData) {
  const {
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
  } = reportData;

  const renderItemHtml = (item, badgeText, badgeColor, badgeBg) => {
    const meta = getItemMeta(item.name, item.category);
    const commentHtml = item.comment ? `<div class="item-comment">💬 ${escapeHtml(item.comment)}</div>` : '';
    const installmentHtml = item.isInstallment
      ? `<span class="installment-badge">💳 Cuota ${item.installmentsCurrent}/${item.installmentsTotal}</span>`
      : '';

    return `
      <div class="item-card">
        <div class="item-icon-box" style="background: ${meta.bg}; color: ${meta.color}; border: 1px solid ${meta.color}40;">
          <span class="item-icon">${meta.icon}</span>
        </div>
        <div class="item-details">
          <div class="item-header">
            <span class="item-name">${escapeHtml(item.name)}</span>
            ${installmentHtml}
          </div>
          <div class="item-sub">
            <span class="item-cat" style="color: ${meta.color};">${meta.label}</span>
            <span class="item-due-tag" style="background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeColor}50;">
              ${badgeText}
            </span>
          </div>
          ${commentHtml}
        </div>
        <div class="item-amount">
          S/ ${item.amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
    `;
  };

  const sections = [];

  if (urgentToday.length > 0) {
    sections.push(`
      <div class="section-block urgent-today">
        <div class="section-title">🚨 ¡VENCE HOY! (${todayStr})</div>
        ${urgentToday.map(i => renderItemHtml(i, '¡HOY!', '#ef4444', 'rgba(239, 68, 68, 0.15)')).join('')}
      </div>
    `);
  }

  if (urgentTomorrow.length > 0) {
    sections.push(`
      <div class="section-block urgent-tomorrow">
        <div class="section-title">⏰ VENCE MAÑANA</div>
        ${urgentTomorrow.map(i => renderItemHtml(i, 'Mañana', '#f59e0b', 'rgba(245, 158, 11, 0.15)')).join('')}
      </div>
    `);
  }

  if (upcomingNext10Days.length > 0) {
    sections.push(`
      <div class="section-block upcoming">
        <div class="section-title">⏳ PRÓXIMOS EN 10 DÍAS</div>
        ${upcomingNext10Days.map(i => {
          const daysText = i.daysLeft === 1 ? 'Mañana' : `Faltan ${i.daysLeft} días (Día ${i.dueDate})`;
          return renderItemHtml(i, daysText, '#38bdf8', 'rgba(56, 189, 248, 0.15)');
        }).join('')}
      </div>
    `);
  }

  if (overdueItems.length > 0) {
    sections.push(`
      <div class="section-block overdue">
        <div class="section-title">⚠️ PAGOS ATRASADOS PENDIENTES</div>
        ${overdueItems.map(i => renderItemHtml(i, `Atrasado hace ${i.daysOverdue} d (Día ${i.dueDate})`, '#f43f5e', 'rgba(244, 63, 94, 0.2)')).join('')}
      </div>
    `);
  }

  if (sections.length === 0) {
    sections.push(`
      <div class="all-clear-card">
        <div style="font-size: 48px; margin-bottom: 8px;">🎉</div>
        <div style="font-size: 18px; font-weight: 800; color: #10b981;">¡Todo al día en los próximos 10 días!</div>
        <div style="font-size: 13px; color: #94a3b8; margin-top: 4px;">No hay vencimientos pendientes en la ventana de alerta.</div>
      </div>
    `);
  }

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Makiados Finance - Recordatorio</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body {
      background: #090d16;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 24px;
      color: #f8fafc;
    }
    .card-container {
      width: 620px;
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 24px;
      padding: 28px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      position: relative;
      overflow: hidden;
    }
    .card-container::before {
      content: '';
      position: absolute;
      top: -100px;
      right: -100px;
      width: 260px;
      height: 260px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%);
      pointer-events: none;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 22px;
      padding-bottom: 16px;
      border-bottom: 1px solid #1e293b;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-logo {
      font-size: 32px;
      background: #1e1b4b;
      border: 1px solid #4338ca;
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
    }
    .brand-title {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
    }
    .brand-sub {
      font-size: 11px;
      color: #818cf8;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .time-badge {
      background: #1e293b;
      border: 1px solid #334155;
      padding: 6px 12px;
      border-radius: 10px;
      text-align: right;
    }
    .time-badge-date { font-size: 11px; font-weight: 700; color: #cbd5e1; }
    .time-badge-time { font-size: 10px; color: #94a3b8; }

    /* KPI STATS ROW */
    .kpi-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }
    .kpi-card {
      background: #131d33;
      border: 1px solid #1e293b;
      border-radius: 14px;
      padding: 14px 16px;
    }
    .kpi-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .kpi-val { font-size: 22px; font-weight: 800; color: #38bdf8; margin-top: 4px; }
    .kpi-val.urgent { color: #f43f5e; }

    /* PROGRESS BAR */
    .progress-box {
      background: #131d33;
      border: 1px solid #1e293b;
      border-radius: 14px;
      padding: 12px 16px;
      margin-bottom: 22px;
    }
    .progress-header {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 700;
      color: #cbd5e1;
      margin-bottom: 8px;
    }
    .progress-bar-bg {
      height: 8px;
      background: #1e293b;
      border-radius: 999px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #06b6d4);
      border-radius: 999px;
      width: ${paidPercent}%;
    }

    /* SECTIONS */
    .section-block {
      margin-bottom: 20px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 800;
      color: #cbd5e1;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* ITEMS */
    .item-card {
      display: flex;
      align-items: center;
      gap: 14px;
      background: #131d33;
      border: 1px solid #1e293b;
      border-radius: 14px;
      padding: 12px 14px;
      margin-bottom: 8px;
    }
    .item-icon-box {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }
    .item-details {
      flex: 1;
      min-width: 0;
    }
    .item-header {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .item-name {
      font-size: 14px;
      font-weight: 800;
      color: #f8fafc;
    }
    .installment-badge {
      font-size: 10px;
      font-weight: 800;
      background: rgba(217, 70, 239, 0.15);
      color: #f0abfc;
      border: 1px solid rgba(217, 70, 239, 0.3);
      padding: 2px 6px;
      border-radius: 6px;
    }
    .item-sub {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 3px;
    }
    .item-cat {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .item-due-tag {
      font-size: 9px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 6px;
    }
    .item-comment {
      font-size: 10px;
      color: #94a3b8;
      margin-top: 4px;
      font-style: italic;
    }
    .item-amount {
      font-size: 15px;
      font-weight: 800;
      color: #ffffff;
      white-space: nowrap;
    }

    /* ALL CLEAR */
    .all-clear-card {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 16px;
      padding: 28px;
      text-align: center;
    }

    /* FOOTER */
    .footer {
      margin-top: 18px;
      padding-top: 16px;
      border-top: 1px solid #1e293b;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #64748b;
    }
    .footer-action {
      color: #38bdf8;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="card-container">
    <!-- Header -->
    <div class="header">
      <div class="brand">
        <div class="brand-logo">🐱</div>
        <div>
          <div class="brand-title">Makiados Finance</div>
          <div class="brand-sub">Recordatorio de Pagos</div>
        </div>
      </div>
      <div class="time-badge">
        <div class="time-badge-date">${todayStr}</div>
        <div class="time-badge-time">Reporte: ${currentTimeStr}</div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-label">Por pagar en 10 días</div>
        <div class="kpi-val">S/ ${total10Days.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Atrasados / Urgentes</div>
        <div class="kpi-val ${totalOverdue > 0 ? 'urgent' : ''}">S/ ${totalOverdue.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      </div>
    </div>

    <!-- Progress -->
    <div class="progress-box">
      <div class="progress-header">
        <span>Progreso ${currentMonth}: ${paidMonthTxs} de ${totalMonthTxs} pagados</span>
        <span>${paidPercent}%</span>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill"></div>
      </div>
    </div>

    <!-- Sections -->
    ${sections.join('')}

    <!-- Footer -->
    <div class="footer">
      <div>💬 Responde <strong>"ok"</strong> para pausar hoy</div>
      <div class="footer-action">finanzas-snowy-kappa.vercel.app</div>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Renderiza el HTML y genera la imagen PNG en alta definición
 */
async function generateReportImage(reportData, outputPath) {
  const htmlContent = buildHtmlCard(reportData);
  const tempHtmlPath = path.join(__dirname, 'temp-report.html');
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 680, height: 1200 },
    deviceScaleFactor: 2 // Alta resolución retina
  });

  await page.goto(`file://${tempHtmlPath}`);
  const cardElement = await page.$('.card-container');
  if (cardElement) {
    await cardElement.screenshot({ path: outputPath });
  } else {
    await page.screenshot({ path: outputPath, fullPage: true });
  }

  await browser.close();
  try { fs.unlinkSync(tempHtmlPath); } catch (_) {}

  return outputPath;
}

module.exports = {
  buildHtmlCard,
  generateReportImage,
  getItemMeta
};
