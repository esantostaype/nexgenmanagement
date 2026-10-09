/**
 * Ciclo de vida con <ClientRouter /> (view transitions de Astro).
 *
 * Con navegación en el cliente, los scripts de módulo se ejecutan una sola vez: lo que se
 * inicializa por página tiene que volver a arrancar en cada navegación y limpiarse antes de
 * cambiar de página. `onEveryPage` lo hace:
 * - arranca en cuanto el script se ejecuta (sin esperar al `load` de la ventana, que espera a
 *   imágenes y vídeos);
 * - vuelve a arrancar en cada `astro:page-load` posterior (el primero se omite: es la misma página);
 * - limpia en `astro:before-swap` con la función que devolvió `start`.
 *
 * `start` debe ser tolerante: en páginas donde no existan sus elementos, simplemente no hace nada.
 */
export function onEveryPage(start: () => VoidFunction | void) {
  let cleanup: VoidFunction | undefined;
  let skipNextLoad = true;

  const run = () => {
    cleanup?.();
    cleanup = start() || undefined;
  };

  run();

  document.addEventListener('astro:page-load', () => {
    if (skipNextLoad) {
      skipNextLoad = false;
      return;
    }
    run();
  });

  document.addEventListener('astro:before-swap', () => {
    cleanup?.();
    cleanup = undefined;
  });
}
