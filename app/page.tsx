'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { AppHeader } from '@/components/app-header'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { useI18n } from '@/lib/i18n/context'

export default function HomePage() {
  const { t } = useI18n()
  const { user, isLoading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    } else if (!isLoading && user) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-foreground mx-auto mb-4"></div>
          <p className="text-primary-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If no user, show a brief landing before redirect
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-foreground mb-2">
            Jijiga Regional Bureau of Justice
          </h1>
          <p className="text-primary-foreground/80">Case Management System</p>
          <p className="text-primary-foreground/60 mt-4">Redirecting to login...</p>
        </div>
      </div>
    )
  }
  
  // Fallback view (should redirect)
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={t('nav.dashboard')} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <DashboardContent />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
