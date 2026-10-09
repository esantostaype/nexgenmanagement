import { getLenis } from './smooth-scroll';

/**
 * Barras de scroll superpuestas (portadas de InnerView).
 * Las nativas se ocultan en global.css; aquí se dibuja un thumb fino sobre el borde de lo que
 * hace scroll, la página o cualquier contenedor anidado. Aparece al mover el puntero sobre un
 * elemento con scroll o mientras se desplaza, y se desvanece tras 1,5 s sin movimiento.
 * Pasar el puntero por encima o arrastrarlo lo mantiene visible.
 */

const MARGIN = 4; // px de aire en ambos extremos del recorrido
const MIN_THUMB = 28;
const HIDE_AFTER = 1500;

type Axis = 'y' | 'x';
type Bar = { thumb: HTMLDivElement; hideTimer: number | null; onThumb: boolean; dragging: boolean };
type Entry = { y: Bar; x: Bar };

const root = () => document.scrollingElement as HTMLElement;
const isRoot = (el: HTMLElement) => el === root();

function isScrollable(element: Element, axis: Axis): element is HTMLElement {
  if (!(element instanceof HTMLElement)) return false;
  if (isRoot(element)) {
    return axis === 'y'
      ? element.scrollHeight > window.innerHeight + 1
      : element.scrollWidth > window.innerWidth + 1;
  }
  const style = getComputedStyle(element);
  const overflow = axis === 'y' ? style.overflowY : style.overflowX;
  if (overflow !== 'auto' && overflow !== 'scroll') return false;
  return axis === 'y'
    ? element.scrollHeight > element.clientHeight + 1
    : element.scrollWidth > element.clientWidth + 1;
}

/** Caja relativa al viewport y medidas; el scroller de la página es el propio viewport. */
function metrics(element: HTMLElement, axis: Axis) {
  if (isRoot(element)) {
    return {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      size: axis === 'y' ? window.innerHeight : window.innerWidth,
      full: axis === 'y' ? element.scrollHeight : element.scrollWidth,
      offset: axis === 'y' ? window.scrollY : window.scrollX,
    };
  }
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left + element.clientLeft,
    top: rect.top + element.clientTop,
    width: element.clientWidth,
    height: element.clientHeight,
    size: axis === 'y' ? element.clientHeight : element.clientWidth,
    full: axis === 'y' ? element.scrollHeight : element.scrollWidth,
    offset: axis === 'y' ? element.scrollTop : element.scrollLeft,
  };
}

function scrollElementTo(element: HTMLElement, axis: Axis, target: number) {
  if (isRoot(element) && axis === 'y') {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { immediate: true });
    else window.scrollTo(window.scrollX, target);
    return;
  }
  if (axis === 'y') element.scrollTop = target;
  else element.scrollLeft = target;
}

