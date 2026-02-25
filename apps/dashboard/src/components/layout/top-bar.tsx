'use client'

import { useState, useEffect } from 'react'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@workspace/ui/components/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@workspace/ui/components/sheet'
import { Menu, Server, CreditCard, Settings } from 'lucide-react'
import Link from 'next/link'
import { OrganizationSwitcher } from '@clerk/nextjs'
import { ThemeToggle } from './theme-toggle'

const NAV_LINKS = [
  { label: 'Clusters', href: '/clusters', icon: Server },
  { label: 'Billing', href: '/billing', icon: CreditCard },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export function TopBar() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      {/* Mobile sidebar trigger */}
      {mounted ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 border-sidebar-border bg-sidebar p-0">
            <SheetHeader className="border-b border-sidebar-border px-5 py-4">
              <SheetTitle className="flex items-center gap-2.5 text-sidebar-foreground">
                <img src="/logo.svg" alt="Kinkang" className="h-6 w-6 dark:invert" />
                Kinkang Dashboard
              </SheetTitle>
            </SheetHeader>
            <div className="flex h-14 items-center border-b border-sidebar-border px-4">
              <OrganizationSwitcher
                hidePersonal
                afterCreateOrganizationUrl="/clusters"
                afterSelectOrganizationUrl="/clusters"
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    organizationSwitcherTrigger:
                      'w-full justify-between rounded-md px-2 py-1.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors',
                  },
                }}
              />
            </div>
            <nav className="space-y-0.5 p-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                >
                  <link.icon className="h-4 w-4 shrink-0" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      ) : (
        // Placeholder keeps layout stable before hydration
        <div className="h-8 w-8 md:hidden" />
      )}

      {/* Right side */}
      <div className="flex items-center gap-2 ml-auto">
        <ThemeToggle />
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </header>
  )
}
