import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'
import { Mail, Calendar, MessageSquare } from 'lucide-react'
import { ContactForm } from './contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Kinkang team. We respond within 1 business day.',
}

const contactOptions = [
  {
    icon: MessageSquare,
    title: 'Slack',
    description: 'Join our community Slack for quick questions and discussions.',
    action: 'Join Slack',
    href: '#',
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'Reach us directly at hello@kinkang.cloud for any enquiries.',
    action: 'Send Email',
    href: 'mailto:hello@kinkang.cloud',
  },
  {
    icon: Calendar,
    title: 'Book a Call',
    description: 'Schedule a 30-minute call to discuss your Kafka setup.',
    action: 'Book Meeting',
    href: '#',
  },
]

export default function ContactPage() {
  return (
    <>
      <section className="container mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-normal tracking-[-0.04em]">Get in Touch</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Whether you have questions about Kinkang, need help with your Kafka setup, or just want
            to chat — we&apos;re here.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Contact options */}
          <div className="space-y-4">
            <h2 className="text-xl font-normal tracking-[-0.03em]">Ways to reach us</h2>
            {contactOptions.map((option) => (
              <Card key={option.title} className="border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                    <option.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-normal">{option.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
                    <Button variant="link" className="mt-2 h-auto p-0 text-sm" asChild>
                      <Link href={option.href}>{option.action} →</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact form */}
          <div>
            <h2 className="text-xl font-normal tracking-[-0.03em] mb-4">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
