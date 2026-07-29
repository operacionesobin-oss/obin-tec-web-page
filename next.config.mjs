/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /* Export estático: el sitio se sirve como HTML plano desde Hostinger, sin
     proceso de Node. Todas las páginas ya eran SSG, así que no se pierde nada
     salvo el middleware, cuya redirección de idioma pasa al .htaccess. */
  output: 'export',
  // Sin servidor no hay optimizador de imágenes en tiempo de petición.
  images: { unoptimized: true },
  /* Genera `es/servicios/index.html` en vez de `es/servicios.html`, que es lo
     que Apache/LiteSpeed resuelve sin reglas adicionales. */
  trailingSlash: true,
};

export default nextConfig;
