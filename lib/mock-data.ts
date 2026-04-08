// Mock data for Ministry of Justice Case Management System

export type ComplaintStatus = 'pending' | 'under_review' | 'investigating' | 'resolved' | 'closed' | 'rejected'
export type ComplaintType = 'civil' | 'criminal' | 'family' | 'property' | 'employment' | 'administrative' | 'other'

export interface Complaint {
  id: string
  referenceNumber: string
  type: ComplaintType
  subject: string
  description: string
  status: ComplaintStatus
  submittedAt: Date
  updatedAt: Date
  complainant: {
    fullName: string
    phone: string
    email?: string
    kebele: string
    woreda: string
    zone: string
  }
  timeline: Array<{
    date: Date
    status: ComplaintStatus
    note: string
  }>
  assignedTo?: string
}

export interface CaseInfo {
  id: string
  caseNumber: string
  title: string
  type: string
  status: string
  filedDate: Date
  nextHearing?: Date
  courtRoom?: string
  judge?: string
  parties: {
    plaintiff: string
    defendant: string
  }
  timeline: Array<{
    date: Date
    event: string
    description: string
  }>
}

export interface Service {
  id: string
  key: string
  icon: string
  available: boolean
  requirements?: string[]
}

// Mock Complaints Data
export const mockComplaints: Complaint[] = [
  {
    id: '1',
    referenceNumber: 'MOJ-2018-JJG-00142',
    type: 'property',
    subject: 'Land Boundary Dispute',
    description: 'Dispute regarding the boundary of agricultural land between neighboring properties.',
    status: 'under_review',
    submittedAt: new Date('2026-03-25'),
    updatedAt: new Date('2026-03-28'),
    complainant: {
      fullName: 'Ahmed Mohammed',
      phone: '+251912345678',
      email: 'ahmed@example.com',
      kebele: '03',
      woreda: 'Jijiga',
      zone: 'Fafan',
    },
    timeline: [
      { date: new Date('2026-03-25'), status: 'pending', note: 'Complaint submitted' },
      { date: new Date('2026-03-26'), status: 'under_review', note: 'Assigned to review committee' },
    ],
    assignedTo: 'Review Committee A',
  },
  {
    id: '2',
    referenceNumber: 'MOJ-2018-JJG-00138',
    type: 'family',
    subject: 'Child Custody Dispute',
    description: 'Request for modification of child custody arrangement.',
    status: 'investigating',
    submittedAt: new Date('2026-03-20'),
    updatedAt: new Date('2026-03-27'),
    complainant: {
      fullName: 'Fatima Ali',
      phone: '+251923456789',
      kebele: '07',
      woreda: 'Jijiga',
      zone: 'Fafan',
    },
    timeline: [
      { date: new Date('2026-03-20'), status: 'pending', note: 'Complaint submitted' },
      { date: new Date('2026-03-21'), status: 'under_review', note: 'Initial review completed' },
      { date: new Date('2026-03-23'), status: 'investigating', note: 'Investigation started' },
    ],
    assignedTo: 'Family Law Division',
  },
  {
    id: '3',
    referenceNumber: 'MOJ-2018-JJG-00135',
    type: 'civil',
    subject: 'Contract Breach',
    description: 'Business partner failed to fulfill contractual obligations.',
    status: 'resolved',
    submittedAt: new Date('2026-03-10'),
    updatedAt: new Date('2026-03-25'),
    complainant: {
      fullName: 'Ibrahim Hassan',
      phone: '+251934567890',
      email: 'ibrahim@example.com',
      kebele: '02',
      woreda: 'Jijiga',
      zone: 'Fafan',
    },
    timeline: [
      { date: new Date('2026-03-10'), status: 'pending', note: 'Complaint submitted' },
      { date: new Date('2026-03-12'), status: 'under_review', note: 'Documents verified' },
      { date: new Date('2026-03-15'), status: 'investigating', note: 'Mediation scheduled' },
      { date: new Date('2026-03-25'), status: 'resolved', note: 'Settlement reached through mediation' },
    ],
  },
]

