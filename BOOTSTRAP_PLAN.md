# Plan: Convert Astro to Next.js Monorepo

## Context

Kinkang is a managed Kafka/Cruise Control service. The current site is built on AstroWind (Astro template) with Tailwind CSS. We're converting to a **Turborepo monorepo** with two Next.js apps: a static landing page and a client dashboard. Fresh start — current content used as reference only, no code migration.

## Architecture Overview

```
kinkang-website/
├── apps/
│   ├── landing/          → Static marketing site (Next.js App Router)
│   └── dashboard/        → Client dashboard with Clerk auth
├── packages/
│   ├── ui/               → Shared shadcn/ui components (@workspace/ui)
│   ├── tailwind-config/  → Shared Tailwind theme (@workspace/tailwind-config)
│   └── typescript-config/ → Shared tsconfig bases
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

**Key decisions:**
- **Monorepo:** Turborepo + pnpm workspaces
- **UI:** shadcn/ui (new-york style) in shared `packages/ui`
- **MDX pipeline:** Velite (build-time, Zod schemas — mirrors current Astro Content Collections)
- **Auth:** Clerk (`@clerk/nextjs`)
- **Icons:** lucide-react (shadcn default)
- **Deployment:** Two Vercel projects from one repo (`kinkang.cloud` + `dashboard.kinkang.cloud`)

## Steps

### Step 1: Clean up and scaffold monorepo skeleton

- Remove all Astro source files (keep git history)
- Create root `package.json`, `pnpm-workspace.yaml`, `turbo.json`
- Create directory structure for all apps and packages
- Set up `packages/typescript-config` with `base.json`, `nextjs.json`, `library.json`

### Step 2: Set up `packages/tailwind-config`

- Create shared `tailwind.config.ts` with Kinkang brand colors (via CSS vars), fonts (Inter), animations (`fadeInUp`), and `@tailwindcss/typography` plugin
- Reference: current `tailwind.config.js` and `src/assets/styles/tailwind.css`

### Step 3: Set up `packages/ui`

- Init shadcn/ui with `components.json` (new-york style, CSS variables, lucide icons)
- Create `src/lib/utils.ts` with `cn()` utility
- Create `src/styles/globals.css` with CSS custom properties (shadcn theming vars)
- Install initial components: Button, Card, Accordion, Input, Textarea, Label, NavigationMenu, DropdownMenu, Sheet, Separator, Badge, Avatar, Table, Tabs
- Configure `package.json` with exports map: `"./components/*"`, `"./hooks/*"`, `"./lib/*"`, `"./styles/*"`

### Step 4: Build `apps/landing` shell

- Create Next.js app with App Router, `next.config.ts` with `transpilePackages: ['@workspace/ui']`
- Create `tailwind.config.ts` extending `@workspace/tailwind-config` with content paths including `../../packages/ui/src/**`
- Create `globals.css` importing `@workspace/ui/styles/globals.css`
- Create root `layout.tsx` with Inter font, metadata template (`%s — Kinkang`), and `<Header>` / `<Footer>`
- Create `components/layout/header.tsx` — sticky header with `NavigationMenu` (shadcn), mobile `Sheet`
- Create `components/layout/footer.tsx` — link columns, social links, legal links
- Navigation data from current `src/navigation.ts`: Home, Solutions (dropdown), Company (dropdown), Resources (dropdown), Contact
- Create `not-found.tsx`

### Step 5: Set up Velite for MDX content

- Add `velite.config.ts` with two collections:
  - `posts` — `content/blog/*.mdx` with schema: title, slug, publishDate, updateDate, draft, excerpt, image, category, tags, author, body
  - `legal` — `content/legal/*.mdx` with schema: title, slug, lastUpdated, body
- Create `components/mdx/mdx-components.tsx` for custom MDX rendering
- Create `lib/content.ts` helpers if needed beyond raw Velite imports
- Update build script: `"build": "velite build && next build"`
- Migrate current privacy.md and terms.md content to MDX files

### Step 6: Build landing page routes

Each page uses section components composed from shadcn/ui primitives. Content is hardcoded in components (not MDX) except blog and legal pages.

**Pages to build:**
- `/` (home) — Hero, FeaturesGrid (why Kinkang), FeaturesGrid (capabilities), Brands, Steps, CTA
- `/about` — Team hero, values, achievements, locations
- `/contact` — Contact info (Slack, email, calendar) + form (Server Action → Web3Forms)
- `/faqs` — FAQ accordion using shadcn Accordion
- `/pricing` — Pricing cards + CTA
- `/solutions/cruise-control` — Product page (coming soon placeholder)
- `/solutions/autoscaling` — Product page (coming soon placeholder)
- `/blog` — Blog listing from Velite posts
- `/blog/[slug]` — Individual post with `generateStaticParams`
- `/privacy` — Legal page from Velite
- `/terms` — Legal page from Velite

### Step 7: Build `apps/dashboard` shell

- Create Next.js app with Clerk
- `middleware.ts` — protect all routes except `/sign-in` and `/sign-up`
- Root `layout.tsx` — `ClerkProvider` wrapper
- `(auth)` route group — centered layout, `sign-in/[[...sign-in]]/page.tsx` and `sign-up/[[...sign-up]]/page.tsx`
- `(dashboard)` route group — sidebar + top bar layout, auth-gated
- `components/layout/sidebar.tsx` — collapsible sidebar with nav links (Clusters, Settings, Billing)
- `components/layout/top-bar.tsx` — breadcrumbs + Clerk `<UserButton />`

### Step 8: Build dashboard placeholder pages

All pages are placeholder shells with title + empty state:
- `/clusters` — cluster list (empty state with "Create cluster" CTA)
- `/clusters/[clusterId]` — cluster overview
- `/clusters/[clusterId]/brokers` — broker list
- `/clusters/[clusterId]/settings` — cluster settings
- `/settings` — account/org settings
- `/billing` — subscription management

### Step 9: Polish and verify

- Add `.env.example` files for both apps (Clerk keys for dashboard, Web3Forms key for landing)
- Add `.gitignore` (node_modules, .next, .velite, .env*)
- Add `.prettierrc` and ESLint config
- Test `pnpm install && pnpm build` from root
- Test `pnpm dev` runs both apps concurrently
- Verify landing page renders all routes
- Verify dashboard auth flow works (needs Clerk keys)

## Vercel Deployment

- Two Vercel projects, same GitHub repo
- **Landing:** Root Directory = `apps/landing`, domain = `kinkang.cloud`
- **Dashboard:** Root Directory = `apps/dashboard`, domain = `dashboard.kinkang.cloud`
- Env vars set per-project in Vercel dashboard
- Turborepo caching works automatically with Vercel

## Verification

1. `pnpm install` succeeds from root
2. `pnpm build` builds all packages and both apps without errors
3. `pnpm dev` starts both apps (landing on :3000, dashboard on :3001)
4. Landing: all routes render, navigation works, blog posts load from MDX
5. Dashboard: Clerk sign-in/sign-up pages render, authenticated routes redirect to sign-in
6. shadcn/ui components import correctly in both apps from `@workspace/ui`
