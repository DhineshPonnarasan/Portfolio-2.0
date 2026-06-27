# 🚀 Dhinesh Ponnarasan — Portfolio

Welcome to the source code of my personal portfolio website. It showcases my
work in AI, Machine Learning, and Software Engineering — with a live
chatbot ("Chitti"), an architecture playground, and a curated open-source
contribution wall.

## ✨ Features

- **🤖 Chitti Chatbot** — SSE-streamed assistant powered by Groq
  (`llama-3.1-8b-instant`), with AbortController, 5 s heartbeat, layered
  rate limit (20/min + 200/hr), 32 KB body cap, and a third-person system
  prompt that never leaks secrets.
- **🎨 Modern UI/UX** — Next.js 15 App Router + React 19, Tailwind CSS,
  Framer Motion, GSAP, and Lenis smooth scroll.
- **📂 Dynamic Project Gallery** — Static-generated routes for every project
  (`/projects/[slug]`) and open-source contribution (`/opensource/[slug]`)
  with per-page `generateMetadata`, JSON-LD, and OpenGraph / Twitter cards.
- **⚡ Performance** — All heavy decorative components are dynamic-imported
  via `components/ClientMounts.tsx`; below-the-fold sections are wrapped in
  `Suspense` with a paint-stable `SectionFallback` skeleton.
- **♿ Accessibility** — Universal `:focus-visible` ring, full
  `prefers-reduced-motion` honour across GSAP timelines, Framer Motion
  entries/exits, particle background, custom cursor, welcome popup, music
  player, chat widget, page transitions, and mermaid animations.
- **⌨️ Command Palette** — `/` or `Cmd/Ctrl+K` opens a kbar palette with
  sections for Navigation, Projects, Open Source, Quick Actions
  (copy email/phone), and Socials. Recent queries persist locally.
- **🧲 Magnetic CTAs + Section Dividers** — Hero CTAs subtly chase the
  cursor (12 px cap); three divider variants separate every section.
- **📊 Live GitHub Stats** — Stars/forks/pull-requests/contributions
  served via `ungh.cc` (no auth), cached at the edge (1h / 6h / 12h).
- **📐 Live Architecture Editor** — Type mermaid, render live, copy
  source, export to SVG/PNG, full-screen via `?present=1`, side-drawer
  node details.
- **📝 Blog + Case Studies** — Hand-rolled MDX blog at `/blog` with RSS
  feed at `/feed.xml`, and long-form `/case-studies/[slug]` for the top
  two projects.
- **🔐 API Hardening** — Every API route goes through `lib/api-helpers.ts`
  (`readJsonBody`, `requireString`, `requirePositiveInt`,
  `describeRouteError`) — bounded body size, type-safe extraction, stable
  error codes via `logAiError`.
- **🧱 SEO** — Per-page metadata, canonical URLs, OpenGraph + Twitter cards,
  JSON-LD `Person` / `WebSite` / `SoftwareSourceCode`, auto-generated
  `sitemap.xml` and `robots.txt`.

See [`OPTIMISATIONS.md`](./OPTIMISATIONS.md) for the full change-log and
verification guide.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 App Router, React 19
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS + `tailwind-merge`
- **Animations**: Framer Motion, GSAP, Lenis
- **AI**: Groq SDK (`llama-3.1-8b-instant`)
- **Diagrams**: Mermaid, d3-graphviz
- **Icons**: Lucide React, react-icons
- **Markdown**: react-markdown + remark-gfm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm or pnpm

### Install

```bash
npm install
# or
pnpm install
```

### Configure environment

```bash
cp .env.example .env.local
```

Then edit `.env.local` and provide at minimum:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Generate a key at <https://console.groq.com/keys>. The Groq key is required
for the chatbot and architecture explanation features; without it, every
AI route gracefully falls back to a streaming offline message so the site
is still usable locally.

See [`.env.example`](./.env.example) for the full list of optional vars
(GA, Hotjar, canonical site URL).

### Run

