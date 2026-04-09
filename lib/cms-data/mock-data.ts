import type {
  CriminalCase,
  CrimeReport,
  Inmate,
  LegalDocument,
  Hearing,
  CrimeType,
  CaseStatus,
  LegalTimer,
} from './types'

// Helper to calculate remaining hours
function calculateRemainingHours(deadline: Date): number {
  const now = new Date()
  const diff = deadline.getTime() - now.getTime()
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60)))
}

// Helper to check if deadline is violated
function isDeadlineViolated(deadline: Date): boolean {
  return new Date() > deadline
}

// Create legal timer
function createLegalTimer(
  type: LegalTimer['type'],
  startTime: Date,
  hoursLimit: number
): LegalTimer {
  const deadline = new Date(startTime.getTime() + hoursLimit * 60 * 60 * 1000)
  return {
    type,
    timerType: type, // Safety alias
    startTime,
    deadline,
    maxHours: hoursLimit,
    isViolated: isDeadlineViolated(deadline),
    remainingHours: calculateRemainingHours(deadline),
  }
}

// ==========================================
// CRIMINAL CASES (Main Data)
// ==========================================
export const criminalCases: CriminalCase[] = [
  {
    id: 'case-001',
    caseNumber: 'JIG-2026-CR-0001',
    fir: {
      id: 'fir-001',
      firNumber: 'JIG-FIR-2026-0001',
      crimeType: 'theft',
      crimeDescription: 'Theft of livestock (5 goats) from a farm in Kebele 05',
      incidentDate: new Date('2026-04-01'),
      incidentLocation: 'Kebele 05, Jijiga Woreda',
      reportedBy: 'Farmer Abdi Yusuf',
      reporterType: 'victim',
      registeredBy: 'police-001',
      registeredAt: new Date('2026-04-01T10:00:00'),
      status: 'under_investigation',
    },
    suspects: [
      {
        id: 'suspect-001',
        caseId: 'case-001',
        fullName: 'Mahad Ali',
        fullNameAm: 'ማሃድ አሊ',
        age: 28,
        gender: 'male',
        address: 'Kebele 03, Jijiga',
        phone: '+251920111222',
        arrestDate: new Date('2026-04-02T14:30:00'),
        arrestLocation: 'Jijiga Market',
        isInCustody: true,
        custodyFacility: 'Jijiga Police Station',
      },
    ],
    evidence: [
      {
        id: 'evidence-001',
        caseId: 'case-001',
        type: 'physical',
        description: 'Recovered 3 goats matching description',
        collectedBy: 'police-001',
        collectedAt: new Date('2026-04-02T16:00:00'),
        location: 'Suspect residence',
        chainOfCustody: [
          { handledBy: 'Officer Abdi Mohammed', date: new Date('2026-04-02T16:00:00'), action: 'Collected at scene' },
          { handledBy: 'Evidence Room', date: new Date('2026-04-02T18:00:00'), action: 'Secured in evidence storage' },
        ],
        status: 'collected',
      },
      {
        id: 'evidence-002',
        caseId: 'case-001',
        type: 'testimonial',
        description: 'Witness saw suspect near the farm on incident date',
        collectedBy: 'police-001',
        collectedAt: new Date('2026-04-03T09:00:00'),
        location: 'Police Station',
        chainOfCustody: [
          { handledBy: 'Officer Abdi Mohammed', date: new Date('2026-04-03T09:00:00'), action: 'Recorded statement' },
        ],
        status: 'collected',
      },
    ],
    witnesses: [
      {
        id: 'witness-001',
        caseId: 'case-001',
        fullName: 'Nuradin Hassan',
        fullNameAm: 'ኑራዲን ሀሰን',
        phone: '+251921222333',
        address: 'Kebele 05, Jijiga',
        relationship: 'Neighbor of victim',
        statement: 'I saw a man matching the suspect description near the farm around 3 AM on April 1st.',
        statementDate: new Date('2026-04-03T09:00:00'),
        recordedBy: 'police-001',
      },
    ],
    remandCycles: [
      {
        id: 'remand-001',
        caseId: 'case-001',
        cycleNumber: 1,
        startDate: new Date('2026-04-04T10:00:00'),
        endDate: new Date('2026-04-18T10:00:00'),
        grantedBy: 'judge-001',
        reason: 'Ongoing investigation - need to recover remaining stolen livestock',
        status: 'active',
      },
    ],
    status: 'remand',
    currentStage: 'Police Investigation - Remand Period',
    assignedOfficer: 'police-001',
    legalTimers: [
      createLegalTimer('48_hour_appearance', new Date('2026-04-02T14:30:00'), 48),
      createLegalTimer('remand_14_day', new Date('2026-04-04T10:00:00'), 336), // 14 days = 336 hours
    ],
    timeline: [
      { date: new Date('2026-04-01T10:00:00'), event: 'Crime Reported', description: 'Victim reported theft of livestock', actor: 'Abdi Yusuf', actorRole: 'Victim' },
      { date: new Date('2026-04-01T10:30:00'), event: 'FIR Created', description: 'First Information Report registered', actor: 'Abdi Mohammed', actorRole: 'Police Officer' },
      { date: new Date('2026-04-02T14:30:00'), event: 'Suspect Arrested', description: 'Suspect apprehended at Jijiga Market', actor: 'Abdi Mohammed', actorRole: 'Police Officer' },
      { date: new Date('2026-04-02T16:00:00'), event: 'Evidence Collected', description: '3 goats recovered from suspect', actor: 'Abdi Mohammed', actorRole: 'Police Officer' },
      { date: new Date('2026-04-04T10:00:00'), event: 'First Court Appearance', description: 'Suspect presented to court within 48 hours', actor: 'Hon. Maryam Hussein', actorRole: 'Judge' },
      { date: new Date('2026-04-04T10:30:00'), event: 'Remand Granted', description: '14-day remand for investigation', actor: 'Hon. Maryam Hussein', actorRole: 'Judge' },
    ],
    hearings: [],
    createdAt: new Date('2026-04-01T10:00:00'),
    updatedAt: new Date('2026-04-04T10:30:00'),
  },
  {
    id: 'case-002',
    caseNumber: 'JIG-2026-CR-0002',
    fir: {
      id: 'fir-002',
      firNumber: 'JIG-FIR-2026-0002',
      crimeType: 'assault',
      crimeDescription: 'Aggravated assault causing grievous bodily harm',
      incidentDate: new Date('2026-03-25'),
      incidentLocation: 'Karamara District, Jijiga',
      reportedBy: 'Hospital Report',
      reporterType: 'witness',
      registeredBy: 'police-001',
      registeredAt: new Date('2026-03-25T18:00:00'),
      status: 'prosecution_review',
    },
    suspects: [
      {
        id: 'suspect-002',
        caseId: 'case-002',
        fullName: 'Ibrahim Farah',
        fullNameAm: 'ኢብራሂም ፋራህ',
        age: 35,
        gender: 'male',
        address: 'Karamara District',
        arrestDate: new Date('2026-03-25T20:00:00'),
        arrestLocation: 'Suspect home',
        isInCustody: true,
        custodyFacility: 'Jijiga Prison',
      },
    ],
    evidence: [
      {
        id: 'evidence-003',
        caseId: 'case-002',
        type: 'documentary',
        description: 'Medical report documenting injuries',
        collectedBy: 'police-001',
        collectedAt: new Date('2026-03-26T09:00:00'),
        location: 'Jijiga General Hospital',
        chainOfCustody: [
          { handledBy: 'Officer Abdi Mohammed', date: new Date('2026-03-26T09:00:00'), action: 'Obtained from hospital' },
        ],
        status: 'submitted',
      },
      {
        id: 'evidence-004',
        caseId: 'case-002',
        type: 'physical',
        description: 'Weapon used in assault (metal rod)',
        collectedBy: 'police-001',
        collectedAt: new Date('2026-03-25T21:00:00'),
        location: 'Crime scene',
        chainOfCustody: [
          { handledBy: 'Officer Abdi Mohammed', date: new Date('2026-03-25T21:00:00'), action: 'Secured from scene' },
          { handledBy: 'Forensics', date: new Date('2026-03-26T14:00:00'), action: 'Fingerprint analysis' },
        ],
        status: 'analyzed',
      },
    ],
    witnesses: [
      {
        id: 'witness-002',
        caseId: 'case-002',
        fullName: 'Amina Mohammed',
        fullNameAm: 'አሚና መሐመድ',
        phone: '+251922333444',
        address: 'Karamara District',
        relationship: 'Eyewitness',
        statement: 'I witnessed the assault. The suspect attacked the victim with a metal rod following an argument.',
        statementDate: new Date('2026-03-26T10:00:00'),
        recordedBy: 'police-001',
      },
    ],
    remandCycles: [
      {
        id: 'remand-002',
        caseId: 'case-002',
        cycleNumber: 1,
        startDate: new Date('2026-03-27T10:00:00'),
        endDate: new Date('2026-04-10T10:00:00'),
        grantedBy: 'judge-001',
        reason: 'Investigation and evidence collection',
        status: 'completed',
      },
    ],
    status: 'prosecution_review',
    currentStage: 'Prosecutor Review',
    assignedOfficer: 'police-001',
    assignedProsecutor: 'prosecutor-001',
    legalTimers: [
      createLegalTimer('prosecutor_15_day', new Date('2026-04-05T10:00:00'), 360), // 15 days = 360 hours
    ],
    timeline: [
      { date: new Date('2026-03-25T18:00:00'), event: 'Crime Reported', description: 'Hospital reported assault victim', actor: 'Hospital Staff', actorRole: 'Medical' },
      { date: new Date('2026-03-25T18:30:00'), event: 'FIR Created', description: 'First Information Report registered', actor: 'Abdi Mohammed', actorRole: 'Police Officer' },
      { date: new Date('2026-03-25T20:00:00'), event: 'Suspect Arrested', description: 'Suspect arrested at residence', actor: 'Abdi Mohammed', actorRole: 'Police Officer' },
      { date: new Date('2026-03-27T10:00:00'), event: 'First Court Appearance', description: 'Remand granted', actor: 'Hon. Maryam Hussein', actorRole: 'Judge' },
      { date: new Date('2026-04-05T10:00:00'), event: 'Submitted to Prosecution', description: 'Case file submitted for review', actor: 'Abdi Mohammed', actorRole: 'Police Officer' },
    ],
    hearings: [],
    createdAt: new Date('2026-03-25T18:00:00'),
    updatedAt: new Date('2026-04-05T10:00:00'),
  },
  {
    id: 'case-003',
    caseNumber: 'JIG-2026-CR-0003',
    fir: {
      id: 'fir-003',
      firNumber: 'JIG-FIR-2026-0003',
      crimeType: 'fraud',
      crimeDescription: 'Business fraud - embezzlement of company funds',
      incidentDate: new Date('2026-02-15'),
      incidentLocation: 'Jijiga City Center',
      reportedBy: 'Company Owner',
      reporterType: 'victim',
      registeredBy: 'police-001',
      registeredAt: new Date('2026-02-20T09:00:00'),
      status: 'trial',
    },
    suspects: [
      {
        id: 'suspect-003',
        caseId: 'case-003',
        fullName: 'Sahra Abdi',
        fullNameAm: 'ሳህራ አብዲ',
        age: 42,
        gender: 'female',
        address: 'Jijiga City',
        arrestDate: new Date('2026-02-22T11:00:00'),
        arrestLocation: 'Workplace',
        isInCustody: true,
        custodyFacility: 'Jijiga Prison',
      },
    ],
    evidence: [
      {
        id: 'evidence-005',
        caseId: 'case-003',
        type: 'documentary',
        description: 'Bank statements showing unauthorized transfers',
        collectedBy: 'police-001',
        collectedAt: new Date('2026-02-23T10:00:00'),
        location: 'Bank of Ethiopia - Jijiga Branch',
        chainOfCustody: [
          { handledBy: 'Officer Abdi Mohammed', date: new Date('2026-02-23T10:00:00'), action: 'Obtained from bank' },
        ],
        status: 'presented',
      },
    ],
    witnesses: [
      {
        id: 'witness-003',
        caseId: 'case-003',
        fullName: 'Yusuf Omar',
        fullNameAm: 'ዩሱፍ ኦማር',
        phone: '+251923444555',
        address: 'Jijiga City',
        relationship: 'Company Accountant',
        statement: 'I discovered discrepancies in the financial records that traced back to the suspect.',
        statementDate: new Date('2026-02-24T14:00:00'),
        recordedBy: 'police-001',
      },
    ],
    remandCycles: [],
    status: 'trial',
    currentStage: 'Court Trial',
    assignedOfficer: 'police-001',
    assignedProsecutor: 'prosecutor-001',
    assignedJudge: 'judge-001',
    assignedLawyer: 'lawyer-001',
    legalTimers: [],
    timeline: [
      { date: new Date('2026-02-20T09:00:00'), event: 'Crime Reported', description: 'Company reported fraud', actor: 'Company Owner', actorRole: 'Victim' },
      { date: new Date('2026-02-22T11:00:00'), event: 'Suspect Arrested', description: 'Suspect arrested at workplace', actor: 'Abdi Mohammed', actorRole: 'Police Officer' },
      { date: new Date('2026-03-01T10:00:00'), event: 'Prosecution Approved', description: 'Charges approved by prosecutor', actor: 'Fatima Ali Hassan', actorRole: 'Prosecutor' },
      { date: new Date('2026-03-05T09:00:00'), event: 'Charges Filed', description: 'Formal charges filed in court', actor: 'Fatima Ali Hassan', actorRole: 'Prosecutor' },
      { date: new Date('2026-03-15T10:00:00'), event: 'First Hearing', description: 'Preliminary hearing conducted', actor: 'Hon. Maryam Hussein', actorRole: 'Judge' },
      { date: new Date('2026-04-01T10:00:00'), event: 'Trial Session 1', description: 'First trial session - prosecution case', actor: 'Hon. Maryam Hussein', actorRole: 'Judge' },
    ],
    prosecutionDecision: 'approve',
    prosecutionNotes: 'Strong evidence of embezzlement. Recommend prosecution.',
    chargesFiledDate: new Date('2026-03-05T09:00:00'),
    charges: ['Embezzlement under Article 675 of Criminal Code', 'Breach of Trust under Article 676'],
    courtCaseNumber: 'JIG-COURT-2026-0045',
    courtName: 'Jijiga High Court',
    courtRoom: 'Court Room 2',
    hearings: [
      {
        id: 'hearing-001',
        caseId: 'case-003',
        hearingNumber: 1,
        scheduledDate: new Date('2026-03-15T10:00:00'),
        actualDate: new Date('2026-03-15T10:00:00'),
        type: 'preliminary',
        status: 'completed',
        notes: 'Defendant entered plea of not guilty',
        attendees: ['judge-001', 'prosecutor-001', 'lawyer-001', 'suspect-003'],
        nextHearingDate: new Date('2026-04-01T10:00:00'),
      },
      {
        id: 'hearing-002',
        caseId: 'case-003',
        hearingNumber: 2,
        scheduledDate: new Date('2026-04-01T10:00:00'),
        actualDate: new Date('2026-04-01T10:00:00'),
        type: 'trial',
        status: 'completed',
        notes: 'Prosecution presented evidence and witnesses',
        attendees: ['judge-001', 'prosecutor-001', 'lawyer-001', 'suspect-003'],
        nextHearingDate: new Date('2026-04-15T10:00:00'),
      },
      {
        id: 'hearing-003',
        caseId: 'case-003',
        hearingNumber: 3,
        scheduledDate: new Date('2026-04-15T10:00:00'),
        type: 'trial',
        status: 'scheduled',
        notes: 'Defense case presentation',
        attendees: ['judge-001', 'prosecutor-001', 'lawyer-001', 'suspect-003'],
      },
    ],
    createdAt: new Date('2026-02-20T09:00:00'),
    updatedAt: new Date('2026-04-01T12:00:00'),
  },
  {
    id: 'case-004',
    caseNumber: 'JIG-2025-CR-0089',
    fir: {
      id: 'fir-004',
      firNumber: 'JIG-FIR-2025-0089',
      crimeType: 'robbery',
      crimeDescription: 'Armed robbery at local shop',
      incidentDate: new Date('2025-11-10'),
      incidentLocation: 'Jijiga Central Market',
      reportedBy: 'Shop Owner',
      reporterType: 'victim',
      registeredBy: 'police-001',
      registeredAt: new Date('2025-11-10T16:00:00'),
      status: 'execution',
    },
    suspects: [
      {
        id: 'suspect-004',
        caseId: 'case-004',
        fullName: 'Abdullahi Hassan',
        fullNameAm: 'አብዱላሂ ሀሰን',
        age: 30,
        gender: 'male',
        address: 'Jijiga',
        arrestDate: new Date('2025-11-12T08:00:00'),
        arrestLocation: 'Hideout in outskirts',
        isInCustody: true,
        custodyFacility: 'Jijiga Correctional Facility',
      },
    ],
    evidence: [],
    witnesses: [],
    remandCycles: [],
    status: 'execution',
    currentStage: 'Serving Sentence',
    assignedOfficer: 'police-001',
    assignedProsecutor: 'prosecutor-001',
    assignedJudge: 'judge-001',
    legalTimers: [],
    timeline: [
      { date: new Date('2025-11-10T16:00:00'), event: 'Crime Reported', description: 'Armed robbery reported', actor: 'Shop Owner', actorRole: 'Victim' },
      { date: new Date('2025-11-12T08:00:00'), event: 'Suspect Arrested', description: 'Suspect captured', actor: 'Police Team', actorRole: 'Police' },
      { date: new Date('2025-12-15T10:00:00'), event: 'Trial Completed', description: 'Found guilty', actor: 'Hon. Maryam Hussein', actorRole: 'Judge' },
      { date: new Date('2025-12-20T10:00:00'), event: 'Sentencing', description: '3 years imprisonment', actor: 'Hon. Maryam Hussein', actorRole: 'Judge' },
      { date: new Date('2025-12-22T09:00:00'), event: 'Prison Admission', description: 'Transferred to correctional facility', actor: 'Omar Ibrahim', actorRole: 'Prison Officer' },
    ],
    prosecutionDecision: 'approve',
    chargesFiledDate: new Date('2025-11-25'),
    charges: ['Armed Robbery under Article 670'],
    courtCaseNumber: 'JIG-COURT-2025-0156',
    courtName: 'Jijiga High Court',
    verdict: 'convicted',
    sentence: '3 years imprisonment',
    sentenceDuration: 36,
    judgmentDate: new Date('2025-12-15'),
    judgmentNotes: 'Defendant found guilty beyond reasonable doubt. Evidence conclusive.',
    hearings: [],
    createdAt: new Date('2025-11-10'),
    updatedAt: new Date('2025-12-22'),
  },
  {
    id: 'case-005',
    caseNumber: 'JIG-2022-CR-0010',
    title: 'State vs Ibrahim Farah',
    fir: {
      id: 'fir-005',
      firNumber: 'JIG-FIR-2022-0010',
      crimeType: 'assault',
      crimeDescription: 'Public altercation and minor assault',
      incidentDate: new Date('2022-05-10'),
      incidentLocation: 'Jijiga Market',
      reportedBy: 'Bystander',
      reporterType: 'witness',
      registeredBy: 'police-001',
      registeredAt: new Date('2022-05-10T16:00:00'),
      status: 'execution',
    },
    suspects: [
      {
        id: 'suspect-002',
        caseId: 'case-005',
        fullName: 'Ibrahim Farah',
        fullNameAm: 'ኢብራሂም ፋራህ',
        age: 31,
        gender: 'male',
        address: 'Karamara District',
        arrestDate: new Date('2022-05-11T08:00:00'),
        arrestLocation: 'Residence',
        isInCustody: false,
        custodyFacility: '',
      },
    ],
    defendants: [
      { name: 'Ibrahim Farah', age: 31, gender: 'Male', address: 'Karamara District' }
    ],
    evidence: [],
    witnesses: [],
    remandCycles: [],
    status: 'serving_sentence',
    currentStage: 'Serving Sentence',
    assignedOfficer: 'police-001',
    assignedProsecutor: 'prosecutor-001',
    assignedJudge: 'judge-001',
    legalTimers: [],
    timeline: [],
    prosecutionDecision: 'approve',
    chargesFiledDate: new Date('2022-06-25'),
    charges: ['Simple Assault'],
    courtCaseNumber: 'JIG-COURT-2022-045',
    courtName: 'Jijiga High Court',
    verdict: 'convicted',
    sentence: '1 year imprisonment',
    sentenceDuration: 12,
    judgmentDate: new Date('2022-07-15'),
    createdAt: new Date('2022-05-10'),
    updatedAt: new Date('2022-07-15'),
  },
  {
    id: 'case-006',
    caseNumber: 'JIG-2019-CR-0422',
    title: 'Financial Irregularity Probe',
    fir: {
      id: 'fir-006',
      firNumber: 'JIG-FIR-2019-0422',
      crimeType: 'fraud',
      crimeDescription: 'Alleged misappropriation of micro-finance funds',
      incidentDate: new Date('2019-01-10'),
      incidentLocation: 'Jijiga',
      reportedBy: 'Audit Office',
      reporterType: 'victim',
      registeredBy: 'police-002',
      registeredAt: new Date('2019-01-10T16:00:00'),
      status: 'closed',
    },
    suspects: [
      {
        id: 'suspect-003',
        caseId: 'case-006',
        fullName: 'Sahra Abdi',
        fullNameAm: 'ሳህራ አብዲ',
        age: 35,
        gender: 'female',
        address: 'Jijiga City',
        arrestDate: new Date('2019-01-12T08:00:00'),
        arrestLocation: 'Bank',
        isInCustody: false,
        custodyFacility: '',
      },
    ],
    defendants: [
      { name: 'Sahra Abdi', age: 35, gender: 'Female', address: 'Jijiga City' }
    ],
    evidence: [],
    witnesses: [],
    remandCycles: [],
    status: 'dismissed',
    currentStage: 'Closed',
    assignedOfficer: 'police-002',
    assignedProsecutor: 'prosecutor-001',
    assignedJudge: 'judge-002',
    legalTimers: [],
    timeline: [],
    prosecutionDecision: 'reject',
    createdAt: new Date('2019-01-10'),
    updatedAt: new Date('2019-03-22'),
  }
]

