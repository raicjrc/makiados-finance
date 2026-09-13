// sender.js - Enlace y automatización de WhatsApp Web con Playwright
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const config = require('./config.json');

const USER_DATA_DIR = path.join(__dirname, 'user-data');
const ACK_STORE_PATH = path.join(__dirname, 'ack-store.json');

// Cargar o inicializar estado de acuse de recibo
function loadAckStore() {
  try {
    if (fs.existsSync(ACK_STORE_PATH)) {
      return JSON.parse(fs.readFileSync(ACK_STORE_PATH, 'utf-8'));
    }
  } catch (_) {}
  return { date: '', acknowledged: false, lastSentTime: '' };
}

function saveAckStore(store) {
  try {
    fs.writeFileSync(ACK_STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error guardando ack-store:', e);
  }
}

/**
 * Modo Login interactivo para escanear el código QR una sola vez
 */
async function loginInteractive() {
  console.log('🚀 Abriendo navegador para vincular WhatsApp Web...');
  console.log('👉 Escanea el código QR desde tu iPhone en: WhatsApp > Ajustes > Dispositivos vinculados');

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    viewport: { width: 1100, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await context.newPage();
  await page.goto('https://web.whatsapp.com');

  console.log('⏳ Esperando inicio de sesión...');

  // Esperar a que cargue la lista de chats (indicador de que el QR fue escaneado)
  try {
    await page.waitForSelector('#pane-side, [aria-label="Lista de chats"], [data-testid="chat-list"]', {
      timeout: 120000 // 2 minutos para escanear
    });
    console.log('🎉 ¡Inicio de sesión exitoso! La sesión ha quedado guardada.');
    await page.waitForTimeout(3000);
  } catch (e) {
    console.log('⚠️ Tiempo de espera agotado para escanear el QR o ya estaba autenticado.');
  } finally {
    await context.close();
  }
}

/**
 * Busca y selecciona el chat o grupo en WhatsApp Web
 */
async function selectChat(page, groupName) {
  console.log(`🔍 Buscando grupo: "${groupName}"...`);
  
  // Esperar que la interfaz esté lista
  await page.waitForSelector('#pane-side, [data-testid="chat-list"]', { timeout: 30000 });
  await page.waitForTimeout(2000);

  // Intentar hacer clic en el buscador de chats
  const searchSelector = 'input[data-tab="3"], input[role="textbox"], input[aria-label*="Buscar"], div[contenteditable="true"][data-tab="3"]';
  await page.waitForSelector(searchSelector, { timeout: 15000 });
  const searchBox = await page.$(searchSelector);
  
  await searchBox.click();
  await searchBox.fill('');
  await page.waitForTimeout(500);
  await searchBox.fill(groupName);
  await page.waitForTimeout(2000);

  // Buscar el chat en los resultados
  const chatItemSelector = `span[title*="${groupName.replace(/\./g, '').trim()}"]`;
  try {
    await page.waitForSelector(chatItemSelector, { timeout: 10000 });
    const chatTitleSpan = await page.$(chatItemSelector);
    await chatTitleSpan.click();
    console.log(`✅ Grupo "${groupName}" seleccionado.`);
    await page.waitForTimeout(1500);
    return true;
  } catch (err) {
    // Si no lo encuentra con el nombre exacto, buscar en la lista visible
    const alternativeSelector = `div[role="listitem"] span[title]`;
    const titles = await page.$$eval(alternativeSelector, els => els.map(e => e.getAttribute('title')));
    console.log('Chats visibles:', titles);
    const match = titles.find(t => t && t.toLowerCase().includes(config.groupNamePattern.toLowerCase()));
    if (match) {
      const el = await page.$(`span[title="${match}"]`);
      if (el) {
        await el.click();
        console.log(`✅ Grupo coincidente "${match}" seleccionado.`);
        await page.waitForTimeout(1500);
        return true;
      }
    }
    throw new Error(`No se encontró el grupo "${groupName}" en WhatsApp.`);
  }
}

/**
 * Revisa si los últimos mensajes en el chat son un acuse de recibo ("ok", "leído", etc.)
 */
async function checkAcknowledgment(page, todayStr) {
  const store = loadAckStore();
  if (store.date === todayStr && store.acknowledged) {
    console.log('ℹ️ Acuse de recibo ya registrado previamente hoy.');
    return true;
  }

  try {
    // Obtener los últimos mensajes de texto del chat
    const messageSelector = 'div.message-in span.selectable-text';
    const messages = await page.$$eval(messageSelector, els => 
      els.slice(-5).map(e => (e.innerText || '').toLowerCase().trim())
    );

    console.log('Últimos mensajes entrantes en el grupo:', messages);

    const isAck = messages.some(msg => 
      config.ackKeywords.some(kw => msg === kw || msg.startsWith(kw + ' ') || msg.endsWith(' ' + kw))
    );

    if (isAck) {
      console.log('✨ ¡Acuse de recibo detectado en el grupo ("ok" o "leído")!');
      store.date = todayStr;
      store.acknowledged = true;
      saveAckStore(store);
      return true;
    }
  } catch (e) {
    console.warn('No se pudo verificar acuse de recibo:', e.message);
  }

  return false;
}

/**
 * Envía la imagen y el texto al grupo seleccionado
 */
async function sendReport(imagePath, textMessage, todayStr) {
  const store = loadAckStore();

  // Si hoy ya dieron OK, no enviar
  if (store.date === todayStr && store.acknowledged) {
    console.log(`⏭️ Recordatorio omitido: ya fue confirmado como "leído" hoy (${todayStr}).`);
    return { skipped: true, reason: 'acknowledged' };
  }

  console.log('🚀 Iniciando envío a WhatsApp...');
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false, // WhatsApp Web funciona mejor en modo visible o minimizado
    viewport: { width: 1100, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await context.newPage();
  try {
    await page.goto('https://web.whatsapp.com');

    // Seleccionar grupo
    await selectChat(page, config.groupName);

    // Revisar si ya contestaron OK
    const alreadyAck = await checkAcknowledgment(page, todayStr);
    if (alreadyAck) {
      console.log('⏭️ Acuse de recibo detectado justo antes de enviar. Omitiendo.');
      await context.close();
      return { skipped: true, reason: 'acknowledged' };
    }

    // Adjuntar y enviar la infografía si existe
    if (imagePath && fs.existsSync(imagePath)) {
      console.log('📎 Adjuntando infografía...');
      try {
        // En WhatsApp Web hay un botón de adjuntar (+)
        const attachBtnSelector = 'span[data-icon="plus"], button[aria-label="Adjuntar"], div[title="Adjuntar"], span[data-icon="attach-menu-plus"]';
        await page.waitForSelector(attachBtnSelector, { timeout: 10000 });
        await page.click(attachBtnSelector);
        await page.waitForTimeout(1000);

        // Subir archivo al input (puede estar oculto en el DOM, por eso usamos locator directo)
        const fileLocator = page.locator('input[accept*="image"], input[type="file"]').first();
        await fileLocator.setInputFiles(imagePath);
        console.log('🖼️ Archivo cargado en el visor de WhatsApp Web...');
        await page.waitForTimeout(3000);

        // Hacer clic en el botón de enviar imagen
        const sendMediaBtn = 'button[aria-label="Enviar imagen"], button[aria-label*="Enviar"], span[data-icon="send"], div[aria-label="Enviar"]';
        try {
          await page.waitForSelector(sendMediaBtn, { timeout: 10000 });
          await page.click(sendMediaBtn);
        } catch (_) {
          // Si no encuentra el botón por selector, presionar Enter
          await page.keyboard.press('Enter');
        }
        console.log('📤 Infografía enviada con éxito.');
        await page.waitForTimeout(4000);
      } catch (imgErr) {
        console.warn('⚠️ No se pudo adjuntar imagen, enviando texto:', imgErr.message);
      }
    }

    // Enviar el texto detallado
    if (textMessage) {
      console.log('📝 Enviando mensaje de texto detallado...');
      const inputSelector = 'footer div[contenteditable="true"][data-tab="10"]';
      await page.waitForSelector(inputSelector, { timeout: 15000 });
      const inputBox = await page.$(inputSelector);
      await inputBox.click();

      // Pegar texto respetando saltos de línea
      await page.evaluate(({ selector, text }) => {
        const el = document.querySelector(selector);
        el.focus();
        document.execCommand('insertText', false, text);
      }, { selector: inputSelector, text: textMessage });

      await page.waitForTimeout(800);
      await page.keyboard.press('Enter');
      console.log('📤 Mensaje de texto enviado con éxito.');
      await page.waitForTimeout(2000);
    }

    // Registrar hora del último envío
    store.date = todayStr;
    store.lastSentTime = new Date().toISOString();
    saveAckStore(store);

    console.log('✅ ¡Envío completado exitosamente!');
    return { success: true };
  } catch (err) {
    console.error('❌ Error durante el envío en WhatsApp:', err);
    throw err;
  } finally {
    await context.close();
  }
}

module.exports = {
  loginInteractive,
  sendReport,
  checkAcknowledgment,
  loadAckStore
};
