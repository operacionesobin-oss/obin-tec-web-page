import type { Metadata } from 'next';
import { getDictionary, isLocale, defaultLocale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/pageMeta';
import PageHeader from '@/components/PageHeader';
import Process from '@/components/Process';
import CTABand from '@/components/CTABand';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return buildMetadata(params.locale, 'plataforma', '/plataforma');
}

export default function PlataformaPage({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = getDictionary(locale);
  const p = dict.pages.plataforma;

  return (
    <>
      <PageHeader title={p.title} intro={p.intro} />
      <Process locale={locale} dict={dict} />
      <CTABand locale={locale} dict={dict} />
    </>
  );
}
