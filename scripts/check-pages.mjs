// Lists repos with GitHub Pages turned on that projects.json doesn't mention yet.
// Exits 1 when there are any, so CI can flag them. Uses GITHUB_TOKEN if set.
import { readFile } from 'node:fs/promises';
import { USER } from './projects.mjs';

// Repos that have Pages but don't belong on the page (this site itself, dead custom domains).
const IGNORE = new Set([`${USER}.github.io`, 'reflux']);

const listed = new Set(JSON.parse(await readFile(new URL('../projects.json', import.meta.url))).map((p) => p.slug));
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'pages-portfolio-check' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const repos = [];
for (let page = 1; ; page++) {
  const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&page=${page}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const batch = await res.json();
  repos.push(...batch);
  if (batch.length < 100) break;
}

const missing = repos.filter((r) => r.has_pages && !r.archived && !listed.has(r.name) && !IGNORE.has(r.name));
if (!missing.length) {
  console.log('Every Pages repo is in projects.json.');
} else {
  console.log('Pages repos missing from projects.json:');
  for (const r of missing) console.log(`- ${r.name}: https://${USER}.github.io/${r.name}/ ${r.description ? `(${r.description})` : ''}`);
  process.exitCode = 1;
}
