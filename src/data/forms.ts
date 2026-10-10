// Opciones de los formularios: propuesta (modal de los CTA) y solicitud de empleo.
export const audiences = [
  { value: 'owner', label: 'Property owner or investor' },
  { value: 'resident', label: 'Resident or future resident' },
  { value: 'buyer-seller', label: 'Home buyer or seller' },
  { value: 'job', label: 'Looking for a job' },
];

/** id del modal de propuesta: los CTA lo abren con `opens={PROPOSAL_DIALOG}` */
export const PROPOSAL_DIALOG = 'proposal-dialog';

// Solicitud de empleo (/careers): mismos campos que el formulario de nexgenmultifamily.com/careers.html
export const employmentTypes = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'either', label: 'Either' },
];

export const usStates = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida',
  'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
];

// Formulario de contacto (/contact): motivo del mensaje
export const contactSubjects = [
  { value: 'general', label: 'General question' },
  { value: 'management', label: 'Property management' },
  { value: 'resident', label: 'Resident or leasing' },
  { value: 'home-sales', label: 'Buying or selling a home' },
  { value: 'careers', label: 'Careers' },
];

// Atajos de /contact: cada perfil, a su página
export const contactPaths = [
  { title: 'Own or plan to buy a property?', text: 'Get a proposal built around your asset.', href: '/services', icon: 'building-estate' },
  { title: 'Looking for a home?', text: 'Explore our communities and visit each property’s site.', href: '/our-properties', icon: 'home-search' },
  { title: 'Buying or selling a home?', text: 'Talk to our realtors in Clarksville.', href: '/home-sales', icon: 'sign-right' },
  { title: 'Want to join the team?', text: 'Send your application and resume.', href: '/careers', icon: 'users-group' },
];
