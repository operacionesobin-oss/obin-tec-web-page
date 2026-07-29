'use client';

import { useId, useRef, useState } from 'react';
import type { Dictionary } from '@/lib/i18n';
import { ArrowRight } from './icons';

type Errors = { name?: string; email?: string };

export default function ContactForm({ dict }: { dict: Dictionary }) {
  const t = dict.pages.contacto;
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();

    /* La validación es propia porque el formulario lleva `noValidate`: sin
       esto, enviar en vacío mostraba el estado de éxito. El patrón del correo
       es deliberadamente laxo —basta con que sea plausible—, porque rechazar
       una dirección válida cuesta más que aceptar una con errata. */
    const next: Errors = {};
    if (!name) next.name = t.errorName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = t.errorEmail;

    setErrors(next);

    if (Object.keys(next).length > 0) {
      // El foco va al primer campo con problema: el mensaje no sirve de nada
      // si el usuario no sabe dónde está.
      const first = next.name ? 'name' : 'email';
      formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }

    // TODO (dev): conectar a tu backend / Cal.com / email. Por ahora feedback local.
    setSent(true);
  }

  const field = (invalid: boolean) =>
    [
      'mt-1.5 w-full rounded-[12px] border bg-surface-raised px-4 py-3 text-body text-content',
      'placeholder:text-content-muted',
      invalid ? 'border-danger' : 'border-line-strong focus:border-accent-ring',
    ].join(' ');

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-[16px] border border-accent/30 bg-accent-soft p-8 text-accent"
      >
        <p className="font-display text-subhead font-medium">¡Gracias! / Thank you!</p>
        <p className="mt-2 text-body text-content-secondary">
          Te contactaremos para agendar tu diagnóstico. / We&apos;ll reach out to schedule your diagnostic.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-meta font-medium text-content-secondary">
          {t.name}
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${id}-name` : undefined}
            className={field(!!errors.name)}
          />
          <FieldError id={`${id}-name`} message={errors.name} />
        </label>
        <label className="block text-meta font-medium text-content-secondary">
          {t.email}
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${id}-email` : undefined}
            className={field(!!errors.email)}
          />
          <FieldError id={`${id}-email`} message={errors.email} />
        </label>
      </div>
      <label className="block text-meta font-medium text-content-secondary">
        {t.company}
        <input name="company" type="text" autoComplete="organization" className={field(false)} />
      </label>
      <label className="block text-meta font-medium text-content-secondary">
        {t.message}
        <textarea name="message" rows={4} className={field(false)} />
      </label>
      <button type="submit" className="btn-primary mt-1 w-fit">
        {t.submit}
        <ArrowRight />
      </button>
    </form>
  );
}

// El mensaje nombra el problema y la salida, y se anuncia al aparecer.
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-meta font-normal text-danger">
      {message}
    </p>
  );
}
