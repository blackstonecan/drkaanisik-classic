# Website Design Specification — Op. Dr. Kaan Işık

> **Note for Claude Code:** This file is the source of truth for the website's
> architecture, page structure, and component behavior. For all content
> related to the doctor (bio, services, taglines, brand), refer to
> `DOCTOR_PROFILE.md`. For all visual/UX behavior and routing, refer to
> this document.

---

## 1. Project Overview

A fully **static** marketing website for a fictional cardiac surgeon, built
as a frontend portfolio piece. The site demonstrates:

- Multi-language support (TR / EN / DE) with proper i18n routing
- Modern static site architecture (no backend, no database)
- Polished UI/UX with custom interactions (clinic tour, expandable sections, video hero)
- Full responsive behavior (desktop + mobile)
- Realistic medical/clinic content structure

**Important:** All "dynamic" features (form submission, like buttons, view
counts, popular categories) are **purely visual / fake data**. No backend
calls. The site is a design showcase, not a functional product.

## 2. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Build tool | **Vite** | Fast dev server, modern bundling |
| Framework | **React** (TypeScript) | Component model, ecosystem |
| Routing | **react-router-dom** | Standard SPA routing for multi-language routes |
| i18n | **react-i18next** | Industry standard, works well with route-based locales |
| Styling | **Tailwind CSS** | Utility-first, fast iteration. Add `@tailwindcss/typography` for blog content. |
| Animation | **Framer Motion** | Smooth transitions, expand/collapse, page enters |
| Icons | **lucide-react** | Clean, consistent icon set |
| Data | **Static JSON files** in `/src/data/` | All content (services, blogs, FAQ, tour points) loaded at build time |
| Deployment | **Cloudflare Pages** (suggested) | Free tier, fast, easy |

## 3. Multi-Language Architecture

### Routing strategy: Route-based (industry standard)

Used by Stripe, Apple, Airbnb, Booking. Required for proper SEO (Google
indexes each language separately) and `hreflang` support.

```
/                  → Turkish (default, no prefix)
/en/...            → English
/de/...            → German
```

### Translation file structure

```
src/locales/
├── tr/
│   ├── common.json      ← header, footer, buttons, generic labels
│   ├── home.json        ← homepage section copy
│   ├── services.json    ← service descriptions (key by service slug)
│   ├── blog.json        ← blog UI labels (categories, search, etc.)
│   ├── tour.json        ← clinic tour info card content
│   ├── contact.json     ← contact section labels
│   └── faq.json         ← FAQ Q&A pairs
├── en/  (same structure)
└── de/  (same structure)
```

### Language switcher behavior

- Always visible: in the floating header (over hero video) and in the full header (after scroll)
- Switching language preserves the current page (e.g., `/blog/tavi-nedir` → `/en/blog/what-is-tavi`)
- Blog post slugs translated per language (mapped in `blog.json`)
- Default language detection: only on first visit, based on `navigator.language`. After that, the URL is the source of truth.

### SEO

- Each route renders correct `<html lang="...">`
- `hreflang` link tags in `<head>` for all language variants of the page
- Per-language meta tags (title, description, og:title, og:description)

## 4. Data Files

All content is stored as static JSON in `/src/data/`. Examples:

```
src/data/
├── services.json        ← service categories + procedures
├── blogs.json           ← blog post metadata + content (or MDX files)
├── faq.json             ← FAQ structure (questions empty for now, user fills in)
├── tour.json            ← clinic tour points with photo/video paths
├── stats.json           ← homepage trust signals
├── hospitals.json       ← partner hospital list (optional)
└── doctor.json          ← doctor profile data (single source, used everywhere)
```

**Convention:** Locale-independent data (slugs, image paths, video paths,
fake counts) lives in these JSON files. Locale-dependent text (titles,
descriptions, body content) lives in `src/locales/{lang}/*.json`,
**keyed by the same slug** as the data file.

Example `services.json`:
```json
{
  "categories": [
    {
      "slug": "coronary-artery-surgery",
      "icon": "heart-pulse",
      "procedures": [
        { "slug": "midcab", "featured": true },
        { "slug": "off-pump-bypass", "featured": false },
        { "slug": "classic-cabg", "featured": false }
      ]
    }
  ]
}
```

