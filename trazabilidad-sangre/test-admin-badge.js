const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navegando a http://localhost:3002...');
  await page.goto('http://localhost:3002');
  await page.waitForTimeout(2000);

  console.log('Tomando captura de pantalla inicial...');
  await page.screenshot({ path: 'screenshot-1-inicial.png', fullPage: true });

  console.log('Conectando con MetaMask...');
  // Buscar el botón Connect Wallet
  const connectButton = page.locator('button:has-text("Connect Wallet")');
  if (await connectButton.isVisible()) {
    await connectButton.click();
    await page.waitForTimeout(3000);

    // Interactuar con MetaMask popup si aparece
    console.log('Esperando conexión de MetaMask...');
    await page.waitForTimeout(5000);
  }

  console.log('Tomando captura de pantalla después de conectar...');
  await page.screenshot({ path: 'screenshot-2-conectado.png', fullPage: true });

  // Buscar el badge en la página
  const adminBadge = page.locator('text="Administrador"');
  if (await adminBadge.isVisible()) {
    console.log('✅ Badge "Administrador" encontrado!');
  } else {
    console.log('❌ Badge "Administrador" NO encontrado');
  }

  console.log('Navegando al panel de administración...');
  await page.goto('http://localhost:3002/admin/approval-requests');
  await page.waitForTimeout(3000);

  console.log('Tomando captura de pantalla del panel admin...');
  await page.screenshot({ path: 'screenshot-3-panel-admin.png', fullPage: true });

  console.log('Prueba completada. Revisa las capturas de pantalla.');

  await browser.close();
})();
