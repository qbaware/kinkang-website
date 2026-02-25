# Design: Navbar Dropdown with Overlay + Font Weight Refresh

**Date:** 2026-02-27
**Status:** Approved

## Context

Following the neon.com-inspired style refresh (Phase 1), this design covers two targeted improvements to `apps/landing`:

1. **Navbar dropdown** — wider panels with link descriptions and a page-dimming overlay, matching neon.com's navigation UX
2. **Font weight refresh** — lighten headings from `font-semibold`/`font-medium` to `font-normal` (weight 400) to match neon.com's clean typographic look

---

## 1. Navbar Dropdown

### Approach

Enhance the existing shadcn/ui `NavigationMenu` in `header.tsx` (Option A — no new primitives, no custom portal). Track open state via Radix's `onValueChange` callback and render a fixed overlay div below the header.

### Changes to `nav-links.ts`

Add `description?: string` to the `NavLink` interface and populate descriptions for all grouped items:

| Group       | Link                  | Description                           |
|-------------|---------------------- |---------------------------------------|
| Solutions   | Kinkang Cruise Control| Automated partition rebalancing        |
| Solutions   | Kinkang Autoscale     | Dynamic broker scaling                |
| Company     | About us              | Meet the team                         |
| Resources   | FAQs                  | Common questions answered             |
| Resources   | Blog                  | Guides and product updates            |

### Changes to `header.tsx`

**Open-state overlay:**
- Add `const [menuOpen, setMenuOpen] = useState(false)`
- Wire `<NavigationMenu value={menuOpen ? undefined : ''} onValueChange={(v) => setMenuOpen(!!v)}>`
- Render a fixed overlay div sibling to the header:
  ```
  <div
    className="fixed inset-x-0 top-16 bottom-0 z-40 bg-zinc-950/80 pointer-events-none transition-opacity duration-200"
    style={{ opacity: menuOpen ? 1 : 0 }}
  />
  ```

**Wider panels with descriptions:**
- Increase panel width from `w-[200px]` to `w-[280px]`
- Each list item renders a two-line layout:
  ```
  <span className="text-sm font-medium text-zinc-100">{link.text}</span>
  {link.description && (
    <span className="text-xs text-zinc-500 mt-0.5">{link.description}</span>
  )}
  ```
- Panel container: `bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl`

**Slide-down animation** (via Radix data attributes):
- Apply to `NavigationMenuContent`:
  ```
  data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2
  data-[state=open]:fade-in-0 duration-150
  ```

---

## 2. Font Weight Refresh

### Goal

Match neon.com's "architectural" look: weight 400 (`font-normal`) for all headings. The tracking and sizing stays.

### Changes across all landing pages

| Current class      | New class       | Applied to        |
|--------------------|-----------------|-------------------|
| `font-semibold`    | `font-normal`   | H1 tags           |
| `font-medium`      | `font-normal`   | H2, H3 tags       |
| `text-lg` (hero p) | `text-xl`       | Hero body paragraph on `/` |

**Affected pages:** `/` (home), `/about`, `/contact`, `/faqs`, `/pricing`, `/blog`, `/blog/[slug]` (if it has headings in the component layer), `/solutions/cruise-control`, `/solutions/autoscaling`

---

## Out of Scope

- Mobile sheet drawer: keep as-is (no overlay for mobile)
- Dashboard app: not touched
- No color changes; zinc-950 + indigo-400 palette unchanged
- No layout restructuring; only typography weights and the dropdown panel

---

## Verification

1. Desktop: opening any nav dropdown dims the page behind the header
2. Overlay disappears when dropdown closes (click away or navigate)
3. Dropdown panels show link title + muted description, width ~280px
4. Slide-down animation plays on open
5. All H1/H2/H3 on landing pages render at `font-normal` (weight 400)
6. Hero paragraph uses `text-xl`
7. `pnpm build` from root passes with zero TypeScript errors
