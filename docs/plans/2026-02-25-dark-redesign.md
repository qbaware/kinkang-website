# Dark Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign both apps with a dark-first aesthetic: zinc-950 backgrounds, indigo-400 accent, radial glow hero, polished shadcn/ui surfaces throughout.

**Architecture:** Replace the light `:root` CSS tokens with dark values. Both app root layouts get `class="dark"` on `<html>`. All pages are restyled with new Tailwind classes — no new dependencies except `@clerk/themes` for the dashboard auth pages.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS, shadcn/ui (zinc + indigo), Lucide icons, `@clerk/themes` (new install for dashboard).

**Design doc:** `docs/plans/2026-02-25-dark-redesign-design.md`

---

## Task 1: Dark CSS token foundation

**Files:**
- Modify: `packages/ui/src/styles/globals.css`

Replace the entire `:root` block with dark-first tokens. The `.dark` block becomes a `.light` override stub for future use.

**Step 1: Replace globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Dark-first: :root IS the dark theme */
  :root {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 7%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 7%;
    --popover-foreground: 0 0% 98%;
    --primary: 239 84% 67%;
    --primary-foreground: 0 0% 100%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 239 84% 67%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 25%;
    --input: 240 3.7% 20%;
    --ring: 239 84% 67%;
    --radius: 0.5rem;
    --sidebar-background: 240 10% 7%;
    --sidebar-foreground: 0 0% 98%;
    --sidebar-primary: 239 84% 67%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 239 84% 15%;
    --sidebar-accent-foreground: 239 84% 67%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 239 84% 67%;
  }

  /* Light mode override — reserved for future toggle */
  .light {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 239 84% 55%;
    --primary-foreground: 0 0% 100%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 239 84% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**Step 2: Verify type check still passes**

```bash
pnpm --filter @workspace/landing check-types
pnpm --filter @workspace/dashboard check-types
```

Expected: both exit 0 (no type errors — this is CSS only)

**Step 3: Commit**

```bash
git add packages/ui/src/styles/globals.css
git commit -m "feat: dark-first CSS token system with indigo accent"
```

---

## Task 2: Add `dark` class to both app root layouts

**Files:**
- Modify: `apps/landing/src/app/layout.tsx`
- Modify: `apps/dashboard/src/app/layout.tsx`

shadcn/ui components check for `class="dark"` on `<html>` to apply dark variants. Without this, dropdowns and sheets render with light backgrounds.

**Step 1: Update landing layout**

In `apps/landing/src/app/layout.tsx`, find the `<html>` tag and add `className="dark"`:

```tsx
<html lang="en" className="dark">
```

**Step 2: Update dashboard layout**

In `apps/dashboard/src/app/layout.tsx`, find the `<html>` tag and add `className="dark"`:

```tsx
<html lang="en" className="dark">
```

**Step 3: Commit**

```bash
git add apps/landing/src/app/layout.tsx apps/dashboard/src/app/layout.tsx
git commit -m "feat: set dark class on html root for both apps"
```

---

## Task 3: Landing header dark styles

**Files:**
- Modify: `apps/landing/src/components/layout/header.tsx`

**Step 1: Replace the `<header>` className**

Change:
```tsx
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
```

To:
```tsx
<header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
```

**Step 2: Update the logo**

Change:
```tsx
<span className="text-xl font-bold">Kinkang</span>
```

To:
```tsx
<span className="text-xl font-bold tracking-tight">
  <span className="text-indigo-400">⬡</span> Kinkang
</span>
```

**Step 3: Update "Sign in" button**

Change:
```tsx
<Button variant="outline" size="sm" asChild>
  <Link href="https://dashboard.kinkang.cloud/sign-in">Sign in</Link>
</Button>
```

To:
```tsx
<Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-800" asChild>
  <Link href="https://dashboard.kinkang.cloud/sign-in">Sign in</Link>
</Button>
```

**Step 4: Update "Get Started" button**

Change:
```tsx
<Button size="sm" asChild>
  <Link href="/contact">Get Started</Link>
</Button>
```

To:
```tsx
<Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white" asChild>
  <Link href="/contact">Get Started</Link>
</Button>
```

**Step 5: Run type check and commit**

```bash
pnpm --filter @workspace/landing check-types
git add apps/landing/src/components/layout/header.tsx
git commit -m "feat: dark header with indigo accent"
```

---

## Task 4: Landing footer dark styles

**Files:**
- Modify: `apps/landing/src/components/layout/footer.tsx`

**Step 1: Replace the `<footer>` className**

Change:
```tsx
<footer className="border-t bg-background">
```

To:
```tsx
<footer className="border-t border-zinc-800 bg-zinc-950">
```

**Step 2: Update section headings**

Change:
```tsx
<h3 className="text-sm font-semibold">{group.title}</h3>
```

To:
```tsx
<h3 className="text-sm font-semibold text-zinc-100">{group.title}</h3>
```

**Step 3: Update link styles**

Change:
```tsx
className="text-sm text-muted-foreground hover:text-foreground transition-colors"
```

To (use replace_all since this pattern appears twice):
```tsx
className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
```

**Step 4: Update secondary links and copyright**

Change:
```tsx
<p className="text-sm text-muted-foreground">
  Kinkang &middot; All rights reserved.
</p>
```

To:
```tsx
<p className="text-sm text-zinc-600">
  Kinkang &middot; All rights reserved.
</p>
```

For the secondary links map, change:
```tsx
className="text-sm text-muted-foreground hover:text-foreground transition-colors"
```

To:
```tsx
className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
```

**Step 5: Update social icon links**

Change:
```tsx
className="text-muted-foreground hover:text-foreground transition-colors"
```

To:
```tsx
className="text-zinc-500 hover:text-zinc-300 transition-colors"
```

**Step 6: Commit**

```bash
git add apps/landing/src/components/layout/footer.tsx
git commit -m "feat: dark footer"
```

---

## Task 5: Landing home page — full redesign

**Files:**
- Modify: `apps/landing/src/app/page.tsx`

Replace the entire file with:

```tsx
import type { Metadata } from 'next'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'
import { ArrowRight, Shield, Zap, BarChart3, Server, Settings, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kinkang — Your Kafka cluster. Properly Managed.',
}

const features = [
  {
    icon: Zap,
    title: 'Automated Rebalancing',
    description: 'Automatically rebalance partitions across brokers for optimal performance and resource utilization.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SSL, SASL, VPC peering, and Private Links. Your data stays secure at every layer.',
  },
  {
    icon: BarChart3,
    title: 'Real-time Metrics',
    description: 'Monitor cluster health, throughput, and latency with comprehensive dashboards.',
  },
  {
    icon: Server,
    title: 'Multi-Cloud Support',
    description: 'Works with self-managed Kafka, AWS MSK, and Google Cloud. Deploy anywhere.',
  },
  {
    icon: Settings,
    title: 'REST API',
    description: 'Full programmatic access to manage your clusters via a clean REST API.',
  },
  {
    icon: Lock,
    title: 'High Availability',
    description: 'Built-in redundancy and failover mechanisms to keep your clusters running.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
        {/* Dot-grid background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #3f3f46 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Indigo radial glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[600px] w-[900px] rounded-full bg-indigo-600/20 blur-3xl" />
        </div>
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[300px] w-[500px] rounded-full bg-violet-600/15 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-1.5 text-xs text-zinc-400">
            Kafka management, simplified
            <span className="ml-2 text-indigo-400">→</span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Your Kafka cluster.{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Properly Managed.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Kinkang takes the complexity out of managing Apache Kafka clusters with Cruise Control.
            Focus on building your product while we handle the infrastructure.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
              asChild
            >
              <Link href="/contact">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white hover:bg-zinc-800"
              asChild
            >
              <Link href="/solutions/cruise-control">See how it works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-zinc-800 py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <p className="text-center text-sm text-zinc-600">
            Trusted by engineers at{' '}
            <span className="mx-3 font-medium text-zinc-600">Acme Corp</span>
            <span className="mx-3 font-medium text-zinc-600">Initech</span>
            <span className="mx-3 font-medium text-zinc-600">Globex</span>
            <span className="mx-3 font-medium text-zinc-600">Umbrella Co</span>
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-indigo-400">
              Why Kinkang
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
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

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 px-8 py-16 text-center">
            {/* Subtle glow behind CTA */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-64 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold">Ready to get started?</h2>
              <p className="mt-4 text-lg text-zinc-400">
                Get in touch with our team to learn how Kinkang can help manage your Kafka infrastructure.
              </p>
              <div className="mt-8">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
```

**Step 2: Run type check and commit**

```bash
pnpm --filter @workspace/landing check-types
git add apps/landing/src/app/page.tsx
git commit -m "feat: redesign home page with glow hero, trust strip, dark feature cards"
```

---

## Task 6: Landing pricing page dark redesign

**Files:**
- Modify: `apps/landing/src/app/pricing/page.tsx`

**Step 1: Update each `<Card>` className**

The highlighted Pro card needs `border-indigo-500 bg-indigo-500/5 shadow-indigo-500/10 shadow-lg`. Non-highlighted cards get explicit dark class.

Replace the Card rendering block:

```tsx
<Card
  key={plan.name}
  className={cn(
    'border-zinc-800 bg-zinc-900',
    plan.highlighted && 'border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/10'
  )}
>
```

Add the `cn` import at the top:

```tsx
import { cn } from '@workspace/ui/lib/utils'
```

**Step 2: Update the "Most Popular" badge**

Change:
```tsx
<Badge className="px-4">Most Popular</Badge>
```

To:
```tsx
<Badge className="px-4 bg-indigo-600 text-white border-0">Most Popular</Badge>
```

**Step 3: Update Check icons colour**

Change:
```tsx
<Check className="h-4 w-4 shrink-0 text-primary" />
```

To:
```tsx
<Check className="h-4 w-4 shrink-0 text-indigo-400" />
```

**Step 4: Update FAQ note link colours**

Change:
```tsx
className="underline underline-offset-4"
```

To (replace_all):
```tsx
className="text-indigo-400 underline underline-offset-4 hover:text-indigo-300"
```

**Step 5: Commit**

```bash
git add apps/landing/src/app/pricing/page.tsx
git commit -m "feat: dark pricing page with indigo highlighted Pro tier"
```

---

## Task 7: Landing FAQs page dark styles

**Files:**
- Modify: `apps/landing/src/app/faqs/page.tsx`

**Step 1: Read the full file first**

```bash
cat apps/landing/src/app/faqs/page.tsx
```

**Step 2: Update the bottom CTA card**

Find any `<Card>` in the contact CTA section and add:
```tsx
className="border-zinc-800 bg-zinc-900"
```

**Step 3: Update heading label**

Above the main `<h1>`, add a label line:
```tsx
<p className="text-sm font-medium uppercase tracking-wider text-indigo-400 mb-2">Support</p>
```

**Step 4: Commit**

```bash
git add apps/landing/src/app/faqs/page.tsx
git commit -m "feat: dark FAQs page"
```

---

## Task 8: Landing about page — Avatar components + dark styles

**Files:**
- Modify: `apps/landing/src/app/about/page.tsx`

**Step 1: Add Avatar import**

```tsx
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar'
```

**Step 2: Replace team card content with Avatar**

Find the team member card rendering. Replace any `<div>` placeholder avatar with:

```tsx
<Avatar className="h-16 w-16 border-2 border-zinc-700">
  <AvatarFallback className="bg-indigo-500/10 text-indigo-400 text-lg font-semibold">
    {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
  </AvatarFallback>
</Avatar>
```

**Step 3: Update team cards to dark style**

For each team member card:
```tsx
<div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center">
```

**Step 4: Update values cards to match features**

```tsx
<div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
    <value.icon className="h-5 w-5 text-indigo-400" />
  </div>
  ...
</div>
```

**Step 5: Update location badges**

```tsx
<div className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
  <span>{location.flag}</span>
  <span>{location.city}</span>
</div>
```

**Step 6: Commit**

```bash
git add apps/landing/src/app/about/page.tsx
git commit -m "feat: dark about page with Avatar components for team"
```

---

## Task 9: Landing blog pages dark styles

**Files:**
- Modify: `apps/landing/src/app/blog/page.tsx`
- Modify: `apps/landing/src/app/blog/[slug]/page.tsx`

**Step 1: Update blog listing cards**

In `blog/page.tsx`, find the `<Link>` wrapping each card and update `<Card>`:

```tsx
<Card className="h-full border-zinc-800 bg-zinc-900 transition-colors group-hover:border-zinc-600">
```

Update the category Badge:
```tsx
<Badge variant="outline" className="w-fit border-indigo-500/50 text-indigo-400">
  {post.category}
</Badge>
```

**Step 2: Update blog post page**

In `blog/[slug]/page.tsx`, update the back link:
```tsx
className="... text-zinc-400 hover:text-zinc-100"
```

Update the header metadata text (author, date) to `text-zinc-400`.

**Step 3: Commit**

```bash
git add apps/landing/src/app/blog/page.tsx apps/landing/src/app/blog/\[slug\]/page.tsx
git commit -m "feat: dark blog listing and post pages"
```

---

## Task 10: Landing contact page dark styles

**Files:**
- Modify: `apps/landing/src/app/contact/page.tsx`
- Modify: `apps/landing/src/app/contact/contact-form.tsx`

**Step 1: Update contact option cards**

In `contact/page.tsx`, update each contact card:
```tsx
<Card className="border-zinc-800 bg-zinc-900">
  <CardContent className="flex items-start gap-4 pt-6">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
      <option.icon className="h-5 w-5 text-indigo-400" />
    </div>
```

**Step 2: Update contact-form.tsx success state**

Change success card:
```tsx
<div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
  <CheckCircle className="h-12 w-12 text-emerald-400" />
```

**Step 3: Update form inputs to dark style**

```tsx
<Input
  id="name"
  name="name"
  placeholder="Your name"
  required
  className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-indigo-500"
/>
```

Apply the same pattern to the email `Input` and the `Textarea`.

**Step 4: Update submit button**

```tsx
<Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white" disabled={status === 'loading'}>
```

**Step 5: Run final landing type check and commit**

```bash
pnpm --filter @workspace/landing check-types
git add apps/landing/src/app/contact/page.tsx apps/landing/src/app/contact/contact-form.tsx
git commit -m "feat: dark contact page and form"
```

---

## Task 11: Dashboard — install Clerk themes package

**Files:**
- Modify: `apps/dashboard/package.json` (via pnpm)

Clerk's `@clerk/themes` package provides a `dark` base theme for `<ClerkProvider>`.

**Step 1: Install**

```bash
pnpm --filter @workspace/dashboard add @clerk/themes
```

**Step 2: Update dashboard root layout**

In `apps/dashboard/src/app/layout.tsx`, add the Clerk appearance prop:

```tsx
import { dark } from '@clerk/themes'

// Inside ClerkProvider:
<ClerkProvider
  appearance={{
    baseTheme: dark,
    variables: {
      colorPrimary: '#818cf8',
      colorBackground: '#18181b',
      colorInputBackground: '#27272a',
      colorInputText: '#fafafa',
    },
  }}
>
```

**Step 3: Commit**

```bash
git add apps/dashboard/package.json apps/dashboard/src/app/layout.tsx pnpm-lock.yaml
git commit -m "feat: Clerk dark theme with indigo primary"
```

---

## Task 12: Dashboard sidebar dark redesign

**Files:**
- Modify: `apps/dashboard/src/components/layout/sidebar.tsx`

Replace the entire file with:

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@workspace/ui/lib/utils'
import { sidebarLinks } from './sidebar-links'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900 md:flex">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-zinc-800 px-5">
        <Link href="/clusters" className="flex items-center gap-2">
          <span className="text-indigo-400 text-lg">⬡</span>
          <span className="text-base font-bold tracking-tight text-zinc-100">Kinkang</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-3">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'border-l-2 border-indigo-500 bg-indigo-500/10 text-indigo-400 rounded-l-none'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
              )}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
