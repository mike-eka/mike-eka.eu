# mike-eka.eu

Personal site, built with [Eleventy](https://www.11ty.dev/). Plain HTML/Nunjucks templates, Markdown for posts and projects, no client-side framework.

## Structure

- `src/_layouts/` — shared page shell (`base.njk`), plus `post.njk` / `project.njk` for individual entries.
- `src/index.html`, `bio.md`, `blog.njk`, `sprache.njk`, `polit.njk`, `projects.njk` — the standing pages.
- `src/posts/` — one Markdown file per blog post. Front matter: `title`, `date`, `excerpt`, `tags` (add `sprache` or `polit` to also list a post on that page).
- `src/projects/` — one Markdown file per project. Front matter: `title`, `kind` (`p5.js` / `D3.js` / `NLP`), `summary`, optional `embed` (path to a standalone HTML file to embed live), `repo`, `demo`.
- `src/embeds/` — standalone, self-contained HTML files (e.g. a p5.js sketch or D3 chart) that a project page can embed in an iframe. Copied to the site as-is, not templated.
- `src/css/style.css` — all styling. `src/fonts/` — the Sono font.

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

- **New blog post:** copy `src/posts/example-post.md`, change the front matter and text. Delete the three `example-*` files once you have real posts.
- **New project:** copy one of the files in `src/projects/` that matches the kind (p5.js/D3 embed one, or the NLP write-up style one).
