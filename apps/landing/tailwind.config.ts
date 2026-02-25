import type { Config } from 'tailwindcss'
import sharedConfig from '@workspace/tailwind-config'

const config: Config = {
  ...sharedConfig,
  content: [
    './src/**/*.{ts,tsx,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
}

export default config
