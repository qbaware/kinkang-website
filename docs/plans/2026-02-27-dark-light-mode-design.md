# Dark/Light Mode Design

**Date:** 2026-02-27

## Approach

`next-themes` + Tailwind `dark:` variants. Light styles are the default (no prefix); dark styles use `dark:`. `next-themes` applies/removes the `dark` class on `<html>` and persists the user's choice to localStorage.

## New Files

| File | Purpose |
|---|---|
| `src/components/layout/theme-provider.tsx` | `'use client'` wrapper around `next-themes` ThemeProvider |
| `src/components/layout/theme-toggle.tsx` | `'use client'` Sun/Moon toggle button using `useTheme()` |

## Modified Files

- `apps/landing/package.json` — add `next-themes`
- `src/app/layout.tsx` — remove `className="dark"`, wrap in ThemeProvider
- `src/components/layout/header.tsx` — add ThemeToggle, update colors
- `src/components/layout/footer.tsx` — update colors
- `src/components/features/scrollspy-nav.tsx` — update colors
- `src/components/mdx/mdx-components.tsx` — update colors
- `src/app/page.tsx` — update colors + dot-grid hero
- `src/app/solutions/cruise-control/page.tsx` — update colors
- `src/app/solutions/autoscaling/page.tsx` — update colors
- `src/app/blog/page.tsx` — update colors
- `src/app/blog/[slug]/page.tsx` — update colors + prose
- `src/app/contact/page.tsx` — update colors
- `src/app/faqs/page.tsx` — update colors
- `src/app/pricing/page.tsx` — update colors

## Color Mapping

| Current (dark-only) | Light default | Dark override |
|---|---|---|
| `bg-zinc-950` | `bg-white` | `dark:bg-zinc-950` |
| `bg-zinc-900` | `bg-zinc-50` | `dark:bg-zinc-900` |
| `bg-black` | `bg-white` | `dark:bg-black` |
| `bg-zinc-800` | `bg-zinc-100` | `dark:bg-zinc-800` |
| `bg-zinc-950/80` | `bg-white/80` | `dark:bg-zinc-950/80` |
| `bg-zinc-900/80` | `bg-white/80` | `dark:bg-zinc-900/80` |
| `text-zinc-100` | `text-zinc-900` | `dark:text-zinc-100` |
| `text-zinc-300` | `text-zinc-700` | `dark:text-zinc-300` |
| `text-zinc-400` | `text-zinc-600` | `dark:text-zinc-400` |
| `text-zinc-500` | `text-zinc-500` | (unchanged) |
| `text-zinc-600` | `text-zinc-500` | `dark:text-zinc-600` |
| `border-zinc-800` | `border-zinc-200` | `dark:border-zinc-800` |
| `border-zinc-700` | `border-zinc-300` | `dark:border-zinc-700` |
| `text-indigo-400` | `text-indigo-600` | `dark:text-indigo-400` |
| `text-white` (on dark bg) | `text-zinc-900` | `dark:text-white` |

## Special Cases

- **Hero dot-grid**: inline style background uses `#3f3f46` (zinc-600) dots — wrap div in a class and use `dark:opacity-100 opacity-30` to soften in light mode
- **Glow blobs** (`bg-indigo-600/20`, `/15`): unchanged — subtle on both
- **Blog prose**: `prose-invert max-w-none` → `prose dark:prose-invert max-w-none`
- **Header mega-dropdown**: `bg-black` → `bg-white dark:bg-black`
- **CTA section**: `bg-zinc-900` card → `bg-zinc-50 dark:bg-zinc-900`

## ThemeProvider Config

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
```

`disableTransitionOnChange` prevents a flash of unstyled transitions when switching.
