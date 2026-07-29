import { test, expect, type Page } from '@playwright/test';
import { ROUTES } from './helpers';

/* Comprobaciones que no dependen del tema: que el sitio esté entero.
   Cada una falla por una razón distinta y nombrable, no «la página se ve mal». */

test.describe('integridad de enlaces', () => {
  test('ningún enlace interno lleva a un 404', async ({ page, request }) => {
    const seen = new Set<string>();
    const broken: Array<{ from: string; href: string; status: number }> = [];

    for (const route of ROUTES) {
      await page.goto(route);
      const hrefs = await page.$$eval('a[href]', (as) =>
        as.map((a) => (a as HTMLAnchorElement).getAttribute('href') ?? '')
      );
      for (const href of hrefs) {
        // Externos, anclas y esquemas especiales se comprueban aparte.
        if (!href.startsWith('/') || seen.has(href)) continue;
        seen.add(href);
        const res = await request.get(href, { maxRedirects: 5 });
        if (res.status() >= 400) broken.push({ from: route, href, status: res.status() });
      }
    }

    expect(seen.size).toBeGreaterThan(10);
    expect(broken, JSON.stringify(broken, null, 2)).toEqual([]);
  });

  test('los enlaces externos declaran rel seguro', async ({ page }) => {
    const offenders: string[] = [];
    for (const route of ['/es', '/en']) {
      await page.goto(route);
      const bad = await page.$$eval('a[href^="http"]', (as) =>
        as
          .filter((a) => {
            const el = a as HTMLAnchorElement;
            return el.target === '_blank' && !(el.rel || '').includes('noopener');
          })
          .map((a) => (a as HTMLAnchorElement).href)
      );
      offenders.push(...bad);
    }
    expect(offenders).toEqual([]);
  });
});

test.describe('metadatos por página', () => {
  for (const route of ROUTES) {
    test(`${route} declara título, descripción, canonical y hreflang`, async ({ page }) => {
      await page.goto(route);

      await expect(page).toHaveTitle(/.{10,}/);

      const desc = await page.getAttribute('meta[name="description"]', 'content');
      expect(desc?.length ?? 0, 'descripción ausente o corta').toBeGreaterThan(40);

      const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
      expect(canonical, 'sin canonical').toBeTruthy();

      // La paridad ES/EN es un compromiso del producto, no un extra.
      const alternates = await page.$$eval('link[rel="alternate"]', (ls) =>
        ls.map((l) => l.getAttribute('hreflang'))
      );
      expect(alternates).toEqual(expect.arrayContaining(['es', 'en']));
    });
  }

  test('el atributo lang sigue al locale', async ({ page }) => {
    await page.goto('/es/');
    expect(await page.getAttribute('html', 'lang')).toBe('es');
    await page.goto('/en/');
    expect(await page.getAttribute('html', 'lang')).toBe('en');
  });
});

test.describe('estructura del documento', () => {
  for (const route of ROUTES) {
    test(`${route} tiene un solo h1 y jerarquía sin saltos`, async ({ page }) => {
      await page.goto(route);

      const h1s = await page.$$eval('h1', (hs) => hs.map((h) => h.textContent?.trim() ?? ''));
      expect(h1s, `h1 encontrados: ${JSON.stringify(h1s)}`).toHaveLength(1);
      expect(h1s[0].length).toBeGreaterThan(0);

      // Ningún nivel se salta (h2 → h4), que es lo que rompe la navegación
      // por encabezados en lector de pantalla.
      const levels = await page.$$eval('h1,h2,h3,h4,h5,h6', (hs) =>
        hs.map((h) => Number(h.tagName[1]))
      );
      const jumps = levels.filter((l, i) => i > 0 && l - levels[i - 1] > 1);
      expect(jumps, `saltos de nivel en ${route}: ${levels.join(',')}`).toEqual([]);
    });
  }
});

