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

## 10. v3 — Content depth, microinteractions, SEO depth, code health

A single follow-up pass that builds on top of v2 without changing existing
PR contracts. Net effect: the portfolio reads more like a person, every
list has an empty state, and SEO coverage is wider.

### Content depth

- **`lib/data.ts`**
  - Every `PROJECTS[i].metrics` entry rewritten with concrete dataset /
    hardware / latency details (e.g. *"21% lift in precision-recall AUC
    over a baseline XGBoost classifier on a 480k-row SaaS customer-event
    dataset."*). No more bare *"21% improvement"* strings.
  - New `TESTIMONIALS` array — 3 entries, 1 marked `public: true`, 2 marked
    `public: false` and rendered as grey "Available on request" slots. Two
    of the three carry an explicit `// TODO: Real testimonial` placeholder
    so the user can drop in real quotes later.
  - New `CERTIFICATIONS` array — AWS ML Specialty (In Progress), GCP
    Professional ML Engineer (TODO), Azure AI Engineer Associate AI-102
    (TODO). Marks the date + link for each.
  - New `SPEAKING` array — the existing IEEE paper presented at iTech SECOM
    2025 plus one `TODO` placeholder slot.
  - Every `MY_EXPERIENCE` entry gets a `learned` one-liner surfaced in the
    Experience card on the home page.

- **`app/_components/AboutMe.tsx`** — bio rewritten to read like Dhinesh
  (SUNY Binghamton + Uplifty AI + Microsoft/NVIDIA Megatron-LM/TensorRT-LM
  + open-source supply-chain work), with a four-line intro and two-column
  *"AI/ML + SYSTEMS / OPEN SOURCE"* sub-headings.

- **`app/_components/Skills.tsx`** — added a one-line "what I'm best at"
  intro paragraph above the categories.

- **`app/_components/Experiences.tsx`** — each card now shows a *"What I
  learned"* one-liner sourced from `MY_EXPERIENCE[i].learned`. Falls back
  to a friendly default if a future entry omits the field.

### Microinteractions

- **`app/not-found.tsx`** — quick-nav pills (Home / Projects / Architecture
  / Blog) under the existing `Reboot System` CTA. Same dark + glitch
  aesthetic.
- **`app/error.tsx`** — friendly copy + `Try again` button + `Back to home`
  link. Stable digest kept in dev only.
- **`app/blog/[slug]/loading.tsx`**, **`app/case-studies/[slug]/loading.tsx`**,
  **`app/uses/loading.tsx`** — route-specific skeletons with
  `aria-live="polite"`. `app/architecture/loading.tsx`,
  `app/loading.tsx`, `app/projects/[slug]/loading.tsx`,
  `app/opensource/[slug]/loading.tsx` were already present.
- **Empty states**
  - `components/CommandPalette/CommandPalette.tsx` — kbar now renders a
    "No matches for `…`" empty state with chip suggestions when a search
    returns zero results.
  - `app/blog/page.tsx` — "No posts yet" already covered; verified copy.
  - `app/_components/ProjectList.tsx` — existing "No projects match this
    filter yet" empty state verified.
- **`app/_components/CareerTimeline.tsx`** (new) — compact horizontal scroll
  on mobile, vertical rail on desktop, drawn from `MY_EXPERIENCE` +
  `MY_EDUCATION`. Wired into the home page after Experiences.

### SEO depth

- **`lib/jsonld.ts`** — new `BreadcrumbList`, `Article` (blog), and
  `Course` (education) builders. Wired into:
  - `/blog/[slug]` — Article + BreadcrumbList.
  - `/projects/[slug]` — BreadcrumbList (in addition to existing
    SoftwareSourceCode).
  - `/opensource/[slug]` — BreadcrumbList.
- **`Person` JSON-LD** on home now includes `alumniOf` +
  `worksFor` so recruiters can read the academic + current employer
  graph without scraping prose.
- **`app/sitemap.ts`** — extended to include `/uses`, `/blog`, `/feed.xml`,
  all `/projects/[slug]`, all `/opensource/[slug]`, all
  `/case-studies/[slug]`, and all `/blog/[slug]`. Uses blog `date` for
  `lastModified` when available.
- **`app/robots.ts`** — explicit allow-all + disallow for `/api/` and
  `/_next/`. Added an AI-crawler group (`GPTBot`, `ClaudeBot`,
  `PerplexityBot`, `Google-Extended`) with the same rule set so the
  portfolio is indexable by LLM search without leaking APIs.
- **`generateMetadata`** audited on every page; existing OG + Twitter + canonical
  coverage confirmed.

### Code health

- **`lib/env.ts`** (new) — single typed source of truth for every env var
  the codebase touches. Server-side throws loudly on missing required
  values; client-side never crashes (public vars are inlined by Next).
- **`any` sweep**
  - `app/api/architecture/route.ts` — removed the `for await (… as any)`
    cast; the Groq stream is correctly typed.
  - `app/_components/ProjectList.tsx` — replaced `contextSafe?.(...) as any`
    with a typed callback.
  - `components/Button.tsx` — `Child` is now typed `{ icon: boolean }`
    instead of `{ icon: any }`; `handleClick` is typed via a single
    `ClickHandler` lookup instead of `as any` propagation.
  - `components/icons/CustomIcons.tsx` — `[key: string]: any` replaced
    with a proper `SVGProps<SVGSVGElement>` intersection.
  - The three `code({ … }: any)` props for `react-markdown` component
    maps (in `ChatUI.tsx`, `ProjectDetail.tsx`, `ArchitectureExplorer.tsx`)
    are documented inline + wrapped with scoped
    `eslint-disable @typescript-eslint/no-explicit-any` so future
    contributors know the cast is intentional.
  - The remaining `any` uses are intrinsic third-party escape hatches
    (Web Speech API in `ChatInput.tsx` and `VoiceArchitectureExplanation.tsx`,
    `d3-graphviz` in `SystemDiagramGraphviz.tsx`) and are documented as
    such.
- **`@ts-expect-error` sweep** — only one remains
  (`components/projects/SystemDiagramGraphviz.tsx`) and it is intentional:
  `d3-graphviz` ships no type declarations.
- **`@deprecated` sweep** — none found.
- **Production console** — `lib/groq.ts` `logAiError` is the only path that
  still emits `console.error`, and every call passes a stable route + code
  pair (no PII, no stack traces).

### Footer polish

- **`components/Footer.tsx`** — site map (6 links), social icons row (4
  platforms + email), build stamp (`Last deployed: <date>` driven by
  `NEXT_PUBLIC_LAST_DEPLOYED` with a build-time fallback), and a
  *"Built with Next.js + ❤️, typed in TypeScript, themed in dark mode"*
  line. The existing Resume download + Calendly CTAs are unchanged.

### Chatbot polish

- **`components/ChatUI.tsx`** — replaced the generic
  *"Where is Dhinesh?" / "Current company?"* chips with the specific
  questions listed in the v3 brief.
- **`components/ChatWidget.tsx`** — initial greeting shortened; pushes the
  user toward the input or kbar shortcuts.
- **`lib/groq.ts`** — offline fallback message rewritten to nudge the
  user toward Projects / Experience / kbar instead of dead-ending.

### Verification (v3)

```bash
cd "c:\Users\diino\Desktop\Portfolio-2.0"
npx tsc --noEmit   # strict type-check across the new code
npx next build     # production build, capture first-load JS for /
```

Bundle target: first-load JS for `/` should stay ≤ 220 kB gz.
A v3 build that exceeds the budget can split the heaviest client
component on `/` (typically the chatbot or an eagerly-imported diagram).

### TODOs left for the user

- `lib/data.ts → TESTIMONIALS` — two of three slots carry
  `// TODO: real testimonial` placeholders.
- `lib/data.ts → CERTIFICATIONS` — AWS ML Specialty is `In Progress`;
  the other two are `TODO`. Swap status + add the actual certificate link
  when issued.
- `lib/data.ts → SPEAKING` — one `TODO` placeholder for a future talk.
- `lib/architecture-diagrams.ts → NodeDetailDrawer` — node detail content
  remains a placeholder map keyed by id (already documented in code).
