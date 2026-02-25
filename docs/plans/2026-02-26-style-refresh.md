# Style Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply a neon.com-inspired style refresh to `apps/landing`: tighter typography, scrollspy sidebar on the homepage features section, and pill-shaped CTAs — while keeping the dark-violet (zinc-950 + indigo-400) color system.

**Architecture:** Three independent changes applied in sequence: (1) typography — tighter tracking/lighter weight on headings across all pages, (2) scrollspy sidebar — new client component + homepage features section rebuilt as a two-column sticky layout, (3) pill buttons — `rounded-full` on all marketing CTAs. No color tokens change. No dashboard changes.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS, TypeScript, lucide-react, `IntersectionObserver` (browser API, no library needed), shadcn/ui Button component.

---

## Task 1: Typography — Hero page

**Files:**
- Modify: `apps/landing/src/app/page.tsx`

### Step 1: Update H1 heading weight and tracking

In `apps/landing/src/app/page.tsx`, find:
```tsx
<h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
```
Replace with:
```tsx
<h1 className="text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
```

### Step 2: Update features section H2

Find:
```tsx
<h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
```
Replace with:
```tsx
<h2 className="mt-2 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
```

### Step 3: Update CTA section H2

Find:
```tsx
<h2 className="text-3xl font-bold">Ready to get started?</h2>
```
Replace with:
```tsx
<h2 className="text-3xl font-medium tracking-[-0.03em]">Ready to get started?</h2>
```

### Step 4: Add `rounded-full` to hero primary button

Find:
```tsx
className="bg-indigo-600 hover:bg-indigo-500 text-white"
```
Replace with:
```tsx
className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full"
```

### Step 5: Add `rounded-full` to hero secondary button

Find:
```tsx
className="border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white hover:bg-zinc-800"
```
Replace with:
```tsx
className="border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full"
```

### Step 6: Add `rounded-full` to CTA section button

Find:
```tsx
<Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white" asChild>
  <Link href="/contact">Contact Us</Link>
```
Replace with:
```tsx
<Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full" asChild>
  <Link href="/contact">Contact Us</Link>
```

### Step 7: Commit

```bash
git add apps/landing/src/app/page.tsx
git commit -m "style: tighten homepage heading tracking and pill CTAs"
```

---

## Task 2: Typography — Remaining pages

**Files:**
- Modify: `apps/landing/src/app/pricing/page.tsx`
- Modify: `apps/landing/src/app/about/page.tsx`
- Modify: `apps/landing/src/app/faqs/page.tsx`
- Modify: `apps/landing/src/app/contact/page.tsx`
- Modify: `apps/landing/src/app/blog/page.tsx`

### Step 1: Update `pricing/page.tsx`

Find:
```tsx
<h1 className="text-4xl font-bold tracking-tight">Simple Pricing</h1>
```
Replace with:
```tsx
<h1 className="text-4xl font-semibold tracking-[-0.04em]">Simple Pricing</h1>
```

Add `rounded-full` to every `<Button>` on this page. The buttons are rendered from `plans.map(...)`. Find:
```tsx
<Button
  className="w-full"
  variant={plan.highlighted ? 'default' : 'outline'}
  asChild
>
```
Replace with:
```tsx
<Button
  className="w-full rounded-full"
  variant={plan.highlighted ? 'default' : 'outline'}
  asChild
>
```

### Step 2: Update `about/page.tsx`

Find:
```tsx
<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
```
Replace with:
```tsx
<h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
```

Find:
```tsx
<h2 className="text-2xl font-bold">The Team</h2>
```
Replace with:
```tsx
<h2 className="text-2xl font-medium tracking-[-0.03em]">The Team</h2>
```

Find:
```tsx
<h2 className="text-2xl font-bold mb-8">Our Values</h2>
```
Replace with:
```tsx
<h2 className="text-2xl font-medium tracking-[-0.03em] mb-8">Our Values</h2>
```

Find:
```tsx
<h2 className="text-2xl font-bold mb-8">Where We Are</h2>
```
Replace with:
```tsx
<h2 className="text-2xl font-medium tracking-[-0.03em] mb-8">Where We Are</h2>
```

Find:
```tsx
<h2 className="text-3xl font-bold">Want to work with us?</h2>
```
Replace with:
```tsx
<h2 className="text-3xl font-medium tracking-[-0.03em]">Want to work with us?</h2>
```

Add `rounded-full` to the CTA button. Find:
```tsx
<Button asChild>
  <Link href="/contact">Get in Touch</Link>
</Button>
```
Replace with:
```tsx
<Button className="rounded-full" asChild>
  <Link href="/contact">Get in Touch</Link>
</Button>
```

### Step 3: Update `faqs/page.tsx`

Find:
```tsx
<h1 className="text-4xl font-bold tracking-tight">Frequently Asked Questions</h1>
```
Replace with:
```tsx
<h1 className="text-4xl font-semibold tracking-[-0.04em]">Frequently Asked Questions</h1>
```

