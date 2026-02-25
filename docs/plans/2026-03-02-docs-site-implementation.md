# Docs Site + Landing Value-Props Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `/docs/...` section to the existing landing app using Velite MDX + a custom sidebar, and update the homepage with concrete value propositions and beneficiary personas.

**Architecture:** Extend Velite with a `docs` collection (pattern `docs/**/*.mdx`). A `[...slug]` catch-all page renders any doc. A `DocsLayout` provides the sticky two-column sidebar. Sidebar nav is defined in a static `docs-nav-config.ts` config file. Syntax highlighting uses `rehype-pretty-code` + `shiki` as a Velite rehype plugin (applied globally — blog benefits too).

**Tech Stack:** Next.js 15 App Router, Velite 0.2, rehype-pretty-code, shiki, Tailwind CSS, next-themes (dark/light)

---

## Task 1: Install `rehype-pretty-code` and `shiki`

**Files:**
- Modify: `apps/landing/package.json`

**Step 1: Install the packages**

Run from the repo root:
```bash
cd apps/landing && pnpm add -D rehype-pretty-code shiki
```

**Step 2: Verify install**

```bash
cat apps/landing/package.json | grep -E "rehype-pretty|shiki"
```
Expected: both packages appear in `devDependencies`.

**Step 3: Commit**

```bash
git add apps/landing/package.json pnpm-lock.yaml
git commit -m "feat(docs): install rehype-pretty-code and shiki for syntax highlighting"
```

---

## Task 2: Update `velite.config.ts` — add docs collection + rehype plugin

**Files:**
- Modify: `apps/landing/velite.config.ts`

**Context:** Velite's `defineConfig` accepts a top-level `mdx` key with `rehypePlugins`. The `docs` collection uses pattern `docs/**/*.mdx`. Slug is derived from `meta.path` by stripping the `docs/` prefix and `.mdx` extension (e.g. `docs/guides/connect-aws-msk.mdx` → `guides/connect-aws-msk`).

**Step 1: Replace `velite.config.ts` with the updated version**

```ts
import { defineConfig, s } from 'velite'
import rehypePrettyCode from 'rehype-pretty-code'

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
      [
        rehypePrettyCode,
        {
          theme: {
            dark: 'github-dark',
            light: 'github-light',
          },
          keepBackground: false,
        },
      ],
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
      pattern: 'docs/**/*.mdx',
      schema: s
        .object({
          title: s.string(),
          description: s.string().optional(),
          body: s.mdx(),
        })
        .transform((data, { meta }) => ({
          ...data,
          // e.g. "docs/guides/connect-aws-msk.mdx" → "guides/connect-aws-msk"
          slug: (meta.path as string).replace(/^docs\//, '').replace(/\.mdx$/, ''),
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
git commit -m "feat(docs): add docs Velite collection and rehype-pretty-code plugin"
```

---

## Task 3: Add syntax highlight CSS to `globals.css`

**Files:**
- Modify: `apps/landing/src/styles/globals.css`

**Context:** `rehype-pretty-code` with dual themes renders both a `[data-theme="light"]` and `[data-theme="dark"]` `<pre>` block. We show/hide them based on the `.dark` class that `next-themes` adds to `<html>`. `keepBackground: false` means we control background via our own CSS.

**Step 1: Append to the end of `globals.css`**

```css
/* ── rehype-pretty-code syntax highlighting ─────────────────────────── */

/* Code block container */
[data-rehype-pretty-code-figure] {
  @apply my-6;
}

/* Light theme pre: visible by default */
[data-rehype-pretty-code-figure] pre[data-theme*="light"] {
  @apply block overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm;
}
/* Dark theme pre: hidden by default */
[data-rehype-pretty-code-figure] pre[data-theme*="dark"] {
  display: none;
}

/* In dark mode: show dark, hide light */
.dark [data-rehype-pretty-code-figure] pre[data-theme*="light"] {
  display: none;
}
.dark [data-rehype-pretty-code-figure] pre[data-theme*="dark"] {
  @apply block overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm;
}

/* Inline code inside a code block — remove the bg added by MDX component override */
[data-rehype-pretty-code-figure] code {
  @apply bg-transparent p-0;
}
```

**Step 2: Commit**

```bash
git add apps/landing/src/styles/globals.css
git commit -m "feat(docs): add CSS for rehype-pretty-code dual-theme code blocks"
```

---

## Task 4: Create `docs-nav-config.ts`

**Files:**
- Create: `apps/landing/src/components/docs/docs-nav-config.ts`

**Step 1: Create the file**

```ts
export interface DocNavItem {
  title: string
  href: string
}

export interface DocNavSection {
  title: string
  items: DocNavItem[]
}

export const docsNav: DocNavSection[] = [
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

**Step 2: Commit**

```bash
git add apps/landing/src/components/docs/docs-nav-config.ts
git commit -m "feat(docs): add docs sidebar nav config"
```

---

## Task 5: Create `DocsSidebar` component

**Files:**
- Create: `apps/landing/src/components/docs/docs-sidebar.tsx`

**Context:** This is a `'use client'` component because it uses `usePathname` to highlight the active link and `useState` for collapsible sections. Each section title is a toggle button; items are shown/hidden. Sections containing the active page start expanded.

**Step 1: Create the file**

```tsx
'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
import { docsNav, type DocNavSection } from './docs-nav-config'

