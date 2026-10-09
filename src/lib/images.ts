import type { ImageMetadata } from 'astro';

/**
 * Imágenes locales optimizadas por Astro (src/assets/images). Los datos del sitio siguen usando
 * rutas "/images/…": este mapa las resuelve al módulo de imagen para que <Img> genere WebP y srcset.
 */
const modules = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/**/*.{webp,jpg,jpeg,png}', {
  eager: true,
});

export function localImage(path: string): ImageMetadata | undefined {
  const clean = path.split('?')[0];
  return modules[`/src/assets${clean}`]?.default;
}

export const isRemote = (src: string) => /^https?:\/\//.test(src);
