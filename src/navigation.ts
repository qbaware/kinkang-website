import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'Solutions',
      links: [
        {
          text: 'Kinkang Cruise Control',
          href: getPermalink('/kinkang-cruise-control'),
        },
        {
          text: 'Kinkang Autoscale',
          href: getPermalink('/kinkang-autoscaling'),
        },
      ],
    },
    {
      text: 'Company',
      links: [
        {
          text: 'About us',
          href: getPermalink('/about'),
        },
      ],
    },
    // {
    //   text: 'Pricing',
    //   href: getPermalink('/pricing'),
    // },
    {
      text: 'Resources',
      links: [
        {
          text: 'FAQs',
          href: getPermalink('/faqs'),
        },
        {
          text: 'Blog',
          href: getBlogPermalink(),
        },
      ],
    },
    {
      text: 'Contact',
      href: getPermalink('/contact'),
    },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Product',
      links: [
        { text: 'Features', href: '/' },
        { text: 'Security', href: '#' },
        { text: 'Enterprise', href: '#' },
        { text: 'Resources', href: '#' },
        { text: 'Customer stories', href: '#' },
      ],
    },
    {
      title: 'Platform',
      links: [{ text: 'Developer API', href: '#' }],
    },
    {
      title: 'Support',
      links: [
        { text: 'Docs', href: '#' },
        { text: 'Community Forum', href: '#' },
        { text: 'Professional Services', href: '#' },
        { text: 'Skills', href: '#' },
        { text: 'Status', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: '#' },
        { text: 'Blog', href: '#' },
        { text: 'Careers', href: '#' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/qbaware' },
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: 'https://x.com/qbawaresoft' },
  ],
  footNote: `
    Kinkang · All rights reserved.
  `,
};