function SidebarSection({
  section,
  currentPath,
}: {
  section: DocNavSection
  currentPath: string
}) {
  const isActive = section.items.some((item) => item.href === currentPath)
  const [open, setOpen] = useState(isActive || true) // default open

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        {section.title}
        <ChevronDown
          className={cn('h-3 w-3 transition-transform duration-150', open && 'rotate-180')}
        />
      </button>

      {open && (
        <ul className="mt-1 space-y-0.5">
          {section.items.map((item) => {
            const active = item.href === currentPath
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'block rounded-md px-3 py-1.5 text-sm transition-colors',
                    active
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  )}
                >
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function DocsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:block w-60 shrink-0 py-12 pr-6">
      <div className="sticky top-24 space-y-4">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Documentation
        </p>
        {docsNav.map((section) => (
          <SidebarSection key={section.title} section={section} currentPath={pathname} />
        ))}
      </div>
    </aside>
  )
}
```

**Step 2: Commit**

```bash
git add apps/landing/src/components/docs/docs-sidebar.tsx
git commit -m "feat(docs): add DocsSidebar client component with active-page highlighting"
```

---

## Task 6: Create `docs/layout.tsx`

**Files:**
- Create: `apps/landing/src/app/docs/layout.tsx`

**Context:** This layout wraps only docs pages. It renders the two-column shell (sidebar + content). The site `<Header>` and `<Footer>` are inherited from the root layout — this just adds the docs-specific inner structure.

**Step 1: Create the file**

```tsx
import { DocsSidebar } from '@/components/docs/docs-sidebar'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto max-w-7xl px-4">
      <div className="flex min-h-[calc(100vh-4rem)] gap-8">
        <DocsSidebar />
        <div className="flex-1 min-w-0 py-12">
          {children}
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add apps/landing/src/app/docs/layout.tsx
git commit -m "feat(docs): add docs layout with two-column sidebar shell"
```

---

## Task 7: Create `docs/page.tsx` (redirect to first page)

**Files:**
- Create: `apps/landing/src/app/docs/page.tsx`

**Context:** `/docs` with no slug should redirect to the first doc page rather than 404. Use Next.js `redirect()`.

**Step 1: Create the file**

```tsx
import { redirect } from 'next/navigation'

export default function DocsIndexPage() {
  redirect('/docs/getting-started/overview')
}
```

**Step 2: Commit**

```bash
git add apps/landing/src/app/docs/page.tsx
git commit -m "feat(docs): redirect /docs to first page"
```

---

## Task 8: Create `docs/[...slug]/page.tsx`

**Files:**
- Create: `apps/landing/src/app/docs/[...slug]/page.tsx`

**Context:** `params.slug` is a string array — e.g. `['getting-started', 'overview']`. Join it with `/` to match the Velite collection slug format. Import from `@/.velite` (the generated Velite output). Use `generateStaticParams` for full SSG.

**Step 1: Create the file**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { docs } from '@/.velite'
import { getMDXComponents, MDXContent } from '@/components/mdx/mdx-components'

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
    <article className="max-w-3xl">
      <div className="prose dark:prose-invert max-w-none">
        <MDXContent code={doc.body} components={getMDXComponents()} />
      </div>
    </article>
  )
}
```

**Step 2: Commit**

```bash
git add "apps/landing/src/app/docs/[...slug]/page.tsx"
git commit -m "feat(docs): add catch-all docs page with SSG"
```

---

## Task 9: Add Docs link to site nav

**Files:**
- Modify: `apps/landing/src/components/layout/nav-links.ts`

**Step 1: Insert the Docs link**

In `headerLinks`, add `{ text: 'Docs', href: '/docs' }` after the Products group and before Pricing:

```ts
export const headerLinks: NavItem[] = [
  {
    text: 'Products',
    links: [
      { text: 'Kinkang Engine', href: '/products/engine', description: 'Automated partition rebalancing' },
      { text: 'Kinkang Autoscale', href: '/products/autoscaling', description: 'Dynamic broker scaling' },
      { text: 'Kinkang AI Balancing', href: '/products/ai-balancing', description: 'Predictive AI-powered balancing' },
    ],
  },
  { text: 'Docs', href: '/docs' },
  { text: 'Pricing', href: '/pricing' },
  {
    text: 'Resources',
    links: [
      { text: 'FAQs', href: '/faqs', description: 'Common questions answered' },
      { text: 'Blog', href: '/blog', description: 'Guides and product updates' },
    ],
  },
  { text: 'Contact', href: '/contact' },
]
```

**Step 2: Commit**

```bash
git add apps/landing/src/components/layout/nav-links.ts
git commit -m "feat(docs): add Docs link to site navigation"
```

---

## Task 10: Write MDX doc pages — Getting Started + Requirements

**Files:**
- Create: `apps/landing/src/content/docs/getting-started/overview.mdx`
- Create: `apps/landing/src/content/docs/requirements/customer-prerequisites.mdx`

**Step 1: Create `getting-started/overview.mdx`**

```mdx
---
title: Overview
description: What Kinkang is, what it manages, and the three pillars of configuration.
---

# Overview

Kinkang is a fully managed service that deploys and operates [Cruise Control](https://github.com/linkedin/cruise-control) for your Kafka clusters. You get automated partition rebalancing, live Cruise Control metrics, and a Grafana dashboard — without running any of that infrastructure yourself.

## What Kinkang manages

- **Cruise Control lifecycle** — deployment, configuration, upgrades, and restarts
- **Partition rebalancing** — scheduled or on-demand, with zero consumer disruption
- **Metrics pipeline** — Cruise Control metrics collected and surfaced via API and Grafana

## The three configuration pillars

Every Kinkang instance is configured around three pillars:

### 1. Connectivity

How Kinkang reaches your Kafka brokers. Options depend on your environment:

| Environment | Method |
|---|---|
| AWS MSK | MSK multi-VPC private connectivity (PrivateLink) |
| Self-managed (cloud) | Direct SASL_SSL; VPN available on request |
| Self-managed (on-prem) | VPN (discussed per case — not offered out of the box) |

See [Connectivity](/docs/configuration/connectivity) for full details.

### 2. Metrics

How Kinkang collects Kafka and Cruise Control metrics:

| Environment | Method |
|---|---|
| AWS MSK | Prometheus (requires open monitoring enabled on MSK) |
| Self-managed (recommended) | Cruise Control metrics reporter → Kafka topic |
| Self-managed (alternative) | Prometheus endpoint |

See [Metrics](/docs/configuration/metrics) for full details.

### 3. Security

All connections use **SASL_SSL**. The SASL mechanism depends on your environment:

| Environment | Mechanism |
|---|---|
| AWS MSK | `AWS_MSK_IAM` |
| Self-managed | `EXTERNAL`, `PLAIN`, or `SCRAM-SHA-256/512` |

mTLS is optional but recommended where supported. See [Security](/docs/configuration/security) for full details.

## Next steps

- Review [Customer prerequisites](/docs/requirements/customer-prerequisites) before onboarding
- Follow the [Connect to AWS MSK](/docs/guides/connect-aws-msk) or [Connect to self-managed Kafka](/docs/guides/connect-self-managed) guide
```

**Step 2: Create `requirements/customer-prerequisites.mdx`**

```mdx
---
title: Customer prerequisites
description: What you need to prepare before connecting your Kafka cluster to Kinkang.
---

# Customer prerequisites

Before Kinkang can be provisioned for your cluster, the following must be in place.

## 1. Metrics endpoint

Cruise Control needs access to Kafka metrics. You must provide one of:

**Option A — Cruise Control metrics reporter topic (recommended for self-managed)**

Configure the [Cruise Control metrics reporter](https://github.com/linkedin/cruise-control#metrics-provider) on each Kafka broker. It publishes metrics to a dedicated Kafka topic (`__CruiseControlMetrics` by default) that Kinkang reads directly. No additional infrastructure required.

```properties
# Add to each broker's server.properties
metric.reporters=com.linkedin.kafka.cruisecontrol.metricsreporter.CruiseControlMetricsReporter
cruise.control.metrics.reporter.bootstrap.servers=<your-bootstrap>:9093
cruise.control.metrics.reporter.security.protocol=SASL_SSL
# ... additional SASL config as appropriate
```

**Option B — Prometheus endpoint (required for AWS MSK, optional for self-managed)**

For AWS MSK, enable [open monitoring](https://docs.aws.amazon.com/msk/latest/developerguide/open-monitoring.html) on your cluster. This exposes a Prometheus-compatible `/metrics` endpoint on each broker at port `11001` (JMX) and `11002` (Node exporter).

For self-managed, expose a Prometheus endpoint accessible from Kinkang's network.

## 2. Network reachability

Kinkang must be able to reach your Kafka brokers:

- **AWS MSK** — enable MSK multi-VPC private connectivity (PrivateLink). See [Connect to AWS MSK](/docs/guides/connect-aws-msk).
- **Self-managed (cloud VPC)** — brokers must be reachable over SASL_SSL. VPN can be arranged if direct connectivity is not possible — contact us.
- **Self-managed (on-prem)** — VPN is required; discuss with the Kinkang team before onboarding.

## 3. TLS certificates (if using mTLS or SASL EXTERNAL)

Certificates must be in **PEM format**:

- **Private key** — PKCS#8 format (begins with `-----BEGIN PRIVATE KEY-----`)
- **Certificate** — X.509 format (begins with `-----BEGIN CERTIFICATE-----`)
- **CA certificate** — the CA that signed the broker certificates

```bash
# Verify your key is PKCS#8
openssl pkey -in client.key -noout -text

# Verify your certificate
openssl x509 -in client.crt -noout -subject -issuer
```

If your key is in PKCS#1 format (`-----BEGIN RSA PRIVATE KEY-----`), convert it:

```bash
openssl pkcs8 -topk8 -nocrypt -in client-pkcs1.key -out client-pkcs8.key
```

> **SASL EXTERNAL and ACLs:** When using `SASL EXTERNAL`, the CN (Common Name) from your client certificate is used as the Kafka principal. Ensure the CN matches the principal you add to Kafka ACLs.

## Summary checklist

- [ ] Metrics: CC metrics reporter topic configured **or** Prometheus endpoint reachable
- [ ] Network: PrivateLink / direct SASL_SSL / VPN in place
- [ ] Certificates (if mTLS/EXTERNAL): PEM format, PKCS#8 key, X.509 cert, CA cert
- [ ] ACLs (if SASL EXTERNAL): CN from client cert added as Kafka principal
```

**Step 3: Commit**

```bash
git add apps/landing/src/content/docs/
git commit -m "feat(docs): add getting-started and requirements doc pages"
```

---

## Task 11: Write MDX doc pages — Configuration

**Files:**
- Create: `apps/landing/src/content/docs/configuration/overview.mdx`
- Create: `apps/landing/src/content/docs/configuration/connectivity.mdx`
- Create: `apps/landing/src/content/docs/configuration/metrics.mdx`
- Create: `apps/landing/src/content/docs/configuration/security.mdx`

**Step 1: Create `configuration/overview.mdx`**

```mdx
---
title: Configuration overview
description: The three pillars of a Kinkang instance — connectivity, metrics, and security.
---

# Configuration overview

A Kinkang instance is configured around three independent pillars. Each pillar has different options depending on whether you are running **AWS MSK** or **self-managed Kafka**.

## Decision matrix

| Pillar | AWS MSK | Self-managed Kafka |
|---|---|---|
| **Connectivity** | MSK PrivateLink (multi-VPC) | Direct SASL_SSL; VPN on request |
| **Metrics** | Prometheus (open monitoring) | CC metrics topic (recommended) or Prometheus |
| **Security / SASL** | `AWS_MSK_IAM` | `EXTERNAL`, `PLAIN`, or `SCRAM` |
| **mTLS** | Optional | Optional (recommended with `EXTERNAL`) |

## Configuration inputs

When onboarding, you provide Kinkang with:

1. **Connectivity details** — bootstrap endpoints, PrivateLink endpoint or IP ranges
2. **Metrics configuration** — Prometheus endpoint or metrics topic name + credentials
3. **Security credentials** — IAM role ARN (MSK) or SASL credentials + certificates (self-managed)

See each pillar's page for the full details:

- [Connectivity](/docs/configuration/connectivity)
- [Metrics](/docs/configuration/metrics)
- [Security](/docs/configuration/security)
```

**Step 2: Create `configuration/connectivity.mdx`**

```mdx
---
title: Connectivity
description: How Kinkang connects to your Kafka brokers — PrivateLink, direct, or VPN.
---

# Connectivity

Kinkang connects to your Kafka cluster's broker endpoints over an encrypted channel. The method depends on your infrastructure.

## AWS MSK — PrivateLink (recommended)

For AWS MSK clusters, Kinkang uses **MSK multi-VPC private connectivity** (powered by AWS PrivateLink). This keeps traffic entirely within the AWS network and does not require opening any inbound ports on your VPC.

### Setup steps

1. Enable multi-VPC private connectivity on your MSK cluster in the AWS console or via the API:

```bash
aws kafka update-connectivity \
  --cluster-arn <your-cluster-arn> \
  --connectivity-info '{"VpcConnectivity":{"ClientAuthentication":{"Sasl":{"Iam":{"Enabled":true}}}}}'
```

2. Share the **VPC connection endpoint** with Kinkang. Kinkang will accept the PrivateLink connection from its AWS account.
3. Provide the broker bootstrap endpoint (format: `b-1.xxx.kafka.us-east-1.amazonaws.com:9098`).

> MSK PrivateLink endpoints use port **9098** for SASL_SSL (IAM auth).

## Self-managed Kafka — Direct SASL_SSL

If your Kafka brokers are reachable over the internet or via a shared cloud network, Kinkang connects directly using SASL_SSL. Ensure:

- Broker listeners are configured for `SASL_SSL`
- The Kinkang IP range is allowed through your security groups / firewall
- TLS certificates are valid (self-signed CA is fine — provide the CA cert to Kinkang)

Provide Kinkang with:
- Bootstrap servers: `<host1>:9093,<host2>:9093,...`
- CA certificate (PEM)

## Self-managed Kafka — VPN

For on-prem clusters or clusters in private networks with no public connectivity, a VPN tunnel can be established between your environment and Kinkang's infrastructure.

> **Note:** VPN connectivity is not offered out of the box. If your cluster requires a VPN, contact the Kinkang team before onboarding to discuss feasibility and setup requirements.
```

**Step 3: Create `configuration/metrics.mdx`**

```mdx
---
title: Metrics
description: How Kinkang collects Kafka and Cruise Control metrics from your cluster.
---

# Metrics

Cruise Control requires access to Kafka metrics to generate accurate rebalancing proposals. Kinkang supports two collection methods.

## Option A — Cruise Control metrics reporter topic (self-managed, recommended)

The **CC metrics reporter** is a Kafka plugin that runs on each broker and publishes metrics to a dedicated internal topic (`__CruiseControlMetrics` by default). Kinkang reads from this topic.

This is the recommended method for self-managed clusters because it requires no additional infrastructure — the metrics flow through Kafka itself.

### Broker configuration

Add to each broker's `server.properties`:

```properties
metric.reporters=com.linkedin.kafka.cruisecontrol.metricsreporter.CruiseControlMetricsReporter
cruise.control.metrics.reporter.bootstrap.servers=<bootstrap>:9093
cruise.control.metrics.reporter.security.protocol=SASL_SSL
cruise.control.metrics.reporter.ssl.truststore.location=/etc/kafka/ssl/truststore.jks
cruise.control.metrics.reporter.ssl.truststore.password=<password>
# Add SASL config matching your chosen mechanism (PLAIN, SCRAM, EXTERNAL)
```

After a rolling restart, verify the topic exists:

```bash
kafka-topics.sh --bootstrap-server <bootstrap>:9093 --list | grep CruiseControl
```

## Option B — Prometheus (required for AWS MSK, optional for self-managed)

Kinkang scrapes a Prometheus-compatible metrics endpoint on each broker.

### AWS MSK

Enable [open monitoring](https://docs.aws.amazon.com/msk/latest/developerguide/open-monitoring.html) on your MSK cluster:

```bash
aws kafka update-monitoring \
  --cluster-arn <cluster-arn> \
  --current-version <cluster-version> \
  --open-monitoring '{"Prometheus":{"JmxExporter":{"EnabledInBroker":true},"NodeExporter":{"EnabledInBroker":true}}}'
```

This exposes metrics on each broker at:
- Port `11001` — JMX metrics
- Port `11002` — Node exporter metrics

Kinkang must be able to reach these ports from its network. With PrivateLink in place, this is handled automatically.

### Self-managed

Expose a Prometheus endpoint (e.g. via [JMX exporter](https://github.com/prometheus/jmx_exporter)) reachable from Kinkang's IP range. Provide Kinkang with the scrape endpoint URL and any required authentication.
```

**Step 4: Create `configuration/security.mdx`**

```mdx
---
title: Security
description: SASL_SSL, SASL mechanisms, mTLS, and certificate requirements.
---

# Security

All connections between Kinkang and your Kafka cluster use **SASL_SSL** — TLS encryption is mandatory. The specific SASL mechanism depends on your environment and preferences.

## SASL mechanisms

### `AWS_MSK_IAM` — AWS MSK only

Kinkang authenticates using an AWS IAM role. This is the standard mechanism for MSK and requires no certificates.

You provide:
- An IAM role ARN that Kinkang can assume
- The role must have `kafka-cluster:*` permissions on your MSK cluster

```json
{
  "Effect": "Allow",
  "Action": "kafka-cluster:*",
  "Resource": "arn:aws:kafka:us-east-1:<account>:cluster/<name>/*"
}
```

### `SASL EXTERNAL` — self-managed with mTLS (recommended)

Uses the client's TLS certificate as the authentication credential. The **CN (Common Name)** of the client certificate is used as the Kafka principal for ACL enforcement.

Example: a client certificate with CN `kinkang-client` must have a corresponding ACL entry:

```bash
kafka-acls.sh --bootstrap-server <bootstrap>:9093 \
  --add --allow-principal User:kinkang-client \
  --operation All --topic '*' --group '*'
```

Requires mTLS to be enabled on the broker listener.

### `PLAIN` — self-managed

Username/password authentication. Simple to configure, widely supported.

```properties
# broker listener config
listener.name.sasl_ssl.plain.sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required \
  username="admin" \
  password="admin-secret" \
  user_kinkang="kinkang-secret";
```

You provide: username and password for the Kinkang service account.

### `SCRAM-SHA-256` / `SCRAM-SHA-512` — self-managed

Salted challenge-response auth. More secure than PLAIN as credentials are never sent in plaintext.

```bash
# Create the Kinkang SCRAM credential
kafka-configs.sh --bootstrap-server <bootstrap>:9093 \
  --alter --add-config 'SCRAM-SHA-256=[password=kinkang-secret]' \
  --entity-type users --entity-name kinkang
```

You provide: username and password.

## mTLS (mutual TLS)

mTLS adds a second layer of authentication at the TLS level — both sides present certificates. It is **optional** but **recommended**, especially when using `SASL EXTERNAL`.

To enable mTLS:

1. Configure the broker to require client certificates on the `SASL_SSL` listener:

```properties
# server.properties
ssl.client.auth=required
ssl.truststore.location=/etc/kafka/ssl/ca-truststore.jks
ssl.truststore.password=<password>
```

2. Provide Kinkang with:
   - Client certificate (PEM, X.509 format)
   - Client private key (PEM, PKCS#8 format)
   - CA certificate (PEM)

## Certificate format requirements

All certificates must be in **PEM format**:

| File | Format | Header |
|---|---|---|
| Private key | PKCS#8 | `-----BEGIN PRIVATE KEY-----` |
| Certificate | X.509 | `-----BEGIN CERTIFICATE-----` |
| CA cert | X.509 | `-----BEGIN CERTIFICATE-----` |

To convert a PKCS#1 key to PKCS#8:

```bash
openssl pkcs8 -topk8 -nocrypt -in client.key -out client-pkcs8.key
```

To verify certificate details:

```bash
openssl x509 -in client.crt -noout -subject -issuer -dates
```
```

**Step 5: Commit**

```bash
git add apps/landing/src/content/docs/configuration/
git commit -m "feat(docs): add configuration doc pages (overview, connectivity, metrics, security)"
```

---

## Task 12: Write MDX doc pages — Guides

**Files:**
- Create: `apps/landing/src/content/docs/guides/connect-aws-msk.mdx`
- Create: `apps/landing/src/content/docs/guides/connect-self-managed.mdx`

**Step 1: Create `guides/connect-aws-msk.mdx`**

```mdx
---
title: Connect to AWS MSK
description: Step-by-step guide to connecting Kinkang to an AWS MSK cluster via PrivateLink and AWS_MSK_IAM.
---

# Connect to AWS MSK

This guide walks through connecting Kinkang to an **AWS MSK** cluster using:
- **Connectivity:** MSK multi-VPC private connectivity (PrivateLink)
- **Metrics:** Prometheus via open monitoring
- **Security:** SASL_SSL with `AWS_MSK_IAM`

## Prerequisites

- An MSK cluster running Kafka 2.8 or later
- AWS CLI configured with permissions to modify the MSK cluster
- The MSK cluster's ARN and current version (from the AWS console or `aws kafka describe-cluster`)

## Step 1 — Enable open monitoring (Prometheus metrics)

```bash
# Get current cluster version first
CLUSTER_VERSION=$(aws kafka describe-cluster \
  --cluster-arn <cluster-arn> \
  --query 'ClusterInfo.CurrentVersion' \
  --output text)

aws kafka update-monitoring \
  --cluster-arn <cluster-arn> \
  --current-version $CLUSTER_VERSION \
  --open-monitoring '{"Prometheus":{"JmxExporter":{"EnabledInBroker":true},"NodeExporter":{"EnabledInBroker":true}}}'
```

Wait for the cluster to reach `ACTIVE` state before proceeding.

## Step 2 — Enable multi-VPC private connectivity

```bash
CLUSTER_VERSION=$(aws kafka describe-cluster \
  --cluster-arn <cluster-arn> \
  --query 'ClusterInfo.CurrentVersion' \
  --output text)

aws kafka update-connectivity \
  --cluster-arn <cluster-arn> \
  --current-version $CLUSTER_VERSION \
  --connectivity-info '{
    "VpcConnectivity": {
      "ClientAuthentication": {
        "Sasl": {
          "Iam": { "Enabled": true }
        }
      }
    }
  }'
```

After the update completes, the cluster will have per-broker PrivateLink endpoints. Retrieve them:

```bash
aws kafka get-bootstrap-brokers --cluster-arn <cluster-arn>
```

Note the `BootstrapBrokerStringSaslIam` value — you will provide this to Kinkang.

## Step 3 — Create an IAM policy and role for Kinkang

Create a policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "kafka-cluster:*",
      "Resource": [
        "arn:aws:kafka:<region>:<account>:cluster/<cluster-name>/*",
        "arn:aws:kafka:<region>:<account>:topic/<cluster-name>/*/*",
        "arn:aws:kafka:<region>:<account>:group/<cluster-name>/*/*"
      ]
    }
  ]
}
```

```bash
aws iam create-policy \
  --policy-name KinkangMSKAccess \
  --policy-document file://kinkang-msk-policy.json
```

Create a role with a trust policy that allows Kinkang's AWS account to assume it. Kinkang will provide you with its AWS account ID and external ID during onboarding:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::<kinkang-account-id>:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "<provided-by-kinkang>"
        }
      }
    }
  ]
}
```

```bash
aws iam create-role \
  --role-name KinkangRole \
  --assume-role-policy-document file://kinkang-trust-policy.json

