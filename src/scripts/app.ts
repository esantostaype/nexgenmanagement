import { ScrollTrigger } from './animations/gsap';
import { initSmoothScroll, destroySmoothScroll, initAnchorLinks } from './animations/smooth-scroll';
import { initReveals } from './animations/reveal';
import { initOverlayScrollbars } from './animations/scrollbars';
import { initDialogScrollLock } from './animations/dialog-scroll-lock';
import { initScrollScenes } from './scenes';
import { bindForms } from './forms';
import { onEveryPage } from './lifecycle';

// Lenis, reveals, escenas de GSAP, barras de scroll y formularios ([data-form], src/scripts/forms.ts): se inician en cada página y se limpian
// antes de cada navegación de <ClientRouter /> (view transitions).
onEveryPage(() => {
  initSmoothScroll();
  const cleanups = [initAnchorLinks(), initReveals(), initScrollScenes(), initOverlayScrollbars(), initDialogScrollLock(), bindForms()];

  // Recalcula posiciones cuando terminan de cargar imágenes y fuentes
  if (document.readyState === 'complete') ScrollTrigger.refresh();
  else window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    destroySmoothScroll();
  };
});

// <ClientRouter /> reemplaza los atributos de <html> al navegar: recupera la clase .js
// (la que oculta los reveals hasta animarlos) antes del primer pintado de la página nueva.
document.addEventListener('astro:after-swap', () => {
  document.documentElement.classList.add('js');
  // ScrollTrigger guarda en caché la posición de scroll y solo la actualiza con el siguiente evento de scroll.
  // Su refresh() en la página nueva leería la de la página anterior y la restauraría, devolviéndola abajo justo
  // después de que Astro la sube a 0. Fijamos la caché (y el scroll) en la posición real de la página nueva.
  ScrollTrigger.clearScrollMemory('manual');
  ScrollTrigger.getScrollFunc(window)(window.scrollY);
});

// Desarrollo: este módulo registra inicializaciones por página (onEveryPage). Si Vite lo recargara en caliente,
// quedarían duplicadas (la versión vieja y la nueva) y fallarían al navegar: al cambiar, se recarga la página entera.
import.meta.hot?.accept(() => location.reload());
