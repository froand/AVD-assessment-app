import {
  AlertCircle,
  Download,
  FileJson,
  FileText,
  Filter,
  LayoutPanelTop,
  Presentation,
  Triangle,
} from 'lucide-react'
import type { AssessmentSummary } from '../types/assessment'

interface SummaryDashboardProps {
  summary: AssessmentSummary
  showHighRiskOnly: boolean
  onToggleHighRiskOnly: () => void
  onExportJson: () => void
  onExportMarkdown: () => void
  onExportPptText: () => void
  onExportPdf: () => void
  onExportPptx: () => void
}

const barStyle = {
  high: 'bg-rose-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500',
}

export function SummaryDashboard({
  summary,
  showHighRiskOnly,
  onToggleHighRiskOnly,
  onExportJson,
  onExportMarkdown,
  onExportPptText,
  onExportPdf,
  onExportPptx,
}: SummaryDashboardProps) {
  const filteredFindings = showHighRiskOnly
    ? summary.findings.filter((finding) => finding.risk === 'high')
    : summary.findings
  const maxGapCount = Math.max(1, ...Object.values(summary.gapHeatmap))

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Overall Security Score</p>
          <p className="mt-2 text-4xl font-extrabold text-cyan-900">{summary.overallScore}%</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Findings</p>
          <p className="mt-2 text-4xl font-extrabold text-slate-900">{summary.findings.length}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">High-Risk Gaps</p>
          <p className="mt-2 text-4xl font-extrabold text-rose-700">{summary.gapHeatmap.high}</p>
        </article>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-slate-900">Per-domain score</h3>
        <div className="space-y-3">
          {summary.domainScores.map((domain) => (
            <div key={domain.domainId}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{domain.title}</span>
                <span className="font-semibold text-slate-900">
                  {domain.possible === 0 ? 'Not assessed' : `${domain.percentage}%`}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all ${domain.possible === 0 ? 'bg-slate-400' : 'bg-cyan-700'}`}
                  style={{ width: domain.possible === 0 ? '0%' : `${domain.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-slate-900">Risk heatmap</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {(['high', 'medium', 'low'] as const).map((risk) => (
            <div key={risk} className="rounded-xl bg-slate-50 p-3">
              <p className="text-sm font-semibold capitalize text-slate-600">{risk} risk gaps</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{summary.gapHeatmap[risk]}</p>
              <div className="mt-2 h-2 rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${barStyle[risk]}`}
                  style={{ width: `${(summary.gapHeatmap[risk] / maxGapCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-slate-900">Findings & recommendations</h3>
          <button
            type="button"
            onClick={onToggleHighRiskOnly}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            {showHighRiskOnly ? 'Show all gaps' : 'Show high-risk gaps only'}
          </button>
        </div>

        <div className="space-y-3">
          {filteredFindings.length === 0 ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
              <p className="font-semibold">
                {showHighRiskOnly ? 'No high-risk gaps found - good posture in this area.' : 'No findings match this filter.'}
              </p>
            </div>
          ) : (
            filteredFindings.map((finding) => (
              <article key={finding.controlId} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Triangle className="h-4 w-4 text-amber-600" />
                  <h4 className="font-semibold text-slate-900">{finding.controlTitle}</h4>
                  <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold uppercase text-slate-700">
                    {finding.risk}
                  </span>
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                    {finding.status === 'partial' ? 'Partial' : 'No'}
                  </span>
                </div>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Gap impact:</span> {finding.impact}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Recommendation:</span> {finding.recommendation}
                </p>
                {finding.evidence ? (
                  <p className="mt-1 text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">Evidence:</span> {finding.evidence}
                  </p>
                ) : null}
              </article>
            ))
          )}
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-slate-900">Export outputs</h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onExportJson}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-900 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-800"
          >
            <FileJson className="h-4 w-4" />
            Export JSON
          </button>
          <button
            type="button"
            onClick={onExportMarkdown}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            <FileText className="h-4 w-4" />
            Export Markdown
          </button>
          <button
            type="button"
            onClick={onExportPdf}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-700 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-600"
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </button>
          <button
            type="button"
            onClick={onExportPptx}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-700 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            <Presentation className="h-4 w-4" />
            Export PowerPoint (.pptx)
          </button>
          <button
            type="button"
            onClick={onExportPptText}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            <LayoutPanelTop className="h-4 w-4" />
            Export PPT-style text
          </button>
          <span className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
            <Download className="h-4 w-4" />
            Downloaded locally from browser
          </span>
        </div>
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-500">
          <AlertCircle className="h-4 w-4" />
          This prototype uses local state only; no server-side data persistence is enabled.
        </p>
      </article>
    </section>
  )
}
