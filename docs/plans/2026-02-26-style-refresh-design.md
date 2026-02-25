# Style Refresh — Design Document

**Date:** 2026-02-26
**Scope:** `apps/landing` (primary); `apps/dashboard` buttons optionally
**Inspiration:** neon.com — architectural typography, sticky scrollspy sidebar, pill buttons
**Constraint:** Keep existing dark-violet color system (zinc-950 bg, indigo-400 accent)

---

## 1. Typography

The core change: tighten letter-spacing on display headings and soften weight. Neon uses `font-weight: 400` with `letter-spacing: -0.04em` across all headings — we adapt this while keeping some weight to complement the indigo accent.

| Element | Current | New |
|---|---|---|
| Hero H1 | `font-bold tracking-tight text-5xl lg:text-7xl` | `font-semibold tracking-[-0.04em] text-5xl lg:text-7xl` |
| Section H2 | `font-bold tracking-tight text-3xl` | `font-medium tracking-[-0.03em] text-3xl` |
| Feature card titles | `font-semibold` | `font-medium tracking-tight` |
| Small section labels | unchanged | unchanged |

The hero gradient on `"Managed"` remains. All other copy and body text sizes are unchanged.

**Files:** `apps/landing/src/app/page.tsx` (hero H1, section H2s, feature card titles), and any other page with prominent headings (`pricing`, `about`, `faqs`, `blog`).

---

## 2. Scrollspy Sidebar — Homepage Features Section

Replace the current 3-column feature card grid with a two-column sticky scrollspy layout, matching neon.com's section navigation pattern.

### 2.1 Content Structure

The 6 features are reorganised into 3 named sections, each with 2 feature highlights:

| Section | ID | Feature 1 | Feature 2 |
|---|---|---|---|
| **Kafka Core** | `#kafka-core` | Cluster monitoring | Broker health |
| **Cruise Control** | `#cruise-control` | Partition rebalancing | Auto-scaling |
| **Operations** | `#operations` | Alerting | Security & multi-env |

### 2.2 Layout

```
┌─────────────────────────────────────────────────────────────┐
│  container max-w-6xl                                        │
│  ┌──────────────┐  ┌──────────────────────────────────────┐ │
│  │ Left sidebar │  │ Right scrollable content             │ │
│  │ sticky top-24│  │                                      │ │
│  │ w-[224px]    │  │  [Section heading + 2 feature cards] │ │
│  │              │  │  [Section heading + 2 feature cards] │ │
│  │  • Kafka Core│  │  [Section heading + 2 feature cards] │ │
│  │  Cruise Ctrl │  │                                      │ │
│  │  Operations  │  │                                      │ │
│  └──────────────┘  └──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Sidebar Nav Item Styles

Each nav `<a>` element:
```
relative flex items-center gap-x-2.5 whitespace-nowrap rounded-sm
py-1.5 pl-[18px] text-[15px] leading-none tracking-tight
transition-colors duration-200
before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2
before:size-2 before:rounded-full before:transition-colors before:duration-200
```

- **Active state:** `text-zinc-100 before:bg-indigo-400` — indigo dot (our violet twist vs Neon's white)
- **Inactive state:** `text-zinc-500 hover:text-zinc-300` — muted, dot hidden (no `before:bg-*`)

### 2.4 Scrollspy Behaviour

Client component using `IntersectionObserver`:
- Observe each section `<div id="...">`
- When a section enters the viewport (threshold ~0.4), set it as active in local state
- Nav links `onClick` → smooth scroll to target section (`element.scrollIntoView({ behavior: 'smooth' })`)

New component: `apps/landing/src/components/features/scrollspy-nav.tsx` (client component, `'use client'`).

### 2.5 Section Content

Each section:
```
<section id="kafka-core" className="py-16 scroll-mt-24">
  <div className="mb-2 text-sm font-medium text-indigo-400">Kafka Core</div>
  <h3 className="text-2xl font-medium tracking-tight text-zinc-100 mb-2">...</h3>
  <p className="text-zinc-400 mb-8">...</p>
  <div className="grid gap-5 md:grid-cols-2">
    [2 × feature card]
  </div>
</section>
```

Feature card: `bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors`
Icon wrapper: `bg-indigo-500/10 text-indigo-400 rounded-lg p-2 w-10 h-10 mb-4`

---

## 3. Pill Buttons

All CTA buttons switch to `rounded-full`. Shape only — colors and sizes unchanged.

| Button | Current classes | New classes |
|---|---|---|
| Primary "Get Started" | `bg-indigo-600 hover:bg-indigo-500 ... rounded-md` | same + `rounded-full` |
| Secondary ghost/outline | `border border-zinc-700 ... rounded-md` | same + `rounded-full` |

Applies to: hero CTAs, section CTAs, pricing page buttons, CTA section buttons.
Dashboard sidebar CTA remains rectangular (app UI context, not marketing).

---

## 4. Files Changed

| File | Change |
|---|---|
| `apps/landing/src/app/page.tsx` | Typography updates (H1, H2, card titles); replace feature grid with scrollspy layout; pill buttons on CTAs |
| `apps/landing/src/components/features/scrollspy-nav.tsx` | **New** — client component, `IntersectionObserver` scrollspy |
| `apps/landing/src/app/pricing/page.tsx` | Pill buttons; H2 typography |
| `apps/landing/src/app/about/page.tsx` | H2/H3 typography |
| `apps/landing/src/app/faqs/page.tsx` | H2 typography |
| `apps/landing/src/app/blog/page.tsx` | H1 typography |
| `apps/landing/src/app/contact/page.tsx` | H2 typography; pill CTA button |

---

## 5. What Does NOT Change

- Color tokens (`globals.css`) — untouched
- Dashboard styling — untouched (sidebar, top-bar, cluster pages)
- Header and footer styles
- Card border colors, backgrounds, hover states
- Blog post layout, legal pages
- Velite / MDX pipeline
