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

Astro + Tailwind v4 + Starwind UI + GSAP + Motion + Lenis, sin React en el sitio (solo el panel de Keystatic en dev). Iconos: Tabler (`@tabler/icons`). Fuente: Inter, servida con la Fonts API de Astro.

### Estructura

- `astro.config.mjs`: incluye `fonts` (Inter vía Fontsource, self-hosted, con fallback de métricas ajustadas).
- `src/components/templates/BaseLayout.astro`: `<head>` con SEO, `<Font cssVariable="--font-inter" preload />`, `global.css` y `src/scripts/app.ts`.
- `src/styles/theme.css`: **el único archivo de tema**. Contiene la escala de marca `brand-50…950` (generada) y los tokens semánticos (`--primary`, `--background`, `--muted-foreground`…).
- `src/styles/global.css`: imports (Tailwind, tw-animate, Lenis, theme), el mapeo `@theme inline` de los tokens a utilidades, las bases y los reveals. Es el único sitio que importa Tailwind.
- `src/components/starwind/`: componentes de Starwind UI (código propio y editable).
- `src/components/`: componentes por niveles de atomic design (ver «Atomic design»).
- `src/scripts/app.ts`: inicializa Lenis, los reveals, las escenas y las barras de scroll con `onEveryPage` (`src/scripts/lifecycle.ts`).
- `src/scripts/animations/`: `gsap.ts`, `smooth-scroll.ts` y `reveal.ts`.
- `src/scripts/scenes.ts`: escenas de GSAP buscadas por `[data-scene="…"]`.
- `src/scripts/header.ts`: header (estado con scroll, menú móvil y aparición del CTA); lo inicia el `<script>` de `organisms/Header.astro`.
- `src/scripts/animations/dialog-scroll-lock.ts`: bloquea el scroll mientras hay un modal abierto.
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

### Atomic design (obligatorio)

**Nunca HTML suelto.** Toda pieza visual es un componente; las páginas solo componen organismos (y su `<script>` de inicialización). Si algo se repite o podría reutilizarse en otra página, es un componente. Antes de crear uno nuevo, busca si ya existe uno con una variante que sirva; prefiere añadir una variante (`variant`, `tone`, `size`) a un componente genérico antes que crear otro casi igual.

```
src/components/
  atoms/        piezas indivisibles: Img, Logo, Avatar, Eyebrow, Card (caja base), CardTitle, CardText, IconCircle,
                IconText, ArrowCircle, DateBadge, MediaCta, SearchHint, InverseCorner, Ripples (ondas de marca), Prose (texto largo en Markdown),
                Section (espaciado de sección)
  molecules/    combinaciones de átomos con un propósito: ArrowButton, ArrowLink, SectionHeading, AvatarGroup, AvatarStat,
                InfoCard, MediaCard, QuoteCard, Notch, Popover, SearchField, SegmentedControl, CarouselControls,
                PostMeta, NavItem, MobileNavItem, LinkList, ContactList, SocialLinks, NewsletterSignup, CtaBlock,
                FormField, LogoLink, MainNav, PhoneButton, HeaderCta, MenuToggle, ChipGroup, StepList, Callout,
                AnchorNav, KeyStat, ProfileCard, FaqList (Accordion de Starwind), PortraitFrame, Timeline, DetailList
  organisms/    bloques completos: Header, HeaderBar, Footer, MobileMenu, PropertyFilter, ProposalForm, ProposalDialog,
                ServiceDetail, Modal (modal genérico), TeamMemberDialog, JobApplicationForm, ContactForm
    sections/   una sección de página cada uno: Hero, About, Services, Leadership, Properties, Testimonials, News,
                PropertiesMap, PropertyGrid, PageHero (hero de páginas internas: tarjeta brand-950 compacta, sin imagen; la sección siguiente lleva medio section-space), ServiceStages + ServiceStage,
                ReportingRhythm, CtaSection, FeatureGrid, Realtors, Faq, TeamGrid, CoreValues, OurStory, AwardFeature, TeamTeaser, JobApplication, ContactSection, ContactPaths, BlogList, PostArticle
  templates/    BaseLayout (head, fuentes, view transitions, scripts globales)
  starwind/     primitivas de Starwind UI (Button, Input, Badge…): los átomos y moléculas las usan por dentro
  _archive/     piezas retiradas; no se importan desde páginas activas
src/pages/      solo componen: <BaseLayout> + organismos
src/data/       contenido y datos (site.ts, communities.ts, navigation.ts): nada de textos de datos en los componentes
src/content/    colecciones de contenido (src/content.config.ts). Blog: un .md por post en src/content/blog, la URL es
                /blog/<archivo>; utilidades en src/lib/blog.ts (getPosts, postUrl, postDate…). Portada en
                src/assets/images/blog/<archivo>/ y PDF en public/newsletter/<archivo>/ (carpetas de Keystatic).
```

