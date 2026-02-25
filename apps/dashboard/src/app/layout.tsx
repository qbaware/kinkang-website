export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import '@fontsource-variable/inter'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { ClerkThemeProvider } from '@/components/layout/clerk-theme-provider'

export const metadata: Metadata = {
  title: {
    default: 'Dashboard — Kinkang',
    template: '%s - Kinkang Dashboard',
  },
  description: 'Manage your Kafka clusters with Kinkang.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClerkThemeProvider>
            {children}
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