Example `src/locales/tr/services.json`:
```json
{
  "coronary-artery-surgery": {
    "title": "Koroner Arter Cerrahisi",
    "description": "...",
    "procedures": {
      "midcab": { "title": "MIDCAB", "description": "..." }
    }
  }
}
```

## 5. Page Structure

```
/                        → Home (TR)
/en                      → Home (EN)
/de                      → Home (DE)
/blog                    → Blog list (TR)
/en/blog                 → Blog list (EN)
/de/blog                 → Blog list (DE)
/blog/:slug              → Blog detail
/clinic-tour             → Clinic tour (TR)
/en/clinic-tour          → Clinic tour (EN)
/de/clinic-tour          → Clinic tour (DE)
```

Header navigation items:
- **Home** → `/` (or current locale root)
- **Clinic Tour** → separate page
- **Services** → scroll to `#services` on home
- **Blog** → separate page
- **Contact** → scroll to `#contact` on home

## 6. Homepage — Section by Section

### 6.1 Portfolio Disclaimer Popup

- **Trigger:** Opens automatically on every page load of the homepage. Not persisted (no localStorage flag).
- **Behavior:**
  - Background dim overlay (`rgba(0, 0, 0, 0.6)`) covers entire viewport
  - Popup centered, with X close button in top-right corner
  - Clicking outside the popup OR the X button closes it
  - `Esc` key also closes it (a11y)
- **Content (TR default; localized for EN/DE):**
  - Title: "Bu bir portfolyo örnek sitesidir"
  - Body: "Bu site, Emre Can Karataş tarafından geliştirilmiş bir frontend portfolyo projesidir. Op. Dr. Kaan Işık kurgusal bir karakterdir; bu sitede yer alan hiçbir bilgi gerçek bir tıp profesyoneline ait değildir."
  - Footer link: portfolio link / GitHub repo (optional)
- **Hero video state:** Video is **paused** while popup is open. When popup closes, video starts playing (muted autoplay).
- **Focus trap:** While popup is open, keyboard focus stays inside it.

### 6.2 Hero — Welcome Video

- **Video:** Walks through entering the clinic from the front door, into the lobby. Looping, muted, autoplay.
- **Format:** MP4 (H.264) primary + WebM fallback. Poster image while loading.
- **Mobile:** Lower-bitrate version (~720p), or static poster image fallback if user has `prefers-reduced-data` or low connection.
- **Overlay content:**
  - Welcome text (large headline) — see `home.json` `hero.title`
  - Subtitle / tagline — see `DOCTOR_PROFILE.md` taglines
  - CTA button: "İletişime Geç" / "Get in Touch" / "Kontakt aufnehmen" → scrolls to `#contact`
- **Header behavior over hero:**
  - Header background is **transparent** while hero video is in viewport
  - Logo, hamburger/nav, and language switcher remain visible (white text on dark video)
  - On scroll past hero, header gets solid background (with backdrop-blur), text color flips to dark

### 6.3 Doctor Section

- **Layout:** Two-column on desktop (photo left, info right), stacked on mobile
- **Doctor photo:** Professional portrait (placeholder for now — `/public/images/doctor-portrait.jpg`)
- **Short bio:** 2–3 sentence summary pulled from `home.json` (NOT the full bio from DOCTOR_PROFILE.md)
- **Trust signals / stats grid (4 items):**
  - 2000+ açık kalp ameliyatı
  - 8 yıl klinik deneyimi
  - %95+ hasta memnuniyeti
  - 3 dil hizmet (TR/EN/DE)
  - Each animates on scroll (count-up for numbers, framer-motion)
- **Expand/collapse interaction:**
  - Default: short bio visible
  - Expand icon button (chevron-down or plus icon, lucide) → reveals full bio with smooth height animation (framer-motion)
  - Collapse icon (chevron-up or minus icon) when expanded → returns to short bio
  - Use `aria-expanded` and `aria-controls` for accessibility
  - Full bio includes education timeline, fellowship details, memberships — all from DOCTOR_PROFILE.md sections 2, 3, 5

