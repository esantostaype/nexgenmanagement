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
    prevent: (node) => scrollsOnItsOwn(node),
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(update);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/**
 * Smooth scroll propio para un contenedor con scroll (p. ej. un modal), con la misma curva que la página. Solo si la
 * página tiene Lenis (escritorio con ratón, sin reduced motion). Devuelve la función que lo destruye.
 */
export function smoothScrollIn(wrapper: HTMLElement): () => void {
  if (!matchMedia(SMOOTH_SCROLL_MEDIA).matches) return () => {};
  const inner = new Lenis({
    wrapper,
    content: wrapper,
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  const tick = (time: number) => inner.raf(time * 1000);
  gsap.ticker.add(tick);
  return () => {
    gsap.ticker.remove(tick);
    inner.destroy();
  };
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

/**
 * Enlaces a anclas de la misma página (#seccion). Un solo manejador, en fase de captura: si los atendieran a la vez
 * <ClientRouter /> (que salta al ancla) y Lenis (que vuelve a su posición guardada), el scroll apenas se mueve.
 * Con Lenis activo desplaza con su curva; sin él (táctil, reduced motion), scroll nativo suave. Deja el mismo hueco
 * que el navegador al cargar una URL con #ancla: scroll-padding-top de <html> (72px, el header) + scroll-margin-top
 * del destino (p. ej. scroll-mt-22 para dejar sitio además a un menú fijo).
 */
export function initAnchorLinks() {
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href*="#"]');
    if (!link || link.target === '_blank') return;
    const url = new URL(link.href, location.href);
    if (url.pathname !== location.pathname || url.origin !== location.origin || !url.hash) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;

    e.preventDefault();
    e.stopPropagation();
    // Igual que el navegador al cargar una URL con #ancla: scroll-padding-top de <html> + scroll-margin-top del destino
    const margin = (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || -ANCHOR_OFFSET) + (parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
    // Posición absoluta con el scroll real de la ventana (Lenis, con un elemento, usa su posición interna)
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - margin);
    if (lenis) lenis.scrollTo(top);
    else window.scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    history.replaceState(history.state, '', url.hash);
  };
  document.addEventListener('click', onClick, true);
  return () => document.removeEventListener('click', onClick, true);
}
