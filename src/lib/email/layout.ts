// Plantilla base de los correos (HTML compatible con clientes de correo: tablas, estilos en línea, ancho 600px,
// imágenes con URL absoluta). Colores y tipografía de Nex-Gen: brand-950 #073545, brand-400 #1ddef3, fondo #f4f4f4.
// Las imágenes se sirven desde public/email (logo y redes en PNG) en la URL pública del sitio (`site`).
import { contact, social } from '@/data/site';

export const brand = {
  dark: '#073545',
  cyan: '#1ddef3',
  cyanSoft: '#ecffff',
  text: '#3f4a52',
  muted: '#6b7680',
  page: '#f4f4f4',
  line: '#e6eaec',
  font: "'Hanken Grotesk', 'Inter', 'Segoe UI', Helvetica, Arial, sans-serif",
};

const site = (import.meta.env.SITE ?? 'https://nexgenmultifamily.com').replace(/\/$/, '');
const asset = (file: string) => `${site}/email/${file}`;

/** Escapa texto del usuario antes de meterlo en el HTML */
export const esc = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Saltos de línea del usuario como <br> */
export const multiline = (value: unknown) => esc(value).replace(/\r?\n/g, '<br>');

/** Botón píldora cian con texto oscuro */
export function button(label: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-radius:999px;background:${brand.cyan};">
<a href="${href}" style="display:inline-block;padding:14px 28px;font-family:${brand.font};font-size:15px;font-weight:600;color:${brand.dark};text-decoration:none;border-radius:999px;">${label} &rarr;</a>
</td></tr></table>`;
}

/** Tabla de datos (etiqueta / valor) para resumir un formulario */
export function detailsTable(rows: [string, string | undefined][]) {
  const body = rows
    .filter(([, v]) => v !== undefined && String(v).trim() !== '')
    .map(
      ([label, value], i) => `<tr>
<td style="padding:12px 16px;width:38%;vertical-align:top;font-family:${brand.font};font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${brand.muted};${i ? `border-top:1px solid ${brand.line};` : ''}">${esc(label)}</td>
<td style="padding:12px 16px;vertical-align:top;font-family:${brand.font};font-size:15px;line-height:1.5;color:${brand.dark};${i ? `border-top:1px solid ${brand.line};` : ''}">${multiline(value)}</td>
</tr>`,
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${brand.line};border-radius:12px;border-collapse:separate;overflow:hidden;">${body}</table>`;
}

/** Etiqueta pequeña en mayúsculas (como el Eyebrow del sitio) */
export const eyebrow = (text: string) =>
  `<span style="display:inline-block;padding:6px 12px;border-radius:6px;background:${brand.cyanSoft};font-family:${brand.font};font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#0b7a93;">${esc(text)}</span>`;

interface LayoutOptions {
  /** Texto de vista previa en la bandeja de entrada */
  preheader: string;
  eyebrow?: string;
  title: string;
  /** HTML del cuerpo (párrafos, tablas, botones…) */
  body: string;
}

/** Correo completo: cabecera oscura con el logo, tarjeta blanca con el contenido y pie con contacto y redes */
export function layout({ preheader, eyebrow: kicker, title, body }: LayoutOptions) {
  const socials = social
    .map(
      (s) =>
        `<td style="padding:0 6px;"><a href="${s.href}" target="_blank"><img src="${asset(`${s.icon}.png`)}" width="32" height="32" alt="${esc(s.label)}" style="display:block;border:0;"></a></td>`,
    )
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background:${brand.page};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${brand.page};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

<!-- Cabecera -->
<tr><td style="background:${brand.dark};border-radius:16px 16px 0 0;padding:32px 40px 28px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td><a href="${site}" target="_blank"><img src="${asset('logo-light.png')}" width="200" alt="Nex-Gen Management" style="display:block;border:0;width:200px;height:auto;"></a></td>
<td align="right" style="font-family:${brand.font};font-size:13px;color:#a3f8fe;">${esc(contact.phone)}</td>
</tr></table>
</td></tr>
<tr><td style="background:${brand.cyan};height:4px;line-height:4px;font-size:0;">&nbsp;</td></tr>

<!-- Contenido -->
<tr><td style="background:#ffffff;padding:40px;border-radius:0 0 16px 16px;">
${kicker ? `${eyebrow(kicker)}<div style="height:16px;line-height:16px;font-size:0;">&nbsp;</div>` : ''}
<h1 style="margin:0 0 16px;font-family:${brand.font};font-size:28px;line-height:1.15;font-weight:600;color:${brand.dark};">${esc(title)}</h1>
${body}
</td></tr>

<!-- Pie -->
<tr><td align="center" style="padding:32px 24px 8px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${socials}</tr></table>
<p style="margin:20px 0 4px;font-family:${brand.font};font-size:13px;line-height:1.6;color:${brand.muted};">
<strong style="color:${brand.dark};">Nex-Gen Management, LLC</strong><br>
${contact.address.map(esc).join(' · ')}<br>
<a href="${contact.phoneHref}" style="color:${brand.muted};text-decoration:none;">${esc(contact.phone)}</a> · <a href="mailto:${contact.email}" style="color:${brand.muted};text-decoration:none;">${esc(contact.email)}</a><br>
${esc(contact.hours)}
</p>
<p style="margin:12px 0 0;font-family:${brand.font};font-size:12px;color:#9aa4ab;">Management Company of the Year 2024 · Property Management Association of Clarksville</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

/** Párrafo con el estilo del cuerpo */
export const p = (html: string) => `<p style="margin:0 0 16px;font-family:${brand.font};font-size:16px;line-height:1.65;color:${brand.text};">${html}</p>`;

/** Separador vertical */
export const space = (px = 24) => `<div style="height:${px}px;line-height:${px}px;font-size:0;">&nbsp;</div>`;
