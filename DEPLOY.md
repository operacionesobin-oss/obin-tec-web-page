# Despliegue en Hostinger

El sitio se compila a HTML estático (`output: 'export'`). No hay proceso de
Node en el servidor: Hostinger sólo sirve ficheros, y las redirecciones las
resuelve Apache con el `.htaccess`.

## Publicar

```bash
npm run build     # genera out/
```

Sube **el contenido de `out/`** —no la carpeta— a `public_html/` en el
Administrador de archivos de hPanel, o por FTP/SFTP.

Comprueba que `.htaccess` llegó: el gestor de archivos oculta los ficheros que
empiezan por punto hasta que activas «mostrar archivos ocultos». Sin él, la
raíz del dominio no redirige y los 404 salen sin estilo.

## Qué hace el `.htaccess`

| Regla | Motivo |
|---|---|
| `/` → `/es/` o `/en/` | Sustituye al middleware, que no existe en un export estático. Lee `Accept-Language`. |
| `/servicios` → `/es/servicios/` | Rutas sin idioma caen al español, en un solo salto. |
| Fuerza HTTPS | Hostinger emite el certificado; la redirección es nuestra. |
| `ErrorDocument 404` | Sirve `404.html`, bilingüe y con los dos temas. |
| Caché de `/_next/` a un año | Los assets llevan hash en el nombre: son inmutables. El HTML no se cachea. |

La redirección de idioma es **302, no 301**: depende del visitante y no debe
quedar fijada en su caché.

## Dominio y correo

1. **Dominio** — Premium incluye uno gratis el primer año. Si ya tienes
   `obin.tech` en otro registrador, apunta los DNS a Hostinger.
2. **Correo** — crea `contacto@obin.tech` en hPanel › Emails. Premium trae
   2 buzones.
3. Tras conectar el dominio, activa **SSL gratuito** en hPanel. La regla de
   HTTPS del `.htaccess` no sirve de nada hasta que el certificado exista.

## Antes de dar por publicado

```bash
npm test          # compila y corre 97 pruebas contra el export
npm run preview   # sirve out/ en localhost:3100 con las reglas del .htaccess
```

`npm run preview` levanta un servidor que imita a Apache (redirección de
idioma, índices de directorio, 404). Es lo más cerca de producción que se
puede estar sin subir nada.

## Comprobaciones en producción

- `https://obin.tech` redirige a `/es/` (o `/en/` con el navegador en inglés).
- `https://obin.tech/servicios` cae en `/es/servicios/`.
- Una URL inventada devuelve el 404 con estilo, **y código 404**.
- `https://obin.tech/sitemap.xml` responde y sus URLs terminan en barra.
- El conmutador de tema persiste al recargar.

## Pendiente, fuera del código

- El formulario de contacto **no envía nada** (`src/components/ContactForm.tsx`).
  Valida y da acuse en pantalla, pero no hay backend. Hay que conectarlo a
  Cal.com, a un formulario de Hostinger o a un servicio de correo.
- No existen `public/og.png` ni favicon.
