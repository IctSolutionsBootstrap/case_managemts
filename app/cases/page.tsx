'use client'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { AppHeader } from '@/components/app-header'
import { CaseTracker } from '@/components/cases/case-tracker'
import { useI18n } from '@/lib/i18n/context'

export default function CasesPage() {
  const { t } = useI18n()
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={t('caseTracking.title')} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <CaseTracker />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
