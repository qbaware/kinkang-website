# Design: Neon.com-style Feature Grid Separators

**Date:** 2026-02-27
**File:** `apps/landing/src/app/page.tsx`

## Problem

The feature cards in each section use a full card treatment: rounded corners, a dark background (`bg-zinc-900`), and a full border box (`border border-zinc-800`). The desired look — inspired by neon.com — uses thin separator lines between cells on a transparent background, which is cleaner and more minimal.

## Chosen Approach: Border-per-cell (Option A)

Replace card styling with thin cell dividers using Tailwind border utilities.

### Changes to each feature grid (`mt-8 grid gap-5 sm:grid-cols-2`)

- Remove `gap-5` (cells are now flush, separated only by the border line)
- Add `border-t border-b border-zinc-800` to the grid wrapper

### Changes to each feature item

**Remove:**
- `rounded-xl`
- `border border-zinc-800`
- `bg-zinc-900`
- `transition-colors hover:border-zinc-700`

**Add:**
- `border-r border-zinc-800` on the **first** item only (creates vertical divider)
- `pr-8` on the first item, `pl-8` on the second item (padding around the divider)
- Keep existing `p-6` padding as base, adjusted per side

### Result

```
─────────────────────────────────────────────
  [icon]                  │  [icon]
  Title                   │  Title
  Description             │  Description
─────────────────────────────────────────────
```

## What Stays the Same

- Grid layout (`sm:grid-cols-2`)
- Icon container (`bg-indigo-500/10`, `text-indigo-400`)
- Typography and spacing inside each cell
- `mt-8` gap between section header and feature grid
