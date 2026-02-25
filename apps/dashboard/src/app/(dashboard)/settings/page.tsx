import type { Metadata } from 'next'
import { SettingsTabs } from '@/components/settings/settings-tabs'

export const metadata: Metadata = {
  title: 'Settings',
}

export default function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage your profile and organization.
        </p>
      </div>

      <SettingsTabs searchParams={searchParams} />
    </div>
  )
}
