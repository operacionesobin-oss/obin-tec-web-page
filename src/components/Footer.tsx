import Link from 'next/link';
import type { Dictionary, Locale } from '@/lib/i18n';
import { social, type SocialId } from '@/lib/social';
import { Logo, WhatsApp, Instagram, Facebook } from './icons';

const socialIcons: Record<SocialId, (p: { className?: string }) => JSX.Element> = {
  whatsapp: WhatsApp,
  instagram: Instagram,
  facebook: Facebook,
};

// El nombre accesible sale del diccionario, como el resto de la copia.
const socialLabels: Record<SocialId, (t: Dictionary['footer']) => string> = {
  whatsapp: (t) => t.socialWhatsapp,
  instagram: (t) => t.socialInstagram,
  facebook: (t) => t.socialFacebook,
};

export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.footer;
  const base = `/${locale}`;
  const year = new Date().getFullYear();

  const companyHrefs = [`${base}/nosotros`, `${base}/casos`, `${base}/blog`, `${base}/contacto`];
  const serviceHrefs = [`${base}/plataforma`, `${base}/servicios`, `${base}/servicios`, `${base}/servicios`];
  const legalHrefs = [`${base}/legal/privacidad`, `${base}/legal/terminos`, `${base}/legal/seguridad`];

  return (
    <footer className="bg-surface-brand px-5 pb-8 pt-14 text-white/70 md:px-10">
      <div className="mx-auto grid max-w-container gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Logo className="h-10 w-auto" color="#ffffff" />
          <p className="on-dark-body measure-tight mt-4 max-w-[300px] text-meta">{t.tagline}</p>

          {/* Los perfiles cuelgan del bloque de marca, no de una columna de
              enlaces: son la misma entidad, no otra sección del sitio. */}
          <ul className="mt-6 flex items-center gap-2" aria-label={t.social}>
            {social.map(({ id, href }) => {
              const Icon = socialIcons[id];
              return (
                <li key={id}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={socialLabels[id](t)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15
                      text-white/70 transition-colors hover:border-white/40 hover:text-white"
                  >
                    <Icon />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <FooterCol title={t.colServices} items={t.services} hrefs={serviceHrefs} />
        <FooterCol title={t.colCompany} items={t.company} hrefs={companyHrefs} />
        <FooterCol title={t.colLegal} items={t.legal} hrefs={legalHrefs} />
      </div>

      <div className="mx-auto mt-10 flex max-w-container flex-col justify-between gap-3 border-t border-white/10 pt-6 text-meta text-white/65 sm:flex-row">
        <span>© {year} OBIN · Open Business Intelligence</span>
        <span>{t.madeIn}</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, items, hrefs }: { title: string; items: string[]; hrefs: string[] }) {
  return (
    <div>
      <p className="eyebrow text-white">{title}</p>
      {/* El relleno vertical va en el enlace y el hueco se reduce en la misma
          medida: el objetivo táctil llega a 24px (WCAG 2.5.8) sin que cambie
          el ritmo de la columna. */}
      <ul className="mt-3 flex flex-col gap-0.5 text-label">
        {items.map((item, i) => (
          <li key={`${item}-${i}`}>
            <Link href={hrefs[i] ?? '#'} className="inline-block py-1 hover:text-white">
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
