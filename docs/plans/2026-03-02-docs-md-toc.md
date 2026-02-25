# Docs MD Switch + TOC Navigator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Switch docs collection from MDX to plain Markdown (editor-friendly), and add a sticky "On this page" right-side TOC with H2+H3 active-section tracking.

**Architecture:** Velite `s.markdown()` replaces `s.mdx()` for the docs collection; `s.toc()` extracts headings at build time as a nested `TocEntry[]` tree. `rehype-slug` is added to the markdown rehype pipeline so rendered headings get `id` attributes. The TOC is a `'use client'` component rendered alongside the article inside `[...slug]/page.tsx` (the layout is unchanged). IntersectionObserver tracks active headings using `rootMargin` to fire when headings hit the top 30% of the viewport.

**Tech Stack:** Next.js 15 App Router, Velite 0.2, rehype-slug, Tailwind CSS, next-themes

---

## Task 1: Install `rehype-slug`

**Files:**
- Modify: `apps/landing/package.json`

`rehype-slug` adds `id` attributes to headings in the rendered HTML, matching the anchor `url` values Velite's `s.toc()` generates. Without it, the TOC links point to `#step-1-...` but no heading has that `id`.

**Step 1: Install**

```bash
cd apps/landing && pnpm add -D rehype-slug
```

**Step 2: Verify**

```bash
grep '"rehype-slug"' apps/landing/package.json
```
Expected: `"rehype-slug": "^X.X.X"` in devDependencies.

**Step 3: Commit**

```bash
git add apps/landing/package.json pnpm-lock.yaml
git commit -m "feat(docs): install rehype-slug for heading anchor IDs in markdown"
```

---

## Task 2: Update `velite.config.ts`

**Files:**
- Modify: `apps/landing/velite.config.ts`

Changes needed:
1. Import `rehypeSlug` alongside `rehypePrettyCode`
2. Add `markdown.rehypePlugins` with `[rehypeSlug, [rehypePrettyCode, ...]]` (slug must come BEFORE pretty-code so headings have IDs before syntax highlighting runs)
3. Keep `mdx.rehypePlugins` as-is (blog still uses MDX)
4. Update `docs` collection: `s.mdx()` → `s.markdown()`, add `toc: s.toc()`, pattern `*.mdx` → `*.md`, fix slug regex for `.md`

**Step 1: Replace `velite.config.ts` with the updated version**

```ts
import { defineConfig, s } from 'velite'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'

const prettyCodeOptions = {
  theme: {
    dark: 'github-dark',
    light: 'github-light',
  },
  keepBackground: false,
}

export default defineConfig({
  root: 'src/content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    clean: true,
  },
  mdx: {
    rehypePlugins: [
      [rehypePrettyCode, prettyCodeOptions],
    ],
  },
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, prettyCodeOptions],
    ],
  },
  collections: {
    posts: {
      name: 'Post',
      pattern: 'blog/*.mdx',
      schema: s
        .object({
          title: s.string(),
          publishDate: s.isodate().optional(),
          updateDate: s.isodate().optional(),
          draft: s.boolean().default(false),
          excerpt: s.string().optional(),
          image: s.string().optional(),
          category: s.string().optional(),
          tags: s.array(s.string()).default([]),
          author: s.string().optional(),
          body: s.mdx(),
        })
        .transform((data, { meta }) => {
          const slug = (meta.stem as string | undefined) ?? 'post'
          return {
            ...data,
            slug,
            permalink: `/blog/${slug}`,
          }
        }),
    },
    legal: {
      name: 'Legal',
      pattern: 'legal/*.mdx',
      schema: s
        .object({
          title: s.string(),
          lastUpdated: s.string(),
          body: s.mdx(),
        })
        .transform((data, { meta }) => ({
          ...data,
          slug: (meta.stem as string | undefined) ?? 'page',
        })),
    },
    docs: {
      name: 'Doc',
      pattern: 'docs/**/*.md',
      schema: s
        .object({
          title: s.string(),
          description: s.string().optional(),
          toc: s.toc(),
          body: s.markdown(),
        })
        .transform((data, { meta }) => ({
          ...data,
          // meta.path is an absolute path; strip everything up to and including /docs/
          // e.g. ".../src/content/docs/guides/connect-aws-msk.md" → "guides/connect-aws-msk"
          slug: (meta.path as string).replace(/^.*\/docs\//, '').replace(/\.md$/, ''),
        })),
    },
  },
})
```

**Step 2: Verify TypeScript is happy**

```bash
cd apps/landing && pnpm check-types
```
Expected: no errors.

**Step 3: Commit**

```bash
git add apps/landing/velite.config.ts
git commit -m "feat(docs): switch docs collection to markdown + s.toc(), add rehype-slug"
```

---

## Task 3: Rename doc files `.mdx` → `.md`

**Files:**
- Rename: all 8 files in `apps/landing/src/content/docs/`

**Step 1: Rename all 8 files in one command**

```bash
cd apps/landing/src/content/docs
for f in $(find . -name "*.mdx"); do mv "$f" "${f%.mdx}.md"; done
```

**Step 2: Verify**

```bash
find apps/landing/src/content/docs -name "*.md" | sort
```
Expected: 8 `.md` files, no `.mdx` files:
```
apps/landing/src/content/docs/configuration/connectivity.md
apps/landing/src/content/docs/configuration/metrics.md
apps/landing/src/content/docs/configuration/overview.md
apps/landing/src/content/docs/configuration/security.md
apps/landing/src/content/docs/getting-started/overview.md
apps/landing/src/content/docs/guides/connect-aws-msk.md
apps/landing/src/content/docs/guides/connect-self-managed.md
apps/landing/src/content/docs/requirements/customer-prerequisites.md
```

