import { animate, inView, stagger } from 'motion';
import { gsap, ScrollTrigger } from './animations/gsap';
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

  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = document.getElementById('mobile-menu');
  const setOpen = (open: boolean) => {
    toggle?.setAttribute('aria-expanded', String(open));
    toggle?.querySelector('.sr-only')?.replaceChildren(open ? 'Close menu' : 'Open menu');
    panel?.setAttribute('data-open', String(open));
    lockScroll(open);
  };
  const onToggle = () => setOpen(toggle?.getAttribute('aria-expanded') !== 'true');
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  };
  const close = () => setOpen(false);

  toggle?.addEventListener('click', onToggle);
  panel?.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', onKey);

  return () => {
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('keydown', onKey);
    toggle?.removeEventListener('click', onToggle);
    setOpen(false);
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

/* ------------------------------------------------------------------ Ondas (cita de Billi Jo) */
/** Las ondas detrás de la persona crecen una tras otra, de la más pequeña (última en el DOM) a la grande. */
function bindRipples() {
  const root = document.querySelector<HTMLElement>('[data-ripples]');
  const rings = root ? Array.from(root.querySelectorAll<HTMLElement>('[data-ripple]')) : [];
  if (!root || !rings.length || reducedMotion()) return () => {};
  return inView(
    root,
    () => {
      root.setAttribute('data-shown', '');
      animate(rings, { scale: [0, 1] }, { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: stagger(0.18, { from: 'last' }) });
    },
    { amount: 0.35 },
  );
}

/* ------------------------------------------------------------------ Testimonios */
/**
 * Carrusel de testimonios en bucle infinito, sin scroll nativo: se mueve con transform.
 * - Flechas: avanzan o retroceden una tarjeta.
 * - Arrastre con ratón o dedo (en vertical sigue haciendo scroll de la página).
 * - Avance automático cada 4,5 s mientras está en pantalla; se pausa al pasar el ratón o al arrastrar.
 * El bucle se logra moviendo la primera tarjeta al final (o la última al principio) y compensando x.
 */
function bindTestimonials() {
  const root = document.querySelector<HTMLElement>('[data-testimonials]');
  const viewport = root?.querySelector<HTMLElement>('[data-testi-viewport]');
  const track = root?.querySelector<HTMLElement>('[data-testi-track]');
  const prev = root?.querySelector<HTMLButtonElement>('[data-testi-prev]');
  const next = root?.querySelector<HTMLButtonElement>('[data-testi-next]');
  const bar = root?.querySelector<HTMLElement>('[data-testi-bar]');
  if (!root || !viewport || !track || !prev || !next || !bar || track.children.length < 2) return () => {};

  const total = track.children.length;
  const reduce = reducedMotion();
  let x = 0; // desplazamiento actual del track, siempre en (-step, 0] tras normalizar
  let index = 0; // tarjeta que va primera (para la barra de progreso)
  let anim: { stop: () => void } | null = null;

  const step = () => {
    const card = track.firstElementChild as HTMLElement | null;
    return (card?.offsetWidth ?? 0) + (parseFloat(getComputedStyle(track).columnGap) || 0);
  };
  const paint = () => {
    track.style.transform = `translate3d(${x}px, 0, 0)`;
  };
  const paintBar = () => {
    bar.style.width = `${100 / total}%`;
    bar.style.transform = `translateX(${index * 100}%)`;
  };
  // Rota tarjetas para que siempre haya contenido a ambos lados
  const normalize = () => {
    const s = step();
    if (!s) return;
    while (x > 0) {
      track.prepend(track.lastElementChild!);
      x -= s;
      index = (index - 1 + total) % total;
    }
    while (x <= -s) {
      track.append(track.firstElementChild!);
      x += s;
      index = (index + 1) % total;
    }
    paint();
    paintBar();
  };
  const glide = (target: number) => {
    anim?.stop();
    if (reduce) {
      x = target;
      normalize();
      return;
    }
    anim = animate(x, target, {
      duration: 0.7,
      ease: [0.32, 0.72, 0, 1],
      onUpdate: (v) => {
        x = v;
        paint();
      },
      onComplete: normalize,
    });
  };
  const slide = (dir: 1 | -1) => {
    anim?.stop();
    normalize();
    const s = step();
    let target = Math.round(x / s) * s - dir * s;
    if (target > 0) {
      // Retroceder desde el inicio: trae la última tarjeta delante antes de animar
      track.prepend(track.lastElementChild!);
      x -= s;
      target -= s;
      index = (index - 1 + total) % total;
      paint();
      paintBar();
    }
    glide(target);
  };

  // Arrastre
  let dragging = false;
  let startX = 0;
  let startOffset = 0;
  let lastDx = 0;
  const onDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    anim?.stop();
    dragging = true;
    startX = e.clientX;
    startOffset = x;
    lastDx = 0;
    viewport.setPointerCapture(e.pointerId);
    viewport.dataset.dragging = '';
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const raw = startOffset + dx;
    x = raw;
    normalize();
    // Si normalize rotó tarjetas, el origen del arrastre se desplaza lo mismo
    startOffset += x - raw;
    lastDx = dx;
  };
  const onUp = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    delete viewport.dataset.dragging;
    if (viewport.hasPointerCapture(e.pointerId)) viewport.releasePointerCapture(e.pointerId);
    const s = step();
    // Basta con arrastrar un 15 % de tarjeta para pasar a la siguiente
    const target = lastDx < 0 ? (x < -s * 0.15 ? -s : 0) : lastDx > 0 ? (x > -s * 0.85 ? 0 : -s) : Math.round(x / s) * s;
    glide(target);
  };

  // Avance automático con pausa al pasar el ratón
  let hovered = false;
  let timer = 0;
  const onEnter = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') hovered = true;
  };
  const onLeave = () => (hovered = false);
  const stopAuto = () => window.clearInterval(timer);
  const stopView = reduce
    ? () => {}
    : inView(
        root,
        () => {
          timer = window.setInterval(() => {
            if (!hovered && !dragging && !document.hidden) slide(1);
          }, 4500);
          return stopAuto;
        },
        { amount: 0.3 },
      );

  const onPrev = () => slide(-1);
  const onNext = () => slide(1);
  const onResize = () => {
    anim?.stop();
    x = 0;
    paint();
  };

  prev.addEventListener('click', onPrev);
  next.addEventListener('click', onNext);
  viewport.addEventListener('pointerdown', onDown);
  viewport.addEventListener('pointermove', onMove);
  viewport.addEventListener('pointerup', onUp);
  viewport.addEventListener('pointercancel', onUp);
  viewport.addEventListener('pointerenter', onEnter);
  viewport.addEventListener('pointerleave', onLeave);
  window.addEventListener('resize', onResize);
  paintBar();

  return () => {
    anim?.stop();
    stopAuto();
    stopView();
    prev.removeEventListener('click', onPrev);
    next.removeEventListener('click', onNext);
    viewport.removeEventListener('pointerdown', onDown);
    viewport.removeEventListener('pointermove', onMove);
    viewport.removeEventListener('pointerup', onUp);
    viewport.removeEventListener('pointercancel', onUp);
    viewport.removeEventListener('pointerenter', onEnter);
    viewport.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('resize', onResize);
  };
}

