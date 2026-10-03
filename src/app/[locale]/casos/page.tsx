import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary, isLocale, defaultLocale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/pageMeta';
import PageHeader from '@/components/PageHeader';
import Testimonial from '@/components/Testimonial';
import CTABand from '@/components/CTABand';
import { ArrowRight } from '@/components/icons';

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
      {/* Entrada al programa, que vive en su propia página: es lo único
          accionable para quien todavía no puede pagar una implementación
          estándar. */}
      <div className="container-obin pb-4 pt-6">
        <Link
          href={`/${locale}/casos/programa-colaboradores/`}
          className="group flex flex-col gap-5 rounded-[14px] border border-line bg-surface-raised p-6 shadow-card transition-colors hover:border-accent md:flex-row md:items-center md:justify-between md:p-7"
        >
          <span>
            <span className="block font-display text-subhead font-medium text-content">{p.collaborationTeaser.title}</span>
            <span className="mt-1.5 block text-body text-content-secondary">{p.collaborationTeaser.description}</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-2 text-body font-semibold text-accent">
            {p.collaborationTeaser.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>
      <Testimonial locale={locale} dict={dict} />
      <CTABand locale={locale} dict={dict} />
    </>
  );
}
