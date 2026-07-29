import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';

/* Sirve `out/` reproduciendo lo que hacen Apache y el .htaccess en Hostinger:
   redirección de idioma, index de directorio y ErrorDocument 404. Probar
   contra `next start` daría un falso verde — ese servidor no es el que va a
   estar en producción. */

const ROOT = new URL('../out/', import.meta.url).pathname;
const PORT = Number(process.argv[2] ?? 3100);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const readIfFile = async (path) => {
  try {
    const s = await stat(path);
    return s.isFile() ? readFile(path) : null;
  } catch {
    return null;
  }
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = decodeURIComponent(url.pathname);

  // Evita salir de la raíz con ../
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '');

  const redirect = (to) => {
    res.writeHead(302, { Location: to });
    res.end();
  };

  // ── Idioma: la raíz sigue al Accept-Language ──────────────────────────
  if (safe === '/') {
    const accept = (req.headers['accept-language'] ?? '').toLowerCase();
    return redirect(accept.startsWith('en') ? '/en/' : '/es/');
  }

  // ── Rutas sin locale ──────────────────────────────────────────────────
  const hasLocale = /^\/(es|en)(\/|$)/.test(safe);
  const isAsset = safe.startsWith('/_next/') || extname(safe) !== '';
  if (!hasLocale && !isAsset) {
    const direct = await readIfFile(join(ROOT, safe));
    // Con barra final, para no encadenar una segunda redirección.
    if (!direct) return redirect(`/es${safe.replace(/\/$/, '')}/`);
  }

  // ── Fichero, luego index de directorio ────────────────────────────────
  let body = await readIfFile(join(ROOT, safe));
  let ext = extname(safe);

  if (!body) {
    body = await readIfFile(join(ROOT, safe, 'index.html'));
    ext = '.html';
  }

  if (!body) {
    // ErrorDocument 404 /404.html
    const notFound = await readIfFile(join(ROOT, '404.html'));
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    return res.end(notFound ?? 'Not found');
  }

  res.writeHead(200, { 'Content-Type': TYPES[ext] ?? 'application/octet-stream' });
  res.end(body);
});

server.listen(PORT, () => {
  console.log(`Sirviendo out/ en http://localhost:${PORT}`);
});
