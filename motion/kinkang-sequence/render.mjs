// Renders index.html frame by frame (deterministic seek) and pipes the frames into ffmpeg.
//   node render.mjs                         -> kinkang-sequence.mp4 (1920x1080, 30 fps, 20 s)
//   node render.mjs --stills 1.5,8,19.4     -> stills/still-<t>.jpg for quick review
// Remote assets (three.js from jsDelivr, Google Fonts) are served from node_modules so renders work offline.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const nm = p => path.join(dir, 'node_modules', p);
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const W = +opt('--width', 1920), H = +opt('--height', 1080), FPS = +opt('--fps', 30);
const out = path.resolve(dir, opt('--out', 'kinkang-sequence.mp4'));
const stills = opt('--stills', null);

const fontCss = `
@font-face{font-family:'Inter';font-style:normal;font-weight:300 700;src:url(https://fonts.gstatic.com/local/inter.woff2) format('woff2');}
@font-face{font-family:'JetBrains Mono';font-style:normal;font-weight:400;src:url(https://fonts.gstatic.com/local/jbm-400.woff2) format('woff2');}
@font-face{font-family:'JetBrains Mono';font-style:normal;font-weight:500;src:url(https://fonts.gstatic.com/local/jbm-500.woff2) format('woff2');}`;
const fontFiles = {
  'inter.woff2': nm('@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'),
  'jbm-400.woff2': nm('@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2'),
  'jbm-500.woff2': nm('@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2'),
};

const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
page.on('console', m => { if (m.type() === 'error') console.error('[page]', m.text()); });
page.on('pageerror', e => console.error('[pageerror]', e.message));
await page.route('https://cdn.jsdelivr.net/npm/three@*/**', r => {
  const rel = new URL(r.request().url()).pathname.replace(/^\/npm\/three@[^/]+\//, '');
  r.fulfill({ body: readFileSync(nm('three/' + rel)), contentType: 'application/javascript' });
});
await page.route('https://fonts.googleapis.com/**', r => r.fulfill({ body: fontCss, contentType: 'text/css' }));
await page.route('https://fonts.gstatic.com/local/*', r => {
  r.fulfill({ body: readFileSync(fontFiles[path.basename(new URL(r.request().url()).pathname)]), contentType: 'font/woff2' });
});

await page.goto('file://' + path.join(dir, 'index.html') + '?render', { waitUntil: 'load' });
await page.waitForFunction(() => window.__kk?.ready, null, { timeout: 60000 });

const shot = t => page.evaluate(t => window.__kk.seek(t), t).then(() => page.screenshot({ type: 'jpeg', quality: 95 }));

if (stills) {
  mkdirSync(path.join(dir, 'stills'), { recursive: true });
  for (const t of stills.split(',').map(Number)) {
    const buf = await shot(t);
    const f = path.join(dir, 'stills', `still-${t.toFixed(2)}.jpg`);
    (await import('node:fs')).writeFileSync(f, buf); console.log(f);
  }
} else {
  const frames = Math.round(20 * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = 0; f < frames; f++) {
    const buf = await shot(f / FPS);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 30 === 0) console.log(`frame ${f}/${frames}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('wrote', out);
}
await browser.close();
