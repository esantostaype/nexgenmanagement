// Reescribe las clases de Tailwind a su forma canónica (la misma sugerencia "Replace with…" del editor):
// size-[460px] → size-115, translate-x-[-50%] → -translate-x-1/2, data-[open]: → data-open:, z-[60] → z-60…
// Uso: node scripts/canonical-classes.mjs [--check]   (con --check solo informa, no escribe)
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';
import { __unstable__loadDesignSystem } from '@tailwindcss/node';

const check = process.argv.includes('--check');
const css = readFileSync('src/styles/global.css', 'utf8');
const ds = await __unstable__loadDesignSystem(css, { base: join(process.cwd(), 'src', 'styles') });

const files = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) {
      if (!['node_modules', 'starwind'].includes(f)) walk(p);
    } else if (/\.(astro|ts)$/.test(f)) files.push(p);
  }
};
walk('src');

// Tokens candidatos: lo que va dentro de class / class:list / cadenas de clases
const TOKEN = /[^\s"'`{}<>,;]+/g;
let total = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const tokens = [...new Set(src.match(TOKEN) ?? [])].filter((t) => /[-:[]/.test(t) && ds.parseCandidate(t).length);
  if (!tokens.length) continue;
  const map = new Map();
  for (const t of tokens) {
    const [c] = ds.canonicalizeCandidates([t], { rem: 16 });
    if (c && c !== t) map.set(t, c);
  }
  if (!map.size) continue;
  let out = src;
  for (const [from, to] of map) {
    // Solo como clase completa (rodeada de separadores)
    const re = new RegExp(`(?<=^|[\\s"'\`{])${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|[\\s"'\`}])`, 'g');
    out = out.replace(re, to);
  }
  total += map.size;
  console.log(f.split(sep).join('/'));
  for (const [a, b] of map) console.log(`  ${a} → ${b}`);
  if (!check && out !== src) writeFileSync(f, out);
}
console.log(total ? `${total} clases ${check ? 'por corregir' : 'corregidas'}` : 'Todo canónico');
