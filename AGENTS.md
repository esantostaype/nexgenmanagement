## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Stack del proyecto

Astro + Tailwind v4 + Starwind UI + GSAP + Motion + Lenis, sin React. Iconos: Tabler (`@tabler/icons`). Fuente: Inter, servida con la Fonts API de Astro.

### Estructura

- `astro.config.mjs`: incluye `fonts` (Inter vía Fontsource, self-hosted, con fallback de métricas ajustadas).
- `src/layouts/BaseLayout.astro`: `<head>` con SEO, `<Font cssVariable="--font-inter" preload />`, `global.css` y `src/scripts/app.ts`.
- `src/styles/theme.css`: **el único archivo de tema**. Contiene la escala de marca `brand-50…950` (generada) y los tokens semánticos (`--primary`, `--background`, `--muted-foreground`…).
- `src/styles/global.css`: imports (Tailwind, tw-animate, Lenis, theme), el mapeo `@theme inline` de los tokens a utilidades, las bases y los reveals. Es el único sitio que importa Tailwind.
- `src/components/starwind/`: componentes de Starwind UI (código propio y editable).
- `src/components/Container.astro` / `Section.astro`: ancho máximo y espaciado vertical.
- `src/scripts/app.ts`: inicializa Lenis, los reveals, las escenas y las barras de scroll con `onEveryPage` (`src/scripts/lifecycle.ts`).
- `src/scripts/animations/`: `gsap.ts`, `smooth-scroll.ts` y `reveal.ts`.
- `src/scripts/scenes.ts`: escenas de GSAP buscadas por `[data-scene="…"]`.
- `scripts/accent.mjs`: escribe en `theme.css` la escala de marca copiada de uicolors.app.

### Color de marca

La escala se genera en https://uicolors.app y se pega con el script:

```bash
npm run accent                 # lee la lista copiada de uicolors del portapapeles
npm run accent -- --base 600   # si el color de marca no es el 500
npm run accent -- paleta.txt   # o desde un archivo
```

- Acepta la lista con cualquier nombre (`--color-scooter-50: #…`) y la renombra a `brand-50…950`.
- Reescribe solo el bloque `accent:start … accent:end` de `theme.css` (en `@theme static`, para que existan todos los tonos aunque no se usen en clases).
- `--color-brand` apunta al tono base (500 por defecto) y `--color-brand-foreground` es blanco o `brand-950`, según cuál tenga más contraste.
- Usa `bg-primary`, `text-primary` o `bg-brand-100…` en las clases. **No escribas colores HEX sueltos.**
- En Starwind, `accent` es el fondo sutil de hover, no la marca. La marca es `primary` o `brand`.

### Componentes (Starwind UI)

- Se añaden con `npx starwind@latest add <componente> -y`. Ya instalados: button, input, label, textarea, checkbox, select, card y badge.
- Se importan desde `@/components/starwind/<nombre>`, por ejemplo `import { Button } from '@/components/starwind/button'`.
- Variantes de Button y Badge: `primary` (marca), `default`, `secondary`, `outline`, `ghost`, `info`, `success`, `warning`, `error`.
- Los componentes interactivos (select, dialog…) traen su propio script vanilla. No hace falta React.
- Formularios: usa HTML nativo con `<form>` y Astro Actions (requiere adaptador) o `fetch` desde un `<script>`.

### Iconos (Tabler)

Se importan como componentes SVG de Astro, sin JavaScript:

```astro
---
import ArrowRight from '@tabler/icons/outline/arrow-right.svg';
---
<ArrowRight class="size-5" />
```

El catálogo está en https://tabler.io/icons (variantes `outline/` y `filled/`).

### Cuándo usar cada librería de animación

- **Motion** (`animate`, `inView`, `scroll`, `hover`, `press`): entradas simples y microinteracciones. Para revelar al hacer scroll, usa atributos:
  - `data-reveal` (`fade-up` por defecto) · `data-reveal="fade|fade-down|from-left|scale|blur"` · `data-delay="0.2"`
  - `data-reveal-stagger="scale"` en el padre para animar los hijos en cascada (`data-stagger="0.1"`).
- **GSAP** (`import { gsap, ScrollTrigger, SplitText } from './animations/gsap'`): timelines, pin, scrub y SplitText. Cada escena nueva va en `scenes.ts` dentro de `gsap.matchMedia()` y se dispara con `[data-scene="nombre"]`.
- **Lenis**: smooth scroll sincronizado con ScrollTrigger (mismo comportamiento que InnerView). No uses ScrollSmoother a la vez.
  - Solo se activa en escritorio con ratón (`hover: hover` + `pointer: fine`) y sin reduced motion; en táctil queda el scroll nativo.
  - Curva expo de 1.05 s. Los anclas se detienen 72 px por debajo del borde superior (`ANCHOR_OFFSET` en `smooth-scroll.ts` y `scroll-padding-top` en `global.css`; cámbialos juntos si el header mide otra cosa).
  - Los contenedores con scroll propio (modales, listas) siguen con scroll nativo.
  - Para hacer scroll por código, usa `getLenis()?.scrollTo(target)`. Para bloquear la página bajo un menú o modal, usa `lockScroll(true | false)`.
