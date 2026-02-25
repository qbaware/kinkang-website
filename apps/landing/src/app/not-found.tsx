import Link from 'next/link'
import { Button } from '@workspace/ui/components/button'

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-xl text-muted-foreground">Page not found</p>
      <p className="mt-2 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button className="mt-8" asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  )
}
