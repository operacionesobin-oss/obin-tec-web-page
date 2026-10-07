import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary, isLocale, defaultLocale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/pageMeta';
import PageHeader from '@/components/PageHeader';
import CollaborationProgram from '@/components/CollaborationProgram';
import { ArrowRight } from '@/components/icons';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return buildMetadata(params.locale, 'colaboradores', '/casos/programa-colaboradores');
}

export default function ProgramaColaboradoresPage({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = getDictionary(locale);
  const t = dict.pages.casos.collaborationTeaser;

  return (
    <>
      <div className="container-obin pt-10">
        <Link
          href={`/${locale}/casos/`}
          className="inline-flex items-center gap-2 text-label font-medium text-content-muted transition-colors hover:text-accent"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          {t.back}
        </Link>
      </div>
      <PageHeader title={t.title} intro={t.description} />
      <div className="pt-12">
        <CollaborationProgram locale={locale} dict={dict} />
      </div>
    </>
  );
}
