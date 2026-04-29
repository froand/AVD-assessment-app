import type {
  AssessmentControl,
  ControlStatus,
  DiscoveryInput,
  DomainDefinition,
} from '../types/assessment'

export const statusOptions: { value: ControlStatus; label: string }[] = [
  { value: 'unassessed', label: 'Not Assessed Yet' },
  { value: 'yes', label: 'Yes' },
  { value: 'partial', label: 'Partial' },
  { value: 'no', label: 'No' },
  { value: 'na', label: 'Not Applicable' },
]

export const domainDefinitions: DomainDefinition[] = [
  {
    id: 'identity-access',
    title: 'Identity & Access',
    description:
      'Centralized identity, MFA, Conditional Access, RBAC, and privileged access controls aligned to MCSB IM/PA, Zero Trust, and AVD security guidance.',
    step: 2,
  },
  {
    id: 'endpoint-device-security',
    title: 'Endpoint & Device Security',
    description:
      'Security posture of user endpoints accessing AVD: Defender for Endpoint, Intune compliance, Token Protection, and device-trust signals.',
    step: 3,
  },
  {
    id: 'session-host-security',
    title: 'Session Host Security',
    description:
      'Host hardening, image management, EDR, Trusted Launch, VBS, application control, patching, and session boundary controls.',
    step: 4,
  },
  {
    id: 'network-connectivity',
    title: 'Network & Connectivity',
    description:
      'VNet placement, NSG/ASG segmentation, Reverse Connect posture, control plane reachability, RDP Shortpath, and egress filtering.',
    step: 5,
  },
  {
    id: 'private-access-zero-trust',
    title: 'Private Access / Zero Trust',
    description:
      'Private Link adoption, hub-spoke isolation, threat protection for storage, and adaptive access controls aligned to Zero Trust.',
    step: 6,
  },
  {
    id: 'fslogix-storage',
    title: 'FSLogix & Storage',
    description:
      'FSLogix architecture, Azure Files / ANF resilience, profile share separation per host pool, antivirus exclusions, and diagnostics.',
    step: 7,
  },
  {
    id: 'data-protection',
    title: 'Data Protection',
    description:
      'Encryption in transit and at rest, Key Vault integration, customer-managed keys, sensitive data classification, and DLP.',
    step: 8,
  },
  {
    id: 'waf-edge-security',
    title: 'WAF & Edge Security',
    description:
      'Edge protection for internet-facing applications associated with the AVD estate (only when applicable).',
    step: 9,
  },
  {
    id: 'bcdr-resilience',
    title: 'BCDR & Resilience',
    description:
      'Multi-region BCDR, Availability Zones, image replication, validation host pools, scaling plans, and Key Vault DR.',
    step: 10,
  },
  {
    id: 'governance-compliance',
    title: 'Governance & Compliance',
    description:
      'Azure Policy enforcement, AVD landing zone scale unit model, image governance, OU isolation, and regulatory posture tracking.',
    step: 11,
  },
  {
    id: 'monitoring-operations',
    title: 'Monitoring & Operations',
    description:
      'AVD Insights, Azure Monitor, audit logging, Service Health, Defender for Cloud Secure Score, and Azure Advisor reviews.',
    step: 12,
  },
]

export const initialDiscoveryInput: DiscoveryInput = {
  numberOfUsers: '',
  regions: '',
  clientTypes: '',
  dependencies: '',
  internetFacingApplications: 'no',
}

const SOURCES = {
  CAF: 'Microsoft CAF',
  MCSB: 'MCSB Baseline',
  AVD_SEC: 'AVD Security Recommendations',
  ZT: 'Zero Trust for AVD',
  APRL: 'APRL',
  WAF: 'WAF',
  FT: 'FastTrack Checklist',
} as const