Reglas:

- Una página no escribe clases ni marcado propio: `<Header /> <main><Hero /> …</main> <Footer />`.
- Un organismo compone moléculas y átomos; puede tener la rejilla y el orden de su sección, pero no repite estilos que ya tenga un componente.
- Los componentes reciben datos por props (y slots para contenido rico), no importan textos fijos salvo que sean propios de esa sección.
- Imports siempre con alias `@/components/<nivel>/<Nombre>.astro`, nunca relativos.
- Todo lo que el JS necesita encontrar va como `data-*` en el componente (no clases), y su script vive en el componente o en `src/scripts/`.
- Comentario de cabecera en cada componente: qué es, variantes y slots.

**Textos en formato infografía.** Nada de párrafos largos: titular corto + una o dos frases, y el resto en piezas escaneables (pastillas con `ChipGroup`, pasos con `StepList`, entregable con `Callout`, datos con `KeyStat`). El contenido vive en `src/data/` (p. ej. `services.ts`) y se condensa sin inventar cifras ni promesas.

**Tarjetas: un componente genérico con variantes, nunca tarjetas sueltas.**

- `InfoCard` (molécula): visual arriba (slots `top`/`aside`), título + texto abajo, `kicker`, `bg` (capa de fondo), `decor` (elementos que sobresalen). Tonos `white`/`neutral`/`brand`/`dark`, `tall`, `titleSize`.
- `MediaCard` (molécula): tarjeta con imagen. Variantes `stack` (imagen arriba o abajo), `side`, `overlay` (imagen de fondo), `polaroid`, `image`. Slots `header`, `meta`, `media`, `sub`, `end`, default.
- `QuoteCard` (molécula): variantes `testimonial` (pestaña del autor) y `person` (persona recortada que sobresale).
- `ProfileCard` (molécula): persona (recorte PNG sobre `Ripples`), nombre, cargo, email y teléfono. `popout`: persona más grande con la cabeza sobresaliendo. `variant="portrait"`: retrato sobre brand-950 con ondas (`PortraitFrame`), nombre y cargo; con `opens` abre un modal (bio del equipo).

**Menú activo.** `NavItem` y `MobileNavItem` marcan la página actual con `aria-current="page"` (helper `isActive` de `src/data/navigation.ts`; la home solo en `/`, el resto también en sus subpáginas). Escritorio: mismo fondo que el hover; móvil: celeste `brand-400`. Al crear una página, añade su `href` en `mainNav`.

**Radios concéntricos (obligatorio).** Radio interior = radio exterior − relleno. Tarjetas de 16px (`rounded-2xl`):

- Tarjeta con imagen dentro: relleno de **8px** e imagen `rounded-lg` (8px) — `MediaCard inset="sm"` (por defecto). Variante `inset="md"`: relleno de 12px e imagen `rounded-sm` (4px).
- El texto dentro de una tarjeta con imagen usa `card-pad-inset` / `card-pad-inset-md` para quedar a la misma distancia del borde que el resto de tarjetas.
- Paneles flotantes (desplegables, popovers) de 16px con 8px de relleno: opciones `rounded-lg`.
- Nunca una imagen o caja interior con el mismo radio que su contenedor si tiene relleno.

