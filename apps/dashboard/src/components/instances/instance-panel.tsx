'use client'

import { useState, useEffect } from 'react'
import { Cloud, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { CopyButton } from '@/components/ui/copy-button'
import {
  provisionInstance,
  deprovisionInstance,
  getInstance,
} from '@/lib/api'
import type { ClusterWithInstance, Instance } from '@/lib/types'

interface InstancePanelProps {
  cluster: ClusterWithInstance
}

// ─── Consolidated Kinkang Engine badge (mirrors cluster-card logic) ──────────

function getEngineBadge(instance: Instance) {
  switch (instance.status) {
    case 'pending_provision':
    case 'provisioning':
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/10">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-500" />
          Provisioning
        </Badge>
      )
    case 'running':
      if (instance.health === 'degraded') {
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/10">
            Engine Degraded
          </Badge>
        )
      }
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10">
          Engine Running
        </Badge>
      )
    case 'error':
      return <Badge variant="destructive">Engine Error</Badge>
    case 'pending_deprovision':
    case 'deprovisioning':
      return (
        <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30 hover:bg-orange-500/10">
          Deprovisioning
        </Badge>
      )
    case 'deprovisioned':
      return <Badge variant="secondary">Deprovisioned</Badge>
    default:
      return <Badge variant="secondary">{instance.status}</Badge>
  }
}

// ─── Relative time helper ──────────────────────���────────────────────��─────────

function relativeTime(iso: string): string {
  const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diffSec < 60) return 'just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  return `${Math.floor(diffHr / 24)}d ago`
}

// ─── Transient status check ────────────────────────────���──────────────────────

function isTransient(status: Instance['status']): boolean {
  return (
    status === 'pending_provision' ||
    status === 'provisioning' ||
    status === 'pending_deprovision' ||
    status === 'deprovisioning'
  )
}

// ─── Detail row (mono + copy) ─────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string | null }) {
  const display = value && value.trim() ? value : null
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <div className="flex min-w-0 items-center gap-1 text-right">
        {display ? (
          <>
            <span className="break-all font-mono text-xs text-foreground">{display}</span>
            <CopyButton value={display} />
          </>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>
    </div>
  )
}

// ─── Main component ────────────────────���──────────────────────────────────────

export function InstancePanel({ cluster }: InstancePanelProps) {
  const [instance, setInstance] = useState<Instance | null>(cluster.instance)
  const [isProvisioning, setIsProvisioning] = useState(false)
  const [isDeprovisioning, setIsDeprovisioning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUpgradeRequired, setIsUpgradeRequired] = useState(false)
  const [showTechDetails, setShowTechDetails] = useState(false)

  // Auto-poll when status is transient
  useEffect(() => {
    if (!instance || !isTransient(instance.status)) return

    const id = setInterval(async () => {
      try {
        const updated = await getInstance(cluster.id)
        if (updated) {
          setInstance(updated)
          if (!isTransient(updated.status)) clearInterval(id)
        }
      } catch {
        // ignore transient polling errors
      }
    }, 5000)

    return () => clearInterval(id)
  }, [instance?.status, cluster.id])

  async function handleProvision() {
    setError(null)
    setIsUpgradeRequired(false)
    setIsProvisioning(true)
    try {
      const created = await provisionInstance(cluster.id)
      setInstance(created)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.'
      if (msg.includes('402') || msg.includes('403') || msg.toLowerCase().includes('subscription')) {
        setIsUpgradeRequired(true)
      } else {
        setError(msg)
      }
    } finally {
      setIsProvisioning(false)
    }
  }

  async function handleDeprovision() {
    if (!window.confirm('Are you sure you want to deprovision this Kinkang Engine? This will stop all automated management.')) return
    setError(null)
    setIsDeprovisioning(true)
    try {
      const updated = await deprovisionInstance(cluster.id)
      setInstance(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setIsDeprovisioning(false)
    }
  }

// ── State A: No instance (or deprovisioned) ──────────────────────────────

  const showEmptyState = !instance || instance.status === 'deprovisioned'

  if (showEmptyState) {
    return (
      <div className="space-y-4">
        {isUpgradeRequired && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Upgrade your subscription to provision a Kinkang Engine.
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="rounded-xl border border-border bg-card p-10 flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Cloud className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">No Kinkang Engine provisioned</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Provision a Kinkang Engine to start automated management for this cluster.
            </p>
          </div>
          <Button
            className="bg-indigo-600 hover:bg-indigo-500 text-white"
            onClick={handleProvision}
            disabled={isProvisioning}
          >
            {isProvisioning ? 'Provisioning…' : 'Provision Engine'}
          </Button>
        </div>
      </div>
    )
  }

  // ── State B: Instance exists ──────────────────────────────────────────────

  const canDeprovision = instance.status === 'running'

  return (
    <div className="space-y-4">
      {/* Action error banner */}
      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Status card */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {getEngineBadge(instance)}
          {instance.last_health_check_at && (
            <span className="text-xs text-muted-foreground">
              Last checked {relativeTime(instance.last_health_check_at)}
            </span>
          )}
        </div>

        {instance.status === 'error' && instance.error_message && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {instance.error_message}
          </div>
        )}
      </div>

      {/* Live metrics placeholder */}
      <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center">
        <p className="text-sm font-medium text-foreground">Live Metrics</p>
        <p className="mt-1 text-sm text-muted-foreground">
          CPU, disk, and traffic data will appear here once available.
        </p>
      </div>

      {/* Logs placeholder */}
      <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center">
        <p className="text-sm font-medium text-foreground">Logs</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Log streaming coming soon.
        </p>
      </div>

      {/* Technical Details (collapsible) */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <button
          type="button"
          className="flex w-full items-center justify-between px-5 py-3.5 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
          onClick={() => setShowTechDetails((v) => !v)}
        >
          {showTechDetails ? 'Hide Technical Details' : 'Show Technical Details'}
          {showTechDetails ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {showTechDetails && (
          <div className="border-t border-border px-5 pb-4 divide-y divide-border">
            <DetailRow label="Instance ID" value={instance.id} />
            <DetailRow label="ECS Cluster ARN" value={instance.ecs_cluster_arn} />
            <DetailRow label="ECS Task Definition ARN" value={instance.ecs_task_definition_arn} />
            <DetailRow label="ECS Service ARN" value={instance.ecs_service_arn} />
            <DetailRow label="IAM Role ARN" value={instance.iam_role_arn} />
            {cluster.cluster_type === 'msk' && (
              <DetailRow label="MSK VPC Connection ARN" value={instance.msk_vpc_connection_arn} />
            )}
            <div className="flex items-center justify-between gap-4 py-1.5 text-sm">
              <span className="shrink-0 text-muted-foreground">Last ECS Task Status</span>
              <span className="text-foreground">{instance.last_task_status ?? '—'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {canDeprovision && (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDeprovision}
            disabled={isDeprovisioning}
          >
            {isDeprovisioning ? 'Deprovisioning…' : 'Deprovision'}
          </Button>
        </div>
      )}
    </div>
  )
}
