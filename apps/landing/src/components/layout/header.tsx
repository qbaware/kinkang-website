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
          <Link href="/" className="flex items-center gap-1.5" onClick={() => setOpenMenu(null)}>
            <img src="/logo.svg" alt="Kinkang logo" className="h-6 w-6 dark:invert" />
            <span className="text-xl font-bold tracking-tight leading-none">Kinkang</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
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
          <div className="hidden lg:flex items-center space-x-2">
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
          <div className="flex items-center gap-2 lg:hidden">
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
