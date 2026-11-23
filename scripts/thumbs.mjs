// Screenshots each project's live page into thumbs/<slug>.jpg.
// Usage: npm run thumbs            (all projects)
//        npm run thumbs -- dog-game (just one)
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { projectUrl } from './projects.mjs';

const only = process.argv.slice(2);
const projects = JSON.parse(await readFile(new URL('../projects.json', import.meta.url)));
const browser = await chromium.launch({ args: ['--use-gl=angle', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });

for (const p of projects) {
  if (only.length && !only.includes(p.slug)) continue;
  const url = projectUrl(p, 'https://saurabhbatra96.github.io');
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(p.thumbDelay ?? 2500);
    await page.screenshot({ path: `thumbs/${p.slug}.jpg`, type: 'jpeg', quality: 78 });
    console.log('ok  ', p.slug);
  } catch (e) {
    console.log('FAIL', p.slug, e.message.split('\n')[0]);
  }
}
await browser.close();
