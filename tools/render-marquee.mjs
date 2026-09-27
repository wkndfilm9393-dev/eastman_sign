// Renders the suspended LED marquee product shot (designs/led-marquee/scene) with three.js in headless Chromium.
//
// Usage:
//   node tools/render-marquee.mjs --still 2.2 --out designs/led-marquee/eastman-led-marquee.png [--w 2400 --h 1600]
//   node tools/render-marquee.mjs --out designs/led-marquee/eastman-led-marquee.mp4 [--w 1920 --h 1280 --fps 30 --seconds 10]
// Needs: playwright (Chromium), three (THREE_DIR env, or resolvable `three` package), and ffmpeg (FFMPEG env) for video.

import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = Object.fromEntries(process.argv.slice(2).join(' ').split('--').filter(Boolean).map((s) => s.trim().split(/\s+/)));
const threeDir = process.env.THREE_DIR || path.dirname(path.dirname(require.resolve('three')));
if (!existsSync(path.join(threeDir, 'build/three.module.js'))) throw new Error('three.js not found; set THREE_DIR');
const w = Number(args.w ?? (args.still !== undefined ? 2400 : 1920));
const h = Number(args.h ?? (args.still !== undefined ? 1600 : 1280));
const out = path.resolve(root, args.out ?? 'designs/led-marquee/eastman-led-marquee.png');
const fps = Number(args.fps ?? 30), seconds = Number(args.seconds ?? 10);
const ffmpeg = process.env.FFMPEG || 'ffmpeg';

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: w, height: h } });
page.on('pageerror', (e) => console.error('page error:', e.message));
await page.route('http://render.local/**', (route) => {
  const p = new URL(route.request().url()).pathname;
  const file = p.startsWith('/three/') ? path.join(threeDir, p.slice(7)) : path.join(root, 'designs/led-marquee/scene', p === '/' ? 'index.html' : p);
  const type = file.endsWith('.js') ? 'text/javascript' : 'text/html';
  route.fulfill({ status: 200, contentType: type, body: readFileSync(file) });
});
await page.goto(`http://render.local/?w=${w}&h=${h}&t=${args.still ?? 0}`);
await page.waitForFunction(() => window.ready === true, null, { timeout: 180000 });

mkdirSync(path.dirname(out), { recursive: true });
const shot = () => page.locator('canvas').screenshot();
if (args.still !== undefined) {
  writeFileSync(out, await shot());
} else {
  const ff = spawn(ffmpeg, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg exited ' + c)))));
  const total = Math.round(seconds * fps);
  for (let i = 0; i < total; i++) {
    await page.evaluate((t) => window.renderAt(t), i / fps);
    const png = await shot();
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % fps === 0) console.log(`frame ${i}/${total}`);
  }
  ff.stdin.end();
  await done;
}
console.log('wrote', path.relative(root, out));
await browser.close();
