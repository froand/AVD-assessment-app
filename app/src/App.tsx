import { useEffect, useMemo, useReducer, useState } from 'react'
import { ArrowLeft, ArrowRight, Building2, Compass, Shield, Sparkles } from 'lucide-react'
import { ControlCard } from './components/ControlCard'
import { SidebarStepper } from './components/SidebarStepper'
import { SummaryDashboard } from './components/SummaryDashboard'
import { assessmentControls, domainDefinitions, initialDiscoveryInput } from './data/assessmentData'
import type { ControlStatus, DiscoveryInput, DomainId } from './types/assessment'
import {
  exportJsonReport,
  exportMarkdownReport,
  exportPdfReport,
  exportPptStyleText,
  exportPptxReport,
} from './utils/exporters'
import { createInitialResponseMap, getAssessmentSummary } from './utils/scoring'

interface AssessmentState {
  discovery: DiscoveryInput
  responses: ReturnType<typeof createInitialResponseMap>
}

type Action =
  | { type: 'set-discovery'; key: keyof DiscoveryInput; value: string }
  | { type: 'set-status'; controlId: string; status: ControlStatus }
  | { type: 'set-evidence'; controlId: string; evidence: string }
  | { type: 'toggle-complete'; controlId: string }

interface StepDefinition {
  id: string
  title: string
  subtitle: string
  domainId?: DomainId
}

const assessmentReducer = (state: AssessmentState, action: Action): AssessmentState => {
  switch (action.type) {
    case 'set-discovery':
      return {
        ...state,
        discovery: {
          ...state.discovery,
          [action.key]: action.value,
        },
      }
    case 'set-status':
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.controlId]: {
            ...state.responses[action.controlId],
            status: action.status,
          },
        },
      }
    case 'set-evidence':
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.controlId]: {
            ...state.responses[action.controlId],
            evidence: action.evidence,
          },
        },
      }
    case 'toggle-complete':
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.controlId]: {
            ...state.responses[action.controlId],
            completed: !state.responses[action.controlId].completed,
          },
        },
      }
    default:
      return state
  }
}

const allSteps: StepDefinition[] = [
  {
    id: 'discovery',
    title: 'Discovery / Environment Input',
    subtitle: 'Scope and context collection',
  },
  {
    id: 'identity',
    title: 'Identity & Access',
    subtitle: 'Authentication, RBAC, and privileged access',
    domainId: 'identity-access',
  },
  {
    id: 'endpoint',
    title: 'Endpoint & Device Security',
    subtitle: 'User device posture and trust signals',
    domainId: 'endpoint-device-security',
  },
  {
    id: 'session-host',
    title: 'Session Host Security',
    subtitle: 'Host hardening, EDR, image management',
    domainId: 'session-host-security',
  },
  {
    id: 'network',
    title: 'Network & Connectivity',
    subtitle: 'Segmentation, egress, control plane',
    domainId: 'network-connectivity',
  },
  {
    id: 'private-access',
    title: 'Private Access / Zero Trust',
    subtitle: 'Private endpoints and adaptive access',
    domainId: 'private-access-zero-trust',
  },
  {
    id: 'fslogix',
    title: 'FSLogix & Storage',
    subtitle: 'Profile resiliency and data controls',
    domainId: 'fslogix-storage',
  },
  {
    id: 'data-protection',
    title: 'Data Protection',
    subtitle: 'Encryption, Key Vault, classification, DLP',
    domainId: 'data-protection',
  },
  {
    id: 'waf',
    title: 'WAF & Edge Security',
    subtitle: 'Applies when internet-facing apps exist',
    domainId: 'waf-edge-security',
  },
  {
    id: 'bcdr',
    title: 'BCDR & Resilience',
    subtitle: 'Multi-region, AZs, image replication',
    domainId: 'bcdr-resilience',
  },
  {
    id: 'governance',
    title: 'Governance & Compliance',
    subtitle: 'Policy, landing zone, regulatory posture',
    domainId: 'governance-compliance',
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Operations',
    subtitle: 'Insights, audit logs, Service Health',
    domainId: 'monitoring-operations',
  },
  {
    id: 'summary',
    title: 'Summary & Recommendations',
    subtitle: 'Executive posture and prioritized gaps',
  },
]

