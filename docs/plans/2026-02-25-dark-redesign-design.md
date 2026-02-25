# Dark Redesign — Design Document

**Date:** 2026-02-25
**Scope:** Both `apps/landing` and `apps/dashboard`
**Direction:** Dark-first, technical aesthetic with indigo accent — inspired by Vercel / Linear

---

## 1. Color System

Dark-first CSS variables. `:root` becomes the dark theme (no `.dark` class required on `<html>`). The existing `.dark` block in `globals.css` is replaced with a `.light` override for future use.

| Token | HSL | Hex | Usage |
|---|---|---|---|
| `--background` | `240 10% 3.9%` | `#09090b` | Page background (zinc-950) |
| `--foreground` | `0 0% 98%` | `#fafafa` | Primary text |
| `--card` | `240 10% 7%` | `#18181b` | Card/panel surfaces (zinc-900) |
| `--card-foreground` | `0 0% 98%` | `#fafafa` | Card text |
| `--muted` | `240 3.7% 15.9%` | `#27272a` | Muted surfaces (zinc-800) |
| `--muted-foreground` | `240 5% 64.9%` | `#a1a1aa` | Secondary text (zinc-400) |
| `--border` | `240 3.7% 25%` | `#3f3f46` | Borders, dividers (zinc-700) |
| `--primary` | `239 84% 67%` | `#818cf8` | Indigo-400 — buttons, glows, active states |
| `--primary-foreground` | `0 0% 100%` | `#ffffff` | Text on primary buttons |
| `--accent` | `239 84% 67%` | `#818cf8` | Same as primary |
| `--accent-foreground` | `0 0% 100%` | `#ffffff` | — |
| `--ring` | `239 84% 67%` | `#818cf8` | Focus rings |
| `--input` | `240 3.7% 20%` | `#303036` | Input borders |

**Implementation:** Update `packages/ui/src/styles/globals.css`. Remove the old zinc light-mode `:root` and replace it with the dark values above.

---

## 2. Shared Layout (both apps)

Both apps add `class="dark"` to `<html>` in their root layouts to ensure shadcn/ui components render correctly in dark mode.

---

## 3. Landing — `apps/landing`

### 3.1 Header (`src/components/layout/header.tsx`)

- Background: `bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800`
- Logo: `"Kinkang"` text with a small `⬡` or `·` prefix in `text-indigo-400`
- Nav links: `text-zinc-400 hover:text-zinc-100 transition-colors`
- "Sign in" button: `variant="ghost"` with `text-zinc-300`
- "Get Started" button: solid indigo (`bg-indigo-600 hover:bg-indigo-500 text-white`)

### 3.2 Home Page (`src/app/page.tsx`)

**Hero section:**
- Full-viewport (`min-h-screen`) centered flex column
- Background layers (pure CSS, no images):
  - Base: `bg-zinc-950`
  - Dot-grid overlay: CSS `background-image: radial-gradient(circle, #3f3f46 1px, transparent 1px)` at `24px 24px`
  - Indigo glow: two absolute `<div>`s with `bg-indigo-600/20 blur-3xl rounded-full` positioned behind headline
- Small pill badge above headline: `"Kafka management, simplified →"` — `border border-zinc-700 bg-zinc-900 text-zinc-400 text-xs rounded-full px-3 py-1`
- Headline: large (`text-5xl lg:text-7xl font-bold tracking-tight`), the key word `"Managed"` in `bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent`
- Subheadline: `text-zinc-400 text-lg max-w-2xl`
- CTAs: "Get Started" (solid indigo) + "See how it works" (ghost/outline `border-zinc-700`)
- Note: hero is designed to accommodate a technical visualization/diagram beneath the CTAs in a future iteration

**Trust strip (new section):**
- Single row: `"Trusted by engineers at"` + 4–5 greyed-out company name placeholders in `text-zinc-600 font-medium`
- `border-y border-zinc-800 py-8`

**Features section:**
- Section heading with subtle `text-indigo-400` label above: `"Why Kinkang"`
- Main heading with gradient: `"Everything Kafka needs,\nnone of the ops."`
- 6 feature cards: `bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-600 transition-colors`
- Icon: wrapped in `bg-indigo-500/10 text-indigo-400 rounded-lg p-2 w-10 h-10`
- Title: `text-zinc-100 font-semibold`
- Description: `text-zinc-400 text-sm`

**CTA section:**
- `bg-zinc-900 border border-zinc-800 rounded-2xl` card, centered
- Heading + subtext + solid indigo button
- Subtle indigo glow behind the card

### 3.3 Pricing Page (`src/app/pricing/page.tsx`)

- All cards: `bg-zinc-900 border border-zinc-800 rounded-xl`
- Pro/recommended tier: `border-indigo-500 bg-indigo-500/5` + `"Most Popular"` badge in indigo
- Check icons: `text-indigo-400`
- Price text: large white, billing period in `text-zinc-500`

### 3.4 FAQs Page (`src/app/faqs/page.tsx`)

- Accordion items: `border-b border-zinc-800`
- Trigger: `text-zinc-100 hover:text-zinc-100` (no color change on hover, just underline)
- Content: `text-zinc-400`
- Bottom CTA card: `bg-zinc-900 border border-zinc-800`

### 3.5 About Page (`src/app/about/page.tsx`)

- Team cards: use `Avatar` component from `@workspace/ui/components/avatar` with initials fallback
- Values cards: same feature card treatment as homepage features
- Location badges: `bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-300`

