import type { Dictionary, Locale } from '@/lib/i18n';

export default function Process({ dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.process;
  return (
    <section id="proceso" className="bg-surface-brand py-24 text-white">
      <div className="container-obin">
        <p className="eyebrow text-obin-blue-300">{t.eyebrow}</p>
        <h2 className="mt-3 max-w-[720px] text-white">{t.title}</h2>

        {/* A cuatro columnas por debajo de 1280px la medida caía a ~22ch y las
            descripciones se rompían en tres o cuatro palabras por línea.
            La secuencia sólo se despliega en horizontal cuando hay ancho real. */}
        <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
          {t.steps.map((s) => (
            <li key={s.num} className="border-t border-white/15 pt-5">
              <span className="tnum font-mono text-data text-obin-blue-300">{s.num}</span>
              <h3 className="mt-3 text-white">{s.title}</h3>
              <p className="on-dark-body measure mt-2.5 text-body">{s.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
