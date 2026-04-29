export type RiskLevel = 'high' | 'medium' | 'low'
export type ControlStatus = 'unassessed' | 'yes' | 'partial' | 'no' | 'na'

export interface AssessmentControl {
  id: string
  domainId: DomainId
  title: string
  whyItMatters: string
  sourceMappings: string[]
  risk: RiskLevel
  impact: string
  recommendation: string
  notApplicableAllowed?: boolean
}

export interface ControlResponse {
  status: ControlStatus
  evidence: string
  completed: boolean
}

export interface DiscoveryInput {
  numberOfUsers: string
  regions: string
  clientTypes: string
  dependencies: string
  internetFacingApplications: 'yes' | 'no'
}

export type DomainId =
  | 'identity-access'
  | 'endpoint-device-security'
  | 'session-host-security'
  | 'network-connectivity'
  | 'private-access-zero-trust'
  | 'fslogix-storage'
  | 'data-protection'
  | 'waf-edge-security'
  | 'bcdr-resilience'
  | 'governance-compliance'
  | 'monitoring-operations'

export interface DomainDefinition {
  id: DomainId
  title: string
  description: string
  step: number
}

export interface DomainScore {
  domainId: DomainId
  title: string
  achieved: number
  possible: number
  percentage: number
}

export interface Finding {
  controlId: string
  domainId: DomainId
  controlTitle: string
  risk: RiskLevel
  status: Extract<ControlStatus, 'partial' | 'no'>
  impact: string
  recommendation: string
  evidence: string
}

export interface AssessmentSummary {
  overallScore: number
  domainScores: DomainScore[]
  findings: Finding[]
  gapHeatmap: Record<RiskLevel, number>
}
