// Contenido de /home-sales. Fuente: nexgenmultifamily.com/home-sales.html (octubre 2026), reescrito en bloques cortos.
import { contact } from './site';

export const salesWays = [
  {
    id: 'buy',
    title: 'Buy a home',
    text: 'Search, showings and offers, with a local guide from the first tour to closing.',
    points: ['Home search', 'Showings', 'Offer to closing'],
    icon: 'home-search',
  },
  {
    id: 'sell',
    title: 'Sell a home',
    text: 'Position your property, market it well and move through every offer with confidence.',
    points: ['Pricing', 'Marketing', 'Offer review'],
    icon: 'sign-right',
  },
  {
    id: 'invest',
    title: 'Investment perspective',
    text: 'A team that manages properties every day, so you see a home the way an owner does.',
    points: ['Rental potential', 'Ownership costs', 'Long-term value'],
    icon: 'chart-line',
  },
] as const;

// Realtors: recortes WebP con fondo transparente (src/assets/images/team/*-cutout.webp)
export const salesRealtors = [
  {
    name: 'Billi Jo Suiter',
    role: 'Broker · Realtor · Owner Agent',
    email: 'bsuiter@nexgenmgmt.us',
    phone: contact.phone,
    phoneHref: contact.phoneHref,
    photo: '/images/team/billi-jo-cutout.webp',
  },
  {
    name: 'Rebecca Strong',
    role: 'Realtor',
    email: 'rstrong@nexgenmgmt.us',
    phone: contact.phone,
    phoneHref: contact.phoneHref,
    photo: '/images/team/rebecca-strong-cutout.webp',
  },
];

export const salesFaq = [
  {
    q: 'Does Nex-Gen help buyers purchase homes in Clarksville, TN?',
    a: 'Yes. We guide home buyers in Clarksville, Tennessee from the home search and showings through the path to closing.',
  },
  {
    q: 'Can Nex-Gen help me sell my home?',
    a: 'Yes. We help homeowners position the property, market it, evaluate offers and move through the sales process.',
  },
  {
    q: 'Who handles home sales for Nex-Gen?',
    a: 'You can work with Billi Jo Suiter, Broker · Realtor · Owner Agent, and Rebecca Strong, Realtor.',
  },
  {
    q: 'Can Nex-Gen help with residential investment properties?',
    a: 'Yes. Our property-management perspective helps when you are considering a home as an investment property.',
  },
  {
    q: 'How do I get started with Nex-Gen Home Sales?',
    a: 'Contact the team and tell us whether you are buying, selling or evaluating an opportunity in the Clarksville area.',
  },
];
