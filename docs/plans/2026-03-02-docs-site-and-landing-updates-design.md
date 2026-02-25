# Design: Docs Site + Landing Page Value-Prop Updates

**Date:** 2026-03-02
**Status:** Approved

---

## Overview

Two parallel workstreams:

1. **Docs site** — add a `/docs/...` section to the existing Next.js landing app, powered by Velite MDX, with a sticky collapsible sidebar and syntax-highlighted code blocks.
2. **Landing page updates** — add concrete value propositions (deliverables, beneficiary personas, cost/incident-reduction messaging) to the homepage.

---

## 1. Docs Site

### Approach

Extend the existing Velite setup (already used for blog + legal). No new frameworks. A `docs` collection is added to `velite.config.ts`; MDX files live in `src/content/docs/`; a custom docs layout with a sidebar is added at `src/app/docs/layout.tsx`.

### Route & File Structure

```
apps/landing/src/
├── app/
│   └── docs/
│       ├── layout.tsx                  — DocsLayout (sidebar + content area)
│       ├── page.tsx                    — /docs → redirect to first page
│       └── [...slug]/
│           └── page.tsx                — renders any /docs/a/b/c
│
├── content/docs/
│   ├── getting-started/
│   │   └── overview.mdx
│   ├── requirements/
│   │   └── customer-prerequisites.mdx
│   ├── configuration/
│   │   ├── overview.mdx
│   │   ├── connectivity.mdx
│   │   ├── metrics.mdx
│   │   └── security.mdx
│   └── guides/
│       ├── connect-aws-msk.mdx
│       └── connect-self-managed.mdx
│
└── components/docs/
    ├── docs-sidebar.tsx                — client component, expandable sections
    └── docs-nav-config.ts             — sidebar nav tree definition
```

### Velite Collection

Add to `velite.config.ts`:

```ts
const docs = defineCollection({
  name: 'Doc',
  pattern: 'docs/**/*.mdx',
  schema: s.object({
    title: s.string(),
    description: s.string().optional(),
    body: s.mdx(),
  }).transform((data, { meta }) => ({
    ...data,
    slug: meta.path.replace(/^docs\//, '').replace(/\.mdx$/, ''),
  })),
})
```

Slug examples:
- `docs/getting-started/overview.mdx` → `getting-started/overview`
- `docs/guides/connect-aws-msk.mdx` → `guides/connect-aws-msk`

### Sidebar Nav Config

```ts
// src/components/docs/docs-nav-config.ts
export const docsNav = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Overview', href: '/docs/getting-started/overview' },
    ],
  },
  {
    title: 'Requirements',
    items: [
      { title: 'Customer prerequisites', href: '/docs/requirements/customer-prerequisites' },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { title: 'Overview', href: '/docs/configuration/overview' },
      { title: 'Connectivity', href: '/docs/configuration/connectivity' },
      { title: 'Metrics', href: '/docs/configuration/metrics' },
      { title: 'Security', href: '/docs/configuration/security' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { title: 'Connect to AWS MSK', href: '/docs/guides/connect-aws-msk' },
      { title: 'Connect to self-managed Kafka', href: '/docs/guides/connect-self-managed' },
    ],
  },
]
```

Sections are always rendered; each section label acts as a toggle to expand/collapse its items (client-side useState). Active page item is highlighted with indigo accent. Sidebar is sticky on desktop, collapsed on mobile.

### Layout

Three-region layout on `≥ lg`:

```
[site header — inherited from root layout]
┌──────────────┬──────────────────────────────┐
│ Sidebar      │ MDX prose content             │
│ ~256px       │ max-w-3xl                     │
│ sticky top   │                               │
│              │ # Title                       │
│ Getting      │ intro paragraph...            │
│  Started     │                               │
│  Overview ●  │ ```bash                       │
│              │ openssl req ...               │
│ Configuration│ ```                           │
│  Connectivity│                               │
│  Metrics     │                               │
│  Security    │                               │
│              │                               │
│ Guides       │                               │
│  MSK         │                               │
│  Self-managed│                               │
└──────────────┴──────────────────────────────┘
```

On mobile: sidebar becomes a `<details>` or drawer above the content.

The docs layout does NOT render the marketing footer or CTA sections — just the site header and the two-column docs shell.

### Syntax Highlighting

Use `rehype-pretty-code` (with `shiki`) as a Velite rehype plugin. Already available via Velite's rehype pipeline. Styled to match the site's dark/light theme — dark code blocks in dark mode, light in light mode.

### Navigation Link

Add `{ text: 'Docs', href: '/docs' }` to `headerLinks` in `nav-links.ts`, placed after Products and before Pricing.

