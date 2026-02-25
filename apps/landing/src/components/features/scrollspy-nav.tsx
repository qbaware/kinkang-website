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

  function scrollToSection(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav aria-label="Page sections" className="sticky top-24 z-10 pb-60 pt-10">
      <ul className="flex w-[200px] flex-col gap-y-1.5">
        {sections.map(({ id, label }) => {
          const isActive = activeId === id
          return (
            <li key={id}>
              <button
                onClick={() => scrollToSection(id)}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'relative flex w-full cursor-pointer items-center gap-x-2.5 whitespace-nowrap rounded-sm py-1.5 pl-[18px] text-left text-[15px] leading-none tracking-tight transition-colors duration-200',
                  'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:size-2 before:rounded-full before:transition-colors before:duration-200',
                  isActive
                    ? 'text-zinc-900 dark:text-zinc-100 before:bg-indigo-600 dark:before:bg-indigo-400'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                )}
              >
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