### 3.6 Blog Listing (`src/app/blog/page.tsx`)

- Cards: `bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors`
- Category badge: `variant="outline"` with `text-indigo-400 border-indigo-500/50`
- Date: `text-zinc-500`

### 3.7 Contact Page (`src/app/contact/page.tsx`)

- Contact method cards: `bg-zinc-900 border border-zinc-800 rounded-xl`
- Icons: `text-indigo-400`
- Form inputs: `bg-zinc-900 border-zinc-700 focus:border-indigo-500 text-zinc-100 placeholder:text-zinc-500`

### 3.8 Footer (`src/components/layout/footer.tsx`)

- `bg-zinc-950 border-t border-zinc-800`
- Link text: `text-zinc-400 hover:text-zinc-100 transition-colors`
- Section headings: `text-zinc-100 font-semibold text-sm`
- Copyright + secondary links: `text-zinc-600`
- Social icons: `text-zinc-500 hover:text-zinc-300`

---

## 4. Dashboard — `apps/dashboard`

### 4.1 Sidebar (`src/components/layout/sidebar.tsx`)

- Container: `bg-zinc-900 border-r border-zinc-800 w-60 flex flex-col`
- Logo area: `px-4 py-5 border-b border-zinc-800`
- Nav items default: `text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md px-3 py-2 text-sm transition-colors`
- Nav item active: `bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500 rounded-r-md`
- Bottom section: user info + sign-out link

### 4.2 Top Bar (`src/components/layout/top-bar.tsx`)

- `bg-zinc-950 border-b border-zinc-800 h-14 px-6 flex items-center justify-between`
- Left: breadcrumb in `text-zinc-400`, current page in `text-zinc-100`
- Right: `Avatar` + `DropdownMenu` for user actions (profile, sign out)

### 4.3 Clusters Page — Empty State

- Full-page centered empty state
- `bg-zinc-900 border border-dashed border-zinc-700 rounded-xl p-12`
- Icon: `text-zinc-600` large Zap or Server icon
- Heading: `text-zinc-100`, subtext: `text-zinc-400`
- CTA: solid indigo "Create your first cluster" button

### 4.4 Cluster Detail Page

- Page header: cluster name `text-xl font-semibold text-zinc-100` + status `Badge`
- 3 metric cards: `bg-zinc-900 border border-zinc-800 rounded-xl p-5`
  - Icon in `bg-indigo-500/10 text-indigo-400 rounded-lg p-2`
  - Metric value: `text-2xl font-bold text-zinc-100`
  - Label: `text-zinc-400 text-sm`
- Brokers table: shadcn `Table` component with `bg-zinc-900` rows, `border-zinc-800` separators
  - Status column: `Badge` — `bg-emerald-500/10 text-emerald-400 border-emerald-500/30` for healthy, `bg-red-500/10 text-red-400` for down

### 4.5 Settings & Billing Pages

- Section cards: `bg-zinc-900 border border-zinc-800 rounded-xl`
- Section header: `border-b border-zinc-800 px-6 py-4`
- Labels: `text-zinc-400 text-sm`
- Values: `text-zinc-100`

### 4.6 Auth Pages (Sign In / Sign Up)

- Page background: `bg-zinc-950`
- Clerk `appearance` prop configured with:
  - `baseTheme`: `dark` from `@clerk/themes`
  - Card background: `zinc-900`
  - Primary color: indigo `#818cf8`

---

## 5. New shadcn/ui Components to Add

The following components are in `packages/ui` but not yet used — they'll be wired up as part of this redesign:

| Component | Used in |
|---|---|
| `Avatar` | Dashboard top-bar user menu, About page team cards |
| `DropdownMenu` | Dashboard top-bar user dropdown |
| `Table` | Dashboard brokers list |
| `Tabs` | Cluster detail page (overview / brokers / settings tabs) |

---

## 6. Files Changed

| File | Change |
|---|---|
| `packages/ui/src/styles/globals.css` | Replace `:root` with dark tokens, add `.light` override |
| `apps/landing/src/app/layout.tsx` | Add `dark` class to `<html>` |
| `apps/dashboard/src/app/layout.tsx` | Add `dark` class to `<html>`, add Clerk appearance |
| `apps/landing/src/app/page.tsx` | Full hero + features + trust strip redesign |
| `apps/landing/src/components/layout/header.tsx` | Dark header styles |
| `apps/landing/src/components/layout/footer.tsx` | Dark footer styles |
| `apps/landing/src/app/pricing/page.tsx` | Dark cards, indigo Pro tier |
| `apps/landing/src/app/faqs/page.tsx` | Dark accordion |
| `apps/landing/src/app/about/page.tsx` | Avatar on team cards |
| `apps/landing/src/app/blog/page.tsx` | Dark cards |
| `apps/landing/src/app/blog/[slug]/page.tsx` | Dark prose |
| `apps/landing/src/app/contact/page.tsx` + `contact-form.tsx` | Dark inputs |
| `apps/dashboard/src/components/layout/sidebar.tsx` | Dark sidebar + indigo active state |
| `apps/dashboard/src/components/layout/top-bar.tsx` | Dark top-bar + Avatar/DropdownMenu |
| `apps/dashboard/src/app/(dashboard)/clusters/page.tsx` | Dark empty state |
| `apps/dashboard/src/app/(dashboard)/clusters/[clusterId]/page.tsx` | Metric cards + Table |
| `apps/dashboard/src/app/(dashboard)/clusters/[clusterId]/brokers/page.tsx` | Table with status badges |