```

**Step 2: Commit**

```bash
git add apps/dashboard/src/components/layout/sidebar.tsx
git commit -m "feat: dark sidebar with indigo active state"
```

---

## Task 13: Dashboard top-bar dark redesign

**Files:**
- Modify: `apps/dashboard/src/components/layout/top-bar.tsx`

Replace the entire file with:

```tsx
import { UserButton } from '@clerk/nextjs'
import { Button } from '@workspace/ui/components/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@workspace/ui/components/sheet'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@workspace/ui/lib/utils'
import { sidebarLinks } from './sidebar-links'

export function TopBar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6">
      {/* Mobile sidebar trigger */}
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 border-zinc-800 bg-zinc-900 p-0">
            <SheetHeader className="border-b border-zinc-800 px-5 py-4">
              <SheetTitle className="flex items-center gap-2 text-zinc-100">
                <span className="text-indigo-400">⬡</span> Kinkang
              </SheetTitle>
            </SheetHeader>
            <nav className="space-y-0.5 p-3">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                >
                  <link.icon className="h-4 w-4 shrink-0" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Right side: Clerk user button */}
      <UserButton afterSignOutUrl="/sign-in" />
    </header>
  )
}
```

**Step 2: Commit**

```bash
git add apps/dashboard/src/components/layout/top-bar.tsx
git commit -m "feat: dark top-bar"
```

---

## Task 14: Dashboard clusters page dark empty state

**Files:**
- Modify: `apps/dashboard/src/app/(dashboard)/clusters/page.tsx`

Replace the empty state `<Card>` with a styled dashed card:

```tsx
import type { Metadata } from 'next'
import { Button } from '@workspace/ui/components/button'
import { Plus, Server } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Clusters',
}

