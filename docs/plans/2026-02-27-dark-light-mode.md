# Dark / Light Mode Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a fully-polished dark/light mode toggle to the Kinkang landing app using `next-themes` and Tailwind `dark:` variants.

**Architecture:** `next-themes` manages the `dark` class on `<html>` and persists the user's preference to localStorage. All hardcoded zinc/indigo colours gain a light-mode default and a `dark:` override. Light styles are the default (no prefix); dark styles use `dark:`.

**Tech Stack:** Next.js 15, Tailwind CSS 3, next-themes, lucide-react

---

### Task 1: Install next-themes

**Files:**
- Modify: `apps/landing/package.json`

**Step 1: Install**

```bash
cd /Users/danielgospodinow/Projects/kinkang-website && pnpm --filter landing add next-themes
```

Expected: `next-themes` appears in `apps/landing/package.json` dependencies.

**Step 2: Commit**

```bash
git add apps/landing/package.json pnpm-lock.yaml
git commit -m "chore: install next-themes"
```

---

### Task 2: Create ThemeProvider wrapper

`layout.tsx` is a Server Component, so `next-themes`' provider must live in a `'use client'` wrapper.

**Files:**
- Create: `apps/landing/src/components/layout/theme-provider.tsx`

**Step 1: Create the file**

```tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

**Step 2: Commit**

```bash
git add apps/landing/src/components/layout/theme-provider.tsx
git commit -m "feat: add ThemeProvider wrapper"
```

---

### Task 3: Create ThemeToggle button

**Files:**
- Create: `apps/landing/src/components/layout/theme-toggle.tsx`

**Step 1: Create the file**

```tsx
'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch — only render after mount
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-9 w-9" />

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
```

**Step 2: Commit**

```bash
git add apps/landing/src/components/layout/theme-toggle.tsx
git commit -m "feat: add ThemeToggle button"
```

---

### Task 4: Update layout.tsx

Remove the hardcoded `dark` class from `<html>` and wrap with ThemeProvider.

**Files:**
- Modify: `apps/landing/src/app/layout.tsx`

**Step 1: Apply changes**

Replace the entire file with:

```tsx
import type { Metadata } from 'next'
import '@fontsource-variable/inter'
import '@/styles/globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { siteConfig } from '@/lib/metadata'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    siteName: siteConfig.name,
    type: 'website',
    url: siteConfig.url,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

Note: `suppressHydrationWarning` on `<html>` is required by next-themes to silence the class mismatch warning during SSR.

**Step 2: Commit**

```bash
git add apps/landing/src/app/layout.tsx
git commit -m "feat: wire up ThemeProvider in layout"
```

---

### Task 5: Update globals.css — dot-grid CSS class

The hero's dot-grid uses an inline `style` with a hardcoded hex colour that can't use `dark:`. Move it to a CSS class.

**Files:**
- Modify: `apps/landing/src/styles/globals.css`

**Step 1: Append the class**

```css
@import '@workspace/ui/styles/globals.css';

/* Map Tailwind's font-sans var to the fontsource-loaded Inter Variable font-family name */
:root {
  --font-inter: 'Inter Variable';
}

.hero-dot-grid {
  background-image: radial-gradient(circle, #d4d4d8 1px, transparent 1px); /* zinc-300 */
  background-size: 24px 24px;
}

.dark .hero-dot-grid {
  background-image: radial-gradient(circle, #3f3f46 1px, transparent 1px); /* zinc-700 */
}
```

**Step 2: Commit**

```bash
git add apps/landing/src/styles/globals.css
git commit -m "feat: add theme-aware hero-dot-grid CSS class"
```

---

### Task 6: Update header.tsx

**Files:**
- Modify: `apps/landing/src/components/layout/header.tsx`

**Step 1: Apply all changes**

Replace the entire file with:

```tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, ChevronDown } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@workspace/ui/components/sheet'
import { cn } from '@workspace/ui/lib/utils'
import { headerLinks, isNavGroup, type NavGroup } from './nav-links'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const activeGroup = openMenu
    ? (headerLinks.find((item) => isNavGroup(item) && item.text === openMenu) as NavGroup | undefined)
    : undefined

  const lastGroupRef = useRef<NavGroup | undefined>(undefined)
  if (activeGroup) lastGroupRef.current = activeGroup
  const displayGroup = activeGroup ?? lastGroupRef.current

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md"
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" onClick={() => setOpenMenu(null)}>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-indigo-600 dark:text-indigo-400">⬡</span> Kinkang
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {headerLinks.map((item) =>
              isNavGroup(item) ? (
                <button
                  key={item.text}
                  className={cn(
                    'flex items-center gap-1 rounded-md px-3 py-2 text-[15px] tracking-[-0.01em] text-zinc-600 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100',
                    openMenu === item.text && 'text-zinc-900 dark:text-zinc-100'
                  )}
                  onMouseEnter={() => setOpenMenu(item.text)}
                  onClick={() => setOpenMenu(openMenu === item.text ? null : item.text)}
                  aria-expanded={openMenu === item.text}
                  aria-haspopup="true"
                >
                  {item.text}
                  <ChevronDown
                    className={cn(
                      'h-3 w-3 transition-transform duration-200',
                      openMenu === item.text && 'rotate-180'
                    )}
                    aria-hidden="true"
                  />
                </button>
              ) : (
                <Link
                  key={item.text}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-[15px] tracking-[-0.01em] text-zinc-600 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                  onMouseEnter={() => setOpenMenu(null)}
                  onClick={() => setOpenMenu(null)}
                >
                  {item.text}
                </Link>
              )
            )}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
              asChild
            >
              <Link href="https://dashboard.kinkang.cloud/sign-in">Sign in</Link>
            </Button>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
              asChild
            >
              <Link href="/contact">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Kinkang</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-6">
                  {headerLinks.map((item) =>
                    isNavGroup(item) ? (
                      <div key={item.text} className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{item.text}</p>
                        {item.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block pl-4 text-sm hover:text-primary"
                          >
                            {link.text}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        key={item.text}
                        href={item.href}
                        className="text-sm font-medium hover:text-primary"
                      >
                        {item.text}
                      </Link>
                    )
                  )}
                  <div className="pt-4 space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="https://dashboard.kinkang.cloud/sign-in">Sign in</Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href="/contact">Get Started</Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Full-width mega dropdown */}
        <div
          className={cn(
            'absolute inset-x-0 top-full z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black transition-[opacity,visibility] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
            openMenu ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
          )}
          onMouseEnter={() => openMenu && setOpenMenu(openMenu)}
        >
          {displayGroup && (
            <div className="container mx-auto max-w-6xl px-4 py-10">
              <div>
                <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                  {displayGroup.text}
                </p>
                <ul className="space-y-1">
                  {displayGroup.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex flex-col py-2"
                        onClick={() => setOpenMenu(null)}
                      >
                        <span className="text-[17px] font-medium leading-none text-zinc-900 dark:text-white transition-colors group-hover:text-zinc-500 dark:group-hover:text-zinc-400">
                          {link.text}
                        </span>
                        {link.description && (
                          <span className="mt-1.5 text-sm text-zinc-500">
                            {link.description}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Page dimming overlay */}
      <div
        className="fixed inset-x-0 top-16 bottom-0 z-40 bg-zinc-500/20 dark:bg-zinc-950/80 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          opacity: openMenu ? 1 : 0,
          pointerEvents: openMenu ? 'auto' : 'none',
        }}
        aria-hidden="true"
        onClick={() => setOpenMenu(null)}
      />
    </>
  )
}
```

**Step 2: Commit**

```bash
git add apps/landing/src/components/layout/header.tsx
git commit -m "feat: add theme toggle and dark: variants to header"
```

---

### Task 7: Update footer.tsx

**Files:**
- Modify: `apps/landing/src/components/layout/footer.tsx`

**Step 1: Apply changes**

Replace the entire file with:

```tsx
import Link from 'next/link'
import { Github } from 'lucide-react'
import { Separator } from '@workspace/ui/components/separator'
import { footerLinkGroups, footerSecondaryLinks, socialLinks } from './nav-links'

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{group.title}</h3>
              <ul className="mt-4 space-y-2">
                {group.links.map((link) => (
                  <li key={link.text}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center space-x-4">
            {footerSecondaryLinks.map((link) => (
              <Link
                key={link.text}
                href={link.href}
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                {link.text}
              </Link>
            ))}
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-600">
            Kinkang &middot; All rights reserved.
          </p>

          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">{social.label}</span>
                {social.label === 'GitHub' ? (
                  <Github className="h-5 w-5" />
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
```

**Step 2: Commit**

```bash
git add apps/landing/src/components/layout/footer.tsx
git commit -m "feat: dark: variants for footer"
```

---

### Task 8: Update scrollspy-nav.tsx

**Files:**
- Modify: `apps/landing/src/components/features/scrollspy-nav.tsx`

**Step 1: Apply colour changes**

Change the two className strings inside the `cn(...)` call:

From:
```
isActive
  ? 'text-zinc-100 before:bg-indigo-400'
  : 'text-zinc-500 hover:text-zinc-300'
```

To:
```
isActive
  ? 'text-zinc-900 dark:text-zinc-100 before:bg-indigo-600 dark:before:bg-indigo-400'
  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
```

