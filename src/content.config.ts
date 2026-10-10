// Colecciones de contenido. Blog: un Markdown por post en src/content/blog (el nombre del archivo es la URL:
// /blog/<archivo>). La portada de cada post va en src/assets/images/blog/<archivo>/ ("/images/blog/<archivo>/…"),
// la carpeta que usa Keystatic; los PDF, en public/newsletter/<archivo>/.
// Se editan desde Keystatic (/keystatic en dev, keystatic.config.ts): los campos vacíos que escribe se normalizan aquí.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    /** Texto de fecha si no hay día exacto (p. ej. "2024"); la fecha se usa solo para ordenar */
    dateLabel: z
      .string()
      .optional()
      .transform((v) => v || undefined),
    category: z.string(),
    excerpt: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    /** Artículo de otro medio: el post lo resume y cita la fuente */
    source: z
      .object({ name: z.string().optional(), url: z.string().nullish() })
      .optional()
      .transform((s) => (s?.name ? { name: s.name, url: s.url || undefined } : undefined)),
    /** Documentos descargables (p. ej. boletines en PDF) */
    downloads: z
      .array(z.object({ label: z.string(), href: z.string().nullish() }))
      .optional()
      .transform((d) => d?.filter((x): x is { label: string; href: string } => !!x.href)),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