export default function ClustersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Clusters</h1>
          <p className="text-sm text-zinc-400">Manage your Kafka clusters</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Create Cluster
        </Button>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-800">
          <Server className="h-7 w-7 text-zinc-500" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-zinc-100">No clusters yet</h2>
        <p className="mt-2 max-w-sm text-sm text-zinc-400">
          Create your first Kafka cluster to get started with automated management and monitoring.
        </p>
        <Button className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Create your first cluster
        </Button>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add "apps/dashboard/src/app/(dashboard)/clusters/page.tsx"
git commit -m "feat: dark clusters page with styled empty state"
```

---

## Task 15: Dashboard cluster detail — metric cards + Table for brokers

**Files:**
- Modify: `apps/dashboard/src/app/(dashboard)/clusters/[clusterId]/page.tsx`
- Modify: `apps/dashboard/src/app/(dashboard)/clusters/[clusterId]/brokers/page.tsx`

**Step 1: Rewrite cluster detail page**

Replace `apps/dashboard/src/app/(dashboard)/clusters/[clusterId]/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { Badge } from '@workspace/ui/components/badge'
import { Server, Layers, GitBranch } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cluster Overview',
}

const metrics = [
  { icon: Server, label: 'Brokers', value: '—' },
  { icon: Layers, label: 'Topics', value: '—' },
  { icon: GitBranch, label: 'Partitions', value: '—' },
]

