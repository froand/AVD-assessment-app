import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import PptxGenJS from 'pptxgenjs'
import { domainDefinitions } from '../data/assessmentData'
import type { AssessmentSummary, DiscoveryInput, RiskLevel } from '../types/assessment'

const getToday = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const downloadTextFile = (filename: string, content: string, mimeType: string): void => {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  window.setTimeout(() => {
    URL.revokeObjectURL(url)
    a.remove()
  }, 150)
}

export const exportJsonReport = (summary: AssessmentSummary, discovery: DiscoveryInput): void => {
  const payload = {
    app: 'Azure Virtual Desktop Security Assessment App',
    generatedAt: new Date().toISOString(),
    discovery,
    summary,
  }

  downloadTextFile(
    `avd-security-assessment-${getToday()}.json`,
    JSON.stringify(payload, null, 2),
    'application/json',
  )
}

const riskTitle = (risk: 'high' | 'medium' | 'low'): string =>
  risk === 'high' ? 'High' : risk === 'medium' ? 'Medium' : 'Low'

const markdownCell = (value: string): string => {
  return value.replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ').trim()
}

export const buildMarkdownReport = (
  summary: AssessmentSummary,
  discovery: DiscoveryInput,
): string => {
  const lines: string[] = []
  lines.push('# Azure Virtual Desktop Security Assessment Report')
  lines.push('')
  lines.push(`Generated: ${new Date().toLocaleString()}`)
  lines.push('')
  lines.push('## Executive Summary')
  lines.push('')
  lines.push(`- Overall score: **${summary.overallScore}%**`)
  lines.push(`- High risk gaps: **${summary.gapHeatmap.high}**`)
  lines.push(`- Medium risk gaps: **${summary.gapHeatmap.medium}**`)
  lines.push(`- Low risk gaps: **${summary.gapHeatmap.low}**`)
  lines.push('')
  lines.push('## Discovery Inputs')
  lines.push('')
  lines.push(`- Number of users: ${discovery.numberOfUsers || 'Not provided'}`)
  lines.push(`- Regions: ${discovery.regions || 'Not provided'}`)
  lines.push(`- Client types: ${discovery.clientTypes || 'Not provided'}`)
  lines.push(`- Dependencies: ${discovery.dependencies || 'Not provided'}`)
  lines.push(
    `- Internet-facing applications: ${
      discovery.internetFacingApplications === 'yes' ? 'Yes' : 'No'
    }`,
  )
  lines.push('')

  lines.push('## Domain Scores')
  lines.push('')
  summary.domainScores.forEach((domainScore) => {
    lines.push(`- ${domainScore.title}: **${domainScore.percentage}%**`)
  })
  lines.push('')

  lines.push('## Findings')
  lines.push('')
  lines.push('| Domain | Control | Risk | Status | Impact | Recommendation |')
  lines.push('| --- | --- | --- | --- | --- | --- |')

  summary.findings.forEach((finding) => {
    const domain = domainDefinitions.find((d) => d.id === finding.domainId)
    const status = finding.status === 'partial' ? 'Partial' : 'No'
    lines.push(
      `| ${markdownCell(domain?.title ?? finding.domainId)} | ${markdownCell(finding.controlTitle)} | ${riskTitle(finding.risk)} | ${status} | ${markdownCell(finding.impact)} | ${markdownCell(finding.recommendation)} |`,
    )
  })

  return lines.join('\n')
}

export const exportMarkdownReport = (summary: AssessmentSummary, discovery: DiscoveryInput): void => {
  const markdown = buildMarkdownReport(summary, discovery)
  downloadTextFile(`avd-security-assessment-${getToday()}.md`, markdown, 'text/markdown')
}

