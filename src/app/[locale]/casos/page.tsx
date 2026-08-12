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
      <section className="py-24">
        <div className="container-obin">
          <h2>{p.collaboration.title}</h2>
          <p className="measure mt-5 text-lead text-content-secondary">{p.collaboration.description}</p>
        </div>
      </section>
      <CTABand locale={locale} dict={dict} />
    </>
  );
}
