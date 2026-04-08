'use client'

import { Bell, Menu } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DateDisplay } from '@/components/date-display'
import { useAuth } from '@/lib/auth/context'
import { useI18n } from '@/lib/i18n/context'
import { roleDisplayNames } from '@/lib/auth/types'

interface DashboardHeaderProps {
  title?: string
  titleAm?: string
}

export function DashboardHeader({ title, titleAm }: DashboardHeaderProps) {
  const { user } = useAuth()
  const { locale } = useI18n()

  const displayTitle = locale === 'am' && titleAm ? titleAm : title

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1">
          <Menu className="size-5" />
        </SidebarTrigger>
        <Separator orientation="vertical" className="h-6" />
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {displayTitle || (locale === 'am' ? 'ዳሽቦርድ' : 'Dashboard')}
          </h1>
          {user && (
            <p className="text-xs text-muted-foreground">
              {roleDisplayNames[user.role][locale === 'am' ? 'am' : 'en']}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <DateDisplay />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          <Badge className="absolute -right-1 -top-1 size-5 rounded-full p-0 text-xs">
            3
          </Badge>
        </Button>
      </div>
    </header>
  )
}