aws iam attach-role-policy \
  --role-name KinkangRole \
  --policy-arn arn:aws:iam::<account>:policy/KinkangMSKAccess
```

## Step 4 — Provide connection details to Kinkang

Share the following with the Kinkang team:

| Field | Value |
|---|---|
| Bootstrap endpoint | `BootstrapBrokerStringSaslIam` from Step 2 |
| AWS Region | e.g. `us-east-1` |
| IAM Role ARN | ARN of the role created in Step 3 |
| Prometheus ports | `11001` (JMX), `11002` (node) — confirmed in Step 1 |

Kinkang will accept the PrivateLink connection request from the AWS console on your behalf once the VPC connection is initiated.
```

**Step 2: Create `guides/connect-self-managed.mdx`**

```mdx
---
title: Connect to self-managed Kafka
description: Step-by-step guide for SASL_SSL with SASL EXTERNAL, mTLS, and Cruise Control metrics topic.
---

# Connect to self-managed Kafka

This guide uses the recommended configuration for self-managed Kafka:
- **Connectivity:** Direct SASL_SSL
- **Metrics:** Cruise Control metrics reporter topic
- **Security:** SASL_SSL + `SASL EXTERNAL` + mTLS

If you prefer `PLAIN` or `SCRAM`, the connectivity and metrics steps are the same — only the SASL configuration differs. See [Security](/docs/configuration/security) for those variants.

## Prerequisites

- Kafka cluster with brokers reachable over the network from Kinkang (or VPN arranged in advance)
- Ability to perform a rolling broker restart to apply configuration changes
- A CA certificate and the ability to issue client certificates from it

## Step 1 — Configure the SASL_SSL listener

Add or update a `SASL_SSL` listener on each broker. Example `server.properties` snippet:

```properties
listeners=SASL_SSL://:9093
advertised.listeners=SASL_SSL://<broker-hostname>:9093
listener.security.protocol.map=SASL_SSL:SASL_SSL