Find:
```tsx
<h2 className="text-xl font-semibold">Still have questions?</h2>
```
Replace with:
```tsx
<h2 className="text-xl font-medium tracking-tight">Still have questions?</h2>
```

Add `rounded-full` to the CTA button. Find:
```tsx
<Button className="mt-4" asChild>
```
Replace with:
```tsx
<Button className="mt-4 rounded-full" asChild>
```

### Step 4: Update `contact/page.tsx`

Find:
```tsx
<h1 className="text-4xl font-bold tracking-tight">Get in Touch</h1>
```
Replace with:
```tsx
<h1 className="text-4xl font-semibold tracking-[-0.04em]">Get in Touch</h1>
```

### Step 5: Update `blog/page.tsx`

Find:
```tsx
<h1 className="text-4xl font-bold tracking-tight">Blog</h1>
```
Replace with:
```tsx
<h1 className="text-4xl font-semibold tracking-[-0.04em]">Blog</h1>
```

### Step 6: Commit

```bash
git add apps/landing/src/app/pricing/page.tsx \
        apps/landing/src/app/about/page.tsx \
        apps/landing/src/app/faqs/page.tsx \
        apps/landing/src/app/contact/page.tsx \
        apps/landing/src/app/blog/page.tsx
git commit -m "style: tighten heading tracking and pill buttons on remaining pages"
```

---

## Task 3: Create the `ScrollspyNav` client component

**Files:**
- Create: `apps/landing/src/components/features/scrollspy-nav.tsx`

### Step 1: Create the component

Create `apps/landing/src/components/features/scrollspy-nav.tsx` with this content:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'

interface Section {
  id: string
  label: string
}

interface ScrollspyNavProps {
  sections: Section[]
}

