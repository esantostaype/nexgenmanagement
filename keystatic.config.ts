// Keystatic: panel para escribir posts del blog en /keystatic (solo con `npm run dev`, ver astro.config.mjs).
// Modo local: lee y escribe los Markdown de src/content/blog, con el mismo frontmatter que valida
// src/content.config.ts. Las imágenes se guardan en src/assets/images/blog (se sirven como "/images/blog/…") y los
// PDF en public/newsletter. Para que el cliente publique desde producción, cambiar a `storage: { kind: 'github' }`.
import { collection, config, fields } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Nex-Gen' },
  },
  collections: {
    blog: collection({
      label: 'Blog posts',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Title' }, slug: { label: 'URL', description: 'Se usa en /blog/<url>' } }),
        date: fields.date({ label: 'Date', validation: { isRequired: true } }),
        dateLabel: fields.text({ label: 'Date label', description: 'Opcional: texto a mostrar si no hay día exacto (p. ej. "2024")' }),
        category: fields.text({ label: 'Category', validation: { isRequired: true } }),
        excerpt: fields.text({ label: 'Excerpt', multiline: true, validation: { isRequired: true } }),
        image: fields.image({
          label: 'Cover image',
          directory: 'src/assets/images/blog',
          publicPath: '/images/blog/',
          validation: { isRequired: true },
        }),
        imageAlt: fields.text({ label: 'Cover image alt text', validation: { isRequired: true } }),
        source: fields.object(
          {
            name: fields.text({ label: 'Source name' }),
            url: fields.url({ label: 'Source URL' }),
          },
          { label: 'Source', description: 'Solo si el post resume un artículo de otro medio' },
        ),
        downloads: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.file({ label: 'File', directory: 'public/newsletter', publicPath: '/newsletter/' }),
          }),
          { label: 'Downloads', itemLabel: (props) => props.fields.label.value || 'File' },
        ),
        draft: fields.checkbox({ label: 'Draft', description: 'No se publica mientras esté marcado' }),
        content: fields.markdoc({ label: 'Content', extension: 'md' }),
      },
    }),
  },
});