### 6.4 Services Section

- **Section anchor:** `#services` (for header nav scroll)
- **Layout:** Grid of 4 service category cards (one per category from `services.json`)
- **Card content per category:**
  - Icon (lucide icon, key from JSON)
  - Title (localized)
  - Short description (1–2 sentences, localized)
  - List of procedures inside (bullet list or chips)
  - Featured procedures get a small star/badge (e.g., MIDCAB)
- **No deep service pages for now** — all service info lives on the homepage. (This can be expanded later if needed; structure already supports it via slugs.)

### 6.5 FAQ Section

- **Section anchor:** `#faq`
- **Layout:** Vertically stacked accordion items
- **Behavior:**
  - All collapsed by default
  - Click question → smoothly expands answer (framer-motion height animation)
  - Click again → collapses
  - Multiple can be open simultaneously
  - Chevron icon rotates 180° when open
  - Use `<details>`/`<summary>` semantically OR div with `aria-expanded` + `role="button"`
- **Content:** Empty placeholder structure for now. User will fill in `faq.json` later. The component should render whatever questions are in the JSON file gracefully (zero, few, or many).

### 6.6 Contact Section

- **Section anchor:** `#contact`
- **Background:** Clinic exterior or interior photo with dark overlay (text readability)
- **Two columns on desktop:**
  - **Left: Contact info**
    - Phone: `+90 (242) XXX XX XX` (clickable `tel:` link)
    - Email: `info@drkaanisik.com` (clickable `mailto:` link)
    - Address: full Konyaaltı address (text)
    - Google Maps embed (small, below the info, with link to open in Maps)
  - **Right: Contact form**
    - Name field
    - Switch toggle: **Phone** (default) ↔ **Email**
    - Phone or Email field (one visible at a time based on switch)
    - Message textarea
    - Submit button — **purely visual**, on click shows a success toast/message: "Mesajınız iletildi (bu site bir portfolyo örneğidir, gerçek gönderim yapılmaz)"
    - Switch animation: smooth slide between phone/email field
- **Floating buttons:**
  - **WhatsApp button:** Sticky floating button, bottom-right corner, visible across the entire site (not only contact section). Green, lucide `MessageCircle` or WhatsApp logo SVG. Links to `https://wa.me/90XXXXXXXXXX?text=Merhaba%2C...`
  - **Instagram button:** In contact section only, alongside other contact info. Links to a fake handle like `@drkaanisik`

### 6.7 Footer

Minimal:
- Logo (smaller version)
- Tiny copyright: `© 2026 Op. Dr. Kaan Işık` (localized)
- "Gizlilik" / "Privacy" / "Datenschutz" link (placeholder page or modal)
- Tiny portfolio attribution: "Frontend by Emre Can Karataş" with link
- Social icons (Instagram, WhatsApp)

## 7. Header Component (Global)

- **Position:** `fixed top-0`, full width, `z-50`
- **Two visual states:**
  1. **Transparent state** (over hero video, top of homepage):
     - Background: transparent
     - Logo: white version
     - Nav text: white
     - Language switcher: white outlined
  2. **Solid state** (after scroll past hero, OR on `/blog`, `/clinic-tour` pages):
     - Background: white with `backdrop-blur-md` and subtle border-bottom
     - Logo: dark version
     - Nav text: dark
     - Language switcher: dark
- **Transition:** Smooth fade between states (300ms)
- **Trigger for state change:** IntersectionObserver on hero section. When hero leaves viewport → solid state. (On non-home pages, always solid state.)
- **Mobile (< 768px):**
  - Hamburger menu icon replaces nav items
  - On click → full-screen drawer with nav items + language switcher
  - Same transparent/solid state logic applies to the bar

## 8. Blog Page

- **Route:** `/blog`, `/en/blog`, `/de/blog`
- **Layout:**
  - **Top: Popular categories strip**
    - Horizontal row of category chips/cards
    - Sorted by `viewCount` (fake number, stored in `blogs.json`)
    - Shows top 4–5 categories
    - Click → filters list below
  - **Below: Filter + search bar**
    - Service filter dropdown: "Tümü" (default) + each service category from `services.json`
    - Search input with debounce (300ms), searches blog `title` and `content` of currently filtered category
  - **Blog list:**
    - Card grid (3 columns desktop, 2 tablet, 1 mobile)
    - Each card: featured image, title, category chip(s), short excerpt, like count