### Componentes del sitio (obligatorio)

Todo bloque nuevo se arma con estos componentes; no repitas a mano sus clases.

- **Medidas comunes** (utilidades de `global.css`, salen de la sección About): `section-space` (espacio superior de sección: 40/80/96/112/128 px), `card-pad` (relleno de tarjeta: 24/28/32 px), `grid-gap` (hueco entre tarjetas: 16/20/24 px), `heading-gap` (eyebrow → título) y `action-gap` (título/descripción → acción). Margen lateral: `--gutter` y `.container-site`.
- `atoms/Section.astro`: toda sección. `width="container"` (por defecto) · `"inset"` (panel a todo el ancho con 12–16 px a los lados) · `"none"`. Props `id`, `labelledby`, `label`, `innerClass`.
- `molecules/SectionHeading.astro`: eyebrow + título (entra por líneas) + descripción (slot) + acciones (`slot="actions"`). `layout="split"` pone las acciones a la derecha. Un solo tamaño de título para todas las secciones.
- `atoms/Eyebrow.astro` (tonos `white`, `brand`, `dark`).
- `atoms/Card.astro` (tonos `white`, `neutral`, `brand`, `dark`; `pad` `md`/`sm`/`none`; con `href` es un enlace) + `atoms/CardTitle.astro` + `atoms/CardText.astro`.
- `atoms/IconCircle.astro`: icono Tabler en círculo (64/80 px; `size="sm"` 48/56 px).
- `molecules/ArrowButton.astro`: CTA píldora con círculo de flecha, sobre el Button de Starwind (`variant` `brand`/`dark`/`light`, `size` `md`/`lg`).
- **Modal de propuesta**: `organisms/ProposalDialog.astro` (Dialog de Starwind con `ProposalForm`) va una vez en `BaseLayout`. Cualquier CTA lo abre con `<ArrowButton opens={PROPOSAL_DIALOG}>` (`src/data/forms.ts`); `opens` acepta el id de cualquier otro Dialog.
- `molecules/ArrowLink.astro`: enlace de texto con flecha (`variant` `dot`/`underline`).
- `atoms/Avatar.astro` y `molecules/AvatarGroup.astro`: avatares (24/32/40 px) con foto o iniciales.

### Modales (obligatorio)

- Siempre con `organisms/Modal.astro` (Dialog de Starwind con la animación y el botón de cerrar del sitio; `size` md/lg, `pad` md/sm), dentro de un organismo (p. ej. `ProposalDialog` con `ProposalForm`, `TeamMemberDialog`). Los modales globales van **una sola vez** en `BaseLayout`; los propios de una página, en su sección (p. ej. las bios en `TeamGrid`).
- Se abre desde cualquier sitio con `<ArrowButton opens="<id del Dialog>">` (en Nex-Gen, `opens={PROPOSAL_DIALOG}` de `src/data/forms.ts`): el botón lleva `data-sw-dialog-trigger` + `data-sw-dialog-target-id`. Si está dentro del menú móvil, añade `data-menu-dismiss` para que cierre el menú antes.
- **Bloquea el scroll** de la página mientras está abierto: `src/scripts/animations/dialog-scroll-lock.ts` (iniciado en `app.ts`) observa los `<dialog open>` y llama a `lockScroll()`, que también detiene Lenis. Funciona con cualquier `<dialog>` modal, sin código extra.
- **Animación**: entra 50px de abajo hacia arriba **sin escalar**; el fundido es **lineal** y solo el movimiento usa curva: `cubic-bezier(0.2, 0, 0, 1)` al entrar y la inversa, `cubic-bezier(1, 0, 0.8, 1)`, al salir (si no, el modal se queda quieto y medio visible al final); **150ms** en todo, también el fondo oscuro, para que se vaya a la vez (keyframes propios en el `<style>` de `Modal.astro`, sobre los de tw-animate). Con reduced motion, solo fundido.
- `global.css` deja transparente el `dialog::backdrop` nativo (el fondo lo pinta Starwind): si no, desaparece de golpe al cerrar y se nota un salto.
- Diseño: tarjeta blanca `rounded-2xl` con `card-pad`, cabecera con `Eyebrow` + título `font-display`; en móvil ocupa casi toda la pantalla y hace scroll por dentro.

