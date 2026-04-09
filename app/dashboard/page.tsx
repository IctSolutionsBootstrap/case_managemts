'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { PoliceDashboard } from '@/components/dashboards/police-dashboard'
import { ProsecutorDashboard } from '@/components/dashboards/prosecutor-dashboard'
import { JudgeDashboard } from '@/components/dashboards/judge-dashboard'
import { PrisonDashboard } from '@/components/dashboards/prison-dashboard'
import { LawyerDashboard } from '@/components/dashboards/lawyer-dashboard'
import { CommunityDashboard } from '@/components/dashboards/community-dashboard'
import { BureauDashboard } from '@/components/dashboards/bureau-dashboard'
import { DocumentOfficerDashboard } from '@/components/dashboards/document-officer-dashboard'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  // Render dashboard based on user role
  switch (user.role) {
    case 'police':
      return <PoliceDashboard />
    case 'prosecutor':
      return <ProsecutorDashboard />
    case 'judge':
      return <JudgeDashboard />
    case 'prison':
      return <PrisonDashboard />
    case 'lawyer':
      return <LawyerDashboard />
    case 'community':
      return <CommunityDashboard />
    case 'bureau_admin':
      return <BureauDashboard />
    case 'document_officer':
      return <DocumentOfficerDashboard />
    default:
      return <CommunityDashboard />
  }
}