// ==========================================
// CRIME REPORTS (Community Submissions)
// ==========================================
export const crimeReports: CrimeReport[] = [
  {
    id: 'report-001',
    reportNumber: 'JIG-RPT-2026-0012',
    crimeType: 'theft',
    description: 'Someone stole my motorcycle from outside the market',
    incidentDate: new Date('2026-04-07'),
    incidentLocation: 'Jijiga Main Market',
    isAnonymous: false,
    reporter: {
      fullName: 'Hassan Osman',
      phone: '+251918901234',
      email: 'hassan@example.com',
      address: 'Kebele 02, Jijiga',
    },
    status: 'acknowledged',
    submittedAt: new Date('2026-04-07T11:00:00'),
    acknowledgedAt: new Date('2026-04-07T14:00:00'),
  },
  {
    id: 'report-002',
    reportNumber: 'JIG-RPT-2026-0011',
    crimeType: 'domestic_violence',
    description: 'Hearing sounds of violence from neighboring house regularly',
    incidentDate: new Date('2026-04-05'),
    incidentLocation: 'Kebele 07',
    isAnonymous: true,
    status: 'converted_to_fir',
    submittedAt: new Date('2026-04-05T20:00:00'),
    acknowledgedAt: new Date('2026-04-06T08:00:00'),
    convertedFirId: 'fir-005',
  },
  {
    id: 'report-003',
    reportNumber: 'JIG-RPT-2026-0010',
    crimeType: 'drug_offense',
    description: 'Suspicious activities at abandoned building - possible drug dealing',
    incidentDate: new Date('2026-04-03'),
    incidentLocation: 'Behind Jijiga Stadium',
    isAnonymous: true,
    status: 'submitted',
    submittedAt: new Date('2026-04-03T22:00:00'),
  },
]

