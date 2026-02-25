'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Server, Settings, CreditCard, LifeBuoy } from 'lucide-react'
import { OrganizationSwitcher } from '@clerk/nextjs'
import { cn } from '@workspace/ui/lib/utils'
import { SupportSheet } from './support-sheet'

const MAIN_LINKS = [
  { label: 'Clusters', href: '/clusters', icon: Server },
]

const BOTTOM_LINKS = [
  { label: 'Billing', href: '/billing', icon: CreditCard },
  { label: 'Settings', href: '/settings', icon: Settings },
]

function NavLink({
  href,
  icon: Icon,
  label,
  isActive,
}: {
  href: string
  icon: React.ElementType
  label: string
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'border-l-2 border-sidebar-primary bg-sidebar-accent text-sidebar-accent-foreground rounded-l-none'
          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
        <img src="/logo.svg" alt="Kinkang" className="h-6 w-6 dark:invert" />
        <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">Kinkang Dashboard</span>
      </div>

      {/* Org switcher */}
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        {mounted ? (
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
        ) : (
          <div className="h-8 w-full rounded-md bg-sidebar-accent/50 animate-pulse" />
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-0.5 p-3">
        {MAIN_LINKS.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(link.href + '/')
          return (
            <NavLink key={link.href} {...link} isActive={isActive} />
          )
        })}
      </nav>

      {/* Bottom nav */}
      <div className="border-t border-sidebar-border p-3 space-y-0.5">
        {BOTTOM_LINKS.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(link.href + '/')
          return (
            <NavLink key={link.href} {...link} isActive={isActive} />
          )
        })}

        {/* Support — opens sheet, not a page link */}
        {mounted ? (
          <SupportSheet>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <LifeBuoy className="h-4 w-4 shrink-0" />
              Support
            </button>
          </SupportSheet>
        ) : (
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LifeBuoy className="h-4 w-4 shrink-0" />
            Support
          </button>
        )}
      </div>
    </aside>
  )
}
