// Case Management System Types based on Ethiopian Legal System

// Case Status through the workflow
export type CaseStatus = 
  | 'reported'           // Initial crime report
  | 'fir_created'        // FIR registered by police
  | 'under_investigation'
  | 'first_appearance'   // 48-hour court appearance
  | 'remand'             // Police remand (14 days max per session)
  | 'submitted_to_prosecution'
  | 'prosecution_review'
  | 'charges_filed'
  | 'court_registered'
  | 'trial'
  | 'judgment'
  | 'appeal'
  | 'execution'          // Prison/sentence execution
  | 'closed'

export type CrimeType = 
  | 'theft'
  | 'assault'
  | 'fraud'
  | 'robbery'
  | 'murder'
  | 'domestic_violence'
  | 'drug_offense'
  | 'property_crime'
  | 'traffic_offense'
  | 'corruption'
  | 'other'

export type Verdict = 'convicted' | 'acquitted' | 'dismissed' | 'pending'

// Legal Timeline Tracking (Ethiopian Law)
export interface LegalTimer {
  type: '48_hour_appearance' | 'remand_14_day' | 'prosecutor_15_day'
  timerType?: string // legacy alias for type to prevent crashes
  startTime: Date
  deadline: Date
  maxHours: number // Added for progress calculation
  isViolated: boolean
  remainingHours: number
}

// First Information Report (FIR)
export interface FIR {
  id: string
  firNumber: string
  crimeType: CrimeType
  crimeDescription: string
  incidentDate: Date
  incidentLocation: string
  reportedBy: string
  reporterType: 'victim' | 'witness' | 'police' | 'anonymous'
  registeredBy: string // Police officer ID
  registeredAt: Date
  status: CaseStatus
}

// Suspect Information
export interface Suspect {
  id: string
  caseId: string
  fullName: string
  fullNameAm: string
  age: number
  gender: 'male' | 'female'
  address: string
  phone?: string
  idNumber?: string
  arrestDate?: Date
  arrestLocation?: string
  isInCustody: boolean
  custodyFacility?: string
  photo?: string
}

// Evidence
export interface Evidence {
  id: string
  caseId: string
  type: 'physical' | 'documentary' | 'digital' | 'testimonial'
  description: string
  collectedBy: string
  collectedAt: Date
  location: string
  chainOfCustody: Array<{
    handledBy: string
    date: Date
    action: string
  }>
  status: 'collected' | 'analyzed' | 'submitted' | 'presented'
  attachments?: string[]
}

// Witness
export interface Witness {
  id: string
  caseId: string
  fullName: string
  fullNameAm: string
  phone: string
  address: string
  relationship: string
  statement: string
  statementDate: Date
  recordedBy: string
}

// Remand Cycle
export interface RemandCycle {
  id: string
  caseId: string
  cycleNumber: number
  startDate: Date
  endDate: Date
  grantedBy: string // Judge ID
  reason: string
  status: 'active' | 'extended' | 'completed'
}

// Main Case Record
export interface CriminalCase {
  id: string
  caseNumber: string
  fir: FIR
  suspects: Suspect[]
  evidence: Evidence[]
  witnesses: Witness[]
  remandCycles: RemandCycle[]
  
  // Current Status
  status: CaseStatus
  currentStage: string
  assignedOfficer?: string // Police
  assignedProsecutor?: string
  assignedJudge?: string
  assignedLawyer?: string
  
  // Legal Timers
  legalTimers: LegalTimer[]
  
  // Timeline
  timeline: Array<{
    date: Date
    event: string
    description: string
    actor: string
    actorRole: string
  }>
  
  // Prosecution
  prosecutionDecision?: 'approve' | 'reject' | 'request_info'
  prosecutionNotes?: string
  chargesFiledDate?: Date
  charges?: string[]
  
  // Court
  courtCaseNumber?: string
  courtName?: string
  courtRoom?: string
  hearings: Hearing[]
  
  // Judgment
  verdict?: Verdict
  sentence?: string
  sentenceDuration?: number // months
  judgmentDate?: Date
  judgmentNotes?: string
  
  // Appeal
  appealFiled?: boolean
  appealDate?: Date
  appealStatus?: string
  
  // Dates
  createdAt: Date
  updatedAt: Date
}

// Court Hearing
export interface Hearing {
  id: string
  caseId: string
  hearingNumber: number
  scheduledDate: Date
  actualDate?: Date
  type: 'preliminary' | 'trial' | 'sentencing' | 'appeal'
  status: 'scheduled' | 'completed' | 'postponed' | 'cancelled'
  notes?: string
  attendees: string[]
  nextHearingDate?: Date
}

// Inmate Record (Prison)
export interface Inmate {
  id: string
  inmateNumber: string
  caseId: string
  suspect: Suspect
  admissionDate: Date
  sentenceStartDate: Date
  sentenceEndDate: Date
  sentenceDurationMonths: number
  remainingDays: number
  facility: string
  cellBlock: string
  status: 'serving' | 'released' | 'transferred' | 'deceased'
  releaseDate?: Date
  releaseType?: 'completed' | 'parole' | 'pardon' | 'appeal_granted'
  behavior: 'good' | 'fair' | 'poor'
  notes?: string
}

// Crime Report (Community Submission)
export interface CrimeReport {
  id: string
  reportNumber: string
  crimeType: CrimeType
  description: string
  incidentDate: Date
  incidentLocation: string
  isAnonymous: boolean
  reporter?: {
    fullName: string
    phone: string
    email?: string
    address: string
  }
  status: 'submitted' | 'acknowledged' | 'converted_to_fir' | 'rejected'
  submittedAt: Date
  acknowledgedAt?: Date
  convertedFirId?: string
  rejectionReason?: string
}

// Document Record
export interface LegalDocument {
  id: string
  caseId?: string
  type: 'fir' | 'evidence' | 'statement' | 'charge_sheet' | 'court_order' | 'judgment' | 'appeal' | 'other'
  title: string
  description: string
  fileName: string
  fileSize: number
  uploadedBy: string
  uploadedAt: Date
  verifiedBy?: string
  verifiedAt?: Date
  status: 'draft' | 'submitted' | 'verified' | 'archived'
  version: number
  tags: string[]
}

// Hearing
export interface Hearing {
  id: string
  caseId: string
  hearingType: 'preliminary' | 'trial' | 'sentencing' | 'appeal' | 'bail'
  scheduledDate: Date
  courtRoom: string
  judgeId: string
  status: 'scheduled' | 'completed' | 'postponed' | 'cancelled'
  notes?: string
  outcome?: string
}

// Dashboard Statistics
export interface DashboardStats {
  totalCases: number
  activeCases: number
  pendingReview: number
  overdueDeadlines: number
  resolvedThisMonth: number
  avgResolutionDays: number
}