# TLS
ssl.keystore.location=/etc/kafka/ssl/broker.keystore.jks
ssl.keystore.password=<keystore-password>
ssl.key.password=<key-password>
ssl.truststore.location=/etc/kafka/ssl/ca.truststore.jks
ssl.truststore.password=<truststore-password>
ssl.client.auth=required

# SASL
sasl.enabled.mechanisms=EXTERNAL
sasl.mechanism.inter.broker.protocol=EXTERNAL
```

> Setting `ssl.client.auth=required` enables mTLS — brokers will require a client certificate from Kinkang.

## Step 2 — Issue a client certificate for Kinkang

Generate a private key and CSR:

```bash
# Generate PKCS#8 private key
openssl genpkey -algorithm RSA -out kinkang-client.key

# Create CSR — set CN to the Kafka principal Kinkang will use
openssl req -new -key kinkang-client.key \
  -subj "/CN=kinkang-client/O=Kinkang" \
  -out kinkang-client.csr
```

Sign with your CA:

```bash
openssl x509 -req -in kinkang-client.csr \
  -CA ca.crt -CAkey ca.key -CAcreateserial \
  -days 365 -out kinkang-client.crt
```

Verify:

```bash
openssl x509 -in kinkang-client.crt -noout -subject -issuer
# Expected: subject=CN=kinkang-client, O=Kinkang
```

## Step 3 — Add Kafka ACLs for the Kinkang principal

The CN from Step 2 (`kinkang-client`) becomes the Kafka principal:

```bash
# Allow Kinkang to describe and read all topics (for CC metrics)
kafka-acls.sh --bootstrap-server <bootstrap>:9093 \
  --add --allow-principal User:kinkang-client \
  --operation Describe --operation Read \
  --topic '*' --group '*'

