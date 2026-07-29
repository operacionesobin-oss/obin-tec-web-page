import { test, expect } from '@playwright/test';
import { ROUTES, auditContrast, isDark, bodyBg } from './helpers';

const LIGHT_BG = 'rgb(255, 255, 255)';
const DARK_BG = 'rgb(12, 15, 27)';

test.describe('preferencia del sistema', () => {
  test('sin elección previa, sigue al sistema en oscuro', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'dark' });
    const page = await ctx.newPage();
    await page.goto('/es/');
    expect(await isDark(page)).toBe(true);
    expect(await bodyBg(page)).toBe(DARK_BG);
    await ctx.close();
  });

  test('sin elección previa, sigue al sistema en claro', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto('/es/');
    expect(await isDark(page)).toBe(false);
    expect(await bodyBg(page)).toBe(LIGHT_BG);
    await ctx.close();
  });

  test('el sistema cambia en caliente y la página lo sigue', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto('/es/');
    expect(await isDark(page)).toBe(false);
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect.poll(() => isDark(page)).toBe(true);
    await ctx.close();
  });
});

test.describe('el conmutador', () => {
  test('cambia de tema y persiste al recargar y al navegar', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto('/es/');

    const toggle = page.getByRole('button', { name: 'Cambiar a modo oscuro' });
    await expect(toggle).toBeVisible();
    await toggle.click();

    expect(await isDark(page)).toBe(true);
    // El nombre accesible nombra ahora la acción contraria.
    await expect(page.getByRole('button', { name: 'Cambiar a modo claro' })).toBeVisible();

    await page.reload();
    expect(await isDark(page)).toBe(true);

    await page.goto('/es/servicios/');
    expect(await isDark(page)).toBe(true);
    expect(await bodyBg(page)).toBe(DARK_BG);

    await ctx.close();
  });

  test('la elección explícita gana sobre el sistema', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'dark' });
    const page = await ctx.newPage();
    await page.goto('/es/');
    expect(await isDark(page)).toBe(true);

    await page.getByRole('button', { name: 'Cambiar a modo claro' }).click();
    expect(await isDark(page)).toBe(false);

    // El sistema se mueve, pero el usuario ya decidió.
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(200);
    expect(await isDark(page)).toBe(false);

    await page.reload();
    expect(await isDark(page)).toBe(false);
    await ctx.close();
  });

  test('está en inglés en el locale inglés', async ({ page }) => {
    await page.goto('/en/');
    await expect(
      page.getByRole('button', { name: /Switch to (dark|light) mode/ })
    ).toBeVisible();
  });

  test('es operable con teclado', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto('/es/');

    const toggle = page.getByRole('button', { name: 'Cambiar a modo oscuro' });
    await toggle.focus();
    await expect(toggle).toBeFocused();
    // El aro de foco se pinta (no está anulado en ningún tema).
    expect(await toggle.evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe('none');
    await page.keyboard.press('Enter');
    expect(await isDark(page)).toBe(true);
    await ctx.close();
  });

  test('está disponible en móvil, dentro del menú', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto('/es/');
    await page.getByRole('button', { name: 'Abrir menú' }).click();
    const toggle = page.getByRole('button', { name: 'Cambiar a modo oscuro' });
    await expect(toggle).toBeVisible();
    await toggle.click();
    expect(await isDark(page)).toBe(true);
    await ctx.close();
  });
});

test('no hay destello claro antes de pintar en oscuro', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();

  // Se observa el estado en el primer momento en que hay documento, antes de
  // que el cuerpo se haya construido: si la clase no está ya puesta, el usuario
  // vería un fotograma en blanco.
  const early: boolean[] = [];
  await page.exposeFunction('__record', (v: boolean) => void early.push(v));
  await page.addInitScript(() => {
    document.addEventListener('readystatechange', () => {
      // @ts-expect-error binding inyectado por la prueba
      window.__record?.(document.documentElement.classList.contains('dark'));
    });
  });

  await page.goto('/es/', { waitUntil: 'domcontentloaded' });
  expect(early.length).toBeGreaterThan(0);
  expect(early.every(Boolean)).toBe(true);
  await ctx.close();
});

