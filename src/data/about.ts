// Contenido de /about. Fuente: nexgenmultifamily.com (sección "What Makes Us Special" de la home, bio de Billi Jo en
// team.html y el premio de 2024), octubre 2026. Condensado sin inventar datos.

export const aboutMission = {
  title: 'What makes us special.',
  text: 'Our mission: the most comprehensive and reliable range of services, so building operations run as smoothly and cost-effectively as possible.',
  points: [
    {
      icon: 'list-check',
      title: 'Everything in one team',
      text: 'Acquisition, budgets, reporting, inspections and audits for residential and commercial owners.',
    },
    {
      icon: 'device-analytics',
      title: 'Owners see it in real time',
      text: 'State-of-the-art technology keeps you informed of how your investment is doing, as it happens.',
    },
    {
      icon: 'tool',
      title: 'Residents get answers fast',
      text: 'Real-time access to maintenance requests and billing for the people who live in our properties.',
    },
  ],
} as const;

// Hitos sacados de la bio de Billi Jo Suiter y del premio de PMAC
export const aboutTimeline = [
  { year: '1996', title: 'A career begins', text: 'Billi Jo Suiter starts in commercial property management in Clarksville.' },
  { year: '1999', title: 'All in on multifamily', text: 'From section 8 and LIHTC to luxury class A lease-ups across five states.' },
  { year: '2016', title: 'PMAC is founded', text: 'The Property Management Association of Clarksville: a non-profit that now has 200+ members.' },
  { year: '2018', title: 'Nex-Gen opens', text: 'Billi Jo and Benjamin Stanley launch Nex-Gen Management, focused on multifamily.' },
  { year: '2024', title: 'Company of the Year', text: 'Management Company of the Year at the PMAC Golden Legacy Awards.' },
];
