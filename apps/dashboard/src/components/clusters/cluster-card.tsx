'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { MoreHorizontal, Server } from 'lucide-react'
import { CopyButton } from '@/components/ui/copy-button'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import type { ClusterWithInstance, Instance } from '@/lib/types'

interface ClusterCardProps {
  cluster: ClusterWithInstance
  onDelete: (id: string) => void
  isDeleting?: boolean
}

/** Full-width colored status bar rendered at the top of the card. */
function EngineStatusBar({ instance }: { instance: Instance | null | undefined }) {
  if (!instance || instance.status === 'deprovisioned') {
    return (
      <div className="bg-muted py-1.5 text-xs font-medium text-center text-muted-foreground flex items-center justify-center gap-1.5">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
        No Engine
      </div>
    )
  }

  switch (instance.status) {
    case 'pending_provision':
    case 'provisioning':
      return (
        <div className="bg-yellow-500/15 py-1.5 text-xs font-medium text-center text-yellow-700 dark:text-yellow-400 flex items-center justify-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-500" />
          Provisioning
        </div>
      )
    case 'running':
      if (instance.health === 'degraded') {
        return (
          <div className="bg-yellow-500/15 py-1.5 text-xs font-medium text-center text-yellow-700 dark:text-yellow-400 flex items-center justify-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-500" />
            Engine Degraded
          </div>
        )
      }
      return (
        <div className="bg-emerald-500/15 py-1.5 text-xs font-medium text-center text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Engine Running
        </div>
      )
    case 'error':
      return (
        <div className="bg-red-500/15 py-1.5 text-xs font-medium text-center text-red-700 dark:text-red-400 flex items-center justify-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
          Engine Error
        </div>
      )
    case 'pending_deprovision':
    case 'deprovisioning':
      return (
        <div className="bg-orange-500/15 py-1.5 text-xs font-medium text-center text-orange-700 dark:text-orange-400 flex items-center justify-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
          Deprovisioning
        </div>
      )
    default:
      return (
        <div className="bg-muted py-1.5 text-xs font-medium text-center text-muted-foreground flex items-center justify-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
          {instance.status}
        </div>
      )
  }
}

/**
 * Single consolidated Kinkang Engine badge.
 *
 * States:
 *  - No instance / deprovisioned       → "No Engine"        (gray)
 *  - pending_provision / provisioning  → "Provisioning"     (yellow pulse)
 *  - running + degraded                → "Engine Degraded"  (yellow)
 *  - running + (healthy/inactive/unknown) → "Engine Running" (green)
 *  - error                             → "Engine Error"     (red)
 *  - pending_deprovision / deprovisioning → "Deprovisioning" (orange)
 */
function getEngineBadge(instance: Instance | null | undefined) {
  if (!instance || instance.status === 'deprovisioned') {
    return (
      <Badge variant="secondary" className="shrink-0">
        No Engine
      </Badge>
    )
  }

  switch (instance.status) {
    case 'pending_provision':
    case 'provisioning':
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/10 shrink-0">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-500" />
          Provisioning
        </Badge>
      )
    case 'running':
      if (instance.health === 'degraded') {
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/10 shrink-0">
            Engine Degraded
          </Badge>
        )
      }
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 shrink-0">
          Engine Running
        </Badge>
      )
    case 'error':
      return (
        <Badge variant="destructive" className="shrink-0">
          Engine Error
        </Badge>
      )
    case 'pending_deprovision':
    case 'deprovisioning':
      return (
        <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30 hover:bg-orange-500/10 shrink-0">
          Deprovisioning
        </Badge>
      )
    default:
      return <Badge variant="secondary" className="shrink-0">{instance.status}</Badge>
  }
}

export function ClusterCard({ cluster, onDelete, isDeleting = false }: ClusterCardProps) {
  const { instance } = cluster
  const hasActiveInstance = instance && instance.status !== 'deprovisioned'

  // Defer the DropdownMenu to client-only to avoid Radix useId() SSR/hydration
  // mismatch (Radix generates different IDs on server vs client in Next.js 15).
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <Card className="flex flex-col overflow-hidden">
      <EngineStatusBar instance={instance} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-foreground truncate">{cluster.name}</h3>
              <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/30 hover:bg-violet-500/10 shrink-0">
                {cluster.cluster_type === 'msk' ? 'MSK' : 'Self-Hosted'}
              </Badge>
            </div>
          </div>
          {mounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Cluster actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/clusters/${cluster.id}?tab=settings`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(cluster.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting…' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Placeholder keeps layout stable before hydration
            <div className="h-8 w-8 shrink-0" />
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 flex-1">
        {/* Bootstrap servers */}
        <div className="flex items-center gap-1.5">
          <Server className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <p
            className="min-w-0 truncate text-sm text-muted-foreground"
            title={cluster.bootstrap_servers}
          >
            {cluster.bootstrap_servers}
          </p>
          <CopyButton value={cluster.bootstrap_servers} />
        </div>

        {/* Broker count + description */}
        <p className="text-xs text-muted-foreground">{cluster.broker_count} broker{cluster.broker_count !== 1 ? 's' : ''}</p>
        {instance?.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{instance.description}</p>
        )}

        {/* Action row — pinned to bottom */}
        <div className="mt-auto flex items-center gap-2 pt-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/clusters/${cluster.id}`}>Overview</Link>
          </Button>
          {!hasActiveInstance ? (
            <Button
              asChild
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <Link href={`/clusters/${cluster.id}?tab=engine`}>Provision Engine</Link>
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href={`/clusters/${cluster.id}?tab=engine`}>View Engine</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
