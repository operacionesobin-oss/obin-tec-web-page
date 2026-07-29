import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';

const SITE_URL = 'https://obin.tech';
const routes = ['', '/servicios', '/plataforma', '/casos', '/nosotros', '/blog', '/contacto'];

/* Con `trailingSlash` activo la URL canónica termina en barra. El sitemap tiene
   que emitir exactamente esa forma: si listara `/es/servicios`, cada entrada
   redirigiría a `/es/servicios/` y el buscador lo leería como sitemap sucio. */
const url = (locale: string, route: string) => `${SITE_URL}/${locale}${route}/`;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: url(locale, route),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, url(l, route)])),
        },
      });
    }
  }
  return entries;
}