test.describe('sin errores en consola', () => {
  for (const route of ROUTES) {
    test(`${route} carga limpio`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

      await page.goto(route, { waitUntil: 'networkidle' });
      // Da margen a la hidratación: los avisos de React aparecen tras montar.
      await page.waitForTimeout(400);

      expect(errors, JSON.stringify(errors, null, 2)).toEqual([]);
    });
  }
});

test.describe('enrutado e i18n', () => {
  test('la raíz redirige a un locale', async ({ page }) => {
    const res = await page.goto('/');
    expect(res?.status()).toBeLessThan(400);
    expect(new URL(page.url()).pathname).toMatch(/^\/(es|en)/);
  });

  test('el selector de idioma conserva la ruta', async ({ page }) => {
    await page.goto('/es/servicios/');
    await page.getByRole('link', { name: 'EN', exact: true }).click();
    await expect(page).toHaveURL(/\/en\/servicios\/$/);

    await page.getByRole('link', { name: 'ES', exact: true }).click();
    await expect(page).toHaveURL(/\/es\/servicios\/$/);
  });

  test('una ruta inexistente da 404', async ({ page }) => {
    const res = await page.goto('/es/no-existe-esta-pagina/');
    expect(res?.status()).toBe(404);
  });
});

test.describe('navegación y teclado', () => {
  test('el enlace de salto lleva al contenido', async ({ page }) => {
    await page.goto('/es/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: /Saltar al contenido/ });
    await expect(skip).toBeFocused();
    await skip.press('Enter');
    expect(new URL(page.url()).hash).toBe('#contenido');
  });

  test('el menú móvil abre, navega y cierra', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto('/es/');

    const open = page.getByRole('button', { name: 'Abrir menú' });
    await expect(open).toHaveAttribute('aria-expanded', 'false');
    await open.click();

    const menu = page.locator('#mobile-menu');
    await expect(menu).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cerrar menú' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    await menu.getByRole('link', { name: 'Servicios' }).click();
    await expect(page).toHaveURL(/\/es\/servicios\/$/);
    // Al navegar el menú se repliega: si no, tapa la página de destino.
    await expect(page.locator('#mobile-menu')).toHaveCount(0);
    await ctx.close();
  });

  test('todo control interactivo es alcanzable con Tab', async ({ page }) => {
    await page.goto('/es/');
    const focusables = await page.$$eval(
      'a[href], button:not([disabled]), input, textarea, select',
      (els) => els.filter((e) => (e as HTMLElement).offsetParent !== null).length
    );
    expect(focusables).toBeGreaterThan(15);

    // Ninguno queda fuera del orden natural con tabindex negativo.
    const removed = await page.$$eval('a[href], button', (els) =>
      els.filter((e) => e.getAttribute('tabindex') === '-1').length
    );
    expect(removed).toBe(0);
  });
});

test.describe('conversión', () => {
  const bookingCta = /Agendar diagnóstico|Book a diagnostic/;

  test('todas las páginas ofrecen la ruta al diagnóstico', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      const cta = page.getByRole('link', { name: bookingCta }).first();
      await expect(cta, `sin CTA en ${route}`).toBeVisible();
      await expect(cta).toHaveAttribute('href', /\/(es|en)\/contacto\/$/);
    }
  });

  test('el formulario exige nombre y correo antes de enviar', async ({ page }) => {
    await page.goto('/es/contacto/');
    const submit = page.getByRole('button', { name: 'Solicitar diagnóstico' });

    await submit.click();
    // El estado de éxito no aparece con el formulario vacío.
    await expect(page.getByRole('status')).toHaveCount(0);
    await expect(page.getByText('Escribe tu nombre.')).toBeVisible();
    await expect(page.getByText('Escribe un correo electrónico válido.')).toBeVisible();

    // El campo queda marcado para tecnología asistiva y recibe el foco.
    await expect(page.locator('input[name="name"]')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('input[name="name"]')).toBeFocused();

    // Un correo mal formado tampoco pasa.
    await page.locator('input[name="name"]').fill('Ana Restrepo');
    await page.locator('input[name="email"]').fill('ana@');
    await submit.click();
    await expect(page.getByRole('status')).toHaveCount(0);
    await expect(page.getByText('Escribe un correo electrónico válido.')).toBeVisible();

    // Con datos válidos sí envía.
    await page.locator('input[name="email"]').fill('ana@pyme.com');
    await submit.click();
    await expect(page.getByRole('status')).toBeVisible();
  });

  test('los errores del formulario están traducidos', async ({ page }) => {
    await page.goto('/en/contacto/');
    await page.getByRole('button', { name: 'Request diagnostic' }).click();
    await expect(page.getByText('Enter your name.')).toBeVisible();
    await expect(page.getByText('Enter a valid email address.')).toBeVisible();
  });
});

