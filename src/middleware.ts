import { NextRequest, NextResponse } from 'next/server';

const locales = ['es', 'en'];
const defaultLocale = 'es';

// Redirige "/" y rutas sin locale al idioma por defecto (o al preferido del navegador).
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return NextResponse.next();

  // Detecta idioma preferido del navegador; si no, usa el default.
  const accept = request.headers.get('accept-language') ?? '';
  const preferred = accept.toLowerCase().startsWith('en') ? 'en' : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferred}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Excluye archivos estáticos y API.
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