/* ------------------------------------------------------------------ Polaroids (sección Properties) */
// Posiciones de la pila (0 = delante). Deben coincidir con restTransform() de home2/Communities.astro
const polaroidPos = (k: number) =>
  k === 0
    ? { x: 0, y: 0, rotate: 3, scale: 1, opacity: 1 }
    : k === 1
      ? { x: -18, y: -12, rotate: -1, scale: 0.97, opacity: 1 }
      : { x: -36, y: -24, rotate: -5, scale: 0.94, opacity: k === 2 ? 1 : 0 };

/**
 * Carrusel de polaroids: pasa las propiedades una a una, como quien mira fotos. La de delante sale
 * girando hacia la derecha, las demás avanzan y por detrás entra la siguiente. Solo hay 3 visibles;
 * el resto queda con `hidden` (no se descargan) hasta justo antes de su turno.
 */
function bindPolaroids() {
  const root = document.querySelector<HTMLElement>('[data-polaroids]');
  const cards = root ? Array.from(root.querySelectorAll<HTMLElement>('[data-polaroid]')) : [];
  if (!root || cards.length < 4 || reducedMotion()) return () => {};

  const order = [...cards];
  const place = () =>
    order.forEach((card, k) => {
      card.style.zIndex = String(30 - k);
      if (k <= 3) card.hidden = false;
    });

  // Estado inicial gestionado por Motion (sustituye al transform en línea del HTML)
  order.forEach((card, k) => animate(card, polaroidPos(k), { duration: 0 }));
  place();

  // Ciclo con temporizadores (no depende de que la promesa de animate() se resuelva)
  const OUT = 650;
  const step = () => {
    const front = order[0];
    animate(front, { x: 160, y: 24, rotate: 16, opacity: 0 }, { duration: OUT / 1000, ease: [0.32, 0.72, 0, 1] });
    window.setTimeout(() => {
      order.push(order.shift()!);
      place();
      order.slice(0, 4).forEach((card, k) => animate(card, polaroidPos(k), { type: 'spring', stiffness: 200, damping: 26 }));
      // La que salió vuelve al fondo de la pila, oculta, lista para su próximo turno
      animate(front, polaroidPos(order.length - 1), { duration: 0 });
      front.style.zIndex = '0';
      if (order.length > 4) front.hidden = true;
    }, OUT);
  };

  let timer = 0;
  const stopTimer = () => window.clearTimeout(timer);
  const loop = () => {
    timer = window.setTimeout(() => {
      if (!document.hidden) step();
      loop();
    }, 3200);
  };
  const stopView = inView(
    root,
    () => {
      loop();
      return stopTimer;
    },
    { amount: 0.3 },
  );

  return () => {
    stopTimer();
    stopView();
  };
}