**Step 2: Commit**

```bash
git add apps/landing/src/components/features/scrollspy-nav.tsx
git commit -m "feat: dark: variants for scrollspy nav"
```

---

### Task 9: Update page.tsx (homepage)

**Files:**
- Modify: `apps/landing/src/app/page.tsx`

**Step 1: Replace the entire file**

```tsx
import type { Metadata } from 'next'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight, Shield, Zap, BarChart3, Server, Activity, AlertTriangle } from 'lucide-react'
import { ScrollspyNav } from '@/components/features/scrollspy-nav'

export const metadata: Metadata = {
  title: 'Kinkang — Your Kafka cluster. Properly Managed.',
}

type FeatureItem = {
  icon: LucideIcon
  title: string
  description: string
}

type FeatureSection = {
  id: string
  label: string
  heading: string
  description: string
  features: [FeatureItem, FeatureItem]
}

const featureSections: FeatureSection[] = [
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

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
        {/* Dot-grid background */}
        <div className="hero-dot-grid pointer-events-none absolute inset-0" />
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
          <div className="mb-6 inline-flex items-center rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 px-4 py-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            Kafka management, simplified
            <span className="ml-2 text-indigo-600 dark:text-indigo-400">→</span>
          </div>

          <h1 className="text-5xl font-normal tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Your Kafka cluster.{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Properly Managed.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xl text-zinc-600 dark:text-zinc-400">
            Kinkang takes the complexity out of managing Apache Kafka clusters with Cruise Control.
            Focus on building your product while we handle the infrastructure.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full"
              asChild
            >
              <Link href="/contact">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full"
              asChild
            >
              <Link href="/solutions/cruise-control">See how it works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-zinc-200 dark:border-zinc-800 py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <p className="text-center text-sm text-zinc-500">
            Trusted by engineers at{' '}
            <span className="mx-3 font-medium text-zinc-500">Acme Corp</span>
            <span className="mx-3 font-medium text-zinc-500">Initech</span>
            <span className="mx-3 font-medium text-zinc-500">Globex</span>
            <span className="mx-3 font-medium text-zinc-500">Umbrella Co</span>
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Section header */}
          <div className="mb-16 text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Why Kinkang
            </p>
            <h2 className="mt-2 text-3xl font-normal tracking-[-0.03em] sm:text-4xl">
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
                  <p className="mb-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">{section.label}</p>
                  <h3 className="text-2xl font-normal tracking-[-0.03em] text-zinc-900 dark:text-zinc-100">
                    {section.heading}
                  </h3>
                  <p className="mt-3 max-w-xl text-zinc-600 dark:text-zinc-400">{section.description}</p>

                  <div className="mt-8 grid sm:grid-cols-2">
                    {section.features.map((feature, i) => (
                      <div
                        key={feature.title}
                        className={`p-8 ${i === 0 ? 'border-l border-r border-zinc-200 dark:border-zinc-800' : ''}`}
                      >
                        <feature.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <h4 className="mt-4 text-base font-medium text-zinc-900 dark:text-zinc-100">{feature.title}</h4>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-8 py-16 text-center">
            {/* Subtle glow behind CTA */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-64 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-normal tracking-[-0.03em]">Ready to get started?</h2>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                Get in touch with our team to learn how Kinkang can help manage your Kafka infrastructure.
              </p>
              <div className="mt-8">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full" asChild>
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

**Step 2: Commit**

```bash
git add apps/landing/src/app/page.tsx
git commit -m "feat: dark: variants for homepage"
```

---

### Task 10: Update cruise-control/page.tsx

**Files:**
- Modify: `apps/landing/src/app/solutions/cruise-control/page.tsx`

**Step 1: Apply colour changes**

Change:
```
className={`p-8 ${i % 2 === 0 ? 'border-l border-r border-zinc-800' : ''}`}
```
To:
```
className={`p-8 ${i % 2 === 0 ? 'border-l border-r border-zinc-200 dark:border-zinc-800' : ''}`}
```

Change:
```
<f.icon className="h-5 w-5 text-indigo-400" />
<h3 className="mt-4 text-base font-medium text-zinc-100">{f.title}</h3>
<p className="mt-2 text-sm text-zinc-400">{f.description}</p>
```
To:
```
<f.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
<h3 className="mt-4 text-base font-medium text-zinc-900 dark:text-zinc-100">{f.title}</h3>
<p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{f.description}</p>
```

**Step 2: Commit**

```bash
git add apps/landing/src/app/solutions/cruise-control/page.tsx
git commit -m "feat: dark: variants for cruise-control page"
```

---

### Task 11: Update blog/page.tsx

**Files:**
- Modify: `apps/landing/src/app/blog/page.tsx`

**Step 1: Apply colour changes**

Change:
```
<Card className="h-full border-zinc-800 bg-zinc-900 transition-colors group-hover:border-zinc-600">
```
To:
```
<Card className="h-full border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 transition-colors group-hover:border-zinc-400 dark:group-hover:border-zinc-600">
```

Change:
```
<Badge variant="outline" className="w-fit border-indigo-500/50 text-indigo-400">
```
To:
```
<Badge variant="outline" className="w-fit border-indigo-500/50 text-indigo-600 dark:text-indigo-400">
```

**Step 2: Commit**

```bash
git add apps/landing/src/app/blog/page.tsx
git commit -m "feat: dark: variants for blog listing page"
```

---

### Task 12: Update blog/[slug]/page.tsx

**Files:**
- Modify: `apps/landing/src/app/blog/[slug]/page.tsx`

**Step 1: Apply changes**

Change:
```
<div className="prose prose-invert max-w-none">
```
To:
```
<div className="prose dark:prose-invert max-w-none">
```

Change both instances of `text-zinc-400` on author and date:
```
<span className="text-zinc-400">By {post.author}</span>
```
To:
```
<span className="text-zinc-600 dark:text-zinc-400">By {post.author}</span>
```

And:
```
<span className="text-zinc-400">{formatDate(post.publishDate)}</span>
```
To:
```
<span className="text-zinc-600 dark:text-zinc-400">{formatDate(post.publishDate)}</span>
```

**Step 2: Commit**

```bash
git add "apps/landing/src/app/blog/[slug]/page.tsx"
git commit -m "feat: dark: variants for blog post page"
```

---

### Task 13: Update contact/page.tsx + contact-form.tsx

**Files:**
- Modify: `apps/landing/src/app/contact/page.tsx`
- Modify: `apps/landing/src/app/contact/contact-form.tsx`

**Step 1: Update contact/page.tsx**

Change:
```
<Card key={option.title} className="border-zinc-800 bg-zinc-900">
```
To:
```
<Card key={option.title} className="border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
```

Change:
```
<option.icon className="h-5 w-5 text-indigo-400" />
```
To:
```
<option.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
```

**Step 2: Update contact-form.tsx**

Change the success state div:
```
<div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
```
To:
```
<div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-8 text-center">
```

Change all three input/textarea `className` strings from:
```
className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-indigo-500"
```
To:
```
className="border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:ring-indigo-500"
```

**Step 3: Commit**

```bash
git add apps/landing/src/app/contact/page.tsx apps/landing/src/app/contact/contact-form.tsx
git commit -m "feat: dark: variants for contact page and form"
```

---

### Task 14: Update faqs/page.tsx

**Files:**
- Modify: `apps/landing/src/app/faqs/page.tsx`

**Step 1: Apply colour changes**

Change:
```
<p className="mb-2 text-sm font-medium uppercase tracking-wider text-indigo-400">Support</p>
```
To:
```
<p className="mb-2 text-sm font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Support</p>
```

Change:
```
<div className="mt-16 rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
```
To:
```
<div className="mt-16 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-8 text-center">
```

**Step 2: Commit**

```bash
git add apps/landing/src/app/faqs/page.tsx
git commit -m "feat: dark: variants for FAQs page"
```

---

### Task 15: Update pricing/page.tsx

**Files:**
- Modify: `apps/landing/src/app/pricing/page.tsx`

**Step 1: Apply colour changes**

Change:
```
'border-zinc-800 bg-zinc-900',
```
To:
```
'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900',
```

Change:
```
<Check className="h-4 w-4 shrink-0 text-indigo-400" />
```
To:
```
<Check className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
```

Change both FAQ note links from:
```
className="text-indigo-400 underline underline-offset-4 hover:text-indigo-300"
```
To:
```
className="text-indigo-600 dark:text-indigo-400 underline underline-offset-4 hover:text-indigo-700 dark:hover:text-indigo-300"
```

**Step 2: Commit**

```bash
git add apps/landing/src/app/pricing/page.tsx
git commit -m "feat: dark: variants for pricing page"
```

---

### Task 16: Visual verification

**Step 1: Start the dev server**

```bash
cd /Users/danielgospodinow/Projects/kinkang-website && pnpm --filter landing dev
```

**Step 2: Check these pages in both light and dark mode** (toggle via the Sun/Moon button in the header):

- `/` — hero dot-grid, feature cells, CTA card
- `/solutions/cruise-control` — feature grid
- `/blog` — cards
- `/blog/<any-slug>` — prose body
- `/contact` — cards + form inputs
- `/faqs` — CTA box
- `/pricing` — plan cards
