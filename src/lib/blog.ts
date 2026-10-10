// Utilidades del blog (colección `blog`, ver src/content.config.ts).
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Posts publicados, del más reciente al más antiguo */
export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const postUrl = (post: Post) => `/blog/${post.id}`;

/** "Oct 01, 2024" (o el texto de dateLabel si el post no tiene día exacto) */
export const postDate = (post: Post) =>
  post.data.dateLabel ?? post.data.date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC' });

/** Día y mes para DateBadge */
export const postBadge = (post: Post) =>
  post.data.dateLabel
    ? { day: post.data.dateLabel, month: 'Year' }
    : {
        day: String(post.data.date.getUTCDate()).padStart(2, '0'),
        month: post.data.date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
      };

/** Minutos de lectura (200 palabras por minuto, mínimo 1) */
export const readingTime = (post: Post) => Math.max(1, Math.round((post.body ?? '').split(/\s+/).filter(Boolean).length / 200));
