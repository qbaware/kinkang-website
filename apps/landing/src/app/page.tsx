import type { Metadata } from 'next'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight, Shield, Zap, BarChart3, Server, Activity, AlertTriangle, DollarSign, CheckCircle2, Users } from 'lucide-react'
import { ScrollspyNav } from '@/components/features/scrollspy-nav'

export const metadata: Metadata = {
  title: 'Kinkang - Your Kafka cluster. Properly Managed.',
}

type FeatureItem = {
  icon: LucideIcon
  title: string
  description: string
}

type FeatureSection = {
  id: string
  label: string
  heading: string
  description: string
  features: [FeatureItem, FeatureItem]
}

const featureSections: FeatureSection[] = [
  {
    id: 'kafka-core',
    label: 'Kafka Core',
    heading: 'Cluster management without the toil.',
    description:
      'Real-time visibility into every broker, partition, and consumer group — with zero manual instrumentation.',
    features: [
      {
        icon: BarChart3,
        title: 'Real-time Metrics',
        description:
          'Monitor cluster health, throughput, and latency with comprehensive live dashboards.',
      },
      {
        icon: Server,
        title: 'Multi-Cloud Support',
        description:
          'Works with self-managed Kafka, AWS MSK, and Google Cloud. Deploy anywhere.',
      },
    ],
  },
  {
    id: 'kinkang-engine',
    label: 'Kinkang Engine',
    heading: 'Intelligent balancing and scaling. Built on proven open source.',
    description:
      'Kinkang Engine is powered by Cruise Control — the open-source technology originally built at LinkedIn and trusted by the world\'s largest Kafka deployments. We manage the full lifecycle and layer proprietary automation and a clean management interface on top.',
    features: [
      {
        icon: Zap,
        title: 'Automated Rebalancing & Scaling',
        description:
          'Continuously rebalance partitions and scale brokers for optimal performance — without manual intervention.',
      },
      {
        icon: Activity,
        title: 'REST API & Dashboard',
        description:
          'Full programmatic access and a clean UI to trigger rebalancing, inspect proposals, and manage clusters.',
      },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    heading: 'Production-grade operations, out of the box.',
    description:
      'Security, alerting, and high availability are built in — not bolted on. Ship to production with confidence.',
    features: [
      {
        icon: Shield,
        title: 'Enterprise Security',
        description:
          'SSL, SASL, VPC peering, and Private Links. Your data stays secure at every layer.',
      },
      {
        icon: AlertTriangle,
        title: 'High Availability',
        description:
          'Built-in redundancy and failover mechanisms. Kinkang outages never affect your Kafka brokers.',
      },
    ],
  },
]

const scrollspySections = featureSections.map(({ id, label }) => ({ id, label }))

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
        {/* Dot-grid background */}
        <div className="hero-dot-grid pointer-events-none absolute inset-0" />
        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 px-4 py-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            Kafka management, simplified
            <span className="ml-2 text-indigo-600 dark:text-indigo-400">→</span>
          </div>

          <h1 className="text-5xl font-normal tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Your Kafka cluster.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Properly Managed.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xl text-zinc-600 dark:text-zinc-400">
            Kinkang offers a managed Apache Kafka balancing and scaling solution based on open-source
            technologies.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full"
              asChild
            >
              <Link href="/contact">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full"
              asChild
            >
              <Link href="/products/engine">See how it works</Link>
            </Button>
          </div>

        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-zinc-200 dark:border-zinc-800 py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <p className="text-center text-sm text-zinc-600">
            Technologies trusted by{' '}
            <span className="mx-3 font-medium text-zinc-600">LinkedIn</span>
            <span className="mx-3 font-medium text-zinc-600">JPMorgan</span>
            <span className="mx-3 font-medium text-zinc-600">Bank of America</span>
            <span className="mx-3 font-medium text-zinc-600">Netflix</span>
            <span className="mx-3 font-medium text-zinc-600">Uber</span>
            <span className="mx-3 font-medium text-zinc-600">SAP</span>
            <span className="mx-3 font-medium text-zinc-600">Shopify</span>
            <span className="mx-3 font-medium text-zinc-600">Bosch</span>
            and many more.
          </p>
        </div>
      </section>

      {/* ROI Section */}
      <section className="border-b border-zinc-200 dark:border-zinc-800 py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              The business case
            </p>
            <h2 className="mt-2 text-3xl font-normal tracking-[-0.03em] sm:text-4xl">
              Cheaper than the alternative.{' '}
              <span className="text-zinc-400">By a wide margin.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800">
            <div className="py-8 md:pr-12">
              <p className="text-xs font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Engineer time saved</p>
              <p className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">8 – 15 h</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">per month, per cluster</p>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                Manual Kafka rebalancing, partition reassignment, and capacity planning on a typical cluster costs a senior engineer 8–15 hours a month. At $150–200/hr that&apos;s{' '}
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">$1,200–3,000/mo in recovered engineering time</span> — before counting the incidents you avoided.
              </p>
            </div>

            <div className="py-8 md:pl-12">
              <p className="text-xs font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">DIY Cruise Control isn&apos;t free</p>
              <p className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">$700 – 1,350</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">per month, ongoing</p>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                Self-hosting Cruise Control means a 2–5 day setup ($2,000–5,000 one-time), plus 4–8 hours/month of ongoing maintenance at $150/hr, plus AWS infra. That&apos;s{' '}
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">$700–1,350/mo before the first incident</span> — and the ops burden is still yours.
              </p>
            </div>
          </div>

          <p className="mt-12 text-center text-lg font-medium text-zinc-700 dark:text-zinc-300 italic">
            &ldquo;One hour of avoided incident on a busy Kafka cluster pays for a month of Kinkang.&rdquo;
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Section header */}
          <div className="mb-16 text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Why Kinkang
            </p>
            <h2 className="mt-2 text-3xl font-normal tracking-[-0.03em] sm:text-4xl">
              Everything Kafka needs,{' '}
              <span className="text-zinc-400">none of the ops.</span>
            </h2>
          </div>

          {/* Two-column scrollspy layout */}
          <div className="flex gap-16">
            {/* Left: sticky scrollspy nav */}
            <div className="hidden lg:block shrink-0">
              <ScrollspyNav sections={scrollspySections} />
            </div>

            {/* Right: scrollable feature sections */}
            <div className="flex-1 space-y-4">
              {featureSections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 py-12 first:pt-10"
                >
                  <p className="mb-2 text-base font-semibold text-indigo-600 dark:text-indigo-400">{section.label}</p>
                  <h3 className="text-2xl font-normal tracking-[-0.03em] text-zinc-900 dark:text-zinc-100">
                    {section.heading}
                  </h3>
                  <p className="mt-3 max-w-xl text-zinc-600 dark:text-zinc-400">{section.description}</p>

                  <div className="mt-8 grid sm:grid-cols-2">
                    {section.features.map((feature, i) => (
                      <div
                        key={feature.title}
                        className={`p-8 ${i === 0 ? 'border-l border-r border-zinc-200 dark:border-zinc-800' : ''}`}
                      >
                        <feature.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <h4 className="mt-4 text-base font-medium text-zinc-900 dark:text-zinc-100">{feature.title}</h4>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              What you get
            </p>
            <h2 className="mt-2 text-3xl font-normal tracking-[-0.03em] sm:text-4xl">
              Managed Kafka ops.{' '}
              <span className="text-zinc-400">Measurable results.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2">
            {[
              {
                icon: CheckCircle2,
                title: 'Fully managed Kinkang Engine',
                description: 'Deployed, configured, upgraded, and restarted by Kinkang. No YAML to write, no JVM to tune.',
              },
              {
                icon: BarChart3,
                title: 'Cruise Control metrics API',
                description: 'Query CC metrics programmatically for custom tooling, dashboards, and integrations.',
              },
              {
                icon: Activity,
                title: 'Grafana dashboard',
                description: 'Live visibility into cluster health, partition distribution, and Cruise Control status — out of the box.',
              },
              {
                icon: DollarSign,
                title: 'Fewer incidents, lower costs',
                description: 'Proactive rebalancing prevents broker overload before it cascades into consumer lag, data loss, or an outage.',
              },
              {
                icon: Users,
                title: 'Expert Kafka consultancy',
                description: 'You get direct access to a team with deep, dedicated expertise in Kafka balancing. We tailor a rebalancing strategy to your exact cluster topology, traffic patterns, and business requirements — not a generic playbook.',
              },
              {
                icon: Shield,
                title: '24/7 ops coverage',
                description: 'We watch your Kafka so you don\'t have to. Incident detection, escalation, and response — around the clock, no on-call rotation required from your team.',
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={[
                  'py-8',
                  i % 2 === 0 ? 'md:pr-12' : 'md:pl-12 md:border-l border-zinc-200 dark:border-zinc-800',
                  i >= 2 ? 'border-t border-zinc-200 dark:border-zinc-800' : '',
                ].join(' ')}
              >
                <item.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <h3 className="mt-4 text-xl font-medium text-zinc-900 dark:text-zinc-100">{item.title}</h3>
                <p className="mt-3 text-zinc-600 dark:text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for your team */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              For who it&apos;s for
            </p>
            <h2 className="mt-2 text-3xl font-normal tracking-[-0.03em] sm:text-4xl">
              Built for the teams Kafka taxes most.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800">
            <div className="py-8 md:pr-12">
              <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h3 className="mt-4 text-xl font-medium text-zinc-900 dark:text-zinc-100">AWS MSK teams</h3>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                MSK manages your brokers. But partition rebalancing, Cruise Control, and performance tuning are still on you. Kinkang adds the missing ops layer — making MSK actually fully managed.
              </p>
              <p className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                Stop paying for MSK&apos;s convenience while absorbing its ops cost.
              </p>
            </div>
            <div className="py-8 md:pl-12">
              <Server className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h3 className="mt-4 text-xl font-medium text-zinc-900 dark:text-zinc-100">Self-managed Kafka teams</h3>
              <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                Running your own Kafka means owning every failure. Kinkang handles partition balance, health monitoring, and incident prevention — so you ship features instead of writing runbooks.
              </p>
              <p className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                Skip the dedicated Kafka SRE hire. Let Kinkang carry the ops weight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-8 py-16 text-center">
            {/* Subtle glow behind CTA */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-64 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-normal tracking-[-0.03em]">Ready to get started?</h2>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                Get in touch with our team to learn how Kinkang can help manage your Kafka infrastructure.
              </p>
              <div className="mt-8">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
