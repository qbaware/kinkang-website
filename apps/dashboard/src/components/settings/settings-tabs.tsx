'use client'

import { use } from 'react'
import Link from 'next/link'
import { UserProfile, OrganizationProfile, useUser } from '@clerk/nextjs'
import { cn } from '@workspace/ui/lib/utils'

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'organization', label: 'Organization & Members' },
]

type Tab = 'profile' | 'organization'

interface SettingsTabsProps {
  searchParams: Promise<{ tab?: string }>
}

function NotSignedIn() {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-8 text-center">
      <p className="text-sm text-muted-foreground">Sign in to manage your settings.</p>
    </div>
  )
}

export function SettingsTabs({ searchParams }: SettingsTabsProps) {
  const { tab: tabParam } = use(searchParams)
  const tab: Tab = tabParam === 'organization' ? 'organization' : 'profile'

  const { isSignedIn, isLoaded } = useUser()

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex items-end gap-6 border-b border-border">
        {TABS.map((t) => {
          const isActive = tab === t.key
          return (
            <Link
              key={t.key}
              href={`/settings?tab=${t.key}`}
              className={cn(
                'pb-3 text-sm font-medium transition-colors',
                isActive
                  ? 'border-b-2 border-indigo-600 text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t.label}
            </Link>
          )
        })}
      </div>

      {/* Tab content — only rendered once Clerk has resolved auth state */}
      {isLoaded && !isSignedIn && <NotSignedIn />}
      {isLoaded && isSignedIn && (
        <div className="[&_.cl-rootBox]:w-full [&_.cl-card]:rounded-xl [&_.cl-card]:border [&_.cl-card]:border-border [&_.cl-card]:shadow-none">
          {tab === 'profile' && <UserProfile routing="hash" />}
          {tab === 'organization' && <OrganizationProfile routing="hash" />}
        </div>
      )}
    </div>
  )
}