export const exportPptStyleText = (summary: AssessmentSummary, discovery: DiscoveryInput): void => {
  const lines: string[] = []
  lines.push('SLIDE 1 - ASSESSMENT OVERVIEW')
  lines.push('Azure Virtual Desktop Security Assessment App')
  lines.push(`Assessment date: ${new Date().toLocaleDateString()}`)
  lines.push('')
  lines.push('SLIDE 2 - EXECUTIVE SUMMARY')
  lines.push(`Overall Security Score: ${summary.overallScore}%`)
  lines.push(
    `Gap Heatmap: High ${summary.gapHeatmap.high}, Medium ${summary.gapHeatmap.medium}, Low ${summary.gapHeatmap.low}`,
  )
  lines.push('')
  lines.push('SLIDE 3 - DISCOVERY CONTEXT')
  lines.push(`Users: ${discovery.numberOfUsers || 'Not provided'}`)
  lines.push(`Regions: ${discovery.regions || 'Not provided'}`)
  lines.push(`Client types: ${discovery.clientTypes || 'Not provided'}`)
  lines.push('')
  lines.push('SLIDE 4 - PRIORITIZED FINDINGS')
  summary.findings.forEach((finding, index) => {
    lines.push(`${index + 1}. [${riskTitle(finding.risk)}] ${finding.controlTitle}`)
    lines.push(`   Impact: ${finding.impact}`)
    lines.push(`   Recommendation: ${finding.recommendation}`)
  })

  downloadTextFile(`avd-security-assessment-ppt-text-${getToday()}.txt`, lines.join('\n'), 'text/plain')
}

// ---------------------------------------------------------------------------
// PDF export (jsPDF + autoTable)
// ---------------------------------------------------------------------------

const PDF_BRAND = {
  primary: [12, 52, 97] as [number, number, number],     // Microsoft deep blue
  accent: [0, 120, 212] as [number, number, number],     // Azure blue
  text: [33, 37, 41] as [number, number, number],
  mutedText: [99, 110, 121] as [number, number, number],
  divider: [222, 226, 230] as [number, number, number],
  riskHigh: [201, 42, 42] as [number, number, number],
  riskMedium: [232, 138, 0] as [number, number, number],
  riskLow: [38, 138, 75] as [number, number, number],
}

const riskColor = (risk: RiskLevel): [number, number, number] =>
  risk === 'high' ? PDF_BRAND.riskHigh : risk === 'medium' ? PDF_BRAND.riskMedium : PDF_BRAND.riskLow

const drawPdfHeader = (doc: jsPDF, pageWidth: number): void => {
  doc.setFillColor(...PDF_BRAND.primary)
  doc.rect(0, 0, pageWidth, 22, 'F')
  doc.setFillColor(...PDF_BRAND.accent)
  doc.rect(0, 22, pageWidth, 1.4, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Azure Virtual Desktop — Security Assessment', 14, 14)
}

const drawPdfFooter = (doc: jsPDF, pageWidth: number, pageHeight: number): void => {
  const total = doc.getNumberOfPages()
  for (let i = 1; i <= total; i += 1) {
    doc.setPage(i)
    doc.setDrawColor(...PDF_BRAND.divider)
    doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...PDF_BRAND.mutedText)
    doc.text(`Generated ${new Date().toLocaleString()}`, 14, pageHeight - 8)
    doc.text(`Page ${i} of ${total}`, pageWidth - 14, pageHeight - 8, { align: 'right' })
  }
}

type AutoTableDoc = jsPDF & {
  lastAutoTable?: {
    finalY: number
  }
}

