'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Cloud, Server, Activity, BarChart2 } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Textarea } from '@workspace/ui/components/textarea'
import { createCluster } from '@/lib/api'
import type { CreateClusterInput } from '@/lib/types'
import { StepIndicator } from './step-indicator'

const STEP_LABELS = ['Identity', 'Connection', 'Metrics', 'Brokers', 'Review']
const TOTAL_STEPS = 5

const AWS_REGIONS = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'eu-west-1',
  'eu-west-2',
  'eu-central-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'sa-east-1',
  'ca-central-1',
]

type SaslMechanism = 'PLAIN' | 'SCRAM-SHA-256' | 'SCRAM-SHA-512' | null

interface FormState {
  name: string
  cluster_type: 'msk' | 'self_managed' | null
  bootstrap_servers: string
  aws_region: string
  msk_cluster_arn: string
  sasl_mechanism: SaslMechanism
  sasl_username: string
  sasl_password: string
  sampler: 'prometheus' | 'topic' | null
  prometheus_endpoint: string
  broker_count: string
  broker_disk_mb: string
  broker_cpu_cores: string
  broker_nw_in_kbps: string
  broker_nw_out_kbps: string
}

const INITIAL_FORM: FormState = {
  name: '',
  cluster_type: null,
  bootstrap_servers: '',
  aws_region: '',
  msk_cluster_arn: '',
  sasl_mechanism: null,
  sasl_username: '',
  sasl_password: '',
  sampler: null,
  prometheus_endpoint: '',
  broker_count: '',
  broker_disk_mb: '',
  broker_cpu_cores: '',
  broker_nw_in_kbps: '',
  broker_nw_out_kbps: '',
}

function selectCardClass(selected: boolean) {
  return [
    'flex flex-col items-center gap-1.5 rounded-xl border p-4 cursor-pointer transition-colors text-center',
    selected
      ? 'ring-2 ring-indigo-600 border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30'
      : 'border-border bg-card hover:bg-muted/50',
  ].join(' ')
}

// ─── Step 1 ──────────────────────────────────────────────────────────────────

