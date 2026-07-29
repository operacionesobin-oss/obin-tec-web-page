# OBIN Tec — Sitio web

Sitio de marketing de **OBIN (Open Business Intelligence)**: consultoría y tecnología para PYMES en LATAM. Next.js (App Router) + Tailwind CSS, **bilingüe ES/EN**, con SEO, rendimiento y accesibilidad integrados.

## Requisitos

- Node.js 18.18+ (recomendado 20)
- npm

## Arranque

```bash
npm install
npm run dev      # http://localhost:3000  → redirige a /es
```

Otras rutas: `/en`, `/es/servicios`, `/es/plataforma`, `/es/casos`, `/es/nosotros`, `/es/contacto`, `/es/blog`.

```bash
npm run build && npm run start   # producción
```

## Estructura

```
content/es.json · content/en.json    → TODO el copy (edita texto aquí, sin tocar componentes)
src/lib/i18n.ts                       → carga de diccionarios y locales
src/lib/pageMeta.ts                   → metadata SEO (title/description/canonical/hreflang) por página
middleware.ts                         → redirige a /es o /en según navegador
src/app/[locale]/layout.tsx           → <html lang>, fuentes, Nav, Footer, JSON-LD Organization
src/app/[locale]/page.tsx             → Home (Hero → Servicios → Proceso → Testimonio → CTA)
src/app/[locale]/servicios|plataforma|casos|nosotros|contacto|blog|login
src/app/[locale]/legal/[slug]         → privacidad · términos · seguridad
src/app/sitemap.ts · robots.ts        → SEO técnico
src/components/                       → Nav, Hero, Services, Process, Testimonial, CTABand, Footer, ContactForm, LangSwitcher, icons
tailwind.config.ts                    → tokens de marca (obin-blue-*, ink-*, fuentes)
```

## Sistema de diseño

Colores, tipografía y componentes salen del kit oficial de OBIN. El azul de marca es `#253981` (`obin-blue-800`). Fuentes: Space Grotesk (display), Inter (body), Space Mono (mono), self-hosted vía `next/font`.

## Personalizar

- **Textos:** `content/es.json` y `content/en.json`.
- **Colores/tipografía:** `tailwind.config.ts`.
- **Dominio/SEO:** cambia `SITE_URL` en `layout.tsx`, `sitemap.ts` y `robots.ts`.
- **Imagen social:** coloca `public/og.png` (1200×630).
- **Formulario de contacto:** conecta `src/components/ContactForm.tsx` a tu backend, email o Cal.com/Calendly.

## Pendientes de infraestructura (fuera del código)

- Desplegar en Vercel + dominio (fase 8 del dashboard de Notion).
- Medir Core Web Vitals con Lighthouse tras el deploy.
- Añadir favicon y og.png reales.

Guía completa de tareas y criterios de aceptación: **Dashboard de Notion "OBIN Tec · Dashboard de Desarrollo Web"**.
