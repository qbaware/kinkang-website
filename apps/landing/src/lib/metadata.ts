import type { Metadata } from 'next'

export const siteConfig = {
  name: 'Kinkang',
  description: 'Your Kafka cluster. Properly Managed.',
  url: 'https://kinkang.cloud',
  ogImage: '/images/og-default.png',
  links: {
    github: 'https://github.com/qbaware',
    twitter: 'https://x.com/qbawaresoft',
  },
}

export function constructMetadata({
  title,
  description,
  image,
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title: title ? `${title} — ${siteConfig.name}` : siteConfig.name,
    description: description ?? siteConfig.description,
    openGraph: {
      title: title ?? siteConfig.name,
      description: description ?? siteConfig.description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [{ url: image ?? siteConfig.ogImage }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title ?? siteConfig.name,
      description: description ?? siteConfig.description,
      images: [image ?? siteConfig.ogImage],
    },
    ...(noIndex && {
      robots: { index: false, follow: false },
    }),
  }
}
