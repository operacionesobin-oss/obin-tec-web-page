import es from '../../content/es.json';
import en from '../../content/en.json';

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

// Diccionarios tipados a partir del JSON en español (misma forma en inglés).
export type Dictionary = typeof es;

const dictionaries: Record<Locale, Dictionary> = {
  es,
  en: en as Dictionary,
};

export function getDictionary(locale: string): Dictionary {
  return dictionaries[(locale as Locale)] ?? dictionaries[defaultLocale];
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