- **Blog data structure** (`blogs.json`):
  ```json
  {
    "posts": [
      {
        "slug": "tavi-nedir",
        "image": "/images/blog/tavi.jpg",
        "categories": ["heart-valve-surgery"],
        "viewCount": 1247,
        "likeCount": 89,
        "publishedAt": "2025-09-15"
      }
    ]
  }
  ```
- **Post content:** Localized in `src/locales/{lang}/blog.json` keyed by slug, OR in MDX files at `/src/content/blog/{lang}/{slug}.mdx`. **Recommendation: MDX files** for richer content (rich text, headings, lists, images inline).

## 9. Blog Detail Page

- **Route:** `/blog/:slug` (with locale prefix)
- **Layout:**
  - Hero with featured image + title overlay
  - Category chips
  - Author info (small): photo + "Op. Dr. Kaan Işık"
  - Publish date, reading time estimate
  - **Like button at top** (next to title or below it):
    - Heart icon
    - Click → toggles liked state, increments/decrements local count, persists to `localStorage` keyed by post slug
    - On first load, displays the fake `likeCount` from JSON; if user has liked it, shows incremented count and filled icon
    - Smooth animation on like (heart pulse)
  - Rich text content (MDX rendering)
  - "Related posts" section at bottom (optional, same category)

## 10. Clinic Tour Page

- **Route:** `/clinic-tour`, `/en/clinic-tour`, `/de/clinic-tour`
- **Tour points (5):**
  1. **Entrance** (Giriş) — starting point
  2. **Waiting area** (Bekleme alanı)
  3. **Consultation room** (Konsültasyon odası)
  4. **Examination room** (Muayene odası)
  5. **EKG/USG room** (EKG/USG odası)
- **Note:** Operating room is intentionally NOT included (the doctor performs surgeries at contracted hospitals, not at this clinic — see DOCTOR_PROFILE.md §3).

### 10.1 Data Structure (`tour.json`)

```json
{
  "points": [
    {
      "slug": "entrance",
      "image": "/videos/tour/entrance.jpg",
      "icon": "door-open"
    },
    {
      "slug": "waiting-area",
      "image": "/videos/tour/waiting-area.jpg",
      "icon": "armchair"
    }
    // ...
  ],
  "transitions": [
    { "from": "entrance", "to": "waiting-area", "video": "/videos/tour/entrance-to-waiting-area.mp4" },
    { "from": "waiting-area", "to": "entrance", "video": "/videos/tour/waiting-area-to-entrance.mp4" },
    { "from": "waiting-area", "to": "consultation-room", "video": "/videos/tour/waiting-area-to-consultation-room.mp4" }
    // ... (one entry per directed pair the user wants to support)
  ]
}
```

Localized info card content lives in `src/locales/{lang}/tour.json`:
```json
{
  "entrance": {
    "title": "Klinik Girişi",
    "description": "Sizi karşılayan modern ve sıcak bir bekleme deneyimi başlıyor."
  }
}
```

### 10.2 Behavior

- **Initial state:** Show `entrance` static image full-screen (or large hero area)
- **Info card:** Floating card overlaid on top of the image (top-left or top-center), with current point's title + short description. Smooth fade between info cards on transition.
- **Navigation buttons (bottom):**
  - Row of buttons for all OTHER points (not current)
  - Each button shows icon + name
  - Click → triggers transition video
- **Transition flow:**
  1. User clicks a destination button
  2. Look up the matching transition video in `tour.json` (by `from` + `to` pair)
  3. Replace static image with `<video>` element, playing the transition video (muted, autoplay, no loop)
  4. While video plays: hide nav buttons (or fade to 30% opacity), info card fades out
  5. On video `ended` event:
     - Replace video with static image of destination point
     - Update info card with destination's content (fade in)
     - Show nav buttons with the new set of OTHER points
     - Update current point state
