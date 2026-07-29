import type { Dictionary, Locale } from '@/lib/i18n';

const icons = [
  // ERPNext / sistema
  <path key="0" d="M4 5h16v4H4zM4 11h16v8H4zM8 15h8" strokeLinecap="round" strokeLinejoin="round" />,
  // Automatización / flujos
  <path key="1" d="M5 6h9a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H8m11 0-3-3 3-3M5 18h9" strokeLinecap="round" strokeLinejoin="round" />,
  // IA
  <path key="2" d="M12 3v3m0 12v3M3 12h3m12 0h3M7 7l2 2m6 6 2 2m0-12-2 2M9 15l-2 2M9 9h6v6H9z" strokeLinecap="round" strokeLinejoin="round" />,
  // Consultoría / estrategia
  <path key="3" d="M4 19V9m5 10V5m5 14v-7m5 7V8" strokeLinecap="round" strokeLinejoin="round" />,
];

export default function Services({ dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.services;
  return (
    <section id="servicios" className="bg-surface-sunken py-24">
      <div className="container-obin">
        <p className="eyebrow text-accent">{t.eyebrow}</p>
        <h2 className="mt-3 max-w-[720px]">{t.title}</h2>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {t.items.map((item, i) => (
            <article key={item.title} className="rounded-[14px] border border-line bg-surface-raised p-7 shadow-card">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  {icons[i]}
                </svg>
              </div>
              <h3 className="mt-5">{item.title}</h3>
              <p className="measure mt-2.5 text-body text-content-secondary">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
