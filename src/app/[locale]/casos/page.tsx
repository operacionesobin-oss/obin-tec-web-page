import type { Metadata } from 'next';
import { getDictionary, isLocale, defaultLocale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/pageMeta';
import PageHeader from '@/components/PageHeader';
import Testimonial from '@/components/Testimonial';
import CTABand from '@/components/CTABand';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return buildMetadata(params.locale, 'casos', '/casos');
}

export default function CasosPage({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = getDictionary(locale);
  const p = dict.pages.casos;

  return (
    <>
      <PageHeader title={p.title} intro={p.intro} />
      <Testimonial locale={locale} dict={dict} />
      <CTABand locale={locale} dict={dict} />
    </>
  );
}
