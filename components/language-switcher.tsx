'use client'

import { useI18n } from '@/lib/i18n/context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const { locale, setLocale, config } = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="size-4" />
          <span className="hidden sm:inline">{config.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setLocale('am')}
          className={locale === 'am' ? 'bg-accent' : ''}
        >
          <span className="mr-2">አማ</span>
          አማርኛ
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale('en')}
          className={locale === 'en' ? 'bg-accent' : ''}
        >
          <span className="mr-2">EN</span>
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale('so')}
          className={locale === 'so' ? 'bg-accent' : ''}
        >
          <span className="mr-2">SO</span>
          Soomaali
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
