'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Dictionary, Locale } from '@/lib/i18n';
import { Logo, ArrowRight } from './icons';
import LangSwitcher from './LangSwitcher';
import ThemeToggle from './ThemeToggle';

export default function Nav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const t = dict.nav;
  const base = `/${locale}`;

  const links = [
    { href: `${base}/servicios`, label: t.servicios },
    { href: `${base}/plataforma`, label: t.plataforma },
    { href: `${base}/casos`, label: t.casos },
    { href: `${base}/nosotros`, label: t.nosotros },
    { href: `${base}/blog`, label: t.blog },
  ];

  return (
    <header className="sticky top-0 z-50 h-[72px] border-b border-line bg-surface/95 backdrop-blur">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-accent-btn focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Saltar al contenido
      </a>
      <nav className="container-obin flex h-full items-center gap-8" aria-label="Principal">
        <Link href={base} aria-label="OBIN — inicio" className="shrink-0 text-accent">
          <Logo className="h-9 w-auto" />
        </Link>

        <ul className="ml-2 hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-label font-medium text-content-secondary hover:text-accent">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <LangSwitcher locale={locale} />
          <ThemeToggle dict={dict} />
          <Link href={`${base}/login`} className="text-label font-medium text-content-secondary hover:text-accent">
            {t.login}
          </Link>
          <Link href={`${base}/contacto`} className="btn-primary !px-5 !py-2.5 !text-label">
            {t.cta}
            <ArrowRight />
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg text-content lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t.close : t.menu}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-surface lg:hidden">
          <ul className="container-obin flex flex-col gap-1 py-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-2.5 text-body font-medium text-content-secondary hover:bg-surface-sunken"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="mt-3 flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <LangSwitcher locale={locale} />
                <ThemeToggle dict={dict} />
              </div>
              <Link href={`${base}/contacto`} onClick={() => setOpen(false)} className="btn-primary !px-5 !py-2.5 !text-label">
                {t.cta}
                <ArrowRight />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
