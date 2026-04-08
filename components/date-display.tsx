'use client'

import { useI18n } from '@/lib/i18n/context'
import { formatCurrentDate, getCurrentEthiopianDate, formatEthiopianDate } from '@/lib/ethiopian-calendar'
import { Calendar } from 'lucide-react'

export function DateDisplay() {
  const { locale, config } = useI18n()
  const ethDate = getCurrentEthiopianDate()
  const formattedEthiopian = formatEthiopianDate(ethDate, locale, 'full')
  
  const gregorianDate = new Date().toLocaleDateString(locale === 'am' ? 'am-ET' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Calendar className="size-4" />
      <div className="flex flex-col sm:flex-row sm:gap-2">
        {config.calendarType === 'ethiopian' ? (
          <>
            <span className="font-medium text-foreground">{formattedEthiopian}</span>
            <span className="hidden sm:inline text-muted-foreground/60">|</span>
            <span className="text-xs sm:text-sm">{gregorianDate}</span>
          </>
        ) : (
          <>
            <span className="font-medium text-foreground">{gregorianDate}</span>
            <span className="hidden sm:inline text-muted-foreground/60">|</span>
            <span className="text-xs sm:text-sm">{formattedEthiopian}</span>
          </>
        )}
      </div>
    </div>
  )
}

export function CompactDateDisplay() {
  const { locale, config } = useI18n()
  const ethDate = getCurrentEthiopianDate()
  const formattedEthiopian = formatEthiopianDate(ethDate, locale, 'long')

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Calendar className="size-3.5" />
      <span>{formattedEthiopian}</span>
    </div>
  )
}
