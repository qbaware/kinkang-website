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
      { title: 'Private connectivity with Tailscale', href: '/docs/guides/private-connectivity-tailscale' },
      { title: 'Shrinking a cluster', href: '/docs/guides/cluster-shrink' },
    ],
  },
]
