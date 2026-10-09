import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { onEveryPage } from './lifecycle';

interface MapCommunity {
  name: string;
  city: string;
  state: 'TN' | 'KY' | 'AL';
  hasPhoto: boolean;
  /** WebP optimizado para el pin (112px) y para la tarjeta emergente (560px) */
  pin: string;
  card: string;
  url: string | null;
  lat: number;
  lng: number;
  precise: boolean;
}

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Las ubicaciones aproximadas (centro de ciudad) se separan un poco para que no se apilen. */
function spread(list: MapCommunity[]) {
  const seen = new Map<string, number>();
  return list.map((c) => {
    if (c.precise) return c;
    const key = `${c.lat},${c.lng}`;
    const n = seen.get(key) ?? 0;
    seen.set(key, n + 1);
    const angle = n * 2.4;
    const r = 0.012 * (n + 1);
    return { ...c, lat: c.lat + Math.sin(angle) * r, lng: c.lng + Math.cos(angle) * r };
  });
}

function pinIcon(c: MapCommunity) {
  const img = c.hasPhoto
    ? `<img src="${c.pin}" alt="" width="48" height="48" class="size-full object-cover" />`
    : `<img src="${c.pin}" alt="" width="48" height="48" class="size-full bg-white object-contain p-1" />`;
  return L.divIcon({
    className: 'nx-pin',
    html: `<span class="nx-pin-inner">${img}</span>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -26],
  });
}

function cardHtml(c: MapCommunity) {
  const media = c.hasPhoto
    ? `<img src="${c.card}" alt="" class="aspect-[16/10] w-full rounded-xl object-cover" />`
    : `<img src="${c.card}" alt="" class="aspect-[16/10] w-full rounded-xl object-cover" />`;
  const action = c.url
    ? `<a href="${c.url}" target="_blank" rel="noopener" class="shrink-0 rounded-full bg-brand-950 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-800">Visit site</a>`
    : `<span class="shrink-0 text-xs text-neutral-400">Site soon</span>`;
  return `
    <div class="map-card-inner relative w-[260px] rounded-2xl bg-white p-2 shadow-[0_24px_48px_-20px_rgb(7_53_69/0.5)]">
      ${media}
      <div class="flex items-end justify-between gap-3 px-1.5 pt-2.5 pb-1">
        <div class="min-w-0">
          <p class="font-display truncate text-base leading-tight font-semibold tracking-tight text-brand-950">${escape(c.name)}</p>
          <p class="mt-0.5 text-xs text-neutral-500">${escape(c.city)}, ${c.state}${c.precise ? '' : ' · approx.'}</p>
        </div>
        ${action}
      </div>
      <span class="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 rounded-[2px] bg-white" aria-hidden="true"></span>
    </div>`;
}

function mountMap(): VoidFunction | void {
  const el = document.getElementById('properties-map');
  const dataEl = document.getElementById('properties-data');
  if (!el || !dataEl) return;

  const data = spread(JSON.parse(dataEl.textContent ?? '[]') as MapCommunity[]);

  const map = L.map(el, {
    // Zoom en cuartos: el encuadre inicial se ajusta mejor a los pines
    zoomSnap: 0.25,
    zoomControl: false,
    scrollWheelZoom: false, // la rueda hace scroll de la página; el zoom va con Ctrl + rueda (ver abajo)
    attributionControl: true,
  });
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  map.attributionControl.setPrefix(false);

  // Mapa base gris claro (Esri World Light Gray Canvas): el filtro SVG #map-tint de our-properties.astro
  // lo pasa a la escala neutral de Tailwind y oscurece agua, ríos y fronteras para que contrasten.
  const esri = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas';
  L.tileLayer(`${esri}/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`, {
    // Atribución corta para que quepa junto al corte del hero en móvil (la completa está bajo el listado)
    attribution: '&copy; Esri &middot; &copy; OpenStreetMap',
    maxZoom: 16,
  }).addTo(map);

  // Etiquetas por defecto de Esri (ciudades, estados): van en la imagen de la tesela, así que su fuente no se puede cambiar
  L.tileLayer(`${esri}/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`, { maxZoom: 16 }).addTo(map);

  const markers = data.map((c) => {
    const marker = L.marker([c.lat, c.lng], { icon: pinIcon(c), title: c.name, riseOnHover: true });
    return { c, marker };
  });

  // Margen alrededor de los pines: arriba el header y el buscador, abajo el corte con el título
  const narrow = () => el.clientWidth < 640;
  const fitOptions = () => ({
    paddingTopLeft: (narrow() ? [24, 250] : [60, 200]) as L.PointExpression,
    paddingBottomRight: (narrow() ? [24, 170] : [60, 40]) as L.PointExpression,
  });

  const layer = L.featureGroup(markers.map((m) => m.marker)).addTo(map);
  map.fitBounds(layer.getBounds(), fitOptions());

  // Tarjeta de la propiedad: elemento propio (no popup de Leaflet) para poder quedar por encima del buscador
  const cardEl = document.querySelector<HTMLElement>('[data-map-card]');
  let open: (typeof markers)[number] | null = null;
  const placeCard = () => {
    if (!open || !cardEl) return;
    const pt = map.latLngToContainerPoint(open.marker.getLatLng());
    cardEl.style.transform = `translate(${pt.x}px, ${pt.y - 34}px) translate(-50%, -100%)`;
  };
  // Si la tarjeta queda bajo el header o fuera de los bordes, desplaza el mapa lo justo
  const keepCardVisible = () => {
    if (!cardEl) return;
    const card = cardEl.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    const header = document.querySelector('[data-site-header] > div > div')?.getBoundingClientRect().bottom ?? box.top;
    const dy = Math.max(0, Math.max(header, box.top) + 12 - card.top);
    const dxLeft = Math.max(0, box.left + 12 - card.left);
    const dxRight = Math.max(0, card.right - (box.right - 12));
    const dx = dxLeft ? -dxLeft : dxRight;
    if (dx || dy) map.panBy([dx, -dy], { duration: 0.4 });
  };
  const closeCard = () => {
    if (!open || !cardEl) return;
    open.marker.getElement()?.classList.remove('is-active');
    open = null;
    cardEl.hidden = true;
    cardEl.classList.add('pointer-events-none');
  };
  const openCard = (m: (typeof markers)[number]) => {
    if (!cardEl) return;
    open?.marker.getElement()?.classList.remove('is-active');
    open = m;
    m.marker.getElement()?.classList.add('is-active');
    cardEl.innerHTML = cardHtml(m.c);
    cardEl.hidden = false;
    cardEl.classList.remove('pointer-events-none');
    placeCard();
    keepCardVisible();
  };
  markers.forEach((m) => m.marker.on('click', () => openCard(m)));
  map.on('move zoom', placeCard);
  map.on('click', closeCard);
  const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCard();
  document.addEventListener('keydown', onKey);

  // Zoom solo con Ctrl + rueda (o pellizco en trackpad, que llega como rueda con ctrlKey).
  // Sin Ctrl la rueda desplaza la página y aparece un aviso breve.
  const hint = document.querySelector<HTMLElement>('[data-map-hint]');
  let hintTimer = 0;
  let lastZoom = 0;
  const onWheel = (e: WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) {
      if (hint) {
        hint.dataset.show = '';
        window.clearTimeout(hintTimer);
        hintTimer = window.setTimeout(() => delete hint.dataset.show, 1200);
      }
      return;
    }
    e.preventDefault(); // evita el zoom del navegador
    if (hint) delete hint.dataset.show;
    const now = performance.now();
    if (now - lastZoom < 220) return;
    lastZoom = now;
    map.setZoomAround(map.mouseEventToContainerPoint(e), map.getZoom() + (e.deltaY < 0 ? 1 : -1));
  };
  el.addEventListener('wheel', onWheel, { passive: false });

  // Filtros: estado, ciudad y nombre; sincroniza mapa y listado
  const form = document.querySelector<HTMLFormElement>('[data-map-filter]');
  const list = document.querySelectorAll<HTMLLIElement>('[data-property-list] > li');
  const count = document.querySelector('[data-map-count]');
  const empty = document.querySelector<HTMLElement>('[data-empty]');

  const apply = (fit: boolean) => {
    if (!form) return;
    const fd = new FormData(form);
    const state = String(fd.get('state') ?? '');
    const q = String(fd.get('q') ?? '').trim().toLowerCase();
    // La búsqueda encuentra por nombre de la propiedad o por ciudad
    const match = (c: { name: string; state: string; city: string }) =>
      (!state || c.state === state) && (!q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q));

    closeCard();
    layer.clearLayers();
    const visible = markers.filter((m) => match(m.c));
    visible.forEach((m) => layer.addLayer(m.marker));

    let shown = 0;
    list.forEach((li) => {
      const ok = match({ name: li.dataset.name ?? '', state: li.dataset.state ?? '', city: li.dataset.city ?? '' });
      li.hidden = !ok;
      if (ok) shown++;
    });
    if (count) count.textContent = String(visible.length);
    if (empty) empty.hidden = shown > 0;

    if (fit && visible.length) map.flyToBounds(layer.getBounds(), { ...fitOptions(), maxZoom: 13, duration: 0.8 });
  };

  // Indicador deslizante bajo la pastilla de estado elegida
  const indicator = form?.querySelector<HTMLElement>('[data-state-indicator]');
  const moveIndicator = (instant = false) => {
    const checked = form?.querySelector<HTMLInputElement>('input[name="state"]:checked');
    const label = checked?.closest('label');
    if (!indicator || !label) return;
    if (instant) indicator.style.transition = 'none';
    indicator.style.width = `${label.offsetWidth}px`;
    indicator.style.transform = `translateX(${label.offsetLeft}px)`;
    if (instant) {
      void indicator.offsetWidth; // aplica la posición antes de reactivar la transición
      indicator.style.transition = '';
    }
  };
  moveIndicator(true);
  document.fonts.ready.then(() => moveIndicator(true));
  const onResize = () => moveIndicator(true);
  window.addEventListener('resize', onResize);

  // Pastillas de estado: reencuadran el mapa
  form?.querySelectorAll<HTMLInputElement>('input[name="state"]').forEach((r) =>
    r.addEventListener('change', () => {
      moveIndicator();
      apply(true);
    }),
  );
  form?.querySelector('input[name="q"]')?.addEventListener('input', () => apply(false));
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    apply(true);
  });

  // Al pasar por una tarjeta del listado, el pin correspondiente se destaca
  document.querySelectorAll<HTMLElement>('[data-focus-pin]').forEach((card) => {
    const m = markers.find((x) => x.c.name === card.dataset.focusPin);
    if (!m) return;
    card.addEventListener('mouseenter', () => m.marker.getElement()?.classList.add('is-active'));
    card.addEventListener('mouseleave', () => m.marker.getElement()?.classList.remove('is-active'));
  });

  return () => {
    document.removeEventListener('keydown', onKey);
    el.removeEventListener('wheel', onWheel);
    window.clearTimeout(hintTimer);
    window.removeEventListener('resize', onResize);
    map.remove();
  };
}

let bound = false;

/** Monta el mapa en cada visita a la página y lo destruye antes de navegar (<ClientRouter />). */
export function initPropertiesMap() {
  if (bound) return;
  bound = true;
  onEveryPage(mountMap);
}
