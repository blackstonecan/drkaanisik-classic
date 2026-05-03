# CLAUDE.md

> This file is read by Claude Code at the start of every session. It defines
> the project context, commands, conventions, and how to navigate the
> codebase. Read this first, then refer to `DOCTOR_PROFILE.md` for content
> and `WEBSITE_DESIGN.md` for architecture/behavior.

---

## Project Overview

A **fully static** marketing website for a fictional cardiac surgeon
(Op. Dr. Kaan Işık), built as a frontend portfolio piece by **Emre Can Karataş**.

- **Doctor persona:** Fictional. See `DOCTOR_PROFILE.md` for all bio,
  service, and brand details.
- **Site spec:** All page structure, routing, and component behavior is
  documented in `WEBSITE_DESIGN.md`. Treat it as the source of truth for
  "how should this work."
- **Goal:** Polished, production-quality frontend showcasing modern React
  patterns, i18n, and UI/UX craft. **Not a real product** — no backend,
  all "dynamic" features are visual-only with fake data or `localStorage`.

## Reference Files (read these first)

| File | Purpose | When to read |
|---|---|---|
| `DOCTOR_PROFILE.md` | Doctor persona, services, bio, brand voice | Generating any user-facing copy, service descriptions, meta tags |
| `WEBSITE_DESIGN.md` | Page structure, routing, component behavior, data architecture | Building any page or component, deciding how something should behave |
| `CLAUDE.md` (this file) | Tech stack, commands, conventions | Every session start |

If something is unclear or contradicts between files, ask before assuming.

## Tech Stack

- **Build:** Vite
- **Framework:** React + TypeScript
- **Routing:** react-router-dom
- **i18n:** react-i18next (route-based locales: `/`, `/en`, `/de`)
- **Styling:** Tailwind CSS (+ `@tailwindcss/typography` for blog content)
- **Animation:** Framer Motion
- **Icons:** lucide-react
- **Content:** Static JSON in `src/data/`, MDX for blog posts
- **Deployment target:** Cloudflare Pages

## Commands

> Run all commands from the project root.

```bash
# Install dependencies
npm install

# Start dev server (default: http://localhost:5173)
npm run dev

# Type-check
npm run typecheck

# Lint
npm run lint

# Format
npm run format

# Build for production
npm run build

# Preview production build locally
npm run preview
```

After any non-trivial change, run **`npm run typecheck`** and **`npm run lint`**
before declaring the task done.

## Project Structure

```
src/
├── main.tsx              ← Entry point, sets up router + i18n provider
├── App.tsx               ← Top-level layout (Header, routes, Footer, WhatsAppFloat)
├── routes/               ← Page-level components (one per route)
│   ├── Home.tsx
│   ├── Blog.tsx
│   ├── BlogPost.tsx
│   └── ClinicTour.tsx
├── components/
│   ├── layout/           ← Header, Footer, LanguageSwitcher, WhatsAppFloat
│   ├── home/             ← Homepage section components
│   ├── blog/             ← Blog list, card, filters, like button
│   ├── tour/             ← Clinic tour, info card, nav buttons
│   └── ui/               ← Reusable primitives (Button, Toast, Switch, ExpandToggle)
├── data/                 ← Locale-independent JSON (slugs, paths, fake counts)
│   ├── services.json
│   ├── blogs.json
│   ├── tour.json
│   ├── faq.json
│   ├── stats.json
│   └── doctor.json
├── locales/              ← Locale-dependent JSON (translated text)
│   ├── tr/
│   ├── en/
│   └── de/
├── content/              ← MDX blog posts (per language)
│   └── blog/
│       ├── tr/
│       ├── en/
│       └── de/
├── lib/                  ← Utilities, hooks, i18n config
│   ├── i18n.ts
│   ├── hooks/
│   └── utils.ts
└── styles/
    └── globals.css       ← Tailwind directives + custom CSS variables
```

(See `WEBSITE_DESIGN.md` §11 for the full component inventory.)

## Coding Conventions

### TypeScript

- **Strict mode on.** No `any` unless explicitly justified in a comment.
- Prefer **type aliases** over interfaces for component props (consistency).
- Always type component props explicitly:
  ```tsx
  type ServiceCardProps = {
    slug: string;
    featured?: boolean;
  };

  export function ServiceCard({ slug, featured = false }: ServiceCardProps) { ... }
  ```
- Export types from the file that defines them. Co-locate types with the
  component that uses them, unless shared (then put in `src/lib/types.ts`).

### React