export const exportPdfReport = (summary: AssessmentSummary, discovery: DiscoveryInput): void => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  drawPdfHeader(doc, pageWidth)

  // Title block
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...PDF_BRAND.primary)
  doc.setFontSize(22)
  doc.text('AVD Security Assessment Report', 14, 38)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...PDF_BRAND.mutedText)
  doc.setFontSize(10)
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 46)

  // Score card row
  const cards: { label: string; value: string; color: [number, number, number] }[] = [
    { label: 'Overall score', value: `${summary.overallScore}%`, color: PDF_BRAND.accent },
    { label: 'Total findings', value: String(summary.findings.length), color: PDF_BRAND.primary },
    { label: 'High-risk gaps', value: String(summary.gapHeatmap.high), color: PDF_BRAND.riskHigh },
    { label: 'Medium-risk gaps', value: String(summary.gapHeatmap.medium), color: PDF_BRAND.riskMedium },
  ]
  const cardWidth = (pageWidth - 14 * 2 - 6 * (cards.length - 1)) / cards.length
  let cardX = 14
  const cardY = 54
  cards.forEach((card) => {
    doc.setDrawColor(...PDF_BRAND.divider)
    doc.setFillColor(248, 250, 252)
    doc.roundedRect(cardX, cardY, cardWidth, 22, 2, 2, 'FD')
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...PDF_BRAND.mutedText)
    doc.setFontSize(8)
    doc.text(card.label.toUpperCase(), cardX + 4, cardY + 6)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...card.color)
    doc.setFontSize(16)
    doc.text(card.value, cardX + 4, cardY + 17)
    cardX += cardWidth + 6
  })

  // Discovery
  let cursorY = cardY + 30
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...PDF_BRAND.primary)
  doc.setFontSize(13)
  doc.text('Discovery context', 14, cursorY)
  cursorY += 4

  autoTable(doc, {
    startY: cursorY,
    head: [['Field', 'Value']],
    body: [
      ['Number of users', discovery.numberOfUsers || 'Not provided'],
      ['Regions', discovery.regions || 'Not provided'],
      ['Client types', discovery.clientTypes || 'Not provided'],
      ['Dependencies', discovery.dependencies || 'Not provided'],
      [
        'Internet-facing applications',
        discovery.internetFacingApplications === 'yes' ? 'Yes' : 'No',
      ],
    ],
    theme: 'grid',
    headStyles: { fillColor: PDF_BRAND.primary, textColor: 255, fontStyle: 'bold' },
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 2.5 },
    columnStyles: { 0: { cellWidth: 55, fontStyle: 'bold' } },
    margin: { left: 14, right: 14 },
  })

  // Domain scores table
  const domainBody = summary.domainScores.map((domain) => [
    domain.title,
    `${domain.percentage}%`,
    `${Math.round(domain.achieved)} / ${domain.possible}`,
  ])

  const lastTableY = (doc as AutoTableDoc).lastAutoTable?.finalY ?? cursorY + 22
  autoTable(doc, {
    startY: lastTableY + 8,
    head: [['Domain', 'Score', 'Weighted']],
    body: domainBody,
    theme: 'striped',
    headStyles: { fillColor: PDF_BRAND.accent, textColor: 255, fontStyle: 'bold' },
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 2.5 },
    margin: { left: 14, right: 14 },
  })

  // Findings table on a fresh page
  doc.addPage()
  drawPdfHeader(doc, pageWidth)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...PDF_BRAND.primary)
  doc.setFontSize(16)
  doc.text('Findings & recommendations', 14, 38)

  const findingsBody = summary.findings.map((finding) => {
    const domainTitle =
      domainDefinitions.find((d) => d.id === finding.domainId)?.title ?? finding.domainId
    const status = finding.status === 'partial' ? 'Partial' : 'No'
    return [
      domainTitle,
      finding.controlTitle,
      riskTitle(finding.risk),
      status,
      finding.impact,
      finding.recommendation,
    ]
  })

  autoTable(doc, {
    startY: 44,
    head: [['Domain', 'Control', 'Risk', 'Status', 'Impact', 'Recommendation']],
    body: findingsBody.length > 0 ? findingsBody : [['—', 'No findings recorded', '—', '—', '—', '—']],
    theme: 'grid',
    headStyles: { fillColor: PDF_BRAND.primary, textColor: 255, fontStyle: 'bold' },
    styles: { font: 'helvetica', fontSize: 8, cellPadding: 2, valign: 'top' },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 40 },
      2: { cellWidth: 14 },
      3: { cellWidth: 14 },
      4: { cellWidth: 45 },
      5: { cellWidth: 'auto' },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 2) {
        const risk = String(data.cell.raw ?? '').toLowerCase()
        if (risk === 'high' || risk === 'medium' || risk === 'low') {
          const color = riskColor(risk)
          data.cell.styles.fillColor = color
          data.cell.styles.textColor = 255
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.halign = 'center'
        }
      }
    },
    margin: { left: 10, right: 10 },
  })

  drawPdfFooter(doc, pageWidth, pageHeight)
  doc.save(`avd-security-assessment-${getToday()}.pdf`)
}

// ---------------------------------------------------------------------------
// PPTX export (pptxgenjs)
// ---------------------------------------------------------------------------

