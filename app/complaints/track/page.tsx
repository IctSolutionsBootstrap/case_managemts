'use client'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { AppHeader } from '@/components/app-header'
import { ComplaintTracker } from '@/components/complaints/complaint-tracker'
import { useI18n } from '@/lib/i18n/context'

export default function TrackComplaintPage() {
  const { t } = useI18n()
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={t('complaints.track')} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <ComplaintTracker />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