export const assessmentControls: AssessmentControl[] = [
  // -------------------- IDENTITY & ACCESS --------------------
  {
    id: 'id-mfa-users',
    domainId: 'identity-access',
    title: 'MFA enforced for all Azure Virtual Desktop users and admins',
    whyItMatters:
      'MFA is the primary defense against credential theft for AVD sign-ins and administrative actions.',
    sourceMappings: [SOURCES.AVD_SEC, SOURCES.MCSB, SOURCES.ZT, SOURCES.FT],
    risk: 'high',
    impact: 'Single-factor sign-in materially increases account takeover and lateral movement risk.',
    recommendation:
      'Enforce phishing-resistant Microsoft Entra MFA for all AVD user and admin groups; validate coverage.',
  },
  {
    id: 'id-conditional-access',
    domainId: 'identity-access',
    title: 'Conditional Access policies applied to AVD apps and admin actions',
    whyItMatters:
      'Conditional Access enforces context-aware control by user, device, location, and risk before access is granted.',
    sourceMappings: [SOURCES.MCSB, SOURCES.AVD_SEC, SOURCES.ZT, SOURCES.CAF],
    risk: 'high',
    impact: 'Static access policies allow risky sign-ins from non-compliant devices and unsafe locations.',
    recommendation:
      'Define Conditional Access policy set for AVD with device compliance, location, and sign-in risk signals.',
  },
  {
    id: 'id-risk-based-ca',
    domainId: 'identity-access',
    title: 'Risk-based Conditional Access (user risk and sign-in risk) configured',
    whyItMatters:
      'Risk-adaptive access reduces exposure during credential theft or compromised endpoints.',
    sourceMappings: [SOURCES.ZT, SOURCES.CAF],
    risk: 'high',
    impact: 'High-risk identities can continue accessing sensitive sessions when policies are static.',
    recommendation:
      'Enable Identity Protection user-risk and sign-in-risk policies with require-MFA or block actions.',
  },
  {
    id: 'id-centralized-auth',
    domainId: 'identity-access',
    title: 'Microsoft Entra ID used as centralized authentication for AVD',
    whyItMatters:
      'Centralized identity simplifies governance, conditional control, and lifecycle management.',
    sourceMappings: [SOURCES.MCSB, SOURCES.CAF],
    risk: 'high',
    impact: 'Decentralized authentication weakens audit, consistency, and policy enforcement.',
    recommendation:
      'Standardize on Microsoft Entra ID as the authoritative AuthN for AVD users and administrators.',
  },
  {
    id: 'id-identity-resilience',
    domainId: 'identity-access',
    title: 'Identity resilience model documented and tested',
    whyItMatters:
      'Identity outages cascade into AVD logon failures and full service disruption.',
    sourceMappings: [SOURCES.APRL, SOURCES.WAF],
    risk: 'high',
    impact: 'Authentication disruptions block user logons and break business continuity.',
    recommendation:
      'Document failover, sync health, and break-glass identity scenarios; validate via tabletop exercises.',
  },
  {
    id: 'id-domain-join-account',
    domainId: 'identity-access',
    title: 'Dedicated least-privileged account used for session host domain join',
    whyItMatters:
      'A scoped domain-join account limits blast radius if credentials leak from automation.',
    sourceMappings: [SOURCES.ZT],
    risk: 'medium',
    impact: 'Privileged join accounts can be reused to compromise broader directory objects.',
    recommendation:
      'Create a dedicated AD/Entra Domain Services account with least privilege for session host join only.',
  },
  {
    id: 'id-managed-identities',
    domainId: 'identity-access',
    title: 'Managed identities used for AVD-related automation where supported',
    whyItMatters:
      'Managed identities remove credential storage risks vs. service principals or secrets.',
    sourceMappings: [SOURCES.MCSB],
    risk: 'medium',
    impact: 'Hard-coded credentials and unrotated secrets increase compromise risk.',
    recommendation:
      'Prefer managed identities; if service principals are required, manage them via secret rotation and Key Vault.',
  },
  {
    id: 'id-rbac-least-priv',
    domainId: 'identity-access',
    title: 'Azure RBAC uses least-privilege built-in roles for AVD',
    whyItMatters:
      'Built-in AVD roles provide just-enough access and reduce risk of overprivileged operators.',
    sourceMappings: [SOURCES.MCSB, SOURCES.CAF],
    risk: 'high',
    impact: 'Excessive permissions enable destructive actions and broaden insider risk.',
    recommendation:
      'Audit role assignments, prefer built-in AVD roles, and review group memberships periodically.',
  },
  {
    id: 'id-local-admin-restrict',
    domainId: 'identity-access',
    title: 'Local admin accounts on session hosts disabled or restricted to break-glass',
    whyItMatters:
      'Active local admin accounts bypass directory controls and weaken audit and security boundaries.',
    sourceMappings: [SOURCES.MCSB, SOURCES.AVD_SEC],
    risk: 'high',
    impact: 'Local admin compromise bypasses central RBAC and identity governance.',
    recommendation:
      'Disable interactive local admin where possible; manage emergency access with vaulted credentials and rotation.',
  },
  {
    id: 'id-tiered-admin',
    domainId: 'identity-access',
    title: 'Tiered admin model applied; users do not have local admin in pooled hosts',
    whyItMatters:
      'Granting users admin in multi-session crosses session and data security boundaries.',
    sourceMappings: [SOURCES.AVD_SEC],
    risk: 'high',
    impact: 'Privilege escalation can enable lateral movement, persistence, and data exposure.',
    recommendation:
      'Use personal host pools when admin is required; otherwise restrict admin via tiered access.',
  },
  {
    id: 'id-jit-access',
    domainId: 'identity-access',
    title: 'Just-in-time (JIT) VM access used for any direct RDP administration',
    whyItMatters:
      'JIT eliminates standing inbound access and limits attack surface for admin operations.',
    sourceMappings: [SOURCES.AVD_SEC, SOURCES.MCSB],
    risk: 'medium',
    impact: 'Standing admin RDP exposure increases risk of brute force and unauthorized session use.',
    recommendation:
      'Enable Defender for Cloud JIT and require approval/time-bound access to session hosts.',
  },
  {
    id: 'id-token-protection',
    domainId: 'identity-access',
    title: 'Token Protection required on Windows App endpoints connecting to AVD',
    whyItMatters:
      'Token Protection binds tokens to the device and reduces token replay attacks.',
    sourceMappings: [SOURCES.AVD_SEC],
    risk: 'medium',
    impact: 'Stolen tokens can be replayed without device binding controls in place.',
    recommendation:
      'Apply Conditional Access Token Protection requirement scoped to supported Windows App endpoints.',
    notApplicableAllowed: true,
  },
  {
    id: 'id-global-secure-access',
    domainId: 'identity-access',
    title: 'Global Secure Access (GSA) configured where required for private/M365 access',
    whyItMatters:
      'GSA extends Conditional Access enforcement consistently to private apps, internet apps, and M365.',
    sourceMappings: [SOURCES.AVD_SEC],
    risk: 'low',
    impact: 'Inconsistent network access controls weaken Zero Trust assurances.',
    recommendation:
      'Evaluate GSA where unified secure access is required, including B2B guest scenarios.',
    notApplicableAllowed: true,
  },

  // -------------------- ENDPOINT & DEVICE SECURITY --------------------
  {
    id: 'ep-defender-endpoint',
    domainId: 'endpoint-device-security',
    title: 'Microsoft Defender for Endpoint deployed to user devices accessing AVD',
    whyItMatters:
      'Endpoint detection on the connecting device reduces compromise risk before users reach AVD sessions.',
    sourceMappings: [SOURCES.ZT, SOURCES.AVD_SEC],
    risk: 'high',
    impact: 'Compromised endpoints can pivot into AVD and exfiltrate data via redirection paths.',
    recommendation:
      'Onboard endpoints to Defender for Endpoint and ensure alerts feed into central SOC tooling.',
  },
  {
    id: 'ep-intune-compliance',
    domainId: 'endpoint-device-security',
    title: 'Endpoints managed by Intune with compliance baselines enforced',
    whyItMatters:
      'Intune provides device posture signals required for Conditional Access and Zero Trust verification.',
    sourceMappings: [SOURCES.ZT, SOURCES.AVD_SEC],
    risk: 'medium',
    impact: 'Without device management, AVD entry trust assumptions are weak.',
    recommendation:
      'Manage corporate endpoints in Intune and enforce compliance policies (encryption, OS, security baselines).',
  },
  {
    id: 'ep-device-compliance-ca',
    domainId: 'endpoint-device-security',
    title: 'Conditional Access requires compliant or hybrid-joined devices for AVD',
    whyItMatters:
      'Restricting AVD to managed devices reduces malware and unauthorized device risks.',
    sourceMappings: [SOURCES.ZT, SOURCES.CAF],
    risk: 'medium',
    impact: 'Unmanaged personal devices may carry malware that abuses AVD redirection or session data.',
    recommendation:
      'Add device-compliance grant requirement to AVD Conditional Access policies where feasible.',
  },
  {
    id: 'ep-anti-malware',
    domainId: 'endpoint-device-security',
    title: 'Anti-malware solution active on endpoints with health monitoring',
    whyItMatters:
      'Continuous AV protection and signature health is required to detect modern threats.',
    sourceMappings: [SOURCES.MCSB],
    risk: 'medium',
    impact: 'Out-of-date or disabled AV reduces detection efficacy on user devices.',
    recommendation:
      'Standardize on Microsoft Defender Antivirus or equivalent and monitor signature/engine health.',
  },

  // -------------------- SESSION HOST SECURITY --------------------
  {
    id: 'sh-trusted-launch',
    domainId: 'session-host-security',
    title: 'Trusted Launch with Secure Boot enabled on session hosts',
    whyItMatters:
      'Trusted Launch protects host integrity at boot and detects rootkit-style tampering.',
    sourceMappings: [SOURCES.AVD_SEC, SOURCES.CAF],
    risk: 'high',
    impact: 'Without boot integrity controls, persistent malware risk on host VMs is elevated.',
    recommendation:
      'Enable Trusted Launch and Secure Boot on supported session host SKUs and validate compliance drift.',
  },
  {
    id: 'sh-vtpm',
    domainId: 'session-host-security',
    title: 'vTPM enabled on session host VMs',
    whyItMatters:
      'vTPM enables remote attestation of boot integrity and underpins disk encryption features.',
    sourceMappings: [SOURCES.AVD_SEC],
    risk: 'medium',
    impact: 'No vTPM weakens attestation and limits available encryption/credential isolation features.',
    recommendation:
      'Enable vTPM as part of the Trusted Launch baseline and pair with attestation alerts.',
  },
  {
    id: 'sh-vbs-hvci',
    domainId: 'session-host-security',
    title: 'Virtualization-based Security (VBS) and HVCI enabled',
    whyItMatters:
      'VBS/HVCI isolate kernel mode and protect against unsigned or malicious code execution.',
    sourceMappings: [SOURCES.AVD_SEC],
    risk: 'medium',
    impact: 'Kernel-level threats can bypass standard endpoint protections without VBS/HVCI.',
    recommendation:
      'Enable VBS and HVCI via images or Group Policy and validate compatibility with required software.',
  },
  {
    id: 'sh-credential-guard',
    domainId: 'session-host-security',
    title: 'Windows Defender Credential Guard enabled',
    whyItMatters:
      'Credential Guard isolates and protects secrets, mitigating Pass-the-Hash and similar attacks.',
    sourceMappings: [SOURCES.AVD_SEC],
    risk: 'medium',
    impact: 'Without isolation, captured credentials enable rapid lateral movement.',
    recommendation:
      'Enable Credential Guard via images or Intune and validate authentication compatibility for legacy apps.',
  },
  {
    id: 'sh-app-control',
    domainId: 'session-host-security',
    title: 'Application control baseline (App Control / WDAC or AppLocker) implemented',
    whyItMatters:
      'Allow-listing prevents execution of unauthorized binaries, especially in pooled multi-session hosts.',
    sourceMappings: [SOURCES.AVD_SEC, SOURCES.MCSB],
    risk: 'high',
    impact: 'Users or threat actors can execute untrusted software in shared session hosts.',
    recommendation:
      'Deploy App Control/WDAC or AppLocker policies in audit mode first, then enforce after validation.',
  },
  {
    id: 'sh-defender-for-cloud',
    domainId: 'session-host-security',
    title: 'Defender for Cloud (Defender for Servers) enabled for session host resources',
    whyItMatters:
      'Server plan provides EDR integration, vulnerability assessment, and just-in-time protections.',
    sourceMappings: [SOURCES.AVD_SEC, SOURCES.MCSB, SOURCES.CAF],
    risk: 'high',
    impact: 'Limited visibility into misconfigurations and endpoint threats delays remediation.',
    recommendation:
      'Enable Defender for Servers and ensure recommendations and alerts are routed for triage.',
  },
  {
    id: 'sh-edr-defender-endpoint',
    domainId: 'session-host-security',
    title: 'Microsoft Defender for Endpoint deployed on session hosts as EDR',
    whyItMatters:
      'EDR adds advanced detection, investigation, and response on virtualized endpoints.',
    sourceMappings: [SOURCES.AVD_SEC, SOURCES.MCSB, SOURCES.ZT],
    risk: 'high',
    impact: 'Without EDR, advanced post-compromise activity may go undetected.',
    recommendation:
      'Onboard session hosts to Defender for Endpoint via Defender for Cloud integration or direct deployment.',
  },
  {
    id: 'sh-anti-malware',
    domainId: 'session-host-security',
    title: 'Anti-malware (Microsoft Defender Antivirus) configured with FSLogix exclusions',
    whyItMatters:
      'Required exclusions prevent profile corruption while preserving real-time protection.',
    sourceMappings: [SOURCES.AVD_SEC, SOURCES.MCSB],
    risk: 'medium',
    impact: 'Missing exclusions can corrupt profile containers; missing AV reduces detection coverage.',
    recommendation:
      'Apply documented FSLogix antivirus exclusions and verify Defender Antivirus health.',
  },
  {
    id: 'sh-os-disk-encryption',
    domainId: 'session-host-security',
    title: 'Operating system disk encryption enabled on session hosts',
    whyItMatters:
      'Disk encryption protects host data from unauthorized offline access.',
    sourceMappings: [SOURCES.AVD_SEC],
    risk: 'medium',
    impact: 'Unencrypted disks risk exposure if subscription or storage layer is compromised.',
    recommendation:
      'Enable platform-managed disk encryption and use confidential compute disk encryption where required.',
  },
  {
    id: 'sh-confidential-vm',
    domainId: 'session-host-security',
    title: 'Confidential VMs evaluated for sensitive workloads',
    whyItMatters:
      'Confidential VMs add hardware-based memory encryption for higher-sensitivity scenarios.',
    sourceMappings: [SOURCES.AVD_SEC],
    risk: 'low',
    impact: 'Sensitive workloads may not meet compliance assurance without confidential compute.',
    recommendation:
      'Assess data sensitivity and consider confidential VMs for regulated or high-trust workloads.',
    notApplicableAllowed: true,
  },
  {
    id: 'sh-vuln-assessment',
    domainId: 'session-host-security',
    title: 'Vulnerability assessment integrated via Defender Vulnerability Management',
    whyItMatters:
      'Continuous vulnerability discovery is essential to prioritize patching and reduce exposure.',
    sourceMappings: [SOURCES.AVD_SEC, SOURCES.MCSB],
    risk: 'high',
    impact: 'Unknown vulnerabilities accumulate and increase exploit risk.',
    recommendation:
      'Enable Defender Vulnerability Management and incorporate findings into a remediation backlog.',
  },
  {
    id: 'sh-patch-management',
    domainId: 'session-host-security',
    title: 'Patch management process for session hosts and base images',
    whyItMatters:
      'Timely patching closes known exploit paths and reduces breach likelihood.',
    sourceMappings: [SOURCES.AVD_SEC, SOURCES.MCSB],
    risk: 'high',
    impact: 'Outdated images and hosts present trivial exploitation opportunities.',
    recommendation:
      'Patch base images monthly and replace hosts via image updates rather than in-place patching where possible.',
  },
  {
    id: 'sh-image-replacement',
    domainId: 'session-host-security',
    title: 'Updated image versions replace session hosts rather than in-place updates',
    whyItMatters:
      'Image-based update process minimizes drift and ensures consistent secure baselines.',
    sourceMappings: [SOURCES.APRL],
    risk: 'low',
    impact: 'In-place updates create configuration drift and inconsistent security posture.',
    recommendation:
      'Adopt golden image lifecycle: build, test, version, replicate, and roll out via host replacement.',
  },
  {
    id: 'sh-hardened-image',
    domainId: 'session-host-security',
    title: 'Hardened (golden) images from trusted sources used as the host baseline',
    whyItMatters:
      'Pre-hardened images reduce time-to-secure and standardize control coverage.',
    sourceMappings: [SOURCES.MCSB, SOURCES.AVD_SEC],
    risk: 'medium',
    impact: 'Custom or unmanaged images can ship with insecure defaults or unverified software.',
    recommendation:
      'Use Microsoft-published hardened images or build a controlled, attested golden image pipeline.',
  },
  {
    id: 'sh-windows-update',
    domainId: 'session-host-security',
    title: 'Windows Update / Update Manager strategy active for session hosts',
    whyItMatters:
      'A managed update channel prevents stale OS state and protocol drift.',
    sourceMappings: [SOURCES.AVD_SEC],
    risk: 'medium',
    impact: 'Unmanaged update flow leaves hosts vulnerable and inconsistent.',
    recommendation:
      'Use Azure Update Manager or equivalent with maintenance windows aligned to host pool model.',
  },
  {
    id: 'sh-idle-timeout',
    domainId: 'session-host-security',
    title: 'Inactive session timeout and disconnection policies configured',
    whyItMatters:
      'Idle session controls reduce exposure to abandoned-session abuse and resource waste.',
    sourceMappings: [SOURCES.AVD_SEC],
    risk: 'low',
    impact: 'Unattended sessions can be reused if endpoints are physically compromised.',
    recommendation:
      'Configure idle disconnect/logoff thresholds balanced with user productivity requirements.',
  },
  {
    id: 'sh-screen-lock',
    domainId: 'session-host-security',
    title: 'Idle session screen lock policy enabled',
    whyItMatters:
      'Screen locks reduce unattended session abuse from local device exposure.',
    sourceMappings: [SOURCES.AVD_SEC],
    risk: 'low',
    impact: 'Unlocked sessions on shared endpoints expose user data.',
    recommendation:
      'Configure screen lock policies that require re-authentication after idle thresholds.',
  },
  {
    id: 'sh-redirection-controls',
    domainId: 'session-host-security',
    title: 'Device redirection (drives, clipboard, printer, USB) restricted per policy',
    whyItMatters:
      'Redirection paths can leak data or import malicious content into the session host.',
    sourceMappings: [SOURCES.AVD_SEC],
    risk: 'medium',
    impact: 'Permissive redirection enables data exfiltration and malware import vectors.',
    recommendation:
      'Restrict redirection by data sensitivity and consider OneDrive, Universal Print, and unidirectional clipboard.',
  },
  {
    id: 'sh-explorer-restriction',
    domainId: 'session-host-security',
    title: 'Restrict Windows Explorer exposure of local/remote drives',
    whyItMatters:
      'Hiding mappings prevents users from discovering unintended system or user data.',
    sourceMappings: [SOURCES.AVD_SEC],
    risk: 'low',
    impact: 'Discoverable mappings can reveal data and aid reconnaissance.',
    recommendation:
      'Apply policies to hide unnecessary drive mappings while preserving usability.',
  },
  {
    id: 'sh-no-direct-rdp',
    domainId: 'session-host-security',
    title: 'No direct RDP access to session hosts; admin uses approved paths',
    whyItMatters:
      'Direct RDP for admins increases lateral movement risk and bypasses Reverse Connect protections.',
    sourceMappings: [SOURCES.AVD_SEC],
    risk: 'high',
    impact: 'Open RDP admin paths broaden exposure for credential abuse.',
    recommendation:
      'Avoid persistent admin RDP and require Bastion or JIT access with audited approvals.',
  },
  {
    id: 'sh-host-pool-trust-model',
    domainId: 'session-host-security',
    title: 'Host pool model aligns with trust boundaries (multi-session vs personal)',
    whyItMatters:
      'Pooled hosts only suit users with high trust; personal hosts protect higher-privilege users.',
    sourceMappings: [SOURCES.AVD_SEC],
    risk: 'medium',
    impact: 'Mismatch between trust and pool model erodes security boundaries.',
    recommendation:
      'Map user personas to pool type and isolate users from different organizations into separate tenants/subscriptions.',
  },
  {
    id: 'sh-m365-policy-advisor',
    domainId: 'session-host-security',
    title: 'Microsoft 365 apps secured via Security Policy Advisor recommendations',
    whyItMatters:
      'M365 apps are common attack surface inside session hosts; baseline policies reduce risk.',
    sourceMappings: [SOURCES.AVD_SEC],
    risk: 'low',
    impact: 'Default M365 settings can leave macros and content controls weakly configured.',
    recommendation:
      'Apply recommended Security Policy Advisor controls scoped by impact and productivity tradeoffs.',
    notApplicableAllowed: true,
  },

  // -------------------- NETWORK & CONNECTIVITY --------------------
  {
    id: 'net-no-inbound',
    domainId: 'network-connectivity',
    title: 'No direct inbound RDP exposure; Reverse Connect preserved',
    whyItMatters:
      'Reverse Connect avoids exposing inbound listeners and is a foundational AVD security feature.',
    sourceMappings: [SOURCES.AVD_SEC, SOURCES.CAF],
    risk: 'high',
    impact: 'Inbound exposure significantly increases brute-force and exploitation risk.',
    recommendation:
      'Remove inbound RDP NSG exposure and validate all sessions traverse the AVD service.',
  },
  {
    id: 'net-vnet-placement',
    domainId: 'network-connectivity',
    title: 'Session host VMs deployed inside customer VNet with private addressing',
    whyItMatters:
      'VNet placement enables network controls, segmentation, and private connectivity to dependencies.',
    sourceMappings: [SOURCES.MCSB, SOURCES.CAF],
    risk: 'high',
    impact: 'Improper placement weakens isolation and forces public-path dependencies.',
    recommendation:
      'Place session hosts in dedicated subnets in your VNet with private IPs and proper segmentation.',
  },
  {
    id: 'net-nsg-asg',
    domainId: 'network-connectivity',
    title: 'NSGs and ASGs applied per AVD persona and host pool subnet',
    whyItMatters:
      'Persona-based NSG/ASG segmentation enforces least-network-privilege between workload tiers.',
    sourceMappings: [SOURCES.MCSB, SOURCES.APRL, SOURCES.ZT],
    risk: 'medium',
    impact: 'Coarse rules permit unnecessary east-west traffic and broaden lateral movement.',
    recommendation:
      'Define ASGs per persona and tightly scoped NSG rules for each subnet/host pool.',
  },
  {
    id: 'net-hub-spoke',
    domainId: 'network-connectivity',
    title: 'Hub-and-spoke or vWAN topology aligned to AVD landing zone',
    whyItMatters:
      'A consistent topology supports centralized inspection, governance, and growth across regions.',
    sourceMappings: [SOURCES.CAF, SOURCES.ZT, SOURCES.APRL],
    risk: 'medium',
    impact: 'Ad-hoc topologies degrade governance and complicate connectivity controls.',
    recommendation:
      'Adopt enterprise-scale landing zone topology with hub VNet for shared services and inspection.',
  },
  {
    id: 'net-egress-firewall',
    domainId: 'network-connectivity',
    title: 'Egress filtered through Azure Firewall or NVA with AVD FQDN tag',
    whyItMatters:
      'Centralized egress inspection limits data exfiltration paths and enforces required AVD URLs.',
    sourceMappings: [SOURCES.ZT, SOURCES.AVD_SEC, SOURCES.CAF],
    risk: 'medium',
    impact: 'Unfiltered egress increases data exfiltration and command-and-control risk.',
    recommendation:
      'Force traffic through Azure Firewall using UDRs and use the AVD FQDN tag and required URLs.',
  },
  {
    id: 'net-control-plane-reach',
    domainId: 'network-connectivity',
    title: 'AVD control plane reachability validated from each host pool',
    whyItMatters:
      'Control plane endpoints are mandatory for brokering, agent updates, and diagnostics.',
    sourceMappings: [SOURCES.APRL, SOURCES.FT],
    risk: 'medium',
    impact: 'Endpoint reachability gaps cause registration failures and degraded experience.',
    recommendation:
      'Validate required FQDNs and service tags and monitor changes to dependency endpoints.',
  },
  {
    id: 'net-static-routes-control-plane',
    domainId: 'network-connectivity',
    title: 'Static routes for session host control plane traffic configured',
    whyItMatters:
      'Direct routes for trusted control plane traffic avoid unnecessary inspection latency and hops.',
    sourceMappings: [SOURCES.APRL],
    risk: 'low',
    impact: 'Indirect paths add latency and can introduce reliability issues.',
    recommendation:
      'Configure UDRs with static next-hop routes for AVD control plane service tags.',
  },
  {
    id: 'net-shortpath',
    domainId: 'network-connectivity',
    title: 'UDP / RDP Shortpath configured and validated where applicable',
    whyItMatters:
      'Shortpath improves transport reliability and consistent latency for users.',
    sourceMappings: [SOURCES.AVD_SEC, SOURCES.APRL],
    risk: 'low',
    impact: 'Suboptimal transport increases user experience issues and support volume.',
    recommendation:
      'Validate Shortpath prerequisites (UDP ports) and monitor transport negotiation success.',
    notApplicableAllowed: true,
  },
  {
    id: 'net-route-redundancy',
    domainId: 'network-connectivity',
    title: 'Route tables / route server redundancy across regions',
    whyItMatters:
      'Redundant routing supports resilient connectivity to on-premises and cross-region failover.',
    sourceMappings: [SOURCES.APRL],
    risk: 'medium',
    impact: 'Single-region routing path can prevent failover during disaster scenarios.',
    recommendation:
      'Configure secondary route tables/route servers in DR regions with parity to primary.',
  },
  {
    id: 'net-ip-segmentation',
    domainId: 'network-connectivity',
    title: 'Separate IP space and NSGs maintained between Prod and DR environments',
    whyItMatters:
      'Distinct IP and policy boundaries prevent contention, misrouting, and cross-environment risk.',
    sourceMappings: [SOURCES.APRL],
    risk: 'medium',
    impact: 'Overlapping address space causes routing failures during DR activation.',
    recommendation:
      'Plan non-overlapping IPAM across Prod, DR, and on-premises with documented allocations.',
  },
  {
    id: 'net-dependency-map',
    domainId: 'network-connectivity',
    title: 'External dependency map (AD, DNS, storage, on-prem) maintained',
    whyItMatters:
      'Explicit dependencies aid resilience design, troubleshooting, and blast radius analysis.',
    sourceMappings: [SOURCES.APRL, SOURCES.WAF],
    risk: 'medium',
    impact: 'Unknown dependencies extend outages and complicate incident response.',
    recommendation:
      'Document a dependency matrix with owners, SLAs, and impact-of-failure assessments.',
  },

  // -------------------- PRIVATE ACCESS / ZERO TRUST --------------------
  {
    id: 'pz-avd-private-link',
    domainId: 'private-access-zero-trust',
    title: 'Azure Virtual Desktop Private Link used for service endpoints',
    whyItMatters:
      'AVD Private Link removes public endpoint dependency for AVD service connections.',
    sourceMappings: [SOURCES.MCSB, SOURCES.ZT, SOURCES.AVD_SEC],
    risk: 'medium',
    impact: 'Public-only access paths increase exposure and complicate Zero Trust posture.',
    recommendation:
      'Adopt AVD Private Link for control/data plane access where supported by client and topology.',
    notApplicableAllowed: true,
  },
  {
    id: 'pz-storage-keyvault-pl',
    domainId: 'private-access-zero-trust',
    title: 'Private Link used for storage and Key Vault dependencies',
    whyItMatters:
      'Private endpoints reduce internet exposure for sensitive data services.',
    sourceMappings: [SOURCES.ZT, SOURCES.MCSB, SOURCES.CAF],
    risk: 'medium',
    impact: 'Public endpoints widen attack surface and complicate access policy.',
    recommendation:
      'Enable private endpoints for FSLogix storage, Key Vault, and other critical AVD dependencies.',
  },
  {
    id: 'pz-spoke-isolation',
    domainId: 'private-access-zero-trust',
    title: 'Spoke VNet isolation between distinct host pools',
    whyItMatters:
      'Isolating host pools limits blast radius from per-pool compromise.',
    sourceMappings: [SOURCES.ZT, SOURCES.APRL],
    risk: 'medium',
    impact: 'Shared spoke networks let an issue in one host pool affect others.',
    recommendation:
      'Use separate spoke VNets/subnets per host pool with NSG rules anchored to required AVD URLs.',
  },
  {
    id: 'pz-defender-storage',
    domainId: 'private-access-zero-trust',
    title: 'Defender for Storage enabled on AVD storage accounts',
    whyItMatters:
      'Defender for Storage provides automated threat protection on profile and app attach data.',
    sourceMappings: [SOURCES.ZT],
    risk: 'medium',
    impact: 'Storage-layer threats can go undetected without service-aware protection.',
    recommendation:
      'Enable Defender for Storage on all AVD-related storage accounts.',
  },
  {
    id: 'pz-er-vpn',
    domainId: 'private-access-zero-trust',
    title: 'VPN or ExpressRoute used where private enterprise connectivity is required',
    whyItMatters:
      'Private connectivity supports compliance and trust requirements for hybrid scenarios.',
    sourceMappings: [SOURCES.WAF, SOURCES.CAF],
    risk: 'medium',
    impact: 'Reliance on public path may conflict with regulatory or enterprise security requirements.',
    recommendation:
      'Align connectivity choice to data sensitivity, latency, and compliance constraints.',
    notApplicableAllowed: true,
  },

  // -------------------- FSLOGIX & STORAGE --------------------
  {
    id: 'fs-redundancy',
    domainId: 'fslogix-storage',
    title: 'FSLogix profile storage configured with appropriate redundancy',
    whyItMatters:
      'Profile data availability is critical for user logon and continuity.',
    sourceMappings: [SOURCES.AVD_SEC, SOURCES.APRL],
    risk: 'high',
    impact: 'Storage outages block user logons and risk profile data loss.',
    recommendation:
      'Choose ZRS/GZRS for Azure Files or HA tiers for ANF based on user count and SLA needs.',
  },
  {
    id: 'fs-zrs-region',
    domainId: 'fslogix-storage',
    title: 'Zone-redundant or region-redundant storage selected for profiles where required',
    whyItMatters:
      'Zone/region redundancy protects against zonal failure and supports BCDR objectives.',
    sourceMappings: [SOURCES.APRL],
    risk: 'medium',
    impact: 'LRS-only storage cannot survive zonal incidents and may breach DR objectives.',
    recommendation:
      'Match storage redundancy SKU to user-impact and BCDR requirements.',
  },
  {
    id: 'fs-backup',
    domainId: 'fslogix-storage',
    title: 'Backup enabled for FSLogix file shares with tested restore',
    whyItMatters:
      'Tested restore is the only proof that backup actually protects users.',
    sourceMappings: [SOURCES.MCSB, SOURCES.APRL, SOURCES.WAF],
    risk: 'high',
    impact: 'Untested backups risk failed restores during incidents.',
    recommendation:
      'Enable Azure Backup for file shares and perform routine restore validation.',
  },
  {
    id: 'fs-permissions',
    domainId: 'fslogix-storage',
    title: 'File share permissions follow least privilege per AVD guidance',
    whyItMatters:
      'Over-permissive ACLs expose user profile data and increase insider risk.',
    sourceMappings: [SOURCES.AVD_SEC],
    risk: 'high',
    impact: 'Excessive ACL inheritance enables unauthorized profile access.',
    recommendation:
      'Validate FSLogix ACL baseline and remove inherited excessive rights.',
  },
  {
    id: 'fs-diagnostics',
    domainId: 'fslogix-storage',
    title: 'FSLogix and storage diagnostics enabled with retention',
    whyItMatters:
      'Diagnostics accelerate root cause analysis for profile attach and logon issues.',
    sourceMappings: [SOURCES.APRL, SOURCES.MCSB],
    risk: 'low',
    impact: 'Troubleshooting is slower without consistent diagnostics.',
    recommendation:
      'Enable diagnostic settings and consolidate into AVD Insights / Log Analytics.',
  },
  {
    id: 'fs-one-share-per-account',
    domainId: 'fslogix-storage',
    title: 'One FSLogix file share per Azure Files storage account',
    whyItMatters:
      'Single file share per account maximizes capacity and performance ceilings.',
    sourceMappings: [SOURCES.APRL],
    risk: 'medium',
    impact: 'Multiple shares per account hit storage account limits and degrade performance.',
    recommendation:
      'Architect one file share per Azure Files account for FSLogix profiles.',
  },
  {
    id: 'fs-share-per-host-pool',
    domainId: 'fslogix-storage',
    title: 'Dedicated FSLogix file share and configuration per host pool',
    whyItMatters:
      'Per-pool isolation reduces contention and simplifies blast radius management.',
    sourceMappings: [SOURCES.APRL],
    risk: 'medium',
    impact: 'Shared file shares across host pools cause contention and operational coupling.',
    recommendation:
      'Provision one FSLogix share per host pool with consistent configuration.',
  },
  {
    id: 'fs-standard-config',
    domainId: 'fslogix-storage',
    title: 'Standard FSLogix configuration deployed and consistent across hosts',
    whyItMatters:
      'Configuration drift produces unpredictable user experience and reliability issues.',
    sourceMappings: [SOURCES.APRL],
    risk: 'medium',
    impact: 'Inconsistent settings cause profile attach failures and support load.',
    recommendation:
      'Define FSLogix baseline (settings, exclusions, redirections) and enforce via images/Intune.',
  },
  {
    id: 'fs-agent-updates',
    domainId: 'fslogix-storage',
    title: 'FSLogix agent kept up to date',
    whyItMatters:
      'Updates address bugs and reliability issues; current versions are required for support.',
    sourceMappings: [SOURCES.APRL],
    risk: 'low',
    impact: 'Outdated agents may be unsupported during incidents.',
    recommendation:
      'Establish a recurring process to validate and roll out FSLogix updates.',
  },
  {
    id: 'fs-app-attach-share',
    domainId: 'fslogix-storage',
    title: 'App Attach uses dedicated file share included in DR plan',
    whyItMatters:
      'Separating app attach from profiles improves performance and simplifies DR.',
    sourceMappings: [SOURCES.APRL],
    risk: 'medium',
    impact: 'Co-located shares cause contention and complicate recovery.',
    recommendation:
      'Provision a dedicated app attach share, in-region, and include in BCDR plans.',
    notApplicableAllowed: true,
  },
  {
    id: 'fs-anf-continuous-availability',
    domainId: 'fslogix-storage',
    title: 'Continuous availability enabled for ANF (when used)',
    whyItMatters:
      'Continuous availability stabilizes SMB sessions for FSLogix workloads on ANF.',
    sourceMappings: [SOURCES.APRL],
    risk: 'medium',
    impact: 'Session interruptions risk profile load failures during failover.',
    recommendation:
      'Enable continuous availability and validate user counts per SMB path.',
    notApplicableAllowed: true,
  },
  {
    id: 'fs-av-exclusions',
    domainId: 'fslogix-storage',
    title: 'Antivirus exclusions configured for FSLogix VHDX files',
    whyItMatters:
      'Recommended exclusions prevent profile corruption and performance issues.',
    sourceMappings: [SOURCES.AVD_SEC],
    risk: 'medium',
    impact: 'Missing exclusions can corrupt profile containers under load.',
    recommendation:
      'Apply documented FSLogix antivirus exclusions on all session hosts.',
  },

  // -------------------- DATA PROTECTION --------------------
  {
    id: 'dp-in-transit',
    domainId: 'data-protection',
    title: 'Data in transit encryption verified for AVD traffic',
    whyItMatters:
      'AVD traffic is encrypted in transit by default; verification confirms no policy regressions.',
    sourceMappings: [SOURCES.MCSB],
    risk: 'medium',
    impact: 'Misconfigured TLS or transport could weaken confidentiality of user sessions.',
    recommendation:
      'Validate TLS policies and that no insecure protocols are permitted in dependent services.',
  },
  {
    id: 'dp-at-rest',
    domainId: 'data-protection',
    title: 'Data at rest encryption verified for managed disks and storage accounts',
    whyItMatters:
      'Platform-key encryption is on by default; verification confirms it has not been disabled.',
    sourceMappings: [SOURCES.MCSB, SOURCES.AVD_SEC],
    risk: 'medium',
    impact: 'Disabled encryption increases exposure of disks and profile data.',
    recommendation:
      'Confirm encryption-at-rest is active for OS disks, data disks, and storage accounts.',
  },
  {
    id: 'dp-cmk',
    domainId: 'data-protection',
    title: 'Customer-managed keys (CMK) used where compliance requires',
    whyItMatters:
      'CMK supports compliance-driven key control and rotation requirements.',
    sourceMappings: [SOURCES.MCSB, SOURCES.CAF],
    risk: 'medium',
    impact: 'Some regulatory regimes require customer-managed cryptographic control.',
    recommendation:
      'Configure CMK with Disk Encryption Sets and storage CMK where compliance dictates.',
    notApplicableAllowed: true,
  },
  {
    id: 'dp-keyvault',
    domainId: 'data-protection',
    title: 'Azure Key Vault used for AVD-related secrets and certificates',
    whyItMatters:
      'Key Vault centralizes secret/certificate management with strong access control.',
    sourceMappings: [SOURCES.MCSB, SOURCES.CAF],
    risk: 'medium',
    impact: 'Hardcoded or scattered secrets increase compromise and rotation difficulty.',
    recommendation:
      'Store secrets and certs in Key Vault and enable purge protection and access policy review.',
  },
  {
    id: 'dp-classification',
    domainId: 'data-protection',
    title: 'Sensitive data classification (Purview / AIP) applied to AVD content',
    whyItMatters:
      'Classification underpins effective DLP and access control decisions.',
    sourceMappings: [SOURCES.MCSB],
    risk: 'low',
    impact: 'Without classification, DLP and protection cannot be precisely targeted.',
    recommendation:
      'Roll out Purview / AIP classification within session hosts and connected workloads.',
    notApplicableAllowed: true,
  },
  {
    id: 'dp-dlp',
    domainId: 'data-protection',
    title: 'Data Loss Prevention controls applied where required',
    whyItMatters:
      'DLP reduces exfiltration risk through endpoint, M365, and host-based channels.',
    sourceMappings: [SOURCES.MCSB],
    risk: 'medium',
    impact: 'Without DLP, sensitive data can leave AVD via redirection, copy/paste, or email.',
    recommendation:
      'Pair AIP/Purview labels with M365 DLP policies and host-based controls as needed.',
    notApplicableAllowed: true,
  },

  // -------------------- WAF & EDGE SECURITY (CONDITIONAL) --------------------
  {
    id: 'waf-internet-facing',
    domainId: 'waf-edge-security',
    title: 'Internet-facing applications associated with AVD are inventoried',
    whyItMatters:
      'WAF is only relevant where internet-facing app traffic exists; scoping prevents false controls.',
    sourceMappings: [SOURCES.WAF],
    risk: 'medium',
    impact: 'Mis-scoped assessments cause false mandatory controls or blind spots.',
    recommendation:
      'Maintain an inventory of external apps and map them to edge protection controls.',
    notApplicableAllowed: true,
  },
  {
    id: 'waf-deployed',
    domainId: 'waf-edge-security',
    title: 'WAF deployed for applicable internet-facing apps',
    whyItMatters:
      'WAF adds Layer 7 inspection to mitigate OWASP-class threats on customer-managed apps.',
    sourceMappings: [SOURCES.WAF, SOURCES.FT],
    risk: 'high',
    impact: 'Without WAF, web apps remain more exposed to common attack patterns.',
    recommendation:
      'Deploy Azure WAF where internet-facing apps require Layer 7 protection.',
    notApplicableAllowed: true,
  },
  {
    id: 'waf-detection-prevention',
    domainId: 'waf-edge-security',
    title: 'Detection-to-prevention transition plan implemented',
    whyItMatters:
      'Mature WAF programs evolve from passive alerting to controlled blocking with governance.',
    sourceMappings: [SOURCES.WAF],
    risk: 'medium',
    impact: 'Long-term detection-only mode leaves known exploit patterns unblocked.',
    recommendation:
      'Use staged tuning and change governance to enable prevention mode safely.',
    notApplicableAllowed: true,
  },
  {
    id: 'waf-fp-tuning',
    domainId: 'waf-edge-security',
    title: 'False-positive tuning strategy documented and maintained',
    whyItMatters:
      'Tuning keeps protection effective and minimizes business disruption.',
    sourceMappings: [SOURCES.WAF],
    risk: 'low',
    impact: 'Untuned policies cause user-impacting false blocks or operational noise.',
    recommendation:
      'Establish recurring review of exclusions, baselines, and blocked request patterns.',
    notApplicableAllowed: true,
  },
  {
    id: 'waf-backend-restriction',
    domainId: 'waf-edge-security',
    title: 'Backend access restricted to traffic from approved WAF path only',
    whyItMatters:
      'Direct backend access bypasses inspection and weakens the security model.',
    sourceMappings: [SOURCES.WAF, SOURCES.ZT],
    risk: 'high',
    impact: 'Bypass routes undermine inspection, increasing exposure.',
    recommendation:
      'Constrain backend ingress to trusted WAF-origin traffic with network and identity controls.',
    notApplicableAllowed: true,
  },

  // -------------------- BCDR & RESILIENCE --------------------
  {
    id: 'br-multi-region',
    domainId: 'bcdr-resilience',
    title: 'Multi-region BCDR plan implemented for AVD',
    whyItMatters:
      'Cross-region capability protects against regional failure and meets enterprise RTO/RPO.',
    sourceMappings: [SOURCES.APRL, SOURCES.WAF],
    risk: 'high',
    impact: 'Single-region deployments are exposed to regional incidents.',
    recommendation:
      'Implement active/active or active/passive multi-region AVD with identity, DNS, and hosts in DR.',
  },
  {
    id: 'br-dns-redundancy',
    domainId: 'bcdr-resilience',
    title: 'DNS redundancy across regions and AZs',
    whyItMatters:
      'DNS is foundational; single-region DNS becomes the limiting factor for failover.',
    sourceMappings: [SOURCES.APRL],
    risk: 'high',
    impact: 'DNS outages cascade into full AVD service disruption.',
    recommendation:
      'Deploy redundant DNS servers across AZs in each region with AVD session hosts.',
  },
  {
    id: 'br-dc-az',
    domainId: 'bcdr-resilience',
    title: 'Multiple domain controllers across AZs in each AVD region',
    whyItMatters:
      'Local DCs provide identity resilience and shorter authentication paths.',
    sourceMappings: [SOURCES.APRL],
    risk: 'high',
    impact: 'Authentication degradation during regional incidents impacts all users.',
    recommendation:
      'Deploy DCs across AZs per region (where AD DS is in use) and validate replication health.',
    notApplicableAllowed: true,
  },
  {
    id: 'br-vm-az',
    domainId: 'bcdr-resilience',
    title: 'Session host VMs deployed across Availability Zones',
    whyItMatters:
      'AZ distribution provides protection against zonal failure within a region.',
    sourceMappings: [SOURCES.APRL],
    risk: 'medium',
    impact: 'Single-zone deployments fail entirely during AZ-level incidents.',
    recommendation:
      'Spread session hosts across AZs and validate scaling plans are AZ-aware.',
  },
  {
    id: 'br-azure-backup-vms',
    domainId: 'bcdr-resilience',
    title: 'Azure Backup configured for VMs where applicable',
    whyItMatters:
      'For personal pools or stateful hosts, backup is a critical safety net.',
    sourceMappings: [SOURCES.APRL, SOURCES.MCSB],
    risk: 'medium',
    impact: 'Untested or missing backups risk loss during corruption or compromise.',
    recommendation:
      'Use Azure Backup with Azure Policy enforcement on stateful hosts; pooled stateless hosts may not require it.',
    notApplicableAllowed: true,
  },
  {
    id: 'br-image-replication',
    domainId: 'bcdr-resilience',
    title: 'Image templates and versions replicated to secondary region',
    whyItMatters:
      'DR images must be available locally to spin up hosts in the recovery region.',
    sourceMappings: [SOURCES.APRL],
    risk: 'medium',
    impact: 'Cross-region image dependency slows recovery during regional outages.',
    recommendation:
      'Replicate image versions to secondary region and validate scaling plans use them.',
  },
  {
    id: 'br-image-replicas',
    domainId: 'bcdr-resilience',
    title: 'Production image versions have at least three replicas',
    whyItMatters:
      'Replica count drives concurrent VM provisioning capacity and resilience.',
    sourceMappings: [SOURCES.APRL],
    risk: 'low',
    impact: 'Insufficient replicas can throttle provisioning during scale events.',
    recommendation:
      'Maintain at least three replicas per region for production image versions.',
  },
  {
    id: 'br-image-zrs',
    domainId: 'bcdr-resilience',
    title: 'Zone-redundant storage used for image versions',
    whyItMatters:
      'Image storage redundancy prevents zonal incidents from blocking host provisioning.',
    sourceMappings: [SOURCES.APRL],
    risk: 'low',
    impact: 'Zonal storage failure may prevent host scaling or replacement.',
    recommendation:
      'Configure ZRS storage for shared image gallery image versions.',
  },
  {
    id: 'br-validation-host-pool',
    domainId: 'bcdr-resilience',
    title: 'Validation host pool exists for canary changes',
    whyItMatters:
      'Validation pools catch regressions in agent updates, images, and policies before production.',
    sourceMappings: [SOURCES.APRL],
    risk: 'medium',
    impact: 'Direct production changes risk widespread user-impacting incidents.',
    recommendation:
      'Create a small validation host pool and use it for AVD agent and image rollouts.',
  },
  {
    id: 'br-scaling-plans',
    domainId: 'bcdr-resilience',
    title: 'Scaling plans configured per region',
    whyItMatters:
      'Scaling plans align cost and capacity with demand and support DR posture.',
    sourceMappings: [SOURCES.APRL],
    risk: 'low',
    impact: 'Lack of scaling plans causes cost overruns or capacity shortages.',
    recommendation:
      'Define and tune AVD scaling plans per region with appropriate ramp behavior.',
  },
  {
    id: 'br-keyvault-resilience',
    domainId: 'bcdr-resilience',
    title: 'Key vaults provisioned with HA / DR for AVD host pools',
    whyItMatters:
      'Key Vault availability is required for deployment continuity in DR.',
    sourceMappings: [SOURCES.APRL],
    risk: 'high',
    impact: 'Loss of access to secrets blocks DR deployment of session hosts.',
    recommendation:
      'Deploy secondary Key Vault in DR region and ensure soft-delete and purge protection are enabled.',
  },
  {
    id: 'br-er-zr-gateway',
    domainId: 'bcdr-resilience',
    title: 'Zone-redundant ExpressRoute gateway SKUs used (when ER is in use)',
    whyItMatters:
      'Zone-redundant gateways protect connectivity during AZ-level events.',
    sourceMappings: [SOURCES.APRL],
    risk: 'medium',
    impact: 'Single-zone gateways are exposed to zonal failure.',
    recommendation:
      'Use zone-redundant ExpressRoute virtual network gateway SKUs.',
    notApplicableAllowed: true,
  },
  {
    id: 'br-storage-redundancy',
    domainId: 'bcdr-resilience',
    title: 'Storage accounts configured for zone or region redundancy',
    whyItMatters:
      'Storage redundancy protects critical data during zonal or regional incidents.',
    sourceMappings: [SOURCES.APRL],
    risk: 'medium',
    impact: 'LRS-only critical storage breaches resilience targets.',
    recommendation:
      'Adopt ZRS, GZRS, or RA-GRS based on data criticality and BCDR requirements.',
  },
  {
    id: 'br-capacity-planning',
    domainId: 'bcdr-resilience',
    title: 'Subscription/API limits and capacity tracked across regions',
    whyItMatters:
      'AVD scale is bounded by Azure subscription and API limits; tracking avoids surprise throttling.',
    sourceMappings: [SOURCES.APRL, SOURCES.WAF],
    risk: 'low',
    impact: 'Hitting limits during DR or scale events delays response and recovery.',
    recommendation:
      'Monitor quota/usage and split across subscriptions/host pools where required.',
  },
  {
    id: 'br-separate-la-prod-dr',
    domainId: 'bcdr-resilience',
    title: 'Separate Log Analytics workspaces for Prod and DR',
    whyItMatters:
      'Workspace independence ensures DR observability when Prod region is impacted.',
    sourceMappings: [SOURCES.APRL],
    risk: 'low',
    impact: 'Shared workspace failure blinds DR teams during incidents.',
    recommendation:
      'Provision dedicated workspaces per region with consistent diagnostic configurations.',
  },

  // -------------------- GOVERNANCE & COMPLIANCE --------------------
  {
    id: 'gv-azure-policy',
    domainId: 'governance-compliance',
    title: 'Azure Policy enforces AVD baseline configurations',
    whyItMatters:
      'Policy enforcement prevents drift and codifies controls across host pools and dependencies.',
    sourceMappings: [SOURCES.MCSB, SOURCES.CAF],
    risk: 'medium',
    impact: 'Without enforced policy, configurations regress and audit findings recur.',
    recommendation:
      'Apply policy initiatives covering Trusted Launch, encryption, diagnostics, NSG, and tagging.',
  },
  {
    id: 'gv-landing-zone',
    domainId: 'governance-compliance',
    title: 'AVD landing zone scale unit model used for resource organization',
    whyItMatters:
      'Standardized scale units improve growth, governance, and operational consistency.',
    sourceMappings: [SOURCES.CAF, SOURCES.APRL],
    risk: 'low',
    impact: 'Ad-hoc resource layout complicates RBAC, billing, and lifecycle management.',
    recommendation:
      'Adopt the AVD enterprise-scale landing zone resource group pattern by component type.',
  },
  {
    id: 'gv-tagging',
    domainId: 'governance-compliance',
    title: 'Tagging strategy applied consistently to AVD resources',
    whyItMatters:
      'Tags drive cost allocation, ownership, and operational metadata for AVD components.',
    sourceMappings: [SOURCES.CAF],
    risk: 'low',
    impact: 'Missing tags hinder cost reporting, automation, and incident routing.',
    recommendation:
      'Define tagging taxonomy (env, owner, costCenter, dataClass) and enforce via policy.',
  },
  {
    id: 'gv-image-governance',
    domainId: 'governance-compliance',
    title: 'Approved images managed through Azure Compute Gallery',
    whyItMatters:
      'Centralizing image governance prevents unmanaged or insecure host images.',
    sourceMappings: [SOURCES.CAF, SOURCES.APRL, SOURCES.MCSB],
    risk: 'medium',
    impact: 'Unmanaged custom images reintroduce vulnerabilities and inconsistency.',
    recommendation:
      'Use Compute Gallery, version images, control replication, and audit usage.',
  },
  {
    id: 'gv-host-pool-agent-updates',
    domainId: 'governance-compliance',
    title: 'Host pool scheduled agent updates configured',
    whyItMatters:
      'Scheduled agent updates ensure controlled rollout of AVD agent versions.',
    sourceMappings: [SOURCES.APRL],
    risk: 'low',
    impact: 'Uncontrolled agent updates can cause reliability or compatibility regressions.',
    recommendation:
      'Configure scheduled agent updates per host pool aligned with maintenance windows.',
  },
  {
    id: 'gv-unique-ou',
    domainId: 'governance-compliance',
    title: 'Unique OU used for domain-joined AVD session hosts',
    whyItMatters:
      'Dedicated OUs allow targeted Group Policy and lifecycle management for session hosts.',
    sourceMappings: [SOURCES.APRL, SOURCES.ZT],
    risk: 'medium',
    impact: 'Mixing AVD hosts with general server OUs causes unintended GPO and policy interactions.',
    recommendation:
      'Place AVD hosts in their own OU with Group Policy targeted to session host needs.',
    notApplicableAllowed: true,
  },
  {
    id: 'gv-regulatory-posture',
    domainId: 'governance-compliance',
    title: 'Regulatory compliance posture tracked (Defender for Cloud Regulatory Compliance)',
    whyItMatters:
      'Continuous compliance tracking surfaces deviations against required frameworks.',
    sourceMappings: [SOURCES.MCSB, SOURCES.CAF],
    risk: 'medium',
    impact: 'Drift goes unnoticed without proactive compliance dashboards.',
    recommendation:
      'Enable applicable regulatory standards in Defender for Cloud and review findings on cadence.',
  },

  // -------------------- MONITORING & OPERATIONS --------------------
  {
    id: 'mo-defender-cloud',
    domainId: 'monitoring-operations',
    title: 'Defender for Cloud enabled across all relevant subscriptions',
    whyItMatters:
      'Coverage consistency is required for meaningful posture visibility and threat alerts.',
    sourceMappings: [SOURCES.AVD_SEC, SOURCES.MCSB, SOURCES.CAF],
    risk: 'high',
    impact: 'Partial coverage creates blind spots in recommendations and alerts.',
    recommendation:
      'Standardize Defender enablement and assign ownership for recommendation closure.',
  },
  {
    id: 'mo-secure-score',
    domainId: 'monitoring-operations',
    title: 'Secure Score tracked with targets and review cadence',
    whyItMatters:
      'Tracking posture trend supports accountability and measurable security improvement.',
    sourceMappings: [SOURCES.AVD_SEC, SOURCES.FT],
    risk: 'medium',
    impact: 'Security debt grows unnoticed without explicit posture objectives.',
    recommendation:
      'Define Secure Score targets per environment and review drift in governance forums.',
  },
  {
    id: 'mo-service-health',
    domainId: 'monitoring-operations',
    title: 'Service Health alerts configured for AVD-critical resources',
    whyItMatters:
      'Proactive service notifications reduce detection lag for platform incidents.',
    sourceMappings: [SOURCES.APRL, SOURCES.AVD_SEC],
    risk: 'medium',
    impact: 'Incident response is delayed when service advisories are missed.',
    recommendation:
      'Configure scoped Service Health alerts and route to on-call channels.',
  },
  {
    id: 'mo-diagnostic-logging',
    domainId: 'monitoring-operations',
    title: 'Diagnostic logging enabled for key AVD resources with retention',
    whyItMatters:
      'Logs are essential for security investigation, control validation, and forensics.',
    sourceMappings: [SOURCES.MCSB, SOURCES.CAF, SOURCES.APRL],
    risk: 'high',
    impact: 'Insufficient logs hamper threat investigation and incident response.',
    recommendation:
      'Enable diagnostic settings for AVD components, identity, storage, and Key Vault into Log Analytics.',
  },
  {
    id: 'mo-avd-insights',
    domainId: 'monitoring-operations',
    title: 'AVD Insights workbook configured for production and DR',
    whyItMatters:
      'AVD Insights consolidates metrics, events, and diagnostics across the workload.',
    sourceMappings: [SOURCES.APRL, SOURCES.ZT],
    risk: 'medium',
    impact: 'Without AVD Insights, troubleshooting and posture review are inefficient.',
    recommendation:
      'Deploy the AVD Insights workbook for both production and DR environments.',
  },
  {
    id: 'mo-fslogix-diag',
    domainId: 'monitoring-operations',
    title: 'Diagnostic settings configured on FSLogix storage and events forwarded',
    whyItMatters:
      'Centralized FSLogix telemetry accelerates resolution of profile attach incidents.',
    sourceMappings: [SOURCES.APRL],
    risk: 'medium',
    impact: 'Lack of FSLogix telemetry slows incident response and root cause analysis.',
    recommendation:
      'Forward FSLogix events into AVD Insights / Log Analytics with consistent retention.',
  },
  {
    id: 'mo-audit-logs',
    domainId: 'monitoring-operations',
    title: 'Audit logs collected: Activity, Entra ID, session host, Key Vault',
    whyItMatters:
      'A complete audit trail is required for security operations and compliance evidence.',
    sourceMappings: [SOURCES.AVD_SEC, SOURCES.MCSB],
    risk: 'high',
    impact: 'Missing audit trails hinder investigations and weaken compliance posture.',
    recommendation:
      'Centralize Activity Log, Entra ID logs, host telemetry, and Key Vault logs into Log Analytics / Sentinel.',
  },
  {
    id: 'mo-azure-monitor-usage',
    domainId: 'monitoring-operations',
    title: 'Azure Monitor used for usage and availability of AVD',
    whyItMatters:
      'Service-level monitoring drives capacity planning and reliability improvement.',
    sourceMappings: [SOURCES.AVD_SEC],
    risk: 'low',
    impact: 'Without service monitoring, capacity and quality issues surface late.',
    recommendation:
      'Define availability and usage signals in Azure Monitor with alerting and dashboards.',
  },
  {
    id: 'mo-azure-advisor',
    domainId: 'monitoring-operations',
    title: 'Azure Advisor recommendations for AVD reviewed regularly',
    whyItMatters:
      'Advisor surfaces best-practice recommendations specific to AVD posture and reliability.',
    sourceMappings: [SOURCES.ZT, SOURCES.WAF],
    risk: 'low',
    impact: 'Missed recommendations leave easy wins unimplemented.',
    recommendation:
      'Add Advisor reviews to operational cadence and triage outputs into work items.',
  },
]
