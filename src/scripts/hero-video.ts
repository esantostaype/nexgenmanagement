import { onEveryPage } from './lifecycle';

let bound = false;

/**
 * Video del hero: entra con fundido cuando tiene su primer fotograma (o el poster) listo, se pausa
 * fuera de pantalla y, con reduced motion, se queda quieto en el poster.
 * Se reinicia en cada navegación de <ClientRouter /> (onEveryPage).
 */
export function initHeroVideo() {
  if (bound) return;
  bound = true;

  onEveryPage(() => {
    const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
    if (!video) return;

    const reveal = () => video.setAttribute('data-ready', '');
    let fallback = 0;
    if (video.readyState >= 2) reveal();
    else {
      video.addEventListener('loadeddata', reveal, { once: true });
      // Si el video tarda o falla, el poster entra igualmente
      fallback = window.setTimeout(reveal, 2500);
    }

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.removeAttribute('autoplay');
      video.pause();
      return () => window.clearTimeout(fallback);
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  });
}