- **Functional components only**, no class components.
- Use **named exports** for components (`export function Foo() {}`), not default exports — except for route-level page components, where default exports are fine for lazy loading.
- One component per file. Filename matches component name (`ServiceCard.tsx`).
- Keep components focused. If a component grows past ~150 lines, consider splitting.
- Use **custom hooks** (`src/lib/hooks/`) for non-trivial stateful logic (e.g., `useScrollPastHero`, `useLocaleRoute`, `useLikeStorage`).

### Styling

- **Tailwind utility classes only.** No CSS-in-JS, no separate `.module.css` files.
- For repeated patterns, extract to a component, not a CSS class.
- Use Tailwind's `@apply` only inside `globals.css` for very small global utilities (e.g., `.container-prose`).
- **Color tokens:** Use CSS variables defined in `globals.css` (e.g., `--color-trust`, `--color-accent`), referenced in Tailwind config. Don't hardcode hex values in components.
- **Dark variant:** Not required for v1. Don't add `dark:` classes unless asked.

### i18n

- **Never hardcode user-facing strings** in components. All copy goes through `useTranslation()`:
  ```tsx
  const { t } = useTranslation('home');
  return <h1>{t('hero.title')}</h1>;
  ```
- Translation keys use **dot notation** matching the JSON file structure.
- When adding a new translation key, add it to **all three locale files** (TR, EN, DE) at the same time. If you don't know the EN/DE translation, use the TR text and add a `// TODO: translate` comment in the JSON (yes, JSON5-style — set up a JSON5 loader or use a placeholder string convention like `"[TODO] ..."`).
- Locale files split per page/feature (see `WEBSITE_DESIGN.md` §3).

### Data files (`src/data/`)

- Keep schemas **stable**. If a JSON shape changes, define a TS type for it in `src/lib/types.ts` and update all consumers in the same change.
- Slugs are **kebab-case** and never change (they're cross-referenced from locale files).
- Image and video paths in JSON are **absolute from `public/`**, e.g., `/images/blog/tavi.jpg`.

### Accessibility

Non-negotiable. Every interactive component must:

- Be reachable and operable by keyboard
- Have a visible focus state
- Have appropriate `aria-*` attributes for non-native widgets
- Support `prefers-reduced-motion` for any animation longer than 200ms
- Have descriptive `alt` text on all meaningful images (decorative images get `alt=""`)

(Full checklist in `WEBSITE_DESIGN.md` §14.)

### Performance

- Lazy-load route components with `React.lazy` + `<Suspense>`.
- Lazy-load below-the-fold images (`loading="lazy"`).
- Don't preload tour transition videos — load on demand.
- Avoid large dependencies. Before adding a new package, check bundle size on bundlephobia.

## Git Conventions

- **Branch naming:** `feat/...`, `fix/...`, `chore/...`, `refactor/...`
- **Commit messages:** Conventional Commits style (`feat: add language switcher`, `fix(tour): handle missing transition video`)
- Don't commit `node_modules/`, `dist/`, `.env*` (already in `.gitignore`)

## Working Style — How to Collaborate with Me

- **Don't ask before making small obvious changes** (renaming a variable, fixing a typo, adding a missing type). Just do it and mention it in the summary.
- **Do ask** before:
  - Adding a new dependency
  - Changing the project structure (new top-level folder, etc.)
  - Touching `WEBSITE_DESIGN.md` or `DOCTOR_PROFILE.md` content
  - Making decisions that affect multiple components/pages at once
- **Be explicit about what you didn't do.** If a task has 5 parts and you finished 3, say so clearly — don't paper over the gap.
- When you make a non-obvious choice, **explain the reasoning briefly** in the response (not in code comments unless the code itself needs the comment).
- Prefer **small, focused changes** over big refactors. If you spot a refactor opportunity outside the current task, mention it; don't do it inline.

## Status Tracking

When working on a multi-step task, keep a running checklist in your response so we both know what's done and what's next. Use TodoWrite if it's available in your environment.

## When Stuck

If you can't figure out how something should work from `DOCTOR_PROFILE.md` or `WEBSITE_DESIGN.md`:

1. Check whether the answer is implied by an analogous decision elsewhere in the spec.
2. If not, **ask** — don't invent. Specifically state what's ambiguous and propose 2–3 options.
3. Don't silently fall back to defaults that contradict the spec (e.g., adding a real backend, persisting likes to a server, hardcoding English strings).

## Out of Scope (do not implement unless explicitly asked)

- Real backend / API endpoints
- Database or CMS integration
- Authentication / user accounts
- Appointment booking system with real availability
- Payment integration
- Analytics / tracking scripts
- Server-side rendering (this is a client-side static SPA)
- Dark mode

## Disclaimer

The doctor persona on this site is **fictional**. This is a portfolio
project. No real medical claims, services, or professionals are represented.
