'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { cn } from '@workspace/ui/lib/utils'

interface TocEntry {
  title: string
  url: string
  items: TocEntry[]
}

interface FlatTocItem {
  title: string
  url: string
  depth: 2 | 3
}

/**
 * Velite's s.toc() nests headings under the H1 root.
 * Structure: toc = [H1-entry { items: [H2-entries { items: [H3-entries] }] }]
 * We skip the H1 and flatten H2 → depth 2, H3 → depth 3.
 */
function flattenToc(entries: TocEntry[]): FlatTocItem[] {
  const flat: FlatTocItem[] = []
  // Drill one level down to get H2 items (entries are H1 roots)
  const h2Entries = entries.flatMap((e) => e.items ?? [])
  for (const h2 of h2Entries) {
    flat.push({ title: h2.title, url: h2.url, depth: 2 })
    for (const h3 of h2.items ?? []) {
      flat.push({ title: h3.title, url: h3.url, depth: 3 })
    }
  }
  return flat
}

interface DocsTocProps {
  toc: TocEntry[]
}

export function DocsToc({ toc }: DocsTocProps) {
  const items = flattenToc(toc)
  const [activeUrl, setActiveUrl] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (items.length === 0) return

    const headingIds = items.map((item) => item.url.slice(1))

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveUrl(`#${entry.target.id}`)
          }
        }
      },
      {
        // Heading becomes active when it crosses the top 30% of the viewport
        rootMargin: '0px 0px -70% 0px',
      }
    )

    headingIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => {
      observerRef.current?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Don't render if nothing meaningful to show
  if (items.length <= 1) return null

  return (
    <aside className="hidden xl:block w-52 shrink-0 py-12">
      <div className="sticky top-24">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          On this page
        </p>
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li key={item.url}>
              <Link
                href={item.url}
                className={cn(
                  'block text-sm transition-colors',
                  item.depth === 3 && 'pl-3',
                  activeUrl === item.url
                    ? 'font-medium text-indigo-600 dark:text-indigo-400'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                )}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
