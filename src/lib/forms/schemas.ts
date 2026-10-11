// Esquemas Zod de los formularios: una sola fuente de reglas y mensajes para la validación campo por campo del
// navegador (src/scripts/forms.ts) y la del servidor (src/actions). Sin imports de servidor: se empaqueta en el cliente.
// Cada clave coincide con el `name` del campo en el formulario.
import { z } from 'astro/zod';
import { audiences, contactSubjects, employmentTypes, usStates } from '@/data/forms';

export const MAX_RESUME = 4 * 1024 * 1024; // límite de cuerpo de las funciones de Vercel: ~4,5 MB
const RESUME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const required = (label: string) => z.string({ error: `${label} is required.` }).trim().min(1, `${label} is required.`);
const name = (label: string) => required(label).max(100, `${label} is too long.`);
const email = z
  .string({ error: 'Email is required.' })
  .trim()
  .min(1, 'Email is required.')
  .pipe(z.email('Enter a valid email, like name@email.com.'));
const validPhone = (v: string) => /^[+()\-.\s\d]{7,20}$/.test(v) && (v.match(/\d/g)?.length ?? 0) >= 7;
const phoneMessage = 'Enter a valid phone number, like (931) 503-7000.';
const phoneRequired = required('Phone').refine(validPhone, phoneMessage);
const phoneOptional = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || validPhone(v), phoneMessage);
const optionalText = (max = 200) => z.string().trim().max(max, 'This is too long.').optional();
const oneOf = (values: readonly string[], message: string) => z.string({ error: message }).refine((v) => values.includes(v), message);
/** Campo trampa para bots (oculto): si llega relleno, no se envía nada */
const honeypot = z.string().optional();

export const contactSchema = z.object({
  name: name('Your name'),
  email,
  phone: phoneOptional,
  subject: oneOf(
    contactSubjects.map((s) => s.value),
    'Choose a subject.',
  ),
  message: required('Message').min(10, 'Tell us a little more (at least 10 characters).').max(3000, 'Your message is too long.'),
  website: honeypot,
});

export const proposalSchema = z.object({
  audience: oneOf(
    audiences.map((a) => a.value),
    'Choose who you are.',
  ),
  name: name('Full name'),
  email,
  phone: phoneOptional,
  units: optionalText(120),
  message: optionalText(3000),
  website: honeypot,
});

export const jobSchema = z.object({
  first_name: name('First name'),
  last_name: name('Last name'),
  email,
  phone: phoneRequired,
  mobile: phoneOptional,
  address: optionalText(),
  address2: optionalText(),
  city: optionalText(100),
  state: oneOf(usStates, 'Choose a state.'),
  zip: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^\d{5}(-\d{4})?$/.test(v), 'Enter a 5-digit ZIP code.'),
  employment: oneOf(
    employmentTypes.map((t) => t.value),
    'Choose the employment you want.',
  ),
  resume: z
    .instanceof(File)
    .optional()
    .refine((f) => !f || f.size === 0 || f.size <= MAX_RESUME, 'Your resume must be 4 MB or smaller.')
    .refine((f) => !f || f.size === 0 || RESUME_TYPES.includes(f.type) || /\.(pdf|docx?)$/i.test(f.name), 'Upload a PDF or Word document.'),
  website: honeypot,
});

export const newsletterSchema = z.object({ email, website: honeypot });

/** Esquema de cada formulario según su `data-form` */
export const formSchemas = {
  contact: contactSchema,
  proposal: proposalSchema,
  job: jobSchema,
  newsletter: newsletterSchema,
} as const;

export type FormName = keyof typeof formSchemas;
