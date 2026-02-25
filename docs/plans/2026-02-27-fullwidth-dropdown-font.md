# Full-Width Dropdown + Font Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** (1) Fix Inter font not loading (CSS variable never set → system font fallback). (2) Replace the narrow Radix NavigationMenu popup with a neon.com-style full-width mega dropdown.

**Architecture:**
- **Font fix**: Drop `@fontsource-variable/inter`, use `next/font/google` which generates and applies `--font-inter` CSS variable automatically.
- **Dropdown**: Remove Radix `NavigationMenu` from the desktop header; replace with plain `useState`-driven buttons + an `absolute inset-x-0 top-full` panel inside the sticky `<header>`. Close on mouse-leave, Escape, or overlay click.

**Tech Stack:** Next.js 15 `next/font/google`, Tailwind CSS, TypeScript, shadcn/ui Sheet (mobile unchanged).

---

## Task 1: Fix font loading — switch to next/font/google

**Files:**
- Modify: `apps/landing/src/app/layout.tsx`

### Step 1: Replace fontsource import with next/font

Current `layout.tsx` line 2:
```tsx
import '@fontsource-variable/inter'
```

Remove that line entirely. Add the `next/font/google` setup at the top of the file:

```tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
```

### Step 2: Apply the font variable to the html element

The `<html>` element currently has `className="dark"`. Change it to apply the Inter CSS variable:

```tsx
<html lang="en" className={`dark ${inter.variable}`}>
```

The full updated layout:
```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { siteConfig } from '@/lib/metadata'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

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
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
```

### Step 3: Verify TypeScript compiles

```bash
cd /Users/danielgospodinow/Projects/kinkang-website
pnpm --filter landing exec tsc --noEmit
```
Expected: no errors.

### Step 4: Commit

```bash
git add apps/landing/src/app/layout.tsx
git commit -m "fix(landing): switch to next/font/google to properly set --font-inter CSS variable"
```

---

## Task 2: Rebuild desktop nav with full-width mega dropdown

**Files:**
- Modify: `apps/landing/src/components/layout/header.tsx`

### Context

Currently the desktop nav uses Radix `NavigationMenu` + `NavigationMenuViewport`, which anchors the dropdown to the nav element (not header-wide). We replace the desktop section entirely with a custom implementation. The mobile Sheet drawer is **not changed**.

Neon.com dropdown characteristics (from live inspection):
- `position: absolute; left: 0; top: 100%; width: 100%` on the header
- Background: pure black (`#000000`)
- Bottom border: subtle zinc-800
- Per-trigger content (hovering/clicking a group shows that group's links)
- Category label: `10px font-medium uppercase tracking-[0.1em] text-zinc-500`
- Link title: `17px font-medium text-white` with hover dimming
- Link description: `14px text-zinc-500`
- Featured CTA card at right (dark bg, text, link)
- Close on: mouse-leave from header area, Escape key, click on overlay
- Animation: slide-in-from-top + fade-in, 150ms

### Step 1: Write the new header.tsx

Replace the entire file with the following:

```tsx
'use client'

import { useState, useEffect } from 'react'
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

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  // Close on Escape key
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

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md"
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" onClick={() => setOpenMenu(null)}>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-indigo-400">⬡</span> Kinkang
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {headerLinks.map((item) =>
              isNavGroup(item) ? (
                <button
                  key={item.text}
                  className={cn(
                    'flex items-center gap-1 rounded-md px-3 py-2 text-[15px] tracking-[-0.01em] text-zinc-400 transition-colors hover:text-zinc-100',
                    openMenu === item.text && 'text-zinc-100'
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
                  className="rounded-md px-3 py-2 text-[15px] tracking-[-0.01em] text-zinc-400 transition-colors hover:text-zinc-100"
                  onClick={() => setOpenMenu(null)}
                >
                  {item.text}
                </Link>
              )
            )}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-300 hover:text-white hover:bg-zinc-800"
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
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
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

        {/* Full-width mega dropdown */}
        {activeGroup && (
          <div
            className="absolute inset-x-0 top-full z-50 border-b border-zinc-800 bg-black animate-in slide-in-from-top-1 fade-in-0 duration-150"
            onMouseEnter={() => setOpenMenu(openMenu)}
          >
            <div className="container mx-auto max-w-6xl px-4 py-10 flex gap-24">
              {/* Links column */}
              <div>
                <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
                  {activeGroup.text}
                </p>
                <ul className="space-y-1">
                  {activeGroup.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex flex-col py-2"
                        onClick={() => setOpenMenu(null)}
                      >
                        <span className="text-[17px] font-medium leading-none text-white transition-colors group-hover:text-zinc-400">
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

              {/* Featured CTA card */}
              <div className="ml-auto flex items-center">
                <div className="w-64 rounded-xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col justify-between h-40">
                  <div>
                    <p className="text-sm font-medium text-zinc-100">Manage Kafka at scale</p>
                    <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
                      Connect your first cluster in under 10 minutes.
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    onClick={() => setOpenMenu(null)}
                  >
                    Get Started →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Page dimming overlay */}
      <div
        className="fixed inset-x-0 top-16 bottom-0 z-40 bg-zinc-950/80 transition-opacity duration-200"
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

### Step 2: Verify TypeScript compiles

```bash
cd /Users/danielgospodinow/Projects/kinkang-website
pnpm --filter landing exec tsc --noEmit
```
Expected: no errors. The imports `NavigationMenu`, `NavigationMenuContent`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuLink`, `NavigationMenuTrigger`, `navigationMenuTriggerStyle` are no longer used — confirm no unused-import TypeScript errors (they won't cause errors unless tsconfig has `noUnusedLocals: true`, but check).

### Step 3: Commit

```bash
git add apps/landing/src/components/layout/header.tsx
git commit -m "feat(landing): rebuild desktop nav with full-width neon-style mega dropdown"
```

---

## Task 3: Final build verification

### Step 1: Full build

```bash
cd /Users/danielgospodinow/Projects/kinkang-website
pnpm build
```
Expected: 16 static landing pages, 0 errors.

### Step 2: Commit if any fixups needed, then done.
