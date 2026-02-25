import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { docs } from '@/.velite'
import { DocsToc } from '@/components/docs/docs-toc'

export function generateStaticParams() {
  return docs.map((doc) => ({
    slug: doc.slug.split('/'),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const doc = docs.find((d) => d.slug === slug.join('/'))
  if (!doc) return {}
  return {
    title: doc.title,
    description: doc.description,
  }
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const doc = docs.find((d) => d.slug === slug.join('/'))
  if (!doc) notFound()

  return (
    <div className="flex gap-12">
      <article className="min-w-0 flex-1 max-w-3xl">
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: doc.body }}
        />
      </article>
      <DocsToc toc={doc.toc} />
    </div>
  )
}