const PPT_BRAND = {
  primary: '0C3461',   // Microsoft deep blue
  accent: '0078D4',    // Azure blue
  light: 'F3F2F1',     // Microsoft Fluent neutral
  text: '1B1B1B',
  muted: '605E5C',
  riskHigh: 'C92A2A',
  riskMedium: 'E88A00',
  riskLow: '268A4B',
}

const SLIDE_TITLE_FONT = 'Segoe UI Semibold'
const SLIDE_BODY_FONT = 'Segoe UI'

const addSlideChrome = (
  pptx: PptxGenJS,
  slide: PptxGenJS.Slide,
  pageNumber: number,
  totalPages: number,
): void => {
  // Top header bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.45,
    fill: { color: PPT_BRAND.primary },
    line: { color: PPT_BRAND.primary },
  })
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0.45,
    w: '100%',
    h: 0.04,
    fill: { color: PPT_BRAND.accent },
    line: { color: PPT_BRAND.accent },
  })
  slide.addText('Azure Virtual Desktop — Security Assessment', {
    x: 0.4,
    y: 0.05,
    w: 8,
    h: 0.35,
    fontSize: 11,
    fontFace: SLIDE_TITLE_FONT,
    color: 'FFFFFF',
    bold: true,
  })

  // Footer
  slide.addText(`Microsoft  •  Confidential  •  ${new Date().toLocaleDateString()}`, {
    x: 0.4,
    y: 5.15,
    w: 6,
    h: 0.25,
    fontSize: 9,
    fontFace: SLIDE_BODY_FONT,
    color: PPT_BRAND.muted,
  })
  slide.addText(`${pageNumber} / ${totalPages}`, {
    x: 8.5,
    y: 5.15,
    w: 1.1,
    h: 0.25,
    fontSize: 9,
    fontFace: SLIDE_BODY_FONT,
    color: PPT_BRAND.muted,
    align: 'right',
  })
}

const buildTitleSlide = (
  pptx: PptxGenJS,
  discovery: DiscoveryInput,
  totalPages: number,
): void => {
  const slide = pptx.addSlide()
  slide.background = { color: 'FFFFFF' }

  // Left accent
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.35,
    h: '100%',
    fill: { color: PPT_BRAND.primary },
    line: { color: PPT_BRAND.primary },
  })

  slide.addText('Azure Virtual Desktop', {
    x: 0.8,
    y: 1.4,
    w: 8.5,
    h: 0.6,
    fontSize: 28,
    fontFace: SLIDE_TITLE_FONT,
    color: PPT_BRAND.primary,
    bold: true,
  })
  slide.addText('Security Assessment Report', {
    x: 0.8,
    y: 2.0,
    w: 8.5,
    h: 0.7,
    fontSize: 36,
    fontFace: SLIDE_TITLE_FONT,
    color: PPT_BRAND.text,
    bold: true,
  })
  slide.addText(`Generated ${new Date().toLocaleDateString()}`, {
    x: 0.8,
    y: 2.95,
    w: 8.5,
    h: 0.4,
    fontSize: 14,
    fontFace: SLIDE_BODY_FONT,
    color: PPT_BRAND.muted,
  })

  // Discovery summary card
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 3.6,
    w: 8.4,
    h: 1.3,
    fill: { color: PPT_BRAND.light },
    line: { color: 'E1DFDD', width: 0.75 },
    rectRadius: 0.08,
  })
  slide.addText('Scope', {
    x: 1.0,
    y: 3.7,
    w: 8.0,
    h: 0.3,
    fontSize: 11,
    fontFace: SLIDE_TITLE_FONT,
    color: PPT_BRAND.accent,
    bold: true,
  })
  slide.addText(
    [
      { text: 'Users: ', options: { bold: true, color: PPT_BRAND.text } },
      { text: `${discovery.numberOfUsers || 'Not provided'}    ` },
      { text: 'Regions: ', options: { bold: true, color: PPT_BRAND.text } },
      { text: `${discovery.regions || 'Not provided'}\n` },
      { text: 'Clients: ', options: { bold: true, color: PPT_BRAND.text } },
      { text: `${discovery.clientTypes || 'Not provided'}\n` },
      { text: 'Dependencies: ', options: { bold: true, color: PPT_BRAND.text } },
      { text: `${discovery.dependencies || 'Not provided'}\n` },
      { text: 'Internet-facing apps: ', options: { bold: true, color: PPT_BRAND.text } },
      { text: discovery.internetFacingApplications === 'yes' ? 'Yes' : 'No' },
    ],
    {
      x: 1.0,
      y: 4.0,
      w: 8.0,
      h: 0.85,
      fontSize: 11,
      fontFace: SLIDE_BODY_FONT,
      color: PPT_BRAND.text,
    },
  )

  addSlideChrome(pptx, slide, 1, totalPages)
}

