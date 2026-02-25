# Design: Docs MD Switch + "On This Page" TOC Navigator

**Date:** 2026-03-02
**Status:** Approved

---

## Overview

Two related changes to the docs section:

1. **MD switch** — rename all docs content files from `.mdx` to `.md` and switch the Velite collection from `s.mdx()` to `s.markdown()`, so docs can be edited in any standard Markdown editor.
2. **TOC navigator** — add a sticky "On this page" right-hand column showing H2 and H3 headings from the current doc, with active-section highlighting via IntersectionObserver.

Blog and Legal collections stay as `.mdx` — they work and are edited infrequently.

---

## 1. MD Switch

### Velite config changes

Move `rehype-pretty-code` from `mdx.rehypePlugins` to `markdown.rehypePlugins` (and keep it in `mdx.rehypePlugins` too, so blog posts continue to get syntax highlighting).

Change the `docs` collection schema from `s.mdx()` to `s.markdown()`.

The `docs` collection becomes:

```ts
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
      slug: (meta.path as string).replace(/^.*\/docs\//, '').replace(/\.md$/, ''),
    })),
},
```

Note: `s.toc()` is added here alongside `s.markdown()` — Velite extracts headings from Markdown at build time.

### File renames

All 8 files in `src/content/docs/**/*.mdx` → `.md`. Content is unchanged.

### Rendering change

`[...slug]/page.tsx` stops using `<MDXContent code={doc.body} />` and switches to:

```tsx
<div
  className="prose dark:prose-invert max-w-none"
  dangerouslySetInnerHTML={{ __html: doc.body }}
/>
```

Tailwind Typography styles (`prose`) apply to the rendered HTML identically.

---

## 2. TOC Navigator

### Data flow

`s.toc()` in Velite produces a flat array of heading entries:

```ts
type TocEntry = { title: string; url: string; depth: number }
// depth: 1 = h2, 2 = h3 (Velite counts relative depth, not absolute)
```

`docs.toc` is passed from `[...slug]/page.tsx` as a prop to `DocsToc`.

### Layout

The `DocsLayout` is unchanged. Inside `[...slug]/page.tsx`, the content area becomes a flex row:

```
┌─────────────────────────────┬──────────────────┐
│ <article>                   │ <DocsToc>         │
│ prose content  (flex-1)     │ w-52, xl+ only    │
│ max-w-3xl                   │ sticky top-24     │
└─────────────────────────────┴──────────────────┘
```

- Below `xl` (< 1280px): TOC hidden, layout unchanged from today
- At `xl`+: 2-column flex row inside the content area

### `DocsToc` component

**File:** `src/components/docs/docs-toc.tsx`
**Type:** `'use client'`

**Props:**
```ts
interface DocsTocProps {
  items: { title: string; url: string; depth: number }[]
}
```

**Render rules:**
- If `items` has ≤ 1 entry: render nothing (no point for a single-section page)
- Renders "On this page" label (small caps, muted)
- H2 items (depth 1): normal weight, no indent
- H3 items (depth 2): `pl-3`, text-xs, slightly dimmer when inactive
- Active item: indigo accent text, medium weight
- All items are anchor links (`href={item.url}`)

**Active tracking:**
- `useEffect` sets up an `IntersectionObserver` watching all heading elements that appear in `items`
- Observer uses `rootMargin: '0px 0px -70% 0px'` — a heading becomes "active" when it enters the top 30% of the viewport
- The last observed heading in the top zone wins

### New file structure

```
src/
├── components/docs/
│   ├── docs-nav-config.ts      (unchanged)
│   ├── docs-sidebar.tsx        (unchanged)
│   └── docs-toc.tsx            (new)
│
├── content/docs/
│   ├── getting-started/overview.md          (renamed)
│   ├── requirements/customer-prerequisites.md (renamed)
│   ├── configuration/overview.md            (renamed)
│   ├── configuration/connectivity.md        (renamed)
│   ├── configuration/metrics.md             (renamed)
│   ├── configuration/security.md            (renamed)
│   ├── guides/connect-aws-msk.md            (renamed)
│   └── guides/connect-self-managed.md       (renamed)
│
└── app/docs/[...slug]/
    └── page.tsx                (updated: TOC layout + dangerouslySetInnerHTML)
```

---

## Implementation Order

1. Update `velite.config.ts` — add `markdown` rehype config, add `toc` + `s.markdown()` to docs schema, update pattern to `*.md`
2. Rename all 8 `.mdx` docs files to `.md`
3. Update `[...slug]/page.tsx` — switch to `dangerouslySetInnerHTML`, add `DocsToc` to layout
4. Create `docs-toc.tsx` component
5. Verify build + type check