// ==========================================
// INMATES (Prison Data)
// ==========================================
export const inmates: Inmate[] = [
  {
    id: 'inmate-001',
    inmateNumber: 'JIG-INM-2025-0089',
    caseId: 'case-004',
    suspect: criminalCases[3].suspects[0],
    admissionDate: new Date('2025-12-22'),
    sentenceStartDate: new Date('2025-12-22'),
    sentenceEndDate: new Date('2028-12-22'),
    sentenceDurationMonths: 36,
    remainingDays: 990,
    facility: 'Jijiga Correctional Facility',
    cellBlock: 'Block A',
    status: 'serving',
    behavior: 'good',
    notes: 'Participating in vocational training program',
  },
  {
    id: 'inmate-002',
    inmateNumber: 'JIG-INM-2024-0045',
    caseId: 'case-old-001',
    suspect: {
      id: 'suspect-old-001',
      caseId: 'case-old-001',
      fullName: 'Yusuf Abdirahman',
      fullNameAm: 'ዩሱፍ አብዲራህማን',
      age: 45,
      gender: 'male',
      address: 'Jijiga',
      isInCustody: true,
      custodyFacility: 'Jijiga Correctional Facility',
    },
    admissionDate: new Date('2024-06-15'),
    sentenceStartDate: new Date('2024-06-15'),
    sentenceEndDate: new Date('2026-06-15'),
    sentenceDurationMonths: 24,
    remainingDays: 68,
    facility: 'Jijiga Correctional Facility',
    cellBlock: 'Block B',
    status: 'serving',
    behavior: 'good',
    notes: 'Eligible for early release review',
  },
  {
    id: 'inmate-003',
    inmateNumber: 'JIG-INM-2025-0112',
    caseId: 'case-old-002',
    suspect: {
      id: 'suspect-old-002',
      caseId: 'case-old-002',
      fullName: 'Ismail Mohammed',
      fullNameAm: 'ኢስማኢል መሐመድ',
      age: 28,
      gender: 'male',
      address: 'Fafan Zone',
      isInCustody: true,
      custodyFacility: 'Jijiga Correctional Facility',
    },
    admissionDate: new Date('2025-08-20'),
    sentenceStartDate: new Date('2025-08-20'),
    sentenceEndDate: new Date('2030-08-20'),
    sentenceDurationMonths: 60,
    remainingDays: 1595,
    facility: 'Jijiga Correctional Facility',
    cellBlock: 'Block C',
    status: 'serving',
    behavior: 'fair',
    notes: 'Attending rehabilitation programs',
  },
  {
    id: 'inmate-004',
    inmateNumber: 'JIG-INM-2023-0156',
    caseId: 'case-old-003',
    suspect: {
      id: 'suspect-old-003',
      caseId: 'case-old-003',
      fullName: 'Ahmed Barkhadle',
      fullNameAm: 'አህመድ ባርካድሌ',
      age: 32,
      gender: 'male',
      address: 'Jijiga',
      isInCustody: false,
    },
    admissionDate: new Date('2023-01-10'),
    sentenceStartDate: new Date('2023-01-10'),
    sentenceEndDate: new Date('2026-01-10'),
    sentenceDurationMonths: 36,
    remainingDays: 0,
    facility: 'Jijiga Correctional Facility',
    cellBlock: 'Released',
    status: 'released',
    releaseDate: new Date('2026-01-10'),
    behavior: 'good',
  },
  {
    id: 'inmate-005',
    inmateNumber: 'JIG-INM-2024-0022',
    caseId: 'case-old-004',
    suspect: {
      id: 'suspect-old-004',
      caseId: 'case-old-004',
      fullName: 'Fasika Solomon',
      fullNameAm: 'ፋሲካ ሰሎሞን',
      age: 26,
      gender: 'female',
      address: 'Addis Ababa',
      isInCustody: false,
    },
    admissionDate: new Date('2024-02-15'),
    sentenceStartDate: new Date('2024-02-15'),
    sentenceEndDate: new Date('2026-03-20'),
    sentenceDurationMonths: 24,
    remainingDays: 0,
    facility: 'Jijiga Correctional Facility',
    cellBlock: 'Released',
    status: 'released',
    releaseDate: new Date('2026-03-20'),
    behavior: 'good',
  },
]

