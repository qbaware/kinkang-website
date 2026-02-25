import type { Metadata } from 'next'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQs',
  description: 'Frequently asked questions about Kinkang and Kafka cluster management.',
}

const faqs = [
  {
    question: 'What Kafka deployment types does Kinkang support?',
    answer:
      'Kinkang works with two specific Kafka deployment types: self-managed clusters (on-prem or in the cloud), or AWS MSK. As long as Kinkang can reach your brokers and fetch metrics for them, we can manage it.',
  },
  {
    question: 'What is Cruise Control and why does it matter?',
    answer:
      "Cruise Control is an open-source tool developed by LinkedIn that continuously monitors Kafka cluster state and generates rebalancing proposals to optimize resource utilization across brokers. It considers CPU, network I/O, disk usage, and partition counts. Without Cruise Control, partition rebalancing is a manual, error-prone process. Kinkang handles the entire Cruise Control lifecycle — deployment, configuration, upgrades, and health monitoring — so you don't have to.",
  },
  {
    question: 'Is my Kafka data secure with Kinkang?',
    answer:
      "Kinkang never stores or processes your Kafka data. We connect to your cluster's management API to read metadata, metrics, and to trigger rebalancing operations. All connections are encrypted - we support SSL, SASL authentication, AWS PrivateLink (for MSK), and an optional VPN via Tailscale.",
  },
  {
    question: 'What happens if Kinkang is unavailable?',
    answer:
      'Your Kafka cluster continues to operate normally. Kinkang is a management plane — we interact with Cruise Control and the Kafka admin API, but your brokers and producers/consumers are unaffected by any Kinkang downtime. We also maintain high availability for the Kinkang service itself.',
  },
  {
    question: 'Can I interact with Kinkang programmatically?',
    answer:
      'Yes. Kinkang exposes a full REST API that lets you trigger rebalancing, query cluster health metrics, manage cluster configurations, and more. This makes it easy to integrate Kinkang into your CI/CD pipelines, infrastructure-as-code tooling, or custom dashboards.',
  },
  {
    question: 'How long does it take to connect my first cluster?',
    answer:
      'Most teams connect their first cluster in under 10 minutes. You provide your broker endpoints and authentication credentials, and Kinkang handles the rest — including deploying and configuring Cruise Control automatically.',
  },
]

export default function FAQsPage() {
  return (
    <>
      <section className="container mx-auto max-w-4xl px-4 py-20">
        <div className="text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Support</p>
          <h1 className="text-4xl font-normal tracking-[-0.04em]">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about Kinkang. Can&apos;t find your answer?{' '}
            <Link href="/contact" className="underline underline-offset-4">
              Reach out to us.
            </Link>
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-12 w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-16 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-8 text-center">
          <h2 className="text-xl font-normal tracking-[-0.03em]">Still have questions?</h2>
          <p className="mt-2 text-muted-foreground">
            Our team is happy to walk you through anything.
          </p>
          <Button className="mt-4 rounded-full" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
