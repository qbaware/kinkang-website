import type { Metadata } from 'next'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import Link from 'next/link'
import { Brain, TrendingUp, Bell, Gauge } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kinkang AI',
  description:
    'Predictive, AI-powered Kafka cluster balancing. Anticipate imbalances before they happen.',
}

const features = [
  {
    icon: TrendingUp,
    title: 'Predictive rebalancing',
    description:
      'ML models trained on your cluster\'s historical throughput, lag, and broker load patterns predict partition imbalances hours before they affect consumers — and fix them proactively.',
  },
  {
    icon: Brain,
    title: 'Workload forecasting',
    description:
      'Forecast cluster load hours ahead using traffic trends and time-of-day patterns. Kinkang prepares the cluster before the spike hits, not after.',
  },
  {
    icon: Bell,
    title: 'Intelligent alert correlation',
    description:
      'Instead of flooding you with individual alerts, Kinkang groups related signals and surfaces a single root cause — so you spend time fixing problems, not triaging noise.',
  },
  {
    icon: Gauge,
    title: 'Continuous optimisation',
    description:
      'AI continuously evaluates broker utilisation, partition assignments, and replica placement to keep your cluster in an optimal state with no manual tuning required.',
  },
]

export default function AIBalancingPage() {
  return (
    <>
      <section className="container mx-auto max-w-6xl px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4">Coming Soon</Badge>
        <h1 className="text-4xl font-normal tracking-[-0.04em] sm:text-5xl">
          Kafka balancing that thinks ahead
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Kinkang AI Balancing goes beyond reactive rebalancing — it learns your cluster&apos;s
          patterns and acts before problems arise, keeping performance smooth around the clock.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/contact">Get Notified</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/products/engine">See Kinkang Engine</Link>
          </Button>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-normal tracking-[-0.03em] mb-12">What&apos;s coming</h2>
          <div className="grid sm:grid-cols-2">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`p-8 ${i % 2 === 0 ? 'border-l border-r border-zinc-200 dark:border-zinc-800' : ''}`}
              >
                <f.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="mt-4 text-base font-medium text-zinc-900 dark:text-zinc-100">{f.title}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