// ==========================================
// LEGAL DOCUMENTS
// ==========================================
export const legalDocuments: LegalDocument[] = [
  {
    id: 'doc-001',
    caseId: 'case-001',
    type: 'fir',
    title: 'First Information Report - Livestock Theft',
    description: 'Initial FIR for livestock theft case',
    fileName: 'FIR-JIG-2026-0001.pdf',
    fileSize: 245000,
    uploadedBy: 'police-001',
    uploadedAt: new Date('2026-04-01T10:30:00'),
    verifiedBy: 'doc-001',
    verifiedAt: new Date('2026-04-01T11:00:00'),
    status: 'verified',
    version: 1,
    tags: ['fir', 'theft', 'livestock'],
  },
  {
    id: 'doc-002',
    caseId: 'case-002',
    type: 'evidence',
    title: 'Medical Report - Assault Victim',
    description: 'Medical examination report documenting injuries',
    fileName: 'MedicalReport-Case002.pdf',
    fileSize: 512000,
    uploadedBy: 'police-001',
    uploadedAt: new Date('2026-03-26T09:30:00'),
    verifiedBy: 'doc-001',
    verifiedAt: new Date('2026-03-26T10:00:00'),
    status: 'verified',
    version: 1,
    tags: ['medical', 'evidence', 'assault'],
  },
  {
    id: 'doc-003',
    caseId: 'case-003',
    type: 'charge_sheet',
    title: 'Charge Sheet - Embezzlement Case',
    description: 'Formal charges filed against defendant',
    fileName: 'ChargeSheet-Case003.pdf',
    fileSize: 389000,
    uploadedBy: 'prosecutor-001',
    uploadedAt: new Date('2026-03-05T09:00:00'),
    status: 'verified',
    version: 1,
    tags: ['charges', 'embezzlement', 'fraud'],
  },
  {
    id: 'doc-004',
    caseId: 'case-004',
    type: 'judgment',
    title: 'Judgment - Armed Robbery Case',
    description: 'Final judgment and sentencing order',
    fileName: 'Judgment-Case004.pdf',
    fileSize: 623000,
    uploadedBy: 'clerk-001',
    uploadedAt: new Date('2025-12-15T14:00:00'),
    verifiedBy: 'doc-001',
    verifiedAt: new Date('2025-12-15T15:00:00'),
    status: 'archived',
    version: 1,
    tags: ['judgment', 'robbery', 'sentencing'],
  },
]

