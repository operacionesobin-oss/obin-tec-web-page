import type { Metadata } from 'next';
import { getDictionary, isLocale, defaultLocale, type Dictionary } from './i18n';

type MetaKey = keyof Dictionary['meta'];

// Genera metadata SEO (title, description, canonical + hreflang) por página y locale.
export function buildMetadata(localeRaw: string, key: MetaKey, path: string): Metadata {
  const locale = isLocale(localeRaw) ? localeRaw : defaultLocale;
  const m = getDictionary(locale).meta[key];
  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { es: `/es${path}`, en: `/en${path}` },
    },
    openGraph: { title: m.title, description: m.description },
  };
}
