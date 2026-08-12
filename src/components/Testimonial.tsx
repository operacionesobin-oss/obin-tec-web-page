import type { Dictionary, Locale } from '@/lib/i18n';
import { QuoteMark } from './icons';

export default function Testimonial({ dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.testimonial;
  return (
    <section className="py-24">
      <div className="container-obin mb-14">
        <h2>{t.title}</h2>
        <p className="mt-3 text-lead text-content-secondary">{t.subtitle}</p>
      </div>
      {/* Se reparte en dos columnas sólo a partir de lg: en md la cita caía a
          ~24ch y se rompía en siete líneas. */}
      <div className="container-obin grid items-center gap-14 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex aspect-[4/5] items-end rounded-[20px] bg-obin-gradient-soft p-6">
          <figcaption className="rounded-xl bg-surface-raised px-3.5 py-2.5 shadow-card">
            <p className="font-display text-label font-medium text-content">{t.name}</p>
            <p className="mt-0.5 text-meta text-content-muted">{t.role}</p>
          </figcaption>
        </div>

        <figure>
          <QuoteMark className="h-7 w-7 text-accent" />
          <blockquote className="measure mt-4 font-display text-quote font-normal text-content">
            {t.quote}
          </blockquote>
          <div className="mt-7 flex flex-wrap gap-x-4 gap-y-2 text-meta text-content-muted">
            {t.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </figure>
      </div>
    </section>
  );
}
