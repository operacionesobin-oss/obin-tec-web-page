import type { Dictionary, Locale } from '@/lib/i18n';
import { Check, Minus } from './icons';

export default function CollaborationProgram({ dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.pages.casos.collaboration;
  return (
    <>
      <section className="bg-surface-sunken py-24">
        <div className="container-obin grid gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow text-accent">{t.eyebrow}</p>
            <h2 className="mt-3 max-w-[720px]">{t.title}</h2>
            {t.intro.map((paragraph) => (
              <p key={paragraph} className="measure mt-5 text-body-lg text-content-secondary">
                {paragraph}
              </p>
            ))}
            {/* La aclaración es la objeción que más pesa («¿entonces es gratis?»):
                se separa del cuerpo para que no se pierda en la prosa. */}
            <div className="measure mt-8 border-l-2 border-accent pl-5">
              <p className="font-display text-label font-medium text-content">{t.note.title}</p>
              <p className="mt-1.5 text-body text-content-secondary">{t.note.description}</p>
            </div>
          </div>

          <div className="self-start rounded-[14px] border border-line bg-surface-raised p-7 shadow-card">
            <h3>{t.audience.title}</h3>
            <ul className="mt-5 space-y-4">
              {t.audience.items.map((item) => (
                <li key={item} className="flex gap-3 text-body text-content-secondary">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Check />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-surface-brand py-24 text-white">
        <div className="container-obin">
          <p className="eyebrow text-obin-blue-300">{t.steps.eyebrow}</p>
          <h2 className="mt-3 max-w-[720px] text-white">{t.steps.title}</h2>
          <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
            {t.steps.items.map((s) => (
              <li key={s.num} className="border-t border-white/15 pt-5">
                <span className="tnum font-mono text-data text-obin-blue-300">{s.num}</span>
                <h3 className="mt-3 text-white">{s.title}</h3>
                <p className="on-dark-body measure mt-2.5 text-body">{s.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-24">
        <div className="container-obin">
          <h2>{t.scope.title}</h2>

          {/* Tabla real para lectores de pantalla; en móvil cada fila se apila
              como tarjeta porque tres columnas no caben a 375px. */}
          <table className="mt-12 w-full border-collapse text-left">
            <thead className="sr-only md:not-sr-only">
              <tr className="border-b border-line-strong">
                <th scope="col" className="w-[22%] pb-4 pr-6 text-meta font-medium text-content-muted">
                  {t.scope.headers.area}
                </th>
                <th scope="col" className="pb-4 pr-6 text-meta font-medium text-content-muted">
                  {t.scope.headers.includes}
                </th>
                <th scope="col" className="pb-4 text-meta font-medium text-content-muted">
                  {t.scope.headers.excludes}
                </th>
              </tr>
            </thead>
            <tbody>
              {t.scope.rows.map((row) => (
                <tr key={row.area} className="block border-b border-line py-6 md:table-row md:py-0">
                  <th scope="row" className="block font-display text-label font-medium text-content md:table-cell md:py-6 md:pr-6 md:align-top">
                    {row.area}
                  </th>
                  <td className="mt-3 flex gap-3 text-body text-content-secondary md:mt-0 md:table-cell md:py-6 md:pr-6 md:align-top">
                    <span className="flex gap-3">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-accent" />
                      <span>
                        <span className="sr-only">{t.scope.headers.includes}: </span>
                        {row.includes}
                      </span>
                    </span>
                  </td>
                  <td className="mt-2 flex gap-3 text-body text-content-muted md:mt-0 md:table-cell md:py-6 md:align-top">
                    <span className="flex gap-3">
                      <Minus className="mt-1 h-4 w-4 shrink-0" />
                      <span>
                        <span className="sr-only">{t.scope.headers.excludes}: </span>
                        {row.excludes}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-surface-sunken py-24">
        <div className="container-obin">
          <div className="grid gap-5 md:grid-cols-2">
            {[t.asks, t.offers].map((group) => (
              <article key={group.title} className="rounded-[14px] border border-line bg-surface-raised p-7 shadow-card">
                <h3>{group.title}</h3>
                <ul className="mt-5 space-y-3.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3 text-body text-content-secondary">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="measure mt-12 text-lead text-content">{t.closing}</p>
        </div>
      </section>
    </>
  );
}