# Allow Kinkang to read the CC metrics topic
kafka-acls.sh --bootstrap-server <bootstrap>:9093 \
  --add --allow-principal User:kinkang-client \
  --operation Read \
  --topic __CruiseControlMetrics
```

## Step 4 — Enable the Cruise Control metrics reporter

Add to each broker's `server.properties`:

```properties
metric.reporters=com.linkedin.kafka.cruisecontrol.metricsreporter.CruiseControlMetricsReporter
cruise.control.metrics.reporter.bootstrap.servers=<bootstrap>:9093
cruise.control.metrics.reporter.security.protocol=SASL_SSL
cruise.control.metrics.reporter.sasl.mechanism=EXTERNAL
cruise.control.metrics.reporter.ssl.keystore.location=/etc/kafka/ssl/reporter.keystore.jks
cruise.control.metrics.reporter.ssl.keystore.password=<password>
cruise.control.metrics.reporter.ssl.truststore.location=/etc/kafka/ssl/ca.truststore.jks
cruise.control.metrics.reporter.ssl.truststore.password=<password>
```

Perform a rolling restart. After restart, verify the metrics topic was created:

```bash
kafka-topics.sh --bootstrap-server <bootstrap>:9093 \
  --command-config client.properties --list | grep CruiseControl
# Expected: __CruiseControlMetrics
```

## Step 5 — Provide connection details to Kinkang

Share the following with the Kinkang team:

| Field | Value |
|---|---|
| Bootstrap servers | `<host1>:9093,<host2>:9093,...` |
| CA certificate | PEM file (the CA that signed broker certs) |
| Client certificate | `kinkang-client.crt` (PEM, X.509) |
| Client private key | `kinkang-client.key` (PEM, PKCS#8) |
| Metrics topic | `__CruiseControlMetrics` (or custom name if changed) |
| SASL mechanism | `EXTERNAL` |

## VPN note

If your brokers are in a private network not reachable over the public internet, please contact the Kinkang team **before** starting this process to discuss VPN setup. VPN connectivity is available but requires advance coordination and is not provisioned automatically.
```