// ==========================================
// STATISTICS & HELPERS
// ==========================================
export function getPoliceStats() {
  const activeCases = criminalCases.filter(c => 
    ['fir_created', 'under_investigation', 'first_appearance', 'remand'].includes(c.status)
  )
  const overdueTimers = criminalCases.flatMap(c => c.legalTimers).filter(t => t.isViolated)
  
  return {
    totalActiveCases: activeCases.length,
    pendingFIRs: criminalCases.filter(c => c.status === 'reported').length,
    underInvestigation: criminalCases.filter(c => c.status === 'under_investigation').length,
    inRemand: criminalCases.filter(c => c.status === 'remand').length,
    overdueDeadlines: overdueTimers.length,
    casesSubmittedThisMonth: 3,
    nearDeadlineCases: criminalCases.filter(c => 
      c.legalTimers.some(t => t.remainingHours > 0 && t.remainingHours <= 24)
    ).length,
  }
}

export function getProsecutorStats() {
  return {
    pendingReview: criminalCases.filter(c => c.status === 'prosecution_review').length,
    approvedThisMonth: 2,
    rejectedThisMonth: 0,
    requestedMoreInfo: 1,
    overdueReviews: criminalCases.filter(c => 
      c.status === 'prosecution_review' && 
      c.legalTimers.some(t => t.type === 'prosecutor_15_day' && t.isViolated)
    ).length,
    totalChargesFiled: criminalCases.filter(c => c.chargesFiledDate).length,
  }
}