export default async function ClusterPage({
  params,
}: {
  params: Promise<{ clusterId: string }>
}) {
  const { clusterId } = await params

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-zinc-100">Cluster {clusterId}</h1>
        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10">
          Running
        </Badge>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10">
                <metric.icon className="h-4 w-4 text-indigo-400" />
              </div>
              <span className="text-sm text-zinc-400">{metric.label}</span>
            </div>
            <p className="mt-3 text-3xl font-bold text-zinc-100">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Overview card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-base font-semibold text-zinc-100">Overview</h2>
        <p className="mt-1 text-sm text-zinc-400">Cluster details and metrics will appear here once connected.</p>
      </div>
    </div>
  )
}
```

**Step 2: Rewrite brokers page with Table component**

Replace `apps/dashboard/src/app/(dashboard)/clusters/[clusterId]/brokers/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { Badge } from '@workspace/ui/components/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'

export const metadata: Metadata = {
  title: 'Brokers',
}

// Placeholder data — replace with real API call
const mockBrokers = [
  { id: 1, host: 'broker-1.kafka.internal', port: 9092, status: 'healthy', partitions: 24 },
  { id: 2, host: 'broker-2.kafka.internal', port: 9092, status: 'healthy', partitions: 23 },
  { id: 3, host: 'broker-3.kafka.internal', port: 9092, status: 'healthy', partitions: 24 },
]

