'use client';

import { useEffect } from 'react';
import type { Dictionary } from '@/lib/i18n';
import { THEME_STORAGE_KEY } from '@/lib/theme';
import { Sun, Moon } from './icons';

/* El estado del tema vive en el DOM (la clase `dark` en <html>), no en React.
   El script de <head> ya la fijó antes de la primera pintura, así que leerla
   en un `useState` sólo reintroduciría el desajuste de hidratación que ese
   script existe para evitar. Aquí: qué icono y qué etiqueta se ven lo decide
   CSS a partir de esa misma clase, y el servidor puede renderizar ambos. */
export default function ThemeToggle({ dict }: { dict: Dictionary }) {
  const t = dict.nav;

  // Sin elección explícita, el sitio sigue al sistema aunque cambie en caliente
  // (macOS e iOS alternan solos al anochecer).
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem(THEME_STORAGE_KEY)) return;
      document.documentElement.classList.toggle('dark', e.matches);
      document.documentElement.style.colorScheme = e.matches ? 'dark' : 'light';
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next = root.classList.contains('dark') ? 'light' : 'dark';

    // El único momento animado de la interfaz: la superficie cambia de tono en
    // un gesto, en lugar de saltar. La clase se retira para que la transición
    // no siga colgada de cada hover posterior.
    root.classList.add('theme-switching');
    window.setTimeout(() => root.classList.remove('theme-switching'), 320);

    root.classList.toggle('dark', next === 'dark');
    root.style.colorScheme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Modo privado: el tema no persiste, pero la sesión funciona.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={t.theme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-content-muted
        transition-colors hover:bg-accent-soft hover:text-accent"
    >
      <Sun className="hidden h-[18px] w-[18px] dark:block" />
      <Moon className="h-[18px] w-[18px] dark:hidden" />
      {/* El nombre accesible nombra la acción, no el estado, y cambia con el
          tema sin pasar por React. */}
      <span className="sr-only dark:hidden">{t.themeToDark}</span>
      <span className="sr-only hidden dark:inline">{t.themeToLight}</span>
    </button>
  );
}
