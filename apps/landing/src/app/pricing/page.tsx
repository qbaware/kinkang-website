import type { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@workspace/ui/lib/utils'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for Kafka cluster management with Kinkang.',
}

const plans = [
  {
    name: 'Small',
    brokers: '≤ 6 brokers',
    price: '$750',
    yearlyPrice: '$9k',
    description: 'Production-ready management for small Kafka clusters.',
    features: [
      'Up to 6 brokers',
      'Full metrics & alerting',
      'Automated rebalancing',
      'REST API access',
      'Email support',
    ],
    cta: 'Get Started',
    ctaHref: '/contact',
    highlighted: false,
  },
  {
    name: 'Medium',
    brokers: '7 – 15 brokers',
    price: '$1,500',
    yearlyPrice: '$18k',
    description: 'For growing clusters that need more headroom and reliability.',
    features: [
      'Up to 15 brokers',
      'Everything in Small',
      'Advanced alerting rules',
      'VPC peering & PrivateLink',
      'Priority support',
    ],
    cta: 'Get Started',
    ctaHref: '/contact',
    highlighted: true,
  },
  {
    name: 'Large',
    brokers: '16 – 30 brokers',
    price: '$2,200',
    yearlyPrice: '~$26k',
    description: 'High-throughput clusters with dedicated support and SLA guarantees.',
    features: [
      'Up to 30 brokers',
      'Everything in Medium',
      'Dedicated support engineer',
      'Custom SLA',
      'SSO / SAML',
    ],
    cta: 'Get Started',
    ctaHref: '/contact',
    highlighted: false,
  },
  {
    name: 'Enterprise',
    brokers: '> 30 brokers',
    price: '$4,000',
    yearlyPrice: '$48k',
    description: 'Unlimited scale, custom contracts, and on-prem deployment options.',
    features: [
      'Unlimited brokers',
      'Everything in Large',
      'On-prem deployment option',
      'Audit logs',
      'Custom integrations',
    ],
    cta: 'Contact Us',
    ctaHref: '/contact',
    highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <>
      <section className="container mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-normal tracking-[-0.04em]">Simple Pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Per cluster, per month. Annual billing saves ~17%.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                'flex flex-col border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900',
                plan.highlighted && 'border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/10'
              )}
            >
              {plan.highlighted && (
                <div className="flex justify-center -mt-3">
                  <Badge className="px-4 bg-indigo-600 text-white border-0">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{plan.brokers}</p>
                <CardTitle>{plan.name}</CardTitle>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">or {plan.yearlyPrice}/year</p>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 space-y-4">
                <ul className="flex-1 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full rounded-full"
                  variant={plan.highlighted ? 'default' : 'outline'}
                  asChild
                >
                  <Link href={plan.ctaHref}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ note */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Have questions about pricing?{' '}
          <Link href="/faqs" className="text-indigo-600 dark:text-indigo-400 underline underline-offset-4 hover:text-indigo-700 dark:hover:text-indigo-300">
            Check the FAQs
          </Link>{' '}
          or{' '}
          <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 underline underline-offset-4 hover:text-indigo-700 dark:hover:text-indigo-300">
            contact us
          </Link>
          .
        </p>
      </section>
    </>
  )
}
