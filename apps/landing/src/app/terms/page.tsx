import type { Metadata } from 'next'
import { legal } from '@/.velite'
import { notFound } from 'next/navigation'
import { getMDXComponents, MDXContent } from '@/components/mdx/mdx-components'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: "Kinkang's terms of service and conditions of use.",
}

export default function TermsPage() {
  const page = legal.find((p) => p.slug === 'terms')
  if (!page) notFound()

  return (
    <article className="container mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-4xl font-bold tracking-tight">{page.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {page.lastUpdated}</p>
      <div className="prose prose-zinc mt-10 max-w-none">
        <MDXContent code={page.body} components={getMDXComponents()} />
      </div>
    </article>
  )
}
