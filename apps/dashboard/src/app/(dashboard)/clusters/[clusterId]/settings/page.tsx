import type { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'

export const metadata: Metadata = {
  title: 'Cluster Settings',
}

export default function ClusterSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Cluster Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Manage cluster-level settings and configuration.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Coming soon.</p>
        </CardContent>
      </Card>
    </div>
  )
}
