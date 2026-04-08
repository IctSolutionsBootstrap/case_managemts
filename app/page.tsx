'use client'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { AppHeader } from '@/components/app-header'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { useI18n } from '@/lib/i18n/context'

export default function DashboardPage() {
  const { t } = useI18n()
  
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
