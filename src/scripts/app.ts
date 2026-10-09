import { ScrollTrigger } from './animations/gsap';
import { initSmoothScroll, destroySmoothScroll } from './animations/smooth-scroll';
import { initReveals } from './animations/reveal';
import { initOverlayScrollbars } from './animations/scrollbars';
import { initScrollScenes } from './scenes';
import { onEveryPage } from './lifecycle';

// Lenis, reveals, escenas de GSAP y barras de scroll: se inician en cada página y se limpian
// antes de cada navegación de <ClientRouter /> (view transitions).
onEveryPage(() => {
  initSmoothScroll();
  const cleanups = [initReveals(), initScrollScenes(), initOverlayScrollbars()];

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
document.addEventListener('astro:after-swap', () => document.documentElement.classList.add('js'));
