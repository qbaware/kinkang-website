import type { Metadata } from 'next'
import { posts } from '@/.velite'
import { notFound } from 'next/navigation'
import { getMDXComponents, MDXContent } from '@/components/mdx/mdx-components'
import { Badge } from '@workspace/ui/components/badge'
import { CalendarIcon, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function generateStaticParams() {
  return posts.filter((p) => !p.draft).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug && !p.draft)
  if (!post) notFound()

  return (
    <article className="container mx-auto max-w-3xl px-4 py-20">
      <Link
        href="/blog"
        className="mb-8 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-100 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      <header className="mb-10">
        {post.category && (
          <Badge variant="secondary" className="mb-4">
            {post.category}
          </Badge>
        )}
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        {post.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
        )}
        <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
          {post.author && <span className="text-zinc-600 dark:text-zinc-400">By {post.author}</span>}
          {post.publishDate && (
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              <span className="text-zinc-600 dark:text-zinc-400">{formatDate(post.publishDate)}</span>
            </div>
          )}
        </div>
      </header>

      <div className="prose dark:prose-invert max-w-none">
        <MDXContent code={post.body} components={getMDXComponents()} />
      </div>
    </article>
  )
}
