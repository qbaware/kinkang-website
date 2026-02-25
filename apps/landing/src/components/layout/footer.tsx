import Link from 'next/link'
import { Github } from 'lucide-react'
import { Separator } from '@workspace/ui/components/separator'
import { footerLinkGroups, footerSecondaryLinks, socialLinks } from './nav-links'

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{group.title}</h3>
              <ul className="mt-4 space-y-2">
                {group.links.map((link) => (
                  <li key={link.text}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center space-x-4">
            {footerSecondaryLinks.map((link) => (
              <Link
                key={link.text}
                href={link.href}
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                {link.text}
              </Link>
            ))}
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-600">
            Kinkang &middot; All rights reserved.
          </p>

          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">{social.label}</span>
                {social.label === 'GitHub' ? (
                  <Github className="h-5 w-5" />
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
