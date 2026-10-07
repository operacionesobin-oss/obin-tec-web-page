/* Perfiles públicos de OBIN. Fuente única: los usan el pie de página y el
   `sameAs` del JSON-LD de Organization, que es lo que permite a los buscadores
   asociar los perfiles con la empresa. */
// Enlace corto de WhatsApp Business: abre la conversación con el mensaje
// predefinido de la cuenta. También es el destino de los llamados a la acción.
export const whatsappUrl = 'https://wa.me/message/5OHEUBLLDTBIN1';

export const social = [
  {
    id: 'whatsapp',
    href: whatsappUrl,
  },
  {
    id: 'instagram',
    href: 'https://www.instagram.com/obintechags/',
  },
  {
    id: 'facebook',
    href: 'https://www.facebook.com/profile.php?id=61577517096488',
  },
] as const;

export type SocialId = (typeof social)[number]['id'];
