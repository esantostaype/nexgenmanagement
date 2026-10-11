/**
 * Aparecer y desaparecer con Motion: nada se muestra ni se oculta de golpe (regla del proyecto).
 *
 * - appear(el): quita `hidden` y entra con fundido + un leve desplazamiento hacia arriba. Con `{ height: true }`
 *   además crece desde 0 hasta su alto (mensajes y campos dentro de un flujo, para que lo de abajo no salte).
 * - disappear(el): sale con la animación inversa y al terminar pone `hidden`.
 * - toggle(el, show): uno u otro según `show`; no hace nada si ya está en ese estado.
 * - swapText(el, text): cambia el texto con un fundido corto (mensajes de estado).
 *
 * Con prefers-reduced-motion, solo fundido muy corto. Usa `hidden` (no clases) para que el CSS no dependa del JS.
 */
import { animate } from 'motion';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN = [0.7, 0, 0.84, 0] as const;

type Options = { height?: boolean; y?: number; duration?: number };

/** Animaciones en curso por elemento: una nueva cancela la anterior (p. ej. aparecer mientras desaparecía) */
const running = new WeakMap<Element, { stop: () => void }>();
const track = (el: Element, controls: { stop: () => void; finished: Promise<unknown> }) => {
  running.get(el)?.stop();
  running.set(el, controls);
  return controls.finished;
};

export function appear(el: HTMLElement | null | undefined, { height = false, y = 6, duration = 0.32 }: Options = {}) {
  if (!el) return Promise.resolve();
  const wasHidden = el.hidden || el.classList.contains('hidden');
  el.hidden = false;
  el.classList.remove('hidden');
  if (!wasHidden && !running.has(el)) return Promise.resolve();
  if (reduced()) return track(el, animate(el, { opacity: [0, 1] }, { duration: 0.15 }));

  if (height) {
    el.style.overflow = 'hidden';
    const target = el.scrollHeight;
    return track(el, animate(el, { opacity: [0, 1], y: [y, 0], height: [0, target] }, { duration, ease: EASE_OUT })).then(() => {
      el.style.height = '';
      el.style.overflow = '';
    });
  }
  return track(el, animate(el, { opacity: [0, 1], y: [y, 0] }, { duration, ease: EASE_OUT }));
}

export function disappear(el: HTMLElement | null | undefined, { height = false, y = 4, duration = 0.2 }: Options = {}) {
  if (!el || el.hidden || el.classList.contains('hidden')) return Promise.resolve();
  const done = () => {
    el.hidden = true;
    el.style.opacity = '';
    el.style.transform = '';
    el.style.height = '';
    el.style.overflow = '';
    running.delete(el);
  };
  if (reduced()) return track(el, animate(el, { opacity: 0 }, { duration: 0.12 })).then(done);
  if (height) {
    el.style.overflow = 'hidden';
    return track(el, animate(el, { opacity: 0, y, height: [el.offsetHeight, 0] }, { duration, ease: EASE_IN })).then(done);
  }
  return track(el, animate(el, { opacity: 0, y }, { duration, ease: EASE_IN })).then(done);
}

export function toggle(el: HTMLElement | null | undefined, show: boolean, options?: Options) {
  return show ? appear(el, options) : disappear(el, options);
}

/** Cambia el texto de un mensaje con un fundido (si estaba vacío, aparece; si queda vacío, se desvanece) */
export async function swapText(el: HTMLElement | null | undefined, text: string) {
  if (!el || el.textContent === text) return;
  if (reduced()) {
    el.textContent = text;
    return;
  }
  if (el.textContent) await track(el, animate(el, { opacity: 0, y: -3 }, { duration: 0.12, ease: EASE_IN }));
  el.textContent = text;
  if (text) await track(el, animate(el, { opacity: [0, 1], y: [4, 0] }, { duration: 0.28, ease: EASE_OUT }));
}

/** Lista que se filtra: oculta con fundido las que salen y hace entrar en cascada las que aparecen */
export function filterList(items: HTMLElement[], isShown: (el: HTMLElement) => boolean) {
  const entering: HTMLElement[] = [];
  items.forEach((el) => {
    const show = isShown(el);
    if (show && el.hidden) {
      entering.push(el);
      if (!reduced()) el.style.opacity = '0'; // invisible hasta que empiece su entrada
    }
    if (!show) disappear(el, { duration: 0.15 });
    else el.hidden = false;
  });
  if (!reduced() && entering.length) {
    animate(entering.slice(0, 16), { opacity: [0, 1], y: [10, 0] }, { duration: 0.4, delay: (i) => 0.12 + i * 0.03, ease: EASE_OUT });
    entering.slice(16).forEach((el) => animate(el, { opacity: [0, 1] }, { duration: 0.3, delay: 0.3 }));
  }
}
