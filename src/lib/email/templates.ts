// Correos de los formularios: notificación al equipo (con todos los datos y "Responder" al remitente) y
// autorrespuesta al visitante con el diseño de Nex-Gen. Cada formulario define sus filas y textos aquí.
import { button, detailsTable, esc, layout, p, space, brand } from './layout';
import { contact } from '@/data/site';

const site = (import.meta.env.SITE ?? 'https://nexgenmultifamily.com').replace(/\/$/, '');

export type FormKind = 'contact' | 'proposal' | 'job' | 'newsletter';

const subjects: Record<FormKind, string> = {
  contact: 'New message from the website',
  proposal: 'New proposal request',
  job: 'New job application',
  newsletter: 'New newsletter subscriber',
};

/** Notificación interna: título, resumen de datos y botón para responder */
export function notification(kind: FormKind, name: string, email: string, rows: [string, string | undefined][]) {
  const subject = `${subjects[kind]}${name ? ` · ${name}` : ''}`;
  const html = layout({
    preheader: `${subjects[kind]} from ${name || email}`,
    eyebrow: 'Website form',
    title: subjects[kind],
    body: [
      p(`Sent from <strong style="color:${brand.dark};">${esc(name || email)}</strong> on ${esc(new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Chicago' }))} (Central).`),
      detailsTable(rows),
      space(28),
      button(`Reply to ${name || 'sender'}`, `mailto:${email}`),
    ].join(''),
  });
  return { subject, html };
}

const replies: Record<FormKind, { subject: string; eyebrow: string; title: (first: string) => string; intro: string; next: string[] }> = {
  contact: {
    subject: 'We got your message · Nex-Gen Management',
    eyebrow: 'Message received',
    title: (first) => `Thanks for reaching out${first ? `, ${first}` : ''}.`,
    intro: 'Your message is with our Clarksville team. We reply within one business day.',
    next: ['We read your message and route it to the right person.', 'You hear back from us by email or phone.', 'Need us sooner? Call the office during business hours.'],
  },
  proposal: {
    subject: 'Your proposal request · Nex-Gen Management',
    eyebrow: 'Proposal request',
    title: (first) => `Let’s talk about your property${first ? `, ${first}` : ''}.`,
    intro: 'Thanks for considering Nex-Gen. We are reviewing your request and will reply within one business day with next steps.',
    next: ['We review the details you shared.', 'We schedule a short call to understand your goals.', 'You receive a proposal built around your property.'],
  },
  job: {
    subject: 'We received your application · Nex-Gen Management',
    eyebrow: 'Application received',
    title: (first) => `Thanks for applying${first ? `, ${first}` : ''}.`,
    intro: 'We review every application personally. If your experience is a fit for an open role, our team will contact you.',
    next: ['We review your application and resume.', 'If there is a fit, we reach out to schedule an interview.', 'We keep your application on file for future openings.'],
  },
  newsletter: {
    subject: 'Welcome to the Nex-Gen newsletter',
    eyebrow: 'You’re subscribed',
    title: () => 'Welcome to the Nex-Gen community.',
    intro: 'You will receive market news, fair housing updates and Nex-Gen events in your inbox.',
    next: ['Market reports for Clarksville and the region.', 'Fair housing news and resources.', 'Invitations to Nex-Gen events and webinars.'],
  },
};

/** Lista numerada de próximos pasos (círculos cian como los pasos del sitio) */
function steps(items: string[]) {
  const rows = items
    .map(
      (item, i) => `<tr>
<td style="width:40px;padding:0 0 14px;vertical-align:top;"><div style="width:28px;height:28px;border-radius:999px;background:${brand.dark};color:${brand.cyan};font-family:${brand.font};font-size:13px;font-weight:700;line-height:28px;text-align:center;">${i + 1}</div></td>
<td style="padding:4px 0 14px;vertical-align:top;font-family:${brand.font};font-size:15px;line-height:1.5;color:${brand.dark};">${esc(item)}</td>
</tr>`,
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>`;
}

/** Autorrespuesta al visitante */
export function autoReply(kind: FormKind, name: string, summary: [string, string | undefined][]) {
  const r = replies[kind];
  const first = name.trim().split(/\s+/)[0] ?? '';
  const html = layout({
    preheader: r.intro,
    eyebrow: r.eyebrow,
    title: r.title(first),
    body: [
      p(esc(r.intro)),
      space(8),
      `<p style="margin:0 0 14px;font-family:${brand.font};font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${brand.muted};">What happens next</p>`,
      steps(r.next),
      summary.length ? space(12) + `<p style="margin:0 0 12px;font-family:${brand.font};font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${brand.muted};">What you sent us</p>` + detailsTable(summary) : '',
      space(28),
      // Bloque destacado oscuro con el contacto directo
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${brand.dark};border-radius:12px;padding:24px;">
<p style="margin:0 0 6px;font-family:${brand.font};font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${brand.cyan};">Talk to us directly</p>
<p style="margin:0;font-family:${brand.font};font-size:16px;line-height:1.6;color:#ffffff;"><a href="${contact.phoneHref}" style="color:#ffffff;text-decoration:none;font-weight:600;">${esc(contact.phone)}</a> · ${esc(contact.hours)}</p>
</td></tr></table>`,
      space(28),
      button('Visit nexgenmultifamily.com', site),
      space(24),
      p(`Warm regards,<br><strong style="color:${brand.dark};">The Nex-Gen Management team</strong>`),
    ].join(''),
  });
  return { subject: r.subject, html };
}