```bash
npm run dev
# or
pnpm dev
```

Open <http://localhost:3000>.

### Production build

```bash
npm run build
npm start
```

### Type-check & lint

```bash
npx tsc --noEmit
npx eslint . --ext .ts,.tsx
```

## 📁 Project Structure

```
app/                  # Next.js App Router pages, layouts, API routes
components/           # Client + cosmetic components
  ClientMounts.tsx    # dynamic({ ssr: false }) wrapper
lib/
  api-helpers.ts      # shared API route guards
  site.ts             # canonical site URL + brand constants
  data.ts             # projects / experience / OSS contributions
  motion-prefs.ts     # useReducedMotion() hook
  rateLimit.ts        # in-memory per-IP rate limiter
  groq.ts             # Groq client + offline fallback
  jsonld.ts           # Person / SoftwareSourceCode JSON-LD builders
hooks/                # cross-component hooks
types/                # shared TypeScript types
public/               # static assets (logos, OG image, project SVGs)
```

## 🔌 API Routes

All AI routes are rate-limited (default 10/min per IP) and hardened against
oversized bodies (32 KB cap):

| Route                              | Purpose                                       |
|------------------------------------|-----------------------------------------------|
| `POST /api/chat`                   | SSE-streamed chatbot with `/architecture`, `/compare` slash commands |
| `POST /api/architecture`           | Streaming explanation for the playground      |
| `POST /api/architecture-explain`   | Conceptual flow narrative for project pages   |
| `POST /api/architecture-voice`     | Short spoken-style narration                  |
| `POST /api/architecture-intel`     | Q&A against a project's canonical diagram    |
| `POST /api/architecture-compare`   | Two-project side-by-side comparison           |
| `POST /api/architecture-simulate`  | Failure scenario walkthrough                  |
| `POST /api/architecture-challenge` | Feedback on user-attempted reconstruction    |
| `POST /api/enhance-diagram`        | Static diagram HTML lookup                    |
| `GET  /api/github-stats`           | Live stars/forks via ungh.cc (no auth, 1h edge cache) |
| `GET  /api/merged-prs`             | Closed-PR counts per repo (6h edge cache)     |
| `GET  /api/contrib-graph`          | GitHub contribution-graph proxy (12h cache)   |
| `POST /api/contact`                | Contact-form handler (503 by design → mailto fallback) |
| `GET  /api/resume-download`        | Streams `public/resume.pdf` with per-IP rate limit |

## 🆕 New routes (v2)

- `/uses` — Editor, terminal, hardware, and services I use day-to-day.
- `/blog` + `/blog/[slug]` — Hand-rolled MDX blog with two seed posts.
- `/feed.xml` — RSS 2.0 feed of the blog.
- `/case-studies/[slug]` — Long-form case studies for the top two
  projects, reusing `ProjectDetail` for the live Architecture panels.

The keyboard command palette (`/` or `Cmd/Ctrl+K`) and the Navbar menu
both surface these routes, so they're discoverable in-context.

## ♿ Accessibility & Performance

- Universal `:focus-visible` ring is applied at the `@layer base` level so
  every interactive element is keyboard-discoverable without per-component
  opt-in.
- Every GSAP timeline, Framer Motion `initial`/`animate`/`exit`, custom
  cursor, particle background, welcome popup, music player, chat widget,
  scroll animator, page transition, and mermaid animation honours
  `prefers-reduced-motion: reduce` via the shared `useReducedMotion()`
  hook from `lib/motion-prefs.ts`.
- The dev server defaults to port 3000. Start the production server with
  `npm start` after `npm run build`.

## 👤 Author

**Dhinesh Ponnarasan**

- **GitHub**: [@DhineshPonnarasan](https://github.com/DhineshPonnarasan)
- **LinkedIn**: [Dhinesh Ponnarasan](https://www.linkedin.com/in/dhinesh-s-p)

## 📄 License

Copyright © 2025 Dhinesh Ponnarasan. All Rights Reserved.
This project is for personal display purposes only.
