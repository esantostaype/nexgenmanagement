// Menú principal (header, menú móvil y footer). Los elementos sin `href` aún no tienen página: se muestran como
// texto, sin enlace. Al crear la página, añade aquí su `href`.
export type NavLeaf = { label: string; href?: string };
export type NavEntry = NavLeaf & { children?: NavLeaf[] };

export const mainNav: NavEntry[] = [
  { label: 'Home', href: '/' },
  { label: 'Our Properties', href: '/our-properties' },
  { label: 'Services', href: '/#services' },
  { label: 'Home Sales' },
  { label: 'About', children: [{ label: 'About us' }, { label: 'Meet the team' }, { label: 'Careers' }] },
  { label: 'Blog' },
  { label: 'Contact' },
];

/** Enlaces que ya tienen página (para el footer) */
export const liveNav = mainNav.filter((l) => l.href).map(({ label, href }) => ({ label, href }));
