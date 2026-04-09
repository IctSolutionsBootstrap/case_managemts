// User roles based on the business workflow
export type UserRole = 
  | 'police'
  | 'prosecutor' 
  | 'judge'
  | 'court_clerk'
  | 'prison'
  | 'document_officer'
  | 'lawyer'
  | 'community'
  | 'bureau_admin'

export interface User {
  id: string
  email: string
  password: string // In a real app, this would be hashed
  fullName: string
  fullNameAm: string // Amharic name
  role: UserRole
  department?: string
  badge?: string
  avatar?: string
  phone: string
  createdAt: Date
  isActive: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Role display names
export const roleDisplayNames: Record<UserRole, { en: string; am: string }> = {
  police: { en: 'Police Officer', am: 'የፖሊስ መኮንን' },
  prosecutor: { en: 'Prosecutor', am: 'ዓቃቤ ህግ' },
  judge: { en: 'Judge', am: 'ዳኛ' },
  court_clerk: { en: 'Court Clerk', am: 'የፍርድ ቤት ፀሐፊ' },
  prison: { en: 'Prison Officer', am: 'የማረሚያ መኮንን' },
  document_officer: { en: 'Document Officer', am: 'የሰነድ ባለሙያ' },
  lawyer: { en: 'Lawyer', am: 'ጠበቃ' },
  community: { en: 'Community Member', am: 'የማህበረሰብ አባል' },
  bureau_admin: { en: 'Bureau Administrator', am: 'የቢሮ አስተዳዳሪ' },
}

// Role permissions for navigation
export const rolePermissions: Record<UserRole, string[]> = {
  police: ['dashboard', 'fir', 'cases', 'evidence', 'suspects', 'witnesses', 'legal-timer'],
  prosecutor: ['dashboard', 'cases', 'review', 'charges', 'legal-timer'],
  judge: ['dashboard', 'court-cases', 'hearings', 'judgments', 'appeals'],
  court_clerk: ['dashboard', 'court-cases', 'scheduling', 'documents'],
  prison: ['dashboard', 'inmates', 'sentences', 'releases'],
  document_officer: ['dashboard', 'documents', 'archive', 'verification'],
  lawyer: ['dashboard', 'my-cases', 'hearings', 'documents'],
  community: ['report-crime', 'track-case', 'services'],
  bureau_admin: ['dashboard', 'reports', 'analytics', 'users', 'compliance'],
}