// Mock Cases Data
export const mockCases: CaseInfo[] = [
  {
    id: '1',
    caseNumber: 'CIV-2018-0234',
    title: 'Mohammed vs. Osman',
    type: 'Civil',
    status: 'Active',
    filedDate: new Date('2026-02-15'),
    nextHearing: new Date('2026-04-05'),
    courtRoom: 'Court Room 3',
    judge: 'Hon. Abdi Farah',
    parties: {
      plaintiff: 'Ahmed Mohammed',
      defendant: 'Hassan Osman',
    },
    timeline: [
      { date: new Date('2026-02-15'), event: 'Case Filed', description: 'Initial complaint filed' },
      { date: new Date('2026-02-20'), event: 'Summons Issued', description: 'Defendant summoned to appear' },
      { date: new Date('2026-03-10'), event: 'First Hearing', description: 'Preliminary hearing conducted' },
    ],
  },
  {
    id: '2',
    caseNumber: 'FAM-2018-0089',
    title: 'Ali vs. Ali',
    type: 'Family',
    status: 'Active',
    filedDate: new Date('2026-01-20'),
    nextHearing: new Date('2026-04-10'),
    courtRoom: 'Court Room 1',
    judge: 'Hon. Maryam Hussein',
    parties: {
      plaintiff: 'Fatima Ali',
      defendant: 'Omar Ali',
    },
    timeline: [
      { date: new Date('2026-01-20'), event: 'Case Filed', description: 'Divorce petition filed' },
      { date: new Date('2026-02-05'), event: 'Response Filed', description: 'Defendant response submitted' },
      { date: new Date('2026-03-01'), event: 'Mediation', description: 'Court-ordered mediation session' },
    ],
  },
]

// Dashboard Statistics
export const dashboardStats = {
  totalComplaints: 156,
  pendingCases: 42,
  resolvedCases: 98,
  avgResolutionDays: 14,
  complaintsTrend: [
    { month: 'Meskerem', count: 12 },
    { month: 'Tikimt', count: 18 },
    { month: 'Hidar', count: 15 },
    { month: 'Tahsas', count: 22 },
    { month: 'Tir', count: 19 },
    { month: 'Yekatit', count: 25 },
    { month: 'Megabit', count: 28 },
  ],
  complaintsByType: [
    { type: 'property', count: 45, percentage: 29 },
    { type: 'civil', count: 38, percentage: 24 },
    { type: 'family', count: 32, percentage: 21 },
    { type: 'employment', count: 18, percentage: 12 },
    { type: 'administrative', count: 15, percentage: 10 },
    { type: 'other', count: 8, percentage: 5 },
  ],
  recentActivity: [
    { id: '1', type: 'complaint_submitted', reference: 'MOJ-2018-JJG-00145', date: new Date('2026-03-31') },
    { id: '2', type: 'case_resolved', reference: 'CIV-2018-0230', date: new Date('2026-03-30') },
    { id: '3', type: 'hearing_scheduled', reference: 'FAM-2018-0092', date: new Date('2026-03-29') },
    { id: '4', type: 'complaint_submitted', reference: 'MOJ-2018-JJG-00144', date: new Date('2026-03-28') },
  ],
}

// Available Services
export const services: Service[] = [
  { id: '1', key: 'legalAid', icon: 'Scale', available: true, requirements: ['ID Card', 'Income Proof'] },
  { id: '2', key: 'notarization', icon: 'Stamp', available: true, requirements: ['Original Documents', 'ID Card'] },
  { id: '3', key: 'mediation', icon: 'Handshake', available: true, requirements: ['Application Form', 'ID Card'] },
  { id: '4', key: 'certificates', icon: 'FileText', available: true, requirements: ['Application Form', 'Fee Payment'] },
  { id: '5', key: 'consultation', icon: 'MessageSquare', available: true, requirements: ['Appointment Booking'] },
  { id: '6', key: 'documentation', icon: 'FolderOpen', available: true, requirements: ['Draft Documents', 'ID Card'] },
]

// Generate reference number
export function generateReferenceNumber(): string {
  const year = new Date().getFullYear() - 8 // Ethiopian year approximation
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0')
  return `MOJ-${year}-JJG-${random}`
}

// Get status color
export function getStatusColor(status: ComplaintStatus): string {
  const colors: Record<ComplaintStatus, string> = {
    pending: 'bg-warning/10 text-warning-foreground border-warning/20',
    under_review: 'bg-info/10 text-info-foreground border-info/20',
    investigating: 'bg-primary/10 text-primary border-primary/20',
    resolved: 'bg-success/10 text-success-foreground border-success/20',
    closed: 'bg-muted text-muted-foreground border-muted',
    rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  }
  return colors[status] || colors.pending
}

// Search complaint by reference
export function findComplaintByReference(reference: string): Complaint | undefined {
  return mockComplaints.find(c => c.referenceNumber.toLowerCase() === reference.toLowerCase())
}

// Search case by number
export function findCaseByNumber(caseNumber: string): CaseInfo | undefined {
  return mockCases.find(c => c.caseNumber.toLowerCase() === caseNumber.toLowerCase())
}
