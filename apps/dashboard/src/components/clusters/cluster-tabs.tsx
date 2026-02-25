'use client'

import Link from 'next/link'
import { cn } from '@workspace/ui/lib/utils'

interface ClusterTabsProps {
  clusterId: string
  activeTab: string
}

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'engine', label: 'Engine' },
  { key: 'settings', label: 'Settings' },
]

export function ClusterTabs({ clusterId, activeTab }: ClusterTabsProps) {
  return (
    <div className="flex items-end gap-6 border-b border-border">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key
        return (
          <Link
            key={tab.key}
            href={`/clusters/${clusterId}?tab=${tab.key}`}
            className={cn(
              'pb-3 text-sm font-medium transition-colors',
              isActive
                ? 'border-b-2 border-indigo-600 text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
