// Menú principal (header, menú móvil y footer). Los elementos sin `href` aún no tienen página: se muestran como
// texto, sin enlace. Al crear la página, añade aquí su `href`.
export type NavLeaf = { label: string; href?: string };
export type NavEntry = NavLeaf & { children?: NavLeaf[] };

export const mainNav: NavEntry[] = [
  { label: 'Home', href: '/' },
  { label: 'Our Properties', href: '/our-properties' },
  { label: 'Services', href: '/services' },
  { label: 'Home Sales', href: '/home-sales' },
  { label: 'About', children: [{ label: 'About us', href: '/about' }, { label: 'Meet the team', href: '/team' }, { label: 'Careers', href: '/careers' }] },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

/** Enlaces que ya tienen página (para el footer) */
export const liveNav = mainNav.filter((l) => l.href).map(({ label, href }) => ({ label, href }));

/** ¿El enlace corresponde a la página actual? (la home solo en "/"; el resto también en sus subpáginas) */
export const isActive = (href: string | undefined, pathname: string) => {
  if (!href) return false;
  const path = pathname.replace(/\/$/, '') || '/';
  return href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);
};
