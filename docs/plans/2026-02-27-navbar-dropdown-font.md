# Navbar Dropdown with Overlay + Font Weight Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a neon.com-style wide dropdown with page-dimming overlay to the landing nav, and lighten all heading font weights to `font-normal` (weight 400).

**Architecture:** Three self-contained tasks: (1) add `description` field to nav data, (2) enhance `header.tsx` with overlay + wider panels, (3) sweep all landing pages for font weight classes. Each task ends with a TypeScript build check and commit. No new dependencies required — Radix `NavigationMenu` already exposes `onValueChange`; Tailwind `data-[state=open]:` variants are already configured.

**Tech Stack:** Next.js 15 App Router, shadcn/ui `NavigationMenu` (Radix UI), Tailwind CSS, TypeScript, pnpm monorepo.

---

## Task 1: Add descriptions to nav link data

**Files:**
- Modify: `apps/landing/src/components/layout/nav-links.ts`

### Step 1: Add `description?: string` to the `NavLink` interface

Open `apps/landing/src/components/layout/nav-links.ts`. Replace the `NavLink` interface (lines 1–4):

```ts
export interface NavLink {
  text: string
  href: string
  description?: string
}
```

### Step 2: Populate descriptions for all grouped links

Replace the `headerLinks` array (lines 17–40) with:

```ts
export const headerLinks: NavItem[] = [
  { text: 'Home', href: '/' },
  {
    text: 'Solutions',
    links: [
      { text: 'Kinkang Cruise Control', href: '/solutions/cruise-control', description: 'Automated partition rebalancing' },
      { text: 'Kinkang Autoscale', href: '/solutions/autoscaling', description: 'Dynamic broker scaling' },
    ],
  },
  {
    text: 'Company',
    links: [
      { text: 'About us', href: '/about', description: 'Meet the team' },
    ],
  },
  {
    text: 'Resources',
    links: [
      { text: 'FAQs', href: '/faqs', description: 'Common questions answered' },
      { text: 'Blog', href: '/blog', description: 'Guides and product updates' },
    ],
  },
  { text: 'Contact', href: '/contact' },
]
```

### Step 3: Verify TypeScript compiles

Run from repo root:
```bash
cd /Users/danielgospodinow/Projects/kinkang-website
pnpm --filter landing exec tsc --noEmit
```
Expected: no errors.

### Step 4: Commit

```bash
git add apps/landing/src/components/layout/nav-links.ts
git commit -m "feat(landing): add descriptions to nav link data"
```

---

## Task 2: Enhance header with overlay, wider panels, descriptions, and animation

**Files:**
- Modify: `apps/landing/src/components/layout/header.tsx`

### Step 1: Add `useState` import and open-state tracking

The file already has `'use client'` and imports from React-adjacent libraries but does **not** import `useState`. Add it.

At the top of the file, change the import block. Currently there is no `import { ... } from 'react'` line. Add one after the `'use client'` directive:

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
// ... rest of imports unchanged
```

Then inside the `Header` function body, before the `return`, add:

```tsx
const [menuOpen, setMenuOpen] = useState(false)
```

### Step 2: Wire `onValueChange` on `NavigationMenu`

Find the `<NavigationMenu className="hidden md:flex">` element. Add the `onValueChange` prop:

```tsx
<NavigationMenu
  className="hidden md:flex"
  onValueChange={(v) => setMenuOpen(!!v)}
>
```

### Step 3: Add the dimming overlay div

The overlay must sit between the `<header>` and the rest of the page. Since `Header` renders only the `<header>` element, wrap everything in a fragment and add the overlay as a sibling **after** the header:

Replace:
```tsx
return (
  <header className="sticky top-0 z-50 ...">
    ...
  </header>
)
```

With:
```tsx
return (
  <>
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      {/* ... all existing header content unchanged ... */}
    </header>
    {/* Page dimming overlay — shown when a dropdown is open */}
    <div
      className="fixed inset-x-0 top-16 bottom-0 z-40 bg-zinc-950/80 pointer-events-none transition-opacity duration-200"
      style={{ opacity: menuOpen ? 1 : 0 }}
      aria-hidden="true"
    />
  </>
)
```

### Step 4: Widen panels and add slide-down animation

Find the `<NavigationMenuContent>` element. Currently it wraps a `<ul className="grid w-[200px] gap-1 p-2">`.

Replace the `NavigationMenuContent` block with:

```tsx
<NavigationMenuContent className="data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2 data-[state=open]:fade-in-0 duration-150">
  <ul className="grid w-[280px] gap-1 p-2">
    {item.links.map((link) => (
      <li key={link.href}>
        <NavigationMenuLink asChild>
          <Link
            href={link.href}
            className="flex flex-col select-none rounded-md p-3 no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          >
            <span className="text-sm font-medium text-zinc-100 leading-none">
              {link.text}
            </span>
            {link.description && (
              <span className="mt-1 text-xs text-zinc-500 leading-snug">
                {link.description}
              </span>
            )}
          </Link>
        </NavigationMenuLink>
      </li>
    ))}
  </ul>