**Step 3: Commit**

```bash
git add apps/landing/src/content/docs/guides/
git commit -m "feat(docs): add AWS MSK and self-managed Kafka connection guides"
```

---

## Task 13: Update homepage — value propositions and beneficiary personas

**Files:**
- Modify: `apps/landing/src/app/page.tsx`

**Context:** Add two new sections between the features section and the CTA:
1. **"What you get"** — concrete deliverables list (managed CC, metrics API, Grafana, reduced toil, incident prevention)
2. **"Built for your team"** — two beneficiary cards (MSK users, self-managed teams)

Also update the hero subtitle and features descriptions to lean into outcomes.

**Step 1: Update hero subtitle**

Change line:
```tsx
<p className="mx-auto mt-6 max-w-2xl text-xl text-zinc-600 dark:text-zinc-400">
  Kinkang takes the complexity out of managing Apache Kafka clusters with Cruise Control.
  Focus on building your product while we handle the infrastructure.
</p>
```

To:
```tsx
<p className="mx-auto mt-6 max-w-2xl text-xl text-zinc-600 dark:text-zinc-400">
  Kinkang deploys and operates Cruise Control for your Kafka clusters — keeping partitions
  balanced, brokers healthy, and incidents off your on-call calendar.
</p>
```

**Step 2: Add imports for new icons**

