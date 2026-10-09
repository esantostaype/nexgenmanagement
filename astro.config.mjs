// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

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

// https://astro.build/config
export default defineConfig({
  site,

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
    // Leaflet solo se carga en /our-properties: si Vite lo descubre tarde en dev, sirve un 504
    // ("Outdated Optimize Dep") y el mapa no monta. Pre-optimizarlo lo evita.
    optimizeDeps: { include: ['leaflet'] },
  },
});
