import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, Space_Mono } from 'next/font/google';
import '../globals.css';
import { getDictionary, locales, isLocale, defaultLocale } from '@/lib/i18n';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { themeInitScript } from '@/lib/theme';
import { social } from '@/lib/social';

// Sólo se cargan los pesos que la interfaz usa: 700 no aparece en ningún sitio.
const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-display',
  display: 'swap',
  adjustFontFallback: true,
});
const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  adjustFontFallback: true,
});
const mono = Space_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
  adjustFontFallback: true,
});

const SITE_URL = 'https://obin.tech';

// La barra del navegador en móvil acompaña a la superficie: si no, queda una
// franja blanca sobre una página oscura.
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0C0F1B' },
  ],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const t = getDictionary(locale).meta.home;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.title, template: '%s' },
    description: t.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { es: '/es', en: '/en' },
    },
    openGraph: {
      type: 'website',
      siteName: 'OBIN',
      title: t.title,
      description: t.description,
      locale: locale === 'es' ? 'es_LA' : 'en_US',
      images: [{ url: '/og.png', width: 1200, height: 630, alt: 'OBIN' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.description,
      images: ['/og.png'],
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = getDictionary(locale);

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OBIN',
    description: dict.meta.home.description,
    url: SITE_URL,
    slogan: 'Open Business Intelligence',
    areaServed: 'LATAM',
    // Asocia los perfiles públicos con la organización en los buscadores.
    sameAs: social.map((s) => s.href),
  };

  return (
    // El script de tema muta la clase de <html> antes de hidratar; sin
    // `suppressHydrationWarning` React avisaría de un desajuste que es
    // intencionado.
    <html
      lang={locale}
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Nav locale={locale} dict={dict} />
        <main id="contenido">{children}</main>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
