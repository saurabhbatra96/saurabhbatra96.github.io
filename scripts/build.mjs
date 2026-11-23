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
  'for-others': { title: 'Made for others', note: 'Sites and themes built for other people.' },
  older: { title: 'Older work', note: 'Earlier experiments, kept online.' },
};

const card = (p, { eager = false } = {}) => `
      <article class="card">
        <a class="shot" href="${esc(projectUrl(p))}" aria-hidden="true" tabindex="-1">
          <img src="thumbs/${esc(p.slug)}.jpg" alt="" width="1280" height="800"${eager ? '' : ' loading="lazy"'} decoding="async">
        </a>
        <div class="body">
          <h3><a href="${esc(projectUrl(p))}">${esc(p.title)}</a></h3>
          <p>${esc(p.pitch)}</p>
          <div class="meta">
            <span class="year">${esc(p.year)}</span>
            ${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}
            <a class="repo" href="${esc(repoUrl(p))}">Source</a>
          </div>
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
