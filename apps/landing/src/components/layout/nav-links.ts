export interface NavLink {
  text: string
  href: string
  description?: string
}

export interface NavGroup {
  text: string
  links: NavLink[]
}

export type NavItem = NavLink | NavGroup

export function isNavGroup(item: NavItem): item is NavGroup {
  return 'links' in item
}

export const headerLinks: NavItem[] = [
  {
    text: 'Products',
    links: [
      { text: 'Kinkang Engine', href: '/products/engine', description: 'Automated partition rebalancing' },
      { text: 'Kinkang Autoscale', href: '/products/autoscaling', description: 'Dynamic broker scaling' },
      { text: 'Kinkang AI', href: '/products/ai-balancing', description: 'AI-powered Kafka management' },
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

export interface FooterLinkGroup {
  title: string
  links: NavLink[]
}

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: 'Product',
    links: [
      { text: 'Features', href: '/' },
      { text: 'Security', href: '#' },
      { text: 'Enterprise', href: '#' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { text: 'Developer API', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { text: 'Docs', href: '#' },
      { text: 'Community Forum', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { text: 'Blog', href: '/blog' },
      { text: 'Careers', href: '#' },
    ],
  },
]

export const footerSecondaryLinks: NavLink[] = [
  { text: 'Terms', href: '/terms' },
  { text: 'Privacy Policy', href: '/privacy' },
]

export const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/qbaware' },
  { label: 'X', href: 'https://x.com/qbawaresoft' },
]
