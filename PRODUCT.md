# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: the owner or founder of a LATAM PYME**, running a business that has outgrown its tools. They personally feel the operational disorder — five disconnected spreadsheets, numbers that don't reconcile, decisions made on stale data — and they control the budget. They are **not technical**. They will not evaluate ERPNext on feature parity; they evaluate whether OBIN looks like it can be trusted to take the chaos away without breaking the business.

They arrive skeptical of software vendors, likely burned by a prior tool that promised order and delivered another silo. They decide relatively fast once trust exists, but trust is the whole gate.

A finance or ops lead may read the site alongside them, but the site is not written for that reader first.

## Product Purpose

OBIN (Open Business Intelligence) is a consultancy that gives a PYME **one source of truth for its operation**. It implements ERPNext, replaces spreadsheet workflows with traceable ones, and connects AI agents on top of the resulting data.

The site's job is singular: **get the right owner to book a 30-minute diagnostic call.** Every other outcome — reading a case, understanding the platform, reaching the blog — is instrumental to that one. Success is qualified diagnostics booked, not traffic.

## Positioning

Consultancy plus technology on **open technology** — ERPNext rather than licensed suites. The claim a neighboring firm can't truthfully copy is the combination: open ERP as the backbone, AI agents connected on top of it, delivered as a hands-on implementation with data migration and per-area training, by a team operating in LATAM.

The pitch is deliberately not "software." It is **regaining control of the operation**. Positioning language in the existing copy — "una sola fuente de verdad," "sistemas reales," "orden, estructura y escalabilidad" — is the established frame.

## Operating Context

- Bilingual **ES / EN**; Spanish is the default locale and the primary market is LATAM. Locale is auto-detected by middleware and redirected to `/es` or `/en`.
- All user-facing copy lives in `content/es.json` and `content/en.json`. Components read from dictionaries — copy changes must not be hardcoded into components, and **every copy change must be made in both locale files**.
- Routes: home, `servicios`, `plataforma`, `casos`, `nosotros`, `contacto`, `blog`, `login`, and `legal/[slug]` (privacidad · términos · seguridad).
- The evaluation scene is a business owner on a phone or laptop between operational fires, reading Spanish, giving the page a short and impatient first pass.

## Capabilities and Constraints

- **Next.js 14 (App Router) + Tailwind CSS + TypeScript.** No component library, no animation library, no CMS. Content is flat JSON.
- SEO is wired: per-page metadata with canonical and hreflang via `src/lib/pageMeta.ts`, plus `sitemap.ts`, `robots.ts`, and Organization JSON-LD in the layout.
- **The contact form is not connected to anything.** `src/components/ContactForm.tsx` has no backend; submissions are currently lost. This is a known gap, not a feature.
- **The intended conversion is a booked call** (Cal.com / Calendly or equivalent), not an email form. The current form is a stand-in for booking.
- **`/login` is a placeholder.** No client portal exists behind it.
- **`/blog` is scaffolding.** No articles are written.
- Deployment (Vercel + domain) is pending and outside the codebase.

### Undecided

- The booking mechanism (Cal.com vs Calendly vs custom) is not chosen.
- Whether a client portal will exist at all is not decided.

## Brand Commitments

- Name: **OBIN** / OBIN Tec — Open Business Intelligence.
- **The official OBIN design kit is fully binding.** Brand blue `#253981` (`obin-blue-800`), the `obin-blue` and `ink` scales, and the typefaces **Space Grotesk** (display), **Inter** (body), **Space Mono** (mono), self-hosted via `next/font`. Tokens live in `tailwind.config.ts`; the upstream source of truth is the "🎨 Sistema de Diseño OBIN" document. Future design work builds **within** these, not around them.
- Voice in the existing Spanish copy is direct, concrete, and unhyped — short declaratives, operational nouns, no vendor enthusiasm. "OBIN no vende software." Treat this register as established.
- Signature line: "hecho con precisión en LATAM."

## Evidence on Hand

**There is currently no real public proof. This is the single most important constraint on this project.**

- The hero stats — "40+ PYMES implementadas," "~6 sem. tiempo promedio al go-live," "100% sobre tecnología abierta" — are **placeholder and fabricated**. They must not be presented as fact, cited, reused, or replaced with other invented numbers.
- The testimonial attributed to **Mariana Restrepo, CFO · Distribuidora Andina** is **placeholder and fabricated**, including the company. It currently appears on both the home page and `/casos`.
- `/casos` therefore has **no real case studies** — it renders a page header, the fabricated testimonial, and a CTA.
- No logos, screenshots, product imagery, favicon, or `public/og.png` exist. `public/` contains only a README.

Any future work must either source real evidence from the user or **design credibility without claiming proof** — demonstrating competence through specificity of process, clarity about method, and visible rigor rather than through numbers or names.

## Product Principles

1. **One conversion.** Everything on the site serves the booked 30-minute diagnostic. Ambiguity about what to do next is the failure mode.
2. **Trust before capability.** A non-technical owner buys the firm, not the feature list. Legibility, specificity, and evident rigor outrank completeness.
3. **Never fabricate proof.** No invented metrics, clients, logos, or testimonials. Where proof is absent, show method instead — and say so plainly rather than filling the space.
4. **Spanish first, both locales always.** ES is the primary market and the primary reading; EN must stay in exact parity, never an afterthought or a machine echo.
5. **Concrete over aspirational.** The voice names real operational objects — spreadsheets, reconciliations, approvals, inventory, cartera — rather than transformation language.

## Accessibility & Inclusion

No formal standard has been established by the user. The site's own README states accessibility is an intended pillar; treat WCAG AA contrast and full keyboard operability as the working floor until the user sets otherwise. Bilingual correctness (`<html lang>`, hreflang) is already implemented and must be preserved.
