# Op. Dr. Kaan Işık — Cardiac Surgeon Website

A fully static, multi-language marketing site for a **fictional** cardiac
surgeon, built as a frontend portfolio piece. No backend, no database —
all "dynamic" features (likes, view counts, form submission) are
visual-only with fake data or `localStorage`.

> **Disclaimer:** Op. Dr. Kaan Işık is a fictional persona. No real medical
> claims, services, or professionals are represented. See
> [`DOCTOR_PROFILE.md`](./DOCTOR_PROFILE.md) for the full persona spec.

## Highlights

- **Three locales** (TR / EN / DE) with route-based i18n (`/`, `/en`, `/de`)
- **Per-language blog** with MDX content, search, category filters, like
  buttons (`localStorage`), reading-progress bar
- **Interactive clinic tour** — state-machine-driven walkthrough with
  short transition videos between rooms
- **Polished UX** — Framer Motion transitions, scroll-reveal, Ken Burns
  imagery, `prefers-reduced-motion` support
- **Accessibility-first** — keyboard navigation, focus states, semantic
  ARIA, descriptive alt text
- **Performance** — lazy-loaded routes & locales, lazy images, no
  preloaded video, hashed asset caching
- **SEO** — per-route `<title>` / meta, `hreflang` link tags, correct
  `<html lang>`

## Tech Stack

| Layer | Choice |
|---|---|
| Build | Vite |
| Framework | React 19 + TypeScript (strict) |
| Routing | react-router-dom v7 |
| i18n | react-i18next |
| Styling | Tailwind CSS v4 + `@tailwindcss/typography` |
| Animation | Framer Motion |
| Icons | lucide-react |
| Content | Static JSON (`src/data/`) + MDX (`src/content/blog/`) |
| Hosting | Cloudflare Pages |

## Getting Started

Requires **Node 20+** and npm.

```bash
npm install
npm run dev          # http://localhost:5173
```

### Other scripts

```bash
npm run build        # tsc -b && vite build → dist/
npm run preview      # serve dist/ locally
npm run typecheck    # tsc --noEmit
npm run lint         # eslint .
npm run format       # prettier --write
```

## Project Structure

```
src/
├── main.tsx            ← Entry: router + i18n provider
├── App.tsx             ← Layout shell (Header, routes, Footer, WhatsAppFloat)
├── routes/             ← Page-level components (lazy-loaded)
├── components/
│   ├── layout/         ← Header, Footer, LanguageSwitcher, WhatsAppFloat
│   ├── home/           ← Homepage section components
│   ├── blog/           ← Blog list, card, filters, like button
│   ├── tour/           ← Clinic tour state machine + UI
│   └── ui/             ← Reusable primitives
├── data/               ← Locale-independent JSON (slugs, paths, counts)
├── locales/            ← tr/, en/, de/ — translated text
├── content/blog/       ← MDX posts per language
├── lib/                ← i18n config, hooks, utilities
└── styles/globals.css  ← Tailwind directives + CSS variables
public/
├── images/, videos/    ← Static media
├── _redirects          ← SPA fallback for Cloudflare Pages
└── _headers            ← Cache + security headers
```

For deeper architecture detail, see
[`WEBSITE_DESIGN.md`](./WEBSITE_DESIGN.md).

## Deployment (Cloudflare Pages)

The repo is pre-configured for Cloudflare Pages via Git integration:

- `public/_redirects` — `/* /index.html 200` for SPA deep-link fallback
- `public/_headers` — long-cache for hashed assets, security headers

**Build settings:**

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variable | `NODE_VERSION=20` |

Push to the production branch and Cloudflare Pages auto-deploys.

## Documentation

| File | Purpose |
|---|---|
| [`CLAUDE.md`](./CLAUDE.md) | Tech stack, conventions, working style for AI-assisted dev |
| [`DOCTOR_PROFILE.md`](./DOCTOR_PROFILE.md) | Doctor persona, services, brand voice |
| [`WEBSITE_DESIGN.md`](./WEBSITE_DESIGN.md) | Page structure, routing, component behavior |

## Author

Built by **Emre Can Karataş** as a frontend portfolio piece showcasing
modern React patterns, i18n, and UI/UX craft.

## License

Portfolio project — not licensed for production use. The doctor persona,
content, and brand are fictional.
