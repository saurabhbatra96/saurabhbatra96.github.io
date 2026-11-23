export const USER = 'saurabhbatra96';
export const projectUrl = (p, origin = '') => p.url ? origin + p.url : `${origin}/${p.slug}/`;
export const repoUrl = (p) => p.repo ?? `https://github.com/${USER}/${p.slug}`;
