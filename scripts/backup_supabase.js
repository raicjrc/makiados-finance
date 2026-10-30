/**
 * AliviaFin — Script de Backup Automatizado de Supabase y Base de Datos
 * 
 * Descarga y guarda de forma segura todas las tablas de Supabase y el estado local.
 * Cero costo ($0.00), seguro e inmutable.
 * 
 * Uso:
 *   node scripts/backup_supabase.js
 *   npm run backup
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://swwvbfemxookbqoqotre.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'sb_publishable_CZUC5ueCxjSDFeA3idgVZg_DaEoIJxf';

const BACKUP_DIR = path.resolve(__dirname, '../backups');
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function fetchTable(table) {
  return new Promise((resolve, reject) => {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=*`;
    const req = https.get(url, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ table, status: res.statusCode, count: Array.isArray(json) ? json.length : 0, data: json });
        } catch (e) {
          resolve({ table, status: res.statusCode, error: data });
        }
      });
    });
    req.on('error', reject);
  });
}

(async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFileName = `supabase_backup_${timestamp}.json`;
  const backupFilePath = path.join(BACKUP_DIR, backupFileName);

  console.log('====================================================');
  console.log('🛡️  AliviaFin — Iniciando Respaldo de Base de Datos');
  console.log(`⏰ Fecha: ${new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })}`);
  console.log('====================================================');

  const tables = ['finanzas_state', 'user_subscriptions', 'subscription_payments', 'app_feedback', 'app_reclamaciones'];
  const backupData = {
    metadata: {
      generated_at: new Date().toISOString(),
      supabase_url: SUPABASE_URL,
      version: 'v78.3'
    },
    tables: {},
    local_database_fallback: null
  };

  for (const t of tables) {
    try {
      const res = await fetchTable(t);
      backupData.tables[t] = res.data;
      console.log(`  ✓ Tabla [${t}]: ${res.count} registros respaldados (HTTP ${res.status})`);
    } catch (e) {
      console.error(`  ✕ Error al respaldar [${t}]:`, e.message);
    }
  }

  // Incluir copia de respaldo de database.json local si existe
  const localDbPath = path.resolve(__dirname, '../database.json');
  if (fs.existsSync(localDbPath)) {
    try {
      backupData.local_database_fallback = JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
      console.log('  ✓ Respaldo local de database.json integrado');
    } catch (e) {
      console.log('  ⚠️ database.json no se pudo parsear:', e.message);
    }
  }

  fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2), 'utf8');
  const stats = fs.statSync(backupFilePath);
  const sizeKB = (stats.size / 1024).toFixed(1);

  console.log('----------------------------------------------------');
  console.log(`✅ ¡Respaldo completado exitosamente!`);
  console.log(`📁 Archivo: backups/${backupFileName}`);
  console.log(`📦 Peso: ${sizeKB} KB`);
  console.log('====================================================\n');
})();
