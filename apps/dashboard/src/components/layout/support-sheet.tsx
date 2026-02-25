'use client'

import { useState } from 'react'
import { LifeBuoy, FileText, Megaphone, ExternalLink } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@workspace/ui/components/sheet'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Textarea } from '@workspace/ui/components/textarea'
import { cn } from '@workspace/ui/lib/utils'

const CATEGORIES = [
  'Bug Report',
  'Billing Question',
  'Feature Request',
  'General',
] as const

type Category = (typeof CATEGORIES)[number]

const QUICK_LINKS = [
  {
    icon: FileText,
    label: 'Documentation',
    href: 'https://kinkang.cloud/docs',
  },
  {
    icon: Megaphone,
    label: 'Changelog',
    href: 'https://kinkang.cloud/changelog',
  },
  {
    icon: ExternalLink,
    label: 'Status Page',
    href: 'https://status.kinkang.cloud',
  },
]

interface SupportSheetProps {
  children: React.ReactNode
}

export function SupportSheet({ children }: SupportSheetProps) {
  const [category, setCategory] = useState<Category>('General')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ subject?: string; message?: string }>({})

  function validate() {
    const errs: typeof errors = {}
    if (!subject.trim()) errs.subject = 'Subject is required.'
    if (message.trim().length < 20) errs.message = 'Message must be at least 20 characters.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const emailSubject = encodeURIComponent(`[${category}] ${subject.trim()}`)
    const emailBody = encodeURIComponent(message.trim())
    window.location.href = `mailto:support@qbaware.com?subject=${emailSubject}&body=${emailBody}`
  }

  const inputClass =
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Support</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Quick links */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Resources
            </p>
            <div className="space-y-1">
              {QUICK_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <link.icon className="h-4 w-4 shrink-0" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Contact form */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Contact Us
            </p>

            {/* Category */}
            <div className="space-y-1.5">
              <Label htmlFor="support-category">Category</Label>
              <select
                id="support-category"
                className={inputClass + ' bg-background'}
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <Label htmlFor="support-subject">Subject</Label>
              <Input
                id="support-subject"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value)
                  setErrors((prev) => ({ ...prev, subject: undefined }))
                }}
                placeholder="Brief description of your issue"
              />
              {errors.subject && (
                <p className="text-xs text-destructive">{errors.subject}</p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <Label htmlFor="support-message">Message</Label>
              <Textarea
                id="support-message"
                rows={5}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                  setErrors((prev) => ({ ...prev, message: undefined }))
                }}
                placeholder="Describe your issue in detail…"
              />
              <div className="flex items-center justify-between">
                {errors.message ? (
                  <p className="text-xs text-destructive">{errors.message}</p>
                ) : (
                  <span />
                )}
                <p
                  className={cn(
                    'text-xs',
                    message.trim().length < 20
                      ? 'text-muted-foreground'
                      : 'text-emerald-600 dark:text-emerald-400',
                  )}
                >
                  {message.trim().length}/20 min
                </p>
              </div>
            </div>

            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
              onClick={handleSubmit}
            >
              <LifeBuoy className="mr-2 h-4 w-4" />
              Send via Email
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
