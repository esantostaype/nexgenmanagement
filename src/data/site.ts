// Contenido del sitio de Nex-Gen. Fuente: nexgenmultifamily.com (octubre 2026) y PRODUCT.md.
// Todo lo marcado TO_CONFIRM es un marcador visible hasta que el cliente dé el dato real.

export const TO_CONFIRM = '[to confirm]';

export const contact = {
  phone: '(931) 503-7000',
  phoneHref: 'tel:+19315037000',
  email: 'bsuiter@nexgenmgmt.us',
  address: ['705 Red River St STE B', 'Clarksville, TN 37043'],
  hours: 'Mon–Fri · 9AM–5PM',
  mapsHref: 'https://maps.google.com/?q=705+Red+River+St+STE+B+Clarksville+TN+37043',
};

// Redes sociales (las mismas que enlaza nexgenmultifamily.com)
export const social = [
  { label: 'Facebook', href: 'https://www.facebook.com/nexgenmgmt.us', icon: 'facebook' },
  { label: 'Instagram', href: 'https://instagram.com/nex_gen_mgmt', icon: 'instagram' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/nex-gen-management/', icon: 'linkedin' },
  { label: 'X (Twitter)', href: 'https://twitter.com/NexGenMFM', icon: 'x' },
] as const;

// Enlaces del portal de residentes: el proveedor aún no está confirmado.
export const residentLinks = [
  { label: 'Pay rent', href: '#residents' },
  { label: 'Maintenance request', href: '#residents' },
  { label: 'Resident portal', href: '#residents' },
];

export const nav = [
  { label: 'Owners & Investors', href: '#owners' },
  { label: 'Properties', href: '#communities' },
  { label: 'Residents', href: '#residents' },
  { label: 'Buy & Sell', href: '#home-sales' },
  { label: 'About', href: '#team' },
];

export const paths = [
  {
    id: 'owners',
    label: 'Owners & investors',
    line: 'Hand us the keys, keep the visibility.',
    href: '#owners',
  },
  {
    id: 'residents',
    label: 'Residents',
    line: 'Find a home, pay rent, request repairs.',
    href: '#residents',
  },
  {
    id: 'buy-sell',
    label: 'Buy & sell',
    line: 'Local real estate with an owner’s eye.',
    href: '#home-sales',
  },
];

// Los nueve servicios del sitio actual, agrupados por etapa de la inversión.
export const lifecycle = [
  {
    step: 'Evaluate & acquire',
    text: 'We help you find, assess and buy assets that fit your goals, with numbers you can defend.',
    services: ['Due diligence', 'Acquisition', 'Consulting'],
  },
  {
    step: 'Plan',
    text: 'Budgets written for each property’s reality, not a template, and accounting from day one.',
    services: ['Budget writing', 'Listings on/off market accounting'],
  },
  {
    step: 'Operate',
    text: 'Hands-on teams on site, annual inspections and file audits that keep the asset compliant.',
    services: ['Day-to-day management', 'Annual inspections', 'File audits'],
  },
  {
    step: 'Report',
    text: 'A weekly read on performance and monthly financials, so you always know where you stand.',
    services: ['Weekly reports', 'Monthly financials'],
  },
];

export const team = [
  { name: 'Billi Jo Suiter', role: 'CEO & Owner', photo: '/images/team/billi-jo-suiter.webp' },
  { name: 'Katie Newcomb', role: 'Director of Operations', photo: '/images/team/katie-newcomb.webp' },
  { name: 'Rebecca Strong', role: 'Multi-Site Manager · Affiliate Broker', photo: '/images/team/rebecca-strong.webp' },
  { name: 'Melissa Stokes', role: 'Regional Manager', photo: '/images/team/melissa-stokes.webp' },
  { name: 'Connie Johnson', role: 'Regional Manager', photo: '/images/team/connie-johnson.webp' },
  { name: 'Amanda Gundrum', role: 'Regional Manager', photo: '/images/team/amanda-gundrum.webp' },
  { name: 'Crystal Burch Herder', role: 'Regional Manager', photo: '/images/team/crystal-burch-herder.webp' },
  { name: 'Margaret Robison', role: 'Accounting Manager' },
  { name: 'Diego Santos', role: 'Accounting Assistant', photo: '/images/team/diego-santos.webp' },
  { name: 'Tia Dodd', role: 'Office Coordinator', photo: '/images/team/tia-dodd.webp' },
];

export const values = ['Compassion', 'Opportunity', 'Motivation', 'Meaningful', 'Unity'];

export const realtors = [
  { name: 'Billi Jo Suiter', role: 'Broker · Realtor · Owner Agent', email: 'bsuiter@nexgenmgmt.us' },
  { name: 'Rebecca Strong', role: 'Realtor', email: 'rstrong@nexgenmgmt.us' },
];

// Testimonios: marcadores hasta tener citas reales con permiso del cliente.
export const testimonials = [
  { quote: `${TO_CONFIRM} A short quote from a property owner about reporting and results.`, name: TO_CONFIRM, role: 'Owner' },
  { quote: `${TO_CONFIRM} A short quote from a resident about maintenance and the on-site team.`, name: TO_CONFIRM, role: 'Resident' },
  { quote: `${TO_CONFIRM} A short quote from a home seller about the sale process.`, name: TO_CONFIRM, role: 'Home seller' },
];

// Fotos de stock (Unsplash) a reemplazar por fotografía real de las comunidades.
const unsplash = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const photos = {
  hero: { src: unsplash('1638973140785-3b918e290682', 1200), alt: 'Brick apartment property with private balconies', stock: true },
  dusk: { src: unsplash('1610286986642-057ece0c3656', 2000), alt: 'Apartment building at dusk with lit windows', stock: true },
  signing: { src: unsplash('1562564055-71e051d33c19', 1400), alt: 'Owner reviewing and signing a management agreement', stock: true },
  pool: { src: '/images/gallery/SIP00111.webp', alt: 'Resort-style pool and sun deck at a Nex-Gen property', stock: false },
  pavilion: { src: '/images/gallery/SIP00143.webp', alt: 'Covered grilling pavilion with outdoor kitchen', stock: false },
  living: { src: '/images/gallery/living-room4.webp', alt: 'Furnished living room in a Nex-Gen apartment', stock: false },
  kitchen: { src: '/images/gallery/kitchen.webp', alt: 'Kitchen with island seating at The Oakley at Pro Park', stock: false },
  resident: { src: '/images/gallery/bg3.jpg', alt: 'Resident using the online portal on a laptop', stock: true },
};

// ------------------------------------------------------------------ Home 2

// Los nueve servicios del sitio actual, agrupados en cuatro líneas, cada una con su página interna.
export const serviceLines = [
  {
    title: 'Property management',
    text: 'On-site teams, leasing, maintenance and resident care for multifamily properties.',
    services: ['On-site management', 'Annual inspections', 'File audits'],
    href: '/services/property-management',
    photo: '/images/properties/the-flats-at-lancaster.webp',
  },
  {
    title: 'Reporting & financials',
    text: 'A weekly read on performance and monthly financials with variance to budget.',
    services: ['Weekly reports', 'Monthly financials', 'Budget writing'],
    href: '/services/reporting',
    photo: '/images/properties/the-gables.webp',
  },
  {
    title: 'Acquisitions & due diligence',
    text: 'We help you evaluate, underwrite and take over assets that fit your goals.',
    services: ['Due diligence', 'Acquisition', 'Listings on/off market accounting'],
    href: '/services/acquisitions',
    photo: '/images/properties/the-rowe-at-gate-1.webp',
  },
  {
    title: 'Consulting',
    text: 'Advice to optimize the performance and value of real estate assets for owners and investors.',
    services: ['Asset performance review', 'Value optimization'],
    href: '/services/consulting',
    photo: '/images/properties/the-kensington.webp',
  },
];

export const award = {
  title: 'Management Company of the Year',
  by: 'Property Management Association of Clarksville',
  year: '2024',
  href: 'https://www.pmaofclarksville.com/',
  photo: '/images/blog/award_nexgen.jpg',
};

// Últimos posts del blog actual (nexgenmultifamily.com/blog.html). Las páginas de detalle aún no existen.
export const posts = [
  {
    title: 'Management Company of the Year Award',
    date: '2024-10-01',
    category: 'Recognition',
    excerpt: 'Recognized at the Golden Legacy Awards Gala by the Property Management Association of Clarksville.',
    image: '/images/blog/award_nexgen.jpg',
    href: '/blog/management-company-of-the-year',
  },
  {
    title: 'Fair Housing Newsletter',
    date: '2024-10-02',
    category: 'Fair housing',
    excerpt: 'Keeping you current on fair housing news and issues, with attorney Angelita Fisher.',
    image: '/images/blog/news_letter.jpg',
    href: '/blog/fair-housing-newsletter',
  },
  {
    title: 'Nex-Gen Events 2024',
    date: '2024',
    category: 'Events',
    excerpt: 'Networking, industry insights and workshops tailored for property professionals.',
    image: '/images/blog/events.jpg',
    href: '/blog/nex-gen-events-2024',
  },
  {
    title: 'From a $1 ballpark to $14 million in luxury apartments',
    date: '2024-07-18',
    category: 'Industry',
    excerpt: 'How an abandoned baseball stadium in Indianapolis became a sought-after apartment community.',
    image: '/images/blog/stadium.jpg',
    href: '/blog/ballpark-to-apartments',
  },
];

// ------------------------------------------------------------------ Servicios (nexgenmultifamily.com/services.html)
// Orden del ciclo de la inversión. Imágenes de Unsplash (referencia temática, no son de Nex-Gen).
const svcImg = (id: string) => `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`;

export const services = [
  {
    slug: 'due-diligence',
    title: 'Due Diligence',
    text: 'A thorough review of financials, operations, compliance and market before you commit.',
    tags: ['Acquire', 'Investors'],
    icon: 'file-search',
    image: svcImg('1652878530627-cc6f063e3947'),
  },
  {
    slug: 'acquisition',
    title: 'Acquisition',
    text: 'We help you find and buy assets that fit your goals, from first look to closing.',
    tags: ['Acquire', 'Investors'],
    icon: 'building-estate',
    image: svcImg('1624204386084-dd8c05e32226'),
  },
  {
    slug: 'consulting',
    title: 'Consulting Services',
    text: 'Valuation, market research and operations advice to unlock an asset’s full potential.',
    tags: ['Strategy', 'Owners'],
    icon: 'bulb',
    image: svcImg('1551836022-d5d88e9218df'),
  },
  {
    slug: 'budget-writing',
    title: 'Budget Writing',
    text: 'Budgets built around each property’s real needs, goals and long-term plan.',
    tags: ['Plan', 'Annual'],
    icon: 'calculator',
    image: svcImg('1707157284454-553ef0a4ed0d'),
  },
  {
    slug: 'listings-accounting',
    title: 'Listings On/Off Market Accounting',
    text: 'Clean, compliant accounting for every listing, whether it is on the market or not.',
    tags: ['Plan', 'Leasing'],
    icon: 'file-invoice',
    image: svcImg('1760898002480-a89156856aa0'),
  },
  {
    slug: 'weekly-reports',
    title: 'Weekly Reports',
    text: 'Performance updates with clear, actionable recommendations every week.',
    tags: ['Report', 'Weekly'],
    icon: 'report-analytics',
    image: svcImg('1542744173-05336fcc7ad4'),
  },
  {
    slug: 'monthly-financials',
    title: 'Monthly Financials',
    text: 'Revenue, expenses, cash flow and profitability, transparent every month.',
    tags: ['Report', 'Monthly'],
    icon: 'report-money',
    image: svcImg('1626266061368-46a8f578ddd6'),
  },
  {
    slug: 'annual-inspections',
    title: 'Annual Inspections',
    text: 'Structure, building systems and safety checked against code, every year.',
    tags: ['Operate', 'Yearly'],
    icon: 'clipboard-check',
    image: svcImg('1748027869634-fc2e545cfb0c'),
  },
  {
    slug: 'file-audits',
    title: 'File Audits',
    text: 'Leases, records and statements reviewed for accuracy and compliance.',
    tags: ['Operate', 'Compliance'],
    icon: 'folders',
    image: svcImg('1544396821-4dd40b938ad3'),
  },
];

// Testimonios reales publicados en nexgenmultifamily.com/services.html (octubre 2026), texto literal; "…" marca recortes
export const realTestimonials = [
  { quote: 'Nex-Gen has done a fabulous job managing our property. I highly recommend them. Our tenants are treated with care and consideration while keeping in mind needs of owners and investors as well.', name: 'Kevin Romney' },
  { quote: 'Nex-Gen manages two of my properties and are fantastic! They’re easy to work with, quick to respond, and always provide great service.', name: 'Shawn Massey' },
  { quote: 'I have had a formal business relationship with Nex-Gen Management for more than 2 years. In that period of time i’ve found them to be very responsive to my needs and desires. Their record-keeping and accounting are unparalleled…', name: 'Patrick Sullivan' },
  { quote: 'When it comes to protecting client interest and customer experience, NexGen is next level. Thank you for handling our properties.', name: 'Anthony Daley' },
  { quote: 'Great property management company. They do an excellent job of addressing issues in a timely manner and keeping the property safe/clean. They really care about the people they work with.', name: 'Jason Stubblefield' },
  { quote: 'Nex-Gen has a great property management team. They provide excellent and professional customer service to residents…', name: 'Jason DiStefano' },
  { quote: 'The whole team cares about the resident experience and making sure everybody is taken care of.', name: 'Mike Taravella' },
  { quote: 'Billi Jo Suiter is a highly integral business professional who I have enjoyed doing business with.', name: 'Barbara Clark' },
  { quote: 'Billi at Next-Gen has been good to work with and helpful. This company seems like a solid multi-family manager in the Clarksville market.', name: 'Landon Murie' },
  { quote: 'SUPERB and Quality Service is what you get from Nex-Gen Management LLC. They know what to do to excel and stand out in the market place…', name: 'Yolanda McDaniel' },
];
