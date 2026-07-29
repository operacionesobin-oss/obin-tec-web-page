import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-obin flex min-h-[50vh] flex-col items-start justify-center py-24">
      <p className="font-mono text-meta text-accent">404</p>
      <h1 className="mt-3">Página no encontrada</h1>
      <p className="mt-4 max-w-[520px] text-lead text-content-secondary">
        La ruta que buscas no existe o fue movida. / The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/es" className="btn-primary mt-8">
        Volver al inicio
      </Link>
    </section>
  );
}