- **Barras de scroll**: las nativas están ocultas. `scrollbars.ts` dibuja un thumb fino superpuesto (`.scroll-thumb` en `global.css`) que aparece al hacer scroll o mover el ratón, se desvanece a los 1.5 s y se puede arrastrar.

### Imágenes (obligatorio)

- **Todas las imágenes pasan por `<Img>`** (`src/components/Img.astro`): Astro las convierte a **WebP** y genera varias anchuras con `srcset`, así cada pantalla (también las retina) descarga solo lo que necesita. No uses `<img>` a mano.
- Las imágenes locales van en `src/assets/images/` (no en `public/`, que no se optimiza) y se referencian con su ruta `"/images/…"`, que `src/lib/images.ts` resuelve. Guarda el original con buena resolución; Astro hace los tamaños.
- Pasa siempre `sizes` con el ancho real con el que se muestra (p. ej. `sizes="40px"` en un avatar, `sizes="(min-width: 1024px) 33vw, 100vw"` en una tarjeta de 3 columnas). Para un recorte vertical con `object-cover`, calcula el ancho que ocupa la imagen a la altura del marco.
- Remotas (Unsplash, etc.): el dominio debe estar en `image.domains` de `astro.config.mjs`; se descargan y optimizan al compilar.
- Para HTML generado en el navegador (mapas, popups), calcula las URLs en el frontmatter con `getImage()` y pásalas al script.
- `public/` queda solo para lo que no se optimiza: SVG, favicon, vídeos y su poster.

### Convenciones de animación (obligatorias)

- **Todo elemento visible tiene reveal.** Ningún bloque aparece estático: textos, tarjetas, imágenes, listas y footer usan `data-reveal` (o `data-reveal-stagger` en el padre para listas y grupos).
- **Títulos grandes con la entrada del hero.** Todo `h1`/`h2` (y los titulares de tarjeta destacados) es grande, con `font-display` y un `clamp()` generoso (mínimo de `clamp(2rem,4vw,3.4rem)` en títulos de sección), y lleva `data-scene="split-lines"`: entra por líneas cuando aparece en pantalla. No combines `data-scene="split-lines"` y `data-reveal` en el mismo elemento.
- **Botones y enlaces con flecha entran de izquierda a derecha**: `data-reveal="from-left"`, o `data-reveal-stagger="from-left"` en el contenedor si hay varios.
- **Flechas de botones:** usa `arrow-up-right` girada 45° en reposo (apunta a →) que vuelve a ↗ en hover: `rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-0` (el botón lleva `group`). En Tailwind v4 `rotate-*` y `scale-*` son propiedades propias (`rotate`, `scale`): si escribes una transición a mano, inclúyelas.
- Si un elemento ya se mueve con GSAP (parallax, `data-float`), su reveal es `data-reveal="fade"` para no pelear por el `transform`.

### Reglas

- Respeta siempre `prefers-reduced-motion`.
- El contenido debe verse sin JS: el CSS solo oculta `[data-reveal]` cuando `html` tiene la clase `.js`.
- Anima solo `transform`, `opacity` y `filter`.
- Para cambiar de fuente, edita `fonts` en `astro.config.mjs` y el `cssVariable` del `<Font />`. No uses `@import` de Fontsource ni `<link>` a Google Fonts, porque provocan el salto de fuente al cargar.
- **View transitions activadas** (`<ClientRouter />` en `BaseLayout.astro`): la navegación entre páginas es en el cliente y los scripts de módulo se ejecutan **una sola vez**. Todo lo que se inicialice por página (listeners, observers, escenas de GSAP, mapas, vídeos) va dentro de `onEveryPage(() => { …; return cleanup })` de `src/scripts/lifecycle.ts`: arranca al instante, se reinicia en cada navegación y limpia antes de cambiar de página. Si una función se llama desde varias páginas, protégela para que se registre una sola vez (ver `initHome` o `initHeroVideo`).
- `src/pages/index.astro` es una demo: se reemplaza al empezar cada proyecto.

### Skills de diseño incluidas

`.claude/skills/` trae las skills de diseño y animación (impeccable, emil-design-eng, animate, design-taste-frontend, etc.). `.claude/settings.local.json` activa los hooks de impeccable. Su configuración está en `.impeccable/`.
