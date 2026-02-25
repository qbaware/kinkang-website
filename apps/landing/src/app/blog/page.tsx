import type { Metadata } from 'next'
import { posts } from '@/.velite'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { CalendarIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights, tutorials, and updates from the Kinkang team.',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogPage() {
  const publishedPosts = posts
    .filter((p) => !p.draft)
    .sort((a, b) => {
      if (!a.publishDate || !b.publishDate) return 0
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    })

  return (
    <section className="container mx-auto max-w-6xl px-4 py-20">
      <div className="mb-12">
        <h1 className="text-4xl font-normal tracking-[-0.04em]">Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Insights on Kafka management, Cruise Control, and building reliable data infrastructure.
        </p>
      </div>

      {publishedPosts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {publishedPosts.map((post) => (
            <Link key={post.slug} href={post.permalink} className="group">
              <Card className="h-full border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 transition-colors group-hover:border-zinc-400 dark:group-hover:border-zinc-600">
                <CardHeader>
                  {post.category && (
                    <Badge variant="outline" className="w-fit border-indigo-500/50 text-indigo-600 dark:text-indigo-400">
                      {post.category}
                    </Badge>
                  )}
                  <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  {post.excerpt && (
                    <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {post.publishDate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarIcon className="h-3 w-3" />
                      {formatDate(post.publishDate)}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
