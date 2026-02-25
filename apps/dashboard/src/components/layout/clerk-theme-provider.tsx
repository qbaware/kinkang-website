'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'

export function ClerkThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <ClerkProvider
      appearance={{
        baseTheme: isDark ? dark : undefined,
        variables: {
          colorPrimary: '#818cf8',
          ...(isDark && {
            colorBackground: '#18181b',
            colorInputBackground: '#27272a',
            colorInputText: '#fafafa',
          }),
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
