import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

let lenis: Lenis | null = null;

const update = (time: number) => lenis?.raf(time * 1000);

/**
 * Smooth scroll solo en escritorio con puntero fino. En táctil se mantiene el scroll
 * nativo con su inercia, y con prefers-reduced-motion no se activa.
 */
const SMOOTH_SCROLL_MEDIA = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/** Altura del header fijo: los anclas (#seccion) se detienen debajo de él. */
const ANCHOR_OFFSET = -72;

/** Los contenedores con scroll propio (modales, listas, selects) siguen con scroll nativo. */
function scrollsOnItsOwn(node: HTMLElement): boolean {
  if (node === document.documentElement || node === document.body) return false;
  const style = getComputedStyle(node);
  const scrollsY =
    (style.overflowY === 'auto' || style.overflowY === 'scroll') && node.scrollHeight > node.clientHeight + 1;
  const scrollsX =
    (style.overflowX === 'auto' || style.overflowX === 'scroll') && node.scrollWidth > node.clientWidth + 1;
  return scrollsY || scrollsX;
}

/** Lenis conectado al ticker de GSAP para que ScrollTrigger y el smooth scroll usen el mismo frame. */
export function initSmoothScroll() {
  if (!matchMedia(SMOOTH_SCROLL_MEDIA).matches) return null;

  lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    anchors: { offset: ANCHOR_OFFSET },
    prevent: (node) => scrollsOnItsOwn(node),
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(update);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function destroySmoothScroll() {
  gsap.ticker.remove(update);
  lenis?.destroy();
  lenis = null;
}

export const getLenis = () => lenis;

/** Bloquea el scroll de la página (menú móvil, modal) y lo recupera al cerrar. */
export function lockScroll(locked: boolean) {
  document.documentElement.classList.toggle('scroll-locked', locked);
  if (locked) lenis?.stop();
  else lenis?.start();
}
