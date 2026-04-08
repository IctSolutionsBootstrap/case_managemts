import type { User } from './types'

// Demo users for each role - Use these credentials to test the system
export const demoUsers: User[] = [
  {
    id: 'police-001',
    email: 'police@demo.com',
    password: 'demo123',
    fullName: 'Abdi Mohammed',
    fullNameAm: 'አብዲ መሐመድ',
    role: 'police',
    department: 'Jijiga Police Station',
    badge: 'JIG-POL-2018',
    phone: '+251911234567',
    createdAt: new Date('2024-01-15'),
    isActive: true,
  },
  {
    id: 'prosecutor-001',
    email: 'prosecutor@demo.com',
    password: 'demo123',
    fullName: 'Fatima Ali Hassan',
    fullNameAm: 'ፋጢማ አሊ ሀሰን',
    role: 'prosecutor',
    department: 'Jijiga Prosecution Office',
    badge: 'JIG-PRO-2016',
    phone: '+251912345678',
    createdAt: new Date('2024-01-15'),
    isActive: true,
  },
  {
    id: 'judge-001',
    email: 'judge@demo.com',
    password: 'demo123',
    fullName: 'Hon. Maryam Hussein',
    fullNameAm: 'ክብርት ማርያም ሁሴን',
    role: 'judge',
    department: 'Jijiga High Court',
    badge: 'JIG-JDG-2012',
    phone: '+251913456789',
    createdAt: new Date('2024-01-15'),
    isActive: true,
  },
  {
    id: 'clerk-001',
    email: 'clerk@demo.com',
    password: 'demo123',
    fullName: 'Ahmed Yusuf',
    fullNameAm: 'አህመድ ዩሱፍ',
    role: 'court_clerk',
    department: 'Jijiga High Court',
    badge: 'JIG-CLK-2020',
    phone: '+251914567890',
    createdAt: new Date('2024-01-15'),
    isActive: true,
  },
  {
    id: 'prison-001',
    email: 'prison@demo.com',
    password: 'demo123',
    fullName: 'Omar Ibrahim',
    fullNameAm: 'ኦማር ኢብራሂም',
    role: 'prison',
    department: 'Jijiga Correctional Facility',
    badge: 'JIG-PRS-2019',
    phone: '+251915678901',
    createdAt: new Date('2024-01-15'),
    isActive: true,
  },
  {
    id: 'doc-001',
    email: 'document@demo.com',
    password: 'demo123',
    fullName: 'Hawa Mohammed',
    fullNameAm: 'ሃዋ መሐመድ',
    role: 'document_officer',
    department: 'Document Management Division',
    badge: 'JIG-DOC-2021',
    phone: '+251916789012',
    createdAt: new Date('2024-01-15'),
    isActive: true,
  },
  {
    id: 'lawyer-001',
    email: 'lawyer@demo.com',
    password: 'demo123',
    fullName: 'Yusuf Abdi Warsame',
    fullNameAm: 'ዩሱፍ አብዲ ዋርሳሜ',
    role: 'lawyer',
    department: 'Private Practice',
    badge: 'ETH-BAR-3456',
    phone: '+251917890123',
    createdAt: new Date('2024-01-15'),
    isActive: true,
  },
  {
    id: 'community-001',
    email: 'citizen@demo.com',
    password: 'demo123',
    fullName: 'Hassan Osman',
    fullNameAm: 'ሀሰን ኦስማን',
    role: 'community',
    phone: '+251918901234',
    createdAt: new Date('2024-01-15'),
    isActive: true,
  },
  {
    id: 'admin-001',
    email: 'admin@demo.com',
    password: 'demo123',
    fullName: 'Khadija Ahmed',
    fullNameAm: 'ሀዲጃ አህመድ',
    role: 'bureau_admin',
    department: 'Ministry of Justice - Jijiga Bureau',
    badge: 'JIG-ADM-2015',
    phone: '+251919012345',
    createdAt: new Date('2024-01-15'),
    isActive: true,
  },
]

// Find user by credentials
export function authenticateUser(email: string, password: string): User | null {
  const user = demoUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  return user || null
}

// Get user by ID
export function getUserById(id: string): User | null {
  return demoUsers.find((u) => u.id === id) || null
}