test.describe('contraste en todas las rutas', () => {
  for (const route of ROUTES) {
    for (const scheme of ['light', 'dark'] as const) {
      test(`${route} · ${scheme}`, async ({ browser }) => {
        const ctx = await browser.newContext({ colorScheme: scheme });
        const page = await ctx.newPage();
        await page.goto(route);
        await page.waitForLoadState('networkidle');

        expect(await isDark(page)).toBe(scheme === 'dark');
        expect(await bodyBg(page)).toBe(scheme === 'dark' ? DARK_BG : LIGHT_BG);

        const issues = await auditContrast(page);
        expect(issues, JSON.stringify(issues, null, 2)).toEqual([]);
        await ctx.close();
      });
    }
  }
});

test.describe('perfiles sociales', () => {
  const PROFILES = [
    { label: 'Escríbenos por WhatsApp', href: 'https://wa.me/message/5OHEUBLLDTBIN1' },
    { label: 'OBIN en Instagram', href: 'https://www.instagram.com/obintechags/' },
    { label: 'OBIN en Facebook', href: 'https://www.facebook.com/profile.php?id=61577517096488' },
  ];

  test('los tres enlaces están en el pie y apuntan al destino correcto', async ({ page }) => {
    await page.goto('/es/');
    for (const { label, href } of PROFILES) {
      const link = page.getByRole('link', { name: label });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', href);
      // Se abren fuera sin ceder el contexto de la pestaña de origen.
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('los nombres accesibles están traducidos', async ({ page }) => {
    await page.goto('/en/');
    for (const label of ['Message us on WhatsApp', 'OBIN on Instagram', 'OBIN on Facebook']) {
      await expect(page.getByRole('link', { name: label })).toBeVisible();
    }
  });

  test('los perfiles se declaran en el JSON-LD de Organization', async ({ page }) => {
    await page.goto('/es/');
    const sameAs = await page.evaluate(() => {
      const blocks = [...document.querySelectorAll('script[type="application/ld+json"]')];
      for (const b of blocks) {
        const data = JSON.parse(b.textContent ?? '{}');
        if (data['@type'] === 'Organization') return data.sameAs as string[];
      }
      return null;
    });
    expect(sameAs).toEqual(PROFILES.map((p) => p.href));
  });

  test('los iconos son legibles en ambos temas', async ({ browser }) => {
    for (const scheme of ['light', 'dark'] as const) {
      const ctx = await browser.newContext({ colorScheme: scheme });
      const page = await ctx.newPage();
      await page.goto('/es/');
      for (const { label } of PROFILES) {
        const link = page.getByRole('link', { name: label });
        // El SVG hereda el color del enlace y ocupa espacio real.
        const box = await link.locator('svg').boundingBox();
        expect(box?.width ?? 0, `${label} · ${scheme}`).toBeGreaterThan(10);
      }
      await ctx.close();
    }
  });
});

test.describe('composición', () => {
  for (const scheme of ['light', 'dark'] as const) {
    test(`sin desbordamiento horizontal en móvil · ${scheme}`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: 360, height: 780 }, colorScheme: scheme });
      const page = await ctx.newPage();
      for (const route of ROUTES) {
        await page.goto(route);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        expect(overflow, `${route} desborda`).toBeLessThanOrEqual(0);
      }
      await ctx.close();
    });
  }

  test('el formulario de contacto es legible y usable en oscuro', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'dark' });
    const page = await ctx.newPage();
    await page.goto('/es/contacto/');

    const input = page.locator('input[name="email"]');
    // El campo se distingue de la página: no es un rectángulo invisible.
    const [fieldBg, pageBg] = await Promise.all([
      input.evaluate((el) => getComputedStyle(el).backgroundColor),
      bodyBg(page),
    ]);
    expect(fieldBg).not.toBe(pageBg);

    await input.fill('owner@pyme.com');
    await page.locator('input[name="name"]').fill('Ana');
    await page.getByRole('button', { name: /Solicitar diagnóstico|Request diagnostic/ }).click();

    const status = page.getByRole('status');
    await expect(status).toBeVisible();
    // El estado de éxito también respeta el contraste.
    expect(await auditContrast(page)).toEqual([]);
    await ctx.close();
  });
});