</NavigationMenuContent>
```

Also add panel styling to the `NavigationMenuContent`. The shadcn default already applies `bg-popover`; to ensure the zinc-950 dark background override, add className styling:

```tsx
<NavigationMenuContent
  className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2 data-[state=open]:fade-in-0 duration-150"
>
```

### Step 5: Verify TypeScript compiles

```bash
pnpm --filter landing exec tsc --noEmit
```
Expected: no errors.

### Step 6: Quick visual check

Start the dev server:
```bash
pnpm --filter landing dev
```
Open `http://localhost:3000`. Open the "Solutions" dropdown — verify:
- Panel is wider (~280px) and shows title + muted description under each link
- Background dims behind the nav when dropdown is open
- Dropdown slides in from top on open, fades out on close
- Clicking away closes dropdown and removes dim

Stop the server.

### Step 7: Commit

```bash
git add apps/landing/src/components/layout/header.tsx
git commit -m "feat(landing): add dropdown overlay, wider panels with descriptions and slide-down animation"
```

---

## Task 3: Font weight refresh — home + solutions pages

**Files:**
- Modify: `apps/landing/src/app/page.tsx`
- Modify: `apps/landing/src/app/solutions/cruise-control/page.tsx`
- Modify: `apps/landing/src/app/solutions/autoscaling/page.tsx`

### Step 1: Home page (`apps/landing/src/app/page.tsx`)

Apply the following changes:

| Line | Current | Replace with |
|------|---------|--------------|
| H1 (`text-5xl`) | `font-semibold tracking-[-0.04em]` | `font-normal tracking-[-0.04em]` |
| Hero `<p>` (`mx-auto mt-6`) | `text-lg text-zinc-400` | `text-xl text-zinc-400` |
| Features H2 (`text-3xl`) | `font-medium tracking-[-0.03em]` | `font-normal tracking-[-0.03em]` |
| Feature section H3 (`text-2xl`) | `font-medium tracking-[-0.03em]` | `font-normal tracking-[-0.03em]` |
| CTA H2 (`text-3xl`) | `font-medium tracking-[-0.03em]` | `font-normal tracking-[-0.03em]` |

Also change the `<span className="text-zinc-400">none of the ops.</span>` parent H2:
```tsx
<h2 className="mt-2 text-3xl font-normal tracking-[-0.03em] sm:text-4xl">
```

### Step 2: Cruise Control page (`apps/landing/src/app/solutions/cruise-control/page.tsx`)

| Line | Current | Replace with |
|------|---------|--------------|
| H1 line 42 | `font-bold tracking-tight` | `font-normal tracking-[-0.04em]` |
| H2 line 61 | `font-bold` | `font-normal` |
| H3 line 70 (feature card titles) | `font-semibold` | `font-normal` |

### Step 3: Autoscaling page (`apps/landing/src/app/solutions/autoscaling/page.tsx`)

| Line | Current | Replace with |
|------|---------|--------------|
| H1 line 16 | `font-bold tracking-tight` | `font-normal tracking-[-0.04em]` |

### Step 4: Verify TypeScript compiles

```bash
pnpm --filter landing exec tsc --noEmit
```
Expected: no errors.

### Step 5: Commit

```bash
git add apps/landing/src/app/page.tsx apps/landing/src/app/solutions/cruise-control/page.tsx apps/landing/src/app/solutions/autoscaling/page.tsx
git commit -m "feat(landing): lighten heading font weights on home and solutions pages"
```

---

## Task 4: Font weight refresh — about, contact, faqs, pricing, blog pages

**Files:**
- Modify: `apps/landing/src/app/about/page.tsx`
- Modify: `apps/landing/src/app/contact/page.tsx`
- Modify: `apps/landing/src/app/faqs/page.tsx`
- Modify: `apps/landing/src/app/pricing/page.tsx`
- Modify: `apps/landing/src/app/blog/page.tsx`

### Step 1: About page (`apps/landing/src/app/about/page.tsx`)

Apply these changes:

| Element | Current | Replace with |
|---------|---------|--------------|
| H1 line 64 | `font-semibold tracking-[-0.04em]` | `font-normal tracking-[-0.04em]` |
| H2 "The Team" line 79 | `font-medium tracking-[-0.03em]` | `font-normal tracking-[-0.03em]` |
| H3 team member names line 89 | `font-semibold text-zinc-100` | `font-normal text-zinc-100` |
| H3 values titles line 113 | `font-semibold` | `font-normal` |
| H2 "Our Values" line 105 | `font-medium tracking-[-0.03em]` | `font-normal tracking-[-0.03em]` |
| H2 "Where We Are" line 123 | `font-medium tracking-[-0.03em]` | `font-normal tracking-[-0.03em]` |
| H2 "Want to work with us?" line 138 | `font-medium tracking-[-0.03em]` | `font-normal tracking-[-0.03em]` |

Note: The `AvatarFallback` on line 85 has `font-semibold` — this is for initials in a small avatar badge, **leave it unchanged** (it's a UI detail, not a heading).

### Step 2: Contact page (`apps/landing/src/app/contact/page.tsx`)

| Element | Current | Replace with |
|---------|---------|--------------|
| H1 line 42 | `font-semibold tracking-[-0.04em]` | `font-normal tracking-[-0.04em]` |
| H2 "Ways to reach us" line 52 | `font-medium tracking-[-0.03em]` | `font-normal tracking-[-0.03em]` |
| H2 "Send us a message" line 73 | `font-medium tracking-[-0.03em]` | `font-normal tracking-[-0.03em]` |

### Step 3: FAQs page (`apps/landing/src/app/faqs/page.tsx`)

| Element | Current | Replace with |
|---------|---------|--------------|
| H1 line 55 | `font-semibold tracking-[-0.04em]` | `font-normal tracking-[-0.04em]` |
| H2 "Still have questions?" line 78 | `font-medium tracking-[-0.03em]` | `font-normal tracking-[-0.03em]` |

Note: `AccordionTrigger` has `font-medium` on line 67 — this is the FAQ question text inside the accordion widget. **Leave unchanged** (it's a component-level style for interactive elements, not a section heading).

### Step 4: Pricing page (`apps/landing/src/app/pricing/page.tsx`)

| Element | Current | Replace with |
|---------|---------|--------------|
| H1 line 74 | `font-semibold tracking-[-0.04em]` | `font-normal tracking-[-0.04em]` |

Note: `CardTitle` and `font-bold` on plan price spans are card-level component styles — **leave unchanged**.

### Step 5: Blog page (`apps/landing/src/app/blog/page.tsx`)

| Element | Current | Replace with |
|---------|---------|--------------|
| H1 line 32 | `font-semibold tracking-[-0.04em]` | `font-normal tracking-[-0.04em]` |

Note: `CardTitle` inside blog cards uses shadcn's built-in weight — **leave unchanged**.

### Step 6: Verify TypeScript compiles

```bash
pnpm --filter landing exec tsc --noEmit
```
Expected: no errors.

### Step 7: Commit

```bash
git add apps/landing/src/app/about/page.tsx apps/landing/src/app/contact/page.tsx apps/landing/src/app/faqs/page.tsx apps/landing/src/app/pricing/page.tsx apps/landing/src/app/blog/page.tsx
git commit -m "feat(landing): lighten heading font weights on about, contact, faqs, pricing, blog pages"
```

---

## Task 5: Final build verification

### Step 1: Run full monorepo build

```bash
cd /Users/danielgospodinow/Projects/kinkang-website
pnpm build
```
Expected: All packages and both apps build successfully with zero TypeScript errors. 16 static landing pages generated.

### Step 2: Visual smoke test

```bash
pnpm --filter landing dev
```
Visit each page and verify:
- [ ] `http://localhost:3000` — H1 weight 400 (normal), hero body `text-xl`, features sections have `font-normal` headings, scrollspy still works
- [ ] `http://localhost:3000` (desktop) — hover "Solutions" in nav: wide panel with descriptions, page dims, slide-in animation
- [ ] `http://localhost:3000/about` — H1/H2/H3 all `font-normal`
- [ ] `http://localhost:3000/contact` — H1/H2 all `font-normal`
- [ ] `http://localhost:3000/faqs` — H1/H2 `font-normal`, accordion questions unchanged
- [ ] `http://localhost:3000/pricing` — H1 `font-normal`, card prices unchanged
- [ ] `http://localhost:3000/blog` — H1 `font-normal`
- [ ] `http://localhost:3000/solutions/cruise-control` — H1/H2 `font-normal`
- [ ] `http://localhost:3000/solutions/autoscaling` — H1 `font-normal`
- [ ] Mobile: open hamburger menu on `/`, verify sheet drawer still works with no overlay

### Step 3: Commit if there are any minor fixups, then done

If any fixes were needed, commit them. Otherwise the plan is complete.
