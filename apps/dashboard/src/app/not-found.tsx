import Link from 'next/link'
import { Button } from '@workspace/ui/components/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-xl text-muted-foreground">Page not found</p>
      <Button className="mt-8" asChild>
        <Link href="/clusters">Go to Dashboard</Link>
      </Button>
    </div>
  )
}