**Step 3: Verify Velite picks up the new files**

Touch one file to trigger a rebuild in the running dev server, then check `.velite/docs.json`:

```bash
touch apps/landing/src/content/docs/getting-started/overview.md
sleep 3
node -e "const d = require('./apps/landing/.velite/docs.json'); console.log(d.map(x => x.slug))"
```
Expected: all 8 slugs printed, e.g. `getting-started/overview`, `guides/connect-aws-msk`, etc.

**Step 4: Verify `toc` field is populated**

```bash
node -e "
const d = require('./apps/landing/.velite/docs.json');
const guide = d.find(x => x.slug === 'guides/connect-aws-msk');
console.log(JSON.stringify(guide.toc, null, 2));
"
```
Expected: a non-empty array of `{ title, url, items }` objects.

**Step 5: Commit**

```bash
git add apps/landing/src/content/docs/
git commit -m "feat(docs): rename doc files from .mdx to .md"
```

---

## Task 4: Create `DocsToc` component

**Files:**
- Create: `apps/landing/src/components/docs/docs-toc.tsx`

**Context:**

Velite's `s.toc()` returns a **tree**: `TocEntry[]` where each entry has `{ title, url, items: TocEntry[] }`. Top-level entries correspond to H2 headings; nested `items` correspond to H3 headings. There is no `depth` field — depth is implicit in the tree structure. We flatten to two levels for rendering.

The component uses `IntersectionObserver` with `rootMargin: '0px 0px -70% 0px'` to make headings "active" when they appear in the top 30% of the viewport. The last observed visible heading wins.

**Step 1: Create the file**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { cn } from '@workspace/ui/lib/utils'

interface TocEntry {
  title: string
  url: string
  items: TocEntry[]
}

interface FlatTocItem {
  title: string
  url: string
  depth: 2 | 3
}

function flattenToc(entries: TocEntry[]): FlatTocItem[] {
  const flat: FlatTocItem[] = []
  for (const entry of entries) {
    flat.push({ title: entry.title, url: entry.url, depth: 2 })
    for (const child of entry.items ?? []) {
      flat.push({ title: child.title, url: child.url, depth: 3 })
    }
  }
  return flat
}

interface DocsTocProps {
  toc: TocEntry[]
}

export function DocsToc({ toc }: DocsTocProps) {
  const items = flattenToc(toc)
  const [activeUrl, setActiveUrl] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (items.length === 0) return

    // Map from heading id → url (url is "#id", id is url.slice(1))
    const headingIds = items.map((item) => item.url.slice(1))

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveUrl(`#${entry.target.id}`)
          }
        }
      },
      {
        // Heading becomes active when it crosses the top 30% of the viewport
        rootMargin: '0px 0px -70% 0px',
      }
    )

    headingIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => {
      observerRef.current?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Don't render if nothing to show
  if (items.length <= 1) return null

  return (
    <aside className="hidden xl:block w-52 shrink-0 py-12">
      <div className="sticky top-24">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          On this page
        </p>
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li key={item.url}>
              <Link
                href={item.url}
                className={cn(
                  'block text-sm transition-colors',
                  item.depth === 3 && 'pl-3 text-xs',
                  activeUrl === item.url
                    ? 'font-medium text-indigo-600 dark:text-indigo-400'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                )}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
```

**Step 2: Check types compile**

```bash
cd apps/landing && pnpm check-types
```
Expected: no errors.

**Step 3: Commit**

```bash
git add apps/landing/src/components/docs/docs-toc.tsx
git commit -m "feat(docs): add DocsToc client component with IntersectionObserver active tracking"
```

---

## Task 5: Update `[...slug]/page.tsx` — switch rendering + add TOC

**Files:**
- Modify: `apps/landing/src/app/docs/[...slug]/page.tsx`

**Context:**

`doc.body` is now an HTML string (from `s.markdown()`), not compiled JSX code. Render with `dangerouslySetInnerHTML`. The `MDXContent` and `getMDXComponents` imports are no longer needed for docs pages (blog still uses them via its own pages).

The `doc.toc` field is now available. Wrap `<article>` and `<DocsToc>` in a flex row.

**Step 1: Replace the file**

```tsx
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
```

**Step 2: Verify types**

```bash
cd apps/landing && pnpm check-types
```
Expected: no errors.

**Step 3: Commit**

```bash
git add "apps/landing/src/app/docs/[...slug]/page.tsx"
git commit -m "feat(docs): switch doc rendering to dangerouslySetInnerHTML + add DocsToc"
```

---

## Task 6: Visual verification

**Step 1: Start dev server (if not running)**

```bash
cd apps/landing && pnpm dev
```

**Step 2: Check the following**

- `http://localhost:3000/docs/getting-started/overview` — page loads, content renders, Tailwind prose styles apply ✓
- `http://localhost:3000/docs/guides/connect-aws-msk` — code blocks syntax-highlighted ✓
- On a `≥ xl` (≥ 1280px) viewport: "On this page" TOC visible on the right with H2 + H3 items ✓
- Scroll through the guide: active item highlights in indigo as you pass each heading ✓
- TOC links work: clicking an item scrolls to the correct heading ✓
- Dark mode toggle: code blocks switch themes, TOC styling adapts ✓
- `http://localhost:3000/docs/getting-started/overview` — short page (few headings): TOC still renders (has > 1 item) ✓
- Mobile / tablet viewport (< 1280px): TOC hidden, content fills full width ✓

**Step 3: Final type check**

```bash
cd apps/landing && pnpm check-types
```
Expected: no errors.
