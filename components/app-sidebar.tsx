'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Send,
  Search,
  Briefcase,
  Phone,
  Globe,
  Scale,
  ChevronDown,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useI18n } from '@/lib/i18n/context'

const mainNavItems = [
  {
    titleKey: 'nav.dashboard' as const,
    href: '/',
    icon: LayoutDashboard,
  },
]

const complaintsNavItems = [
  {
    titleKey: 'nav.submitComplaint' as const,
    href: '/complaints/submit',
    icon: Send,
  },
  {
    titleKey: 'nav.trackComplaint' as const,
    href: '/complaints/track',
    icon: Search,
  },
]

const servicesNavItems = [
  {
    titleKey: 'nav.services' as const,
    href: '/services',
    icon: Briefcase,
  },
  {
    titleKey: 'nav.caseTracking' as const,
    href: '/cases',
    icon: FileText,
  },
]

const infoNavItems = [
  {
    titleKey: 'nav.contact' as const,
    href: '/contact',
    icon: Phone,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { t, locale, setLocale } = useI18n()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
            <Scale className="size-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">
              {locale === 'am' ? 'ፍ/ሚ' : 'MOJ'}
            </span>
            <span className="text-xs text-muted-foreground">
              {locale === 'am' ? 'ጅጅጋ' : 'Jijiga'}
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    className="h-10"
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" />
                      <span>{t(item.titleKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                {t('nav.complaints')}
                <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {complaintsNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.href)}
                        className="h-10"
                      >
                        <Link href={item.href}>
                          <item.icon className="size-5" />
                          <span>{t(item.titleKey)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t('nav.services')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {servicesNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    className="h-10"
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" />
                      <span>{t(item.titleKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{locale === 'am' ? 'መረጃ' : 'Information'}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {infoNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    className="h-10"
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" />
                      <span>{t(item.titleKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="size-4" />
            <span>{t('nav.language')}</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setLocale('am')}
              className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
                locale === 'am'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              አማ
            </button>
            <button
              onClick={() => setLocale('en')}
              className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
                locale === 'en'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