---

## 2. Doc Pages Content

### `getting-started/overview.mdx`
- What Kinkang is and what it manages
- The three configuration pillars: Connectivity, Metrics, Security
- Links to guides

### `requirements/customer-prerequisites.mdx`
- Prometheus endpoint OR Cruise Control metrics exporter topic must be available
- PEM certificate format: PKCS8 private key + X.509 certificate (for mTLS / SASL EXTERNAL)
- Network accessibility (PrivateLink for MSK, direct for self-managed, optional VPN)

### `configuration/overview.mdx`
- The three pillars explained at a high level
- Decision matrix: MSK vs self-managed → which options apply

### `configuration/connectivity.mdx`
- **AWS MSK**: MSK multi-VPC private connectivity (PrivateLink) — primary method
- **Self-managed**: Direct SASL_SSL; optional VPN if cluster is not publicly reachable (not offered out of the box — must be agreed per case)
- Public connectivity: supported where allowed by customer network policy

### `configuration/metrics.mdx`
- **AWS MSK (open monitoring enabled)**: Prometheus scrapes Kafka metrics directly
- **Self-managed (recommended)**: CC metrics reporter → Kafka topic (zero extra infrastructure)
- **Self-managed (alternative)**: Prometheus endpoint

### `configuration/security.mdx`
- SASL_SSL is mandatory for all connections
- SASL mechanisms:
  - `AWS_MSK_IAM` — MSK only
  - `EXTERNAL` — use with mTLS; client cert CN used as Kafka principal for ACLs
  - `PLAIN` — username/password; self-managed only
  - `SCRAM-SHA-256/512` — self-managed only
- Optional mTLS (recommended where supported): mutual TLS adds an additional auth layer
- Certificate format: PEM with PKCS8 private key and X.509 certificate
- SASL EXTERNAL + mTLS: client cert's CN becomes the Kafka principal used in ACLs

### `guides/connect-aws-msk.mdx`
Step-by-step:
1. Enable MSK multi-VPC private connectivity (PrivateLink) on your MSK cluster
2. Share the PrivateLink endpoint with Kinkang
3. Enable open monitoring (Prometheus) on the MSK cluster
4. Configure IAM policy for `AWS_MSK_IAM` SASL auth
5. Provide Kinkang with: cluster bootstrap endpoint, AWS region, IAM role ARN

### `guides/connect-self-managed.mdx`
Step-by-step (SASL_SSL + EXTERNAL + mTLS path):
1. Configure Kafka listeners for `SASL_SSL`
2. Set SASL mechanism to `SASL EXTERNAL`
3. Generate/provide PEM client certificate (PKCS8 key + X.509 cert)
4. Add CN from client cert to Kafka ACLs
5. Enable CC metrics reporter → topic (recommended) or expose Prometheus endpoint
6. VPN note: if cluster is not reachable over public internet or PrivateLink, contact us to discuss VPN setup

---

## 3. Landing Page Updates

### Value Proposition Section (new section below features)

A tight "What you get" block listing concrete deliverables:
- Fully managed Cruise Control — deployed, configured, upgraded by Kinkang
- Access to Cruise Control metrics API for custom tooling and integrations
- Grafana dashboard for live cluster health and CC status
- Reduced ops toil: no more Kafka SRE runbooks
- Fewer incidents: proactive rebalancing prevents broker overload before it impacts consumers
- Saved engineering cost: no need to hire a dedicated Kafka SRE

### Beneficiary Section (new section)

Two clear personas:

**AWS MSK users**
> MSK manages your brokers. Kinkang adds the rebalancing layer MSK is missing — making it actually fully managed.

**Self-managed Kafka teams**
> Skip the dedicated Kafka SRE. Kinkang handles partition balance, health monitoring, and incident prevention so your team ships features instead of fighting ops fires.

### Hero / Feature Copy Adjustments

- Hero subtext to lean into: "prevented incidents = saved money and customer frustration"
- Feature descriptions tightened to emphasize outcomes (stability, cost savings) not just capabilities

---

## Implementation Order

1. Install `rehype-pretty-code` + `shiki` dev dependencies
2. Add `docs` Velite collection + update `velite.config.ts`
3. Create `docs-nav-config.ts`
4. Create `DocsSidebar` component
5. Create `src/app/docs/layout.tsx`
6. Create `src/app/docs/page.tsx` (redirect)
7. Create `src/app/docs/[...slug]/page.tsx`
8. Write all 8 MDX doc pages
9. Add Docs link to site header nav
10. Update `src/app/page.tsx` with value-prop + beneficiary sections