### Clases canónicas de Tailwind v4 (obligatorio)

Usa siempre la forma canónica de cada clase (la que sugiere el editor con "Replace with…"); los valores arbitrarios `[…]` solo cuando no exista equivalente en la escala.

- Escala en lugar de píxeles: `size-[460px]` → `size-115`, `w-[300px]` → `w-75`, `size-[18px]` → `size-4.5`, `min-h-[560px]` → `min-h-140`, `max-w-[680px]` → `max-w-170`.
- Números sin corchetes: `z-[60]` → `z-60`, `duration-[1400ms]` → `duration-1400`, `aspect-[16/10]` → `aspect-16/10`.
- Variantes de atributo sin corchetes: `data-[open]:` → `data-open:`, `group-data-[scrolled]/header:` → `group-data-scrolled/header:` (con valor sí: `data-[open=true]:`).
- Negativos y fracciones: `translate-x-[-50%]` → `-translate-x-1/2`.
- Sintaxis de v4: `bg-linear-to-r` (no `bg-gradient-to-r`), `!` al final (`p-0!`), variables con paréntesis (`px-(--gutter)`).

Antes de dar algo por terminado:

```bash
npm run lint:classes   # informa de las clases no canónicas
npm run fix:classes    # las corrige (usa el canonicalizador oficial de Tailwind con el tema del proyecto)
```

### Blog con Keystatic

- Los posts se escriben en **/keystatic** (`keystatic.config.ts`) con `npm run dev`: modo local, guarda los Markdown en `src/content/blog` y las imágenes/PDF en sus carpetas por post. Al terminar, se suben los archivos al repositorio como cualquier cambio.
- Keystatic y React (`@astrojs/react`, solo para su panel) se cargan **solo en `astro dev`** (`isDev` en `astro.config.mjs`): el build de producción sigue siendo estático y sin adaptador.
- Los campos vacíos que escribe Keystatic (source, downloads, dateLabel) se normalizan en el schema de `src/content.config.ts`. Si añades un campo, ponlo en los dos archivos.
- Para que el cliente publique desde producción: `storage: { kind: 'github' }` + un adaptador (Vercel/Netlify) y quitar la condición `isDev`.

### Componentes (Starwind UI)

- Se añaden con `npx starwind@latest add <componente> -y`. Ya instalados: button, input, label, textarea, checkbox, select, card, badge y dialog.
- Se importan desde `@/components/starwind/<nombre>`, por ejemplo `import { Button } from '@/components/starwind/button'`.
- Variantes de Button y Badge: `primary` (marca), `default`, `secondary`, `outline`, `ghost`, `info`, `success`, `warning`, `error`, y las de la marca Nex-Gen: Button `brand`, `dark`, `light`, `contrast` (con `shape="pill"` y tamaños `pill-md`/`pill-lg`); Badge `brand`, `brand-soft`, `light`, `dark`.
- Los componentes interactivos (select, dialog…) traen su propio script vanilla. No hace falta React.
- Formularios: ver «Formularios y correos».

### Formularios y correos (obligatorio)

