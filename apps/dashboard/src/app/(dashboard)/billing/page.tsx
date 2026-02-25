import type { Metadata } from 'next'
import Link from 'next/link'
import { CreditCard, Receipt } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { getClusters } from '@/lib/api'
import type { ClusterWithInstance } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Billing',
}

// ---------------------------------------------------------------------------
// Pricing logic
// ---------------------------------------------------------------------------

interface Tier {
  label: string
  priceUsd: number | null // null = custom / contact sales
}

function clusterTier(brokerCount: number): Tier {
  if (brokerCount <= 6) return { label: 'Small', priceUsd: 900 }
  if (brokerCount <= 15) return { label: 'Medium', priceUsd: 1_800 }
  if (brokerCount <= 30) return { label: 'Large', priceUsd: 2_700 }
  return { label: 'Enterprise', priceUsd: null }
}

function formatUsd(cents: number): string {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0 })
}

// Only clusters with an active (non-deprovisioned) instance are billed.
function isBilled(cluster: ClusterWithInstance): boolean {
  return !!cluster.instance && cluster.instance.status !== 'deprovisioned'
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function BillingPage() {
  const clusters = await getClusters()
  const billed = clusters.filter(isBilled)

  // Sum only clusters where we know the price (≤18 brokers)
  const knownTotal = billed.reduce((sum, c) => {
    const { priceUsd } = clusterTier(c.broker_count)
    return sum + (priceUsd ?? 0)
  }, 0)
  const hasCustom = billed.some((c) => clusterTier(c.broker_count).priceUsd === null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          One subscription per organisation · billed per active cluster.
        </p>
      </div>

      {/* Coming soon banner */}
      <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-700 dark:text-indigo-300">
        Stripe integration coming soon — the customer portal and invoice history will be available here.
      </div>

      {/* ── Subscription ──────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10">
              <CreditCard className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Subscription</h2>
              <p className="text-xs text-muted-foreground">
                {billed.length === 0
                  ? 'No active clusters'
                  : `${billed.length} active cluster${billed.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          <Button
            disabled
            className="bg-indigo-600 hover:bg-indigo-500 text-white opacity-50 cursor-not-allowed"
          >
            Manage via Stripe
          </Button>
        </div>

        {billed.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">
              No active Kinkang Engines yet.{' '}
              <Link href="/clusters" className="text-indigo-500 hover:underline">
                Provision one
              </Link>{' '}
              to start your subscription.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Cluster</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Brokers</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Tier</th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Monthly</th>
                </tr>
              </thead>
              <tbody>
                {billed.map((cluster) => {
                  const { label, priceUsd } = clusterTier(cluster.broker_count)
                  return (
                    <tr key={cluster.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-medium text-foreground">
                        <Link
                          href={`/clusters/${cluster.id}`}
                          className="hover:underline hover:text-indigo-500"
                        >
                          {cluster.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{cluster.broker_count}</td>
                      <td className="px-4 py-3 text-muted-foreground">{label}</td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">
                        {priceUsd !== null ? `$${priceUsd.toLocaleString('en-US')}/mo` : 'Custom'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-muted/40">
                  <td colSpan={3} className="px-4 py-2.5 text-xs font-medium text-muted-foreground">
                    Estimated total
                  </td>
                  <td className="px-4 py-2.5 text-right text-sm font-bold text-foreground">
                    {hasCustom
                      ? `$${knownTotal.toLocaleString('en-US')}+/mo`
                      : `$${knownTotal.toLocaleString('en-US')}/mo`}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* ── Pricing reference ────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Pricing</h2>
        <p className="text-xs text-muted-foreground">
          Per cluster per month, based on broker count. Each provisioned Kinkang Engine is billed as a separate line item on your org subscription.
        </p>

        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Tier</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Brokers per cluster</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Price / cluster / mo</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-medium text-foreground">Small</td>
                <td className="px-4 py-3 text-muted-foreground">Up to 6</td>
                <td className="px-4 py-3 text-right font-medium text-foreground">$900</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-medium text-foreground">Medium</td>
                <td className="px-4 py-3 text-muted-foreground">7 – 15</td>
                <td className="px-4 py-3 text-right font-medium text-foreground">$1,800</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 font-medium text-foreground">Large</td>
                <td className="px-4 py-3 text-muted-foreground">16 – 30</td>
                <td className="px-4 py-3 text-right font-medium text-foreground">$2,700</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-foreground">Enterprise</td>
                <td className="px-4 py-3 text-muted-foreground">31+</td>
                <td className="px-4 py-3 text-right font-medium text-foreground">Custom</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Invoices ─────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Invoices</h2>
        </div>
        <div className="rounded-lg border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Invoice history will appear here once Stripe is connected.
          </p>
        </div>
      </div>
    </div>
  )
}