const buildExecutiveSummarySlide = (
  pptx: PptxGenJS,
  summary: AssessmentSummary,
  pageNumber: number,
  totalPages: number,
): void => {
  const slide = pptx.addSlide()
  slide.background = { color: 'FFFFFF' }

  slide.addText('Executive summary', {
    x: 0.4,
    y: 0.65,
    w: 9,
    h: 0.5,
    fontSize: 24,
    fontFace: SLIDE_TITLE_FONT,
    color: PPT_BRAND.primary,
    bold: true,
  })

  const cards = [
    { label: 'Overall score', value: `${summary.overallScore}%`, color: PPT_BRAND.accent },
    { label: 'Total findings', value: String(summary.findings.length), color: PPT_BRAND.primary },
    { label: 'High-risk gaps', value: String(summary.gapHeatmap.high), color: PPT_BRAND.riskHigh },
    { label: 'Medium-risk gaps', value: String(summary.gapHeatmap.medium), color: PPT_BRAND.riskMedium },
  ]
  const startX = 0.4
  const cardWidth = 2.2
  const gap = 0.13
  cards.forEach((card, idx) => {
    const x = startX + idx * (cardWidth + gap)
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 1.4,
      w: cardWidth,
      h: 1.15,
      fill: { color: PPT_BRAND.light },
      line: { color: 'E1DFDD', width: 0.75 },
      rectRadius: 0.08,
    })
    slide.addText(card.label.toUpperCase(), {
      x: x + 0.15,
      y: 1.5,
      w: cardWidth - 0.3,
      h: 0.3,
      fontSize: 9,
      fontFace: SLIDE_BODY_FONT,
      color: PPT_BRAND.muted,
      bold: true,
    })
    slide.addText(card.value, {
      x: x + 0.15,
      y: 1.8,
      w: cardWidth - 0.3,
      h: 0.65,
      fontSize: 28,
      fontFace: SLIDE_TITLE_FONT,
      color: card.color,
      bold: true,
    })
  })

  // Domain scores table
  const domainRows = [
    [
      { text: 'Domain', options: { bold: true, color: 'FFFFFF', fill: { color: PPT_BRAND.primary } } },
      { text: 'Score', options: { bold: true, color: 'FFFFFF', fill: { color: PPT_BRAND.primary } } },
      { text: 'Weighted', options: { bold: true, color: 'FFFFFF', fill: { color: PPT_BRAND.primary } } },
    ],
    ...summary.domainScores.map((d) => [
      { text: d.title, options: { color: PPT_BRAND.text } },
      { text: `${d.percentage}%`, options: { color: PPT_BRAND.text, bold: true } },
      { text: `${Math.round(d.achieved)} / ${d.possible}`, options: { color: PPT_BRAND.muted } },
    ]),
  ]

  slide.addTable(domainRows, {
    x: 0.4,
    y: 2.75,
    w: 9.2,
    fontSize: 10,
    fontFace: SLIDE_BODY_FONT,
    border: { type: 'solid', pt: 0.5, color: 'E1DFDD' },
    rowH: 0.3,
    colW: [4.6, 1.5, 3.1],
  })

  addSlideChrome(pptx, slide, pageNumber, totalPages)
}

