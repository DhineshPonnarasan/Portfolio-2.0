# Contributing to Portfolio 2.0

Thanks for taking a look. This is a personal portfolio — small surface area,
high polish bar. Issues and PRs are welcome for any of:

- Bug fixes (layout shifts, console errors, hydration mismatches).
- Accessibility improvements (focus order, ARIA, contrast).
- Performance wins (smaller first-load JS, image size hints).
- Documentation clarity in `README.md` or `OPTIMISATIONS.md`.

For new sections (case studies, blog posts, project entries), please open an
issue first so we can talk through placement before code lands.

## Local setup

```bash
git clone <your-fork-url>
cd Portfolio-2.0
npm install
cp .env.example .env.local
# Optional: add GROQ_API_KEY to .env.local for the chatbot to work offline-free.
npm run dev
```

The dev server runs on `http://localhost:3000`.

## Scripts

| Script              | Purpose                                                |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`       | Turbopack dev server on port 3000.                     |
| `npm run build`     | Production build (Turbopack).                          |
| `npm start`         | Serve the production build.                            |
| `npm run lint`      | `next lint` (ESLint via `eslint-config-next`).         |
| `npm run svgr:icons`| Re-generate typed React components from SVG sources.   |

## Conventions

- **TypeScript**: strict mode is on. No `any` unless it's wrapped in a scoped
  `eslint-disable` with an inline comment (e.g. third-party type escape
  hatches). Add types for any new env var to `lib/env.ts`.
- **Components**: client components live in `components/` or
  `app/_components/` with a `'use client';` directive at the top. Server
  components are the default — leave them server unless they need state,
  effects, or browser-only APIs.
- **Styling**: Tailwind only. Brand colour is `primary` (a green accent).
  See `tailwind.config.ts` for the tokens.
- **Animations**: GSAP for orchestrated timelines, Framer Motion for entry /
  exit, Lenis for scroll. Every animation honours
  `prefers-reduced-motion` via `lib/motion-prefs.ts → useReducedMotion()`.
- **SEO**: every new route needs `generateMetadata` (title + description +
  canonical + OG image). Detail routes should also emit a JSON-LD block.
- **Routes**: use the file-system router. New top-level pages belong in
  `app/<segment>/page.tsx`. Detail routes go in `app/<segment>/[slug]/page.tsx`.
- **Performance**: the first-load JS budget for `/` is **≤ 220 kB gz**. Any
  new client component should be `dynamic()`-imported unless it's LCP.

## Adding a project / open-source entry / blog post

1. **Project**: add to `PROJECTS` in `lib/data.ts` (no visuals or
   architecture diagrams required). The detail page is auto-generated from
   `app/projects/[slug]/page.tsx` via `generateStaticParams`.
2. **Open-source contribution**: add to `MY_CONTRIBUTIONS` with a
   `repo: 'owner/name'` to enable live merged-PR stats via `ungh.cc`. Do
   **not** reorder the existing entries — Microsoft → NVIDIA Megatron-LM →
   NVIDIA TensorRT-LLM → CodeGraphContext → Scanapi → OLake.
3. **Blog post**: drop a `.mdx` file in `content/posts/`. Front-matter
   accepts `title`, `description`, `date`, `tags`, `author`. The slug is
   the filename.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): short summary
fix(scope): short summary
docs(scope): short summary
chore(scope): short summary
```

One commit per logical change. PRs that bundle unrelated work will be asked
to split.

## Reporting a bug

Open an issue with:

- Steps to reproduce (URL + interaction).
- Expected vs. actual behaviour.
- Browser + OS.
- A screenshot or short screencap if it's visual.

## License

This repository is for personal display only. See `LICENSE`. By
contributing, you agree your contributions will be released under the same
terms.