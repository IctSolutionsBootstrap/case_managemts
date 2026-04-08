'use client'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { AppHeader } from '@/components/app-header'
import { ComplaintForm } from '@/components/complaints/complaint-form'
import { useI18n } from '@/lib/i18n/context'

export default function SubmitComplaintPage() {
  const { t } = useI18n()
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={t('complaints.submit')} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <ComplaintForm />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
