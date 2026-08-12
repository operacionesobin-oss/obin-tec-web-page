import type { Metadata } from 'next';
import { getDictionary, isLocale, defaultLocale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/pageMeta';
import PageHeader from '@/components/PageHeader';
import ImageLightbox from '@/components/ImageLightbox';
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
      <section className="py-24">
        <div className="container-obin">
          <h2>{p.modules.title}</h2>
          <p className="mt-3 text-lead text-content-secondary">{p.modules.subtitle}</p>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {p.modules.items.map((mod) => (
              <figure key={mod.title} className="overflow-hidden rounded-[20px] border border-border bg-surface-raised shadow-card">
                <ImageLightbox
                  src={mod.image}
                  alt={mod.title}
                  width={800}
                  height={520}
                  className="w-full"
                />
                <figcaption className="px-4 py-3 text-center font-display text-label font-medium text-content">
                  {mod.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <Process locale={locale} dict={dict} />
      <CTABand locale={locale} dict={dict} />
    </>
  );
}