export function getCourtStats() {
  const allHearings = criminalCases.flatMap(c => c.hearings)
  return {
    activeCases: criminalCases.filter(c => ['court_registered', 'trial'].includes(c.status)).length,
    scheduledHearings: allHearings.filter(h => h.status === 'scheduled').length,
    completedHearings: allHearings.filter(h => h.status === 'completed').length,
    postponedHearings: allHearings.filter(h => h.status === 'postponed').length,
    pendingJudgments: criminalCases.filter(c => c.status === 'trial' && !c.verdict).length,
    judgmentsThisMonth: 1,
  }
}

export function getPrisonStats() {
  return {
    totalInmates: inmates.length,
    newAdmissions: inmates.filter(i => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return i.admissionDate > thirtyDaysAgo
    }).length,
    upcomingReleases: inmates.filter(i => i.remainingDays <= 90 && i.status === 'serving').length,
    goodBehavior: inmates.filter(i => i.behavior === 'good').length,
    occupancyRate: 67,
  }
}

export function getBureauStats() {
  return {
    totalCases: criminalCases.length,
    resolvedCases: criminalCases.filter(c => ['closed', 'execution'].includes(c.status)).length,
    activeCases: criminalCases.filter(c => !['closed', 'execution'].includes(c.status)).length,
    complianceRate: 94,
    avgResolutionDays: 45,
    legalViolations: criminalCases.flatMap(c => c.legalTimers).filter(t => t.isViolated).length,
    crimeReports: crimeReports.length,
  }
}