/* ------------------------------------------------------------------ Directorio de comunidades */
function bindDirectory() {
  const root = document.querySelector<HTMLElement>('[data-directory]');
  if (!root) return () => {};

  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const indicator = root.querySelector<HTMLElement>('[data-filter-indicator]');
  const rows = Array.from(root.querySelectorAll<HTMLTableRowElement>('[data-row]'));
  const more = root.querySelector<HTMLButtonElement>('[data-directory-more]');

  const moveIndicator = (button: HTMLButtonElement) => {
    if (!indicator) return;
    indicator.style.width = `${button.offsetWidth}px`;
    indicator.style.transform = `translateX(${button.offsetLeft}px)`;
  };

  const select = (button: HTMLButtonElement) => {
    const state = button.dataset.filter ?? 'all';
    buttons.forEach((b) => b.setAttribute('aria-selected', String(b === button)));
    moveIndicator(button);

    // Filtrar por estado muestra todas sus filas; "All" vuelve a la lista corta
    const filtering = state !== 'all';
    root.toggleAttribute('data-expanded', filtering || root.hasAttribute('data-user-expanded'));
    if (more) more.hidden = filtering || root.hasAttribute('data-user-expanded');

    const visible: HTMLTableRowElement[] = [];
    rows.forEach((row) => {
      const show = !filtering || row.dataset.state === state;
      row.hidden = !show;
      if (show) visible.push(row);
    });

    if (!reducedMotion()) {
      const shown = visible.filter((row) => row.offsetParent !== null).slice(0, 12);
      animate(shown, { opacity: [0, 1], y: [8, 0] }, { duration: 0.45, delay: (i) => i * 0.03, ease: [0.16, 1, 0.3, 1] });
    }
  };

  const onClick = (e: Event) => select(e.currentTarget as HTMLButtonElement);
  buttons.forEach((b) => b.addEventListener('click', onClick));

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (i === -1) return;
    e.preventDefault();
    const next = buttons[(i + (e.key === 'ArrowRight' ? 1 : buttons.length - 1)) % buttons.length];
    next.focus();
    select(next);
  };
  root.addEventListener('keydown', onKey);

  const onMore = () => {
    root.setAttribute('data-user-expanded', '');
    root.setAttribute('data-expanded', '');
    if (more) more.hidden = true;
  };
  more?.addEventListener('click', onMore);

  const onResize = () => {
    const current = buttons.find((b) => b.getAttribute('aria-selected') === 'true');
    if (current) moveIndicator(current);
  };
  window.addEventListener('resize', onResize);
  // Espera a la fuente para medir el ancho real de los botones
  document.fonts.ready.then(onResize);
  onResize();

  return () => {
    buttons.forEach((b) => b.removeEventListener('click', onClick));
    root.removeEventListener('keydown', onKey);
    more?.removeEventListener('click', onMore);
    window.removeEventListener('resize', onResize);
  };
}

