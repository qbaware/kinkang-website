import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Server } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { getClusters } from '@/lib/api'
import { ClustersClient } from './clusters-client'

export const metadata: Metadata = {
  title: 'Clusters',
}

export default async function ClustersPage() {
  const clusters = await getClusters()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clusters</h1>
          <p className="text-sm text-muted-foreground">Manage your Kafka clusters</p>
        </div>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white">
          <Link href="/clusters/new">
            <Plus className="mr-2 h-4 w-4" />
            Register Cluster
          </Link>
        </Button>
      </div>

      {clusters.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-muted">
            <Server className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">No clusters yet</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Register your first Kafka cluster to get started with automated management and
            monitoring.
          </p>
          <Button asChild className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white">
            <Link href="/clusters/new">
              <Plus className="mr-2 h-4 w-4" />
              Register your first cluster
            </Link>
          </Button>
        </div>
      ) : (
        <ClustersClient clusters={clusters} />
      )}
    </div>
  )
}
