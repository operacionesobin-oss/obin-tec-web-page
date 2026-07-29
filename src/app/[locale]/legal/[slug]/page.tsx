import { isLocale, defaultLocale } from '@/lib/i18n';
import PageHeader from '@/components/PageHeader';

const titles: Record<string, { es: string; en: string }> = {
  privacidad: { es: 'Aviso de privacidad', en: 'Privacy policy' },
  terminos: { es: 'Términos y condiciones', en: 'Terms and conditions' },
  seguridad: { es: 'Seguridad', en: 'Security' },
};

export function generateStaticParams() {
  return Object.keys(titles).map((slug) => ({ slug }));
}

export default function LegalPage({ params }: { params: { locale: string; slug: string } }) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const es = locale === 'es';
  const t = titles[params.slug] ?? { es: 'Legal', en: 'Legal' };
  return (
    <PageHeader
      title={es ? t.es : t.en}
      intro={es ? 'Contenido legal pendiente de redacción.' : 'Legal content to be drafted.'}
    />
  );
}
