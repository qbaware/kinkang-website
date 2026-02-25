'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
import { docsNav, type DocNavSection } from './docs-nav-config'

function SidebarSection({
  section,
  currentPath,
}: {
  section: DocNavSection
  currentPath: string
}) {
  const isActive = section.items.some((item) => item.href === currentPath)
  const [open, setOpen] = useState<boolean>(isActive || true)

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        {section.title}
        <ChevronDown
          className={cn('h-3 w-3 transition-transform duration-150', open && 'rotate-180')}
        />
      </button>

      {open && (
        <ul className="mt-1 space-y-0.5">
          {section.items.map((item) => {
            const active = item.href === currentPath
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'block rounded-md px-3 py-1.5 text-sm transition-colors',
                    active
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  )}
                >
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function DocsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:block w-60 shrink-0 py-12 pr-6">
      <div className="sticky top-24 space-y-4">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Documentation
        </p>
        {docsNav.map((section) => (
          <SidebarSection key={section.title} section={section} currentPath={pathname} />
        ))}
      </div>
    </aside>
  )
}
