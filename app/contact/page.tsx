'use client'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { AppHeader } from '@/components/app-header'
import { ContactContent } from '@/components/contact/contact-content'
import { useI18n } from '@/lib/i18n/context'

export default function ContactPage() {
  const { t } = useI18n()
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={t('contact.title')} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <ContactContent />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
