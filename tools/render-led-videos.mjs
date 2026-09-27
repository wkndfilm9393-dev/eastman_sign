// Renders the LED sign concepts in designs/led-signs/canvas to MP4.
// Drives the sign engine from Main.dc.html frame by frame in headless Chromium,
// so the video matches the canvas exactly and has no dropped frames.
//
// Usage: node tools/render-led-videos.mjs [--fps 30] [--seconds 63.4] [--scale 1] [--shapes frame,aperture,canister]
// Needs: playwright (Chromium) and an ffmpeg binary (FFMPEG env var, or `ffmpeg` on PATH).

import { readFileSync, mkdirSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = Object.fromEntries(process.argv.slice(2).join(' ').split('--').filter(Boolean).map((s) => s.trim().split(/\s+/)));
const fps = Number(args.fps ?? 30);
const seconds = Number(args.seconds ?? 63.4); // one full program loop
const scale = Number(args.scale ?? 1);
const shapes = (args.shapes ?? 'frame,aperture,canister').split(',');
const ffmpeg = process.env.FFMPEG || 'ffmpeg';
const names = { frame: 'eastman-led-a-35mm-frame', aperture: 'eastman-led-b-aperture', canister: 'eastman-led-c-film-canister' };

const src = readFileSync(path.join(root, 'designs/led-signs/canvas/Main.dc.html'), 'utf8');
const logic = src.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700;900&display=swap" rel="stylesheet">
<style>body{margin:0;background:#000}</style></head>
<body><canvas data-led="1" style="width:800px;height:1000px;display:block"></canvas>
<script>class DCLogic { constructor() { this.props = {}; this.state = {}; } }</script>
<script>${logic}
window.Component = Component;</script></body></html>`;

const outDir = path.join(root, 'designs/led-signs/videos');
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
for (const shape of shapes) {
  const page = await browser.newPage({ viewport: { width: 800, height: 1000 }, deviceScaleFactor: scale, timezoneId: 'Asia/Seoul' });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(async (shape) => {
    await document.fonts.load('900 24px "Noto Sans KR"', '현상스캔인화');
    const c = new window.Component();
    c.props = { shape, program: 'loop', speed: 1, glow: true };
    c.canvas = document.querySelector('canvas');
    c.componentDidMount();
    cancelAnimationFrame(c.raf);
    await document.fonts.ready;
    c.fontsOk = true; c.cache = {}; c._ce = null;
    c.t = 0; c.last = 0;
    window.sign = c;
  }, shape);

  const file = path.join(outDir, `${names[shape] || shape}.mp4`);
  const ff = spawn(ffmpeg, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'slow', '-movflags', '+faststart', file], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (code) => (code === 0 ? res() : rej(new Error('ffmpeg exited ' + code)))));

  const total = Math.round(seconds * fps);
  for (let i = 0; i < total; i++) {
    const b64 = await page.evaluate((ts) => {
      window.sign.frame(ts);
      return window.sign.canvas.toDataURL('image/png').slice(22);
    }, 1000 + (i * 1000) / fps);
    if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % (fps * 10) === 0) console.log(`${shape}: ${Math.round((i / total) * 100)}%`);
  }
  ff.stdin.end();
  await done;
  console.log('wrote', path.relative(root, file));
  await page.close();
}
await browser.close();
