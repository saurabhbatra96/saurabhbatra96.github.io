// Renders index.html from projects.json and scripts/template.html.
// Usage: npm run build
import { readFile, writeFile } from 'node:fs/promises';
import { projectUrl, repoUrl } from './projects.mjs';

const root = new URL('../', import.meta.url);
const projects = JSON.parse(await readFile(new URL('projects.json', root)));
const template = await readFile(new URL('scripts/template.html', root), 'utf8');

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const SECTIONS = {
  featured: { title: 'Featured', note: '' },
  projects: { title: 'More projects', note: '' },
  'for-others': { title: 'Made for others', note: '' },
  older: { title: 'Older work', note: '' },
};

const card = (p, { eager = false } = {}) => `
      <article class="card">
        <a class="shot" href="${esc(projectUrl(p))}" aria-hidden="true" tabindex="-1">
          <video src="clips/${esc(p.slug)}.mp4" poster="thumbs/${esc(p.slug)}.jpg" width="960" height="600" muted loop playsinline preload="${eager ? 'auto' : 'none'}"></video>
        </a>
        <div class="body">
          <h3><a href="${esc(projectUrl(p))}">${esc(p.title)}</a></h3>
          <a class="repo" href="${esc(repoUrl(p))}">Source</a>
        </div>
      </article>`;

const sections = Object.entries(SECTIONS)
  .map(([key, s]) => {
    const items = projects.filter((p) => p.section === key);
    if (!items.length) return '';
    return `
    <section class="group group-${key}" aria-labelledby="h-${key}">
      <header class="group-head">
        <h2 id="h-${key}">${esc(s.title)}</h2>
        ${s.note ? `<p>${esc(s.note)}</p>` : ''}
      </header>
      <div class="grid">${items.map((p) => card(p, { eager: key === 'featured' })).join('')}
      </div>
    </section>`;
  })
  .join('\n');

const unknown = projects.filter((p) => !SECTIONS[p.section]);
if (unknown.length) throw new Error(`Unknown section for: ${unknown.map((p) => p.slug).join(', ')}`);

const html = template
  .replace('{{SECTIONS}}', sections)
  .replace('{{COUNT}}', String(projects.length))
  .replace('{{YEAR}}', String(new Date().getFullYear()));

await writeFile(new URL('index.html', root), html);
console.log(`index.html: ${projects.length} projects`);