export function initOverlayScrollbars(): () => void {
  const entries = new Map<HTMLElement, Entry>();
  let frame = 0;

  const makeBar = (axis: Axis): Bar => {
    const thumb = document.createElement('div');
    thumb.className = axis === 'y' ? 'scroll-thumb' : 'scroll-thumb scroll-thumb-x';
    thumb.setAttribute('aria-hidden', 'true');
    document.body.appendChild(thumb);
    return { thumb, hideTimer: null, onThumb: false, dragging: false };
  };

  const entryFor = (element: HTMLElement): Entry => {
    let entry = entries.get(element);
    if (!entry) {
      entry = { y: makeBar('y'), x: makeBar('x') };
      entries.set(element, entry);
      attachDrag(element, entry.y, 'y');
      attachDrag(element, entry.x, 'x');
    }
    return entry;
  };

  const place = (element: HTMLElement, bar: Bar, axis: Axis) => {
    const m = metrics(element, axis);
    if (m.full <= m.size + 1 || m.width === 0 || m.height === 0) {
      bar.thumb.classList.remove('is-visible');
      return;
    }
    const track = m.size - MARGIN * 2;
    const length = Math.max(MIN_THUMB, (m.size / m.full) * track);
    const travel = Math.max(0, track - length);
    const position = MARGIN + (m.offset / (m.full - m.size)) * travel;
    const style = bar.thumb.style;
    if (axis === 'y') {
      style.left = `${m.left + m.width - 7}px`;
      style.top = `${m.top + position}px`;
      style.height = `${length}px`;
    } else {
      style.top = `${m.top + m.height - 7}px`;
      style.left = `${m.left + position}px`;
      style.width = `${length}px`;
    }
  };

  // Mientras un thumb esté visible, sigue a su elemento (puede moverse o cambiar de tamaño).
  const tick = () => {
    frame = 0;
    let visible = false;
    for (const [element, entry] of entries) {
      if (!element.isConnected) {
        entry.y.thumb.remove();
        entry.x.thumb.remove();
        entries.delete(element);
        continue;
      }
      for (const axis of ['y', 'x'] as const) {
        if (entry[axis].thumb.classList.contains('is-visible')) {
          place(element, entry[axis], axis);
          visible = true;
        }
      }
    }
    if (visible) frame = requestAnimationFrame(tick);
  };
  const follow = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const show = (element: HTMLElement, axis: Axis) => {
    if (!isScrollable(element, axis)) return;
    const bar = entryFor(element)[axis];
    place(element, bar, axis);
    bar.thumb.classList.add('is-visible');
    if (bar.hideTimer) window.clearTimeout(bar.hideTimer);
    bar.hideTimer = window.setTimeout(() => {
      bar.hideTimer = null;
      if (!bar.dragging && !bar.onThumb) bar.thumb.classList.remove('is-visible');
    }, HIDE_AFTER);
    follow();
  };

  function attachDrag(element: HTMLElement, bar: Bar, axis: Axis) {
    bar.thumb.addEventListener('pointerenter', () => {
      bar.onThumb = true;
    });
    bar.thumb.addEventListener('pointerleave', () => {
      bar.onThumb = false;
      if (!bar.dragging) show(element, axis);
    });
    bar.thumb.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      bar.dragging = true;
      bar.thumb.classList.add('is-dragging');
      bar.thumb.setPointerCapture(event.pointerId);
      const start = axis === 'y' ? event.clientY : event.clientX;
      const m = metrics(element, axis);
      const startScroll = m.offset;
      const track = m.size - MARGIN * 2;
      const length = Math.max(MIN_THUMB, (m.size / m.full) * track);
      const travel = Math.max(1, track - length);
      const onMove = (move: PointerEvent) => {
        const delta = (axis === 'y' ? move.clientY : move.clientX) - start;
        const target = Math.max(0, Math.min(m.full - m.size, startScroll + (delta / travel) * (m.full - m.size)));
        scrollElementTo(element, axis, target);
      };
      const onUp = () => {
        bar.dragging = false;
        bar.thumb.classList.remove('is-dragging');
        bar.thumb.removeEventListener('pointermove', onMove);
        bar.thumb.removeEventListener('pointerup', onUp);
        bar.thumb.removeEventListener('pointercancel', onUp);
        show(element, axis);
      };
      bar.thumb.addEventListener('pointermove', onMove);
      bar.thumb.addEventListener('pointerup', onUp);
      bar.thumb.addEventListener('pointercancel', onUp);
    });
  }

  // Todo lo que hace scroll muestra su thumb (scroll no burbujea: fase de captura).
  const onScroll = (event: Event) => {
    const target = event.target === document ? root() : event.target;
    if (!(target instanceof HTMLElement)) return;
    show(target, 'y');
    show(target, 'x');
  };

  // Mover el puntero sobre un elemento con scroll (y sus ancestros, la página incluida) muestra
  // sus thumbs. Limitado a una comprobación cada 60 ms, más una final.
  let pointer: { x: number; y: number } | null = null;
  let lastCheck = 0;
  let trailing = 0;
  const checkPointer = () => {
    lastCheck = Date.now();
    if (!pointer) return;
    let node: Element | null = document.elementFromPoint(pointer.x, pointer.y);
    while (node) {
      show(node as HTMLElement, 'y');
      show(node as HTMLElement, 'x');
      node = node.parentElement;
    }
  };
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    pointer = { x: event.clientX, y: event.clientY };
    const wait = 60 - (Date.now() - lastCheck);
    if (wait <= 0) checkPointer();
    else if (!trailing)
      trailing = window.setTimeout(() => {
        trailing = 0;
        checkPointer();
      }, wait);
  };
  const onLeaveWindow = () => {
    pointer = null;
  };

  document.addEventListener('scroll', onScroll, { capture: true, passive: true });
  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeaveWindow);

  return () => {
    document.removeEventListener('scroll', onScroll, { capture: true });
    document.removeEventListener('pointermove', onPointerMove);
    document.documentElement.removeEventListener('pointerleave', onLeaveWindow);
    if (frame) cancelAnimationFrame(frame);
    if (trailing) window.clearTimeout(trailing);
    for (const entry of entries.values()) {
      for (const bar of [entry.y, entry.x]) {
        if (bar.hideTimer) window.clearTimeout(bar.hideTimer);
        bar.thumb.remove();
      }
    }
    entries.clear();
  };
}
