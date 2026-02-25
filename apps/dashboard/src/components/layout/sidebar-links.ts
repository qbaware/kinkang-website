import { Server, Settings, CreditCard, type LucideIcon } from 'lucide-react'

export interface SidebarLink {
  label: string
  href: string
  icon: LucideIcon
}

export const sidebarLinks: SidebarLink[] = [
  { label: 'Clusters', href: '/clusters', icon: Server },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Billing', href: '/billing', icon: CreditCard },
]
