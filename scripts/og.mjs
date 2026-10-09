// Genera las imágenes para compartir (Open Graph / X) capturando el hero de la home.
// Uso: npm run build && npx astro preview --port 4348 (en otra terminal) && node scripts/og.mjs
// Requiere Google Chrome instalado (ruta en CHROME o la de Windows por defecto).
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

const CHROME = process.env.CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ORIGIN = process.env.ORIGIN ?? 'http://localhost:4348';

// Tamaños recomendados por plataforma
const sizes = [
  { file: 'og.jpg', w: 1200, h: 630 }, // Facebook, LinkedIn, WhatsApp, Slack, Discord, iMessage
  { file: 'og-x.jpg', w: 1200, h: 600 }, // X / Twitter (summary_large_image, 2:1)
  { file: 'og-square.jpg', w: 1200, h: 1200 }, // vistas previas cuadradas (WhatsApp, Telegram, etc.)
];

// Copia de la home con ajustes solo para la captura: muestra el poster del vídeo (headless no lo
// reproduce), deja los reveals en su estado final y quita el alto mínimo del hero para que encaje.
const capture = `<style>
  [data-hero-video] { opacity: 1 !important; transition: none !important; }
  [data-reveal], [data-reveal-stagger] > * { opacity: 1 !important; transform: none !important; filter: none !important; }
  section[aria-labelledby="hero-title"] { min-height: 0 !important; height: 100vh !important; }
  .scroll-thumb { display: none !important; }
</style></head>`;
const html = readFileSync('dist/index.html', 'utf8').replace('</head>', capture);
writeFileSync('dist/__og.html', html);

mkdirSync('public/og', { recursive: true });
const tmp = join(tmpdir(), 'nexgen-og');
mkdirSync(tmp, { recursive: true });

try {
  for (const { file, w, h } of sizes) {
    const raw = join(tmp, file.replace('.jpg', '.png'));
    execFileSync(CHROME, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=2',
      `--window-size=${w},${h}`,
      '--virtual-time-budget=6000',
      `--screenshot=${raw}`,
      `${ORIGIN}/__og.html`,
    ], { stdio: 'ignore' });
    await sharp(raw).resize(w, h, { fit: 'cover', position: 'top' }).jpeg({ quality: 86, mozjpeg: true }).toFile(join('public/og', file));
    console.log(`public/og/${file} (${w}×${h})`);
  }
} finally {
  rmSync('dist/__og.html', { force: true });
}
