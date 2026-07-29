import { isLocale, defaultLocale } from '@/lib/i18n';
import PageHeader from '@/components/PageHeader';

export const metadata = { title: 'Blog · OBIN' };

export default function BlogPage({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const es = locale === 'es';
  return (
    <>
      <PageHeader
        title="Blog"
        intro={es ? 'Ideas sobre ERP, automatización e IA para PYMES. Próximamente.' : 'Ideas on ERP, automation and AI for SMBs. Coming soon.'}
      />
      <section className="container-obin pb-24">
        <div className="rounded-[16px] border border-dashed border-line-strong p-10 text-center text-content-muted">
          {es ? 'Aún no hay artículos publicados.' : 'No articles published yet.'}
        </div>
      </section>
    </>
  );
}