const buildDomainScoreSlides = (
  pptx: PptxGenJS,
  summary: AssessmentSummary,
  startPage: number,
  totalPages: number,
): number => {
  const rowsPerSlide = 6
  const chunks = Array.from(
    { length: Math.ceil(summary.domainScores.length / rowsPerSlide) },
    (_, i) => summary.domainScores.slice(i * rowsPerSlide, i * rowsPerSlide + rowsPerSlide),
  )

  chunks.forEach((domainChunk, chunkIndex) => {
    const slide = pptx.addSlide()
    slide.background = { color: 'FFFFFF' }

    slide.addText(
      `Per-domain posture (${chunkIndex + 1} / ${chunks.length})`,
      {
        x: 0.4,
        y: 0.65,
        w: 9,
        h: 0.5,
        fontSize: 24,
        fontFace: SLIDE_TITLE_FONT,
        color: PPT_BRAND.primary,
        bold: true,
      },
    )

    const startY = 1.35
    const barH = 0.34
    const rowGap = 0.34
    domainChunk.forEach((domain, idx) => {
      const y = startY + idx * (barH + rowGap)

      slide.addText(domain.title, {
        x: 0.4,
        y: y - 0.04,
        w: 4.2,
        h: barH,
        fontSize: 10,
        fontFace: SLIDE_BODY_FONT,
        color: PPT_BRAND.text,
        bold: true,
      })

      slide.addShape(pptx.ShapeType.roundRect, {
        x: 4.7,
        y,
        w: 4.2,
        h: barH * 0.6,
        fill: { color: 'E1DFDD' },
        line: { color: 'E1DFDD' },
        rectRadius: 0.05,
      })

      const fillW = Math.max(0.1, 4.2 * (domain.percentage / 100))
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 4.7,
        y,
        w: fillW,
        h: barH * 0.6,
        fill: { color: PPT_BRAND.accent },
        line: { color: PPT_BRAND.accent },
        rectRadius: 0.05,
      })

      slide.addText(`${domain.percentage}%`, {
        x: 8.95,
        y: y - 0.05,
        w: 0.7,
        h: barH,
        fontSize: 10,
        fontFace: SLIDE_BODY_FONT,
        color: PPT_BRAND.text,
        bold: true,
        align: 'right',
      })
    })

    addSlideChrome(pptx, slide, startPage + chunkIndex, totalPages)
  })

  return startPage + chunks.length - 1
}

const buildFindingsSlides = (
  pptx: PptxGenJS,
  summary: AssessmentSummary,
  startPage: number,
  totalPagesPlaceholder: number,
): number => {
  const findings = summary.findings
  if (findings.length === 0) {
    const slide = pptx.addSlide()
    slide.background = { color: 'FFFFFF' }
    slide.addText('No findings recorded', {
      x: 0.4,
      y: 0.65,
      w: 9,
      h: 0.5,
      fontSize: 24,
      fontFace: SLIDE_TITLE_FONT,
      color: PPT_BRAND.primary,
      bold: true,
    })
    slide.addText(
      'All assessed controls are reported as Yes or Not Applicable. Continue monitoring posture and re-run the assessment on cadence.',
      {
        x: 0.4,
        y: 1.4,
        w: 9.2,
        h: 1,
        fontSize: 12,
        fontFace: SLIDE_BODY_FONT,
        color: PPT_BRAND.text,
      },
    )
    addSlideChrome(pptx, slide, startPage, totalPagesPlaceholder)
    return startPage
  }

  const perSlide = 6
  const slideCount = Math.ceil(findings.length / perSlide)
  for (let i = 0; i < slideCount; i += 1) {
    const slide = pptx.addSlide()
    slide.background = { color: 'FFFFFF' }
    slide.addText(`Findings & recommendations (${i + 1} / ${slideCount})`, {
      x: 0.4,
      y: 0.65,
      w: 9.2,
      h: 0.5,
      fontSize: 22,
      fontFace: SLIDE_TITLE_FONT,
      color: PPT_BRAND.primary,
      bold: true,
    })

    const slice = findings.slice(i * perSlide, i * perSlide + perSlide)
    const rows = [
      [
        { text: 'Risk', options: { bold: true, color: 'FFFFFF', fill: { color: PPT_BRAND.primary } } },
        { text: 'Domain', options: { bold: true, color: 'FFFFFF', fill: { color: PPT_BRAND.primary } } },
        { text: 'Control', options: { bold: true, color: 'FFFFFF', fill: { color: PPT_BRAND.primary } } },
        { text: 'Status', options: { bold: true, color: 'FFFFFF', fill: { color: PPT_BRAND.primary } } },
        { text: 'Recommendation', options: { bold: true, color: 'FFFFFF', fill: { color: PPT_BRAND.primary } } },
      ],
      ...slice.map((f) => {
        const domainTitle =
          domainDefinitions.find((d) => d.id === f.domainId)?.title ?? f.domainId
        const riskHex =
          f.risk === 'high'
            ? PPT_BRAND.riskHigh
            : f.risk === 'medium'
              ? PPT_BRAND.riskMedium
              : PPT_BRAND.riskLow
        return [
          {
            text: riskTitle(f.risk),
            options: {
              bold: true,
              color: 'FFFFFF',
              fill: { color: riskHex },
              align: 'center' as const,
            },
          },
          { text: domainTitle, options: { color: PPT_BRAND.text } },
          { text: f.controlTitle, options: { color: PPT_BRAND.text, bold: true } },
          {
            text: f.status === 'partial' ? 'Partial' : 'No',
            options: { color: PPT_BRAND.text, align: 'center' as const },
          },
          { text: f.recommendation, options: { color: PPT_BRAND.text } },
        ]
      }),
    ]

    slide.addTable(rows, {
      x: 0.3,
      y: 1.25,
      w: 9.4,
      fontSize: 9,
      fontFace: SLIDE_BODY_FONT,
      border: { type: 'solid', pt: 0.5, color: 'E1DFDD' },
      rowH: 0.55,
      colW: [0.7, 1.7, 2.5, 0.8, 3.7],
      valign: 'middle',
    })

    addSlideChrome(pptx, slide, startPage + i, totalPagesPlaceholder)
  }

  return startPage + slideCount - 1
}

