# Portfolio 2.0 — Optimisations

This document summarises the performance, accessibility, SEO, and code-health
changes made during the optimisation pass. It is meant as both a change-log
and a verification guide.

## 1. Bundle & performance

- **`app/layout.tsx`** — six cosmetic client components are now mounted via a
  new `components/ClientMounts.tsx` wrapper that uses `dynamic(..., { ssr: false })`:
  `Preloader`, `CustomCursor`, `KonamiEasterEgg`, `ParticleBackground`,
  `ScrollAnimator`, `HomeChatWidget`. They no longer block first paint and
  no longer ship a server-rendered tree for empty canvases / GSAP instances.
- **`app/page.tsx`** — every below-the-fold section is now wrapped in a
  `<Suspense>` boundary with a `SectionFallback` skeleton so users see a
  paint-stable placeholder while chunks hydrate. Banner and AboutMe stay
  priority (no Suspense) because they are LCP.
- The Anton / Roboto Flex Google fonts now use `display: 'swap'` so FOUT is
  visible immediately instead of waiting on the network.
- `lib/site.ts` centralises `SITE_URL`, `SITE_NAME`, `SITE_DESCRIPTION`,
  `SITE_LOCALE`, `SITE_TWITTER`, `OG_IMAGE` so they are no longer hard-coded
  in `app/layout.tsx` / `app/sitemap.ts`.

## 2. Render performance

- **Throttled cursor** (`components/CustomCursor.tsx`) — `mousemove` events
  are now coalesced into a single `requestAnimationFrame` callback per
  frame, and the entire GSAP tween loop is skipped when
  `prefers-reduced-motion: reduce` is set. On reduced-motion devices the
  custom cursor no longer renders at all (the native cursor is used).
- **Throttled hover preview** (`app/_components/ProjectList.tsx`) — the
  desktop preview-following GSAP tween is now scheduled through rAF instead
  of firing per-mousemove.
- **Throttled chat scroll detection** (`components/ChatUI.tsx`) — the
  "show scroll up / down" indicator now uses an rAF gate.
- **Typewriter respects reduced motion** (`app/_components/Banner.tsx`) —
  when the user prefers reduced motion, the typewriter renders the first
  word statically and stops scheduling `setTimeout` callbacks.
- **Memoised sub-components** — `MusicPlayer`, `Banner.SocialIcon`,
  `ArchitectureExplorer` state are wrapped in `memo`/`useCallback` to
  avoid unnecessary re-renders.
- **ParticleBackground** (`components/ParticleBackground.tsx`) — when the
  user prefers reduced motion, the canvas is drawn **once** (no rAF loop).
- **WelcomePopup / MusicPlayer** — framer-motion `initial`/`exit` props
  are skipped when reduced motion is set.

## 3. Images

- Added `sizes` to every `<Image>` call so Next can pick the right
  generated size for the viewport:
  - `app/_components/AboutMe.tsx` — LCP portrait (with `priority`).
  - `app/_components/Skills.tsx` — 32×32 skill icons.
  - `app/_components/Experiences.tsx` — company logos.
  - `app/_components/OpenSource.tsx` — org icons.
  - `app/_components/ProjectList.tsx` — desktop hover preview.
  - `components/projects/ProjectDetail.tsx` — architecture schematic SVG.
- Added `loading="lazy"` to non-LCP images.
- Added `loading="lazy"` + explicit `unoptimized` to the SVG hover preview
  (SVGs should not go through the optimisation pipeline).

## 4. Loading & UX

- `app/loading.tsx`, `app/architecture/loading.tsx`,
  `app/opensource/[slug]/loading.tsx`, `app/projects/[slug]/loading.tsx`
  were already in place and now render an `aria-live="polite"` skeleton
  during route transitions.
- `app/_components/SectionFallback.tsx` — new lightweight fallback for
  Suspense boundaries on the home page.