In the imports at the top of `page.tsx`, add `DollarSign, CheckCircle2, Users` to the lucide import list:

```tsx
import { ArrowRight, Shield, Zap, BarChart3, Server, Activity, AlertTriangle, DollarSign, CheckCircle2, Users } from 'lucide-react'
```

**Step 3: Add "What you get" section after the Features section closing `</section>` tag and before the CTA section**

```tsx
{/* What you get */}
<section className="border-t border-zinc-200 dark:border-zinc-800 py-24">
  <div className="container mx-auto max-w-6xl px-4">
    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          What you get
        </p>
        <h2 className="mt-2 text-3xl font-normal tracking-[-0.03em] sm:text-4xl">
          Managed Kafka ops.{' '}
          <span className="text-zinc-400">Measurable results.</span>
        </h2>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          Every Kinkang instance ships with a full set of tools and guarantees — not just a running process.
        </p>
      </div>
      <ul className="space-y-4">
        {[
          {
            icon: CheckCircle2,
            title: 'Fully managed Cruise Control',
            description: 'Deployed, configured, upgraded, and restarted by Kinkang. No YAML to write, no JVM to tune.',
          },
          {
            icon: BarChart3,
            title: 'Cruise Control metrics API',
            description: 'Query CC metrics programmatically for custom tooling, dashboards, and integrations.',
          },
          {
            icon: Activity,
            title: 'Grafana dashboard',
            description: 'Live visibility into cluster health, partition distribution, and Cruise Control status — out of the box.',
          },
          {
            icon: DollarSign,
            title: 'Fewer incidents, lower costs',
            description: 'Proactive rebalancing prevents broker overload before it cascades into consumer lag, data loss, or an outage. The saved headaches and customer frustration are priceless.',
          },
        ].map((item) => (
          <li key={item.title} className="flex gap-4">
            <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.title}</p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
</section>

{/* Built for your team */}
<section className="border-t border-zinc-200 dark:border-zinc-800 py-24">
  <div className="container mx-auto max-w-6xl px-4">
    <div className="mb-12 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
        Who it's for
      </p>
      <h2 className="mt-2 text-3xl font-normal tracking-[-0.03em] sm:text-4xl">
        Built for the teams Kafka taxes most.
      </h2>
    </div>
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-8">
        <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        <h3 className="mt-4 text-xl font-medium text-zinc-900 dark:text-zinc-100">AWS MSK teams</h3>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          MSK manages your brokers. But partition rebalancing, Cruise Control, and performance tuning are still on you. Kinkang adds the missing ops layer — making MSK actually fully managed.
        </p>
        <p className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          Stop paying for MSK's convenience while absorbing its ops cost.
        </p>
      </div>
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-8">
        <Server className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        <h3 className="mt-4 text-xl font-medium text-zinc-900 dark:text-zinc-100">Self-managed Kafka teams</h3>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Running your own Kafka means owning every failure. Kinkang handles partition balance, health monitoring, and incident prevention — so you ship features instead of writing runbooks.
        </p>
        <p className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          Skip the dedicated Kafka SRE hire. Let Kinkang carry the ops weight.
        </p>
      </div>
    </div>
  </div>
</section>
```

**Step 4: Verify the page compiles**

```bash
cd apps/landing && pnpm check-types
```

**Step 5: Commit**

```bash
git add apps/landing/src/app/page.tsx
git commit -m "feat(landing): add value-prop and beneficiary sections to homepage"
```

---

## Task 14: Visual verification

**Step 1: Start the dev server**

```bash
cd apps/landing && pnpm dev
```

**Step 2: Check all pages load correctly**

- `http://localhost:3000/docs` → redirects to `/docs/getting-started/overview` ✓
- `http://localhost:3000/docs/getting-started/overview` → sidebar visible, content renders ✓
- `http://localhost:3000/docs/guides/connect-aws-msk` → code blocks syntax-highlighted ✓
- `http://localhost:3000/docs/guides/connect-self-managed` → code blocks syntax-highlighted ✓
- Dark mode toggle → code blocks switch themes ✓
- `http://localhost:3000` → new "What you get" and "Built for your team" sections visible ✓
- Sidebar active state: clicking a link highlights it correctly ✓
- Nav bar: "Docs" link visible, routes to `/docs` ✓

**Step 3: Check for TypeScript errors**

```bash
cd apps/landing && pnpm check-types
```

Expected: no errors.