// Get case by ID
export function getCaseById(id: string): CriminalCase | undefined {
  return criminalCases.find(c => c.id === id)
}

// Get cases by status
export function getCasesByStatus(status: CaseStatus): CriminalCase[] {
  return criminalCases.filter(c => c.status === status)
}

// Get cases assigned to user
export function getCasesForUser(userId: string, role: string): CriminalCase[] {
  switch (role) {
    case 'police':
      return criminalCases.filter(c => c.assignedOfficer === userId)
    case 'prosecutor':
      return criminalCases.filter(c => c.assignedProsecutor === userId)
    case 'judge':
      return criminalCases.filter(c => c.assignedJudge === userId)
    case 'lawyer':
      return criminalCases.filter(c => c.assignedLawyer === userId)
    default:
      return []
  }
}

// ==========================================
// MOCK USERS
// ==========================================
export const mockUsers = [
  { id: 'police-001', name: 'Ahmed Hassan', role: 'police', department: 'Investigation Unit' },
  { id: 'police-002', name: 'Abdi Mohammed', role: 'police', department: 'Patrol Unit' },
  { id: 'prosecutor-001', name: 'Fatima Abdi', role: 'prosecutor', department: 'Prosecution Office' },
  { id: 'prosecutor-002', name: 'Mohamed Yusuf', role: 'prosecutor', department: 'Prosecution Office' },
  { id: 'judge-001', name: 'Ibrahim Farah', role: 'judge', court: 'Jijiga High Court' },
  { id: 'judge-002', name: 'Amina Hassan', role: 'judge', court: 'Jijiga District Court' },
  { id: 'prison-001', name: 'Halima Omar', role: 'prison', facility: 'Jijiga Prison' },
  { id: 'lawyer-001', name: 'Omar Ali', role: 'lawyer', firm: 'Public Defender Office' },
  { id: 'bureau-001', name: 'Hassan Abdi', role: 'bureau_admin', department: 'Administration' },
]

// ==========================================
// MOCK HEARINGS
// ==========================================
export const mockHearings: Hearing[] = [
  {
    id: 'hearing-001',
    caseId: 'case-001',
    hearingType: 'preliminary',
    scheduledDate: new Date('2026-04-15T09:00:00'),
    courtRoom: 'Court Room A',
    judgeId: 'judge-001',
    status: 'scheduled',
    notes: 'Initial hearing for theft case',
  },
  {
    id: 'hearing-002',
    caseId: 'case-002',
    hearingType: 'trial',
    scheduledDate: new Date('2026-04-10T10:00:00'),
    courtRoom: 'Court Room B',
    judgeId: 'judge-002',
    status: 'completed',
    notes: 'Trial hearing completed',
    outcome: 'Guilty verdict issued',
  },
  {
    id: 'hearing-003',
    caseId: 'case-003',
    hearingType: 'sentencing',
    scheduledDate: new Date('2026-04-20T14:00:00'),
    courtRoom: 'Court Room A',
    judgeId: 'judge-001',
    status: 'scheduled',
    notes: 'Sentencing hearing',
  },
]