- `components/WelcomePopup.tsx` — adds an **Escape** key listener so the
  popup is now keyboard-dismissible; the user no longer has to find the
  close button. The `initial`/`exit` animation is skipped under
  reduced motion.

## 5. Accessibility

- `components/Navbar.tsx` — the menu trigger now has `aria-label`,
  `aria-expanded`, and `aria-controls="primary-navigation"`; the menu
  panel itself is `role="dialog"` `aria-modal="true"` and
  `aria-label="Primary navigation"`.
- `components/MusicPlayer.tsx` — trigger button now has `aria-pressed` and
  a focus-visible ring; play / pause buttons get the same.
- `components/CustomCursor.tsx` — exposes an `aria-hidden="true"` and the
  component returns `null` for users with `prefers-reduced-motion: reduce`,
  so the native cursor remains the primary interaction mechanism.
- `components/WelcomePopup.tsx` — keeps `role="alert"` and is dismissible
  via Escape.

## 6. SEO & metadata

- Root `app/layout.tsx` metadata is now a full `Metadata` object with:
  - OpenGraph (`type`, `locale`, `siteName`, `title`, `description`, image).
  - Twitter (`summary_large_image` card + creator handle).
  - `robots` (index/follow + Googlebot directives).
  - `metadataBase` derived from `SITE_URL`.
  - `template` for the per-page title suffix.
  - `viewport` (`themeColor`, `colorScheme`, `initialScale`).
- New `app/robots.ts` (Next 16 metadata file) emits `/robots.txt` and
  points search engines at the sitemap.
- `app/sitemap.ts` now uses the central `SITE_URL` instead of a
  hard-coded domain.

## 7. API hardening

All architecture API routes now go through a shared set of helpers in
`lib/api-helpers.ts`:

- `readJsonBody(req, route)` — bounded body read, returns a 413 if the
  payload exceeds 32 KB, a 400 if the JSON is malformed.
- `requireString(value)` / `requirePositiveInt(value)` — type-safe
  extraction with consistent 400 responses.
- `describeRouteError(route, error)` — strips stack traces and PII,
  emits a stable code via `logAiError`.

Affected routes:

- `app/api/architecture/route.ts`
- `app/api/architecture-explain/route.ts`
- `app/api/architecture-voice/route.ts`
- `app/api/architecture-compare/route.ts`
- `app/api/architecture-intel/route.ts`
- `app/api/architecture-simulate/route.ts`
- `app/api/architecture-challenge/route.ts`
- `app/api/chat/route.ts` — also gains input validation on `messages`,
  drops the implicit `any`.

## 8. Code health

- **`lib/site.ts`** — single source of truth for the site URL and
  brand strings.
- **`lib/api-helpers.ts`** — eliminates the duplicated
  `try { await req.json() } catch { ... }` boilerplate across 8 routes.
- **`components/AudioProvider.tsx`** — wraps `localStorage` reads in
  `try/catch` so SSR and Safari private mode can no longer throw.
- **`components/KonamiEasterEgg.tsx`** — removes the two
  `console.log('GOD MODE ACTIVATED/DEACTIVATED')` lines that were
  polluting production logs.
- The pre-existing `lib/rateLimit.ts`, `lib/groq.ts`, `lib/motion-prefs.ts`,
  `lib/architecture/diagram-parser.ts` and the loading skeletons were
  left untouched (they were already correctly designed in the in-progress
  refactor).

## Verification

```bash
# from c:\Users\diino\Desktop\Portfolio-2.0
npm run build      # Production build (Turbopack)
npm run start      # Serve the production build

# Optional — direct ESLint run (Next 16 removed `next lint`):
npx eslint . --ext .ts,.tsx
```

Then visit the routes below to exercise the optimisations:

- `/` — home (dynamic-imported sections + Suspense fallback).
- `/architecture` — Architecture Explorer with localStorage cache.
- `/projects/<slug>` — interactive architecture panels (Intel,
  Compare, Simulate, Voice).
