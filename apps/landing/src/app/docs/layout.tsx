import { DocsSidebar } from '@/components/docs/docs-sidebar'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto max-w-7xl px-4">
      <div className="flex min-h-[calc(100vh-4rem)] gap-8">
        <DocsSidebar />
        <div className="flex-1 min-w-0 py-12">
          {children}
        </div>
      </div>
    </div>
  )
}
