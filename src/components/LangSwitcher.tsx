'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';

// Cambia de idioma conservando la ruta actual.
export default function LangSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  function pathFor(target: Locale) {
    const segments = pathname.split('/');
    segments[1] = target; // reemplaza el segmento de locale
    return segments.join('/') || `/${target}`;
  }

  return (
    <div className="flex items-center gap-1 text-meta font-medium" aria-label="Selector de idioma">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-content-muted">/</span>}
          <Link
            href={pathFor(l)}
            aria-current={l === locale ? 'true' : undefined}
            className={l === locale ? 'text-accent' : 'text-content-muted hover:text-content-secondary'}
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