/* ------------------------------------------------------------------ Formulario de propuesta */
function bindProposalForm() {
  const form = document.querySelector<HTMLFormElement>('[data-proposal-form]');
  if (!form) return () => {};

  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const ownerOnly = form.querySelectorAll<HTMLElement>('[data-owner-only]');

  const syncAudience = () => {
    const audience = new FormData(form).get('audience') ?? 'owner';
    ownerOnly.forEach((el) => (el.hidden = audience !== 'owner'));
  };
  form.addEventListener('starwind:value-change', syncAudience);
  syncAudience();

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const invalid = Array.from(form.querySelectorAll<HTMLInputElement>('input[required]')).find((i) => !i.checkValidity());
    if (invalid) {
      invalid.focus();
      invalid.setAttribute('aria-invalid', 'true');
      if (status) {
        status.dataset.tone = 'error';
        status.textContent =
          invalid.type === 'email' ? 'Enter a valid email so we can reply.' : 'Add your name so we know who to reply to.';
      }
      return;
    }
    // TODO: conectar al endpoint real (Astro Action o servicio de formularios) antes de publicar.
    if (status) {
      status.dataset.tone = 'error';
      status.textContent = `This form is not connected yet. Call ${'(931) 503-7000'} or email bsuiter@nexgenmgmt.us.`;
    }
  };
  const onInput = (e: Event) => (e.target as HTMLElement).removeAttribute('aria-invalid');

  form.addEventListener('submit', onSubmit);
  form.addEventListener('input', onInput);

  return () => {
    form.removeEventListener('starwind:value-change', syncAudience);
    form.removeEventListener('submit', onSubmit);
    form.removeEventListener('input', onInput);
  };
}

/* ------------------------------------------------------------------ Movimiento */
function initMotion() {
  if (reducedMotion()) return () => {};
  const stops: VoidFunction[] = [];

  // Cifras que cuentan hasta su valor al entrar en pantalla
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target)) return;
    el.textContent = '0';
    stops.push(
      inView(
        el,
        () => {
          animate(0, target, {
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => (el.textContent = String(Math.round(v))),
          });
        },
        { amount: 0.6 },
      ),
    );
  });

  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Barras del informe de ejemplo
    const bars = document.querySelectorAll('[data-bar]');
    if (bars.length) {
      gsap.from(bars, {
        scaleY: 0,
        duration: 1,
        stagger: 0.06,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-bars]', start: 'top 85%' },
      });
    }

    // Parallax suave en las fotos de fondo
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((img) => {
      gsap.fromTo(
        img,
        { yPercent: -8, scale: 1.15 },
        { yPercent: 8, ease: 'none', scrollTrigger: { trigger: img.parentElement, scrub: true } },
      );
    });

    // La foto del hero se aleja un poco al hacer scroll
    const hero = document.querySelector('[data-hero-photo]');
    if (hero) {
      gsap.to(hero, { scale: 1.08, ease: 'none', scrollTrigger: { trigger: hero.parentElement, start: 'top top', scrub: true } });
    }

    // La flecha de la fila "We manage homes" avanza con el scroll
    const arrow = document.querySelector('[data-pill-arrow] svg');
    if (arrow) {
      gsap.fromTo(arrow, { x: -24 }, { x: 24, ease: 'none', scrollTrigger: { trigger: arrow, scrub: true } });
    }
  });

  // Servicios: la columna corta (B) baja algo más despacio que la larga (A), de modo que ambas
  // terminan a la misma altura cuando la sección acaba de pasar
  mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
    // Elementos que "flotan" a otra velocidad que el scroll. data-float="5" fija el recorrido en % (12 por defecto)
    document.querySelectorAll<HTMLElement>('[data-float]').forEach((el) => {
      const range = Number(el.dataset.float) || 12;
      gsap.fromTo(
        el,
        { yPercent: range },
        { yPercent: -range, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    });

    const grid = document.querySelector<HTMLElement>('[data-svc-cols]');
    const colA = grid?.querySelector<HTMLElement>('[data-svc-col="0"]');
    const colB = grid?.querySelector<HTMLElement>('[data-svc-col="1"]');
    if (!grid || !colA || !colB) return;
    gsap.to(colB, {
      y: () => Math.max(0, colA.offsetHeight - colB.offsetHeight),
      ease: 'none',
      scrollTrigger: { trigger: grid, start: 'top 75%', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
    });
  });

  stops.push(() => mm.revert());
  ScrollTrigger.refresh();
  return () => stops.forEach((stop) => stop());
}

/* ------------------------------------------------------------------ Ciclo de vida */
// Varias páginas importan este módulo y llaman a initHome(): se registra una sola vez y
// onEveryPage lo reinicia en cada navegación de <ClientRouter />.
let homeBound = false;

export function initHome() {
  if (homeBound) return;
  homeBound = true;
  onEveryPage(() => {
    const cleanups = [bindHeader(), bindHeaderCta(), bindPolaroids(), bindRipples(), bindTestimonials(), bindDirectory(), bindProposalForm(), initMotion()];
    return () => cleanups.forEach((c) => c());
  });
}
