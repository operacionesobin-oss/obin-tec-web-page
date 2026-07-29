import type { Metadata } from 'next';
import { getDictionary, isLocale, defaultLocale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/pageMeta';
import PageHeader from '@/components/PageHeader';
import Services from '@/components/Services';
import CTABand from '@/components/CTABand';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return buildMetadata(params.locale, 'servicios', '/servicios');
}

export default function ServiciosPage({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = getDictionary(locale);
  const p = dict.pages.servicios;

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: dict.services.items.map((s, i) => ({
      '@type': 'Service',
      position: i + 1,
      name: s.title,
      description: s.description,
      provider: { '@type': 'Organization', name: 'OBIN' },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <PageHeader title={p.title} intro={p.intro} />
      <Services locale={locale} dict={dict} />
      <CTABand locale={locale} dict={dict} />
    </>
  );
}
