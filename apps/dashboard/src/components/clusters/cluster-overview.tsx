'use client'

import { useState, useRef } from 'react'
import { CopyButton } from '@/components/ui/copy-button'
import { updateInstance } from '@/lib/api'
import type { ClusterWithInstance } from '@/lib/types'

interface ClusterOverviewProps {
  cluster: ClusterWithInstance
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string | null
  mono?: boolean
}) {
  const display = value && value.trim() ? value : null

  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <div className="flex min-w-0 items-center gap-1 text-right">
        {display ? (
          <>
            <span
              className={[
                'break-all text-foreground',
                mono ? 'font-mono text-xs' : '',
              ].join(' ')}
            >
              {display}
            </span>
            {mono && <CopyButton value={display} />}
          </>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="divide-y divide-border">{children}</div>
    </div>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatKbps(kbps: number): string {
  if (kbps >= 1_048_576) return `${(kbps / 1_048_576).toFixed(1)} Gbps`
  if (kbps >= 1_024) return `${(kbps / 1_024).toFixed(0)} Mbps`
  return `${kbps} kbps`
}

function formatMb(mb: number): string {
  if (mb >= 1_024) return `${(mb / 1_024).toFixed(0)} GB`
  return `${mb} MB`
}

export function ClusterOverview({ cluster }: ClusterOverviewProps) {
  const isMsk = cluster.cluster_type === 'msk'

  const [description, setDescription] = useState(cluster.instance?.description ?? '')
  const [saveFeedback, setSaveFeedback] = useState<'saved' | null>(null)
  const saveFeedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function handleDescriptionBlur() {
    if (!cluster.instance) return
    try {
      await updateInstance(cluster.id, { description: description || null })
      if (saveFeedbackTimer.current) clearTimeout(saveFeedbackTimer.current)
      setSaveFeedback('saved')
      saveFeedbackTimer.current = setTimeout(() => setSaveFeedback(null), 2000)
    } catch {
      // ignore silently
    }
  }

  return (
    <div className="space-y-4">
      {/* Description — only shown when a Kinkang Engine exists */}
      {cluster.instance && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Description
            </h3>
            {saveFeedback === 'saved' && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400">Saved</span>
            )}
          </div>
          <textarea
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            rows={2}
            placeholder="What is this cluster for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
          />
        </div>
      )}

      {/* Identity */}
      <Section title="Identity">
        <DetailRow label="Name" value={cluster.name} />
        <div className="flex items-center justify-between gap-4 py-1.5 text-sm">
          <span className="shrink-0 text-muted-foreground">Type</span>
          <span className="text-foreground">{isMsk ? 'AWS MSK' : 'Self-hosted'}</span>
        </div>
        <DetailRow label="Cluster ID" value={cluster.id} mono />
        <DetailRow label="Created" value={formatDate(cluster.created_at)} />
      </Section>

      {/* Connection */}
      <Section title="Connection">
        <DetailRow label="Bootstrap Servers" value={cluster.bootstrap_servers} mono />
        {isMsk && <DetailRow label="AWS Region" value={cluster.aws_region} />}
        {isMsk && (
          <DetailRow label="MSK Cluster ARN" value={cluster.msk_cluster_arn} mono />
        )}
        <DetailRow label="SASL Mechanism" value={cluster.sasl_mechanism} />
        {!isMsk && cluster.sasl_username && (
          <DetailRow label="SASL Username" value={cluster.sasl_username} />
        )}
      </Section>

      {/* Metrics Sampling */}
      <Section title="Metrics Sampling">
        <DetailRow
          label="Sampler"
          value={cluster.sampler === 'prometheus' ? 'Prometheus' : 'Topic Sampler'}
        />
        {cluster.sampler === 'prometheus' && (
          <DetailRow label="Prometheus Endpoint" value={cluster.prometheus_endpoint} mono />
        )}
      </Section>

      {/* Broker Specifications */}
      <Section title="Broker Specifications">
        <DetailRow label="Broker Count" value={String(cluster.broker_count)} />
        <DetailRow label="Disk per Broker" value={formatMb(cluster.broker_disk_mb)} />
        <DetailRow label="CPU Cores" value={String(cluster.broker_cpu_cores)} />
        <DetailRow label="Network In" value={formatKbps(cluster.broker_nw_in_kbps)} />
        <DetailRow label="Network Out" value={formatKbps(cluster.broker_nw_out_kbps)} />
      </Section>
    </div>
  )
}
