// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// URL pública del sitio: la usan el canonical y las imágenes para compartir (og:image necesita URL absoluta).
// Orden: SITE_URL (defínela en el hosting) → URL del despliegue en Vercel o Netlify → dominio final.
// (process vía globalThis: el proyecto no instala @types/node y este archivo usa @ts-check)
/** @type {Record<string, string | undefined>} */
const env = /** @type {any} */ (globalThis).process?.env ?? {};
const vercel = env.VERCEL_ENV === 'production' ? env.VERCEL_PROJECT_PRODUCTION_URL : env.VERCEL_URL;
const site =
  env.SITE_URL ??
  (vercel ? `https://${vercel}` : undefined) ??
  (env.CONTEXT === 'production' ? env.URL : env.DEPLOY_PRIME_URL) ??
  'https://nexgenmultifamily.com';

// Keystatic (CMS del blog, /keystatic) solo en `astro dev`: en modo local escribe los Markdown de src/content/blog
// en el disco, y el build de producción sigue siendo 100% estático (sin adaptador). React solo lo usa su panel.
/** @type {string[]} */
const argv = /** @type {any} */ (globalThis).process?.argv ?? [];
const isDev = argv.includes('dev');

// https://astro.build/config
export default defineConfig({
  site,

  integrations: isDev ? [react(), keystatic()] : [],

  // Astro descarga la fuente, la sirve desde el propio sitio y genera un fallback
  // con métricas ajustadas para evitar el salto de fuente al cargar (FOUT/CLS).
  // Se usa en el layout con <Font cssVariable="--font-inter" preload />.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Hanken Grotesk',
      cssVariable: '--font-hanken',
      weights: ['400 800'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
  ],

  // Imágenes remotas que Astro puede descargar y optimizar al compilar (WebP + srcset)
  image: {
    domains: ['images.unsplash.com'],
  },

  vite: {
    plugins: [tailwindcss()],
    // Dependencias que Vite descubriría tarde en dev (Leaflet solo en /our-properties, el router de las view
    // transitions al navegar): al descubrirlas reoptimiza, sirve un 504 ("Outdated Optimize Dep") a los módulos ya
    // pedidos y la página se queda sin scripts (los reveals no aparecen). Pre-optimizarlas lo evita.
    optimizeDeps: {
      include: [
        'leaflet',
        'astro/virtual-modules/transitions-router.js',
        'astro/virtual-modules/transitions-events.js',
        'astro/virtual-modules/transitions-swap-functions.js',
        'astro/virtual-modules/transitions-types.js',
      ],
    },
  },
});
