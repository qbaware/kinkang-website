import type { Metadata } from 'next'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import Link from 'next/link'
import { BarChart3, RefreshCw, Clock, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kinkang Engine',
  description:
    'Automated Kafka partition rebalancing powered by Cruise Control. Managed entirely by Kinkang.',
}

const features = [
  {
    icon: BarChart3,
    title: 'Continuous monitoring',
    description: 'Cruise Control runs alongside your cluster, continuously tracking broker CPU, network, disk, and partition distribution.',
  },
  {
    icon: RefreshCw,
    title: 'Automated proposals',
    description: 'Generate and apply rebalancing proposals with one click, or schedule them to run automatically during maintenance windows.',
  },
  {
    icon: Clock,
    title: 'Zero-downtime operations',
    description: 'All rebalancing operations are safe and gradual — no data loss, no consumer disruptions.',
  },
  {
    icon: Shield,
    title: 'Fully managed',
    description: 'Kinkang deploys, configures, and upgrades Cruise Control automatically. No YAML to write, no JVM to tune.',
  },
]

export default function CruiseControlPage() {
  return (
    <>
      <section className="container mx-auto max-w-6xl px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4">Kinkang Engine</Badge>
        <h1 className="text-4xl font-normal tracking-[-0.04em] sm:text-5xl">
          Kafka rebalancing, fully automated
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Kinkang deploys and manages Cruise Control for your Kafka clusters, giving you
          automated partition rebalancing without the operational overhead.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/contact">Get Early Access</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/faqs">Learn More</Link>
          </Button>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-normal tracking-[-0.03em] mb-12">What you get</h2>
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
