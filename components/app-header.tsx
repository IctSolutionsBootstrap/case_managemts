'use client'

import { Calendar, Menu } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useI18n } from '@/lib/i18n/context'
import { formatCurrentDate, getCurrentEthiopianDate, formatEthiopianDate } from '@/lib/ethiopian-calendar'

interface AppHeaderProps {
  title: string
}

export function AppHeader({ title }: AppHeaderProps) {
  const { locale } = useI18n()
  
  const ethDate = getCurrentEthiopianDate()
  const formattedEthDate = formatEthiopianDate(ethDate, locale === 'am' ? 'am' : 'en', 'long')
  
  const today = new Date()
  const gregorianDate = today.toLocaleDateString(locale === 'am' ? 'am-ET' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
          <Calendar className="size-4" />
          <div className="flex flex-col items-end">
            <span className="font-medium text-foreground">{formattedEthDate}</span>
            <span className="text-xs">{gregorianDate}</span>
          </div>
        </div>
        
        <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
          {locale === 'am' ? 'እ' : 'G'}
        </div>
      </div>
    </header>
  )
}
