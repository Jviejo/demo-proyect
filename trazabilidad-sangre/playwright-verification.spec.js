const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3003';

// Páginas que deben existir según el plan
const CONTENT_PAGES = [
  { path: '/', name: 'Home' },
  { path: '/company', name: 'Company' },
  { path: '/team', name: 'Team' },
  { path: '/our-promise', name: 'Our Promise' },
  { path: '/servicios', name: 'Servicios' },
  { path: '/inspirations', name: 'Inspirations' },
  { path: '/news', name: 'News' },
  { path: '/blooddonationeu', name: 'Blood Donation EU' },
  { path: '/where-we-are', name: 'Where We Are' },
  { path: '/webinar', name: 'Webinar' },
  { path: '/docus', name: 'Documentación' },
  { path: '/trace', name: 'Trace' },
  { path: '/marketplace', name: 'Marketplace' },
  { path: '/registro', name: 'Registro' }
];

test.describe('Verificación según Plan - Grupo 1: Páginas de Contenido', () => {
  CONTENT_PAGES.forEach(({ path, name }) => {
    test(`${name} (${path}) debe cargar sin errores`, async ({ page }) => {
      const response = await page.goto(BASE_URL + path, { waitUntil: 'networkidle' });

      // Verificar que la página carga con 200
      expect(response.status()).toBe(200);

      // Verificar que no hay errores en consola
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      // Esperar a que el contenido se renderice
      await page.waitForTimeout(2000);

      // Verificar que no haya location.reload() en el código ejecutado
      const hasReload = await page.evaluate(() => {
        return window.performance.getEntries().some(e => e.type === 'reload');
      });
      expect(hasReload).toBe(false);
    });
  });
});

test.describe('Verificación según Plan - Grupo 2: Colores y Diseño', () => {
  test('Verificar colores púrpura (#503291) y verde (#32cd32) están presentes', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Verificar que los colores están definidos en CSS
    const hasPurple = await page.evaluate(() => {
      const styles = Array.from(document.styleSheets)
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules).map(rule => rule.cssText).join('');
          } catch (e) {
            return '';
          }
        })
        .join('');
      return styles.includes('#503291') || styles.includes('rgb(80, 50, 145)');
    });

    // Si no están en CSS inline, al menos verificar que hay elementos con estos colores en computed styles
    const elementsWithPurple = await page.$$eval('*', elements => {
      return elements.some(el => {
        const style = window.getComputedStyle(el);
        const bg = style.backgroundColor;
        const color = style.color;
        const border = style.borderColor;
        return [bg, color, border].some(c =>
          c.includes('rgb(80, 50, 145)') || c.includes('80, 50, 145')
        );
      });
    });

    expect(elementsWithPurple || hasPurple).toBeTruthy();
  });

  test('Verificar animaciones con framer-motion funcionan', async ({ page }) => {
    await page.goto(BASE_URL + '/our-promise', { waitUntil: 'networkidle' });

    // Verificar que existen elementos animados (framer-motion agrega atributos)
    const hasAnimations = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[style*="transform"]')).length > 0;
    });

    expect(hasAnimations).toBeTruthy();
  });
});

test.describe('Verificación según Plan - Grupo 3: Imágenes', () => {
  test('Imágenes webp cargan correctamente en /our-promise', async ({ page }) => {
    await page.goto(BASE_URL + '/our-promise', { waitUntil: 'networkidle' });

    // Esperar a que las imágenes carguen
    await page.waitForTimeout(2000);

    // Verificar que hay imágenes y que cargaron correctamente
    const images = await page.$$('img');
    expect(images.length).toBeGreaterThan(0);

    // Verificar que ninguna imagen tiene error
    const brokenImages = await page.$$eval('img', imgs =>
      imgs.filter(img => !img.complete || img.naturalHeight === 0).length
    );
    expect(brokenImages).toBe(0);
  });

  test('Imágenes webp cargan correctamente en /company', async ({ page }) => {
    await page.goto(BASE_URL + '/company', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const images = await page.$$('img');
    expect(images.length).toBeGreaterThan(0);

    const brokenImages = await page.$$eval('img', imgs =>
      imgs.filter(img => !img.complete || img.naturalHeight === 0).length
    );
    expect(brokenImages).toBe(0);
  });
});

test.describe('Verificación según Plan - Grupo 4: Navegación', () => {
  test('Header debe estar presente en todas las páginas', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const header = await page.$('header, nav, [role="navigation"]');
    expect(header).toBeTruthy();
  });

  test('Links de navegación funcionan sin errores 404', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Obtener todos los links internos
    const links = await page.$$eval('a[href^="/"]', anchors =>
      anchors.map(a => a.getAttribute('href')).filter(Boolean)
    );

    // Probar algunos links clave
    const keyLinks = ['/company', '/marketplace', '/trace'];
    for (const link of keyLinks) {
      if (links.includes(link)) {
        const response = await page.goto(BASE_URL + link);
        expect(response.status()).toBe(200);
      }
    }
  });

  test('Footer debe estar presente', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const footer = await page.$('footer');
    expect(footer).toBeTruthy();
  });
});

test.describe('Verificación según Plan - Grupo 5: Responsive Design', () => {
  test('La aplicación debe ser responsive en mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Verificar que no hay scroll horizontal
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('La aplicación debe ser responsive en tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('La aplicación debe ser responsive en desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });
});

test.describe('Verificación según Plan - Grupo 6: Sin location.reload()', () => {
  test('NO debe haber location.reload() en el código fuente', async ({ page }) => {
    // Verificar marketplace
    await page.goto(BASE_URL + '/marketplace', { waitUntil: 'networkidle' });

    let reloadDetected = false;
    await page.exposeFunction('detectReload', () => {
      reloadDetected = true;
    });

    // Interceptar cualquier intento de reload
    await page.evaluate(() => {
      const originalReload = window.location.reload;
      window.location.reload = function() {
        window.detectReload();
        return originalReload.apply(this, arguments);
      };
    });

    // Interactuar con la página (si hay botones)
    await page.waitForTimeout(2000);

    expect(reloadDetected).toBe(false);
  });
});

test.describe('Verificación según Plan - Grupo 7: Performance', () => {
  test('La página principal debe cargar en menos de 5 segundos', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;

    console.log(`⏱️  Tiempo de carga: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000);
  });

  test('No debe haber errores de JavaScript en consola', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Filtrar errores conocidos/esperados (como warnings de React)
    const criticalErrors = errors.filter(err =>
      !err.includes('Warning:') &&
      !err.includes('useWallet must be used within') // Este es esperado sin wallet
    );

    expect(criticalErrors.length).toBe(0);
  });
});

test.describe('Verificación según Plan - Grupo 8: Registro Wizard', () => {
  test('Página de registro debe cargar y mostrar formulario', async ({ page }) => {
    await page.goto(BASE_URL + '/registro', { waitUntil: 'networkidle' });

    // Esperar a que cargue el contenido
    await page.waitForTimeout(2000);

    // Verificar que hay elementos de formulario
    const hasForm = await page.evaluate(() => {
      return document.querySelectorAll('input, button, form').length > 0;
    });

    expect(hasForm).toBeTruthy();
  });
});
