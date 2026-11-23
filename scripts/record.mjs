// Records a short looping clip of each project in use, into clips/<slug>.mp4,
// with a poster frame at thumbs/<slug>.jpg. Needs ffmpeg on PATH.
// Usage: npm run record             (all projects)
//        npm run record -- dog-game (just one)
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { demos } from './demos.mjs';
import { projectUrl } from './projects.mjs';

const W = 1280, H = 800;
const only = process.argv.slice(2);
const root = new URL('../', import.meta.url).pathname;
const projects = JSON.parse(readFileSync(join(root, 'projects.json'), 'utf8'));
const work = mkdtempSync(join(tmpdir(), 'portfolio-rec-'));
mkdirSync(join(root, 'clips'), { recursive: true });

const ff = (...args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args]);

// A short synthetic beat for the music visualiser to react to.
const audioFile = join(work, 'beat.wav');
ff('-f', 'lavfi', '-i',
  "aevalsrc='0.6*sin(2*PI*(55+30*exp(-12*mod(t,0.5)))*t)*exp(-6*mod(t,0.5))+0.25*sin(2*PI*220*t)*(0.5+0.5*sin(2*PI*0.5*t))+0.2*sin(2*PI*330*t)*exp(-4*mod(t+0.25,0.5))+0.15*sin(2*PI*660*t)*exp(-8*mod(t,0.25))':s=44100:d=30",
  audioFile);

// A visible cursor with a click ripple, so the clips show someone using the site.
const CURSOR = () => {
  addEventListener('DOMContentLoaded', () => {
    const c = document.createElement('div');
    c.style.cssText = 'position:fixed;left:-40px;top:-40px;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;' +
      'background:rgba(255,255,255,.55);border:2px solid rgba(20,20,20,.85);box-shadow:0 1px 6px rgba(0,0,0,.35);' +
      'z-index:2147483647;pointer-events:none;transition:transform .12s ease';
    document.documentElement.appendChild(c);
    addEventListener('mousemove', (e) => { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; }, true);
    addEventListener('mousedown', (e) => {
      c.style.transform = 'scale(.7)';
      const r = document.createElement('div');
      r.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:44px;height:44px;margin:-22px 0 0 -22px;` +
        'border-radius:50%;border:3px solid rgba(255,140,60,.9);z-index:2147483646;pointer-events:none;' +
        'transition:transform .45s ease-out,opacity .45s ease-out;transform:scale(.3);opacity:1';
      document.documentElement.appendChild(r);
      requestAnimationFrame(() => { r.style.transform = 'scale(1.4)'; r.style.opacity = '0'; });
      setTimeout(() => r.remove(), 600);
    }, true);
    addEventListener('mouseup', () => { c.style.transform = ''; }, true);
  });
};

const browser = await chromium.launch({
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'],
});

for (const p of projects) {
  if (only.length && !only.includes(p.slug)) continue;
  const demo = demos[p.slug];
  if (!demo) { console.log('skip', p.slug, '(no demo)'); continue; }

  const dir = join(work, p.slug);
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    recordVideo: { dir, size: { width: W, height: H } },
    colorScheme: 'light',
  });
  await context.addInitScript(CURSOR);
  const t0 = Date.now();
  const page = await context.newPage();
  let startAt = null;
  let pos = { x: W / 2, y: H / 2 };

  const h = {
    audioFile,
    start() { startAt = (Date.now() - t0) / 1000; },
    pause: (ms) => page.waitForTimeout(ms),
    async moveTo(to, steps = 22) {
      for (let i = 1; i <= steps; i++) {
        const k = i / steps, e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
        await page.mouse.move(pos.x + (to.x - pos.x) * e, pos.y + (to.y - pos.y) * e);
        await page.waitForTimeout(12);
      }
      pos = { ...to };
    },
    async clickAt(to) { await h.moveTo(to); await page.waitForTimeout(120); await page.mouse.click(to.x, to.y); },
    async click(locator, { scroll = true } = {}) {
      if (scroll) await locator.scrollIntoViewIfNeeded();
      const b = await locator.boundingBox();
      await h.clickAt({ x: b.x + b.width / 2, y: b.y + b.height / 2 });
    },
    clickText: (text) => h.click(page.getByText(text, { exact: true }).first()),
    async wheel(dy, ms) {
      const steps = Math.max(1, Math.round(ms / 40));
      for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, dy / steps); await page.waitForTimeout(ms / steps); }
    },
    async scrollTo(locator, offset = 0) {
      const b = await locator.boundingBox();
      await h.wheel(b.y + offset, 900);
    },
  };

  try {
    await page.goto(projectUrl(p, 'https://saurabhbatra96.github.io'), { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
    await page.mouse.move(pos.x, pos.y);
    await demo(page, h);
  } catch (e) {
    console.log('FAIL', p.slug, e.message.split('\n')[0]);
  }
  const end = (Date.now() - t0) / 1000;
  const video = page.video();
  await context.close();
  const raw = await video.path();
  if (startAt == null) { console.log('FAIL', p.slug, 'demo never started'); continue; }

  const out = join(root, 'clips', `${p.slug}.mp4`);
  ff('-ss', String(startAt), '-to', String(end), '-i', raw,
    '-vf', 'scale=960:600:flags=lanczos,fps=25', '-c:v', 'libx264', '-preset', 'slow', '-crf', '30',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out);
  ff('-ss', '0.3', '-i', out, '-frames:v', '1', '-q:v', '4', join(root, 'thumbs', `${p.slug}.jpg`));
  const kb = Math.round(readFileSync(out).length / 1024);
  console.log('ok  ', p.slug, `${(end - startAt).toFixed(1)}s`, `${kb} KB`);
}

await browser.close();
if (existsSync(work)) rmSync(work, { recursive: true, force: true });