- **Edge case — missing transition:** If a transition video for `from→to` doesn't exist in `tour.json`, fall back to a simple crossfade between static images (no video). Log a console warning.
- **Mobile:**
  - Same behavior, but nav buttons can be a horizontally scrollable row at the bottom
  - Use lower-bitrate videos for mobile (separate `videoMobile` field in `tour.json`, optional)
- **Loading states:** Show a spinner overlay while transition video is buffering. Use `<video preload="metadata">` to keep initial load light.
- **Accessibility:**
  - Each nav button has clear `aria-label`
  - Reduced motion: if user has `prefers-reduced-motion`, skip transition videos entirely and crossfade static images instead

## 11. Component Inventory (suggested)

```
src/components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── LanguageSwitcher.tsx
│   └── WhatsAppFloat.tsx
├── home/
│   ├── PortfolioPopup.tsx
│   ├── HeroVideo.tsx
│   ├── DoctorSection.tsx
│   ├── StatsGrid.tsx
│   ├── ServicesSection.tsx
│   ├── ServiceCard.tsx
│   ├── FAQSection.tsx
│   ├── FAQItem.tsx
│   └── ContactSection.tsx
├── blog/
│   ├── BlogList.tsx
│   ├── BlogCard.tsx
│   ├── BlogFilters.tsx
│   ├── PopularCategories.tsx
│   ├── LikeButton.tsx
│   └── BlogPost.tsx
├── tour/
│   ├── ClinicTour.tsx
│   ├── TourInfoCard.tsx
│   └── TourNavButtons.tsx
└── ui/
    ├── Button.tsx
    ├── Toast.tsx
    ├── Switch.tsx          ← for phone/email toggle in contact form
    └── ExpandToggle.tsx    ← reusable expand/collapse icon button
```

## 12. Design Direction

(See DOCTOR_PROFILE.md §11 — Design Direction for full color/typography
guidance. Summary below.)

- **Palette:** White/off-white base, single trust color (deep teal `#0E5E6F` or navy `#0F2A47`), warm coral/sand accent
- **Typography:** Modern serif for headlines (Fraunces, Source Serif), clean sans for body (Inter, Geist)
- **Imagery:** No "doctor with crossed arms" stock. Lean toward abstract anatomical line art, soft photography, custom heart/aorta motif as brand element.
- **Spacing:** Generous, calm, premium feel. Avoid information density.

## 13. Responsive Breakpoints

Standard Tailwind defaults:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Mobile-first approach. Test on 375px (iPhone SE), 768px (tablet), 1440px (desktop).

## 14. Accessibility Checklist

- [ ] All interactive elements reachable by keyboard
- [ ] Focus visible on all focusable elements
- [ ] All images have `alt` text (localized)
- [ ] All videos `muted` for autoplay; `<track>` captions optional
- [ ] All form inputs have `<label>` (visible or `aria-label`)
- [ ] Popup has focus trap and `Esc` to close
- [ ] FAQ accordion uses proper `aria-expanded` / `aria-controls`
- [ ] Tour navigation buttons have descriptive `aria-label`
- [ ] `prefers-reduced-motion` respected (tour transitions, scroll animations)
- [ ] Color contrast meets WCAG AA (4.5:1 for body text)
- [ ] `<html lang>` updates with locale change

## 15. Performance Notes

- All images served as `.webp` with `.jpg` fallback
- Videos: H.264 MP4 + WebM fallback, with poster images
- Lazy-load images below the fold (`loading="lazy"`)
- Lazy-load tour transition videos (don't preload all)
- Code-split per route (React.lazy + Suspense for `/blog`, `/clinic-tour`)
- Bundle target: < 200KB initial JS (gzipped)

## 16. Out of Scope (intentional)

- No real backend (form submission, like persistence beyond localStorage, view tracking)
- No CMS (all content in JSON / MDX)
- No authentication
- No real appointment booking system
- No payment integration
- No analytics (can be added later)

## 17. Disclaimer

This site is a **portfolio frontend project** by Emre Can Karataş. The
doctor persona is fictional. The site is not intended for real medical use,
and no real medical services are offered.