function Step1({
  formData,
  onChange,
}: {
  formData: FormState
  onChange: (patch: Partial<FormState>) => void
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">Cluster Name</Label>
        <Input
          id="name"
          placeholder="prod-us-east-1"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Cluster Type</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className={selectCardClass(formData.cluster_type === 'msk')}
            onClick={() => onChange({ cluster_type: 'msk', aws_region: '', msk_cluster_arn: '' })}
          >
            <div className="flex items-center justify-center gap-2 w-full">
              <Cloud className="h-5 w-5 text-indigo-600 shrink-0" />
              <p className="font-semibold text-foreground text-sm">Amazon MSK</p>
              <span className="h-5 w-5 shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground">AWS Managed Streaming for Kafka</p>
          </button>
          <button
            type="button"
            className={selectCardClass(formData.cluster_type === 'self_managed')}
            onClick={() =>
              onChange({ cluster_type: 'self_managed', aws_region: '', msk_cluster_arn: '' })
            }
          >
            <div className="flex items-center justify-center gap-2 w-full">
              <Server className="h-5 w-5 text-indigo-600 shrink-0" />
              <p className="font-semibold text-foreground text-sm">Self-managed</p>
              <span className="h-5 w-5 shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground">Your own Kafka deployment</p>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Step 2 ──────────────────────────────────────────────────────────────────

function Step2({
  formData,
  onChange,
}: {
  formData: FormState
  onChange: (patch: Partial<FormState>) => void
}) {
  const isMsk = formData.cluster_type === 'msk'

  return (
    <div className="space-y-5">
      {/* Bootstrap servers */}
      <div className="space-y-1.5">
        <Label htmlFor="bootstrap_servers">Bootstrap Servers</Label>
        <Textarea
          id="bootstrap_servers"
          placeholder={
            isMsk
              ? 'b-1.cluster.abc123.c2.kafka.us-east-1.amazonaws.com:9096'
              : 'broker1:9092,broker2:9092,broker3:9092'
          }
          value={formData.bootstrap_servers}
          onChange={(e) => onChange({ bootstrap_servers: e.target.value })}
          rows={3}
        />
        {isMsk && (
          <p className="text-xs text-muted-foreground">Comma-separated if multiple</p>
        )}
      </div>

      {isMsk ? (
        <>
          {/* AWS Region */}
          <div className="space-y-1.5">
            <Label htmlFor="aws_region">AWS Region</Label>
            <select
              id="aws_region"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.aws_region}
              onChange={(e) => onChange({ aws_region: e.target.value })}
            >
              <option value="">Select region…</option>
              {AWS_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* MSK ARN */}
          <div className="space-y-1.5">
            <Label htmlFor="msk_cluster_arn">MSK Cluster ARN</Label>
            <Input
              id="msk_cluster_arn"
              placeholder="arn:aws:kafka:us-east-1:123456789:cluster/name/uuid"
              value={formData.msk_cluster_arn}
              onChange={(e) => onChange({ msk_cluster_arn: e.target.value })}
            />
          </div>

          {/* SASL info */}
          <div className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">SASL:</span>{' '}
            Authentication is handled automatically via IAM (AWS_MSK_IAM)
          </div>
        </>
      ) : (
        <>
          {/* SASL Mechanism */}
          <div className="space-y-1.5">
            <Label htmlFor="sasl_mechanism">SASL Mechanism</Label>
            <select
              id="sasl_mechanism"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.sasl_mechanism ?? ''}
              onChange={(e) =>
                onChange({
                  sasl_mechanism: (e.target.value || null) as SaslMechanism,
                  sasl_username: '',
                  sasl_password: '',
                })
              }
            >
              <option value="">None</option>
              <option value="PLAIN">PLAIN</option>
              <option value="SCRAM-SHA-256">SCRAM-SHA-256</option>
              <option value="SCRAM-SHA-512">SCRAM-SHA-512</option>
            </select>
          </div>

          {formData.sasl_mechanism && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="sasl_username">SASL Username</Label>
                <Input
                  id="sasl_username"
                  value={formData.sasl_username}
                  onChange={(e) => onChange({ sasl_username: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sasl_password">SASL Password</Label>
                <Input
                  id="sasl_password"
                  type="password"
                  value={formData.sasl_password}
                  onChange={(e) => onChange({ sasl_password: e.target.value })}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

// ─── Step 3 ──────────────────────────────────────────────────────────────────

function Step3({
  formData,
  onChange,
}: {
  formData: FormState
  onChange: (patch: Partial<FormState>) => void
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label>Metrics Sampler</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className={selectCardClass(formData.sampler === 'prometheus')}
            onClick={() => onChange({ sampler: 'prometheus' })}
          >
            <div className="flex items-center justify-center gap-2 w-full">
              <Activity className="h-5 w-5 text-indigo-600 shrink-0" />
              <p className="font-semibold text-foreground text-sm">Prometheus</p>
              <span className="h-5 w-5 shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground">
              Scrape metrics from your Prometheus endpoint
            </p>
          </button>
          <button
            type="button"
            className={selectCardClass(formData.sampler === 'topic')}
            onClick={() => onChange({ sampler: 'topic', prometheus_endpoint: '' })}
          >
            <div className="flex items-center justify-center gap-2 w-full">
              <BarChart2 className="h-5 w-5 text-indigo-600 shrink-0" />
              <p className="font-semibold text-foreground text-sm">Topic Sampler</p>
              <span className="h-5 w-5 shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground">
              Sample metrics from Kafka topics directly
            </p>
          </button>
        </div>
      </div>

      {formData.sampler === 'prometheus' && (
        <div className="space-y-1.5">
          <Label htmlFor="prometheus_endpoint">Prometheus Endpoint</Label>
          <Input
            id="prometheus_endpoint"
            placeholder="http://prometheus:9090"
            value={formData.prometheus_endpoint}
            onChange={(e) => onChange({ prometheus_endpoint: e.target.value })}
          />
        </div>
      )}
    </div>
  )
}

// ─── Step 4 ──────────────────────────────────────────────────────────────────

function Step4({
  formData,
  onChange,
}: {
  formData: FormState
  onChange: (patch: Partial<FormState>) => void
}) {
  const fields: {
    key: keyof Pick<
      FormState,
      'broker_count' | 'broker_disk_mb' | 'broker_cpu_cores' | 'broker_nw_in_kbps' | 'broker_nw_out_kbps'
    >
    label: string
    placeholder: string
  }[] = [
    { key: 'broker_count', label: 'Broker Count', placeholder: '3' },
    { key: 'broker_disk_mb', label: 'Disk per Broker (MB)', placeholder: '102400' },
    { key: 'broker_cpu_cores', label: 'CPU Cores per Broker', placeholder: '4' },
    { key: 'broker_nw_in_kbps', label: 'Network In (kbps)', placeholder: '125000' },
    { key: 'broker_nw_out_kbps', label: 'Network Out (kbps)', placeholder: '125000' },
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-1.5">
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              type="number"
              min={1}
              placeholder={placeholder}
              value={formData[key]}
              onChange={(e) => onChange({ [key]: e.target.value })}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        These values calibrate Cruise Control rebalancing goals. Provide per-broker values.
      </p>
    </div>
  )
}

// ─── Step 5 (Review) ─────────────────────────────────────────────────────────

function ReviewRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm border-b border-border last:border-0">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={['text-foreground text-right break-all', mono ? 'font-mono' : ''].join(' ')}>
        {value}
      </span>
    </div>
  )
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-0.5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
        {title}
      </h3>
      {children}
    </div>
  )
}

function Step5({ formData }: { formData: FormState }) {
  const isMsk = formData.cluster_type === 'msk'

  return (
    <div className="space-y-4">
      <ReviewSection title="Cluster Identity">
        <ReviewRow label="Name" value={formData.name} />
        <ReviewRow label="Type" value={isMsk ? 'Amazon MSK' : 'Self-managed'} />
      </ReviewSection>

      <ReviewSection title="Connection">
        <ReviewRow label="Bootstrap Servers" value={formData.bootstrap_servers} mono />
        {isMsk && (
          <>
            <ReviewRow label="AWS Region" value={formData.aws_region || '—'} />
            <ReviewRow label="MSK Cluster ARN" value={formData.msk_cluster_arn || '—'} mono />
            <ReviewRow label="SASL Mechanism" value="AWS_MSK_IAM" />
          </>
        )}
        {!isMsk && (
          <>
            <ReviewRow label="SASL Mechanism" value={formData.sasl_mechanism ?? 'None'} />
            {formData.sasl_username && (
              <ReviewRow label="SASL Username" value={formData.sasl_username} />
            )}
          </>
        )}
      </ReviewSection>

      <ReviewSection title="Metrics">
        <ReviewRow
          label="Sampler"
          value={formData.sampler === 'prometheus' ? 'Prometheus' : 'Topic Sampler'}
        />
        {formData.sampler === 'prometheus' && formData.prometheus_endpoint && (
          <ReviewRow label="Prometheus Endpoint" value={formData.prometheus_endpoint} mono />
        )}
      </ReviewSection>

      <ReviewSection title="Broker Specs">
        <ReviewRow label="Broker Count" value={formData.broker_count || '—'} />
        <ReviewRow label="Disk per Broker (MB)" value={formData.broker_disk_mb || '—'} />
        <ReviewRow label="CPU Cores per Broker" value={formData.broker_cpu_cores || '—'} />
        <ReviewRow label="Network In (kbps)" value={formData.broker_nw_in_kbps || '—'} />
        <ReviewRow label="Network Out (kbps)" value={formData.broker_nw_out_kbps || '—'} />
      </ReviewSection>
    </div>
  )
}

// ─── Validation ──────────────────────────────────────────────────────────────

function validateStep(step: number, formData: FormState): string | null {
  switch (step) {
    case 1:
      if (!formData.name.trim()) return 'Cluster name is required.'
      if (!formData.cluster_type) return 'Please select a cluster type.'
      return null
    case 2:
      if (!formData.bootstrap_servers.trim()) return 'Bootstrap servers are required.'
      if (formData.cluster_type === 'msk') {
        if (!formData.aws_region) return 'AWS Region is required.'
        if (!formData.msk_cluster_arn.trim()) return 'MSK Cluster ARN is required.'
      }
      return null
    case 3:
      if (!formData.sampler) return 'Please select a metrics sampler.'
      if (formData.sampler === 'prometheus' && !formData.prometheus_endpoint.trim())
        return 'Prometheus endpoint is required.'
      return null
    case 4: {
      const fields: Array<[string, string]> = [
        [formData.broker_count, 'Broker count'],
        [formData.broker_disk_mb, 'Disk per broker'],
        [formData.broker_cpu_cores, 'CPU cores per broker'],
        [formData.broker_nw_in_kbps, 'Network in'],
        [formData.broker_nw_out_kbps, 'Network out'],
      ]
      for (const [v, label] of fields) {
        if (!v) return `${label} is required.`
        const n = Number(v)
        if (!Number.isInteger(n) || n < 1) return `${label} must be a positive integer.`
      }
      return null
    }
    default:
      return null
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ClusterRegistrationForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(patch: Partial<FormState>) {
    setFormData((prev) => ({ ...prev, ...patch }))
    setValidationError(null)
  }

  function handleNext() {
    const error = validateStep(step, formData)
    if (error) {
      setValidationError(error)
      return
    }
    setValidationError(null)
    setStep((s) => s + 1)
  }

  function handleBack() {
    setValidationError(null)
    setSubmitError(null)
    setStep((s) => s - 1)
  }

  async function handleSubmit() {
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      const isMsk = formData.cluster_type === 'msk'
      const input: CreateClusterInput = {
        name: formData.name.trim(),
        cluster_type: formData.cluster_type as 'msk' | 'self_managed',
        bootstrap_servers: formData.bootstrap_servers.trim(),
        aws_region: isMsk ? formData.aws_region : null,
        msk_cluster_arn: isMsk ? formData.msk_cluster_arn.trim() : null,
        sasl_mechanism: isMsk
          ? 'AWS_MSK_IAM'
          : (formData.sasl_mechanism as CreateClusterInput['sasl_mechanism']),
        sasl_username: formData.sasl_username.trim() || null,
        sasl_password: formData.sasl_password || null,
        sampler: formData.sampler as 'prometheus' | 'topic',
        prometheus_endpoint:
          formData.sampler === 'prometheus' ? formData.prometheus_endpoint.trim() : null,
        broker_count: Number(formData.broker_count),
        broker_disk_mb: Number(formData.broker_disk_mb),
        broker_cpu_cores: Number(formData.broker_cpu_cores),
        broker_nw_in_kbps: Number(formData.broker_nw_in_kbps),
        broker_nw_out_kbps: Number(formData.broker_nw_out_kbps),
      }
      const cluster = await createCluster(input)
      router.push(`/clusters/${cluster.id}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An unexpected error occurred.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-[600px] space-y-8">
      <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} labels={STEP_LABELS} />

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {/* Step title */}
        <h2 className="text-lg font-semibold text-foreground mb-5">
          {step === 1 && 'Cluster Identity'}
          {step === 2 && 'Connection Details'}
          {step === 3 && 'Metrics Sampling'}
          {step === 4 && 'Broker Hardware Specs'}
          {step === 5 && 'Review & Register'}
        </h2>

        {/* Step content */}
        {step === 1 && <Step1 formData={formData} onChange={handleChange} />}
        {step === 2 && <Step2 formData={formData} onChange={handleChange} />}
        {step === 3 && <Step3 formData={formData} onChange={handleChange} />}
        {step === 4 && <Step4 formData={formData} onChange={handleChange} />}
        {step === 5 && <Step5 formData={formData} />}

        {/* Validation error */}
        {validationError && (
          <p className="mt-4 text-sm text-destructive">{validationError}</p>
        )}

        {/* Navigation buttons */}
        <div className="mt-6 flex items-center justify-between gap-3">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS ? (
            <Button
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Button
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering…' : 'Register Cluster'}
            </Button>
          )}
        </div>

        {/* Submit error */}
        {submitError && (
          <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {submitError}
          </div>
        )}
      </div>
    </div>
  )
}
