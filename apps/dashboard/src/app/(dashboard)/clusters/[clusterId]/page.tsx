import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getCluster } from '@/lib/api'
import { ClusterTabs } from '@/components/clusters/cluster-tabs'
import { ClusterOverview } from '@/components/clusters/cluster-overview'
import { InstancePanel } from '@/components/instances/instance-panel'
import { ClusterSettingsForm } from '@/components/clusters/cluster-settings-form'

export const metadata: Metadata = {
  title: 'Cluster',
}

type Tab = 'overview' | 'engine' | 'settings'

export default async function ClusterPage({
  params,
  searchParams,
}: {
  params: Promise<{ clusterId: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { clusterId } = await params
  const { tab: tabParam } = await searchParams

  const tab: Tab =
    tabParam === 'engine' || tabParam === 'settings' ? tabParam : 'overview'

  let cluster
  try {
    cluster = await getCluster(clusterId)
  } catch {
    return (
      <div className="space-y-6">
        <Link
          href="/clusters"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Clusters
        </Link>
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive">
          Cluster not found. It may have been deleted.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/clusters"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Clusters
      </Link>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{cluster.name}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {cluster.cluster_type === 'msk' ? 'Amazon MSK' : 'Self-managed'} ·{' '}
          {cluster.broker_count} broker{cluster.broker_count !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Tab navigation */}
      <ClusterTabs clusterId={clusterId} activeTab={tab} />

      {/* Tab content */}
      {tab === 'overview' && <ClusterOverview cluster={cluster} />}
      {tab === 'engine' && <InstancePanel cluster={cluster} />}
      {tab === 'settings' && <ClusterSettingsForm cluster={cluster} />}
    </div>
  )
}
