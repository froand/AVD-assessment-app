# Azure Virtual Desktop Security Assessment App

A comprehensive, interactive security assessment tool for Azure Virtual Desktop (AVD) environments. Built for architects, consultants, and enterprise teams to identify security gaps, prioritize remediation efforts, and align with Microsoft's best practices and frameworks.

## 🎯 Overview

This application provides a structured, 12-step security posture assessment specifically designed for AVD deployments. It evaluates critical security domains and generates actionable insights aligned with:

- **Cloud Adoption Framework (CAF)** - Microsoft's guidance for cloud adoption strategies
- **Azure Platform Reference Library (APRL)** - Best practices for Azure platform services
- **FastTrack for Azure** - Microsoft's proven methodology for successful cloud deployments
- **Zero Trust Security Model** - Practical implementation of Zero Trust principles for desktop environments

## ✨ Key Features

### 🔍 Comprehensive Assessment Workflow

12 interconnected assessment steps covering:

1. **Discovery / Environment Input** - Scope and context collection
2. **Identity & Access** - Authentication, RBAC, and privileged access
3. **Endpoint & Device Security** - User device posture and trust signals
4. **Session Host Security** - Host hardening, EDR, and image management
5. **Network & Connectivity** - Segmentation, egress, and control plane configuration
6. **Private Access / Zero Trust** - Private endpoints and adaptive access controls
7. **FSLogix & Storage** - Profile resiliency and data controls
8. **Data Protection** - Encryption, Key Vault, classification, and DLP
9. **BCDR & Resilience** - Multi-region, availability zones, and image replication
10. **Governance & Compliance** - Policy, landing zones, and regulatory posture
11. **Monitoring & Operations** - Insights, audit logs, and Service Health
12. **Summary & Recommendations** - Executive posture and prioritized remediation gaps

### 📊 Interactive Assessment Interface

- **Real-time scoring** - Automatic calculation of control status and overall security posture
- **Conditional sections** - WAF and edge controls only appear when applicable to your environment
- **Visual progress tracking** - Step-by-step workflow with progress indicators
- **Evidence capture** - Detailed notes and evidence collection for each control
- **Risk filtering** - View high-risk items for focused remediation planning

### 📤 Export & Reporting Capabilities

Generate professional reports in multiple formats:

- **PDF Reports** - Formatted security assessment documents with scores and recommendations
- **PowerPoint Presentations** - Executive-ready slide decks with findings and priorities
- **JSON Export** - Raw data export for custom analysis and integration
- **Markdown Export** - Git-friendly format for documentation and version control

### 💾 Local State Persistence

- Assessment progress is automatically saved to browser local storage
- Resume assessments at any time without losing work
- Workshop-ready interface for facilitator-led sessions

## 🛠️ Technology Stack

- **Frontend Framework** - React 19 with TypeScript
- **Build Tool** - Vite 8.0.10
- **UI Components** - Lucide React Icons
- **Export Libraries**
  - jsPDF - PDF generation
  - pptxgen-js - PowerPoint generation
- **Hosting** - Azure Static Web Apps (Free Tier)
- **Region** - West Europe (westeurope)

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/froand/AVD-assessment-app.git
   cd AVD-assessment-app
   ```

2. Install dependencies:
   ```bash
   cd app
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Build output is generated in `app/dist/`

## 📋 Assessment Methodology

### Scoring System

Each control can have one of these statuses:

- **✅ Compliant** - Control is fully implemented and effective
- **⚠️ Partially Compliant** - Control is partially implemented with gaps
- **❌ Non-Compliant** - Control is not implemented or ineffective
- **⊘ Not Applicable** - Control is not relevant to this environment

### Risk Prioritization

Controls are evaluated for:
- **Severity** - Impact if control is not implemented
- **Scope** - Breadth of affected resources
- **Effort** - Resources required to remediate

## 🏗️ Framework Alignment

### CAF Security Pillars

This assessment aligns with the Cloud Adoption Framework's governance and security domains:
- Identity and Access Management
- Network Security
- Data Protection and Privacy
- Security Operations
- Compliance and Risk Management

### Zero Trust Principles

Controls implement Zero Trust concepts:
- Assume Breach mentality
- Verify explicitly with all available data points
- Secure all access with least privilege
- Focus on protecting resources, not perimeter

### APRL Best Practices

Assessment incorporates Azure Platform Reference Library recommendations for:
- Virtual networking and segmentation
- Identity and authentication
- Data governance
- Operational excellence
- Security and compliance

## 📊 Use Cases

### 1. **Readiness Assessments**
Evaluate organizational readiness for AVD deployment before implementation

### 2. **Post-Deployment Reviews**
Assess security posture of existing AVD environments

### 3. **Compliance Audits**
Document security controls for regulatory compliance requirements

### 4. **Remediation Planning**
Identify and prioritize security gaps for remediation efforts

### 5. **Executive Reporting**
Generate executive summaries for stakeholder communication

## 🔗 Deployment

The application is deployed on **Azure Static Web Apps** for:
- Global CDN distribution
- Automatic HTTPS
- Zero-configuration deployment from GitHub
- Scalability and reliability

**Live URL:** https://gray-glacier-0f81a5a03.7.azurestaticapps.net

## 📚 References

### Microsoft Framework Documentation

- [Cloud Adoption Framework - Security](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/secure/)
- [Azure Platform Reference Library (APRL)](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/reference/)
- [FastTrack for Azure - Governance](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/govern/)
- [Zero Trust Security Model](https://www.microsoft.com/en-us/security/business/zero-trust)

### Azure Virtual Desktop Resources

- [Azure Virtual Desktop Documentation](https://docs.microsoft.com/en-us/azure/virtual-desktop/)
- [AVD Security Best Practices](https://docs.microsoft.com/en-us/azure/virtual-desktop/security-guide)
- [Azure Well-Architected Framework - AVD](https://docs.microsoft.com/en-us/azure/well-architected/)

### Additional Resources

- [Microsoft Cloud Security Benchmark](https://docs.microsoft.com/en-us/security/benchmark/azure/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework/)
- [CIS Azure Foundations Benchmark](https://www.cisecurity.org/benchmark/azure/)

## 🤝 Contributing

This is a reference implementation. Organizations are encouraged to:

1. Customize assessment criteria for their specific requirements
2. Add organization-specific controls and policies
3. Integrate with existing assessment frameworks
4. Extend the export formats and reporting capabilities

## 📝 License

This project is provided as-is for educational and assessment purposes.

## 🙋 Support & Feedback

For issues, questions, or feedback:

- Review the [assessment methodology](#assessment-methodology) documentation
- Check existing GitHub issues
- Consult the referenced Microsoft documentation

---

**Version:** 1.0.0  
**Last Updated:** April 2026  
**Built with:** React 19, TypeScript, Vite, Azure Static Web Apps
