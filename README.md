# Kinkang Website

Monorepo for the [Kinkang](https://kinkang.cloud) marketing site and client dashboard. Kinkang is a managed Kafka / Cruise Control service.

## Structure

```
kinkang-website/
├── apps/
│   ├── landing/      → Marketing site (kinkang.cloud)
│   └── dashboard/    → Client dashboard (dashboard.kinkang.cloud)
├── packages/
│   ├── ui/               → Shared shadcn/ui components
│   ├── tailwind-config/  → Shared Tailwind theme & brand colors
│   └── typescript-config/ → Shared tsconfig bases
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + shadcn/ui (new-york style)
- **Content (MDX):** Velite with Zod schemas
- **Auth:** Clerk (`@clerk/nextjs`) — dashboard only
- **Contact form:** Web3Forms
- **Build:** Turborepo
- **Deployment:** Two separate Vercel projects from one repo

## Getting Started

```bash
# Install dependencies
pnpm install

# Run all apps in development
pnpm dev

# Build all apps
pnpm build
```

## Apps

### Landing (`apps/landing`)

Static marketing site with pages for home, about, pricing, blog, docs, FAQs, product/solution pages, and legal. Content is managed via MDX files processed by Velite.

### Dashboard (`apps/dashboard`)

Client-facing dashboard protected by Clerk authentication. Covers cluster management, settings, and billing.

## Packages

| Package | Description |
|---|---|
| `@workspace/ui` | Shared React components built on shadcn/ui |
| `@workspace/tailwind-config` | Shared Tailwind config with Kinkang brand tokens |
| `@workspace/typescript-config` | Shared TypeScript configuration bases |
