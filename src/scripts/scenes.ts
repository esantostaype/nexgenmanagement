import { gsap, ScrollTrigger, SplitText } from './animations/gsap';

/**
 * Escenas con GSAP: timelines, pin, scrub, SplitText.
 * Usa Motion (data-reveal) para entradas simples y GSAP para todo lo coreografiado.
 * Cada escena se busca por [data-scene] para que solo corra en las páginas que la tienen.
 */
export function initScrollScenes() {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Títulos divididos en líneas (hero y títulos de sección)
    document.querySelectorAll<HTMLElement>('[data-scene="split-lines"]').forEach((el) => {
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) => {
          // El CSS lo deja oculto hasta aquí para que no se vea el texto antes de dividirlo
          gsap.set(el, { visibility: 'visible' });
          // Se anima al entrar en pantalla (los que ya están visibles, como el del hero, al instante)
          return gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            stagger: 0.08,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        },
      });
    });

    // Sección con pin y progreso ligado al scroll
    document.querySelectorAll<HTMLElement>('[data-scene="pin-progress"]').forEach((section) => {
      const bar = section.querySelector('[data-progress]');
      const items = section.querySelectorAll('[data-step]');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${items.length * 60}%`,
          scrub: true,
          pin: true,
        },
      });

      if (bar) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0);
      items.forEach((item, i) => {
        tl.fromTo(item, { opacity: 0.2 }, { opacity: 1, ease: 'none' }, i / items.length);
      });
    });
  });

  return () => {
    mm.revert();
    ScrollTrigger.refresh();
  };
}
