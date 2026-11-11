# mike-eka.eu

Personal site, built with [Eleventy](https://www.11ty.dev/). Plain HTML/Nunjucks templates, Markdown for posts and projects, no client-side framework.

## Structure

- `src/_layouts/` — shared page shell (`base.njk`), plus `post.njk` / `project.njk` for individual entries.
- `src/index.html`, `bio.md`, `blog.njk`, `sprache.njk`, `polit.njk`, `projects.njk` — the standing pages.
- `src/posts/` — one Markdown file per blog post. Front matter: `title`, `date`, `excerpt`, `tags` (add `sprache` or `polit` to also list a post on that page).
- `src/projects/` — one Markdown file per project. Front matter: `title`, `kind` (free-text label shown on the card, e.g. `Atlas`), `summary`, optional `embed` (path to a standalone HTML file to embed live), `repo`, `demo`. A card that only links elsewhere uses `link` plus `permalink: false` instead of its own page.
- `src/embeds/` — standalone, self-contained HTML files (e.g. an embedded graphic) that a project page can embed in an iframe. Copied to the site as-is, not templated.
- `src/css/style.css` — all styling. `src/fonts/` — the Sono font.

## Atlas

The Atlas under `/atlas/` has its own guide: see [README-atlas.md](README-atlas.md) (in German) for how to change content, and run `npm run check:atlas` before merging to `main`.

## Local development

```
npm install
npm start       # dev server with live reload, at localhost:8080
npm run build   # builds to _site/
```

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes it via GitHub Pages. In the repo's **Settings → Pages**, set the source to **GitHub Actions** (one-time setup).

The custom domain is set via the `src/CNAME` file (copied to the site root on build) plus a DNS record at your domain registrar — see the chat for the exact record to add.

## Adding content

- **New blog post:** copy one of the files in `src/posts/` (e.g. `in-arbeit-denkzettel.md`), change the front matter and text. English posts go in `src/en/posts/`.
- **New project:** add a Markdown file to `src/projects/` (English: `src/en/projects/`). A project with its own page uses `title`, `kind`, `summary` and optionally `embed`/`repo`/`demo`; a card that only links elsewhere uses `link` plus `permalink: false`, like `atlas.md`.
- **Translations and the language toggle:** the toggle links to the same path in the other language (`/x/` ↔ `/en/x/`). If that page doesn't exist yet, it links to the other language's start page (`/en/` or `/`) instead, so it never leads nowhere. A page can override this with `alternateUrl` in its front matter.