export function ScrollspyNav({ sections }: ScrollspyNavProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(id)
          }
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [sections])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="sticky top-24 z-10 pb-60 pt-10">
      <ul className="flex w-[200px] flex-col gap-y-1.5">
        {sections.map(({ id, label }) => {
          const isActive = activeId === id
          return (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className={cn(
                  'relative flex w-full cursor-pointer items-center gap-x-2.5 whitespace-nowrap rounded-sm py-1.5 pl-[18px] text-left text-[15px] leading-none tracking-tight transition-colors duration-200',
                  'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:size-2 before:rounded-full before:transition-colors before:duration-200',
                  isActive
                    ? 'text-zinc-100 before:bg-indigo-400'
                    : 'text-zinc-500 hover:text-zinc-300'
                )}
              >
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
```

### Step 2: Commit

```bash
git add apps/landing/src/components/features/scrollspy-nav.tsx
git commit -m "feat: add ScrollspyNav client component with IntersectionObserver"
```

---

## Task 4: Rebuild the homepage features section with scrollspy layout

**Files:**
- Modify: `apps/landing/src/app/page.tsx`

### Step 1: Update the imports at the top

The current import line:
```tsx
import { ArrowRight, Shield, Zap, BarChart3, Server, Settings, Lock } from 'lucide-react'
```
Replace with (adding `Activity`, `AlertTriangle` for the new feature set):
```tsx
import { ArrowRight, Shield, Zap, BarChart3, Server, Activity, AlertTriangle } from 'lucide-react'
import { ScrollspyNav } from '@/components/features/scrollspy-nav'
```

### Step 2: Replace the `features` array with grouped sections

Remove the existing `const features = [...]` array entirely and replace it with:

```tsx
const featureSections = [
  {
    id: 'kafka-core',
    label: 'Kafka Core',
    heading: 'Cluster management without the toil.',
    description:
      'Real-time visibility into every broker, partition, and consumer group — with zero manual instrumentation.',
    features: [
      {
        icon: BarChart3,
        title: 'Real-time Metrics',
        description:
          'Monitor cluster health, throughput, and latency with comprehensive live dashboards.',
      },
      {
        icon: Server,
        title: 'Multi-Cloud Support',
        description:
          'Works with self-managed Kafka, AWS MSK, and Google Cloud. Deploy anywhere.',
      },
    ],
  },
  {
    id: 'cruise-control',
    label: 'Cruise Control',
    heading: 'Automated rebalancing. Zero guesswork.',
    description:
      'Kinkang runs the full Cruise Control lifecycle — deployment, configuration, upgrades — and surfaces its proposals through a clean UI and API.',
    features: [
      {
        icon: Zap,
        title: 'Automated Rebalancing',
        description:
          'Automatically rebalance partitions across brokers for optimal performance and resource utilization.',
      },
      {
        icon: Activity,
        title: 'REST API',
        description:
          'Full programmatic access to trigger rebalancing, query metrics, and manage clusters.',
      },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    heading: 'Production-grade operations, out of the box.',
    description:
      'Security, alerting, and high availability are built in — not bolted on. Ship to production with confidence.',
    features: [
      {
        icon: Shield,
        title: 'Enterprise Security',
        description:
          'SSL, SASL, VPC peering, and Private Links. Your data stays secure at every layer.',
      },
      {
        icon: AlertTriangle,
        title: 'High Availability',
        description:
          'Built-in redundancy and failover mechanisms. Kinkang outages never affect your Kafka brokers.',
      },
    ],
  },
]

const scrollspySections = featureSections.map(({ id, label }) => ({ id, label }))
```

### Step 3: Replace the features section JSX

Find the entire `{/* Features Section */}` block (lines ~119–150 in the current file):
```tsx
{/* Features Section */}
<section className="py-24">
  <div className="container mx-auto max-w-6xl px-4">
    <div className="text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-indigo-400">
        Why Kinkang
      </p>
      <h2 className="mt-2 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
        Everything Kafka needs,{' '}
        <span className="text-zinc-400">none of the ops.</span>
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
        Everything you need to manage your Kafka clusters with confidence — without the toil.
      </p>
    </div>

    <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-600"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
            <feature.icon className="h-5 w-5 text-indigo-400" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-zinc-100">{feature.title}</h3>
          <p className="mt-2 text-sm text-zinc-400">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

Replace the entire block with:

```tsx
{/* Features Section */}
<section className="py-24">
  <div className="container mx-auto max-w-6xl px-4">
    {/* Section header */}
    <div className="mb-16 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-indigo-400">
        Why Kinkang
      </p>
      <h2 className="mt-2 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
        Everything Kafka needs,{' '}
        <span className="text-zinc-400">none of the ops.</span>
      </h2>
    </div>

    {/* Two-column scrollspy layout */}
    <div className="flex gap-16">
      {/* Left: sticky scrollspy nav */}
      <div className="hidden lg:block shrink-0">
        <ScrollspyNav sections={scrollspySections} />
      </div>

      {/* Right: scrollable feature sections */}
      <div className="flex-1 space-y-4">
        {featureSections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-24 py-12 first:pt-10"
          >
            <p className="mb-2 text-sm font-medium text-indigo-400">{section.label}</p>
            <h3 className="text-2xl font-medium tracking-[-0.03em] text-zinc-100">
              {section.heading}
            </h3>
            <p className="mt-3 max-w-xl text-zinc-400">{section.description}</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {section.features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-700"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                    <feature.icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h4 className="mt-4 text-base font-medium text-zinc-100">{feature.title}</h4>
                  <p className="mt-2 text-sm text-zinc-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  </div>
</section>
```

### Step 4: Verify the page builds

```bash
cd /Users/danielgospodinow/Projects/kinkang-website
pnpm --filter landing build
```

Expected: build completes with no TypeScript errors.

If there are errors, they will be type errors in the new component or import paths — fix them before continuing.

### Step 5: Commit

```bash
git add apps/landing/src/app/page.tsx
git commit -m "feat: replace feature grid with scrollspy sidebar layout on homepage"
```

---

## Task 5: Verify visually with dev server

### Step 1: Start the landing dev server

```bash
pnpm --filter landing dev
```

Open http://localhost:3000 in the browser.

### Step 2: Check the homepage

Verify:
- [ ] Hero H1 is visibly tighter in letter-spacing than before (compare: before it looked wide, now it should feel compressed)
- [ ] "Get Started" and "See how it works" buttons are pill-shaped
- [ ] Scrolling past the trust strip reveals the features section with a left sidebar showing "Kafka Core", "Cruise Control", "Operations"
- [ ] Clicking a sidebar item smoothly scrolls to that section
- [ ] The active sidebar item shows an **indigo dot** on the left + white text; inactive items are muted gray
- [ ] On mobile (resize to < 1024px), the sidebar is hidden (`hidden lg:block`)

### Step 3: Check other pages

Visit:
- http://localhost:3000/pricing — pill buttons on pricing cards
- http://localhost:3000/about — tighter headings
- http://localhost:3000/faqs — tighter H1
- http://localhost:3000/blog — tighter H1

### Step 4: Commit verification note

If everything looks correct:
```bash
git add -p  # stage any minor tweaks made during visual review
git commit -m "style: visual review tweaks from dev server check"
```

---

## Task 6: Final build check

### Step 1: Full monorepo build

```bash
cd /Users/danielgospodinow/Projects/kinkang-website
pnpm build
```

Expected: both `apps/landing` and `apps/dashboard` build successfully.

### Step 2: Commit if any remaining changes

```bash
git status
# If clean, done. If there are changes:
git add -A
git commit -m "fix: address any remaining build issues from style refresh"
```

---

## Summary of Files Changed

| File | Change |
|---|---|
| `apps/landing/src/app/page.tsx` | H1/H2 tracking, pill CTAs, scrollspy layout replacing feature grid |
| `apps/landing/src/components/features/scrollspy-nav.tsx` | **New** — sticky scrollspy nav client component |
| `apps/landing/src/app/pricing/page.tsx` | H1 tracking, pill buttons |
| `apps/landing/src/app/about/page.tsx` | H1/H2 tracking, pill CTA |
| `apps/landing/src/app/faqs/page.tsx` | H1 tracking, pill CTA |
| `apps/landing/src/app/contact/page.tsx` | H1 tracking |
| `apps/landing/src/app/blog/page.tsx` | H1 tracking |
