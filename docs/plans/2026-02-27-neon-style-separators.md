# Neon-style Feature Grid Separators Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the rounded card styling on feature grid items with neon.com-style thin cell separator lines.

**Architecture:** Single-file change in `apps/landing/src/app/page.tsx`. The feature grid wrapper gains top/bottom borders; each feature item loses its card treatment and the left item gains a right border to act as the vertical divider.

**Tech Stack:** Next.js, Tailwind CSS, TypeScript

---

### Task 1: Update the feature grid in `page.tsx`

**Files:**
- Modify: `apps/landing/src/app/page.tsx` (the `mt-8 grid` wrapper and each feature item inside `section.features.map`)

**Step 1: Remove `gap-5` from the grid wrapper and add top/bottom borders**

Find:
```tsx
<div className="mt-8 grid gap-5 sm:grid-cols-2">
```

Replace with:
```tsx
<div className="mt-8 grid sm:grid-cols-2 border-t border-b border-zinc-800">
```

**Step 2: Replace card styling on each feature item with cell styling**

Find:
```tsx
<div
  key={feature.title}
  className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-700"
>
```

Replace with (note: we need to distinguish first vs second item — use array index):

Change the map to use index:
```tsx
{section.features.map((feature, i) => (
  <div
    key={feature.title}
    className={`p-8 ${i === 0 ? 'border-r border-zinc-800' : ''}`}
  >
```

**Step 3: Start the dev server and visually verify**

Run:
```bash
cd /Users/danielgospodinow/Projects/kinkang-website && pnpm --filter landing dev
```

Open `http://localhost:3000` and confirm:
- Each feature section shows two items separated by a single thin vertical line
- Top and bottom of each feature pair are bounded by a thin horizontal line
- No rounded corners, no card background, no hover border effect
- Icon, title, and description still render correctly

**Step 4: Commit**

```bash
git add apps/landing/src/app/page.tsx
git commit -m "feat: replace feature cards with neon-style cell separators"
```
