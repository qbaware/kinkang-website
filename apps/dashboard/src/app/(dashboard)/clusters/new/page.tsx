import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ClusterRegistrationForm } from '@/components/clusters/registration-form'

export const metadata: Metadata = {
  title: 'Register Cluster',
}

export default function NewClusterPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/clusters"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Clusters
      </Link>

      <ClusterRegistrationForm />
    </div>
  )
}