// ==========================================
// MOCK DOCUMENTS
// ==========================================
export const mockDocuments = [
  {
    id: 'doc-001',
    caseId: 'case-001',
    title: 'FIR Report',
    documentType: 'fir_report',
    uploadedBy: 'police-001',
    uploadedByRole: 'Police',
    uploadedAt: new Date('2026-04-01T10:30:00'),
    fileSize: '245 KB',
    isVerified: true,
  },
  {
    id: 'doc-002',
    caseId: 'case-001',
    title: 'Witness Statement - Eyewitness',
    documentType: 'witness_statement',
    uploadedBy: 'police-001',
    uploadedByRole: 'Police',
    uploadedAt: new Date('2026-04-03T09:15:00'),
    fileSize: '128 KB',
    isVerified: true,
  },
  {
    id: 'doc-003',
    caseId: 'case-002',
    title: 'Medical Report',
    documentType: 'medical_report',
    uploadedBy: 'prosecutor-001',
    uploadedByRole: 'Prosecutor',
    uploadedAt: new Date('2026-03-20T14:00:00'),
    fileSize: '512 KB',
    isVerified: true,
  },
  {
    id: 'doc-004',
    caseId: 'case-002',
    title: 'Charge Sheet',
    documentType: 'charge_sheet',
    uploadedBy: 'prosecutor-001',
    uploadedByRole: 'Prosecutor',
    uploadedAt: new Date('2026-03-22T11:00:00'),
    fileSize: '320 KB',
    isVerified: true,
  },
  {
    id: 'doc-005',
    caseId: 'case-003',
    title: 'Police Investigation Report',
    documentType: 'investigation_report',
    uploadedBy: 'police-002',
    uploadedByRole: 'Police',
    uploadedAt: new Date('2026-02-15T16:30:00'),
    fileSize: '890 KB',
    isVerified: true,
  },
  {
    id: 'doc-006',
    caseId: 'case-001',
    title: 'Post-Event Scene Photos',
    documentType: 'evidence_report',
    uploadedBy: 'police-001',
    uploadedByRole: 'Police',
    uploadedAt: new Date('2026-04-05T14:20:00'),
    fileSize: '4.2 MB',
    isVerified: false,
  },
  {
    id: 'doc-007',
    caseId: 'case-002',
    title: 'Additional Witness Statement',
    documentType: 'witness_statement',
    uploadedBy: 'prosecutor-001',
    uploadedByRole: 'Prosecutor',
    uploadedAt: new Date('2026-04-07T09:45:00'),
    fileSize: '156 KB',
    isVerified: false,
  },
  {
    id: 'doc-008',
    caseId: 'case-003',
    title: 'Expert Financial Analysis',
    documentType: 'evidence_report',
    uploadedBy: 'prosecutor-002',
    uploadedByRole: 'Prosecutor',
    uploadedAt: new Date('2026-04-08T11:10:00'),
    fileSize: '1.1 MB',
    isVerified: false,
  },
]

// ==========================================
// MOCK CASE TIMELINE
// ==========================================
export const mockCaseTimeline = [
  {
    id: 'timeline-001',
    caseId: 'case-001',
    eventType: 'fir_registered',
    description: 'FIR registered for theft of livestock',
    performedBy: 'police-001',
    performedByRole: 'Police',
    timestamp: new Date('2026-04-01T10:00:00'),
  },
  {
    id: 'timeline-002',
    caseId: 'case-001',
    eventType: 'investigation_started',
    description: 'Investigation initiated by Officer Ahmed Hassan',
    performedBy: 'police-001',
    performedByRole: 'Police',
    timestamp: new Date('2026-04-01T11:00:00'),
  },
  {
    id: 'timeline-003',
    caseId: 'case-001',
    eventType: 'evidence_collected',
    description: 'Physical evidence collected - 3 goats recovered',
    performedBy: 'police-001',
    performedByRole: 'Police',
    timestamp: new Date('2026-04-02T16:00:00'),
  },
  {
    id: 'timeline-004',
    caseId: 'case-002',
    eventType: 'fir_registered',
    description: 'FIR registered for assault case',
    performedBy: 'police-002',
    performedByRole: 'Police',
    timestamp: new Date('2026-03-15T08:00:00'),
  },
  {
    id: 'timeline-005',
    caseId: 'case-002',
    eventType: 'sent_to_prosecutor',
    description: 'Case file sent to Prosecution Office',
    performedBy: 'police-002',
    performedByRole: 'Police',
    timestamp: new Date('2026-03-18T14:00:00'),
  },
  {
    id: 'timeline-006',
    caseId: 'case-002',
    eventType: 'charges_filed',
    description: 'Charges filed against defendant',
    performedBy: 'prosecutor-001',
    performedByRole: 'Prosecutor',
    timestamp: new Date('2026-03-22T11:00:00'),
  },
  {
    id: 'timeline-007',
    caseId: 'case-002',
    eventType: 'trial_started',
    description: 'Trial commenced at Jijiga District Court',
    performedBy: 'judge-002',
    performedByRole: 'Judge',
    timestamp: new Date('2026-04-10T10:00:00'),
  },
]

// ==========================================
// ALIAS EXPORTS (for backward compatibility)
// ==========================================
// Flattened view of cases for pages that expect simpler structure
export const mockCases = criminalCases.map(c => ({
  ...c,
  title: c.fir.crimeDescription.substring(0, 60) + (c.fir.crimeDescription.length > 60 ? '...' : ''),
  description: c.fir.crimeDescription,
  crimeType: c.fir.crimeType,
  location: c.fir.incidentLocation,
  district: c.fir.incidentLocation.split(',')[0] || 'Jijiga',
  priority: c.legalTimers.some(t => t.isViolated) ? 'urgent' : 
            c.legalTimers.some(t => t.remainingHours < 24) ? 'high' : 'normal',
  isPublic: ['awaiting_trial', 'in_trial', 'sentenced', 'execution'].includes(c.status),
  assignedPoliceId: c.assignedOfficer,
  assignedProsecutorId: c.assignedProsecutor,
  assignedJudgeId: c.assignedJudge,
  assignedLawyerId: c.assignedLawyer,
}))