const buildClosingSlide = (
  pptx: PptxGenJS,
  pageNumber: number,
  totalPages: number,
): void => {
  const slide = pptx.addSlide()
  slide.background = { color: PPT_BRAND.primary }

  slide.addText('Next steps', {
    x: 0.6,
    y: 1.0,
    w: 9,
    h: 0.6,
    fontSize: 30,
    fontFace: SLIDE_TITLE_FONT,
    color: 'FFFFFF',
    bold: true,
  })
  slide.addText(
    [
      { text: '• Prioritize high-risk gaps and assign owners with target dates.\n' },
      { text: '• Validate controls against authoritative sources (CAF, MCSB, AVD security guidance, Zero Trust, APRL).\n' },
      { text: '• Re-run the assessment after each major change to track posture trend.\n' },
      { text: '• Translate recommendations into Azure Policy initiatives where applicable.' },
    ],
    {
      x: 0.6,
      y: 1.9,
      w: 9.0,
      h: 2.6,
      fontSize: 16,
      fontFace: SLIDE_BODY_FONT,
      color: 'FFFFFF',
      paraSpaceAfter: 6,
    },
  )

  slide.addText(`Slide ${pageNumber} of ${totalPages}`, {
    x: 0.6,
    y: 5.05,
    w: 9.0,
    h: 0.3,
    fontSize: 9,
    fontFace: SLIDE_BODY_FONT,
    color: 'FFFFFF',
    align: 'right',
  })
}

export const exportPptxReport = async (
  summary: AssessmentSummary,
  discovery: DiscoveryInput,
): Promise<void> => {
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_16x9'
  pptx.title = 'AVD Security Assessment'
  pptx.company = 'Microsoft'
  pptx.subject = 'Azure Virtual Desktop — Security Assessment'
  pptx.author = 'AVD Security Assessment App'

  // Compute total slide count up front (title + exec + per-domain slides + finding slides + closing)
  const domainSlideCount = Math.max(1, Math.ceil(summary.domainScores.length / 6))
  const findingSlideCount = Math.max(1, Math.ceil(summary.findings.length / 6))
  const totalPages = 1 + 1 + domainSlideCount + findingSlideCount + 1

  buildTitleSlide(pptx, discovery, totalPages)
  buildExecutiveSummarySlide(pptx, summary, 2, totalPages)
  const lastDomainPage = buildDomainScoreSlides(pptx, summary, 3, totalPages)
  const lastFindingPage = buildFindingsSlides(pptx, summary, lastDomainPage + 1, totalPages)
  buildClosingSlide(pptx, lastFindingPage + 1, totalPages)

  await pptx.writeFile({ fileName: `avd-security-assessment-${getToday()}.pptx` })
}
