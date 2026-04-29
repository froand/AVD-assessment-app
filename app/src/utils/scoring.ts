import { assessmentControls, domainDefinitions } from '../data/assessmentData'
import type {
  AssessmentSummary,
  ControlResponse,
  DomainId,
  DiscoveryInput,
  Finding,
  RiskLevel,
} from '../types/assessment'

const riskWeights: Record<RiskLevel, number> = {
  high: 5,
  medium: 3,
  low: 1,
}

const statusMultipliers: Record<ControlResponse['status'], number> = {
  unassessed: 0,
  yes: 1,
  partial: 0.5,
  no: 0,
  na: 0,
}

const toPercent = (achieved: number, possible: number): number => {
  if (possible <= 0) {
    return 100
  }

  return Math.round((achieved / possible) * 100)
}

const isControlInScope = (controlDomainId: DomainId, discovery: DiscoveryInput): boolean => {
  if (controlDomainId !== 'waf-edge-security') {
    return true
  }

  return discovery.internetFacingApplications === 'yes'
}

export const createInitialResponseMap = (): Record<string, ControlResponse> => {
  return assessmentControls.reduce<Record<string, ControlResponse>>((acc, control) => {
    acc[control.id] = {
      status: 'unassessed',
      evidence: '',
      completed: false,
    }
    return acc
  }, {})
}

export const getAssessmentSummary = (
  responses: Record<string, ControlResponse>,
  discovery: DiscoveryInput,
): AssessmentSummary => {
  const inScopeControls = assessmentControls.filter((control) =>
    isControlInScope(control.domainId, discovery),
  )

  let totalAchieved = 0
  let totalPossible = 0

  const findings: Finding[] = []
  const gapHeatmap: Record<RiskLevel, number> = {
    high: 0,
    medium: 0,
    low: 0,
  }

  const domainScores = domainDefinitions
    .filter((domain) => isControlInScope(domain.id, discovery))
    .map((domain) => {
      let achieved = 0
      let possible = 0

      inScopeControls
        .filter((control) => control.domainId === domain.id)
        .forEach((control) => {
          const response = responses[control.id]
          const weight = riskWeights[control.risk]

          if (response.status !== 'na' && response.status !== 'unassessed') {
            achieved += weight * statusMultipliers[response.status]
            possible += weight
            totalAchieved += weight * statusMultipliers[response.status]
            totalPossible += weight
          }

          if (response.status === 'no' || response.status === 'partial') {
            findings.push({
              controlId: control.id,
              domainId: control.domainId,
              controlTitle: control.title,
              risk: control.risk,
              status: response.status,
              impact: control.impact,
              recommendation: control.recommendation,
              evidence: response.evidence,
            })

            gapHeatmap[control.risk] += 1
          }
        })

      return {
        domainId: domain.id,
        title: domain.title,
        achieved,
        possible,
        percentage: toPercent(achieved, possible),
      }
    })

  findings.sort((a, b) => riskWeights[b.risk] - riskWeights[a.risk])

  return {
    overallScore: toPercent(totalAchieved, totalPossible),
    domainScores,
    findings,
    gapHeatmap,
  }
}