function App() {
  const [state, dispatch] = useReducer(assessmentReducer, {
    discovery: initialDiscoveryInput,
    responses: createInitialResponseMap(),
  })
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [showHighRiskOnly, setShowHighRiskOnly] = useState(false)
  const [visitedStepIds, setVisitedStepIds] = useState<Set<string>>(new Set(['discovery']))

  useEffect(() => {
    document.title = 'Azure Virtual Desktop Security Assessment'
  }, [])

  const visibleSteps = useMemo(
    () =>
      allSteps.filter(
        (step) => step.id !== 'waf' || state.discovery.internetFacingApplications === 'yes',
      ),
    [state.discovery.internetFacingApplications],
  )

  useEffect(() => {
    if (currentStepIndex > visibleSteps.length - 1) {
      setCurrentStepIndex(visibleSteps.length - 1)
    }
  }, [currentStepIndex, visibleSteps.length])

  useEffect(() => {
    const activeStep = visibleSteps[currentStepIndex]
    if (!activeStep) {
      return
    }

    setVisitedStepIds((prev) => {
      if (prev.has(activeStep.id)) {
        return prev
      }
      const updated = new Set(prev)
      updated.add(activeStep.id)
      return updated
    })
  }, [currentStepIndex, visibleSteps])

  const summary = useMemo(
    () => getAssessmentSummary(state.responses, state.discovery),
    [state.responses, state.discovery],
  )

  const controlsByDomain = useMemo(() => {
    return assessmentControls.reduce<Record<DomainId, typeof assessmentControls>>(
      (acc, control) => {
        acc[control.domainId] = [...(acc[control.domainId] ?? []), control]
        return acc
      },
      {
        'identity-access': [],
        'endpoint-device-security': [],
        'session-host-security': [],
        'network-connectivity': [],
        'private-access-zero-trust': [],
        'fslogix-storage': [],
        'data-protection': [],
        'waf-edge-security': [],
        'bcdr-resilience': [],
        'governance-compliance': [],
        'monitoring-operations': [],
      },
    )
  }, [])

  const completedStepIds = useMemo(() => {
    const completed = new Set<string>()

    const discoveryComplete =
      state.discovery.numberOfUsers.trim() &&
      state.discovery.regions.trim() &&
      state.discovery.clientTypes.trim() &&
      state.discovery.dependencies.trim()

    if (discoveryComplete) {
      completed.add('discovery')
    }

    visibleSteps
      .filter((step) => step.domainId)
      .forEach((step) => {
        const controls = controlsByDomain[step.domainId as DomainId]
        if (controls.every((control) => state.responses[control.id].status !== 'unassessed')) {
          completed.add(step.id)
        }
      })

    if (visitedStepIds.has('summary')) {
      completed.add('summary')
    }

    return completed
  }, [controlsByDomain, state.discovery, state.responses, visitedStepIds, visibleSteps])

  const currentStep = visibleSteps[currentStepIndex]
  const progress = Math.round(((currentStepIndex + 1) / visibleSteps.length) * 100)

  const handleControlStatus = (controlId: string, status: ControlStatus): void => {
    dispatch({ type: 'set-status', controlId, status })
  }

  const handleControlEvidence = (controlId: string, evidence: string): void => {
    dispatch({ type: 'set-evidence', controlId, evidence })
  }

  const handleControlComplete = (controlId: string): void => {
    dispatch({ type: 'toggle-complete', controlId })
  }

  const renderDiscovery = () => {
    const discoveryFields: { key: keyof DiscoveryInput; label: string; placeholder: string }[] = [
      {
        key: 'numberOfUsers',
        label: 'Number of users',
        placeholder: 'Example: 2500 users',
      },
      {
        key: 'regions',
        label: 'Regions',
        placeholder: 'Example: East US, West Europe',
      },
      {
        key: 'clientTypes',
        label: 'Client types',
        placeholder: 'Example: Windows, macOS, web client, mobile',
      },
      {
        key: 'dependencies',
        label: 'Dependencies (AD, storage, network)',
        placeholder: 'Example: Entra ID, AD DS, Azure Files, ExpressRoute',
      },
    ]

    return (
      <section className="space-y-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Discovery context</h3>
          <p className="mt-2 text-sm text-slate-600">
            Capture the assessment baseline before control scoring. This input informs scope and conditional
            sections, including whether WAF and edge controls are relevant for internet-facing workloads.
          </p>
        </article>

        <article className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
          {discoveryFields.map((field) => (
            <label key={field.key} className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">{field.label}</span>
              <input
                value={state.discovery[field.key]}
                onChange={(event) =>
                  dispatch({ type: 'set-discovery', key: field.key, value: event.target.value })
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-cyan-300 focus:ring-2"
                placeholder={field.placeholder}
              />
            </label>
          ))}

          <div className="space-y-2 md:col-span-2">
            <p className="text-sm font-semibold text-slate-700">Are there internet-facing applications?</p>
            <p className="text-sm text-slate-500">
              WAF controls are not mandatory for Azure Virtual Desktop itself. This section appears only when
              internet-facing applications are in scope.
            </p>
            <div className="flex gap-2">
              {(['yes', 'no'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => dispatch({ type: 'set-discovery', key: 'internetFacingApplications', value })}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    state.discovery.internetFacingApplications === value
                      ? 'bg-cyan-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {value === 'yes' ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
          </div>
        </article>
      </section>
    )
  }

  const renderDomainControls = (domainId: DomainId | undefined) => {
    if (!domainId) {
      return null
    }

    const domain = domainDefinitions.find((item) => item.id === domainId)
    const controls = controlsByDomain[domainId]

    return (
      <section className="space-y-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">{domain?.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{domain?.description}</p>
        </article>

        {controls.map((control) => (
          <ControlCard
            key={control.id}
            control={control}
            response={state.responses[control.id]}
            onStatusChange={handleControlStatus}
            onEvidenceChange={handleControlEvidence}
            onCompletedToggle={handleControlComplete}
          />
        ))}
      </section>
    )
  }

  return (
    <div className="min-h-screen bg-app-pattern text-slate-800">
      <header className="relative overflow-hidden border-b border-cyan-950/20 bg-cyan-950 px-6 py-8 text-cyan-50 shadow-lg">
        <div className="absolute -right-12 -top-8 h-36 w-36 rounded-full bg-cyan-400/20 blur-2xl" />
        <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-lime-300/15 blur-xl" />
        <div className="mx-auto flex max-w-7xl flex-col gap-3">
          <p className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-cyan-200">
            <Compass className="h-4 w-4" />
            Azure Virtual Desktop Security Assessment App
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Structured security posture assessment for Azure Virtual Desktop
          </h1>
          <p className="max-w-4xl text-sm text-cyan-100 md:text-base">
            Built for architects, consultants, and enterprise teams to identify risk gaps, prioritize remediation,
            and align with CAF, APRL, FastTrack methodology, and practical Zero Trust controls.
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-4 px-4 py-6 lg:grid-cols-[310px_minmax(0,1fr)]">
        <SidebarStepper
          steps={visibleSteps}
          currentStep={currentStepIndex}
          completedStepIds={completedStepIds}
          onStepClick={(index) => {
            setVisitedStepIds((prev) => {
              const updated = new Set(prev)
              const step = visibleSteps[index]
              if (step) {
                updated.add(step.id)
              }
              return updated
            })
            setCurrentStepIndex(index)
          }}
        />

        <section className="space-y-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-900">
                  <Sparkles className="h-4 w-4" />
                  Step {currentStepIndex + 1} of {visibleSteps.length}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">{currentStep.title}</h2>
                <p className="text-sm text-slate-600">{currentStep.subtitle}</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                <Shield className="h-4 w-4 text-cyan-700" />
                Overall score: {summary.overallScore}%
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>Step progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-800 to-teal-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </article>

          {currentStep.id === 'discovery' ? renderDiscovery() : null}
          {currentStep.id !== 'discovery' && currentStep.id !== 'summary'
            ? renderDomainControls(currentStep.domainId)
            : null}
          {currentStep.id === 'summary' ? (
            <SummaryDashboard
              summary={summary}
              showHighRiskOnly={showHighRiskOnly}
              onToggleHighRiskOnly={() => setShowHighRiskOnly((prev) => !prev)}
              onExportJson={() => exportJsonReport(summary, state.discovery)}
              onExportMarkdown={() => exportMarkdownReport(summary, state.discovery)}
              onExportPptText={() => exportPptStyleText(summary, state.discovery)}
              onExportPdf={() => exportPdfReport(summary, state.discovery)}
              onExportPptx={() => {
                void exportPptxReport(summary, state.discovery)
              }}
            />
          ) : null}

          <article className="sticky bottom-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                <Building2 className="h-4 w-4 text-cyan-700" />
                Workshop-ready view with local state persistence simulation
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={currentStepIndex === 0}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentStepIndex((prev) => Math.min(prev + 1, visibleSteps.length - 1))
                  }
                  disabled={currentStepIndex === visibleSteps.length - 1}
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-900 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App
