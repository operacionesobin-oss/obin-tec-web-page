import type { Metadata } from 'next';
import { getDictionary, isLocale, defaultLocale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/pageMeta';
import PageHeader from '@/components/PageHeader';
import ContactForm from '@/components/ContactForm';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return buildMetadata(params.locale, 'contacto', '/contacto');
}

export default function ContactoPage({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = getDictionary(locale);
  const p = dict.pages.contacto;

  return (
    <>
      <PageHeader title={p.title} intro={p.intro} />
      <section className="container-obin max-w-[640px] pb-24">
        <ContactForm dict={dict} />
      </section>
    </>
  );
}
