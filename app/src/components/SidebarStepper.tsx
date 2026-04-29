import { CheckCheck, ChevronRight } from 'lucide-react'

interface SidebarStepperProps {
  steps: { id: string; title: string; subtitle?: string }[]
  currentStep: number
  completedStepIds: Set<string>
  onStepClick: (index: number) => void
}

export function SidebarStepper({
  steps,
  currentStep,
  completedStepIds,
  onStepClick,
}: SidebarStepperProps) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Assessment workflow
      </h2>
      <ol className="space-y-2">
        {steps.map((step, index) => {
          const active = currentStep === index
          const complete = completedStepIds.has(step.id)
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => onStepClick(index)}
                className={`flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left transition ${
                  active ? 'bg-cyan-900 text-white shadow' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    active ? 'bg-white text-cyan-900' : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {complete ? <CheckCheck className="h-4 w-4" /> : index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{step.title}</span>
                  {step.subtitle ? (
                    <span className={`mt-0.5 block text-xs ${active ? 'text-cyan-100' : 'text-slate-500'}`}>
                      {step.subtitle}
                    </span>
                  ) : null}
                </span>
                <ChevronRight className={`h-4 w-4 shrink-0 ${active ? 'text-cyan-200' : 'text-slate-400'}`} />
              </button>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
