#!/usr/bin/env node
// Escribe la escala de color de marca (50–950) en src/styles/theme.css a partir
// de la lista que genera https://uicolors.app (botón "Copy" → formato Tailwind v4).
//
// Uso:
//   1. Copia la lista en uicolors.app (--color-<nombre>-50: #...; …)
//   2. npm run accent                  → lee el portapapeles; el color de marca es el 500
//      npm run accent -- --base 600    → usa otro tono como color de marca
//      npm run accent -- paleta.txt    → lee la lista desde un archivo
//
// El nombre de la paleta (scooter, mango…) se reemplaza por "brand".
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { wcagContrast } from 'culori';

const THEME = fileURLToPath(new URL('../src/styles/theme.css', import.meta.url));
const START = '/* accent:start';
const END = '/* accent:end */';
const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

const args = process.argv.slice(2);
const baseIndex = args.indexOf('--base');
const base = baseIndex >= 0 ? args[baseIndex + 1] : '500';
const file = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--base');

if (!SHADES.includes(base)) {
  console.error(`--base debe ser uno de: ${SHADES.join(', ')}`);
  process.exit(1);
}

function readClipboard() {
  const command =
    process.platform === 'win32'
      ? 'powershell -NoProfile -Command Get-Clipboard'
      : process.platform === 'darwin'
        ? 'pbpaste'
        : 'xclip -selection clipboard -o';
  return execSync(command, { encoding: 'utf8' });
}

const source = file ? readFileSync(file, 'utf8') : readClipboard();

// Acepta "--color-scooter-500: #01c5de;", "'500': '#01c5de'," y variantes con oklch()
const colors = {};
for (const match of source.matchAll(/(?:^|[\s'"-])(50|[1-9]00|950)['"]?\s*:\s*['"]?(#[0-9a-f]{3,8}|oklch\([^)]*\)|rgb\([^)]*\)|hsl\([^)]*\))/gim)) {
  colors[match[1]] = match[2].toLowerCase();
}

const missing = SHADES.filter((s) => !colors[s]);
if (missing.length) {
  console.error(
    `No encontré los tonos ${missing.join(', ')}.\n` +
      'Copia la lista completa desde uicolors.app (formato Tailwind v4) y vuelve a ejecutar npm run accent.',
  );
  process.exit(1);
}

// Texto sobre el color de marca: blanco o el tono 950, el que contraste más
const foreground =
  wcagContrast(colors[base], '#ffffff') >= wcagContrast(colors[base], colors['950'])
    ? '#ffffff'
    : 'var(--color-brand-950)';

const block = `${START} — pegado desde uicolors.app con \`npm run accent\`. No editar a mano. */
@theme static {
${SHADES.map((s) => `  --color-brand-${s}: ${colors[s]};`).join('\n')}

  --color-brand: var(--color-brand-${base});
  --color-brand-foreground: ${foreground};
}
${END}`;

const css = readFileSync(THEME, 'utf8');
const from = css.indexOf(START);
const to = css.indexOf(END);

if (from === -1 || to === -1) {
  console.error(`No encuentro los marcadores "${START}" y "${END}" en ${THEME}`);
  process.exit(1);
}

writeFileSync(THEME, css.slice(0, from) + block + css.slice(to + END.length));

console.table(Object.fromEntries(SHADES.map((s) => [`brand-${s}`, colors[s]])));
console.log(`Color de marca: brand-${base} (${colors[base]}) · texto encima: ${foreground}`);
console.log('Escala escrita en src/styles/theme.css');
