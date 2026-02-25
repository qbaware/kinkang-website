interface StepIndicatorProps {
  currentStep: number // 1-based
  totalSteps: number
  labels: string[]
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center w-full">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1
        const isCompleted = step < currentStep
        const isCurrent = step === currentStep

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                  isCompleted
                    ? 'bg-indigo-600 text-white'
                    : isCurrent
                      ? 'border-2 border-indigo-600 text-indigo-600 bg-background'
                      : 'border-2 border-border text-muted-foreground bg-background',
                ].join(' ')}
              >
                {step}
              </div>
              <span
                className={[
                  'hidden sm:block text-xs font-medium whitespace-nowrap',
                  isCurrent
                    ? 'text-foreground'
                    : isCompleted
                      ? 'text-muted-foreground'
                      : 'text-muted-foreground',
                ].join(' ')}
              >
                {labels[i]}
              </span>
            </div>

            {/* Connector line — not after last step */}
            {step < totalSteps && (
              <div
                className={[
                  'flex-1 h-px mx-2 sm:mb-5',
                  isCompleted ? 'bg-indigo-600' : 'bg-border',
                ].join(' ')}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
