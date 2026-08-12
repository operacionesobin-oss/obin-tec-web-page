import Link from 'next/link';
import type { Dictionary, Locale } from '@/lib/i18n';
import { ArrowRight } from './icons';

export default function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.hero;
  const base = `/${locale}`;

  return (
    <section className="container-obin pb-24 pt-16 md:pt-20">
      <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-kicker font-semibold text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {t.badge}
      </span>

      <h1 className="mt-6 max-w-[960px]">
        {t.titleLead}{' '}
        {/* El énfasis lo cargan el peso y el tono de marca, no un degradado. */}
        <span className="font-medium text-accent">{t.titleHighlight}</span>{' '}
        {t.titleTail}
      </h1>

      <p className="measure mt-6 text-lead text-content-secondary">{t.subtitle}</p>

      <div className="mt-9 flex flex-wrap gap-3">
        <Link href={`${base}/contacto`} className="btn-primary">
          {t.ctaPrimary}
          <ArrowRight />
        </Link>
        <a href="#proceso" className="btn-secondary">
          {t.ctaSecondary}
        </a>
      </div>

    </section>
  );
}
