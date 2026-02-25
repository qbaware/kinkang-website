'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { updateCluster, deleteCluster } from '@/lib/api'
import type { ClusterWithInstance } from '@/lib/types'

interface ClusterSettingsFormProps {
  cluster: ClusterWithInstance
}

export function ClusterSettingsForm({ cluster }: ClusterSettingsFormProps) {
  const router = useRouter()

  // ── Identity ────────────────────────────────────────────────────────────────
  const [name, setName] = useState(cluster.name)
  const [nameError, setNameError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const saveSuccessTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function handleSave() {
    if (!name.trim()) {
      setNameError('Cluster name is required.')
      return
    }
    setNameError(null)
    setSaveError(null)
    setSaveSuccess(false)
    setIsSaving(true)
    try {
      await updateCluster(cluster.id, { name: name.trim() })
      if (saveSuccessTimer.current) clearTimeout(saveSuccessTimer.current)
      setSaveSuccess(true)
      saveSuccessTimer.current = setTimeout(() => setSaveSuccess(false), 3000)
      router.refresh()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setIsSaving(false)
    }
  }

  // ── Danger Zone ─────────────────────────────────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function handleDelete() {
    if (deleteConfirm !== cluster.name) return
    setDeleteError(null)
    setIsDeleting(true)
    try {
      await deleteCluster(cluster.id)
      router.push('/clusters')
      router.refresh()
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'An unexpected error occurred.')
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* ── Identity ─────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Identity
        </h3>

        {saveError && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {saveError}
          </div>
        )}
        {saveSuccess && (
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
            Settings saved.
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="name">Cluster Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => { setName(e.target.value); setNameError(null) }}
            placeholder="my-kafka-cluster"
          />
          {nameError && <p className="text-xs text-destructive">{nameError}</p>}
        </div>

        <div className="flex justify-end">
          <Button
            className="bg-indigo-600 hover:bg-indigo-500 text-white"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* ── Danger Zone ───────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-destructive/40 bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">
          Deleting this cluster will also deprovision any associated Kinkang Engine. This action cannot be undone.
        </p>

        {deleteError && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {deleteError}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="delete-confirm">
            Type <span className="font-mono font-semibold">{cluster.name}</span> to confirm
          </Label>
          <Input
            id="delete-confirm"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder={cluster.name}
          />
        </div>

        <Button
          variant="outline"
          className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleDelete}
          disabled={isDeleting || deleteConfirm !== cluster.name}
        >
          {isDeleting ? 'Deleting…' : 'Delete Cluster'}
        </Button>
      </div>
    </div>
  )
}
