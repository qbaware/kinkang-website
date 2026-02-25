'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, X } from 'lucide-react'
import { ClusterCard } from '@/components/clusters/cluster-card'
import { deleteCluster } from '@/lib/api'
import type { ClusterWithInstance } from '@/lib/types'

// ---------------------------------------------------------------------------
// Filter logic
// ---------------------------------------------------------------------------

type FilterTab = 'all' | 'running' | 'attention' | 'in-progress' | 'no-engine'

function getFilterTab(cluster: ClusterWithInstance): FilterTab {
  const { instance } = cluster
  if (!instance || instance.status === 'deprovisioned') return 'no-engine'
  if (instance.status === 'error') return 'attention'
  if (instance.status === 'running' && instance.health === 'degraded') return 'attention'
  if (instance.status === 'running') return 'running'
  return 'in-progress'
}

// Lower = shown first
function severityScore(cluster: ClusterWithInstance): number {
  const { instance } = cluster
  if (!instance || instance.status === 'deprovisioned') return 50
  switch (instance.status) {
    case 'error':         return 10
    case 'running':       return instance.health === 'degraded' ? 20 : 40
    case 'provisioning':
    case 'pending_provision':
    case 'deprovisioning':
    case 'pending_deprovision': return 30
    default:              return 50
  }
}

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all',         label: 'All' },
  { id: 'running',     label: 'Running' },
  { id: 'attention',   label: 'Needs Attention' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'no-engine', label: 'No Engine' },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ClustersClientProps {
  clusters: ClusterWithInstance[]
}

export function ClustersClient({ clusters }: ClustersClientProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [bannerDismissed, setBannerDismissed] = useState(false)

  async function handleDelete(id: string) {
    const cluster = clusters.find((c) => c.id === id)
    const confirmed = window.confirm(
      `Are you sure you want to delete "${cluster?.name ?? id}"?\n\nThis will also remove any associated Kinkang Engine. This action cannot be undone.`,
    )
    if (!confirmed) return

    setDeletingId(id)
    try {
      await deleteCluster(id)
      router.refresh()
    } catch (err) {
      alert(`Failed to delete cluster: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setDeletingId(null)
    }
  }

  // Sorted by severity, then stable by name
  const sorted = [...clusters].sort((a, b) => {
    const diff = severityScore(a) - severityScore(b)
    return diff !== 0 ? diff : a.name.localeCompare(b.name)
  })

  // Tab counts
  const counts: Record<FilterTab, number> = {
    all:           clusters.length,
    running:       clusters.filter((c) => getFilterTab(c) === 'running').length,
    attention:     clusters.filter((c) => getFilterTab(c) === 'attention').length,
    'in-progress': clusters.filter((c) => getFilterTab(c) === 'in-progress').length,
    'no-engine': clusters.filter((c) => getFilterTab(c) === 'no-engine').length,
  }

  const attentionCount = counts['attention']
  const showBanner = attentionCount > 0 && !bannerDismissed

  const visible = sorted.filter(
    (c) => activeTab === 'all' || getFilterTab(c) === activeTab,
  )

  return (
    <div className="space-y-4">
      {/* Attention banner */}
      {showBanner && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              {attentionCount === 1
                ? '1 cluster needs attention.'
                : `${attentionCount} clusters need attention.`}
            </span>
            <button
              className="underline underline-offset-2 hover:no-underline"
              onClick={() => setActiveTab('attention')}
            >
              View
            </button>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            className="shrink-0 rounded p-0.5 hover:bg-amber-500/20"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto scrollbar-none">
        {TABS.filter((tab) => tab.id === 'all' || counts[tab.id] > 0).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              'flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-indigo-600 text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            {tab.label}
            <span
              className={[
                'rounded-full px-1.5 py-0.5 text-xs font-medium',
                activeTab === tab.id
                  ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                  : 'bg-muted text-muted-foreground',
              ].join(' ')}
            >
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No clusters in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((cluster) => (
            <ClusterCard
              key={cluster.id}
              cluster={cluster}
              onDelete={handleDelete}
              isDeleting={deletingId === cluster.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
