import { AlertTriangle, CheckCircle2, ClipboardCheck, FileText, ShieldCheck } from 'lucide-react'
import { statusOptions } from '../data/assessmentData'
import type { AssessmentControl, ControlResponse, ControlStatus } from '../types/assessment'

interface ControlCardProps {
  control: AssessmentControl
  response: ControlResponse
  onStatusChange: (id: string, value: ControlStatus) => void
  onEvidenceChange: (id: string, value: string) => void
  onCompletedToggle: (id: string) => void
}

const riskStyle = {
  high: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
  medium: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
  low: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
}

const sourceStyle = 'rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700'

export function ControlCard({
  control,
  response,
  onStatusChange,
  onEvidenceChange,
  onCompletedToggle,
}: ControlCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <header className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-800">
            <ShieldCheck className="h-5 w-5 text-cyan-700" />
            <h3 className="text-lg font-semibold">{control.title}</h3>
          </div>
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-800">Why this matters:</span> {control.whyItMatters}
          </p>
          <div className="flex flex-wrap gap-2">
            {control.sourceMappings.map((source) => (
              <span key={source} className={sourceStyle}>
                {source}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${riskStyle[control.risk]}`}>
            {control.risk} risk
          </span>
          {response.completed ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Complete
            </span>
          ) : null}
        </div>
      </header>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <label className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
            <ClipboardCheck className="h-4 w-4" />
            Set status
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-cyan-300 transition focus:ring-2"
            value={response.status}
            onChange={(e) => onStatusChange(control.id, e.target.value as ControlStatus)}
          >
            {statusOptions
              .filter((status) => control.notApplicableAllowed || status.value !== 'na')
              .map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
        </div>

        <div className="lg:col-span-3">
          <label className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FileText className="h-4 w-4" />
            Add evidence
          </label>
          <textarea
            value={response.evidence}
            onChange={(e) => onEvidenceChange(control.id, e.target.value)}
            placeholder="Capture observations, links, policy names, test results, or exceptions..."
            rows={3}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-cyan-300 transition focus:ring-2"
          />
        </div>
      </div>

      {response.status !== 'yes' && response.status !== 'na' && response.status !== 'unassessed' ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
          <div className="mb-1 inline-flex items-center gap-2 font-semibold text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            Recommendation trigger
          </div>
          <p className="text-amber-900">{control.recommendation}</p>
        </div>
      ) : null}

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-800">Impact:</span> {control.impact}
        </p>
        <button
          type="button"
          onClick={() => onCompletedToggle(control.id)}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          {response.completed ? 'Mark incomplete' : 'Mark complete'}
        </button>
      </footer>
    </article>
  )
}