- **Validación campo por campo con Zod, la misma en el navegador y en el servidor.** Los esquemas viven en `src/lib/forms/schemas.ts` (una clave por `name` de campo, con su mensaje). `src/scripts/forms.ts` (iniciado en `app.ts` con `bindForms()`) valida cada campo al salir de él (blur), lo revalida mientras se corrige y, al enviar, valida todos y lleva el foco al primero con error. Los campos dentro de un `[hidden]` no se validan.
- **Marcado**: `<form data-form="<nombre>" novalidate data-contact-phone data-contact-email>`, cada control dentro de `molecules/FormField.astro` (pinta el error en `[data-field-error]`, marca `[data-invalid]` → borde rojo en `global.css`, y pone `aria-invalid` + `aria-describedby`), `atoms/Honeypot.astro` (campo trampa anti-bots `website`) y `atoms/FormStatus.astro` (enviando / error general / enviado).
- **Envío con Astro Actions** (`src/actions/index.ts`, una action por formulario con el mismo nombre que `data-form` y el mismo esquema como `input`): el servidor vuelve a validar y sus errores por campo se muestran en el mismo sitio. Requiere adaptador (`@astrojs/vercel`); las páginas siguen siendo estáticas.
- **Correos con Resend**: cada envío manda la notificación al equipo (`MAIL_TO`, con `replyTo` del visitante y todos los datos en tabla) y una **autorrespuesta** al visitante con la plantilla de marca (`src/lib/email/layout.ts` + `templates.ts`: tablas, estilos en línea, 600px, imágenes PNG con URL absoluta desde `public/email`). Si falla la autorrespuesta, el mensaje al equipo ya salió.
- Variables (`astro:env`, ver `.env.example`): `RESEND_API_KEY`, `MAIL_TO`, `MAIL_FROM`. Con `onboarding@resend.dev` Resend solo entrega al correo de tu cuenta: para la autorrespuesta a cualquier persona hay que verificar el dominio del sitio en Resend y usar una dirección suya en `MAIL_FROM`. Una API key por proyecto.
- Formulario nuevo: esquema en `schemas.ts` + `formSchemas`, action en `src/actions`, mensaje de éxito en `forms.ts`, textos de los correos en `templates.ts`, y `data-form` en el `<form>`.

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
  - Curva expo de 1.05 s.
  - **Anclas (#seccion)**: las gestiona `initAnchorLinks()` (`smooth-scroll.ts`), un único manejador en captura para que <ClientRouter /> y Lenis no se pisen. Dejan el mismo hueco que el navegador al cargar una URL con #ancla: `scroll-padding-top` de `<html>` (72 px, el header; en `global.css`, junto a `ANCHOR_OFFSET`) + el `scroll-margin-top` del destino. Si hay un menú fijo extra (p. ej. `AnchorNav`), añade su alto al destino con `scroll-mt-*` (`Section` respeta el que le pases por `class`).
  - Los contenedores con scroll propio (modales, listas) siguen con scroll nativo.
  - Para hacer scroll por código, usa `getLenis()?.scrollTo(target)`. Para bloquear la página bajo un menú o modal, usa `lockScroll(true | false)`.
- **Barras de scroll**: las nativas están ocultas. `scrollbars.ts` dibuja un thumb fino superpuesto (`.scroll-thumb` en `global.css`) que aparece al hacer scroll o mover el ratón, se desvanece a los 1.5 s y se puede arrastrar.

### Imágenes (obligatorio)

- **Todas las imágenes pasan por `<Img>`** (`src/components/atoms/Img.astro`): Astro las convierte a **WebP** y genera varias anchuras con `srcset`, así cada pantalla (también las retina) descarga solo lo que necesita. No uses `<img>` a mano.
- Las imágenes locales van en `src/assets/images/` (no en `public/`, que no se optimiza) y se referencian con su ruta `"/images/…"`, que `src/lib/images.ts` resuelve. Guarda el original con buena resolución; Astro hace los tamaños.
- Pasa siempre `sizes` con el ancho real con el que se muestra (p. ej. `sizes="40px"` en un avatar, `sizes="(min-width: 1024px) 33vw, 100vw"` en una tarjeta de 3 columnas). Para un recorte vertical con `object-cover`, calcula el ancho que ocupa la imagen a la altura del marco.
- Remotas (Unsplash, etc.): el dominio debe estar en `image.domains` de `astro.config.mjs`; se descargan y optimizan al compilar.
- Para HTML generado en el navegador (mapas, popups), calcula las URLs en el frontmatter con `getImage()` y pásalas al script.
- `public/` queda solo para lo que no se optimiza: SVG, favicon, vídeos y su poster.

### Convenciones de animación (obligatorias)

- **Nada aparece ni desaparece de golpe, nunca.** Todo lo que se muestra u oculta por JS (mensajes de error y de estado, campos condicionales, tarjetas flotantes, resultados de un filtro, estados vacíos, botones que se esconden) usa `src/scripts/animations/presence.ts` con Motion: `appear`/`disappear`/`toggle` (con `{ height: true }` si está en el flujo, para que lo de abajo no salte), `swapText` para cambiar un texto y `filterList` para listas filtradas. Prohibido `el.hidden = …` o `classList.toggle('hidden')` a pelo. Los espacios (gap/margen) de algo que aparece van dentro del bloque animado. Lo que entra con scroll usa `data-reveal`; modales, acordeones y desplegables ya traen su animación.
- **Todo elemento visible tiene reveal.** Ningún bloque aparece estático: textos, tarjetas, imágenes, listas y footer usan `data-reveal` (o `data-reveal-stagger` en el padre para listas y grupos).
- **Títulos grandes con la entrada del hero.** Todo `h1`/`h2` (y los titulares de tarjeta destacados) es grande, con `font-display` y un `clamp()` generoso (mínimo de `clamp(2rem,4vw,3.4rem)` en títulos de sección), y lleva `data-scene="split-lines"`: entra por líneas cuando aparece en pantalla. No combines `data-scene="split-lines"` y `data-reveal` en el mismo elemento. La máscara de cada línea (`.split-line-mask` en `global.css`) amplía su recorte para no cortar descendentes (g, y, p) con interlineados ajustados; no la quites.
- **Botones y enlaces con flecha entran de izquierda a derecha**: `data-reveal="from-left"`, o `data-reveal-stagger="from-left"` en el contenedor si hay varios.
- **Flechas de botones:** usa `arrow-up-right` girada 45° en reposo (apunta a →) que vuelve a ↗ en hover: `rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-0` (el botón lleva `group`). En Tailwind v4 `rotate-*` y `scale-*` son propiedades propias (`rotate`, `scale`): si escribes una transición a mano, inclúyelas.
- Si un elemento ya se mueve con GSAP (parallax, `data-float`), su reveal es `data-reveal="fade"` para no pelear por el `transform`.

### Reglas

- Respeta siempre `prefers-reduced-motion`.
- El contenido debe verse sin JS: el CSS solo oculta `[data-reveal]` cuando `html` tiene la clase `.js`.
- Anima solo `transform`, `opacity` y `filter`.
- Para cambiar de fuente, edita `fonts` en `astro.config.mjs` y el `cssVariable` del `<Font />`. No uses `@import` de Fontsource ni `<link>` a Google Fonts, porque provocan el salto de fuente al cargar.
- **View transitions activadas** (`<ClientRouter />` en `BaseLayout.astro`): la navegación entre páginas es en el cliente y los scripts de módulo se ejecutan **una sola vez**. Todo lo que se inicialice por página (listeners, observers, escenas de GSAP, mapas, vídeos) va dentro de `onEveryPage(() => { …; return cleanup })` de `src/scripts/lifecycle.ts`: arranca al instante, se reinicia en cada navegación y limpia antes de cambiar de página. Si una función se llama desde varias páginas, protégela para que se registre una sola vez (ver `initHome` o `initHeroVideo`).
- **CSS de librerías (Leaflet, Swiper…) se importa en el componente `.astro` que las usa, nunca desde un script.** Importado desde un script, en desarrollo Vite lo inyecta una sola vez y <ClientRouter /> lo borra al cambiar de página: al volver, la librería se queda sin estilos. En el frontmatter del componente va en el `<head>` de cada página que lo usa.
- `src/pages/index.astro` es una demo: se reemplaza al empezar cada proyecto.

### Skills de diseño incluidas

`.claude/skills/` trae las skills de diseño y animación (impeccable, emil-design-eng, animate, design-taste-frontend, etc.). `.claude/settings.local.json` activa los hooks de impeccable. Su configuración está en `.impeccable/`.
