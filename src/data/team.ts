// Contenido de /team. Fuente: nexgenmultifamily.com/meet-the-team.html y team.html (octubre 2026).
// Las bios son las publicadas (solo cuatro personas tienen bio); las aficiones y el valor destacado se sacan de ellas,
// sin inventar datos. Fotos: recortes con fondo transparente (src/assets/images/team/*-cutout.webp).

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  photo?: string;
  /** Avatar 160×160 (cabeza y hombros, fondo transparente): src/assets/images/team/avatars */
  avatar?: string;
  bio?: {
    paragraphs: string[];
    /** Fuera del trabajo (pastillas) */
    personal?: string[];
    /** Valor de "COMMUNITY" que se ve en su bio */
    value: { word: string; text: string };
    /** Trayectoria (más reciente primero) */
    experience?: { years: string; title: string; text: string }[];
  };
};

const cutout = (slug: string) => `/images/team/${slug}-cutout.webp`;

const withAvatar = (m: TeamMember): TeamMember => (m.photo ? { ...m, avatar: `/images/team/avatars/${m.slug}.webp` } : m);

export const teamMembers: TeamMember[] = (
  [
  {
    slug: 'billi-jo-suiter',
    name: 'Billi Jo Suiter',
    role: 'CEO & Owner',
    photo: '/images/team/billi-jo-cutout.webp',
    bio: {
      paragraphs: [
        'Billi Jo was raised in Clarksville, TN and has a passion for multifamily property management. She began her career in commercial property management in 1996, and in 1999 focused on her true heart and passion: the multifamily industry.',
        'She has operated numerous communities and portfolios, from unit-based section 8 housing to LIHTC and luxury communities, and spent eight years as Director of Property Operations for luxury class A developments and lease-ups across Tennessee, Arkansas, Alabama, Kentucky and Kansas.',
        'Mid-way into 2018, she and her partner Benjamin Stanley opened Nex-Gen Management, which provides third-party management for assets of 48 units or more in a single location.',
        'Seeing a serious lack of education in the local rental market, she formed the Property Management Association of Clarksville (PMAC) in 2016. The non-profit meets monthly and has over 200 members.',
        'Billi Jo is married to James Suiter; they share two adult children and four grandchildren. She enjoys the outdoors, hiking and time with family and friends.',
      ],
      personal: ['Hiking', 'The outdoors', 'Family & friends'],
      value: { word: 'Unity', text: 'She brought the local rental community together by founding PMAC, a non-profit with 200+ members.' },
      experience: [
        { years: '2002 – today', title: 'Realtor', text: 'Full-service Realtor' },
        { years: '2018 – today', title: 'Nex-Gen Management', text: 'Co-owner, managing large multifamily assets' },
        { years: '1999 – 2018', title: 'Private property management', text: 'Managed large multifamily assets' },
      ],
    },
  },
  {
    slug: 'katie-newcomb',
    name: 'Katie Newcomb',
    role: 'Director of Operations',
    photo: cutout('katie-newcomb'),
    bio: {
      paragraphs: [
        'Katie was raised in Orfordville, WI, and has been in the multifamily industry since 2014. She has taken struggling properties and turned them into profitable and enjoyable communities.',
        'She has managed properties in Wisconsin, Virginia, Kentucky and Tennessee, and sits on the PMAC board, where she focuses on marketing: bringing new vendors and members helps the entire property management field succeed.',
        'Katie is married to Andrew, a stepmom, and has two cats and a dog. She enjoys camping, hiking and fishing, and truly loves having cookouts with friends.',
      ],
      personal: ['Camping', 'Hiking', 'Fishing', 'Cookouts'],
      value: { word: 'Navigate', text: 'She finds new routes for struggling properties and turns them into profitable, enjoyable communities.' },
    },
  },
  {
    slug: 'rebecca-strong',
    name: 'Rebecca Strong',
    role: 'Multi-Site Manager · Affiliate Broker',
    photo: '/images/team/rebecca-strong-cutout.webp',
  },
  {
    slug: 'melissa-stokes',
    name: 'Melissa Stokes',
    role: 'Regional Manager',
    photo: cutout('melissa-stokes'),
    bio: {
      paragraphs: [
        'Melissa is a multi-site Property Manager with Nex-Gen Management and has been in property management for 22 years.',
        'She has a great appreciation for the industry, recognizes and values the trust that prospects and residents place in her, and strives every day to exceed her residents’ expectations.',
      ],
      value: { word: 'Trustworthiness', text: '“I recognize and value the trust that my prospects and residents place in me.”' },
    },
  },
  { slug: 'connie-johnson', name: 'Connie Johnson', role: 'Regional Manager', photo: cutout('connie-johnson') },
  { slug: 'amanda-gundrum', name: 'Amanda Gundrum', role: 'Regional Manager', photo: cutout('amanda-gundrum') },
  { slug: 'crystal-burch-herder', name: 'Crystal Burch Herder', role: 'Regional Manager', photo: cutout('crystal-burch-herder') },
  { slug: 'margaret-robison', name: 'Margaret Robison', role: 'Accounting Manager' },
  {
    slug: 'diego-santos',
    name: 'Diego Santos',
    role: 'Accounting Assistant',
    photo: cutout('diego-santos'),
    bio: {
      paragraphs: [
        'Diego supports the financial operations and accounting processes behind Nex-Gen’s multifamily portfolio, combining a strong academic background in finance with a detail-driven mindset.',
        'He earned his bachelor’s degree in business administration and finance from the Universidad Peruana de Ciencias Aplicadas in Peru.',
        'His interests include property accounting, financial analysis and operational improvement. At Nex-Gen he is recognized for his work ethic, analytical thinking and enthusiasm for learning.',
      ],
      value: { word: 'Innovative', text: 'Always looking for better ways of working, with a focus on excellence, accountability and continuous improvement.' },
    },
  },
  { slug: 'tia-dodd', name: 'Tia Dodd', role: 'Office Coordinator', photo: cutout('tia-dodd') },
  ] as TeamMember[]
).map(withAvatar);

/** Id del modal con la bio de cada persona */
export const bioDialogId = (slug: string) => `bio-${slug}`;

// Valores de la empresa: sus iniciales forman COMMUNITY
export const coreValues = [
  { letter: 'C', word: 'Compassion', text: 'Empathy and support in times of need, to connect on a deeper level and build meaningful relationships.' },
  { letter: 'O', word: 'Opportunity', text: 'The chance to pursue our dreams and make a positive impact in the world.' },
  { letter: 'M', word: 'Motivation', text: 'The driving force behind our actions. It sets us apart as we achieve our goals.' },
  { letter: 'M', word: 'Meaningful', text: 'Work aligned with our values and passions, fulfilling and rewarding.' },
  { letter: 'U', word: 'Unity', text: 'Stronger together than apart. As a community we can accomplish great things.' },
  { letter: 'N', word: 'Navigate', text: 'Seeking alternate routes and new ways to approach every challenge.' },
  { letter: 'I', word: 'Innovative', text: 'Always looking for new and better ways of doing things.' },
  { letter: 'T', word: 'Trustworthiness', text: 'The foundation of healthy relationships, built on mutual respect and understanding.' },
  { letter: 'Y', word: 'Yes', text: 'A powerful word that opens doors: saying yes to new challenges helps us grow.' },
];
