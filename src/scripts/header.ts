import { animate, inView } from 'motion';
import { lockScroll } from './animations/smooth-scroll';
import { onEveryPage } from './lifecycle';

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ Header */
function bindHeader() {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return () => {};

  const onScroll = () => header.toggleAttribute('data-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menú móvil a pantalla completa: el mismo botón del header lo abre y lo cierra (queda encima del panel)
  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = document.getElementById('mobile-menu');
  const subToggles = Array.from(panel?.querySelectorAll<HTMLButtonElement>('[data-submenu-toggle]') ?? []);
  const setSub = (btn: HTMLButtonElement, open: boolean) => {
    btn.setAttribute('aria-expanded', String(open));
    document.getElementById(btn.getAttribute('aria-controls') ?? '')?.setAttribute('data-open', String(open));
  };
  const isOpen = () => toggle?.getAttribute('aria-expanded') === 'true';
  const setOpen = (open: boolean, focus = true) => {
    toggle?.setAttribute('aria-expanded', String(open));
    toggle?.querySelector('.sr-only')?.replaceChildren(open ? 'Close menu' : 'Open menu');
    panel?.setAttribute('data-open', String(open));
    header.toggleAttribute('data-menu-open', open);
    lockScroll(open);
    if (!open) subToggles.forEach((b) => setSub(b, false));
    if (focus) toggle?.focus({ preventScroll: true });
  };
  const onToggle = () => setOpen(!isOpen());
  const onSub = (e: Event) => {
    const btn = e.currentTarget as HTMLButtonElement;
    setSub(btn, btn.getAttribute('aria-expanded') !== 'true');
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen()) setOpen(false);
  };
  const onLink = () => setOpen(false, false);

  toggle?.addEventListener('click', onToggle);
  subToggles.forEach((b) => b.addEventListener('click', onSub));
  // Enlaces y botones que llevan a otro sitio (p. ej. el CTA que abre el modal) cierran el menú
  panel?.querySelectorAll('a, [data-menu-dismiss]').forEach((a) => a.addEventListener('click', onLink));
  document.addEventListener('keydown', onKey);

  return () => {
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('keydown', onKey);
    toggle?.removeEventListener('click', onToggle);
    subToggles.forEach((b) => b.removeEventListener('click', onSub));
    setOpen(false, false);
  };
}

/* ------------------------------------------------------------------ CTA del header */
/**
 * "Get a proposal" aparece en el header solo cuando el botón del hero sale de la pantalla.
 * Motion anima el ancho de su contenedor (0 → ancho real), así el teléfono se desplaza a la izquierda.
 * En páginas sin botón en el hero, se muestra desde el principio.
 */
function bindHeaderCta() {
  const wrap = document.querySelector<HTMLElement>('[data-header-cta]');
  const link = wrap?.querySelector<HTMLElement>('[data-header-cta-link]');
  if (!wrap || !link) return () => {};

  const heroCta = document.querySelector<HTMLElement>('[data-hero-cta]');
  const inner = wrap.firstElementChild as HTMLElement;
  // Ancho real del botón + el padding izquierdo del contenedor; offsetWidth ignora las transformaciones de la animación
  const targetWidth = () => link.offsetWidth + (parseFloat(getComputedStyle(inner).paddingLeft) || 0);
  let visible = false;

  const set = (show: boolean, instant = false) => {
    if (show === visible && !instant) return;
    visible = show;
    wrap.setAttribute('aria-hidden', String(!show));
    link.tabIndex = show ? 0 : -1;
    const width = show ? targetWidth() : 0;

    if (instant || reducedMotion()) {
      wrap.style.width = `${width}px`;
      link.style.opacity = show ? '1' : '0';
      return;
    }
    animate(wrap, { width }, { type: 'spring', stiffness: 260, damping: 30 });
    animate(
      link,
      { opacity: show ? 1 : 0, x: show ? 0 : 16, scale: show ? 1 : 0.92 },
      { duration: show ? 0.45 : 0.25, delay: show ? 0.08 : 0, ease: [0.16, 1, 0.3, 1] },
    );
  };

  if (!heroCta) {
    set(true, true);
    return () => {};
  }

  link.style.opacity = '0';
  // Si la página se carga ya desplazada (botón del hero fuera de pantalla), muéstralo sin animar
  const r = heroCta.getBoundingClientRect();
  if (r.bottom < 0 || r.top > window.innerHeight) set(true, true);
  // inView: el callback corre al entrar; la función que devuelve, al salir
  const stop = inView(
    heroCta,
    () => {
      set(false);
      return () => set(true);
    },
    { amount: 0 },
  );

  // Si el viewport cambia de tamaño, recalcula el ancho del botón visible
  const onResize = () => {
    if (visible) wrap.style.width = `${targetWidth()}px`;
  };
  window.addEventListener('resize', onResize);

  return () => {
    stop();
    window.removeEventListener('resize', onResize);
  };
}

let bound = false;

/** Header: estado con scroll, menú móvil y aparición del CTA. Lo llama el <script> de organisms/Header.astro. */
export function initHeader() {
  if (bound) return;
  bound = true;
  onEveryPage(() => {
    const cleanups = [bindHeader(), bindHeaderCta()];
    return () => cleanups.forEach((c) => c());
  });
}

// Desarrollo: registra inicializaciones por página; si Vite lo recargara en caliente quedarían duplicadas.
import.meta.hot?.accept(() => location.reload());
