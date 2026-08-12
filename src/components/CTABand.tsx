import type { Dictionary, Locale } from '@/lib/i18n';
import { ArrowRight } from './icons';

export default function CTABand({ dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.ctaBand;
  return (
    <section className="container-obin pb-24">
      <div className="flex flex-col items-start justify-between gap-8 rounded-[24px] bg-obin-gradient px-8 py-14 text-white md:flex-row md:items-center md:px-14">
        <div className="max-w-[520px]">
          <h2 className="text-white">{t.title}</h2>
          <p className="on-dark-body mt-3.5 text-body-lg">{t.subtitle}</p>
        </div>
        <a
          href="https://wa.me/message/5OHEUBLLDTBIN1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-[14px] bg-white px-[26px] py-4 text-body font-semibold text-obin-blue-800 transition-transform hover:-translate-y-0.5"
        >
          {t.cta}
          <ArrowRight />
        </a>
      </div>
    </section>
  );
}
