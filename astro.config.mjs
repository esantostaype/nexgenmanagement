// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Cambia esto por el dominio real (lo usan el canonical y el sitemap)
  site: 'https://nexgenmultifamily.com',

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