test.describe('imágenes y recursos', () => {
  test('toda imagen tiene alt', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      const missing = await page.$$eval('img', (imgs) =>
        imgs.filter((i) => !i.hasAttribute('alt')).map((i) => i.getAttribute('src') ?? '')
      );
      expect(missing, `sin alt en ${route}`).toEqual([]);
    }
  });

  test('todo SVG informativo se anuncia o se oculta', async ({ page }) => {
    await page.goto('/es/');
    // Un svg sin role ni aria-hidden es ruido para el lector de pantalla.
    const undeclared = await page.$$eval('svg', (svgs) =>
      svgs.filter((s) => !s.hasAttribute('aria-hidden') && !s.hasAttribute('role')).length
    );
    expect(undeclared).toBe(0);
  });
});

test.describe('robots y sitemap', () => {
  test('sitemap.xml lista las rutas de ambos locales', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const xml = await res.text();
    for (const path of ['/es/', '/en/', '/es/servicios/', '/en/servicios/', '/es/contacto/']) {
      expect(xml, `falta ${path}`).toContain(path);
    }
  });

  test('robots.txt permite el rastreo y apunta al sitemap', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain('Sitemap');
  });
});

test.describe('respuesta a la pantalla', () => {
  const sizes = [
    { name: 'móvil', width: 360, height: 780 },
    { name: 'tableta', width: 768, height: 1024 },
    { name: 'portátil', width: 1280, height: 800 },
    { name: 'panorámico', width: 1920, height: 1080 },
  ];

  for (const size of sizes) {
    test(`sin desbordamiento ni solapes · ${size.name}`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: size.width, height: size.height } });
      const page = await ctx.newPage();
      for (const route of ROUTES) {
        await page.goto(route);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        expect(overflow, `${route} desborda en ${size.name}`).toBeLessThanOrEqual(0);

        // Ningún bloque de texto se sale de su contenedor por la derecha.
        const spill = await page.evaluate(() => {
          const w = document.documentElement.clientWidth;
          return [...document.querySelectorAll('h1,h2,h3,p,a,span,li')]
            .filter((el) => {
              const r = el.getBoundingClientRect();
              return r.width > 0 && r.right > w + 1;
            })
            .map((el) => el.tagName + ':' + (el.textContent ?? '').trim().slice(0, 30));
        });
        expect(spill, `${route} · ${size.name}`).toEqual([]);
      }
      await ctx.close();
    });
  }
});

test.describe('objetivos táctiles', () => {
  test('los controles del pie y la barra son cómodos en móvil', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto('/es/');

    const small = await page.evaluate(() => {
      const out: string[] = [];
      for (const el of document.querySelectorAll('footer a, header a, header button')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        // El enlace de salto mide 1x1 hasta recibir foco: es el patrón
        // correcto de sr-only, no un objetivo pequeño.
        if (el.className.includes('sr-only')) continue;
        // 24px es el mínimo de WCAG 2.2 (AA) para un objetivo puntero.
        if (r.width < 24 || r.height < 24) {
          out.push(`${el.tagName} "${(el.textContent ?? '').trim().slice(0, 24)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
      }
      return out;
    });
    expect(small, JSON.stringify(small, null, 2)).toEqual([]);
    await ctx.close();
  });
});

// Utilidad compartida por si se amplía la suite.
export async function firstVisible(page: Page, selector: string) {
  return page.locator(selector).first();
}
