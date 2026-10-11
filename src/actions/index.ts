// Astro Actions de los formularios. Validan con los mismos esquemas Zod que el navegador (src/lib/forms/schemas.ts)
// y envían dos correos con Resend: la notificación al equipo (MAIL_TO, con "Responder" al visitante) y la
// autorrespuesta al visitante. Plantillas en src/lib/email. Si llega relleno el campo trampa `website`, es un bot:
// se responde OK sin enviar nada.
import { ActionError, defineAction } from 'astro:actions';
import { MAIL_FROM, MAIL_TO, RESEND_API_KEY } from 'astro:env/server';
import { Resend } from 'resend';
import { audiences, contactSubjects, employmentTypes } from '@/data/forms';
import { contactSchema, jobSchema, newsletterSchema, proposalSchema } from '@/lib/forms/schemas';
import { autoReply, notification, type FormKind } from '@/lib/email/templates';

type Rows = [string, string | undefined][];

/** Envía la notificación y la autorrespuesta; sin RESEND_API_KEY falla con un mensaje claro */
async function send(kind: FormKind, sender: { name: string; email: string }, rows: Rows, options: { attachments?: { filename: string; content: Buffer }[]; replySummary?: boolean } = {}) {
  if (!RESEND_API_KEY) {
    console.error('[forms] RESEND_API_KEY is missing');
    throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'Email is not configured yet.' });
  }
  const resend = new Resend(RESEND_API_KEY);
  const internal = notification(kind, sender.name, sender.email, rows);
  const reply = autoReply(kind, sender.name, options.replySummary === false ? [] : rows);

  const { error } = await resend.emails.send({
    from: MAIL_FROM,
    to: MAIL_TO.split(',').map((s) => s.trim()),
    replyTo: sender.email,
    subject: internal.subject,
    html: internal.html,
    attachments: options.attachments,
  });
  if (error) {
    console.error('[forms] notification', error);
    throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'We could not send your message. Please try again.' });
  }

  // La autorrespuesta no bloquea: si falla (p. ej. dominio aún sin verificar en Resend), el equipo ya tiene el mensaje
  const { error: replyError } = await resend.emails.send({ from: MAIL_FROM, to: sender.email, subject: reply.subject, html: reply.html });
  if (replyError) console.warn('[forms] auto-reply', replyError);
}

const label = (list: readonly { value: string; label: string }[], value?: string) => list.find((o) => o.value === value)?.label ?? value;

export const server = {
  contact: defineAction({
    accept: 'form',
    input: contactSchema,
    handler: async (input) => {
      if (input.website) return { ok: true };
      await send('contact', input, [
        ['Name', input.name],
        ['Email', input.email],
        ['Phone', input.phone],
        ['Subject', label(contactSubjects, input.subject)],
        ['Message', input.message],
      ]);
      return { ok: true };
    },
  }),

  proposal: defineAction({
    accept: 'form',
    input: proposalSchema,
    handler: async (input) => {
      if (input.website) return { ok: true };
      await send('proposal', input, [
        ['I am a', label(audiences, input.audience)],
        ['Name', input.name],
        ['Email', input.email],
        ['Phone', input.phone],
        ['Units or properties', input.audience === 'owner' ? input.units : undefined],
        ['Message', input.message],
      ]);
      return { ok: true };
    },
  }),

  job: defineAction({
    accept: 'form',
    input: jobSchema,
    handler: async (input) => {
      if (input.website) return { ok: true };
      const fullName = `${input.first_name} ${input.last_name}`;
      const file = input.resume && input.resume.size > 0 ? input.resume : undefined;
      const rows: Rows = [
        ['Name', fullName],
        ['Email', input.email],
        ['Phone', input.phone],
        ['Mobile', input.mobile],
        ['Address', [input.address, input.address2].filter(Boolean).join(', ')],
        ['City / State / ZIP', [input.city, input.state, input.zip].filter(Boolean).join(', ')],
        ['Employment desired', label(employmentTypes, input.employment)],
        ['Resume', file ? `${file.name} (attached)` : 'Not attached'],
      ];
      await send('job', { name: fullName, email: input.email }, rows, {
        attachments: file ? [{ filename: file.name, content: Buffer.from(await file.arrayBuffer()) }] : undefined,
      });
      return { ok: true };
    },
  }),

  newsletter: defineAction({
    accept: 'form',
    input: newsletterSchema,
    handler: async (input) => {
      if (input.website) return { ok: true };
      await send('newsletter', { name: '', email: input.email }, [['Email', input.email]], { replySummary: false });
      return { ok: true };
    },
  }),
};
