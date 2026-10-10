// Página /services: los 9 servicios agrupados por etapa del ciclo de la inversión, en formato infografía.
// Textos condensados de nexgenmultifamily.com/services.html (octubre 2026): solo lo que dice el original,
// sin cifras ni promesas añadidas. La imagen, el icono y la frase corta de cada servicio salen de `services` (site.ts).
import { services } from './site';

type Item = string;
export type ServiceDetail = {
  slug: string;
  /** Titular corto (una línea) */
  headline: string;
  /** Párrafo breve (una o dos frases) */
  summary: string;
  /** Grupos de pastillas: "What we evaluate", "Documents we review"… */
  groups?: { title: string; items: Item[] }[];
  /** Pasos numerados del proceso */
  steps?: { title: string; items: Item[] };
  /** Lo que recibe el cliente */
  deliverable: { title: string; text: string };
  /** Para quién es */
  audience?: Item[];
};

export const serviceDetails: ServiceDetail[] = [
  {
    slug: 'due-diligence',
    headline: 'Know exactly what you’re buying.',
    summary: 'A full assessment before you commit, so every decision rests on facts and the risks show up early.',
    groups: [{ title: 'What we evaluate', items: ['Financial performance', 'Operational efficiency', 'Regulatory compliance', 'Market dynamics'] }],
    deliverable: { title: 'Clear insights', text: 'A comprehensive read on the property to support an informed decision and reduce investment risk.' },
    audience: ['Investors', 'Property owners', 'Real estate professionals'],
  },
  {
    slug: 'acquisition',
    headline: 'From first look to closing.',
    summary: 'We find assets that match your investment goals and guide you through every step of the transaction.',
    steps: {
      title: 'How it works',
      items: ['Define your goals, risk tolerance and target market', 'Research the market and run due diligence', 'Evaluate each candidate asset', 'Complete the transaction'],
    },
    groups: [{ title: 'What we weigh', items: ['Location', 'Market trends', 'Income potential', 'Property condition'] }],
    deliverable: { title: 'The right asset', text: 'Opportunities that fit your strategy, backed by our network and industry experience.' },
    audience: ['Investors'],
  },
  {
    slug: 'consulting',
    headline: 'Unlock an asset’s full potential.',
    summary: 'Expert guidance focused on optimization, with a transparent approach and measurable results.',
    groups: [{ title: 'Areas we cover', items: ['Asset valuation', 'Market research', 'Financial analysis', 'Tenant relations', 'Sustainability initiatives'] }],
    deliverable: { title: 'Measurable results', text: 'Advice built for long-term success and profitability, delivered with transparency and integrity.' },
    audience: ['Property owners', 'Investors', 'Real estate professionals'],
  },
  {
    slug: 'budget-writing',
    headline: 'A budget built for your property, not a template.',
    summary: 'Every property is different. We start from its real numbers and your goals, then plan for growth and resilience.',
    steps: {
      title: 'Our process',
      items: ['Assess current finances, operational needs and long-term goals', 'Align with your priorities, constraints and expectations', 'Build a plan for today’s targets and sustainable growth'],
    },
    deliverable: { title: 'A tailored financial plan', text: 'A budget that meets immediate targets and holds up as the market changes.' },
  },
  {
    slug: 'listings-accounting',
    headline: 'Every listing accounted for, on or off the market.',
    summary: 'Specialized accounting that keeps listings transparent, accurate and compliant with industry standards.',
    groups: [{ title: 'What it’s for', items: ['Maximize exposure', 'Attract qualified buyers or tenants', 'Optimize property value'] }],
    deliverable: { title: 'Regular reports', text: 'Financial reports and updates so you can adjust your investment strategy with confidence.' },
  },
  {
    slug: 'weekly-reports',
    headline: 'Every week: performance, status and next steps.',
    summary: 'Insights and actionable recommendations, backed by analytics and industry benchmarks.',
    groups: [{ title: 'Inside each report', items: ['Property performance and status', 'Trends and opportunities', 'Potential challenges', 'Recommendations to improve returns'] }],
    deliverable: { title: 'Proactive updates', text: 'Transparent, regular communication that keeps you informed at every step.' },
  },
  {
    slug: 'monthly-financials',
    headline: 'Your property’s financial health, every month.',
    summary: 'A clear, accurate picture of how the property performs financially, month after month.',
    groups: [{ title: 'Key metrics', items: ['Revenue', 'Expenses', 'Cash flow', 'Profitability'] }],
    deliverable: { title: 'Financial clarity', text: 'The numbers you need to plan, optimize resources and spot room for growth.' },
  },
  {
    slug: 'annual-inspections',
    headline: 'Once a year, the whole building checked.',
    summary: 'A thorough evaluation of safety, functionality and compliance, from the foundations to the fire systems.',
    groups: [
      { title: 'Structure', items: ['Foundations', 'Roofing', 'Building materials'] },
      { title: 'Building systems', items: ['Electrical', 'Plumbing', 'HVAC', 'Fire suppression'] },
    ],
    deliverable: { title: 'A condition report', text: 'Wear, damage and potential hazards identified, and systems verified against industry standards.' },
  },
  {
    slug: 'file-audits',
    headline: 'Files that are complete, accurate and compliant.',
    summary: 'Experienced auditors review property files to keep records in order and management efficient.',
    groups: [
      { title: 'Documents we review', items: ['Leases', 'Tenant agreements', 'Financial statements', 'Maintenance records', 'Regulatory documents'] },
      { title: 'What we verify', items: ['Up to date', 'Accurately documented', 'Compliant with laws and standards'] },
    ],
    deliverable: { title: 'Actionable insights', text: 'Findings that help optimize management practices and overall efficiency.' },
  },
];

/** Etapas del ciclo de la inversión (orden de la página y de la navegación) */
export const serviceStages = [
  {
    id: 'acquire',
    label: 'Acquire',
    title: 'Buy with confidence.',
    text: 'Research, evaluation and expert advice before and during every acquisition.',
    slugs: ['due-diligence', 'acquisition', 'consulting'],
  },
  {
    id: 'plan',
    label: 'Plan',
    title: 'Plan around the property.',
    text: 'Budgets and listing accounting shaped by each property’s real needs.',
    slugs: ['budget-writing', 'listings-accounting'],
  },
  {
    id: 'report',
    label: 'Report',
    title: 'Always know where you stand.',
    text: 'Weekly and monthly reporting with clear numbers and next steps.',
    slugs: ['weekly-reports', 'monthly-financials'],
  },
  {
    id: 'protect',
    label: 'Protect',
    title: 'Safe, compliant, documented.',
    text: 'Yearly inspections and file audits that keep the property and its records in order.',
    slugs: ['annual-inspections', 'file-audits'],
  },
];

/** Ritmo de reportes e inspecciones */
export const serviceCadence = [
  { when: 'Every week', title: 'Weekly reports', text: 'Performance, status and recommendations.', slug: 'weekly-reports' },
  { when: 'Every month', title: 'Monthly financials', text: 'Revenue, expenses, cash flow and profitability.', slug: 'monthly-financials' },
  { when: 'Every year', title: 'Budget & inspection', text: 'A new tailored budget and a full building inspection.', slug: 'annual-inspections' },
];

/** Servicio completo: datos de la home (título, imagen, icono, etiquetas) + detalle de la página */
export const getService = (slug: string) => {
  const base = services.find((s) => s.slug === slug)!;
  const detail = serviceDetails.find((d) => d.slug === slug)!;
  return { ...base, ...detail };
};