- `/opensource/<slug>` — open-source detail page.
- `/sitemap.xml` and `/robots.txt` — generated automatically.

## 9. v2 — Portfolio upgrade plan (11 PRs)

The v2 batch landed as 11 conventional-commits PRs in this order. Each
PR builds on top of the v1 foundation and ships a coherent slice.

| #  | Commit  | PR title                                                            |
| -- | ------- | ------------------------------------------------------------------- |
| 1  | `79e078e` | **PR #1 Foundation** — section-aware navbar, LQIP, font subset, smart prefetch |
| 2  | `936d74c` | **PR #2 Hero & motion** — magnetic CTAs, dividers, cursor hover-glow, terminal intro |
| 3  | `84b8638` | **PR #3 Power features** — kbar command palette + toast system |
| 4  | `a56db1d` | **PR #4 Content & proof** — live GitHub stats, trust section, project lightbox |
| 5  | `78df331` | **PR #5 Projects polish** — filter chips, animated counters, tech pills, route transitions |
| 6  | `805d7f0` | **PR #6 Architecture** — live preview, copy, export, full-screen, node detail drawer |
| 7  | `e8d83d1` | **PR #7 Chat & microinteractions** — chatbot polish, smooth scroll, contact form, Calendly, resume |
| 8  | `13e0ef4` | **PR #8 OSS depth** — contribution heatmap, merged-PRs badge, time-period normalisation |
| 9  | `1b63e12` | **PR #9 Tier 2 catch-up** — `/uses` page |
| 10 | `a20e391` | **PR #10 Case studies + blog skeleton** |
| 11 | `0a1819c` | **PR #11 Tier 3 polish** — talks, awards, secret theme, Konami persistence, noise overlay, gradient hero, skip links |

### Highlights

- **Command palette** (`/` or `Cmd/Ctrl+K`) — kbar provider with
  Navigation, Projects, Open Source, Quick Actions (copy email/phone),
  and Socials sections. Recent queries persist in localStorage.
- **Magnetic CTAs** in the hero — GSAP `quickTo` capped at 12 px with
  `data-cursor="link"` so the custom cursor reacts on hover.
- **Live GitHub stats** via `ungh.cc` (no auth) — cached 1 hour at the
  edge, fanned out in parallel from `/api/github-stats`.
- **Contribution heatmap** built from scratch (Tailwind + SVG, ~40 lines
  of logic) over `/api/contrib-graph` proxying
  `github-contributions.vercel.app`.
- **Live mermaid editor** at `/architecture` — type, render, copy,
  export to SVG/PNG, full-screen via `?present=1`, side-drawer
  node details on click.
- **Contact form** with react-hook-form + zod, ARIA-aware errors, a
  hidden honeypot, and a `mailto:` fallback so it's never blocking.
- **Resume download** with privacy-respecting localStorage counter.
- **Calendar CTA** env-gated on `NEXT_PUBLIC_CALENDLY_URL`.
- **Route-level crossfade** via `AnimatePresence mode="wait"` keyed on
  `usePathname()`.
- **Skip links** (`#main`, per-section) + a site-wide ~6% SVG-noise
  overlay (`prefers-reduced-motion` aware).
- **Easter eggs:** type `dhinesh` anywhere outside inputs for a green
  theme pulse + confetti; `Konami code` persists god-mode via
  sessionStorage across route changes.
- **New routes:** `/uses`, `/blog`, `/blog/[slug]`, `/case-studies/[slug]`,
  `/feed.xml` (RSS 2.0).

### Deferred (per scope)

- Light theme (item 25) — site remains dark-only.
- Service worker (item 35).
- EN/TA i18n (item 34).
- Hover sound (item 28) — would add complexity for marginal benefit.
- Per-node detail content for `lib/architecture-diagrams.ts` (NodeDetailDrawer
  ships with a placeholder map keyed by node id; TODO documented in code).
