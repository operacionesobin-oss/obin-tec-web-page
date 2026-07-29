import { isLocale, defaultLocale } from '@/lib/i18n';
import PageHeader from '@/components/PageHeader';

export const metadata = { title: 'Iniciar sesión · OBIN', robots: { index: false } };

export default function LoginPage({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const es = locale === 'es';
  return (
    <PageHeader
      title={es ? 'Iniciar sesión' : 'Log in'}
      intro={es ? 'El portal de clientes estará disponible pronto.' : 'The client portal will be available soon.'}
    />
  );
}
