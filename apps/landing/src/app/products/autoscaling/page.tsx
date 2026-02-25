import type { Metadata } from 'next'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kinkang Autoscaling',
  description: 'Automatically scale your Kafka cluster brokers based on real-time load.',
}

export default function AutoscalingPage() {
  return (
    <>
      <section className="container mx-auto max-w-6xl px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4">Coming Soon</Badge>
        <h1 className="text-4xl font-normal tracking-[-0.04em] sm:text-5xl">
          Kafka Autoscaling
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Automatically add and remove brokers based on your cluster&apos;s real-time load. Stop
          over-provisioning, stop scrambling during traffic spikes.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Kinkang Autoscaling is under active development. Get notified when it launches.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/contact">Get Notified</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/products/engine">See Engine</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
