import { lockScroll, smoothScrollIn } from './smooth-scroll';

/**
 * Bloquea el scroll de la página (también Lenis) mientras haya un <dialog> modal abierto. Vale para cualquier
 * modal (Dialog de Starwind u otro <dialog> con showModal()): observa el atributo `open` de los <dialog>.
 * Cada modal abierto tiene además su propio smooth scroll (Lenis sobre el <dialog>), con la curva de la página.
 */
export function initDialogScrollLock() {
  let locked = false;
  const scrollers = new Map<HTMLElement, () => void>();
  const sync = () => {
    const open = new Set(document.querySelectorAll<HTMLDialogElement>('dialog[open]'));
    open.forEach((d) => {
      if (scrollers.has(d)) return;
      d.scrollTop = 0;
      scrollers.set(d, smoothScrollIn(d));
    });
    scrollers.forEach((destroy, d) => {
      if (open.has(d as HTMLDialogElement)) return;
      destroy();
      scrollers.delete(d);
    });

    const anyOpen = open.size > 0;
    if (anyOpen === locked) return;
    locked = anyOpen;
    lockScroll(anyOpen);
  };
  const observer = new MutationObserver(sync);
  observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
  sync();
  return () => {
    observer.disconnect();
    scrollers.forEach((destroy) => destroy());
    scrollers.clear();
    if (locked) lockScroll(false);
  };
}
