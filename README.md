# saurabhbatra96.github.io

A portfolio of every project I host on GitHub Pages, plus the archive of my old blog (2016–2018).

The site is plain static HTML served as-is (`.nojekyll`). `index.html` is generated, so edit the sources below instead.

## Adding a project

1. Add an entry to `projects.json`. `section` is one of `featured`, `projects`, `for-others` or `older`. Projects hosted at `/<repo>/` only need `slug`; others set `url` (and `repo`).
2. Add a scripted demo for it in `scripts/demos.mjs`, then `npm install` (first time only) and `npm run record -- <slug>`. This plays the demo against the live page and saves a looping clip to `clips/<slug>.mp4` and a poster frame to `thumbs/<slug>.jpg`. It needs `ffmpeg` (`brew install ffmpeg`).
3. `npm run build` to regenerate `index.html`, then commit.

A weekly workflow (`.github/workflows/check-new-pages.yml`) opens an issue when a repo has Pages turned on but isn't in `projects.json`. Run it locally with `npm run check`.

## Old blog

The Jekyll blog was frozen as rendered HTML on 2026-11-23. Posts keep their original URLs (`/2016/…`, `/about/`, `/atom.xml`); the old front page lives at `/archive/`. `public/` holds the blog's images and two old 2020 calculators that are still online but not listed. The Jekyll source is in this repo's history and under the `blog-archive-2021` tag.