export default function BrokersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100">Brokers</h1>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="border-b border-zinc-800 px-6 py-4">
          <h2 className="text-base font-semibold text-zinc-100">Broker Management</h2>
          <p className="mt-0.5 text-sm text-zinc-400">View and manage brokers in this cluster.</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">ID</TableHead>
              <TableHead className="text-zinc-400">Host</TableHead>
              <TableHead className="text-zinc-400">Port</TableHead>
              <TableHead className="text-zinc-400">Partitions</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockBrokers.map((broker) => (
              <TableRow key={broker.id} className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell className="font-mono text-zinc-300">{broker.id}</TableCell>
                <TableCell className="font-mono text-zinc-300">{broker.host}</TableCell>
                <TableCell className="font-mono text-zinc-400">{broker.port}</TableCell>
                <TableCell className="text-zinc-300">{broker.partitions}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      broker.status === 'healthy'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/10'
                    }
                  >
                    {broker.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add "apps/dashboard/src/app/(dashboard)/clusters/[clusterId]/page.tsx"
git add "apps/dashboard/src/app/(dashboard)/clusters/[clusterId]/brokers/page.tsx"
git commit -m "feat: dark cluster detail with metric cards and brokers Table"
```

---

## Task 16: Dashboard settings and billing pages dark styles

**Files:**
- Modify: `apps/dashboard/src/app/(dashboard)/settings/page.tsx`
- Modify: `apps/dashboard/src/app/(dashboard)/billing/page.tsx`

**Step 1: Read both files**

```bash
cat apps/dashboard/src/app/\(dashboard\)/settings/page.tsx
cat apps/dashboard/src/app/\(dashboard\)/billing/page.tsx
```

**Step 2: Update headings and cards**

For any `<h1>`, add `text-zinc-100`. For any `<Card>`, add `border-zinc-800 bg-zinc-900`. For any description text, use `text-zinc-400`.

**Step 3: Commit**

```bash
git add "apps/dashboard/src/app/(dashboard)/settings/page.tsx"
git add "apps/dashboard/src/app/(dashboard)/billing/page.tsx"
git commit -m "feat: dark settings and billing pages"
```

---

## Task 17: Final verification build

**Step 1: Run type checks on both apps**

```bash
pnpm --filter @workspace/landing check-types
pnpm --filter @workspace/dashboard check-types
```

Expected: both exit 0

**Step 2: Full production build**

```bash
pnpm build
```

Expected output:
```
✓ Generating static pages (16/16)    ← landing
ƒ (Dynamic) server-rendered on demand  ← dashboard
Tasks:    2 successful, 2 total
```

**Step 3: Final commit if any last-minute fixes were needed**

```bash
git add -A
git commit -m "fix: final build clean-up after dark redesign"
```
