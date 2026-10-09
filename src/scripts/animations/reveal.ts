import { animate, inView, stagger } from 'motion';

type Variant = 'fade' | 'fade-up' | 'fade-down' | 'from-left' | 'scale' | 'blur';

const variants: Record<Variant, Record<string, [string | number, string | number]>> = {
  fade: { opacity: [0, 1] },
  'fade-up': { opacity: [0, 1], y: [32, 0] },
  'fade-down': { opacity: [0, 1], y: [-32, 0] },
  // Botones y enlaces con flecha a la derecha: entran de izquierda a derecha
  'from-left': { opacity: [0, 1], x: [-32, 0] },
  scale: { opacity: [0, 1], scale: [0.94, 1] },
  blur: { opacity: [0, 1], filter: ['blur(12px)', 'blur(0px)'] },
};

const ease = [0.16, 1, 0.3, 1] as const;

const getVariant = (el: Element) =>
  variants[(el.getAttribute('data-reveal') as Variant) || 'fade-up'] ?? variants['fade-up'];

/**
 * Reveals declarativos con Motion:
 *   <h2 data-reveal>…</h2>                      → fade-up
 *   <p data-reveal="blur" data-delay="0.2">…</p>
 *   <a data-reveal="from-left">Botón →</a>             → entra de izquierda a derecha
 *   <ul data-reveal-stagger="scale"><li>…</li></ul>  → hijos en cascada
 */
export function initReveals(root: ParentNode = document) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const stops: VoidFunction[] = [];

  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    stops.push(
      inView(
        el,
        () => {
          animate(el, getVariant(el), {
            duration: 0.9,
            delay: Number(el.dataset.delay ?? 0),
            ease,
          });
        },
        { amount: 0.25 },
      ),
    );
  });

  root.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
    const variant =
      variants[(group.dataset.revealStagger as Variant) || 'fade-up'] ?? variants['fade-up'];

    stops.push(
      inView(
        group,
        () => {
          animate(Array.from(group.children), variant, {
            duration: 0.8,
            delay: stagger(Number(group.dataset.stagger ?? 0.08)),
            ease,
          });
        },
        { amount: 0.2 },
      ),
    );
  });

  return () => stops.forEach((stop) => stop());
}
