import type { Page } from '@playwright/test';

export const ROUTES = [
  '/es',
  '/es/servicios',
  '/es/plataforma',
  '/es/casos',
  '/es/nosotros',
  '/es/contacto',
  '/es/blog',
  '/es/login',
  '/es/legal/privacidad',
  '/en',
  '/en/servicios',
  '/en/contacto',
];

export type ContrastIssue = {
  ratio: number;
  required: number;
  text: string;
  selector: string;
  color: string;
  background: string;
};

/* Audita el contraste real de cada nodo de texto visible: toma el color
   calculado y sube por los ancestros hasta encontrar un fondo opaco, que es lo
   que el ojo ve. Comprobar los tokens sobre el papel no basta —el fallo típico
   del modo oscuro es una superficie que no cambió debajo de un texto que sí. */
export async function auditContrast(page: Page): Promise<ContrastIssue[]> {
  return page.evaluate(() => {
    const parse = (c: string): [number, number, number, number] => {
      const m = c.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
      return [m[0], m[1], m[2], m[3] ?? 1];
    };
    const lin = (c: number) => {
      const s = c / 255;
      return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    const lum = ([r, g, b]: number[]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    const blend = (fg: number[], bg: number[], a: number) =>
      [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));

    // Paradas de color de un degradado, para poder evaluar el peor punto.
    const gradientStops = (image: string): number[][] => {
      if (!image || image === 'none') return [];
      return (image.match(/rgba?\([^)]+\)/g) ?? []).map((c) => {
        const [r, g, b] = parse(c);
        return [r, g, b];
      });
    };

    /* Fondo efectivo: se apilan las capas semitransparentes hasta llegar a una
       opaca. Un degradado cuenta como capa opaca —es lo que el ojo ve— y se
       devuelven todas sus paradas para poder exigir el mínimo en la más
       desfavorable, no en el promedio. */
    function effectiveBgs(el: Element): number[][] {
      const layers: Array<[number[], number]> = [];
      let node: Element | null = el;
      let stops: number[][] = [];

      while (node) {
        const cs = getComputedStyle(node);
        const g = gradientStops(cs.backgroundImage);
        const [r, gr, b, a] = parse(cs.backgroundColor);
        if (a > 0) layers.push([[r, gr, b], a]);
        if (g.length) {
          stops = g;
          break;
        }
        if (a === 1) break;
        node = node.parentElement;
      }

      const bases = stops.length ? stops : [[255, 255, 255]];
      return bases.map((base) => {
        let out = base;
        for (let i = layers.length - 1; i >= 0; i--) out = blend(layers[i][0], out, layers[i][1]);
        return out;
      });
    }

    function selectorFor(el: Element) {
      const parts: string[] = [];
      let n: Element | null = el;
      for (let i = 0; n && i < 3; i++, n = n.parentElement) {
        parts.unshift(n.tagName.toLowerCase() + (n.className && typeof n.className === 'string'
          ? '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.')
          : ''));
      }
      return parts.join(' > ');
    }

    const issues: ContrastIssue[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set<Element>();

    for (let t = walker.nextNode(); t; t = walker.nextNode()) {
      const text = (t.textContent ?? '').trim();
      if (text.length < 2) continue;
      const el = t.parentElement;
      if (!el || seen.has(el)) continue;
      seen.add(el);

      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) continue;
      // Enlace de salto y etiquetas sólo para lector de pantalla: no se pintan.
      if (cs.position === 'absolute' && rect.width <= 1) continue;

      const size = parseFloat(cs.fontSize);
      const weight = parseInt(cs.fontWeight, 10) || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const required = large ? 3 : 4.5;

      // Sobre un degradado se exige el mínimo en su parada más desfavorable.
      let worst = { ratio: Infinity, bg: [255, 255, 255] };
      for (const bg of effectiveBgs(el)) {
        const [r, g, b, a] = parse(cs.color);
        const fg = a < 1 ? blend([r, g, b], bg, a) : [r, g, b];
        const l1 = lum(fg), l2 = lum(bg);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        if (ratio < worst.ratio) worst = { ratio, bg };
      }

      if (worst.ratio < required) {
        issues.push({
          ratio: Math.round(worst.ratio * 100) / 100,
          required,
          text: text.slice(0, 60),
          selector: selectorFor(el),
          color: cs.color,
          background: `rgb(${worst.bg.map(Math.round).join(', ')})`,
        });
      }
    }
    return issues;
  });
}

export const isDark = (page: Page) =>
  page.evaluate(() => document.documentElement.classList.contains('dark'));

export const bodyBg = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);
