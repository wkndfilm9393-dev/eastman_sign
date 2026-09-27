// Renders a CSS-animated .dc.html artboard (e.g. the neon sign) to MP4 or a PNG still.
// Fills the {{holes}} from the artboard's own renderVals(), then steps every CSS
// animation to exact times, so frames are deterministic and the video loops.
//
// Usage: node tools/render-neon-video.mjs [--file designs/neon-signs/canvas/Neon.dc.html]
//          [--out designs/neon-signs/videos/eastman-neon-wall.mp4] [--seconds 12] [--fps 30] [--scale 1]
//          [--still 2.5]   (write a PNG at that time instead of a video)
// Needs: playwright (Chromium) and an ffmpeg binary (FFMPEG env var, or `ffmpeg` on PATH).

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = Object.fromEntries(process.argv.slice(2).join(' ').split('--').filter(Boolean).map((s) => s.trim().split(/\s+/)));
const file = path.resolve(root, args.file ?? 'designs/neon-signs/canvas/Neon.dc.html');
const out = path.resolve(root, args.out ?? 'designs/neon-signs/videos/eastman-neon-wall.mp4');
const fps = Number(args.fps ?? 30);
const seconds = Number(args.seconds ?? 12); // every animation period divides 12s, so this loops
const scale = Number(args.scale ?? 1);
const ffmpeg = process.env.FFMPEG || 'ffmpeg';

const src = readFileSync(file, 'utf8');
const logic = src.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
const preview = JSON.parse(src.match(/data-props='([^']*)'/)[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'")).$preview;
const vals = new Function('DCLogic', `${logic}; const c = new Component(); c.props = {}; return c.renderVals();`)(class { constructor() { this.props = {}; } });
const body = src
  .match(/<x-dc>([\s\S]*?)<\/x-dc>/)[1]
  .replace(/<\/?helmet>/g, '')
  .replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, k) => String(vals[k] ?? ''));
const html = `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0">${body}</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: preview.width, height: preview.height }, deviceScaleFactor: scale });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const seek = (ms) => page.evaluate((ms) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ms; }), ms);

mkdirSync(path.dirname(out), { recursive: true });
if (args.still !== undefined) {
  await seek(Number(args.still) * 1000);
  writeFileSync(out, await page.screenshot());
  console.log('wrote', path.relative(root, out));
} else {
  const ff = spawn(ffmpeg, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (code) => (code === 0 ? res() : rej(new Error('ffmpeg exited ' + code)))));
  const total = Math.round(seconds * fps);
  for (let i = 0; i < total; i++) {
    await seek((i * 1000) / fps);
    const png = await page.screenshot();
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await done;
  console.log('wrote', path.relative(root, out));
}
await browser.close();
