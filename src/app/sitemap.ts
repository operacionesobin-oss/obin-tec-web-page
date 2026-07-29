import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';

const SITE_URL = 'https://obin.tech';
const routes = ['', '/servicios', '/plataforma', '/casos', '/nosotros', '/blog', '/contacto'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${route}`])),
        },
      });
    }
  }
  return entries;
}
